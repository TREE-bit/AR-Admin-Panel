import request from './request'
// 创建角色
export function addRole(data: any) {
  return request.post('/ar-manager/role', data)
}
// 修改菜单
export function editRole(data: any) {
  return request.put('/ar-manager/role', data)
}
// 删除菜单
export function delRole(ids: any) {
  return request.delete(`/ar-manager/role/${ids}`)
}
// 获取角色列表
export function getRoleListPage(data: any) {
  return request.post('/ar-manager/role/listPage', data)
}

