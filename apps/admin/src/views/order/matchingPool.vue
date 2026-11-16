<template>
  <div class="search">
    <h2 style="display: inline-block;">{{ $getMenuName() }}</h2>
    <span class="searchMatchingTime">
      {{ $t('n495') + '：' + extendData.matchingTimeoutDuration + ' ' + $t('minute') }} / 
      {{ $t('n496') + '：' + extendData.matchingTimeoutCancelDuration + ' ' + $t('minute') }}
    </span>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.matchOrder"
          :placeholder="$t('n474')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.memberId"
          :placeholder=" $t('n272')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n475')"
          v-model:value="query.orderStatus"
          :options="Object.entries(statusMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.associationOrderNo"
          :placeholder=" $t('n595')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.merchantPaymentOrderNo"
          :placeholder=" $t('n627')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n626')"
          v-model:value="query.sourceOrderType"
          :options="Object.entries(orderSourceMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: $t(value),
          }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n1520')"
        v-model:value="query.autoSellFlag"
        :options="autoSellFlagOptions"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n1561')"
        v-model:value="query.handleByExchangeOrder"
        >
          <a-select-option :value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option :value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.upiId"
          :placeholder="$t('m562')+ 'UPI ID'"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n476')"
          v-model:value="query.matchTimeoutReason"
          :options="Object.entries(matchTimeoutReasonMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n477')"
          v-model:value="query.orderFinishType"
          :options="Object.entries(orderFinishTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n645')"
          v-model:value="query.sellStrategy"
          :options="Object.entries(splitStrategyMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: $t(value),
          }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n582')"
          v-model:value="query.sellOrderType"
          :options="Object.entries(sellOrderTypeMap)
            .filter(([key, _]) => key != '0')
            .map(([key, value]:[any,any]) => ({
            value: key,
            label: $t(value),
          }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.isQuadOrder"
          :placeholder="$t('n886')"
          :allowClear="true"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.quadOrder"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+$t('n864')"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n1124')"
        v-model:value="query.rewardCardSellFlag"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.rewardCardId"
          class="searchstyle"
          :placeholder="$t('n1195')"
        />
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('l50')" :type="1"/>
      </a-col>
      <a-col v-show="isShowMoreSearch">
        <timeRange v-model:startTime="query.completeTimeStart" v-model:endTime="query.completeTimeEnd" :title="$t('m734')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          :loading="loading"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" :loading="loading" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <ExportButton
          :query="query"
          :api="matchPoolAdminExport"
          :enable-export-fields="true"
          permission="admin:matchPoolAdmin:export"
        />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:matchPoolAdmin:export'"
          >{{ $t("export") }}</a-button
        > -->
        <a-button :disabled="loading" @click="openDrawer">{{ $t("m741") }}</a-button>
        <ArrowDownOutlined v-show="!isShowMoreSearch" @click="showMoreSearch" />
        <ArrowUpOutlined v-show="isShowMoreSearch" @click="showMoreSearch" />
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="dynamicColumns"
    :key="tableKey"
    :pagination="pagination"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
          <a-button type="link" class="copyContent" @click="showMember(record.memberId)">{{
            record.memberId || '-'
          }}</a-button>
          <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'matchOrder'">
        <div class="toopTipStyle2">
          <a-button type="link" class="copyContent" @click="goSell(record.matchOrder)">{{
            record.matchOrder || '-'
          }}</a-button>
          <CopyOutlined v-if="record.matchOrder" class="copyId"  @click="$copyId(record.matchOrder)" />
        </div>
      </template>
      <template v-if="column.key === 'associationOrderNo'">
        <div class="toopTipStyle2">
          {{ record.associationOrderNo || '-' }}
          <CopyOutlined v-if="record.associationOrderNo" class="copyId"  @click="$copyId(record.associationOrderNo)" />
        </div>
      </template>
      <template v-if="column.key === 'merchantPaymentOrderNo'">
        <div class="toopTipStyle2">
          {{ record.merchantPaymentOrderNo || '-' }}
          <CopyOutlined v-if="record.merchantPaymentOrderNo" class="copyId"  @click="$copyId(record.merchantPaymentOrderNo)" />
        </div>
      </template>
      <template v-if="column.key === 'autoSellFlag'">
        <span :class="isAutoSellFlag(record.autoSellFlag) ? 'tag-green' : 'tag-gray'">{{ getAutoSellFlagLabel(record.autoSellFlag) }}</span>
      </template>
      <template v-if="column.key === 'handleByExchangeOrder'">
        <span :class="record.handleByExchangeOrder == 1 ? 'tag-green' : 'tag-gray'">{{ record.handleByExchangeOrder == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <template v-if="column.key === 'sourceOrderType'">
        <span v-if="record.sourceOrderType">{{ $t($getMapItem(orderSourceMap,record.sourceOrderType)) }}</span>
        <span v-else>{{ $t('n623') }}</span>
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'sellOrderType'">
        {{ $t($getMapItem(sellOrderTypeMap,record.sellOrderType)) || '-' }}
      </template>
      <template v-if="column.key === 'sellStrategy'">
        {{ $t($getMapItem(splitStrategyMap,record.sellStrategy)) || '-' }}
      </template>
      <template v-if="column.key === 'orderStatus'">
        <div class="toopTipStyle2">{{ $getMapItem(statusMap,record.orderStatus)}}</div>
      </template>
      <template v-if="column.key === 'inProgressAmount'">
        {{ record.inProgressAmount || 0 }} / {{ record.inProgressOrderCount || 0 }}
      </template>
      <template v-if="column.key === 'canceledSubOrderAmount'">
        <div class="tableText">
          {{ $t('b10') }}: {{ record.canceledSubOrderCount || 0 }} / {{ record.canceledSubOrderAmount || 0 }}
        </div>
        <div class="tableText">
          {{ $t('n478') }}: {{ record.payTimeoutSubOrderCount || 0 }} / {{ record.payTimeoutSubOrderAmount || 0 }}
        </div>
        <div class="tableText">
          {{ $t('m618') }}: {{ record.failedSubOrderCount || 0 }} / {{ record.failedSubOrderAmount || 0 }}
        </div>
      </template>
      <template v-if="column.key === 'completeTime'">
        {{ record.completeTime || '-' }}
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip v-if="record.sourceOrderType == 1 || record.sourceOrderType == 3">
          <template #title>
            UPI ID: {{ record.upiId }}
            <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />
          </template>
          <div class="tableText toopTipStyle">
            UPI ID: {{ record.upiId }}
            <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />
          </div>
        </a-tooltip>
        <a-tooltip v-if="record.sourceOrderType == 2 || record.sourceOrderType == 5">
          <template #title>
            <div class="tableText">
              <div>{{ $t('m581') }}: {{ record.bankName || '-' }}
                <CopyOutlined v-if="record.bankName" class="copyId"  @click="$copyId(record.bankName)" />
              </div>
              <div>{{ $t('n621') }}: {{ record.bankOwner || '-' }}
                <CopyOutlined v-if="record.bankOwner" class="copyId"  @click="$copyId(record.bankOwner)" />
              </div>
              <div>IFSC: {{ record.ifsc || '-' }}
                <CopyOutlined v-if="record.ifsc" class="copyId"  @click="$copyId(record.ifsc)" />
              </div>
              <div>{{ $t('n622') }}: {{ record.bankCardNumber || '-' }}
                <CopyOutlined v-if="record.bankCardNumber" class="copyId"  @click="$copyId(record.bankCardNumber)" />
              </div>
            </div>
          </template>
          <div class="tableText">
            <div class="toopTipStyle">{{ $t('m581') }}: {{ record.bankName || '-' }}
              <CopyOutlined v-if="record.bankName" class="copyId"  @click="$copyId(record.bankName)" />
            </div>
            <div class="toopTipStyle">{{ $t('n621') }}: {{ record.bankOwner || '-' }}
              <CopyOutlined v-if="record.bankOwner" class="copyId"  @click="$copyId(record.bankOwner)" />
            </div>
            <div class="toopTipStyle">IFSC: {{ record.ifsc || '-' }}
              <CopyOutlined v-if="record.ifsc" class="copyId"  @click="$copyId(record.ifsc)" />
            </div>
            <div class="toopTipStyle">{{ $t('n622') }}: {{ record.bankCardNumber || '-' }}
              <CopyOutlined v-if="record.bankCardNumber" class="copyId"  @click="$copyId(record.bankCardNumber)" />
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'matchTimeoutReason'">
        <div class="toopTipStyle2" v-if="matchTimeoutReasonMap[record.matchTimeoutReason]">
          <a-button type="link" class="copyContent" @click="showTimeoutLogs(record.matchOrder)">
            {{ $getMapItem(matchTimeoutReasonMap,record.matchTimeoutReason) }}
          </a-button>
        </div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'matchTimeoutTime'">
        {{ record.matchTimeoutTime || '-' }}
      </template>
      <template v-if="column.key === 'orderFinishType'">
          <div class="toopTipStyle2">
            {{ $getMapItem(orderFinishTypeMap,record.orderFinishType) || '-' }}
          </div>
      </template>
      <template v-if="column.key === 'isQuadOrder'">
        <div style="text-align: left;">
          {{ $t('m905') }}:
          <span :style="{ color: record.isQuadOrder == 1 ? 'green' : '' }">
            {{ record.isQuadOrder == 1 ? $t("yes") : $t("no") }}
          </span>
        </div>
        <div style="text-align: left;">
          <a-tooltip v-if="record.quadOrderChannel">
            <template #title>{{ record.quadOrderChannel }}</template>
            <div class="toopTipStyle">
              {{ $t('m413') }}:
              {{ record.quadOrderChannel }}
            </div>
          </a-tooltip>
          <span v-else>-</span>
        </div>
      </template>
      <template v-if="column.key === 'quadOrder'">
        <a-tooltip v-if="record.quadOrder">
          <template #title>{{ record.quadOrder }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.quadOrder }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'rewardCardSellFlag'">
        <span v-if="record.rewardCardSellFlag == 1">
          {{ $t('yes')}}
          <a-button type="link" v-if="record.rewardCardId" @click="goReward(record.rewardCardId)">
            {{ record.rewardCardId }}
          </a-button>
          <CopyOutlined v-if="record.rewardCardId" class="copyId"  @click="$copyId(record.rewardCardId)" />
        </span>
        <span v-else>{{ $t('no') }}</span>
        <!-- <span :style="{ color: record.rewardCardSellFlag == 1 ? 'green' : '' }">
        </span> -->
      </template>
      <template v-if="column.key === 'operate'">
        <!-- <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="goSale(record.matchOrder)"
          v-permission="'admin:noHttp:no2'"
          >{{ $t("b23") }}
        </a-tag> -->
        <a-popconfirm
          :title="$t('n659')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="failedOrder(record.matchOrder)"
          :confirm-loading="loading"
          >
        <a-button v-if="[1,2,3,4,5].includes(record.sourceOrderType) && record.orderStatus == 1 && record.inProgressOrderCount <1
              || !record.sourceOrderType && record.orderStatus == 1"
          type="primary" danger size="small" v-permission="'admin:matchPoolAdmin:failReturn'">
          {{ $t("m618") }}</a-button>
        </a-popconfirm>
      </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="dynamicColumns"
        :firstColumnLabel="'index'"
        />
    </template>
  </a-table>
   <!-- 列表筛选 -->
  <PublicColumnFilter
    v-model:open="drawerVisible"
    v-model:value="selectedColumns"
    :columns="columns"
    v-model:defaultColumns="defaultColumns"
    :title="$t('n36')"
    :menuId="menuId"
    v-if="drawerVisible"
  />
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
  <!-- 撮合超时日志 -->
  <a-modal
    v-model:open="logDialog"
    width="800px"
    @cancel="cancelTimeoutLogs"
  >
    <TimeoutLogs
      v-if="logDialog"
      :matchOrder="matchOrder"
    />
    <template #footer>
      <div style="display: flex; justify-content: center;">
        <a-button key="back" @click="cancelTimeoutLogs">{{ $t('l54') }}</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed, watch, onUnmounted, nextTick, watchEffect } from "vue";
import { SearchOutlined, ArrowDownOutlined, ArrowUpOutlined  } from "@ant-design/icons-vue";
import { getMatchPoolListPage, getMatchPoolFailReturn } from "@/api/order.api";
import { matchPoolAdminExport } from "@/api/export";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { currency, thousand, formatTime } from "@/utils";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { getStartAndEndOfDay, getIndiaLocalTime } from "@/plugins/dataMap";
import { useTableColumnDrawer } from "@/hooks/index";
import memberDetail from "@/components/Member/memberDetail.vue";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import TimeoutLogs from "@/components/orderManagement/timeoutLogs.vue";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import { sellOrderTypeMap, splitStrategyMap, orderSourceMap, autoSellFlagMap, isAutoSellFlag, getAutoSellFlagLabel, getAutoSellFlagOptions, getAutoSellFlagFilters } from "@/utils/publicData";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { message } from "ant-design-vue";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { usePageCash } from "@/hooks/usePageCash.hook"; 
const { pageCash,setPageCash,getPageCash,clearPageCash } = usePageCash();
const resultData = ref({});
const isUseCash = ref(false);
onBeforeRouteLeave(() => {
  setPageCash(route.fullPath.split('?')[0], query.value, resultData.value, extendData.value);
})
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay();
const indiaLocalTimeDate = ref(getIndiaLocalTime());
const route = useRoute()
const router = useRouter()
const { t } = useI18n();
// const dataSource: any = ref([]);
// const extendData = ref<any>({});
// const loading = ref(false);

const isShowMoreSearch = ref(false);
const showMoreSearch = () => {
  isShowMoreSearch.value = !isShowMoreSearch.value;
  setTimeout(() => {
    getTabH.value = useTabHeight(1).getTabH.value;
  },100)
}
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      amount: extendData.value.amountPageTotal,
      remainingAmount: extendData.value.remainingAmountPageTotal,
    },
    fixedPositions: {
      amount: 5,
    },
  },
  {
    label: t("m55"),
    fields: {
      amount: extendData.value.amountTotal,
      remainingAmount: extendData.value.sumRemainingAmount,
    },
    fixedPositions: {
      amount: 5,
    },
  },
]);
const query = ref({
  asc: false,
  column: '',
  pageNo: 1,
  pageSize: 20,
  createTimeEnd: endIndiaTime,
  createTimeStart: startIndiaTime,
  matchOrder: route.query.id || '' as any,
  orderStatus: undefined,
  upiId: undefined,
  memberId: undefined,
  matchTimeoutReason: undefined,
  isQuadOrder: undefined,
  quadOrder: undefined,
  orderFinishType: undefined,
  completeTimeStart: '',
  completeTimeEnd: '',
  sellOrderType: undefined,
  associationOrderNo: undefined,
  sellStrategy: undefined,
  merchantPaymentOrderNo: undefined,
  sourceOrderType: undefined,
  rewardCardSellFlag: undefined,
  rewardCardId: undefined,
  autoSellFlag: undefined,
  handleByExchangeOrder: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});

