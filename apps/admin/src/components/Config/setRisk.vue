<template>
  <a-form
    ref="formRef"
    :model="configState"
    name="riskConfigForm"
    layout="vertical"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <div class="config-table">
      <h4 class="config-title">{{ $t('n1147') }}</h4>

      <!-- 风控配置（div表格） -->
      <div class="table-wrap">
        <!-- 表头 -->
        <div class="table-row table-header">
          <div class="table-cell">{{ $t('n1145') }}</div>
          <div class="table-cell">{{ $t('n1146') }}</div>
          <div class="table-cell">{{ $t('m347') }}</div>
          <div class="table-cell">{{ $t('m374') }}</div>
        </div>

        <!-- 表体 -->
        <div
          class="table-row"
          v-for="record in riskList"
          :key="record.key"
        >
          <div class="table-cell">{{ 'BUY0' + record.key.charAt(1) }}</div>
          <div class="table-cell">{{ record.rule }}</div>
          <div class="table-cell">
            <input type="number"
              v-model="configState.riskConfig[record.key].count"
              :min="0"
              style="width: 100%;"
            />
          </div>
          <div class="table-cell">
            <input type="number"
              v-if="'amount' in configState.riskConfig[record.key] && ![1,2,8].includes(Number(record.key.charAt(1)))"
              v-model="configState.riskConfig[record.key].amount"
              :min="0"
              style="width: 100%;"
            />
            <span v-else>————</span>
          </div>
        </div>
      </div>

      <h4 class="config-title">{{ $t('n1148') }}</h4>

      <!-- 购买限制配置（div表格） -->
      <div class="buy-limit-box">
        <!-- 前两项并列 -->
        <div class="buy-limit-row bordered">
          <div class="buy-limit-item">
            <label>{{ $t('n424') }}</label>
            <a-input-number
              v-model:value="configState.riskConfig.buyLimitAmount"
              :min="0"
            >
              <template #addonAfter>INR</template>
            </a-input-number>
          </div>

          <div class="buy-limit-item">
            <label>{{ $t('n425') }}</label>
            <a-input-number
              v-model:value="configState.riskConfig.buyLimitMinuteTimers"
              :min="0"
            >
              <template #addonAfter>Min</template>
            </a-input-number>
          </div>
        </div>

        <!-- 第三项单独一行 -->
        <div class="buy-limit-item bordered">
          <label>{{ $t('n426') }}</label>
          <a-switch
            v-model:checked="checkMemberDisableAccount"
            @change="changeAddChecked"
            :disabled="!hasPermission('admin:tradeConfigAdmin:windUpdate')"
          />
        </div>
      </div>


        <h4 class="config-title">{{ $t('n1144') }}</h4>
        <!-- 🟦 第一组：风控规则 -->
        <div class="config-section config-section1">
          <div class="config-table">
            <div class="config-thead">
              <div class="th">{{ $t('n1145') }}</div>
              <div class="th">{{ $t('n1146') }}</div>
              <div class="th">{{ $t('minute') }}</div>
              <div class="th">{{ $t('m347') }}</div>
            </div>

            <div
              class="config-row"
              v-for="(item, index) in configState.collectionAccountRiskControlRuleList"
              :key="index"
            >
              <div class="td">{{ item.ruleNo }}</div>
              <div class="td">{{ $t($getMapItem(riskControlRuleMap,item.ruleNo)) }}</div>
              <div class="td">
                <input type="number"
                  v-model="item.timeCycle"
                  :min="0"
                  @blur="handleBlur(item, $event)"
                  @keydown="(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()">
              </div>
              <div class="td">
                <input type="number"
                  v-model="item.triggerTimes"
                  :min="0"
                  @blur="handleBlur(item, $event)"
                  @keydown="(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()">
              </div>
            </div>
          </div>
        </div>

        <!-- 🟥 第二组：惩罚规则 -->
        <h4 class="config-title">{{ $t('n1143') }}</h4>
        <div class="config-section config-section2">

          <div class="config-table">
            <div
              class="config-row"
              v-for="(item, index) in configState.collectionAccountRiskControlPunishRuleList"
              :key="index"
            >
              <div class="td">{{ $t($getMapItem(punishLevelMap,item.punishLevel)) }}</div>
              <div class="td" :class="item.punishLevel != '2'? 'merged2' : ''">{{ $t($getMapItem(punishLevelRemarkMap,item.punishLevel)) }}</div>
              <div class="td" v-if="item.punishLevel == '2'">
                <input type="number"
                  v-model="item.upiBanDuration"
                  :min="0"
                  @blur="handleBlur2(item, $event)"
                  @keydown="(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()"/>
                  {{ $t('minute') }}
              </div>
              <div class="td">
                <a-switch
                  v-model:checked="item.status"
                  :checked-value="1"
                  :un-checked-value="0"
                  checked-children="On"
                  un-checked-children="Off"
                  :disabled="!hasPermission('admin:tradeConfigAdmin:windUpdate')"
                />
              </div>
            </div>
          </div>
        </div>

      <div class="config-submit">
        <a-popconfirm
          :title="$t('m364')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="onFinish"
          
        >
          <a-button type="primary" v-permission="'admin:tradeConfigAdmin:windUpdate'">{{ $t('save') }}</a-button>
        </a-popconfirm>
      </div>
    </div>
  </a-form>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { message, FormInstance } from "ant-design-vue";
