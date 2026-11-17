// 通道管理：支付通道（USDT）、三方通道（法币）、通道账变。刷新后恢复。

type Row = Record<string, any>

const USDT_CHANNELS = [
  { thirdName: '星河TRC通道', thirdCode: 'USDT_TRC', merchantNo: 'MCH86021' },
  { thirdName: '快付BSC通道', thirdCode: 'USDT_BSC', merchantNo: 'MCH86058' },
  { thirdName: '北境ERC通道', thirdCode: 'USDT_ERC', merchantNo: 'MCH86073' },
  { thirdName: '晨曦TRC收银台', thirdCode: 'USDT_MIX', merchantNo: 'MCH86001' },
]

const FIAT_CHANNELS = [
  { thirdName: '星河UPI代收', thirdCode: 'INR_UPI', merchantCode: 'MCH10021' },
  { thirdName: '快付银行卡', thirdCode: 'INR_BANK', merchantCode: 'MCH10058' },
  { thirdName: '北境Paytm', thirdCode: 'INR_PAYTM', merchantCode: 'MCH10073' },
  { thirdName: '晨曦PhonePe', thirdCode: 'INR_PHONEPE', merchantCode: 'MCH10001' },
]

const CHANGE_TYPES = [
  { type: 1, name: '代收', sign: 1 },
  { type: 2, name: '代收费用', sign: -1 },
  { type: 3, name: '代付', sign: -1 },
  { type: 4, name: '代付费用', sign: -1 },
  { type: 5, name: '手动上分', sign: 1 },
  { type: 6, name: '手动下分', sign: -1 },
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

function indiaDate(offsetDays = 0) {
  return indiaNow(offsetDays * 24 * 60).slice(0, 10)
}

function readBody(raw: unknown): Record<string, any> {
  if (raw == null || raw === '') return {}
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
    } catch {
      const out: Record<string, any> = {}
      new URLSearchParams(raw).forEach((value, key) => {
        out[key] = value
      })
      return out
    }
  }
  if (typeof raw === 'object') return { ...(raw as Record<string, any>) }
  return {}
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function ok() {
  return { code: '1', msg: '操作成功', data: true, success: true }
}

function hasFilter(value: unknown) {
  return value !== undefined && value !== null && value !== ''
}

function dayOf(value: unknown) {
  return String(value || '').slice(0, 10)
}

function inRange(value: string, start: unknown, end: unknown) {
  const text = String(value || '')
  if (hasFilter(start)) {
    const from = String(start)
    const left = from.length > 10 ? text : dayOf(text)
    const right = from.length > 10 ? from : dayOf(from)
    if (left < right) return false
  }
  if (hasFilter(end)) {
    const to = String(end)
    const left = to.length > 10 ? text : dayOf(text)
    const right = to.length > 10 ? to : dayOf(to)
    if (left > right) return false
  }
  return true
}

function seedPay() {
  const channels = USDT_CHANNELS.map((item, index) => ({
    id: 810001 + index,
    thirdName: item.thirdName,
    thirdCode: item.thirdCode,
    merchantNo: item.merchantNo,
    md5Key: `usdt-md5-${item.thirdCode}`,
    publicKey: `usdt-public-${item.thirdCode}`,
    privateKey: `usdt-private-${item.thirdCode}`,
    domainUrl: `https://${item.thirdCode.toLowerCase()}.prototype.test`,
    whiteIps: '10.8.0.21,10.8.0.22',
    payStatus: index === 2 ? '0' : '1',
    paymentStatus: index === 3 ? '0' : '1',
    status: index === 2 ? 0 : 1,
    thirdMerchantBalance: 86000 + index * 12500,
    thirdMerchantBalanceUsdt: 4200 + index * 860,
    thirdMerchantBalanceBepUsdt: 1800 + index * 420,
    updateBy: index % 2 === 0 ? 'prototype' : 'admin1',
    updateTime: indiaNow(-40 * (index + 1)),
  }))
  const configs: Row[] = []
  channels.forEach((channel, index) => {
    ;[1, 2].forEach((channelType) => {
      const base = 200 + index * 80 + channelType * 50
      configs.push({
        id: 811001 + configs.length,
        configId: String(channel.id),
        channelType,
        channelCode: `${channel.thirdCode}_${channelType === 1 ? 'IN' : 'OUT'}`,
        thirdCode: channel.thirdCode,
        weight: channelType === 1 ? 6 : 4,
        minimumAmount: 100 + index * 50,
        maximumAmount: 5000 + index * 2000,
        todayOrderAmount: 18000 + index * 2600 + channelType * 900,
        dailyLimitAmount: 200000 + index * 50000,
        dailyLimitCount: 800 + index * 40,
        allOrderAmount: 1860000 + index * 240000,
        usdtMinimumAmount: 10 + index * 5,
        usdtMaximumAmount: 2000 + index * 500,
        usdtTodayOrderAmount: 860 + index * 120,
        usdtDailyLimitAmount: 20000 + index * 4000,
        usdtDailyLimitCount: 300 + index * 20,
        usdtAllOrderAmount: 1280000 + index * 160000,
        singleOrderCost: base / 100,
        rate: 0.8 + index * 0.2,
        status: 1,
        networkProtocol: index % 2 === 0 ? 'TRC20' : 'BEP20',
        updateBy: 'prototype',
        updateTime: indiaNow(-20 * (index + channelType)),
      })
    })
  })
  return { channels, configs }
}

