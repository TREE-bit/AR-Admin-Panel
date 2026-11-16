<template>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="pagination"
      :scroll="{ x: '100%' , y: getTabH +'px' }"
      :loading="loading"
      @change="handleTableChange"
      bordered
      :row-key="(record: any) => JSON.stringify(record)"
        :row-selection="{
        type: 'radio',
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record) => ({
            disabled: record.enableFlag == '1',
        }),
        }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'templateFlag'">
          <div v-if="record.templateFlag" class="toopTipStyle2">{{ record.templateFlag }}</div>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'emailSubject'">
          <div v-if="record.emailSubject" class="toopTipStyle2">{{ record.emailSubject }}</div>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'templateContent'">
          <div class="toopTipStyle2" v-html="record.templateContent"></div>
        </template>
        <template v-if="column.key === 'remark'">
          <div v-if="record.remark" class="toopTipStyle2">{{ record.remark }}</div>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'enableFlag'">
          <a-tag :color="record.enableFlag == 0 ? 'green' : 'red'">
            {{ record.enableFlag == 0 ? $t('enabled') : $t('disabled') }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </template>
  <script lang="ts" setup>
  import {
    emailTemplateAdminList,
  } from "@/api/email.api";
  import { onMounted, ref, reactive } from "vue";
  import { useI18n } from "vue-i18n";
  import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { number } from "echarts";
import { anyType } from "ant-design-vue/es/_util/type";
  const { getTabH } = useTabHeight();
  const { t } = useI18n();
  const props = defineProps({
    emailId: {
      type: Number,
      default: undefined,
    },
  });
  const emits = defineEmits(["update:emailId"]);
  const columns:any = [
    {
      title: t("m965"),
      dataIndex: "emailSubject",
      key: "emailSubject",
      width: 160,
      align: "center",
    },
    {
      title: t("m966"),
      dataIndex: "templateContent",
      key: "templateContent",
      align: "center",
      width: 300,
    },
    {
      title: t("m967"),
      dataIndex: "remark",
      key: "remark",
      width: 160,
      align: "center",
    },
    {
      title: t("state"),
      dataIndex: "enableFlag",
      key: "enableFlag",
      width: 120,
      align: "center",
    },
  ];
  const loading = ref(false);
  const dataSource = ref([]);
  const pagination = reactive({
    total: 0,
    pageNo: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total: any) => t("total", [total]),
  });
  const getList = async () => {
    loading.value=true;
    const { pageNo, pageSize } = pagination;
    const res: any = await emailTemplateAdminList({
      pageNo,
      pageSize,
    }).finally(()=>{loading.value=false});
    if (res && res.code === "1") {
      dataSource.value = res.data;
      pagination.total = res.total;
    }
  };

const onSelectChange = (selectedRowKeysValue:any, selectedRows:any) => {
  if (selectedRows.length) {
    emits('update:emailId', selectedRows[0].id)
  }
};
  const handleTableChange: any = (value: {
    pageSize: number;
    current: number;
  }) => {
    const { current ,pageSize} = value;
    pagination.pageNo = current;
    pagination.pageSize = pageSize;
    getList();
  };
  onMounted(() => {
    getList();
    getTabH.value = useTabHeight(3).getTabH.value;
  });
  </script>
  <style lang="less" scoped>
  </style>
  