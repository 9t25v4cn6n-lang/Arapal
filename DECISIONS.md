# Arapal — Decision Record

Only consequential, durable or likely-to-be-revisited decisions belong here.

---

## 2026-08-18 · One type ramp, and the document default is the body role

**Decision.** `src/v2/foundation/tokens/typography.ts` holds ONE ramp of ten
steps — 11, 12, 13, 15, 17, 20, 23, 26, 34, 44 — addressed by semantic role. The
parallel `study*` ramp is gone (its names remain as aliases onto the roles). The
document default in `index.css` is the body role, 15px, not the Vite template's
18px, and the global 0.18px letter-spacing is removed.

**Why.** Measured before deciding: the production surface was rendering 24
distinct sizes and 11 distinct weights across eight screens. Every element
rendering at 18px was INHERITING it, never declaring it — Exams' back pill, tab
buttons, lead paragraph and metadata, and Research's filter labels and filter
chips. Those are exactly the two areas review called "a different visual
language" and "controls imported from another interface". One wrong default,
two screens' worth of symptoms.

**Consequence.** `TYPE_RAMP` in `scripts/qa/standard.mjs` is this ramp and fails
the build when they part. Any size a screen needs that no role provides is a
missing role, not a licence for a literal.

---

## 2026-08-18 · Application identity belongs to the header, not the rail

**Decision.** The Arapal mark and wordmark sit in `Layer1_Header_StartLane` on
every V2 screen and are a control that returns to Project Home. The navigation
rail begins with its first destination; its pin control moved to the rail's
foot. The header's three lanes have one meaning each — start: who this is;
centre: where you are; end: what you can do here — and a screen may add to the
start lane but may not replace it.

**Why.** Identity at the top of a list of destinations reads as the first
destination. Four screens had each decided the header composition for
themselves, which is how Study came to put its segment title where the logo goes
and Segmentation came to have no identity at all.

**Consequence.** Study's segment title moved to the centre lane and its progress
counter to the end lane. Segmentation's two-line "SOURCE INTAKE / SEGMENTATION
NEXT" badge is gone: two lines of tracked uppercase do not fit a 50px bar, and
it was the fourth thing on the screen naming the mode.

---

## 2026-08-18 · Exams is a V2 screen; every production route is now V2

**Decision.** Exams is rebuilt at `#v2/exams` on the shared shell
(`src/v2/screens/Exams/`), with its model lifted verbatim from the legacy screen.
`#exams` resolves to it. The legacy implementation stays reachable at
`#exams-legacy` and is reclassified `surface: 'reference'` in the visual
standard, alongside legacy home, study and segmentation.

**Why.** Exams was the last product screen still rendering in the legacy app: its
own header, its own atmosphere, a 1,167-line stylesheet that never adopted a
token, and the legacy preview's screen-switcher drawn over the top of its own
header. It was reviewed as a different visual language because it was a
different application.

**Consequence.** The plan's §2.1 exception ("preserve the working legacy
capability until the V2 replacement has genuine parity") is discharged — parity
is evidenced by `tests/behaviour/legacy-capabilities.spec.js` passing against
the V2 surface. Its IA was rebuilt around the three jobs the screen exists for,
so the next assessment is the library's promoted first row rather than a card
duplicating a row that duplicates a counter.

---

## 2026-08-18 · Two content measures, not one

**Decision.** `measure.readable` (1080px) for a single column of rows, a form or
a first-run composition; `measure.wide` (1400px) for a workspace that genuinely
uses its panes.

**Why.** The doctrine's single 1400px default is right for Research and Study and
wrong for a list: at the canonical frame a full-width row puts a title at one end
and a control at the other with a metre of nothing between them.

---

## 2026-08-07 · Home is rebuilt on the V2 shell, not legacy chrome

**Decision.** The three Home frames use the V2 shell — 50 px header, 51.43 px collapsed rail, V2 body backdrop — with legacy `#home` content placed inside the V2 body area.

**Why.** V2 is the construction basis and legacy is the behaviour spec. Keeping legacy chrome on Home would have made it the only screen in the set with a different shell.

**Consequence.** Home's three legacy header buttons (Replay intro / Projects → / Segmentation →) no longer appear in the design. The V2 header carries the `projectHome` mode label instead. This supersedes an earlier decision in the originating session to keep Home's own legacy header.

---

## 2026-08-07 · The V2 body backdrop applies to V2 frames only

**Decision.** `V2 / Body Backdrop` is placed on Home 01–03 and Project Research. It is **not** placed on the Study or Segmentation frames.

