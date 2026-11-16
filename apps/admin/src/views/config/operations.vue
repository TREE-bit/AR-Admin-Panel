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
import setOperations from "./components/setOperations.vue";
import setRewardsCar from "./components/setRewardsCard.vue";
import { shallowRef,ref } from "vue";
import { useI18n } from "vue-i18n";
const comId = shallowRef(setOperations);
const { t } = useI18n();
const tabList = ref<any[]>([
  {
    key: "setOperations",
    tab: t('m316'),
  },
  {
    key: "setRewardsCar",
    tab: t('n1194'),
  },
]);
const onTabChange = (key: any) => {
  const map = <any>{
    setOperations,
    setRewardsCar,
  };
  comId.value = map[key];
};
</script>
<style>
.setting-page{
  box-shadow: none;
}
</style>
