# Arapal — Live Release Ledger

## Purpose

This is the current, evidence-backed distance to public release. It is not a historical defect archive and it is not a composite quality score.

A prior finding appears here only when it was reverified on the current running product or remains a genuine unresolved release risk.

---

# Evidence header

- **Candidate commit:** 85764fad6a84399ab4c2eb5d89823b8a1044449f
- **Branch:** audit/release-certification
- **Working tree:** DIRTY — 702 paths at Stage 1 reconciliation: 664 deleted, 30 modified, 8 untracked. The running product can be audited, but no exact immutable release candidate can be certified from this tree.
- **Running app/config:** Vite development server at http://localhost:5173; production build separately exercised with vite build.
- **Stage 0 authority:** Claude Ultracode baseline, 2026-08-24.
- **Stage 1 authority:** GPT-5.6 Ultra independent product/visual audit, 2026-08-24, using the Stage 1 prompt in docs/release/PROMPTS.md. The requested standalone GPT_5_6_ULTRA_INITIAL_PRODUCT_AUDIT_PROMPT.md is not present in the current tree; the repository's current embedded prompt is the operative equivalent.

## Stage 1 execution

The audit followed render-first, code-second ordering.

1. The running product was exercised as a first-use and returning-use journey at desktop, tablet 768×1024 and mobile 390×844.
2. The live journey covered the empty/base entry, V2 Project Home, project creation, source intake, segmentation, Study draft/fail/pass/reload/discussion, Research browse/search/selection/handoff, and Exams create/attempt/reload/results/remediation.
3. The current release-capture corpus was reviewed across all six declared viewports. Its true status is 151 CAPTURED, 3 UNREACHABLE and 2 executions with no completed status because of timeout.
4. Only after the rendered symptoms were recorded were the implementation, tests and current release evidence inspected for root cause and scope.

Primary rendered evidence:

- artifacts/release-audit/evidence
- artifacts/qa/visual-standard.json
- test-results/release-audit-release-evid-*-tablet-768/error-context.md

---

# A. Release verdict

## NOT RELEASE READY

The most important reasons are:

1. Production screens do not share one live project model. A newly created Arabic project reaches Study, while Projects, Research and Exams continue to present unrelated Al-Hidayah/prayer fixtures as the user's work.
2. Segmentation violates its authority model: clicking the proposal action publishes segments before approval, Review edits are local-only, and default Quick mode can skip Review.
3. Product truth is not trustworthy. Study turns a form-only heuristic into green studied/completed state and unsupported claims; Exams fabricates scores from answer length and hard-coded question indexes.
4. Required V1 persistence and handoffs fail: a newly created assessment disappears on reload, an attempt can reopen as a blank screen, and Research/Exam remediation opens the wrong live segment.
5. Required responsive journeys are unusable at current release widths: Study at 768, Segmentation Review and Exam Attempt at 390, Projects at 390, plus no mobile global navigation.
6. The public entry still opens the incompatible legacy product, development/reference routes and assets remain production reachable, and the release workflow can report success while gates or capture states fail.
7. There is no clean exact-SHA candidate, deployment/rollback/monitoring package, or explicit security/privacy disposition for indefinitely stored Arabic source and study data.

---

# Current evidence reconciliation

| Evidence | Current result | Stage 1 interpretation |
|---|---|---|
| Production build | PASS on the dirty tree; main chunk warning remains | Proves compilation only. It is not clean-candidate or production-entry evidence. |
| Lint | FAIL; 21 real tracked source/test errors plus dirty-tree archive noise | Dimension H remains open. |
| Deterministic QA | FAIL with 8 production overlaps, all Projects at 390×844 | Reproduced visually and promoted into the systemic responsive finding R-020. |
| Data tests | PASS 34/34 | The central store works in isolation, but production Projects/Research/Exams bypass material parts of it. This cannot certify the journeys. |
| Behaviour tests | PASS 36, SKIP 2 | Several tests encode publish-before-approval, use stable fixtures, assert only banners/body text, or exercise the unused exam store. They do not cover the fresh-project cross-module journey. |
| Visual regression | FAIL 10/56 against a stale baseline | Useful as a change signal, not release evidence until intentionally reviewed and rebaselined. |
| Release-evidence harness | Playwright reports 154 passed, 2 failed | Not 154 captures: 151 CAPTURED, 3 UNREACHABLE that return success, and 2 tablet timeouts. Page errors, failed requests, route correctness and meaningful content are recorded but not asserted. It serves the development server, not built dist. |
| Audit suite | Command exits 0 while lanes contain findings/degraded or missing input | Informational only; not a release gate as currently wired. |
| Security/privacy/operations | No current package | Remains an explicit release blocker, not an assumed pass. |

Verified positive boundaries, with limited scope:

- No recognizable tracked client credentials, dangerous HTML injection API, eval-style execution or product console logging was found.
- No external AI/model client currently sends user text off-device.
- Live Study drafts persisted across reload in the exercised happy path.
- V2 Project Home and Study Focus are visually strong at the widths where their workflows remain usable.

