import BodyBackdropItems from './BodyBackdropItems'

function EmptyBackdrop() {
  return null
}

const bodyBackdropPresets = {
  default: BodyBackdropItems,
  none: EmptyBackdrop,
}

export function resolveBodyBackdropPreset(presetName = 'default') {
  return bodyBackdropPresets[presetName] ?? bodyBackdropPresets.default
}
