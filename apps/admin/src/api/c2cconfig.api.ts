import request from "./request";
import { withEncryptedPwd } from "@/utils/rsa";
// 查看配置信息
// export function addUserApi() {
//   return request.post("/ar-manager/api/v1/c2cConfigdetaill");
// }

// 获取usdt管理列表
export function getUsdtConfigList(data: any) {
  return request.post("/ar-manager/api/v1/usdtConfigAdmin/listpage", data);
}

// 新建usdt管理
export function createUsdtConfigAdmin(data: any) {
  return request.post("/ar-manager/api/v1/usdtConfigAdmin/create", data);
}
// 编辑usdt管理
export function editUsdtConfigAdmin(data: any) {
  return request.post("/ar-manager/api/v1/usdtConfigAdmin/update", data);
}
// 编辑usdt管理
export function delUsdtConfigAdmin(data: any) {
  return request.post("/ar-manager/api/v1/usdtConfigAdmin/delete", data);
}
// 修改usdt状态
export function changeStatusUsdtConfigAdmin(data: any) {
  return request.post("/ar-manager/api/v1/usdtConfigAdmin/changeStatus", data);
}

// 获取参数配置
export function getConfigApi() {
  return request.post("/ar-manager/api/v1/tradeConfigAdmin/detaill", { id: 1 });
}

// 设置买入参数配置
export function updateBuyApi(data: any) {
  return request.post("/ar-manager/tradeConfigAdmin/updateBuy", data);
}

// 获取买入参数买入取消/失败配置
export function getBuyLimitList() {
  return request.post("/ar-manager/buyLimitConfig/getBuyLimitList");
}

// 设置买入参数买入取消/失败配置
export function batchUpdateBuyLimit(data: any) {
  return request.post("/ar-manager/buyLimitConfig/batchUpdateBuyLimit", data);
}

// 设置卖出参数配置
export function updateSellApi(data: any) {
  return request.post("/ar-manager/tradeConfigAdmin/updateSell", data);
}
// 设置蚂蚁参数配置
export function updateAntConfig(data: any) {
  return request.post("/ar-manager/tradeConfigAdmin/updateAntConfig", data);
}
// 设置语音开关配置
export function updateVoiceApi(data: any) {
  return request.post("/ar-manager/tradeConfigAdmin/updateVoiceEnable", data);
}
//设置风控参数配置
export function updateRiskConfigApi(data: any) {
  return request.post("/ar-manager/tradeConfigAdmin/updateRiskConfig", data);
}
// 平台参数配置操作日志列表
export function tradeConfigOperationLogListPage(data: any) {
  return request.post("/ar-manager/tradeConfigAdmin/operationLog/listPage", data);
}
// 平台参数配置操作日志导出
export function tradeConfigOperationLogExport(data: any) {
  return request.post("/ar-manager/tradeConfigAdmin/operationLog/export", data);
}

// 查询充值取消原因列表
export function cancellationRechargeListApi(data: any) {
  return request.post("/ar-manager/api/v1/cancellationRecharge/listpage", data);
}

// 添加充值取消原因
export function cancellationRechargeCreateApi(data: any) {
  return request.post("/ar-manager/cancellationRecharge/create", data);
}

// 编辑充值取消原因
export function cancellationRechargeUpdateApi(data: any) {
  return request.post("/ar-manager/cancellationRecharge/update", data);
}

// 删除充值取消原因
export function cancellationRechargeDelApi(data: any) {
  return request.post("/ar-manager/cancellationRecharge/delete", data);
}

// 查询出款取消原因列表
export function cancellationWithdrawalListApi(data: any) {
  return request.post("/ar-manager/withdrawalCancellation/listpage", data);
}

// 添加出款取消原因列表
export function cancellationWithdrawalCreateApi(data: any) {
  return request.post("/ar-manager/withdrawalCancellation/create", data);
}

// 编辑出款取消原因列表
export function cancellationWithdrawalUpdateApi(data: any) {
  return request.post("/ar-manager/withdrawalCancellation/update", data);
}

// 删除出款取消原因
export function cancellationWithdrawalDelApi(data: any) {
  return request.post("/ar-manager/withdrawalCancellation/delete", data);
}

