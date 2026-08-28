# Arapal — Live Release Ledger

## Purpose

This is the current, evidence-backed distance to public release. It is not a historical defect archive, an implementation completion log, or a composite quality score.

A finding appears here only when it was independently reproduced on the current candidate, verified in the current implementation, or remains an explicit external verification requirement.

---

# Current release decision — 2026-08-28

## PRODUCT REWORK REQUIRED

A fresh customer-led re-entry and transition pass re-opened the release after the
closure history recorded later in this file. Where this section conflicts with an
older `RESOLVED` entry or checkpoint below, this section is current.

- **Fresh evidence baseline:** the run began on
  `5e3ef386cd7909d4b8a866d512d3402555130dd5`; record the actual implementation
  start SHA because the branch has continued to move.
- **Widths exercised:** 390×844, 768×1024 and 1440×900, with realistic Arabic
  source and multi-project/re-entry journeys.
- **Evidence distinction:** rendered findings below were reproduced in the
  running product; deletion, commit atomicity, Discussion durability and retry
  feedback findings were additionally verified in current implementation/runtime.
- **Concurrency caveat:** unrelated data-control changes appeared in the shared
  worktree during the pass. They did not affect the rendered routes below and
  must be preserved by implementation.

Active release blockers:

| ID | Severity | Current evidence-backed outcome required |
|---|---|---|
| S3R-001 | P0 | Make source intake, segmentation proposal and approval one durable, atomic project transaction. Source must survive reload/Edit/failure; zero or stale proposals cannot publish; approval cannot hide existing Study work or open another project's content. |
| S3R-002 | P0 | Replace ambient/stale handoff behaviour with explicit project/segment activation. Research, Study and Exams must never reactivate or mutate a different project after an explicit project selection. |
| S3R-003 | P0 | Unify production Exams under one project-scoped attempt lifecycle. Library return/re-entry must preserve answers even after `Saved`; submitted-ungraded and grading-failed attempts remain recoverable; Submit has explicit success/failure outcomes. |
| S3R-004 | P0 | Rebuild core responsive task composition where necessary. At 390/768, Study Focus, fail/retry editor, Discussion composer/actions, Exam navigation/submission and Review recovery actions must remain usable and reachable. |
| S3R-005 | P0 | Make persistence and deletion truthful. Failed writes cannot mutate committed live state, and deleting “all its work” must cover proposals, archives and every production Exam/attempt path. |
| S3R-006 | P1 | Make Study PASS/FAIL and provider failure explicit, grounded terminal states; preserve prior fail feedback through retry and forbid unsupported success/completion styling. |
| S3R-007 | P1 | Rebuild/simplify Research as the searchable durable project record. It must include stored feedback, vocabulary, comparisons, notes and one saved discussion summary, with one truthful shared learning-state taxonomy. Remove the dark blue banner and dead patching action. |
| S3R-008 | P1 | Keep Home as the resume/attention command centre and Projects as the find/manage library at every project count. Provide distinguishable project identity, truthful progress and an unclipped Arapal logo. |
| S3R-009 | P1 | Remove or complete dead Study controls. Formatting must work or go; Float must create one true floating surface with Dock/Close; Discussion must not move the editor vertically on desktop or lose its session; duplicate/contradictory result cards must share one result model. |
| S3R-010 | P1 | Replace shallow route/capture evidence with fail-closed semantic journeys asserting persistence, identity, terminal state and action reachability on the exact built candidate at all required widths. |

The authoritative implementation handoff, product simplification decisions,
invariants, acceptance journeys and closure evidence are in
`docs/release/ARAPAL_V1_STAGE2_CONVERGENCE_DIRECTIVE.md`.

No S3R P0/P1 may be marked resolved from code changes, unit tests, screenshots or
implementation prose alone. Closure evidence must match the claim as defined in
§H and in the directive.

---

# Evidence header

- **Gate:** Stage 3 independent Product / UX / Visual gate.
- **Verdict date:** 2026-08-26.
- **Candidate branch:** `audit/release-certification`.
- **Candidate commit:** `8dfdf3a3390a33530cc58f9b5949a7095af560b5`.
- **Candidate state:** clean before this ledger-only audit update. No product code was changed by Stage 3.
- **Running product:** Vite development application at `http://localhost:5173`, with fresh origin-scoped runs also performed at `http://127.0.0.1:5173` and `http://0.0.0.0:5173` to avoid inherited local state.
- **Required widths exercised:** desktop 1440×900, tablet 768×1024, mobile 390×844.
- **Authority:** the rendered running product and exact candidate, reconciled only after the fresh rendered and journey passes with the Release Contract, Visual Product Standard, Decisions, current source, and current release evidence.

## Independence protocol

The Stage 3 prompt's ordering was followed.

1. Pass 1 assessed the rendered product at desktop, tablet, and mobile without reading this ledger or source.
2. Pass 2 exercised the first-run, project/source, segmentation, Study, Research, Exams, reload, AI-unconfigured, and AI-configuration journeys without reading this ledger or source.
3. Only after the independent findings were recorded did Pass 3 read the prior ledger, Stage 2 evidence, automated evidence, and relevant source.

Evidence language used below:

- **VERIFIED:** directly reproduced or observed in exact-candidate source/executable evidence.
- **REASONED INFERENCE:** conclusion follows from verified evidence but was not itself rendered end to end.
- **UNKNOWN / EXTERNAL:** requires credentials, deployment, platform access, or a supported environment not present in this audit.

---

# A. Stage 3 product gate

## PRODUCT REWORK REQUIRED

The exact candidate must not proceed to release-candidate assembly.

The first-run surface and much of the visual language are strong, and several previous failures no longer reproduce. The release is nevertheless blocked because the canonical-source transaction is misleading and publishes before review, the primary Study loop cannot render its contracted live AI review, required mobile/tablet compositions fail, Exams contains save/recovery ambiguity, contextual tools still present unrelated fixture knowledge, and the automated release evidence passes while required states are unreachable or widths are absent.

This is not a request for broad redesign. The required work is concentrated in the root-cause packages in §D.

---

# B. Blocking findings

Only P0/P1 findings that prevent progression are active here.

## S3-001 — Canonical source approval and project identity are not trustworthy

- **Severity:** P0.
- **Symptom:** `AI Segment Text` presents deterministic local splitting as AI, publishes the proposal as canonical, and reaches `Segments Ready` before the user reviews or approves it. `New source` does not create a new project: it replaces the current project's canonical segments while retaining the old project title and identity.
- **Evidence — VERIFIED:** on a fresh `127.0.0.1` origin, a pasted 14-word source produced two authoritative Study segments before `Approve & Continue` was used. Success appeared before Review. Review then claimed `24 words`, and a label edit disappeared on reload before approval. On a separate fresh `0.0.0.0` origin, `New source` from the labelled Al-Hidayah sample replaced its content with one historian-text segment while the project still identified itself as the Al-Hidayah sample and the project count remained one. The first-run promise says sample content can be deleted at any time, but no project/sample delete control is exposed.
- **Diagnosis — VERIFIED after Passes 1–2:** segmentation defaults to `method: 'ai'` and `quickMode: true`; the CTA invokes a local deterministic marker generator. The quick path calls `publishSegments` immediately. Success also contains an auto-publish safety path. Intake reuses the current project, and prior work is moved into an internal archive with no in-product restore surface. Review's `24 words` text is hard-coded.
- **Affected states:** first-run sample, Add source, New source, segmentation intake, proposal, Review, Success, Study handoff, re-segmentation of a project with existing work.
- **Why it matters:** this breaks the product's governing sequence—preserved source → proposal → explicit canonical approval—and makes destructive project/source state appear safe and complete.
- **Classification:** systemic transaction, identity, and product-language defect; prior R-015 was documented as complete but is **REGRESSION / NOT ACTUALLY RESOLVED** on the candidate.
- **Required outcome to close:** distinguish new-project creation from re-segmentation; make local versus provider-backed segmentation truthful; keep proposals non-authoritative until an explicit visible approval; make Success impossible before durable approval; persist or warn about dirty Review edits; show exact source/count; retain stable project identity; and expose an understandable restore/delete policy for replaced work and sample data.

## S3-002 — The primary Study review contract cannot render real live grading output

