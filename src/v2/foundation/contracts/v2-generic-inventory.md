# V2 Generic Inventory

## Purpose
This file is the working inventory for all reusable V2 system pieces.

It exists to prevent drift between:
- product truth
- visual truth
- V2 implementation truth

Use it to decide what should be:
- extracted
- refined
- locked
- deferred

See also:

- `AGENTS.md` for product constitution
- `v2-canon.md` for the concise rule canon
- `foundation-contracts.md` for implementation doctrine

## Source Hierarchy
- `Current app` = product truth
- `Old app` = visual/detail truth when stronger
- `V2` = canonical truth once the generic is extracted and approved

## How To Use
1. Identify the generic item.
2. Confirm whether it is layout, primitive, styling, interaction, motion, or screen-pattern.
3. Inspect the current app for product truth.
4. Inspect the old app for the strongest visual/detail expression.
5. Rebuild the item in V2.
6. Once approved, update `Status` to `Locked` and treat V2 as the only source of truth.

## Status Legend
- `Locked` = approved and ready to reuse
- `Active extraction` = currently being rebuilt into V2
- `Not yet extracted` = known generic with no shared V2 implementation yet
- `Candidate` = likely reusable, needs extraction
- `Needs redesign` = important, but current form is not yet fit to canonize
- `Deferred` = not needed yet

## Confidence Scale
- `5` = very strong candidate for final design / wide reuse
- `4` = strong candidate, likely reusable with minor cleanup
- `3` = promising, but needs design or structural review
- `2` = uncertain or only partly reusable
- `1` = weak candidate; probably should not be canonized as-is

## Working Rules
- `PanelCornerCasing` must stay attached to the editor family, not float as a separate decorative system.
- A screen may own:
  - layout composition
  - screen-specific copy/content
  - screen-specific state wiring
- A screen may not own:
  - generic button styling
  - generic panel chrome
  - generic editor chrome
  - generic popover/menu styling
  - generic utility-control behavior

## Review Boards
These visual boards are where generics are judged before they are reused in product screens.

Current rule:
- the board set is now frozen as a reference layer
- reopen a board only if a real product gap appears or a locked generic fails under real use

| Board | Route | Focus |
| --- | --- | --- |
| Lab index | `foundationLab` | entry point for the review workflow |
| Controls Lab | `controlsLab` | CTAs, utility controls, pills, toggles, and action rows |
| Editor + Panels Lab | `editorPanelsLab` | editor family, panel family, support cards, and attached casing |
| Typography + Tokens Lab | `typographyTokensLab` | type roles, color roles, radius, elevation, and backdrop language |
| Motion + Interaction Lab | `motionInteractionLab` | hover, focus, dismissal, open/close, and motion rules |
| Pattern Lab | `patternLab` | repeated screen-pattern families above single primitives |

## Board Coverage
This is the review map. A generic is not considered system-ready until it has been judged on its board and marked appropriately.

### Controls Lab
- Navigation rail
- Navigation rail row
- Screen mode icon set
- Utility icon control (`pin`, `back`, `expand`, `collapse`, `close`)
- Back pill
- Step bar
- Primary CTA
- Split CTA
- Preference toggle row
- Status chip / badge
- Action pill

### Editor + Panels Lab
- Mode surface marks
- Source intake brand
- Editor surface
- Editor formatting toolbar
- Options popover
- Support card family
- Support rail card
- Floating support preview
- Expanded focus support surface
- Numbered takeaway item
- Lexicography entry row

### Typography + Tokens Lab
- Typography role system
- Blue/slate semantic palette
- Stage backdrop / watermark treatment
- Readable inset / padding discipline
- Panel border / radius / shadow language
- Semantic surface tone palette
- Editor chrome opacity rules

### Motion + Interaction Lab
- Utility control hover reveal
- Outside-click dismissal for overlays
- Escape-to-close overlays
- Segment tree expand/collapse
- Support-panel collapse/expand
- Hover preview + pin-to-keep-open
- Floating panel drag/resize
- Float / dock support panel
- Split CTA open/select/close behavior
- Editor shortcut hint behavior
- Hover/focus micro-motion
- Menu/panel open motion
- Screen intro/transition motion
- Focused expand with dim backdrop
- Support preview reveal motion
- CTA sheen sweep
- Hover lift for primary surfaces
- Reduced motion fallbacks

