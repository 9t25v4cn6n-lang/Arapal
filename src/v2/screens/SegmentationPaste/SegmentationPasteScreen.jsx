import {
  ArrowDown,
  ArrowLeft,
  Check,
  ChevronUp,
  Edit3,
  Scissors,
  Sparkles,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { colors, motion, radius, spacing, typography } from '../../foundation/tokens'
import layoutContract from './SegmentationPasteScreen.contract'

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

const segmentationPasteStyles = `
  .v2-seg-paste__ctaCluster::before {
    content: "";
    position: absolute;
    inset: 16px 36px -8px;
    border-radius: 999px;
    background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.28) 0%, rgba(37, 99, 235, 0.08) 44%, rgba(37, 99, 235, 0) 76%);
    filter: blur(16px);
    opacity: 0.72;
    pointer-events: none;
    z-index: -1;
  }

  .v2-seg-paste__panelCorner {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: rgba(37, 99, 235, 0.26);
    border-style: solid;
    pointer-events: none;
    z-index: 2;
  }

  .v2-seg-paste__panelCorner.is-topLeft {
    top: 2px;
    left: 24px;
    border-width: 1.5px 0 0 1.5px;
    border-top-left-radius: 14px;
  }

  .v2-seg-paste__panelCorner.is-topRight {
    top: 2px;
    right: 24px;
    border-width: 1.5px 1.5px 0 0;
    border-top-right-radius: 14px;
  }

  .v2-seg-paste__panelCorner.is-bottomLeft {
    bottom: 2px;
    left: 24px;
    border-width: 0 0 1.5px 1.5px;
    border-bottom-left-radius: 14px;
  }

  .v2-seg-paste__panelCorner.is-bottomRight {
    bottom: 2px;
    right: 24px;
    border-width: 0 1.5px 1.5px 0;
    border-bottom-right-radius: 14px;
  }

  .v2-seg-paste__editorGlow {
    position: absolute;
    inset: -4px;
    border-radius: 22px;
    background: linear-gradient(180deg, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 100%);
    opacity: 0.26;
    filter: blur(8px);
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .v2-seg-paste__editorTopWash {
    position: absolute;
    inset: 0 0 auto;
    height: 120px;
    background: linear-gradient(180deg, rgba(37, 99, 235, 0.04) 0%, rgba(37, 99, 235, 0) 100%);
    pointer-events: none;
    z-index: 0;
  }

  .v2-seg-paste__editorBottomLine {
    position: absolute;
    inset: auto 28px 22px;
    height: 1px;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.16) 50%, rgba(37, 99, 235, 0) 100%);
    pointer-events: none;
    z-index: 0;
  }

  .v2-seg-paste__ctaCluster {
    position: relative;
    display: inline-grid;
    grid-template-columns: minmax(340px, auto) 72px;
    align-items: stretch;
    justify-content: center;
    justify-self: center;
    width: max-content;
    height: 56px;
    overflow: visible;
    isolation: isolate;
  }

  .v2-seg-paste__primaryButton {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    min-width: 340px;
    min-height: 56px;
    width: 100%;
    height: 100%;
    border: none;
    border-top-left-radius: 999px;
    border-bottom-left-radius: 999px;
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 55%),
      linear-gradient(90deg, #2D6BF0 0%, #2563EB 42%, #1D4ED8 100%);
    color: #ffffff;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      inset 0 -10px 18px rgba(22, 78, 199, 0.16),
      0 24px 52px rgba(37, 99, 235, 0.22),
      0 10px 24px rgba(29, 78, 216, 0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    cursor: pointer;
    transition: box-shadow 0.25s ease, filter 0.25s ease;
  }

  .v2-seg-paste__primaryButton::before,
  .v2-seg-paste__primaryButton::after {
    content: "";
    position: absolute;
    pointer-events: none;
    transition: opacity 0.32s ease, transform 0.38s ease;
  }

  .v2-seg-paste__primaryButton::before {
    inset: 1px;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.06) 34%, rgba(255, 255, 255, 0) 100%);
    opacity: 0.38;
  }

  .v2-seg-paste__primaryButton::after {
    top: -18%;
    bottom: -18%;
    left: -26%;
    width: 30%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.34) 48%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transform: translateX(-10px) skewX(-18deg);
  }

  .v2-seg-paste__primaryButton:hover {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.24),
      inset 0 -12px 18px rgba(22, 78, 199, 0.18),
      0 28px 54px rgba(37, 99, 235, 0.24),
      0 12px 28px rgba(29, 78, 216, 0.12);
    filter: saturate(1.02);
  }

  .v2-seg-paste__primaryButton:hover::before,
  .v2-seg-paste__primaryButton:focus-visible::before {
    opacity: 0.44;
  }

  .v2-seg-paste__primaryButton:hover::after,
  .v2-seg-paste__primaryButton:focus-visible::after {
    opacity: 1;
    transform: translateX(260%) skewX(-18deg);
  }

  .v2-seg-paste__primaryButton:focus-visible {
    outline: 2px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }

  .v2-seg-paste__primaryButton:active {
    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.18);
  }

  .v2-seg-paste__primaryButton:disabled {
    opacity: 1;
    box-shadow: none;
    cursor: not-allowed;
    filter: none;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.92) 0%, rgba(29, 78, 216, 0.98) 100%);
  }

  .v2-seg-paste__primaryButton:disabled::before {
    opacity: 0.14;
  }

  .v2-seg-paste__primaryButtonContent {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-family: ${typography.bodyText.fontFamily};
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .v2-seg-paste__splitButton {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    width: 72px;
    min-height: 56px;
    height: 100%;
    border: none;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    border-top-right-radius: 999px;
    border-bottom-right-radius: 999px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 55%),
      linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      inset 0 -10px 18px rgba(22, 78, 199, 0.16),
      0 24px 52px rgba(37, 99, 235, 0.22),
      0 10px 24px rgba(29, 78, 216, 0.1);
    transition: filter 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
  }

  .v2-seg-paste__splitButton::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 34%, rgba(255, 255, 255, 0) 100%);
    opacity: 0.36;
    pointer-events: none;
  }

  .v2-seg-paste__splitButton:hover {
    filter: saturate(1.02);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      inset 0 -12px 18px rgba(22, 78, 199, 0.18),
      0 28px 54px rgba(37, 99, 235, 0.24),
      0 12px 28px rgba(29, 78, 216, 0.12);
    transform: translateY(-2px);
  }

  .v2-seg-paste__splitButton:focus-visible {
    outline: 2px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }

  .v2-seg-paste__splitButton:disabled {
    box-shadow: none;
    filter: none;
    cursor: not-allowed;
  }

  .v2-seg-paste__splitChevron {
    transition: transform 0.2s ease;
  }

  .v2-seg-paste__splitChevron.is-open {
    transform: scale(1.08);
  }

  @keyframes v2-seg-paste-fade-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .v2-seg-paste__splitMenu {
    position: absolute;
    right: 0;
    bottom: 24px;
    width: 320px;
    padding: 14px;
    border: 1px solid rgba(191, 219, 254, 0.88);
    border-radius: 24px;
    background:
      radial-gradient(circle at top left, rgba(239, 246, 255, 0.9) 0%, rgba(239, 246, 255, 0) 48%),
      radial-gradient(circle at bottom right, rgba(219, 234, 254, 0.52) 0%, rgba(219, 234, 254, 0) 46%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.82) 0%, rgba(248, 251, 255, 0.94) 100%);
    backdrop-filter: blur(18px) saturate(1.08);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.72),
      0 32px 64px rgba(15, 23, 42, 0.16);
    z-index: 80;
    animation: v2-seg-paste-fade-up 0.2s ease both;
  }

  .v2-seg-paste__splitMenuSection + .v2-seg-paste__splitMenuSection {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(226, 232, 240, 0.9);
  }

  .v2-seg-paste__splitMenuLabel {
    margin: 0 0 8px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${colors.textFaint};
  }

  .v2-seg-paste__splitMenuOption {
    width: 100%;
    min-height: 48px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 16px;
    background: transparent;
    color: ${colors.textBody};
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
    text-align: left;
  }

  .v2-seg-paste__splitMenuOption:hover {
    transform: translateY(-1px);
    border-color: rgba(191, 219, 254, 0.88);
    background: rgba(239, 246, 255, 0.74);
  }

  .v2-seg-paste__splitMenuOption.is-selected {
    border-color: rgba(147, 197, 253, 0.92);
    background: rgba(239, 246, 255, 0.86);
    color: ${colors.accentStrong};
  }

  .v2-seg-paste__splitMenuOptionText {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    font-size: 13px;
    line-height: 1.4;
  }

  .v2-seg-paste__splitMenuOptionText.is-stacked {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .v2-seg-paste__splitMenuOptionTitle {
    color: ${colors.textStrong};
    font-size: 13px;
    line-height: 1.2;
  }

  .v2-seg-paste__splitMenuOptionMeta {
    color: ${colors.textSoft};
    font-size: 12px;
    line-height: 1.4;
  }

  .v2-seg-paste__splitMenuToggle {
    width: 100%;
    min-height: 48px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 16px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
    text-align: left;
  }

  .v2-seg-paste__splitMenuToggle:hover {
    transform: translateY(-1px);
    border-color: rgba(191, 219, 254, 0.88);
    background: rgba(239, 246, 255, 0.74);
  }

  .v2-seg-paste__splitMenuToggleText {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    text-align: left;
    min-width: 0;
  }

  .v2-seg-paste__splitMenuToggleTitle {
    font-size: 13px;
    line-height: 1.2;
    color: ${colors.textStrong};
  }

  .v2-seg-paste__splitMenuToggleMeta {
    color: ${colors.textSoft};
    font-size: 12px;
    line-height: 1.4;
  }

  .v2-seg-paste__miniSwitch {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 34px;
    height: 20px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.28);
    transition: background-color 0.2s ease;
    flex-shrink: 0;
  }

  .v2-seg-paste__miniSwitch.is-active {
    background: rgba(37, 99, 235, 0.86);
  }

  .v2-seg-paste__miniSwitchThumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.16);
    transition: transform 0.2s ease;
  }

  .v2-seg-paste__miniSwitch.is-active .v2-seg-paste__miniSwitchThumb {
    transform: translateX(14px);
  }
`

const workspaceSteps = [
  { id: 'paste', label: 'Source' },
  { id: 'segment', label: 'Segment' },
  { id: 'review', label: 'Review' },
]

const methodOptions = [
  { id: 'ai', label: 'AI proposal', icon: Sparkles },
  { id: 'manual', label: 'Manual start', icon: Edit3 },
]

const styleOptions = [
  { id: 'sentence', label: 'Sentence', meta: 'Split close to sentence boundaries' },
  { id: 'meaning', label: 'Meaning groups', meta: 'Keep small ideas together' },
  { id: 'topic', label: 'Topic-led', meta: 'Group around sub-topic shifts' },
]

const granularityOptions = [
  { id: 'tight', label: 'Tighter', meta: 'Smaller, more frequent segments' },
  { id: 'balanced', label: 'Balanced', meta: 'Default balance for most texts' },
  { id: 'broad', label: 'Broader', meta: 'Fewer, larger sections' },
]

function BackPill({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `1px solid ${colors.lineSoft}`,
        borderRadius: radius.pill,
        background: 'rgba(255, 255, 255, 0.92)',
        color: colors.textSoft,
        minHeight: '42px',
        padding: '0 22px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[8],
        cursor: 'pointer',
        fontFamily: typography.bodyText.fontFamily,
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        transition: `border-color ${motion.micro}, box-shadow ${motion.micro}, color ${motion.micro}, transform ${motion.micro}`,
      }}
    >
      <ArrowLeft size={16} strokeWidth={1.9} />
      Back
    </button>
  )
}

