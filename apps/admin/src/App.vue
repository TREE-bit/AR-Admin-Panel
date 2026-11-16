<script setup lang="ts">
import { ConfigProvider } from "ant-design-vue";
import type { ConfigProviderProps } from "ant-design-vue";
import { reactive } from "vue";
import locale from "ant-design-vue/es/locale/zh_CN";
import { useLanguage } from "@/hooks/useLanguage.hook";
import { useRoute } from "vue-router";
import MsgList from '@/components/Layout/msgList.vue'
const { someKey } = useLanguage();
const route = useRoute();
sessionStorage.clear();
localStorage.setItem('AR_ROUTE','[]');
const config = reactive<ConfigProviderProps>({
  locale,
  componentSize: "middle",
  virtual: true,
  theme: {
    token: {
      colorPrimary: "#1677ff",
    },
  },
});
</script>

<template :key="someKey">
  <ConfigProvider
    :locale="config.locale"
    :component-size="config.componentSize"
    :virtual="config.virtual"
    :theme="config.theme"
    :key="someKey"
  >
    <router-view :class="route.name" />
  </ConfigProvider>
  <MsgList/>
  <FloatingModal />
</template>

