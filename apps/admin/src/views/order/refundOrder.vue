<template>
    <div class="search">
      <h2>{{ $t("m637") }}</h2>
      <a-row>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.memberId"
            class="searchstyle"
            :placeholder="$t('m562')+$t('p4')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.merchantMemberId"
            class="searchstyle"
            :placeholder="$t('m562')+$t('m207')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.merchantCode"
            class="searchstyle"
            :placeholder="$t('m562')+$t('n9')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            v-model:value="query.platformOrder"
            :placeholder="$t('p25')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.merchantOrder"
            class="searchstyle"
            :placeholder="$t('m562')+$t('l96')"
          />
        </a-col>
        <!-- <a-col :span="3">
          <a-select
            class="searchstyle"
            v-model:value="query.merchantName"
            :options="merchantList"
            :placeholder="$t('p26')"
            :allowClear="true"
          >
          </a-select>
        </a-col> -->
        <!-- <a-col :span="3">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="query.riskTag"
            :placeholder="$t('m468')"
          >
            <a-select-option
              v-for="(item, key) in windControl"
              :value="key"
              :key="item"
              >{{ $t(item) }}</a-select-option
            >
          </a-select>
        </a-col> -->
        <!-- <a-col :span="3">
          <a-input v-trim
            v-model:value="query.matchOrder"
            class="searchstyle"
            :placeholder="$t('e13')"
          />
        </a-col> -->
        <a-col :span="3">
          <a-select
            class="searchstyle"
            allowClear
            :placeholder="$t('m562')+$t('m640')"
            v-model:value="query.orderStatus"
            :options="
              Object.entries(orderStatusMap).map(([key, value]:[any,any]) => ({
                value: key,
                label: $t(value),
              }))
            "
          >
          </a-select>
        </a-col>
        <!-- <a-col :span="6">
          <a-range-picker
            class="searchstyle"
            show-time
            v-model:value="searchDate"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            :placeholder="[$t('m65'), $t('m172')]"
          />
        </a-col> -->
      <a-col >
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('m172')" :type="1"/>
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
      :scroll="{ x: '100%' , y : getTabH+'px'}"
      @change="handleTableChange"
      bordered
      :row-key="(record: any) => JSON.stringify(record)"
    >
      <template #bodyCell="{ column, record }">
        <!-- <template v-if="column.key === 'matchDuration'">
          {{ record.matchDuration ? formatTime(record.matchDuration) : "--" }}
        </template> -->
        <template v-if="column.key === 'memberId'">
          <a-button type="link" class="copyContent" @click="showMember(record.memberId)">{{
            record.memberId
          }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
        </template>
        <template v-if="column.key === 'createBy'">
          {{
            record.updateBy ? record.updateBy : record.createBy
          }}
        </template>
        <template v-if="column.key === 'createTime'">
          {{
            record.updateTime ? record.updateTime : record.createBy
          }}
        </template>
      <template v-if="column.key === 'failedReason'">
        <a-tooltip>
          <template #title>{{ record.failedReason }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.failedReason }}</div>
        </a-tooltip>
      </template>
        <template v-if="column.key === 'orderStatus'">
          <a-tag>{{ $t(orderStatusMap[Number(record.orderStatus)]) }}</a-tag>
        </template>
        <template v-if="column.key === 'platformOrder'">
          <a-button type="link" class="copyContent" @click="goAssemble(record.platformOrder)">
          {{ record.platformOrder }}</a-button>
          <CopyOutlined v-if="record.platformOrder" class="copyId"  @click="$copyId(record.platformOrder)" />
        </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
      </template>
      </template>
      <template #summary>
        <SummaryBottom 
          :summaryRows="summaryRows"
          :dynamicColumns="dynamicColumns"
          :firstColumnLabel="'id'"
          />
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
  import { onMounted, ref, h, computed } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import { cashBackOrderAdminListPage } from "@/api/order.api";
  import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
  // import { getMerchantInfoAdminList } from "@/api/merchant.api";
  import { currency, thousand } from "@/utils/index";
  import { useI18n } from "vue-i18n";
  import router from "@/router";
  import { useRoute } from "vue-router";
  import { paymentOrderAdminExport } from "@/api/export";
  import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
  import memberDetail from "@/components/Member/memberDetail.vue";
  import { getStartAndEndOfDay } from "@/plugins/dataMap";
  import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
  import { useTableColumnDrawer } from "@/hooks/index";
  import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
  import SummaryBottom from "@/components/Other/SummaryBottom.vue";
// import { useMerchantStore } from "@/stores/useMerchantStore";
// const merchantList = computed(() => useMerchantStore().merchantList);
  const { getTabH } = useTabHeight(1);
  const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
  const { t } = useI18n();
  const route = useRoute();
  const detailModel = ref(false);
  // const merchantList = ref([]);
  // const dataSource = ref([]);
  // const extendData = ref<any>({});
  // const loading = ref(false);
  const detailId = ref({
    id: 0,
    memberId: 0,
  });
  const orderStatusMap:any = {
    1: 'm641',
    2: 'm642',
    3: 'm643',
  }
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      amount: extendData.value.amountPageTotal,
    },
  },
  {
    label: t("m55"),
    fields: {
      amount: extendData.value.amountTotal,
    },
  },
]);

  const query = ref({
    asc: false,
    column: "",
    endTime: endIndiaTime,
    startTime: startIndiaTime,
    memberId: "",
    merchantCode: "",
    merchantMemberId: "",
    merchantOrder: "",
    orderStatus: undefined,
    platformOrder: "" as any,
    pageNo: 1,
    pageSize: 20,
    firstPage: true,
    lastPage:false,
    direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
    nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
    nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
    prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
    prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
  });
  const columns:any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 100,
    },
    {
      title: t("c9"),
      dataIndex: "memberId",
      key: "memberId",
      align: "center",
      isRequired: true,
      width: 180,
    },
    {
      title: t("n9"),
      dataIndex: "merchantCode",
      key: "merchantCode",
      align: "center",
      isRequired: true,
      width: 150,
    },
    {
      title: t("m207"),
      dataIndex: "merchantMemberId",
      key: "merchantMemberId",
      isRequired: true,
      align: "center",
      width: 150,
    },
    {
      title: t("l92"),
      dataIndex: "merchantName",
      key: "merchantName",
      isRequired: true,
      align: "center",
      width: 150,
    },
    {
      title: t("l96"),
      dataIndex: "merchantOrder",
      key: "merchantOrder",
      align: "center",
      width: 240,
    },
    {
      title: t("n47"),
      dataIndex: "platformOrder",
      key: "platformOrder",
      align: "center",
      width: 240,
    },
    {
      title: t("m640"),
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
      width: 150,
    },
    {
      title: t("n42"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: 150,
    },
    {
      title: t("m638"),
      dataIndex: "failedReason",
      key: "failedReason",
      align: "center",
      width: 200,
    },
    {
      title: t("m639"),
      dataIndex: "failedTime",
      key: "failedTime",
      align: "center",
      width: 180,
    },

    {
      title: t("l48"),
      dataIndex: "createBy",
      key: "createBy",
      align: "center",
      width: 150,
    },
    {
      title: t("l50"),
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 180,
    },
    {
      title: t("remark"),
      dataIndex: "remark",
      key: "remark",
      align: "center",
      width: 200,
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
  // const pagination = ref({
  //   total: 0,
  //   current: 1,
  //   pageSize: 20,
  //   showSizeChanger: true,
  //   showTotal: (total: any) => t("total", [total]),
  // });
  const showMember = (id: any) => {
    detailModel.value = true;
    detailId.value.id = id;
  };
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
    api: cashBackOrderAdminListPage,
    defaultPageSize: 20,
    filterRules: [],
    afterFetch: (data) =>
    data.map((item: any) => {
      item.amount = currency(item.amount, false);
      return item;
    }),
  });
  // const oldPageNo = ref(0);
  // const pageCurrent = ref(0);
  // let queryCount = ref(0);
  // const getList = async () => {
  //   loading.value = true;
  //   const queryPageNo = query.value.pageNo;
  //   queryCount.value = queryPageNo - oldPageNo.value;
  //   if(query.value.pageNo == 1){
  //     query.value.firstPage = true;
  //     query.value.lastPage = false;
  //     resetPageQuery();
  //   }else if(query.value.pageNo == pageCurrent.value){
  //     query.value.firstPage = false;
  //     query.value.lastPage = true;
  //     resetPageQuery();
  //   }else if(queryCount.value > 0){
  //     query.value.firstPage = false;
  //     query.value.lastPage = false;
  //     query.value.direction = 'next';
  //     for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
  //       await getforData();
  //     }
  //   }else if(queryCount.value <= 0){
  //     query.value.firstPage = false;
  //     query.value.lastPage = false;
  //     query.value.direction = 'prev';
  //     for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
  //       await getforData();
  //     }
  //   }
  //   const res: any = await cashBackOrderAdminListPage(query.value).catch((err)=>loading.value = false);
  //   if (res && res.code === "1") {
  //     dataSource.value = res.data.map((item: any) => {
  //       item.amount = currency(item.amount, false);
  //       return item;
  //     });
  //     extendData.value = res.extend;
  //     query.value.nextColValue = res.extend?.nextColValue;
  //     query.value.nextCursorId = res.extend?.nextCursorId;
  //     query.value.prevColValue = res.extend?.prevColValue;
  //     query.value.prevCursorId = res.extend?.prevCursorId;
  //     pagination.value.current = query.value.pageNo;
  //     pagination.value.pageSize = query.value.pageSize;
  //     pagination.value.total = res.total;
  //     oldPageNo.value = query.value.pageNo;
  //     pageCurrent.value = Math.ceil(res.total/query.value.pageSize);
  //     loading.value = false;
  //   }else{
  //     loading.value = false;
  //   }
  // };
  // const getforData = async ()=>{
  //   const res: any = await cashBackOrderAdminListPage(query.value);
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
  //   if(pag.pageSize != pagination.value.pageSize){
  //     query.value.pageNo = 1;
  //     pagination.value.current = 1;
  //   }else{
  //     query.value.pageNo = pag.current;
  //     pagination.value.current = pag.current;
  //   }
  //   pagination.value.pageSize = pag.pageSize;
  //   query.value.pageSize = pag.pageSize;
  //   getList();
  // };
  const { getsaleOrderDetail } = getUsdtBuyOrderInfo();
  const openDetail = ref(false);
  const detailObj = ref<any>({});
  const checkDetail = (value: any) => {
    selectedRow();
    const { id } = value;
    getsaleOrderDetail({ id });
    openDetail.value = true;
    detailObj.value = value;
  };
  const search = () => {
    query.value.pageNo = 1;
    pagination.value.current = 1;
    getList();
  }
  // const resetQuery = () => {
  //   query.value = {
  //       asc: false,
  //       column: "",
  //       endTime: "",
  //       startTime: "",
  //       memberId: "",
  //       merchantCode: "",
  //       merchantMemberId: "",
  //       merchantOrder: "",
  //       orderStatus: undefined,
  //       platformOrder: "",
  //       pageNo: 1,
  //       pageSize: 20,
  //       firstPage: true,
  //       lastPage:false,
  //       direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  //       nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  //       nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  //       prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  //       prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
  //   };
  //   pagination.value.pageSize = 20;
  //   pagination.value.current = 1;
  //   clearSelected();
  //   getList();
  // };
  // const getmerchant = async () => {
  //   const res: any = await getMerchantInfoAdminList({ pageNo: 1, pageSize: 10000 });
  //   if (res && res.code === "1") {
  //     merchantList.value = res.data.map((item: any) => ({
  //       value: item.username,
  //       label: item.username,
  //     }));
  //   }
  // };
  // const searchDate = computed({
  //   get: () => {
  //     return [query.value.startTime, query.value.endTime];
  //   },
  //   set: (val) => {
  //     query.value.startTime = val ? val[0] : "";
  //     query.value.endTime = val ? val[1] : "";
  //   },
  // });
  const goAssemble = (id: any) => {
    router.push({ path: "/member/changeReocde", query: { withdraw: id } });
  };
  const goPool = (id: any) => {
    router.push({ path: "/order/matchingPool/index", query: { id } });
  };
  
  const exportList = async () => {
    const data = JSON.parse(JSON.stringify(query.value));
    paymentOrderAdminExport(data);
  };
  onMounted(() => {
    if (route.query?.platformOrder) {
      query.value.platformOrder = route.query.platformOrder;
    }
    // getmerchant();
    getList();
    getTabH.value = useTabHeight(1).getTabH.value;
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
  