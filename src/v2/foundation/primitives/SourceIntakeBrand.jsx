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

const sourceIntakeBrandStyles = `
  /* display lives here, not inline. An inline style beats a stylesheet rule, so
     the first version of this — class added, inline display: 'grid' left in
     place — matched the media query and changed nothing. The same shape as the
     inline minHeight that quietly defeated the document-level target floor. */
  .source-intake-brand__text { display: grid; }

  @media (max-width: 560px) {
    .source-intake-brand__text { display: none; }
  }
`

export default function SourceIntakeBrand({
  title = 'Source Intake',
  subtitle = 'Segmentation',
  icon = <Scissors size={16} strokeWidth={1.9} />,
  debugItem,
}) {
  return (
    <>
      {/* Below the mobile breakpoint the header lane cannot hold Back, a
          three-step indicator and a two-line brand label. Something has to go,
          and this is the part that carries the least: the badge still marks the
          mode and the step bar still says where you are, whereas the label was
          ellipsising to "Source Inta…" / "Segmentati…" on every screen of the
          flow — six truncations that said nothing the screen did not already. */}
      <style>{sourceIntakeBrandStyles}</style>
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
      <div
        className="source-intake-brand__text"
        style={{ gap: sourceIntakeBrandMetrics.textStackGap, minWidth: 0 }}
      >
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
    </>
  )
}
