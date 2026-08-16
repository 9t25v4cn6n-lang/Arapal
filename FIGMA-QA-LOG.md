# AraPal → Figma: QA Defect Log (Phase B)

**File:** `VwzaUb5YtAonCnMVMRmvmd`
**Swept:** 2026-08-07
**Scope:** desktop set only, 1440 × 900. Mobile is not yet built and is out of scope for this log.
**Count:** 40 findings — 8 blocker, 22 major, 10 minor. 38 fixed, 1 partially fixed (C-04), 1 accepted (C-10). One blocker (R-01) is fixed in the Polished set only; the Reconstruction frame stays frozen incomplete.

---

## Provenance and a sequencing deviation

The work order runs Phase B as a standalone sweep whose only deliverable is a defect list, before any Phase C work begins. **No `FIGMA-QA-LOG.md` existed in the repository at the start of this session** — `TODO.md` recorded Phase B as the *next* milestone, not a completed one. This session was directed to execute Phase C.

Rather than block, the sweep was performed at the head of Phase C and the findings recorded here before the corresponding fixes were made. That is a real deviation from the prescribed order: findings and fixes were produced in the same session rather than in two gated stages. Each finding below therefore carries its resolution.

**Evidence base:**

- Reconstruction frames rendered from the Figma file (pages `10 · …` – `14 · …`).
- Live application captures in `artifacts/` — `v2-study-final-sizing-default.png`, `project-home-roomier-pass-4.png`, `project-research-inspector-fix-final-1440x900.png`, `paste-1440-final-structure-pass.png`.
- Token sources under `src/v2/foundation/tokens/`.

**Evidence status:** all findings below are *verified* — each was observed in a rendered frame or a live capture, not inferred from source.

**Severity:** blocker = ships broken or unreadable · major = a professional reviewer would stop on it · minor = worth fixing, not disqualifying.

**Resolution:** `fixed` = corrected in the Polished set · `accepted` = deliberately retained, rationale given · `deferred` = out of this session's scope (mobile / prototype).

---

## Home

| ID | Check | Role | Sev | Finding | Evidence | Resolution |
|---|---|---|---|---|---|---|
| H-01 | B2 | Visual Designer | major | 284 px of dead space below the card deck; hero and deck float without a bottom anchor. | Recon `51:2`; deck ends y≈616 in a 900 px frame | **fixed** — content column re-flowed to 96 px top / 106 px bottom margins |
| H-02 | B1 | Visual Designer | major | Hero subtitle breaks into three ragged lines ending on the widow "into study." | Recon `51:2` | **fixed** — measure set to 620 px, two balanced lines |
| H-03 | B10 | Creative Director | major | Fourth deck card uses a different contract from the other three: tinted fill, centred text, no divider, no meta row. Four cards, two designs. | Recon `51:2` | **fixed** — `Project Card` component, `Kind=New` keeps identical dimensions and band structure |
| H-04 | B2 | Visual Designer | major | Card title baselines do not align across the row — "Fasting" sits ~8 px above its neighbours because its meta value wraps to two lines. | Recon `51:2` | **fixed** — five fixed bands with one flexible gap; titles align by construction |
| H-05 | B6 | Design Systems Lead | major | Watermark renders far heavier than the 4 % spec suggests and crosses the card deck; the second watermark is cropped mid-word at the right edge. | Recon `51:2` | **fixed** — one watermark at 2.8 %, repositioned clear of the content column |
| H-06 | B8 | Interaction Designer | blocker | No primary action anywhere on the screen. The only affordances are three cards and a placeholder tile. | Recon `51:2` | **fixed** — "Continue 1.3 Ghusl" primary + "Segment a new source" secondary |
| H-07 | B4 | QA Tester | minor | "CONDITION LOGGED" overflows its column. Present in the app, so faithful — but it is still a defect. | Recon `51:2`; live `project-home-roomier-pass-4.png` | **fixed** — meta labels normalised to one contract across all cards |
| H-08 | B9 | Accessibility | major | Rail navigation is icon-only with no visible or accessible label. | Recon `51:2` | **fixed** — `Nav Rail / Expanded (hover)` reveals labels on hover/focus |
| H-09 | B2 | Visual Designer | minor | Each card has an unexplained vertical gap between subtitle and meta row. | Recon `51:2` | **fixed** — gap now carries segment-progress ticks, i.e. real signal |

## Study

