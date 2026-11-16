<template>
  <div class="search">
    <h2>{{ $t('m17') }}</h2>
    <a-row style="margin: 0 0 5px 0">
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.memberId"
          :placeholder="$t('p4')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.merchantName"
          :placeholder="$t('pleaseEnter') + '&nbsp' + $t('m677')"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.externalMemberCode"
          :placeholder="$t('pleaseEnter') + '&nbsp' + $t('n763')"
        />
      </a-col> -->
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.externalMemberId"
          :placeholder="$t('pleaseEnter') + '&nbsp' + $t('m207')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.memberAccount"
          :placeholder="$t('p5')"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.walletAddress"
          class="searchstyle"
          :placeholder="$t('p6')"
        />
      </a-col> -->
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.emailAccount"
          class="searchstyle"
          :placeholder="$t('m562')+$t('l63')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.realName"
          class="searchstyle"
          :placeholder="$t('p7')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          v-model:value="query.memberType"
          show-search
          :filter-option="filterOption"
          :options="Object.entries(memberTypeList).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
          :placeholder="$t('p52')"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          v-model:value="query.memberGroupId"
          :options="groupList"
          :placeholder="$t('p53')"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          v-model:value="query.status"
          :options="memberStatus"
          :placeholder="$t('m449')"
        >
        </a-select>
      </a-col>
      <!-- <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          v-model:value="query.onlineStatus"
          :options="onlineStatus"
          :placeholder="$t('m442')"
        >
        </a-select>
      </a-col> -->
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          v-model:value="query.buyStatus"
          :options="buyStatus"
          :placeholder="$t('m441')"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          v-model:value="query.sellStatus"
          :options="sellStatus"
          :placeholder="$t('m443')"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          v-model:value="query.level"
          :options="levelMapOption"
          :placeholder="$t('m563')+$t('m491')"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.remark"
          class="searchstyle"
          :placeholder="$t('m562')+$t('remark')"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-input-group compact>
          <a-input-number 
          v-model:value="query.minCreditScore" 
          :placeholder="$t('m562')+$t('m539')" 
          style="width: 50%"
          min="0"
          :max="query.maxCreditScore"
          @blur="minCreditScore"
          >
          </a-input-number>
          <a-input-number 
          v-model:value="query.maxCreditScore" 
          :placeholder="$t('m562')+$t('m539')" 
          style="width: 50%"
          :min="query.minCreditScore"
          @blur="maxCreditScore"
          >
          </a-input-number>
        </a-input-group>
      </a-col> -->
      <a-col>
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('m883')" :type="1"/>
      </a-col>
      <a-button
        type="primary"
        :icon="h(SearchOutlined)"
        :loading="loading"
        @click="getList(1)"
        >{{ $t("search") }}</a-button
      >
      <a-button type="primary" :loading="loading" @click="resetQuery">{{
        $t("reset")
      }}</a-button>
      <ExportButton
        :query="query"
        :api="memberInfoAdminExport"
        :enable-export-fields="true"
        permission="admin:memberInfoAdmin:export"
      />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:memberInfoAdmin:export'"
          >{{ $t("export") }}</a-button
        > -->
      <a-button  @click="openDrawer">{{ $t("m741") }}</a-button>
    </a-row>
    <a-row>
      <a-button
        type="primary"
        v-permission="'admin:memberInfoAdmin:createMemberInfo'"
        @click="add"
        >{{ $t("b16") }}</a-button
      >
      <a-button
        type="primary"
        :disabled="!state.ids.length"
        @click="disableMemeber"
        v-permission="'admin:memberInfoAdmin:disableBatch'"
        >{{ $t("b17") }}</a-button
      >

      <a-button
        type="primary"
        :disabled="!state.ids.length"
        @click="enableMemeber"
        v-permission="'admin:memberInfoAdmin:enableBatch'"
        >{{ $t("b18") }}</a-button
      >
      <a-button
        type="primary"
        :disabled="!state.ids.length"
        @click="batchOperationsSellBuy(0,1)"
        v-permission="'admin:memberInfoAdmin:disableBuyBatch'"
        >{{ $t("b19") }}</a-button
      >
      <a-button
        type="primary"
        :disabled="!state.ids.length"
        @click="batchOperationsSellBuy(1,1)"
        v-permission="'admin:memberInfoAdmin:enableBuyBatch'"
        >{{ $t("b20") }}</a-button
      >
      <a-button
        type="primary"
        :disabled="!state.ids.length"
        @click="batchOperationsSellBuy(0,2)"
        v-permission="'admin:memberInfoAdmin:disableSellBatch'"
        >{{ $t("b21") }}</a-button
      >
      <a-button
        type="primary"
        :disabled="!state.ids.length"
        @click="batchOperationsSellBuy(1,2)"
        v-permission="'admin:memberInfoAdmin:enableSellBatch'"
        >{{ $t("b22") }}</a-button
      >
      <!-- <a-popconfirm
        :title="$t('m631')"
        :open="popOpen"
        :ok-text="$t('b9')"
        :cancel-text="$t('b10')"
        :loading="loading"
        @confirm="returnBalance"
        @cancel="closeReturnPop"
      >
        <template #description>
          <div style="width: 300px;">
            {{ $t('m632',{num: state.ids.length,balance: returnAllBlance.toFixed(2)}) }}
          </div>
        </template>
        <a-button
          type="primary"
          :disabled="!state.ids.length"
          v-permission="'admin:memberInfoAdmin:cashBackBatch'"
          @click="getAllBalance"
          >{{ $t("m631") }}</a-button
        >
      </a-popconfirm> -->
    </a-row>
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
    size="middle"
    :dataSource="dataSource"
    :loading="loading"
    :columns="dynamicColumns"
    :key="tableKey"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    :pagination="pagination"
    :row-selection="{ selectedRowKeys: state.ids, onChange: onSelectChange }"
    rowKey="id"
    bordered
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'id'">
        <!-- :disabled="!hasPermission('admin:memberInfoAdmin:getInfo')" -->
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record)"
          >{{ record.id }}</a-button
        >
        <CopyOutlined v-if="record.id" class="copyId"  @click="$copyId(record.id)" />
      </template>
      <template v-if="column.key === 'bindMerchantInfoDTOS'">
        <a-tooltip :overlayStyle="{ width: 'auto', maxWidth: 'none' }" v-if="record.bindMerchantInfoDTOS.length > 0">
          <template #title>
            <div :style="record.bindMerchantInfoDTOS.length > 10 ? 'width: 440px;height: 200px;overflow-y: auto;' : ''">
              <a-tag style="padding: 2px;margin-bottom: 2px"  v-for="item in record.bindMerchantInfoDTOS" :key="item.merchantCode" color="green">{{ item.merchantCode + "-" + item.merchantMemberId }}</a-tag>
            </div>
          </template>
          <div class=toopTipStyle3>
            <a-tag v-if="record.bindMerchantInfoDTOS.length > 0"  style="margin-bottom: 2px" color="green">{{ record.bindMerchantInfoDTOS[0].merchantCode + "-" + record.bindMerchantInfoDTOS[0].merchantMemberId }}</a-tag>
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'countOfMerchant'">
        <a-button v-if="record.countOfMerchant != 0" type="link" @click="showMemNo(record.id)" >{{ record.countOfMerchant }}</a-button>
        <span v-else>{{ record.countOfMerchant }}</span>
      </template>
      <template v-if="column.key === 'arbBalance'">
        {{ currency(record.arbBalance,false) }}
      </template>
      <template v-if="column.key === 'balance'">
        {{ currency(record.balance,false) }}
      </template>
      <template v-if="column.key === 'usdtConvertArbAmount'">
        {{ currency(record.usdtConvertArbAmount,false) }}
      </template>
      <template v-if="column.key === 'memberType'">
        {{$t($getMapItem(memberTypeList, record.memberType)) }}
      </template>
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status === '0' ? 'red' : 'green'">
          {{ record.status === "0" ? $t("disabled") : $t("enabled") }}
        </a-tag>
        <!-- <span :class="record.status === '0' ? 'redText' : 'greenText'">{{
          record.status === "0" ? $t("disabled") : $t("enabled")
        }}</span> -->
      </template>
      <template v-if="column.key === 'onlineStatus'">
        <span class="arbListTag">
          <span class="pointTag" :style="record.onlineStatus == 0 ? 'background-color:#f5222d' : 'background-color:#52c41a'" ></span>
          {{ record.onlineStatus === "0" ? $t("offline") : $t("online") }}
        </span>
      </template>
      <template v-if="column.key === 'biFrozenAmount'">
        {{ currency(record.arbBiFrozenAmount,false) }}
      </template>
      <template v-if="column.key === 'biFrozenAmount'">
        {{ currency(record.biFrozenAmount,false) }}
      </template>
      <template v-if="column.key === 'frozenAmount'">
        {{ currency(record.arbFrozenAmount,false) }}
      </template>
      <template v-if="column.key === 'frozenAmount'">
        {{ currency(record.frozenAmount,false) }}
      </template>
      <template v-if="column.key === 'transactionRestrictionsAmount'">
        {{ currency(record.transactionRestrictionsAmount,false) }}
      </template>
      <template v-if="column.key === 'level'">
        {{ $getMapItem(levelMap, record.level) }}
      </template>
      <!-- <template v-if="column.key === 'arbBalance'">
        {{ currency(record.arbBalance,false) }}
      </template> -->
      <!-- <template v-if="column.key === 'balance'">
        {{ currency(record.balance,false) }}
      </template> -->
      <template v-if="column.key === 'owedAmount'">
        {{ currency(record.owedAmount,false) }}
      </template>
      <template v-if="column.key === 'merchantName'">
        <a-tooltip v-if="record.merchantName">
          <template #title>{{ record.merchantName }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.merchantName }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'memberAccount'">
        <a-tooltip v-if="record.memberAccount">
          <template #title>{{ record.memberAccount }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.memberAccount }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'emailAccount'">
        <a-tooltip v-if="record.emailAccount">
          <template #title>{{ record.emailAccount }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.emailAccount }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'realName'">
        <a-tooltip v-if="record.realName">
          <template #title>{{ record.realName }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.realName }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <!-- <template v-if="column.key === 'remark'">
        <a-tooltip v-if="record.remark">
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template> -->
      <template v-if="column.key === 'remark'">
        <a-tooltip :overlayStyle="{ width: 'auto', maxWidth: 'none' }" v-if="record.remark.length > 0">
          <template #title>
            <div :style="record.remark.length > 10 ? 'width: 440px;height: 200px;overflow-y: auto;' : ''">
              <a-tag style="padding: 2px;margin-bottom: 2px"  v-for="(item,index) in record.remark" :key="index" color="pink">{{ item }}</a-tag>
            </div>
          </template>
          <div class=toopTipStyle3>
            <a-tag v-if="record.remark.length > 0" style="margin-bottom: 2px" v-for="(item,index) in record.remark" :key="index" color="pink">{{ item}}</a-tag>
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'buyStatus'">
        <a-tooltip
          :title="getBuyStatusDisabledTip(record,1)"
        >
          <span>
            <a-switch
              :checked="record.buyStatus == 1 ? true : false"
              @click="switchBuy($event, record.id,1)"
              :disabled="!hasPermission('admin:memberInfoAdmin:buyStatusChange')"
            />
          </span>
        </a-tooltip>
        <!-- <a-switch
          v-if="record.buyStatus == 1"
          v-model:checked="record.buyStatus"
          checkedValue="1"
          unCheckedValue="0"
          @click="switchBuy($event, record.id)"
          :disabled="!hasPermission('admin:memberInfoAdmin:buyStatusChange')"
        /> -->
      </template>
      <template v-if="column.key === 'memberGroup'">
        {{
          groupList.find((item: any) => item.value === record.memberGroup)
            ?.label
        }}
      </template>
      <template v-if="column.key === 'sellStatus'">
        <a-tooltip
          :title="getBuyStatusDisabledTip(record,2)"
        >
          <span>
            <a-switch
              :checked="record.sellStatus == 1 ? true : false"
              @click="switchBuy($event, record.id,2)"
              :disabled="!hasPermission('admin:memberInfoAdmin:sellStatusChange')"
            />
          </span>
        </a-tooltip>
        <!-- <a-switch
          v-model:checked="record.sellStatus"
          checkedValue="1"
          unCheckedValue="0"
          @click="switchSale($event, record.id)"
          :disabled="!hasPermission('admin:memberInfoAdmin:sellStatusChange')"
        /> -->
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
  <a-modal v-model:open="addDialog" :title="$t('b16')" :footer="null">
    <a-form
      :model="addForm"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item :label="$t('c10')" name="memberAccount">
        <a-input v-trim
          v-model:value="addForm.memberAccount"
          :placeholder="$t('m562')+$t('l35')"
        />
      </a-form-item>
      <a-form-item :label="$t('p2')" name="password">
        <a-input v-trim
          v-model:value="addForm.password"
          class="w100"
          :placeholder="$t('p56')"
        />
      </a-form-item>
      <a-form-item :label="$t('memberListC10')" name="memberType">
        <a-select
          class="searchstyle"
          v-model:value="addForm.memberType"
          :options="Object.entries(memberTypeListAdd).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
          :placeholder="$t('p52')"
        >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('remark')" name="remark">
        <a-input v-trim
          v-model:value="addForm.remark"
          class="w100"
          :placeholder="$t('p57')"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" :loading="loading" @click="addBtn">{{
          $t("publicSubmit")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closedalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
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
  <!-- 会员绑定的商户列表 -->
  <a-modal
    v-model:open="memMerNoModel"
    :footer="null"
    width="60%"
    @cancel="closeMemMerNo"
  >
    <memMerNo
      v-if="memMerNoModel"
      :memberId="activeMemberId"
    />
  </a-modal>
  <!-- 启用、禁用 -->

