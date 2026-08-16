#!/usr/bin/env node
// Builds public/screens.html — a clickable contact sheet of every screen in the
// repo, grouped by product function, so duplicate implementations can be
// compared side by side and one chosen. Disposable tooling: delete once the
// screen set is settled.

import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '../..')
const SHOTS = path.join(REPO, 'public', 'screens')
const BASE = 'http://localhost:5173'

const GROUPS = [
  {
    id: 'home', title: 'Home / landing', note: 'Legacy home kept; the empty V2 scaffold and the developer landing page are archived.',
    screens: [
      { id: 'legacy-home', hash: 'home', impl: 'legacy', file: 'src/screens/ProjectHomeScreen.jsx', lines: 906, verdict: 'keep-for-now', why: 'Your pick. The only working home. Rebuild on V2 later; no V2 replacement exists yet.' },
    ],
  },
  {
    id: 'projects', title: 'Project library', note: 'Legacy archived; #projects now redirects here.',
    screens: [
      { id: 'v2-projects', hash: 'v2/projects', impl: 'v2', file: 'src/v2/screens/Projects/', lines: 1207, verdict: 'keep', why: 'Now the default V2 route.' },
    ],
  },
  {
    id: 'intake', title: 'Source intake + segmentation', note: 'One paste screen now. Legacy retained only until its splitting logic is extracted.',
    screens: [
      { id: 'v2-segmentationPasteNext', hash: 'v2/segmentationPasteNext', impl: 'v2', file: 'src/v2/screens/SegmentationPasteNext/', lines: 275, verdict: 'keep', why: 'Your pick. Now holds the Segmentation slot in the nav rail.' },
      { id: 'legacy-segmentation', hash: 'segmentation', impl: 'legacy', file: 'src/screens/MakeSegmentationFlowScreen.jsx', lines: 5946, verdict: 'blocked', why: 'BLOCKED — holds the real sentence/paragraph splitting logic and the options model. Extract that first, then archive.' },
      { id: 'v2-segmentationTransition', hash: 'v2/segmentationTransition', impl: 'v2', file: 'src/v2/screens/SegmentationTransition/', lines: 0, verdict: 'keep', why: 'Processing animation.' },
      { id: 'v2-segmentationLoading', hash: 'v2/segmentationLoading', impl: 'v2', file: 'src/v2/screens/SegmentationLoading/', lines: 0, verdict: 'keep', why: 'Loading state.' },
      { id: 'v2-segmentationReview', hash: 'v2/segmentationReview', impl: 'v2', file: 'src/v2/screens/SegmentationReview/', lines: 673, verdict: 'keep', why: 'Review + approve. Floating toolbar still covers 30px of the right column.' },
      { id: 'v2-segmentationSuccess', hash: 'v2/segmentationSuccess', impl: 'v2', file: 'src/v2/screens/SegmentationSuccess/', lines: 0, verdict: 'keep', why: 'Publish confirmation.' },
    ],
  },
  {
    id: 'study', title: 'Study workspace', note: 'Two left. The orphaned third is archived.',
    screens: [
      { id: 'v2-studyWorkspace', hash: 'v2/studyWorkspace', impl: 'v2', file: 'src/v2/screens/StudyWorkspace/', lines: 493, verdict: 'keep', why: 'Your pick. The target.' },
      { id: 'legacy-study', hash: 'study', impl: 'legacy', file: 'src/components/figma/', lines: 5145, verdict: 'blocked', why: 'BLOCKED — holds the discussion panel (docked/floating/modal), collapsed-rail hover flyouts and the pass/fail card swap. V2 has none of these yet.' },
    ],
  },
  {
    id: 'research', title: 'Research',
    note: 'Now in the navigation rail for the first time.',
    screens: [
      { id: 'v2-projectResearch', hash: 'v2/projectResearch', impl: 'v2', file: 'src/v2/screens/ProjectResearch/', lines: 2313, verdict: 'keep', why: 'Your pick. Added to the rail (order 21).' },
    ],
  },
  {
    id: 'exams', title: 'Exams', note: 'V2 stub archived; legacy is the flow.',
    screens: [
      { id: 'legacy-exams', hash: 'exams', impl: 'legacy', file: 'src/screens/ExamsScreen.jsx', lines: 2095, verdict: 'keep-for-now', why: 'Your pick. The only working exam flow. No V2 route exists now — rebuild before retiring.' },
    ],
  },
  {
    id: 'dev', title: 'Developer surfaces', note: 'Kept, not product.',
    screens: [
      { id: 'v2-qualityDashboard', hash: 'v2/qualityDashboard', impl: 'dev', file: 'src/v2/screens/QualityDashboard/', lines: 1173, verdict: 'rewire', why: 'Still showing productQuality 74.6 / auditTrust 98 from April. Repoint at artifacts/qa/visual-standard.json.' },
      { id: 'v2-foundationLab', hash: 'v2/foundationLab', impl: 'dev', file: 'src/v2/screens/FoundationLab/', lines: 0, verdict: 'keep-dev', why: 'Design-system lab.' },
      { id: 'v2-controlsLab', hash: 'v2/controlsLab', impl: 'dev', file: 'src/v2/screens/ControlsLab/', lines: 286, verdict: 'keep-dev', why: 'Control families lab.' },
      { id: 'v2-editorPanelsLab', hash: 'v2/editorPanelsLab', impl: 'dev', file: 'src/v2/screens/EditorPanelsLab/', lines: 0, verdict: 'keep-dev', why: 'Editor panel lab.' },
      { id: 'v2-typographyTokensLab', hash: 'v2/typographyTokensLab', impl: 'dev', file: 'src/v2/screens/TypographyTokensLab/', lines: 345, verdict: 'keep-dev', why: 'Type ramp lab.' },
      { id: 'v2-motionInteractionLab', hash: 'v2/motionInteractionLab', impl: 'dev', file: 'src/v2/screens/MotionInteractionLab/', lines: 0, verdict: 'keep-dev', why: 'Motion lab.' },
      { id: 'v2-patternLab', hash: 'v2/patternLab', impl: 'dev', file: 'src/v2/screens/PatternLab/', lines: 0, verdict: 'keep-dev', why: 'Pattern lab.' },
    ],
  },
]

