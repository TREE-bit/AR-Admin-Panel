<template>
  <div class="search">
    <a-row>
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.kycId"
          class="searchstyle"
          :placeholder="$t('m562')+'KYC ID'"
        />
      </a-col> -->
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+$t('m149')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.appealId"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+$t('m959')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.phoneNumber"
          allow-clear
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
          allow-clear
          v-model:value="query.recipient"
          :placeholder="$t('m562')+$t('m691')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.payer"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+$t('m693')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.utr"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+'UTR'"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          :placeholder="$t('m563')+$t('b27')"
          v-model:value="query.recipientType"
          :options="Object.entries(recipientTypeMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          :placeholder="$t('m563')+$t('n1332')"
          v-model:value="query.misTypedUtr"
          :options="[
            { value: 0, label: $t('no') },
            { value: 1, label: $t('yes') },
          ]"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.misTypedUtrOrder"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+$t('n1333')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          :placeholder="$t('m563')+$t('n1412')"
          v-model:value="query.misTypedUtrCompleted"
          :options="[
            { value: 0, label: $t('no') },
            { value: 1, label: $t('yes') },
          ]"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.sellerOrderId"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+$t('n40')"
        />
      </a-col>
        <!-- <a-col :span="3">
          <a-input v-trim
            v-model:value="query.randomCode"
            class="searchstyle"
            :placeholder="$t('m562')+$t('m635')"
          />
        </a-col> -->
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.tId"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+$t('m635')"
        />
      </a-col>
      <!-- <a-col :span="4">
        <a-select
          class="searchstyle"
          v-model:value="query.merchantName"
          :options="merchantList"
          :placeholder="$t('p26')"
          :allowClear="true"
        >
        </a-select>
      </a-col> -->
      <!-- <a-col :span="4">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.riskTag"
          :placeholder="$t('m468')"
        >
          <a-select-option
            v-for="(item, key) in windControl"
            :value="key"
            :key="item"
            >{{ $t(item) }}</a-select-option
          >
        </a-select>
      </a-col> -->
      <!-- <a-col :span="4">
        <a-input
          v-model:value="query.matchOrder"
          class="searchstyle"
          :placeholder="$t('e13')"
        />
      </a-col> -->
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
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          :placeholder="$t('m563')+$t('n316')"
          v-model:value="query.replenishmentFlag"
        >
          <a-select-option :value="1">{{ $t('n313') }}</a-select-option>
        </a-select>
      </a-col>
      <a-col>
        <!-- <a-range-picker
          class="searchstyle"
          show-time
          v-model:value="searchDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m172')]"
        /> -->
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
        <!-- <a-button type="primary" @click="exportList"     v-permission="'admin:paymentOrderAdmin:export'">{{
          $t("export")
        }}</a-button> -->
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
      <!-- <template v-if="column.key === 'createTime'">
        {{
          record.updateTime ? record.updateTime : record.createTime
        }}
      </template> -->
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
    <!-- <template v-if="column.key === 'failedReason'">
      <a-tooltip>
        <template #title>{{ record.failedReason }}</template>
        <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.failedReason }}</div>
      </a-tooltip>
    </template> -->
      <!-- <template v-if="column.key === 'orderStatus'">
        <a-tag>{{ $t(orderStatusMap[Number(record.orderStatus)]) }}</a-tag>
      </template> -->
      <!-- <template v-if="column.key === 'platformOrder'">
        <a-button type="link" @click="goAssemble(record.platformOrder)">
        {{ record.platformOrder }}</a-button>
      </template> -->
    <!-- <template v-if="column.key === 'remark'">
      <a-tooltip>
        <template #title>{{ record.remark }}</template>
        <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
      </a-tooltip>
    </template> -->
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
    <template v-if="column.key === 'operate'">
        <!-- v-if="!['3'].includes(record.status)"
        v-permission="'admin:matchingOrderAdmin:getInfo'" -->
      <a-tag
        color="red"
        style="cursor: pointer;"
        size="small"
        v-if="record.isMatch == 0"
        @click="openManualMadal(record)"
        v-permission="'admin:matchingOrderAdmin:orderReplenishmentByWater3'"
        >{{ $t("m700") }}
      </a-tag>
    </template>
    </template>
    <!-- <template #summary>
      <a-table-summary fixed="bottom">
        <a-table-summary-row>
          <a-table-summary-cell :col-span="8"> {{ $t("m54") }}</a-table-summary-cell>
          <a-table-summary-cell :col-span="1" align="center">
            <a-typography-text type="danger">{{ currency(extendData.amountPageTotal, false) }}</a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="5" />
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell :col-span="8">{{ $t("m55") }}</a-table-summary-cell>
          <a-table-summary-cell :col-span="1" align="center">
            <a-typography-text type="danger"> {{ currency(extendData.amountTotal, false) }} </a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :col-span="5" />
        </a-table-summary-row>
      </a-table-summary>
    </template> -->
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
  <!-- 补单 -->
  <a-modal
    v-model:open="manualModal"
    :title="$t('m700')"
    width="700px"
    @ok="manualKycOrder"
    @cancel="closeManualModal"
  >
    <a-form :model="manualForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-form-item :label="$t('l34')" name="amount" required>
        <span>{{ manualForm.amount }}</span>
      </a-form-item>
      <a-form-item :label="$t('n41')" name="orderNo" required>
        <a-input v-trim v-model:value="manualForm.orderNo" />
        <div class="config-tipMsg">{{ $t("n1335") }}</div>
      </a-form-item>
      <a-form-item
        :label="$t('n1396')"
      >
        <a-radio-group v-model:value="manualForm.delayFinish" :style="manualForm.delayFinish == 1 ? 'padding-top:5px;' : ''">
          <a-radio :value="1">{{ $t("yes") }}</a-radio>
          <a-radio :value="0">{{ $t("no") }}</a-radio>
        </a-radio-group>
        <a-select
          v-if="manualForm.delayFinish == 1"
          v-model:value="manualForm.delayType"
          style="margin-top:10px;"
          :placeholder="$t('m563')+ $t('n1397')"
          :options="Object.entries(delayTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
          >
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('n1399')"
      >
        <a-radio-group v-model:value="manualForm.disableBuy" :style="manualForm.disableBuy == 1 ? 'padding-top:5px;' : ''">
          <a-radio :value="1">{{ $t("yes") }}</a-radio>
          <a-radio :value="0">{{ $t("no") }}</a-radio>
        </a-radio-group>
        <a-select
          v-if="manualForm.disableBuy == 1"
          v-model:value="manualForm.disableLimitType"
          style="margin-top:10px;"
          :placeholder="$t('m563')+ $t('n1398')"
          :options="Object.entries(disableLimitTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
          >
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed, watchEffect } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { kycPartnerRecipientAdminListPage,kycManualReplenishment } from "@/api/order.api";
import {
getKycBankCodeList,
kycPartnerBuyAppealPaymentAdminListPage,
matchingOrderAdminOrderReplenishmentByWater
} from "@/api";
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import { getMerchantInfoAdminList } from "@/api/merchant.api";
import { currency } from "@/utils/index";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import router from "@/router";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { paymentOrderAdminExport } from "@/api/export";
import { delayTypeMap,disableLimitTypeMap } from "@/utils/publicData";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import memberDetail from "@/components/Member/memberDetail.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { usePageCash } from "@/hooks/usePageCash.hook"; 
const route = useRoute();
const { pageCash,setPageCash,getPageCash,clearPageCash } = usePageCash();
const resultData = ref({});
const isUseCash = ref(false);
onBeforeRouteLeave(() => {
  setPageCash(route.fullPath.split('?')[0], query.value, resultData.value, extendData.value);
})
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
const { t } = useI18n();
const detailModel = ref(false);
const merchantList = ref([]);
// const dataSource = ref([]);
// const extendData = ref<any>({});
// const loading = ref(false);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const orderStatusMap:any = {
  1: 'm641',
  2: 'm642',
  3: 'm643',
}
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
  endTime: route.query.buyAutoAppealPhone ? '' :endIndiaTime,
  startTime: route.query.buyAutoAppealPhone ? '' :startIndiaTime,
  selectType: 2,
  kycId: undefined,
  memberId: undefined,
  appealId: undefined,
  // upiName: undefined,
  bankCode: undefined,
  phoneNumber: route.query.buyAutoAppealPhone ||undefined as any,
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
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
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
  api: kycPartnerBuyAppealPaymentAdminListPage,
  fetchType: 1,
  defaultPageSize: 20,
  filterRules: [],
  afterFetch: (data) =>
    data.map((item: any) => {
      item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
      return item;
    }),
});
watchEffect(() => {
  if(!isUseCash.value) resultData.value = response.value;
});
// const getList = async (query: any) => {
//   loading.value = true;
//   pagination.value.current = query.pageNo;
//   pagination.value.pageSize = query.pageSize;
//   const res:any = await kycPartnerBuyAppealPaymentAdminListPage(Object.assign(query)).finally(()=>loading.value = false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data.map((item: any) => {
//       item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
//       return item;
//     });
//     extendData.value = res.extend;
//     resultData.value = res;
//     pagination.value.total = res.total;
//     loading.value = false;
//   }else{
//     loading.value = false;
//   }
// };
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//   pagination.value.current = pag.current;
//   pagination.value.pageSize = pag.pageSize;
//   getList(
//     Object.assign({}, query.value, {
//       pageSize: pag.pageSize,
//       pageNo: pag?.current,
//     })
//   );
// };
const { getsaleOrderDetail } = getUsdtBuyOrderInfo();
const openDetail = ref(false);
const detailObj = ref<any>({});
const checkDetail = (value: any) => {
  selectedRow();
  const { id } = value;
  getsaleOrderDetail({ id });
  openDetail.value = true;
  detailObj.value = value;
};
const search = () => {
  // query.value.pageNo = 1;
  // pagination.value.current = 1;
  getList(1);
}
// const resetQuery = () => {
//   query.value = {
//     asc: true,
//     column: "",
//     endTime: '',
//     startTime: '',
//     selectType: 2,
//     kycId: undefined,
//     memberId: undefined,
//     bankCode: undefined,
//     appealId: undefined,
//     // upiName: undefined,
//     payer: undefined,
//     phoneNumber: undefined,
//     recipient: undefined,
//     utr: undefined,
//     isMatch: undefined,
//     buyerOrderId: undefined,
//     sellerOrderId: undefined,
//     pageNo: 1,
//     pageSize: 20,
//     randomCode: undefined,
//     tId: undefined,
//   };
//   pagination.value.pageSize = 20;
//   pagination.value.current = 1;
//   clearSelected();
//   getList(query.value);
// };
//补单
const manualModal = ref(false);
const manualForm = ref({
  amount: undefined,
  orderNo: undefined,
  utr: undefined,
  waterType: 3,
  orderReplenishmentSource: 2,
  delayConsumer: 0,
  delayFinish: 0,
  delayType: undefined,
  delayTime: undefined,
  disableBuy: 0,
  disableLimitType: undefined,
  disableLimitTime: undefined,
})
const openManualMadal = (val:any) => {
  manualModal.value = true
  const { utr,amount,buyerOrderId } = val;
  manualForm.value = {
    amount,
    orderNo: buyerOrderId,
    utr,
    waterType: 3,
    orderReplenishmentSource: 2,
    delayConsumer: 0,
    delayFinish: 0,
    delayType: undefined,
    delayTime: undefined,
    disableBuy: 0,
    disableLimitType: undefined,
    disableLimitTime: undefined,
  };
}
const manualKycOrder = async () => {
  if (!manualForm.value.orderNo) {
    message.error(t('m562') + t('n41'));
    return;
  }
  if(manualForm.value.delayFinish && !manualForm.value.delayType){
    message.error(t("m563")+t("n1397"));
    return;
  }
  if(manualForm.value.disableBuy && !manualForm.value.disableLimitType){
    message.error(t("m563")+t("n1398"));
    return;
  }
  loading.value = true;
  const res:any = await matchingOrderAdminOrderReplenishmentByWater(manualForm.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    message.success(t('s10'));
    closeManualModal();
    getList();
  }else if(res && res.code == "9007"){
    message.error(t('n1474'));
    closeManualModal();
  }
}
const closeManualModal = () => {
  manualModal.value = false;
  manualForm.value = {
    amount: undefined,
    orderNo: undefined,
    utr: undefined,
    waterType: 3,
    orderReplenishmentSource: 2,
    delayConsumer: 0,
    delayFinish: 0,
    delayType: undefined,
    delayTime: undefined,
    disableBuy: 0,
    disableLimitType: undefined,
    disableLimitTime: undefined,
  }
}


