import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { isPrototype } from './env'
import {
  applyCreateGroup,
  applyDeleteGroup,
  applyMemberTradeStatus,
  applyUnbindMerchant,
  applyUpdateGroup,
  buildActiveMerchantBody,
  buildGroupAuthListBody,
  buildMemberGroupBody,
  buildMemberListBody,
} from './fixtures/memberList'
import {
  applyBonus,
  applyEditRemark,
  applyFreeze,
  applyRecharge,
  applyResetPassword,
  applyResetPayPwd,
  applyUnfreeze,
  applyWithdrawal,
  buildLastBuyBody,
  buildLastLoginBody,
  buildLastSellBody,
  buildLevelChangeBody,
  buildMemberInfoBody,
} from './fixtures/memberDetail'
import { buildMemberChangeListBody, buildMerchantListBody } from './fixtures/memberChangeRecord'
import {
  applyAddKycPartner,
  applyCollectionUpdateStatus,
  applyCreateUsdt,
  applyDeleteCollection,
  applyDeleteUsdt,
  applyUpdateCollection,
  applyUpdateKycPartner,
  applyUpdateUsdt,
  buildBankCodeMapBody,
  buildCollectionInfoBody,
  buildCollectionListBody,
  buildKycBankCodeListBody,
  buildUsdtByMemberBody,
  buildUsdtReceiveListBody,
} from './fixtures/memberPayInfo'
import {
  buildKycConnectLogListBody,
  buildKycPullResultLogBody,
  buildPaymentOperationLogListBody,
} from './fixtures/memberPaymentLogs'
import { applyClearRealName, applyEditRealName, buildRealNameListBody } from './fixtures/memberRealName'
import { buildCommissionListBody } from './fixtures/memberCommission'
import {
  buildLoginLogListBody,
  buildManualLogListBody,
  buildOperationLogListBody,
  buildSmsLogListBody,
  buildUnbindLogListBody,
} from './fixtures/memberAuditLogs'
import {
  applySetAntGroup,
  buildAntLevelListBody,
  buildAntLevelRelationBody,
} from './fixtures/memberAntLevel'
import {
  applyAppBankDelete,
  applyAppBankLogSave,
  applyAppBankSave,
  applyAppBankSwitch,
  applyBanMemberApp,
  applyFakeBankDelete,
  applyFakeBankSave,
  applyFakeBankSwitch,
  applyScheduledAutoSell,
  applyUnban,
  buildAppBankListBody,
  buildAppBankLogBody,
  buildAppCollectListBody,
  buildAppSmsListBody,
  buildBehaviorLogBody,
  buildBlacklistBody,
  buildFakeBankCodeListBody,
  buildFakeBankListBody,
  buildFakeBankLogBody,
  buildLoginFailBody,
  buildMemberAppListBody,
} from './fixtures/appConfig'
import { resolveKycMenu } from './fixtures/kycMenu'
import { resolveMerchantMenu } from './fixtures/merchantMenu'
import { resolveChannelMenu } from './fixtures/channelMenu'
import { resolveTicketMenu } from './fixtures/ticketMenu'
import { resolveRemaining } from './fixtures/remainingPages'
import { resolveConfigOps } from './fixtures/configOps'

const emptyExtend = {
  nextColValue: '',
  nextCursorId: '',
  prevColValue: '',
  prevCursorId: '',
}

// 同时满足「data 是数组」和「data.list / data.total」两种列表结构，页面读不到字段时得到空值而不是抛错。
export function createPrototypeBody() {
  const list: any[] = []
  const data = Object.assign([] as any[], {
    list,
    records: list,
    rows: list,
    total: 0,
    extend: emptyExtend,
  })
  return {
    code: '1',
    msg: '操作成功',
    data,
    total: 0,
    extend: emptyExtend,
    success: true,
  }
}

