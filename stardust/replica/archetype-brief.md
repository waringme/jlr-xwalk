# Archetype brief — media.jlr.com en-gb replica (Phases 3 + 4, one archetype)

You recreate ONE archetype as a clean, re-authored static prototype and gate it against the live
page. This is a same-design migration (stardust `replica`): no redesign, no rewording, no DOM
copying, no "improvements". Inconsistency register is EMPTY (pure replica): any design delta is a
defect.

## Where things are

- Project root (run everything from here): `/backups/waringme/jlr-xwalk/repo`
- Skill card: `/home/node/.excat-marketplaces/excat-extended/stardust/skills/replica/SKILL.md`
  (§ Phase 3 and § Phase 4 — read those two sections, not the whole file).
- References (read BY SECTION: `node stardust/scripts/replica/section.mjs <doc> --list`, then one
  heading per call; never cat a whole doc):
  `/home/node/.excat-marketplaces/excat-extended/stardust/skills/replica/reference/recreation-procedure.md`
  `/home/node/.excat-marketplaces/excat-extended/stardust/skills/replica/reference/source-fidelity-gate.md`
  `/home/node/.excat-marketplaces/excat-extended/stardust/skills/replica/reference/reading-discipline.md` (read once)
  Script index: `/home/node/.excat-marketplaces/excat-extended/stardust/skills/stardust/reference/scripts-index.md`
- Project script copies (use these): `stardust/scripts/replica/`, `stardust/scripts/diff/`,
  `stardust/scripts/stardust/` (ledger.mjs, state.mjs). Modules resolve via the project
  `node_modules` links. NEVER `npm install`, NEVER `npx playwright install`, never cd into or write
  to the plugin tree; only the project and /tmp are writable.
