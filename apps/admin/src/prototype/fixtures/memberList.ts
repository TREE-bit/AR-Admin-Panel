import type { MemberListRow } from './memberList.types'

// 字段含义以 apps/admin/src/prototype/notes/field-notes.md §1 为准。
// 每次返回新对象，避免页面把金额格式化、把备注按 | 拆开后污染源数据。

export type MemberGroupRow = {
  id: number
  name: string
  buyAmount: number
  buyCount: number
  sellAmount: number
  sellCount: number
  /** 逗号拼接的权限 code */
  authList: string
}

export const memberGroups: MemberGroupRow[] = [
  { id: 1, name: '普通会员', buyAmount: 0, buyCount: 0, sellAmount: 0, sellCount: 0, authList: 'buy,sell' },
  { id: 2, name: '活跃会员', buyAmount: 1000, buyCount: 5, sellAmount: 500, sellCount: 3, authList: 'buy,sell,withdraw' },
  { id: 3, name: '限制观察', buyAmount: 0, buyCount: 0, sellAmount: 0, sellCount: 0, authList: 'buy' },
  { id: 4, name: '内部账号', buyAmount: 0, buyCount: 0, sellAmount: 0, sellCount: 0, authList: 'buy,sell,withdraw,recharge' },
]

const groupAuthOptions = [
  { code: 'buy', name: '买入' },
  { code: 'sell', name: '卖出' },
  { code: 'withdraw', name: '提现' },
  { code: 'recharge', name: '充值' },
]

let nextGroupId = 5

