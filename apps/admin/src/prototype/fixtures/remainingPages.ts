// 会员、KYC、APP 以外的菜单页假数据。列和枚举来自 remainingCatalog.json。
// 字段说明见 notes/field-notes.md，状态为供校正。
// 已经由前面路由处理过的接口不会进到这里。

import { APP_UPI_BANKS } from './appUpiBanks'
import { prototypeImage } from './configOps'
import { linkedAppealIds, prototypeFlowUpi } from './kycMenu'
import catalogJson from './remainingCatalog.json'

type CatalogColumn = { field: string; title: string }
type CatalogEnum = { name: string; pairs: { value: string; label: string }[] }
type CatalogPage = {
  path: string
  columns: CatalogColumn[]
  enums: CatalogEnum[]
  lists: { url: string }[]
  writes: string[]
}

const catalog = catalogJson as CatalogPage[]

type Row = Record<string, any>
type Store = { rows: Row[]; timeKey: string }

const FIELD_VALUES: Record<string, Array<string | number>> = {
  eventFlag: [
    'real_name_auth', 'buy_guide', 'sell_guide', 'bind_fake_app_and_real_name_auth',
    'success_buy', 'success_sell', 'net_buy_sell_amount', 'invitation_member',
    'invitation_and_success_trade', 'buy_transaction_volume', 'usdt_recharge',
  ],
  taskCycle: [1, 2, 3],
  // 这些字段会直接拿去 $t(map[value])，值必须落在 publicData 的键里，否则整页渲染崩掉、后续菜单点不动
  appealType: [1, 2],
  displayAppealType: [1, 2, 3, 4, 5, 6, 7, 8],
  autoAppealType: [1, 2, 3, 4, 5, 6, 7, 8],
  sourceType: [0, 1, 2, 3, 4, 5],
  appealStatus: [1, 2, 3],
  finishType: [1, 2, 3, 4],
  isQuadOrder: [0, 1],
  isKycSellOrder: [0, 1],
  orderStatus: [1, 2, 3, 4, 5],
  buyOrderType: [1, 2, 3, 4, 5, 6, 7],
  memberType: [1, 2, 3, 4],
  taskType: [1, 2, 3, 4],
  exclusiveFlag: [0, 1],
  riskTag: ['0', '1', '2'],
  autoSellFlag: [0, 1, 2],
  autoFinishFlag: [0, 1],
  releaseFlag: [0, 1],
  replenishmentFlag: [0, 1],
  thirdRechargeFlag: [0, 1],
  completedByKyc: [0, 1],
  blockedStatus: [0, 1],
  distributionStatus: [0, 1],
  sellOrderType: [1, 2],
  payType: [1, 2, 3],
  isForcedUpdate: [0, 1],
  // 这些值会进 $t(map[value])。落到键外会把页面渲染打崩，侧栏随后点不开
  tradeType: [1, 2],
  triggerEvent: [1, 2, 3, 4, 5],
  eventType: [1, 2, 3, 4, 5, 6, 7, 8],
  applicableGroup: [0, 1, 2],
  selfSelectionBuy: [0, 1],
}

const SKIP_QUERY = new Set([
  'pageNo', 'pageSize', 'asc', 'column', 'firstPage', 'lastPage', 'direction',
  'nextColValue', 'nextCursorId', 'prevColValue', 'prevCursorId', 'order', 'sort',
  'current', 'size',
])

const stores = new Map<string, Store>()
const listUrls: string[] = []
const writeUrls: string[] = []

const specByUrl = new Map<string, { columns: CatalogColumn[]; enums: CatalogEnum[] }>()
for (const page of catalog) {
  for (const list of page.lists) {
    if (!listUrls.includes(list.url)) listUrls.push(list.url)
    const spec = specByUrl.get(list.url) || { columns: [], enums: [] }
    for (const column of page.columns) {
      if (!spec.columns.some((item) => item.field === column.field)) spec.columns.push(column)
    }
    for (const item of page.enums) {
      if (!spec.enums.some((enumItem) => enumItem.name === item.name)) spec.enums.push(item)
    }
    specByUrl.set(list.url, spec)
  }
  for (const writeUrl of page.writes) {
    if (!writeUrls.includes(writeUrl)) writeUrls.push(writeUrl)
  }
}
listUrls.sort((a, b) => b.length - a.length)
writeUrls.sort((a, b) => b.length - a.length)

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
  return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)
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

function stamp(index: number) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const hour = 9 + (index % 10)
  const minute = (index * 7) % 60
  return `${indiaDay(0)} ${pad(hour)}:${pad(minute)}:30`
}

function clock(offsetDays: number, hour: number, minute: number) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${indiaDay(offsetDays)} ${pad(hour)}:${pad(minute)}:00`
}

function coerce(value: string) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (/^-?\d+$/.test(value)) return Number(value)
  return value
}

function enumFor(field: string, enums: CatalogEnum[]) {
  const name = field.toLowerCase()
  return enums.find((item) => {
    const stripped = item.name.replace(/Map$/i, '').toLowerCase()
    if (stripped.length < 2) return false
    // 只接受字段名和枚举名基本一致，避免 status 误配到所有 *StatusMap
    return name === stripped || name.replace(/s$/, '') === stripped.replace(/s$/, '')
  })
}

function hash(text: string) {
  let value = 0
  for (const char of text) value = (value * 33 + char.charCodeAt(0)) >>> 0
  return value
}

const SWITCH_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26,
  35, 28, 29, 30, 40, 41, 42, 43, 45, 51, 60, 66, 70, 71, 72, 80, 81, 82, 83, 84, 85, 86, 87,
  88, 89, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105,
]
const TG_MSG_IDS = [0, 1, 1001, 1002, 2000, 2006, 2007, 2011]

function tuneOpsRows(url: string, rows: Row[]) {
  if (/controlSwitchAdmin\/listPage/i.test(url)) {
    rows.splice(0, rows.length, ...SWITCH_IDS.map((switchId, index) => ({
      id: switchId,
      switchId,
      switchName: '',
      switchDescription: '',
      status: index % 2 === 0 ? 1 : 0,
    })))
    return
  }
  rows.forEach((row, index) => {
    if (/merchantInfoAdmin\/listpage/i.test(url)) {
      const merchants = [
        { username: '星河商城', merchantCode: 'M10021', code: 'W10021' },
        { username: '快付钱包', merchantCode: 'M10058', code: 'W10058' },
        { username: '北境博彩', merchantCode: 'M10073', code: 'W10073' },
        { username: '内部测试商户', merchantCode: 'M10001', code: 'W10001' },
        { username: '晨曦支付', merchantCode: 'M20001', code: 'W20001' },
      ]
      const merchant = merchants[index % merchants.length]
      row.username = merchants.length > index ? merchant.username : `${merchant.username}${index + 1}`
      row.merchantCode = index < merchants.length ? merchant.merchantCode : `M${30001 + index}`
      row.code = index < merchants.length ? merchant.code : `W${30001 + index}`
      row.merchantType = index % 2 === 0 ? 1 : 2
      row.website = `https://${row.merchantCode.toLowerCase()}.prototype.test`
      row.apiAllowedIps = '10.0.0.8,10.0.0.9'
      row.timeZone = 'GMT+05:30'
      row.balance = 50000 + index * 8600
      row.memberTotalNum = 80 + index * 17
      row.memberTotalBalance = 120000 + index * 6400
      row.status = index % 3 === 2 ? '0' : '1'
      row.riskTag = (index % 3) + 1
      row.payRate = 1.2
      row.transferRate = 1.5
      row.quickPayUpiRate = 0.8
      row.quickTransferRate = 1
      row.rechargeReward = 0.5
      row.withdrawalRewards = 0.6
      row.withdrawalStatus = index % 2
      row.rechargeStatus = index % 2 === 0 ? 1 : 0
      row.rechargeSuccessCallbackOnly = index % 2
      row.withdrawSuccessCallbackOnly = index % 2
      row.priorityMatchFlag = index % 2
      row.matchPriorityUpiTime = 90 + index * 30
      row.minCost = 100
      row.maxCost = 50000
      row.randomAmountMin = 100 + index * 50
      row.randomAmountMax = 800 + index * 100
      row.supportFourthChannel = index % 2
      row.supportRandomAmount = index % 2
      row.upiSellOrderAutoBuy = index % 2
      row.bankSellOrderAutoBuy = index % 2 === 0 ? 1 : 0
      row.isIntegerAmountFirst = index % 2
      row.autoWithdrawalState = index % 2
      row.exchangeMerchant = index % 2
      row.updateBy = index % 2 === 0 ? 'prototype' : 'admin1'
    }
    if (/telegramGroupAdmin\/page/i.test(url)) {
      row.groupType = index % 2 === 0 ? 1 : 2
      row.status = index % 2
      row.groupName = index % 2 === 0 ? `商户通知群${index + 1}` : `内部预警群${index + 1}`
      row.groupId = `-100${860000 + index}`
      row.bindMerchantCodes = row.groupType === 1 ? ['M1001', 'M1002'] : []
      row.msgTemplateIds = [TG_MSG_IDS[index % TG_MSG_IDS.length], TG_MSG_IDS[(index + 3) % TG_MSG_IDS.length]]
    }
    if (/buySellRewardConfigForAdmin\/listPage/i.test(url)) {
      row.viewStatus = (index % 3) + 1
      row.rewardType = (index % 2) + 1
      row.content = ['买入加奖', '卖出返现', '周末加倍', '新客首单'][index % 4]
      row.memberTypes = index % 2 === 0 ? [3, 4] : [1, 2]
      row.sourceTypes = [index % 8]
      row.merchantRangeCodes = index % 3 === 0 ? [0] : ['M1001']
      row.amountRangeReward = [
        { minAmount: 100, maxAmount: 500, rewardRate: 1 },
        { minAmount: 501, maxAmount: 2000, rewardRate: 1.5 },
      ]
      row.rewardStartDate = indiaDay(-index)
      row.rewardEndDate = indiaDay(7)
      row.rewardStartTimes = '09:00:00'
      row.rewardEndTimes = '21:00:00'
      row.rewardStartTimeDiff = 0
      row.createBy = index % 2 === 0 ? 'prototype' : 'admin1'
    }
    if (/usdtConfigAdmin\/listpage/i.test(url)) {
      row.networkProtocol = 'TRC-20'
      row.status = index % 2 === 0 ? '1' : '0'
      row.usdtAddr = `TPrototypeUsdtAddr${String(index + 1).padStart(4, '0')}xxxxxxxx`
      row.remark = index % 2 === 0 ? '主收款地址' : '备用地址'
    }
    if (/appVersionInfoAdmin\/listPage/i.test(url)) {
      const android = index % 2 === 0
      row.isForcedUpdate = index % 2
      row.device = android ? 1 : 2
      row.appVersion = `1.${index}.0`
      row.appName = android ? 'AR Wallet' : 'AR Wallet iOS'
      row.description = android ? '修复已知问题，优化买入体验' : '修复已知问题，优化卖出体验'
      row.downloadUrl = android
        ? 'https://download.prototype.test/ar-wallet.apk'
        : 'https://apps.prototype.test/ar-wallet'
      row.updateBy = 'prototype'
    }
    if (/bankInfoAdmin\/listPage/i.test(url)) {
      const bank = APP_UPI_BANKS[index % APP_UPI_BANKS.length]
      row.iconUrl = prototypeImage
      row.status = index % 2
      row.bankName = bank.bankName
      row.bankCode = bank.bankCode
      row.ifscCode = `${bank.bankCode.slice(0, 4).toUpperCase()}0${String(100000 + index).slice(-6)}`
      row.updateBy = index % 2 === 0 ? 'prototype' : 'admin1'
    }
    if (/taskManagerAdmin\/listPage/i.test(url)) {
      const oneTimeEvents = ['real_name_auth', 'buy_guide', 'sell_guide', 'bind_fake_app_and_real_name_auth']
      const oneTimeTitles = ['完成实名认证', '完成买入引导', '完成卖出引导', '绑定收款并实名']
      row.taskCycle = (index % 3) + 1
      row.taskStatus = index % 2
      row.taskRewardMethod = (index % 2) + 1
      row.taskIcon = prototypeImage
      row.taskSort = index + 1
      row.taskJumpLink = '/wallet'
      row.updateBy = index % 2 === 0 ? 'prototype' : 'admin1'
      row.exclusiveFlag = index % 4 === 0 ? 1 : 0
      row.minLevel = row.exclusiveFlag === 1 ? 0 : undefined
      if (row.taskCycle === 1) {
        const pick = index % oneTimeEvents.length
        row.eventFlag = oneTimeEvents[pick]
        row.taskTitle = oneTimeTitles[pick]
        row.taskType = '4'
        row.taskTarget = 1
        row.taskTargetNum = 1
        row.taskReward = 10
      } else if (row.taskCycle === 2) {
        const sell = index % 2 !== 0
        row.eventFlag = sell ? 'success_sell' : 'success_buy'
        row.taskTitle = sell ? '每日卖出' : '每日买入'
        row.taskType = sell ? '2' : '1'
        row.taskTarget = 2
        row.taskTargetNum = 1000
        row.taskReward = 20
      } else {
        row.eventFlag = 'buy_transaction_volume'
        row.taskTitle = '买入交易额'
        row.taskType = '1'
        row.taskTarget = 2
        row.taskTargetNum = 5000
        row.taskReward = 50
      }
      row.taskSubTitle = `完成「${row.taskTitle}」即可领取`
    }
    if (/customerServiceAgents\/listPage/i.test(url)) {
      row.account = `cs${1001 + index}`
      row.status = index % 2
      row.updateBy = index % 2 === 0 ? 'prototype' : 'admin1'
    }
    if (/domainConfigAdmin\/listPage/i.test(url)) {
      row.type = (index % 4) + 1
      row.dndFlag = [-1, 0, 1][index % 3]
      row.domain = `wallet-${index + 1}.prototype.test`
      row.remark = ['主站', '备用', 'H5', '收银台'][index % 4]
      row.updateBy = index % 2 === 0 ? 'prototype' : 'admin1'
    }
    if (/excelExportLogAdmin\/listPage/i.test(url)) {
      const names = ['会员信息导出', '会员账变导出', '买入订单导出', '卖出订单导出']
      row.exportStatus = index % 4
      row.exportType = (index % 12) + 1
      row.exportName = `${names[index % names.length]}_${indiaDay(0).replace(/-/g, '')}`
      row.fileSize = `${128 + index * 36}KB`
      row.exportUser = index % 2 === 0 ? 'prototype' : 'admin1'
    }
    if (/proxyPortRelationAdmin\/getProxyPortRelationList/i.test(url)) {
      row.status = index % 3
      row.ip = `103.${21 + (index % 20)}.${10 + (index % 40)}.${20 + index}`
      row.port = 8000 + index
      row.proxyProviders = (index % 2) + 1
      row.mountMemberCount = 8 + index
      row.mountMemberLimit = 50
    }
    if (/rewardCardUsageRecordAdmin\/listPage/i.test(url)) {
      row.status = index % 4
      row.cardName = ['新手卖出卡', '周卡奖励', '半月奖励', '月卡奖励'][index % 4]
      row.relatedOrderNo = index % 4 === 3 ? `SO${indiaDay(0).replace(/-/g, '')}${String(index + 1).padStart(4, '0')}` : ''
      row.amount = [50, 100, 150, 200][index % 4]
      row.expiredFlag = index % 3 === 0 ? 1 : 0
      row.frozenFlag = index % 5 === 0 ? 1 : 0
      row.activateUpiId = `910000100${index % 10}@ybl`
      row.activateKycId = `KYC${10001 + index}`
      row.kycId = row.activateKycId
      row.updateBy = index % 2 === 0 ? 'prototype' : 'admin1'
    }
    if (/taskEventConfigAdmin\/listPage/i.test(url)) {
      const flags = [
        'real_name_auth', 'buy_guide', 'sell_guide', 'bind_fake_app_and_real_name_auth',
        'success_buy', 'success_sell', 'net_buy_sell_amount', 'invitation_member',
        'invitation_and_success_trade', 'buy_transaction_volume', 'usdt_recharge',
      ]
      row.eventUniqueFlag = flags[index % flags.length]
      row.eventFlag = flags[index % flags.length]
      row.eventStatus = index % 2
    }
  })
}

