#!/usr/bin/env node
// Probe: print the md2jcr output for one imported page (first 3000 chars).
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const S = '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts/package.json';
const req = createRequire(S);
const { html2md } = await import(req.resolve('@adobe/helix-html2md'));
const { md2jcr } = await import(req.resolve('@adobe/helix-md2jcr'));
const merged = {};
for (const k of ['models', 'definition', 'filters']) merged[k] = JSON.parse(readFileSync(`component-${k}.json`, 'utf8'));
const html = readFileSync(process.argv[2], 'utf8');
const md = await html2md(html.includes('<main') ? html : `<body><main>${html}</main></body>`, { log: { info() {}, warn() {}, error() {}, debug() {} } });
const out = await md2jcr(md, { ...merged, log: { info() {}, warn() {}, error() {}, debug() {} } });
console.log(typeof out, typeof out === 'string' ? out.length : Object.keys(out));
console.log(String(typeof out === 'string' ? out : JSON.stringify(out)).slice(0, 3000));
