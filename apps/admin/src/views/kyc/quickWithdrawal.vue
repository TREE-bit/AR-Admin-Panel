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
import buyRec from "./components/buyRec.vue";
import buyFailedRec from "./components/buyFailedRec.vue";
import waitRecBuy from "./components/waitRecBuy.vue";
import linkLog from "./components/linkLog.vue";
import { shallowRef,ref } from "vue";
import { useI18n } from "vue-i18n";
const comId = shallowRef(buyRec);
const { t } = useI18n();
const tabList = ref<any[]>([
  {
    key: "buyRec",
    tab: t('n633')+'-'+t('n634'),
    active: true
  },
  {
    key: "waitRecBuy",
    tab: t('n633')+'-'+t('n635'),
    active: false
  },
  {
    key: "buyFailedRec",
    tab: t('n633')+'-'+t('n1479'),
    active: false
  },
  // {
  //   key: "linkLog",
  //   tab: t('n633')+'-'+t('n667'),
  //   active: false
  // },
]);
const map = <any>{
  buyRec,
  waitRecBuy,
  linkLog,
  buyFailedRec,
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