- **Severity:** P0.
- **Symptom:** live Study can save an attempt and request grading, but a genuine provider result cannot produce the contracted review: user translation, best-in-class translation, precise feedback, vocabulary/guidance, and actionable retry evidence. Segment-specific support also shows unrelated fixed lexicography and retry language.
- **Evidence — VERIFIED:** arbitrary fresh segments about a student and a physician both showed the same prayer/city lexicography (`مصر جامع`, `أفنية`, `مصلى`). The sample's water segment also showed those unrelated terms. The rendered submitted/reference surface can show positive Best-in-Class framing while saying no reference is published. No-provider submission itself was honest and did not fabricate a pass.
- **Diagnosis — VERIFIED after Passes 1–2:** `gradeSegment` stores the provider's `feedback`, `bestTranslation`, `vocabulary`, `guidance`, and related result fields. The live screen does not feed that result into the review UI: `StudySubmittedStack` receives `bestTranslation={null}` for live projects, and the support rail renders generic bodies instead of `lastResult`. Quick Lexicography and retry guidance are fixed fixture constants. Therefore a valid-key PASS cannot satisfy the primary loop even if Gemini returns a correct response.
- **Affected states:** Study fail, retry, pass, submitted review, Best-in-Class card, vocabulary, guidance, progress to next segment, and Discussion context after grading.
- **Why it matters:** Study is the core Arapal loop. A product whose central successful-review state discards the evaluator's actual output is functionally incomplete and can visually imply knowledge it did not render.
- **Classification:** systemic view-model/result-schema integration defect; previous R-016/R-026 are **STILL LIVE / REOPENED**.
- **Required outcome to close:** define one rendered adapter over the stored grading result; render real feedback, best translation, vocabulary, guidance, takeaways, and retry blockers exactly; derive every segment-specific support surface from current source/result data; forbid success styling or reference comparison when its evidence is absent; and verify injected PASS and FAIL results through the actual production UI before valid-key external verification.

## S3-003 — Required mobile and tablet compositions lose core product functionality

- **Severity:** P1.
- **Symptom:** required-width screens are not merely compressed; primary work becomes clipped, overlapped, or zero-height.
- **Evidence — VERIFIED:** at 390×844, populated Projects overlays the third summary metric with `STUDY DASHBOARD`; measured summary content requires 198px inside a 150px track. At 390, Research gives the main result/ledger desk `0px` height, leaving only masthead, lenses, and revision queue visible; Search, ledger, inspector, Ask, and Open in Study are inaccessible. At 768, Projects reserves fixed rail/gap widths that leave approximately 126px for its detail panel, reducing the main action/detail area to an unusable sliver. At 390, segmentation intake visibly labels the header as step `2 REVIEW` while the user is on step 1, and the proposal-mode line clips; at 768, source-header metadata clips.
- **Affected states:** populated Projects at 390/768, Research at 390, segmentation source intake at 390/768. The current Study and Exam mobile compositions are materially improved and are not included in this finding.
- **Why it matters:** 390 and 768 are required release widths. Research is a V1 destination and Projects/source intake are entry-critical; hidden or overlapping primary work is a professional release blocker.
- **Classification:** systemic breakpoint/track-priority defect with local manifestations; previous R-020 is **STILL LIVE / PARTIALLY RESOLVED**.
- **Required outcome to close:** establish explicit mobile/tablet task order; use normal-flow content where text height is realistic; collapse or sequence secondary rails before primary work loses width/height; make the active segmentation step unambiguous; and complete realistic-content rendered journeys at 390, 768, 1280, and 1440 with every primary action reachable.

## S3-004 — Exams do not provide a reliable answer, save, and recovery contract

- **Severity:** P1.
- **Symptom:** an assessment question displays Arabic source plus a blank answer box without telling the user whether to translate, explain, or analyse. `Save and next` can navigate before the debounced save completes. A stale persisted attempt can reopen as a blank Attempt shell. An honestly unscored completed attempt offers no direct AI setup or retry-grading path.
- **Evidence — VERIFIED:** on a fresh assessment, reloading about 220ms after `Save and next` while the UI still said `Saving` lost the answer and returned to question 1; waiting until `Saved` preserved it. An inherited orphan attempt repeatedly reopened a blank Attempt state; source inspection confirmed restoration enters Take whenever an attempt has an `examId`, without first proving that the corresponding exam exists. Submitting without AI correctly produced `Attempt saved · not scored`, but Results exposed only Back/Assessment library, and Library grouped the ungraded record under `Completed`.
- **Affected states:** assessment builder preview, Attempt, Save and next, reload/resume, Results, completed Library record, AI-unconfigured recovery.
- **Why it matters:** users cannot know the requested task, and an explicit save action can lose work. Blank recovery and ungraded-completion language undermine confidence in assessment records.
- **Classification:** systemic Exams state-machine and persistence-boundary defect; previous R-017 is **PARTIALLY RESOLVED / STILL LIVE**.
- **Required outcome to close:** render an explicit question instruction/type; synchronously flush the current answer before Save and next, submit, or unload; validate exam/attempt identity before restoring; route stale data to a recoverable Library message; distinguish completed-ungraded from graded; and provide Setup AI plus retry grading without discarding answers.

## S3-005 — Contextual knowledge and AI recovery states are not consistently truthful

- **Severity:** P1.
- **Symptom:** project-dependent knowledge surfaces retain unrelated topic fixtures, and configured-but-failing AI exposes inconsistent status and recovery.
- **Evidence — VERIFIED:** Research on arbitrary project text still showed `City terms`, `0 city-condition links`, and duplicated `Chapter 1 · Chapter 1` framing. Study Quick Lexicography showed the unrelated prayer/city vocabulary described in S3-002. With a stored invalid key, the setup modal continued to badge `AI is configured` after a failed real request; Discussion exposed the raw prototype error `gemini request failed: 400`. The fresh no-provider Discussion state preserved the question and offered Retry, but did not link directly to Setup AI.
- **Diagnosis — VERIFIED after Passes 1–2:** Research still imports quick refinements/revision-queue content from `projectResearchData.js`. Provider exceptions are returned verbatim from the shared AI service; Study normalises them locally, while Discussion prints `res.message`. AI setup treats key presence as configured even after first-use validation fails.
- **Affected states:** Study lexicography/retry, Research browse/refine, AI setup after failed validation, Discussion failure/retry, and equivalent recovery entry points in Exams/Research.
- **Why it matters:** Arapal presents these surfaces as grounded scholarly help. Unrelated terms and raw provider errors make the product feel fixture-backed and developer-facing, especially in the AI-dependent core loop.
- **Classification:** systemic contextual-data adapter and AI operational-state defect; R-026 is **STILL LIVE**, with additional Stage 3 discoveries.
- **Required outcome to close:** remove or derive every contextual refinement from the active project/segment; distinguish key stored, verified, and failed states; normalise provider/network/parse errors centrally; and offer consistent Setup/Retry recovery from every AI-dependent feature without leaking provider implementation strings.

## S3-006 — Current release evidence can pass without covering the states it names

- **Severity:** P1 release-process blocker.
- **Symptom:** green suite summaries cannot certify this candidate or disprove the rendered findings.
- **Evidence — VERIFIED on exact candidate:** `npm run vr` reported 56 passed while also reporting eight states as unreachable: Projects advanced, Research selected, Exam attempt, and Exam results at both configured widths. The test intentionally records unreachable and returns success. Its matrix is only 1440×900 and 1280×800, so it does not exercise required 390 or 768 states. `npm run qa` reported zero production-surface findings but exited 1 because 171 reference findings still feed the gate; the output labels production zero as the Floor gate while the exit logic gates the combined total when no baseline is present. The generated QA matrix also omits 768. Prior release-capture artifacts were generated before the candidate, and a supposedly captured Projects 390 image visibly contains overlap.
- **Affected states:** release authority for every required journey; especially driven/interactive, populated, 390, 768, built-dist, and exact-candidate claims.
- **Why it matters:** the candidate cannot proceed on evidence that silently treats unreachable as pass, measures different widths/states, or has an internally contradictory exit contract.
- **Classification:** systemic release-harness/evidence-integrity defect; this is a **NEW Stage 3 reconciliation finding**.
- **Required outcome to close:** bind every artifact to candidate SHA and built asset hash; fail closed on unreachable, wrong route, page/request errors, and timeouts; add required 390 and 768 populated/journey states; separate production and reference exit contracts coherently; render from built `dist`; and require reviewed visual/product evidence rather than treating capture status or unchanged pixels as quality approval.

---

# C. High-value P2 refinements

These do not independently block progression once the P0/P1 work is closed.

