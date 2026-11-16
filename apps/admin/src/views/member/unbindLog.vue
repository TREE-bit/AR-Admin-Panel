<template>
  <div class="search">
    <h2>{{ $t("n220") }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.memberId"
          :placeholder="$t('m562') +$t('c9')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim v-model:value="query.merchantCode" class="merchantCode" :placeholder="$t('m562') +$t('n9')" />
      </a-col>
      <!-- <a-col :span="3">
        <a-range-picker class="searchstyle" v-model:value="searchDate" :picker="dateType" />
      </a-col> -->
      <a-col :span="3">
        <a-select
          v-model:value="query.unbindFlag"
          class="searchstyle"
          allow-clear
          :placeholder="$t('m563') + $t('n1859')"
          :options="unbindFlagOptions"
        />
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.bindTimeStart" v-model:endTime="query.bindTimeEnd" :title="$t('n216')" :type="1"/>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('l67')" :type="1"/>
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
    size="middle"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
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
      <template v-if="column.key === 'merchantCode'">
        {{ record.merchantCode || '-' }}
        <CopyOutlined v-if="record.merchantCode" class="copyId"  @click="$copyId(record.merchantCode)" />
      </template>
      <template v-if="column.key === 'merchantMemberId'">
        {{ record.merchantMemberId || '-' }}
        <CopyOutlined v-if="record.merchantMemberId" class="copyId"  @click="$copyId(record.merchantMemberId)" />
      </template>
      <template v-if="column.key === 'operateBy'">
        {{ record.operateBy || '-' }}
      </template>
      <template v-if="column.key === 'unbindFlag'">
        {{ record.unbindFlag == 1 ? $t('n1860') : $t('n1861') }}
      </template>
      <template v-if="column.key === 'bindTime'">
        {{ record.bindTime || '-' }}
      </template>
      <template v-if="column.key === 'updateTime'">
        {{ record.updateTime || '-' }}
      </template>
      <template v-if="column.key === 'operateIp'">
        <a-tooltip v-if="record.operateIp">
          <template #title>{{ record.operateIp }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.operateIp }}</div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip v-if="record.remark">
          <template #title>{{ record.remark }}</template>
          <div class="toopTipStyle2">{{ record.remark }}</div>
        </a-tooltip>
        <div v-else>-</div>
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
import { ref, reactive, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { usePagination, today } from "@/plugins/dataMap";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { unBindingMerchantRecordAdminLog } from "@/api/menber";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const [startIndiaTime,endIndiaTime,time] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
// const { paginationConfig } = usePagination();
// const loading = ref(false);
const detailModel = ref(false);
const detailId = ref<any>({});
const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value = { id, memberId };
  detailModel.value = true;
};
const query = ref<any>({
  column: '',
  asc: false,
  pageNo: 1,
  pageSize: 20,
  createTimeStart: startIndiaTime,
  createTimeEnd: endIndiaTime,
  memberId: undefined,
  merchantCode: undefined,
  unbindFlag: undefined, // 操作来源：1 用户操作，0/null 系统操作
  bindTimeStart: undefined,
  bindTimeEnd: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
// 操作来源选项：1 用户操作，0 系统操作
const unbindFlagOptions = [
  { label: t('n1860'), value: 1 },
  { label: t('n1861'), value: 0 },
];
// const dataSource = ref([]);
const columns:any = [
    {
      title: t('c9'),
      dataIndex: "memberId",
      key: "memberId",
      align:"center",
      width: 180,
    },
    {
      title: t('n9'),
      dataIndex: "merchantCode",
      key: "merchantCode",
      align:"center",
      width: 160,
    },
    {
      title: t('m207'),
      dataIndex: "merchantMemberId",
      key: "merchantMemberId",
      align:"center",
      width: 180,
    },
    {
      title: t('m911'),
      dataIndex: "operateIp",
      key: "operateIp",
      align:"center",
      width: 200,
    },
    {
      title: t('l48'),
      dataIndex: "operateBy",
      key: "operateBy",
      align:"center",
      width: 140,
    },
    {
      title: t('n1859'),
      dataIndex: "unbindFlag",
      key: "unbindFlag",
      align:"center",
      width: 120,
    },
    {
      title: t('n216'),
      dataIndex: "bindTime",
      key: "bindTime",
      align:"center",
      width: 180,
    },
    {
      title: t('l67'),
      dataIndex: "updateTime",
      key: "updateTime",
      align:"center",
      width: 180,
    },
    {
      title: t('remark'),
      dataIndex: "remark",
      key: "remark",
      align:"center",
      width: 240,
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
  api: unBindingMerchantRecordAdminLog,
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
//   const res: any = await unBindingMerchantRecordAdminLog(query.value).finally(()=>loading.value=false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data || [];
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
//   const res: any = await unBindingMerchantRecordAdminLog(query.value);
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
// const reset = () => {
//   query.value = {
//     column: '',
//     asc: false,
//     pageNo: 1,
//     pageSize: 20,
//     createTimeStart: '',
//     createTimeEnd: '',
//     memberId: undefined,
//     merchantCode: undefined,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   paginationConfig.current = 1;
//   getList();
// };
// const getChange = (value: any,filters:any,sorter: any) => {
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
</style>
