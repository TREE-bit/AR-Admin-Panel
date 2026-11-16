<template>
  <div class="search">
    <h2>{{ $t("m29") }}</h2>
    <a-row>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.username"
          :placeholder="$t('p26')"
          :allowClear="true"
          :show-search="true"
        >
          <a-option
            v-for="item in merchantList"
            :key="item.code"
            :value="item.username"
            >{{ item.username }}</a-option
          >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.merchantCode"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n1478')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.code"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n1477')"
        />
      </a-col>
      <a-col :span="3">
        <a-select v-trim
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.merchantType"
          :placeholder="$t('p16')"
        >
          <a-select-option
            v-for="(item, key) in merchantTypeMap"
            :value="key"
            :key="item"
            >{{ item }}</a-select-option
          >
        </a-select>
        </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          ref="select"
          v-model:value="query.status"
          :placeholder="$t('p17')"
        >
          <a-select-option
            v-for="(item, key) in statusMap"
            :value="key"
            :key="key"
            >{{ item }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="3">
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
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <a-button
          type="primary"
          @click="addWhite"
          v-permission="'admin:merchantInfoAdmin:createMerchantInfo'"
          >{{ $t("add") }}</a-button
        >
        <ExportButton
          :query="executedQuery"
          :api="exportMerchantList"
          permission="admin:merchantInfoAdmin:listExport"
        />
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%', y: getTabH+'px' }"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'rechargeSuccessCallbackOnly'">
        <span>
        {{ $t('n1973')}}
        <tipTemplate :info="$t('n1974')"/>
      </span>
      </template>
      <template v-if="column.key === 'withdrawSuccessCallbackOnly'">
        <span>
        {{ $t('n1975')}}
        <tipTemplate :info="$t('n1974')"/>
      </span>
      </template>
      <template v-if="column.key === 'priorityMatchFlag'">
        <span>
        {{ $t('n1187')}}
        <tipTemplate :info="$t('n1185')"/>
      </span>
      </template>
      <template v-if="column.key === 'matchPriorityUpiTime'">
        <span>
        {{ $t('n1127')}}
        <tipTemplate :info="$t('n1186')"/>
      </span>
      </template>
      <template v-if="column.key === 'supportFourthChannel'">
        <span>
        {{ $t('n1200')}}
        <tipTemplate :info="$t('n1201')"/>
      </span>
      </template>
      <template v-if="column.key === 'supportRandomAmount'">
        <span>
        {{ $t('n1315')}}
        <tipTemplate :info="$t('n1316')"/>
      </span>
      </template>
      <template v-if="column.key === 'autoWithdrawalState'">
        <span>
        {{ $t('n1330')}}
        <tipTemplate :info="$t('n1331')"/>
      </span>
      </template>
      <template v-if="column.key === 'randomAmountMin'">
        <span>
        {{ $t('n612')}}
        <tipTemplate :info="$t('n1462')"/>
      </span>
      </template>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'website'">
        <a-tag color="blue" style="max-width: 160px;">
        <a-tooltip>
          <template #title>{{ record.website }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
              <a :href="record.website" target="_blank">
                {{ record.website }}
              </a>
          </div>
        </a-tooltip>
        </a-tag>
      </template>
      <template v-if="column.key === 'merchantCode'">
        {{ record.merchantCode || '-' }}
      </template>
      <template v-if="column.key === 'merchantType'">
        {{ merchantTypeMap[record.merchantType] }}
      </template>
      <template v-if="column.key === 'balance'">
        <span :class="record.riskTag != 0 ? 'windActive':''">{{ currency(record.balance,false) }}</span>
      </template>
      <template v-if="column.key === 'memberTotalNum'">
        <span>{{ thousand(record.memberTotalNum) }}</span>
      </template>
      <template v-if="column.key === 'memberTotalBalance'">
        <span>{{ currency(record.memberTotalBalance,false) }}</span>
      </template>
      <template v-if="column.key === 'status'">
        <span :class="record.status == '1' ? 'tag-green' : 'tag-red'">
          {{ record.status == '1' ? $t('l53') : $t('l54') }}
        </span>
      </template>
      <template v-if="column.key === 'riskTag'">
        <span v-if="record.riskTag != 0" class="tag-red">
          {{ $t(windControl[Number(record.riskTag)]) }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'rechargeStatus'">
        <span :class="record.rechargeStatus === '1' ? 'tag-green' : 'tag-red'">
          {{ publicStatusMap[record.rechargeStatus] }}
        </span>
      </template>
      <template v-if="column.key === 'rechargeSuccessCallbackOnly'">
        <span :class="record.rechargeSuccessCallbackOnly == 1 ? 'tag-green' : record.rechargeSuccessCallbackOnly == 0 ? 'tag-red' : ''">
          {{ record.rechargeSuccessCallbackOnly == 1 ? $t('l53') : record.rechargeSuccessCallbackOnly == 0 ? $t('l54') : '-' }}
        </span>
      </template>
      <template v-if="column.key === 'withdrawSuccessCallbackOnly'">
        <span :class="record.withdrawSuccessCallbackOnly == 1 ? 'tag-green' : record.withdrawSuccessCallbackOnly == 0 ? 'tag-red' : ''">
          {{ record.withdrawSuccessCallbackOnly == 1 ? $t('l53') : record.withdrawSuccessCallbackOnly == 0 ? $t('l54') : '-' }}
        </span>
      </template>
      <template v-if="column.key === 'priorityMatchFlag'">
        <span :class="record.priorityMatchFlag == 1 ? 'tag-green' : record.priorityMatchFlag == 0 ? 'tag-red' : ''">
          {{ record.priorityMatchFlag == 1 ? $t('yes') : record.priorityMatchFlag == 0 ? $t('no') : '-' }}
        </span>
      </template>
      <template v-if="column.key === 'matchPriorityUpiTime'">
        {{ record.matchPriorityUpiTime !== null ? formatTime(record.matchPriorityUpiTime) : '-' }}
      </template>
      <template v-if="column.key === 'supportFourthChannel'">
        <span :class="record.supportFourthChannel == 1 ? 'tag-green' : record.supportFourthChannel == 0 ? 'tag-red' : ''">
          {{ record.supportFourthChannel == 1 ? $t('yes') : record.supportFourthChannel == 0 ? $t('no') : '-' }}
        </span>
      </template>
      <template v-if="column.key === 'supportRandomAmount'">
        <span :class="record.supportRandomAmount == 1 ? 'tag-green' : record.supportRandomAmount == 0 ? 'tag-red' : ''">
          {{ record.supportRandomAmount == 1 ? $t('yes') : record.supportRandomAmount == 0 ? $t('no') : '-' }}
        </span>
      </template>
      <template v-if="column.key === 'randomAmountMin'">
        <span v-if="record.supportRandomAmount == 1">
          {{ record.randomAmountMin }}~{{ record.randomAmountMax }}
        </span>
        <span v-else>0</span>
      </template>
      <template v-if="column.key === 'withdrawalStatus'">
        <span :class="record.withdrawalStatus === '1' ? 'tag-green' : 'tag-red'">
          {{ publicStatusMap[record.withdrawalStatus] }}
        </span>
      </template>
      <template v-if="column.key === 'autoWithdrawalState'">
        <!-- <span :class="record.autoWithdrawalState == 1 ? 'tag-green' : record.autoWithdrawalState == 0 ? 'tag-red' : ''">
          {{ record.autoWithdrawalState == 1 ? $t('yes') : record.autoWithdrawalState == 0 ? $t('no') : '-' }}
        </span> -->
          <a-switch
            :checked="record.autoWithdrawalState == 1 ? true : false"
            :checked-children="$t('yes')"
            :un-checked-children="$t('no')"
            @change="confirmBy($event,record)"
            :disabled="!hasPermission('admin:merchantInfoAdmin:update')"
          />
      </template>
      <template v-if="column.key === 'payRate'">
        {{ record.payRate }}%
      </template>
      <template v-if="column.key === 'quickPayUpiRate'">
        {{ record.quickPayUpiRate }}%
      </template>
      <template v-if="column.key === 'transferRate'">
        {{ record.transferRate }}%
      </template>
      <template v-if="column.key === 'quickTransferRate'">
        {{ record.quickTransferRate }}%
      </template>
      <template v-if="column.key === 'rechargeReward'">
        {{ record.rechargeReward }}%
      </template>
      <template v-if="column.key === 'withdrawalRewards'">
        {{ record.withdrawalRewards }}%
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="checkDetail(record)"
          v-permission="'admin:merchantInfoAdmin:getInfo'"
          >{{ $t("b24") }}
        </a-tag>
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          v-permission="'admin:merchantInfoAdmin:update'"
          >{{ $t("edit") }}
        </a-tag>

        <span
          class="actionBtn actionBtnColorDel"
            v-permission="'admin:merchantInfoAdmin:delete'"
          @click="showDelMod(record)"
          >{{ $t("b11") }}
        </span>
        <!-- <a-popconfirm
          :title="$t('t7')"
          @confirm="del(record)"
          :ok-text="$t('b9')"
          :cancel-text="$t('b10')"
        >
          <template #description>
            <span style="color: red">{{ $t("t17") }}</span>
          </template>
          <a-tag
            color="rgba(253, 11, 26, 1)"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:merchantInfoAdmin:delete'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm> -->
      </template>
    </template>
    <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'id'"
        />
      <!-- <a-table-summary fixed="bottom">
      <a-table-summary-row>
        <a-table-summary-cell :col-span="1" align="center"> {{ $t("m54") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="5" />
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger">{{ currency(extendData.balancePageTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" />
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger">{{ currency(extendData.memberBalancePageTotal, false) }}</a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="17" />
      </a-table-summary-row>
      <a-table-summary-row>
        <a-table-summary-cell :col-span="1" align="center">{{ $t("m55") }}</a-table-summary-cell>
        <a-table-summary-cell :col-span="5" />
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger"> {{ currency(extendData.balanceTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="1" />
        <a-table-summary-cell :col-span="1" align="center">
          <a-typography-text type="danger"> {{ currency(extendData.memberBalanceTotal, false) }} </a-typography-text>
        </a-table-summary-cell>
        <a-table-summary-cell :col-span="17" />
      </a-table-summary-row>
      </a-table-summary> -->
    </template>
  </a-table>
  <a-modal
    v-model:open="addWhiteDialog"
    width="80%"
    :title="merchantForm.id ? $t('b25') : $t('b26')"
    :footer="null"
    @cancel="closeAddWhitedalog"
  >
    <a-form ref="formRef" layout="inline" :model="merchantForm" class="arform">
      <a-form-item
        :label="$t('l92')"
        name="username"
        :rules="[{ required: true, message: $t('p13') }]"
      >
        <a-input v-trim
          v-model:value="merchantForm.username"
          :placeholder="$t('p13')"
          :disabled="isEdit"
        />
      </a-form-item>
      <a-form-item
        :label="$t('n1477')"
        name="code"
        :rules="[{ required: true, message: $t('m562')+$t('n1477') }]"
      >
        <a-input v-trim v-model:value="merchantForm.code" :placeholder="$t('m562')+$t('n1477')" :disabled="isEdit" />
      </a-form-item>
      <a-form-item
        :label="$t('n10')"
        name="website"
        :rules="[{ required: true, message: $t('p18') }]"
      >
        <a-input v-trim v-model:value="merchantForm.website" :placeholder="$t('m562')+$t('n10')" />
      </a-form-item>
      <a-form-item
        :label="$t('n1478')"
        name="code"
      >
        <a-input v-trim v-model:value="merchantForm.merchantCode" :placeholder="$t('m562')+$t('n1478')" />
      </a-form-item>
      <a-form-item
        :label="$t('n11')"
        name="apiAllowedIps"
        :rules="[{ required: true, message: $t('p19') }]"
      >
        <a-textarea
          v-model:value="merchantForm.apiAllowedIps"
          :placeholder="$t('p20')"
          :rows="1"
        />
      </a-form-item>
      <a-form-item
        :label="$t('n30')"
        name="merchantType"
        :rules="[{ required: true, message: $t('m563')+$t('n30') }]"
      >
        <a-select
          allowClear
          ref="select"
           :placeholder="$t('m563')+$t('n30')"
          v-model:value="merchantForm.merchantType"
        >
          <a-select-option
            v-for="(item, key) in merchantTypeMap"
            :key="key"
            :value="key"
            >{{ item }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1548')" name="exchangeMerchant">
        <a-select
          ref="select"
          v-model:value="merchantForm.exchangeMerchant"
          :disabled="isEdit"
        >
          <a-select-option :value="0">{{ t("no") }}</a-select-option>
          <a-select-option :value="1">{{ t("yes") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('n12')"
        name="timeZone"
        :rules="[{ required: true, message: $t('m563')+$t('n12') }]"
      >
        <a-select allowClear ref="select" :placeholder="$t('m563')+$t('n12')" v-model:value="merchantForm.timeZone">
          <a-select-option
            v-for="item in timeZoneMap"
            :key="item"
            :value="item"
          ></a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="'ARPAY ' + $t('n13')"
        name="payRate"
      >
        <a-input-number :min="0" v-model:value="merchantForm.payRate" addon-after="%" />
      </a-form-item>
      <a-form-item
        :label="'ARUPI ' + $t('n13')"
        name="quickPayUpiRate"
      >
        <a-input-number :min="0" v-model:value="merchantForm.quickPayUpiRate" addon-after="%" />
      </a-form-item>
      <a-form-item
        :label="'ARPAY '+$t('n14')"
        name="transferRate"
      >
        <a-input-number
          v-model:value="merchantForm.transferRate"
          :min="0"
          addon-after="%"
        />
      </a-form-item>
      <a-form-item
        :label="'ARUPI '+$t('n14')"
        name="quickTransferRate"
      >
        <a-input-number
          v-model:value="merchantForm.quickTransferRate"
          :min="0"
          addon-after="%"
        />
      </a-form-item>
      <!-- <a-form-item
        :label="$t('m381')"
        name="username"
      >
        <Upload v-if="isMountUpload" v-model:value="merchantForm.icon" @startUpload="startUpload"  @finishUpload="finishUpload"/>
      </a-form-item> -->
      <a-form-item
        :label="$t('m384')"
        name="rechargeRewardRatio"
      >
        <!-- :rules="[{ required: true, message: $t('m385') }]" -->
        <a-input-number
          v-model:value="merchantForm.rechargeRewardRatio"
          :min="0"
          addon-after="%"
        />
      </a-form-item>
      <a-form-item :label="$t('m433')" name="minCost">
        <a-input-number :min="0" v-model:value="merchantForm.minCost" />
      </a-form-item>
      <a-form-item :label="$t('m434')" name="maxCost">
        <a-input-number :min="merchantForm.minCost || 0" v-model:value="merchantForm.maxCost" />
      </a-form-item>
      <!-- <a-form-item :label="$t('e6')" name="rechargeReward">
        <a-input-number
          v-model:value="merchantForm.rechargeReward"
          addon-after="%"
        />
      </a-form-item>
      <a-form-item :label="$t('e7')" name="withdrawalRewards">
        <a-input-number
          v-model:value="merchantForm.withdrawalRewards"
          addon-after="%"
        />
      </a-form-item> -->
      <!-- <a-form-item :label="$t('n19')" name="withdrawalMatchExptime">
        <a-input-number
          v-model:value="merchantForm.withdrawalMatchExptime"
          :addon-after="t('minute')"
        />
      </a-form-item> -->
      <!-- <a-form-item :label="$t('n20')" name="rechargeMatchExptime">
        <a-input-number
          v-model:value="merchantForm.rechargeMatchExptime"
          :addon-after="t('minute')"
        />
      </a-form-item> -->
      <!-- <a-form-item :label="$t('n21')" name="confimExptime">
        <a-input-number
          v-model:value="merchantForm.confimExptime"
          :addon-after="t('minute')"
        />
      </a-form-item> -->
      <a-form-item :label="$t('n22')" name="rechargeStatus">
        <a-select
          ref="select"
          v-model:value="merchantForm.rechargeStatus"
        >
          <a-select-option value="0">{{ t("disabled") }}</a-select-option>
          <a-select-option value="1">{{ t("publicType1") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n23')" name="withdrawalStatus">
        <a-select
          ref="select"
          v-model:value="merchantForm.withdrawalStatus"
        >
          <a-select-option value="0">{{ t("disabled") }}</a-select-option>
          <a-select-option value="1">{{ t("publicType1") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1973')" name="rechargeSuccessCallbackOnly">
        <a-select
          ref="select"
          v-model:value="merchantForm.rechargeSuccessCallbackOnly"
        >
          <a-select-option :value="0">{{ t("l54") }}</a-select-option>
          <a-select-option :value="1">{{ t("l53") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1975')" name="withdrawSuccessCallbackOnly">
        <a-select
          ref="select"
          v-model:value="merchantForm.withdrawSuccessCallbackOnly"
        >
          <a-select-option :value="0">{{ t("l54") }}</a-select-option>
          <a-select-option :value="1">{{ t("l53") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1187')" name="priorityMatchFlag">
        <a-select
          ref="select"
          v-model:value="merchantForm.priorityMatchFlag"
        >
          <a-select-option :value="0">{{ t("no") }}</a-select-option>
          <a-select-option :value="1">{{ t("yes") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1188')" name="matchPriorityUpiTime">
        <a-input-number
          v-model:value="merchantForm.matchPriorityUpiTime"
          :addon-after="t('s')"
          :min="0"
        />
      </a-form-item>
      <a-form-item :label="$t('n1199')" name="supportFourthChannel">
        <a-select
          ref="select"
          v-model:value="merchantForm.supportFourthChannel"
        >
          <a-select-option :value="0">{{ t("no") }}</a-select-option>
          <a-select-option :value="1">{{ t("yes") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1312')" name="supportRandomAmount">
        <a-select
          ref="select"
          v-model:value="merchantForm.supportRandomAmount"
          @change="onSupportRandomAmountChange"
        >
          <a-select-option :value="0">{{ t("no") }}</a-select-option>
          <a-select-option :value="1">{{ t("yes") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1549')" name="upiSellOrderAutoBuy">
        <a-select
          ref="select"
          v-model:value="merchantForm.upiSellOrderAutoBuy"
        >
          <a-select-option :value="0">{{ t("no") }}</a-select-option>
          <a-select-option :value="1">{{ t("yes") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1550')" name="bankSellOrderAutoBuy">
        <a-select
          ref="select"
          v-model:value="merchantForm.bankSellOrderAutoBuy"
        >
          <a-select-option :value="0">{{ t("no") }}</a-select-option>
          <a-select-option :value="1">{{ t("yes") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1589')" name="isIntegerAmountFirst">
        <a-select
          ref="select"
          v-model:value="merchantForm.isIntegerAmountFirst"
        >
          <a-select-option :value="0">{{ t("no") }}</a-select-option>
          <a-select-option :value="1">{{ t("yes") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1313')" name="randomAmountMin" :required="merchantForm.supportRandomAmount == 1">
        <a-input-number
          v-model:value="merchantForm.randomAmountMin"
          :min="merchantForm.minCost || 0"
          @blur="fixToStep(merchantForm, 'randomAmountMin')"
          :disabled="merchantForm.supportRandomAmount == 0 || !merchantForm.maxCost"
        />
      </a-form-item>
      <a-form-item :label="$t('n1314')" name="randomAmountMax" :required="merchantForm.supportRandomAmount == 1">
        <a-input-number
          v-model:value="merchantForm.randomAmountMax"
          :min="merchantForm.randomAmountMin || 0"
          :max="merchantForm.maxCost || 0"
          @blur="fixToStep(merchantForm, 'randomAmountMax')"
          :disabled="merchantForm.supportRandomAmount == 0 || !merchantForm.maxCost"
        />
      </a-form-item>
      <a-form-item v-if="isEdit" :label="$t('n648')" name="status">
        <a-select
          ref="select"
          v-model:value="merchantForm.status"
          @change="onMerchantStatusChange"
        >
          <a-select-option value="0">{{ t("l54") }}</a-select-option>
          <a-select-option value="1">{{ t("l53") }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('remark')" name="remark">
        <a-textarea
         :placeholder="$t('m562')+$t('remark')"
          v-model:value="merchantForm.remark"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
      </a-form-item>
      <!-- <a-form-item :label="$t('n1327')" name="autoWithdrawalState">
        <a-select
          ref="select"
          v-model:value="merchantForm.autoWithdrawalState"
        >
          <a-select-option :value="0">{{ t("n1328") }}</a-select-option>
          <a-select-option :value="1">{{ t("n1329") }}</a-select-option>
        </a-select>
      </a-form-item> -->
      <!-- <a-form-item class="fastMoney" :label="$t('m382')" name="fastMoney">
        <a-row>
          <a-input-number :min="0" v-model:value="fastMoney.one" addon-after="ARB"/>
          <a-input-number :min="0" v-model:value="fastMoney.four"  addon-after="ARB"/>
          <a-input-number :min="0" v-model:value="fastMoney.seven" addon-after="ARB" />
        </a-row>
        <a-row>
          <a-input-number :min="0" v-model:value="fastMoney.two" addon-after="ARB" />
          <a-input-number :min="0" v-model:value="fastMoney.five"  addon-after="ARB"/>
          <a-input-number :min="0" v-model:value="fastMoney.eight" addon-after="ARB" />
        </a-row>
        <a-row>
          <a-input-number :min="0" v-model:value="fastMoney.three" addon-after="ARB"/>
          <a-input-number :min="0" v-model:value="fastMoney.six"  addon-after="ARB"/>
          <a-input-number :min="0" v-model:value="fastMoney.nine" addon-after="ARB" />
        </a-row>
      </a-form-item> -->
      <div style="width: 100%;"></div>
      <a-form-item :wrapper-col="{ span: 20, offset:22 }">
        <a-button :loading="isUpload" type="primary" @click="addBtn">{{
          isEdit? $t("b8") : $t("b12")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddWhitedalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:open="openDetail"
    :title="$t('b24')"
    width="100%"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <merchantDetail v-if="openDetail" />
  </a-modal>
  <!-- 删除 -->
  <a-modal
    v-model:open="delMod"
    @ok="del()"
    @cancel="closeDelMod"
    :loading="loading"
  >
    <template #title>
      <ExclamationCircleOutlined style="color: #faad14; font-size: 20px;margin-right: 6px;" />
      {{ $t("t7") }}
    </template>
    <h2 style="color:rgb(253, 11, 26)">{{ $t('t17') }}</h2>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, reactive, computed } from "vue";
import merchantDetail from "@/components/MerchantInfo/detail.vue";
import { SearchOutlined,ExclamationCircleOutlined,QuestionCircleOutlined } from "@ant-design/icons-vue";
import { useToast } from "@/hooks/useToast.hook";
import {
  createMerchantInfoApi,
  getDefaultAllowedIpsApi,
  deleteMerchantInfoApi,
  getMerchantInfoAdminList,
  updateMerchantInfoApi,
  merchantInfoAdminUpdateAutoWithdrawalState,
} from "@/api/merchant.api";
import { merchantInfoAdminListExport } from "@/api/export";
import { message,Modal } from "ant-design-vue";
import { timeZoneMap, windControl } from "@/utils/publicData";
import { useMerchantInfo } from "@/hooks/useMerchantInfo.hook";
import Upload from '@/components/Upload/index.vue'
import { useI18n } from "vue-i18n";
import { currency, thousand, formatTime, fixToStep } from "@/utils";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { usePermission } from "@/hooks";
import { useMerchantStore } from "@/stores/useMerchantStore";
const merchantList = computed(() => useMerchantStore().merchantList);
const { hasPermission }=usePermission()
const { getTabH } = useTabHeight(1);
const { t, locale } = useI18n();
const { getDetail } = useMerchantInfo();
const toast = useToast();
// const dataSource = ref([]);
// const extendData: any = ref({});
// const loading = ref(false);
const isMountUpload = ref(false);
const isUpload = ref(false);
const fastMoney = ref<any>({
  one: 0,
  two: 0,
  three: 0,
  four: 0,
  five: 0,
  six: 0,
  seven: 0,
  eight: 0,
  nine: 0,
})
const query = ref({
  account: "",
  code: "",
  merchantCode: "",
  merchantType: undefined,
  status: undefined,
  username: undefined,
  riskTag: null,
  pageNo: 1,
  pageSize: 20,
});
const merchantTypeMap = <any>{
  "1": t("n24"),
  "2": t("n25"),
};
const statusMap = <any>{
  "0": t("n26"),
  "1": t("n27"),
  "2": t("n28"),
  "3": t("n29"),
};
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      balance: extendData.value.balancePageTotal,
      memberTotalBalance: extendData.value.memberBalancePageTotal,
    },
  },
  {
    label: t("m55"),
    fields: {
      balance: extendData.value.balanceTotal,
      memberTotalBalance: extendData.value.memberBalanceTotal,
    },
  },
]);
const publicStatusMap = <any>[t("disabled"), t("publicType1")];
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 60,
    fixed: "left",
  },
  {
    title: t("l92"),
    dataIndex: "username",
    key: "username",
    align: "center",
    width: 140,
    fixed: "left",
  },
  {
    title: t("n1478"),
    dataIndex: "merchantCode",
    key: "merchantCode",
    align: "center",
    width: 120,
  },
  {
    title: t("n1477"),
    dataIndex: "code",
    key: "code",
    align: "center",
    width: 120,
  },
  {
    title: t("n30"),
    dataIndex: "merchantType",
    key: "merchantType",
    align: "center",
    width: 160,
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1548")),
    dataIndex: "exchangeMerchant",
    key: "exchangeMerchant",
    align: "center",
    width: 120,
    customRender: ({ record }: { record: Record<string, any> }) => {
      const isYes = record.exchangeMerchant == 1;
      return h(
        "span",
        {
          class: isYes ? "tag-green" : "tag-red",
        },
        isYes ? t("yes") : t("no")
      );
    }
  },
  {
    title: t("n10"),
    dataIndex: "website",
    key: "website",
    align: "center",
    ellipsis: true,
    width: 200,
  },
  {
    title: t("n12"),
    dataIndex: "timeZone",
    key: "timeZone",
    align: "center",
    width: 140,
  },
  {
    title: t("n31"),
    dataIndex: "balance",
    key: "balance",
    align: "center",
    width: 160,
  },
  {
    title: t("m204"),
    dataIndex: "memberTotalNum",
    key: "memberTotalNum",
    align: "center",
    width: 120,
  },
  {
    title: t("m202"),
    dataIndex: "memberTotalBalance",
    key: "memberTotalBalance",
    align: "center",
    width: 160,
  },
  {
    title: t("n648"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 100,
  },
  {
    title: h("div", {class:"toopTipStyle2"}, 'ARPAY ' + t("n13")),
    dataIndex: "payRate",
    key: "payRate",
    align: "center",
    width: 100,
  },
  {
    title: h("div", {class:"toopTipStyle2"}, 'ARUPI ' + t("n13")),
    dataIndex: "quickPayUpiRate",
    key: "quickPayUpiRate",
    align: "center",
    width: 100,
  },
  {
    title: h("div", {class:"toopTipStyle2"}, 'ARPAY ' + t("n14")),
    dataIndex: "transferRate",
    key: "transferRate",
    align: "center",
    width: 120,
  },
  {
    title: h("div", {class:"toopTipStyle2"}, 'ARUPI ' + t("n14")),
    dataIndex: "quickTransferRate",
    key: "quickTransferRate",
    align: "center",
    width: 120,
  },
  // {
  //   title: t("e6"),
  //   dataIndex: "rechargeReward",
  //   key: "rechargeReward",
  //   align: "center",
  //   width: 120,
  // },
  // {
  //   title: t("e7"),
  //   dataIndex: "withdrawalRewards",
  //   key: "withdrawalRewards",
  //   align: "center",
  //   width: 120,
  // },
  {
    title: t("n23"),
    dataIndex: "withdrawalStatus",
    key: "withdrawalStatus",
    align: "center",
    width: 120,
  },
  {
    title: t("n22"),
    dataIndex: "rechargeStatus",
    key: "rechargeStatus",
    align: "center",
    width: 130,
  },
  {
    title: t("n1973"),
    dataIndex: "rechargeSuccessCallbackOnly",
    key: "rechargeSuccessCallbackOnly",
    align: "center",
    width: 140,
  },
  {
    title: t("n1975"),
    dataIndex: "withdrawSuccessCallbackOnly",
    key: "withdrawSuccessCallbackOnly",
    align: "center",
    width: 140,
  },
  {
    title: t("n1187"),
    dataIndex: "priorityMatchFlag",
    key: "priorityMatchFlag",
    align: "center",
    width: 120,
  },
  {
    title: t("n1127"),
    dataIndex: "matchPriorityUpiTime",
    key: "matchPriorityUpiTime",
    align: "center",
    width: 140,
  },
  {
    title: t("n1200"),
    dataIndex: "supportFourthChannel",
    key: "supportFourthChannel",
    align: "center",
    width: 140,
  },
  {
    title: t("n1315"),
    dataIndex: "supportRandomAmount",
    key: "supportRandomAmount",
    align: "center",
    width: 140,
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1549")),
    dataIndex: "upiSellOrderAutoBuy",
    key: "upiSellOrderAutoBuy",
    align: "center",
    width: 120,
    customRender: ({ record }: { record: Record<string, any> }) => {
      const isYes = record.upiSellOrderAutoBuy == 1;
      return h(
        "span",
        {
          class: isYes ? "tag-green" : "tag-red",
        },
        isYes ? t("yes") : t("no")
      );
    }
  }, 
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1550")),
    dataIndex: "bankSellOrderAutoBuy",
    key: "bankSellOrderAutoBuy",
    align: "center",
    width: 120,
    customRender: ({ record }: { record: Record<string, any> }) => {
      const isYes = record.bankSellOrderAutoBuy == 1;
      return h(
        "span",
        {
          class: isYes ? "tag-green" : "tag-red",
        },
        isYes ? t("yes") : t("no")
      );
    }
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1589")),
    dataIndex: "isIntegerAmountFirst",
    key: "isIntegerAmountFirst",
    align: "center",
    width: 120,
    customRender: ({ record }: { record: Record<string, any> }) => {
      const isYes = record.isIntegerAmountFirst == 1;
      return h(
        "span",
        {
          class: isYes ? "tag-green" : "tag-red",
        },
        isYes ? t("yes") : t("no")
      );
    }
  }, 
  {
    title: t("n612"),
    dataIndex: "randomAmountMin",
    key: "randomAmountMin",
    align: "center",
    width: 160,
  },
  {
    title: t("n1330"),
    dataIndex: "autoWithdrawalState",
    key: "autoWithdrawalState",
    align: "center",
    width: 140,
  },
  {
    title: t("m435"),
    dataIndex: "riskTag",
    key: "riskTag",
    align: "center",
    width: 140,
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 200,
  },
  {
    title: t("n32"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 200,
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 150,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 220,
    fixed: 'right',
  },
];
// const pagination = reactive({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
// 当前列表实际查询成功的条件，导出用它，不受尚未点【搜索】的输入影响
const executedQuery = ref<any>({});
const fetchMerchantList = async (params: any) => {
  const res: any = await getMerchantInfoAdminList(params);
  if (res && res.code == "1") {
    executedQuery.value = params;
  }
  return res;
};
// 导出全部匹配记录，不带分页参数；当前条件下无数据时不发起导出
const exportMerchantList = (params: any) => {
  if (!pagination.value.total) {
    message.warning(t("n2067"));
    return Promise.resolve(null);
  }
  const { pageNo, pageSize, ...exportParams } = params;
  return merchantInfoAdminListExport(exportParams);
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
  api: fetchMerchantList,
  defaultPageSize: 20,
  filterRules: [],
  fetchType: 2,
  afterFetch: (data) =>
    data.map((item: any) => {
      return item;
    }),
});
// const getList = async (value: any, isFirst: any = null) => {
//   if (isFirst) {
//     value.pageNo = 1;
//     pagination.current = 1;
//   }
//   loading.value = true;
//   const res: any = await getMerchantInfoAdminList(value).finally(()=>loading.value = false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data.map((item:any)=>{
//       item.balance = currency(item.balance, false);
//       item.memberTotalNum = thousand(item.memberTotalNum);
//       item.memberTotalBalance = currency(item.memberTotalBalance, false);
//       return item;
//     });
//     extendData.value = res.extend
//     pagination.total = res.total;
//     // if(res.data.quickAmount){
//     //   const values = res.data.quickAmount.split('|')
//     //   fastMoney.value = {
//     //     one: values[0],
//     //     two: values[1],
//     //     three: values[2],
//     //     four: values[3],
//     //     five: values[4],
//     //     six: values[5],
//     //     seven: values[6],
//     //     eight: values[7],
//     //     nine: values[8],
//     //   }
//     // }
//   }
// };

// const handleTableChange: any = (value: {
//   pageSize: number;
//   current: number;
// }) => {
//   const { current, pageSize } = value;
//   query.value.pageNo = current;
//   pagination.current = current;
//   if (pageSize != query.value.pageSize) {
//     query.value.pageSize = pageSize;
//     pagination.pageSize = pageSize;
//     query.value.pageNo = 1;
//     pagination.current = 1;
//   }
//   getList(query.value);
// };
// const resetQuery = () => {
//   query.value = {
//     account: "",
//     code: "",
//     merchantType: undefined,
//     status: undefined,
//     username: undefined,
//     riskTag: null,
//     pageNo: 1,
//     pageSize: 20,
//   };
//   pagination.current = 1;
//   pagination.pageSize = 20;
//   clearSelected();
//   getList(query.value);
// };
/****************Add edit***************/
const addWhiteDialog = ref(false);
const merchantForm = ref({
  code: undefined,
  confimExptime: undefined,
  maxCost: 0,
  merchantType: "1" as any,
  minCost: 0,
  payRate: 0,
  quickPayUpiRate: 0,
  apiAllowedIps: undefined,
  rechargeMatchExptime: 0,
  // rechargeReward: 0,
  rechargeStatus: "0",
  timeZone: undefined,
  remark: undefined as any,
  transferRate: 0,
  quickTransferRate: 0,
  username: undefined,
  website: undefined,
  withdrawalMatchExptime: 0,
  // withdrawalRewards: 0,
  withdrawalStatus: "0",
  // quickAmount: '',
  icon: undefined,
  rechargeRewardRatio: 0,
  status: undefined as any,
  rechargeSuccessCallbackOnly: 0,
  withdrawSuccessCallbackOnly: 0,
  priorityMatchFlag: 0,
  matchPriorityUpiTime: 0,
  supportFourthChannel: 0,
  ip: undefined as any,
  merchantCode: undefined,
  // autoWithdrawalState: 0,
  supportRandomAmount: 0,
  randomAmountMin: 0,
  randomAmountMax: 0,
  exchangeMerchant: 0,
  upiSellOrderAutoBuy: 0,
  bankSellOrderAutoBuy: 0,
  isIntegerAmountFirst: 0,
});
const onSupportRandomAmountChange = () => {
  if (merchantForm.value.supportRandomAmount == 0) {
    merchantForm.value.randomAmountMin = 0;
    merchantForm.value.randomAmountMax = 0;
  }
}
// 新增商户时预填默认加白IP（不分商户类型），运营可自由修改，以点【创建】时的值为准
const getDefaultAllowedIps = async () => {
  const res: any = await getDefaultAllowedIpsApi();
  if (res?.code !== "1" || !res.data) return;
  // 请求返回前弹窗已关闭或已手动录入，则不再填入
  if (addWhiteDialog.value && !isEdit.value && !merchantForm.value.apiAllowedIps) {
    merchantForm.value.apiAllowedIps = res.data;
  }
};
// 商户状态（大开关）切换时，代收、代付状态（小开关）跟随开启/关闭
const onMerchantStatusChange = () => {
  const linkedStatus = merchantForm.value.status == "1" ? "1" : "0";
  merchantForm.value.rechargeStatus = linkedStatus;
  merchantForm.value.withdrawalStatus = linkedStatus;
}
const addWhite = () => {
  getDefaultAllowedIps();
  // fastMoney.value = {
  //   one: 0,
  //   two: 0,
  //   three: 0,
  //   four: 0,
  //   five: 0,
  //   six: 0,
  //   seven: 0,
  //   eight: 0,
  //   nine: 0,
  // }
  merchantForm.value = {
    code: undefined,
    confimExptime: undefined,
    maxCost: 0,
    merchantType: undefined,
    minCost: 0,
    payRate: 0,
    quickPayUpiRate: 0,
    rechargeMatchExptime: 0,
    // rechargeReward: 0,
    rechargeStatus: "0",
    timeZone: undefined,
    remark: undefined,
    transferRate: 0,
    quickTransferRate: 0,
    username: undefined,
    website: undefined,
    withdrawalMatchExptime: 0,
    // withdrawalRewards: 0,
    withdrawalStatus: "0",
    // quickAmount:'',
    icon:undefined,
    rechargeRewardRatio: 0,
    status: undefined,
    rechargeSuccessCallbackOnly: 0,
    withdrawSuccessCallbackOnly: 0,
    priorityMatchFlag: 0,
    matchPriorityUpiTime: 0,
    supportFourthChannel: 0,
    apiAllowedIps: undefined,
    ip: undefined,
    merchantCode: undefined,
    supportRandomAmount: 0,
    randomAmountMin: 0,
    randomAmountMax: 0,
    // autoWithdrawalState: 0,
    exchangeMerchant: 0,
    upiSellOrderAutoBuy: 0,
    bankSellOrderAutoBuy: 0,
    isIntegerAmountFirst: 0,
  };
  isEdit.value = false;
  isMountUpload.value = true;
  addWhiteDialog.value = true;
};
const isEdit = ref(false);
const showEditPageFun = async (data: any) => {
  await getList();
  selectedRow();
  let values;
  // if(!data.quickAmount || data.quickAmount.length<=9){
  //   fastMoney.value = {
  //     one: 0,
  //     two: 0,
  //     three: 0,
  //     four: 0,
  //     five: 0,
  //     six: 0,
  //     seven: 0,
  //     eight: 0,
  //     nine: 0,
  //   }
  // }else{
  //   values = data.quickAmount.split('|')
  //   fastMoney.value = {
  //     one: values[0],
  //     two: values[1],
  //     three: values[2],
  //     four: values[3],
  //     five: values[4],
  //     six: values[5],
  //     seven: values[6],
  //     eight: values[7],
  //     nine: values[8],
  //   }
  // }
  data.isIntegerAmountFirst = data.isIntegerAmountFirst ? 1 : 0
  merchantForm.value = JSON.parse(JSON.stringify(data));
  isEdit.value = true;
  addWhiteDialog.value = true;
  isMountUpload.value = true;
};
const closeAddWhitedalog = () => {
  merchantForm.value = {
    ip: "",
    remark: "",
    status: "1",
  } as any;
  isEdit.value = false;
  addWhiteDialog.value = false;
  isMountUpload.value = false;
};
const addBtn = async () => {
  let res: any;
  // const quick = Object.values(fastMoney.value).join('|');
  // const quick1 = Object.values(fastMoney.value);
  if(!merchantForm.value.username){
    return message.error(t('p13'))
  }
  if(!merchantForm.value.code){
    return message.error(t('m562')+t('n1477'))
  }
  if(!merchantForm.value.website){
    return message.error(t('p18'))
  }
  if(!merchantForm.value.apiAllowedIps){
    return message.error(t('p19'))
  }
  if(!merchantForm.value.merchantType){
    return message.error(t('p16'))
  }
  if(!merchantForm.value.timeZone){
    return message.error(t('m563')+t('n12'))
  }
  if(merchantForm.value.supportRandomAmount == 1 && merchantForm.value.minCost && merchantForm.value.maxCost){
    if(!merchantForm.value.randomAmountMin){
      return message.error(t('m562')+t('n1313'))
    }
    if(!merchantForm.value.randomAmountMax){
      return message.error(t('m562')+t('n1314'))
    }
  }
  // 商户状态关闭时，代收、代付状态不能单独保存为开启，提示里注明是哪个开关
  if(isEdit.value && merchantForm.value.status == "0"){
    const enabledNames = [
      merchantForm.value.rechargeStatus == "1" ? t('n22') : '',
      merchantForm.value.withdrawalStatus == "1" ? t('n23') : '',
    ].filter(Boolean);
    if(enabledNames.length){
      return message.error(t('n2065', { name: enabledNames.join(locale.value === 'zh' ? '、' : ' and ') }))
    }
  }
  // if(merchantForm.value.payRate == ''){
  //   return message.error(t('p22'))
  // }
  // if(merchantForm.value.transferRate == ''){
  //   return message.error(t('p23'))
  // }
  // if(merchantForm.value.rechargeRewardRatio == ''){
  //   return message.error(t('m385'))
  // }
  // if(quick1.includes('0') || quick1.includes(0) ){
  //   return message.error(t('m380'))
  // }
  if (isEdit.value) {
    const {
      code,
      confimExptime,
      id,
      maxCost,
      merchantType,
      minCost,
      payRate,
      quickPayUpiRate,
      rechargeMatchExptime,
      // rechargeReward,
      rechargeStatus,
      remark,
      timeZone,
      transferRate,
      quickTransferRate,
      username,
      website,
      withdrawalMatchExptime,
      withdrawalRewards,
      withdrawalStatus,
      apiAllowedIps,
      icon,
      rechargeRewardRatio,
      status,
      rechargeSuccessCallbackOnly,
      withdrawSuccessCallbackOnly,
      priorityMatchFlag,
      matchPriorityUpiTime,
      supportFourthChannel,
      supportRandomAmount,
      randomAmountMin,
      randomAmountMax,
      // autoWithdrawalState,
      merchantCode,
      exchangeMerchant,
      upiSellOrderAutoBuy,
      bankSellOrderAutoBuy,
      isIntegerAmountFirst,
    } = merchantForm.value as any;
    res = await updateMerchantInfoApi({
      apiAllowedIps,
      code,
      confimExptime,
      id,
      maxCost,
      merchantType,
      minCost,
      payRate,
      quickPayUpiRate,
      rechargeMatchExptime,
      // rechargeReward,
      rechargeStatus,
      remark,
      timeZone,
      transferRate,
      quickTransferRate,
      username,
      website,
      withdrawalMatchExptime,
      withdrawalRewards,
      withdrawalStatus,
      icon,
      // quickAmount: '',
      rechargeRewardRatio,
      status,
      rechargeSuccessCallbackOnly,
      withdrawSuccessCallbackOnly,
      priorityMatchFlag,
      matchPriorityUpiTime,
      supportFourthChannel,
      supportRandomAmount,
      randomAmountMin,
      randomAmountMax,
      // autoWithdrawalState,
      merchantCode,
      exchangeMerchant,
      upiSellOrderAutoBuy,
      bankSellOrderAutoBuy,
      isIntegerAmountFirst,
    });
  } else {
    // merchantForm.value.quickAmount = quick;
    res = await createMerchantInfoApi(merchantForm.value);
  }
  if (res && res.code === "1") {
    toast.success(isEdit.value ? t("s14") : t("s15"));
    closeAddWhitedalog();
    resetQuery();
  }
};

//开关确认
const confirmBy = async (e: any,  data: any) => {
  const { id, autoWithdrawalState } = data || {};
  const s = e ? 1 : 0;
  Modal.confirm({
    title: autoWithdrawalState == 1 ? t("m768") : t("m767"), 
    onOk: async () => {
      loading.value = true;
      const res: any = await merchantInfoAdminUpdateAutoWithdrawalState({
        id,
        autoWithdrawalState: s,
      }).finally(()=>loading.value = false);

      if (res && res.code === "1") {
        message.success(t("s10"));
        getList();
      }
    },
    onCancel() {
    },
  });
}
// 删除
const delMod = ref(false);
const delForm= ref({
  code: undefined,
  id: undefined,
});
const showDelMod = (value: any) => {
  delForm.value = {
    code: value.code,
    id: value.id,
  }
  delMod.value = true;
};
const del = async () => {
  loading.value = true;
  const res: any = await deleteMerchantInfoApi(delForm.value).finally(() => loading.value = false);
  if (res && res.code === "1") {
    message.success(t("s9"));
    getList();
    closeDelMod();
  }
};
const closeDelMod = () => {
  delMod.value = false;
  delForm.value = {
    code: undefined,
    id: undefined,
  };
};
const openDetail = ref(false);
const detailObj = ref<any>({});
const checkDetail = (value: any) => {
  selectedRow();
  const { id } = value;
  getDetail({ id });
  openDetail.value = true;
  detailObj.value = value;
};
  const startUpload = (val:any) => {
    if(val) isUpload.value = true;
  }
  const finishUpload = (val:any) => {
    if(val) isUpload.value = false;
  }
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.ant-form-item-control-input-content) {
  display: flex;
  & > input,
  & > .ant-input-number {
    flex: 1;
  }
}
:deep(.windActive){
  font-weight: 600;
  color: red;
}
:deep(.ant-input-number-group-wrapper) {
  width: 100%;
}
:deep(.fastMoney>div>div){
  float: left;
  .ant-input-number-group-wrapper{
    margin-right: 10px;
  }
}
:deep(.fastMoney){
  .ant-form-item-control{
    width: 450px;
  }
}
.arform {
  gap: 10px;
  justify-content: space-between;
  & > div {
    width: calc((100% - 120px) / 2);
  }
}
.actionBtn {
  padding: 3px 8px;
  margin: 2px;
  border-radius: 4px;
  margin-right: 2px;
  cursor: pointer;
}
.actionBtnColorDel{
  color: #fff;
  background-color: rgb(253, 11, 26);
}
</style>
