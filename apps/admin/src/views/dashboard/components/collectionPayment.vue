<template>
  <div class="search">
    <a-row class="mb15">
      <a-col>
        <!-- <a-range-picker class="searchstyle" v-model:value="searchDate" /> -->
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
        <a-button
          class="ml15"
          :type="dayType == 'toDay' ? 'primary' : ''"
          @click="getTodayList('toDay')"
          >{{ $t("m297") }}</a-button
        >
        <a-button
          class="ml15"
          :type="dayType == 'allDay' ? 'primary' : ''"
          @click="getTodayList('allDay')"
          >{{ $t("m298") }}</a-button>
      </a-col>
    </a-row>
  </div>
  <div class="content">
    <div class="con_header">
      <div class="con_h_title"></div>
      <div class="con_h_title">{{ $t('m299') }}</div>
      <div class="con_h_title">{{ $t('m300') }}</div>
      <div class="con_h_title">{{ $t('m301') }}</div>
    </div>
    <div class="con_bottom">
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('m306') }}</div>
        <div class="con_b_n">{{ currency(dataSource.merchantWithdrawAmount, false) }}</div>
        <div class="con_b_n">{{ currency(dataSource.merchantPayAmount, false) }}</div>
        <div class="con_b_n">{{ currency(dataSource.transAmountDiff, false) }}</div>
      </div>
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('m307') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.merchantWithdrawTransNum) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.merchantPayTransNum) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.transNumDiff) }}</div>
      </div>
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('m308') }}</div>
        <div class="con_b_n">{{ currency(dataSource.withdrawAverageAmount, false) }}</div>
        <div class="con_b_n">{{ currency(dataSource.payAverageAmount, false) }}</div>
        <div class="con_b_n">{{ currency(dataSource.averageAmountDiff, false) }}</div>
      </div>
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('n8') }}</div>
        <div class="con_b_n">{{ currency(dataSource.withdrawFee, false) }}</div>
        <div class="con_b_n">{{ currency(dataSource.payFee, false) }}</div>
        <div class="con_b_n">{{ currency(dataSource.feeAmountDiff, false) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useReport } from "@/hooks/useReport.hook";
import { ref, h, computed, watch } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { getMerchantOrderOverview } from "@/api/merchant.api";
import { currency, thousand } from "@/utils";
import Bus from '@/utils/bus';
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const date = ref<any>();
const { t } = useI18n();
const { dateType } = useReport();
let dayType =ref("toDay");
const today = dayjs();
const query = ref<any>({
  endTime: '',
  startTime: '',
});
const dataSource = ref<any>({});
const searchDate = computed({
  get: () => {
    return [query.value.startTime, query.value.endTime];
  },
  set: (val) => {
    query.value.startTime = val ? val[0].startOf(dateType.value) : "";
    query.value.endTime = val ? val[1].endOf(dateType.value) : "";
  },
});

const getList = async () => {
  // const endTime = query.value.endTime?query.value.endTime.format('YYYY-MM-DD'): null;
  // const startTime = query.value.startTime?query.value.startTime.format('YYYY-MM-DD'): null;
  const res: any = await getMerchantOrderOverview(query.value);
  if (res && res.code === "1") {
    dataSource.value = res.data;
  }
};
const fixed2 = (value:any) =>{
  return value?value.toFixed(2):'0.00';
};
const isNull = (value:any) => {
  if(value == 0) return 0;
  return value?Number(value).toLocaleString():'--'
}
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
    const newDate = date.value.subtract(1, 'day').format('YYYY-MM-DD');
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
    currentDate = date.value.subtract(1, 'day').format('YYYY-MM-DD');
  }else{
    currentDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
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
lable {
  display: inline-block;
  width: 100px;
}
.content{
  width: 100%;
  >div{
    float: left;
    width: 100%;
  }
  .con_header{
    height: 46px;
    .con_h_title{
      font-weight: 600;
      font-size: 12px;
      line-height: 46px;
      text-align: center;
    }
    >div{
      width: 25%;
      height: 46px;
      float: left;
      border-top: 1px solid #f0f0f0;
      border-left: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      &:nth-child(4){
        border-right: 1px solid #f0f0f0;
      }
    }
  }
  .con_bottom{
    width: 100%;
    .con_b_box{
      display: flex;
      height: 46px;
      >div{
        width: 25%;
        height: 46px;
        float: left;
        font-weight: 600;
        font-size: 12px;
        line-height: 46px;
        text-align: center;
        border-left: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;
        &:nth-child(4){
          border-right: 1px solid #f0f0f0;
        }
      }
    }
  }
}
:deep(th){
  border-radius: 0!important;
}
</style>
