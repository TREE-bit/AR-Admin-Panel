import request from './request'


// 获取工单列表
export function workOrderRecordListPage(data: any) {
  return request.post('/ar-manager/api/v1/workOrderRecord/listPage', data)
}
// 获取工单详情
export function workOrderRecordGetOrderRecordDetail(data: any) {
  return request.post('/ar-manager/api/v1/workOrderDetail/getOrderRecordDetail', data)
}
// 工单转单流程操作
export function workOrderRecordTransitionWorkOrder(data: any) {
  return request.post('/ar-manager/api/v1/workOrderRecord/transitionWorkOrder', data)
}
// 判断登录用户是否有操作权限
export function getOperatorAuthority(data: any) {
  return request.post('/ar-manager/api/v1/workOrderRecord/getOperatorAuthority', data)
}
// 获取工单状态数据
export function workOrderRecordGetWorkOrderProcessPendingStatistics() {
  return request.post('/ar-manager/api/v1/workOrderRecord/getWorkOrderProcessPendingStatistics')
}

// 获取工单配置列表
export function workOrderConfigListPage(data: any) {
  return request.post('/ar-manager/api/v1/workOrderConfig/listPage', data)
}
// 新增工单配置
export function workOrderConfigSave(data: any) {
  return request.post('/ar-manager/api/v1/workOrderConfig/save', data)
}
// 编辑工单配置
export function workOrderConfigUpdate(data: any) {
  return request.post('/ar-manager/api/v1/workOrderConfig/update', data)
}
// 删除工单配置
export function workOrderConfigDelete(data: any) {
  return request.post('/ar-manager/api/v1/workOrderConfig/delete', data)
}
// 启用/禁用工单配置
export function workOrderConfigUpdateStatus(data: any) {
  return request.post('/ar-manager/api/v1/workOrderConfig/updateStatus', data)
}
// 获取工单权限列表
export function workOrderPermissionListPage(data: any) {
  return request.post('/ar-manager/api/v1/workOrderPermission/listPage', data)
}
// 新增工单权限
export function workOrderPermissionSave(data: any) {
  return request.post('/ar-manager/api/v1/workOrderPermission/save', data)
}
// 删除工单权限
export function workOrderPermissionDelete(data: any) {
  return request.post('/ar-manager/api/v1/workOrderPermission/delete', data)
}
// 获取工单操作历史列表
export function workOrderConfigOperationHistoryListPage(data: any) {
  return request.post('/ar-manager/api/v1/workOrderConfigOperationHistory/listPage', data)
}
// 获取工单类型列表
export function workOrderTypeConfigListPage() {
  return request.get('/ar-manager/api/v1/workOrderTypeConfig/list')
}
// 新增、更新工单类型
export function workOrderTypeConfigSaveOrUpdate(data: any) {
  return request.post('/ar-manager/api/v1/workOrderTypeConfig/saveOrUpdate', data)
}
// 删除工单类型
export function workOrderTypeConfigDelete(data: any) {
  return request.post('/ar-manager/api/v1/workOrderTypeConfig/delete', data)
}
// 批量转移工单
export function workOrderRecordBatchTransferWorkOrders(data: any) {
  return request.post('/ar-manager/api/v1/workOrderRecord/batchTransferWorkOrders', data)
}
// 批量锁定工单
export function workOrderRecordBatchLockWorkOrders(data: any) {
  return request.post('/ar-manager/api/v1/workOrderRecord/batchLockWorkOrders', data)
}