// 获取banner数据
export function getBannerLit(data: any) {
  return request.post("/ar-manager/banner/listBanners", data);
}
// 新增banner数据
export function addBanner(data: any) {
  return request.post("/ar-manager/banner/createBanner", data);
}
// 修改banner数据
export function editBanner(id: any, data: any) {
  return request.post("/ar-manager/banner/updateBanner/" + id, data);
}
// 禁用banner
export function disableBanner(data: any) {
  return request.post("/ar-manager/banner/disable/" + data.id);
}
// 启用banner
export function enableBanner(data: any) {
  return request.post("/ar-manager/banner/enable/" + data.id);
}
// 删除banner
export function delBanner(data: any) {
  return request.delete("/ar-manager/banner/" + data.id);
}

// 获取公告数据
export function getAnnouncementLit(data: any) {
  return request.post("/ar-manager/announcement/listAnnouncements", data);
}
// 新增公告数据
export function addAnnouncement(data: any) {
  return request.post("/ar-manager/announcement/createAnnouncement", data);
}
// 修改公告数据
export function updateAnnouncement(id: any, data: any) {
  return request.post(
    "/ar-manager/announcement/updateAnnouncement/" + id,
    data
  );
}
// 禁用公告数据
export function disableAnnouncement(data: any) {
  return request.post("/ar-manager/announcement/disable/" + data.id);
}
// 启用公告数据
export function enableAnnouncement(data: any) {
  return request.post("/ar-manager/announcement/enable/" + data.id);
}
// 删除公告数据
export function delAnnouncement(data: any) {
  return request.delete("/ar-manager/announcement/" + data.id);
}
// 获取公告链接
export function getAnnouncementLink(data: any) {
  return request.get(
    "/ar-manager/announcement/fetchAnnouncementLinkById/" + data.id
  );
}


// 获取活动内容数据
export function activitytLit(data: any) {
  return request.post("/ar-manager/manager/activity/list", data);
}
// 新增活动内容数据
export function activitySave(data: any) {
  return request.post("/ar-manager/manager/activity/save", data);
}
// 修改活动内容数据
export function activityUpdate(data: any) {
  return request.post("/ar-manager/manager/activity/update", data);
}
// 删除活动内容数据
export function activityDelete(id: any) {
  return request.post("/ar-manager/manager/activity/delete/"+id);
}


// 获取收银台广告位列表
export function cashierAdList(data: any) {
  return request.post("/ar-manager/cashierAdvertisement/listPage", data);
}
// 添加收银台广告位
export function cashierAdAdd(data: any) {
  return request.post("/ar-manager/cashierAdvertisement/create", data);
}
// 更新收银台广告位
export function cashierAdUpdate(id: any, data: any ) {
  console.log(data, id);
  return request.post("/ar-manager/cashierAdvertisement/update/" + id, data);
}
// 收银台广告位详情
export function cashierAdDetail(id: any) {
  return request.get("/ar-manager/cashierAdvertisement/" + id);
}
// 删除收银台广告位
export function cashierAdDel(id: any) {
  return request.delete("/ar-manager/cashierAdvertisement/" + id);
}
// 获取运营参数配置内容
export function tradeConfigSchemeAdmin(data: any) {
  return request.post(
    "/ar-manager/api/v1/tradeConfigSchemeAdmin/listPage",
    data
  );
}

// 更新运营参数配置
export function tradeConfigSchemeAdminUpdate(data:any) {
  return request.post('/ar-manager/api/v1/tradeConfigSchemeAdmin/updateScheme', data)
}

// 获取任务规则内容
export function taskRulesContentAdminCon() {
  return request.post('/ar-manager/api/v1/taskRulesContentAdmin/detail')
}
// 更新任务规则内容
export function taskRulesContentAdminUpdate(data:any) {
  return request.post('/ar-manager/api/v1/taskRulesContentAdmin/updateContent', data)
}

// 获取等级规则内容
export function levelContentAdminDetail() {
  return request.get('/ar-manager/levelContentAdmin/detail')
}
// 更新等级规则内容
export function levelContentAdminUpdate(data:any) {
  return request.post('/ar-manager/levelContentAdmin/updateContent', data)
}

