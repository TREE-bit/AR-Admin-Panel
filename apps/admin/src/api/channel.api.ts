import { h } from 'vue';
import request from './request'


// 获取支付通道列表 
export function payConfigAdminListConfig(data: any) {
  return request.post('/ar-manager/payConfigAdmin/listConfigPage', data)
}
// 新增支付通道列表 
export function addListConfig(data: any) {
  return request.post('/ar-manager/payConfigAdmin/add', data)
}
// 修改支付通道列表 
export function updateListConfig(data: any) {
  return request.post('/ar-manager/payConfigAdmin/update', data)
}
// 获取代收代付配置列表
export function paytypeinfoList(data: any) {
  return request.post('/ar-manager/paytypeinfo/list',data)
}
// 新增代收代付配置列表
export function paytypeinfoAdd(data: any) {
  return request.post('/ar-manager/paytypeinfo/save',data)
}
// 修改代收代付配置列表
export function paytypeinfoUpdate(data: any) {
  return request.post('/ar-manager/paytypeinfo/update',data)
}
// 获取统计列表
export function thirdChannelListPage(data: any) {
  return request.post('/ar-manager/buySellReport/channelReportByDate',data)
}

// 获取三方支付信息
export function thirdPayInfoAdminListPage(data: any) {
  return request.post('/ar-manager/thirdPayInfoAdmin/listPage',data)
}
// 获取三方编码
export function getThirdCodeList() {
  return request.get('/ar-manager/thirdPayInfoAdmin/thirdCodeList')
}
// 新增三方支付
export function thirdPayInfoAdminAdd(data: any) {
  return request.post('/ar-manager/thirdPayInfoAdmin/add',data)
}
// 更新三方支付
export function thirdPayInfoAdminUpdate(data: any) {
  return request.post('/ar-manager/thirdPayInfoAdmin/update',data)
}
// 获取三方支付统计列表
export function thirdPayInfoAdminStatisticalInfo(data: any) {
  return request.post('/ar-manager/thirdPayInfoAdmin/statisticalInfo',data)
}

// 保存三方支付通道-代收付
export function thirdPayChannelConfigAdminAdd(data: any) {
  return request.post('/ar-manager/thirdPayChannelConfigAdmin/add',data)
}
// 更新三方支付通道-代收付
export function thirdPayChannelConfigAdminUpdate(data: any) {
  return request.post('/ar-manager/thirdPayChannelConfigAdmin/update',data)
}
// 调整三方余额
export function adjustThirdPartyBalance(data: any) {
  return request.post('/ar-manager/thirdPayInfoAdmin/adjustThirdPartyBalance',data)
}
// 获取支付通道账变列表
export function channelAccountChangeAdminList(data: any) {
  return request.post('/ar-manager/channelAccountChangeAdmin/listPage',data)
}
// 获取通道代收订单列表
export function channelCollectionOrderAdminList(data: any) {
  return request.post('/ar-manager/channelCollectionOrderAdmin/listPage',data)
}
// 获取通道代收回调日志列表
export function thirdPayCallbackLogAdminList(data: any) {
  return request.post('/ar-manager/thirdPayCallbackLogAdmin/listPage',data)
}



