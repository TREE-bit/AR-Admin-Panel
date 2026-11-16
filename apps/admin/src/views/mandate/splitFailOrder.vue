<template>
  <div class="search">
    <h2>{{ $t('n611') }}</h2>
    <a-row>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.merchantCode"
          :options="merchantList"
          :placeholder="$t('c23')"
          :allowClear="true"
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
        <!-- 会员类型 -->
        <a-select
          v-model:value="query.memberType"
          class="searchstyle"
          :placeholder="$t('memberListC10')"
          allowClear
          style="width: 100%;"
          :options="Object.entries(memberTypeList).map(([key, value]:[any,any]) => ({ label: $t(value), value: key }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <!-- 订单号 -->
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.merchantOrderNo"
          min="0"
          :placeholder="$t('m562') +$t('l96')"
        />
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.createTimeGe" v-model:endTime="query.createTimeLe"  :title="$t('n502')" :type="1"/>
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
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || "-" }}
        </template>
      <template v-if="column.key === 'merchantName'">
        <a-tooltip v-if="record.merchantName">
          <template #title>{{ record.merchantName }}</template>
          <div class="toopTipStyle">
            {{ record.merchantName }}
            <CopyOutlined class="copyId" v-if="record.merchantName" @click="$copyId(record.merchantName)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key ==='memberType'">
        <span v-if="record.memberType">
          {{ $t($getMapItem(memberTypeList,record.memberType)) }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'merchantMemberId'">
        <a-tooltip v-if="record.merchantMemberId">
          <template #title>{{ record.merchantMemberId }}</template>
          <div class="toopTipStyle">
            {{ record.merchantMemberId }}
            <CopyOutlined class="copyId" v-if="record.merchantMemberId" @click="$copyId(record.merchantMemberId)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'merchantOrderNo'">
        <a-tooltip v-if="record.merchantOrderNo">
          <template #title>{{ record.merchantOrderNo }}</template>
          <div class="toopTipStyle">
            {{ record.merchantOrderNo }}
            <CopyOutlined class="copyId" v-if="record.merchantOrderNo" @click="$copyId(record.merchantOrderNo)" />
          </div>
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
  <!-- <a-modal
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
  </a-modal> -->
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import {  CopyOutlined, SearchOutlined, } from "@ant-design/icons-vue";
import {
  maxBenefitOrderAdminFailedListPage,
} from "@/api/order.api";
import {
  getMerchantInfoAdminList,
} from "@/api/merchant.api";
import { useI18n } from "vue-i18n";
// import { matchingOrderAdminExport } from "@/api/export";
// import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTableColumnDrawer } from "@/hooks/index";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { thousand } from "@/utils";
import { memberTypeList } from "@/utils/publicData";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTableChange } from "@/hooks/useTableChange.hooks";

const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()

// 获取表格高度
const { getTabH } = useTabHeight();
// 国际化
const { t } = useI18n();
// 数据源
// const dataSource = ref<any>([]);
const merchantList = ref<any>([]);
// 加载状态
// const loading = ref(false);
// 查询条件
const query = ref({
  asc: false,
  pageNo: 1,
  pageSize: 20,
  createTimeGe: startIndiaTime,
  createTimeLe: endIndiaTime,
  merchantCode: undefined,
  merchantMemberId: undefined,
  merchantOrderNo: undefined,
  memberType: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});

// const detailModel = ref(false);
// const detailId = ref<any>({});
// const showDetail = async (value: any) => {
//   const { id, memberId } = value;
//   detailId.value = { id: memberId, memberId:memberId };
//   detailModel.value = true;
// };
// 表格列配置
const columns:any = [
  {
    title: () => h("div", {class:"toopTipStyle2"}, t("e47")),
    align: "center",
    dataIndex: "index",
    key: "index",
    width: 80,
    customRender: ({ index }: any) => index + 1,
  },
  {
    title: t("l92"),
    dataIndex: "merchantName",
    key: "merchantName",
    isRequired: true,
    align: "center",
    width: 120,
  },
  {
    title: t("m207"),
    dataIndex: "merchantMemberId",
    key: "merchantMemberId",
    isRequired: true,
    align: "center",
    width: 120,
  },
  {
    title: t("memberListC10"),
    dataIndex: "memberType",
    key: "memberType",
    isRequired: true,
    align: "center",
    width: 120,
  },
  {
    title: t("l96"),
    dataIndex: "merchantOrderNo",
    key: "merchantOrderNo",
    isRequired: true,
    align: "center",
    width: 220,
  },
  {
    title: t("n501"),
    dataIndex: "orderAmount",
    key: "orderAmount",
    align: "center",
    width: 120,
    customRender: ({ record }: any) => {
      return h("span", { class: "" }, thousand(record.orderAmount));
    },
  },
  {
    title: t("n502"),
    dataIndex: "createTime",
    key: "createTime",
    // sorter: true,
    align: "center",
    width: 140,
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n613")),
    dataIndex: "orderCountOfRange",
    key: "orderCountOfRange",
    align: "center",
    // sorter: true,
    width: 120,
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n614")),
    dataIndex: "orderCountOfAll",
    key: "orderCountOfAll",
    align: "center",
    // sorter: true,
    width: 120,
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
  api: maxBenefitOrderAdminFailedListPage,
  defaultPageSize: 20,
  filterRules: [],
  // afterFetch: (data) =>
  // data.map((item: any) => {
  //   item.amount = currency(item.amount, false);
  //   item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
  //   return item;
  // }),
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
//   const res: any = await maxBenefitOrderAdminFailedListPage(query.value).finally(()=>{loading.value = false;});
//   if (res && res.code == "1") {
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
//     if (!isChange.value) {
//       pagination.value.current = query.value.pageNo;
//     }
//     isChange.value = false;
//   }
// };

// const getforData = async ()=>{
//   const res: any = await maxBenefitOrderAdminFailedListPage(query.value);
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
// // const { handleTableChange } = useTableChange({
// //   query,
// //   pagination,
// //   getList,
// //   filterRules: [],
// // });
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
// 导出列表数据
// const exportList = async () => {
//   const data = JSON.parse(JSON.stringify(query.value));
//   console.log(data.status);
//   data.status = data.status.join(",");
//   console.log(data.status);
//   matchingOrderAdminExport(data);
// };

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
//     pageNo: 1,
//     pageSize: 20,
//     createTimeGe: '',
//     createTimeLe: '',
//     merchantCode: undefined,
//     merchantMemberId: undefined,
//     merchantOrderNo: undefined,
//     memberType: undefined,
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

const getMerchantList = async () => {
  const res:any = await getMerchantInfoAdminList({ pageNo: 1, pageSize: 1000 });
  if (res && res.code === "1") {
    merchantList.value = res.data.map(({ code,username }:{code:string,username:string}) => ({
      value: code,
      label: username,
    }));
  }
};
// 组件挂载时执行
onMounted(() => {
  getList();
  getMerchantList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
