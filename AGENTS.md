# Arapal — Agent Operating Doctrine

Arapal is a real V1 product, not a visual-design sandbox.

The objective is to finish and release the current Arapal product: functionally correct, trustworthy, professionally designed, maintainable, responsive, accessible, and operationally credible.

## Read order

Before substantive work, use these current documents:

1. `PROJECT.md` — stable product model, V1 scope, core user journeys and product semantics.
2. `DECISIONS.md` — durable decisions that remain current.
3. `docs/release/ARAPAL_RELEASE_CONTRACT.md` — definition of release readiness.
4. `docs/release/ARAPAL_RELEASE_LEDGER.md` — current evidence-backed distance to release.
5. `docs/release/00-RUNBOOK.md` — stage orchestration and model ownership.
6. `docs/release/ARAPAL_VISUAL_PRODUCT_STANDARD.md` — professional visual/product judgement.
7. `docs/reference/FIGMA_REFERENCES.md` — design-reference navigation only.

Files under `docs/archive/` are historical evidence. They are **not current instructions** and must not be used as present status without re-verification.

## Source-of-truth order

For current behaviour and release claims:

1. release contract and explicit current product decisions;
2. exact running application and exact repository commit;
3. executable tests, QA, screenshots and release evidence;
4. current release ledger;
5. current design references;
6. historical audits, screenshots and archived prose;
7. inference.

Never inherit a PASS/FAIL claim from an old document.

## Product judgement

Do not behave as a passive executor. Treat requests, audit findings and historical plans as hypotheses to test against the release objective.

Ask:
- Are we solving the root cause?
- Does this improve the actual user journey?
- Is the product claim truthful?
- Is there a simpler shared/systemic solution?
- What would a senior product, design or engineering reviewer reject?

Routine implementation decisions should be made autonomously. Escalate only genuinely material product semantics, irreversible data behaviour, or security/privacy policy.

## Engineering doctrine

- Fix shared causes before local symptoms.
- Parent/container owns structural layout.
- Avoid absolute positioning, arbitrary offsets and magic-number nudges for normal layout.
- Preserve working behaviour unless a deliberate replacement is evidenced.
- Do not delete legacy behaviour-bearing code until parity is verified.
- A clean checker count is evidence for the encoded floor, not proof of product quality.
- Use the repository's existing QA/regression/release tooling rather than creating competing systems.

## Visual/product doctrine

A screen is not finished because:
- it renders;
- tokens are valid;
- no element overflows;
- tests are green;
- it resembles Figma.

Rendered product quality requires human/AI judgement.

Inspect:
- alignment and shared edges;
- termination alignment across parallel columns/stacks;
- optical balance;
- hierarchy;
- spacing rhythm;
- density and dead space;
- realistic-content wrapping;
- typography and Arabic handling;
- component consistency;
- responsive composition;
- state transitions;
- cross-screen coherence.

The governing standard is:

> Nothing visibly accidental, weak, inconsistent or unfinished should survive professional review.

For detailed review method, use `docs/release/ARAPAL_VISUAL_PRODUCT_STANDARD.md`.

## Product identity

Arapal is a focused study instrument for serious Arabic/language study. It should feel:
- calm;
- premium;
- scholarly/editorial;
- modern;
- precise;
- low-friction;
- coherent rather than dashboard-like.

The Study Workspace is the core loop. Secondary tools must support the work rather than compete with it.

## Evidence discipline

Distinguish:
- **VERIFIED**
- **REASONED INFERENCE**
- **ASSUMPTION**
- **UNKNOWN**

Unknown is acceptable. False certainty is not.

Do not declare work complete from code changes alone. Use the evidence appropriate to the claim:
- function → journey/test evidence;
- persistence → reload/re-entry evidence;
- visual quality → rendered evidence;
- engineering → build/runtime/test evidence;
- release → exact-commit evidence package.

## Current work tracking

Do not maintain a second historical TODO narrative.

Current release work lives in `docs/release/ARAPAL_RELEASE_LEDGER.md`.

Consequential durable decisions belong in:
`DECISIONS.md`
