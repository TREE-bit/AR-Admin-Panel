<template>
  <div class="search">
    <h2>{{ $t('n757') }}</h2>
  </div>
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
    <template v-if="column.key === 'kycId'">
      {{ record.kycId || '-' }}
    </template>
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
    <template v-if="column.key ==='changeType'">
      {{ $getMapItem(changeTypeMap,record.changeType) || '-' }}
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
      <div v-else >
        {{ '-' }}
      </div>
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
      <div v-else >
        {{ '-' }}
      </div>
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
      <div v-else >
        {{ '-' }}
      </div>
    </template>
    <template v-if="column.key === 'restResultsSuccess'">
      <div v-if="record.restResults && record.restResults.length>0">
        <div v-for="(item,index) in record.restResults" :key="index" class="table_inner_result">
          <a-tag :color="item.success == 1 ? 'green' : 'red'">
            {{ item.success == 1 ? $t('s10') : $t('m618') }}
          </a-tag>
        </div>
      </div>
      <div v-else >
        <a-tag color="red">
          {{ $t('m618') }}
        </a-tag>
      </div>
    </template>
    <template v-if="column.key === 'action'">
      <!-- <a-tag
        color="rgba(22, 155, 213, 1)"
        style="cursor: pointer"
        size="small"
        @click="openConnectLog(record)"
      >{{ $t("b23") }}</a-tag> -->
    </template>
  </template>
  </a-table>
</template>
<script lang="ts" setup>
import {
  kycPartnersAdminKycPullResultLogPage
} from "@/api/kycConfig.api";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { usePagination } from "@/plugins/dataMap";
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue"
const { getTabH } = useTabHeight();
// const { paginationConfig } = usePagination();
const { t } = useI18n();
const props = defineProps({
  connectionUuid: {
    type: String,
    default: "",
  },
});
// const loading = ref(false);
// const dataSource = ref([]);
// const extendData = ref<any>({});
const query = ref({
  pageNo: 1,
  pageSize: 20,
  connectionUuid: props.connectionUuid,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const changeTypeMap: any = {
  16: t('n759'),// 内部订单，卖方流水
  17: t('n758'),// 内部订单，买方流水
  18: t('n760'),// 快捷订单，买方流水
}
const columns:any = [
  {
    title: 'KYC ID',
    dataIndex: "kycId",
    key: "kycId",
    align: "center",
    width: 180,
  },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 120,
  },
  {
    title: t('n328'),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
    width: 120,
  },
  {
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: t('n761'),
    dataIndex: "changeType",
    key: "changeType",
    align: "center",
    width: 90,
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
];
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
    connectionUuid: props.connectionUuid,
  }),
  api: kycPartnersAdminKycPullResultLogPage,
  defaultPageSize: 20,
  filterRules: [
    { key: "sourceType" },
  ],
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
  
//   const queryPageNo = query.value.pageNo;
//   queryCount.value = queryPageNo - oldPageNo.value;
//   if(query.value.pageNo == 1){
//     query.value.firstPage = true;
//     query.value.lastPage = false;
//     resetPageQuery();
//   }else if(query.value.pageNo == pageCurrent.value){
//     query.value.firstPage = false;
//     query.value.lastPage = true;
//     resetPageQuery();
//   }else if(queryCount.value > 0){
//     query.value.firstPage = false;
//     query.value.lastPage = false;
//     query.value.direction = 'next';
//     for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//       await getforData();
//     }
//   }else if(queryCount.value <= 0){
//     query.value.firstPage = false;
//     query.value.lastPage = false;
//     query.value.direction = 'prev';
//     for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//       await getforData();
//     }
//   }
//   // paginationConfig.pageSize = query.value.pageSize;
//   const res: any = await kycPartnersAdminKycPullResultLogPage(query.value).finally(() => loading.value = false);
//   if (res && res.code == "1") {
//     dataSource.value = res.data;
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
//   const res: any = await kycPartnersAdminKycPullResultLogPage(query.value);
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
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//   if (paginationConfig.pageSize != pag.pageSize) {
//     paginationConfig.current = 1;
//     query.value.pageNo = 1;
//   } else {
//     paginationConfig.current = pag.current;
//     query.value.pageNo = pag.current;
//   }
//   paginationConfig.pageSize = pag.pageSize;
//   query.value.pageSize = pag.pageSize;
//   getList();
// };
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3,-120).getTabH.value;
});
</script>
<style lang="less" scoped>
.table_inner_result{
  width: 100%;
  border-bottom: 2px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
}
:deep(.ant-table-cell) {
  padding: 0 !important;
}
</style>
