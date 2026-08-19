import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { colors, motion, radius, spacing, typography } from '../tokens'


const backPillMetrics = {
  minHeight: '42px',
  minWidth: '104px',
  inlineInset: `${spacing[12]} ${spacing[16]}`,
  contentGap: spacing[8],
  labelFontWeight: 600,
  iconShiftIdle: '0px',
  iconShiftElevated: '-2px',
}

const backPillStyles = `
  /* Below the mobile breakpoint the header lane holds the identity mark, this
     control and a three-step indicator in 375px. The arrow still says "go back";
     the word is the part that can go. Same deliberate degradation the Arapal
     wordmark uses, and the same reason it is declared in a stylesheet: an inline
     style beats a media query.

     Without it the pill kept its 104px floor and its label, the start lane
     stopped yielding once the identity was made non-shrinking, and Back sat on
     top of the step bar's "2". */
  .back-pill {
    min-width: ${backPillMetrics.minWidth};
  }

  @media (max-width: 560px) {
    .back-pill__label { display: none; }
    .back-pill { min-width: 0; padding-inline: ${spacing[12]}; }
  }
`

const backPillChrome = {
  idleSurface: 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 255, 0.92) 100%)',
  elevatedSurface: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(239, 246, 255, 0.96) 100%)',
  idleTone: colors.textSoft,
  elevatedTone: colors.textBody,
  idleIconTone: colors.accentBase,
  elevatedIconTone: colors.accentStrong,
  idleOutline: 'rgba(191, 219, 254, 0.62)',
  elevatedOutline: 'rgba(147, 197, 253, 0.88)',
  idleShadow:
    'inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 6px 16px rgba(148, 163, 184, 0.12), 0 2px 6px rgba(15, 23, 42, 0.04)',
  elevatedShadow:
    'inset 0 1px 0 rgba(255,255,255,0.96), 0 12px 24px rgba(37,99,235,0.12), 0 4px 10px rgba(15,23,42,0.05)',
  focusOutline: '2px solid rgba(37, 99, 235, 0.32)',
  sheenSurface:
    'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.12) 34%, rgba(255,255,255,0) 100%)',
}

const backPillMotion = {
  chromeTransition: `background ${motion.panel}, border-color ${motion.micro}, box-shadow ${motion.panel}, color ${motion.micro}, transform ${motion.micro}`,
  sheenTransition: `opacity ${motion.panel}`,
  iconTransition: `transform ${motion.micro}, color ${motion.micro}`,
}

export default function BackPill({
  onClick,
  children = 'Back',
  icon = <ArrowLeft size={16} strokeWidth={1.9} />,
  style = {},
  debugItem,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const showElevatedChrome = isHovered || isFocused

  return (
    <>
    <style>{backPillStyles}</style>
    <button
      type="button"
      className="back-pill"
      aria-label={typeof children === 'string' ? children : undefined}
      data-debug-item={debugItem}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        border: `1px solid ${showElevatedChrome ? backPillChrome.elevatedOutline : backPillChrome.idleOutline}`,
        borderRadius: radius[24],
        background: showElevatedChrome ? backPillChrome.elevatedSurface : backPillChrome.idleSurface,
        color: showElevatedChrome ? backPillChrome.elevatedTone : backPillChrome.idleTone,
        minHeight: backPillMetrics.minHeight,
        padding: backPillMetrics.inlineInset,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: backPillMetrics.contentGap,
        cursor: 'pointer',
        fontFamily: typography.eyebrowLabel.fontFamily,
        fontSize: typography.eyebrowLabel.fontSize,
        fontWeight: backPillMetrics.labelFontWeight,
        lineHeight: typography.eyebrowLabel.lineHeight,
        letterSpacing: typography.eyebrowLabel.letterSpacing,
        textTransform: typography.eyebrowLabel.textTransform,
        boxShadow: showElevatedChrome ? backPillChrome.elevatedShadow : backPillChrome.idleShadow,
        outline: isFocused ? backPillChrome.focusOutline : 'none',
        outlineOffset: '2px',
        transform: showElevatedChrome ? 'translateY(-1px)' : 'translateY(0)',
        transition: backPillMotion.chromeTransition,
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: 'inherit',
          background: backPillChrome.sheenSurface,
          opacity: showElevatedChrome ? 0.52 : 0.24,
          transition: backPillMotion.sheenTransition,
          pointerEvents: 'none',
        }}
      />
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: backPillMetrics.contentGap,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: showElevatedChrome ? backPillChrome.elevatedIconTone : backPillChrome.idleIconTone,
            transform: `translateX(${showElevatedChrome ? backPillMetrics.iconShiftElevated : backPillMetrics.iconShiftIdle})`,
            transition: backPillMotion.iconTransition,
          }}
        >
          {icon}
        </span>
        <span className="back-pill__label">{children}</span>
      </span>
    </button>
    </>
  )
}