// const getmerchant = async () => {
//   const res = await getMerchantInfoAdminList({ pageNo: 1, pageSize: 10000 });
//   if (res.code === "1") {
//     merchantList.value = res.data.map((item: any) => ({
//       value: item.username,
//       label: item.username,
//     }));
//   }
// };
// const searchDate = computed({
//   get: () => {
//     return [query.value.startTime, query.value.endTime];
//   },
//   set: (val) => {
//     query.value.startTime = val ? val[0] : "";
//     query.value.endTime = val ? val[1] : "";
//   },
// });
// const goAssemble = (id: any) => {
//   router.push({ path: "/member/changeReocde", query: { withdraw: id } });
// };
// const goPool = (id: any) => {
//   router.push({ path: "/order/matchingPool/index", query: { id } });
// };

// const exportList = async () => {
//   const data = JSON.parse(JSON.stringify(query.value));
//   paymentOrderAdminExport(data);
// };
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
  // if (route.query?.platformOrder) {
  //   query.value.platformOrder = route.query.platformOrder;
  // }
  // getmerchant();
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
      extendData.value = extend;
      resultData.value = res;
      pagination.value.total = res.total;
      pagination.value.current = query.value.pageNo;
      pagination.value.pageSize = query.value.pageSize;
    }
  }else{
    clearPageCash(route.fullPath);
    getList();
  }
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
