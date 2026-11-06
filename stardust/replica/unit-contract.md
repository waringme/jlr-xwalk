# Archetype unit contract — do the NEXT unit of work for one archetype, then return

Read `stardust/replica/archetype-brief.md` first (the full contract: environment, hook, canon,
fonts, gate, bookkeeping). This file adds how to work in UNITS, because the service restarts
about every 22 minutes and kills any agent or background job running at that moment.

## The notes file is the state

`stardust/replica/notes/<slug>.md` — create it if absent. Start by reading it. Every diagnosis,
fix, launched round and result is ONE appended line, written the moment it happens (with the
`date +%H:%M` clock). The last line `STATUS: <next-unit>` tells the next agent where to resume.
If a launched round has no result line, check `run-bg.mjs status <job>`: "lost" = killed by a
restart → re-run it (same label + `b`), it does not count as an iteration.

## Round shape in this environment (coordinator rule, overrides `--full`)

`gate.sh --full` rounds take ~10 minutes and die in the restarts. Run every round as a
PIXEL-ONLY `gate.sh` round (no `--full`; ~1–3 min, live.png cached after the first) through
run-bg, plus the probes run DIRECTLY in the foreground, each under `timeout 200`, writing
`stardust/replica/gates/<slug>-<w>/<probe>-<label>.txt`:
`content-diff.mjs <live> <proto> --profile generic --main <root> --width <w>`,
`visual-diff.mjs` (`--help`; `--main <root>`), `chrome-parity.mjs <live> <proto> --width <w>
[--region 'header=#main-nav|#main-nav']`, `clip-probe.mjs` (`--help`), and once per archetype
`cap-probe.mjs <live> --against <proto> --design DESIGN.json --slug <slug> --main <root>`.
A live capture that hits its deadline (exit 124) is re-run once, not counted.

## Units, in order (do exactly ONE per call, ~12 minutes)

1. `author` — content skeleton + lifted CSS + compose, importing canon (never editing canon files:
   compensation goes in the per-archetype CSS, canon changes are appended to
   `stardust/replica/canon-requests.md`). Advance state to `prototyped`. If the page shares most
   structure with the canon page, consider extending the canon generator approach
   (`stardust/.work/defender/build-page.mjs` is the canon's page generator — copy the idea into
   `stardust/.work/<slug>/`, do not edit the canon's copy). End with `STATUS: iter1`.
2. `iter1` — launch `gate.sh … iter1 --full --main "<root>"` at 1440 and 360 (run-bg, `--slots 2`,
   NODE_OPTIONS hook in the same command), wait, record verdict lines. If the `--full` probe reports
   come out empty, run the probes directly afterwards (content-diff, visual-diff, chrome-parity with
   `--region 'header=#main-nav|#main-nav'` if it cannot find the header, cap-probe — each under
   `timeout 240`, report files `<probe>-<label>.txt` in the gate dir). End with `STATUS: iter2`
   (or `STATUS: motion` if both widths already pass).
3. `iter2`, 4. `iter3` — fix the first hot band per failing width off the instruments (anchor,
   measure, chrome-parity, ONE crop-compare crop), fix structural 🔴 / clipped findings, then one
   round per failing width. iter3 ends with the confirmation probes (content-diff etc. as above)
   if not already clean. After iter3 the cap is reached: log residuals (gate doc § Residual logging
   format; substitute-font wrap forks are expected/justified). `STATUS: motion`.
5. `motion` — interaction parity per the brief (motion-observe live → implement only what fired →
   observe build with the same pokes → motion-compare → one pixel round `motion1` to confirm the
   numbers return). Page-only behaviours go in `js/<slug>.js`; a needed canon behaviour change is a
   canon request. Record motion in progress.json, append the journal section. `STATUS: DONE`.

Before any probe: `curl -sI localhost:8791/<slug>-proposed.html`; if it does not answer, start
exactly one server: `nohup python3 -m http.server 8791 --directory
/backups/waringme/jlr-xwalk/repo/stardust/prototypes >/tmp/proto-server.log 2>&1 &`.
Another archetype agent may be running in parallel: never kill run-bg jobs or servers you did not
start, never edit another archetype's files, merge progress.json / units.json read-modify-write
immediately before writing.

## Return (≤ 8 lines)

`<slug> · unit <name> · <result>` then per width the latest pixel %, Δh, structural 🔴, the
`STATUS:` line you left, and anything the coordinator must decide.

## Coordinator decisions (apply to every archetype)

- **Substitute-font wrap forks are accepted residuals.** When a remaining pixel or Δh failure is
  caused by the substitute fonts wrapping differently (evidence: per-title line counts, a uniform
  letter/word-spacing sweep cannot fix it without breaking another line), do NOT add content-specific
  nudges (per-card spacing tied to one string); log it as an expected, permanent residual
  justified by the user's font-substitution decision, and move on.
- **Hidden `[role=dialog]` cards stall live capture** (`live-session.mjs` dismissOverlays sweeps each
  hidden dialog's close control, >30 s per call). For such pages run gate.sh with
  `GATE_STITCH_TIMEOUT=600` and run-bg `--timeout 1500`. Do not edit the shared instrument.
- **Short pages (≲ 2 viewports tall) need the header un-shrink on upward scroll** as PAGE-level JS
  (the canon version was reverted — it loops on the stitched capture of some pages). Copy the
  pattern from `stardust/prototypes/js/defender-en-gb-person-chris-thorp.js` and verify with a
  pixel round.
- Quote every multi-word `--click`/`--hover` selector in motion-observe (unquoted selectors with a
  space are split by the shell and silently never run).
- **Short-page header flip** (sticky header toggling shrunk/full at the bottom scroll position, on
  live AND build) makes the second stitched chunk a coin flip: accepted residual — do not pin it.
