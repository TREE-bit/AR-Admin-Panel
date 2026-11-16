<template>
  <div class="search sell-out-import-search">
    <a-row>
      <a-col :span="4">
        <a-input
          v-trim
          class="searchstyle"
          v-model:value="importQuery.importBatchNo"
          :placeholder="t('sellOutImportBatchNo')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim class="searchstyle" v-model:value="importQuery.operatorName" :placeholder="t('m240')" />
      </a-col>
      <a-col :span="4">
        <a-select
          class="searchstyle"
          v-model:value="importQuery.batchStatus"
          :placeholder="t('sellOutImportBatchStatus')"
          :allowClear="true"
          :options="importBatchStatusOptions"
        />
      </a-col>
      <a-col>
        <timeRange
          v-model:startTime="importQuery.importTimeGte"
          v-model:endTime="importQuery.importTimeLte"
          :title="t('sellOutImportTime')"
          :type="1"
        />
      </a-col>
      <a-col>
        <a-button type="primary" :loading="importLoading" :icon="h(SearchOutlined)" @click="getImportList(1)">
          {{ t("search") }}
        </a-button>
        <a-button type="primary" :loading="importLoading" @click="resetImportQueryForm">{{ t("reset") }}</a-button>
      </a-col>
    </a-row>
  </div>

  <a-table
    :class="['sell-out-log-table', 'sell-out-main-table', { 'sell-out-main-table--sticky': importNeedBottomSticky }]"
    :dataSource="importDataSource"
    :columns="importColumns"
    :pagination="importPagination"
    :loading="importLoading"
    :style="mainTableStyle"
    :scroll="{ x: '100%', y: getTabH + 'px' }"
    @change="handleImportTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'batchStatus'">
        <a-tag
          v-if="record.batchStatus !== undefined && record.batchStatus !== null && record.batchStatus !== ''"
          :color="getImportBatchStatusTagColor(record.batchStatus)"
        >
          {{ importBatchStatusMap[String(record.batchStatus)] || record.batchStatus }}
        </a-tag>
        <span v-else>-</span>
      </template>
      <template v-else-if="column.key === 'importBatchNo'">
        <a-tooltip v-if="record.importBatchNo">
          <template #title>{{ record.importBatchNo }}</template>
          <a class="import-batch-link" @click.prevent="openImportBatchDetailModal(record)">{{ record.importBatchNo }}</a>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-else-if="['pendingCount','successCount','failedCount'].includes(column.key)">
        <span class="import-count-text" :class="getImportCountHighlightClass(column.key, record[column.key])">
          {{ formatImportCountValue(record[column.key]) }}
        </span>
      </template>
      <template v-else-if="['fileName','merchantCode','merchantMemberId','operatorName','requestIp'].includes(column.key)">
        <a-tooltip v-if="record[column.key]">
          <template #title>{{ record[column.key] }}</template>
          <div class="toopTipStyle2 cell-center">{{ record[column.key] }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
    </template>
  </a-table>

  <a-modal
    v-model:open="importBatchDetailModalOpen"
    :title="importBatchDetailModalTitle"
    width="1260px"
    :footer="null"
    @cancel="closeImportBatchDetailModal"
  >
    <div class="search import-detail-search">
      <a-row>
        <a-col :span="4">
          <a-input
            v-trim
            class="searchstyle"
            v-model:value="importBatchDetailQuery.merchantTradeNo"
            :placeholder="t('l96')"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            class="searchstyle"
            v-model:value="importBatchDetailQuery.processStatus"
            :placeholder="t('sellOutImportProcessStatus')"
            :allowClear="true"
            :options="importDetailProcessStatusOptions"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            class="searchstyle"
            v-model:value="importBatchDetailQuery.channel"
            :placeholder="t('sellOutLogChannel')"
            :allowClear="true"
            :options="channelOptions"
          />
        </a-col>
        <a-col v-if="String(importBatchDetailQuery.channel) === '1'" :span="4">
          <a-input
            v-trim
            class="searchstyle"
            v-model:value="importBatchDetailQuery.bankCardNumber"
            :placeholder="t('sellOutBankCardNumberRequired')"
          />
        </a-col>
        <a-col v-else-if="String(importBatchDetailQuery.channel) === '3'" :span="4">
          <a-input
            v-trim
            class="searchstyle"
            v-model:value="importBatchDetailQuery.upiId"
            :placeholder="t('sellOutUpiIdRequired')"
          />
        </a-col>
        <a-col>
          <a-button
            type="primary"
            :loading="importBatchDetailLoading"
            :icon="h(SearchOutlined)"
            @click="getImportBatchDetailList(1)"
          >
            {{ t("search") }}
          </a-button>
          <a-button type="primary" :loading="importBatchDetailLoading" @click="resetImportBatchDetailQuery">
            {{ t("reset") }}
          </a-button>
        </a-col>
      </a-row>
    </div>

    <a-table
      class="sell-out-log-table import-batch-detail-table"
      :dataSource="importBatchDetailDataSource"
      :columns="importBatchDetailColumns"
      :pagination="importBatchDetailPagination"
      :loading="importBatchDetailLoading"
      :scroll="{ x: 1200, y: 420 }"
      @change="handleImportBatchDetailTableChange"
      bordered
      :row-key="(record: any) => JSON.stringify(record)"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'processStatus'">
          <a-tag
            v-if="record.processStatus !== undefined && record.processStatus !== null && record.processStatus !== ''"
            :color="getImportDetailProcessStatusTagColor(record.processStatus)"
          >
            {{ importDetailProcessStatusMap[String(record.processStatus)] || record.processStatus }}
          </a-tag>
          <span v-else>-</span>
        </template>

        <template v-else-if="column.key === 'receiverInfo'">
          <a-tooltip v-if="String(record.channel) === '3' && record.upiId">
            <template #title>
              {{ t("sellOutTabUpi") }}: {{ record.upiId }}
              <CopyOutlined v-if="record.upiId" class="copyId" @click="$copyId(record.upiId)" />
            </template>
            <div class="tableText toopTipStyle receiver-info-wrap receiver-info-line">
              {{ t("sellOutTabUpi") }}: {{ record.upiId }}
              <CopyOutlined v-if="record.upiId" class="copyId" @click="$copyId(record.upiId)" />
            </div>
          </a-tooltip>
          <div v-else-if="String(record.channel) === '1'" class="tableText receiver-info-wrap">
            <div class="toopTipStyle receiver-info-line">
              {{ t("m657") }}: {{ record.bankCardNumber || "-" }}
              <CopyOutlined v-if="record.bankCardNumber" class="copyId" @click="$copyId(record.bankCardNumber)" />
            </div>
            <div class="toopTipStyle receiver-info-line">
              {{ t("m581") }}: {{ record.bankName || "-" }}
              <CopyOutlined v-if="record.bankName" class="copyId" @click="$copyId(record.bankName)" />
            </div>
            <div class="toopTipStyle receiver-info-line">
              {{ t("sellOutIfsc") }}: {{ record.ifsc || "-" }}
              <CopyOutlined v-if="record.ifsc" class="copyId" @click="$copyId(record.ifsc)" />
            </div>
          </div>
          <span v-else>-</span>
        </template>

        <template v-else-if="['merchantTradeNo','processMsg','remark'].includes(column.key)">
          <a-tooltip v-if="record[column.key]">
            <template #title>{{ record[column.key] }}</template>
            <div class="toopTipStyle2 cell-center">{{ record[column.key] }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
      </template>

      <template #summary>
        <SummaryBottom
          :summaryRows="importBatchDetailSummaryRows"
          :dynamicColumns="importBatchDetailColumns"
          :firstColumnLabel="'merchantTradeNo'"
        />
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
import { CopyOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  getQuickUpiOrBankImportBatchListPage,
  getQuickUpiOrBankImportOrderRecordListPage,
} from "@/api/order.api";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { currency } from "@/utils";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";

const { getTabH } = useTabHeight();
const { t } = useI18n();
const [startIndiaTime, endIndiaTime] = getStartAndEndOfDay();

const channelMap: any = {
  "1": t("m657"),
  "3": t("sellOutTabUpi"),
};
const channelOptions = Object.entries(channelMap).map(([value, label]) => ({ value, label }));

const importBatchStatusMap: any = {
  PENDING: t("sellOutImportStatusPending"),
  PROCESSING: t("sellOutImportStatusProcessing"),
  FINISHED: t("sellOutImportStatusFinished"),
};
const importBatchStatusTagColorMap: any = {
  PENDING: "orange",
  PROCESSING: "blue",
  FINISHED: "green",
};
const importBatchStatusOptions = Object.entries(importBatchStatusMap).map(([value, label]) => ({ value, label }));
const getImportBatchStatusTagColor = (status: string) => {
  return importBatchStatusTagColorMap[String(status)] || "default";
};

const formatImportCountValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const getImportCountHighlightClass = (columnKey: string, value: unknown) => {
  const countValue = Number(value);
  if (!Number.isFinite(countValue) || countValue <= 0) return "";
  if (columnKey === "failedCount") return "import-count-danger";
  if (columnKey === "successCount") return "import-count-success";
  if (columnKey === "pendingCount") return "import-count-pending";
  return "";
};

const importDetailProcessStatusMap: any = {
  PENDING: t("sellOutImportDetailStatusPending"),
  PROCESSING: t("sellOutImportDetailStatusProcessing"),
  SUCCESS: t("sellOutImportDetailStatusSuccess"),
  FAILED: t("sellOutImportDetailStatusFailed"),
};
const importDetailProcessStatusTagColorMap: any = {
  PENDING: "orange",
  PROCESSING: "blue",
  SUCCESS: "green",
  FAILED: "red",
};
const importDetailProcessStatusOptions = Object.entries(importDetailProcessStatusMap).map(([value, label]) => ({
  value,
  label,
}));
const getImportDetailProcessStatusTagColor = (status: string) => {
  return importDetailProcessStatusTagColorMap[String(status)] || "default";
};

const createDefaultImportQuery = () => ({
  batchStatus: undefined,
  direction: "",
  firstPage: true,
  importBatchNo: "",
  importTimeGte: startIndiaTime,
  importTimeLte: endIndiaTime,
  lastPage: false,
  nextColValue: "",
  nextCursorId: "",
  operatorName: "",
  pageNo: 1,
  pageSize: 20,
  prevColValue: "",
  prevCursorId: "",
});

const createDefaultImportBatchDetailQuery = (importBatchNo = "") => ({
  bankCardNumber: "",
  channel: undefined,
  direction: "",
  firstPage: true,
  importBatchNo,
  lastPage: false,
  merchantTradeNo: "",
  nextColValue: "",
  nextCursorId: "",
  operatorName: "",
  pageNo: 1,
  pageSize: 20,
  processStatus: undefined,
  prevColValue: "",
  prevCursorId: "",
  upiId: "",
});

const importQuery = ref<any>(createDefaultImportQuery());
const importBatchDetailQuery = ref<any>(createDefaultImportBatchDetailQuery());
const importBatchDetailModalOpen = ref(false);
const activeImportBatchNo = ref("");
const importNeedBottomSticky = ref(false);

const importBatchDetailModalTitle = computed(() => {
  return `${t("sellOutImportBatchNo")}��${activeImportBatchNo.value || "-"}`;
});

const importColumns: any = [
  { title: t("sellOutImportBatchNo"), dataIndex: "importBatchNo", key: "importBatchNo", align: "center", width: 220 },
  { title: t("sellOutImportBatchStatus"), dataIndex: "batchStatus", key: "batchStatus", align: "center", width: 130 },
  { title: t("sellOutImportFileName"), dataIndex: "fileName", key: "fileName", align: "center", width: 220 },
  { title: t("sellOutImportTotalCount"), dataIndex: "totalCount", key: "totalCount", align: "center", width: 110 },
  { title: t("sellOutImportPendingCount"), dataIndex: "pendingCount", key: "pendingCount", align: "center", width: 110 },
  { title: t("sellOutImportSuccessCount"), dataIndex: "successCount", key: "successCount", align: "center", width: 110 },
  { title: t("sellOutImportFailedCount"), dataIndex: "failedCount", key: "failedCount", align: "center", width: 110 },
  { title: t("n9"), dataIndex: "merchantCode", key: "merchantCode", align: "center", width: 120 },
  { title: t("m207"), dataIndex: "merchantMemberId", key: "merchantMemberId", align: "center", width: 140 },
  { title: t("l48"), dataIndex: "operatorName", key: "operatorName", align: "center", width: 120 },
  { title: t("sellOutLogRequestIp"), dataIndex: "requestIp", key: "requestIp", align: "center", width: 130 },
  { title: t("sellOutImportTime"), dataIndex: "importTime", key: "importTime", align: "center", width: 170 },
  { title: t("sellOutImportFinishTime"), dataIndex: "finishTime", key: "finishTime", align: "center", width: 170 },
];

const importBatchDetailColumns: any = [
  { title: t("l96"), dataIndex: "merchantTradeNo", key: "merchantTradeNo", align: "center", width: 210 },
  { title: t("n42"), dataIndex: "amount", key: "amount", align: "center", width: 120 },
  { title: t("m36"), dataIndex: "receiverInfo", key: "receiverInfo", align: "center", width: 260 },
  { title: t("sellOutImportProcessStatus"), dataIndex: "processStatus", key: "processStatus", align: "center", width: 140 },
  { title: t("sellOutImportProcessTime"), dataIndex: "processTime", key: "processTime", align: "center", width: 170 },
  { title: t("sellOutImportProcessMsg"), dataIndex: "processMsg", key: "processMsg", align: "center", width: 260 },
  { title: t("sellOutRemark"), dataIndex: "remark", key: "remark", align: "center", width: 260 },
];

const {
  dataSource: importDataSource,
  pagination: importPagination,
  loading: importLoading,
  handleTableChange: handleImportTableChange,
  getList: getImportList,
} = useTableData({
  query: importQuery,
  api: getQuickUpiOrBankImportBatchListPage,
  defaultPageSize: 20,
  filterRules: [],
  resDataType: 2,
  fetchType: 2,
});

const {
  dataSource: importBatchDetailDataSource,
  pagination: importBatchDetailPagination,
  loading: importBatchDetailLoading,
  handleTableChange: handleImportBatchDetailTableChange,
  getList: getImportBatchDetailList,
  extendData: importBatchDetailExtendData,
} = useTableData({
  query: importBatchDetailQuery,
  api: getQuickUpiOrBankImportOrderRecordListPage,
  defaultPageSize: 20,
  filterRules: [],
  resDataType: 2,
  fetchType: 2,
});

const importBatchDetailSummaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      amount: `${currency(String(importBatchDetailExtendData.value?.amountPageTotal ?? 0), false)}`,
    },
    fixedPositions: {
      amount: 1,
    },
  },
  {
    label: t("m55"),
    fields: {
      amount: `${currency(String(importBatchDetailExtendData.value?.amountTotal ?? 0), false)}`,
    },
    fixedPositions: {
      amount: 1,
    },
  },
]);