// 获取任务管理列表
export function taskManagerAdminIistPage(data:any) {
  return request.post('/ar-manager/api/v1/taskManagerAdmin/listPage', data)
}
// 新建任务
export function taskManagerAdminCreateTask(data:any) {
  return request.post('/ar-manager/api/v1/taskManagerAdmin/createTask', data)
}
// 删除任务
export function taskManagerAdminDeleteTask(data:any) {
  return request.post('/ar-manager/api/v1/taskManagerAdmin/deleteTask', data)
}
// 更新任务
export function taskManagerAdminUpdateTask(data:any) {
  return request.post('/ar-manager/api/v1/taskManagerAdmin/updateTask', data)
}
// 获取任务详情
export function taskManagerAdminTaskDetail(data:any) {
  return request.post('/ar-manager/api/v1/taskManagerAdmin/taskDetail', data)
}
// 获取开关列表
export function controlSwitchAdminList(data:any) {
  return request.post('/ar-manager/api/v1/controlSwitchAdmin/listPage', data)
}
// 开启/关闭开关
export function updateControlSwitchStatus(data:any) {
  return request.post('/ar-manager/api/v1/controlSwitchAdmin/updateControlSwitchStatus', data)
}
// 更新运营参数配置
export function taskCollectionRecordListPage(data: {
  asc?: boolean;
  column?: string;
  frequency?: string;
  merchantName?: string;
  pageNo: number;
  pageSize: number;
  taskName?: string;
  taskType?: string;
  userId?: string;
  receiveStartTime?: string;
  receiveEndTime?: string;
  completeStartTime?: string;
  completeEndTime?: string;
}) {
  return request.post("/ar-manager/api/v1/taskCollectionRecord/listPage", data);
}

// 获取会员领取统计数据
export function getStatisticsData() {
  return request.post("/ar-manager/api/v1/taskCollectionRecord/getStatisticsData");
}

// 获取预警配置控制器
export function earlyWarningConfigAdminDetail(data:Object) {
  return request.post("/ar-manager/api/v1/tradeConfigAdmin/warningConfigDetail",data);
}

// 更新预警配置控制器
export function earlyWarningConfigAdminUpdate(data:Object) {
  return request.post("/ar-manager/api/v1/tradeConfigAdmin/updateWarningConfig",data);
}

// 获取客服系统名称
export function getCustomerServiceTypes() {
  return request.get("/ar-manager/customerService/getCustomerServiceTypes");
}
// 获取客服系统列表
export function getCustomerServiceList(data:Object) {
  return request.post("/ar-manager/customerService/getCustomerServiceList",data);
}
// 新增客服系统
export function createCustomerServiceSystems(data:Object) {
  return request.post("/ar-manager/customerService/createCustomerServiceSystems",data);
}
// 修改客服系统
export function updateCustomerServiceSystems(id:number,data:Object) {
  return request.post("/ar-manager/customerService/updateCustomerServiceSystems/"+id,data);
}
// 删除客服系统
export function deleteCustomerServiceSystems(id:number) {
  return request.delete("/ar-manager/customerService/"+id);
}
// 禁用客服系统
export function disableCustomerServiceSystems(id:number) {
  return request.post("/ar-manager/customerService/disable/"+id);
}
// 启用客服系统
export function enableCustomerServiceSystems(id:number) {
  return request.post("/ar-manager/customerService/enable/"+id);
}

// 获取银行字典列表
export function bankInfoAdminListPage(data:any) {
  return request.post('/ar-manager/api/v1/bankInfoAdmin/listPage', data)
}
// 新增银行字典
export function addBankInfoAdmin(data:any) {
  return request.post('/ar-manager/api/v1/bankInfoAdmin/add', data)
}
// 修改银行字典
export function bankInfoAdminUpdate(data:any) {
  return request.post('/ar-manager/api/v1/bankInfoAdmin/update', data)
}
// 开启/关闭银行字典
export function bankInfoAdminUpdateStatus(data:any) {
  return request.post('/ar-manager/api/v1/bankInfoAdmin/updateStatus', data)
}
// 删除银行字典
export function bankInfoAdminDeleteInfo(data:any) {
  return request.post('/ar-manager/api/v1/bankInfoAdmin/deleteInfo', data)
}
// 获取IM客服账号列表
export function customerServiceAgentsListPage(data:any) {
  return request.post('/ar-manager/customerServiceAgents/listPage', data)
}
// 新增IM客服账号：password 组装 pwd=&nonce= 后 RSA 加密传输，字段名不变
export function customerServiceAgentsAdd(data:any) {
  return request.post('/ar-manager/customerServiceAgents/add', withEncryptedPwd(data, ['password']))
}
// 编辑IM客服账号：password 组装 pwd=&nonce= 后 RSA 加密传输，字段名不变（仅改状态时不带密码，原样透传）
export function customerServiceAgentsUpdate(data:any) {
  return request.post('/ar-manager/customerServiceAgents/update', withEncryptedPwd(data, ['password']))
}

