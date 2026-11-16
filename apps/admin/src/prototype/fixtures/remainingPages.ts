// 会员、KYC、APP 以外的菜单页假数据。列和枚举来自 remainingCatalog.json。
// 字段说明见 notes/field-notes.md，状态为供校正。
// 已经由前面路由处理过的接口不会进到这里。

import { APP_UPI_BANKS } from './appUpiBanks'
import { linkedAppealIds } from './kycMenu'
import catalogJson from './remainingCatalog.json'

type CatalogColumn = { field: string; title: string }
type CatalogEnum = { name: string; pairs: { value: string; label: string }[] }
type CatalogPage = {
  path: string
  columns: CatalogColumn[]
  enums: CatalogEnum[]
  lists: { url: string }[]
  writes: string[]
}

const catalog = catalogJson as CatalogPage[]

type Row = Record<string, any>
type Store = { rows: Row[]; timeKey: string }

const FIELD_VALUES: Record<string, Array<string | number>> = {
  eventFlag: [
    'real_name_auth', 'buy_guide', 'sell_guide', 'bind_fake_app_and_real_name_auth',
    'success_buy', 'success_sell', 'net_buy_sell_amount', 'invitation_member',
    'invitation_and_success_trade', 'buy_transaction_volume', 'usdt_recharge',
  ],
  taskCycle: [1, 2, 3],
  // 这些字段会直接拿去 $t(map[value])，值必须落在 publicData 的键里，否则整页渲染崩掉、后续菜单点不动
  appealType: [1, 2],
  displayAppealType: [1, 2, 3, 4, 5, 6, 7, 8],
  autoAppealType: [1, 2, 3, 4, 5, 6, 7, 8],
  sourceType: [0, 1, 2, 3, 4, 5],
  appealStatus: [1, 2, 3],
  finishType: [1, 2, 3, 4],
  isQuadOrder: [0, 1],
  isKycSellOrder: [0, 1],
  orderStatus: [1, 2, 3, 4, 5],
  buyOrderType: [1, 2, 3, 4, 5, 6, 7],
  memberType: [1, 2, 3, 4],
  taskType: [1, 2, 3, 4],
  exclusiveFlag: [0, 1],
  riskTag: ['0', '1', '2'],
  autoSellFlag: [0, 1, 2],
  autoFinishFlag: [0, 1],
  releaseFlag: [0, 1],
  replenishmentFlag: [0, 1],
  thirdRechargeFlag: [0, 1],
  completedByKyc: [0, 1],
  blockedStatus: [0, 1],
  distributionStatus: [0, 1],
  sellOrderType: [1, 2],
  payType: [1, 2, 3],
}

const SKIP_QUERY = new Set([
  'pageNo', 'pageSize', 'asc', 'column', 'firstPage', 'lastPage', 'direction',
  'nextColValue', 'nextCursorId', 'prevColValue', 'prevCursorId', 'order', 'sort',
  'current', 'size',
])

const stores = new Map<string, Store>()
const listUrls: string[] = []
const writeUrls: string[] = []

const specByUrl = new Map<string, { columns: CatalogColumn[]; enums: CatalogEnum[] }>()
for (const page of catalog) {
  for (const list of page.lists) {
    if (!listUrls.includes(list.url)) listUrls.push(list.url)
    const spec = specByUrl.get(list.url) || { columns: [], enums: [] }
    for (const column of page.columns) {
      if (!spec.columns.some((item) => item.field === column.field)) spec.columns.push(column)
    }
    for (const item of page.enums) {
      if (!spec.enums.some((enumItem) => enumItem.name === item.name)) spec.enums.push(item)
    }
    specByUrl.set(list.url, spec)
  }
  for (const writeUrl of page.writes) {
    if (!writeUrls.includes(writeUrl)) writeUrls.push(writeUrl)
  }
}
listUrls.sort((a, b) => b.length - a.length)
writeUrls.sort((a, b) => b.length - a.length)

function readQuery(raw: unknown): Record<string, any> {
  if (!raw) return {}
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }
  return raw as Record<string, any>
}

function hasFilter(value: unknown) {
  return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)
}

