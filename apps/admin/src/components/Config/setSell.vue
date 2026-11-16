<template>
  <a-form
    ref="formRef"
    :model="configState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finishFailed="onFinishFailed"
  >
    <div class="config_card_content">
    <a-row>
      <a-col :span="12">
        <!-- <a-form-item
          :label="$t('l22')"
          name="isSplitOrder"
        >
          <a-switch v-model:checked="checkSplit " @click="changeAddChecked" />
        </a-form-item> -->
        <a-form-item
          name="matchOverTimeAutoCancelDuration" 
        >
          <template #label>
            <span class="form-label-wrap">{{ $t('m418') }}</span>
          </template>
          <a-input-number
            v-model:value="configState.matchOverTimeAutoCancelDuration"
            class="width24"
          ><template #addonAfter>
            {{ $t('minute') }}
          </template>
          </a-input-number>
          <tipTemplate :info="$t('n391')"/>
        </a-form-item>
        <!-- <a-form-item
          :label="$t('m742')"
          name="releaseOrderTime"
        >
          <a-input-number
            v-model:value="configState.releaseOrderTime"
            class="width24"
          ><template #addonAfter>
            {{ $t('minute') }}
          </template>
          </a-input-number>
        </a-form-item> -->

        <a-form-item
          name="maxDailyUpiTransactions"
        >
          <template #label>
            <span class="form-label-wrap">{{ $t('n392') }}</span>
          </template>
          <a-input-number
            v-model:value="configState.maxDailyUpiTransactions"
            class="width24"
            ><template #addonAfter>
              {{ $t("m113") }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n393')"/>
        </a-form-item>
        <a-form-item
        :label="$t('m823')"
          name="kycAutoMinAmount"
        >
          <a-input-number
            v-model:value="configState.kycAutoMinAmount"
            class="width24"
            >
            <!-- <template #addonAfter>
              {{ $t("m113") }}
            </template> -->
          </a-input-number>
          <tipTemplate :info="$t('n394')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n395')"
          name="kycRelinkMinLimit"
        >
          <a-input-number
            v-model:value="configState.kycRelinkMinLimit"
            class="width24"
            min="1"
            max="60"
          ><template #addonAfter>
            {{ $t('minute') }}
          </template>
          </a-input-number>
          <tipTemplate :info="$t('n396')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n630')"
          name="kycUnlinkConfirmTimeoutAutoCloseDuration"
        >
          <a-input-number
            v-model:value="configState.kycUnlinkConfirmTimeoutAutoCloseDuration"
            class="width24"
            min="0"
            max="999"
          ><template #addonAfter>
            {{ $t('minute') }}
          </template>
          </a-input-number>
          <tipTemplate :info="$t('n631')"/>
        </a-form-item>
        <!-- <a-form-item
          :label="$t('m478')"
          name="isManualReview"
        >
          <a-switch v-model:checked="manualReview " @click="changeManualChecked" />
        </a-form-item> -->
      <a-form-item
        :label="$t('m476')"
        name="manualReviewTime"
        v-if="manualReview"
      >
        <a-input-number
          v-model:value="configState.manualReviewTime"
          class="width24"
        ><template #addonAfter>
          {{ $t('minute') }}
        </template>
        </a-input-number>
      </a-form-item>
      <!-- <a-form-item
        :label="$t('m477')"
        name="manualReviewArbFreezeTime"
        v-if="manualReview"
      >
        <a-input-number
          v-model:value="configState.manualReviewArbFreezeTime"
          class="width24"
        ><template #addonAfter>
          {{ $t('minute') }}
        </template>
        </a-input-number>
      </a-form-item> -->
        <a-form-item :label="$t('n629')" name="cancelMatchTimesLimit">
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
        </a-form-item>
      </a-col>
      <a-col :span="11">
        <a-form-item
          name="buyAmountRankBeforeDays"
        >
          <template #label>
            <span class="form-label-wrap">{{ $t('n397') }}</span>
          </template>
          <a-input-number
            v-model:value="configState.buyAmountRankBeforeDays"
            :min="1"
            :max="5"
            class="width24"
          ><template #addonAfter>
            {{ $t('n341') }}
          </template>
          </a-input-number>
          <tipTemplate :info="$t('n398')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n399')"
          name="splitDivisorListLimit"
        >
          <a-input-number
            v-model:value="configState.splitDivisorListLimit"
            :min="1"
            class="width24"
          ><template #addonAfter>
            {{ $t('n343') }}
          </template>
          </a-input-number>
          <tipTemplate :info="$t('n400')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n401')"
          name="maxSplitCount"
        >
          <a-input-number
            v-model:value="configState.maxSplitCount"
            :min="1"
            class="width24"
          ><template #addonAfter>
            {{ $t('m113') }}
          </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          :label="$t('n345')"
          name="compensatingDivisor"
        >
          <a-input-number
            v-model:value="configState.compensatingDivisor"
            :min="1"
            class="width24"
          ><template #addonAfter>
            INR
          </template>
          </a-input-number>
          <div class="config-tipMsg">{{ $t("n346") }}</div>
        </a-form-item>
        <a-form-item
          :label="$t('n358')"
          name="autoFinishTimeoutCount"
        >
          <a-input-number
            v-model:value="configState.autoFinishTimeoutCount"
            :min="0"
            class="width24"
          >
          <template #addonBefore>
            {{ $t('n359') }}
          </template>
          <template #addonAfter>
            {{ $t('times') }}
          </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          :label="$t('n668')"
          name="matchingMaximumCount"
        >
          <a-input-number
            v-model:value="configState.matchingMaximumCount"
            :min="0"
            class="width24"
          >
          <template #addonAfter>
            {{ $t('times') }}
          </template>
          </a-input-number>
          <tipTemplate :info="$t('n669')"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <!-- <a-form-item
        :label="$t('n402')"
          name="kycExpRiskControlTimeCycle"
        >
          <a-input-number
            v-model:value="configState.kycExpRiskControlTimeCycle"
            min="0"
            class="width24"
            ><template #addonAfter>
              {{ $t("minute") }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n403')"/>
        </a-form-item> -->
        <a-form-item
        :label="$t('n880')"
          name="channelOrderConfirmTimeoutAutoFailTime"
        >
          <a-input-number
            v-model:value="configState.channelOrderConfirmTimeoutAutoFailTime"
            min="0"
            max="10000000"
            class="width24"
            placeholder="1-10000000"
            ><template #addonAfter>
              {{ $t("s") }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n881')"/>
        </a-form-item>
      </a-col>
      <a-col :span="11">
        <!-- <a-form-item
        :label="$t('n268')"
          name="cancelTimesInCycle"
        >
          <a-input-number
            v-model:value="configState.cancelTimesInCycle"
            class="width24"
            min="0"
            >
            <template #addonAfter>
              {{ $t("times") }}
            </template>
          </a-input-number>
        </a-form-item> -->
        <a-form-item
        :label="$t('n1527')"
          name="autoSellFailureCooldownMinutes"
        >
          <a-input-number
            v-model:value="configState.autoSellFailureCooldownMinutes"
            class="width24"
            min="0"
            >
            <template #addonAfter>
              {{ $t("minute") }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1528')"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item :wrapper-col="{ offset: 11, span: 16 }">
      <a-popconfirm
        :title=" $t('m364') "
        :ok-text="$t('yes')"
        :cancel-text="$t('no')"
        @confirm="onFinish"
      >
        <a-button
          type="primary"
          v-permission="'admin:tradeConfigAdmin:updateSell'"
          >{{ $t("save") }}</a-button
        >
      </a-popconfirm>
    </a-form-item>
    </div>
  </a-form>
  <fixedRewardConfig
    trade-type="sell"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    :save-offset="11"
  />
  <systemAutoSellConfig
    :config="configState"
    :loading="configLoading"
    :load-failed="configLoadFailed"
    @saved="onAutoSellSaved"
    @reload="reloadConfig"
  />
</template>

<script lang="ts" setup>
import { updateSellApi } from "@/api/c2cconfig.api";
import { publicConfig } from "@/hooks/usePublicConfig.hook";
import { message,FormInstance } from "ant-design-vue";
import tipTemplate from "../Other/tipTemplate.vue";
import fixedRewardConfig from "./fixedRewardConfig.vue";
import systemAutoSellConfig from "./systemAutoSellConfig.vue";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const formRef = ref<FormInstance | null>(null);
const { getConfig, configState, configLoading, configLoadFailed } = publicConfig();
const checkSplit = ref<boolean>(false);
const manualReview = ref<boolean>(false);

const changeAddChecked = () => {
  checkSplit.value
    ? (configState.value.isSplitOrder = 1)
    : (configState.value.isSplitOrder = 0);
};
const changeManualChecked = () => {
  manualReview.value
    ? (configState.value.isManualReview = 1)
    : (configState.value.isManualReview = 0);
};
const onFinish = async () => {
  formRef.value?.validate().then(async (values) => {
    const res: any = await updateSellApi(
      Object.assign(values, { id: configState.value.id })
    );
    if (res && res.code === "1") {
      message.success(t("s1"));
      getConfig();
    }
  });
};
watch(configState, () => {
  configState.value.isSplitOrder === 1
    ? (checkSplit.value = true)
    : (checkSplit.value = false);
  configState.value.isManualReview === 1
    ? (manualReview.value = true)
    : (manualReview.value = false);
});
const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
// 破解APP自动卖出配置加载失败后点击重试；失败已由请求拦截器提示、卡片展示失败状态，这里不再向外抛出
const reloadConfig = () => getConfig().catch(() => {});
// 破解APP自动卖出配置保存成功后只合并该卡片已提交的字段，不重新拉取整份配置，避免冲掉主表单未保存的修改
const onAutoSellSaved = (fields: any) => {
  Object.assign(configState.value, fields);
};
onMounted(() => {
  getConfig();
});
</script>

<style lang="less" scoped>
.width24 {
  width: 240px;
}
.width20 {
  width: 200px;
}
.container {
  display: flex;
  & > div {
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
</style>
