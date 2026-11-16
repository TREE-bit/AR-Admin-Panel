<template>
  <div class="search">
    <h2>{{ $t("m785") }}</h2>
    <a-row class="mb15">
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.buyMinAmount"
          :placeholder="$t('m562')  + $t('m791')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.buyMaxAmount"
          :placeholder="$t('m562') + $t('m792')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.sellMinAmount"
          :placeholder="$t('m562') + $t('m793')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.sellMaxAmount"
          :placeholder="$t('m562') + $t('m794')"
        />
      </a-col>
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
        <a-button type="primary" @click="exportList" :loading="loading" v-permission="'admin:biFourReportOrder:export'">{{
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
    :scroll="{ x: '100%' , y : getTabH +'px' }"
    :pagination="paginationConfig"
    @change="getChange"
  >
  <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'reportDate'">
        {{ record.reportDate || record.year + '-' + record.month  }}
      </template>
      <template v-if="column.key === 'sellAgeSuccessDuration'">
        {{ record.sellAgeSuccessDuration ? formatTime(parseInt((record.sellAgeSuccessDuration).toFixed(0))) : "--" }}
      </template>
      <template v-if="column.key === 'buyAgeSuccessDuration'">
        {{ record.buyAgeSuccessDuration ? formatTime(parseInt((record.buyAgeSuccessDuration).toFixed(0))) : "--" }}
      </template>
      <template v-if="column.key === 'sellSuccessRate'">
        {{ successRateChange(record.sellSuccessRate) }}
      </template>
      <template v-if="column.key === 'buySuccessRate'">
        {{ successRateChange(record.buySuccessRate) }}
      </template>
    </template>
    <template #summary>
      <a-table-summary fixed="bottom">
        <a-table-summary-row>
          <a-table-summary-cell :col-span="1" > {{ $t("m54") }}</a-table-summary-cell>
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger">{{ extendData.pageTotalSellSuccessAmount }}</a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger"> {{ extendData.pageTotalSellSuccessCount }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="2" />
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger"> {{ extendData.pageTotalBuySuccessAmount }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger"> {{ extendData.pageTotalBuySuccessCount }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="4" />
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell :col-span="1" >{{ $t("m55") }}</a-table-summary-cell>
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger"> {{ extendData.totalSellSuccessAmount }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger"> {{ extendData.totalSellSuccessCount }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="2" />
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger"> {{ extendData.totalBuySuccessAmount }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="1">
            <a-typography-text type="danger"> {{ extendData.totalSellSuccessCount }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="4" />
        </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { useReport } from "@/hooks/useReport.hook";
import { ref, reactive, h, computed, onBeforeMount } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { usePagination } from "@/plugins/dataMap";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { currency } from "@/utils";
import { formatTime } from "@/utils/index";
import { quadReportExport,quadMonthReportExport } from "@/api/export";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const { dateType, getFourReportOrder } = useReport();
const { paginationConfig } = usePagination();
const loading = ref(false);
const today = dayjs();
const extendData = ref<any>({});
const query = ref({
  asc: true,
  column: undefined,
  pageNo: 1,
  pageSize: 20,
  buyMinAmount: undefined,//买入最小金额
  buyMaxAmount: undefined,//买入最大金额
  sellMinAmount: undefined,//卖出最小金额
  sellMaxAmount: undefined,//卖出最大金额
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
const columns:any = reactive([
  {
    title: t("reportColumns1"),
    dataIndex: "reportDate",
    key: "reportDate",
    width: 180,
  },
  {
    title: t("m795"),
    dataIndex: "sellSuccessAmount",
    key: "sellSuccessAmount",
    width: 120,
  },
  {
    title: t("m796"),
    dataIndex: "sellSuccessCount",
    key: "sellSuccessCount",
    width: 120,
  },
  {
    title: t("m144"),
    dataIndex: "sellSuccessRate",
    key: "sellSuccessRate",
    width: 100,
  },
  {
    title: t("m797"),
    dataIndex: "sellAgeSuccessDuration",
    key: "sellAgeSuccessDuration",
    width: 180,
  },
  {
    title: t("m798"),
    dataIndex: "buySuccessAmount",
    key: "buySuccessAmount",
    width: 120,
  },
  {
    title: t("m799"),
    dataIndex: "buySuccessCount",
    key: "buySuccessCount",
    width: 120,
  },
  {
    title: t("m146"),
    dataIndex: "buySuccessRate",
    key: "buySuccessRate",
    width: 100,
  },
  {
    title: t("m800"),
    dataIndex: "buyTimeoutCount",
    key: "buyTimeoutCount",
    width: 120,
  },
  {
    title: t("m801"),
    dataIndex: "buyCancelCount",
    key: "buyCancelCount",
    width: 120,
  },
  {
    title: t("m802"),
    dataIndex: "buyAgeSuccessDuration",
    key: "buyAgeSuccessDuration",
    width: 180,
  },
]);

const getList = async (isFirst: any = null) => {
  console.log(queryMonth.value);
  if (isFirst) {
    query.value.pageNo = 1;
    paginationConfig.current = 1;
  }
  let res;
  loading.value = true;
  if(dateType.value == 'day'){
    res = await getFourReportOrder()(Object.assign({}, query.value, queryDay.value)).finally(()=>loading.value = false);
  }else{
    res = await getFourReportOrder()(Object.assign({}, query.value, queryMonth.value)).finally(()=>loading.value = false);
  }
  if (res && res.code === "1") {
    dataSource.value = res.data.map((item: any)=> {
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
    asc: true,
    column: undefined,
    pageNo: 1,
    pageSize: 20,
    buyMinAmount: undefined,//买入最小金额
    buyMaxAmount: undefined,//买入最大金额
    sellMinAmount: undefined,//卖出最小金额
    sellMaxAmount: undefined,//卖出最大金额
  };
  paginationConfig.pageSize = 20;
  getList();
};
const reset = () => {
  query.value = {
    asc: true,
    column: undefined,
    pageNo: 1,
    pageSize: 20,
    buyMinAmount: undefined,//买入最小金额
    buyMaxAmount: undefined,//买入最大金额
    sellMinAmount: undefined,//卖出最小金额
    sellMaxAmount: undefined,//卖出最大金额
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
  paginationConfig.pageSize = 20;
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
    quadReportExport(Object.assign({}, query.value, queryDay.value)).finally(()=>loading.value = false);
  }else{
    quadMonthReportExport(Object.assign({}, query.value, queryMonth.value)).finally(()=>loading.value = false);
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