| ID | Refinement | Evidence / required direction |
|---|---|---|
| S3-P2-01 | Replace release-facing `design-sandbox` identity. | The browser document title and package identity still say `design-sandbox`. Use the Arapal product name and deliberate metadata; migrate any persisted key names only with backward-compatible data handling. |
| S3-P2-02 | Finish Research editorial terminology. | The Arabic project title followed by English `knowledge explorer` and repeated chapter labels reads like residual concept copy. Reconcile with the product's scholarly/editorial naming after S3-005. |
| S3-P2-03 | Remove premature preservation language. | The empty intake labels the editor `PRESERVED SOURCE` before anything has been durably preserved. State what is true at each point in the transaction. |
| S3-P2-04 | Address bundle hygiene after production-surface separation. | Exact build passes but warns that the main minified JavaScript chunk is approximately 1,081 kB. Measure user impact before choosing a budget or split. |

Taste-only observations requiring no tracked change: the first-run and most desktop Study/Exam surfaces are visually coherent and launch-quality in isolation; the slightly asymmetrical tablet first-run spacing is not material.

---

# D. Implementation packages

Packages are grouped by root cause and ordered by product dependency. This ledger specifies outcomes, not implementation details.

## IP-S3-01 — Project/source transaction and canonical approval

- **Findings:** S3-001 and the source/project portion of S3-003.
- **Objective:** make creation, preserved source, proposal, approval, replacement, archive, restore, and deletion one explicit project-scoped transaction model.
- **Required outcomes:** separate Create project/Add source/Re-segment actions; use truthful local/provider labels; keep proposal state non-canonical; make explicit approval atomic; persist Review edits or warn before loss; preserve stable identity; surface restore/delete behavior; derive source counts and Success metadata from the committed transaction.
- **Closure evidence:** fresh-origin create and re-segment journeys, including reload before/after approval, with an existing draft/note/result; canonical state remains unchanged until approval; cancelled or failed work remains recoverable; sample deletion is discoverable and verified.

## IP-S3-02 — Study grading-result view model and grounded support

- **Findings:** S3-002 and Study portions of S3-005.
- **Objective:** make the actual stored evaluator result the sole authority for live review and support.
- **Required outcomes:** a typed/validated result adapter drives pass/fail, best translation, feedback, vocabulary, guidance, takeaways, retry, progress, and Discussion context; no fixture fallback on live segments; no success/reference styling without evidence.
- **Closure evidence:** production UI tests inject representative PASS, critical FAIL, malformed, unavailable, and provider-error results and assert every visible field plus reload/next-segment behavior; a fresh arbitrary source contains no unrelated prayer/city strings.

## IP-S3-03 — Required-width composition system

- **Findings:** S3-003.
- **Objective:** make 390 and 768 first-class task compositions rather than compressed desktop grids.
- **Required outcomes:** Projects content uses realistic normal-flow height; tablet detail remains actionable; Research prioritises Search/ledger/selected result and never gives the work surface zero height; segmentation stepper/source metadata recompose without clipping; shared shell/navigation remains intact.
- **Closure evidence:** rendered realistic-content journeys at 390×844, 768×1024, 1280×800, and 1440×900 with measured non-overlap, visible primary controls, scroll ownership, keyboard access, and human product review.

## IP-S3-04 — Exams instruction, persistence, and recovery state machine

- **Findings:** S3-004.
- **Objective:** make an assessment understandable, durably saved at explicit boundaries, and recoverable from stale identity or unavailable grading.
- **Required outcomes:** explicit question task/type; synchronous save boundary for Save and next/submit; validated restoration; recoverable stale-attempt routing; immutable answer/result record; ungraded versus graded taxonomy; Setup AI and retry grading from Results.
- **Closure evidence:** save-then-immediate-reload, multi-question navigation, browser close/re-entry, stale-exam injection, unconfigured submit, configured failure, successful grade, and exact remediation handoff without answer loss.

## IP-S3-05 — Context derivation and AI operational-state contract

- **Findings:** S3-005 and Research portions of S3-003.
- **Objective:** centralise contextual-data provenance and consistent AI lifecycle/recovery semantics.
- **Required outcomes:** project refinements and labels derive only from active project data; AI status distinguishes absent/stored/verified/failed; provider errors are normalised centrally; all AI surfaces preserve input and provide consistent Setup/Retry actions; no raw transport/provider strings reach users.
- **Closure evidence:** arbitrary unrelated projects, invalid key, quota/network/parse failure, retry-after-correction, and cross-feature UI assertions for Study, Discussion, Research, and Exams.

## IP-S3-06 — Fail-closed exact-candidate release evidence

- **Findings:** S3-006.
- **Objective:** make a green release signal mean the named state was reached and reviewed on the exact built candidate at every required width.
- **Required outcomes:** exact SHA/build hash/run identity; built-dist server; required 390/768/1280/1440 coverage; populated and interactive states; unreachable/wrong-route/error/timeout failure; coherent production/reference gate exits; reviewed render index; deploy/smoke/rollback/monitoring evidence.
- **Closure evidence:** one immutable candidate package in which build, lint, unit, behavior, rendered QA, visual regression, required journey capture, security/privacy, and operations gates all complete successfully and fail when a required state is deliberately made unreachable.

Dependency order:

`IP-S3-01 → IP-S3-02 / IP-S3-04 / IP-S3-05`; `IP-S3-03` follows the stable task/state shapes; `IP-S3-06` is rerun only after the product blockers close.

---

# E. Fresh discoveries and reconciliation

## Fresh discoveries recorded before reading the prior ledger

- Success and canonical Study state occurred before segmentation Review/approval on a fresh origin.
- `New source` replaced the sample's canonical contents while retaining sample identity rather than creating a new project.
- Review edits vanished on reload before approval; intake and Review disagreed on word count.
- Live Quick Lexicography was unrelated to every custom segment exercised.
- Projects failed with populated realistic content at 390 and lost its detail workspace at 768.
- Research's primary workspace collapsed to zero height at 390.
- Exams did not tell the user what kind of answer to provide, and `Save and next` could lose the answer during its visible Saving state.
- No-provider grading was honest, but AI failure/configuration recovery was inconsistent across features.
- The first-run sample deletion promise had no matching product control.

## Previous concerns that no longer reproduce

- The public root now enters the V2 first-run product; the legacy home is not the default root experience.
- Source intake starts empty rather than with an unlabelled prefilled passage.
- Fresh Study submission without AI is saved honestly as an attempt, is not marked passed/studied, and offers Setup AI.
- Study drafts survive reload and remain segment-scoped in the exercised happy path.
- Research is scoped to the current project's real segments, and Research → Study opened the exact selected segment; stale context produced a recoverable notice.
- Exams are built from the current project's real segments and no longer fabricate a score when AI is unavailable.
- Exam Attempt and Results are usable at 390 in the exercised normal states.
- Mobile global navigation is present and functional.
- Study is usable at 768 with collapsed secondary rails.
- Discussion preserves an unsent question and exposes honest unavailable/retry behavior. The notes surface is present; full notes ownership/reload coverage was not independently repeated in Stage 3.

## Prior concerns that remain live or were only partially closed

- R-015 source/proposal authority remains live as S3-001 despite its Stage 2 completion claim.
- R-016/R-026 result/support truth remains live as S3-002/S3-005: grading is no longer fabricated, but real result consumption and grounded support are incomplete.
- R-017 Exams durability is partially improved, but save-boundary and stale-identity recovery remain live as S3-004.
- R-020 responsive work is partially improved, but Projects, Research, and source intake still fail required widths as S3-003.
- The security/privacy review correctly describes local storage and BYO-key behavior, but the first-run deletion claim is not implemented in the product.

---

# F. Exact-candidate executable evidence reconciliation

| Evidence | Exact-candidate result | Release interpretation |
|---|---|---|
| Git identity | PASS: clean `8dfdf3a3390a33530cc58f9b5949a7095af560b5` before ledger edit | Exact source candidate exists. This does not make the product ready. |
| Production build | PASS; main minified JS ≈1,080.95 kB, gzip ≈255.67 kB; chunk-size warning | Compilation evidence only; P2 performance follow-up remains. |
| Lint | PASS: 0 errors, 6 warnings | Engineering floor only. |
| Data + AI unit tests | PASS: 89/89 | Contracts/store behavior are covered; live Study result rendering and the rendered transaction are not. |
| Behavior tests | PASS: 36, SKIP: 2 | Useful for persistence/handoff basics. They do not reject publish-before-review, Save-and-next debounce loss, or missing live result consumption. |
| Deterministic rendered QA | **FAIL exit 1**; report says 171 total/reference, 0 production, 0 blank, 0 drift | The production measurements are useful, but the exit contract is internally inconsistent and the matrix omits tablet 768 and the reproduced task/data conditions. |
| Visual regression | Command PASS: 56/56; **8 named states unreachable** | Not a release pass. Unreachable returns success, driven states can be reachability-only, and widths are limited to 1440/1280. |
| Prior release capture corpus | Not exact candidate; of 156 declared executions, 151 are CAPTURED, 3 UNREACHABLE, and 2 lack completed status after timeout | Historical development evidence only. CAPTURED is not visual approval; at least one captured Projects 390 image visibly contains overlap. |
| Security/privacy review | Current architectural description exists | Local-only/BYO-key boundary is documented. In-product deletion/export/restore and deployed-host verification remain incomplete or external. |
| Operations runbook | Generic static deployment procedure exists | No exact deployed artifact identity, production host, rollback drill, monitoring signal, or named triage evidence was available for Stage 3. |

