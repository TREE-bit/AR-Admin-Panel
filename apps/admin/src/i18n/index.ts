import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh'
import enUS from './locales/en'
// import messages from '@intlify/unplugin-vue-i18n/messages'
const i18n = createI18n({
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en', // 如果未找到匹配的语言，使用默认语言
  messages:{
    'zh': zhCN,
    'en': enUS
  },
  warnHtmlMessage: false,
  silentTranslationWarn: false,
})
export default i18n;
