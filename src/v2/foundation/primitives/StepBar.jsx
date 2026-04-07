import { colors, radius, spacing, typography } from '../tokens'

export default function StepBar({ steps = [], currentIndex = 0, debugItem }) {
  return (
    <div
      data-debug-item={debugItem}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[8],
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {steps.map((item, index) => {
        const state = index === currentIndex ? 'current' : index < currentIndex ? 'complete' : 'pending'

        return (
          <div key={item.id ?? item.label ?? index} style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: radius.pill,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: typography.eyebrowLabel.fontFamily,
                fontSize: typography.eyebrowLabel.fontSize,
                lineHeight: typography.eyebrowLabel.lineHeight,
                background:
                  state === 'current'
                    ? colors.accentBase
                    : state === 'complete'
                      ? 'rgba(37, 99, 235, 0.18)'
                      : 'rgba(148, 163, 184, 0.14)',
                color: state === 'pending' ? colors.textFaint : '#ffffff',
              }}
            >
              {index + 1}
            </div>
            <span
              style={{
                ...typography.eyebrowLabel,
                color:
                  state === 'current'
                    ? colors.textSoft
                    : state === 'complete'
                      ? colors.textBody
                      : colors.textFaint,
                whiteSpace: 'nowrap',
                opacity: state === 'pending' ? 0.82 : 1,
              }}
            >
              {item.label}
            </span>
            {index < steps.length - 1 ? (
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