const matchTimeoutReasonMap:any = {
  1: t("n279"),//KYC断连
  2: t("n271"),//收款账户异常
  3: t("n479"),//达到超时时限
  4: t("n590"),//收款地址-自动校正
  5: t("n591"),//收款地址-人工操作
  6: t("n1777"),//买方发起买入失败申诉单
  7: t("n1778"),//后台人工手动触-发失败订单
};
const orderFinishTypeMap:any = {
  1: t("n480"),//卖方主动取消
  2: t("n481"),//系统自动完结
  3: t("n660"),//人工失败放款单
  4: t("n1346"),//系统自动退回
};
const statusMap:any = {
  1: t("n482"),//撮合中
  2: t("n483"),//撮合超时
  7: t("s10"),//成功
  8: t("m618"),//失败
  20: t("n484"),//超时待完结
  21: t("n485"),//部分成功
};
const now = ref(0);
let timer: any = null;
const startTimer = () => {
  if (timer) return; // 防止重复启动
  timer = setInterval(() => {
    now.value++;
  }, 1000);
};
const stopTimer = () => {
  clearInterval(timer);
  timer = null;
};
// 自动卖出搜索下拉选项，只在语言切换时重建
const autoSellFlagOptions = computed(getAutoSellFlagOptions);
const columns:any = [
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("e47")),
    align: "center",
    dataIndex: "index",
    key: "index",
    width: 60,
    isRequired: true,
    filteredValue: [],
    fixed: "left",
    customRender:({index}:{index:any})=> index + 1
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    width: 140,
    isRequired: true,
    filteredValue: [],
    align: "center",
    fixed: "left",
  },
  {
    title: t("l90"),
    dataIndex: "matchOrder",
    key: "matchOrder",
    isRequired: true,
    filteredValue: [],
    align: "center",
    fixed: "left",
    width: 190,
  },
  {
    title: t("n272"),
    dataIndex: "memberId",
    key: "memberId",
    isRequired: true,
    align: "center",
    filteredValue: [],
    width: 180,
    fixed: "left",
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n475")),
    dataIndex: "orderStatus",
    key: "orderStatus",
    isRequired: true,
    align: "center",
    filters: Object.entries(statusMap).map(([key, value]:[any,any]) => ({
              value: key,
              text: value,
            })),
    filterMultiple: false,
    filteredValue: query.value.orderStatus != undefined ? [query.value.orderStatus] : null,
    onFilter: (value:any, record:any) => record.orderStatus == value,
    fixed: "left",
    width: 100,
  },
  {
    title: t("n42"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    isRequired: true,
    filteredValue: [],
    fixed: "left",
    width: 150,
  },
  {
    // title: t("n595"),
    title: () => h('div', { class:'toopTipStyle2' }, t("n595")),
    dataIndex: "associationOrderNo",
    key: "associationOrderNo",
    align: "center",
    filteredValue: [],
    width: 200,
  },
  {
    // title: t("n595"),
    title: () => h('div', { class:'toopTipStyle2' }, t("n627")),
    dataIndex: "merchantPaymentOrderNo",
    key: "merchantPaymentOrderNo",
    align: "center",
    filteredValue: [],
    width: 200,
  },
  {
    title: t("n626"),
    dataIndex: "sourceOrderType",
    key: "sourceOrderType",
    align: "center",
    filteredValue: [],
    width: 180,
  },
  {
    title: t("m812"),
    dataIndex: "isQuadOrder",
    key: "isQuadOrder",
    exportFields: ["isQuadOrder", "quadOrderChannel"],
    align: "center",
    width: 130,
  },
  {
    title: t("n1530"),
    dataIndex: "autoSellFlag",
    key: "autoSellFlag",
    filters: getAutoSellFlagFilters(),
    filterMultiple: false,
    filteredValue: query.value.autoSellFlag != undefined ? [query.value.autoSellFlag] : null,
    align: "center",
    width: 140,
  },
  {
    title: t("n1561"),
    dataIndex: "handleByExchangeOrder",
    key: "handleByExchangeOrder",
    align: "center",
    width: 140,
  },
  {
    title: t("n864"),
    dataIndex: "quadOrder",
    key: "quadOrder",
    align: "center",
    width: 240,
  },
  {
    title: t("n1125"),
    dataIndex: "rewardCardSellFlag",
    key: "rewardCardSellFlag",
    exportFields: ["rewardCardSellFlag", "rewardCardId"],
    align: "center",
    width: 120,
  },
  {
    title: t("n486"),
    dataIndex: "inProgressAmount",
    key: "inProgressAmount",
    exportFields: ["inProgressAmount", "inProgressOrderCount"],
    align: "center",
    filteredValue: [],
    width: 170,
  },
  // {
  //   title: t("n487"),
  //   dataIndex: "failedSubOrderAmount",
  //   key: "failedSubOrderAmount",
  //   align: "center",
  //   filteredValue: [],
  //   width: 170,
  // },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n499")),
    dataIndex: "successSubOrderCount",
    key: "successSubOrderCount",
    align: "center",
    filteredValue: [],
    sorter: true,
    width: 120,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n489")),
    dataIndex: "successSubOrderAmount",
    key: "successSubOrderAmount",
    align: "center",
    filteredValue: [],
    sorter: true,
    width: 140,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n497")),
    dataIndex: "returnedSubOrderAmount",
    key: "returnedSubOrderAmount",
    align: "center",
    filteredValue: [],
    sorter: true,
    width: 140,
  },
  {
    title: t("n63"),
    dataIndex: "remainingAmount",
    key: "remainingAmount",
    align: "center",
    filteredValue: [],
    sorter: true,
    width: 140,
  },
  {
    title: t("n490"),
    dataIndex: "canceledSubOrderAmount",
    key: "canceledSubOrderAmount",
    exportFields: [
      "canceledSubOrderCount",
      "canceledSubOrderAmount",
      "payTimeoutSubOrderCount",
      "payTimeoutSubOrderAmount",
      "failedSubOrderCount",
      "failedSubOrderAmount",
    ],
    align: "center",
    filteredValue: [],
    width: 170,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n491")),
    dataIndex: "orderMatchCount",
    key: "orderMatchCount",
    align: "center",
    sorter: true,
    filteredValue: [],
    width: 120,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n645")),
    dataIndex: "sellStrategy",
    key: "sellStrategy",
    align: "center",
    filters: Object.entries(splitStrategyMap).map(([key, value]:[any,any]) => ({
              value: key,
              text: t(value),
            })),
    filterMultiple: false,
    filteredValue: query.value.sellStrategy != undefined ? [query.value.sellStrategy] : null,
    onFilter: (value:any, record:any) => record.sellStrategy == value,
    width: 120,
  },
  {
    title: t("n492"),
    dataIndex: "completeDuration",
    key: "completeDuration",
    align: "center",
    filteredValue: [],
    width: 140,
    customRender: ({ record }:{record:any}) => {
      if (!record.completeDuration && ['7', '8', '21'].includes(record.orderStatus)) {
        return '-';
      }
      if (record.completeDuration) {
        return formatTime(record.completeDuration);
      }else{
        const remaining = record.defferentTime + now.value;
        return formatTime(remaining);
      }
    },
  },
  {
    title: t("m734"),
    dataIndex: "completeTime",
    key: "completeTime",
    align: "center",
    filteredValue: [],
    width: 140,
  },
  {
    title: t("n582"),
    dataIndex: "sellOrderType",
    key: "sellOrderType",
    align: "center",
    filters: Object.entries(sellOrderTypeMap).map(([key, value]:[any,any]) => ({
              value: key,
              text: t(value),
            })),
    filterMultiple: false,
    filteredValue: query.value.sellOrderType != undefined ? [query.value.sellOrderType] : null,
    width: 140,
  },
  {
    title: t("m36"),
    dataIndex: "upiId",
    key: "upiId",
    exportFields: ["upiId", "bankName", "bankOwner", "ifsc", "bankCardNumber"],
    align: "center",
    filteredValue: [],
    width: 230,
  },
  {
    title: t("n476"),
    dataIndex: "matchTimeoutReason",
    key: "matchTimeoutReason",
    align: "center",
    filters: Object.entries(matchTimeoutReasonMap).map(([key, value]:[any,any]) => ({
              value: key,
              text: value,
            })),
    filterMultiple: false,
    filteredValue: query.value.matchTimeoutReason != undefined ? [query.value.matchTimeoutReason] : null,
    onFilter: (value:any, record:any) => record.matchTimeoutReason == value,
    width: 180,
  },
  {
    title: t("n493"),
    dataIndex: "matchTimeoutCount",
    key: "matchTimeoutCount",
    align: "center",
    filteredValue: [],
    sorter: true,
    width: 140,
  },
  {
    title: t("n494"),
    dataIndex: "matchTimeoutTime",
    key: "matchTimeoutTime",
    align: "center",
    filteredValue: [],
    width: 140,
  },
  {
    title: t("n477"),
    dataIndex: "orderFinishType",
    key: "orderFinishType",
    align: "center",
    filters: Object.entries(orderFinishTypeMap).map(([key, value]:[any,any]) => ({
              value: key,
              text: value,
            })),
    filterMultiple: false,
    filteredValue: query.value.orderFinishType != undefined ? [query.value.orderFinishType] : null,
    onFilter: (value:any, record:any) => record.orderFinishType == value,
    width: 140,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    fixed: "right",
    filteredValue: [],
    width: 100,
  },
];
const detailModel = ref(false);
  const detailId = ref({
    id: 0,
    memberId: 0,
  });
