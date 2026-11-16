<template>
    <div class="search">
      <tipTemplate :title="$t('n294')" :info="tipInfoText" />
      <a-row>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.memberId"
            class="searchstyle"
            :placeholder="$t('n295')"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            class="searchstyle"
            v-model:value="query.merchantName"
            :placeholder="$t('p26')"
            :allowClear="true"
            :show-search="true"
          >
            <a-option
              v-for="item in merchantList"
              :key="item.code"
              :value="item.username"
              >{{ item.username }}</a-option
            >
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            class="searchstyle"
            show-search
            :placeholder="$t('memberListC15')"
            v-model:value="query.buyStatus"
          >
            <a-select-option :value="0">{{ $t('disabled') }}</a-select-option>
            <a-select-option :value="1">{{ $t('enabled') }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            class="searchstyle"
            show-search
            :placeholder="$t('memberListC14')"
            v-model:value="query.onlineStatus"
          >
            <a-select-option :value="1">{{ $t('online') }}</a-select-option>
            <a-select-option :value="0">{{ $t('offline') }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            class="searchstyle"
            show-search
            :placeholder="$t('n304')"
            v-model:value="query.hitType"
          >
            <a-select-option value="A1">A1</a-select-option>
            <a-select-option value="A2">A2</a-select-option>
            <a-select-option value="A3">A3</a-select-option>
            <a-select-option value="A4">A4</a-select-option>
            <a-select-option value="A5">A5</a-select-option>
            <a-select-option value="A6">A6</a-select-option>
            <a-select-option value="A7">A7</a-select-option>
            <a-select-option value="A8">A8</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <a-button type="primary" :icon="h(SearchOutlined)" @click="getData(query,1)">{{
            $t("search")
          }}</a-button>
          <a-button type="primary" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
          <ExportButton
            :query="query"
            :api="riskUserHitRecordAdminExport"
            permission="admin:riskUserHitRecordAdmin:export"
          />
          <!-- <a-button type="primary" @click="exportList" :loading="loading" v-permission="'admin:riskUserHitRecordAdmin:export'">{{
            $t("export")
          }}</a-button> -->
        </a-col>
      </a-row>
    </div>
    <a-table
      :dataSource="dataList"
      :columns="columns"
      :pagination="paginationConfig"
      :scroll="{ x: '100%' ,y : getTabH + 'px'}"
      :loading="loading"
      @change="handleTableChange"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'buyerId'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record)"
          >{{ record.buyerId }}</a-button
        >
        <CopyOutlined v-if="record.buyerId" class="copyId"  @click="$copyId(record.buyerId)" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'merchantName'">
        <a-tooltip v-if="record.merchantName">
          <template #title>{{ record.merchantName }}</template>
          <div class="toopTipStyle">{{ record.merchantName }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'buyStatus'">
        <a-tag v-if="record.buyStatus == 0 || 1" :style="record.buyStatus == 1 ? 'color:green' : 'color:red'">
          {{ record.buyStatus == 1 ? $t('enabled') : $t('disabled') }}
        </a-tag>
        <a-tag v-else>-</a-tag>
      </template>
      <template v-if="column.key === 'onlineStatus'">
        <a-tag v-if="record.onlineStatus == 0 || 1" :style="record.onlineStatus == 1 ? 'color:green' : 'color:red'">
          {{ record.onlineStatus == 1 ? $t('online') : $t('offline') }}
        </a-tag>
        <a-tag v-else>-</a-tag>
      </template>
      <template v-if="column.key === 'firstHitType'">
        {{ record.firstHitType || '-' }}
      </template>
      <template v-if="column.key === 'firstHitTime'">
        {{ record.firstHitTime || '-' }}
      </template>
      <template v-if="column.key === 'secondHitType'">
        {{ record.secondHitType || '-' }}
      </template>
      <template v-if="column.key === 'secondHitTime'">
        {{ record.secondHitTime || '-' }}
      </template>
      <template v-if="column.key === 'thirdHitType'">
        {{ record.thirdHitType || '-' }}
      </template>
      <template v-if="column.key === 'thirdHitTime'">
        {{ record.thirdHitTime || '-' }}
      </template>
      <template v-if="column.key === 'hitCount'">
        {{ record.hitCount || '-' }}
      </template>
      <template v-if="column.key === 'punishment'">
        <a-tooltip v-if="record.punishment">
          <template #title>{{ record.punishment }}</template>
          <div class="tableText toopTipStyle2">{{ record.punishment }}</div>
        </a-tooltip>
        <span v-else>-</span>
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
import { onMounted, ref, h, computed, nextTick, onUnmounted } from "vue";
import {
  riskUserHitRecordAdminList,
} from "@/api/wind.api.ts";
import { riskUserHitRecordAdminExport } from '@/api/export'
import { getMerchantInfoAdminList } from "@/api/merchant.api"
import MemberDetail from "@/components/Member/memberDetail.vue";
import tipTemplate from "@/components/Other/tipTemplate.vue";
import { useI18n } from "vue-i18n";
import { usePagination } from "@/plugins/dataMap";
import { currency } from "@/utils";
import { message } from "ant-design-vue";
import { QuestionCircleOutlined, LeftOutlined } from "@ant-design/icons-vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useMerchantStore } from "@/stores/useMerchantStore";
const merchantList = computed(() => useMerchantStore().merchantList);
const { getTabH } = useTabHeight();
const { t } = useI18n();
const query = ref({
  asc: true,
  column: '',
  pageNo: 1,
  pageSize: 20,
  memberId: undefined,
  merchantName: undefined,
  buyStatus: undefined,
  onlineStatus: undefined,
  hitType: undefined,
})
const detailModel = ref(false);
const detailId = ref<any>({});
const showDetail = async (value: any) => {
  const { id, buyerId } = value;
  detailId.value = { id: buyerId, memberId:buyerId };
  detailModel.value = true;
};
const tipInfoText = [
  t('n305'),
  t('n306'),
  t('n307'),
  t('n308'),
  t('n309'),
  t('n310'),
  t('n311'),
  'A8 '+t('n457')+'。',
]
const columns:any = [
  {
    title: t("e47"),
    customRender:({index}:{index:any})=> index + 1,
    align: "center",
    width: 70,
  },
  {
    title: t('n295'),
    dataIndex: "buyerId",
    key: "buyerId",
    align: "center",
    width: 120,
  },
  {
    title: t('n39'),
    dataIndex: "merchantName",
    key: "merchantName",
    align: "center",
    width: 140,
  },
  {
    title: t('memberListC15'),
    dataIndex: "buyStatus",
    key: "buyStatus",
    align: "center",
    width: 100,
  },
  {
    title: t('memberListC14'),
    dataIndex: "onlineStatus",
    key: "onlineStatus",
    align: "center",
    width: 100,
  },
  {
    title: t('n296'),
    dataIndex: "firstHitType",
    key: "firstHitType",
    align: "center",
    width: 120,
  },
  {
    title: t('n297'),
    dataIndex: "firstHitTime",
    key: "firstHitTime",
    align: "center",
    width: 150,
  },
  {
    title: t('n298'),
    dataIndex: "secondHitType",
    key: "secondHitType",
    align: "center",
    width: 120,
  },
  {
    title: t('n299'),
    dataIndex: "secondHitTime",
    key: "secondHitTime",
    align: "center",
    width: 150,
  },
  {
    title: t('n300'),
    dataIndex: "thirdHitType",
    key: "thirdHitType",
    align: "center",
    width: 120,
  },
  {
    title: t('n301'),
    dataIndex: "thirdHitTime",
    key: "thirdHitTime",
    align: "center",
    width: 150,
  },
  {
    title: t('n302'),
    dataIndex: "hitCount",
    key: "hitCount",
    align: "center",
    width: 140,
  },
  {
    title: t('n303'),
    dataIndex: "punishment",
    key: "punishment",
    align: "center",
    width: 180,
  },
];
const groupList = ref([]);
const loading = ref(false);
const { paginationConfig } = usePagination();
const dataList = ref([]);
// const memberList=ref<any>([]);
const isChange = ref(false)
// const getMembetList = async () => {
//   const res: any = await getMerchantInfoAdminList({pageNo:1,pageSize:10000});
//   if (res){
//     const uniqueValues = new Set(res.data.map(item => item.username));
//     memberList.value = Array.from(uniqueValues).map(value => ({ value }));
//   }
// }
const getData = async (query: any, isFirst: any = null) => {
  if(isFirst){
    query.pageNo = 1;
    paginationConfig.current = 1;
  }
  loading.value = true;
  paginationConfig.pageSize = query.pageSize;
  paginationConfig.current = query.pageNo;
  const res: any = await riskUserHitRecordAdminList(query).catch((err)=>{loading.value = false});
  if (res && res.code == '1') {
    dataList.value = res.data
    // extendData.value = res.extend;
    paginationConfig.total = res.total || 0;
    loading.value = false;
  }
};

const resetQuery = () => {
  query.value={
  asc: true,
  column: '',
  pageNo: 1,
  pageSize: 20,
  memberId: undefined,
  merchantName: undefined,
  buyStatus: undefined,
  onlineStatus: undefined,
  hitType: undefined,
}
  paginationConfig.pageSize = 20;
  paginationConfig.current = 1;
  getData(query.value);
};
const columnVal=ref("");
const sortVal=ref("");
const handleTableChange: any = (pag: { pageSize: number; current: number },filters:any, sorter:any) => {
  paginationConfig.current = pag.current;
  paginationConfig.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  const { columnKey, order } = sorter;
  if(columnVal.value === columnKey){
    paginationConfig.current = pag.current;
      query.value.pageNo = pag.current;
    if(sortVal.value!=order){
      paginationConfig.current = 1;
      query.value.pageNo = 1;
    }
  }else{
    if(order) {
      paginationConfig.current = 1;
      query.value.pageNo = 1;
    }
  }
  if(order==undefined){
    query.value.asc = '';
    query.value.column = '';
    columnVal.value = "";
    sortVal.value = "";
    isChange.value = false;
  }else{
    query.value.column = columnKey;
    columnVal.value = columnKey;
    sortVal.value = order;
    query.value.asc = Boolean(order === "ascend");
    isChange.value = true;
    // paginationConfig.current = 1;
  }
  getData(
    Object.assign({}, query.value, {
      pageSize: pag.pageSize,
    })
  );
};
const exportList = async () => {
  loading.value = true;
  const res: any = await riskUserHitRecordAdminExport(query.value).finally(()=>loading.value = false);
  if(res && res.code == '1') {
    message.success(t('n545'));
  }
};

onMounted(() => {
  // getMembetList();
  getData(query.value);
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.green){
  color: green;
}
:deep(.red){
  color: red;
}
</style>