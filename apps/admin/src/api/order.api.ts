import request from './request'

//Order Managemetn Appeal Order
export function getAppealOrderListPage(data: any) {
  return request.post("/ar-manager/appealOrderAdmin/listpage", data);
}

//获取申诉订单配置列表
export function appealOrderHandlerListPage(data: any) {
  return request.post("/ar-manager/appealOrderHandlerAdmin/listPage", data);
}
//添加接单用户
export function appealOrderHandlerAdd(data: any) {
  return request.post("/ar-manager/appealOrderHandlerAdmin/add", data);
}
//移除接单用户
export function appealOrderHandlerRemove(data: any) {
  return request.post("/ar-manager/appealOrderHandlerAdmin/remove", data);
}
//order / appeal order  nopay api
export function appealOrderNoPay(data: any) {
  return request.post("/ar-manager/api/v1/appealOrderAdmin/nopay", data);
}

//order / appeal order pay  api
export function appealOrderPay(data: any) {
  return request.post("/ar-manager/api/v1/appealOrderAdmin/pay", data);
}

///get ustd buy order listpage
export function getUstdBuyOrderListPage(data: any) {
  return request.post("/ar-manager/api/v1/usdtBuyOrderAdmin/listpage", data);
}
//USDT卖出订单
export function getUstdSellOrderListPage(data: any) {
  return request.post("/ar-manager/usdtSellOrderAdmin/listUsdtSellOrders", data);
}
//USDT卖出订单-审核通过
export function approveUsdtSellOrder(data: any) {
  return request.post("/ar-manager/usdtSellOrderAdmin/approveUsdtSellOrder", data);
}
//USDT卖出订单-审核不通过
export function rejectUsdtSellOrder(data: any) {
  return request.post("/ar-manager/usdtSellOrderAdmin/rejectUsdtSellOrder", data);
}

// sale order & sale order record 
export function getSaleOrderListPage(data: any) {
  return request.post("/ar-manager/api/v1/paymentOrderAdmin/listPage", data);
}
// 卖出订单-查询状态 
export function getSaleOrderStatus(data: any) {
  return request.post("/ar-manager/sellOrderAdmin/thirdPaymentOrderQuery", data);
}
export function getSaleOrderRecordListPage(data: any) {
  return request.post("/ar-manager/api/v1/paymentOrderAdmin/listRecordPage", data);
}
// buy order & buy order record 
export function getBuyOrderListPage(data: any) {
  return request.post("/ar-manager/api/v1/collectionOrderAdmin/listPage", data);
}
export function getBuyOrderRecordListPage(data: any) {
  return request.post("/ar-manager/api/v1/collectionOrderAdmin/listRecordPage", data);
}

//回去买入订单取消原因
export function cancellationRechargeDict() {
  return request.get("/ar-manager/cancellationRecharge/dict");
}


export function ustdBuyOrderNoPay(data: any) {
  return request.post("/ar-manager/api/v1/usdtBuyOrderAdmin/nopay", data);
}
export function ustdBuyOrderPay(data: any) {
  return request.post("/ar-manager/api/v1/usdtBuyOrderAdmin/pay", data);
}
//买入/卖出订单-回调详情
export function queryCallbackPage(data: any) {
  return request.post("/ar-manager/orderInfoAdmin/queryCallbackPage", data);
}


export function getUstdBuyOrderInfo(data: any) {
  return request.post("/ar-manager/api/v1/usdtBuyOrderAdmin/getInfo", data);
}

//Match pool
export function getMatchPoolListPage(data: any) {
  return request.post("/ar-manager/api/v1/matchPoolAdmin/listpage", data);
}
//Match timeoutLogs
export function matchPoolAdminTimeoutLogs(data: any) {
  return request.post("/ar-manager/matchPoolAdmin/timeoutLogs", data);
}
//母订单-失败
export function getMatchPoolFailReturn(data: any) {
  return request.post("/ar-manager/matchPoolAdmin/failReturn", data);
}
//get buy record check info 
export function getBuyRecordCheckInfo(data: any) {
  return request.post("/ar-manager/collectionOrderAdmin/getInfo", data);
}
export function getBuyOrderCheckInfo(data: any) {
  return request.post("/ar-manager/collectionOrderAdmin/getInfo", data);
}

