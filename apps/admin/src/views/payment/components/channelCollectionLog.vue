<template>
  <div class="search">
    <h2>{{ $t('n915') }}</h2>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="paginationConfig"
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'platformOrderNo'">
        <a-tooltip>
          <template #title>{{ record.platformOrderNo }}</template>
          <div class="toopTipStyle2">{{ record.platformOrderNo }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'returnContent'">
        <a-tooltip>
          <template #title>{{ record.returnContent }}</template>
          <div class="toopTipStyle2">{{ record.returnContent }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'validCallback'">
        <a-tag :style="record.validCallback == 0 ? 'color:red' : 'color:green'">{{ $getMapItem(validCallbackMap,record.validCallback) }}</a-tag>
      </template>
      <template v-if="column.key === 'handleResult'">
        <a-tooltip v-if="record.handleResult">
          <template #title>{{ $getMapItem(handleResultMap,record.handleResult) }}</template>
          <div class="toopTipStyle2">{{$getMapItem(handleResultMap,record.handleResult) }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'createTime'"  >
        {{ record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'callbackContent'">
        <a-tooltip>
          <template #title>{{ record.callbackContent }}</template>
          <div class="toopTipStyle2">{{ record.callbackContent }}</div>
        </a-tooltip>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { thirdPayCallbackLogAdminList } from "@/api/channel.api";
import { onMounted, ref} from "vue";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { usePagination } from "@/plugins/dataMap";
const { paginationConfig } = usePagination();
const { getTabH } = useTabHeight(3,60);
const { t } = useI18n();
const props = defineProps({
  orderNo: {
    type: String,
    default: "",
  },
});
const query= ref({
  pageNo:1,
  pageSize:20,
  platformOrderNo: props.orderNo || undefined,
})
const validCallbackMap:any = {
  0: t('n899'),//无效回调
  1: t('n900'),//有效回调
};
const handleResultMap:any = {
  1: t('n901'),//回调内容为空
  2: t('n902'),//回调方IP地址不在白名单内
  3: t('n903'),//回调签名错误
  4: t('n904'),//回调订单不存在
  5: t('n905'),//回调参数校验失败
  6: t('n906'),//回调订单状态为处理中
  7: t('n907'),//回调订单状态变更为成功
  8: t('n908'),//回调订单状态变更为失败
  9: t('n909'),//回调订单状态未变更
  10: t('n910'),//回调订单状态已是成功
  11: t('n911'),//回调订单状态已经完结
  12: t('n912'),//回调处理异常
  13: t('n913'),//回调参数解密失败
  14: t('n914'),//非成功状态不处理
  15: t('n931'),//回调订单金额低于KYC最低上分金额
  16: t('n951'),//超出允许回调的时间范围
};
const columns:any = [
  {
    title: t('n47'),
    dataIndex: "platformOrderNo",
    key: "platformOrderNo",
    width:240,
    align:"center"
  },
  {
    title: t('n894'),
    dataIndex: "validCallback",
    key: "validCallback",
    width:140,
    align:"center"
  },
  {
    title: t('n895'),
    dataIndex: "handleResult",
    key: "handleResult",
    width:160,
    align:"center",
  },
  {
    title: t('n896')+'(ms)',
    dataIndex: "handleDuration",
    key: "handleDuration",
    width:120,
    // ellipsis: true,
    align:"center",
  },
  {
    title: t('n897'),
    dataIndex: "returnContent",
    key: "returnContent",
    width:200,
    align:"center"
  },
  {
    title: t('n49'),
    dataIndex: "callbackTime",
    key: "callbackTime",
    width:140,
    align:"center"
  },
  {
    title: t('n898'),
    dataIndex: "callbackContent",
    key: "callbackContent",
    width:200,
    align:"center"
  },
];
const loading = ref(false);
const dataSource = ref([]);
const getList = async () => {
  loading.value=true;
  paginationConfig.current = query.value.pageNo;
  paginationConfig.pageSize = query.value.pageSize;
  const res: any = await thirdPayCallbackLogAdminList(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data.list;
    paginationConfig.total = res.data.list.total;
  }
};


const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  paginationConfig.current = pag.current;
  paginationConfig.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList()
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3,60).getTabH.value;
});
</script>