function resolvePrototypeBody(config: InternalAxiosRequestConfig) {
  const url = config.url || ''
  if (url.includes('/memberInfoAdmin/listpage')) return buildMemberListBody(config.data)
  if (url.includes('/memberGroupAdmin/listpage')) return buildMemberGroupBody()
  if (url.includes('/memberGroupAdmin/authList')) return buildGroupAuthListBody()
  if (url.includes('/memberGroupAdmin/create')) return applyCreateGroup(config.data)
  if (url.includes('/memberGroupAdmin/update')) return applyUpdateGroup(config.data)
  if (url.includes('/memberGroupAdmin/delete')) return applyDeleteGroup(config.data)
  if (url.includes('/memberInfoAdmin/activeMerchantListPage')) return buildActiveMerchantBody(config.data)
  if (url.includes('/memberInfoAdmin/unbindingMerchant')) return applyUnbindMerchant(config.data)
  if (url.includes('/memberInfoAdmin/buyStatusChange')) return applyMemberTradeStatus(config.data, 'buy')
  if (url.includes('/memberInfoAdmin/sellStatusChange')) return applyMemberTradeStatus(config.data, 'sell')
  if (url.includes('/memberInfoAdmin/disableBuyBatch')) return applyMemberTradeStatus(config.data, 'buy', false)
  if (url.includes('/memberInfoAdmin/enableBuyBatch')) return applyMemberTradeStatus(config.data, 'buy', true)
  if (url.includes('/memberInfoAdmin/disableSellBatch')) return applyMemberTradeStatus(config.data, 'sell', false)
  if (url.includes('/memberInfoAdmin/enableSellBatch')) return applyMemberTradeStatus(config.data, 'sell', true)
  // 会员详情「会员信息」
  if (url.includes('/memberInfoAdmin/getInfo')) return buildMemberInfoBody(config.data)
  if (url.includes('/memberInfoAdmin/lastBuyRecord')) return buildLastBuyBody(config.data)
  if (url.includes('/memberInfoAdmin/lastSellRecord')) return buildLastSellBody(config.data)
  if (url.includes('/memberInfoAdmin/lastLogin')) return buildLastLoginBody(config.data)
  if (url.includes('/memberInfoAdmin/memberLevelChangeList')) return buildLevelChangeBody(config.data)
  if (url.includes('/memberInfoAdmin/resetpwd')) return applyResetPassword(config.data)
  if (url.includes('/memberInfoAdmin/resetPayPwd')) return applyResetPayPwd(config.data)
  if (url.includes('/memberInfoAdmin/remark')) return applyEditRemark(config.data)
  if (url.includes('/memberInfoAdmin/recharge')) return applyRecharge(config.data)
  if (url.includes('/memberInfoAdmin/withdrawal')) return applyWithdrawal(config.data)
  if (url.includes('/memberInfoAdmin/freeze')) return applyFreeze(config.data)
  if (url.includes('/memberInfoAdmin/unfreeze')) return applyUnfreeze(config.data)
  if (url.includes('/memberInfoAdmin/bonus')) return applyBonus(config.data)
  // 实名认证
  if (url.includes('/memberInfoAdmin/realName')) return buildRealNameListBody(config.data)
  if (url.includes('/memberInfoAdmin/clearRealNameAuth')) return applyClearRealName(config.data)
  if (url.includes('/memberInfoAdmin/update')) return applyEditRealName(config.data)
  // OSS 预签名（原型上传组件已本地 DataURL；此接口兜底避免其它入口报错）
  if (url.includes('/oss/generatePresignedUrl')) {
    const raw = config.data
    const query =
      typeof raw === 'string'
        ? (() => {
            try {
              return JSON.parse(raw)
            } catch {
              return {}
            }
          })()
        : (raw as Record<string, any>) || {}
    const objectName = String(query.objectName || `prototype-${Date.now()}.png`)
    return {
      code: '1',
      msg: '操作成功',
      data: {
        baseUrl: 'prototype-oss://',
        signedUrl: `prototype-oss://upload/${objectName}`,
      },
      success: true,
    }
  }
  // 账变：详情 Tab（带会员 id）+ 独立菜单全表
  if (url.includes('/memberAccounthangeAdmin/listpage')) return buildMemberChangeListBody(config.data)
  // 返佣记录
  if (url.includes('/commissionRecordAdmin/getList')) return buildCommissionListBody(config.data)
  // 会员短信 / 操作 / 登录日志、手动操作记录、解绑记录
  if (url.includes('/userVerificationCodes/listPage')) return buildSmsLogListBody(config.data)
  if (url.includes('/memberOperationLogs/listPage')) return buildOperationLogListBody(config.data)
  if (url.includes('/memberLoginLogs/listPage')) return buildLoginLogListBody(config.data)
  if (url.includes('/memberManualLog/listPage')) return buildManualLogListBody(config.data)
  if (url.includes('/unBindingMerchantRecordAdmin/listPage')) return buildUnbindLogListBody(config.data)
  // 蚂蚁层级列表
  if (url.includes('/antMemberInfoAdmin/getAntMemberInfoList')) return buildAntLevelListBody(config.data)
  if (url.includes('/antMemberInfoAdmin/levelRelationShip')) return buildAntLevelRelationBody(config.data)
  if (url.includes('/antMemberInfoAdmin/setAntGroup')) return applySetAntGroup(config.data)
  // APP 管理。假 APP 银行路径含 kycBank 字样，必须写在通用 kycBank 规则前面。
  if (url.includes('/fakeAppKycBankAdmin/getBankCodeList')) return buildFakeBankCodeListBody()
  if (url.includes('/fakeAppKycBankAdmin/addFakeAppKycBank')) return applyFakeBankSave(config.data, false)
  if (url.includes('/fakeAppKycBankAdmin/updateFakeAppKycBank')) return applyFakeBankSave(config.data, true)
  if (url.includes('/fakeAppKycBankAdmin/deleteFakeAppKycBank')) return applyFakeBankDelete(config.data)
  if (url.includes('/fakeAppKycBankAdmin/updateControlSwitch')) return applyFakeBankSwitch(config.data)
  if (url.includes('/fakeAppKycBankAdmin/listPage')) return buildFakeBankListBody(config.data)
  if (url.includes('/fakeAppKycBankControlSwitchLogAdmin/listPage')) return buildFakeBankLogBody(config.data)
  if (url.includes('/kycBankAdmin/addKycBank')) return applyAppBankSave(config.data, false)
  if (url.includes('/kycBankAdmin/updateKycBank')) return applyAppBankSave(config.data, true)
  if (url.includes('/kycBankAdmin/deleteKycBank')) return applyAppBankDelete(config.data)
  if (url.includes('/kycBankAdmin/kycBankUpdateControlSwitch')) return applyAppBankSwitch(config.data)
  if (url.includes('/kycBankAdmin/listPage')) return buildAppBankListBody(config.data)
  if (url.includes('/kycBankControlSwitchLogAdmin/save')) return applyAppBankLogSave(config.data)
  if (url.includes('/kycBankControlSwitchLogAdmin/listPage')) return buildAppBankLogBody(config.data)
  if (url.includes('/uploadKycPartnerAdmin/adminListPage')) return buildMemberAppListBody(config.data)
  if (url.includes('/uploadKycPartnerAdmin/banFakeApp')) return applyBanMemberApp(config.data)
  if (url.includes('/uploadKycPartnerAdmin/scheduledAutoSell')) return applyScheduledAutoSell(config.data)
  if (url.includes('/uploadKycPartnerAdmin/behaviorLogPage')) return buildBehaviorLogBody(config.data)
  if (url.includes('/uploadKycPartnerAdmin/uploadKycLoginFailureRecords')) return buildLoginFailBody(config.data)
  if (url.includes('/appInfoReport/memberSms/listPage')) return buildAppSmsListBody(config.data)
  if (url.includes('/appInfoReport/listPage')) return buildAppCollectListBody(config.data)
  if (url.includes('/fakeAppBanRecordAdmin/unbanFakeApp')) return applyUnban(config.data)
  if (url.includes('/fakeAppBanRecordAdmin/listPage')) return buildBlacklistBody(config.data)
  const kycMenuBody = resolveKycMenu(url, config.data)
  if (kycMenuBody) return kycMenuBody
  // 商户下拉一次取很多条；商户列表自己是分页查询，交给后面的列表假数据
  if (url.includes('/merchantInfoAdmin/listpage')) {
    let pageSize = 0
    try {
      const raw = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
      pageSize = Number(raw?.pageSize) || 0
    } catch {
      pageSize = 0
    }
    if (pageSize === 0 || pageSize >= 1000) return buildMerchantListBody()
  }
  // 会员详情「收款信息」Tab
  if (url.includes('/kycBankAdmin/getBankCodeList')) return buildKycBankCodeListBody()
  if (url.includes('/bankInfoAdmin/getBankCodeMap')) return buildBankCodeMapBody()
  if (url.includes('/collectionInfoAdmin/listPage')) return buildCollectionListBody(config.data)
  if (url.includes('/collectionInfoAdmin/getInfo')) return buildCollectionInfoBody(config.data)
  if (url.includes('/collectionInfoAdmin/operationLog')) return buildPaymentOperationLogListBody(config.data)
  if (url.includes('/kycLinkStatusLogAdmin/listPage') && !url.includes('smsVerifyLog')) {
    return buildKycConnectLogListBody(config.data)
  }
  if (url.includes('/kycPartnersAdmin/kycPullResultLogPage')) return buildKycPullResultLogBody(config.data)
  if (url.includes('/kycPartnersAdmin/addKycPartner')) return applyAddKycPartner(config.data)
  if (url.includes('/kycPartnersAdmin/updateKycPartner')) return applyUpdateKycPartner(config.data)
  if (url.includes('/collectionInfoAdmin/update') && !url.includes('updateStatus')) {
    return applyUpdateCollection(config.data)
  }
  if (url.includes('/collectionInfoAdmin/delete')) return applyDeleteCollection(config.data)
  if (url.includes('/collectionInfoAdmin/updateStatus')) return applyCollectionUpdateStatus(config.data)
  if (url.includes('/usdtReceiveInfo/listUsdtReceiveInfo')) return buildUsdtReceiveListBody(config.data)
  if (url.includes('/usdtReceiveInfo/createUsdtReceiveInfo')) return applyCreateUsdt(config.data)
  if (url.includes('/usdtReceiveInfo/getUsdtReceiveInfoByMemberId/')) return buildUsdtByMemberBody(url)
  if (url.includes('/usdtReceiveInfo/updateUsdtReceiveInfo/')) return applyUpdateUsdt(url, config.data)
  if ((config.method || 'get').toLowerCase() === 'delete' && url.includes('/usdtReceiveInfo/')) {
    return applyDeleteUsdt(url)
  }
  const configOpsBody = resolveConfigOps(url, config.data, config.method || 'post')
  if (configOpsBody) return configOpsBody
  const merchantBody = resolveMerchantMenu(url, config.data)
  if (merchantBody) return merchantBody
  const channelBody = resolveChannelMenu(url, config.data)
  if (channelBody) return channelBody
  const ticketBody = resolveTicketMenu(url, config.data)
  if (ticketBody) return ticketBody
  const remainingBody = resolveRemaining(url, config.data)
  if (remainingBody) return remainingBody
  return createPrototypeBody()
}

export function applyPrototypeAdapter(config: InternalAxiosRequestConfig) {
  if (!isPrototype) return false
  config.adapter = () => {
    const isBlob = config.responseType === 'blob'
    const response = {
      data: isBlob ? new Blob(['prototype'], { type: 'text/plain' }) : resolvePrototypeBody(config),
      status: 200,
      statusText: 'OK',
      headers: isBlob
        ? { 'content-disposition': 'attachment; filename=prototype.txt' }
        : {},
      config,
    }
    return Promise.resolve(response as AxiosResponse)
  }
  return true
}
