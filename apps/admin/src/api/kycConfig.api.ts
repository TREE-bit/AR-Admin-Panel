import request from './request'


// 获取KYC列表 
export function kycPartnersAdminList(data: any) {
  return request.post('/ar-manager/api/v1/kycPartnersAdmin/listPage', data)
}
// 删除KYC 
export function kycPartnersAdminDelete(data: any) {
  return request.post('/ar-manager/api/v1/kycPartnersAdmin/delete', data)
}

// 获取KYC bank code
export function getKycBankCodeList() {
  return request.post('/ar-manager/api/v1/kycBankAdmin/getBankCodeList')
}
// 获取KYC 快捷提现-连接记录列表
export function buyKycPendingListLogPage(data: any) {
  return request.post('/ar-manager/kycPartnersAdmin/buyKycPendingListLogPage',data)
}

// 获取KYC BANK CODE 列表
export function kycBankAdminList(data: any) {
  return request.post('/ar-manager/api/v1/kycBankAdmin/listPage', data)
}

// 新增KYC BANK
export function addKycBank(data: any) {
  return request.post('/ar-manager/api/v1/kycBankAdmin/addKycBank', data)
}
// 修改KYC BANK
export function updateKycBank(data: any) {
  return request.post('/ar-manager/api/v1/kycBankAdmin/updateKycBank', data)
}
// 修改KYC BANK 开关状态
export function kycBankAdminKycBankUpdateControlSwitch(data: any) {
  return request.post('/ar-manager/kycBankAdmin/kycBankUpdateControlSwitch', data)
}
// 删除KYC BANK
export function deleteKycBank(data: any) {
  return request.post('/ar-manager/api/v1/kycBankAdmin/deleteKycBank', data)
}


// 获取KYC 订单列表
export function kycApprovedOrderAdminListPage(data: any) {
  return request.post('/ar-manager/api/v1/kycApprovedOrderAdmin/listPage', data)
}

// 获取买入KYC 待拉取流水
export function pendingKycBuyListPage(data: any) {
  return request.post('/ar-manager/kycPartnersAdmin/pendingBuyKycListPage', data)
}
// 获取卖出KYC 待拉取流水
export function pendingKycListPage(data: any) {
  return request.post('/ar-manager/kycPartnersAdmin/pendingKycListPage', data)
}
// 获取卖出KYC 待拉取流水-快捷提现
export function pendingKycQuickListPage(data: any) {
  return request.post('/ar-manager/kycPartnersAdmin/pendingKycListPageForQuickKyc', data)
}
// 获取KYC 待拉取流水UPI关联订单
export function processedListList(data: any) {
  return request.post('/ar-manager/paymentOrderAdmin/processedList/byUpiId', data)
}
// 获取KYC续Token表
export function pendingKycTokenListPage(data: any) {
  return request.post('/ar-manager/kycPartnersAdmin/pendingKycTokenListPage', data)
}
// 获取KYC买入申诉流水
export function kycPartnerBuyAppealPaymentAdminListPage(data: any) {
  return request.post('/ar-manager/kycPartnerBuyAppealPaymentAdmin/listPage', data)
}

// 获取KYC买入申诉流水
export function kycPartnerBuyAppealPaymentAdminFailedListPage(data: any) {
  return request.post('/ar-manager/kycPartnerBuyAppealPaymentAdmin/failedListPage', data)
}

// KYC卖出申诉待拉取列表randomAmountFinish
export function kycSellAppealPendingPull(data: any) {
  return request.post('/ar-manager/kycPartnersAdmin/kycSellAppealPendingPull', data)
}


// 获取KYC连接日志
export function kycLinkStatusLogAdminListPage(data: any) {
  return request.post('/ar-manager/kycLinkStatusLogAdmin/listPage', data)
}
// 获取KYC短信验证日志
export function kycSmsVerifyLogListPage(data: any) {
  return request.post('/ar-manager/kycLinkStatusLogAdmin/smsVerifyLog/listPage', data)
}
// 获取KYC短信验证日志筛选项（业务场景）
export function kycSmsVerifyLogOptions() {
  return request.get('/ar-manager/kycLinkStatusLogAdmin/smsVerifyLog/options')
}
// 导出KYC短信验证日志
export function kycSmsVerifyLogExport(data: any) {
  return request.post('/ar-manager/kycLinkStatusLogAdmin/smsVerifyLog/export', data)
}
// 获取操作日志
export function collectionInfoAdminOperationLog(data: any) {
  return request.post('/ar-manager/collectionInfoAdmin/operationLog', data)
}


// 获取KYC连接日志拉取流水记录
export function kycPartnersAdminKycPullResultLogPage(data: any) {
  return request.post('/ar-manager/kycPartnersAdmin/kycPullResultLogPage', data)
}

// 获取KYC短信日志
export function kycSendSmsDailyStatisticsListPage(data: any) {
  return request.post('/ar-manager/api/v1/kycSendSmsDailyStatistics/listPage', data)
}
// KYC买卖交易统计列表
export function kycDataStatDayManagerListPage(data: any) {
  return request.post('/ar-manager/api/v1/kycDataStatDayManager/listPage', data)
}
// KYC发短信成功日统计列表
export function kycSendSmsSuccessStatisticsListPage(data: any) {
  return request.post('/ar-manager/api/v1/kycSendSmsSuccessStatistics/listPage', data)
}

