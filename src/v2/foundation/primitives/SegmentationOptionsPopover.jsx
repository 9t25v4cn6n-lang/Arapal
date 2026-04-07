import { forwardRef } from 'react'
import { Check, Edit3, Sparkles } from 'lucide-react'
import { colors, radius, spacing, typography } from '../tokens'

export const segmentationMethodOptions = [
  { id: 'ai', label: 'AI proposal', icon: Sparkles },
  { id: 'manual', label: 'Manual start', icon: Edit3 },
]

export const segmentationStyleOptions = [
  { id: 'sentence', label: 'Sentence', meta: 'Split close to sentence boundaries' },
  { id: 'meaning', label: 'Meaning groups', meta: 'Keep small ideas together' },
  { id: 'topic', label: 'Topic-led', meta: 'Group around sub-topic shifts' },
]

export const segmentationGranularityOptions = [
  { id: 'tight', label: 'Tighter', meta: 'Smaller, more frequent segments' },
  { id: 'balanced', label: 'Balanced', meta: 'Default balance for most texts' },
  { id: 'broad', label: 'Broader', meta: 'Fewer, larger sections' },
]

const popoverMetrics = {
  panelWidth: '320px',
  panelInset: '14px',
  sectionOffset: '10px',
  labelBottomSpace: spacing[8],
  labelSize: '10px',
  optionRowHeight: '48px',
  optionInsetX: '14px',
  optionBetween: spacing[12],
  optionIconBetween: '10px',
  optionStackBetween: '3px',
  optionTitleSize: '13px',
  optionMetaSize: '12px',
  optionLead: '1.4',
  optionTitleLead: '1.2',
  toggleBetween: spacing[16],
  toggleStackBetween: spacing[4],
  switchTrackWidth: '34px',
  switchTrackHeight: '20px',
  switchThumbInset: spacing[4],
  switchThumbSize: '16px',
  switchThumbTravel: '14px',
  inlineSectionBetween: spacing[8],
}

const popoverChrome = {
  panelBorder: '1px solid rgba(191, 219, 254, 0.88)',
  panelRadius: radius[24],
  panelSurface:
    'radial-gradient(circle at top left, rgba(239, 246, 255, 0.9) 0%, rgba(239, 246, 255, 0) 48%), radial-gradient(circle at bottom right, rgba(219, 234, 254, 0.52) 0%, rgba(219, 234, 254, 0) 46%), linear-gradient(180deg, rgba(255, 255, 255, 0.82) 0%, rgba(248, 251, 255, 0.94) 100%)',
  panelBlur: 'blur(18px) saturate(1.08)',
  panelShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72), 0 32px 64px rgba(15, 23, 42, 0.16)',
  sectionDivider: '1px solid rgba(226, 232, 240, 0.9)',
  optionOutline: '1px solid transparent',
  optionRadius: radius[16],
  optionRestSurface: 'transparent',
  optionHoverOutline: 'rgba(191, 219, 254, 0.88)',
  optionHoverSurface: 'rgba(239, 246, 255, 0.74)',
  optionSelectedOutline: 'rgba(147, 197, 253, 0.92)',
  optionSelectedSurface: 'rgba(239, 246, 255, 0.86)',
  switchTrackRest: 'rgba(148, 163, 184, 0.28)',
  switchTrackActive: 'rgba(37, 99, 235, 0.86)',
  switchThumbSurface: '#ffffff',
  switchThumbShadow: '0 2px 8px rgba(15, 23, 42, 0.16)',
}

const popoverMotion = {
  enterAnimation: 'v2-seg-paste-fade-up 0.2s ease both',
  hoverTransition: 'border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease',
  switchSurfaceTransition: 'background-color 0.2s ease',
  switchThumbTransition: 'transform 0.2s ease',
}