These positives do not close the active findings below.

---

# B. Current active ledger

| ID | Domain | Severity | Rendered/product symptom | Verified root cause and evidence | Affected states / scope | Required outcome to close | State / owner |
|---|---|---:|---|---|---|---|---|
| R-001 | Candidate / evidence integrity | P0 | No immutable product instance can be nominated for release; current evidence cannot prove one coherent SHA-bound run. | 702 dirty paths and no local run identity. CI run_gate records non-zero exits then returns success. The release harness permits UNREACHABLE, does not assert recorded runtime errors, and runs npm run dev rather than built dist. Current capture truth is 151 captured + 3 unreachable + 2 timed out. | Entire release; systemic. | Nominate one clean SHA, build once, serve that immutable artifact, make every required gate/state fail closed, record SHA/tooling/exit codes/artifact hashes, and complete all release evidence against that same artifact. | OPEN / Release authority |
| R-014 | Product data / context truth | P0 | After creating the caravan project, Projects still showed Jumu'ah/Purity/Fasting; Research remained a 30-segment Al-Hidayah ledger; Exams remained a prayer fixture. Study mixed the live Arabic source with an Al-Hidayah header, unrelated Quick Lexicography and legal-condition retry copy. Research also advertises Ask Companion/Create patch capabilities that are not grounded in the live project. | Projects imports static studyDashboardData and generates 1,800 fake history rows. Research imports projectResearchData; Ask Companion ignores the submitted question and reuses a fixed answer/citations, while Create patch has no handler. Exams imports static seed/model data. Study defaults the shell title, Quick Lexicography, retry copy and GradeBody claims to fixture-derived content; its other live support cards correctly show unavailable placeholders. These screens do not share one live model. | Projects, Research, selected Study identity/support, Exams and their cross-screen summaries; systemic. | Establish one project-scoped production repository/view model. Every production screen must read the selected live project and stable IDs. Fixtures must require an explicit sample/test boundary and be visibly labelled, never silently used as production fallback. Unsupported companion/patch capabilities must be implemented against that boundary or removed/disabled honestly. | OPEN / Implementation |
| R-015 | Source / segmentation authority | P0 | The nominal empty intake is prefilled and actionable. Selecting AI segmentation reached Live/Success before review; Review showed a different hard-coded source/word count and its edits did not become authoritative. Re-running this flow on a project with study work can replace the authoritative segmentation before consent. | Intake starts with a hard-coded 28-word passage, calls addSource and publishSegments before navigation, and defaults Quick mode to true. Review edits only component state; Approve only navigates; its source tray is hard-coded. publishSegments deletes prior segments, drafts and study records before approval and can leave results orphaned. The deterministic local splitter is labelled AI. | Source intake, loading, review, success, re-segmentation and Study handoff; systemic authority/data-loss failure. | Persist source first, store a non-authoritative proposal separately, require an explicit approval transaction to publish the edited proposal, and make Success unreachable before durable approval. Review must show the exact preserved source/count. Existing study work needs an explicit non-destructive migration/archive policy. | OPEN + RED-05 / Product owner then Implementation |
| R-016 | Evaluation / product truth | P0 | A plausible live translation was marked green, studied and No issues found despite no meaning/reference evaluation. The UI retained Best in Class framing and claimed nothing was untranslated. The same seeded exam displayed 82% in Library and 13% in Results. | Study evaluator checks only length, punctuation and remaining Arabic; store maps heuristic pass to submitted/completed. Support UI ignores stored notes and emits fixed claims. Exams grades by character length and fixed question indexes, then presents a percentage, misses and remediation. | Study pass/fail/progress/support and all Exam result surfaces; systemic. | Separate saved attempt, surface observations, self-attested study completion and any future semantic evaluation. Render evaluator output exactly; remove unsupported pass/score/best/reference claims. Exams needs an explicit evaluation contract or an honest ungraded mode. | OPEN + RED-01/02 / Product owner then Implementation |
| R-017 | Exams / durable identity | P0 | A newly saved assessment appeared, accepted an answer and claimed autosave; reload produced a blank Attempt shell, then the created assessment was absent from Library. | Exams rehydrates only static seeds. A created exam exists only in React state while autosave stores an attempt pointing to that transient ID. Production Exams bypasses the already-implemented central exam/attempt store and reconstructs seeded results. | Exam builder, Library, Attempt, reload/re-entry and Results; systemic. | Persist the assessment definition, attempt and immutable result snapshot through one store. Validate restored identity before entering Attempt; never reconstruct historical results. Prove create/reload/resume/submit/review with consistent totals and score semantics. | OPEN / Implementation |
| R-018 | Contextual handoff / stable identity | P0 | Opening selected Research segment 1.3 or an Exam remediation returned to the caravan project's first segment 1.1, losing the selected context and provenance target. | Research performs a bare route navigation. Exams writes human reference/question IDs while live segments use seg_* IDs. Study silently converts a no-match to index 0 and does not persist selected current segment. The canonical navigation API is unused. | Research → Study, Exams → Study, resume/current-segment behavior; systemic. | Route all handoffs through a canonical projectId + segmentId contract, resolve refs explicitly within a project, reject stale context visibly, and persist the actual current segment. Browser evidence must show the exact selected source and active row before and after reload. | OPEN / Implementation |
| R-019 | Persistence / recovery | P0 | Happy-path draft reload worked, but the product has no truthful failure UI when local persistence is unavailable; source can still claim preserved and Study continues in volatile memory without surfacing persistence failure. Manual notes also disappear on reload. A lightweight wrong-shape state reproduction throws a selector TypeError; a browser blank/crash outcome was not separately rendered. | Store mutates memory before checking localStorage and exposes persistenceHealthy, but no product screen consumes it. Study manual notes live only in component state. Storage shallow-merges valid JSON without schema validation; no app error boundary or recovery/export path exists. Browser impact from the verified TypeError is a reasoned inference. | All saved user source, drafts, notes, records, exams and attempts; systemic. | Return durability outcomes to the initiating UI, withhold success claims/navigation on failure, preserve text for retry/copy/export, persist manual notes with correct ownership, validate/version stored state, quarantine corruption, and provide a top-level recovery boundary. | OPEN / Implementation |
| R-020 | Responsive composition / navigation | P0 | At 768 Study's three rails leave roughly 129px for the work lane and make Submit/Discuss unreachable. At 390 Segmentation Review clips proposal/action controls, Exam Attempt places the answer panel off-screen, and Projects layers hero/summary/cards. Mobile has no global navigation replacement. | One binary mobile breakpoint at 560px; Study retains fixed side rails at tablet; Exams and Review retain desktop grids/action groups; Projects uses compressed finite tracks with visible overflow; AppV2 hides the navigation rail on mobile and renders no replacement. | Study, Segmentation Review, Exam Builder/Attempt, Projects, Research priority, global navigation at 390/768; systemic. | Define intentional compact/tablet/mobile compositions: collapse or drawer secondary Study rails before the work lane fails, sequence Exam/Review flows, restore Projects normal flow, put Research search before secondary queues, and add a mobile app-navigation pattern. | OPEN / Implementation |
| R-021 | Production entry / dev separation | P0 | The base URL opens a visibly different legacy home; in the live audit its muted intro obscured content beyond 10 seconds. Users can encounter two incompatible homes and vocabularies. | Empty and unknown non-V2 hashes return legacy App, which explains why the overlay appears. Source schedules that intro to finish after 2.1 seconds, so the cause of its observed indefinite persistence remains UNKNOWN. Only Projects and Exams aliases normalize to V2. Seven Lab/Quality routes and production query-state switches are unguarded; clean HEAD also tracks screenshots and internal audit JSON under public. | Public root/unknown URLs, global shell, production bundle/assets; systemic. | Make V2 Project Home the production root, define safe unknown-route behavior, remove legacy from the production entry/bundle, and compile out Lab/debug routes, query injectors and internal/reference assets. Verify root and supported aliases from built dist; if the legacy overlay remains testable, trace its timer/runtime behavior separately. | OPEN / Implementation |
| R-022 | Discussion / recovery | P1 | Typing a segment question and pressing Send produced no reply, loading, error or retry. Summarise and save also did nothing while promising a saved segment summary. | Discussion textarea is uncontrolled and Send/Summarise controls have no handlers; there is no session/message/error state or persistence boundary. | Study draft/submitted discussion and required one-summary-per-session semantics; systemic feature gap. | Implement the contextual session, controlled message preservation, loading/error/retry, and exactly one saved summary attached to the correct segment/attempt/record—or remove/disable the unsupported promise until that boundary exists. | OPEN + RED-03 / Product owner then Implementation |
| R-023 | Security / privacy / operations | P1; P0 if an authenticated or multi-user release is intended | The product gives no user-facing disposition for indefinitely stored source/translations/results, and there is no evidenced production host, deployment, rollback, monitoring or incident path. | Plaintext shared-origin localStorage has no identity/tenant isolation, retention, delete-all/export or privacy disclosure. Intended local-only versus multi-user model and host headers are unknown. No deployment/rollback/monitoring package was found. | All user data and public operations; systemic/external decision. | Decide deployment and user/data model; complete current threat/privacy review, retention/delete/export controls or authenticated isolation as applicable, CSP/security-header and dependency disposition, exact-artifact deployment, rollback drill, error visibility and triage ownership. | OPEN + RED-04 / Product owner and Release authority |
| R-024 | Performance / compatibility | UNKNOWN release-blocking evidence gap | User impact under real mobile networks, long Arabic content, large project collections and non-Chromium browsers is not known. | Current build has a verified bundle-hygiene warning: an approximately 972 KiB raw main chunk, broad font assets and legacy/Lab code. Only Chromium is configured, and no realistic scale/slow/error package exists. User-visible impact is not yet proven. | Initial load, supported browsers, long/large content and mobile reliability; systemic evidence gap. | Define supported browsers and budgets; measure built dist under representative throttling; split production routes/assets and subset fonts; stress long Arabic and large collections; run the supported browser matrix. | UNKNOWN / Engineering authority |
| R-025 | Visual/product finish | P2 | Compact desktop Study clips lexicography and makes source overflow ambiguous; Segmentation Success exposes placeholder-like Project New project / Batch ID new metadata; Research no-results lacks one-click reset; one submitted CTA wraps at 1280. | Local/component sizing and unfinished state copy after the systemic route/data problems. | Selected Study, Segmentation Success, Research no-results and compact desktop states; mixed local/systemic. | Resolve after the higher-order data and responsive packages; verify complete content, clear recovery and stable action typography across 1280/1366/1440/1920. | OPEN / Design + Implementation |
| R-010 | Real-user evidence | P3 / post-RC | No current real-user usability evidence. | External evidence has not yet been collected. | Whole product; external. | Run representative usability work after repository release blockers are closed; promote any exposed defect by actual severity. | UNKNOWN / Product owner |

