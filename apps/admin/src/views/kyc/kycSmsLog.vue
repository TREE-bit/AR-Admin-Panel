<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col>
        <a-input v-trim
          v-model:value="query.phoneNumber "
          allow-clear
          class="searchstyle"
          :placeholder="$t('m591')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          allow-clear
          v-model:value="query.memberId "
          class="searchstyle"
          :placeholder="$t('c9')"
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
        <a-input v-trim
          v-model:value="query.upiId "
          allow-clear
          class="searchstyle"
          placeholder="UPI ID"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.sendStatus"
          :options="[
            { value: '1', label: $t('s10') },
            { value: '0', label: $t('m618') },
          ]"
          :placeholder="$t('state')"
          :allowClear="true"
        ></a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('m195')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search()"
          >{{ $t("search") }}</a-button
        >
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
    :loading="loading"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        {{
          record.memberId || '-'
        }}
      </template>
      <template v-if="column.key === 'phoneNumber'">
        <a-tooltip v-if="record.phoneNumber">
          <template #title>{{ record.phoneNumber }}</template>
          <div class="toopTipStyle">
            {{ record.phoneNumber }}
            <CopyOutlined v-if="record.phoneNumber" class="copyId"  @click="$copyId(record.phoneNumber)" />
          </div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'bankCode'">
        <a-tooltip v-if="record.bankCode">
          <template #title>{{ record.bankCode }}</template>
          <div class="toopTipStyle">
            {{ record.bankCode }}
          </div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip v-if="record.upiId">
          <template #title>{{ record.upiId }}</template>
          <div class="toopTipStyle">
            {{ record.upiId }}
            <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />
          </div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'sendStatus'">
        <a-tag v-if="[0,1].includes(record.sendStatus)" :color="record.sendStatus == '1' ? 'green' : record.sendStatus =='0' ? 'red' : ''">
          {{ record.sendStatus == '1' ? $t('s10') : record.sendStatus =='0' ? $t('m618') : '-'}}
        </a-tag>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'sendTime'">
        {{
          record.sendTime || '-'
        }}
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip v-if="record.remark">
          <template #title>{{ record.remark }}</template>
          <div class="toopTipStyle">
            {{ record.remark }}
          </div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
    </template>
    <!-- <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'phoneNumber'"
        />
    </template> -->
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { kycSendSmsDailyStatisticsListPage, getKycBankCodeList } from "@/api/kycConfig.api";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { replaceEmptyWithUndefined } from "@/utils/index";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
const dataSource = ref([]);
const extendData = ref({
  cntPageTotal: 0,
  cntTotal: 0,
});
const loading = ref(false);
const query = ref({
  asc: false,
  column: "sendTime",
  pageNo: 1,
  pageSize: 20,
  memberId: undefined,
  bankCode: undefined,
  sendStatus: undefined,
  phoneNumber:undefined,
  upiId:undefined,
  startTime: startIndiaTime,
  endTime: endIndiaTime,
});
const columns:any = [
  {
    title: t("m591"),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
    width: 120,
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: t("m582"),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 120,
  },
  {
    title: 'UPI ID',
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
  },
  {
    title: t("state"),
    dataIndex: "sendStatus",
    key: "sendStatus",
    align: "center",
    width: 100,
  },
  {
    title: t("m195"),
    dataIndex: "sendTime",
    key: "sendTime",
    align: "center",
    sorter: true,
    width: 120,
  },
  {
    title: t("remark"),
    dataIndex: "remark",
    key: "remark",
    align: "center",
    width: 200,
  },
];
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      cnt: extendData.value.cntPageTotal || 0,
    },
  },
  {
    label: t("m55"),
    fields: {
      cnt: extendData.value.cntTotal || 0,
    },
  },
]);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async () => {
  loading.value = true;
  pagination.value.current = query.value.pageNo;
  pagination.value.pageSize = query.value.pageSize;
  const res: any = await kycSendSmsDailyStatisticsListPage(replaceEmptyWithUndefined(query.value)).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    extendData.value = res.extend || {};
    pagination.value.total = res.total;
  }
};
const { handleTableChange } = useTableChange({
  query,
  pagination,
  getList,
  filterRules: [],
});
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//   pagination.value.current = pag.current;
//   pagination.value.pageSize = pag.pageSize;
//   query.value.pageNo = pag.current;
//   query.value.pageSize = pag.pageSize;
//   getList();
// };
const search = () => {
  query.value.pageNo = 1;
  pagination.value.current = 1;
  getList();
}
const resetQuery = () => {
  query.value = {
    asc: false,
    column: "sendTime",
    pageNo: 1,
    pageSize: 20,
    memberId: undefined,
    bankCode: undefined,
    phoneNumber:undefined,
    sendStatus: undefined,
    upiId:undefined,
    startTime: '',
    endTime: '',
  };
  pagination.value.pageSize = 20;
  pagination.value.current = 1;
  getList();
};

const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data.map((item: any) => ({
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
<style lang="less" scoped>
:deep(.ant-picker-range-separator) {
  display: none;
}
:deep(.windActive){
  font-weight: 600;
  color: red;
}
</style>