- Captures: `stardust/current/pages/<slug>.json` (verbatim content), `stardust/current/pages/<slug>.html`
  (settled rendered DOM — read with `html-slice.mjs`), `stardust/current/assets/screenshots/<slug>.png`
  (ground truth — view only through extract's `thumb.mjs` or one crop), `stardust/current/_computed-styles.json`,
  `stardust/current/DESIGN.json` (+ root `DESIGN.json`, identical; `extensions.breakpoints` = container model:
  content caps at 1176 px, fluid shell), `stardust/chrome/` (header contract), `stardust/dynamic-features.md`.
  Source CSS: fetch the live stylesheets (all brands share ONE Drupal theme stylesheet; per-brand deltas
  are typeface, header logo, vehicle menu, favicon) into `stardust/.work/css/` and read them only with
  `css-rules.mjs`.

## Hard environment rule — the geo market dialog

From this machine the live site opens a "Location detected … switch market?" dialog (POST
`…/recommend-market`). UK visitors never see it, so it is NOT the design. EVERY instrument that loads the
live site must preload the hook:

    export NODE_OPTIONS="--import /backups/waringme/jlr-xwalk/repo/stardust/.work/no-market-modal.mjs"

(set it in the same shell command as the instrument, including `run-bg.mjs start … -- gate.sh …`;
it propagates to child node processes). Check the first live capture of each width with ONE crop of the
top band: if the dialog is visible, stop and report — never measure through it. Also pass gate.sh's
`--dismiss` for the cookie/consent banner if one appears.

## Prototype layout (cumulative canon — mandatory split)

- Server: ONE python http.server already serves `stardust/prototypes/` at `http://localhost:8791/`
  (probe `curl -sI localhost:8791/<file>`; never start another, never kill it).
- Your page: `stardust/prototypes/<slug>-proposed.html` + `stardust/prototypes/css/<slug>.css`
  (+ `stardust/prototypes/js/<slug>.js` only if needed).
- Shared canon (imported by every archetype): `stardust/prototypes/canon/tokens.css` (lifted tokens,
  font stacks), `canon/chrome.css` + `canon/chrome.js` (header, footer, sub-nav, their interactions),
  `canon/modules.css` (shared modules: cards, rails, media tiles, action toolbar, pagination…),
  `canon/fonts/` (substitute font files you self-host). Images: reference the live asset URLs as
  captured (`media.production.jlrms.com` / `media.jlr.com`) — do not download the media library.
- If you are the CANON archetype you create these files. If canon already exists you IMPORT it and
  must NOT edit any canon file: re-verify the canon chrome against YOUR live page first (gate doc
  § Pass bar item 5); put page-specific compensation in your per-archetype CSS and append each needed
  canon change as one line to `stardust/replica/canon-requests.md` (`<slug>: <file> — <change> — <evidence>`).
  The coordinator applies them later.
- Declare every repeated-unit family you author in `stardust/replica/units.json` (recreation doc
  § Repeated-unit families). Merge into the existing JSON — read it, add your keys, write it back;
  never drop other keys.

## Fonts — SUBSTITUTE (user decision)

All brand faces are licensed commercial kits (JLR Emeric, Helvetica Now Text, Neusa Neu, Avenir Next,
Land Rover Web, Jaguar Exuberant/Modern, Proxima Nova; files under `stardust/current/assets/fonts/`
are reference only). Never self-host them. Use metric-matched OPEN substitutes (e.g. Inter / Arimo for
Helvetica Now Text, a geometric open face for JLR Emeric / Land Rover Web; choose by measured x-height,
cap height and advance width against the captured woff2 metrics), keep the brand family FIRST in every
stack (`font-family: "JLR Emeric", "<substitute>", sans-serif`) and log the mapping in
`stardust/replica/progress.json` (`fonts` key) — a substituted face is an expected, permanent residual
(width probe forks are justified). Canon decides the mapping; later archetypes reuse it.

## Recreation (Phase 3)

Follow recreation-procedure § Authoring order exactly: verbatim content skeleton from the page JSON
(reconcile counts first) → values lifted from the source CSS (§ CSS lifting; container model from
DESIGN.json) → fonts → compose against the screenshot → serve and enter the gate. Clean semantic
HTML, BEM-ish classes, custom properties. Adopt the live page's content-root class on the prototype's
main wrapper so one `--main` selector scopes both sides. Fixed/sticky chrome replicated per § Fixed and
sticky chrome. Carousels per § Carousels. Box-by-box checks only with `measure.mjs`.

## Gate (Phase 4) — per breakpoint 1440 AND 360

Gate dir: `stardust/replica/gates/<slug>-<width>/`. Use `gate.sh` through `run-bg.mjs` exactly as the
skill card § Phase 4 shows (first round and confirmation round `--full --main "<content-root>"`;
in-between rounds pixel-only), `run-bg.mjs start --slots 2 …` (memory is capped at 4 GB: at most two
Chromium-heavy jobs at once project-wide), then `run-bg.mjs wait` as your next step (exit 75 = still
going → wait again; never sleep loops). Pass bar: content-diff 0 structural 🔴 (main + chrome roots),
visual-diff flags none/justified, pixel ≤ 10 % with no unexplained hot band, |Δh| ≤ 8 px, cap-probe
`PASS`, clip-probe `Clipped: 0`, horizontal overflow within 4 px. HARD CAP 3 iterations per breakpoint —
fixes come off the instruments (band breakdown → first hot band → anchor/measure/crop-compare), never
off eyeballing; after 3, log residuals (gate doc § Residual logging format) and stop. One crop per fact;
never read full stitched pages or live/build/diff triplets.

Then interaction parity (recreation doc § Interaction parity): `motion-observe.mjs` on the live URL
(with the hook) → `stardust/replica/motion/<slug>.json`; implement ONLY behaviours that fired; observe
the prototype with the same pokes → `<slug>-build.json`; `motion-compare.mjs`; re-run the pixel round —
the number must return to the gated value.

## Bookkeeping (one command each, no hand-built JSON for state/ledger)

- `node stardust/scripts/stardust/state.mjs advance <slug> --to prototyped --prototype stardust/prototypes/<slug>-proposed.html`
  when the prototype first exists. Do NOT advance to approved — the coordinator approves.
- `stardust/replica/progress.json`: merge (read-modify-write, keep other keys) one entry under
  `types.<type>`: `{ archetype, slug, liveUrl, prototype, iterations: {1440: n, 360: n},
  gates: {1440: {pixelPct, heightDelta, structuralRed, visualFlags, capProbe, clipped, overflow}, 360: {…}},
  residuals: [], motion: {observed, implemented, dead: []}, canonRequests: n }`.
- Do NOT write replica ledger start/end lines (the coordinator owns them). Append a short
  section to `stardust/journal.md` headed `## Recreate + gate <slug> — <what happened> (2026-11-05)`.
- Never write to admin.da.live / admin.hlx.page / any remote service. Local only.

## Return (one block, ≤ 25 lines)

Per breakpoint: iterations used, pixel %, Δh, structural 🔴 count, visual flags, cap-probe, clipped,
overflow — and PASS/FAIL against the bar. Then: residuals logged, motion {observed, implemented, dead},
fonts mapping (canon only), canon files created/changed (canon only) or canon-requests appended,
units.json families added, and anything the coordinator must decide.