export function manualCallback(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/paymentOrderAdmin/manualCallback", data, config)
}

//buy order paid 
export function getBuyOrderPaid(data: any) {
  return request.post("/ar-manager/api/v1/collectionOrderAdmin/pay", data);
}

//Cancel Sale Order
export function cancelSaleOrder(data: any) {
  return request.post("/ar-manager/paymentOrderAdmin/cancel", data);
}

//Get sale order Info / check
export function getsaleOrderCheck(data: any) {
  return request.post("/ar-manager/paymentOrderAdmin/getInfo", data);
}

//get match list 
//Get sale order Info / check
export function getMatchListData(data: any) {
  return request.post("/ar-manager/api/v1/matchingOrderAdmin/listpage", data);
}
// 撮合补单
export function matchOrderManualOrderReplenishment(data: any) {
  return request.post("/ar-manager/matchingOrderAdmin/orderReplenishment", data);
}
// 公共-补单
export function matchingOrderAdminOrderReplenishmentByWater(data: any) {
  return request.post("/ar-manager/matchingOrderAdmin/orderReplenishmentByWater", data);
}
//撮合-成功
export function matchOrderAutoFailOrderAppealSuccess(data: any) {
  return request.post("/ar-manager/api/v1/matchingOrderAdmin/autoFailOrderAppealSuccess", data);
}
//撮合-失败
export function matchOrderAutoFailOrderAppealFail(data: any) {
  return request.post("/ar-manager/api/v1/matchingOrderAdmin/autoFailOrderAppealFail", data);
}
//撮合-确认放款
export function matchOrderConfirmPay(data: any) {
  return request.post("/ar-manager/matchingOrderAdmin/confirmPay", data);
}
//撮合-创建申诉链接
export function matchOrderCreateAppealLink(data: any) {
  return request.post("/ar-manager/matchingOrderAdmin/createAppealLink", data);
}
//撮合-解冻
export function matchOrderCreateUnfreeze(data: any) {
  return request.post("/ar-manager/matchingOrderAdmin/unfreeze", data);
}
//match list NoPay  api
export function matchListPay(data: any) {
  return request.post("/ar-manager/api/v1/matchingOrderAdmin/pay", data);
}
export function matchListNoPay(data: any) {
  return request.post("/ar-manager/api/v1/matchingOrderAdmin/nopay", data);
}
//get match list detail 
export function getMatchListResult(data: any) {
  return request.post("/ar-manager/api/v1/matchingOrderAdmin/getInfo", data);
}
// 撮合列表KYC连接日志
export function matchingOrderAdminKycLinkLog(data: any) {
  return request.post("/ar-manager/matchingOrderAdmin/kycLinkLog", data);
}
//incorrect Transfer Amount 
export function getWrongAmountTransfer(data: any) {
  return request.post("/ar-manager/matchingOrderAdmin/incorrectTransfer", data);
}
//incorrect Transfer Amount 
export function getIncorrectOrderVoucher(data: any) {
  return request.post("/ar-manager/api/v1/matchingOrderAdmin/incorrectVoucher", data);
}
//get appeal details 
export function getAppealDetails(data: any) {
  return request.post("/ar-manager/api/v1/matchingOrderAdmin/appealDetail", data);
}
//get appeal details 
export function cashBackOrderAdminListPage(data: any) {
  return request.post("/ar-manager/api/v1/cashBackOrderAdmin/listPage", data);
}

//kyc流水
export function kycPartnerRecipientAdminListPage(data: any) {
  return request.post("/ar-manager/kycPartnerRecipientAdmin/listPage", data);
}

//kyc冲正流水
export function kycReversalWaterAdminListPage(data: any) {
  return request.post("/ar-manager/kycReversalWaterAdmin/listPage", data);
}

//kyc补单
export function kycManualReplenishment(data: any) {
  return request.post("/ar-manager/kycPartnerRecipientAdmin/manualReplenishment", data);
}

