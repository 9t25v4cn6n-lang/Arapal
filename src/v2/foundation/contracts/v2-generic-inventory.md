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
- Utility icon control (`pin`, `back`, `expand`, `collapse`, `close`)
- Back pill
- Step bar
- Primary CTA
- Split CTA
- Preference toggle row
- Status chip / badge
- Action pill

### Editor + Panels Lab
- Source intake brand
- Operational panel
- Editor surface
- Editor topbar
- Editor footer
- Panel corner casing
- Options popover
- Support panel card
- Support rail card
- Floating support preview
- Expandable support modal
- Feedback block
- Numbered takeaway item
- Lexicography entry row

### Typography + Tokens Lab
- Typography role system
- Blue/slate semantic palette
- Stage backdrop / watermark treatment
- Editor watermark treatment
- Panel border / radius / shadow language
- Primary CTA sheen / highlight language
- Support panel tone system
- Editor chrome opacity rules
- Home hero / door card treatment

### Motion + Interaction Lab
- Utility control hover reveal
- Outside-click dismissal for overlays
- Escape-to-close overlays
- Segment tree expand/collapse
- Support-panel collapse/expand
- Hover preview + pin-to-keep-open
- Floating panel drag/resize
- Split CTA open/select/close behavior
- Editor shortcut hint behavior
- Hover/focus micro-motion
- Menu/panel open motion
- Screen intro/transition motion
- CTA sheen sweep
- Hover lift for primary surfaces
- Reduced motion fallbacks

### Pattern Lab
- Study three-pane workspace layout
- Segmentation operational center-band layout
- Success-stage centered flow layout
- Segment tree row
- Segment tree folder row
- Quick lex term chip/tooltip
- Grade circle
- Project home destination card
- Workspace card family (`source`, `editor`, `result`, `support-inline`)
- Project Home command deck
- Source intake / segmentation operational workspace
- Study workspace main loop shell
- Support rail + floating preview system
- Review / remediation support state set
- Segmentation success stage
- Exams focus shell
- Projects index shell
- Patching / corrections shell

## Layout Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Shared screen shell (`Layer1` + `Layer2`) | Current V2 shell | Current app shell proportions | 5 | 5 | Locked | Keep stable unless a true shell bug is found. |
| Canonical shell sizing math | Current V2 shell | Current app study shell behavior | 5 | 5 | Locked | Nav collapsed/expanded and center-yield logic are system-level. |
| Contract renderer + debug-named containers | Current V2 | N/A | 5 | 5 | Locked | Core engineering asset. |
| Default V2 body backdrop preset | Current V2 | Current app atmosphere + old app watermark cues | 4 | 5 | Locked | Shared preset; screens may opt into bespoke presets later. |
| Study three-pane workspace layout | Current app | Current app study screen | 4 | 5 | Candidate | Product-critical screen pattern. |
| Segmentation operational center-band layout | Current app | Current app segmentation + V2 contract | 4 | 4 | Candidate | Keep `1 / 2 / 1 / 10 / 3` style as screen-pattern logic. |
| Success-stage centered flow layout | Current app | Old app segmentation success | 3 | 4 | Candidate | Needs formal screen-pattern extraction later. |

