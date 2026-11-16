import type { MenuItemSchema } from '@/api/model/user.model'
import i18n from '@/i18n'
import catalog from './routeCatalog.json'

/** 测试环境 KYC 栏目没有这几页，侧栏标题加标记方便核对 */
const PENDING_CHECK_PATHS = new Set([
  '/kyc/kycOrder',
  '/kyc/kycSmsLog',
  '/kyc/kycTrading',
  '/kyc/kycSmsSuccessLog',
])

const GROUP_NAMES: Record<string, string> = {
  fieldNotes: '后台字段理解',
  dashboard: 'm1',
  admin: 'm19',
  merchant: 'm25',
  config: 'm314',
  order: 'm3',
  mandate: 'n223',
  report: 'm12',
  member: 'm15',
  task: 'm317',
  wind: 'm452',
  userlevel: 'm491',
  kyc: 'm575',
  appConfig: 'n1521',
  payment: 'm727',
  emailManager: 'n175',
  biScreen: 'n170',
  ticket: 'n831',
  livechat: 'm545',
}

// 侧栏分组顺序。MenuItem 按 sort 从小到大排，所以越靠前 sort 越小。
// dashboard 弃用，不进侧栏。
// 前 14 个业务栏目对齐测试环境。后台字段理解放最前。工单、报表、任务排在后面。
const GROUP_ORDER = [
  'fieldNotes',
  'biScreen',
  'order',
  'kyc',
  'appConfig',
  'member',
  'payment',
  'mandate',
  'config',
  'emailManager',
  'merchant',
  'userlevel',
  'livechat',
  'wind',
  'admin',
  'ticket',
  'report',
  'task',
]

/** 路径第一段和侧栏栏目不一致时，按这里归组。页面路由本身不改。 */
const PAGE_GROUP: Record<string, string> = {
  '/config/selectLivechat': 'livechat',
}

const HIDDEN_GROUPS = new Set(['dashboard'])

type CatalogItem = { path: string; title: string }

// 菜单名使用页面标题的翻译键，侧边栏、页签和页面标题会显示同一套文案。
export function buildPrototypeMenus(): MenuItemSchema[] {
  const groups = new Map<string, CatalogItem[]>()
  for (const item of catalog as CatalogItem[]) {
    const segment = PAGE_GROUP[item.path] || item.path.split('/').filter(Boolean)[0] || 'other'
    if (HIDDEN_GROUPS.has(segment)) continue
    const list = groups.get(segment) || []
    list.push(item)
    groups.set(segment, list)
  }

  const orderedSegments = [
    ...GROUP_ORDER.filter((segment) => groups.has(segment)),
    ...[...groups.keys()].filter((segment) => !GROUP_ORDER.includes(segment)),
  ]

  const menus: MenuItemSchema[] = []
  let pageId = 1000
  orderedSegments.forEach((segment, groupIndex) => {
    const pages = groups.get(segment) || []
    const groupId = 100 + groupIndex
    menus.push({
      id: groupId,
      icon: '',
      parentId: -1,
      path: `/${segment}`,
      component: '/Layout',
      sort: groupIndex * 10,
      name: GROUP_NAMES[segment] || segment,
      openMode: 0,
      visible: 1,
      isExt: false,
      children: [],
      redirect: pages[0]?.path || '',
      listPermission: [],
    })
    pages.forEach((page, index) => {
      const title = PENDING_CHECK_PATHS.has(page.path)
        ? `【待检查】${i18n.global.t(page.title)}`
        : page.title
      menus.push({
        id: pageId++,
        icon: '',
        parentId: groupId,
        path: page.path,
        component: page.path,
        sort: index,
        name: title,
        openMode: 0,
        visible: 1,
        isExt: false,
        children: [],
        redirect: '',
        listPermission: [],
      })
    })
  })
  return menus
}
