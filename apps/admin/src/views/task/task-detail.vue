<template>
  <div class="search">
    <h2>{{ $t("m318") }}</h2>
    <a-row wrap>
      <a-col :span="3">
        <a-input-number
          v-model:value="query.userId"
          class="searchstyle"
          :placeholder="$t('m181')"
          :controls="false"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.merchantName"
          :options="timeState.merchantList"
          :placeholder="$t('p26')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.taskName"
          class="searchstyle"
          :placeholder="$t('m340')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          v-model:value="query.taskType"
          :placeholder="$t('m345')"
          :options="Object.entries(taskTypeMap).map(([value, label]) => ({ value, label }))"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          v-model:value="query.frequency"
          :placeholder="$t('m344')"
          :options="Object.entries(taskCycleMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
        />
      </a-col>

      <a-col>
        <!-- <a-range-picker
          show-time
          v-model:value="timeState.completeStart"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m171')]"
        /> -->
        <timeRange v-model:startTime="query.completeStartTime" v-model:endTime="query.completeEndTime" :title="$t('l39')" :type="1"/>
      </a-col>
      <a-col>
        <!-- <a-range-picker
          show-time
          v-model:value="timeState.receiveStart"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m422')]"
        /> -->
        <timeRange v-model:startTime="query.receiveStartTime" v-model:endTime="query.receiveEndTime" :title="$t('collectionTime')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(false,1)"
          :loading="loading"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="getList(true)" :loading="loading">{{
          $t("reset")
        }}</a-button>
        <ExportButton
          :query="query"
          :api="taskCollectionRecordExport"
          permission="admin:taskCollectionRecord:export"
        />
        <!-- <a-button type="primary" :loading="loading" @click="exportList" v-permission="'admin:taskCollectionRecord:export'">{{
          $t("export")
        }}</a-button> -->
      </a-col>
    </a-row>
  </div>
  <a-row class="mb-16">
    <a-col :span="5" class="flex items-center justify-between"
      ><div class="flex-1 text-gray72 text-base">{{ t("m419") }}</div>
      <div class="flex-1 text-2xl text-[#fac10c] font-bold text-left">
        {{ statisticsData?.data?.completionNum ||0}}
      </div></a-col
    >
    <a-col :span="5" class="flex items-center justify-between"
      ><div class="flex-1 text-gray72 text-base">{{ t("m420") }}</div>
      <div class="flex-1 text-2xl text-[#fac10c] font-bold text-left">
        {{ statisticsData?.data?.recipientsNum ||0}}
      </div></a-col
    >
    <a-col :span="5" class="flex items-center justify-between"
      ><div class="flex-1 text-gray72 text-base">{{ t("m427") }}</div>
      <div class="flex-1 text-2xl text-[#fac10c] font-bold text-left">
        {{ statisticsData?.data?.rewardAmount ||0}}
      </div></a-col
    >
  </a-row>
  <taskTable
    :query="query"
    :data="data"
    @changePagination="changePagination"
    :loading="loading"
    :pagination="pagination"
  />
</template>
<script lang="ts" setup>
import { ref, h, reactive, onMounted } from "vue";
import taskTable from "./component/taskTable";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { usePagination, useRequest } from "vue-request";
import {
  taskCollectionRecordListPage,
  getStatisticsData,
} from "@/api/c2cconfig.api";
import { taskCollectionRecordExport } from "@/api/export";
import { getMerchantInfoAdminList } from "@/api/merchant.api";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { message } from "ant-design-vue";
import { taskTypeMap,taskCycleMap } from "@/utils/publicData";
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const query = ref({
  asc: false,
  column: "",
  userId: undefined,
  merchantName: undefined,
  taskName: undefined,
  taskType: undefined,
  frequency: undefined,
  completeEndTime: '',
  completeStartTime: '',
  receiveEndTime: endIndiaTime,
  receiveStartTime: startIndiaTime,
});
const typeList = ref([
  { value: 1, label: t("m370") },
  { value: 2, label: t("m371") },
  { value: 3, label: t("m372") },
  { value: 4, label: t("m373") },
]);
// const cycleList = ref([
//   { value: 1, label: t("m361") },
//   { value: 2, label: t("m362") },
// ]);
const timeState = reactive({
  receiveStart: [],
  completeStart: [startIndiaTime,endIndiaTime],
  merchantList: [],
});
const { data, run, loading } = usePagination(taskCollectionRecordListPage, {
  manual: true,
  onSuccess(res) {
    pagination.total = res?.total || 0;
  },
});
const { data: statisticsData } = useRequest(getStatisticsData, {});
useRequest(
  () =>
    getMerchantInfoAdminList({
      pageNo: 1,
      pageSize: 10000,
    }),
  {
    onSuccess: (res: any) => {
      timeState.merchantList = res?.data?.map((item: any) => ({
        value: item.username,
        label: item.username,
      }));
    },
  }
);
const getList = (isRest: boolean =false,isFirst:any = null) => {
  if(isFirst){
    pagination.current = 1;
  }
  if (isRest) {
    query.value = {
      asc: false,
      column: "",
      userId: undefined,
      merchantName: undefined,
      taskName: undefined,
      taskType: undefined,
      frequency: undefined,
      completeEndTime: '',
      completeStartTime: '',
      receiveEndTime: '',
      receiveStartTime: '',
    };
    // (timeState.completeStart = []), (timeState.receiveStart = []);
  }
  run({
    pageNo: isFirst? 1 : pagination.current,
    pageSize: pagination.pageSize,
    ...query.value,
    completeStartTime: query.value.completeStartTime || '',
    completeEndTime: query.value.completeEndTime || "",
    receiveStartTime: query.value.receiveStartTime || "",
    receiveEndTime: query.value.receiveEndTime || "",
    // completeStartTime: timeState.completeStart?.[0] || "",
    // completeEndTime: timeState.completeStart?.[1] || "",
    // receiveStartTime: timeState.receiveStart?.[0] || "",
    // receiveEndTime: timeState.receiveStart?.[1] || "",
  });
};
const changePagination = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  getList();
};
const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res:any = await taskCollectionRecordExport(data).finally(() => {
    loading.value = false;
  });
  if (res && res.code == "1") {
    message.success(t("n545"));
  }
};
onMounted(() => {
  getList();
});
</script>
<style lang="less" scoped></style>

