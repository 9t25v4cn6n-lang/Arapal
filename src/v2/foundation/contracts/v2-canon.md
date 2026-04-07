# V2 Canon

## Purpose

This is the short, reviewable canon for V2.

Use it for rules that we have explicitly agreed and want to keep stable.
It is intentionally shorter than `foundation-contracts.md`.

## Success Criteria

Everything in V2 should serve these three outcomes:

- consistent but refined design language
- engineering excellence through structural clarity and reuse
- faster future screens through shared generics and stable contracts

Decision rule:

- if a change improves one of these while materially damaging the others, pause and reassess
- the goal is not isolated visual wins; the goal is a product that looks coherent, is well built, and gets easier to extend

## File Responsibilities

- `AGENTS.md` = product constitution and top-level doctrine
- `v2-canon.md` = concise collaboration canon and locked working rules
- `foundation-contracts.md` = detailed implementation contract
- `tokens/*.ts` = canonical values
- `v2-generic-inventory.md` = what is locked, candidate, deferred, or still under review

## 1. Core Principles

### 1.1 Rebuild Fidelity

V2 is a rebuild, not a redesign.

Rules:

- before extraction:
  - `Current app` = product truth
  - `Old app` = visual/detail truth when it is stronger
- after extraction and approval:
  - the `V2 generic` becomes the primary reference
  - current/old app become fallback reference sources only
- preserve the visual and interaction logic of the best existing screen where possible
- accept small shifts in size, position, or proportion when needed to obey the new contract system
- do not invent a new design if a good existing implementation already exists

### 1.2 Engineering Before Finesse

We optimise in this order:

1. structural correctness
2. reusable ownership
3. consistency
4. visual finesse

Rules:

- fix at parent, component, or system level before styling locally
- if a visual bug comes from ownership, spacing, or wrapper structure, solve that first
- do not screenshot-nudge
- if a pattern is likely to recur twice, extract it before continuing to polish it in place

### 1.3 Screen Ownership

A screen may own:

- layout composition
- screen-specific copy/content
- screen-specific state wiring

A screen may not own:

- generic button styling
- generic panel chrome
- generic editor chrome
- generic popover/menu styling
- generic utility-control behavior

### 1.3.1 Parallel Screen Rebuild Protocol

When rebuilding a real product screen after the labs are locked, prefer a parallel rebuild inside `src/v2`, not an in-place rewrite of the current screen.

Rules:

- keep `V1` untouched
- keep the current `V2` screen as the reference until the rebuild is approved
- create the fresh rebuild as a sibling screen inside `src/v2/screens`
- use a clear temporary suffix such as `Next` for:
  - the folder
  - the screen component
  - the screen contract
  - the route id
- the temporary rebuild route exists for review only; it is not the final swap yet
- build the new screen from the locked generics and locked pattern families first
- do not copy/paste large screen-local styling blocks from the current screen into the rebuild
- if an existing later-layer implementation is already good, extract it into a shared primitive and consume that shared primitive from both screens
- only change a shared primitive during a parallel rebuild if:
  - the primitive is truly wrong at the system level
  - we validate the primitive change where else it is used
- once the rebuild is approved:
  - swap the canonical route to the new screen
  - then archive or remove the old temporary/reference screen in a follow-up cleanup

Default file shape:

- `src/v2/screens/<ScreenName>Next/<ScreenName>NextScreen.jsx`
- `src/v2/screens/<ScreenName>Next/<ScreenName>NextScreen.contract.ts`

Default route shape:

- current route stays intact
- parallel rebuild uses a temporary route such as `<screenId>Next`

### 1.4 Wrapper Discipline

Minimize wrappers and containers to what is structurally necessary.

Rules:

- every wrapper must own one distinct responsibility
- valid responsibilities include layout, spacing, clipping, background, scroll, or alignment
- remove wrappers that only duplicate another surface owner or create a fake mock inside a real surface
- if a specimen can render directly in a display stage, do not wrap it again inside another preview shell
- wrapper complexity is a bug source, not harmless abstraction

### 1.5 Shell Stability

The shared shell should stay stable unless a true shell bug appears.

Rules:

- Layer 1 and Layer 2 are shared system structure
- do not mutate Layer 1 or Layer 2 to suit one screen
- screen-specific structure begins later, inside the declared field owners
- if a shell bug appears, fix the shell, not the screenshot

### 1.5.1 Shell Sizing Canon

The normalized shell grammar is `14x9`.

Rules:

- `Layer 1` top header = `0.5 / 9` normalized screen height
- `Layer 1` collapsed rail = `0.5 / 14` normalized screen width
- `Layer 2` collapsed default split inside the body field = `3.5 / 6.5 / 3.5`
- `Layer 2` expanded default split inside the body field = `1.25 / 8.5 / 1.25`
- expanded rail is not a separate arbitrary width
- expanded rail = `3` normalized units
- when space tightens, left and right gutters yield symmetrically before the center fails
- a screen may represent outer gutters as layout-owned tracks instead of empty child containers when those gutters do not own content
- current desktop implementation tokens are:
  - header height = `50px`
  - collapsed rail width = `51.429px`
  - expanded rail width = `308.571px`
  - Layer 2 collapsed left gutter = `360px`
  - Layer 2 collapsed center field = `668.571px`
  - Layer 2 collapsed right gutter = `360px`
  - Layer 2 expanded left gutter = `128.571px`
  - Layer 2 expanded center field = `874.286px`
  - Layer 2 expanded right gutter = `128.571px`

### 1.6 Lab Workflow

Labs are for judging generics visually.

Rules:

