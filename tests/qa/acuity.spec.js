// Synthetic acuity: prove the probe can see each defect class on demand.
//
// Why this exists. The original calibration asserted that each rule fires
// somewhere in the product. That is circular — it proves the checker reproduces
// defects its own author already found — and it breaks the moment a rule is
// genuinely fixed everywhere, which is the outcome we want. A silent rule then
// looks identical to a blind one, which is precisely how the previous audit
// system reported auditTrust: 98 while seeing nothing.
//
// Here we inject a known defect into a real page, run the real probe against
// it, and require the finding. Zero findings in the product then means "clean",
// not "blind" — because acuity is proved independently.

import { test, expect } from '@playwright/test'
import { evaluate } from '../../scripts/qa/probe.mjs'
import { THRESHOLDS, TYPE_RAMP, TEXT_COLOR_POLICY, REQUIRED_FONT_FAMILIES, TRUNCATION_EXEMPT_SELECTORS } from '../../scripts/qa/standard.mjs'

const CONFIG = { THRESHOLDS, TYPE_RAMP, TEXT_COLOR_POLICY, REQUIRED_FONT_FAMILIES, TRUNCATION_EXEMPT_SELECTORS }
const probeSource = evaluate.toString()

/** Inject `html` into a blank page, run the probe, return its findings. */
async function probeWith(page, html) {
  await page.goto('about:blank')
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#fff">${html}</body></html>`)
  await page.waitForTimeout(120)
  const out = await page.evaluate(
    ([src, cfg]) => new Function('config', `return (${src})(config)`)(cfg),
    [probeSource, CONFIG],
  )
  return out.findings
}

const ruleIds = (findings) => [...new Set(findings.map((f) => f.ruleId))]

