import { listMembers } from './memberList'

// 会员短信 / 操作 / 登录日志、手动操作记录、会员解绑记录。
// 字段说明见 notes/field-notes.md §11～§15。
// 这些页默认按「当天」筛时间，种子时间用印度时区当天，和页面 getStartAndEndOfDay 一致。

const DEVICES = ['iOS', 'Android', 'Windows Chrome', 'H5 Safari']

/** 与 operationlog.vue typeMap 的 1～41 一一对应 */
const OPERATION_PATHS = [
  '/app/buy/create',
  '/app/usdt/buy/create',
  '/app/usdt/transfer/complete',
  '/app/buy/pay/complete',
  '/app/buy/cancel',
  '/app/buy/pay/cancel',
  '/app/buy/appeal',
  '/app/realname/submit',
  '/app/sms/verify',
  '/app/mobile/change',
  '/app/email/change',
  '/app/kyc/add',
  '/app/collection/enable',
  '/app/collection/disable',
  '/app/collection/delete',
  '/app/profile/avatar',
  '/app/profile/nickname',
  '/app/paypwd/create',
  '/app/paypwd/update',
  '/app/paypwd/forget',
  '/app/sell/create',
  '/app/sell/confirm',
  '/app/sell/cancel',
  '/app/match/continue',
  '/app/amount/error/submit',
  '/app/amount/error/cancel',
  '/app/sell/appeal',
  '/app/register/mobile',
  '/app/register/email',
  '/app/password/forget',
  '/app/sms/send',
  '/app/email/send',
  '/app/collection/default',
  '/app/activity/reward',
  '/app/guide/finish',
  '/app/buy/quick',
  '/app/match/cancel',
  '/app/sell/release',
  '/app/sell/precheck',
  '/app/usdt/sell/create',
  '/app/usdt/receive/add',
]

