<template>
  <div class="search">
    <h2>{{ $t("m977") }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.kycId"
          class="searchstyle"
          :placeholder="$t('m562')+'KYC ID'"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.sellPlatformOrder"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n40')"
        />
      </a-col>
      <!-- <a-col>
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime"  :title="$t('m694')" :type="1"/>
      </a-col> -->
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
        <!-- <a-button type="primary" @click="exportList"     v-permission="'admin:paymentOrderAdmin:export'">{{
          $t("export")
        }}</a-button> -->
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
      <template v-if="column.key === 'memberId'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record)"
          >{{ record.memberId }}</a-button
        >
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'utr'">
        <a-tooltip v-if="record.utr">
          <template #title>
            {{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'kycId'">
        {{ record.kycId || "-" }}
      </template>
    <template v-if="column.key === 'sellPlatformOrder'">
      <span>{{ record.sellPlatformOrder || '-' }}</span>
    </template>
      <template v-if="column.key === 'bankCode'">
        <a-tooltip>
          <template #title>{{ record.bankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankCode }}</div>
        </a-tooltip>
      </template>
    <template v-if="column.key === 'operate'">
        <!-- v-if="!['3'].includes(record.status)"
        v-permission="'admin:matchingOrderAdmin:getInfo'" -->
      <!-- <a-tag
        color="rgba(14, 186, 139, 1)"
        style="cursor: pointer;"
        size="small"
        @click="openManualMadal(record)"
        v-permission="'admin:kycPartnerRecipientAdmin:manualReplenishment'"
        >{{ $t("m700") }}
      </a-tag> -->
    </template>
    </template>
    <!-- <template #summary>
      <a-table-summary fixed="bottom">
        <a-table-summary-row>
          <a-table-summary-cell :col-span="8"> {{ $t("m54") }}</a-table-summary-cell>
          <a-table-summary-cell :col-span="1" align="center">
            <a-typography-text type="danger">{{ currency(extendData.amountPageTotal, false) }}</a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="5" />
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell :col-span="8">{{ $t("m55") }}</a-table-summary-cell>
          <a-table-summary-cell :col-span="1" align="center">
            <a-typography-text type="danger"> {{ currency(extendData.amountTotal, false) }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="5" />
        </a-table-summary-row>
      </a-table-summary>
    </template> -->
  </a-table>
  <a-modal
    v-model:open="detailModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
    >
    <MemberDetail 
    v-if="detailModel"
      :memberID="detailId.memberId"
      :id="detailId.id"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  kycSellAppealPendingPull,
} from "@/api/kycConfig.api";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { currency } from "@/utils/index";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
const { t } = useI18n();
const dataSource = ref([]);
const extendData = ref<any>({});
const loading = ref(false);
const query = ref({
  asc: true,
  column: "",
  kycId: undefined,
  sellPlatformOrder: undefined,
  pageNo: 1,
  pageSize: 20,
});
const detailModel = ref(false);
const detailId = ref<any>({});
const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value = { id: memberId, memberId:memberId };
  detailModel.value = true;
};
const columns:any = [
  {
    title: t("m150"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: 'KYC ID',
    dataIndex: "kycId",
    key: "kycId",
    align: "center",
    width: 180,
  },
  {
    title: 'UTR',
    dataIndex: "utr",
    key: "utr",
    align: "center",
    width: 120,
  },
  {
    title: t("m582"),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 120,
  },
  {
    title: t("n40"),
    dataIndex: "sellPlatformOrder",
    key: "sellPlatformOrder",
    align: "center",
    width: 200,
  },
  {
    title: t("m978"),
    dataIndex: "pullTimes",
    key: "pullTimes",
    align: "center",
    width: 120,
  },
  {
    title: t("l70"),
    dataIndex: "putTime",
    key: "putTime",
    align: "center",
    width: 170,
  },
  {
    title: t("m809"),
    dataIndex: "lastPullTime",
    key: "lastPullTime",
    align: "center",
    width: 170,
  },
  // {
  //   title: t("operation"),
  //   dataIndex: "operate",
  //   key: "operate",
  //   align: "center",
  //   width: 120,
  //   fixed: 'right',
  // },
];
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async (isFirst:any = null) => {
  if(isFirst){
    query.value.pageNo = 1;
  }
  loading.value = true;
  pagination.value.current = query.value.pageNo;
  pagination.value.pageSize = query.value.pageSize;
  const res: any = await kycSellAppealPendingPull(query.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    extendData.value = res.extend;
    pagination.value.total = res.total;
    pagination.value.current = query.value.pageNo;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList();
};
const search = () => {
  query.value.pageNo = 1;
  pagination.value.current = 1;
  getList();
}
const resetQuery = () => {
  query.value = {
    asc: true,
    column: "",
    kycId: undefined,
    sellPlatformOrder: undefined,
    pageNo: 1,
    pageSize: 20,
  };
  pagination.value.pageSize = 20;
  pagination.value.current = 1;
  getList();
};

onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
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
