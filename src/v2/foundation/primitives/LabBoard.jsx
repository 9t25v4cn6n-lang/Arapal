import V2ScreenFrame from './V2ScreenFrame'
import { colors, elevation, radius, spacing, typography } from '../tokens'
import { labRoutes } from '../../screens/labRoutes'

function getStatusTone(status) {
  switch (status) {
    case 'Locked':
      return {
        background: 'rgba(236, 253, 245, 0.96)',
        border: 'rgba(167, 243, 208, 0.96)',
        color: '#047857',
      }
    case 'Active extraction':
      return {
        background: 'rgba(239, 246, 255, 0.96)',
        border: 'rgba(191, 219, 254, 0.96)',
        color: colors.accentStrong,
      }
    case 'Needs redesign':
      return {
        background: 'rgba(255, 247, 237, 0.96)',
        border: 'rgba(254, 215, 170, 0.96)',
        color: '#c2410c',
      }
    case 'Deferred':
      return {
        background: 'rgba(248, 250, 252, 0.96)',
        border: 'rgba(226, 232, 240, 0.96)',
        color: colors.textSoft,
      }
    case 'Not yet extracted':
      return {
        background: 'rgba(248, 250, 252, 0.96)',
        border: 'rgba(226, 232, 240, 0.96)',
        color: colors.textSoft,
      }
    default:
      return {
        background: 'rgba(248, 251, 255, 0.96)',
        border: colors.lineSoft,
        color: colors.textSoft,
      }
  }
}

function sectionCardStyle() {
  return {
    border: `1px solid ${colors.lineSoft}`,
    borderRadius: radius[24],
    background: 'rgba(255, 255, 255, 0.96)',
    padding: spacing[20],
    boxShadow: elevation.flat,
  }
}

export function LabStatusPill({ status }) {
  const tone = getStatusTone(status)

  return (
    <span
      style={{
        minHeight: 28,
        padding: '0 10px',
        borderRadius: radius.pill,
        border: `1px solid ${tone.border}`,
        background: tone.background,
        color: tone.color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: typography.bodyText.fontFamily,
        fontSize: 11,
        lineHeight: 1,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {status}
    </span>
  )
}

export function LabDisplayStage({
  children,
  empty = false,
  minHeight = 180,
  align = 'center',
  justify = 'center',
}) {
  return (
    <div
      style={{
        minHeight,
        borderRadius: radius[16],
        border: `1px ${empty ? 'dashed' : 'solid'} ${empty ? 'rgba(203, 213, 225, 0.96)' : colors.lineSoft}`,
        background: empty ? 'rgba(255, 255, 255, 0.72)' : 'rgba(248, 251, 255, 0.86)',
        padding: spacing[16],
        overflow: 'hidden',
        display: 'flex',
        alignItems: align,
        justifyContent: justify,
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: align,
          justifyContent: justify,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function LabGenericCard({
  title,
  status,
  note,
  children,
  empty = false,
  minHeight = 180,
  displayAlign = 'center',
  displayJustify = 'center',
}) {
  return (
    <div
      style={{
        border: `1px ${empty ? 'dashed' : 'solid'} ${empty ? 'rgba(203, 213, 225, 0.96)' : colors.lineSoft}`,
        borderRadius: radius[24],
        background: empty ? 'rgba(248, 250, 252, 0.86)' : 'rgba(255, 255, 255, 0.98)',
        padding: spacing[18],
        boxShadow: empty ? 'none' : elevation.flat,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[12],
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing[12], alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8], minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontFamily: typography.bodyText.fontFamily,
              fontSize: 17,
              lineHeight: 1.3,
              fontWeight: 700,
              color: colors.textStrong,
            }}
          >
            {title}
          </p>
          {note ? (
            <p style={{ ...typography.bodyText, margin: 0, fontSize: 15, lineHeight: 1.45, color: colors.textSoft }}>
              {note}
            </p>
          ) : null}
        </div>
        <LabStatusPill status={status} />
      </div>
      <LabDisplayStage empty={empty} minHeight={minHeight} align={displayAlign} justify={displayJustify}>
        {children}
      </LabDisplayStage>
    </div>
  )
}

export function LabPlaceholderCard({ title, status = 'Not yet extracted', note }) {
  return (
    <LabGenericCard title={title} status={status} note={note} empty>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.textFaint,
          fontFamily: typography.bodyText.fontFamily,
          fontSize: 14,
        }}
      >
        Empty until extracted
      </div>
    </LabGenericCard>
  )
}

export function LabSection({ title, description, children, columns = 'repeat(2, minmax(0, 1fr))' }) {
  return (
    <section style={sectionCardStyle()}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8], marginBottom: spacing[16] }}>
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>{title}</p>
        {description ? (
          <p style={{ ...typography.bodyText, margin: 0, maxWidth: '76ch', color: colors.textBody }}>{description}</p>
        ) : null}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: columns,
          gap: spacing[16],
        }}
      >
        {children}
      </div>
    </section>
  )
}