## Primitive Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Navigation rail | Current app | Current app study shell | 4 | 5 | Active extraction | Shared shell primitive; avoid per-screen variants. |
| Navigation rail row | Current app | Current app study shell | 4 | 5 | Candidate | Includes active state, hover, icon + label logic. |
| Utility icon control (`pin`, `back`, `expand`, `collapse`, `close`) | Current app | Current app study shell | 5 | 5 | Active extraction | Small utility control family; shared hover box pattern. |
| Back pill | Current app segmentation | Old app segmentation | 4 | 4 | Candidate | Segmentation family first, but likely usable elsewhere. |
| Step bar | Current app segmentation | Old app segmentation | 4 | 4 | Candidate | Applies to multi-step operational flows. |
| Source intake brand | Current app segmentation | Old app segmentation | 4 | 3 | Candidate | Likely segmentation-specific but still reusable within that mode. |
| Operational panel | Current app segmentation | Old app segmentation | 5 | 5 | Candidate | High-value base family for operational screens. |
| Editor surface | Current app segmentation + study | Old app segmentation editor chrome | 5 | 5 | Active extraction | Major missing primitive. |
| Editor topbar | Current app segmentation + study | Old app segmentation editor chrome | 4 | 5 | Candidate | Should sit under the editor family. |
| Editor footer | Current app segmentation + study | Old app segmentation editor chrome | 4 | 5 | Candidate | Includes shortcut and meta patterns. |
| Panel corner casing | Current app segmentation | Old app segmentation | 4 | 4 | Candidate | Must stay attached to editor/panel family. |
| Primary CTA | Current app segmentation/home | Old app segmentation CTA finesse | 5 | 5 | Active extraction | Needs one canonical premium treatment. |
| Split CTA | Current app segmentation | Old app segmentation | 5 | 5 | Candidate | Very important shared primitive. |
| Options popover | Current app segmentation | Old app segmentation advanced menu | 4 | 5 | Candidate | Outside-click dismissal should be standard. |
| Preference toggle row | Current app segmentation | Old app segmentation | 4 | 5 | Candidate | Could generalize to app-wide settings rows. |
| Segment tree row | Current app study | Current app study left pane | 4 | 5 | Candidate | Includes folder/leaf/state icon treatment. |
| Segment tree folder row | Current app study | Current app study left pane | 4 | 5 | Candidate | Related to tree row but distinct variant. |
| Status chip / badge | Current app study + segmentation | Current app | 4 | 5 | Candidate | Good shared semantic primitive. |
| Action pill | Current app study | Current app study center pane | 3 | 4 | Candidate | Worth extracting after core panels/buttons. |
| Support panel card | Current app study | Current app study right pane | 5 | 5 | Candidate | Strong candidate for support family. |
| Support rail card (collapsed preview card) | Current app study | Current app study right pane | 4 | 5 | Candidate | Useful for collapsed support mode. |
| Floating support preview | Current app study | Current app study right pane | 4 | 4 | Candidate | Visually strong; still needs structural audit. |
| Expandable support modal | Current app study | Current app study right pane | 4 | 4 | Candidate | Related to support panel family. |
| Feedback block | Current app study | Current app study right pane | 4 | 4 | Candidate | Reusable in review/assessment surfaces. |
| Numbered takeaway item | Current app study | Current app study right pane | 4 | 4 | Candidate | Good secondary instructional primitive. |
| Grade circle | Current app study | Current app study right pane | 3 | 3 | Candidate | Useful for exams/review, but needs more system thinking. |
| Lexicography entry row | Current app study | Current app study right pane | 4 | 4 | Candidate | Strong study-support primitive. |
| Quick lex term chip/tooltip | Current app study | Current app study center pane | 3 | 3 | Candidate | Nice, but less core than panels/editor/CTA. |
| Project home destination card | Current app home | Current app home | 4 | 5 | Candidate | Core family for command-center surfaces. |
| Workspace card family (`source`, `editor`, `result`, `support-inline`) | Current app study | Current app study | 3 | 5 | Needs redesign | Important family, but not yet fit to freeze visually. |

## Styling Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Typography role system | Current V2 contracts | Current app + old app | 5 | 5 | Locked | Keep tokenized, not screen-local. |
| Blue/slate semantic palette | Current V2 contracts | Current app segmentation | 5 | 5 | Locked | Foundation-level. |
| Stage backdrop / watermark treatment | Current V2 backdrop | Current app + old app | 4 | 5 | Locked | Shared preset system exists; more bespoke presets can come later. |
| Editor watermark treatment | Current app segmentation | Old app segmentation | 4 | 4 | Candidate | Should live under editor family, not as ad hoc text. |
| Panel border / radius / shadow language | Current V2 + current app | Current app home/study/segmentation | 4 | 5 | Candidate | Needs stronger implementation centralization. |
| Primary CTA sheen / highlight language | Current app segmentation | Old app segmentation | 5 | 5 | Candidate | Important premium-system detail. |
| Utility hover box treatment | Current app study | Current app study | 5 | 5 | Active extraction | Shared small-control style. |
| Support panel tone system | Current app study | Current app study right pane | 4 | 5 | Candidate | Blue/purple/orange/emerald/rose tones need canonization rules. |
| Editor chrome opacity rules | Current app segmentation | Old app segmentation | 4 | 4 | Candidate | Needed because recent drift showed how easy this is to get wrong. |
| Home hero / door card treatment | Current app home | Current app home | 4 | 4 | Candidate | Likely close to final. |

