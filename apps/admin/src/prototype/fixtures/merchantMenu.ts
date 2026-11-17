// 商户管理：下发申请/记录、账变、代收、代付。刷新后恢复初始数据。

type Row = Record<string, any>

const MERCHANTS = [
  { name: '星河商城', code: 'M10021', type: 1 },
  { name: '快付钱包', code: 'M10058', type: 2 },
  { name: '北境博彩', code: 'M10073', type: 2 },
  { name: '内部测试商户', code: 'M10001', type: 1 },
  { name: '晨曦支付', code: 'M20001', type: 2 },
]

const CHANGE_TYPES = [
  { type: 1, name: '代收' },
  { type: 2, name: '代付' },
  { type: 3, name: '下发' },
  { type: 4, name: '上分' },
  { type: 5, name: '代收费用' },
  { type: 6, name: '代付费用' },
  { type: 7, name: '下发回退' },
  { type: 8, name: '下分' },
  { type: 17, name: '余额退回' },
  { type: 18, name: '补单上分' },
  { type: 19, name: '补单代收费用' },
  { type: 20, name: '代付退回' },
  { type: 21, name: '代付费用退回' },
  { type: 22, name: '快捷提现代付' },
  { type: 23, name: '快捷提现代付费用' },
  { type: 24, name: '代收AR_UPI' },
  { type: 25, name: 'AR_UPI代收费用' },
  { type: 26, name: '优惠金额' },
  { type: 27, name: '单笔代收手续费' },
  { type: 28, name: '单笔代付手续费' },
]

function indiaNow(offsetMinutes = 0) {
  const base = new Date(Date.now() + offsetMinutes * 60 * 1000)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(base)
  const pick = (type: string) => parts.find((item) => item.type === type)?.value || '00'
  return `${pick('year')}-${pick('month')}-${pick('day')} ${pick('hour')}:${pick('minute')}:${pick('second')}`
}

function indiaDay() {
  return indiaNow().slice(0, 10)
}

function readBody(raw: unknown): Record<string, any> {
  if (raw == null || raw === '') return {}
  if (Array.isArray(raw)) return { ids: raw }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? { ids: parsed } : parsed
    } catch {
      const out: Record<string, any> = {}
      new URLSearchParams(raw).forEach((value, key) => {
        out[key] = value
      })
      return out
    }
  }
  if (typeof URLSearchParams !== 'undefined' && raw instanceof URLSearchParams) {
    const out: Record<string, any> = {}
    raw.forEach((value, key) => {
      out[key] = value
    })
    return out
  }
  return raw as Record<string, any>
}

function hasFilter(value: unknown) {
  return value !== undefined && value !== null && value !== ''
}

function inTime(value: string, start: unknown, end: unknown) {
  const text = String(value || '')
  if (hasFilter(start) && text < String(start)) return false
  if (hasFilter(end) && text > String(end)) return false
  return true
}

function pageOf(rows: Row[], raw: unknown, sumFields: string[] = []) {
  const query = readBody(raw)
  const pageNo = Number(query.pageNo || query.current) || 1
  const pageSize = Number(query.pageSize || query.size) || 20
  const start = (pageNo - 1) * pageSize
  const page = rows.slice(start, start + pageSize).map((row) => ({ ...row }))
  const extend: Record<string, number> = {}
  for (const field of sumFields) {
    const sum = (list: Row[]) => list.reduce((total, row) => total + (Number(row[field]) || 0), 0)
    extend[`${field}PageTotal`] = sum(page)
    extend[`${field}Total`] = sum(rows)
  }
  const data = Object.assign(page, { list: page, records: page, total: rows.length })
  return {
    code: '1',
    msg: '操作成功',
    data,
    total: rows.length,
    extend,
    success: true,
  }
}

