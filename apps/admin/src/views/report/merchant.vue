<template>
  <div class="search">
    <h2>{{ $t("n6") }}</h2>
    <a-row class="mb15">
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          show-search
          v-model:value="query.merchantCode"
          :options="formattedMerchantList"
          :placeholder="$t('c23')"
        >
        </a-select>
      </a-col>
      <a-col v-if="dateType==='day'">
        <!-- <a-range-picker class="searchstyle" v-model:value="searchDate" /> -->
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :num="6" :type="2"/>
      </a-col>
      <a-col v-else>
        <!-- <a-range-picker class="searchstyle" v-model:value="searchDate" :picker="dateType" /> -->
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :num="5" :type="3"/>
      </a-col>
      <a-col class="c-row c-row-bottom">
        <a-button
          class="ml15"
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          >{{ $t("search") }}</a-button
        >
        <a-button class="ml15" type="primary" @click="reset">{{
          $t("reset")
        }}</a-button>
      </a-col>
      <a-col class="c-row c-row-bottom">
        <a-button
          class="ml15"
          :type="dateType == 'day' ? 'primary' : ''"
          @click="changeDateType('day')"
          >{{ $t("p65") }}</a-button
        >
        <a-button
          class="ml15"
          :type="dateType == 'month' ? 'primary' : ''"
          @click="changeDateType('month')"
          >{{ $t("p66") }}</a-button
        >
      </a-col>
        <a-button type="primary" @click="exportList" v-permission="'admin:biMerchantDaily:export'">{{
          $t("export")
        }}</a-button>
    </a-row>
  </div>
  <a-table
    size="middle"
    :dataSource="dataSource"
    :loading="loading"
    :columns="columns"
    :pagination="paginationConfig"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    @change="getChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'merchantType'">
        {{ merchantTypeMap[record.merchantType] }}
      </template>
      <template v-if="column.key === 'payMoney'">
        {{ currency(record.payMoney, false) }}
      </template>
      <template v-if="column.key === 'paySuccessRate'">
        {{ paySuccessRateChange(record.paySuccessRate) }}
      </template>
      <template v-if="column.key === 'withdrawMoney'">
        {{ currency(record.withdrawMoney, false) }}
      </template>
      <template v-if="column.key === 'withdrawSuccessRate'">
        {{ paySuccessRateChange(record.withdrawSuccessRate) }}
      </template>
      <template v-if="column.key === 'difference'">
        {{ currency(record.difference, false) }}
      </template>
      <template v-if="column.key === 'totalFee'">
        {{ currency(record.totalFee, false) }}
      </template>
    </template>
    <template #summary>
      <a-table-summary fixed="bottom">
      <a-table-summary-row>
        <a-table-summary-cell :col-span="1" > {{ $t("m54") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="3" />
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">{{ currency(extendData.payMoneyPageTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="3" />
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger"> {{ currency(extendData.withdrawMoneyPageTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="3" />
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger"> {{ currency(extendData.differencePageTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger"> {{ currency(extendData.feePageTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
      </a-table-summary-row>
      <a-table-summary-row>
        <a-table-summary-cell :col-span="1" >{{ $t("m55") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="3" />
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger"> {{ currency(extendData.payMoneyTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="3" />
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger"> {{ currency(extendData.withdrawMoneyTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="3" />
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger"> {{ currency(extendData.differenceTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger"> {{ currency(extendData.feeTotal, false) }} </a-typography-text>
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
import { usePagination, today } from "@/plugins/dataMap";
import { onMounted } from "vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { currency } from "@/utils";
import { getMerchantInfoAdminList } from "@/api/merchant.api";
import { biMerchantDailyExport, biMerchantDailyExportMonth } from "@/api/export";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight(1);
const { t } = useI18n();
const { dateType, getBiWithdrawOrder, getMerchantOrder } = useReport();
const { paginationConfig } = usePagination();
const loading = ref(false);
const extendData = ref({});
const query = ref<any>({
  endTime: '',
  merchantCode: undefined,
  pageNo: 1,
  pageSize: 10,
  startTime: ''
});
const query2 = ref({
  account: "",
  code: "",
  merchantType: "",
  status: "",
  username: "",
  pageNo: 1,
  pageSize: 10000,
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
const merchantTypeMap = <any>{
  "1": t("n24"),
  "2": t("n25"),
};
const columns:any = reactive([
  {
    title: t("reportColumns1"),
    dataIndex: "dateTime",
    key: "dateTime",
    width: 180,
  },
  {
    title: t("c24"),
    dataIndex: "merchantName",
    key: "merchantName",
    width: 180,
  },
  {
    title: t("n30"),
    dataIndex: "merchantType",
    key: "merchantType",
    width: 180,
  },
  {
    title: t("m252"),
    dataIndex: "activationNewUser",
    key: "activationNewUser",
    width: 180,
  },
  {
    title: t("c25"),
    dataIndex: "payMoney",
    key: "payMoney",
    width: 180,
  },
  {
    title: t("c26"),
    dataIndex: "payOrderNum",
    key: "payOrderNum",
    width: 180,
  },
  {
    title: t("c27"),
    dataIndex: "paySuccessOrderNum",
    key: "paySuccessOrderNum",
    width: 210,
  },
  {
    title: t("p62"),
    dataIndex: "paySuccessRate",
    key: "paySuccessRate",
    width: 180,
  },
  {
    title: t("c29"),
    dataIndex: "withdrawMoney",
    key: "withdrawMoney",
    width: 180,
  },
  {
    title: t("c30"),
    dataIndex: "withdrawOrderNum",
    key: "withdrawOrderNum",
    width: 180,
  },
  {
    title: t("c31"),
    dataIndex: "withdrawSuccessOrderNum",
    key: "withdrawSuccessOrderNum",
    width: 200,
  },
  {
    title: t("p63"),
    dataIndex: "withdrawSuccessRate",
    key: "withdrawSuccessRate",
    width: 180,
  },
  {
    title: t("c32"),
    dataIndex: "difference",
    key: "difference",
    width: 180,
  },
  {
    title: t("reportColumns7"),
    dataIndex: "totalFee",
    key: "totalFee",
    width: 210,
  },
]);
const getList = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    paginationConfig.current = 1;
  }
  let res;
  loading.value = true;
  res = await getMerchantOrder()(Object.assign({}, query.value)).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data || [];
    extendData.value = res.extend;
    paginationConfig.total = res.total || 0;
  }
};
const merchantList = ref([]);
const getMerchantList = async (query2: any) => {
  const res: any = await getMerchantInfoAdminList({pageNo: 1, pageSize: 10000});
  if (res && res.code === "1") {
    merchantList.value = res.data;
    console.log(merchantList)
  }
};
const formattedMerchantList = computed(() =>
  merchantList.value.map(({ code, username }) => ({
    value: code,
    label: username,
  }))
);
const paySuccessRateChange = (value:any) =>{
  return (value * 100).toFixed(0) + '%';
};
const changeDateType = async (type: any) => {
  dateType.value = type;
  query.value = {
    endTime: '',
    pageNo: 1,
    pageSize: 10,
    startTime: '',
  };
  paginationConfig.pageSize = 10;
  getList();
};
const reset = () => {
  query.value = {
    endTime: '',
    pageNo: 1,
    pageSize: 10,
    startTime: '',
  };
  paginationConfig.current = 1;
  paginationConfig.pageSize = 10;
  getList();
};
const getChange = (value: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  paginationConfig.current = current;
  paginationConfig.pageSize = pageSize;
  getList();
};
const exportList = async () => {
  if(dateType.value == 'month'){
    biMerchantDailyExportMonth(query.value);
  }else{
    biMerchantDailyExport(query.value);
  }
};
onMounted(() => {
  getList();
  getMerchantList(query2.value);
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>

<style lang="less" scoped>
lable {
  display: inline-block;
  width: 100px;
}
</style>
