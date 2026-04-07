export default {
  layer4: [
    {
      name: 'Layer4_B',
      parent: 'Layer3_B',
      display: 'flex',
      layoutMode: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      gap: '12px',
      overflow: 'visible',
      textAlign: 'center',
      semanticRole: 'full-span-band',
      style: {
        gridRow: '4',
        minWidth: 0,
        minHeight: 0,
      },
    },
  ],
}
