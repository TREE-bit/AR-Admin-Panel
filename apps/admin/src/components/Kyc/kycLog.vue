<template>
  <div class="container">
    <div class="search">
      <a-row>
        <a-col >
          <timeRange v-model:startTime="query.operationTimeStart" v-model:endTime="query.operationTimeEnd" :size="'small'" :width="170" :type="1"/>
        </a-col>
        <a-col :span="4">
          <a-button type="primary" size="small" :icon="h(SearchOutlined)" @click="getData(1)">{{
            $t("search")
          }}</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="kycLogMTitle">
      UPI ID：{{ data.upiId }}
    </div>
    <a-table
      :dataSource="dataList"
      :columns="columns"
      :pagination="paginationConfig"
      :scroll="{ x: '100%' , y: height + 'px'}"
      :loading="loading"
      size="small"
      @change="handleTableChange"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key ==='changeType'">
        {{ kycLogChangeMap[record.changeType] }}
      </template>
    </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  kycLinkStatusLogAdminListPage
} from "@/api/kycConfig.api";
import { usePagination } from "@/plugins/dataMap";
import { useI18n } from "vue-i18n";
import { ref, onMounted, h, computed, watch } from "vue"
const { paginationConfig } = usePagination();
const { t } = useI18n();
const props = defineProps({
  data:{
    type: Object,
    default: () => ({})
  },
});
const height = computed(()=>{
  return props.data.height - 130 || 200
})
const columns:any = [
  {
    title: 'KYC ID',
    dataIndex: "kycId",
    key: "kycId",
    align: "center",
    with: 180,
  },
  {
    title: t('m925'),
    dataIndex: "changeType",
    key: "changeType",
    align: "center",
    with: 120,
  },
  {
    title: t('l67'),
    dataIndex: "operationTime",
    key: "operationTime",
    align: "center",
    with: 120,
  },
];
const kycLogChangeMap:any = {
  1: t('m926'),//添加kyc连接
  2: t('m927'),//卖出操作kyc连接
  3: t('m928'),//无操作断开kyc链接
  4: t('m929'),//Token失效断开连接
  5: t('n151'),//买家申诉连接
  // 6: t('n152'),//买家申诉重新连接
  7: t('n153'),//卖家申诉连接
  8: t('n154'),//重新匹配
  9: t('n155'),//kyc连接
}
const loading = ref(false);
const query = ref({
  pageNo: 1,
  pageSize: 20,
  memberId: props.data.memberId,
  kycId: props.data.id,
  operationTimeStart: "",
  operationTimeEnd: "",
});
const dataList = ref([]);
const getData = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    paginationConfig.current = 1;
  }
  loading.value = true;
  paginationConfig.pageSize = query.value.pageSize;
  const res: any = await kycLinkStatusLogAdminListPage(query.value).finally(() => loading.value = false);
  if (res && res.code == "1") {
    dataList.value = res.data;
    paginationConfig.total = res.total;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  paginationConfig.current = pag.current;
  paginationConfig.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getData();
};
onMounted(() => {
  getData();
});
</script>
<style lang="less" scoped>
.container {
  padding: 2px;
  overflow: auto;
}
.kycLogMTitle{
  font-size: 12px;
  padding-bottom: 5px;
  font-weight: 800;
}
:deep(.ant-picker .ant-picker-input >input){
  font-size: 12px!important;
}
:deep(table){
  *{
    font-size: 12px;
  }
  tr>th,tr>td{
    padding: 2px!important;
  }

}
:deep(.ant-pagination){
  padding-right:20px;
}
</style>