function indiaDay(offsetDays = 0) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const today = fmt.format(new Date())
  const base = new Date(`${today}T12:00:00+05:30`)
  base.setUTCDate(base.getUTCDate() + offsetDays)
  return fmt.format(base)
}

function stamp(index: number) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const hour = 9 + (index % 10)
  const minute = (index * 7) % 60
  return `${indiaDay(0)} ${pad(hour)}:${pad(minute)}:30`
}

function coerce(value: string) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (/^-?\d+$/.test(value)) return Number(value)
  return value
}

function enumFor(field: string, enums: CatalogEnum[]) {
  const name = field.toLowerCase()
  return enums.find((item) => {
    const stripped = item.name.replace(/Map$/i, '').toLowerCase()
    if (stripped.length < 2) return false
    // 只接受字段名和枚举名基本一致，避免 status 误配到所有 *StatusMap
    return name === stripped || name.replace(/s$/, '') === stripped.replace(/s$/, '')
  })
}

function hash(text: string) {
  let value = 0
  for (const char of text) value = (value * 33 + char.charCodeAt(0)) >>> 0
  return value
}

function buildRows(url: string) {
  const spec = specByUrl.get(url) || { columns: [], enums: [] }
  const appealIds = /appealOrderAdmin\/listpage/i.test(url) ? linkedAppealIds() : null
  const count = appealIds
    ? appealIds.length
    : Math.min(40, Math.max(10, ...spec.enums.map((item) => item.pairs.length), 10))
  const baseId = 880000 + (hash(url) % 50000)
  const rows: Row[] = []
  for (let index = 0; index < count; index += 1) {
    const bank = APP_UPI_BANKS[index % APP_UPI_BANKS.length]
    const memberId = 10086001 + (index % 10)
    const row: Row = {
      id: appealIds ? appealIds[index] : baseId + index + 1,
      index: index + 1,
      memberId,
      userId: memberId,
    }
    for (const column of spec.columns) {
      const field = column.field
      if (FIELD_VALUES[field]) {
        const values = FIELD_VALUES[field]
        row[field] = values[index % values.length]
        continue
      }
      const matched = enumFor(field, spec.enums)
      if (matched?.pairs.length) {
        row[field] = coerce(matched.pairs[index % matched.pairs.length].value)
        continue
      }
      if (/memberid|userid|buyerid|sellerid|^mid$|^uid$/i.test(field)) {
        row[field] = memberId
      } else if (field === 'id' && appealIds) {
        // 与各流水页可点击的 appealId 一一对应，点过去能筛到同一条申诉订单
        row[field] = appealIds[index]
      } else if (field === 'id' || /(?:^|_)id$/i.test(field) || (/Id$/.test(field) && !/upiId|uuid/i.test(field))) {
        row[field] = baseId + index + 1
      } else if (/time|date/i.test(field)) {
        row[field] = /date$/i.test(field) && !/time/i.test(field) ? indiaDay(-index) : stamp(index)
      } else if (/bankcode/i.test(field)) {
        row[field] = bank.bankCode
      } else if (/amount|balance|fee|reward|price|money|bonus|rate|count|num|qty|quantity|cost|commission|difference|diff|beforechange|afterchange|memberup|memberdown|cancellation|duration/i.test(field)) {
        row[field] = 1000 + index * 125
      } else if (/phone|mobile/i.test(field)) {
        row[field] = `910000100${index % 10}`
      } else if (/email/i.test(field)) {
        row[field] = `user${index + 1}@prototype.test`
      } else if (/upi/i.test(field)) {
        row[field] = `910000100${index % 10}${bank.upiSuffix}`
      } else if (/status|flag|type|mode|source|result|state|level|cycle|frequency/i.test(field)) {
        // 多数页面 map 只有 1/2；写到 3 容易 $t(undefined) 把路由渲染弄挂
        row[field] = (index % 2) + 1
      } else if (/name$/i.test(field)) {
        row[field] = `${field}${index + 1}`
      } else if (/no$|order|code|utr|tid|account|remark|content|url|path/i.test(field)) {
        row[field] = `${field}-${index + 1}`
      } else {
        // 避免把中文列名写进字段；有的 customRender 会按数字或枚举取值
        row[field] = `${field}-${index + 1}`
      }
    }
    // USDT买入订单页内 orderStatusMap 只有 3/4/7/10/13；写成 1/2 会直接显示数字
    if (/usdtBuyOrderAdmin\/listpage/i.test(url)) {
      const usdtBuyStatus = ['3', '4', '7', '13', '10']
      row.status = usdtBuyStatus[index % usdtBuyStatus.length]
    }
    // 欠费订单：买方/卖方成对字段、撮合状态文案、金额小数，对齐页面展示
    if (/memberArrearsRecordAdmin\/listPage/i.test(url)) {
      const matchStatuses = [8, 12, 13, 5, 6, 3, 4, 15, 16, 7]
      const sellerId = 10086001 + (index % 10)
      const buyerId = 10086011 + (index % 10)
      row.memberId = sellerId
      row.buyerId = buyerId
      row.memberAccount = `91${String(8000000000 + sellerId).slice(-10)}`
      row.buyerAccount = `91${String(8000000000 + buyerId).slice(-10)}`
      row.chOrderNo = `M${860001 + index}`
      row.buyOrderNo = `B${870001 + index}`
      row.sellOrderNo = `S${880001 + index}`
      row.buyOrderIp = `103.${(index % 50) + 1}.${(index % 200) + 10}.${(index % 250) + 1}`
      row.sellOrderIp = index % 3 === 0
        ? '0.0.0.0'
        : index % 3 === 1
          ? `auto-sell:${sellerId}`
          : `49.${index + 1}.8.${index + 2}`
      row.matchingOrderStatus = matchStatuses[index % matchStatuses.length]
      row.isKycSell = index % 2
      row.sourceType = index % 6
      row.orderAmount = Number((100 + index * 37.5).toFixed(2))
      row.amount = Number((38.5 + index * 50.35).toFixed(2))
      row.utr = String(345697988675 + index)
      row.operationBy = index % 2 === 0 ? 'system' : `admin${(index % 3) + 1}`
      row.operationTime = stamp(index)
    }
    rows.push(row)
  }
  const timeKey = spec.columns.find((column) => /time/i.test(column.field))?.field || 'createTime'
  return { rows, timeKey }
}