Green automated checks do not overrule the independent product findings because they do not encode the failed semantics and required-width states.

---

# G. External verification still required

These are not classified as product failures merely because the audit environment lacked credentials or production infrastructure.

1. **Valid Gemini key:** complete at least one real Study FAIL/retry and one real PASS, verifying the provider request, parsed result, full rendered review, progress transition, reload, and next segment. Repeat successful/error recovery for Discussion, Research Ask, Exam grading, and exact remediation.
2. **Provider configuration:** confirm the approved Gemini model/endpoint, browser CORS behavior, quota/rate/error handling, key removal, and no raw key in URL/history/logs.
3. **Built deployed artifact:** deploy the exact nominated build, record host and asset hashes, smoke supported routes, verify CSP/security headers and storage isolation, exercise rollback, and prove monitoring/triage visibility.
4. **Compatibility/performance:** define supported browsers/devices and run the built product across that matrix with long Arabic source, large project/history data, representative mobile network/CPU conditions, and agreed budgets.
5. **User-data controls:** verify the final delete/export/archive/restore policy and its user-facing behavior on real stored projects before making deletion/preservation claims.

---

# H. Finding states and closure rules

- **OPEN:** independently reproduced or implementation-verified and requires work.
- **PARTIALLY RESOLVED:** material improvement exists, but acceptance outcome is not met.
- **RESOLVED:** closed with current evidence at the appropriate level.
- **NOT REPRODUCED:** current reproduction attempted and failed, with evidence.
- **UNKNOWN / EXTERNAL:** cannot be resolved without credentials, deployment, platform, or policy authority.
- **TASTE ONLY:** no tracked change.

Closure evidence must match the claim:

- function → complete journey and failure-path evidence;
- persistence → immediate reload/re-entry and unavailable/corrupt-storage evidence;
- visual/responsive → realistic rendered evidence at every affected required width;
- AI → deterministic UI-state evidence plus valid-provider external evidence;
- engineering → exact source/build/test/run identity;
- release → built-dist, fail-closed, exact-candidate deployment/rollback/monitoring package.

No P0/P1 finding may close from code changes, unit tests, an unchanged screenshot, a `CAPTURED` status, or implementation-team prose alone.

---

# I. Stage 3 closure log (rework continuation)

Closure evidence recorded per package. Findings in §B are NOT weakened; this log
records the work and rendered/journey evidence that meets each required outcome.

## S3-001 — RESOLVED (IP-S3-01)

Root-cause fixes:
- **Non-authoritative until approval:** the quick-mode auto-publish and the
  Success auto-publish "safety path" are removed. Every method routes to Review;
  `getPostSegmentationRoute()` always returns `segmentationReview`. Publication is
  the explicit `Approve & Continue` action and nowhere else.
- **Truthful labels:** the default method is on-device deterministic splitting,
  labelled **"Segment on device" (no AI)**. A separate **"AI segmentation"**
  method genuinely calls the provider via the derived segmentation contract
  (`contracts/segmentation.js`, from the source prompt) and is honestly
  unavailable without a key. Deterministic local splitting is never called AI.
- **Stable identity:** an explicit Create-vs-Re-segment intent. "Add source" /
  "New source" always create a NEW project; re-segmentation keeps the current
  project's identity and stays non-destructive (archive).
- **Truthful counts:** the Review source tray renders the real source word count
  and text (the hard-coded "24 words" and the caravan fixture fallback are gone).
- **Edit persistence:** Review edits are written back to the non-authoritative
  proposal (`updateProposal`), so a label edit survives reload before approval.
- **Restore/delete:** Projects exposes a **Delete project** control (with
  confirm) for any project including the sample, and a **Restore previous work**
  control backed by a reversible `restoreArchive`.

Rendered / journey evidence (dev build, fresh origin):
- Fresh create: paste 15-word source → "Segment on device" → store holds a
  proposal (1 chunk) and **0 canonical segments**; routed to Review (not Success).
- Real count "15 words" shown in Review (not "24").
- Reload before approval: still on Review, **0 canonical segments**, proposal
  persists.
- `Approve & Continue`: **1 canonical segment created**, proposal cleared, lands
  on Success.
- "New source" from an existing project: project count **1 → 2**, new project id
  distinct, first project's canonical segment intact (identity not replaced).
- Sample deletion: confirm dialog → project count **1 → 0**.

Tests: `tests/behaviour/segmentation-handoff.spec.js` rewritten to the
proposal→approval semantics (10/10). `tests/data/store.test.mjs` adds
updateProposal-persist and reversible restoreArchive. `tests/ai/segmentation.test.mjs`
adds the segmentation contract (anchor validation, honest-unavailable). Gate:
build PASS, lint 0, unit 98/98, behaviour 36/2, QA production 0.

Residual (documented, not blocking S3-001): a valid-key Gemini segmentation PASS
is the external verification item; the application/config boundary and the
on-device path are complete and verified.

## S3-002 — RESOLVED (IP-S3-02)

Root-cause fixes:
- **One validated result adapter** (`studyResultView.adaptStudyResult`) is the
  SOLE authority for the live review. It exposes only fields a real AI grade
  carries (a surface-check, sample, or null result yields an empty view — honest
  absence), and never a best translation before a genuine pass.
- **The review renders the real evaluator output:** `StudySubmittedStack` now
  renders Feedback, "What the grade checked" (criterion anchors), Vocabulary,
  Guidance, and Takeaways from the stored result; best-in-class comes from the
  result (live) instead of `bestTranslation={null}`.
- **No live fixture fallback:** Quick Lexicography draws grounded vocabulary from
  the grade on live projects (honest "appears after grading" when absent) instead
  of the fixed prayer/city term list; the support rail stays honest-empty on live.