async function resolveExecutable() {
  const cacheRoot = path.join(process.env.HOME ?? '', 'Library/Caches/ms-playwright')
  const entries = await fs.readdir(cacheRoot)
  for (const shell of entries.filter((e) => e.startsWith('chromium_headless_shell-')).sort().reverse()) {
    const p = path.join(cacheRoot, shell, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell')
    try { await fs.access(p); return p } catch { /* next */ }
  }
  return undefined
}

await fs.mkdir(SHOTS, { recursive: true })
const browser = await chromium.launch({ executablePath: await resolveExecutable() })
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()

for (const group of GROUPS) {
  for (const s of group.screens) {
    if (!s.hash) continue
    await page.goto(`${BASE}/?chrome=0#${s.hash}`, { waitUntil: 'domcontentloaded' })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2600)
    await page.screenshot({ path: path.join(SHOTS, `${s.id}.png`) })
    process.stdout.write('.')
  }
}
await browser.close()
console.log('\nscreenshots captured')

const badge = {
  keep: ['KEEP', '#15803D', '#DCFCE7'],
  'keep-for-now': ['KEEP FOR NOW', '#B45309', '#FEF3C7'],
  'keep-dev': ['DEV ONLY', '#475569', '#E2E8F0'],
  build: ['BUILD', '#1D4ED8', '#DBEAFE'],
  rewire: ['REWIRE', '#B45309', '#FEF3C7'],
  archive: ['ARCHIVE LATER', '#BE123C', '#FFE4E6'],
  blocked: ['BLOCKED — PORT FIRST', '#B45309', '#FEF3C7'],
  'archive-now': ['ARCHIVE NOW', '#BE123C', '#FFE4E6'],
}