---

# C. Implementation packages

The packages are ordered by dependency, not by screen.

## IP-01 — One production data spine and explicit sample boundary

- **Objective:** Make the selected live project, source, segments, records and stable IDs the sole production data source.
- **Findings:** R-014 and the data foundations of R-017/R-018.
- **Likely layer:** src/v2/data selectors/repository, screen view-model adapters, route context; fixture/demo entry separated at build/runtime boundary.
- **Acceptance evidence:** Create one unique Arabic project and prove its exact title/source/counts in Project Home, Projects, Research, Study and Exams. Assert unrelated Al-Hidayah/prayer/legal/lexicography fixture strings are absent unless an explicitly labelled sample mode is enabled. Verify project-to-project isolation.

## IP-02 — Segmentation proposal-to-approval transaction

- **Objective:** Restore the product contract: preserved source → non-authoritative proposal → editable review → explicit durable publish.
- **Findings:** R-015.
- **Likely layer:** segmentation domain state/store actions plus Paste, Review and Success orchestration.
- **Acceptance evidence:** Before approval, authoritative segment count remains zero; Review shows the exact preserved source and word count; edited boundaries/labels survive Review reload; Approve atomically publishes exactly those edits; Success and Study show the approved result only. Re-segmenting an established project preserves or explicitly archives every draft, note, study record, result and summary according to RED-05, with no silent loss or orphaned data.

