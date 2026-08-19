# Arapal — Public Release Visual QA & Refinement Pass 2

## Purpose

This is a **post-refinement public-release QA pass** on the latest Arapal desktop implementation.

Do not treat the findings below as a literal pixel-fix checklist. They are evidence of remaining product, design-system, shell, layout, typography, responsiveness and interaction defects.

Use the repository and rendered product to determine the root cause and fix it at the correct reusable abstraction.

The release standard is:

> Would a major product company be comfortable shipping these exact rendered screens unchanged, knowing they may appear in reviews, demos, customer screenshots and store imagery?

“Looks better than before” is not sufficient.

## Screenshot Evidence Index

The screenshots below are the evidence set for this QA pass. Paths are relative to this brief when supplied in the companion package.

**Important:** `S17–S20` are legacy screenshots and are **interaction references only**. They are not authoritative for the current visual shell, typography, spacing or styling.

| ID | File | Evidence | Related findings |
|---|---|---|---|
| S01 | `screenshots/S01_project-home-latest.png` | Project Home — latest overall screen | Findings 1, 2, 19, 36 |
| S02 | `screenshots/S02_study-main-latest.png` | Study Workspace — latest main state | Findings 8, 14, 15, 24, 31, 32, 34 |
| S03 | `screenshots/S03_study-phrasing-focused.png` | Study — Phrasing focused/full-screen state | Findings 9, 10, 32, 33 |
| S04 | `screenshots/S04_study-guidance-panel.png` | Study — Guidance/support panel state | Findings 8, 9, 14, 32 |
| S05 | `screenshots/S05_study-grade-docked.png` | Study — Grade/evaluation panel state | Findings 9, 12, 32, 33 |
| S06 | `screenshots/S06_study-support-collapsed.png` | Study — collapsed RHS support rail | Findings 8, 9, 14, 32 |
| S07 | `screenshots/S07_study-grade-floating.png` | Study — floating Grade panel | Findings 9, 11, 12, 32 |
| S08 | `screenshots/S08_study-companion.png` | Study — Study Companion / discussion state | Findings 9, 34, 35 |
| S09 | `screenshots/S09_research-latest.png` | Project Research — latest overall screen | Findings 3, 6, 7, 20, 22, 23, 24, 37, 38 |
| S10 | `screenshots/S10_source-intake-latest.png` | Source Intake — latest overall screen | Findings 4, 26, 27, 28, 39 |
| S11 | `screenshots/S11_segmentation-animation.png` | Segmentation — animation state | Findings 17, 18, 29, 30 |
| S12 | `screenshots/S12_segmentation-review-refine.png` | Segmentation — Review & Refine screen | Finding 16 |
| S13 | `screenshots/S13_source-intake-settings.png` | Source Intake — segmentation settings popover | Finding 28 |
| S14 | `screenshots/S14_exams-library.png` | Exams — assessment library | General release QA; design-system consistency |
| S15 | `screenshots/S15_exam-attempt.png` | Exams — assessment attempt | Finding 42 |
| S16 | `screenshots/S16_exam-results.png` | Exams — assessment results/remediation | Findings 40, 41 |
| S17 | `screenshots/S17_legacy-guidance-focused.png` | LEGACY REFERENCE — Guidance focused/full-screen interaction | Legacy interaction evidence only |
| S18 | `screenshots/S18_legacy-lexicography-floating.png` | LEGACY REFERENCE — Lexicography floating interaction | Legacy interaction evidence only |
| S19 | `screenshots/S19_legacy-guidance-floating.png` | LEGACY REFERENCE — Guidance floating interaction | Legacy interaction evidence only |
| S20 | `screenshots/S20_legacy-study-companion.png` | LEGACY REFERENCE — Study Companion interaction | Legacy interaction evidence only |
| S21 | `screenshots/S21_crop-project-card-bottom-padding.png` | DETAIL CROP — progress/attention/saved-support card bottom spacing | Finding 19 / card padding reference |
| S22 | `screenshots/S22_crop-study-history-status-pills.png` | DETAIL CROP — Study History DONE/REVIEW pill collisions | Finding 5 |
| S23 | `screenshots/S23_crop-research-title-metrics.png` | DETAIL CROP — Research title and right-weighted metrics | Findings 3, 22, 23 |
| S24 | `screenshots/S24_crop-research-left-cards.png` | DETAIL CROP — Research LHS typography, padding and empty space | Findings 6, 20 |
| S25 | `screenshots/S25_reference-advanced-options-card.png` | REFERENCE CROP — Advanced Options card as good padding/composition evidence | Reference for Findings 19, 20 |
| S26 | `screenshots/S26_crop-browse-all-work-pill.png` | DETAIL CROP — Browse all work secondary pill/button padding | Finding 21 |
| S27 | `screenshots/S27_crop-source-intake-narrow-clipping.png` | DETAIL CROP — Source Intake narrow/collapsed clipping and containment | Findings 4, 26, 27, 39 |
| S28 | `screenshots/S28_crop-exams-narrow.png` | DETAIL CROP — Exams at constrained width | Responsive visual QA |
| S29 | `screenshots/S29_crop-research-narrow-1.png` | DETAIL CROP — Research title wrap + LHS card behaviour at constrained width | Findings 3, 6, 20, 23 |
| S30 | `screenshots/S30_crop-research-narrow-2.png` | DETAIL CROP — Research LHS repeated constrained-width evidence | Findings 3, 6, 20, 23 |

