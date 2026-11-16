<template>
  <div class="search">
    <h2>{{ $t('n1767') }}</h2>
    <a-row>
      <a-col :span="3">
        <a-select
          v-model:value="query.behaviorType"
          allow-clear
          :placeholder="$t('n785')"
          :options="Object.entries(behaviorTypeMap).map(([key, value]) => ({ label: value, value: key }))"
          size="small"
          style="width: 100%">
        </a-select>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.operationTimeStart" v-model:endTime="query.operationTimeEnd" :title="$t('n1768')" :size="'small'" :width="170" :type="1"/>
      </a-col>
      <a-col :span="4">
        <a-button type="primary" size="small" :loading="loading" :icon="h(SearchOutlined)" @click="getList(1)">{{
          $t("search")
        }}</a-button>
        <a-button  type="primary" size="small" :loading="loading" @click="resetQuery()">{{ $t('reset') }}</a-button>
      </a-col>
    </a-row>
  </div>
  <div class="kycConnectLogTable">
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="pagination"
      :scroll="{ x: '100%' , y: getTabH + 'px'}"
      :loading="loading"
      size="small"
      @change="handleTableChange"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <!-- <template v-if="column.key === 'bankCode'">
        <a-tooltip v-if="record.bankCode">
          <template #title>
            {{ record.bankCode }}
          </template>
          <div class="toopTipStyle">
            {{ record.bankCode  }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template> -->
      <template v-if="column.key ==='behaviorType'">
          {{ $getMapItem(behaviorTypeMap,record.behaviorType) || '-' }}
      </template>
      <template v-if="column.key === 'operationTime'">
        {{ record.operationTime ? formatTimes(record.operationTime) : '-' }}
      </template>
      <template v-if="column.key === 'httpCode'">
          {{ record.httpCode || '-' }}
      </template>
      <template v-if="column.key === 'responseBody'">
        <a-tooltip v-if="record.responseBody">
          <template #title>
            {{ record.responseBody }}
          </template>
          <div class="toopTipStyle">
            {{ record.responseBody }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip v-if="record.remark">
          <template #title>
            {{ record.remark }}
          </template>
          <div class="toopTipStyle">
            {{ record.remark }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'success'">
        <span class="arbListTag">
          <span class="pointTag" :style="record.success == 1 ? 'background-color:#52c41a' : 'background-color:#f5222d'" ></span>
          {{ record.success == 1 ? t('s10') : t('m618') }}
        </span>
      </template>
      <!-- <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="openResultLog(record)"
          v-if="record.kycLinkStatusChangeType == 1"
        >{{ $t("n784") }}</a-tag>
        <div v-else class="table_inner_result">-</div>
      </template> -->
    </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  uploadKycPartnerBehaviorLogPage
} from "@/api";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { kycLinkStatusChangeSourceMap, kycLinkStatusChangeTypeMap, kycLinkStatusChangeReasonMap } from "@/utils/publicData";
import { useI18n } from "vue-i18n";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { formatTimes } from '@/utils'
import { ref, onMounted, h} from "vue"
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
const props = defineProps({
  appId: {
    type: String,
    default: "",
  },
});
const behaviorTypeMap: any = {
  1: t('n260'),// 链接
  2: t('n1769'),//断开链接
  3: t('n754'),//刷新Token
  4: t('n1770'),//卸载假APP
}
const query = ref({
  pageNo: 1,
  pageSize: 20,
  appId: props.appId,
  behaviorType: undefined,
  operationTimeStart: startIndiaTime,
  operationTimeEnd: endIndiaTime,
});
const columns:any = [
  {
    title: t('n785'),
    dataIndex: "behaviorType",
    key: "behaviorType",
    align: "center",
    width: 90,
  },
  {
    title: t('n1768'),
    dataIndex: "operationTime",
    key: "operationTime",
    align: "center",
    width: 90,
  },
  {
    title: t('n737'),
    children: [
      {
        title: t('n738'),
        dataIndex: "httpCode",
        key: "httpCode",
        align: "center",
        width: 90,
      },
      {
        title: t('n739'),
        dataIndex: "responseBody",
        key: "responseBody",
        align: "center",
        width: 160,
      },
      {
        title: t('n740'),
        dataIndex: "remark",
        key: "remark",
        align: "center",
        width: 120,
      },
      {
        title: t('state'),
        dataIndex: "success",
        key: "success",
        align: "center",
        width: 120,
      },
    ],
  },
  // {
  //   title: t('operation'),
  //   dataIndex: "action",
  //   key: "action",
  //   align: "center",
  //   width: 80,
  // },
];
const {
  dataSource,
  extendData,
  pagination,
  loading,
  response,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  handleQueryFields: (q)=>({
    ...q,
    appId: props.appId,
  }),
  api: uploadKycPartnerBehaviorLogPage,
  fetchType: 1,
  defaultPageSize: 20,
  filterRules: [],
  // afterFetch: (data) =>
  //   data.map((item: any) => {
  //   item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
  //     return item;
  //   }),
});
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.ant-table-cell) {
  padding: 0 !important;
}
</style>
