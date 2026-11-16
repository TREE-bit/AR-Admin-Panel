<template>
  <div style="padding-top: 6px;">
    <a-button v-for="(item,index) in tabList" :type="item.active ? 'primary' : undefined"  @click="onTabChange(item.key)" :key="index">
      {{ item.tab }}
    </a-button>
    <component :is="comId"></component>
  </div>
</template>

<script lang="ts" setup>
import autoBuy from "./components/autoBuy.vue";
import autoSell from "./components/autoSell.vue";
import autoPending from "./components/autoPending.vue";
import fakeAppTransactionFailure from "./components/fakeAppTransactionFailure.vue";
import fackAppPending from "./components/fackAppPending.vue";
import { shallowRef,ref } from "vue";
import { useI18n } from "vue-i18n";
const comId = shallowRef(autoBuy);
const { t } = useI18n();
const tabList = ref<any[]>([
  {
    key: "autoBuy",
    tab: t('n1502'),
    active: true
  },
  {
    key: "autoSell",
    tab: t('n1503'),
    active: false
  },
  {
    key: "autoPending",
    tab: t('n1504'),
    active: false
  },
  {
    key: "fakeAppTransactionFailure",
    tab: t('n1569'),
    active: false
  },
  {
    key: "fackAppPending",
    tab: t('n1674'),
    active: false
  },
]);
const map = <any>{
  autoBuy,
  autoSell,
  autoPending,
  fakeAppTransactionFailure,
  fackAppPending,
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
