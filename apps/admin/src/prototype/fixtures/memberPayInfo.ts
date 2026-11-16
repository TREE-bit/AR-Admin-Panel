import { findMemberById, listMembers } from './memberList'
import { appUpiBankCodes } from './appUpiBanks'

// 会员详情「收款信息」Tab + 会员收款列表页共用 KYC 内存。
// 字段说明见 notes/field-notes.md §4、§5。
// KYC 卡片 type=3；USDT 单独接口，详情页再 push 成 type=700。

export interface KycPayRow {
  id: number
  kycId: number
  memberId: number
  type: 3
  bankCode: string
  upiId: string
  /** 添加收款方式时填的银行账号手机号，不必等于会员账号/会员手机号 */
  mobileNumber: string
  collectedStatus: string
  antCollectionLimit: number
  collectedAmount: number
  collectedNumber: number
  createTime: string
  updateTime: string
  /** 0 新增 1 修改 3 删除 4 禁用 5 启用 */
  operatorType: number
  updateBy: string
}

export interface UsdtPayRow {
  id: number
  memberId: number
  address: string
  /** "0" 正常 / "1" 已删除 */
  deleted: '0' | '1'
  createBy: string
  updateBy: string
  createTime: string
  updateTime: string
}

/** TRC20：T + 33 位，共 34 */
function trc20Address(seed: string) {
  const body = `${seed}PROTOUSDTADDRXXXXXXXXXXXXXXXXXXXX`.replace(/[^a-zA-Z0-9]/g, '').slice(0, 33)
  return `T${body}`
}

const successBody = {
  code: '1',
  msg: '操作成功',
  data: null,
  success: true,
}

