<template>
  <a-form
    ref="formRef"
    :model="configState"
    name="basic"
    :label-col="{ span: 9 }"
    :wrapper-col="{ span: 15 }"
    autocomplete="off"
    labelAlign="right"
    @finishFailed="onFinishFailed"
  >
  <div class="config_card_content">
    <a-row>
      <a-col :span="12">
        <a-form-item
          :label="$t('n373')"
          name="rechargeExpirationTime"
        >
          <a-input-number
            v-model:value="configState.rechargeExpirationTime"
            class="width24"
          >
            <template #addonAfter>
              {{ $t('minute') }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n374')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1780')"
          name="externalMerchantUpiExpirationTime"
        >
          <a-input-number
            v-model:value="configState.externalMerchantUpiExpirationTime"
            class="width24"
          >
            <template #addonAfter>
              {{ $t('minute') }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1781')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n849')"
          name="externalMerchantExpirationTime"
        >
          <a-input-number
            v-model:value="configState.externalMerchantExpirationTime"
            class="width24"
          >
            <template #addonAfter>
              {{ $t('minute') }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n374')"/>
        </a-form-item>
        <a-form-item
          :label="$t('l10')"
          name="usdtCurrency"
        >
          <a-input-number v-model:value="configState.usdtCurrency" class="width20" >
            <template #addonBefore>
              1 USDT
            </template>
              <template #addonAfter>
                ARB
              </template>
          </a-input-number>
          <tipTemplate :info="$t('n404')"/>
        </a-form-item>
        <!-- <a-form-item
          :label="$t('m956')"
          name="usdtBuyReward"
          :rules="[{required:true,message:''}]"
        >
          <a-input-number v-model:value="configState.usdtBuyReward" :min="0" class="width20" >
            <template #addonAfter>
              %
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n405')"/>
        </a-form-item> -->
        <a-form-item
          :label="$t('n406')"
          name="hideUpiCopyButton"
        >
          <a-switch
            :checked="configState.hideUpiCopyButton == 1 ? true : false"
            :checked-children="$t('n349')"
            :un-checked-children="$t('n350')"
            style="margin-top: -8px;"
            @change="switchBy($event,1)"
          ></a-switch>
          <tipTemplate :info="$t('n407')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1485')"
          name="paymentVoucherRewardAmount"
        >
          <a-input-number
            v-model:value="configState.paymentVoucherRewardAmount"
            class="width24"
          >
            <template #addonAfter>
              ARB
            </template>
          </a-input-number>
          <!-- <tipTemplate :info="$t('n374')"/> -->
        </a-form-item>
        <a-form-item :label="$t('n1581')">
          <div class="range-wrapper">

            <a-form-item
              name="autoTransferAmountMin"
              no-style
            >
              <a-input-number
                v-model:value="configState.autoTransferAmountMin"
                :min="1"
                placeholder="Min"
              />
            </a-form-item>

            <span class="range-separator">——</span>

            <a-form-item
              name="autoTransferAmountMax"
              no-style
            >
              <a-input-number
                v-model:value="configState.autoTransferAmountMax"
                :min="configState.autoTransferAmountMin+1"
                placeholder="Max"
              />
              <tipTemplate :info="$t('n1582')"/>
            </a-form-item>
          </div>
        </a-form-item>
        <a-form-item
          :label="$t('n1629')"
          name="fakeAppAutoTradeAccountMinBalance"
        >
          <a-input-number
            v-model:value="configState.fakeAppAutoTradeAccountMinBalance"
            class="width24"
            min="0"
          >
            <template #addonAfter>
              ARB
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1630')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1631')"
          name="fakeAppBalanceWhileQueryFailed"
        >
          <a-input-number
            v-model:value="configState.fakeAppBalanceWhileQueryFailed"
            class="width24"
            min="0"
          >
            <template #addonAfter>
              ARB
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1632')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1637')"
          name="payerResponsibilityAfterUndeterminedSubOrderCount"
        >
          <a-input-number
            v-model:value="configState.payerResponsibilityAfterUndeterminedSubOrderCount"
            class="width24"
            min="1"
          >
            <template #addonAfter>
              {{ $t('times') }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1638')"/>
        </a-form-item>
      </a-col>
      <a-col :span="11">
        <a-form-item
          :label="'USDT '+$t('l7')"
          name="usdtRechargeExpirationTime"
        >
          <a-input-number
            v-model:value="configState.usdtRechargeExpirationTime"
            class="width24"
          >
            <template #addonAfter>
              {{ $t('minute') }}
            </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          :label="$t('m859')"
          name="usdtSellRate"
        >
          <a-input-number
            v-model:value="configState.usdtSellRate"
            class="width24"
          >
            <template #addonBefore>
              1 USDT
            </template>
            <template #addonAfter>
              ARB
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n408')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1409')"
          name="utrErrorAutoCompleteSwitch"
        >
          <a-switch
            :checked="configState.utrErrorAutoCompleteSwitch == 1 ? true : false"
            :checked-children="$t('l53')"
            :un-checked-children="$t('l54')"
            style="margin-top: -8px;"
            @change="switchByUtr($event)"
          ></a-switch>
          <tipTemplate :info="$t('n1410')"/>
        </a-form-item>
        <a-form-item :label="$t('n1411')">
          <div class="range-wrapper">

            <a-form-item
              name="utrErrorAutoCompleteMinLimitAmount"
              no-style
            >
              <a-input-number
                v-model:value="configState.utrErrorAutoCompleteMinLimitAmount"
                :min="0"
                placeholder="Min"
                :disabled="configState.utrErrorAutoCompleteSwitch != 1"
              />
            </a-form-item>

            <span class="range-separator">——</span>

            <a-form-item
              name="utrErrorAutoCompleteMaxLimitAmount"
              no-style
            >
              <a-input-number
                v-model:value="configState.utrErrorAutoCompleteMaxLimitAmount"
                :min="configState.utrErrorAutoCompleteMinLimitAmount + 10"
                placeholder="Max"
                :disabled="configState.utrErrorAutoCompleteSwitch != 1"
              />
            </a-form-item>
            <tipTemplate :info="$t('n1677')"/>
          </div>
        </a-form-item>

        <a-form-item
          :label="$t('n1551')"
          name="exchangeOrderMatchIntervalTime"
        >
          <a-input-number
            v-model:value="configState.exchangeOrderMatchIntervalTime"
            class="width24"
            :min="1"
          >
            <template #addonAfter>
              {{ $t('s') }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1552')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1553')"
          name="exchangeOrderMatchTimes"
        >
          <a-input-number
            v-model:value="configState.exchangeOrderMatchTimes"
            class="width24"
            :min="1"
          >
            <template #addonAfter>
              {{ $t('times') }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1554')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1558')"
          name="autoTransferCooldownTime"
        >
          <a-input-number
            v-model:value="configState.autoTransferCooldownTime"
            class="width24"
            :min="1"
          >
            <template #addonAfter>
              {{ $t('s') }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1560')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1635')"
          name="exchangeOrderToQuickWithdrawOrderTime"
        >
          <a-input-number
            v-model:value="configState.exchangeOrderToQuickWithdrawOrderTime"
            class="width24"
            min="1"
          >
            <template #addonAfter>
              {{ $t('s') }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1636')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1678')"
          name="exchangeUpiOrderAutoTradeRatio"
        >
          <a-input-number
            v-model:value="configState.exchangeUpiOrderAutoTradeRatio"
            class="width24"
            min="0"
          >
            <template #addonAfter>
              %
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1679')"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1680')"
          name="exchangeBankOrderAutoTradeRatio"
        >
          <a-input-number
            v-model:value="configState.exchangeBankOrderAutoTradeRatio"
            class="width24"
            min="0"
          >
            <template #addonAfter>
              %
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n1681')"/>
        </a-form-item>
        <!-- <a-form-item
          :label="$t('m957')"
          name="requirePaymentProof"
        >
          <a-switch
            :checked="configState.requirePaymentProof == 1 ? true : false"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
            @change="switchBy($event,2)"
          ></a-switch>
        </a-form-item> -->
        <!-- <a-form-item
          :label="$t('n409')"
          name="shortcutMatchMinutes"
        >
          <a-input-number
            v-model:value="configState.shortcutMatchMinutes"
            class="width24"
            :min="0"
          >
            <template #addonAfter>
              {{ $t('s') }}
            </template>
          </a-input-number>
          <tipTemplate :info="$t('n410')"/>
        </a-form-item> -->
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item :label="$t('n1960')">
          <div class="range-wrapper">
            <a-form-item
              name="multiPendingOrderAmountMin"
              no-style
            >
              <a-input-number
                v-model:value="configState.multiPendingOrderAmountMin"
                :min="0"
                placeholder="Min"
              >
                <template #addonAfter>INR</template>
              </a-input-number>
            </a-form-item>

            <span class="range-separator">——</span>

            <a-form-item
              name="multiPendingOrderAmountMax"
              no-style
            >
              <a-input-number
                v-model:value="configState.multiPendingOrderAmountMax"
                :min="configState.multiPendingOrderAmountMin || 0"
                placeholder="Max"
              >
                <template #addonAfter>INR</template>
              </a-input-number>
            </a-form-item>
            <tipTemplate :info="[$t('n1961'), $t('n1962'), $t('n1963')]"/>
          </div>
        </a-form-item>
        <a-form-item
          :label="$t('n1964')"
          name="multiPendingOrderCountLimit"
        >
          <a-input-number
            v-model:value="configState.multiPendingOrderCountLimit"
            class="width24"
            :min="0"
            :precision="0"
          >
            <template #addonAfter>
              {{ $t('m113') }}
            </template>
          </a-input-number>
          <tipTemplate :info="[$t('n1961'), $t('n1962'), $t('n1965')]"/>
        </a-form-item>
        <a-form-item
          :label="$t('n1966')"
          name="multiPendingOrderSceneFlag"
        >
          <a-select
            v-model:value="configState.multiPendingOrderSceneFlag"
            style="width: 320px"
            mode="multiple"
            allowClear
            :placeholder="$t('m563')+$t('n1966')"
            :options="Object.entries(multiPendingOrderSceneFlagList).map(([key, value]:[any,any]) => ({ label: $t(value), value: Number(key) }))"
          >
          </a-select>
          <tipTemplate :info="$t('n1967')"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
      <a-popconfirm
        :title=" $t('m364') "
        :ok-text="$t('yes')"
        :cancel-text="$t('no')"
        @confirm="onFinish"
      >
      <a-button type="primary" v-permission="'admin:tradeConfigAdmin:updateBuy'">{{ $t('save') }}</a-button>
    </a-popconfirm>
    </a-form-item>
  </div>
  <div class="config_card_content">
    <a-row>
      <a-col :span="12">
        <a-form-item
          :wrapper-col="{ offset: 0, span: 16 }"
          :label="$t('l8')"
        >
          <a-input-group size="small" style="margin-top: 5px;width: 700px;" v-for = "(item,index) in cancelList" :key="index">
            <a-row>
              <a-col :span="8">
                <a-input-number v-model:value="item.buyFailTimes" :controls="false" >
                  <template #addonBefore>
                    {{ $t('m718') }}
                  </template>
                  <template #addonAfter>
                    {{ $t('times') }}
                  </template>
                </a-input-number>
              </a-col>
              <a-col :span="8">
                <a-input-number v-model:value="item.limitTime" :controls="false">
                  <template #addonAfter>
                    {{ $t('minute') }}
                  </template>
                </a-input-number>
              </a-col>
              <a-col v-if="cancelList.length>1">
                <a-popconfirm
                  :title=" $t('t16') "
                  :ok-text="$t('yes')"
                  :cancel-text="$t('no')"
                  @confirm="delBuyList(item)"
                >
                  <a-button  type="primary" danger style="height: 32px">{{ $t("b11") }}</a-button>
                </a-popconfirm>
              </a-col>
              <a-col v-if="Number(index) > cancelList.length-2">
                <a-button :disabled="index == 4" type="primary" @click="addBuyList(item)" style="height: 32px;margin-left: 10px">{{ $t("add") }}</a-button>
                <tipTemplate :info="$t('n411')"/>
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
      <a-popconfirm
        :title=" $t('m364') "
        :ok-text="$t('yes')"
        :cancel-text="$t('no')"
        @confirm="saveBuy"
      >
        <a-button type="primary"  v-permission="'admin:tradeConfigAdmin:updateBuy'" >{{ $t('save') }}</a-button>
      </a-popconfirm>
    </a-form-item>
  </div>
  </a-form>
  <fixedRewardConfig
    trade-type="buy"
  />
