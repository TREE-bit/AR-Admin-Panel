<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          allow-clear
          v-model:value="query.phoneNumber "
          class="searchstyle"
          :placeholder="$t('m591')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.bankCode"
          :options="groupList"
          :placeholder="$t('m582')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <!-- <a-col :span="3">
        <a-input-number
          v-model:value="query.cnt  "
          class="searchstyle"
          :min="0"
          :placeholder="$t('n799')"
        />
      </a-col> -->
      <a-col>
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('m195')" :type="2"/>
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
      <template v-if="column.key === 'phoneNumber'">
        {{
          record.phoneNumber || '-'
        }}
      </template>
      <template v-if="column.key === 'bankCode'">
        {{
          record.bankCode || '-'
        }}
      </template>
      <template v-if="column.key === 'cnt'">
        {{
          record.cnt || '-'
        }}
      </template>
      <template v-if="column.key === 'sendTime'">
        {{
          record.sendTime || '-'
        }}
      </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'phoneNumber'"
        />
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { kycSendSmsSuccessStatisticsListPage, getKycBankCodeList } from "@/api/kycConfig.api";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const [,,inputTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
const dataSource = ref([]);
const extendData = ref({
  cntPageTotal: 0,
  cntTotal: 0,
});
const loading = ref(false);
const query = ref({
  asc: false,
  column: "cnt",
  pageNo: 1,
  pageSize: 20,
  bankCode: undefined,
  cnt: undefined,
  phoneNumber:undefined,
  startTime: inputTime,
  endTime: inputTime,
});
const columns:any = [
  {
    title: t("m591"),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
    width: 150,
  },
  {
    title: t("m582"),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 150,
  },
  {
    title: t("n799"),
    dataIndex: "cnt",
    key: "cnt",
    align: "center",
    sorter: true,
    width: 150,
  },
  {
    title: t("m195"),
    dataIndex: "sendTime",
    key: "sendTime",
    sorter: true,
    align: "center",
    width: 150,
  },
];
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      cnt: extendData.value.cntPageTotal || 0,
    },
  },
  {
    label: t("m55"),
    fields: {
      cnt: extendData.value.cntTotal || 0,
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
  const res: any = await kycSendSmsSuccessStatisticsListPage(query.value).finally(()=>loading.value = false);
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
    column: "cnt",
    pageNo: 1,
    pageSize: 20,
    bankCode: undefined,
    cnt: undefined,
    phoneNumber:undefined,
    startTime: '',
    endTime: '',
  };
  pagination.value.pageSize = 20;
  pagination.value.current = 1;
  getList();
};

const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data.map((item: any) => ({
      value: item,
      label: item,
    }));
  }
};

onMounted(() => {
  getGroupList();
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