# Operating rules

1. Inspect before changing: local vs component vs token vs shell vs responsive vs architectural.
2. Fix once, not per screenshot.
3. Do not standardise bad foundations.
4. Preserve successful current visual decisions.
5. Legacy screenshots are interaction evidence only, not visual authority.
6. Render and visually inspect every affected state after implementation.
7. Test reduced widths/heights and realistic content extremes.
8. Judge optical quality, not only token compliance.

# P0 — Release blockers / clearly unshippable

## 1. Global top-left Arapal lock-up is incorrectly positioned

The Arapal icon at the far top-left is visibly clipped against/beyond the viewport edge across the current shell.

Fix the shared product-identity/header primitive once and verify safe inset, full icon visibility, optical alignment with the wordmark, vertical centring and consistency across all major screens.

Also check active-rail indicators for the same left-safe-area problem.

## 2. Arabic/content clipping exists in current cards and compact rows

There are current examples where Arabic/project text is too close to card boundaries and appears clipped or vertically compressed, particularly in Project Home compact project rows.

Audit shared cards/rows for Arabic line-height, diacritic clearance, fixed heights, overflow, vertical centring and top/bottom padding.

Test with Arabic containing tall glyphs and diacritics.

## 3. Research title / hero has unstable wrap and clipping behaviour

`Al-Hidayah knowledge explorer` behaves inconsistently with available width: sometimes awkward wrapping, sometimes clipping/truncation.

Define intentional responsive behaviour using proper width constraints, typography and wrapping rules. Avoid arbitrary clipping.

Verify with longer project titles and narrower desktop widths.

## 4. Source Intake / collapsed layouts have real horizontal clipping

In reduced/collapsed states, the bottom AI action can be cut off on the right, the `PRESERVED SOURCE` pill can clip, preserved source content can escape/cut against its parent, and metadata can exceed width.

Audit min-width assumptions, flex/grid shrink behaviour, overflow, parent containment and responsive width calculations.

No control or content should be partially off-screen at supported widths.

## 5. Study History status pills have text colliding with their container

`DONE`, `REVIEW` and similar Study History status controls have insufficient internal padding.

Audit the shared compact status-pill primitive for minimum height, line-height, horizontal padding, uppercase letter spacing and width constraints.

Fix the primitive and inspect all status pills across the app.

## 6. Research LHS typography still appears to use a different system

`All / Segments / Vocabulary / Mistakes / Notes / Weak / Completed` visibly differs from global navigation and other Arapal compact navigation.

