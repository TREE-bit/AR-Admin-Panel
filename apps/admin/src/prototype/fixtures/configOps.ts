// 运营管理：参数配置、内容配置、运营参数配置。
// 参数详情必须是完整对象。空列表会把页面上的配置冲掉，蚂蚁 / 其他 / 风控页签渲染中断，栏目就切不过去。

export const prototypeImage =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="140" viewBox="0 0 320 140"><rect width="320" height="140" rx="8" fill="#1677ff"/><text x="160" y="78" text-anchor="middle" fill="#ffffff" font-size="22" font-family="Arial,sans-serif">IMAGE</text></svg>',
  )

type Row = Record<string, any>

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

function indiaNow(hour: number, minute = 30) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${fmt.format(new Date())} ${pad(hour)}:${pad(minute)}:00`
}

function ok(data: any, total?: number) {
  const count = total ?? (Array.isArray(data) ? data.length : 0)
  return { code: '1', msg: '操作成功', data, total: count, success: true }
}

function pageOf(rows: Row[], raw: unknown) {
  const query = readQuery(raw)
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || rows.length || 10
  const page = rows.slice((pageNo - 1) * pageSize, pageNo * pageSize)
  const data = Object.assign(page.slice(), {
    list: page,
    records: page,
    total: rows.length,
  })
  return ok(data, rows.length)
}

function htmlOf(title: string) {
  return `<p><strong>${title}</strong></p><p>这是「${title}」的正文，编辑时按标题回显。</p>`
}

function nextId(rows: Row[]) {
  return rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1
}

function takeId(url: string, body: Row) {
  const seg = url.split('?')[0].split('/').filter(Boolean).pop() || ''
  if (/^\d+$/.test(seg)) return seg
  return body.id
}

function findRow(rows: Row[], id: unknown) {
  return rows.find((row) => id != null && String(row.id) === String(id))
}

function seedConfig(): Row {
  return {
    id: 1,
    rechargeExpirationTime: 15,
    externalMerchantUpiExpirationTime: 20,
    externalMerchantExpirationTime: 25,
    usdtCurrency: 92,
    usdtBuyReward: 1.5,
    hideUpiCopyButton: 1,
    paymentVoucherRewardAmount: 8,
    autoTransferAmountMin: 100,
    autoTransferAmountMax: 5000,
    fakeAppAutoTradeAccountMinBalance: 200,
    fakeAppBalanceWhileQueryFailed: 1000,
    payerResponsibilityAfterUndeterminedSubOrderCount: 3,
    usdtRechargeExpirationTime: 30,
    usdtSellRate: 91.5,
    utrErrorAutoCompleteSwitch: 1,
    utrErrorAutoCompleteMinLimitAmount: 100,
    utrErrorAutoCompleteMaxLimitAmount: 5000,
    exchangeOrderMatchIntervalTime: 5,
    exchangeOrderMatchTimes: 3,
    autoTransferCooldownTime: 60,
    exchangeOrderToQuickWithdrawOrderTime: 10,
    exchangeUpiOrderAutoTradeRatio: 60,
    exchangeBankOrderAutoTradeRatio: 40,
    requirePaymentProof: 0,
    shortcutMatchMinutes: 5,
    multiPendingOrderAmountMin: 100,
    multiPendingOrderAmountMax: 20000,
    multiPendingOrderCountLimit: 3,
    multiPendingOrderSceneFlag: [4, 5],
    buyFixedRewardTiers: [
      { minAmount: 100, maxAmount: 500, rewardAmount: 5 },
      { minAmount: 501, maxAmount: 2000, rewardAmount: 12 },
    ],
    matchOverTimeAutoCancelDuration: 20,
    releaseOrderTime: 10,
    maxDailyUpiTransactions: 50,
    kycAutoMinAmount: 100,
    kycRelinkMinLimit: 30,
    kycUnlinkConfirmTimeoutAutoCloseDuration: 15,
    manualReviewTime: 10,
    manualReviewArbFreezeTime: 60,
    cancelMatchTimesLimit: 3,
    buyAmountRankBeforeDays: 7,
    splitDivisorListLimit: 2,
    maxSplitCount: 6,
    compensatingDivisor: 1,
    autoFinishTimeoutCount: 2,
    matchingMaximumCount: 3,
    kycExpRiskControlTimeCycle: 60,
    channelOrderConfirmTimeoutAutoFailTime: 15,
    cancelTimesInCycle: 3,
    autoSellFailureCooldownMinutes: 30,
    isSplitOrder: 1,
    isManualReview: 0,
    sellFixedRewardTiers: [
      { minAmount: 100, maxAmount: 800, rewardAmount: 6 },
      { minAmount: 801, maxAmount: 3000, rewardAmount: 15 },
    ],
    systemAutoSellEnabled: 1,
    systemAutoSellStartTime: '09:00:00',
    systemAutoSellEndTime: '21:00:00',
    referrerCommissionRatioWhileBuy: 0.6,
    referrerAgainCommissionRatioWhileBuy: 0.2,
    benefitOrderMaxSplitTimes: 20,
    quickWithdrawTimeout: 15,
    quickWithdrawKycConnectionTimeout: 8,
    quickWithdrawPreBuyLockedTime: 45,
    referrerCommissionRatioWhileSell: 0.5,
    referrerAgainCommissionRatioWhileSell: 0.15,
    quickWithdrawMaximumBuyPullTransactions: 4,
    quickWithdrawFailLockOrderTime: 12,
    antSelectedTabCode: 1,
    nonAntSelectedTabCode: 2,
    antGroupReceiptsDailyLimit: [
      { antLevelGroupType: 0, limitCount: 0 },
      { antLevelGroupType: 1, limitCount: 20 },
      { antLevelGroupType: 2, limitCount: 40 },
      { antLevelGroupType: 3, limitCount: 80 },
      { antLevelGroupType: 4, limitCount: 120 },
    ],
    voicePaymentReminderEnabled: 1,
    smsBalance: 8600,
    messageBalanceThreshold: 500,
    tradeCreditScoreLimit: 60,
    merchantOrderUncreatedTime: 10,
    waterValidityDuration: 30,
    priorityMatchTime: 5,
    minBankCodeNumber: 1,
    maxBankCodeNumber: 5,
    matchQuadTradeStatusList: [1, 2],
    matchQuadChannelLevelList: [1, 2, 3],
    matchQuadChannelSellLevelList: [1, 2],
    kycBuyAutoAppealDuration: 10,
    kycSellAutoAppealDuration: 10,
    kycBuyAutoAppealTimesLimit: 3,
    kycBuyAutoAppealUnlinkLimit: 5,
    buyAppealPullTimeLimit: 3,
    kycBuyAppealWaterPullTimesLimit: 4,
    kycSellAppealWaterPullTimesLimit: 4,
    thirdFastRechargeDelayTime: 20,
    tradeRiskMaxAmount: 50000,
    quickWithdrawConsecutiveUnsuccessfulOrderLimit: 3,
    kycDisconnectThresholdSeconds: 90,
    timeRangeAmountMinLimit: 100,
    timeRangeAmountMaxLimit: 5000,
    timeRangeAmountLimit: 20000,
    regularAmountFinishSplitIntervalSeconds: 90,
    regularAmountFinishValidSeconds: 120,
    smartGrabOrderConfig: {
      availableMemberTypes: ['3', '4'],
      memberLevels: [1, 2, 3],
      availableBuyListTypes: ['OTP-UPI', 'BANK'],
      cancelLimit24Hours: 3,
      cancelCooldownSeconds: 180,
      otpUpiAmountRanges: [
        { minAmount: 100, maxAmount: 500 },
        { minAmount: 501, maxAmount: 2000 },
      ],
      bankAmountRanges: [{ minAmount: 200, maxAmount: 3000 }],
      lowOrderRate: 20,
      otpUpiSmartPageLayout: 1,
      bankSmartPageLayout: 2,
    },
    telegramAppealWarningCount: 5,
    quickWithdrawTelegramNotification: 10,
    telegramMerchantCollectWarningCount: 8,
    telegramMerchantPaymentWarningCount: 8,
    telegramMatchWarningCount: 6,
    telegramNoCreateOrderWarningTimer: 15,
    telegramKycWaterWarningForAirtelTimer: 20,
    telegramKycWaterWarningForFreeChargeTimer: 20,
    telegramKycWaterWarningForPaytmTimer: 20,
    telegramKycWaterWarningForPhonePeTimer: 20,
    telegramKycWaterWarningForMobikwikTimer: 20,
    telegramKeyWaterWarningForSuperMoneyTimer: 20,
    telegramKeyWaterWarningForSliceTimer: 20,
    telegramKeyWaterWarningForFreoTimer: 20,
    telegramKycWaterWarningForTwidTimer: 20,
    telegramKycWaterWarningForNaviTimer: 20,
    telegramKycWaterWarningForMoneyViewTimer: 20,
    riskConfig: {
      a1: { count: 3, amount: 1000 },
      a2: { count: 5, amount: 2000 },
      a3: { count: 4, amount: 3000 },
      a4: { count: 6, amount: 4000 },
      a5: { count: 2, amount: 1500 },
      a6: { count: 7, amount: 6000 },
      a7: { count: 3, amount: 2500 },
      a8: { count: 4, amount: 0 },
      buyLimitAmount: 5000,
      buyLimitMinuteTimers: 30,
      disableAccount: false,
    },
    collectionAccountRiskControlRuleList: [
      { ruleNo: 'SELL01', timeCycle: 30, triggerTimes: 3, status: 1 },
      { ruleNo: 'SELL02', timeCycle: 60, triggerTimes: 2, status: 1 },
    ],
    collectionAccountRiskControlPunishRuleList: [
      { punishLevel: 1, ruleNo: 'HANDLE_MATCH_POOL_ORDER', upiBanDuration: -1, status: 1 },
      { punishLevel: 2, ruleNo: 'BAN_UPI', upiBanDuration: 30, status: 1 },
      { punishLevel: 3, ruleNo: 'BAN_UPI', upiBanDuration: -1, status: 0 },
    ],
  }
}

let tradeConfig = seedConfig()

let buyLimits: Row[] = [
  { buyFailTimes: 3, limitTime: 30, type: 1 },
  { buyFailTimes: 5, limitTime: 120, type: 1 },
]

let antRanges: Row[] = [
  { id: 1, rangeSort: 1, rangeName: '小额', limitLower: 100, limitUpper: 500, times: 2 },
  { id: 2, rangeSort: 2, rangeName: '中额', limitLower: 501, limitUpper: 2000, times: 3 },
  { id: 3, rangeSort: 3, rangeName: '大额', limitLower: 2001, limitUpper: 10000, times: 1 },
]

const operationLogs: Row[] = [1, 2, 3, 4, 5, 1, 2, 3].map((area, index) => ({
  serialNo: index + 1,
  operationTime: indiaNow(9 + index, (index * 7) % 60),
  operationArea: area,
  operationContent: `把${['买入', '卖出', '蚂蚁', '其他', '风控'][area - 1]}参数从旧值改成当前示例值`,
  operator: index % 2 === 0 ? 'prototype' : 'admin1',
  operatorIp: `103.21.8.${10 + index}`,
}))

let buyCancel: Row[] = [
  { id: 1, reason: '不想买了', sort: 1, belongCollectionAccountExp: 0, showFlag: 0, createTime: indiaNow(9), updateTime: indiaNow(10) },
  { id: 2, reason: '金额填错', sort: 2, belongCollectionAccountExp: 1, showFlag: 1, createTime: indiaNow(9, 10), updateTime: indiaNow(10, 10) },
  { id: 3, reason: '收款账户异常', sort: 3, belongCollectionAccountExp: 0, showFlag: 0, createTime: indiaNow(9, 20), updateTime: indiaNow(10, 20) },
]

let sellCancel: Row[] = [
  { id: 1, reason: '暂时不卖', sort: 1, createTime: indiaNow(9), updateTime: indiaNow(11) },
  { id: 2, reason: 'UPI 暂时不可用', sort: 2, createTime: indiaNow(9, 15), updateTime: indiaNow(11, 15) },
  { id: 3, reason: '金额需要修改', sort: 3, createTime: indiaNow(9, 25), updateTime: indiaNow(11, 25) },
]

let announcements: Row[] = [
  { id: 1, announcementTitle: '节日活动公告', announcementContent: htmlOf('节日活动公告'), sortOrder: 1, status: 1, platformType: 1, createBy: 'prototype', updateBy: 'prototype', createTime: indiaNow(9), updateTime: indiaNow(12) },
  { id: 2, announcementTitle: '系统维护通知', announcementContent: htmlOf('系统维护通知'), sortOrder: 2, status: 0, platformType: 2, createBy: 'admin1', updateBy: 'admin1', createTime: indiaNow(9, 10), updateTime: indiaNow(12, 10) },
  { id: 3, announcementTitle: '买入奖励说明', announcementContent: htmlOf('买入奖励说明'), sortOrder: 3, status: 1, platformType: 3, createBy: 'prototype', updateBy: 'prototype', createTime: indiaNow(9, 20), updateTime: indiaNow(12, 20) },
]

let banners: Row[] = [
  { id: 1, bannerType: '01', bannerImageUrl: prototypeImage, redirectUrl: '/activity/festival', linkType: 1, platformType: 1, sortOrder: 1, status: 1, updateTime: indiaNow(10), updateBy: 'prototype' },
  { id: 2, bannerType: '02', bannerImageUrl: prototypeImage, redirectUrl: 'https://example.com/promo', linkType: 2, platformType: 2, sortOrder: 2, status: 0, updateTime: indiaNow(10, 20), updateBy: 'admin1' },
  { id: 3, bannerType: '01', bannerImageUrl: prototypeImage, redirectUrl: '/wallet/buy', linkType: 1, platformType: 3, sortOrder: 3, status: 0, updateTime: indiaNow(10, 40), updateBy: 'prototype' },
  { id: 4, bannerType: '02', bannerImageUrl: prototypeImage, redirectUrl: '/notice/maintain', linkType: 2, platformType: 1, sortOrder: 4, status: 1, updateTime: indiaNow(11), updateBy: 'admin1' },
]

let activities: Row[] = [
  { id: 1, title: '周末买入加奖', eventBanner: prototypeImage, content: htmlOf('周末买入加奖'), sort: 1, state: 1, type: 1, platformType: 1, activityUrl: 'https://prototype.local/activity/1', createTime: indiaNow(9), updateTime: indiaNow(13) },
  { id: 2, title: '新用户实名礼', eventBanner: prototypeImage, content: htmlOf('新用户实名礼'), sort: 2, state: 0, type: 1, platformType: 2, activityUrl: 'https://prototype.local/activity/2', createTime: indiaNow(9, 20), updateTime: indiaNow(13, 20) },
  { id: 3, title: '卖出返现周', eventBanner: prototypeImage, content: htmlOf('卖出返现周'), sort: 3, state: 0, type: 1, platformType: 3, activityUrl: 'https://prototype.local/activity/3', createTime: indiaNow(9, 40), updateTime: indiaNow(13, 40) },
]

let homePopups: Row[] = [
  { id: 1, sort: 1, status: 1, frequency: 1, windowStyle: 1, platformType: 1, titleEn: 'Festival activity', contentEn: htmlOf('Festival activity'), titleHi: 'त्योहार गतिविधि', contentHi: htmlOf('त्योहार गतिविधि'), createBy: 'prototype', updateBy: 'prototype', createTime: indiaNow(8), updateTime: indiaNow(14) },
  { id: 2, sort: 2, status: 2, frequency: 2, windowStyle: 2, platformType: 2, titleEn: 'Account reminder', contentEn: htmlOf('Account reminder'), titleHi: 'खाता अनुस्मारक', contentHi: htmlOf('खाता अनुस्मारक'), createBy: 'admin1', updateBy: 'admin1', createTime: indiaNow(8, 20), updateTime: indiaNow(14, 20) },
  { id: 3, sort: 3, status: 1, frequency: 3, windowStyle: 1, platformType: 3, titleEn: 'Return home offer', contentEn: htmlOf('Return home offer'), titleHi: 'होम ऑफर', contentHi: htmlOf('होम ऑफर'), createBy: 'prototype', updateBy: 'prototype', createTime: indiaNow(8, 40), updateTime: indiaNow(14, 40) },
]

let cashierAds: Row[] = [1, 2, 3, 4, 5, 6].map((code, index) => ({
  id: index + 1,
  imageUrl: prototypeImage,
  platformCode: [code],
  sortOrder: (index % 6) + 1,
  status: index % 2,
  operator: index % 2 === 0 ? 'prototype' : 'admin1',
  updateTime: indiaNow(11, index * 5),
}))

let taskRules: Row = {
  id: 1,
  taskRulesContent: htmlOf('H5 任务规则'),
  taskRulesContentApp: htmlOf('APP 任务规则'),
}

let schemes: Row[] = [
  {
    id: 1,
    schemeTag: 1,
    schemeName: '激活钱包',
    updateTime: indiaNow(15),
    updateBy: 'prototype',
    schemeMaxPurchaseAmount: 20000,
    schemeMinPurchaseAmount: 100,
    schemeMaxSellAmount: 10000,
    schemeMinSellAmount: 100,
    schemeMaxSellOrderNum: 3,
    schemeSalesBonusAmountLimit: 100,
    schemeSalesBonusNumLimit: 2,
    schemeConfirmExpirationTime: 10,
    schemeSellMatchingDuration: 20,
  },
  {
    id: 2,
    schemeTag: 2,
    schemeName: '实名认证',
    updateTime: indiaNow(15, 20),
    updateBy: 'admin1',
    schemeMaxPurchaseAmount: 50000,
    schemeMinPurchaseAmount: 100,
    schemeMaxSellAmount: 30000,
    schemeMinSellAmount: 200,
    schemeMaxSellOrderNum: 8,
    schemeSalesBonusAmountLimit: 300,
    schemeSalesBonusNumLimit: 5,
    schemeConfirmExpirationTime: 20,
    schemeSellMatchingDuration: 40,
  },
]

let rewardCards: Row[] = [0, 1, 2, 3].map((validity, index) => ({
  id: index + 1,
  title: ['新手卖出卡', '周卡奖励', '半月奖励', '月卡奖励'][index],
  amount: 50 + index * 50,
  validityType: validity,
  cardType: 1,
  activateType: 1,
  status: index % 2,
  description: htmlOf(['新手卖出卡', '周卡奖励', '半月奖励', '月卡奖励'][index]),
  effectiveStartTime: indiaNow(0, 0).slice(0, 10) + ' 00:00:00',
  effectiveEndTime: indiaNow(0, 0).slice(0, 10) + ' 23:59:59',
  maxUsageCount: 10 + index,
  createTime: indiaNow(8, index * 5),
  createBy: 'prototype',
  updateTime: indiaNow(16, index * 5),
  updateBy: 'prototype',
}))

let warningConfig: Row = {
  id: 1,
  warningBalance: 50000,
  warningConfirmOvertimeNotOperated: 15,
}

function upsert(rows: Row[], body: Row, extra: Row = {}) {
  const id = body.id
  const row = findRow(rows, id)
  if (row) {
    Object.assign(row, body, extra)
    return row
  }
  const created = { ...body, ...extra, id: id ?? nextId(rows), updateTime: indiaNow(16), updateBy: 'prototype' }
  rows.unshift(created)
  return created
}

function removeRow(rows: Row[], id: unknown) {
  const index = rows.findIndex((row) => String(row.id) === String(id))
  if (index >= 0) rows.splice(index, 1)
}

function setStatus(rows: Row[], id: unknown, status: number) {
  const row = findRow(rows, id)
  if (row) row.status = status
}

export function resolveConfigOps(url: string, raw: unknown, method = 'post') {
  const body = readQuery(raw)
  const verb = method.toLowerCase()

  if (url.includes('/tradeConfigAdmin/detaill')) {
    return ok(JSON.parse(JSON.stringify(tradeConfig)))
  }
  if (url.includes('/tradeConfigAdmin/updateRiskConfig')) {
    const lists = body.collectionAccountRiskControlRuleList
    const punish = body.collectionAccountRiskControlPunishRuleList
    const { collectionAccountRiskControlRuleList, collectionAccountRiskControlPunishRuleList, ...risk } = body
    Object.assign(tradeConfig.riskConfig, risk)
    if (lists) tradeConfig.collectionAccountRiskControlRuleList = lists
    if (punish) tradeConfig.collectionAccountRiskControlPunishRuleList = punish
    return ok(true)
  }
  if (
    url.includes('/tradeConfigAdmin/updateBuy') ||
    url.includes('/tradeConfigAdmin/updateSell') ||
    url.includes('/tradeConfigAdmin/updateAntConfig') ||
    url.includes('/tradeConfigAdmin/updateVoiceEnable')
  ) {
    Object.assign(tradeConfig, body)
    return ok(true)
  }
  if (url.includes('/tradeConfigAdmin/warningConfigDetail')) return ok({ ...warningConfig })
  if (url.includes('/tradeConfigAdmin/updateWarningConfig')) {
    Object.assign(warningConfig, body)
    return ok(true)
  }
  if (url.includes('/tradeConfigAdmin/operationLog/listPage')) {
    const area = body.operationArea
    const operator = String(body.operator || '').trim()
    const rows = operationLogs.filter((row) => {
      if (area !== undefined && area !== null && area !== '' && Number(row.operationArea) !== Number(area)) return false
      if (operator && !String(row.operator).includes(operator)) return false
      if (body.startTime && String(row.operationTime) < String(body.startTime)) return false
      if (body.endTime && String(row.operationTime) > String(body.endTime)) return false
      return true
    })
    return pageOf(rows, raw)
  }
  if (url.includes('/buyLimitConfig/getBuyLimitList')) return ok({ cancelList: buyLimits.map((item) => ({ ...item })) })
  if (url.includes('/buyLimitConfig/batchUpdateBuyLimit')) {
    if (Array.isArray(body.cancelList)) buyLimits = body.cancelList.map((item: Row) => ({ ...item, type: 1 }))
    return ok(true)
  }
  if (url.includes('/amountRangeConfigAdmin/amountRangeConfigs')) return ok(antRanges.map((item) => ({ ...item })))
  if (url.includes('/amountRangeConfigAdmin/updateAmountRangeConfig')) {
    const row = findRow(antRanges, body.id)
    if (row) Object.assign(row, body)
    return ok(true)
  }

  if (url.includes('/cancellationRecharge/listpage')) return pageOf(buyCancel, raw)
  if (url.includes('/cancellationRecharge/create') || url.includes('/cancellationRecharge/update')) {
    upsert(buyCancel, body, { updateTime: indiaNow(16) })
    return ok(true)
  }
  if (url.includes('/cancellationRecharge/delete')) {
    removeRow(buyCancel, body.id)
    return ok(true)
  }
  if (url.includes('/withdrawalCancellation/listpage')) return pageOf(sellCancel, raw)
  if (url.includes('/withdrawalCancellation/create') || url.includes('/withdrawalCancellation/update')) {
    upsert(sellCancel, body, { updateTime: indiaNow(16) })
    return ok(true)
  }
  if (url.includes('/withdrawalCancellation/delete')) {
    removeRow(sellCancel, body.id)
    return ok(true)
  }

  if (url.includes('/banner/listBanners')) return pageOf(banners, raw)
  if (url.includes('/banner/createBanner') || url.includes('/banner/updateBanner/')) {
    upsert(banners, { ...body, id: takeId(url, body) }, { updateTime: indiaNow(16), updateBy: 'prototype' })
    return ok(true)
  }
  if (url.includes('/banner/disable/')) {
    setStatus(banners, takeId(url, body), 0)
    return ok(true)
  }
  if (url.includes('/banner/enable/')) {
    setStatus(banners, takeId(url, body), 1)
    return ok(true)
  }
  if (verb === 'delete' && /\/banner\/\d+/.test(url)) {
    removeRow(banners, takeId(url, body))
    return ok(true)
  }

  if (url.includes('/announcement/listAnnouncements')) return pageOf(announcements, raw)
  if (url.includes('/announcement/createAnnouncement') || url.includes('/announcement/updateAnnouncement/')) {
    upsert(announcements, { ...body, id: takeId(url, body) }, { updateTime: indiaNow(16), updateBy: 'prototype' })
    return ok(true)
  }
  if (url.includes('/announcement/disable/')) {
    setStatus(announcements, takeId(url, body), 0)
    return ok(true)
  }
  if (url.includes('/announcement/enable/')) {
    setStatus(announcements, takeId(url, body), 1)
    return ok(true)
  }
  if (url.includes('/announcement/fetchAnnouncementLinkById/')) {
    const row = findRow(announcements, takeId(url, body))
    return ok({ announcementLink: `https://prototype.local/notice/${row?.id || takeId(url, body)}` })
  }
  if (verb === 'delete' && /\/announcement\/\d+/.test(url)) {
    removeRow(announcements, takeId(url, body))
    return ok(true)
  }

  if (url.includes('/manager/activity/list')) return pageOf(activities, raw)
  if (url.includes('/manager/activity/save') || url.includes('/manager/activity/update')) {
    upsert(activities, body, { updateTime: indiaNow(16), activityUrl: body.activityUrl || `https://prototype.local/activity/${body.id || 'new'}` })
    return ok(true)
  }
  if (url.includes('/manager/activity/delete/')) {
    removeRow(activities, takeId(url, body))
    return ok(true)
  }

  if (url.includes('/cashierAdvertisement/listPage')) return pageOf(cashierAds, raw)
  if (url.includes('/cashierAdvertisement/create') || url.includes('/cashierAdvertisement/update/')) {
    upsert(cashierAds, { ...body, id: takeId(url, body) }, { updateTime: indiaNow(16), operator: 'prototype', imageUrl: body.imageUrl || prototypeImage })
    return ok(true)
  }
  if (verb === 'get' && /\/cashierAdvertisement\/\d+/.test(url)) {
    return ok({ ...(findRow(cashierAds, takeId(url, body)) || {}) })
  }
  if (verb === 'delete' && /\/cashierAdvertisement\/\d+/.test(url)) {
    removeRow(cashierAds, takeId(url, body))
    return ok(true)
  }

  if (url.includes('/taskRulesContentAdmin/detail')) return ok({ ...taskRules })
  if (url.includes('/taskRulesContentAdmin/updateContent')) {
    Object.assign(taskRules, body)
    return ok(true)
  }

  if (url.includes('/frontPageConfig/listPage')) return pageOf(homePopups, raw)
  if (url.includes('/frontPageConfig/saveInfo') || url.includes('/frontPageConfig/update')) {
    upsert(homePopups, body, { updateTime: indiaNow(16), updateBy: 'prototype' })
    return ok(true)
  }
  if (url.includes('/frontPageConfig/delete/')) {
    removeRow(homePopups, takeId(url, body))
    return ok(true)
  }

  if (url.includes('/tradeConfigSchemeAdmin/listPage')) return pageOf(schemes, raw)
  if (url.includes('/tradeConfigSchemeAdmin/updateScheme')) {
    const row = findRow(schemes, body.id)
    if (row) Object.assign(row, body, { updateTime: indiaNow(16), updateBy: 'prototype' })
    return ok(true)
  }

  if (url.includes('/rewardCardConfigAdmin/listPage')) {
    const title = String(body.title || '').trim()
    const rows = rewardCards.filter((row) => {
      if (body.cardType != null && body.cardType !== '' && Number(row.cardType) !== Number(body.cardType)) return false
      if (body.status != null && body.status !== '' && Number(row.status) !== Number(body.status)) return false
      if (title && !String(row.title).includes(title)) return false
      return true
    })
    return pageOf(rows, raw)
  }
  if (url.includes('/rewardCardConfigAdmin/save') || url.includes('/rewardCardConfigAdmin/update')) {
    upsert(rewardCards, body, { updateTime: indiaNow(16), updateBy: 'prototype' })
    return ok(true)
  }
  if (url.includes('/rewardCardConfigAdmin/updateStatus')) {
    setStatus(rewardCards, body.id, Number(body.status))
    return ok(true)
  }

  return null
}
