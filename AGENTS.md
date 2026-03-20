This project is a visual design sandbox only. Imagine Figma.
# AraPal Product + UI Doctrine (Non-Negotiable)

Build AraPal as a calm, premium, globally usable study system.
It must feel elegant, obvious, structurally stable, and easy to extend.

Do not build one-off screens.
Do not optimise for “looks right in this screenshot”.
Optimise for “works cleanly across the whole product, under real use, over time”.

The app is not a generic SaaS dashboard.
It is a focused learning instrument for serious language study.
Visual identity should feel refined, editorial, scholarly, and modern.
Usability should feel immediate and low-friction.

---

# 1) Product Mental Model

AraPal has 5 distinct modes:

1. Project Home
2. Source + Segmentation
3. Study Workspace
4. Patching
5. Exams

Do not blur these modes together.

Rules:
- Project Home = command centre at macro level
- Study Workspace = stable anchor at segment level
- Source + Segmentation = preparation and publishing, not study
- Patching = controlled correction workflow, not casual editing
- Exams = focused assessment mode, linked back into study

The app should feel like one study system with clear modes, not a chain of unrelated screens.

---

# 2) Product Priorities

Always optimise for this order:

1. User orientation
2. Structural correctness
3. Clear primary action
4. Visual hierarchy
5. Consistency
6. Responsiveness
7. Beauty
8. Extensibility

A beautiful screen that is ambiguous, fragile, or hard to extend is a failure.

---

# 3) Product UX Rules

## 3.1 Home must remove uncertainty
Project Home must answer:
- what is active
- where the user left off
- what needs attention
- what they should do next

A blank or new project must have one obvious primary CTA.
Do not expose empty or confusing navigation before the first meaningful action.

## 3.2 Study is the main loop
The dominant action in Study Workspace is:
- read source
- write translation
- submit
- understand result
- continue or repair

Do not let side tools compete with this.

## 3.3 Help should stay attached to work
Guidance, lexicography, phrasing, discussion, and result/repair must stay tied to the current segment context.
The user should not feel they have “left the segment” to get help.

## 3.4 Patching must feel controlled
Authoritative corrections must be visibly distinct from normal study.
No freeform editing of authoritative truth inside normal study flow.

## 3.5 Exams must feed remediation
Exams are not a separate universe.
Misses should link back into the normal Study Workspace with context preserved.

---

# 4) Design Character

AraPal should feel:
- calm
- premium
- spacious
- precise
- editorial
- scholarly
- modern
- not generic SaaS
- not enterprise dashboard clutter
- not issue-management software
- not over-decorated

Use:
- strong typography
- restrained palette
- generous but disciplined whitespace
- few strong surfaces rather than many noisy mini-cards
- clean alignment
- clear grouping
- obvious actions

Avoid:
- dense dashboard feel
- many competing boxes
- visual busyness
- arbitrary accent colours
- gratuitous ornament
- “Monday.com” style fragmentation
- too many equal-priority controls

Beauty must come from composition, hierarchy, typography, spacing, and restraint.

---

# 5) Information Architecture by Screen

## 5.1 Project Home
Purpose:
- resume quickly
- browse intentionally
- understand state of project

Home should prioritise:
- Continue where you left off
- active work
- progress snapshot
- needs attention
- shortcuts to source, patching, exams

Home should feel like a command centre, not a workflow maze.

Rules:
- one primary CTA based on project state
- secondary actions clearly subordinate
- cards should feel like major doors into work, not tiny widgets
- avoid overloading home with detailed study content

## 5.2 Source + Segmentation
Purpose:
- preserve source safely
- propose or edit segmentation
- approve and publish

Rules:
- immutable source preservation comes before processing
- segmentation proposal is assistive, not authoritative
- approval/publish moment must feel explicit
- this mode should feel operational and controlled, not like study

## 5.3 Study Workspace
Purpose:
- focused segment work

This is the primary shell of the product.
It should remain stable while content and state change.