test.describe('probe acuity — each rule proved on a known defect', () => {
  test('sees a container narrower than its in-flow content', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="width:40px;overflow:hidden">
        <div style="width:160px;height:20px">far too wide for its container</div>
      </div>`)
    expect(ruleIds(findings)).toContain('container-undersized')
  })

  test('ignores decorative overflow from an absolutely-positioned layer', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="position:relative;width:120px;height:40px;overflow:hidden">
        <span style="position:absolute;inset:-20px;background:rgba(0,0,255,.1)"></span>
        <span style="font-size:14px;color:#0F172A">fits fine</span>
      </div>`)
    expect(
      ruleIds(findings),
      'a glow larger than its control is correct as rendered, not clipped content',
    ).not.toContain('container-undersized')
  })

  test('sees two elements overlapping', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="position:relative;height:80px">
        <span style="position:absolute;left:0;top:0;font-size:16px;color:#0F172A">First piece of text</span>
        <span style="position:absolute;left:20px;top:4px;font-size:16px;color:#0F172A">Second piece of text</span>
      </div>`)
    expect(ruleIds(findings)).toContain('overlap')
  })

  test('allows declared docked chrome to pass over content', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="position:relative;height:80px">
        <p style="position:absolute;left:0;top:40px;font-size:16px;color:#0F172A">A segment card</p>
        <div data-docked-chrome style="position:absolute;left:0;top:36px;background:#FFF">
          <button style="min-height:44px;padding:0 24px;font-size:14px">Approve</button>
        </div>
      </div>`)
    expect(
      ruleIds(findings),
      'a bottom action bar passes over the scroll region by design and the content is still reachable',
    ).not.toContain('overlap')
  })

  test('still sees an overlap when neither side declares itself chrome', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="position:relative;height:80px">
        <p style="position:absolute;left:0;top:40px;font-size:16px;color:#0F172A">A segment card</p>
        <div style="position:absolute;left:0;top:36px;background:#FFF">
          <button style="min-height:44px;padding:0 24px;font-size:14px">Approve</button>
        </div>
      </div>`)
    expect(
      ruleIds(findings),
      'the exemption must require the attribute — otherwise it excuses every collision',
    ).toContain('overlap')
  })

  test('sees a container clipping content while its parent has room spare', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="display:flex;flex-direction:column;height:300px">
        <div style="height:40px;font-size:14px;color:#0F172A">header</div>
        <div style="flex:0 1 auto;height:80px;overflow-y:auto;scrollbar-width:none">
          <div style="height:400px;font-size:14px;color:#0F172A">a long passage</div>
        </div>
      </div>`)
    expect(
      ruleIds(findings),
      'unused room AND cut content at once means nothing claimed the slack',
    ).toContain('slack-beside-clipped-content')
  })

  test('accepts a scroll region whose parent has no room to give', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="display:flex;flex-direction:column;height:120px">
        <div style="height:40px;font-size:14px;color:#0F172A">header</div>
        <div style="flex:1 1 auto;min-height:0;overflow-y:auto">
          <div style="height:400px;font-size:14px;color:#0F172A">a long passage</div>
        </div>
      </div>`)
    expect(
      ruleIds(findings),
      'a region that already fills its parent and scrolls is correct, not a defect',
    ).not.toContain('slack-beside-clipped-content')
  })

  test('sees text below the type floor', async ({ page }) => {
    const findings = await probeWith(page, `<p style="font-size:9px;color:#0F172A">tiny</p>`)
    expect(ruleIds(findings)).toContain('type-floor')
  })

  test('sees text below the contrast minimum', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="background:#FFFFFF"><p style="font-size:14px;color:#D8DEE7">barely visible</p></div>`)
    expect(ruleIds(findings)).toContain('contrast')
  })

  test('does not report contrast it cannot compute', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="background-image:linear-gradient(#2563EB,#1D4ED8)">
        <p style="font-size:14px;color:#FFFFFF">white on a gradient</p>
      </div>`)
    expect(
      findings.filter((f) => f.ruleId === 'contrast'),
      'contrast over a gradient is unknown, and unknown must not be reported as a failure',
    ).toHaveLength(0)
  })

  test('sees an interactive target below the minimum', async ({ page }) => {
    const findings = await probeWith(page, `<button style="width:16px;height:16px">x</button>`)
    expect(ruleIds(findings)).toContain('hit-target')
  })

  test('sees a control with no accessible name', async ({ page }) => {
    const findings = await probeWith(page, `<button style="width:48px;height:48px"></button>`)
    expect(ruleIds(findings)).toContain('unnamed-control')
  })

  test('sees an element escaping the frame', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="position:relative;width:4000px;height:60px;background:#EEE">too wide</div>`)
    expect(ruleIds(findings)).toContain('viewport-escape')
  })

  test('sees a chrome label cut off by layout pressure', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="width:60px;font-size:13px;color:#0F172A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
        SOURCE TEXT
      </div>`)
    expect(ruleIds(findings)).toContain('label-truncated')
  })

  test('does not report a truncation the design declares', async ({ page }) => {
    const findings = await probeWith(page, `
      <div data-truncates style="width:60px;font-size:13px;color:#0F172A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
        A project title supplied by the user
      </div>`)
    expect(
      ruleIds(findings),
      'user data is expected to ellipsise; only the product’s own chrome must fit',
    ).not.toContain('label-truncated')
  })

  test('sees a scroll region that hides its scrollbar and signals nothing', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="height:60px;overflow-y:auto;scrollbar-width:none">
        <div style="height:400px;font-size:14px;color:#0F172A">a great deal of content</div>
      </div>`)
    expect(ruleIds(findings)).toContain('scroll-without-affordance')
  })

  test('accepts a hidden scrollbar when the edge is faded instead', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="height:60px;overflow-y:auto;scrollbar-width:none;
                  mask-image:linear-gradient(to bottom,#000 calc(100% - 24px),transparent 100%)">
        <div style="height:400px;font-size:14px;color:#0F172A">a great deal of content</div>
      </div>`)
    expect(
      ruleIds(findings),
      'a faded edge is a real affordance; the rule is about silence, not about scrollbars',
    ).not.toContain('scroll-without-affordance')
  })

  test('leaves a visible scrollbar alone', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="height:60px;overflow-y:auto">
        <div style="height:400px;font-size:14px;color:#0F172A">a great deal of content</div>
      </div>`)
    expect(ruleIds(findings)).not.toContain('scroll-without-affordance')
  })

  test('sees a control that shows nothing when focused', async ({ page }) => {
    const findings = await probeWith(page, `
      <style>button:focus, button:focus-visible { outline: none }</style>
      <button style="min-height:44px;padding:0 24px;font-size:14px;color:#FFFFFF;background:#1D4ED8;border:0">
        Continue
      </button>`)
    expect(ruleIds(findings)).toContain('focus-invisible')
  })

  test('accepts a control with a real focus ring', async ({ page }) => {
    const findings = await probeWith(page, `
      <style>button:focus-visible { outline: 2px solid #1D4ED8; outline-offset: 2px }</style>
      <button style="min-height:44px;padding:0 24px;font-size:14px;color:#FFFFFF;background:#1D4ED8;border:0">
        Continue
      </button>`)
    expect(ruleIds(findings)).not.toContain('focus-invisible')
  })

  test('accepts a focus indicator that is not an outline', async ({ page }) => {
    const findings = await probeWith(page, `
      <style>
        button { outline: none }
        button:focus-visible { box-shadow: 0 0 0 3px rgba(29,78,216,.4) }
      </style>
      <button style="min-height:44px;padding:0 24px;font-size:14px;color:#FFFFFF;background:#1D4ED8;border:0">
        Continue
      </button>`)
    expect(
      ruleIds(findings),
      'a ring drawn with box-shadow is a focus indicator; the rule is about visibility, not about the outline property',
    ).not.toContain('focus-invisible')
  })

  test('treats a deliberate ellipsis as designed, not clipped', async ({ page }) => {
    const findings = await probeWith(page, `
      <div style="width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;color:#0F172A">
        a title far too long for the space it has been given
      </div>`)
    expect(ruleIds(findings)).not.toContain('container-undersized')
  })

  test('a clean page produces no findings', async ({ page }) => {
    const findings = await probeWith(page, `
      <main style="padding:24px;background:#FFFFFF">
        <h1 style="font-size:26px;color:#0F172A;margin:0 0 12px">A heading</h1>
        <p style="font-size:14px;color:#334155;margin:0 0 16px">Readable body text at an adequate size.</p>
        <button style="min-height:44px;padding:0 24px;font-size:14px;color:#FFFFFF;background:#1D4ED8;border:0">
          Continue
        </button>
      </main>`)
    expect(findings, `unexpected: ${JSON.stringify(findings)}`).toHaveLength(0)
  })
})
