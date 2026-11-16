<template>
  <div class="search">
    <a-row>
      <a-col>
        <timeRange v-model:startTime="form.startTime" v-model:endTime="form.endTime" :title="$t('l67')" :type="1"/>
      </a-col>
      <a-col :span="4">
        <a-select
          class="searchstyle"
          v-model:value="form.operationArea"
          :options="areaOptions"
          :placeholder="$t('n2039')"
        ></a-select>
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="form.operator"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m240')"
        />
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          :loading="loading"
          @click="onSearch"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" :loading="loading" @click="onReset">{{
          $t("reset")
        }}</a-button>
      </a-col>
    </a-row>
    <div class="logBar">
      <span class="logBarTab">{{ $t('n2040') }}</span>
      <ExportButton
        :query="query"
        :api="tradeConfigOperationLogExport"
        permission="admin:tradeConfigAdmin:operationLogExport"
        :handleQuery="handleExportQuery"
        :label="$t('n2041')"
      />
    </div>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    :locale="{ emptyText: $t('n2042') }"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => record.serialNo"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operationArea'">
        {{ getAreaLabel(record.operationArea, record.operationAreaName) }}
      </template>
      <template v-if="column.key === 'operationContent'">
        <div class="operationContent">{{ record.operationContent || '-' }}</div>
      </template>
      <template v-if="column.key === 'operationTime'">
        {{ record.operationTime || '-' }}
      </template>
      <template v-if="column.key === 'operator'">
        {{ record.operator || '-' }}
      </template>
      <template v-if="column.key === 'operatorIp'">
        {{ record.operatorIp || '-' }}
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import { message } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { tradeConfigOperationLogListPage, tradeConfigOperationLogExport } from "@/api/c2cconfig.api";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const { getTabH } = useTabHeight(3, 70);
const { t } = useI18n();
// 操作区域编码与平台参数配置各 Tab 名称对应
const areaMap: any = {
  1: 'l72',
  2: 'l73',
  3: 'm843',
  4: 'm319',
  5: 'n414',
};
// 空字符串表示全部，请求时会转成 undefined
const areaOptions = [
  { value: '', label: t('m341') },
  ...Object.keys(areaMap).map((key) => ({ value: Number(key), label: t(areaMap[key]) })),
];
const getAreaLabel = (code: any, name: any) => {
  const key = areaMap[code];
  return key ? t(key) : (name || '-');
};
// 时间必填，默认当天
const getDefaultForm = () => {
  const [startIndiaTime, endIndiaTime] = getStartAndEndOfDay();
  return {
    startTime: startIndiaTime,
    endTime: endIndiaTime,
    operationArea: '',
    operator: undefined,
  };
};
// 筛选框的值，点搜索后才同步到 query
const form = ref<any>(getDefaultForm());
// 最近一次点搜索时的条件，翻页和导出都用它（筛选框改了没点搜索不算）
const query = ref<any>({ ...getDefaultForm(), pageNo: 1, pageSize: 20 });
const columns: any = [
  {
    title: t("e47"),
    dataIndex: "serialNo",
    key: "serialNo",
    align: "center",
    width: 80,
  },
  {
    title: t("l67"),
    dataIndex: "operationTime",
    key: "operationTime",
    align: "center",
    width: 170,
  },
  {
    title: t("n2039"),
    dataIndex: "operationArea",
    key: "operationArea",
    align: "center",
    width: 140,
  },
  {
    title: t("n981"),
    dataIndex: "operationContent",
    key: "operationContent",
    align: "center",
    width: 480,
  },
  {
    title: t("l48"),
    dataIndex: "operator",
    key: "operator",
    align: "center",
    width: 130,
  },
  {
    title: t("m911"),
    dataIndex: "operatorIp",
    key: "operatorIp",
    align: "center",
    width: 140,
  },
];
const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
} = useTableData({
  query,
  api: tradeConfigOperationLogListPage,
  defaultPageSize: 20,
  fetchType: 2,
  filterRules: [],
});
(pagination.value as any).pageSizeOptions = ['20', '50', '100'];

const onSearch = () => {
  const { startTime, endTime } = form.value;
  if (!startTime) return message.warning(t('t4'));
  if (!endTime) return message.warning(t('t5'));
  if (startTime > endTime) return message.warning(t('n2006'));
  query.value = { ...form.value, pageNo: 1, pageSize: query.value.pageSize };
  getList(1);
};
const onReset = () => {
  form.value = getDefaultForm();
  onSearch();
};

// 导出全部匹配记录，不带分页参数
const handleExportQuery = (q: any) => {
  const { pageNo, pageSize, ...params } = q;
  return params;
};

onMounted(() => {
  getList();
});
</script>
<style lang="less" scoped>
:deep(.ant-picker-range-separator) {
  display: none;
}
// antd 加载中的按钮光标为 default，加载结束后鼠标不动时浏览器不会换回手形，这里保持手形
.search :deep(.ant-btn.ant-btn-loading) {
  cursor: pointer;
}
.logBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  border-bottom: 1px solid var(--app-color-border);
}
.logBarTab {
  padding: 6px 4px;
  margin-bottom: -1px;
  color: var(--app-color-primary);
  border-bottom: 2px solid var(--app-color-primary);
}
// 每个变化项一行，保留后端返回的换行
.operationContent {
  text-align: left;
  white-space: pre-line;
  word-break: break-all;
}
</style>
