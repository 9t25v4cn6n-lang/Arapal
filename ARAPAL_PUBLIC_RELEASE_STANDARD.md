# Arapal — Public Release Standard

**Status:** mandatory supplement to `ARAPAL_RELEASE_CONVERGENCE_PLAN.md`.

**Purpose:** the original plan already covers Floor, Function, selective R3 uplift, Fit, professional visual QA and release hardening. Its weakness is the final threshold: Claude was able to declare the **desktop production surface** a release candidate without explicitly proving the stronger question we now care about — **would we confidently launch this exact product publicly?**

This file does **not** restart the programme, replace the original plan, or require gratuitous redesign. Continue the current successful method and use this only to strengthen the final release bar.

---

## 1. Full V1 outcome

Arapal V1 is ready only when the **full required product — desktop + 390px mobile — passes Floor + Function + Fit and a deliberate public-release review.**

The existing desktop RC is valuable evidence. Preserve it. Do not redo desktop for its own sake. However, do not assume the desktop visuals/Product Fit pass this stronger standard merely because the original §10 gate passed. Re-open desktop only where the final review identifies a material issue, or where shared/mobile work causes a regression.

The target is:

> **Arapal should look, behave and feel like a deliberately designed, professionally engineered product that a well-resourced major technology company could credibly launch publicly — not merely a product whose tests pass.**

---

## 2. What can and cannot be claimed

The release review can judge whether obvious visual, UX, product or engineering deficiencies are likely to undermine trust, adoption or reviews.

It cannot prove market demand, retention, willingness to pay or that customers will give positive reviews without real-user evidence. Do not invent that evidence.

Therefore the practical launch bar is:

- strong first-impression credibility and visual attractiveness;
- understandable core journeys without creator explanation;
- no obvious unfinished/amateur presentation;
- coherent, low-friction interaction and state feedback;
- professional desktop and mobile execution;
- no known material issue likely to dominate negative user reaction;
- genuine market/desirability uncertainty labelled `REAL-USER UNKNOWN`, not disguised as certainty.

---

## 3. Keep the established method

Continue the original plan's preserve-first approach:

- live product is the baseline;
- preserve what is already good;
- fix demonstrated defects at root cause;
- import only demonstrably superior R3 decisions;
- never rebuild a working screen merely to make it more Figma-like;
- derive responsive/layout behaviour correctly in code rather than copying Figma measurements;
- checker, behaviour tests and visual regression are guardrails, not product-quality scores;
- when metrics and the rendered product disagree, trust direct inspection and diagnose why;
- do not refactor, abstract or polish simply because the opportunity exists.

---

## 4. Mandatory Public Release Review

After mobile is substantively complete and the product is integrated, perform one deliberate review of the **actually rendered product** across every production state, then cross-screen and cross-form-factor.

This review is separate from checker-zero, visual-regression pass/fail and Figma comparison.

### A. Major-company visual launch test

Ask:

> **Would an experienced product/design leadership team at a major technology company be comfortable shipping these exact screens publicly and allowing them to appear in reviews, screenshots and demonstrations?**

Inspect, at minimum:

- hierarchy and obvious primary action;
- typography, density and readability;
- spacing, alignment, sizing, proportion and optical balance;
- colour, surfaces, radii and component consistency;
- visual rhythm and whitespace;
- collisions, clipping, truncation, overflow and awkward wrapping;
- empty/loading/success/error/repair states;
- interaction-state consistency;
- cross-screen coherence;
- anything that looks accidental, debug-like, placeholder-like, amateur or obviously AI-generated;
- whether mobile looks intentionally designed for mobile rather than compressed desktop.

### B. First-time-customer / attraction test

Approach Arapal with no creator context.

Ask:

- Is the purpose/value of the screen quickly understandable?
- Is the next action obvious?
- Does the experience create confidence and curiosity rather than uncertainty?
- Are important actions visually prioritised correctly?
- Are labels/copy understandable and consistent?
- Does first use look polished and credible enough to support adoption rather than undermine it?
- If a prospective user saw these screens publicly, would the product presentation itself be a reason to continue exploring rather than leave?

### C. Product Fit / sustained-use test

Ask:

- Are critical journeys efficient, not merely possible?
- Is cognitive load justified by the task?
- Is information shown at the right moment?
- Are progress, success, failure, saving and recovery clear?
- Are repeated patterns learnable and consistent?
- Do Home, Projects, Segmentation, Study, Research and Exams feel like one product?
- Are there dead ends, unnecessary steps or confusing mode changes?
- Does Study — the core workspace — receive the strongest hierarchy and interaction quality?
- Could a serious user work for an extended period without recurring friction caused by layout, navigation or state ambiguity?

