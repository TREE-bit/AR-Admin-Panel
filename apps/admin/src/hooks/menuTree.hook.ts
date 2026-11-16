import { getMenuTree ,updataMenu,inquireMenu } from "@/api/menu.api"

export function menuTreeHook(){
    const getMenuTreeFun = async()=>{
        const res: any = await getMenuTree()
        if (res && res.code === '1') {
            return res.data || []
        }
        return []
    }
    const updataMenuFun = async(id:string,data:any)=>{
        const res: any = await updataMenu(id,data)
        if (res && res.code === '1') {
            return res.data || []
        }
    }
    const inquireMenuFun = async(id:string)=>{
        const res: any = await inquireMenu(id)
        if (res && res.code === '1') {
            return res.data || []
        }
        return []
    }

    return {
        getMenuTreeFun,updataMenuFun,inquireMenuFun
    }
}