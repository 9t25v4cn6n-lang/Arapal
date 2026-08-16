# AraPal — Screenshot Reference

Purpose-built reference package for another AI (or a new team member) to understand AraPal's built functionality. The original package covers the full **legacy** app; the 2026-08-15 supplement adds focused, interaction-deep coverage of the V2 Study Workspace, Segmentation Review editor, and Project Research workspace. It is not a design spec or redesign proposal: every image is a literal capture of the running app.

## Scope and how this was built

- **Apps covered:** the complete legacy set (`src/screens/`, hash routes `#home #study #segmentation #exams #projects`), plus targeted V2 coverage for `#v2/studyWorkspace`, `#v2/segmentationReview`, and `#v2/projectResearch`.
- **Depth:** representative, not exhaustive. Each screen's distinct *functionality* is captured once — hidden panels, dropdowns, wizard steps, pass/fail states, floating/docked variants. Generic effects that repeat identically across screens (e.g. a card's hover-lift) are shown once, not on every screen.
- **Viewport:** fixed at 1440×900, the app's own canonical desktop design viewport.
- **Chrome:** captured with `?chrome=0`, which hides a developer-only screen switcher pill bar (top-right) that is not part of the product. Real in-app navigation (nav rails, buttons, links) is untouched and visible in every shot.
- **Method:** legacy captures are driven by `scripts/capture-reference.mjs`; the V2 supplement was driven interactively through the local browser. Both use the real dev server (`npm run dev`) and actual rendered UI rather than hand-styled mockups. There is no live backend, so grades, segment proposals, translations, and similar data are seeded/mock content.

## App structure (for orientation)

Legacy is a single-page app (`src/App.jsx`) that swaps a full-screen component based on `window.location.hash`:

| Hash | Component | Folder in this reference |
|---|---|---|
| `#home` | `ProjectHomeScreen` | `01-home/` |
| `#study` | `FigmaScreen` (composed of `Sidebar` + `LeftPanel` + `CenterPanel` + `RightPanel`) | `02-study/` |
| `#segmentation` (or `#make`) | `MakeSegmentationFlowScreen` | `03-segmentation/` |
| `#exams` | `ExamsScreen` | `04-exams/` |
| `#projects` | `ProjectsScreen` | `05-projects/` |
| `#v2/studyWorkspace` | `StudyWorkspaceScreen` | `06-v2-study/` |
| `#v2/segmentationReview` | `SegmentationReviewScreen` | `07-v2-segmentation-review/` |
| `#v2/projectResearch` | `ProjectResearchScreen` | `08-v2-project-research/` |

There is also `#legacy-segments` → `SegmentsScreen`, an older/superseded variant not reachable from any in-app nav link, and not captured here.

Cross-screen navigation in the real product: Home cards open Study or Segmentation; Segmentation's Success screen opens Study or returns Home; Study's sidebar and Projects' side nav can jump to Home/Study/Segmentation/Exams.

---

## 01-home — Project Home (`#home`)

The landing screen: a brand intro animation, then a deck of 4 project cards ("pick up where you left off").

| File | Shows |
|---|---|
| `01-intro-splash.png` | The full-screen brand intro that plays on every load (skippable via a "Replay intro" button once past it). |
| `02-resting-deck.png` | Resting state: 4 cards — 2 in-progress projects (Jumuʿah, Purity, both → Study), 1 that routes to Segmentation (Fasting), and an "Initiate New Protocol" create card (→ Segmentation). |
| `03-card-hover.png` | Card hover state (lift + shadow) — this same hover treatment is reused on cards elsewhere in the app and isn't re-captured per screen. |

Not captured (identical/trivial): clicking "Replay intro" (same as `01`); the 3 outbound nav buttons (Projects/Segmentation links — destinations captured under their own screens).

---

## 02-study — Study Workspace (`#study`)

The core read → translate → submit loop, and the largest, most feature-dense screen in the app (~5,600 lines across 4 components). Default segment on load is **1.3 Ghusl**, which is scripted to fail on its first submission and pass on the second — used deliberately below to show both outcomes without switching segments.

