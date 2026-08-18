# Arapal — Public Release Visual Refinement Pass

## Goal

Perform a final desktop visual/product refinement pass across the supplied Arapal screenshots.

This is **not** a request to mechanically reproduce individual design comments. The findings below are evidence of where the product is still falling short of public-release quality.

Use your understanding of the repository, application architecture, shared components, design tokens, workflows and responsive behaviour to identify the underlying cause and implement the strongest maintainable solution.

The standard is:

> If these exact screens appeared unchanged in an App Store listing, professional review, customer demonstration or major-company product launch, would they look coherent, intuitive, intentional, polished and finished?

A screen being functional or attractive is insufficient.

Do not redesign successful areas unnecessarily. Do not introduce visual novelty merely to demonstrate improvement.

---


# STAGE 0 — DESIGN & SHELL FOUNDATIONS AUDIT

Before applying screen-level fixes, audit whether Arapal has a coherent, authoritative foundation for its visual system and application shell.

The current screenshots show repeated evidence that some screens are bypassing or diverging from shared foundations. Do not patch those symptoms locally if the underlying system is incomplete, duplicated or inconsistently used.

## 0.1 Design foundations

Inspect whether authoritative shared definitions already exist for:

- typography;
- font families;
- font sizes;
- font weights;
- line heights;
- semantic text roles;
- pills;
- badges;
- filters;
- buttons;
- icon sizing;
- spacing;
- radii;
- colours;
- borders;
- shadows;
- layout primitives;
- content widths;
- pane widths;
- responsive breakpoints.

If these foundations exist:

1. determine whether they are actually appropriate for the intended Arapal product;
2. identify screens/components that bypass them through local CSS, duplicated components, arbitrary values, legacy styles or one-off overrides;
3. migrate those usages back onto the shared system where appropriate;
4. remove redundant local implementations where doing so is safe and maintainable.

If the foundations are incomplete or internally inconsistent, improve them before standardising the app around them.

Do not standardise bad defaults merely because they already exist.

## 0.2 Typography semantics

Define and verify the intended semantic typography roles across the app, including at minimum:

- product identity;
- display/hero heading;
- page title;
- section title;
- card title;
- body;
- supporting body;
- Arabic/source text;
- translation text;
- metadata;
- uppercase/letter-spaced labels;
- buttons;
- pills/badges;
- filters;
- counters/status text.

The objective is not that every screen uses the same font size. The objective is that equivalent semantic roles use the same intentional system, and that differences are justified by function.

Audit the whole application for violations.

## 0.3 Pills, badges and compact controls

Define legitimate variants by semantic role, for example:

- filter;
- status;
- metadata;
- count;
- mode selector;
- navigation;
- action control.

These variants may differ, but they must clearly belong to the same Arapal design system.

Audit the whole app for:

- inconsistent heights;
- inconsistent radii;
- inconsistent typography;
- inconsistent horizontal padding;
- inconsistent icon sizing;
- arbitrary local colours;
- one-off borders;
- unrelated hover/selected behaviour.

The current Research and Exams examples should be treated as evidence of a wider system problem unless investigation proves otherwise.

## 0.4 Shared application shell and navigation foundations

Audit whether Arapal has one coherent shared foundation for:

- top application bar;
- top-bar height;
- vertical centring;
- title alignment;
- back control placement;
- left/right top-bar actions;
- mode controls;
- global LHS navigation;
- navigation width;
- logo/product identity placement;
- top-bar-to-navigation relationship;
- page content offset;
- page shell/container alignment;
- top-bar-to-content spacing;
- responsive behaviour.

No page should independently decide where its back button, title, top actions, nav rail or header content sit unless there is a documented product reason.

Treat the following as verified examples of divergence:

- Exams uses a materially different top-bar composition and positioning for its back pill and actions.
- Segmentation / Source Intake has top-bar content that is not vertically centred; text visually collides with the lower boundary.
- The Arapal logo/identity currently sits within the LHS navigation rail rather than the far-left of the application header.
- Other screenshots show different shell/header relationships between major product areas.

Investigate whether these differences come from:

