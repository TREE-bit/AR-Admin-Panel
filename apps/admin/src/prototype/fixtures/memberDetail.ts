import { findMemberById, syncMemberTotals } from './memberList'
import type { MemberListRow } from './memberList.types'
import { appendMemberChange } from './memberChangeRecord'

// 会员详情「会员信息」假数据。收款信息先不在这里。
// 列表已有字段直接复用；详情专有字段在 memberList.finish 里补齐。
// 充值/提现/冻结/解冻会追加账变流水，见 memberChangeRecord.ts。

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
      // memberLevelChangeList 等接口用 application/x-www-form-urlencoded
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

function num(value: unknown) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
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

function resolveMember(raw: unknown) {
  const query = readQuery(raw)
  return findMemberById(query.id ?? query.memberId)
}

function cloneInfo(row: MemberListRow) {
  return {
    ...row,
    bindMerchantInfoDTOS: row.bindMerchantInfoDTOS.map((item) => ({ ...item })),
  }
}

export function buildMemberInfoBody(raw: unknown) {
  const row = resolveMember(raw)
  if (!row) {
    return { code: '0', msg: '会员不存在', data: null, success: false }
  }
  return {
    code: '1',
    msg: '操作成功',
    data: cloneInfo(row),
    success: true,
  }
}

type TradeRow = {
  createTime: string
  actualAmount: number
  matchMemberId: number
  status: string
}

type LoginRow = {
  createTime: string
  ip: string
  count: number
}

type LevelRow = {
  beforeChange: number
  afterChange: number
  createTime: string
}

const lastBuyMap = new Map<number, TradeRow[]>()
const lastSellMap = new Map<number, TradeRow[]>()
const lastLoginMap = new Map<number, LoginRow[]>()
const levelLogMap = new Map<number, LevelRow[]>()

function buildLastTrades(row: MemberListRow, kind: 'buy' | 'sell'): TradeRow[] {
  const count = kind === 'buy' ? row.totalBuyCount : row.totalSellCount
  if (count <= 0) return []
  const size = Math.min(5, count)
  const statuses = ['已完成', '已完成', '申诉中', '已完成', '已取消']
  const list: TradeRow[] = []
  for (let i = 0; i < size; i++) {
    const amountBase = kind === 'buy' ? row.totalBuyAmount : row.totalSellAmount
    list.push({
      createTime: offsetTime(row.createTime, 24 * (i + 1) + (kind === 'buy' ? 2 : 5)),
      actualAmount: round2(Math.max(10, amountBase / Math.max(count, 1) + i * 37.5)),
      matchMemberId: 10086001 + ((row.id + i * (kind === 'buy' ? 3 : 5)) % 16),
      status: statuses[i % statuses.length],
    })
  }
  return list.reverse()
}

function buildLastLogins(row: MemberListRow): LoginRow[] {
  if (!row.firstLoginTime && !row.createTime) return []
  const base = row.firstLoginTime || row.createTime
  return [
    { createTime: offsetTime(base, 72), ip: row.firstLoginIp || '0.0.0.0', count: 3 },
    { createTime: offsetTime(base, 36), ip: row.registerIp || '0.0.0.0', count: 2 },
    { createTime: offsetTime(base, 12), ip: `58.${row.id % 200}.${(row.id * 2) % 255}.1`, count: 1 },
  ].reverse()
}

function buildLevelLogs(row: MemberListRow): LevelRow[] {
  if (row.level <= 0) return []
  const list: LevelRow[] = []
  const steps = Math.min(row.level, 5)
  for (let i = 0; i < steps; i++) {
    const after = row.level - (steps - 1 - i)
    const before = after - 1
    if (before < 0) continue
    list.push({
      beforeChange: before,
      afterChange: after,
      createTime: offsetTime(row.createTime, 24 * 7 * (i + 1)),
    })
  }
  return list
}

