import request from './request'
import { withEncryptedPwd } from '@/utils/rsa'
// 查询分组管理列表
export function groupListApi(data: any) {
  return request.post('/ar-manager/memberGroupAdmin/listpage', data)
}

// 获取权限列表
export function groupAuthListApi() {
  return request.post('/ar-manager/memberGroupAdmin/authList')
}

// 添加分组管理
export function createGroupApi(data: any) {
  return request.post('/ar-manager/memberGroupAdmin/create', data)
}
// 编辑分组管理
export function updateGroupApi(data: any) {
  return request.post(`/ar-manager/memberGroupAdmin/update`, data)
}
// 获取会员列表
export function memberListApi(data: any) {
  return request.post('/ar-manager/memberInfoAdmin/listpage', data)
}
// 获取会员层级管理
export function memberRelationList(data: any) {
  return request.post('/ar-manager/memberInfoAdmin/relationList', data)
}
// 查询会员收款列表
export function collectionListApi(data: any) {
  return request.post('/ar-manager/collectionInfoAdmin/listPage', data)
}

// 查询会员USDT收款列表
export function listUsdtReceiveInfo(data: any) {
  return request.post('/ar-manager/usdtReceiveInfo/listUsdtReceiveInfo', data)
}
// 更新会员USDT收款列表
export function updateUsdtReceiveInfo(id: any,data: any) {
  return request.post('/ar-manager/usdtReceiveInfo/updateUsdtReceiveInfo/'+id, data)
}
// 查询会员USDT收款列表
export function getUsdtReceiveInfoByMemberId(id: any) {
  return request.get('/ar-manager/usdtReceiveInfo/getUsdtReceiveInfoByMemberId/'+id)
}
// 删除会员USDT收款列表
export function deleteUsdtReceiveInfo(id: any) {
  return request.delete('/ar-manager/usdtReceiveInfo/'+id)
}


// Disable member in batches
export function disableMemberInBatches(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/disableBatch', data)
}
// Enable member in batches
export function enableMemberInBatches(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/enableBatch', data)
}
// Disable buy batches
export function disableBuyBatches(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/disableBuyBatch', data)
}
// Enable buy batches
export function enableBuyBatches(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/enableBuyBatch', data)
}
// 买入状态修改
export function memberInfoAdminBuyStatusChange(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/buyStatusChange', data)
}
// 卖出状态修改
export function memberInfoAdminSellStatusChange(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/sellStatusChange', data)
}
// Disable sale batches
export function disableSaleBatches(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/disableSellBatch', data)
}
// Enable sale batches
export function enableSaleBatches(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/enableSellBatch', data)
}
//Member / payment list api 
export function memberPaymentList(data: any) {
  return request.post('/ar-manager/api/v1/collectionInfoAdmin/listPage', data)
}

//edit  / payment list api 
export function editMemberPaymentList(data: any) {
  return request.post('/ar-manager/api/v1/collectionInfoAdmin/update', data)
}
//会员收款启用/禁用http://127.0.0.1:20002/collectionInfoAdmin/enable?id=1806186
export function memberPaymentenable(id: any) {
  return request.post('/ar-manager/collectionInfoAdmin/enable?id='+ id)
}
export function memberPaymentDisable(id: any) {
  return request.post('/ar-manager/collectionInfoAdmin/disable?id='+ id)
}
//会员收款启用/禁用
export function collectionInfoAdminUpdateStatus(data: any) {
  return request.post('/ar-manager/collectionInfoAdmin/updateStatus',data)
}

//get info member  / payment list api 
export function getMemberPaymentListInfo(data: any) {
  return request.post('/ar-manager/api/v1/collectionInfoAdmin/getInfo', data)
}

// 创建会员：password 组装 pwd=&nonce= 后 RSA 加密传输，字段名不变
export function createMemberInfo(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/createMemberInfo', withEncryptedPwd(data, ['password']))
}

// 查询会员信息 
export function getMemberInfo(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/getInfo', data)
}
// 最后买入
export function lastBuyRecord(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/lastBuyRecord', data)
}
// 最后登录
export function lastLogin(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/lastLogin', data)
}
// 最后卖出
export function lastSellRecord(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/lastSellRecord', data)
}

// 获取收款信息 
export function getcollectionList(data: any) {
  return request.post('/ar-manager/api/v1/collectionInfoAdmin/listPage', data)
}

// 删除收款信息 
export function delcollectionInfoAdmin(data: any) {
  return request.post('/ar-manager/api/v1/collectionInfoAdmin/delete', data)
}

// 添加收款信息 
export function addcollectionInfoAdmin(data: any) {
  return request.post('/ar-manager/api/v1/collectionInfoAdmin/add', data)
}
// 添加KYC收款信息 
export function addKycPartner(data: any) {
  return request.post('/ar-manager/kycPartnersAdmin/addKycPartner', data)
}

