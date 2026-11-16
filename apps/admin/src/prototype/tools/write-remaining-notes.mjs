import fs from 'fs'
import path from 'path'

const root = path.resolve('apps/admin/src')
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'prototype/fixtures/remainingCatalog.json'), 'utf8'))
const menu = JSON.parse(fs.readFileSync(path.join(root, 'prototype/routeCatalog.json'), 'utf8'))
const zh = fs.readFileSync(path.join(root, 'i18n/locales/zh.ts'), 'utf8')
const i18n = {}
for (const match of zh.matchAll(/^\s+([A-Za-z0-9_]+):\s+'([^']*)'/gm)) i18n[match[1]] = match[2]
const order = new Map(menu.map((item, index) => [item.path, index]))
const groupName = {
  order: '订单管理',
  config: '配置管理',
  merchant: '商户管理',
  payment: '通道管理',
  ticket: '工单列表',
  report: '报表中心',
  mandate: '撮合订单池',
  task: '任务管理',
  userlevel: '用户等级',
  emailManager: '邮件管理',
  wind: '风控管理',
  admin: '系统管理',
}
const pages = [...catalog].sort((a, b) => (order.get(a.path) ?? 999) - (order.get(b.path) ?? 999))
const bi = menu.filter((item) => item.path.startsWith('/biScreen'))

let section = 48
const toc = []
const body = []

function slug(text) {
  return text.trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '')
}

toc.push(`${section}. [BI看板](#${section}-bi看板)`)
body.push(`## ${section}. BI看板`)
body.push('')
body.push('状态：供校正。这一栏没有列表字段，原型不补图表数据。')
body.push('')
body.push('- 栏目：BI看板')
body.push('- 代码：`apps/admin/src/views/biScreen/dataOverview.vue`、`dataScreen.vue`，内容是 `dataIframe.vue`')
body.push('- 这些页面只在 `biDataUrl` 有地址时嵌入线上 BI。原型里 `publicData.ts` 把 `biDataUrl` 收成空对象，页面显示空状态（文案键 `n336`）。')
body.push('- 不连接线上 BI，也不造一份看板假数据，因为页面没有表格接口可以承接。')
body.push('')
body.push('| 路由 | 标题 |')
body.push('| --- | --- |')
for (const item of bi) {
  body.push(`| \`${item.path}\` | ${i18n[item.title] || item.title} |`)
}
body.push('')

const seenFile = new Map()
for (const page of pages) {
  section += 1
  const group = page.path.split('/')[1]
  const pathSlug = page.path.replace(/^\//, '').replace(/\//g, '-')
  const heading = `${section}. ${page.title} ${pathSlug}`
  toc.push(`${section}. [${page.title} \`${page.path}\`](#${slug(heading)})`)
  body.push(`## ${heading}`)
  body.push('')
  body.push('状态：供校正。')
  body.push('')
  body.push(`- 栏目：${groupName[group] || group}`)
  body.push(`- 路由：\`${page.path}\``)
  body.push(`- 代码：\`apps/admin/src/views/${page.file}\``)
  const previous = seenFile.get(page.file)
  if (previous) {
    body.push(`- 和 \`${previous}\` 使用同一个页面组件。列、枚举和假数据是同一套。`)
    body.push('')
    seenFile.set(page.file, page.path)
    continue
  }
  seenFile.set(page.file, page.path)
  if (!page.lists.length) {
    body.push('- 这个页面没有列表接口。富文本测试页左右两块：左边编辑，右边预览，初始文案是「请编辑活动内容」。')
    body.push('')
    continue
  }
  body.push('- 列表接口：')
  for (const list of page.lists) {
    const note = list.mocked ? '前面栏目已经有假数据，本页沿用' : '本阶段按下列生成'
    body.push(`  - \`POST ${list.url}\`（${note}）`)
  }
  if (page.writes.length) {
    body.push(`- 同页其它接口 ${page.writes.length} 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。`)
  }
  body.push('- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。')
  body.push('- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。')
  body.push('')
  if (page.columns.length) {
    body.push('| 字段 | 列名 |')
    body.push('| --- | --- |')
    for (const column of page.columns) {
      const title = String(column.title || column.field).replace(/\|/g, '/')
      body.push(`| \`${column.field}\` | ${title} |`)
    }
    body.push('')
  }
  if (page.enums.length) {
    body.push('同页读到的枚举：')
    body.push('')
    for (const item of page.enums) {
      const pairs = item.pairs.map((pair) => `\`${pair.value}\` ${pair.label}`).join('，')
      body.push(`- ${item.name}：${pairs}`)
    }
    body.push('')
  }
}

const notesPath = path.join(root, 'prototype/notes/field-notes.md')
let notes = fs.readFileSync(notesPath, 'utf8')
notes = notes.replace(
  'APP 管理 §17～§22、KYC 管理 §23～§47 是按代码初读写下的，状态为供校正。等用户把这两栏的意见一起反馈后，再改字段说明和假数据。',
  'APP 管理 §17～§22、KYC 管理 §23～§47 是按代码初读写下的，状态为供校正。等用户把这两栏的意见一起反馈后，再改字段说明和假数据。\n\n其余栏目 §48～§' + section + ' 也是按代码初读写下的，状态为供校正。BI 看板只说明为何是空状态。',
)
const tocBlock = toc.map((line) => line).join('\n')
if (!notes.includes('48. [BI看板]')) {
  notes = notes.replace('47. [自动交易流水 `/kyc/autoTransRes`](#47-自动交易流水)\n', `47. [自动交易流水 \`/kyc/autoTransRes\`](#47-自动交易流水)\n${tocBlock}\n`)
}
if (!notes.includes('## 48. BI看板')) {
  notes = notes.trimEnd() + '\n\n' + body.join('\n') + '\n'
}
fs.writeFileSync(notesPath, notes)
console.log('sections', section, 'toc', toc.length, 'body lines', body.length)