- multiple shell/header implementations;
- page-specific wrappers;
- duplicated navigation components;
- local positioning overrides;
- legacy layouts;
- inconsistent padding/height tokens.

Where possible, consolidate onto shared shell/header primitives with intentional variants only where the workflow genuinely requires them.

## 0.5 Foundation-first implementation rule

Before implementing each screen-level finding below, ask whether correcting the shared foundation would resolve it across multiple screens.

Prefer:

- one correct typography role over multiple local font-size fixes;
- one correct filter component over multiple pill restyles;
- one correct top-bar primitive over per-page alignment fixes;
- one correct application-shell relationship over repeated logo/nav positioning patches.

After foundation changes, render all affected screens again before proceeding. Foundation changes may fix multiple findings automatically or expose regressions elsewhere.

### Stage 0 exit criterion

Do not proceed as though this stage has passed until:

- the current design foundations have been identified and assessed;
- inappropriate or incomplete foundations have been corrected;
- known bypasses/legacy divergences have been identified;
- shared shell/header/navigation primitives are coherent;
- equivalent semantic roles demonstrably use the intended shared system;
- the affected screens have been re-rendered and visually checked for regressions.

---

# P0 — PUBLIC-RELEASE ISSUES

## 1. Cross-product visual coherence

The application has a strong underlying visual identity, but individual areas still sometimes look as though they were designed by different teams.

This is particularly apparent between:

- Exams
- Projects / Project Home
- Research
- Study
- Source Intake

Differences exist in:

- typography;
- heading scales;
- pill/badge typography and sizing;
- button/control treatment;
- spacing systems;
- content density;
- page composition;
- navigation treatment;
- content widths;
- use of serif/display typography;
- sparse versus dense layouts.

Some variation is appropriate because these are different workflows. Do **not** homogenise them.

Instead, distinguish intentional workflow differences from accidental design-system divergence.

Audit the shared shell, tokens and components and fix divergence at the correct abstraction level.

### Acceptance criterion

Moving between these areas should unmistakably feel like moving between different functions of one mature Arapal product.

---

# 2. Exams — visual language has diverged

The Exams screen is currently one of the clearest examples of cross-product inconsistency.

Its fonts, typography scale, pills, controls and overall visual grammar feel materially different from the rest of Arapal.

Do not simply make individual elements smaller.

Investigate whether this page has:

- local typography overrides;
- bespoke pill/badge implementations;
- duplicated components;
- inconsistent tokens;
- unique spacing rules;
- legacy styles;
- page-specific CSS that has diverged from the design system.

Bring it back into the Arapal family while preserving the purpose of the Exams experience.

---

# 3. Exams — information architecture is repetitive

The page simultaneously presents:

- Next Assessment;
- Prayer foundations checkpoint;
- Start Exam;
- Ready to Take: 1;
- Saved Exams;
- Prayer foundations checkpoint again;
- Open Exam.

The user can work it out, but a polished product should not require them to reconcile multiple representations of effectively the same current assessment.

Re-evaluate the screen around three recurring jobs:

1. take the next useful assessment;
2. create/manage assessments;
3. review completed assessments/performance.

Remove semantic duplication where it provides no user value.

Also reconsider whether the very large “Build focused assessment loops” treatment is appropriate for a repeatedly used operational screen. It currently has some characteristics of a marketing hero rather than an application workspace.

Preserve visual character without sacrificing operational clarity.

---

# 4. Exams — vertical rhythm is visibly broken

There is almost no gap between the first major assessment card and the statistics row beneath it.

The gap between that statistics row and the lower exam-management section is substantially larger.

The result is ambiguous grouping:

- rows 1 and 2 appear accidentally fused;
- row 3 appears disproportionately disconnected.

Do not blindly make all gaps identical.

Determine the intended grouping hierarchy and establish deliberate, optically balanced spacing between related and unrelated regions.

Inspect the whole page for similar rhythm inconsistencies.

---

# 5. Projects — master/detail composition does not land correctly

The problem is not simply that the right side is “too wide.”

The LHS project/lesson area behaves like a narrow secondary sidebar while the RHS occupies an enormous dominant canvas.

