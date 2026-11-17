<template>
  <div class="search">
    <h2>{{ $t('n224') }}</h2>
    <a-row>
      <a-col :span="3">
        <!-- 会员Id -->
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.memberId"
          min="0"
          :placeholder="$t('m562') +$t('m150')"
        />
      </a-col>
      <a-col :span="3">
        <!-- 订单号 -->
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.platformOrder"
          min="0"
          :placeholder="$t('m562') +$t('l90')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.sellOrderType"
          :placeholder="$t('n582')"
          :allowClear="true"
          :options="
            Object.entries(sellOrderTypeMap)
            .filter(([key, _]) => key != '0')
            .map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n626')"
          v-model:value="query.sourceOrderType"
          :options="Object.entries(orderSourceMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: $t(value),
          }))"
        >
        </a-select>
      </a-col>
      <a-col :span="6">
        <a-input-group compact>
          <a-input-number
            v-model:value="query.minimumAmount"
            style="width:48%"
            min="0"
            :placeholder="$t('n225')"
          />
          <span style="padding: 3px;">-</span>
          <a-input-number
            v-model:value="query.maximumAmount"
            :min="query.minimumAmount || 0"
            style="width:48%"
            :placeholder="$t('n226')"
          />
        </a-input-group>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime"  :title="$t('l50')" :type="1"/>
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
      <template v-if="column.key === 'splitAmountList'">
        <a-tooltip v-if="record.splitAmountList">
          <template #title>{{ record.splitAmountList }}</template>
          <div class="toopTipStyle3">{{ record.splitAmountList }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'sellOrderType'">
        {{ $t($getMapItem(sellOrderTypeMap,record.sellOrderType)) || '-' }}
      </template>
      <template v-if="column.key === 'splitTimes'">
        {{ record.splitTimes != null && record.splitTimes >= 0 ? record.splitTimes : "-" }}
      </template>
      <template v-if="column.key === 'createTime'">
        <!-- 创建时间列 -->
        {{ record.createTime || "-" }}
        </template>
      <template v-if="column.key === 'memberId'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record)"
          >{{ record.memberId }}</a-button
        >
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'platformOrder'">
        <!-- 平台订单列 -->
        <a-tooltip v-if="record.platformOrder">
          <template #title>{{ record.platformOrder }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.platformOrder }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'sourceOrderType'">
        <span v-if="record.sourceOrderType === 0 || record.sourceOrderType">{{ $t($getMapItem(orderSourceMap,record.sourceOrderType)) }}</span>
        <span v-else>{{ $t('n623') }}</span>
      </template>
      <template v-if="column.key === 'isKycOrder'">
        <!-- KYC订单列 -->
        {{ record.isKycOrder == 1 ? $t("yes") : $t("no") }}
      </template>
      <template v-if="column.key ==='payType'">
        <!-- 支付类型列 -->
        {{record.payType? $t(payTypeData[record.payType]):'-' }}
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
import { onMounted, ref, h, onUnmounted } from "vue";
import {  SearchOutlined, } from "@ant-design/icons-vue";
import {
  matchOrderPoolAdminListPage,
} from "@/api/order.api";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { matchingOrderAdminExport } from "@/api/export";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTableColumnDrawer } from "@/hooks/index";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { payTypeData, sellOrderTypeMap, orderSourceMap } from "@/utils/publicData";
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
  memberId: undefined,
  platformOrder: undefined,
  minimumAmount: undefined,
  maximumAmount: undefined,
  sellOrderType: undefined,
  sourceOrderType: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});

const detailModel = ref(false);
const detailId = ref<any>({});
const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value = { id: memberId, memberId:memberId };
  detailModel.value = true;
};
// 表格列配置
const columns:any = [
  {
    title: t("e47"),
    align: "center",
    key: "index",
    width: 110,
    customRender: ({ index }: any) => index + 1,
    filteredValue: [],
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    isRequired: true,
    sorter: true,
    align: "center",
    width: 150,
    filteredValue: [],
  },
  {
    title: t("m150"),
    dataIndex: "memberId",
    key: "memberId",
    isRequired: true,
    align: "center",
    width: 180,
    filteredValue: [],
  },
  {
    title: t("l90"),
    dataIndex: "platformOrder",
    key: "platformOrder",
    isRequired: true,
    align: "center",
    width: 220,
    filteredValue: [],
  },
  {
    title: t("n626"),
    dataIndex: "sourceOrderType",
    key: "sourceOrderType",
    align: "center",
    filteredValue: [],
    width: 180,
  },
  {
    title: t("n582"),
    dataIndex: "sellOrderType",
    key: "sellOrderType",
    isRequired: true,
    align: "center",
    width: 220,
    filteredValue: [],
  },
  {
    title: t("n354"),
    dataIndex: "splitTimes",
    key: "splitTimes",
    isRequired: true,
    align: "center",
    width: 140,
    filteredValue: [],
  },
  // {
  //   title: t("n355"),
  //   dataIndex: "maxSplitTimes",
  //   key: "maxSplitTimes",
  //   isRequired: true,
  //   align: "center",
  //   width: 140,
  // },
  {
    title: t("n356"),
    dataIndex: "splitAmountList",
    key: "splitAmountList",
    isRequired: true,
    align: "center",
    width: 240,
    filteredValue: [],
  },
  {
    title: t("m143"),
    dataIndex: "amount",
    key: "amount",
    isRequired: true,
    align: "center",
    sorter: true,
    width: 180,
    filteredValue: [],
  },
  // {
  //   title: t("n221"),
  //   dataIndex: "minimumAmount",
  //   key: "minimumAmount",
  //   align: "center",
  //   sorter: true,
  //   width: 140,
  // },
  {
    title: t("n63"),
    dataIndex: "maximumAmount",
    key: "maximumAmount",
    align: "center",
    sorter: true,
    width: 140,
    filteredValue: [],
  },
  // {
  //   title: t("m607"),
  //   dataIndex: "isKycOrder",
  //   key: "isKycOrder",
  //   align: "center",
  //   width: 140,
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
//   showSizeChanger: false,
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
  api: matchOrderPoolAdminListPage,
  defaultPageSize: 20,
  filterRules: [],
  notShowChangeSize: true,
  // afterFetch: (data) =>
  // data.map((item: any) => {
  //   item.amount = currency(item.amount, false);
  //   item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
  //   return item;
  // }),
});

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
  getList(1);
}

// 组件挂载时执行
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