const kycBankCodes = ['SBI', 'HDFC', 'ICICI', 'AXIS', 'PNB', 'BOB', 'KOTAK']
const operators = ['prototype', 'admin01', 'ops.li', 'risk.wang']

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

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function shiftTime(base: string, dayOffset: number, hour: number, minute: number) {
  const raw = (base || '2026-03-12 10:00:00').slice(0, 10)
  const [y, m, d] = raw.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + dayOffset, hour, minute, 0))
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())} ${pad2(dt.getUTCHours())}:${pad2(dt.getUTCMinutes())}:00`
}

/** 银行账号手机号：10 位，与会员手机号（常 91…）刻意区分，便于列表演示 */
function bankAccountPhone(memberId: number, index: number) {
  const tail = String(memberId).slice(-7)
  return `98${tail}${index}`
}

let nextKycId = 70010001
let nextUsdtId = 70020001

const kycByMember = new Map<number, KycPayRow[]>()
const usdtByMember = new Map<number, UsdtPayRow | null>()
let allSeeded = false

function seedKyc(memberId: number): KycPayRow[] {
  const member = findMemberById(memberId)
  if (!member) return []
  // 空绑定、零交易会员不给初始 KYC，方便看「新增」效果
  if (!member.bindMerchantInfoDTOS.length && member.totalBuyCount === 0) return []

  const phone0 = bankAccountPhone(memberId, 1)
  const created0 = shiftTime(member.createTime, 1, 11, 20)
  const list: KycPayRow[] = [
    {
      id: nextKycId++,
      kycId: nextKycId++,
      memberId,
      type: 3,
      bankCode: kycBankCodes[memberId % kycBankCodes.length],
      upiId: `${phone0}@oksbi`,
      mobileNumber: phone0,
      collectedStatus: member.status === '0' ? '0' : '1',
      antCollectionLimit: member.memberType === 4 ? 1 : 0,
      collectedAmount: round2(Math.min(50000, member.totalBuyAmount * 0.05) || 1200),
      collectedNumber: Math.min(40, Math.max(1, Math.floor(member.totalBuyCount / 3) || 2)),
      createTime: created0,
      updateTime: shiftTime(member.createTime, 3, 15, 40),
      operatorType: member.status === '0' ? 4 : 0,
      updateBy: operators[memberId % operators.length],
    },
  ]
  if (member.totalBuyCount >= 10) {
    const phone1 = bankAccountPhone(memberId, 2)
    list.push({
      id: nextKycId++,
      kycId: nextKycId++,
      memberId,
      type: 3,
      bankCode: kycBankCodes[(memberId + 2) % kycBankCodes.length],
      upiId: `${phone1}@paytm`,
      mobileNumber: phone1,
      collectedStatus: '1',
      antCollectionLimit: 0,
      collectedAmount: round2(Math.min(20000, member.totalSellAmount * 0.02) || 500),
      collectedNumber: Math.min(20, Math.max(1, Math.floor(member.totalSellCount / 4) || 1)),
      createTime: shiftTime(member.createTime, 5, 9, 12),
      updateTime: shiftTime(member.createTime, 8, 18, 5),
      operatorType: 1,
      updateBy: operators[(memberId + 1) % operators.length],
    })
  }
  return list
}

function seedUsdt(memberId: number): UsdtPayRow | null {
  const member = findMemberById(memberId)
  if (!member) return null
  // 钱包/蚂蚁会员且有 USDT-ARB 余额时给一条
  if (![3, 4].includes(member.memberType) || member.usdtConvertArbAmount <= 0) return null
  const created = shiftTime(member.createTime, 2, 12, 0)
  return {
    id: nextUsdtId++,
    memberId,
    address: trc20Address(String(memberId)),
    deleted: '0',
    createBy: 'system',
    updateBy: operators[memberId % operators.length],
    createTime: created,
    updateTime: shiftTime(member.createTime, 4, 16, 30),
  }
}

function ensureKyc(memberId: number) {
  if (!kycByMember.has(memberId)) kycByMember.set(memberId, seedKyc(memberId))
  return kycByMember.get(memberId)!
}

function ensureUsdt(memberId: number) {
  if (!usdtByMember.has(memberId)) usdtByMember.set(memberId, seedUsdt(memberId))
  return usdtByMember.get(memberId) ?? null
}

let allUsdtSeeded = false

function ensureAllUsdt() {
  if (allUsdtSeeded) return
  const members = listMembers()
  for (const member of members) {
    ensureUsdt(member.id)
  }
  // 保证 deleted=1 至少一条：挑一条正常记录标记删除；若没有则强制造一条
  const active = [...usdtByMember.values()].filter(Boolean) as UsdtPayRow[]
  if (active.length) {
    const doomed = active[active.length - 1]
    doomed.deleted = '1'
    doomed.updateBy = 'prototype'
    doomed.updateTime = shiftTime(doomed.createTime, 1, 10, 0)
  } else {
    const member = members[0]
    usdtByMember.set(member.id, {
      id: nextUsdtId++,
      memberId: member.id,
      address: trc20Address(`DEL${member.id}`),
      deleted: '1',
      createBy: 'system',
      updateBy: 'prototype',
      createTime: shiftTime(member.createTime, 1, 9, 0),
      updateTime: shiftTime(member.createTime, 2, 11, 0),
    })
  }
  // 再保证至少一条正常
  if (![...usdtByMember.values()].some((row) => row && row.deleted === '0')) {
    const member = members[1] || members[0]
    usdtByMember.set(member.id, {
      id: nextUsdtId++,
      memberId: member.id,
      address: trc20Address(`OK${member.id}`),
      deleted: '0',
      createBy: 'system',
      updateBy: 'admin01',
      createTime: shiftTime(member.createTime, 1, 8, 0),
      updateTime: shiftTime(member.createTime, 1, 8, 0),
    })
  }
  allUsdtSeeded = true
}

function ensureAllKyc() {
  if (allSeeded) return
  for (const member of listMembers()) {
    ensureKyc(member.id)
  }
  allSeeded = true
}

function allUsdtRows() {
  ensureAllUsdt()
  return [...usdtByMember.values()].filter(Boolean) as UsdtPayRow[]
}

function allKycRows() {
  ensureAllKyc()
  return [...kycByMember.values()].flat()
}

function nowStamp() {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

function touchRow(row: KycPayRow, operatorType: number) {
  row.operatorType = operatorType
  row.updateBy = 'prototype'
  row.updateTime = nowStamp()
}

function memberIdFromUrl(url: string, marker: string) {
  const idx = url.indexOf(marker)
  if (idx < 0) return 0
  const rest = url.slice(idx + marker.length).split(/[?#]/)[0]
  return Number(rest) || 0
}

function matchTimeRange(value: string, start?: string, end?: string) {
  if (!value) return !(start || end)
  if (start && value < start) return false
  if (end && value > end) return false
  return true
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

export function buildKycBankCodeListBody() {
  return {
    code: '1',
    msg: '操作成功',
    data: [...kycBankCodes, ...appUpiBankCodes()],
    success: true,
  }
}

export function buildBankCodeMapBody() {
  const data: Record<string, string> = {
    SBI: 'State Bank of India',
    HDFC: 'HDFC Bank',
    ICICI: 'ICICI Bank',
    AXIS: 'Axis Bank',
    PNB: 'Punjab National Bank',
    BOB: 'Bank of Baroda',
    KOTAK: 'Kotak Mahindra Bank',
  }
  return { code: '1', msg: '操作成功', data, success: true }
}

export function buildCollectionListBody(raw: unknown) {
  const query = readQuery(raw)
  const memberId = query.memberId != null && query.memberId !== '' ? Number(query.memberId) : 0
  let list = memberId ? ensureKyc(memberId).map((row) => ({ ...row })) : allKycRows().map((row) => ({ ...row }))

  const collectionInfoId = query.collectionInfoId ?? query.id
  if (collectionInfoId != null && collectionInfoId !== '') {
    list = list.filter((row) => String(row.id) === String(collectionInfoId))
  }
  if (query.kycId != null && query.kycId !== '') {
    list = list.filter((row) => String(row.kycId) === String(query.kycId))
  }
  if (query.mobileNumber != null && query.mobileNumber !== '') {
    list = list.filter((row) => String(row.mobileNumber).includes(String(query.mobileNumber)))
  }
  if (query.upiId != null && query.upiId !== '') {
    list = list.filter((row) => String(row.upiId).includes(String(query.upiId)))
  }
  if (query.collectedStatus != null && query.collectedStatus !== '') {
    list = list.filter((row) => String(row.collectedStatus) === String(query.collectedStatus))
  }
  if (query.startCreateTime || query.endCreateTime) {
    list = list.filter((row) => matchTimeRange(row.createTime, query.startCreateTime, query.endCreateTime))
  }
  if (query.startUpdateTime || query.endUpdateTime) {
    list = list.filter((row) => matchTimeRange(row.updateTime, query.startUpdateTime, query.endUpdateTime))
  }

  list.sort((a, b) => (a.createTime < b.createTime ? 1 : a.createTime > b.createTime ? -1 : b.id - a.id))

  const pageNo = Math.max(1, Number(query.pageNo) || 1)
  const pageSize = Math.max(1, Number(query.pageSize) || 20)
  const total = list.length
  const start = (pageNo - 1) * pageSize
  const page = list.slice(start, start + pageSize)

  return {
    code: '1',
    msg: '操作成功',
    data: page,
    total,
    success: true,
  }
}

export function buildUsdtReceiveListBody(raw: unknown) {
  const query = readQuery(raw)
  let list = allUsdtRows()
  if (hasFilter(query.memberId)) {
    list = list.filter((row) => String(row.memberId) === String(query.memberId))
  }
  if (hasFilter(query.address)) {
    list = list.filter((row) => includesText(row.address, query.address))
  }
  if (hasFilter(query.deleted)) {
    list = list.filter((row) => String(row.deleted) === String(query.deleted))
  }
  if (hasFilter(query.createTimeStart)) {
    list = list.filter((row) => row.createTime >= String(query.createTimeStart))
  }
  if (hasFilter(query.createTimeEnd)) {
    list = list.filter((row) => row.createTime <= String(query.createTimeEnd))
  }
  list = [...list].sort((a, b) => (a.createTime < b.createTime ? 1 : -1))
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const start = (pageNo - 1) * pageSize
  const page = list.slice(start, start + pageSize).map((row) => ({ ...row }))
  return {
    code: '1',
    msg: '操作成功',
    data: {
      list: page,
      total: list.length,
    },
    success: true,
  }
}

export function buildUsdtByMemberBody(url: string) {
  const memberId = memberIdFromUrl(url, '/getUsdtReceiveInfoByMemberId/')
  const row = memberId ? ensureUsdt(memberId) : null
  return {
    code: '1',
    msg: '操作成功',
    data: row ? { ...row } : null,
    success: true,
  }
}

/** 收款详情「查看」：页面读 res.data[0] */
export function buildCollectionInfoBody(raw: unknown) {
  const query = readQuery(raw)
  const id = Number(query.id ?? query.collectionInfoId)
  ensureAllKyc()
  const row = id ? allKycRows().find((item) => item.id === id) : undefined
  return {
    code: '1',
    msg: '操作成功',
    data: row ? [{ ...row }] : [],
    total: row ? 1 : 0,
    success: true,
  }
}

export function applyAddKycPartner(raw: unknown) {
  const query = readQuery(raw)
  const memberId = Number(query.memberId)
  if (!memberId) return { code: '0', msg: '会员不存在', data: null, success: false }
  if (!query.bankCode) return { code: '0', msg: '请选择银行名称', data: null, success: false }
  if (!query.upiId) return { code: '0', msg: '请输入UPI ID', data: null, success: false }
  const list = ensureKyc(memberId)
  const id = nextKycId++
  const kycId = nextKycId++
  const stamp = nowStamp()
  list.unshift({
    id,
    kycId,
    memberId,
    type: 3,
    bankCode: String(query.bankCode),
    upiId: String(query.upiId),
    mobileNumber: String(query.account || query.mobileNumber || ''),
    collectedStatus: '1',
    antCollectionLimit: 0,
    collectedAmount: 0,
    collectedNumber: 0,
    createTime: stamp,
    updateTime: stamp,
    operatorType: 0,
    updateBy: 'prototype',
  })
  return successBody
}

export function applyUpdateKycPartner(raw: unknown) {
  const query = readQuery(raw)
  const collectionInfoId = Number(query.collectionInfoId ?? query.id)
  let row: KycPayRow | undefined
  if (query.memberId != null && query.memberId !== '') {
    row = ensureKyc(Number(query.memberId)).find((item) => item.id === collectionInfoId)
  }
  if (!row) {
    row = allKycRows().find((item) => item.id === collectionInfoId)
  }
  if (!row) return { code: '0', msg: '收款信息不存在', data: null, success: false }
  if (query.bankCode != null) row.bankCode = String(query.bankCode)
  if (query.upiId != null) row.upiId = String(query.upiId)
  if (query.account != null || query.mobileNumber != null) {
    row.mobileNumber = String(query.account ?? query.mobileNumber)
  }
  touchRow(row, 1)
  return successBody
}

/** 会员收款列表页编辑：POST /collectionInfoAdmin/update */
export function applyUpdateCollection(raw: unknown) {
  return applyUpdateKycPartner(raw)
}

export function applyDeleteCollection(raw: unknown) {
  const query = readQuery(raw)
  const id = Number(query.id)
  for (const [memberId, list] of kycByMember.entries()) {
    const next = list.filter((item) => item.id !== id)
    if (next.length !== list.length) {
      kycByMember.set(memberId, next)
      return successBody
    }
  }
  return successBody
}

export function applyCollectionUpdateStatus(raw: unknown) {
  const query = readQuery(raw)
  const id = Number(query.id)
  // status: 4 禁用，5 启用（页面 showChangeDis 传入）
  const enabled = Number(query.status) === 5
  for (const list of kycByMember.values()) {
    const row = list.find((item) => item.id === id)
    if (row) {
      row.collectedStatus = enabled ? '1' : '0'
      touchRow(row, enabled ? 5 : 4)
      return successBody
    }
  }
  return successBody
}

export function applyCreateUsdt(raw: unknown) {
  const query = readQuery(raw)
  const memberId = Number(query.memberId)
  if (!memberId) return { code: '0', msg: '会员不存在', data: null, success: false }
  if (!query.address) return { code: '0', msg: '请输入USDT收款地址', data: null, success: false }
  const existing = ensureUsdt(memberId)
  const now = shiftTime(findMemberById(memberId)?.createTime || '2026-03-12 10:00:00', 0, 12, 0)
  if (existing) {
    existing.address = String(query.address)
    existing.updateBy = 'prototype'
    existing.updateTime = now
    existing.deleted = '0'
  } else {
    usdtByMember.set(memberId, {
      id: nextUsdtId++,
      memberId,
      address: String(query.address),
      deleted: '0',
      createBy: 'prototype',
      updateBy: 'prototype',
      createTime: now,
      updateTime: now,
    })
  }
  return successBody
}

export function applyUpdateUsdt(url: string, raw: unknown) {
  const id = memberIdFromUrl(url, '/updateUsdtReceiveInfo/')
  const query = readQuery(raw)
  for (const [memberId, row] of usdtByMember.entries()) {
    if (row && row.id === id) {
      if (query.address != null) row.address = String(query.address)
      row.updateBy = 'prototype'
      row.updateTime = shiftTime(row.createTime, 0, 18, 0)
      usdtByMember.set(memberId, row)
      return successBody
    }
  }
  return { code: '0', msg: 'USDT收款信息不存在', data: null, success: false }
}

export function applyDeleteUsdt(url: string) {
  const clean = (url || '').split('?')[0].replace(/\/$/, '')
  const id = Number(clean.slice(clean.lastIndexOf('/') + 1))
  for (const [memberId, row] of usdtByMember.entries()) {
    if (row && row.id === id) {
      row.deleted = '1'
      row.updateBy = 'prototype'
      row.updateTime = shiftTime(row.createTime, 0, 19, 0)
      usdtByMember.set(memberId, row)
      return successBody
    }
  }
  return successBody
}