function ensure(url: string) {
  // 申诉订单列表与流水 appealId 联动，每次按最新 linkedAppealIds 重建，避免旧数字 id 残留
  if (/appealOrderAdmin\/listpage/i.test(url)) {
    const created = buildRows(url)
    stores.set(url, created)
    return created
  }
  const found = stores.get(url)
  if (found) return found
  const created = buildRows(url)
  stores.set(url, created)
  return created
}

function inRange(value: string, start: unknown, end: unknown) {
  let text = String(value ?? '')
  let left = hasFilter(start) ? String(start) : ''
  let right = hasFilter(end) ? String(end) : ''
  if (/^\d{4}-\d{2}$/.test(left) || /^\d{4}-\d{2}$/.test(right)) {
    text = text.slice(0, 7)
    left = left.slice(0, 7)
    right = right.slice(0, 7)
  }
  const dateOnly = (item: string) => item.length === 10 && !item.includes(' ')
  const probe = dateOnly(left) || dateOnly(right) ? text.slice(0, 10) : text
  if (left && probe < left) return false
  if (right && probe > right) return false
  return true
}

function isRangeKey(key: string) {
  return /(Start|End|Begin)(Time|Date)?$/.test(key)
    || /^(start|end|begin)(Time|Date)$/i.test(key)
    || /(Time|Date)(Ge|Le|Start|End)$/.test(key)
    || /(Ge|Le)$/.test(key)
}

function timeQuery(query: Record<string, any>, row: Row) {
  const keys = Object.keys(query).filter((key) => hasFilter(query[key]) && isRangeKey(key))
  const startKey = keys.find((key) => /start|begin|ge/i.test(key))
  if (!startKey) return true
  const endKey = keys.find((key) => key !== startKey && /end|le/i.test(key))
  const base = startKey.replace(/(Start|Begin|End|Ge|Le)(Time|Date)?$/i, '').replace(/Time$|Date$/i, '')
  const candidates = [base, `${base}Time`, `${base}Date`, 'createTime', 'statDate', 'updateTime']
  const field = candidates.find((item) => item && row[item] != null)
    || Object.keys(row).find((item) => /time|date/i.test(item))
  if (!field) return true
  return inRange(String(row[field]), query[startKey], endKey ? query[endKey] : '')
}

