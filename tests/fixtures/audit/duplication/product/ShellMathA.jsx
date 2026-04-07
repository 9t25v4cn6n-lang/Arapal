const shellColumns = 'minmax(max-content, 2fr) minmax(max-content, 6fr) minmax(max-content, 2fr)'

export default function ShellMathA() {
  return <div style={{ gridTemplateColumns: shellColumns }} />
}