However, the current RHS content does not possess enough visual mass or purpose to justify that dominance.

Consequently:

- the LHS feels squeezed;
- the RHS feels oversized;
- the separation does not read strongly enough as an intentional master/detail relationship;
- the overall screen feels compositionally unbalanced.

Review:

- pane proportions;
- minimum/maximum widths;
- content density;
- visual separation;
- whitespace;
- optical balance;
- responsive behaviour.

Do not solve this merely by changing a percentage width. Determine what relationship the two areas are supposed to communicate and make that relationship visually convincing.

---

# 6. Project Home empty state feels unfinished

“Add your first source” and its primary CTA are understandable.

However, the content occupies a very small region in the upper-left of an enormous application viewport.

The result risks looking like:

- content has failed to load;
- the application is unfinished;
- there is little product behind the first action.

Recompose this as a genuinely excellent first-run experience.

Requirements:

- Add Source remains unquestionably primary;
- sample exploration remains secondary;
- first-time purpose is immediately understandable;
- enough of the future product journey is communicated to establish value;
- the viewport feels deliberately composed;
- do not fill the screen with arbitrary dashboard widgets.

Use product judgement rather than simply enlarging the current content.

---

# 7. Global shell — Arapal identity belongs in the top-left application header

The Arapal logo/identity currently occupies the top of the narrow LHS navigation rail.

This weakens the distinction between application identity and navigation.

Move the Arapal identity to the far-left of the top application bar, analogous to the shell relationship used by products such as ChatGPT.

The vertical navigation should then visually begin beneath the application header.

Treat this as a shell-level correction, not a one-screen patch.

Verify the result across every screen using the shared shell.

---

# 8. Research — filter pills visibly belong to a different component family

The filter pills:

- Needs revision
- No translation
- Vocab rich
- City terms

use typography and sizing that are conspicuously different from pill/badge treatments elsewhere in Arapal.

They currently look like controls imported from another interface.

Determine the correct semantic component role and reconcile them with Arapal's shared typography/control system.

Do not blindly force them to match status badges if filters legitimately require a distinct component. They may be different, but they must still clearly belong to the same design system.

---

# P1 — CORE WORKSPACE QUALITY

## 9. Study — translation composer should anchor the working canvas

The fundamental Study hierarchy is successful:

source → support → translation → submit.

However, the EN Translation composer currently floats directly beneath Quick Lexicography while a very large unused area remains below it.

This makes the central workspace feel top-heavy and underutilised.

The translation composer should visually anchor the lower portion of the main working canvas rather than appearing as another card in a vertical stack.

Implement this responsively.

Do not hard-code a Y coordinate or simply add a giant margin.

Test with:

- short source text;
- medium source text;
- long source text;
- varying viewport heights.

The working area should remain natural under all of them.

---

# 10. Study — collapsed RHS support rail needs deliberate composition

When the RHS support area is collapsed, its cards currently reduce to small icons positioned near the corner/top.

Functionality technically remains, but the collapsed state loses the strong architecture of the expanded panel and looks incidental.

The collapsed rail should use its available vertical area deliberately.

For example, if three support tools exist, each could occupy approximately one third of the usable rail height, with appropriate padding/separation.

That example is directional, not a literal specification.

Design robust behaviour for different numbers of available support modules.

Requirements:

- generous click targets;
- clear module identity;
- strong vertical composition;
- intentional distribution;
- appropriate hover/active state;
- clear relationship to the expanded modules.

The collapsed state must look deliberately designed, not like an expanded sidebar whose content has merely been hidden.

---

# 11. Study — expand/collapse affordance is unclear

The current RHS expand control does not sufficiently communicate what will happen when it is activated.

A user should be able to predict that the control expands/collapses the support workspace before clicking it.

Review:

- iconography;
- positioning;
- hover state;
- tooltip where appropriate;
- relationship to the panel boundary;
- consistency with other expandable areas.

Do not add explanatory UI if a better affordance solves the problem more elegantly.

---

# 12. Study — central workspace utilisation

Study is one of Arapal's core experiences and should feel like a serious intellectual working environment.

