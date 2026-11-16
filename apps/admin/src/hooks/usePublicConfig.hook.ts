import { getConfigApi } from "@/api/c2cconfig.api";
import { ref } from "vue";

export function publicConfig() {
  const configState = ref<any>({
    disabledTime: 0, // 禁用买入时间
    id: 0, // 主键
    maxSplitOrderCount: 0, // 钱包用户确认超时
    externalMerchantUpiExpirationTime: 0, //ARUPI外部商户收银台过期时间
    memberConfirmExpirationTime: 0, // 钱包用户确认超时时间
    memberMaxPurchaseAmount: 0, // 钱包用户最大买入金额
    memberMaxSellAmount: 0, // 钱包用户最大卖出金额
    memberMaxSellOrderNum: 0, // 钱包用户卖出最多订单数
    memberSalesBonus: 0, // 钱包用户卖出奖励比例
    memberSellMatchingDuration: 0, // 钱包用户卖出匹配时长
    merchantConfirmExpirationTime: 0, // 商户会员确认超时时间
    merchantMaxPurchaseAmount: 0, // 商户会员最大买入金额
    merchantMaxSellAmount: 0, // 商户会员最大卖出金额
    merchantMaxSellOrderNum: 0, // 商户会员卖出最多订单数
    merchantSalesBonus: 0, // 商户会员卖出奖励比例
    merchantSellMatchingDuration: 0, // 商户会员卖出匹配时长
    numberFailures: 0, // 失败次数
    rechargeExpirationTime: 0, // 支付过期时间
    usdtCurrency: 0, // USDT汇率
    isSplitOrder: 0, // 是否开启��单功能
    voicePaymentReminderEnabled: 0, //是否开启到账语音提心功能
    confirmExpirationTime: 0, //自动确认到账时间
    messageBalanceThreshold: 0, //短信余额报警阈值
    isManualReview: 0, //是否人工审核
    manualReviewTime:0,//审核时间
    // manualReviewArbFreezeTime:0,//审核不通过ARB冻结时间
    tradeCreditScoreLimit:0,//交易信用分限制
    merchantOrderUncreatedTime:0,//merchantOrderUncreatedTime
    minBankCodeNumber:0,//merchantOrderUncreatedTime
    maxBankCodeNumber:0,//merchantOrderUncreatedTime
    cancelMatchTimesLimit:0,//匹配限制次数
    matchQuadTradeStatusList:[],//买入卖出
    matchQuadChannelLevelList:[],//四方通道买入等级匹配等级
    matchQuadChannelSellLevelList:[],//四方通道卖出匹配等级
    kycRelinkMinLimit:0,//kycToken重新检测倒计时
    kycAutoMinAmount:0,//kyc自动上分最小金额
    referrerCommissionRatioWhileBuy:0,//下级买入返佣
    referrerAgainCommissionRatioWhileBuy:0,//下下级买入返佣
    referrerCommissionRatioWhileSell:0,//下级卖出返佣
    referrerAgainCommissionRatioWhileSell:0,//下下级卖出返佣
    usdtSellRate:0,//usdt卖出汇率
    minUsdtPurchaseAmount:0,//usdt最小购买金额
    kycBuyAutoAppealDuration:0,//买入自动申诉超时时间
    kycSellAutoAppealDuration:0,//卖出自动申诉超时时间
    usdtRechargeExpirationTime:0,//usdt支付过期时间
    smsBalance:0,//短信余额
    kycBuyAutoAppealTimesLimit: 0,//买入自动申诉次数限制
    kycBuyAutoAppealUnlinkLimit: 0,//kyc买入订单自动申诉断连时间
    usdtBuyReward: 0,//USDT买入奖励比例
    buyAppealPullTimeLimit: 0,//买入自动申诉拉取流水限制次数
    kycSellAppealWaterPullTimesLimit: 0,//kyc卖出申诉流水拉取限制次数
    kycBuyAppealWaterPullTimesLimit: 0,//kyc买入申诉流水拉取限制次数
    thirdFastRechargeDelayTime: 0,//订单超时延长时间
    tradeRiskMaxAmount: 0,//买卖账号单点交易限制金额
    kycExpRiskControlTimeCycle: 0,//kyc异常风控时间周期
    cancelTimesInCycle: 0,//周期内取消次数
    hideUpiCopyButton: 0,//隐藏upi复制按钮
    // shortcutMatchMinutes: 0,//优先匹配快捷通道时间
    autoFinishTimeoutCount: 0,//确认超时自动完单
    buyAmountRankBeforeDays: 0,//买入热度金额统计
    splitDivisorListLimit: 0,//买入热度金额取值位数
    maxSplitCount: 0,//母卖单最大可拆单数
    compensatingDivisor: 0,//预拆单补偿因子
    riskConfig: {
      a1: {
        count: 0,
        amount: 0
      },// 风控条件1级
      a2: {
        count: 0,
        amount: 0
      },// 风控条件2级
      a3: {
        count: 0,
        amount: 0
      },// 风控条件3级
      a4: {
        count: 0,
        amount: 0
      },// 风控条件4级
      a5: {
        count: 0,
        amount: 0
      },// 风控条件5级
      a6: {
        count: 0,
        amount: 0
      },// 风控条件6级
      a7: {
        count: 0,
        amount: 0
      },// 风控条件7级
      a8: {
        count: 0,
        amount: 0
      },// 风控条件8级
    },
    buyLimitAmount: 0,//买入限额
    buyLimitMinuteTimers: 0,//限制时长
    disableAccount: false,//是否禁用账号
    benefitOrderMaxSplitTimes: 0,//智能拆单最大拆单数
    // conversionAntConditions: [
    //   {
    //     conditionId: "1",
    //     buyCount: 0,
    //     sellCount: 0,
    //     rechargeCount: 0,
    //     withdrawCount: 0
    //   },
    //   {
    //       conditionId: "2",
    //       buyCount: 0,
    //       rechargeCount: 0
    //   },
    //   {
    //       conditionId: "3",
    //       sellCount: 0,
    //       withdrawCount: 0
    //   }
    // ],
    antGroupReceiptsDailyLimit: [], // 蚂蚁分组每日UPI限额
    quickWithdrawKycConnectionTimeout: 0, // 买入待连接KYC时效->放款单KYC断连完单
    quickWithdrawPreBuyLockedTime: 0, // 多点KYC锁单时效
    quickWithdrawMaximumBuyPullTransactions: 0, // 放款单KYC拉取次数
    quickWithdrawTimeout: 0, // 挂单失败时效
    // quickWithdrawTimeout: 0, // 快捷提现订单超时时间
    quickWithdrawFailLockOrderTime: 0, // 延时返回撮合
    kycUnlinkConfirmTimeoutAutoCloseDuration: 0, // 确认超时自动失败时长
    matchingMaximumCount: 0, // 自动重新匹配次数
    antSelectedTabCode: undefined, // 蚂蚁用户首先展示的买入列表界面
    nonAntSelectedTabCode: undefined, // 非蚂蚁用户首先展示的买入列表界面
    externalMerchantExpirationTime: 0, // ARPAY-外部商户收银台过期时间
    quickWithdrawTelegramNotification: 0, // 快捷提现订单推送TG通知时间
    channelOrderConfirmTimeoutAutoFailTime: 0, // 通道确认超时自动失败时长
    telegramAppealWarningCount: 0, // 申诉订单(买入+卖出)预警
    telegramMerchantCollectWarningCount: 0, // 代收订单未回调预警
    telegramMatchWarningCount: 0, // 卖单匹配中预警
    telegramNoCreateOrderWarningTimer: 0, // 未创建订单预警时间
    telegramMerchantPaymentWarningCount: 0, // 代付订单未回调预警
    telegramKycWaterWarningForAirtelTimer: 0, // Airtel未拉取到流水预警
    telegramKycWaterWarningForFreeChargeTimer: 0, // FreeCharge未拉取到流水预警
    telegramKycWaterWarningForPaytmTimer: 0, // Paytm未拉取到流水预警
    telegramKycWaterWarningForPhonePeTimer: 0, // Phonepe未拉取到流水预警
    telegramKycWaterWarningForMobikwikTimer: 0, // Mobikwik未拉取到流水预警
    telegramKeyWaterWarningForSuperMoneyTimer: 0, // SuperMoney未拉取到流水预警
    telegramKeyWaterWarningForSliceTimer: 0, // twid未拉取到流水预警
    telegramKycWaterWarningForTwidTimer: 0, // navi未拉取到流水预警
    telegramKycWaterWarningForNaviTimer: 0, // FreeCharge未拉取到流水预警
    telegramKycWaterWarningForMoneyViewTimer: 0, // moneyView未拉取到流水预警
    collectionAccountRiskControlRuleList: [ // 收款账号风控规则列表
      {
        ruleNo: "",
        timeCycle: 0,
        triggerTimes: 0,
        status: 0,
      },
    ],
    collectionAccountRiskControlPunishRuleList: [ // 收款账号风控惩罚规则列表
      {
        punishLevel: 1,
        ruleNo: "",
        upiBanDuration: -1,
        status: 0,
      }
    ],
    quickWithdrawConsecutiveUnsuccessfulOrderLimit: 0, // 连续失败自动退回,
    kycDisconnectThresholdSeconds: 0,//KYC异常断连触发时间
    telegramKeyWaterWarningForFreoTimer: 0, // Freo未拉取到流水预警
    utrErrorAutoCompleteSwitch: 0, // 疑似UTR填错自动完单
    utrErrorAutoCompleteMinLimitAmount: 0, // 疑似UTR填错自动完单最小金额限制
    utrErrorAutoCompleteMaxLimitAmount: 0, // 疑似UTR填错自动完单最大金额限制
    waterValidityDuration: 0, // 流水有效时长
    priorityMatchTime: 0, // 自动配置优先撮合时间
    paymentVoucherRewardAmount: 0,//人工卖出订单上传支付凭证奖励金额
    autoSellFailureCooldownMinutes: 0,//自动卖出失败冷却时长
    exchangeOrderMatchIntervalTime: 1, //交易所订单匹配间隔时间(秒)
    exchangeOrderMatchTimes: 1, //交易所订单匹配次数
    autoTransferCooldownTime: 1, //自动转账冷却时长
    autoTransferAmountMin: 1, //自动转账最小金额
    autoTransferAmountMax: 1, //自动转账最大金额
    fakeAppAutoTradeAccountMinBalance: 0, //最低自动买入金额
    fakeAppBalanceWhileQueryFailed: 0, //自动交易默认余额
    exchangeOrderToQuickWithdrawOrderTime: 1, //自动买入订单时限
    payerResponsibilityAfterUndeterminedSubOrderCount: 1, //自动交易连续失败收款
    exchangeUpiOrderAutoTradeRatio: 0, //交易所UPI订单自动交易占比
    exchangeBankOrderAutoTradeRatio: 0, //交易所BANK订单自动交易占比
    timeRangeAmountLimit: 0, //多子单金额完单每日金额限制
    timeRangeAmountMinLimit: 0, //多子单金额完单最小金额
    timeRangeAmountMaxLimit: 0, //多子单金额完单最大金额
    timeRangeMinutes: 0, //多子单金额完单划分时间线(分钟)
    regularAmountFinishValidSeconds: 120, //常规金额完单处理时效(秒)
    regularAmountFinishSplitIntervalSeconds: 90, //常规金额完单-同金额拆单时差(秒)
    smartGrabOrderConfig: { //智能抢单配置
      availableMemberTypes: [], //可用会员类型
      memberLevels: [], //会员等级
      availableBuyListTypes: [], //可用买入列表类型
      cancelLimit24Hours: 0, //24小时内最多取消次数
      cancelCooldownSeconds: 0, //取消冷却时长
      otpUpiAmountRanges: [], //OTP-UPI 可选金额段
      bankAmountRanges: [], //银行卡可选金额段
      lowOrderRate: 0, //金额区间单量提示(%)
      otpUpiSmartPageLayout: 1, //OTP-UPI页面智能抢单布局 1-智能抢单+自选 2-智能抢单
      bankSmartPageLayout: 1, //BANK页面智能抢单布局 1-智能抢单+自选 2-智能抢单
    },
    multiPendingOrderAmountMin: 0, // 多笔未完结订单金额限制最小值
    multiPendingOrderAmountMax: 0, // 多笔未完结订单金额限制最大值
    multiPendingOrderCountLimit: 0, // 多笔未完结订单数量限制
    multiPendingOrderSceneFlag: [], // 多笔未完结订单场景标识(多选, 数组) 4-外部商户AR_UPI通道, 5-AR_SaaS通道
    buyFixedRewardTiers: [], // 买入单笔固定奖励档位 [{ minAmount, maxAmount, rewardAmount }]
    sellFixedRewardTiers: [], // 卖出单笔固定奖励档位
    systemAutoSellEnabled: 0, // 破解APP自动开启卖出时间开关 0-关闭 1-开启
    systemAutoSellStartTime: undefined, // 破解APP自动卖出开始时间 HH:mm:ss
    systemAutoSellEndTime: undefined, // 破解APP自动卖出结束时间 HH:mm:ss
  });
  // 配置详情是否正在请求、最近一次请求是否失败，供需要展示加载状态的页面使用
  const configLoading = ref(false);
  const configLoadFailed = ref(false);
  let latestSeq = 0; // 最近发起的请求序号
  let appliedSeq = 0; // 已写入 configState 的请求序号
  let pendingCount = 0; // 进行中的请求数，全部结束才算加载完成
  // 返回是否加载成功；网络异常仍向外抛出，与原有调用方的行为保持一致
  const getConfig = async () => {
    const seq = ++latestSeq;
    pendingCount++;
    configLoading.value = true;
    configLoadFailed.value = false;
    try {
      const res = await getConfigApi();
      if (res.code === "1") {
        // 先发起的请求晚返回时，不覆盖已写入的较新数据
        if (seq > appliedSeq) {
          appliedSeq = seq;
          configState.value = res.data;
        }
        return true;
      }
      // 失败状态只反映最近发起的请求
      if (seq === latestSeq) configLoadFailed.value = true;
      return false;
    } catch (e) {
      if (seq === latestSeq) configLoadFailed.value = true;
      throw e;
    } finally {
      pendingCount--;
      configLoading.value = pendingCount > 0;
    }
  };
  return {
    configState,
    configLoading,
    configLoadFailed,
    getConfig,
  };
}
