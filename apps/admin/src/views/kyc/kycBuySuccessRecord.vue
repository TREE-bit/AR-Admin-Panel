<template>
    <div class="search">
      <h2>{{ $getMenuName() }}</h2>
      <a-row style="margin: 0 0 15px 0">
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.buyerMemberId"
            allow-clear
            class="searchstyle"
            :placeholder="$t('m562')+$t('n295')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            allow-clear
            class="searchstyle"
            v-model:value="query.buyUpiId"
            :placeholder="$t('m562')+'UPI-ID'"
          />
        </a-col>
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
        <template v-if="column.key === 'memberId'">
          <a-button v-if="record.memberId" type="link" class="copyContent" @click="showMember(record.memberId)">{{
            record.memberId
          }}</a-button>
          <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'successCount'">
          <a-button v-if="record.successCount" type="link" class="copyContent" @click="showRecordLog(record)">{{
            record.successCount
          }}</a-button>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'upiId'">
          {{ record.upiId || '-' }}
          <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />
        </template>
        <template v-if="column.key === 'phoneNumber'">
          {{ record.phoneNumber || '-' }}
        </template>
        <template v-if="column.key === 'latestConnectTime'">
          {{ record.latestConnectTime || '-' }}
        </template>
        <template v-if="column.key === 'lastDisconnectTime'">
          {{ record.lastDisconnectTime || '-' }}
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
    <!-- 成功日志 -->
    <a-modal
      v-model:open="successLogModel"
      :footer="null"
      wrap-class-name="full-modal"
      width="100%"
      @cancel="cancelSuccessLog"
    >
      <kycBuySuccessRecordLog
        v-if="successLogModel"
        :successRecord="successRecord"
      />
    </a-modal>
  </template>
  <script lang="ts" setup>
  import { onMounted, ref, h } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import {
    buyPaymentSuccessRecordForAdminBuySuccessUpiListPage,
    getKycBankCodeList,
  } from "@/api";
  import { useI18n } from "vue-i18n";
  import memberDetail from "@/components/Member/memberDetail.vue";
  import kycBuySuccessRecordLog from "./components/kycBuySuccessRecordLog.vue";
  import { getStartAndEndOfDay } from "@/plugins/dataMap";
  import { useTabHeight } from "@/hooks/useTabHeight.hooks";
  import { useTableData } from "@/hooks/useTableData.hook";
  import { orderSourceMap, buyOrderTypeMap, buyOrderTypeColorMap } from "@/utils/publicData";
  const { getTabH } = useTabHeight();
  const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
  const { t } = useI18n();
  const detailModel = ref(false);
  const detailId = ref({
    id: 0,
    memberId: 0,
  });
  const query = ref({
    asc: false,
    column: "",
    pageNo: 1,
    pageSize: 20,
    bankCode: undefined,
    buyUpiId: undefined,
    buyerMemberId: undefined,
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
      title: t("e47"),
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 90,
      customRender: ({ index }:{index:any}) => index + 1,
    },
    {
      title: t("n295"),
      dataIndex: "memberId",
      key: "memberId",
      align: "center",
      width: 140,
    },
    {
      title: 'UPI-ID',
      dataIndex: "upiId",
      key: "upiId",
      align: "center",
      width: 140,
    },
    // {
    //   title: t("l35"),
    //   dataIndex: "phoneNumber",
    //   key: "phoneNumber",
    //   align: "center",
    //   width: 140,
    // },
    {
      title: t("n1451"),
      dataIndex: "successCount",
      key: "successCount",
      align: "center",
      width: 120,
    },
    {
      title: t("m582"),
      dataIndex: "bankCode",
      key: "bankCode",
      align: "center",
      width: 140,
    },
    {
      title: t("n1452"),
      dataIndex: "latestConnectTime",
      key: "latestConnectTime",
      align: "center",
      width: 140,
    },
    {
      title: t("m980"),
      dataIndex: "lastDisconnectTime",
      key: "lastDisconnectTime",
      align: "center",
      width: 140,
    },
  ];
  const showMember = (id: any) => {
    detailModel.value = true;
    detailId.value.id = id;
  };
  const {
    dataSource,
    pagination,
    loading,
    handleTableChange,
    getList,
    resetQuery,
  } = useTableData({
    query,
    api: buyPaymentSuccessRecordForAdminBuySuccessUpiListPage,
    defaultPageSize: 20,
    resDataType: 2,
    filterRules: [],
  });
  // 成功日志
  const successLogModel = ref(false);
  const successRecord = ref<any>({});
  const showRecordLog = (record: any) => {
    successLogModel.value = true;
    successRecord.value = record;
  };
  const cancelSuccessLog = () => {
    successLogModel.value = false;
    successRecord.value = {};
  };
  // 获取银行编码列表
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
</style>
  