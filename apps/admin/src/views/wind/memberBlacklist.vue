<template>
    <div class="search">
      <h2>{{ $t('m453') }}</h2>
      <a-row>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.memberId"
            class="searchstyle"
            :placeholder="$t('p4')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.merchantMemberId"
            class="searchstyle"
            :placeholder="$t('pl2')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.memberAccount"
            class="searchstyle"
            :placeholder="$t('p5')"
          />
        </a-col>
        <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.merchantCode"
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
        <a-col>
          <a-button type="primary" :icon="h(SearchOutlined)" @click="getData(query,1)">{{
            $t("search")
          }}</a-button>
          <a-button type="primary" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
          <ExportButton
            :query="query"
            :api="memberBlackExport"
            permission="admin:memberBlack:export"
          />
          <!-- <a-button type="primary" :loading="loading" @click="exportList" v-permission="'admin:memberBlack:export'">{{
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
      <!-- <template v-if="column.key ==='changeType'">
        {{ changeType[record.changeType] }}
      </template> -->
      <template v-if="column.key === 'memberGroup'">
        {{
          groupList.find((item: any) => item.value === record.memberGroup)
          ?.label
        }}
      </template>
      <template v-if="column.key ==='status'">
        <span :class="record.status == 0 ? 'red' : 'green'">{{ statueMap[record.status] }}</span>
      </template>
      <template v-if="column.key ==='buyStatus'">
        <span :class="record.buyStatus == 0 ? 'red' : 'green'">{{ statueMap[record.buyStatus] }}</span>
      </template>
      <template v-if="column.key ==='sellStatus'">
        <span :class="record.sellStatus == 0 ? 'red' : 'green'">{{ statueMap[record.sellStatus] }}</span>
      </template>
      <template v-if="column.key ==='memberType'">
        {{ TypeText[record.memberType] }}
      </template>
      <template v-if="column.key === 'merchantMemberId'">
        <a-tooltip v-if="record.merchantMemberId">
          <template #title>
            {{ record.merchantMemberId }}
            <CopyOutlined v-if="record.merchantMemberId" class="copyId"  @click="$copyId(record.merchantMemberId)" />
          </template>
          <div class="toopTipStyle">
            {{ record.merchantMemberId }}
            <CopyOutlined v-if="record.merchantMemberId" class="copyId"  @click="$copyId(record.merchantMemberId)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'memberAccount'">
        <a-tooltip>
          <template #title>{{ record.memberAccount }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.memberAccount }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'action'">
          <a-popconfirm
              :title="$t('m455')"
              :description="$t('m456')"
              :ok-text="$t('yes')"
              :cancel-text="$t('no')"
              @confirm="remove(record)"
          >
          <a-tag
              style="cursor: pointer;color:#1677ff;border:1px solid #1677ff"
              size="small"
              v-permission="'admin:memberBlack:removeBlack'"
              >{{ $t("m454") }}
          </a-tag>
          </a-popconfirm>
      </template>
    </template>
    </a-table>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h, computed } from "vue";
// import {changeType} from "@/utils/publicData";
import {
  getMemberBlackAdmin,
  removeMemberBlackAdmin,
} from "@/api/wind.api.ts";
import { groupListApi } from '@/api/menber'
// import { getMerchantInfoAdminList } from "@/api/merchant.api"
import { memberBlackExport } from "@/api/export";
import { useI18n } from "vue-i18n";
import { usePagination } from "@/plugins/dataMap";
import { currency } from "@/utils";
import { message } from "ant-design-vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useMerchantStore } from "@/stores/useMerchantStore";
const merchantList = computed(() => useMerchantStore().merchantList);
const { getTabH } = useTabHeight();
const { t } = useI18n();
const extendData = ref({});
const query = ref({
  asc: true,
  column: '',
  id:null,
  memberId:undefined,
  memberAccount: undefined,
  merchantMemberId: undefined,
  merchantCode: undefined,
  pageNo: 1,
  pageSize: 20,
})
const columns:any = [
  {
    title: t("e47"),
    customRender:({index}:{index:any})=> index + 1,
    align: "center",
    width: 110,
  },
  {
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: t('l92'),
    dataIndex: "merchantName",
    key: "merchantName",
    align: "center",
    width: 140,
  },
  {
    title: t('m207'),
    dataIndex: "merchantMemberId",
    key: "merchantMemberId",
    align: "center",
    width: 160,
  },
  {
    title: t('c10'),
    dataIndex: "memberAccount",
    key: "memberAccount",
    align: "center",
    width: 180,
  },
  {
    title: t('memberListC4'),
    dataIndex: "memberGroup",
    key: "memberGroup",
    align: "center",
    width: 140,
  },
  {
    title: t('memberListC10'),
    dataIndex: "memberType",
    key: "memberType",
    align: "center",
    width: 140,
  },
  {
    title: t('memberListC11'),
    dataIndex: "realName",
    key: "realName",
    align: "center",
    width: 140,
  },
  {
    title: t('state'),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 140,
  },
  {
    title: t('memberListC15'),
    dataIndex: "buyStatus",
    key: "buyStatus",
    align: "center",
    width: 140,
  },
  {
    title: t('memberListC16'),
    dataIndex: "sellStatus",
    key: "sellStatus",
    align: "center",
    width: 140,
  },
  {
    title: t('l48'),
    dataIndex: "operator",
    key: "operator",
    align: "center",
    width: 140,
  },
  {
    title: t('l67'),
    dataIndex: "opTime",
    key: "opTime",
    align: "center",
    width: 170,
  },
  {
    title: t('remark'),
    dataIndex: "remark",
    key: "remark",
    align: "center",
    width: 240,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    width: 180,
    align: "center",
    fixed: 'right',
  },
];
const TypeText = ["", t("n180"), t("n181"), t("n96")];
const statueMap = <any>{
  0 : t('disabled'),
  1 : t('enabled'),
}
const groupList: any = ref([]);
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
  const res: any = await getMemberBlackAdmin(query).catch((err)=>{loading.value = false});
  if (res) {
    dataList.value = res.data
    // extendData.value = res.extend;
    paginationConfig.total = res.total || 0;
    if(!isChange.value){
      paginationConfig.current = query.pageNo;
    }
    isChange.value = false;
    loading.value = false;
  }else{
    loading.value = false;
  }
};

