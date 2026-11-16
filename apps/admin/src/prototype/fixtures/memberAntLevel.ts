import { findMemberById } from './memberList'

// 蚂蚁层级列表。字段说明见 notes/field-notes.md §16。
// 转化时间用印度时区当天，适配页面默认时间筛选。
// 会员取自现有列表，点会员 ID、返佣金额能打开已有详情和返佣记录。

export type AntLevelRow = {
  id: number
  memberId: number
  memberAccount: string
  lastLoginTime: string
  notLoginDays: number
  invitationCode: string
  antLevelGroup: number
  antUpperLevelId: number | null
  agentLevel: number
  directSubordinateCount: number
  allSubordinateCount: number
  totalCommissionAmount: number
  createTime: string
  antConversionTime: string
  antConversionType: number
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

function matchNotLogin(days: number, filter: unknown) {
  if (!hasFilter(filter)) return true
  const value = Number(filter)
  if (value === 3) return days >= 3 && days < 7
  if (value === 7) return days >= 7 && days < 10
  if (value === 10) return days === 10
  if (value === -1) return days > 10
  return days === value
}

function countAll(memberId: number, rows: AntLevelRow[]): number {
  const children = rows.filter((row) => row.antUpperLevelId === memberId)
  return children.reduce((total, child) => total + 1 + countAll(child.memberId, rows), 0)
}

function refreshCounts(rows: AntLevelRow[]) {
  rows.forEach((row) => {
    row.directSubordinateCount = rows.filter((item) => item.antUpperLevelId === row.memberId).length
    row.allSubordinateCount = countAll(row.memberId, rows)
  })
}

let rows: AntLevelRow[] | null = null

function seedRows() {
  if (rows) return rows
  const account = (id: number) => findMemberById(id)?.memberAccount || String(id)
  const created = (id: number) => findMemberById(id)?.createTime || '2026-03-12 10:00:00'
  // 分组 0～4、转化方式 1～4、未登录档 3/7/10/超过10天 都覆盖。
  // 层级：10086002 为根，下面两支。
  const specs: Array<Omit<AntLevelRow, 'id' | 'memberAccount' | 'createTime' | 'directSubordinateCount' | 'allSubordinateCount' | 'lastLoginTime'>> = [
    {
      memberId: 10086002,
      notLoginDays: 0,
      invitationCode: 'ANT86002',
      antLevelGroup: 4,
      antUpperLevelId: null,
      agentLevel: 0,
      totalCommissionAmount: 8.2,
      antConversionTime: stamp(9, 10, 0),
      antConversionType: 1,
    },
    {
      memberId: 10086001,
      notLoginDays: 4,
      invitationCode: 'ANT86001',
      antLevelGroup: 0,
      antUpperLevelId: 10086002,
      agentLevel: 1,
      totalCommissionAmount: 12.5,
      antConversionTime: stamp(10, 20, 0),
      antConversionType: 2,
    },
    {
      memberId: 10086005,
      notLoginDays: 8,
      invitationCode: 'ANT86005',
      antLevelGroup: 1,
      antUpperLevelId: 10086001,
      agentLevel: 2,
      totalCommissionAmount: 15.3,
      antConversionTime: stamp(11, 30, 0),
      antConversionType: 4,
    },
    {
      memberId: 10086003,
      notLoginDays: 10,
      invitationCode: 'ANT86003',
      antLevelGroup: 2,
      antUpperLevelId: 10086002,
      agentLevel: 1,
      totalCommissionAmount: 25,
      antConversionTime: stamp(14, 5, 0),
      antConversionType: 3,
    },
    {
      memberId: 10086004,
      notLoginDays: 16,
      invitationCode: 'ANT86004',
      antLevelGroup: 3,
      antUpperLevelId: 10086003,
      agentLevel: 2,
      totalCommissionAmount: 6.75,
      antConversionTime: stamp(16, 40, 0),
      antConversionType: 1,
    },
  ]
  rows = specs.map((item, index) => ({
    id: 760001 + index,
    ...item,
    memberAccount: account(item.memberId),
    createTime: created(item.memberId),
    lastLoginTime: stamp(8, 30, 0, -item.notLoginDays),
    directSubordinateCount: 0,
    allSubordinateCount: 0,
  }))
  refreshCounts(rows)
  return rows
}

function listBody(page: AntLevelRow[], total: number) {
  const last = page[page.length - 1]
  const first = page[0]
  return {
    code: '1',
    msg: '操作成功',
    data: {
      list: page.map((row) => ({ ...row })),
      total,
      extend: {
        nextColValue: last ? last.antConversionTime : '',
        nextCursorId: last ? String(last.id) : '',
        prevColValue: first ? first.antConversionTime : '',
        prevCursorId: first ? String(first.id) : '',
      },
    },
    success: true,
  }
}

function sortRows(list: AntLevelRow[], query: Record<string, any>) {
  const asc = query.asc === true || query.asc === 'true'
  const column = String(query.column || '')
  const keys = ['notLoginDays', 'directSubordinateCount', 'totalCommissionAmount'] as const
  if (keys.includes(column as (typeof keys)[number])) {
    list.sort((a, b) => {
      const diff = Number(a[column as (typeof keys)[number]]) - Number(b[column as (typeof keys)[number]])
      return asc ? diff : -diff
    })
    return
  }
  list.sort((a, b) => (a.antConversionTime < b.antConversionTime ? 1 : -1))
}

export function buildAntLevelListBody(raw: unknown) {
  const query = readQuery(raw)
  const filtered = seedRows().filter((row) => {
    if (!includesText(row.memberId, query.memberId)) return false
    if (!includesText(row.invitationCode, query.invitationCode)) return false
    if (!includesText(row.memberAccount, query.memberAccount)) return false
    if (!sameValue(row.antLevelGroup, query.antLevelGroup)) return false
    if (hasFilter(query.agentLevel) && Number(row.agentLevel) !== Number(query.agentLevel)) return false
    if (!sameValue(row.antConversionType, query.conversionType)) return false
    if (!matchNotLogin(row.notLoginDays, query.notLoginDays)) return false
    if (!inRange(row.antConversionTime, query.startTime, query.endTime)) return false
    return true
  })
  sortRows(filtered, query)
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const start = (pageNo - 1) * pageSize
  return listBody(filtered.slice(start, start + pageSize), filtered.length)
}

export function buildAntLevelRelationBody(raw: unknown) {
  const query = readQuery(raw)
  const all = seedRows()
  const memberId = Number(query.memberId)
  const self = all.find((row) => row.memberId === memberId)
  const related = self
    ? all.filter(
        (row) =>
          row.memberId === memberId ||
          (self.antUpperLevelId != null && row.memberId === self.antUpperLevelId) ||
          row.antUpperLevelId === memberId
      )
    : []
  related.sort((a, b) => a.agentLevel - b.agentLevel || a.memberId - b.memberId)
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const start = (pageNo - 1) * pageSize
  return listBody(related.slice(start, start + pageSize), related.length)
}

export function applySetAntGroup(raw: unknown) {
  const query = readQuery(raw)
  const row = seedRows().find((item) => String(item.memberId) === String(query.memberId))
  if (row && hasFilter(query.antLevelGroup)) {
    row.antLevelGroup = Number(query.antLevelGroup)
  }
  return {
    code: '1',
    msg: '操作成功',
    data: null,
    success: true,
  }
}