function Stepbar() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[8],
      }}
    >
      {workspaceSteps.map((item, index) => {
        const state = index === 0 ? 'current' : 'pending'

        return (
          <div key={item.id} style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: radius.pill,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                lineHeight: 1,
                background: state === 'current' ? colors.accentBase : 'rgba(148, 163, 184, 0.14)',
                color: state === 'current' ? '#ffffff' : colors.textFaint,
              }}
            >
              {index + 1}
            </div>
            {state === 'current' ? (
              <span
                style={{
                  ...typography.eyebrowLabel,
                  color: colors.textSoft,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>
            ) : null}
            {index < workspaceSteps.length - 1 ? (
              <span
                aria-hidden="true"
                style={{
                  width: '32px',
                  height: '1px',
                  background: colors.lineSoft,
                }}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function IntakeBrand() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[12],
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: radius.pill,
          border: `1px solid ${colors.lineStrong}`,
          background: `linear-gradient(180deg, ${colors.accentWash} 0%, ${colors.accentMist} 100%)`,
          color: colors.accentBase,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 16px 28px rgba(37, 99, 235, 0.12)',
          flexShrink: 0,
        }}
      >
        <Scissors size={16} strokeWidth={1.9} />
      </div>
      <div style={{ display: 'grid', gap: '3px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: 1,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: colors.textStrong,
          }}
        >
          Source Intake
        </p>
        <p
          style={{
            margin: 0,
            fontSize: '10px',
            lineHeight: 1,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.textSoft,
          }}
        >
          Segmentation
        </p>
      </div>
    </div>
  )
}

function SourceMarker() {
  return (
    <div
      data-debug-item="source_marker"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[8],
        color: colors.textSoft,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: radius.pill,
          background: colors.textSoft,
        }}
      />
      <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>Source</span>
    </div>
  )
}

