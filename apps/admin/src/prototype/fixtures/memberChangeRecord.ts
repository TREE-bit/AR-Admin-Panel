import { findMemberById, listMembers } from './memberList'
import type { MemberListRow } from './memberList.types'

// 会员详情「账变记录」Tab + 独立菜单 /member/changeReocde。
// 字段说明见 notes/field-notes.md §3、§10。

export interface MemberChangeRow {
  id: number
  /** 列表 mid：会员主键 */
  mid: number
  /** 商户侧会员标识；详情 Tab 仍用 memberId 作会员主键筛选兼容 */
  memberId: number
  memberAccount: string
  merchantName: string
  tradeMerchantName: string
  merchantOrder: string
  orderNo: string
  changeType: number
  fundType: number
  payType: number | ''
  strideMerchant: 0 | 1
  beforeChange: number
  amountChange: number
  afterChange: number
  createTime: string
  updateBy: string
  remark: string
}

/** 与 publicData.changeType 启用键一致 */
export const CHANGE_TYPE_KEYS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
] as const

const successBody = {
  code: '1',
  msg: '操作成功',
  data: null,
  success: true,
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
  if (typeof URLSearchParams !== 'undefined' && raw instanceof URLSearchParams) {
    const out: Record<string, any> = {}
    raw.forEach((value, key) => {
      out[key] = value
    })
    return out
  }
  return raw as Record<string, any>
}