Inspect computed styles; do not assume whether the issue is font family or size/weight/line-height.

The Research sub-navigation may have its own hierarchy, but it must clearly belong to the same Arapal typography system.

Audit Revision Queue too.

## 7. Research global navigation shows ambiguous active state

`Projects` and `Project Research` can both appear selected/blue at once.

Parent context and current destination must not use effectively identical active styling.

Establish a clear current/parent/inactive hierarchy.

## 8. Study collapsed support rail still does not properly occupy the rail

The collapsed RHS support modules occupy only the upper portion and leave a large dead region below.

The collapsed state should deliberately use the usable vertical rail. Design robust distribution for variable module counts rather than hard-coding one exact percentage.

## 9. Support-panel state architecture is inconsistent

Support tools can appear docked, collapsed, floating, focused/modal, or as Study Companion. These feel independently implemented.

Create one shared support-module state model, conceptually covering docked / collapsed / floating / focused, with consistent header controls and predictable transitions.

Apply across Guidance, Lexicography, Phrasing, Grade, Fix Steps and Discussion/Companion.

## 10. Phrasing focused/full-screen state is badly oversized

Two short items sit at the top of a huge mostly empty white surface.

Focused views should expand the user's ability to work with the content, not simply enlarge a fixed card into a giant blank canvas.

## 11. Floating support panels obstruct primary work without clear control semantics

The floating Grade panel can cover source text and its header controls are not self-explanatory.

Make it obvious how to move/reposition if supported, dock/restore, close and focus.

Legacy `Float` affordances are useful interaction evidence; do not restore legacy styling.

## 12. Grading/evaluation has a potential trust-breaking contradiction

The Study screen says meaning and accuracy are not evaluated, yet simultaneously shows `Your Grade 4.2`, strengths, areas for improvement and substantive-looking feedback.

One supplied state shows nonsense input (`dsfdg`) while feedback praises accurate terminology.

Investigate this before visual polish.

If fixture-only, ensure production cannot surface contradictory evaluation. If real runtime behaviour, it is a release blocker.

Also clarify what `4.2` is out of and what it measures.

## 13. Pin action appears non-functional

The pin control reportedly does nothing.

Verify implementation. If pinning is intended, implement it and expose state. If it is not a real supported behaviour, remove the dead control.

## 14. RHS panel expand icon does not intuitively match the action

The two-left-arrows/chevrons affordance does not clearly communicate “expand this support panel”.

Choose an icon/treatment whose result is predictable before click. Use tooltip/hover support where appropriate.

## 15. Study top-bar `SEGMENT 1 OF 2` is compositionally unstable

The segment-progress indicator appears arbitrarily positioned around the 4/5 point of the top bar and can be hidden/clipped under `Focus view` at narrower widths.

Rework the header as a stable layout with title/context, segment progress and right-side actions as deliberate zones. Avoid absolute-position patches.

## 16. Review & Refine remains below public-release quality

It still feels like an internal design tool rather than a finished workflow.

Problems include:
- underused lower viewport;
- status/actions stranded at viewport edges;
- unexplained icon-only vertical toolbar;
- unclear toolbar scope;
- weak relationship between controls and edited object.

Recompose around inspect → adjust → approve. Do not merely add tooltips to a poor toolbar.

## 17. Segmentation animation contains transient visual collisions

`SEGMENT 01 / 02 / 03`, connector lines and the central glowing element crowd/overlap during motion.

Inspect the animation in motion / slowed down and remove transient collisions, clipping and tangencies.

## 18. Preserved-source concept is visually ambiguous during segmentation

The animation visually breaks `Preserved source` into blocks, which can imply the raw source has already been transformed.

Make it unmistakable that the original remains untouched and segmentation is a derived proposal.

# P1 — High-priority professional refinement

## 19. Project Home card padding is inconsistent

The compact project card has text/progress content too close to the lower edge and lacks balanced internal padding.

The `Advanced Options` card is a better example of card-quality and spacing, but do not copy dimensions blindly.

