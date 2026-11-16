<template>
  <a-card
    style="width: 100%; height: 100%"
    :tab-list="tabList"
    :bordered="false"
    :hoverable="false"
    @tabChange="(key: any) => onTabChange(key)"
    class="setting-page"
  >
    <component :is="comId"></component>
  </a-card>
</template>

<script lang="ts" setup>
import buy from "@/components/Config/setBuy.vue";
import sell from "@/components/Config/setSell.vue";
import mayi from "@/components/Config/setMayi.vue";
import setElse from "@/components/Config/setElse.vue";
import setRisk from "@/components/Config/setRisk.vue";
import operationLog from "@/components/Config/operationLog.vue";
import { shallowRef,ref } from "vue";
import { useI18n } from "vue-i18n";
const comId = shallowRef(buy);
const { t } = useI18n();
const tabList = ref<any[]>([
  {
    key: "buy",
    tab: t('l72'),
  },
  {
    key: "sell",
    tab: t('l73'),
  },
  {
    key: "mayi",
    tab: t('m843'),
  },
  {
    key: "setElse",
    tab: t('m319'),
  },
  {
    key: "setRisk",
    tab: t('n414'),
  },
  {
    key: "operationLog",
    tab: t('n1149'),
  },
]);
const onTabChange = (key: any) => {
  const map = <any>{
    buy,
    sell,
    mayi,
    setElse,
    setRisk,
    operationLog,
  };
  comId.value = map[key];
};
</script>
<style>
.setting-page{
  box-shadow: none;
}
</style>
