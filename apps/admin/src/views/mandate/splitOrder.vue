<template>
  <div class="search">
    <h2>{{ $t('n610') }}</h2>
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
        <!-- 会员类型 -->
        <a-select
          v-model:value="query.memberType"
          class="searchstyle"
          :placeholder="$t('memberListC10')"
          allowClear
          style="width: 100%;"
          :options="Object.entries(memberTypeList).map(([key, value]) => ({ label: $t(value), value: key }))"
        >
        </a-select>
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
      <a-col :span="6">
        <a-input-group compact>
          <a-input-number
            v-model:value="query.remainingAmountGe"
            style="width:48%"
            min="0"
            :placeholder="$t('n225')"
          />
          <span style="padding: 3px;">-</span>
          <a-input-number
            v-model:value="query.remainingAmountLe"
            :min="query.remainingAmountGe || 0"
            style="width:48%"
            :placeholder="$t('n226')"
          />
        </a-input-group>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.createTimeGe" v-model:endTime="query.createTimeLe"  :title="$t('l50')" :type="1"/>
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
        <a-tooltip v-if="record.platformOrder">
          <template #title>{{ record.platformOrder }}</template>
          <div class="toopTipStyle">
            {{ record.platformOrder }}
            <CopyOutlined class="copyId" v-if="record.platformOrder" @click="$copyId(record.platformOrder)" />
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
import {  CopyOutlined, SearchOutlined, } from "@ant-design/icons-vue";
import {
  maxBenefitOrderAdminListPage,
} from "@/api/order.api";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { matchingOrderAdminExport } from "@/api/export";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTableColumnDrawer } from "@/hooks/index";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { payTypeData } from "@/utils/publicData";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { thousand } from "@/utils";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import { memberTypeList } from "@/utils/publicData";

const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()

// 获取表格高度
const { getTabH } = useTabHeight();
// 国际化
const { t } = useI18n();
// 数据源
const dataSource = ref<any>([]);
// 加载状态
const loading = ref(false);
// 查询条件
const query = ref({
  asc: true,
  column: "",
  pageNo: 1,
  pageSize: 20,
  createTimeGe: startIndiaTime,
  createTimeLe: endIndiaTime,
  memberId: undefined,
  platformOrder: undefined,
  remainingAmountGe: undefined,
  remainingAmountLe: undefined,
  memberType: undefined,
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
    title: () => h("div", {class:"toopTipStyle2"}, t("e47")),
    align: "center",
    dataIndex: "index",
    key: "index",
    width: 80,
    customRender: ({ index }: any) => index + 1,
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    isRequired: true,
    sorter: true,
    align: "center",
    width: 140,
  },
  {
    title: t("m150"),
    dataIndex: "memberId",
    key: "memberId",
    isRequired: true,
    align: "center",
    width: 180,
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
    title: t("l90"),
    dataIndex: "platformOrder",
    key: "platformOrder",
    align: "center",
    width: 200,
  },
  {
    title: t("n612")+ 'A',
    dataIndex: "rangeASplitTimes",
    key: "rangeASplitTimes",
    align: "center",
    width: 120,
    customRender: ({ record }: any) => {
      return h("span", { class: "" }, thousand(record.rangeASplitTimes));
    },
  },
  {
    title: t("n612")+ 'B',
    dataIndex: "rangeBSplitTimes",
    key: "rangeBSplitTimes",
    align: "center",
    width: 120,
    customRender: ({ record }: any) => {
      return h("span", { class: "" }, thousand(record.rangeBSplitTimes));
    },
  },
  {
    title: t("n612")+ 'C',
    dataIndex: "rangeCSplitTimes",
    key: "rangeCSplitTimes",
    align: "center",
    width: 120,
    customRender: ({ record }: any) => {
      return h("span", { class: "" }, thousand(record.rangeCSplitTimes));
    },
  },
  {
    title: t("n612")+ 'D',
    dataIndex: "rangeDSplitTimes",
    key: "rangeDSplitTimes",
    align: "center",
    width: 120,
    customRender: ({ record }: any) => {
      return h("span", { class: "" }, thousand(record.rangeDSplitTimes));
    },
  },
  {
    title: t("n612")+ 'E',
    dataIndex: "rangeESplitTimes",
    key: "rangeESplitTimes",
    align: "center",
    width: 120,
    customRender: ({ record }: any) => {
      return h("span", { class: "" }, thousand(record.rangeESplitTimes));
    },
  },
  {
    title: t("n354"),
    dataIndex: "alreadySplitTimes",
    key: "alreadySplitTimes",
    sorter: true,
    align: "center",
    width: 100,
  },
  {
    title: t("m143"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    sorter: true,
    width: 120,
    customRender: ({ record }: any) => {
      return h("span", { class: "" }, thousand(record.amount));
    },
  },
  {
    title: t("n63"),
    dataIndex: "maximumAmount",
    key: "maximumAmount",
    align: "center",
    sorter: true,
    width: 120,
    customRender: ({ record }: any) => {
      return h("span", { class: "" }, thousand(record.maximumAmount));
    },
  },
  // {
  //   title: t("n221"),
  //   dataIndex: "minimumAmount",
  //   key: "minimumAmount",
  //   align: "center",
  //   sorter: true,
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
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});

const isChange = ref(false);
// 获取列表数据
const getList = async () => {
  loading.value = true;
  const res: any = await maxBenefitOrderAdminListPage(query.value).finally(()=>{loading.value = false;});
  if (res && res.code == "1") {
    dataSource.value = res.data;
    pagination.value.total = res.total;
    pagination.value.current = query.value.pageNo;
    pagination.value.pageSize = query.value.pageSize;
    if (!isChange.value) {
      pagination.value.current = query.value.pageNo;
    }
    isChange.value = false;
  }
};

const { handleTableChange } = useTableChange({
  query,
  pagination,
  getList,
  filterRules: [],
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
  pagination.value.current = 1;
  query.value.pageNo = 1;
  getList();
}

// 重置查询条件
const resetQuery = () => {
  query.value = {
    pageNo: 1,
    pageSize: 20,
    asc: true,
    column: "",
    createTimeGe: '',
    createTimeLe: '',
    memberId: undefined,
    platformOrder: undefined,
    remainingAmountGe: undefined,
    remainingAmountLe: undefined,
    memberType: undefined,
  };
  pagination.value.current = 1;
  pagination.value.pageSize = 20;
  getList();
};

// 组件挂载时执行
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
