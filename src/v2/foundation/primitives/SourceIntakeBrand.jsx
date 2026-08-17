import { Scissors } from 'lucide-react'
import { colors, radius, spacing, typography } from '../tokens'
import { getIdentityBadgeStyle, identityBadgeChrome } from './identityBadgePresets'

const sourceIntakeBrandMetrics = {
  badgeSize: '32px',
  textStackGap: '3px',
  titleFontWeight: 600,
  titleTracking: '0.15em',
  subtitleTracking: '0.2em',
}

/**
 * letter-spacing adds a trailing track after the final character, so a tracked
 * uppercase label is always about one track wider than the glyphs it draws.
 * Reclaiming it is the difference between "SEGMENTATION NEXT" fitting its lane
 * and ellipsising to "SEGMENTATION NEX…" by 2px.
 *
 * This is a property of the tracked-label idiom, not of this component. Every
 * uppercase tracked label in the product has it; a shared label primitive is
 * where it belongs once one exists.
 */
const reclaimTrailingTrack = (tracking) => ({
  letterSpacing: tracking,
  marginInlineEnd: `-${tracking}`,
})

export default function SourceIntakeBrand({
  title = 'Source Intake',
  subtitle = 'Segmentation',
  icon = <Scissors size={16} strokeWidth={1.9} />,
  debugItem,
}) {
  return (
    <div
      data-debug-item={debugItem}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[12],
        minWidth: 0,
      }}
    >
      <div
        style={{
          ...getIdentityBadgeStyle({
            size: sourceIntakeBrandMetrics.badgeSize,
            radiusValue: radius.pill,
            shadowValue: identityBadgeChrome.intakeSurfaceShadow,
          }),
          border: `1px solid ${colors.lineStrong}`,
        }}
      >
        {icon}
      </div>
      <div style={{ display: 'grid', gap: sourceIntakeBrandMetrics.textStackGap, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: typography.bodyText.fontFamily,
            fontSize: typography.bodyText.fontSize,
            lineHeight: typography.bodyText.lineHeight,
            fontWeight: sourceIntakeBrandMetrics.titleFontWeight,
            ...reclaimTrailingTrack(sourceIntakeBrandMetrics.titleTracking),
            textTransform: 'uppercase',
            color: colors.textStrong,
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: 0,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: typography.eyebrowLabel.fontFamily,
            fontSize: typography.eyebrowLabel.fontSize,
            lineHeight: typography.eyebrowLabel.lineHeight,
            ...reclaimTrailingTrack(sourceIntakeBrandMetrics.subtitleTracking),
            textTransform: typography.eyebrowLabel.textTransform,
            color: colors.textSoft,
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  )
}
