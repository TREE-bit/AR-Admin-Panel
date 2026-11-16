<template>
  
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.appId"
          class="searchstyle"
          :placeholder="$t('m562')+'APP ID'"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('c9')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.phoneNumber"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m591')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.upiId"
          class="searchstyle"
          :placeholder="$t('m562')+'UPI ID'"
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
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.linkStatus"
          :placeholder="$t('m563')+$t('m186')"
        >
          <a-select-option value="0" key="0" >{{ $t('n1525') }}</a-select-option>
          <a-select-option value="1" key="1" >{{ $t('n959') }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.grantedPermissions"
          :placeholder="$t('m563')+$t('n1526')"
        >
          <a-select-option value="0" key="0" >{{ $t('no') }}</a-select-option>
          <a-select-option value="1" key="1" >{{ $t('yes') }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.autoSellEnabled"
          :placeholder="$t('m563')+$t('m593')"
        >
          <a-select-option value="0" key="0" >{{ $t('l54') }}</a-select-option>
          <a-select-option value="1" key="1" >{{ $t('l53') }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.autoBuyEnabled"
          :placeholder="$t('m563')+$t('memberListC15')"
        >
          <a-select-option value="0" key="0" >{{ $t('l54') }}</a-select-option>
          <a-select-option value="1" key="1" >{{ $t('l53') }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.deleted"
          :placeholder="$t('m563')+$t('m832')"
          :options="Object.entries(deletedMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.banRule"
          :placeholder="$t('m563')+$t('n1712')"
          :options="Object.entries(banRuleMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: $t(value) }))"
        >
        </a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('l50')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.lastLinkTimeStart" v-model:endTime="query.lastLinkTimeEnd" :title="$t('n1639')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.autoBuyEnabledTimeStart" v-model:endTime="query.autoBuyEnabledTimeEnd" :title="$t('n1640')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.autoSellEnabledTimeStart" v-model:endTime="query.autoSellEnabledTimeEnd" :title="$t('n1641')" :type="1"/>
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
      <template v-if="column.key === 'linkStatus'"  >
        <span :class="record.linkStatus == 1 ? 'tag-green' : 'tag-red'" >
          {{ record.linkStatus == 1 ? $t('n959') : $t('n1525') }}
        </span>
      </template>
      <template v-if="column.key === 'grantedPermissions'"  >
        <span :class="record.grantedPermissions == 1 ? 'tag-green' : 'tag-red'" >
          {{ record.grantedPermissions == 1 ? $t('yes') : $t('no') }}
        </span>
      </template>
      <template v-if="column.key === 'autoBuyEnabled'"  >
        <span :class="record.autoBuyEnabled == 1 ? 'tag-green' : 'tag-red'" >
          {{ record.autoBuyEnabled == 1 ? $t('l53') : $t('l54') }}
        </span>
      </template>
      <template v-if="column.key === 'autoSellEnabled'"  >
        <span :class="record.autoSellEnabled == 1 ? 'tag-green' : 'tag-red'" >
          {{ record.autoSellEnabled == 1 ? $t('l53') : $t('l54') }}
        </span>
      </template>
      <template v-if="column.key === 'scheduledAutoSellEnabled'"  >
        <span :class="record.scheduledAutoSellEnabled == 1 ? 'tag-green' : 'tag-red'" >
          {{ record.scheduledAutoSellEnabled == 1 ? $t('yes') : $t('no') }}
        </span>
      </template>
      <template v-if="column.key === 'bankIconUrl'">
        <a-image :width="70" :src="record.bankIconUrl" alt=""/>
      </template>
      <template v-if="column.key === 'balance'">
        {{ thousand(record.balance) }}
      </template>
      <template v-if="column.key === 'phoneNumber'">
       <span>{{ record.phoneNumber || '-' }}</span><span v-if="record.phoneNumber && record.disableFlag" class="tag-red ml-5">{{ $t('n1704') }}</span>
      </template>
      <template v-if="column.key === 'bankCode'">
        <a-tooltip>
          <template #title>{{ record.bankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip v-if="record.upiId">
          <template #title>{{ record.upiId }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.upiId }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'linkUrl'">
        <a-tooltip>
          <template #title>{{ record.linkUrl }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.linkUrl }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'deleted'">
        <span :class="colorMap[record.deleted]">{{ $getMapItem(deletedMap,record.deleted) }}</span>
      </template>
      <template v-if="column.key === 'banRule'">
        <a-tooltip>
          <template #title>{{ $t($getMapItem(banRuleMap, record.banRule) || '-') }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ $t($getMapItem(banRuleMap, record.banRule) || '-') }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'lastRefreshTime'">
        {{ record.lastRefreshTime || '-' }}
      </template>
      <template v-if="column.key === 'lastLinkTime'">
        {{ record.lastLinkTime || '-' }}
      </template>
      <template v-if="column.key === 'lastCheckLinkTime'">
        {{ record.lastCheckLinkTime || '-' }}
      </template>
      <template v-if="column.key === 'autoBuyEnabledTime'">
        {{ record.autoBuyEnabledTime || '-' }}
      </template>
      <template v-if="column.key === 'autoSellEnabledTime'">
        {{ record.autoSellEnabledTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <!-- 解除绑定 -->
        <a-popconfirm
          :ok-text="$t('b28')"
          :cancel-text="$t('b10')"
          @confirm="bankFakeApp(record)"
          @cancel="cancelFake"
        >
          <template #icon><a-icon type="question-circle" style="color: red" /></template>
          <template #title>
            <div>{{ $t('n1699') }}</div>
            <a-radio-group v-model:value="banRule">
              <a-space direction="vertical">
                <a-radio :value="0">{{ $t('n1698') }}</a-radio>
                <a-radio :value="1">{{ $t('n1700') }}</a-radio>
              </a-space>
            </a-radio-group>
          </template>

          <a-tag
            :color="'rgba(253, 11, 26, 1)'"
            style="cursor: pointer"
            size="small"
            v-if="record.phoneNumber && !record.disableFlag && record.deleted == 0"
            v-permission="'admin:uploadKycPartnerAdmin:banFakeApp'"
            >{{ $t('n1698') }}
          </a-tag>
        </a-popconfirm>
        <div class="mb-3"></div>
        <!-- 假APP行为日志 -->
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="openBehaviorLog(record.appId)"
          >{{ $t("n1771") }}
        </a-tag>
        <!-- 启动/关闭定时：未定时显示绿色“启动定时”，已定时显示红色“关闭定时”；无权限时连同间隔一起移除 -->
        <div v-permission="'admin:uploadKycPartnerAdmin:scheduledAutoSell'" v-if="record.deleted == 0">
          <div class="mb-3"></div>
          <a-popconfirm
            :title="record.scheduledAutoSellEnabled == 1 ? $t('n1998') : $t('n1997')"
            :ok-text="$t('yes')"
            :cancel-text="$t('no')"
            @confirm="switchScheduledAutoSell(record)"
          >
            <a-tag
              :color="record.scheduledAutoSellEnabled == 1 ? 'rgba(253, 11, 26, 1)' : '#52c41a'"
              style="cursor: pointer"
              size="small"
              >{{ record.scheduledAutoSellEnabled == 1 ? $t('n1996') : $t('n1995') }}
            </a-tag>
          </a-popconfirm>
        </div>
        <!-- 查看 -->
        <!-- <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="openConnectLog(record)"
          >{{ $t("b23") }}
        </a-tag> -->

        <!-- <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:customer:edit'"
          >{{ $t("edit") }}
        </a-tag>  -->
        
        <!-- <a-popconfirm
          :title=" $t('t16') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record)"
        >
         <a-tag
          :color="'rgba(253, 11, 26, 1)'"
          style="cursor: pointer"
          size="small"
          v-permission="'admin:kycPartnersAdmin:delete'"
          >{{ $t('b11') }}
        </a-tag>
        </a-popconfirm> -->
      </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'appId'"
        />
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
  <!-- kyc连接日志 -->
<a-modal
  v-model:open="connectModel"
  :footer="null"
  wrap-class-name="full-modal"
  width="100%"
  @cancel="cancelConnectLog"
  >
  <kycConnectLog
    v-if="connectModel"
    :bankCode="bankCode"
    :phoneNumber="phoneNumber"
    />
  </a-modal>
  <!-- 假APP行为日志 -->
<a-modal
  v-model:open="behaviorModel"
  :footer="null"
  wrap-class-name="full-modal"
  width="100%"
  @cancel="cancelBehaviorLog"
  >
  <fackAppBehaviorLog
    v-if="behaviorModel"
    :appId="behaviorAppId"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import {
  uploadKycPartnerAdminListPage,
  kycPartnersAdminDelete,
  getKycBankCodeList,
  uploadKycPartnerAdminBanFakeApp,
  uploadKycPartnerAdminScheduledAutoSell,
} from "@/api";
import { StopOutlined } from "@ant-design/icons-vue";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import fackAppBehaviorLog from "./components/fackAppBehaviorLog.vue";
import { message } from "ant-design-vue";
import { onMounted, ref, watchEffect, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import MemberDetail from "@/components/Member/memberDetail.vue";
import kycConnectLog from "@/components/Kyc/kycConnectLog.vue";
import { useI18n } from "vue-i18n";
import { banRuleMap } from "@/utils/publicData";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useFloatingStore } from '@/stores/floatModal';
import { usePagination } from "@/plugins/dataMap";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { usePageCash } from "@/hooks/usePageCash.hook"; 
import { colorMap, thousand } from "@/utils";
const route = useRoute();
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
const { getTabH } = useTabHeight(1);
const { t } = useI18n();
const detailModel = ref(false);
const detailId = ref<any>({});
const query = ref({
  asc:false,
  column:'',
  pageNo: 1,
  pageSize: 20,
  appId:undefined,
  autoBuyEnabled:undefined,
  autoSellEnabled:undefined,
  bankCode:undefined,
  deleted: undefined,
  memberId:undefined,
  phoneNumber: undefined,
  linkStatus: undefined,
  upiId: undefined,
  grantedPermissions: undefined,
  createTimeStart: '',
  createTimeEnd: '',
  lastLinkTimeStart: '',
  lastLinkTimeEnd: '',
  autoBuyEnabledTimeStart: '',
  autoBuyEnabledTimeEnd: '',
  autoSellEnabledTimeStart: '',
  autoSellEnabledTimeEnd: '',
  banRule: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
})
const deletedMap:any = {
  0: t("m894"),// 未删除
  1: t("m893"),// 已删除
  2: t("n1643"),// 待删除
}
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      balance: extendData.value.balancePageTotal,
    },
  },
  {
    label: t("m55"),
    fields: {
      balance: extendData.value.balanceTotal,
    },
  },
]);
const columns:any = [
  {
    title: "APP ID",
    dataIndex: "appId",
    key: "appId",
    width:80,
    align:"center"
  },
  {
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
    width:180,
    align:"center"
  },
  {
    title: t('m591'),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    width:200,
    align:"center"
  },
  {
    title: "UPI ID",
    dataIndex: "upiId",
    key: "upiId",
    width:180,
    align:"center",
  },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    width:160,
    align:"center"
  },
  {
    title: t('m583'),
    dataIndex: "bankIconUrl",
    key: "bankIconUrl",
    width:160,
    align:"center",
  },
  {
    title: t('m523'),
    dataIndex: "balance",
    key: "balance",
    width:180,
    align:"center",
  },
  {
    title: t("m186"),
    dataIndex: "linkStatus",
    key: "linkStatus",
    width:160,
    align:"center",
  },
  {
    title: t("n1526"),
    dataIndex: "grantedPermissions",
    key: "grantedPermissions",
    width:160,
    align:"center",
  },
  {
    title: t("memberListC15"),
    dataIndex: "autoBuyEnabled",
    key: "autoBuyEnabled",
    width:160,
    align:"center",
  },
  {
    title: t("m593"),
    dataIndex: "autoSellEnabled",
    key: "autoSellEnabled",
    width:160,
    align:"center",
  },
  {
    title: t("m832"),
    dataIndex: "deleted",
    key: "deleted",
    width:120,
    align:"center",
  },
  {
    title: t("n1994"),
    dataIndex: "scheduledAutoSellEnabled",
    key: "scheduledAutoSellEnabled",
    width:120,
    align:"center",
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    width:160,
    align:"center",
  },
  {
    title: t("n1639"),
    dataIndex: "lastLinkTime",
    key: "lastLinkTime",
    width:160,
    align:"center",
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1640")),
    dataIndex: "autoBuyEnabledTime",
    key: "autoBuyEnabledTime",
    width:160,
    align:"center",
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1641")),
    dataIndex: "autoSellEnabledTime",
    key: "autoSellEnabledTime",
    width:160,
    align:"center",
  },
  {
    title: t('n1712'),
    dataIndex: "banRule",
    key: "banRule",
    width:160,
    align:"center",
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    width:100,
    align:"center",
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    width:120,
    align:"center",
    fixed: 'right',
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
  api: uploadKycPartnerAdminListPage,
  fetchType: 1,
  defaultPageSize: 20,
  filterRules: [],
  // afterFetch: (data) =>
  //   data.map((item: any) => {
  //   item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
  //     return item;
  //   }),
});
watchEffect(() => {
  if(!isUseCash.value) resultData.value = response.value;
});
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
// const getList = async () => {
//   loading.value=true;
//   paginationConfig.current = query.value.pageNo;
//   paginationConfig.pageSize = query.value.pageSize;
//   const res: any = await kycPartnersAdminList(query.value).finally(()=>loading.value=false);;
//   if (res && res.code === "1") {
//     dataSource.value = res.data;
//     paginationConfig.total = res.total;
//     resultData.value = res;
//     clearSelected();
//   }
// };
const search = () => {
  // paginationConfig.current = 1;
  // query.value.pageNo = 1;
  getList(1)
}
// const resetQuery = () => {
//   query.value = {
//     account:undefined,
//     asc:true,
//     bankCode:undefined,
//     column:'',
//     linkStatus:'',
//     id:undefined,
//     memberId:undefined,
//     mobileNumber:undefined,
//     pageNo: 1,
//     pageSize: 20,
//     sellStatus: undefined,
//     upiId: undefined,
//     lastRefreshTokenTimeStart: '',
//     lastRefreshTokenTimeEnd: '',
//     // name: undefined,
//     deleted: undefined as any,
//     version: 2,
//   };
//   paginationConfig.pageSize = 20;
//   paginationConfig.current =1;
//   getList();
// };
const del = async (value: any) => {
  const { id } = value;
  const res: any = await kycPartnersAdminDelete({id});
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
  }
};
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//   paginationConfig.current = pag.current;
//   paginationConfig.pageSize = pag.pageSize;
//   query.value.pageNo = pag.current;
//   query.value.pageSize = pag.pageSize;
//   getList()
// };
const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};
const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value.id = memberId;
  detailModel.value = true;
};
// 打开连接日志
const connectModel = ref(false);
const bankCode = ref("");
const phoneNumber = ref("");
const openConnectLog = (value: any) => {
  selectedRow();
  bankCode.value = value.bankCode;
  phoneNumber.value = value.account;
  connectModel.value = true;
};
const cancelConnectLog = () => {
  connectModel.value = false;
  bankCode.value = "";
  phoneNumber.value = "";
};

