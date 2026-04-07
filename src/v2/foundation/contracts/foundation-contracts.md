# V2 Foundation Contracts v1

## 1. Purpose

`AppV2` is the new production-ready design system app that will be built inside the existing repo.

These contracts exist to prevent V2 from becoming another visually strong but structurally messy prototype.

They are the shared rules for:

- layout
- container ownership
- naming
- debug visibility
- tokens
- panel families
- screen structure
- validation

If a future implementation conflicts with this file, this file wins until it is explicitly changed.

## 2. Source Of Truth

V2 has two contract layers:

- `v2-canon.md` is the concise collaboration canon
- this file is the human-readable foundation contract
- each screen also exports one executable `layoutContract`

Rules:

- the renderer consumes the screen `layoutContract`
- the debug tool consumes the same screen `layoutContract` plus live DOM values
- there is no second handwritten manifest for debug
- contracts live in the repo, not only in chat
- `v2-canon.md` should stay short and reviewable
- this file may be more detailed, but should not conflict with `v2-canon.md`

## 3. AppV2 Architecture

Use a new internal app shell, not a new repo.

Suggested tree:

- `src/v2/AppV2.jsx`
- `src/v2/app/routeRegistry.ts`
- `src/v2/foundation/layout/`
- `src/v2/foundation/primitives/`
- `src/v2/foundation/tokens/`
- `src/v2/foundation/contracts/`
- `src/v2/screens/<ScreenName>/<ScreenName>.jsx`
- `src/v2/screens/<ScreenName>/<ScreenName>.contract.ts`

Screen rules:

- one screen folder per screen by default
- one primary screen file per screen
- one contract file per screen
- screens connect through `routeRegistry` and navigation config
- screens do not reach into each other's internals
- shared primitives live in `foundation`, not copied across screens

Shared shell rules:

- `AppV2` owns shared shell state such as active route, rail hover state, and rail pin state
- `routeRegistry` owns shared navigation metadata and default header metadata
- shared shell primitives render into the declared Layer 1 containers
- screens own screen-specific slot content, not separate rail or header implementations

## 4. V2 Screen Inventory

The active V2 rebuild scope is:

- `AppLaunchScreen`
- `ProjectHomeScreen`
- `ProjectsScreen`
- `SegmentationPasteScreen`
- `SegmentationTransitionScreen`
- `SegmentationLoadingScreen`
- `SegmentationReviewScreen`
- `SegmentationSuccessScreen`
- `StudyWorkspaceScreen`
- `ExamsScreen`

Mode rule for segmentation:

- `Source + Segmentation` is one product mode
- it is implemented as multiple screens, not one giant screen component

Out of scope for V2:

- legacy prototype screens
- orphan reference screens
- removed concept screens such as the old `choice panel` screen

## 5. Global Layout Contract

Build frame:

- default build frame = `1440x900`
- required validation frames = `1366x768` and `1920x1080`
- width units = `30`
- height units = `18.5`

### 5.1 Layer 1: Universal Screen Shell

Layer 1 is mandatory on every screen.

Stage shell:

- `Layer1_Stage_ScreenShell`
  - owns the full screen shell
  - owns viewport height, background atmosphere, and clipping boundaries

Header row:

- `Layer1_Header_Row`
  - full-width header row container
- `Layer1_Header_StartLane`
  - position: `x 0->3`, `y 0->1`
  - alignment: `left + middle`
- `Layer1_Header_CenterLane`
  - position: `x 3->11`, `y 0->1`
  - alignment: `center + middle`
- `Layer1_Header_EndLane`
  - position: `x 11->14`, `y 0->1`
  - alignment: `right + middle`

Body row:

- `Layer1_Body_Row`
  - full-width body row container
- `Layer1_Body_NavigationRail`
  - position: `x 0->1`, `y 1->9`
  - alignment: `left + top`
  - always present
- `Layer1_Navigation_HeaderBand`
  - shared rail header-band container
  - owns the brand and utility anchors
- `Layer1_Navigation_BrandAnchor`
  - shared rail brand anchor
- `Layer1_Navigation_UtilityAnchor`
  - shared rail utility-control anchor
- `Layer1_Navigation_PrimaryList`
  - shared rail primary navigation list container
- `Layer1_Body_ScreenBodyField`
  - position: `x 1->14`, `y 1->9`
  - width: `13`
  - alignment: `left + top`

Rules:

- shell primitives plug into these declared containers
- utility controls belong inside explicit anchor containers, never free-floating whitespace

### 5.2 Layer 2: Default Body Split

