# Arapal V1 — Security & Privacy Review

_Scope: the exact-candidate V2 production surface. Reviewed 2026-08-25 (IP-09)._

Arapal V1 is a **local-first, single-user, browser-only** study application. It
has no backend, no account system, and no server that receives user data. This
review covers what is stored, where it lives, how long it persists, how a user
controls it, and the one boundary across which data can leave the device: an
optional, user-configured AI provider.

## 1. Data inventory — everything Arapal persists

All persistence is browser Web Storage on the user's own device. Nothing is
transmitted to Anthropic, to the app's host, or to any Arapal-operated service —
there is none.

| Key | Store | Contains | Sensitivity |
|---|---|---|---|
| `arapal.v1.state` | localStorage | The whole study model: projects, sources (pasted Arabic text), segments, translation drafts, study records, saved notes, results, exams, attempts, proposals, archives | User content — private study work |
| `arapal.v1.state.quarantine` | localStorage | A copy of state that failed validation, set aside for recovery (R-019) | Same as above |
| `arapal.ai.config` | localStorage | The user's **own** AI provider key + model, if they chose to configure one | **Secret** (an API credential) |
| `design-sandbox.exams.v1` | localStorage | Exam definitions built from the project's segments | User content |
| `design-sandbox.exam-attempt.v1` | localStorage | An in-progress exam attempt (answers) | User content |
| `design-sandbox.exam-context.v1` | sessionStorage | The exam→study handoff payload (segment id, reason); cleared on tab close | Low |
| `arapal.segmentation.quickMode` | localStorage | A UI preference | None |
| `arapal.v2.intro-played` | localStorage | Whether the intro animation has played | None |
| `design-sandbox.segment-state.v1` | localStorage | Legacy reference-surface state (not written by the production data spine) | User content (legacy) |

There are **no cookies**, no analytics, no telemetry, no third-party embeds, and
no network requests at all in the default (unconfigured) product. The bundle is
fully self-contained.

## 2. The one external boundary — optional AI provider

Every AI-backed capability (study grading, exam grading, segment discussion,
discussion summaries, and the Research "Ask across the project" companion) is
routed through a single provider-neutral service boundary
(`src/v2/services/ai/`). Its contract (DECISIONS §3) is:

- **Off by default.** With no provider configured, `readAiConfig()` returns
  `null`, every capability returns `{ available: false }`, and the UI renders an
  honest "not configured" state. **Nothing is sent anywhere.** This is verified
  in-browser and by unit tests.
- **BYO-key only.** No provider secret is embedded in the distributed bundle. AI
  only activates when a user supplies **their own** key, stored locally in
  `arapal.ai.config`.
- **No fabricated output, ever.** A missing provider, a network error, or an
  unparseable response yields an honest unavailable/failed state — never invented
  grades, answers, or citations.

### What is sent, and to whom, when a user configures a key

When (and only when) a user has configured a provider, the request goes directly
from **their browser** to **their chosen provider's endpoint** — for the bundled
Gemini adapter, `https://generativelanguage.googleapis.com`. The request body is
a prompt that includes, depending on the capability:

- the segment's Arabic **source text** and the user's **translation** (grading),
- **exam answers** and their segments' source text (exam grading),
- the **discussion messages** and segment text (discussion/summary),
- the **project's segments** and the user's **question** (Research ask).

This is inherent to using an external model: the study content being worked on is
sent to the third party the user selected, under that provider's terms. The app
sends nothing else — no identifiers, no other projects, no telemetry.

### Credential handling

- The key is stored in `localStorage` as plaintext (browser Web Storage is
  origin-isolated; there is no server to store it on). It never leaves the device
  except as an auth header to the user's own provider.
- **Hardened 2026-08-25:** the Gemini key is sent in the `x-goog-api-key`
  **header**, not the URL query string, so it does not land in browser history,
  `Referer` headers, or intermediary logs.

## 3. Retention, deletion, export — user control of their data

- **Retention:** data persists in the browser until the user (or the browser)
  clears site storage. There is no server copy and no expiry.
- **Per-project deletion:** the data layer supports a cascading
  `deleteProject()` that removes a project and all its sources, segments, drafts,
  study records, notes, results, exams, and attempts, with no orphaned keys
  (covered by a store unit test).
- **Non-destructive re-segmentation:** replacing a project's segmentation
  **archives** prior drafts/records/notes/results rather than deleting them
  (DECISIONS §5), so canonical work is never silently lost.
- **Recoverability:** state that fails validation is quarantined (recoverable),
  not discarded, and the app continues from empty rather than crashing (R-019).

### Known limitations (Stage-3 recommendations)

These are honest gaps, not defects in what exists; they are the top data-control
items to close before a wide public release:

1. ~~**No in-product AI-configuration UI.**~~ **Resolved 2026-08-26.** An
   `AiConfigDialog` (opened from a persistent AI-setup control in the navigation
   rail and from a contextual "Set up AI" link in the Study "not configured"
   notice) lets a user enter, replace, or remove their own provider key without
   dev tools. It drives the existing `writeAiConfig()`/`clearAiConfig()` layer,
   stores the key only in local browser storage (§2), states which provider is
   supported and that AI is unavailable without a key, and never fakes a working
   state — an invalid key produces an honest error at use, not a fabricated pass.
2. **No one-click export or "delete all my data" UI.** `deleteProject()` exists
   at the data layer but is not surfaced, and there is no JSON export. For a
   local-first product, "own your data" should be a first-class, discoverable
   control. Recommendation: a Settings surface with "Export all data (JSON)" and
   "Delete a project / wipe all local data".
3. **Legacy reference-surface storage** (`design-sandbox.segment-state.v1`) is
   written by the non-production legacy app and is out of the production data
   spine; it should be removed with the legacy surface at Stage 3.

## 4. Attack surface

- **No server** → no server-side attack surface, no data-in-transit for the
  default product, no multi-tenant isolation concerns.
- **XSS:** user content is rendered as text through React (no
  `dangerouslySetInnerHTML` on user content); AI replies are rendered as plain
  paragraphs, not HTML. A top-level error boundary contains render failures.
- **Prompt/content boundary:** AI citations are constrained to segment refs that
  were actually supplied to the model, so a hallucinated citation cannot surface
  as an authoritative link.
- **Supply chain:** the production bundle is self-contained (no runtime CDN),
  and the dev/QA lab surfaces are tree-shaken out of it entirely (IP-08).

## 5. Verdict

For a local-first, single-user, backend-less V1, the security and privacy posture
is sound: no data leaves the device by default, the one external boundary is
explicit, user-controlled, off by default, and never fabricates, and the app is
honest about persistence success/failure. The in-product AI-configuration gap in
§3 has been resolved (a BYO-key setup dialog); the remaining data-control item is
a user-facing export / "delete all my data" surface, which is the material item
to resolve before a broad public release. It is not a data-exposure risk today,
because the mechanism it would drive (`deleteProject`) is already correct at the
data layer.
