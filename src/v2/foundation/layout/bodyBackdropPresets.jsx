import BodyBackdropItems from './BodyBackdropItems'

function EmptyBackdrop() {
  return null
}

export const bodyBackdropPresets = {
  default: BodyBackdropItems,
  none: EmptyBackdrop,
}

export function resolveBodyBackdropPreset(presetName = 'default') {
  return bodyBackdropPresets[presetName] ?? bodyBackdropPresets.default
}

export default bodyBackdropPresets
