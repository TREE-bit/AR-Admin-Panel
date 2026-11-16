<template>
    <div class="search">
      <a-row style="margin: 0 0 15px 0">
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.memberId"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+$t('m149')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.toMemberId"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+$t('m150')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.tid"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+'TID'"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.transactionId"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+$t('n1509')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.utr"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+'UTR'"
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
            v-model:value="query.payeeVpa"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+'UPI ID'"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.payeeBankNo"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+$t('m652')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.payeeIfsc"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+'IFSC'"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            allow-clear
            v-model:value="query.phoneNumber"
            :placeholder="$t('m562')+$t('m591')"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            class="searchstyle"
            allowClear
            :placeholder="$t('m563')+$t('n1511')"
            v-model:value="query.successFlag"
            :options="[
              {value:1,label:$t('m619')},
              {value:0,label:$t('m618')},
            ]"
          >
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            class="searchstyle"
            allowClear
            :placeholder="$t('m563')+$t('n1512')"
            v-model:value="query.matchFlag"
            :options="Object.entries(isMatchMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
          >
          </a-select>
        </a-col>
        <a-col>
          <timeRange v-model:startTime="query.pullTimeStart" v-model:endTime="query.pullTimeEnd"  :title="$t('m869')" :type="1"/>
        </a-col>
        <a-col>
          <a-button
            type="primary"
            :icon="h(SearchOutlined)"
            @click="getList(1)"
            >{{ $t("search") }}</a-button
          >
          <a-button type="primary" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
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
      <template v-if="column.key === 'chOrderNo'">
        <a-tooltip>
          <template #title>
            <div>
              {{ $t('m11') }}：{{ record.chOrderNo || '-' }}
              <CopyOutlined v-if="record.chOrderNo" class="copyId"  @click="$copyId(record.chOrderNo)" />
            </div>
            <div>
              {{ $t('n104') }}：{{ record.buyOrderNo || '-' }}
              <CopyOutlined v-if="record.buyOrderNo" class="copyId"  @click="$copyId(record.buyOrderNo)" />
            </div>
            <div>
              {{ $t('n100') }}：{{ record.sellOrderNo || '-' }}
              <CopyOutlined v-if="record.sellOrderNo" class="copyId"  @click="$copyId(record.sellOrderNo)" />
            </div>
          </template>
          <div class="tableText">
            <div class="toopTipStyle">
              {{ $t('m11') }}：{{ record.chOrderNo || '-' }}
              <CopyOutlined v-if="record.chOrderNo" class="copyId"  @click="$copyId(record.chOrderNo)" />
            </div>
            <div class="toopTipStyle">
              {{ $t('n104') }}：{{ record.buyOrderNo || '-' }}
              <CopyOutlined v-if="record.buyOrderNo" class="copyId"  @click="$copyId(record.buyOrderNo)" />
            </div>
            <div class="toopTipStyle">
              {{ $t('n100') }}：{{ record.sellOrderNo || '-' }}
              <CopyOutlined v-if="record.sellOrderNo" class="copyId"  @click="$copyId(record.sellOrderNo)" />
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'memberId'">
        <a-tooltip>
          <template #title>
            <div>
              {{ $t('n104') }}：<a-button type="link" v-if="record.memberId" class="copyContent" @click="showMember(record.memberId)">
                {{ record.memberId }}
              </a-button>
              <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
              <span v-else>-</span>
            </div>
            <div>
              {{ $t('n100') }}：<a-button type="link" v-if="record.toMemberId" class="copyContent" @click="showMember(record.toMemberId)">
                {{ record.toMemberId }}
              </a-button>
              <CopyOutlined v-if="record.toMemberId" class="copyId"  @click="$copyId(record.toMemberId)" />
              <span v-else>-</span>
            </div>
          </template>
          <div class="tableText">
            <div class="toopTipStyle" >
              {{ $t('n104') }}：<a-button type="link" v-if="record.memberId" class="copyContent" @click="showMember(record.memberId)">
                {{ record.memberId }}
              </a-button>
              <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
              <span v-else>-</span>
            </div>
            <div class="toopTipStyle" >
              {{ $t('n100') }}：<a-button type="link" v-if="record.toMemberId" class="copyContent" @click="showMember(record.toMemberId)">
                  {{ record.toMemberId }}
                </a-button>
              <CopyOutlined v-if="record.toMemberId" class="copyId"  @click="$copyId(record.toMemberId)" />
              <span v-else>-</span>
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'tid'">
        <a-tooltip v-if="record.tid">
          <template #title  v-if="!record.isDefaultTId" >
            {{ record.tid }}
            <CopyOutlined v-if="record.tid && !record.isDefaultTId" class="copyId"  @click="$copyId(record.tid)" />
          </template>
          <div class="toopTipStyle2" :class="record.isDefaultTId?'defaultTId':''">
            {{ record.tid }}
            <CopyOutlined v-if="record.tid && !record.isDefaultTId" class="copyId"  @click="$copyId(record.tid)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'transactionId'">
        <a-tooltip v-if="record.transactionId">
          <template #title >
            {{ record.transactionId }}
            <CopyOutlined v-if="record.transactionId " class="copyId"  @click="$copyId(record.transactionId)" />
          </template>
          <div class="toopTipStyle2" >
            {{ record.transactionId }}
            <CopyOutlined v-if="record.transactionId" class="transactionId"  @click="$copyId(record.transactionId)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'phoneNumber'">
        <a-tooltip v-if="record.phoneNumber">
          <template #title >
            {{ record.phoneNumber }}
            <CopyOutlined v-if="record.phoneNumber " class="copyId"  @click="$copyId(record.phoneNumber)" />
          </template>
          <div class="toopTipStyle2" >
            {{ record.phoneNumber }}
            <CopyOutlined v-if="record.phoneNumber" class="phoneNumber"  @click="$copyId(record.phoneNumber)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'bankCode'">
        {{ record.bankCode || '-' }}
      </template>
      <template v-if="column.key === 'payeeVpa'">
        <a-tooltip >
          <template #title>
            <div>
              {{ record.payeeVpa }}
              <CopyOutlined v-if="record.payeeVpa" class="copyId"  @click="$copyId(record.payeeVpa)" />
            </div>
            <div>
              {{$t('n621')}}：{{ record.payeeBankOwner || '-' }}
            </div>
            <div>
              {{$t('n622')}}：{{ record.payeeBankNo || '-' }}
            </div>
            <div>
              IFSC：{{ record.ifsc || '-' }}
            </div>
          </template>
          <div class="tableText">
            <div class="toopTipStyle">
              UPI ID：{{ record.payeeVpa }}
              <CopyOutlined v-if="record.payeeVpa" class="copyId"  @click="$copyId(record.payeeVpa)" />
            </div>
            <div class="toopTipStyle">
              {{$t('n621')}}：{{ record.payeeBankOwner || '-' }}
            </div>
            <div class="toopTipStyle">
              {{$t('n622')}}：{{ record.payeeBankNo || '-' }}
            </div>
            <div class="toopTipStyle">
              IFSC：{{ record.ifsc || '-' }}
            </div>
          </div>
        </a-tooltip>
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
      <template v-if="column.key === 'createBy'">
        {{
          record.updateBy ? record.updateBy : record.createBy
        }}
      </template>
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
      <template v-if="column.key === 'amount'">
        {{ currency(record.amount,false) }}
      </template>
      <template v-if="column.key === 'payer'">
        <a-tooltip v-if="record.payer">
          <template #title>{{ record.payer }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.payer }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'matchFlag'">
        <span class="arbListTag" v-if="[0,1,2,3].includes(record.matchFlag)">
          <span class="pointTag" :style="[1,2].includes(record.matchFlag) ? 'background-color:#52c41a' : 'background-color:#f5222d'" ></span>
          {{ $t(isMatchMap[record.matchFlag]) || '-' }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'successFlag'">
        <span :class="record.successFlag == 1 ? 'tag-green' : 'tag-red'">
          {{ record.successFlag == 1 ? $t('m619') : $t('m618') }}
        </span>
      </template>
      <template v-if="column.key === 'utr'">
        <a-tooltip v-if="record.utr">
          <template #title>
            <div>
              <span :style="record.utr.startsWith('UTR') ? 'color:#9d9d9d' : ''">{{ record.utr }}</span>
              <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
            </div>
            <div style="color: #9d9d9d;">
              {{ record.payeeFlag }}
            </div>
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            <span :style="record.utr.startsWith('UTR') ? 'color:#9d9d9d' : ''">{{ record.utr }}</span>
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </div>
          <div style="text-overflow: ellipsis;overflow: hidden;color: #9d9d9d;">{{ record.payeeFlag }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'backendErrorCode'">
        <a-tooltip>
          <template #title>
              <div>
                {{ $t('n1254') }}：{{ record.sourceTransactionStatus || '-' }}
              </div>
              <div>
                {{ $t('n1505') }}：{{ record.backendErrorCode || '-' }}
              </div>
              <div>
                {{ $t('n1506') }}：{{ record.responseCode || '-' }}
              </div>
          </template>
          <div class="tableText">
              <div class="toopTipStyle">
                {{ $t('n1254') }}：{{ record.sourceTransactionStatus || '-' }}
              </div>
              <div class="toopTipStyle">
                {{ $t('n1505') }}：{{ record.backendErrorCode || '-' }}
              </div>
              <div class="toopTipStyle">
                {{ $t('n1506') }}：{{ record.responseCode || '-' }}
              </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'pullTime'">
        <div class="tableText">
          <div>{{ $t('n359') }}：{{ record.pullTime || '-' }}</div>
          <div>{{ $t('n1507') }}：{{ record.transactionCreateTime || '-' }}</div>
          <div>{{ $t('n1508') }}：{{ record.transactionUpdateTime || '-' }}</div>
        </div>
      </template>
      <template v-if="column.key === 'operate'">
        <!-- <a-tag
          color="red"
          style="cursor: pointer;"
          size="small"
          v-if="record.isMatch == 0"
          @click="openManualMadal(record)"
          v-permission="'admin:matchingOrderAdmin:orderReplenishmentByWater1'"
          >{{ $t("m700") }}
        </a-tag> -->
      </template>
      </template>
      <template #summary>
        <SummaryBottom 
          :summaryRows="summaryRows"
          :dynamicColumns="columns"
          :firstColumnLabel="'chOrderNo'"
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
  </template>
  <script lang="ts" setup>
  import { onMounted, ref, h, watchEffect, computed } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import {
    autoTransferAdminPaymentRecord,
    getKycBankCodeList,
  } from "@/api";
  import { currency, thousand } from "@/utils/index";
  import { useI18n } from "vue-i18n";
  import { useRoute,onBeforeRouteLeave } from "vue-router";
  import { usePageCash } from "@/hooks/usePageCash.hook"; 
  import { isMatchMap } from "@/utils/publicData";
  import memberDetail from "@/components/Member/memberDetail.vue";
  import { getStartAndEndOfDay } from "@/plugins/dataMap";
  import { useTabHeight } from "@/hooks/useTabHeight.hooks";
  import { useTableData } from "@/hooks/useTableData.hook";
  import SummaryBottom from "@/components/Other/SummaryBottom.vue";
  const { getTabH } = useTabHeight();
  const [startIndiaTime,endIndiaTime,] = getStartAndEndOfDay()
  const { t } = useI18n();
  const route = useRoute();
  const { pageCash,setPageCash,getPageCash,clearPageCash } = usePageCash();
  const resultData = ref({});
  const isUseCash = ref(false);
  onBeforeRouteLeave(() => {
    setPageCash(route.fullPath.split('?')[0], query.value, resultData.value);
  })
  const detailModel = ref(false);
  const detailId = ref({
    id: 0,
    memberId: 0,
  });
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      amount: thousand(extendData.value.pageAmountSum),
    },
  },
  {
    label: t("m55"),
    fields: {
      amount: thousand(extendData.value.totalAmountSum),
    },
    fixedPositions: {
    },
  },
]);
  const query = ref({
    asc: false,
    column: "",
    pullTimeEnd: endIndiaTime,
    pullTimeStart: startIndiaTime,
    bankCode: undefined,
    memberId: undefined,
    toMemberId: undefined,
    phoneNumber: undefined,
    tid: undefined,
    transactionId: undefined,
    utr: undefined,
    successFlag: undefined,
    matchFlag: undefined,
    pageNo: 1,
    pageSize: 20,
    payeeBankNo: undefined,
    payeeIfsc: undefined,
    payeeVpa: undefined,
  });
  const columns:any = [
    {
      title: t('l90'),
      dataIndex: "chOrderNo",
      key: "chOrderNo",
      align: "center",
      width: 220,
    },
    {
      title: t("c9"),
      dataIndex: "memberId",
      key: "memberId",
      align: "center",
      width: 180,
    },
    {
      title: 'TID',
      dataIndex: "tid",
      key: "tid",
      align: "center",
      width: 180,
    },
    {
      title: t("n1509"),
      dataIndex: "transactionId",
      key: "transactionId",
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
      title: t("m591"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      width: 150,
    },
    {
      title: t("m36"),
      dataIndex: "payeeVpa",
      key: "payeeVpa",
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
      width: 160,
    },
    {
      title: t("n1510"),
      dataIndex: "backendErrorCode",
      key: "backendErrorCode",
      align: "center",
      width: 240,
    },
    {
      title: t("m693"),
      dataIndex: "payerVpa",
      key: "payerVpa",
      align: "center",
      width: 150,
    },
    {
      title: h("div", {class:"toopTipStyle2"}, t("n1511")),
      dataIndex: "successFlag",
      key: "successFlag",
      align: "center",
      width: 220,
    },
    {
      title: h("div", {class:"toopTipStyle2"}, t("n1512")),
      dataIndex: "matchFlag",
      key: "matchFlag",
      align: "center",
      width: 100,
    },
    {
      title: t("m514"),
      dataIndex: "pullTime",
      key: "pullTime",
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
  const showMember = (id: any) => {
    detailModel.value = true;
    detailId.value.id = id;
  };
  const {
    dataSource,
    extendData,
    response,
    pagination,
    loading,
    handleTableChange,
    getList,
    resetQuery,
  } = useTableData({
    query,
    api: autoTransferAdminPaymentRecord,
    defaultPageSize: 20,
    fetchType: 2,
    filterRules: [],
    afterFetch: (data) =>
    data.map((item: any) => {
      item.isDefaultTId = item.tid && item.tid.slice(0, 7) == 'DEFAULT' ? 1 : 0;
      return item;
    }),
  });
  watchEffect(() => {
    if(!isUseCash.value) resultData.value = response.value;
  });
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
    const pathName = route.fullPath.split('?')[0];
    if(pageCash.value.includes(pathName) && Object.keys(route.query).length == 0){
      const { queryCash, res } = getPageCash(pathName);
      if(!res.data || res.data && res.data.length == 0) {
        isUseCash.value = false;
        getList();
      }else{
        isUseCash.value = true;
        query.value = queryCash;
        dataSource.value = res.data;
        resultData.value = res;
        pagination.value.total = res.total;
        pagination.value.current = query.value.pageNo;
        pagination.value.pageSize = query.value.pageSize;
      }
    }else{
      clearPageCash(route.fullPath);
      getList();
    }
    getTabH.value = useTabHeight(1,40).getTabH.value;
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
  