### Pattern Lab
- Layer 1 universal shell
- Layer 2 default split
- Operational center-band stack
- Full-width work stage
- Layer 5 content owner
- Centered stage stack
- Hero / two-up / footer shell
- Study three-pane shell
- Browse + content shell
- Pattern mappings:
  - Segmentation -> Operational center-band stack
  - Patching -> Hero / two-up / footer shell
  - Exams -> Centered stage stack
  - Success / review -> Centered stage stack

## Layout Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Shared screen shell (`Layer1` + `Layer2`) | Current V2 shell | Current app shell proportions | 5 | 5 | Locked | Keep stable unless a true shell bug is found. |
| Canonical shell sizing math | Current V2 shell | Current app study shell behavior | 5 | 5 | Locked | Nav collapsed/expanded and center-yield logic are system-level. |
| Contract renderer + debug-named containers | Current V2 | N/A | 5 | 5 | Locked | Core engineering asset. |
| Default V2 body backdrop preset | Current V2 | Current app atmosphere + old app watermark cues | 4 | 5 | Locked | Shared preset; screens may opt into bespoke presets later. |
| Study three-pane workspace layout | Current app | Current app study screen | 5 | 5 | Locked | Product-critical shell pattern; internal support-card subdivision belongs below pattern level. |
| Segmentation operational center-band layout | Current app | Current app segmentation + V2 contract | 5 | 5 | Locked | Canonical operational stage family now uses the approved centered stack `0.4 / 0.25 / 0.1 / 0.5 / 0.1 / 0.25 / 0.4 / 5 / 2` inside layout-owned Layer 2 gutters. |
| Centered stage stack | Current app intro/exams/success | Current app + old app centered stages | 5 | 5 | Locked | Shared family for entry, exams, and success/review states. |
| Full-width work stage | Current app | Current app segmentation + study | 4 | 5 | Locked | Shared family where the main work zone spans the full `13x` body. |
| Layer 5 content owner | Current V2 | Current app centered surfaces | 4 | 5 | Locked | Focused content owner inside the established shell, not a shell replacement. |