function comparable(rowValue: unknown, queryValue: unknown) {
  if (typeof rowValue === 'number' || typeof rowValue === 'boolean') return true
  const text = String(rowValue ?? '')
  if (/[\u4e00-\u9fa5]/.test(text) && /^-?\d+(\.\d+)?$/.test(String(queryValue))) return false
  return true
}

function matches(row: Row, query: Record<string, any>) {
  if (!timeQuery(query, row)) return false
  for (const [key, value] of Object.entries(query)) {
    if (SKIP_QUERY.has(key) || !hasFilter(value) || isRangeKey(key)) continue
    if (!(key in row) || !comparable(row[key], value)) continue
    if (Array.isArray(value)) {
      if (!value.map(String).includes(String(row[key]))) return false
      continue
    }
    const text = String(row[key] ?? '')
    const probe = String(value).trim().toLowerCase()
    // 申诉订单按申诉ID（id）精确匹配，点流水过来只落在对应那一条
    if (key === 'id') {
      if (text.toLowerCase() !== probe) return false
      continue
    }
    if (typeof row[key] === 'number' || typeof row[key] === 'boolean') {
      if (String(row[key]) !== String(value)) return false
    } else if (!text.toLowerCase().includes(probe)) {
      return false
    }
  }
  return true
}

function pageOf(list: Row[], query: Record<string, any>) {
  const pageNo = Number(query.pageNo || query.pageNum || query.current) || 1
  const pageSize = Number(query.pageSize || query.size) || 20
  const start = (pageNo - 1) * pageSize
  return list.slice(start, start + pageSize)
}

function sumField(rows: Row[], field: string) {
  return rows.reduce((total, row) => total + (Number(row[field]) || 0), 0)
}

function numericFields(rows: Row[]) {
  const fields = new Set<string>()
  for (const row of rows) {
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'number' && Number.isFinite(value)) fields.add(key)
    }
  }
  return [...fields]
}

function pascal(field: string) {
  return field.slice(0, 1).toUpperCase() + field.slice(1)
}

function putSum(extend: Record<string, number>, page: Row[], all: Row[], field: string, pageKey: string, totalKey: string) {
  extend[pageKey] = sumField(page, field)
  extend[totalKey] = sumField(all, field)
}

function summaryExtend(url: string, page: Row[], all: Row[]) {
  const extend: Record<string, number> = {}
  const source = all.length ? all : page
  for (const field of numericFields(source)) {
    putSum(extend, page, all, field, `${field}PageTotal`, `${field}Total`)
    putSum(extend, page, all, field, `pageTotal${pascal(field)}`, `total${pascal(field)}`)
  }
  const alias = (field: string, pageKey: string, totalKey: string) => {
    if (!source.some((row) => typeof row[field] === 'number')) return
    putSum(extend, page, all, field, pageKey, totalKey)
  }
  alias('amount', 'amountTotalPage', 'amountTotal')
  alias('amount', 'pageAmount', 'totalAmount')
  alias('bonus', 'bonusPagePageTotal', 'bonusPageTotal')
  alias('actualAmount', 'actualPageAmountTotal', 'actualAmountTotal')
  alias('fixedReward', 'fixedRewardPageTotal', 'totalFixedReward')
  alias('remainingAmount', 'remainingAmountPageTotal', 'sumRemainingAmount')
  alias('beforeChange', 'beforeAmountSum', 'totalBeforeAmountSum')
  alias('changeAmount', 'changeAmountSum', 'totalChangeAmountSum')
  alias('afterChange', 'afterAmountSum', 'totalAfterAmountSum')
  alias('orderAmount', 'pageOrderAmountSum', 'totalOrderAmountSum')
  alias('actualAmount', 'pageActualAmountSum', 'totalActualAmountSum')
  alias('cost', 'pageCostSum', 'totalCostSum')
  alias('totalFee', 'feePageTotal', 'feeTotal')
  alias('usdtBuyMoney', 'usdtBuyPageMoneyTotal', 'usdtBuyMoneyTotal')
  if (url.includes('/matchingOrderAdmin/listpage')) {
    putSum(extend, page, all, 'randomAmount', 'randomAmountPageTotal', 'randomAmountTotal')
  }
  if (url.includes('/biMerchantReconciliation/')) alias('merchantBalance', 'balancePageTotal', 'balanceTotal')
  if (url.includes('/biMemberReconciliation/')) alias('memberBalance', 'balancePageTotal', 'balanceTotal')
  return extend
}

