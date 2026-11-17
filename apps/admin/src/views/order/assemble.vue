<template>
  <div class="search">
    <countDown :title="$t('m11')" @zero="getList()" />
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.platformOrder"
          :allowClear="true"
          :placeholder="$t('m807')"
        />
      </a-col>
      <a-col :span="3">
        <a-select 
          class="searchstyle"
          v-model:value="query.appealStatus"
          :placeholder="$t('m563')+$t('n433')"
          :allowClear="true"
          :options="Object.entries(appealTypeMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value), }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          class="searchstyle"
          :allowClear="true"
          v-model:value="query.collectionMemberId"
          :placeholder="$t('m149')"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          class="searchstyle"
          :allowClear="true"
          v-model:value="query.paymentMemberId"
          :placeholder="$t('m150')"
        />
      </a-col>
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.randomCode"
          class="searchstyle"
          :placeholder="$t('n321')"
        />
      </a-col> -->
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.matchOrder"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('p37')"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          class="searchstyle"
          :allowClear="true"
          v-model:value="query.collectionPlatformOrder"
          :placeholder="$t('p47')"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.paymentPlatformOrder"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('p48')"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.collectionMerchantOrder"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+$t('n206')"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.quickWithdrawalOrderNo"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+$t('n627')"
        />
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
        <a-input v-trim
          v-model:value="query.utr"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+'UTR'"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.bankCardNumber"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+$t('m652')"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.ifscCode"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+'IFSC Code'"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.waterFlag"
          :placeholder="$t('m563')+$t('n1465')"
          :allowClear="true"
          :options="[
            { value: '1', label: $t('yes') },
            { value: '0', label: $t('no') },
          ]"
        ></a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.kycId"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+'KYC ID'"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.newKycId"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+'KYC ID (NEW)'"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.upiId"
          class="searchstyle"
          :allowClear="true"
          :placeholder="$t('m562')+'UPI ID'"
        />
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.isQuadOrder"
          :placeholder="$t('n886')"
          :allowClear="true"
          style="font-size: 12px;"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <!-- <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.supportAmountFinishFlag"
          :placeholder="$t('n1318')"
          :allowClear="true"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col> -->
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
          class="searchstyle"
          v-model:value="query.completedBaseType"
          :placeholder="$t('n337')"
          :allowClear="true"
          :dropdown-match-select-width="false"
          :options="Object.entries(completedBaseTypeMap).map(([key, value]:[any,any]) => ({ value: key, label: value, }))"
        >
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
          v-model:value="query.isKycSellOrder"
          :placeholder="$t('m607')"
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
          :placeholder="$t('n506')"
          v-model:value="query.orderAutoFailType"
          :dropdown-match-select-width="false"
          :options="Object.entries(orderAutoFailTypeMap).map(([key, value]:[any,any]) => ({
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
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('m563')+$t('m656')"
        v-model:value="query.payType"
        :options="Object.entries(payTypeData).map(([key, value]:[any,any]) => ({ value: key, label: $t(value), }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
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
        :placeholder="$t('n150')"
        v-model:value="query.thirdRechargeFlag"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
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
        :placeholder="$t('n1164')"
        v-model:value="query.wakeUpFlag"
        >
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
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
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('m563')+$t('n316')"
        v-model:value="query.replenishmentFlag"
        :options="Object.entries(replenishmentFlagMap).map(([key, value]:[any,any]) => ({ value: key, label:value, }))"
        >
        </a-select>
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
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n572')"
        v-model:value="query.upiVerificationStatus"
        >
          <a-select-option value="0">{{ $t("yes") }}</a-select-option>
          <a-select-option value="1">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('n1395')"
        v-model:value="query.utrOccupiedFlag"
        >
          <a-select-option value="0">{{ $t("no") }}</a-select-option>
          <a-select-option value="1">{{ $t("yes") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('m563')+$t('n1447')"
        v-model:value="query.freezeFlag"
        :options="Object.entries(freezeFlagMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value), }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :dropdown-match-select-width="false"
        :placeholder="$t('m563')+$t('n1862')"
        v-model:value="query.freezeReason"
        :options="Object.entries(freezeReasonMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value), }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('m563')+$t('n2086')"
        v-model:value="query.freezeMode"
        :options="Object.entries(freezeModeMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-select
        allowClear
        class="searchstyle"
        :placeholder="$t('m563')+$t('n2087')"
        v-model:value="query.unfreezeMode"
        :options="Object.entries(unfreezeModeMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3" v-show="isShowMoreSearch">
        <a-input-group style="position: relative;top: -2px;">
          <a-input-number
            v-model:value="query.minAmount"
            class="searchstyle-group"
            :placeholder="$t('n1599')"
            />
          <span style="position: relative;top:4px"> -- </span>
          <a-input-number
            v-model:value="query.maxAmount"
            class="searchstyle-group"
            :placeholder="$t('n1600')"
            />
        </a-input-group>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd"  :title="$t('c11')" :type="1"/>
      </a-col>
      <a-col v-show="isShowMoreSearch">
        <timeRange v-model:startTime="query.replenishmentCompletionTimeStart" v-model:endTime="query.replenishmentCompletionTimeEnd"  :title="$t('n716')" :type="1"/>
      </a-col>
      <!-- <a-col  v-show="isShowMoreSearch">
        <timeRange v-model:startTime="query.paymentTimeStart" v-model:endTime="query.paymentTimeEnd"  :title="$t('l38')" :type="1"/>
      </a-col> -->
      <a-col  v-show="isShowMoreSearch">
        <timeRange v-model:startTime="query.completionTimeStart" v-model:endTime="query.completionTimeEnd"  :title="$t('publicEndTime')" :type="1"/>
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
        <a-button type="primary"  @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <ExportButton
          :query="query"
          :api="matchingOrderAdminExport"
          :enable-export-fields="true"
          permission="admin:matchingOrderAdmin:export"
          :handleQuery="
            (q: any) => {
              if (q.status) q.status = q.status.join(',');
              return q;
            }
          "
        />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:matchingOrderAdmin:export'"
          >{{ $t("export") }}</a-button
        > -->
        <a-button  @click="openDrawer">{{ $t("m741") }}</a-button>
      </a-col>
    </a-row>
    
    <div class="status">
      <div class="order-text">{{ $t("state") }}</div>
      <a-checkbox-group
        :options="
          Object.entries(matchlistStatus).filter(([key,value]:[any,any])=>key!=16).map(([key, value]:[any,any]) => ({
            value: key,
            label: $t(value),
          }))
        "
        v-model:value="query.status"
        @change="search"
      >
        <a-checkbox value="key">{{ $t("value") }}</a-checkbox>
      </a-checkbox-group>
      <!-- <a-radio-group
        :options="Object.entries(completedBaseTypeMap).map(([key, value]:[any,any]) => ({
          value: key,
          label: String(value),
        }))"
        v-model:value="query.completedBaseType"
        @click="onCompletedBaseTypeChange"
      >
      </a-radio-group> -->
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
    :scroll="{ x: '100%' ,y:getTabH+'px'}"
    :loading="loading"
    @change="handleTableChange"
    :row-key="(record: any) => JSON.stringify(record)"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'platformOrder'">
        <!-- <a-tooltip>
          <template #title>{{ record.platformOrder }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">撮合{{ record.platformOrder }}</div>
          <div style="text-overflow: ellipsis;overflow: hidden;">买入{{ record.collectionPlatformOrder }}</div>
          <div style="text-overflow: ellipsis;overflow: hidden;">卖出{{ record.paymentPlatformOrder }}</div>
        </a-tooltip> -->
          <div style="text-align: left;">{{ $t('m11') }}：{{ record.platformOrder || "-" }}
            <CopyOutlined v-if="record.platformOrder" class="copyId"  @click="$copyId(record.platformOrder)" /></div>
          <div style="text-align: left;">{{ $t('n280') }}：{{ record.matchOrder || '-' }}
            <CopyOutlined v-if="record.matchOrder" class="copyId"  @click="$copyId(record.matchOrder)" /></div>
          <div style="text-align: left;">{{ $t('n104') }}：{{ record.collectionPlatformOrder || "-" }}  
            <CopyOutlined v-if="record.collectionPlatformOrder" class="copyId"  @click="$copyId(record.collectionPlatformOrder)" /></div>
          <div style="text-align: left;">{{ $t('n100') }}：{{ record.paymentPlatformOrder || "-" }}
            <CopyOutlined v-if="record.paymentPlatformOrder" class="copyId"  @click="$copyId(record.paymentPlatformOrder)" /></div>
          <div style="text-align: left;">{{ $t('m262') }}：{{ record.collectionMerchantOrder || '-' }}
            <CopyOutlined v-if="record.collectionMerchantOrder" class="copyId"  @click="$copyId(record.collectionMerchantOrder)" /></div>
          <div style="text-align: left;">{{ $t('m263') }}：{{ record.quickWithdrawalOrderNo || '-' }}
            <CopyOutlined v-if="record.quickWithdrawalOrderNo" class="copyId"  @click="$copyId(record.quickWithdrawalOrderNo)" /></div>
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
      <template v-if="column.key === 'status'">
        <a-tag v-if="[3,4,5,6,7,8,12,13,14,15,16,17].includes(Number(record.status))" :color="[7,15].includes(Number(record.status)) ? 'green':'red'">{{ [1,2,11].includes(Number(record.status)) ? $t('n88'):$t(matchlistStatus[Number(record.status)]) }}</a-tag>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'completedBaseType'">
        <div v-if="record.completedBaseType != 0" class="toopTipStyle3">
          {{ completedBaseTypeMap[record.completedBaseType] }}
        </div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key ==='payType'">
        {{record.payType? $t(payTypeData[record.payType]):'-' }}
      </template>
      <template v-if="column.key ==='completeDuration'">
        {{ record.completeDuration ? formatTime(record.completeDuration) : '-' }}
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
      <template v-if="column.key === 'repackageAppBuyFlag'">
          {{ record.repackageAppBuyFlag == 1 ? $t('n1563') :  record.repackageAppBuyFlag == 2 ? $t('n1531') : $t('no') }}
          <a-tooltip>
            <template #title>
              {{ $t('n1713') }}：{{ record.txnId || '-' }}
              <CopyOutlined v-if="record.txnId" class="copyId"  @click="$copyId(record.txnId)" />
            </template>
            <div class="toopTipStyle2">
              {{ record.txnId || '-' }}
              <CopyOutlined v-if="record.txnId" class="copyId"  @click="$copyId(record.txnId)" />
            </div>
          </a-tooltip>
      </template>
      <!-- <template v-if="column.key === 'repackageAppBuyFlag'">
        <div style="text-align: left;">
          <div>{{ $t('n1562') }}：{{ record.repackageAppBuyFlag == 1 ? $t('n1563') :  record.repackageAppBuyFlag == 1 ? $t('n1531') : $t('n1564') }}</div>
          <div v-if="record.repackageAppBuyFlag">{{ $t('m582') }}：{{ record.repackageAppBuyBankCode || '-' }}</div>
          <div v-if="record.repackageAppBuyFlag">{{ $t('l35') }}：{{ record.repackageAppBuyPhoneNumber || '-' }}</div>
        </div>
      </template> -->
      <template v-if="column.key === 'rewardCardSellFlag'">
        <span v-if="record.rewardCardSellFlag == 1">
          {{ $t('yes')}}
          <a-button type="link" v-if="record.rewardCardId" class="copyContent" @click="goReward(record.rewardCardId)">
            {{ record.rewardCardId }}
          </a-button>
          <CopyOutlined v-if="record.rewardCardId" class="copyId"  @click="$copyId(record.rewardCardId)" />
        </span>
        <span v-else>{{ $t('no') }}</span>
        <!-- <span :style="{ color: record.rewardCardSellFlag == 1 ? 'green' : '' }">
        </span> -->
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
            UTR：{{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          <div style="color: #9d9d9d;">
            {{ record.payReference }}
          </div>
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            UTR：{{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </div>
          <div style="text-overflow: ellipsis;overflow: hidden;color: #9d9d9d;">
            {{ record.payReference }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip v-if="![2,5].includes(record.sourceType)">
          <template #title>
            <div>UPI ID：{{ record.upiId || "-" }}
              <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" /></div>
            <div>KYC ID<span v-if="record.newKycId"> (NEW)</span>：
              {{ record.newKycId || record.kycId || "-" }}
            </div>
            <div>
              {{$t('m577')}}：
              {{ record.bankCode || "-" }}
            </div>
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;text-align: left;">UPI ID：{{ record.upiId || "-" }}
            <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" /></div>
          <div style="text-overflow: ellipsis;overflow: hidden;text-align: left;">KYC ID<span v-if="record.newKycId"> (NEW)</span>：
            {{ record.newKycId || record.kycId || "-" }}
          </div>
          <div style="text-overflow: ellipsis;overflow: hidden;text-align: left;">
            {{$t('m577')}}：
            {{ record.bankCode || "-" }}
          </div>
        </a-tooltip>
        <a-tooltip v-else>
          <template #title>
            <div>
              {{$t('m581')}}：{{ record.bankName || "-" }}
            </div>
            <div>
              {{$t('n621')}}：{{ record.bankOwner || "-" }}
            </div>
            <div>
              {{$t('n622')}}：{{ record.bankCardNumber || "-" }}
            </div>
            <div>
              IFSC：{{ record.ifscCode || "-" }}
            </div>
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;text-align: left;">
            {{$t('m581')}}：{{ record.bankName || "-" }}
          </div>
          <div style="text-overflow: ellipsis;overflow: hidden;text-align: left;">
            {{$t('n621')}}：{{ record.bankOwner || "-" }}
          </div>
          <div style="text-overflow: ellipsis;overflow: hidden;text-align: left;">
            {{$t('n622')}}：{{ record.bankCardNumber || "-" }}
          </div>
          <div style="text-overflow: ellipsis;overflow: hidden;text-align: left;">
            IFSC：{{ record.ifscCode || "-" }}
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'orderType'">
        <div class="tableText">
          {{ $t('n100') }}: <span>{{ $t($getMapItem(sellOrderTypeMap,record.sellOrderType)) || '-' }}</span>
        </div>
        <div class="tableText">
          {{ $t('n104') }}: <span>{{ $t($getMapItem(buyOrderTypeMap,record.buyOrderType)) || '-' }}</span>
        </div>
      </template>
      <template v-if="column.key === 'appealFlag'">
        <a-tooltip>
          <template #title>
            <div>{{ $t('m909') +'：'+ $t($getMapItem(matchlistAppealMap,record.appealFlag) || '-') }}</div>
            <div>{{ $t('m203') +'：'}}{{ $getMapItem(displayAppealTypeMap,record.displayAppealType) || "-" }}</div>
            <div>{{ $t('n433') +'：'+ $t($getMapItem(appealTypeMap,Number(record.appealStatus)) || '-') }}</div>
          </template>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('m909') }}：
            </div>
            <div class="tableText">
              {{ $t($getMapItem(matchlistAppealMap,record.appealFlag) || '-') }}
            </div>
          </div>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('m203') }}：
            </div>
            <div class="tableText">
              {{ $getMapItem(displayAppealTypeMap,record.displayAppealType) || "-" }}
            </div>
          </div>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('n433') }}：
            </div>
            <div class="tableText">
              {{ $t($getMapItem(appealTypeMap,Number(record.appealStatus)) || '-') }}
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'collectionMemberId'">
        <div>
          {{ $t('n104') }}：
          <a-button style="padding:0;" type="link" @click="showMember(record.collectionMemberId)">{{
            record.collectionMemberId
          }}</a-button>
            <CopyOutlined v-if="record.collectionMemberId" class="copyId"  @click="$copyId(record.collectionMemberId)" />
        </div>
        <div>
          {{ $t('n100') }}：
          <a-button style="padding:0;" type="link" @click="showMember(record.paymentMemberId)">{{
            record.paymentMemberId
          }}</a-button>
            <CopyOutlined v-if="record.paymentMemberId" class="copyId"  @click="$copyId(record.paymentMemberId)" />
        </div>
      </template>
      <template v-if="column.key === 'orderSubmitAmount'">
        <div>{{ $t('m903') }}：{{ currency(record.orderSubmitAmount,false) }}</div>
        <div>{{ $t('m904') }}：{{ currency(record.orderActualAmount,false) }}</div>
        <div>{{ $t('n1317') }}：{{ record.randomAmount }}</div>
      </template>
      <template v-if="column.key === 'autoFinishFlag'">
        <span :style="{ color: record.autoFinishFlag == 1 ? 'green' : '' }">{{ record.autoFinishFlag == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <template v-if="column.key === 'sourceType'">
        <span v-if="record.sourceType">{{ $t($getMapItem(orderSourceMap,record.sourceType)) }}</span>
        <span v-else>{{ $t('n623') }}</span>
      </template>
      <template v-if="column.key === 'completedByKyc'">
        <a-tooltip>
          <template #title>
            <div>{{ $t('m905') +'：'}}{{ record.isKycSellOrder == 1 ? $t("yes") : $t("no") }}</div>
            <div>{{ $t('m906') +'：'}}{{ record.completedByKyc == 1 ? $t("yes") : $t("no") }}</div>
            <div>{{ $t('n506') +'：'}}{{ $getMapItem(orderAutoFailTypeMap,record.orderAutoFailType) || '-' }}</div>
          </template>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('m905') }}：
            </div>
            <div class="tableText">
              {{ record.isKycSellOrder == 1 ? $t("yes") : $t("no") }}
            </div>
          </div>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('m906') }}：
            </div>
            <div class="tableText">
              {{ record.completedByKyc == 1 ? $t("yes") : $t("no") }}
            </div>
          </div>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('n506') }}：
            </div>
            <div class="tableText">
              {{ $getMapItem(orderAutoFailTypeMap,record.orderAutoFailType) || '-' }}
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'collectionPlatformOrder'">
        <span :class="[1,3].includes(record.riskOrderType) ? 'windActive':''">{{ record.collectionPlatformOrder }}</span>
      </template>
      <template v-if="column.key === 'paymentPlatformOrder'">
        <span :class="[2,3].includes(record.riskOrderType) ? 'windActive':''">{{ record.paymentPlatformOrder }}</span>
      </template>
      <template v-if="column.key === 'wakeUpFlag'">
        <span :class="record.wakeUpFlag == 1 ? 'tag-green' : record.wakeUpFlag == 0 ? 'tag-red' : ''">
          {{ record.wakeUpFlag == 1 ? $t('yes') : record.wakeUpFlag == 0 ? $t('no') : '-' }}
        </span>
      </template>
      <!-- <template v-if="column.key === 'supportAmountFinishFlag'">
        <span :class="record.supportAmountFinishFlag == 1 ? 'tag-green' : record.supportAmountFinishFlag == 0 ? 'tag-red' : ''">
          {{ record.supportAmountFinishFlag == 1 ? $t('yes') : record.supportAmountFinishFlag == 0 ? $t('no') : '-' }}
        </span>
      </template> -->
      <template v-if="column.key === 'wakeUpBankCode'">
        <a-tooltip v-if="record.wakeUpBankCode">
          <template #title>{{ record.wakeUpBankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.wakeUpBankCode }}</div>
        </a-tooltip>
        <span v-else>-</span>
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
      <template v-if="column.key === 'kycAutoCompletionStatus'">
        {{
         record.kycAutoCompletionStatus != null ? $t(kycCompletion[record.kycAutoCompletionStatus]) : '-'
        }}
      </template>
      <template v-if="column.key === 'waterFlag'">
        <span :class="record.waterFlag  == 1 ? 'tag-green' : 'tag-gray'">
          {{ record.waterFlag  == 1 ? $t('yes') : $t('no') }}
        </span>
      </template>
      <template v-if="column.key === 'paymentCounterDuration'">
          {{ record.paymentCounterDuration ? formatTime(record.paymentCounterDuration) : '-' }}
      </template>
      <!-- <template v-if="column.key === 'appealStatus'">
        {{  record.appealStatus ? $t(appealTypeMap[Number(record.appealStatus)]) : '-' }}
      </template> -->
      <template v-if="column.key === 'quickOrder'">
        <div style="text-align: left;">{{ $t('m903') }}：<span :style="record.thirdRechargeFlag ? 'color:green' : 'color:red'">{{ record.thirdRechargeFlag ? $t('yes') : $t('no') }}</span></div>
        <div style="text-align: left;" class="toopTipStyle3">{{ $t('m207') }}：
          <span v-if="record.merchantMemberId">{{ record.merchantMemberId }}</span>
          <span v-else>-</span>
        </div>
      </template>
      <template v-if="column.key === 'replenishmentFlag'">
        {{ record.replenishmentFlag ? replenishmentFlagMap[record.replenishmentFlag] : "-" }}
      </template>
      <template v-if="column.key === 'replenishmentCompletionTime'">
        {{ record.replenishmentCompletionTime || "-" }}
      </template>
      <template v-if="column.key === 'freezeFlag'">
        <div class="tableText">
          <!-- 冻结过即为是：1-冻结中 2-用户解冻 3-后台解冻 -->
          <div>
            {{ $t('n1123') }}：{{ [1].includes(Number(record.freezeFlag)) ? $t('yes') : $t('no') }}
          </div>
          <div class="toopTipStyle2">
              {{ $t('n1862') }}：{{ $getMapItem(freezeReasonMap,record.freezeReason) || '-'  }}
          </div>
          <div>
            {{ $t('n2086') }}：{{ $getMapItem(freezeModeMap,record.freezeMode) || '-' }}
          </div>
          <a-tooltip>
          <template #title>
            <div>
                {{ $t('n1863') }}：{{ record.freezeRemark || '-'  }}
              </div>
          </template>
          <div>
            <div class="toopTipStyle">
                {{ $t('n1863') }}：{{ record.freezeRemark || '-'  }}
              </div>
          </div>
        </a-tooltip>
          <div>
            {{ $t('n2087') }}：{{ $getMapItem(unfreezeModeMap,record.unfreezeMode) || '-' }}
          </div>
      </div>
    </template>
      <template v-if="column.key === 'createTime'">
        <div style="text-align: left;">{{ $t('m11') }}：{{ record.createTime || "-" }}</div>
        <div style="text-align: left;">{{ $t('e9') }}：{{ record.paymentTime || "-" }}</div>
        <div style="text-align: left;">{{ $t('n81') }}：{{ record.completionTime || "-" }}</div>
      </template>
      <template v-if="column.key === 'upiVerificationStatus'">
        <span v-if="record.upiVerificationStatus == 0">{{ $t('yes') }}</span>
        <span v-if="record.upiVerificationStatus == 1">{{ $t('no') }}</span>
        <span v-if="![0,1].includes(record.upiVerificationStatus)" >-</span>
      </template>
      <template v-if="column.key === 'utrOccupiedFlag'">
        <span :class="record.utrOccupiedFlag == 1 ? 'tag-green' : record.utrOccupiedFlag == 0 ? 'tag-red' : ''">
          {{ record.utrOccupiedFlag == 1 ? $t('yes') : record.utrOccupiedFlag == 0 ? $t('no') : '-' }}
        </span>
        <a-tooltip>
          <template #title>
            <div v-if="record.occupiedUtr">
              UTR：{{ record.occupiedUtr }}
              <CopyOutlined v-if="record.occupiedUtr" class="copyId"  @click="$copyId(record.occupiedUtr)" />
            </div>
            <div v-if="record.occupiedOrderNo">
              {{ $t('l90') }}：{{ record.occupiedOrderNo  }}
              <CopyOutlined v-if="record.occupiedOrderNo" class="copyId"  @click="$copyId(record.occupiedOrderNo)" />
            </div>
          </template>
          <div>
            <div class="toopTipStyle2 tableText mt-15" v-if="record.occupiedUtr">
              UTR：{{ record.occupiedUtr  }}
              <CopyOutlined v-if="record.occupiedUtr" class="copyId"  @click="$copyId(record.occupiedUtr)" />
            </div>
            <div class="toopTipStyle2 tableText" v-if="record.occupiedOrderNo">
              {{ $t('l90') }}：{{ record.occupiedOrderNo  }}
              <CopyOutlined v-if="record.occupiedOrderNo" class="copyId"  @click="$copyId(record.occupiedOrderNo)" />
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'updateBy'">
        <a-tooltip>
          <template #title>
            <div>
              {{ $t('l48') }}：
              {{ record.updateBy || "-" }}
            </div>
            <div>
              {{ $t('n981') }}：
              {{ $getMapItem(backendOperationTypeMap,record.backendOperationType) || "-" }}
            </div>
            <div>
                {{ $t('remark') }}：
                {{ record.remark || "-" }}
            </div>
          </template>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('l48') }}：
            </div>
            <div class="tableText">
              {{ record.updateBy || "-" }}
            </div>
          </div>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('n981') }}：
            </div>
            <div class="tableText">
              {{ $getMapItem(backendOperationTypeMap,record.backendOperationType) || "-" }}
            </div>
          </div>
          <div class="toopTipStyle tableGridBox">
            <div>
              {{ $t('remark') }}：
            </div>
            <div class="tableText">
              {{ record.remark || "-" }}
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operate'">
        <!-- v-if="!['3'].includes(record.status)" -->
        <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="checkDetail(record)"
          v-permission="'admin:matchingOrderAdmin:getInfo'"
          >{{ record.showMessage ? $t("m479") : $t('b23') }}
        </a-tag>
        <div class="asseBtnLine"></div>
        <!-- 补单 -->
        <a-tag
          color="red"
          style="cursor: pointer;margin-bottom: 2px;"
          v-if="!isAddressMismatchFrozen(record) && (
          (['8','9','10','12','13'].includes(record.status) || ['3'].includes(record.status) && [0,3].includes(record.sourceType))
          && !(record.status == 12 && record.appealStatus == 1 && record.autoFinishFlag == 1 && [0,1].includes(record.replenishmentFlag))
          && [0,1].includes(record.replenishmentFlag)
          && record.isQuadOrder != 1
          && record.repackageAppBuyFlag != 2 ||
          record.repackageAppBuyFlag == 2 && record.status == '12' && record.replenishmentFlag == 0)"
          @click="manualOrder(record)"
          v-permission="'admin:matchingOrderAdmin:orderReplenishment'"
          >{{ $t("m700") }}
        </a-tag>
        <!-- 解冻 -->
        <div class="asseBtnLine"></div>
        <a-tag
          v-if="record.freezeFlag == 1"
          color="red"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="showUnfreeze(record)"
          v-permission="'admin:matchingOrderAdmin:unfreeze'"
          >{{ $t("e3") }}
        </a-tag>
        <div class="asseBtnLine"></div>
        <a-tag
          v-if="['1','2','11'].includes(record.status) && !isAddressMismatchFrozen(record)"
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="amountErrorVoucher(record)"
          v-permission="'admin:matchingOrderAdmin:incorrectVoucher'"
          >{{ $t("b29") }}
        </a-tag>
        <div class="asseBtnLine"></div>
        <a-tag
          v-if="['6'].includes(record.status) || [1,2].includes(record.appealStatus)"
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="appealDetails(record)"
          v-permission="'admin:matchingOrderAdmin:appealDetail'"
          >{{ $t("b30") }}
        </a-tag>
        <!-- 已支付 -->
        <div class="asseBtnLine"></div>
        <a-tag
          v-if="isAddressMismatchFrozen(record) ||
           ['4', '5', '6'].includes(record.status) ||
           [1,4].includes(record.buyOrderType) && ['3'].includes(record.status) && ['0'].includes(record.isQuadOrder) ||
           record.repackageAppBuyFlag == 2 && record.status == '3'"
          color="rgba(253, 164, 11, 1)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="showAppealPay(record)"
          v-permission="'admin:matchingOrderAdmin:pay'"
          >{{ $t("s11") }}
        </a-tag>
        <!-- 未支付 -->
        <div class="asseBtnLine"></div>
        <a-tag
          v-if="!isAddressMismatchFrozen(record) && (
          ([1,2,'1','2'].includes(record.sourceType) &&['3','4'].includes(record.status)) 
          || ['1','2','5','6','11'].includes(record.status)
          || record.status == '4' && record.isQuadOrder == '1'
          || [1].includes(record.buyOrderType) && ['3'].includes(record.status) && ['0'].includes(record.isQuadOrder))"
          color="rgba(253, 11, 26, 1)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="showNoPay(record)"
          v-permission="'admin:matchingOrderAdmin:nopay'"
          >{{ $t("n37") }}
        </a-tag>
        <!-- 正确金额 -->
        <div class="asseBtnLine"></div>
        <a-tag
          v-if="['1','2','11'].includes(record.status) && !isAddressMismatchFrozen(record)"
          color="rgba(253, 164, 11, 1)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="showWrongAmount(record)"
          v-permission="'admin:matchingOrderAdmin:incorrectTransfer'"
          >{{ $t("s22") }}
        </a-tag>
        <!-- 成功 -->
        <div class="asseBtnLine"></div>
        <a-tag
          color="rgba(253, 164, 11, 1)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="showSucceed(record)"
          v-if="record.status == 12 && record.appealStatus == 1  && [0,1].includes(record.replenishmentFlag) && !isAddressMismatchFrozen(record)"
          v-permission="'admin:matchingOrderAdmin:autoFailOrderAppealSuccess'"
          >{{ $t("m619") }}
        </a-tag>
        <!-- 失败 -->
        <div class="asseBtnLine"></div>
        <a-tag
          color="red"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="showFailed(record)"
          v-if="record.status == 12 && record.appealStatus == 1  && [0,1].includes(record.replenishmentFlag) && !isAddressMismatchFrozen(record)"
          v-permission="'admin:matchingOrderAdmin:autoFailOrderAppealFail'"
          >{{ $t("m618") }}
        </a-tag>
        <!-- 确认放款 -->
        <div class="asseBtnLine"></div>
        <a-tag
          color="rgba(253, 11, 26, 1)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="showConfirmPay(record)"
          v-if="record.status == 7 && record.confirmPayFlag == 1 && !isAddressMismatchFrozen(record)"
          v-permission="'admin:matchingOrderAdmin:confirmPay'"
          >{{ $t("n468") }}
        </a-tag>
        <!-- 申诉 -->
        <div class="asseBtnLine"></div>
        <a-tag
          color="rgba(29,153,215)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="showAppealMod(record)"
          v-if="!isAddressMismatchFrozen(record) && (record.buyOrderType == 4 && record.status == 5 && !record.appealLink || record.buyOrderType == 4 && record.status == 12 && record.buyAppealSupported && !record.appealLink)"
          v-permission="'admin:matchPoolAdmin:createAppealLink'"
          >{{ $t("n948") }}
        </a-tag>
        <!-- 申诉链接 -->
        <div class="asseBtnLine"></div>
        <a-tag
          color="rgba(29,153,215)"
          style="cursor: pointer;margin-bottom: 2px;"
          @click="showAppealLinkMod(record)"
          v-if="record.buyOrderType == 4 && record.appealLink && record.buyAppealSupported"
          >{{ $t("n949") }}
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
  <!-- 查看 -->
  <a-modal
    v-model:open="openDetail"
    :title="$t('n725')"
    wrap-class-name="full-modal"
    width="100%"
    @cancel="closeDetail"
    :footer="null"
  >
    <assembleDetail v-if="openDetail" 
      :detailData="detailData"
      :assembleRecord="assembleRecord"
    />
  </a-modal>
  <a-modal
    v-model:open="amountErrorDialog"
    :title="$t('b29')"
    width="70%"
    :footer="null"
  >
    <errorVoucherModal />
  </a-modal>
  <!-- 补单 -->
  <a-modal
    v-model:open="manualOpen"
    :title="$t('m700')"
    width="700px"
    :footer="null"
    @cancel="closeManual"
  >
    <a-form
      :form="manualFrom"
      :name="manualFrom"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-item
        :label="$t('l34')"
        :required="true"
      >
        <a-input-number
          v-trim
          v-model:value="manualFrom.amount"
          :min="100"
          :max="mamOrderSubmitAmount"
          class="searchstyle"
          :placeholder="$t('m562')+ $t('l34')"
        />
        <div class="modal-tipMsg">
          {{ $t("n512") }}
          <span class="manual-amount-tip-highlight">{{ $t("n1481") }}</span>
        </div>
      </a-form-item>
      <a-form-item
        label="UTR"
        :required="true"
      >
        <a-input
          v-trim
          v-model:value="manualFrom.utr"
          :maxlength="12"
          :placeholder="$t('m562')+ ' UTR'"
        />
        <div class="modal-tipMsg">{{ $t("n187") }}</div>
      </a-form-item>
      <a-form-item
        :label="$t('n1396')"
      >
        <a-radio-group v-model:value="manualFrom.delayFinish" :style="manualFrom.delayFinish == 1 ? 'padding-top:5px;' : ''">
          <a-radio :value="1">{{ $t("yes") }}</a-radio>
          <a-radio :value="0">{{ $t("no") }}</a-radio>
        </a-radio-group>
        <a-select
          v-if="manualFrom.delayFinish == 1"
          v-model:value="manualFrom.delayType"
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
        <a-radio-group v-model:value="manualFrom.disableBuy" :style="manualFrom.disableBuy == 1 ? 'padding-top:5px;' : ''">
          <a-radio :value="1">{{ $t("yes") }}</a-radio>
          <a-radio :value="0">{{ $t("no") }}</a-radio>
        </a-radio-group>
        <a-select
          v-if="manualFrom.disableBuy == 1"
          v-model:value="manualFrom.disableLimitType"
          style="margin-top:10px;"
          :placeholder="$t('m563')+ $t('n1398')"
          :options="Object.entries(disableLimitTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
          >
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 9, span: 18 }">
        <a-button @click="closeManual">{{
          $t('b10')
        }}</a-button>
        <a-button
         style="margin-left: 10px"
          type="primary"
          :loading="loading"
          @click="manualOrderSubmit"
          >{{ $t('publicSubmit') }}</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 继续补单 -->
  <a-modal
    v-model:open="continueManualOpen"
    width="500px"
    :footer="null"
    @cancel="closeContinueManual"
  >
    <template #title>
      <div style="text-align: center; font-weight: bold;">{{ continueManualText }}</div>
    </template>
    <div style="text-align: center;">
      <a-button @click="closeContinueManual">{{ $t("b10") }}</a-button>
      <a-button type="primary" class="ml-10" @click="manualOrderSubmit">{{ $t("b9") }}</a-button>
    </div>
  </a-modal>
  <!-- 补单成功解冻余额不足弹窗 -->
  <a-modal
    v-model:open="manualPopModal"
    width="500px"
    :footer="null"
    @cancel="manualPopModal = false"
  >
    <h2>{{ $t('n1463') }}</h2>
    <div style="text-align: center;">
      <a-button type="primary" @click="manualPopModal = false">{{ $t("n1464") }}</a-button>
    </div>
  </a-modal>
  <!-- 解冻 -->
  <a-modal
    v-model:open="unfreezeDialog"
    :title="$t('e3')"
    width="500px"
    :footer="null"
    @cancel="closeUnfreeze"
  >
    <a-form
      ref="formRef"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-item
        :label="$t('remark')"
      >
        <a-textarea
          v-model:value="unfreezeForm.remark"
          :placeholder="$t('remarks')"
          :maxlength="200"
          :rows="4"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 10, span: 18 }">
        <a-button type="primary" :loading="loading"
          @click="unfreezeOrder"
          >{{ $t('b9') }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 申诉详情 -->
  <a-modal
    v-model:open="appealDialog"
    :title="null"
    wrap-class-name="full-modal"
    width="100%"
    :footer="null"
    @cancel="closeAppealInfo"
  >
    <assembleAppealDetails v-if="appealDialog" :assembleRecord="assembleRecord" :pageType="2" />
  </a-modal>

  <a-modal v-model:open="addDialog" :title="$t('paid')" :footer="null">
    <a-divider />
    <div v-if='orderSourceType == 0'>
      <p>{{ $t("n46") }}</p>
      <a-input-number
        v-model:value="getId.orderActualAmount"
        :min="0"
        :precision="2"
        class="searchstyle"
        :placeholder="$t('p33')"
      />
      <p v-if="!getId.orderActualAmount" style="color: rgb(255, 0, 0)">
        {{ $t("p33") }}
      </p>
      <p
        v-else-if="getId.orderActualAmount > orderAmount"
        style="color: rgb(255, 0, 0)"
      >
        {{ $t("e12") }}
      </p>
    </div>
    <br />
    <div>
      <p>{{ $t("m826") }}</p>
      <a-input v-trim
        v-model:value="getId.utr"
        class="searchstyle"
        maxLength="12"
        :placeholder="$t('m562')+ $t('m826')"
      />
      <p v-if="!getId.utr" style="color: rgb(255, 0, 0)">
        {{ $t('m562')+ $t('m826') }}
      </p>
    </div>
    <br />
    <div>
      <p>{{ $t("m827") }}</p>
        <Upload v-if="addDialog" v-model:value="getId.voucher"  @startUpload="startUpload"  @finishUpload="finishUpload"/>
    </div>
    <br />
    <div>
      <p>{{ $t("remark") }}</p>
      <a-textarea
        v-model:value="getId.remark"
        :placeholder="$t('remarks')"
        :rows="4"
      />
    </div>
    <div class="paidTip">
      <div>{{ $t("m828") }}：</div>
      <div>1 {{ $t("m829") }}</div>
      <div>2 {{ $t("m830") }}</div>
      <div>3 {{ $t("m831") }}</div>
    </div>
    <br />
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button
        type="primary"
        :loading="isClick"
        :disabled="(!getId.orderActualAmount && orderSourceType == 0) || !getId.utr"
        @click="appealPay(getId.id)"
        >{{ $t("b28") }}</a-button
      >
      <a-button style="margin-left: 10px" @click="closedalog">{{
        $t("b10")
      }}</a-button>
    </div>
  </a-modal>
  <a-modal v-model:open="wrongAmount" :title="$t('s23')" :footer="null">
    <a-divider />
    <div>
      <p>{{ $t("n43") }}</p>
      <a-input-number
        v-model:value="getId.orderActualAmount"
        :min="0"
        :precision="2"
        class="searchstyle"
        :placeholder="$t('p33')"
      />
      <p v-if="!getId.orderActualAmount" class="redText">
        {{ $t("p33") }}
      </p>
    </div>
    <br />
    <div>
      <p>{{ $t("remark") }}</p>
      <a-textarea
        v-model:value="getId.remark"
        :placeholder="$t('remarks')"
        :rows="4"
      />
      <p v-if="!getId.remark" class="redText">
        {{ $t("p42") }}
      </p>
    </div>
    <br />
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button
        type="primary"
        :loading="loading"
        :disabled="!getId.orderActualAmount || !getId.remark"
        @click="wrongAmountTranfer(getId.id)"
        >{{ $t("b28") }}</a-button
      >
      <a-button style="margin-left: 10px" @click="closedalog">{{
        $t("b10")
      }}</a-button>
    </div>
  </a-modal>
  <a-modal v-model:open="unpaid" :title="$t('n37')" :footer="null">
    <a-divider />
    <div>
      <p>{{ $t("remark") }}</p>
      <a-textarea
        v-model:value="getId.remark"
        :placeholder="$t('remarks')"
        :rows="4"
      />
    </div>
    <br />
    <div>
      <p>{{ $t("t25") }}</p>
      <p>{{ $t("t26") }}</p>
      <p>{{ $t("t27") }}</p>
    </div>
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button type="primary" :loading="loading" @click="matchListUnPaid(getId.id)">{{
        $t("b28")
      }}</a-button>
      <a-button style="margin-left: 10px" @click="closedalog">{{
        $t("b10")
      }}</a-button>
    </div>
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
  <!-- KYC连接状态 -->
  <!-- 成功 -->
  <a-modal v-model:open="succeedDialog"
    :title="$t('m619')"
    :footer="null"
    @cancel="succeedCancel"
    >
    <a-divider />
    <div>
      <p>{{ $t("m826") }}</p>
      <a-input
        v-model:value="succeedForm.utr"
        class="searchstyle"
        :placeholder="$t('m826')"
      />
    </div>
    <div>
      <p>{{ $t("remark") }}</p>
      <a-textarea
        v-model:value="succeedForm.remark"
        :placeholder="$t('remarks')"
        :rows="4"
      />
      <p class="redText"> {{ $t("m828") }}: </p>
      <p class="redText">1 {{ $t("n429") }}</p>
      <p class="redText">2 {{ $t("n430") }}</p>
    </div>
    <br />
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button type="primary" :loading="loading" :disabled="!succeedForm.utr" @click="succeedOrder()">{{
        $t("b28")
      }}</a-button>
      <a-button style="margin-left: 10px" @click="succeedCancel">{{
        $t("b10")
      }}</a-button>
    </div>
  </a-modal>
  <!-- 失败 -->
  <a-modal v-model:open="failedDialog" :title="$t('m618')" :footer="null" @cancel="failedCancel">
    <a-divider />
    <div>
      <p>{{ $t("remark") }}</p>
      <a-textarea
        v-model:value="failedForm.remark"
        :placeholder="$t('remarks')"
        :rows="4"
      />
      <p>
        {{ $t("n431") }}
      </p>
      <p>{{ $t("n432") }}</p>
    </div>
    <br />
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button type="primary" :loading="loading" @click="failedOrder()">{{
        $t("b28")
      }}</a-button>
      <a-button style="margin-left: 10px" @click="failedCancel">{{
        $t("b10")
      }}</a-button>
    </div>
  </a-modal>
  <!-- 确认放款 -->
   <a-modal v-model:open="showConfirmMod" :title="$t('n468')" :footer="null" @cancel="cancelConfirmPay">
    <a-divider />
    <p class="confirmCon">{{ $t('n469',{
      a:' ' + confirmForm.amount + ' INR，',
      b:' ' + confirmForm.actualAmount + ' INR',
      }) }}</p>
    <p class="confirmCon">{{ $t('n470',{
      id:confirmForm.memberId + ' ',
      amount:' ' + confirmForm.actualAmount + ' INR',
    }) }}</p>
    <br />
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button type="primary" :loading="loading" @click="confirmPayOrder()">{{
        $t("b28")
      }}</a-button>
      <a-button style="margin-left: 10px" @click="cancelConfirmPay">{{
        $t("b10")
      }}</a-button>
    </div>
  </a-modal>
  <!-- 申诉 -->
    <a-modal v-model:open="appealMod" :footer="null" 
    @cancel="cancelAppeal">
      <template #title>
        <div style="text-align: center;">
          {{ $t('n947') }}
        </div>
      </template>
      <br />
      <div style="text-align: center;">
        <a-button :loading="loading" @click="cancelAppeal">{{
          $t("b10")
        }}</a-button>
        <a-button type="primary" style="margin-left: 10px" @click="appealOrder()">{{
          $t("n946")
        }}</a-button>
      </div>
    </a-modal>
    <!-- 申诉链接 -->
    <a-modal v-model:open="appealLinkMod" :footer="null" 
    @cancel="cancelAppealLink">
      <template #title>
        <div style="text-align: center;">
          {{ $t('n945') }}
        </div>
      </template>
      <br />
      <div class="appealLinkContent">
        {{ appealCopyLink }}
        <CopyOutlined v-if="appealCopyLink" class="copyId"  @click="$copyId(appealCopyLink)" />
      </div>
      <br />
      <div style="text-align: center;">
        <a-button type="primary" @click="$copyId(appealCopyLink)">{{
          $t("m217")
        }}</a-button>
      </div>
    </a-modal>
</template>
<script lang="ts" setup>
// import dayjs from "dayjs";
import { onMounted, ref, h, computed, onUnmounted,watch, watchEffect } from "vue";
import { FastForwardFilled, SearchOutlined, ArrowDownOutlined, ArrowUpOutlined, ConsoleSqlOutlined } from "@ant-design/icons-vue";
import {
  getMatchListData,
  matchListPay,
  matchListNoPay,
  getWrongAmountTransfer,
  matchOrderManualOrderReplenishment,
  matchOrderAutoFailOrderAppealSuccess,
  matchOrderAutoFailOrderAppealFail,
  matchOrderConfirmPay,
  matchOrderCreateAppealLink,
  matchOrderCreateUnfreeze,
} from "@/api/order.api";
import assembleDetail from "@/components/orderManagement/assembleDetail.vue";
import errorVoucherModal from "@/components/orderManagement/errorVoucherDetail.vue";
import assembleAppealDetails from "@/components/orderManagement/assembleAppealDetails.vue";
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import { matchlistStatus } from "@/utils/publicData";
import { currency, formatTime, thousand, replaceEmptyWithUndefined } from "@/utils/index";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { useRouter } from "vue-router";
import { matchingOrderAdminExport } from "@/api/export";
import {  windControl, kycCompletion, matchlistAppealMap,orderSourceMap,delayTypeMap,disableLimitTypeMap,isAutoSellFlag,getAutoSellFlagLabel,getAutoSellFlagOptions } from "@/utils/publicData";
import Upload from '@/components/Upload/index.vue'
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTableColumnDrawer } from "@/hooks/index";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import PublicColumnFilter from "@/components/PublicColumnFilter.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { payTypeData, buyOrderTypeMap, sellOrderTypeMap } from "@/utils/publicData";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import Bus from "@/utils/bus";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { usePageCash } from "@/hooks/usePageCash.hook"; 
import { Item } from "ant-design-vue/es/menu";
const { pageCash,setPageCash,getPageCash,clearPageCash } = usePageCash();
const resultData = ref({});
const isUseCash = ref(false);
onBeforeRouteLeave(() => {
  setPageCash(route.fullPath.split('?')[0], query.value, resultData.value, extendData.value);
})
const { getTabH } = useTabHeight();
const route = useRoute();
const router = useRouter()
const { t } = useI18n();
const isShowMoreSearch = ref(false);
const showMoreSearch = () => {
  isShowMoreSearch.value = !isShowMoreSearch.value;
  setTimeout(() => {
    getTabH.value = useTabHeight().getTabH.value;
  },100)
}
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
// const dataSource = ref<any>([]);
// const extendData = ref<any>({});
// const loading = ref(false);
const addDialog = ref(false);
const unpaid = ref(false);
const detailModel = ref(false);
const isManualReviewClick = ref(true);
const appealTypeMap = <any>{
  1: 'n88',// 申诉中
  2: 's16',// 申诉成功
  3: 's17',// 申诉失败
}
const displayAppealTypeMap = <any>{
  1: t('m336'),// 未到账
  2: t('n91'),// 金额错误
  3: t('n87'),// 确认超时
  4: t('m952'),// 买入自动申诉
  5: t('m953'),// 卖出自动申诉
  6: t('n449'),// 买入失败申诉
  7: t('n1184'),// KYC验证码发送失败
}
const backendOperationTypeMap = <any>{
  0: t('n1350'),// 其它
  1: t('s11'),// 已支付
  2: t('n37'),// 未支付
  3: t('m700'),// 补单
  4: t('n1351'),// 失败订单申诉成功
  5: t('n1352'),// 失败订单申诉失败
  6: t('n468'),// 确认放款
  7: t('s16'),// 申诉成功
  8: t('s17'),// 申诉失败
}
const orderAutoFailTypeMap = <any>{
  1: t('n1353'),// 卖出申诉拉取N次流水完单
  2: t('n1354'),// 未达最低上分金额完单
  3: t('n1355'),// 超时拉取N次流水完单
  4: t('n1356'),// 买入申诉拉取N次流水完单
  5: t('n1357'),// 快捷UPI/BANK拉取N次流水完单
  6: t('n1358'),// 快捷UPI/BANK断连到时完单
  // 7: t('n1359'),// 快捷UPI/BANK超时未连接KYC完单
  // 8: t('n1363'),// 连接非成功完成，自动失败订单
  9: t('n1360'),// 卖家恶意占用UTR完单
  10: t('n1361'),// 超时N分钟失败冻结
  11: t('n1365'),// 快提KYC断连超时完单->pending流水失败申诉中订单并冻结
  12: t('n2093'),// 买入快捷BANK订单收款地址不符
}
const freezeFlagMap = <any>{
  0: t('n1708'),// 未冻结
  1: t('n1103'),// 已冻结
  2: t('n1709'),// 用户解冻
  3: t('n1711'),// 系统解冻
}
const freezeReasonMap = <any>{
  1: t('n1864'),// 自动失败冻结
  // 2: t('n1865'),// 金额不符冻结
  3: t('n1866'),// 失败申诉pending流水冻结
  4: t('n1867'),// 常规金额完单冻结
  5: t('n1868'),// UTR占用冻结
  6: t('n2091'),// 收款地址不符
  7: t('n2097'),// moneyView流水无法解密
}
const freezeModeMap = <any>{
  1: t('n1583'),// 账户余额
  2: t('n2088'),// 放款订单
}
const unfreezeModeMap = <any>{
  1: t('n2089'),// 人工
  2: t('n2090'),// 系统
}
// 收款地址不符冻结中的订单，操作类按钮只保留已支付(/pay)和解冻；查看、申诉详情、申诉链接照常显示
const isAddressMismatchFrozen = (record: any) => record.freezeFlag == 1 && record.freezeMode == 2;
const detailId = ref({
  id: 0,
  memberId: 0,
});
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      orderSubmitAmount: [
        { text: t('m903'), value: extendData.value.orderSubmitAmountPageTotal },
        { text: t('m904'), value: extendData.value.orderActualAmountPageTotal },
        { text: t('n1317'), value: extendData.value.randomAmountPageTotal }
      ],
    },
  },
  {
    label: t("m55"),
    fields: {
      orderSubmitAmount: [
        { text: t('m903'), value: extendData.value.orderSubmitAmountTotal },
        { text: t('m904'), value: extendData.value.orderActualAmountTotal },
        { text: t('n1317'), value: extendData.value.randomAmountTotal }
      ],
    },
  },
]);
interface Query {
  asc: boolean;
  column: string;
  collectionPlatformOrder: any;
  completionTimeEnd: any;
  completionTimeStart: string;
  createTimeEnd: string | null;
  createTimeStart: string | null;
  platformOrder?: any;
  collectionMerchantOrder?: string;
  pageNo: number;
  pageSize: number;
  paymentPlatformOrder?: any;
  paymentTimeEnd?: string;
  paymentTimeStart?: string;
  status: any[];
  collectionMemberId?: number | undefined;
  paymentMemberId?: number | undefined;
  riskTag?: string | undefined;
  payType?: number | undefined;
  isQuadOrder?: number | undefined;
  quadOrder?: number | undefined;
  utr?: string | undefined;
  kycId?:string|undefined,
  newKycId?:string|undefined,
  completedByKyc?:number|undefined,
  isKycSellOrder?:number|undefined,
  thirdRechargeFlag?:number|undefined,
  merchantMemberId?:number|undefined,
  replenishmentFlag?:number|undefined,
  matchOrder?:number|undefined,
  upiId?:string|undefined,
  appealFlag?:number|undefined,
  completedBaseType?:number|undefined,
  appealStatus?:number|undefined,
  buyOrderType?:number|undefined,
  sellOrderType?:number|undefined,
  upiVerificationStatus?:number|undefined,
  sourceType?:number|undefined,
  quickWithdrawalOrderNo?:string|undefined,
  replenishmentCompletionTimeStart?: string;
  replenishmentCompletionTimeEnd?: string;
  rewardCardSellFlag?: any;
  rewardCardId?: any;
  wakeUpFlag: any;
  // supportAmountFinishFlag: any;
  orderAutoFailType: any;
  utrOccupiedFlag: any;
  waterFlag: any;
  repackageAppBuyFlag: any;
  autoSellFlag: any,
  minAmount: any,
  maxAmount: any,
  bankCardNumber: any,
  ifscCode: any,
  freezeFlag: any,
  freezeReason: any,
  freezeMode: any,
  unfreezeMode: any,
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
  column: "",
  collectionPlatformOrder: route.query.recharge || "",
  completionTimeEnd: "",
  completionTimeStart: "",
  createTimeEnd: route.query.recharge || route.query.withdraw  || route.query.platformOrder ? '' :endIndiaTime,
  createTimeStart: route.query.recharge || route.query.withdraw || route.query.platformOrder ? '' :startIndiaTime,
  platformOrder: route.query.platformOrder || undefined,
  collectionMerchantOrder: undefined,
  pageNo: 1,
  pageSize: 10,
  paymentPlatformOrder: route.query.withdraw || "",
  paymentTimeEnd: "",
  paymentTimeStart: "",
  status: [],
  collectionMemberId: undefined,
  paymentMemberId: undefined,
  riskTag: undefined,
  payType: undefined,
  isQuadOrder: undefined,
  quadOrder: undefined,
  utr: undefined,
  kycId:undefined,
  newKycId: undefined,
  completedByKyc: undefined,
  isKycSellOrder: undefined,
  thirdRechargeFlag: undefined,
  merchantMemberId: undefined,
  replenishmentFlag: undefined,
  matchOrder: undefined,
  upiId: undefined,
  appealFlag: undefined,
  completedBaseType: undefined,
  appealStatus: undefined,
  buyOrderType: undefined,
  sellOrderType: undefined,
  // randomCode: undefined,
  upiVerificationStatus: undefined,
  sourceType: undefined,
  quickWithdrawalOrderNo: undefined,
  replenishmentCompletionTimeStart: '',
  replenishmentCompletionTimeEnd: '',
  rewardCardSellFlag: undefined,
  rewardCardId: undefined,
  wakeUpFlag: undefined,
  // supportAmountFinishFlag: undefined,
  orderAutoFailType: undefined,
  utrOccupiedFlag: undefined,
  waterFlag: undefined,
  autoSellFlag: undefined,
  repackageAppBuyFlag: undefined,
  minAmount: undefined,
  maxAmount: undefined,
  bankCardNumber: undefined,
  ifscCode: undefined,
  freezeFlag: undefined,
  freezeReason: undefined,
  freezeMode: undefined,
  unfreezeMode: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});