</template>

<script lang="ts" setup>
import { updateBuyApi, getBuyLimitList, batchUpdateBuyLimit } from "@/api/c2cconfig.api";
import { publicConfig } from "@/hooks/usePublicConfig.hook";
import { message, FormInstance, Modal } from 'ant-design-vue';
import { onMounted, ref, watch } from "vue";
import tipTemplate from "../Other/tipTemplate.vue";
import fixedRewardConfig from "./fixedRewardConfig.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { getConfig, configState } = publicConfig()
const cancelList:any = ref([]);
const formRef = ref<FormInstance | null>(null);
// 多笔未完结订单场景标识(多选, 数组) 4-外部商户AR_UPI通道, 5-AR_SaaS通道
const multiPendingOrderSceneFlagList: Record<number, string> = {
  // 0: 'n1968', // 外部商户AR_UPI通道 + AR_SaaS通道
  // 1: 'n1969', // 外部商户AR_UPI通道
  // 2: 'n1970', // AR_SaaS通道
  4: 'n1969',
  5: 'n1970',
};
const isNegative = (v: any) => v != null && Number(v) < 0;
const onFinish = async () => {
  if(configState.value.rechargeExpirationTime > configState.value.thirdFastRechargeDelayTime){
    message.error(t('n282'));
    return;
  }
  const { multiPendingOrderAmountMin, multiPendingOrderAmountMax, multiPendingOrderCountLimit } = configState.value;
  if(isNegative(multiPendingOrderAmountMin) || isNegative(multiPendingOrderAmountMax) || isNegative(multiPendingOrderCountLimit)){
    message.error(t('n1971'));
    return;
  }
  if(multiPendingOrderAmountMin != null && multiPendingOrderAmountMax != null
    && Number(multiPendingOrderAmountMax) < Number(multiPendingOrderAmountMin)){
    message.error(t('n1972'));
    return;
  }
  if(configState.value.exchangeOrderMatchIntervalTime == null){
    message.error(t('n1556'));
    return;
  }
  if(configState.value.exchangeOrderMatchTimes == null){
    message.error(t('n1555'));
    return;
  }
  if(configState.value.autoTransferCooldownTime == null){
    message.error(t('n1559'));
    return;
  }
  // if(configState.value.usdtBuyReward == null){
  //   message.error(t('m562')+t('m956'));
  //   return;
  // }
  formRef.value?.validate().then(async (values) => {
    const sceneFlag = values.multiPendingOrderSceneFlag;
    const res: any = await updateBuyApi(Object.assign(values,{
      id:configState.value.id,
      // 进行中笔数限制范围为空时传 -1
      multiPendingOrderSceneFlag: Array.isArray(sceneFlag) && sceneFlag.length ? sceneFlag : [-1],
    }));
    if(res && res.code === '1') {
      message.success(t('s1'))
      getConfig()
    }
  });
};
const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
const addBuyList = (item:any) => {
  if(item.buyFailTimes && item.limitTime){
    if( cancelList.value.length < 5){
      cancelList.value.push({buyFailTimes:null,limitTime:null,type:1})
    }
  }else{
    message.error(t('m562'))
  }
}
const delBuyList = (item:any) => {
  if(cancelList.value.length > 0){
    cancelList.value.splice(cancelList.value.indexOf(item), 1);
  }
}
const saveBuy = async () => {
  const res2: any = await batchUpdateBuyLimit({cancelList:cancelList.value.filter((item:any) => {
    if(item.buyFailTimes!= null && item.limitTime!= null){
      return {
        buyFailTimes:item.buyFailTimes,limitTime:item.limitTime
      }
    }
  }).map((item:any) => {
    return {
      buyFailTimes:item.buyFailTimes,limitTime:item.limitTime
    }
  })});
  if(res2 && res2.code === '1') {
    message.success(t('s1'))
    getCancelFaile();
  }
}
const getCancelFaile = async () => {
  const res: any = await getBuyLimitList();
  if(res && res.code === '1') {
    cancelList.value = res.data.cancelList || [{buyFailTimes:null,limitTime:null}];
  }
}