const MANDATE_HUNDREDS = [100, 200, 300, 400, 500, 800, 1000, 1500, 2000, 3000, 5000, 10000]
const MANDATE_AMOUNT_LISTS = [
  '200,5000,1500,400,300,2000,110,500,3000',
  '100,500,1000,2000,3000',
  '300,400,800,1500,5000',
  '200,500,1500,2000,400',
  '1000,2000,5000,10000',
  '500,1500,3000,400,200',
]
const MANDATE_MERCHANTS = [
  { name: '星河商城', code: 'M10021' },
  { name: '快付钱包', code: 'M10058' },
  { name: '北境博彩', code: 'M10073' },
  { name: '晨曦支付', code: 'M20001' },
]
const MANDATE_IPS = ['103.21.45.18', '49.36.12.77', '122.168.20.14', '157.48.96.33', '10.8.0.21', '223.178.10.6']
const MANDATE_ERRORS = [
  '用户存在有未完成买入订单',
  '1029:订单撮合失败：AR Wallet 撮合池暂无对应金额',
  '会员取消次数过多，进入到冷却期',
  '用户被风控中无法充值大于 5000',
  '匹配池未撮合到对应金额订单',
  '1029:订单撮合失败：AR Wallet 卖单已被锁定',
]

function tuneMandateRows(url: string, rows: Row[]) {
  if (/mandateAdmin\/listPage/i.test(url)) {
    rows.forEach((row, index) => {
      row.sourceOrderType = index % 6
      row.sellOrderType = (index % 2) + 1
      row.amount = MANDATE_HUNDREDS[index % MANDATE_HUNDREDS.length]
      row.maximumAmount = MANDATE_HUNDREDS[(index + 3) % MANDATE_HUNDREDS.length]
      row.minimumAmount = 100
      row.splitAmountList = MANDATE_AMOUNT_LISTS[index % MANDATE_AMOUNT_LISTS.length]
      row.splitTimes = (index % 4) + 1
      row.maxSplitTimes = 6
      row.platformOrder = `SO20261117${String(index + 1).padStart(4, '0')}`
      row.memberId = 10086001 + (index % 10)
      row.createTime = stamp(index)
    })
  }
  if (/recommendedAmountRecordAdmin\/listPage/i.test(url)) {
    rows.forEach((row, index) => {
      const list = MANDATE_AMOUNT_LISTS[index % MANDATE_AMOUNT_LISTS.length]
      row.splitAmountList = list
      row.pushCount = list.split(',').length
      row.pushTime = stamp(index)
      row.createTime = row.pushTime
    })
  }
  if (/hotBuyAmountAdmin\/listPage/i.test(url)) {
    const factors = [10000, 5000, 4000, 3000, 2000, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100]
    rows.splice(0, rows.length, ...factors.map((factor, index) => {
      const row: Row = { id: 970000 + index }
      for (let hour = 0; hour < 24; hour += 1) {
        const key = `dateHour${String(hour).padStart(2, '0')}`
        row[key] = { amount: MANDATE_HUNDREDS[(index + hour) % MANDATE_HUNDREDS.length] }
      }
      row.dateHour12 = { amount: factor }
      return row
    }))
  }
  if (/rechargeFailureForAdmin\/listPage/i.test(url)) {
    rows.forEach((row, index) => {
      const merchant = MANDATE_MERCHANTS[index % MANDATE_MERCHANTS.length]
      row.merchantName = merchant.name
      row.merchantCode = merchant.code
      row.merchantMemberId = String(10086001 + (index % 10))
      row.merchantOrderNo = `MO20261117${String(index + 1).padStart(4, '0')}`
      row.failureAmount = MANDATE_HUNDREDS[index % MANDATE_HUNDREDS.length]
      row.sourceType = (index % 2) + 1
      row.failureType = (index % 2) + 1
      row.pendingOrderCount = (index % 5) + 1
      row.recommendedAmounts = MANDATE_AMOUNT_LISTS[index % MANDATE_AMOUNT_LISTS.length]
      row.requestIp = MANDATE_IPS[index % MANDATE_IPS.length]
      row.errorMessage = MANDATE_ERRORS[index % MANDATE_ERRORS.length]
      row.createTime = stamp(index)
    })
  }
  if (/maxBenefitOrderAdmin\/unMatchList/i.test(url)) {
    rows.forEach((row, index) => {
      row.memberId = 10086001 + (index % 10)
      row.memberType = (index % 6) + 1
      row.platformOrder = `SP20261117${String(index + 1).padStart(4, '0')}`
      row.amount = MANDATE_HUNDREDS[(index + 2) % MANDATE_HUNDREDS.length]
      row.maximumAmount = MANDATE_HUNDREDS[(index + 1) % MANDATE_HUNDREDS.length]
      row.minimumAmount = 100
      row.alreadySplitTimes = (index % 4) + 1
      ;(['A', 'B', 'C', 'D', 'E'] as const).forEach((band, bandIndex) => {
        row[`range${band}SplitTimes`] = (index + bandIndex) % 4
      })
      row.createTime = stamp(index)
    })
  }
  if (/maxBenefitOrderAdmin\/matchFailedList/i.test(url)) {
    rows.forEach((row, index) => {
      const merchant = MANDATE_MERCHANTS[index % MANDATE_MERCHANTS.length]
      row.merchantName = merchant.name
      row.merchantCode = merchant.code
      row.merchantMemberId = String(10086001 + (index % 10))
      row.memberType = (index % 6) + 1
      row.merchantOrderNo = `MF20261117${String(index + 1).padStart(4, '0')}`
      row.orderAmount = MANDATE_HUNDREDS[index % MANDATE_HUNDREDS.length]
      row.orderCountOfRange = (index % 4) + 1
      row.orderCountOfAll = (index % 6) + 2
      row.createTime = stamp(index)
    })
  }
}

const LEVEL_MERCHANTS = [
  { name: '星河商城', code: 'W10021' },
  { name: '快付钱包', code: 'W10058' },
  { name: '北境博彩', code: 'W10073' },
  { name: '晨曦支付', code: 'W20001' },
]
const LEVEL_MEMBER_TYPES = [
  { type: 1, remark: '内部商户会员，挂在星河商城内部账户' },
  { type: 2, remark: '外部商户会员，由快付钱包接入' },
  { type: 3, remark: '钱包会员，余额主要用于买入' },
  { type: 4, remark: '蚂蚁会员，邀请下级并参与买卖' },
  { type: 5, remark: '快捷会员，从快捷提现渠道注册' },
  { type: 6, remark: 'NPC会员，用于撮合补单' },
]
const LEVEL_HEADCOUNT = [1860, 1240, 860, 540, 320, 180, 96, 48, 24, 12, 6]
const CREDIT_EVENTS = [
  { tradeType: 1, triggerEvent: 1, eventType: 1, score: '-5' },
  { tradeType: 1, triggerEvent: 2, eventType: 2, score: '+5' },
  { tradeType: 1, triggerEvent: 3, eventType: 3, score: '-2' },
  { tradeType: 2, triggerEvent: 3, eventType: 4, score: '-3' },
  { tradeType: 2, triggerEvent: 4, eventType: 5, score: '-8' },
  { tradeType: 1, triggerEvent: 4, eventType: 6, score: '+3' },
  { tradeType: 2, triggerEvent: 5, eventType: 7, score: '-10' },
  { tradeType: 1, triggerEvent: 2, eventType: 8, score: '+8' },
  { tradeType: 2, triggerEvent: 1, eventType: 1, score: '-5' },
  { tradeType: 2, triggerEvent: 5, eventType: 7, score: '-6' },
]

function tuneUserLevelRows(url: string, rows: Row[]) {
  if (/memberLevelConfig\/listPage/i.test(url)) {
    const groups = [2, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0]
    const buyNums = [0, 3, 8, 15, 30, 50, 80, 120, 180, 260, 400]
    const sellNums = [0, 2, 5, 10, 20, 30, 50, 80, 120, 180, 260]
    const amounts = [0, 1000, 5000, 10000, 30000, 50000, 80000, 120000, 200000, 300000, 500000]
    rows.splice(0, rows.length, ...groups.map((group, level) => ({
      id: 910100 + level,
      level,
      applicableGroup: group,
      buyNum: buyNums[level],
      sellNum: sellNums[level],
      amount: amounts[level],
      updateBy: 'prototype',
      updateTime: stamp(level),
      createBy: 'prototype',
      createTime: stamp(level),
    })))
    return
  }
  if (/memberInfoAdmin\/relationMemberList/i.test(url)) {
    const members: Row[] = []
    LEVEL_HEADCOUNT.forEach((_, level) => {
      for (let slot = 0; slot < 2; slot += 1) {
        const index = level * 2 + slot
        const kind = LEVEL_MEMBER_TYPES[index % LEVEL_MEMBER_TYPES.length]
        const merchant = LEVEL_MERCHANTS[index % LEVEL_MERCHANTS.length]
        const memberId = 10086101 + index
        members.push({
          id: memberId,
          memberId,
          level,
          merchantName: merchant.name,
          merchantCode: merchant.code,
          code: merchant.code,
          totalBalance: (level + 1) * 1000 + slot * 500,
          memberType: kind.type,
          totalBuyCount: level * 4 + slot + 1,
          totalBuyAmount: (level + 1) * 2000,
          totalSellCount: level * 2 + slot,
          totalSellAmount: (level + 1) * 1500,
          remark: `L${level} ${kind.remark}`,
          createTime: stamp(index),
        })
      }
    })
    rows.splice(0, rows.length, ...members)
    return
  }
  if (/memberLevelWelfareConfig\/listPage/i.test(url)) {
    const limits = [500, 1000, 2000, 3000, 5000, 8000, 10000, 15000, 20000, 30000, 50000]
    rows.splice(0, rows.length, ...limits.map((limit, level) => ({
      id: 910200 + level,
      level,
      singleAmountLimit: limit,
      selfSelectionBuy: level >= 3 ? 1 : 0,
      dailyTasks: level >= 2 ? 1 : 0,
      weeklyTasks: level >= 5 ? 1 : 0,
      monthlyTasks: level >= 8 ? 1 : 0,
      updateBy: 'prototype',
      updateTime: stamp(level),
      createBy: 'prototype',
      createTime: stamp(level),
    })))
    return
  }
  if (/creditScoreConfigAdmin\/listPage/i.test(url)) {
    rows.splice(0, rows.length, ...CREDIT_EVENTS.map((event, index) => ({
      id: 101 + index,
      eventId: 101 + index,
      ...event,
      updateBy: 'prototype',
      updateTime: stamp(index),
      createBy: 'prototype',
      createTime: stamp(index),
    })))
    return
  }
  if (/creditScoreLogsAdmin\/listPage/i.test(url)) {
    rows.forEach((row, index) => {
      const event = CREDIT_EVENTS[index % CREDIT_EVENTS.length]
      const change = Number(event.score)
      const before = 80 + (index % 5) * 10
      row.id = 10086001 + (index % 10)
      row.memberId = row.id
      row.tradeType = event.tradeType
      row.triggerEvent = event.triggerEvent
      row.eventType = event.eventType
      row.changeScore = change
      row.changeType = change > 0 ? 1 : 2
      row.beforeScore = before
      row.afterScore = before + change
      row.createTime = stamp(index)
    })
  }
}

