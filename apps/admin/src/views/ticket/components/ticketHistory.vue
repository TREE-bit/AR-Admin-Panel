<template>
  <div class="container">
    <div class="search">
      <h2>{{ $t('n970') }}</h2>
      <a-row>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.workOrderName"
            :allowClear="true"
            class="searchstyle"
            :placeholder="$t('n955')"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            ref="select"
            v-model:value="query.operationType"
            :placeholder="$t('n982')"
            class="searchstyle"
            :options="Object.keys(operationTypeMap).map(key => ({ label: operationTypeMap[key], value: key }))"
            >
          </a-select>
        </a-col>
        <a-col>
          <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime"
          :title="$t('l67')" :type="1"/>
        </a-col>
        <a-col>
          <a-button type="primary" @click="getList">
            {{ $t("search") }}
          </a-button>
          <a-button type="primary" @click="reset">
            {{ $t("reset") }}
          </a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :dataSource="dataList"
      :columns="columns"
      :scroll="{ x: '100%',y : getTabH +'px' }"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'workOrderName'">
        <a-tooltip v-if="record.workOrderName">
          <template #title>{{ record.workOrderName }}</template>
          <div class="toopTipStyle2">
              {{ record.workOrderName }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'content'">
        <a-tooltip v-if="record.content" :overlayStyle="{ width: 'auto', maxWidth: 'none' }">
          <template #title>
            <div style="width: 440px;height: 200px;overflow-y: auto;">
              {{ record.content }}
            </div>
          </template>
          <div class="tableText toopTipStyle2">
              {{ record.content }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key ==='createBy'">
        {{ record.updateBy || record.createBy || '-' }}
      </template>
      <template v-if="column.key ==='createTime'">
        {{ record.updateTime || record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'operationType'">
        {{ $getMapItem(operationTypeMap,record.operationType) || '-' }}
      </template>
    </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import {
  workOrderConfigOperationHistoryListPage,
} from "@/api/ticket.api";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import {  replaceEmptyWithUndefined } from "@/utils/index";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const [startIndiaTime,endIndiaTime,inputTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
const query = ref({
  pageNo: 1,
  pageSize: 20,
  workOrderName: undefined,
  operationType: undefined,
  startTime: startIndiaTime,
  endTime: endIndiaTime,
})
const pagination = ref({
  pageSizeOptions: ['10', '20', '50', '100'],
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const columns:any = [
  {
    title: t('n955'),
    dataIndex: "workOrderName",
    key: "workOrderName",
    align: "center",
    width:120,
  },
  {
    title: t('n981'),
    dataIndex: "content",
    key: "content",
    align: "center",
    width: 250,
  },
  {
    title: t('n982'),
    dataIndex: "operationType",
    key: "operationType",
    align: "center",
    width:80,
  },
  {
    title: t("l48"),
    dataIndex: "createBy",
    key: "createBy",
    align: "center",
    width:100,
  },
  {
    title: t("l67"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width:100,
  },
];
const operationTypeMap:any = {
  0: t('b12'),//创建
  1: t('b8'),//修改
  3: t('b11'),//删除
}
const loading = ref(false);
const dataList = ref([]);

const getList = async () => {
  loading.value = true;
  const queryParams = replaceEmptyWithUndefined(query.value);
  const res: any = await workOrderConfigOperationHistoryListPage(queryParams).catch((err)=>{loading.value = false});
  if (res) {
    dataList.value = res.data.list || [];
    loading.value = false;
    pagination.value.total = res.data.total || 0;
    pagination.value.current = query.value.pageNo;
    pagination.value.pageSize = query.value.pageSize;
  }else{
    loading.value = false;
  }
};
const reset = () => {
  query.value = {
    pageNo: 1,
    pageSize: 20,
    workOrderName: undefined,
    operationType: undefined,
    startTime: '',
    endTime: '',
  }
  pagination.value.current = 1;
  pagination.value.pageSize = 20;
  getList();
}
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.pageNo = pag.current;
  pagination.value.pageSize = pag.pageSize;
  pagination.value.current = pag.current;
  query.value.pageSize = pag.pageSize;
  query.value.pageNo = pag?.current;
  getList();
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3,100).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>