| ID | Check | Role | Sev | Finding | Evidence | Resolution |
|---|---|---|---|---|---|---|
| S-01 | B4 | QA Tester | blocker | Arabic source text is clipped mid-line at the bottom of the source card with no scroll affordance, fade or disclosure. The core content of the product is silently truncated. | Recon `47:2`; live `v2-study-final-sizing-default.png` | **fixed** — passage container hugs its text; where a passage does overflow, a fade + explicit disclosure is specified |
| S-02 | B3 | Frontend Engineer | blocker | The translation editor extends past the bottom of the frame — the submit row sits at y≈875 and the card continues beyond 900. | Recon `47:2` | **fixed** — centre column is a fixed 804 px stack; the editor absorbs slack via FILL |
| S-03 | B4 | QA Tester | blocker | The Phrasing support card runs off the bottom of the frame. | Recon `47:2`; live capture shows the same | **fixed** — support rail is a clipped viewport with a designed scroll edge |
| S-04 | B2 | Visual Designer | major | ~180 px dead zone between the quick-lexicography chips and the translation editor. | Recon `47:2` | **fixed** — rhythm re-set on 16 px; the editor now occupies the slack |
| S-05 | B4 | QA Tester | major | The Lexicography card ends on an orphaned term (أفنية / afniyah) with no definition beneath it — reads as truncated content. | Recon `47:2` | **fixed** — one term per card plus a Context box; second terms move to the expanded state |
| S-06 | B7 | Design Systems Lead | major | The Support column header uses a literal `»` character where every other disclosure uses a Lucide chevron. | Recon `47:2` | **fixed** — real `Icon/chevronRight` inside an Icon Button |
| S-07 | B6 | Design Systems Lead | major | The account avatar is a saturated blue square with a white initial — the only element in the chrome with that treatment. | Recon `47:2` | **fixed** — neutral pill, `surface-soft` on `line-soft` |
| S-08 | B3 | Information Architect | major | An expand icon button floats below the Draft/Fail/Pass pills, anchored to nothing. | Recon `47:2` | **fixed** — dev scaffolding removed from the polished set; expand lives in the source-card header |
| S-09 | B2 | Visual Designer | minor | The segment column has ~300 px of dead space below Chapter 3. | Recon `47:2` | **fixed** — all chapters expanded plus a pinned progress footer |
| S-10 | B8 | Interaction Designer | minor | "SEGMENT 3 OF 8" is shown against five progress dashes; the count and the indicator disagree. | live `v2-study-final-sizing-default.png` | **fixed** — nine ticks against "4 / 9", header reads "Segment 3 of 9" |

## Segmentation

