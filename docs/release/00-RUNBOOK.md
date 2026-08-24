# Arapal — Release Runbook

## Operating model

- **GPT-5.6 Ultra** — scarce Product / UX / Visual Release Authority.
- **Claude Ultracode** — primary implementation and integration engine.
- **Claude Ultra Reasoning** — scarce Engineering Release Authority and escalation path.
- **Existing QA / visual regression / behaviour / data / release-evidence tooling** — continuous objective controls.

The goal is one evidence-backed Arapal V1 release candidate, not checklist completion.

All exact model prompts live in one file:

`docs/release/PROMPTS.md`

---

# Stage 0 — Establish current reality

**Model:** Claude Ultracode  
**Reasoning:** normal Ultracode

Read:
- `AGENTS.md`
- `PROJECT.md`
- `DECISIONS.md`
- `docs/release/ARAPAL_RELEASE_CONTRACT.md`
- `docs/release/ARAPAL_RELEASE_LEDGER.md`
- `docs/release/ARAPAL_VISUAL_PRODUCT_STANDARD.md`

Use:
`PROMPTS.md` → **Stage 0 — Claude Ultracode Current-State Baseline**

**Exit:** `BASELINE ESTABLISHED — READY FOR INDEPENDENT PRODUCT AUDIT`

Do not begin broad implementation here.

---

# Stage 1 — Independent Product / Visual audit

**Model:** GPT-5.6 Ultra  
**Reasoning:** spend Ultra here

Use:
`PROMPTS.md` → **Stage 1 — GPT-5.6 Ultra Initial Product / Visual Audit**

Give it the current running product/repository and the governing docs above.

Do **not** use historical audits or the old 69-item checklist as the task list.

**Exit:** one current evidence-backed Release Ledger exists, with findings discovered independently from the rendered product.

---

# Stage 2 — Release convergence implementation

**Model:** Claude Ultracode  
**Reasoning:** normal Ultracode by default

Use:
`PROMPTS.md` → **Stage 2 — Claude Ultracode Release Convergence**

Core loop:

`VERIFY → DIAGNOSE → IMPLEMENT → TEST → RENDER → CRITIQUE → REFINE → REGRESSION → LEDGER`

Visual findings close on rendered evidence, not code validity. Functional findings close on behavioural evidence, not screenshots.

**Exit:** all P0/P1 release blockers are resolved or a genuine RED decision is isolated.

---

# Stage 2 escalation — only when genuinely necessary

**Model:** Claude Ultra Reasoning

Use:
`PROMPTS.md` → **Stage 2 Escalation — Claude Ultra Reasoning**

Use only for:
- high-blast-radius architecture ambiguity;
- RED product-semantic ambiguity;
- security/privacy/data policy;
- two good-faith implementation attempts that still fail.

Routine implementation stays with Ultracode.

---

# Stage 3 — Fresh-eyes Product gate

**Model:** GPT-5.6 Ultra  
**Reasoning:** optional intermediate Ultra spend

Use when Stage 2 materially changed the product or visual quality remains suspect.

Use:
`PROMPTS.md` → **Stage 3 / Stage 5A — GPT-5.6 Ultra Fresh-Eyes Product Gate**

Set mode to `INTERMEDIATE`.

The first pass must inspect the product **before reading the team's ledger**.

**Exit:** `PASS TO CONTINUE`; otherwise return to Stage 2.

If Stage 2 was narrow, skip this intermediate run and save GPT Ultra for Stage 5A.

---

# Stage 4 — Change freeze and candidate assembly

**Model:** Claude Ultracode  
**Reasoning:** normal Ultracode

Use:
`PROMPTS.md` → **Stage 4 — Claude Ultracode Release Candidate Assembly**

Create one clean exact-SHA candidate, run complete evidence in one coherent state, verify clean-room journeys, security/privacy/operations basics and freeze the ledger.

**Exit:** `RELEASE CANDIDATE ASSEMBLED — READY FOR INDEPENDENT GATES`

Any candidate-changing fix creates a new SHA and requires relevant evidence rerun.

---

# Stage 5A — Final Product / Design gate

**Model:** GPT-5.6 Ultra  
**Reasoning:** spend Ultra here

Use:
`PROMPTS.md` → **Stage 3 / Stage 5A — GPT-5.6 Ultra Fresh-Eyes Product Gate**

Set mode to `FINAL`.

The independent rendered-product/journey pass happens before reading implementation summaries.

**Exit:** `Product Release Gate: PASS`

---

# Stage 5B — Final Engineering gate

**Model:** Claude Ultra Reasoning  
**Reasoning:** spend Ultra here

Use:
`PROMPTS.md` → **Stage 5B — Claude Ultra Reasoning Final Engineering Gate**

Review the exact same SHA and exact-SHA evidence package used by Stage 5A.

**Exit:** `Engineering Release Gate: PASS`

---

# Release decision

Arapal is `RELEASE CANDIDATE` only when:

- Product Gate = PASS;
- Engineering Gate = PASS;
- both refer to the same exact candidate SHA.

---

# Ultra-credit policy

## Spend GPT-5.6 Ultra on
- Stage 1;
- Stage 3 only when materially useful;
- Stage 5A;
- exceptional product/design ambiguity.

## Spend Claude Ultra Reasoning on
- genuine Stage 2 escalations;
- Stage 5B.

## Keep on Claude Ultracode
- baseline;
- implementation;
- tests;
- rendered implementation-loop QA;
- candidate assembly;
- routine release hardening.

---

# Parallelism

Only one primary writer owns shared code.

Parallel implementation is allowed only for genuinely independent work with explicit file/worktree ownership. Shared shell, routing, tokens, data and primitives remain centrally owned.

---

# Evidence authority

Use:
1. release contract and current durable decisions;
2. exact running product/repository;
3. executable evidence;
4. current release ledger;
5. current design references;
6. historical material only as evidence.

No archived status is current truth without re-verification.
