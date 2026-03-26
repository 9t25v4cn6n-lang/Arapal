import layoutContract from './FoundationLabScreen.contract'
import { LabIndexCard, LabScaffold, LabSection, LabStatusPill } from '../../foundation/primitives/LabBoard'
import { labRoutes } from '../labRoutes'
import { colors, radius, spacing, typography } from '../../foundation/tokens'

const statusRows = [
  'Locked',
  'Active extraction',
  'Candidate',
  'Needs redesign',
  'Deferred',
]

export default function FoundationLabScreen({ route, shell }) {
  const content = (
    <>
      <LabSection
        title="Boards"
        description="Open a board, review that family of generics visually, and only then approve it in the inventory."
        columns="repeat(3, minmax(0, 1fr))"
      >
        {labRoutes
          .filter((item) => item.id !== 'foundationLab')
          .map((item) => (
            <LabIndexCard
              key={item.id}
              routeId={item.id}
              title={item.title}
              description={item.description}
              shell={shell}
            />
          ))}
      </LabSection>
    </>
  )

  const rightRail = (
    <>
      <div
        style={{
          border: `1px solid ${colors.lineSoft}`,
          borderRadius: radius[24],
          background: 'rgba(255, 255, 255, 0.96)',
          padding: spacing[18],
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[12],
        }}
      >
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Workflow</p>
        <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
          Review the family on the board, refine the extracted item, then update the inventory once the family feels
          coherent.
        </p>
      </div>
      <div
        style={{
          border: `1px solid ${colors.lineSoft}`,
          borderRadius: radius[24],
          background: 'rgba(248, 251, 255, 0.96)',
          padding: spacing[18],
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[10],
        }}
      >
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Status key</p>
        {statusRows.map((status) => (
          <LabStatusPill key={status} status={status} />
        ))}
      </div>
    </>
  )

  return (
    <LabScaffold
      contract={layoutContract}
      route={route}
      shell={shell}
      eyebrow="Review boards"
      title="Approve generics before screens."
      intro="These boards are for our internal review process. We judge size, behavior, refinement, and consistency here before product screens are rebuilt from shared primitives."
      content={content}
      rightRail={rightRail}
    />
  )
}