const replenishmentFlagMap = <any>{
  0: t("n312"),//未补单
  1: t("n314"),//补提UTR(无流水)
  2: t("n315"),//补提UTR(有流水)
  3: t("n313"),//已补单
  4: t("n450"),//申诉已补单
  5: t("n1476"),//延时补单
};
const completedBaseTypeMap= <any>{
  0: t("l80"),//其他
  1: t("n338"),//基于utr完成
  2: t("n339"),//基于tid完成
  3: t("n1326"),//基于金额完单
  4: t("n1408"),// UTR填错订单校正完成
  5: t("n1409"),// 疑似UTR填错自动完单
  6: t("n1557"),// 自动交易完单
  7: t("n1591"),// 流水交易ID
  8: t("n1957"), // 常规金额完单-1流多单
  9: t("n1958"), // 常规金额完单-1流1单
  // 10: t("n1959"), // 常规金额完单-多流多单
};

const now = ref(0)
let timer: any = null;

// 自动卖出搜索下拉选项，只在语言切换时重建
const autoSellFlagOptions = computed(getAutoSellFlagOptions);
const columns:any = <any>[
  {
    title: t("e47"),
    align: "center",
    dataIndex: "index",
    key: "index",
    width: 110,
    customRender: ({ index }: any) => index + 1,
  },
  {
    title: t("l90"),
    dataIndex: "platformOrder",
    key: "platformOrder",
    exportFields: [
      "platformOrder",
      "matchOrder",
      "collectionPlatformOrder",
      "paymentPlatformOrder",
      "collectionMerchantOrder",
      "quickWithdrawalOrderNo",
    ],
    align: "center",
    isRequired: true,
    width: 280,
  },
  {
    title: t("c9"),
    dataIndex: "collectionMemberId",
    key: "collectionMemberId",
    exportFields: ["collectionMemberId", "paymentMemberId"],
    isRequired: true,
    align: "center",
    width: 150,
  },
  // {
  //   title: t("p47"),
  //   dataIndex: "collectionPlatformOrder",
  //   key: "collectionPlatformOrder",
  //   align: "center",
  //   width: 200,
  // },
  // {
  //   title: t("m150"),
  //   dataIndex: "paymentMemberId",
  //   key: "paymentMemberId",
  //   align: "center",
  //   width: 130,
  // },
  // {
  //   title: t("p48"),
  //   dataIndex: "paymentPlatformOrder",
  //   key: "paymentPlatformOrder",
  //   align: "center",
  //   width: 220,
  // },
  // {
  //   title: t('m656'),
  //   dataIndex: "payType",
  //   key: "payType",
  //   align: "center",
  //   width: 220,
  // },
  {
    title: t("m374"),
    dataIndex: "orderSubmitAmount",
    key: "orderSubmitAmount",
    exportFields: ["orderSubmitAmount", "orderActualAmount", "randomAmount"],
    isRequired: true,
    align: "center",
    width: 220,
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
  //   title: t("n43"),
  //   dataIndex: "orderActualAmount",
  //   key: "orderActualAmount",
  //   isRequired: true,
  //   align: "center",
  //   width: 150,
  // },
  {
    title: t("m36"),
    dataIndex: "upiId",
    key: "upiId",
    exportFields: [
      "upiId",
      "kycId",
      "newKycId",
      "bankCode",
      "bankName",
      "bankOwner",
      "bankCardNumber",
      "ifscCode",
    ],
    align: "center",
    width: 200,
  },
  {
    title: t("b27"),
    dataIndex: "orderType",
    key: "orderType",
    exportFields: ["sellOrderType", "buyOrderType"],
    align: "center",
    width: 200,
  },
  {
    title: t("n149"),
    dataIndex: "quickOrder",
    key: "quickOrder",
    exportFields: ["thirdRechargeFlag", "merchantMemberId"],
    align: "center",
    width: 200,
  },
  {
    title: t("n1530"),
    dataIndex: "autoSellFlag",
    key: "autoSellFlag",
    align: "center",
    width: 140,
  },
  {
    title: t("n1531"),
    dataIndex: "repackageAppBuyFlag",
    key: "repackageAppBuyFlag",
    align: "center",
    width: 240,
  },
  // {
  //   title: t("n1565"),
  //   dataIndex: "repackageAppBuyFlag",
  //   key: "repackageAppBuyFlag",
  //   align: "center",
  //   exportFields: ["repackageAppBuyFlag", "repackageAppBuyBankCode", "repackageAppBuyPhoneNumber"],
  //   width: 200,
  // },
  {
    title: t("n948"),
    dataIndex: "appealFlag",
    key: "appealFlag",
    exportFields: ["appealFlag", "displayAppealType", "appealStatus"],
    align: "center",
    width: 230,
  },
  {
    title: "UTR",
    dataIndex: "utr",
    key: "utr",
    exportFields: ["utr", "payReference"],
    align: "center",
    width: 150,
  },
  {
    title: t("n1465"),
    dataIndex: "waterFlag",
    key: "waterFlag",
    align: "center",
    width: 140,
  },
  {
    title: t("n195"),
    dataIndex: "paymentCounterDuration",
    key: "paymentCounterDuration",
    align: "center",
    width: 180,
  },
  // {
  //   title: t("n433"),
  //   dataIndex: "appealStatus",
  //   key: "appealStatus",
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
  //   title: t("m620"),
  //   dataIndex: "kycAutoCompletionStatus",
  //   key: "kycAutoCompletionStatus",
  //   align: "center",
  //   width: 180,
  // },
  // {
  //   title: t("n427"),
  //   dataIndex: "autoFinishFlag",
  //   key: "autoFinishFlag",
  //   align: "center",
  //   width: 160,
  // },
  // {
  //   title: t("n1315")+'?',
  //   dataIndex: "supportAmountFinishFlag",
  //   key: "supportAmountFinishFlag",
  //   align: "center",
  //   width: 120,
  // },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 150,
  },
  {
    title: t("n337"),
    dataIndex: "completedBaseType",
    key: "completedBaseType",
    align: "center",
    width: 200,
  },
  {
    title: t("m607"),
    dataIndex: "completedByKyc",
    key: "completedByKyc",
    exportFields: ["isKycSellOrder", "completedByKyc", "orderAutoFailType"],
    align: "center",
    width: 160,
  },
  // {
  //   title: t("m607"),
  //   dataIndex: "isKycSellOrder",
  //   key: "isKycSellOrder",
  //   align: "center",
  //   width: 130,
  // },
  // {
  //   title: t('m476'),
  //   dataIndex: "auditSeconds",
  //   key: "auditSeconds",
  //   align: "center",
  //   width: 150,
  // },
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
  // {
  //   title: t("m674"),
  //   dataIndex: "quadOrderChannel",
  //   key: "quadOrderChannel",
  //   align: "center",
  //   isRequired: true,
  //   width: 130,
  // },
  {
    title: t("n864"),
    dataIndex: "quadOrder",
    key: "quadOrder",
    align: "center",
    width: 220,
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
    title: t("n1349"),
    dataIndex: "completeDuration",
    key: "completeDuration",
    align: "center",
    width: 140,
  },
  // {
  //   title: t('m476'),
  //   dataIndex: "auditSeconds",
  //   key: "auditSeconds",
  //   width: 150,
  //   align: "center",
  //   customRender: ({ record }: { record: Record<string, any> }) => {
  //     if (!record.auditSeconds) {
  //       return '-';
  //     }
  //     const remaining = Math.floor(record.auditSeconds) - now.value
  //     if (remaining <= 0) {
  //       record.showMessage = false
  //       return t('m540');
  //     }else{
  //       let hours: any = Math.floor(remaining / 3600);
  //       let minutes: any = Math.floor((remaining % 3600) / 60);
  //       let seconds: any = remaining % 60;
  //       if (hours < 10) {
  //         hours = "0" + hours;
  //       }
  //       if (minutes < 10) {
  //         minutes = "0" + minutes;
  //       }
  //       if (seconds < 10) {
  //         seconds = "0" + seconds;
  //       }
  //       return `${hours} : ${minutes} : ${seconds} `
  //     }
  //   },
  // },
  {
    title: t("m435"),
    dataIndex: "riskTag",
    key: "riskTag",
    align: "center",
    width: 150,
  },
  {
    title: t("n316"),
    dataIndex: "replenishmentFlag",
    key: "replenishmentFlag",
    align: "center",
    width: 160,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n716")),
    dataIndex: "replenishmentCompletionTime",
    key: "replenishmentCompletionTime",
    align: "center",
    width: 140,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n572")),
    dataIndex: "upiVerificationStatus",
    key: "upiVerificationStatus",
    align: "center",
    width: 130,
  },
  {
    title: () => h('div', { class:'toopTipStyle2' }, t("n1395")),
    dataIndex: "utrOccupiedFlag",
    key: "utrOccupiedFlag",
    exportFields: ["utrOccupiedFlag", "occupiedUtr", "occupiedOrderNo"],
    align: "center",
    width: 160,
  },
  {
    title: t("n2092"),
    dataIndex: "freezeFlag",
    key: "freezeFlag",
    exportFields: ["freezeFlag", "freezeReason", "freezeMode", "freezeRemark", "unFreezeFlag"],
    align: "center",
    width: 200,
  },
  {
    title: t("m514"),
    dataIndex: "createTime",
    key: "createTime",
    exportFields: ["createTime", "paymentTime", "completionTime"],
    align: "center",
    width: 230,
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    exportFields: ["updateBy", "backendOperationType", "remark"],
    align: "center",
    width: 230,
  },
  // {
  //   title: t("l38"),
  //   dataIndex: "paymentTime",
  //   key: "paymentTime",
  //   align: "center",
  //   width: 180,
  // },
  // {
  //   title: t("publicEndTime"),
  //   dataIndex: "completionTime",
  //   key: "completionTime",
  //   align: "center",
  //   width: 180,
  // },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    width: 120,
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
//   pageSize: 10,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const getId = ref({
  id: 0,
  orderActualAmount: undefined,
  remark: "",
  utr: undefined,
  voucher: undefined,
});
const orderSourceType = ref(0);
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
    status: q.status?.length ? q.status.join(",") : undefined,
  }),
  api: getMatchListData,
  defaultPageSize: 10,
  filterRules: [
    { key: "sourceType" },
    { key: "wakeUpFlag", validValues: ["0", "1"] },
  ],
  afterFetch: (data) =>
    data.map((item: any) => {
      // item.orderActualAmount = currency(item.orderActualAmount, false);
      // item.orderSubmitAmount = currency(item.orderSubmitAmount, false);
      // item.auditSeconds = Math.random()*7201;
      // item.showMessage=true;
      // if(item.auditSeconds && item.auditSeconds != 0){
      //   if( item.status == '4' || item.status == '5'){
      //     item.showMessage=true;
      //   }else{
      //     item.showMessage=false;
      //   }
      // }else{
      //   item.showMessage=false;
      // }
      return item;
    }),
  afterGetDataFunc: async () => {
    resultData.value = response.value;
  },
});
watchEffect(() => {
  // if (dataSource.value.some((item: any) => item.auditSeconds > 0)) {
  //   now.value = 0;
  //   timer = setInterval(() => {
  //     now.value += 1
  //   }, 1000)
  // } else {
  //   timer = null;
  // }
  if(route.query.refresh && detailModel.value ){
    initPage();
  }
});
const initPage = () => {
  detailModel.value = false;
  clearSelected();
  query.value.createTimeEnd = '';
  query.value.createTimeStart = '';
  query.value.paymentPlatformOrder = route.query.withdraw;
  query.value.asc = false;
  query.value.column = '';
  query.value.pageNo = 1;
  query.value.pageSize = 10;
  query.value.firstPage = true;
  query.value.lastPage = false;
  getList();
};
let lastValue: any = undefined

