export const validOverrideContract = [
  {
    name: 'Layer3_TestComposition',
    parent: 'Layer2_Body_ContentCenterField',
  },
  {
    name: 'Layer4_ContentBand',
    parent: 'Layer3_TestComposition',
  },
  {
    name: 'Layer4_OptionalSpacer',
    parent: 'Layer3_TestComposition',
    allowEmpty: true,
    semanticRole: 'structural-spacer',
  },
]
