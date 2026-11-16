<template>
  <a-form
    ref="formRef"
    :model="configState"
    name="basic"
    :label-col="{ span: 10 }"
    :wrapper-col="{ span: 14 }"
    autocomplete="off"
    @finishFailed="onFinishFailed"
  >
    <div>
      <a-row class="config_card_content">
        <a-col :span="11">
          <a-form-item :label="$t('m379')" name="voicePaymentReminderEnabled">
            <a-switch v-model:checked="checkVoice" @click="changeAddChecked" :disabled="!hasPermission('admin:tradeConfigAdmin:elseUpdate')"/>
          </a-form-item>
          <a-form-item :label="$t('m916')">
            {{ configState.smsBalance || -1 }}{{ $t("m462") }}
            <tipTemplate :info="$t('n375')"/>
            <!-- <a-input-number
              v-model:value="configState.smsBalance"
              class="w-full"
            >
              <template #addonAfter>
                {{ $t("m462") }}
              </template>
            </a-input-number> -->
          </a-form-item>
          <a-form-item :label="$t('m475')" name="messageBalanceThreshold">
            <a-input-number
              v-model:value="configState.messageBalanceThreshold"
              class="width24"
            >
              <template #addonAfter>
                {{ $t("m462") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n376')"/>
          </a-form-item>
          <!-- <a-form-item :label="$t('m570')" name="tradeCreditScoreLimit">
            <a-input-number
              v-model:value="configState.tradeCreditScoreLimit"
              class="width24"
              min="0"
            >
              <template #addonAfter>
                {{ $t("m538") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n377')"/>
          </a-form-item> -->
          <a-form-item :label="$t('m602')" name="merchantOrderUncreatedTime">
            <a-input-number
              v-model:value="configState.merchantOrderUncreatedTime"
              class="width24"
              min="0"
            >
              <template #addonAfter>
                {{ $t("hour") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n378')"/>
          </a-form-item>
          <a-form-item :label="$t('n1448')" name="waterValidityDuration">
            <a-input-number
              v-model:value="configState.waterValidityDuration"
              class="width24"
              min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
          </a-form-item>
          <a-form-item :label="$t('n1469')" name="priorityMatchTime">
            <a-input-number
              v-model:value="configState.priorityMatchTime"
              class="width24"
              min="0"
            >
              <template #addonAfter>
                {{ $t("s") }}
              </template>
            </a-input-number>
          </a-form-item>
          <!-- <a-form-item :label="$t('m666')">
          <a-input-group compact>
            <a-input-number
              v-model:value="configState.minBankCodeNumber"
              min="0"
              :max="configState.maxBankCodeNumber"
            />
            <a-input-number
              v-model:value="configState.maxBankCodeNumber"
              :min="configState.minBankCodeNumber"
              max="25"
            />
          </a-input-group>
          </a-form-item> -->
          <!-- <a-form-item :label="$t('n629')" name="cancelMatchTimesLimit">
            <a-input-number
              v-model:value="configState.cancelMatchTimesLimit"
              class="width24"
              min="0"
            >
              <template #addonAfter>
                {{ $t("times") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n379')"/>
          </a-form-item> -->
          <!-- <a-form-item :label="$t('m687')" name="matchQuadTradeStatusList">
            <a-checkbox-group v-model:value="configState.matchQuadTradeStatusList" 
            :options="Object.entries(buyPayMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))" 
            @change="changeBuyPay"
            />
            <div class="config-tipMsg">{{ $t("m688") }}</div>
          </a-form-item> -->
          <!-- <a-form-item :label="$t('n104')+$t('m671')" name="matchQuadChannelLevelList">
            <a-checkbox-group 
            v-model:value="configState.matchQuadChannelLevelList" 
            :options="Object.entries(channelLeverList).map(([key, value]:[any,any]) => ({ value: key, label: value }))" />
            <div class="config-tipMsg">{{ $t("m672") }}</div>
          </a-form-item> -->
          <!-- <a-form-item :label="$t('n100')+$t('m671')" name="matchQuadChannelSellLevelList">
            <a-checkbox-group 
            v-model:value="configState.matchQuadChannelSellLevelList" 
            :options="Object.entries(channelLeverList).map(([key, value]:[any,any]) => ({ value: key, label: value }))" />
            <div class="config-tipMsg">{{ $t("m689") }}</div>
          </a-form-item> -->
        </a-col>
        <a-col :span="11">
          <!-- <a-form-item :label="$t('m922')" name="kycBuyAutoAppealDuration">
            <a-input-number
              v-model:value="configState.kycBuyAutoAppealDuration"
              class="w-full"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
          </a-form-item> -->
          <!-- <a-form-item :label="$t('m923')" name="kycSellAutoAppealDuration">
            <a-input-number
              v-model:value="configState.kycSellAutoAppealDuration"
              class="w-full"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
          </a-form-item> -->
          <!-- <a-form-item :label="$t('m931')" name="kycBuyAutoAppealTimesLimit">
            <a-input-number
              v-model:value="configState.kycBuyAutoAppealTimesLimit"
              class="w-full"
            >
              <template #addonAfter>
                {{ $t("times") }}
              </template>
            </a-input-number>
          </a-form-item> -->
          <!-- <a-form-item :label="$t('m954')" name="kycBuyAutoAppealUnlinkLimit">
            <a-input-number
              v-model:value="configState.kycBuyAutoAppealUnlinkLimit"
              class="w-full"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
          </a-form-item> -->
          <!-- <a-form-item
            :label="$t('m958')"
            name="buyAppealPullTimeLimit"
          >
            <a-input-number v-model:value="configState.buyAppealPullTimeLimit" :min="0" class="w-full" >
              <template #addonAfter>
                {{ $t('times') }}
              </template>
            </a-input-number>
          </a-form-item> -->
          <a-form-item
            :label="$t('n380')"
            name="kycBuyAppealWaterPullTimesLimit"
          >
            <a-input-number v-model:value="configState.kycBuyAppealWaterPullTimesLimit" :min="0" class="width24" >
              <template #addonAfter>
                {{ $t('times') }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n381')"/>
          </a-form-item>
          <a-form-item
            :label="$t('n382')"
            name="kycSellAppealWaterPullTimesLimit"
          >
            <a-input-number v-model:value="configState.kycSellAppealWaterPullTimesLimit" :min="0" class="width24" >
              <template #addonAfter>
                {{ $t('times') }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n383')"/>
          </a-form-item>
          <a-form-item :label="$t('n182')" name="thirdFastRechargeDelayTime">
            <a-input-number
              v-model:value="configState.thirdFastRechargeDelayTime"
              :min="0"
              class="width24"
            >
              <template #addonAfter>
                {{ $t("m538") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n384')"/>
            <!-- <div :style="configState.rechargeExpirationTime > configState.thirdFastRechargeDelayTime ? 'color:red' :''" class="config-tipMsg">{{ $t("n186") }}</div> -->
          </a-form-item>
          <a-form-item :label="$t('n385')" name="tradeRiskMaxAmount">
            <a-input-number
              v-model:value="configState.tradeRiskMaxAmount"
              :min="0"
              class="width24"
            >
              <template #addonAfter>
                INR
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n386')"/>
            <!-- <div class="config-tipMsg">{{ $t("n245") }}</div> -->
          </a-form-item>
          <a-form-item :label="$t('n1336')" name="quickWithdrawConsecutiveUnsuccessfulOrderLimit">
            <a-input-number
              v-model:value="configState.quickWithdrawConsecutiveUnsuccessfulOrderLimit"
              :min="0"
              class="width24"
            >
              <template #addonAfter>
                {{ $t("times") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1337')"/>
          </a-form-item>
          <a-form-item :label="$t('n1338')" name="kycDisconnectThresholdSeconds">
            <a-input-number
              v-model:value="configState.kycDisconnectThresholdSeconds"
              :min="0"
              class="width24"
            >
              <template #addonAfter>
                {{ $t("s") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1339')"/>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="config_card_content">
        <h4>{{ $t('n1850') }}</h4>
        <a-row>
          <a-col :span="11">
            <a-form-item :label="$t('n1852')">
              <div class="range-wrapper">
                <a-form-item name="timeRangeAmountMinLimit" no-style>
                  <a-input-number
                    v-model:value="configState.timeRangeAmountMinLimit"
                    class="width20"
                    :min="RANGE_MIN_AMOUNT"
                    :max="REGULAR_FINISH_RANGE_MAX_AMOUNT"
                    :precision="0"
                    placeholder="Min"
                    @keydown="(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()"
                  >
                    <template #addonAfter>
                      INR
                    </template>
                  </a-input-number>
                </a-form-item>
                <span class="range-separator">—</span>
                <a-form-item name="timeRangeAmountMaxLimit" no-style>
                  <a-input-number
                    v-model:value="configState.timeRangeAmountMaxLimit"
                    class="width20"
                    :min="RANGE_MIN_AMOUNT"
                    :max="REGULAR_FINISH_RANGE_MAX_AMOUNT"
                    :precision="0"
                    placeholder="Max"
                    @keydown="(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()"
                  >
                    <template #addonAfter>
                      INR
                    </template>
                  </a-input-number>
                </a-form-item>
                <tipTemplate :info="$t('n1853')"/>
              </div>
            </a-form-item>
            <a-form-item :label="$t('n1851')" name="timeRangeAmountLimit">
              <a-input-number
                v-model:value="configState.timeRangeAmountLimit"
                class="width24"
                :min="0"
              >
                <template #addonAfter>
                  INR
                </template>
              </a-input-number>
              <tipTemplate :info="$t('n1805')"/>
            </a-form-item>
            <a-form-item :label="$t('n1856')" name="regularAmountFinishSplitIntervalSeconds">
              <a-input-number
                v-model:value="configState.regularAmountFinishSplitIntervalSeconds"
                class="width24"
                :min="0"
                :precision="0"
              >
                <template #addonAfter>
                  {{ $t("s") }}
                </template>
              </a-input-number>
              <tipTemplate :width="240">
                <table class="tip-table">
                  <thead>
                    <tr>
                      <th colspan="2">{{ $t('n1857') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in splitGapReferenceList" :key="item.label">
                      <td>{{ item.label }}</td>
                      <td>{{ item.rate }}</td>
                    </tr>
                  </tbody>
                </table>
              </tipTemplate>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item :label="$t('n1854')" name="regularAmountFinishValidSeconds">
              <a-input-number
                v-model:value="configState.regularAmountFinishValidSeconds"
                class="width24"
                :min="0"
                :precision="0"
              >
                <template #addonAfter>
                  {{ $t("s") }}
                </template>
              </a-input-number>
              <tipTemplate :info="$t('n1855')"/>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="config_card_content">
        <h4>{{ $t('n1752') }}</h4>
        <a-row>
          <a-col :span="11">
            <a-form-item :label="$t('n1753')" name="availableMemberTypes">
              <a-select
                v-model:value="configState.smartGrabOrderConfig.availableMemberTypes"
                class="width24"
                :placeholder="$t('m563')+$t('n1753')"
                mode="multiple"
                allowClear
                :options="Object.entries(memberTypeList).map(([key, value]:[any,any]) => ({ label: $t(value), value: key }))"
              >
              </a-select>
              <tipTemplate :info="$t('n1754')"/>
            </a-form-item>
            <a-form-item :label="$t('n1755')" name="memberLevels">
              <a-select
                v-model:value="configState.smartGrabOrderConfig.memberLevels"
                class="width24"
                :placeholder="$t('m563')+$t('n1755')"
                mode="multiple"
                allowClear
                :options="Object.entries(channelLeverList).map(([key, value]:[any,any]) => ({ label: $t(value), value: Number(key) }))"
              >
              </a-select>
              <tipTemplate :info="$t('n1756')"/>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item :label="$t('n1757')" name="availableBuyListTypes">
              <a-select
                v-model:value="configState.smartGrabOrderConfig.availableBuyListTypes"
                class="width24"
                :placeholder="$t('m563')+$t('n1757')"
                mode="multiple"
                allowClear
              >
                <a-select-option value="OTP-UPI">
                  OTP-UPI
                </a-select-option>
                <a-select-option value="BANK">
                  BANK
                </a-select-option>
              </a-select>
              <tipTemplate :info="$t('n1758')"/>
            </a-form-item>
            <a-form-item :label="$t('n1844')">
              <a-input-number
                v-model:value="configState.smartGrabOrderConfig.lowOrderRate"
                class="width24"
                :min="0"
                :max="100"
              >
                <template #addonAfter>
                  %
                </template>
              </a-input-number>
              <tipTemplate :info="$t('n1845')"/>
            </a-form-item>
            <a-form-item
              v-for="group in smartPageLayoutGroups"
              :key="group.key"
              :label="$t('n1985', { n: group.name })"
            >
              <a-select
                v-model:value="configState.smartGrabOrderConfig[group.key]"
                class="width24"
                :placeholder="$t('m563')+$t('n1985', { n: group.name })"
              >
                <a-select-option :value="1">
                  {{ $t('n1986') }}
                </a-select-option>
                <a-select-option :value="2">
                  {{ $t('n1934') }}
                </a-select-option>
              </a-select>
              <tipTemplate :info="$t('n1987')"/>
            </a-form-item>
            <!-- <a-form-item :label="$t('n1759')">
              <div class="range-wrapper">

                <a-form-item
                  name="cancelLimit24Hours"
                  no-style
                >
                  <a-input-number
                    v-model:value="configState.smartGrabOrderConfig.cancelLimit24Hours"
                    style="width: 100px"
                    :min="1"
                  >
                    <template #addonAfter>
                      {{ $t('m113') }}
                    </template>
                  </a-input-number>
                </a-form-item>

                <span class="range-separator">{{ $t('n1760') }}</span>

                <a-form-item
                  name="cancelCooldownSeconds"
                  no-style
                >
                  <a-input-number
                    v-model:value="configState.smartGrabOrderConfig.cancelCooldownSeconds"
                    style="width: 100px"
                    :min="1"
                  >
                    <template #addonAfter>
                      {{ $t('s') }}
                    </template>
                  </a-input-number>
                  <span style="margin-top: -2px;">
                    <tipTemplate :info="$t('n1761')"/>
                  </span>
                </a-form-item>
              </div>
            </a-form-item> -->
          </a-col>
        </a-row>
        <div class="amount-range-groups">
          <a-form-item
            v-for="group in amountRangeGroups"
            :key="group.key"
            class="amount-range-group"
            :label="$t('n1846', { n: group.name })"
          >
            <a-form-item-rest>
            <div class="amount-range-list">
              <div
                v-for="(range, index) in configState.smartGrabOrderConfig[group.key]"
                :key="index"
                class="amount-range-item"
              >
                <a-input-number
                  v-model:value="range.minAmount"
                  style="width: 100px"
                  :min="RANGE_MIN_AMOUNT"
                  :max="RANGE_MAX_AMOUNT"
                  :precision="0"
                />
                <span class="range-separator">—</span>
                <a-input-number
                  v-model:value="range.maxAmount"
                  style="width: 100px"
                  :min="range.minAmount || RANGE_MIN_AMOUNT"
                  :max="RANGE_MAX_AMOUNT"
                  :precision="0"
                />
                <MinusCircleOutlined class="amount-range-remove" @click="removeBuyAmountRange(group.key, index)" />
              </div>
              <div
                v-if="(configState.smartGrabOrderConfig[group.key]?.length || 0) < MAX_AMOUNT_RANGES"
                class="amount-range-item"
              >
                <a-button style="width: 100px" @click="addBuyAmountRange(group.key)">+</a-button>
                <tipTemplate :info="$t('n1773')"/>
              </div>
            </div>
            </a-form-item-rest>
          </a-form-item>
        </div>
      </div>
      <div class="config_card_content">
        <h4>{{ $t('n1082') }}</h4>
      <a-row>
        <a-col :span="11">
          <a-form-item :label="$t('n1054')" name="telegramAppealWarningCount">
            <a-input-number
              v-model:value="configState.telegramAppealWarningCount"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("m113") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1055')"/>
          </a-form-item>
          <a-form-item :label="$t('n883')" name="quickWithdrawTelegramNotification">
            <a-input-number
              v-model:value="configState.quickWithdrawTelegramNotification"
              class="width24"
              min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n884')"/>
          </a-form-item>
          <a-form-item :label="$t('n1056')" name="telegramMerchantCollectWarningCount">
            <a-input-number
              v-model:value="configState.telegramMerchantCollectWarningCount"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("m113") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1057')"/>
          </a-form-item>
          <a-form-item :label="$t('n1058')" name="telegramMerchantPaymentWarningCount">
            <a-input-number
              v-model:value="configState.telegramMerchantPaymentWarningCount"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("m113") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1059')"/>
          </a-form-item>
          <a-form-item :label="$t('n1060')" name="telegramMatchWarningCount">
            <a-input-number
              v-model:value="configState.telegramMatchWarningCount"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("m113") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1061')"/>
          </a-form-item>
          <!-- <a-form-item :label="$t('快捷提现机器人推送时间')" name="messageBalanceThreshold">
            <a-input-number
              v-model:value="configState.messageBalanceThreshold"
              class="width24"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('TG机器人会根据此配置时间自动推送快捷提现订单信息')"/>
          </a-form-item> -->
          <a-form-item :label="$t('n1062')" name="telegramNoCreateOrderWarningTimer">
            <a-input-number
              v-model:value="configState.telegramNoCreateOrderWarningTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1063')"/>
          </a-form-item>
        </a-col>
        <a-col :span="11">
          <a-form-item :label="$t('n1064')" name="telegramKycWaterWarningForAirtelTimer">
            <a-input-number
              v-model:value="configState.telegramKycWaterWarningForAirtelTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1065')"/>
          </a-form-item>
          <a-form-item :label="$t('n1066')" name="telegramKycWaterWarningForFreeChargeTimer">
            <a-input-number
              v-model:value="configState.telegramKycWaterWarningForFreeChargeTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1067')"/>
          </a-form-item>
          <a-form-item :label="$t('n1068')" name="telegramKycWaterWarningForPaytmTimer">
            <a-input-number
              v-model:value="configState.telegramKycWaterWarningForPaytmTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1069')"/>
          </a-form-item>
          <a-form-item :label="$t('n1070')" name="telegramKycWaterWarningForPhonePeTimer">
            <a-input-number
              v-model:value="configState.telegramKycWaterWarningForPhonePeTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1071')"/>
          </a-form-item>
          <a-form-item :label="$t('n1072')" name="telegramKycWaterWarningForMobikwikTimer">
            <a-input-number
              v-model:value="configState.telegramKycWaterWarningForMobikwikTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1073')"/>
          </a-form-item>
          <a-form-item :label="$t('n1270')" name="telegramKeyWaterWarningForSuperMoneyTimer">
            <a-input-number
              v-model:value="configState.telegramKeyWaterWarningForSuperMoneyTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1271')"/>
          </a-form-item>
          <a-form-item :label="$t('n1323')" name="telegramKeyWaterWarningForSliceTimer">
            <a-input-number
              v-model:value="configState.telegramKeyWaterWarningForSliceTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1324')"/>
          </a-form-item>
          <a-form-item :label="$t('n1347')" name="telegramKeyWaterWarningForFreoTimer">
            <a-input-number
              v-model:value="configState.telegramKeyWaterWarningForFreoTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1348')"/>
          </a-form-item>
          <a-form-item :label="$t('n1655',{n: 'TWID'})" name="telegramKycWaterWarningForTwidTimer">
            <a-input-number
              v-model:value="configState.telegramKycWaterWarningForTwidTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1656',{n: 'TWID'})"/>
          </a-form-item>
          <a-form-item :label="$t('n1655',{n: 'NAVI'})" name="telegramKycWaterWarningForNaviTimer">
            <a-input-number
              v-model:value="configState.telegramKycWaterWarningForNaviTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1656',{n: 'NAVI'})"/>
          </a-form-item>
          <a-form-item :label="$t('n1655',{n: 'MoneyView'})" name="telegramKycWaterWarningForMoneyViewTimer">
            <a-input-number
              v-model:value="configState.telegramKycWaterWarningForMoneyViewTimer"
              class="width24"
              :min="0"
            >
              <template #addonAfter>
                {{ $t("minute") }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1656',{n: 'MoneyView'})"/>
          </a-form-item>
        </a-col>
      </a-row>
      </div>
      <div class="save-bar">
        <a-popconfirm
          :title=" $t('m364') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="onFinish"
        >
          <a-button type="primary" v-permission="'admin:tradeConfigAdmin:elseUpdate'" html-type="submit">{{ $t("save") }}</a-button>
        </a-popconfirm>
      </div>
    </div>
  </a-form>
</template>

<script lang="ts" setup>
import { updateVoiceApi } from "@/api/c2cconfig.api";
import { publicConfig } from "@/hooks/usePublicConfig.hook";
import { message,FormInstance } from "ant-design-vue";
import tipTemplate from "../Other/tipTemplate.vue";
import { memberTypeList } from "@/utils/publicData";
import { MinusCircleOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { usePermission } from "@/hooks";
const { hasPermission }=usePermission()
const { t } = useI18n();
const formRef = ref<FormInstance | null>(null);
const { getConfig, configState } = publicConfig();
const checkVoice = ref<boolean>(false)
const channelLeverList = ref({
  0:'L0',
  1:'L1',
  2:'L2',
  3:'L3',
  4:'L4',
  5:'L5',
  6:'L6',
  7:'L7',
  8:'L8',
  9:'L9',
  10:'L10',
})
const buyPayMap = ref({
  1: t('n104'),
  2: t('n100'),
})
const changeAddChecked = ()=>{
  checkVoice.value? configState.value.voicePaymentReminderEnabled = 1 : configState.value.voicePaymentReminderEnabled = 0;
}
const MAX_AMOUNT_RANGES = 30; // 每组金额段上限
const RANGE_MIN_AMOUNT = 100; // 金额段最小值
const RANGE_MAX_AMOUNT = 50000; // 金额段最大值
type AmountRangeKey = 'otpUpiAmountRanges' | 'bankAmountRanges';
const amountRangeGroups: { key: AmountRangeKey; name: string }[] = [
  { key: 'otpUpiAmountRanges', name: 'OTP-UPI' },
  { key: 'bankAmountRanges', name: 'BANK' },
]
// 买入列表页面智能抢单布局：1-智能抢单+自选 2-智能抢单
type SmartPageLayoutKey = 'otpUpiSmartPageLayout' | 'bankSmartPageLayout';
const smartPageLayoutGroups: { key: SmartPageLayoutKey; name: string }[] = [
  { key: 'otpUpiSmartPageLayout', name: 'OTP-UPI' },
  { key: 'bankSmartPageLayout', name: 'BANK' },
]
const addBuyAmountRange = (key: AmountRangeKey) => {
  if (!configState.value.smartGrabOrderConfig[key]) {
    configState.value.smartGrabOrderConfig[key] = [];
  }
  if (configState.value.smartGrabOrderConfig[key].length >= MAX_AMOUNT_RANGES) return;
  configState.value.smartGrabOrderConfig[key].push({ minAmount: null, maxAmount: null });
}
const removeBuyAmountRange = (key: AmountRangeKey, index: number) => {
  configState.value.smartGrabOrderConfig[key].splice(index, 1);
}
const validateBuyAmountRanges = () => {
  for (const group of amountRangeGroups) {
    const ranges = configState.value.smartGrabOrderConfig?.[group.key] || [];
    for (const range of ranges) {
      if (range.minAmount === null || range.minAmount === undefined || range.maxAmount === null || range.maxAmount === undefined) {
        message.error(t('m562') + t('n1846', { n: group.name }));
        return false;
      }
      if (range.minAmount < RANGE_MIN_AMOUNT || range.maxAmount > RANGE_MAX_AMOUNT) {
        message.error(t('n1847'));
        return false;
      }
      if (range.minAmount > range.maxAmount) {
        message.error(t('n453'));
        return false;
      }
    }
    const rangeKeys = ranges.map((range: any) => `${range.minAmount}-${range.maxAmount}`);
    if (new Set(rangeKeys).size !== rangeKeys.length) {
      message.error(t('n1775'));
      return false;
    }
  }
  return true;
}
// 常规金额完单-同金额拆单时差 提示表格数据
const splitGapReferenceList = [
  { label: `≤15${t('s')}`, rate: '9.9%' },
  { label: `≤30${t('s')}`, rate: '56.7%' },
  { label: `≤45${t('s')}`, rate: '87.2%' },
  { label: `≤60${t('s')}`, rate: '94.3%' },
  { label: `≤90${t('s')}`, rate: '97.9%' },
  { label: `≤120${t('s')}`, rate: '98.6%' },
  { label: `≤5${t('minute')}`, rate: '100%' },
]
const REGULAR_FINISH_RANGE_MAX_AMOUNT = 100000; // 常规金额完单金额范围最大值
// 常规金额完单金额范围：必填、100~100000 正整数、最小值不能大于最大值
const validateTimeRangeAmountLimit = () => {
  const min = configState.value.timeRangeAmountMinLimit;
  const max = configState.value.timeRangeAmountMaxLimit;
  if (min === null || min === undefined || min === '' || max === null || max === undefined || max === '') {
    message.error(t('m562') + t('n1852'));
    return false;
  }
  if ([min, max].some((v) => Number(v) < RANGE_MIN_AMOUNT || Number(v) > REGULAR_FINISH_RANGE_MAX_AMOUNT)) {
    message.error(t('n1858'));
    return false;
  }
  if (Number(min) > Number(max)) {
    message.error(t('n453'));
    return false;
  }
  return true;
}
const onFinish = async (values: any) => {
    if(configState.value.rechargeExpirationTime > configState.value.thirdFastRechargeDelayTime){
      message.error(t('n186'));
      return;
    }
    if(!validateBuyAmountRanges()){
      return;
    }
    if(!validateTimeRangeAmountLimit()){
      return;
    }
  formRef.value?.validate().then(async (values) => {
    const res: any = await updateVoiceApi(
      Object.assign(values, { id: configState.value.id,
        minBankCodeNumber: configState.value.minBankCodeNumber,
        maxBankCodeNumber: configState.value.maxBankCodeNumber,
        smartGrabOrderConfig: configState.value.smartGrabOrderConfig,
        })
    );
    if (res && res.code === "1") {
      message.success(t('s1'));
      getConfig();
    }
  });
};
watch(configState,()=>{
  configState.value.voicePaymentReminderEnabled === 1 ? checkVoice.value = true : checkVoice.value = false;
})
const changeBuyPay = ()=>{
  if(configState.value.matchQuadTradeStatusList.length == 0){
    configState.value.matchQuadChannelLevelList = []
  }
}
const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
onMounted(() => {
  getConfig();
});
</script>

<style lang="less" scoped>
// 保存按钮吸底：随页面滚动始终停留在内容区底部
.save-bar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  padding: 12px 0;
  margin-top: 5px;
}
.width24 {
  width: 240px;
}
.width20 {
  width: 200px;
}
.container {
  display: flex;
  &>div {
    width: 50%;
  }
}
.config-tipMsg{
  font-size: 11px;
  color: #02A7F0;
}
:deep(.tipIcon){
  margin-top: 8px;
}

.range-wrapper {
  display: flex;
  align-items: center;
}

.range-separator {
  margin: 0 8px;
}

.tip-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  th, td {
    border: 1px solid #ddd;
    padding: 4px 8px;
  }
  th {
    font-weight: 500;
  }
}

.amount-range-groups {
  container-type: inline-size;
  display: flex;
}

// 与上方 a-col span 11 两列对齐，OTP-UPI 在左列、BANK 在右列
.amount-range-group {
  flex: 0 0 calc(100% * 11 / 24);
  max-width: calc(100% * 11 / 24);
}
// 双列金额段会伸入 BANK 标签左侧空白区，让点击穿透到下方输入框
.amount-range-group + .amount-range-group :deep(.ant-form-item-label) {
  pointer-events: none;
}

.amount-range-list {
  display: grid;
  grid-template-columns: max-content;
  gap: 8px 32px;
}
// 宽度足够时每组金额段双列显示
@container (min-width: 1560px) {
  .amount-range-list {
    grid-template-columns: repeat(2, max-content);
  }
}

.amount-range-item {
  display: flex;
  align-items: center;
}

.amount-range-remove {
  margin-left: 8px;
  color: #999;
  cursor: pointer;
  &:hover {
    color: #ff4d4f;
  }
}
</style>
