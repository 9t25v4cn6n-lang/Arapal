# Arapal — Current Stage and Next Milestones

## 2026-08-16 · Product quality & release readiness audit — complete

`ARAPAL_PRODUCT_QUALITY_AUDIT.md` (evidence in `audit-evidence/`). Audited the running application only; Figma explicitly excluded. No application source modified.

**Verdict: 31/100, do not ship.** 0 of 15 release gates pass. The visual and V2 structural layers are professional and worth protecting; the data/state layer barely exists. Eight P0s, all from three root causes: no data layer or entity flow between screens (S1), core inputs not wired to state (S2), and fabricated evaluation presented as real (S3).

**This supersedes the assumption that the next milestone is Figma Phase C.** Phase C below remains accurate as a record of the Figma work, but the running application — not the design file — is now the critical path. Reconstructing a product in Figma that discards the user's work in the application is not the highest-value next action.

**Next action:** Phase 0 of the audit's plan (stop asserting things that are not true — the false "AUTOSAVE — SAVED" badge, unlabelled fabricated grades, shipped dev scaffolding). Then Phase 1 blockers, built on the V2 spine only.

**Open decision required from the product owner:** is mobile (390 px) in scope for the first release? This determines whether R1 (Study responsive redesign) is P1 or P2.

---

## Current stage

**Figma rebuild, Phase C — Polished version. Desktop complete; mobile and prototype outstanding.**

Figma file: `VwzaUb5YtAonCnMVMRmvmd` — <https://www.figma.com/design/VwzaUb5YtAonCnMVMRmvmd>

Scope reference: `FIGMA-REBUILD-WORKORDER.md`. Defect log: `FIGMA-QA-LOG.md`. Written spec: `FIGMA-SPEC.md`.

---

## Phase A — Restore parity · complete with one exception

All items verified by live screenshot diff except:

- **A4 Project Research was recorded complete but is not.** The Reconstruction frame `37:2` contains only its dark header block; the filter rail, ledger and inspector are absent. The frame is now frozen in that state. There is therefore **no parity baseline for Research** — the polished screen was built from the live capture and `projectResearchData.js` instead. Logged as QA-log `R-01`.

## Phase B — QA sweep · complete, out of order

`FIGMA-QA-LOG.md` did not exist at the start of the 2026-08-07 session. The sweep was performed at the head of Phase C rather than as a separate gated stage, so findings and fixes were produced in the same session. 39 findings: 8 blockers, 22 major, 9 minor. All blockers and majors resolved or consciously accepted with rationale.

## Phase C — Polished version · desktop complete

### C1 · Page structure — done
Pages renamed and ordered `00 · Cover` → `34 · Polished — Exams`. The five Reconstruction pages are frozen: **every top-level frame is locked**.

### C3 · Component library — done
`02 · Components`: 18 variant sets (~180 variants) plus 41 real Lucide icon components. Every fill, stroke, radius and gap bound to a variable. Inventory in `FIGMA-SPEC.md` §3.

### C4 · Screen polish — desktop done

| Screen | Frames built |
|---|---|
| Home | `01 · Resting` |
| Study | `01 · Draft`, `02 · Submitted · Pass` |
| Segmentation | `01 · Paste`, `02 · Review` |
| Research | `01 · Segment selected` |
| Exams | `01 · Library` |

### C5 · Motion — specified, not playable
Tokens documented and sequences described in `FIGMA-SPEC.md` §2.6. No prototype connections set. Figma cannot bind prototype easing/duration to variables, so connections must be matched by eye.

### C6 · Specification — done
`FIGMA-SPEC.md`.

---

## Next milestone

**Complete Phase C.** In priority order:

1. **Mobile counterparts (C2b)** — 390 × 844 for every polished screen. The four-pane Study workspace is the hard case; decide and document how segments, source, editor and support coexist on a phone. The 51 px rail cannot survive as-is.
2. **Prototype wiring (C2c)** — Home → Study → Segmentation → Success → Study, plus Research and Exams entry points, desktop and mobile. Smart Animate where elements persist. Durations set by eye to the motion tokens.
3. **Remaining states** — listed per screen in `FIGMA-SPEC.md` §4. Highest value first: Study `Submitted · Fail` and `Discuss floating`; Research `No selection` and `No results`; Segmentation `Loading` / `Transition` / `Success`; Home and Exams empty states.

## Reference artifacts

- **`screenshot-reference/`** (2026-08-14) — a 30-shot, representative-depth screenshot set of the **legacy** app (`#home #study #segmentation #exams #projects`), built for handing to another AI as a functionality reference. Captured via `scripts/capture-reference.mjs` (Playwright) at the canonical 1440×900 viewport with dev chrome hidden (`?chrome=0`). Indexed in `screenshot-reference/manifest.md`. Not a Figma parity source — it postdates the 2026-08-06 captures used for Phase A/C and reflects current `src/screens/` behaviour more faithfully than `artifacts/ui-snapshots`.

## Known gaps carried forward

- **No live re-capture since 2026-08-06.** The Phase C sweep used the existing `artifacts/` captures. If the app has moved, findings drawn from them may be stale — re-capture before the next parity claim.
- **Reconstruction Research is frozen incomplete** (see Phase A above).
- **Contrast ratios are computed, not measured.** No automated audit has been run against the built frames.
- **Sub-44 px icon buttons are retained** for desktop density. Build must give Md (36) and Sm (28) a 44 px hit area — a build requirement, recorded in `FIGMA-SPEC.md` §5, not enforced by the visual box.
- **Segmentation motion keyframes were not re-derived** from `src/v2/foundation/tokens/segmentationFlow.ts`. Do this when wiring the prototype.

## Plugin API traps found in this build

Recorded in `FIGMA-SPEC.md` §3.2. The two that cost the most time:

- `resize()` after setting `layoutSizing* = 'FILL'` silently reverts the node to FIXED.
- `setBoundVariableForPaint()` returns a paint whose literal colour is black with the alias attached; component nodes resolve it, **instance children render black.** Seed the paint with the variable's resolved RGB.