Currently, much of the desktop viewport can become unused while the actual source/translation work occupies a relatively shallow upper region.

Address this alongside the translation anchoring issue.

Do not add arbitrary content.

Make the existing work naturally occupy and respond to the available canvas.

---

# 13. Source Intake — source typography is anomalously small

The pasted source text is dramatically smaller than comparable primary reading/source content elsewhere in Arapal.

This is particularly conspicuous because the source itself is the principal object on this screen.

Audit the semantic typography role of source content across:

- Source Intake;
- Study;
- Research;
- any review/segmentation states.

Create appropriate consistency while recognising that a long paste field may require different density from a study reading card.

The current difference is too large to feel intentional.

---

# 14. Source Intake — visual ceremony should be audited

The workflow itself is immediately understandable, which should be preserved.

However, a simple task currently uses many simultaneous devices:

- global stepper;
- page title;
- Source + Segmentation pill;
- editor-window chrome;
- decorative corner brackets;
- Preserved Source badge;
- segmentation-mode descriptor;
- large CTA;
- supporting explanation.

Determine which elements materially improve:

- comprehension;
- source-safety confidence;
- workflow orientation.

Reduce only what does not earn its visual attention.

Preserve the important Source → Review → Publish mental model.

---

# 15. Research — preserve capability but improve attention hierarchy

Research is one of the strongest current screens and should **not** receive a broad redesign.

It demonstrates that Arapal can successfully support a sophisticated professional knowledge interface.

However, many layers compete simultaneously:

- global rail;
- research navigation;
- revision queue;
- project header;
- metrics;
- search;
- filters;
- ledger;
- selected row;
- inspector;
- inspector actions.

Perform an attention-hierarchy audit.

When a segment is selected, the current object and likely next action should dominate appropriately.

Secondary navigation and aggregate information should remain accessible without competing equally for attention.

Preserve useful density.

---

# P1 — DESKTOP COMPOSITION

## 16. Sparse screens use too little of the viewport

Several screens use the large desktop canvas beautifully as atmosphere, but occasionally cross the line from intentional restraint into apparent emptiness.

This is most evident in:

- Project Home;
- Study;
- some Projects states.

Preserve Arapal's breathing room and distinctive background.

Do not fill space merely because it exists.

Instead, ensure sparse states look intentionally composed at realistic desktop widths.

---

# 17. Decorative background must remain subordinate

The oversized translucent Arapal typography and diagonal line system are distinctive and worth preserving.

Audit their use across screens for:

- repetition fatigue;
- competition with primary content;
- collisions;
- awkward cropping;
- unintended visual tangencies;
- inconsistent opacity/prominence.

These elements should create identity without becoming the strongest visual object on operational screens.

---

# P1 — DESIGN-SYSTEM AUDIT

The screenshots reveal several cases where components that perform related roles appear subtly unrelated.

Audit—not merely these examples, but the system itself—for:

### Typography
- serif/display usage;
- page titles;
- working titles;
- body text;
- Arabic/source text;
- labels;
- metadata;
- uppercase letter-spaced labels;
- pill text;
- button text.

Some tiny uppercase/letter-spaced metadata is approaching insufficient prominence/legibility.

### Pills and badges
Review:
- filters;
- statuses;
- metadata;
- counts;
- mode selectors;
- navigation pills.

Different semantic roles may require variants, but the variants should clearly share DNA.

### Buttons
Audit:
- height;
- radii;
- typography;
- icon sizing;
- icon placement;
- primary/secondary hierarchy;
- padding;
- hover/focus/disabled states.

### Spacing
Look specifically for optical rhythm rather than merely token compliance:

- card-to-card gaps;
- section separation;
- internal padding;
- heading-to-body spacing;
- controls that appear accidentally attached;
- controls that appear disconnected from their owner.

A mathematically token-compliant screen can still be optically wrong.

---

# P1 — NAVIGATION COHERENCE

Review the complete navigation model across these screens.

The application currently uses combinations of:

- top application bar;
- LHS global rail;
- page-specific sidebars;
- project selectors;
- Back;
- Project Home;
- mode selectors;
- Study Mode;
- Focus View;
- Study History.

