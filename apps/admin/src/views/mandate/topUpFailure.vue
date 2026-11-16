<template>
  <div class="search">
    <h2>{{ $t('n500') }}</h2>
    <a-row>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.merchantName"
          :placeholder="$t('p26')"
          :allowClear="true"
        >
          <a-option
            v-for="item in merchantList"
            :key="item.code"
            :value="item.username"
            >{{ item.username }}</a-option
          >
        </a-select>
      </a-col>
      <a-col :span="3">
        <!-- 会员Id -->
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.merchantMemberId"
          min="0"
          :placeholder="$t('m562') +$t('m207')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.merchantOrderNo"
          min="0"
          :placeholder="$t('m562') +$t('l96')"
        />
      </a-col>
      <a-col :span="3">
        <!-- 渠道来源 -->
        <a-select
          class="searchstyle"
          v-model:value="query.sourceType"
          :options="Object.entries(sourceTypeMap).map(([key, value]:[any,any]) => ({
            label: value,
            value: key,
          }))"
          :placeholder="$t('m563') +$t('n2015')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.failureType"
          :options="Object.entries(failureTypeMap).map(([key, value]:[any,any]) => ({
            label: value,
            value: key,
          }))"
          :placeholder="$t('m563') +$t('n506')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime"  :title="$t('n502')" :type="1"/>
      </a-col>
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
        <ExportButton
          :query="query"
          :api="rechargeFailureForAdminExport"
          :enable-export-fields="true"
          permission="admin:rechargeFailureForAdmin:export"
        />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:rechargeFailureForAdmin:export'"
          >{{ $t("export") }}</a-button
        > -->
        <!-- 打开筛选抽屉按钮 -->
        <a-button  @click="openDrawer">{{ $t("m741") }}</a-button>
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
      <template v-if="column.key === 'merchantName'">
        <a-tooltip v-if="record.merchantName">
          <template #title>{{ record.merchantName }}</template>
          <div class="toopTipStyle">{{ record.merchantName }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'merchantOrderNo'">
        <a-tooltip v-if="record.merchantOrderNo">
          <template #title>
            {{ record.merchantOrderNo }}
            <CopyOutlined v-if="record.merchantOrderNo" class="copyId"  @click="$copyId(record.merchantOrderNo)" />
          </template>
          <div class="toopTipStyle">
            {{ record.merchantOrderNo }}
            <CopyOutlined v-if="record.merchantOrderNo" class="copyId"  @click="$copyId(record.merchantOrderNo)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'failureAmount'">
        {{ currency(record.failureAmount,false) || "-" }}
      </template>
      <template v-if="column.key === 'sourceType'">
        <a-tooltip>
          <template #title>
            {{ $getMapItem(sourceTypeMap,record.sourceType) }}
          </template>
          <div class="toopTipStyle">
            {{ $getMapItem(sourceTypeMap,record.sourceType) }}
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || "-" }}
      </template>
      <template v-if="column.key === 'merchantMemberId'">
        <!-- <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record)"
          >{{ record.merchantMemberId }}</a-button
        > -->
        <a-tooltip v-if="record.merchantMemberId">
          <template #title>
            {{ record.merchantMemberId }}
            <CopyOutlined v-if="record.merchantMemberId" class="copyId"  @click="$copyId(record.merchantMemberId)" />
          </template>
          <div class="toopTipStyle">
            {{ record.merchantMemberId }}
            <CopyOutlined v-if="record.merchantMemberId" class="copyId"  @click="$copyId(record.merchantMemberId)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'recommendedAmounts'">
        <a-tooltip v-if="record.recommendedAmounts">
          <template #title>{{ record.recommendedAmounts }}</template>
          <div class="toopTipStyle">{{ record.recommendedAmounts }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'failureType'">
        {{ failureTypeMap[record.failureType] }}
      </template>
      <template v-if="column.key === 'requestIp'">
        <a-tooltip v-if="record.requestIp">
          <template #title>{{ record.requestIp }}</template>
          <div class="toopTipStyle">{{ record.requestIp }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'errorMessage'">
        <a-tooltip v-if="record.errorMessage">
          <template #title>{{ record.errorMessage }}</template>
          <div class="toopTipStyle">{{ record.errorMessage }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <!-- <template v-if="column.key === 'operate'">
        <a-tag
          v-if="!['3'].includes(record.status)"
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="checkDetail(record)"
          v-permission="'admin:matchingOrderAdmin:getInfo'"
          >{{ record.showMessage ? $t("m479") : $t('b23') }}
        </a-tag>
      </template> -->
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
      :id="detailId.id"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, onUnmounted, computed } from "vue";
import {  SearchOutlined, } from "@ant-design/icons-vue";
import {
  rechargeFailureForAdminListPage,
} from "@/api/order.api";
// import {
//   getMerchantInfoAdminList,
// } from "@/api/merchant.api";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { rechargeFailureForAdminExport } from "@/api/export";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTableColumnDrawer } from "@/hooks/index";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { payTypeData } from "@/utils/publicData";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { currency } from "@/utils";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import { useMerchantStore } from "@/stores/useMerchantStore";
const merchantList = computed(() => useMerchantStore().merchantList);

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

// const merchantList = ref<any>([]);
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
  merchantName: undefined,
  merchantMemberId: undefined,
  failureType: undefined,
  sourceType: undefined,
  merchantOrderNo: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const sourceTypeMap: any = {
  1: t('n2016'),//内部商户UPI充值
  2: t('n2017')//外部商户UPI充值
}
const detailModel = ref(false);
const detailId = ref<any>({});
const showDetail = async (value: any) => {
  const { id, merchantMemberId } = value;
  detailId.value = { id: merchantMemberId, memberId:merchantMemberId };
  detailModel.value = true;
};
// 表格列配置
const columns:any = [
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("e47")),
    align: "center",
    key: "index",
    width: 60,
    customRender: ({ index }: any) => index + 1,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("l92")),
    dataIndex: "merchantName",
    key: "merchantName",
    isRequired: true,
    align: "center",
    width: 120,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("m207")),
    dataIndex: "merchantMemberId",
    key: "merchantMemberId",
    isRequired: true,
    align: "center",
    width: 120,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("l96")),
    dataIndex: "merchantOrderNo",
    key: "merchantOrderNo",
    isRequired: true,
    align: "center",
    width: 220,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n501")),
    dataIndex: "failureAmount",
    key: "failureAmount",
    isRequired: true,
    align: "center",
    sorter: true,
    width: 120,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n2015")),
    dataIndex: "sourceType",
    key: "sourceType",
    align: "center",
    width: 140,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n502")),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 140,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n503")),
    dataIndex: "pendingOrderCount",
    key: "pendingOrderCount",
    align: "center",
    width: 140,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n504")),
    dataIndex: "recommendedAmounts",
    key: "recommendedAmounts",
    align: "center",
    width: 280,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n506")),
    dataIndex: "failureType",
    key: "failureType",
    align: "center",
    isRequired: true,
    width: 120,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n507")),
    dataIndex: "requestIp",
    key: "requestIp",
    align: "center",
    width: 120,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n508")),
    dataIndex: "errorMessage",
    key: "errorMessage",
    align: "center",
    width: 160,
  },
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
const failureTypeMap: any = {
  1: t("n511"),//充值异常
  2: t("n510"),//撮合失败
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
  api: rechargeFailureForAdminListPage,
  defaultPageSize: 20,
  filterRules: [],
  afterFetch: (data) =>
  data.map((item: any) => {
    item.failureType = item.failureType ? item.failureType : 2;
    return item;
  }),
});
// const isChange = ref(false);
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
//   const res: any = await rechargeFailureForAdminListPage(query.value).finally(()=>{loading.value = false;});
//   if (res && res.code == "1") {
//     dataSource.value = res.data.map((item: any) => {
//       item.failureType = item.failureType ? item.failureType : 2;
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
//     // if (!isChange.value) {
//     //   pagination.value.current = query.value.pageNo;
//     // }
//     // isChange.value = false;
//   }
// };

// const getforData = async ()=>{
//   const res: any = await rechargeFailureForAdminListPage(query.value);
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
//   getList();
// };

// 导出列表数据
const exportList = async () => {
  loading.value = true;
  const res: any = await rechargeFailureForAdminExport(query.value).finally(() => {
    loading.value = false;
  });
  if (res && res.code == '1'){
    message.success(t("n545"));
  }
};

// 搜索函数
const search  = () => {
  // pagination.value.current = 1;
  query.value.pageNo = 1;
  getList(1);
}

// 重置查询条件
// const resetQuery = () => {
//   query.value = {
//     pageNo: 1,
//     pageSize: 20,
//     asc: false,
//     column: "",
//     startTime: '',
//     endTime: '',
//     merchantName: undefined,
//     merchantMemberId: undefined,
//     failureType: undefined,
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

// const getMerchantList = async () => {
//   const res: any = await getMerchantInfoAdminList({ pageNo: 1, pageSize: 1000 });
//   if (res && res.code == "1") {
//     merchantList.value = res.data.map(({ username, code }: { username: string; code: string }) => ({
//       value: username,
//       label: username,
//     }));
//   }
// };
// 组件挂载时执行
onMounted(() => {
  // getMerchantList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>

</style>
