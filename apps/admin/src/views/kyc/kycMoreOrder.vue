<template>
    <div class="search">
      <h2>{{ $getMenuName() }}</h2>
      <a-row style="margin: 0 0 15px 0">
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.tid"
            class="searchstyle"
            :placeholder="'TID'"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            v-model:value="query.utr"
            :placeholder="'UTR'"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="query.flowType"
            :placeholder="$t('n1255')"
            :options="Object.keys(flowTypeMap).map(key => ({ value: Number(key), label: flowTypeMap[key] }))"
          >
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            v-model:value="query.payeeAccount"
            :placeholder="$t('n1291')"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="query.processResult"
            :placeholder="$t('n895')"
            :options="Object.keys(processResultMap).map(key => ({ value: Number(key), label: processResultMap[key] }))"
          >
          </a-select>
        </a-col>
        <a-col>
          <timeRange v-model:startTime="query.processTimeGe" v-model:endTime="query.processTimeLe"  :title="$t('n1292')" :type="1"/>
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
        <template v-if="column.key === 'buyerId'">
          <a-button v-if="record.buyerId" type="link" class="copyContent" @click="showMember(record.buyerId)">{{
            record.buyerId
          }}</a-button>
          <CopyOutlined v-if="record.buyerId" class="copyId"  @click="$copyId(record.buyerId)" />
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'processResult'">
          <div class="toopTipStyle3">
            <span :style="[7,8].includes(record.processResult) ? 'color:green' : 'color:red'">
              {{ processResultMap[record.processResult] || '-' }}
            </span>
          </div>
        </template>
        <template v-if="column.key === 'flowType'">
          {{ flowTypeMap[record.flowType] || '-' }}
        </template>
        <template v-if="column.key === 'payeeAccount'">
          <a-tooltip v-if="record.payeeAccount">
            <template #title>
              {{ record.payeeAccount }}
              <CopyOutlined v-if="record.payeeAccount" class="copyId"  @click="$copyId(record.payeeAccount)" />
            </template>
            <div class="toopTipStyle2">
              {{ record.payeeAccount }}
              <CopyOutlined v-if="record.payeeAccount" class="copyId"  @click="$copyId(record.payeeAccount)" />
            </div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'utr'">
          <a-tooltip v-if="record.utr">
            <template #title>{{ record.utr }}</template>
            <div class="toopTipStyle2">{{ record.utr }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'tid'">
          <a-tooltip v-if="record.tid">
            <template #title>{{ record.tid }}</template>
            <div class="toopTipStyle2">{{ record.tid }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'bankTransactionTime'">
          {{ record.bankTransactionTime || '-' }}
        </template>
        <template v-if="column.key === 'processTime'">
          {{ record.processTime || '-' }}
        </template>
        <template v-if="column.key === 'buyerFailedFinishOrder'">
          <div class="orderInfoBox" v-if="record.buyerFailedFinishOrder">
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n41') }}：</div>
              <div class="orderInfo-content">{{ record.buyerFailedFinishOrder.buyOrderNo || '-' }}</div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n581') }}：</div>
              <div class="orderInfo-content">
                <span :class="$getMapItem(buyOrderTypeColorMap,record.buyerFailedFinishOrder.buyOrderType)">
                  {{ $t($getMapItem(buyOrderTypeMap,record.buyerFailedFinishOrder.buyOrderType) || '-') }}
                </span>
              </div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('m807') }}：</div>
              <div class="orderInfo-content">{{ record.buyerFailedFinishOrder.chOrderNo || '-' }}</div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n626') }}：</div>
              <div class="orderInfo-content">
                <span :class="record.buyerFailedFinishOrder.orderFrom == 1 ? 'tag-green' : 'tag-blue'">
                  {{ $t($getMapItem(orderSourceMap,record.buyerFailedFinishOrder.orderFrom) || '-') }}
                </span>
              </div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n40') }}：</div>
              <div class="orderInfo-content">{{ record.buyerFailedFinishOrder.sellOrderNo || '-' }}</div>
            </div>
          </div>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'utrOrder'">
          <div class="orderInfoBox" v-if="record.utrOrder">
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n41') }}：</div>
              <div class="orderInfo-content">{{ record.utrOrder.buyOrderNo || '-' }}</div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n581') }}：</div>
              <div class="orderInfo-content">
                <span :class="$getMapItem(buyOrderTypeColorMap,record.utrOrder.buyOrderType)">
                  {{ $t($getMapItem(buyOrderTypeMap,record.utrOrder.buyOrderType) || '-') }}
                </span>
              </div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('m807') }}：</div>
              <div class="orderInfo-content">{{ record.utrOrder.chOrderNo || '-' }}</div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n626') }}：</div>
              <div class="orderInfo-content">
                <span :class="record.utrOrder.orderFrom == 1 ? 'tag-green' : 'tag-blue'">
                  {{ $t($getMapItem(orderSourceMap,record.utrOrder.orderFrom) || '-') }}
                </span>
              </div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n40') }}：</div>
              <div class="orderInfo-content">{{ record.utrOrder.sellOrderNo || '-' }}</div>
            </div>
          </div>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'tidOrder'">
          <div class="orderInfoBox" v-if="record.tidOrder">
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n41') }}：</div>
              <div class="orderInfo-content">{{ record.tidOrder.buyOrderNo || '-' }}</div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n581') }}：</div>
              <div class="orderInfo-content">
                <span :class="$getMapItem(buyOrderTypeColorMap,record.tidOrder.buyOrderType)">
                  {{ $t($getMapItem(buyOrderTypeMap,record.tidOrder.buyOrderType) || '-') }}
                </span>
              </div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('m807') }}：</div>
              <div class="orderInfo-content">{{ record.tidOrder.chOrderNo || '-' }}</div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n626') }}：</div>
              <div class="orderInfo-content">
                <span :class="record.tidOrder.orderFrom == 1 ? 'tag-green' : 'tag-blue'">
                  {{ $t($getMapItem(orderSourceMap,record.tidOrder.orderFrom) || '-') }}
                </span>
              </div>
            </div>
            <div class="orderInfo-item">
              <div class="orderInfo-title">{{ $t('n40') }}：</div>
              <div class="orderInfo-content">{{ record.tidOrder.sellOrderNo || '-' }}</div>
            </div>
          </div>
          <span v-else>-</span>
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
        :memberID="detailId.buyMemberId"
        :id="detailId.id"
      />
    </a-modal>
  </template>
  <script lang="ts" setup>
  import { onMounted, ref, h } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import {
    oneWaterMultipleOrderAdminProcessResultList,
    getKycBankCodeList,
  } from "@/api";
  import { useI18n } from "vue-i18n";
  import memberDetail from "@/components/Member/memberDetail.vue";
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
    buyMemberId: 0,
  });
  const query = ref({
    asc: false,
    column: "",
    pageNo: 1,
    pageSize: 20,
    flowType: undefined,
    payeeAccount: undefined,
    processResult: undefined,
    tid: undefined,
    utr: undefined,
    processTimeGe: startIndiaTime,
    processTimeLe: endIndiaTime,
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
      title: t("n227"),
      dataIndex: "buyerId",
      key: "buyerId",
      align: "center",
      width: 140,
    },
    {
      title: t("n1291"),
      dataIndex: "payeeAccount",
      key: "payeeAccount",
      align: "center",
      width: 140,
    },
    {
      title: t("n1255"),
      dataIndex: "flowType",
      key: "flowType",
      align: "center",
      width: 140,
    },
    {
      title: 'TID',
      dataIndex: "tid",
      key: "tid",
      align: "center",
      width: 160,
    },
    {
      title: 'UTR',
      dataIndex: "utr",
      key: "utr",
      align: "center",
      width: 160,
    },
    {
      title: t("n916"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: 120,
    },
    {
      title: t("n895"),
      dataIndex: "processResult",
      key: "processResult",
      align: "center",
      width: 140,
    },
    {
      title: t("n1294"),
      dataIndex: "tidOrder",
      key: "tidOrder",
      align: "center",
      width: 300,
    },
    {
      title: t("n1295"),
      dataIndex: "utrOrder",
      key: "utrOrder",
      align: "center",
      width: 300,
    },
    {
      title: t("n1293"),
      dataIndex: "buyerFailedFinishOrder",
      key: "buyerFailedFinishOrder",
      align: "center",
      width: 300,
    },
    {
      title: t("n1292"),
      dataIndex: "processTime",
      key: "processTime",
      align: "center",
      width: 140,
    },
    {
      title: t("m614"),
      dataIndex: "bankTransactionTime",
      key: "bankTransactionTime",
      align: "center",
      width: 140,
    },
  ];
  const processResultMap = ref<any>({
    1: t("n1296"), // 流水TID不合法
    2: t("n1297"), // 无法匹配撮合订单
    3: t("n1298"), // 流水UTR不合法
    4: t("n1299"), // UTR未被使用
    5: t("n1300"), // TID订单的买方ID和UTR订单中的买方ID不匹配
    6: t("n1301"), // 撮合订单状态不合法
    7: t("n1302"), // 完成TID订单
    8: t("n1303"), // 针对TID订单补单
    9: t("n1304"), // 买家没有失败完结的订单
    10: t("n1305"), // 清除UTR失败
    11: t("n1306"), // 失败UTR订单失败
    12: t("n1307"), // 完成TID订单失败
    13: t("n1308"), // TID订单校验失败
    14: t("n1309"), // 系统异常
    15: t("n1310"), // 针对TID订单补单失败
  });
  const flowTypeMap = ref<any>({
    1: t("n1256"), // 卖方流水
    2: t("n1257"), // 买方流水
  });
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
    api: oneWaterMultipleOrderAdminProcessResultList,
    defaultPageSize: 20,
    filterRules: [],
  });

  // const groupList = ref([])
  // const getGroupList = async () => {
  //   const res: any = await getKycBankCodeList();
  //   if (res && res.code === "1") {
  //     groupList.value =res.data|| [];
  //   }
  // };
  onMounted(() => {
    getList();
    getTabH.value = useTabHeight(3,40).getTabH.value;
  });
</script>
<style lang="less" scoped>
.orderInfoBox{
  .orderInfo-item{
    display: flex;
    margin-bottom: 8px;
    .orderInfo-title{
      font-weight: 600;
      width: auto;
      text-align: left;
    }
    .orderInfo-content{
      flex: 1;
      word-break: break-all;
      text-align: left;
    }
  }
}
</style>
  