const onCompletedBaseTypeChange = (e: any) => {
  const cur = e.target.value
  if (cur == lastValue) {
    query.value.completedBaseType = undefined
    lastValue = undefined
  } else {
    lastValue = cur
  }
}

// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async () => {
//   clearInterval(timer);
//   loading.value = true;
//   // let status = '';
//   // if(query.value.status.length>0 && typeof query.value.status != 'string'){
//   //   status = query.value.status.join(",");
//   // }else if(query.value.status.length == 0 && typeof query.value.status != 'string'){
//   //   status = '';
//   // }
  
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
//   pagination.value.pageSize = query.value.pageSize;
//   let queryS = replaceEmptyWithUndefined(JSON.parse(JSON.stringify(query.value)));
//   const res:any = await getMatchListData(Object.assign(queryS, { status: query.value.status ? query.value.status.join(',') : undefined })).catch((err)=>{loading.value = false;});
//   if (res && res.code === "1") {
//     dataSource.value = res.data.map((item: any) => {
//       item.orderActualAmount = currency(item.orderActualAmount, false);
//       item.orderSubmitAmount = currency(item.orderSubmitAmount, false);
//       // item.auditSeconds = Math.random()*7201;
//       // item.showMessage=true;
//       if(item.auditSeconds && item.auditSeconds != 0){
//         if( item.status == '4' || item.status == '5'){
//           item.showMessage=true;
//         }
//       }else{
//         item.showMessage=false;
//       }
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
    
