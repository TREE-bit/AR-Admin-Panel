<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.userId"
          :placeholder="$t('m181')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.type"
          :placeholder="$t('m182')"
          :allowClear="true"
        >
          <a-select-option
            v-for="(item, key) in transformedArray"
            :value="item.value"
            :key="key"
            >{{ $t(item.label as any) }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberAccount"
          class="searchstyle"
          :placeholder="$t('p5')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.loginIp"
          class="searchstyle"
          :placeholder="$t('m183')"
        />
      </a-col>
      <!-- <a-col :span="6">
        <a-range-picker
          show-time
          class="searchstyle"
          v-model:value="searchDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m188')]"
        />
      </a-col> -->
      <a-col >
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('m188')" :type="1"/>
      </a-col>
      <a-col>
        <a-button type="primary" :loading="loading" :icon="h(SearchOutlined)" @click="getList(1)">{{
          $t("search")
        }}</a-button>
        <a-button type="primary" :loading="loading" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'authenticationMode'">
        {{ record.authenticationMode ? $t(typeMap[record.authenticationMode]) : '-' }}
      </template>
      <template v-if="column.key === 'memberType'">
        {{ record.memberType ? memberTypeMap[record.memberType] : '-' }}
      </template>
      <template v-if="column.key === 'loginStatus'">
        {{ record.loginStatus === '1' ? t("s25") : t("f1") }}
      </template>
      <template v-if="column.key === 'ipAddress'">
        <a-tooltip v-if="record.ipAddress">
          <template #title>{{ record.ipAddress }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.ipAddress }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'loginTime'">
        {{ record.loginTime || '-' }}
      </template>
      <template v-if="column.key === 'device'">
        {{ record.device || '-' }}
      </template>
      <template v-if="column.key === 'username'">
        <a-tooltip>
          <template #title>{{ record.username }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.username }}</div>
        </a-tooltip>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { getLoginLog } from "@/api/menber";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
// const dataSource = ref([]);
// const loading = ref(false);
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const query = ref<any>({
  asc: false,
  endTime: endIndiaTime,
  loginIp: "",
  startTime: startIndiaTime,
  memberAccount: "",
  userId: "",
  type: undefined,
  pageNo: 1,
  pageSize: 50,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const typeMap:any = {
  1: t('t38'),
  2: t('t44'),
};
const transformedArray = Object.entries(typeMap).map(([value, label]) => ({
  value,
  label,
}));
const memberTypeMap:any = {
  1: t('t65'),
  2: t('n95'),
  3: t('n96'),
  4: t('m842'),
}
const columns: any = [
  {
    title: t("m184"),
    align: "center",
    dataIndex: "memberId",
    key: "memberId",
  },
  {
    title: t("c10"),
    dataIndex: "username",
    key: "username",
    align: "center",
    width: 180,
  },
  {
    title: t("memberListC10"),
    dataIndex: "memberType",
    key: "memberType",
    align: "center",
  },
  {
    title: t("m185"),
    dataIndex: "authenticationMode",
    key: "authenticationMode",
    align: "center",
  },
  {
    title: t("m186"),
    dataIndex: "loginStatus",
    key: "loginStatus",
    align: "center",
  },
  {
    title: t("m187"),
    dataIndex: "ipAddress",
    key: "ipAddress",
    align: "center",
  },
  {
    title: t("m188"),
    dataIndex: "loginTime",
    key: "loginTime",
    align: "center",
  },
  {
    title: t("m189"),
    dataIndex: "device",
    key: "device",
    align: "center",
  },
];
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 50,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const searchDate:any = computed({
  get: () => {
    return [query.value.startTime, query.value.endTime];
  },
  set: (val) => {
    query.value.startTime = val ? val[0] : "";
    query.value.endTime = val ? val[1] : "";
  },
});
const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: getLoginLog,
  defaultPageSize: 50,
  filterRules: [],
});
// const extendData = ref<any>({});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (isFirst:any = null) => {
//   if(isFirst){
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
//   const res: any = await getLoginLog(query.value).finally(()=>loading.value = false);
//   if (res && res.code === "1") {
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
//   const res: any = await getLoginLog(query.value);
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
// const resetQuery = () => {
//   query.value = {
//     asc: false,
//     endTime: "",
//     loginIp: "",
//     startTime: "",
//     memberAccount: "",
//     userId: "",
//     type: undefined,
//     pageNo: 1,
//     pageSize: 50,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   pagination.value.current = 1;
//   pagination.value.pageSize = 50;
//   getList();
// };
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.ant-picker-range-separator) {
  display: none;
}
</style>
