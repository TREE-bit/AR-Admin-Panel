import {App} from 'vue';
import {usePermission} from '@/hooks';
const {hasPermission}=usePermission()
export function vPermission(app:App){
    app.directive('permission', (el,binding)=>{
        const value=binding.arg||binding.value;      
        if(hasPermission(value)){
            return 
        }
        el?.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    })
}