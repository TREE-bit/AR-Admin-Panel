<template>
  <div class="search">
    <a-row style="margin: 0 0 15px 0">
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.bankCode"
          :options="groupList"
          :placeholder="$t('m563')+$t('m582')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          allow-clear
          v-model:value="query.phoneNumber"
          :placeholder="$t('m562')+$t('m591')"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          :placeholder="$t('m563')+$t('m695')"
          v-model:value="query.isMatch"
          :options="Object.entries(isMatchMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
        >
        </a-select>
      </a-col> -->
      <a-col>
        <timeRange v-model:startTime="query.startTimeGe" v-model:endTime="query.startTimeLe"  :title="$t('m869')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
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
    <template v-if="column.key === 'memberId'">
      <a-tooltip v-if="record.memberId">
        <template #title>
          <p v-for="(value,key) in record.memberId.split(',')" :key="key">
            <a-button type="link" class="copyContent" @click="showMember(value)">
              {{ value }}
            </a-button>
            <CopyOutlined v-if="value" class="copyId"  @click="$copyId(value)" />
          </p>
        </template>
        <div
          class="toopTipStyle"
          v-for="(item, index) in record.memberId.split(',').slice(0, 2)"
          :key="index"
        >
          <a-button type="link" class="copyContent" @click="showMember(item)">
            {{ item }}
          </a-button>
        </div>

        <div v-if="record.memberId.split(',').length > 2" class="more">
          ...
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'phoneNumber'">
      <a-tooltip v-if="record.phoneNumber">
        <template #title >
          {{ record.phoneNumber }}
          <CopyOutlined v-if="record.phoneNumber " class="copyId"  @click="$copyId(record.phoneNumber)" />
        </template>
        <div class="toopTipStyle2" >
          {{ record.phoneNumber }}
          <CopyOutlined v-if="record.phoneNumber" class="phoneNumber"  @click="$copyId(record.phoneNumber)" />
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'bankCode'">
      {{ record.bankCode || '-' }}
    </template>
    <template v-if="column.key === 'createTime'">
      {{ record.createTime || '-' }}
    </template>
    <template v-if="column.key === 'latestPullTime'">
      {{ record.latestPullTime || '-' }}
    </template>
    <template v-if="column.key === 'mappingOrder'">
        <div class="tableText">
          <div class="toopTipStyle">
            {{ $t('l90') }}：{{ record.mappingOrder || '-' }}
            <CopyOutlined v-if="record.mappingOrder" class="copyId"  @click="$copyId(record.mappingOrder)" />
          </div>
          <div class="toopTipStyle">
            {{ $t('n1539') }}：{{ record.countOfPayment }}
          </div>
          <div class="toopTipStyle">
            {{ $t('m810') }}：{{ record.paymentWaterPullTimes }}
          </div>
          <div class="toopTipStyle">
            {{ $t('publicStartTime') }}：{{ record.startPaymentWaterTime || '-' }}
          </div>
        </div>
    </template>
    <template v-if="column.key === 'countOfReceipt'">
        <div class="tableText">
          <div class="toopTipStyle">
            UPI ID：{{ record.payeeVpa || '-' }}
            <CopyOutlined v-if="record.payeeVpa" class="copyId"  @click="$copyId(record.payeeVpa)" />
          </div>
          <div class="toopTipStyle">
            {{ $t('n1539') }}：{{ record.countOfReceipt }}
          </div>
          <div class="toopTipStyle">
            {{ $t('m810') }}：{{ record.receiptWaterPullTimes }}
          </div>
          <div class="toopTipStyle">
            {{ $t('publicStartTime') }}：{{ record.startReceiptWaterTime || '-' }}
          </div>
        </div>
    </template>
    <template v-if="column.key === 'operate'">
      <!-- <a-tag
        color="red"
        style="cursor: pointer;"
        size="small"
        v-if="record.isMatch == 0"
        @click="openManualMadal(record)"
        v-permission="'admin:matchingOrderAdmin:orderReplenishmentByWater1'"
        >{{ $t("m700") }}
      </a-tag> -->
    </template>
    </template>
  </a-table>
  <!-- 会员详情 -->
  <a-modal
    v-model:open="detailModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
  >
    <memberDetail
      v-if="detailModel"
      :memberID="detailId.memberId"
      :id="detailId.id"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  autoTransferAdminWaitingPull,
  getKycBankCodeList,
} from "@/api";
import { currency } from "@/utils/index";
import { useI18n } from "vue-i18n";
import { isMatchMap } from "@/utils/publicData";
import memberDetail from "@/components/Member/memberDetail.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime,] = getStartAndEndOfDay()
const { t } = useI18n();
const detailModel = ref(false);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const query = ref({
  asc: false,
  column: "",
  startTimeLe: endIndiaTime,
  startTimeGe: startIndiaTime,
  bankCode: undefined,
  phoneNumber: undefined,
});
const columns:any = [
  {
    title: t("m582"),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 150,
  },
  {
    title: t("m591"),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
    width: 150,
  },
  // {
  //   title: t("m150"),
  //   dataIndex: "memberId",
  //   key: "memberId",
  //   align: "center",
  //   width: 180,
  // },
  {
    title: t("n104"),
    dataIndex: "mappingOrder",
    key: "mappingOrder",
    align: "center",
    width: 250,
  },
  {
    title: t("n100"),
    dataIndex: "countOfReceipt",
    key: "countOfReceipt",
    align: "center",
    width: 250,
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 150,
  },
  {
    title: t("m809"),
    dataIndex: "latestPullTime",
    key: "latestPullTime",
    align: "center",
    width: 150,
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
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};
const {
  dataSource,
  extendData,
  response,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: autoTransferAdminWaitingPull,
  defaultPageSize: 20,
  fetchType: 2,
  filterRules: [],
  afterFetch: (data) =>
  data.map((item: any) => {
    item.isDefaultTId = item.tid && item.tid.slice(0, 7) == 'DEFAULT' ? 1 : 0;
    return item;
  }),
});
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
  getGroupList(),
  getList();
  getTabH.value = useTabHeight(3,40).getTabH.value;
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
