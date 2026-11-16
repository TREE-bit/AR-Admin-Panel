<template>
    <div class="search">
      <a-row>
        <a-col :span="2">
          <a-input-number
          class="searchstyle"
          :placeholder="$t('m562')+$t('m870')"
          v-model:value="query.agentLevel"
        />
        </a-col>
        <a-col :span="4">
          <a-button type="primary" :icon="h(SearchOutlined)" @click="getData(1)">{{
            $t("search")
          }}</a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :dataSource="dataList"
      :columns="columns"
      :pagination="pagination"
      :scroll="{ x: '100%' , y :getTabH+'px'}"
      :loading="loading"
      @change="handleTableChange"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record)"
          >{{ record.memberId }}</a-button
        >
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key ==='relationType'">
        {{ relMap[record.relationType] }}
      </template>
    </template>
    </a-table>
  <a-modal
    v-model:open="detailModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
    >
    <MemberDetail 
    v-if="detailModel"
      :memberID="detailId.memberId"
      :id="detailId.id"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h, computed } from "vue";
import {
  memberRelationList
} from "@/api/menber";
import { useI18n } from "vue-i18n";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const detailModel = ref(false);
const detailId = ref<any>({});
const showDetail = async (value: any) => {
  const { id, userId } = value;
  detailId.value = { id: userId, memberId:userId };
  detailModel.value = true;
};
const props = defineProps({
  id: {
    default: () => "",
  },
});
const columns:any = [
  {
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: t('c10'),
    dataIndex: "memberAccount",
    key: "memberAccount",
    align: "center",
    width: 120,
  },
  {
    title: t('m870'),
    dataIndex: "agentLevel",
    key: "agentLevel",
    align: "center",
    width: 120,
  },
  {
    title: t('m871'),
    dataIndex: "directSubordinateCount",
    key: "directSubordinateCount",
    align: "center",
    width: 120,
  },
  {
    title: t('m872'),
    dataIndex: "allSubordinateCount",
    key: "allSubordinateCount",
    align: "center",
    width: 120,
  },
  {
    title: t('m798'),
    dataIndex: "buyAmount",
    key: "buyAmount",
    align: "center",
    width: 140,
  },
  {
    title: t('m799'),
    dataIndex: "buyCount",
    key: "buyCount",
    align: "center",
    width: 140,
  },
  {
    title: t('m857'),
    dataIndex: "buyCommissionAMount",
    key: "buyCommissionAMount",
    align: "center",
    width: 140,
  },
  {
    title: t('m795'),
    dataIndex: "sellAmount",
    key: "sellAmount",
    align: "center",
    width: 140,
  },
  {
    title: t('m796'),
    dataIndex: "sellCount",
    key: "sellCount",
    align: "center",
    width: 140,
  },
  {
    title: t('m858'),
    dataIndex: "sellCommissionAMount",
    key: "sellCommissionAMount",
    align: "center",
    width: 140,
  },
  {
    title: t('l50'),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 170,
  },
];
const relMap = {
  1: t('m853'),
  2: t('m854'),
  3: t('m855'),
  4: t('m856'),
}
const loading = ref(false);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const query = ref({
  pageNo: 1,
  pageSize: 20,
  memberId: props.id,
  agentLevel: undefined,
});
const dataList = ref([]);
const getData = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  pagination.value.pageSize = query.value.pageSize;
  const res: any = await memberRelationList(query.value).finally(() => loading.value = false);
  if (res && res.code == "1") {
    dataList.value = res.data.list;
    pagination.value.total = res.data.total;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getData();
};
onMounted(() => {
  getData();
  getTabH.value = useTabHeight().getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