const REPORT_MERCHANTS = [
  { name: '星河商城', code: 'W10021', type: 1, users: 28, monthUsers: 640 },
  { name: '快付钱包', code: 'W10058', type: 2, users: 46, monthUsers: 980 },
  { name: '北境博彩', code: 'W10073', type: 2, users: 11, monthUsers: 220 },
  { name: '晨曦支付', code: 'W20001', type: 2, users: 19, monthUsers: 410 },
]
const REPORT_DAY_SHIFT = [0, 6, -3, 9, -5, 4, 2]

function reportMonth(offset: number) {
  const [year, month] = indiaDay(0).split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1 - offset, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

function hundred(value: number) {
  return Math.round(value / 100) * 100
}

function rateOf(success: number, total: number) {
  if (!total) return 0
  return Number((success / total).toFixed(2))
}

function buySellDay(index: number, kind: 'buy' | 'sell') {
  const done = [860, 920, 780, 1040, 690, 810, 950][index % 7]
  const ratio = kind === 'buy' ? [0.91, 0.88, 0.93, 0.86, 0.9, 0.84, 0.92][index % 7] : [0.84, 0.81, 0.87, 0.79, 0.83, 0.76, 0.85][index % 7]
  const success = Math.round(done * ratio)
  const amountBase = kind === 'buy' ? [186000, 214000, 168000, 246000, 152000, 198000, 228000] : [142000, 168000, 126000, 188000, 118000, 154000, 176000]
  const prefix = kind === 'buy' ? 'buy' : 'sell'
  return {
    reportDate: indiaDay(-index),
    [`${prefix}SuccessAmount`]: amountBase[index % 7],
    [`${prefix}DoneCount`]: done,
    [`${prefix}SuccessCount`]: success,
    [`${prefix}SuccessRate`]: rateOf(success, done),
    [`${prefix}AppealDoneCount`]: Math.max(2, Math.round(done * 0.012)),
    [`${prefix}CancelCount`]: Math.max(8, Math.round(done * (kind === 'buy' ? 0.05 : 0.08))),
    [`${prefix}AgeSuccessDuration`]: kind === 'buy' ? [420, 510, 380, 640, 460, 720, 390][index % 7] : [780, 960, 840, 1120, 900, 1260, 860][index % 7],
    [`${prefix}SuccessBonus`]: hundred((kind === 'buy' ? 2400 : 1800) + index * 200),
    actualMoney: amountBase[index % 7],
  }
}

function quadDay(index: number) {
  const sellDone = [210, 240, 180, 260, 160, 220, 250][index % 7]
  const buyDone = [260, 300, 220, 340, 190, 280, 310][index % 7]
  const sellSuccess = Math.round(sellDone * [0.78, 0.74, 0.81, 0.72, 0.76, 0.7, 0.8][index % 7])
  const buySuccess = Math.round(buyDone * [0.82, 0.79, 0.85, 0.76, 0.8, 0.74, 0.83][index % 7])
  return {
    reportDate: indiaDay(-index),
    sellSuccessAmount: [42000, 56000, 38000, 64000, 32000, 48000, 60000][index % 7],
    sellSuccessCount: sellSuccess,
    sellSuccessRate: rateOf(sellSuccess, sellDone),
    sellAgeSuccessDuration: [960, 1140, 1020, 1380, 1080, 1500, 1200][index % 7],
    buySuccessAmount: [58000, 72000, 46000, 84000, 40000, 66000, 78000][index % 7],
    buySuccessCount: buySuccess,
    buySuccessRate: rateOf(buySuccess, buyDone),
    buyTimeoutCount: [36, 48, 28, 62, 24, 44, 52][index % 7],
    buyCancelCount: [18, 26, 14, 34, 12, 22, 30][index % 7],
    buyAgeSuccessDuration: [540, 660, 480, 780, 510, 720, 600][index % 7],
  }
}

function merchantStat(merchantIndex: number, offset: number, monthly: boolean) {
  const merchant = REPORT_MERCHANTS[merchantIndex]
  const wave = REPORT_DAY_SHIFT[offset % REPORT_DAY_SHIFT.length]
  const scale = monthly ? 22 : 1
  const users = Math.max(1, (monthly ? merchant.monthUsers : merchant.users) + wave * (monthly ? 12 : 1))
  const payOrders = Math.round((monthly ? 4200 : 180) * (merchant.users / 28) + wave * (monthly ? 40 : 3))
  const paySuccess = Math.round(payOrders * (0.9 - merchantIndex * 0.02))
  const withdrawOrders = Math.round(payOrders * 0.62)
  const withdrawSuccess = Math.round(withdrawOrders * (0.86 - merchantIndex * 0.02))
  const payMoney = hundred(paySuccess * (monthly ? 480 : 520))
  const withdrawMoney = hundred(withdrawSuccess * (monthly ? 460 : 500))
  const payFee = hundred(payMoney * 0.015)
  const withdrawFee = hundred(withdrawMoney * 0.01)
  return {
    merchantName: merchant.name,
    merchantCode: merchant.code,
    code: merchant.code,
    merchantType: merchant.type,
    activationNewUser: users,
    payMoney,
    payOrderNum: payOrders,
    paySuccessOrderNum: paySuccess,
    paySuccessRate: rateOf(paySuccess, payOrders),
    withdrawMoney,
    withdrawOrderNum: withdrawOrders,
    withdrawSuccessOrderNum: withdrawSuccess,
    withdrawSuccessRate: rateOf(withdrawSuccess, withdrawOrders),
    difference: payMoney - withdrawMoney,
    totalFee: payFee + withdrawFee,
    scale,
  }
}

function reconcileMerchant(merchantIndex: number, offset: number) {
  const stat = merchantStat(merchantIndex, offset, false)
  const merchantUp = hundred(8000 + merchantIndex * 4000 + offset * 500)
  const merchantDownPoint = hundred(2000 + merchantIndex * 1500 + (offset % 3) * 500)
  const merchantDown = hundred(stat.withdrawMoney * 0.18)
  return {
    dateTime: indiaDay(-offset),
    merchantName: stat.merchantName,
    merchantCode: stat.merchantCode,
    merchantType: stat.merchantType,
    merchantBalance: hundred(180000 + merchantIndex * 70000 - offset * 2000),
    payMoney: stat.payMoney,
    withdrawMoney: stat.withdrawMoney,
    payFee: hundred(stat.payMoney * 0.015),
    withdrawFee: hundred(stat.withdrawMoney * 0.01),
    merchantUp,
    merchantDownPoint,
    merchantDown,
    merchantDiff: hundred((offset % 3) * 100 - 100),
  }
}

function reconcileMember(merchantIndex: number, offset: number) {
  const stat = merchantStat(merchantIndex, offset, false)
  const buyAmount = hundred(stat.payMoney * 0.72)
  const sellAmount = hundred(stat.withdrawMoney * 0.68)
  return {
    dateTime: indiaDay(-offset),
    merchantName: stat.merchantName,
    merchantCode: stat.merchantCode,
    merchantType: stat.merchantType,
    memberBalance: hundred(260000 + merchantIndex * 50000 - offset * 1500),
    payMoney: hundred(stat.payMoney * 0.4),
    withdrawMoney: hundred(stat.withdrawMoney * 0.35),
    usdtBuyMoney: hundred(12000 + merchantIndex * 4000 + offset * 300),
    buyAmount,
    sellAmount,
    refundCancellation: hundred(600 + offset * 100),
    amountError: hundred(200 + (offset % 4) * 100),
    buyReward: hundred(800 + merchantIndex * 200),
    sellReward: hundred(600 + merchantIndex * 150),
    taskReward: hundred(300 + (offset % 3) * 100),
    memberUp: hundred(1500 + merchantIndex * 500),
    memberDown: hundred(800 + merchantIndex * 300 + offset * 100),
    memberDiff: hundred((offset % 3) * 100 - 100),
  }
}

function tuneReportRows(url: string, rows: Row[]) {
  const days = 7
  const months = 6
  if (/buySellReport\/queryBuyReportPage/i.test(url)) {
    rows.splice(0, rows.length, ...Array.from({ length: days }, (_, index) => ({ id: 930100 + index, ...buySellDay(index, 'buy') })))
    return
  }
  if (/buySellReport\/queryBuyMonthReportPage/i.test(url)) {
    rows.splice(0, rows.length, ...Array.from({ length: months }, (_, index) => {
      const row = buySellDay(index, 'buy')
      const label = reportMonth(index)
      return {
        ...row,
        id: 930200 + index,
        reportDate: label,
        year: label.slice(0, 4),
        month: label.slice(5),
        buySuccessAmount: row.buySuccessAmount * 22,
        buyDoneCount: row.buyDoneCount * 24,
        buySuccessCount: row.buySuccessCount * 24,
        buyAppealDoneCount: row.buyAppealDoneCount * 20,
        buyCancelCount: row.buyCancelCount * 22,
        buySuccessBonus: row.buySuccessBonus * 20,
      }
    }))
    return
  }
  if (/buySellReport\/querySellReportPage/i.test(url)) {
    rows.splice(0, rows.length, ...Array.from({ length: days }, (_, index) => ({ id: 930300 + index, ...buySellDay(index, 'sell') })))
    return
  }
  if (/buySellReport\/querySellMonthReportPage/i.test(url)) {
    rows.splice(0, rows.length, ...Array.from({ length: months }, (_, index) => {
      const row = buySellDay(index, 'sell')
      const label = reportMonth(index)
      return {
        ...row,
        id: 930400 + index,
        reportDate: label,
        year: label.slice(0, 4),
        month: label.slice(5),
        sellSuccessAmount: row.sellSuccessAmount * 22,
        sellDoneCount: row.sellDoneCount * 24,
        sellSuccessCount: row.sellSuccessCount * 24,
        sellAppealDoneCount: row.sellAppealDoneCount * 20,
        sellCancelCount: row.sellCancelCount * 22,
        sellSuccessBonus: row.sellSuccessBonus * 20,
      }
    }))
    return
  }
  if (/biMerchantDaily\/query/i.test(url)) {
    const list: Row[] = []
    for (let offset = 0; offset < days; offset += 1) {
      REPORT_MERCHANTS.forEach((_, merchantIndex) => {
        list.push({ id: 930500 + list.length, dateTime: indiaDay(-offset), ...merchantStat(merchantIndex, offset, false) })
      })
    }
    rows.splice(0, rows.length, ...list)
    return
  }
  if (/biMerchantMonth\/query/i.test(url)) {
    const list: Row[] = []
    for (let offset = 0; offset < months; offset += 1) {
      REPORT_MERCHANTS.forEach((_, merchantIndex) => {
        list.push({ id: 930600 + list.length, dateTime: reportMonth(offset), ...merchantStat(merchantIndex, offset, true) })
      })
    }
    rows.splice(0, rows.length, ...list)
    return
  }
  if (/biMerchantReconciliation\/query/i.test(url)) {
    const list: Row[] = []
    for (let offset = 0; offset < days; offset += 1) {
      REPORT_MERCHANTS.forEach((_, merchantIndex) => {
        list.push({ id: 930700 + list.length, ...reconcileMerchant(merchantIndex, offset) })
      })
    }
    rows.splice(0, rows.length, ...list)
    return
  }
  if (/biMemberReconciliation\/query/i.test(url)) {
    const list: Row[] = []
    for (let offset = 0; offset < days; offset += 1) {
      REPORT_MERCHANTS.forEach((_, merchantIndex) => {
        list.push({ id: 930800 + list.length, ...reconcileMember(merchantIndex, offset) })
      })
    }
    rows.splice(0, rows.length, ...list)
    return
  }
  if (/selectQuadReportPage/i.test(url)) {
    rows.splice(0, rows.length, ...Array.from({ length: days }, (_, index) => ({ id: 930900 + index, ...quadDay(index) })))
    return
  }
  if (/selectQuadMonthReportPage/i.test(url)) {
    rows.splice(0, rows.length, ...Array.from({ length: months }, (_, index) => {
      const row = quadDay(index)
      const label = reportMonth(index)
      return {
        ...row,
        id: 931000 + index,
        reportDate: label,
        year: label.slice(0, 4),
        month: label.slice(5),
        sellSuccessAmount: row.sellSuccessAmount * 22,
        sellSuccessCount: row.sellSuccessCount * 24,
        buySuccessAmount: row.buySuccessAmount * 22,
        buySuccessCount: row.buySuccessCount * 24,
        buyTimeoutCount: row.buyTimeoutCount * 20,
        buyCancelCount: row.buyCancelCount * 20,
      }
    }))
  }
}

const WIND_MERCHANTS = ['星河商城', '快付钱包', '北境博彩', '晨曦支付']
const WIND_MERCHANT_CODES = ['W10021', 'W10058', 'W10073', 'W20001']
const WIND_NAMES = ['Rahul Sharma', 'Priya Nair', 'Amit Verma', 'Sneha Iyer', 'Vikram Singh', 'Anjali Gupta', 'Rohit Mehta', 'Kavita Joshi', 'Arjun Reddy', 'Pooja Desai']
const HIT_TYPES = [
  'A1 填入UTR并买入失败',
  'A2 30分钟内3次取消',
  'A3 累计取消≥5次',
  'A4 累计取消≥4次且金额偏大',
  'A5 累计取消≥2次且金额很大',
  'A6 连续取消后完成小额订单',
  'A7 支付超时≥3笔',
  'A8 买入实付低于最低上分',
]
const HIT_PUNISH = [
  '将母订单状态流转为撮合超时，移除撮合池',
  '有进行中子单的母单超时待完结，无进行中子单的母单直接失败，并限时禁用 UPI',
  '有进行中子单的母单超时待完结，无进行中子单的母单直接失败，并禁用 UPI',
]
const DISCONNECT_REASONS = [12, 13, 14, 15, 21, 22, 23, 24]
const DISCONNECT_REMARKS = [
  '银行流水出现非本人转账，连接被断开',
  '银行流水返回空数据',
  '连接后 30 分钟没有任何操作',
  '后台人工禁用了这张 UPI',
  '系统风控主动断开 KYC',
  'UPI Token 已失效',
  '刷新 Token 失败，连接中断',
  '买方 KYC 中途断开',
]
const INDIAN_CARDS = [
  { bankName: 'HDFC Bank', cardOwnerName: 'Rahul Sharma', bankCardNumber: '4386280012345671', ifsc: 'HDFC0001234' },
  { bankName: 'State Bank of India', cardOwnerName: 'Priya Nair', bankCardNumber: '6521850034567892', ifsc: 'SBIN0000456' },
  { bankName: 'ICICI Bank', cardOwnerName: 'Amit Verma', bankCardNumber: '5241780098765430', ifsc: 'ICIC0002345' },
  { bankName: 'Axis Bank', cardOwnerName: 'Sneha Iyer', bankCardNumber: '4718600011223344', ifsc: 'UTIB0000789' },
  { bankName: 'Punjab National Bank', cardOwnerName: 'Vikram Singh', bankCardNumber: '6073450019987766', ifsc: 'PUNB0123400' },
  { bankName: 'Kotak Mahindra Bank', cardOwnerName: 'Anjali Gupta', bankCardNumber: '4160210088776655', ifsc: 'KKBK0000567' },
  { bankName: 'Bank of Baroda', cardOwnerName: 'Rohit Mehta', bankCardNumber: '6529010044556677', ifsc: 'BARB0AHMEDA' },
  { bankName: 'Yes Bank', cardOwnerName: 'Kavita Joshi', bankCardNumber: '4532120099887766', ifsc: 'YESB0001122' },
  { bankName: 'Canara Bank', cardOwnerName: 'Arjun Reddy', bankCardNumber: '6071530022334455', ifsc: 'CNRB0003344' },
  { bankName: 'Union Bank of India', cardOwnerName: 'Pooja Desai', bankCardNumber: '5085340077665544', ifsc: 'UBIN0538899' },
]
const BLACK_REMARKS = [
  '多次填入无效 UTR，买入失败后仍重复下单',
  '30 分钟内连续取消买入',
  '收款账户被投诉异常',
  '累计取消金额偏大，疑似套现',
  '连续取消后只完成小额订单',
  '支付超时过多，母单已移出撮合池',
  '实付金额低于平台最低上分',
  '内部账号违规代操作',
  '同一张 UPI 被多名会员共用',
  '投诉后仍继续用该账号买入',
]

function windUpi(index: number) {
  const bank = APP_UPI_BANKS[index % APP_UPI_BANKS.length]
  const handle = WIND_NAMES[index % WIND_NAMES.length].toLowerCase().replace(' ', '.')
  return { bank, upiId: `${handle}${bank.upiSuffix}`, phone: `91${9800000000 + index}` }
}

function buildUnbanRows() {
  return Array.from({ length: 8 }, (_, index) => {
    const { bank, upiId } = windUpi(index)
    const ok = index % 3 !== 2
    const merchants = ['星河商城', '快付钱包', '北境博彩', '晨曦支付']
    return {
      id: 940100 + index,
      sellMemberId: 10086001 + index,
      memberId: 10086001 + index,
      upiId,
      merchantCode: WIND_MERCHANT_CODES[index % WIND_MERCHANT_CODES.length],
      bankCode: bank.bankCode,
      unbanAmount: [1, 2, 5, 10][index % 4],
      createTime: clock(0, 9 + index, 12),
      unbanTime: ok ? clock(0, 10 + index, 28) : null,
      status: ok ? 1 : 0,
      remark: ok
        ? `${merchants[index % merchants.length]}会员，验证款已到账，UPI 恢复卖出`
        : '超时未收到验证款，UPI 仍处于禁用',
    }
  })
}

function tuneWindRows(url: string, rows: Row[]) {
  if (/memberBlack\/listPage/i.test(url)) {
    rows.forEach((row, index) => {
      const person = WIND_NAMES[index % WIND_NAMES.length]
      row.memberId = 10086001 + (index % 10)
      row.merchantName = WIND_MERCHANTS[index % WIND_MERCHANTS.length]
      row.merchantCode = row.merchantName
      row.merchantMemberId = `MM${10086001 + (index % 10)}`
      row.memberAccount = `91${9812000000 + index}`
      row.memberGroup = (index % 4) + 1
      row.memberType = (index % 3) + 1
      row.realName = person
      row.status = index % 5 === 0 ? 1 : 0
      row.buyStatus = index % 2
      row.sellStatus = index % 3 === 0 ? 1 : 0
      row.operator = 'prototype'
      row.opTime = stamp(index)
      row.remark = BLACK_REMARKS[index % BLACK_REMARKS.length]
    })
    return
  }
  if (/riskUserHitRecordAdmin\/listPage/i.test(url)) {
    rows.forEach((row, index) => {
      row.buyerId = 10086001 + (index % 10)
      row.memberId = row.buyerId
      row.merchantName = WIND_MERCHANTS[index % WIND_MERCHANTS.length]
      row.buyStatus = index % 2
      row.onlineStatus = index % 3 === 0 ? 1 : 0
      row.firstHitType = HIT_TYPES[index % HIT_TYPES.length]
      row.secondHitType = HIT_TYPES[(index + 2) % HIT_TYPES.length]
      row.thirdHitType = HIT_TYPES[(index + 5) % HIT_TYPES.length]
      row.firstHitTime = clock(0, 9, 10 + index)
      row.secondHitTime = clock(0, 12, 15 + index)
      row.thirdHitTime = clock(0, 16, 20 + index)
      row.hitCount = (index % 5) + 1
      row.punishment = HIT_PUNISH[index % HIT_PUNISH.length]
    })
    return
  }
  if (/upiRiskControlLogAdmin\/listPage/i.test(url)) {
    rows.forEach((row, index) => {
      const { bank, upiId } = windUpi(index)
      row.memberId = 10086001 + (index % 10)
      row.upiId = upiId
      row.bankCode = bank.bankCode
      row.riskControlRuleNo = index % 2 === 0 ? 'SELL01' : 'SELL02'
      row.punishRuleNo = index % 2 === 0 ? 'HANDLE_MATCH_POOL_ORDER' : 'BAN_UPI'
      row.riskControlTime = clock(0, 9 + (index % 8), 18)
      row.countOfC2cOrder = (index % 4) + 1
      row.remainingAmountOfC2cOrder = 1500 + index * 500
      row.banDuration = [0, 86400, 604800, 3600][index % 4]
    })
    return
  }
  if (/disConnectMonitorAdmin\/listPage/i.test(url)) {
    rows.forEach((row, index) => {
      const { bank, upiId, phone } = windUpi(index)
      row.memberId = 10086001 + (index % 10)
      row.level = index % 11
      row.memberType = (index % 6) + 1
      row.buyOrderNo = `B20261117${String(1001 + index).slice(-4)}`
      row.orderAmount = 500 + index * 100
      row.bankCode = bank.bankCode
      row.kycId = 86010021 + index
      row.upiId = upiId
      row.phoneNumber = phone
      row.lastConnectTime = clock(0, 8 + (index % 6), 5)
      row.keepAliveTime = [180, 420, 900, 1500, 2400, 3600][index % 6]
      row.createTime = clock(0, 9 + (index % 8), 40)
      row.changeReason = DISCONNECT_REASONS[index % DISCONNECT_REASONS.length]
      row.remark = DISCONNECT_REMARKS[index % DISCONNECT_REMARKS.length]
    })
    return
  }
  if (/bankCardBlacklistAdmin\/listPage/i.test(url)) {
    const size = INDIAN_CARDS.length
    while (rows.length < size) rows.push({ ...rows[0], id: 940200 + rows.length })
    rows.splice(size)
    rows.forEach((row, index) => {
      Object.assign(row, INDIAN_CARDS[index])
      row.createTime = clock(0, 10, 5 + index * 3)
    })
    return
  }
  if (/systemAutoSellLogAdmin\/listPage/i.test(url)) {
    rows.forEach((row, index) => {
      const { bank, upiId, phone } = windUpi(index)
      const openHour = 9 + (index % 5)
      row.memberId = 10086001 + (index % 10)
      row.memberType = (index % 6) + 1
      row.phoneNumber = phone
      row.upiId = upiId
      row.bankCode = bank.bankCode
      row.appCreateTime = clock(-(2 + (index % 4)), 8, 20 + index)
      row.openedAt = clock(0, openHour, 10)
      row.closedAt = index % 3 === 0 ? null : clock(0, openHour + 4, 35)
      row.openBalance = 2000 + index * 500
      row.createdOrderAmount = 3000 + index * 400
      row.createdOrderCount = 2 + (index % 6)
      row.succeededOrderAmount = 2000 + index * 300
    })
  }
}

function permissionNodes(menuId: number) {
  return [
    { id: menuId * 10 + 1, menuId, name: '查询', component: '' },
    { id: menuId * 10 + 2, menuId, name: '新增', component: '' },
    { id: menuId * 10 + 3, menuId, name: '编辑', component: '' },
    { id: menuId * 10 + 4, menuId, name: '删除', component: '' },
  ]
}

function menuNode(id: number, name: string, path: string, parentId: number, sort: number, visible = 1) {
  const root = parentId === -1
  return {
    id,
    name,
    component: root ? 'Layout' : path,
    icon: root ? 'folder' : 'file',
    parentId,
    path,
    redirect: root ? '' : path,
    sort,
    visible,
    children: [] as Row[],
    listPermission: [] as Row[],
  }
}

function buildAdminMenuTree() {
  const tree = [
    menuNode(101, 'm15', '/member', -1, 1),
    menuNode(102, 'm3', '/order', -1, 2),
    menuNode(103, 'm452', '/wind', -1, 3),
    menuNode(104, 'm19', '/admin', -1, 4),
  ]
  const child = (parent: number, id: number, name: string, path: string, sort: number, visible = 1) => {
    const node = menuNode(id, name, path, parent, sort, visible)
    node.listPermission = permissionNodes(id)
    tree.find((item) => item.id === parent)?.children.push(node)
  }
  child(101, 1011, 'm17', '/member/list', 1)
  child(101, 1012, 'm18', '/member/paymentV2', 2)
  child(102, 1021, 'm7', '/order/buyOrder/index', 1)
  child(102, 1022, 'm5', '/order/sale/index', 2)
  child(102, 1023, 'm4', '/order/appeal/index', 3, 0)
  child(103, 1031, 'm453', '/wind/memberBlacklist', 1)
  child(103, 1032, 'n294', '/wind/riskControlUser', 2)
  child(104, 1041, 'm21', '/admin/white/index', 1)
  child(104, 1042, 'm943', '/admin/sysLoginlog', 2)
  child(104, 1043, 'm466', '/admin/black/index', 3)
  child(104, 1044, 'm20', '/admin/log/index', 4)
  child(104, 1045, 'm22', '/admin/user/index', 5)
  child(104, 1046, 'm24', '/admin/role/index', 6)
  child(104, 1047, 'm23', '/admin/menu/index', 7)
  return tree
}

function tuneAdminRows(url: string, rows: Row[]) {
  if (/\/menu\/list$/i.test(url)) {
    rows.splice(0, rows.length, ...buildAdminMenuTree())
    return
  }
  if (/role\/listPage/i.test(url)) {
    const roles = [
      ['超级管理员', 'SUPER_ADMIN'],
      ['运营专员', 'OPS'],
      ['风控专员', 'RISK'],
      ['财务专员', 'FINANCE'],
      ['客服专员', 'CS'],
      ['商户管理员', 'MERCHANT_ADMIN'],
      ['审计只读', 'AUDITOR'],
    ]
    rows.splice(0, rows.length, ...roles.map(([name, code], index) => ({
      id: index + 1,
      name,
      code,
      sort: index + 1,
      status: index === roles.length - 1 ? 0 : 1,
    })))
    return
  }
  if (/users\/listPage/i.test(url)) {
    const users = [
      { username: 'prototype', nickname: '原型账号', roles: [{ id: 1, name: '超级管理员' }], status: 1, loginCount: 186, ip: '103.88.12.20' },
      { username: 'ops.li', nickname: '李运营', roles: [{ id: 2, name: '运营专员' }], status: 1, loginCount: 92, ip: '103.88.12.21' },
      { username: 'risk.wang', nickname: '王风控', roles: [{ id: 3, name: '风控专员' }], status: 1, loginCount: 140, ip: '103.88.12.22' },
      { username: 'finance.zhao', nickname: '赵财务', roles: [{ id: 4, name: '财务专员' }], status: 1, loginCount: 64, ip: '49.207.18.66' },
      { username: 'cs.chen', nickname: '陈客服', roles: [{ id: 5, name: '客服专员' }], status: 1, loginCount: 210, ip: '49.207.18.80' },
      { username: 'merchant.xinghe', nickname: '星河商户', roles: [{ id: 6, name: '商户管理员' }], status: 1, loginCount: 37, ip: '157.48.90.14' },
      { username: 'auditor.sun', nickname: '孙审计', roles: [{ id: 7, name: '审计只读' }], status: 0, loginCount: 8, ip: '103.88.12.30' },
      { username: 'ops.backup', nickname: '值班运营', roles: [{ id: 2, name: '运营专员' }, { id: 5, name: '客服专员' }], status: 1, loginCount: 23, ip: '103.88.12.21' },
    ]
    rows.splice(0, rows.length, ...users.map((item, index) => ({
      id: 1001 + index,
      username: item.username,
      nickname: item.nickname,
      listRole: item.roles,
      status: item.status,
      loginCount: item.loginCount,
      lastLoginIp: item.ip,
      lastLoginTime: clock(0, 8 + index, 15),
    })))
    return
  }
  if (/syswhite\/listPage/i.test(url)) {
    const whites = [
      { ip: '103.88.12.20', clientType: '1', remark: '总后台办公网出口', status: 1 },
      { ip: '103.88.12.21', clientType: '1', remark: '运营值班出口', status: 1 },
      { ip: '49.207.18.66', clientType: '2', remark: '星河商城商户后台', status: 1 },
      { ip: '157.48.90.14', clientType: '2', remark: '快付钱包回调服务器', status: 1 },
      { ip: '112.74.22.16', clientType: '1', remark: '风控临时排查，已停用', status: 0 },
      { ip: '10.8.0.12', clientType: '2', remark: '北境博彩测试环境', status: 0 },
    ]
    rows.splice(0, rows.length, ...whites.map((item, index) => ({
      id: 301 + index,
      ...item,
      createBy: 'prototype',
      createTime: clock(-(index + 1), 10, 20),
      updateBy: index % 2 === 0 ? 'prototype' : 'ops.li',
      updateTime: clock(0, 9, 10 + index),
    })))
    return
  }
  if (/tradeIpBlack\/listPage/i.test(url)) {
    const blacks = [
      { ipAddress: '185.220.101.45', reason: '10 分钟内买入失败 20 次', status: 1 },
      { ipAddress: '45.133.12.8', reason: '多个会员共用同一出口，疑似工作室', status: 1 },
      { ipAddress: '91.219.236.10', reason: '登录失败过于频繁', status: 1 },
      { ipAddress: '102.89.34.17', reason: '命中交易风控后人工拉黑', status: 1 },
      { ipAddress: '37.19.220.64', reason: '短时间切换多张 UPI', status: 0 },
      { ipAddress: '193.42.110.9', reason: '已核实为商户机房，解除拉黑', status: 0 },
    ]
    rows.splice(0, rows.length, ...blacks.map((item, index) => ({
      id: 401 + index,
      ...item,
      createBy: index % 2 === 0 ? 'risk.wang' : 'prototype',
      updateBy: 'risk.wang',
      createTime: clock(-(index + 1), 14, 5),
      updateTime: clock(0, 11, 20 + index),
    })))
    return
  }
  if (/syslog\/listPage/i.test(url)) {
    const logs = [
      { module: '用户管理', content: '新增后台用户 ops.backup', method: 'POST', path: '/ar-manager/api/v1/users', requestParam: '{"username":"ops.backup","roleId":2}' },
      { module: '角色管理', content: '给风控专员勾选会员黑名单', method: 'PUT', path: '/ar-manager/menu/role/3', requestParam: '{"roleId":3,"menuIds":[1031]}' },
      { module: 'IP白名单', content: '停用临时排查 IP', method: 'POST', path: '/ar-manager/syswhite/disable', requestParam: '{"id":305,"ip":"112.74.22.16"}' },
      { module: '交易IP黑名单', content: '拉黑工作室出口', method: 'POST', path: '/ar-manager/tradeIpBlack/save', requestParam: '{"ipAddress":"45.133.12.8"}' },
      { module: '会员黑名单', content: '移出黑名单 10086003', method: 'POST', path: '/ar-manager/api/v1/memberBlack/removeBlack', requestParam: '{"memberId":10086003}' },
      { module: '商户列表', content: '给星河商城手动上分', method: 'POST', path: '/ar-manager/merchantInfoAdmin/applyRecharge', requestParam: '{"merchantCode":"M10021","amount":5000}' },
      { module: '菜单管理', content: '停用申诉订单菜单', method: 'PUT', path: '/ar-manager/menu', requestParam: '{"id":1023,"visible":0}' },
      { module: '系统登录日志', content: '导出当天登录记录', method: 'POST', path: '/ar-manager/adminLog/listPage', requestParam: '{"loginStatus":1}' },
    ]
    rows.splice(0, rows.length, ...logs.map((item, index) => ({
      id: 501 + index,
      ip: index % 2 === 0 ? '103.88.12.20' : '103.88.12.22',
      createBy: index % 3 === 0 ? 'prototype' : index % 3 === 1 ? 'risk.wang' : 'ops.li',
      createTime: clock(0, 9 + index, 6),
      ...item,
    })))
    return
  }
  if (/adminLog\/listPage/i.test(url)) {
    const logins = [
      { userId: 1001, username: 'prototype', merchantCode: '', userType: 1, loginStatus: 1, ipAddress: '103.88.12.20', device: 'Windows / Chrome', userAgent: 'Chrome/120.0 Windows NT 10.0' },
      { userId: 1002, username: 'ops.li', merchantCode: '', userType: 1, loginStatus: 1, ipAddress: '103.88.12.21', device: 'macOS / Chrome', userAgent: 'Chrome/120.0 Macintosh' },
      { userId: 1003, username: 'risk.wang', merchantCode: '', userType: 1, loginStatus: 2, ipAddress: '185.220.101.45', device: 'Windows / Chrome', userAgent: 'Chrome/119.0 Windows NT 10.0' },
      { userId: 1006, username: 'merchant.xinghe', merchantCode: 'M10021', userType: 2, loginStatus: 1, ipAddress: '49.207.18.66', device: 'Windows / Edge', userAgent: 'Edg/120.0 Windows NT 10.0' },
      { userId: 1006, username: 'merchant.xinghe', merchantCode: 'M10021', userType: 3, loginStatus: 1, ipAddress: '157.48.90.14', device: 'Android / Chrome', userAgent: 'Chrome/120.0 Android 14' },
      { userId: 1004, username: 'finance.zhao', merchantCode: '', userType: 1, loginStatus: 2, ipAddress: '102.89.34.17', device: 'Windows / Chrome', userAgent: 'Chrome/118.0 Windows NT 10.0' },
      { userId: 1005, username: 'cs.chen', merchantCode: '', userType: 1, loginStatus: 1, ipAddress: '103.88.12.20', device: 'macOS / Safari', userAgent: 'Safari/17.2 Macintosh' },
      { userId: 1008, username: 'kuaifu.admin', merchantCode: 'M10058', userType: 2, loginStatus: 2, ipAddress: '45.133.12.8', device: 'Windows / Chrome', userAgent: 'Chrome/117.0 Windows NT 10.0' },
    ]
    rows.splice(0, rows.length, ...logins.map((item, index) => ({
      id: 601 + index,
      ...item,
      loginTime: clock(0, 8 + index, 12),
    })))
  }
}

function buildRows(url: string) {
  const spec = specByUrl.get(url) || { columns: [], enums: [] }
  const appealIds = /appealOrderAdmin\/listpage/i.test(url) ? linkedAppealIds() : null
  const count = appealIds
    ? appealIds.length
    : Math.min(40, Math.max(10, ...spec.enums.map((item) => item.pairs.length), 10))
  const baseId = 880000 + (hash(url) % 50000)
  const rows: Row[] = []
  for (let index = 0; index < count; index += 1) {
    const bank = APP_UPI_BANKS[index % APP_UPI_BANKS.length]
    const memberId = 10086001 + (index % 10)
    const row: Row = {
      id: appealIds ? appealIds[index] : baseId + index + 1,
      index: index + 1,
      memberId,
      userId: memberId,
    }
    for (const column of spec.columns) {
      const field = column.field
      if (FIELD_VALUES[field]) {
        const values = FIELD_VALUES[field]
        row[field] = values[index % values.length]
        continue
      }
      const matched = enumFor(field, spec.enums)
      if (matched?.pairs.length) {
        row[field] = coerce(matched.pairs[index % matched.pairs.length].value)
        continue
      }
      if (/memberid|userid|buyerid|sellerid|^mid$|^uid$/i.test(field)) {
        row[field] = memberId
      } else if (field === 'id' && appealIds) {
        // 与各流水页可点击的 appealId 一一对应，点过去能筛到同一条申诉订单
        row[field] = appealIds[index]
      } else if (field === 'id' || /(?:^|_)id$/i.test(field) || (/Id$/.test(field) && !/upiId|uuid/i.test(field))) {
        row[field] = baseId + index + 1
      } else if (/time|date/i.test(field)) {
        row[field] = /date$/i.test(field) && !/time/i.test(field) ? indiaDay(-index) : stamp(index)
      } else if (/bankcode/i.test(field)) {
        row[field] = bank.bankCode
      } else if (/amount|balance|fee|reward|price|money|bonus|rate|count|num|qty|quantity|cost|commission|difference|diff|beforechange|afterchange|memberup|memberdown|cancellation|duration/i.test(field)) {
        row[field] = 1000 + index * 125
      } else if (/phone|mobile/i.test(field)) {
        row[field] = `910000100${index % 10}`
      } else if (/email/i.test(field)) {
        row[field] = `user${index + 1}@prototype.test`
      } else if (/upi/i.test(field)) {
        row[field] = `910000100${index % 10}${bank.upiSuffix}`
      } else if (/status|flag|type|mode|source|result|state|level|cycle|frequency/i.test(field)) {
        // 多数页面 map 只有 1/2；写到 3 容易 $t(undefined) 把路由渲染弄挂
        row[field] = (index % 2) + 1
      } else if (/name$/i.test(field)) {
        row[field] = `${field}${index + 1}`
      } else if (/no$|order|code|utr|tid|account|remark|content|url|path/i.test(field)) {
        row[field] = `${field}-${index + 1}`
      } else {
        // 避免把中文列名写进字段；有的 customRender 会按数字或枚举取值
        row[field] = `${field}-${index + 1}`
      }
    }
    // 通道代收：订单状态只有处理中/成功/失败，回调状态只有未回调/已回调。4、5 和 2 会直接显示成数字
    if (/channelCollectionOrderAdmin\/listPage/i.test(url)) {
      row.orderStatus = [1, 2, 3][index % 3]
      row.callbackStatus = index % 2
    }
    // USDT买入订单页内 orderStatusMap 只有 3/4/7/10/13；写成 1/2 会直接显示数字
    if (/usdtBuyOrderAdmin\/listpage/i.test(url)) {
      const usdtBuyStatus = ['3', '4', '7', '13', '10']
      row.status = usdtBuyStatus[index % usdtBuyStatus.length]
    }
    // 欠费订单：买方/卖方成对字段、撮合状态文案、金额小数，对齐页面展示
    if (/memberArrearsRecordAdmin\/listPage/i.test(url)) {
      const matchStatuses = [8, 12, 13, 5, 6, 3, 4, 15, 16, 7]
      const sellerId = 10086001 + (index % 10)
      const buyerId = 10086011 + (index % 10)
      row.memberId = sellerId
      row.buyerId = buyerId
      row.memberAccount = `91${String(8000000000 + sellerId).slice(-10)}`
      row.buyerAccount = `91${String(8000000000 + buyerId).slice(-10)}`
      row.chOrderNo = `M${860001 + index}`
      row.buyOrderNo = `B${870001 + index}`
      row.sellOrderNo = `S${880001 + index}`
      row.buyOrderIp = `103.${(index % 50) + 1}.${(index % 200) + 10}.${(index % 250) + 1}`
      row.sellOrderIp = index % 3 === 0
        ? '0.0.0.0'
        : index % 3 === 1
          ? `auto-sell:${sellerId}`
          : `49.${index + 1}.8.${index + 2}`
      row.matchingOrderStatus = matchStatuses[index % matchStatuses.length]
      row.isKycSell = index % 2
      row.sourceType = index % 6
      row.orderAmount = Number((100 + index * 37.5).toFixed(2))
      row.amount = Number((38.5 + index * 50.35).toFixed(2))
      row.utr = String(345697988675 + index)
      row.operationBy = index % 2 === 0 ? 'system' : `admin${(index % 3) + 1}`
      row.operationTime = stamp(index)
    }
    rows.push(row)
  }
  tuneOpsRows(url, rows)
  tuneMandateRows(url, rows)
  tuneUserLevelRows(url, rows)
  tuneReportRows(url, rows)
  tuneWindRows(url, rows)
  tuneAdminRows(url, rows)
  const timeKey = spec.columns.find((column) => /time/i.test(column.field))?.field || 'createTime'
  return { rows, timeKey }
}

function ensure(url: string) {
  // 申诉订单列表与流水 appealId 联动，每次按最新 linkedAppealIds 重建，避免旧数字 id 残留
  if (/appealOrderAdmin\/listpage/i.test(url)) {
    const created = buildRows(url)
    tuneOrderFixture(url, created.rows)
    stores.set(url, created)
    return created
  }
  const found = stores.get(url)
  if (found) return found
  const created = buildRows(url)
  tuneOrderFixture(url, created.rows)
  stores.set(url, created)
  return created
}

const BUY_SELL_STATUS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 17]
const BUY_ORDER_TYPES = [1, 2, 3, 4, 5, 6, 7]
const ORDER_SOURCES = [0, 1, 2, 3, 4, 5]
const AUTO_SELL_FLAGS = [0, 1, 2]
const MATCH_STATUS = [3, 4, 5, 6, 7, 8, 12, 13, 15, 16]
// 第一页按操作按钮的显示条件各放一条。状态必须是字符串，页面用 ['3'].includes(status) 判断。
const MATCH_CASES: Row[] = [
  { status: '3', sourceType: 0, buyOrderType: 1, appealStatus: 3 },
  { status: '4', sourceType: 1, buyOrderType: 2, freezeFlag: 1, freezeMode: 1, freezeReason: 1, appealStatus: 2, showMessage: true, auditSeconds: 120 },
  { status: '1', sourceType: 0, buyOrderType: 3, appealStatus: 3 },
  { status: '5', sourceType: 0, buyOrderType: 4, appealStatus: 3, buyAppealSupported: true, appealLink: '' },
  { status: '6', sourceType: 2, buyOrderType: 1, appealStatus: 1 },
  { status: '12', sourceType: 0, buyOrderType: 1, appealStatus: 1, replenishmentFlag: 0, autoFinishFlag: 0 },
  { status: '7', sourceType: 5, buyOrderType: 3, appealStatus: 3, confirmPayFlag: 1 },
  { status: '8', sourceType: 3, buyOrderType: 2, appealStatus: 3 },
  { status: '4', sourceType: 0, buyOrderType: 1, freezeFlag: 1, freezeMode: 2, freezeReason: 6, appealStatus: 3 },
  { status: '15', sourceType: 4, buyOrderType: 4, appealStatus: 3, buyAppealSupported: true, appealLink: 'https://prototype.local/appeal/WD10' },
]
const PARENT_STATUS = [1, 2, 7, 8, 20, 21]
const IMPORT_BATCH_STATUS = ['PENDING', 'PROCESSING', 'FINISHED']
const IMPORT_PROCESS_STATUS = ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED']
const IMPORT_BATCH_NOS = ['IB2026111701', 'IB2026111702', 'IB2026111703']
const VOUCHER_IMAGE = '/prototype-voucher.png'

