# Arapal — Release Convergence Execution Plan

**Purpose:** execution instructions for a high-capability coding model operating with full repository access and the Arapal Figma connection.

**Mode:** execute autonomously. This plan is tuned for **Claude Opus 5 in Claude Code with Ultracode + Fast mode**. Do not spend the window rewriting the plan, re-auditing decisions already settled, or building process for its own sake. Respect dependencies and objective quality gates, but otherwise keep moving toward the release-candidate condition.

---

## 0. Recommended Claude Code runtime

Use the **latest Claude Code version** before the run. Opus 5 itself requires v2.1.219+, and this plan assumes current Claude Code features such as Ultracode and `/goal`. Start the high-capability window with the model and orchestration mode selected explicitly rather than relying on inherited defaults:

```bash
claude update
claude --model claude-opus-5 --effort ultracode
```

If routine permission prompts would otherwise interrupt the autonomous run, use Claude Code **Auto mode** (for example `--permission-mode auto`, where available/configured). Prefer Auto mode over bypassing permissions entirely. Do not deploy, publish, or perform irreversible external actions unless the existing project instructions explicitly authorize them.

Then, in the interactive session:

```text
/fast
/goal Reach RELEASE CANDIDATE according to ARAPAL_RELEASE_CONVERGENCE_PLAN.md. Continue executing autonomously until every applicable release gate is evidenced, or a genuine external/RED blocker makes completion impossible.
```

Operating intent:

- **Ultracode owns workflow orchestration.** Do not pre-create a large fixed team merely because this document names workstreams.
- **Fast mode is preferred for this window.** It changes speed, not the product-quality standard.
- Give Opus the **complete task specification up front and let it run**. Avoid repeatedly re-prompting it with micro-instructions unless new evidence materially changes the task.
- Do not add legacy prompt instructions such as “double-check everything”, “verify your own work again”, or “spawn a verifier for every task”. Opus 5 already self-corrects strongly; the QA systems in this plan are **external product controls**, not prompts for recursive self-verification.
- Keep user-facing progress updates brief: report only a material finding, blocker, scope change, or integration milestone. Spend tokens on execution, not narration.

---

## 1. Mission — do not optimise for proxies

> **Take the surviving live application, preserve everything already good, systematically fix what is bad, import only superior R3 decisions, complete the missing functionality, and independently raise the whole product to release-candidate quality — under automated controls that prevent improvement work from causing regression.**

The objective is **not** to maximise code changes, minimise a violation count, reproduce Figma, complete a checklist, or finish named work packages. The objective is to minimise the remaining distance between the surviving live Arapal application and a credible release candidate while preserving everything already good.

**Make no change unless it advances that objective.**

---

## 2. Settled context — do not reopen without new evidence

### 2.1 The surviving live app is the implementation baseline

A prior screen-inventory exercise has already identified the useful production implementations and archived obvious dead/duplicate screens. Do not repeat that exercise or rebuild the application wholesale.

Current operating intent:

- **Home:** legacy implementation remains only as a behaviour/reference source until the real target Home is complete.
- **Projects:** keep the selected V2 implementation.
- **Source intake / Segmentation:** keep the selected V2 screens; legacy segmentation remains temporarily because it contains real splitting/options behaviour that must be ported first.
- **Study:** keep the selected V2 Study implementation; legacy Study remains temporarily because it contains discussion/support/pass-fail behaviours that must be ported first.
- **Research:** keep the selected V2 implementation.
- **Exams:** preserve the working legacy capability until the V2 replacement has genuine parity; never archive working behaviour merely because a newer route exists.
- **Developer surfaces:** keep as development tooling but exclude from production where appropriate.

If the repository has moved since these decisions, inspect the running app and current archive/route metadata to verify the exact present state before acting. Do not infer from filenames alone.

### 2.2 Figma R3 is an improvement source, not a reconstruction target

The Figma file is `VwzaUb5YtAonCnMVMRmvmd` (AraPal-Rebuild).

Its history matters:

- Reconstruction: attempted recreation of the application in Figma; not authoritative.
- Polished: visual cleanup.
- R2: improvement toward a real application.
- **R3: latest and strongest design exploration overall.**

