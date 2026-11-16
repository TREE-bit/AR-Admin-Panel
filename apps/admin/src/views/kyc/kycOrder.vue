<template>
  <div class="search">
    <a-row style="margin: 0 0 15px 0">
      <a-col :span="4">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.bankCode"
          :placeholder="$t('m562')+$t('m582')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.buyerMemberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n41')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.buyerMemberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m149')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.buyerOrderId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n41')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.orderId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m608')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.payerUpi"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m609')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.recipientUpi"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m611')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.sellerMemberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m150')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.sellerOrderId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n40')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.utr"
          class="searchstyle"
          :placeholder="$t('m562')+' UTR'"
        />
      </a-col>
      <a-col :span="4">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.transactionType"
          :placeholder="$t('m563')+$t('m67')"
        >
          <a-select-option
            v-for="(item, key) in transactionTypeMap"
            :value="key"
            :key="item"
            >{{ $t(item) }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="5">
        <a-range-picker
          show-time
          v-model:value="paymentTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m172')]"
        />
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
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :scroll="{ x: '100%',y:'600px' }"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'buyerMemberId'">
        <a-button type="link" @click="showMember(record.buyerMemberId)">{{
          record.buyerMemberId
        }}</a-button>
      </template>
      <template v-if="column.key === 'sellerMemberId'">
        <a-button type="link" @click="showMember(record.sellerMemberId)">{{
          record.sellerMemberId
        }}</a-button>
      </template>
      <template v-if="column.key === 'transactionStatus'">
        {{
          transactionStatusMap[record.transactionStatus]
        }}
      </template>
      <template v-if="column.key === 'transactionType'">
        {{
          transactionTypeMap[record.transactionType]
        }}
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
      <template v-if="column.key === 'buyerOrderId'">
        <a-button
          type="link"
          @click="goAssemble(record.buyerOrderId, true)"
          >{{ record.buyerOrderId }}</a-button
        >
      </template>
      <template v-if="column.key === 'sellerOrderId'">
        <a-button
          type="link"
          @click="goAssemble(record.sellerOrderId, false)"
          >{{ record.sellerOrderId }}</a-button
        >
      </template>
      <template v-if="column.key === 'operate'">
        <!-- <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="checkDetail(record)"
          v-permission="'admin:collectionOrderAdmin:getInfo'"
          >{{ $t("b23") }}
        </a-tag> -->
      </template>
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
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { kycApprovedOrderAdminListPage } from "@/api/kycConfig.api";
import { formatTime, currency } from "@/utils/index";
import { useI18n } from "vue-i18n";
import memberDetail from "@/components/Member/memberDetail.vue";
import router from "@/router";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
const dataSource = ref([]);
const extendData = ref<any>({});
const loading = ref(false);
const merchantList = ref([]);
const detailModel = ref(false);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const query = ref<any>({
  asc: '',
  column: '',
  endTime: endIndiaTime,
  startTime: startIndiaTime,
  pageNo: 1,
  pageSize: 10,
  bankCode: null,
  buyerMemberId: null,
  buyerOrderId: null,
  orderId: null,
  payerUpi: null,
  recipientUpi: null,
  sellerMemberId: null,
  sellerOrderId: null,
  transactionType: null,
  utr: null,
});
const columns:any = [
  {
    title: t("id"),
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 120,
  },
  {
    title: t("utr"),
    dataIndex: "utr",
    key: "utr",
    align: "center",
    width: 180,
  },
  {
    title: "kyc ID",
    dataIndex: "kycId",
    key: "kycId",
    align: "center",
    width: 180,
  },
  {
    title: t("m608"),
    dataIndex: "orderId",
    key: "orderId",
    align: "center",
    width: 260,
  },
  {
    title: t("m149"),
    dataIndex: "buyerMemberId",
    key: "buyerMemberId",
    align: "center",
    width: 120,
  },
  {
    title: t("n41"),
    dataIndex: "buyerOrderId",
    key: "buyerOrderId",
    align: "center",
    width: 260,
  },
  {
    title: t("m150"),
    dataIndex: "sellerMemberId",
    key: "sellerMemberId",
    align: "center",
    width: 120,
  },
  {
    title: t("n40"),
    dataIndex: "sellerOrderId",
    key: "sellerOrderId",
    align: "center",
    width: 260,
  },
  {
    title: t("m609"),
    dataIndex: "payerUpi",
    key: "payerUpi",
    align: "center",
    width: 260,
  },
  {
    title: t("m610"),
    dataIndex: "recipientName",
    key: "recipientName",
    align: "center",
    width: 200,
  },
  {
    title: t("m611"),
    dataIndex: "recipientUpi",
    key: "recipientUpi",
    align: "center",
  },
  {
    title: t("m612"),
    dataIndex: "recipientAccount",
    key: "recipientAccount",
    align: "center",
    width: 200,
  },
  {
    title: t("m613"),
    dataIndex: "transactionStatus",
    key: "transactionStatus",
    align: "center",
    width: 140,
  },
  {
    title: t("m67"),
    dataIndex: "transactionType",
    key: "transactionType",
    align: "center",
    width: 140,
  },
  {
    title: t("m614"),
    dataIndex: "bankTransactionTime",
    key: "bankTransactionTime",
    align: "center",
    width: 200,
  },
  {
    title: t("m615"),
    dataIndex: "walletTransactionTime",
    key: "walletTransactionTime",
    align: "center",
    width: 200,
  },
];
const transactionTypeMap:any = {
  1:t('m616'),
  2:t('m617'),
}
const transactionStatusMap:any = {
  0:t('m618'),
  1:t('m619'),
}
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const search = () => {
  pagination.value.current = 1;
  query.value.pageNo = 1;
  getList(query.value)
}
const paymentTime = computed({
  get: () => {
    return [query.value.startTime, query.value.endTime];
  },
  set: (val) => {
    query.value.startTime = val ? val[0] : "";
    query.value.endTime = val ? val[1] : "";
  },
});
const getList = async (query: any) => {
  loading.value = true;
  const res: any = await kycApprovedOrderAdminListPage(Object.assign(query)).finally(()=>{loading.value = false;});
  if (res && res.code === "1") {
    dataSource.value = res.data;
    extendData.value = res.extend;
    pagination.value.total = res.total;
  }
};

const goAssemble = (id: any, isrecharge: boolean = true) => {
  const query: any = {};
  if (isrecharge) {
    query.recharge = id;
  } else {
    query.withdraw = id;
  }
  router.push({ path: "/order/assemble/index", query });
};

const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
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
const resetQuery = () => {
  query.value = {
    asc: '',
    column: '',
    endTime: "",
    startTime: "",
    pageNo: 1,
    pageSize: 10,
    bankCode: null,
    buyerMemberId: null,
    buyerOrderId: null,
    orderId: null,
    payerUpi: null,
    recipientUpi: null,
    sellerMemberId: null,
    sellerOrderId: null,
    transactionType: null,
    utr: null,
  };
  pagination.value.pageSize = 10;
  pagination.value.current =1;
  getList(query.value);
};

onMounted(() => {
  getList(query.value);
});
</script>
<style lang="less" scoped>
:deep(.windActive){
  font-weight: 600;
  color: red;
}
</style>
