<template>
  <div class="search">
    <countDown :title="$getMenuName()" @zero="getList()" />
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.memberId"
          :placeholder="$t('m562')+$t('c9')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.memberAccount"
          :placeholder="$t('m562')+$t('c10')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.platformOrder"
          :placeholder="$t('m562')+$t('m896')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.address"
          :placeholder="$t('m562')+$t('userUSDTaddress')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          v-model:value="query.memberType"
          :options="Object.entries(memberTypeList).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
          :placeholder="$t('p52')"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
            class="searchstyle"
            v-model:value="query.status"
            :options="
            Object.entries(usdSellOrderStatus).map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
            :placeholder="$t('m563')+$t('n51')"
            :allowClear="true"
          >
          </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
            class="searchstyle"
            v-model:value="query.thirdTradeOrderStatus"
            :options="
            Object.entries(usdSellTradeStatus).map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
            :placeholder="$t('m563')+$t('三方交易状态')"
            :allowClear="true"
          >
          </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
            class="searchstyle"
            v-model:value="query.callbackStatus"
            :options="
            Object.entries(usdSellCallbackStatus).map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
            :placeholder="$t('m563')+$t('n53')"
            :allowClear="true"
          >
          </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.operator"
          :placeholder="$t('m562')+$t('l48')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.operatorIp"
          :placeholder="$t('m562')+$t('m911')"
        />
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('l95')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.operationTimeStart" v-model:endTime="query.operationTimeEnd" :title="$t('l67')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          >{{ $t('search') }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{ $t('reset') }}</a-button>
        <ExportButton
          :query="query"
          :api="usdtSellOrderAdminExport"
          :enable-export-fields="true"
          permission="admin:usdtSellOrderAdmin:export"
        />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:usdtSellOrderAdmin:export'"
          >{{ $t("export") }}</a-button
        > -->
        <a-button @click="openDrawer">{{ $t("m741") }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="dynamicColumns"
    :key="tableKey"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' ,y : getTabH+'px' }"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberType'">
        {{ record.memberType ? $t( memberTypeList[record.memberType]) : "-"}}
      </template>
      <template v-if="column.key === 'status'">
        <a-tag>{{ $t(usdSellOrderStatus[Number(record.status)]) }}</a-tag>
      </template>
      <template v-if="column.key === 'callbackStatus'">
        <a-tag v-if="record.callbackStatus">{{ $t(usdSellCallbackStatus[Number(record.callbackStatus)]) }}</a-tag>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'thirdTradeOrderStatus'">
        <a-tag v-if="record.thirdTradeOrderStatus">{{ $t(usdSellTradeStatus[Number(record.thirdTradeOrderStatus)]) }}</a-tag>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'memberId'">
        <a-button type="link" style="padding: 0;" @click="showMember(record.memberId)">{{ record.memberId }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'memberAccount'">
        <a-tooltip>
          <template #title>{{ record.memberAccount }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.memberAccount }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'usdtAddr'">
        <a-tooltip>
          <template #title>{{ record.usdtAddr }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.usdtAddr }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'callbackTime'">
        {{ record.callbackTime || "-" }}
      </template>
      <template v-if="column.key === 'operationTime'">
        {{ record.operationTime || "-" }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || "-" }}
      </template>
      <template v-if="column.key === 'completionTime'">
        {{ record.completionTime || "-" }}
      </template>
      <template v-if="column.key === 'operatorIp'">
        <a-tooltip>
          <template #title>{{ record.operatorIp }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.operatorIp }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'thirdPartyResponseMessage'">
        <a-tooltip v-if="record.thirdPartyResponseMessage">
          <template #title>{{ record.thirdPartyResponseMessage }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.thirdPartyResponseMessage  }}</div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip v-if="record.remark">
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark || "-" }}</div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'operate'">
          <!-- 通过 -->
        <a-popconfirm
          :title=" $t('m483') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="passOrder(record.platformOrder)"
          :loading="loading"
        >
          <a-tag
            v-if="record.status == '18'"
            v-permission="'admin:usdtSellOrderAdmin:approveUsdtSellOrder'"
            color="rgba(14, 186, 139, 1)"
            style="cursor: pointer"
            size="small"
            >{{ $t("m483") }}
          </a-tag>
        </a-popconfirm>
        <!-- 不通过 -->
        <a-popconfirm
          :title=" $t('m484') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="rejectOrder(record.platformOrder)"
          :loading="loading"
        >
          <a-tag
            v-if="record.status == '18'"
            v-permission="'admin:usdtSellOrderAdmin:rejectUsdtSellOrder'"
            color="rgba(253, 11, 26, 1)"
            style="cursor: pointer"
            size="small"
            >{{ $t("m484") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="dynamicColumns"
        :firstColumnLabel="'memberId'"
        />
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :title="$t('paid')" :footer="null">
    <a-divider />
    <div>
      <p>{{ $t("t30") }}</p>
      <a-input-number
        v-model:value="query2.usdtActualNum"
        :min="0"
        :precision="2"
        class="searchstyle"
        :placeholder="$t('p33')"
      />
      <p v-if="!query2.usdtActualNum" style="color: rgb(255, 0, 0)">
        please input a number
      </p>
    </div>
    <br />
    <div>{{ $t("t24") }}</div>
    <br />
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button type="primary" :disabled="!query2.usdtActualNum" @click="ustdBOrderPay(query2.id)"
        >{{ $t('b28') }}</a-button
      >
      <a-button style="margin-left: 10px" @click="closedalog">{{ $t('b10') }}</a-button>
    </div>
    </div>
  </a-modal>
  <a-modal v-model:open="addDialog2" :footer="null">
    <div>
      <h2 style="font-size: 18px; margin: 10px 0">{{ $t('n72') }}</h2>
      <div style="text-align: left">
        <div
          style="
            margin: 5px auto;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: left;
          "
        >
          <a-textarea
            v-model:value="query2.remark"
            :placeholder="$t('p42')"
            :rows="4"
          />
        </div>
      </div>
      <div
        style="
          display: flex;
          justify-content: center;
          color: #9d9d9d;
          margin: 10px 0;
        "
      >
        <a-button type="primary" @click="unpaidUsdtBuyOrderRecord(query2.id)"
          >{{ $t('b28') }}</a-button
        >
      </div>
    </div>
  </a-modal>
  <a-modal
    v-model:open="openDetail"
    :title="$t('rechargeDetail')"
    width="fit-content"
    :footer="null"
    @cancel="closeDetail"
  >
    <usdtBOrderInfo />
  </a-modal>
  <a-modal v-model:open="detailModel" :footer="null" wrap-class-name="full-modal" width="100%">
    <memberDetail v-if="detailModel" :memberID="detailId.memberId" :id="detailId.id" />
  </a-modal>
   <!-- 列表筛选 -->
  <PublicColumnFilter
    v-model:open="drawerVisible"
    v-model:value="selectedColumns"
    :columns="columns"
    v-model:defaultColumns="defaultColumns"
    :title="$t('n36')"
    :menuId="menuId"
    v-if="drawerVisible"
  />
</template>
<script lang="ts" setup>
// import dayjs from "dayjs";
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { memberTypeList, usdSellOrderStatus, usdSellCallbackStatus, usdSellTradeStatus } from "@/utils/publicData";
import usdtBOrderInfo from "@/components/orderManagement/detail.vue";
import {
  getUstdBuyOrderListPage,
  ustdBuyOrderNoPay,
  ustdBuyOrderPay,
  getUstdSellOrderListPage,
  approveUsdtSellOrder,
  rejectUsdtSellOrder,
} from "@/api/order.api";
import { usdtSellOrderAdminExport } from "@/api/export"
import { message } from "ant-design-vue";
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import memberDetail from "@/components/Member/memberDetail.vue";
import { currency, thousand } from "@/utils/index";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTableColumnDrawer } from "@/hooks/index";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
const { getTabH } = useTabHeight(1);
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
const dataSource = ref([]);
const extendData = ref<any>({});
const loading = ref(false);
const addDialog = ref(false);
const addDialog2 = ref(false);
const detailModel = ref(false);
const query2 = ref({
  id: 0,
  usdtActualNum:"",
  remark: "",
});
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      usdtActualNum: extendData.value.usdtNumPageTotal,
      arbActualNum: extendData.value.arbNumPageTotal,
    },
  },
  {
    label: t("m55"),
    fields: {
      usdtActualNum: extendData.value.usdtNumTotal,
      arbActualNum: extendData.value.arbNumTotal,
    },
  },
]);
const showUstdBuyOrderPay = async (value: any) => {
  selectedRow();
  const { id } = value;
  query2.value.id = id;
  addDialog.value = true;
};
const detailId = ref({
  id: 0,
  memberId: 0,
});
const orderStatusMap = {
  3: t('e1'),
  4: t('n86'),
  7: t('n82'),
  13: t('e2'),
  10: t('n90'),
}
const query = ref({
  asc: true,
  column: undefined,
  pageNo: 1,
  pageSize: 20,
  memberId: undefined,
  merchantCode: undefined,
  merchantName: undefined,
  address: undefined,
  memberAccount: undefined,
  platformOrder: undefined,
  status: undefined,
  memberType: undefined,
  operator: undefined,
  operatorIp: undefined,
  callbackStatus: undefined,
  thirdTradeOrderStatus: undefined,
  operationTimeStart: '',
  operationTimeEnd: '',
  createTimeEnd: endIndiaTime,
  createTimeStart: startIndiaTime,
});

