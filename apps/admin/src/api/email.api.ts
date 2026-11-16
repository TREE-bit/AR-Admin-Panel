import request from "./request";

// 获取邮件模板列表
export function emailTemplateAdminList(data: any) {
  return request.post("/ar-manager/emailTemplateAdmin/listPage", data);
}
// 编辑邮件模板
export function emailTemplateAdminEdit(data: any) {
  return request.post("/ar-manager/emailTemplateAdmin/edit", data);
}
// 获取APP推送模板列表
export function appPushTemplateAdminList(data: any) {
  return request.post("/ar-manager/appPushTemplateAdmin/listPage", data);
}
// 编辑APP推送模板
export function appPushTemplateAdminEdit(data: any) {
  return request.post("/ar-manager/appPushTemplateAdmin/updateTemplate", data);
}

// 获取邮件账号管理列表
export function mailAccountConfigAdminPage(data: any) {
  return request.post("/ar-manager/mailAccountConfigAdmin/page", data);
}
// 新增邮件账号管理
export function mailAccountConfigAdminSave(data: any) {
  return request.post("/ar-manager/mailAccountConfigAdmin/save", data);
}
// 修改邮件账号管理
export function mailAccountConfigAdminUpdate(data: any) {
  return request.post("/ar-manager/mailAccountConfigAdmin/update", data);
}
// 删除邮件账号管理
export function mailAccountConfigAdminRemove(id: any) {
  return request.post("/ar-manager/mailAccountConfigAdmin/remove/"+id);
}
//获取推送模板
export function getPushTemplateAdminList(data: any) {
  return request.post("/ar-manager/pushTemplateAdmin/listPage", data);
}
//编辑推送模板
export function editPushTemplateAdmin(data: any) {
  return request.post("/ar-manager/pushTemplateAdmin/updatePushTemplate", data);
}
//获取推送方式列表
export function pushMannerAdminList(data: any) {
  return request.post("/ar-manager/pushMannerAdmin/listPage", data);
}
//编辑推送方式
export function pushMannerAdminUpdate(data: any) {
  return request.post("/ar-manager/pushMannerAdmin/updatePushManner", data);
}
//获取群发对象数量
export function getMailAccountConfigAdminCount(num: any) {
  return request.post("/ar-manager/mailAccountConfigAdmin/onlineMemberCount/"+num);
}
//获取app推送渠道管理
export function appPushChannelAdminList() {
  return request.post("/ar-manager/appPushChannelAdmin/listPage");
}
//启用app推送渠道
export function appPushChannelAdminUpdate(data: any) {
  return request.post("/ar-manager/appPushChannelAdmin/updateAppPushChannel", data);
}