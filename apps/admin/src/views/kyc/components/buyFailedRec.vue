<template>
  <div class="search">
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m149')"
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
        <a-input v-trim
          v-model:value="query.phoneNumber"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m960')"
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
          v-model:value="query.sellerOrderId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n40')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.tId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m635')"
        />
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
      <template v-if="column.key === 'kycId'">
        {{ record.kycId || "-" }}
      </template>
      <template v-if="column.key === 'memberId'">
        <a-button v-if="record.memberId" style="padding:0" type="link" @click="showMember(record.memberId)">
          {{ record.memberId }}
        </a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
        <span v-else>-</span>
      </template>
      
      <template v-if="column.key === 'appealId'">
        <a-button v-if="record.appealId" type="link" @click="goPath(0,hasPro('/order/appeal/index'),record.appealId)">{{ record.appealId }}</a-button>
        <CopyOutlined v-if="record.appealId" class="copyId"  @click="$copyId(record.appealId)" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'createBy'">
        {{
          record.updateBy ? record.updateBy : record.createBy
        }}
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
    <template v-if="column.key === 'buyerOrderId'">
      <a-tooltip v-if="record.buyerOrderId">
        <template #title>{{ record.buyerOrderId }}</template>
        <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.buyerOrderId }}</div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'utr'">
      <a-tooltip v-if="record.utr">
        <template #title>
            <div>
              {{ record.utr }}
              <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
            </div>
            <div style="color: #9d9d9d;">
              {{ record.payeeFlag }}
            </div>
        </template>
        <div style="text-overflow: ellipsis;overflow: hidden;">
          {{ record.utr }}
          <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          <div style="text-overflow: ellipsis;overflow: hidden;color: #9d9d9d;">{{ record.payeeFlag }}</div>
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'recipientType'">
        {{ $getMapItem(recipientTypeMap,record.recipientType) || '-' }}
    </template>
    <template v-if="column.key === 'misTypedUtr'">
      <span :class="record.misTypedUtr == 1 ? 'tag-red' : record.misTypedUtr == 0 ? 'tag-green' : ''">
        {{ record.misTypedUtr == 1 ? $t('yes') : record.misTypedUtr == 0 ? $t('no') : '-' }}
      </span>
    </template>
    <template v-if="column.key === 'misTypedUtrCompleted'">
      <span :class="record.misTypedUtrCompleted == 1 ? 'tag-green' : 'tag-red'">
        {{ record.misTypedUtrCompleted == 1 ? $t('yes') : $t('no') }}
      </span>
    </template>
    <template v-if="column.key === 'misTypedUtrOrder'">
      <a-tooltip v-if="record.misTypedUtrOrder && record.misTypedUtrOrder.length">
        <template #title>
          <a-tag color="red" v-for="(item,index) in record.misTypedUtrOrder" 
            :key="index" style="margin-right:4px; margin-bottom:4px;">
            {{ item }}
            <CopyOutlined v-if="item" class="copyId"  @click="$copyId(item)" />
          </a-tag>
        </template>
        <div class="toopTipStyle2">
          <a-tag color="red" v-for="(item,index) in record.misTypedUtrOrder" 
            :key="index" style="margin-right:4px; margin-bottom:4px;">
            {{ item }}
            <CopyOutlined v-if="item" class="copyId"  @click="$copyId(item)" />
          </a-tag>
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'sellerOrderId'">
      <a-tooltip v-if="record.sellerOrderId">
        <template #title>{{ record.sellerOrderId }}</template>
        <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.sellerOrderId }}</div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'amount'">
      {{ currency(record.amount,false) }}
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
    <template v-if="column.key === 'phoneNumber'">
      {{ record.phoneNumber || "-" }}
    </template>
    <template v-if="column.key === 'bankCardNumber'">
      {{ record.bankCardNumber || "-" }}
    </template>
    <template v-if="column.key === 'ifscCode'">
      {{ record.ifscCode || "-" }}
    </template>
    <template v-if="column.key === 'cardOwnerName'">
      <a-tooltip v-if="record.cardOwnerName">
        <template #title>{{ record.cardOwnerName }}</template>
        <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.cardOwnerName }}</div>
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
    <template v-if="column.key === 'replenishmentFlag'">
      <span :class="record.replenishmentFlag == 1 ? 'tag-green' : ''">
        {{ record.replenishmentFlag == 1 ? $t('n313') : '-' }}
      </span>
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
</template>
<script lang="ts" setup>
import { onMounted, ref, h} from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  getKycBankCodeList,
  kycPartnerBuyAppealPaymentAdminFailedListPage,
} from "@/api";
import { currency } from "@/utils/index";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { useRoute } from "vue-router";
import memberDetail from "@/components/Member/memberDetail.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
const { t } = useI18n();
const detailModel = ref(false);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const recipientTypeMap:any = {
  1: t('n625'),//快捷提现-银行卡
  3: t('n624'),//快捷提现-UPI
}
const isMatchMap:any = {
  0: 'm697',//未匹配
  1: 'm696',//已匹配
  2: 'm806',//手动匹配
  3: 'm917',//金额异常
}
const query = ref({
  asc: false,
  column: "",
  endTime: endIndiaTime,
  startTime: startIndiaTime,
  selectType: 2,
  kycId: undefined,
  memberId: undefined,
  appealId: undefined,
  // upiName: undefined,
  bankCode: undefined,
  phoneNumber: undefined as any,
  payer: undefined,
  recipient: undefined,
  utr: undefined,
  isMatch: undefined,
  buyerOrderId: undefined,
  sellerOrderId: undefined,
  pageNo: 1,
  pageSize: 20,
  randomCode: undefined,
  tId: undefined,
  replenishmentFlag: undefined,
  misTypedUtr: undefined,
  misTypedUtrOrder: undefined,
  misTypedUtrCompleted: undefined,
  recipientType: undefined,
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
  //   title: 'KYC ID',
  //   dataIndex: "kycId",
  //   key: "kycId",
  //   align: "center",
  //   width: 100,
  // },
  {
    title: t("m149"),
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
    width: 120,
  },
  {
    title: t("m960"),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
    width: 140,
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
    title: t("b27"),
    dataIndex: "recipientType",
    key: "recipientType",
    align: "center",
    width: 150,
  },
  {
    title: t("n1332"),
    dataIndex: "misTypedUtr",
    key: "misTypedUtr",
    align: "center",
    width: 150,
  },
  {
    title: t("n1333"),
    dataIndex: "misTypedUtrOrder",
    key: "misTypedUtrOrder",
    align: "center",
    width: 240,
  },
  {
    title: t("n1412"),
    dataIndex: "misTypedUtrCompleted",
    key: "misTypedUtrCompleted",
    align: "center",
    width: 150,
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
    title: t("n41"),
    dataIndex: "buyerOrderId",
    key: "buyerOrderId",
    align: "center",
    width: 180,
  },
  {
    title: t("n40"),
    dataIndex: "sellerOrderId",
    key: "sellerOrderId",
    align: "center",
    width: 180,
  },
  {
    title: t("n649"),
    dataIndex: "bankCardNumber",
    key: "bankCardNumber",
    align: "center",
    width: 150,
  },
  {
    title: t("n650"),
    dataIndex: "ifscCode",
    key: "ifscCode",
    align: "center",
    width: 120,
  },
  {
    title: t("m662"),
    dataIndex: "cardOwnerName",
    key: "cardOwnerName",
    align: "center",
    width: 120,
  },
  {
    title: t("m695"),
    dataIndex: "isMatch",
    key: "isMatch",
    align: "center",
    width: 120,
  },
  {
    title: t("n316"),
    dataIndex: "replenishmentFlag",
    key: "replenishmentFlag",
    align: "center",
    width: 120,
  },
];
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};
const {
  dataSource,
  extendData,
  pagination,
  loading,
  response,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  handleQueryFields: (q) => ({
    ...q,
    selectType: 2,
  }),
  api: kycPartnerBuyAppealPaymentAdminFailedListPage,
  fetchType: 1,
  defaultPageSize: 20,
  filterRules: [],
  afterFetch: (data) =>
    data.map((item: any) => {
      item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
      return item;
    }),
});

const search = () => {
  getList(1);
}

const groupList = ref([])
const getGroupList = async () => {
const res:any = await getKycBankCodeList();
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
  if(!isGo) return;
  const goMap = [
    {name:'_order_appeal_index', query: {appealId: val}},
  ];
  router.push(goMap[pathType])
}
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