//状态更新
const switchBy = async (e: any,type: any) => {
  const s = e ? 1 : 0;
  Modal.confirm({
    title:  e ? t("n347") : t("n348") , 
    onOk: async () => {
      if(type==1){
        configState.value.hideUpiCopyButton = s;
      }else if(type==2){
        configState.value.requirePaymentProof = s;
      }
    },
    onCancel() {
    },
  });
}
const switchByUtr = async (e: any) => {
  const s = e ? 1 : 0;
  Modal.confirm({
    title:  e ? t("n2063") : t("n2064") ,
    onOk: async () => {
      configState.value.utrErrorAutoCompleteSwitch = s;
    },
    onCancel() {
    },
  });
}
// 后端回传 -1 表示未配置，回显时过滤掉
watch(() => configState.value.multiPendingOrderSceneFlag, (val) => {
  if (Array.isArray(val) && val.includes(-1)) {
    configState.value.multiPendingOrderSceneFlag = val.filter((v: any) => v !== -1);
  } else if (val == null || val === -1) {
    configState.value.multiPendingOrderSceneFlag = [];
  }
});
onMounted(()=>{
  getCancelFaile();
  getConfig();
  // cancelList.value = JSON.parse(JSON.stringify(configState.value.cancelList));
})
</script>

<style lang="less" scoped>
.width24 {
  width: 240px;
}
.width20 {
  width: 200px;
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
  color: #999;
}
</style>