Inside `Layer1_Body_ScreenBodyField`, the default split for most screens uses fixed side rails and one flexible center field.

The body field also owns one explicit backdrop container so the working field has a declared background layer from day one.

At the normalized `14x9` frame this resolves to:

- `Layer2_Body_Backdrop`
  - declared backdrop container for the body field
  - sits behind the content split
  - participates in debug like every other container
  - owns the default body-region atmosphere, including structural line work and low-opacity AraPal wordmark treatment
- `Layer2_Body_DefaultSplit`
  - default split container inside `Layer1_Body_ScreenBodyField`
- `Layer2_Body_ContentStartRail`
  - position: `x 1->3.5`
  - width: `2.5`
  - fixed width rail
  - alignment: `left + top`
- `Layer2_Body_ContentCenterField`
  - position: `x 3.5->11.5`
  - width: `8`
  - only flexible width region in the default split
  - alignment: `center + top`
- `Layer2_Body_ContentEndRail`
  - position: `x 11.5->14`
  - width: `2.5`
  - fixed width rail
  - alignment: `right + top`

Rules:

- Layer 1 is universal
- Layer 2 is the default on most screens
- collapsed Layer 2 default split = `3.5 / 6.5 / 3.5`
- expanded Layer 2 default split = `1.25 / 8.5 / 1.25`
- left and right gutters yield symmetrically before the center fails
- a screen may represent outer gutters as layout-owned tracks instead of empty child containers when those gutters do not own content
- `Layer2_Body_Backdrop` is part of the default shell, not an optional decoration
- every screen contract declares a `bodyBackdrop.preset`
- the default preset is the shared AraPal V2 backdrop
- changing the shared default preset changes the backdrop across all screens that use it
- a screen can become bespoke by pointing its contract at a different backdrop preset
- any deviation from Layer 2 must be explicit in the screen contract
- no overlap
- no accidental gaps
- end-to-end partitions only

### 5.3 Shell Sizing Contract

Shell sizing is canonical and derived from the shared normalized `14x9` reference frame, then translated into stable desktop tokens.

Canonical shell widths:

- `Layer1_Header_Row` height = `0.5 / 9` normalized screen height = `50px`
- `Layer1_Body_NavigationRail` collapsed width = `0.5 / 14` normalized screen width = `51.429px`
- `Layer1_Body_NavigationRail` expanded width = `3 / 14` normalized screen width = `308.571px`
- `Layer2` collapsed split inside the body field = `3.5 / 6.5 / 3.5`
- `Layer2` expanded split inside the body field = `1.25 / 8.5 / 1.25`

Expanded-shell rule:

- when the navigation rail expands, it consumes `3 / 14` of the screen width
- the remaining body field keeps a symmetric gutter / center / gutter split of `1.25 / 8.5 / 1.25`
- under additional pressure, gutters continue yielding symmetrically before the center fails
- do not widen or narrow shell containers ad hoc after screenshot review

Implementation rule:

- shell sizes are translated once into runtime pixels from the shared normalized grammar
- screens consume those values; they do not invent their own shell widths

### 5.4 Layer 3 And Beyond

Layer 3 is screen-specific structure.

Examples:

- `Layer3_Workspace_LeftPanel`
- `Layer3_Workspace_CenterPanel`
- `Layer3_Workspace_RightPanel`
- `Layer3_Action_PrimaryBand`
- `Layer3_Intro_ContentBand`

Rules:

- Layer 3 can vary by screen
- Layer 4 exists only when explicitly declared
- no hidden structural helper wrappers
- if it owns layout responsibility, it must become a declared container
- if a structural owner has children, those children must either span the owner end-to-end as declared bands/slots or be explicitly declared structural spacers
- no meaningful leaf should float directly inside a large structural owner

### 5.5 Screen QA Gates

Every approved screen must pass the shared screen QA workflow or explicitly document why a gate is wrong and has been updated.

Required gates:

- wrapper depth
- overlap check
- layer ancestry
- empty containers
- pass-through containers
- child containment
- fixed structural sizing
- readable inset
- padding discipline
- debug coverage
- full-height composition
- ordered gutter yield
- orphan overrides
- contract/container mismatch

Rules:

- QA semantics must be modeled explicitly, not hidden behind blanket skips
- shell-owned inset lanes, structural spacers, and full-span bands should be represented as first-class contract semantics
- if a structural owner declares full-span children, QA should confirm those children fill the owner end-to-end or are explicitly declared spacers
- if a gate fails, either the screen is wrong or the gate semantics are wrong; decide which and fix it deliberately
- zero orphan overrides
- zero contract/container mismatches
- closure requires build pass, QA pass, and regression notes across `1366x768`, `1440x900`, and `1920x1080`