//kyc交易失败流水
export function kycPartnerRecipientAdminFailedListPage(data: any) {
  return request.post("/ar-manager/kycPartnerRecipientAdmin/failedListPage", data);
}

//卖出订单-锁定订单
export function sellBlockOrder(data: any) {
  return request.post("/ar-manager/paymentOrderAdmin/blockOrder", data);
}
//卖出订单-分配订单
export function sellDistributionOrder(data: any) {
  return request.post("/ar-manager/paymentOrderAdmin/distributionOrder", data);
}
//欠费订单
export function memberArrearsRecordAdminListPage(data: any) {
  return request.post("/ar-manager/memberArrearsRecordAdmin/listPage", data);
}
//欠费订单total
export function memberArrearsRecordAdminTotalMemberDebt() {
  return request.post("/ar-manager/memberArrearsRecordAdmin/totalMemberDebt");
}


//挂单列表
export function matchOrderPoolAdminListPage(data: any) {
  return request.post("/ar-manager/mandateAdmin/listPage", data);
}

//推送金额记录
export function recommendedAmountRecordAdminListPage(data: any) {
  return request.post("/ar-manager/api/v1/recommendedAmountRecordAdmin/listPage", data);
}


//买入热度记录
export function hotBuyAmountAdminListPage(data: any) {
  return request.post("/ar-manager/hotBuyAmountAdmin/listPage", data);
}

//充值失败记录
export function rechargeFailureForAdminListPage(data: any) {
  return request.post("/ar-manager/rechargeFailureForAdmin/listPage", data);
}

//智能拆单挂单列表
export function maxBenefitOrderAdminListPage(data: any) {
  return request.post("/ar-manager/maxBenefitOrderAdmin/unMatchList", data);
}

//智能拆单失败记录
export function maxBenefitOrderAdminFailedListPage(data: any) {
  return request.post("/ar-manager/maxBenefitOrderAdmin/matchFailedList", data);
}

//快捷下单（UPI/银行卡）
export function createQuickUpiOrBankOrder(data: any) {
  return request.post("/ar-manager/generateQuickUpiOrBankAdmin/createOrder", data);
}

//快捷下单日志列表
export function getQuickUpiOrBankOrderLogListPage(data: any) {
  return request.post("/ar-manager/generateQuickUpiOrBankAdmin/listPage", data);
}

//快捷下单导入批次记录列表
export function getQuickUpiOrBankImportBatchListPage(data: any) {
  return request.post("/ar-manager/api/v1/generateQuickUpiOrBankAdmin/listImportBatchPage", data);
}

//快捷下单导入批次明细列表
export function getQuickUpiOrBankImportOrderRecordListPage(data: any) {
  return request.post("/ar-manager/api/v1/generateQuickUpiOrBankAdmin/listImportOrderRecordPage", data);
}

//快捷下单重试
export function retryQuickUpiOrBankOrder(data: any) {
  return request.post("/ar-manager/generateQuickUpiOrBankAdmin/retryOrder", data);
}
// 人工卖出订单记录-审核通过
export function issueQuickUpiOrBankPaymentVoucherReward(data: any) {
  return request.post("/ar-manager/generateQuickUpiOrBankAdmin/issuePaymentVoucherReward", data);
}
// 人工卖出订单记录-驳回
export function rejectQuickUpiOrBankPaymentVoucher(data: any) {
  return request.post("/ar-manager/generateQuickUpiOrBankAdmin/rejectPaymentVoucher", data);
}

//快捷下单模板下载
export function downloadQuickUpiOrBankOrderTemplate(data: any = {}) {
  return request.post("/ar-manager/generateQuickUpiOrBankAdmin/exportOrderTemplate", data, {
    responseType: "blob",
  });
}

//快捷下单模板导入
export function importQuickUpiOrBankOrderTemplate(data: FormData) {
  return request({
    method: "post",
    maxBodyLength: Infinity,
    url: "/ar-manager/generateQuickUpiOrBankAdmin/importOrderTemplate",
    data,
  });
}