However, **newest does not automatically win**. Preference is state/frame-specific. A known example is **Research Browse**, where the earlier R2 treatment is superior to R3 because it gives the ledger useful width rather than reserving empty space.

Governing rule:

> **Preserve good live UI by default. Use R3 to identify demonstrably superior decisions. Import the decision, not the pixels.**

Figma is valuable for:

- information architecture;
- composition;
- hierarchy;
- semantic use of colour/type;
- stronger empty/loading/success states;
- navigation ideas;
- clearer primary actions;
- screen/state concepts missing in live.

Do **not** copy fixed measurements merely because they exist in Figma. Centring, spacing, container sizing, overflow, responsiveness and collision avoidance should be **derived correctly in code through shared layout/component rules**.

### 2.3 Behaviour authority

Where the live application contains working behaviour that Figma cannot express, **the running product is the behavioural authority** until a demonstrably better replacement exists.

Especially protect:

- segmentation splitting/options;
- Study discussion/support modes;
- pass/fail/repair behaviour;
- autosave/persistence behaviour;
- search/filter behaviour;
- Exam → Study contextual handoff;
- state carried between screens.

Never delete a behaviour-bearing legacy source before its behaviour is characterised, ported and verified.

---

## 3. The three tracks

Run all three throughout the programme. None is sufficient alone.

### FLOOR — Is anything objectively broken or inconsistent?

Use deterministic engineering controls to eliminate recurring defects and prevent regression.

### FUNCTION — Does the product actually work end-to-end?

Complete the data/state/persistence/navigation architecture and make the real journeys work, including re-entry, errors and recovery.

### FIT — Is the experience actually good?

Use professional product/design judgement to import superior R3 decisions and improve remaining friction without gratuitous redesign.

**A change is complete only when it survives all three relevant tracks.**

---

## 4. Reuse the existing QA checker — do not replace or worship it

The repository already contains a substantial deterministic QA system. Treat this as foundational work already completed.

Known components include:

- `scripts/qa/standard.mjs`
- `artifacts/qa/baseline.json`
- `npm run qa`
- the existing ratchet / save-hook / pre-commit integration

At the start, verify the current commands/config rather than assuming they are unchanged. Historically the save-hook/commit gate required the dev server to be running; if that is still true, keep `npm run dev` running throughout QA execution so the guardrail cannot silently skip.

### Checker rules

1. **Reuse and extend it; do not build a competing checker.**
2. A checker finding is **diagnostic evidence**, not automatically a backlog item.
3. Do not blindly force the accepted baseline count to zero.
4. If many violations share one cause, fix the shared primitive/system.
5. If the rendered product is correct and the rule is wrong, fix the rule.
6. Add a deterministic rule when a repeatable defect is discovered and the rule can reliably encode the underlying principle.
7. Do not encode subjective taste as brittle geometry rules.
8. Checker pass means the **Floor** passed; it does **not** mean the product is good or release-ready.

The existing plan previously used roughly `672` accepted blocking violations after the screen-pruning exercise. Treat that number as historical context only; verify the current state.

---

## 5. AI operating model

Use modern coding models for what they are strongest at: bounded high-agency transformations, parallel investigation/implementation, rapid test-feedback loops and independent critique.

### 5.1 Let Ultracode orchestrate; constrain only where it improves reliability

The main Claude session owns the mission, release criteria, dependency graph, integration order, QA evidence and final release-candidate judgement. **Let Ultracode dynamically choose the workflow for each substantive task rather than forcing a fixed team structure.**

Delegate only when work is both **sizeable and genuinely independent/parallelisable**. Good candidates include disjoint verticals or a broad investigation that can proceed without touching the same implementation files. Do not delegate work that the main agent can finish in a handful of tool calls, and do not spawn subagents merely to re-check or double-check work.

Potential parallel tracks include, when dependencies and file ownership genuinely permit:

- shared design system / shell;
- data/state/persistence;
- Home + Projects;
- Segmentation;
- Study;
- Research;
- Exams;
- journey/regression infrastructure;
- substantive product/visual review passes;
- final hardening.

