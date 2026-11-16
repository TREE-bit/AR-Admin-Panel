<template>
  <div class="search">
    <a-button :type="selId=='channelInfo'?'primary' : 'default'" size="large" @click="onTabChange('channelInfo')">{{ $t("m812") }}</a-button>
    <a-button :type="selId=='countPage'?'primary' : 'default'" :disabled="!thirdCode"  size="large" @click="onTabChange('countPage')">{{ $t("m813") }}</a-button>
  </div>
  <!-- <a-card
    style="width: 100%; height: 100%"
    :tab-list="tabList"
    :bordered="false"
    :hoverable="false"
    @tabChange="(key: any) => onTabChange(key)"
    class="setting-page"
  > -->
    <component :is="comId"></component>
  <!-- </a-card> -->
</template>

<script lang="ts" setup>
import channelInfo from "@/components/Payment/channelInfo.vue";
import countPage from "@/components/Payment/countPage.vue";
import Bus from "@/utils/bus";
import { shallowRef,ref } from "vue";
import { useI18n } from "vue-i18n";
localStorage.removeItem('thirdCode');
const thirdCode = ref(localStorage.getItem('thirdCode') || null);
Bus.on('ChannelThirdCode', (data: any) => {
  thirdCode.value = data
})
const comId = shallowRef(channelInfo);
const selId = ref('channelInfo');
const { t } = useI18n();
const tabList = ref<any[]>([
  {
    key: "upiData",
    tab: 'UPI INR',
  },
  {
    key: "usdtDate",
    tab: 'USDT',
  },
]);
const onTabChange = (key: any) => {
  const map = <any>{
    channelInfo,
    countPage
  };
  comId.value = map[key];
  selId.value = key;
};
</script>
<style>
.setting-page{
  box-shadow: none;
}
</style>