const showMember = (id: any) => {
    detailModel.value = true;
    detailId.value.id = id;
  };
const {
  menuId,
  defaultColumns,
  selectedColumns,
  dynamicColumns,
  drawerVisible,
  openDrawer,
  tableKey,
} = useTableColumnDrawer(columns);

// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const {
  dataSource,
  pagination,
  extendData,
  response,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: getMatchPoolListPage,
  defaultPageSize: 20,
  filterRules: [
    { key: "orderStatus"},
    { key: "matchTimeoutReason"},
    { key: "orderFinishType" },
    { key: "sellOrderType" },
    { key: "autoSellFlag", validValues: Object.keys(autoSellFlagMap) },
    { key: "sellStrategy" },
  ],
});
watchEffect(() => {
  if(!isUseCash.value) resultData.value = response.value;
  if(dataSource.value.length){
    const nowTime = ref(new Date(getIndiaLocalTime()).getTime());
    dataSource.value = dataSource.value.map((item: any) => {
      // if(item.orderStatus == '14'){
      //   item.orderStatus = '1';
      // }
      item.defferentTime = null;
      if(!item.completeDuration){
        const cTime = new Date(item.createTime).getTime();
        item.defferentTime = Math.floor((nowTime.value - cTime) / 1000);
      }
      return item;
    });
  }
  if (dataSource.value.some((item: any) => !item.completeDuration)) {
    startTimer();
  } else {
    stopTimer();
  }
})
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (isFirst: any = null) => {
//   console.log(query.value.pageNo,'queryPageNo');
//   if (isFirst) {
//     query.value.pageNo = 1;
//     pagination.value.current = 1;
//   }
//   loading.value = true;
  
//     const queryPageNo = query.value.pageNo;
//     queryCount.value = queryPageNo - oldPageNo.value;
//     if(query.value.pageNo == 1){
//       query.value.firstPage = true;
//       query.value.lastPage = false;
//       resetPageQuery();
//     }else if(query.value.pageNo == pageCurrent.value){
//       query.value.firstPage = false;
//       query.value.lastPage = true;
//       resetPageQuery();
//     }else if(queryCount.value > 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'next';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }else if(queryCount.value <= 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'prev';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }
//   const res: any = await getMatchPoolListPage(query.value).finally(() => (loading.value = false));
//   if (res && res.code === "1") {
//     const nowTime = ref(new Date(getIndiaLocalTime()).getTime());
//     indiaLocalTimeDate.value = getIndiaLocalTime();
//     dataSource.value = res.data.map((item: any) => {
//       // if(item.orderStatus == '14'){
//       //   item.orderStatus = '1';
//       // }
//       item.defferentTime = null;
//       if(!item.completeDuration){
//         const cTime = new Date(item.createTime).getTime();
//         item.defferentTime = Math.floor((nowTime.value - cTime) / 1000);
//       }
//       return item;
//     });
//     if (dataSource.value.some((item: any) => !item.completeDuration)) {
//       timer;
//     } else {
//       clearInterval(timer);
//     }
//     extendData.value = res.extend;
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//     pagination.value.current = query.value.pageNo;
//     pagination.value.pageSize = query.value.pageSize;
//     pagination.value.total = res.total;
//     oldPageNo.value = query.value.pageNo;
//     pageCurrent.value = Math.ceil(res.total/query.value.pageSize);
//   }
// };
// const getforData = async ()=>{
//   const res: any = await getMatchPoolListPage(query.value);
//   if(res.code == 1){
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//   }
// }
// const resetPageQuery = ()=>{
//     query.value.direction = '';
//     query.value.nextColValue = '';
//     query.value.nextCursorId = '';
//     query.value.prevColValue = '';
//     query.value.prevCursorId = '';
// }
// const { handleTableChange } = useTableChange({
//   query,
//   pagination,
//   getList,
//   filterRules: [
//     { key: "orderStatus"},
//     { key: "matchTimeoutReason"},
//     { key: "orderFinishType" },
//     { key: "sellOrderType" },
//     { key: "sellStrategy" },
//   ],
// });

// const resetQuery = () => {
//   query.value = {
//     asc: false,
//     column: "",
//     pageNo: 1,
//     pageSize: 20,
//     createTimeEnd: '',
//     createTimeStart: '',
//     matchOrder: '',
//     orderStatus: undefined,
//     upiId: undefined,
//     memberId: undefined,
//     matchTimeoutReason: undefined,
//     orderFinishType: undefined,
//     isQuadOrder: undefined,
//     quadOrder: undefined,
//     completeTimeStart: '',
//     completeTimeEnd: '',
//     sellOrderType: undefined,
//     associationOrderNo: undefined,
//     sellStrategy: undefined,
//     merchantPaymentOrderNo: undefined,
//     sourceOrderType: undefined,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
    
//   };
//   pagination.value.current = 1;
//   pagination.value.pageSize = 20;
//   getList();
// };
const exportList = async () => {
  loading.value = true;
  const res: any = await matchPoolAdminExport(query.value).finally(() => (loading.value = false));
  if (res && res.code == '1'){
    message.success(t("n545"));
  }
};

const goSell = (matchOrder: any) => {
  router.push({ path: "/order/sale/index", query: { matchOrder } });
};
const goReward = (rewardId: any) => {
  router.push({ path: "/config/getRewardsRecord", query: { rewardId } });
};
const failedOrder = async (orderNo: any) => {
  loading.value = true;
  const res: any = await getMatchPoolFailReturn({
    matchPoolOrder: orderNo,
  }).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    message.success(t("s10"));
    getList();
  }
};
//撮合超时日志
const logDialog = ref(false);
const matchOrder = ref('');
const showTimeoutLogs = (matchOrderValue: any) => {
  matchOrder.value = matchOrderValue;
  logDialog.value = true;
};
const cancelTimeoutLogs = () => {
  logDialog.value = false;
  matchOrder.value = '';
};
onMounted(() => {
  const pathName = route.fullPath.split('?')[0];
  if(pageCash.value.includes(pathName) && Object.keys(route.query).length == 0){
    const { queryCash, res, extend } = getPageCash(pathName);
    if(!res.data || res.data && res.data.length == 0) {
      isUseCash.value = false;
      getList();
    }else{
      isUseCash.value = true;
      query.value = queryCash;
      dataSource.value = res.data;
      resultData.value = res;
      extendData.value = extend;
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
onUnmounted(() => {
  stopTimer();
});
</script>
<style lang="less" scoped>
.searchMatchingTime {
  margin-left: 20px;
  font-size: 14px;
  color: #ef0101;
}
.copyContent{
  padding: 3px;
  height: auto;
}
</style>
