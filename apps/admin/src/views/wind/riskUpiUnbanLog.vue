<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('n272')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.upiId"
          class="searchstyle"
          :placeholder="'UPI ID'"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.merchantCode"
          :placeholder="$t('m677')"
          :allowClear="true"
        >
          <a-select-option v-for="item in merchantList" :key="item.value" :value="item.value">{{ item.value }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.bankCode"
          :options="groupList"
          :placeholder="$t('m563')+$t('m582')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.status"
          :placeholder="$t('n1182')"
          :allowClear="true"
        >
          <a-select-option :value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option :value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.crateTimeStart" v-model:endTime="query.crateTimeEnd"  :title="$t('n1173')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.unbanTimeStart" v-model:endTime="query.unbanTimeEnd"  :title="$t('n1174')" :type="1"/>
      </a-col>
      <a-col>
        <a-button type="primary" :icon="h(SearchOutlined)" @click="getData(1)">{{
          $t("search")
        }}</a-button>
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <ExportButton
          :query="query"
          :api="collectionInfoAdminListUnbanLogPageExport"
          permission="admin:collectionInfoAdmin:listUnbanLogPageExport"
        />
        <!-- <a-button type="primary" :loading="loading" @click="exportList" v-permission="'admin:collectionInfoAdmin:listUnbanLogPageExport'">{{
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
    <template v-if="column.key === 'sellMemberId'">
      <a-button v-if="record.sellMemberId" type="link" class="copyContent" @click="showMember(record.sellMemberId)">{{
        record.sellMemberId
      }}</a-button>
      <CopyOutlined v-if="record.sellMemberId" class="copyId"  @click="$copyId(record.sellMemberId)" />
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'punishRuleNo'">
      {{ record.punishRuleNo?$t($getMapItem(punishRuleNoMap,record.punishRuleNo)) : '-' }}
    </template>
    <template v-if="column.key === 'createTime'">
      {{ record.createTime || '-' }}
    </template>
    <template v-if="column.key === 'unbanTime'">
      {{ record.unbanTime || '-' }}
    </template>
    <template v-if="column.key === 'merchantCode'">
      {{ record.merchantCode || '-' }}
    </template>
    <template v-if="column.key === 'status'">
      {{ record.status == 1 ? $t('yes') : $t('no') }}
    </template>
    <template v-if="column.key ==='upiId'">
      <a-tooltip v-if="record.upiId">
        <template #title>{{ record.upiId }}</template>
        <div class="toopTipStyle">
          {{ record.upiId }}
          <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key ==='bankCode'">
      <a-tooltip v-if="record.bankCode">
        <template #title>{{ record.bankCode }}</template>
        <div class="toopTipStyle">
          {{ record.bankCode }}
          <CopyOutlined v-if="record.bankCode" class="copyId"  @click="$copyId(record.bankCode)" />
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key ==='remark'">
      <a-tooltip v-if="record.remark">
        <template #title>{{ record.remark }}</template>
        <div class="toopTipStyle">
          {{ record.remark }}
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'action'">
        <!-- <a-popconfirm
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
        </a-popconfirm> -->
    </template>
  </template>
  </a-table>
<a-modal
  v-model:open="detailModel"
  :footer="null"
  wrap-class-name="full-modal"
  width="100%"
>
  <memberDetail
    v-if="detailModel"
    :memberID="detailId.memberId"
    :id="detailId.id"
  />
</a-modal>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h, computed } from "vue";
import { punishRuleNoMap } from "@/utils/publicData";
import {
  collectionInfoAdminKycUnbanLog,
} from "@/api/wind.api.ts";
import {
getKycBankCodeList,
} from "@/api/kycConfig.api";
import { collectionInfoAdminListUnbanLogPageExport } from "@/api/export";
import { useI18n } from "vue-i18n";
import { getStartAndEndOfDay, usePagination } from "@/plugins/dataMap";
import memberDetail from "@/components/Member/memberDetail.vue";
import { message } from "ant-design-vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useMerchantStore } from '@/stores/useMerchantStore';
import { status } from "nprogress";
const merchantStore = useMerchantStore();
const merchantList = computed(() => merchantStore.merchantList);
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
const extendData = ref({});
const query = ref({
asc: false,
column: '',
pageNo: 1,
pageSize: 20,
bankCode:undefined,
upiId:undefined,
memberId: undefined,
merchantCode: undefined,
status: undefined,
crateTimeStart: startIndiaTime,
crateTimeEnd: endIndiaTime,
unbanTimeStart: '',
unbanTimeEnd: '',
})
const detailModel = ref(false);
const detailId = ref({
id: 0,
memberId: 0,
});

const columns:any = [
{
  title: t("e47"),
  customRender:({index}:{index:any})=> index + 1,
  align: "center",
  width: 60,
},
{
  title: t('n272'),
  dataIndex: "sellMemberId",
  key: "sellMemberId",
  align: "center",
  width: 120,
},
{
  title: 'UPI ID',
  dataIndex: "upiId",
  key: "upiId",
  align: "center",
  width: 180,
},
{
  title: t('m677'),
  dataIndex: "merchantCode",
  key: "merchantCode",
  align: "center",
  width: 140,
},
{
  title: t('m582'),
  dataIndex: "bankCode",
  key: "bankCode",
  align: "center",
  width: 140,
},
{
  title: t('n1175'),
  dataIndex: "unbanAmount",
  key: "unbanAmount",
  align: "center",
  width: 120,
},
{
  title: t('n1173'),
  dataIndex: "createTime",
  key: "createTime",
  align: "center",
  width: 140,
},
{
  title: t('n1174'),
  dataIndex: "unbanTime",
  key: "unbanTime",
  align: "center",
  width: 140,
},
{
  title: t('n1182'),
  dataIndex: "status",
  key: "status",
  align: "center",
  width: 120,
},
{
  title: t('remark'),
  dataIndex: "remark",
  key: "remark",
  align: "center",
  width: 180,
},
// {
//   title: t("operation"),
//   dataIndex: "action",
//   key: "action",
//   width: 180,
//   align: "center",
//   fixed: 'right',
// },
];
const loading = ref(false);
const { paginationConfig } = usePagination();
const dataList = ref([]);
const getData = async (isFirst: any = null) => {
if(isFirst){
  query.value.pageNo = 1;
  paginationConfig.current = 1;
}
loading.value = true;
const res: any = await collectionInfoAdminKycUnbanLog(query.value).finally(()=>loading.value = false);
if (res) {
  dataList.value = res.data
  paginationConfig.total = res.total || 0;
  paginationConfig.pageSize = query.value.pageSize;
  paginationConfig.current = query.value.pageNo;
}
};

const resetQuery = () => {
query.value={
  asc: false,
  column: '',
  pageNo: 1,
  pageSize: 20,
  bankCode:undefined,
  upiId:undefined,
  memberId: undefined,
  merchantCode: undefined,
  status: undefined,
  crateTimeStart: '',
  crateTimeEnd: '',
  unbanTimeStart: '',
  unbanTimeEnd: '',
}
paginationConfig.pageSize = 20;
paginationConfig.current = 1;
getData();
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
paginationConfig.current = pag.current;
paginationConfig.pageSize = pag.pageSize;
query.value.pageNo = pag.current;
query.value.pageSize = pag.pageSize;
getData();
};
const showMember = (id: any) => {
detailModel.value = true;
detailId.value.id = id;
};
const exportList = async () => {
const data = JSON.parse(JSON.stringify(query.value));
loading.value = true;
const res: any = await collectionInfoAdminListUnbanLogPageExport(data).finally(() => {
  loading.value = false;
});
if (res.code == "1") {
  message.success(t("n545"));
}
};
const groupList = ref([])
const getGroupList = async () => {
const res: any = await getKycBankCodeList();
if (res && res.code === "1") {
groupList.value =res.data.map((item: any) => ({
  value: item,
  label: item,
}));
}
};
onMounted(() => {
getGroupList();
getData();
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