**Why.** `BodyBackdropItems.jsx` is reached only through `ScreenContractRenderer`, i.e. only on V2 routes. Study and Segmentation are legacy screens and carry their own, different backdrop: four diagonals (two slate, two accent) rather than two, and watermarks at 216 px rather than 210.24 px. Applying the V2 backdrop there would have been an invention.

**Consequence.** "Every V2 frame" in the work order means four frames, not fifteen. Each legacy screen's own backdrop is rebuilt from its own extracted geometry, per screen, because the diagonal geometry is a percentage of a container whose height changes with the screen.

---

## 2026-08-07 · Arabic is set in Amiri at ~117 % of the app's CSS size

**Decision.** Arabic text is set in Amiri, sized so the rendered line count matches the running app, rather than at the app's declared pixel size.

**Why.** The app declares Inter for Arabic runs; Inter has no Arabic coverage, so the browser falls back to an OS naskh face that renders materially wider than Amiri. Matching the CSS number produced 3 lines where the app shows 4, leaving visible dead space inside fixed-height cards. The running application is the higher source of truth than the stylesheet.

**Consequence.** Sizes in the Figma file are 18→21 px (Segmentation body), 15.5→18 px (Research ledger), 22→26 px (Research inspector). Recorded so Phase C can set a deliberate Arabic ramp rather than inheriting this compensation.

---

## 2026-08-07 · Frames are built from extracted DOM geometry, never from source reading

**Decision.** Every frame is built by extracting exact geometry from the running app at 1440 × 900 via a recursive DOM walker, then diffed against a live screenshot.

**Why.** Every frame previously built by reading source and estimating was wrong. This pass found real errors in frames that had been marked complete: Home card internals off by 8–12 px, Home hero off-centre by 34 px, the Loading and Success frames using the wrong 73 px header instead of the app's 83 px one, the Transition card 66 px too wide and 119 px too short, and a Discuss panel whose entire design was invented (chat bubbles and a dimmed backdrop that do not exist in the app).

**Consequence.** Non-default states must be reached by driving the app — freezing React timers via a `setTimeout` monkey-patch is the reliable way to hold a transient state (`compiling`, `segmenting`, Home `intro`) still enough to measure.

---

## 2026-08-07 · The polished type ramp raises the floor to 11 px

**Decision.** The Phase C set uses a single ramp, `P/01`–`P/16`, whose smallest size is 11 px. The app's `eyebrowLabel` (9.5 px) and `bodyText` (11 px) are not carried forward; body moves to 15 px.

**Why.** 9.5 px body text fails any reasonable legibility bar, and the app's palest grey (`text-faint` #94A3B8) is 2.6:1 on white — well under the 4.5:1 required for small text. The two compound: the smallest text in the product was also the palest. This is a WCAG AA failure across every screen, not a preference.

**Consequence.** Each screen carries slightly less content per viewport. `text-faint` is retuned to #8496AE (3.2:1) and **reclassified as decorative and icon use only** — meta text moves to `text-soft` (4.8:1). Any future component that puts text on `text-faint` is a defect.

---

## 2026-08-07 · Semantic colours split into fill and text weights

