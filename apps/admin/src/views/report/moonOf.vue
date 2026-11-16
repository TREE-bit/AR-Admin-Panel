<template>
  <div class="search">
    <h2>{{ $t("m13") }}</h2>
    <a-row>
      <a-col v-show="dateType=='day'">
        <timeRange v-model:startTime="queryDay.startDate" v-model:endTime="queryDay.endDate" :num="3" :type="2"/>
      </a-col>
      <a-col v-show="dateType!='day'">
        <timeRange v-model:startTime="queryMonth.startMonth" v-model:endTime="queryMonth.endMonth" :num="5" :type="3"/>
      </a-col>
      <a-col class="c-row c-row-bottom">
        <a-button
          class="ml15"
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          :loading="loading"
          >{{ $t("search") }}</a-button
        >
        <a-button class="ml15" type="primary" :loading="loading" @click="reset">{{
          $t("reset")
        }}</a-button>
      </a-col>
      <a-col class="c-row c-row-bottom">
        <a-button
          class="ml15"
          :type="dateType == 'day' ? 'primary' : ''"
          @click="changeDateType('day')"
          :loading="loading"
          >{{ $t("p65") }}</a-button
        >
        <a-button
          class="ml15"
          :type="dateType == 'month' ? 'primary' : ''"
          @click="changeDateType('month')"
          :loading="loading"
          >{{ $t("p66") }}</a-button
        >
        <a-button type="primary" @click="exportList" :loading="loading" v-permission="'admin:biPaymentOrder:export'">{{
          $t("export")
        }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    size="middle"
    :dataSource="dataSource"
    :loading="loading"
    :columns="columns"
    :scroll="{ x: 'max-content' , y : getTabH+'px' }"
    :pagination="paginationConfig"
    @change="getChange"
  >
  <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'reportDate'">
        {{ record.reportDate || record.year + '-' + record.month  }}
      </template>
      <template v-if="column.key === 'buyAgeSuccessDuration'">
        <!-- {{ averageTime(record) }} -->
        {{ record.buyAgeSuccessDuration ? formatTime(parseInt((record.buyAgeSuccessDuration).toFixed(0))) : "--" }}
      </template>
      <template v-if="column.key === 'buySuccessRate'">
        {{ successRateChange(record.buySuccessRate) }}
      </template>
      <template v-if="column.key === 'buySuccessBonus'">
        {{ thousand(record.buySuccessBonus) }}
      </template>
    </template>
    <template #summary>
      <a-table-summary fixed="bottom">
        <a-table-summary-row>
          <a-table-summary-cell :col-span="1" > {{ $t("m54") }}</a-table-summary-cell>
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger">{{ thousand(extendData.pageTotalBuySuccessAmount) }}</a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="6" />
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger"> {{ thousand(extendData.pageTotalBuySuccessBonus) }} </a-typography-text>
          </a-table-summary-cell>
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell :col-span="1" >{{ $t("m55") }}</a-table-summary-cell>
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger"> {{ thousand(extendData.totalBuySuccessAmount) }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="6" />
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger"> {{ thousand(extendData.totalBuySuccessBonus) }} </a-typography-text>
          </a-table-summary-cell>
        </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { useReport } from "@/hooks/useReport.hook";
import { ref, reactive, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { usePagination } from "@/plugins/dataMap";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { currency, thousand } from "@/utils";
import { formatTime } from "@/utils/index";
import { queryBuyReportExport,queryBuyMonthReportExport } from "@/api/export";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const { dateType, getBiWithdrawOrder } = useReport();
const { paginationConfig } = usePagination();
const loading = ref(false);
const today = dayjs();
const extendData = ref({});
const query = ref<any>({
  pageNo: 1,
  pageSize: 10,
});
const queryDay = ref<any>({
  endDate: '',
  startDate: '',
});
const queryMonth = ref<any>({
  endMonth: '',
  startMonth: '',
});
const dataSource = ref([]);
const searchDate = computed({
  get: () => {
    return [query.value.startTime, query.value.endTime];
  },
  set: (val) => {
    query.value.startTime = val ? val[0].startOf(dateType.value) : "";
    query.value.endTime = val ? val[1].endOf(dateType.value) : "";
  },
});
const columns:any = reactive([
  {
    title: t("reportColumns1"),
    dataIndex: "reportDate",
    key: "reportDate",
    width: 180,
  },
  {
    title: t("reportColumns8"),
    dataIndex: "buySuccessAmount",
    key: "buySuccessAmount",
    width: 180,
  },
  {
    title: t("reportColumns4"),
    dataIndex: "buyDoneCount",
    key: "buyDoneCount",
    width: 180,
  },
  {
    title: t("reportColumns5"),
    dataIndex: "buySuccessCount",
    key: "buySuccessCount",
    width: 180,
  },
  {
    title: t("successRate"),
    dataIndex: "buySuccessRate",
    key: "buySuccessRate",
    width: 180,
  },
  // {
  //   title: t("n43"),
  //   dataIndex: "actualMoney",
  //   key: "actualMoney",
  // },
  {
    title: t("appealNum"),
    dataIndex: "buyAppealDoneCount",
    key: "buyAppealDoneCount",
    width: 160,
  },
  {
    title: t("cancelOrder"),
    dataIndex: "buyCancelCount",
    key: "buyCancelCount",
    width: 200,
  },
  {
    title: t("p64"),
    dataIndex: "buyAgeSuccessDuration",
    key: "buyAgeSuccessDuration",
    width: 260,
  },
  {
    title: t("e6"),
    dataIndex: "buySuccessBonus",
    key: "buySuccessBonus",
    width: 180,
  },
]);

const getList = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    paginationConfig.current = 1;
  }
  let res;
  loading.value = true;
  if(dateType.value == 'day'){
    res = await getBiWithdrawOrder()(Object.assign({}, query.value, queryDay.value)).finally(()=>loading.value = false);
  }else{
    res = await getBiWithdrawOrder()(Object.assign({}, query.value, queryMonth.value)).finally(()=>loading.value = false);
  }
  if (res && res.code === "1") {
    dataSource.value = res.data.map((item: any)=> {
        // item.actualMoney = currency(item.actualMoney, false);
        // item.money = currency(item.money, false);
        return item;
    })
    extendData.value = res.extend;
    paginationConfig.total = res.total || 0;
  }
};
const successRateChange = (value:any) =>{
  return (value * 100).toFixed(0) + '%';
};
const changeDateType = async (type: any) => {
  dateType.value = type;
  query.value = {
    pageNo: 1,
    pageSize: 10,
  };
  paginationConfig.pageSize = 10;
  getList();
};
const reset = () => {
  query.value = {
    pageNo: 1,
    pageSize: 10,
  };
  if(dateType.value == 'day'){
    queryDay.value = {
      endDate: '',
      startDate: '',
    };
  }else{
    queryMonth.value = {
      endMonth: '',
      startMonth: '',
    };
  }
  paginationConfig.current = 1
  paginationConfig.pageSize = 10;
  getList();
};
const getChange = (value: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  paginationConfig.pageSize = pageSize;
  paginationConfig.current = current;
  getList();
};
const exportList = async () => {
  loading.value = true;
  if(dateType.value == 'day'){
    queryBuyReportExport(Object.assign({}, query.value, queryDay.value)).finally(()=>loading.value = false);
  }else{
    queryBuyMonthReportExport(Object.assign({}, query.value, queryMonth.value)).finally(()=>loading.value = false);
  }
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight().getTabH.value;
});
</script>

<style lang="less" scoped>
lable {
  display: inline-block;
  width: 100px;
}
</style>
