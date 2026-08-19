# AraPal → Figma: Work Order

**Figma file:** `VwzaUb5YtAonCnMVMRmvmd` — <https://www.figma.com/design/VwzaUb5YtAonCnMVMRmvmd>
**Canonical frame:** 1440 × 900. Root font-size **18px** (not 16 — em/rem resolve against 18).
**Grid:** 14 × 9 units. widthUnit 102.857px, heightUnit 100px. Source: `src/v2/foundation/layout/shellSizing.ts`.

---

## 0. Purpose and end state

This document takes the Figma file from *"partially rebuilt, several screens wrong"* to *"a clean, complete, public-ready design system and screen set"* — so that the next phase of work can be **new design**, not repair.

Three phases, executed in order. Do not start a phase before the previous one passes its exit criteria.

| Phase | Outcome |
|---|---|
| **A — Parity** | Every screen faithfully matches the running app. Nothing missing, nothing invented. |
| **B — QA sweep** | Every defect inherited from the app or introduced in rebuild is found and logged. |
| **C — Polished version** | A duplicated, levelled-up screen set that is consistent, elegant and genuinely ship-quality. |

**Phase A and Phase C outputs must remain separately visible and clearly labelled.** Faithful reconstruction and improvement must never be blended into one artefact — per `CLAUDE.md`, the distinction between observed current state and proposed future state has to stay legible.

---

## 1. Roles to assume

Adopt these roles explicitly. When a judgement is contested, state which role is speaking and why it wins.

| Role | Owns | Applies in |
|---|---|---|
| **Design Systems Lead** | Tokens, variables, components, variants, naming, reuse. Rejects one-off values. | A, B, C |
| **Visual Designer** | Typography, colour, hierarchy, spacing rhythm, optical balance, restraint. | B, C |
| **Interaction Designer** | States, transitions, affordances, what's clickable, motion timing. | B, C |
| **Information Architect** | Screen structure, grouping, what belongs where, primary action clarity. | C |
| **Accessibility Specialist** | Contrast, target sizes, focus order, text sizing, non-colour-only signalling. | B, C |
| **Localisation / RTL Specialist** | Arabic rendering, bidi, mixed-script runs, alignment, font fallback. | A, B, C |
| **Frontend Engineer** | Whether a design is buildable and maintainable against the real token/component system. | B, C |
| **QA Tester** | Adversarial defect hunting. Assumes something is broken until proven otherwise. | B |
| **Creative Director** | Final human-eye critique. Would this survive professional review? | C |

**Standing rule for all roles:** never mark a frame done without a **live screenshot diff**. Every frame built from source-reading or estimation in prior sessions turned out wrong — no exceptions. Extract → build → screenshot → compare → fix.

---

## 2. Method (non-negotiable)

### 2.1 Extraction

Run the app at **1440 × 900** and extract exact DOM geometry via browser `javascript_tool`:

```js
const out = [];
function walk(el,d,max){
  if(d>max||!el||el.nodeType!==1) return;
  const cs=getComputedStyle(el); if(cs.display==='none') return;
  const r=el.getBoundingClientRect(); if(r.width<2||r.height<2) return;
  const own=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).filter(Boolean).join(' ');
  let s='  '.repeat(d)+el.tagName+' '+[r.x,r.y,r.width,r.height].map(Math.round).join(',');
  if(own) s+=' "'+own.slice(0,70)+'" '+cs.fontSize+'/'+cs.fontWeight+'/'+cs.color+'/'+cs.fontFamily.split(',')[0]+'/ls:'+cs.letterSpacing;
  if(cs.backgroundColor!=='rgba(0, 0, 0, 0)') s+=' bg:'+cs.backgroundColor;
  if(cs.backgroundImage!=='none') s+=' bgi:'+cs.backgroundImage.slice(0,60);
  if(cs.borderRadius!=='0px') s+=' r:'+cs.borderRadius;
  const bw=parseFloat(cs.borderTopWidth)||0; if(bw) s+=' bd:'+bw+cs.borderTopColor;
  if(cs.boxShadow!=='none') s+=' sh:'+cs.boxShadow.slice(0,40);
  if(el.tagName.toLowerCase()==='svg') s+=' SVG:'+el.getAttribute('class');
  out.push(s); for(const c of el.children) walk(c,d+1,max);
}
```

