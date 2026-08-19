# Archive

Screens removed from the live app on 2026-08-16 after a screen-by-screen review
(`public/screens.html`). **Moved, not deleted** — git history is intact either way,
but these are kept in-tree because several hold behaviour that has not yet been
ported to their replacements.

Nothing in this directory is imported by the running application. It is excluded
from the visual standard and from the production bundle.

| Archived | Was reachable at | Lines | Replaced by | Note |
|---|---|---|---|---|
| `legacy-screens/SegmentsScreen.jsx` | `#legacy-segments` | 3,225 | `#v2/studyWorkspace` | Superseded study workspace. Was not linked from any navigation; highest collision count in the app. |
| `legacy-screens/RestyleGalleryScreen.jsx` | — | 1,960 | — | Never routed. |
| `legacy-screens/DraftingScreen.jsx` | — | 70 | — | Never routed. |
| `legacy-screens/MainTranslationPage.jsx` | — | 44 | — | Never routed. |
| `legacy-screens/App.before-figma-import.backup.jsx` | — | 5 | — | Stale entry-point backup. |
| `legacy-screens/ProjectsScreen.jsx` | `#projects` | 1,157 | `#v2/projects` | `#projects` now redirects to the V2 screen, so legacy navigation still works. |
| `v2-screens/SegmentationPaste/` | `#v2/segmentationPaste` | 705 | `#v2/segmentationPasteNext` | Two implementations of one screen; the other has the richer layout contract. |
| `v2-screens/AppLaunch/` | `#v2/appLaunch` | — | — | Developer landing page carrying build instructions. Was the default V2 route; default is now `projects`. |
| `v2-screens/ProjectHome/` | `#v2/projectHome` | — | `#home` (for now) | Empty "V2 SCAFFOLD" placeholder on a live rail destination. Rail entry removed until a real screen exists. |
| `v2-screens/Exams/` | `#v2/exams` | — | `#exams` (legacy) | 9-line stub. Legacy Exams remains the only working exam flow. |

## Not archived, deliberately — these still hold capability

- **`src/screens/MakeSegmentationFlowScreen.jsx`** (`#segmentation`, 5,946 lines) — contains the real sentence/paragraph splitting logic, granularity and style options, and the transition preferences. Extract that into a module before archiving the screen.
- **`src/components/figma/`** (`#study`, 5,145 lines across 4 files) — contains the discussion panel (docked, floating, modal), collapsed-rail hover flyouts, and the pass/fail support-card swap. `#v2/studyWorkspace` does not have these yet.

Both are marked for archive; neither can go until its behaviour is ported.