// 买卖奖励配置列表
export function getRewardConfigList(data:any) {
  return request.post('/ar-manager/buySellRewardConfigForAdmin/listPage', data)
}
// 新增买卖奖励配置
export function createRewardConfig(data:any) {
  return request.post('/ar-manager/buySellRewardConfigForAdmin/save', data)
}
// 编辑买卖奖励配置
export function updateRewardConfig(data:any) {
  return request.post('/ar-manager/buySellRewardConfigForAdmin/update', data)
}
// 结束买卖奖励配置
export function endRewardConfig(id:any) {
  return request.post('/ar-manager/buySellRewardConfigForAdmin/stopReward/'+id)
}
// 导出列表
export function excelExportLogAdminListPage(data:any) {
  return request.post('/ar-manager/excelExportLogAdmin/listPage',data)
}
// 代理端口配置列表
export function getProxyPortRelationList(data:any) {
  return request.post('/ar-manager/proxyPortRelationAdmin/getProxyPortRelationList',data)
}
// 新增代理端口配置
export function proxyPortRelationAdd(data:any) {
  return request.post('/ar-manager/proxyPortRelationAdmin/add',data)
}
// 修改代理端口配置
export function proxyPortRelationUpdate(data:any) {
  return request.post('/ar-manager/proxyPortRelationAdmin/update',data)
}
// 获取蚂蚁配置-金额范围配置
export function getAntConfigRangeList() {
  return request.get('/ar-manager/amountRangeConfigAdmin/amountRangeConfigs')
}
//编辑蚂蚁配置-金额范围配置
export function updateAntConfigRange(data:any) {
  return request.post('/ar-manager/amountRangeConfigAdmin/updateAmountRangeConfig', data)
}
//获取任务事件列表
export function taskEventConfigAdminList(data:any) {
  return request.post('/ar-manager/taskEventConfigAdmin/listPage', data)
}

//任务事件状态更改
export function taskEventConfigAdminEdit(data:any) {
  return request.post('/ar-manager/taskEventConfigAdmin/edit', data)
}

// 获取群组管理列表
export function roborManagementListMarquees(data: any) {
  return request.post("/ar-manager/telegramGroupAdmin/page", data);
}

// 新增组管理列表
export function addMerchantBindBot(data: any) {
  return request.post("/ar-manager/telegramGroupAdmin/saveTelegramGroup", data);
}
// 编辑组管理列表
export function updateMerchantBindBot( data: any) {
  return request.post("/ar-manager/telegramGroupAdmin/updateTelegramGroup", data);
}
// 删除组管理列表
export function delMerchantBindBot(id: any) {
  return request.get("/ar-manager/telegramGroupAdmin/delete/"+id);
}
// 启用列表状态
export function telegramGroupAdminEnable(id: any) {
  return request.get("/ar-manager/telegramGroupAdmin/enable/"+id);
}
// 禁用列表状态
export function telegramGroupAdminDisable(id: any) {
  return request.get("/ar-manager/telegramGroupAdmin/disable/"+id);
}

