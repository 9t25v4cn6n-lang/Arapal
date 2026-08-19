import {
  AlignCenter,
  AlignLeft,
  BookOpen,
  Bold,
  Check,
  ChevronUp,
  ClipboardList,
  Copy,
  Home,
  Italic,
  Layers3,
  Maximize2,
  Minimize2,
  Move,
  PanelsTopLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  PinOff,
  Sparkles,
  SplitSquareVertical,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import IconActionButton from '../primitives/IconActionButton'
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
            left: -1,
            width: 4,
            borderRadius: '0 999px 999px 0',
            background: colors.accentBase,
          }}
        />
        <SplitSquareVertical size={18} strokeWidth={1.8} />
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
  const directions = [
    {
      label: 'Quiet outline',
      background: 'rgba(255, 255, 255, 0.96)',
      border: colors.lineSoft,
      color: colors.textSoft,
      shadow: 'none',
    },
    {
      label: 'Accent fill',
      background:
        'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 55%), linear-gradient(90deg, #2D6BF0 0%, #2563EB 42%, #1D4ED8 100%)',
      border: 'rgba(37, 99, 235, 0.18)',
      color: '#ffffff',
      shadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 14px 28px rgba(37,99,235,0.18)',
    },
    {
      label: 'Success soft',
      background: 'rgba(220, 252, 231, 0.84)',
      border: 'rgba(134, 239, 172, 0.96)',
      color: '#15803D',
      shadow: 'none',
    },
  ]

  return (
    <div style={{ ...previewFrameStyle(), width: '100%', display: 'grid', gap: spacing[12] }}>
      {directions.map((direction) => (
        <div key={direction.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
          <span style={{ ...typography.bodyText, fontSize: 14, fontWeight: 600, color: colors.textBody }}>{direction.label}</span>
          <button
            type="button"
            style={{
              minHeight: 34,
              padding: '0 14px',
              borderRadius: radius.pill,
              border: `1px solid ${direction.border}`,
              background: direction.background,
              color: direction.color,
              boxShadow: direction.shadow,
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
            Copy
          </button>
        </div>
      ))}
    </div>
  )
}

export function UtilityIconFamilyPreview() {
  const groups = [
    {
      label: 'Panel state',
      items: [
        { key: 'Expand', icon: <Maximize2 strokeWidth={1.8} />, active: false },
        { key: 'Collapse', icon: <Minimize2 strokeWidth={1.8} />, active: false },
        { key: 'Pin', icon: <Pin strokeWidth={1.8} />, active: false },
        { key: 'Unpin', icon: <PinOff strokeWidth={1.8} />, active: true },
      ],
    },
    {
      label: 'Sidebar state',
      items: [
        { key: 'Open sidebar', icon: <PanelLeftOpen strokeWidth={1.8} />, active: false },
        { key: 'Close sidebar', icon: <PanelLeftClose strokeWidth={1.8} />, active: false },
        { key: 'Float', icon: <PanelsTopLeft strokeWidth={1.8} />, active: false },
        { key: 'Move', icon: <Move strokeWidth={1.8} />, active: false },
      ],
    },
    {
      label: 'Utility actions',
      items: [
        { key: 'Copy', icon: <Copy strokeWidth={1.8} />, active: false },
      ],
    },
  ]

  return (
    <div style={{ ...previewFrameStyle(), width: '100%', display: 'grid', gap: spacing[12] }}>
      {groups.map((group) => (
        <div
          key={group.label}
          style={{
            display: 'grid',
            gap: spacing[8],
            borderRadius: radius[14],
            border: `1px solid ${colors.lineSoft}`,
            background: 'rgba(255, 255, 255, 0.78)',
            padding: spacing[10],
          }}
        >
          <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>{group.label}</span>
          <div style={{ display: 'flex', gap: spacing[8], flexWrap: 'wrap' }}>
            {group.items.map((item) => (
              <div
                key={item.key}
                style={{
                  minWidth: 76,
                  display: 'grid',
                  justifyItems: 'center',
                  gap: spacing[6],
                }}
              >
                <IconActionButton size="utility-sm" label={item.key} active={item.active} icon={item.icon} />
                <span style={{ ...typography.bodyText, fontSize: 11, lineHeight: 1.2, color: colors.textSoft, textAlign: 'center' }}>{item.key}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function FontSizeControlsPreview() {
  const variants = ['A-', 'A+']
  const [hoveredVariant, setHoveredVariant] = useState(null)

  return (
    <div style={{ ...previewFrameStyle(), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: radius.pill,
          border: `1px solid ${colors.lineSoft}`,
          background: 'rgba(255, 255, 255, 0.96)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.64) inset',
          padding: 4,
          gap: 4,
        }}
      >
      {variants.map((variant) => (
        <button
          key={variant}
          type="button"
          onMouseEnter={() => setHoveredVariant(variant)}
          onMouseLeave={() => setHoveredVariant(null)}
          style={{
            minHeight: 34,
            minWidth: 40,
            padding: '0 12px',
            borderRadius: radius.pill,
            border: `1px solid ${hoveredVariant === variant ? 'rgba(37, 99, 235, 0.18)' : 'transparent'}`,
            background:
              hoveredVariant === variant
                ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 55%), linear-gradient(90deg, #2D6BF0 0%, #2563EB 42%, #1D4ED8 100%)'
                : 'transparent',
            color: hoveredVariant === variant ? '#ffffff' : colors.textSoft,
            boxShadow:
              hoveredVariant === variant
                ? 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -8px 14px rgba(22,78,199,0.14), 0 10px 20px rgba(37,99,235,0.14)'
                : 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: typography.bodyText.fontFamily,
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transition: `background ${motion.panel}, color ${motion.micro}, box-shadow ${motion.panel}, border-color ${motion.micro}`,
          }}
          >
            {variant}
          </button>
        ))}
      </div>
    </div>
  )
}

export function EditorToolbarControlsPreview() {
  return (
    <div style={{ width: '100%', maxWidth: 540 }}>
      <div
        style={{
          minHeight: 62,
          border: `1px solid ${colors.lineSoft}`,
          borderRadius: radius[18],
          background: 'rgba(255, 255, 255, 0.96)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[16],
          padding: `0 ${spacing[16]}`,
          boxShadow: '0 1px 0 rgba(255,255,255,0.72) inset',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[12], minWidth: 0 }}>
          <span
            style={{
              minWidth: 28,
              minHeight: 28,
              borderRadius: 9,
              background: 'rgba(239, 246, 255, 0.96)',
              color: colors.accentStrong,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: typography.bodyText.fontFamily,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset',
            }}
          >
            EN
          </span>
          <span
            style={{
              ...typography.bodyText,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: colors.textBody,
              whiteSpace: 'nowrap',
            }}
          >
            Translation
          </span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[4],
            marginLeft: 'auto',
            padding: '4px 6px',
            borderRadius: radius.pill,
            border: `1px solid rgba(219, 234, 254, 0.96)`,
            background: 'rgba(248, 251, 255, 0.92)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.68) inset',
          }}
        >
          <IconActionButton size="utility-sm" label="Bold" icon={<Bold strokeWidth={1.8} />} />
          <IconActionButton size="utility-sm" label="Italic" icon={<Italic strokeWidth={1.8} />} />
          <div style={{ width: 1, height: 16, background: colors.lineSoft, margin: '0 2px' }} />
          <IconActionButton size="utility-sm" label="Align left" active icon={<AlignLeft strokeWidth={1.8} />} />
          <IconActionButton size="utility-sm" label="Align center" icon={<AlignCenter strokeWidth={1.8} />} />
        </div>
      </div>
    </div>
  )
}

export function ModeIconSetPreview() {
  const items = [
    { label: 'Home', icon: <Home size={18} strokeWidth={1.8} /> },
    { label: 'Projects', icon: <Layers3 size={18} strokeWidth={1.8} /> },
    { label: 'Study', icon: <BookOpen size={18} strokeWidth={1.8} /> },
    { label: 'Segmentation', icon: <SplitSquareVertical size={18} strokeWidth={1.8} /> },
    { label: 'Exams', icon: <ClipboardList size={18} strokeWidth={1.8} /> },
  ]

  return (
    <div style={{ ...previewFrameStyle(), width: '100%', display: 'flex', gap: spacing[10], flexWrap: 'wrap', justifyContent: 'center' }}>
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            minWidth: 88,
            display: 'grid',
            justifyItems: 'center',
            gap: spacing[8],
            padding: `${spacing[8]} ${spacing[10]}`,
          }}
        >
          <div style={{ color: colors.accentStrong, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
          <span style={{ ...typography.bodyText, fontSize: 11, lineHeight: 1.2, fontWeight: 600, color: colors.textSoft, textAlign: 'center' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export function SplitCTAPreview({ showMenu = false, initialMethod = 'ai', initialStyle = 'meaning' }) {
  const [isOpen, setIsOpen] = useState(showMenu)
  const [method, setMethod] = useState(initialMethod)
  const [style, setStyle] = useState(initialStyle)

  const options = useMemo(
    () => [
      {
        title: 'Method',
        items: [
          { id: 'ai', label: 'AI proposal', meta: 'Generate a first pass for later review', leading: <Sparkles size={15} strokeWidth={1.9} /> },
          { id: 'manual', label: 'Manual start', meta: 'Begin from preserved source without a proposal', leading: <SplitSquareVertical size={15} strokeWidth={1.9} /> },
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
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 52%, rgba(255,255,255,0) 100%), linear-gradient(90deg, #2D6BF0 0%, #2563EB 42%, #1D4ED8 100%)',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
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