function cycle<T>(values: T[], index: number) {
  return values[index % values.length]
}

function grow(rows: Row[], size: number) {
  const base = rows[0]
  if (!base) return
  let extra = 0
  while (rows.length < size) {
    extra += 1
    const index = rows.length
    rows.push({
      ...base,
      id: 980000 + extra,
      index: index + 1,
      memberId: 10086001 + (index % 10),
      createTime: stamp(index),
      submitTime: stamp(index),
    })
  }
}

function listStore(pattern: RegExp) {
  const url = listUrls.find((item) => pattern.test(item))
  return url ? ensure(url) : null
}

function tuneOrderFixture(url: string, rows: Row[]) {
  if (/generateQuickUpiOrBankAdmin\/listPage$/i.test(url)) {
    rows.forEach((row, index) => {
      const status = cycle(['1', '2', '3'], index)
      const voucherStatus = status === '2' ? (index % 2 === 0 ? 2 : 3) : 1
      row.callbackTradeStatus = status
      row.canRetry = status === '3'
      row.channel = index % 2 === 0 ? '1' : '3'
      row.paymentVoucherProcessStatus = voucherStatus
      row.rewardIssued = voucherStatus === 3 ? 1 : 0
      row.merchantTradeNo = `MT${10001 + index}`
      row.rootMerchantTradeNo = `RT${10001 + (index % 5)}`
      row.platformTradeNo = `PT${10001 + index}`
      row.voucherImage = VOUCHER_IMAGE
      row.submitTime = stamp(index)
      row.callbackTime = stamp(index)
      row.operatorName = 'prototype'
      row.amount = 2000 + index * 100
      row.paymentVoucherRewardAmount = 20 + index
      row.utr = `51234567890${index % 10}`
      row.upiId = `910000100${index % 10}@oksbi`
      row.bankCardNumber = `608012340000${String(index).padStart(2, '0')}`
      row.bankName = 'HDFC Bank'
      row.bankCode = 'HDFC'
      row.ifsc = 'HDFC0001234'
      row.merchantCode = 'M10021'
      row.merchantMemberId = `MM${10086001 + (index % 10)}`
      row.requestIp = `112.1.185.${70 + (index % 10)}`
      row.retryNo = status === '3' ? 1 : 0
      row.remark = status === '3' ? '代付失败，可重新下单' : ''
    })
    return
  }
  if (/listImportBatchPage$/i.test(url)) {
    grow(rows, IMPORT_BATCH_STATUS.length)
    rows.forEach((row, index) => {
      const status = cycle(IMPORT_BATCH_STATUS, index)
      row.batchStatus = status
      row.importBatchNo = IMPORT_BATCH_NOS[index % IMPORT_BATCH_NOS.length]
      row.importTime = stamp(index)
      row.finishTime = status === 'FINISHED' ? stamp(index) : ''
      row.fileName = `manual-sell-${index + 1}.xlsx`
      row.operatorName = 'prototype'
      row.totalCount = 4
      row.pendingCount = status === 'PENDING' ? 4 : status === 'PROCESSING' ? 1 : 0
      row.successCount = status === 'PENDING' ? 0 : 3
      row.failedCount = status === 'FINISHED' ? 1 : 0
    })
    return
  }
  if (/listImportOrderRecordPage$/i.test(url)) {
    grow(rows, IMPORT_BATCH_STATUS.length * IMPORT_PROCESS_STATUS.length)
    rows.forEach((row, index) => {
      const batchIndex = Math.floor(index / IMPORT_PROCESS_STATUS.length)
      row.importBatchNo = IMPORT_BATCH_NOS[batchIndex % IMPORT_BATCH_NOS.length]
      row.processStatus = cycle(IMPORT_PROCESS_STATUS, index)
      row.processTime = stamp(index)
      row.merchantTradeNo = `IMT${10001 + index}`
      row.channel = index % 2 === 0 ? '1' : '3'
      row.processMsg = row.processStatus === 'FAILED' ? '收款账户校验失败' : '处理完成'
      row.amount = 1500 + index * 100
    })
    return
  }
  if (/matchPoolAdmin\/listpage$/i.test(url)) {
    grow(rows, PARENT_STATUS.length)
    rows.forEach((row, index) => {
      row.orderStatus = cycle(PARENT_STATUS, index)
      row.createTime = stamp(index)
      row.sellOrderType = (index % 2) + 1
      row.orderFinishType = (index % 4) + 1
      row.matchTimeoutReason = (index % 7) + 1
      row.autoSellFlag = cycle(AUTO_SELL_FLAGS, index)
    })
    return
  }
  if (/(^|\/)collectionOrderAdmin\/listPage$/i.test(url)) {
    grow(rows, BUY_SELL_STATUS.length)
    rows.forEach((row, index) => {
      row.orderStatus = cycle(BUY_SELL_STATUS, index)
      row.buyOrderType = cycle(BUY_ORDER_TYPES, index)
      row.sourceType = cycle(ORDER_SOURCES, index)
      row.autoSellFlag = cycle(AUTO_SELL_FLAGS, index)
      row.createTime = stamp(index)
      row.platformOrder = `BO${10001 + index}`
      row.upiId = prototypeFlowUpi()
      row.quadOrderChannel = index % 2 === 0 ? 'PhonePe' : ''
      row.orderSubmitAmount = 1000 + index * 100
      row.orderActualAmount = 1000 + index * 100
    })
    return
  }
  if (/paymentOrderAdmin\/listPage$/i.test(url)) {
    grow(rows, BUY_SELL_STATUS.length)
    rows.forEach((row, index) => {
      row.orderStatus = cycle(BUY_SELL_STATUS, index)
      row.sourceType = cycle(ORDER_SOURCES, index)
      row.sellOrderType = (index % 2) + 1
      row.autoSellFlag = cycle(AUTO_SELL_FLAGS, index)
      row.thirdRechargeFlag = index % 2
      row.completedByKyc = index % 2 === 0 ? '1' : '0'
      row.createTime = stamp(index)
      row.platformOrder = `SO${10001 + index}`
      row.orderSubmitAmount = 1800 + index * 100
      row.orderActualAmount = 1800 + index * 100
    })
    return
  }
  if (/matchingOrderAdmin\/listpage$/i.test(url)) {
    const appealCount = linkedAppealIds().length
    grow(rows, Math.max(MATCH_STATUS.length, ORDER_SOURCES.length, appealCount, MATCH_CASES.length))
    rows.forEach((row, index) => {
      const amount = 1600 + index * 100
      const scenario = MATCH_CASES[index]
      Object.assign(row, {
        status: String(cycle(MATCH_STATUS, index)),
        sourceType: cycle(ORDER_SOURCES, index),
        buyOrderType: cycle(BUY_ORDER_TYPES, index),
        isQuadOrder: '0',
        repackageAppBuyFlag: 0,
        replenishmentFlag: 0,
        autoFinishFlag: 0,
        freezeFlag: 0,
        freezeMode: 1,
        freezeReason: 1,
        confirmPayFlag: 0,
        appealStatus: 3,
        appealLink: '',
        buyAppealSupported: false,
        showMessage: false,
        auditSeconds: 0,
        ...(scenario || {}),
        paymentPlatformOrder: `WD${index + 1}`,
        collectionPlatformOrder: `BO${10001 + index}`,
        platformOrder: `CH${10001 + index}`,
        matchOrder: `MP${10001 + index}`,
        autoSellFlag: cycle(AUTO_SELL_FLAGS, index),
        wakeUpFlag: index % 2,
        displayAppealType: cycle([1, 2, 3, 4, 5, 6, 7], index),
        appealFlag: cycle([1, 2], index),
        sellOrderType: (index % 2) + 1,
        payType: cycle([1, 2, 3, 5], index),
        kycAutoCompletionStatus: index % 2,
        riskTag: cycle(['0', '1', '2', '3'], index),
        backendOperationType: index % 6,
        completedBaseType: 0,
        createTime: stamp(0),
        upiId: prototypeFlowUpi(),
        collectionMemberId: 10086001,
        paymentMemberId: 10086002,
        orderSubmitAmount: amount,
        orderActualAmount: amount,
        randomAmount: 0,
        utr: `4987654321${String(index % 100).padStart(2, '0')}`,
        bankName: 'HDFC Bank',
        bankOwner: 'RAHUL SHARMA',
        bankCardNumber: '60801234000001',
        ifscCode: 'HDFC0001234',
      })
    })
    return
  }
  if (/cashBackOrderAdmin\/listPage$/i.test(url)) {
    grow(rows, 3)
    rows.forEach((row, index) => {
      const status = cycle([1, 2, 3], index)
      row.orderStatus = status
      row.amount = 500 + index * 100
      row.platformOrder = `RF${10001 + index}`
      row.merchantOrder = `MRF${10001 + index}`
      row.merchantCode = 'M10021'
      row.merchantName = '星河商城'
      row.failedReason = status === 3 ? '收款账户异常' : ''
      row.remark = status === 1 ? '退款处理中' : ''
      row.createTime = stamp(index)
      row.createBy = 'prototype'
    })
    return
  }
  if (/usdtSellOrderAdmin\/listUsdtSellOrders$/i.test(url)) {
    const statuses = ['7', '10', '18', '19']
    grow(rows, 6)
    rows.forEach((row, index) => {
      const status = cycle(statuses, index)
      row.status = status
      row.memberType = cycle([1, 2, 3, 4, 5, 6], index)
      row.callbackStatus = cycle([1, 2, 3], index)
      row.thirdTradeOrderStatus = cycle([1, 2, 3], index)
      row.platformOrder = `USDT-S${10001 + index}`
      row.memberAccount = `910000100${index % 10}`
      row.usdtAddr = `TPrototypeUsdt${1001 + index}`
      row.usdtActualNum = 100 + index * 10
      row.arbActualNum = 8000 + index * 100
      row.createTime = stamp(index)
      row.completionTime = status === '7' ? stamp(index) : ''
      row.callbackTime = row.callbackStatus === 1 ? '' : stamp(index)
      row.operationTime = stamp(index)
      row.operator = 'prototype'
      row.operatorIp = `112.1.185.${70 + (index % 10)}`
      row.remark = status === '18' ? '待审核' : status === '10' ? '卖出失败' : ''
      row.thirdPartyResponseMessage = status === '10' ? '三方代付失败' : '处理完成'
    })
    return
  }
  if (/appealOrderAdmin\/listpage$/i.test(url)) {
    rows.forEach((row, index) => {
      row.withdrawOrderNo = `WD${index + 1}`
      row.rechargeOrderNo = `BO${10001 + index}`
      row.collectionPlatformOrder = `BO${10001 + index}`
      row.upiId = prototypeFlowUpi()
      row.createTime = stamp(0)
      row.handlerUserId = index < 5 ? 'prototype' : ''
      row.handlerUserName = index < 5 ? 'prototype' : ''
    })
  }
}

