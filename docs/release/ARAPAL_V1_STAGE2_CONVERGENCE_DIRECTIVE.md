# Claude Ultra Code — Arapal V1 Release-Convergence Directive

## Mandate

Take the current Arapal repository through one coherent Stage 2 release-convergence cycle. Do not perform another broad audit and do not patch the findings below as unrelated tickets. Verify current behaviour, repair the shared causes, simplify the product, and stop only when the acceptance journeys pass on one clean exact build.

Before changing product code, read and obey in canonical order:

1. `PROJECT.md`
2. `DECISIONS.md`
3. `docs/release/ARAPAL_RELEASE_CONTRACT.md`
4. `docs/release/ARAPAL_RELEASE_LEDGER.md`
5. `docs/release/00-RUNBOOK.md`
6. `docs/release/ARAPAL_VISUAL_PRODUCT_STANDARD.md`
7. this directive

Record the actual starting branch, SHA and dirty state. Fresh evidence in this directive began on `5e3ef386cd7909d4b8a866d512d3402555130dd5`; the repository may have advanced since then. Treat old closure claims as hypotheses and preserve unrelated worktree changes.

## Release decision

**PRODUCT REWORK REQUIRED. Do not nominate a release candidate.**

The product has active P0 failures involving visible data loss, false success/preservation claims, stale or cross-project context, incomplete deletion and unreachable core actions at required widths. These take precedence over visual polish. Substantially refactor or replace weak state, navigation and layout structures where that is the smallest maintainable route to the required outcomes.

## Customer outcome

A serious Arabic learner must be able to bring a real source into Arapal, approve stable study units, translate one segment at a time, receive grounded feedback, retain notes and discussion, search the accumulated project memory, assess understanding, and return to the exact missed concept for remediation.

Arapal must feel like one calm, premium and trustworthy study instrument—not several adjacent prototypes. Its advantage over generic AI chat plus notes is the durable chain:

`source → approved segments → learner work → grounded result/notes/discussion → searchable project memory → assessment → exact remediation`

Every production surface must advance or expose that chain. Remove or consolidate anything that does neither.

## Material blockers and required outcomes

### P0-1 — Source and segmentation are not a safe transaction

Verified behaviours include:

- a realistic source disappears on reload before segmentation;
- Review → Edit can return to an empty source;
- unavailable AI segmentation can remain indefinitely on “Preparing” with no useful recovery;
- Back can reveal an empty source and leave an orphan project;
- Review can show zero proposed segments while `Approve & Continue` remains enabled;
- approving zero segments can display false success and open content belonging to another project;
- returning to a stale Review and approving again can regenerate segment identities and make an already-saved Study draft disappear from the active workspace;
- a failed persistence write can mutate live in-memory state even though the proposal is described as preserved.

Required product outcome:

- Source intake becomes durable as the user works, before asynchronous processing.
- Create project, add source and re-segment are explicit project-scoped intents.
- A proposal is non-canonical until one successful explicit approval.
- Approval is atomic, validates a non-empty proposal, is idempotent, and cannot silently replace live work from a stale route.
- Failure, cancellation, Back, reload and retry preserve the source and last valid proposal.
- The UI never claims preserved, saved, approved or successful until that fact is durable.
- Existing learner work is retained or the user is given a truthful, explicit replacement decision before identities change.

Substantial refactoring of the intake/proposal/publish transaction and persistence boundary is expected.

### P0-2 — Project and handoff context are not isolated

Verified behaviours include:

- Research Project A → Open in Study can continue to override an explicit selection of Project B;
- an active Exam belonging to A can open while B is current;
- stale resume/research context can take precedence over a newer remediation handoff;
- failed segmentation can land in another project's Study content.

Required product outcome:

- Every task entry resolves one explicit `{projectId, segmentId, intent}` against current durable data.
- Transient provenance never changes the active project implicitly after the user selects another project.
- Handoffs are consumed or superseded deterministically.
- Invalid or stale context fails to a recoverable destination and never falls back to another project's content.
- All mutations assert ownership by the active project and segment.

A shared context-activation boundary is expected; route-local fixes are insufficient.

### P0-3 — Exams do not have one durable attempt lifecycle

Verified behaviours include:

- leaving through `Assessment library` can reopen an answer as blank even after the UI showed green `Saved` and `1 of 2 answered`;
- leaving before the debounce completes also loses the answer;
- the library can show `Start exam` for an existing attempt and opening it initialises blank answers;
- submitting an incomplete attempt has no clear confirmation or terminal transition;
- an ungraded/provider-failed attempt can be labelled attempted/not scored, yet `Open exam` destroys or fails to restore its saved answers;
- assessment identity can leak across projects.