When multiple agents write code, require **disjoint write ownership**. Do not allow several agents to freely edit the same shared files. Shared route/config/foundation changes should be coordinated centrally or serialised. Use Claude Code worktree isolation for parallel writers when it materially reduces merge risk, and integrate completed work frequently rather than accumulating a single enormous merge.

Avoid deep agent trees and agent proliferation. If parallelism begins creating coordination/merge cost, reduce fan-out rather than adding more orchestration.

Create lightweight version-control checkpoints before high-blast-radius phases and after successful integration gates. The purpose is rollback safety, not ceremony. Never auto-commit broken intermediate states merely to create checkpoints.

### 5.2 Context discipline

Do not flood every subagent with the whole project history. Give each agent:

1. the mission;
2. the settled rules above;
3. relevant current screenshots/runtime evidence;
4. relevant R3 frames only;
5. behaviour/tests that must survive;
6. files it owns;
7. acceptance evidence it must produce.

Repository/runtime evidence outranks stale prose. Prior documents are evidence, not authority.

### 5.3 Use objective gates, not verification theatre

Do not rely on the implementation agent saying its own work is good. Equally, do **not** manufacture redundant “verifier” agents or repeated self-check loops. Quality comes from the independent evidence already built into the product workflow:

- behavioural tests challenge Function;
- the existing deterministic checker challenges encoded Floor rules;
- visual regression exposes unintended rendered changes;
- a substantive visual/Fit review challenges product quality;
- integration tests expose cross-screen/context failures.

A separate reviewer is useful when the review itself is a large, independent task (for example the final cross-product visual/Fit pass), not as a mandatory second opinion after every edit.

### 5.4 Scope discipline

Opus 5 can productively widen a task, but this programme already has a broad mission. Keep expansion bounded to **release convergence for the surviving Arapal product**.

- Make routine judgement calls autonomously.
- Fix adjacent issues when a verified shared/root cause requires it.
- Do not invent new product scope, speculative features, business models or fundamental IA merely because they are conceivable.
- If a materially better approach exists inside the mission, take it and record the decision briefly.
- If two interpretations would lead to materially different product semantics, treat that as RED rather than silently widening the assignment.

### 5.5 Autonomy model

**GREEN — decide and execute without asking**

- objective defects;
- established component/system fixes;
- regression fixes;
- behaviour parity;
- accessibility/resilience improvements;
- established R3 decisions that are clearly superior;
- implementation details/refactors with no product-semantic change.

**AMBER — implement the best-supported answer, record it, continue**

- meaningful but reversible UX refinements;
- new reusable interaction/component patterns;
- non-trivial internal refactors;
- choosing between approximately equivalent implementations.

**RED — preserve current behaviour/state and escalate rather than invent**

- changing what Arapal fundamentally is;
- major unsupported information-architecture or scope change;
- deleting required capability without verified replacement;
- irreversible user-data semantics;
- major product-policy decisions unsupported by existing evidence.

Do not stop for Green/Amber decisions. Avoid recreating the CEO as the routine decision bottleneck.

### 5.6 Communication and artifact discipline

Keep execution narration and written artifacts lean. Do not write long reports, duplicate plans or prose summaries unless they directly enable the work. Prefer executable evidence, diffs, screenshots, test output and concise decision notes.

During the run, surface only:

- a material finding that changes direction;
- a genuine blocker/RED decision;
- an integration milestone;
- final release-candidate evidence.

---

## 6. Execution sequence

Time is not the organising constraint. Assume the high-capability window is long enough to pursue completion. **Dependencies and evidence gates determine order.** Give Opus the whole mission and acceptance standard, then let Ultracode choose efficient parallelism. Prefer steady integrated progress over launching every possible track at once.

### PHASE 1 — Lock regression safety before broad edits

#### Objective
Make it hard for AI-driven improvement work to silently damage what is already good.

#### 1A. Golden screenshot baseline

Capture the **current surviving live application before broad modification**.

Cover all material states, including as applicable:

- Home / returning;
- Home / empty/first-run if currently implemented;
- Projects;
- Segmentation paste/options/processing/review/edit/success;
- Study draft/pass/repair/support/discussion variants;
- Research browse/selected;
- Exams library/builder/attempt/results;
- major error/loading/empty states that already exist.

Capture representative desktop and important narrow widths. Do not create dozens of arbitrary breakpoint snapshots; choose widths that expose real layout contracts.

A golden baseline means **“unexpected differences are detectable”**, not **“these pixels are ideal forever.”** Accepted intentional improvements update the baseline only after review. Never update baselines merely to make tests green.

Stabilise screenshot inputs so the regression suite measures product changes rather than noise: use deterministic fixtures where possible, disable/settle animation for capture, and mask or control genuinely dynamic regions such as timestamps. Do not solve noisy diffs by increasing tolerance until regressions disappear.

#### 1B. Visual regression harness

Prefer Playwright or the repository's existing browser test tooling if present.

Every visual change should support:

`BEFORE → intentional change → AFTER → diff → classify → accept/fix`

Do not optimise for pixel similarity to Figma. Visual regression protects unaffected regions and exposes collateral damage.

#### 1C. Behaviour characterisation tests

Before replacing legacy behaviour, write/extend tests around what currently works, particularly:

- segmentation logic/options;
- Study discussion/support/pass-fail/repair;
- Exam → Study handoff;
- persistence/autosave where present.

This is protection against accidentally “modernising away” working capability.

#### Exit evidence

- current production states captured;
- visual regression executable;
- critical legacy behaviours characterised sufficiently to port safely;
- existing checker still runs;
- no broad product change has occurred before these controls exist.

---

### PHASE 2 — Stabilise the shared system

Run shared foundation work in parallel where file ownership allows.

#### 2A. Design system / shell

Consolidate/fix at the shared cause:

- typography tokens;
- colour/surface semantics;
- spacing/layout contracts;
- radii/shadows;
- buttons and icon buttons;
- fields;
- cards/chips/status treatments;
- panels;
- navigation/header/shell;
- focus/hover/active/disabled/error states;
- scroll/overflow primitives;
- responsive behaviour.

Mechanise safe cleanup (codemods/token replacement/CSS extraction/lint) only where the transformation is reliably verifiable. Do **not** spend premium reasoning capacity hand-editing hundreds of equivalent literals.

Critical rule:

> **Fix one shared cause rather than 37 local symptoms.**

Do not force existing good screens through a new component abstraction if doing so produces unnecessary visual churn. Consolidate where it genuinely reduces drift and risk.

#### 2B. Data/state/persistence/navigation foundation

Establish or finish canonical ownership for the application's real entities/state, including as appropriate:

- project;
- source;
- segment;
- draft/study state;
- discussion/support state;
- assessment;
- attempt/result.

Ensure:

- persistence survives reload/re-entry where product intent requires;
- projects/segments do not leak state into one another;
- contextual navigation carries the right identifiers/state;
- evaluation/AI boundaries are explicit and honest about stubs;
- error/loading states are real rather than decorative.

Reuse proven existing patterns (for example the existing Exam → Study handoff or working persisted segment-state pattern) rather than gratuitously replacing them.

#### Exit evidence

- shared primitives demonstrably reduce systemic defects;
- state architecture supports the critical journeys;
- persistence round-trips correctly;
- no unintended visual regressions across unaffected screens;
- checker does not show new unexplained regressions.

---

### PHASE 3 — Complete the product by vertical journey

Do not treat these as disconnected screen-building exercises. Each vertical must work as part of the product. **Before editing a vertical, inspect and exercise its current running implementation first**; source code and Figma are not substitutes for observing the product.

#### 3A. Home + Projects

Start from the selected live/V2 implementation(s), not a blank rebuild.

Mine R3 for demonstrably superior decisions, especially:

- one clear next action for returning users;
- genuine first-use/empty-state handling;
- clearer project continuation;
- stronger hierarchy/composition.

Preserve existing strengths. Do not import R3 measurements literally.

**Exit:** new/returning user can find or create the appropriate work context, leave and return with correct state.

#### 3B. Segmentation

Start from the selected V2 surface.

Port the real splitter/options behaviour from legacy before archive. Complete the coherent journey:

