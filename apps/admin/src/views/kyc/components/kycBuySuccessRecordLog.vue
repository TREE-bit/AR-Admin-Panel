<template>
    <div class="search">
      <h2>{{ $t('n1450') }}</h2>
      <a-row style="margin: 0 0 15px 0">
        <a-col :span="3">
          <a-input v-trim
            allowClear
            v-model:value="query.collectionOrderNo"
            class="searchstyle"
            :placeholder="$t('p47')"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="query.sourceOrderType"
            :placeholder="$t('n626')"
            :options="Object.keys(orderSourceMap).map(key => ({ label: $t(orderSourceMap[key]), value: key }))"
          ></a-select>
        </a-col>
        <!-- <a-col :span="3">
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
        </a-col> -->
        <a-col>
          <timeRange v-model:startTime="query.finishStartTime" v-model:endTime="query.finishEndTime"  :title="$t('m734')" :type="1"/>
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
        <template v-if="column.key === 'payer'">
          {{ record.payer || '-' }}
          <CopyOutlined v-if="record.payer" class="copyId"  @click="$copyId(record.payer)" />
        </template>
        <template v-if="column.key === 'payee'">
          {{ record.payee || '-' }}
          <CopyOutlined v-if="record.payee" class="copyId"  @click="$copyId(record.payee)" />
        </template>
        <template v-if="column.key === 'buyerOrderId'">
          <a-tooltip>
            <template #title>
              <div>
                <!-- {{ $t('n104') }}： -->
                {{ record.buyerOrderId || '-' }}
              </div>
              <!-- <div>
                {{ $t('n100') }}：{{ record.sellOrderId || '-' }}
              </div>
              <div>
                {{ $t('n948') }}：{{ record.appealId || '-' }}
              </div>
              <div>
                {{ $t('m11') }}：{{ record.matchingOrderId || '-' }}
              </div> -->
            </template>
            <div class="toopTipStyle">
              <!-- {{ $t('n104') }}： -->
              {{ record.buyerOrderId || '-' }}
              <CopyOutlined v-if="record.buyerOrderId" class="copyId"  @click="$copyId(record.buyerOrderId)" />
            </div>
            <!-- <div class="toopTipStyle tableText">
              {{ $t('n100') }}：{{ record.sellOrderId || '-' }}
            </div>
            <div class="toopTipStyle tableText">
              {{ $t('n948') }}：{{ record.appealId || '-' }}
            </div>
            <div class="toopTipStyle tableText">
              {{ $t('m11') }}：{{ record.matchingOrderId || '-' }}
            </div> -->
          </a-tooltip>
        </template>
        <template v-if="column.key === 'amount'">
          {{ thousand(record.amount) }}
        </template>
        <template v-if="column.key === 'sourceOrderType'">
          {{ $t($getMapItem(orderSourceMap,record.sourceOrderType) || '-') }}
        </template>
        <template v-if="column.key === 'payTime'">
          {{ record.payTime || '-' }}
        </template>
        <template v-if="column.key === 'orderFinishTime'">
          {{ record.orderFinishTime || '-' }}
        </template>
      </template>
    </a-table>
  </template>
  <script lang="ts" setup>
  import { onMounted, ref, h } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import {
    buyPaymentSuccessRecordForAdminBuyListPageRecord,
    getKycBankCodeList,
  } from "@/api";
  import { useI18n } from "vue-i18n";
  import { getStartAndEndOfDay } from "@/plugins/dataMap";
  import { useTabHeight } from "@/hooks/useTabHeight.hooks";
  import { useTableData } from "@/hooks/useTableData.hook";
  import { thousand } from "@/utils";
  import { orderSourceMap } from "@/utils/publicData";
  const { getTabH } = useTabHeight();
  const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
  const { t } = useI18n();
  const props = defineProps<{
    successRecord: any
  }>();
  const query = ref({
    asc: false,
    column: "",
    pageNo: 1,
    pageSize: 20,
    bankCode: undefined,
    buyUpiId: props.successRecord.buyUpiId || '000',
    buyerMemberId: props.successRecord.buyMemberId || '000',
    collectionOrderNo: undefined,
    sourceOrderType: undefined,
    finishStartTime: '',
    finishEndTime: '',
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
      title: t("p47"),
      dataIndex: "buyerOrderId",
      key: "buyerOrderId",
      align: "center",
      width: 140,
    },
    {
      title: t('n1237'),
      dataIndex: "payer",
      key: "payer",
      align: "center",
      width: 140,
    },
    {
      title: t("m36"),
      dataIndex: "payee",
      key: "payee",
      align: "center",
      width: 140,
    },
    // {
    //   title: t("m582"),
    //   dataIndex: "bankCode",
    //   key: "bankCode",
    //   align: "center",
    //   width: 140,
    // },
    {
      title: t("n626"),
      dataIndex: "sourceOrderType",
      key: "sourceOrderType",
      align: "center",
      width: 120,
    },
    {
      title: t("m374"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: 140,
    },
    // {
    //   title: t("n1453"),
    //   dataIndex: "payTime",
    //   key: "payTime",
    //   align: "center",
    //   width: 140,
    // },
    {
      title: t("m734"),
      dataIndex: "orderFinishTime",
      key: "orderFinishTime",
      align: "center",
      width: 140,
    },
  ];
  const {
    dataSource,
    pagination,
    loading,
    handleTableChange,
    getList,
    resetQuery,
  } = useTableData({
    query,
    handleQueryFields(query) {
      const q = { ...query };
      q.buyUpiId = props.successRecord.upiId || '000';
      q.buyerMemberId = props.successRecord.memberId || '000';
      return q;
    },
    api: buyPaymentSuccessRecordForAdminBuyListPageRecord,
    defaultPageSize: 20,
    resDataType: 2,
    filterRules: [],
  });

  const groupList = ref([])
  const getGroupList = async () => {
    const res: any = await getKycBankCodeList();
    if (res && res.code === "1") {
      groupList.value =res.data|| [];
    }
  };
  onMounted(() => {
    console.log('props.successRecord',props.successRecord);
    getGroupList();
    getList();
    getTabH.value = useTabHeight(3,40).getTabH.value;
  });
</script>
<style lang="less" scoped> 
</style>
  