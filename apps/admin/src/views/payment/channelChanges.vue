<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.thirdCode"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('m674')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.thirdOrderNo"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('n864')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.platformOrderNo"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('n47')"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.npcMemberId"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('m562') + $t('c9')"
        />
      </a-col> -->
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          v-model:value="query.changeType"
          :placeholder="$t('m62')"
          class="searchstyle"
        >
          <a-select-option v-for="(item, key) in channelChangeTypeMap" :value="key">{{
            item
          }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.remark"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+$t('remark')"
        />
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.changeTimeGe" v-model:endTime="query.changeTimeLe"
        :title="$t('m70')" :type="1"/>
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
          :api="channelAccountChangeAdminListPageForExport"
          permission="admin:channelAccountChangeAdmin:listPageForExport"
        />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:channelAccountChangeAdmin:listPageForExport'"
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
      <template v-if="column.key === 'receiveType'">
        {{  $getMapItem(thirdChannelPayTypeMap,record.receiveType) || '-' }}
      </template>
      <template v-if="column.key === 'currencyType'">
        {{  $getMapItem(thirdChannelCurrencyMap,record.currencyType) || '-' }}
      </template>
      <template v-if="column.key === 'changeType'">
        {{  $getMapItem(channelChangeTypeMap,record.changeType) || '-' }}
      </template>
      <template v-if="column.key === 'operateBy'">
        <a-tooltip v-if="record.operateBy">
          <template #title>{{ record.operateBy }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
              {{ record.operateBy }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip v-if="record.remark">
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
              {{ record.remark }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'currencyType'"
        />
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { channelAccountChangeAdminList } from "@/api/channel.api";
import { channelAccountChangeAdminListPageForExport } from "@/api/export";
import { onMounted, ref, h, toRefs, computed } from "vue";
import { useI18n } from "vue-i18n";
import { currency } from "@/utils";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { message } from "ant-design-vue";
import { channelChangeTypeMap,thirdChannelCurrencyMap,thirdChannelPayTypeMap } from "@/utils/publicData"
import { useTableChange } from "@/hooks/useTableChange.hooks";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
// import { useThirdCode } from "@/stores/useThirdCode";
// const { thirdCodeList } = toRefs(useThirdCode());
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight(1);
const { t } = useI18n();
// const loading = ref(false);
// const dataSource = ref([]);
// const extendData = ref<any>({});
const query = ref({
  pageNo: 1,
  pageSize: 20,
  npcMemberId: undefined,
  thirdCode: undefined,
  thirdOrderNo: undefined,
  platformOrderNo: undefined,
  changeType: undefined,
  remark: undefined,
  changeTimeGe: startIndiaTime,
  changeTimeLe: endIndiaTime,
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
    title: t("n864"),
    dataIndex: "thirdOrderNo",
    key: "thirdOrderNo",
    align: "center",
    width: 240,
  },
  {
    title: t("n47"),
    dataIndex: "platformOrderNo",
    key: "platformOrderNo",
    align: "center",
    width: 240,
  },
  {
    title: t("m70"),
    dataIndex: "changeTime",
    key: "changeTime",
    align: "center",
    width: 140,
  },
  {
    title: t("m674"),
    dataIndex: "thirdCode",
    key: "thirdCode",
    align: "center",
    width: 170,
  },
  {
    title: t("type"),
    dataIndex: "changeType",
    key: "changeType",
    align: "center",
    width: 120,
  },
  {
    title: t("m777"),
    dataIndex: "receiveType",
    key: "receiveType",
    align: "center",
    width: 120,
  },
  {
    title: t("userForm1"),
    dataIndex: "currencyType",
    key: "currencyType",
    align: "center",
    width: 120,
  },
  {
    title: t("n865"),
    dataIndex: "beforeChange",
    key: "beforeChange",
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
    title: t("l98"),
    dataIndex: "changeAmount",
    key: "changeAmount",
    align: "center",
    width: 120,
  },
  {
    title: t("l99"),
    dataIndex: "afterChange",
    key: "afterChange",
    align: "center",
    width: 120,
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
    dataIndex: "operateBy",
    key: "operateBy",
    align: "center",
    width: 200,
  },
];
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      beforeChange: extendData.value.beforeAmountSum,
      changeAmount: extendData.value.changeAmountSum,
      afterChange: extendData.value.afterAmountSum,
    },
  },
  {
    label: t("m55"),
    fields: {
      beforeChange: extendData.value.totalBeforeAmountSum,
      changeAmount: extendData.value.totalChangeAmountSum,
      afterChange: extendData.value.totalAfterAmountSum,
    },
    fixedPositions: {
      amount: 5,
    },
  },
]);
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
// const resetQuery = async () => {
//   query.value = {
//     pageNo: 1,
//     pageSize: 20,
//     npcMemberId: undefined,
//     thirdCode: undefined,
//     thirdOrderNo: undefined,
//     platformOrderNo: undefined,
//     changeType: undefined,
//     remark: undefined,
//     changeTimeGe: '',
//     changeTimeLe: '',
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
  api: channelAccountChangeAdminList,
  defaultPageSize: 20,
  resDataType: 2,
  filterRules: [],
  // afterFetch: (data) =>
  // data.map((item: any) => {
  //   item.usdtNum = thousand(item.usdtNum);
  //   item.arbNum = thousand(item.arbNum);
  //   return item;
  // }),
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
//   const res: any = await channelAccountChangeAdminList(query.value).finally(()=>loading.value = false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data.list || [];
//     extendData.value = res.data.extend;
//     pagination.value.total = res.data.total;
//     query.value.nextColValue = res.data.extend?.nextColValue;
//     query.value.nextCursorId = res.data.extend?.nextCursorId;
//     query.value.prevColValue = res.data.extend?.prevColValue;
//     query.value.prevCursorId = res.data.extend?.prevCursorId;
//     pagination.value.current = query.value.pageNo;
//     pagination.value.pageSize = query.value.pageSize;
//     oldPageNo.value = query.value.pageNo;
//     pageCurrent.value = Math.ceil(res.data.total/query.value.pageSize);
//   }
// };
// const getforData = async ()=>{
//   const res: any = await channelAccountChangeAdminList(query.value);
//   if(res.code == 1){
//     query.value.nextColValue = res.data.extend?.nextColValue;
//     query.value.nextCursorId = res.data.extend?.nextCursorId;
//     query.value.prevColValue = res.data.extend?.prevColValue;
//     query.value.prevCursorId = res.data.extend?.prevCursorId;
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
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res: any = await channelAccountChangeAdminListPageForExport(data).finally(()=>loading.value = false);
  if(res && res.code == '1'){
    message.success(t("n545"));
  }
}
onMounted(async() => {
  // await getType();
  await getList();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style scoped>
</style>