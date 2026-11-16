import { listMembers } from './memberList'

// 返佣记录。字段说明见 notes/field-notes.md §8。
// commissionType 1～4；agentLevel 1/2；tradeType 1/2。

export interface CommissionRow {
  id: number
  targetUserId: number
  platformOrderNo: string
  sourceUserId: number
  commissionAmount: number
  commissionType: 1 | 2 | 3 | 4
  agentLevel: 1 | 2
  tradeType: 1 | 2
  commissionTime: string
}

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

function round2(value: number) {
  return Math.round(value * 100) / 100
}

function sumCommission(list: CommissionRow[]) {
  return round2(list.reduce((total, row) => total + Number(row.commissionAmount || 0), 0))
}

function emptyExtend(page: CommissionRow[] = [], all: CommissionRow[] = []) {
  const last = page[page.length - 1]
  const first = page[0]
  return {
    nextColValue: last ? last.commissionTime : '',
    nextCursorId: last ? String(last.id) : '',
    prevColValue: first ? first.commissionTime : '',
    prevCursorId: first ? String(first.id) : '',
    pageCommission: sumCommission(page),
    totalCommission: sumCommission(all),
  }
}

let nextId = 860001
let rows: CommissionRow[] | null = null

function seedRows() {
  if (rows) return rows
  const members = listMembers()
  const target = (i: number) => members[i % members.length].id
  const source = (i: number) => members[(i + 3) % members.length].id

  // commissionType 1～4 各一条，并覆盖 agentLevel / tradeType
  const specs: Array<Omit<CommissionRow, 'id'>> = [
    {
      targetUserId: target(0),
      platformOrderNo: 'PORD-COMM-1001',
      sourceUserId: source(0),
      commissionAmount: 12.5,
      commissionType: 1,
      agentLevel: 1,
      tradeType: 1,
      commissionTime: '2026-03-12 10:15:00',
    },
    {
      targetUserId: target(1),
      platformOrderNo: 'PORD-COMM-1002',
      sourceUserId: source(1),
      commissionAmount: 8.2,
      commissionType: 2,
      agentLevel: 1,
      tradeType: 2,
      commissionTime: '2026-03-12 11:20:00',
    },
    {
      targetUserId: target(2),
      platformOrderNo: 'PORD-COMM-1003',
      sourceUserId: source(2),
      commissionAmount: 25,
      commissionType: 3,
      agentLevel: 2,
      tradeType: 1,
      commissionTime: '2026-03-11 16:45:00',
    },
    {
      targetUserId: target(3),
      platformOrderNo: 'PORD-COMM-1004',
      sourceUserId: source(3),
      commissionAmount: 6.75,
      commissionType: 4,
      agentLevel: 2,
      tradeType: 2,
      commissionTime: '2026-03-11 18:05:00',
    },
    {
      targetUserId: target(4),
      platformOrderNo: 'PORD-COMM-1005',
      sourceUserId: source(4),
      commissionAmount: 15.3,
      commissionType: 1,
      agentLevel: 2,
      tradeType: 1,
      commissionTime: '2026-03-10 09:30:00',
    },
    {
      targetUserId: target(5),
      platformOrderNo: 'PORD-COMM-1006',
      sourceUserId: source(5),
      commissionAmount: 4.1,
      commissionType: 2,
      agentLevel: 1,
      tradeType: 2,
      commissionTime: '2026-03-09 13:12:00',
    },
  ]

  rows = specs.map((item) => ({ id: nextId++, ...item }))
  rows.sort((a, b) => (a.commissionTime < b.commissionTime ? 1 : -1))
  return rows
}

export function buildCommissionListBody(raw: unknown) {
  const query = readQuery(raw)
  const list = seedRows()
  const filtered = list.filter((row) => {
    if (hasFilter(query.targetUserId) && String(row.targetUserId) !== String(query.targetUserId)) return false
    if (!includesText(row.platformOrderNo, query.platformOrderNo)) return false
    if (hasFilter(query.sourceUserId) && String(row.sourceUserId) !== String(query.sourceUserId)) return false
    if (hasFilter(query.commissionType) && String(row.commissionType) !== String(query.commissionType)) return false
    if (hasFilter(query.agentLevel) && String(row.agentLevel) !== String(query.agentLevel)) return false
    if (hasFilter(query.tradeType) && String(row.tradeType) !== String(query.tradeType)) return false
    if (hasFilter(query.commissionTimeStart) && row.commissionTime < String(query.commissionTimeStart)) return false
    if (hasFilter(query.commissionTimeEnd) && row.commissionTime > String(query.commissionTimeEnd)) return false
    return true
  })
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const start = (pageNo - 1) * pageSize
  const page = filtered.slice(start, start + pageSize).map((row) => ({ ...row }))
  return {
    code: '1',
    msg: '操作成功',
    data: {
      list: page,
      total: filtered.length,
      extend: emptyExtend(page, filtered),
    },
    success: true,
  }
}
