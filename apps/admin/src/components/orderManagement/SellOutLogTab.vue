<template>
  <div class="search sell-out-log-search">
    <a-row>
      <a-col :span="3">
        <a-input v-trim class="searchstyle" v-model:value="query.merchantTradeNo" :placeholder="t('l96')" />
      </a-col>
      <a-col :span="3">
        <a-input
          v-trim
          class="searchstyle"
          v-model:value="query.rootMerchantTradeNo"
          :placeholder="t('sellOutLogRootMerchantTradeNo')"
        />
      </a-col>
      <a-col :span="3">
        <a-input
          v-trim
          class="searchstyle"
          v-model:value="query.utr"
          placeholder="UTR"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim class="searchstyle" v-model:value="query.operatorName" :placeholder="t('m240')" />
      </a-col>
      <a-col :span="3">
        <a-input v-trim class="searchstyle" v-model:value="query.remark" :placeholder="t('sellOutRemark')" />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.channel"
          :placeholder="t('sellOutLogChannel')"
          :allowClear="true"
          :options="channelOptions"
        />
      </a-col>
      <a-col v-if="String(query.channel) === '1'" :span="3">
        <a-input
          v-trim
          class="searchstyle"
          v-model:value="query.bankCardNumber"
          :placeholder="t('sellOutBankCardNumberRequired')"
        />
      </a-col>
      <a-col v-else-if="String(query.channel) === '3'" :span="3">
        <a-input
          v-trim
          class="searchstyle"
          v-model:value="query.upiId"
          :placeholder="t('sellOutUpiIdRequired')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.callbackTradeStatus"
          :placeholder="t('n51')"
          :allowClear="true"
          :options="callbackTradeStatusOptions"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.rewardIssued"
          :placeholder="t('n1482')"
          :allowClear="true"
        >
          <a-select-option :value="1">{{ $t('yes') }}</a-select-option>
          <a-select-option :value="0">{{ $t('no') }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.paymentVoucherProcessStatus"
          :placeholder="t('n1491')"
          :allowClear="true"
          :options="Object.entries(paymentVoucherProcessStatusMap).map(([key, value]) => ({ label: value, value: key }))"
        >
        </a-select>
      </a-col>
      <a-col>
        <timeRange
          v-model:startTime="query.submitTimeGte"
          v-model:endTime="query.submitTimeLte"
          :title="t('n106')"
          :type="1"
        />
      </a-col>
      <a-col>
        <a-button type="primary" :loading="loading" :icon="h(SearchOutlined)" @click="getList(1)">
          {{ t("search") }}
        </a-button>
        <a-button type="primary" :loading="loading" @click="resetQueryForm">{{ t("reset") }}</a-button>
        <ExportButton
          :query="query"
          :api="getQuickUpiOrBankOrderLogExport"
          permission="admin:generateQuickUpiOrBankAdmin:export"
        />
      </a-col>
    </a-row>
  </div>

  <!-- :class="['sell-out-log-table', 'sell-out-main-table', { 'sell-out-main-table--sticky': logNeedBottomSticky }]" -->
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%', y: getTabH + 'px' }"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'receiverInfo'">
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
          <div v-if="record.bankCode" class="toopTipStyle receiver-info-line">
            {{ t("m582") }}: {{ record.bankCode || "-" }}
            <CopyOutlined v-if="record.bankCode" class="copyId" @click="$copyId(record.bankCode)" />
          </div>
          <div class="toopTipStyle receiver-info-line">
            {{ t("sellOutIfsc") }}: {{ record.ifsc || "-" }}
            <CopyOutlined v-if="record.ifsc" class="copyId" @click="$copyId(record.ifsc)" />
          </div>
        </div>
        <span v-else>-</span>
      </template>

      <template v-if="column.key === 'action'">
        <div v-if="record.callbackTradeStatus == 2 && record.paymentVoucherProcessStatus == 2">
          <a-button class="voucher-view-btn" size="small" @click="openVoucherModal(record)">{{ $t("n1487") }}</a-button>
        </div>
        <div v-if="record.callbackTradeStatus == 2 && record.paymentVoucherProcessStatus == 3">
          <a-button class="voucher-view-btn" size="small" @click="openVoucherModal(record)">{{ $t("n1488") }}</a-button>
        </div>
        <div>
          <a-button class="mt-5" v-if="canShowRetryAction(record)" type="primary" size="small" @click="handleRetryOrder(record)">
            {{ t("sellOutLogRetryOrder") }}
          </a-button>
        </div>
      </template>

      <template v-if="column.key === 'utr'">
        <a-tooltip v-if="record.utr">
          <template #title>
              {{ record.utr }}
              <CopyOutlined v-if="record.utr" class="copyId" @click="$copyId(record.utr)" />
          </template>
          <div class="toopTipStyle">
            {{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId" @click="$copyId(record.utr)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'rewardIssued'">
        <span v-if="String(record.rewardIssued) == '1'" class="tag-green" style="color:#fff">{{ t('yes') }}</span>
        <span v-else-if="String(record.rewardIssued) == '0'" class="tag-red" style="color:#fff">{{ t('no') }}</span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'paymentVoucherProcessStatus'">
        <span v-if="record.callbackTradeStatus == 2">
          <span v-if="record.paymentVoucherProcessStatus == 1 || record.paymentVoucherProcessStatus == 4">
            {{ $getMapItem(paymentVoucherProcessStatusMap,1) }}
          </span>
          <span v-else-if="record.paymentVoucherProcessStatus == 2 || record.paymentVoucherProcessStatus == 3">
            {{ $getMapItem(paymentVoucherProcessStatusMap,record.paymentVoucherProcessStatus) }}
          </span>
          <span v-else>-</span>
        </span>
        <span v-else>-</span>
      </template>

      <template v-if="column.key === 'paymentVoucherRewardAmount'">
        <span v-if="record.paymentVoucherRewardAmount !== undefined && record.paymentVoucherRewardAmount !== null">
          {{ record.paymentVoucherRewardAmount }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'callbackTradeStatus'">
        <a-tag
          v-if="record.callbackTradeStatus !== undefined && record.callbackTradeStatus !== null && record.callbackTradeStatus !== ''"
          :color="getCallbackTradeStatusTagColor(record.callbackTradeStatus)"
        >
          {{ callbackTradeStatusMap[String(record.callbackTradeStatus)] || record.callbackTradeStatus }}
        </a-tag>
        <span v-else>-</span>
      </template>

      <template v-if="column.key === 'orderNoInfo'">
        <div class="order-no-mix-cell">
          <div class="order-no-line" :title="record.rootMerchantTradeNo || '-'">
            <span class="order-no-label">{{ t("sellOutOrderNoRoot") }}:</span>
            <span class="order-no-value">{{ record.rootMerchantTradeNo || "-" }}</span>
            <CopyOutlined
              v-if="record.rootMerchantTradeNo"
              class="copyId"
              @click="$copyId(record.rootMerchantTradeNo)"
            />
          </div>
          <div class="order-no-line" :title="record.merchantTradeNo || '-'">
            <span class="order-no-label">{{ t("sellOutOrderNoMerchant") }}:</span>
            <span class="order-no-value">{{ record.merchantTradeNo || "-" }}</span>
            <CopyOutlined
              v-if="record.merchantTradeNo"
              class="copyId"
              @click="$copyId(record.merchantTradeNo)"
            />
          </div>
          <div class="order-no-line" :title="record.platformTradeNo || '-'">
            <span class="order-no-label">{{ t("sellOutOrderNoPlatform") }}:</span>
            <span class="order-no-value">{{ record.platformTradeNo || "-" }}</span>
            <CopyOutlined
              v-if="record.platformTradeNo"
              class="copyId"
              @click="$copyId(record.platformTradeNo)"
            />
          </div>
        </div>
      </template>

      <template v-if="['merchantCode','merchantMemberId','operatorName','remark','requestIp'].includes(column.key as any)">
        <a-tooltip v-if="record[column.key as any]">
          <template #title>{{ record[column.key as any] }}</template>
          <div class="toopTipStyle2 cell-center">{{ record[column.key as any] }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
    </template>

    <template #summary>
      <SummaryBottom :summaryRows="logSummaryRows" :dynamicColumns="columns" :firstColumnLabel="'orderNoInfo'" />
    </template>
  </a-table>

  <a-modal
    v-model:open="retryModalOpen"
    :title="t('sellOutLogRetryOrder')"
    width="520px"
    :confirmLoading="retrySubmitLoading"
    :okText="t('b28')"
    :cancelText="t('b10')"
    @ok="handleRetrySubmit"
    @cancel="closeRetryModal"
  >
    <a-form layout="vertical">
      <a-form-item :label="t('sellOutLogCurrentMerchantTradeNo')">
        <a-input :value="retrySourceRecord?.merchantTradeNo || '-'" readonly />
      </a-form-item>
      <a-form-item :label="t('sellOutLogRootMerchantTradeNo')">
        <a-input :value="retrySourceRecord?.rootMerchantTradeNo || '-'" readonly />
      </a-form-item>
      <a-form-item :label="t('sellOutLogNewMerchantTradeNo')" required>
        <div class="retry-order-row">
          <a-input
            class="retry-order-input"
            v-model:value="retryForm.newMerchantTradeNo"
            readonly
            :placeholder="t('sellOutLogNewMerchantTradeNoGenerateTip')"
          />
          <a-button type="primary" html-type="button" @click="generateRetryMerchantTradeNo">
            {{ t("sellOutGenerate") }}
          </a-button>
        </div>
      </a-form-item>
      <a-form-item :label="t('sellOutLogRemarkOptional')">
        <a-textarea v-model:value="retryForm.remark" :rows="3" :maxlength="200" :placeholder="t('sellOutRemarkPlaceholder')" />
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:open="voucherModalOpen"
    :title="null"
    width="360px"
    :footer="null"
    wrap-class-name="sellout-voucher-modal"
    @cancel="closeVoucherModal"
  >
    <div class="voucher-modal-body">
      <div class="voucher-preview-wrap">
        <a-image v-if="currentVoucherImage" class="voucher-image" :src="currentVoucherImage" :preview="true" />
        <a-empty v-else :description="t('n336')" />
      </div>
    </div>
    <div class="voucher-action-row">
      <a-button class="voucher-btn voucher-btn-download" :loading="waitImageLoad" :disabled="!currentVoucherImage" @click="downloadVoucherImage">
        {{ $t("n1483")}}
      </a-button>
      <a-button class="voucher-btn voucher-btn-reject" v-if="rewardIssuedCurrentVoucher == 2" :loading="voucherActionLoading" @click="handleRejectVoucher">
        {{ t("reject") }}
      </a-button>
      <a-button class="voucher-btn voucher-btn-grant" v-if="rewardIssuedCurrentVoucher == 2" :loading="voucherActionLoading" @click="handleIssueVoucherReward">
        {{ $t("n1484")}}
      </a-button>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { CopyOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  getQuickUpiOrBankOrderLogListPage,
  issueQuickUpiOrBankPaymentVoucherReward,
  rejectQuickUpiOrBankPaymentVoucher,
  retryQuickUpiOrBankOrder,
} from "@/api/order.api";
import { getQuickUpiOrBankOrderLogExport } from "@/api/export";
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

const callbackTradeStatusMap: any = {
  "1": t("p58"),
  "2": t("n82"),
  "3": t("p59"),
};

const callbackTradeStatusTagColorMap: any = {
  "1": "blue",
  "2": "green",
  "3": "red",
  "4": "red",
  "5": "orange",
};
const paymentVoucherProcessStatusMap: any ={
  1: t('n1489'),//未上传
  2: t('m899'),//待审核
  3: t('n1490'),//已审核
}
const callbackTradeStatusOptions = Object.entries(callbackTradeStatusMap).map(([value, label]) => ({
  value,
  label,
}));
const rewardIssuedOptions = [
  { value: 1, label: t("yes") },
  { value: 0, label: t("no") },
];

const getCallbackTradeStatusTagColor = (status: string | number) => {
  return callbackTradeStatusTagColorMap[String(status)] || "default";
};

const createDefaultQuery = () => ({
  bankCardNumber: "",
  callbackTradeStatus: undefined,
  channel: undefined,
  direction: "",
  firstPage: true,
  lastPage: false,
  merchantTradeNo: "",
  nextColValue: "",
  nextCursorId: "",
  operatorName: "",
  pageNo: 1,
  pageSize: 10,
  prevColValue: "",
  prevCursorId: "",
  remark: "",
  rootMerchantTradeNo: "",
  submitTimeGte: startIndiaTime,
  submitTimeLte: endIndiaTime,
  upiId: "",
  rewardIssued: undefined,
  paymentVoucherProcessStatus: undefined,
  utr: undefined,
});

const query = ref<any>(createDefaultQuery());
const logNeedBottomSticky = ref(false);

const columns: any = [
  { title: t("l90"), dataIndex: "orderNoInfo", key: "orderNoInfo", align: "center", width: 320 },
  { title: t("m36"), dataIndex: "receiverInfo", key: "receiverInfo", align: "center", width: 220 },
  { title: t("n42"), dataIndex: "amount", key: "amount", align: "center", width: 130 },
  { title: t("n48"), dataIndex: "paymentVoucherRewardAmount", key: "paymentVoucherRewardAmount", align: "center", width: 130 },
  { title: 'UTR', dataIndex: "utr", key: "utr", align: "center", width: 180 },
  { title: t("n51"), dataIndex: "callbackTradeStatus", key: "callbackTradeStatus", align: "center", width: 180 },
  { title: t("sellOutLogRequestIp"), dataIndex: "requestIp", key: "requestIp", align: "center", width: 130 },
  { title: t("sellOutLogRetryNo"), dataIndex: "retryNo", key: "retryNo", align: "center", width: 110 },
  { title: t("l48"), dataIndex: "operatorName", key: "operatorName", align: "center", width: 120 },
  { title: t("n106"), dataIndex: "submitTime", key: "submitTime", align: "center", width: 170 },
  { title: t("n1482"), dataIndex: "rewardIssued", key: "rewardIssued", align: "center", width: 140 },
  { title: t("n1491"), dataIndex: "paymentVoucherProcessStatus", key: "paymentVoucherProcessStatus", align: "center", width: 140 },
  { title: t("sellOutRemark"), dataIndex: "remark", key: "remark", align: "center", width: 180 },
  { title: t("n49"), dataIndex: "callbackTime", key: "callbackTime", align: "center", width: 170 },
  { title: t("m207"), dataIndex: "merchantMemberId", key: "merchantMemberId", align: "center", width: 140 },
  { title: t("n9"), dataIndex: "merchantCode", key: "merchantCode", align: "center", width: 120 },
  { title: t("operation"), dataIndex: "action", key: "action", align: "center", width: 110, fixed: "right" },
];

const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  extendData: logExtendData,
} = useTableData({
  query,
  api: getQuickUpiOrBankOrderLogListPage,
  defaultPageSize: 10,
  filterRules: [],
  resDataType: 2,
  fetchType: 2,
});

const logSummaryRows: any = computed(() => [
  {
    label: t("m54"),
    fields: { amount: `${currency(String(logExtendData.value?.amountPageTotal ?? 0), false)}` },
    fixedPositions: { amount: 2 },
  },
  {
    label: t("m55"),
    fields: { amount: `${currency(String(logExtendData.value?.amountTotal ?? 0), false)}` },
    fixedPositions: { amount: 2 },
  },
]);

watch(
  () => query.value.channel,
  (channel) => {
    const channelValue = String(channel);
    if (channelValue !== "1") query.value.bankCardNumber = "";
    if (channelValue !== "3") query.value.upiId = "";
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
      logNeedBottomSticky.value = !!tableBody && tableBody.scrollHeight - tableBody.clientHeight > 1;
    });
  });
};

const resetQueryForm = () => {
  query.value = {
    ...createDefaultQuery(),
    submitTimeGte: "",
    submitTimeLte: "",
  };
  getList(1);
};

const isRetryStatus = (callbackTradeStatus: string | number) => {
  return ["3", "4"].includes(String(callbackTradeStatus));
};

const canShowRetryAction = (record: any) => {
  const canRetry = record?.canRetry === true || String(record?.canRetry) === "true";
  return isRetryStatus(record?.callbackTradeStatus) && canRetry;
};

const retryModalOpen = ref(false);
const retrySubmitLoading = ref(false);
const retrySourceRecord = ref<any>(null);
const voucherModalOpen = ref(false);
const voucherActionLoading = ref(false);
const voucherRecord = ref<any>(null);
const retryForm = ref({
  newMerchantTradeNo: "",
  remark: "",
});
const currentVoucherImage = computed(() => voucherRecord.value?.voucherImage || "");
const rewardIssuedCurrentVoucher = computed(() => voucherRecord.value?.paymentVoucherProcessStatus || 2);
const buildMerchantTradeNo = () => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const timePart = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
    now.getSeconds()
  ).padStart(2, "0")}`;
  const randomDigits = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return `WP${datePart}${timePart}${randomDigits}${randomLetter}`;
};

const handleRetryOrder = (record: any) => {
  retrySourceRecord.value = record;
  retryForm.value = {
    newMerchantTradeNo: "",
    remark: "",
  };
  retryModalOpen.value = true;
};

const generateRetryMerchantTradeNo = () => {
  retryForm.value.newMerchantTradeNo = buildMerchantTradeNo();
};

const closeRetryModal = () => {
  retryModalOpen.value = false;
};

const openVoucherModal = (record: any) => {
  voucherRecord.value = record || null;
  voucherModalOpen.value = true;
};

const closeVoucherModal = () => {
  voucherModalOpen.value = false;
  voucherRecord.value = null;
};

const buildVoucherPayload = () => {
  return {
    merchantTradeNo: voucherRecord.value?.merchantTradeNo,
  };
};

const waitImageLoad = ref(false);
const downloadVoucherImage = async () => {
  if (!currentVoucherImage.value) return;
  waitImageLoad.value = true;
  const response = await fetch(currentVoucherImage.value);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "voucher.png";
  link.click();

  window.URL.revokeObjectURL(url);
  waitImageLoad.value = false;
  // closeVoucherModal();
}

const handleIssueVoucherReward = async () => {
  if (!voucherRecord.value) return;
  voucherActionLoading.value = true;
  try {
    const res: any = await issueQuickUpiOrBankPaymentVoucherReward(buildVoucherPayload());
    if (res && (res.code === "1" || res.code === 1)) {
      message.success(t("s10"));
      closeVoucherModal();
      getList();
    }
  } finally {
    voucherActionLoading.value = false;
  }
};

const handleRejectVoucher = async () => {
  if (!voucherRecord.value) return;
  voucherActionLoading.value = true;
  try {
    const res: any = await rejectQuickUpiOrBankPaymentVoucher(buildVoucherPayload());
    if (res && (res.code === "1" || res.code === 1)) {
      message.success(t("s10"));
      closeVoucherModal();
      getList();
    }
  } finally {
    voucherActionLoading.value = false;
  }
};

const handleRetrySubmit = async () => {
  if (!retryForm.value.newMerchantTradeNo) {
    message.warning(t("sellOutLogClickGenerateNewNo"));
    return;
  }
  const currentMerchantTradeNo = retrySourceRecord.value?.merchantTradeNo || "";
  const rootMerchantTradeNo = retrySourceRecord.value?.rootMerchantTradeNo || "";
  if (!currentMerchantTradeNo) {
    message.warning(t("sellOutLogMissingCurrentNo"));
    return;
  }
  if (!rootMerchantTradeNo) {
    message.warning(t("sellOutLogMissingRootNo"));
    return;
  }

  retrySubmitLoading.value = true;
  try {
    const res: any = await retryQuickUpiOrBankOrder({
      currentMerchantTradeNo,
      newMerchantTradeNo: retryForm.value.newMerchantTradeNo,
      remark: retryForm.value.remark || "",
      rootMerchantTradeNo,
    });
    if (res && (res.code === "1" || res.code === 1)) {
      message.success(t("sellOutLogRetrySuccess"));
      retryModalOpen.value = false;
      getList(1);
    }
  } finally {
    retrySubmitLoading.value = false;
  }
};


onMounted(() => {
  getList(1);
  getTabH.value = useTabHeight(1,90).getTabH.value;
});


</script>

<style scoped lang="less">
.retry-order-row {
  display: flex;
  gap: 8px;
}

.retry-order-input {
  flex: 1;
}

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

.sell-out-log-table :deep(.order-no-mix-cell) {
  text-align: left;
  padding: 4px 6px;
}

.sell-out-log-table :deep(.order-no-line) {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  line-height: 1.6;
}

.sell-out-log-table :deep(.order-no-label) {
  color: #666;
  flex-shrink: 0;
}

.sell-out-log-table :deep(.order-no-value) {
  display: inline-block;
  max-width: calc(100% - 52px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.action-wrap {
  display: inline-flex;
  gap: 6px;
}

.voucher-view-btn {
  color: #fff;
  border-color: #f2c200;
  background: #f2c200;
}

.voucher-view-btn:hover,
.voucher-view-btn:focus {
  color: #fff;
  border-color: #ffd43b;
  background: #ffd43b;
}

.tag-green {
  color: #52c41a;
}

.tag-red {
  color: #f5222d;
}

.voucher-modal-body {
  display: flex;
  justify-content: center;
}

.voucher-preview-wrap {
  width: 280px;
  height: 410px;
  background: #34363b;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.voucher-image {
  max-width: 100%;
  max-height: 100%;
}

.voucher-action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.voucher-btn {
  min-width: 88px;
  height: 36px;
  border: none;
  border-radius: 8px;
  color: #fff;
}

.voucher-btn-download {
  background: #1989fa;
}

.voucher-btn-reject {
  background: #f5222d;
}

.voucher-btn-grant {
  background: #f2c200;
}

:deep(.sellout-voucher-modal .ant-modal-content) {
  padding: 0;
  background: transparent;
  box-shadow: none;
}

:deep(.sellout-voucher-modal .ant-modal-body) {
  padding: 0;
}
</style>


