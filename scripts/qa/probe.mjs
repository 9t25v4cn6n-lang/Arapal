// Browser-side rule evaluation. Serialised into the page by run.mjs.
//
// Design note: every rect is clipped to its nearest clipping ancestor before
// comparison. Without this, content inside a scroll region reports its full
// unscrolled height and collides with everything below it — the single largest
// source of false positives in a naive geometric checker.

export function evaluate(config) {
  const {
    THRESHOLDS, TYPE_RAMP, TEXT_COLOR_POLICY, REQUIRED_FONT_FAMILIES,
    TRUNCATION_EXEMPT_SELECTORS = [],
  } = config
  const findings = []
  const round = (n) => Math.round(n * 10) / 10

  const add = (ruleId, detail) => findings.push({ ruleId, ...detail })

  // ── helpers ────────────────────────────────────────────────────────────────
  const describe = (el) => {
    if (!el) return '<none>'
    const cls = String(el.className?.baseVal ?? el.className ?? '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.')
    const id = el.id ? `#${el.id}` : ''
    return el.tagName.toLowerCase() + id + (cls ? '.' + cls : '')
  }
  const label = (el) => (el.getAttribute?.('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 44)

  const isVisible = (el) => {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false
    const r = el.getBoundingClientRect()
    return r.width > 0.5 && r.height > 0.5
  }

  // Decorative subtrees (backdrops, watermarks) are exempt from content rules.
  const isDecorative = (el) => !!el.closest('[aria-hidden="true"]')

  const clips = (cs) => cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible'

  /** Intersect a rect with every clipping ancestor, so we measure what is actually on screen. */
  const visibleRect = (el) => {
    let r = el.getBoundingClientRect()
    let box = { left: r.left, top: r.top, right: r.right, bottom: r.bottom }
    let p = el.parentElement
    while (p && p !== document.documentElement) {
      const cs = getComputedStyle(p)
      if (clips(cs)) {
        const pr = p.getBoundingClientRect()
        box.left = Math.max(box.left, pr.left)
        box.top = Math.max(box.top, pr.top)
        box.right = Math.min(box.right, pr.right)
        box.bottom = Math.min(box.bottom, pr.bottom)
        if (box.right <= box.left || box.bottom <= box.top) return null // fully clipped away
      }
      p = p.parentElement
    }
    return box
  }

  const parseColor = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const p = m[1].split(',').map(Number)
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }
  }
  const blend = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  })
  /**
   * Resolve the effective background behind text.
   * Returns null when an ancestor paints a gradient or image, because the
   * contrast of text over a gradient cannot be computed from styles alone.
   * Reporting "unknown" is correct; assuming white produced 32 false
   * "white text at 1:1" findings on gradient buttons, and a checker that
   * cries wolf gets switched off.
   */
  const backgroundBehind = (el) => {
    let p = el
    let acc = null
    while (p && p !== document.documentElement) {
      const cs = getComputedStyle(p)
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null
      const c = parseColor(cs.backgroundColor)
      if (c && c.a > 0) {
        acc = acc ? blend(acc, c) : c
        if (acc.a >= 0.99) return acc
      }
      p = p.parentElement
    }
    const base = { r: 255, g: 255, b: 255, a: 1 }
    return acc ? blend(acc, base) : base
  }
  const luminance = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b)
  }
  const contrastRatio = (a, b) => {
    const l1 = luminance(a), l2 = luminance(b)
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  }

  const all = [...document.querySelectorAll('body *')].filter(
    (e) => !['SCRIPT', 'STYLE', 'BR'].includes(e.tagName) && isVisible(e),
  )
  const content = all.filter((e) => !isDecorative(e))

  // Elements that render their OWN text. Not "leaf elements" — an <h1> holding
  // an icon plus a title still renders text, and excluding it was the reason an
  // earlier version of this checker missed a 125x21px title/status collision.
  const ownsText = (e) => {
    for (const node of e.childNodes) {
      if (node.nodeType === 3 && node.textContent.trim().length > 0) return true
    }
    return false
  }

  // A visually-hidden element carries text for assistive technology and renders
  // none. Measuring it as rendered text is how the truncation rule first
  // reported a 1px sr-only span as a cut label: correct arithmetic, wrong
  // subject. Its size and its clip are both part of the idiom, so both are
  // checked rather than trusting either alone.
  const isScreenReaderOnly = (e) => {
    const r = e.getBoundingClientRect()
    if (r.width > 2 && r.height > 2) return false
    const cs = getComputedStyle(e)
    return cs.position === 'absolute' || cs.clipPath !== 'none' || cs.overflow === 'hidden'
  }
  const textLeaves = content.filter((e) => ownsText(e) && !isScreenReaderOnly(e))

  const FOCUSABLE = 'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"]),[role="button"]'
  const controls = content.filter((e) => e.matches(FOCUSABLE))

  // ── RULE: container-undersized ─────────────────────────────────────────────
  // A clipping container narrower/shorter than the content it holds. This is the
  // "the container width was chosen independently of what it holds" failure.
  for (const el of content) {
    const cs = getComputedStyle(el)
    if (!clips(cs)) continue
    const dx = el.scrollWidth - el.clientWidth
    const dy = el.scrollHeight - el.clientHeight
    const scrollableX = cs.overflowX === 'auto' || cs.overflowX === 'scroll'
    const scrollableY = cs.overflowY === 'auto' || cs.overflowY === 'scroll'
    // An element declaring text-overflow:ellipsis or -webkit-line-clamp has an
    // explicit overflow strategy: the truncation is designed, not accidental.
    // Without this the checker cannot tell a deliberate truncating title from a
    // container that silently eats its own content.
    const declaresTruncation =
      (cs.textOverflow && cs.textOverflow !== 'clip') ||
      (cs.webkitLineClamp && cs.webkitLineClamp !== 'none')
    if (declaresTruncation) continue

    // Decorative overflow is not clipped content.
    //
    // scrollHeight/scrollWidth include absolutely-positioned descendants, so a
    // glow or sheen layer deliberately larger than its control reads as the
    // control eating its own content. A primary CTA with a 76px glow inside a
    // 56px button is correct as rendered. Only overflow caused by an in-flow
    // child is a real finding.
    const overflowsInFlow = (axis) => {
      const box = el.getBoundingClientRect()
      for (const child of el.children) {
        if (getComputedStyle(child).position === 'absolute') continue
        const r = child.getBoundingClientRect()
        if (axis === 'y' && r.bottom > box.bottom + 1) return true
        if (axis === 'x' && r.right > box.right + 1) return true
      }
      return false
    }

    if (dx > THRESHOLDS.maxHiddenPx && !scrollableX && overflowsInFlow('x')) {
      add('container-undersized', {
        selector: describe(el), label: label(el), axis: 'x', hiddenPx: dx,
        boxPx: el.clientWidth, contentPx: el.scrollWidth,
      })
    }
    if (dy > THRESHOLDS.maxHiddenPx && !scrollableY && overflowsInFlow('y')) {
      add('content-clipped', {
        selector: describe(el), label: label(el), axis: 'y', hiddenPx: dy,
        boxPx: el.clientHeight, contentPx: el.scrollHeight,
      })
    }
    // ── RULE: scroll-hidden-majority ────────────────────────────────────────
    if (scrollableY && dy > 8) {
      const ratio = dy / el.scrollHeight
      if (ratio > THRESHOLDS.maxUnsignalledScrollRatio) {
        add('scroll-hidden-majority', {
          selector: describe(el), label: label(el),
          hiddenPx: dy, shownPx: el.clientHeight, hiddenRatio: round(ratio * 100) + '%',
        })
      }
    }

    // ── RULE: scroll-without-affordance ─────────────────────────────────────
    // A region that scrolls but hides its scrollbar looks identical to one that
    // clips: the content is simply cut at a hard edge. Either the scrollbar is
    // visible, or something else must say "there is more" — a fade mask is what
    // this codebase uses. Neither is a defect the geometry rules can see, which
    // is why a half-sliced line of Arabic survived a clean report.
    const hidesScrollbar = cs.scrollbarWidth === 'none'
    const signals = cs.maskImage !== 'none' || cs.webkitMaskImage !== 'none'
    const overflowAxes = []
    if (scrollableY && dy > THRESHOLDS.minSignallableOverflowPx) overflowAxes.push('y')
    if (scrollableX && dx > THRESHOLDS.minSignallableOverflowPx) overflowAxes.push('x')
    if (overflowAxes.length > 0 && hidesScrollbar && !signals) {
      add('scroll-without-affordance', {
        selector: describe(el), label: label(el),
        axis: overflowAxes.join('+'),
        hiddenPx: overflowAxes.includes('y') ? dy : dx,
      })
    }
  }

  // ── RULE: overlap ──────────────────────────────────────────────────────────
  // Text and interactive controls may not occupy the same pixels.
  const significant = [...new Set([...textLeaves, ...controls])]
    .map((el) => ({ el, box: visibleRect(el) }))
    .filter((x) => x.box && x.box.right - x.box.left > 1 && x.box.bottom - x.box.top > 1)

  const seenPairs = new Set()
  for (let i = 0; i < significant.length; i++) {
    for (let j = i + 1; j < significant.length; j++) {
      const A = significant[i], B = significant[j]
      if (A.el.contains(B.el) || B.el.contains(A.el)) continue
      const ox = Math.min(A.box.right, B.box.right) - Math.max(A.box.left, B.box.left)
      const oy = Math.min(A.box.bottom, B.box.bottom) - Math.max(A.box.top, B.box.top)
      if (ox <= THRESHOLDS.maxOverlapPx || oy <= THRESHOLDS.maxOverlapPx) continue
      // A control legitimately contains its own label; skip same-control pairs.
      if (A.el.closest('button,a') && A.el.closest('button,a') === B.el.closest('button,a')) continue
      const key = describe(A.el) + '|' + describe(B.el)
      if (seenPairs.has(key)) continue
      seenPairs.add(key)
      add('overlap', {
        selector: describe(A.el), label: label(A.el),
        otherSelector: describe(B.el), otherLabel: label(B.el),
        overlapPx: `${round(ox)}x${round(oy)}`,
      })
    }
  }

  // ── RULE: viewport-escape ──────────────────────────────────────────────────
  for (const el of all) {
    const cs = getComputedStyle(el)
    if (cs.position === 'fixed') continue
    const r = el.getBoundingClientRect()
    if (r.width < 4 || r.height < 4) continue
    let p = el.parentElement, inScroller = false
    while (p && p !== document.body) {
      const pcs = getComputedStyle(p)
      if (pcs.overflowX === 'auto' || pcs.overflowX === 'scroll') { inScroller = true; break }
      p = p.parentElement
    }
    if (inScroller) continue
    const escape = Math.max(r.right - innerWidth, -r.left)
    // A decorative backdrop is allowed to bleed past the frame — that is the
    // effect. It only becomes a defect when it forces the document to scroll,
    // which is the thing a user actually experiences.
    const forcesScroll = document.documentElement.scrollWidth > innerWidth + 1
    if (escape > THRESHOLDS.maxViewportEscapePx && (!isDecorative(el) || forcesScroll)) {
      add('viewport-escape', {
        selector: describe(el), label: label(el),
        escapePx: round(escape), left: round(r.left), right: round(r.right),
        decorative: isDecorative(el),
      })
    }
  }

  // ── RULE: type-floor + type-drift + contrast ───────────────────────────────
  const driftSizes = new Set()
  const seenType = new Set()
  const seenContrast = new Set()
  for (const el of textLeaves) {
    const cs = getComputedStyle(el)
    const size = parseFloat(cs.fontSize)
    const weight = parseInt(cs.fontWeight) || 400
    const key = describe(el) + '|' + size

    if (size < THRESHOLDS.minFontSizePx && !seenType.has(key)) {
      seenType.add(key)
      add('type-floor', { selector: describe(el), label: label(el), sizePx: size, minPx: THRESHOLDS.minFontSizePx })
    }
    if (!TYPE_RAMP.includes(size)) driftSizes.add(size)

    const fg = parseColor(cs.color)
    const bg = fg ? backgroundBehind(el) : null
    if (fg && bg) {
      const ratio = contrastRatio(blend(fg, bg), bg)
      const isLarge = size >= 24 || (size >= 18.66 && weight >= 700)
      const need = isLarge ? THRESHOLDS.contrastLarge : THRESHOLDS.contrastNormal
      const ck = cs.color + '|' + size + '|' + describe(el)
      if (ratio < need && !seenContrast.has(ck)) {
        seenContrast.add(ck)
        add('contrast', {
          selector: describe(el), label: label(el),
          color: cs.color, sizePx: size, ratio: round(ratio), required: need,
        })
      }
    }
  }
  if (driftSizes.size > 0) {
    add('type-drift', { offRampSizes: [...driftSizes].sort((a, b) => a - b), rampSize: TYPE_RAMP.length })
  }

  // ── RULE: label-truncated ──────────────────────────────────────────────────
  // A deliberate ellipsis on user data is design; a cut on the product's own
  // chrome is a defect. "SOURCE TEXT" rendering as "SOURCE T…" is not a smaller
  // version of the label, it is a different and wrong one — and the existing
  // rules exempt every ellipsis equally, so it reported clean.
  const seenTruncation = new Set()
  const exempt = (el) => TRUNCATION_EXEMPT_SELECTORS.some((sel) => {
    try { return el.closest(sel) } catch { return false }
  })
  for (const el of textLeaves) {
    if (exempt(el)) continue
    const cs = getComputedStyle(el)
    // Only a single-line, non-wrapping element can be cut horizontally in a way
    // the user reads as truncation; a wrapped paragraph is measured elsewhere.
    if (cs.whiteSpace !== 'nowrap' && cs.whiteSpace !== 'pre') continue
    const cut = el.scrollWidth - el.clientWidth
    if (cut <= THRESHOLDS.maxLabelClipPx) continue
    const key = describe(el) + '|' + label(el)
    if (seenTruncation.has(key)) continue
    seenTruncation.add(key)
    add('label-truncated', {
      selector: describe(el), label: label(el),
      cutPx: round(cut), shownPx: el.clientWidth, neededPx: el.scrollWidth,
    })
  }

  // ── RULE: hit-target + unnamed-control ─────────────────────────────────────
  const seenControl = new Set()
  for (const el of controls) {
    const r = el.getBoundingClientRect()
    const key = describe(el) + '|' + label(el)
    if (seenControl.has(key)) continue
    seenControl.add(key)

    const name = el.getAttribute('aria-label') || el.getAttribute('title') ||
      (el.getAttribute('aria-labelledby') ? 'labelledby' : '') ||
      (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
        ? (el.labels?.length ? 'label' : el.getAttribute('placeholder') ? '' : '')
        : (el.textContent || '').trim())
    if (!name) add('unnamed-control', { selector: describe(el), tag: el.tagName, boxPx: `${round(r.width)}x${round(r.height)}` })

    const min = Math.min(r.width, r.height)
    if (min > 0 && min < THRESHOLDS.minTargetPx) {
      add('hit-target', {
        selector: describe(el), label: label(el),
        boxPx: `${round(r.width)}x${round(r.height)}`, minPx: THRESHOLDS.minTargetPx,
      })
    }
  }

  // ── RULE: font-not-loaded ──────────────────────────────────────────────────
  const loaded = new Set([...document.fonts].map((f) => f.family.replace(/["']/g, '')))
  for (const family of REQUIRED_FONT_FAMILIES) {
    const declared = [...document.querySelectorAll('body *')].some((e) =>
      getComputedStyle(e).fontFamily.includes(family))
    if (declared && !loaded.has(family)) {
      add('font-not-loaded', { family, loadedFamilies: [...loaded] })
    }
  }

  // ── RULE: focus-invisible ──────────────────────────────────────────────────
  // Runs last, because it is the only rule that changes the page: it focuses
  // each control and checks that something visible actually happens. Inferring
  // this from CSS is guesswork — a :focus-visible rule can exist and be
  // overridden, and `outline: none` can be set three stylesheets away. Focusing
  // the control and diffing what renders is the only honest test.
  //
  // Keyboard operation is not optional: 12 of the product's controls declared a
  // focus style and the rest inherited whatever the user agent gave them, or
  // nothing at all where an outline had been reset.
  const focusFingerprint = (el) => {
    const cs = getComputedStyle(el)
    return [
      cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.outlineOffset,
      cs.boxShadow, cs.borderColor, cs.borderWidth, cs.backgroundColor, cs.color,
    ].join('|')
  }
  const previouslyFocused = document.activeElement
  const seenFocus = new Set()
  for (const el of controls) {
    if (el.disabled) continue
    const key = describe(el) + '|' + label(el)
    if (seenFocus.has(key)) continue
    seenFocus.add(key)

    const before = focusFingerprint(el)
    try { el.focus({ preventScroll: true }) } catch { continue }
    // Only judge a control the browser actually moved focus to.
    if (document.activeElement !== el) continue
    const after = focusFingerprint(el)
    const outlined = parseFloat(getComputedStyle(el).outlineWidth) > 0
    if (before === after && !outlined) {
      add('focus-invisible', { selector: describe(el), label: label(el), tag: el.tagName })
    }
  }
  try {
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus({ preventScroll: true })
    else document.activeElement?.blur?.()
  } catch { /* restoring focus is best effort */ }

  return {
    findings,
    stats: {
      elements: all.length,
      textLeaves: textLeaves.length,
      controls: controls.length,
      documentScrollWidth: document.documentElement.scrollWidth,
      documentScrollHeight: document.documentElement.scrollHeight,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
    },
  }
}