`paste → configure → process → review → manually adjust → publish → Study`

Verify source text and segmentation state are not silently discarded.

**Exit:** the journey works end-to-end, persists appropriately and legacy segmentation can be removed without capability loss.

#### 3C. Study

Treat Study as the core workspace and give it the highest product/design scrutiny.

Start from the selected live V2 Study implementation. **Do not recreate it wholesale from Figma.**

Port valuable legacy behaviour before archive:

- discussion modes;
- support panel/flyout states;
- pass/fail presentation;
- repair flow;
- segment navigation/context.

Then selectively import superior R3 structural/visual decisions while preserving better live functionality and interaction.

**Exit:** drafting/submission/pass/repair/support/discussion/navigation work coherently and state remains correctly attached to the relevant segment.

#### 3D. Research

Start from the selected live V2 implementation.

Use the best state-specific design evidence, not a “latest always wins” rule.

**Known exception:** use the earlier **R2 Research Browse** concept where it is superior to R3 (full-width ledger / hidden inspector in browse) while using the stronger current design evidence elsewhere.

**Exit:** browse/search/select/inspect/return flows work without lost context, avoid unnecessary truncation/space waste, and remain visually coherent with the wider app.

#### 3E. Exams

Preserve working legacy Exams until replacement genuinely reaches parity.

Complete:

- assessment/library;
- builder;
- attempt;
- persistence;
- results;
- concept/segment review;
- repair → Study contextual handoff.

Port proven handoff behaviour rather than reinventing it.

**Exit:** V2 is demonstrably at least functionally equivalent where required and legacy can be archived safely.

#### Phase 3 integration rule

After each vertical reaches its exit evidence, integrate and run the relevant cross-product checks. Do not allow all vertical agents to accumulate huge independent branches before validating the assembled product.

---

### PHASE 4 — Permanent journey-level regression

This work should begin alongside Phase 3 as verticals become testable; this phase is the integration point where the full product loop is completed and made permanent. Build/finish automated product journeys, not just component tests.

At minimum cover the critical loop:

`Project → Source → Segmentation → Publish → Study → Submit → Pass/Repair → Discussion/Support → Next segment → Exam → Results → Repair in Study → close/reopen → correct state restored`

Also test where relevant:

- back/forward;
- reload;
- switching segments;
- switching projects;
- interrupted workflows;
- empty states;
- errors/retries;
- failed evaluation;
- state isolation;
- context handoffs;
- navigation dead ends.

A journey that technically renders but loses or contaminates state has failed Function.

---

### PHASE 5 — R3 uplift pass: surgical, state-by-state

Only after the relevant live functionality is stable, compare each production state against the relevant R3 state(s).

For each state, inspect:

1. current running implementation;
2. current screenshot;
3. relevant R3 frame(s);
4. known earlier-frame exception(s);
5. actual user job/journey at that state.

Classify candidate changes as:

- **KEEP LIVE** — current implementation is already as good or better;
- **IMPORT R3** — R3 contains a materially superior product/design decision;
- **SYSTEM FIX** — the problem is centring/spacing/sizing/overflow/component drift and belongs in shared code;
- **IMPROVE BOTH** — neither live nor Figma is sufficiently good and a clearly stronger solution can be implemented without changing fundamental product scope;
- **NO CHANGE** — difference is subjective or lacks demonstrated benefit.

Then implement only the justified categories.

Typical **IMPORT R3** candidates:

- stronger information hierarchy;
- clearer primary action;
- better composition;
- useful missing product state;
- better navigation arrangement;
- superior density/readability.

Typical **SYSTEM FIX** candidates:

- centring;
- mismatched navigation sizing;
- inconsistent padding;
- collisions/clipping;
- inconsistent type/control sizing;
- fragile responsive layout.

Never “repair” a systemic code-layout problem by copying a Figma magic number.

---

### PHASE 6 — Independent Fit pass

Now review the coherent running product **without treating Figma as the answer key**.

Use a strong independent product/design critic to ask:

> **If Figma did not exist, what still prevents this from being a first-rate, customer-ready Arapal experience?**

Inspect:

