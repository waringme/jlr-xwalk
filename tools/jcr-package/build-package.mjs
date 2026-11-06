#!/usr/bin/env node
/*
 * Build an AEM (xwalk) FileVault content package from the imported pages in content/**.plain.html
 * plus their images.
 *
 *   node tools/jcr-package/build-package.mjs [--version 1.0.0] [--no-assets] [--concurrency 8]
 *
 * Pages:  html2md + md2jcr (the converters the AEM import uses) → jcr_root/content/jlr-xwalk/<path>/.content.xml
 * Assets: every http(s) <img> is downloaded once → jcr_root/content/dam/jlr-xwalk/media/… as dam:Asset
 *         (renditions/original); the page references the DAM path.
 * Links:  root-relative and https://media.jlr.com links to in-scope en-gb paths → /content/jlr-xwalk/<path>.
 * Output: tools/jcr-package/dist/jlr-xwalk-content-<version>.zip, plus build-report.json.
 * Downloads are cached in tools/jcr-package/.cache/ so a re-run only fetches what is missing.
 */
import { createRequire } from 'node:module';
import {
  readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, rmSync,
} from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('usage: node tools/jcr-package/build-package.mjs [--version 1.0.0] [--no-assets] [--concurrency 8]');
  process.exit(0);
}
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const VERSION = opt('--version', '1.0.0');
const ASSETS = !args.includes('--no-assets');
const CONCURRENCY = Number(opt('--concurrency', 8));

const SITE = '/content/jlr-xwalk';
const DAM = '/content/dam/jlr-xwalk';
const SOURCE_HOST = 'media.jlr.com';
const ROOT = 'tools/jcr-package';
const BUILD = join(ROOT, 'build');
const CACHE = join(ROOT, '.cache');
const DIST = join(ROOT, 'dist');
const JCR = join(BUILD, 'jcr_root');

const CONVERTERS = '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts/package.json';
const req = createRequire(CONVERTERS);
const { html2md } = await import(req.resolve('@adobe/helix-html2md'));
const { md2jcr } = await import(req.resolve('@adobe/helix-md2jcr'));
const SILENT = {
  info() {}, warn() {}, error() {}, debug() {}, log() {},
};

const models = {};
for (const k of ['models', 'definition', 'filters']) models[k] = JSON.parse(readFileSync(`component-${k}.json`, 'utf8'));

// ---------- pages ----------
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.plain.html')) out.push(p);
  }
  return out;
}
const pageFiles = walk('content').sort();
const pagePaths = pageFiles.map((f) => f.slice('content/'.length, -'.plain.html'.length));