</template>

<script lang="ts" setup>
import { ref, reactive, h, computed, watchEffect, shallowRef } from "vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  memberListApi,
  disableMemberInBatches,
  enableMemberInBatches,
  disableBuyBatches,
  enableBuyBatches,
  disableSaleBatches,
  enableSaleBatches,
  groupListApi,
  createMemberInfo,
  memberInfoAdminBuyStatusChange,
  memberInfoAdminSellStatusChange,
  cashBackBatch
} from "@/api/menber";
import { memberInfoAdminExport } from "@/api/export";
import { message,Modal, Form, Select, Input, Div } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import memberDetail from "@/components/Member/memberDetail.vue";
import memMerNo from "@/components/Member/memMerNo.vue";
import { currency, filterOption, thousand, formatMinutesI18n } from "@/utils";
import { usePermission } from "@/hooks";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { memberTypeList } from "@/utils/publicData";
import{levelMap } from '@/utils/publicData';
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { useTableColumnDrawer } from "@/hooks/index";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import Bus from "@/utils/bus";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { usePageCash } from "@/hooks/usePageCash.hook"; 
const route = useRoute();
const { pageCash,setPageCash,getPageCash,clearPageCash } = usePageCash();
const resultData = ref({});
const isUseCash = ref(false);
onBeforeRouteLeave(() => {
  setPageCash(route.fullPath.split('?')[0], query.value, resultData.value, extendData.value);
})
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { hasPermission } = usePermission();
const { t } = useI18n();
// const { pagination } = usePagination();
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
// const route = useRoute();
// const loading = ref(false);
const detailModel = ref(false);
const detailId = ref<any>({});
// const extendData = ref({
//   // arbBalancePageTotal: 0,
//   balancePageTotal: 0,
//   owedAmountPageTotal: 0,
//   totalBuyAmountPageTotal: 0,
//   totalSellAmountPageTotal: 0,
//   // arbBiFrozenAmountPageTotal: 0,
//   biFrozenAmountPageTotal: 0,
//   // arbFrozenAmountPageTotal: 0,
//   frozenAmountPageTotal: 0,
//   rechargeAmountPageTotal: 0,
//   withdrawAmountPageTotal: 0,
  
