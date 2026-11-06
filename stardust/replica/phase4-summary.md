# Phase 4 — source-fidelity gate: close-out (2026-11-05)

Closed by user decision with 9 of 12 archetypes approved. Source of record: the prototype
tables `stardust/replica/gates/prototypes-{1440,360}/summary.{md,json}` (gate-all
`--stage prototype`, 11 rows — the 9 approved archetypes plus 2 prototyped-but-unapproved).

## Per archetype (prototype table, pixel % / Δh px)

| type | slug | status | 1440 | 360 | structural 🔴 | notes |
|---|---|---|---|---|---|---|
| brand-landing (canon) | defender-en-gb | approved | 1.48 / +1 | **11.58 / +21** | 0 | 360 residual: substitute-font wrap fork (cap reached) |
| vehicle-detail | defender-en-gb-vehicle-defender-110 | approved | 9.67 / **−44** | 2.77 / 0 | 0 | 1440 Δh residual: card-4 teaser wrap fork (accepted) |
| media-listing | defender-en-gb-image-packs | approved | 0.92 / +1 | 1.86 / 0 | 0 | — |
| media-pack-detail | defender-en-gb-image-packs-defender-110-namib-orange | approved | 2.02 / +1 | 1.86 / 0 | 0 | — |
| grid-overview | defender-en-gb-directors | approved | 1.07 / +1 | 2.22 / 0 | 0 | — |
| content-detail | defender-en-gb-news-2026-07-tough-luxury-…-update | approved | 8.39 / **−31** | **20.24 / +550** | 0 | body copy + footnotes table wrap forks (substitute fonts), cap reached; clipped 36 = live 36 (hover bars) |
| person-detail | defender-en-gb-person-chris-thorp | approved | 1.35 / +1 | 2.65 / 0 | 0 | — |
| contact-listing | defender-en-gb-contact | approved | 1.17 / +1 (hero masked) | 2.22 / 0 (hero masked) | 0 | hero image rotates per request (dynamic-features #18) |
| contact-detail | defender-en-gb-contact-china-3 | approved | 1.38 / +1 | 5.08 / 0 | 0 | short-page header flip variance (accepted) |
| legal-page | defender-en-gb-terms-and-conditions | prototyped (not approved) | 3.46 / +1 | 9.50 / −25 | 0 | motion unit not finished; 360 Δh font residual |
| mobile-vehicle-menu | defender-en-gb-mobile-vehicle-menu | prototyped (not approved) | 1.03 / +1 | 1.57 / 0 | — | motion confirmation not finished |
| main-landing | en-gb | not built | — | — | — | open |

Pixel-only verdict (≤10 % and |Δh| within tolerance): 9 of 11 rows PASS at each width.
Full four-criteria verdict: 2 of 11 PASS at each width. The failing criterion is repeated-unit geometry.

## Open items (carried, not silently dropped)

1. **Repeated-unit criterion (units).** Most rows fail on unit geometry. Partly bookkeeping:
   several `units.json` families declare live selectors that match no visible element ("no visible
   unit on the origin side"). Partly instrument: the project copy of
   `stardust/scripts/diff/unit-geometry.mjs` cached live geometry across widths. It was patched to a
   width-keyed cache (recorded in progress.json `scriptAdaptations[]`; original at
   /tmp/ua/unit-geometry.mjs.orig; flag upstream). The audit (`stardust/replica/notes/units-audit.md`)
   stopped mid-way because of service restarts: correct the declarations, re-run
   `gate-all --stage prototype --skip-existing --only …`, then classify the offsets (uniform shift
   below an accepted font residual = justified; per-unit deltas = defect).
2. **Finishing pass** (`stardust/replica/finishing-pass.md`): image-packs card hover overlay;
   namib-orange tile hover overlay + Download dropdown observation; vehicle 360 Refine-By slide-in
   observation.
3. **Canon request (d) reverted**: header un-shrink on upward scroll loops on the stitched capture;
   short pages carry it as page JS. A canon version needs a capture-safe implementation.
4. **Not built**: main-landing (`/en-gb`, own chrome without brand sub-nav). legal-page and
   mobile-vehicle-menu need their motion units, then approval.
5. **Fonts**: every residual above the bar comes from the user-approved font substitution. A
   licensed drop-in (brand family names are first in every stack) is expected to remove most of them.