Audit shared compact-card/row primitives.

## 20. Research LHS cards have excessive/uneven internal space

`Research lenses` and `Revision Queue` have unbalanced padding and large unused areas.

Determine whether they should be content-sized, use intentional internal zones, or participate in a fixed-height navigation structure. Do not leave accidental blank regions inside cards.

## 21. `Browse all work` secondary pill has poor internal padding

Its icon/label spacing and internal padding are visibly uneven/cramped.

Audit the shared outlined secondary-button/pill component: icon gap, vertical centring, radius, min height, horizontal padding.

## 22. Research top information pills feel awkwardly right-weighted

`30 segments / 32 vocab notes / 18 review points / Study Mode` are visually concentrated on the right and disconnected from the title.

Do not simply centre them. Re-evaluate what belongs with the title versus actions/mode controls and produce a balanced header composition.

## 23. Research title block and metrics need one responsive model

Treat the title, metrics and Study Mode as one responsive header system.

Test long/short titles, narrower widths and different metric counts. No clipping, awkward wrap or unexplained whitespace.

## 24. Global LHS navigation is too wide for deep workspaces

Expanded global navigation consumes excessive width in Research/Study where a second workspace-specific pane is present.

Establish a navigation-depth policy. Deep workspaces may warrant compact global nav, but determine the best model from the product rather than implementing that blindly.

## 25. Collapsed global nav active indicator is positioned poorly

The blue active line is too close to the icon and reads like icon decoration.

Move it toward the rail's left edge with deliberate safe padding. Verify consistent inset and no viewport clipping.

## 26. Source Intake corner markers are too detached from the editor

The four curved corner markers sit too far away from the box.

Bring them optically closer so they read as an accent/frame attached to the editor, while preserving breathing room.

## 27. Source Intake alignment is subtly inconsistent

Heading/supporting copy and editor/content bounds do not share a clean visual grid; left text can sit further left than boxes and the RHS has corresponding misalignment.

Establish one intentional alignment grid and check optical alignment.

## 28. Source Intake settings popover obscures too much of the task

The segmentation configuration popover covers the page title and substantial source-editor content.

At large desktop widths, users should remain oriented to the source they are configuring. Reconsider anchor, width, max-height and placement.

## 29. `Always skip this animation` does not clearly look actionable

It reads like uppercase explanatory text beside `Skip`.

If actionable, use a clear checkbox/toggle/link/action treatment appropriate to persistence.

## 30. Segmentation numbering is inconsistent

Both `SEGMENT 01 / 02 / 03` and `SEGMENT 1 / 2 / 3` appear.

Choose one intentional convention in this workflow.

## 31. Study segment navigation truncates important Arabic labels aggressively

Verify pane width, Arabic line-height, tooltip/full-title access, selected-state behaviour and long-title handling.

## 32. Support-panel header grammar remains inconsistent

Standardise the family resemblance across title typography, icon placement, header height, close, expand/focus, float/dock, pin and colour.

## 33. Support colour semantics are overloaded

Orange appears in retry/warning states and several support-module families.

Define whether orange is warning/error, advisory/support identity, or something else. Do not overload it across conflicting meanings.

## 34. `Discuss` scope is unclear

Legacy `Discuss This Segment` communicated scope better.

Do not blindly restore that wording, but make it obvious that discussion is attached to the current segment.

## 35. `Hide` and `Close` create redundant state controls

When Study Companion is open, `Hide` can appear in the translation area while the Companion also has `Close`.

Clarify whether these are the same action; use one coherent state-management model.

## 36. Project Home remains vertically underweighted at low project counts

The hierarchy is good but useful content ends high in a large desktop viewport.

Do not add filler. Refine vertical composition/responsive spacing so low-content states still feel deliberately finished.

## 37. Research consumes too much width before the ledger begins

Expanded global nav + Research nav constrain the primary research ledger enough to force truncation even on a wide viewport.

Resolve systemically with the navigation-depth/layout policy.