const columns:any = [
  // {
  //   title: t('e47'),
  //   dataIndex: "index",
  //   key: "index",
  //   align: "center",
  //   width: 110,
  //   customRender:({index}:{index:any})=> index + 1
  // },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    isRequired: true,
    align: "center",
    width: 110,
  },
  {
    title: t("c10"),
    dataIndex: "memberAccount",
    key: "memberAccount",
    isRequired: true,
    align: "center",
    width: 180,
  },
  {
    title: t("memberListC10"),
    dataIndex: "memberType",
    key: "memberType",
    isRequired: true,
    align: "center",
    width: 160,
  },
  {
    title: t("m896"),
    dataIndex: "platformOrder",
    key: "platformOrder",
    align: "center",
    width:240,
  },
  {
    title: t("userUSDTaddress"),
    dataIndex: "usdtAddr",
    key: "usdtAddr",
    align: "center",
    width:240,
  },

  {
    title: t("n74"),
    dataIndex: "usdtActualNum",
    key: "usdtActualNum",
    width:200,
    align: "center",
  },
  {
    title: t("m897"),
    dataIndex: "arbActualNum",
    key: "arbActualNum",
    width:200,
    align: "center",
  },
  {
    title: t("n51"),
    dataIndex: "status",
    key: "status",
    width:120,
    align: "center",
  },
  {
    title: t("m912"),
    dataIndex: "thirdTradeOrderStatus",
    key: "thirdTradeOrderStatus",
    width:140,
    align: "center",
  },
  {
    title: t("n53"),
    dataIndex: "callbackStatus",
    key: "callbackStatus",
    width:140,
    align: "center",
  },
  {
    title: t("n49"),
    dataIndex: "callbackTime",
    key: "callbackTime",
    width:170,
    align: "center",
  },
  {
    title: t("l48"),
    dataIndex: "operator",
    key: "operator",
    width:120,
    align: "center",
  },
  {
    title: t("l67"),
    dataIndex: "operationTime",
    key: "operationTime",
    width:170,
    align: "center",
  },
  {
    title: t("m911"),
    dataIndex: "operatorIp",
    key: "operatorIp",
    width:120,
    align: "center",
  },
  {
    title: t("l95"),
    dataIndex: "createTime",
    key: "createTime",
    width:170,
    align: "center",
  },
  {
    title: t("l39"),
    dataIndex: "completionTime",
    key: "completionTime",
    width:170,
    align: "center",
  },
  {
    title: t("m910"),
    dataIndex: "thirdPartyResponseMessage",
    key: "thirdPartyResponseMessage",
    width:240,
    align: "center",
  },
  {
    title: t("m414"),
    dataIndex: "remark",
    key: "remark",
    width:240,
    align: "center",
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    width:160,
    fixed: 'right',
  },
];
const {
  menuId,
  defaultColumns,
  selectedColumns,
  dynamicColumns,
  drawerVisible,
  openDrawer,
  tableKey,
} = useTableColumnDrawer(columns);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async (isFirst: any = null) => {
  if(isFirst){
    query.value.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  pagination.value.pageSize = query.value.pageSize;
  pagination.value.current = query.value.pageNo;
  const res: any = await getUstdSellOrderListPage(query.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data.list;
    extendData.value = res.data.extend || {};
    pagination.value.total = res.data.total;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageSize = pag.pageSize;
  query.value.pageNo = pag?.current;
  getList();
};
const showUsdtBuyOrderModal = async (value: any) => {
  selectedRow();
  const { id } = value;
  query2.value.id = id;
  query2.value.remark = "";
  addDialog2.value = true;
};
const goPool = (id: any)=> {
  router.push({path:'/order/matchingPool/index', query: { id }})
}
const goAssemble = (id: any)=> {
  router.push({path:'/order/assemble/index', query: { withdraw: id }})
}
const unpaidUsdtBuyOrderRecord = async (value: any) => {
  query2.value.id = value;
  const res: any = await ustdBuyOrderNoPay(query2.value);
  if (res && res.code === "1") {
    addDialog2.value = false;
    message.success(t('s10'));
    getList();
    query2.value.remark = "";
  }
};
const { getDetail } = getUsdtBuyOrderInfo();
const openDetail = ref(false);
const detailObj = ref<any>({});

const checkDetail = (value: any) => {
  selectedRow();
  const { id } = value;
  getDetail({ id });
  openDetail.value = true;
  detailObj.value = value;
};

const closeDetail = () => {
  openDetail.value = false;
}
const showMember = (id: any)=>{
  detailModel.value = true;
  detailId.value.id = id;
}
const ustdBOrderPay = async (value: any) => {
  query2.value.id = value;
  const res: any = await ustdBuyOrderPay(query2.value);
  if (res && res.code === "1") {
    addDialog.value = false;
    message.success(t('s10'));
    getList();
  }
};
const closedalog = () => {
  addDialog.value = false;
};
const searchDate = computed({
  get: () => {
    return [query.value.createTimeStart, query.value.createTimeEnd];
  },
  set: (val) => {
    query.value.createTimeStart = val ? val[0] : "";
    query.value.createTimeEnd = val ? val[1] : "";
  },
});

const resetQuery = () => {
  query.value = {
    asc: true,
    column: undefined,
    pageNo: 1,
    pageSize: 20,
    memberId: undefined,
    merchantCode: undefined,
    merchantName: undefined,
    address: undefined,
    memberAccount: undefined,
    platformOrder: undefined,
    status: undefined,
    memberType: undefined,
    operator: undefined,
    operatorIp: undefined,
    callbackStatus: undefined,
    thirdTradeOrderStatus: undefined,
    operationTimeStart: '',
    operationTimeEnd: '',
    createTimeEnd: '',
    createTimeStart: '',
  };
  pagination.value.current = 1;
  pagination.value.pageSize = 20;
  getList();
  clearSelected();
};
// 通过
const passOrder = async (value: any) => {
  loading.value = true;
  const res: any = await approveUsdtSellOrder({platformOrder:value}).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    message.success(t('s10'));
    getList();
  }
}
// 拒绝
const rejectOrder = async (value: any) => {
  loading.value = true;
  const res: any = await rejectUsdtSellOrder({platformOrder:value}).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    message.success(t('s10'));
    getList();
  }
}
const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res: any = await usdtSellOrderAdminExport(data).finally(() => loading.value = false);
  if(res && res.code == '1'){
    message.success(t('n545'));
  }
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped></style>