//     if (dataSource.value.some((item: any) => item.auditSeconds > 0)) {
//       now.value = 0;
//       timer = setInterval(() => {
//         now.value += 1
//       }, 1000)
//     } else {
//       timer = null;
//     }
//   }
// };
// const getforData = async ()=>{
//   // let status = '';
//   // if(query.value.status.length>0 && typeof query.value.status != 'string'){
//   //   status = query.value.status.join(",");
//   // }else if(query.value.status.length == 0 && typeof query.value.status != 'string'){
//   //   status = '';
//   // }
//   let queryS = replaceEmptyWithUndefined(JSON.parse(JSON.stringify(query.value)));
//   const res: any = await getMatchListData(Object.assign(queryS, { status: query.value.status ? query.value.status.join(',') : undefined }));
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
const { getMatchListDetail, getAmountErrorVoucher, getAppealDetailData } =
  getUsdtBuyOrderInfo();
const openDetail = ref(false);
const detailObj = ref<any>({});
const wrongAmount = ref(false);
const amountErrorDialog = ref(false);
const assembleRecord = ref<any>({});
const appealDialog = ref(false);
const detailData = ref<any>({
  id: undefined,
  isQuiclyOrder: false,
  kycLinkStatusChangeSource: 2,
  isManualReviewClick: true,
});
const checkDetail = (value: any) => {
  selectedRow();
  const { id, payType } = value;
  detailData.value.id = id;
  assembleRecord.value= value;
  // getMatchListDetail({ id });
  // if(value.auditSeconds && value.auditSeconds != 0){
  //   if( value.status == '4' || value.status == '5'){
  //     detailData.value.isManualReviewClick = false;
  //   }
  // }
  if(value.sourceType == 0){
    detailData.value.isQuiclyOrder = false;
    detailData.value.kycLinkStatusChangeSource = 2;
  }else{
    detailData.value.isQuiclyOrder = true;
    detailData.value.kycLinkStatusChangeSource = 1;
  }
  openDetail.value = true;
  detailObj.value = value;
};
const closeDetail = () => {
  openDetail.value = false;
  detailData.value = {
    id: undefined,
    isQuiclyOrder: false,
    kycLinkStatusChangeSource: 0,
    isManualReviewClick: true,
  };
}
const appealDetails = (value: any) => {
  selectedRow();
  assembleRecord.value= value;
  // const { id } = value;
  // getAppealDetailData({ id,idType:1 });
  appealDialog.value = true;
  detailObj.value = value;
};
const closeAppealInfo = () => {
  appealDialog.value = false;
  assembleRecord.value = {};
  getList();
};
//补单
const manualOpen = ref(false);
const continueManualOpen = ref(false);
const continueManualText = ref('');
const manualFrom = ref<any>({
  amount: undefined,
  chOrderNo: undefined,
  utr: undefined,
  sendType: 0,
  orderReplenishmentSource: 1,
  delayConsumer: 0,
  delayFinish: 0,
  delayType: undefined,
  delayTime: undefined,
  disableBuy: 0,
  disableLimitType: undefined,
  disableLimitTime: undefined,
});
const mamOrderSubmitAmount = ref(0);
const manualOrder = (value: any) => {
  selectedRow();
  const { platformOrder, utr, replenishmentFlag, orderSubmitAmount,orderActualAmount,randomAmoun} = value;
  // if(replenishmentFlag == 1){
  //   message.success(t("n204"));
  //   return;
  // }
  mamOrderSubmitAmount.value = orderSubmitAmount;
  manualFrom.value = {
    amount: (orderSubmitAmount >= (orderActualAmount+randomAmoun) ? (orderActualAmount+randomAmoun) : orderSubmitAmount),
    chOrderNo: platformOrder,
    utr,
    sendType: 0,
    orderReplenishmentSource: 1,
    delayConsumer: 0,
    delayFinish: 0,
    delayType: undefined,
    delayTime: undefined,
    disableBuy: 0,
    disableLimitType: undefined,
    disableLimitTime: undefined,
  };
  manualOpen.value = true;
};
const manualPopModal = ref(false);
const manualOrderSubmit = async () => {
  const regex = /^\d{12}$/;
  if(manualFrom.value.delayFinish == 0) {
    manualFrom.value.delayType = undefined;  
  }
  if(manualFrom.value.disableBuy == 0) {
    manualFrom.value.disableLimitType = undefined;  
  }
  if(!manualFrom.value.amount){
    message.error(t("m562")+t("l34"));
    return;
  }
  if(!manualFrom.value.utr){
    message.error(t("m562")+'UTR');
    return;
  }
  if(!regex.test(manualFrom.value.utr)){
    message.error(t("n217"));
    return;
  }
  if(manualFrom.value.delayFinish && !manualFrom.value.delayType){
    message.error(t("m563")+t("n1397"));
    return;
  }
  if(manualFrom.value.disableBuy && !manualFrom.value.disableLimitType){
    message.error(t("m563")+t("n1398"));
    return;
  }
  loading.value = true;
  const res:any = await matchOrderManualOrderReplenishment(manualFrom.value).finally(()=>{loading.value = false});
  if (res && res.code == "1") {
    if(res.data == '10001'){
      manualPopModal.value = true;
    }
    closeManual();
    closeContinueManual();
    message.success(t("s10"));
    getList();
  }else if(res && res.code == "9006"){
    continueManualText.value = t('n1284');
    continueManualOpen.value = true;
    manualFrom.value.sendType = 1;
  }else if(res && res.code == "9007"){
    continueManualText.value = t('n1285');
    continueManualOpen.value = true;
    manualFrom.value.sendType = 1;
  }
};

