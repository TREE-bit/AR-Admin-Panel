<template>
  <div class="search">
    <a-row class="mb15">
      <a-col>
        <timeRange v-model:startTime="query.startDate" v-model:endTime="query.endDate" :type="2"/>
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
      <div class="con_h_title">{{ $t('n45') }}</div>
      <div class="con_h_title">{{ $t('n65') }}</div>
      <div class="con_h_title">{{ $t('m304') }}</div>
    </div>
    <div class="con_bottom">
      <!-- 匹配超时 -->
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('n84') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.buyMatchTimeoutCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.sellMatchTimeoutCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.totalMatchTimeoutCount) }}</div>
      </div>
      <!-- 支付超时 -->
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('n92') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.buyTimeoutCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.sellTimeoutCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.totalTimeoutCount) }}</div>
      </div>
      <!-- 确认超时 -->
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('n87') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.buyConfirmationTimeoutCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.sellConfirmationTimeoutCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.totalConfirmationTimeoutCount) }}</div>
      </div>
      <!-- 申诉成功 -->
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('s16') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.buyAppealSuccessCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.sellAppealSuccessCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.totalAppealSuccessCount) }}</div>
      </div>
      <!-- 申诉失败 -->
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('s17') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.buyAppealFailedCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.sellAppealFailedCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.totalAppealFailedCount) }}</div>
      </div>
      <!-- 已取消 -->
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('n56') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.buyCancelCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.sellCancelCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.totalCancelCount) }}</div>
      </div>
      <!-- 已完成 -->
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('n82') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.buySuccessCount)}}</div>
        <div class="con_b_n">{{ thousand(dataSource.sellSuccessCount)}}</div>
        <div class="con_b_n">{{ thousand(dataSource.totalTotalCount)}}</div>
      </div>
      <!-- 成功率 -->
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('c28') }}</div>
        <div class="con_b_n">{{ successRateChange(dataSource.buySuccessRate) }}</div>
        <div class="con_b_n">{{ successRateChange(dataSource.sellSuccessRate) }}</div>
        <div class="con_b_n">{{ successRateChange(dataSource.totalSuccessRate) }}</div>
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
import { getOrderStatusOverview } from "@/api/merchant.api";
import { thousand } from "@/utils";
import Bus from '@/utils/bus';
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const date = ref<any>();
const { t } = useI18n();
const { dateType } = useReport();
let dayType =ref("toDay");
const today = dayjs();
const query = ref<any>({
  endDate: '',
  startDate: '',
});
const dataSource = ref<any>({});
const searchDate = computed({
  get: () => {
    return [query.value.startDate, query.value.endDate];
  },
  set: (val) => {
    query.value.startDate = val ? val[0].startOf(dateType.value) : "";
    query.value.endDate = val ? val[1].endOf(dateType.value) : "";
  },
});

const getList = async () => {
  const res: any = await getOrderStatusOverview(query.value);
  if (res && res.code === "1") {
    dataSource.value = res.data;
  }
};
const fixed2 = (value:any) =>{
  return value?value.toFixed(2):'0.00';
};
const isNull = (value:any) => {
  if(value == 0) return 0;
  return value?value:'--'
}
const successRateChange = (value:any) =>{
  if(value == 0 || !value){
    return '0.00%'
  }else{
    return (value * 100).toFixed(1) + '%';
  }
};
const getTodayList = async (type: any) => {
  dayType.value = type;
  if(type == 'toDay'){
    setDefaultData();
  }else{
    query.value = {
      endDate: null,
      startDate: null,
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
    query.value.startDate = newDate;
    query.value.endDate = newDate;
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
  query.value.startDate = currentDate;
  query.value.endDate = currentDate;
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