## Primitive Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Navigation rail | Current app | Current app study shell | 4 | 5 | Locked | Shared shell primitive; expanded canonical state, hover-expand, and pin/unpin behavior are now approved. |
| Navigation rail row | Current app | Current app study shell | 4 | 5 | Locked | Includes active state, hover, icon + label logic. |
| Screen mode icon set | Current app | Current app study shell | 4 | 5 | Locked | Canonical icon set for Home, Projects, Study, Segmentation, and Exams. The board framing around them is not part of the generic. |
| Utility icon control (`pin`, `back`, `expand`, `collapse`, `close`) | Current app | Current app study shell | 5 | 5 | Locked | Small utility control family; shared hover box pattern. |
| Back pill | Current app segmentation | Old app segmentation | 4 | 4 | Locked | Directional action variant in the shared action-control family. |
| Step bar | Current app segmentation | Old app segmentation | 4 | 4 | Locked | Applies to multi-step operational flows and now has a shared V2 primitive path. |
| Source intake brand | Current app segmentation | Old app segmentation | 4 | 4 | Locked | Segmentation-specific identity cluster now lives as a shared operational-shell primitive. |
| Mode surface marks | Current V2 | Current app + V2 | 4 | 4 | Locked | Shared icon + title/subtitle mark structure for mode-bound editor surfaces. |
| Operational panel | Current app segmentation | Old app segmentation | 5 | 5 | Candidate | High-value base family for operational screens. |
| Editor surface | Current app segmentation + study | Old app segmentation editor chrome | 5 | 5 | Locked | Shared editor surface with band/slot ownership, edge-safe inset geometry, and direct debug coverage. |
| Editor topbar | Current app segmentation + study | Old app segmentation editor chrome | 4 | 5 | Deferred | Reviewed as part of the Editor surface family, not as a standalone generic. |
| Editor footer | Current app segmentation + study | Old app segmentation editor chrome | 4 | 5 | Deferred | Reviewed as part of the Editor surface family, not as a standalone generic. |
| Panel corner casing | Current app segmentation | Old app segmentation | 4 | 4 | Deferred | Must stay attached to the Editor surface family, not reviewed separately. |
| Editor formatting toolbar | Current study/editor needs | V1 translation controls + V2 editor family | 3 | 4 | Candidate | Text-capable editor variant with formatting controls and a future deterministic QA Check action. |
| Primary CTA | Current app segmentation/home | Old app segmentation CTA finesse | 5 | 5 | Locked | Canonical premium primary action treatment. |
| Split CTA | Current app segmentation | Old app segmentation | 5 | 5 | Locked | Very important shared primitive. Chevron direction is state-driven, not a separate generic. |
| Options popover | Current app segmentation | Old app segmentation advanced menu | 4 | 5 | Locked | Exact shared segmentation popover family. Outside-click dismissal should be standard. |
| Preference toggle row | Current app segmentation | Old app segmentation | 4 | 5 | Locked | Shared settings-style row with label, meta, and toggle state. |
| Segment tree row | Current app study | Current app study left pane | 4 | 5 | Candidate | Includes folder/leaf/state icon treatment. |
| Segment tree folder row | Current app study | Current app study left pane | 4 | 5 | Candidate | Related to tree row but distinct variant. |
| Status chip / badge | Current app study + segmentation | Current app | 4 | 5 | Candidate | Good shared semantic primitive. |
| Action pill | Current app study | Current app study center pane | 3 | 4 | Candidate | Worth extracting after core panels/buttons. |
| Support card family | Current app study | Current app study right pane | 5 | 5 | Locked | One shared support-card chrome family with content/tone variants like guidance and lexicography. |
| Support rail card (collapsed preview card) | Current app study | Current app study right pane | 4 | 5 | Locked | Useful for collapsed support mode with tone-matched premium hover/fill. |
| Floating support preview | Current app study | Current app study right pane | 4 | 4 | Candidate | Visually strong; still needs structural audit. |
| Expandable support modal | Current app study | Current app study right pane | 4 | 4 | Deferred | Consolidated into the Expanded focus support surface state family. |
| Expanded focus support surface | Current app study | Current app study right pane | 4 | 4 | Candidate | Front-and-center expanded support state with dimmed backdrop and full lexicography table. |
| Floating panel header + actions | Current app study | Current app study right pane | 4 | 4 | Candidate | Includes title row, pin/close controls, and drag affordance. |
| Floating panel resize affordance | Current app study | Current app study right pane | 3 | 3 | Candidate | Useful, but needs deliberate product-level rules. |
| Feedback block | Current app study | Current app study right pane | 4 | 4 | Candidate | Reusable in review/assessment surfaces. |
| Numbered takeaway item | Current app study | Current app study right pane | 4 | 4 | Candidate | Good secondary instructional primitive. |
| Grade circle | Current app study | Current app study right pane | 3 | 3 | Candidate | Useful for exams/review, but needs more system thinking. |
| Lexicography entry row | Current app study | Current app study right pane | 4 | 4 | Candidate | Strong study-support primitive. |
| Quick lex term chip/tooltip | Current app study | Current app study center pane | 3 | 3 | Candidate | Nice, but less core than panels/editor/CTA. |
| Project home destination card | Current app home | Current app home | 4 | 5 | Candidate | Core family for command-center surfaces. |
| Best in class translation card | Current app study | Current app study center pane | 4 | 4 | Candidate | Strong submitted-state reference card with success tone and pin/copy behavior. |
| Your translation card | Current app study | Current app study center pane | 4 | 4 | Candidate | Comparison card that likely belongs to a reusable submitted-state family. |
| Discussion summary + notes card | Current app study | Current app study center pane | 4 | 4 | Candidate | Reflection surface with empty, compose, and populated states. |
| Submission jump bar | Current app study | Current app study center pane | 4 | 4 | Candidate | Bottom-anchored post-submit navigation/control family. |
| Workspace card family (`source`, `editor`, `result`, `support-inline`) | Current app study | Current app study | 3 | 5 | Needs redesign | Important family, but not yet fit to freeze visually. |

