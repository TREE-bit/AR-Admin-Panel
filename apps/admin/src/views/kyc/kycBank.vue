<template>
  <div style="padding-top: 6px;">
    <a-button v-for="(item,index) in tabList" :type="item.active ? 'primary' : undefined"  @click="onTabChange(item.key)" :key="index">
      {{ item.tab }}
    </a-button>
    <component :is="comId"></component>
  </div>
</template>

<script lang="ts" setup>
import kycBankList from "./components/kycBankList.vue";
import kycBankOnOffLog from "./components/kycBankOnOffLog.vue";
import ifscConfig from "./components/ifscConfig.vue";
import { shallowRef,ref } from "vue";
import { useI18n } from "vue-i18n";
const comId = shallowRef(kycBankList);
const { t } = useI18n();
const tabList = ref<any[]>([
  {
    key: "kycBankList",
    tab: t('n1369'),
    active: true
  },
  {
    key: "kycBankOnOffLog",
    tab: t('n1368'),
    active: false
  },
  {
    key: "ifscConfig",
    tab: t('n1816'),
    active: false
  },
]);
const map = <any>{
  kycBankList,
  kycBankOnOffLog,
  ifscConfig,
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
