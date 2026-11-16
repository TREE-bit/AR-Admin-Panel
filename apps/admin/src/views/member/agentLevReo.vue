<template>
    <div class="search">
      <h2>{{ $t('m861') }}</h2>
      <a-row>
        <a-col :span="3">
          <a-input v-trim v-model:value="query.targetUserId" :disabled="props.memberId?true:false" class="searchstyle" :placeholder="$t('m562') +$t('c9')" />
        </a-col>
        <a-col :span="3">
          <a-input v-trim v-model:value="query.platformOrderNo" class="searchstyle" :placeholder="$t('m562') +$t('l90')" />
        </a-col>
        <!-- <a-col :span="3">
          <a-input v-trim v-model:value="query.sourceUserId" class="searchstyle" :placeholder="$t('m562') +$t('m874')" />
        </a-col> -->
        <a-col :span="3">
          <a-select
            allow-clear
            class="searchstyle"
            :placeholder="$t('m563')+$t('m870')"
            v-model:value="query.agentLevel"
          >
            <a-select-option :value="1">{{ $t("m867") }}</a-select-option>
            <a-select-option :value="2">{{ $t("m868") }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            allow-clear
            class="searchstyle"
            :placeholder="$t('m563')+$t('m866')"
            v-model:value="query.tradeType"
          >
            <a-select-option :value="1">{{ $t("m857") }}</a-select-option>
            <a-select-option :value="2">{{ $t("m858") }}</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <timeRange v-model:startTime="query.commissionTimeStart" v-model:endTime="query.commissionTimeEnd"  :title="$t('m873')" :type="1"/>
        </a-col>
        <a-col>
          <a-button type="primary" :icon="h(SearchOutlined)" @click="getList(1)">{{
            $t("search")
          }}</a-button>
          <a-button type="primary" @click="reset">{{
            $t("reset")
          }}
          </a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="pagination"
      :scroll="{ x: '100%' , y :getTabH+'px'}"
      :loading="loading"
      @change="handleTableChange"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'targetUserId'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record.targetUserId)"
          >{{ record.targetUserId }}</a-button
        >
        <CopyOutlined v-if="record.targetUserId" class="copyId"  @click="$copyId(record.targetUserId)" />
      </template>
      <template v-if="column.key === 'sourceUserId'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record.sourceUserId)"
          >{{ record.sourceUserId }}</a-button
        >
        <CopyOutlined v-if="record.sourceUserId" class="copyId"  @click="$copyId(record.sourceUserId)" />
      </template>
      <template v-if="column.key ==='commissionType'">
        {{ $getMapItem(agentMoneyMap,record.commissionType) }}
      </template>
    </template>
    <template #summary>
      <a-table-summary fixed="bottom">
        <a-table-summary-row>
          <a-table-summary-cell :col-span="3" align="left"> {{ $t("m54") }}</a-table-summary-cell>
          <!-- <a-table-summary-cell :col-span="10" /> -->
          <a-table-summary-cell :col-span="1" align="center">
            <a-typography-text type="danger">{{ extendData.pageCommission }}</a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="2" />
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell :col-span="3" align="left">{{ $t("m55") }}</a-table-summary-cell>
          <!-- <a-table-summary-cell :col-span="10" /> -->
          <a-table-summary-cell :col-span="1" align="center">
            <a-typography-text type="danger"> {{ extendData.totalCommission }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="2" />
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
      :memberID="userId"
      :id="userId"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h, computed } from "vue";
import {
  commissionRecordAdminGetList
} from "@/api/menber";
import { useI18n } from "vue-i18n";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useRoute, useRouter } from "vue-router";
const props = defineProps({
  memberId: {
    type: Number,
  }
})
const route = useRoute(); 
const router = useRouter();
const { getTabH } = useTabHeight();
const { t } = useI18n();
const detailModel = ref(false);
const userId = ref<any>(0);
const showDetail = async (value: any) => {
  userId.value = value;
  detailModel.value = true;
};
const agentMoneyMap:any = {
  1: t('m862'),
  2: t('m863'),
  3: t('m864'),
  4: t('m865'),
}
const columns:any = [
  {
    title: t('c9'),
    dataIndex: "targetUserId",
    key: "targetUserId",
    align: "center",
    width: 120,
  },
  {
    title: t('l90'),
    dataIndex: "platformOrderNo",
    key: "platformOrderNo",
    align: "center",
    width: 180,
  },
  {
    title: t('m874'),
    dataIndex: "sourceUserId",
    key: "sourceUserId",
    align: "center",
    width: 120,
  },
  {
    title: t('m875'),
    dataIndex: "commissionAmount",
    key: "commissionAmount",
    align: "center",
    width: 140,
  },
  {
    title: t('m866'),
    dataIndex: "commissionType",
    key: "commissionType",
    align: "center",
    width: 160,
  },
  {
    title: t('m873'),
    dataIndex: "commissionTime",
    key: "commissionTime",
    align: "center",
    width: 170,
  },
];
// const loading = ref(false);
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const query = ref({
  asc: false,
  pageNo: 1,
  pageSize: 20,
  targetUserId: props.memberId || undefined,
  // sourceUserId: undefined,
  platformOrderNo: undefined,
  // commissionType: undefined,
  agentLevel: undefined,
  tradeType: undefined,
  commissionTimeStart: "",
  commissionTimeEnd: "",
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const reset = () => {
  query.value = {
    asc: false,
    pageNo: 1,
    pageSize: 20,
    targetUserId: props.memberId || undefined,
    // sourceUserId: undefined,
    platformOrderNo: undefined,
    agentLevel: undefined,
    tradeType: undefined,
    // commissionType: undefined,
    commissionTimeStart: "",
    commissionTimeEnd: "",
    firstPage: true,
    lastPage:false,
    direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
    nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
    nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
    prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
    prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
  };
  pagination.value.current = 1;
  pagination.value.pageSize = 20;
  getList();
}
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
    targetUserId: props.memberId || q.targetUserId,
  }),
  api: commissionRecordAdminGetList,
  defaultPageSize: 20,
  resDataType: 2,
  filterRules: [
    { key: "directSubordinateCount" },
    { key: "totalCommissionAmount" },
  ],
  // afterFetch: (data) =>
  // data.map((item: any) => {
  //   item.failureType = item.failureType ? item.failureType : 2;
  //   return item;
  // }),
});
// const dataSource = ref([]);
// const extendData:any = ref({});
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
//   const res: any = await commissionRecordAdminGetList(query.value).finally(() => loading.value = false);
//   if (res && res.code == "1") {
//     dataSource.value = res.data.list;
//     extendData.value = res.data.extend;
//     query.value.nextColValue = res.data.extend?.nextColValue;
//     query.value.nextCursorId = res.data.extend?.nextCursorId;
//     query.value.prevColValue = res.data.extend?.prevColValue;
//     query.value.prevCursorId = res.data.extend?.prevCursorId;
//     pagination.value.current = query.value.pageNo;
//     pagination.value.pageSize = query.value.pageSize;
//     pagination.value.total = res.data.total;
//     oldPageNo.value = query.value.pageNo;
//     pageCurrent.value = Math.ceil(res.data.total/query.value.pageSize);
//   }
// };
// const getforData = async ()=>{
//   const res: any = await commissionRecordAdminGetList(query.value);
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
onMounted(() => {
  getList();
  getTabH.value = useTabHeight().getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