## IP-03 — Honest evaluation and completion semantics

- **Objective:** Stop UI and progress state from claiming knowledge the evaluator did not measure.
- **Findings:** R-016; depends on RED-01 and RED-02.
- **Likely layer:** evaluator interface/result schema, study-record state machine, support/result primitives, exam result model.
- **Acceptance evidence:** UI renders stored observations exactly, omits score/best/reference when absent, and cannot turn a form-only check into semantic pass. Exams are either transparently ungraded or validated against an agreed corpus including same-length right/wrong answers, Arabic, malformed, error, timeout and stability cases.

## IP-04 — Durable Exams and canonical segment handoffs

- **Objective:** Give assessments/results durable identity and make every remediation target exact.
- **Findings:** R-017 and R-018; depends on IP-01 and IP-03.
- **Likely layer:** central exam/attempt store, immutable result snapshots, data/navigation.js, current-segment persistence.
- **Acceptance evidence:** Create/reload/resume/submit/reopen an assessment with unchanged definition, answers and result semantics. Open Research segment 1.2 and each Exam miss into that exact project/segment before and after reload; stale identity produces a recoverable message, never silent segment 1 fallback.

## IP-05 — Contextual assistance and repair as real bounded capabilities

- **Objective:** Fulfil or honestly withdraw the promised Study Discussion, Research companion and Create patch capabilities.
- **Findings:** R-022 and the companion/patch portion of R-014; provider aspects depend on RED-03.
- **Likely layer:** discussion session/message model, grounded async service boundary, citation/provenance contract, controlled patch proposal, summary persistence attached to segment/attempt/current record.
- **Acceptance evidence:** A controlled Study message survives failed send, exposes loading/error/retry, successful response stays on the same segment, close restores work state, and exactly one summary per session survives reload with correct ownership. Research questions produce grounded, question-dependent answers/citations or an honest unavailable state. Create patch has a controlled proposal/review action or is absent/disabled.

## IP-06 — Durability and crash recovery

- **Objective:** Make every saved/preserved claim conditional on durable success and recover safely from unavailable/corrupt storage.
- **Findings:** R-019.
- **Likely layer:** store action return contracts, schema migration/validation, app error boundary, recovery/export UI.
- **Acceptance evidence:** Forced quota/disabled storage cannot lose the user's visible text or claim success; retry/copy/export works. Manual notes survive reload with correct project/segment ownership. Wrong-shape and future-version state is quarantined with a recover/reset path instead of a blank/crash.