Rules:
- source visible immediately
- translation editor is dominant action
- help/context is adjacent, not competing
- result appears in same workspace
- fail shifts into bounded repair mode
- discussion opens as attached side experience by default
- next/previous belong here, not on Home

## 5.4 Patching
Purpose:
- controlled fixes to structure or authoritative outputs

Rules:
- visibly separate from study
- show impact before commit
- no casual mutation of downstream truth
- preview consequences before recompile

## 5.5 Exams
Purpose:
- scoped assessment
- autosaved attempt
- structured review
- direct return to study for remediation

Rules:
- exam should feel focused
- no noisy surrounding chrome
- review must connect back into Study Workspace cleanly

---

# 6) Layout Doctrine

## 6.1 Container-driven layout only
Every element must belong to a parent container that governs:
- position
- width
- spacing
- alignment
- responsive behaviour

Do not place elements by eye.

## 6.2 Parent owns layout
Parent defines:
- stack / row / grid
- gap
- padding
- alignment
- distribution
- wrap / reflow

Children must not self-position to force layout.

## 6.3 Layout primitives only
Compose screens from:
- Page shell
- Section
- Container
- Stack
- Row
- Grid
- Card / Panel
- Toolbar
- Drawer / Sheet / Modal

Avoid bespoke structural patterns unless the interaction genuinely requires them.

## 6.4 No floating layout
Forbidden for structural layout:
- absolute positioning
- arbitrary offsets
- negative margins
- transform nudging
- screenshot-matching by hardcoded coordinates

Allowed only for true overlays or decorative layers:
- badges
- menus
- tooltips
- modals
- ornamental flourishes

Even then, the parent remains the positioning context.

---

# 7) Width Negotiation + Responsive Rules

## 7.1 Every horizontal layout must declare who yields
For any row or multi-column layout, explicitly define:
- fixed/stable regions
- flexible regions
- min and max widths
- wrap or collapse behaviour

Never let siblings compete for width without rules.

## 7.2 No overlap ever
At all supported widths and zoom levels:
- text must not collide with actions
- panels must not overlap
- headers must not crash into tabs or controls
- content must not sit under or inside adjacent surfaces
- bottom-anchored actions must not drift into content

If overlap is possible, the layout is incorrect.

## 7.3 Reflow before failure
When space tightens:
1. reflow
2. wrap
3. stack
4. truncate/clamp where appropriate
5. scroll only where semantically correct

Do not preserve a desktop composition at the cost of broken usability.

## 7.4 Zoom and scaling are first-class
The UI must remain correct under:
- browser zoom
- OS text scaling
- long labels
- long user content
- narrow laptop widths
- large desktop widths
- tablet widths
- mobile widths

---

# 8) Study Workspace Shell Rules

Study Workspace is the most important shell in the product.

## 8.1 Desktop structure
Default desktop shell:
- left navigation pane
- central work pane
- right support pane

Intent:
- left = orientation and movement
- centre = primary work
- right = context and support

The centre must remain the dominant visual and interaction area.

## 8.2 Pane behaviour
Left pane:
- tree, segment context, local navigation
- stable and scannable
- should not visually overpower centre

Centre pane:
- source
- quick lexicography
- translation editor
- result / repair
- primary CTA

Right pane:
- guidance
- lexicography
- phrasing
- contextual support
- discussion entry
- latest summary where relevant

## 8.3 Responsive collapse order
When width becomes constrained:
1. preserve centre pane first
2. simplify or collapse left navigation
3. move right support to secondary pattern:
   - tabs below centre
   - drawer
   - bottom sheet
   - toggleable panel
4. never compress all 3 panes until unreadable

The user must always retain:
- orientation
- source visibility
- translation ability
- submit path

## 8.4 State continuity
Opening help, discussion, fail/repair, or pass details must not feel like navigating away from the segment.
Preserve segment state and visual anchor.

---

# 9) Home Screen Composition Rules

Home should feel like a clean command deck.

Rules:
- one strong hero action or resume action
- large, legible destination surfaces
- not a cluttered dashboard
- not many tiny equal-weight widgets
- progress, attention, and next action must be visible at a glance

