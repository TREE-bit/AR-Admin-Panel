<template>
<div class="search">
    <a-row class="mb15">
    <a-col>
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :type="2"/>
    </a-col>
    <a-col class="c-row c-row-bottom">
        <a-button
        class="ml15"
        type="primary"
        :icon="h(SearchOutlined)"
        @click="search()"
        >{{ $t("search") }}</a-button
        >
        <a-button class="ml15" type="primary" @click="reset">{{
        $t("reset")
        }}</a-button>
    </a-col>
    <a-col class="c-row c-row-bottom">
        <!-- <a-button
        class="ml15"
        :type="dayType == 'toDay' ? 'primary' : undefined"
        @click="getTodayList('toDay')"
        >{{ $t("m297") }}</a-button
        > -->
        <a-button
        class="ml15"
        :type="dayType == 'allDay' ? 'primary' : undefined"
        @click="getTodayList('allDay')"
        >{{ $t("m298") }}</a-button>
    </a-col>
    </a-row>
</div>
<div class="cancel_order_cont">
    <div class="cancel_order_list" v-for="(item,index) in cancelInfo.reasonList" :key="index">
        <div class="cancel_order_title">{{ item.reason }}</div>
        <div class="cancel_order_number">{{ thousand(item.count) }}</div>
    </div>
    <div class="cancel_order_list">
        <div class="cancel_order_title">{{ $t('n254') }}</div>
        <div class="cancel_order_number">{{ thousand(cancelInfo.frequencyUltraShort) }}</div>
    </div>
    <div class="cancel_order_list">
        <div class="cancel_order_title">{{ $t('n255') }}</div>
        <div class="cancel_order_number">{{ thousand(cancelInfo.frequencyShort) }}</div>
    </div>
    <div class="cancel_order_list">
        <div class="cancel_order_title">{{ $t('n256') }}</div>
        <div class="cancel_order_number">{{ thousand(cancelInfo.frequencyMid) }}</div>
    </div>
    <div class="cancel_order_list">
        <div class="cancel_order_title">{{ $t('n257') }}</div>
        <div class="cancel_order_number">{{ thousand(cancelInfo.frequencyOther) }}</div>
    </div>
    <div class="cancel_order_list">
        <div class="cancel_order_title">{{ $t('n252') }}</div>
        <div class="cancel_order_number">{{ thousand(cancelInfo.total) }}</div>
    </div>
    <div class="cancel_order_list">
        <div class="cancel_order_title">{{ $t('n258') }}</div>
        <div class="cancel_order_number">{{ thousand(cancelInfo.exception) }}</div>
    </div>
    <div class="cancel_order_list">
        <div class="cancel_order_title">{{ $t('n259') }}</div>
        <div class="cancel_order_number">{{ thousand(cancelInfo.exceptionMemberCount) }}</div>
    </div>
</div>
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { biCancelReasonStatistics } from "@/api/merchant.api";
import { thousand } from "@/utils/index";
import Bus from '@/utils/bus'
import dayjs from "dayjs";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const { t } = useI18n();
let dayType =ref("toDay");
const date = ref<any>();
const query = ref<any>({
    endTime: '',
    startTime: '',
});
const barChart = ref<any>(null);
const cancelInfo = ref<any>({});
const getList = async () => {
    const res: any = await biCancelReasonStatistics(query.value);
    if (res && res.code == '1') {
        cancelInfo.value = res.data;
    }
};
const getTodayList = async (type: any) => {
  dayType.value = type;
  if(type == 'toDay'){
    setDefaultData();
  }else{
    query.value = {
      endTime: null,
      startTime: null,
    };
  }
  getList();
};
const search = () =>{
  dayType.value='';
  getList();
}
const reset = () => {
  dayType.value = 'toDay';
  setDefaultData();
  getList();
};
let isFirst = true;
Bus.on('containerTypeChange', (val:any) => {
  if(isFirst){
    date.value = dayjs(val);
    const newDate = date.value.subtract(0, 'day').format('YYYY-MM-DD');
    query.value.startTime = newDate;
    query.value.endTime = newDate;
    getList();
    isFirst = false
  }
})
const setDefaultData = () => {
  const [,,,time] = getStartAndEndOfDay()
  let currentDate;
  date.value = dayjs(time);
  if(time){
    currentDate = date.value.subtract(0, 'day').format('YYYY-MM-DD');
  }else{
    currentDate = dayjs().subtract(0, 'day').format('YYYY-MM-DD');
  }
  query.value.startTime = currentDate;
  query.value.endTime = currentDate;
}
onMounted(() => {
    setDefaultData();
    getList();
});
</script>
<style lang="less" scoped>
.cancel_order_cont{
    height: auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr); 
    .cancel_order_list{
        &:nth-child(1),
        &:nth-child(2){
            border-top:1px solid rgb(201, 201, 201);
        }
        &:nth-child(odd){
            border-left:1px solid rgb(201, 201, 201);
        }
        >div{
            border-right:1px solid rgb(201, 201, 201);
            border-bottom:1px solid rgb(201, 201, 201);
        }
        >div{
            float: left;
            width: 50%;
            height: 46px;
            line-height: 46px;
            text-align: center;
            font-weight: 600;
            font-size: 12px;
        }
    }
}

</style>
