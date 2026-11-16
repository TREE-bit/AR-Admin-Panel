<template>
  <div class="search">
    <countDown :title="$t('m7')" @zero="getList()" />
    <a-row style="margin: 0 0 5px 0">
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.platformOrder"
          :placeholder="$t('n41')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('n295')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.utr"
          class="searchstyle"
          :placeholder="'UTR'"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.randomCode"
          class="searchstyle"
          :placeholder="$t('n321')"
        />
      </a-col> -->
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.tId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m635')"
        />
      </a-col> -->
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.orderStatus"
          :placeholder="$t('p27')"
          :allowClear="true"
          :options="
            Object.entries(orderStatusMap).map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.buyOrderType"
          :placeholder="$t('n581')"
          :allowClear="true"
          :options="
            Object.entries(buyOrderTypeMap)
            .filter(([key, _]) => key != '0')
            .map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n1530')"
        v-model:value="query.autoSellFlag"
        :options="autoSellFlagOptions"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n1531')"
        v-model:value="query.repackageAppBuyFlag"
        >
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
          <a-select-option value="1">{{ $t("n1563") }}</a-select-option>
          <a-select-option value="2">{{ $t("n1531") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
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
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n150')"
        v-model:value="query.thirdRechargeFlag"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.completedByKyc"
          :placeholder="$t('m824')"
          :allowClear="true"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          show-search
          option-filter-prop="label"
          v-model:value="query.merchantCode"
          :options="merchantList"
          :placeholder="$t('p26')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('m563')+$t('n208')"
        v-model:value="query.replenishmentFlag"
        >
          <a-select-option :value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option :value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col> -->
      <a-col :span="3" v-show="isShowMoreSearch">
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
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.merchantMemberId"
          class="searchstyle"
          :placeholder="$t('m562')+ $t('m207')"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.merchantOrder"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m668')"
        />
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
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.isKycSellOrder"
          :placeholder="$t('m607')"
          :allowClear="true"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.releaseFlag"
          :placeholder="$t('m563')+$t('m745')"
          :allowClear="true"
          :options="
            Object.entries(releseMap).map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
        >
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('m563')+$t('m656')"
        v-model:value="query.payType"
        :options="Object.entries(payTypeData).map(([key, value]:[any,any]) => ({ value: key, label: $t(value), }))"
        >
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-input-number
          class="searchstyle"
          :precision="0"
          v-model:value="query.completeDurationStart"
          :placeholder="$t('p34')"
        />
      </a-col> -->
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-input-number
          class="searchstyle"
          :precision="0"
          v-model:value="query.completeDurationEnd"
          :placeholder="$t('p35')"
        />
      </a-col> -->
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.cancelReasonId"
          :placeholder="$t('m563') + $t('l44')"
        >
          <a-select-option
            v-for="(item, key) in cancellationReasonList"
            :value="item.id"
            :key="key"
            >{{ item.reason }}</a-select-option
          >
        <a-select-option
          :value="-1"
          :key="-1"
          >{{ $t('l80') }}</a-select-option>
        </a-select>
      </a-col> -->
      <!-- <a-col :span="6">
        <a-range-picker
          show-time
          v-model:value="paymentTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m172')]"
        />
      </a-col>
      <a-col :span="6">
        <a-range-picker
          show-time
          v-model:value="completionTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m171')]"
        />
      </a-col> -->
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.supportAmountFinishFlag"
          :placeholder="$t('n1318')"
          :allowClear="true"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n1164')"
        v-model:value="query.wakeUpFlag"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('l50')" :type="1"/>
      </a-col>
      <a-col v-show="isShowMoreSearch">
        <timeRange v-model:startTime="query.completionTimeStart" v-model:endTime="query.completionTimeEnd" :title="$t('m734')" :type="1"/>
      </a-col>
      <ArrowDownOutlined v-show="!isShowMoreSearch" @click="showMoreSearch" />
      <ArrowUpOutlined v-show="isShowMoreSearch" @click="showMoreSearch" />
    </a-row>
    <a-row style="margin-top: 5px;">
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
        <ExportButton
          :query="query"
          :api="collectionOrderAdminExport"
          :enable-export-fields="true"
          permission="admin:collectionOrderAdmin:export"
        />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:collectionOrderAdmin:export'"
          >{{ $t("export") }}</a-button
        > -->
        <a-button @click="openDrawer">{{ $t("m741") }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="dynamicColumns"
    :key="tableKey"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :scroll="{ x: '100%',y: getTabH+'px' }"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        <a-button type="link" class="copyContent" @click="showMember(record.memberId)">{{
          record.memberId
        }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'platformOrder'">
        <div class="tableText">
          {{ $t('n104') }}:
          <a-button :class="record.riskTag != '0' ? 'windActive':''" type="link" class="copyContent" @click="goAssemble(record.platformOrder)">{{
            record.platformOrder
          }}</a-button>
          <CopyOutlined v-if="record.platformOrder" class="copyId"  @click="$copyId(record.platformOrder)" />
          <span v-else>-</span>
        </div>
        <div class="tableText">
          {{ $t('n324') }}:
          {{ record.merchantOrder || '-' }}
          <CopyOutlined v-if="record.merchantOrder" class="copyId"  @click="$copyId(record.merchantOrder)" />
          </div>
      </template>
      <template v-if="column.key === 'orderStatus'">
        <div class="toopTipStyle2">{{ $t(orderStatusMap[Number(record.orderStatus)]) }}</div>
      </template>
      <template v-if="column.key ==='payType'">
        {{ record.payType ? $t(payTypeData[record.payType]) : '-' }}
      </template>
      <template v-if="column.key === 'merchantName'">
        <a-tooltip v-if="record.merchantName">
          <template #title>{{ record.merchantName }}</template>
          <div class="toopTipStyle">
            {{ record.merchantName }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <!-- <template v-if="column.key === 'randomCode'">
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
      </template> -->
      <!-- <template v-if="column.key === 'tId'">
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
      </template> -->
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
      <!-- <template v-if="column.key === 'merchantOrder'">
        {{ record.merchantOrder || "-" }}
      </template> -->
      <template v-if="column.key === 'quadOrder'">
        <a-tooltip v-if="record.quadOrder">
          <template #title>{{ record.quadOrder }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.quadOrder }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'cancellationReason'">
        <a-tooltip v-if="record.cancellationReason">
          <template #title>{{ record.cancellationReason }}</template>
          <div class="toopTipStyle2">{{ record.cancellationReason }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'wakeUpFlag'">
        <span :class="record.wakeUpFlag == 1 ? 'tag-green' : record.wakeUpFlag == 0 ? 'tag-red' : ''">
          {{ record.wakeUpFlag == 1 ? $t('yes') : record.wakeUpFlag == 0 ? $t('no') : '-' }}
        </span>
      </template>
      <template v-if="column.key === 'supportAmountFinishFlag'">
        <span :class="record.supportAmountFinishFlag == 1 ? 'tag-green' : record.supportAmountFinishFlag == 0 ? 'tag-red' : ''">
          {{ record.supportAmountFinishFlag == 1 ? $t('yes') : record.supportAmountFinishFlag == 0 ? $t('no') : '-' }}
        </span>
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
      <template v-if="column.key === 'upiId'">{{ record.upiId || "-" }}</template>
      <template v-if="column.key === 'kycId'">{{ record.kycId || "-" }}</template>
      <!-- <template v-if="column.key === 'isQuadOrder'">
        <span :style="{ color: record.isQuadOrder == 1 ? 'green' : '' }">{{ record.isQuadOrder == 1 ? $t("yes") : $t("no") }}</span>
      </template> -->
      <template v-if="column.key === 'buyOrderType'">
        <span>{{ $t($getMapItem(buyOrderTypeMap,record.buyOrderType)) || '-' }}</span>
      </template>
      <template v-if="column.key === 'autoSellFlag'">
        <span :class="isAutoSellFlag(record.autoSellFlag) ? 'tag-green' : 'tag-gray'">{{ getAutoSellFlagLabel(record.autoSellFlag) }}</span>
      </template>
      <template v-if="column.key === 'repackageAppBuyFlag'">
          {{ record.repackageAppBuyFlag == 1 ? $t('n1563') :  record.repackageAppBuyFlag == 2 ? $t('n1531') : $t('no') }}
      </template>
      <template v-if="column.key === 'sourceType'">
        <span v-if="record.sourceType">{{ $t($getMapItem(orderSourceMap,record.sourceType)) }}</span>
        <span v-else>{{ $t('n623') }}</span>
      </template>
      <template v-if="column.key === 'autoFinishFlag'">
        <span :style="{ color: record.autoFinishFlag == 1 ? 'green' : '' }">{{ record.autoFinishFlag == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <template v-if="column.key === 'completedByKyc'">
        <span :style="{ color: record.completedByKyc == 1 ? 'green' : '' }">{{ record.completedByKyc == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <template v-if="column.key === 'isKycSellOrder'">
        <span :style="{ color: record.isKycSellOrder == 1 ? 'green' : '' }">{{ record.isKycSellOrder == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <template v-if="column.key === 'releaseFlag'">{{ $t(releseMap[record.releaseFlag]) }}</template>
      <template v-if="column.key === 'riskTag'">
        <span v-if="record.riskTag == '1,2'" >
          <a-tag :color="'error'">{{ $t(windControl[1]) }}</a-tag>
          <a-tag :color="'error'">{{ $t(windControl[2]) }}</a-tag>
        </span>
        <span v-if="record.riskTag != '1,2'">
            <a-tag v-if="record.riskTag != '0'" :color="record.riskTag == '0' ? '' : 'error' ">{{ $t(windControl[Number(record.riskTag)]) }}</a-tag>
            <span v-else>-</span>
        </span>
      </template>
      <template v-if="column.key === 'thirdRechargeFlag'">
        <span :style="record.thirdRechargeFlag ? 'color:green' : 'color:red'">{{ record.thirdRechargeFlag ? $t('yes') : $t('no') }}</span>
      </template>
      <template v-if="column.key === 'merchantMemberId'">
        {{ record.merchantMemberId || '-' }}
        <CopyOutlined v-if="record.merchantMemberId" class="copyId"  @click="$copyId(record.merchantMemberId)" />
      </template>
      <template v-if="column.key === 'voucher'">
        <a-image v-if="record.voucher" :width="40" :height="40" :src="record.voucher" />
        <img v-if="!record.voucher" style="width: 30px;" :src="no_up" alt="">
      </template>
      <template v-if="column.key === 'memberAccount'">
        <a-button type="link" @click="goPool(record.memberAccount)">{{
          record.memberAccount
        }}</a-button>
      </template>
      <template v-if="column.key === 'finishDuration'">
        {{
          record.finishDuration ? formatTime(record.finishDuration) : "-"
        }}
      </template>
      <template v-if="column.key ==='finishTime'">
        {{ record.finishTime || '-' }}
      </template>
      <!-- <template v-if="column.key === 'replenishmentFlag'">
        {{ record.replenishmentFlag ? $t('yes') : $t('no') }}
      </template> -->
      <template v-if="column.key === 'operate'">
        <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="checkDetail(record)"
          v-permission="'admin:collectionOrderAdmin:getInfo'"
          >{{ $t("b23") }}
        </a-tag>
        <div></div>
        <!-- 回调详情 -->
        <!-- <a-tag
          color="#F59A23"
          style="cursor: pointer;margin-top:5px;"
          size="small"
          v-if="record.isQuadOrder =='1'"
          @click="openCallback(record)"
          >{{ $t("m805") }}
        </a-tag> -->
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
    v-model:open="openDetail"
    :title="$t('b24')"
    width="70%"
    :footer="null"
  >
    <buyRecordInfo :listInfo="listInfo"/>
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
  <!-- 回调详情 -->
   <a-modal
    v-model:open="callbackMod"
    :title="$t('m805')"
    footer="null"
    @cancel="cancelCallBack"
    wrap-class-name="full-modal"
    width="100%"
   >
      <callbacksInfo v-if="callbackMod" :orderInfo="callbackForm" />
   </a-modal>
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
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined, ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons-vue";
import { getBuyOrderListPage, cancellationRechargeDict } from "@/api/order.api";
import buyRecordInfo from "@/components/orderManagement/buyRecordDetail.vue";
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import memberDetail from "@/components/Member/memberDetail.vue";
// import { getMerchantInfoAdminList } from "@/api/merchant.api";
import { formatTime, currency, thousand } from "@/utils/index";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { collectionOrderAdminExport } from "@/api/export";
import {  windControl, kycCompletion, releseMap, orderSourceMap, autoSellFlagMap, isAutoSellFlag, getAutoSellFlagLabel, getAutoSellFlagOptions, getAutoSellFlagFilters } from "@/utils/publicData";
import { useRoute } from "vue-router";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTableColumnDrawer } from "@/hooks/index";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import no_up from "@/assets/no_up.png";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { payTypeData, orderStatusMap, buyOrderTypeMap } from "@/utils/publicData";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import callbacksInfo from "@/components/orderManagement/callbacksInfo.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { message } from "ant-design-vue";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { useMerchantStore } from "@/stores/useMerchantStore";
const merchantList = computed(() => useMerchantStore().merchantList);
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
const route = useRoute();
// const dataSource = ref([]);
// const extendData = ref<any>({});
// const loading = ref(false);
// const merchantList = ref([]);
const detailModel = ref(false);
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
      bonus: extendData.value.bonusPagePageTotal,
      actualAmount: extendData.value.actualPageAmountTotal,
      fixedReward:extendData.value.fixedRewardPageTotal,
    },
    fixedPositions: {
      amount: 5,
    },
  },
  {
    label: t("m55"),
    fields: {
      amount: extendData.value.amountTotal,
      bonus: extendData.value.bonusPageTotal,
      actualAmount: extendData.value.actualAmountTotal,
      fixedReward:extendData.value.totalFixedReward,
    },
    fixedPositions: {
      amount: 5,
    },
  },
]);
const listInfo = ref({});
const query = ref({
  asc:false,
  column: "",
  completionTimeEnd: "",
  completionTimeStart: "",
  endTime: route.query.orderStatus || route.query.buyOrderNo ? '':endIndiaTime,
  startTime: route.query.orderStatus || route.query.buyOrderNo ? '':startIndiaTime,
  memberId: undefined,
  merchantCode: undefined,
  merchantOrder: undefined,
  orderStatus: route.query.orderStatus || undefined as any,
  pageNo: 1,
  pageSize: 20,
  platformOrder: route.query.buyOrderNo || undefined as any,
  riskTag: null as any,
  payType: undefined,
  isQuadOrder: undefined,
  quadOrder: undefined,
  utr: undefined,
  kycId:undefined,
  releaseFlag: undefined,
  completedByKyc: undefined,
  isKycSellOrder: undefined,
  thirdRechargeFlag: undefined,
  merchantMemberId: undefined,
  replenishmentFlag: undefined,
  cancelReasonId: undefined,
  buyOrderType: undefined,
  sourceType: undefined,
  wakeUpFlag: undefined,
  supportAmountFinishFlag: undefined,
  autoSellFlag: undefined,
  repackageAppBuyFlag: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
  // randomCode: undefined,
  // tId: undefined,
});
// const orderStatusMap:any = {
//   3: "n85",
//   4: "n86",
//   5: "n87",
//   6: "n88",
//   7: "n82",
//   8: "n56",
//   10: "n90",
//   11: "n91",
//   13: "n92",
//   15: "n107",
// };
const detailId = ref({
  id: 0,
  memberId: 0,
});
// 自动卖出搜索下拉选项，只在语言切换时重建
const autoSellFlagOptions = computed(getAutoSellFlagOptions);
const columns:any = [
  {
    // title: t("e47"),
    title: () => h("div", { class: "toopTipStyle2" }, t("e47")),
    align: "center",
    dataIndex: "index",
    key: "index",
    isRequired: true,
    filteredValue: [],
    fixed: "left",
    width: 60,
    customRender: ({ index }:{index: number}) => index + 1,
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    isRequired: true,
    filteredValue: [],
    fixed: "left",
    width: 180,
  },
  {
    title: t("l92"),
    dataIndex: "merchantName",
    key: "merchantName",
    isRequired: true,
    filteredValue: [],
    fixed: "left",
    align: "center",
    width: 100,
  },
  {
    title: t("p47"),
    dataIndex: "platformOrder",
    key: "platformOrder",
    exportFields: ["platformOrder", "merchantOrder"],
    isRequired: true,
    fixed: "left",
    filteredValue: [],
    align: "center",
    width: 240,
  },
  {
    // title: t("n51"),
    title: () => h("div", { class: "toopTipStyle2" }, t("n51")),
    dataIndex: "orderStatus",
    key: "orderStatus",
    isRequired: true,
    filters: Object.entries(orderStatusMap).map(([key, value]:[any,any]) => ({
              value: key,
              text: t(value),
            })),
    filterMultiple: false,
    filteredValue: query.value.orderStatus != undefined ? [query.value.orderStatus] : null,
    onFilter: (value:any, record:any) => record.orderStatus == value,
    fixed: "left",
    align: "center",
    width: 100,
  },
  {
    title: t("n42"),
    dataIndex: "amount",
    key: "amount",
    isRequired: true,
    fixed: "left",
    sorter: true,
    filteredValue: [],
    align: "center",
    width: 130,
  },
  {
    title: t("n48"),
    dataIndex: "bonus",
    key: "bonus",
    sorter: true,
    isRequired: true,
    filteredValue: [],
    align: "center",
    width: 110,
  },
  {
    title: t("n1794"),
    dataIndex: "fixedReward",
    key: "fixedReward",
    sorter: true,
    isRequired: true,
    filteredValue: [],
    align: "center",
    width: 110,
  },
  {
    title: t("n43"),
    dataIndex: "actualAmount",
    key: "actualAmount",
    sorter: true,
    isRequired: false,
    filteredValue: [],
    align: "center",
    width: 130,
  },
  // {
  //   title: t("n332"),
  //   dataIndex: "merchantOrder",
  //   key: "merchantOrder",
  //   filteredValue: [],
  //   align: "center",
  //   width: 200,
  // },
  {
    title: t("n1317"),
    dataIndex: "randomAmount",
    key: "randomAmount",
    filteredValue: [],
    align: "center",
    width: 120,
  },
  {
    title: "UTR",
    dataIndex: "utr",
    key: "utr",
    filteredValue: [],
    align: "center",
    width: 120,
  },
  // {
  //   title: t("n321"),
  //   dataIndex: "randomCode",
  //   key: "randomCode",
  //   filteredValue: [],
  //   align: "center",
  //   width: 220,
  // },
  // {
  //   title: t("m635"),
  //   dataIndex: "tId",
  //   key: "tId",
  //   align: "center",
  //   width: 220,
  // },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    filteredValue: [],
    align: "center",
    width: 140,
  },
  {
    title: t("m734"),
    dataIndex: "finishTime",
    key: "finishTime",
    filteredValue: [],
    align: "center",
    width: 140,
  },
  {
    title: t("m733"),
    dataIndex: "finishDuration",
    key: "finishDuration",
    filteredValue: [],
    align: "center",
    width: 140,
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
    title: t("n1531"),
    dataIndex: "repackageAppBuyFlag",
    key: "repackageAppBuyFlag",
    filteredValue: query.value.repackageAppBuyFlag != undefined ? [query.value.repackageAppBuyFlag] : null,
    align: "center",
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
    title: t("m812"),
    dataIndex: "isQuadOrder",
    key: "isQuadOrder",
    exportFields: ["isQuadOrder", "quadOrderChannel"],
    align: "center",
    width: 130,
  },
  {
    title: t("n1315")+'?',
    dataIndex: "supportAmountFinishFlag",
    key: "supportAmountFinishFlag",
    align: "center",
    width: 120,
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
    align: "center",
    width: 240,
  },
  {
    title: t("n1164"),
    dataIndex: "wakeUpFlag",
    key: "wakeUpFlag",
    align: "center",
    filters: [
      {
        text: t("yes"),
        value: '1',
      },
      {
        text: t("no"),
        value: '0',
      },
    ],
    filterMultiple: false,
    filteredValue: query.value.wakeUpFlag != undefined ? [query.value.wakeUpFlag] : null,
    width: 120,
  },
  {
    title: t("n1165"),
    dataIndex: "wakeUpBankCode",
    key: "wakeUpBankCode",
    align: "center",
    width: 120,
  },
  {
    title: t("n427"),
    dataIndex: "autoFinishFlag",
    key: "autoFinishFlag",
    align: "center",
    width: 160,
  },
  {
    title: t("n581"),
    dataIndex: "buyOrderType",
    key: "buyOrderType",
    align: "center",
    filters: Object.entries(buyOrderTypeMap).map(([key, value]:[any,any]) => ({
              value: key,
              text: t(value),
            })),
    filterMultiple: false,
    filteredValue: query.value.buyOrderType != undefined ? [query.value.buyOrderType] : null,
    width: 140,
  },
  {
    title: t("n149"),
    dataIndex: "thirdRechargeFlag",
    key: "thirdRechargeFlag",
    filters: [
      { text: t('yes'), value: '1' },
      { text: t('no'), value: '0' },
    ],
    filterMultiple: false,
    filteredValue: query.value.thirdRechargeFlag != undefined ? [query.value.thirdRechargeFlag] : null,
    onFilter: (value:any, record:any) => record.thirdRechargeFlag == value,
    align: "center",
    width: 100,
  },
  {
    title: t("m207"),
    dataIndex: "merchantMemberId",
    key: "merchantMemberId",
    isRequired: false,
    filteredValue: [],
    align: "center",
    width: 120,
  },
  {
    title: t("m824"),
    dataIndex: "completedByKyc",
    key: "completedByKyc",
    filters: [
      { text: t('yes'), value: '1' },
      { text: t('no'), value: '0' },
    ],
    filterMultiple: false,
    filteredValue: query.value.completedByKyc != undefined ? [query.value.completedByKyc] : null,
    onFilter: (value:any, record:any) => record.completedByKyc == value,
    align: "center",
    width: 120,
  },
  // {
  //   title: t("n208"),
  //   dataIndex: "replenishmentFlag",
  //   key: "replenishmentFlag",
  //   isRequired: false,
  //   align: "center",
  //   width: 110,
  // },
  {
    title: t("m435"),
    dataIndex: "riskTag",
    key: "riskTag",
    filteredValue: [],
    align: "center",
    width: 160,
  }, 
  // {
  //   title: t("m668"),
  //   dataIndex: "merchantOrder",
  //   key: "merchantOrder",
  //   align: "center",
  //   width: 250,
  // },
  // {
  //   title: t('m656'),
  //   dataIndex: "payType",
  //   key: "payType",
  //   align: "center",
  //   width: 220,
  // },
  // {
  //   title: "UTR",
  //   dataIndex: "utr",
  //   key: "utr",
  //   align: "center",
  //   width: 150,
  // },
  // {
  //   title: "UPI ID",
  //   dataIndex: "upiId",
  //   key: "upiId",
  //   align: "center",
  //   width: 150,
  // },
  // {
  //   title: "KYC ID",
  //   dataIndex: "kycId",
  //   key: "kycId",
  //   align: "center",
  //   width: 150,
  // },
  // {
  //   title: t("m606"),
  //   dataIndex: "voucher",
  //   key: "voucher",
  //   align: "center",
  //   width: 200,
  // },
  // {
  //   title: t("m745"),
  //   dataIndex: "releaseFlag",
  //   key: "releaseFlag",
  //   align: "center",
  //   width: 130,
  // },
  // {
  //   title: t("m607"),
  //   dataIndex: "isKycSellOrder",
  //   key: "isKycSellOrder",
  //   align: "center",
  //   width: 130,
  // },
  {
    title: t("l44"),
    dataIndex: "cancellationReason",
    key: "cancellationReason",
    export: true,
    align: "center",
    width: 160,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    filteredValue: [],
    width: 100,
    fixed: 'right',
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
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const search = () => {
  pagination.value.current = 1;
  query.value.pageNo = 1;
  getList()
}
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
  api: getBuyOrderListPage,
  defaultPageSize: 20,
  filterRules: [
    { key: "orderStatus" },
    { key: "thirdRechargeFlag", validValues: ["0", "1"] },
    { key: "completedByKyc", validValues: ["0", "1"] },
    { key: "buyOrderType" },
    { key: "wakeUpFlag", validValues: ["0", "1"] },
    { key: "autoSellFlag", validValues: Object.keys(autoSellFlagMap) },
    { key: "sourceType" },
  ],
  afterFetch: (data) =>
  data.map((item: any) => {
    item.actualAmount = thousand(item.actualAmount);
    item.bonus = thousand(item.bonus);
    item.amount = thousand(item.amount);
    item.fixedReward = thousand(item.fixedReward);
    // item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
    return item;
  }),
});
// const isChange = ref(false);
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async () => {
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
//   const res: any = await getBuyOrderListPage(query.value).finally(()=>{loading.value = false;});
//   if (res && res.code === "1") {
//     dataSource.value = res.data.map((item: any) => {
//       item.actualAmount = thousand(item.actualAmount);
//       item.bonus = thousand(item.bonus);
//       item.amount = thousand(item.amount);
//       // item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
//       return item;
//     });
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
//     // if (!isChange.value) {
//     //   pagination.value.current = query.value.pageNo;
//     // }
//     // isChange.value = false;
//   }
// };
// const getforData = async ()=>{
//   const res: any = await getBuyOrderListPage(query.value);
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
//     { key: "orderStatus" },
//     { key: "thirdRechargeFlag", validValues: ["0", "1"] },
//     { key: "completedByKyc", validValues: ["0", "1"] },
//     { key: "buyOrderType" },
//     { key: "wakeUpFlag", validValues: ["0", "1"] },
//     { key: "sourceType" },
//   ],
// });
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};
const goPool = (id: any) => {
  router.push({ path: "/order/matchingPool/index", query: { id } });
};
const { getBuyRecordCheckDetail } = getUsdtBuyOrderInfo();
const openDetail = ref(false);
const detailObj = ref<any>({});
const checkDetail = (value: any) => {
  selectedRow();
  const { id } = value;
  getBuyRecordCheckDetail({ id });
  listInfo.value = value;
  openDetail.value = true;
  detailObj.value = value;
};

// const columnVal = ref("");
// const sortVal = ref("");
// // 表格变化处理函数
// const handleTableChange: any = (value: any, filters: any, sorter: any) => {
//   const { current, pageSize } = value;
//   query.value.pageNo = current;
//   query.value.pageSize = pageSize;
//   query.value.orderStatus = filters.orderStatus?.[0] || query.value.orderStatus;
//   query.value.thirdRechargeFlag = ['0','1'].includes(filters.thirdRechargeFlag?.[0]) ? filters.thirdRechargeFlag?.[0] : query.value.thirdRechargeFlag;
//   query.value.completedByKyc = ['0','1'].includes(filters.completedByKyc?.[0]) ? filters.completedByKyc?.[0] : query.value.completedByKyc;
//   const { columnKey, order } = sorter;
//   if (columnVal.value === columnKey) {
//     pagination.value.current = current;
//     pagination.value.pageSize = pageSize;
//     if (sortVal.value != order) {
//       pagination.value.current = 1;
//       query.value.pageNo = 1;
//     }
//   } else if(query.value.column == '' && order == undefined) {
//     query.value.pageNo = current;
//     pagination.value.current = current;
//     pagination.value.pageSize = pageSize;
//   }else{
//     pagination.value.current = 1;
//     query.value.pageNo = 1;
//   }
//   if (order == undefined) {
//     query.value.asc = null;
//     query.value.column = "";
//     columnVal.value = "";
//     sortVal.value = "";
//     isChange.value = false;
//   } else {
//     query.value.column = columnKey;
//     columnVal.value = columnKey;
//     sortVal.value = order;
//     query.value.asc = Boolean(order === "ascend");
//     isChange.value = true;
//   }
//   getList();
// };
// const resetQuery = () => {
//   query.value = {
//     asc:false,
//     column: "",
//     completionTimeEnd: "",
//     completionTimeStart: "",
//     endTime: "",
//     startTime: "",
//     memberId: undefined,
//     merchantCode: undefined,
//     merchantOrder: undefined,
//     orderStatus: undefined,
//     pageNo: 1,
//     pageSize: 20,
//     platformOrder: "",
//     riskTag: null,
//     payType: undefined,
//     isQuadOrder: undefined,
//     quadOrder: undefined,
//     utr: undefined,
//     kycId:undefined,
//     releaseFlag: undefined,
//     completedByKyc: undefined,
//     isKycSellOrder: undefined,
//     thirdRechargeFlag: undefined,
//     merchantMemberId: undefined,
//     replenishmentFlag: undefined,
//     cancelReasonId: undefined,
//     buyOrderType: undefined,
//     sourceType: undefined,
//     wakeUpFlag: undefined,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//     // randomCode: undefined,
//     // tId: undefined,
//   };
//   pagination.value.pageSize = 20;
//   pagination.value.current =1;
//   clearSelected();
//   getList();
// };
// const getmerchant = async () => {
//   const res: any = await getMerchantInfoAdminList({ pageNo: 1, pageSize: 10000 });
//   if (res && res.code === "1") {
//     merchantList.value = res.data.map((item: any) => ({
//       value: item.code,
//       label: item.username,
//     }));
//   }
// };
// const paymentTime = computed({
//   get: () => {
//     return [query.value.startTime, query.value.endTime];
//   },
//   set: (val) => {
//     query.value.startTime = val ? val[0] : "";
//     query.value.endTime = val ? val[1] : "";
//   },
// });
// const completionTime = computed({
//   get: () => {
//     return [query.value.completionTimeStart, query.value.completionTimeEnd];
//   },
//   set: (val) => {
//     query.value.completionTimeStart = val ? val[0] : "";
//     query.value.completionTimeEnd = val ? val[1] : "";
//   },
// });
const goAssemble = (id: any) => {
  const query: any = { recharge: id };
  router.push({ path: "/order/assemble/index", query });
};

const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res: any = await collectionOrderAdminExport(data).finally(() => {
    loading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t("n545"));
  }
};

//回调详情
const callbackMod = ref(false);
const callbackForm = ref({
  platformOrder: undefined,
  type: 1,
})
const openCallback = (value: any) => {
  callbackForm.value.platformOrder = value.platformOrder;
  callbackMod.value = true;
}
const cancelCallBack = () => {
  callbackMod.value = false;
  callbackForm.value.platformOrder = undefined;
}

//买入取消原因列表
const cancellationReasonList: any = ref([]);
const getCancellationRechargeDict = async () => {
  const res: any = await cancellationRechargeDict();
  if (res && res.code == "1") {
    cancellationReasonList.value = res.data;
  }
};
onMounted(() => {
  getCancellationRechargeDict();
  if (route.query.platformOrder) {
    query.value.platformOrder = route.query.platformOrder;
  }
  // getmerchant();   
  getList();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.windActive){
  font-weight: 600;
  color: red;
}
.tableText{
  button{
    height: 16px;
  }
}
</style>