const getGroupList = async () => {
  const res: any = await groupListApi({
    pageNo: 1,
    pageSize: 10000,
  });
  if (res && res.code === "1") {
    groupList.value =
      res.data.map((item: any) => ({ value: item.id, label: item.name })) || [];
  }
};
// const searchDate = computed({
//   get: () => {
//     return [query.value.createTimeStart, query.value.createTimeEnd];
//   },
//   set: (val) => {
//     query.value.createTimeStart = val ? val[0] : "";
//     query.value.createTimeEnd = val ? val[1] : "";
//   },
// });
// const getNull = (value:any) => {
//   return value?value:'-';
// };
const remove = async (val:any) => {
  const { id, memberId} = val;
  const res: any = await removeMemberBlackAdmin({id, memberId});
  if(res){
    message.success(t('s10'));
    getData(query.value);
  }
}
const resetQuery = () => {
  query.value={
  asc: true,
  column: '',
  id:null,
  memberId:undefined,
  memberAccount: undefined,
  merchantMemberId: undefined,
  merchantCode: undefined,
  pageNo: 1,
  pageSize: 20,
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
    query.value.asc = '' as any;
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
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res = await memberBlackExport(data).finally(() => {
    loading.value = false;
  });
  if (res.code == "1") {
    message.success(t("n545"));
  }
};
onMounted(() => {
  // getMembetList();
  getData(query.value);
  getGroupList();
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