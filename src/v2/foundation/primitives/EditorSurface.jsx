import { useState } from 'react'
import { colors, elevation, radius, spacing, typography } from '../tokens'

function Corner({ style }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 16,
        height: 16,
        borderColor: 'rgba(37, 99, 235, 0.26)',
        borderStyle: 'solid',
        pointerEvents: 'none',
        zIndex: 2,
        ...style,
      }}
    />
  )
}

function WindowButtons() {
  return (
    <div aria-hidden="true" style={{ display: 'inline-flex', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: radius.pill, background: 'rgba(0, 0, 0, 0.08)' }} />
      <span style={{ width: 8, height: 8, borderRadius: radius.pill, background: 'rgba(0, 0, 0, 0.08)' }} />
      <span style={{ width: 18, height: 8, borderRadius: radius.pill, background: 'rgba(0, 0, 0, 0.08)' }} />
    </div>
  )
}

export default function EditorSurface({
  value,
  onChange,
  placeholder,
  eyebrow = 'Arapal intake',
  seal = 'Preserved source',
  watermark = 'Arapal',
  footerMeta = '',
  shortcutLabel = 'to paste',
  minHeight = 420,
  textareaDebugItem,
  readOnly = false,
}) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', minHeight }}>
      <Corner
        style={{
          top: 0,
          left: 18,
          borderWidth: '1.5px 0 0 1.5px',
          borderTopLeftRadius: 14,
        }}
      />
      <Corner
        style={{
          top: 0,
          right: 18,
          borderWidth: '1.5px 1.5px 0 0',
          borderTopRightRadius: 14,
        }}
      />
      <Corner
        style={{
          bottom: 0,
          left: 18,
          borderWidth: '0 0 1.5px 1.5px',
          borderBottomLeftRadius: 14,
        }}
      />
      <Corner
        style={{
          bottom: 0,
          right: 18,
          borderWidth: '0 1.5px 1.5px 0',
          borderBottomRightRadius: 14,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: 22,
          background:
            'linear-gradient(180deg, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 100%)',
          opacity: isFocused ? 1 : 0,
          filter: 'blur(8px)',
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight,
          overflow: 'hidden',
          borderRadius: 28,
          border: isFocused ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid rgba(15, 23, 42, 0.08)',
          background: colors.surfacePrimary,
          boxShadow: isFocused ? '0 10px 40px rgba(37, 99, 235, 0.08)' : '0 2px 20px -4px rgba(0, 0, 0, 0.06)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '0 0 auto',
            height: 120,
            background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.04) 0%, rgba(37, 99, 235, 0) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 'auto 28px 22px',
            height: 1,
            background:
              'linear-gradient(90deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.16) 50%, rgba(37, 99, 235, 0) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            minHeight: 60,
            padding: '14px 22px',
            background: colors.surfacePrimary,
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing[12],
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
            <WindowButtons />
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span
                style={{
                  fontFamily: typography.bodyText.fontFamily,
                  fontSize: 10,
                  lineHeight: 1,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(0, 0, 0, 0.34)',
                }}
              >
                {eyebrow}
              </span>
            </div>
          </div>
          <div
            style={{
              minHeight: 28,
              padding: '0 12px',
              borderRadius: radius.pill,
              border: '1px solid rgba(37, 99, 235, 0.14)',
              background: 'rgba(239, 246, 255, 0.9)',
              color: 'rgba(37, 99, 235, 0.72)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: typography.bodyText.fontFamily,
              fontSize: 10,
              lineHeight: 1,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72)',
              flexShrink: 0,
            }}
          >
            {seal}
          </div>
        </div>

        <textarea
          data-debug-item={textareaDebugItem}
          value={value}
          onChange={(event) => onChange?.(event.target.value, event)}
          placeholder={placeholder}
          readOnly={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            flex: 1,
            minHeight: 0,
            border: 'none',
            resize: 'none',
            outline: 'none',
            padding: '28px 28px 30px',
            background: colors.surfacePrimary,
            color: 'rgba(0, 0, 0, 0.8)',
            fontFamily: typography.bodyText.fontFamily,
            fontSize: 16,
            lineHeight: 1.9,
            boxSizing: 'border-box',
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 34,
            bottom: 52,
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontSize: 48,
            lineHeight: 1,
            letterSpacing: '-0.06em',
            color: 'rgba(37, 99, 235, 0.085)',
            textShadow: '0 0 24px rgba(37, 99, 235, 0.06)',
            pointerEvents: 'none',
          }}
        >
          {watermark}
        </div>

        <div
          style={{
            minHeight: 38,
            padding: '0 20px',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing[12],
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: typography.bodyText.fontFamily,
              fontSize: 12,
              color: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            <span
              style={{
                minWidth: 20,
                height: 20,
                padding: '0 4px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(0, 0, 0, 0.25)',
                fontSize: 12,
                lineHeight: 1,
                background: 'rgba(255, 255, 255, 0.82)',
              }}
            >
              ⌘
            </span>
            <span
              style={{
                minWidth: 20,
                height: 20,
                padding: '0 4px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(0, 0, 0, 0.25)',
                fontSize: 12,
                lineHeight: 1,
                background: 'rgba(255, 255, 255, 0.82)',
              }}
            >
              V
            </span>
            <span>{shortcutLabel}</span>
          </div>
          <div
            style={{
              fontFamily: typography.bodyText.fontFamily,
              fontSize: 12,
              color: 'rgba(0, 0, 0, 0.2)',
              letterSpacing: '0.04em',
            }}
          >
            {footerMeta}
          </div>
        </div>
      </div>
    </div>
  )
}
