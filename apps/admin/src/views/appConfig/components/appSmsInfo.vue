<template>
  <div class="search">
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.sendMobileNumber"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n1620')"
        />
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.receiveTimeStart" v-model:endTime="query.receiveTimeEnd"  :type="1"/>
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
        <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:appInfoReport:memberSmsExport'"
          >{{ $t("export") }}</a-button
        >
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="tableDataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record:any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'content'">
        <a-tooltip>
          <template #title>{{ record.content }}</template>
          <div class="toopTipStyle2">{{ record.content }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'receiveTime'">
        {{ record.receiveTime || '-' }}
      </template>
      <template v-if="column.key === 'sendMobileNumber'">
        {{ record.sendMobileNumber || '-' }}
      </template> 
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { 
  appInfoReportMemberSmsListPage,
  appInfoReportMemberSmsExport,
 } from "@/api";
import { useI18n } from "vue-i18n";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { message } from "ant-design-vue";
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
const props = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
});
// const dataSource = ref([])
// const loading = ref(false)
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const query = ref({
  pageNo: 1,
  pageSize: 20,
  memberId: props.info.memberId,
  deviceId: props.info.deviceId,
  content: undefined,
  sendMobileNumber: undefined,
  receiveTimeStart: startIndiaTime,
  receiveTimeEnd: endIndiaTime,
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
    title: t("e47"),
    align: "center",
    width: 90,
    customRender: ({ index }: any) => index + 1,
  },
  {
    title: t('l69'),
    dataIndex: "content",
    key: "content",
    align:"center",
    width: 400,
  },
  {
    title: t('m514'),
    dataIndex: "receiveTime",
    key: "receiveTime",
    align:"center",
    width: 160,
  },
  {
    title: t('n1620'),
    dataIndex: "sendMobileNumber",
    key: "sendMobileNumber",
    align:"center",
    width: 100,
  },
];
const {
  dataSource: tableDataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  handleQueryFields: (q) => ({
    ...q,
    memberId: props.info.memberId,
    deviceId: props.info.deviceId,
  }),
  api: appInfoReportMemberSmsListPage,
  defaultPageSize: 20,
  fetchType: 2,
  filterRules: [],
});

const exportList = async () => {
  loading.value = true;
  appInfoReportMemberSmsExport(query.value).finally(() => {
    loading.value = false;
  });
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