function round2(value: number) {
  return Math.round(value * 100) / 100
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

function offsetTime(base: string, hours: number) {
  const date = new Date(base.replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return base
  date.setHours(date.getHours() + hours)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function nowText() {
  const date = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

let nextId = 90000001

function merchantOf(row: MemberListRow) {
  return row.merchantName || row.bindMerchantInfoDTOS[0]?.merchantCode || '星河商城'
}

function pushChange(
  list: MemberChangeRow[],
  partial: Omit<MemberChangeRow, 'id'> & { id?: number }
) {
  list.push({
    id: partial.id ?? nextId++,
    ...partial,
  })
}

function seedForMember(row: MemberListRow): MemberChangeRow[] {
  const list: MemberChangeRow[] = []
  const base = row.createTime
  let arb = Math.max(0, round2(row.arbBalance * 0.4))
  let cpb = Math.max(0, round2(row.balance * 0.4))
  const merchantName = merchantOf(row)
  const account = row.memberAccount
  const mid = row.id

  const add = (
    hours: number,
    changeType: number,
    fundType: 1 | 2 | 3,
    amount: number,
    extra: Partial<MemberChangeRow> = {}
  ) => {
    const before = fundType === 2 ? cpb : arb
    const after = round2(before + amount)
    if (fundType === 1 || fundType === 3) arb = after
    else cpb = after
    pushChange(list, {
      mid,
      memberId: mid,
      memberAccount: account,
      merchantName: extra.merchantName ?? merchantName,
      tradeMerchantName: extra.tradeMerchantName ?? merchantName,
      merchantOrder: extra.merchantOrder ?? (changeType <= 2 ? `MORD${row.id}${hours}` : ''),
      orderNo: extra.orderNo ?? `PORD${row.id}${String(hours).padStart(3, '0')}`,
      changeType,
      fundType,
      payType: extra.payType ?? (changeType <= 2 ? (hours % 2 ? 1 : 3) : ''),
      strideMerchant: extra.strideMerchant ?? 0,
      beforeChange: before,
      amountChange: round2(amount),
      afterChange: after,
      createTime: offsetTime(base, hours),
      updateBy: extra.updateBy ?? (changeType === 4 || changeType === 5 || changeType === 6 || changeType === 7 ? 'prototype' : 'system'),
      remark: extra.remark ?? '',
    })
  }

  if (row.rechargeTotalAmount > 0) {
    add(6, 4, 1, Math.min(row.rechargeTotalAmount * 0.6, 5000) || 100, {
      remark: '人工上分-ARB',
      merchantOrder: '',
      payType: '',
    })
    if (row.balance > 0 || row.rechargeNum > 1) {
      add(8, 4, 2, Math.min(row.rechargeTotalAmount * 0.2, 800) || 50, {
        remark: '人工上分-CPB',
        merchantOrder: '',
        payType: '',
      })
    }
  }

  if (row.totalBuyCount > 0) {
    const buyAmt = Math.max(50, round2(row.totalBuyAmount / Math.max(row.totalBuyCount, 1)))
    add(12, 1, 1, buyAmt, { remark: '买入到账', payType: 3 })
    if (row.totalBuyCount > 2) {
      add(18, 1, 1, round2(buyAmt * 1.2), { remark: '买入到账', payType: 1 })
    }
    if (row.totalBuyBonus && row.totalBuyBonus > 0) {
      add(19, 8, 1, Math.max(1, round2(Number(row.totalBuyBonus) / 2)), {
        remark: '买入奖励',
        merchantOrder: '',
        payType: '',
        updateBy: 'system',
      })
    }
  }

  if (row.totalSellCount > 0) {
    const sellAmt = Math.max(30, round2(row.totalSellAmount / Math.max(row.totalSellCount, 1)))
    add(24, 2, 1, -Math.min(sellAmt, arb || sellAmt), { remark: '卖出扣款', payType: 5 })
    if (row.totalSellCount > 2) {
      add(30, 2, 2, -Math.min(round2(sellAmt * 0.3), cpb || sellAmt * 0.3), {
        remark: '卖出扣款-CPB',
        payType: 1,
      })
    }
  }

  if (row.withdrawTotalAmount > 0) {
    add(36, 7, 1, -Math.min(200, arb || 200), {
      remark: '人工下分',
      merchantOrder: '',
      payType: '',
    })
  }

  if (Number(row.biFrozenAmount || 0) > 0 || Number(row.arbBiFrozenAmount || 0) > 0) {
    const freezeAmt = Math.min(100, cpb || 100)
    add(40, 5, 2, -freezeAmt, {
      remark: '后台冻结',
      merchantOrder: '',
      payType: '',
    })
    if (row.id % 2 === 0) {
      add(42, 6, 2, freezeAmt * 0.5, {
        remark: '部分解冻',
        merchantOrder: '',
        payType: '',
      })
    }
  }

  if (row.owedAmount > 0) {
    add(48, 23, 1, -Math.min(row.owedAmount, arb || row.owedAmount), {
      remark: '欠费下分',
      merchantOrder: '',
      payType: '',
      updateBy: 'system',
    })
  }

  if (row.usdtConvertArbAmount > 0 && [3, 4].includes(row.memberType)) {
    add(54, 3, 1, Math.min(row.usdtConvertArbAmount * 0.3, 3000) || 100, {
      remark: 'USDT买入',
      payType: 2,
    })
  }

  return list.sort((a, b) => (a.createTime < b.createTime ? 1 : -1))
}

const recordsByMember = new Map<number, MemberChangeRow[]>()

function ensureMemberRecords(memberId: number) {
  if (recordsByMember.has(memberId)) return recordsByMember.get(memberId)!
  const member = findMemberById(memberId)
  const list = member ? seedForMember(member) : []
  recordsByMember.set(memberId, list)
  return list
}

export function appendMemberChange(input: {
  memberId: number
  changeType: number
  fundType: 1 | 2
  amountChange: number
  beforeChange: number
  afterChange: number
  remark?: string
  orderNo?: string
  merchantOrder?: string
  payType?: number | ''
  updateBy?: string
}) {
  const member = findMemberById(input.memberId)
  const list = ensureMemberRecords(input.memberId)
  pushChange(list, {
    mid: input.memberId,
    memberId: input.memberId,
    memberAccount: member?.memberAccount || String(input.memberId),
    merchantName: member ? merchantOf(member) : '',
    tradeMerchantName: member ? merchantOf(member) : '',
    merchantOrder: input.merchantOrder ?? '',
    orderNo: input.orderNo ?? `PORD-MANUAL-${Date.now()}`,
    changeType: input.changeType,
    fundType: input.fundType,
    payType: input.payType ?? '',
    strideMerchant: 0,
    beforeChange: round2(input.beforeChange),
    amountChange: round2(input.amountChange),
    afterChange: round2(input.afterChange),
    createTime: nowText(),
    updateBy: input.updateBy ?? 'prototype',
    remark: input.remark ?? '',
  })
  list.sort((a, b) => (a.createTime < b.createTime ? 1 : -1))
}

function todayStamp(hour: number, minute: number, second = 0) {
  const date = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(hour)}:${pad(minute)}:${pad(second)}`
}

let globalCatalog: MemberChangeRow[] | null = null

function seedGlobalCatalog() {
  if (globalCatalog) return globalCatalog
  const members = listMembers()
  const payTypes: Array<number | ''> = [1, 2, 3, 5, '']
  const list: MemberChangeRow[] = []
  CHANGE_TYPE_KEYS.forEach((changeType, index) => {
    const member = members[index % members.length]
    const fundType = ([1, 2, 3] as const)[index % 3]
    const deduct = [2, 5, 7, 20, 23, 24, 26, 29].includes(changeType)
    const amount = round2((50 + (index % 7) * 12.5) * (deduct ? -1 : 1))
    const before = round2(1000 + index * 35)
    const after = round2(before + amount)
    const hour = 8 + (index % 10)
    const minute = (index * 3) % 60
    pushChange(list, {
      mid: member.id,
      memberId: member.id,
      memberAccount: member.memberAccount,
      merchantName: merchantOf(member),
      tradeMerchantName: index % 3 === 0 ? '晨曦支付' : merchantOf(member),
      merchantOrder: changeType <= 3 || changeType === 20 ? `MORD-G${changeType}` : '',
      orderNo: changeType === 5 || changeType === 6 ? `MC-G${changeType}-${member.id}` : `PORD-G${changeType}-${member.id}`,
      changeType,
      fundType,
      payType: payTypes[index % payTypes.length],
      strideMerchant: index % 2 === 0 ? 0 : 1,
      beforeChange: before,
      amountChange: amount,
      afterChange: after,
      createTime: todayStamp(hour, minute, index % 60),
      updateBy: [4, 5, 6, 7].includes(changeType) ? 'prototype' : 'system',
      remark: `枚举造数 changeType=${changeType}`,
    })
  })
  globalCatalog = list.sort((a, b) => (a.createTime < b.createTime ? 1 : -1))
  return globalCatalog
}

function matchRecords(list: MemberChangeRow[], query: Record<string, any>) {
  return list.filter((row) => {
    if (!includesText(row.merchantOrder, query.merchantOrder)) return false
    if (!includesText(row.orderNo, query.orderNo)) return false
    if (!includesText(row.remark, query.remark)) return false
    if (!includesText(row.merchantName, query.merchantName)) return false
    if (hasFilter(query.obscureId)) {
      const key = String(query.obscureId).trim()
      const hit =
        String(row.mid).includes(key) ||
        String(row.memberId).includes(key) ||
        String(row.memberAccount).includes(key)
      if (!hit) return false
    }
    if (hasFilter(query.obscureOrderNo)) {
      const key = String(query.obscureOrderNo).trim()
      if (!String(row.orderNo).includes(key) && !String(row.merchantOrder).includes(key)) return false
    }
    if (hasFilter(query.changeType) && String(row.changeType) !== String(query.changeType)) return false
    if (hasFilter(query.fundType) && String(row.fundType) !== String(query.fundType)) return false
    if (hasFilter(query.payType) && String(row.payType) !== String(query.payType)) return false
    if (hasFilter(query.strideMerchant) && String(row.strideMerchant) !== String(query.strideMerchant)) return false
    if (hasFilter(query.amountChangeStart) && row.amountChange < Number(query.amountChangeStart)) return false
    if (hasFilter(query.amountChangeEnd) && row.amountChange > Number(query.amountChangeEnd)) return false
    if (hasFilter(query.createTimeStart) && row.createTime < String(query.createTimeStart)) return false
    if (hasFilter(query.createTimeEnd) && row.createTime > String(query.createTimeEnd)) return false
    return true
  })
}

function sum(list: MemberChangeRow[], key: keyof MemberChangeRow) {
  return round2(list.reduce((total, row) => total + Number(row[key] || 0), 0))
}

function buildExtend(page: MemberChangeRow[], all: MemberChangeRow[]) {
  const last = page[page.length - 1]
  const first = page[0]
  return {
    nextColValue: last ? last.createTime : '',
    nextCursorId: last ? String(last.id) : '',
    prevColValue: first ? first.createTime : '',
    prevCursorId: first ? String(first.id) : '',
    beforeChangePageTotal: sum(page, 'beforeChange'),
    amountChangePageTotal: sum(page, 'amountChange'),
    afterChangePageTotal: sum(page, 'afterChange'),
    beforeChangeTotal: sum(all, 'beforeChange'),
    amountChangeTotal: sum(all, 'amountChange'),
    afterChangeTotal: sum(all, 'afterChange'),
  }
}

export function buildMemberChangeListBody(raw: unknown) {
  const query = readQuery(raw)
  // 详情 Tab 会带会员 id；独立菜单页不带，走全表枚举种子
  const memberId = Number(query.id ?? query.memberId)
  const source = memberId ? ensureMemberRecords(memberId) : seedGlobalCatalog()
  const filtered = matchRecords(source, query)
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const start = (pageNo - 1) * pageSize
  const page = filtered.slice(start, start + pageSize).map((row) => ({ ...row }))
  return {
    code: '1',
    msg: '操作成功',
    data: page,
    total: filtered.length,
    extend: buildExtend(page, filtered),
    success: true,
  }
}

export function buildMerchantListBody() {
  const names = new Map<string, string>()
  for (const row of listMembers()) {
    const name = merchantOf(row)
    const code = row.bindMerchantInfoDTOS[0]?.merchantCode || `M${row.id}`
    if (!names.has(name)) names.set(name, code)
  }
  names.set('晨曦支付', 'M20001')
  const data = [...names.entries()].map(([username, code]) => ({ username, code }))
  return {
    code: '1',
    msg: '操作成功',
    data,
    total: data.length,
    success: true,
  }
}

export { successBody }
