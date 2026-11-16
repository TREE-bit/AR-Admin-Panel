<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.tid"
          class="searchstyle"
          :placeholder="'TID'"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.utr"
          class="searchstyle"
          :placeholder="'UTR'"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.flowStatus"
          class="searchstyle"
          :placeholder="$t('n1254')" 
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.flowType"
          :placeholder="$t('n1255')"
          :allowClear="true"
        >
          <a-select-option :value="1">{{ $t('n1256') }}</a-select-option>
          <a-select-option :value="2">{{ $t('n1257') }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.payeeBankCode"
          :options="groupList"
          :placeholder="$t('n1265')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.payeeUpiId"
          class="searchstyle"
          :placeholder="$t('n1266')" 
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.payerBankCode"
          :options="groupList"
          :placeholder="$t('n1267')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.payerUpiId"
          class="searchstyle"
          :placeholder="$t('n1268')" 
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          v-model:value="query.chOrderStatus"
          :placeholder="$t('n1258')"
          class="searchstyle"
          :options="Object.entries(matchlistStatus).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          v-model:value="query.appealStatus"
          :placeholder="$t('n433')"
          class="searchstyle"
          :options="Object.entries(appealTypeMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
        >
        </a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.pullTimeGe" v-model:endTime="query.pullTimeLe"  :title="$t('m869')" :type="1"/>
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
      <template v-if="column.key === 'tid'">
        <a-tooltip v-if="record.tid">
          <template #title>
            {{ record.tid }}
            <CopyOutlined v-if="record.tid" class="copyId"  @click="$copyId(record.tid)" />
          </template>
          <div class="toopTipStyle2">
            {{ record.tid }}
            <CopyOutlined v-if="record.tid" class="copyId"  @click="$copyId(record.tid)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'utr'">
        <a-tooltip v-if="record.utr">
          <template #title v-if="record.utr">
            {{ record.utr }}
            <CopyOutlined v-if="record.utr " class="copyId"  @click="$copyId(record.utr)" />
          </template>
          <div class="toopTipStyle2">
            {{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'flowAmount'">
        {{ thousand(record.flowAmount) }}
      </template>
      <template v-if="column.key === 'flowType'">
        <span :class="record.flowType == 1 ? 'tag-blue' : record.flowType == 2 ? 'tag-green' : ''">
          {{ record.flowType == 1 ? $t('n1256') : record.flowType == 2 ? $t('n1257') : "-" }}
        </span>
      </template>
      <template v-if="column.key === 'mappingOrderInfo'">
        <div v-if="record.mappingOrderInfo" class="tableText">
          <div v-if="record.mappingOrderInfo.appealStatus" class="text-normal">
            <b>{{ $t('n433') }}</b>: {{ $t(appealTypeMap[record.mappingOrderInfo.appealStatus]) }}
          </div>
          <div v-if="record.mappingOrderInfo.buyOrderType" class="text-normal">
            <b>{{ $t('n581') }}</b>: {{ $t(buyOrderTypeMap[record.mappingOrderInfo.buyOrderType]) }}
          </div>
          <div v-if="record.mappingOrderInfo.buyOrderNo" class="text-normal">
            <b>{{ $t('n41') }}</b>: {{ record.mappingOrderInfo.buyOrderNo }}
          </div>
          <div v-if="record.mappingOrderInfo.chOrderStatus" class="text-normal">
            <b>{{ $t('n1258') }}</b>: {{ $t(matchlistStatus[record.mappingOrderInfo.chOrderStatus]) }}
          </div>
          <div v-if="record.mappingOrderInfo.chOrderNo" class="text-normal">
            <b>{{ $t('m807') }}</b>: 
            <a-button v-if="record.mappingOrderInfo.chOrderNo" type="link" 
              @click="goPath(0,hasPro('/order/assemble/index'),record.mappingOrderInfo.chOrderNo)">
              {{ record.mappingOrderInfo.chOrderNo }}
            </a-button>
          </div>
          <div v-if="record.mappingOrderInfo.sellOrderNo" class="text-normal">
            <b>{{ $t('n40') }}</b>: {{ record.mappingOrderInfo.sellOrderNo }}
          </div>
        </div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'payeeKycInfo'">
        <div v-if="record.payeeKycInfo" class="tableText">
          <div v-if="record.payeeKycInfo.bankCode" class="text-normal">
            <b>{{ $t('m582') }}</b>: {{ record.payeeKycInfo.bankCode }}
          </div>
          <div v-if="record.payeeKycInfo.bankNo" class="text-normal">
            <b>{{ $t('n1259') }}</b>: {{ record.payeeKycInfo.bankNo }}
          </div>
          <div v-if="record.payeeKycInfo.phoneNumber" class="text-normal">
            <b>{{ $t('m591') }}</b>: {{ record.payeeKycInfo.phoneNumber	 }}
          </div>
          <div v-if="record.payeeKycInfo.upiId" class="text-normal">
            <b>UPI ID</b>: {{ record.payeeKycInfo.upiId }}
          </div>
          <div v-if="record.payeeKycInfo.ifscCode" class="text-normal">
            <b>IFSC</b>: {{ record.payeeKycInfo.ifsc }}
          </div>
        </div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'payerKycInfo'">
        <div v-if="record.payerKycInfo" class="tableText">
          <div v-if="record.payerKycInfo.bankCode" class="text-normal">
            <b>{{ $t('m582') }}</b>: {{ record.payerKycInfo.bankCode }}
          </div>
          <div v-if="record.payerKycInfo.bankNo" class="text-normal">
            <b>{{ $t('n1259') }}</b>: {{ record.payerKycInfo.bankNo }}
          </div>
          <div v-if="record.payerKycInfo.phoneNumber" class="text-normal">
            <b>{{ $t('m591') }}</b>: {{ record.payerKycInfo.phoneNumber	 }}
          </div>
          <div v-if="record.payerKycInfo.upiId" class="text-normal">
            <b>UPI ID</b>: {{ record.payerKycInfo.upiId }}
          </div>
          <div v-if="record.payerKycInfo.ifscCode" class="text-normal">
            <b>IFSC</b>: {{ record.payerKycInfo.ifsc }}
          </div>
        </div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'pullTime'">
        {{ record.pullTime || "-" }}
      </template>
      <template v-if="column.key === 'operate'">
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  abnormalWaterFlowAdminListPage,
  getKycBankCodeList,
} from "@/api";
import { currency, thousand } from "@/utils/index";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import router from "@/router";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { appealTypeMap,buyOrderTypeMap,matchlistStatus } from"@/utils/publicData";
const route = useRoute();
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
const { t } = useI18n();

const query = ref({
  asc: false,
  column: "",
  pullTimeLe: endIndiaTime,
  pullTimeGe: startIndiaTime,
  pageNo: 1,
  pageSize: 20,
  // pullTimeLe: '',
  // pullTimeGe: '',
  tid: undefined,
  utr: undefined,
  flowType: undefined,
  flowStatus: undefined,
  mappingOrder: undefined,
  chOrderStatus: undefined,
  appealStatus: undefined,
  payeeBankCode: undefined,
  payeeUpiId: undefined,
  payerBankCode: undefined,
  payerUpiId: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const columns:any = [
  {
    title: 'TID',
    dataIndex: "tid",
    key: "tid",
    align: "center",
    width: 150,
  },
  {
    title: 'UTR',
    dataIndex: "utr",
    key: "utr",
    align: "center",
    width: 150,
  },
  {
    title: t("n916"),
    dataIndex: "flowAmount",
    key: "flowAmount",
    align: "center",
    width: 120,
  },
  {
    title: t("n1254"),
    dataIndex: "flowStatus",
    key: "flowStatus",
    align: "center",
    width: 120,
  },
  {
    title: t("n1255"),
    dataIndex: "flowType",
    key: "flowType",
    align: "center",
    width: 120,
  },
  {
    title: t("n953"),
    dataIndex: "mappingOrderInfo",
    key: "mappingOrderInfo",
    align: "center",
    width: 300,
  },
  {
    title: t("n1260"),
    dataIndex: "payeeKycInfo",
    key: "payeeKycInfo",
    align: "center",
    width: 250,
  },
  {
    title: t("n1261"),
    dataIndex: "payerKycInfo",
    key: "payerKycInfo",
    align: "center",
    width: 250,
  },
  {
    title: t("m869"),
    dataIndex: "pullTime",
    key: "pullTime",
    align: "center",
    width: 150,
  },
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
  handleQueryFields: (q) => ({
    ...q,
  }),
  api: abnormalWaterFlowAdminListPage,
  fetchType: 1,
  defaultPageSize: 20,
  filterRules: [],
  afterFetch: (data) =>
    data.map((item: any) => {
      return item;
    }),
});
const hasPro = (path: string) => {
  const name = path.split('/').join('_')
  return router.hasRoute(name)
}
const goPath = (pathType: number, isGo:boolean, val:any)=>{
  if(!isGo) return;
  const goMap = [
    {name:'_order_assemble_index', query: {platformOrder: val}},
  ];
  router.push(goMap[pathType])
}
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
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>

</style>