function orderDetail(row: Row, kind: 'buy' | 'sell') {
  const shared = {
    ...row,
    voucher: VOUCHER_IMAGE,
    mobileNumber: '9100001001',
    utr: '512345678901',
    randomCode: 'TID88001',
    cancellationReason: '买家超时未支付',
    createTime: row.createTime || stamp(0),
    paymentTime: row.paymentTime || stamp(1),
    appealTime: row.appealTime || stamp(2),
    finishTime: row.finishTime || stamp(3),
    merchantName: row.merchantName || '星河商城',
    merchantMemberId: row.merchantMemberId || 'MM10086001',
    merchantOrder: row.merchantOrder || (kind === 'buy' ? 'MBO10001' : 'MSO10001'),
  }
  if (kind === 'buy') {
    return {
      ...shared,
      buyerBankCode: 'HDFC',
      buyerUpiId: '9100001001@oksbi',
    }
  }
  return {
    ...shared,
    bankCode: 'HDFC',
    upiId: '9100001002@oksbi',
    kycId: 'KYC10086001',
  }
}

function appealDetailOf(row: Row) {
  return {
    ...row,
    orderSubmitAmount: row.orderSubmitAmount || 1600,
    orderActualAmount: row.orderActualAmount || 1600,
    utr: row.utr || '498765432101',
    reason: '买家反馈已付款，卖家未确认到账',
    sellerReason: '卖家反馈未收到该笔款项',
    displayAppealType: 2,
    picInfo: VOUCHER_IMAGE,
    sellerPics: VOUCHER_IMAGE,
    videoUrl: '',
    sellerVideo: '',
    appealCreateTime: stamp(1),
    createTime: row.createTime || stamp(0),
    paymentTime: stamp(2),
    submitTime: stamp(2),
    appealPhoneNo: '9100001003',
    appealKycStatus: 1,
    appealBankCode: 'HDFC',
    collectionPlatformOrder: row.collectionPlatformOrder || 'BO10001',
  }
}

