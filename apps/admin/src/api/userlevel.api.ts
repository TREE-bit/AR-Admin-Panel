import request from './request'


// 获取信用分记录 
export function creditScoreLogsAdminListPageList(data: any) {
  return request.post('/ar-manager/api/v1/creditScoreLogsAdmin/listPage', data)
}
// 获取信用分配置列表
export function creditScoreConfigAdminList(data: any) {
  return request.post('/ar-manager/api/v1/creditScoreConfigAdmin/listPage', data)
}
// 获取信用分信息
export function getCreditScoreInfo(data: any) {
  return request.post('/ar-manager/memberInfoAdmin/getCreditScoreInfo', data)
}
// 更新信用分配置
export function creditScoreConfigAdminUpDate(data: any) {
  return request.post('/ar-manager/api/v1/creditScoreConfigAdmin/updateScore', data)
}
// 获取用户等级配置列表
export function memberLevelConfigList(data: any) {
  return request.post('/ar-manager/api/v1/memberLevelConfig/listPage', data)
}
// 更新用户等级配置
export function memberLevelConfigUpdate(data: any) {
  return request.post('/ar-manager/api/v1/memberLevelConfig/update', data)
}


// 获取用户等级人数列表
export function memberInfoAdminGetLevelNum(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post('/ar-manager/api/v1/memberInfoAdmin/getLevelNum', data, config)
}

// 获取用户指定等级人数列表
export function memberInfoAdminLevelList(data: any) {
  return request.post('/ar-manager/api/v1/memberInfoAdmin/relationMemberList', data)
}

// 获取用户等级变化记录
export function memberLevelChangeList(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post('/ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList', data, config)
}


// 获取福利等级配置
export function memberLevelWelfareConfigList(data: any) {
  return request.post('/ar-manager/api/v1/memberLevelWelfareConfig/listPage', data)
}

// 修改福利等级配置
export function memberLevelWelfareConfigUpdate(data: any) {
  return request.post('/ar-manager/api/v1/memberLevelWelfareConfig/update', data)
}