## Interaction Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Navigation hover-expand + pin/unpin | Current app study | Current app study | 5 | 5 | Locked | Contract-level shell behavior. |
| Utility control hover reveal | Current app study | Current app study | 5 | 5 | Active extraction | Shared for pin/back/expand/collapse. |
| Outside-click dismissal for overlays | Current app patterns | Current app + V2 | 5 | 5 | Locked | Standard unless a surface is pinned. |
| Escape-to-close overlays | Current app patterns | Current app + V2 | 5 | 5 | Locked | Same rule family as outside-click. |
| Segment tree expand/collapse | Current app study | Current app study | 4 | 5 | Candidate | Reusable within hierarchical lists. |
| Support-panel collapse/expand | Current app study | Current app study | 4 | 5 | Candidate | Important workspace interaction pattern. |
| Hover preview + pin-to-keep-open | Current app study | Current app study right pane | 3 | 4 | Candidate | Promising, but needs audit before canonization. |
| Floating panel drag/resize | Current app study | Current app study right pane | 2 | 3 | Candidate | Powerful, but should be treated cautiously. |
| Split CTA open/select/close behavior | Current app segmentation | Old app segmentation | 5 | 5 | Candidate | Needs systemization with CTA primitive. |
| Editor shortcut hint behavior | Current app segmentation | Old app segmentation | 3 | 3 | Candidate | Nice-to-have, lower priority. |

## Motion Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Hover/focus micro-motion | Current V2 contracts | Current app study/segmentation | 5 | 5 | Locked | Tokenized durations/easing already defined. |
| Menu/panel open motion | Current V2 contracts | Current app study/segmentation | 4 | 5 | Candidate | Needs reusable implementation helpers. |
| Screen intro/transition motion | Current V2 contracts | Current app segmentation | 3 | 4 | Candidate | Contracted, but not yet fully implemented as a system. |
| CTA sheen sweep | Current app segmentation | Old app segmentation | 5 | 5 | Candidate | Strong shared premium detail. |
| Hover lift for primary surfaces | Current app home/segmentation | Current app | 4 | 5 | Candidate | Should be tied to elevation scale. |
| Reduced motion fallbacks | V2 requirement | N/A | 5 | 5 | Deferred | Must be implemented before finalization. |

## Screen-Pattern Generics
| Item | Product source | Visual source | Final design confidence | Repeatability confidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Project Home command deck | Current app home | Current app home | 4 | 5 | Candidate | Strong mode-level pattern. |
| Source intake / segmentation operational workspace | Current app segmentation | Old app segmentation | 5 | 5 | Candidate | First pattern to prove after primitive extraction. |
| Study workspace main loop shell | Current app study | Current app study | 5 | 5 | Candidate | Product-critical mode pattern. |
| Support rail + floating preview system | Current app study | Current app study | 3 | 4 | Candidate | Good, but still needs structural audit. |
| Review / remediation support state set | Current app study | Current app study | 4 | 4 | Candidate | Useful across study and exams. |
| Segmentation success stage | Current app segmentation | Old app segmentation | 3 | 4 | Candidate | Should become a reusable success-stage pattern. |
| Exams focus shell | Current app exams | Current app exams | 2 | 4 | Needs redesign | Product mode exists, but current implementation is weak. |
| Projects index shell | Current app projects | Current app projects | 2 | 4 | Needs redesign | Early-state product surface. |
| Patching / corrections shell | Current app doctrine only | N/A | 1 | 3 | Deferred | Needs proper reference work before extraction. |

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
