# Arapal — Product Model and V1 Scope

## Product purpose

Arapal is a focused, serious Arabic/language-study system. It should feel calm, premium, scholarly/editorial, modern, precise and immediately understandable.

The product should feel like one coherent study system with distinct modes, not a chain of unrelated screens.

## Product model

The broader product model captured in the canonical user-journey material has five areas:

1. **Project Home** — stable return point and command centre.
2. **Source and Segmentation** — source preservation, proposal/editing, approval and publishing.
3. **Study Workspace** — stable shell for work on one segment.
4. **Patching** — controlled correction of structure or authoritative outputs.
5. **Exams** — focused assessment linked back into normal remediation.

The same product material also describes **Exports and Settings** as a supporting area.

### V1 release scope

A later durable decision dated 2026-08-16 explicitly defines the V1 production surface as:

- Project Home
- Projects
- Project Research
- Segmentation / Source Intake
- Study Workspace
- Exams
- the navigation, state and handoffs required to make these surfaces work as one product
- mobile/narrow behaviour required by the current V1 release contract

Therefore, for release convergence, the standalone **Patching** and **Exports/Settings** surfaces are preserved as product vision/requirements but are **not assumed to be V1 release surfaces unless current product evidence shows an existing V1 dependency**.

Do not silently expand V1 to implement them merely because older product material names them.

## Core product semantics

These are retained from the canonical user-journey material:

- A **segment** is the stable study unit: compiled source, tracker, anchors and tree position.
- A **current record** is the current authoritative saved outcome for a segment.
- A segment may have at most one current record at a time; segment and current record are not the same object.
- A discussion session ends with exactly one saved summary.
- Multiple summaries for the same segment are valid; multiple summaries for one session are not.
- Discussion summaries attach to `segment_id`; after pass they should also attach to `current_record_id`; around a failed attempt they should attach to `attempt_id`.
- Pass should auto-save; there should not be a second mandatory save action after success.
- Skip-for-now is navigation/defer behaviour, not authoritative study truth.
- Exams assume progressive autosave so work is preserved as the user proceeds.

Any current implementation that differs must be treated as an explicit product decision or a gap—not silently reconciled.

## Core UX rules

### Project Home
Must answer:
- what is active;
- where the user left off;
- what needs attention;
- what they should do next.

A new/blank project should have one obvious primary action.

### Source and Segmentation
- preserve the source before processing;
- AI segmentation is a proposal, not authority;
- manual adjustment is first-class;
- approval/publish is explicit and user-controlled.

### Study Workspace
The main loop is:

`read source → write translation → submit → understand result → continue or repair`

The source is visible immediately, translation remains the dominant action, and help/discussion stays attached to the current segment rather than pulling the user into another product.

### Repair / fail
Failure should shift the same workspace into a bounded repair mode:
- grouped/prioritised issues;
- actionable hints;
- edit and retry;
- optional discussion;
- skip/defer without mutating authoritative truth.

### Discussion
Discussion is contextual:
- side experience by default;
- fullscreen available for longer work;
- closes back to the same segment state;
- exactly one summary saved per session.

### Pass
Passing should:
- save the current record automatically;
- update visible progress;
- reveal only outputs genuinely supported by the evaluation contract;
- present Continue as the primary next action;
- allow post-pass discussion as secondary.

The product must never invent scores, references or claims about user work that have not actually been measured.

### Exams
Exams should support:
- scope selection / preview;
- saved exam;
- focused attempt;
- progressive autosave;
- results;
- misses grouped by segment/concept;
- direct remediation through the normal Study Workspace.

## Core V1 journeys

### J1 — Project bootstrap
Create/open a project and reach a clear Project Home. If no source exists, the next action is unambiguous.

### J2 — Source intake
Paste/label source, preserve it, then choose segmentation or return.

### J3 — Segmentation proposal and approval
Generate or manually define segmentation, review markers against preserved source, approve, compile/publish.

### J4 — Segment selection and navigation
Continue from the recommended segment or browse/filter the tree/branch and open a segment with orientation preserved.

### J5 — Main study attempt
Read Arabic source, write translation, consult attached help, submit in the same workspace.

### J6 — Fail and retry
Enter bounded repair, edit/retry, discuss if needed, optionally defer.

### J7 — Discussion sidecar
Open contextual discussion, close it, auto-save one summary, return to the same work state.

### J8 — Pass and completion
Auto-save valid result, update progress, expose supported outputs, continue or discuss.

### J9 — Previous / next / skip
Navigate predictably within the current branch/context; skip does not mutate study truth.

### J10 — Generate exam
Choose intelligible scope, preview, generate and save.

### J11 — Take exam
Answer inside the app with progressive autosave; submit and save the attempt.

### J12 — Review exam mistakes
Review misses and jump back into affected Study context for remediation.

## Failure/recovery expectations

The historical product model also requires:
- poor segmentation can be manually corrected or rerun;
- structural correction is controlled rather than freeform mutation of authoritative truth;
- a failed discussion reply preserves the user's message and offers retry;
- if save succeeds but status reconciliation lags, the UI states that honestly and withholds unsupported pass-only surfaces.

The exact implementation must be verified against the current V1 architecture.

## Design character

Use:
- strong typography;
- restrained palette;
- disciplined whitespace;
- few strong surfaces;
- clean alignment;
- obvious action hierarchy.

Avoid:
- dense generic-SaaS dashboard treatment;
- many equal-weight mini-cards;
- arbitrary colour;
- decorative noise;
- fragmented interaction grammar.

Beauty comes from composition, hierarchy, typography, spacing and restraint.