function ensureSideData(row: MemberListRow) {
  if (!lastBuyMap.has(row.id)) lastBuyMap.set(row.id, buildLastTrades(row, 'buy'))
  if (!lastSellMap.has(row.id)) lastSellMap.set(row.id, buildLastTrades(row, 'sell'))
  if (!lastLoginMap.has(row.id)) lastLoginMap.set(row.id, buildLastLogins(row))
  if (!levelLogMap.has(row.id)) levelLogMap.set(row.id, buildLevelLogs(row))
}

export function buildLastBuyBody(raw: unknown) {
  const row = resolveMember(raw)
  if (!row) return { ...successBody, data: [] }
  ensureSideData(row)
  return { code: '1', msg: '操作成功', data: [...(lastBuyMap.get(row.id) || [])], success: true }
}

export function buildLastSellBody(raw: unknown) {
  const row = resolveMember(raw)
  if (!row) return { ...successBody, data: [] }
  ensureSideData(row)
  return { code: '1', msg: '操作成功', data: [...(lastSellMap.get(row.id) || [])], success: true }
}

export function buildLastLoginBody(raw: unknown) {
  const row = resolveMember(raw)
  if (!row) return { ...successBody, data: [] }
  ensureSideData(row)
  return { code: '1', msg: '操作成功', data: [...(lastLoginMap.get(row.id) || [])], success: true }
}

export function buildLevelChangeBody(raw: unknown) {
  const row = resolveMember(raw)
  if (!row) return { ...successBody, data: [] }
  ensureSideData(row)
  return { code: '1', msg: '操作成功', data: [...(levelLogMap.get(row.id) || [])], success: true }
}

export function applyResetPassword(raw: unknown) {
  const row = resolveMember(raw)
  if (!row) return { code: '0', msg: '会员不存在', data: null, success: false }
  row.loginPwdUpdateTime = nowText()
  row.loginPwdUpdateName = 'prototype'
  return successBody
}

export function applyResetPayPwd(raw: unknown) {
  const row = resolveMember(raw)
  if (!row) return { code: '0', msg: '会员不存在', data: null, success: false }
  row.payPwdUpdateTime = nowText()
  return successBody
}

export function applyEditRemark(raw: unknown) {
  const query = readQuery(raw)
  const row = findMemberById(query.id)
  if (!row) return { code: '0', msg: '会员不存在', data: null, success: false }
  row.remark = query.remark == null ? '' : String(query.remark)
  return successBody
}

export function applyRecharge(raw: unknown) {
  const query = readQuery(raw)
  const row = findMemberById(query.id ?? query.memberId)
  if (!row) return { code: '0', msg: '会员不存在', data: null, success: false }
  const arb = Math.max(0, num(query.arbBuyAmount))
  const cpb = Math.max(0, num(query.buyAmount))
  const remark = query.remark == null ? '' : String(query.remark)
  if (arb > 0) {
    const before = row.arbBalance
    const after = round2(before + arb)
    row.arbBalance = after
    appendMemberChange({
      memberId: row.id,
      changeType: 4,
      fundType: 1,
      amountChange: arb,
      beforeChange: before,
      afterChange: after,
      remark: remark || '人工上分-ARB',
    })
  }
  if (cpb > 0) {
    const before = row.balance
    const after = round2(before + cpb)
    row.balance = after
    appendMemberChange({
      memberId: row.id,
      changeType: 4,
      fundType: 2,
      amountChange: cpb,
      beforeChange: before,
      afterChange: after,
      remark: remark || '人工上分-CPB',
    })
  }
  row.totalBalance = round2(row.totalBalance + arb + cpb)
  row.rechargeNum += arb > 0 || cpb > 0 ? 1 : 0
  row.rechargeTotalAmount = round2(row.rechargeTotalAmount + arb + cpb)
  syncMemberTotals(row)
  return successBody
}

