// 会员收款列表「连接日志」「操作日志」「行为」拉取流水。字段说明见 notes/field-notes.md §5。
// 变更原因枚举与 publicData.kycLinkStatusChangeReasonMap 保持同键。

/** 与 kycLinkStatusChangeReasonMap 键一一对应 */
const CONNECT_REASON_KEYS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 26, 27, 28, 30,
] as const

/** 文案含「断连」的原因 → 变更状态用断开(2)，其余用连接(1) */
const DISCONNECT_REASONS = new Set([12, 13, 14, 15, 21, 22, 23, 24])

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
  if (typeof URLSearchParams !== 'undefined' && raw instanceof URLSearchParams) {
    const out: Record<string, any> = {}
    raw.forEach((value, key) => {
      out[key] = value
    })
    return out
  }
  return raw as Record<string, any>
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function stampFromIndex(index: number) {
  // 从 11-10 往前铺，避免日期越界
  const day = 10 - Math.floor(index / 8)
  const hour = 8 + (index % 8)
  const minute = (index * 7) % 60
  return `2026-11-${pad2(Math.max(1, day))} ${pad2(hour)}:${pad2(minute)}:00`
}

function hashKey(text: string) {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0
  return h
}

export interface ConnectLogRow {
  id: number
  bankCode: string
  phoneNumber: string
  memberId: number
  kycLinkStatusChangeType: number
  kycLinkStatusChangeSource: number
  kycLinkStatusChangeReason: number
  operationTime: string
  connectionUuid: string
  restResults: Array<{
    httpCode: number
    responseBody: string
    remark: string
    success: number
  }>
}

export interface OperationLogRow {
  id: number
  upiId: string
  operationTime: string
  operationContent: number
  createdBy: string
  remark: string
  disableTimes: number
}

export interface PullResultRow {
  id: number
  connectionUuid: string
  kycId: number
  bankCode: string
  phoneNumber: string
  memberId: number
  changeType: number
  operationTime: string
  restResults: Array<{
    httpCode: number
    responseBody: string
    remark: string
    success: number
  }>
}

const connectByKey = new Map<string, ConnectLogRow[]>()
const operationByUpi = new Map<string, OperationLogRow[]>()
const pullByUuid = new Map<string, PullResultRow[]>()
let nextConnectId = 81000001
let nextOperationId = 82000001
let nextPullId = 83000001

const operators = ['prototype', 'admin01', 'ops.li', 'risk.wang']
const pullChangeTypes = [16, 17, 18]

function connectKey(bankCode: string, phoneNumber: string) {
  return `${bankCode || ''}|${phoneNumber || ''}`
}

function seedPullResults(
  connectionUuid: string,
  bankCode: string,
  phoneNumber: string,
  memberId: number,
  reasonIndex: number,
): PullResultRow[] {
  const list: PullResultRow[] = []
  // 每条连接行为给 2～3 条流水，覆盖三种 changeType
  const count = 2 + (reasonIndex % 2)
  for (let i = 0; i < count; i++) {
    const ok = i !== count - 1 || reasonIndex % 5 !== 0
    const changeType = pullChangeTypes[i % pullChangeTypes.length]
    list.push({
      id: nextPullId++,
      connectionUuid,
      kycId: 70010000 + (memberId % 1000) * 10 + reasonIndex,
      bankCode,
      phoneNumber,
      memberId,
      changeType,
      operationTime: stampFromIndex(reasonIndex * 3 + i),
      restResults: [
        {
          httpCode: ok ? 200 : 502,
          responseBody: ok
            ? `{"code":"1","changeType":${changeType},"uuid":"${connectionUuid}"}`
            : `{"code":"0","msg":"pull failed"}`,
          remark: ok ? '拉取流水成功' : '拉取流水失败',
          success: ok ? 1 : 0,
        },
      ],
    })
  }
  return list
}

function seedConnectLogs(bankCode: string, phoneNumber: string): ConnectLogRow[] {
  const seed = hashKey(connectKey(bankCode, phoneNumber))
  const memberId = 10086001 + (seed % 16)
  const list: ConnectLogRow[] = []

  CONNECT_REASON_KEYS.forEach((reason, index) => {
    const isDisconnect = DISCONNECT_REASONS.has(reason)
    const isConnect = !isDisconnect
    const ok = index % 7 !== 6
    const connectionUuid = `conn-${bankCode || 'NA'}-${phoneNumber || 'NA'}-r${reason}`
    const row: ConnectLogRow = {
      id: nextConnectId++,
      bankCode,
      phoneNumber,
      memberId,
      kycLinkStatusChangeType: isConnect ? 1 : 2,
      kycLinkStatusChangeSource: (seed + index) % 2 === 0 ? 1 : 2,
      kycLinkStatusChangeReason: reason,
      operationTime: stampFromIndex(index),
      connectionUuid,
      restResults: isConnect
        ? [
            {
              httpCode: ok ? 200 : 500,
              responseBody: ok
                ? `{"code":"1","msg":"ok","reason":${reason},"bank":"${bankCode}"}`
                : `{"code":"0","msg":"timeout","reason":${reason}}`,
              remark: ok ? '连接成功' : '银行接口超时',
              success: ok ? 1 : 0,
            },
          ]
        : [],
    }
    list.push(row)
    // 仅「连接」行有「行为」按钮，为其铺拉取流水
    if (isConnect) {
      pullByUuid.set(connectionUuid, seedPullResults(connectionUuid, bankCode, phoneNumber, memberId, index))
    }
  })

  return list
}