## IP-07 — Responsive workspace and mobile navigation system

- **Objective:** Give each required width a deliberate task composition rather than compressed desktop grids.
- **Findings:** R-020 and responsive parts of R-025.
- **Likely layer:** shared shell breakpoint policy, screen contracts, drawer/stepper/mobile navigation primitives.
- **Acceptance evidence:** Complete keyboard/pointer journeys at 390, 768, 1280 and 1440 for source review, Study draft/fail/pass/discussion, Exam builder/attempt/results and remediation. No clipped/off-canvas primary control; main Study lane remains readable. Mobile exposes a named global navigation landmark, keyboard-operable destinations, correct aria-current and a nonempty accessibility tree.

## IP-08 — Production surface separation

- **Objective:** Ship one coherent V2 product and no accidental reference/development surface.
- **Findings:** R-021.
- **Likely layer:** RootApp routing, route registry/build flags, query-state gates, public asset allowlist, bundle boundaries.
- **Acceptance evidence:** Built-dist smoke from /, supported aliases and unknown routes; one V2 home/shell only; forbidden legacy/Lab hashes, debug query injectors and internal screenshot/audit paths are absent or safely unavailable.

## IP-09 — Exact-candidate release, security and operations package

- **Objective:** Convert a converged product into a certifiable, operable public release.
- **Findings:** R-001, R-023 and R-024; depends on all earlier packages.
- **Likely layer:** CI/release workflow, production artifact server, host configuration/headers, observability/runbooks, performance and browser matrix.
- **Acceptance evidence:** Clean nominated SHA; fail-closed gates; every required state CAPTURED on the named route from built dist; current security/privacy/dependency disposition; supported-browser and performance/scale evidence; exact-artifact deploy, smoke, rollback drill, monitoring and triage owner.

Dependency order:

IP-01 → IP-02/IP-03/IP-04/IP-05; IP-03 → IP-04; IP-06 must land before full persistence journeys; IP-07 follows stable interaction/data shapes; IP-08 precedes the final IP-09 candidate package.

---

# D. Unknowns / RED decisions

Implementation must not invent these semantics.

| ID | Decision / unknown | Why it is RED | Required owner/output |
|---|---|---|---|
| RED-01 | What does submitted, studied, complete or pass mean when Study has only a form-level heuristic and no semantic evaluator? | This determines authoritative progress and which success surfaces may appear. | Product owner: explicit V1 state model and copy/evidence contract. |
| RED-02 | Are V1 assessments semantically graded, self-checked/ungraded, or deferred? | A real evaluator requires rubric/corpus/error semantics; an ungraded mode requires removal of score/miss claims. | Product owner + linguistic authority: assessment contract and representative corpus, or explicit ungraded decision. |
| RED-03 | Is external AI actually part of V1 segmentation, Discussion and the Research companion, and if so which service/data-quality/error boundary? | Current segmentation is deterministic but labelled AI, Discussion has no provider, and Research returns fixed answers/citations. Implementation cannot choose model, grounding, privacy, cost, latency or authority semantics implicitly. | Product owner + security/linguistic authority: service or rename/de-scope decision, quality set, server-side credential boundary, user-content consent/retention and failure policy. |
| RED-04 | Is the released product local-only/single-device, shared-device, or authenticated multi-user; where is it hosted? | Storage, isolation, deletion/export, headers, retention and deployment design all depend on this. | Product owner + release/security authority: deployment/data architecture and privacy disposition. |
| RED-05 | When an established project is re-segmented, what happens to stable segment identity and its drafts, notes, summaries, results and study records? | Current replacement deletes material work before approval and can orphan results; implementation must not guess whether to migrate, archive, version or require destructive confirmation. | Product owner + data authority: explicit non-destructive migration/version/archive policy and user confirmation semantics. |
| UNKNOWN-01 | Supported browser/device set, loading budget and realistic scale ceiling | Current evidence is Chromium-only and fixture-scale. | Engineering/release authority: support matrix, performance budgets and stress corpus. |
| UNKNOWN-02 | Real-user comprehension/usability after convergence | Repository review cannot substitute for representative users. | Product owner: post-RC usability study; promote discovered defects by severity. |

---

# Historical lead reconciliation