const cards = (g) => g.screens.map((s) => {
  const [txt, fg, bg] = badge[s.verdict]
  const shot = s.hash
    ? `<a href="${BASE}/?chrome=0#${s.hash}" target="_blank"><img src="/screens/${s.id}.png" alt="${s.id}"></a>`
    : `<div class="noshot">no route — not rendered anywhere</div>`
  const link = s.hash ? `<a class="route" href="${BASE}/?chrome=0#${s.hash}" target="_blank">#${s.hash} ↗</a>` : '<span class="route dead">no route</span>'
  return `<article class="card ${s.verdict}">
    ${shot}
    <div class="meta">
      <div class="row"><span class="badge" style="color:${fg};background:${bg}">${txt}</span><span class="impl impl-${s.impl}">${s.impl}</span></div>
      ${link}
      <p class="file">${s.file}${s.lines ? ` · ${s.lines} lines` : ''}</p>
      <p class="why">${s.why}</p>
    </div>
  </article>`
}).join('')

const html = `<!doctype html><html><head><meta charset="utf-8">
<title>Arapal — screen inventory</title><style>
*{box-sizing:border-box}
body{margin:0;padding:32px 40px 80px;background:#eef4fa;color:#0f172a;font:14px/1.5 Inter,system-ui,sans-serif}
h1{font:700 34px/1.1 "Playfair Display",Georgia,serif;margin:0 0 4px}
.sub{color:#475569;margin:0 0 28px;max-width:70ch}
h2{font:700 20px/1.2 "Playfair Display",Georgia,serif;margin:38px 0 2px}
.gnote{color:#64748b;margin:0 0 14px;font-size:13px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:18px}
.card{background:#fff;border:1px solid #dbe4ef;border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.card.keep{border-color:#86efac;box-shadow:0 0 0 2px #dcfce7}
.card.build{border-color:#93c5fd;box-shadow:0 0 0 2px #dbeafe}
.card img{width:100%;display:block;border-bottom:1px solid #e2e8f0;aspect-ratio:16/10;object-fit:cover;object-position:top}
.noshot{padding:52px 16px;text-align:center;color:#94a3b8;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:13px}
.meta{padding:12px 14px 14px}
.row{display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap}
.badge{font-size:10px;font-weight:800;letter-spacing:.08em;padding:4px 8px;border-radius:999px}
.impl{font-size:10px;font-weight:700;letter-spacing:.06em;padding:4px 8px;border-radius:999px;background:#f1f5f9;color:#64748b;text-transform:uppercase}
.impl-v2{background:#eff6ff;color:#1d4ed8}
.impl-legacy{background:#fef3c7;color:#92400e}
.impl-dead,.impl-orphan{background:#ffe4e6;color:#9f1239}
a.route{display:inline-block;font:600 13px/1 ui-monospace,monospace;color:#2563eb;text-decoration:none;margin-bottom:8px}
a.route:hover{text-decoration:underline}
.route.dead{color:#94a3b8}
.file{margin:0 0 8px;font:400 11px/1.4 ui-monospace,monospace;color:#64748b;word-break:break-all}
.why{margin:0 0 10px;font-size:13px;color:#334155}
.pick{display:flex;gap:7px;align-items:center;font-size:12px;font-weight:600;color:#475569;border-top:1px solid #f1f5f9;padding-top:9px}
.legend{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px}
</style></head><body>
<h1>Arapal — surviving screens</h1>
<p class="sub">After the 2026-08-16 review. 10 screens archived to <code>archive/</code> (moved, not deleted — see <code>archive/README.md</code>).
Captured live at 1440×900 just now; click any image to open it in the running app.
Two legacy screens are marked BLOCKED: they are agreed for archive but still hold behaviour their V2 replacement does not have.</p>
<div class="legend">
  <span class="badge" style="color:#15803D;background:#DCFCE7">KEEP</span>
  <span class="badge" style="color:#1D4ED8;background:#DBEAFE">BUILD — target exists but is empty</span>
  <span class="badge" style="color:#B45309;background:#FEF3C7">KEEP FOR NOW — no replacement yet</span>
  <span class="badge" style="color:#BE123C;background:#FFE4E6">ARCHIVE</span>
  <span class="badge" style="color:#475569;background:#E2E8F0">DEV ONLY</span>
</div>
${GROUPS.map((g) => `<h2>${g.title}</h2><p class="gnote">${g.note}</p><div class="grid">${cards(g)}</div>`).join('')}
</body></html>`

await fs.writeFile(path.join(REPO, 'public', 'screens.html'), html)
console.log('public/screens.html written →  http://localhost:5173/screens.html')
