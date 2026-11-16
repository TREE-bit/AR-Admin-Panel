<template>
  
  <div class="search">
    <h2>{{ $t("m825") }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.kycId"
          class="searchstyle"
          :placeholder="$t('m562')+'KYC ID'"
        />
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search"
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
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'kycId'">
        {{ record.kycId || '-' }}
        <CopyOutlined v-if="record.kycId" class="copyId"  @click="$copyId(record.kycId)" />
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import {
  pendingKycTokenListPage,
} from "@/api/kycConfig.api";
import { message } from "ant-design-vue";
import { onMounted, ref, reactive, h } from "vue";
import { CopyOutlined, SearchOutlined } from "@ant-design/icons-vue";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
const query = ref({
  pageNo: 1,
  pageSize: 20,
  asc:true,
  column:'',
  kycId:undefined,
})
const columns:any = [
  {
    title: "KYC ID",
    dataIndex: "kycId",
    key: "kycId",
    width:180,
    align:"center"
  },
];
const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async () => {
  loading.value=true;
  const res: any = await pendingKycTokenListPage(query.value).finally(()=>loading.value=false);;
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.value.total = res.total;
  }
};
const search = () => {
  pagination.value.current = 1;
  query.value.pageNo = 1;
  getList()
}
const resetQuery = () => {
  query.value = {
    pageNo: 1,
    pageSize: 20,
    asc:true,
    column:'',
    kycId:undefined,
  };
  pagination.value.pageSize = 20;
  pagination.value.current =1;
  getList();
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList()
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