- primary-action clarity;
- unnecessary steps;
- cognitive load;
- information timing;
- discoverability;
- feedback after actions;
- empty/loading/error/recovery states;
- hierarchy and density;
- workflow transitions;
- terminology/copy consistency;
- cross-screen mental model;
- whether secondary workflows obscure the main job;
- whether the product feels coherent rather than assembled from separate screens.

Do not produce a critique report and stop. **Implement high-confidence, reversible improvements that clearly advance the mission.**

Do not redesign simply because an alternative is imaginable. If the benefit is subjective or uncertain, preserve the current good implementation.

---

### PHASE 7 — Controlled professional visual QA

Visual QA is a **gate**, not an editing strategy.

#### Safe loop

`implement coherent change → capture rendered state → compare to BEFORE + design intent → classify finding → fix root cause if genuine → recapture`

Do **not** run an endless loop of “see visual difference → tweak CSS → see new difference → tweak again”.

Treat visual QA as a substantive product-review task, not a reflexive verification loop. It may be performed by the main agent or delegated when the review is large and genuinely independent. Do not spawn a reviewer merely to double-check a small edit. Classify findings before implementation changes.

Required inspection includes, but is not limited to:

- alignment;
- spacing;
- hierarchy;
- symmetry/optical balance;
- collisions;
- clipping;
- overflow;
- typography;
- colour consistency;
- component consistency;
- radii;
- sizing;
- cross-screen consistency;
- responsiveness;
- visual rhythm;
- interaction-state consistency.

Classify findings:

- **P0 — objective breakage:** collision, unreadable content, inaccessible critical action, major responsive failure;
- **P1 — clear professional-quality defect:** obvious misalignment, hierarchy failure, inconsistent component/system treatment;
- **P2 — meaningful refinement:** material polish that improves quality without destabilising the product;
- **Intentional difference:** valid derived/responsive or deliberately better implementation;
- **False positive / taste-only:** do not change.

A visual change must not pass merely because screenshot similarity improved. It passes when the rendered result is professionally resolved **and** Function/Floor remain intact.

---

### PHASE 8 — Cross-product integration and release hardening

A dedicated integration pass must look for issues vertical teams cannot see:

- inconsistent components across screens;
- different spacing/type languages;
- contradictory navigation semantics;
- duplicate primitives;
- terminology drift;
- mismatched error/loading/empty-state patterns;
- incompatible state handling;
- context loss between verticals.

Fix shared causes rather than normalising via local overrides.

Then harden:

- runtime errors;
- build/lint/type issues;
- route integrity;
- dead code;
- production/dev separation;
- code splitting/bundle hygiene where useful;
- keyboard/focus/accessibility basics;
- persistence/recovery;
- responsive behaviour;
- stale dashboards/metrics/config;
- legacy archive only after verified parity;
- dependency/config cleanup where evidence supports it.

Do not perform cleanup solely because something looks old. Remove/change it when it reduces real risk, duplication, confusion or production cost.

---

## 7. Evidence rules for every substantial work package

Do not accept “done”, “looks fixed” or a lower checker count as proof.

Use fast targeted tests/diffs during implementation, then run the broader integrated suite at phase exits. A substantial package should leave the strongest practical evidence available, typically:

- successful build/test command;
- relevant checker result/delta;
- behavioural test or demonstrated journey;
- BEFORE/AFTER screenshot for intentional visual change;
- visual diff/regression result;
- persistence/reload proof where relevant;
- explicit note of any remaining blocker/uncertainty.

Do not create elaborate governance prose for each package. Evidence should be executable or inspectable, not ceremonial.

---

## 8. Known Figma references

Use the connector to inspect the actual current frames rather than relying only on this list. These IDs are navigation aids from the existing project work.

### R3 — Home & Projects

- `259:2533` — Home / Returning
- `259:2559` — Home / Empty / No source
- `259:2585` — Projects / Library

### R3 — Study

Known R3 Study states include draft, pass, focus, repair, support collapsed/floating/fullscreen/expanded/hover, companion variants and global-nav hover. Relevant known IDs include:

