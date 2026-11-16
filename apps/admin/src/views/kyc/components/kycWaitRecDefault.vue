<template>
  <div class="search">
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.kycId"
          class="searchstyle"
          :placeholder="$t('m562')+'KYC ID'"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m150')"
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
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.upiId"
          :placeholder="$t('m562')+'UPI ID'"
        />
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.lastPullTimeStart" v-model:endTime="query.lastPullTimeEnd" :title="$t('m809')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search()"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <!-- <a-button type="primary" @click="exportList"     v-permission="'admin:paymentOrderAdmin:export'">{{
          $t("export")
        }}</a-button> -->
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="paginationConfig"
    :loading="loading"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        <a-button v-if="record.memberId" style="padding:0" type="link" @click="showMember(record.memberId)">{{
          record.memberId
        }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip v-if="record.upiId">
          <template #title>{{ record.upiId }}</template>
          <div class="toopTipStyle">
            <a-button v-if="record.upiId" type="link" @click="showUpi(record)">{{
              record.upiId
            }}</a-button>
          </div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <!-- <template v-if="column.key === 'createBy'">
        {{
          record.updateBy ? record.updateBy : record.createBy
        }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{
          record.updateTime ? record.updateTime : record.createTime
        }}
      </template> -->
    <template v-if="column.key === 'token'">
      <a-tooltip v-if="record.token" :overlayStyle="{ width: 'auto', maxWidth: 'none' }">
        <template #title>
          <div style="width: 440px;height: 200px;overflow-y: auto;">
            {{ record.token }}
          </div>
        </template>
        <div class=toopTipStyle3>
          {{ record.token }}
        </div>
      </a-tooltip>
      <div v-else>-</div>
    </template>
    <!-- <template v-if="column.key === 'failedReason'">
      <a-tooltip>
        <template #title>{{ record.failedReason }}</template>
        <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.failedReason }}</div>
      </a-tooltip>
    </template> -->
      <!-- <template v-if="column.key === 'orderStatus'">
        <a-tag>{{ $t(orderStatusMap[Number(record.orderStatus)]) }}</a-tag>
      </template> -->
      <!-- <template v-if="column.key === 'platformOrder'">
        <a-button type="link" @click="goAssemble(record.platformOrder)">
        {{ record.platformOrder }}</a-button>
      </template> -->
    <!-- <template v-if="column.key === 'remark'">
      <a-tooltip>
        <template #title>{{ record.remark }}</template>
        <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
      </a-tooltip>
    </template> -->
    <!-- <template v-if="column.key === 'isMatch'">
      <a-tag>
        <a-badge :color="[1,2].includes(record.isMatch)  ? 'green' : 'red'" />
        {{ $t(isMatchMap[record.isMatch]) }}
      </a-tag>
    </template> -->
    </template>
    <!-- <template #summary>
      <a-table-summary fixed="bottom">
        <a-table-summary-row>
          <a-table-summary-cell :col-span="8"> {{ $t("m54") }}</a-table-summary-cell>
          <a-table-summary-cell :col-span="1" align="center">
            <a-typography-text type="danger">{{ currency(extendData.amountPageTotal, false) }}</a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="5" />
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell :col-span="8">{{ $t("m55") }}</a-table-summary-cell>
          <a-table-summary-cell :col-span="1" align="center">
            <a-typography-text type="danger"> {{ currency(extendData.amountTotal, false) }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="5" />
        </a-table-summary-row>
      </a-table-summary>
    </template> -->
  </a-table>
  <!-- 会员详情 -->
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
  <!-- upi关联订单 -->
  <a-modal
    v-model:open="upiModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
  >
    <kycWaitRecWithUpi
      v-if="upiModel"
      :upiInfo="upiInfo"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { pendingKycListPage, getKycBankCodeList } from "@/api/kycConfig.api";
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import { getMerchantInfoAdminList } from "@/api/merchant.api";
import { currency } from "@/utils/index";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { paymentOrderAdminExport } from "@/api/export";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import memberDetail from "@/components/Member/memberDetail.vue";
import kycWaitRecWithUpi from "./kycWaitRecWithUpi.vue";
import { getStartAndEndOfDay, usePagination } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { paginationConfig } = usePagination();
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
const route = useRoute();
const detailModel = ref(false);
const merchantList = ref([]);
const dataSource = ref([]);
const extendData = ref<any>({});
const loading = ref(false);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const orderStatusMap:any = {
  1: 'm641',
  2: 'm642',
  3: 'm643',
}
const isMatchMap:any = {
  0: 'm697',
  1: 'm696',
  2: 'm806',
}
const query = ref({
  asc: true,
  column: "",
  pageNo: 1,
  pageSize: 20,
  bankCode: undefined,
  memberId: undefined,
  upiId: undefined,
  lastPullTimeStart:'',
  lastPullTimeEnd:'',
  kycId:undefined,
});
const columns:any = [
  {
    title: 'KYC ID',
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 180,
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: t("m582"),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 150,
  },
  {
    title: 'UPI ID',
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
  },
  {
    title: t("m810"),
    dataIndex: "pullTimes",
    key: "pullTimes",
    align: "center",
    width: 150,
  },
  {
    title: t("n413"),
    dataIndex: "successPullTimes",
    key: "successPullTimes",
    align: "center",
    width: 150,
  },
  {
    title: t("m809"),
    dataIndex: "lastPullTime",
    key: "lastPullTime",
    align: "center",
    width: 170,
  },
  {
    title: t("m224"),
    dataIndex: "putTime",
    key: "putTime",
    align: "center",
    width: 170,
  },
  {
    title: 'Token',
    dataIndex: "token",
    key: "token",
    align: "center",
    width: 240,
  },
];
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};
const getList = async () => {
  loading.value = true;
  const res: any = await pendingKycListPage(query.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data.map((item: any) => {
      item.amount = currency(item.amount, false);
      return item;
    });
    extendData.value = res.extend;
    paginationConfig.total = res.total;
    loading.value = false;
  }else{
    loading.value = false;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  paginationConfig.current = pag.current;
  paginationConfig.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList();
};
const search = () => {
  query.value.pageNo = 1;
  paginationConfig.current = 1;
  getList();
}
const resetQuery = () => {
  query.value = {
    asc: true,
    column: "",
    pageNo: 1,
    pageSize: 20,
    bankCode: undefined,
    memberId: undefined,
    upiId: undefined,
    lastPullTimeStart:'',
    lastPullTimeEnd:'',
    kycId:undefined,
  };
  paginationConfig.pageSize = 20;
  paginationConfig.current = 1;
  clearSelected();
  getList();
};

//upi关联订单
const upiModel = ref(false);
const upiInfo = ref({
  upiId: undefined,
});
const showUpi = (val: any) => {
  upiModel.value = true;
  upiInfo.value.upiId = val.upiId;
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
  getList();
  getTabH.value = useTabHeight(3,50).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.ant-picker-range-separator) {
  display: none;
}
:deep(.windActive){
  font-weight: 600;
  color: red;
}
</style>