export function LabIndexCard({ routeId, title, description, shell }) {
  return (
    <button
      type="button"
      onClick={() => shell.navigate(routeId)}
      style={{
        border: `1px solid ${colors.lineSoft}`,
        borderRadius: radius[24],
        background: 'rgba(255, 255, 255, 0.98)',
        boxShadow: elevation.flat,
        padding: spacing[20],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacing[12],
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.accentBase }}>Board</p>
      <h3
        style={{
          margin: 0,
          fontFamily: typography.cardTitle.fontFamily,
          fontSize: 30,
          lineHeight: 1.05,
          color: colors.textStrong,
        }}
      >
        {title}
      </h3>
      <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>{description}</p>
    </button>
  )
}

function LabNav({ shell, route }) {
  return (
    <>
      {labRoutes.map((labRoute) => {
        const isActive = route.id === labRoute.id
        return (
          <button
            key={labRoute.id}
            type="button"
            onClick={() => shell.navigate(labRoute.id)}
            style={{
              width: '100%',
              border: `1px solid ${isActive ? 'rgba(147, 197, 253, 0.96)' : colors.lineSoft}`,
              borderRadius: radius[16],
              background: isActive ? 'rgba(239, 246, 255, 0.96)' : 'rgba(255, 255, 255, 0.92)',
              boxShadow: isActive ? elevation.flat : 'none',
              padding: `${spacing[12]} ${spacing[14]}`,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[6],
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ ...typography.eyebrowLabel, color: isActive ? colors.accentBase : colors.textSoft }}>
              {labRoute.label}
            </span>
            <span
              style={{
                fontFamily: typography.bodyText.fontFamily,
                fontSize: 14,
                lineHeight: 1.45,
                color: colors.textBody,
              }}
            >
              {labRoute.description}
            </span>
          </button>
        )
      })}
    </>
  )
}

export function LabScaffold({
  contract,
  route,
  shell,
  eyebrow = 'Generics',
  title,
  intro,
  content,
  rightRail = null,
}) {
  const cardStyle = sectionCardStyle()

  const slots = {
    Layer3_Lab_LeftNav: <LabNav shell={shell} route={route} />,
    Layer3_Lab_Hero: (
      <div style={{ ...cardStyle, padding: spacing[28] }}>
        <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[10]}`, color: colors.accentBase }}>{eyebrow}</p>
        <h1
          style={{
            margin: `0 0 ${spacing[12]}`,
            fontFamily: typography.bodyText.fontFamily,
            fontSize: 'clamp(26px, 2.3vw, 34px)',
            lineHeight: 1.15,
            fontWeight: 700,
            color: colors.textStrong,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        <p style={{ ...typography.bodyText, margin: 0, maxWidth: '64ch', lineHeight: 1.6, color: colors.textBody }}>{intro}</p>
      </div>
    ),
    Layer3_Lab_Content: content,
    Layer3_Lab_RightRail: rightRail,
  }

  return <V2ScreenFrame contract={contract} route={route} shell={shell} screenSlots={slots} />
}