Required product outcome:

- Production Exams use one project-scoped exam/attempt model and one persistence path.
- Explicit navigation, Save and next, submit, unload and library return flush current answers before transition.
- Re-entry restores exactly the saved exam, question, answers and grading state.
- Starting, resumable, submitted-ungraded, grading-failed and graded are distinct domain states with truthful actions.
- Submit produces an unmistakable success or recoverable failure result; it never silently appears to do nothing.
- Retry grading operates on the immutable recorded answers.
- Open in Study from a missed answer activates the exact project and segment.

Replacing the legacy Exam local-storage path and state machine is authorised and expected.

### P0-4 — Required-width core work is unreachable

Freshly verified at `390×844`:

- Exam `Save and next` can sit below the viewport without a scrollable path;
- Study Focus can display an effectively blank workspace;
- a failed translation editor can collapse to approximately 4px high;
- Discussion input and actions can sit behind the bottom navigation and outside usable scrolling.

At `768×1024`, the failed editor can remain approximately 11px high and Discussion actions can remain below the reachable viewport. Review recovery controls can also render partly offscreen at mobile width.

Required product outcome:

- Each screen has one deliberate scroll owner per responsive composition.
- Primary source, editor, feedback and action regions retain usable space before secondary rails.
- Focus mode always contains the complete core Study task.
- Discussion becomes a reachable mobile/tablet sheet or page, not clipped inline overflow.
- Exam navigation and submission remain reachable with keyboard open, realistic wrapping and long Arabic content.
- All primary actions are visible or reachable at 390, 768, 1280 and 1440.

Substantial reconstruction of Study/Exam responsive composition is authorised. Do not repair normal layout with magic offsets or more competing overflow rules.

### P0-5 — Deletion and persistence claims are false

Implementation/runtime verification found that `Delete project and all its work` can leave proposals, archives and legacy Exam/attempt data behind. The store also assigns new in-memory state before proving that durable storage succeeded.

Required product outcome:

- Project deletion covers every project-owned record in every production persistence path.
- The confirmation accurately states what will be removed and any recoverability policy.
- Failed persistence cannot leave uncommitted state presented as successful or become durable through an unrelated later write.
- Backup/import/delete-all work, if retained, follows the same schema, validation and atomicity rules.

### P1-1 — Study outcomes and retry pedagogy are not trustworthy enough

- Pass/fail must be explicit terminal states, not inferred from colour.
- Production provider failure must be a prominent recoverable state with preserved work, Setup and Retry.
- The actual stored result must drive feedback, best translation, vocabulary, guidance, takeaways and retry blockers.
- A failed result's prior feedback must survive resubmission and reach the retry grader; do not move the pedagogical target silently.
- No positive or completed styling may appear without corresponding evidence.

### P1-2 — Research is not yet the promised project memory

Verified stored vocabulary, AI feedback, translation comparison and a durable manual note were absent from Research counts/search, while a failed segment could say both `Needs revision` and `No evaluation yet`. Mistakes and Weak behave like duplicate lenses, and `Create patch` does nothing.

Required product outcome:

- Research indexes the durable learner record: source, learner translations, results, feedback, vocabulary, notes, saved discussion summary and assessment/remediation links.
- Learning-state labels derive from one domain definition shared with Home, Projects, Study and Exams.
- Ungraded/unavailable is never classified as learner weakness.
- Consolidate duplicate lenses and remove `Create patch`; patch generation is outside V1.
- Remove the dark blue Research banner and normalise Research with the wider application hierarchy unless it carries essential actionable state.

Research may be substantially simplified or rebuilt around the durable project record.

### P1-3 — Home, Projects and global navigation lack clear jobs

With one project, Projects duplicates Home; with multiple projects it changes into a library. Static advanced material, duplicate resume language, weak project identity and false progress labels remain or have existed in the current convergence history.

Required product outcome:

- Home is the returning learner's command centre: one clear continuation, grounded attention and entry to new source.
- Projects is consistently the find/manage library, regardless of project count.
- Projects support editable, distinguishable identity and truthful progress/status.
- Remove static prototype panels and duplicate resume/dashboard ceremony.
- Source is a project action, not an always-on competing destination.
- The Arapal logo is fully visible at every required width and browser zoom; no clipping is acceptable.

### P1-4 — Study support and Discussion contain dead or contradictory interactions

Verified or implementation-confirmed behaviours include:

- Bold, italic and alignment controls do not alter the translation;
- support `Float` can do nothing or duplicate the card inside the rail;
- post-result support cards can say vocabulary/takeaways are unavailable while the main result already shows them;
- hiding Discussion can discard the exchange;
- repeated `Summarise and save` can append multiple summaries;
- dead `Show segmentation animation`, `Manual start` and Research `Create patch` controls remain misleading.

Required product outcome:

- Remove decorative controls unless they perform a valuable V1 action.
- If translation formatting is not a real V1 capability, remove its toolbar. If retained, it must operate accessibly and persist.
- Collapsing the right rail must not lose support access. `Float` opens that card as a true movable/overlay surface; while floating, replace Float with clear Dock and Close controls. It must never duplicate the card.
- Opening Discussion keeps the translation at its existing vertical position and makes room horizontally on desktop; verify intermediate widths as well as standard breakpoints.
- A discussion session preserves its draft/exchange and produces exactly one durable summary when saved.
- One result adapter feeds both primary review and support surfaces so they cannot contradict each other.

Substantial redesign or removal of the support rail is authorised if it produces a calmer, clearer core loop while preserving required semantics.

### P1-5 — Release evidence is green without proving these outcomes

The existing capture/build-hash/four-width plumbing is useful, but required drivers prove route presence more strongly than product state. Unreachable states, dirty trees, console/HTTP failures and stale/fresh evidence handling must fail the relevant gate. A final upload step must not make a failed candidate appear green.

Required product outcome:

- Required evidence asserts state identity, durable data, correct project/segment, terminal status, action reachability and re-entry—not merely that a screen was captured.
- Required journeys fail on unreachable/wrong route, console/page error, unexpected HTTP failure, timeout, dirty candidate or evidence/build mismatch.
- Evidence runs against built `dist` and records exact SHA, asset/build hash and viewport.
- A deliberately broken required journey proves that the harness fails closed.

## Product simplification decisions

These decisions are authorised for V1:

- Consolidate or remove UI whose purpose is duplicated, decorative or prototype-facing.
- Rebuild state boundaries rather than extending legacy local/session-storage adapters.
- Recompose Study, Research and Exams substantially where the present layout prevents truthful task completion.
- Remove dead formatting, patching, animation and static advanced controls instead of simulating capability.
- Keep Home and Projects only with permanently distinct jobs.
- Prefer one clear terminal state and recovery action over banners plus scattered status text.

Do not preserve a weak component or route merely because tests or screenshots currently depend on it. Update the evidence to the intended product contract.

## Invariants

- V1 remains local-first and BYO-key; do not introduce accounts, cloud sync, a backend or collaboration.
- Preserve and migrate existing user data. Never silently reset storage or abandon legacy keys without a tested migration.
- Raw source remains verbatim and durable.
- Segmentation proposals remain non-canonical until explicit approval.
- Canonical segment identity is stable across ordinary navigation and reload.
- Learner drafts, notes, discussion summaries, attempts, answers and results remain project/segment scoped.
- AI absence or failure never fabricates success, completion, weakness, feedback or a score.
- AI credentials remain local and must not leak into logs, URLs, evidence or exported learning data.
- Arabic/RTL source and English/LTR response entry remain correct, readable and accessible.
- Required widths remain 390×844, 768×1024, 1280×800 and 1440×900.
- Preserve the calm, scholarly, premium visual identity; simplification must not become generic dashboard UI.
- Do not expand V1.

## End-to-end acceptance journeys

All journeys must use realistic multi-segment Arabic content and assert stored identity and visible state, not only route arrival.

### AC-01 — Durable source and recoverable segmentation

Create a project, type source, reload before processing, and confirm the exact source remains. Exercise on-device segmentation and AI unavailable/failure/timeout. Back, retry and reload must preserve the source. Zero segments cannot be approved. Approval occurs once, durably, only after review.

### AC-02 — Safe re-segmentation with existing work

Create and approve a source, save a translation draft and note, then revisit stale Review through browser Back and ordinary navigation. The stale page must not republish or hide active work. A deliberate re-segmentation must state its consequences and preserve/restore associated work according to the approved policy.

### AC-03 — Study fail → retry → pass

Submit a translation, receive an explicit grounded FAIL, reload, revise using the same prior feedback, resubmit and receive an explicit PASS. Verify exact feedback, reference translation, vocabulary, guidance, takeaways, progress and next segment. Exercise provider absence, rejection, malformed response and retry without losing the draft.

### AC-04 — Exact return and project isolation

