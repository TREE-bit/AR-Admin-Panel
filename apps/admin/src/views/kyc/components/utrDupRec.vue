<template>
    <div class="search">
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
        <!-- <a-col :span="3">
          <a-input v-trim
            v-model:value="query.appealId"
            class="searchstyle"
            :placeholder="$t('m562')+$t('m959')"
          />
        </a-col> -->
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
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.sellerOrderId"
            class="searchstyle"
            :placeholder="$t('m562')+$t('n40')"
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
            :placeholder="$t('m563')+$t('n845')"
            v-model:value="query.isPhonepeWakeUp"
            :options="[
              { value: 0, label: $t('no') },
              { value: 1, label: $t('yes') }
            ]"
          >
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            class="searchstyle"
            allowClear
            :placeholder="$t('m563')+$t('n848')"
            v-model:value="query.hasReceivedInfo"
            :options="[
              { value: 0, label: $t('no') },
              { value: 1, label: $t('yes') }
            ]"
          >
          </a-select>
        </a-col>
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
        <template v-if="column.key === 'bankCode'">
          {{ record.bankCode || '-' }}
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
        <template v-if="column.key === 'memberId'">
          <a-button v-if="record.memberId" type="link" class="copyContent" @click="showMember(record.memberId)">{{
            record.memberId
          }}</a-button>
          <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
          <span v-else>-</span>
        </template>
      <template v-if="column.key === 'appealId'">
        <a-button v-if="record.appealId" class="copyContent" type="link" @click="goPath(0,hasPro('/order/appeal/index'),record.appealId)">{{ record.appealId }}</a-button>
        <CopyOutlined v-if="record.appealId" class="copyId"  @click="$copyId(record.appealId)" />
        <span v-else>-</span>
      </template>
        <template v-if="column.key === 'createBy'">
          {{
            record.updateBy ? record.updateBy : record.createBy
          }}
        </template>
        <!-- <template v-if="column.key === 'createTime'">
          {{
            record.updateTime ? record.updateTime : record.createTime
          }}
        </template> -->
      <template v-if="column.key === 'sellerOrderId'">
        <a-tooltip v-if="record.sellerOrderId">
          <template #title>
            {{ record.sellerOrderId }}
            <CopyOutlined v-if="record.sellerOrderId" class="copyId"  @click="$copyId(record.sellerOrderId)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.sellerOrderId }}
            <CopyOutlined v-if="record.sellerOrderId" class="copyId"  @click="$copyId(record.sellerOrderId)" />
          </div>
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
      <template v-if="column.key === 'payer'">
        <a-tooltip v-if="record.payer">
          <template #title>{{ record.payer }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.payer }}</div>
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
      <template v-if="column.key === 'hasReceivedInfo'">
        <span v-if=([0,1].includes(record.hasReceivedInfo))
          :class="record.hasReceivedInfo == 1 ? 'tag-green' : record.hasReceivedInfo == 0 ? 'tag-red' : ''">
          {{ record.hasReceivedInfo == 1 ? $t('yes') : $t('no') }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'isPhonepeWakeUp'">
        <span :class="record.isPhonepeWakeUp === 1 ? 'tag-green' : record.isPhonepeWakeUp === 0 ? 'tag-red' : ''">
          {{ record.isPhonepeWakeUp === 1 ? $t('yes') : record.isPhonepeWakeUp === 0 ? $t('no') : '-' }}
        </span>
      </template>
      <template v-if="column.key === 'isMatch'">
        <span class="arbListTag" v-if="[0,1,2,3].includes(record.isMatch)">
          <span class="pointTag" :style="[1,2].includes(record.isMatch) ? 'background-color:#52c41a' : 'background-color:#f5222d'" ></span>
          {{ $t(isMatchMap[record.isMatch]) || '-' }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'operate'">
          <!-- v-if="!['3'].includes(record.status)"
          v-permission="'admin:matchingOrderAdmin:getInfo'" -->
        <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer;"
          size="small"
          @click="openManualMadal(record)"
          v-permission="'admin:kycPartnerRecipientAdmin:manualReplenishment'"
          >{{ $t("m700") }}
        </a-tag>
      </template>
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
    <!-- 补单 -->
    <a-modal
      v-model:open="manualModal"
      :title="$t('m700')"
      width="700px"
      @ok="manualKycOrder"
      @cancel="closeManualModal"
    >
      <a-form :model="manualForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item :label="$t('n40')" name="merchantOrder" required>
          <a-input v-trim v-model:value="manualForm.merchantOrder" />
        </a-form-item>
      <a-form-item
        :label="$t('n1396')"
      >
        <a-radio-group v-model:value="manualForm.delayFinish" :style="manualForm.delayFinish == 1 ? 'padding-top:5px;' : ''">
          <a-radio :value="1">{{ $t("yes") }}</a-radio>
          <a-radio :value="0">{{ $t("no") }}</a-radio>
        </a-radio-group>
        <a-select
          v-if="manualForm.delayFinish == 1"
          v-model:value="manualForm.delayType"
          style="margin-top:10px;"
          :placeholder="$t('m563')+ $t('n1397')"
          :options="Object.entries(delayTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
          >
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('n1399')"
      >
        <a-radio-group v-model:value="manualForm.disableBuy" :style="manualForm.disableBuy == 1 ? 'padding-top:5px;' : ''">
          <a-radio :value="1">{{ $t("yes") }}</a-radio>
          <a-radio :value="0">{{ $t("no") }}</a-radio>
        </a-radio-group>
        <a-select
          v-if="manualForm.disableBuy == 1"
          v-model:value="manualForm.disableLimitType"
          style="margin-top:10px;"
          :placeholder="$t('m563')+ $t('n1398')"
          :options="Object.entries(disableLimitTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
          >
        </a-select>
      </a-form-item>
      </a-form>
    </a-modal>
  </template>
  <script lang="ts" setup>
  import { onMounted, ref, h, computed } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import { kycManualReplenishment } from "@/api/order.api";
  import {
    getKycBankCodeList,
    utrDuplicateListPage,
  } from "@/api/kycConfig.api";
  import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
  // import { getMerchantInfoAdminList } from "@/api/merchant.api";
  import { currency } from "@/utils/index";
  import { useI18n } from "vue-i18n";
  import { message } from "ant-design-vue";
  import router from "@/router";
  import { useRoute } from "vue-router";
  import { paymentOrderAdminExport } from "@/api/export";
  import { delayTypeMap,disableLimitTypeMap } from "@/utils/publicData";
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
    sellerOrderId: undefined,
    pageNo: 1,
    pageSize: 20,
    randomCode: undefined,
    tId: undefined,
    isPhonepeWakeUp: undefined,
    hasReceivedInfo: undefined,
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
      title: h("div", {class:"toopTipStyle2"}, t("n845")),
      dataIndex: "isPhonepeWakeUp",
      key: "isPhonepeWakeUp",
      align: "center",
      width: 220,
    },
    {
      title: h("div", {class:"toopTipStyle2"}, t("n848")),
      dataIndex: "hasReceivedInfo",
      key: "hasReceivedInfo",
      align: "center",
      width: 100,
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
      width: 180,
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
  const getList = async (query: any) => {
    loading.value = true;
    const res: any = await utrDuplicateListPage(Object.assign(query)).catch((err)=>loading.value = false);
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
    getList(
      Object.assign({}, query.value, {
        pageSize: pag.pageSize,
        pageNo: pag?.current,
      })
    );
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
    getList(query.value);
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
      sellerOrderId: undefined,
      pageNo: 1,
      pageSize: 20,
      randomCode: undefined,
      tId: undefined,
      isPhonepeWakeUp: undefined,
      hasReceivedInfo: undefined,
    };
    pagination.value.pageSize = 20;
    pagination.value.current = 1;
    clearSelected();
    getList(query.value);
  };
  //补单
  const manualModal = ref(false);
  const manualForm = ref({
    merchantOrder: undefined,
    utr: undefined,
    orderReplenishmentSource: 2,
    delayConsumer: 0,
    delayFinish: 0,
    delayType: undefined,
    delayTime: undefined,
    disableBuy: 0,
    disableLimitType: undefined,
    disableLimitTime: undefined,
  })
  const openManualMadal = (val:any) => {
    manualModal.value = true
    const { id,utr } = val;
    manualForm.value = {
      merchantOrder: undefined,
      utr: utr,
      orderReplenishmentSource: 2,
      delayConsumer: 0,
      delayFinish: 0,
      delayType: undefined,
      delayTime: undefined,
      disableBuy: 0,
      disableLimitType: undefined,
      disableLimitTime: undefined,
    };
  }
  const manualKycOrder = async () => {
    if(manualForm.value.delayFinish && !manualForm.value.delayType){
      message.error(t("m563")+t("n1397"));
      return;
    }
    if(manualForm.value.disableBuy && !manualForm.value.disableLimitType){
      message.error(t("m563")+t("n1398"));
      return;
    }
    loading.value = true;
    const res: any = await kycManualReplenishment(manualForm.value).finally(()=>loading.value = false);
    if (res && res.code === "1") {
      message.success(t('s10'));
      manualModal.value = false;
      loading.value = false;
      getList(query.value);
    }
  }
  const closeManualModal = () => {
    manualModal.value = false;
    manualForm.value = {
      merchantOrder: undefined,
      utr: undefined,
      orderReplenishmentSource: 2,
      delayConsumer: 0,
      delayFinish: 0,
      delayType: undefined,
      delayTime: undefined,
      disableBuy: 0,
      disableLimitType: undefined,
      disableLimitTime: undefined,
    };
  }


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
    getList(query.value);
    getTabH.value = useTabHeight(3,40).getTabH.value;
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
  