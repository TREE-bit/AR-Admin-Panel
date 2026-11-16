<template>
  <div class="search">
    <div class="containerHeard">{{ $t("m57") }}</div>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.platformOrder"
          class="searchstyle"
          :placeholder="$t('m59')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n150')"
        v-model:value="query.thirdRechargeFlag"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n1493')"
        v-model:value="query.isQuadOrder"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
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
          v-model:value="query.buyOrderNo"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m669')"
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
          <a-select-option
            v-for="(item, key) in selectOrderStatus"
            :value="key"
            >{{ $t(item) }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          ref="select"
          :placeholder="$t('m563') + $t('n176')"
          v-model:value="query.complainedFlag"
        >
          <a-select-option :value="0" >{{ $t('no') }}</a-select-option >
          <a-select-option :value="1" >{{ $t('yes') }}</a-select-option >
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
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('l95')" :type="1"/>
      </a-col>
      <!-- <a-col :span="6">
        <a-range-picker
          show-time
          class="searchstyle"
          v-model:value="completionTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('n80')+$t('n49'), $t('n81')+$t('n49')]"
        />
      </a-col> -->
      <a-col>
        <timeRange v-model:startTime="query.completeStartTime" v-model:endTime="query.completeEndTime" :title="$t('l39')" :type="1"/>
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
          :api="merchantInfoAdminExport"
          permission="admin:merchantInfoAdmin:export"
        />
        <!-- <a-button type="primary" @click="exportList" :loading="loading" v-permission="'admin:merchantInfoAdmin:export'">{{
          $t("export")
        }}</a-button> -->
        <a-button type="primary" @click="batchRecharge" :loading="loading"
          :disabled="stateIds.length===0"
          v-permission="'admin:merchantInfoAdmin:rechargeBatchConfirmSuccess'">{{
          $t("n1219")
        }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    size="middle"
    :dataSource="dataSource"
    :loading="loading"
    :columns="columns"
    :scroll="{ x: '100%' , y: getTabH+'px' }"
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
      <template v-if="column.key === 'operate'">
        <a-tag
          v-if="(!['4'].includes(record.tradeCallbackStatus)) && record.orderStatus!='1'"
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          v-permission="'admin:merchantInfoAdmin:rechargeConfirmSuccess'"
          @click="checkDetail(record)"
          >{{ $t("n97") }}
        </a-tag>
      </template>
      <template v-if="column.key === 'orderStatus'">
        <a-tag> {{ selectOrderStatus[Number(record.orderStatus)] }}</a-tag>
      </template>
      <template v-if="column.key === 'complainedFlag'">
        <a-tag>
          {{ record.complainedFlag == 1 ? $t('yes') : $t('no') }}
        </a-tag>
      </template>
      <template v-if="column.key === 'memberId'">
        <a-button type="link" class="copyContent" @click="showMember(record.memberId)">{{
          record.memberId
        }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'tradeCallbackStatus'">
        <a-tag>
          {{ selectCallBackStatus[Number(record.tradeCallbackStatus)] }}</a-tag
        >
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
      <template v-if="column.key === 'quadOrderChannel'">
        <a-tooltip>
          <template #title>
            <div><span>{{ $t('n1492') }}?：</span><span :style="record.isQuadOrder ==1?'color:green':'color:red'">{{ record.isQuadOrder ==1?$t('yes'):$t('no') }}</span></div>
            <div><span>{{ $t('m413') }}：</span>{{ record.quadOrderChannel || '-' }}</div>
            <div><span>{{ $t('n864') }}：</span>{{ record.quadOrder || '-' }}</div>
          </template>
          <div style="text-align: left;">
            <div class="toopTipStyle"><span>{{ $t('n1492') }}?：</span><span :style="record.isQuadOrder ==1?'color:green':'color:red'">{{ record.isQuadOrder ==1?$t('yes'):$t('no') }}</span></div>
            <div class="toopTipStyle"><span>{{ $t('m413') }}：</span>{{ record.quadOrderChannel || '-' }}</div>
            <div class="toopTipStyle"><span>{{ $t('n864') }}：</span>{{ record.quadOrder || '-' }}</div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'platformOrder'">
        <a-tooltip>
          <template #title>{{ record.platformOrder }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.platformOrder }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'thirdRechargeFlag'">
        <span :style="record.thirdRechargeFlag ? 'color:green' : 'color:red'">{{ record.thirdRechargeFlag ? $t('yes') : $t('no') }}</span>
      </template>
      <template v-if="column.key === 'merchantOrder'">
        <a-tooltip>
          <template #title>{{ record.merchantOrder }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.merchantOrder }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'buyOrderNo'">
        <!-- <a-tooltip>
          <template #title>{{ record.buyOrderNo }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.buyOrderNo }}</div>
        </a-tooltip> -->
        <a-button v-if="record.buyOrderNo" type="link" class="copyContent" @click="goPath(0,hasPro('/order/buyOrder/index'),record.buyOrderNo)">{{ record.buyOrderNo }}</a-button>
        <CopyOutlined v-if="record.buyOrderNo" class="copyId"  @click="$copyId(record.buyOrderNo)" />
        <span v-else>-</span>
      </template>
      <!-- <template v-if="column.key === 'payType'">
        <a-tag> {{ selectPayType[Number(record.payType)] }}</a-tag>
      </template> -->
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'label'"
        />
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :footer="null">
    <div class="success-modal">
      <p>{{ $t("m163") }}</p>
    </div>
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
        <a-button type="primary" :loading="loading" @click="rechargeConfirm">{{
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
  fetchRechargeOrderInfo,
  getMerchantInfoAdminList,
  rechargeConfirmSuccess,
  merchantInfoAdminRechargeBatchConfirmSuccess,
} from "@/api/merchant.api";
import { SearchOutlined } from "@ant-design/icons-vue";
import { computed, ref, h, onMounted, reactive, watchEffect } from "vue";
import { getStartAndEndOfDay, usePagination } from "@/plugins/dataMap";
import { merchantCallBackStatus } from "@/utils/publicData";
import memberDetail from "@/components/Member/memberDetail.vue";
import { useI18n } from "vue-i18n";
import { currency } from "@/utils";
import router from "@/router";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { message } from "ant-design-vue";
import { merchantInfoAdminExport } from "@/api/export";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { useMerchantStore } from "@/stores/useMerchantStore";
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
const merchantList = computed(() => useMerchantStore().merchantList);
const { getTabH } = useTabHeight();
const { t } = useI18n();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const query = ref({
  asc: false,
  callbackStatus: undefined,
  merchantCode: "",
  merchantName: undefined,
  merchantOrder: "",
  orderStatus: undefined,
  pageNo: 1,
  pageSize: 20,
  platformOrder: "",
  timeType: 0,
  memberId: '',
  externalMemberId: '',
  buyOrderNo: undefined,
  thirdRechargeFlag: undefined,
  complainedFlag: undefined,
  isQuadOrder: undefined,
  startTime: startIndiaTime,
  endTime: endIndiaTime,
  completeStartTime: "",
  completeEndTime: "",
  tradeCallbackStartTime: "",
  tradeCallbackEndTime: "",
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
const addDialog = ref(false);
// const loading = ref(false);
const selectId = ref(null);
// const merchantList = ref<any>([]);
// const dataSource = ref([]);
// const extendData = ref<any>({});
// const { paginationConfig } = usePagination();
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
    title: t("n150"),
    dataIndex: "thirdRechargeFlag",
    key: "thirdRechargeFlag",
    align: "center",
    width: 160,
  },
  {
    title: t("m812"),
    dataIndex: "quadOrderChannel",
    key: "quadOrderChannel",
    align: "center",
    width: 220,
  },
  {
    title: t("m207"),
    dataIndex: "externalMemberId",
    key: "externalMemberId",
    align: "center",
    width: 140,
  },
  {
    title: t("l96"),
    dataIndex: "merchantOrder",
    key: "merchantOrder",
    align: "center",
    width: 260,
  },
  {
    title: t("m669"),
    dataIndex: "buyOrderNo",
    key: "buyOrderNo",
    align: "center",
    width: 260,
  },
  {
    title: t("n42"),
    dataIndex: "orderAmount",
    key: "orderAmount",
    align: "center",
    width: 150,
  },
  {
    title: t("n43"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 150,
  },
  {
    title: t("m264"),
    dataIndex: "cost",
    key: "cost",
    align: "center",
    width: 150,
  },
  {
    title: t("n1325"),
    dataIndex: "randomAmount",
    key: "randomAmount",
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
    width: 180,
  },
  {
    title: t("n176"),
    dataIndex: "complainedFlag",
    key: "complainedFlag",
    align: "center",
    width: 140,
  },
  {
    title: t("n53"),
    dataIndex: "tradeCallbackStatus",
    key: "tradeCallbackStatus",
    align: "center",
    width: 180,
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
const summaryRows: any = computed(() => [
  {
    label: t("m54"),
    fields: {
      orderAmount: currency(extendData.value.orderAmountPageTotal,false),
      amount: currency(extendData.value.amountPageTotal,false),
      cost: currency(extendData.value.costPageTotal,false),
      randomAmount: currency(extendData.value.randomAmountPageTotal,false),
    },
  },
  {
    label: t("m55"),
    fields: {
      orderAmount: currency(extendData.value.orderAmountTotal,false),
      amount: currency(extendData.value.amountTotal,false),
      cost: currency(extendData.value.costTotal,false),
      randomAmount: currency(extendData.value.randomAmountTotal,false),
    },
  },
]);
const searchDate = computed({
  get: () => {
    return [query.value.startTime, query.value.endTime];
  },
  set: (val) => {
    query.value.startTime = val ? val[0] : "";
    query.value.endTime = val ? val[1] : "";
  },
});
const selectOrderStatus = <any>{
  1: t("p58"),//支付中
  2: t("n82"),//已完成
  3: t("m165"),//代收失败
  4: t("n92"),//支付超市
  5: t("n88"),//申诉中
};
const selectPayType = <any>{
  1: t("m166"),
  2: t("m167"),
  3: t("m168"),
  4: t("m169"),
};

const selectCallBackStatus = <any>{
  1: t("n93"),
  2: t("s18"),
  3: t("s19"),
  4: t("s20"),
  5: t("s21"),
};
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
  api: fetchRechargeOrderInfo,
  defaultPageSize: 20,
  filterRules: [],
  afterFetch: (data) =>
  data.map((item: any) => {
    item.amount = currency(item.amount, false);
    item.cost = currency(item.cost, false);
    item.randomAmount = currency(item.randomAmount, false);
    return item;
  }),
});
watchEffect(() => {
  if(!isUseCash.value) resultData.value = response.value;
});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async ( isFirst: any = null) => {
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
//   const res: any = await fetchRechargeOrderInfo(query.value).finally(() => (loading.value = false));
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
//   const res: any = await fetchRechargeOrderInfo(query.value);
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
//     completeEndTime: "",
//     completeStartTime: "",
//     endTime: "",
//     merchantCode: "",
//     merchantName: undefined,
//     merchantOrder: "",
//     orderStatus: undefined,
//     pageNo: 1,
//     pageSize: 20,
//     platformOrder: "",
//     startTime: "",
//     timeType: 0,
//     memberId: '',
//     externalMemberId: '',
//     buyOrderNo: undefined,
//     thirdRechargeFlag: undefined,
//     complainedFlag: undefined,
//     tradeCallbackStartTime: "",
//     tradeCallbackEndTime: "",
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
const rechargeConfirm = async () => {
  loading.value = true;
  const res: any = await rechargeConfirmSuccess({ id: selectId.value }).finally(() => (loading.value = false));
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
// 批量代收
const batchRecharge = async () => {
  loading.value = true;
  const res: any = await merchantInfoAdminRechargeBatchConfirmSuccess(stateIds.value).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    message.success(t("n1217"));
    stateIds.value = [];
    clearSelected();
    getList();
  }
};
// const completionTime = computed({
//   get: () => {
//     return [query.value.completeStartTime, query.value.completeEndTime];
//   },
//   set: (val) => {
//     query.value.completeStartTime = val ? val[0] : "";
//     query.value.completeEndTime = val ? val[1] : "";
//   },
// });
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
  const res: any = await merchantInfoAdminExport(data).finally(() => (loading.value = false));
  if(res && res.code == '1'){
    message.success(t("n545"));
  }
};
const hasPro = (path: string) => {
  const name = path.split('/').join('_')
  return router.hasRoute(name)
}
const goPath = (pathType: number, isGo:boolean, val:any)=>{
  if(!isGo) return;
  const goMap = [
    {name:'_order_buyOrder_index', query: {buyOrderNo: val}},
  ];
  router.push(goMap[pathType])
}
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
  getTabH.value = useTabHeight().getTabH.value;
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
