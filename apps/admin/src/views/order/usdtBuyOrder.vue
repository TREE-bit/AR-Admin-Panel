<template>
  <div class="search">
    <countDown :title="$getMenuName()" @zero="getList()" />
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.memberId"
          :placeholder="$t('p4')"
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
          allowClear
          class="searchstyle"
          v-model:value="query.networkProtocol"
          :options="Object.entries(networkProtocolMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
          :placeholder="$t('n1776')"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.platformOrder"
          :placeholder="$t('p14')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
            class="searchstyle"
            v-model:value="query.status"
            :options="
            Object.entries(orderStatusMap).map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
            :placeholder="$t('p43')"
            :allowClear="true"
          >
          </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
            class="searchstyle"
            v-model:value="query.callbackStatus"
            :options="
            Object.entries(usdtBuyCallbackStatus).map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
            :placeholder="$t('m563')+$t('n53')"
            :allowClear="true"
          >
          </a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('l95')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.callbackTimeStart" v-model:endTime="query.callbackTimeEnd" :title="$t('l39')" :type="1"/>
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
          :api="usdtBuyOrderAdminExport"
          :enable-export-fields="true"
          permission="admin:usdtBuyOrderAdmin:export"
        />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:usdtBuyOrderAdmin:export'"
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
      <template v-if="column.key === 'networkProtocol'">
        {{ $t($getMapItem(networkProtocolMap,record.networkProtocol) || '-') }}
      </template>
      <template v-if="column.key === 'status'">
        <a-tag>{{ $t($getMapItem(orderStatusMap,Number(record.status))) }}</a-tag>
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
      <template v-if="column.key === 'callbackStatus'">
        <a-tag v-if="record.callbackStatus">{{ $t(usdtBuyCallbackStatus[Number(record.callbackStatus)]) }}</a-tag>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'usdtBuyReward'">
        {{ record.usdtBuyReward || 0 }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || "-" }}
      </template>
      <template v-if="column.key === 'callbackTime'">
        {{ record.callbackTime || "-" }}
      </template>
      <template v-if="column.key === 'updateBy'">
        {{ record.updateBy || "-" }}
      </template>
      <template v-if="column.key === 'updateTime'">
        {{ record.updateTime || "-" }}
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
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'operate'">
        <!-- 已支付 -->
        <a-tag
          v-if="record.status === '4'"
          color="rgba(253, 164, 11, 1)"
          style="cursor: pointer"
          size="small"
          @click="showUstdBuyOrderPay(record)"
          v-permission="'admin:usdtBuyOrderAdmin:pay'"
          >{{ $t("s11") }}
        </a-tag>
        <!-- 未支付 -->
       <a-tag
          v-if="record.status === '4'"
          color="rgba(253, 11, 26, 1)"
          style="cursor: pointer"
          size="small"
          @click="showUsdtBuyOrderModal(record)" 
          v-permission="'admin:usdtBuyOrderAdmin:nopay'"
          >{{ $t("n37") }}
        </a-tag>
        <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="checkDetail(record)"
          v-permission="'admin:usdtBuyOrderAdmin:getInfo'"
          >{{ $t("b23") }}
        </a-tag>
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
import { memberTypeList,usdtBuyCallbackStatus } from "@/utils/publicData";
import usdtBOrderInfo from "@/components/orderManagement/detail.vue";
import {
  getUstdBuyOrderListPage,
  ustdBuyOrderNoPay,
  ustdBuyOrderPay,
} from "@/api/order.api";
import { usdtBuyOrderAdminExport } from "@/api/export"
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
import { useRoute } from 'vue-router'
const route = useRoute();
const { getTabH } = useTabHeight(1);
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
// const dataSource = ref([]);
// const extendData = ref<any>({});
// const loading = ref(false);
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
      usdtNum: extendData.value.usdtNumPageTotal,
      arbNum: extendData.value.arbNumPageTotal,
    },
  },
  {
    label: t("m55"),
    fields: {
      usdtNum: extendData.value.usdtNumTotal,
      arbNum: extendData.value.arbNumTotal,
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
const orderStatusMap:any = {
  3: t('e1'),
  4: t('n86'),
  7: t('n82'),
  13: t('e2'),
  10: t('n90'),
}
const networkProtocolMap: any = {
  "TRC20": 'TRON',
  'BEP20': 'BNB Smart Chain'
}
const query = ref({
  asc: false,
  arbNum: "",
  createTimeEnd: endIndiaTime,
  createTimeStart: startIndiaTime,
  callbackTimeStart: '',
  callbackTimeEnd: '',
  memberType: undefined,
  networkProtocol: undefined,
  memberAccount: "",
  memberId: "",
  merchantCode: "",
  pageNo: 1,
  pageSize: 20,
  platformOrder: route.query.platformOrder || "",
  status: undefined,
  updateBy: "",
  usdtAddr: "",
  usdtNum: "",
  callbackStatus: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
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
    width: 180,
  },
  {
    title: t("c10"),
    dataIndex: "memberAccount",
    key: "memberAccount",
    align: "center",
    width: 180,
  },
  {
    title: t("memberListC10"),
    dataIndex: "memberType",
    key: "memberType",
    align: "center",
    width: 160,
  },
  {
    title: t("m467"),
    dataIndex: "platformOrder",
    key: "platformOrder",
    align: "center",
    width:240,
  },
  {
    title: t("n1776"),
    dataIndex: "networkProtocol",
    key: "networkProtocol",
    align: "center",
    width:160,
  },
  {
    title: t("n73"),
    dataIndex: "usdtAddr",
    key: "usdtAddr",
    align: "center",
    width:240,
  },

  {
    title: t("n74"),
    dataIndex: "usdtNum",
    key: "usdtNum",
    isRequired: true,
    width:200,
    align: "center",
  },
  {
    title: t("n75"),
    dataIndex: "arbNum",
    key: "arbNum",
    isRequired: true,
    width:200,
    align: "center",
  },
  {
    title: t("e6"),
    dataIndex: "usdtBuyReward",
    key: "usdtBuyReward",
    width:140,
    align: "center",
  },
  {
    title: t("n51"),
    dataIndex: "status",
    key: "status",
    width:160,
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
    title: t("n53"),
    dataIndex: "callbackStatus",
    key: "callbackStatus",
    width:160,
    align: "center",
  },
  {
    title: t("n49"),
    dataIndex: "callbackTime",
    key: "callbackTime",
    width:170,
    align: "center",
  },
  // {
  //   title: t("l48"),
  //   dataIndex: "updateBy",
  //   key: "updateBy",
  //   width:120,
  //   align: "center",
  // },
  // {
  //   title: t("l67"),
  //   dataIndex: "updateTime",
  //   key: "updateTime",
  //   width:170,
  //   align: "center",
  // },
  {
    title: t("m910"),
    dataIndex: "thirdPartyResponseMessage",
    key: "thirdPartyResponseMessage",
    width:240,
    align: "center",
  },
  {
    title: t("remark"),
    dataIndex: "remark",
    key: "remark",
    width:240,
    align: "center",
  },
  // {
  //   title: t("operation"),
  //   dataIndex: "operate",
  //   key: "operate",
  //   align: "center",
  //   width:240,
  //   fixed: 'right',
  // },
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
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const {
  dataSource,
  pagination,
  extendData,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: getUstdBuyOrderListPage,
  defaultPageSize: 20,
  filterRules: [],
  afterFetch: (data) =>
  data.map((item: any) => {
    item.usdtNum = thousand(item.usdtNum);
    item.arbNum = thousand(item.arbNum);
    return item;
  }),
});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (isFirst: any = null) => {
//   if(isFirst){
//     query.value.pageNo = 1;
//     pagination.value.current = 1;
//   }
//   loading.value = true;
  
//     const queryPageNo = query.value.pageNo;
//     queryCount.value = queryPageNo - oldPageNo.value;
//     if(query.value.pageNo == 1){
//       query.value.firstPage = true;
//       query.value.lastPage = false;
//       resetPageQuery();
//     }else if(query.value.pageNo == pageCurrent.value){
//       query.value.firstPage = false;
//       query.value.lastPage = true;
//       resetPageQuery();
//     }else if(queryCount.value > 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'next';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }else if(queryCount.value <= 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'prev';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }
//   const res: any = await getUstdBuyOrderListPage(query.value).finally(()=>loading.value = false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data.map((item: any) => {
//       item.usdtNum = thousand(item.usdtNum);
//       item.arbNum = thousand(item.arbNum);
//       return item;
//     });
//     extendData.value = res.extend;
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//     pagination.value.total = res.total;
//     pagination.value.current = query.value.pageNo;
//     pagination.value.pageSize = query.value.pageSize;
//     oldPageNo.value = query.value.pageNo;
//     pageCurrent.value = Math.ceil(res.total/query.value.pageSize);
//   }
// };
// const getforData = async ()=>{
//   const res: any = await getUstdBuyOrderListPage(query.value);
//   if(res.code == 1){
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//   }
// }
// const resetPageQuery = ()=>{
//     query.value.direction = '';
//     query.value.nextColValue = '';
//     query.value.nextCursorId = '';
//     query.value.prevColValue = '';
//     query.value.prevCursorId = '';
// }
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//     if(pag.pageSize != pagination.value.pageSize){
//       query.value.pageNo = 1;
//       pagination.value.current = 1;
//     }else{
//       query.value.pageNo = pag.current;
//       pagination.value.current = pag.current;
//     }
//   pagination.value.pageSize = pag.pageSize;
//   query.value.pageSize = pag.pageSize;

//   getList();
// };
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

// const resetQuery = () => {
//   query.value = {
//     asc: false,
//     arbNum: "",
//     createTimeEnd: "",
//     createTimeStart: "",
//     callbackTimeStart: '',
//     callbackTimeEnd: '',
//     memberType: undefined,
//     memberAccount: "",
//     memberId: "",
//     merchantCode: "",
//     pageNo: 1,
//     pageSize: 20,
//     platformOrder: "",
//     status: undefined,
//     updateBy: "",
//     usdtAddr: "",
//     usdtNum: "",
//     callbackStatus: undefined,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   pagination.value.current = 1;
//   pagination.value.pageSize = 20;
//   getList();
//   clearSelected();
// };
const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res: any = await usdtBuyOrderAdminExport(data).finally(() => {
    loading.value = false;
  });
  if (res && res.code == '1'){
    message.success(t('n545'));
  }
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped></style>
