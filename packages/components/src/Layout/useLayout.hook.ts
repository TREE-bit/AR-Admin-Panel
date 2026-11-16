import {
  ref,
  provide,
  inject,
  Ref,
  PropType,
  ExtractPropTypes,
  ComputedRef,
  computed,
  reactive,
  nextTick,
} from 'vue'
import { RouteLocation, useRoute, useRouter } from 'vue-router'
import { notification } from 'ant-design-vue'

const layout_provide = Symbol('LAYOUT_PROVIDE')

export const PropsBase = {
  menus: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  menuList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  blackList: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
}

type RouteItem = Required<Omit<RouteLocation, 'matched' | 'redirectedFrom'>> & {
  clickCount?: number
}

export interface ConfigLayout {
  collapsed: Ref<boolean>
  onSwitch: () => void
  goMenu: (item: any) => void
  menus: ComputedRef<any[]>
  menuList: ComputedRef<any[]>
  tabsList: ComputedRef<RouteItem[]>
  getCurrentTab: ComputedRef<RouteItem>
  onTabAction: (targetKey: string, action: string) => void
  removePageCash: (name: string) => void
  setPageCash: (name: string) => void
  clearTabsMenu: () => void
  setClickCount: (route: RouteItem) => void
}

interface Store {
  tabsList: RouteItem[]
}

const store = reactive<Store>({
  tabsList: [],
})
const STORE_ROUTE = 'AR_ROUTE'
const cashList = [
  '/order/assemble/index','/order/matchingPool/index','/kyc/sellTransRes','/kyc/kycBuyAppealRec',
  '/kyc/quickWithdrawal','/kyc/kycManagerV2','/merchant/recharge','/merchant/withdraw',
  '/member/list','/ticket/ticketList','/config/exportList','/kyc/autoTransRes',
];
export function useLayout(prop: ExtractPropTypes<typeof PropsBase>) {
  const router = useRouter()
  const route = useRoute()
  const { blackList } = prop
  const collapsed = ref<boolean>(false)
  const siderWidth = ref<number>(232)
  const onSwitch = () => {
    collapsed.value = !collapsed.value
  }
  const menus = computed(() => prop.menus || [])
  const menuList = computed(() => prop.menuList || [])
  const getCurrentTab = computed(() => {
    const current = store.tabsList.find((item) => {
      return !item.meta?.hideInTabs && item.fullPath === route.fullPath
    })
    return current || {}
  })
  const tabsList = computed(() => {
    const map = new Map(store.tabsList.map(i => [i.path, i]))
    return Array.from(map.values())
  })
  
  const goMenu = async (data: Record<any, any>) => {
    // ant-design-vue 有时给字符串 key，菜单 id 可能是数字，这里统一成字符串再找
    const menuItem = menuList.value.find((item) => String(item.id) === String(data.key))
    const pathTo = menuItem?.redirect || menuItem?.path || data.item?.path
    if (!pathTo) {
      return notification.error({
        message: '路由提醒',
        description: `未找到菜单路径: ${data.key}`,
        placement: 'bottomLeft',
      })
    }
    setClickCount(pathTo);
    if (pathTo.startsWith('http')) return window.open(pathTo)
    const name = pathTo.split('/').join('_')
    if (!router.hasRoute(name)) {
      return notification.error({
        message: '路由提醒',
        description: `${data.item?.title || pathTo} 不存在该路由:${pathTo} `,
        placement: 'bottomLeft',
      })
    }else{
      removePageCash(name);
    }
      // console.log('data.key',data.key)
    await router.push({ name: name })
  }
  const getSimpleRoute = (route:RouteLocation): RouteItem => {
    const { fullPath, hash, meta, name, params, path, query } = route
    return { fullPath, hash, meta, name, params, path, query }
  }

  const addTabs = (route: RouteItem) => {
    if (blackList.includes(route.name as string)) return false
    const isExists = store.tabsList.some((item) => item.fullPath == route.fullPath)
    if (!isExists) {
      store.tabsList.push({
        ...route,
        clickCount: 0,   // 记录点击频率
      })
      // console.log(route)
    }
    return true
  }
  const setClickCount = (key) => {
    const tab = store.tabsList.find(i => i.fullPath == key)
    if (tab) {
      tab.clickCount = (tab.clickCount || 0) + 1
    }

    store.tabsList.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    console.log('setClickCount', store.tabsList)
  }
  const setLocal = () => {
    localStorage.setItem(STORE_ROUTE, JSON.stringify(store.tabsList))
  }
  const intLocal = () => {
    const str = localStorage.getItem(STORE_ROUTE)
    try {
      if (!str) return
      store.tabsList = JSON.parse(str)
    } catch (_e) {}
  }
  const closeCurrentTab = async (route: RouteItem) => {
    const index = store.tabsList.findIndex((item) => item.fullPath === route.fullPath)
    const isDelCurrentTab = Object.is(getCurrentTab.value, store.tabsList[index])
    store.tabsList.splice(index, 1)
    await nextTick()
    if (isDelCurrentTab) {
      const currentRoute = store.tabsList[Math.max(0, store.tabsList.length - 1)]
      await router.push(currentRoute)
    }
    setLocal()
  }
  const onTabAction = async (targetKey: string, action: string) => {
    if (action !== 'remove') return
    if (tabsList.value.length === 1) return
    const route = tabsList.value.find((item) => item.fullPath == targetKey)
    if (!route) return
    await closeCurrentTab(route)
  }
  const setPageCash = (name: string) => {
    if(cashList.indexOf(name) != -1) {
      const cashPageList = JSON.parse(sessionStorage.getItem('AR_PAGE_CASH') || '[]')
      if(cashPageList.findIndex((item:any) => item == name) == -1) {
        cashPageList.push(name)
        sessionStorage.setItem('AR_PAGE_CASH', JSON.stringify(cashPageList))
      }
    }
  }
  const removePageCash = (name: string) => {
    const path = name.split('_').join('/')
    let cashPageList = JSON.parse(sessionStorage.getItem('AR_PAGE_CASH') || '[]')
    cashPageList = cashPageList.filter((item:any) => item != path)
    sessionStorage.setItem('AR_PAGE_CASH', JSON.stringify(cashPageList))
    console.log('removePageCash', JSON.parse(sessionStorage.getItem('AR_PAGE_CASH') || '[]'))
  }
  const clearTabsMenu = () => {
    const current = getCurrentTab.value   // 当前 tab
  
    if (!current?.fullPath) return
  
    // 只保留当前 page 的 tab
    store.tabsList = [current]
  
    // 同步 localStorage
    localStorage.setItem('AR_ROUTE', JSON.stringify([current]));
    sessionStorage.removeItem('AR_PAGE_CASH');
  }
  const useProvide = () => {
    provide(layout_provide, {
      collapsed,
      onSwitch,
      goMenu,
      onTabAction,
      setPageCash,
      removePageCash,
      menus,
      menuList,
      tabsList,
      getCurrentTab,
      clearTabsMenu,
      setClickCount,
    })
  }

  return {
    collapsed,
    menus,
    menuList,
    siderWidth,
    route,
    setLocal,
    intLocal,
    addTabs,
    closeCurrentTab,
    onSwitch,
    useProvide,
    goMenu,
    getSimpleRoute,
    setPageCash,
    removePageCash,
    clearTabsMenu,
    setClickCount,
  }
}

export function useLayoutCtx() {
  return inject<ConfigLayout>(layout_provide, {} as ConfigLayout)
}