If using stacked or adjacent cards:
- equal cards use equal widths/heights unless intentionally varied
- repeated metadata sits on consistent baselines
- card groups use one spacing rhythm
- top and bottom edges of the main composition should feel balanced within the screen

---

# 10) Segmentation Screen Rules

Source + Segmentation is an operational workspace, but should still feel elegant.

Rules:
- preserved source is the anchor
- AI suggestions are clearly proposals
- manual editing is first-class, not fallback
- approval/publish is visually distinct from exploratory actions
- success state should show what was created and what happens next

Avoid making segmentation feel like grading or study.

---

# 11) Spacing System

## 11.1 Token-based only
Use a fixed spacing scale.
Preferred scale:
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64

Do not use random spacing values.

## 11.2 Vertical rhythm
Repeated elements must have repeated spacing relationships.

If 4 cards are stacked:
- same gap between each
- same internal padding logic
- same header/body/footer logic unless intentionally different

No “almost the same” spacing.

## 11.3 Hierarchical spacing
Spacing must reflect meaning:

- tight = within group
  example: title + subtitle

- medium = between related groups
  example: subtitle + main content

- large = between sections
  example: source card + translation card

Do not use one uniform gap everywhere.

## 11.4 Outer vs inner balance
Outer screen padding and inner section spacing must feel balanced.

Rules:
- content should not feel crushed to one edge
- top and bottom spacing should feel intentional and balanced
- section groups should sit cleanly within the page, not float awkwardly

## 11.5 Optical spacing
Do not rely only on mathematical equality.

Adjust for visual correctness:
- headings usually need less gap below than above
- text often needs less top padding than large containers suggest
- grouped items should visually “stick together”
- labels should not feel detached from the surfaces they describe

If something feels off, first check:
1. grouping
2. hierarchy
3. outer vs inner balance
4. optical spacing

Fix within the spacing system, not with hacks.

---

# 12) Specific visual issues to avoid in AraPal

Never allow:
- huge dead space above the first line inside a content card unless intentionally designed
- section labels that float disconnected from their associated content
- headers/tabs/actions that feel mis-centred relative to the composition
- cards with inconsistent top/bottom padding
- support panels with mismatched header heights or body padding
- centre content that loses dominance because side panels are too loud
- navigation chrome that competes with the main task

Title, subtitle, and the content they introduce must read as one coherent block.
Related content sits close together.
Distinct content groups separate clearly.

---

# 13) Typography

Typography is a major part of the product identity.

Rules:
- use a clear hierarchy: display / page title / section title / body / supporting text / meta
- no random font sizes or weights
- strong titles, restrained supporting text
- line lengths must stay readable
- meta text should support, not compete

Title/subtitle lockup rules:
- title + subtitle = tight relationship
- subtitle + main section = larger gap
- page title area must feel like a coherent introduction, not scattered items

---

# 14) Surface + Component Rules

Repeated patterns must become reusable components.

Core components:
- page shell
- section header
- toolbar
- card/panel
- button
- input/editor
- pill/chip
- nav row
- result banner/state block
- support card
- drawer/sheet
- modal
- exam question block

Component rules:
- same component = same padding system
- same component = same header/body/footer logic
- use variants rather than duplicates
- screen code should compose components, not restyle each one locally

---

# 15) Text Behaviour

Every text block must define its constraint behaviour:
- wrap
- truncate
- clamp
- scroll

Never allow text collision or silent overflow.

Rules:
- action labels must remain legible
- long branch names must not break navigation layout
- long guidance/support text must not destabilise adjacent panels
- source text must preserve readability
- support text can wrap, but layout must stay stable

---

# 16) States

Every important surface must support:
- empty
- loading
- success
- error
- reconciling
- long-content
- short-content
- disabled
- hover/focus/active where relevant

Important product-specific states:
- no source yet
- poor segmentation proposal
- repair mode after fail
- discussion retry failure
- saved but reconciling
- pass state with revealed outputs
- patch impact preview
- exam autosave / resume

