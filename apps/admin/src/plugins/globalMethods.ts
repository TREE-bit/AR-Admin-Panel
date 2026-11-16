import { App } from 'vue'
import { useClipboard } from '@vueuse/core'
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import i18n from '@/i18n';
const {  copy } = useClipboard()

export function registerGlobalMethods(app: App) {
  app.config.globalProperties.$getMapItem = (map: any, key: any)=>{
    return map[key] || key;
  }
  app.config.globalProperties.$copyId = (id: any) => {
    copy(id);
    message.success('copy success');
  }
  app.config.globalProperties.$getMenuName = () => {
    const route = useRoute();
     return i18n.global.t(route.meta.title as string)
  }
}