| Prior ID | Classification on current product | Evidence / disposition |
|---|---|---|
| R-002 | NOT REPRODUCED | Live AI SEGMENT TEXT control exposed a button role and accessible name. Remove from active ledger unless new assistive-technology evidence contradicts this. |
| R-003 | SUPERSEDED | Mixed/Arabic Research content cannot be meaningfully certified while Research is disconnected from live data; covered by R-014 and IP-01. |
| R-004 | STILL LIVE, SUPERSEDED BY R-021 | Legacy is not outside production: base/unknown URLs route to it. |
| R-005 | RESOLVED AS AN AUDIT TASK | Fresh-eyes V1 product audit completed; discovered product findings are R-014–R-025. |
| R-006 | RESOLVED AS AN AUDIT TASK | Independent composition review completed across the current corpus; live visual findings moved to R-020/R-025. |
| R-007 | STILL LIVE, SUPERSEDED BY R-016 + RED-01/02/03 | The actual AI/evaluation boundary is now characterised rather than unknown. |
| R-008 | STILL LIVE, SUPERSEDED BY R-023 + RED-04 | Security/privacy remains unevidenced and architecture-dependent. |
| R-009 | STILL LIVE, SUPERSEDED BY R-023 | Deployment/rollback/monitoring evidence remains absent. |
| R-011 | STILL LIVE, SUPERSEDED BY R-020 | Projects 390 overlap was manually reproduced and is part of the systemic responsive package. |
| R-012 | STILL LIVE, SUPERSEDED BY R-021 | Lab/dev routes and public audit assets remain production reachable. |
| R-013 | STILL LIVE, SUPERSEDED BY R-020 | Tablet Study failure was manually confirmed as an unusable three-column composition, not only a harness timeout. |

---

# Finding states and closure rules

- UNKNOWN — not yet investigated on the current candidate.
- VERIFY — a lead awaits current reproduction.
- OPEN — reproduced or implementation-verified and requires work.
- IN_PROGRESS.
- RESOLVED — closed with current evidence at the appropriate level.
- NOT_REPRODUCED — current reproduction attempted and failed, with evidence.
- ACCEPTED_RISK — deliberately accepted with rationale, blast radius, owner and follow-up.
- DEFERRED_P2/P3 — explicitly non-blocking future work.

Closure evidence must match the claim:

- function → journey/test evidence;
- persistence → reload/re-entry and failure-path evidence;
- visual/responsive → rendered evidence across affected states and widths;
- engineering → exact build/runtime/test evidence;
- security/privacy/operations → explicit review and production evidence.

Do not close a finding from code changes or prose alone. Do not use a composite release-readiness score.

---

# Closure log

| ID | Closed/reconciled on | Evidence | Notes |
|---|---|---|---|
| R-002 | 2026-08-24 running product at 85764fa | Live in-app browser accessibility tree and button inspection | NOT_REPRODUCED; current accessible name is AI SEGMENT TEXT. |
| R-003–R-009, R-011–R-013 | 2026-08-24 Stage 1 audit | Reconciliation table above | Prior audit/unknown rows were resolved as audit tasks or superseded by current root-cause entries; no product defect was falsely marked fixed. |

---

# Stage 2 convergence progress log

Chronological record of implementation increments against the packages in §C.
Each entry is a committed, evidence-backed step; findings close only when their
whole package's acceptance evidence is met.

| Date | Commit | Package | Change | Evidence |
|---|---|---|---|---|
| 2026-08-24 | `e9a1359` | Pre-Stage-2 | Clean checkpoint from the reorg tree: docs structure + AI prompts + ledger kept; eslint/gitignore repaired (archive noise → lint back to 21 genuine errors, not hidden); generated evidence excluded; 3 orphan duplicates removed; favicon restored. | build PASS, data tests 34/34, lint 21 genuine errors |
| 2026-08-24 | `18fcc58` | IP-01 (1/3) | Projects now reads the live project model via a new `liveProjectsData` adapter into the existing `Lesson` shape; fabricated 1,800-row history and Jumu'ah/Purity/Fasting fixtures removed; resume routes through the canonical handoff; honest empty-library and honest zero counts. | build PASS; in-browser: labelled sample project with real 0/4 counts, **zero fixture strings**, empty store shows "No projects yet", no console errors |
| 2026-08-24 | `37886bc` | IP-01 (2/3) | Project Research reads the CURRENT project's real segments via new `liveResearchData`; 30-segment Al-Hidayah fixture ledger removed; best-translation/evaluation/vocabulary render honest "available after study" placeholders (populated only by the real evaluator, IP-03); "Open in study" hands off the stable segment id (R-018). | build PASS; in-browser: sample project's 4 real segments (1.1–1.4), honest "Not started" + empty inspector fields, fixture ledger gone, no console errors |
| 2026-08-24 | `37886bc` | IP-01 regression | Full deterministic QA after screens 1–2. | `npm run qa`: **productionBlocking 0** (was 8), referenceBlocking 171, **0 blank routes, 0 page errors** across all 14 routes; `artifacts/qa/visual-standard.json` @ 2026-08-24T14:09Z |

**Honest caveat on the QA delta:** `v2-projects` production violations fell 8→0 **partly because the checker now exercises the empty-library state** (Projects reads the store, which the checker leaves empty), not because the populated Projects card was made responsive. The **populated Projects-at-390 overlap (R-020) is still open** and belongs to IP-07; do not read productionBlocking:0 as closing R-020.

