# Arapal — Current Decision Record

Only consequential, durable or likely-to-be-revisited decisions belong here.

Pre-V1 Figma reconstruction decisions from 2026-08-07 are preserved in the external
documentation archive supplied with the cleanup package. They are design history, not
current release authority unless explicitly revalidated.

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

## Undeclared token keys fail the build

`spacing[10]` and its siblings were referenced in 43 places on the production
surface without being declared. Each resolved to `undefined`, and a CSS
declaration containing `undefined` is invalid — the browser drops the whole
declaration rather than the one value. `padding: 0 undefined` is therefore not
`padding: 0`; it is no padding rule at all, which is why status pills had text
against their borders and several cards had no internal padding.

Nothing errors, nothing logs, and no geometric check can see it: the element does
not overflow, it is simply not the design. It is unreviewable by eye.

`scripts/qa/lint-tokens.mjs` now fails on any numeric token key not declared in
its token file, and runs in the per-edit QA hook where it needs no browser. The
scales were completed to the steps the design was already using rather than the
usages rewritten to the nearest declared step — the code's intent was correct and
the token file was the thing that was wrong.

## Hovering the navigation rail overlays; only pinning reserves width

Expanding the rail used to take its width from the grid, so moving the pointer
across it reflowed the entire workspace — and in Research it took 248px from the
ledger, which is why a wide viewport still truncated columns.

Width is now reserved only when the user has PINNED the rail, which is the one
moment they have asked to trade canvas for labels. A hover overlays at the
expanded width with the layout underneath unmoved.

This is a single rule rather than a per-workspace judgement about how much width
each screen can spare, and it resolves both the "nav too wide for deep
workspaces" and "Research consumes too much width" findings together.

Consequence worth remembering: an absolutely positioned grid child takes no
auto-placement slot, so both body lanes must carry explicit `grid-column`.
Without it the body field silently slides into the rail's 60px column.

## The product does not state what it has not measured

`data/evaluation.js` returns `score: null` deliberately. The Study support panel
was ignoring that contract and rendering "Your Grade 8.4", an invented review
date, a claimed scholar-facing rubric, and three paragraphs of specific praise
about a translation nothing had read — on the same screen whose banner says
meaning and accuracy are not evaluated.

Any surface that reports on the user's work must render the evaluation
contract, not decorate around it. Where there is no measurement there is no
number; where there is no published reference the absence is stated. This
extends to content that merely appears to be about the user's work: a fixture
under a heading reading "Your Translation" is the same failure.

Residual: the remaining support modules (Guidance, Lexicography, Phrasing, Key
Takeaways) still assert segment-specific fixture content in live mode. Recorded
in the QA Pass 2 ledger; belongs with the support-module architecture work.

---

## 2026-08-24 · V1 core learning loop, AI authority and canonical data

### Decision

The primary Arapal V1 product is the segment-by-segment study loop. Other modules support this loop but do not redefine it.

### 1. Study lifecycle

The canonical Study flow is:

`canonical segment → user translation → Submit → AI grading → retry/fail or pass → completion/review → next segment`

`Submit` is an action, not a durable progress state.

`Draft` is not a general Study status.

For Study:

- `Pass` means the user's translation met the existing AI grading contract.
- `Retry/Fail` means it did not meet that grading contract.
- The exact score threshold, grading criteria, retry allowance and failure semantics come from the existing proven Study grading prompt. They must not be re-invented or hard-coded from secondary documentation.
- `Studied` and `Complete` refer to completion of the required Study flow for a segment.
- Project-level completion is derived from completion of the required segments in that project.

A successful Study result exposes the existing intended review experience:

- user's translation;
- AI best-in-class translation;
- AI feedback;
- relevant vocabulary;
- relevant guidance;
- contextual AI discussion;
- persistent user notes;
- continue to next segment.

Mechanical/form checks may support the workflow but may not masquerade as semantic grading.

### 2. Exams

V1 Exams are genuinely AI-generated and/or AI-graded according to the existing exam prompts/rubrics.

Exams exist to test retention and understanding after study and may test:

- vocabulary;
- translation;
- concepts;
- knowledge contained in the studied source;
- other question types defined by the exam prompt.

The application must display and persist the evaluator's actual result.

It must not manufacture scores, misses, percentages or grading outcomes from answer length, fixture indexes or other placeholder heuristics.

The existing Exam prompt/rubric is the behavioural authority for exact grading semantics.

### 3. AI boundary

AI is a real application service in V1, not simulated UI output.

AI-backed capabilities include, where applicable:

- Study semantic grading;
- best-in-class translation;
- vocabulary/guidance generation;
- Study Discussion;
- Research Companion;
- Exam generation/grading;
- segmentation assistance.

Segmentation remains user-controlled: a proposal may be produced automatically or manually edited, but explicit user approval makes it authoritative.

Existing proven prompts are behavioural source material.

Their pedagogical rules, grading criteria, restrictions and generation rules must be preserved.

Legacy chat-specific repetition, extraction markers and machine-readable scaffolding are NOT part of the application contract and should be replaced with structured application responses.

AI access must be implemented behind a provider-neutral service boundary.

Initial V1 development may use Gemini Flash via configuration, but Arapal must not hard-wire product logic to one provider.

A shared provider API secret must not be embedded in a publicly distributed browser bundle.

### 4. V1 user/data model

V1 is local-first and single-user.

V1 does not require:

- accounts;
- authentication;
- cloud synchronisation;
- multi-user tenancy.

Projects, canonical source, segmentation state, Study records, notes, assessments and results persist locally.

The product must be truthful about local persistence.

Local persistence failure must not silently claim that work was saved.

Export/backup and delete/reset capability are appropriate V1 safeguards.

External AI processing is a separate data boundary from local persistence and must be handled explicitly.

The architecture should not prevent future authenticated/cloud persistence, but cloud accounts are not V1 scope.

### 5. Canonical segmentation

The source lifecycle is:

`raw source → segmentation proposal → optional edit/review → explicit approval → canonical segmentation`

Before approval:

- segmentation is a proposal;
- boundaries and metadata may be edited;
- Study must not treat it as canonical.

Approval creates the canonical segmentation used by Study and downstream functionality.

After approval:

- canonical segmentation is not edited in place underneath existing Study data;
- existing Study records remain attached to stable canonical segment identity;
- changing segmentation requires the controlled Reset/Re-segmentation workflow;
- replacement segmentation must not silently delete or orphan translations, notes, results, summaries or study history;
- previous canonical study data must remain recoverable/archived even if V1 does not expose a sophisticated version-history UI.

The exact migration/re-association of old Study data must never be guessed automatically where segment mappings are ambiguous.

### Consequence

The Stage 1 RED decisions RED-01 through RED-05 are resolved by this decision.

Implementation may now proceed against these semantics.

Where exact grading thresholds, rubrics, retry counts or pedagogical rules are required, the existing source prompts are the authority and must be incorporated as implementation inputs rather than reconstructed from memory.