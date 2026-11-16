<template>
  <div class="search">
    <h2>{{ $t("m28") }}</h2>
    <a-row>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.merchantName"
          :placeholder="$t('m258')"
          :allowClear="true"
          :show-search="true"
          :options="merchantList.map((item: any) => ({ label: item.username, value: item.username }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          v-model:value="query.merchantType"
          :placeholder="$t('p16')"
          class="searchstyle"
        >
          <a-select-option v-for="(item, key) in merchantTypeMap" :value="key">{{
            item
          }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.orderNo"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('m60')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.merchantOrder"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('m562') + $t('n47')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          v-model:value="query.changeType"
          :placeholder="$t('m62')"
          class="searchstyle"
        >
          <a-select-option v-for="(item, key) in statusMap" :value="key">{{
            item
          }}</a-select-option>
        </a-select>
      </a-col>
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          v-model:value="query.accountSourceType"
          :placeholder="$t('n581')"
          class="searchstyle"
        >
          <a-select-option v-for="(item, key) in sourceTypeMap" :value="key">{{
            item
          }}</a-select-option>
        </a-select>
      </a-col> -->
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.remark"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+$t('remark')"
        />
      </a-col>
      <!-- <a-col :span="6">
        <a-range-picker
          show-time
          v-model:value="searchDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('publicStartTime'), $t('publicEndTime')]"
        />
      </a-col> -->
      <a-col>
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('l95')" :type="1"/>
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
          :api="accountChangeAdminExport"
          permission="admin:accountChangeAdmin:export"
        />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:accountChangeAdmin:export'"
          >{{ $t("export") }}</a-button> -->
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' ,y: getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'orderNo'">
        <a-tooltip v-if="record.orderNo">
          <template #title>{{ record.orderNo }}</template>
          <div class="toopTipStyle">
              {{ record.orderNo }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'merchantOrder'">
        <a-tooltip v-if="record.merchantOrder">
          <template #title>{{ record.merchantOrder }}</template>
          <div class="toopTipStyle">
              {{ record.merchantOrder }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'merchantType'">
        {{ merchantTypeMap[record.merchantType] || '-' }}
      </template>
      <template v-if="column.key === 'changeType'">
        <div  class="toopTipStyle3">
          {{  statusMap[record.changeType] }}
        </div>
      </template>
      <template v-if="column.key === 'accountSourceType'">
        <span v-if="record.accountSourceType">{{ sourceTypeMap[record.accountSourceType] }}</span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'updateBy'">
        {{ record.updateBy || 'system' }}
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
              {{ record.remark }}
          </div>
        </a-tooltip>
      </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'orderNo'"
        />
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { accountChangeListApi, fetchAccountTypeApi } from "@/api/merchant.api";
import { accountChangeAdminExport } from "@/api/export";
import { onMounted, ref, h, computed, reactive } from "vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { currency } from "@/utils";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { message } from "ant-design-vue";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { useMerchantStore } from "@/stores/useMerchantStore";
const merchantList = computed(() => useMerchantStore().merchantList);
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight(340);
const { t } = useI18n();
const today = dayjs();
const todayStart = today.startOf("day").format("YYYY-MM-DD HH:mm:ss");
const todayEnd = today.endOf("day").format("YYYY-MM-DD HH:mm:ss");
// const loading = ref(false);
// const dataSource = ref([]);
// const extendData = ref<any>({});
const query = ref({
  asc: false,
  endTime: endIndiaTime,
  merchantName: undefined,
  merchantType: undefined,
  orderNo: undefined,
  merchantOrder: undefined,
  pageNo: 1,
  pageSize: 20,
  startTime: startIndiaTime,
  changeType: undefined,
  // accountSourceType: undefined,
  remark: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const merchantTypeMap = <any>{
  1: t("n24"),//内部商户
  2: t("n25"),//外部商户
};
const sourceTypeMap = <any>{
  1: t("n586"),//AR_UPI订单
  2: t("n587"),//AR_UPI订单
}
const columns:any = [
  {
    title: t("l96"),
    dataIndex: "orderNo",
    key: "orderNo",
    align: "center",
    width: 240,
  },
  {
    title: t("n47"),
    dataIndex: "merchantOrder",
    key: "merchantOrder",
    align: "center",
    width: 240,
  },
  {
    title: t("l95"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 170,
  },
  {
    title: t("l91"),
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
    title: t("l92"),
    dataIndex: "merchantName",
    key: "merchantName",
    align: "center",
    width: 120,
  },
  {
    title: t("type"),
    dataIndex: "changeType",
    key: "changeType",
    align: "center",
    width: 120,
  },
  {
    title: t("n581"),
    dataIndex: "accountSourceType",
    key: "accountSourceType",
    // filters: Object.entries(sourceTypeMap).map(([key, value]:[any,any]) => ({
    //           value: key,
    //           text: t(value),
    //         })),
    // filterMultiple: false,
    // filteredValue: query.value.accountSourceType != undefined ? [query.value.accountSourceType] : null,
    // onFilter: (value:any, record:any) => record.accountSourceType == value,
    align: "center",
    width: 120,
  },
  {
    title: t("l97"),
    dataIndex: "beforeChange",
    key: "beforeChange",
    align: "center",
    width: 200,
  },
  {
    title: t("l98"),
    dataIndex: "amountChange",
    key: "amountChange",
    align: "center",
    width: 200,
  },
  {
    title: t("l99"),
    dataIndex: "afterChange",
    key: "afterChange",
    align: "center",
    width: 200,
  },
  {
    title: t("n8"),
    dataIndex: "commission",
    key: "commission",
    align: "center",
    width: 200,
  },
  {
    title: t("remark"),
    dataIndex: "remark",
    key: "remark",
    align: "center",
    width: 200,
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 200,
  },
];
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const statusMap = <any>ref({
  1: t("n870"),//代收->ARPAY代收
  2: t("n871"),//代付->ARPAY代付
  3: t("m721"),//下发
  8: t("m251"),//下分
  4: t("m722"),//上分
  5: t("n872"),//代收费用->ARPAY代收费用
  6: t("n873"),//代付费用->ARPAY代付费用
  7: t("m720"),//下发回退
  17: t("m633"),//余额退回
  18: t("n185"),//补单上分
  19: t("n243"),//补单代收费用
  20: t("n766"),//代付退回
  21: t("n767"),//代付费用退回
  22: t("n874"),//快捷提现代付->ARUPI代付
  23: t("n875"),//快捷提现代付费用->ARUPI代付费用
  24: t("n876"),//代收AR_UPI->ARUPI代收
  25: t("n877"),//AR_UPI代收费用->ARUPI代收费用
  26: t("n1325"),//优惠金额
  27: t("n1792"),//单笔代收手续费
  28: t("n1793"),//单笔代付手续费
});
const summaryRows: any = computed(() => [
  {
    label: t("m54"),
    fields: {
      beforeChange: currency(extendData.value.beforeChangePageTotal),
      amountChange: currency(extendData.value.amountChangePageTotal),
      afterChange: currency(extendData.value.afterChangePageTotal),
      commission: currency(extendData.value.commissionPageTotal),
    },
  },
  {
    label: t("m55"),
    fields: {
      beforeChange: currency(extendData.value.beforeChangeTotal),
      amountChange: currency(extendData.value.amountChangeTotal),
      afterChange: currency(extendData.value.afterChangeTotal),
      commission: currency(extendData.value.commissionTotal),
    },
    fixedPositions: {
      orderNo: 1,
    },
  },
]);
// const resetQuery = async () => {
//   query.value = {
//     asc: false,
//     endTime: '',
//     merchantName: undefined,
//     orderNo: undefined,
//     merchantOrder: undefined,
//     pageNo: 1,
//     pageSize: 20,
//     startTime: '',
//     changeType: undefined,
//     // accountSourceType: undefined,
//     remark: undefined,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   pagination.value.current = 1;
//   pagination.value.pageSize = 20;
//   getList();
// };
const {
  dataSource,
  pagination,
  extendData,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: accountChangeListApi,
  defaultPageSize: 20,
  filterRules: [],
  afterFetch: (data) =>
  data.map((item: any) => {
    item.afterChange = currency(item.afterChange)
    item.amountChange = currency(item.amountChange)
    item.beforeChange = currency(item.beforeChange)
    item.commission = currency(item.commission)
    return item;
  }),
});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (isFirst: any = null) => {
//   if (isFirst) {
//     query.value.pageNo = 1;
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
//   const res: any = await accountChangeListApi(query.value).finally(()=>loading.value = false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data.map((item:any)=>{
//       item.afterChange = currency(item.afterChange)
//       item.amountChange = currency(item.amountChange)
//       item.beforeChange = currency(item.beforeChange)
//       item.commission = currency(item.commission)
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
//   }
// };
// const getforData = async ()=>{
//   const res: any = await accountChangeListApi(query.value);
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
//   filterRules: [],
// });
// const handleTableChange: any = (value: {
//   pageSize: number;
//   current: number;
// }) => {
//   const { current, pageSize } = value;
//   query.value.pageNo = current;
//   pagination.current = current;
//   if (pageSize != query.value.pageSize) {
//     query.value.pageSize = pageSize;
//     pagination.pageSize = pageSize;
//     query.value.pageNo = 1;
//     pagination.current = 1;
//   }
//   getList(query.value);
// };
// const getType = async () => {
//   const res: any = await fetchAccountTypeApi();
//   if (res && res.code === "1") {
//     statusMap.value = res.data;
//   }
// };
const exportList = async () => {
  loading.value = true;
  const res: any = await accountChangeAdminExport(Object.assign(query.value,{source: 1})).finally(()=>loading.value = false);
  if(res && res.code == '1'){
    message.success(t("n545"));
  }
}
onMounted(async() => {
  // await getType();
  await getList();
  getTabH.value = useTabHeight().getTabH.value;
});
</script>
<style scoped>
</style>