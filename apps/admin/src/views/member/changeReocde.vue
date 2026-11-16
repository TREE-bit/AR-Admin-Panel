<template>
    <div class="search">
      <h2>{{ $t('m35') }}</h2>
      <a-row>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.obscureId"
            class="searchstyle"
            :placeholder="$t('pleaseEnter')+$t('c9')+'/'+$t('m207')+'/'+$t('l91')"
          />
        </a-col>
        <!-- <a-col :span="3">
          <a-input
            v-model:value="query.orderNo"
            class="searchstyle"
            :placeholder="$t('p61')"
          />
        </a-col> -->
        <a-col :span="3">
          <a-select
          allowClear
          show-search
          class="searchstyle"
          :placeholder="$t('m563') +$t('m677')"
          v-model:value="query.merchantName"
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
            v-model:value="query.obscureOrderNo"
            class="searchstyle"
            :placeholder="$t('n47')+'/'+$t('l96')"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            class="searchstyle"
            :placeholder="$t('m62')"
            v-model:value="query.changeType"
            :options="Object.entries(changeType).map(([key, value]:[any,any]) => ({ value: key, label: $t(value), }))"
          >
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            class="searchstyle"
            :placeholder="$t('m563')+$t('n589')"
            v-model:value="query.fundType"
            :options="[
              { value: 1, label: 'ARB' },
              { value: 2, label: 'CPB' },
              { value: 3, label: 'ARB/CPB' },
            ]"
          >
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('m563')+$t('m656')"
          v-model:value="query.payType"
          :options="Object.entries(payTypeData).map(([key, value]:[any,any]) => ({ value: key, label: $t(value), }))"
        >
        </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('m682')"
          v-model:value="query.strideMerchant"
        >
          <a-select-option :value="0">{{ $t('no') }}</a-select-option>
          <a-select-option :value="1">{{ $t('yes') }}</a-select-option>
        </a-select>
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.remark"
            class="searchstyle"
            :placeholder="$t('m562')+$t('remark')"
          />
        </a-col>
        <!-- <a-col :span="6">
          <a-range-picker
          show-time
          v-model:value="searchDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m66')]"
        />
        </a-col> -->
        <a-col >
          <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('m70')" :type="1"/>
        </a-col>
        <a-col>
          <a-button type="primary" :icon="h(SearchOutlined)" @click="getList(1)">{{
            $t("search")
          }}</a-button>
          <a-button type="primary" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
        <ExportButton
          :query="query"
          :api="memberAccounthangeAdminExport"
          permission="admin:memberAccounthangeAdmin:export"
        />
          <!-- <a-button type="primary" :loading="loadingEx" @click="exportList" v-permission="'admin:memberAccounthangeAdmin:export'">{{
            $t("export")
          }}</a-button> -->
        </a-col>
      </a-row>
    </div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="pagination"
      :scroll="{ x: '100%' ,y : getTabH+'px'}"
      :loading="loading"
      @change="handleTableChange"
      bordered
    >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'tradeMerchantName'">
        <span>
        {{ $t('m680')}}
        <a-tooltip :title="$t('m679')">
          <QuestionCircleOutlined style="margin-left: 5px; color: #000" />
        </a-tooltip>
      </span>
      </template>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'mid'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record)"
          >{{ record.mid }}</a-button
        >
        <CopyOutlined v-if="record.mid" class="copyId"  @click="$copyId(record.mid)" />
      </template>
      <template v-if="column.key ==='changeType'">
        {{ $t($getMapItem(changeType,record.changeType)) }}
      </template>
      <template v-if="column.key ==='fundType'">
        <span v-if='record.fundType'>
          {{ record.fundType == 1 ? 'ARB' : record.fundType == 2 ? 'CPB' : record.fundType == 3 ? 'ARB/CPB' : record.fundType }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key ==='payType'">
        {{ record.payType ? $t($getMapItem(payTypeData,record.payType)): '-' }}
      </template>
      <template v-if="column.key ==='beforeChange'">
        {{ currency(record.beforeChange,false) }}
      </template>
      <template v-if="column.key ==='amountChange'">
        {{ currency(record.amountChange,false) }}
      </template>
      <template v-if="column.key ==='afterChange'">
        {{ currency(record.afterChange,false) }}
      </template>
      <template v-if="column.key ==='strideMerchant'">
        <span :style="record.strideMerchant == 1 ? 'color:#52c41a' : ''">{{ record.strideMerchant == 1 ? $t('yes') : $t('no') }}</span>
      </template>
      <template v-if="column.key ==='merchantOrder'">
        <a-tooltip>
          <template #title>{{ getNull(record.merchantOrder) }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ getNull(record.merchantOrder) }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'orderNo'">
        <a-button v-if="['5','6'].includes(record.changeType) && record.orderNo.startsWith('MC')" 
        type="link" class="copyContent" @click="goAssemble(record.orderNo)">
          {{ record.orderNo }}
        </a-button>
        <span v-else>{{ record.orderNo }}</span>
        <CopyOutlined v-if="record.orderNo" class="copyId"  @click="$copyId(record.orderNo)" />
      </template>
      <!-- <template v-if="column.key ==='orderNo'">
        <a-tooltip>
          <template #title>{{ getNull(record.orderNo) }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ getNull(record.orderNo) }}</div>
        </a-tooltip>
      </template> -->
      <template v-if="column.key === 'memberAccount'">
        <a-tooltip>
          <template #title>{{ record.memberAccount }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.memberAccount }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
      </template>
    </template>
    <template #summary>
      <a-table-summary fixed="bottom">
      <a-table-summary-row>
        <a-table-summary-cell :col-span="1" align="center"> {{ $t("m54") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="10" />
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger">{{ currency(extendData.beforeChangePageTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger">{{ currency(extendData.amountChangePageTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger">{{ currency(extendData.afterChangePageTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="3" />
      </a-table-summary-row>
      <a-table-summary-row>
        <a-table-summary-cell :col-span="1" align="center">{{ $t("m55") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="10" />
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger"> {{ currency(extendData.beforeChangeTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger"> {{ currency(extendData.amountChangeTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger">{{ currency(extendData.afterChangeTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="3" />
      </a-table-summary-row>
      </a-table-summary>
    </template>
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
      :id="detailId.mid"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { SearchOutlined,QuestionCircleOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h, computed } from "vue";
import {changeType} from "@/utils/publicData";
import {
  getMemberAccounthangeAdmin
} from "@/api/menber";
// import { getMerchantInfoAdminList } from "@/api/merchant.api"
import { useI18n } from "vue-i18n";
import { memberAccounthangeAdminExport } from "@/api/export";
import { getStartAndEndOfDay, usePagination } from "@/plugins/dataMap";
import { currency } from "@/utils";
import { useRoute } from "vue-router";
import router from "@/router";
import { payTypeData } from "@/utils/publicData";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { message } from "ant-design-vue";
import { useMerchantStore } from "@/stores/useMerchantStore";
const merchantList = computed(() => useMerchantStore().merchantList);
const { getTabH } = useTabHeight();
const route = useRoute();
const { t } = useI18n();
// const extendData:any = ref({});
const props = defineProps({
  id: {
    default: () => "",
  },
});
const detailModel = ref(false);
const detailId = ref<any>({});
const showDetail = async (value: any) => {
  const { mid, memberId } = value;
  detailId.value = { mid, memberId };
  detailModel.value = true;
};
const columns:any = ref([
  {
    title: t('c9'),
    dataIndex: "mid",
    key: "mid",
    align: "center",
    width: 180,
  },
  {
    title: t('m207'),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: t('c10'),
    dataIndex: "memberAccount",
    key: "memberAccount",
    align: "center",
    width: 180,
    // customRender: ({ text }) => h('div', { style: { whiteSpace: 'normal' }}, text),
  },
  {
    title: t('m677'),
    dataIndex: "merchantName",
    key: "merchantName",
    align: "center",
    width: 160,
  },
  {
    title: t('m680'),
    dataIndex: "tradeMerchantName",
    key: "tradeMerchantName",
    align: "center",
    width: 160,
  },
  {
    title: t('n47'),
    dataIndex: "orderNo",
    key: "orderNo",
    align: "center",
    width: 220,
  },
  {
    title: t('l96'),
    dataIndex: "merchantOrder",
    key: "merchantOrder",
    align: "center",
    width: 220,
  },
  {
    title: t('m67'),
    dataIndex: "changeType",
    key: "changeType",
    align: "center",
    width: 220,
  },
  {
    title: t('n589'),
    dataIndex: "fundType",
    key: "fundType",
    align: "center",
    width: 120,
  },
  {
    title: t('m656'),
    dataIndex: "payType",
    key: "payType",
    align: "center",
    width: 220,
  },
  {
    title: t('m681'),
    dataIndex: "strideMerchant",
    key: "strideMerchant",
    align: "center",
    width: 120,
  },
  {
    title: t('m68'),
    dataIndex: "beforeChange",
    key: "beforeChange",
    align: "center",
    width: 240,
    sorter: {
      compare: (a:any, b:any) => a.beforeChange - b.beforeChange,
    },
  },
  {
    title: t('l98'),
    dataIndex: "amountChange",
    key: "amountChange",
    align: "center",
    width: 220,
    sorter: {
      compare: (a:any, b:any) => a.amountChange - b.amountChange,
    },
  },
  {
    title: t('m69'),
    dataIndex: "afterChange",
    key: "afterChange",
    align: "center",
    width: 240,
    sorter: {
      compare: (a:any, b:any) => a.afterChange - b.afterChange,
    },
  },
  {
    title: t('m70'),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 180,
  },
  {
    title: t('l48'),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 220,
  },
  {
    title: t('remark'),
    dataIndex: "remark",
    key: "remark",
    width: 240,
    align: "center",
    // customRender: ({ text }) => h('div', { style: { whiteSpace: 'normal' }}, text),
  },
]);
// const loading = ref(false);
// const { paginationConfig } = usePagination();

// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const query = ref({
  asc: <any>false,
  column:'',
  amountChangeEnd: undefined,
  amountChangeStart: undefined,
  changeType: undefined,
  merchantOrder: undefined,
  createTimeEnd: route.query.withdraw?'':endIndiaTime,
  createTimeStart: route.query.withdraw?'':startIndiaTime,
  orderNo: undefined,
  pageNo: 1,
  pageSize: 20,
  payType: undefined,
  obscureId: undefined,
  obscureOrderNo: route.query.withdraw || undefined as any,
  merchantName: undefined,
  remark: undefined,
  strideMerchant: undefined,
  fundType: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
// const dataSource = ref([]);
// const memberList=ref<any>([]);
// const isChange = ref(false)
// const getMembetList = async () => {
//   loading.value = true;
//   const res: any = await getMerchantInfoAdminList({pageNo:1,pageSize:10000}).finally(()=>loading.value=false);
//   if (res){
//     const uniqueValues = new Set(res.data.map((item: { username: string }) => item.username));
//     memberList.value = Array.from(uniqueValues).map(value => ({ value }));
//   }
// }
const {
  dataSource,
  extendData,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  handleQueryFields: (q) => ({
    ...q,
  }),
  api: getMemberAccounthangeAdmin,
  defaultPageSize: 20,
  filterRules: [
    { key: "beforeChange" },
    { key: "amountChange" },  
    { key: "afterChange" },
  ],
  // afterFetch: (data) =>
  // data.map((item: any) => {
  //   item.failureType = item.failureType ? item.failureType : 2;
  //   return item;
  // }),
});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (isFirst : any = null) => {
//   if(isFirst){
//     query.value.pageNo =1;
//     pagination.value.current = 1;
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
//   const res: any = await getMemberAccounthangeAdmin(Object.assign(query.value,{id: props.id})).finally(()=>loading.value=false);
//   if (res && res.code == "1") {
//     dataSource.value = res.data;
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
//   }
// };
// const getforData = async ()=>{
//   const res: any = await getMemberAccounthangeAdmin(Object.assign(query.value,{id: props.id}));
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
const searchDate = computed({
  get: () => {
    return [query.value.createTimeStart, query.value.createTimeEnd];
  },
  set: (val) => {
    query.value.createTimeStart = val ? val[0] : "";
    query.value.createTimeEnd = val ? val[1] : "";
  },
});
const getNull = (value:any) => {
  return value?value:'-';
};
// const resetQuery = () => {
//   query.value={
//   asc: false,
//   column: '',
//   amountChangeEnd: undefined,
//   amountChangeStart: undefined,
//   changeType: undefined,
//   merchantOrder: undefined,
//   createTimeEnd: "",
//   createTimeStart: "",
//   orderNo: undefined,
//   pageNo: 1,
//   pageSize: 20,
//   obscureId: undefined,
//   obscureOrderNo: undefined,
//   merchantName: undefined,
//   payType: undefined,
//   remark: undefined,
//   strideMerchant: undefined,
//   fundType: undefined,
//   firstPage: true,
//   lastPage:false,
//   direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//   nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//   nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//   prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//   prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
// }
// pagination.value.pageSize = 20;
// pagination.value.current = 1;
//   getList();
// };
// const { handleTableChange } = useTableChange({
//   query,
//   pagination,
//   getList,
//   filterRules: [
//     { key: "beforeChange" },
//     { key: "amountChange" },  
//     { key: "afterChange" },
//   ],
// });
// const columnVal=ref("");
// const sortVal=ref("");
// const handleTableChange: any = (pag: { pageSize: number; current: number },filters:any, sorter:any) => {
//   paginationConfig.current = pag.current;
//   paginationConfig.pageSize = pag.pageSize;
//   query.value.pageNo = pag.current;
//   query.value.pageSize = pag.pageSize;
//   const { columnKey, order } = sorter;
//   if(columnVal.value === columnKey){
//     paginationConfig.current = pag.current;
//       query.value.pageNo = pag.current;
//     if(sortVal.value!=order){
//       paginationConfig.current = 1;
//       query.value.pageNo = 1;
//     }
//   }else{
//     if(order) {
//       paginationConfig.current = 1;
//       query.value.pageNo = 1;
//     }
//   }
//   if(order==undefined){
//     query.value.asc = '';
//     query.value.column = '';
//     columnVal.value = "";
//     sortVal.value = "";
//     isChange.value = false;
//   }else{
//     query.value.column = columnKey;
//     columnVal.value = columnKey;
//     sortVal.value = order;
//     query.value.asc = Boolean(order === "ascend");
//     isChange.value = true;
//     // paginationConfig.current = 1;
//   }
//   if(pag.pageSize != paginationConfig.pageSize){
//     query.value.pageNo = 1;
//     paginationConfig.current = 1;
//   }else{
//     query.value.pageNo = pag.current;
//     paginationConfig.current = pag.current;
//   }
//   getList();
// };
const goAssemble = (orderNo: any) => {
  const query: any = {withdraw:''};
  query.withdraw = orderNo;
  router.push({ path: "/order/assemble/index", query });
};
const loadingEx = ref(false);
const exportList = async () => {
  loadingEx.value = true;
  const data = JSON.parse(JSON.stringify(query.value));
  const res: any = await memberAccounthangeAdminExport(data).finally(() => (loadingEx.value = false));
  if (res && res.code == "1") {
    message.success(t("n545"));
  }
};
onMounted(() => {
  // getMembetList();
  getList();
  getTabH.value = useTabHeight().getTabH.value;
});
</script>
<style lang="less" scoped>
</style>