function matchInfoOf(row: Row) {
  return {
    ...appealDetailOf(row),
    merchantCode: row.merchantCode || 'M10021',
    updateBy: 'prototype',
    remark: '原型申诉备注',
    upiId: prototypeFlowUpi(),
    sellerCollectInfo: {
      upiId: prototypeFlowUpi(),
      bankCardNumber: '60801234000001',
      bankCardOwner: 'RAHUL SHARMA',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
    },
    sellerKycInfo: {
      memberId: row.paymentMemberId || 10086001,
      lastLinkTime: stamp(1),
      lastUnLinkTime: stamp(2),
      linkStatus: 1,
      upiId: prototypeFlowUpi(),
    },
    buyerKycInfo: {
      phoneNumber: '9100001001',
      upiId: prototypeFlowUpi(),
    },
  }
}

function matchRows() {
  return listStore(/matchingOrderAdmin\/listpage$/i)?.rows || []
}

function findMatch(body: Record<string, any>) {
  const rows = matchRows()
  if (body.id != null) {
    const row = rows.find((item) => String(item.id) === String(body.id))
    if (row) return row
  }
  const orderNo = body.chOrderNo || body.matchingOrderNo || body.platformOrder
  if (orderNo) return rows.find((item) => item.platformOrder === orderNo)
  return undefined
}

