<template>
    <div class="search">
      <!-- <h2>{{ $t('m35') }}</h2> -->
      <a-row>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.merchantOrder"
            class="searchstyle"
            :placeholder="$t('m60')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.orderNo"
            class="searchstyle"
            :placeholder="$t('p61')"
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
          <a-input v-trim
            v-model:value="query.amountChangeStart"
            class="searchstyle"
            :placeholder="$t('m63')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.amountChangeEnd"
            class="searchstyle"
            :placeholder="$t('m64')"
          />
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
      <template v-if="column.key === 'merchantOrder'">
        <a-tooltip v-if="record.merchantOrder">
          <template #title>
            {{ record.merchantOrder }}
          </template>
          <div class="toopTipStyle">{{ record.merchantOrder }}</div>
        </a-tooltip>
        <span v-else>-</span>
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
      <template v-if="column.key ==='remark'">
        <a-tooltip v-if="record.remark">
          <template #title>
            {{ record.remark }}
          </template>
          <div class="toopTipStyle">{{ record.remark }}</div>
        </a-tooltip>
        <span v-else>{{ record.remark }}</span>
      </template>
      <template v-if="column.key ==='payType'">
        {{ record.payType ? $t($getMapItem(payTypeData,record.payType)) : '-' }}
      </template>
    </template>
    <template #summary>
      <a-table-summary fixed="bottom">
      <a-table-summary-row>
        <a-table-summary-cell :col-span="1" align="center"> {{ $t("m54") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="4" />
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
        <a-table-summary-cell :col-span="4" />
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
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h, computed } from "vue";
import {changeType} from "@/utils/publicData"
import { currency, thousand } from "@/utils";
import {
  getMemberAccountChangeList
} from "@/api/menber";
import { useI18n } from "vue-i18n";
import { payTypeData } from "@/utils/publicData";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
// const extendData:any = ref({});
const props = defineProps({
  id: {
    default: () => "",
  },
});
const columns:any = [
  {
    title: t('l96'),
    dataIndex: "merchantOrder",
    key: "merchantOrder",
    align: "center",
    width: 260,
  },
  {
    title: t('n47'),
    dataIndex: "orderNo",
    key: "orderNo",
    align: "center",
    width: 260,
  },
  {
    title: t('m67'),
    dataIndex: "changeType",
    key: "changeType",
    align: "center",
    width: 160,
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
    title: t('m68'),
    dataIndex: "beforeChange",
    key: "beforeChange",
    align: "center",
    width: 160,
  },
  {
    title: t('l98'),
    dataIndex: "amountChange",
    key: "amountChange",
    align: "center",
    width: 160,
  },
  {
    title: t('m69'),
    dataIndex: "afterChange",
    key: "afterChange",
    align: "center",
    width: 160,
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
    width: 160,
  },
  {
    title: t('remark'),
    dataIndex: "remark",
    key: "remark",
    align: "center",
    width: 260,
  },
];
// const selUserName= ref([]);
// const selNameChange = (value: string[]) => {
//   selUserName.value = value;
//   console.log(selUserName.value);
//   // query.value.merchantCodes = selUserName.value;
// }
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
  amountChangeEnd: undefined,
  amountChangeStart: undefined,
  changeType: undefined,
  payType: undefined,
  merchantOrder: '',
  createTimeEnd: "",
  createTimeStart: "",
  orderNo: "",
  pageNo: 1,
  pageSize: 20,
  remark: "",
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
// const remarkList = computed(() => {
//   return dataSource.value.filter((item: any) => item.remark);
// });
const {
  dataSource,
  extendData,
  pagination,
  loading,
  response,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  handleQueryFields: (q) => ({
    ...q,
    id: props.id,
  }),
  api: getMemberAccountChangeList,
  defaultPageSize: 20,
  filterRules: [
    // { key: "sourceType" },
    // { key: "wakeUpFlag", validValues: ["0", "1"] },
  ],
  afterFetch: (data) =>
    data.map((item: any) => {
      item.beforeChange = thousand(item.beforeChange);
      item.amountChange = thousand(item.amountChange);
      item.afterChange = thousand(item.afterChange);
      return item;
    }),
});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (isFirst: any = null) => {
//   if(isFirst){
//     query.value.pageNo = 1 ;
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
//   const res: any = await getMemberAccountChangeList(Object.assign(query.value,{id: props.id})).finally(()=>loading.value = false);
//   if (res) {
//     dataSource.value = res.data.map((item: any)=> {
//         item.beforeChange = thousand(item.beforeChange);
//         item.amountChange = thousand(item.amountChange);
//         item.afterChange = thousand(item.afterChange);
//         return item;
//     });
//     remarkList.value = res.data.filter((item: any) => item.remark);
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
//   const res: any = await getMemberAccountChangeList(Object.assign(query.value,{id: props.id}));
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
// const resetQuery = () => {
//   query.value={
//   asc: false,
//   amountChangeEnd: undefined,
//   amountChangeStart: undefined,
//   changeType: undefined,
//   payType: undefined,
//   merchantOrder: '',
//   createTimeEnd: "",
//   createTimeStart: "",
//   orderNo: "",
//   pageNo: 1,
//   pageSize: 20,
//   remark: "",
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
// getList();
// };
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
  getTabH.value = useTabHeight(1,-104).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