function listBody(url: string, raw: unknown) {
  const query = readQuery(raw)
  const store = ensure(url)
  const filtered = store.rows.filter((row) => matches(row, query))
  const page = pageOf(filtered, query)
  const last = page[page.length - 1]
  const first = page[0]
  const extend = {
    nextColValue: last ? String(last[store.timeKey] ?? last.id ?? '') : '',
    nextCursorId: last ? String(last.id ?? '') : '',
    prevColValue: first ? String(first[store.timeKey] ?? first.id ?? '') : '',
    prevCursorId: first ? String(first.id ?? '') : '',
    ...summaryExtend(url, page, filtered),
  }
  const data = Object.assign(page.slice(), {
    list: page,
    records: page,
    total: filtered.length,
    extend,
  })
  return {
    code: '1',
    msg: '操作成功',
    data,
    total: filtered.length,
    extend,
    success: true,
  }
}

function resourceOf(url: string) {
  return url.split('?')[0].replace(/\/[^/]+$/, '')
}

function writeBody(url: string, raw: unknown) {
  const body = readQuery(raw)
  const resource = resourceOf(url)
  const related = [...stores.entries()].filter(([listUrl]) => resourceOf(listUrl) === resource)
  if (/memberArrearsRecordAdmin\/totalMemberDebt/i.test(url)) {
    const listUrl = listUrls.find((item) => /memberArrearsRecordAdmin\/listPage/i.test(item)) || ''
    const rows = listUrl ? ensure(listUrl).rows : []
    const owedRows = rows.filter((row) => Number(row.amount) > 0)
    return {
      code: '1',
      msg: '操作成功',
      data: {
        totalOwedAmount: Number(sumField(owedRows, 'amount').toFixed(2)),
        positiveOwedUserCount: new Set(owedRows.map((row) => row.memberId)).size,
      },
      success: true,
    }
  }
  if (/getinfo|detail|\/info$/i.test(url)) {
    const row = related[0]?.[1].rows[0] || {}
    return { code: '1', msg: '操作成功', data: { ...row, ...body }, success: true }
  }
  if (/statistic|overview|count|sum/i.test(url)) {
    return {
      code: '1',
      msg: '操作成功',
      data: { completionNum: 12, recipientsNum: 8, rewardAmount: 5600, totalCount: 10, totalAmount: 5600 },
      success: true,
    }
  }
  for (const [, store] of related) {
    const id = body.id ?? body.ids
    if (Array.isArray(id)) {
      store.rows = store.rows.filter((row) => !id.map(String).includes(String(row.id)))
      continue
    }
    const row = store.rows.find((item) => id != null && String(item.id) === String(id))
    if (row) Object.assign(row, body)
    else if (/add|save|create|insert/i.test(url) && body && Object.keys(body).length) {
      store.rows.unshift({ ...(store.rows[0] || {}), ...body, id: 890000 + store.rows.length })
    } else if (/delete|remove/i.test(url) && id != null) {
      store.rows = store.rows.filter((item) => String(item.id) !== String(id))
    }
  }
  return { code: '1', msg: '操作成功', data: true, success: true }
}

function longest(url: string, candidates: string[]) {
  return candidates.find((item) => item && url.includes(item)) || ''
}

export function resolveRemaining(url: string, raw: unknown) {
  const listUrl = longest(url, listUrls)
  if (listUrl) return listBody(listUrl, raw)
  const writeUrl = longest(url, writeUrls)
  if (writeUrl) return writeBody(writeUrl, raw)
  if (/statistic|overview|graphreport|summary/i.test(url)) {
    return {
      code: '1',
      msg: '操作成功',
      data: { completionNum: 12, recipientsNum: 8, rewardAmount: 5600, totalCount: 10, totalAmount: 5600 },
      success: true,
    }
  }
  return null
}
