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

## 6.5 Screen shell engineering standard
Every major screen must follow one shared screen-shell contract.
This should carry across Home, Source + Segmentation, Study, Patching, and Exams.

Rules:
- every screen has one `stage` owner
- every screen has one `content` owner
- every screen has one explicit primary `action region`
- every screen has one primary `scroll owner`

Stage owns:
- viewport height
- full-screen background
- atmospheric/decorative layers
- clipping and overflow boundaries

Content owns:
- max width
- page padding
- section spacing
- main composition alignment

Action region owns:
- primary CTA placement
- final approval/publish placement
- hierarchy between primary and secondary actions

Scroll ownership rules:
- the page may scroll
- inner panels only scroll intentionally
- long content must be contained on purpose, never by accident

Examples of intentional inner scroll regions:
- source tray
- marker list
- output/result pane
- discussion feed

Functional zones should remain structurally clear:
- header/navigation zone
- source/reference zone
- main work zone
- support/output zone
- action/publish zone

Decorative layers must never determine:
- content height
- panel position
- action placement
- scroll behaviour

Long content must have an explicit containment model.
Examples:
- source text = peek / expand / collapse in a bounded tray
- marker lists = fixed-height scroll region
- output = bounded workspace pane

Structural correctness test:
A screen is only correct if it still behaves properly under:
- browser zoom in/out
- long labels

## 6.6 Viewport and width standard
AraPal is currently desktop-first.

Canonical viewport targets:
- primary design target = `1440x900`
- minimum supported desktop = `1366x768`
- wide desktop validation = `1920x1080`

Content width rules:
- default major screen content max-width = `1400px`
- wider layouts are exceptions, not defaults
- if a screen intentionally exceeds `1400px`, that should be a conscious decision tied to a real layout need

Validation rules:
- every canonical screen should be checked at `1366x768`, `1440x900`, and `1920x1080`
- the primary task must stay obvious at all three sizes
- action regions must remain discoverable
- atmosphere/background must continue filling the stage cleanly
- zoom should not reveal seams, accidental background breaks, or container ownership mistakes
- long user-generated content
- smaller laptop heights
- larger desktop widths
- collapsed and expanded states

If a seam, stripe, overlap, drift, or broken action anchor appears under those conditions, fix the shell, not the styling.

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

## 13.1 Typography standards for AraPal screens
Use a restrained, repeatable type system.
Do not invent bespoke font sizes or tracking for one screen unless a new token is being established.

Current visual standard:
- display / ceremonial titles use `Playfair Display`
- body, labels, controls, support copy, and metadata use a clean sans-serif UI font
- display titles should feel elegant and editorial, not decorative or romantic
- body text should feel calm, readable, and neutral

Type role guidance:
- display title = major success, landing, or stage title
- page title = main screen heading
- section title = smaller structural heading inside a screen
- body = explanatory copy
- support/meta = labels, counts, auxiliary context

Rules:
- preserve strong contrast between serif display titles and sans-serif UI text
- use uppercase metadata sparingly and consistently
- metadata should be supportive, not tiny or footer-like by accident
- if a summary row exists, labels should stay in the metadata role and values should use the secondary-emphasis role
- avoid turning one screen into a different typographic system from the rest

## 13.2 Typographic mood
AraPal should feel:
- editorial, not magazine-like
- scholarly, not old-fashioned
- premium, not ornamental
- confident, not loud

Use typography to create elegance through:
- contrast
- spacing
- restraint
- line length

Not through:
- many fonts
- excessive tracking changes
- many font-size jumps
- decorative flourishes

---

# 13.5 Visual System Standards

These rules capture the current AraPal segmentation visual language and should carry into other screens unless a mode explicitly requires deviation.

## 13.5.1 Colour system
AraPal uses a restrained blue / slate palette.
Do not introduce off-system accent colours casually.

Current accent standard:
- primary accent blue = `#2563EB`
- stronger accent blue = `#1D4ED8`
- softer accent blue = `#93C5FD`
- accent wash = `#EFF6FF`
- accent mist = `#DBEAFE`

Supporting neutrals:
- background top = `#F6F9FD`
- background bottom = `#EDF3F9`
- primary surface = `#FFFFFF`
- soft surface = `#F8FBFF`
- strong text = `#0F172A`
- body text = `#334155`
- soft text = `#64748B`
- faint text = `#94A3B8`

Meaning rules:
- blue = primary action, active state, trusted emphasis
- green = success / ready / live state only
- amber/yellow = softer warning or “needs review”, not failure
- avoid purple, red, or arbitrary gradients unless the system is being intentionally updated everywhere

## 13.5.2 Backgrounds and atmosphere
The premium feel comes from atmospheric restraint, not busy decoration.

Use:
- soft blue/slate radial washes
- subtle diagonal structural lines
- very low-opacity branded watermark treatment when appropriate
- one full-screen stage owner for the atmosphere

Rules:
- decorative atmosphere belongs to the stage, never to random child containers
- diagonal lines should support structure, not cut through primary content
- watermark text should sit at the edge of perception, never dominate
- if a decorative element competes with readability, reduce opacity or push it outward before removing it entirely

## 13.5.3 Buttons and action styling
Primary actions should feel premium, calm, and slightly ceremonial.

Primary button standard:
- pill shape
- accent blue gradient
- soft but confident shadow
- subtle lift on hover
- polished highlight/sweep, not flashy animation
- hover/active states should feel refined, not game-like

