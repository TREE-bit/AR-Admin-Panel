// APP 管理 6 个页面的假数据。银行编码一律用 appUpiBanks.ts 的 10 个印度 UPI 应用。
// 字段说明见 notes/field-notes.md §17～§22。

import { listMembers } from './memberList'
import { APP_UPI_BANKS, appBankIcon } from './appUpiBanks'

const success = { code: '1', msg: '操作成功', data: null, success: true }

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
  if (hasFilter(start) && value < String(start)) return false
  if (hasFilter(end) && value > String(end)) return false
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

function nowStamp() {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((part) => [part.type, part.value]))
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`
}

function slicePage<T>(list: T[], query: Record<string, any>) {
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const start = (pageNo - 1) * pageSize
  return list.slice(start, start + pageSize)
}

function cursorExtend(page: Array<Record<string, any>>, timeKey: string) {
  const last = page[page.length - 1]
  const first = page[0]
  return {
    nextColValue: last ? String(last[timeKey] ?? '') : '',
    nextCursorId: last ? String(last.id ?? '') : '',
    prevColValue: first ? String(first[timeKey] ?? '') : '',
    prevCursorId: first ? String(first.id ?? '') : '',
  }
}

function listBody(page: Array<Record<string, any>>, total: number, timeKey: string, extraExtend: Record<string, unknown> = {}) {
  return {
    code: '1',
    msg: '操作成功',
    data: page,
    total,
    extend: { ...cursorExtend(page, timeKey), ...extraExtend },
    success: true,
  }
}

/** APP 银行列表把 res.data 当数组，同时读 res.data.total */
function arrayTotalBody(page: Array<Record<string, any>>, total: number) {
  const data = Object.assign(page.slice(), { total })
  return { code: '1', msg: '操作成功', data, total, success: true }
}

function sortRows<T extends Record<string, any>>(rows: T[], query: Record<string, any>, fallback: string) {
  const column = String(query.column || fallback)
  const asc = query.asc === true || query.asc === 'true'
  return rows.slice().sort((a, b) => {
    const left = a[column]
    const right = b[column]
    if (left === right) return 0
    const order = left > right ? 1 : -1
    return asc ? order : -order
  })
}

const PLACES = [
  { city: 'New Delhi', longitude: '77.2090', latitude: '28.6139' },
  { city: 'Mumbai', longitude: '72.8777', latitude: '19.0760' },
  { city: 'Bengaluru', longitude: '77.5946', latitude: '12.9716' },
  { city: 'Hyderabad', longitude: '78.4867', latitude: '17.3850' },
  { city: 'Chennai', longitude: '80.2707', latitude: '13.0827' },
  { city: 'Kolkata', longitude: '88.3639', latitude: '22.5726' },
  { city: 'Pune', longitude: '73.8567', latitude: '18.5204' },
  { city: 'Ahmedabad', longitude: '72.5714', latitude: '23.0225' },
  { city: 'Jaipur', longitude: '75.7873', latitude: '26.9124' },
  { city: 'Lucknow', longitude: '80.9462', latitude: '26.8467' },
]

const DEVICES = [
  'Redmi Note 13',
  'Samsung Galaxy M34',
  'vivo Y28',
  'OPPO A59',
  'realme Narzo 70',
  'Motorola G64',
  'iQOO Z9',
  'Samsung Galaxy A35',
  'Redmi 13C',
  'POCO X6',
]

const NAMES = ['Rahul Sharma', 'Priya Nair', 'Amit Patel', 'Neha Singh', 'Vikram Iyer', 'Ananya Das', 'Rohit Mehta', 'Kavya Reddy', 'Sanjay Gupta', 'Meera Joshi']

const NETS = ['WIFI', '4G', '5G']

type AppBankRow = {
  id: number
  sort: number
  bankName: string
  bankCode: string
  iconUrl: string
  sellStatus: number
  supportsBuyAppeal: number
  supportsQuickWithdraw: number
  supportsQuickWithdrawBank: number
  supportPhonepeWakeUp: number
  supportsExternalAppeal: number
  supportsExternalSell: number
  supportLotteryTicket: number
  supportsAutoTrade: number
  allowMultiLogin: number
  needPinCode: number
  otpLimitEnabled: number
  otpHourlySuccessLimit: number
  otpDailyFailLimit: number
  externalIconUrl: string
  externalBackgroundUrl: string
  upiMinAmount: number
  upiMaxAmount: number
  bankMinAmount: number
  bankMaxAmount: number
  sourceType: number
  updateBy: string
  updateTime: string
  createTime: string
}

type FakeBankRow = {
  id: number
  sort: number
  bankName: string
  bankCode: string
  sellStatus: number
  manualBuyUpiStatus: number
  autoBuyUpiStatus: number
  manualBuyBankStatus: number
  autoBuyBankStatus: number
  autoBuyStatus: number
  fillUtr: number
  forceGrantPermission: number
  utrRequired: number
  buyUpiMinAmount: number
  buyUpiMaxAmount: number
  buyBankMinAmount: number
  buyBankMaxAmount: number
  updateBy: string
  updateTime: string
  createTime: string
}

type SwitchLog = {
  id: number
  bankCode: string
  controlSwitchType: number
  newStatus: number
  remark: string
  updateBy: string
  createTime: string
}

const APP_SWITCH_FIELD: Record<number, keyof AppBankRow | 'bothTrade'> = {
  1: 'sellStatus',
  3: 'supportsBuyAppeal',
  4: 'supportsQuickWithdraw',
  5: 'supportsQuickWithdrawBank',
  6: 'supportPhonepeWakeUp',
  7: 'supportsExternalAppeal',
  8: 'supportsExternalSell',
  9: 'bothTrade',
  12: 'otpLimitEnabled',
}

const FAKE_SWITCH_FIELD: Record<number, keyof FakeBankRow> = {
  1: 'sellStatus',
  2: 'manualBuyBankStatus',
  3: 'manualBuyUpiStatus',
  5: 'autoBuyBankStatus',
  6: 'autoBuyUpiStatus',
  7: 'autoBuyStatus',
  8: 'fillUtr',
  9: 'forceGrantPermission',
}

let appBanks: AppBankRow[] | null = null
let fakeBanks: FakeBankRow[] | null = null
let appLogs: SwitchLog[] | null = null
let fakeLogs: SwitchLog[] | null = null
let nextAppBankId = 11
let nextFakeBankId = 111
let nextAppLogId = 1
let nextFakeLogId = 1

function bit(index: number, shift: number) {
  return (index + shift) % 2
}

function seedAppBanks() {
  if (appBanks) return appBanks
  appBanks = APP_UPI_BANKS.map((bank, index) => ({
    id: index + 1,
    sort: index + 1,
    bankName: bank.bankName,
    bankCode: bank.bankCode,
    iconUrl: appBankIcon(bank),
    sellStatus: bit(index, 0),
    supportsBuyAppeal: bit(index, 1),
    supportsQuickWithdraw: bit(index, 0),
    supportsQuickWithdrawBank: bit(index, 1),
    supportPhonepeWakeUp: bank.bankCode === 'PHONEPE' ? 1 : bit(index, 0),
    supportsExternalAppeal: bit(index, 1),
    supportsExternalSell: bit(index, 0),
    supportLotteryTicket: bit(index, 1),
    supportsAutoTrade: bit(index, 0),
    allowMultiLogin: bit(index, 1),
    needPinCode: bit(index, 0),
    otpLimitEnabled: bit(index, 1),
    otpHourlySuccessLimit: bit(index, 1) ? 20 : 0,
    otpDailyFailLimit: bit(index, 1) ? 5 : 0,
    externalIconUrl: appBankIcon(bank),
    externalBackgroundUrl: appBankIcon(bank),
    upiMinAmount: index === 9 ? 0 : 100,
    upiMaxAmount: index === 9 ? 0 : 50000,
    bankMinAmount: 200,
    bankMaxAmount: 100000,
    sourceType: index % 3,
    updateBy: 'prototype',
    updateTime: stamp(10, index, 0, -1),
    createTime: stamp(9, index, 0, -20),
  }))
  return appBanks
}

function seedFakeBanks() {
  if (fakeBanks) return fakeBanks
  fakeBanks = APP_UPI_BANKS.map((bank, index) => ({
    id: 101 + index,
    sort: index + 1,
    bankName: bank.bankName,
    bankCode: bank.bankCode,
    sellStatus: bit(index, 1),
    manualBuyUpiStatus: bit(index, 0),
    autoBuyUpiStatus: bit(index, 1),
    manualBuyBankStatus: bit(index, 0),
    autoBuyBankStatus: bit(index, 1),
    autoBuyStatus: bit(index, 0),
    fillUtr: bit(index, 1),
    forceGrantPermission: bit(index, 0),
    utrRequired: bit(index, 1),
    buyUpiMinAmount: index === 9 ? 0 : 100 + index * 50,
    buyUpiMaxAmount: index === 9 ? 0 : 5000 + index * 500,
    buyBankMinAmount: 200 + index * 20,
    buyBankMaxAmount: 8000 + index * 200,
    updateBy: 'prototype',
    updateTime: stamp(11, index, 0, -1),
    createTime: stamp(8, index, 0, -12),
  }))
  return fakeBanks
}

function seedAppLogs() {
  if (appLogs) return appLogs
  const types = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  appLogs = []
  let id = 1
  APP_UPI_BANKS.forEach((bank, bankIndex) => {
    types.forEach((type, typeIndex) => {
      appLogs!.push({
        id: id++,
        bankCode: bank.bankCode,
        controlSwitchType: type,
        newStatus: (bankIndex + typeIndex) % 2,
        remark: `${bank.bankName} switch ${type}`,
        updateBy: bankIndex % 2 === 0 ? 'prototype' : 'admin_li',
        createTime: stamp(8 + (typeIndex % 10), bankIndex, typeIndex),
      })
    })
  })
  nextAppLogId = id
  return appLogs
}

function seedFakeLogs() {
  if (fakeLogs) return fakeLogs
  const types = [1, 2, 3, 5, 6, 7, 8, 9]
  fakeLogs = []
  let id = 1
  APP_UPI_BANKS.forEach((bank, bankIndex) => {
    types.forEach((type, typeIndex) => {
      fakeLogs!.push({
        id: id++,
        bankCode: bank.bankCode,
        controlSwitchType: type,
        newStatus: (bankIndex + typeIndex) % 2,
        remark: `${bank.bankName} switch ${type}`,
        updateBy: 'prototype',
        createTime: stamp(9 + (typeIndex % 8), bankIndex + 5, typeIndex),
      })
    })
  })
  nextFakeLogId = id
  return fakeLogs
}

function filterLogs(rows: SwitchLog[], query: Record<string, any>) {
  return rows.filter((row) => {
    if (!sameValue(row.bankCode, query.bankCode)) return false
    if (!sameValue(row.controlSwitchType, query.controlSwitchType)) return false
    if (!inRange(row.createTime, query.createTimeStart, query.createTimeEnd)) return false
    return true
  })
}

export function buildAppBankListBody(raw: unknown) {
  const query = readQuery(raw)
  let rows = sortRows(seedAppBanks(), query, 'sort')
  if (hasFilter(query.bankCode)) rows = rows.filter((row) => row.bankCode === query.bankCode)
  const page = slicePage(rows, query)
  return arrayTotalBody(page, rows.length)
}

export function buildAppBankCodeListBody() {
  const codes = seedAppBanks().map((row) => row.bankCode)
  return { code: '1', msg: '操作成功', data: codes, success: true }
}

export function applyAppBankSave(raw: unknown, isEdit: boolean) {
  const query = readQuery(raw)
  const rows = seedAppBanks()
  if (isEdit) {
    const row = rows.find((item) => String(item.id) === String(query.id))
    if (row) {
      Object.assign(row, query, { updateBy: 'prototype', updateTime: nowStamp() })
    }
  } else {
    const bank = APP_UPI_BANKS.find((item) => item.bankCode === query.bankCode)
    rows.push({
      id: nextAppBankId++,
      sort: Number(query.sort) || rows.length + 1,
      bankName: String(query.bankName || ''),
      bankCode: String(query.bankCode || ''),
      iconUrl: bank ? appBankIcon(bank) : String(query.iconUrl || ''),
      sellStatus: Number(query.sellStatus ?? 0),
      supportsBuyAppeal: Number(query.supportsBuyAppeal ?? 0),
      supportsQuickWithdraw: Number(query.supportsQuickWithdraw ?? 1),
      supportsQuickWithdrawBank: Number(query.supportsQuickWithdrawBank ?? 1),
      supportPhonepeWakeUp: Number(query.supportPhonepeWakeUp ?? 0),
      supportsExternalAppeal: Number(query.supportsExternalAppeal ?? 0),
      supportsExternalSell: Number(query.supportsExternalSell ?? 0),
      supportLotteryTicket: Number(query.supportLotteryTicket ?? 0),
      supportsAutoTrade: Number(query.supportsAutoTrade ?? 0),
      allowMultiLogin: Number(query.allowMultiLogin ?? 0),
      needPinCode: Number(query.needPinCode ?? 0),
      otpLimitEnabled: Number(query.otpLimitEnabled ?? 0),
      otpHourlySuccessLimit: Number(query.otpHourlySuccessLimit ?? 0),
      otpDailyFailLimit: Number(query.otpDailyFailLimit ?? 0),
      externalIconUrl: String(query.externalIconUrl || (bank ? appBankIcon(bank) : '')),
      externalBackgroundUrl: String(query.externalBackgroundUrl || ''),
      upiMinAmount: Number(query.upiMinAmount ?? 0),
      upiMaxAmount: Number(query.upiMaxAmount ?? 0),
      bankMinAmount: Number(query.bankMinAmount ?? 0),
      bankMaxAmount: Number(query.bankMaxAmount ?? 0),
      sourceType: Number(query.sourceType ?? 1),
      updateBy: 'prototype',
      updateTime: nowStamp(),
      createTime: nowStamp(),
    })
  }
  return { ...success }
}

export function applyAppBankDelete(raw: unknown) {
  const query = readQuery(raw)
  const rows = seedAppBanks()
  const index = rows.findIndex((item) => String(item.id) === String(query.id))
  if (index >= 0) rows.splice(index, 1)
  return { ...success }
}

export function applyAppBankSwitch(raw: unknown) {
  const query = readQuery(raw)
  const row = seedAppBanks().find((item) => String(item.id) === String(query.id))
  const type = Number(query.controlSwitchType)
  const status = Number(query.status)
  if (row) {
    const field = APP_SWITCH_FIELD[type]
    if (field === 'bothTrade') {
      row.supportLotteryTicket = status
      row.supportsAutoTrade = status
    } else if (field) {
      row[field] = status as never
    }
    row.updateBy = 'prototype'
    row.updateTime = nowStamp()
  }
  seedAppLogs().unshift({
    id: nextAppLogId++,
    bankCode: row?.bankCode || String(query.bankCode || ''),
    controlSwitchType: type,
    newStatus: status,
    remark: String(query.remark || ''),
    updateBy: 'prototype',
    createTime: nowStamp(),
  })
  return { ...success }
}

export function buildAppBankLogBody(raw: unknown) {
  const query = readQuery(raw)
  const rows = filterLogs(seedAppLogs(), query)
  const page = slicePage(rows, query)
  return listBody(page, rows.length, 'createTime')
}

export function applyAppBankLogSave(raw: unknown) {
  const query = readQuery(raw)
  seedAppLogs().unshift({
    id: nextAppLogId++,
    bankCode: String(query.bankCode || ''),
    controlSwitchType: Number(query.controlSwitchType),
    newStatus: Number(query.newStatus),
    remark: String(query.remark || ''),
    updateBy: 'prototype',
    createTime: nowStamp(),
  })
  return { ...success }
}

export function buildFakeBankListBody(raw: unknown) {
  const query = readQuery(raw)
  let rows = sortRows(seedFakeBanks(), query, 'sort')
  if (hasFilter(query.bankCode)) rows = rows.filter((row) => row.bankCode === query.bankCode)
  const page = slicePage(rows, query)
  return arrayTotalBody(page, rows.length)
}

export function buildFakeBankCodeListBody() {
  return { code: '1', msg: '操作成功', data: seedFakeBanks().map((row) => row.bankCode), success: true }
}

export function applyFakeBankSave(raw: unknown, isEdit: boolean) {
  const query = readQuery(raw)
  const rows = seedFakeBanks()
  if (isEdit) {
    const row = rows.find((item) => String(item.id) === String(query.id))
    if (row) Object.assign(row, query, { updateBy: 'prototype', updateTime: nowStamp() })
  } else {
    rows.push({
      id: nextFakeBankId++,
      sort: Number(query.sort) || rows.length + 1,
      bankName: String(query.bankName || ''),
      bankCode: String(query.bankCode || ''),
      sellStatus: Number(query.sellStatus ?? 0),
      manualBuyUpiStatus: Number(query.manualBuyUpiStatus ?? 1),
      autoBuyUpiStatus: Number(query.autoBuyUpiStatus ?? 1),
      manualBuyBankStatus: Number(query.manualBuyBankStatus ?? 1),
      autoBuyBankStatus: Number(query.autoBuyBankStatus ?? 1),
      autoBuyStatus: Number(query.autoBuyStatus ?? 0),
      fillUtr: Number(query.fillUtr ?? 1),
      forceGrantPermission: Number(query.forceGrantPermission ?? 0),
      utrRequired: Number(query.utrRequired ?? 0),
      buyUpiMinAmount: Number(query.buyUpiMinAmount ?? 0),
      buyUpiMaxAmount: Number(query.buyUpiMaxAmount ?? 0),
      buyBankMinAmount: Number(query.buyBankMinAmount ?? 0),
      buyBankMaxAmount: Number(query.buyBankMaxAmount ?? 0),
      updateBy: 'prototype',
      updateTime: nowStamp(),
      createTime: nowStamp(),
    })
  }
  return { ...success }
}

export function applyFakeBankDelete(raw: unknown) {
  const query = readQuery(raw)
  const rows = seedFakeBanks()
  const index = rows.findIndex((item) => String(item.id) === String(query.id))
  if (index >= 0) rows.splice(index, 1)
  return { ...success }
}

export function applyFakeBankSwitch(raw: unknown) {
  const query = readQuery(raw)
  const row = seedFakeBanks().find((item) => String(item.id) === String(query.id))
  const type = Number(query.controlSwitchType)
  const status = Number(query.status)
  if (row) {
    const field = FAKE_SWITCH_FIELD[type]
    if (field) row[field] = status as never
    row.updateBy = 'prototype'
    row.updateTime = nowStamp()
  }
  seedFakeLogs().unshift({
    id: nextFakeLogId++,
    bankCode: row?.bankCode || String(query.bankCode || ''),
    controlSwitchType: type,
    newStatus: status,
    remark: String(query.remark || ''),
    updateBy: 'prototype',
    createTime: nowStamp(),
  })
  return { ...success }
}

export function buildFakeBankLogBody(raw: unknown) {
  const query = readQuery(raw)
  const rows = filterLogs(seedFakeLogs(), query)
  const page = slicePage(rows, query)
  return listBody(page, rows.length, 'createTime')
}

type MemberAppRow = {
  id: number
  appId: string
  memberId: number
  phoneNumber: string
  upiId: string
  bankCode: string
  bankIconUrl: string
  balance: number
  linkStatus: number
  grantedPermissions: number
  autoBuyEnabled: number
  autoSellEnabled: number
  deleted: number
  scheduledAutoSellEnabled: number
  createTime: string
  lastLinkTime: string
  autoBuyEnabledTime: string
  autoSellEnabledTime: string
  banRule: number
  updateBy: string
  disableFlag: number
}

let memberApps: MemberAppRow[] | null = null

function seedMemberApps() {
  if (memberApps) return memberApps
  const members = listMembers()
  memberApps = APP_UPI_BANKS.map((bank, index) => {
    const member = members[index]
    const phone = member?.mobileNumber || `91000010${String(index + 1).padStart(2, '0')}`
    const local = phone.slice(-4)
    return {
      id: 2001 + index,
      appId: String(86001 + index),
      memberId: member?.id || 10086001 + index,
      phoneNumber: phone,
      upiId: `${local}${bank.upiSuffix}`,
      bankCode: bank.bankCode,
      bankIconUrl: appBankIcon(bank),
      balance: [1280.5, 0, 640, 3200, 88.25, 1500, 76, 990, 2400, 15.5][index],
      linkStatus: bit(index, 0),
      grantedPermissions: bit(index, 1),
      autoBuyEnabled: bit(index, 0),
      autoSellEnabled: bit(index, 1),
      deleted: index % 3,
      scheduledAutoSellEnabled: bit(index, 1),
      createTime: stamp(8, index, 10),
      lastLinkTime: stamp(12, index, 20),
      autoBuyEnabledTime: bit(index, 0) ? stamp(13, index, 0) : '',
      autoSellEnabledTime: bit(index, 1) ? stamp(14, index, 0) : '',
      banRule: index % 2,
      updateBy: 'prototype',
      disableFlag: 0,
    }
  })
  return memberApps
}

export function buildMemberAppListBody(raw: unknown) {
  const query = readQuery(raw)
  const rows = seedMemberApps().filter((row) => {
    if (!includesText(row.appId, query.appId)) return false
    if (!includesText(row.memberId, query.memberId)) return false
    if (!includesText(row.phoneNumber, query.phoneNumber)) return false
    if (!includesText(row.upiId, query.upiId)) return false
    if (!sameValue(row.bankCode, query.bankCode)) return false
    if (!sameValue(row.linkStatus, query.linkStatus)) return false
    if (!sameValue(row.grantedPermissions, query.grantedPermissions)) return false
    if (!sameValue(row.autoSellEnabled, query.autoSellEnabled)) return false
    if (!sameValue(row.autoBuyEnabled, query.autoBuyEnabled)) return false
    if (!sameValue(row.deleted, query.deleted)) return false
    if (!sameValue(row.banRule, query.banRule)) return false
    if (!inRange(row.createTime, query.createTimeStart, query.createTimeEnd)) return false
    if (!inRange(row.lastLinkTime, query.lastLinkTimeStart, query.lastLinkTimeEnd)) return false
    if (!inRange(row.autoBuyEnabledTime, query.autoBuyEnabledTimeStart, query.autoBuyEnabledTimeEnd)) return false
    if (!inRange(row.autoSellEnabledTime, query.autoSellEnabledTimeStart, query.autoSellEnabledTimeEnd)) return false
    return true
  })
  const page = slicePage(rows, query)
  const sum = (list: MemberAppRow[]) => list.reduce((total, row) => total + Number(row.balance || 0), 0)
  return listBody(page, rows.length, 'createTime', {
    balancePageTotal: sum(page),
    balanceTotal: sum(rows),
  })
}

export function applyBanMemberApp(raw: unknown) {
  const query = readQuery(raw)
  const row = seedMemberApps().find((item) => String(item.appId) === String(query.appId))
  if (row) {
    row.banRule = Number(query.banRule ?? 0)
    row.deleted = 1
    row.disableFlag = 1
    row.updateBy = 'prototype'
    if (Number(query.banRule) === 1) {
      seedBlacklist().unshift({
        id: nextBanId++,
        bankCode: row.bankCode,
        phoneNumber: row.phoneNumber,
        unbanFlag: 0,
        createTime: nowStamp(),
        unbanTime: '',
        remark: '解除绑定，并拉黑手机号',
        updateBy: 'prototype',
        createBy: 'prototype',
      })
    }
  }
  return { ...success }
}

export function applyScheduledAutoSell(raw: unknown) {
  const query = readQuery(raw)
  const row = seedMemberApps().find((item) => String(item.appId) === String(query.newKycId))
  if (row) row.scheduledAutoSellEnabled = Number(query.enabled)
  return { ...success }
}

type BehaviorRow = {
  id: number
  appId: string
  behaviorType: number
  operationTime: string
  httpCode: number
  responseBody: string
  remark: string
  success: number
}

let behaviors: BehaviorRow[] | null = null

function seedBehaviors() {
  if (behaviors) return behaviors
  const remarks = ['建立银行会话', '会话断开', '刷新访问令牌', '卸载应用']
  behaviors = []
  let id = 1
  seedMemberApps().forEach((app, appIndex) => {
    ;[1, 2, 3, 4].forEach((type) => {
      behaviors!.push({
        id: id++,
        appId: app.appId,
        behaviorType: type,
        operationTime: stamp(15, appIndex, type),
        httpCode: type === 2 ? 500 : 200,
        responseBody: type === 2 ? '{"code":"0","msg":"disconnected"}' : '{"code":"1","msg":"ok"}',
        remark: remarks[type - 1],
        success: type === 2 ? 0 : 1,
      })
    })
  })
  return behaviors
}

export function buildBehaviorLogBody(raw: unknown) {
  const query = readQuery(raw)
  const rows = seedBehaviors().filter((row) => {
    if (hasFilter(query.appId) && String(row.appId) !== String(query.appId)) return false
    if (!sameValue(row.behaviorType, query.behaviorType)) return false
    if (!inRange(row.operationTime, query.operationTimeStart, query.operationTimeEnd)) return false
    return true
  })
  const page = slicePage(rows, query)
  return listBody(page, rows.length, 'operationTime')
}

type CollectRow = {
  id: number
  memberId: number
  deviceId: string
  mobile: string
  personalName: string
  bankName: string
  bankCode: string
  deviceModel: string
  netType: string
  longitude: string
  latitude: string
  contactCount: number
  contactLog: number
  albumSize: string
  smsCount: number
  updateTime: string
}

let collects: CollectRow[] | null = null

function seedCollects() {
  if (collects) return collects
  const members = listMembers()
  collects = APP_UPI_BANKS.map((bank, index) => {
    const member = members[index]
    const place = PLACES[index]
    return {
      id: 3001 + index,
      memberId: member?.id || 10086001 + index,
      deviceId: `dev-${member?.id || 10086001 + index}`,
      mobile: member?.mobileNumber || `91000010${String(index + 1).padStart(2, '0')}`,
      personalName: NAMES[index],
      bankName: bank.bankName,
      bankCode: bank.bankCode,
      deviceModel: DEVICES[index],
      netType: NETS[index % NETS.length],
      longitude: place.longitude,
      latitude: place.latitude,
      contactCount: 20 + index * 7,
      contactLog: 3 + index,
      albumSize: `${12 + index * 3} MB`,
      smsCount: 4 + index,
      updateTime: stamp(16, index, 30),
    }
  })
  return collects
}

export function buildAppCollectListBody(raw: unknown) {
  const query = readQuery(raw)
  const rows = seedCollects().filter((row) => {
    if (!includesText(row.bankName, query.bankName)) return false
    if (!includesText(row.deviceId, query.deviceId)) return false
    if (!includesText(row.memberId, query.memberId)) return false
    if (!includesText(row.mobile, query.mobile)) return false
    if (!inRange(row.updateTime, query.updateTimeStart, query.updateTimeEnd)) return false
    return true
  })
  const page = slicePage(rows, query)
  return listBody(page, rows.length, 'updateTime')
}

type SmsRow = {
  id: number
  memberId: number
  deviceId: string
  content: string
  receiveTime: string
  sendMobileNumber: string
}

let smsRows: SmsRow[] | null = null

function seedSms() {
  if (smsRows) return smsRows
  smsRows = []
  let id = 1
  seedCollects().forEach((row, index) => {
    const bank = APP_UPI_BANKS[index]
    smsRows!.push(
      {
        id: id++,
        memberId: row.memberId,
        deviceId: row.deviceId,
        content: `${bank.bankName}: Rs.${100 + index * 25} credited to your account. UPI Ref ${860000 + index}`,
        receiveTime: stamp(17, index, 5),
        sendMobileNumber: 'VK-UPIBNK',
      },
      {
        id: id++,
        memberId: row.memberId,
        deviceId: row.deviceId,
        content: `${bank.bankName}: OTP 48${String(index).padStart(2, '0')}19 for UPI login. Do not share.`,
        receiveTime: stamp(17, index, 40),
        sendMobileNumber: 'VM-PAYOTP',
      },
    )
  })
  return smsRows
}

export function buildAppSmsListBody(raw: unknown) {
  const query = readQuery(raw)
  const rows = seedSms().filter((row) => {
    if (hasFilter(query.memberId) && String(row.memberId) !== String(query.memberId)) return false
    if (hasFilter(query.deviceId) && String(row.deviceId) !== String(query.deviceId)) return false
    if (!includesText(row.sendMobileNumber, query.sendMobileNumber)) return false
    if (!includesText(row.content, query.content)) return false
    if (!inRange(row.receiveTime, query.receiveTimeStart, query.receiveTimeEnd)) return false
    return true
  })
  const page = slicePage(rows, query)
  return listBody(page, rows.length, 'receiveTime')
}

type BanRow = {
  id: number
  bankCode: string
  phoneNumber: string
  unbanFlag: number
  createTime: string
  unbanTime: string
  remark: string
  updateBy: string
  createBy: string
}

let bans: BanRow[] | null = null
let nextBanId = 4011

function seedBlacklist() {
  if (bans) return bans
  const members = listMembers()
  bans = APP_UPI_BANKS.slice(0, 6).map((bank, index) => {
    const member = members[index]
    const unbanned = index >= 4
    return {
      id: 4001 + index,
      bankCode: bank.bankCode,
      phoneNumber: member?.mobileNumber || `91000010${String(index + 1).padStart(2, '0')}`,
      unbanFlag: unbanned ? 1 : 0,
      createTime: stamp(7, index, 0, -2),
      unbanTime: unbanned ? stamp(18, index, 0, -1) : '',
      remark: unbanned ? '已人工解禁' : '登录失败次数过多',
      updateBy: unbanned ? 'admin_li' : 'system',
      createBy: 'system',
    }
  })
  return bans
}

export function buildBlacklistBody(raw: unknown) {
  const query = readQuery(raw)
  const rows = seedBlacklist().filter((row) => {
    if (!sameValue(row.bankCode, query.bankCode)) return false
    if (!includesText(row.phoneNumber, query.phoneNumber)) return false
    return true
  })
  const page = slicePage(rows, query)
  return listBody(page, rows.length, 'createTime')
}

export function applyUnban(raw: unknown) {
  const query = readQuery(raw)
  const row = seedBlacklist().find((item) => String(item.id) === String(query.banRecordId))
  if (row && row.unbanFlag === 0) {
    row.unbanFlag = 1
    row.unbanTime = nowStamp()
    row.remark = String(query.remark || row.remark)
    row.updateBy = 'prototype'
  }
  return { ...success }
}

const LOGIN_ERRORS = [
  { reason: 1, code: 'INVALID_REQUEST', klass: 'InvalidRequestException', message: 'request body is empty' },
  { reason: 2, code: 'INVALID_DATA', klass: 'InvalidDataException', message: 'upi id format is invalid' },
  { reason: 3, code: 'PHONE_BOUND', klass: 'PhoneBoundException', message: 'phone already bound by another member' },
  { reason: 4, code: 'RATE_LIMITED', klass: 'RateLimitException', message: 'too many login attempts' },
  { reason: 5, code: 'LOCK_FAILED', klass: 'LockAcquisitionException', message: 'could not acquire login lock' },
  { reason: 6, code: 'TOKEN_UPLOAD', klass: 'TokenUploadException', message: 'token upload returned empty' },
  { reason: 7, code: 'BUSINESS', klass: 'BusinessException', message: 'bank rejected the session' },
  { reason: 8, code: 'SYSTEM', klass: 'SystemException', message: 'unexpected null from bank gateway' },
]

type LoginFailRow = {
  id: number
  memberId: number
  bankCode: string
  phoneNumber: string
  loginStage: number
  errorCode: string
  exceptionClass: string
  exceptionMessage: string
  exceptionStackTrace: string
  failureDetail: string
  failureReason: number
  createTime: string
}

let loginFails: LoginFailRow[] | null = null

function seedLoginFails() {
  if (loginFails) return loginFails
  const members = listMembers()
  loginFails = []
  let id = 1
  LOGIN_ERRORS.forEach((item, index) => {
    ;[1, 2].forEach((stage) => {
      const bank = APP_UPI_BANKS[(index + stage) % APP_UPI_BANKS.length]
      const member = members[index % members.length]
      loginFails!.push({
        id: id++,
        memberId: member?.id || 10086001,
        bankCode: bank.bankCode,
        phoneNumber: member?.mobileNumber || '9100001001',
        loginStage: stage,
        errorCode: item.code,
        exceptionClass: `com.arb.app.bank.${item.klass}`,
        exceptionMessage: item.message,
        exceptionStackTrace: `${item.klass}: ${item.message}\n  at BankLogin.${stage === 1 ? 'beforeLogin' : 'uploadToken'}(${bank.packageName})`,
        failureDetail: `${bank.bankName} stage ${stage}`,
        failureReason: item.reason,
        createTime: stamp(6 + index, stage * 10, index),
      })
    })
  })
  return loginFails
}

export function buildLoginFailBody(raw: unknown) {
  const query = readQuery(raw)
  const rows = seedLoginFails().filter((row) => {
    if (!includesText(row.memberId, query.memberId)) return false
    if (!sameValue(row.bankCode, query.bankCode)) return false
    if (!includesText(row.phoneNumber, query.phoneNumber)) return false
    if (!sameValue(row.loginStage, query.loginStage)) return false
    if (!includesText(row.errorCode, query.errorCode)) return false
    if (!includesText(row.exceptionClass, query.exceptionClass)) return false
    if (!sameValue(row.failureReason, query.failureReason)) return false
    if (!inRange(row.createTime, query.createTimeStart, query.createTimeEnd)) return false
    return true
  })
  const page = slicePage(rows, query)
  return listBody(page, rows.length, 'createTime')
}