const closeManual = () => {
  manualFrom.value = {
    amount: undefined,
    orderNo: undefined,
    utr: undefined,
    sendType: 0,
    orderReplenishmentSource: 1,
    delayConsumer: 0,
    delayFinish: 0,
    delayType: undefined,
    delayTime: undefined,
    disableBuy: 0,
    disableLimitType: undefined,
    disableLimitTime: undefined,
  };
  mamOrderSubmitAmount.value = 0;
  manualOpen.value = false;
};
const closeContinueManual = () => {
  continueManualOpen.value = false;
  continueManualText.value = '';
  manualFrom.value.sendType = 0;
};

const amountErrorVoucher = (value: any) => {
  selectedRow();
  const { id } = value;
  getAmountErrorVoucher({ id });
  amountErrorDialog.value = true;
  detailObj.value = value;
};
const orderAmount = ref(0);
const startUpload = (val:any) => {
  getId.value.voucher=undefined;
  if(val) loading.value = true;
}
const finishUpload = (val:any) => {
  if(val) loading.value = false;
}
const showAppealPay = async (value: any) => {
  selectedRow();
  const { id, orderSubmitAmount,utr,voucher, sourceType } = value;
  orderAmount.value = orderSubmitAmount;
  orderSourceType.value = sourceType ? Number(sourceType) : 0;
  console.log('orderSourceType', orderSourceType.value,sourceType)
  getId.value = {
    id,
    orderActualAmount: undefined,
    remark: "",
    utr: utr || undefined,
    voucher: voucher || undefined,
  };
  addDialog.value = true;
};
const showWrongAmount = async (value: any) => {
  selectedRow();
  const { id } = value;
  getId.value = {
    id,
    orderActualAmount: undefined,
    remark: "",
    utr: undefined,
    voucher: undefined,
  };
  wrongAmount.value = true;
};
const showNoPay = async (value: any) => {
  selectedRow();
  const { id } = value;
  getId.value = {
    id,
    orderActualAmount: undefined,
    remark: "",
    utr: undefined,
    voucher: undefined,
  };
  unpaid.value = true;
};
let isClick = false;
const appealPay = async (value: any) => {
  getId.value.id = value;
  if (isClick) {
    return;
  }
  const regex = /^\d{12}$/;
  if((getId.value.orderActualAmount ?? 0) % 100 != 0 && orderSourceType.value == 0){
    message.error(t("n357"));
    return;
  }
  if(!getId.value.utr){
    message.error(t("m562")+'UTR');
    return;
  }
  if(!regex.test(getId.value.utr)){
    message.error(t("n217"));
    return;
  }
  isClick = true;
  const res:any = await matchListPay(getId.value).finally(()=>{isClick=false});
  if (res && res.code === "1") {
    addDialog.value = false;
    message.success(t("s10"));
    orderSourceType.value = 0;
    getList();
  }
};
const wrongAmountTranfer = async (value: any) => {
  getId.value.id = value;
  loading.value = true;
  const res:any = await getWrongAmountTransfer(getId.value).finally(()=>{loading.value = false});
  if (res && res.code === "1") {
    wrongAmount.value = false;
    message.success(t("s10"));
    getList();
  }
};
const matchListUnPaid = async (value: any) => {
  getId.value.id = value;
  loading.value = true;
  const res:any = await matchListNoPay(getId.value).finally(()=>{loading.value = false});
  if (res && res.code === "1") {
    unpaid.value = false;
    message.success(t("s10"));
    getList();
  }
};
const closedalog = () => {
  addDialog.value = false;
  unpaid.value = false;
  wrongAmount.value = false;
  amountErrorDialog.value = false;
  orderSourceType.value = 0;
};
//解冻
const unfreezeDialog = ref(false);
const unfreezeForm = ref<any>({
  id: undefined,
  remark: undefined,
});
const showUnfreeze = (value: any) => {
  selectedRow();
  const { id } = value;
  unfreezeForm.value = {
    id,
    remark: undefined,
  };
  unfreezeDialog.value = true;
};
const unfreezeOrder = async () => {
  loading.value = true;
  const res:any = await matchOrderCreateUnfreeze(unfreezeForm.value).finally(()=>{loading.value = false});
  if (res && res.code === "1") {  
    message.success(t("s10"));
    closeUnfreeze();
    getList();
  }
};
const closeUnfreeze = () => {     
  unfreezeDialog.value = false;
  unfreezeForm.value = {
    id: undefined,
    remark: undefined,
  };
};
// const { handleTableChange } = useTableChange({
//   query,
//   pagination,
//   getList,
//   filterRules: [
//     { key: "sourceType" },
//     { key: "wakeUpFlag", validValues: ["0", "1"] },
//   ],
// });
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//   pagination.value.current = pag.current;
//   pagination.value.pageSize = pag.pageSize;
//   query.value.pageSize = pag.pageSize;
//   query.value.pageNo = pag.current;
//   getList();
// };
// const matchingTime = computed({
//   get: () => {
//     return [query.value.createTimeStart, query.value.createTimeEnd];
//   },
//   set: (val) => {
//     query.value.createTimeStart = val ? val[0] : "";
//     query.value.createTimeEnd = val ? val[1] : "";
//   },
// });
// const paymentTime = computed({
//   get: () => {
//     return [query.value.paymentTimeStart, query.value.paymentTimeEnd];
//   },
//   set: (val) => {
//     query.value.paymentTimeStart = val ? val[0] : "";
//     query.value.paymentTimeEnd = val ? val[1] : "";
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
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};
const exportList = async () => {
  const data:any = replaceEmptyWithUndefined(query.value);
  if(data.status){
    data.status = data.status.join(",");
  }
  loading.value = true;
  const res:any = await matchingOrderAdminExport(data).finally(() => {
    loading.value = false;
  });
  if (res && res.code == '1'){
    message.success(t("n545"));
  }
};
const search  = () => {
  pagination.value.current = 1;
  query.value.pageNo = 1;
  getList();
}
// const resetQuery = () => {
//   query.value = {
//     asc: false,
//     column: "",
//     collectionPlatformOrder: undefined,
//     completionTimeEnd: "",
//     completionTimeStart: "",
//     createTimeEnd: "",
//     createTimeStart: "",
//     platformOrder: undefined,
//     collectionMerchantOrder: undefined,
//     pageNo: 1,
//     pageSize: 20,
//     paymentPlatformOrder: undefined,
//     paymentTimeEnd: "",
//     paymentTimeStart: "",
//     status: [],
//     collectionMemberId: undefined,
//     paymentMemberId: undefined,
//     riskTag: undefined,
//     payType: undefined,
//     isQuadOrder: undefined,
//     quadOrder: undefined,
//     utr: undefined,
//     kycId:undefined,
//     completedByKyc: undefined,
//     isKycSellOrder: undefined,
//     thirdRechargeFlag: undefined,
//     merchantMemberId: undefined,
//     replenishmentFlag: undefined,
//     matchOrder: undefined,
//     upiId: undefined,
//     appealFlag: undefined,
//     completedBaseType: undefined,
//     appealStatus: undefined,
//     buyOrderType: undefined,
//     sellOrderType: undefined,
//     // randomCode: undefined,
//     upiVerificationStatus: undefined,
//     sourceType: undefined,
//     quickWithdrawalOrderNo: undefined,
//     replenishmentCompletionTimeStart: '',
//     replenishmentCompletionTimeEnd: '',
//     rewardCardSellFlag: undefined,
//     rewardCardId: undefined,
    wakeUpFlag: undefined,
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
//   clearSelected();
//   getList();
// };
//点击人工审核后关闭‘查看’弹窗
Bus.on('manualReviewClick',(val: Boolean)=>{
  if(val){
    openDetail.value = false;
    getList();
  }
})
// 成功
const succeedDialog = ref(false);
const succeedForm = ref({
  matchingOrderNo: undefined,
  remark: undefined,
  utr: undefined,
});
const showSucceed = (value: any) => {
  succeedDialog.value = true;
  succeedForm.value = {
    matchingOrderNo: value.platformOrder,
    remark: undefined,
    utr: value.utr || undefined,
  };
};
const succeedOrder = async () => {
  const regex = /^\d{12}$/;
  if(!succeedForm.value.utr){
    message.error(t("m562")+'UTR');
    return;
  }
  if(!regex.test(succeedForm.value.utr)){
    message.error(t("n217"));
    return;
  }
  loading.value = true;
  const res:any = await matchOrderAutoFailOrderAppealSuccess(succeedForm.value).catch(()=>{loading.value = false});
  if (res && res.code === "1") {
    succeedDialog.value = false;
    message.success(t("s10"));
    getList();
  }
};
const succeedCancel = () => {
  succeedDialog.value = false;
};
// 失败
const failedDialog = ref(false);
const failedForm = ref({
  matchingOrderNo: undefined,
  remark: undefined,
});
const showFailed = (value: any) => {
  failedDialog.value = true;
  failedForm.value = {
    matchingOrderNo: value.platformOrder,
    remark: undefined,
  };
};
const failedOrder = async () => {
  loading.value = true;
  const res:any = await matchOrderAutoFailOrderAppealFail(failedForm.value).catch(()=>{loading.value = false});
  if (res && res.code === "1") {
    failedDialog.value = false;
    message.success(t("s10"));
    getList();
  }
};
const failedCancel = () => {
  failedDialog.value = false;
};
// 确认放款
const showConfirmMod = ref(false);
const confirmForm = ref({
  chOrderNo: undefined,
  matchPoolOrderNo: undefined,
  amount: undefined,
  actualAmount: undefined,
  memberId: undefined,
});
const showConfirmPay = (value: any) => {
  selectedRow();
  const { collectionMemberId, platformOrder, matchOrder, orderSubmitAmount, orderActualAmount } = value;
  showConfirmMod.value = true;
  confirmForm.value = {
    chOrderNo: platformOrder,
    matchPoolOrderNo: matchOrder,
    amount: orderSubmitAmount,
    actualAmount: orderActualAmount,
    memberId: collectionMemberId,
  };
};
const cancelConfirmPay = () => {
  showConfirmMod.value = false;
  confirmForm.value = {
    chOrderNo: undefined,
    matchPoolOrderNo: undefined,
    amount: undefined,
    actualAmount: undefined,
    memberId: undefined,
  };
};
const confirmPayOrder = async () => {
  loading.value = true;
  const res:any = await matchOrderConfirmPay({
    chOrderNo: confirmForm.value.chOrderNo,
    matchPoolOrderNo: confirmForm.value.matchPoolOrderNo,
  }).finally(()=>{loading.value = false});
  if (res && res.code == "1") {
    showConfirmMod.value = false;
    message.success(t("s10"));
    getList();
  }
};

