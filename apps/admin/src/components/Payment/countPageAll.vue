<template>
  <div class="search">
    <a-row>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.receiveMethod"
          :placeholder="$t('m563')+$t('m777')"
          :allowClear="true"
          :options="Object.keys(thirdChannelPayTypeMap).map(key => ({ label: thirdChannelPayTypeMap[key], value: key }))"
        >
        </a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.createTimeGe" v-model:endTime="query.createTimeLe" :title="''" :type="2"/>
      </a-col>
      <a-col class="c-row c-row-bottom">
        <a-button
          class="ml15"
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList()"
          >{{ $t("search") }}</a-button
        >
        <a-button
          class="ml15"
          type="primary"
          @click="reset()"
          >{{ $t("reset") }}</a-button
        >
      </a-col>
    </a-row>
  </div>
  <a-table
    size="middle"
    :dataSource="dataSource"
    :loading="loading"
    :columns="columns"
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :pagination="paginationConfig"
    @change="getChange"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'thirdCode'">
        <a-tooltip>
          <template #title>{{ record.thirdCode }}</template>
          <div class="toopTipStyle">{{ record.thirdCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.dataIndex === 'receiveMethod'">
        {{ $getMapItem(thirdChannelPayTypeMap,record.receiveMethod) || '-' }}
      </template>
      <template v-if="column.dataIndex === 'totalActualAmount'">
        {{ thousand(record.totalActualAmount) }}
      </template>
      <template v-if="column.dataIndex === 'totalOrderCount'">
        {{ thousand(record.totalOrderCount) }}
      </template>
      <template v-if="column.dataIndex === 'totalFee'">
        {{ thousand(record.totalFee) }}
      </template>
    </template>
    <template #summary>
      <a-table-summary fixed="bottom">
      <a-table-summary-row>
        <a-table-summary-cell :col-span="4" align="left"> {{ $t("m55") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="left">
          <a-typography-text type="danger">
            <p>UPI：{{ thousand(extendData.INDIAUPI.totalAmountSum) }}</p>
            <p>{{$t('m657')}}：{{ thousand(extendData.INDIABANK.totalAmountSum) }}</p>
            <p>USDT：{{ thousand(extendData.USDT.totalAmountSum) }}</p>
            <p>{{$t('m55')}}：{{ thousand(extendData.TOTAL.totalAmountSum) }}</p>
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="left">
          <a-typography-text type="danger">
            <p>UPI：{{ thousand(extendData.INDIAUPI.totalCountSum) }}</p>
            <p>{{$t('m657')}}：{{ thousand(extendData.INDIABANK.totalCountSum) }}</p>
            <p>USDT：{{ thousand(extendData.USDT.totalCountSum) }}</p>
            <p>{{$t('m55')}}：{{ thousand(extendData.TOTAL.totalCountSum) }}</p>
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="left">
          <a-typography-text type="danger">
            <p>UPI：{{ thousand(extendData.INDIAUPI.totalFeeSum) }}</p>
            <p>{{$t('m657')}}：{{ thousand(extendData.INDIABANK.totalFeeSum) }}</p>
            <p>USDT：{{ thousand(extendData.USDT.totalFeeSum) }}</p>
            <p>{{$t('m55')}}：{{ thousand(extendData.TOTAL.totalFeeSum) }}</p>
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" />
      </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { useReport } from "@/hooks/useReport.hook";
import { ref, reactive, h, computed, watch } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { usePagination } from "@/plugins/dataMap";
import { 
  thirdPayInfoAdminStatisticalInfo,
 } from "@/api/channel.api";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { currency, thousand } from "@/utils";
import { thirdChannelPayTypeMap } from "@/utils/publicData";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { message } from "ant-design-vue";
const [startIndiaTime,endIndiaTime,time] = getStartAndEndOfDay()
const props = defineProps(['thirdCode']);
const date = ref<any>();
const { getTabH } = useTabHeight();
const { t } = useI18n();
const loading = ref(false);
const today = dayjs();
const extendData = ref<any>({
  INDIAUPI:{
    totalAmountSum:0,
    totalCountSum:0,
    totalFeeSum:0
  },
  INDIABANK:{
    totalAmountSum:0,
    totalCountSum:0,
    totalFeeSum:0
  },
  USDT:{
    totalAmountSum:0,
    totalCountSum:0,
    totalFeeSum:0
  },
  TOTAL:{
    totalAmountSum:0,
    totalCountSum:0,
    totalFeeSum:0
  }
});
const query = ref({
  pageNo: 1,
  pageSize: 20,
  createTimeGe: time,
  createTimeLe: time,
  thirdCode: props.thirdCode || undefined,
  receiveMethod: null,
});
// const collAndPayMap=ref<any>({
//   1: t('m657'),
//   2: 'USDT',
//   3: 'UPI',
//   6: 'TRX',
// });
const paginationConfig = reactive({
  pageSizeOptions: ["10", "20", "50", "100"],
  showSizeChanger: true,
  total: 0,
  pageSize: 20,
  current: 1,
  showTotal: (total: any) => t("total", [total]),
});
const dataSource = ref([]);
const columns:any = reactive([
  {
    title: t('e47'),
    align: "center",
    width: 60,
    customRender:({index}:{index:any})=> index + 1
  },
  {
    title: t("n878"),
    dataIndex: "thirdCode",
    key: "thirdCode",
    width: 140,
  },
  {
    title: t("reportColumns1"),
    dataIndex: "statDate",
    key: "statDate",
    width: 140,
  },
  {
    title: t("m777"),
    dataIndex: "receiveMethod",
    key: "receiveMethod",
    width: 140,
  },
  {
    title: t("c25"),
    dataIndex: "totalActualAmount",
    key: "totalActualAmount",
    width: 180,
  },
  {
    title: t("m778"),
    dataIndex: "totalOrderCount",
    key: "totalOrderCount",
    width: 180,
  },
  {
    title: t("m264"),
    dataIndex: "totalFee",
    key: "totalFee",
    width: 180,
  },
]);
const getList = async () => {
  loading.value = true;
  const res: any = await thirdPayInfoAdminStatisticalInfo(query.value).finally(()=>loading.value = false);
  if (res && res.code == "1") {
    dataSource.value = res.data.list || [];
    extendData.value = res.data.extend || {};
    paginationConfig.total = res.data.total || 0;
    paginationConfig.current = query.value.pageNo;
    paginationConfig.pageSize = query.value.pageSize;
  }
};
const reset = () => {
  query.value = {
    pageNo: 1,
    pageSize: 20,
    createTimeGe: '',
    createTimeLe: '',
    thirdCode: props.thirdCode || undefined,
    receiveMethod: null,
  };
  getList();
}
const getChange = (value: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  paginationConfig.pageSize = pageSize;
  paginationConfig.current = current;
  getList();
};

onMounted(() => {
  getList();
  getTabH.value = useTabHeight(2).getTabH.value;
});
</script>

<style lang="less" scoped>
lable {
  display: inline-block;
  width: 100px;
}
.mb15 {
  margin-bottom: 15px;
}
</style>
