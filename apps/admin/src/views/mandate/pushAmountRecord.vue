<template>
  <div class="search">
    <h2>{{ $t('n284') }}</h2>
    <a-row>
      <a-col >
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('n288')" :type="1"/>
      </a-col>
      <!-- <ArrowDownOutlined v-show="!isShowMoreSearch" @click="showMoreSearch" />
      <ArrowUpOutlined v-show="isShowMoreSearch" @click="showMoreSearch" /> -->
    <!-- </a-row>
    <a-row style="margin-top: 5px;"> -->
      <a-col>
        <!-- 搜索按钮 -->
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search()"
          >{{ $t("search") }}</a-button
        >
        <!-- 重置按钮 -->
        <a-button type="primary"  @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <!-- 打开筛选抽屉按钮 -->
        <!-- <a-button  @click="openDrawer">{{ $t("m741") }}</a-button> -->
      </a-col>
    </a-row>
    
  </div>
  <!-- 公共列筛选组件 -->
  <PublicColumnFilter
    v-model:open="drawerVisible"
    v-model:value="selectedColumns"
    :columns="columns"
    v-model:defaultColumns="defaultColumns"
    :title="$t('n36')"
    :menuId="menuId"
    v-if="drawerVisible"
  />
  <!-- 表格组件 -->
  <a-table
    :dataSource="dataSource"
    :columns="dynamicColumns"
    :key="tableKey"
    :pagination="pagination"
    :scroll="{ x: '100%' ,y:getTabH+'px'}"
    :loading="loading"
    @change="handleTableChange"
    :row-key="(record: any) => JSON.stringify(record)"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <!-- <template v-if="column.key === 'tenKAmount'">
        <a-tooltip v-if="record.tenKAmount">
          <template #title>{{ record.tenKAmount }}</template>
          <div class="toopTipStyle3">{{ record.tenKAmount }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template> -->
      <!-- <template v-if="column.key === 'thousandAmount'">
        <a-tooltip v-if="record.thousandAmount">
          <template #title>{{ record.thousandAmount }}</template>
          <div class="toopTipStyle3">{{ record.thousandAmount }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'hundredAmount'">
        <a-tooltip v-if="record.hundredAmount">
          <template #title>{{ record.hundredAmount }}</template>
          <div class="toopTipStyle3">{{ record.hundredAmount }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'actualPushAmount'">
        <a-tooltip v-if="record.actualPushAmount">
          <template #title>
            <div class="tableText">
              <div>{{ $t('n285') }}:
                {{ record.actualPushAmount.tenKAmount.join(", ") }}
              </div>
              <div>{{ $t('n286') }}:
                {{ record.actualPushAmount.thousandAmount.join(", ") }}
              </div>
              <div>{{ $t('n287') }}:
                {{ record.actualPushAmount.hundredAmount.join(", ") }}
              </div>
              <div>{{ $t('n221') }}:{{ record.actualPushAmount.minAmount }}</div>
              <div>{{ $t('n222') }}:{{ record.actualPushAmount.maxAmount }}</div>
            </div>
          </template>
          <div class="tableText">
            <div class="toopTipStyle">{{ $t('n285') }}:
              {{ record.actualPushAmount.tenKAmount.join(", ") }}
            </div>
            <div class="toopTipStyle">{{ $t('n286') }}:
              {{ record.actualPushAmount.thousandAmount.join(", ") }}
            </div>
            <div class="toopTipStyle">{{ $t('n287') }}:
              {{ record.actualPushAmount.hundredAmount.join(", ") }}
            </div>
            <div class="toopTipStyle">{{ $t('n221') }}:{{ record.actualPushAmount.minAmount }}</div>
            <div class="toopTipStyle">{{ $t('n222') }}:{{ record.actualPushAmount.maxAmount }}</div>
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template> -->
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, onUnmounted } from "vue";
import {  SearchOutlined, } from "@ant-design/icons-vue";
import {
  recommendedAmountRecordAdminListPage,
} from "@/api/order.api";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { matchingOrderAdminExport } from "@/api/export";
import { useTableColumnDrawer } from "@/hooks/index";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { payTypeData } from "@/utils/publicData";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import { thousand } from "@/utils";
import { getStartAndEndOfDay } from "@/plugins/dataMap";

const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
// 获取表格高度
const { getTabH } = useTabHeight();
// 国际化
const { t } = useI18n();
// 是否显示更多搜索条件
const isShowMoreSearch = ref(false);
// 显示更多搜索条件的函数
const showMoreSearch = () => {
  isShowMoreSearch.value = !isShowMoreSearch.value;
  setTimeout(() => {
    getTabH.value = useTabHeight(3).getTabH.value;
  },100)
}
// 数据源
// const dataSource = ref<any>([]);
// 加载状态
// const loading = ref(false);
// 查询条件
const query = ref({
  asc: false,
  column: "",
  pageNo: 1,
  pageSize: 20,
  startTime: startIndiaTime,
  endTime: endIndiaTime,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});

// 表格列配置
const columns:any = [
  {
    title: t("e47"),
    align: "center",
    key: "index",
    width: 40,
    customRender: ({ index }: any) => index + 1,
  },
  {
    title: t("n353"),
    dataIndex: "splitAmountList",
    key: "splitAmountList",
    align: "center",
    isRequired: true,
    width: 400,
  },
  {
    title: t("n352"),
    dataIndex: "pushCount",
    key: "pushCount",
    isRequired: true,
    align: "center",
    width: 200,
  },
  {
    title: t("n288"),
    dataIndex: "pushTime",
    key: "pushTime",
    isRequired: true,
    align: "center",
    // sorter: true,
    width: 200,
  },
  // {
  //   title: t("n288"),
  //   dataIndex: "createTime",
  //   key: "createTime",
  //   align: "center",
  //   width: 100,
  // },
  // {
  //   title: t("operation"),
  //   dataIndex: "operate",
  //   key: "operate",
  //   align: "center",
  //   width: 120,
  //   fixed: 'right',
  // },
];

// 使用表格列筛选抽屉
const {
  menuId,
  defaultColumns,
  selectedColumns,
  dynamicColumns,
  drawerVisible,
  openDrawer,
  tableKey,
} = useTableColumnDrawer(columns);

// 分页配置
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });

// const isChange = ref(false);
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
  api: recommendedAmountRecordAdminListPage,
  defaultPageSize: 20,
  filterRules: [],
  // afterFetch: (data) =>
  // data.map((item: any) => {
  //   item.amount = currency(item.amount, false);
  //   item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
  //   return item;
  // }),
});
// const extendData = ref<any>({});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// // 获取列表数据
// const getList = async () => {
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
//   dataSource.value = [];
//   const res: any = await recommendedAmountRecordAdminListPage(query.value).catch(() => {
//     loading.value = false;
//   });
//   if (res && res.code == "1") {
//     dataSource.value = res.data.map((item: any) => {
//       // item.tenKAmount = item.tenKAmount.slice(1, -1);
//       // item.thousandAmount = item.thousandAmount.slice(1, -1);
//       // item.hundredAmount = item.hundredAmount.slice(1, -1);
//       // item.actualPushAmount = item.actualPushAmount ? JSON.parse(item.actualPushAmount): item.actualPushAmount;
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
//     if (!isChange.value) {
//       pagination.value.current = query.value.pageNo;
//     }
//     isChange.value = false;
//     loading.value = false;
//   }
// };

// const getforData = async ()=>{
//   const res: any = await recommendedAmountRecordAdminListPage(query.value);
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
//   filterRules: [
//     // { key: "beforeChange" },
//     // { key: "amountChange" },  
//     // { key: "afterChange" },
//   ],
// });
// const columnVal = ref("");
// const sortVal = ref("");
// // 表格变化处理函数
// const handleTableChange: any = (value: any, filters: any, sorter: any) => {
//   const { current, pageSize } = value;
//   query.value.pageNo = current;
//   query.value.pageSize = pageSize;
//   const { columnKey, order } = sorter;
//   if (columnVal.value === columnKey) {
//     pagination.value.current = current;
//     pagination.value.pageSize = pageSize;
//     if (sortVal.value != order) {
//       pagination.value.current = 1;
//       query.value.pageNo = 1;
//     }
//   } else if(query.value.column == '' && order == undefined) {
//     query.value.pageNo = current;
//     pagination.value.current = current;
//     pagination.value.pageSize = pageSize;
//   }else{
//     pagination.value.current = 1;
//     query.value.pageNo = 1;
//   }
//   if (order == undefined) {
//     query.value.asc = "";
//     query.value.column = "";
//     columnVal.value = "";
//     sortVal.value = "";
//     isChange.value = false;
//   } else {
//     query.value.column = columnKey;
//     columnVal.value = columnKey;
//     sortVal.value = order;
//     query.value.asc = Boolean(order === "ascend");
//     isChange.value = true;
//   }
//   if(current != pagination.value.pageSize){
//     query.value.pageNo = 1;
//     pagination.value.current = 1;
//   }else{
//     query.value.pageNo = current;
//     pagination.value.current = current;
//   }
//   getList();
// };

// 导出列表数据
const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  console.log(data.status);
  data.status = data.status.join(",");
  console.log(data.status);
  matchingOrderAdminExport(data);
};

// 搜索函数
const search  = () => {
  // pagination.value.current = 1;
  // query.value.pageNo = 1;
  getList(1);
}

// 重置查询条件
// const resetQuery = () => {
//   query.value = {
//     asc: false,
//     column: "",
//     pageNo: 1,
//     pageSize: 20,
//     startTime: '',
//     endTime: '',
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

// 组件挂载时执行
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
.status {
  display: flex;
  margin-top: 10px;
  & > div {
    flex: none;
    &.order-text {
      padding-right: 10px;
    }
  }
}
:deep(.windActive){
  font-weight: 600;
  color: red;
}
.paidTip{
  margin-top: 6px;
  >div{
    font-size: 12px;
    color: red;
  }
}

</style>