watch(
  () => importBatchDetailQuery.value.channel,
  (channel) => {
    const channelValue = String(channel);
    if (channelValue !== "1") importBatchDetailQuery.value.bankCardNumber = "";
    if (channelValue !== "3") importBatchDetailQuery.value.upiId = "";
  }
);

const getElementOuterHeight = (element: HTMLElement | null) => {
  if (!element) return 0;
  const styles = window.getComputedStyle(element);
  const marginTop = Number.parseFloat(styles.marginTop || "0") || 0;
  const marginBottom = Number.parseFloat(styles.marginBottom || "0") || 0;
  return element.offsetHeight + marginTop + marginBottom;
};

const syncMainTableStickyState = () => {
  nextTick(() => {
    requestAnimationFrame(() => {
      const tableElement = document.querySelector(".sell-out-main-table") as HTMLElement | null;
      const tableBody = tableElement?.querySelector(".ant-table-body") as HTMLElement | null;
      importNeedBottomSticky.value = !!tableBody && tableBody.scrollHeight - tableBody.clientHeight > 1;
    });
  });
};


const resetImportQueryForm = () => {
  importQuery.value = {
    ...createDefaultImportQuery(),
    importTimeGte: "",
    importTimeLte: "",
  };
  getImportList(1);
};

const resetImportBatchDetailQuery = () => {
  importBatchDetailQuery.value = {
    ...createDefaultImportBatchDetailQuery(activeImportBatchNo.value),
  };
  getImportBatchDetailList(1);
};

