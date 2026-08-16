# AraPal — Polished Design Specification (Desktop)

**Figma file:** `VwzaUb5YtAonCnMVMRmvmd`
**Canonical frame:** 1440 × 900
**Status:** desktop complete. Mobile (390 × 844) and the prototype wiring are **not** built — next session.

This document is the written half of the Phase C deliverable. Figma alone is not sufficient to rebuild the product; everything a build needs that a frame cannot express lives here.

---

## 1. Page structure

| Page | Contents | State |
|---|---|---|
| `00 · Cover` | file cover | — |
| `01 · Foundations` | variable collections, text styles, effect styles, the V2 shell components from Phase A | live |
| `02 · Components` | the polished component library (§3) | live |
| `10–14 · Reconstruction — …` | Phase A parity frames | **frozen — every top-level frame is locked** |
| `30 · Polished — Home` | `Home / 01 · Resting` | live |
| `31 · Polished — Study` | `Study / 01 · Draft`, `Study / 02 · Submitted · Pass` | live |
| `32 · Polished — Segmentation` | `Segmentation / 01 · Paste`, `02 · Review` | live |
| `33 · Polished — Research` | `Research / 01 · Segment selected` | live |
| `34 · Polished — Exams` | `Exams / 01 · Library` | live |

The Reconstruction set is the baseline of record. It is locked, not hidden — the whole point is that observed current state and proposed future state stay comparable side by side.

---

## 2. Tokens

### 2.1 Colour — collection `Color`

Inherited unchanged from `src/v2/foundation/tokens/colors.ts`:

`accent-base` #2563EB · `accent-strong` #1D4ED8 · `accent-soft` #93C5FD · `accent-wash` #EFF6FF · `accent-mist` #DBEAFE · `bg-top` #F6F9FD · `bg-bottom` #EDF3F9 · `surface-primary` #FFFFFF · `surface-soft` #F8FBFF · `text-strong` #0F172A · `text-body` #334155 · `text-soft` #64748B · `success` #16A34A · `review` #D97706 · `line-soft` rgba(219,228,239,.96) · `line-strong` rgba(147,197,253,.72)

**Retuned:**

| Token | Was | Now | Why |
|---|---|---|---|
| `text-faint` | #94A3B8 | #8496AE | 2.6:1 → 3.2:1. Reclassified: **decorative and icon use only, never text.** |

**Added:**

| Token | Value | Purpose |
|---|---|---|
| `accent-press` | #1E3A8A | pressed state for accent controls |
| `critical` / `critical-strong` / `critical-press` | #E11D48 / #BE123C / #9F1239 | destructive actions; `critical-strong` is the text weight (5.9:1) |
| `success-strong` | #15803D | success **text** (4.6:1). `success` #16A34A is 3.0:1 and is icon/fill only |
| `review-strong` | #B45309 | review **text** (4.6:1). `review` #D97706 is 2.7:1 and is icon/fill only |
| `success-wash` / `review-wash` / `critical-wash` | #ECFDF5 / #FFFBEB / #FFF1F3 | status chip fills |
| `ink-panel` / `ink-panel-soft` | #111C30 / #1F2C44 | dark emphasis blocks (Research header, Exams generate card) |
| `on-accent` / `on-ink` / `on-ink-soft` | #FFFFFF / #E7EDF7 / #9AAAC4 | foregrounds for saturated and dark surfaces |
| `line-hairline` | rgba(15,23,42,.07) | interior rules inside a card |
| `focus-ring` | rgba(37,99,235,.38) | 3 px focus ring |
| `scrim` | rgba(15,23,42,.44) | modal/overlay scrim |
| `surface-disabled` | #E4EAF3 | disabled control fill |
| `tone-guidance` / `-lexis` / `-phrasing` / `-grade` / `-takeaways` / `-fix` (+ `-wash` each) | #2563EB / #6D28D9 / #C2410C / #334155 / #15803D / #BE123C | the six support-card tones. Grade is graphite, not teal — teal was indistinguishable from Takeaways green at wash strength |