export function applyWithdrawal(raw: unknown) {
  const query = readQuery(raw)
  const row = findMemberById(query.id ?? query.memberId)
  if (!row) return { code: '0', msg: '会员不存在', data: null, success: false }
  const arb = Math.max(0, num(query.arbSellAmount))
  const cpb = Math.max(0, num(query.sellAmount))
  const remark = query.remark == null ? '' : String(query.remark)
  if (arb > 0) {
    const before = row.arbBalance
    const move = Math.min(arb, before)
    const after = round2(before - move)
    row.arbBalance = after
    appendMemberChange({
      memberId: row.id,
      changeType: 7,
      fundType: 1,
      amountChange: -move,
      beforeChange: before,
      afterChange: after,
      remark: remark || '人工下分-ARB',
    })
  }
  if (cpb > 0) {
    const before = row.balance
    const move = Math.min(cpb, before)
    const after = round2(before - move)
    row.balance = after
    appendMemberChange({
      memberId: row.id,
      changeType: 7,
      fundType: 2,
      amountChange: -move,
      beforeChange: before,
      afterChange: after,
      remark: remark || '人工下分-CPB',
    })
  }
  row.totalBalance = round2(Math.max(0, row.totalBalance - arb - cpb))
  row.withdrawNum += arb > 0 || cpb > 0 ? 1 : 0
  row.withdrawTotalAmount = round2(row.withdrawTotalAmount + arb + cpb)
  syncMemberTotals(row)
  return successBody
}

// 冻结：从 CPB 可用余额挪到 CPB 冻结余额。页面当前只传一个 frozenAmount。
export function applyFreeze(raw: unknown) {
  const query = readQuery(raw)
  const row = findMemberById(query.id ?? query.memberId)
  if (!row) return { code: '0', msg: '会员不存在', data: null, success: false }
  const amount = Math.max(0, num(query.frozenAmount))
  if (amount <= 0) return successBody
  const move = Math.min(amount, row.balance)
  const before = row.balance
  const after = round2(before - move)
  row.balance = after
  row.biFrozenAmount = round2(Number(row.biFrozenAmount || 0) + move)
  row.totalBalance = round2(Math.max(0, row.totalBalance - move))
  appendMemberChange({
    memberId: row.id,
    changeType: 5,
    fundType: 2,
    amountChange: -move,
    beforeChange: before,
    afterChange: after,
    remark: query.remark == null ? '后台冻结' : String(query.remark),
    orderNo: query.platformOrderNo ? String(query.platformOrderNo) : undefined,
  })
  syncMemberTotals(row)
  return successBody
}

// 解冻：从 CPB 冻结余额挪回 CPB 可用余额。platformOrderNo 原型只接收，不校验。
export function applyUnfreeze(raw: unknown) {
  const query = readQuery(raw)
  const row = findMemberById(query.id ?? query.memberId)
  if (!row) return { code: '0', msg: '会员不存在', data: null, success: false }
  const amount = Math.max(0, num(query.frozenAmount))
  if (amount <= 0) return successBody
  const available = Number(row.biFrozenAmount || 0)
  const move = Math.min(amount, available)
  const before = row.balance
  const after = round2(before + move)
  row.biFrozenAmount = round2(available - move)
  row.balance = after
  row.totalBalance = round2(row.totalBalance + move)
  appendMemberChange({
    memberId: row.id,
    changeType: 6,
    fundType: 2,
    amountChange: move,
    beforeChange: before,
    afterChange: after,
    remark: query.remark == null ? '后台解冻' : String(query.remark),
    orderNo: query.platformOrderNo ? String(query.platformOrderNo) : undefined,
  })
  syncMemberTotals(row)
  return successBody
}

export function applyBonus(raw: unknown) {
  const query = readQuery(raw)
  const row = findMemberById(query.id ?? query.memberId)
  if (!row) return { code: '0', msg: '会员不存在', data: null, success: false }
  row.buyBonusProportion = num(query.buyBonusProportion)
  row.sellBonusProportion = num(query.sellBonusProportion)
  return successBody
}
