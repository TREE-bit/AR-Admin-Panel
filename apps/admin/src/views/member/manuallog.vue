<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row class="mb15">
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          v-model:value="query.opType"
          :options="formattedMerchantList"
          :placeholder="$t('m239')"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim v-model:value="query.createBy" class="searchstyle" :placeholder="$t('m240')" />
      </a-col>
      <!-- <a-col :span="4">
        <a-range-picker class="searchstyle" v-model:value="searchDate" :picker="dateType" />
      </a-col> -->
        <a-col >
          <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('l67')" :type="1"/>
        </a-col>
      <a-col class="c-row c-row-bottom">
        <a-button
          class="ml15"
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          >{{ $t("search") }}</a-button
        >
        <a-button class="ml15" type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    size="middle"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :pagination=" pagination"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    bordered
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record)"
          >{{ record.memberId }}</a-button
        >
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'opType'">
        {{ opType[record.opType] }}
      </template>
      <template v-if="column.key === 'amount'">
        {{ currency(record.amount,false) }}
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
      </template>
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
      :id="detailId.memberId"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { useReport } from "@/hooks/useReport.hook";
import { ref, reactive, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { usePagination, today } from "@/plugins/dataMap";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { getMemberManualLog } from "@/api/menber";
import { currency } from "@/utils";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const [startIndiaTime,endIndiaTime,time] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
// const { dateType, getBiWithdrawOrder } = useReport();
// const { paginationConfig } = usePagination();
// const loading = ref(false);
const detailModel = ref(false);
const detailId = ref<any>({});
const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value = { id, memberId };
  detailModel.value = true;
};
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const query = ref<any>({
  column: '',
  asc: false,
  endTime: endIndiaTime,
  optype: undefined,
  createBy: '',
  pageNo: 1,
  pageSize: 20,
  startTime: startIndiaTime,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
// const dataSource = ref([]);
// const searchDate = computed({
//   get: () => {
//     return [query.value.startTime, query.value.endTime];
//   },
//   set: (val) => {
//     query.value.startTime = val ? val[0].startOf(dateType.value) : "";
//     query.value.endTime = val ? val[1].endOf(dateType.value) : "";
//   },
// });
const columns:any = [
    {
      title: t('c9'),
      dataIndex: "memberId",
      key: "memberId",
      align:"center"
    },
    {
      title: t('m241'),
      dataIndex: "opType",
      key: "opType",
      align:"center"
    },
    {
      title: t('m242'),
      dataIndex: "amount",
      key: "amount",
      align:"center",
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: t('l48'),
      dataIndex: "createBy",
      key: "createBy",
      align:"center"
    },
    {
      title: t('l67'),
      dataIndex: "updateTime",
      key: "updateTime",
      align:"center"
    },
    {
      title: t('remark'),
      dataIndex: "remark",
      key: "remark",
      align:"center"
    },
  ];
const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: getMemberManualLog,
  defaultPageSize: 20,
  filterRules: [],
});
// const extendData = ref<any>({});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (isFirst:any = null) => {
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
//   const res: any = await getMemberManualLog(query.value).finally(()=>loading.value=false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data || [];
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
//   const res: any = await getMemberManualLog(query.value);
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
const changeSort = (sorter:any, rows:any)=>{
  console.log(sorter)
}
const formattedMerchantList = ref<any>([
  {value: 1,label: t('m250'),},
  {value: 2,label: t('m251'),},
  {value: 3,label: t('m79'),},
  {value: 4,label: t('e3'),},
])
const opType = ref<any>({
  '1': t('m250'),
  '2': t('m251'),
  '3': t('m79'),
  '4': t('e3'),
})
// const reset = () => {
//   query.value = {
//     column: '',
//     asc: false,
//     endTime: '',
//     optype: undefined,
//     createBy: '',
//     pageNo: 1,
//     pageSize: 20,
//     startTime: '',
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   pagination.value.current = 1;
//   getList();
// };
// const { handleTableChange } = useTableChange({
//   query,
//   pagination,
//   getList,
//   filterRules: [],
// });
// const getChange = (value: any,filters:any,sorter: any) => {
//   if(sorter.order == 'ascend'){
//     query.value.asc = true;
//     query.value.column = 'amount';
//   }else if(sorter.order == 'descend'){
//     query.value.asc = false;
//     query.value.column = 'amount';
//   }else{
//     query.value.asc = null;
//     query.value.column = '';
//   }
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
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped>
lable {
  display: inline-block;
  width: 100px;
}
</style>
