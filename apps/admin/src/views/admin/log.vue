<template>
  <div class="search">
    <h2>{{ $t('m20') }}</h2>
    <a-row>
      <!-- <a-col :span="4">
        <a-date-picker
          class="searchstyle"
          v-model:value="query.startTime"
          :placeholder="$t('t4')"
          valueFormat="YYYY-MM-DD"
        />
      </a-col>
      <a-col :span="4">
        <a-date-picker
          class="searchstyle"
          v-model:value="query.endTime"
          :placeholder="$t('t5')"
          valueFormat="YYYY-MM-DD"
        />
      </a-col> -->
      <a-col>
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime"  :title="$t('l50')" :type="1"/>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.module"
          class="searchstyle"
          :placeholder="$t('l46')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.contentKeyStr"
          class="searchstyle"
          :placeholder="$t('operation') + $t('t6')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.updateBy"
          class="searchstyle"
          :placeholder="$t('l48')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.requestParamKeyStr"
          class="searchstyle"
          :placeholder="$t('m573') + $t('t6')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.keyStr"
          class="searchstyle"
          :placeholder="$t('l49') + $t('t6')"
        />
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          :loading="loading"
          >{{ $t('search') }}</a-button
        >
        <a-button type="primary" :loading="loading" @click="resetQuery">{{ $t('reset') }}</a-button>
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
    :row-key="(record:any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'ip'">
        <a-tooltip>
          <template #title>{{ record.ip }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.ip }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'module'">
        <a-tooltip>
          <template #title>{{ record.module }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.module }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'content'">
        <a-tooltip>
          <template #title>{{ record.content }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.content }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'requestParam'">
        <a-tooltip>
          <template #title>{{ record.requestParam }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.requestParam }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'path'">
        <a-tooltip>
          <template #title>{{ record.path }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.path }}</div>
        </a-tooltip>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { getSysLogListPage } from "@/api/log.api";
import { useI18n } from "vue-i18n";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
// const dataSource = ref([])
// const loading = ref(false)
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const query = ref({
  pageNo: 1,
  pageSize: 20,
  startTime: startIndiaTime,
  endTime: endIndiaTime,
  module: undefined,
  requestParamKeyStr: undefined,
  contentKeyStr: undefined,
  keyStr: undefined,
  updateBy: undefined,
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
    title: t('l45'),
    dataIndex: "ip",
    key: "ip",
    align:"center",
    width: 160,
  },
  {
    title: t('l46'),
    dataIndex: "module",
    key: "module",
    align:"center",
    width: 160,
  },
  {
    title: t('operation'),
    dataIndex: "content",
    key: "content",
    align:"center",
    width: 160,
  },
  {
    title: t('l47'),
    dataIndex: "method",
    key: "method",
    align:"center",
    width: 100,
  },
  {
    title: t('l48'),
    dataIndex: "createBy",
    key: "createBy",
    align:"center",
    width: 120,
  },
  // {
  //   title: t("state"),
  //   dataIndex: "status",
  //   key: "status",
  //   align:"center"
  // },
  {
    title:  t("m573"),
    dataIndex: "requestParam",
    key: "requestParam",
    align:"center",
    width: 300,
  },
  {
    title:  t("l49"),
    dataIndex: "path",
    key: "path",
    align:"center",
    width: 160,
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    align:"center",
    width: 160,
  },
];
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });

const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: getSysLogListPage,
  defaultPageSize: 20,
  filterRules: [],
});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async ( isFirst:any =null) => {
//   if(isFirst){
//     query.value.pageNo =1;
//     pagination.value.current = 1;
//   }
//   loading.value = true;
//   dataSource.value = [];
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
//   const res: any = await getSysLogListPage(query.value).finally(()=>loading.value = false);
//   if(res && res.code === '1') {
//     dataSource.value = res.data || [];
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
//   const res: any = await getSysLogListPage(query.value);
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
// const handleTableChange: any = (
//   pag: { pageSize: number; current: number },
// ) => {
//   if(pag.pageSize != pagination.value.pageSize){
//     query.value.pageNo = 1;
//     pagination.value.current = 1;
//   }else{
//     query.value.pageNo = pag.current;
//     pagination.value.current = pag.current;
//   }
//   query.value.pageSize = pag.pageSize;
//   pagination.value.pageSize = pag.pageSize;
//   getList()
// };
// const resetQuery = () => {
//   query.value = {
//     startTime: "",
//     endTime: "",
//     pageNo: 1,
//     pageSize: 20,
//     module: undefined,
//     requestParamKeyStr: undefined,
//     contentKeyStr: undefined,
//     keyStr: undefined,
//     updateBy: undefined,
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
//   getList()
// };
onMounted(() => {
  getList()
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
