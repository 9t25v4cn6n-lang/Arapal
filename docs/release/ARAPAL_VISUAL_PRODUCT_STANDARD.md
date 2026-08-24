# Arapal — Visual & Product Judgement Standard

## Purpose

This standard exists because automated geometry, token and regression checks can prove many forms of correctness but cannot by themselves decide whether a composition looks intentional, balanced and professionally finished.

It is a **judgement standard**, not a list of pixel targets.

The governing test is:

> Nothing visibly accidental, weak, inconsistent or unfinished should survive a professional product/design review.

Existing deterministic QA remains the mechanical floor.

---

# 1. The review order is mandatory

## Pass A — Render first, code later

Before inspecting implementation details:

1. open/capture the rendered state;
2. inspect it at normal viewing scale;
3. state what visually/product-wise appears wrong;
4. identify why it matters to comprehension, quality or trust;
5. only then inspect code/DOM to diagnose the cause.

This prevents the reviewer from rationalising a visibly poor result because the implementation is technically valid.

---

# 2. First-pass gestalt

Look at the screen as a customer or creative director would.

Ask:

- Where does my eye go first?
- Is that where the product wants it to go?
- Is the primary action unmistakable?
- Does the screen feel composed or merely populated?
- Does anything look "off" before I can explain why?
- Is any region visually too heavy, too empty, too dense or too weak?
- Does the screen use the viewport intentionally?
- Does it feel like the same product as the previous screen?
- Would this screenshot look credible in launch material?

Record the visual symptom before diagnosing it.

---

# 3. Geometry and composition review

Inspect relationships, not isolated boxes.

## Alignment
Check:
- shared left/right edges;
- baselines;
- card-title lines;
- header lanes;
- control rows;
- repeated row geometry;
- visually paired columns.

## Termination alignment
Explicitly inspect where parallel regions **finish**, not only where they start.

Example failure:
- two side-by-side columns both stack valid cards from the top;
- cards have different intrinsic heights;
- one column ends much higher than the other;
- no overflow or token rule fails;
- the overall composition nevertheless looks accidental.

The reviewer must catch this.

Possible solutions may include:
- shared grid rows;
- equal/fill tracks;
- intentional bottom anchoring;
- a clear asymmetrical composition;
- content redistribution.

Do not solve it by adding arbitrary height unless that is genuinely the component contract.

## Symmetry and optical balance
Mathematical equality is not always visually balanced.
Check:
- visual weight;
- text density;
- dark/light surface distribution;
- icon/control weight;
- whitespace distribution;
- column proportions;
- centre of mass.

## Rhythm
Look for:
- consistent vertical cadence;
- repeated gap patterns;
- groups that read as groups;
- section breaks proportional to hierarchy;
- accidental "holes";
- elements visually glued together despite valid padding.

---

# 4. Typography and content pressure

Inspect:
- hierarchy between display/title/section/body/meta;
- line length;
- wrapping under realistic titles;
- inconsistent weights/sizes;
- Arabic face, line height and direction;
- ellipsis/truncation from the correct edge;
- controls whose labels crowd their containers;
- metadata that becomes decorative noise;
- long/short content changing alignment unexpectedly.

Stress with:
- short titles;
- long titles;
- Arabic titles;
- mixed Arabic/English;
- multi-line labels where user content permits them.

A layout that only looks good with the fixture text is not finished.

---

# 5. Component consistency without blind uniformity

Compare controls that perform the same semantic job.

Inspect:
- sizing;
- casing;
- padding;
- radius;
- icon grammar;
- hover/focus/disabled treatment;
- status semantics;
- field treatment;
- card/panel hierarchy.

Consistency serves comprehension. Do not force identical presentation where modes genuinely require different emphasis.

When drift is systemic, repair the primitive rather than normalising each screen locally.

---

# 6. Hierarchy and product comprehension

Visual QA includes product judgement.

Ask:
- Is there one clear dominant job?
- Are secondary actions actually subordinate?
- Does the screen explain current context?
- Is important information appearing at the moment it is needed?
- Are multiple surfaces competing at equal weight?
- Is a tool visually louder than the task it supports?
- Can I tell what happened after an action?
- Are "empty", "loading", "error", "success" and "repair" states visually distinct and understandable?

A beautiful ambiguous screen fails.

---

# 7. Cross-screen coherence

Review relevant states side by side.

Check:
- shell/header/navigation grammar;
- content measures;
- type roles;
- action hierarchy;
- status semantics;
- panel/card language;
- density;
- empty/error state treatment;
- interaction vocabulary;
- Arabic handling.

Do not judge screens only in isolation.

---

# 8. Responsive judgement

Do not ask only "does it overflow?"

At each supported width ask:
- Is the workflow still obvious?
- Is the information priority correct for this width?
- Did a desktop pane simply become a cramped narrow pane?
- Are hidden/collapsed areas still reachable?
- Is the primary action visible/obvious?
- Does content order remain logical?
- Are touch targets usable?
- Does the mobile version feel intentionally designed rather than mechanically stacked?

Test widths around known transitions, not just exact canonical widths, when layout behaviour suggests risk.

---

# 9. Interaction-state review

Inspect, as applicable:
- default;
- hover;
- focus;
- active/pressed;
- disabled;
- selected;
- expanded/collapsed;
- loading;
- empty;
- success;
- error;
- repair;
- floating/fullscreen/support states.

State changes must preserve orientation and not cause unexplained layout jumps.

---

# 10. Visual review loop after implementation

For every material visual change:

1. **BEFORE** capture.
2. Implement coherent/root-cause fix.
3. **AFTER** capture.
4. Inspect AFTER without looking at the diff first.
5. Ask: **what still looks wrong?**
6. Compare BEFORE/AFTER and related screens.
7. Run deterministic/regression checks.
8. Refine if a material defect remains.
9. Close only when the rendered state is professionally resolved.

"Tests passed" is not visual evidence.

---

# 11. Severity

## P0 — objective visual failure
Collision, inaccessible action, unreadable content, major clipping, blank/hidden workflow, catastrophic responsive behaviour.

## P1 — professional-quality defect
Obvious misalignment, broken balance, hierarchy failure, visibly inconsistent component language, awkward wrapping/termination, prototype-looking composition.

## P2 — material polish
Meaningfully improves rhythm, hierarchy or refinement but is not necessary for a credible launch.

## Taste / no change
An alternative is imaginable but no material quality or usability benefit is demonstrated.

---

# 12. Anti-patterns

Do not:
- use Figma as an automatic answer key;
- copy magic measurements to repair code-layout problems;
- optimise a checker count while the render gets worse;
- infer quality from valid tokens;
- accept a screen because every element is individually legal;
- inspect code first and then explain away the visual symptom;
- force arbitrary equal heights where asymmetry is intentional;
- "fix" subjective taste without a product-quality rationale;
- rebaseline visual regression merely to remove a diff;
- stop at the first functional implementation.

---

# 13. Final visual gate

For every production state/viewpoint sampled, answer:

1. Is anything visibly out of place?
2. Is any alignment/termination/rhythm accidental?
3. Is the primary task visually obvious?
4. Does realistic content break the composition?
5. Does this feel like one coherent Arapal product?
6. Would an experienced creative director flag anything material?
7. Would I approve this exact render for public launch material?

Any material "no" means the visual gate has not passed.
