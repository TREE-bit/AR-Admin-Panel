<template>
    <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" />
    <component :is="componentMap[current[0]]" :memberID="memberID" :id="id"></component>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import info from "./components/info.vue"
import changeRecode from "./components/changeReocde.vue"
import payInfo from "./components/payInfo.vue"
import level from "./components/level.vue"
import Bus from "@/utils/bus";

defineProps({
  memberID: {
    default: ()=> 0
  },
  id: {
    default: ()=>0
  }
})
const componentMap = <any>{
  info,
  changeRecode,
  payInfo,
  level
}
const { t } = useI18n();
const current = ref<string[]>(['info']);
const memberType = ref(0);
const items = ref([
  {
    key: "info",
    label: t('n99'),
  },
  {
    key: "changeRecode",
    label: t('m35'),
  },
  {
    key: "payInfo",
    label: t('m36'),
  },
]);
// Bus.on('memberType', (data: any) => {
//   const has = items.value.some((item: any) => item.key == "level");
//   if(data == 4 && !has){
//     items.value.push({
//       key: "level",
//       label: t('m852'),
//     });
//   }
// })
</script>
<style lang="less" scoped>
:deep(.ant-menu-title-content){
  font-size: 16px;
  font-weight: 500;
}
</style>
