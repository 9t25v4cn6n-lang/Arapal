import { FileText, Layers3, SlidersHorizontal } from 'lucide-react'
import { colors, radius, spacing, typography } from '../../foundation/tokens'

const advancedOptionsStyles = `
  .study-dashboard-advanced {
    display: grid;
    gap: ${spacing[16]};
    padding-top: ${spacing[4]};
  }

  .study-dashboard-advanced__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${spacing[12]};
  }

  .study-dashboard-advanced__card {
    display: grid;
    gap: ${spacing[10]};
    padding: ${spacing[16]};
    border: 1px solid ${colors.lineSoft};
    border-radius: ${radius[16]};
    background: rgba(255, 255, 255, 0.78);
  }

  .study-dashboard-advanced__icon {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.pill};
    background: ${colors.accentWash};
    color: ${colors.accentStrong};
  }

  .study-dashboard-advanced__title {
    margin: 0;
    font-family: ${typography.studySectionTitle.fontFamily};
    font-size: 13px;
    line-height: 1.25;
    font-weight: 800;
    color: ${colors.textStrong};
  }

  .study-dashboard-advanced__copy {
    margin: 0;
    font-family: ${typography.studySupportText.fontFamily};
    font-size: 12px;
    line-height: 1.5;
    color: ${colors.textSoft};
  }

  @media (max-width: 860px) {
    .study-dashboard-advanced__grid {
      grid-template-columns: 1fr;
    }
  }
`

const advancedItems = [
  {
    title: 'Source setup',
    copy: 'Preserved source, language direction, and setup status. Kept here so the normal resume flow stays clean.',
    icon: FileText,
  },
  {
    title: 'Segmentation',
    copy: 'Technical segmentation labels map to simple lessons before they reach the main dashboard UI.',
    icon: Layers3,
  },
  {
    title: 'Preferences',
    copy: 'Study defaults, support visibility, and review cadence. Safe to ignore until the user asks for control.',
    icon: SlidersHorizontal,
  },
]

export default function AdvancedOptionsPanel() {
  return (
    <section className="study-dashboard-advanced" aria-label="Advanced project options">
      <style>{advancedOptionsStyles}</style>
      <div className="study-dashboard-advanced__grid">
        {advancedItems.map((item) => {
          const Icon = item.icon

          return (
            <article key={item.title} className="study-dashboard-advanced__card">
              <span className="study-dashboard-advanced__icon" aria-hidden="true">
                <Icon size={17} strokeWidth={2} />
              </span>
              <h3 className="study-dashboard-advanced__title">{item.title}</h3>
              <p className="study-dashboard-advanced__copy">{item.copy}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