// 修改KYC收款信息 
export function updateKycPartner(data: any) {
  return request.post('/ar-manager/kycPartnersAdmin/updateKycPartner', data)
}

// 添加USDT收款信息 
export function createUsdtReceiveInfo(data: any) {
  return request.post('/ar-manager/usdtReceiveInfo/createUsdtReceiveInfo', data)
}

// 获取账变记录

// reset password
export function resetPassword(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/resetpwd', data)
}

// Recharge
export function rechargeTopup(data: any) {
  return request.post('ar-manager/memberInfoAdmin/recharge', data)
}

// Withdrawal
export function withdrawalAmount(data: any) {
  return request.post('ar-manager/memberInfoAdmin/withdrawal', data)
}


// unFreeze
export function unFreezeAccount(data: any) {
  return request.post('ar-manager/memberInfoAdmin/unfreeze', data)
}

// Freeze
export function freezeAccount(data: any) {
  return request.post('ar-manager/memberInfoAdmin/freeze', data)
}

// BuyBonus&SellBonus
export function buyBonusSellBonus(data: any) {
  return request.post('ar-manager/memberInfoAdmin/bonus', data)
}
// Get Member Account Change List 
export function getMemberAccountChangeList(data: any) {
  return request.post('/ar-manager/api/v1/memberAccounthangeAdmin/listpage', data)
}

// 实名
export function getRealNameList(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/realName', data)
}

//手动实名
export function editRealName(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/update', data)
}

//删除实名
export function clearRealNameAuth(data: any) {
  return request.post('/ar-manager/memberInfoAdmin/clearRealNameAuth', data)
}


// 删除delete
export function deleteGroup(data: any) {
  return request.post('/ar-manager/api/v1/memberGroupAdmin/delete', data)
}

// 更新备注
export function editRemark(data: any) {
  return request.post('/ar-manager/memberInfoAdmin/remark', data)
}

// 重置支付密码 
export function resetPayPwd(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/resetPayPwd', data)
}

// 查询会员短信日志
export function getSmsLog(data:any) {
  return request.post('/ar-manager/userVerificationCodes/listPage', data)
}

// 查询会员登录日志
export function getLoginLog(data:any) {
  return request.post('/ar-manager/api/v1/memberLoginLogs/listPage', data)
}


// 查询会员操作日志
export function getOperateLog(data:any) {
  return request.post('/ar-manager/memberOperationLogs/listPage', data)
}

// 获取商户账变记录 
export function getMemberAccounthangeAdmin(data: any) {
  return request.post('/ar-manager/api/v1/memberAccounthangeAdmin/listpage', data)
}
// 获取手动操作记录记录 
export function getMemberManualLog(data: any) {
  return request.post('/ar-manager/api/v1/memberManualLog/listPage', data)
}
// 人工审核 
export function manualReview(data: any) {
  return request.post('/ar-manager/api/v1/matchingOrderAdmin/manualReview', data)
}
// 余额一键退回 
export function cashBackBatch(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/cashBackBatch', data)
}
// 余额一键退回 
export function getBankCodeMap() {
  return request.post('/ar-manager/api/v1/bankInfoAdmin/getBankCodeMap')
}
// 返佣记录 
export function commissionRecordAdminGetList(data: any) {
  return request.post('/ar-manager/commissionRecordAdmin/getList', data)
}

// 系统登录日志 
export function adminLogListPage(data: any) {
  return request.post('/ar-manager/adminLog/listPage',data)
}


//获取会员激活的商户列表
export function getActiveMerchantList(data: any) {
  return request.post('/ar-manager/memberInfoAdmin/activeMerchantListPage', data)
}


//会员解绑商户
export function unbindMerchant(data: any) {
  return request.post('/ar-manager/memberInfoAdmin/unbindingMerchant', data)
}

//会员解绑记录
export function unBindingMerchantRecordAdminLog(data: any) {
  return request.post('/ar-manager/unBindingMerchantRecordAdmin/listPage', data)
}


//蚂蚁层级列表
export function getAntMemberInfoList(data: any) {
  return request.post('/ar-manager/antMemberInfoAdmin/getAntMemberInfoList', data)
}
//获取蚂蚁会员等级关系
export function antMemberInfoAdminLevelRelationShip(data: any) {
  return request.post('/ar-manager/antMemberInfoAdmin/levelRelationShip', data)
}
//设置蚂蚁会员分组
export function antMemberInfoAdminSetAntGroup(data: any) {
  return request.post('/ar-manager/antMemberInfoAdmin/setAntGroup', data)
}