import {
  ArrowLeft,
  Check,
  ChevronUp,
  Edit3,
  Scissors,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { colors, elevation, motion, radius, spacing, typography } from '../../foundation/tokens'
import layoutContract from './SegmentationPasteScreen.contract'

const workspaceSteps = [
  { id: 'paste', label: 'Source' },
  { id: 'segment', label: 'Segment' },
  { id: 'review', label: 'Review' },
]

const methodOptions = [
  { id: 'ai', label: 'AI proposal', meta: 'Generate a first pass for later review', icon: Sparkles },
  { id: 'manual', label: 'Manual start', meta: 'Begin from preserved source without a proposal', icon: Edit3 },
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
    <div
      style={{
        paddingTop: label === 'Method' ? '0' : spacing[12],
        marginTop: label === 'Method' ? '0' : spacing[12],
        borderTop: label === 'Method' ? 'none' : `1px solid rgba(226, 232, 240, 0.9)`,
      }}
    >
      <p
        style={{
          ...typography.eyebrowLabel,
          margin: `0 0 ${spacing[8]}`,
          color: colors.textFaint,
        }}
      >
        {label}
      </p>
      <div style={{ display: 'grid', gap: spacing[8] }}>{children}</div>
    </div>
  )
}

function SplitMenuOption({ active = false, icon: Icon, label, meta, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: '48px',
        padding: `0 ${spacing[12]}`,
        border: `1px solid ${active ? colors.accentSoft : 'transparent'}`,
        borderRadius: radius[16],
        background: active ? 'rgba(239, 246, 255, 0.86)' : 'transparent',
        color: active ? colors.accentStrong : colors.textBody,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[12],
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
        <span
          style={{
            display: 'flex',
            alignItems: meta ? 'flex-start' : 'center',
            flexDirection: meta ? 'column' : 'row',
            gap: meta ? '3px' : spacing[12],
            minWidth: 0,
          }}
        >
          {Icon ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[12] }}>
            <Icon size={15} strokeWidth={1.9} />
            {!meta ? label : null}
          </span>
        ) : (
          <span style={{ color: colors.textStrong, fontSize: '13px', lineHeight: 1.2 }}>{label}</span>
        )}
        {meta ? (
          <>
            <span style={{ color: colors.textStrong, fontSize: '13px', lineHeight: 1.2 }}>{label}</span>
            <span style={{ color: colors.textSoft, fontSize: '12px', lineHeight: 1.4 }}>{meta}</span>
          </>
        ) : null}
      </span>
      {active ? <Check size={15} strokeWidth={1.9} /> : null}
    </button>
  )
}

export default function SegmentationPasteScreen({ route, shell }) {
  const [rawText, setRawText] = useState('')
  const [method, setMethod] = useState('ai')
  const [style, setStyle] = useState('meaning')
  const [granularity, setGranularity] = useState('balanced')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const hasText = rawText.trim().length > 0
  const wordCount = hasText ? rawText.trim().split(/\s+/).length : 0
  const selectedMethod = methodOptions.find((option) => option.id === method) ?? methodOptions[0]
  const selectedStyle = styleOptions.find((option) => option.id === style) ?? styleOptions[1]
  const selectedGranularity = granularityOptions.find((option) => option.id === granularity) ?? granularityOptions[1]

  const backButton = <BackPill onClick={() => shell.navigate('projectHome')} />
  const stepbar = <Stepbar />
  const intakeBrand = <IntakeBrand />

  const primaryButtonStyle = {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    minWidth: '340px',
    minHeight: '56px',
    border: 'none',
    borderTopLeftRadius: radius.pill,
    borderBottomLeftRadius: radius.pill,
    borderTopRightRadius: '24px',
    borderBottomRightRadius: '24px',
    background: `linear-gradient(90deg, ${colors.accentBase} 0%, ${colors.accentStrong} 100%)`,
    color: '#ffffff',
    boxShadow: '0 22px 48px rgba(37, 99, 235, 0.18)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[12],
    padding: `0 ${spacing[24]}`,
    fontFamily: typography.bodyText.fontFamily,
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: hasText ? 'pointer' : 'default',
    opacity: hasText ? 1 : 0.92,
  }

  const splitButtonStyle = {
    width: '72px',
    minHeight: '56px',
    border: 'none',
    borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
    borderTopRightRadius: radius.pill,
    borderBottomRightRadius: radius.pill,
    background: `linear-gradient(90deg, ${colors.accentBase} 0%, ${colors.accentStrong} 100%)`,
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 22px 48px rgba(37, 99, 235, 0.18)',
  }

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
          color: '#08060d',
          fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
          fontSize: 'clamp(56px, 4.6vw, 68px)',
          lineHeight: 1,
          transform: 'translateY(-0.05em)',
          transformOrigin: 'center center',
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
            right: '34px',
            bottom: '52px',
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontSize: '48px',
            lineHeight: 1,
            letterSpacing: '-0.06em',
            color: 'rgba(37, 99, 235, 0.085)',
            textShadow: '0 0 24px rgba(37, 99, 235, 0.06)',
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
      <div
        style={{
          position: 'relative',
          display: 'inline-grid',
          gridTemplateColumns: 'minmax(340px, auto) 72px',
          alignItems: 'stretch',
          justifyContent: 'center',
          width: 'max-content',
          height: '56px',
          isolation: 'isolate',
        }}
      >
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
          style={primaryButtonStyle}
        >
          {selectedMethod.id === 'manual' ? <Edit3 size={16} strokeWidth={1.9} /> : <Sparkles size={16} strokeWidth={1.9} />}
          <span>{selectedMethod.id === 'manual' ? 'Manual review' : 'AI Segment Text'}</span>
        </button>

        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="Segmentation options"
          onClick={() => setIsMenuOpen((current) => !current)}
          style={splitButtonStyle}
        >
          <ChevronUp
            size={18}
            strokeWidth={1.9}
            style={{
              transform: isMenuOpen ? 'scale(1.08)' : 'none',
              transition: `transform ${motion.micro}`,
            }}
          />
        </button>

        {isMenuOpen ? (
          <div
            role="menu"
            aria-label="Segmentation options"
            style={{
              position: 'absolute',
              right: '0',
              bottom: 'calc(100% + 16px)',
              width: '320px',
              padding: spacing[16],
              border: `1px solid rgba(191, 219, 254, 0.88)`,
              borderRadius: radius[24],
              background: 'rgba(255, 255, 255, 0.985)',
              backdropFilter: 'blur(16px)',
              boxShadow: elevation.floating,
              zIndex: 80,
            }}
          >
            <SplitMenuSection label="Method">
              {methodOptions.map((option) => (
                <SplitMenuOption
                  key={option.id}
                  active={method === option.id}
                  icon={option.icon}
                  label={option.label}
                  meta={option.meta}
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
                  onClick={() => setGranularity(option.id)}
                />
              ))}
            </SplitMenuSection>
          </div>
        ) : null}
      </div>
    ),
  }

  return (
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
  )
}