const openImportBatchDetailModal = (record: any) => {
  const importBatchNo = record?.importBatchNo ? String(record.importBatchNo) : "";
  if (!importBatchNo) return;
  activeImportBatchNo.value = importBatchNo;
  importBatchDetailQuery.value = createDefaultImportBatchDetailQuery(importBatchNo);
  importBatchDetailModalOpen.value = true;
  getImportBatchDetailList(1);
};

const closeImportBatchDetailModal = () => {
  importBatchDetailModalOpen.value = false;
  activeImportBatchNo.value = "";
};


onMounted(() => {
  getImportList(1);
  getTabH.value = useTabHeight(1,100).getTabH.value;
});


</script>

<style scoped lang="less">
:deep(.ant-picker-range-separator) {
  display: none;
}

.sell-out-log-table :deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
}

.sell-out-log-table :deep(.ant-table-tbody > tr > td) {
  vertical-align: middle;
}

.sell-out-log-table :deep(.cell-center) {
  text-align: center;
}

.sell-out-log-table :deep(.copyId) {
  cursor: pointer;
  color: #1890ff;
  margin-left: 2px;
  flex-shrink: 0;
}

.sell-out-log-table :deep(.receiver-info-wrap) {
  padding: 2px 4px;
}

.sell-out-log-table :deep(.receiver-info-line) {
  line-height: 1.6;
}

