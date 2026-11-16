<template>
  <div class="search">
    <h2>{{ $t("m5") }}</h2>
    <a-row style="margin: 0 0 5px 0">
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.platformOrder"
          :placeholder="$t('n40')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.matchOrder"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n322')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('p4')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.utr"
          class="searchstyle"
          :placeholder="$t('m562')+'UTR'"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.randomCode"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n321')"
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
          allowClear
          :placeholder="$t('m563')+$t('n51')"
          v-model:value="query.orderStatus"
          :options="
            Object.entries(orderStatusMap).map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
        >
        </a-select>
      </a-col>
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.upiId"
          class="searchstyle"
          :placeholder="$t('m562')+'UPI ID'"
        />
      </a-col> -->
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.sellOrderType"
          :placeholder="$t('n582')"
          :allowClear="true"
          :options="
            Object.entries(sellOrderTypeMap)
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
          ref="select"
          class="searchstyle"
          v-model:value="query.thirdRechargeFlag"
          :placeholder="$t('n150')"
        >
          <a-select-option :value="0">{{ $t("no") }}</a-select-option>
          <a-select-option :value="1">{{ $t("yes") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.merchantName"
          :placeholder="$t('p26')"
          :allowClear="true"
        >
          <a-select-option
            v-for="(item, key) in merchantList"
            :value="item.username"
            :key="item"
            >{{ item.username }}</a-select-option>
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
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.merchantMemberId"
          class="searchstyle"
          :placeholder="$t('m207')"
        />
      </a-col> -->
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.merchantOrder"
          class="searchstyle"
          :placeholder="$t('m668')"
        />
      </a-col>
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
        <a-input v-trim
          v-model:value="query.matchOrder"
          class="searchstyle"
          :placeholder="$t('e13')"
        />
      </a-col> -->
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.blockedStatus"
          :placeholder="$t('m563')+$t('m711')"
          :allowClear="true"
          :options="
            Object.entries(blockMap).map(([key, value]:[any,any]) => ({
              value: key,
              label: value,
            }))
          "
        >
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.distributionStatus"
          :placeholder="$t('m563')+$t('m714')"
          :allowClear="true"
          :options="
            Object.entries(assignMap).map(([key, value]:[any,any]) => ({
              value: key,
              label: value,
            }))
          "
        >
        </a-select>
      </a-col> -->
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
        <a-input-number
          class="searchstyle"
          :precision="0"
          v-model:value="query.matchDurationStart"
          :placeholder="$t('p34')"
        />
      </a-col> -->
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-input-number
          class="searchstyle"
          :precision="0"
          v-model:value="query.matchDurationEnd"
          :placeholder="$t('p35')"
        />
      </a-col> -->
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-input-number
          v-model:value="query.completeDurationStart"
          class="searchstyle"
          :precision="0"
          :placeholder="$t('p29')"
        />
      </a-col> -->
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-input-number
          class="searchstyle"
          :precision="0"
          v-model:value="query.completeDurationEnd"
          :placeholder="$t('p30')"
        />
      </a-col> -->
      <!-- <a-col :span="6">
        <a-range-picker
          class="searchstyle"
          show-time
          v-model:value="searchCompletionDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m171')]"
        />
      </a-col>
      <a-col :span="6">
        <a-range-picker
          class="searchstyle"
          show-time
          v-model:value="searchDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m172')]"
        />
      </a-col> -->
      <a-col >
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('l50')" :type="1"/>
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
          @click="search()"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <ExportButton
          :query="query"
          :api="paymentOrderAdminExport"
          :enable-export-fields="true"
          permission="admin:paymentOrderAdmin:export"
        />
        <!-- <a-button type="primary" @click="exportList"  :loading="loading"   v-permission="'admin:paymentOrderAdmin:export'">{{
          $t("export")
        }}</a-button> -->
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
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'matchOrder'">
        <div class="tableText toopTipStyle2">
          <span>{{ $t('n322') }}：</span>
          <a-button v-if="record.matchOrder" class="copyContent" type="link" @click="goPool(record.matchOrder)">{{
          record.matchOrder
          }}</a-button>
          <CopyOutlined v-if="record.matchOrder" class="copyId"  @click="$copyId(record.matchOrder)" />
          <span v-else>-</span>
        </div>
        <div class="tableText toopTipStyle2">
          <span>{{ $t('n323') }}：</span>
        <a-button :class="record.riskTag != '0' ? 'windActive':''"  class="copyContent" type="link" @click="goAssemble(record.platformOrder)">{{
          record.platformOrder
        }}</a-button>
          <CopyOutlined v-if="record.platformOrder" class="copyId"  @click="$copyId(record.platformOrder)" />
          <span v-else>-</span>
        </div>
        <div class="tableText toopTipStyle3">
          <span>{{ $t('n324') }}：</span>
          {{ record.merchantOrder }}
          <!-- <a-button v-if="record.merchantOrder" class="copyContent" type="link" @click="goPool(record.merchantOrder)">{{
          record.merchantOrder
          }}</a-button> -->
          <CopyOutlined v-if="record.merchantOrder" class="copyId"  @click="$copyId(record.merchantOrder)" />
          <span v-else>-</span>
        </div>
      </template>
      <!-- <template v-if="column.key === 'platformOrder'">
        <a-button :class="record.riskTag != '0' ? 'windActive':''"  class="copyContent" type="link" @click="goAssemble(record.platformOrder)">{{
          record.platformOrder
        }}</a-button>
          <CopyOutlined v-if="record.platformOrder" class="copyId"  @click="$copyId(record.platformOrder)" />
          <span v-else>-</span>
      </template> -->
      <template v-if="column.key === 'matchDuration'">
        {{ record.matchDuration ? formatTime(record.matchDuration) : "-" }}
      </template>
      <template v-if="column.key ==='payType'">
        {{ record.payType ? $t(payTypeData[record.payType]) : '-' }}
      </template>
      <template v-if="column.key === 'memberId'">
        <a-button type="link" class="copyContent" @click="showMember(record.memberId)">{{
          record.memberId
        }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'quadOrder'">
        <a-tooltip v-if="record.quadOrder">
          <template #title>{{ record.quadOrder }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.quadOrder }}</div>
        </a-tooltip>
        <span v-else>-</span>
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
      <template v-if="column.key === 'merchantMemberId'">
        {{ record.merchantMemberId || "-" }}
        <CopyOutlined v-if="record.merchantMemberId" class="copyId"  @click="$copyId(record.merchantMemberId)" />
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
      <template v-if="column.key === 'autoSellFlag'">
        <span :class="isAutoSellFlag(record.autoSellFlag) ? 'tag-green' : 'tag-gray'">{{ getAutoSellFlagLabel(record.autoSellFlag) }}</span>
      </template>
      <template v-if="column.key === 'sourceType'">
        <span v-if="record.sourceType">{{ $t($getMapItem(orderSourceMap,record.sourceType)) }}</span>
        <span v-else>{{ $t('n623') }}</span>
      </template>
      <template v-if="column.key === 'autoFinishFlag'">
        <span :style="{ color: record.autoFinishFlag == 1 ? 'green' : '' }">{{ record.autoFinishFlag == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <template v-if="column.key === 'sellOrderType'">
        {{ $t($getMapItem(sellOrderTypeMap,record.sellOrderType)) || '-' }}
      </template>
      <template v-if="column.key === 'completedByKyc'">
        <span :style="{ color: record.completedByKyc == 1 ? 'green' : '' }">{{ record.completedByKyc == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <template v-if="column.key === 'thirdRechargeFlag'">
        <span :style="{ color: record.thirdRechargeFlag == 1 ? 'green' : '' }">{{ record.thirdRechargeFlag == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <!-- <template v-if="column.key === 'releaseFlag'">{{ $t(releseMap[record.releaseFlag]) }}</template> -->
      <template v-if="column.key === 'finishDuration'">
        {{
          record.finishDuration ? formatTime(record.finishDuration) : "-"
        }}
      </template>
      <template v-if="column.key === 'orderStatus'">
        <div class="toopTipStyle2">{{ record.orderStatus ? $t(orderStatusMap[Number(record.orderStatus)]) : '' }}</div>
      </template>
      <!-- <template v-if="column.key === 'blockedStatus'">
        <a-tag>{{ blockMap[record.blockedStatus]  }}</a-tag>
      </template> -->
      <!-- <template v-if="column.key === 'distributionStatus'">
        <a-tag>{{ assignMap[record.distributionStatus]  }}</a-tag>
      </template> -->
      <template v-if="column.key === 'voucher'">
        <a-image v-if="record.voucher" :width="40" :height="40" :src="record.voucher" />
        <img v-if="!record.voucher" style="width: 30px;" :src="no_up" alt="">
      </template>
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
          v-permission="'admin:paymentOrderAdmin:getInfo'"
          >{{ $t("b23") }}
        </a-tag>
        <div></div>
        <!-- 查询状态 -->
            <!-- v-if="!['69pay','uupay'].includes(record.thirdCode) && record.showQueryButton == 0"
            v-permission="'admin:/merchantCollectionOrderAdmin:checkThirdOrderStatus'" -->
          <!-- <a-tag
            color="#1677ff"
            style="cursor: pointer;margin-top:5px;"
            size="small"
            v-if="record.isQuadOrder != 0 && !['7','8','9','10','15'].includes(record.orderStatus) && !['9999999999'].includes(record.memberAccount)"
            v-permission="'admin:sellOrderAdmin:thirdPaymentOrderQuery'"
            @click="getOrderStatus(record)"
            >{{ $t("m683") }}
          </a-tag>
        <div></div> -->
        <!-- 锁定订单 -->
        <!-- <a-tag
          color="#F59A23"
          style="cursor: pointer;margin-top:5px;"
          size="small"
          v-if="record.blockedStatus == 0 && record.isQuadOrder =='0' && ['1'].includes(record.orderStatus) && record.distributionStatus != 1"
          v-permission="'admin:paymentOrderAdmin:blockOrder'"
          @click="openBlockOrderMod(record)"
          >{{ $t("m705") }}
        </a-tag>
        <div></div> -->
        <!-- 分配订单 -->
        <!-- <a-tag
          color="#F59A23"
          style="cursor: pointer;margin-top:5px;"
          size="small"
          v-if="record.blockedStatus == 1 && record.isQuadOrder =='0' && ['1'].includes(record.orderStatus) && record.distributionStatus != 1"
          v-permission="'admin:paymentOrderAdmin:distributionOrder'"
          @click="openDisMod(record)"
          >{{ $t("m707") }}
        </a-tag>
        <div></div> -->
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
    <saleOrderDetail :listInfo="listInfo" />
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
  <a-modal
    v-model:open="statusMod"
    :title="$t('m684')"
    :footer="null"
    width="400px"
    :mask-closable="false"
    @cancel="statusCancel"
  >
      <h3 style="text-align: center;">{{ statusText }}</h3>
  </a-modal>
  <!-- 锁定订单 -->
  <a-modal
    v-model:open="blockMod"
    :title="$t('m705')"
    width="400px"
    @ok="blockOrder"
    @cancel="cancelBlock"
  >
    <h3 style="text-align: center;">{{ $t("m706") }}</h3>
  </a-modal>
  <!-- 分配订单 -->
  <a-modal
    v-model:open="distributionMod"
    :title="$t('m707')"
    width="400px"
    @ok="distributionOrder"
    @cancel="cancelDis"
  >
    <a-form
      :model="disForm"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item :label="$t('m709')" name="distributionType" required>
        <a-radio-group v-model:value="disForm.distributionType">
          <a-radio v-for="(item, index) in disMap" :key="index" :value="Number(index)"> {{ item }} </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
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
import { SearchOutlined , ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons-vue";
import { getSaleOrderListPage,getSaleOrderStatus, sellBlockOrder, sellDistributionOrder } from "@/api/order.api";
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import memberDetail from "@/components/Member/memberDetail.vue";
import saleOrderDetail from "@/components/orderManagement/saleOrderDetail.vue";
// import { getMerchantInfoAdminList } from "@/api/merchant.api";
import { formatTime, currency, thousand } from "@/utils/index";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { useRoute } from "vue-router";
import { paymentOrderAdminExport } from "@/api/export";
import {  windControl, kycCompletion,releseMap } from "@/utils/publicData";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import no_up from "@/assets/no_up.png";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { payTypeData, orderStatusMap, sellOrderTypeMap, orderSourceMap, autoSellFlagMap, isAutoSellFlag, getAutoSellFlagLabel, getAutoSellFlagOptions, getAutoSellFlagFilters } from "@/utils/publicData";
import callbacksInfo from "@/components/orderManagement/callbacksInfo.vue";
import { message } from "ant-design-vue";
import { useTableColumnDrawer } from "@/hooks/index";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { useMerchantStore } from "@/stores/useMerchantStore";
const merchantList = computed(() => useMerchantStore().merchantList);
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
const route = useRoute();
const detailModel = ref(false);
// const merchantList = ref([]);
// const dataSource = ref([]);
// const extendData = ref<any>({});
// const loading = ref(false);
const isShowMoreSearch = ref(false);
const showMoreSearch = () => {
  isShowMoreSearch.value = !isShowMoreSearch.value;
  setTimeout(() => {
    getTabH.value = useTabHeight(1).getTabH.value;
  },100)
}
const detailId = ref({
  id: 0,
  memberId: 0,
});
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


// const orderStatusMap:any = {
//   1: 'n83',
//   2: 'n84',
//   3: 'n85',
//   4: 'n86',
//   5: 'n87',
//   6: 'n88',
//   7: 'n82',
//   8: 'n56',
//   9: 'n89',
//   10: 'n90',
//   11: 'n91',
//   13: 'n92',
//   15: 'n107'
// }
const query = ref({
  asc:false,
  column: "",
  pageNo: 1,
  pageSize: 20,
  // completeDurationEnd: "",
  // completeDurationStart: "",
  completionTimeEnd: "",
  completionTimeStart: "",
  createTimeEnd: route.query.orderStatus ? '': endIndiaTime,
  createTimeStart: route.query.orderStatus ? '': startIndiaTime,
  // matchDurationEnd: "",
  // matchDurationStart: "",
  memberId: undefined,
  matchOrder: route?.query?.id || route?.query?.matchOrder || undefined as any,
  merchantName: undefined,
  merchantOrder: undefined,
  orderStatus: route.query.orderStatus || undefined as any,
  platformOrder: undefined as any,
  riskTag: undefined,
  // payType: undefined,
  isQuadOrder: undefined,
  merchantMemberId: undefined,
  thirdRechargeFlag: undefined,
  randomCode: undefined,
  quadOrder: undefined,
  utr: undefined,
  kycId:undefined,
  // blockedStatus: undefined,
  // distributionStatus: undefined,
  // releaseFlag: undefined,
  completedByKyc: undefined,
  // isKycSellOrder: undefined,
  replenishmentFlag: undefined,
  sellOrderType: undefined,
  sourceType: undefined,
  autoSellFlag: undefined,
  // upiId: undefined,
    // tId: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const disMap = ref({
  1: "C2C",
  2: t('m710'),
})
const blockMap = ref({
  0: t('m713'),
  1: t('m712'),
})
const assignMap = ref({
  0: t('m715'),
  1: t('m716'),
  2: t('m717'),
})
// 自动卖出搜索下拉选项，只在语言切换时重建
const autoSellFlagOptions = computed(getAutoSellFlagOptions);
const columns:any = [
  {
    // title: t('e47'),
    title: () => h("div", { class: 'toopTipStyle2' }, t("e47")),
    align: "center",
    dataIndex: "index",
    key: "index",
    isRequired: true,
    filteredValue: [],
    fixed: "left",
    customRender:({index}:{index:any})=> index + 1,
    width: 60,
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    isRequired: true,
    filteredValue: [],
    fixed: "left",
    align: "center",
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
    title: t("l90"),
    dataIndex: "matchOrder",
    key: "matchOrder",
    exportFields: ["matchOrder", "platformOrder", "merchantOrder"],
    isRequired: true,
    filteredValue: [],
    fixed: "left",
    align: "center",
    width: 280,
  },
  // {
  //   title: t("p37"),
  //   dataIndex: "matchOrder",
  //   key: "matchOrder",
  //   align: "center",
  //   width: 240,
  // },
  // {
  //   title: t("卖出订单号(子单)"),
  //   dataIndex: "platformOrder",
  //   key: "platformOrder",
  //   align: "center",
  //   width: 240,
  // },
  {
    title: t("n51"),
    dataIndex: "orderStatus",
    key: "orderStatus",
    align: "center",
    filters: Object.entries(orderStatusMap).map(([key, value]:[any,any]) => ({
              value: key,
              text: t(value),
            })),
    filterMultiple: false,
    filteredValue: query.value.orderStatus != undefined ? [query.value.orderStatus] : null,
    onFilter: (value:any, record:any) => record.orderStatus == value,
    isRequired: true,
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
    sorter: true,
    fixed: "left",
    width: 130,
  },
  {
    title: t("n48"),
    dataIndex: "bonus",
    sorter: true,
    filteredValue: [],
    key: "bonus",
    align: "center",
    width: 110,
  },
  {
    title: t("n1794"),
    dataIndex: "fixedReward",
    sorter: true,
    filteredValue: [],
    key: "fixedReward",
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
    width: 150,
  },
  {
    title: t("m734"),
    dataIndex: "finishTime",
    key: "finishTime",
    filteredValue: [],
    align: "center",
    width: 150,
  },
  {
    title: t("m733"),
    dataIndex: "finishDuration",
    key: "finishDuration",
    filteredValue: [],
    align: "center",
    width: 120,
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
    title: t("n427"),
    dataIndex: "autoFinishFlag",
    key: "autoFinishFlag",
    align: "center",
    width: 160,
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
    title: t("n149"),
    dataIndex: "thirdRechargeFlag",
    key: "thirdRechargeFlag",
    filters: [
      { text: t('yes'), value: 1 },
      { text: t('no'), value: 0 },
    ],
    filterMultiple: false,
    filteredValue: query.value.thirdRechargeFlag != undefined ? [query.value.thirdRechargeFlag] : null,
    onFilter: (value:any, record:any) => record.thirdRechargeFlag == value,
    align: "center",
    width: 100,
  },
  // {
  //   title: t("m207"),
  //   dataIndex: "merchantMemberId",
  //   key: "merchantMemberId",
  //   isRequired: false,
  //   filteredValue: [],
  //   align: "center",
  //   width: 120,
  // },
  // {
  //   title: t('m656'),
  //   dataIndex: "payType",
  //   key: "payType",
  //   align: "center",
  //   width: 100,
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
  //   title: t("m674"),
  //   dataIndex: "quadOrderChannel",
  //   key: "quadOrderChannel",
  //   align: "center",
  //   width: 130,
  // },

  // {
  //   title: t("l96"),
  //   dataIndex: "merchantOrder",
  //   key: "merchantOrder",
  //   align: "center",
  // },
  // {
  //   title: t("n70"),
  //   dataIndex: "matchDuration",
  //   key: "matchDuration",
  //   align: "center",
  //   width: 120,
  // },
  {
    title: t("m812"),
    dataIndex: "isQuadOrder",
    key: "isQuadOrder",
    exportFields: ["isQuadOrder", "quadOrderChannel"],
    align: "center",
    width: 130,
  },
  {
    title: t("n864"),
    dataIndex: "quadOrder",
    key: "quadOrder",
    align: "center",
    width: 240,
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
  //   title: t("m607"),
  //   dataIndex: "isKycSellOrder",
  //   key: "isKycSellOrder",
  //   align: "center",
  //   width: 130,
  // },
  // {
  //   title: t("m745"),
  //   dataIndex: "releaseFlag",
  //   key: "releaseFlag",
  //   align: "center",
  //   width: 130,
  // },
  // {
  //   title: t("n51"),
  //   dataIndex: "orderStatus",
  //   key: "orderStatus",
  //   align: "center",
  //   width: 120,
  // },
  // {
  //   title: t("m711"),
  //   dataIndex: "blockedStatus",
  //   key: "blockedStatus",
  //   align: "center",
  //   width: 120,
  // },
  // {
  //   title: t("m714"),
  //   dataIndex: "distributionStatus",
  //   key: "distributionStatus",
  //   align: "center",
  //   width: 120,
  // },
  // {
  //   title: t("n208"),
  //   dataIndex: "replenishmentFlag",
  //   key: "replenishmentFlag",
  //   align: "center",
  //   isRequired: false,
  //   width: 110,
  // },
  {
    title: t("m435"),
    dataIndex: "riskTag",
    key: "riskTag",
    align: "center",
    filteredValue: [],
    width: 160,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    filteredValue: [],
    align: "center",
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
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};
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
  api: getSaleOrderListPage,
  defaultPageSize: 20,
  filterRules: [
    { key: "orderStatus" },
    { key: "thirdRechargeFlag", validValues: [0, 1] },
    { key: "completedByKyc", validValues: ["0", "1"] },
    { key: "autoSellFlag", validValues: Object.keys(autoSellFlagMap) },
    { key: "sellOrderType" },
    { key: "sourceType" },
  ],
  afterFetch: (data) =>
  data.map((item: any) => {
    item.actualAmount = thousand(item.actualAmount);
    item.amount = thousand(item.amount);
    item.bonus = thousand(item.bonus);
    item.fixedReward = thousand(item.fixedReward);
    return item;
  }),
});
// const isChange = ref(false);
//   const oldPageNo = ref(0);
//   const pageCurrent = ref(0);
//   let queryCount = ref(0);
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
//   const res: any = await getSaleOrderListPage(Object.assign(query.value)).catch((err)=>loading.value = false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data.map((item: any) => {
//       item.actualAmount = thousand(item.actualAmount);
//       item.amount = thousand(item.amount);
//       item.bonus = thousand(item.bonus);
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
//     loading.value = false;
//     // if (!isChange.value) {
//     //   pagination.value.current = query.pageNo;
//     // }
//     // isChange.value = false;
//   }else{
//     loading.value = false;
//   }
// };
// const getforData = async ()=>{
//   const res: any = await getSaleOrderListPage(query.value);
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
//     { key: "thirdRechargeFlag", validValues: [0, 1] },
//     { key: "completedByKyc", validValues: ["0", "1"] },
//     { key: "sellOrderType" },
//     { key: "sourceType" },
//   ],
// });
// const columnVal = ref("");
// const sortVal = ref("");
// const handleTableChange: any = (value: any, filters: any, sorter: any) => {
//   const { current, pageSize } = value;
//   query.value.pageNo = current;
//   query.value.pageSize = pageSize;
//   query.value.orderStatus = filters.orderStatus?.[0] || query.value.orderStatus;
//   query.value.thirdRechargeFlag = [0,1].includes(filters.thirdRechargeFlag?.[0]) ? filters.thirdRechargeFlag?.[0] : query.value.thirdRechargeFlag;
//   query.value.completedByKyc = filters.completedByKyc?.[0] || query.value.completedByKyc;
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
//   getList(query.value);
// };
const listInfo = ref({});
const { getsaleOrderDetail } = getUsdtBuyOrderInfo();
const openDetail = ref(false);
const detailObj = ref<any>({});
const checkDetail = (value: any) => {
  selectedRow();
  listInfo.value = value;
  const { id } = value;
  getsaleOrderDetail({ id });
  openDetail.value = true;
  detailObj.value = value;
};
const search = () => {
  query.value.pageNo = 1;
  pagination.value.current = 1;
  getList();
}
// const resetQuery = () => {
//   query.value = {
//     asc:false,
//     column: "",
//     completionTimeEnd: "",
//     completionTimeStart: "",
//     createTimeEnd: "",
//     createTimeStart: "",
//     matchOrder: undefined,
//     memberId: undefined,
//     merchantName: undefined,
//     merchantOrder: undefined,
//     orderStatus: undefined,
//     pageNo: 1,
//     pageSize: 20,
//     platformOrder: undefined,
//     riskTag: undefined,
//     utr: undefined,
//     kycId:undefined,
//     completedByKyc: undefined,
//     replenishmentFlag: undefined,
//     randomCode: undefined,
//     thirdRechargeFlag: undefined,
//     merchantMemberId: undefined,
//     sellOrderType: undefined,
//     sourceType: undefined,
//     // tId: undefined,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   pagination.value.pageSize = 20;
//   pagination.value.current = 1;
//   clearSelected();
//   getList();
// };
// const getmerchant = async () => {
//   const res: any = await getMerchantInfoAdminList({ pageNo: 1, pageSize: 10000 });
//   if (res && res.code === "1") {
//     merchantList.value = res.data.map((item: any) => ({
//       value: item.username,
//       label: item.username,
//     }));
//   }
// };
// const searchCompletionDate = computed({
//   get: () => {
//     return [query.value.completionTimeStart, query.value.completionTimeEnd];
//   },
//   set: (val) => {
//     query.value.completionTimeStart = val ? val[0] : "";
//     query.value.completionTimeEnd = val ? val[1] : "";
//   },
// });
// const searchDate = computed({
//   get: () => {
//     return [query.value.createTimeStart, query.value.createTimeEnd];
//   },
//   set: (val) => {
//     query.value.createTimeStart = val ? val[0] : "";
//     query.value.createTimeEnd = val ? val[1] : "";
//   },
// });
const goAssemble = (id: any) => {
  router.push({ path: "/order/assemble/index", query: { withdraw: id } });
};
const goPool = (id: any) => {
  router.push({ path: "/order/matchingPool/index", query: { id } });
};

const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res: any = await paymentOrderAdminExport(data).finally(() => {
    loading.value = false;
  });
  if(res && res.code == '1'){
    message.success(t("n545"));
  }
};
//查询状态
const statusMod = ref(false);
const statusText = ref('');
const returnStatusMap:any = {
  1: t("m685"),//处理中
  2: t("s10"),//成功
  3: t("m618"),//失败
  4: t("m686"),//不存在
}
const getOrderStatus = async (values: any) => {
  loading.value = true;
  const res: any = await getSaleOrderStatus({orderNo: values.platformOrder}).finally(()=>{
    loading.value = false;
    getList();
  });
  if (res && res.code === "1") {
    // message.success(t("s10"));
    statusText.value = returnStatusMap[res.data.orderStatus];
    statusMod.value = true;
  }
}
const statusCancel = () => {
  statusMod.value = false;
}
//锁定订单
const blockMod = ref(false);
const paymentOrderNo = ref('');
const openBlockOrderMod = (value:any)=> {
  blockMod.value = true;
  paymentOrderNo.value = value.platformOrder;
}
const blockOrder = async () => {
  loading.value = true;
  const res: any = await sellBlockOrder({paymentOrderNo: paymentOrderNo.value}).finally(()=>{
    loading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t("s10"));
    blockMod.value = false;
    getList();
  }
}
const cancelBlock = () => {
  blockMod.value = false;
  paymentOrderNo.value = '';
}

//分配订单
const distributionMod = ref(false);
const disForm = ref({
  distributionType: undefined,
  paymentOrderNo: undefined,
})
const openDisMod = (value: any) => {
  distributionMod.value = true;
  disForm.value.paymentOrderNo = value.platformOrder;
}
const distributionOrder = async () => {
  if (!disForm.value.distributionType) {
    message.error(t("m708"));
    return
  }
  loading.value = true;
  const res: any = await sellDistributionOrder(disForm.value).finally(()=>{
    loading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t("s10"));
    distributionMod.value = false;
    getList();
  }
}
const cancelDis = () => {
  distributionMod.value = false;
  disForm.value = {
    distributionType: undefined,
    paymentOrderNo: undefined,
  };
}

//回调详情
const callbackMod = ref(false);
const callbackForm = ref({
  platformOrder: undefined,
  type: 2,
})
const openCallback = (value: any) => {
  callbackForm.value.platformOrder = value.platformOrder;
  callbackMod.value = true;
}
const cancelCallBack = () => {
  callbackMod.value = false;
  callbackForm.value.platformOrder = undefined;
}

onMounted(() => {
  if (route.query?.platformOrder) {
    query.value.platformOrder = route.query.platformOrder;
  }
  // getmerchant();
  getList();
  getTabH.value = useTabHeight(1).getTabH.value;
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
.copyContent{
  height: 16px;
}
</style>