| File | Shows |
|---|---|
| `01-draft-default.png` | Resting layout: far-left icon nav, segment tree (chapters/segments), center reading + translation editor, right support panel with pre-submit cards (**Guidance, Lexicography, Phrasing**). |
| `02-nav-rail-expanded.png` | Far-left navigation rail pinned open (labels visible) via its expand toggle — normally icon-only. |
| `03-segment-tree-collapsed.png` | The segment/chapter tree collapsed to a thin rail via its own independent collapse toggle. |
| `04-support-rail-collapsed.png` | Right support panel collapsed to a vertical icon rail (independent of the nav rail/segment tree — 3 independent collapse mechanisms on this one screen). |
| `05-support-rail-hover-preview.png` | Hovering a collapsed-rail icon opens a floating preview flyout of that card without fully expanding the panel. |
| `06-support-card-expanded-modal.png` | Clicking a support card's expand icon opens it as a full-screen modal (here: Guidance). |
| `07-discuss-docked.png` | "Discuss This Segment" opens an AI-companion chat panel docked into the center column. |
| `08-discuss-floating.png` | The docked panel can be popped into a floating, draggable/resizable window via its "Float" control (also has a "Dock" control to reverse, and its own expand-to-modal state, not separately captured). |
| `09-submit-failed.png` | Result of the **first** Submit on segment 1.3: "Needs Revision" badge, a retry banner, and post-submit support cards swap to **Grade / Fix Steps / Lexicography**, with "why it failed" and "what to fix first" call-outs. |
| `10-submit-passed.png` | Result of submitting **again**: "Submitted" state, support cards become **Grade / Key Takeaways / Lexicography**, and the center panel shows a "best in class" reference translation alongside the user's own, plus strengths/areas-for-improvement/suggestion notes. |

