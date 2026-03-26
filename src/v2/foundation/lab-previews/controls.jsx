import { Check, ChevronUp, ListFilter, Pin, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import PrimaryCTA from '../primitives/PrimaryCTA'
import { colors, motion, radius, spacing, typography } from '../tokens'

function previewFrameStyle() {
  return {
    borderRadius: radius[16],
    border: `1px solid ${colors.lineSoft}`,
    background: 'rgba(248, 251, 255, 0.96)',
    padding: spacing[12],
  }
}

function lineClampStyle() {
  return {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }
}

export function NavigationRailRowPreview() {
  return (
    <div style={previewFrameStyle()}>
      <button
        type="button"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 44,
          border: 'none',
          borderRadius: radius[12],
          background: 'rgba(239, 246, 255, 0.94)',
          color: colors.accentStrong,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[12],
          padding: '0 12px',
          textAlign: 'left',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            right: -1,
            width: 4,
            borderRadius: '999px 0 0 999px',
            background: colors.accentBase,
          }}
        />
        <ListFilter size={18} strokeWidth={1.8} />
        <span style={{ ...typography.bodyText, fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>Source + Segmentation</span>
      </button>
    </div>
  )
}

export function PreferenceToggleRowPreview() {
  const rows = [
    {
      title: 'Quick mode',
      meta: 'Go straight to Segments Ready after the AI pass',
      active: true,
    },
    {
      title: 'Show segmentation animation',
      meta: 'Let the text split visually before study',
      active: false,
    },
  ]

  return (
    <div style={{ ...previewFrameStyle(), display: 'grid', gap: spacing[10] }}>
      {rows.map((row) => (
        <div
          key={row.title}
          style={{
            borderRadius: radius[16],
            border: `1px solid ${row.active ? 'rgba(191, 219, 254, 0.96)' : colors.lineSoft}`,
            background: row.active ? 'rgba(239, 246, 255, 0.78)' : 'rgba(255, 255, 255, 0.92)',
            padding: `${spacing[12]} ${spacing[16]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing[12],
          }}
        >
          <div style={{ minWidth: 0, display: 'grid', gap: 4 }}>
            <p style={{ ...typography.bodyText, margin: 0, fontWeight: 600, color: colors.textStrong }}>{row.title}</p>
            <p style={{ ...typography.bodyText, ...lineClampStyle(), margin: 0, fontSize: 14, color: colors.textSoft }}>{row.meta}</p>
          </div>
          <span
            aria-hidden="true"
            style={{
              width: 38,
              height: 22,
              borderRadius: radius.pill,
              background: row.active ? colors.accentBase : 'rgba(148, 163, 184, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              padding: 2,
              flexShrink: 0,
              justifyContent: row.active ? 'flex-end' : 'flex-start',
              transition: `background-color ${motion.micro}`,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: radius.pill,
                background: '#ffffff',
                boxShadow: '0 1px 4px rgba(15, 23, 42, 0.18)',
              }}
            />
          </span>
        </div>
      ))}
    </div>
  )
}

export function StatusChipPreview() {
  const chips = [
    { label: 'Ready', bg: 'rgba(220, 252, 231, 0.96)', border: 'rgba(134, 239, 172, 0.96)', color: '#15803D' },
    { label: 'Needs review', bg: 'rgba(255, 247, 237, 0.96)', border: 'rgba(254, 215, 170, 0.96)', color: '#C2410C' },
    { label: 'Active', bg: 'rgba(239, 246, 255, 0.96)', border: 'rgba(191, 219, 254, 0.96)', color: colors.accentStrong },
  ]

  return (
    <div style={{ ...previewFrameStyle(), display: 'flex', gap: spacing[10], flexWrap: 'wrap', alignItems: 'center' }}>
      {chips.map((chip) => (
        <span
          key={chip.label}
          style={{
            minHeight: 30,
            padding: '0 12px',
            borderRadius: radius.pill,
            border: `1px solid ${chip.border}`,
            background: chip.bg,
            color: chip.color,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: typography.bodyText.fontFamily,
            fontSize: 12,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {chip.label}
        </span>
      ))}
    </div>
  )
}

export function ActionPillPreview() {
  const actions = [
    { label: 'Pin', active: true },
    { label: 'Copy', active: false },
    { label: 'Discuss', active: false },
  ]

  return (
    <div style={{ ...previewFrameStyle(), display: 'flex', gap: spacing[10], flexWrap: 'wrap' }}>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          style={{
            minHeight: 34,
            padding: '0 14px',
            borderRadius: radius.pill,
            border: `1px solid ${action.active ? 'rgba(191, 219, 254, 0.96)' : colors.lineSoft}`,
            background: action.active ? 'rgba(239, 246, 255, 0.94)' : 'rgba(255, 255, 255, 0.96)',
            color: action.active ? colors.accentStrong : colors.textSoft,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: typography.bodyText.fontFamily,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}

export function SplitCTAPreview({ showMenu = false }) {
  const [isOpen, setIsOpen] = useState(showMenu)
  const [method, setMethod] = useState('ai')
  const [style, setStyle] = useState('meaning')

  const options = useMemo(
    () => [
      {
        title: 'Method',
        items: [
          { id: 'ai', label: 'AI proposal', meta: 'Generate a first pass for later review', leading: <Sparkles size={15} strokeWidth={1.9} /> },
          { id: 'manual', label: 'Manual start', meta: 'Begin from preserved source without a proposal', leading: <ListFilter size={15} strokeWidth={1.9} /> },
        ],
        selected: method,
        onSelect: setMethod,
      },
      {
        title: 'Segmentation style',
        items: [
          { id: 'sentence', label: 'Sentence', meta: 'Split close to sentence boundaries' },
          { id: 'meaning', label: 'Meaning groups', meta: 'Keep small ideas together' },
        ],
        selected: style,
        onSelect: setStyle,
      },
    ],
    [method, style]
  )

  return (
    <div style={{ position: 'relative', display: 'grid', gap: spacing[12], justifyItems: 'center', alignItems: 'start' }}>
      <div style={{ display: 'inline-flex', alignItems: 'stretch', boxShadow: '0 18px 34px rgba(37, 99, 235, 0.14)' }}>
        <PrimaryCTA
          icon={<Sparkles size={16} strokeWidth={1.9} />}
          minWidth={280}
          shape="splitLead"
        >
          AI segment text
        </PrimaryCTA>
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => {
            if (showMenu) {
              setIsOpen((open) => !open)
            }
          }}
          style={{
            minWidth: 72,
            border: 'none',
            borderLeft: '1px solid rgba(255,255,255,0.16)',
            borderTopRightRadius: radius.pill,
            borderBottomRightRadius: radius.pill,
            background: 'linear-gradient(180deg, #2D6BF0 0%, #1D4ED8 100%)',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronUp
            size={18}
            strokeWidth={2}
            style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: `transform ${motion.panel}` }}
          />
        </button>
      </div>

      {showMenu && isOpen ? (
        <div
          style={{
            width: 340,
            borderRadius: radius[24],
            border: `1px solid rgba(191, 219, 254, 0.92)`,
            background: 'rgba(255, 255, 255, 0.96)',
            boxShadow: '0 24px 48px rgba(15, 23, 42, 0.12)',
            padding: spacing[16],
            display: 'grid',
            gap: spacing[16],
          }}
        >
          {options.map((section) => (
            <div key={section.title} style={{ display: 'grid', gap: spacing[10] }}>
              <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>{section.title}</p>
              {section.items.map((item) => {
                const isSelected = section.selected === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => section.onSelect(item.id)}
                    style={{
                      border: `1px solid ${isSelected ? 'rgba(147, 197, 253, 0.96)' : 'transparent'}`,
                      borderRadius: radius[16],
                      background: isSelected ? 'rgba(239, 246, 255, 0.82)' : 'transparent',
                      padding: `${spacing[12]} ${spacing[14]}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: spacing[12],
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ minWidth: 0, display: 'grid', gap: 4 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], ...typography.bodyText, fontWeight: 600, color: colors.textStrong }}>
                        {item.leading ?? null}
                        {item.label}
                      </span>
                      <span style={{ ...typography.bodyText, fontSize: 14, color: colors.textSoft }}>{item.meta}</span>
                    </span>
                    {isSelected ? <Check size={16} strokeWidth={2} color={colors.accentStrong} /> : null}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
