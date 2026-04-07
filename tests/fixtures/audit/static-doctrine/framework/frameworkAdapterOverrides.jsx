export default function FrameworkAdapterOverrides({ contract, containerOverrides = {} }) {
  const runtimeMeta = {
    contract,
    overrideKeys: Object.keys(containerOverrides),
  }

  return (
    <section data-runtime-meta={JSON.stringify(runtimeMeta)}>
      <div>{runtimeMeta.overrideKeys.join(',')}</div>
    </section>
  )
}