## Styling Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Typography role system | Current V2 contracts | Current app + old app | 5 | 5 | Locked | Keep tokenized, not screen-local. |
| Blue/slate semantic palette | Current V2 contracts | Current app segmentation | 5 | 5 | Locked | Foundation-level. |
| Stage backdrop / watermark treatment | Current V2 backdrop | Current app + old app | 4 | 5 | Locked | Shared preset system exists; more bespoke presets can come later. |
| Editor watermark treatment | Current app segmentation | Old app segmentation | 4 | 4 | Deferred | Reviewed inside the Editor surface family, not on the Typography board. |
| Panel border / radius / shadow language | Current V2 + current app | Current app home/study/segmentation | 4 | 5 | Candidate | Needs stronger implementation centralization. |
| Readable inset / padding discipline | Current V2 doctrine | Current app + V2 | 5 | 5 | Locked | Every text-bearing surface must preserve the minimum readable inset from edge to text. |
| Primary CTA sheen / highlight language | Current app segmentation | Old app segmentation | 5 | 5 | Locked | Owned and judged on the Controls board as part of the Primary CTA family. |
| Utility hover box treatment | Current app study | Current app study | 5 | 5 | Locked | Shared small-control style. |
| Semantic surface tone palette | Current app study | Current app study + success/fail states | 4 | 5 | Locked | Tone primarily affects surface, border, shadow, icon, and occasionally short titles; body/support text remain neutral by default. |
| Editor chrome opacity rules | Current app segmentation | Old app segmentation | 4 | 4 | Locked | Standardized values should be shared rather than re-decided per screen. |
| Home hero / door card treatment | Current app home | Current app home | 4 | 4 | Candidate | Reviewed on the Pattern board, not Typography. |

## Interaction Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Navigation hover-expand + pin/unpin | Current app study | Current app study | 5 | 5 | Locked | Contract-level shell behavior. |
| Utility control hover reveal | Current app study | Current app study | 5 | 5 | Locked | Shared hover-box treatment for pin, back, expand, collapse, and related mini-controls. |
| Outside-click dismissal for overlays | Current app patterns | Current app + V2 | 5 | 5 | Locked | Standard unless a surface is pinned. |
| Escape-to-close overlays | Current app patterns | Current app + V2 | 5 | 5 | Locked | Same rule family as outside-click. |
| Segment tree expand/collapse | Current app study | Current app study | 4 | 5 | Candidate | Reusable within hierarchical lists. |
| Support-panel collapse/expand | Current app study | Current app study | 4 | 5 | Candidate | Important workspace interaction pattern. |
| Hover preview + pin-to-keep-open | Current app study | Current app study right pane | 3 | 4 | Candidate | Promising, but needs audit before canonization. |
| Floating panel drag/resize | Current app study | Current app study right pane | 2 | 3 | Candidate | Powerful, but should be treated cautiously. |
| Float / dock support panel | Current app study | Current app study center pane | 4 | 4 | Candidate | Current study implementation is the reference to preserve when systematizing this family. |
| Split CTA open/select/close behavior | Current app segmentation | Old app segmentation | 5 | 5 | Candidate | Needs systemization with CTA primitive. |
| Focused expand with dim backdrop | Current app study | Current app study center pane | 4 | 4 | Candidate | Shared overlay behavior candidate for support-focused reading modes. |
| Support preview reveal motion | Current app study | Current app study right pane | 3 | 4 | Candidate | Part interaction, part motion; should be reviewed as a distinct family. |
| Control hover hints / shortcut hints | Current app segmentation + study | Current app + old app | 4 | 4 | Candidate | Useful broader rule: controls should expose a helpful hover hint when meaning is not already obvious. |