//卖出UTR重复流水
export function utrDuplicateListPage(data: any) {
  return request.post('/ar-manager/kycPartnerRecipientAdmin/utrDuplicateListPage', data)
}
//卖出TID重复流水
export function tidDuplicateListPage(data: any) {
  return request.post('/ar-manager/kycPartnerRecipientAdmin/tidDuplicateListPage', data)
}
//Phonepe唤醒记录
// export function phonepeWakeupRecordAdminPage(data: any) {
//   return request.post('/ar-manager/api/v1/phonepeWakeupRecordAdmin/listPage', data)
// }
//唤醒记录
export function wakeupRecordAdminPage(data: any) {
  return request.post('/ar-manager/wakeupRecordAdmin/listPage', data)
}
//获取收入异常流水列表
export function kycPartnerRecipientAdminErrorListPage(data: any) {
  return request.post('/ar-manager/kycPartnerRecipientAdmin/errorListPage', data)
}

//KYC流水状态异常
export function abnormalWaterFlowAdminListPage(data: any) {
  return request.post("/ar-manager/abnormalWaterFlowAdmin/listPage", data);
}

//KYC多订单列表
export function oneWaterMultipleOrderAdminProcessResultList(data: any) {
  return request.post("/ar-manager/oneWaterMultipleOrderAdmin/processResultList", data);
}

//外部通道收款流水
export function extChannelKycAdminkKycWaterSuccessListPage(data: any) {
  return request.post("/ar-manager/extChannelKycAdmin/kycWaterSuccess/listPage", data);
}
//收款KYC待拉取队列
export function extChannelKycAdminKycPendingListPage(data: any) {
  return request.post("/ar-manager/extChannelKycAdmin/kycPending/listPage", data);
}

//外部通道异常流水
export function extChannelKycAdminKycWaterFailListPage(data: any) {
  return request.post("/ar-manager/extChannelKycAdmin/kycWaterFail/listPage", data);
}
//获取外部通道列表
export function extChannelAdminListPage(data: any) {
  return request.post("/ar-manager/extChannelAdmin/listpage", data);
}
//新增外部通道列表
export function extChannelAdminCreateMerchantInfo(data: any) {
  return request.post("/ar-manager/extChannelAdmin/createMerchantInfo", data);
}
//外部通道列表状态更新
export function extChannelAdminUpdateStatus(data: any) {
  return request.post("/ar-manager/extChannelAdmin/updateStatus", data);
}
//外部通道列表详情
export function extChannelAdminGetInfo(data: any) {
  return request.post("/ar-manager/extChannelAdmin/getInfo", data);
}
//外部通道生成密钥对
export function extChannelAdminGenerateKeyPair() {
  return request.post("/ar-manager/extChannelAdmin/generateKeyPair");
}
//保存外部通道公钥
export function extChannelAdminUpdatePublicKey(data: any) {
  return request.post("/ar-manager/extChannelAdmin/updatePublicKey", data);
}

//获取KYC银行开关日志
export function kycBankControlSwitchLogAdminListPage(data: any) {
  return request.post("/ar-manager/kycBankControlSwitchLogAdmin/listPage", data);
}
//新增KYC银行开关日志
export function kycBankControlSwitchLogAdminSave(data: any) {
  return request.post("/ar-manager/kycBankControlSwitchLogAdmin/save", data);
}
//KYC支付成功流水
export function buyPaymentSuccessRecordForAdminBuySuccessUpiListPage(data: any) {
  return request.post("/ar-manager/buyPaymentSuccessRecordForAdmin/buySuccessUpiListPage", data);
}
//成功流水日志
export function buyPaymentSuccessRecordForAdminBuyListPageRecord(data: any) {
  return request.post("/ar-manager/buyPaymentSuccessRecordForAdmin/buyListPageRecord", data);
}
//自动交易买入流水
export function autoTransferAdminPaymentRecord(data: any) {
  return request.post("/ar-manager/autoTransferAdmin/paymentRecord", data);
}

//自动交易卖出流水
export function autoTransferAdminReceiptRecord(data: any) {
  return request.post("/ar-manager/autoTransferAdmin/receiptRecord", data);
}

//自动交易待拉取列表
export function autoTransferAdminWaitingPull(data: any) {
  return request.post("/ar-manager/autoTransferAdmin/waitingPull", data);
}

//假APP交易失败责任方列表
export function fakeAppTransactionFailedPartyAdminListPage(data: any) {
  return request.post("/ar-manager/fakeAppTransactionFailedPartyAdmin/listPage", data);
}
//更新假APP交易失败责任方
export function fakeAppTransactionFailedPartyAdminUpdateFailedParty(data: any) {
  return request.post("/ar-manager/fakeAppTransactionFailedPartyAdmin/updateFailedParty", data);
}

//假APP未完结流水
export function autoTransferAdminUnfinishRecord(data: any) {
  return request.post("/ar-manager/autoTransferAdmin/unfinishRecord", data);
}