function readQuery(raw: unknown): Record<string, any> {
  if (!raw) return {}
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      if (raw.includes('=')) {
        const out: Record<string, any> = {}
        new URLSearchParams(raw).forEach((value, key) => {
          out[key] = value
        })
        return out
      }
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
  return String(source ?? '')
    .toLowerCase()
    .includes(String(keyword).trim().toLowerCase())
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

function listBody(page: Array<Record<string, any>>, total: number, timeKey: string) {
  const last = page[page.length - 1]
  const first = page[0]
  return {
    code: '1',
    msg: '操作成功',
    data: page,
    total,
    extend: {
      nextColValue: last ? String(last[timeKey] ?? '') : '',
      nextCursorId: last ? String(last.id) : '',
      prevColValue: first ? String(first[timeKey] ?? '') : '',
      prevCursorId: first ? String(first.id) : '',
    },
    success: true,
  }
}

function slicePage<T>(list: T[], query: Record<string, any>, pageSizeDefault: number) {
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || pageSizeDefault
  const start = (pageNo - 1) * pageSize
  return list.slice(start, start + pageSize)
}

type SmsRow = {
  id: number
  codeType: 'SMS' | 'EMAIL'
  receiver: string
  verificationCode: string
  sendTime: string
  expirationTime: string
  ipAddress: string
  device: string
  loginClient: 'APP' | 'H5'
}

let smsRows: SmsRow[] | null = null

function seedSms() {
  if (smsRows) return smsRows
  const members = listMembers()
  const phone = members.find((item) => item.mobileNumber)?.mobileNumber || '9100001001'
  const email = members.find((item) => item.emailAccount)?.emailAccount || 'proto01@example.com'
  const phone2 = members.filter((item) => item.mobileNumber)[1]?.mobileNumber || '9100001002'
  const email2 = members.filter((item) => item.emailAccount)[1]?.emailAccount || 'proto02@example.com'
  // codeType SMS/EMAIL × loginClient APP/H5
  const specs: Array<Omit<SmsRow, 'id'>> = [
    {
      codeType: 'SMS',
      receiver: phone,
      verificationCode: '482913',
      sendTime: stamp(9, 5, 12),
      expirationTime: stamp(9, 15, 12),
      ipAddress: '103.21.44.18',
      device: 'Android',
      loginClient: 'APP',
    },
    {
      codeType: 'SMS',
      receiver: phone2,
      verificationCode: '110286',
      sendTime: stamp(11, 22, 40),
      expirationTime: stamp(11, 32, 40),
      ipAddress: '49.36.120.7',
      device: 'H5 Safari',
      loginClient: 'H5',
    },
    {
      codeType: 'EMAIL',
      receiver: email,
      verificationCode: '903144',
      sendTime: stamp(14, 8, 3),
      expirationTime: stamp(14, 18, 3),
      ipAddress: '18.220.16.90',
      device: 'iOS',
      loginClient: 'APP',
    },
    {
      codeType: 'EMAIL',
      receiver: email2,
      verificationCode: '667201',
      sendTime: stamp(16, 41, 55),
      expirationTime: stamp(16, 51, 55),
      ipAddress: '122.168.9.44',
      device: 'Windows Chrome',
      loginClient: 'H5',
    },
  ]
  smsRows = specs.map((item, index) => ({ id: 710001 + index, ...item }))
  smsRows.sort((a, b) => (a.sendTime < b.sendTime ? 1 : -1))
  return smsRows
}

export function buildSmsLogListBody(raw: unknown) {
  const query = readQuery(raw)
  const filtered = seedSms().filter((row) => {
    if (!sameValue(row.codeType, query.type)) return false
    if (!includesText(row.receiver, query.receiver)) return false
    if (!sameValue(row.loginClient, query.loginClient)) return false
    if (!inRange(row.sendTime, query.startTime, query.endTime)) return false
    return true
  })
  const page = slicePage(filtered, query, 50)
  return listBody(page, filtered.length, 'sendTime')
}

type OperationRow = {
  id: number
  memberId: number
  username: string
  moduleCode: number
  operationPath: string
  ipAddress: string
  response: string
  operationTime: string
  device: string
}

let operationRows: OperationRow[] | null = null

function seedOperation() {
  if (operationRows) return operationRows
  const members = listMembers()
  operationRows = OPERATION_PATHS.map((operationPath, index) => {
    const member = members[index % members.length]
    const code = index + 1
    const ok = code % 7 !== 0
    return {
      id: 720001 + index,
      memberId: member.id,
      username: member.memberAccount,
      moduleCode: code,
      operationPath,
      ipAddress: `103.21.${(index % 20) + 1}.${(index % 200) + 10}`,
      response: ok ? '{"code":"1","msg":"操作成功"}' : '{"code":"0","msg":"操作失败"}',
      operationTime: stamp(8 + Math.floor(index / 6), (index * 7) % 60, index % 50),
      device: DEVICES[index % DEVICES.length],
    }
  })
  operationRows.sort((a, b) => (a.operationTime < b.operationTime ? 1 : -1))
  return operationRows
}

export function buildOperationLogListBody(raw: unknown) {
  const query = readQuery(raw)
  const filtered = seedOperation().filter((row) => {
    if (hasFilter(query.userId) && String(row.memberId) !== String(query.userId).trim()) return false
    if (!sameValue(row.moduleCode, query.opModule)) return false
    if (!includesText(row.ipAddress, query.loginIp)) return false
    if (!inRange(row.operationTime, query.startTime, query.endTime)) return false
    return true
  })
  const page = slicePage(filtered, query, 50)
  return listBody(page, filtered.length, 'operationTime')
}

type LoginRow = {
  id: number
  memberId: number
  username: string
  memberType: 1 | 2 | 3 | 4
  authenticationMode: 1 | 2
  loginStatus: '1' | '0'
  ipAddress: string
  loginTime: string
  device: string
}

let loginRows: LoginRow[] | null = null

function seedLogin() {
  if (loginRows) return loginRows
  const members = listMembers()
  const byType = (type: number) => members.find((item) => item.memberType === type) || members[0]
  // 会员类型 1～4 × 登录成功/失败；登录模式 1/2 穿插
  const specs: Array<{ memberType: 1 | 2 | 3 | 4; loginStatus: '1' | '0'; authenticationMode: 1 | 2; hour: number }> = [
    { memberType: 1, loginStatus: '1', authenticationMode: 1, hour: 8 },
    { memberType: 1, loginStatus: '0', authenticationMode: 2, hour: 9 },
    { memberType: 2, loginStatus: '1', authenticationMode: 2, hour: 10 },
    { memberType: 2, loginStatus: '0', authenticationMode: 1, hour: 11 },
    { memberType: 3, loginStatus: '1', authenticationMode: 1, hour: 13 },
    { memberType: 3, loginStatus: '0', authenticationMode: 2, hour: 15 },
    { memberType: 4, loginStatus: '1', authenticationMode: 2, hour: 17 },
    { memberType: 4, loginStatus: '0', authenticationMode: 1, hour: 19 },
  ]
  loginRows = specs.map((item, index) => {
    const member = byType(item.memberType)
    return {
      id: 730001 + index,
      memberId: member.id,
      username: member.memberAccount,
      memberType: item.memberType,
      authenticationMode: item.authenticationMode,
      loginStatus: item.loginStatus,
      ipAddress: `49.36.${20 + index}.1${index}`,
      loginTime: stamp(item.hour, 10 + index, 8),
      device: DEVICES[index % DEVICES.length],
    }
  })
  loginRows.sort((a, b) => (a.loginTime < b.loginTime ? 1 : -1))
  return loginRows
}

export function buildLoginLogListBody(raw: unknown) {
  const query = readQuery(raw)
  const filtered = seedLogin().filter((row) => {
    if (hasFilter(query.userId) && String(row.memberId) !== String(query.userId).trim()) return false
    if (!sameValue(row.authenticationMode, query.type)) return false
    if (!includesText(row.username, query.memberAccount)) return false
    if (!includesText(row.ipAddress, query.loginIp)) return false
    if (!inRange(row.loginTime, query.startTime, query.endTime)) return false
    return true
  })
  const page = slicePage(filtered, query, 50)
  return listBody(page, filtered.length, 'loginTime')
}

type ManualRow = {
  id: number
  memberId: number
  opType: 1 | 2 | 3 | 4
  amount: number
  createBy: string
  updateTime: string
  remark: string
}

let manualRows: ManualRow[] | null = null

function seedManual() {
  if (manualRows) return manualRows
  const members = listMembers()
  const remarks = ['人工上分', '人工下分', '人工冻结', '人工解冻']
  const operators = ['prototype', 'admin_li']
  const amounts = [500, 1200, 80, 300, 2600, 450, 150, 900]
  // opType 1 上分 / 2 下分 / 3 冻结 / 4 解冻，各 2 条
  manualRows = amounts.map((amount, index) => {
    const member = members[index % members.length]
    const opType = ((index % 4) + 1) as 1 | 2 | 3 | 4
    return {
      id: 740001 + index,
      memberId: member.id,
      opType,
      amount,
      createBy: operators[index < 4 ? 0 : 1],
      updateTime: stamp(9 + index, 6, 20),
      remark: `${remarks[opType - 1]}｜${member.memberAccount}`,
    }
  })
  manualRows.sort((a, b) => (a.updateTime < b.updateTime ? 1 : -1))
  return manualRows
}

export function buildManualLogListBody(raw: unknown) {
  const query = readQuery(raw)
  const opType = query.opType ?? query.optype
  const filtered = seedManual().filter((row) => {
    if (!sameValue(row.opType, opType)) return false
    if (!includesText(row.createBy, query.createBy)) return false
    if (!inRange(row.updateTime, query.startTime, query.endTime)) return false
    return true
  })
  const asc = query.asc === true || query.asc === 'true'
  if (query.column === 'amount') {
    filtered.sort((a, b) => (asc ? a.amount - b.amount : b.amount - a.amount))
  }
  const page = slicePage(filtered, query, 20)
  return listBody(page, filtered.length, 'updateTime')
}

type UnbindRow = {
  id: number
  memberId: number
  merchantCode: string
  merchantMemberId: string
  operateIp: string
  operateBy: string
  unbindFlag: 0 | 1
  bindTime: string
  updateTime: string
  remark: string
}

let unbindRows: UnbindRow[] | null = null

function seedUnbind() {
  if (unbindRows) return unbindRows
  const bindings: Array<{ memberId: number; merchantCode: string; merchantMemberId: string; account: string }> = []
  listMembers().forEach((member) => {
    member.bindMerchantInfoDTOS?.forEach((item) => {
      if (bindings.length >= 6) return
      bindings.push({
        memberId: member.id,
        merchantCode: item.merchantCode,
        merchantMemberId: item.merchantMemberId,
        account: member.memberAccount,
      })
    })
  })
  unbindRows = bindings.map((item, index) => {
    const unbindFlag: 0 | 1 = index % 2 === 0 ? 1 : 0
    return {
      id: 750001 + index,
      memberId: item.memberId,
      merchantCode: item.merchantCode,
      merchantMemberId: item.merchantMemberId,
      operateIp: `122.168.${10 + index}.${20 + index}`,
      operateBy: unbindFlag === 1 ? item.account : 'system',
      unbindFlag,
      bindTime: stamp(10, 0, 0, -3 - index),
      updateTime: stamp(10 + index, 18, 6),
      remark: unbindFlag === 1 ? '会员自行解绑商户' : '系统自动解绑商户',
    }
  })
  unbindRows.sort((a, b) => (a.updateTime < b.updateTime ? 1 : -1))
  return unbindRows
}

export function buildUnbindLogListBody(raw: unknown) {
  const query = readQuery(raw)
  const filtered = seedUnbind().filter((row) => {
    if (!includesText(row.memberId, query.memberId)) return false
    if (!includesText(row.merchantCode, query.merchantCode)) return false
    if (!sameValue(row.unbindFlag, query.unbindFlag)) return false
    if (!inRange(row.bindTime, query.bindTimeStart, query.bindTimeEnd)) return false
    if (!inRange(row.updateTime, query.createTimeStart, query.createTimeEnd)) return false
    return true
  })
  const page = slicePage(filtered, query, 20)
  return listBody(page, filtered.length, 'updateTime')
}
