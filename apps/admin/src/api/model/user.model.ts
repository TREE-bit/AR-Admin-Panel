export interface LoginSchema {
  grant_type? :string
  password?: string
  username?: string
  verifyCode?: string
  captchaId?: string
  totpCode?:string
  refresh_token? : string | null
}
export interface UserInfoSchema {
  email: string
  loginIp: string
  nickName: string
  token: string
}
export interface MenuItemSchema {
  id: number
  icon: string
  parentId: number | null
  path:string
  component: string
  sort: number
  name: string
  openMode: number
  visible:number
  isExt: boolean
  children: MenuItemSchema[]
  redirect:string
  listPermission:any[]
}
export interface MenusSchema {
  menus: MenuItemSchema[]
}
