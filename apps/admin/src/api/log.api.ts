import request from "./request";
// 获取系统日志
export function getSysLogListPage(data: any) {
  return request.post("/ar-manager/syslog/listPage", data);
}
// 查询白名单分页列表

export function getsysWhiteList(data: any) {
  return request.post("/ar-manager/syswhite/listPage", data);
}
// 创建白名单
export function createWhite(data: any) {
  return request.post("/ar-manager/syswhite/save", data);
}
// 编辑白名单
export function editWhite(data: any) {
  return request.post("/ar-manager/syswhite/update", data);
}

// 删除白名单 
export function delWhite(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/syswhite/del", data, config);
}
// 启用白名单
export function enableWhite(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/syswhite/enable", data, config);
}
// 禁用白名单
export function disableWhite(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/syswhite/disable", data, config);
}
// 创建黑名单
export function createBlack(data: any) {
  return request.post("/ar-manager/tradeIpBlack/save", data);
}
// 获取黑名单
export function getsysBlackList(data: any) {
  return request.post("/ar-manager/tradeIpBlack/listPage", data);
}

// 删除黑名单 
export function delBlack(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post("/ar-manager/tradeIpBlack/del", data, config);
}
// 获取黑名单关联会员列表
export function relationMemberList(data: object) {
  return request.post("/ar-manager/api/v1/memberInfoAdmin/relationMemberList", data);
}

// 获取黑名单关联订单列表
export function relationOrderList(data: object) {
  return request.post("/ar-manager/api/v1/matchingOrderAdmin/relationOrderList", data);
}