Use two projects with distinguishable names. Move among Home, Projects, Study, Research and Exams using rail navigation, browser Back, reload and handoff actions. Every destination must remain on the explicitly selected project/segment. Stale handoffs must never reactivate another project.

### AC-05 — Durable Research memory

Create a Study result containing feedback, vocabulary and comparison; save one manual note and exactly one discussion summary. Confirm Research counts, filters and search find each item after reload. Confirm failed, ungraded and unstarted segments have distinct truthful classifications. Open a Research item in exact Study context.

### AC-06 — Exam answer and grading lifecycle

Build a two-question assessment. Type Q1 and immediately use Assessment library; repeat after the UI says Saved. Both routes must resume Q1 exactly. Navigate, reload and close/reopen. Submit with a blank question only through explicit confirmation. Exercise unconfigured grading, provider failure, retry and success. Answers remain immutable, Library labels remain truthful, and remediation opens the exact missed segment.

### AC-07 — Deletion and storage failure

Create a project containing source, proposal/archive history, drafts, notes, discussion, results, exam and attempt. Delete it and prove every project-owned record is removed or intentionally retained under the stated recoverability policy. Force storage-write failure during proposal approval and other critical commits; verify live and durable state remain at the last valid transaction with an honest recovery message.

### AC-08 — Responsive Study and Discussion

At all four required widths, use long Arabic source and realistic feedback. Verify source, translation and primary action remain reachable; failure editor has usable height; Focus contains the task; Discussion has a reachable composer/actions; opening it preserves the translation's vertical anchor and moves/recomposes horizontally; collapse, Float, Dock and Close behave exactly as labelled.

### AC-09 — Responsive Exam and Review

At all four widths, complete a multi-question Exam with keyboard and pointer, including Save and next and Submit. Every action must be reachable. Exercise segmentation Review with long labels/source and verify every recovery/approval action is visible or reachable without horizontal clipping.

### AC-10 — Coherent product comprehension

From first run, a learner must be able to explain without guesswork: Home resumes current work; Projects finds/manages projects; Study performs the core learning loop; Research recalls durable learning; Exams assesses and remediates. Verify the logo, headers, banners, empty states, progress language and terminal states are visually coherent and factually true.

## Closure evidence

Closure requires one clean committed candidate and all of the following:

- exact starting and final SHA, branch, build hash and clean worktree;
- build, lint and relevant unit/integration/behaviour suites green;
- deterministic provider-intercepted UI evidence for Study PASS/FAIL, AI error states, Research outputs and Exam grading/remediation;
- reload/re-entry evidence for every persistence claim;
- two-project evidence for every context/isolation claim;
- realistic rendered evidence at 390, 768, 1280 and 1440 for all affected task states;
- keyboard and accessibility checks for primary controls, dialogs/sheets, focus and status announcements;
- console/page/request error capture with zero unexplained failures;
- negative tests proving stale Review, wrong-project handoff, Exam answer loss, incomplete deletion and unreachable responsive actions fail before the fix and remain guarded afterward;
- a reviewed evidence index tied to the exact built `dist`;
- `docs/release/ARAPAL_RELEASE_LEDGER.md` updated with evidence-backed status. Do not mark a finding resolved from code or screenshots alone.

Valid-provider and deployed-host verification may remain explicitly external if credentials/infrastructure are unavailable. Do not fabricate them and do not use their absence to avoid deterministic product-state coverage.

## Explicitly out of scope

- Accounts, authentication, cloud sync, backend storage or multi-device collaboration.
- Social/community features, tutor marketplaces or sharing workflows.
- New learning modes, spaced repetition systems, gamification or analytics expansion.
- Patch generation or a new content-authoring system.
- Rich-text editing unless retaining the existing toolbar is demonstrably simpler and valuable; removal is preferred for V1.
- Provider expansion beyond the approved V1 AI contract.
- Marketing-site, subscription, payment or native-app work.
- Broad design-system replacement unrelated to the affected product compositions.
- Premature performance or abstraction work without release-contract evidence.

## Execution rules

- Work in dependency order: transaction and context spine → Exam lifecycle and Study result truth → Research memory → responsive compositions and product simplification → fail-closed evidence.
- Use coherent checkpoints, but do not stop for routine implementation approval.
- Preserve unrelated worktree changes and integrate centrally owned store, routing, shell and token changes carefully.
- Update the current release ledger as evidence is produced; do not create another audit or TODO file.
- Escalate only a genuinely unresolved product-semantic, irreversible-data or security/privacy decision.
- Stop at a Stage-3-ready implementation. Do not self-certify public release or perform the independent Stage 3 gate.
