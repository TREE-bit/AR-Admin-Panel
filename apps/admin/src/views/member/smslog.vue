<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <!-- <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.userId"
          :placeholder="$t('m181')"
        />
      </a-col> -->
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.type"
          :placeholder="$t('m62')"
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
          v-model:value="query.receiver"
          class="searchstyle"
          :placeholder="$t('m194')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.loginClient"
          :placeholder="$t('n2068')"
          :allowClear="true"
        >
          <a-select-option
            v-for="(item, key) in loginClientMap"
            :value="item"
            :key="key"
            >{{ item }}</a-select-option
          >
        </a-select>
      </a-col>
      <!-- <a-col :span="6">
        <a-range-picker
          show-time
          class="searchstyle"
          v-model:value="searchDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m195')]"
        />
      </a-col> -->
        <a-col >
          <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('m195')" :type="1"/>
        </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          :loading="loading"
          >{{ $t("search") }}</a-button
        >
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
      <!-- <template v-if="column.key === 'userId'">
        {{ record.userId || '-' }}
      </template> -->
      <template v-if="column.key === 'codeType'">
        {{ $getMapItem(typeMap,record.codeType) || '-' }}
      </template>
      <template v-if="column.key === 'receiver'">
        <a-tooltip v-if="record.receiver">
          <template #title>{{ record.receiver }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.receiver }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'verificationCode'">
        {{ record.verificationCode || '-' }}
      </template>
      <template v-if="column.key === 'sendTime'">
        {{ record.sendTime || '-' }}
      </template>
      <template v-if="column.key === 'expirationTime'">
        {{ record.expirationTime || '-' }}
      </template>
      <template v-if="column.key === 'ipAddress'">
        <a-tooltip v-if="record.ipAddress">
          <template #title>{{ record.ipAddress }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.ipAddress }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'device'">
        {{ record.device || '-' }}
      </template>
      <template v-if="column.key === 'loginClient'">
        {{ record.loginClient || '-' }}
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { getSmsLog } from "@/api/menber";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight(340);
const { t } = useI18n();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
// const dataSource = ref([]);
// const loading = ref(false);
const query = ref<any>({
  asc: false,
  endTime: endIndiaTime,
  receiver:"",
  startTime: startIndiaTime,
  type: undefined,
  // userId: "",
  loginClient: undefined,
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
  SMS: t("m196"),
  EMAIL: t('l63'),
};
const loginClientMap: any = {
  1: "APP",
  3: "H5",
}
const transformedArray = Object.entries(typeMap).map(([value, label]) => ({
  value,
  label,
}));
const columns:any = [
  // {
  //   title: t("m184"),
  //   align: "center",
  //   dataIndex: "userId",
  //   key: "userId",
  // },
  {
    title: t("m197"),
    dataIndex: "codeType",
    key: "codeType",
    align: "center",
  },
  {
    title: t("m198"),
    dataIndex: "receiver",
    key: "receiver",
    align: "center",
  },
  {
    title: t("m199"),
    dataIndex: "verificationCode",
    key: "verificationCode",
    align: "center",
  },
  {
    title: t("m195"),
    dataIndex: "sendTime",
    key: "sendTime",
    align: "center",
  },
  {
    title: t("m200"),
    dataIndex: "expirationTime",
    key: "expirationTime",
    align: "center",
  },
  {
    title: t("m201"),
    dataIndex: "ipAddress",
    key: "ipAddress",
    align: "center",
  },
  {
    title: t("m193"),
    dataIndex: "device",
    key: "device",
    align: "center",
  },
  {
    title: t("n2068"),
    dataIndex: "loginClient",
    key: "loginClient",
    align: "center",
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
  api: getSmsLog,
  defaultPageSize: 50,
  filterRules: [],
});
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
