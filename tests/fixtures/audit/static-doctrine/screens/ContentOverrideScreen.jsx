function ScreenContractRenderer() {
  return null
}

const spacing = { 24: '24px' }

const containerOverrides = {
  Layer4_ContentBand: {
    padding: spacing[24],
  },
}

export default function ContentOverrideScreen() {
  return <ScreenContractRenderer containerOverrides={containerOverrides} />
}