//   // arbBalanceTotal: 0,
//   balanceTotal: 0,
//   owedAmountTotal: 0,
//   totalBuyAmountTotal: 0,
//   totalSellAmountTotal: 0,
//   // arbBiFrozenAmountTotal: 0,
//   biFrozenAmountTotal: 0,
//   // arbFrozenAmountTotal: 0,
//   frozenAmountTotal: 0,
//   rechargeAmountTotal: 0,
//   withdrawAmountTotal: 0,
// });
const popOpen = ref(false);

const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      arbBalance: extendData.value.arbBalancePageTotal,
      balance: extendData.value.cpbBalancePageTotal,
      usdtConvertArbAmount: extendData.value.usdtConvertArbAmountPageTotal,
      totalBalance: extendData.value.balancePageTotal,
      // balance: extendData.value.balancePageTotal,
      owedAmount: extendData.value.owedAmountPageTotal,
      totalBuyAmount: extendData.value.totalBuyAmountPageTotal,
      totalSellAmount: extendData.value.totalSellAmountPageTotal,
      // arbBiFrozenAmount: extendData.value.arbBiFrozenAmountPageTotal,
      totalBiFrozenAmount: extendData.value.biFrozenAmountPageTotal,
      // arbFrozenAmount: extendData.value.arbFrozenAmountPageTotal,
      totalFrozenAmount: extendData.value.frozenAmountPageTotal,
      rechargeTotalAmount: extendData.value.rechargeAmountPageTotal,
      withdrawNum: extendData.value.withdrawAmountPageTotal,
    },
  },
  {
    label: t("m55"),
    fields: {
      arbBalance: extendData.value.arbBalanceTotal,
      balance: extendData.value.cpbBalanceTotal,
      usdtConvertArbAmount: extendData.value.usdtConvertArbAmountTotal,
      totalBalance: extendData.value.balanceTotal,
      // balance: extendData.value.balanceTotal,
      owedAmount: extendData.value.owedAmountTotal,
      totalBuyAmount: extendData.value.totalBuyAmountTotal,
      totalSellAmount: extendData.value.totalSellAmountTotal,
      // arbBiFrozenAmount: extendData.value.arbBiFrozenAmountTotal,
      totalBiFrozenAmount: extendData.value.biFrozenAmountTotal,
      // arbFrozenAmount: extendData.value.arbFrozenAmountTotal,
      totalFrozenAmount: extendData.value.frozenAmountTotal ,
      rechargeTotalAmount: extendData.value.rechargeAmountTotal,
      withdrawNum: extendData.value.withdrawAmountTotal,
    },
  },
]);
const query = ref({
  asc: false,
  column: "",
  id: 0,
  memberAccount: "",
  memberId: "",
  memberType: undefined,
  memberGroupId: undefined,
  pageNo: 1,
  pageSize: 20,
  realName: "",
  emailAccount: undefined,
  totalBuyAmountEnd: "",
  totalBuyAmountStart: "",
  totalSellAmountEnd: "",
  totalSellAmountStart: "",
  walletAddress: "",
  merchantName: "",
  externalMemberId: "",
  status: undefined,
  onlineStatus: undefined,
  buyStatus: undefined,
  sellStatus: undefined,
  level: undefined,
  // minCreditScore:0,
  // maxCreditScore:240,
  externalMemberCode: "",
  remark: "",
  // createTimeStart: startIndiaTime,
  // createTimeEnd: endIndiaTime,
  createTimeStart: '',
  createTimeEnd: '',
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const groupList = ref<{ value: number; label: string }[]>([]);
const memberTypeListAdd = {
  3: t("n96") ,
  4: t("m842"),
};
const memberStatus = [
  { value: 0, label: t("disabled") },
  { value: 1, label: t("enabled") },
]
const levelMapOption = [
  { value: 0, label: 'L0' },
  { value: 1, label: 'L1' },
  { value: 2, label: 'L2' },
  { value: 3, label: 'L3' },
  { value: 4, label: 'L4' },
  { value: 5, label: 'L5' },
  { value: 6, label: 'L6' },
  { value: 7, label: 'L7' },
  { value: 8, label: 'L8' },
  { value: 9, label: 'L9' },
  { value: 10, label: 'L10' },
]
const onlineStatus = [
  { value: 0, label: t("offline") },
  { value: 1, label: t("online") },
]
const buyStatus = [
  { value: 0, label: t("disabled") },
  { value: 1, label: t("enabled") },
]
const sellStatus = [
  { value: 0, label: t("disabled") },
  { value: 1, label: t("enabled") },
]
const state = reactive<{
  ids: number[]; 
  loading: boolean;
}>({
  ids: [],
  loading: false,
});
const onSelectChange = (value: any) => {
  state.ids = value;
};
const addDialog = ref(false);
// const dataSource = ref([]);
const columns: any = [
  {
    title: t("c9"),
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 180,
    fixed: 'left',
    isRequired: true,
    filteredValue: [],
  },
  {
    title: t("m677"),
    dataIndex: "merchantName",
    key: "merchantName",
    align: "center",
    width: 140,
    fixed: 'left',
    isRequired: true,
    filteredValue: [],
  },
  {
    title: t("n95"),
    dataIndex: "bindMerchantInfoDTOS",
    key: "bindMerchantInfoDTOS",
    align: "center",
    width: 240,
    fixed: 'left',
    isRequired: true,
    filteredValue: [],
  },
  // {
  //   title: t("m207"),
  //   dataIndex: "externalMemberId",
  //   key: "externalMemberId",
  //   align: "center",
  //   width: 150,
  // },
  {
    title: t("c10"),
    dataIndex: "memberAccount",
    key: "memberAccount",
    align: "center",
    width: 180,
    filteredValue: [],
  },
  // {
  //   title: t("m630"),
  //   dataIndex: "invitationCode",
  //   key: "invitationCode",
  //   align: "center",
  //   width: 120,
  // },
  {
    title: t("m678"),
    dataIndex: "countOfMerchant",
    key: "countOfMerchant",
    align: "center",
    width: 120,
    filteredValue: [],
  },
  {
    title: t("n1583")+'(ARB)',
    dataIndex: "arbBalance",
    key: "arbBalance",
    align: "center",
    width: 180,
    filteredValue: [],
  },
  {
    title: t("n1583")+'(CPB)',
    dataIndex: "balance",
    key: "balance",
    align: "center",
    width: 180,
    filteredValue: [],
  },
  {
    title: t("n1583")+'(USDT-ARB)',
    dataIndex: "usdtConvertArbAmount",
    key: "usdtConvertArbAmount",
    align: "center",
    width: 180,
    filteredValue: [],
  },
  {
    title: t("m491"),
    dataIndex: "level",
    key: "level",
    align: "center",
    width: 180,
    sorter: true,
    filteredValue: [],
  },
  // {
  //   title: t("m539"),
  //   dataIndex: "creditScore",
  //   key: "creditScore",
  //   align: "center",
  //   width: 180,
  //   sorter: true,
  //   filteredValue: [],
  // },
  {
    title: t("l35"),
    dataIndex: "mobileNumber",
    key: "mobileNumber",
    align: "center",
    width: 140,
    filteredValue: [],
  },
  {
    title: t("l63"),
    dataIndex: "emailAccount",
    key: "emailAccount",
    align: "center",
    width: 140,
    filteredValue: [],
  },
  {
    title: t("memberListC4"),
    dataIndex: "memberGroup",
    key: "memberGroup",
    align: "center",
    width: 140,
    filteredValue: [],
  },
  {
    title: t("m636"),
    dataIndex: "cashBackFrozenAmount",
    key: "cashBackFrozenAmount",
    align: "center",
    width: 140,
    filteredValue: [],
  },
  {
    title: t("memberListC5"),
    dataIndex: "totalBalance",
    key: "totalBalance",
    align: "center",
    width: 140,
    sorter: true,
    filteredValue: [],
  },
  // {
  //   title: 'CPB'+t("memberListC5"),
  //   dataIndex: "balance",
  //   key: "balance",
  //   align: "center",
  //   width: 140,
  //   sorter: true,
  //   filteredValue: [],
  // },
  {
    title: t("n183"),
    dataIndex: "owedAmount",
    key: "owedAmount",
    align: "center",
    width: 140,
    sorter: true,
    filteredValue: [],
  },
  {
    title: t("memberListC6"),
    dataIndex: "totalBuyCount",
    key: "totalBuyCount",
    align: "center",
    width: 100,
    sorter: true,
    filteredValue: [],
  },
  {
    title: t("c3"),
    dataIndex: "totalBuyAmount",
    key: "totalBuyAmount",
    align: "center",
    width: 140,
    sorter: true,
    filteredValue: [],
  },
  {
    title: t("memberListC8"),
    dataIndex: "totalSellCount",
    key: "totalSellCount",
    align: "center",
    width: 100,
    sorter: true,
    filteredValue: [],
  },
  {
    title: t("memberListC9"),
    dataIndex: "totalSellAmount",
    key: "totalSellAmount",
    align: "center",
    width: 140,
    sorter: true,
    filteredValue: [],
  },
  {
    title: t("n618"),
    dataIndex: "netBuySellAmount",
    key: "netBuySellAmount",
    align: "center",
    width: 140,
    filteredValue: [],
  },
  {
    title: t("m81"),
    dataIndex: "totalBiFrozenAmount",
    key: "totalBiFrozenAmount",
    align: "center",
    width: 140,
    sorter: true,
    filteredValue: [],
  },
  // {
  //   title: 'CPB'+t("m81"),
  //   dataIndex: "biFrozenAmount",
  //   key: "biFrozenAmount",
  //   align: "center",
  //   width: 140,
  //   sorter: true,
  //   filteredValue: [],
  // },
  {
    title: t("m256"),
    dataIndex: "totalFrozenAmount",
    key: "totalFrozenAmount",
    align: "center",
    width: 170,
    sorter: true,
    filteredValue: [],
  },
  // {
  //   title: 'CPB'+t("m256"),
  //   dataIndex: "frozenAmount",
  //   key: "frozenAmount",
  //   align: "center",
  //   width: 170,
  //   sorter: true,
  //   filteredValue: [],
  // },
  // {
  //   title: t("n452"),
  //   dataIndex: "transactionRestrictionsAmount",
  //   key: "transactionRestrictionsAmount",
  //   align: "center",
  //   width: 170,
  //   // sorter: (a: any, b: any) => a.transactionRestrictionsAmount - b.transactionRestrictionsAmount,
  // },
  {
    title: t("memberListC10"),
    dataIndex: "memberType",
    key: "memberType",
    align: "center",
    width: 160,
    filteredValue: [],
  },
  {
    title: t("memberListC11"),
    dataIndex: "realName",
    key: "realName",
    align: "center",
    width: 160,
    filteredValue: [],
  },
  {
    title: t("m444"),
    dataIndex: "rechargeNum",
    key: "rechargeNum",
    align: "center",
    width: 160,
    sorter: true,
    filteredValue: [],
  },
  {
    title: t("m445"),
    dataIndex: "rechargeTotalAmount",
    key: "rechargeTotalAmount",
    align: "center",
    width: 160,
    sorter: true,
    filteredValue: [],
  },
  {
    title: t("m446"),
    dataIndex: "withdrawNum",
    key: "withdrawNum",
    align: "center",
    width: 160,
    sorter: true,
    filteredValue: [],
  },
  {
    title: t("m447"),
    dataIndex: "withdrawTotalAmount",
    key: "withdrawTotalAmount",
    align: "center",
    width: 160,
    sorter: true,
    filteredValue: [],
  },
  {
    title: t("m448"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 160,
    filteredValue: [],
  },
  {
    title: t("memberListC14"),
    dataIndex: "onlineStatus",
    key: "onlineStatus",
    align: "center",
    width: 160,
    filteredValue: [],
  },
  {
    title: t("m883"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 180,
    filteredValue: [],
  },
  {
    title: t("remark"),
    dataIndex: "remark",
    key: "remark",
    align: "center",
    width: 200,
    filteredValue: [],
  },
  {
    title: t("memberListC15"),
    dataIndex: "buyStatus",
    key: "buyStatus",
    align: "center",
    width: 100,
    fixed: 'right',
    isRequired: true,
    filteredValue: [],
  },
  {
    title: t("memberListC16"),
    dataIndex: "sellStatus",
    key: "sellStatus",
    align: "center",
    width: 100,
    fixed: 'right',
    isRequired: true,
    filteredValue: [],
  },
];
const {
  menuId,
  defaultColumns,
  selectedColumns,
  dynamicColumns,
  drawerVisible,
  openDrawer,
  tableKey,
} = useTableColumnDrawer(columns);
const addForm = ref({
  memberAccount: undefined,
  password: undefined,
  memberType: '3',
  remark: undefined,
});
const {
  dataSource,
  extendData,
  response,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: memberListApi,
  defaultPageSize: 20,
  filterRules: [
    // { key: "beforeChange" },
    // { key: "amountChange" },  
    // { key: "afterChange" },
  ],
  afterFetch: (data) =>
  data.map((item: any) => {
    item.totalBuyAmount = currency(item.totalBuyAmount, false);
    item.totalSellAmount = currency(item.totalSellAmount, false);
    item.netBuySellAmount = currency(item.netBuySellAmount, false);
    item.rechargeTotalAmount = currency(item.rechargeTotalAmount, false);
    item.withdrawTotalAmount = currency(item.withdrawTotalAmount, false);
    item.cashBackFrozenAmount = currency(item.cashBackFrozenAmount, false);
    item.remark = item.remark?item.remark.split('|'):'';
    return item;
  }),
});
watchEffect(() => {
  if(!isUseCash.value) resultData.value = response.value;
})


const disableReasonOptions:any = {
  0: t('n1153'),//永久封禁
  1: t('n1154'),//当天24:00后解禁
  2: t('n1155'),//24小时后解禁
  3: t('n1156'),//七天后解禁
};

const switchForm: any = ref({
  disableType: null,
  remark: '',
});
const form = Form.useForm({
  modelRef: switchForm, // ⚠ 注意这里传 ref
});
const disableMemeber = async () => {
  const res:any = await disableMemberInBatches({ ids: state.ids });
  if (res && res.code === "1") {
    message.success(t("s10"));
    // state.ids= []
    getList();
  }
};
const enableMemeber = async () => {
  const res:any = await enableMemberInBatches({ ids: state.ids });
  if (res && res.code === "1") {
    message.success(t("s10"));
    // state.ids= []
    getList();
  }
};
const disableBuyBatch = async () => {
  const res:any = await disableBuyBatches({ ids: state.ids });
  if (res && res.code === "1") {
    message.success(t("s10"));
    // state.ids= []
    getList();
  }
};
const enableBuyBatch = async () => {
  const res:any = await enableBuyBatches({ ids: state.ids });
  if (res && res.code === "1") {
    message.success(t("s10"));
    // state.ids= []
    getList();
  }
};
const returnAllBlance = ref(0)
const getAllBalance = () => {
  returnAllBlance.value = 0;
  popOpen.value = true;
  dataSource.value.map((item:any)=>{
    if(state.ids.includes(item.id)){
      returnAllBlance.value += Number(item.balance);
    }
  })
}
const closeReturnPop = () =>{
  popOpen.value = false;
  // state.ids= []
}
const returnBalance = async () => {
  loading.value = true;
  popOpen.value = false;
  const res:any = await cashBackBatch({ ids: state.ids }).finally(()=>{loading.value = false;});
  if(res && res.code == "1"){
    message.success(t("m647"));
    getList();
  }
}
const disableSaleBatch = async () => {
  const res:any = await disableSaleBatches({ ids: state.ids });
  if (res && res.code === "1") {
    message.success(t("s10"));
    // state.ids= []
    getList();
  }
};
const enableSaleBatch = async () => {
  const res:any = await enableSaleBatches({ ids: state.ids });
  if (res && res.code === "1") {
    message.success(t("s10"));
    // state.ids= []
    getList();
  }
};
//批量启用禁用买入、卖出状态
const batchOperationsSellBuy = async (s: any,type: number) => {
  Modal.confirm({
    title:  type == 1 ? s ? t("n1413") : t("n1414") : s ? t("n1415") : t("n1416"), 
    content: !s ? h(Form, {
      form,                 // ⚠ 直接使用 form 对象
      model: switchForm.value, // ⚠ model 必须是 .value
      layout: 'horizontal',
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    {
      default: () => [
        h(Form.Item, { label: t('n1417'), name: 'disableType',rules: [{ required: true }] }, {
          default: () => h(Select, { 
            value: switchForm.value.reasonType,
            'onUpdate:value': (val: number) => {
              switchForm.value.disableType = val
            },
            placeholder: t('m562')+t('n1417'), 
            options: Object.entries(disableReasonOptions).map(([key, value]:[any,any]) => ({ value: Number(key), label: value })),
            filterOption
          })
        }),
        h(Form.Item, { label: t('remark'), name: 'remark' }, {
          default: () => h(Input.TextArea, {
            value: switchForm.value.remark,
            'onUpdate:value': (val: string) => {
              switchForm.value.remark = val
            },
            rows: 3, showCount: true, maxlength: 200
           })
        })
      ]
    }):h('div', null, t('n1437')),
    okButtonProps: { loading: loading.value },
    onOk: async () => {
      if(s==0 && switchForm.value.disableType == null){
        message.error(t('m563')+t('n1417'));
        return Promise.reject();
      }
      let res:any;
      loading.value = true;
      if(s==0 && type==1){
        res = await  disableBuyBatches({
          ids: state.ids,
          disableType: switchForm.value.disableType,
          remark: switchForm.value.remark,
        }).finally(()=>loading.value = false);
      }else if(s==1 && type==1){
        res = await  enableBuyBatches({
          ids: state.ids,
          disableType: switchForm.value.disableType,
          remark: switchForm.value.remark,
        }).finally(()=>loading.value = false);
      }else if(s==0 && type==2){
        res = await  disableSaleBatches({
          ids: state.ids,
          disableType: switchForm.value.disableType,
          remark: switchForm.value.remark,
        }).finally(()=>loading.value = false);
      }else if(s==1 && type==2){
        res = await  enableSaleBatches({
          ids: state.ids,
          disableType: switchForm.value.disableType,
          remark: switchForm.value.remark,
        }).finally(()=>loading.value = false);
      }
      if (res && res.code === "1") {
        message.success(t("s10"));
        getList();
      }
    },
    onCancel() {
      form.resetFields()
      switchForm.value.disableType = null
      switchForm.value.remark = ''
    },
  });
}
// 启用禁用买入、卖出状态
const switchBuy = async (e: any,id: any,type: number) => {
  const s = e ? 1 : 0;
  Modal.confirm({
    title:  type == 1 ? e ? t("n1413") : t("n1414") : e ? t("n1415") : t("n1416"), 
    content: !s ? h(Form, {
      form,                 // ⚠ 直接使用 form 对象
      model: switchForm.value, // ⚠ model 必须是 .value
      layout: 'horizontal',
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    {
      default: () => [
        h(Form.Item, { label: t('n1417'), name: 'disableType',rules: [{ required: true }] }, {
          default: () => h(Select, { 
            value: switchForm.value.reasonType,
            'onUpdate:value': (val: number) => {
              switchForm.value.disableType = val
            },
            placeholder: t('m562')+t('n1417'), 
            options: Object.entries(disableReasonOptions).map(([key, value]:[any,any]) => ({ value: Number(key), label: value })), filterOption  })
        }),
        h(Form.Item, { label: t('remark'), name: 'remark' }, {
          default: () => h(Input.TextArea, {
            value: switchForm.value.remark,
            'onUpdate:value': (val: string) => {
              switchForm.value.remark = val
            },
            rows: 3, showCount: true, maxlength: 200
           })
        })
      ]
    }):h('div', null, t('n1437')),
    okButtonProps: { loading: loading.value },
    onOk: async () => {
      if(s==0 && switchForm.value.disableType == null){
        message.error(t('m563')+t('n1417'));
        return Promise.reject();
      }
      let res:any;
      loading.value = true;
      if(type==1){
        res = await  memberInfoAdminBuyStatusChange({
          buyStatus:s,
          id,
          disableType: switchForm.value.disableType,
          remark: switchForm.value.remark,
        }).finally(()=>loading.value = false);
      }else{
        res = await  memberInfoAdminSellStatusChange({
          sellStatus:s,
          id,
          disableType: switchForm.value.disableType,
          remark: switchForm.value.remark,
        }).finally(()=>loading.value = false);
      }
      if (res && res.code === "1") {
        message.success(t("s10"));
        getList();
      }
    },
    onCancel() {
      form.resetFields()
      switchForm.value.disableType = null
      switchForm.value.remark = ''
    },
  });
}
// const switchBuy = async (e: any, id: any) => {
//   const res:any = await memberInfoAdminBuyStatusChange({
//     buyStatus:e,
//     id
//   })
//   if (res && res.code === "1") {
//     message.success(t("s10"));
//   }
//   getList();
// };
const switchSale = async (e: any, id: any) => {
  const res:any = await memberInfoAdminSellStatusChange({
    sellStatus:e,
    id
  })
  if (res && res.code === "1") {
    message.success(t("s10"));
  }
  getList();
};
const getBuyStatusDisabledTip = (record: any,type: number) => {

  if (type == 1 && record.buyStatus == 0) {
    return record.buyDisableTime == -1 ? disableReasonOptions[0]:  t('n1418',{
      d:formatMinutesI18n(record.buyDisableTime,t)
    });
  }else if (type == 2 && record.sellStatus == 0) {
    return record.sellDisableTime == -1 ? disableReasonOptions[0]: t('n1418',{
      d:formatMinutesI18n(record.sellDisableTime,t)
    });
  }
}

const add = () => {
  addForm.value = {
    memberAccount: undefined,
    password: undefined,
    memberType: '3',
    remark: undefined,
  };
  addDialog.value = true;
};
const addBtn = async () => {
  loading.value = true;
  let res:any = await createMemberInfo(addForm.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    message.success(t("s10"));
    closedalog();
    getList();
  }
};
const closedalog = () => {
  addForm.value = {
    memberAccount: undefined,
    password: undefined,
    memberType: '3',
    remark: undefined,
  };
  addDialog.value = false;
};
const getGroupList = async () => {
  const res:any = await groupListApi({
    pageNo: 1,
    pageSize: 10000,
  });
  if (res && res.code === "1") {
    groupList.value =
      res.data.map((item: any) => ({ value: item.id, label: item.name })) || [];
  }
};
const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value = { id, memberId };
  detailModel.value = true;
};
// 会员绑定的商户列表
const memMerNoModel = ref(false);
const activeMemberId = ref(0);
const showMemNo = (memberId: any) => {
  activeMemberId.value = memberId;
  memMerNoModel.value = true;
};
const closeMemMerNo = () => {
  memMerNoModel.value = false;
};
Bus.on('refreshMember',(data:any)=>{
  if(data){
    getList();
  }
})
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
      extendData.value = extend;
      resultData.value = res;
      pagination.value.total = res.total || 0;
      pagination.value.current = query.value.pageNo;
      pagination.value.pageSize = query.value.pageSize;
    }
  }else{
    clearPageCash(route.fullPath);
    if (route.query.memberId) {
      query.value.memberId = route.query.memberId as string;
    }
    getList();
  }
  getGroupList();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>

<style lang="less" scoped></style>
