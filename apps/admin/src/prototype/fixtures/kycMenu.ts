// KYC 管理栏目假数据。银行编码用 appUpiBanks.ts 的 10 个印度 UPI 应用。
// IFSC 配置是银行卡分行编码，单独用印度传统银行，不替换那 10 个应用。
// 字段说明见 notes/field-notes.md §23～§47，状态为供校正。

import { APP_UPI_BANKS, appBankIcon } from './appUpiBanks'
import { listMembers } from './memberList'

const success = { code: '1', msg: '操作成功', data: null, success: true }

type Row = Record<string, any>

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
  return value !== undefined && value !== null && value !== ''
}

function includesText(source: unknown, keyword: unknown) {
  if (!hasFilter(keyword)) return true
  return String(source ?? '').toLowerCase().includes(String(keyword).trim().toLowerCase())
}

function sameValue(source: unknown, keyword: unknown) {
  if (!hasFilter(keyword)) return true
  return String(source) === String(keyword)
}

function inRange(value: string, start: unknown, end: unknown) {
  const text = String(value ?? '')
  const left = hasFilter(start) ? String(start) : ''
  const right = hasFilter(end) ? String(end) : ''
  const dateOnly = (item: string) => item.length === 10 && !item.includes(' ')
  const probe = dateOnly(left) || dateOnly(right) ? text.slice(0, 10) : text
  if (left && probe < left) return false
  if (right && probe > right) return false
  return true
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

function stamp(hour: number, minute: number, second = 0, offsetDays = 0) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${indiaDay(offsetDays)} ${pad(hour)}:${pad(minute)}:${pad(second)}`
}

function slicePage<T>(list: T[], query: Record<string, any>) {
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const start = (pageNo - 1) * pageSize
  return list.slice(start, start + pageSize)
}

function cursorExtend(page: Row[], timeKey: string) {
  const last = page[page.length - 1]
  const first = page[0]
  return {
    nextColValue: last ? String(last[timeKey] ?? '') : '',
    nextCursorId: last ? String(last.id ?? '') : '',
    prevColValue: first ? String(first[timeKey] ?? '') : '',
    prevCursorId: first ? String(first.id ?? '') : '',
  }
}

function listBody(page: Row[], total: number, timeKey: string, extraExtend: Record<string, unknown> = {}) {
  return {
    code: '1',
    msg: '操作成功',
    data: page,
    total,
    extend: { ...cursorExtend(page, timeKey), ...extraExtend },
    success: true,
  }
}

function nestedBody(page: Row[], total: number) {
  return {
    code: '1',
    msg: '操作成功',
    data: { list: page, total },
    total,
    success: true,
  }
}

type Spec = {
  timeField?: string
  startKey?: string
  endKey?: string
  equals?: string[]
  includes?: string[]
}

function select(rows: Row[], query: Record<string, any>, spec: Spec) {
  return rows.filter((row) => {
    for (const key of spec.equals || []) {
      if (!sameValue(row[key], query[key])) return false
    }
    for (const key of spec.includes || []) {
      if (!includesText(row[key], query[key])) return false
    }
    if (spec.timeField) {
      if (!inRange(String(row[spec.timeField] ?? ''), query[spec.startKey || 'startTime'], query[spec.endKey || 'endTime'])) {
        return false
      }
    }
    return true
  })
}

function sortRows(rows: Row[], query: Record<string, any>, fallback: string) {
  const column = String(query.column || fallback)
  const asc = query.asc === true || query.asc === 'true' || query.asc === 1
  return rows.slice().sort((a, b) => {
    const left = a[column]
    const right = b[column]
    if (left === right) return 0
    const order = left > right ? 1 : -1
    return asc ? order : -order
  })
}

function respond(
  rows: Row[],
  raw: unknown,
  spec: Spec,
  extraExtend: Record<string, unknown> | ((page: Row[], all: Row[]) => Record<string, unknown>) = {},
) {
  const query = readQuery(raw)
  const filtered = sortRows(select(rows, query, spec), query, spec.timeField || 'id')
  const page = slicePage(filtered, query)
  const extra = typeof extraExtend === 'function' ? extraExtend(page, filtered) : extraExtend
  return listBody(page, filtered.length, spec.timeField || 'createTime', extra)
}

function respondNested(rows: Row[], raw: unknown, spec: Spec) {
  const query = readQuery(raw)
  const filtered = sortRows(select(rows, query, spec), query, spec.timeField || 'id')
  const page = slicePage(filtered, query)
  return nestedBody(page, filtered.length)
}

const NAMES = ['Rahul Sharma', 'Priya Nair', 'Amit Patel', 'Neha Singh', 'Vikram Iyer', 'Ananya Das', 'Rohit Mehta', 'Kavya Reddy', 'Sanjay Gupta', 'Meera Joshi']

function people() {
  return listMembers().slice(0, 10).map((member, index) => ({
    memberId: member.id,
    phone: member.mobileNumber,
    name: member.realName || NAMES[index],
  }))
}

function bankAt(index: number) {
  return APP_UPI_BANKS[index % APP_UPI_BANKS.length]
}

function upiOf(index: number) {
  const person = people()[index % 10]
  return `${person.phone}${bankAt(index).upiSuffix}`
}

function utrOf(index: number) {
  return String(410000000000 + index * 17)
}

function amountOf(index: number) {
  return 100 + (index % 10) * 250
}

function orderBox(index: number, prefix: string) {
  return {
    buyOrderNo: `${prefix}B${86000 + index}`,
    buyOrderType: (index % 7) + 1,
    chOrderNo: `${prefix}C${86000 + index}`,
    orderFrom: index % 6,
    sellOrderNo: `${prefix}S${86000 + index}`,
  }
}

let partners: Row[] | null = null
let orders: Row[] | null = null
let sellWait: Row[] | null = null
let buyWait: Row[] | null = null
let quickWait: Row[] | null = null
let tokens: Row[] | null = null
let buyAppeal: Row[] | null = null
let buyAppealFailed: Row[] | null = null
let sellAppealWait: Row[] | null = null
let sellFailed: Row[] | null = null
let sellRecords: Row[] | null = null
let utrDup: Row[] | null = null
let tidDup: Row[] | null = null
let abnormal: Row[] | null = null
let wakeups: Row[] | null = null
let quickBuy: Row[] | null = null
let quickBuyWait: Row[] | null = null
let quickBuyFailed: Row[] | null = null
let smsLogs: Row[] | null = null
let smsSuccess: Row[] | null = null
let trading: Row[] | null = null
let flowAbn: Row[] | null = null
let reversals: Row[] | null = null
let channels: Row[] | null = null
let channelFail: Row[] | null = null
let channelPending: Row[] | null = null
let channelSuccess: Row[] | null = null
let multiOrders: Row[] | null = null
let successUpi: Row[] | null = null
let successLogs: Row[] | null = null
let autoBuy: Row[] | null = null
let autoSell: Row[] | null = null
let autoPending: Row[] | null = null
let failParties: Row[] | null = null
let unfinished: Row[] | null = null
let ifscRows: Row[] | null = null
let upiOrders: Row[] | null = null
let nextChannelId = 5
let nextIfscId = 11

function seedPartners() {
  if (partners) return partners
  partners = people().map((person, index) => {
    const bank = bankAt(index)
    return {
      id: 86001 + index,
      memberId: person.memberId,
      account: person.phone,
      upiId: upiOf(index),
      bankCode: bank.bankCode,
      bankName: bank.bankName,
      iconUrl: appBankIcon(bank),
      linkStatus: index % 2,
      sellStatus: index % 2,
      deleted: index % 5 === 0 ? 1 : 0,
      createTime: stamp(8, index, 0, 0),
      lastRefreshTime: stamp(18, index, 0, 0),
      lastLinkTime: stamp(9, index, 10, 0),
      lastCheckLinkTime: stamp(9, index, 40, 0),
      version: index % 2 === 0 ? 1 : 2,
    }
  })
  return partners
}

function seedOrders() {
  if (orders) return orders
  orders = people().map((person, index) => {
    const seller = people()[(index + 3) % 10]
    return {
      id: 87001 + index,
      bankCode: bankAt(index).bankCode,
      utr: utrOf(index),
      kycId: 86001 + index,
      orderId: `KYCORD${87001 + index}`,
      buyerMemberId: person.memberId,
      buyerOrderId: `B${87001 + index}`,
      sellerMemberId: seller.memberId,
      sellerOrderId: `S${87001 + index}`,
      payerUpi: upiOf(index),
      recipientName: NAMES[(index + 3) % 10],
      recipientUpi: upiOf(index + 3),
      recipientAccount: seller.phone,
      transactionStatus: index % 2,
      transactionType: (index % 2) + 1,
      bankTransactionTime: stamp(10, index, 0, 0),
      walletTransactionTime: stamp(10, index, 20, 0),
    }
  })
  return orders
}

function seedSellWait() {
  if (sellWait) return sellWait
  sellWait = people().map((person, index) => ({
    id: 86001 + index,
    memberId: person.memberId,
    merchantMemberIds: `M10021-${person.memberId}`,
    bankCode: bankAt(index).bankCode,
    upiId: upiOf(index),
    linkStatus: index % 2,
    progressOrder: index % 3,
    pullTimes: index + 1,
    successPullTimes: index % 4,
    lastPullTime: stamp(11, index, 0, 0),
    putTime: stamp(7, index, 0, 0),
    token: `tok-sell-${86001 + index}`,
  }))
  return sellWait
}

function seedBuyWait() {
  if (buyWait) return buyWait
  buyWait = people().map((person, index) => ({
    id: 88021 + index,
    memberId: person.memberId,
    bankCode: bankAt(index).bankCode,
    buyPlatformOrder: `BUY${88021 + index}`,
    utr: utrOf(20 + index),
    phoneNumber: person.phone,
    putTime: stamp(8, index, 0, 0),
    pullTimes: index,
    lastPullTime: stamp(12, index, 0, 0),
    unLinkTime: index % 2 === 0 ? stamp(13, index, 0, 0) : '',
    token: `tok-buy-${88021 + index}`,
  }))
  return buyWait
}

function seedQuickWait() {
  if (quickWait) return quickWait
  quickWait = people().map((person, index) => ({
    id: 88041 + index,
    kycId: 86001 + index,
    memberIds: String(person.memberId),
    merchantMemberIds: `M10021-${person.memberId}`,
    bankCode: bankAt(index).bankCode,
    upiId: upiOf(index),
    linkStatus: index % 2,
    progressOrder: index % 2 ? `P${88041 + index}` : '',
    pullTimes: index + 2,
    successPullTimes: index % 3,
    lastPullTime: stamp(14, index, 0, 0),
    putTime: stamp(6, index, 0, 0),
    token: `tok-quick-${88041 + index}`,
  }))
  return quickWait
}

function seedTokens() {
  if (tokens) return tokens
  tokens = people().map((_, index) => ({
    id: 86001 + index,
    kycId: 86001 + index,
  }))
  return tokens
}

function waterRow(base: number, index: number, extra: Row = {}): Row {
  const person = people()[index % 10]
  const seller = people()[(index + 4) % 10]
  return {
    id: base + index,
    kycId: 86001 + (index % 10),
    memberId: String(person.memberId),
    appealId: `AP${base + index}`,
    phoneNumber: person.phone,
    bankCode: bankAt(index).bankCode,
    recipient: NAMES[(index + 2) % 10],
    payer: NAMES[index % 10],
    amount: amountOf(index),
    utr: utrOf(base + index),
    misTypedUtr: index % 2,
    misTypedUtrCompleted: index % 2,
    misTypedUtrOrder: index % 2 ? [`MIS${base + index}`] : [],
    tId: index % 7 === 0 ? `DEFAULT${base + index}` : `TID${base + index}`,
    bankCardNumber: `501000${String(100000 + index)}`,
    ifscCode: ['SBIN0001234', 'HDFC0000456', 'ICIC0000789', 'UTIB0000111'][index % 4],
    cardOwnerName: NAMES[(index + 2) % 10],
    bankTransactionTime: stamp(15, index % 10, 0, 0),
    createTime: stamp(15, index % 10, 30, 0),
    buyerOrderId: `B${base + index}`,
    sellerOrderId: `S${base + index}`,
    isMatch: index % 4,
    replenishmentFlag: index % 5 === 0 ? 1 : 0,
    isPhonepeWakeUp: bankAt(index).bankCode === 'PHONEPE' ? 1 : index % 2,
    hasReceivedInfo: index % 2,
    payeeFlag: index % 2 ? 'credited' : '',
    sellerMemberId: seller.memberId,
    ...extra,
  }
}

function seedBuyAppeal() {
  if (buyAppeal) return buyAppeal
  buyAppeal = Array.from({ length: 10 }, (_, index) => waterRow(89001, index))
  return buyAppeal
}

function seedBuyAppealFailed() {
  if (buyAppealFailed) return buyAppealFailed
  buyAppealFailed = Array.from({ length: 8 }, (_, index) => waterRow(89101, index, { isMatch: index % 4 }))
  return buyAppealFailed
}

function seedSellAppealWait() {
  if (sellAppealWait) return sellAppealWait
  sellAppealWait = people().map((person, index) => ({
    id: 89201 + index,
    memberId: person.memberId,
    kycId: 86001 + index,
    utr: utrOf(40 + index),
    bankCode: bankAt(index).bankCode,
    sellPlatformOrder: `SELL${89201 + index}`,
    pullTimes: index + 1,
    putTime: stamp(7, 30 + index, 0, 0),
    lastPullTime: stamp(16, index, 0, 0),
  }))
  return sellAppealWait
}

function seedSellFailed() {
  if (sellFailed) return sellFailed
  sellFailed = Array.from({ length: 8 }, (_, index) => waterRow(89301, index))
  return sellFailed
}

function seedSellRecords() {
  if (sellRecords) return sellRecords
  sellRecords = Array.from({ length: 10 }, (_, index) => waterRow(89401, index))
  return sellRecords
}

function seedUtrDup() {
  if (utrDup) return utrDup
  const shared = utrOf(501)
  utrDup = [0, 1, 2, 3].map((index) => waterRow(89501, index, { utr: shared, isMatch: index % 4 }))
  return utrDup
}

function seedTidDup() {
  if (tidDup) return tidDup
  const shared = 'TIDDUP86001'
  tidDup = [0, 1, 2, 3].map((index) => waterRow(89601, index, { tId: shared, isMatch: index % 4 }))
  return tidDup
}

function seedAbnormal() {
  if (abnormal) return abnormal
  abnormal = Array.from({ length: 6 }, (_, index) =>
    waterRow(89701, index, {
      errorMsg: index % 2 ? 'amount mismatch' : 'recipient mismatch',
      possiblyOrders: [`PO${89701 + index}A`, `PO${89701 + index}B`],
      isMatch: 0,
    }),
  )
  return abnormal
}

function seedWakeups() {
  if (wakeups) return wakeups
  wakeups = people().map((person, index) => ({
    id: 89801 + index,
    buyMemberId: person.memberId,
    matchOrderNo: `WAKE${89801 + index}`,
    bankCode: index % 2 === 0 ? 'PHONEPE' : bankAt(index).bankCode,
    operationTime: stamp(17, index, 0, 0),
    createTime: stamp(17, index, 0, 0),
  }))
  return wakeups
}

function seedQuickBuy() {
  if (quickBuy) return quickBuy
  quickBuy = Array.from({ length: 8 }, (_, index) => waterRow(89901, index, { recipientType: index % 2 ? 3 : 1 }))
  return quickBuy
}

function seedQuickBuyWait() {
  if (quickBuyWait) return quickBuyWait
  quickBuyWait = people().map((person, index) => ({
    id: 89921 + index,
    memberId: person.memberId,
    bankCode: bankAt(index).bankCode,
    upiId: upiOf(index),
    buyPlatformOrder: `QBUY${89921 + index}`,
    utr: utrOf(60 + index),
    phoneNumber: person.phone,
    putTime: stamp(8, 10 + index, 0, 0),
    pullTimes: index,
    lastPullTime: stamp(18, index, 0, 0),
    linkStatus: index % 2,
  }))
  return quickBuyWait
}

function seedQuickBuyFailed() {
  if (quickBuyFailed) return quickBuyFailed
  quickBuyFailed = Array.from({ length: 8 }, (_, index) => waterRow(89941, index, { recipientType: index % 2 ? 1 : 3 }))
  return quickBuyFailed
}

function isQuick(raw: unknown) {
  return String(readQuery(raw).selectType ?? '') === '2'
}

function seedSms() {
  if (smsLogs) return smsLogs
  smsLogs = people().map((person, index) => ({
    id: 90001 + index,
    phoneNumber: person.phone,
    memberId: person.memberId,
    bankCode: bankAt(index).bankCode,
    upiId: upiOf(index),
    sendStatus: index % 2,
    sendTime: stamp(9, index, 0, 0),
    remark: index % 2 ? '' : 'gateway timeout',
  }))
  return smsLogs
}

function seedSmsSuccess() {
  if (smsSuccess) return smsSuccess
  smsSuccess = people().map((person, index) => ({
    id: 90101 + index,
    phoneNumber: person.phone,
    bankCode: bankAt(index).bankCode,
    cnt: (index + 1) * 3,
    sendTime: indiaDay(),
  }))
  return smsSuccess
}

function seedTrading() {
  if (trading) return trading
  trading = people().map((person, index) => ({
    id: 90201 + index,
    kycId: 86001 + index,
    upiId: upiOf(index),
    memberId: person.memberId,
    todaySuccessBuyCount: index + 1,
    todaySuccessBuyAmount: (index + 1) * 500,
    todayBuySuccessRate: `${40 + index * 5}%`,
    todaySuccessSellCount: index,
    todaySuccessSellAmount: index * 450,
    todaySellSuccessRate: `${30 + index * 4}%`,
    statDate: indiaDay(),
  }))
  return trading
}

function seedFlowAbn() {
  if (flowAbn) return flowAbn
  const statuses = ['SUCCESS', 'FAILED', 'PENDING', 'REVERSED']
  flowAbn = Array.from({ length: 8 }, (_, index) => {
    const person = people()[index % 10]
    return {
      id: 90301 + index,
      tid: `ABN${90301 + index}`,
      utr: utrOf(80 + index),
      flowAmount: amountOf(index),
      flowStatus: statuses[index % statuses.length],
      flowType: (index % 2) + 1,
      payeeBankCode: bankAt(index).bankCode,
      payerBankCode: bankAt(index + 1).bankCode,
      pullTime: stamp(11, 20 + index, 0, 0),
      mappingOrderInfo: {
        appealStatus: (index % 3) + 1,
        buyOrderType: (index % 7) + 1,
        buyOrderNo: `ABNB${90301 + index}`,
        chOrderStatus: [3, 4, 6, 7, 9, 15][index % 6],
        chOrderNo: `ABNC${90301 + index}`,
        sellOrderNo: `ABNS${90301 + index}`,
      },
      payeeKycInfo: {
        bankCode: bankAt(index).bankCode,
        bankNo: person.phone,
        phoneNumber: person.phone,
        upiId: upiOf(index),
        ifscCode: 'HDFC0000456',
        ifsc: 'HDFC0000456',
      },
      payerKycInfo: {
        bankCode: bankAt(index + 1).bankCode,
        bankNo: people()[(index + 1) % 10].phone,
        phoneNumber: people()[(index + 1) % 10].phone,
        upiId: upiOf(index + 1),
        ifscCode: 'SBIN0001234',
        ifsc: 'SBIN0001234',
      },
    }
  })
  return flowAbn
}

function seedReversals() {
  if (reversals) return reversals
  reversals = people().map((person, index) => ({
    id: 90401 + index,
    bankCode: bankAt(index).bankCode,
    utr: utrOf(90 + index),
    txnid: `TXN${90401 + index}`,
    amount: amountOf(index),
    recipientName: NAMES[(index + 1) % 10],
    recipientUPI: upiOf(index + 1),
    tid: index % 4 === 0 ? `DEFAULT${90401 + index}` : `REV${90401 + index}`,
    orderStatus: index % 2,
    sourceTransactionStatus: index % 2 ? 'SUCCESS' : 'FAILED',
    createTime: stamp(12, index, 0, 0),
    transactionCreateTime: stamp(12, index, 10, 0),
    transactionUpdateTime: stamp(12, index, 40, 0),
    memberId: person.memberId,
    isMatch: index % 2 === 0 ? 0 : 1,
  }))
  return reversals
}

function seedChannels() {
  if (channels) return channels
  const items = [
    ['Razorpay', 'RAZORPAY', 1],
    ['Cashfree', 'CASHFREE', 1],
    ['PayU', 'PAYU', 0],
    ['PhonePe Business', 'PHONEPE_BIZ', 1],
  ]
  channels = items.map((item, index) => ({
    id: index + 1,
    name: item[0],
    code: item[1],
    status: item[2],
    createTime: stamp(8, index, 0, -3),
    createBy: 'prototype',
    channelPublicKey: `channel-public-${item[1]}`,
    platformPublicKey: `platform-public-${item[1]}`,
  }))
  return channels
}

function channelWater(base: number, index: number): Row {
  return {
    id: base + index,
    channelCode: ['RAZORPAY', 'CASHFREE', 'PAYU', 'PHONEPE_BIZ'][index % 4],
    extChannelName: ['Razorpay', 'Cashfree', 'PayU', 'PhonePe Business'][index % 4],
    extChannelCode: ['RAZORPAY', 'CASHFREE', 'PAYU', 'PHONEPE_BIZ'][index % 4],
    phoneNumber: people()[index % 10].phone,
    bankCode: bankAt(index).bankCode,
    payer: NAMES[index % 10],
    amount: amountOf(index),
    utr: utrOf(base + index),
    recipient: NAMES[(index + 2) % 10],
    ifscCode: 'ICIC0000789',
    cardOwnerName: NAMES[(index + 2) % 10],
    mode: (index % 2) + 1,
    originalStatus: index % 2 ? 'SUCCESS' : 'FAILED',
    transactionTime: stamp(13, index, 0, 0),
    linkStatus: index % 2,
    createTime: stamp(13, index, 0, 0),
    successPullTimes: index,
    lastPullTime: stamp(13, 20 + index, 0, 0),
    token: `ext-tok-${base + index}`,
  }
}

function seedChannelFail() {
  if (channelFail) return channelFail
  channelFail = Array.from({ length: 8 }, (_, index) => channelWater(90501, index))
  return channelFail
}

function seedChannelPending() {
  if (channelPending) return channelPending
  channelPending = Array.from({ length: 8 }, (_, index) => channelWater(90601, index))
  return channelPending
}

function seedChannelSuccess() {
  if (channelSuccess) return channelSuccess
  channelSuccess = Array.from({ length: 8 }, (_, index) => channelWater(90701, index))
  return channelSuccess
}

function seedMulti() {
  if (multiOrders) return multiOrders
  multiOrders = Array.from({ length: 15 }, (_, index) => ({
    id: 90801 + index,
    buyerId: people()[index % 10].memberId,
    payeeAccount: upiOf(index),
    flowType: (index % 2) + 1,
    tid: `MUL${90801 + index}`,
    utr: utrOf(120 + index),
    amount: amountOf(index),
    processResult: index + 1,
    tidOrder: orderBox(index, 'TID'),
    utrOrder: orderBox(index + 1, 'UTR'),
    buyerFailedFinishOrder: orderBox(index + 2, 'FAIL'),
    processTime: stamp(14, index, 0, 0),
    bankTransactionTime: stamp(14, index, 20, 0),
  }))
  return multiOrders
}

function seedSuccessUpi() {
  if (successUpi) return successUpi
  successUpi = people().map((person, index) => ({
    id: 90901 + index,
    memberId: person.memberId,
    upiId: upiOf(index),
    successCount: index + 1,
    bankCode: bankAt(index).bankCode,
    latestConnectTime: stamp(10, index, 0, 0),
    lastDisconnectTime: stamp(16, index, 0, 0),
  }))
  return successUpi
}

function seedSuccessLogs() {
  if (successLogs) return successLogs
  successLogs = []
  people().forEach((person, memberIndex) => {
    for (let source = 0; source <= 5; source += 1) {
      const index = memberIndex * 6 + source
      successLogs!.push({
        id: 91001 + index,
        buyerOrderId: `SUC${91001 + index}`,
        payer: NAMES[memberIndex],
        payee: NAMES[(memberIndex + 1) % 10],
        sourceOrderType: source,
        amount: amountOf(memberIndex) + source * 10,
        orderFinishTime: stamp(15, memberIndex, source, 0),
        buyUpiId: upiOf(memberIndex),
        buyerMemberId: person.memberId,
      })
    }
  })
  return successLogs
}

function autoRow(base: number, index: number, extra: Row = {}): Row {
  const person = people()[index % 10]
  return {
    id: base + index,
    chOrderNo: `AUTO${base + index}`,
    memberId: person.memberId,
    tid: `AT${base + index}`,
    transactionId: `ATX${base + index}`,
    bankCode: bankAt(index).bankCode,
    phoneNumber: person.phone,
    payeeVpa: upiOf(index),
    payerVpa: upiOf(index + 1),
    amount: amountOf(index),
    utr: utrOf(base + index),
    backendErrorCode: index % 2 ? 'U30' : '',
    successFlag: index % 2,
    matchFlag: index % 4,
    pullTime: stamp(16, index, 0, 0),
    createTime: stamp(16, index, 10, 0),
    ...extra,
  }
}

function seedAutoBuy() {
  if (autoBuy) return autoBuy
  autoBuy = Array.from({ length: 8 }, (_, index) => autoRow(91101, index))
  return autoBuy
}

function seedAutoSell() {
  if (autoSell) return autoSell
  autoSell = Array.from({ length: 8 }, (_, index) => autoRow(91201, index))
  return autoSell
}

function seedAutoPending() {
  if (autoPending) return autoPending
  autoPending = people().map((person, index) => ({
    id: 91301 + index,
    bankCode: bankAt(index).bankCode,
    phoneNumber: person.phone,
    mappingOrder: `MAP${91301 + index}`,
    countOfReceipt: index + 1,
    createTime: stamp(9, 30 + index, 0, 0),
    latestPullTime: stamp(17, index, 0, 0),
  }))
  return autoPending
}

function seedFailParties() {
  if (failParties) return failParties
  const codes = ['U30', 'U16', 'Z9', 'B3', 'U69', 'XT']
  failParties = codes.map((code, index) => ({
    id: 91401 + index,
    errorCode: code,
    errorRemark: `prototype ${code}`,
    failedParty: index % 3,
    judgeSource: index % 2,
    judgeName: index % 2 ? 'prototype' : 'system',
    createTime: stamp(8, 40 + index, 0, 0),
  }))
  return failParties
}

function seedUnfinished() {
  if (unfinished) return unfinished
  unfinished = Array.from({ length: 8 }, (_, index) =>
    autoRow(91501, index, {
      fundFlowType: (index % 2) + 1,
      sourceTransactionStatus: index % 2 ? 'SUCCESS' : 'PENDING',
    }),
  )
  return unfinished
}

function seedIfsc() {
  if (ifscRows) return ifscRows
  const banks = [
    ['State Bank of India', 'SBIN0001234'],
    ['HDFC Bank', 'HDFC0000456'],
    ['ICICI Bank', 'ICIC0000789'],
    ['Axis Bank', 'UTIB0000111'],
    ['Punjab National Bank', 'PUNB0002222'],
    ['Bank of Baroda', 'BARB0VJAMUN'],
    ['Kotak Mahindra Bank', 'KKBK0003333'],
    ['Yes Bank', 'YESB0004444'],
    ['IDFC First Bank', 'IDFB0005555'],
    ['IndusInd Bank', 'INDB0006666'],
  ]
  ifscRows = banks.map((item, index) => ({
    id: index + 1,
    bankName: item[0],
    ifsc: item[1],
    createBy: 'prototype',
    createTime: stamp(8, index, 0, -10),
    updateBy: 'prototype',
    updateTime: stamp(8, index, 0, -1),
  }))
  return ifscRows
}

function seedUpiOrders() {
  if (upiOrders) return upiOrders
  const statuses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 17]
  upiOrders = statuses.map((status, index) => ({
    id: 91601 + index,
    memberId: people()[index % 10].memberId,
    upiId: upiOf(index),
    utr: utrOf(200 + index),
    platformOrder: `UPI${91601 + index}`,
    amount: amountOf(index),
    orderStatus: status,
    createTime: stamp(18, index, 0, 0),
  }))
  return upiOrders
}

function allWaters() {
  return [
    ...seedBuyAppeal(),
    ...seedBuyAppealFailed(),
    ...seedSellFailed(),
    ...seedSellRecords(),
    ...seedUtrDup(),
    ...seedTidDup(),
    ...seedAbnormal(),
    ...seedQuickBuy(),
    ...seedQuickBuyFailed(),
  ]
}

function applyReplenish(raw: unknown) {
  const query = readQuery(raw)
  for (const row of allWaters()) {
    const hit =
      (query.utr && String(row.utr) === String(query.utr)) ||
      (query.orderNo && (String(row.buyerOrderId) === String(query.orderNo) || String(row.sellerOrderId) === String(query.orderNo)))
    if (hit) {
      row.replenishmentFlag = 1
      row.isMatch = 2
    }
  }
  return { ...success }
}

function applyDeletePartner(raw: unknown) {
  const query = readQuery(raw)
  const rows = seedPartners()
  const index = rows.findIndex((row) => String(row.id) === String(query.id))
  if (index >= 0) rows[index].deleted = 1
  return { ...success }
}

function applyChannelCreate(raw: unknown) {
  const query = readQuery(raw)
  seedChannels().unshift({
    id: nextChannelId++,
    name: String(query.name || ''),
    code: String(query.code || ''),
    status: 1,
    createTime: stamp(12, 0, 0, 0),
    createBy: 'prototype',
    channelPublicKey: '',
    platformPublicKey: `platform-public-${query.code || nextChannelId}`,
  })
  return { ...success }
}

function applyChannelStatus(raw: unknown) {
  const query = readQuery(raw)
  const row = seedChannels().find((item) => String(item.id) === String(query.id))
  if (row) row.status = Number(query.status)
  return { ...success }
}

function channelInfo(raw: unknown) {
  const query = readQuery(raw)
  const row = seedChannels().find((item) => String(item.id) === String(query.id))
  return { code: '1', msg: '操作成功', data: row || null, success: true }
}

function applyChannelKey(raw: unknown) {
  const query = readQuery(raw)
  const row = seedChannels().find((item) => String(item.id) === String(query.id))
  if (row && query.channelPublicKey != null) row.channelPublicKey = String(query.channelPublicKey)
  return { ...success }
}

function applyFailParty(raw: unknown) {
  const query = readQuery(raw)
  const row = seedFailParties().find((item) => String(item.id) === String(query.id) || String(item.errorCode) === String(query.errorCode))
  if (row) {
    row.failedParty = Number(query.failedParty)
    row.judgeSource = 1
    row.judgeName = 'prototype'
  }
  return { ...success }
}

function applyIfscAdd(raw: unknown) {
  const query = readQuery(raw)
  seedIfsc().unshift({
    id: nextIfscId++,
    bankName: String(query.bankName || ''),
    ifsc: String(query.ifsc || '').toUpperCase(),
    createBy: 'prototype',
    createTime: stamp(12, 0, 0, 0),
    updateBy: 'prototype',
    updateTime: stamp(12, 0, 0, 0),
  })
  return { ...success }
}

function applyIfscUpdate(raw: unknown) {
  const query = readQuery(raw)
  const row = seedIfsc().find((item) => String(item.id) === String(query.id) || String(item.ifsc) === String(query.ifsc))
  if (row && query.bankName) {
    row.bankName = String(query.bankName)
    row.updateBy = 'prototype'
    row.updateTime = stamp(12, 10, 0, 0)
  }
  return { ...success }
}

function tradingExtend(page: Row[], all: Row[]) {
  const sum = (rows: Row[], key: string) => rows.reduce((total, row) => total + Number(row[key] || 0), 0)
  return {
    todaySuccessBuyPageTotalCount: sum(page, 'todaySuccessBuyCount'),
    todaySuccessBuyPageTotalAmount: sum(page, 'todaySuccessBuyAmount'),
    todaySuccessSellPageTotalCount: sum(page, 'todaySuccessSellCount'),
    todaySuccessSellPageTotalAmount: sum(page, 'todaySuccessSellAmount'),
    todaySuccessBuyTotalCount: sum(all, 'todaySuccessBuyCount'),
    todaySuccessBuyTotalAmount: sum(all, 'todaySuccessBuyAmount'),
    todaySuccessSellTotalCount: sum(all, 'todaySuccessSellCount'),
    todaySuccessSellTotalAmount: sum(all, 'todaySuccessSellAmount'),
  }
}

function amountExtend(page: Row[], all: Row[]) {
  const sum = (rows: Row[]) => rows.reduce((total, row) => total + Number(row.amount || 0), 0)
  return { pageAmountSum: sum(page), totalAmountSum: sum(all) }
}

function smsExtend(rows: Row[], page: Row[]) {
  const sum = (list: Row[]) => list.reduce((total, row) => total + Number(row.cnt || 0), 0)
  return { cntPageTotal: sum(page), cntTotal: sum(rows) }
}

/** 代码里点申诉ID会跳到申诉订单列表的流水页，这些 appealId 要和申诉订单的 id 对得上。 */
export function linkedAppealIds(): string[] {
  const rows = [
    ...seedBuyAppeal(),
    ...seedQuickBuy(),
    ...seedQuickBuyFailed(),
    ...seedSellRecords(),
    ...seedUtrDup(),
    ...seedTidDup(),
  ]
  return [...new Set(rows.map((row) => String(row.appealId)).filter(Boolean))]
}

export function resolveKycMenu(url: string, raw: unknown) {
  if (url.includes('/kycPartnersAdmin/listPage') && !url.includes('Log')) {
    return respond(seedPartners(), raw, {
      timeField: 'createTime',
      equals: ['memberId', 'bankCode', 'linkStatus', 'sellStatus', 'deleted', 'id'],
      includes: ['account', 'upiId'],
    })
  }
  if (url.includes('/kycPartnersAdmin/delete')) return applyDeletePartner(raw)
  if (url.includes('/kycPartnersAdmin/pendingKycListPageForQuickKyc')) {
    return respond(seedQuickWait(), raw, { equals: ['bankCode', 'kycId', 'linkStatus'], includes: ['upiId', 'memberIds'] })
  }
  if (url.includes('/kycPartnersAdmin/pendingKycListPage')) {
    return respond(seedSellWait(), raw, { equals: ['memberId', 'bankCode', 'id'], includes: ['upiId'] })
  }
  if (url.includes('/kycPartnersAdmin/pendingBuyKycListPage')) {
    const rows = isQuick(raw) ? seedQuickBuyWait() : seedBuyWait()
    return respond(rows, raw, { equals: ['memberId', 'bankCode', 'linkStatus'], includes: ['utr', 'phoneNumber', 'upiId'] })
  }
  if (url.includes('/kycPartnersAdmin/pendingKycTokenListPage')) {
    return respond(seedTokens(), raw, { equals: ['kycId'] })
  }
  if (url.includes('/kycPartnersAdmin/kycSellAppealPendingPull')) {
    return respond(seedSellAppealWait(), raw, { equals: ['memberId', 'kycId', 'bankCode'], includes: ['utr', 'sellPlatformOrder'] })
  }
  if (url.includes('/kycPartnersAdmin/buyKycPendingListLogPage')) {
    return respond(seedQuickBuyWait(), raw, { timeField: 'putTime', equals: ['memberId', 'bankCode'] })
  }
  if (url.includes('/paymentOrderAdmin/processedList/byUpiId')) {
    return respond(seedUpiOrders(), raw, { equals: ['upiId', 'memberId', 'orderStatus'], includes: ['utr', 'platformOrder'] })
  }
  if (url.includes('/kycApprovedOrderAdmin/listPage')) {
    return respond(seedOrders(), raw, {
      timeField: 'walletTransactionTime',
      equals: ['bankCode', 'buyerMemberId', 'sellerMemberId', 'transactionType', 'transactionStatus'],
      includes: ['utr', 'orderId', 'buyerOrderId', 'sellerOrderId', 'payerUpi', 'recipientUpi'],
    })
  }
  if (url.includes('/kycPartnerBuyAppealPaymentAdmin/failedListPage')) {
    const rows = isQuick(raw) ? seedQuickBuyFailed() : seedBuyAppealFailed()
    return respond(rows, raw, {
      timeField: 'createTime',
      equals: ['memberId', 'bankCode', 'isMatch', 'recipientType'],
      includes: ['appealId', 'phoneNumber', 'utr', 'recipient', 'payer'],
    })
  }
  if (url.includes('/kycPartnerBuyAppealPaymentAdmin/listPage')) {
    const rows = isQuick(raw) ? seedQuickBuy() : seedBuyAppeal()
    return respond(rows, raw, {
      timeField: 'createTime',
      equals: ['memberId', 'bankCode', 'isMatch', 'replenishmentFlag', 'recipientType'],
      includes: ['appealId', 'phoneNumber', 'utr', 'recipient', 'payer'],
    })
  }
  if (url.includes('/kycPartnerRecipientAdmin/manualReplenishment')) return applyReplenish(raw)
  if (url.includes('/kycPartnerRecipientAdmin/failedListPage')) {
    return respond(seedSellFailed(), raw, {
      timeField: 'createTime',
      equals: ['kycId', 'memberId', 'bankCode', 'isMatch'],
      includes: ['appealId', 'utr', 'recipient', 'payer'],
    })
  }
  if (url.includes('/kycPartnerRecipientAdmin/utrDuplicateListPage')) {
    return respond(seedUtrDup(), raw, { timeField: 'createTime', equals: ['memberId', 'bankCode', 'isMatch'], includes: ['utr'] })
  }
  if (url.includes('/kycPartnerRecipientAdmin/tidDuplicateListPage')) {
    return respond(seedTidDup(), raw, { timeField: 'createTime', equals: ['memberId', 'bankCode', 'isMatch'], includes: ['tId'] })
  }
  if (url.includes('/kycPartnerRecipientAdmin/errorListPage')) {
    return respond(seedAbnormal(), raw, { timeField: 'createTime', equals: ['memberId', 'bankCode', 'isMatch'], includes: ['utr'] })
  }
  if (url.includes('/kycPartnerRecipientAdmin/listPage')) {
    return respond(seedSellRecords(), raw, {
      timeField: 'createTime',
      equals: ['kycId', 'memberId', 'bankCode', 'isMatch', 'isPhonepeWakeUp', 'hasReceivedInfo', 'replenishmentFlag'],
      includes: ['utr', 'recipient', 'payer', 'appealId'],
    })
  }
  if (url.includes('/wakeupRecordAdmin/listPage')) {
    return respond(seedWakeups(), raw, { timeField: 'createTime', startKey: 'createTimeStart', endKey: 'createTimeEnd', equals: ['buyMemberId', 'bankCode'] })
  }
  if (url.includes('/kycReversalWaterAdmin/listPage')) {
    return respond(seedReversals(), raw, {
      timeField: 'createTime',
      equals: ['bankCode', 'orderStatus'],
      includes: ['utr', 'txnid', 'tid', 'recipientUPI'],
    })
  }
  if (url.includes('/abnormalWaterFlowAdmin/listPage')) {
    return respond(seedFlowAbn(), raw, {
      timeField: 'pullTime',
      startKey: 'pullTimeGe',
      endKey: 'pullTimeLe',
      equals: ['flowType', 'payeeBankCode'],
      includes: ['utr', 'tid', 'flowStatus'],
    })
  }
  if (url.includes('/oneWaterMultipleOrderAdmin/processResultList')) {
    return respond(seedMulti(), raw, {
      timeField: 'processTime',
      startKey: 'processTimeGe',
      endKey: 'processTimeLe',
      equals: ['buyerId', 'flowType', 'processResult'],
      includes: ['utr', 'tid', 'payeeAccount'],
    })
  }
  if (url.includes('/extChannelKycAdmin/kycWaterSuccess/listPage')) {
    return respond(seedChannelSuccess(), raw, {
      timeField: 'transactionTime',
      startKey: 'transactionTimeStart',
      endKey: 'transactionTimeEnd',
      equals: ['bankCode', 'mode', 'extChannelCode'],
      includes: ['phoneNumber', 'utr', 'payer', 'recipient'],
    })
  }
  if (url.includes('/extChannelKycAdmin/kycPending/listPage')) {
    return respond(seedChannelPending(), raw, {
      timeField: 'createTime',
      startKey: 'createTimeStart',
      endKey: 'createTimeEnd',
      equals: ['bankCode', 'linkStatus', 'extChannelCode'],
      includes: ['phoneNumber'],
    })
  }
  if (url.includes('/extChannelKycAdmin/kycWaterFail/listPage')) {
    return respond(seedChannelFail(), raw, {
      timeField: 'transactionTime',
      startKey: 'transactionTimeStart',
      endKey: 'transactionTimeEnd',
      equals: ['bankCode', 'mode', 'extChannelCode'],
      includes: ['phoneNumber', 'utr'],
    })
  }
  if (url.includes('/extChannelAdmin/createMerchantInfo')) return applyChannelCreate(raw)
  if (url.includes('/extChannelAdmin/updateStatus')) return applyChannelStatus(raw)
  if (url.includes('/extChannelAdmin/getInfo')) return channelInfo(raw)
  if (url.includes('/extChannelAdmin/updatePublicKey')) return applyChannelKey(raw)
  if (url.includes('/extChannelAdmin/listpage')) {
    return respond(seedChannels(), raw, { equals: ['status'], includes: ['name', 'code'] })
  }
  if (url.includes('/buyPaymentSuccessRecordForAdmin/buySuccessUpiListPage')) {
    return respondNested(seedSuccessUpi(), raw, { equals: ['memberId', 'bankCode'], includes: ['upiId'] })
  }
  if (url.includes('/buyPaymentSuccessRecordForAdmin/buyListPageRecord')) {
    return respondNested(seedSuccessLogs(), raw, {
      timeField: 'orderFinishTime',
      equals: ['buyUpiId', 'buyerMemberId', 'sourceOrderType'],
      includes: ['buyerOrderId', 'payer', 'payee'],
    })
  }
  if (url.includes('/autoTransferAdmin/paymentRecord')) {
    return respond(seedAutoBuy(), raw, {
      timeField: 'pullTime',
      startKey: 'pullTimeStart',
      endKey: 'pullTimeEnd',
      equals: ['memberId', 'bankCode', 'successFlag', 'matchFlag'],
      includes: ['phoneNumber', 'utr', 'chOrderNo'],
    }, amountExtend)
  }
  if (url.includes('/autoTransferAdmin/receiptRecord')) {
    return respond(seedAutoSell(), raw, {
      timeField: 'pullTime',
      startKey: 'pullTimeStart',
      endKey: 'pullTimeEnd',
      equals: ['memberId', 'bankCode', 'matchFlag'],
      includes: ['phoneNumber', 'utr', 'chOrderNo'],
    }, amountExtend)
  }
  if (url.includes('/autoTransferAdmin/waitingPull')) {
    return respond(seedAutoPending(), raw, {
      timeField: 'createTime',
      startKey: 'startTimeGe',
      endKey: 'startTimeLe',
      equals: ['bankCode'],
      includes: ['phoneNumber'],
    })
  }
  if (url.includes('/autoTransferAdmin/unfinishRecord')) {
    return respond(seedUnfinished(), raw, {
      timeField: 'createTime',
      startKey: 'createTimeStart',
      endKey: 'createTimeEnd',
      equals: ['bankCode', 'matchFlag', 'fundFlowType'],
      includes: ['phoneNumber', 'chOrderNo', 'transactionId'],
    })
  }
  if (url.includes('/fakeAppTransactionFailedPartyAdmin/updateFailedParty')) return applyFailParty(raw)
  if (url.includes('/fakeAppTransactionFailedPartyAdmin/listPage')) {
    return respond(seedFailParties(), raw, { equals: ['failedParty', 'judgeSource', 'errorCode'] })
  }
  if (url.includes('/ifscBankNameAdmin/add')) return applyIfscAdd(raw)
  if (url.includes('/ifscBankNameAdmin/update')) return applyIfscUpdate(raw)
  if (url.includes('/ifscBankNameAdmin/listPage')) {
    return respond(seedIfsc(), raw, { includes: ['bankName', 'ifsc'] })
  }
  if (url.includes('/kycSendSmsDailyStatistics/listPage')) {
    return respond(seedSms(), raw, {
      timeField: 'sendTime',
      equals: ['memberId', 'bankCode', 'sendStatus'],
      includes: ['phoneNumber', 'upiId'],
    })
  }
  if (url.includes('/kycDataStatDayManager/listPage')) {
    const query = readQuery(raw)
    const rows = select(seedTrading(), query, {
      timeField: 'statDate',
      equals: ['kycId'],
      includes: ['upiId'],
    })
    const page = slicePage(sortRows(rows, query, 'todaySuccessBuyCount'), query)
    return listBody(page, rows.length, 'statDate', tradingExtend(page, rows))
  }
  if (url.includes('/kycSendSmsSuccessStatistics/listPage')) {
    const query = readQuery(raw)
    const rows = select(seedSmsSuccess(), query, {
      timeField: 'sendTime',
      equals: ['bankCode'],
      includes: ['phoneNumber'],
    })
    const page = slicePage(sortRows(rows, query, 'cnt'), query)
    return listBody(page, rows.length, 'sendTime', smsExtend(rows, page))
  }
  return null
}
