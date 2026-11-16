import { listMembers } from './memberList'

// 实名认证列表。字段说明见 notes/field-notes.md §7。
// authenticationStatus（certificateStatus / i18n）：
//   1 = 已认证(c18)  2 = 未认证(c19)  3 = 手动认证(c100)

export interface RealNameRow {
  id: number
  memberId: number
  authenticationStatus: '1' | '2' | '3'
  realName: string
  idCardNumber: string
  realNameVerificationTime: string
  verificationBy: string
  idCardImage: string
  facePhoto: string
}

const successBody = {
  code: '1',
  msg: '操作成功',
  data: null,
  success: true,
}

const placeholderIdCard =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="343" height="170"><rect width="100%" height="100%" fill="#d9e2ec"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#486581" font-size="18">ID Card</text></svg>'
  )

const placeholderFace =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="343" height="377"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#486581" font-size="18">Face</text></svg>'
  )

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

function nowText() {
  const date = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function emptyExtend(page: RealNameRow[] = []) {
  const last = page[page.length - 1]
  const first = page[0]
  return {
    nextColValue: last ? last.realNameVerificationTime || '' : '',
    nextCursorId: last ? String(last.id) : '',
    prevColValue: first ? first.realNameVerificationTime || '' : '',
    prevCursorId: first ? String(first.id) : '',
  }
}

let seeded = false
/** 会话内被「解除」隐藏的会员 id；整页刷新后模块重载，种子恢复 */
const hiddenIds = new Set<number>()
let rows: RealNameRow[] = []

function buildSeedRows(): RealNameRow[] {
  const members = listMembers()
  const pick = (index: number) => members[index % members.length]

  // 1 已认证（有完整资料）/ 2 未认证（无姓名证件等）/ 3 手动认证（有资料）
  const specs: Array<{
    status: '1' | '2' | '3'
    memberIndex: number
    name: string
    card: string
    by: string
    time: string
  }> = [
    { status: '1', memberIndex: 0, name: 'Arjun Mehta', card: 'IND20261001', by: 'system', time: '2026-03-01 10:00:00' },
    { status: '2', memberIndex: 1, name: '', card: '', by: '', time: '' },
    { status: '3', memberIndex: 2, name: 'Priya Patel', card: 'IND20261003', by: 'prototype', time: '2026-03-10 14:22:00' },
    { status: '1', memberIndex: 3, name: 'Amit Kumar', card: 'IND20261004', by: 'admin01', time: '2026-03-08 09:15:30' },
    { status: '2', memberIndex: 4, name: '', card: '', by: '', time: '' },
    { status: '1', memberIndex: 5, name: 'Neha Verma', card: 'IND20261006', by: 'system', time: '2026-02-20 11:30:00' },
    { status: '3', memberIndex: 6, name: 'Vikram Singh', card: 'IND20261007', by: 'prototype', time: '2026-02-28 18:40:00' },
  ]

  return specs.map((spec) => {
    const member = pick(spec.memberIndex)
    const hasProfile = spec.status === '1' || spec.status === '3'
    return {
      id: member.id,
      memberId: member.id,
      authenticationStatus: spec.status,
      realName: hasProfile ? spec.name : '',
      idCardNumber: hasProfile ? spec.card : '',
      realNameVerificationTime: hasProfile ? spec.time : '',
      verificationBy: hasProfile ? spec.by : '',
      idCardImage: hasProfile ? placeholderIdCard : '',
      facePhoto: hasProfile ? placeholderFace : '',
    }
  })
}

function seedRows() {
  if (seeded) return
  seeded = true
  hiddenIds.clear()
  rows = buildSeedRows()
}

export function buildRealNameListBody(raw: unknown) {
  seedRows()
  const query = readQuery(raw)
  const filtered = rows.filter((row) => {
    if (hiddenIds.has(row.id)) return false
    if (hasFilter(query.memberId) && String(row.id) !== String(query.memberId) && String(row.memberId) !== String(query.memberId)) {
      return false
    }
    if (!includesText(row.idCardNumber, query.idCardNumber)) return false
    if (hasFilter(query.authenticationStatus) && String(row.authenticationStatus) !== String(query.authenticationStatus)) {
      return false
    }
    return true
  })
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const start = (pageNo - 1) * pageSize
  const page = filtered.slice(start, start + pageSize).map((row) => ({ ...row }))
  return {
    code: '1',
    msg: '操作成功',
    data: page,
    total: filtered.length,
    extend: emptyExtend(page),
    success: true,
  }
}

export function applyEditRealName(raw: unknown) {
  seedRows()
  const query = readQuery(raw)
  const memberId = Number(query.memberId)
  const row = rows.find((item) => item.id === memberId || item.memberId === memberId)
  if (!row) return { code: '0', msg: '记录不存在', data: null, success: false }

  // 未认证编辑提交后落成「手动认证」；表单可选的也是 status=3
  const nextStatus = String(query.authenticationStatus || '3') as RealNameRow['authenticationStatus']
  row.authenticationStatus = nextStatus === '2' ? '3' : nextStatus
  if (query.realName != null) row.realName = String(query.realName)
  if (query.idCardNumber != null) row.idCardNumber = String(query.idCardNumber)
  if (query.idCardImage != null) row.idCardImage = String(query.idCardImage)
  if (query.facePhoto != null) row.facePhoto = String(query.facePhoto)
  if (row.authenticationStatus === '3' || row.authenticationStatus === '1') {
    row.realNameVerificationTime = nowText()
    row.verificationBy = 'prototype'
  }
  hiddenIds.delete(row.id)
  return successBody
}

export function applyClearRealName(raw: unknown) {
  seedRows()
  const query = readQuery(raw)
  const id = Number(query.id ?? query.memberId)
  const row = rows.find((item) => item.id === id || item.memberId === Number(query.memberId))
  if (!row) return { code: '0', msg: '记录不存在', data: null, success: false }
  // 「解除」：本会话内从列表隐藏；刷新页面后种子恢复
  hiddenIds.add(row.id)
  return successBody
}
