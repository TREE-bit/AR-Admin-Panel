<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.platformOrderNo"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('n47')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.thirdOrderNo"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('n864')"
        />
      </a-col>
      <a-col :span="3">
        <!-- <a-input v-trim
          v-model:value="query.thirdCode"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('n878')"
        /> -->
        <a-select
          v-model:value = "query.thirdCode"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('n878')"
          :options="thirdCodeList"
        >

        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.orderStatus"
          :placeholder="$t('m563')+$t('n51')"
          :options="Object.keys(channelOrderStatusMap).map(key => ({ label: channelOrderStatusMap[key], value: key }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.orderFlag"
          :placeholder="$t('m563')+$t('n927')"
          :options="Object.keys(orderFlagMap).map(key => ({ label: orderFlagMap[key], value: key }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.callbackStatus"
          :placeholder="$t('m563')+$t('n53')"
          :options="Object.keys(channelCallbackStatusMap).map(key => ({ label: channelCallbackStatusMap[key], value: key }))"
        >
        </a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.orderTimeGe" v-model:endTime="query.orderTimeLe"
        :title="$t('l95')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.callbackTimeGe" v-model:endTime="query.callbackTimeLe"
        :title="$t('n49')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.accountChangeTimeGe" v-model:endTime="query.accountChangeTimeLe"
        :title="$t('m70')" :type="1"/>
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
        <ExportButton
          :query="query"
          :api="channelCollectionOrderListPageForExport"
          permission="admin:channelCollectionOrderAdmin:listPageForExport"
        />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:channelCollectionOrderAdmin:listPageForExport'"
          >{{ $t("export") }}</a-button> -->
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
      <!-- <template v-if="column.key === 'serviceSystemName'"  >
      {{ record.serviceSystemName }}
      </template> -->
      <template v-if="column.key === 'buyerId'">
        <a-button v-if="isUnicodeDigits(record.buyerId)" type="link" class="copyContent" @click="showMember(record.buyerId)">{{
          record.buyerId
        }}</a-button>
      </template>
      <template v-if="column.key === 'thirdCode'">
        <a-tooltip>
          <template #title>{{ record.thirdCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.thirdCode }}</div>
        </a-tooltip>
      </template>
      <!-- <template v-if="column.key === 'thirdOrderNo'">
        <a-tooltip>
          <template #title>{{ record.thirdOrderNo }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.thirdOrderNo }}</div>
        </a-tooltip>
      </template> -->
      <template v-if="column.key === 'platformOrderNo'">
        <a-tooltip>
          <template #title>
            <div>
              {{ $t('n930') }}：
              {{ record.platformOrderNo }}
            </div>
            <div>
              {{ $t('n879') }}：
              {{ record.thirdOrderNo }}
            </div>
          </template>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('n930') }}：
            </div>
            <div class="tableText">
              <span v-if="record.platformOrderNo" style="color: #1890ff;cursor: pointer;"
               @click="goPath(record.receiveMethod,record.platformOrderNo)">
                {{ record.platformOrderNo }}</span>
            </div>
          </div>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('n879') }}：
            </div>
            <div class="tableText">
              {{ record.thirdOrderNo }}
            </div>
          </div>
        </a-tooltip>
      </template>
      <!-- <template v-if="column.key === 'orderAmount'">
        <div class="tableGridBox">
          <div>{{ $t('m903') }}:</div>
          <div>{{ record.orderAmount || '-' }}</div>
        </div>
        <div class="tableGridBox">
          <div>{{ $t('m904') }}:</div>
          <div>{{ record.actualAmount || '-' }}</div>
        </div>
        <div class="tableGridBox">
          <div>{{ $t('n928') }}:</div>
          <div>{{ record.buyerKycAmount || '-' }}</div>
        </div>
        <div class="tableGridBox">
          <div>{{ $t('n929') }}:</div>
          <div>{{ record.callbackAmount || '-' }}</div>
        </div>
      </template> -->
      <template v-if="column.key === 'orderAmount'">
        {{ record.orderAmount || '-' }}
      </template>
      <template v-if="column.key === 'actualAmount'">
        {{ record.actualAmount || '-' }}
      </template>
      <template v-if="column.key === 'buyerKycAmount'">
        {{ record.buyerKycAmount || '-' }}
      </template>
      <template v-if="column.key === 'callbackAmount'">
        {{ record.callbackAmount || '-' }}
      </template>
      <template v-if="column.key === 'accountChangeTime'">
        {{ record.accountChangeTime || '-' }}
      </template>
      <template v-if="column.key === 'callbackStatus'">
        {{ $getMapItem(channelCallbackStatusMap,record.callbackStatus) }}
      </template>
      <template v-if="column.key === 'orderStatus'">
        {{ $getMapItem(channelOrderStatusMap,record.orderStatus) }}
      </template>
      <template v-if="column.key === 'successType'">
        <a-tooltip v-if="record.successType">
          <template #title>{{ $getMapItem(channelCollectSuccessTypeMap,record.successType) }}</template>
          <div class="toopTipStyle2">{{ $getMapItem(channelCollectSuccessTypeMap,record.successType) }}</div>
        </a-tooltip>
        <span v-else>{{ $t('n892') }}</span>
      </template>
      <template v-if="column.key === 'orderFlag'">
        <div v-if="record.orderFlag" class="toopTipStyle2"
          :style="[1,2,3,4].includes(Number(record.orderFlag)) ? 'color:green' : 'color:red'"
        >
          {{ $getMapItem(orderFlagMap,record.orderFlag) }}
        </div>
        <span v-else>-</span>
      </template>
      <!-- <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
      </template> -->
      <template v-if="column.key === 'createTime'"  >
      {{ record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'callbackTime'"  >
      {{ record.callbackTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <!-- 回调日志 -->
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showDialog(record)"
          >{{ $t("n915") }}
        </a-tag> 
        
        <!-- <a-popconfirm
          :title=" $t('t16') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record)"
        >
         <a-tag
          :color="'rgba(253, 11, 26, 1)'"
          style="cursor: pointer"
          size="small"
          v-permission="'admin:kycBankAdmin:deleteKycBank'"
          >{{ $t('b11') }}
        </a-tag>
        </a-popconfirm> -->
      </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'createTime'"
        />
    </template>
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
    <!-- 回调日志 -->
    <a-modal
      v-model:open="logModel"
      :footer="null"
      wrap-class-name="full-modal"
      width="100%"
    >
      <channelCollectionLog
        v-if="logModel"
        :orderNo="orderNo"
      />
    </a-modal>
</template>
<script lang="ts" setup>
import { channelCollectionOrderAdminList,thirdPayInfoAdminListPage } from "@/api/channel.api";
import { channelCollectionOrderListPageForExport } from "@/api/export";
import { onMounted, ref, h, toRefs, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { usePagination } from "@/plugins/dataMap";
import channelCollectionLog from "./components/channelCollectionLog.vue"
import { channelOrderStatusMap, channelCallbackStatusMap,channelCollectSuccessTypeMap } from "@/utils/publicData"
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import router from "@/router";
import { message } from "ant-design-vue";
// import { useRoute } from 'vue-router'
// import { useThirdCode } from "@/stores/useThirdCode";
// const { thirdCodeList } = toRefs(useThirdCode());
// const route = useRoute();
const thirdCodeList = ref([]);
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
// const { paginationConfig } = usePagination();
const { getTabH } = useTabHeight(1);
const { t } = useI18n();
const detailModel = ref(false);
  const detailId = ref({
    id: 0,
    memberId: 0,
  });
const query= ref({
  pageNo:1,
  pageSize:20,
  callbackStatus:undefined,
  orderStatus:undefined,
  orderFlag:undefined,
  supportsBuyAppeal:undefined,
  thirdCode:undefined,
  platformOrderNo:undefined,
  thirdOrderNo:undefined,
  successType:undefined,
  callbackTimeGe: '',
  callbackTimeLe: '',
  orderTimeGe:startIndiaTime,
  orderTimeLe:endIndiaTime,
  accountChangeTimeGe: '',
  accountChangeTimeLe: '',
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
})
const orderFlagMap:any = {
  1: t('n918'),//通过回调成功
  2: t('n919'),//拉取到买方UTR自动成功
  3: t('n920'),//人工操作成功
  4: t('n921'),//确认超时时自动查询成功
  5: t('n922'),//支付超时失败
  6: t('n923'),//买家取消
  7: t('n924'),//确认超时自动取消
  8: t('n925'),//人工操作失败
  9: t('n926'),//低于KYC最低金额失败
  // 10: t('n932'),//拉取买方UTR失败后自动失败订单
};
const columns:any = [
  {
    title: t('l95'),
    dataIndex: "createTime",
    key: "createTime",
    width:140,
    align:"center"
  },
  {
    title: t('n878'),
    dataIndex: "thirdCode",
    key: "thirdCode",
    width:160,
    align:"center"
  },
  {
    title: t('c9'),
    dataIndex: "buyerId",
    key: "buyerId",
    width:160,
    align:"center",
  },
  {
    title: t('l90'),
    dataIndex: "platformOrderNo",
    key: "platformOrderNo",
    width:240,
    // ellipsis: true,
    align:"center",
  },
  // {
  //   title: t('n864'),
  //   dataIndex: "thirdOrderNo",
  //   key: "thirdOrderNo",
  //   width:200,
  //   align:"center"
  // },
  {
    title: t('n42'),
    dataIndex: "orderAmount",
    key: "orderAmount",
    width:120,
    align:"center"
  },
  {
    title: t('n43'),
    dataIndex: "actualAmount",
    key: "actualAmount",
    width:120,
    align:"center"
  },
  {
    title: t('n916'),
    dataIndex: "buyerKycAmount",
    key: "buyerKycAmount",
    width:120,
    align:"center"
  },
  {
    title: t('n917'),
    dataIndex: "callbackAmount",
    key: "callbackAmount",
    width:120,
    align:"center"
  },
  {
    title: t('n51'),
    dataIndex: "orderStatus",
    key: "orderStatus",
    width:120,
    align:"center"
  },
  {
    title: t('n927'),
    dataIndex: "orderFlag",
    key: "orderFlag",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1045")),
    dataIndex: "cost",
    key: "cost",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n49")),
    dataIndex: "callbackTime",
    key: "callbackTime",
    width:140,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n53")),
    dataIndex: "callbackStatus",
    key: "callbackStatus",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("m70")),
    dataIndex: "accountChangeTime",
    key: "accountChangeTime",
    width:140,
    align:"center"
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    width:140,
    align:"center",
    fixed: 'right',
  },
];
// const extendData = ref<any>({});
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      orderAmount: extendData.value.pageOrderAmountSum,
      actualAmount: extendData.value.pageActualAmountSum,
      cost: extendData.value.pageCostSum,
    },
  },
  {
    label: t("m55"),
    fields: {
      orderAmount: extendData.value.totalOrderAmountSum,
      actualAmount: extendData.value.totalActualAmountSum,
      cost: extendData.value.totalCostSum,
    },
    fixedPositions: {
      amount: 5,
    },
  },
]);
// const loading = ref(false);
// const dataSource = ref([]);
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
  api: channelCollectionOrderAdminList,
  defaultPageSize: 20,
  resDataType: 2,
  filterRules: [],
  // afterFetch: (data) =>
  // data.map((item: any) => {
  //   item.usdtNum = thousand(item.usdtNum);
  //   item.arbNum = thousand(item.arbNum);
  //   return item;
  // }),
});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async () => {
//   loading.value=true;
//   paginationConfig.current = query.value.pageNo;
//   paginationConfig.pageSize = query.value.pageSize;
  
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
//   const res: any = await channelCollectionOrderAdminList(query.value).finally(()=>loading.value=false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data.list;
//     extendData.value = res.data.extend;
//     paginationConfig.total = res.data.total;
//     query.value.nextColValue = res.data.extend?.nextColValue;
//     query.value.nextCursorId = res.data.extend?.nextCursorId;
//     query.value.prevColValue = res.data.extend?.prevColValue;
//     query.value.prevCursorId = res.data.extend?.prevCursorId;
//     paginationConfig.current = query.value.pageNo;
//     paginationConfig.pageSize = query.value.pageSize;
//     oldPageNo.value = query.value.pageNo;
//     pageCurrent.value = Math.ceil(res.data.total/query.value.pageSize);
//     clearSelected();
//   }
// };
// const getforData = async ()=>{
//   const res: any = await channelCollectionOrderAdminList(query.value);
//   if(res.code == 1){
//     query.value.nextColValue = res.data.extend?.nextColValue;
//     query.value.nextCursorId = res.data.extend?.nextCursorId;
//     query.value.prevColValue = res.data.extend?.prevColValue;
//     query.value.prevCursorId = res.data.extend?.prevCursorId;
//   }
// }
// const resetPageQuery = ()=>{
//     query.value.direction = '';
//     query.value.nextColValue = '';
//     query.value.nextCursorId = '';
//     query.value.prevColValue = '';
//     query.value.prevCursorId = '';
// }
const isUnicodeDigits = (str:any) => {
  return /^\p{Nd}+$/u.test(str);
}
const showMember = (id: any) => {
    detailModel.value = true;
    detailId.value.id = id;
  };
const search = () => {
  // paginationConfig.current = 1;
  // query.value.pageNo = 1;
  getList(1)
}
// const resetQuery = () => {
//   query.value = {
//     pageNo:1,
//     pageSize:20,
//     callbackStatus:undefined,
//     orderStatus:undefined,
//     orderFlag:undefined,
//     supportsBuyAppeal:undefined,
//     thirdCode:undefined,
//     platformOrderNo:undefined,
//     thirdOrderNo:undefined,
//     successType:undefined,
//     callbackTimeGe: '',
//     callbackTimeLe: '',
//     orderTimeGe:'',
//     orderTimeLe:'',
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   paginationConfig.pageSize = 20;
//   paginationConfig.current =1;
//   getList();
// };


// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//     if(pag.pageSize != paginationConfig.pageSize){
//       query.value.pageNo = 1;
//       paginationConfig.current = 1;
//     }else{
//       query.value.pageNo = pag.current;
//       paginationConfig.current = pag.current;
//     }
//   paginationConfig.pageSize = pag.pageSize;
//   query.value.pageSize = pag.pageSize;
//   getList()
// };

// 回调日志
const logModel = ref(false);
const orderNo = ref('');
const showDialog = (record: any) => {
  logModel.value = true;
  orderNo.value = record.platformOrderNo
};
// 路由跳转
const hasPro = (path: string) => {
  const name = path.split('/').join('_')
  return router.hasRoute(name)
}
const goPath = (receiveMethod:any,orderNo: any,)=>{
  const goMap = [
    {name:'_order_buyOrder_index', query: {buyOrderNo: orderNo}},
    {name:'_order_usdtBuyOrder_index', query: {platformOrder: orderNo}},
  ];
  if(receiveMethod == 1 && hasPro('/order/buyOrder/index')){
    router.push(goMap[0])
  }else if(receiveMethod == 3 && hasPro('/order/usdtBuyOrder/index')){
    router.push(goMap[1])
  }else{
    return;
  }
}

const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res: any = await channelCollectionOrderListPageForExport(data).finally(()=>loading.value = false);
  if(res && res.code == '1'){
    message.success(t("n545"));
  }
}
const getThirdCode = async ()=>{
  const res:any = await thirdPayInfoAdminListPage({pageNo:1,pageSize:999});
  if(res.code == '1'){
      thirdCodeList.value = res.data.list.map((item:any)=>{
        return {
          value: item.thirdCode,
          label: item.thirdName
        }
      })
  }
}
onMounted(() => {
  getThirdCode();
  getList();
  getTabH.value = useTabHeight(1).getTabH.value;
});

</script>

<style lang="less" scoped>
</style>