// 解除绑定
const banRule = ref(0);
const bankFakeApp = async (value: any) => {
  const { appId } = value;
  loading.value = true;
  const res: any = await uploadKycPartnerAdminBanFakeApp({ appId, banRule: banRule.value }).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
    cancelFake();
  }
}
const cancelFake = () => {
  banRule.value = 0;
}

// 开启/关闭定时自动卖出：按当前状态取反提交
const switchScheduledAutoSell = async (value: any) => {
  const enabled = value.scheduledAutoSellEnabled == 1 ? 0 : 1;
  loading.value = true;
  const res: any = await uploadKycPartnerAdminScheduledAutoSell({ newKycId: value.appId, enabled }).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    message.success(t('n1217'));
    getList();
  }
}

// 假APP行为日志
const behaviorModel = ref(false);
const behaviorAppId = ref('');
const openBehaviorLog = (val :any) => {
  behaviorAppId.value = val;
  behaviorModel.value = true;
}
const cancelBehaviorLog = () =>{
  behaviorAppId.value = '';
  behaviorModel.value = false;
}


onMounted(() => {
  getGroupList();
  const pathName = route.fullPath.split('?')[0];
  if(pageCash.value.includes(pathName) && Object.keys(route.query).length == 0){
    const { queryCash, res } = getPageCash(pathName);
    if(!res.data || res.data && res.data.length == 0) {
      isUseCash.value = false;
      getList();
    }else{
      isUseCash.value = true;
      query.value = queryCash;
      dataSource.value = res.data;
      resultData.value = res;
      pagination.value.total = res.total;
      pagination.value.current = query.value.pageNo;
      pagination.value.pageSize = query.value.pageSize;
    }
  }else{
    clearPageCash(route.fullPath);
    getList();
  }
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>

<style scoped lang="less">
.phoneNumberDisable {
  cursor: not-allowed;
  background-color: #ddd;
  padding: 5px;
}
.phoneNumberDisableIcon {
  cursor: not-allowed;
  margin-left: 2px;
}
</style>