### 2.2 Reaching non-default states

- **Study result states** — dev buttons `Draft` / `Fail` / `Pass` in the header.
- **Study discuss panel** — click `Discuss This Segment`.
- **Home intro** — loads automatically; capture at ~700ms (intro) and ~1650ms (outro). `?intro=0` skips it. A "Replay intro" button re-triggers.
- **Segmentation Review** — paste source text → open the split-CTA chevron → **turn Quick mode OFF** → `AI Segment Text`. With Quick mode on it goes to Success instead.
- **Segmentation Loading / Transition** — capture at ~900ms and ~2500ms after starting.

### 2.3 Verification

Screenshot the Figma frame, screenshot the live app, compare side by side, list every difference, fix, re-verify. A frame is done only when the diff list is empty or every remaining item is a **consciously recorded deviation**.

---

## 3. PHASE A — Restore parity

### A1. Home — rebuild on the V2 shell

Currently built on **legacy** chrome (70px white header, Replay intro / Projects → / Segmentation → buttons). It must use the **V2 shell**:

- **V2 header, 50px**, `rgba(255,255,255,0.92)`, three lanes — source `src/v2/foundation/primitives/HeaderBar.jsx`:
  - start: brand pill (only when no rail)
  - centre: mode label (`eyebrowLabel`, `accentBase`) over description (`monoMeta`, `textSoft`), centred, 4px gap
  - end: `#v2/<routeId>` in `eyebrowLabel` / `textFaint`
- **Left rail** below the header, 51.43px collapsed.
- **V2 body backdrop** (section A2).
- Home *content* (hero + 4-card deck) stays as extracted from legacy `#home`.

Frames: `Home / 01 · Intro`, `02 · Intro-outro`, `03 · Resting`.

> Note: an earlier decision in the originating session said to keep Home's own legacy header. That was **superseded** — V2 shell is correct.

### A2. V2 body backdrop — missing from every frame

This is why backgrounds read as flat. Source: `src/v2/foundation/layout/BodyBackdropItems.jsx`. Build **once** as a reusable component, place behind content on **every V2 frame**. Percentages are of the body area, not the whole frame.

| Element | Spec |
|---|---|
| Diagonal 1 | `top:-3% left:9.6% height:124% width:2px`, `rotate(-18deg)`, origin top-centre, opacity 0.96 |
| Diagonal 1 fill | `linear-gradient(180deg, rgba(37,99,235,0) 0%, rgba(37,99,235,0.18) 16%, rgba(37,99,235,0.32) 50%, rgba(37,99,235,0.1) 84%, rgba(37,99,235,0) 100%)` |
| Diagonal 2 | `top:-4% right:7.4% height:126% width:2px`, `rotate(17deg)` |
| Diagonal 2 fill | same gradient, stops `0.16 / 0.34 / 0.1` |
| Watermark A | "Arapal", Playfair Display, **210.24px** at 1440 (`clamp(116px,14.6vw,216px)`), line-height 0.84, letter-spacing −0.08em, `rgba(37,99,235,0.04)`, `left:-28px bottom:3%` |
| Watermark B | same, `rgba(37,99,235,0.05)`, `right:-18px top:7%` |
| Centre glow | `radial-gradient(circle at 50% 42%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 54%)`, opacity 0.8 |
| Inset edge | 1px `rgba(255,255,255,0.12)` + inset shadow `0 1px 0 rgba(255,255,255,0.22)`, opacity 0.5 |