Secondary button standard:
- white or near-white surface
- soft border
- quiet elevation
- clearly subordinate to the primary action

Rules:
- one screen should usually have one obvious primary CTA
- secondary actions should not compete visually with the primary
- split buttons or advanced actions must still read as one composed action cluster
- do not create bespoke button treatments per screen unless establishing a new reusable variant

## 13.5.4 Card and panel treatment
Panels should feel calm, breathable, and structurally related.

Use:
- large radii
- soft borders
- light shadows
- subtle tinted headers or bars where needed

Rules:
- repeated panels should share header/body spacing logic
- panel chrome should feel quiet and product-like, not browser-mock gimmicky
- avoid stacking too many equal-weight panels
- if a card feels loud, simplify header tint, border contrast, or shadow before changing the layout

## 13.5.5 Spacing and indentation discipline
Use the spacing scale already defined in this file.
Do not create ad hoc spacing values just to make one screen “look right”.

Rules:
- repeated rows/items use repeated padding and gaps
- left edges across adjacent panels should align cleanly
- action regions should not feel detached from their associated content
- summary bars and footer-like rows should use the same spacing roles as the rest of the system, not tiny compressed custom spacing
- when something feels off, fix the parent rhythm rather than nudging one child

## 13.5.6 Visual consistency rule
When creating or updating a new AraPal screen, check for consistency in:
- display typography
- button hierarchy
- accent blue usage
- background atmosphere
- panel radius/border/shadow language
- spacing rhythm
- metadata sizing
- action placement

New screens should feel like members of the same product family, not one-off art directions.

## 13.5.7 Mandatory post-change visual validation
After any meaningful visual screen change, do not stop at code completion.
You must validate the actual rendered screen visually before presenting the work as done.

Default validation workflow:
1. capture the relevant screen at `1440x900 @ 100%`
2. inspect the screenshot, not just the code
3. run the validation checklist below
4. if the screen fails, do not present it as finished
5. either fix it immediately or explicitly say `failed visual validation`

If a Figma reference or screenshot reference is given:
- verify the relevant parts against that reference explicitly
- do not stop at “reasonable” if the output is still materially different from the target
- check placement, scale, hierarchy, spacing, and composition against the reference

Mandatory visual validation checklist:
1. Primary composition
- one clear focal point
- no duplicate titles, duplicate heroes, or competing primary actions

2. Placement
- major elements sit in the intended places
- nothing feels awkwardly floating, detached, or off-centre

3. Proportion
- titles, cards, panels, and controls feel correctly sized for the screen
- nothing feels oversized, cramped, or undersized

4. First view
- at `1440x900 @ 100%`, the important content is visible without unnecessary scrolling
- no key action or core content is cut off

5. Spacing rhythm
- the screen feels breathable without becoming sparse
- no awkward dead space
- no overpacked stacks
- no accidental vertical compression

6. Alignment
- text, metadata, dividers, buttons, and card internals align cleanly
- no “almost aligned” rows or visibly drifting edges

7. Consistency
- typography, button treatment, card treatment, spacing, and chrome match the established AraPal system
- nothing should look like a different product or UI system

8. Reference match
- if a reference exists, the output must be closer to the reference than before
- if not, the pass fails even if the screen looks broadly acceptable in isolation

9. Feel check
- view the screenshot as a regular user would
- ask: does this feel nice, clear, and exciting?
- ask: does it feel well made?
- ask: is it breathable but still clear?
- ask: is it aligned, symmetrical, and visually composed?
- if the answer is no, the pass fails

Required reporting format after screenshot review:
- `Screenshot checked: <screen> / <viewport>`
- `Status: Pass` or `Status: Fail`
- `Issues found: ...`
- `Next correction: ...`

Never present a screen as complete if the screenshot still shows obvious duplication, misplacement, poor proportion, cutoff content, or clear alignment issues.

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

# 15) Supporting Rules

## 15.1 Text behaviour
Every text block must have an intentional constraint model:
- wrap
- truncate
- clamp
- scroll

Never allow silent overflow or text collision.

## 15.2 States
Every important surface must support the real states it can enter, not just the happy path.

Minimum expectation:
- empty
- loading
- success
- error
- long-content / short-content
- disabled
- hover / focus / active where relevant

Product-specific states matter too:
- no source yet
- poor segmentation proposal
- repair mode after fail
- exam autosave / resume
- pass state with revealed outputs

## 15.3 Accessibility + global use
Required:
- obvious primary actions
- clear hierarchy
- visible focus states
- readable contrast
- targets that are large enough
- layouts that survive increased text size
- no reliance on colour alone
- language-aware handling where Arabic and English coexist

## 15.4 Reference interpretation
When given a screenshot or Figma reference:
- infer the layout system, grouping, spacing, hierarchy, and responsive behaviour
- match the design logic, not just the pixels
- never hardcode coordinates to mimic one frame

## 15.5 Working discipline
When changing UI:
1. identify the governing screen mode
2. identify the violated layout/component rule
3. fix at parent/component/system level first
4. avoid one-off spacing or width hacks
5. leave the codebase cleaner, or at least no messier

Forbidden patterns:
- absolute positioning for structure
- arbitrary nudging to “make it look right”
- duplicate component variants per screen
- ambiguous primary actions
- layouts that are technically present but practically unusable

Definition of done:
- the mode is clear
- the primary action is obvious
- the layout is structurally correct
- the screen survives supported widths and zoom
- repeated components are consistent
- the visual hierarchy feels balanced
- the screen can take more or less content without collapse
