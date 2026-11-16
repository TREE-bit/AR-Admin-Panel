import request from './request'
// 查询商户列表
export function getMerchantInfoAdminList(data: any) {
  return request.post("/ar-manager/api/v1/merchantInfoAdmin/listpage", data);
}

// 创建商户 
export function createMerchantInfoApi(data: any) {
  return request.post("/ar-manager/merchantInfoAdmin/createMerchantInfo", data);
}
// 获取创建商户时默认加白的IP（多个英文逗号分隔，未配置时为 null）
export function getDefaultAllowedIpsApi() {
  return request.get("/ar-manager/merchantInfoAdmin/getDefaultAllowedIps");
}
// 删除商户

export function deleteMerchantInfoApi(data: any) {
  return request.post("/ar-manager/merchantInfoAdmin/delete", data);
}
// 修改商户
export function updateMerchantInfoApi(data: any) {
  return request.post("/ar-manager/merchantInfoAdmin/update", data);
}
// 修改商户自动出款
export function merchantInfoAdminUpdateAutoWithdrawalState(data: any) {
  return request.post("/ar-manager/merchantInfoAdmin/updateAutoWithdrawalState", data);
}


//生成密钥对
export function generateKeyPair() {
  return request.post("/ar-manager/api/v1/merchantInfoAdmin/generateKeyPair");
}
// 查询商户详情
export function getMerchantInfoApi(data: any) {
  return request.post("/ar-manager/merchantInfoAdmin/getInfo", data);
}

// 手动下发 
export function applyWithdrawApi(data: any) {
  return request.post("/ar-manager/merchantInfoAdmin/applyWithdraw", data);
}

// 手动上分
export function applyRechargeApi(data: any) {
  return request.post("/ar-manager/merchantInfoAdmin/applyRecharge", data);
}

// 修改商户提现USDT 地址
export function updateUsdtAddressApi(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/merchantInfoAdmin/updateUsdtAddress", data, config);
}

// 重置密码 
export function resetPasswordApi(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/merchantInfoAdmin/resetPassword", data, config);
}

// 重置商家密钥 
export function resetKeyApi(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/merchantInfoAdmin/resetKey", data, config);
}
// 修改商户密钥 
export function setKeyApi(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/merchantInfoAdmin/updateMerchantPublicKey", data, config);
}

// 下发申请列表

export function applyDistributedAdminListApi(data: any) {
  return request.post("/ar-manager/applyDistributedAdmin/listpage", data);
}

// 同意下发申请

export function distributeApi(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/applyDistributedAdmin/distribute", data, config);
}

// 不同意下发申请  /ar-manager/applyDistributedAdmin/nodistribute
export function nodistributeApi(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/applyDistributedAdmin/nodistribute", data, config);
}

// 下发记录
export function listRecordPageApi(data: any) {
  return request.post("/ar-manager/applyDistributedAdmin/listRecordPage", data);
}

// 商户账变类型
export function fetchAccountTypeApi() {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/accountChangeAdmin/fetchAccountType", {}, config);
}

// 商户账变列表 

export function accountChangeListApi(data:any) {
  return request.post("/ar-manager/accountChangeAdmin/query", data);
}

//get Merchant Info on Dashboard/ Analysis
export function getMerchantInfoData() {
  return request.post("/ar-manager/merchantInfoAdmin/overview");
}

//获取仪表盘图标数据
export function queryBuySellGraphReport() {
  return request.post("/ar-manager/buySellReport/queryBuySellGraphReport",{});
}


//获取代收订单列表
export function fetchRechargeOrderInfo(data: any) {
  return request.post("/ar-manager/api/v1/merchantInfoAdmin/fetchCollectionOrderInfo", data);
}

//获取代付订单列表
export function fetchWithdrawOrderInfo(data: any) {
  return request.post("/ar-manager/merchantInfoAdmin/fetchWithdrawOrder", data);
}
//withdraw confirm success 
export function withdrawConfirmSuccess(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/merchantInfoAdmin/confirmSuccess", data, config);
}
//recharge confirm success
export function rechargeConfirmSuccess(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/api/v1/merchantInfoAdmin/rechargeConfirmSuccess", data, config);
}

// 重置google 
export function resetMerchantGoogle(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/api/v1/merchantInfoAdmin/resetMerchantGoogle", data, config);
}


//获取订单数量概览
export function getOrderNumOverview() {
  return request.post("/ar-manager/api/v1/merchantInfoAdmin/getOrderNumOverview");
}
//获取代收/代付订单统计
export function getMerchantOrderOverview(data: any) {
  return request.post("/ar-manager/api/v1/merchantInfoAdmin/getMerchantOrderOverview", data);
}
//获取买入/卖出订单统计
export function getMemberOrderOverview(data: any) {
  return request.post("/ar-manager/buySellReport/queryHomeBuySellReport", data);
}
//获取会员统计数据
export function biMemberStatistics() {
  return request.post("/ar-manager/api/v1/biMemberStatistics/query");
}

//获取取消原因统计
export function biCancelReasonStatistics(data: any) {
  return request.post("/ar-manager/cancelOrderStaticAdmin/getCancelOrderStatics",data);
}
//获取商户统计数据
export function biMerchantStatistics(data: any) {
  return request.post("/ar-manager/api/v1/biMerchantStatistics/query",data);
}
//仪表盘订单状态统计
export function getOrderStatusOverview(data: any) {
  return request.post("/ar-manager/buySellReport/queryHomeBuySellStateReport",data);
}

//商户代收订单-批量代收
export function merchantInfoAdminRechargeBatchConfirmSuccess(data: any) {
  return request.post("/ar-manager/merchantInfoAdmin/rechargeBatchConfirmSuccess",data);
}

//商户代付订单-批量代付
export function merchantInfoAdminBatchConfirmSuccess(data: any) {
  return request.post("/ar-manager/merchantInfoAdmin/batchConfirmSuccess",data);
}