import fs from 'fs'
import path from 'path'

const root = path.resolve('apps/admin/src')
const routerText = fs.readFileSync(path.join(root, 'router/index.ts'), 'utf8')
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'prototype/routeCatalog.json'), 'utf8'))
const titleByPath = Object.fromEntries(catalog.map((item) => [item.path, item.title]))
const zh = fs.readFileSync(path.join(root, 'i18n/locales/zh.ts'), 'utf8')
const i18n = {}
for (const match of zh.matchAll(/^\s+([A-Za-z0-9_]+):\s+'([^']*)'/gm)) i18n[match[1]] = match[2]

const apiText = new Map()
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) walk(full)
    else if (name.endsWith('.ts')) apiText.set(full, fs.readFileSync(full, 'utf8'))
  }
}
walk(path.join(root, 'api'))
const fnUrl = new Map()
for (const text of apiText.values()) {
  const re = /export function (\w+)\([^)]*\)\s*\{[\s\S]*?request\.(?:post|get)\(\s*['"`]([^'"`]+)['"`]/g
  for (const match of text.matchAll(re)) fnUrl.set(match[1], match[2])
}

const routes = []
for (const match of routerText.matchAll(/"(\/[^"]+)":\s*\(\)\s*=>\s*import\('@\/views\/([^']+)'\)/g)) {
  routes.push({ path: match[1], file: match[2] })
}
const skipPrefix = ['/member', '/kyc', '/appConfig', '/biScreen', '/dashboard']
const fixtureDir = path.join(root, 'prototype/fixtures')
const handledText = [
  fs.readFileSync(path.join(root, 'prototype/mock.ts'), 'utf8'),
  ...fs.readdirSync(fixtureDir).filter((name) => name.endsWith('.ts')).map((name) => fs.readFileSync(path.join(fixtureDir, name), 'utf8')),
].join('\n')
const handledPaths = [...handledText.matchAll(/\.includes\('([^']+)'\)/g)].map((match) => match[1])

function readVue(rel) {
  const full = path.join(root, 'views', rel)
  if (!fs.existsSync(full)) return ''
  return fs.readFileSync(full, 'utf8')
}

function resolveImport(fromFile, spec) {
  if (spec.startsWith('@/')) {
    const rel = spec.slice(2)
    const base = path.join(root, rel)
    for (const candidate of [base, `${base}.vue`, `${base}.tsx`, path.join(base, 'index.vue')]) {
      if (fs.existsSync(candidate) && /\.(vue|tsx)$/.test(candidate)) return candidate
    }
    return ''
  }
  if (!spec.startsWith('.')) return ''
  const base = path.normalize(path.join(path.dirname(fromFile), spec))
  for (const candidate of [base, `${base}.vue`, `${base}.tsx`, path.join(base, 'index.vue')]) {
    if (fs.existsSync(candidate) && /\.(vue|tsx)$/.test(candidate)) return candidate
  }
  return ''
}

function collectTexts(startRel, depth = 0, seen = new Set()) {
  const start = path.join(root, 'views', startRel)
  const out = []
  function visit(file, level) {
    if (!file || seen.has(file) || level > 2 || !fs.existsSync(file)) return
    seen.add(file)
    const text = fs.readFileSync(file, 'utf8')
    out.push(text)
    if (level === 2) return
    for (const match of text.matchAll(/import\s+\w+\s+from\s+['"]([^'"]+)['"]/g)) {
      visit(resolveImport(file, match[1]), level + 1)
    }
  }
  visit(start, 0)
  return out
}

function columnsOf(text) {
  const cols = []
  const re = /dataIndex:\s*["']([^"']+)["'][\s\S]{0,180}?key:\s*["']([^"']+)["']/g
  const re2 = /title:\s*(?:t\(|\$t\()\s*['"]([^'"]+)['"][\s\S]{0,220}?dataIndex:\s*["']([^"']+)["']/g
  const titled = new Map()
  for (const match of text.matchAll(re2)) titled.set(match[2], match[1])
  const seen = new Set()
  for (const match of text.matchAll(/dataIndex:\s*["']([^"']+)["']/g)) {
    const field = match[1]
    if (seen.has(field)) continue
    seen.add(field)
    if (field === 'operate' || field === 'action') continue
    cols.push({ field, titleKey: titled.get(field) || '', title: i18n[titled.get(field)] || titled.get(field) || field })
  }
  return cols
}

function enumsOf(text) {
  const enums = []
  const re = /const\s+(\w*[Mm]ap\w*)\s*(?::\s*any\s*)?(?:=\s*(?:ref\s*\()?\s*(?:<any>)?\s*\{)([\s\S]*?)\n\s*\}/g
  for (const match of text.matchAll(re)) {
    const body = match[2]
    const pairs = []
    for (const line of body.split('\n')) {
      const item = line.match(/^\s*(?:['"]?(\d+|true|false)['"]?)\s*:\s*(?:t\(|\$t\()?\s*['"]([^'"]+)['"]/)
      if (!item) continue
      if (line.trim().startsWith('//')) continue
      pairs.push({ value: item[1], label: i18n[item[2]] || item[2] })
    }
    if (pairs.length) enums.push({ name: match[1], pairs })
  }
  return enums
}

function apisOf(text) {
  const names = new Set()
  for (const name of fnUrl.keys()) {
    if (new RegExp(`\\b${name}\\b`).test(text)) names.add(name)
  }
  return [...names].map((name) => ({ name, url: fnUrl.get(name) }))
}

const pages = []
for (const route of routes) {
  if (skipPrefix.some((prefix) => route.path.startsWith(prefix))) continue
  if (!titleByPath[route.path]) continue
  const parts = collectTexts(route.file)
  const joined = parts.join('\n')
  const apis = apisOf(joined)
  const lists = apis.filter((item) => {
    const last = item.url.split('?')[0].split('/').pop() || ''
    return /list|page|query|record/i.test(last) && !/export|download/i.test(last)
  })
  const reportApis = [
    ['getBiWithdrawOrder', ['WithdrawOrderApi', 'WithdrawOrderMonthApi']],
    ['getPaymentOrder', ['PaymentOrderApi', 'PaymentOrderMonthApi']],
    ['getMerchantOrder', ['MerchantOrderApi', 'MercantOrderMonthApi']],
    ['getFourReportOrder', ['selectQuadReportPage', 'selectQuadMonthReportPage']],
  ]
  for (const [getter, names] of reportApis) {
    if (!joined.includes(getter)) continue
    for (const name of names) {
      if (!lists.some((item) => item.name === name) && fnUrl.has(name)) {
        lists.push({ name, url: fnUrl.get(name) })
      }
    }
  }
  const writes = apis.filter((item) => !lists.includes(item))
  const cols = []
  const seen = new Set()
  for (const part of parts) {
    for (const col of columnsOf(part)) {
      if (seen.has(col.field)) continue
      seen.add(col.field)
      cols.push(col)
    }
  }
  const titleKey = titleByPath[route.path] || ''
  pages.push({
    path: route.path,
    file: route.file,
    titleKey,
    title: i18n[titleKey] || titleKey || route.path,
    columns: cols,
    enums: enumsOf(joined).slice(0, 8),
    lists: lists.map((item) => ({
      ...item,
      resDataType: /resDataType:\s*2/.test(joined) ? 2 : 1,
      mocked: handledPaths.some((itemPath) => item.url.includes(itemPath)),
    })),
    writes: writes.map((item) => item.url),
  })
}

const out = path.join(root, 'prototype/fixtures/remainingCatalog.json')
fs.writeFileSync(out, JSON.stringify(pages, null, 2))
console.log('pages', pages.length)
console.log('with columns', pages.filter((item) => item.columns.length).length)
console.log('with lists', pages.filter((item) => item.lists.length).length)
console.log('unmocked lists', pages.reduce((sum, item) => sum + item.lists.filter((list) => !list.mocked).length, 0))
