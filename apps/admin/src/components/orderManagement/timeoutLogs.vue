<template>
  <div class="search" style="margin-bottom: 5px">
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="false"
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'timeoutType'">
        <a-tooltip>
          <template #title>
          {{ $getMapItem(timeoutTypeMap,record.timeoutType) }} 
          <span v-if="record.description">-【{{ record.description }}】</span>
          </template>
          <div class="toopTipStyle2">
            {{ $getMapItem(timeoutTypeMap,record.timeoutType) }} 
            <span v-if="record.description">-【{{ record.description }}】</span>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || '-' }}
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import {
  matchPoolAdminTimeoutLogs,
} from "@/api/order.api";
import { onMounted, ref, reactive, h } from 'vue';
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const props = defineProps({
  matchOrder: {
    type: String,
    default: () => ('')
  }
});
const timeoutTypeMap: any = {
  1: t('n279'),//KYC断连
  2: t('n712'),//KYC断连-人工禁用UPI
  3: t('n271'),//收款账户异常
  4: t('n713'),//UPI ID被校正
  5: t('n479'),//达到超时时限
  6: t("n1777"),//买方发起买入失败申诉单
  7: t("n1778"),//后台人工手动触-发失败订单
};
const columns:any = [
  {
    title: t('n493'),
    dataIndex: "index",
    key: "index",
    align:"center",
    width: 110,
    customRender: ({ index }:{index:any}) => t('n705',{n:index + 1}),
  },
  {
    title: t('n706'),
    dataIndex: "timeoutType",
    key: "timeoutType",
    width: 200,
    align:"center",
  },
  {
    title: t("n707"),
    dataIndex: "createTime",
    key: "createTime",
    align:"center",
    width: 140,
  },
];
const query = ref({
  asc: true,
  column: undefined,
  pageNo: 1,
  pageSize: 20,
  account: undefined,
});
const loading = ref(false);
const dataSource = ref([]);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: any) => t('total', [total]),
});

const getList = async (isFirst: any = 1) => {
  if (isFirst) {
    query.value.pageNo = 1;
    pagination.current = 1;
  }
  loading.value=true;
  const res: any = await matchPoolAdminTimeoutLogs({matchOrder:props.matchOrder}).finally(()=>loading.value=false);;
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.current = query.value.pageNo;
    pagination.pageSize = query.value.pageSize;
    pagination.total = res.total;
  }
};
const handleTableChange: any = (value: {
  pageSize: number;
  current: number;
}) => {
  const { current,pageSize } = value;
  pagination.current = current;
  pagination.pageSize = pageSize;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  getList();
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight().getTabH.value;
});
</script>

<style lang="less" scoped>
</style>