// // 查询首页弹窗内容
// export function frontPageConfigList() {
//   return request.post('/ar-manager/api/v1/frontPageConfig/listPage')
// }
// // 修改首页弹窗内容
// export function frontPageConfigUpdate(data:any) {
//   return request.post('/ar-manager/api/v1/frontPageConfig/update', data)
// }
// 获取首页弹窗列表
export function frontPageConfigList() {
  return request.post("/ar-manager/frontPageConfig/listPage");
}
// 新增首页弹窗
export function frontPageConfigSave(data: any) {
  return request.post("/ar-manager/frontPageConfig/saveInfo", data);
}
// 修改首页弹窗
export function frontPageConfigUpdate(data: any) {
  return request.post("/ar-manager/frontPageConfig/update", data);
}
// 删除首页弹窗
export function frontPageConfigDelete(id: any) {
  return request.post("/ar-manager/frontPageConfig/delete/"+id);
}
// 奖励卡配置列表
export function rewardCardConfigAdminListPage(data: any) {
  return request.post("/ar-manager/rewardCardConfigAdmin/listPage", data);
}
// 新增奖励卡配置
export function rewardCardConfigAdminSave(data: any) {
  return request.post("/ar-manager/rewardCardConfigAdmin/save", data);
}
// 更新奖励卡配置
export function rewardCardConfigAdminUpdate(data: any) {
  return request.post("/ar-manager/rewardCardConfigAdmin/update", data);
}
// 启用、禁用奖励卡配置
export function rewardCardConfigAdminUpdateStatus(data: any) {
  return request.post("/ar-manager/rewardCardConfigAdmin/updateStatus", data);
}
// 奖励卡记录列表
export function rewardCardUsageRecordAdminListPage(data: any) {
  return request.post("/ar-manager/rewardCardUsageRecordAdmin/listPage", data);
}
// 奖励卡记录列表-解冻
export function rewardCardUsageRecordAdminUnFrozen(data: any) {
  return request.post("/ar-manager/rewardCardUsageRecordAdmin/unFrozen", data);
}
// 奖励卡记录列表-冻结/解冻
export function rewardCardUsageRecordAdminUpdateFrozenFlag(data: any) {
  return request.post("/ar-manager/rewardCardUsageRecordAdmin/updateFrozenFlag", data);
}
// 导出列表-导出
export function excelExportLogAdminGetExportUrl(data: any) {
  return request.post("/ar-manager/excelExportLogAdmin/getExportUrl", data);
}
// 导出列表-中断
export function excelExportLogAdminInterruptExport(data: any) {
  return request.post("/ar-manager/excelExportLogAdmin/interruptExport", data);
}
// 域名配置列表
export function domainConfigAdminListPage(data: any) {
  return request.post("/ar-manager/domainConfigAdmin/listPage", data);
}
// 域名配置列表-新增
export function domainConfigAdminSaveDomainConfig(data: any) {
  return request.post("/ar-manager/domainConfigAdmin/saveDomainConfig", data);
}
// 域名配置列表-修改
export function domainConfigAdminUpdateDomainConfig(data: any) {
  return request.post("/ar-manager/domainConfigAdmin/updateDomainConfig", data);
}

// IFSC配置-分页查询
export function ifscBankNameAdminListPage(data: any) {
  return request.post("/ar-manager/ifscBankNameAdmin/listPage", data);
}
// IFSC配置-新增
export function ifscBankNameAdminAdd(data: any) {
  return request.post("/ar-manager/ifscBankNameAdmin/add", data);
}
// IFSC配置-修改（仅银行名称）
export function ifscBankNameAdminUpdate(data: any) {
  return request.post("/ar-manager/ifscBankNameAdmin/update", data);
}
// IFSC配置-删除
export function ifscBankNameAdminDelete(data: any) {
  return request.post("/ar-manager/ifscBankNameAdmin/delete", data);
}
// IFSC配置-下载CSV导入模板（返回文件流）
export function ifscBankNameAdminExportTemplate() {
  return request.post("/ar-manager/ifscBankNameAdmin/exportTemplate", {}, { responseType: "blob" });
}
// IFSC配置-上传预校验（multipart，字段 file）
export function ifscBankNameAdminValidateImport(data: FormData) {
  return request({
    method: "post",
    maxBodyLength: Infinity,
    url: "/ar-manager/ifscBankNameAdmin/validateImport",
    data,
  });
}
// IFSC配置-确认导入
export function ifscBankNameAdminConfirmImport(data: any) {
  return request.post("/ar-manager/ifscBankNameAdmin/confirmImport", data);
}