| 2026-08-25 | `f882f9d` | IP-03 (1/2) | Provider-neutral AI grading boundary + Study grading contract derived from the source prompt (unchanged): pass = no critical-fail gate + no missing core anchor + ≥85% weighted-anchor coverage + grade ≥8.25/10; the **application** computes the outcome so a lenient model cannot leak a false pass (R-016 guard); BYO-key local config, honest `{available:false}` when unconfigured/empty/error — never fabricated. | **19 unit tests pass** (13 contract + 6 service): threshold gates, model-override guard, best-translation withheld on fail, unavailable/error paths; build PASS |

**IP-01 remaining:** Exams still imports static seed/model data and fabricates grading; it is entangled with the real evaluation boundary (IP-03) and a new provider-neutral exam contract (IP-04), so it is sequenced after the AI boundary rather than shallow-wired now. Cross-project isolation for R-014 to be asserted once a second distinct project can be created end-to-end (needs IP-02 segmentation approval).

| 2026-08-25 | `b3c599b` | IP-03 (2/2) | Wired the boundary into the store + Study: a new `'attempted'` state means "submitted, surface-checked, NOT graded"; `submitSegment` never yields a pass; async `gradeSegment` produces `'submitted'`/`'failed'` only from a real grade and stays `'attempted'` with an honest reason when unconfigured; `getProjectProgress` counts only real passes. | data 35/35, AI 19/19, Study behaviour 12/12, build PASS; **in-browser: submit → "AI grading is not configured on this device.", STUDIED stays 0/4, no false pass** (R-016 core fixed & verified) |
| 2026-08-25 | `b3c599b` | R-026 (new) | **Discovered:** the "Quick Lexicography" strip beside the Study source still renders fixture terms (مصر جامع / أفنية / مصلى) in live mode, unrelated to the current segment — while the Support panel correctly shows honest "not prepared" placeholders. A second fixture surface presenting as segment-specific knowledge. | in-browser at #v2/studyWorkspace on the sample project |

**IP-03 status:** core R-016 defect closed and verified (no form-check pass; honest unavailable). Remaining within IP-03/IP-05 scope: (a) the Study *review* panel rendering of real AI outputs (bestTranslation/feedback/vocabulary/guidance) on a genuine pass is stored in the result but only reachable with a provider key — unverifiable here; (b) **R-026** Quick Lexicography fixture strip (support-module residual, IP-05).

| 2026-08-25 | `9bda383` | IP-02 | Segmentation proposal→approval transaction (R-015, DECISIONS §5): new `proposals`/`archives` slices + `saveProposal`/`getProposal`/`clearProposal`; `publishSegments` is now the explicit approval AND non-destructive (archives prior study work on re-segmentation, RED-05); paste intake starts empty; Quick mode auto-approves on paste, manual/non-quick publish only on Review's Approve; Review seeds from the proposal (else canonical) and Approve publishes the edited segments; Success reactive + safety-net auto-approve. | data 37/37 (proposal-not-canonical, approval-publishes, archive-on-resegment); segmentation-handoff behaviour spec green; **in-browser: pasted custom Arabic → proposal → approval → 2 real segments in Study titled from the source, zero fixtures**; build PASS |
| 2026-08-25 | `9bda383` | R-027 / R-028 (new) | **Discovered residuals** (both P2, IP-01/R-025 family): R-027 — Study workspace header still shows the fixture subtitle "Al-Hidayah • The Book of Prayer" for a non-Al-Hidayah live project; R-028 — Segmentation Success metadata shows placeholder "PROJECT: New project / BATCH ID: new" instead of the real project title. | in-browser after end-to-end segmentation of a custom source |
| 2026-08-25 | `c2d9208` | R-027 / R-028 RESOLVED | Study shell title bar now receives the live project title (reference/demo keeps the default); Success metadata shows the real title, real segment count, "Ready to study". | **full behaviour suite 36 passed / 2 skipped** (baseline parity, no regression from IP-02/IP-03); in-browser both surfaces show the pasted project's real Arabic title + real count |
| 2026-08-25 | `9d1020d` | IP-04 (part) — R-018 handoff | Study honours the handoff's project + stable segment id: a mount effect selects the context's projectId if different; a segment that doesn't resolve shows a recoverable alert and lands on the first segment (never a silent segment-1). | **in-browser: Research segment 1.2 → "Open in study" → Study opens exactly 1.2** with a "From research" provenance banner and 1.2's source text; build PASS |

**IP-04 remaining (the large part):** the Exams screen (`src/v2/screens/Exams/ExamsScreen.jsx`, 842 lines) is entirely local `useState` over a seed model and fabricates `score %` (R-016/R-017). It needs: (a) durable create/attempt/result persistence through the already-built central store (`addExam`/`startAttempt`/`saveAnswer`/`completeAttempt`/`listExams`/`getAttempt`) so a created assessment and its attempt survive reload; (b) a derived provider-neutral **exam** contract (done, see below) with an honest **ungraded/unavailable** mode instead of fabricated percentages; (c) the Exam-miss→Study handoff on the same stable-id contract. This is a major screen rewrite comparable to Research and is the next focused increment.

