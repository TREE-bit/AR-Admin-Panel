<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.kycId"
          allow-clear
          class="searchstyle"
          placeholder="KYC ID"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.upiId"
          allow-clear
          class="searchstyle"
          placeholder="UPI ID"
        />
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('n798')" :type="2"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search()"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'kycId'">
        {{
          record.kycId || '-'
        }}
        <CopyOutlined v-if="record.kycId" class="copyId"  @click="$copyId(record.kycId)" />
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip v-if="record.upiId">
          <template #title>
            {{ record.upiId }}
            <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />
          </template>
          <div class="toopTipStyle">
            {{
              record.upiId
            }}
          <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />
          </div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'todayBuySuccessRate'">
        {{
          record.todayBuySuccessRate ? ((Number(record.todayBuySuccessRate)*100).toFixed(0) + '%') : '-'
        }}
      </template>
      <template v-if="column.key === 'todaySellSuccessRate'">
        {{
          record.todaySellSuccessRate ? ((Number(record.todayBuySuccessRate)*100).toFixed(0) + '%') : '-'
        }}
      </template>
      <template v-if="column.key === 'statDate'">
        {{
          record.statDate || '-'
        }}
      </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'kycId'"
        />
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { kycDataStatDayManagerListPage } from "@/api/kycConfig.api";
import { useI18n } from "vue-i18n";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { toFixed } from "ant-design-vue/es/input-number/src/utils/MiniDecimal";
const { getTabH } = useTabHeight();
const [,,inputTime] = getStartAndEndOfDay()
const { t } = useI18n();
const dataSource = ref([]);
const extendData = ref({
  todaySuccessSellPageTotalAmount: 0,
  todaySuccessBuyPageTotalAmount: 0,
  todaySuccessSellPageTotalCount: 0,
  todaySuccessBuyPageTotalCount: 0,
  todaySuccessBuyTotalAmount: 0,
  todaySuccessSellTotalAmount: 0,
  todaySuccessBuyTotalCount: 0,
  todaySuccessSellTotalCount: 0,
});
const loading = ref(false);
const query = ref({
  asc: false,
  column: "todaySuccessBuyCount",
  pageNo: 1,
  pageSize: 20,
  kycId: undefined,
  upiId: undefined,
  startTime: inputTime,
  endTime: inputTime,
});
const columns:any = [
  {
    title: "KYC ID",
    dataIndex: "kycId",
    key: "kycId",
    align: "center",
    width: 180,
  },
  {
    title: "UPI ID",
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
  },
  {
    title: t("m799"),
    dataIndex: "todaySuccessBuyCount",
    key: "todaySuccessBuyCount",
    align: "center",
    sorter: true,
    width: 150,
  },
  {
    title: t("m798"),
    dataIndex: "todaySuccessBuyAmount",
    key: "todaySuccessBuyAmount",
    align: "center",
    sorter: true,
    width: 150,
  },
  {
    title: t("m146"),
    dataIndex: "todayBuySuccessRate",
    key: "todayBuySuccessRate",
    align: "center",
    width: 150,
  },
  {
    title: t("m796"),
    dataIndex: "todaySuccessSellCount",
    key: "todaySuccessSellCount",
    align: "center",
    sorter: true,
    width: 150,
  },
  {
    title: t("m795"),
    dataIndex: "todaySuccessSellAmount",
    key: "todaySuccessSellAmount",
    align: "center",
    sorter: true,
    width: 150,
  },
  {
    title: t("m144"),
    dataIndex: "todaySellSuccessRate",
    key: "todaySellSuccessRate",
    align: "center",
    width: 150,
  },
  {
    title: t("n798"),
    dataIndex: "statDate",
    key: "statDate",
    align: "center",
    sorter: true,
    width: 100,
  },
];
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      todaySuccessBuyCount: extendData.value.todaySuccessBuyPageTotalCount || 0,
      todaySuccessBuyAmount: extendData.value.todaySuccessBuyPageTotalAmount || 0,
      todaySuccessSellCount: extendData.value.todaySuccessSellPageTotalCount || 0,
      todaySuccessSellAmount: extendData.value.todaySuccessSellPageTotalAmount || 0,
    },
  },
  {
    label: t("m55"),
    fields: {
      todaySuccessBuyCount: extendData.value.todaySuccessBuyTotalCount || 0,
      todaySuccessBuyAmount: extendData.value.todaySuccessBuyTotalAmount || 0,
      todaySuccessSellCount: extendData.value.todaySuccessSellTotalCount || 0,
      todaySuccessSellAmount: extendData.value.todaySuccessSellTotalAmount || 0,
    },
  },
]);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async () => {
  loading.value = true;
  pagination.value.current = query.value.pageNo;
  pagination.value.pageSize = query.value.pageSize;
  const res: any = await kycDataStatDayManagerListPage(query.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    extendData.value = res.extend || {};
    pagination.value.total = res.total;
  }
};
const { handleTableChange } = useTableChange({
  query,
  pagination,
  getList,
  filterRules: [],
});
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//   pagination.value.current = pag.current;
//   pagination.value.pageSize = pag.pageSize;
//   query.value.pageNo = pag.current;
//   query.value.pageSize = pag.pageSize;
//   getList();
// };
const search = () => {
  query.value.pageNo = 1;
  pagination.value.current = 1;
  getList();
}
const resetQuery = () => {
  query.value = {
    asc: false,
    column: "todaySuccessBuyCount",
    pageNo: 1,
    pageSize: 20,
    kycId: undefined,
    upiId: undefined,
    startTime: '',
    endTime: '',
  };
  pagination.value.pageSize = 20;
  pagination.value.current = 1;
  getList();
};


onMounted(() => {
  getList();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.ant-picker-range-separator) {
  display: none;
}
:deep(.windActive){
  font-weight: 600;
  color: red;
}
</style>
