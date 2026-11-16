<template>
  <div class="search">
    <a-row class="mb15">
      <a-col>
        <!-- <a-range-picker class="searchstyle" v-model:value="searchDate" /> -->
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
      <div class="con_h_title">{{ $t('m271') }}</div>
      <div class="con_h_title">{{ $t('m301') }}</div>
    </div>
    <div class="con_bottom">
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('m306') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.buySuccessAmount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.sellSuccessAmount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.usdSuccessAmount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.contrastDiffAmount) }}</div>
      </div>
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('m307') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.buySuccessCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.sellSuccessCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.usdSuccessCount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.contrastDiffCount) }}</div>
      </div>
      <div class="con_b_box">
        <div class="con_b_1">{{ $t('m308') }}</div>
        <div class="con_b_n">{{ thousand(dataSource.buyAgeSuccessAmount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.sellAgeSuccessAmount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.usdAgeSuccessAmount) }}</div>
        <div class="con_b_n">{{ thousand(dataSource.contrastDiffAgeAmount) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useReport } from "@/hooks/useReport.hook";
import { ref, h, computed} from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { getMemberOrderOverview } from "@/api/merchant.api";
import { currency, thousand } from "@/utils";
import Bus from '@/utils/bus'
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { formatTime } from '../../../utils/index';
const { t } = useI18n();
const date = ref<any>();
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
  const res: any = await getMemberOrderOverview(query.value);
  if (res && res.code === "1") {
    dataSource.value = res.data;
  }
};
const fixed2 = (value:any) =>{
  return value?value.toFixed(2):'0.00';
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
      width: 20%;
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
        width: 20%;
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