function seedFiat() {
  return FIAT_CHANNELS.map((item, index) => {
    const collection = (method: number, order: number) => ({
      id: 821001 + index * 10 + order,
      channelType: 1,
      channelCode: `${item.thirdCode}_IN${order}`,
      thirdCode: item.thirdCode,
      weight: order === 1 ? 6 : 4,
      singleAmountMin: 100 + order * 50,
      singleAmountMax: 20000 + index * 5000,
      todayTradeAmount: 26000 + index * 3200 + order * 800,
      dailyAmountLimit: 300000 + index * 40000,
      todayTradeCount: 120 + index * 15,
      dailyCountLimit: 1000 + index * 50,
      totalTradeAmount: 2460000 + index * 180000,
      fixedCost: 3 + order,
      singleRate: 1.2 + index * 0.1,
      dndFlag: 1,
      currencyType: method === 3 ? 2 : 1,
      receiveMethod: method,
      cashPageExpireTime: 15,
      updateBy: 'prototype',
      updateTime: indiaNow(-25 * (index + order)),
    })
    const payout = {
      id: 821051 + index,
      channelType: 2,
      channelCode: `${item.thirdCode}_OUT`,
      thirdCode: item.thirdCode,
      weight: 5,
      singleAmountMin: 200,
      singleAmountMax: 50000 + index * 10000,
      todayTradeAmount: 18400 + index * 2100,
      dailyAmountLimit: 250000 + index * 30000,
      todayTradeCount: 46 + index * 8,
      dailyCountLimit: 600,
      totalTradeAmount: 1680000 + index * 140000,
      fixedCost: 5,
      singleRate: 1.5,
      dndFlag: 1,
      currencyType: 1,
      receiveMethod: index % 2 === 0 ? 1 : 2,
      cashPageExpireTime: 15,
      updateBy: 'admin1',
      updateTime: indiaNow(-30 * (index + 1)),
    }
    return {
      id: 820001 + index,
      thirdName: item.thirdName,
      thirdCode: item.thirdCode,
      merchantCode: item.merchantCode,
      md5Key: `inr-md5-${item.thirdCode}`,
      publicKey: `inr-public-${item.thirdCode}`,
      privateKey: `inr-private-${item.thirdCode}`,
      apiDomain: `https://${item.thirdCode.toLowerCase()}.prototype.test`,
      whiteIps: '10.9.0.11,10.9.0.12',
      collectionStatus: index === 2 ? '0' : '1',
      paymentStatus: index === 3 ? '0' : '1',
      dndFlag: index === 2 ? 0 : 1,
      innerInrBalance: 156000 + index * 28000,
      inrBalance: 149000 + index * 26000,
      innerUsdtBalance: 320 + index * 80,
      usdtBalance: 300 + index * 70,
      channelInfoList: [collection(1, 1), collection(2, 2), payout],
      updateBy: index % 2 === 0 ? 'prototype' : 'admin1',
      updateTime: indiaNow(-35 * (index + 1)),
    }
  })
}

