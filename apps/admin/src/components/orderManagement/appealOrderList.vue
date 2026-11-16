<template>
  <div class="search">
    <!-- <countDown :title="$t('n36')" @zero="getList()" /> -->
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.mid"
          :placeholder="$t('p4')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.id"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m959')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.withdrawOrderNo"
          :placeholder="$t('p44')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.sellKycId"
          :placeholder="$t('m562')+$t('m991')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.rechargeOrderNo"
          :placeholder="$t('p45')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.buyAutoAppealPhone"
          :placeholder="$t('m562')+$t('m960')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.quadOrder"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n864')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('m563')+$t('m203')"
        v-model:value="query.appealType"
        :options="Object.entries(appealMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value), }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
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
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.isKycSellOrder"
          :placeholder="$t('m607')"
          :allowClear="true"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('m563')+$t('m577')"
        v-model:value="query.sellBankCode"
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
        class="searchstyle"
        :placeholder="$t('m563')+$t('m335')"
        v-model:value="query.displayAppealType"
        :options="Object.entries(displayAppealTypeMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value), }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('m563')+$t('state')"
        v-model:value="query.appealStatus"
        :options="Object.entries(appealStatusMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: $t(value), }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n626')"
          v-model:value="query.sourceType"
          :options="Object.entries(orderSourceMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: $t(value),
          }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('n1457')"
          v-model:value="query.finishType"
          :options="Object.entries(finishTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          showSearch
          class="searchstyle"
          :placeholder="$t('m563') + $t('n1438')"
          v-model:value="query.handlerUserId"
          :options="userList"
          :filter-option="filterUserOption"
        />
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('n44')" :type="1"/>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.finishTimeStart" v-model:endTime="query.finishTimeEnd" :title="$t('m734')" :type="1"/>
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
          <a-button :loading="loading" type="primary" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
          <ExportButton
            :query="query"
            :api="appealOrderControllerExport"
            :enable-export-fields="true"
            permission="admin:appealOrderAdmin:export"
          />
          <!-- <a-button type="primary" :loading="loading" @click="exportList" v-permission="'admin:appealOrderAdmin:export'">{{
            $t("export")
          }}</a-button> -->
          <a-button @click="openDrawer">{{ $t("m741") }}</a-button>
          <a-button :loading="loading" type="primary" @click="query.handlerUserId = currentUser.userId;getList()">{{
            $t("n1439")
          }}</a-button>
        </a-space>
      </a-col>
    </a-row>
    <!-- <a-row>
      <a-col :span="24">
        <multi-select-dropdown
          :options="columnOptions"
          v-model="selectedColumns"
        />
      </a-col>
    </a-row> -->
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
      <template v-if="column.key === 'mid'">
        <a-button type="link" class="copyContent" @click="showMember(record.mid)">{{
          record.mid
        }}</a-button>
        <CopyOutlined v-if="record.mid" class="copyId"  @click="$copyId(record.mid)" />
      </template>
      <template v-if="column.key === 'appealType'">
        <span :class="record.appealType == 1 ? 'tag-green' : 'tag-blue'">
          {{ $t(appealMap[record.appealType]) }}
        </span>
      </template>
      <template v-if="column.key ==='merchantName'">
        {{ record.merchantName || '-' }}
      </template>
      <template v-if="column.key === 'isQuadOrder'">
        <div style="text-align: left;">
          {{ $t('m905') }}:
          <span :class="record.isQuadOrder == 1 ? 'tag-green' : 'tag-red' ">
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
      <template v-if="column.key ==='quadOrder'">
        <a-tooltip v-if="record.quadOrder">
          <template #title>{{ record.quadOrder }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.quadOrder }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <!-- <template v-if="column.key === 'isQuadOrder'">
        <span :style="{ color: record.isQuadOrder == 1 ? 'green' : '' }">{{ record.isQuadOrder == 1 ? $t("yes") : $t("no") }}</span>
      </template> -->
      <template v-if="column.key === 'updateBy'">
        <a-tooltip>
          <template #title>
            {{ record.updateBy || '-' }}
          </template>
          {{ record.updateBy || '-' }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'isKycSellOrder'">
        <span :class="record.isKycSellOrder == 1 ? 'tag-green' : 'tag-gray' ">{{ record.isKycSellOrder == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <template v-if="column.key === 'sellBankCode'">
        <a-tooltip>
          <template #title>
            <div>{{ $t('n104') }}：{{ record.buyAutoAppealBankCode || '-' }}</div>
            <div>{{ $t('n100') }}：{{ record.sellBankCode || '-' }}</div>
          </template>
          <div style="text-align: left;">
            <div class="toopTipStyle">
              <span>{{ $t('n104') }}：</span>
              {{ record.buyAutoAppealBankCode || '-' }}
            </div>
            <div class="toopTipStyle">
              <span>{{ $t('n100') }}：</span>
              {{ record.sellBankCode || '-' }}
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'rechargeOrderNo'">
        <a-button type="link" class="copyContent" @click="goAssemble(record.rechargeOrderNo)">{{
          record.rechargeOrderNo
        }}</a-button>
        <CopyOutlined v-if="record.rechargeOrderNo" class="copyId"  @click="$copyId(record.rechargeOrderNo)" />
      </template>
      <template v-if="column.key === 'buyAutoAppealPhone'">
        <a-button v-if="record.buyAutoAppealPhone" class="copyContent" type="link" @click="goPath(1,hasPro('/kyc/kycBuyAppealRec'),record.buyAutoAppealPhone)">{{ record.buyAutoAppealPhone }}</a-button>
        <CopyOutlined v-if="record.buyAutoAppealPhone" class="copyId"  @click="$copyId(record.buyAutoAppealPhone)" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'sourceType'">
        <span v-if="record.sourceType">{{ $t($getMapItem(orderSourceMap,record.sourceType)) }}</span>
        <span v-else >{{ $t('n623') }}</span>
      </template>
      <template v-if="column.key === 'withdrawOrderNo'">
        <a-button
          type="link"
          class="copyContent"
          @click="goAssemble(record.withdrawOrderNo, false)"
          >{{ record.withdrawOrderNo }}</a-button
        >
        <CopyOutlined v-if="record.withdrawOrderNo" class="copyId"  @click="$copyId(record.withdrawOrderNo)" />
      </template>
      <template v-if="column.key === 'sellKycId'">
        <!-- <a-button v-if="record.sellKycId" type="link" class="copyContent" @click="goPath(0,hasPro('/order/kycRecords'),record.sellKycId)">{{ record.sellKycId }}</a-button> -->
        <span>{{ record.sellKycId }}</span>
        <CopyOutlined v-if="record.sellKycId" class="copyId"  @click="$copyId(record.sellKycId)" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'appealStatus'">
        <span :class="record.appealStatus == 1 ? 'tag-blue' : record.appealStatus == 2 ? 'tag-green' : 'tag-red' ">
          {{ Number(record.appealStatus) == 1 ||Number(record.appealStatus) == 4 ?  $t(appealStatusMap[1]) : $t(appealStatusMap[Number(record.appealStatus)]) }}
        </span>
      </template>
      <template v-if="column.key === 'displayAppealType'">
        <span>
          {{  record.displayAppealType ? $t($getMapItem(displayAppealTypeMap,record.displayAppealType)) : '-' }}
        </span>
      </template>
      <template v-if="column.key == 'autoAppealType'">
        <span v-if=" record.displayAppealType == 5" :class="colorMap[record.autoAppealType]">{{ record.autoAppealType ? $t($getMapItem(displayAppealTypeMap,record.autoAppealType)) : '-'  }}</span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key ==='finishTime'">
        {{ record.finishTime || '-' }}
      </template>
      <template v-if="column.key ==='finishType'">
        <span>
          {{ $getMapItem(finishTypeMap,record.finishType) || '-' }}
        </span>
      </template>
      <template v-if="column.key === 'internalRemark'">
        <a-tooltip>
          <template #title>
            {{ record.internalRemark || '-' }}
          </template>
          {{ record.internalRemark || '-' }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'handlerUserName'">
        <a-tooltip>
          <template #title>
            {{ record.handlerUserName || '-' }}
          </template>
          {{ record.handlerUserName || '-' }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operate'">
      <a-tag
          v-if="[1,2].includes(record.appealStatus)"
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="appealDetails(record)"
          >{{ $t("b30") }}
        </a-tag>
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
  <!-- 申诉详情 -->
  <!-- <a-modal
    v-model:open="appealDialog"
    :title="$t('b30')"
    width="70%"
    :footer="null"
  >
    <appealDetailModal />
  </a-modal> -->
  <a-modal
    v-model:open="appealDialog"
    :title="null"
    wrap-class-name="full-modal"
    width="100%"
    :footer="null"
    @cancel="closeAppealInfo"
  >
    <assembleAppealDetails v-if="appealDialog" @refresh="refreshDetails" :assembleRecord="assembleRecord" :appealRecord="appealRecord" :pageType="1" />
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed, watch } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { getAppealOrderListPage,getMatchListData,getKycBankCodeList,getUserListPage } from "@/api";
import countDown from "@/components/countDown.vue";
import { useI18n } from "vue-i18n";
import { currency, thousand,formatTime } from "@/utils";
import memberDetail from "@/components/Member/memberDetail.vue";
import router from "@/router";
import { useRoute } from 'vue-router'
import { appealOrderControllerExport } from "@/api/export";
import { getStartAndEndOfDay,getIndiaLocalTime } from "@/plugins/dataMap";
import { payTypeData,appealMap,orderSourceMap,displayAppealTypeMap,colorMap } from "@/utils/publicData";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { useTableColumnDrawer } from "@/hooks/useTableColumnDrawer";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import assembleAppealDetails from "@/components/orderManagement/assembleAppealDetails.vue";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import appealDetailModal from "@/components/orderManagement/appealDetails.vue";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import { message } from "ant-design-vue";
const { getTabH } = useTabHeight(1);
const { t } = useI18n();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const indiaLocalTimeDate = ref(getIndiaLocalTime());
// const dataSource = ref([]);
// const extendData = ref<any>({});
  const route = useRoute();
// const loading = ref(false);
const detailModel = ref(false);

interface Query {
  asc: boolean;
  createTimeEnd: string | null;
  createTimeStart: string | null;
  mid: string;
  pageNo: number;
  pageSize: number;
  rechargeOrderNo: string;
  withdrawOrderNo: string;
  appealType?: any;
  id?: any;
  payType?: string | undefined;
  sellKycId?: string | undefined;
  buyAutoAppealPhone?: string | undefined;
  isQuadOrder?: string | undefined;
  quadOrder?: string | undefined;
  finishTimeStart: string;
  finishTimeEnd: string;
  displayAppealType?: string | undefined;
  appealStatus?: string | undefined;
  isKycSellOrder?: string | undefined;
  sourceType?: any;
  sellBankCode?: string | undefined;
  handlerUserId?: any;
  finishType: any;
  firstPage: boolean;
  lastPage: boolean;
  direction: string;
  nextColValue: string;
  nextCursorId: string;
  prevColValue: string;
  prevCursorId: string;
}
const query = ref<Query>({
  asc: false,
  createTimeEnd: route.query.appealId ? '' :endIndiaTime,
  createTimeStart: route.query.appealId ? '' :startIndiaTime,
  mid: "",
  pageNo: 1,
  pageSize: 20,
  rechargeOrderNo: "",
  withdrawOrderNo: "",
  appealType: route.query.appealType || undefined,
  id: route.query.appealId ||undefined,
  payType: undefined,
  sellKycId: undefined,
  buyAutoAppealPhone: undefined,
  isQuadOrder: undefined,
  quadOrder: undefined,
  finishTimeStart: '',
  finishTimeEnd: '',
  displayAppealType: undefined,
  appealStatus: undefined,
  isKycSellOrder: undefined,
  sourceType: undefined,
  sellBankCode: undefined,
  handlerUserId: undefined,
  finishType: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      orderAmount: extendData.value.orderAmountPageTotal,
      actualAmount: extendData.value.actualAmountPageTotal,
    },
  },
  {
    label: t("m55"),
    fields: {
      orderAmount: extendData.value.orderAmountTotal,
      actualAmount: extendData.value.actualAmountTotal,
    },
    fixedPositions: {
      amount: 5,
    },
  },
]);
const appealStatusMap = <any>{
  1: "n88",
  2: "s16",
  3: "s17",
};
const finishTypeMap = <any>{
  1: t("n1458"), //系统成功
  2: t("n1459"), //系统失败
  3: t("n1460"), //人工成功
  4: t("n1461"), //人工失败
}
// const appealTypeMap = <any>{
//   1: 'n37',//未支付
//   2: 'n91',//金额错误
//   3: 'n87',//确认超时
//   4: 'm952',//买入自动申诉
//   5: 'm953',//卖出自动申诉
//   6: 'n449',//买入失败申诉
//   7: 'n1184',//KYC验证码发送失败
// }
const detailId = ref({
  id: 0,
  memberId: 0,
});
const columns:any = [
  {
    title: t("e47"),
    dataIndex: "index",
    key: "index",
    align: "center",
    filteredValue: [],
    width: 90,
    customRender: ({ index }:{index:any}) => index + 1,
    fixed: "left",
  },
  {
    title: t("m959"),
    dataIndex: "id",
    key: "id",
    align: "center",
    isRequired: true,
    filteredValue: [],
    width: 90,
  },
  {
    title: t("c9"),
    dataIndex: "mid",
    key: "mid",
    align: "center",
    isRequired: true,
    filteredValue: [],
    width: 120,
  },
  {
    title: t("m203"),
    dataIndex: "appealType",
    key: "appealType",
    align: "center",
    isRequired: true,
    filteredValue: [],
    width: 130,
  },
  {
    title: t("l92"),
    dataIndex: "merchantName",
    key: "merchantName",
    align: "center",
    filteredValue: [],
    width: 130,
  },
  {
    title: t("n40"),
    dataIndex: "withdrawOrderNo",
    key: "withdrawOrderNo",
    filteredValue: [],
    align: "center",
    width: 240,
  },
  {
    title: t("m991"),
    dataIndex: "sellKycId",
    key: "sellKycId",
    align: "center",
    filteredValue: [],
    width: 140,
  },
  {
    title: t("n41"),
    dataIndex: "rechargeOrderNo",
    key: "rechargeOrderNo",
    align: "center",
    filteredValue: [],
    width: 240,
  },
  {
    title: t("m960"),
    dataIndex: "buyAutoAppealPhone",
    key: "buyAutoAppealPhone",
    filteredValue: [],
    align: "center",
    width: 140,
  },
  {
    title: t("m607"),
    dataIndex: "isKycSellOrder",
    key: "isKycSellOrder",
    align: "center",
    filteredValue: [],
    width: 130,
  },
  {
    title: t("m577"),
    dataIndex: "sellBankCode",
    key: "sellBankCode",
    exportFields: ["sellBankCode", "buyAutoAppealBankCode"],
    align: "center",
    filteredValue: [],
    width: 160,
  },
  {
    title: t("state"),
    dataIndex: "appealStatus",
    key: "appealStatus",
    align: "center",
    filters: [
      { text: t('n88'), value: 1 },
      { text: t('s16'), value: 2 },
      { text: t('s17'), value: 3 },
    ],
    filterMultiple: false,
    filteredValue: query.value.appealStatus != undefined ? [query.value.appealStatus] : null,
    width: 140,
  },
  {
    title: t("n626"),
    dataIndex: "sourceType",
    key: "sourceType",
    align: "center",
    filters: Object.entries(orderSourceMap).map(([key, value]:[any,any]) => ({
              value: key,
              text: t(value),
            })),
    filterMultiple: false,
    filteredValue: query.value.sourceType != undefined ? [query.value.sourceType] : null,
    width: 180,
  },
  {
    title: t('l48'),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    filteredValue: [],
    width: 140,
  },
  {
    title: t('m335'),
    dataIndex: "displayAppealType",
    key: "displayAppealType",
    align: "center",
    filteredValue: [],
    width: 140,
  },
  {
    title: t('m924'),
    dataIndex: "autoAppealType",
    key: "autoAppealType",
    align: "center",
    filteredValue: [],
    width: 140,
  },
  {
    title: t("m812"),
    dataIndex: "isQuadOrder",
    key: "isQuadOrder",
    exportFields: ["isQuadOrder", "quadOrderChannel"],
    filteredValue: [],
    align: "center",
    width: 130,
  },
  // {
  //   title: t("m674"),
  //   dataIndex: "quadOrderChannel",
  //   key: "quadOrderChannel",
  //   align: "center",
  //   width: 130,
  // },
  {
    title: t("n864"),
    dataIndex: "quadOrder",
    key: "quadOrder",
    filteredValue: [],
    align: "center",
    width: 240,
  },
  {
    title: t("n42"),
    dataIndex: "orderAmount",
    key: "orderAmount",
    isRequired: true,
    align: "center",
    width: 190,
  },
  {
    title: t("n43"),
    dataIndex: "actualAmount",
    key: "actualAmount",
    isRequired: true,
    filteredValue: [],
    align: "center",
    width: 190,
  },
  {
    title: t("n44"),
    dataIndex: "createTime",
    key: "createTime",
    filteredValue: [],
    align: "center",
    width: 190,
  },
  {
    title: t("m734"),
    dataIndex: "finishTime",
    key: "finishTime",
    filteredValue: [],
    align: "center",
    width: 190,
  },
  {
    title: t("n1457"),
    dataIndex: "finishType",
    key: "finishType",
    filteredValue: [],
    align: "center",
    width: 200,
  },
  {
    title: t("n1455"),
    dataIndex: "internalRemark",
    key: "internalRemark",
    filteredValue: [],
    align: "center",
    width: 200,
  },
  {
    title: t("n1438"),
    dataIndex: "handlerUserName",
    key: "handlerUserName",
    filteredValue: [],
    align: "center",
    fixed: 'right',
    width: 160,
  },
  {
    title: t("n896"),
    dataIndex: "defferentTime",
    key: "defferentTime",
    filteredValue: [],
    align: "center",
    fixed: 'right',
    width: 160,
    customRender: ({ record }:{record:any}) => {
      if (record.appealStatus != 1) {
        return formatTime(record.defferentTime);
      }else{
        const remaining = record.defferentTime + now.value;
        return formatTime(remaining);
      }
    },
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    filteredValue: [],
    align: "center",
    width: 120,
    fixed: 'right',
  },
];
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
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
const {
  menuId,
  defaultColumns,
  selectedColumns,
  dynamicColumns,
  drawerVisible,
  openDrawer,
  tableKey,
} = useTableColumnDrawer(columns);

const {
  dataSource,
  pagination,
  extendData,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: getAppealOrderListPage,
  defaultPageSize: 20,
  filterRules: [
    { key: "appealStatus" },
    { key: "sourceType" },
  ],
  afterFetch: (data) =>
  data.map((item: any) => {
    item.actualAmount = currency(item.actualAmount, false);
    item.orderAmount = currency(item.orderAmount, false);
    return item;
  }),
  afterGetDataFunc: () =>{
    if(dataSource.value.length){
      const nowTime = ref(new Date(getIndiaLocalTime()).getTime());
      dataSource.value = dataSource.value.map((item: any) => {
        item.defferentTime = null;
        if(item.appealStatus == 1){
          const cTime = new Date(item.createTime).getTime();
          item.defferentTime = Math.floor((nowTime.value - cTime) / 1000);
        }else{
          const cTime = new Date(item.createTime).getTime();
          const fTime = new Date(item.finishTime).getTime();
          item.defferentTime = !item.finishTime ? Math.floor((nowTime.value - cTime) / 1000) : Math.floor((fTime - cTime) / 1000);
        }
        return item;
      });
    }
    if (dataSource.value.some((item: any) => item.appealStatus == 1)) {
      startTimer();
    } else {
      stopTimer();
    }
  }
});
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
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
const hasPro = (path: string) => {
  const name = path.split('/').join('_')
  return router.hasRoute(name)
}
const goPath = (pathType: number, isGo:boolean, val:any)=>{
  if(!isGo) return;
  const goMap = [
    {name:'_order_kycRecords', query: {sellKycId: val}},
    {name:'_kyc_kycBuyAppealRec', query: {buyAutoAppealPhone: val}},
  ];
  router.push(goMap[pathType])
}
// 申诉详情

const detailObj = ref<any>({});
const assembleRecord = ref<any>({});
const appealRecord = ref<any>({});
const appealDialog = ref(false);
const appealDetails = async (value: any) => {
  selectedRow();
  const { withdrawOrderNo } = value;
  appealRecord.value = value;
  loading.value = true;
  const res:any = await getMatchListData({
    asc:false,
    pageNo:1,
    pageSize:10,
    firstPage: true,
    lastPage: false,
    paymentPlatformOrder: withdrawOrderNo,
   }).finally(() => {
    loading.value = false;
  });
  if (res && res.code == "1" && res.data.length >0) {
    assembleRecord.value = res.data[0];
    appealDialog.value = true;
    detailObj.value = value;
  } else {
    assembleRecord.value = [];
    message.error(t("m618"));
  }
};
const closeAppealInfo = () => {
  appealDialog.value = false;
  assembleRecord.value = {};
  getList();
};
const refreshDetails = () => {
  appealDetails(appealRecord.value);
};
// const { getMatchListDetail, getAmountErrorVoucher, getAppealDetailData } =
//   getUsdtBuyOrderInfo();
// const appealDialog = ref(false);
// const detailObj = ref<any>({});
// const appealDetails = (value: any) => {
//   const { id } = value;
//   getAppealDetailData({ id,idType:2 });
//   appealDialog.value = true;
//   detailObj.value = value;
// };

const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res:any = await appealOrderControllerExport(data).finally(() => {
    loading.value = false;
  });
  if (res && res.code == "1") {
    message.success(t("n545"));
  }
};
const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};
//获取当前用户
const currentUser =JSON.parse(localStorage.getItem("userInfo") || "{}");
// 获取用户列表
const userList = ref<any>([]);
  const filterUserOption = (input: string, option: any) => {
  const keyword = input.toLowerCase()

  return (
    option.userId.includes(keyword) ||
    option.userName.toLowerCase().includes(keyword)
  )
}
const getUserList = async () => {
  loading.value = true;
  const res: any = await getUserListPage({
    pageNo: 1,
    pageSize: 1000,
    status: 1,
  }).finally(() => {
    loading.value = false;
  });
  if (res && res.code == "1") {
    userList.value = res.data.map((item:any)=>{
      return {
        value: item.id,
        label: item.username,
        userId: String(item.id),
        userName: item.username,
      }
    }) || [];
  }
};
onMounted(() => {
  getUserList();
  getGroupList();
  getList();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped></style>
