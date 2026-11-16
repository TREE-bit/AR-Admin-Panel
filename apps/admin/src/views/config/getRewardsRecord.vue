<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          allowClear
          class="searchstyle"
          v-model:value="query.id"
          :placeholder="$t('m562')+$t('n1195')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          allowClear
          class="searchstyle"
          v-model:value="query.memberId"
          :placeholder="$t('m562')+$t('c9')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          allowClear
          v-model:value="query.cardName"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n1096')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          allowClear
          v-model:value="query.amount"
          :placeholder="$t('m562')+$t('n1097')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          v-model:value="query.status"
          :placeholder="$t('m563')+$t('state')"
          :options="Object.keys(rewardsStatusMap).map(key => ({ label: rewardsStatusMap[key], value: Number(key) }))"
        />
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('collectionTime')" :type="1"/>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.useTimeStart" v-model:endTime="query.useTimeEnd" :title="$t('n1098')" :type="1"/>
      </a-col>
      <a-col>
        <a-space>
          <a-button
            type="primary"
            :icon="h(SearchOutlined)"
            @click="getList(1)"
            :loading="loading"
            >{{ $t("search") }}
          </a-button>
          <a-button type="primary" :loading="loading" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
          <!-- <a-button type="primary" :loading="loading" @click="exportList" v-permission="'admin:appealOrderAdmin:export'">{{
            $t("export")
          }}</a-button> -->
          <a-button @click="openDrawer">{{ $t("m741") }}</a-button>
        </a-space>
      </a-col>
    </a-row>
    <div class="topTotal">
      <span>{{ $t('n1121') }}：{{ extendData.totalCountAll || '0'}}</span>
      <span>{{ $t('n1104') }}：{{ extendData.usedCountAll || '0'}}</span>
    </div>
  </div>
  <PublicColumnFilter
    v-model:open="drawerVisible"
    v-model:value="selectedColumns"
    :columns="columns"
    v-model:defaultColumns="defaultColumns"
    :title="$t('n36')"
    :menuId="menuId"
    v-if="drawerVisible"
  />
  <a-table
    :dataSource="dataSource"
    :columns="dynamicColumns"
    :key="tableKey"
    :pagination="pagination"
    :scroll="{ x: '100%' ,y : getTabH +'px' }"
    :loading="loading"
    @change="handleTableChange"
    :row-key="(record: any) => JSON.stringify(record)"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'id'">
        {{ record.id }}
        <CopyOutlined v-if="record.id" class="copyId"  @click="$copyId(record.id)" />
      </template>
      <template v-if="column.key === 'memberId'">
        <a-button type="link" class="copyContent" @click="showMember(record.memberId)">{{
          record.memberId
        }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'cardName'">
        <a-tooltip v-if="record.cardName">
          <template #title>{{ record.cardName }}</template>
          <div class="toopTipStyle">{{ record.cardName  }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key ==='relatedOrderNo'">
        <a-tooltip v-if="record.relatedOrderNo">
          <template #title>
            {{ record.relatedOrderNo }}
            <CopyOutlined v-if="record.relatedOrderNo" class="copyId"  @click="$copyId(record.relatedOrderNo)" />
          </template>
          <div class="toopTipStyle">
            {{ record.relatedOrderNo  }}
            <CopyOutlined v-if="record.relatedOrderNo" class="copyId"  @click="$copyId(record.relatedOrderNo)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key ==='kycId'">
        <a-tooltip>
          <template #title>
            <div>
              UPI ID: {{ record.activateUpiId || '-' }}
              <CopyOutlined v-if="record.activateUpiId" class="copyId"  @click="$copyId(record.activateUpiId)" />
            </div>
            <div>
              KYC ID: {{ record.activateKycId || '-' }}
              <CopyOutlined v-if="record.activateKycId" class="copyId"  @click="$copyId(record.activateKycId)" />
            </div>
          </template>
          <div class="text-left">
            <div class="toopTipStyle">
              UPI ID: {{ record.activateUpiId || '-' }}
              <CopyOutlined v-if="record.activateUpiId" class="copyId"  @click="$copyId(record.activateUpiId)" />
            </div>
            <div class="toopTipStyle">
              KYC ID: {{ record.activateKycId || '-' }}
              <CopyOutlined v-if="record.activateKycId" class="copyId"  @click="$copyId(record.activateKycId)" />
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'useTime'">
        {{ record.useTime || '-' }}
      </template>
      <template v-if="column.key === 'expireTime'">
        {{ record.expireTime || '-' }}
      </template>
      <template v-if="column.key ==='status'">
        {{ $getMapItem(rewardsStatusMap,record.status) || '-' }}
      </template>
      <template v-if="column.key ==='expiredFlag'">
        <span :style="{ color: record.expiredFlag == 1 ? 'green' : 'red' }">
          {{ record.expiredFlag == 1 ? $t("yes") : $t("no") }}
        </span>
      </template>
      <template v-if="column.key ==='frozenFlag'">
        <span :style="{ color: record.frozenFlag == 1 ? 'green' : 'red' }">
          {{ record.frozenFlag == 1 ? $t("yes") : $t("no") }}
        </span>
      </template>
      <template v-if="column.key ==='updateBy'">
        {{ record.updateBy || '-' }}
      </template>
      <template v-if="column.key ==='updateTime'">
        {{ record.updateTime || '-' }}
      </template>
      <template v-if="column.key ==='action'">
        <!-- 冻结 -->
        <a-tag
          color="red"
          style="cursor: pointer"
          v-permission="'admin:rewardCardUsageRecordAdmin:frozen'"
          v-if="record.status != 3 && record.frozenFlag != 1"
          @click="showFrozenModal(record, 1)"
          size="small">
            {{ $t('m79') }}
        </a-tag>
        <!-- 解冻 -->
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          v-if="record.frozenFlag == 1"
          v-permission="'admin:rewardCardUsageRecordAdmin:unFrozen'"
          @click="showFrozenModal(record, 0)"
          size="small">
            {{ $t('e3') }}
        </a-tag>
      </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="dynamicColumns"
        :firstColumnLabel="'memberId'"
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
  <!-- 冻结/解冻 -->
  <a-modal
    v-model:open="frozenModVisible"
    :footer="null"
    wrap-class-name="modalStyle"
    width="400px"
    @cancel="cancelFrozenAction"
  >
    <template #title>
      <h3>{{ msgTxt[actionForm.frozenFlag].title }}</h3>
    </template>
    <div>
      <span>*</span>{{ msgTxt[actionForm.frozenFlag].text }}
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <a-button style="margin-right: 20px;" @click="cancelFrozenAction">{{ $t('b10') }}</a-button>
      <a-button type="primary" :danger="actionForm.frozenFlag == 1" @click="frozenAction">{{ msgTxt[actionForm.frozenFlag].btn }}</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed, watch } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { rewardCardUsageRecordAdminListPage,
  rewardCardUsageRecordAdminUnFrozen,
  rewardCardUsageRecordAdminUpdateFrozenFlag } from "@/api/c2cconfig.api";
import countDown from "@/components/countDown.vue";
import { useI18n } from "vue-i18n";
import { currency, thousand } from "@/utils";
import memberDetail from "@/components/Member/memberDetail.vue";
import router from "@/router";
import { useRoute } from 'vue-router'
import { appealOrderControllerExport } from "@/api/export";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { payTypeData,appealMap } from "@/utils/publicData";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { useTableColumnDrawer } from "@/hooks/useTableColumnDrawer";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { extend } from "dayjs";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { message } from "ant-design-vue";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const dataSource = ref([]);
const extendData = ref<any>({});
  const route = useRoute();
const loading = ref(false);
const detailModel = ref(false);

const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      amount: extendData.value.pageAmount,
    },
  },
  {
    label: t("m55"),
    fields: {
      amount: extendData.value.totalAmount,
    },
    // fixedPositions: {
    //   amount: 3,
    // },
  },
]);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const columns:any = [
  // {
  //   title: t("e47"),
  //   dataIndex: "index",
  //   key: "index",
  //   align: "center",
  //   width: 90,
  //   customRender: ({ index }:{index:any}) => index + 1,
  //   fixed: "left",
  // },
  {
    title: t('n1195'),
    dataIndex: "id",
    key: "id",
    align: "center",
    isRequired: true,
    width: 100,
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    isRequired: true,
    width: 180,
  },
  // {
  //   title: t("l92"),
  //   dataIndex: "merchantName",
  //   key: "merchantName",
  //   align: "center",
  //   width: 130,
  // },
  {
    title: t("n332"),
    dataIndex: "relatedOrderNo",
    key: "relatedOrderNo",
    align: "center",
    width: 240,
  },
  {
    title: t("n1096"),
    dataIndex: "cardName",
    key: "cardName",
    align: "center",
    width: 140,
  },
  {
    title: t("n1097"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 120,
  },
  {
    title: t("m907"),
    dataIndex: "kycId",
    key: "kycId",
    align: "center",
    width: 180,
  },
  {
    title: t("collectionTime"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 140,
  },
  {
    title: t("n1098"),
    dataIndex: "useTime",
    key: "useTime",
    align: "center",
    width: 140,
  },
  {
    title: t("m822"),
    dataIndex: "expireTime",
    key: "expireTime",
    align: "center",
    width: 140,
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    align: "center",
    // filters: [
    //   { text: t('n88'), value: 1 },
    //   { text: t('s16'), value: 2 },
    //   { text: t('s17'), value: 3 },
    // ],
    // filterMultiple: false,
    width: 140,
  },
  {
    title: t('n1122'),
    dataIndex: "expiredFlag",
    key: "expiredFlag",
    align: "center",
    width: 140,
  },
  {
    title: t('n1123'),
    dataIndex: "frozenFlag",
    key: "frozenFlag",
    align: "center",
    width: 140,
  },
  {
    title: t('操作人'),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 140,
  },
  {
    title: t('操作时间'),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 140,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 120,
    fixed: 'right',
  },
];
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const {
  menuId,
  defaultColumns,
  selectedColumns,
  dynamicColumns,
  drawerVisible,
  openDrawer,
  tableKey,
} = useTableColumnDrawer(columns);
const rewardsStatusMap = <any>{
  0: t('n1100'), //未激活
  1: t('n1101'), //已激活
  2: t('n1102'), //使用中
  3: t('n1104'), //已使用
}
interface Query {
  id: number | undefined;
  createTimeStart: string | null;
  createTimeEnd: string | null;
  expireTimeStart: string | null;
  expireTimeEnd: string | null;
  useTimeStart: string | null;
  useTimeEnd: string | null;
  asc: boolean;
  column: string;
  pageNo: number;
  pageSize: number;
  relatedOrderNo: string | undefined;
  grantSource: number | undefined;
  memberId?: any;
  status?: number | undefined;
  cardName: string | undefined;
  amount: number | undefined;
}
const query = ref<Query>({
  id: route.query.rewardId ? Number(route.query.rewardId) : undefined,
  createTimeEnd: route.query.rewardId ? '' : endIndiaTime,
  createTimeStart: route.query.rewardId ? '' : startIndiaTime,
  pageNo: 1,
  pageSize: 20,
  cardName: undefined,
  relatedOrderNo: "",
  grantSource: undefined,
  asc: true,
  amount: undefined,
  column: "",
  expireTimeStart: '',
  expireTimeEnd: '',
  useTimeStart: '',
  useTimeEnd: '',
  memberId: undefined,
  status: undefined,
});
const getList = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  pagination.value.pageSize = query.value.pageSize;
  pagination.value.current = query.value.pageNo;
  const res:any = await rewardCardUsageRecordAdminListPage(query.value).catch((err)=>loading.value = false);
  if (res) {
      dataSource.value = res.data.map((item: any) => {
      item.actualAmount = currency(item.actualAmount, false);
      item.orderAmount = currency(item.orderAmount, false);
      return item;
    });
    pagination.value.total = res.total;
    extendData.value = res.extend;
    loading.value = false;
  }else{
    loading.value = false;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number },filters:any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList();

};
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};
const resetQuery = () => {
  query.value = {
    id: undefined,
    createTimeEnd: '',
    createTimeStart: '',
    pageNo: 1,
    pageSize: 20,
    cardName: undefined,
    relatedOrderNo: undefined,
    grantSource: undefined,
    asc: true,
    amount: undefined,
    column: "",
    expireTimeStart: '',
    expireTimeEnd: '',
    useTimeStart: '',
    useTimeEnd: '',
    memberId: undefined,
    status: undefined,
  };
  pagination.value.current = 1;
  pagination.value.pageSize = 20;
  getList(query.value);
};
// const exportList = async () => {
//   const data = JSON.parse(JSON.stringify(query.value));
//   loading.value = true;
//   const res:any = await appealOrderControllerExport(data).finally(() => {
//     loading.value = false;
//   });
//   if (res && res.code == "1") {
//     message.success(t("n545"));
//   }
// };
// 冻结/解冻
const frozenModVisible = ref(false);
const msgTxt = [
{ title: t('n1210'), text: t('n1212'), btn: t('e3') },
  { title: t('n1211'), text: t('n1213'), btn: t('m79') },
]
const actionForm = ref<any>({
  id: undefined,
  frozenFlag: undefined, //1冻结 0解冻
});
const showFrozenModal = (record: any, frozenFlag: number) => {
  actionForm.value.id = record.id;
  actionForm.value.frozenFlag = frozenFlag;
  frozenModVisible.value = true;
};
const frozenAction = async () => {
  loading.value = true;
  const res:any = await rewardCardUsageRecordAdminUpdateFrozenFlag(actionForm.value).finally(() => {
    loading.value = false;
  });
  if (res && res.code == "1") {
    message.success(t("s10"));
    cancelFrozenAction();
    getList();
  }
};
const cancelFrozenAction = () => {
  frozenModVisible.value = false;
}
onMounted(() => {
  getList(query.value);
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped>
.topTotal{
  font-size: 14px;
  padding: 2px 0;
  font-weight: 600;
  span{
    display: inline-block;
    width: 200px;
  }
}
.copyContent{
  padding: 3px;
  height: auto;
}
</style>