### 5.6 Hybrid Health Workflow

AraPal quality should be judged by a hybrid system, not by code reading alone and not by screenshots alone.

Required layers:

- static repo audit
- runtime screen QA
- dashboard aggregation

Rules:

- static audit inspects repo code directly for doctrine drift, bespoke debt, and contract hygiene
- runtime QA validates rendered behavior at canonical viewports and zoom states
- the dashboard reports both together so the system reveals where code truth and rendered truth diverge
- do not hand-curate dashboard state; it must be generated from scripts

## 6. Container And Item Contract

A `container` is any element that:

- partitions space
- aligns child content
- owns layout responsibility
- controls position, width, spacing, alignment, gap, overflow, or child layout

An `item` is any element that:

- does not partition space
- renders content or an interactive primitive inside a container

Rules:

- one container = one responsibility
- if a wrapper affects layout, it is a container
- all containers must be declared in the contract before use
- all containers must appear in debug
- items do not use the formal container naming system
- if a container needs internal structure, that becomes the next declared layer

Every declared container must define the full settings set:

- `display`
- `layout mode` using grid or flex
- `alignItems`
- `justifyContent`
- `padding`
- `gap`
- `overflow`
- `textAlign` when applicable

## 7. Container Naming Contract

Every container uses this naming convention:

`Layer{N}_{Zone}_{Role}`

Examples:

- `Layer1_Header_StartLane`
- `Layer1_Header_CenterLane`
- `Layer1_Header_EndLane`
- `Layer1_Body_NavigationRail`
- `Layer1_Body_ScreenBodyField`
- `Layer2_Body_ContentStartRail`
- `Layer2_Body_ContentCenterField`
- `Layer2_Body_ContentEndRail`
- `Layer3_Workspace_LeftPanel`
- `Layer3_Workspace_CenterPanel`
- `Layer3_Workspace_RightPanel`

Rules:

- always include the layer prefix
- use structural responsibility, not visual styling
- avoid vague names such as `Wrapper`, `Inner`, `Box`, or `Thing`
- if two names sound interchangeable, the naming is not specific enough

## 8. Debug Contract

The debug tool is a first-class engineering tool in V2.

Rules:

- every declared container appears in debug
- every container gets `data-debug-layer`
- every container gets `data-debug-name`
- meaningful leaf nodes may use `data-debug-item`
- items are not part of the formal container naming system
- debug reads live computed values from the DOM
- hover previews highlight
- click locks inspection
- hierarchy is browsable by panel
- debug is available on every V2 screen through a launcher button
- the debug panel can be opened and collapsed without route changes
- the debug panel must not be the only way to see the screen; it should default to a collapsed launcher state
- undeclared structural nodes fall under `Misc`

Debug naming rule:

- `data-debug-layer="Layer1"`
- `data-debug-name="Layer1_Header_StartLane"`

Core rule:

- the debug tool is separate as a tool
- it is not separate as a source of truth
- render and debug both depend on the same screen `layoutContract`

## 9. Token Contract

### 9.1 Spacing Scale

Use only this spacing scale:

- `4`
- `8`
- `12`
- `16`
- `20`
- `24`
- `32`
- `40`
- `48`
- `64`

Rules:

- no ad hoc spacing values to fix one screen
- parent containers own spacing rhythm
- repeated structures use repeated spacing

### 9.1.1 Surface Padding Roles

Use these shared padding roles for panels and editor-like surfaces:

- `compact inset` = `16`
- `standard inset` = `20`
- `comfortable inset` = `24`
- `modal inset` = `32`
- `rounded row inline` = `32`
- `rounded row block` = `16`
- `compact shell inset` = `16`
- `display stage inset` = `20`
- `panel header inline` = `16`
- `panel body` = `20 / 20 / 24`
- `floating panel body` = `24 / 24 / 32`
- `modal body` = `32`
- `editor body` = `24 / 24 / 32`

Rules:

- text must never visually collide with surface edges
- every text-bearing surface must use a shared padding role, not an ad hoc value
- `standard` is the default for most cards, panels, and review surfaces
- `comfortable` is the default for reading-first or editor-like surfaces
- `compact` is for denser rows or smaller utility surfaces only
- `modal` is for focused expanded surfaces and dialogs
- rounded bounded rows use the rounded-row inset, not the flat minimum, because the corner curve reduces the optical reading area
- support cards, popovers, and floating panels inherit shared padding roles before any mode-specific tweaks
- if a panel feels cramped, fix the surface padding role first, not the child text block
- attached chrome such as casing, marks, and watermarks must sit outside or behind the content padding, never inside the reading area