- `259:7953`
- `259:8060`
- `259:8176`
- `259:8283`
- `259:8406`
- `259:8514`
- `259:8638`
- `260:1364`
- `260:1487`
- `269:1649`
- `269:1985`
- `270:10919`
- `272:1661`

### R3 — Segmentation

- `259:10050`
- `259:10191`
- `270:376`
- `259:10258`
- `270:11237`
- `322:423`
- `259:10467`
- `259:10098`
- `259:10306`
- `259:10399`

### Research

- R3 selected-state reference: `259:10898`
- **Known better Browse exception:** R2 `243:284`

Do not use R3 Browse merely because it is newer if inspection confirms the known regression remains.

### R3 — Exams

- `259:11541`
- `259:11600`
- `265:10524`
- `259:11708`
- `259:11853`
- `270:10578`

### Foundation references

Earlier Foundation frames can still be useful as design evidence for shell primitives, but never copy their dimensions blindly:

- `214:380` — Nav Rail
- `214:486` — Header Bar
- `214:507` — Body Backdrop
- `214:513` — Panel

---

## 9. What NOT to do

These are explicit anti-patterns derived from prior failed Arapal workflows.

1. **Do not rebuild the surviving app wholesale from Figma.**
2. **Do not assume more recent Figma always means better.**
3. **Do not treat screenshot pixel similarity as the target.**
4. **Do not treat checker violation count as product quality.**
5. **Do not fix hundreds of local instances when a shared primitive is wrong.**
6. **Do not make broad adjacent changes while fulfilling a narrow requirement unless a verified shared cause requires it.**
7. **Do not archive behaviour-bearing legacy code until parity is proved.**
8. **Do not repeatedly ask the CEO to arbitrate routine Green/Amber implementation decisions.**
9. **Do not produce another giant audit instead of implementing high-confidence findings.**
10. **Do not create governance/documentation merely because the plan mentions governance. Reuse existing `DECISIONS.md`, QA contracts and repo documentation where adequate.**
11. **Do not force visual uniformity if it harms the actual workflow. Consistency serves comprehension; it is not an end in itself.**
12. **Do not accept the first functional result. Run professional visual/product critique before declaring the surface complete.**

---

## 10. Release-candidate gate

The orchestrator may declare **RELEASE CANDIDATE** only when the following are evidenced for the current production surface:

| Dimension | Required evidence |
|---|---|
| Floor | Existing deterministic checker runs cleanly against the accepted/updated standard with no unexplained new regressions |
| Regression | Canonical visual regression suite shows no unintended changes |
| Function | Critical product journeys complete end-to-end |
| Persistence | Required state survives reload/re-entry and does not leak across contexts |
| Behaviour parity | Valuable legacy capabilities are ported or deliberately retained with evidence |
| Design uplift | Relevant R3 states were reviewed state-by-state; superior decisions were imported selectively |
| Fit | Independent UX/product critique completed and high-confidence defects resolved |
| Visual quality | Professional rendered-state review passed across canonical states/viewports |
| Integration | Cross-product consistency/context review passed |
| Engineering | Build/runtime/release hardening passed or remaining issues are explicitly justified |
| Unknowns | Remaining blockers/unknowns are explicitly listed rather than hidden by a score |

Do **not** create a vanity composite score.

Final status must be one of:

### `RELEASE CANDIDATE`
All currently knowable repository work required for a credible release candidate is complete to the evidence standard above. Remaining major uncertainty should primarily be real-world user evidence rather than unfinished implementation/design work.

### `NOT RELEASE READY`
List only the concrete remaining blockers, their evidence, and the next action required. Do not hide behind “mostly done”.

---

## 11. Start instruction

Launch using the runtime in **Section 0**, enable `/fast`, and set the `/goal` completion condition. Then inspect the **current running repository state**, existing QA configuration, route/archive metadata and current screenshots so the execution starts from reality rather than stale prose.

Execute the phases above. **Do not return with a rewritten plan. Do not stop after an audit. Do not optimise around an assumed time shortage. Do not create redundant verifier loops. Build, test, inspect, integrate and continue until the release-candidate gate is genuinely reached or a real external/RED blocker prevents it.**
