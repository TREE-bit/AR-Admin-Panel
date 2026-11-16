import request from './request'


// 获取风控管理会员黑名单列表 
export function getMemberBlackAdmin(data: any) {
  return request.post('/ar-manager/api/v1/memberBlack/listPage', data)
}
// 风控管理会员移出黑名单
export function removeMemberBlackAdmin(data: any) {
  return request.post('/ar-manager/api/v1/memberBlack/removeBlack', data)
}

// 风控用户列表 
export function riskUserHitRecordAdminList(data: any) {
  return request.post('/ar-manager/riskUserHitRecordAdmin/listPage', data)
}
// UPI ID 风控用户列表 
export function upiRiskControlLogAdminList(data: any) {
  return request.post('/ar-manager/upiRiskControlLogAdmin/listPage', data)
}
// 用户解禁日志列表 
export function collectionInfoAdminKycUnbanLog(data: any) {
  return request.post('/ar-manager/collectionInfoAdmin/kycUnbanLog', data)
}
// 异常断连日志
export function disConnectMonitorAdminLog(data: any) {
  return request.post('/ar-manager/disConnectMonitorAdmin/listPage', data)
}
// 银行卡黑名单
export function bankCardBlacklistAdminListPage(data: any) {
  return request.post('/ar-manager/bankCardBlacklistAdmin/listPage', data)
}
// 银行卡黑名单-新增
export function bankCardBlacklistAdminAdd(data: any) {
  return request.post('/ar-manager/bankCardBlacklistAdmin/add', data)
}
// 银行卡黑名单-移除
export function bankCardBlacklistAdminRemoveBlock(data: any) {
  return request.post('/ar-manager/bankCardBlacklistAdmin/removeBlack', data)
}
// 自动开启卖出日志-列表
export function systemAutoSellLogAdminListPage(data: any) {
  return request.post('/ar-manager/api/v1/systemAutoSellLogAdmin/listPage', data)
}