function resolveOrderSpecial(url: string, raw: unknown) {
  const body = readQuery(raw)
  if (/(^|\/)collectionOrderAdmin\/getInfo/i.test(url)) {
    const store = listStore(/(^|\/)collectionOrderAdmin\/listPage$/i)
    const row = store?.rows.find((item) => String(item.id) === String(body.id)) || store?.rows[0] || {}
    return { code: '1', msg: '操作成功', data: orderDetail(row, 'buy'), success: true }
  }
  if (/paymentOrderAdmin\/getInfo/i.test(url)) {
    const store = listStore(/paymentOrderAdmin\/listPage$/i)
    const row = store?.rows.find((item) => String(item.id) === String(body.id)) || store?.rows[0] || {}
    return { code: '1', msg: '操作成功', data: orderDetail(row, 'sell'), success: true }
  }
  if (/matchingOrderAdmin\/appealDetail/i.test(url)) {
    const row = findMatch(body) || matchRows()[0] || {}
    return { code: '1', msg: '操作成功', data: appealDetailOf(row), success: true }
  }
  if (/matchingOrderAdmin\/getInfo/i.test(url)) {
    const row = findMatch(body) || matchRows()[0] || {}
    return { code: '1', msg: '操作成功', data: matchInfoOf(row), success: true }
  }
  if (/matchingOrderAdmin\/incorrectVoucher/i.test(url)) {
    const row = findMatch(body) || matchRows()[0] || {}
    return {
      code: '1',
      msg: '操作成功',
      data: {
        ...appealDetailOf(row),
        reason: '买家上传的金额与订单金额不一致',
      },
      success: true,
    }
  }
  if (/matchingOrderAdmin\/unfreeze/i.test(url)) {
    const row = findMatch(body)
    if (row) {
      row.freezeFlag = 0
      row.remark = body.remark || row.remark
    }
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/matchingOrderAdmin\/pay$/i.test(url)) {
    const row = findMatch(body)
    if (row) row.status = '7'
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/matchingOrderAdmin\/nopay/i.test(url)) {
    const row = findMatch(body)
    if (row) row.status = '8'
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/matchingOrderAdmin\/orderReplenishment$/i.test(url)) {
    const row = findMatch(body)
    if (row) row.replenishmentFlag = 2
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/matchingOrderAdmin\/confirmPay/i.test(url)) {
    const row = findMatch(body)
    if (row) row.confirmPayFlag = 0
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/matchingOrderAdmin\/createAppealLink/i.test(url)) {
    const row = findMatch(body)
    if (row) {
      row.appealLink = `https://prototype.local/appeal/${row.paymentPlatformOrder || row.id}`
      row.buyAppealSupported = true
    }
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/matchingOrderAdmin\/autoFailOrderAppealSuccess/i.test(url)) {
    const row = findMatch(body)
    if (row) row.appealStatus = 2
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/matchingOrderAdmin\/autoFailOrderAppealFail/i.test(url)) {
    const row = findMatch(body)
    if (row) row.appealStatus = 3
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/matchingOrderAdmin\/incorrectTransfer/i.test(url)) {
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/generateQuickUpiOrBankAdmin\/retryOrder/i.test(url)) {
    const store = listStore(/generateQuickUpiOrBankAdmin\/listPage$/i)
    const current = store?.rows.find((item) => item.merchantTradeNo === body.currentMerchantTradeNo)
    if (current) {
      current.canRetry = false
      current.callbackTradeStatus = '1'
      current.remark = body.remark || '已重新下单'
    }
    if (store && body.newMerchantTradeNo) {
      store.rows.unshift({
        ...(current || {}),
        id: 990000 + store.rows.length,
        merchantTradeNo: body.newMerchantTradeNo,
        rootMerchantTradeNo: body.rootMerchantTradeNo || current?.rootMerchantTradeNo,
        platformTradeNo: `PT${990000 + store.rows.length}`,
        callbackTradeStatus: '1',
        canRetry: false,
        paymentVoucherProcessStatus: 1,
        rewardIssued: 0,
        submitTime: stamp(0),
        remark: body.remark || '',
      })
    }
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/generateQuickUpiOrBankAdmin\/issuePaymentVoucherReward/i.test(url)) {
    const store = listStore(/generateQuickUpiOrBankAdmin\/listPage$/i)
    const row = store?.rows.find((item) => item.merchantTradeNo === body.merchantTradeNo)
    if (row) {
      row.paymentVoucherProcessStatus = 3
      row.rewardIssued = 1
    }
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/generateQuickUpiOrBankAdmin\/rejectPaymentVoucher/i.test(url)) {
    const store = listStore(/generateQuickUpiOrBankAdmin\/listPage$/i)
    const row = store?.rows.find((item) => item.merchantTradeNo === body.merchantTradeNo)
    if (row) row.paymentVoucherProcessStatus = 1
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  return null
}

function inRange(value: string, start: unknown, end: unknown) {
  let text = String(value ?? '')
  let left = hasFilter(start) ? String(start) : ''
  let right = hasFilter(end) ? String(end) : ''
  if (/^\d{4}-\d{2}$/.test(left) || /^\d{4}-\d{2}$/.test(right)) {
    text = text.slice(0, 7)
    left = left.slice(0, 7)
    right = right.slice(0, 7)
  }
  const dateOnly = (item: string) => item.length === 10 && !item.includes(' ')
  const probe = dateOnly(left) || dateOnly(right) ? text.slice(0, 10) : text
  if (left && probe < left) return false
  if (right && probe > right) return false
  return true
}

function isRangeKey(key: string) {
  return /(Start|End|Begin)(Time|Date)?$/.test(key)
    || /^(start|end|begin)(Time|Date)$/i.test(key)
    || /(Time|Date)(Ge|Le|Start|End)$/.test(key)
    || /(Ge|Le)$/.test(key)
}

function timeQuery(query: Record<string, any>, row: Row) {
  const keys = Object.keys(query).filter((key) => hasFilter(query[key]) && isRangeKey(key))
  const startKey = keys.find((key) => /start|begin|ge/i.test(key))
  if (!startKey) return true
  const endKey = keys.find((key) => key !== startKey && /end|le/i.test(key))
  const base = startKey.replace(/(Start|Begin|End|Ge|Le)(Time|Date)?$/i, '').replace(/Time$|Date$/i, '')
  const candidates = [base, `${base}Time`, `${base}Date`, 'createTime', 'statDate', 'updateTime']
  const field = candidates.find((item) => item && row[item] != null)
    || Object.keys(row).find((item) => /time|date/i.test(item))
  if (!field) return true
  return inRange(String(row[field]), query[startKey], endKey ? query[endKey] : '')
}

function comparable(rowValue: unknown, queryValue: unknown) {
  if (typeof rowValue === 'number' || typeof rowValue === 'boolean') return true
  const text = String(rowValue ?? '')
  if (/[\u4e00-\u9fa5]/.test(text) && /^-?\d+(\.\d+)?$/.test(String(queryValue))) return false
  return true
}

function matches(row: Row, query: Record<string, any>) {
  if (!timeQuery(query, row)) return false
  for (const [key, value] of Object.entries(query)) {
    if (SKIP_QUERY.has(key) || !hasFilter(value) || isRangeKey(key)) continue
    if (!(key in row) || !comparable(row[key], value)) continue
    if (Array.isArray(value)) {
      if (!value.map(String).includes(String(row[key]))) return false
      continue
    }
    const text = String(row[key] ?? '')
    const probe = String(value).trim().toLowerCase()
    // 申诉订单按申诉ID（id）精确匹配，点流水过来只落在对应那一条
    if (key === 'id') {
      if (text.toLowerCase() !== probe) return false
      continue
    }
    // 订单状态是多选，页面用逗号拼成 "3,4"。按整串去包含会一条都对不上；"3" 也会误中 "13"。
    if (String(value).includes(',') || /status$/i.test(key)) {
      const tokens = String(value).split(',').map((item) => item.trim()).filter(Boolean)
      if (!tokens.includes(String(row[key]))) return false
      continue
    }
    if (typeof row[key] === 'number' || typeof row[key] === 'boolean') {
      if (String(row[key]) !== String(value)) return false
    } else if (!text.toLowerCase().includes(probe)) {
      return false
    }
  }
  return true
}

function pageOf(list: Row[], query: Record<string, any>) {
  const pageNo = Number(query.pageNo || query.pageNum || query.current) || 1
  const pageSize = Number(query.pageSize || query.size) || 20
  const start = (pageNo - 1) * pageSize
  return list.slice(start, start + pageSize)
}

function sumField(rows: Row[], field: string) {
  return rows.reduce((total, row) => total + (Number(row[field]) || 0), 0)
}

function numericFields(rows: Row[]) {
  const fields = new Set<string>()
  for (const row of rows) {
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'number' && Number.isFinite(value)) fields.add(key)
    }
  }
  return [...fields]
}

function pascal(field: string) {
  return field.slice(0, 1).toUpperCase() + field.slice(1)
}

function putSum(extend: Record<string, number>, page: Row[], all: Row[], field: string, pageKey: string, totalKey: string) {
  extend[pageKey] = sumField(page, field)
  extend[totalKey] = sumField(all, field)
}

function summaryExtend(url: string, page: Row[], all: Row[]) {
  const extend: Record<string, number> = {}
  const source = all.length ? all : page
  for (const field of numericFields(source)) {
    putSum(extend, page, all, field, `${field}PageTotal`, `${field}Total`)
    putSum(extend, page, all, field, `pageTotal${pascal(field)}`, `total${pascal(field)}`)
  }
  const alias = (field: string, pageKey: string, totalKey: string) => {
    if (!source.some((row) => typeof row[field] === 'number')) return
    putSum(extend, page, all, field, pageKey, totalKey)
  }
  alias('amount', 'amountTotalPage', 'amountTotal')
  alias('amount', 'pageAmount', 'totalAmount')
  alias('bonus', 'bonusPagePageTotal', 'bonusPageTotal')
  alias('actualAmount', 'actualPageAmountTotal', 'actualAmountTotal')
  alias('fixedReward', 'fixedRewardPageTotal', 'totalFixedReward')
  alias('remainingAmount', 'remainingAmountPageTotal', 'sumRemainingAmount')
  alias('beforeChange', 'beforeAmountSum', 'totalBeforeAmountSum')
  alias('changeAmount', 'changeAmountSum', 'totalChangeAmountSum')
  alias('afterChange', 'afterAmountSum', 'totalAfterAmountSum')
  alias('orderAmount', 'pageOrderAmountSum', 'totalOrderAmountSum')
  alias('actualAmount', 'pageActualAmountSum', 'totalActualAmountSum')
  alias('cost', 'pageCostSum', 'totalCostSum')
  alias('totalFee', 'feePageTotal', 'feeTotal')
  alias('usdtBuyMoney', 'usdtBuyPageMoneyTotal', 'usdtBuyMoneyTotal')
  if (url.includes('/matchingOrderAdmin/listpage')) {
    putSum(extend, page, all, 'randomAmount', 'randomAmountPageTotal', 'randomAmountTotal')
  }
  if (url.includes('/biMerchantReconciliation/')) alias('merchantBalance', 'balancePageTotal', 'balanceTotal')
  if (url.includes('/biMemberReconciliation/')) alias('memberBalance', 'balancePageTotal', 'balanceTotal')
  if (/rewardCardUsageRecordAdmin\/listPage/i.test(url)) {
    extend.totalCountAll = all.length
    extend.usedCountAll = all.filter((row) => Number(row.status) === 3).length
  }
  return extend
}

function listBody(url: string, raw: unknown) {
  const query = readQuery(raw)
  const store = ensure(url)
  const filtered = store.rows.filter((row) => matches(row, query))
  const page = pageOf(filtered, query)
  const last = page[page.length - 1]
  const first = page[0]
  const extend = {
    nextColValue: last ? String(last[store.timeKey] ?? last.id ?? '') : '',
    nextCursorId: last ? String(last.id ?? '') : '',
    prevColValue: first ? String(first[store.timeKey] ?? first.id ?? '') : '',
    prevCursorId: first ? String(first.id ?? '') : '',
    ...summaryExtend(url, page, filtered),
  }
  const data = Object.assign(page.slice(), {
    list: page,
    records: page,
    total: filtered.length,
    extend,
  })
  return {
    code: '1',
    msg: '操作成功',
    data,
    total: filtered.length,
    extend,
    success: true,
  }
}

function resourceOf(url: string) {
  return url.split('?')[0].replace(/\/[^/]+$/, '')
}