**Decision.** `success` (#16A34A) and `review` (#D97706) remain for icons and fills. New `success-strong` (#15803D) and `review-strong` (#B45309) are the only values allowed for semantic **text**. `critical` is added as a third semantic so "Needs revision" and "Weak area" no longer share one amber.

**Why.** Both original values fail 4.5:1 as text (3.0:1 and 2.7:1). Separately, the app used one amber for two distinct statuses, making them distinguishable only by reading the words — colour-only signalling for anyone scanning.

**Consequence.** Every status chip now carries an icon, a word and a hue. Review is amber, Weak is rose. Any status shown without an icon is a defect.

---

## 2026-08-07 · Dev scaffolding is removed from the Polished set

**Decision.** The floating nav pill, the Draft/Fail/Pass debug buttons and the `#v2/<route>` header string appear in the Reconstruction set and **not** in the Polished set.

**Why.** Their inclusion was agreed for parity — they are genuinely on screen in the running app. They are development affordances, not product, and Phase C's brief is a public-ready set.

**Consequence.** The header's end lane carries project context instead of the route string. In the Reconstruction frames the nav pill overlapped the Segmentation step bar (QA-log `G-02`); removing it resolves that collision rather than reproducing it.

---

## 2026-08-07 · The Research ledger row is restructured, not restyled

**Decision.** The five-column ledger row (badge · Arabic · English gloss · heading/topic · status) becomes a three-line row: heading + status; chapter · topic + tags; Arabic excerpt. The English rendering moves to the inspector.

**Why.** Every heading in the live app truncates at ~14 characters and the Arabic and English columns touch with no gutter. The cause is not styling — three columns of prose cannot share ~680 px. Widening columns or shrinking type would only move the failure around.

**Consequence.** Roughly six rows are visible instead of eight, and the ledger no longer reads as a table. In exchange nothing truncates and the Arabic gets a full line at 19 px. If density becomes a real requirement, add a compact toggle rather than reinstating the columns.

---

## 2026-08-07 · Overflow is always designed, never silent

**Decision.** Wherever content can exceed its container — the Study passage, the Study support rail, the Research ledger, the Segmentation approve footer — the boundary carries a gradient fade, and where the content is genuinely truncated it also carries an explicit disclosure control.

**Why.** The single worst defect class in the reconstruction was silent clipping: Arabic source cut mid-line, support cards running off the frame, the marker card sheared at the bottom edge. A user cannot distinguish "this is all there is" from "this is broken".

**Consequence.** Every scroll region in the spec has a stated fade. In build these are `mask-image` gradients that must fade to zero at scroll end, not static overlays.

---

## 2026-08-07 · One shell across every screen

**Decision.** A single 56 px `Header Bar` and a single 56 px `Nav Rail` serve Home, Study, Research and Exams. Segmentation keeps its own 64 px wizard header for every step. Exams adopts the rail, dropping the live screen's back-pill-and-tabs model.

**Why.** The reconstruction carried four header heights (50 / 70 / 73 / 83) and two navigation models. Screens that should feel like one product read as five.

**Consequence.** The header grew 50 → 56 px so the two-line centre label has air; every column screen therefore starts at y 76 with an 844 px body. Exams loses a navigation affordance that exists in the live app — recorded as an accepted change in `FIGMA-QA-LOG.md` (`X-04`), not an oversight.

---

## 2026-08-16 · V1 scope decided: real product, V2 surface, mobile last

**Decision.** Answering the three scope questions raised by the product quality audit:

1. **Mobile is in scope, but last.** A 390 px version is required for V1, built after the desktop surface is correct. It does not gate any earlier work.
2. **V1 is a real product, not a demo.** The data layer, real drafts and persistence are in scope. This retires the founding constraint of `design-sandbox` — *"a visual design sandbox only… not production application logic"* (AGENTS.md, 2026-03-14) — which has silently bound every decision since.
3. **The V1 screen set is the V2 product surface** — Project Home, Projects, Project Research, Segmentation (paste → review → success), Study Workspace, Exams. Legacy screens are replaced, not extended.

**Why.** The audit found the product's failures concentrated in the data layer and in legacy, while V2 holds the correct architecture. Scoping V1 to the V2 surface makes the legacy half deletable rather than maintainable, and settling the data question first prevents every screen being built twice — once against a hard-coded constant and again against real data.

**Consequence.**
- `v2/projectHome` is currently an empty "V2 SCAFFOLD" placeholder and must be built; it is the only rail destination with no screen behind it.
- `segmentationPaste` and `segmentationPasteNext` are two implementations of one screen. One must be chosen and the other deleted before either is rebuilt.
- Ordering is fixed: correct the desktop surface → data layer and persistence → mobile.

---

## 2026-08-16 · The visual standard is executable, not written

**Decision.** The product's visual and structural rules live in `scripts/qa/standard.mjs` and are enforced by `npm run qa` on every file save and every commit. They are not restated in `CLAUDE.md`, in a contract document, or in prompts.

**Why.** Eight months of evidence. The V2 Design Contract (2026-03-24) specified *"no overlap, no gaps, end-to-end partitions only"*; `validateContract()` implemented only name and parent-reference checks, so the invariant was never enforced and no one was told. The runtime overlap checker was built but hard-coded to a single screen (`run-v2-screen-qa.mjs:950`) and last ran on 2026-04-03 with `screenCount: 1, findingCount: 0`, while the dashboard reported `productQuality: 74.6, auditTrust: 98`. Across 1,087 recorded user turns the words "padding" appear 378 times, "still" 179 and "again" 94, against "measure" once and "assert" never — the standard was enforced by the user's eyes, which cannot resolve a 10 px clip or a 2.6:1 ratio.

**Consequence.** A rule that is not in `standard.mjs` is not enforced. Adding a rule there is the only way to make a defect class permanent, and is the required response to finding a defect by eye. Prose describing visual quality is documentation, not governance.

---

## 2026-08-17 · R3 uplift pass: import decisions, and record where live already wins

**Decision.** The design-uplift pass compares R3 (and R2 where relevant) against the
**running screen**, state by state, and records "reviewed, nothing to import" as a
valid outcome rather than manufacturing changes to show activity.

Findings so far:

- **Segmentation Review — imported.** R3 docks a commit bar at the bottom carrying a
  live tally and the primary action. Live had `Approve & Continue` at y=1575 on the
  1440×900 frame, 675 px below the fold inside an inner scroll region, with nothing on
  screen indicating it existed. Imported as a decision: the tally reads from the live
  summary, the copy stays this codebase's, and `Re-segment` reuses the destination
  `Edit source` already had. `flowChrome.actionRegionWash` had existed unused since the
  tokens were written — the system had been specified for this and never wired.

- **Research Browse and Segment selected — reviewed, nothing to import.** Live is ahead
  of R3. The ledger shows Arabic, English and metadata in parallel columns where R3
  hides the translation until selection, which is the "useful width" `§2.2` prefers. The
  live inspector already carries `Details`/`Ask` tabs, all three translation blocks,
  `Create patch`, `Clear selection`, `Open in study`, plus related-segment links R3 does
  not have.

**Why.** `§2.2` governs: *preserve good live UI by default; import the decision, not the
pixels.* R3 is a design exploration, not a target — its own Review frame has the lead
paragraph colliding with the meta line beneath it, so it cannot be treated as
authoritative geometry.

**Consequence.**
- `§2.2`'s stated example — that R2's Research Browse beats R3 because it "gives the
  ledger useful width rather than reserving empty space" — **is not visible in the
  supplied exports.** R2 and R3 Browse are effectively identical, and neither reserves an
  empty inspector column. The principle stands and the live screen already embodies it;
  the specific R2-vs-R3 claim should not be repeated as evidence without a frame that
  shows it.
- The Figma connector is no longer a blocker for this gate. Comparison needs the frames,
  which are now committed under `screenshot-reference/Arapal-Figma-Screenshots/`. Only
  reading underlying values (exact tokens, spacing) still needs the live connector.

---

## 2026-08-17 · The Floor gate measures the production surface, not every route

**Decision.** `scripts/qa/standard.mjs` marks each route `surface: 'production'` or
`surface: 'reference'`, and the runner reports the two totals separately. The
release-candidate Floor gate is the production number.

Reference routes are the legacy screens retained **only** as behaviour sources until
their behaviour is ported: `legacy-home`, `legacy-study`, `legacy-segmentation`. Legacy
Exams is **production**, because `§2.1` says to preserve the working capability until a
V2 replacement reaches parity, which makes it the shipping Exams rather than a copy.

**Why.** `§10` asks for the checker to run cleanly "against the current production
surface". Without the distinction, 126 findings against code scheduled for deletion sat
in the same number as findings against shipping screens, and neither could be read.

**Consequence.** Production surface is 0 and is the gate. Reference debt is 126 and is
tracked, not hidden — it is discharged by porting the behaviour and deleting the screens,
not by styling them. The same distinction is mirrored in `eslint.config.js`, where those
two legacy files are exempt from `no-unused-vars` because their unused declarations are
the port's input.

---

## 2026-08-17 · Reading the stylesheet is not evidence about the running product

**Decision.** A claim about what the product *shows* must come from the running
product. Confirming that a CSS class exists, or that a component accepts a prop,
is evidence about the source — not about what a user sees.

**Why.** Asked about the Study rail showing every segment as an empty circle, I
checked `StudyWorkspacePrimitives.jsx`, found `is-submitted` and `is-failed`
markers wired to `record.submissionState`, and reported that the capability was
already there and the screenshot simply had no completed segments. The markers
were real. The data never arrived: the rail's `segmentRecords` was local state
seeded from the reference fixture and keyed `'1.1'`/`'1.3'`, which cannot match a
live segment id, and nothing wrote the store's records into it.

The consequence was not cosmetic. A user could finish every segment of a project
and the product would never acknowledge one of them — no marker, no counter
movement. It stayed hidden because `currentRecord` reads the store directly, so
the segment in front of you always looked right; only the overview lied.

Found by driving the journey end to end rather than reasoning about it, which is
also what turned the Function gate from "31 tests pass" into an actual pass.

**Consequence.**
- `§Evidence Standard` already ranks the running application above source. This
  records the specific way that ordering gets violated: reading source *about*
  rendering and calling it verified.
- Live mode and reference mode must not diverge silently. Where a screen has
  both, anything derived for display needs a live path and a reference path, and
  the live path is the one to check first.

---

## 2026-08-17 · Behaviour parity re-characterised: V2 Study is ahead of legacy

**Decision.** The Behaviour-parity gate is assessed against the **running screens**,
control by control, not against the plan's earlier assumption. On that evidence
the "Study port" the plan calls the real remaining build is largely already done.

Measured at 1440×900 on 2026-08-17:

| | Legacy Study | V2 Study |
|---|---|---|
| Interactive controls | 23 | **39** |
| Discussion companion | present | present, plus a full-height column layout |
| Support cards | expand only | expand **+ float + fullscreen**, per card |
| Segment navigation | none in-screen | real list with per-chapter progress |
| Rich text | none | bold, italic, two alignments, expand |

Each legacy capability characterised in `tests/behaviour/legacy-capabilities.spec.js`
was then checked against V2 directly:

- **Options menu** — V2's popover exposes METHOD (AI / Manual), SEGMENTATION
  STYLE (Sentence / Meaning groups / Topic-led), GRANULARITY (Tighter / Balanced /
  Broader) and PREFERENCES (Quick mode, Show segmentation animation). Full parity.
- **The splitter is real** — verified live: the same five-sentence source yields
  **3 segments at Balanced and 5 at Tighter**.
- **Submission, persistence, discussion, segment navigation, context handoff** —
  all verified in V2 this session.
- **Exam context, attempt-survives-reload, no-resurrect** — these belong to Exams,
  which is retained *production* per `§2.1`, not a port target.

**One genuine gap found and fixed.** V2 persisted only `method`, `quickMode` and
`showSegmentationTransition`; `readSegmentationFlowPreferences` whitelists fields,
so **style and granularity were discarded on read** — and they were also hard-coded
at mount in the paste screen. Choosing "Tighter" and returning silently
re-segmented the next source differently. Both ends fixed, with a regression test
in `segmentation-handoff.spec.js`.

**Consequence.**
- There is **no remaining parity debt**. The three destinations legacy has that V2
  lacks — `Review Queue`, `Completed`, `Profile` — were driven at 1440×900 and all
  three are **dead controls**: clicking each changes neither the hash nor the
  rendered content. They are labels with no destination behind them, so porting
  them would mean reproducing dead buttons. Exams was the only real missing
  destination and it is now wired.
- This is why parity must be measured by driving rather than by comparing control
  inventories. On a name-by-name reading V2 looked three destinations short; on the
  running app it is short of nothing.
- `src/components/figma/` and `MakeSegmentationFlowScreen.jsx` are closer to
  deletable than the plan assumes. Before deleting, the two `test.fixme` legacy
  gaps in `legacy-capabilities.spec.js` should be confirmed as legacy-only defects
  (they are: draft never persisted, draft leaks between segments — both already
  correct in V2 and covered by passing tests).

---

## 2026-08-17 · Two R3 comparisons that are product questions, not uplift

The uplift pass imports decisions where the better one is clear. These two are
not mine to settle, and both are recorded rather than acted on.

### 1. Project Home and Projects both lead with "resume"

Live Project Home opens with *"Pick up where you left off."* and a CONTINUE card.
Live Projects opens with *"One clear next step."* and RESUME STUDY. Two screens
answering the same question, one click apart.

R3 separates them: **Home** is a command centre — next action plus recent work —
and **Projects** is a library for finding: search, filter chips
(All / Ready to continue / Needs setup / Archived), and a card grid.

Ours already has search, per-lesson progress and status dots on Projects, so the
missing capability is triage filters, not browsing. But adding filters to a screen
that opens with a resume panel treats the symptom. The question is whether
Projects should lead with *finding* now that Home leads with *resuming*.

`§2.1` says keep the selected V2 Projects implementation, so changing what that
screen is for is a product decision, not a design import. **Recommendation:**
make Projects the library and let Home keep the resume lead. Not done.

### 2. "Manual start" does not start anything manual

Choosing METHOD → *Manual start* and continuing lands on **Review**, which reads
*"Check AraPal's proposed meaning groups."* The option promises the user will do
the segmenting; the flow gives them an AI proposal to check.

Reading the routing, "manual" currently means *skip quick-publish and review it
yourself* — coherent behaviour, wrong name. `getPostSegmentationRoute` sends
`method === 'manual'` to `segmentationReview`, and the popover offers no
explanatory meta for the method options the way it does for style and granularity.

R3 has a real **Set segment boundaries** screen: a markers panel, a compiled
preview with an *Awaiting markers* empty state, and an approve action disabled
until at least one boundary exists.

Two honest routes, and they cost very different amounts:
- **Relabel** to describe what it does (review the proposal yourself). Minutes.
- **Build** the boundary editor R3 specifies. A feature, not an uplift.

Either is defensible; shipping the current label is not, because it promises
authoring and delivers review. Not changed, because renaming a product option on
my own judgement is the kind of quiet scope decision `§5.4` warns against.