Verify that a first-time user can build a stable mental model of:

- where they are;
- what level of the application they are in;
- how to go back;
- how to switch major modes;
- what navigation persists;
- what navigation belongs only to the current workspace.

Do not solve this by adding labels everywhere. Prefer coherent architecture.

---

# P1 — MOTION REGRESSION

## 18. Restore the Arapal entry animation if it has regressed

The application previously had an entry animation that materially contributed to the product's character and perceived polish.

It appears to have been lost.

This cannot be verified from static screenshots, so treat it as a **reported regression**, not screenshot-confirmed evidence.

Locate the previous implementation/history before designing anything new.

If the animation was intentionally part of the Arapal experience and its removal was accidental, restore it.

Requirements:

- polished rather than theatrical;
- performant;
- does not delay useful interaction;
- consistent with current visual identity;
- honours `prefers-reduced-motion`;
- does not replay annoyingly during ordinary navigation if that was not the intended behaviour.

Do not invent a replacement until you have investigated what existed previously.

---

# P2 — PROFESSIONAL VISUAL QA

After implementing the explicit findings above, independently inspect every affected screen.

The supplied findings are **not an exhaustive checklist**.

We have specifically identified subtle issues such as:

- optically incorrect pane proportions;
- inconsistent gaps between card rows;
- one family of pills using visibly alien typography;
- a workspace floating vertically despite being technically aligned;
- collapsed controls occupying the wrong visual position;
- primary content typography being anomalous relative to the rest of the product.

Use these examples to calibrate the required level of scrutiny.

Look for additional instances of the same class of problem.

Inspect:

- alignment;
- optical alignment;
- symmetry where appropriate;
- intentional asymmetry;
- spacing rhythm;
- hierarchy;
- density;
- pane proportions;
- visual weight;
- typography;
- colour;
- contrast;
- radii;
- iconography;
- component consistency;
- clipping;
- overflow;
- awkward wrapping;
- empty states;
- realistic populated states;
- hover;
- focus;
- selected;
- disabled;
- expanded;
- collapsed;
- loading;
- error;
- responsive behaviour.

The governing test is:

> Is anything visibly out of place that an experienced product designer, creative director or demanding customer would notice?

---

# IMPLEMENTATION METHOD

For each finding:

1. Inspect the repository before changing the UI.
2. Determine whether the defect is local, component-level, token-level, shell-level or architectural.
3. Fix it at the highest appropriate reusable abstraction.
4. Avoid regressions to already-successful screens.
5. Use realistic fixture/content lengths rather than only convenient screenshot data.
6. Render the affected screens at the target desktop viewport.
7. Inspect the actual rendered output visually.
8. Compare against the intended product outcome, not merely whether the requested code was written.
9. Check related screens/components for regressions.
10. Iterate if the first result remains optically wrong.

Do not mark a finding complete simply because its implementation task completed.

---

# IMPORTANT JUDGEMENT RULE

These comments describe observed product problems, not mandatory implementation prescriptions.

Where a proposed solution is directional—such as pane proportions, bottom anchoring or vertically distributing collapsed support tools—use your product and engineering judgement to find the best implementation.

If following a comment literally would produce a worse product, solve the underlying problem instead and record why.

Conversely, do not use “design judgement” as justification for leaving a clearly observed defect unresolved.

---

# RELEASE VERIFICATION

Before declaring this pass complete, produce a concise verification ledger for every numbered finding:

- **PASS** — visually resolved and verified;
- **PARTIAL** — improved but still below release bar;
- **BLOCKED** — cannot currently resolve, with evidence;
- **NOT REPRODUCED** — reported issue could not be reproduced.

For PASS items, state what rendered evidence was inspected.

Also report any **new visual defects discovered during the pass**, even if they were not listed here.

## Final exit criterion

Do not ask:

> “Did I implement all 18 requests?”

Ask:

> “Would I now be comfortable shipping these exact rendered screens publicly, unchanged, knowing they may appear in reviews, App Store imagery, demonstrations and customer screenshots?”

If the answer is no, the pass is not complete.
