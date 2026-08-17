# Arapal — Decision Record

Only consequential, durable or likely-to-be-revisited decisions belong here.

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
