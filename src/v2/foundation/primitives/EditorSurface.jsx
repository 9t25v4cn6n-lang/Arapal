import { useState } from 'react'
import { colors, radius, spacing, surfacePadding, typography } from '../tokens'

const editorSurfaceMetrics = {
  cornerSize: 16,
  cornerStrokeWidth: '1.5px',
  cornerRadius: 14,
  windowButtonGap: spacing[8],
  windowDotSize: 8,
  windowWideDotWidth: 18,
  shortcutHeight: 20,
  shortcutMinWidth: 20,
  shortcutInlineInset: `0 ${spacing[4]}`,
  headerBadgeHeight: 24,
  headerBadgeInlineInset: `0 ${spacing[12]}`,
  headerEyebrowTrack: '0.18em',
  headerTextStackGap: 2,
  footerTextTrack: '0.04em',
  // These four were bare rgba blacks at 0.2, 0.25 and 0.34 alpha — 1.6:1, 1.9:1
  // and 2.5:1 on white. The quiet-chrome intent is right and is kept; the values
  // were simply below the point at which the text renders. They also bypassed
  // the token system entirely, which is how a third neutral dialect grew here
  // after the token file had already been written to stop exactly that.
  //
  // textSoft is the lightest value the token file permits for text.
  footerMetaTone: colors.textSoft,
  shortcutTone: colors.textSoft,
  eyebrowTone: colors.textSoft,
  textareaTone: colors.textStrong,
  watermarkLead: 1,
}

const editorSurfaceChrome = {
  cornerStroke: 'rgba(37, 99, 235, 0.26)',
  windowButtonFill: 'rgba(0, 0, 0, 0.08)',
  shortcutOutline: '1px solid rgba(0, 0, 0, 0.08)',
  shortcutSurface: 'rgba(255, 255, 255, 0.82)',
  focusAuraSurface:
    'linear-gradient(180deg, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 100%)',
  frameOutlineActive: '1px solid rgba(37, 99, 235, 0.2)',
  frameOutlineRest: '1px solid rgba(15, 23, 42, 0.08)',
  frameShadowActive: '0 10px 40px rgba(37, 99, 235, 0.08)',
  frameShadowRest: '0 2px 20px -4px rgba(0, 0, 0, 0.06)',
  topWash: 'linear-gradient(180deg, rgba(37, 99, 235, 0.04) 0%, rgba(37, 99, 235, 0) 100%)',
  footerRule:
    'linear-gradient(90deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.16) 50%, rgba(37, 99, 235, 0) 100%)',
  headerDivider: '1px solid rgba(0, 0, 0, 0.05)',
  headerBadgeOutline: '1px solid rgba(37, 99, 235, 0.14)',
  headerBadgeSurface: 'rgba(239, 246, 255, 0.9)',
  // 72% accent over the badge's own near-white wash did not reach AA. The badge
  // reads as accent either way; accentStrong is the value that also renders.
  headerBadgeTone: colors.accentStrong,
  headerBadgeHighlight: 'inset 0 1px 0 rgba(255, 255, 255, 0.72)',
  watermarkTone: 'rgba(37, 99, 235, 0.085)',
  watermarkShadow: '0 0 24px rgba(37, 99, 235, 0.06)',
}

const editorSurfaceMotion = {
  focusAuraTransition: 'opacity 0.5s ease',
  frameTransition: 'border-color 0.3s ease, box-shadow 0.3s ease',
}

function Corner({ style }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: editorSurfaceMetrics.cornerSize,
        height: editorSurfaceMetrics.cornerSize,
        borderColor: editorSurfaceChrome.cornerStroke,
        borderStyle: 'solid',
        pointerEvents: 'none',
        zIndex: 2,
        ...style,
      }}
    />
  )
}

function ShortcutKey({ children, scale }) {
  return (
    <span
      style={{
        minWidth: editorSurfaceMetrics.shortcutMinWidth,
        height: editorSurfaceMetrics.shortcutHeight,
        padding: editorSurfaceMetrics.shortcutInlineInset,
        border: editorSurfaceChrome.shortcutOutline,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: editorSurfaceMetrics.shortcutTone,
        fontSize: scale,
        lineHeight: typography.eyebrowLabel.lineHeight,
        background: editorSurfaceChrome.shortcutSurface,
      }}
    >
      {children}
    </span>
  )
}

