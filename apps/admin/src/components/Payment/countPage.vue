<template>
  <div class="search">
    <a-row class="mb15">
      <a-col :span="4">
        <a-range-picker class="searchstyle" v-model:value="searchDate" />
      </a-col>
      <a-col class="c-row c-row-bottom">
        <a-button
          class="ml15"
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList()"
          >{{ $t("search") }}</a-button
        >
      </a-col>
    </a-row>
  </div>
  <a-table
    size="middle"
    :dataSource="selPayType?dataSourceFilter:dataSource"
    :loading="loading"
    :columns="columns"
    :scroll="{ x: 'max-content' , y : getTabH+'px' }"
    :pagination="false"
    @change="getChange"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'collectionMoney'">
        {{ thousand(record.collectionMoney) }}
      </template>
      <template v-if="column.dataIndex === 'collectionCount'">
        {{ thousand(record.collectionCount) }}
      </template>
      <template v-if="column.dataIndex === 'paymentMoney'">
        {{ thousand(record.paymentMoney) }}
      </template>
      <template v-if="column.dataIndex === 'paymentCount'">
        {{ thousand(record.paymentCount) }}
      </template>
    </template>
    <template #summary>
      <a-table-summary fixed="bottom">
      <a-table-summary-row>
        <a-table-summary-cell :col-span="2" align="left"> {{ $t("m55") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="left">
          <a-typography-text type="danger">{{ thousand(extendData.totalCollectionMoney) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="left">
          <a-typography-text type="danger">{{ thousand(extendData.totalCollectionCount) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="left">
          <a-typography-text type="danger">{{ thousand(extendData.totalPaymentMoney) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="left">
          <a-typography-text type="danger">{{ thousand(extendData.totalPaymentCount) }}</a-typography-text>
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
  thirdChannelListPage,
  payConfigAdminListConfig,
 } from "@/api/channel.api";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { currency, thousand } from "@/utils";
import { formatTime } from "@/utils/index";
import { biPaymentOrderExport,biPaymentOrderExportMonth } from "@/api/export";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { message } from "ant-design-vue";
const props = defineProps(['thirdCode','typeList']);
const date = ref<any>();
const { getTabH } = useTabHeight();
const { t } = useI18n();
const { dateType, getBiWithdrawOrder } = useReport();
const loading = ref(false);
const today = dayjs();
const extendData = ref<any>({});
const query = ref<any>({
  endDate: today.endOf(dateType.value),
  startDate: today.startOf(dateType.value),
  thirdCode: undefined,
});
// const collAndPayMap=ref<any>({
//   1: t('m657'),
//   2: 'USDT',
//   3: 'UPI',
//   6: 'TRX',
// });
const selPayType = ref(undefined);
const paginationConfig = reactive({
  pageSizeOptions: ["10", "20", "50", "100"],
  showSizeChanger: true,
  total: 0,
  current: 1,
  showTotal: (total: any) => t("total", [total]),
});
const dataSource = ref([]);
const searchDate = computed({
  get: () => {
    return [query.value.startDate, query.value.endDate];
  },
  set: (val) => {
    query.value.startDate = val ? val[0].startOf(dateType.value) : "";
    query.value.endDate = val ? val[1].endOf(dateType.value) : "";
  },
});
const setDefaultData = () => {
  const currentDateStart = dayjs().subtract(7, 'day');
  const currentDate = dayjs().subtract(0, 'day');
  query.value.startDate = currentDateStart;
  query.value.endDate = currentDate;
}
const columns:any = reactive([
  {
    title: t('e47'),
    align: "center",
    width: 60,
    customRender:({index}:{index:any})=> index + 1
  },
  {
    title: t("reportColumns1"),
    dataIndex: "reportDate",
    key: "reportDate",
    width: 140,
  },
  {
    title: t("c25"),
    dataIndex: "collectionMoney",
    key: "collectionMoney",
    width: 180,
  },
  {
    title: t("m778"),
    dataIndex: "collectionCount",
    key: "collectionCount",
    width: 180,
  },
  {
    title: t("c29"),
    dataIndex: "paymentMoney",
    key: "paymentMoney",
    width: 180,
  },
  {
    title: t("m779"),
    dataIndex: "paymentCount",
    key: "paymentCount",
    width: 180,
  },
]);
const dataSourceFilter = ref([]);
const payTypeChange = (value: any) => {
  dataSourceFilter.value = dataSource.value.filter((item: any) => item.payType == value);
}

const getList = async () => {
  if (!query.value.endDate) {
    message.error(t('m563')+t("m514"));
    return;
  }
  const time = {
      endDate: query.value.endDate.format(
        dateType.value == "day" ? "YYYY-MM-DD" : "YYYY-MM"
      ),
      startDate: query.value.startDate.format(
        dateType.value == "day" ? "YYYY-MM-DD" : "YYYY-MM"
      ),
    };
  loading.value = true;
  const res: any = await thirdChannelListPage(Object.assign({}, query.value, time)).finally(()=>loading.value = false);
  if (res && res.code == "1") {
    dataSource.value = res.data.channelDayDetailReportDTOList || [];
    extendData.value = res.data.channelDaySummaryDTO || {};
    paginationConfig.total = res.total || 0;
  }
};
const getChange = (value: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  paginationConfig.pageSize = pageSize;
  paginationConfig.current = current;
  getList();
};

onMounted(() => {
  setDefaultData();
  query.value.thirdCode = props.thirdCode || localStorage.getItem('thirdCode');
  getList();
  getTabH.value = useTabHeight().getTabH.value;
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
