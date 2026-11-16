<template>
  <div class="search">
    <div class="containerHeard">{{ $t("m58") }}</div>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.platformOrder"
          class="searchstyle"
          :placeholder="$t('m59')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.merchantOrder"
          class="searchstyle"
          :placeholder="$t('m60')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.merchantCode"
          class="searchstyle"
          :placeholder="$t('m61')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          v-model:value="query.merchantType"
          :placeholder="$t('p16')"
        >
          <a-select-option v-for="(item, key) in merchantTypeMap" :value="key">{{
            item
          }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('pleaseEnter') + $t('c9')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.externalMemberId"
          class="searchstyle"
          :placeholder="$t('pl2')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.merchantName"
          :placeholder="$t('p26')"
          :allowClear="true"
          :show-search="true"
        >
          <a-option
            v-for="item in merchantList"
            :key="item.code"
            :value="item.username"
            >{{ item.username }}</a-option
          >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.matchPoolOrderNo"
          :placeholder=" $t('n322')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n626')"
          v-model:value="query.sourceOrderType"
          :options="Object.entries(orderSourceMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: $t(value),
          }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          v-model:value="query.callbackStatus"
          :options="
            Object.entries(merchantCallBackStatus).map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
          :placeholder="$t('c34')"
        >
        </a-select>
      </a-col>

      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          ref="select"
          :placeholder="$t('p43')"
          v-model:value="query.orderStatus"
        >
          <a-select-option v-for="(item, key) in statusMap" :value="key">{{
            $t(item)
          }}</a-select-option>
        </a-select>
      </a-col>
      <!-- <a-col :span="6">
        <a-range-picker
          show-time
          class="searchstyle"
          v-model:value="searchDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('n80')+$t('l50'), $t('n81')+$t('l50')]"
        />
      </a-col> -->
      <a-col>
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime"  :title="$t('l95')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.completeStartTime" v-model:endTime="query.completeEndTime"  :title="$t('l39')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.tradeCallbackStartTime" v-model:endTime="query.tradeCallbackEndTime" :title="$t('n49')" :type="1"/>
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
        <ExportButton
          :query="query"
          :api="fetchWithdrawOrderExport"
          permission="admin:merchantInfoAdmin:fetchWithdrawOrderExport"
        />
        <!-- <a-button type="primary" @click="exportList" :loading="loading" v-permission="'admin:merchantInfoAdmin:fetchWithdrawOrderExport'">{{
          $t("export")
        }}</a-button> -->
        <a-button type="primary" @click="batchWithdraw" :loading="loading"
          :disabled="stateIds.length===0"
          v-permission="'admin:merchantInfoAdmin:batchConfirmSuccess'">{{
          $t("n1219")
        }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    size="middle"
    :dataSource="dataSource"
    :columns="columns"
    :loading="loading"
    :scroll="{ x: '100%' ,y: getTabH+'px'}"
    :pagination="pagination"
    @change="handleTableChange"
    :row-key="(record: any) => JSON.stringify(record.id)"
    :row-selection="{ 
      selectedRowKeys: stateIds,
      onChange: onSelectChange,
      getCheckboxProps: (record) => ({
          disabled: ['2', '4'].includes(record.tradeCallbackStatus) || record.orderStatus=='1',
      }),
    }"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'payType'">
        <a-tag> {{ selectPayType[Number(record.payType)] }}</a-tag>
      </template>
      <template v-if="column.key === 'memberId'">
        <a-button type="link" class="copyContent" @click="showMember(record.memberId)">{{
          record.memberId
        }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'platformOrder'">
        <a-tooltip>
          <template #title>{{ record.platformOrder }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.platformOrder }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'externalMemberId'">
        <a-tooltip v-if="record.externalMemberId">
          <template #title>
            {{ record.externalMemberId }}
            <CopyOutlined v-if="record.externalMemberId" class="copyId"  @click="$copyId(record.externalMemberId)" />
          </template>
          <div class="toopTipStyle">
            {{ record.externalMemberId }}
            <CopyOutlined v-if="record.externalMemberId" class="copyId"  @click="$copyId(record.externalMemberId)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'merchantOrder'">
        <a-tooltip>
          <template #title>{{ record.merchantOrder }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.merchantOrder }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'matchPoolOrderNo'">
        <a-tooltip>
          <template #title>{{ record.matchPoolOrderNo }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.matchPoolOrderNo }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'sourceOrderType'">
        <span v-if="record.sourceOrderType">{{ $t($getMapItem(orderSourceMap,record.sourceOrderType)) }}</span>
        <span v-else>{{ $t('n623') }}</span>
      </template>
      <template v-if="column.key === 'merchantType'">
        {{ merchantTypeMap[record.merchantType] || '-' }}
      </template>
      <template v-if="column.key === 'operate'">
        <a-tag
          v-if="!['4'].includes(record.tradeCallbackStatus)&&record.orderStatus!='1'"
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="checkDetail(record)"
          v-permission="'admin:merchantInfoAdmin:confirmSuccess'"
          >{{ $t("n97") }}
        </a-tag>
      </template>
      <template v-if="column.key === 'orderStatus'">
        <a-tag> {{ $t(statusMap[Number(record.orderStatus)]) }}</a-tag>
      </template>
      <template v-if="column.key === 'tradeCallbackStatus'">
        <a-tag>
          {{ selectCallBackStatus[Number(record.tradeCallbackStatus)] }}</a-tag
        >
      </template>
    </template>
    <template #summary>
      <a-table-summary fixed="bottom">
      <a-table-summary-row>
        <a-table-summary-cell :col-span="11" align="left"> {{ $t("m54") }}</a-table-summary-cell>
        <!-- <a-table-summary-cell :col-span="8" /> -->
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger">{{ currency(extendData.amountPageTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger">{{ currency(extendData.costPageTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="5" />
      </a-table-summary-row>
      <a-table-summary-row>
        <a-table-summary-cell :col-span="11" align="left">{{ $t("m55") }}</a-table-summary-cell>
        <!-- <a-table-summary-cell :col-span="8" /> -->
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger"> {{ currency(extendData.amountTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger"> {{ currency(extendData.costTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="5" />
      </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :footer="null">
    <div class="success-modal">
      <p>{{ $t("m163") }}</p>
    </div>
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
        <a-button type="primary" :loading="loading" @click="withdrawConfirm">{{
          $t("b28")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closedalog">{{
          $t("b10")
        }}</a-button>
      </div>
    </div>
  </a-modal>
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
import {
  fetchWithdrawOrderInfo,
  getMerchantInfoAdminList,
  withdrawConfirmSuccess,
  merchantInfoAdminBatchConfirmSuccess,
} from "@/api/merchant.api";
import { SearchOutlined } from "@ant-design/icons-vue";
import { computed, ref, h, onMounted, reactive, watchEffect } from "vue";
import { getStartAndEndOfDay, usePagination } from "@/plugins/dataMap";
import { merchantCallBackStatus, orderSourceMap } from "@/utils/publicData";
import memberDetail from "@/components/Member/memberDetail.vue";
import { useI18n } from "vue-i18n";
import { currency } from "@/utils";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { message } from "ant-design-vue";
import { fetchWithdrawOrderExport } from "@/api/export";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useMerchantStore } from "@/stores/useMerchantStore";
const merchantList = computed(() => useMerchantStore().merchantList);
import { usePageCash } from "@/hooks/usePageCash.hook"; 
const route = useRoute();
const { pageCash,setPageCash,getPageCash,clearPageCash } = usePageCash();
const resultData = ref({});
const stateIds = ref<Array<any>>([]);
const onSelectChange = (selectedRowKeys: Array<any>) => {
  stateIds.value = selectedRowKeys;
  console.log('selectedRowKeys changed: ', selectedRowKeys);
};
const isUseCash = ref(false);
onBeforeRouteLeave(() => {
  setPageCash(route.fullPath.split('?')[0], query.value, resultData.value, extendData.value);
})
const { getTabH } = useTabHeight(1);
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const statusMap: any = {
  1: "p58",//支付中
  2: "n82",//已完成
  3: "p59",//代付失败
  4: "n92",//支付超时
};
const { t } = useI18n();
// const loading = ref(false);
const query = ref({
  asc: false,
  callbackStatus: undefined,
  merchantCode: undefined,
  merchantType: undefined,
  merchantName: undefined,
  merchantOrder: undefined,
  orderStatus: undefined,
  pageNo: 1,
  pageSize: 20,
  platformOrder: undefined,
  timeType: 0,
  memberId: '',
  externalMemberId: '',
  startTime: startIndiaTime,
  endTime: endIndiaTime,
  completeStartTime: "",
  completeEndTime: "",
  tradeCallbackStartTime: "",
  tradeCallbackEndTime: "",
  matchPoolOrderNo: undefined,
  sourceOrderType: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const detailModel = ref(false);
const detailId = ref({
  id: 0,
  memberId: 0,
});
// const merchantList = ref([]);
// const dataSource = ref([]);
// const extendData = ref<any>({});
const addDialog = ref(false);
// const { paginationConfig } = usePagination();
const selectId = ref(null);
const columns:any = reactive([
  {
    title: t("l95"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 170,
  },
  {
    title: t("l92"),
    dataIndex: "merchantName",
    key: "merchantName",
    align: "center",
    width: 120,
  },
  {
    title: t("n9"),
    dataIndex: "merchantCode",
    key: "merchantCode",
    align: "center",
    width: 120,
  },
  {
    title: t("n30"),
    dataIndex: "merchantType",
    key: "merchantType",
    align: "center",
    width: 120,
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: t("l90"),
    dataIndex: "platformOrder",
    key: "platformOrder",
    align: "center",
    width: 260,
  },
  {
    title: t("m207"),
    dataIndex: "externalMemberId",
    key: "externalMemberId",
    align: "center",
    width: 180,
  },
  {
    title: t("l96"),
    dataIndex: "merchantOrder",
    key: "merchantOrder",
    align: "center",
    width: 220,
  },
  {
    title: t("n322"),
    dataIndex: "matchPoolOrderNo",
    key: "matchPoolOrderNo",
    align: "center",
    width: 220,
  },
  {
    title: t("n626"),
    dataIndex: "sourceOrderType",
    key: "sourceOrderType",
    align: "center",
    width: 180,
  },
  // {
  //   title: t("type"),
  //   dataIndex: "payType",
  //   key: "payType",
  //   align: "center",
  // },
  {
    title: t("n42"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 150,
  },
  {
    title: t("m265"),
    dataIndex: "cost",
    key: "cost",
    align: "center",
    width: 150,
  },
  {
    title: t("l39"),
    dataIndex: "completionTime",
    key: "completionTime",
    align: "center",
    width: 170,
  },
  {
    title: t("n49"),
    dataIndex: "tradeCallbackTime",
    key: "tradeCallbackTime",
    align: "center",
    width: 170,
  },
  {
    title: t("m164"),
    dataIndex: "orderStatus",
    key: "orderStatus",
    align: "center",
    width: 160,
  },
  {
    title: t("n53"),
    dataIndex: "tradeCallbackStatus",
    key: "tradeCallbackStatus",
    align: "center",
    width: 160,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    width: 140,
    fixed: "right",
  },
]);
const selectPayType = <any>{
  1: t("m166"),//印度银行卡
  2: t("m167"),//印度USDT
  3: t("m168"),//印度UPI
  4: t("m169"),//印度PIX
};
const merchantTypeMap = <any>{
  1: t("n24"),//内部商户
  2: t("n25"),//外部商户
};
const selectCallBackStatus = <any>{
  1: t("n93"),//未回调
  2: t("s18"),//回调成功
  3: t("s19"),//回调失败
  4: t("s20"),//手动回调成功
  5: t("s21"),//手动回调失败
};
// const searchDate = computed({
//   get: () => {
//     return [query.value.startTime, query.value.endTime];
//   },
//   set: (val) => {
//     query.value.startTime = val ? val[0] : "";
//     query.value.endTime = val ? val[1] : "";
//   },
// });
// const getMerchantList = async () => {
//   const res: any = await getMerchantInfoAdminList({ pageNo: 1, pageSize: 1000 });
//   if (res && res.code === "1") {
//     merchantList.value = res.data.map(({ username }) => ({
//       value: username,
//       label: username,
//     }));
//   }
// };
const {
  dataSource,
  pagination,
  extendData,
  response,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  handleQueryFields:(q) => ({
    ...q,
    timeType: 0,
  }),
  api: fetchWithdrawOrderInfo,
  defaultPageSize: 20,
  filterRules: [],
  afterFetch: (data) =>
  data.map((item: any) => {
    item.amount = currency(item.amount, false);
    item.cost = currency(item.cost, false);
    return item;
  }),
});
watchEffect(() => {
  if(!isUseCash.value) resultData.value = response.value;
});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (isFirst: any = null) => {
//   if (isFirst) {
//     query.value.pageNo = 1;
//     paginationConfig.current = 1;
//   }
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
//   const res: any = await fetchWithdrawOrderInfo(query.value).finally(() => {
//     loading.value = false;
//   });
//   if (res && res.code === "1") {
//     dataSource.value = res.data.map((item: any) => {
//       item.amount = currency(item.amount, false);
//       item.cost = currency(item.cost, false);
//       return item;
//     });
//     extendData.value = res.extend;
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//     paginationConfig.current = query.value.pageNo;
//     paginationConfig.pageSize = query.value.pageSize;
//     paginationConfig.total = res.total;
//     oldPageNo.value = query.value.pageNo;
//     pageCurrent.value = Math.ceil(res.total/query.value.pageSize);
//   }
// };
// const getforData = async ()=>{
//   const res: any = await fetchWithdrawOrderInfo(query.value);
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
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};

// const resetQuery = () => {
//   query.value = {
//     asc: false,
//     callbackStatus: undefined,
//     endTime: "",
//     merchantCode: undefined,
//     merchantName: undefined,
//     merchantOrder: undefined,
//     orderStatus: undefined,
//     pageNo: 1,
//     pageSize: 20,
//     platformOrder: undefined,
//     startTime: "",
//     timeType: 0,
//     memberId: '',
//     externalMemberId: '',
//     completeStartTime: "",
//     completeEndTime: "",
//     tradeCallbackStartTime: "",
//     tradeCallbackEndTime: "",
//     matchPoolOrderNo: undefined,
//     sourceOrderType: undefined,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   clearSelected();
//   getList();
// };
const checkDetail = (value: any) => {
  selectedRow();
  const { id } = value;
  selectId.value = id;
  addDialog.value = true;
};
const withdrawConfirm = async () => {
  loading.value = true;
  const res: any = await withdrawConfirmSuccess({ id: selectId.value }).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    addDialog.value = false;
    stateIds.value = [];
    message.success(t("s10"));
    getList();
  }
};
const closedalog = () => {
  addDialog.value = false;
};

// 批量代付
const batchWithdraw = async () => {
  loading.value = true;
  const res: any = await merchantInfoAdminBatchConfirmSuccess(stateIds.value).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    message.success(t("n1217"));
    clearSelected();
    stateIds.value = [];
    getList();
  }
};
// const getChange = (value: any) => {
//   const { current, pageSize } = value;
//   if(pageSize != paginationConfig.pageSize){
//     query.value.pageNo = 1;
//     paginationConfig.current = 1;
//   }else{
//     query.value.pageNo = current;
//     paginationConfig.current = current;
//   }
//   query.value.pageSize = pageSize;
//   paginationConfig.pageSize = pageSize;
//   getList();
// };
const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res: any = await fetchWithdrawOrderExport(data).finally(() => {
    loading.value = false;
  });
  if(res && res.code == '1'){
    message.success(t("n545"));
  }
};
onMounted(() => {
  // getMerchantList();
  const pathName = route.fullPath.split('?')[0];
  if(pageCash.value.includes(pathName) && Object.keys(route.query).length == 0){
    const { queryCash, res, extend } = getPageCash(pathName);
    if(!res.data || res.data && res.data.length == 0) {
      isUseCash.value = false;
      getList();
    }else{
      isUseCash.value = true;
      query.value = queryCash;
      dataSource.value = res.data;
      extendData.value = extend;
      resultData.value = res;
      pagination.value.total = res.total || 0;
      pagination.value.current = query.value.pageNo;
      pagination.value.pageSize = query.value.pageSize;
    }
  }else{
    clearPageCash(route.fullPath);
    getList();
  }
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped>
.success-modal {
  display: flex;
  justify-content: center;
  align-items: end;
  padding: 3rem;
}
</style>