Diagonals must be **crisp** — 2px hard-edged rectangles with a vertical gradient fill. Not blurred, not soft-shadowed.

### A3. Source + Segmentation — rebuild

- **Paste** — does not match live. Re-extract and rebuild.
- **Review** — wrong. Known defect: a floating "Approve & continue" button in the middle of the canvas. In the app the approve block is a **sticky footer that fades over the scroll area**. Re-extract the whole screen; it contains a full-width source-text card (EDIT / EXPAND SOURCE / HIDE), a **Segment markers** column with add + per-row remove, and a **Compiled preview** column of numbered segment articles.
- **Loading / Transition** were swapped and have been rebuilt — re-verify both against live.
- **Success** — verify.

### A4. Project Research — materially incomplete

Live has, and the frame lacks:
- Dark header block covering only the **left portion** (~x 72–530), not full width
- Ledger columns: number badge · Arabic · English gloss · chapter/topic · **tag chips** (purity, water…) · status chip
- Inspector: **DETAILS / ASK** toggle, ARABIC SOURCE, YOUR TRANSLATION, **BEST TRANSLATION**, and three actions — Open in study / **Create patch** / Clear selection
- Icons on every lens row; chevrons in the revision queue

### A5. Study — Discuss panel

Take the design from the **legacy app** (`src/components/figma/CenterPanel.jsx`). Source state: `showDiscuss`, `isDiscussFloating`, `discussExpanded`, `discussSize` default **420 × 620**, `discussPosition` default **{left 760, top 156}**, plus `discussDragState` / `discussResizeState` — it is draggable **and** resizable.

### A6. Exams (parked)

Structure is right, proportions are not: title ~64px (built at ~38px), stat cards ~410px wide (built at 220px), and the live screen has a "← Project Home" back pill plus Exams / Generate tabs rather than the left rail.

### Phase A exit criteria

- Every frame has a live screenshot diff on record.
- Zero unexplained differences; any remaining difference is a recorded, justified deviation.
- Known deviations already agreed: dev scaffolding (nav pill, Draft/Fail/Pass) **included**; Playfair Display substitutes for Georgia (unavailable in Figma — renders wider, so sizes may need reducing to avoid collisions).

---

## 4. PHASE B — QA sweep

Work through every frame against every check. **Log findings; do not silently fix during the sweep** — a defect list is the deliverable, because Phase C decides what changes and what is deliberately preserved.

For each finding record: frame · check ID · role · severity (blocker / major / minor) · evidence (screenshot or measurement) · recommended action.

### B1 — Typography · *Visual Designer + Design Systems Lead*
- Every text node uses a named text style; no ad-hoc sizes.
- No more than one type ramp; equivalent roles share a size and weight.
- Serif (Playfair) used **only** where the app uses a serif — not decoratively.
- Uppercase labels all carry letter-spacing; no unspaced all-caps.
- Line-height consistent per role; no default `AUTO` where the app sets a value.
- No orphans or widows in headings; `text-wrap: balance` equivalent on display text.
- Numerals aligned where tabular (scores, counts, timestamps).
- Arabic uses Amiri at the correct size/line-height for its role; never substituted with a Latin face.

### B2 — Spacing, rhythm and ratio · *Visual Designer*
- All spacing on the 4 / 8 scale via variables; no stray 7px, 13px, 23px.
- Sibling gaps identical; card padding identical across equivalent cards.
- Vertical rhythm consistent — section spacing not arbitrary.
- Optical centring where mathematical centring looks wrong (icons in circles, text in pills).
- Consistent ratio between card width and internal padding across screens.
- Whitespace deliberate — no accidental dead zones, no cramped clusters.