## Motion Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Hover/focus micro-motion | Current V2 contracts | Current app study/segmentation | 5 | 5 | Locked | Tokenized durations/easing already defined. |
| Menu/panel open motion | Current V2 contracts | Current app study/segmentation | 4 | 5 | Candidate | Needs reusable implementation helpers. |
| Screen intro/transition motion | Current V2 contracts | Current app segmentation | 4 | 4 | Candidate | Strong current reference; preserve the existing motion character while systematizing it later. |
| Focused expand with dim backdrop | Current app study | Current app study | 4 | 4 | Candidate | Transition family for taking a support surface into temporary focus. |
| Support preview reveal motion | Current app study | Current app study | 3 | 4 | Candidate | Hover-preview motion should clarify, not surprise. |
| CTA sheen sweep | Current app segmentation | Old app segmentation | 5 | 5 | Locked | Shared premium detail reserved for large ceremonial CTAs. |
| Hover lift for primary surfaces | Current app home/segmentation | Current app | 4 | 5 | Candidate | Should be tied to elevation scale. |
| Reduced motion fallbacks | V2 requirement | N/A | 5 | 5 | Deferred | Important, but intentionally left for late stabilization rather than current review focus. |

## Screen-Pattern Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Hero / two-up / footer shell | Current app home + patching doctrine | Current app home | 5 | 5 | Locked | Shared mode-level family for Home and current Patching direction. |
| Source intake / segmentation operational workspace | Current app segmentation | Old app segmentation | 5 | 5 | Locked | Mapped to the locked operational center-band stack rather than treated as its own separate family. |
| Study workspace main loop shell | Current app study | Current app study | 5 | 5 | Locked | Mapped to the locked study three-pane shell. |
| Browse + content shell | Current app projects | Current app projects | 4 | 5 | Locked | Shared browse/index family with one stable browse lane and one larger content field. |
| Support rail + floating preview system | Current app study | Current app study | 3 | 4 | Candidate | Good, but still needs structural audit. |
| Review / remediation support state set | Current app study | Current app study | 4 | 4 | Candidate | Useful across study and exams. |
| Segmentation success stage | Current app segmentation | Old app segmentation | 4 | 5 | Locked | Mapped to the locked centered stage stack. |
| Best in class / your translation comparison stack | Current app study | Current app study | 4 | 4 | Candidate | Submitted-state center-lane pattern with compare and pin behaviors. |
| Discussion summary + notes flow | Current app study | Current app study | 4 | 4 | Candidate | Submitted-state reflection pattern with empty and populated states. |
| Docked discussion companion | Current app study | Current app study | 4 | 4 | Candidate | Attached help surface that preserves segment context. |
| Floating discussion panel | Current app study | Current app study | 3 | 4 | Candidate | Detachable discussion state that may generalize beyond one screen. |
| Focused discussion modal | Current app study | Current app study | 3 | 4 | Candidate | Expanded discussion mode with dimmed backdrop and centered focus. |
| Exams focus shell | Current app exams | Current app exams | 4 | 5 | Locked | Mapped to the locked centered stage stack. |
| Projects index shell | Current app projects | Current app projects | 4 | 5 | Locked | Mapped to the locked browse + content shell. |
| Patching / corrections shell | Current patching doctrine | Home + current correction flow direction | 4 | 4 | Locked | Current base direction is the hero / two-up / footer family; only extract a new family later if real product structure proves different. |

## Immediate Extraction Wave
These are the highest-value items to extract next before rebuilding more full screens.

| Priority | Item | Reason |
| --- | --- | --- |
| 1 | Editor surface family | Central to segmentation and likely reusable in study/patching. |
| 2 | Primary CTA + Split CTA | High-visibility design language and repeated behavior. |
| 3 | Operational panel family | Needed across segmentation and other operational screens. |
| 4 | Options popover + preference row | Prevents repeated local overlay logic. |
| 5 | Back pill + step bar + source intake brand | Stabilizes segmentation header composition. |
| 6 | Support panel family | Makes study and future support surfaces much more repeatable. |
| 7 | Segment tree row family | Strong study-specific reusable pattern. |

## Notes For Review Sessions
- When a generic is reviewed and approved, update `Status` to `Locked`.
- Once locked, the V2 implementation becomes canonical and future screens must consume it rather than restyling locally.
- If a screen needs something genuinely bespoke, document it as a screen-pattern exception rather than silently mutating a shared generic.
- Labs are now frozen reference boards by default; do not keep expanding them unless a real product gap appears.