### D. Public-review risk test

Ask:

> **If this exact version launched today, is there any obvious visual, UX, reliability or credibility issue likely to become a recurring complaint or dominate screenshots/reviews?**

Classify the answer as:

- `FIX BEFORE RELEASE` — material issue within our control;
- `ACCEPTABLE TRADE-OFF` — intentional and defensible;
- `REAL-USER UNKNOWN` — cannot honestly be resolved without actual customers.

Do not convert speculative review anxiety into gratuitous redesign.

---

## 5. Classification before changing code

Every material review finding must be classified first:

- **OBJECTIVE DEFECT** — fix.
- **SYSTEMIC DEFECT** — fix at the shared/root cause and verify blast radius.
- **SUPERIOR R3 DECISION** — import the decision, not the pixels.
- **IMPROVE BOTH** — neither live nor R3 meets the bar; implement the clearly stronger solution without changing fundamental product scope.
- **CURRENT LIVE BETTER** — preserve it.
- **TASTE-ONLY / NO MATERIAL BENEFIT** — leave it alone.
- **REAL-USER UNKNOWN** — record honestly; do not manufacture evidence.

This classification exists specifically to prevent endless AI visual-tweak loops.

---

## 6. Mobile-specific bar

390px is part of V1, not a post-RC extra.

Do not optimise for the mobile violation count itself. A more usable layout can expose more measurable content and temporarily increase the count.

Mobile passes only when:

- critical journeys are genuinely usable;
- navigation/action hierarchy suit the form factor;
- essential content is not hidden, clipped or forced into unusably narrow regions;
- Study has an intentional mobile interaction model rather than merely collapsed desktop columns;
- touch targets, scrolling, overlays and drawers behave appropriately;
- typography/density remain readable;
- mobile patterns are coherent across screens;
- the rendered product looks deliberately designed at 390px;
- mobile visual baselines/goldens are added **after layouts settle** and inspected before acceptance;
- shared mobile changes do not regress the established desktop RC.

---

## 7. Evidence and anti-loop rules

Keep using the method that has worked:

- targeted route/state checks during active implementation;
- real rendered inspection after meaningful changes;
- full suites at meaningful integration gates/high-blast-radius shared changes;
- never accept/update a golden before inspecting the diff;
- no proactive checker/harness expansion unless a real defect demonstrates a material blind spot;
- never prefer a lower violation count over a visibly better working product;
- no repeated subjective tweaking without a defensible improvement.

The final release decision requires **both objective evidence and professional judgement**.

---

## 8. Full Public Release Candidate gate

Declare `FULL V1 PUBLIC RELEASE CANDIDATE` only when:

- the original `ARAPAL_RELEASE_CONVERGENCE_PLAN.md` release gates remain satisfied;
- desktop RC remains intact **and has passed this stronger public-release review**;
- 390px mobile is complete, usable and professionally resolved;
- all defined V1 critical journeys work end-to-end on applicable form factors;
- persistence, state isolation and behaviour parity remain correct;
- deterministic QA, behavioural regression and visual regression have no unexplained production failures;
- mobile visual baselines are reviewed and accepted after layouts settle;
- every production state has received the deliberate Public Release Review above;
- all `FIX BEFORE RELEASE` findings are resolved;
- cross-screen and desktop/mobile integration are professionally coherent;
- engineering/release hardening remains valid after final shared changes;
- remaining uncertainty is explicitly classified rather than hidden behind a passing metric.

The final judgement must be defensible as:

> **Arapal V1 is functionally complete for its defined scope, robust across its critical journeys, professionally resolved across desktop and mobile, coherent as one product, and visually/experientially at a standard that a major technology company could credibly release publicly. No known material product, UX, visual or engineering defect remains that should prevent a normal target user from understanding, trusting and successfully using the product.**

Do **not** claim that customers will highly review it without customer evidence. Instead confirm that no obvious release-quality defect within our control is expected to be the dominant source of negative user reaction.

---

## 9. Stopping condition

Do not stop at a commit, status report, checker zero, successful test run, completion of mobile implementation alone, or the previously declared desktop RC.

Stop only when:

1. `FULL V1 PUBLIC RELEASE CANDIDATE` is genuinely evidenced under both the original convergence plan and this standard; or
2. a genuine external blocker prevents further progress after all other executable work is completed.

If blocked, state precisely what is external, what evidence proves it, and what remains outstanding.