export default function EditorSurface({
  value,
  onChange,
  placeholder,
  ariaLabel,
  eyebrow = 'Arapal intake',
  seal = 'Preserved source',
  watermark = 'Arapal',
  footerMeta = '',
  shortcutLabel = 'to paste',
  minHeight = 420,
  fillHeight = false,
  surfaceDebugItem = 'editor_surface',
  textareaDebugItem,
  readOnly = false,
}) {
  const [isFocused, setIsFocused] = useState(false)
  const frameInset = Number.parseInt(surfacePadding.editorFrame, 10)
  // The corner accents are measured from the CARD they accent, not from the
  // outer frame. At a quarter of the frame inset they sat 18px off the editor —
  // far enough that four marks read as floating in the page rather than as a
  // frame belonging to the box. The gap is now the thing that is chosen, and the
  // inset is derived from it.
  const cornerGapPx = Number.parseInt(spacing[10], 10)
  const cornerInset = Math.max(Number.parseInt(spacing[4], 10), frameInset - cornerGapPx)
  const frameRadius = 28
  const headerInset = surfacePadding.editorHeaderX
  const footerInset = surfacePadding.editorFooterX
  const bodyInset = surfacePadding.editorBody
  const decorativeWatermarkSize = `${Math.max(24, Math.round((Number.parseFloat(typography.displayTitle.fontSize) * 0.667 - 4) * 1000) / 1000)}px`
  const slotRow = {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    alignItems: 'center',
    columnGap: spacing[16],
    width: '100%',
    minWidth: 0,
    minHeight: 0,
  }

  return (
    <div
      data-debug-item={surfaceDebugItem}
      style={{
        position: 'relative',
        width: '100%',
        height: fillHeight ? '100%' : 'auto',
        minHeight: minHeight + frameInset * 2,
        padding: frameInset,
        boxSizing: 'border-box',
      }}
    >
      <Corner
        style={{
          top: cornerInset,
          left: cornerInset,
          borderWidth: `${editorSurfaceMetrics.cornerStrokeWidth} 0 0 ${editorSurfaceMetrics.cornerStrokeWidth}`,
          borderTopLeftRadius: editorSurfaceMetrics.cornerRadius,
        }}
      />
      <Corner
        style={{
          top: cornerInset,
          right: cornerInset,
          borderWidth: `${editorSurfaceMetrics.cornerStrokeWidth} ${editorSurfaceMetrics.cornerStrokeWidth} 0 0`,
          borderTopRightRadius: editorSurfaceMetrics.cornerRadius,
        }}
      />
      <Corner
        style={{
          bottom: cornerInset,
          left: cornerInset,
          borderWidth: `0 0 ${editorSurfaceMetrics.cornerStrokeWidth} ${editorSurfaceMetrics.cornerStrokeWidth}`,
          borderBottomLeftRadius: editorSurfaceMetrics.cornerRadius,
        }}
      />
      <Corner
        style={{
          bottom: cornerInset,
          right: cornerInset,
          borderWidth: `0 ${editorSurfaceMetrics.cornerStrokeWidth} ${editorSurfaceMetrics.cornerStrokeWidth} 0`,
          borderBottomRightRadius: editorSurfaceMetrics.cornerRadius,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: `${frameInset - 4}px`,
          borderRadius: frameRadius,
          background: editorSurfaceChrome.focusAuraSurface,
          opacity: isFocused ? 1 : 0,
          filter: 'blur(8px)',
          transition: editorSurfaceMotion.focusAuraTransition,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: fillHeight ? '100%' : 'auto',
          minHeight,
          overflow: 'hidden',
          borderRadius: frameRadius,
          border: isFocused ? editorSurfaceChrome.frameOutlineActive : editorSurfaceChrome.frameOutlineRest,
          background: colors.surfacePrimary,
          boxShadow: isFocused ? editorSurfaceChrome.frameShadowActive : editorSurfaceChrome.frameShadowRest,
          transition: editorSurfaceMotion.frameTransition,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '0 0 auto',
            height: 120,
            background: editorSurfaceChrome.topWash,
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: `auto ${footerInset} 22px`,
            height: 1,
            background: editorSurfaceChrome.footerRule,
            pointerEvents: 'none',
          }}
        />

        <div
          data-debug-item="editor_header"
          style={{
            position: 'relative',
            zIndex: 1,
            minHeight: 48,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            background: colors.surfacePrimary,
            borderBottom: editorSurfaceChrome.headerDivider,
          }}
        >
          <div
            data-debug-item="editor_header_slots"
            style={{
              ...slotRow,
              padding: `0 ${headerInset}`,
            }}
          >
            <div
              data-debug-item="editor_header_left_slot"
              style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[12], minWidth: 0 }}
            >
              <div
                style={{
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: editorSurfaceMetrics.headerTextStackGap,
                }}
              >
                <span
                  style={{
                    ...typography.eyebrowLabel,
                    color: editorSurfaceMetrics.eyebrowTone,
                    letterSpacing: editorSurfaceMetrics.headerEyebrowTrack,
                  }}
                >
                  {eyebrow}
                </span>
              </div>
            </div>

            <div
              data-debug-item="editor_header_center_spacer"
              aria-hidden="true"
              style={{ minWidth: 0, minHeight: 1 }}
            />

            <div
              data-debug-item="editor_header_right_slot"
              style={{ display: 'inline-flex', alignItems: 'center', justifySelf: 'end', minWidth: 0 }}
            >
              <div
                style={{
                  minHeight: editorSurfaceMetrics.headerBadgeHeight,
                  padding: editorSurfaceMetrics.headerBadgeInlineInset,
                  borderRadius: radius.pill,
                  border: editorSurfaceChrome.headerBadgeOutline,
                  background: editorSurfaceChrome.headerBadgeSurface,
                  color: editorSurfaceChrome.headerBadgeTone,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: typography.eyebrowLabel.fontFamily,
                  fontSize: typography.eyebrowLabel.fontSize,
                  lineHeight: typography.eyebrowLabel.lineHeight,
                  letterSpacing: typography.eyebrowLabel.letterSpacing,
                  textTransform: typography.eyebrowLabel.textTransform,
                  boxShadow: editorSurfaceChrome.headerBadgeHighlight,
                  flexShrink: 0,
                }}
              >
                {seal}
              </div>
            </div>
          </div>
        </div>

        <div
          data-debug-item="editor_body_band"
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            minHeight: 0,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            background: colors.surfacePrimary,
          }}
        >
          <div
            data-debug-item="editor_body_content"
            style={{
              position: 'relative',
              width: '100%',
              flex: 1,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            <textarea
              data-debug-item={textareaDebugItem}
              value={value}
              onChange={(event) => onChange?.(event.target.value, event)}
              placeholder={placeholder}
              // A placeholder is not an accessible name: it disappears the moment
              // the field has content, which is exactly when a screen-reader user
              // is most likely to come back to it.
              aria-label={ariaLabel ?? placeholder}
              // Arabic pasted into an LTR field renders its punctuation on the
              // wrong side without this.
              dir="auto"
              readOnly={readOnly}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                minHeight: 0,
                border: 'none',
                resize: 'none',
                outline: 'none',
                padding: bodyInset,
                background: colors.surfacePrimary,
                color: editorSurfaceMetrics.textareaTone,
                // The source is the principal object on this screen, so it is
                // typed as SOURCE text, not as English body copy.
                //
                // It was `bodyText` — an Inter stack. Inter has no Arabic, so
                // every pasted Arabic source fell back to whatever the system
                // happened to offer, at the body size, while the same passage in
                // Study renders in Amiri two ramp steps larger. That is the
                // whole of "the source text is dramatically smaller than
                // comparable reading content elsewhere": the field was never
                // told it holds a source.
                //
                // Inter FIRST and Amiri behind it, deliberately: font fallback
                // is per glyph, so Latin resolves to Inter and Arabic to Amiri,
                // which is what a field that must accept either one wants. The
                // size is the compact Arabic role rather than the full study
                // reading size — a long paste field legitimately runs denser
                // than a card holding one segment.
                fontFamily: `Inter, ${typography.arabicCompact.fontFamily}`,
                fontSize: typography.arabicCompact.fontSize,
                lineHeight: typography.arabicCompact.lineHeight,
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: footerInset,
            bottom: 48,
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontSize: decorativeWatermarkSize,
            lineHeight: editorSurfaceMetrics.watermarkLead,
            letterSpacing: '-0.06em',
            color: editorSurfaceChrome.watermarkTone,
            textShadow: editorSurfaceChrome.watermarkShadow,
            pointerEvents: 'none',
          }}
        >
          {watermark}
        </div>

        <div
          data-debug-item="editor_footer"
          style={{
            minHeight: 44,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            background: colors.surfacePrimary,
            borderTop: editorSurfaceChrome.headerDivider,
          }}
        >
          <div
            data-debug-item="editor_footer_slots"
            style={{
              ...slotRow,
              padding: `0 ${footerInset}`,
            }}
          >
            <div
              data-debug-item="editor_footer_left_slot"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[8],
                minWidth: 0,
                fontFamily: typography.bodyText.fontFamily,
                fontSize: typography.eyebrowLabel.fontSize,
                color: editorSurfaceMetrics.footerMetaTone,
              }}
            >
              <ShortcutKey scale={typography.eyebrowLabel.fontSize}>⌘</ShortcutKey>
              <ShortcutKey scale={typography.eyebrowLabel.fontSize}>V</ShortcutKey>
              <span>{shortcutLabel}</span>
            </div>

            <div
              data-debug-item="editor_footer_center_spacer"
              aria-hidden="true"
              style={{ minWidth: 0, minHeight: 1 }}
            />

            <div
              data-debug-item="editor_footer_right_slot"
              style={{
                justifySelf: 'end',
                fontFamily: typography.bodyText.fontFamily,
                fontSize: typography.eyebrowLabel.fontSize,
                color: editorSurfaceMetrics.footerMetaTone,
                letterSpacing: editorSurfaceMetrics.footerTextTrack,
              }}
            >
              {footerMeta}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
