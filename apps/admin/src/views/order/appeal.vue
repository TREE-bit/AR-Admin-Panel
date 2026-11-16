<template>
  <!-- <a-card
    style="width: 100%; height: 100%"
    :tab-list="tabList"
    :bordered="false"
    :hoverable="false"
    @tabChange="(key: any) => onTabChange(key)"
    class="setting-page"
  >
    <component :is="comId"></component>
  </a-card> -->
  <div style="padding-top: 6px;">
    <!-- <a-button :type="primary" @clicl="onTabChange('buyAppealRec')">{{ $t('快捷提现-买入流水') }}</a-button>
    <a-button @clicl="onTabChange('waitRecBuy')">{{ $t('快捷提现-买入待拉取队列') }}</a-button> -->
    <a-button v-for="(item,index) in tabList" :type="item.active ? 'primary' : undefined"  @click="onTabChange(item.key)" :key="index">
      {{ item.tab }}
    </a-button>
    <component :is="comId"></component>
  </div>
</template>

<script lang="ts" setup>
import appealOrderList from "@/components/orderManagement/appealOrderList.vue";
import appealOrderConfig from "@/components/orderManagement/appealOrderConfig.vue";
import { shallowRef,ref } from "vue";
import { useI18n } from "vue-i18n";
const comId = shallowRef(appealOrderList);
const { t } = useI18n();
const tabList = ref<any[]>([
  {
    key: "appealOrderList",
    tab: t('n1434'),
    active: true
  },
  {
    key: "appealOrderConfig",
    tab: t('n1435'),
    active: false
  },
]);
const map = <any>{
  appealOrderList,
  appealOrderConfig,
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