- **Fail path:** a critical FAIL surfaces the real blocking issues ("fix these,
  then submit again") and shows no best-in-class card.
- Result schema extended with `anchors`/`categoryScores`/`blockingIssues`;
  `gradeSegment` persists them.

Evidence — production UI with injected results (`tests/behaviour/study-review.spec.js`, 4/4):
- Injected PASS over an ARBITRARY physician source renders best-in-class,
  feedback, vocabulary, guidance, takeaways and criterion evidence, and contains
  **no** `مصر جامع`/Friday-prayer/comprehensive-city fixture strings; verified in
  the rendered desktop UI (screenshot).
- Injected PASS survives reload.
- Injected critical FAIL shows the blocking issue and **no** best-in-class card.
- Malformed grade degrades to honest absence ("No reference translation…"), no
  crash, no fixture.
Adapter unit tests (`tests/data/studyResultView.test.mjs`, 6/6) cover
PASS/FAIL/surface-check/sample/malformed/null. Gate: build PASS, lint 0, unit
104/104, behaviour 40/2, QA production 0.

External item: a valid-key Gemini PASS end-to-end; the render path and every
result state are proven with injected results.

## S3-005 — RESOLVED (IP-S3-05)

Root-cause fixes:
- **Context provenance:** the Research revision queue and quick refinements now
  derive entirely from the active project's segments. The fixture "City terms"
  chip and the "N city-condition links" entry (which read "0" on any real
  project) are removed; the queue is Weak segments / Vocabulary notes /
  Translation comparison from real counts. (Study Quick Lexicography was grounded
  in IP-S3-02.)
- **Central AI operational state** (`services/ai/health.js`): one `getAiState()`
  distinguishing **absent / unverified / verified / failed**. Key presence is
  never badged as verified — a saved key is "unverified" until a real call
  succeeds; a failed real call flips it to "failed". `resolveGenerate` records
  success/failure centrally.
- **Central error normalisation** (`normalizeAiError`): every provider call is
  wrapped so services receive only a calm message. No surface can render a raw
  transport string such as `gemini request failed: 400`.
- **Consistent recovery:** the AiConfigDialog badge reflects the four states;
  the Study grade notice, the Study Discussion companion, and the Research Ask
  companion all preserve the user's input and offer Setup AI (no-provider) and/or
  Retry.

Evidence (unit + rendered):
- `tests/ai/health.test.mjs` (4/4): state transitions; 400/401/429/network/parse
  all normalise to non-raw messages.
- `tests/behaviour/ai-state.spec.js` (2/2): an arbitrary physician project shows
  no "City terms"/"city-condition"; a configured-but-invalid key surfaces a
  normalised message (asserted NOT to contain `gemini request failed`/`400`),
  preserves the typed question, and records AI state `failed`.
- In-browser (screenshot): Discussion with an invalid key shows "The AI provider
  rejected the request — check your API key in AI setup.", the question is
  retained, RETRY is offered, and Quick Lexicography shows honest absence.
Gate: build PASS, lint 0, unit 108/108, behaviour 42/2, QA production 0.

Exams AI-recovery entry points are completed with IP-S3-04.

## S3-004 — RESOLVED (IP-S3-04)

Root-cause fixes:
- **Explicit task:** every Attempt question states its task ("Translate the
  passage below into clear English.") above the Arabic source, so the user knows
  what to produce — not a blank box under a passage.
- **Synchronous save boundary:** "Save and next" (and Submit, and tab
  close/reload) flush the current answer to storage SYNCHRONOUSLY via refs before
  navigating — no reliance on the 600ms debounce. `answersRef`/`indexRef` mirror
  state so a value typed a moment before the boundary is included.
- **Validated restore:** a restored attempt is honoured only if its exam still
  exists; a stale/orphan attempt is cleared and routed to a recoverable Library
  message, never a blank Attempt shell.
- **Graded/ungraded taxonomy:** exam status is `graded` vs `ungraded`; the
  library files unscored attempts under "Attempted · not scored", never among
  graded results.
- **Recovery:** the ungraded Results view offers Setup AI (no provider) or Retry
  grading (provider failed) — `handleRetryGrading` re-grades the RECORDED answers
  without loss.

Evidence — `tests/behaviour/exam-recovery.spec.js` (4/4):
- The question states its task + source.
- **Save and next → IMMEDIATE reload keeps the answer** (persisted attempt shows
  the Q1 answer and index advanced) — the exact S3-004 data-loss reproduction,
  now fixed.
- A stale attempt (its exam gone) shows the library + "couldn't be resumed"
  message and the stale attempt is cleared (no blank shell).
- Submitting without AI is ungraded (no fabricated score) and offers Setup AI /
  Retry grading.
Gate: build PASS, lint 0, unit 108/108, behaviour 46/2, QA production 0.

## S3-003 — RESOLVED (IP-S3-03)

Root causes + fixes (verified with realistic populated content at 390/768/1280/1440):
- **Projects 390 overlap:** the mobile grid's default `align-content: stretch`
  split `auto auto` into EQUAL tracks, so a populated 3-metric summary (198px)
  overflowed its 150px track and the workspace overlapped it. Fixed by making the
  root + orientation flex columns with `flexShrink:0` regions — content-height
  stacking, root scrolls. Verified: workspace heading now below the summary (490
  > 454), no overlap.
- **Projects 768 detail sliver:** the desktop 3-column workspace (380px rail) was
  used at 768, leaving the DETAIL pane 126px. Added a real TABLET breakpoint
  (561–1024) to the contract renderer; Projects stacks the rail above a
  full-width detail at tablet. Verified: detail 126px → 644px.
- **Research 390 zero-height work surface:** the desk (`height:100%`) sat in a
  1fr track starved to ~0 by the tall stacked lens rail. Fixed: Research root is
  a scrolling flex column at mobile, the desk region carries a real `min-height`,
  the deskBody is one column. Verified: desk 2px → 896px; search + ledger rows
  reachable; masthead study-mode no longer overlaps the lenses.
- **Segmentation 390 wrong active step:** the wrapped 3-step rail left "2 REVIEW"
  as the only visible step on step 1. The StepBar now collapses to an unambiguous
  "Step 1 of 3 · Source" at mobile.
- **Segmentation 390/768 clipped metadata:** the SplitCTA `max-content` cluster
  overran the frame (and its inner 340px min overlapped the options tail), the
  CTA meta row (inline-flex) clipped its third label, and the editor seal spilled.
  Fixed: SplitCTA fills width with a fractional lead + 0 inner min at mobile, the
  meta row is full-width flex-wrap, the decorative seal hides at mobile, and the
  CTA label shortens. Verified: intake 390 overflow 0.

Desktop unchanged (1440 workspace/summary intact, overflow 0). The 5 desktop VR
states that changed (empty Review from S3-001, derived research queue from
S3-005, intake meta row) were inspected and re-baselined. Gate: build PASS, lint
0, unit 108/108, behaviour 46/2, QA production 0, VR 56/56.

## S3-006 — RESOLVED (IP-S3-06)

The release evidence is now fail-closed and bound to the exact built candidate. A
green signal means the named journey was reached, stayed on its own screen, raised
no page/request error, and was captured — on the built dist, at every required
width. Verified by running the gate green AND proving it goes red when a required
state is made unreachable.

Root causes + fixes:
- **Unreachable recorded as pass.** `tests/release-audit/release-evidence.spec.js`
  wrote `status: UNREACHABLE` and `return`ed, and driven states `return`ed before
  any screenshot — so a missing required state passed. Rewritten into two tiers:
  a REQUIRED tier that asserts `reached`, on-own-screen, zero page errors and zero
  (non-aborted) failed requests — any of which fails the run and a per-test
  timeout fails it too — and a RECORDED reference tier that still fails if a
  reached state lands on the wrong screen.
- **Wrong widths / states.** The old matrix was 1440/1280 only. Required coverage
  is now 390×844, 768×1024, 1280×800, 1440×900 across seven POPULATED + INTERACTIVE
  journeys (projects library, study typed, study submitted, research, segmentation
  paste-filled, exams library, exams builder), seeded from the app's own sample
  project — 28 fail-closed captures.
- **Not the built candidate.** Evidence rendered against `npm run dev`. New
  orchestrator `scripts/release-audit/run.mjs` builds `dist`, computes a build hash
  (sha256 rollup over every built file), serves the built dist via `vite preview`,
  and the spec asserts the served origin carries the dist's hashed entry asset
  (a dev server ships `/src/main.jsx`, not `/assets/index-*.js`) — so evidence
  cannot be captured against anything but the build.
- **No candidate binding.** `candidate.json` now records the SHA, short SHA,
  branch, dirty flag, build hash, entry asset, per-asset sha256, and mode; the
  reviewed index is stamped with all of it.
- **Incoherent QA exit.** `scripts/qa/run.mjs` gated the exit on the COMBINED
  blocking total when no baseline was present, so 171 reference findings failed the
  run while the console printed "production surface: 0 ← Floor gate". The no-baseline
  gate is now the PRODUCTION Floor (`productionBlockingForGate`); reference is
  reported but does not fail the release Floor on its own. Verified: production 0 →
  exit 0, reference 171 reported separately.
- **CI swallowed everything.** The workflow ran every gate under `set +e; return 0`,
  so the job passed no matter what failed. Rewritten so build, lint, audit suite,
  data, QA, VR, behaviour, and the fail-closed evidence each fail the job; a
  dedicated "Prove fail-closed" step requires the deliberately-broken run to go red.

Fail-closed PROVEN (not asserted): `npm run audit:evidence:prove` routes one
required journey (`req-projects-populated`) to `#v2/__release_audit_unreachable__`.
Result: that journey went red at all four widths (4 failed), the other 24 stayed
green, the capture exited non-zero, and the orchestrator reported "fail-closed
PROVEN". The clean run is 28/28 green, exit 0.

Reviewed renders (built dist): Study review @1440 shows the honest no-AI banner
("Set up AI") and honest-empty support panels with no fixture bleed; Research @390
is a full-width populated lens column (real derived counts All 4 / Segments 4) with
mobile nav and no masthead/lens overlap; Exams builder @768 previews the sample
project's real four questions. Bound artifact: `artifacts/release-audit/evidence/`
(candidate.json + index.html + per-state screen.png/runtime.json/status.json).

Verification-run candidate (pre-commit tree): buildHash d414b230…, entry
`/assets/index-DEZEGGrw.js`. The definitive binding is regenerated by
`npm run audit:evidence` at the committed SHA (the build hash rebinds to that tree).

Gate for this package: build PASS, lint 0, unit PASS, behaviour 46 passed, QA
production 0 (exit 0), VR 56/56, required evidence 28/28 green + prove RED caught.

**External verification still required (not fabricated here):** deploy of the exact
build hash to the production host + recorded URL; post-deploy smoke of every
required journey against the deployed origin; a documented rollback drill between
build hashes; runtime monitoring/error reporting on the deployed origin; and a
live-provider (Gemini) valid-key Study PASS. These need a real host/key and are
recorded as open, not asserted.

---

# J. Stage 2 convergence (directive, baseline 3cf737b)

Executing `docs/release/ARAPAL_V1_STAGE2_CONVERGENCE_DIRECTIVE.md`: one coherent
product-consolidation cycle toward the customer chain (source → approved segments
→ translation → validated result/notes/discussion → project memory → assessment →
remediation). Old closure claims treated as hypotheses; verified against the
running product. Not another audit. Stops at a Stage-3-ready state (no self-Stage-3).

## CV-00 — Verified current reality (running product, 3cf737b)

Confirmed shared root causes the directive names, by driving the product:
- **Route structure as architecture:** the permanent global rail carried Source +
  Segmentation (SG) as a destination beside Study/Research/Exams; the segmentation
  flow ran paste → **timer-only transition** → loading → review → **ceremonial
  Success** → study. Both are ceremony/IA, not product state.
- **Empty support before content:** Study shows three support modules (Guidance,
  Lexicography, Phrasing) reading "Not prepared for this segment yet" plus an empty
  Quick Lexicography before any grounded content exists (Programme 4 target).
- **Identity/copy:** browser title still `design-sandbox`; intake labels the empty
  editor `PRESERVED SOURCE` before anything is preserved (P2/P3 truthful-language
  targets).
- The store already owns projects/segments/drafts/notes/records/results/proposals/
  archives/exams/attempts with `persistenceHealthy()` and legacy-migration hooks —
  the spine is largely present (Programme 1 is completion, not rebuild).

## Package A — IA fold: Source→Review→Study, SG out of global nav (P2 + P3)

Root-cause consolidation, verified end-to-end in-browser on the built flow:
- **SG removed from the permanent global rail** (`segmentationPasteNext.rail.visible
  = false`); it stays routable and is launched as an action (Add source / New
  project / Re-segment). Rail is now PH · PR · RX · SW · EX.
- **Timer-only transition removed** (`segmentationTransition` route + screen
  deleted; `getLoadingAdvanceRoute` returns Review; `showSegmentationTransition`
  preference removed). Processing advances straight to Review.
- **Ceremonial Success removed** (`segmentationSuccess` route + screen deleted).
  Review's Approve now publishes and **enters Study directly** with a concise
  one-shot provenance banner ("N segments saved on this device"), opening the exact
  first canonical segment.
- **Persistence honesty on publish (Programme 1):** Approve checks
  `persistenceHealthy()` after `publishSegments`; on a failed local write it stays
  in Review with a recoverable message instead of navigating to a false success.
- Migrated evidence/tests to the new flow (auditRegistry, qa route lists, VR states
  seg-processing/seg-success removed, segmentation-handoff behaviour rewritten to
  assert direct-to-Study + provenance + first-segment activation).

Verified in-browser (dev build): pasted a fresh multi-sentence Arabic source →
on-device proposal (2 segments, RTL correct) → Review with no transition → Approve
→ **Study on segment 1.1 with the provenance banner and the exact pasted source, no
fixture contamination**. Build PASS.

Remaining in P2/P3 (open): Home vs Projects role split and removals; editable
project name; workflow-ID/revision binding of async responses; bounded AI
timeout/cancellation in the shared boundary; truthful intake preservation language;
stale/missing-target explicit recovery; remove Create-patch.

## Stage 2 backlog — user-reported from live use (mid-run)

Recorded to address within the programmes, not dropped:
1. **Arapal logo (top-left) is clipped** — the wordmark/glyph is cut at the top of
   the shell header. Fresh polish finding (shell chrome). [P7/shell]
2. **Projects vs Project Home feel duplicative** — confirm distinct workflows or
   keep one. Directly Programme 2 (Home owns returning + one Resume; Projects owns
   find/manage). [CV-P2]
3. **Dark-blue masthead banner in Research does nothing** — remove and normalise to
   the wider app styling. Directly Programme 5 (remove decorative strips / the
   "knowledge explorer" flourish). [CV-P5]
4. **Study RHS support rail: the float button does nothing once collapsed** — it
   should float the card and swap to a dock/close control. Reconcile with Programme
   4 ("remove independent float/fullscreen machinery for multiple EMPTY support
   cards"): floating should either work for populated support or be removed, never
   a dead control. [CV-P4]
5. **Discussion open shifts the translation box UP** instead of keeping its vertical
   position and moving left. Programme 4/7 (Discussion as one coherent side
   experience without reflowing the work lane). [CV-P4/CV-P7]
6. **Submit appears to do nothing — no fail/success screen** — with no AI provider,
   Submit saves an honest attempt but gives no visible outcome, i.e. exactly the
   "surprise dead end" Programme 4 warns against. AI readiness must be visible
   BEFORE submit, and Submit's outcome (PASS/FAIL, or honest "saved, needs AI to
   grade" with Setup AI) must be unmistakable. [CV-P4 — high priority]

## Package B — Study: no empty modules; AI readiness before submit (P4, partial)

Directive Programme 4 + user-reported item 6 (Submit "does nothing" — the surprise
dead end). Verified in-browser on a live published project with no AI configured:
- **No empty support modules before grounded content.** On a live-but-ungraded
  segment the right support rail (Guidance/Lexicography/Phrasing, previously three
  "Not prepared for this segment" cards) and the empty Quick Lexicography strip
  ("Vocabulary appears here after the segment is graded") no longer render. The
  support column collapses to 0 and the work lane (source → translation → Submit)
  takes the full width. `StudyQuickLexicography` returns null when it has no terms;
  the Study screen hides the support rail + column when there is no grounded
  content (guidance/vocabulary/takeaways). The reference surface keeps its demo
  support; support returns the moment a grade produces content.
- **AI readiness is visible BEFORE submit.** On a live segment with no configured
  provider, a calm persistent line now reads "You can draft and save now — semantic
  grading needs an AI provider. Set up AI to grade this translation." — read on each
  render so returning from AI setup reflects immediately. The learner no longer
  reaches grading as a surprise; drafting/saving is never blocked.

Verified: Study on a live segment shows source → translation → Submit at full width,
no empty modules, with the readiness line and Set up AI. Build PASS.

Remaining P4 (open): populated PASS result story with Continue dominant; FAIL
repair-mode polish; the collapsed-support float control (backlog item 4) and the
Discussion-open work-lane shift (backlog item 5).

## Package C — Research masthead normalised (P5, partial + user item 3)

Directive Programme 5 + user-reported item 3 (dark-blue banner doing nothing).
Verified in-browser at desktop and 768:
- Removed the dark-navy title-group banner that appeared at narrow breakpoints
  (two media-query rules replaced a `linear-gradient(rgba(15,23,42)…)` pill with
  the app's own light masthead surface; title text returns to `textStrong`).
- Removed the "knowledge explorer" flourish from the title — the masthead now
  leads with the plain project title.
- Removed the decorative metric strip (segments / vocab notes / review points) —
  counts that do not change the next decision. The masthead now carries project
  context + the one action (Study mode); lenses, search and the segment ledger
  lead the surface.

Gate: build PASS, lint 0 on the file, rendered at desktop + tablet.

Remaining P5 (open): grounded filter set (drop duplicate Mistakes/Weak lenses to
All / Needs revision / Notes / Vocabulary / Completed); reduce the revision-queue
ceremony; dossier from canonical data with empty sections hidden.

## Package D — Dev grade override (test the PASS/FAIL result screens)

User request: input a temporary, isolated, easily-removable override so the Study
result screens can be exercised without a live AI provider. Implemented at the AI
boundary so the REAL pipeline runs (parse → compute-outcome → store → result
adapter); only the provider network call is skipped.
- `src/v2/services/ai/devGradeOverride.js`: `?v2GradeOverride=pass|fail` (or
  `localStorage['arapal.dev.gradeOverride']`) returns a canned response shaped
  exactly like the study-grading contract. A single guarded branch at the top of
  `gradeStudyAttempt` consumes it before the provider check.
- Safety: `import.meta.env?.DEV`-gated. Verified the whole feature (including the
  `v2GradeOverride` string and canned payloads) is **tree-shaken out of the
  production dist** — it can never fabricate a grade in a released build (the
  "no production fixture fallback" invariant holds). AI unit tests pass.

Verified in-browser (dev): PASS → Best-in-class translation + Your translation +
grounded Surface-check support + Continue/Next dominant + progress advanced +
persists across reload. FAIL → "This attempt didn't pass" with the real blockers,
translation preserved in place, TRY AGAIN + Submit again dominant, amber (not
passed) status, no best translation revealed. Both match the Programme 4 PASS/FAIL
contract — and confirm Package B's support rail correctly RETURNS once a grade
produces grounded content.

Removal: delete the module + the guarded branch. Note for CV-EV: release evidence
still needs production-transport interception (Playwright route mocking of the
provider endpoint) for built-dist PASS/FAIL, since this dev override is inert there.

## Stage 2 convergence — green checkpoint (HEAD 0f280d7)

Six commits from baseline 3cf737b, each root-caused, verified in the running
product, and committed. Cumulative gate at HEAD is fully green:
- build PASS · lint 0 errors · unit PASS · behaviour 46/46 · QA production 0
  (exit 0) · VR 52/52.

Commits:
- ef1b130 — fold Source→Review→Study; Segmentation out of the global rail (P2/P3)
- bd09905 — Study: no empty support modules; AI readiness before submit (P4)
- ea4cc9e — Research masthead normalised (P5 + user item 3)
- 2475740 — dev-only grade override to exercise PASS/FAIL screens (user item 6)
- 9c1d9b9 — lint fix + Study support-rail behaviour parity migrated
- 0f280d7 — re-baseline research-browse goldens; drop removed seg-success goldens

Behaviour migration of record: the "support rail carries guidance/lexicography/
phrasing" parity test now targets the reference surface (populated demo support),
and a new test asserts a LIVE ungraded segment shows NO empty support modules —
encoding the Programme 4 contract rather than the superseded pre-submission set.

Remaining Stage 2 scope toward the AC-01…AC-08 exit condition: CV-P1 (spine
completion — source-draft/workflow/intent into the store off sessionStorage,
per-project active segment, persistence-success on every mutation, one learning-
state selector, legacy-key migration), CV-P2 (Home vs Projects role split +
user item 2), CV-P6 (Exams on canonical store), CV-P7 (task-first responsive +
user items 4/5), CV-P8 (trust contract), deeper CV-P4/CV-P5 finishing, and CV-EV
(evidence overhaul with production-transport interception for built-dist PASS/FAIL,
migration/transition-table/isolation tests, and AC-01…08 built-product evidence).
Not yet Stage-3-ready; no Stage 3 performed.

## Package E — Home vs Projects distinct roles (P2 + user item 2)

Directive Programme 2 + user-reported duplication. The returning Project Home
rendered a "Your projects" list of every project — the same library Projects owns,
which is why the two screens read as duplicates.
- Home's returning state now owns RETURNING only: one Continue hero for the active
  project (Resume + progress), genuinely actionable attention, New source, and a
  "Browse all projects (N)" link to the Projects route. The full project list is
  removed — Home no longer reproduces the library.
- Attention is grounded (Programme 2 / "labels are not learning truth"): it counts
  only segments in the ACTIVE project whose last validated result was a fail
  (submissionState 'failed'), links to the exact failed segment, and is hidden when
  zero — never an invented or empty card.
- Removed the now-dead per-project progress map and the list-row helpers.

Verified in-browser (seeded sample): returning Home shows "Pick up where you left
off" → Continue (1.1, Resume study, 0/4) → New source + Browse all projects (1); no
project list. Build PASS, lint 0 on the file.

Remaining P2 (open): the Projects side — remove the welcome ceremony / non-actionable
dashboard metrics / second promoted-resume / static Advanced Options / ephemeral
Study History drawer; editable project names; archive/restore + data controls +
delete surfaced in Projects.

## Package F — Projects: remove mascot + welcome ceremony (P2, partial)

Directive Programme 2: Projects owns finding/managing, not a second welcome. The
mascot Companion and the "Welcome back to your reading" hero are removed; the
header now states what Projects is for ("Your projects. Find a project and open it
in Study, Research or Exams — or start a new source."). Deleted the orphaned
ArapalCompanion.jsx and the getDaypart daypart helper. Verified in-browser on the
seeded sample. Build PASS, lint 0 on the file.

Remaining P2 on Projects (open, next package — layout-contract work): remove the
non-actionable summary metrics; remove the second promoted-resume ("Study
dashboard · Pick up where you left off") that duplicates Home; remove the static
Advanced Options; retire the ephemeral Study History drawer (study history is
durable in Research); surface editable project names, archive/restore, data
controls and delete in Projects.

## Stage 2 convergence — green checkpoint 2 (HEAD 4a220c8)

Continuation from 5e3ef38. Home/Projects role split landed. Cumulative gate green:
build PASS · lint 0 · unit PASS · behaviour 47/47 · QA production 0 · VR 52/52.

Added commits:
- 944192f — Home returning state owns the active project only (Continue + grounded
  attention + New source + Browse-all-projects link); duplicative project list removed (P2)
- d61e602 — Projects removes the mascot Companion + "Welcome back" ceremony;
  purposeful "Your projects" header (P2)
- 4a220c8 — re-baseline projects-library goldens for the reframed header

### Prioritised remaining Stage 2 plan (for efficient continuation)

Batch each screen's visual changes into ONE package + ONE VR re-baseline (each VR
cycle is ~10 min), and drive the real product per change.

1. **Projects P2 finish** (one package): set `Layer4_Projects_Summary` slot → null
   and delete `DashboardSummary`/`getDashboardSummary` (non-actionable metrics);
   set `Layer4_Projects_History` slot → null and delete
   `StudyHistoryPanelContainer`/`VirtualizedHistoryTable` + the `useLiveStudyHistory`
   import + `History` icon (history is durable in Research); remove `AdvancedOptionsPanel`
   from the DetailStage (delete the lazy import + AdvancedOptionsPanel.jsx); reframe
   the lesson-rail intro copy off the verbatim Home duplication ("Pick up where you
   left off"). Verify 390/768/1280/1440, re-baseline projects-library/projects-advanced-open.
2. **CV-P1 spine**: move segmentation intent + source-entry draft off sessionStorage
   into the store (workflowId+revision); per-project active segment as the durable
   Study position; persistence-success on every mutation (extend the publish-honesty
   pattern); one `learningState(projectId, segmentId)` selector consumed by Home/
   Projects/Research/Exams; migrate/quarantine any legacy keys. Unit + isolation tests.
3. **CV-P6 Exams**: attempt lifecycle already on the store — audit for the immutable
   submitted-answer snapshot, retry-grading-from-snapshot, retake-as-new-attempt,
   and library action distinctness; add transition-table tests.
4. **CV-P7 responsive** (user items 4/5): mobile Study one continuous flow;
   Discussion as a reachable full-height sheet without shifting the work lane; the
   collapsed-support float control must work or be removed (no dead control).
5. **CV-P8 trust contract**: data-controls dialog (versioned Export / validated
   Restore / Delete project / Delete all + local-storage disclosure).
6. **CV-P5 Research finish**: grounded filter set (drop duplicate Mistakes/Weak
   lenses); reduce revision-queue ceremony; dossier with empty sections hidden.
7. **CV-EV evidence**: production-transport interception (Playwright route-mock the
   provider endpoint) for built-dist PASS/FAIL/Discussion/Research/Exam; migration +
   transition-table + reload/isolation tests; AC-01…08 built-product evidence with
   state-specific + persistence + action-reachability assertions; negative harness proofs.

Not yet Stage-3-ready. No Stage 3 performed. Not pushed.

## Package G — Projects: remove summary metrics + reframe rail copy (P2)

Directive Programme 2. Verified in-browser on the seeded sample:
- Removed the non-actionable aggregate summary metrics (ready lessons / segments
  studied / saved items) — the Summary slot is null and the region collapses
  cleanly. Deleted DashboardSummary + getDashboardSummary.
- Reframed the lesson-rail intro off the verbatim Home duplication: "Study
  dashboard / Pick up where you left off" → "Library / Choose a project.", with
  "Home is where you pick up where you left off" pointing the resume job back to
  Home. Projects now reads as the library, Home as the command centre.

Build PASS, lint 0 on the file.

Remaining Projects P2 (careful separate pass — large self-contained deletions):
retire the Study History drawer (StudyHistoryPanelContainer + VirtualizedHistoryTable,
~144 lines; history is durable in Research) and the static Advanced Options panel;
add editable project names + archive/restore/data-controls/delete surfacing.
NOTE: the history/advanced removal must delete only lines 1099-1242 (the two history
functions), NOT overrun into `export default function ProjectsScreen` at 1243.

## Package H — Projects: retire the Study History drawer (P2)

Directive Programme 2 ("ephemeral Study History drawer if it has no durable role").
Study history is durable in Research, so the per-project Projects drawer was
redundant. History slot → null; deleted StudyHistoryPanelContainer +
VirtualizedHistoryTable (144 lines, main component preserved) and the now-dead
imports (History, useLiveStudyHistory, useVirtualRows, useEffect, useRef, Bookmark,
PanelRightClose/Open) + the historyStatusLabels const. Verified in-browser: the
Study History rail is gone, layout collapses cleanly, detail gains room. Build PASS,
lint 0 on the file.

Remaining Projects P2 (small follow-up): the "Show advanced" Advanced Options
toggle in the detail (static/prototype affordance); editable project names +
archive/restore/data-controls/delete surfacing.

## Package I — Projects: remove static Advanced Options (P2)

Directive Programme 2 ("static Advanced Options cards and prototype-facing copy").
AdvancedOptionsPanel.jsx was a 100-line static display panel with no actions and no
V1 dependency. Removed the AdvancedDisclosureContainer + its DetailStage usage +
the lazy import; deleted AdvancedOptionsPanel.jsx and the now-dead lazy/Suspense/
SlidersHorizontal imports. Build PASS, lint 0 on the file.

Projects P2 now: find-and-manage library — clean header, search + lesson list +
detail (resume/open, progress, delete/archive manage bar), no mascot, welcome
ceremony, summary metrics, duplicate resume copy, history drawer, or advanced cards.
Remaining P2: editable project names + fuller archive/restore/data-controls/delete
(overlaps CV-P8 trust contract).

## Stage 2 convergence — green checkpoint 3 (HEAD 8efc658); CV-P2 substantially closed

Continuation from 371daf7. Projects P2 converged. Cumulative gate green:
build PASS · lint 0 · unit PASS · behaviour 47/47 · QA production 0 · VR 52/52.

Added commits: e6ef3cf (retire Study History drawer), 8efc658 (remove static
Advanced Options).

**CV-P2 status:** substantially CLOSED. Home = returning command centre (one
Continue + grounded attention + New source + Browse-projects link); Projects =
find-and-manage library (clean header, search + lesson list + detail with
resume/open + progress + delete/archive manage bar). Removed across E–I: the
duplicative Home project list, mascot Companion, "Welcome back" ceremony,
non-actionable summary metrics, duplicate "Pick up where you left off" resume copy,
ephemeral Study History drawer, static Advanced Options panel. Segmentation already
out of global nav (Package A). Remaining P2 fragment folded into CV-P8: editable
project names + fuller archive/restore/data-controls/delete.

Next per plan: CV-P1 (domain spine) or CV-P8 (trust contract), then CV-P6/P7/P5-finish/EV.
Not yet Stage-3-ready. No Stage 3 performed. Not pushed.

## User item 5 verified (Discussion layout) — no desktop reproduction

Measured the Study translation box before/after opening Discussion at 1280: the
editor kept its exact vertical position (textarea y=452 unchanged; editor y=377
unchanged; source y=118 unchanged) and moved LEFT (x 521→363), narrowing to make
room for the Discussion panel on the right — i.e. exactly the requested behaviour.
At 375 the box also stays put and Discussion stacks below it. So item 5 ("box moves
up") does not reproduce at standard desktop or mobile widths; likely already
addressed by prior responsive work or specific to an intermediate width.

Genuine CV-P7 remainder confirmed: mobile Discussion stacks INLINE below the editor
rather than opening as the full-height reachable sheet/page the directive specifies
(Programme 7). Tracked under CV-P7, not item 5.

## Package J — Local-first trust contract (CV-P8)

Directive Programme 8. A compact Data & privacy dialog (not a standalone Settings
app), reachable from the nav rail's utility foot beside AI setup:
- **Store**: `exportBackup()` (versioned/kinded/timestamped snapshot),
  `importBackup()` (validates kind + version + collection shape; merges onto a
  fresh empty state like the read path; never claims success on a failed write;
  rejects non-Arapal/future-version/malformed), `deleteAllData()` (empty state).
  Exposed via `actions`.
- **Dialog**: clear disclosure that all data AND the API key live only in this
  browser and nothing is sent to an Arapal server; Export (downloads a JSON
  backup), Restore (file picker → validated import), Delete-all (two-step confirm;
  also clears the AI key + health so "delete all" is truthful). Honest status line.
- **Entry**: `NavigationRailDataControl` (ShieldCheck) + `shell.openDataControls`
  wired in AppV2; per-project delete already lives in Projects' manage bar.

Verified: 7 data-controls unit tests pass (export→delete→import round-trip incl.
JSON string; rejects non-backup/future-version/malformed without touching current
data). Dialog rendered + inspected in-browser. Build PASS, lint 0, test:data PASS.
No shared provider secret; BYO-key boundary unchanged.

## Stage 2 checkpoint 4 (HEAD 1b0770d) + success/fail-screen plan (CV-P4)

CV-P8 (data controls) landed and verified. Gate green (build/lint/unit/test:data;
behaviour+VR unchanged since 8efc658 — data-controls is additive, no VR state).

### User hint + directive update — Study PASS/FAIL result screens (CV-P4, next)

Updated directive line 98: "Submit produces an unmistakable success or recoverable
failure result; it never silently appears to do nothing." User: the LEGACY V1
study result screen has very valuable working cards/info — reference it, but keep
our cleaner styling.

Legacy reference located: `src/components/figma/RightPanel.jsx` (result rail).
Its result-state cards:
- **PASS (submitted):** Grade (emerald / Award + numeric grade circle), Takeaways
  (indigo, numbered actionable list), Lexicography (purple, vocabulary).
- **FAIL (failed):** Grade (rose / Award), Fix-steps (orange, numbered), Lexicography.
- Draft: Guidance / Lexicography / Phrasing.

V2 gap analysis (verified via ?v2GradeOverride): the V2 PASS result shows Best-in-
class translation + Your translation + Feedback but NO prominent PASS verdict/grade
header; the FAIL result already has a clear "This attempt didn't pass" verdict +
blockers + Submit-again. Vocabulary/guidance/takeaways come from the result adapter
(StudyResultEvidence).

Planned CV-P4 package (focused fresh pass, verify at PASS+FAIL with the override,
one VR re-baseline):
1. Add a prominent, honest VERDICT card at the top of the live result — PASS
   (success tone) / "Not yet" (review tone) with the real evaluator grade and the
   one-line reason — porting the legacy grade card's clarity into the clean V2
   style. No fabricated score (grade is real evaluator output; outcome computed by
   the app, R-016).
2. Ensure takeaways (PASS) / prioritised blockers as fix-steps (FAIL) render as a
   clean numbered list, and vocabulary shows when present — mapping the legacy
   Takeaways/Fix-steps/Lexicography cards to the current StudyResultEvidence.
3. Keep Continue dominant on PASS, edit+Retry dominant on FAIL; reload reproduces
   the exact result (already holds).
Do NOT copy the legacy float/fullscreen rail machinery or its density — adapt
content only.

## Package K — Study PASS verdict card (CV-P4, from legacy reference + directive L98)

The V2 FAIL result had a clear "This attempt didn't pass" verdict but PASS did
not, so success could read as ambiguous — the gap the user flagged and updated-
directive line 98 forbids ("unmistakable success or recoverable failure result").
Added a PASS verdict banner in the Study context region, symmetric with the FAIL
banner: success-toned "Passed · <grade>/10 · <feedback>", porting the legacy grade
card's clarity (src/components/figma/RightPanel.jsx) into the clean V2 style. The
grade is the real evaluator output (shown only when present); nothing fabricated.
Verified via ?v2GradeOverride=pass: "PASSED · 9.1/10 · Accurate and fluent…" with
Best-in-class + Your translation + Continue dominant. Build PASS.

Remaining CV-P4 success/fail work: render takeaways (PASS) / prioritised blockers
(FAIL) as a clean numbered list mapped from StudyResultEvidence; keep support
grounded. Larger fresh pass.

## Stage 2 checkpoint 5 (HEAD bbf051e) — CV-P8 done, PASS verdict added

Cumulative gate green: build PASS · lint 0 · unit/data PASS · behaviour 47/47 ·
QA production 0 · VR 52/52. Tree clean.

Session-to-date (baseline 3cf737b): Packages A–K committed and verified.
- CLOSED: CV-P2 (Home/Projects IA), CV-P8 (trust contract).
- ADVANCED: CV-P3 (fold), CV-P4 (no empty support, AI readiness, dev grade override,
  PASS verdict), CV-P5 (Research masthead).
- All six user-reported items addressed or verified.

Remaining for the Stage 2 exit condition (multi-session; plan in checkpoints 2 & 4):
CV-P1 (domain spine), CV-P6 (Exams on canonical store), CV-P7 (mobile Study/
Discussion-as-sheet + float control), CV-P4/P5 finishes (takeaways/fix-steps
numbered list; grounded Research filters), CV-EV (production-transport interception
+ AC-01…08 built-product evidence). Not Stage-3-ready. No Stage 3 performed. Not pushed.
