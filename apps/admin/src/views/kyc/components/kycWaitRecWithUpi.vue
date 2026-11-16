<template>
  <div class="search">
    <a-row style="margin: 0 0 15px 0">
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.platformOrder"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n47')"
        />
      </a-col>
      <!-- <a-col >
        <timeRange v-model:startTime="query.lastPullTimeStart" v-model:endTime="query.lastPullTimeEnd" :title="$t('m809')" :type="1"/>
      </a-col> -->
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search()"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" style="margin-left: 10px;" @click="resetQuery">{{
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
        <a-button v-if="record.memberId" type="link" @click="showMember(record.memberId)">{{
          record.memberId
        }}</a-button>
        <div v-else>-</div>
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
      <template v-if="column.key === 'upiId'">
        <a-tooltip v-if="record.upiId">
          <template #title>{{ record.upiId }}</template>
          <div class="toopTipStyle">
            {{ record.upiId }}
          </div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'orderStatus'">
        <a-tag>{{ record.orderStatus ? $t(orderStatusMap[Number(record.orderStatus)]) : '' }}</a-tag>
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || "-" }}
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
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { processedListList } from "@/api/kycConfig.api";
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import { getMerchantInfoAdminList } from "@/api/merchant.api";
import { currency } from "@/utils/index";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { orderStatusMap } from "@/utils/publicData";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import memberDetail from "@/components/Member/memberDetail.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
const route = useRoute();
const detailModel = ref(false);
const merchantList = ref([]);
const dataSource = ref([]);
const extendData = ref<any>({});
const loading = ref(false);
const props = defineProps(["upiInfo"]);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const query = ref({
  asc: true,
  column: "",
  pageNo: 1,
  pageSize: 20,
  upiId: props.upiInfo.upiId,
  platformOrder: undefined,
});
const columns:any = [
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  // {
  //   title: t("m582"),
  //   dataIndex: "bankCode",
  //   key: "bankCode",
  //   align: "center",
  //   width: 150,
  // },
  {
    title: 'UPI ID',
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
  },
  {
    title: 'UTR',
    dataIndex: "utr",
    key: "utr",
    align: "center",
    width: 150,
  },
  {
    title: t("n47"),
    dataIndex: "platformOrder",
    key: "platformOrder",
    align: "center",
    width: 170,
  },
  {
    title: t("n42"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 130,
  },
  {
    title: t("state"),
    dataIndex: "orderStatus",
    key: "orderStatus",
    align: "center",
    width: 120,
  },
  {
    title: t("l95"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 170,
  },
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
  const res: any = await processedListList(query.value).catch((err)=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data.map((item: any) => {
      item.amount = currency(item.amount, false);
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
const search = () => {
  query.value.pageNo = 1;
  pagination.value.current = 1;
  getList();
}
const resetQuery = () => {
  query.value = {
    asc: true,
    column: "",
    pageNo: 1,
    pageSize: 20,
    upiId: props.upiInfo.upiId,
    platformOrder: undefined,
  };
  pagination.value.pageSize = 20;
  pagination.value.current = 1;
  clearSelected();
  getList();
};


onMounted(() => {
  getList();
  getTabH.value = useTabHeight(260).getTabH.value;
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