const segmentationOptionsPopoverStyles = `
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
    width: ${popoverMetrics.panelWidth};
    padding: ${popoverMetrics.panelInset};
    border: ${popoverChrome.panelBorder};
    border-radius: ${popoverChrome.panelRadius};
    background: ${popoverChrome.panelSurface};
    backdrop-filter: ${popoverChrome.panelBlur};
    box-shadow: ${popoverChrome.panelShadow};
    z-index: 80;
    animation: ${popoverMotion.enterAnimation};
  }

  .v2-seg-paste__splitMenuSection + .v2-seg-paste__splitMenuSection {
    margin-top: ${popoverMetrics.sectionOffset};
    padding-top: ${popoverMetrics.sectionOffset};
    border-top: ${popoverChrome.sectionDivider};
  }

  .v2-seg-paste__splitMenuLabel {
    margin: 0 0 ${popoverMetrics.labelBottomSpace};
    font-size: ${popoverMetrics.labelSize};
    line-height: ${typography.eyebrowLabel.lineHeight};
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${colors.textFaint};
  }

  .v2-seg-paste__splitMenuOption {
    width: 100%;
    min-height: ${popoverMetrics.optionRowHeight};
    padding: 0 ${popoverMetrics.optionInsetX};
    border: ${popoverChrome.optionOutline};
    border-radius: ${popoverChrome.optionRadius};
    background: ${popoverChrome.optionRestSurface};
    color: ${colors.textBody};
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: ${popoverMetrics.optionBetween};
    cursor: pointer;
    transition: ${popoverMotion.hoverTransition};
    text-align: left;
  }

  .v2-seg-paste__splitMenuOption:hover {
    transform: translateY(-1px);
    border-color: ${popoverChrome.optionHoverOutline};
    background: ${popoverChrome.optionHoverSurface};
  }

  .v2-seg-paste__splitMenuOption.is-selected {
    border-color: ${popoverChrome.optionSelectedOutline};
    background: ${popoverChrome.optionSelectedSurface};
    color: ${colors.accentStrong};
  }

  .v2-seg-paste__splitMenuOptionText {
    display: flex;
    align-items: center;
    gap: ${popoverMetrics.optionIconBetween};
    min-width: 0;
    font-size: ${popoverMetrics.optionTitleSize};
    line-height: ${popoverMetrics.optionLead};
  }

  .v2-seg-paste__splitMenuOptionText.is-stacked {
    align-items: flex-start;
    flex-direction: column;
    gap: ${popoverMetrics.optionStackBetween};
  }

  .v2-seg-paste__splitMenuOptionTitle {
    color: ${colors.textStrong};
    font-size: ${popoverMetrics.optionTitleSize};
    line-height: ${popoverMetrics.optionTitleLead};
  }

  .v2-seg-paste__splitMenuOptionMeta {
    color: ${colors.textSoft};
    font-size: ${popoverMetrics.optionMetaSize};
    line-height: ${popoverMetrics.optionLead};
  }

  .v2-seg-paste__splitMenuToggle {
    width: 100%;
    min-height: ${popoverMetrics.optionRowHeight};
    padding: 0 ${popoverMetrics.optionInsetX};
    border: ${popoverChrome.optionOutline};
    border-radius: ${popoverChrome.optionRadius};
    background: ${popoverChrome.optionRestSurface};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${popoverMetrics.toggleBetween};
    cursor: pointer;
    transition: ${popoverMotion.hoverTransition};
    text-align: left;
  }

  .v2-seg-paste__splitMenuToggle:hover {
    transform: translateY(-1px);
    border-color: ${popoverChrome.optionHoverOutline};
    background: ${popoverChrome.optionHoverSurface};
  }

  .v2-seg-paste__splitMenuToggleText {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${popoverMetrics.toggleStackBetween};
    text-align: left;
    min-width: 0;
  }

  .v2-seg-paste__splitMenuToggleTitle {
    font-size: ${popoverMetrics.optionTitleSize};
    line-height: ${popoverMetrics.optionTitleLead};
    color: ${colors.textStrong};
  }

  .v2-seg-paste__splitMenuToggleMeta {
    color: ${colors.textSoft};
    font-size: ${popoverMetrics.optionMetaSize};
    line-height: ${popoverMetrics.optionLead};
  }

  .v2-seg-paste__miniSwitch {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: ${popoverMetrics.switchTrackWidth};
    height: ${popoverMetrics.switchTrackHeight};
    border-radius: ${radius.pill};
    background: ${popoverChrome.switchTrackRest};
    transition: ${popoverMotion.switchSurfaceTransition};
    flex-shrink: 0;
  }

  .v2-seg-paste__miniSwitch.is-active {
    background: ${popoverChrome.switchTrackActive};
  }

  .v2-seg-paste__miniSwitchThumb {
    position: absolute;
    top: ${popoverMetrics.switchThumbInset};
    left: ${popoverMetrics.switchThumbInset};
    width: ${popoverMetrics.switchThumbSize};
    height: ${popoverMetrics.switchThumbSize};
    border-radius: ${radius.pill};
    background: ${popoverChrome.switchThumbSurface};
    box-shadow: ${popoverChrome.switchThumbShadow};
    transition: ${popoverMotion.switchThumbTransition};
  }

  .v2-seg-paste__miniSwitch.is-active .v2-seg-paste__miniSwitchThumb {
    transform: translateX(${popoverMetrics.switchThumbTravel});
  }
`

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