const rows: MemberListRow[] = [
  {
    id: 10086001,
    merchantName: '星河商城',
    bindMerchantInfoDTOS: [
      { merchantCode: 'M10021', merchantMemberId: 'EXT88001' },
      { merchantCode: 'M10058', merchantMemberId: 'EXT88018' },
    ],
    memberAccount: '9100001001',
    arbBalance: 15230.5,
    balance: 860.25,
    usdtConvertArbAmount: 3200,
    level: 3,
    mobileNumber: '9100001001',
    emailAccount: 'proto01@example.com',
    memberGroup: 2,
    cashBackFrozenAmount: 120,
    totalBalance: 17890.75,
    owedAmount: 0,
    totalBuyCount: 42,
    totalBuyAmount: 128000.5,
    totalSellCount: 17,
    totalSellAmount: 64000,
    totalBiFrozenAmount: 500,
    totalFrozenAmount: 1200,
    memberType: 3,
    realName: '陈一鸣',
    rechargeNum: 8,
    rechargeTotalAmount: 20000,
    withdrawNum: 3,
    withdrawTotalAmount: 5000,
    status: '1',
    onlineStatus: '1',
    createTime: '2026-03-12 10:21:08',
    remark: '首充已完成|活跃用户',
    buyStatus: 1,
    sellStatus: 1,
    buyDisableTime: 0,
    sellDisableTime: 0,
  },
  {
    id: 10086002,
    merchantName: '快付钱包',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10058', merchantMemberId: 'EXT77102' }],
    memberAccount: '9100001002',
    arbBalance: 86040,
    balance: 15420.8,
    usdtConvertArbAmount: 22000,
    level: 8,
    mobileNumber: '9100001002',
    emailAccount: 'proto02@example.com',
    memberGroup: 2,
    cashBackFrozenAmount: 0,
    totalBalance: 118260.8,
    owedAmount: 0,
    totalBuyCount: 186,
    totalBuyAmount: 960000,
    totalSellCount: 140,
    totalSellAmount: 880000,
    totalBiFrozenAmount: 2600,
    totalFrozenAmount: 8400,
    memberType: 4,
    realName: '林小雨',
    rechargeNum: 36,
    rechargeTotalAmount: 150000,
    withdrawNum: 22,
    withdrawTotalAmount: 98000,
    status: '1',
    onlineStatus: '1',
    createTime: '2025-11-02 09:12:33',
    remark: '蚂蚁会员|高等级',
    buyStatus: 1,
    sellStatus: 1,
    buyDisableTime: 0,
    sellDisableTime: 0,
  },
  {
    id: 10086003,
    merchantName: '北境博彩',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10073', merchantMemberId: 'EXT66003' }],
    memberAccount: '9100001003',
    arbBalance: 0,
    balance: 20,
    usdtConvertArbAmount: 0,
    level: 0,
    mobileNumber: '9100001003',
    emailAccount: 'proto03@example.com',
    memberGroup: 3,
    cashBackFrozenAmount: 0,
    totalBalance: 0,
    owedAmount: 350.5,
    totalBuyCount: 2,
    totalBuyAmount: 800,
    totalSellCount: 1,
    totalSellAmount: 200,
    totalBiFrozenAmount: 20,
    totalFrozenAmount: 0,
    memberType: 2,
    realName: '赵文博',
    rechargeNum: 1,
    rechargeTotalAmount: 500,
    withdrawNum: 0,
    withdrawTotalAmount: 0,
    status: '0',
    onlineStatus: '0',
    createTime: '2026-08-19 18:44:02',
    remark: '账号禁用|欠费',
    buyStatus: 0,
    sellStatus: 0,
    buyDisableTime: -1,
    sellDisableTime: -1,
    },
  {
    id: 10086004,
    merchantName: '星河商城',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10021', merchantMemberId: 'EXT88044' }],
    memberAccount: '9100001004',
    arbBalance: 6400,
    balance: 300,
    usdtConvertArbAmount: 1500,
    level: 2,
    mobileNumber: '9198123004',
    emailAccount: 'proto04@example.com',
    memberGroup: 1,
    cashBackFrozenAmount: 80,
    totalBalance: 7200,
    owedAmount: 0,
    totalBuyCount: 11,
    totalBuyAmount: 18600,
    totalSellCount: 4,
    totalSellAmount: 4200,
    totalBiFrozenAmount: 100,
    totalFrozenAmount: 900,
    memberType: 3,
    realName: '周宁',
    rechargeNum: 4,
    rechargeTotalAmount: 6000,
    withdrawNum: 1,
    withdrawTotalAmount: 800,
    status: '1',
    onlineStatus: '1',
    createTime: '2026-01-07 14:05:41',
    remark: '买入永久禁用',
    buyStatus: 0,
    sellStatus: 1,
    buyDisableTime: -1,
    sellDisableTime: 0,
  },
  {
    id: 10086005,
    merchantName: '快付钱包',
    bindMerchantInfoDTOS: [
      { merchantCode: 'M10058', merchantMemberId: 'EXT77155' },
      { merchantCode: 'M10021', merchantMemberId: 'EXT77156' },
      { merchantCode: 'M10073', merchantMemberId: 'EXT77157' },
    ],
    memberAccount: '9100001005',
    arbBalance: 980.4,
    balance: 120.6,
    usdtConvertArbAmount: 0,
    level: 1,
    mobileNumber: '9100001005',
    emailAccount: 'proto05@example.com',
    memberGroup: 1,
    cashBackFrozenAmount: 15.5,
    totalBalance: 900,
    owedAmount: 0,
    totalBuyCount: 6,
    totalBuyAmount: 2400,
    totalSellCount: 9,
    totalSellAmount: 5100,
    totalBiFrozenAmount: 0,
    totalFrozenAmount: 200,
    memberType: 5,
    realName: '吴凯',
    rechargeNum: 2,
    rechargeTotalAmount: 1000,
    withdrawNum: 2,
    withdrawTotalAmount: 600,
    status: '1',
    onlineStatus: '0',
    createTime: '2026-06-21 11:30:00',
    remark: '卖出临时禁用',
    buyStatus: 1,
    sellStatus: 0,
    buyDisableTime: 0,
    sellDisableTime: 90,
  },
  {
    id: 10086006,
    merchantName: '星河商城',
    bindMerchantInfoDTOS: [],
    memberAccount: '9100001006',
    arbBalance: 0,
    balance: 0,
    usdtConvertArbAmount: 0,
    level: 0,
    mobileNumber: '9100001006',
    emailAccount: '',
    memberGroup: 1,
    cashBackFrozenAmount: 0,
    totalBalance: 0,
    owedAmount: 0,
    totalBuyCount: 0,
    totalBuyAmount: 0,
    totalSellCount: 0,
    totalSellAmount: 0,
    totalBiFrozenAmount: 0,
    totalFrozenAmount: 0,
    memberType: 1,
    realName: '',
    rechargeNum: 0,
    rechargeTotalAmount: 0,
    withdrawNum: 0,
    withdrawTotalAmount: 0,
    status: '1',
    onlineStatus: '0',
    createTime: '2026-10-28 08:16:19',
    remark: '',
    buyStatus: 1,
    sellStatus: 1,
    buyDisableTime: 0,
    sellDisableTime: 0,
  },
  {
    id: 10086007,
    merchantName: '北境博彩',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10073', merchantMemberId: 'NPC0007' }],
    memberAccount: 'npc0007',
    arbBalance: 50000,
    balance: 50000,
    usdtConvertArbAmount: 50000,
    level: 5,
    mobileNumber: '9100001007',
    emailAccount: 'npc07@example.com',
    memberGroup: 4,
    cashBackFrozenAmount: 0,
    totalBalance: 150000,
    owedAmount: 0,
    totalBuyCount: 320,
    totalBuyAmount: 2500000,
    totalSellCount: 318,
    totalSellAmount: 2490000,
    totalBiFrozenAmount: 0,
    totalFrozenAmount: 0,
    memberType: 6,
    realName: '系统托号',
    rechargeNum: 0,
    rechargeTotalAmount: 0,
    withdrawNum: 0,
    withdrawTotalAmount: 0,
    status: '1',
    onlineStatus: '1',
    createTime: '2025-06-01 00:00:00',
    remark: 'NPC|内部造市',
    buyStatus: 1,
    sellStatus: 1,
    buyDisableTime: 0,
    sellDisableTime: 0,
  },
  {
    id: 10086008,
    merchantName: '内部测试商户',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10001', merchantMemberId: 'IN8008' }],
    memberAccount: '9100001008',
    arbBalance: 2100,
    balance: 80,
    usdtConvertArbAmount: 600,
    level: 4,
    mobileNumber: '9100001008',
    emailAccount: 'proto08@example.com',
    memberGroup: 4,
    cashBackFrozenAmount: 40,
    totalBalance: 2300,
    owedAmount: 0,
    totalBuyCount: 15,
    totalBuyAmount: 9800,
    totalSellCount: 12,
    totalSellAmount: 7600,
    totalBiFrozenAmount: 180,
    totalFrozenAmount: 300,
    memberType: 1,
    realName: '郑晓',
    rechargeNum: 5,
    rechargeTotalAmount: 4000,
    withdrawNum: 2,
    withdrawTotalAmount: 1500,
    status: '1',
    onlineStatus: '1',
    createTime: '2026-02-14 16:22:47',
    remark: '内部账号',
    buyStatus: 1,
    sellStatus: 1,
    buyDisableTime: 0,
    sellDisableTime: 0,
  },
  {
    id: 10086009,
    merchantName: '快付钱包',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10058', merchantMemberId: 'EXT99009' }],
    memberAccount: '9100001009',
    arbBalance: 430.2,
    balance: 88.8,
    usdtConvertArbAmount: 100,
    level: 1,
    mobileNumber: '9100001009',
    emailAccount: 'proto09@example.com',
    memberGroup: 3,
    cashBackFrozenAmount: 200,
    totalBalance: 200,
    owedAmount: 1280,
    totalBuyCount: 7,
    totalBuyAmount: 3600,
    totalSellCount: 2,
    totalSellAmount: 900,
    totalBiFrozenAmount: 218.2,
    totalFrozenAmount: 200.8,
    memberType: 2,
    realName: '孙磊',
    rechargeNum: 3,
    rechargeTotalAmount: 2200,
    withdrawNum: 1,
    withdrawTotalAmount: 400,
    status: '1',
    onlineStatus: '0',
    createTime: '2026-04-03 19:08:55',
    remark: '有欠费|限制观察|买入七天禁用',
    buyStatus: 0,
    sellStatus: 1,
    buyDisableTime: 10080,
    sellDisableTime: 0,
  },
  {
    id: 10086010,
    merchantName: '星河商城',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10021', merchantMemberId: 'EXT88010' }],
    memberAccount: 'merchant_user_10',
    arbBalance: 12880,
    balance: 640,
    usdtConvertArbAmount: 0,
    level: 6,
    mobileNumber: '9100001010',
    emailAccount: 'proto10@example.com',
    memberGroup: 2,
    cashBackFrozenAmount: 0,
    totalBalance: 11000,
    owedAmount: 0,
    totalBuyCount: 54,
    totalBuyAmount: 220000,
    totalSellCount: 48,
    totalSellAmount: 198000,
    totalBiFrozenAmount: 1520,
    totalFrozenAmount: 1000,
    memberType: 5,
    realName: '钱芳',
    rechargeNum: 12,
    rechargeTotalAmount: 36000,
    withdrawNum: 9,
    withdrawTotalAmount: 21000,
    status: '1',
    onlineStatus: '1',
    createTime: '2026-05-16 13:41:26',
    remark: '',
    buyStatus: 1,
    sellStatus: 0,
    buyDisableTime: 0,
    sellDisableTime: 1440,
  },
  {
    id: 10086011,
    merchantName: '北境博彩',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10073', merchantMemberId: 'EXT66011' }],
    memberAccount: '9100001011',
    arbBalance: 75,
    balance: 10,
    usdtConvertArbAmount: 25,
    level: 0,
    mobileNumber: '9100001011',
    emailAccount: 'proto11@example.com',
    memberGroup: 1,
    cashBackFrozenAmount: 5,
    totalBalance: 90,
    owedAmount: 0,
    totalBuyCount: 1,
    totalBuyAmount: 100,
    totalSellCount: 0,
    totalSellAmount: 0,
    totalBiFrozenAmount: 10,
    totalFrozenAmount: 10,
    memberType: 3,
    realName: '冯涛',
    rechargeNum: 1,
    rechargeTotalAmount: 100,
    withdrawNum: 0,
    withdrawTotalAmount: 0,
    status: '1',
    onlineStatus: '1',
    createTime: '2026-09-30 21:17:03',
    remark: '新注册',
    buyStatus: 1,
    sellStatus: 1,
    buyDisableTime: 0,
    sellDisableTime: 0,
  },
  {
    id: 10086012,
    merchantName: '快付钱包',
    bindMerchantInfoDTOS: [
      { merchantCode: 'M10058', merchantMemberId: 'EXT77112' },
      { merchantCode: 'M10021', merchantMemberId: 'EXT77113' },
    ],
    memberAccount: '9100001012',
    arbBalance: 7600,
    balance: 2400,
    usdtConvertArbAmount: 18000,
    level: 10,
    mobileNumber: '9100001012',
    emailAccount: 'proto12@example.com',
    memberGroup: 2,
    cashBackFrozenAmount: 600,
    totalBalance: 24000,
    owedAmount: 0,
    totalBuyCount: 90,
    totalBuyAmount: 410000,
    totalSellCount: 70,
    totalSellAmount: 360000,
    totalBiFrozenAmount: 800,
    totalFrozenAmount: 3200,
    memberType: 4,
    realName: '褚敏',
    rechargeNum: 18,
    rechargeTotalAmount: 72000,
    withdrawNum: 11,
    withdrawTotalAmount: 30000,
    status: '1',
    onlineStatus: '0',
    createTime: '2025-12-20 07:55:12',
    remark: 'USDT余额较高|离线',
    buyStatus: 1,
    sellStatus: 1,
    buyDisableTime: 0,
    sellDisableTime: 0,
  },
  {
    id: 10086013,
    merchantName: '星河商城',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10021', merchantMemberId: 'EXT88013' }],
    memberAccount: '9100001013',
    arbBalance: 300,
    balance: 0,
    usdtConvertArbAmount: 0,
    level: 2,
    mobileNumber: '9100001013',
    emailAccount: 'proto13@example.com',
    memberGroup: 3,
    cashBackFrozenAmount: 0,
    totalBalance: 0,
    owedAmount: 60,
    totalBuyCount: 4,
    totalBuyAmount: 1500,
    totalSellCount: 3,
    totalSellAmount: 900,
    totalBiFrozenAmount: 300,
    totalFrozenAmount: 0,
    memberType: 3,
    realName: '卫强',
    rechargeNum: 2,
    rechargeTotalAmount: 800,
    withdrawNum: 1,
    withdrawTotalAmount: 200,
    status: '0',
    onlineStatus: '0',
    createTime: '2026-07-11 12:00:00',
    remark: '账号禁用|卖出可开',
    buyStatus: 0,
    sellStatus: 1,
    buyDisableTime: 30,
    sellDisableTime: 0,
  },
  {
    id: 10086014,
    merchantName: '内部测试商户',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10001', merchantMemberId: 'IN8014' }],
    memberAccount: '9100001014',
    arbBalance: 9999.99,
    balance: 1.01,
    usdtConvertArbAmount: 50.5,
    level: 7,
    mobileNumber: '9100001014',
    emailAccount: 'proto14@example.com',
    memberGroup: 4,
    cashBackFrozenAmount: 12.34,
    totalBalance: 9000,
    owedAmount: 0,
    totalBuyCount: 28,
    totalBuyAmount: 45678.9,
    totalSellCount: 19,
    totalSellAmount: 12345.67,
    totalBiFrozenAmount: 333.33,
    totalFrozenAmount: 777.77,
    memberType: 1,
    realName: '蒋雪',
    rechargeNum: 6,
    rechargeTotalAmount: 8888.88,
    withdrawNum: 4,
    withdrawTotalAmount: 2222.22,
    status: '1',
    onlineStatus: '1',
    createTime: '2026-02-02 02:02:02',
    remark: '小数金额',
    buyStatus: 1,
    sellStatus: 1,
    buyDisableTime: 0,
    sellDisableTime: 0,
  },
  {
    id: 10086015,
    merchantName: '北境博彩',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10073', merchantMemberId: 'EXT66015' }],
    memberAccount: '9100001015',
    arbBalance: 4100,
    balance: 260,
    usdtConvertArbAmount: 800,
    level: 3,
    mobileNumber: '9100001015',
    emailAccount: 'proto15@example.com',
    memberGroup: 1,
    cashBackFrozenAmount: 0,
    totalBalance: 4500,
    owedAmount: 0,
    totalBuyCount: 13,
    totalBuyAmount: 8700,
    totalSellCount: 13,
    totalSellAmount: 8700,
    totalBiFrozenAmount: 160,
    totalFrozenAmount: 500,
    memberType: 6,
    realName: '沈浩',
    rechargeNum: 3,
    rechargeTotalAmount: 1500,
    withdrawNum: 1,
    withdrawTotalAmount: 300,
    status: '1',
    onlineStatus: '1',
    createTime: '2026-08-08 20:20:20',
    remark: '买卖金额持平',
    buyStatus: 1,
    sellStatus: 0,
    buyDisableTime: 0,
    sellDisableTime: 180,
  },
  {
    id: 10086016,
    merchantName: '快付钱包',
    bindMerchantInfoDTOS: [{ merchantCode: 'M10058', merchantMemberId: 'EXT77116' }],
    memberAccount: '9100001016',
    arbBalance: 50,
    balance: 50,
    usdtConvertArbAmount: 50,
    level: 9,
    mobileNumber: '9100001016',
    emailAccount: 'proto16@example.com',
    memberGroup: 2,
    cashBackFrozenAmount: 8,
    totalBalance: 120,
    owedAmount: 15.75,
    totalBuyCount: 3,
    totalBuyAmount: 450,
    totalSellCount: 5,
    totalSellAmount: 980,
    totalBiFrozenAmount: 15,
    totalFrozenAmount: 15,
    memberType: 4,
    realName: '韩冰',
    rechargeNum: 1,
    rechargeTotalAmount: 200,
    withdrawNum: 1,
    withdrawTotalAmount: 50,
    status: '1',
    onlineStatus: '0',
    createTime: '2026-11-01 23:59:00',
    remark: '卖超买|小额欠费',
    buyStatus: 1,
    sellStatus: 1,
    buyDisableTime: 0,
    sellDisableTime: 0,
  },
]

