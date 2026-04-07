import { colors } from '../tokens'

export const identityBadgeChrome = {
  surfaceOutline: '1px solid rgba(191, 219, 254, 0.96)',
  surfaceFill: 'linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(219, 234, 254, 0.98) 100%)',
  tone: colors.accentBase,
  railSurfaceShadow: '0 12px 24px rgba(37, 99, 235, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
  intakeSurfaceShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 16px 28px rgba(37, 99, 235, 0.12)',
  railDotShadow: '8px 0 0 rgba(37, 99, 235, 0.24)',
}

export function getIdentityBadgeStyle({ size, radiusValue, shadowValue, flexValue, overflow = 'hidden' }) {
  return {
    width: size,
    height: size,
    borderRadius: radiusValue,
    border: identityBadgeChrome.surfaceOutline,
    background: identityBadgeChrome.surfaceFill,
    color: identityBadgeChrome.tone,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadowValue,
    overflow,
    flex: flexValue ?? `0 0 ${size}`,
    flexShrink: 0,
  }
}