| 2026-08-25 | `a573031` | IP-04 (part) — exam contract | Provider-neutral exam grading contract + service derived from the Study prompt §19 EXAM MODE + DECISIONS §2: the application computes the score from per-question results (correct/partial/incorrect), each miss carries its segment ref for exact remediation, honest-unavailable without a provider. | **27 AI unit tests** (19 study + 8 exam): score-from-results, miss→segment, unknown-result guard, unavailable/error; build PASS |

| 2026-08-25 | `6d720ce` | IP-04 (part) — R-016 exams | Exam grading is honest: submit grades through the provider-neutral exam service; **no provider → "Attempt saved · not scored"**, never a fabricated %; review shows only a real stored result; the seed exam's fabricated `lastScore: 82` is removed; remediation copy is honest for an ungraded attempt. | build PASS; **in-browser: library "Nothing completed yet" (no 82%); take + submit → "Attempt saved · not scored — AI grading is not configured", "Not graded yet"** — no fabricated score anywhere |

**IP-04 still to do (R-017 durability, the store-wiring rewrite):** move exams to the project-scoped store (`addExam`/`listExams`) so a created assessment + attempt survive reload and restored identity is validated before Attempt; generate questions from the **real project segments** (drop the Al-Hidayah `studyScopePool` fixture); route exam-miss remediation to Study via the **stable segment id** (currently the handoff still writes a human ref, so it relies on the R-018 recoverable-notice). The fabricated grading (R-016) is now gone; the remaining work is durability + real-segment scoping.

| 2026-08-25 | `2164595` | IP-04 exam tests | Exam behaviour tests updated to the honest reality (miss-based remediation legitimately requires a real grade; the handoff mechanism is covered by segmentation-handoff.spec.js). | both pass; **full behaviour suite 36 passed / 2 skipped** after all Exams/Study/segmentation changes |

## Current gate state (HEAD `2164595`, 2026-08-25)

- **build** PASS · **data tests** 37/37 · **AI unit tests** 27/27 · **behaviour** 36 passed / 2 skipped.
- **lint** now **PASSES — 0 errors** (`e27e94c`→`b3a3bf4`): the genuine no-dupe-keys bug fixed, dead code removed, and dev-tooling/legacy-reference debt scoped-exempt with rationale; 6 non-blocking exhaustive-deps warnings remain. Dimension H lint is closed.
- **deterministic QA / visual regression**: last full run at the IP-01 checkpoint (production 0 blocking); not re-run since the Study/Exams data changes (no production-surface geometry changed, but a fresh QA + VR pass belongs in IP-07/IP-09).
- Working tree clean; every increment committed.

## Additional convergence increments (2026-08-25)

| Commit | Package | Change | Evidence |
|---|---|---|---|
| `6d720ce` | IP-04 R-016 exams | Exam grading honest via the exam service; no fabricated `%`; honest ungraded state; seed `82%` removed. | in-browser: no fabricated score anywhere; behaviour updated + green |
| `e27e94c` | IP-08 R-021 | Production entry is V2 Project Home; empty/unknown URLs → V2, only explicit legacy hashes → reference app; 7 Lab/Dashboard routes gated out of production (`import.meta.env.PROD`). | in-browser: root + unknown → V2, `#home` → legacy; behaviour 36/2; build PASS |
| `b3a3bf4` | IP-09 lint | Lint gate clean (0 errors, was 21). | `npm run lint` exits 0; build/data/AI green |
| `bb6cb86` | IP-06 R-019 | Top-level ErrorBoundary + storage schema/version validation with quarantine (corrupt/wrong-shape/future-version state is set aside, recoverable, and the app continues from empty). | data 39/39; behaviour 36/2; in-browser: injected corrupt state → app renders normally, state quarantined, no blank crash |
| `9016d65` | IP-07 R-020 | Projects mobile overlap at 390 fixed: alignContent-start on the stretched grids, flex-column workspace with flexShrink:0 regions, companion hidden at ≤560. | in-browser 390: hero/summary/rail/detail stack, **no overlap** (measured); 1280 editorial layout intact |
| `9016d65` | QA regression | Full deterministic QA after all Study/Exams/routing/responsive/error-boundary changes. | **productionBlocking 0, 0 blank routes, 0 page errors** across all 14 routes; `artifacts/qa/visual-standard.json` @ 2026-08-25T15:03Z |

**IP-08 remaining:** compile the (now-unreachable, lazy) Lab chunks out of the production bundle, and smoke the built `dist` from `/`.
**IP-07 remaining:** Study at tablet-768 (R-013, Submit/Discuss reachability), Segmentation Review @390, Exam Attempt @390, and a mobile global-navigation replacement.

**Standing limitation (not a RED blocker):** this environment has no Gemini key and no network to Google, so IP-03/04/05 AI paths are proven by unit tests + the honest-unavailable branch in-browser; live end-to-end AI output is verifiable only by the product owner with a key.
