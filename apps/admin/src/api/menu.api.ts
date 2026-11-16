import request from "./request";
import { LoginSchema, MenusSchema, ResultSchema } from "./model";
// 创建菜单
export function addMenu(data: LoginSchema) {
  return request.post("/ar-manager/menu", data);
}
// 修改菜单
export function editMenu(data: LoginSchema) {
  return request.put("/ar-manager/menu", data);
}
// 删除菜单
export function delMenu(ids: LoginSchema) {
  return request.delete(`/ar-manager/menu/${ids}`);
}
// 获取菜单树
export function getMenuTree() {
  return request.post<ResultSchema<MenusSchema>>("/ar-manager/menu/listTree");
}
// 获取菜单数据列表

export function getMenuList() {
  return request.post("/ar-manager/menu/list");
}

// 增加按钮权限
export function addPermission(data: any) {
  return request.post("/ar-manager/permission", data);
}
// 更新权限
export function putPermission(data: Object) {
  return request.put("/ar-manager/permission", data);
}
// 删除按钮权限
export function delPermission(ids: string) {
  return request.delete(`/ar-manager/permission/${ids}`);
}

// 获取权限列表
export function getPermissionById(menuId: number) {
  return request.post(`/ar-manager/permission/list/${menuId}`);
}

// 查询角色绑定的菜单
export function inquireMenu(roleId: string) {
  return request.post(`/ar-manager/menu/role/${roleId}`);
}

// 更新角色绑定的菜单
export function updataMenu(roleId: string, data: any) {
  return request.put(`/ar-manager/menu/role/${roleId}`, data);
}
//保存页面列表筛选列
export function savePageTableList(data: any) {
  return request.post("/ar-manager/menu/visibleColumn", data);
}