Not captured (same interaction pattern as something above, or minor): manual note-adding inside the post-submit discussion summary; dragging the floating Discuss panel to a new position (the drag mechanism exists but the *floating state itself* is what's documented); rich-text toolbar buttons in the translation editor (Bold/Italic/align — visible but inert in source).

---

## 03-segmentation — Segmentation wizard (`#segmentation`)

A multi-step wizard that turns pasted raw text into study segments. This is the screen with the most explicit "intermediary screens" — captured as two separate end-to-end passes because a **Quick mode** preference (in the options menu) changes whether the wizard stops at a Review step or skips straight to Success.

| File | Shows |
|---|---|
| `01-paste-empty.png` | Step 1 of 3 ("Source"): empty paste intake, primary CTA disabled until text is present. |
| `02-paste-with-text.png` | Same screen with source text entered — CTA enabled, word count shown. |
| `03-options-menu-open.png` | The hidden options menu (chevron next to the primary button): method (AI proposal vs. Manual start), segmentation style (Sentence / Meaning groups / Topic-led), granularity (Tighter / Balanced / Broader), and two preference toggles — **Quick mode** and **Show segmentation animation**. None of this is reachable except through this one dropdown. |
| `04-compiling.png` | Step 2, first transition screen: brief "Preparing your segments" loading state (auto-advances after ~1.2s). |
| `05-segmenting-transition.png` | Step 2, second transition screen: an animated preserved-source vs. AI-proposal split view (auto-advances after ~2.2s; has its own "Skip" and "Always skip this animation" controls). |
| `06-review-segments.png` | Step 3 ("Review"), reached because Quick mode was turned off for this pass: segment markers list (editable, addable), source preview, and an "Approve structure" action. |
| `07-review-source-expanded.png` | The Review screen's source-text preview panel expanded from "peek" to full view via its own Peek/Expand/Hide toggle. |
| `08-success.png` | "Segments Ready" screen reached via Review → Approve & continue, with Start Studying / Return to Home actions and batch metadata. |
| `09-quickmode-skips-to-success.png` | A second, independent pass with default preferences (Quick mode **on**): the same paste → compiling → segmenting sequence goes straight to Success, skipping the Review step entirely — the two paths produce visibly different wizards from the same starting screen. |

Not captured (out of scope for this pass): the **Manual start** method (skips straight to Review with empty markers instead of AI-generated ones — same Review UI as `06`, just pre-populated differently); the Home/Projects re-entry screens inside this same file (`HomeScreen`/`SourceIntakeScreen` components) — they exist in source but are not reachable from the default `#segmentation` entry point in the current build.

---

## 04-exams — Exams (`#exams`)

Described by the product owner as work-in-progress, but functionally wired end-to-end with seeded/mock data: create → take → grade → review.

| File | Shows |
|---|---|
| `01-list.png` | Resting list view: summary stats (saved/ready/recent score), a "Generate a new exam" panel, and saved exam cards in both Ready and Completed states. |
| `02-generate-scope.png` | "Create exam" opens a scope builder — exam title, Prefix vs. Tracker-range scope type, and a live preview of which study material would be included. |
| `03-generate-range-mode.png` | Same screen with scope type switched to **Tracker range** (two numeric bounds instead of a single prefix) — the preview list updates accordingly. |
| `04-take-question.png` | "Open exam" on a Ready exam: question navigator sidebar, current question + prompt, free-text answer field, and a live autosave/progress/elapsed-time aside. |
| `05-results-review.png` | "Review results" on a Completed exam: misses/worth-reviewing/strong-answer counts, results groupable by concept or by segment, and per-item "Jump to study" links back into the Study workspace. |

Not captured: stepping through multiple exam questions via Previous/Save & next (same question-panel layout as `04`, different content); the final "Submit for grading" transition from Take → Results for a freshly-taken exam (results screen itself is shown via the pre-completed exam instead, which produces the same UI).

---

## 05-projects — Projects (`#projects`)

Described by the product owner as rough — a visual direction rather than a finished screen. It uses a different shell entirely from Study (a labeled left sidebar with text nav items, vs. Study's icon-only rail), and has almost no interactivity beyond one filter control.

| File | Shows |
|---|---|
| `01-resting.png` | Default view: metric tiles (active/ready/needs-setup/streak), and a "Recent projects" list filterable by pill buttons, each row with an "Open next segment" action. |
| `02-filter-ready-to-continue.png` | List filtered to "Ready to continue". |
| `03-filter-needs-setup.png` | List filtered to "Needs setup". |

This is the full extent of this screen's built functionality — card actions route into Study/Segmentation (already documented under those screens) and there is no other hidden state.

---

## 06-v2-study — V2 Study Workspace (`#v2/studyWorkspace`)

Focused coverage of the V2 read → translate → submit loop. Repeated support-card mechanics are demonstrated with Guidance once; the same expand/fullscreen/float controls on Lexicography, Phrasing, Grade, Fix Steps, and Key Takeaways are intentionally not duplicated.

| File | Shows |
|---|---|
| `01-draft-default.png` | Default three-pane workspace with segment outline, Arabic source, translation editor, and support cards. |
| `02-focus-view.png` | Focus mode, preserving the central study task while quieting surrounding panes. |
| `03-segments-collapsed.png` | Segment outline collapsed to its compact navigation rail. |
| `04-support-collapsed.png` | Support pane collapsed to its icon rail. |
| `05-support-hover-preview.png` | Guidance preview opened by hovering the collapsed support rail. |
| `06-support-card-expanded.png` | Guidance expanded inside the support pane. |
| `07-support-fullscreen.png` | Guidance in the fullscreen support overlay. |
| `08-support-floating.png` | Guidance in the floating support-card treatment. |
| `09-translation-editor-expanded.png` | Translation editor expanded over the main workspace. |
| `10-discussion-open.png` | Segment-attached Study Companion opened beside the editor. |
| `11-submit-failed.png` | First submission failure: retry guidance and Grade/Fix Steps support state. |
| `12-submit-passed.png` | Second submission pass: reference translation, user translation, notes, navigation, and success support state. |
| `13-add-manual-note.png` | Manual-note editor opened from the submitted state. |
| `14-manual-note-saved.png` | Saved manual note attached to the segment. |
| `15-source-text-enlarged.png` | Source typography enlarged with the A+ control. |
| `16-chapter-collapsed.png` | One chapter collapsed in the segment outline; repeated chapter toggles are equivalent. |
| `17-next-segment.png` | Next-segment navigation with the workspace context updated. |

Not separately captured: inert Bold/Italic/alignment and Copy controls; Previous is the inverse of Next; repeated expand/fullscreen/float actions on every support card; closing/docking controls whose resting counterpart is already shown.

---

## 07-v2-segmentation-review — V2 Segmentation Review (`#v2/segmentationReview`)

Interaction-deep coverage of the segment structure editor: select, split, merge, move boundaries, remove, edit, review, and approve.

| File | Shows |
|---|---|
| `01-review-default.png` | Default review workspace with selected segment, outline, proposal grid, status summary, and resegmentation toolbar. |
| `02-source-expanded.png` | Preserved source tray expanded. |
| `03-split-point-editor.png` | Word-level split-point editor and live two-segment preview. |
| `04-split-applied.png` | Split applied, producing two selected segments with Undo and merge actions enabled. |
| `05-merge-selected-applied.png` | Selected split segments merged back into one structure. |
| `06-adjust-boundary.png` | Boundary-adjustment mode showing both adjacent segments and movement controls. |
| `07-boundary-moved.png` | Boundary moved one word into the next segment. |
| `08-advanced-text-edit.png` | Direct advanced editing of a segment's Arabic text. |
| `09-remove-menu.png` | Remove menu with delete, add-to-previous, and add-to-next choices. |
| `10-remove-and-add-to-next.png` | Selected segment removed while preserving its text in the next segment. |
| `11-marked-ready.png` | A suggested-check segment marked ready, updating review status. |
| `12-toolbar-floating.png` | Resegmentation toolbar detached into its floating, draggable form. |
| `13-list-view.png` | Proposal switched from grid to list presentation. |
| `14-group-title-editor.png` | Meaning-group title opened for inline editing. |
| `15-group-collapsed.png` | One meaning group collapsed; remaining group toggles use the same behavior. |
| `16-edit-source-return.png` | Edit action returning to the V2 source/segmentation setup screen. |
| `17-approved-success.png` | Approval handoff to the Segments Ready success screen. |

Not separately captured: Merge next (same resulting structure family as Merge selected), the inverse boundary movement, Undo/Redo returning to already represented states, repeated group collapse/title editing, toolbar dragging after it is visibly floating, and outbound global navigation already represented elsewhere.

---

## 08-v2-project-research — V2 Project Research (`#v2/projectResearch`)

Focused coverage of the project-level knowledge explorer: search and filtering, segment inspection, revision queues, project companion, empty states, and the handoff back into study.

| File | Shows |
|---|---|
| `01-default.png` | Default research desk with the knowledge lenses, revision queue, full segment ledger, and selected-segment inspector. |
| `02-vocabulary-lens.png` | Vocabulary research lens selected; the same lens mechanism powers Segments, Mistakes, Notes, Weak, and Completed. |
| `03-no-translation-refinement.png` | Quick refinement for segments without a saved user translation. |
| `04-search-results.png` | Project-wide text/tag search narrowed to the two city-condition segments. |
| `05-no-search-results.png` | Empty ledger state for a search with no matching project knowledge. |
| `06-needs-revision-segment.png` | A needs-revision ledger row selected, with its status and full source details loaded into the inspector. |
| `07-project-companion.png` | Ask mode opened as an attached project companion with a saved answer and cited segments. |
| `08-companion-prompt.png` | Companion quick-prompt populated in the question composer. |
| `09-companion-empty.png` | Companion's empty-answer state, inviting a project-level question. |
| `10-no-selection.png` | Segment selection cleared, showing the bounded empty inspector. |
| `11-revision-queue.png` | Weak-segments revision queue entry applied, producing the Weak lens result set. |
| `12-study-mode-handoff.png` | Study mode handoff from Project Research into the V2 Study Workspace. |

Not separately captured: the remaining lens buttons and quick refinements (same filtering pattern), Recurring terms (same result family as the captured city-condition search), Translation comparison (same search-ledger pattern), related-segment and citation buttons (same selected-inspector transition), Details after Ask (returns to a represented state), the duplicate Open in study action, and Create patch (currently visible but inert).

---

## Regenerating or extending this set

Run from the repo root with the dev server already running (`npm run dev`, expects `http://localhost:5173`):

```bash
node scripts/capture-reference.mjs            # all screens
node scripts/capture-reference.mjs study      # a single screen (home | study | segmentation | exams | projects)
```

The script is plain Playwright (`chromium.launch()`), not `@playwright/test` — it writes directly into this folder and prints each saved path.

The V2 supplement is not yet part of `capture-reference.mjs`; preserve its 1440×900 viewport and filenames if recapturing it interactively.