The happy path is not enough.

---

# 17) Bottom Anchoring + Height Rules

If an action belongs at the bottom of a card or pane, implement that structurally.

Use:
- full-height parent
- column layout
- intentional spacer / justify-between
- sticky footer only where correct

Do not fake bottom anchoring with large margins.

If zoom or content change makes the anchor drift, the structure is wrong.

---

# 18) Mobile + Smaller Screens

Do not shrink desktop layouts blindly.

For smaller screens:
- preserve one dominant task per viewport
- stack rather than compress
- move secondary support behind tabs/drawers/sheets
- keep navigation recoverable but not always open
- maintain obvious primary CTA
- keep tap targets large and clear

Study on small screens still needs:
- source
- translation input
- guidance access
- submit path
- result visibility

---

# 19) Accessibility + Global Use

This product is intended for broad real-world use.

Required:
- obvious primary actions
- clear information hierarchy
- keyboard accessibility where relevant
- visible focus states
- readable contrast
- large enough targets
- layouts that survive increased text size
- no reliance on colour alone for meaning
- language-aware handling where Arabic and English coexist

Clarity should feel consumer-grade, not admin-tool grade.

---

# 20) Figma / Screenshot Interpretation

When given references:
- infer the layout system
- infer spacing logic
- infer grouping
- infer hierarchy
- infer responsive behaviour
- infer component rules

Do not copy pixels.
Do not hardcode coordinates to mimic one frame.

Match the design logic, not just the screenshot.

---

# 21) Edit Doctrine for Codex

When changing an existing UI:

1. identify the governing screen mode
2. identify the affected layout primitive or component
3. identify the spacing/hierarchy rule being violated
4. fix at parent/component/system level
5. verify no drift was introduced elsewhere

Do not patch symptoms locally.
Do not add one-off spacing or width hacks.
Do not mix bespoke values into an existing pattern.

Every change must leave the codebase cleaner or at least equally clean.

---

# 22) Forbidden Patterns

Do not:
- use absolute positioning for structure
- nudge elements into place by arbitrary offsets
- create per-screen versions of the same component
- let side panels overpower the main task
- mix many near-identical spacing values
- create ambiguous primary actions
- turn home into a noisy dashboard
- turn study into a workflow maze
- bury the translation action under support content
- compress multi-pane layouts until they are technically present but practically unusable

---

# 23) Required Working Process

Before implementing any screen or edit:

1. define the screen mode and purpose
2. identify the primary user action
3. define the page hierarchy
4. choose layout primitives
5. define spacing rhythm and hierarchy
6. define width negotiation and responsive collapse
7. define text constraints
8. define reusable components/variants
9. define states
10. implement
11. stress-test mentally for zoom, narrow widths, long content, and real use

Do not jump into code before the hierarchy is clear.

---

# 24) Definition of Done

UI work is not complete until all are true:

## Product clarity
- the user can tell what mode they are in
- the primary next action is obvious
- the screen supports the intended journey cleanly

## Structural correctness
- every element belongs to a logical parent
- layout primitives are clear
- no floating structural elements
- no hacks

## Responsiveness
- no overlap at supported widths
- no overlap under zoom
- side panes collapse intentionally
- text does not break layout
- bottom actions stay anchored correctly

## Consistency
- repeated surfaces use repeated spacing
- repeated components match
- typography hierarchy is consistent
- no random values

## Visual quality
- grouping is clear
- title/subtitle/content relationships feel right
- outer and inner spacing feel balanced
- no surfaces or labels feel awkwardly positioned
- the main task remains visually dominant

## Extensibility
- the screen can accept more/less content without collapse
- adding a new card/panel/state will be straightforward
- the change did not increase mess

If any of these fail, the work is not done.

---

# 25) Guiding Principle

AraPal should feel like a beautifully engineered study instrument:
clear, calm, stable, premium, and obvious.

A correct UI:
- looks refined
- feels balanced
- survives zoom and resizing
- handles real content
- preserves user orientation
- supports the learning loop cleanly
- is easy to extend without drift