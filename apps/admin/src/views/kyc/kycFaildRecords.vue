<template>
    <div class="search">
      <h2>{{ $t("n291") }}</h2>
      <a-row style="margin: 0 0 15px 0">
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
          <a-input v-trim
            v-model:value="query.appealId"
            class="searchstyle"
            :placeholder="$t('m562')+$t('m959')"
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
          <a-input v-trim
            v-model:value="query.upiName"
            class="searchstyle"
            :placeholder="$t('m562')+$t('m582')"
          />
        </a-col> -->
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            v-model:value="query.recipient"
            :placeholder="$t('m562')+$t('m691')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.payer"
            class="searchstyle"
            :placeholder="$t('m562')+$t('m693')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.utr"
            class="searchstyle"
            :placeholder="$t('m562')+'UTR'"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.sellOrder"
            class="searchstyle"
            :placeholder="$t('m562')+$t('n40')"
          />
        </a-col>
        <!-- <a-col :span="3">
          <a-input v-trim
            v-model:value="query.randomCode"
            class="searchstyle"
            :placeholder="$t('m562')+$t('m635')"
          />
        </a-col> -->
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.tId"
            class="searchstyle"
            :placeholder="$t('m562')+$t('m635')"
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
          <a-input
            v-model:value="query.matchOrder"
            class="searchstyle"
            :placeholder="$t('e13')"
          />
        </a-col> -->
        <a-col :span="3">
          <a-select
            class="searchstyle"
            allowClear
            :placeholder="$t('m563')+$t('m695')"
            v-model:value="query.isMatch"
            :options="Object.entries(isMatchMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
          >
          </a-select>
        </a-col>
        <a-col>
          <!-- <a-range-picker
            class="searchstyle"
            show-time
            v-model:value="searchDate"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            :placeholder="[$t('m65'), $t('m172')]"
          /> -->
          <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime"  :title="$t('m694')" :type="1"/>
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
          <span v-else>-</span>
        </template>
      <template v-if="column.key === 'appealId'">
        <span>{{ record.appealId }}</span>
        <CopyOutlined v-if="record.appealId" class="copyId"  @click="$copyId(record.appealId)" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'randomCode'">
        <a-tooltip v-if="record.randomCode">
          <template #title>
            {{ record.randomCode }}
            <CopyOutlined v-if="record.randomCode" class="copyId"  @click="$copyId(record.randomCode)" />
          </template>
          <div class="toopTipStyle">
            {{ record.randomCode }}
            <CopyOutlined v-if="record.randomCode" class="copyId"  @click="$copyId(record.randomCode)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'tId'">
        <a-tooltip v-if="record.tId">
          <template #title v-if="!record.isDefaultTId">
            {{ record.tId }}
            <CopyOutlined v-if="record.tId && !record.isDefaultTId" class="copyId"  @click="$copyId(record.tId)" />
          </template>
          <div class="toopTipStyle2" :class="record.isDefaultTId?'defaultTId':''">
            {{ record.tId }}
            <CopyOutlined v-if="record.tId && !record.isDefaultTId" class="copyId"  @click="$copyId(record.tId)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
        <template v-if="column.key === 'createBy'">
          {{
            record.updateBy ? record.updateBy : record.createBy
          }}
        </template>
        <template v-if="column.key === 'createTime'">
          {{
            record.updateTime ? record.updateTime : record.createTime
          }}
        </template>
      <template v-if="column.key === 'sellerOrderId'">
        <a-tooltip v-if="record.sellerOrderId">
          <template #title>{{ record.sellerOrderId }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.sellerOrderId }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'recipient'">
        <a-tooltip v-if="record.recipient">
          <template #title>{{ record.recipient }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.recipient }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'utr'">
        <a-tooltip v-if="record.utr">
          <template #title>
            {{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
        <!-- <template v-if="column.key === 'orderStatus'">
          <a-tag>{{ $t(orderStatusMap[Number(record.orderStatus)]) }}</a-tag>
        </template> -->
        <!-- <template v-if="column.key === 'platformOrder'">
          <a-button type="link" @click="goAssemble(record.platformOrder)">
          {{ record.platformOrder }}</a-button>
        </template> -->
      <template v-if="column.key === 'payer'">
        <a-tooltip v-if="record.payer">
          <template #title>{{ record.payer }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.payer }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'isMatch'">
        <span class="arbListTag" v-if="[0,1,2,3].includes(record.isMatch)">
          <span class="pointTag" :class="[1,2].includes(record.isMatch) ? 'pointTag-green' : 'pointTag-red'" ></span>
          {{ $t(isMatchMap[record.isMatch]) }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'operate'">
          <!-- v-if="!['3'].includes(record.status)"
          v-permission="'admin:matchingOrderAdmin:getInfo'" -->
        <!-- <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer;"
          size="small"
          @click="openManualMadal(record)"
          v-permission="'admin:kycPartnerRecipientAdmin:manualReplenishment'"
          >{{ $t("m700") }}
        </a-tag> -->
      </template>
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
    <!-- 补单 -->
    <!-- <a-modal
      v-model:open="manualModal"
      :title="$t('m700')"
      width="500px"
      @ok="manualKycOrder"
      @cancel="closeManualModal"
    >
      <a-form :model="manualForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item :label="$t('n40')" name="merchantOrder" required>
          <a-input v-trim v-model:value="manualForm.merchantOrder" />
        </a-form-item>
      </a-form>
    </a-modal> -->
  </template>
  <script lang="ts" setup>
  import { onMounted, ref, h, computed } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import { kycPartnerRecipientAdminFailedListPage } from "@/api/order.api";
import {
  getKycBankCodeList,
} from "@/api/kycConfig.api";
  import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
  // import { getMerchantInfoAdminList } from "@/api/merchant.api";
  import { currency } from "@/utils/index";
  import { useI18n } from "vue-i18n";
  import { message } from "ant-design-vue";
  import router from "@/router";
  import { useRoute } from "vue-router";
  import { paymentOrderAdminExport } from "@/api/export";
  import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
  import memberDetail from "@/components/Member/memberDetail.vue";
  import { getStartAndEndOfDay } from "@/plugins/dataMap";
  import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
// import { useMerchantStore } from "@/stores/useMerchantStore";
// const merchantList = computed(() => useMerchantStore().merchantList);
  const { getTabH } = useTabHeight();
  const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
  const { t } = useI18n();
  const route = useRoute();
  const detailModel = ref(false);
  // const merchantList = ref([]);
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
    0: 'm697',//未匹配
    1: 'm696',//已匹配
    2: 'm806',//手动匹配
    3: 'm917',//金额异常
  }
  const query = ref({
    asc: true,
    column: "",
    endTime: route.query.sellKycId ? '' : endIndiaTime,
    startTime: route.query.sellKycId ? '' : startIndiaTime,
    kycId: route.query.sellKycId || undefined,
    memberId: undefined,
    appealId: undefined,
    // upiName: undefined,
    bankCode: undefined,
    payer: undefined,
    recipient: undefined,
    utr: undefined,
    isMatch: undefined,
    sellOrder: undefined,
    pageNo: 1,
    pageSize: 20,
    randomCode: undefined,
    tId: undefined,
  });
  const columns:any = [
    {
      title: 'KYC ID',
      dataIndex: "kycId",
      key: "kycId",
      align: "center",
      width: 180,
    },
    {
      title: t("m150"),
      dataIndex: "memberId",
      key: "memberId",
      align: "center",
      width: 180,
    },
    {
      title: t("m959"),
      dataIndex: "appealId",
      key: "appealId",
      align: "center",
      width: 100,
    },
    {
      title: t("m582"),
      dataIndex: "bankCode",
      key: "bankCode",
      align: "center",
      width: 150,
    },
    {
      title: t("m691"),
      dataIndex: "recipient",
      key: "recipient",
      align: "center",
      width: 150,
    },
    {
      title: t("m692"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: 150,
    },
    {
      title: 'UTR',
      dataIndex: "utr",
      key: "utr",
      align: "center",
      width: 140,
    },
    {
      title: t("m693"),
      dataIndex: "payer",
      key: "payer",
      align: "center",
      width: 240,
    },
  // {
  //   title: t("m635"),
  //   dataIndex: "randomCode",
  //   key: "randomCode",
  //   filteredValue: [],
  //   align: "center",
  //   width: 220,
  // },
  {
    title: t("m635"),
    dataIndex: "tId",
    key: "tId",
    align: "center",
    width: 220,
  },
    {
      title: t("m694"),
      dataIndex: "bankTransactionTime",
      key: "bankTransactionTime",
      align: "center",
      width: 150,
    },
    {
      title: t("m869"),
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 150,
    },
    {
      title: t("n40"),
      dataIndex: "sellerOrderId",
      key: "sellerOrderId",
      align: "center",
      width: 150,
    },
    {
      title: t("m695"),
      dataIndex: "isMatch",
      key: "isMatch",
      align: "center",
      width: 200,
    },
    // {
    //   title: t("operation"),
    //   dataIndex: "operate",
    //   key: "operate",
    //   align: "center",
    //   width: 120,
    //   fixed: 'right',
    // },
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
    pagination.value.current = query.value.pageNo;
    pagination.value.pageSize = query.value.pageSize;
    const res: any = await kycPartnerRecipientAdminFailedListPage(query.value).catch((err)=>loading.value = false);
    if (res && res.code === "1") {
      dataSource.value = res.data.map((item: any) => {
        item.amount = currency(item.amount, false);
        item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
        return item;
      });
      extendData.value = res.extend;
      pagination.value.total = res.total;
      loading.value = false;
    }else{
      loading.value = false;
    }
  };
  const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    pagination.value.current = pag.current;
    pagination.value.pageSize = pag.pageSize;
    query.value.pageNo = pag.current;
    query.value.pageSize = pag.pageSize;
    getList();
  };
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
  const resetQuery = () => {
    query.value = {
      asc: true,
      column: "",
      endTime: '',
      startTime: '',
      kycId: undefined,
      memberId: undefined,
      bankCode: undefined,
      appealId: undefined,
      // upiName: undefined,
      payer: undefined,
      recipient: undefined,
      utr: undefined,
      isMatch: undefined,
      sellOrder: undefined,
      pageNo: 1,
      pageSize: 20,
      randomCode: undefined,
      tId: undefined,
    };
    pagination.value.pageSize = 20;
    pagination.value.current = 1;
    clearSelected();
    getList();
  };
  //补单
  // const manualModal = ref(false);
  // const manualForm = ref({
  //   merchantOrder: undefined,
  //   utr: undefined,
  // })
  // const openManualMadal = (val:any) => {
  //   manualModal.value = true
  //   const { id,utr } = val;
  //   manualForm.value.utr = utr;
  // }
  // const manualKycOrder = async () => {
  //   loading.value = true;
  //   const res: any = await kycManualReplenishment(manualForm.value).finally(()=>loading.value = false);
  //   if (res && res.code === "1") {
  //     message.success(t('s10'));
  //     manualModal.value = false;
  //     loading.value = false;
  //     getList();
  //   }
  // }
  // const closeManualModal = () => {
  //   manualModal.value = false
  // }


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
  // const goAssemble = (id: any) => {
  //   router.push({ path: "/member/changeReocde", query: { withdraw: id } });
  // };
  // const goPool = (id: any) => {
  //   router.push({ path: "/order/matchingPool/index", query: { id } });
  // };
  
  // const exportList = async () => {
  //   const data = JSON.parse(JSON.stringify(query.value));
  //   paymentOrderAdminExport(data);
  // };
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
const hasPro = (path: string) => {
  const name = path.split('/').join('_')
  return router.hasRoute(name)
}
const goPath = (pathType: number, isGo:boolean, val:any)=>{
  console.log(isGo)
  if(!isGo) return;
  const goMap = [
    {name:'_order_appeal_index', query: {appealId: val}},
  ];
  router.push(goMap[pathType])
}
  onMounted(() => {
    getGroupList();
    if (route.query?.platformOrder) {
      query.value.platformOrder = route.query.platformOrder;
    }
    // getmerchant();
    getList();
    getTabH.value = useTabHeight(3).getTabH.value;
  });
  </script>
  <style lang="less" scoped>
  .search {
    & > h2 {
      position: relative;
      margin-bottom: 5px;
      &:after {
        content: "";
        border-width: 0px;
        position: absolute;
        left: -10px;
        top: 3px;
        width: 4px;
        height: 22px;
        background: #f9a600;
      }
    }
  }
  :deep(.ant-picker-range-separator) {
    display: none;
  }
  :deep(.windActive){
    font-weight: 600;
    color: red;
  }
  </style>
  