function writeBody(url: string, raw: unknown) {
  const body = readQuery(raw)
  const resource = resourceOf(url)
  const related = [...stores.entries()].filter(([listUrl]) => resourceOf(listUrl) === resource)
  if (/merchantInfoAdmin/i.test(url)) {
    const listUrl = listUrls.find((item) => /merchantInfoAdmin\/listpage/i.test(item))
    if (listUrl && !related.some(([item]) => item === listUrl)) related.push([listUrl, ensure(listUrl)])
  }
  if (/memberArrearsRecordAdmin\/totalMemberDebt/i.test(url)) {
    const listUrl = listUrls.find((item) => /memberArrearsRecordAdmin\/listPage/i.test(item)) || ''
    const rows = listUrl ? ensure(listUrl).rows : []
    const owedRows = rows.filter((row) => Number(row.amount) > 0)
    return {
      code: '1',
      msg: '操作成功',
      data: {
        totalOwedAmount: Number(sumField(owedRows, 'amount').toFixed(2)),
        positiveOwedUserCount: new Set(owedRows.map((row) => row.memberId)).size,
      },
      success: true,
    }
  }
  if (/merchantInfoAdmin\/getDefaultAllowedIps/i.test(url)) {
    return { code: '1', msg: '操作成功', data: '10.0.0.8,10.0.0.9', success: true }
  }
  if (/getinfo|detail|\/info$/i.test(url)) {
    const rows = related.flatMap(([, store]) => store.rows)
    const pathId = url.split('?')[0].split('/').pop() || ''
    const id = body.id ?? body.taskId ?? (/^\d+$/.test(pathId) ? pathId : undefined)
    const row = rows.find((item) => id != null && String(item.id) === String(id)) || rows[0] || {}
    const data = { ...row, ...body }
    if (/merchantInfoAdmin\/getInfo/i.test(url)) {
      Object.assign(data, {
        country: data.country && !String(data.country).includes('-') ? data.country : 'India',
        currency: 'ARB',
        usdtAddress: data.usdtAddress && !String(data.usdtAddress).includes('-') ? data.usdtAddress : 'TPrototypeMerchantUsdt0001',
        platformPublicKey: 'prototype-platform-public-key',
        merchantPublicKey: 'prototype-merchant-public-key',
        googlesecret: 'PROTOTYPEGOOGLESECRET',
        account: 'prototype',
        logins: 18,
        totalPayAmount: 256000,
        totalWithdrawAmount: 184000,
        transferDownCount: 6,
        transferDownAmount: 4200,
        rechargeRewardRatio: data.rechargeReward ?? 0.5,
        icon: '',
      })
    }
    return { code: '1', msg: '操作成功', data, success: true }
  }
  if (/statistic|overview|count|sum/i.test(url)) {
    return {
      code: '1',
      msg: '操作成功',
      data: { completionNum: 12, recipientsNum: 8, rewardAmount: 5600, totalCount: 10, totalAmount: 5600 },
      success: true,
    }
  }
  for (const [, store] of related) {
    const id = body.id ?? body.eventId ?? body.ids
    if (Array.isArray(id)) {
      store.rows = store.rows.filter((row) => !id.map(String).includes(String(row.id)))
      continue
    }
    const row = store.rows.find((item) => id != null && String(item.id) === String(id))
    if (row && /delete|remove/i.test(url)) {
      store.rows = store.rows.filter((item) => String(item.id) !== String(id))
    } else if (row) Object.assign(row, body)
    else if (/add|save|create|insert/i.test(url) && body && Object.keys(body).length) {
      store.rows.unshift({ ...(store.rows[0] || {}), ...body, id: 890000 + store.rows.length })
    } else if (/delete|remove/i.test(url) && id != null) {
      store.rows = store.rows.filter((item) => String(item.id) !== String(id))
    }
  }
  return { code: '1', msg: '操作成功', data: true, success: true }
}

function longest(url: string, candidates: string[]) {
  return candidates.find((item) => item && url.includes(item)) || ''
}

const MERCHANT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA27MUfvqXRigwQ+Kot2Tm
skOemmkI1XHp1889EVoZIjX63Y25WOTvMwenIIoNS7bJNrYCIy/yB2SWV4FZrwG5
b+aqiNJJz9foJBgdxuxPcp90KtUNPJmoVaNnXLHDzvzuKubvRonUN7LEbgWCEmQT
uJq1KAu/whp0IYOEiZbnVnAgbU8hWWt+F+vinXm7zvTO9ppH5hMY9L/5mFISGwz7
94/2RjSrlksKtGW6xjsd25snciFqgc+SjzncRhmhv01wsqNNFs6C9Jy5vrC6fN3j
sIDiMfHjwQBOdRqfFtz5w1MXT6o/MSWse8NcIFqIFCTfSthShUVHeRax+3jnj7bh
KQIDAQAB
-----END PUBLIC KEY-----`

const MERCHANT_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbsxR++pdGKDBD
4qi3ZOayQ56aaQjVcenXzz0RWhkiNfrdjblY5O8zB6cgig1Ltsk2tgIjL/IHZJZX
gVmvAblv5qqI0knP1+gkGB3G7E9yn3Qq1Q08mahVo2dcscPO/O4q5u9GidQ3ssRu
BYISZBO4mrUoC7/CGnQhg4SJludWcCBtTyFZa34X6+KdebvO9M72mkfmExj0v/mY
UhIbDPv3j/ZGNKuWSwq0ZbrGOx3bmydyIWqBz5KPOdxGGaG/TXCyo00WzoL0nLm+
sLp83eOwgOIx8ePBAE51Gp8W3PnDUxdPqj8xJax7w1wgWogUJN9K2FKFRUd5FrH7
eOePtuEpAgMBAAECggEAGQHekqCMAQaYjdWaLjvcPYzQXBOaF4+eljvG3/eBNmFu
E3NrFkkCyCx2E9Ba+JQO/b0Ea8RsmHZU3ZOB5Zd859WZ8jZ7g9631Anxs7+YwHuR
ccGr/sqfvFW78XNjjidApd4A/Oa54vgkf0B9wIGnNANaHPuPYXT45Iqvlqi4XuBw
5HnD9ipg8rRQhtlNsHvdno11fl1DZR/0aYNTYEHXhwAXqeLrOxM7BArcy++5FPXD
PeptZmfD0rTH9vtyT1pRIehD75hdGbtxBrBY0A6FU4QjoRSwODwJ1O6V0ru+pvuU
Ns/S2P82TRUExa/rs5LElu15yivGcjnUP6Og9hQLAQKBgQD50QCh6VPF3Pagsc0J
cRUh5hDfz283Sj8/5nKt3XBRQPkozid0HEdFKSyHAEaXsL//pG4YoGKXkUvbM71z
d3xeOcGXVpELFtDZ0PrxZKoS18bYaDOgTMILed1Bj1JF3RCUaEGH8qNuBiWIysGe
4BCIo6Jj3auUcalHrMBaR0k4gQKBgQDhIzzVxBK0lMrQ4+qEtuz/CxhAajYtPKzA
4qwq/Na7GvJN+uspQJGNIjdPzOdfDDl2LbcMs8TpRJX7hTlLq/n/DKOijhm8q3FN
TXOjc5h7TOSEsEtiSEyjbog+96VsPsqBPkhSu/9Lmf2cVWBO3FSk1sFdicAhg6FS
ROkKALaUqQKBgEABK29QT5VXOp0LUOQFZAuuXU5qYC1DSZc+nM0s+fTnd67busIF
6MCwfucLzApbT6XY5BhNJ1V79Xpw9C4cQ/IETDRRCpJTwyi7YT/tsaFoRVr2v5tn
byPvkh+U79hUfkX3vCpvoS20R3OXtynUcIgBnL6HcclzoZJqkVHQB9OBAoGAVFio
TQoFXAQ2q+YHkasaxT552oAwRehqbGU/zWcmZ7jjuJVeDvlyzmZYRJxmvnRM/tqH
rsmW5zHb4vx5h8EpiwVINPl56PZuH2D6Bu2i3ebj4lZOF8cwdzZM8xJCtngb1Cnq
XJy0O7W4jx5pU4I2b/9JOGsIQUYYZUMN78JupOkCgYEAznO87gc26pZ1u3aBP/c1
D+Vgc3TurG7bAGa8pP6GG0OZOUgk7lL7hPrqNqmgEkXmFVsDiJsl+kegm07zomvZ
FUwaPANlguC1b7GanzBt2Cp+0mcEBwb6/GrdFv5v5UzUTAv7V/KJ8Uvn6BoxRGdd
R+QZ4sQVNnJOhz00jR6Awgo=
-----END PRIVATE KEY-----`

function merchantRows() {
  const listUrl = listUrls.find((item) => /merchantInfoAdmin\/listpage/i.test(item)) || ''
  return listUrl ? ensure(listUrl).rows : []
}

export function resolveRemaining(url: string, raw: unknown) {
  if (/memberInfoAdmin\/getLevelNum/i.test(url)) {
    return {
      code: '1',
      msg: '操作成功',
      data: LEVEL_HEADCOUNT.map((num, level) => ({ level, num })),
      total: LEVEL_HEADCOUNT.length,
      success: true,
    }
  }
  if (/merchantInfoAdmin\/generateKeyPair/i.test(url)) {
    return {
      code: '1',
      msg: '操作成功',
      data: { publicKey: MERCHANT_PUBLIC_KEY, privateKey: MERCHANT_PRIVATE_KEY },
      success: true,
    }
  }
  if (/merchantInfoAdmin\/applyRecharge|merchantInfoAdmin\/applyWithdraw/i.test(url)) {
    const body = readQuery(raw)
    const row = merchantRows().find((item) => String(item.code) === String(body.merchantCode) || String(item.merchantCode) === String(body.merchantCode) || (body.id != null && String(item.id) === String(body.id)))
    const amount = Number(body.amount) || 0
    if (row) {
      const next = Number(row.balance) || 0
      row.balance = /applyWithdraw/i.test(url) ? next - amount : next + amount
    }
    return { code: '1', msg: '操作成功', data: true, success: true }
  }
  if (/merchantInfoAdmin\/getDefaultAllowedIps/i.test(url)) {
    return { code: '1', msg: '操作成功', data: '10.0.0.8,10.0.0.9', success: true }
  }
  if (/merchantInfoAdmin\/getInfo/i.test(url)) {
    const listUrl = listUrls.find((item) => /merchantInfoAdmin\/listpage/i.test(item)) || ''
    const rows = listUrl ? ensure(listUrl).rows : []
    const body = readQuery(raw)
    const row = rows.find((item) => String(item.id) === String(body.id)) || rows[0] || {}
    return {
      code: '1',
      msg: '操作成功',
      data: {
        ...row,
        country: 'India',
        currency: 'ARB',
        usdtAddress: 'TPrototypeMerchantUsdt0001',
        platformPublicKey: 'prototype-platform-public-key',
        merchantPublicKey: 'prototype-merchant-public-key',
        googlesecret: 'PROTOTYPEGOOGLESECRET',
        account: 'prototype',
        logins: 18,
        totalPayAmount: 256000,
        totalWithdrawAmount: 184000,
        transferDownCount: 6,
        transferDownAmount: 4200,
        rechargeRewardRatio: row.rechargeReward ?? 0.5,
        icon: '',
      },
      success: true,
    }
  }
  const special = resolveOrderSpecial(url, raw)
  if (special) return special
  if (/\/menu\/listTree/i.test(url)) {
    return { code: '1', msg: '操作成功', data: buildAdminMenuTree(), success: true }
  }
  if (/\/menu\/role\/\d+/.test(url)) {
    const roleId = Number(url.split('/').pop()) || 1
    const leaves = buildAdminMenuTree().flatMap((item) => item.children)
    const picked = roleId === 1
      ? leaves
      : roleId === 3
        ? leaves.filter((item) => /\/wind|\/admin\/black|\/admin\/log/.test(String(item.path)))
        : roleId === 6
          ? leaves.filter((item) => /\/order|\/member/.test(String(item.path)))
          : leaves.filter((_, index) => index % 3 !== roleId % 3)
    return { code: '1', msg: '操作成功', data: picked, success: true }
  }
  if (/\/permission\/list\//i.test(url)) {
    const menuId = Number(url.split('/').filter(Boolean).pop()) || 0
    return {
      code: '1',
      msg: '操作成功',
      data: [
        { id: menuId * 10 + 1, menuId, name: '查询', btnSign: 'admin:query', method: 'POST', serviceName: 'ar-manager', url: '/ar-manager/menu/list' },
        { id: menuId * 10 + 2, menuId, name: '新增', btnSign: 'admin:add', method: 'POST', serviceName: 'ar-manager', url: '/ar-manager/menu' },
        { id: menuId * 10 + 3, menuId, name: '编辑', btnSign: 'admin:edit', method: 'PUT', serviceName: 'ar-manager', url: '/ar-manager/menu' },
        { id: menuId * 10 + 4, menuId, name: '删除', btnSign: 'admin:delete', method: 'DELETE', serviceName: 'ar-manager', url: `/ar-manager/menu/${menuId}` },
      ],
      success: true,
    }
  }
  if (/collectionInfoAdmin\/kycUnbanLog/i.test(url)) {
    const unbanUrl = '/ar-manager/collectionInfoAdmin/kycUnbanLog'
    if (!stores.has(unbanUrl)) stores.set(unbanUrl, { rows: buildUnbanRows(), timeKey: 'createTime' })
    return listBody(unbanUrl, raw)
  }
  const listUrl = longest(url, listUrls)
  if (listUrl) return listBody(listUrl, raw)
  const writeUrl = longest(url, writeUrls)
  if (writeUrl) return writeBody(writeUrl, raw)
  if (/statistic|overview|graphreport|summary/i.test(url)) {
    return {
      code: '1',
      msg: '操作成功',
      data: { completionNum: 12, recipientsNum: 8, rewardAmount: 5600, totalCount: 10, totalAmount: 5600 },
      success: true,
    }
  }
  return null
}
