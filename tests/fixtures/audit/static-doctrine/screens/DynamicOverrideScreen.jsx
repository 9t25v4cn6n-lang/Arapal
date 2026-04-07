function ScreenContractRenderer() {
  return null
}

const spacing = { 12: '12px' }

function getDynamicOverrides() {
  return {
    Layer4_ContentBand: {
      padding: spacing[12],
    },
  }
}

export default function DynamicOverrideScreen() {
  const overrides = getDynamicOverrides()
  return <ScreenContractRenderer containerOverrides={overrides} />
}
