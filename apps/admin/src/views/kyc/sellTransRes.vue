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
import kycRecords from "./components/kycRecords.vue";
import utrDupRec from "./components/utrDupRec.vue";
import tidDupRec from "./components/tidDupRec.vue";
import phpeWakeupRec from "./components/phpeWakeupRec.vue";
import abnormalRec from "./components/abnormalRec.vue";
import { shallowRef,ref } from "vue";
import { useI18n } from "vue-i18n";
const comId = shallowRef(kycRecords);
const { t } = useI18n();
const tabList = ref<any[]>([
  {
    key: "kycRecords",
    tab: t('m690'),
    active: true
  },
  {
    key: "utrDupRec",
    tab: t('n850'),
    active: false
  },
  {
    key: "tidDupRec",
    tab: t('n851'),
    active: false
  },
  {
    key: "abnormalRec",
    tab: t('n861'),
    active: false
  },
  {
    key: "phpeWakeupRec",
    tab: t('n1269'),
    active: false
  },
]);
const map = <any>{
  kycRecords,
  utrDupRec,
  tidDupRec,
  abnormalRec,
  phpeWakeupRec,
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
