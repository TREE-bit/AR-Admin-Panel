import {computed} from 'vue'
import {userInfo} from './userInfo.hook'
import { isPrototype } from '@/prototype/env'
const {menuList }=userInfo();
export function usePermission() {
  const permission=computed<string[]>(()=>menuList.value.reduce((list,item:any)=>list.concat((item.listPermission || []).map((child:any)=>child.btnSign)),[]))
  const hasPermission=(value:string|string[]):boolean=>{
    if (isPrototype) return true;
    const isArray=Array.isArray(value)
    if(!value||isArray&&!value.length) return true;

   if(isArray){
    const isPr=value.find((btns)=>permission.value.includes(btns));
     return !!isPr
   }
   return permission.value.includes(value);
  }
  return {
    hasPermission
  }

}