import { updateRiskConfigApi } from "@/api/c2cconfig.api";
import { publicConfig } from "@/hooks/usePublicConfig.hook";
import { punishRuleNoMap,riskControlRuleMap,punishLevelMap,punishLevelRemarkMap } from "@/utils/publicData";
import { usePermission } from "@/hooks";
const { hasPermission }=usePermission()

const { t } = useI18n();
const formRef = ref<FormInstance | null>(null);
const { getConfig, configState } = publicConfig();
const checkMemberDisableAccount = ref<boolean>(false);

const riskList = [
  { key: "a1", rule: "A1 " + t("n416") },
  { key: "a2", rule: "A2 " + t("n417") },
  { key: "a3", rule: "A3 " + t("n418") },
  { key: "a4", rule: "A4 " + t("n419") },
  { key: "a5", rule: "A5 " + t("n420") },
  { key: "a6", rule: "A6 " + t("n421") },
  { key: "a7", rule: "A7 " + t("n422") },
  { key: "a8", rule: "A8 " + t("n457") },
];

const changeAddChecked = () => {
  configState.value.riskConfig.disableAccount = checkMemberDisableAccount.value;
};

watch(configState, () => {
  checkMemberDisableAccount.value = !!configState.value.riskConfig.disableAccount;
});

const handleBlur = (item:any, e:any) => {
  const value = Number(e.target.value)
  const min = Number(e.target.min || 0)
  if (isNaN(value) || value < min) {
    item.timeCycle = min
    e.target.value = min
  }
}
const handleBlur2 = (item:any, e:any) => {
  const value = Number(e.target.value)
  const min = Number(e.target.min || 0)
  if (isNaN(value) || value < min) {
    item.upiBanDuration = min
    e.target.value = min
  }
}
const onFinish = async () => {
  const res: any = await updateRiskConfigApi(Object.assign(configState.value.riskConfig,
    {collectionAccountRiskControlRuleList:configState.value.collectionAccountRiskControlRuleList},
    {collectionAccountRiskControlPunishRuleList:configState.value.collectionAccountRiskControlPunishRuleList}));
  if (res && res.code === "1") {
    message.success(t("s1"));
    getConfig();
  }
};

const onFinishFailed = (err: any) => {
  console.log("Failed:", err);
};

onMounted(() => {
  getConfig();
});
</script>

<style lang="less" scoped>
.config-table {
  .config-title {
    margin: 10px 0 0px;
    font-weight: 600;
    color: #333;
  }

  .table-wrap {
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    overflow: hidden;
    font-size: 12px;
    .table-row {
      display: grid;
      border-bottom: 1px solid #f0f0f0;
      grid-template-columns: 1fr 5fr 2fr 2fr;
      height: 30px;
      &:last-child {
        border-bottom: none;
      }

      .table-cell {
        align-items: center;
        justify-content: center;
        border-right: 1px solid #f0f0f0;
        text-align: center;
        line-height: 30px;
        &:last-child {
          border-right: none;
        }
        input{
          width: 80%;
          height: 29px;
          text-align: center;
          border: 1px solid #d9d9d9;
        }
      }

      &.table-header {
        background: #fafafa;
        font-weight: 600;
      }
    }
  }

  .config-submit {
    text-align: center;
    margin-top: 30px;
  }
}
.buy-limit-box {
  .bordered {
    border: 1px solid #e5e6eb;
    background-color: #fff;
    &:first-child {
      border-bottom: none;
    }
  }

  .buy-limit-row {
    display: flex;
    gap: 24px;
    border-right: none
  }

  .buy-limit-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    border-right: 1px solid #e5e6eb;
    width: 100%;
    label {
      min-width: 120px;
      font-weight: 500;
      height: 32px;
      text-align: center;
      line-height: 32px;
      color: #333;
      border-right: 1px solid #e5e6eb;
    }
    :deep(.ant-input-number-group-wrapper){
      width: 100%;
      input{
        text-align: center;
      }
    }
    .ant-input-number {
      flex: 1;
      margin-left: auto;
      margin-right: 0;
    }
    :deep(.ant-switch) {
      margin-left: auto;
      margin-right: 20px ;
    }
  }
}
  .config-section {
    margin-bottom: 30px;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #e5e6eb;
    overflow: hidden;
  }
  
  .config-section1{
    .config-thead,
    .config-row {
      display: grid;
      grid-template-columns: 1fr 4fr 1fr 1fr;
    }
  }
  .config-section2{
    .config-thead,
    .config-row {
      display: grid;
      grid-template-columns: 1fr 4fr 4fr 1fr;
      .merged2{
        grid-column: span 2;
      }
    }
  }
  .config-table {
    .config-thead,
    .config-row {
      border-bottom: 1px solid #e5e6eb;
      text-align: center;
      font-size: 13px;

      .th,
      .td {
        border-right: 1px solid #e5e6eb;
        line-height: 28px;
        input{
          width: 90%;
          height: 28px;
          text-align: center;
        }
      }

      .th {
        font-weight: 600;
        background: #f9f9f9;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>