.sell-out-log-table :deep(.import-batch-link) {
  color: #1677ff;
  cursor: pointer;
}

.sell-out-log-table :deep(.import-batch-link:hover) {
  color: #4096ff;
  text-decoration: underline;
}

.sell-out-log-table :deep(.import-count-text) {
  font-size: 15px;
  font-weight: 600;
}

.sell-out-log-table :deep(.import-count-danger) {
  color: #ff4d4f;
}

.sell-out-log-table :deep(.import-count-success) {
  color: #52c41a;
}

.sell-out-log-table :deep(.import-count-pending) {
  color: #1677ff;
}

.sell-out-main-table--sticky :deep(.ant-table-body) {
  min-height: var(--sell-out-main-table-y, 280px);
}

.sell-out-main-table--sticky :deep(.ant-table-content),
.sell-out-main-table--sticky :deep(.ant-table-container) {
  min-height: var(--sell-out-main-table-y, 280px);
}

.sell-out-main-table--sticky :deep(.ant-table-summary) {
  position: sticky;
  bottom: 52px;
  z-index: 2;
  background: #fff;
}

.sell-out-main-table--sticky :deep(.ant-table-summary td),
.sell-out-main-table--sticky :deep(.ant-table-summary th) {
  background: #fff;
}

.sell-out-main-table--sticky :deep(.ant-table-pagination.ant-pagination) {
  position: sticky;
  bottom: 0;
  z-index: 3;
  margin-bottom: 0 !important;
  padding: 8px 12px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.import-detail-search {
  margin-bottom: 8px;
}
</style>