function WindowButtons() {
  return (
    <div aria-hidden="true" style={{ display: 'inline-flex', gap: spacing[8] }}>
      <span style={{ width: '8px', height: '8px', borderRadius: radius.pill, background: 'rgba(0, 0, 0, 0.08)' }} />
      <span style={{ width: '8px', height: '8px', borderRadius: radius.pill, background: 'rgba(0, 0, 0, 0.08)' }} />
      <span style={{ width: '18px', height: '8px', borderRadius: radius.pill, background: 'rgba(0, 0, 0, 0.08)' }} />
    </div>
  )
}

function SplitMenuSection({ label, children }) {
  return (
    <div className="v2-seg-paste__splitMenuSection">
      <p className="v2-seg-paste__splitMenuLabel">{label}</p>
      <div style={{ display: 'grid', gap: spacing[8] }}>{children}</div>
    </div>
  )
}

function SplitMenuOption({ active = false, icon: Icon, label, meta, stacked = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx('v2-seg-paste__splitMenuOption', active && 'is-selected')}
    >
      <span className={cx('v2-seg-paste__splitMenuOptionText', stacked && 'is-stacked')}>
        {Icon ? <Icon size={15} strokeWidth={1.9} /> : null}
        {meta ? (
          <span className="v2-seg-paste__splitMenuOptionText is-stacked">
            <span className="v2-seg-paste__splitMenuOptionTitle">{label}</span>
            <span className="v2-seg-paste__splitMenuOptionMeta">{meta}</span>
          </span>
        ) : (
          <span className="v2-seg-paste__splitMenuOptionTitle">{label}</span>
        )}
      </span>
      {active ? <Check size={15} strokeWidth={1.9} /> : null}
    </button>
  )
}

