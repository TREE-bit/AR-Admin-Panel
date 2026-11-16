<template>
  <div style="padding-top: 6px;">
    <a-button v-for="(item,index) in tabList" :type="item.active ? 'primary' : undefined"  @click="onTabChange(item.key)" :key="index">
      {{ item.tab }}
    </a-button>
    <component :is="comId"></component>
  </div>
</template>

<script lang="ts" setup>
import fackAppBankList from "./components/fackAppBankList.vue";
import fackAppBankOnOffLog from "./components/fackAppBankOnOffLog.vue";
import { shallowRef,ref } from "vue";
import { useI18n } from "vue-i18n";
const comId = shallowRef(fackAppBankList);
const { t } = useI18n();
const tabList = ref<any[]>([
  {
    key: "fackAppBankList",
    tab: t('n1683'),
    active: true
  },
  {
    key: "fackAppBankOnOffLog",
    tab: t('n1684'),
    active: false
  },
]);
const map = <any>{
  fackAppBankList,
  fackAppBankOnOffLog,
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
