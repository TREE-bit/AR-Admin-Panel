<template>
  <div class="search">
    <h2>{{ $t('m495') }}-L{{ mearchtData.level }}</h2>
    <a-row>
      <a-col :span="2">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.memberId"
          :placeholder="$t('p4')"
        />
      </a-col>
      <a-button
        type="primary"
        :icon="h(SearchOutlined)"
        :loading="loading"
        @click="getList"
        >{{ $t("search") }}</a-button
      >
      <a-button type="primary" :loading="loading" @click="resetQuery">{{
        $t("reset")
      }}</a-button>
    </a-row>
  </div>
  <a-table
    size="large"
    :dataSource="dataSource"
    :columns="columns"
    :scroll="{ x: '100%', y: getTabH + 'px' }"
    :pagination="paginationConfig"
    bordered
    :loading="loading"
    @change="getChange"
  >
  <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'id'">
        <a-button
          type="link"
          @click="showDetail(record)"
          >{{ record.id }}</a-button
        >
        <CopyOutlined v-if="record.id" class="copyId"  @click="$copyId(record.id)" />
      </template>
      <template v-if="column.key === 'memberType'">
        {{ $t($getMapItem(memberTypeList, record.memberType)) }}
      </template>
      <template v-if="column.key === 'merchantName'">
        <a-tooltip v-if="record.merchantName">
          <template #title>{{ record.merchantName }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.merchantName }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
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
import { ref, reactive, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { currency, thousand } from "@/utils";
import { memberInfoAdminLevelList } from "@/api/userlevel.api";
import MemberDetail from "@/components/Member/memberDetail.vue";
import i18n from "@/i18n";
import { memberTypeList } from "@/utils/publicData";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const props  = defineProps(['mearchtData'])
const loading = ref(false);
const { t } = useI18n();
const detailModel = ref(false);
const detailId = ref<any>({});
const paginationConfig = reactive({
    pageSizeOptions: ["10","20","50","100"],
    showSizeChanger: true,
    total: 0,
    current: 1,
    pageSize: 20,
    showTotal: (total: any) => i18n.global.t("total", [total]),
  })
const query = ref<any>({
  pageNo: 1,
  pageSize: 20,
  memberId:null,
  level:props.mearchtData.level,
  merchantCode:props.mearchtData.merchantCode,
});
const dataSource = ref([]);

const columns:any = reactive([
  {
    title: t("c9"),
    dataIndex: "id",
    key: "id",
    align: "center",
  },
  {
    title: t('l92'),
    dataIndex: "merchantName",
    key: "merchantName",
    align: "center",
  },
  {
    title: t('m523'),
    dataIndex: "totalBalance",
    key: "totalBalance",
    align: "center",
  },
  {
    title: t('memberListC10'),
    dataIndex: "memberType",
    key: "memberType",
    align: "center",
  },
  {
    title: t('memberListC6'),
    dataIndex: "totalBuyCount",
    key: "totalBuyCount",
    align: "center",
  },
  {
    title: t('c3'),
    dataIndex: "totalBuyAmount",
    key: "totalBuyAmount",
    align: "center",
  },
  {
    title: t('memberListC8'),
    dataIndex: "totalSellCount",
    key: "totalSellCount",
    align: "center",
  },
  {
    title: t('memberListC9'),
    dataIndex: "totalSellAmount",
    key: "totalSellAmount",
    align: "center",
  },
  {
    title: t('remark'),
    dataIndex: "remark",
    key: "remark",
    align: "center",
  },
]);

const getList = async () => {
  loading.value = true;
  paginationConfig.current = query.value.pageNo;
  paginationConfig.pageSize = query.value.pageSize;
  const res: any = await memberInfoAdminLevelList(query.value).finally(()=> loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data.map((item: any)=> {
        item.totalBalance = currency(item.totalBalance, false);
        item.totalBuyAmount = currency(item.totalBuyAmount, false);
        item.totalSellAmount = currency(item.totalSellAmount, false);
        item.totalBuyCount = thousand(item.totalBuyCount);
        item.totalSellCount = thousand(item.totalSellCount);
        return item;
    })
    paginationConfig.total = res.total || 0;
  }
};
const resetQuery = ()=>{
  query.value = {
    pageNo: 1,
    pageSize: 20,
    memberId:null,
    level:props.mearchtData.level,
    merchantCode:props.mearchtData.merchantCode,
  };
  paginationConfig.current = 1;
  paginationConfig.pageSize = 20
  getList();
}
const getChange = (value: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  paginationConfig.current = current;
  paginationConfig.pageSize = pageSize
  getList();
};

const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value = { id, memberId };
  detailModel.value = true;
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped>
lable {
  display: inline-block;
  width: 100px;
}
:deep(th){
  border-radius: 0!important;
}
</style>