function seedApplications(): Row[] {
  return [0, 1, 2, 3, 4, 5].map((index) => {
    const merchant = MERCHANTS[index % MERCHANTS.length]
    const amount = 500 + index * 250
    return {
      id: 710001 + index,
      orderNo: `DS${indiaDay().replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
      merchantCode: merchant.code,
      username: merchant.name,
      usdtAddr: `TPrototypeUsdt${String(index + 1).padStart(4, '0')}xxxxxxxxxxxx`,
      balance: 80000 + index * 5000,
      amount,
      createTime: indiaNow(-30 * (index + 1)),
    }
  })
}

function seedRecords(): Row[] {
  return [0, 1, 2, 3, 4].map((index) => {
    const merchant = MERCHANTS[index % MERCHANTS.length]
    const status = String(index % 3) as '0' | '1' | '2'
    return {
      id: 720001 + index,
      orderNo: `DR${indiaDay().replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
      merchantCode: merchant.code,
      username: merchant.name,
      usdtAddr: `TPrototypeUsdtRec${String(index + 1).padStart(4, '0')}xxxxxxxx`,
      balance: 60000 + index * 4000,
      amount: 800 + index * 300,
      status,
      createTime: indiaNow(-90 * (index + 1)),
      updateTime: indiaNow(-20 * (index + 1)),
      updateBy: index % 2 === 0 ? 'prototype' : 'admin1',
      remark: status === '2' ? '商户额度不足，拒绝下发' : status === '1' ? '已下发到账' : '待处理',
    }
  })
}

function seedChanges(): Row[] {
  return CHANGE_TYPES.map((item, index) => {
    const merchant = MERCHANTS[index % MERCHANTS.length]
    const beforeChange = 20000 + index * 1800
    const amountChange = (index % 2 === 0 ? 1 : -1) * (360 + index * 75)
    const commission = 15 + index * 4
    return {
      id: 730001 + index,
      orderNo: `MC${indiaDay().replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
      merchantOrder: `PM${indiaDay().replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
      createTime: indiaNow(-15 * (index + 1)),
      merchantCode: merchant.code,
      merchantType: merchant.type,
      merchantName: merchant.name,
      changeType: item.type,
      accountSourceType: index % 2 === 0 ? 1 : 2,
      beforeChange,
      amountChange,
      afterChange: beforeChange + amountChange,
      commission,
      remark: `${item.name}账变`,
      updateBy: index % 2 === 0 ? 'prototype' : 'admin1',
    }
  })
}

function seedCollection(): Row[] {
  const statuses = ['2', '1', '3', '4', '5', '2']
  const callbacks = ['1', '2', '3', '5', '1', '4']
  return statuses.map((orderStatus, index) => {
    const merchant = MERCHANTS[index % MERCHANTS.length]
    const orderAmount = 1000 + index * 350
    return {
      id: 740001 + index,
      createTime: indiaNow(-25 * (index + 1)),
      merchantName: merchant.name,
      merchantCode: merchant.code,
      memberId: 10086001 + index,
      platformOrder: `RC${indiaDay().replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
      thirdRechargeFlag: index % 2,
      quadOrderChannel: index % 2 === 0 ? 'PhonePe' : 'Paytm',
      externalMemberId: `EM${10001 + index}`,
      merchantOrder: `MO${indiaDay().replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
      buyOrderNo: `BO${10001 + index}`,
      orderAmount,
      amount: orderAmount - 20,
      cost: 18 + index * 3,
      randomAmount: index % 2 === 0 ? 5 : 0,
      completionTime: orderStatus === '1' ? '' : indiaNow(-10 * (index + 1)),
      tradeCallbackTime: indiaNow(-8 * (index + 1)),
      orderStatus,
      complainedFlag: index % 3 === 0 ? 1 : 0,
      tradeCallbackStatus: callbacks[index],
    }
  })
}

function seedWithdraw(): Row[] {
  const statuses = ['2', '1', '3', '4', '2', '3']
  const callbacks = ['1', '2', '3', '5', '4', '1']
  return statuses.map((orderStatus, index) => {
    const merchant = MERCHANTS[index % MERCHANTS.length]
    const amount = 1500 + index * 420
    return {
      id: 750001 + index,
      createTime: indiaNow(-22 * (index + 1)),
      merchantName: merchant.name,
      merchantCode: merchant.code,
      merchantType: merchant.type,
      memberId: 10086001 + index,
      platformOrder: `WD${indiaDay().replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
      externalMemberId: `EM${20001 + index}`,
      merchantOrder: `WO${indiaDay().replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
      matchPoolOrderNo: `MP${860001 + index}`,
      sourceOrderType: index % 6,
      payType: (index % 4) + 1,
      amount,
      cost: 20 + index * 4,
      completionTime: orderStatus === '1' ? '' : indiaNow(-6 * (index + 1)),
      tradeCallbackTime: indiaNow(-4 * (index + 1)),
      orderStatus,
      tradeCallbackStatus: callbacks[index],
    }
  })
}

let applications = seedApplications()
let records = seedRecords()
let changes = seedChanges()
let collections = seedCollection()
let withdraws = seedWithdraw()

function ok() {
  return { code: '1', msg: '操作成功', data: true, success: true }
}

function moveApplication(id: unknown, status: '1' | '2') {
  const index = applications.findIndex((row) => String(row.id) === String(id))
  if (index < 0) return
  const row = applications.splice(index, 1)[0]
  records.unshift({
    ...row,
    id: 720100 + records.length,
    status,
    updateTime: indiaNow(),
    updateBy: 'prototype',
    remark: status === '1' ? '已同意下发' : '已拒绝下发',
  })
}

function markOrders(rows: Row[], ids: unknown[], status: string, callback: string) {
  const keys = ids.map((item) => String(item).replace(/^"|"$/g, ''))
  rows.forEach((row) => {
    if (keys.includes(String(row.id))) {
      row.orderStatus = status
      row.tradeCallbackStatus = callback
      row.completionTime = indiaNow()
      row.tradeCallbackTime = indiaNow()
    }
  })
}

function filterText(rows: Row[], query: Record<string, any>, fields: string[]) {
  return rows.filter((row) => {
    for (const field of fields) {
      if (!hasFilter(query[field])) continue
      if (!String(row[field] ?? '').includes(String(query[field]))) return false
    }
    if (hasFilter(query.changeType) && String(row.changeType) !== String(query.changeType)) return false
    if (hasFilter(query.accountSourceType) && String(row.accountSourceType) !== String(query.accountSourceType)) return false
    if (hasFilter(query.orderStatus) && String(row.orderStatus) !== String(query.orderStatus)) return false
    if (hasFilter(query.merchantType) && String(row.merchantType) !== String(query.merchantType)) return false
    if (hasFilter(query.callbackStatus) && String(row.tradeCallbackStatus) !== String(query.callbackStatus)) return false
    if (hasFilter(query.sourceOrderType) && String(row.sourceOrderType) !== String(query.sourceOrderType)) return false
    if (!inTime(row.createTime, query.startTime, query.endTime)) return false
    return true
  })
}

export function resolveMerchantMenu(url: string, raw: unknown) {
  if (url.includes('/applyDistributedAdmin/listpage')) {
    const query = readBody(raw)
    return pageOf(filterText(applications, query, ['username', 'orderNo', 'merchantCode']), raw, ['balance', 'amount'])
  }
  if (url.includes('/applyDistributedAdmin/distribute')) {
    moveApplication(readBody(raw).id, '1')
    return ok()
  }
  if (url.includes('/applyDistributedAdmin/nodistribute')) {
    moveApplication(readBody(raw).id, '2')
    return ok()
  }
  if (url.includes('/applyDistributedAdmin/listRecordPage')) {
    const query = readBody(raw)
    return pageOf(filterText(records, query, ['username', 'orderNo', 'merchantCode']), raw, ['balance', 'amount'])
  }
  if (url.includes('/accountChangeAdmin/query')) {
    const query = readBody(raw)
    return pageOf(
      filterText(changes, query, ['merchantName', 'orderNo', 'merchantOrder', 'remark', 'merchantCode']),
      raw,
      ['beforeChange', 'amountChange', 'afterChange', 'commission'],
    )
  }
  if (url.includes('/merchantInfoAdmin/fetchCollectionOrderInfo')) {
    const query = readBody(raw)
    return pageOf(
      filterText(collections, query, ['merchantName', 'merchantCode', 'platformOrder', 'merchantOrder', 'memberId', 'externalMemberId']),
      raw,
      ['orderAmount', 'amount', 'cost', 'randomAmount'],
    )
  }
  if (url.includes('/merchantInfoAdmin/fetchWithdrawOrder') && !url.includes('Export')) {
    const query = readBody(raw)
    return pageOf(
      filterText(withdraws, query, ['merchantName', 'merchantCode', 'platformOrder', 'merchantOrder', 'memberId', 'externalMemberId', 'matchPoolOrderNo']),
      raw,
      ['amount', 'cost'],
    )
  }
  if (url.includes('/merchantInfoAdmin/rechargeConfirmSuccess')) {
    markOrders(collections, [readBody(raw).id], '2', '4')
    return ok()
  }
  if (url.includes('/merchantInfoAdmin/confirmSuccess')) {
    markOrders(withdraws, [readBody(raw).id], '2', '4')
    return ok()
  }
  if (url.includes('/merchantInfoAdmin/rechargeBatchConfirmSuccess')) {
    const body = readBody(raw)
    markOrders(collections, body.ids || body, '2', '4')
    return ok()
  }
  if (url.includes('/merchantInfoAdmin/batchConfirmSuccess')) {
    const body = readBody(raw)
    markOrders(withdraws, body.ids || body, '2', '4')
    return ok()
  }
  return null
}