function SplitMenuSection({ label, children }) {
  return (
    <div className="v2-seg-paste__splitMenuSection">
      <p className="v2-seg-paste__splitMenuLabel">{label}</p>
      <div style={{ display: 'grid', gap: popoverMetrics.inlineSectionBetween }}>{children}</div>
    </div>
  )
}

function SplitMenuOption({ icon: Icon, label, meta, selected = false, onClick }) {
  return (
    <button
      type="button"
      className={cx('v2-seg-paste__splitMenuOption', selected && 'is-selected')}
      onClick={onClick}
    >
      {Icon ? (
        <span className="v2-seg-paste__splitMenuOptionText">
          <Icon size={15} strokeWidth={1.9} />
          <span className="v2-seg-paste__splitMenuOptionTitle">{label}</span>
        </span>
      ) : (
        <span className="v2-seg-paste__splitMenuOptionText is-stacked">
          <span className="v2-seg-paste__splitMenuOptionTitle">{label}</span>
          {meta ? <span className="v2-seg-paste__splitMenuOptionMeta">{meta}</span> : null}
        </span>
      )}
      {selected ? <Check size={15} strokeWidth={1.9} color={colors.accentStrong} /> : null}
    </button>
  )
}

function SplitMenuToggle({ title, meta, active = false, onClick }) {
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

const SegmentationOptionsPopover = forwardRef(function SegmentationOptionsPopover(
  {
    methodOptions = segmentationMethodOptions,
    method,
    onMethodChange = () => {},
    styleOptions = segmentationStyleOptions,
    selectedStyle,
    onStyleChange = () => {},
    granularityOptions = segmentationGranularityOptions,
    granularity,
    onGranularityChange = () => {},
    quickMode = false,
    onQuickModeChange = () => {},
    quickModeMeta = 'Go straight to Segments Ready after the AI pass',
    showSegmentationTransition = true,
    onShowSegmentationTransitionChange = () => {},
    containerStyle,
    role,
    ariaLabel,
  },
  ref
) {
  return (
    <>
      <style>{segmentationOptionsPopoverStyles}</style>
      <div
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        className="v2-seg-paste__splitMenu"
        style={containerStyle}
      >
        <SplitMenuSection label="Method">
          {methodOptions.map((option) => (
            <SplitMenuOption
              key={option.id}
              selected={method === option.id}
              icon={option.icon}
              label={option.label}
              onClick={() => onMethodChange(option.id)}
            />
          ))}
        </SplitMenuSection>

        <SplitMenuSection label="Segmentation style">
          {styleOptions.map((option) => (
            <SplitMenuOption
              key={option.id}
              selected={selectedStyle === option.id}
              label={option.label}
              meta={option.meta}
              onClick={() => onStyleChange(option.id)}
            />
          ))}
        </SplitMenuSection>

        <SplitMenuSection label="Granularity">
          {granularityOptions.map((option) => (
            <SplitMenuOption
              key={option.id}
              selected={granularity === option.id}
              label={option.label}
              meta={option.meta}
              onClick={() => onGranularityChange(option.id)}
            />
          ))}
        </SplitMenuSection>

        <SplitMenuSection label="Preferences">
          <SplitMenuToggle
            title="Quick mode"
            meta={quickModeMeta}
            active={quickMode}
            onClick={() => onQuickModeChange(!quickMode)}
          />
          <SplitMenuToggle
            title="Show segmentation animation"
            meta="Let the text split visually before study"
            active={showSegmentationTransition}
            onClick={() => onShowSegmentationTransitionChange(!showSegmentationTransition)}
          />
        </SplitMenuSection>
      </div>
    </>
  )
})

export default SegmentationOptionsPopover
