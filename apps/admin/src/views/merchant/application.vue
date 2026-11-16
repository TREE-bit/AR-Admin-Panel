<template>
  <div class="search">
    <h2>{{ $t("m27") }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.username"
          class="searchstyle"
          :placeholder="$t('p13')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.orderNo"
          class="searchstyle"
          :placeholder="$t('p14')"
        />
      </a-col>
      <!-- <a-col :span="6">
        <a-range-picker
          show-time
          class="searchstyle"
          v-model:value="searchDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('publicStartTime'), $t('publicEndTime')]"
        />
      </a-col> -->
      <a-col>
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('l95')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(query, 1)"
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
    :scroll="{ x: '100%' , y: getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'usdtAddr'">
        <a-tooltip>
          <template #title>{{ record.usdtAddr }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.usdtAddr }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'action'">
        <a-popconfirm
          :title="$t('m147')"
          :ok-text="$t('b9')"
          :cancel-text="$t('b10')"
          @confirm="agree(record)"
        >
          <a-tag
            color="rgba(14, 186, 139, 1)"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:applyDistributedAdmin:distribute'" 
            >{{ $t("agree") }}
          </a-tag>
        </a-popconfirm>
        <a-tag
          color="rgba(253, 11, 26, 1)"
          style="cursor: pointer"
          size="small"
          @click="unagreed(record)"
          v-permission="'admin:applydistributedadmin:nodistribute'" 
          >{{ $t("reject") }}
        </a-tag>
      </template>
    </template>
    <template #summary>
      <a-table-summary fixed="bottom">
      <a-table-summary-row>
        <a-table-summary-cell :col-span="1" align="center"> {{ $t("m54") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="4" />
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger">{{ currency(extendData.balancePageTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger">{{ currency(extendData.amountPageTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="2" />
      </a-table-summary-row>
      <a-table-summary-row>
        <a-table-summary-cell :col-span="1" align="center">{{ $t("m55") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="4" />
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger"> {{ currency(extendData.balanceTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger"> {{ currency(extendData.amountTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="2" />
      </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  applyDistributedAdminListApi,
  distributeApi,
  nodistributeApi,
} from "@/api/merchant.api";
import { onMounted, ref, h, computed, reactive } from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { currency } from "@/utils";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const extendData = ref({});
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 100,
  },
  {
    title: t("m209"),
    dataIndex: "orderNo",
    key: "orderNo",
    align: "center",
    width: 220,
  },
  {
    title: t("l91"),
    dataIndex: "merchantCode",
    key: "merchantCode",
    align: "center",
    width: 140,
  },
  {
    title: t("l91"),
    dataIndex: "username",
    key: "username",
    align: "center",
    width: 140,
  },
  {
    title: t("n33"),
    dataIndex: "usdtAddr",
    key: "usdtAddr",
    align: "center",
    ellipsis: true,
    width: 280,
  },
  {
    title: t("l93"),
    dataIndex: "balance",
    key: "balance",
    align: "center",
    width: 180,
  },
  {
    title: t("l94"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 180,
  },
  {
    title: t("l95"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 170,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    width: 160,
    align: "center",
  },
];
const loading = ref(false);
const dataSource = ref([]);
const query = ref({
  endTime: "",
  username: "",
  orderNo: "",
  pageNo: 1,
  pageSize: 20,
  startTime: "",
});
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const resetQuery = async () => {
  query.value = {
    endTime: "",
    username: "",
    orderNo: "",
    pageNo: 1,
    pageSize: 20,
    startTime: "",
  };
  pagination.current = 1;
  pagination.pageSize = 20;
  getList(query.value);
};
const searchDate = computed({
  get: () => {
    return [query.value.startTime, query.value.endTime];
  },
  set: (val) => {
    query.value.startTime = val ? val[0] : "";
    query.value.endTime = val ? val[1] : "";
  },
});
const getList = async (query: any, isFirst: any = null) => {
  if (isFirst) {
    query.pageNo = 1;
    pagination.current = 1;
  }
  loading.value = true;
  pagination.current = query.pageNo;
  pagination.pageSize = query.pageSize;
  const res: any = await applyDistributedAdminListApi(query).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data.map((item: any) => {
      item.amount = currency(item.amount, false);
      item.balance = currency(item.balance, false);
      return item;
    });
    extendData.value = res.extend;
    pagination.total = res.total;
  }
};
const agree = async (val: any) => {
  const res: any = await distributeApi({ id: val.id });
  if (res && res.code === "1") {
    message.success(t("s12"));
    getList(query.value);
  }
};
const unagreed = async (val: any) => {
  const res: any = await nodistributeApi({ id: val.id });
  if (res && res.code === "1") {
    message.success(t("s13"));
    getList(query.value);
  }
};
const handleTableChange: any = (value: {
  pageSize: number;
  current: number;
}) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  pagination.current = current;
  if (pageSize != query.value.pageSize) {
    query.value.pageSize = pageSize;
    pagination.pageSize = pageSize;
    query.value.pageNo = 1;
    pagination.current = 1;
  }
  getList(query.value);
};
onMounted(() => {
  getList(query.value);
  getTabH.value = useTabHeight().getTabH.value;
});
</script>
<style scoped>
</style>
