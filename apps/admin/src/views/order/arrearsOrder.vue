<template>
  <div class="search">
    <tipTemplate :title="$t('n202')" :info="info1" />
    <a-row style="margin: 0 0 5px 0">
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.chOrderNo"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m807')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.buyOrderNo"
          :placeholder="$t('m562')+$t('n229')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.sellOrderNo"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n230')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.buyerAccount"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n228')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberAccount"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n231')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.buyerId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n227')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n232')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.buyOrderIp"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n233')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.sellOrderIp"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n234')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.utr"
          class="searchstyle"
          :placeholder="$t('m562') + 'UTR'"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n626')"
          v-model:value="query.sourceType"
          :options="Object.entries(orderSourceMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: $t(value),
          }))"
        >
        </a-select>
      </a-col> -->
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.operationBy"
          class="searchstyle"
          :placeholder="$t('m562')+$t('l48')"
        />
      </a-col>
    <a-col >
      <timeRange v-model:startTime="query.operationTimeGe" v-model:endTime="query.operationTimeLe" :title="$t('l67')" :type="1"/>
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
        <ExportButton
          :query="query"
          :api="memberArrearsRecordAdminListPageExport"
          :enable-export-fields="true"
          permission="admin:memberArrearsRecordAdmin:listPageExport"
        />
        <!-- <a-button type="primary" @click="exportListPage" :loading='loading' v-permission="'admin:memberArrearsRecordAdmin:listPageExport'">{{
          $t("export")
        }}</a-button> -->
      <a-button @click="openDrawer">{{ $t("m741") }}</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <h3>{{ $t("n317") }}：{{ arrearsTotal?.totalOwedAmount || 0 }}</h3>
      </a-col>
      <a-col style="margin-left: 20px">
        <h3>{{ $t("n318") }}：{{ arrearsTotal?.positiveOwedUserCount || 0 }}</h3>
      </a-col>
      <a-col style="margin-left: 20px">
        <ExportButton
          :query="{}"
          :api="memberArrearsRecordAdminExport"
          permission="admin:memberArrearsRecordAdmin:debtInfoExport"
        />
        <!-- <a-button type="primary" @click="exportInfo" :loading='loading' v-permission="'admin:memberArrearsRecordAdmin:debtInfoExport'">{{
          $t("export")
        }}</a-button>  -->
        
        <tipTemplate :info="info2" />
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="dynamicColumns"
    :key="tableKey"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
    <!-- <template v-if="column.key === 'matchDuration'">
      {{ record.matchDuration ? formatTime(record.matchDuration) : "--" }}
    </template> -->
    <template v-if="column.key === 'memberId'">
      <div style="text-align: left;">
        {{ $t('n235') }}：
        <a-button type="link" class="copyContent" @click="showMember(record.buyerId)">{{
          record.buyerId || '-'
        }}</a-button>
        <CopyOutlined v-if="record.buyerId" class="copyId"  @click="$copyId(record.buyerId)" />
      </div>
      <div style="text-align: left;">
        {{ $t('n236') }}：
        <a-button type="link" class="copyContent" @click="showMember(record.memberId)">{{
          record.memberId || '-'
        }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </div>
    </template>
    <!-- <template v-if="column.key === 'chOrderNo'">
      {{ record.chOrderNo }}
      <CopyOutlined v-if="record.chOrderNo" class="copyId"  @click="$copyId(record.chOrderNo)" />
    </template> -->
    <template v-if="column.key === 'matchingOrderStatus'">
      <a-tag v-if="[3,4,5,6,7,8,12,13,14,15,16,17].includes(Number(record.matchingOrderStatus))" 
      :color="[7,15].includes(Number(record.matchingOrderStatus)) ? 'green':'red'">
        {{ [1,2,11].includes(Number(record.matchingOrderStatus)) ? $t('n88'):$t(matchlistStatus[Number(record.matchingOrderStatus)]) }}
      </a-tag>
      <div v-else>-</div>
    </template>
    <template v-if="column.key === 'sourceType'">
      <span v-if="record.sourceType">{{ $t($getMapItem(orderSourceMap,record.sourceType)) }}</span>
      <span v-else>{{ $t('n623') }}</span>
    </template>
    <template v-if="column.key === 'isKycSell'">
      <span>{{ record.isKycSell == 1 ? $t("yes") : $t("no") }}</span>
      <!-- <div>{{ $t('m905') }}：
        <span>{{ record.isKycSell == 1 ? $t("yes") : $t("no") }}</span>
      </div> -->
      <!-- <div>{{ $t('m906') }}：
        <span>{{ record.completedByKyc == 1 ? $t("yes") : $t("no") }}</span>
      </div> -->
    </template>
    <template v-if="column.key === 'buyOrderNo'">
      <div style="text-align: left;">
        {{ $t('m11') }}：
        {{ record.chOrderNo || '-' }}
        <CopyOutlined v-if="record.chOrderNo" class="copyId"  @click="$copyId(record.chOrderNo)" />
      </div>
      <div style="text-align: left;">
        {{ $t('n235') }}：
        {{ record.buyOrderNo || '-' }}
        <CopyOutlined v-if="record.buyOrderNo" class="copyId"  @click="$copyId(record.buyOrderNo)" />
      </div>
      <div style="text-align: left;">
        {{ $t('n236') }}：
        {{ record.sellOrderNo || '-' }}
        <CopyOutlined v-if="record.sellOrderNo" class="copyId"  @click="$copyId(record.sellOrderNo)" />
      </div>
    </template>
    <template v-if="column.key === 'memberAccount'">
      <a-tooltip>
        <template #title>
          <div style="text-align: left;">
            {{ $t('n235') }}：
            {{ record.buyerAccount || '-' }}
            <CopyOutlined v-if="record.buyerAccount" class="copyId"  @click="$copyId(record.buyerAccount)" />
          </div>
          <div style="text-align: left;">
            {{ $t('n236') }}：
            {{ record.memberAccount || '-' }}
            <CopyOutlined v-if="record.memberAccount" class="copyId"  @click="$copyId(record.memberAccount)" />
          </div>
        </template>
        <div style="text-align: left;text-overflow: ellipsis;overflow: hidden;">
          {{ $t('n235') }}：
          {{ record.buyerAccount || '-' }}
          <CopyOutlined v-if="record.buyerAccount" class="copyId"  @click="$copyId(record.buyerAccount)" />
        </div>
        <div style="text-align: left;text-overflow: ellipsis;overflow: hidden;">
          {{ $t('n236') }}：
          {{ record.memberAccount || '-' }}
          <CopyOutlined v-if="record.memberAccount" class="copyId"  @click="$copyId(record.memberAccount)" />
        </div>
      </a-tooltip>
    </template>
    <template v-if="column.key === 'buyOrderIp'">
      <a-tooltip>
        <template #title>
          <div style="text-align: left;">
            {{ $t('n235') }}：
            {{ record.buyOrderIp || '-' }}
            <CopyOutlined v-if="record.buyOrderIp" class="copyId"  @click="$copyId(record.buyOrderIp)" />
          </div>
          <div style="text-align: left;">
            {{ $t('n236') }}：
            {{ record.sellOrderIp || '-' }}
            <CopyOutlined v-if="record.sellOrderIp" class="copyId"  @click="$copyId(record.sellOrderIp)" />
          </div>
        </template>
        <div style="text-align: left;text-overflow: ellipsis;overflow: hidden;">
          {{ $t('n235') }}：
          {{ record.buyOrderIp || '-' }}
          <CopyOutlined v-if="record.buyOrderIp" class="copyId"  @click="$copyId(record.buyOrderIp)" />
        </div>
        <div style="text-align: left;text-overflow: ellipsis;overflow: hidden;">
          {{ $t('n236') }}：
          {{ record.sellOrderIp || '-' }}
          <CopyOutlined v-if="record.sellOrderIp" class="copyId"  @click="$copyId(record.sellOrderIp)" />
        </div>
      </a-tooltip>
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
    <template v-if="column.key === 'operationBy'">
      <div class="toopTipStyle3">
        {{ record.operationBy || '-' }}
      </div>
    </template>
    <template v-if="column.key === 'operationTime'">
      {{ record.operationTime || '-' }}
    </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="dynamicColumns"
        :firstColumnLabel="'buyOrderNo'"
        />
    </template>
  </a-table>
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
 <!-- 列表筛选 -->
<PublicColumnFilter
  v-model:open="drawerVisible"
  v-model:value="selectedColumns"
  :columns="columns"
  v-model:defaultColumns="defaultColumns"
  :title="$t('n36')"
  :menuId="menuId"
  v-if="drawerVisible"
/>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { memberArrearsRecordAdminListPage, memberArrearsRecordAdminTotalMemberDebt } from "@/api/order.api";
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import { currency, thousand } from "@/utils/index";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { useRoute } from "vue-router";
import { memberArrearsRecordAdminExport, memberArrearsRecordAdminListPageExport } from "@/api/export";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import memberDetail from "@/components/Member/memberDetail.vue";
import tipTemplate from "@/components/Other/tipTemplate.vue";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTableColumnDrawer } from "@/hooks/index";
import { matchlistStatus, orderSourceMap } from "@/utils/publicData";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { message } from "ant-design-vue";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
const route = useRoute();
const detailModel = ref(false);
const merchantList = ref([]);
// const dataSource = ref([]);
// const extendData = ref<any>({});
// const loading = ref(false);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      amount: extendData.value.amountTotalPage,
    },
  },
  {
    label: t("m55"),
    fields: {
      amount: extendData.value.amountTotal,
    },
  },
]);
const query = ref({
  asc: false,
  // column: '',
  pageNo: 1,
  pageSize: 20,
  operationTimeGe: startIndiaTime,
  operationTimeLe: endIndiaTime,
  memberId: undefined,
  memberAccount: undefined,
  utr: undefined,
  chOrderNo: undefined,
  buyOrderNo: undefined,
  sellOrderNo: undefined,
  operationBy: undefined,
  buyerId: undefined,
  buyerAccount: undefined,
  buyOrderIp: undefined,
  sellOrderIp: undefined,
  sourceType: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const info1 = [t("n333")];
const info2 = [t("n334")];
const columns:any = [
  // {
  //   title: t("m807"),
  //   dataIndex: "chOrderNo",
  //   key: "chOrderNo",
  //   isRequired: true,
  //   align: "center",
  //   width: 240,
  // },
  {
    title: t("l90"),
    dataIndex: "buyOrderNo",
    key: "buyOrderNo",
    exportFields: ["chOrderNo", "buyOrderNo", "sellOrderNo"],
    isRequired: true,
    align: "center",
    width: 300,
  },
  {
    title: t("c10"),
    dataIndex: "memberAccount",
    key: "memberAccount",
    exportFields: ["buyerAccount", "memberAccount"],
    align: "center",
    isRequired: true,
    width: 240,
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    exportFields: ["buyerId", "memberId"],
    align: "center",
    isRequired: true,
    width: 180,
  },
  {
    title: t("n237"),
    dataIndex: "buyOrderIp",
    key: "buyOrderIp",
    exportFields: ["buyOrderIp", "sellOrderIp"],
    align: "center",
    isRequired: true,
    width: 240,
  },
  {
    title: t("actualMoney"),
    dataIndex: "orderAmount",
    key: "orderAmount",
    align: "center",
    isRequired: true,
    width: 150,
  },
  {
    title: t("n2098"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    isRequired: true,
    width: 150,
  },
  {
    title: 'UTR',
    dataIndex: "utr",
    key: "utr",
    align: "center",
    width: 140,
  },
  {
    title: t("state"),
    dataIndex: "matchingOrderStatus",
    key: "matchingOrderStatus",
    align: "center",
    width: 150,
  },
  {
    title: t("m607"),
    dataIndex: "isKycSell",
    key: "isKycSell",
    exportFields: ["isKycSell", "completedByKyc"],
    align: "center",
    width: 120,
  },
  {
    title: t("n626"),
    dataIndex: "sourceType",
    key: "sourceType",
    align: "center",
    // filters: Object.entries(orderSourceMap).map(([key, value]:[any,any]) => ({
    //           value: key,
    //           text: t(value),
    //         })),
    // filterMultiple: false,
    // filteredValue: query.value.sourceType != undefined ? [query.value.sourceType] : null,
    width: 180,
  },
  {
    title: t("l48"),
    dataIndex: "operationBy",
    key: "operationBy",
    align: "center",
    width: 150,
  },
  {
    title: t("l67"),
    dataIndex: "operationTime",
    key: "operationTime",
    align: "center",
    width: 180,
  },
];
const {
  menuId,
  defaultColumns,
  selectedColumns,
  dynamicColumns,
  drawerVisible,
  openDrawer,
  tableKey,
} = useTableColumnDrawer(columns);
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};
const {
  dataSource,
  pagination,
  loading,
  extendData,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: memberArrearsRecordAdminListPage,
  defaultPageSize: 20,
  filterRules: [
    { key: "sourceType" },
  ],
  afterFetch: (data) =>
    data.map((item) => ({
      ...item,
      orderAmount: currency(item.orderAmount, false),
      amount: currency(item.amount, false),
    })),
});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async () => {
//   loading.value = true;
  
//     const queryPageNo = query.value.pageNo;
//     queryCount.value = queryPageNo - oldPageNo.value;
//     if(query.value.pageNo == 1){
//       query.value.firstPage = true;
//       query.value.lastPage = false;
//       resetPageQuery();
//     }else if(query.value.pageNo == pageCurrent.value){
//       query.value.firstPage = false;
//       query.value.lastPage = true;
//       resetPageQuery();
//     }else if(queryCount.value > 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'next';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }else if(queryCount.value <= 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'prev';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }
//   const res:any = await memberArrearsRecordAdminListPage(query.value).catch((err)=>loading.value = false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data.map((item: any) => {
//       item.amount = currency(item.amount, false);
//       return item;
//     });
//     extendData.value = res.extend;
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//     pagination.value.current = query.value.pageNo;
//     pagination.value.pageSize = query.value.pageSize;
//     pagination.value.total = res.total;
//     oldPageNo.value = query.value.pageNo;
//     pageCurrent.value = Math.ceil(res.total/query.value.pageSize);
//     loading.value = false;
//   }else{
//     loading.value = false;
//   }
// };
// const getforData = async ()=>{
//   const res: any = await memberArrearsRecordAdminListPage(query.value);
//   if(res.code == 1){
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//   }
// }
// const resetPageQuery = ()=>{
//     query.value.direction = '';
//     query.value.nextColValue = '';
//     query.value.nextCursorId = '';
//     query.value.prevColValue = '';
//     query.value.prevCursorId = '';
// }
// const { handleTableChange } = useTableChange({
//   query,
//   pagination,
//   getList,
//   filterRules: [
//     { key: "sourceType" },
//   ],
// });
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//   if(pag.pageSize != pagination.value.pageSize){
//     query.value.pageNo = 1;
//     pagination.value.current = 1;
//   }else{
//     query.value.pageNo = pag.current;
//     pagination.value.current = pag.current;
//   }
//   pagination.value.pageSize = pag.pageSize;
//   query.value.pageSize = pag.pageSize;
//   getList();
// };
const { getsaleOrderDetail } = getUsdtBuyOrderInfo();
const openDetail = ref(false);
const detailObj = ref<any>({});
const checkDetail = (value: any) => {
  selectedRow();
  const { id } = value;
  getsaleOrderDetail({ id });
  openDetail.value = true;
  detailObj.value = value;
};
const search = () => {
  query.value.pageNo = 1;
  pagination.value.current = 1;
  getList();
}
// const resetQuery = () => {
//   query.value = {
//     asc: false,
//     pageNo: 1,
//     pageSize: 20,
//     operationTimeGe: '',
//     operationTimeLe: '',
//     memberId: undefined,
//     memberAccount: undefined,
//     utr: undefined,
//     chOrderNo: undefined,
//     buyOrderNo: undefined,
//     sellOrderNo: undefined,
//     operationBy: undefined,
//     buyerId: undefined,
//     buyerAccount: undefined,
//     buyOrderIp: undefined,
//     sellOrderIp: undefined,
//     sourceType: undefined,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   pagination.value.pageSize = 20;
//   pagination.value.current = 1;
//   clearSelected();
//   getList();
// };
// const goAssemble = (id: any) => {
//   router.push({ path: "/member/changeReocde", query: { withdraw: id } });
// };
// const goPool = (id: any) => {
//   router.push({ path: "/order/matchingPool/index", query: { id } });
// };

const exportListPage = async () => {
  loading.value = true;
  const data = JSON.parse(JSON.stringify(query.value));
  const res:any = await memberArrearsRecordAdminListPageExport(data).finally(() => {
    loading.value = false;
  });
  if(res && res.code == '1'){
    message.success(t("n545"));
  }
};
const exportInfo = async () => {
  loading.value = true;
  const data = JSON.parse(JSON.stringify(query.value));
  const res:any = await memberArrearsRecordAdminExport({}).finally(() => {
    loading.value = false;
  });
  if(res && res.code == '1'){
    message.success(t("n545"));
  }
};

const arrearsTotal:any = ref({});
const getArrEarsTotal = async () => {
  const res:any = await memberArrearsRecordAdminTotalMemberDebt().catch((err) => loading.value = false);
  if (res && res.code === "1") {
    arrearsTotal.value = res.data;
    loading.value = false;
  }else{
    loading.value = false;
  }
};
onMounted(() => {
  getArrEarsTotal();
  getList();
  getTabH.value = useTabHeight().getTabH.value;
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
