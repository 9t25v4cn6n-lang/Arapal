import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { STATES, gotoState } from '../visual/states.mjs'

const OUT = process.env.RELEASE_AUDIT_DIR || 'artifacts/release-audit/evidence'
const VIEWPORTS = [
  { id: 'mobile-390', width: 390, height: 844 },
  { id: 'tablet-768', width: 768, height: 1024 },
  { id: 'desktop-1280', width: 1280, height: 800 },
  { id: 'desktop-1366', width: 1366, height: 768 },
  { id: 'desktop-1440', width: 1440, height: 900 },
  { id: 'desktop-1920', width: 1920, height: 1080 },
]

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true })
const safe = (s) => String(s).replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')

function writeJson(file, data) {
  ensureDir(path.dirname(file))
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

async function collectElements(page) {
  return page.evaluate(() => {
    const meaningfulSelector = [
      'button', 'a[href]', 'input', 'textarea', 'select',
      '[role="button"]', '[role="tab"]', '[role="option"]', '[role="menuitem"]',
      '[role="dialog"]', '[role="navigation"]', '[role="region"]',
      'h1','h2','h3','h4','h5','h6',
      'article', 'section', 'form',
      '[data-testid]', '[aria-label]', '[aria-labelledby]'
    ].join(',')

    const visible = (el) => {
      const s = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return s.display !== 'none' && s.visibility !== 'hidden' &&
             Number(s.opacity || 1) > 0 && r.width > 0 && r.height > 0
    }

    const roleOf = (el) => el.getAttribute('role') || ({
      BUTTON:'button', A:'link', INPUT:'input', TEXTAREA:'textbox',
      SELECT:'combobox', H1:'heading', H2:'heading', H3:'heading',
      H4:'heading', H5:'heading', H6:'heading'
    }[el.tagName] || '')

    const semanticFamily = (el, s, role, text) => {
      const cls = String(el.className || '').toLowerCase()
      const aria = (el.getAttribute('aria-label') || '').toLowerCase()
      if (/^h[1-6]$/i.test(el.tagName)) return `heading-${el.tagName.toLowerCase()}`
      if (role === 'button' || el.tagName === 'BUTTON') {
        if (/icon|close|collapse|expand|chevron/.test(cls + ' ' + aria) && text.length < 16) return 'icon-button'
        if (/primary|submit|approve|resume|start|save/.test(cls + ' ' + text.toLowerCase())) return 'primary-action'
        return 'button'
      }
      if (/pill|chip|badge|tag/.test(cls)) {
        if (/status|done|review|pass|fail|saved/.test(cls + ' ' + text.toLowerCase())) return 'status-pill'
        return 'pill-chip'
      }
      if (el.tagName === 'INPUT') return 'input'
      if (el.tagName === 'TEXTAREA') return 'textarea'
      if (/card/.test(cls) || el.tagName === 'ARTICLE') return 'card'
      if (/panel|drawer|rail|sidebar/.test(cls)) return 'panel-rail'
      if (role === 'navigation') return 'navigation'
      return role || el.tagName.toLowerCase()
    }

    const nodes = [...document.querySelectorAll(meaningfulSelector)]
      .filter(visible)
      .filter((el, i, arr) => !arr.some((other, j) => j < i && other === el))

    return nodes.map((el, index) => {
      const r = el.getBoundingClientRect()
      const s = getComputedStyle(el)
      const text = (el.innerText || el.value || el.getAttribute('aria-label') || '')
        .replace(/\s+/g, ' ').trim().slice(0, 240)
      const role = roleOf(el)
      return {
        auditIndex: index + 1,
        tag: el.tagName.toLowerCase(),
        role,
        family: semanticFamily(el, s, role, text),
        text,
        ariaLabel: el.getAttribute('aria-label'),
        testId: el.getAttribute('data-testid'),
        className: typeof el.className === 'string' ? el.className : '',
        rect: {
          x: Math.round(r.x * 100) / 100, y: Math.round(r.y * 100) / 100,
          width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100,
          right: Math.round(r.right * 100) / 100, bottom: Math.round(r.bottom * 100) / 100,
        },
        style: {
          display: s.display, position: s.position,
          fontFamily: s.fontFamily, fontSize: s.fontSize,
          fontWeight: s.fontWeight, lineHeight: s.lineHeight,
          color: s.color, backgroundColor: s.backgroundColor,
          borderRadius: s.borderRadius, border: s.border,
          paddingTop: s.paddingTop, paddingRight: s.paddingRight,
          paddingBottom: s.paddingBottom, paddingLeft: s.paddingLeft,
          marginTop: s.marginTop, marginRight: s.marginRight,
          marginBottom: s.marginBottom, marginLeft: s.marginLeft,
          gap: s.gap, overflowX: s.overflowX, overflowY: s.overflowY,
          textAlign: s.textAlign, whiteSpace: s.whiteSpace,
          boxShadow: s.boxShadow,
        },
        state: {
          disabled: !!el.disabled || el.getAttribute('aria-disabled') === 'true',
          expanded: el.getAttribute('aria-expanded'),
          selected: el.getAttribute('aria-selected'),
          pressed: el.getAttribute('aria-pressed'),
          checked: el.checked ?? null,
        }
      }
    })
  })
}

async function addNumberOverlay(page, elements) {
  await page.evaluate((els) => {
    document.getElementById('__release_audit_overlay__')?.remove()
    const root = document.createElement('div')
    root.id = '__release_audit_overlay__'
    Object.assign(root.style, {
      position:'fixed', inset:'0', zIndex:'2147483647',
      pointerEvents:'none', overflow:'visible'
    })
    for (const item of els) {
      const { x, y, width, height } = item.rect
      if (x > innerWidth || y > innerHeight || x + width < 0 || y + height < 0) continue
      const box = document.createElement('div')
      Object.assign(box.style, {
        position:'absolute',
        left:`${Math.max(0,x)}px`, top:`${Math.max(0,y)}px`,
        width:`${Math.max(1,Math.min(width, innerWidth-Math.max(0,x)))}px`,
        height:`${Math.max(1,Math.min(height, innerHeight-Math.max(0,y)))}px`,
        outline:'1px solid rgba(220,38,38,.72)',
        boxSizing:'border-box'
      })
      const label = document.createElement('span')
      label.textContent = String(item.auditIndex)
      Object.assign(label.style, {
        position:'absolute', left:'0', top:'0',
        transform:'translate(-1px,-1px)',
        minWidth:'16px', height:'16px', lineHeight:'16px',
        padding:'0 3px', font:'700 10px/16px Arial,sans-serif',
        background:'#dc2626', color:'#fff',
        borderRadius:'2px', textAlign:'center'
      })
      box.appendChild(label); root.appendChild(box)
    }
    document.body.appendChild(root)
  }, elements)
}

function summarizeFamilies(elements) {
  const groups = {}
  for (const e of elements) {
    const key = e.family || 'unknown'
    ;(groups[key] ||= []).push(e)
  }
  const summary = {}
  for (const [family, rows] of Object.entries(groups)) {
    const freq = (field) => {
      const out = {}
      for (const r of rows) out[field(r)] = (out[field(r)] || 0) + 1
      return out
    }
    summary[family] = {
      count: rows.length,
      heights: freq(r => String(Math.round(r.rect.height))),
      widths: freq(r => String(Math.round(r.rect.width))),
      fontSizes: freq(r => r.style.fontSize),
      fontWeights: freq(r => r.style.fontWeight),
      radii: freq(r => r.style.borderRadius),
      paddings: freq(r => [r.style.paddingTop,r.style.paddingRight,r.style.paddingBottom,r.style.paddingLeft].join(' ')),
      instances: rows.map(r => ({auditIndex:r.auditIndex,text:r.text,rect:r.rect,style:r.style}))
    }
  }
  return summary
}

test.describe('Arapal release evidence', () => {
  test.beforeAll(() => {
    ensureDir(OUT)
    writeJson(path.join(OUT, 'capture-plan.json'), {
      generatedAt: new Date().toISOString(),
      viewports: VIEWPORTS,
      states: STATES.map(({drive, ...s}) => s),
    })
  })

  for (const viewport of VIEWPORTS) {
    for (const state of STATES.filter(s => s.area !== 'legacy')) {
      test(`${state.id} @ ${viewport.id}`, async ({ page }) => {
        test.setTimeout(120000)
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        const consoleMessages = []
        const pageErrors = []
        const failedRequests = []
        page.on('console', m => {
          if (['warning','error'].includes(m.type())) consoleMessages.push({type:m.type(), text:m.text()})
        })
        page.on('pageerror', e => pageErrors.push(String(e)))
        page.on('requestfailed', r => failedRequests.push({url:r.url(), failure:r.failure()?.errorText || ''}))

        const reached = await gotoState(page, state)
        const dir = path.join(OUT, safe(state.id), safe(viewport.id))
        ensureDir(dir)

        if (!reached) {
          writeJson(path.join(dir, 'status.json'), { status:'UNREACHABLE', state:state.id, viewport })
          return
        }

        await expect(page.locator('body')).toBeVisible()
        const settledHash = await page.evaluate(() => location.hash)
        const bodySize = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
          clientWidth: document.documentElement.clientWidth,
          clientHeight: document.documentElement.clientHeight
        }))

        const cleanShot = path.join(dir, 'screen.png')
        await page.screenshot({ path: cleanShot, fullPage: true, animations: 'disabled' })

        const elements = await collectElements(page)
        writeJson(path.join(dir, 'elements.json'), elements)
        writeJson(path.join(dir, 'families.json'), summarizeFamilies(elements))
        writeJson(path.join(dir, 'runtime.json'), {
          settledHash, bodySize, consoleMessages, pageErrors, failedRequests
        })

        await addNumberOverlay(page, elements)
        await page.screenshot({ path: path.join(dir, 'numbered-map.png'), fullPage: true, animations: 'disabled' })

        writeJson(path.join(dir, 'status.json'), {
          status:'CAPTURED', state:state.id, area:state.area, viewport,
          settledHash, elementCount:elements.length,
          cleanScreenshot:'screen.png', numberedScreenshot:'numbered-map.png'
        })
      })
    }
  }
})