function SplitMenuToggle({ active = false, title, meta, onClick }) {
  return (
    <button type="button" className="v2-seg-paste__splitMenuToggle" onClick={onClick}>
      <span className="v2-seg-paste__splitMenuToggleText">
        <span className="v2-seg-paste__splitMenuToggleTitle">{title}</span>
        <span className="v2-seg-paste__splitMenuToggleMeta">{meta}</span>
      </span>
      <span className={cx('v2-seg-paste__miniSwitch', active && 'is-active')}>
        <span className="v2-seg-paste__miniSwitchThumb" />
      </span>
    </button>
  )
}

export default function SegmentationPasteScreen({ route, shell }) {
  const [rawText, setRawText] = useState('')
  const [method, setMethod] = useState('ai')
  const [style, setStyle] = useState('meaning')
  const [granularity, setGranularity] = useState('balanced')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [quickMode, setQuickMode] = useState(false)
  const [showSegmentationTransition, setShowSegmentationTransition] = useState(true)
  const splitButtonRef = useRef(null)
  const splitMenuRef = useRef(null)

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      const target = event.target

      if (
        splitMenuRef.current?.contains(target) ||
        splitButtonRef.current?.contains(target)
      ) {
        return
      }

      setIsMenuOpen(false)
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const hasText = rawText.trim().length > 0
  const wordCount = hasText ? rawText.trim().split(/\s+/).length : 0
  const selectedMethod = methodOptions.find((option) => option.id === method) ?? methodOptions[0]

  const backButton = <BackPill onClick={() => shell.navigate('projectHome')} />
  const stepbar = <Stepbar />
  const intakeBrand = <IntakeBrand />

  const slots = {
    Layer1_Header_StartLane: backButton,
    Layer1_Header_CenterLane: stepbar,
    Layer1_Header_EndLane: intakeBrand,
    Layer4_Segmentation_ModeBand: <SourceMarker />,
    Layer4_Segmentation_HeaderBand: (
      <h1
        data-debug-item="display_title"
        style={{
          margin: 0,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          color: '#08060d',
          fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
          fontSize: 'clamp(44px, 4.2vw, 68px)',
          lineHeight: 1,
          transform: 'translateY(-0.05em)',
          transformOrigin: 'center center',
          textAlign: 'center',
          textWrap: 'balance',
          overflowWrap: 'anywhere',
        }}
      >
        Paste your text
      </h1>
    ),
    Layer4_Segmentation_ContextBand: (
      <p
        data-debug-item="support_subtext"
        style={{
          margin: 0,
          width: '100%',
          maxWidth: '640px',
          color: 'rgba(15, 23, 42, 0.42)',
          fontSize: 'clamp(16px, 1.15vw, 18px)',
          lineHeight: 1.45,
          letterSpacing: '0.01em',
          textAlign: 'center',
        }}
      >
        Drop in your raw source material. AraPal will turn it into clean, study-ready segments.
      </p>
    ),
    Layer5_Segmentation_WorkspaceFrame: (
      <>
        <div className="v2-seg-paste__panelCorner is-topLeft" />
        <div className="v2-seg-paste__panelCorner is-topRight" />
        <div className="v2-seg-paste__panelCorner is-bottomLeft" />
        <div className="v2-seg-paste__panelCorner is-bottomRight" />
        <div className="v2-seg-paste__editorGlow" />
      </>
    ),
    Layer5_Segmentation_SourcePanel: (
      <>
        <div className="v2-seg-paste__editorTopWash" />
        <div className="v2-seg-paste__editorBottomLine" />
      </>
    ),
    Layer5_Segmentation_SourcePanelTopbar: (
      <>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[12],
            minWidth: 0,
          }}
        >
          <WindowButtons />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
            <span
              style={{
                fontSize: '10px',
                lineHeight: 1,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(0, 0, 0, 0.34)',
              }}
            >
              Arapal intake
            </span>
          </div>
        </div>
        <div
          style={{
            minHeight: '28px',
            padding: `0 ${spacing[12]}`,
            borderRadius: radius.pill,
            border: '1px solid rgba(37, 99, 235, 0.14)',
            background: 'rgba(239, 246, 255, 0.9)',
            color: 'rgba(37, 99, 235, 0.72)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            lineHeight: 1,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72)',
          }}
        >
          Preserved source
        </div>
      </>
    ),
    Layer5_Segmentation_SourcePanelBody: (
      <>
        <textarea
          data-debug-item="source_textarea"
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          placeholder={'Paste your source text here...\n\nThe workspace will analyze and segment your text into structured, study-ready sections.'}
          style={{
            width: '100%',
            flex: 1,
            minHeight: 0,
            border: 'none',
            resize: 'none',
            outline: 'none',
            padding: '28px 28px 30px',
            background: '#ffffff',
            color: 'rgba(0, 0, 0, 0.8)',
            fontFamily: typography.bodyText.fontFamily,
            fontSize: '16px',
            lineHeight: 1.9,
            boxSizing: 'border-box',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '24px',
            bottom: '28px',
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontSize: '56px',
            lineHeight: 1,
            letterSpacing: '-0.06em',
            color: 'rgba(37, 99, 235, 0.065)',
            textShadow: '0 0 26px rgba(37, 99, 235, 0.05)',
            pointerEvents: 'none',
          }}
        >
          Arapal
        </div>
      </>
    ),
    Layer5_Segmentation_SourcePanelFooter: (
      <>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[8],
            fontSize: '12px',
            color: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <span
            style={{
              minWidth: '20px',
              height: '20px',
              padding: '0 4px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(0, 0, 0, 0.25)',
              fontSize: '12px',
              lineHeight: 1,
            }}
          >
            ⌘
          </span>
          <span
            style={{
              minWidth: '20px',
              height: '20px',
              padding: '0 4px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(0, 0, 0, 0.25)',
              fontSize: '12px',
              lineHeight: 1,
            }}
          >
            V
          </span>
          <span>to paste</span>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.2)', letterSpacing: '0.04em' }}>
          {hasText ? `${wordCount} words` : ''}
        </div>
      </>
    ),
    Layer5_Segmentation_ActionDock: (
      <div className="v2-seg-paste__ctaCluster">
        <button
          type="button"
          data-debug-item="primary_cta"
          disabled={!hasText}
          onClick={() => {
            if (!hasText) {
              return
            }

            shell.navigate('segmentationTransition')
          }}
          className="v2-seg-paste__primaryButton"
        >
          <span className="v2-seg-paste__primaryButtonContent">
            {selectedMethod.id === 'manual' ? <Edit3 size={16} strokeWidth={1.9} /> : <Sparkles size={16} strokeWidth={1.9} />}
            <span>{selectedMethod.id === 'manual' ? 'Manual review' : 'AI Segment Text'}</span>
            <ArrowDown size={16} strokeWidth={1.9} />
          </span>
        </button>

        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="Segmentation options"
          ref={splitButtonRef}
          onClick={() => setIsMenuOpen((current) => !current)}
          className="v2-seg-paste__splitButton"
        >
          <ChevronUp
            size={18}
            strokeWidth={1.9}
            className={cx('v2-seg-paste__splitChevron', isMenuOpen && 'is-open')}
          />
        </button>

        {isMenuOpen ? (
          <div
            role="menu"
            aria-label="Segmentation options"
            ref={splitMenuRef}
            className="v2-seg-paste__splitMenu"
          >
            <SplitMenuSection label="Method">
              {methodOptions.map((option) => (
                <SplitMenuOption
                  key={option.id}
                  active={method === option.id}
                  icon={option.icon}
                  label={option.label}
                  onClick={() => setMethod(option.id)}
                />
              ))}
            </SplitMenuSection>

            <SplitMenuSection label="Segmentation style">
              {styleOptions.map((option) => (
                <SplitMenuOption
                  key={option.id}
                  active={style === option.id}
                  label={option.label}
                  meta={option.meta}
                  stacked
                  onClick={() => setStyle(option.id)}
                />
              ))}
            </SplitMenuSection>

            <SplitMenuSection label="Granularity">
              {granularityOptions.map((option) => (
                <SplitMenuOption
                  key={option.id}
                  active={granularity === option.id}
                  label={option.label}
                  meta={option.meta}
                  stacked
                  onClick={() => setGranularity(option.id)}
                />
              ))}
            </SplitMenuSection>

            <SplitMenuSection label="Preferences">
              <SplitMenuToggle
                active={quickMode}
                title="Quick mode"
                meta={quickMode ? 'Go straight to Segments Ready after the AI pass' : 'Open review first before showing Segments Ready'}
                onClick={() => setQuickMode((current) => !current)}
              />

              <SplitMenuToggle
                active={showSegmentationTransition}
                title="Show segmentation animation"
                meta="Let the text split visually before study"
                onClick={() => setShowSegmentationTransition((current) => !current)}
              />
            </SplitMenuSection>
          </div>
        ) : null}
      </div>
    ),
  }

  return (
    <>
      <style>{segmentationPasteStyles}</style>
      <V2ScreenFrame
        contract={layoutContract}
        route={route}
        shell={shell}
        screenSlots={slots}
        containerOverrides={{
          Layer2_Body_ContentStartRail: {
            style: {
              padding: '0',
            },
          },
          Layer2_Body_ContentEndRail: {
            style: {
              padding: '0',
            },
          },
          Layer2_Body_ContentCenterField: {
            style: {
              overflow: 'hidden',
            },
          },
          Layer5_Segmentation_WorkspaceFrame: {
            style: {
              alignItems: 'stretch',
            },
          },
        }}
      />
    </>
  )
}
