<template>
  <div style="padding-top: 6px;">
    <a-button v-for="(item,index) in tabList" :type="item.active ? 'primary' : undefined"  @click="onTabChange(item.key)" :key="index">
      {{ item.tab }}
    </a-button>
    <component :is="comId"></component>
  </div>
</template>

<script lang="ts" setup>
import appBankList from "./components/appBankList.vue";
import appBankOnOffLog from "./components/appBankOnOffLog.vue";
import { shallowRef,ref } from "vue";
import { useI18n } from "vue-i18n";
const comId = shallowRef(appBankList);
const { t } = useI18n();
const tabList = ref<any[]>([
  {
    key: "appBankList",
    tab: t('n1522'),
    active: true
  },
  {
    key: "appBankOnOffLog",
    tab: t('n1523'),
    active: false
  },
]);
const map = <any>{
  appBankList,
  appBankOnOffLog,
};
const onTabChange = (key: any) => {
  comId.value = map[key];
  tabList.value.forEach((item: any) => {
    item.active = item.key === key;
  });
};
</script>
<style>
.setting-page{
  box-shadow: none;
}
</style>
