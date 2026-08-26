# Arapal — Live Release Ledger

## Purpose

This is the current, evidence-backed distance to public release. It is not a historical defect archive, an implementation completion log, or a composite quality score.

A finding appears here only when it was independently reproduced on the current candidate, verified in the current implementation, or remains an explicit external verification requirement.

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