const isInScope = (path) => /^\/[^/]+\/en-gb(\/|$)/.test(path) || /^\/en-gb(\/|$)/.test(path);
function localizeHref(href) {
  let path = null;
  if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/content/')) path = href;
  else {
    try {
      const u = new URL(href);
      if (u.hostname === SOURCE_HOST) path = u.pathname + u.search + u.hash;
    } catch { /* not a URL */ }
  }
  if (!path) return href;
  const pathname = path.split(/[?#]/)[0].replace(/\/$/, '');
  if (!isInScope(pathname)) return href;
  return SITE + path.replace(/\/(?=[?#]|$)/, '');
}

// ---------- assets ----------
const NAME_SAFE = (s) => s.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const assets = new Map(); // url → { damPath, cacheFile }
const damTaken = new Map(); // damPath → url
function damPathFor(url) {
  const u = new URL(url);
  const segs = u.pathname.split('/').filter(Boolean);
  let folder;
  let file = segs[segs.length - 1] || 'asset';
  if (u.hostname === 'media.production.jlrms.com') {
    const style = segs[0] === 'styles' ? segs[1] : 'original';
    const s3 = segs.indexOf('s3');
    const date = s3 >= 0 ? segs[s3 + 1] : 'misc';
    const uuid = segs.length >= 2 ? segs[segs.length - 2] : 'x';
    folder = `${DAM}/media/${NAME_SAFE(date)}/${NAME_SAFE(uuid)}`;
    file = `${NAME_SAFE(style)}-${file}`;
  } else {
    folder = `${DAM}/media/${NAME_SAFE(u.hostname)}/${segs.slice(0, -1).map(NAME_SAFE).join('/')}`.replace(/\/$/, '');
  }
  let base = NAME_SAFE(decodeURIComponent(file));
  if (!extname(base)) base += '.bin'; // extension fixed after download from content-type
  let damPath = `${folder}/${base}`;
  if (damTaken.has(damPath) && damTaken.get(damPath) !== url) {
    const h = createHash('sha1').update(url).digest('hex').slice(0, 6);
    damPath = `${folder}/${base.replace(/(\.[^.]+)$/, `-${h}$1`)}`;
  }
  damTaken.set(damPath, url);
  return damPath;
}
function registerAsset(src) {
  const url = src.replace(/&amp;/g, '&');
  if (!/^https?:\/\//.test(url)) return null;
  if (!assets.has(url)) {
    const key = createHash('sha1').update(url).digest('hex');
    assets.set(url, { damPath: damPathFor(url), cacheFile: join(CACHE, key), ok: false });
  }
  return assets.get(url);
}

// rewrite page HTML: images → DAM, links → site paths
const pages = [];
const blobImages = [];
for (let i = 0; i < pageFiles.length; i += 1) {
  let html = readFileSync(pageFiles[i], 'utf8');
  html = html.replace(/(<img\b[^>]*?\ssrc=")([^"]+)(")/g, (m, a, src, b) => {
    if (src.startsWith('blob:')) { blobImages.push({ page: pagePaths[i], src }); return m; }
    const asset = ASSETS ? registerAsset(src) : null;
    return asset ? `${a}${asset.damPath}${b}` : m;
  });
  html = html.replace(/(<source\b[^>]*?\ssrcset=")[^"]*(")/g, '$1$2');
  html = html.replace(/(<a\b[^>]*?\shref=")([^"]+)(")/g, (m, a, href, b) => `${a}${localizeHref(href.replace(/&amp;/g, '&')).replace(/&/g, '&amp;')}${b}`);
  pages.push({ path: pagePaths[i], html });
}

// ---------- download ----------
const CT_EXT = {
  'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg', 'image/avif': '.avif',
};
mkdirSync(CACHE, { recursive: true });
const failed = [];
async function fetchOne(url, entry) {
  const meta = `${entry.cacheFile}.json`;
  if (existsSync(entry.cacheFile) && existsSync(meta)) {
    Object.assign(entry, JSON.parse(readFileSync(meta, 'utf8')), { ok: true });
    return;
  }
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(url, { signal: AbortSignal.timeout(60000), headers: { 'user-agent': 'Mozilla/5.0 (compatible; jcr-package-builder)' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = (res.headers.get('content-type') || 'application/octet-stream').split(';')[0].trim();
      // eslint-disable-next-line no-await-in-loop
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(entry.cacheFile, buf);
      writeFileSync(meta, JSON.stringify({ mimeType: type, size: buf.length }));
      Object.assign(entry, { mimeType: type, size: buf.length, ok: true });
      return;
    } catch (e) {
      if (attempt === 2) { failed.push({ url, error: String(e.message || e) }); return; }
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => { setTimeout(r, 1500 * (attempt + 1)); });
    }
  }
}
if (ASSETS) {
  const queue = [...assets.entries()];
  let done = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const [url, entry] = queue.shift();
      // eslint-disable-next-line no-await-in-loop
      await fetchOne(url, entry);
      done += 1;
      if (done % 50 === 0) console.error(`assets ${done}/${assets.size}`);
    }
  }));
  // fix .bin extensions from the real content type
  for (const [url, e] of assets) {
    if (e.ok && e.damPath.endsWith('.bin') && CT_EXT[e.mimeType]) {
      const fixed = e.damPath.replace(/\.bin$/, CT_EXT[e.mimeType]);
      damTaken.delete(e.damPath);
      damTaken.set(fixed, url);
      for (const p of pages) p.html = p.html.split(e.damPath).join(fixed);
      e.damPath = fixed;
    }
  }
}

// ---------- write vault tree ----------
rmSync(BUILD, { recursive: true, force: true });
mkdirSync(join(BUILD, 'META-INF', 'vault'), { recursive: true });
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const NS = 'xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:dam="http://www.day.com/dam/1.0" xmlns:dc="http://purl.org/dc/elements/1.1/"';
const writeXml = (repoPath, xml) => {
  const dir = join(JCR, repoPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, '.content.xml'), xml);
};

const converted = [];
const convertErrors = [];
for (const p of pages) {
  try {
    const html = p.html.includes('<main') ? p.html : `<body><main>${p.html}</main></body>`;
    // eslint-disable-next-line no-await-in-loop
    const md = await html2md(html, { log: SILENT });
    // eslint-disable-next-line no-await-in-loop
    const xml = await md2jcr(md, { ...models, log: SILENT });
    writeXml(`${SITE}/${p.path}`, xml);
    converted.push(p.path);
  } catch (e) {
    convertErrors.push({ page: p.path, error: String(e.message || e).split('\n')[0] });
  }
}

// structural parent pages (only where no imported page exists), merged on install
const pageSet = new Set(converted.map((p) => `${SITE}/${p}`));
const structural = new Set();
for (const p of converted) {
  const segs = p.split('/');
  for (let i = 1; i < segs.length; i += 1) {
    const anc = `${SITE}/${segs.slice(0, i).join('/')}`;
    if (!pageSet.has(anc)) structural.add(anc);
  }
}
for (const anc of structural) {
  const title = anc.split('/').pop();
  writeXml(anc, `<?xml version="1.0" encoding="UTF-8"?>\n<jcr:root ${NS} jcr:primaryType="cq:Page">\n  <jcr:content cq:template="/libs/core/franklin/templates/page" sling:resourceType="core/franklin/components/page/v1/page" jcr:primaryType="cq:PageContent" jcr:title="${esc(title)}"/>\n</jcr:root>\n`);
}

// assets
const usedAssets = [...assets.values()].filter((e) => e.ok);
const damFolders = new Set();
for (const e of usedAssets) {
  const segs = e.damPath.split('/');
  for (let i = 4; i < segs.length; i += 1) damFolders.add(segs.slice(0, i).join('/'));
  writeXml(e.damPath, `<?xml version="1.0" encoding="UTF-8"?>\n<jcr:root ${NS} jcr:primaryType="dam:Asset">\n  <jcr:content jcr:primaryType="dam:AssetContent">\n    <metadata jcr:primaryType="nt:unstructured" dc:format="${esc(e.mimeType)}"/>\n  </jcr:content>\n</jcr:root>\n`);
  const rend = join(JCR, e.damPath, '_jcr_content', 'renditions');
  mkdirSync(join(rend, 'original.dir'), { recursive: true });
  writeFileSync(join(rend, 'original'), readFileSync(e.cacheFile));
  writeFileSync(join(rend, 'original.dir', '.content.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<jcr:root ${NS} jcr:primaryType="nt:file">\n  <jcr:content jcr:primaryType="nt:resource" jcr:mimeType="${esc(e.mimeType)}"/>\n</jcr:root>\n`);
}
for (const f of damFolders) {
  if (f === DAM) continue;
  writeXml(f, `<?xml version="1.0" encoding="UTF-8"?>\n<jcr:root ${NS} jcr:primaryType="sling:Folder"/>\n`);
}

// filter.xml: each imported page replaces only itself (+ its jcr:content), never its child pages;
// structural parents and the DAM tree merge/update without deleting anything else.
const filter = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<workspaceFilter version="1.0">',
  ...[...structural].sort().map((p) => `  <filter root="${esc(p)}" mode="merge">\n    <include pattern="${esc(p)}"/>\n    <include pattern="${esc(p)}/jcr:content(/.*)?"/>\n  </filter>`),
  ...converted.map((p) => `${SITE}/${p}`).sort().map((p) => `  <filter root="${esc(p)}">\n    <include pattern="${esc(p)}"/>\n    <include pattern="${esc(p)}/jcr:content(/.*)?"/>\n  </filter>`),
  ...(usedAssets.length ? [`  <filter root="${DAM}/media" mode="update"/>`] : []),
  '</workspaceFilter>',
  '',
].join('\n');
writeFileSync(join(BUILD, 'META-INF', 'vault', 'filter.xml'), filter);
const name = 'jlr-xwalk-content';
writeFileSync(join(BUILD, 'META-INF', 'vault', 'properties.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <entry key="name">${name}</entry>
  <entry key="group">jlr-xwalk</entry>
  <entry key="version">${VERSION}</entry>
  <entry key="description">media.jlr.com en-gb migration: ${converted.length} pages + ${usedAssets.length} DAM images (xwalk, md2jcr)</entry>
  <entry key="createdBy">jcr-package-builder</entry>
  <entry key="requiresRoot">false</entry>
  <entry key="allowIndexDefinitions">false</entry>
  <entry key="packageType">content</entry>
</properties>
`);

mkdirSync(DIST, { recursive: true });
const zipPath = join(DIST, `${name}-${VERSION}.zip`);
rmSync(zipPath, { force: true });
execFileSync('python3', ['-c', `
import os, sys, zipfile
src, dst = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as z:
    for root in ('META-INF', 'jcr_root'):
        for d, _, files in os.walk(os.path.join(src, root)):
            for f in files:
                p = os.path.join(d, f)
                z.write(p, os.path.relpath(p, src))
`, BUILD, zipPath]);

const report = {
  builtAt: new Date().toISOString(),
  package: zipPath,
  pages: { imported: pageFiles.length, converted: converted.length, errors: convertErrors },
  structuralParents: [...structural].sort(),
  assets: {
    referenced: assets.size, packaged: usedAssets.length, failed, blobImages,
  },
};
writeFileSync(join(ROOT, 'build-report.json'), JSON.stringify(report, null, 2));
console.log(`pages ${converted.length}/${pageFiles.length} · structural parents ${structural.size} · assets ${usedAssets.length}/${assets.size} (failed ${failed.length}, blob ${blobImages.length}) → ${zipPath}`);
