import request from "./request";
// 查看配置信息
export function appVersionManagerList() {
  return request.post("/ar-manager/api/v1/appVersionManager/listPage");
}
// 修改配置信息
export function appVersionManagerUpdate(data:any) {
  return request.post("/ar-manager/api/v1/appVersionManager/update",data);
}

// 获取APP信息维护记录
export function getAppInfoPage(data:any) {
  return request.post("/ar-manager/appVersionInfoAdmin/listPage",data);
}
// 新增APP信息维护记录
export function addAppInfo(data:any) {
  return request.post("/ar-manager/appVersionInfoAdmin/add",data);
}
// 更新APP信息维护记录
export function updateAppInfo(data:any) {
  return request.post("/ar-manager/appVersionInfoAdmin/edit",data);
}


// 会员APP信息
export function uploadKycPartnerAdminListPage(data:any) {
  return request.post("/ar-manager/uploadKycPartnerAdmin/adminListPage",data);
}
// 会员APP信息-解除绑定
export function uploadKycPartnerAdminBanFakeApp(data:any) {
  return request.post("/ar-manager/uploadKycPartnerAdmin/banFakeApp",data);
}
// 会员APP信息-开启/关闭定时自动卖出 { newKycId, enabled: 0-不参与 1-参与 }
export function uploadKycPartnerAdminScheduledAutoSell(data:any) {
  return request.post("/ar-manager/api/v1/uploadKycPartnerAdmin/scheduledAutoSell",data);
}

// APP数据收集列表
export function appInfoReportListPage(data:any) {
  return request.post("/ar-manager/appInfoReport/listPage",data);
}
// APP收集会员短信记录
export function appInfoReportMemberSmsListPage(data:any) {
  return request.post("/ar-manager/appInfoReport/memberSms/listPage",data);
}

// 假APP银行KYC Bank Code列表
export function fakeAppKycBankAdminKycBankListPage() {
  return request.post("/ar-manager/fakeAppKycBankAdmin/getBankCodeList");
}
// 假APP银行列表
export function fakeAppKycBankAdminListPage(data:any) {
  return request.post("/ar-manager/fakeAppKycBankAdmin/listPage",data);
}
// 假APP银行列表--新增
export function fakeAppKycBankAdminAdd(data:any) {
  return request.post("/ar-manager/fakeAppKycBankAdmin/addFakeAppKycBank",data);
}
// 假APP银行列表--更新
export function fakeAppKycBankAdminUpdate(data:any) {
  return request.post("/ar-manager/fakeAppKycBankAdmin/updateFakeAppKycBank",data);
}
// 假APP银行列表--删除
export function fakeAppKycBankAdminDelete(data:any) {
  return request.post("/ar-manager/fakeAppKycBankAdmin/deleteFakeAppKycBank",data);
}
// 假APP银行列表--修改开关状态
export function fakeAppKycBankAdminUpdateControlSwitch(data:any) {
  return request.post("/ar-manager/fakeAppKycBankAdmin/updateControlSwitch",data);
}
// 假APP银行开关日志列表
export function fakeAppKycBankControlSwitchLogAdminListPage(data:any) {
  return request.post("/ar-manager/fakeAppKycBankControlSwitchLogAdmin/listPage",data);
}

// 假APP银行开关日志列表--新增
export function fakeAppKycBankControlSwitchLogAdminAdd(data:any) {
  return request.post("/ar-manager/fakeAppKycBankAdmin/updateControlSwitch",data);
}



// 假APP黑名单管理列表
export function fakeAppBanRecordAdminListPage(data:any) {
  return request.post("/ar-manager/fakeAppBanRecordAdmin/listPage",data);
}
// 假APP黑名单管理-启用
export function fakeAppBanRecordAdminUnbanFakeApp(data:any) {
  return request.post("/ar-manager/fakeAppBanRecordAdmin/unbanFakeApp",data);
}

// 假APP登陆失败记录
export function uploadKycPartnerAdminUploadKycLoginFailureRecords(data:any) {
  return request.post("/ar-manager/uploadKycPartnerAdmin/uploadKycLoginFailureRecords",data);
}
// 假APP行为日志
export function uploadKycPartnerBehaviorLogPage(data:any) {
  return request.post("/ar-manager/api/v1/uploadKycPartnerAdmin/behaviorLogPage",data);
}