## 38. Research ledger column labelling is not as clear as the row structure

The grouped heading `ARABIC EXTRACT · TRANSLATION SIGNAL · STATUS` does not map cleanly onto index, Arabic, translation, concept/title, metadata/tags and status.

Improve scanability and column semantics without turning it into a heavy spreadsheet.

## 39. Source Intake helper/metadata text approaches illegibility

Audit small uppercase/letter-spaced metadata such as `AI PROPOSAL · MEANING GROUPS · BALANCED`, keyboard/paste helper and other secondary labels for readable size, weight and contrast.

## 40. Exam result action hierarchy conflicts with the remediation loop

The results page says the user should take misses back into Study, but the dominant blue CTA is `BACK TO ASSESSMENTS` and `Open in study` is secondary.

Re-evaluate the primary post-exam action.

## 41. Exam results duplicate return navigation

`Assessment library` in the header and `BACK TO ASSESSMENTS` both return the user to essentially the same place.

Remove duplication or give the prominent CTA a more valuable role.

## 42. Exam attempt metadata `1 min` is ambiguous

Clarify whether this means estimated, elapsed or remaining time.

# Legacy screenshot guidance

The legacy screenshots are **not authoritative visual designs**.

Do not restore their old shell, top navigation, typography, spacing or styling.

Use them only where they demonstrate better interaction principles:
- explicit `Float`;
- content-sized floating support cards;
- predictable float/dock/focus/close transitions;
- appropriately sized focused mode;
- `Discuss This Segment` scope;
- Study Companion as a supporting movable/dockable workspace;
- consistent support-module header controls.

The latest Arapal visual system remains authoritative.

# Foundation audit required before local patching

The latest screenshots still show evidence that some components bypass shared foundations.

Before local fixes, inspect authoritative primitives for:

### Typography
Display heading, page title, section heading, card title, body, supporting body, Arabic/source text, metadata, uppercase labels, navigation, buttons, pills/badges/filters.

### Compact controls
Status pill, metadata pill, filter, count, secondary action, mode selector, outlined button.

### Cards
Standard card, compact row, navigation card, result/status card, support-module card. Define clear padding/rhythm rules.

### Shell/navigation
Top-bar safe area, logo lock-up, expanded/collapsed nav width, active indicator, header zones, back navigation, top-bar actions, deep-workspace nav policy.

### Support modules
Create one shared state/interaction architecture rather than per-module implementations.

# Professional fine-tooth-comb QA

After the explicit fixes, inspect all affected screens again for additional issues in the same class:

- clipping and overflow;
- text touching borders;
- Arabic diacritic clearance;
- inconsistent line-height;
- misaligned baselines;
- uneven card/pill padding;
- icon-to-label gaps;
- left/right safe-area violations;
- accidental whitespace;
- title wrapping;
- modal sizing;
- dead space inside cards;
- transient animation collisions;
- ambiguous active states;
- dead controls;
- ambiguous icons;
- inconsistent typography;
- inconsistent navigation widths;
- hidden controls at narrower widths;
- hover/focus/selected/disabled states.

The findings above calibrate the scrutiny level; they are not exhaustive.

# Verification requirements

For every numbered finding, return:

- **PASS** — implemented and visually verified;
- **PARTIAL** — improved but below release bar;
- **BLOCKED** — cannot resolve, with evidence;
- **NOT REPRODUCED** — could not reproduce.

For each PASS, state:
- whether the cause was local or systemic;
- which shared component/token/shell primitive changed where relevant;
- which rendered screen/state/width was inspected.

Also report:
- new defects discovered;
- any direction intentionally not followed and why;
- regressions caused by shared-foundation changes.

# Final exit criterion

Do not ask “Did I implement the feedback?”

Ask:

> Would an experienced product designer, creative director and demanding first-time customer now find anything visibly out of place, confusing, clipped, inconsistent or unfinished in these rendered screens?

If yes, continue iterating.

The pass is complete only when the rendered product — not the code diff — meets that bar.