- labs do not need to obey product-screen structure
- labs exist to judge the generics themselves, not commentary
- every review card should present one thing to assess
- if a generic is not yet extracted, show an explicit placeholder rather than silently omitting it
- once a generic is approved, update the inventory and treat V2 as its source of truth

### 1.6.1 Frozen Lab Rule

The current lab set is frozen as a reference layer.

Rules:

- do not keep expanding the labs by default
- after a category is locked, the lab becomes a reference board, not an ongoing playground
- only reopen or extend a lab when:
  - a real product-screen gap appears
  - a locked generic proves insufficient under real use
  - a new reusable family is discovered that cannot be expressed by the existing set

### 1.6.2 Locked Screen-Pattern Families

The current locked screen-pattern grammar is:

- `Layer 1 universal shell`
- `Layer 2 default split`
- `Operational center-band stack`
- `Full-width work stage`
- `Layer 5 content owner`
- `Centered stage stack`
- `Hero / two-up / footer shell`
- `Study three-pane shell`
- `Browse + content shell`

Current mode mappings:

- `Segmentation` uses `Operational center-band stack`
- `Patching` uses `Hero / two-up / footer shell`
- `Exams` use `Centered stage stack`
- `Success / review` uses `Centered stage stack`

### 1.7 Reuse Existing Good Implementations

If a later-layer generic already exists in good form, reuse it exactly instead of remaking it by approximation.

Rules:

- do not visually remake a good V1/V2 generic three times
- extract the existing implementation cleanly
- keep only the smallest adaptation required to fit shared ownership and spacing rules
- if a structural owner has children, those children must either span the owner end-to-end as declared bands/slots or be explicitly declared structural spacers
- do not leave meaningful leaves floating directly inside a large structural owner
- health checks should verify this rule through both contract semantics and rendered QA, not by screenshot judgment alone
- approved screens must pass the shared QA gates for containment, inset, debug coverage, composition integrity, and gutter yield

## 2. Specific Design Rules

### 2.1 Padding And Inset Doctrine

We use a minimum readable inset plus shared padding roles.

Rules:

- `minimum readable inset` = `16`
- every text-bearing surface must use a shared padding role
- `standard` is the default for most cards, panels, and review surfaces
- `comfortable` is the default for reading-first and editor-like surfaces
- `compact` is for dense rows and utility surfaces only
- `modal` is for focused overlays and expanded surfaces
- outer page spacing and internal readable inset are separate concerns
- attached chrome such as casing, marks, and watermarks must sit outside or behind the readable inset

### 2.2 Radius Doctrine

The radius scale is:

- `12`
- `16`
- `24`
- `32`
- `pill`

Rules:

- `24` is the default radius for most cards and panels
- `12` is for compact controls and tighter utility surfaces
- `16` is for inputs and smaller support surfaces
- `32` is for hero and ceremonial surfaces
- `pill` is for buttons, chips, pills, and CTA clusters
- pill is not the default radius for large cards or panels

### 2.3 Semantic Surface Tone Palette

This is a semantic surface palette, not a recolour-all-text system.

Rules:

- tone primarily affects `surface`, `border`, `shadow`, and `icon`
- body text stays neutral by default
- support/meta text stays neutral by default
- short titles may adopt the tone when readability remains strong
- long descriptions, editor content, and dense informational rows should not inherit the tone by default

The current semantic families are:

- support tones: `Lexicography`, `Discussion`, `Manual notes`, `Raw text`
- state tones: `Repair / fail`, `Ready / pass`

### 2.4 Surface Opacity Rules

Editor chrome opacity should be standardized, not improvised per screen.

Current standard values:

- `Topbar chrome` = `0.34`
- `Footer hint` = `0.28`
- `Watermark` = `0.085`

### 2.5 CTA Polish Rule

Sheen is reserved for large ceremonial CTAs.

Rules:

- primary CTAs may use the shared sheen/highlight sweep
- small buttons should use fill, lift, and sharpened hover instead of a full sheen sweep
- split CTAs should read as one composed action cluster, not two unrelated buttons

### 2.6 Utility Control Rule

Small controls are one shared family.

Rules:

- back, pin, expand, collapse, close, and similar mini-controls belong to one utility family
- small utility controls use the shared hover-box treatment
- utility icons are the generic, not any board-specific framing around them

### 2.7 Overlay Dismissal Rule

Default overlay behavior:

- outside click closes it
- `Escape` closes it
- exception: pinned surfaces stay open

### 2.8 Control Hint Rule

Helpful hints should appear on hover where control meaning is not already obvious from context.

Rules:

- most controls should expose a useful hover hint or tooltip when their meaning may be unclear
- hints should clarify, not clutter
- hints are especially important for compact controls, shortcut affordances, and less obvious utility actions
- hints should stay quiet and supportive rather than becoming another loud chrome layer

## 3. Working Method

### 3.1 Locking Process

When a rule is agreed:

1. record the principle in `v2-canon.md`
2. update `foundation-contracts.md` if implementation doctrine or wording must change
3. update `tokens/*.ts` if values are involved
4. update `v2-generic-inventory.md` if a generic status or taxonomy changed

### 3.2 Drift Test

We are drifting if:

- a screen starts becoming its own mini design system
- a shared shell layer changes for one local problem
- a repeated pattern is tweaked locally instead of extracted
- we keep remaking an existing good implementation instead of reusing it
- wrappers multiply without distinct ownership

### 3.3 Review Standard

A generic is only ready to lock if it is:

- structurally clean
- visually coherent with the rest of the product
- reusable across more than one screen or mode
- understandable in ownership and taxonomy
- easier to maintain than the screen-local version it replaces
