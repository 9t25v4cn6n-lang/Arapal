# Arapal — V1 Release Contract

## 1. Mission

Arapal V1 is complete when the **current production surface** is a coherent, trustworthy, professionally finished study product that a user can use end-to-end without prototype artefacts, silent state loss, misleading behaviour or visibly unfinished design.

The release objective is **not**:
- zero historical findings;
- a vanity quality score;
- pixel reproduction of Figma;
- arbitrary geometry compliance;
- maximal code cleanup;
- maximal feature count.

The release objective is a credible public product.

---

# 2. V1 scope

The currently established V1 production surface is:

- Project Home
- Projects
- Project Research
- Source Intake / Segmentation
- Study Workspace
- Exams
- the required navigation and contextual handoffs between them
- required mobile/narrow-screen behaviour, including the established 390px V1 target

Legacy surfaces are reference/behaviour sources only unless current evidence proves a production dependency remains.

No new major product capability is added merely because it would be useful. A missing capability is in V1 only when it is necessary to make the established Arapal workflow truthful, coherent, recoverable or releasable.

---

# 3. Authority and evidence

When sources disagree:

1. **This contract defines the release outcome.**
2. Explicit, current product decisions define intended semantics.
3. The running product and exact repository commit define current implementation reality.
4. Executable tests, screenshots, browser measurements and release artefacts define evidence.
5. Figma provides design evidence and alternatives, not automatic authority.
6. Historical audits/checklists provide leads, not current status.

Every material claim is one of:
- **VERIFIED**
- **REASONED INFERENCE**
- **ASSUMPTION**
- **UNKNOWN**

Unknowns are not silently converted into passes.

---

# 4. Release dimensions

## A. Scope and product value

A first-time and returning user can understand:
- what Arapal is asking them to do;
- what project/context they are in;
- where they left off;
- what needs attention;
- what the next meaningful action is.

The product does not expose incomplete destinations, dead controls, misleading affordances or unexplained developer concepts.

### Pass evidence
- V1 surface inventory tied to current routes;
- first-run and returning-user journeys demonstrated;
- no required V1 screen is a scaffold/placeholder;
- no out-of-scope legacy/dev surface is accidentally presented as production.

---

## B. Critical journeys

The product must work as journeys, not isolated screens.

At minimum verify:

1. **First use**
   `enter → create/select project → add source → segment → approve/publish → Study`

2. **Return to work**
   `leave/close/reload → return → correct project/segment/draft/state restored`

3. **Study loop**
   `read source → translate → submit → understand outcome → continue or repair`

4. **Research loop**
   `browse/search → select/inspect → open Study → context/provenance retained`

5. **Exam loop**
   `create/select assessment → attempt → autosave/reload → results → remediation → Study`

6. **Failure/recovery**
   relevant network/evaluation/data failure → comprehensible error → safe retry/recovery

7. **Context isolation**
   switching projects/segments/attempts never leaks another context's state.

### Pass evidence
Automated journey coverage where practical plus at least one clean end-to-end candidate run.

---

## C. Functional and data integrity

Required product state:
- has clear ownership;
- persists where the product claims it persists;
- does not leak between project/segment/assessment contexts;
- survives expected navigation/re-entry;
- is not fabricated or labelled in a way that overstates reality.

No UI may claim "saved", "graded", "evaluated", "reference", "best", "complete" or equivalent unless the underlying behaviour supports that claim.

### Pass evidence
State/persistence tests, reload tests, cross-context isolation tests, honest failure behaviour.

---

## D. AI and linguistic quality

Where Arapal uses AI/model-generated behaviour, the model boundary is treated as product functionality, not decoration.

Verify where applicable:
- the user can distinguish generated/uncertain output from authoritative stored data;
- hallucinated/fabricated artefacts are not presented as fact;
- malformed, short, long and Arabic-heavy inputs fail safely;
- Arabic/RTL text is not degraded by Latin-only assumptions;
- timeout/unavailable/error paths are recoverable;
- repeated runs are acceptably stable for the intended task;
- model/prompt changes can be evaluated against a small representative corpus;
- cost/latency limits do not create broken journeys.

### Pass evidence
A representative AI-quality evaluation set or an explicit documented reason why a given V1 path is deterministic/stubbed instead.

If real AI grading/evaluation semantics are not yet product-defined, do not invent them silently. Treat that as a RED product decision.

---

## E. Product comprehension and usability

Every screen must make its purpose and next action clear without requiring repository knowledge.