### 2.2 Spacing — collection `Spacing`

4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 72. Everything on the 4/8 scale; 56 and 72 added this pass. No value outside this set appears in the polished screens.

### 2.3 Radius — collection `Radius`

| Token | Value | Applied to |
|---|---|---|
| `radius-8` | 8 | tag chips, inline badges, context boxes, keycaps |
| `radius-12` | 12 | list rows, nested surfaces, inputs, rail items |
| `radius-16` | 16 | cards and panels — the dominant radius |
| `radius-20` | 20 | the segmentation intake card |
| `radius-24` | 24 | reserved for modals |
| `radius-pill` | 999 | all buttons, all chips |

### 2.4 Typography — text styles `P/01` – `P/16`

One ramp. Nothing below 11 px.

| Style | Face | Size | Line | Tracking | Role |
|---|---|---|---|---|---|
| `P/01 Display` | Playfair Display SemiBold | 44 | 106 % | −1.5 % | one per screen |
| `P/02 Title` | Playfair Display SemiBold | 30 | 112 % | −1 % | card titles |
| `P/03 Heading` | Playfair Display SemiBold | 21 | 124 % | −0.5 % | panel and block titles |
| `P/04 Subtitle` | Inter Medium | 17 | 150 % | −0.5 % | hero subtitles, lead paragraphs |
| `P/05 Body` | Inter Regular | 15 | 162 % | 0 | default body, list labels |
| `P/06 Body Strong` | Inter Semi Bold | 15 | 162 % | 0 | emphasised body, Md button labels |
| `P/07 Body Small` | Inter Regular | 13.5 | 156 % | 0 | support text, captions |
| `P/08 Label` | Inter Semi Bold | 12.5 | 120 % | 0 | Sm button labels, tabs, tags |
| `P/09 Eyebrow` | Inter Semi Bold | 11 | 120 % | 14 % | UPPERCASE section labels |
| `P/10 Mono` | JetBrains Mono Regular | 11.5 | 140 % | 0 | romanisation, counts, hints |
| `P/11 Mono Label` | JetBrains Mono Medium | 11 | 130 % | 4 % | UPPERCASE tabular refs (1.3, 03:20) |
| `P/12 CTA` | Inter Bold | 13 | 100 % | 8 % | reserved for a single hero CTA |
| `P/13 Numeric` | JetBrains Mono Medium | 26 | 110 % | −1 % | stat values, scores |
| `P/14 Arabic Source` | Amiri Regular | 24 | 195 % | 0 | the study passage — the largest text in the product |
| `P/15 Arabic Block` | Amiri Regular | 19 | 190 % | 0 | ledger excerpts, segment previews |
| `P/16 Arabic Inline` | Amiri Bold | 17 | 150 % | 0 | terms inside English prose |

**Rules.**
Serif (Playfair) is used only where the app uses a serif — display, titles, headings. Never decoratively.
Uppercase exists in exactly two styles (`P/09`, `P/11`), both letterspaced. Nowhere else.
Numerals that sit in a column are mono (`P/11`, `P/13`) so they align.
Arabic never falls back to a Latin face. The app declares Inter for Arabic runs and relies on an OS naskh fallback; Figma has none, so Amiri is explicit.

**Georgia substitution.** The app's serif stack is `"Playfair Display", Georgia, serif` — Playfair is first, so this is not a substitution at all in practice.

### 2.5 Elevation — effect styles `Elevation/P *`

Two layers each: a tight contact shadow plus a broad ambient one. The app's single 44–72 px blur at 8–22 % alpha reads as haze.

