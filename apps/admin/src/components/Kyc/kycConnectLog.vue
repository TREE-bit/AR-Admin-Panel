<template>
  <div class="search">
    <h2>{{ $t('n730') }}</h2>
    <a-row>
      <a-col :span="3">
        <a-select
          v-model:value="query.kycLinkStatusChangeType"
          allow-clear
          :placeholder="$t('n785')"
          :options="Object.entries(kycLinkStatusChangeTypeMap).map(([key, value]) => ({ label: value, value: key }))"
          size="small"
          style="width: 100%">
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          v-model:value="query.changeReason"
          allow-clear
          :placeholder="$t('n736')"
          :options="Object.entries(kycLinkStatusChangeReasonMap).map(([key, value]) => ({ label: value, value: key }))"
          size="small"
          style="width: 100%">
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          v-model:value="query.changeSource"
          allow-clear
          :placeholder="$t('n756')"
          :options="Object.entries(kycLinkStatusChangeSourceMap).map(([key, value]) => ({ label: value, value: key }))"
          size="small"
          style="width: 100%">
        </a-select>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.operationTimeStart" v-model:endTime="query.operationTimeEnd" :title="$t('l67')" :size="'small'" :width="170" :type="1"/>
      </a-col>
      <a-col :span="4">
        <a-button type="primary" size="small" :loading="loading" :icon="h(SearchOutlined)" @click="getList(1)">{{
          $t("search")
        }}</a-button>
        <a-button  type="primary" size="small" :loading="loading" @click="reset()">{{ $t('reset') }}</a-button>
      </a-col>
    </a-row>
  </div>
  <div class="kycConnectLogTable">
    <a-table
      :dataSource="dataList"
      :columns="columns"
      :pagination="paginationConfig"
      :scroll="{ x: '100%' , y: getTabH + 'px'}"
      :loading="loading"
      size="small"
      @change="handleTableChange"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'bankCode'">
        <a-tooltip v-if="record.bankCode">
          <template #title>
            {{ record.bankCode }}
          </template>
          <div class="toopTipStyle">
            {{ record.bankCode  }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'phoneNumber'">
        <a-tooltip v-if="record.phoneNumber">
          <template #title>
            {{ record.phoneNumber }}
          </template>
          <div class="toopTipStyle">
            {{ record.phoneNumber  }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'memberId'">
        {{ record.memberId || '-' }}
      </template>
      <template v-if="column.key === 'kycLinkStatusChangeType'">
        <span class="arbListTag">
          <span class="pointTag" :style="record.kycLinkStatusChangeType == 1 ? 'background-color:#52c41a' : 'background-color:#f5222d'" ></span>
          {{ $getMapItem(kycLinkStatusChangeTypeMap,record.kycLinkStatusChangeType) || '-' }}
        </span>
      </template>
      <template v-if="column.key ==='kycLinkStatusChangeSource'">
        {{ $getMapItem(kycLinkStatusChangeSourceMap,record.kycLinkStatusChangeSource) || '-' }}
      </template>
      <template v-if="column.key === 'kycLinkStatusChangeReason'">
        <a-tooltip>
          <template #title>
            {{ $getMapItem(kycLinkStatusChangeReasonMap,record.kycLinkStatusChangeReason) || '-' }}
          </template>
          <div class="toopTipStyle">
            {{ $getMapItem(kycLinkStatusChangeReasonMap,record.kycLinkStatusChangeReason) || '-' }}
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operationTime'">
        {{ record.operationTime || '-' }}
      </template>
      <template v-if="column.key === 'restResultsCode'">
        <div v-if="record.restResults && record.restResults.length>0">
          <div v-for="(item,index) in record.restResults" :key="index" class="table_inner_result">
            {{ item.httpCode || '-' }}
          </div>
        </div>
        <div v-else class="table_inner_result">-</div>
      </template>
      <template v-if="column.key === 'restResultsBody'">
        <div v-if="record.restResults && record.restResults.length>0">
          <div v-for="(item,index) in record.restResults" :key="index" class="table_inner_result">
            <a-tooltip v-if="item.responseBody">
              <template #title>
                {{ item.responseBody }}
              </template>
              <div class="toopTipStyle">
                {{ item.responseBody }}
              </div>
            </a-tooltip>
            <span v-else>-</span>
          </div>
        </div>
        <div v-else class="table_inner_result">-</div>
      </template>
      <template v-if="column.key === 'restResultsDesc'">
        <div v-if="record.restResults && record.restResults.length>0">
          <div v-for="(item,index) in record.restResults" :key="index" class="table_inner_result">
            <a-tooltip v-if="item.remark">
              <template #title>
                {{ item.remark }}
              </template>
              <div class="toopTipStyle">
                {{ item.remark }}
              </div>
            </a-tooltip>
            <span v-else>-</span>
          </div>
        </div>
        <div v-else class="table_inner_result">-</div>
      </template>
      <template v-if="column.key === 'restResultsSuccess'">
        <div v-if="record.restResults && record.restResults.length>0">
          <div v-for="(item,index) in record.restResults" :key="index" class="table_inner_result">
            <a-tag :color="item.success == 1 ? 'green' : 'red'">
              {{ item.success == 1 ? $t('s10') : $t('m618') }}
            </a-tag>
          </div>
        </div>
        <div v-else class="table_inner_result">-</div>
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="openResultLog(record)"
          v-if="record.kycLinkStatusChangeType == 1"
        >{{ $t("n784") }}</a-tag>
        <div v-else class="table_inner_result">-</div>
      </template>
    </template>
    </a-table>
  </div>
  <!-- kyc流水记录-->
<a-modal
  v-model:open="resultLogModel"
  :footer="null"
  wrap-class-name="full-modal"
  width="100%"
  @cancel="clostResultLogModel"
  >
  <kycPullResultLog
    v-if="resultLogModel"
    :connectionUuid="connectionUuid"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  kycLinkStatusLogAdminListPage
} from "@/api/kycConfig.api";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { usePagination } from "@/plugins/dataMap";
import { kycLinkStatusChangeSourceMap, kycLinkStatusChangeTypeMap, kycLinkStatusChangeReasonMap } from "@/utils/publicData";
import { useI18n } from "vue-i18n";
import kycPullResultLog from "./kycPullResultLog.vue";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { ref, onMounted, h} from "vue"
const { getTabH } = useTabHeight();
const { paginationConfig } = usePagination();
const { t } = useI18n();
const props = defineProps({
  bankCode: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
});
const loading = ref(false);
const dataList = ref([]);
const query = ref({
  pageNo: 1,
  pageSize: 20,
  bankCode: props.bankCode,
  phoneNumber: props.phoneNumber,
  changeReason: undefined,
  changeSource: undefined,
  kycLinkStatusChangeType: undefined,
  operationTimeStart: '',
  operationTimeEnd: '',
});
const columns:any = [
  // {
  //   title: t('m582'),
  //   dataIndex: "bankCode",
  //   key: "bankCode",
  //   align: "center",
  //   width: 90,
  // },
  // {
  //   title: t('n328'),
  //   dataIndex: "phoneNumber",
  //   key: "phoneNumber",
  //   align: "center",
  //   width: 120,
  // },
  // {
  //   title: t('c9'),
  //   dataIndex: "memberId",
  //   key: "memberId",
  //   align: "center",
  //   width: 100,
  // },
  {
    title: t('n785'),
    dataIndex: "kycLinkStatusChangeType",
    key: "kycLinkStatusChangeType",
    align: "center",
    width: 90,
  },
  {
    title: t('n756'),
    dataIndex: "kycLinkStatusChangeSource",
    key: "kycLinkStatusChangeSource",
    align: "center",
    width: 90,
  },
  {
    title: t('n736'),
    dataIndex: "kycLinkStatusChangeReason",
    key: "kycLinkStatusChangeReason",
    align: "center",
    width: 160,
  },
  {
    title: t('l67'),
    dataIndex: "operationTime",
    key: "operationTime",
    align: "center",
    width: 120,
  },
  {
    title: t('n737'),
    children: [
      {
        title: t('n738'),
        dataIndex: "restResultsCode",
        key: "restResultsCode",
        align: "center",
        width: 90,
      },
      {
        title: t('n739'),
        dataIndex: "restResultsBody",
        key: "restResultsBody",
        align: "center",
        width: 160,
      },
      {
        title: t('n740'),
        dataIndex: "restResultsDesc",
        key: "restResultsDesc",
        align: "center",
        width: 120,
      },
      {
        title: t('state'),
        dataIndex: "restResultsSuccess",
        key: "restResultsSuccess",
        align: "center",
        width: 120,
      },
    ],
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 80,
  },
];
const getList = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    paginationConfig.current = 1;
  }
  loading.value = true;
  paginationConfig.pageSize = query.value.pageSize;
  const res: any = await kycLinkStatusLogAdminListPage(query.value).finally(() => loading.value = false);
  if (res && res.code == "1") {
    dataList.value = res.data;
    paginationConfig.total = res.total;
    clearSelected();
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  paginationConfig.current = pag.current;
  paginationConfig.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList();
};
const reset = () => {
  query.value = {
    pageNo: 1,
    pageSize: 20,
    bankCode: props.bankCode,
    phoneNumber: props.phoneNumber,
    changeReason: undefined,
    changeSource: undefined,
    kycLinkStatusChangeType: undefined,
    operationTimeStart: '',
    operationTimeEnd: '',
  };
  getList(1);
};
const resultLogModel = ref(false);
const connectionUuid = ref('');
const openResultLog = (record: any) => {
  connectionUuid.value = record.connectionUuid;
  resultLogModel.value = true;
  selectedRow();
};
const clostResultLogModel = () => {
  resultLogModel.value = false;
  connectionUuid.value = '';
};

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
