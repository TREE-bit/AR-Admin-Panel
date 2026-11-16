<template>
  <div class="search">
    <h2>{{ $t("reportReconciliation") }}</h2>
    <a-row class="mb15">
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.merchantCode"
          :options="merchantList"
          :placeholder="$t('m563')+$t('l92')"
        ></a-select>
      </a-col>
      <a-col>
        <timeRange v-if="reportType == 'merchant'" v-model:startTime="merchantTime.startTime" v-model:endTime="merchantTime.endTime" :num="6" :type="2"/>
        <timeRange v-else v-model:startTime="memberTime.startTime" v-model:endTime="memberTime.endTime" :num="6" :type="2"/>
      </a-col>
      <a-col>
        <a-space>
          <a-button
            type="primary"
            :icon="h(SearchOutlined)"
            @click="getList"
            class="ml15"
            >{{ $t("search") }}
          </a-button>
          <a-button type="primary" 
            class="ml15"
           @click="reset">{{
            $t("reset")
          }}</a-button>
          <a-button
            class="ml15"
            :type="reportType == 'merchant' ? 'primary' : ''"
            @click="changeDateType('merchant')"
            >{{ $t('m259') }}</a-button
          >
          <a-button
            class="ml15"
            :type="reportType == 'member' ? 'primary' : ''"
            @click="changeDateType('member')"
            >{{ $t('m260')  }}</a-button
          >
        </a-space>
      </a-col>
    </a-row>
  </div>
  <a-table
    size="middle"
    :dataSource="dataSource"
    :loading="loading"
    :columns="reportType == 'merchant'?columnsMerchant:columnsMember"
    :pagination="paginationConfig"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    bordered
    @change="getChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'merchantType'">
        {{ merchantTypeMap[record.merchantType] }}
      </template>
      <template v-if="column.key === 'merchantBalance'">
        {{ currency(record.merchantBalance, false) }}
      </template>
      <template v-if="column.key === 'memberBalance'">
        {{ currency(record.memberBalance, false) }}
      </template>
      <template v-if="column.key === 'payMoney'">
        {{ currency(record.payMoney, false) }}
      </template>
      <template v-if="column.key === 'withdrawMoney'">
        {{ currency(record.withdrawMoney, false) }}
      </template>
      <template v-if="column.key === 'payFee'">
        {{ currency(record.payFee, false) }}
      </template>
      <template v-if="column.key === 'withdrawFee'">
        {{ currency(record.withdrawFee, false) }}
      </template>
      <template v-if="column.key === 'sellReward'">
        {{ currency(record.sellReward, false) }}
      </template>
      <template v-if="column.key === 'buyReward'">
        {{ currency(record.buyReward, false) }}
      </template>
      <template v-if="column.key === 'usdtBuyMoney'">
        {{ currency(record.usdtBuyMoney, false) }}
      </template>
      <template v-if="column.key === 'taskReward'">
        {{ currency(record.taskReward, false) }}
      </template>
      <template v-if="column.key === 'merchantDiff'">
        {{ currency(record.merchantDiff, false) }}
      </template>
      <template v-if="column.key === 'merchantUp'">
        {{ thousand(record.merchantUp) }}
      </template>
      <template v-if="column.key === 'merchantDown'">
        {{ thousand(record.merchantDown) }}
      </template>
      <template v-if="column.key === 'memberUp'">
        {{ thousand(record.memberUp) }}
      </template>
      <template v-if="column.key === 'memberDown'">
        {{ thousand(record.memberDown) }}
      </template>
      <template v-if="column.key === 'memberDiff'">
        {{ currency(record.memberDiff, false) }}
      </template>
    </template>

    <template v-if="reportType == 'merchant'" #summary>
      <a-table-summary fixed="bottom">
      <a-table-summary-row>
        <a-table-summary-cell :col-span="2">{{
          $t("m54")
        }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.balancePageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.payMoneyPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.withdrawMoneyPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.payFeePageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.withdrawFeePageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="3" />
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.merchantDiffPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
      </a-table-summary-row>
      <a-table-summary-row>
        <a-table-summary-cell :col-span="2">{{
          $t("m55")
        }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.balanceTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.payMoneyTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.withdrawMoneyTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.payFeeTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.withdrawFeeTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="3" />
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.merchantDiffTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
      </a-table-summary-row>
      </a-table-summary>
    </template>

    <template v-if="reportType == 'member'" #summary>
      <a-table-summary fixed="bottom">
      <a-table-summary-row>
        <a-table-summary-cell :col-span="2">{{
          $t("m54")
        }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.balancePageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.payMoneyPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.withdrawMoneyPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <!-- <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.payFeePageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell> -->
        <!-- <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.withdrawFeePageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell> -->
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.usdtBuyPageMoneyTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.buyAmountPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.sellAmountPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.refundCancellationPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.amountErrorPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.buyRewardPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.sellRewardPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.taskRewardPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.memberUpPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.memberDownPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.memberDiffPageTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
      </a-table-summary-row>
      <a-table-summary-row>
        <a-table-summary-cell :col-span="2">{{
          $t("m55")
        }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.balanceTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.payMoneyTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.withdrawMoneyTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <!-- <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.payFeeTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell> -->
        <!-- <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.withdrawFeeTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell> -->
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.usdtBuyMoneyTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.buyAmountTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.sellAmountTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.refundCancellationTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.amountErrorTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.buyRewardTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.sellRewardTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.taskRewardTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.memberUpTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.memberDownTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1">
          <a-typography-text type="danger">
            {{ extendData?currency(extendData.memberDiffTotal, false):'0.00' }}
          </a-typography-text>
        </a-table-summary-cell>
      </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { useReport } from "@/hooks/useReport.hook";
import { ref, reactive, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { usePagination, today } from "@/plugins/dataMap";
import { onMounted } from "vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { currency, thousand } from "@/utils";
import { BiMerchantReconciliation, BiMemberReconciliation } from "@/api/report";
import {
  getMerchantInfoAdminList,
} from "@/api/merchant.api";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { set } from "nprogress";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const { dateType } = useReport();
const { paginationConfig } = usePagination();
const loading = ref(false);
const defaultSearchDate = ref(6);
const merchantList = ref([]);
const query = ref<any>({
  merchantCode: undefined,
  pageNo: 1,
  pageSize: 10,
});
const merchantTime = ref<any>({
  endTime: '',
  startTime: '',
})
const memberTime = ref<any>({
  endTime: '',
  startTime: '',
})
// const query2 = ref({
//   account: "",
//   code: "",
//   merchantType: "",
//   status: "",
//   username: "",
//   pageNo: 1,
//   pageSize: 20,
// });
const reportType=ref('merchant')
const dataSource = ref([]);
const searchDate = computed({
  get: () => {
    return [query.value.startTime, query.value.endTime];
  },
  set: (val) => {
    query.value.startTime = val ? val[0].startOf(dateType.value) : "";
    query.value.endTime = val ? val[1].endOf(dateType.value) : "";
  },
});
const merchantTypeMap = <any>{
  "1": t("n24"),
  "2": t("n25"),
};
const columnsMerchant = reactive([
  {
    title: t("m261"),
    dataIndex: "dateTime",
    key: "dateTime",
    width: 180,
  },
  {
    title: t("l92"),
    dataIndex: "merchantName",
    key: "merchantName",
    width: 180,
  },
  {
    title: t('n31'),
    dataIndex: "merchantBalance",
    key: "merchantBalance",
    width: 180,
  },
  {
    title: t('m262'),
    dataIndex: "payMoney",
    key: "payMoney",
    width: 180,
  },
  {
    title: t('m263'),
    dataIndex: "withdrawMoney",
    key: "withdrawMoney",
    width: 180,
  },
  {
    title: t('m264'),
    dataIndex: "payFee",
    key: "payFee",
    width: 180,
  },
  {
    title: t('m265'),
    dataIndex: "withdrawFee",
    key: "withdrawFee",
    width: 180,
  },
  {
    title: t('m266'),
    dataIndex: "merchantUp",
    key: "merchantUp",
    width: 180,
  },
  {
    title: t('m267'),
    dataIndex: "merchantDownPoint",
    key: "merchantDownPoint",
    width: 180,
  },
  {
    title: t('m841'),
    dataIndex: "merchantDown",
    key: "merchantDown",
    width: 180,
  },
  {
    title: t('m268'),
    dataIndex: "merchantDiff",
    key: "merchantDiff",
    width: 180,
  },
]);
const columnsMember = reactive([
  {
    title: t('m261'),
    dataIndex: "dateTime",
    key: "dateTime",
    width: 180,
  },
  {
    title: t('l92'),
    dataIndex: "merchantName",
    key: "merchantName",
    width: 180,
  },
  {
    title: t('m274'),
    dataIndex: "memberBalance",
    key: "memberBalance", 
    width: 180,
  },
  {
    title: t('m269'),
    dataIndex: "payMoney",
    key: "payMoney",
    width: 180,
  },
  {
    title: t('m270'),
    dataIndex: "withdrawMoney",
    key: "withdrawMoney",
    width: 180,
  },
  // {
  //   title: t('m264'),
  //   dataIndex: "payFee",
  //   key: "payFee",
  //   width: 180,
  // },
  // {
  //   title: t('m265'),
  //   dataIndex: "withdrawFee",
  //   key: "withdrawFee",
  //   width: 180,
  // },
  {
    title: t('m271'),
    dataIndex: "usdtBuyMoney",
    key: "usdtBuyMoney",
    width: 180,
  },
  {
    title: t('n104'),
    dataIndex: "buyAmount",
    key: "buyAmount",
    width: 180,
  },
  {
    title: t('n100'),
    dataIndex: "sellAmount",
    key: "sellAmount",
    width: 180,
  },
  {
    title: t('e8'),
    dataIndex: "refundCancellation",
    key: "refundCancellation",
    width: 180,
  },
  {
    title: t('n91'),
    dataIndex: "amountError",
    key: "amountError",
    width: 180,
  },
  {
    title: t('e7'),
    dataIndex: "buyReward",
    key: "buyReward",
    width: 180,
  },
  {
    title: t('e6'),
    dataIndex: "sellReward",
    key: "sellReward",
    width: 180,
  },
  {
    title: t('m337'),
    dataIndex: "taskReward",
    key: "taskReward",
    width: 180,
  },
  {
    title: t('m272'),
    dataIndex: "memberUp",
    key: "memberUp",
    width: 180,
  },
  {
    title: t('m273'),
    dataIndex: "memberDown",
    key: "memberDown",
    width: 180,
  },
  {
    title: t('m275'),
    dataIndex: "memberDiff",
    key: "memberDiff",
    width: 180,
  },
]);

const extendData = ref<any>({});
const getList = async () => {
  loading.value = true;
  if(reportType.value == 'merchant'){
    const res: any = await BiMerchantReconciliation(Object.assign({}, query.value,merchantTime.value)).finally(()=>loading.value = false);
    if (res && res.code === "1") {
      dataSource.value = res.data || [];
      paginationConfig.total = res.total || 0;
      extendData.value = res.extend;
    }
  }else{
    const res: any = await BiMemberReconciliation(Object.assign({}, query.value,memberTime.value)).finally(()=>loading.value = false);
    if (res && res.code === "1") {
      dataSource.value = res.data || [];
      paginationConfig.total = res.total || 0;
      extendData.value = res.extend;
    }
  }
};
const paySuccessRateChange = (value:any) =>{
  return (value * 100).toFixed(0) + '%';
};
const changeDateType =  (type: any) => {
  dataSource.value = [];
  extendData.value = [];
  reportType.value = type;
  query.value = {
    pageNo: 1,
    pageSize: 10,
  };
  paginationConfig.pageSize = 10;
  paginationConfig.current = 1;
  setTimeout(() => {
    getList();
  }, 100);
};
const reset = () => {
  query.value = {
    endTime:'',
    pageNo: 1,
    pageSize: 10,
    startTime: '',
  };
  if(reportType.value == 'merchant'){
    merchantTime.value = {
      startTime: '', 
      endTime: '',
    };
  }else{ 
    memberTime.value = {
      startTime: '',
      endTime: '',
    };
  }
  paginationConfig.current = 1;
  paginationConfig.pageSize = 10;
  getList();
};
const getChange = (value: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  paginationConfig.current = current;
  paginationConfig.pageSize = pageSize;
  getList();
};
const getMerchantList = async () => {
  const res: any = await getMerchantInfoAdminList({ pageNo: 1, pageSize: 1000 });
  if (res && res.code === "1") {
    merchantList.value = res.data.map((item) => ({
      value: item.code,
      label: item.username,
    }));
  }
};
onMounted(() => {
  getMerchantList();
  getList();
  getTabH.value = useTabHeight().getTabH.value;
});
</script>

<style lang="less" scoped>
lable {
  display: inline-block;
  width: 100px;
}
</style>