| Style | Contact | Ambient | Use |
|---|---|---|---|
| `Elevation/P Hairline` | 0 1 2 / 4 % | — | support cards, nested surfaces |
| `Elevation/P Rest` | 0 1 2 / 4 % | 0 8 24 / 5 % | cards and panels at rest |
| `Elevation/P Raised` | 0 1 3 / 5 % | 0 16 40 / 8 % | inspector, intake card, emphasis panels |
| `Elevation/P Floating` | 0 2 6 / 6 % | 0 24 56 / 12 % | draggable panels |
| `Elevation/P Overlay` | 0 2 8 / 8 % | 0 40 80 / 18 % | modals, the floating discuss panel |

### 2.6 Motion — collection `Motion` (documentation only)

From `src/v2/foundation/tokens/motion.ts`:

| Token | Value | Use |
|---|---|---|
| `micro` | 120 ms `ease-out` | hover, press, chip toggle, focus ring |
| `panel` | 220 ms `cubic-bezier(.2,.8,.2,1)` | disclosure, panel open/close, rail expand, support card expand |
| `screen` | 320 ms `cubic-bezier(.22,1,.36,1)` | route transitions |

**Known limitation:** Figma prototype easing and duration are not variable-bindable via the Plugin API. When the prototype is wired, connections must be set to match these numbers by eye.

Named sequences to implement:

- **Home intro** — `intro` 0–1300 ms → `outro` 1300–2100 ms → `done`. Logo mark sweep 1.8 s with 0.28 s delay.
- **Segmentation** — eight keyframes (chip flight, bridge pulse, shimmer, marker pulse) defined in `src/v2/foundation/tokens/segmentationFlow.ts`. Rebuild against that file; this pass did not re-derive them.
- **Scroll edges** — the fades on the Study support rail, the Research ledger and the Segmentation footer are static in Figma. In build they are `mask-image` gradients that fade to zero at scroll end.

---

## 3. Component inventory

All on `02 · Components`. Every fill, stroke, radius and gap is bound to a variable.

| Component | Variant axes | Count | Properties |
|---|---|---|---|
| `Button` | Variant (Primary/Secondary/Ghost/Destructive) × State (Default/Hover/Pressed/Disabled) × Size (Md 40/Sm 32) | 32 | `Label` text · `Show icon` + `Icon` (leading) · `Show trailing icon` + `Trailing icon` |
| `Icon Button` | Variant (Ghost/Outline/Solid) × State (4) × Size (Lg 44/Md 36/Sm 28) | 36 | `Icon` swap |
| `Status Chip` | Tone (Ready/Review/Weak/Completed/Draft) | 5 | — |
| `Tag Chip` | State (Default/Active) | 2 | — |
| `Filter Chip` | State (Default/Hover/Active) | 3 | — |
| `Card` | Surface (White/Soft/Dark) × Padding (Compact 16/Standard 20/Comfortable 24) | 9 | — |
| `Input` | Kind (Text/Search/Textarea) × State (Default/Focus/Filled/Disabled) | 12 | — |
| `Support Card` | Tone (Guidance/Lexicography/Phrasing/Grade/Takeaways/FixSteps) × State (Collapsed/Expanded) | 12 | — |
| `Row / Segment` | State (Default/Hover/Active/Completed) | 4 | — |
| `Row / Chapter` | State (Collapsed/Expanded) | 2 | — |
| `Row / Lens` | State (Default/Hover/Active) | 3 | — |
| `Row / Ledger` | State (Default/Hover/Active) | 3 | — |
| `Step Bar` | Active (1/2/3) | 3 | — |
| `Score Ring` | Result (Pass/Fail) | 2 | — |
| `Nav Rail` | Active (Home/Projects/Study/Segmentation/Exams) | 5 | — |
| `Nav Rail / Expanded (hover)` | single | 1 | — |
| `Header Bar` | Rail (With/Without) | 2 | `Mode` · `Description` · `End` |
| `Panel` | Mode (Docked/Floating/Expanded) | 3 | — |
| `Project Card` | Kind (Project/New) | 2 | — |
| `Body Backdrop` | single | 1 | — |
| `Icon/*` | — | 41 | real Lucide vectors at 20 px, stroke 1.9 |

