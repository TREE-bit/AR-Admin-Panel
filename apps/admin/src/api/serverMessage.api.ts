import request from './request'


// 获取系统消息列表 
export function getSysMessageList(data: any) {
  return request.post('/ar-manager/api/v1/sysMessage/listPage', data)
}
// 删除系统消息
export function delSysMessage(data: any) {
  return request.post('/ar-manager/api/v1/sysMessage/deleted', data)
}
// 已读系统消息
export function readSysMessage(data: any) {
  return request.post('/ar-manager/api/v1/sysMessage/read', data)
}
// 一键已读系统消息
export function readAllSysMessage() {
  return request.post('/ar-manager/api/v1/sysMessage/allRead')
}
// 一键清空系统消息
export function clearAllSysMessage() {
  return request.post('/ar-manager/api/v1/sysMessage/clearAll')
}