### B3 — Structure and layout · *Information Architect + Frontend Engineer*
- Every frame exactly 1440 × 900.
- Column widths match the app — **Study = 60 / 224 / 780 / 376**.
- Sidebars identical width across every screen that has one.
- Rail identical everywhere; only the active item differs.
- Header identical everywhere (allowing for mode label / route text).
- Nothing floating that should be anchored (Review's approve button is the reference failure).
- Nothing overlapping the header; z-order correct throughout.
- Auto-layout used where children are structurally related — not absolute x/y.

### B4 — Text integrity · *QA Tester*
- No clipped text anywhere. **`clipsContent` defaults to `true` on new auto-layout frames** — this has caused repeated defects; clear it explicitly.
- No truncation that doesn't exist in the app.
- No text overflowing its container unless the app does the same (Home's "CONDITION" label legitimately overflows).
- Wrapping text uses fixed width + `textAutoResize: 'HEIGHT'`, never `FILL` alone.
- Card heights budget for real wrapped content — check the longest string, not the shortest.

### B5 — Bidirectional / RTL · *Localisation Specialist*
- Arabic embedded in English wrapped in bidi isolates `U+2067 … U+2069`.
- Arabic block text aligned as the app aligns it — **verify per screen; it is not always right-aligned**.
- Mixed-script runs (Arabic term + Latin romanisation) render in the correct visual order.
- Diacritics and the ﷺ glyph render; no tofu boxes.
- Romanisation diacritics (ṣ, ā, ʿ, ī) render correctly in the mono face.

### B6 — Colour, fills and elevation · *Design Systems Lead*
- Every fill and stroke bound to a variable; no orphan hex values.
- No leftover default-white auto-layout fills (a recurring defect).
- Border colours consistent — one line colour for equivalent roles.
- Shadows use the named elevation styles, not ad-hoc effects.
- Semantic colour (success / warning / critical) distinct from the accent and used consistently.
- Gradients match the app's actual stops, not approximations.

### B7 — Icons · *Design Systems Lead*
- All icons are real Lucide vectors — none hand-drawn, none missing, no placeholder squares.
- Consistent size per context (18px rail, 16px inline, 12–14px in chips).
- Consistent stroke weight; consistent colour treatment per state.
- Icon + label pairs share consistent gap and baseline alignment.

### B8 — States and interaction · *Interaction Designer*
- Every interactive element visibly interactive.
- Active / hover / selected states consistent across screens.
- Disabled states legible and clearly disabled.
- Selected list rows use the same treatment everywhere (bar + tint + weight).
- Status chips consistent in size, radius, padding, casing.
- Empty, loading and error states present where the app has them.

### B9 — Accessibility · *Accessibility Specialist*
- Body text ≥ 4.5:1 contrast; large text ≥ 3:1. **Flag the pale greys — several are likely to fail.**
- Interactive targets ≥ 44 × 44 effective, or documented as desktop-only.
- Information never conveyed by colour alone — status needs text or icon too.
- Focus states designed, not just hover.
- Text sizes below 11px flagged for review.

### B10 — Cross-screen consistency · *Creative Director*
- The same component is built the same way on every screen.
- No drift in card style, chip style, button style between screens.
- Corner radii consistent per component class.
- Same concept named the same way in UI copy across screens.
- Screens feel like one product, not five.

### B11 — Figma hygiene · *Design Systems Lead*
- Layers named meaningfully (`Support Card/Guidance`, never `Frame 12`).
- Frames named `Screen / NN · State`.
- No detached duplicates of what should be a component.
- No hidden or zero-opacity leftover nodes.
- Pages ordered logically; no stray off-canvas artefacts.

### Phase B exit criteria

A written defect log covering every frame and every check ID, each finding attributed to a role and a severity, with evidence. **No fixes applied yet.**

---

## 5. PHASE C — Polished, public-ready version

### C1. Set up the second version

Duplicate every Phase-A page into a parallel set. Naming must make the distinction unmissable:

```
01 · Foundations
02 · Components
10 · Reconstruction — Home            ← Phase A, frozen, do not edit
11 · Reconstruction — Study
12 · Reconstruction — Segmentation
13 · Reconstruction — Research
14 · Reconstruction — Parked
30 · Polished — Home                  ← Phase C, all work happens here
31 · Polished — Study
32 · Polished — Segmentation
33 · Polished — Research
34 · Polished — Exams
```

The Reconstruction set is the **baseline of record** and is frozen once Phase A passes. All Phase C work happens on the Polished set.

### C2. What "public-ready" means here

**This phase is executed autonomously — your best attempt without human guidance.** Do not stop for check-ins or design approvals. Make the calls, record them, and present the finished result. Where a decision is genuinely contested, pick the stronger option, note it in the spec, and continue.

You have **full creative reign**, with the running app as the basis and starting point. Take that basis and level it up to genuine public polish. `CLAUDE.md` is the governing standard for engineering, visual quality and completion honesty — apply it as written, particularly the visual quality bar: *nothing visibly out of place should survive professional review.*

**Do:**
- Fix every blocker and major from the Phase B log.
- Normalise everything to the design system — no one-offs.
- Correct spacing rhythm, optical alignment and hierarchy wherever the app is weak.
- Fix accessibility failures (contrast, target size, colour-only signalling).
- Give each screen one unmistakable primary action.
- Complete missing states (empty / loading / error) where absence is a real gap.
- Improve compositions that are genuinely weak — this is a levelling-up, not a tracing exercise.
- Build proper components with variants so the set is maintainable.

**Do not:**
- Change the visual identity. It stays calm, premium, editorial, scholarly, restrained — never generic SaaS, never dashboard clutter.
- Invent new features or product surface that does not exist.
- Discard something merely because it is unfamiliar. Understand the intent, then serve it better.

### C2b. Mobile counterparts — required

Every polished screen needs a **mobile counterpart**. Canonical mobile frame: **390 × 844**.

- Mobile is a genuine adaptation, not a squeeze. Re-think navigation (the 51px rail cannot survive as-is), stacking order, and what collapses behind disclosure.
- Preserve the primary action's prominence at every size.
- Arabic source text must stay comfortably readable — it is the core content and takes priority over chrome.
- The four-pane Study workspace is the hard case: decide and document how segments, source, editor and support coexist on a phone (tabs, sheets, progressive disclosure — your call, but justify it).
- Reference the app's existing breakpoints (`900px`, `1320px` in `ProjectHomeScreen`) as evidence of intent, not as a constraint.
- Name frames `Screen / NN · State · Mobile`.

### C2c. Viewable prototype — required

The result must be **viewable as an app**, not just a wall of frames.

- Wire prototype connections so the primary journeys can be clicked through end to end: Home → Study → Segmentation flow → Success → Study, plus Research and Exams entry points.
- Use Smart Animate where elements persist between frames.
- Set transition durations and curves to match the motion tokens (see C5).
- Provide a clear entry frame per flow so Present mode starts in the right place.
- Both desktop and mobile sets should be presentable.

### C3. Component library — *Design Systems Lead*

Before touching screens, build the real component set on `02 · Components`, each with variants:

- Button — primary / secondary / ghost / destructive × default / hover / pressed / disabled × sizes
- Icon button — sizes × states
- Chip / badge — status (ready / review / completed / weak) × sizes
- Card — surface / soft / dark × padding scales
- Support card — tone (guidance / lexicography / phrasing / grade / takeaways / fix-steps) × collapsed / expanded
- List row — segment / chapter / lens / ledger × default / hover / active
- Input — text / search / textarea × default / focus / filled / disabled
- Nav rail — collapsed / expanded × per-active-item
- Header bar — with rail / without rail
- Step bar — 3 steps × active index
- Panel — docked / floating / expanded
- Score ring — pass / fail
- Body backdrop — the A2 component

Bind everything to variables. No hardcoded values anywhere in the polished set.

### C4. Screen polish pass — *Visual Designer + Interaction Designer*

Per screen, in priority order (**Home → Study → Segmentation → Research → Exams**):

1. Rebuild from components — no detached copies.
2. Apply the corrected spacing rhythm.
3. Resolve every Phase B finding for that screen.
4. Strengthen hierarchy: one unmistakable primary action, secondary actions clearly subordinate.
5. Balance the composition — optical alignment, deliberate whitespace, no dead zones.
6. Complete the state set.
7. Screenshot and critique as Creative Director; iterate until it holds up.

### C5. Motion specification — *Interaction Designer*

Motion is a first-class deliverable, since the app will be rebuilt from this.

- Use the real tokens from `src/v2/foundation/tokens/motion.ts`: `micro` 120ms ease-out · `panel` 220ms cubic-bezier(0.2,0.8,0.2,1) · `screen` 320ms cubic-bezier(0.22,1,0.36,1).
- Home intro sequence: `intro` 0–1300ms → `outro` 1300–2100ms → `done`; logo mark sweep 1.8s with 0.28s delay.
- Segmentation has 8 named keyframes (chip flight, bridge pulse, shimmer, marker pulse) — specify each.
- Prototype connections for screen-to-screen transitions; in-frame animation for state changes.
- **Known limitation:** Figma prototype easing/duration is not variable-bindable via the Plugin API. The Motion collection is a documentation reference; connections must be set to match by eye.
- Anything Figma cannot express goes into the written spec instead — it must still be implementable.

### C6. Specification document

The rebuild deliverable is **Figma + a written spec sufficient to rebuild the product**. Maintain it as Phase C proceeds, not retrofitted:

- Token reference and how it maps to `foundation/tokens/`
- Component inventory with props/variants
- Per-screen: layout, states, transitions, edge cases
- Motion timings and curves
- Accessibility decisions
- Every deliberate deviation from the current app, with rationale

### Phase C exit criteria

- Every blocker and major from Phase B resolved or consciously accepted with rationale.
- Every polished frame built from components; zero detached one-offs.
- Every value bound to a variable.
- Full state coverage per screen.
- **Mobile counterpart for every screen at 390 × 844.**
- Motion specified and playable.
- **Prototype wired; primary journeys clickable end to end on desktop and mobile.**
- Spec document complete.
- Creative Director sign-off: *"nothing visibly out of place would survive professional review."*

---

## 6. Build gotchas (Figma Plugin API)

- `layoutSizing* = 'FILL'` must be set **after** `appendChild`, never before. Most common failure.
- New auto-layout frames default to `clipsContent: true` **and** an opaque white fill — clear both explicitly.
- Use `createNodeFromSvg()` for icons; raw `vectorPaths` rejects Lucide path data over number/letter spacing.
- Reload every font in **each** `use_figma` call before mutating text.
- Georgia is unavailable → Playfair Display. It renders wider; reduce size to avoid collisions.
- `figma.currentPage` resets each call; call `setCurrentPageAsync` at most once per call, and fan multi-page work out into parallel calls.
- Page children are lazily loaded — a page can report zero children until you switch to it.
- Scoped colour variables carry `alpha = 1`; for translucent fills set paint-level `opacity` instead.
- `fontWeight` is read-only on text nodes — set `fontName.style`.

---

## 7. Reference material

- **Live captures** from the originating session (`live/*.png`): home-intro, home-outro, study-fail, study-discuss, seg-loading, seg-transition, seg-success, research, exams, projects. Re-capture if stale.
- **Routes** — legacy: `#home` `#study` `#segmentation` `#exams` `#projects`. V2: `#v2/<routeId>`.
- **Legacy is the behaviour spec; V2 is the construction basis.** Neither alone is "the app".
- Reference docs: `CLAUDE.md` (standards), `AGENTS.md` (product doctrine), `src/v2/foundation/contracts/`.
