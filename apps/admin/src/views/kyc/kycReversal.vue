<template>
    <div class="search">
      <a-row style="margin: 0 0 15px 0">
        <a-col :span="3">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="query.bankCode"
            :placeholder="$t('m563')+$t('m582')"
          >
            <a-select-option
              v-for="(item) in groupList"
              :value="item"
              :key="item"
              >{{ item }}</a-select-option
            >
          </a-select>
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
          <a-input v-trim
            v-model:value="query.recipientUPI"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+$t('m611')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.tId"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+$t('m635')"
          />
        </a-col>
        <a-col>
          <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime"  :title="$t('m694')" :type="1"/>
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
      <template v-if="column.key === 'utr'">
        <a-tooltip v-if="record.utr">
          <template #title>
            {{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </template>
          <div class="toopTipStyle2">
            {{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'txnid'">
        <a-tooltip v-if="record.txnid">
          <template #title>
            {{ record.txnid }}
            <CopyOutlined v-if="record.txnid" class="copyId"  @click="$copyId(record.txnid)" />
          </template>
          <div class="toopTipStyle2">
            {{ record.txnid }}
            <CopyOutlined v-if="record.txnid" class="copyId"  @click="$copyId(record.txnid)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'amount'">
        {{ currency(record.amount,false) }}
      </template>
      <template v-if="column.key === 'recipientName'">
        <a-tooltip v-if="record.recipientName">
          <template #title>
            {{ record.recipientName }}
          </template>
          <div class="toopTipStyle2">
            {{ record.recipientName }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'recipientUPI'">
        <a-tooltip v-if="record.recipientUPI">
          <template #title>
            {{ record.recipientUPI }}
            <CopyOutlined v-if="record.recipientUPI" class="copyId"  @click="$copyId(record.recipientUPI)" />
          </template>
          <div class="toopTipStyle2">
            {{ record.recipientUPI }}
            <CopyOutlined v-if="record.recipientUPI" class="copyId"  @click="$copyId(record.recipientUPI)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'tid'">
        <a-tooltip v-if="record.tid">
          <template #title v-if="!record.isDefaultTId">
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
      <template v-if="column.key === 'orderStatus'">
        <span :class="record.orderStatus == 1 ? 'tag-green' : 'tag-red'">
          {{ record.orderStatus == 1 ? $t('s10') : $t('m618') }}
        </span>
      </template>
      <template v-if="column.key === 'sourceTransactionStatus'">
        <a-tooltip v-if="record.sourceTransactionStatus">
          <template #title>
            {{ record.sourceTransactionStatus }}
          </template>
          <div class="toopTipStyle2">
            {{ record.sourceTransactionStatus }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'bankCode'">
        {{ record.bankCode || '-' }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'transactionCreateTime'">
        {{ record.transactionCreateTime || '-' }}
      </template>
      <template v-if="column.key === 'transactionUpdateTime'">
        {{ record.transactionUpdateTime || '-' }}
      </template>
      <!-- <template v-if="column.key === 'operate'">
        <a-tag
          color="red"
          style="cursor: pointer;"
          size="small"
          v-if="record.isMatch == 0"
          @click="openManualMadal(record)"
          v-permission="'admin:matchingOrderAdmin:orderReplenishmentByWater1'"
          >{{ $t("m700") }}
        </a-tag>
      </template> -->
      </template>
    </a-table>
  </template>
  <script lang="ts" setup>
  import { onMounted, ref, h } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import {
    getKycBankCodeList,
    kycReversalWaterAdminListPage,
  } from "@/api";
  import { currency } from "@/utils/index";
  import { useI18n } from "vue-i18n";
  import { getStartAndEndOfDay } from "@/plugins/dataMap";
  import { useTabHeight } from "@/hooks/useTabHeight.hooks";
  import { useTableData } from "@/hooks/useTableData.hook";
  const { getTabH } = useTabHeight();
  const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
  const { t } = useI18n();
  const query = ref({
    asc: false,
    column: "",
    pageNo: 1,
    pageSize: 20,
    utr: undefined,
    tId: undefined,
    bankCode: undefined,
    recipientUPI: undefined,
    startTime: startIndiaTime,
    endTime: endIndiaTime,
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
      title: t("m582"),
      dataIndex: "bankCode",
      key: "bankCode",
      align: "center",
      width: 200,
    },
    {
      title: 'UTR',
      dataIndex: "utr",
      key: "utr",
      align: "center",
      width: 160,
    },
    {
      title: t("n1509"),
      dataIndex: "txnid",
      key: "txnid",
      align: "center",
      width: 200,
    },
    {
      title: t("m692"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: 150,
    },
    {
      title: t("m663"),
      dataIndex: "recipientName",
      key: "recipientName",
      align: "center",
      width: 150,
    },
    {
      title: t("m611"),
      dataIndex: "recipientUPI",
      key: "recipientUPI",
      align: "center",
      width: 150,
    },
    {
      title: t("m635"),
      dataIndex: "tid",
      key: "tid",
      align: "center",
      width: 200,
    },
    {
      title: h("div", {class:"toopTipStyle2"}, t("m613")),
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
      width: 150,
    },
    {
      title: h("div", {class:"toopTipStyle2"}, t("n1537")),
      dataIndex: "sourceTransactionStatus",
      key: "sourceTransactionStatus",
      align: "center",
      width: 150,
    },
    {
      title: t("m694"),
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 150,
    },
    {
      title: t("n1535"),
      dataIndex: "transactionCreateTime",
      key: "transactionCreateTime",
      align: "center",
      width: 150,
    },
    {
      title: t("n1536"),
      dataIndex: "transactionUpdateTime",
      key: "transactionUpdateTime",
      align: "center",
      width: 150,
    },
    // {
    //   title: t("n316"),
    //   dataIndex: "mode",
    //   key: "mode",
    //   align: "center",
    //   width: 120,
    // },
    // {
    //   title: t("operation"),
    //   dataIndex: "operate",
    //   key: "operate",
    //   align: "center",
    //   width: 120,
    //   fixed: 'right',
    // },
  ];
  // const pagination = ref({
  //   total: 0,
  //   current: 1,
  //   pageSize: 20,
  //   showSizeChanger: true,
  //   showTotal: (total: any) => t("total", [total]),
  // });
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
    api: kycReversalWaterAdminListPage,
    defaultPageSize: 20,
    filterRules: [
      // { key: "sourceType" },
    ],
    afterFetch: (data) => data.map((item: any) => {
      item.isDefaultTId = item.tid && item.tid.slice(0, 7) == 'DEFAULT' ? 1 : 0;
      return item;
    }),
  });
const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};
  onMounted(() => {
    getGroupList();
    getList();
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
  