### 9.1.2 Minimum Readable Inset Rule

Every card, panel, row block, and text-bearing surface must preserve a minimum readable inset from the outer edge.

Shared minimum:

- `minimum readable inset` = `16`

Rules:

- body text, labels, metadata, and titles must never visually touch or crowd the outer edge of a surface
- if a surface carries text, its internal padding must be at least the minimum readable inset unless a stronger shared role applies
- repeated preview boards and internal review surfaces must obey the same inset rule, not a reduced ad hoc version
- if text appears cramped, fix the parent padding role or shared inset token first

### 9.2 Color Roles

Use the existing AraPal blue/slate system as the V2 base.

Primary accent roles:

- base blue = `#2563EB`
- strong blue = `#1D4ED8`
- soft blue = `#93C5FD`
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
- green = success and ready state only
- semantic surface tones primarily affect surface, border, shadow, and icon treatment
- body and support text stay neutral by default
- short titles may adopt the semantic tone only when readability remains strong
- amber = review and softer warning only
- destructive color visuals are deferred for now, but token slots must be left open

### 9.3 Typography Roles

Use the existing app font families as V2 defaults.

- `display_title`
  - font: `Playfair Display`
  - size: `72`
  - line-height: `1`
  - optical shift: `translateY(-0.05em)`
- `section_title`
  - font: `Playfair Display`
  - size: `48`
  - line-height: `1.02`
- `card_title`
  - font: `Playfair Display`
  - size: `36`
  - line-height: `1.05`
- `support_subtext`
  - font: `Inter`
  - size: `18`
  - line-height: `1.45`
- `body_text`
  - font: `Inter`
  - size: `16`
  - line-height: `1.55`
- `eyebrow_label`
  - font: `Inter`
  - size: `12`
  - line-height: `1`
  - uppercase + tracked
- `control_label`
  - font: `Inter`
  - size: `12`
  - line-height: `1`
  - uppercase + tracked
- `mono_meta`
  - font: `JetBrains Mono`
  - size: `12`
  - line-height: `1.2`
- `arabic_source_text`
  - font: `Amiri`
  - size: `34`
  - line-height: `1.7`

### 9.4 Control Sizes

- `chip` = height `32`
- `icon_button` = `40x40`
- `button_md` = height `44`
- `button_lg` = height `48`
- `cta_split` = height `72`
- `cta_split_tail` = `72x72`

### 9.5 Radius Scale

The V2 radius scale is:

- `12`
- `16`
- `24`
- `32`
- `pill`

Usage guidance:

- `12` = compact controls and utility surfaces
- `16` = inputs and smaller support surfaces
- `24` = standard panels and workspace cards
- `32` = hero and ceremonial surfaces
- `pill` = chips, primary CTAs, split CTAs, and pill controls

### 9.6 Elevation Scale

The V2 elevation scale is:

- `flat`
- `rest`
- `raised`
- `floating`
- `overlay`

Rules:

- components move up at most one elevation step on hover
- panels do not invent one-off shadow logic outside this scale

### 9.7 Utility Control Sizes

The V2 utility control size set is:

- `utility-sm` = `28x28` hit area with `16px` icon
- `utility-md` = `32x32` hit area with `18px` icon

Rules:

- `utility-sm` is the default size for pin, back, expand, collapse, close, and similar mini controls
- screens should not invent bespoke mini icon sizes
- utility controls must use the shared hover-box treatment

## 10. Motion Contract

Motion must support hierarchy, orientation, and state change.

Timing rules:

- hover and focus micro-motion = `120ms ease-out`
- menu or panel open = `220ms cubic-bezier(0.2, 0.8, 0.2, 1)`
- screen intro or transition = `320ms cubic-bezier(0.22, 1, 0.36, 1)`

Rules:

- no decorative motion unless it supports hierarchy or orientation
- hover motion must not cause layout drift
- reduced-motion support is required when motion is implemented

## 11. Interaction Contract

### 11.1 Navigation Rail

The global navigation rail behavior is locked as:

- hover expands
- pin button pins
- pin button unpins

### 11.2 Focus Treatment

V2 uses two focus recipes:

- `halo` for fields and editors
- `outline` for buttons and link-like controls

### 11.3 Small Icon Button Pattern

Small icon controls are a shared primitive in V2.

Rules:

- use the same hover-box treatment for pin, expand, collapse, close, and similar utility actions
- hover reveals the control surface with a soft rounded box
- active state keeps that box visible
- these controls should not invent one-off icon button styling per screen
- utility controls are items, not containers

### 11.4 Utility Anchor Placement

Utility controls must live inside explicit anchor containers.

Rules:

- the anchor container owns position
- the control owns hit area, icon size, and state styling
- repeated surfaces should expose consistent anchor names such as `BrandAnchor`, `UtilityAnchor`, or `PanelUtilityAnchor`
- anchor containers appear in debug like any other container

### 11.5 Split CTA

`Split CTA` is a first-class shared primitive in V2.

Rules:

- the main CTA and split-arrow CTA share the same state model
- disabled must remain premium, not washed out

### 11.6 Overlay Dismissal

Unpinned overlays are temporary context, not persistent chrome.

Rules:

- menus, popovers, and similar unpinned overlays close when the user clicks or taps outside them
- `Escape` closes the current unpinned overlay
- pinned overlays are the explicit exception
- dismissal rules should be shared behavior, not reinvented per screen

### 11.7 Destructive State Preparedness

Destructive visual design is deferred, but future support must be designed in now.

Required readiness:

- leave semantic token slots open for danger states
- allow future danger variants in shared button, menu item, and dialog APIs
- do not assume blue is the only important interactive state

## 12. Panel Family Contract

### 12.1 Locked

- `hero/door`
- `operational`

### 12.2 Core Family, Redesign Before Freezing

- `workspace`

Workspace is one family with subtypes:

- `workspace/source`
- `workspace/editor`
- `workspace/result`
- `workspace/support-inline`

### 12.3 Provisional, Pending Structural Audit

- `support rail`
- `floating`

### 12.4 Omitted

- `choice`

## 13. Rebuild Fidelity Contract

The default goal of the V2 rebuild is to faithfully recreate the visual and interaction design of the old app in a more structurally sound system.

This is a rebuild, not a redesign.

Rules:

- for most screens, the old app is the visual reference
- do not invent a new design direction unless explicitly asked
- preserve the proven composition, hierarchy, action placement, and interaction patterns of the existing screen
- use V2 to improve engineering quality, proportion discipline, consistency, responsiveness, and extensibility
- Layer 3 and Layer 4 flexibility exists so nuanced elements and interactions can be rebuilt cleanly, not so the screen can be reimagined
- if a reference detail is visually strong but structurally weak, keep the visual intent and rebuild the structure underneath it
- Level 1 should remain shared and stable
- Level 2 should change rarely and only for real shell needs, not local screen preferences
- do not over-create wrappers or containers; if a container exists it must own real layout responsibility
- consistent naming and debug visibility are mandatory even when faithfully recreating an old design

Reference interpretation rule:

- when a legacy screen already has a strong visual and interaction solution, the job is to translate it into contracts and reusable primitives
- when a screenshot or diagram defines proportions but not the exact internal substructure, infer the necessary Layer 3 and Layer 4 containers to support that known design cleanly
- those inferred containers should serve the reference design, not replace it with a new one

## 14. Per-Screen Contract Requirement

Each V2 screen must export one `layoutContract`.

Rules:

- the contract defines its Layer 3 and any Layer 4 structure
- the contract declares its `bodyBackdrop.preset`
- the renderer uses that contract to build the screen DOM
- the debug tool uses that same contract to inspect the screen
- no screen should become a giant mixed file that owns screen rendering, debug config, and unrelated state plumbing at the same time

Backdrop rule:

- `bodyBackdrop.preset = "default"` uses the shared AraPal V2 backdrop
- `bodyBackdrop.preset = "none"` disables the shared backdrop
- additional bespoke presets may be added to the shared backdrop preset registry and selected per screen
- the shared backdrop preset registry lives in `src/v2/foundation/layout/bodyBackdropPresets.jsx`
- changing the `default` preset updates every screen contract that points at `default`

## 15. Validation Contract

For every V2 screen:

1. define the screen contract
2. render the empty shell
3. verify the shell in debug
4. populate items and primitives
5. validate at `1366x768`
6. validate at `1440x900`
7. validate at `1920x1080`

Rules:

- container visibility in debug is mandatory from day one
- long content, zoom pressure, and smaller desktop heights must not break the shell
- if the shell fails structurally, fix the contract or primitive, not the symptom

## 16. Deferred By Design

These are intentionally not frozen yet:

- destructive visual design
- full workspace panel canonization
- final structural approval for `support rail`
- final structural approval for `floating`
- any reintroduction of a `choice` panel family