Review:
- task clarity;
- primary-action clarity;
- terminology consistency;
- information timing;
- unnecessary steps;
- discoverability;
- feedback after actions;
- empty/loading/error/recovery states;
- whether secondary tools obscure the main job;
- whether navigation matches the user's mental model.

### Pass evidence
Fresh-eyes product review plus clean-room journey run.

---

## F. Visual fit and professional quality

The rendered product must withstand professional design scrutiny.

It must feel:
- calm;
- premium;
- scholarly/editorial;
- structurally stable;
- intentional;
- coherent across modes.

No visibly accidental misalignment, clipping, awkward termination, inconsistent component treatment, poor rhythm, hierarchy failure or prototype residue survives merely because code and tests are valid.

Use `ARAPAL_VISUAL_PRODUCT_STANDARD.md`.

### Pass evidence
Rendered-state review across canonical states/viewports, with before/after evidence for material changes and no unresolved P0/P1 visual findings.

---

## G. Accessibility and responsive behaviour

Required:
- semantic landmarks and sensible heading structure;
- accessible names for controls;
- keyboard access and visible focus;
- no inaccessible critical workflow;
- appropriate contrast;
- reduced-motion behaviour where motion exists;
- Arabic direction/script handling;
- critical workflows usable at the supported viewport contracts, including the V1 mobile target.

Use standards such as WCAG as objective floors, not as the definition of good UX.

### Pass evidence
Automated checks where useful plus keyboard/rendered inspection.

---

## H. Engineering quality

The candidate must have:
- clean production build;
- no unexplained runtime/page errors;
- tests protecting critical behaviour;
- no accidental duplicate/dead production routes;
- maintainable shared primitives where drift would otherwise recur;
- no high-risk known code defect hidden by disabled rules;
- production/dev separation;
- reasonable dependency and bundle hygiene;
- recoverable failure boundaries where failure is plausible.

Technical debt may remain only when its release risk is understood and explicitly accepted.

### Pass evidence
Exact-commit build/test/lint/QA results with remaining exceptions justified individually.

---

## I. Security, privacy and data protection

Before public release inspect, as applicable:
- secrets and environment configuration;
- client exposure of credentials;
- user/project data isolation;
- authentication/authorization assumptions;
- storage of user content;
- logging of sensitive text;
- dependency vulnerabilities;
- unsafe HTML/content rendering;
- destructive actions and data loss;
- privacy/retention implications of external AI services.

Do not claim this dimension passes merely because the application has no authentication today. Confirm the actual deployment/data model.

### Pass evidence
Current architecture/threat review and explicit disposition of material findings.

---

## J. Performance, reliability and compatibility

Test realistic rather than toy conditions:
- long Arabic source;
- many segments/items/projects where the UI supports them;
- reload/re-entry;
- slow/error responses;
- supported browsers;
- representative desktop/mobile widths;
- route loading and major bundle behaviour.

The product must degrade deliberately rather than silently clipping, freezing or losing work.

### Pass evidence
Targeted stress/compatibility checks and no material unowned failure mode.

---

## K. Release and operations

A candidate is an exact commit, not a feeling.

Before release:
- clean production build from clean checkout/worktree;
- all release gates run in one coherent candidate state;
- release evidence tied to commit SHA;
- production routes/config verified;
- no accidental test/sample/dev overlays;
- deployment procedure known;
- rollback path known;
- material monitoring/error visibility known;
- post-release triage path known.

### Pass evidence
One release evidence package for the nominated commit.

---

# 5. Severity

## P0 — Release blocker
Data loss/corruption, unusable core journey, critical security/privacy issue, materially false product behaviour, crash/blank route, severe accessibility barrier, catastrophic responsive failure.

## P1 — Clear release-quality defect
A professional reviewer/customer would reasonably judge the product unfinished, inconsistent, confusing or unreliable; important but non-catastrophic functional defect.

## P2 — Meaningful refinement
Improves polish/usability but the product remains credibly releasable without it.

## P3 — Backlog / opportunity
Useful future work, no current release case.

Taste alone is not severity.

---

# 6. Release states

Only:

## RELEASE CANDIDATE
All knowable implementation/design work necessary for credible V1 release passes this contract. Remaining uncertainty is primarily real-world user evidence or explicitly accepted low-risk limitations.

## NOT RELEASE READY
List concrete blockers, evidence and next action.

Do not use a composite score.

---

# 7. Final questions

Product authority:

> Would I approve these exact rendered states and journeys for public launch, customer demonstration and professional review unchanged?

Engineering authority:

> Would I be willing to own the production consequences of shipping this exact commit?

Both must be yes.
