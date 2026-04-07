const colors = {
  accent: '#2563EB',
  glow: 'rgba(37, 99, 235, 0.22)',
}

const panelStyles = `
  .panel {
    border: 1px solid ${colors.accent};
    box-shadow: inset 0 1px 0 ${colors.glow};
  }
`

export default function ColorTemplateBoundary() {
  return <div data-styles={panelStyles}>Color template boundary</div>
}
