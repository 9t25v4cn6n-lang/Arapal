export const colors = {
  accentBase: '#2563EB',
  accentStrong: '#1D4ED8',
  accentSoft: '#93C5FD',
  accentWash: '#EFF6FF',
  accentMist: '#DBEAFE',
  bgTop: '#F6F9FD',
  bgBottom: '#EDF3F9',
  surfacePrimary: '#FFFFFF',
  surfaceSoft: '#F8FBFF',
  textStrong: '#0F172A',
  textBody: '#334155',
  // Sits between textBody and textSoft. Already shipped as a bare #475569 in 18
  // places with no token to name it, which is why two neutral dialects (slate
  // and gray) grew side by side in the first place.
  textMuted: '#475569',
  textSoft: '#64748B',
  // Retuned from #94A3B8 (2.6:1 — failed AA at every size it was used at).
  // DECORATIVE AND ICON USE ONLY. Text must use textSoft or darker.
  textFaint: '#8496AE',
  lineSoft: 'rgba(219, 228, 239, 0.96)',
  lineStrong: 'rgba(147, 197, 253, 0.72)',
  // Opaque divider/hairline pair. lineSoft/lineStrong are translucent and only
  // work over a known backdrop; every solid border in the product reached for a
  // bare #E2E8F0 / #CBD5E1 instead. Naming them stops that.
  borderSoft: '#E2E8F0',
  borderStrong: '#CBD5E1',
  // Fills and icons only — both fail 4.5:1 as text.
  success: '#16A34A',
  review: '#D97706',
  // The only values permitted for semantic TEXT.
  successStrong: '#15803D',
  reviewStrong: '#B45309',
  // Third semantic so "needs revision" and "weak area" stop sharing one amber.
  critical: '#BE123C',
}
