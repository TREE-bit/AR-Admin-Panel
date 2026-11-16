<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          allow-clear
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('c9')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          v-model:value="query.memberType"
          class="searchstyle"
          :placeholder="$t('memberListC10')"
          :options="Object.entries(memberTypeList).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
        ></a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          allow-clear
          v-model:value="query.phoneNumber"
          class="searchstyle"
          :placeholder="$t('m591')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          allow-clear
          v-model:value="query.upiId"
          class="searchstyle"
          :placeholder="'UPI ID'"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.bankCode"
          :options="groupList"
          :placeholder="$t('m582')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.openedAtStart" v-model:endTime="query.openedAtEnd" :title="$t('n2000')" :type="1"/>
      </a-col>
      <a-col>
        <a-button type="primary" :icon="h(SearchOutlined)" @click="getList(1)">{{
          $t("search")
        }}</a-button>
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <ExportButton
          :query="query"
          :api="systemAutoSellLogAdminExport"
          permission="admin:systemAutoSellLogAdmin:export"
        />
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%', y: getTabH + 'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        <a-button v-if="record.memberId" type="link" class="copyContent" @click="showMember(record.memberId)">{{
          record.memberId
        }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId" @click="$copyId(record.memberId)" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'memberType'">
        {{ record.memberType ? $t($getMapItem(memberTypeList, record.memberType)) : '-' }}
      </template>
      <template v-if="column.key === 'phoneNumber'">
        {{ record.phoneNumber || '-' }}
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip v-if="record.upiId">
          <template #title>{{ record.upiId }}</template>
          <div class="toopTipStyle">{{ record.upiId }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'bankCode'">
        {{ record.bankCode || '-' }}
      </template>
      <!-- 关闭时间未关闭时后端返回 null；column.key 类型含 undefined，转成字符串再取值 -->
      <template v-if="['appCreateTime', 'openedAt', 'closedAt'].includes(String(column.key))">
        {{ record[String(column.key)] || '-' }}
      </template>
      <!-- 金额字段后端返回保留两位小数的字符串 -->
      <template v-if="['openBalance', 'createdOrderAmount', 'succeededOrderAmount'].includes(String(column.key))">
        {{ record[String(column.key)] != null ? currency(record[String(column.key)], false) : '-' }}
      </template>
      <template v-if="column.key === 'createdOrderCount'">
        {{ record.createdOrderCount ?? '-' }}
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="detailModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
  >
    <memberDetail
      v-if="detailModel"
      :memberID="detailId.memberId"
      :id="detailId.id"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h } from "vue";
import { memberTypeList } from "@/utils/publicData";
import {
  systemAutoSellLogAdminListPage,
  systemAutoSellLogAdminExport,
  getKycBankCodeList,
} from "@/api";
import { useI18n } from "vue-i18n";
import { currency } from "@/utils/index";
import memberDetail from "@/components/Member/memberDetail.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";

// 自动开启卖出日志：系统根据触发逻辑自动开启会员假APP自动卖出功能的记录
const { getTabH } = useTabHeight();
const { t } = useI18n();
const query = ref({
  asc: false,
  column: '',
  pageNo: 1,
  pageSize: 20,
  memberId: undefined,
  memberType: undefined,
  phoneNumber: undefined,
  upiId: undefined,
  bankCode: undefined,
  openedAtStart: '', // 自动开启时间-开始（含）
  openedAtEnd: '', // 自动开启时间-结束（含）
});
// 累计金额/累计笔数/成功金额：本次开启周期内“自动卖出=是/系统开启”的卖出订单统计；
// 开启时余额为开启时 ARB 与 CPB 余额合计
const columns: any = [
  {
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 140,
  },
  {
    title: t('memberListC10'),
    dataIndex: "memberType",
    key: "memberType",
    align: "center",
    width: 120,
  },
  {
    title: t('m591'),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
    width: 140,
  },
  {
    title: "UPI ID",
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
  },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 120,
  },
  {
    title: t('l50'),
    dataIndex: "appCreateTime",
    key: "appCreateTime",
    align: "center",
    width: 170,
  },
  {
    title: t('n2000'),
    dataIndex: "openedAt",
    key: "openedAt",
    align: "center",
    width: 170,
  },
  {
    title: t('n2001'),
    dataIndex: "closedAt",
    key: "closedAt",
    align: "center",
    width: 170,
  },
  {
    title: t('n2002'),
    dataIndex: "openBalance",
    key: "openBalance",
    align: "center",
    sorter: true,
    width: 130,
  },
  {
    title: t('n2003'),
    dataIndex: "createdOrderAmount",
    key: "createdOrderAmount",
    align: "center",
    sorter: true,
    width: 130,
  },
  {
    title: t('n2004'),
    dataIndex: "createdOrderCount",
    key: "createdOrderCount",
    align: "center",
    sorter: true,
    width: 120,
  },
  {
    title: t('n2005'),
    dataIndex: "succeededOrderAmount",
    key: "succeededOrderAmount",
    align: "center",
    sorter: true,
    width: 130,
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
  api: systemAutoSellLogAdminListPage,
  fetchType: 2,
  defaultPageSize: 20,
  filterRules: [],
});

const detailModel = ref(false);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};

const groupList = ref([]);
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value = res.data.map((item: any) => ({
      value: item,
      label: item,
    }));
  }
};
onMounted(() => {
  getGroupList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
