import BodyBackdropItems, { DualWordmarkBodyBackdropItems } from './BodyBackdropItems'

function EmptyBackdrop() {
  return null
}

const bodyBackdropPresets = {
  default: BodyBackdropItems,
  dualWordmark: DualWordmarkBodyBackdropItems,
  none: EmptyBackdrop,
}

export function resolveBodyBackdropPreset(presetName = 'default') {
  return bodyBackdropPresets[presetName] ?? bodyBackdropPresets.default
}
