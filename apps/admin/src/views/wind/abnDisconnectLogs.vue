<template>
    <div class="search">
      <h2>{{ $getMenuName() }}</h2>
      <a-row>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.memberId"
            class="searchstyle"
            :placeholder="$t('c9')"
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
            show-search
            v-model:value="query.bankCode"
            :options="groupList"
            :placeholder="$t('m563')+$t('m582')"
            :allowClear="true"
          >
          </a-select>
        </a-col>
        <!-- <a-col :span="3">
          <a-select
            allowClear
            v-model:value="query.changeReason"
            :placeholder="$t('n277')"
            class="searchstyle"
            :options="Object.entries(kycLinkStatusChangeReasonMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
          ></a-select>
        </a-col> -->
        <a-col>
          <timeRange v-model:startTime="query.createTimeGe" v-model:endTime="query.createTimeLe"  :title="$t('n1343')" :type="1"/>
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
          :api="disConnectMonitorAdminExport"
          permission="admin:disConnectMonitorAdmin:export"
        />
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
      <template v-if="column.key === 'memberId'">
        <a-button v-if="record.memberId" type="link" class="copyContent" @click="showMember(record.memberId)">{{
          record.memberId
        }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'level'">
        <span>L</span>{{ record.level }}
      </template>
      <template v-if="column.key === 'memberType'">
        {{ record.memberType?$t($getMapItem(memberTypeList,record.memberType)) : '-' }}
      </template>
      <template v-if="column.key ==='changeReason'">
        <a-tooltip v-if="record.changeReason">
          <template #title>
            {{ record.changeReason?$t($getMapItem(kycLinkStatusChangeReasonMap,record.changeReason)) : '-' }}
          </template>
          <div class="toopTipStyle">
            {{ record.changeReason?$t($getMapItem(kycLinkStatusChangeReasonMap,record.changeReason)) : '-' }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key ==='kycId'">
        <a-tooltip>
          <template #title>
            <div class="tableText">
              UPI ID:
              {{ record.upiId || '-' }}
            </div>
            <div class="tableText">
              KYC ID:
              {{ record.kycId || '-' }}
            </div>
            <div class="tableText">
              {{ $t('n328') }}:
              {{ record.phoneNumber || '-' }}
            </div>
          </template>
          <div class="toopTipStyle tableText">
            UPI ID:
            {{ record.upiId || '-' }}
            <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />
          </div>
          <div class="toopTipStyle tableText">
            KYC ID:
            {{ record.kycId || '-' }}
            <CopyOutlined v-if="record.kycId" class="copyId"  @click="$copyId(record.kycId)" />
          </div>
          <div class="toopTipStyle tableText">
            {{ $t('n328') }}:
            {{ record.phoneNumber || '-' }}
            <CopyOutlined v-if="record.phoneNumber" class="copyId"  @click="$copyId(record.phoneNumber)" />
          </div>
        </a-tooltip>
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
      <template v-if="column.key === 'orderAmount'">
        {{ record.orderAmount != null ? currency(record.orderAmount,false) : '-' }}
      </template>
      <template v-if="column.key === 'buyOrderNo'">
        {{ record.buyOrderNo || '-' }}
      </template>
      <template v-if="column.key === 'lastConnectTime'">
        {{ record.lastConnectTime || '-' }}
      </template>
      <template v-if="column.key === 'keepAliveTime'">
        {{ record.keepAliveTime || '-' }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || '-' }}
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
import { punishRuleNoMap,kycLinkStatusChangeReasonMap,memberTypeList } from "@/utils/publicData";
import {
  disConnectMonitorAdminLog,
  getKycBankCodeList,
  disConnectMonitorAdminExport,
} from "@/api";
import { useI18n } from "vue-i18n";
import { currency, formatTime } from "@/utils/index";
import { getStartAndEndOfDay, usePagination } from "@/plugins/dataMap";
import memberDetail from "@/components/Member/memberDetail.vue";
import { message } from "ant-design-vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
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
  phoneNumber: undefined,
  changeReason: undefined,
  createTimeGe: startIndiaTime,
  createTimeLe: endIndiaTime,
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
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 120,
  },
  {
    title: t('m491'),
    dataIndex: "level",
    key: "level",
    align: "center",
    width: 160,
  },
  {
    title: t('memberListC10'),
    dataIndex: "memberType",
    key: "memberType",
    align: "center",
    width: 140,
  },
  {
    title: t('l90'),
    dataIndex: "buyOrderNo",
    key: "buyOrderNo",
    align: "center",
    width: 240,
  },
  {
    title: t('n42'),
    dataIndex: "orderAmount",
    key: "orderAmount",
    align: "center",
    width: 160,
  },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 140,
  },
  {
    title: t('m907'),
    dataIndex: "kycId",
    key: "kycId",
    align: "center",
    width: 240,
  },
  {
    title: t('n1341'),
    dataIndex: "lastConnectTime",
    key: "lastConnectTime",
    align: "center",
    width: 140,
  },
  {
    title: t('n1342')+'('+t('s')+')',
    dataIndex: "keepAliveTime",
    key: "keepAliveTime",
    align: "center",
    width: 140,
  },
  {
    title: t('n1343'),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 140,
  },
  {
    title: t('n1344'),
    dataIndex: "changeReason",
    key: "changeReason",
    align: "center",
    width: 180,
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
  const res: any = await disConnectMonitorAdminLog(query.value).finally(()=>loading.value = false);
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
    phoneNumber: undefined,
    changeReason: undefined,
    createTimeGe: '',
    createTimeLe: '',
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
  const res: any = await upiRiskControlLogAdminExport(data).finally(() => {
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