// 申诉
const appealMod = ref(false);
const appealId = ref(null);
const showAppealMod = (value: any) => {
  selectedRow();
  const { id } = value;
  appealId.value = id;
  appealMod.value = true;
};
const appealOrder = async () => {
  loading.value = true;
  const res:any = await matchOrderCreateAppealLink({id:appealId.value}).finally(()=>{loading.value = false});
  if (res && res.code === "1") {
    appealMod.value = false;
    message.success(t("s10"));
    getList();
  }
};
const cancelAppeal = () => {
  appealMod.value = false;
  appealId.value = null;
};
// 申诉链接
const appealLinkMod = ref(false);
const appealCopyLink = ref(null);
const showAppealLinkMod = async (value: any) => {
  selectedRow();
  const { appealLink } = value;
  appealCopyLink.value = appealLink;
  appealLinkMod.value = true;
};
const cancelAppealLink = () => {
  appealLinkMod.value = false;
  appealCopyLink.value = null;
};
const goReward = (rewardId: any) => {
  router.push({ path: "/config/getRewardsRecord", query: { rewardId } });
};
onMounted(() => {
  const pathName = route.fullPath.split('?')[0];
  if(pageCash.value.includes(pathName) && Object.keys(route.query).length == 0){
    const { queryCash, res, extend } = getPageCash(pathName);
    if(!res.data || res.data && res.data.length == 0) {
      getList();
    }else{
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
  getTabH.value = useTabHeight(1).getTabH.value;
});
onUnmounted(() => {
  clearInterval(timer)
})
</script>
<style lang="less" scoped>
.status {
  display: flex;
  margin-top: 10px;
  & > div {
    flex: none;
    &.order-text {
      padding-right: 10px;
    }
  }
}
:deep(.windActive){
  font-weight: 600;
  color: red;
}
.paidTip{
  margin-top: 6px;
  >div{
    font-size: 12px;
    color: red;
  }
}
.confirmCon{
  font-size: 16px;
  color: #000;
  text-align: center;
}
.appealLinkContent{
  word-break: break-all;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  position: relative;
  .copyId{
    cursor: pointer;
    color: #1890ff;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
.copyContent{
  padding: 3px;
  height: auto;
}
.manual-amount-tip-highlight {
  color: #ff4d4f;
}
</style>