function seedOperationLogs(upiId: string): OperationLogRow[] {
  const seed = hashKey(upiId || 'empty')
  const list: OperationLogRow[] = [
    {
      id: nextOperationId++,
      upiId,
      operationTime: stampFromIndex(0),
      operationContent: 0,
      createdBy: operators[seed % operators.length],
      remark: '原型：新增收款信息',
      disableTimes: 0,
    },
    {
      id: nextOperationId++,
      upiId,
      operationTime: stampFromIndex(2),
      operationContent: 1,
      createdBy: operators[(seed + 1) % operators.length],
      remark: '原型：修改 UPI / 手机号',
      disableTimes: 0,
    },
    {
      id: nextOperationId++,
      upiId,
      operationTime: stampFromIndex(4),
      operationContent: 4,
      createdBy: operators[(seed + 2) % operators.length],
      remark: '原型：禁用收款',
      disableTimes: seed % 2 === 0 ? 0 : 60,
    },
    {
      id: nextOperationId++,
      upiId,
      operationTime: stampFromIndex(5),
      operationContent: 5,
      createdBy: operators[(seed + 3) % operators.length],
      remark: '原型：重新启用',
      disableTimes: 0,
    },
  ]
  if (seed % 3 === 0) {
    list.push({
      id: nextOperationId++,
      upiId,
      operationTime: stampFromIndex(6),
      operationContent: 1,
      createdBy: 'prototype',
      remark: '',
      disableTimes: 0,
    })
  }
  return list
}

function ensureConnect(bankCode: string, phoneNumber: string) {
  const key = connectKey(bankCode, phoneNumber)
  if (!connectByKey.has(key)) connectByKey.set(key, seedConnectLogs(bankCode, phoneNumber))
  return connectByKey.get(key)!
}

function ensureOperation(upiId: string) {
  if (!operationByUpi.has(upiId)) operationByUpi.set(upiId, seedOperationLogs(upiId))
  return operationByUpi.get(upiId)!
}

function ensurePull(connectionUuid: string) {
  if (!pullByUuid.has(connectionUuid)) {
    // 兜底：未知 uuid 也给几条，避免空弹窗
    pullByUuid.set(
      connectionUuid,
      seedPullResults(connectionUuid, 'SBI', '9800000000', 10086001, hashKey(connectionUuid) % 24),
    )
  }
  return pullByUuid.get(connectionUuid)!
}

function matchTimeRange(value: string, start?: string, end?: string) {
  if (!value) return !(start || end)
  if (start && value < start) return false
  if (end && value > end) return false
  return true
}

function paginate<T>(list: T[], pageNo: number, pageSize: number) {
  const no = Math.max(1, pageNo || 1)
  const size = Math.max(1, pageSize || 20)
  const start = (no - 1) * size
  return {
    data: list.slice(start, start + size),
    total: list.length,
  }
}

/** KYC 连接日志：POST /kycLinkStatusLogAdmin/listPage */
export function buildKycConnectLogListBody(raw: unknown) {
  const query = readQuery(raw)
  const bankCode = String(query.bankCode || '')
  const phoneNumber = String(query.phoneNumber || '')
  let list = ensureConnect(bankCode, phoneNumber).map((row) => ({
    ...row,
    restResults: row.restResults.map((item) => ({ ...item })),
  }))

  if (query.kycLinkStatusChangeType != null && query.kycLinkStatusChangeType !== '') {
    list = list.filter((row) => String(row.kycLinkStatusChangeType) === String(query.kycLinkStatusChangeType))
  }
  if (query.changeSource != null && query.changeSource !== '') {
    list = list.filter((row) => String(row.kycLinkStatusChangeSource) === String(query.changeSource))
  }
  if (query.changeReason != null && query.changeReason !== '') {
    list = list.filter((row) => String(row.kycLinkStatusChangeReason) === String(query.changeReason))
  }
  if (query.operationTimeStart || query.operationTimeEnd) {
    list = list.filter((row) =>
      matchTimeRange(row.operationTime, query.operationTimeStart, query.operationTimeEnd),
    )
  }

  list.sort((a, b) => (a.operationTime < b.operationTime ? 1 : -1))
  const page = paginate(list, Number(query.pageNo) || 1, Number(query.pageSize) || 20)
  return {
    code: '1',
    msg: '操作成功',
    data: page.data,
    total: page.total,
    success: true,
  }
}

/** 收款操作日志：POST /collectionInfoAdmin/operationLog */
export function buildPaymentOperationLogListBody(raw: unknown) {
  const query = readQuery(raw)
  const upiId = String(query.upiId || '')
  let list = ensureOperation(upiId).map((row) => ({ ...row }))
  if (upiId) {
    list = list.filter((row) => row.upiId === upiId)
  }
  list.sort((a, b) => (a.operationTime < b.operationTime ? 1 : -1))
  const page = paginate(list, Number(query.pageNo) || 1, Number(query.pageSize) || 20)
  return {
    code: '1',
    msg: '操作成功',
    data: page.data,
    total: page.total,
    success: true,
  }
}

/** 连接日志「行为」→ KYC 拉取流水：POST /kycPartnersAdmin/kycPullResultLogPage */
export function buildKycPullResultLogBody(raw: unknown) {
  const query = readQuery(raw)
  const connectionUuid = String(query.connectionUuid || '')
  let list = ensurePull(connectionUuid).map((row) => ({
    ...row,
    restResults: row.restResults.map((item) => ({ ...item })),
  }))
  if (connectionUuid) {
    list = list.filter((row) => row.connectionUuid === connectionUuid)
  }
  list.sort((a, b) => (a.operationTime < b.operationTime ? 1 : -1))
  const page = paginate(list, Number(query.pageNo) || 1, Number(query.pageSize) || 20)
  return {
    code: '1',
    msg: '操作成功',
    data: page.data,
    total: page.total,
    success: true,
  }
}
