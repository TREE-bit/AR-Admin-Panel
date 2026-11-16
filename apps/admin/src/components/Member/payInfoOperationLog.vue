<template>
  <div class="search">
    <h2>{{ $t('n1149') }}</h2>
  </div>
  <div class="kycConnectLogTable">
    <a-table
      :dataSource="dataList"
      :columns="columns"
      :pagination="pagination"
      :scroll="{ x: '100%' , y: getTabH + 'px'}"
      :loading="loading"
      size="small"
      @change="handleTableChange"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'remark'">
        <a-tooltip v-if="record.remark">
          <template #title>
            {{ record.remark }}
          </template>
          <div class="toopTipStyle">
            {{ record.remark  }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip v-if="record.upiId">
          <template #title>
            {{ record.upiId }}
          </template>
          <div class="toopTipStyle">
            {{ record.upiId  }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'operationTime'">
        {{ record.operationTime || '-' }}
      </template>
      <template v-if="column.key ==='operationContent'">
        {{ record.operationContent ? $t($getMapItem(operationContentMap,record.operationContent)) : '-' }}
      </template>
      <template v-if="column.key === 'createdBy'">
        {{ record.createdBy || '-' }}
      </template>
      <template v-if="column.key === 'disableTimes'">
        <div v-if="record.operationContent == 4 && record.disableTimes == 0">
          {{ $t('n1153') }}
        </div>
        <div v-else-if="record.operationContent == 4">
          {{ formatTime(Number(record.disableTimes)*60) }}
        </div>
        <div v-else>-</div>
      </template>
    </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import {
  collectionInfoAdminOperationLog
} from "@/api/kycConfig.api";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { operationContentMap} from "@/utils/publicData";
import { useI18n } from "vue-i18n";
import { clearSelected } from "@/hooks/useSelected.hook";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import { ref, onMounted, h} from "vue"
import { formatTime } from "@/utils/index";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const props = defineProps({
  upiId: {
    type: String,
    default: "",
  },
});
const loading = ref(false);
const dataList = ref([]);
const query = ref({
  asc:false,
  pageNo: 1,
  pageSize: 20,
  upiId: props.upiId,
});
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const columns:any = [
  {
    title: 'UPI ID',
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
  },
  {
    title: t('l67'),
    dataIndex: "operationTime",
    key: "operationTime",
    align: "center",
    width: 140,
  },
  {
    title: t('n981'),
    dataIndex: "operationContent",
    key: "operationContent",
    align: "center",
    width: 90,
  },
  {
    title: t('l48'),
    dataIndex: "createdBy",
    key: "createdBy",
    align: "center",
    width: 160,
  },
  {
    title: t('remark'),
    dataIndex: "remark",
    key: "remark",
    align: "center",
    width: 120,
  },
  {
    title: t('n1150'),
    dataIndex: "disableTimes",
    key: "disableTimes",
    align: "center",
    width: 80,
  },
];
const getList = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  const res: any = await collectionInfoAdminOperationLog(query.value).finally(() => loading.value = false);
  if (res && res.code == "1") {
    dataList.value = res.data;
    pagination.value.total = res.total;
    pagination.value.pageSize = query.value.pageSize;
    pagination.value.current = query.value.pageNo;
    clearSelected();
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

onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3,80).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.ant-table-cell) {
  padding: 0 !important;
}
</style>
