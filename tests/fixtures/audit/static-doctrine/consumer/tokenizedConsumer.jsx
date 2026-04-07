import { colors, motion, radius, spacing, typography } from './sharedTokens.js'

export default function TokenizedConsumer() {
  const styles = {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: typography.body.fontWeight,
    padding: spacing[16],
    gap: spacing[12],
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: 'inherit',
    transition: motion.fast,
  }

  return <div style={styles}>Tokenized consumer</div>
}