function seedChanges(): Row[] {
  const channels = [...USDT_CHANNELS, ...FIAT_CHANNELS]
  return CHANGE_TYPES.map((item, index) => {
    const channel = channels[index % channels.length]
    const beforeChange = 80000 + index * 6500
    const changeAmount = item.sign * (360 + index * 140)
    return {
      id: 830001 + index,
      thirdOrderNo: `TC${indiaDate().replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
      platformOrderNo: `PC${indiaDate().replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
      changeTime: indiaNow(-18 * (index + 1)),
      thirdCode: channel.thirdCode,
      changeType: item.type,
      receiveType: (index % 3) + 1,
      currencyType: index % 2 === 0 ? 2 : 1,
      beforeChange,
      changeAmount,
      afterChange: beforeChange + changeAmount,
      remark: `${item.name}账变`,
      operateBy: index % 2 === 0 ? 'prototype' : 'admin1',
    }
  })
}

const paySeed = seedPay()
let payChannels = paySeed.channels
let payConfigs = paySeed.configs
let fiatChannels = seedFiat()
let changes = seedChanges()

function payView(channel: Row) {
  const mine = payConfigs.filter((item) => String(item.configId) === String(channel.id))
  return {
    ...clone(channel),
    payTypeInfo: mine.filter((item) => Number(item.channelType) === 1).map((item) => clone(item)),
    paymentTypeInfo: mine.filter((item) => Number(item.channelType) === 2).map((item) => clone(item)),
  }
}

function findPay(body: Row) {
  return payChannels.find((item) => (body.id != null && String(item.id) === String(body.id)) || (body.thirdCode && item.thirdCode === body.thirdCode))
}

function findFiat(body: Row) {
  return fiatChannels.find((item) => (body.id != null && String(item.id) === String(body.id)) || (body.thirdCode && item.thirdCode === body.thirdCode))
}

function patchRow(row: Row, body: Row) {
  const next = { ...body }
  delete next.payTypeInfo
  delete next.paymentTypeInfo
  delete next.channelInfoList
  Object.assign(row, next)
  row.updateBy = 'prototype'
  row.updateTime = indiaNow()
}

function pageRows(rows: Row[], raw: unknown) {
  const query = readBody(raw)
  const pageNo = Number(query.pageNo || query.current) || 1
  const pageSize = Number(query.pageSize || query.size) || 20
  const start = (pageNo - 1) * pageSize
  return { query, page: rows.slice(start, start + pageSize), total: rows.length }
}

function matchText(row: Row, query: Row, fields: string[]) {
  return fields.every((field) => !hasFilter(query[field]) || String(row[field] ?? '').includes(String(query[field])))
}

function payReport(thirdCode: string) {
  const channel = payChannels.find((item) => item.thirdCode === thirdCode) || payChannels[0]
  const view = payView(channel)
  const collection = view.payTypeInfo[0] || {}
  const payment = view.paymentTypeInfo[0] || {}
  const list = [0, 1, 2, 3, 4, 5, 6, 7].map((offset) => ({
    reportDate: indiaDate(-offset),
    thirdCode: channel.thirdCode,
    collectionMoney: Math.round((collection.todayOrderAmount || 10000) * (1 - offset * 0.08)),
    collectionCount: 40 + offset * 6,
    paymentMoney: Math.round((payment.todayOrderAmount || 8000) * (1 - offset * 0.07)),
    paymentCount: 18 + offset * 3,
  }))
  const sum = (field: string) => list.reduce((total, row) => total + Number(row[field] || 0), 0)
  return {
    channelDayDetailReportDTOList: list,
    channelDaySummaryDTO: {
      totalCollectionMoney: sum('collectionMoney'),
      totalCollectionCount: sum('collectionCount'),
      totalPaymentMoney: sum('paymentMoney'),
      totalPaymentCount: sum('paymentCount'),
    },
  }
}

function fiatStats(query: Row) {
  const rows: Row[] = []
  fiatChannels.forEach((channel) => {
    if (hasFilter(query.thirdCode) && channel.thirdCode !== query.thirdCode) return
    const methods = [1, 2, 3]
    methods.forEach((method, index) => {
      ;[0, 1, 2].forEach((offset) => {
        const amount = method === 3 ? 420 + index * 30 : 18000 + index * 2400 - offset * 1600
        rows.push({
          thirdCode: channel.thirdCode,
          statDate: indiaDate(-offset),
          receiveMethod: method,
          totalActualAmount: amount,
          totalOrderCount: method === 3 ? 6 + index : 36 + index * 4,
          totalFee: Math.round(amount * 0.012),
        })
      })
    })
  })
  return rows.filter((row) => {
    if (hasFilter(query.receiveMethod) && String(row.receiveMethod) !== String(query.receiveMethod)) return false
    return inRange(row.statDate, query.createTimeGe, query.createTimeLe)
  })
}

function statExtend(rows: Row[]) {
  const blank = () => ({ totalAmountSum: 0, totalCountSum: 0, totalFeeSum: 0 })
  const extend = { INDIAUPI: blank(), INDIABANK: blank(), USDT: blank(), TOTAL: blank() }
  const bucket: Record<number, keyof typeof extend> = { 1: 'INDIAUPI', 2: 'INDIABANK', 3: 'USDT' }
  rows.forEach((row) => {
    const key = bucket[Number(row.receiveMethod)]
    if (!key) return
    extend[key].totalAmountSum += Number(row.totalActualAmount) || 0
    extend[key].totalCountSum += Number(row.totalOrderCount) || 0
    extend[key].totalFeeSum += Number(row.totalFee) || 0
  })
  ;(['INDIAUPI', 'INDIABANK', 'USDT'] as const).forEach((key) => {
    extend.TOTAL.totalAmountSum += extend[key].totalAmountSum
    extend.TOTAL.totalCountSum += extend[key].totalCountSum
    extend.TOTAL.totalFeeSum += extend[key].totalFeeSum
  })
  return extend
}

export function resolveChannelMenu(url: string, raw: unknown) {
  const body = readBody(raw)
  if (url.includes('/payConfigAdmin/listConfigPage')) {
    let rows = payChannels.filter((row) => matchText(row, body, ['thirdName', 'thirdCode']))
    if (hasFilter(body.payStatus)) rows = rows.filter((row) => String(row.payStatus) === String(body.payStatus))
    if (hasFilter(body.paymentStatus)) rows = rows.filter((row) => String(row.paymentStatus) === String(body.paymentStatus))
    if (hasFilter(body.status)) rows = rows.filter((row) => String(row.status) === String(body.status))
    const { page, total } = pageRows(rows, raw)
    return { code: '1', msg: '操作成功', data: page.map(payView), total, success: true }
  }
  if (url.includes('/payConfigAdmin/add')) {
    const id = 810100 + payChannels.length
    payChannels.unshift({ id, payStatus: '1', paymentStatus: '1', status: 1, thirdMerchantBalance: 0, thirdMerchantBalanceUsdt: 0, thirdMerchantBalanceBepUsdt: 0, updateBy: 'prototype', updateTime: indiaNow(), ...body })
    return ok()
  }
  if (url.includes('/payConfigAdmin/update')) {
    const row = findPay(body)
    if (row) patchRow(row, body)
    return ok()
  }
  if (url.includes('/paytypeinfo/list')) {
    let rows = payConfigs.filter((row) => String(row.configId) === String(body.configId ?? row.configId))
    if (hasFilter(body.channelType)) rows = rows.filter((row) => String(row.channelType) === String(body.channelType))
    const { page, total } = pageRows(rows, raw)
    return { code: '1', msg: '操作成功', data: page.map((row) => clone(row)), total, success: true }
  }
  if (url.includes('/paytypeinfo/save')) {
    payConfigs.unshift({
      ...body,
      id: 811100 + payConfigs.length,
      configId: String(body.configId),
      status: body.status != null ? Number(body.status) : 1,
      updateBy: 'prototype',
      updateTime: indiaNow(),
    })
    return ok()
  }
  if (url.includes('/paytypeinfo/update')) {
    const row = payConfigs.find((item) => String(item.id) === String(body.id))
    if (row) {
      Object.assign(row, body, { status: body.status != null ? Number(body.status) : row.status, updateBy: 'prototype', updateTime: indiaNow() })
    }
    return ok()
  }
  if (url.includes('/buySellReport/channelReportByDate')) {
    const report = payReport(body.thirdCode)
    const list = report.channelDayDetailReportDTOList.filter((row) => inRange(row.reportDate, body.startDate, body.endDate))
    const sum = (field: string) => list.reduce((total, row) => total + Number(row[field] || 0), 0)
    return {
      code: '1',
      msg: '操作成功',
      data: {
        channelDayDetailReportDTOList: list,
        channelDaySummaryDTO: {
          totalCollectionMoney: sum('collectionMoney'),
          totalCollectionCount: sum('collectionCount'),
          totalPaymentMoney: sum('paymentMoney'),
          totalPaymentCount: sum('paymentCount'),
        },
      },
      success: true,
    }
  }
  if (url.includes('/thirdPayInfoAdmin/statisticalInfo')) {
    const rows = fiatStats(body)
    const { page, total } = pageRows(rows, raw)
    const list = Object.assign(page.map((row) => clone(row)), { total })
    return { code: '1', msg: '操作成功', data: { list, total, extend: statExtend(rows) }, success: true }
  }
  if (url.includes('/thirdPayInfoAdmin/listPage')) {
    let rows = fiatChannels.filter((row) => matchText(row, body, ['thirdName', 'thirdCode']))
    if (hasFilter(body.collectionStatus)) rows = rows.filter((row) => String(row.collectionStatus) === String(body.collectionStatus))
    if (hasFilter(body.paymentStatus)) rows = rows.filter((row) => String(row.paymentStatus) === String(body.paymentStatus))
    if (hasFilter(body.dndFlag)) rows = rows.filter((row) => String(row.dndFlag) === String(body.dndFlag))
    const { page, total } = pageRows(rows, raw)
    const list = Object.assign(page.map((row) => clone(row)), { total })
    return { code: '1', msg: '操作成功', data: { list, total }, success: true }
  }
  if (url.includes('/thirdPayInfoAdmin/thirdCodeList')) {
    return { code: '1', msg: '操作成功', data: fiatChannels.map((row) => ({ thirdCode: row.thirdCode, thirdName: row.thirdName })), success: true }
  }
  if (url.includes('/thirdPayInfoAdmin/add')) {
    fiatChannels.unshift({
      id: 820100 + fiatChannels.length,
      collectionStatus: '1',
      paymentStatus: '1',
      dndFlag: 1,
      innerInrBalance: 0,
      inrBalance: 0,
      innerUsdtBalance: 0,
      usdtBalance: 0,
      channelInfoList: [],
      updateBy: 'prototype',
      updateTime: indiaNow(),
      ...body,
    })
    return ok()
  }
  if (url.includes('/thirdPayInfoAdmin/update')) {
    const row = findFiat(body)
    if (row) patchRow(row, body)
    return ok()
  }
  if (url.includes('/thirdPayInfoAdmin/adjustThirdPartyBalance')) {
    const row = findFiat(body)
    if (row) {
      const amount = Number(body.amount) || 0
      const sign = String(body.adjustType) === '2' ? -1 : 1
      if (String(body.currencyType) === '2') row.innerUsdtBalance = Number(row.innerUsdtBalance) + sign * amount
      else row.innerInrBalance = Number(row.innerInrBalance) + sign * amount
      const beforeChange = String(body.currencyType) === '2' ? Number(row.innerUsdtBalance) - sign * amount : Number(row.innerInrBalance) - sign * amount
      changes.unshift({
        id: 830100 + changes.length,
        thirdOrderNo: `TC${indiaDate().replace(/-/g, '')}ADJ`,
        platformOrderNo: `PC${indiaDate().replace(/-/g, '')}ADJ`,
        changeTime: indiaNow(),
        thirdCode: row.thirdCode,
        changeType: sign > 0 ? 5 : 6,
        receiveType: String(body.currencyType) === '2' ? 3 : 1,
        currencyType: Number(body.currencyType) || 1,
        beforeChange,
        changeAmount: sign * amount,
        afterChange: beforeChange + sign * amount,
        remark: body.remark || (sign > 0 ? '手动上分' : '手动下分'),
        operateBy: 'prototype',
      })
    }
    return ok()
  }
  if (url.includes('/thirdPayChannelConfigAdmin/add')) {
    const row = findFiat(body)
    if (row) {
      row.channelInfoList.unshift({
        id: 821200 + row.channelInfoList.length,
        dndFlag: 1,
        updateBy: 'prototype',
        updateTime: indiaNow(),
        ...body,
      })
    }
    return ok()
  }
  if (url.includes('/thirdPayChannelConfigAdmin/update')) {
    fiatChannels.forEach((channel) => {
      const item = channel.channelInfoList.find((row: Row) => String(row.id) === String(body.id))
      if (item) Object.assign(item, body, { updateBy: 'prototype', updateTime: indiaNow() })
    })
    return ok()
  }
  if (url.includes('/channelAccountChangeAdmin/listPage') && !url.includes('Export')) {
    let rows = changes.filter((row) => matchText(row, body, ['thirdCode', 'thirdOrderNo', 'platformOrderNo', 'remark']))
    if (hasFilter(body.changeType)) rows = rows.filter((row) => String(row.changeType) === String(body.changeType))
    rows = rows.filter((row) => inRange(row.changeTime, body.changeTimeGe, body.changeTimeLe))
    const { page, total } = pageRows(rows, raw)
    const sum = (list: Row[], field: string) => list.reduce((totalAmount, row) => totalAmount + (Number(row[field]) || 0), 0)
    return {
      code: '1',
      msg: '操作成功',
      data: {
        list: page.map((row) => clone(row)),
        total,
        extend: {
          beforeAmountSum: sum(page, 'beforeChange'),
          changeAmountSum: sum(page, 'changeAmount'),
          totalBeforeAmountSum: sum(rows, 'beforeChange'),
          totalChangeAmountSum: sum(rows, 'changeAmount'),
        },
      },
      success: true,
    }
  }
  return null
}
