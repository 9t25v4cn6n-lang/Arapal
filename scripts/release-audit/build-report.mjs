import fs from 'node:fs'
import path from 'node:path'

const root = process.argv[2] || 'artifacts/release-audit/evidence'
if (!fs.existsSync(root)) process.exit(0)

const walk = (dir) => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => {
  const p = path.join(dir, e.name)
  return e.isDirectory() ? walk(p) : [p]
})

const statuses = walk(root).filter(p => p.endsWith('status.json')).map(p => ({
  path: p,
  ...JSON.parse(fs.readFileSync(p, 'utf8'))
}))

const familyAggregate = {}
for (const file of walk(root).filter(p => p.endsWith('families.json'))) {
  const families = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const [name, data] of Object.entries(families)) {
    const f = familyAggregate[name] ||= {count:0, fontSizes:{}, fontWeights:{}, radii:{}, heights:{}, paddings:{}, sources:[]}
    f.count += data.count
    for (const key of ['fontSizes','fontWeights','radii','heights','paddings']) {
      for (const [v,c] of Object.entries(data[key] || {})) f[key][v] = (f[key][v] || 0) + c
    }
    f.sources.push(path.relative(root, file))
  }
}

fs.writeFileSync(path.join(root,'family-summary.json'), JSON.stringify(familyAggregate,null,2))
fs.writeFileSync(path.join(root,'coverage-summary.json'), JSON.stringify({
  generatedAt:new Date().toISOString(),
  totalExecutions:statuses.length,
  captured:statuses.filter(s=>s.status==='CAPTURED').length,
  unreachable:statuses.filter(s=>s.status==='UNREACHABLE').length,
  statuses
},null,2))

const rows = statuses.map(s => {
  const d = path.dirname(path.relative(root, s.path)).replaceAll('\\','/')
  return `<tr><td>${s.state||''}</td><td>${s.viewport?.id||''}</td><td>${s.status}</td><td>${s.elementCount??''}</td><td>${s.status==='CAPTURED'?`<a href="${d}/screen.png">clean</a> · <a href="${d}/numbered-map.png">numbered</a> · <a href="${d}/elements.json">data</a>`:''}</td></tr>`
}).join('\n')

const html = `<!doctype html><meta charset="utf-8"><title>Arapal release audit evidence</title>
<style>body{font:14px system-ui;margin:32px;color:#111827}table{border-collapse:collapse;width:100%}td,th{border:1px solid #d1d5db;padding:7px;text-align:left}th{background:#f3f4f6;position:sticky;top:0}a{color:#1d4ed8}</style>
<h1>Arapal Release Audit Evidence</h1>
<p>${statuses.filter(s=>s.status==='CAPTURED').length} captured executions; ${statuses.filter(s=>s.status==='UNREACHABLE').length} unreachable.</p>
<p><a href="coverage-summary.json">coverage-summary.json</a> · <a href="family-summary.json">family-summary.json</a></p>
<table><thead><tr><th>State</th><th>Viewport</th><th>Status</th><th>Elements</th><th>Evidence</th></tr></thead><tbody>${rows}</tbody></table>`
fs.writeFileSync(path.join(root,'index.html'), html)
console.log(`Built release-audit index for ${statuses.length} executions`)
