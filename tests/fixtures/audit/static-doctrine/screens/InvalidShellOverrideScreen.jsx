const containerOverrides = {
  Layer2_Body_DefaultSplit: {
    gridTemplateColumns: '1fr 2fr 1fr',
  },
}

function ScreenContractRenderer() {
  return null
}

export default function InvalidShellOverrideScreen() {
  return <ScreenContractRenderer containerOverrides={containerOverrides} />
}
