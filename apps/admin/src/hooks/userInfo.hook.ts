import { computed, reactive } from 'vue'
import { toTree, useStorage } from '@ar/shared'
import { AUTH_MENU } from './constants'
import { MenuItemSchema, UserMenu } from '@/api'
import { isPrototype } from '@/prototype/env'
import { buildPrototypeMenus } from '@/prototype/menus'
interface Store {
  menus: MenuItemSchema[]
  menuTree: any[]
}
const store = reactive<Store>({
  menus: [],
  menuTree: [],
})
const toMenus = (data: MenuItemSchema[]) => {
  return data.map(({ icon, id, name,path, parentId, sort }) => ({
    icon,
    label: name,
    title: name,
    key: path.split('/').join('_'),
    parentId,
    sort,
    id,
  }))
}
export function userInfo() {
  const { localStore } = useStorage()
  const menuList = computed(() => store.menus)
  const dirTree = computed(() => toTree(store.menus.filter(({ visible }) => visible == 1)))
  const menuTreeList = computed(() => store.menuTree)
  const format = (menus: MenuItemSchema[]) => {
    store.menus = menus
    const menuTrees = toMenus(store.menus.filter(({ visible }) => visible === 1))
    store.menuTree = toTree(menuTrees).sort((a, b) => b.sort - a.sort)
  }
  const getToken = () => {
    return localStorage.getItem('token')
  }
  const token = computed(getToken)
  const loginOut = () => {
    localStorage.removeItem('token')
  }
  const getMenus = async () => {
    if (isPrototype) {
      const menus = buildPrototypeMenus()
      format(menus)
      localStore.set(AUTH_MENU, menus, 5)
      return 'success'
    }
    const { data } = await UserMenu()
    const menus = data || []
    format(menus)
    localStore.set(AUTH_MENU, menus, 5)
    return 'success'
  }
  return {
    getToken,
    getMenus,
    loginOut,
    menuList,
    menuTreeList,
    dirTree,
    token,
  }
}