**Rules that hold across the library.**

- Selection is never signalled by colour alone. Active rows carry a left bar **and** a wash **and** a weight change. Status chips carry an icon **and** a word **and** a hue.
- The active-state left bar is absolutely positioned so Default and Active rows share an identical text origin. (Before this, Active rows shifted content 13 px right.)
- Buttons are pills everywhere. Radius is never mixed within a control class.
- Disabled controls use `text-soft` on `surface-disabled` rather than fading to illegibility.

### 3.1 A note on "built from components"

The exit criterion "every polished frame built from components; zero detached one-offs" cannot hold literally in Figma: an instance cannot take children, so any unique container that holds content must be an auto-layout frame, not an instance.

What is actually true, and is the professional equivalent:

- Every **repeating** element is a component instance — buttons, icon buttons, chips, all four row types, inputs, support cards, the rail, the header, the step bar, the score ring, the backdrop, project cards, and all 41 icons.
- Every **unique container** (a screen's column, a panel shell, a section) is an auto-layout frame whose every fill, stroke, radius, padding and gap is bound to a variable. There are no loose hex values or off-scale spacings in the polished screens.

### 3.2 Plugin API constraints found this pass

Recorded because they will bite the next session:

- `resize()` **after** setting `layoutSizing* = 'FILL'` silently reverts the node to FIXED. Resize first, then set FILL. This produced three separate layout bugs before it was identified.
- `figma.variables.setBoundVariableForPaint()` returns a paint whose literal `color` is `{0,0,0}` with the alias attached. Component nodes resolve the alias; **instance children render the literal black.** Always seed the paint with the variable's resolved RGB before binding.
- Resizing and `visible` toggling on deeply nested instance children are not reliably honoured. Vary such content by variant, by `characters` override, by `fills` override, or by `swapComponent` — all of which do work.
- `layoutPositioning = 'ABSOLUTE'` requires an auto-layout parent. In a plain frame, position by `x`/`y` directly.
- Playfair Display uses `SemiBold`; Inter uses `Semi Bold`. The space matters.

---

## 4. Screens

Shared shell for Home, Study, Research and Exams:

```
y 0–56     Header Bar (Rail=With) · surface-primary @ 92 % · 1 px line-soft bottom
x 0–56     Nav Rail, y 56–900 · 844 tall
x 56–1440  Body Backdrop, y 56–900 · 1384 × 844, clipped
```

Segmentation uses its own 64 px wizard header and no rail; its backdrop spans x 28–1412.

### 4.1 Home — `Home / 01 · Resting`

Content column 1180 wide at x 158 (102 px gutters either side of the body area), starting y 152.

```
Eyebrow  Al-Hidayah                       P/09 Eyebrow · accent-base
   14
Display  Pick up where you left off       P/01 Display · text-strong
   18
Subtitle 620 px measure, two lines        P/04 Subtitle · text-body
   30
Actions  [Continue 1.3 Ghusl →] [Segment a new source]
   64
Section  RECENT WORK ————————————— [All projects →]
   26
Deck     4 × Project Card 277 × 306, gap 24
```

**Primary action:** "Continue 1.3 Ghusl". Everything else on the screen is subordinate.

**Project Card bands** — fixed, so titles and meta align across the row regardless of content length: badge row · 26 · title block · *flexible gap* · progress · 16 · rule · 14 · footer. Only the flexible gap absorbs difference.

**Progress** is discrete ticks, one per segment, `accent-base` for done and `accent-mist` for remaining, with the count in `P/11 Mono Label`.

**States to build:** `02 · Empty` (no projects — the New card alone, centred, with a lead-in line), `03 · Intro` and `04 · Intro-outro` (per §2.6). Not built this pass.

### 4.2 Study — `Study / 01 · Draft`, `Study / 02 · Submitted · Pass`

Columns, left to right: rail 56 · 20 · segments 240 · 20 · workspace 724 · 20 · support 340 · 20. Body inset 20 top and bottom, so every column is 804 tall starting at y 76.

The workspace column is a fixed 804 px stack; the editor takes the slack via FILL. Nothing is allowed to run past the frame — that was the single worst class of defect in the reconstruction.

**Segments column** — panel, full height. Header · outline · pinned progress footer. All chapters expanded; the footer carries the tick track. The pinned footer is what removes the app's ~300 px dead zone.

**Workspace column**
```
34   Previous / Next
16
hug  Source card — header (AR · Source text · A− · A+ · copy · focus) + passage
16
hug  Quick lexicography — label row + term chips (Arabic + · + romanisation)
16
FILL Translation editor — header (EN · toolbar) + draft + action footer
```

The passage container hugs its text. When a passage exceeds the available height, it clips to a fixed height with a bottom fade and a "Show full passage ⌄" disclosure — never a silent cut.

**Support column** — a 340 × 804 clipped viewport containing a card stack, with a bottom fade so overflow reads as "more below". Draft state: Guidance, Lexicography (with Context box), Phrasing (two entries).

**Submitted state** swaps the support stack to Grade (Score Ring + verdict), Key takeaways, Lexicography; fills the editor; and changes the footer to `[Completed] · Discuss · Revise · Next segment →`. Secondary actions drop to Sm so the primary stays inside the panel.

**Discuss** opens `Panel`. Docked sits in the support column; Floating defaults to 420 × 620 at {left 760, top 156}, draggable by the grip and resizable; Expanded is 860 × 660. Transition: `panel`.

**States still to build:** `03 · Submitted · Fail` (Score Ring `Result=Fail`, Fix steps replacing Takeaways), `04 · Discuss floating`, `05 · Empty` (no segment selected).

### 4.3 Segmentation — `01 · Paste`, `02 · Review`

Wizard header 64 px: `[← Back]` · Step Bar · mode badge. All three steps labelled; completed steps carry a check.

**Paste.** 760 px column centred at x 340, starting y 130. Display · subtitle (640 measure) · 40 · intake card 760 × 380 · 36 · split CTA · 14 · hint. The CTA is `Primary / Disabled` until a source is present, and the hint line explains why — a disabled control with no explanation is a dead end.

**Review.** Content column 1296 at x 72, y 100. Title row (display + subtitle + meta chips) · 28 · source card · 24 · two columns (markers 400 / preview FILL) stretched to y 790.

The approve block is a **sticky footer**: 1440 × 88 at y 812, `surface-primary` @ 96 %, 1 px `line-soft` top, with a 96 px backdrop-coloured fade above it starting at y 716. Left: status eyebrow + detail line. Right: `Re-segment` (ghost) then `Approve structure` (primary). This is the fix for the reference structural failure — the button is anchored, and the fade shows content passing beneath it rather than being obscured by it.

**States still to build:** `03 · Loading`, `04 · Transition`, `05 · Success`, plus Review's edit-source and zero-marker states.

### 4.4 Research — `Research / 01 · Segment selected`

```
y 76–156   Project header, 1344 × 80 at x 76 — ink-panel title block (hugs) · stats · Open study mode
y 172–880  three columns, 708 tall: lens rail 232 · 20 · ledger 672 · 20 · inspector 400
```

**Lens rail** — Research lenses panel (7 `Row / Lens`, icon swapped per lens) above a Revision queue panel that FILLs the remainder.

**Ledger** — search area (Search input + four Filter Chips + result count) · divider · rows · bottom fade. Rows are `Row / Ledger`:

```
[1.1]  Heading                                    [Status chip]
       Chapter · topic   tag  tag  tag
       Arabic excerpt, right-aligned
```

This three-line row is the structural fix for R-03/R-04. The English rendering is not in the row at all — it lives in the inspector, which has the width for it.

**Inspector** — header (eyebrow + status · title · path · Details/Ask toggle) · scrolling body (Arabic source on `accent-wash`, Your translation on `surface-soft`, Best translation on `success-wash`) · **pinned action footer** (`Open in study` primary full-width, then `Create patch` / `Clear`). The footer is a sibling of the body inside the panel, not an overlay — that is the fix for R-02.

**States still to build:** `02 · No selection`, `03 · No results`, `04 · Ask Arapal` tab.

### 4.5 Exams — `Exams / 01 · Library`

Content column 1180 at x 158, y 128, 728 tall.

Display · 16 · subtitle (720 measure) · 40 · three stat tiles (FILL, gap 16) · 28 · two columns: Generate panel 384 (ink-panel, FILL height, CTA pinned to the bottom by a FILL gap) and Saved exams panel (FILL).

**Primary action:** "Create exam", inside the dark panel. Row actions are subordinate — `Open exam` is Primary Md but sits inside a list row, and the dark panel outweighs it. If that reads as competition in review, demote row actions to Secondary.

**States still to build:** `02 · Empty` (no saved exams), `03 · Taking an exam`, `04 · Results`.

---

## 5. Accessibility decisions

| Decision | Rationale |
|---|---|
| No text below 11 px | The app's 9.5 px eyebrow is unreadable for a large share of users |
| `text-faint` is decorative/icon only | At 3.2:1 it passes for icons and large text, not for body |
| All meta text on `text-soft` (4.8:1) | Counts, timestamps, captions and hints are content, not decoration |
| Semantic text colours are the `-strong` variants | `success` #16A34A (3.0:1) and `review` #D97706 (2.7:1) fail as text; `success-strong` and `review-strong` clear 4.5:1 |
| Status = icon + word + hue | Never colour alone. Review (amber) and Weak (rose) are now distinguishable to a colour-blind reader by icon and wording as well as hue |
| Selection = bar + wash + weight | Same principle for list rows |
| Focus is designed | 1.5 px `accent-base` border plus a 3 px `focus-ring` spread. Focus order per screen: header → rail → primary column → secondary columns → footer |
| `Icon Button / Lg` is 44 px | Meets the 44 × 44 target minimum |
| Md (36) and Sm (28) icon buttons are desktop-only | They must be given a 44 px hit area in build via padding or a pseudo-element. **This is a build requirement, not optional** |
| Arabic in English prose is bidi-isolated | Wrapped in U+2067 … U+2069. Without it, mixed runs reorder wrongly |
| Arabic block text is right-aligned; Arabic terms inline are not | Verified per screen — it is not always right-aligned |

**Not yet done:** no automated contrast audit has been run against the built frames; ratios quoted are computed from token values. Keyboard behaviour and focus order are specified above but not demonstrated in frames.

---

## 6. Deviations from the running app

Listed in full with rationale in `FIGMA-QA-LOG.md` § *Deviations deliberately taken in the Polished set*. Summary: raised type ramp · `text-faint` reclassified · dev scaffolding removed · header 50 → 56 px · one watermark at 2.8 % · Exams standardised on the rail · all wizard steps labelled · Research ledger restructured to three lines · discrete segment progress · sub-44 px icon buttons retained with a documented hit-area requirement.

---

## 7. What is not done

Stated plainly, because the Phase C exit criteria are not all met:

- **Mobile counterparts (C2b) — not started.** No 390 × 844 frames exist.
- **Prototype wiring (C2c) — not started.** No connections are set.
- **State coverage is partial.** Built: Home resting; Study draft and pass; Segmentation paste and review; Research selected; Exams library. Listed but not built: every empty, loading, error and alternate-result state named in §4.
- **Motion is specified, not playable.** No Smart Animate connections exist; the segmentation keyframes were not re-derived from `segmentationFlow.ts`.
- **Reconstruction Research is frozen incomplete** (QA log R-01). There is no parity baseline for that screen.
- **No live re-capture this session.** The sweep used `artifacts/` captures dated 2026-08-06.
