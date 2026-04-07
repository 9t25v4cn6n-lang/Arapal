import { motion, surfacePadding, typography } from './sharedTokens.js'

export default function TemplateBoundaryConsumer() {
  const titleSize = typography.page.fontSize
  const panelPadding = surfacePadding.card

  const styles = {
    fontSize: `clamp(${titleSize}, 3vw, ${typography.display.fontSize})`,
    padding: `0 ${panelPadding}`,
    transition: `opacity ${motion.fast}`,
    borderRadius: 'inherit',
  }

  return <div style={styles}>Template boundary consumer</div>
}