function round2(value: number) {
  return Math.round(value * 100) / 100
}

function splitAmount(total: number, arbBalance: number, cpbBalance: number) {
  if (total <= 0) return { arb: 0, cpb: 0 }
  const weight = arbBalance + cpbBalance
  if (weight <= 0) return { arb: 0, cpb: round2(total) }
  const arb = round2(total * (arbBalance / weight))
  return { arb, cpb: round2(total - arb) }
}

function offsetTime(base: string, hours: number) {
  const date = new Date(base.replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return base
  date.setHours(date.getHours() + hours)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function finish(row: MemberListRow): MemberListRow {
  const binds = row.bindMerchantInfoDTOS.map((item) => ({ ...item }))
  const frozen = splitAmount(row.totalFrozenAmount, row.arbBalance, row.balance)
  const biFrozen = splitAmount(row.totalBiFrozenAmount, row.arbBalance, row.balance)
  const seed = row.id
  const buySuccess = Math.min(row.totalBuyCount, Math.max(0, Math.floor(row.totalBuyCount * 0.85)))
  const sellSuccess = Math.min(row.totalSellCount, Math.max(0, Math.floor(row.totalSellCount * 0.88)))
  return {
    ...row,
    memberId: row.id,
    bindMerchantInfoDTOS: binds,
    countOfMerchant: binds.length,
    externalMemberId: binds[0]?.merchantMemberId || '',
    // 正式公式会剔除充值和提现，体现钱包内纯粹买卖。公式未给出前，假数据用买入减卖出占位。
    netBuySellAmount: round2(row.totalBuyAmount - row.totalSellAmount),
    registerTime: row.createTime,
    registerIp: `103.${20 + (seed % 30)}.${seed % 255}.${(seed * 7) % 255}`,
    registerDevice: seed % 3 === 0 ? 'iOS 17.4' : seed % 3 === 1 ? 'Android 14' : 'Windows Chrome',
    firstLoginTime: offsetTime(row.createTime, 1),
    firstLoginIp: `49.${10 + (seed % 40)}.${(seed * 3) % 255}.${(seed * 11) % 255}`,
    merchantMemberIp: binds.length ? `112.${seed % 200}.${(seed * 5) % 255}.${(seed * 13) % 255}` : '',
    walletAddress: [3, 4].includes(row.memberType) ? `TProto${String(seed).slice(-6)}WalletAddrXXXXXXXX` : '',
    loginPwdUpdateTime: offsetTime(row.createTime, 24 * 3),
    loginPwdUpdateName: 'prototype',
    payPwdCreateTime: offsetTime(row.createTime, 2),
    payPwdUpdateTime: offsetTime(row.createTime, 24 * 5),
    arbFrozenAmount: frozen.arb,
    frozenAmount: frozen.cpb,
    arbBiFrozenAmount: biFrozen.arb,
    biFrozenAmount: biFrozen.cpb,
    transactionRestrictionsAmount: row.memberGroup === 3 ? round2(row.totalBalance * 0.1) : 0,
    totalBuySuccessCount: buySuccess,
    totalBuyBonus: round2(row.totalBuyAmount * 0.002),
    totalSellSuccessCount: sellSuccess,
    totalSellBonus: round2(row.totalSellAmount * 0.002),
    appealCount: Math.min(3, Math.floor((row.totalBuyCount + row.totalSellCount) / 40)),
    buyBonusProportion: 0,
    sellBonusProportion: 0,
  }
}

const members = rows.map(finish)

export function findMemberById(id: unknown) {
  return members.find((item) => String(item.id) === String(id) || String(item.memberId) === String(id))
}

export function listMembers() {
  return members
}

export function syncMemberTotals(row: MemberListRow) {
  row.totalFrozenAmount = round2(Number(row.arbFrozenAmount || 0) + Number(row.frozenAmount || 0))
  row.totalBiFrozenAmount = round2(Number(row.arbBiFrozenAmount || 0) + Number(row.biFrozenAmount || 0))
  row.netBuySellAmount = round2(row.totalBuyAmount - row.totalSellAmount)
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

function hasFilter(value: unknown) {
  return value !== undefined && value !== null && value !== ''
}

function includesText(source: unknown, keyword: unknown) {
  if (!hasFilter(keyword)) return true
  return String(source ?? '')
    .toLowerCase()
    .includes(String(keyword).trim().toLowerCase())
}

function matchMembers(query: Record<string, any>) {
  return members.filter((row) => {
    if (hasFilter(query.memberId) && !includesText(row.id, query.memberId) && !includesText(row.memberId, query.memberId)) {
      return false
    }
    if (!includesText(row.merchantName, query.merchantName)) return false
    if (hasFilter(query.externalMemberId)) {
      const hit = row.bindMerchantInfoDTOS.some((item) => includesText(item.merchantMemberId, query.externalMemberId))
      if (!hit && !includesText(row.externalMemberId, query.externalMemberId)) return false
    }
    if (!includesText(row.memberAccount, query.memberAccount)) return false
    if (!includesText(row.emailAccount, query.emailAccount)) return false
    if (!includesText(row.realName, query.realName)) return false
    if (!includesText(row.remark, query.remark)) return false
    if (hasFilter(query.memberType) && String(row.memberType) !== String(query.memberType)) return false
    if (hasFilter(query.memberGroupId) && String(row.memberGroup) !== String(query.memberGroupId)) return false
    if (hasFilter(query.status) && String(row.status) !== String(query.status)) return false
    if (hasFilter(query.buyStatus) && String(row.buyStatus) !== String(query.buyStatus)) return false
    if (hasFilter(query.sellStatus) && String(row.sellStatus) !== String(query.sellStatus)) return false
    if (hasFilter(query.level) && String(row.level) !== String(query.level)) return false
    if (hasFilter(query.createTimeStart) && row.createTime < String(query.createTimeStart)) return false
    if (hasFilter(query.createTimeEnd) && row.createTime > String(query.createTimeEnd)) return false
    return true
  })
}

function sortMembers(list: MemberListRow[], query: Record<string, any>) {
  const column = query.column
  if (!column) return list
  const dir = query.asc ? 1 : -1
  return [...list].sort((a, b) => {
    const av = (a as any)[column]
    const bv = (b as any)[column]
    const an = Number(av)
    const bn = Number(bv)
    if (av !== '' && bv !== '' && !Number.isNaN(an) && !Number.isNaN(bn)) return (an - bn) * dir
    return String(av ?? '').localeCompare(String(bv ?? '')) * dir
  })
}

function sum(list: MemberListRow[], key: keyof MemberListRow) {
  return round2(list.reduce((total, row) => total + Number(row[key] || 0), 0))
}

function buildExtend(page: MemberListRow[], all: MemberListRow[]) {
  const last = page[page.length - 1]
  const first = page[0]
  return {
    nextColValue: '',
    nextCursorId: last ? String(last.id) : '',
    prevColValue: '',
    prevCursorId: first ? String(first.id) : '',
    arbBalancePageTotal: sum(page, 'arbBalance'),
    cpbBalancePageTotal: sum(page, 'balance'),
    usdtConvertArbAmountPageTotal: sum(page, 'usdtConvertArbAmount'),
    balancePageTotal: sum(page, 'totalBalance'),
    owedAmountPageTotal: sum(page, 'owedAmount'),
    totalBuyAmountPageTotal: sum(page, 'totalBuyAmount'),
    totalSellAmountPageTotal: sum(page, 'totalSellAmount'),
    biFrozenAmountPageTotal: sum(page, 'totalBiFrozenAmount'),
    frozenAmountPageTotal: sum(page, 'totalFrozenAmount'),
    rechargeAmountPageTotal: sum(page, 'rechargeTotalAmount'),
    withdrawAmountPageTotal: sum(page, 'withdrawTotalAmount'),
    arbBalanceTotal: sum(all, 'arbBalance'),
    cpbBalanceTotal: sum(all, 'balance'),
    usdtConvertArbAmountTotal: sum(all, 'usdtConvertArbAmount'),
    balanceTotal: sum(all, 'totalBalance'),
    owedAmountTotal: sum(all, 'owedAmount'),
    totalBuyAmountTotal: sum(all, 'totalBuyAmount'),
    totalSellAmountTotal: sum(all, 'totalSellAmount'),
    biFrozenAmountTotal: sum(all, 'totalBiFrozenAmount'),
    frozenAmountTotal: sum(all, 'totalFrozenAmount'),
    rechargeAmountTotal: sum(all, 'rechargeTotalAmount'),
    withdrawAmountTotal: sum(all, 'withdrawTotalAmount'),
  }
}

export function buildMemberListBody(raw: unknown) {
  const query = readQuery(raw)
  const filtered = sortMembers(matchMembers(query), query)
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const start = (pageNo - 1) * pageSize
  const page = filtered.slice(start, start + pageSize).map((row) => ({
    ...row,
    bindMerchantInfoDTOS: row.bindMerchantInfoDTOS.map((item) => ({ ...item })),
  }))
  return {
    code: '1',
    msg: '操作成功',
    data: page,
    total: filtered.length,
    extend: buildExtend(page, filtered),
    success: true,
  }
}

const successBody = {
  code: '1',
  msg: '操作成功',
  data: null,
  success: true,
}

function minutesUntilMidnight() {
  const now = new Date()
  const end = new Date(now)
  end.setHours(24, 0, 0, 0)
  return Math.max(1, Math.ceil((end.getTime() - now.getTime()) / 60000))
}

function disableMinutes(disableType: unknown) {
  const type = Number(disableType)
  if (type === 1) return minutesUntilMidnight()
  if (type === 2) return 24 * 60
  if (type === 3) return 7 * 24 * 60
  return -1
}

// 禁用买入或卖出：对应开关关闭，账号状态改为禁用。
// 启用买入或卖出：对应开关打开，账号状态改为启用。只保存在当前页面内存里，刷新后回到初始假数据。
export function applyMemberTradeStatus(raw: unknown, kind: 'buy' | 'sell', forceEnabled?: boolean) {
  const query = readQuery(raw)
  const enabled = forceEnabled ?? Number(kind === 'buy' ? query.buyStatus : query.sellStatus) === 1
  const ids = Array.isArray(query.ids) ? query.ids : query.id != null ? [query.id] : []
  ids.forEach((id: unknown) => {
    const row = members.find((item) => String(item.id) === String(id))
    if (!row) return
    if (kind === 'buy') {
      row.buyStatus = enabled ? 1 : 0
      row.buyDisableTime = enabled ? 0 : disableMinutes(query.disableType)
    } else {
      row.sellStatus = enabled ? 1 : 0
      row.sellDisableTime = enabled ? 0 : disableMinutes(query.disableType)
    }
    row.status = enabled ? '1' : '0'
  })
  return successBody
}

function countMembersInGroup(groupId: number) {
  return members.filter((row) => Number(row.memberGroup) === Number(groupId)).length
}

export function buildMemberGroupBody() {
  const data = memberGroups.map((item) => ({
    ...item,
    memberCount: countMembersInGroup(item.id),
  }))
  return {
    code: '1',
    msg: '操作成功',
    data,
    total: data.length,
    extend: {
      nextColValue: '',
      nextCursorId: '',
      prevColValue: '',
      prevCursorId: '',
    },
    success: true,
  }
}

export function buildGroupAuthListBody() {
  return {
    code: '1',
    msg: '操作成功',
    data: groupAuthOptions.map((item) => ({ ...item })),
    total: groupAuthOptions.length,
    success: true,
  }
}

function normalizeAuthList(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join(',')
  return String(value ?? '')
}

export function applyCreateGroup(raw: unknown) {
  const query = typeof raw === 'string' ? (() => { try { return JSON.parse(raw) } catch { return {} } })() : (raw as Record<string, any>) || {}
  const name = String(query.name || '').trim()
  if (!name) return { code: '0', msg: '请输入分组名称', data: null, success: false }
  memberGroups.push({
    id: nextGroupId++,
    name,
    buyAmount: Number(query.buyAmount) || 0,
    buyCount: Number(query.buyCount) || 0,
    sellAmount: Number(query.sellAmount) || 0,
    sellCount: Number(query.sellCount) || 0,
    authList: normalizeAuthList(query.authList),
  })
  return successBody
}

export function applyUpdateGroup(raw: unknown) {
  const query = typeof raw === 'string' ? (() => { try { return JSON.parse(raw) } catch { return {} } })() : (raw as Record<string, any>) || {}
  const id = Number(query.id)
  const row = memberGroups.find((item) => item.id === id)
  if (!row) return { code: '0', msg: '分组不存在', data: null, success: false }
  if (query.name != null) row.name = String(query.name)
  if (query.buyAmount != null) row.buyAmount = Number(query.buyAmount) || 0
  if (query.buyCount != null) row.buyCount = Number(query.buyCount) || 0
  if (query.sellAmount != null) row.sellAmount = Number(query.sellAmount) || 0
  if (query.sellCount != null) row.sellCount = Number(query.sellCount) || 0
  if (query.authList != null) row.authList = normalizeAuthList(query.authList)
  return successBody
}

export function applyDeleteGroup(raw: unknown) {
  const query = typeof raw === 'string' ? (() => { try { return JSON.parse(raw) } catch { return {} } })() : (raw as Record<string, any>) || {}
  const id = Number(query.id)
  const index = memberGroups.findIndex((item) => item.id === id)
  if (index < 0) return { code: '0', msg: '分组不存在', data: null, success: false }
  memberGroups.splice(index, 1)
  return successBody
}
