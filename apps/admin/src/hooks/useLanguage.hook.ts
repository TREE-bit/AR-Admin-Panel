import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import enUS from "ant-design-vue/es/locale/en_US";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

const languageList = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
];
const language = ref<any>(localStorage.getItem("language") || "zh");
const skey = ref(0);
dayjs.locale(language);
export function useLanguage() {
  const { locale } = useI18n();
  const Language = computed(() => {
    return language.value;
  });
  const changeLanguage = (val: string) => {
    localStorage.setItem("language", val);
    dayjs.locale(val);
    language.value = val;
    locale.value = val;
    skey.value++;
  };

  const localeP = computed(() => {
    const map = <any>{
        en: enUS,
        zh: zhCN,
    };
    return map[language.value]
  });
  const someKey = computed(()=>{
    return skey.value
  })
  return {
    Language,
    languageList,
    localeP,
    someKey,
    changeLanguage,
  };
}
