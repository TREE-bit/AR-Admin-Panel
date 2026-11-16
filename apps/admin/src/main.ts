import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import directives from './directives'
import timeRange from './components/timeRange.vue'
import ExportButton from './components/ExportButton.vue'
import { registerGlobalMethods } from '@/plugins/globalMethods'
import { CopyOutlined } from '@ant-design/icons-vue';
import { createPinia } from 'pinia';
import FloatingModal from '@/components/FloatingModal.vue';
import './style.less'
const pinia = createPinia();

const app = createApp(App);

registerGlobalMethods(app);// 注册全局方法

// 注册全局组件
app
  .component('CopyOutlined', CopyOutlined)
  .component('FloatingModal', FloatingModal)
  .component('timeRange', timeRange)
  .component('ExportButton', ExportButton);

// 使用插件
app
  .use(router)
  .use(i18n)
  .use(pinia)
  .use(directives)
  .mount('#app');