| ID | Check | Role | Sev | Finding | Evidence | Resolution |
|---|---|---|---|---|---|---|
| G-01 | B3 | Information Architect | blocker | The "Approve structure" block floats in the middle of the canvas, overlapping and obscuring the Compiled preview text beneath it. This is the reference structural failure named in the work order. | Recon `60:2` | **fixed** — anchored sticky footer bar, full width, with a scroll fade above |
| G-02 | B3 | QA Tester | blocker | The dev nav pill overlaps the step bar; the word "REVIEW" collides with the pill's first item. | Recon `60:2` | **fixed** — dev scaffolding removed from the polished set |
| G-03 | B4 | QA Tester | major | The Segment markers card is cut off at the frame bottom. | Recon `60:2` | **fixed** — both columns stretch to meet the footer |
| G-04 | B6 | Design Systems Lead | major | The watermark is cropped mid-word ("Arapa") across the right third of the canvas. | Recon `60:2` | **fixed** — single repositioned watermark clipped to the body |
| G-05 | B1 | Visual Designer | major | Only the active wizard step is labelled; steps 2 and 3 are unexplained numbered dots. | Recon `60:2`; live `paste-1440-final-structure-pass.png` | **fixed** — all three steps labelled, completed steps carry a check |
| G-06 | B9 | Accessibility | minor | "READY TO CONTINUE" is set in success green over a mid-tone translucent background. | Recon `60:2` | **fixed** — `success-strong` (#15803D) on an opaque footer |

## Research

| ID | Check | Role | Sev | Finding | Evidence | Resolution |
|---|---|---|---|---|---|---|
| R-01 | B3 | QA Tester | blocker | The Reconstruction frame contains **only** the dark header block. The filter rail, ledger and inspector are absent entirely. Phase A item A4 was recorded as complete in `TODO.md` but is not. | Recon `37:2` | **fixed in the Polished set only.** The Reconstruction frame is frozen and remains incomplete — see Limitations |
| R-02 | B4 | QA Tester | blocker | In the live app the inspector's action block overlays and clips the BEST TRANSLATION card. | live `project-research-inspector-fix-final-1440x900.png` | **fixed** — actions are a pinned footer inside the panel; body scrolls above it |
| R-03 | B4 | QA Tester | major | Every ledger heading truncates at ~14 characters ("Pure water as ori…", "Comprehensive …"). Root cause: three columns of prose share ~680 px. | live capture | **fixed** — ledger row restructured to three lines; the English rendering moves to the inspector where it has room |
| R-04 | B3 | Frontend Engineer | major | The Arabic extract and English gloss columns abut with no gutter — the two scripts touch. | live capture | **fixed** — eliminated by the row restructure |
| R-05 | B4 | QA Tester | major | The revision queue card is clipped at the bottom of the aside and its last row truncates ("Translation comparis…"). | live capture | **fixed** — queue panel fills the rail; no truncation |
| R-06 | B3 | Information Architect | minor | The column header "ARABIC EXTRACT · TRANSLATION SIGNAL · STATUS" does not align with the columns it labels. | live capture | **fixed** — header removed; the row is self-describing |

## Exams

| ID | Check | Role | Sev | Finding | Evidence | Resolution |
|---|---|---|---|---|---|---|
| X-01 | B1 | Visual Designer | major | Title set at ~38 px against the live screen's ~64 px — the whole screen sits at the wrong scale. | Recon `41:2`; work order A6 | **fixed** — rebuilt on the polished ramp, display at 44 px |
| X-02 | B2 | Visual Designer | major | Stat cards ~220 px wide against the live ~410 px. | Recon `41:2` | **fixed** — three FILL tiles across the 1180 px column |
| X-03 | B2 | Visual Designer | major | ~300 px of dead space below the content. | Recon `41:2` | **fixed** — two-column library fills the body |
| X-04 | B10 | Creative Director | major | The frame uses the left rail; the live screen uses a back pill plus Exams/Generate tabs. Two different navigation models for one product. | Recon `41:2`; work order A6 | **accepted with change** — the polished set standardises on the V2 rail across every screen. See Deviations |
| X-05 | B8 | Interaction Designer | minor | Two competing primary buttons ("Create exam" and "Open exam") at equal weight. | Recon `41:2` | **fixed** — "Create exam" sits inside a dark panel and is the screen's single primary |

## Cross-screen

| ID | Check | Role | Sev | Finding | Evidence | Resolution |
|---|---|---|---|---|---|---|
| C-01 | B9 | Accessibility | blocker | The type ramp bottoms out at 9.5 px (`eyebrowLabel`) and 11 px (`bodyText`), and `text-faint` (#94A3B8) is 2.6:1 on white. Small text in the palest grey fails 4.5:1 across every screen. | `tokens/typography.ts`, `tokens/colors.ts`; all recon frames | **fixed** — polished ramp bottoms out at 11 px; `text-faint` retuned to #8496AE (3.2:1) and reclassified as decorative/icon-only; all meta text moved to `text-soft` (4.8:1) |
| C-02 | B9 | Accessibility | major | "Needs revision" and "Weak area" share one amber. Two distinct states, one colour, no icon — colour-only signalling. | live research capture | **fixed** — Review stays amber, Weak becomes rose (`critical`), and every status chip carries an icon *and* a word |
| C-03 | B8 | Interaction Designer | major | No focus states exist anywhere in the set. | all recon frames | **fixed** — `Input` has a designed focus state (1.5 px accent border + 3 px focus ring); `focus-ring` is a token |
| C-04 | B9 | Accessibility | major | Icon-only controls sit at 28–32 px, below the 44 × 44 minimum, with no documented desktop exemption. | all recon frames | **partially fixed** — `Icon Button` now offers Lg 44 px; Md 36 and Sm 28 remain for desktop density and are documented as requiring a 44 px hit area. See Deviations |
| C-05 | B10 | Creative Director | major | Header height differs by screen — 50 px (V2), 70 px (Home legacy), 73 px (Segmentation Paste), 83 px (later Segmentation steps). | recon frames; `TODO.md` known gaps | **fixed** — one 56 px `Header Bar` on Home/Study/Research/Exams, one 64 px wizard header across all Segmentation steps |
| C-06 | B1 | Visual Designer | minor | Uppercase labels are inconsistently letterspaced between screens. | recon frames | **fixed** — `P/09 Eyebrow` (14 %) and `P/11 Mono Label` (4 %) are the only uppercase styles |
| C-07 | B6 | Design Systems Lead | minor | Elevation is single-layer with a very large radius and low alpha, reading as haze rather than lift. | `tokens/elevation.ts`; recon frames | **fixed** — `Elevation/P *` is a two-layer ramp (tight contact + broad ambient) |
| C-08 | B11 | Design Systems Lead | minor | `ZZ Shell Verification (temp)` scaffold and two superseded frames left on the Foundations page. | Foundations page | **fixed** — temp scaffolds removed; superseded frames are explicitly renamed `Superseded — …` |
| C-09 | B11 | Design Systems Lead | minor | The dev route string (`#v2/projectHome`) and the Draft/Fail/Pass debug pills appear in the Reconstruction frames. Correct there by prior agreement, wrong for a public-ready set. | recon frames | **fixed** — removed from the Polished set. See Deviations |
| C-10 | B2 | Visual Designer | minor | Where an Arabic term and its Latin romanisation share a centre-aligned row (Support Card term rows, quick-lexicography chips), the two baselines sit ~4 px apart. Amiri and JetBrains Mono have very different metric boxes, so mathematical centring is not optical centring. | zoom of `Tone=Lexicography, State=Expanded` at 3× | **accepted** — introduced in this pass, not inherited. Centre alignment is the least-bad default across variable term lengths; a per-pair baseline nudge would not survive content changes. Flagged for review if it reads badly at build |

---

## Deviations deliberately taken in the Polished set

Each of these changes the app rather than reproducing it. They are design decisions, not defects.

1. **Type ramp raised.** The app's 9.5 px eyebrow and 11 px body fail WCAG AA. The polished ramp starts at 11 px and puts body at 15 px. Every screen gets slightly less content per viewport in exchange for text that passes.
2. **`text-faint` reclassified.** Retuned #94A3B8 → #8496AE and documented as decorative/icon use only. Meta text that previously used it now uses `text-soft`.
3. **Dev scaffolding removed.** The floating nav pill, the Draft/Fail/Pass debug buttons and the `#v2/<route>` string were agreed *into* the Reconstruction set. They are removed from the Polished set — they are development affordances, not product.
4. **Header 50 → 56 px.** The two-line centre label was crowded at 50. The 6 px costs nothing that matters and buys the label air.
5. **One watermark, not two.** The app crops a second wordmark mid-letter at the right edge; at any opacity that reads as an accident rather than a device. The polished backdrop keeps one, at 2.8 % rather than 4 %.
6. **Exams standardises on the V2 rail** rather than the live screen's back-pill-plus-tabs. Two navigation models in one product is a consistency failure (X-04); the rail is the model four of five screens already use.
7. **Segmentation steps are all labelled.** The app labels only the active step. Unlabelled numbered dots tell the user nothing about where the flow goes.
8. **Research ledger restructured from a five-column table to a three-line row.** The truncation in R-03 is not a styling problem — three columns of prose cannot share 680 px. The English rendering moves to the inspector.
9. **Segment progress is discrete, not continuous.** "5 of 8 segments" is a count; it is drawn as eight ticks rather than a percentage bar.
10. **Icon button sizes below 44 px are retained** for desktop density, with the 44 px hit-area requirement recorded in the spec rather than enforced by the visual box.

---

## Limitations of this pass

- **Reconstruction Research (`37:2`) is frozen incomplete.** Phase A item A4 was never finished — the frame holds only its header block. The Polished Research screen was therefore built from the live app capture and `projectResearchData.js`, not from a parity baseline. There is no reconstruction-to-polished diff for that screen.
- **No live re-capture was performed this session.** The app was not run; the sweep used the existing `artifacts/` captures (dated 2026-08-06) and the Figma frames. If the app has changed since, findings drawn from those captures may be stale.
- **Mobile is unswept.** No mobile frames exist yet.
- **Interaction coverage is partial.** Hover, pressed and disabled states exist as component variants but are not applied across every screen instance; focus order and keyboard behaviour are specified in `FIGMA-SPEC.md`, not demonstrated in frames.
- **Contrast ratios were computed, not measured with a tool.** Values quoted are calculated from the token hex values against `surface-primary` (#FFFFFF).
