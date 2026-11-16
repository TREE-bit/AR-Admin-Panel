<template>
  <div class="container">
    <div class="card">
      <div class="head">{{ $t("m37") }}</div>
      <div class="body">
        <div>
          <div>{{ $t("m38") + (info.memberType ? $t(memberTypeList[info.memberType]) : "--") }}</div>
          <div>{{ $t("m677")+ ': ' + (info.merchantName || "--") }}</div>
          <div>{{ $t("m39") + (info.memberAccount || "--") }}</div>
          <div>{{ $t("m40") + (info.id || "--") }}</div>
          <div>{{ $t("m41") + (info.realName || "--") }}</div>
          <div>{{ $t("m42") + (info.mobileNumber || "--") }}</div>
          <div>{{ $t("m43") + (statusMap[info.status] || "--") }}</div>
          <div>{{ $t("m474") + mearchantID }}</div>
        </div>
        <div>
          <div>{{ $t("m678")+ ': ' + (info.countOfMerchant || "0") }}</div>
          <div>{{ $t("m44") + (info.registerTime || "--") }}</div>
          <div>{{ $t("m45") + (info.registerIp || "--") }}</div>
          <div>{{ $t("m46") + (info.registerDevice || "--") }}</div>
          <div>{{ $t("m47") + (info.firstLoginTime || "--") }}</div>
          <div>{{ $t("m48") + (info.firstLoginIp || "--") }}</div>
          <div>{{ $t("m257") + (info.merchantMemberIp || "--") }}</div>
          <div>{{ $t("m450") + (info.walletAddress || "--") }}</div>
        </div>
        <div>
          <div style="display: flex; align-items: center">
            {{ $t("m49") }}
            <a-popconfirm
              :title="$t('m52')"
              :ok-text="$t('b9')"
              :cancel-text="$t('b10')"
              @confirm="handleResetPasssword"
            >
              <template #description>
                <div
                  style="
                    text-align: center;
                    margin-bottom: 10px;
                    font-size: 20px;
                  "
                >
                  {{ $t("m71") }}
                </div>
                <div
                  style="color: red; text-align: center; margin-bottom: 30px"
                >
                  {{ $t("m72") }}
                </div>
              </template>
              <a-tag
                class="btn"
                color="blue"
                style="margin-left: 10px"
                v-permission="'admin:memberInfoAdmin:resetpwd'"
                >{{ $t("reset") }}</a-tag
              >
            </a-popconfirm>
            <div class="operationContentBox">
              <div class="operationContentItem">
                <ClockCircleOutlined />
                {{ $t('n1178') }}：{{ info.loginPwdUpdateTime || '--' }}
              </div>
              <div class="operationContentItem">
                <UserOutlined />
                {{ $t('l48') }}：{{ info.loginPwdUpdateName || '--' }}
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center">
            {{ $t("e29") }}:
            <a-popconfirm
              :title="$t('e30')"
              :ok-text="$t('b9')"
              :cancel-text="$t('b10')"
              @confirm="handleResetPayPwd"
            >
              <template #description>
                <div
                  style="
                    text-align: center;
                    margin-bottom: 10px;
                    font-size: 20px;
                  "
                >
                  {{ $t("e31") }}
                </div>
                <div
                  style="color: red; text-align: center; margin-bottom: 30px"
                >
                  {{ $t("m72") }}
                </div>
              </template>
              <a-tag
                class="btn"
                color="blue"
                style="margin-left: 10px"
                v-permission="'admin:memberInfoAdmin:resetPayPwd'"
                >{{ $t("reset") }}</a-tag
              >
            </a-popconfirm>
            <div class="operationContentBox">
              <div class="operationContentItem">
                <ClockCircleOutlined />
                {{ $t('n1179') }}：{{ info.payPwdCreateTime || '--' }}
              </div>
              <div class="operationContentItem">
                <ClockCircleOutlined />
                {{ $t('n1178') }}：{{ info.payPwdUpdateTime || '--' }}
              </div>
            </div>
          </div>
          <!-- <div class="award">
            <div>
              {{ $t("m50") + (info.buyBonusProportion || "0") }} %<br />{{
                $t("m51") + (info.sellBonusProportion || "0")
              }}
              %
            </div>
            <a-tag
              class="btn"
              color="blue"
              style="margin-left: 10px"
              @click="showBuySell"
              v-permission="'admin:memberInfoAdmin:bonus'"
              >{{ $t("b8") }}</a-tag
            >
          </div> -->
          <div>
            <div>
              {{ $t("remark") }}
              <EditOutlined
                style="color: #1677ff; cursor: pointer"
                @click="showEdit"
                v-permission="'admin:memberInfoAdmin:remark'"
              />
            </div>
            <a-textarea :rows="5" :value="info.remark?info.remark.split('|').join('|\n'):info.remark" disabled />
          </div>
        </div>
      </div>
    </div>
    
    <a-modal v-model:open="password" :title="$t('m73')" @ok="handleOk">
      <h4 style="padding: 20px; text-align: center">
        {{ $t("m74") }}
      </h4>
      <p style="color: red; text-align: center; margin-bottom: 50px">
        {{ NewPassword }}
        <span
          style="color: rgb(51, 145, 251)"
          @click="
            copy(NewPassword as string);
            message.success($t('s10'));
            password = false;
          "
          ><CopyOutlined
        /></span>
      </p>
    </a-modal>

    <!-- --------------------------------- Modal for sell and Buy -------------------------------- -->

    <a-modal v-model:open="buySell" :title="$t('m75')" @ok="handleBuySell">
      <div style="padding: 20px">
        <div class="modelC">
          <pre>{{ $t("m50") }}</pre>
          <a-input-number
            :max="100"
            :min="0"
            v-model:value="buyBonusProportion"
            :formatter="(value) => `${value}%`"
            :parser="(value) => value.replace('%', '')"
          />
        </div>
        <div class="modelC">
          <pre>{{ $t("m51") }}</pre>
          <a-input-number
            :max="100"
            :min="0"
            v-model:value="sellBonusProportion"
            :formatter="(value) => `${value}%`"
            :parser="(value) => value.replace('%', '')"
          />
        </div>
      </div>
    </a-modal>
  <!-- --------------------------------- -------------------------------------------------------------------------- -------------------------------- -->
  <div class="card">
      <div class="body">
        <div>
          <div class="head">{{ $t("m491") }}<span class="e-level">{{ info.level != null ? levelMap[Number(info.level)] : "--" }}</span></div>
          <div class="level-msg1" v-for="item in userlevelLog">
            <span>{{ (item.beforeChange  != null ? levelMap[Number(item.beforeChange)]: '')  + '→' + (item.afterChange != null ? levelMap[Number(item.afterChange)] : '') }}</span>
            <span>{{ item.createTime }}</span>
          </div>
        </div>
        <div style="opacity: 0;">
          <!-- <div class="head">{{ $t("m539") }}<span class="e-level">{{ (creditList?.creditScore || '0' ) + $t('m538') }}</span></div>
          <div class="level-msg2" v-for="item in creditList.lastCreditScoreLogList">
            <span>{{ (item.tradeType ? $t(tradeTypeMap[Number(item.tradeType)]) : '') + '-' + (item.eventType ? $t(eventTypeMap[Number(item.eventType)]) : '') }}</span>
            <span class="creditScore">{{ item.changeScore > 0 ? ('+' + item.changeScore) : item.changeScore}}</span>
            <span>{{ item.createTime }}</span>
          </div> -->
        </div>
      </div>
    </div>
    <!-- --------------------------------- -------------------------------------------------------------------------- -------------------------------- -->
    <div class="card">
      <div class="head">{{ $t("m76") }}</div>
      <div class="body">
        <div>
          {{ $t("m77") }}
          <div>
            ARB {{ currency((info.arbBalance || 0) + (info.arbFrozenAmount || 0) + (info.arbBiFrozenAmount || 0),false) }}
          </div>
          <div>
            CPB {{ currency((info.balance || 0) + (info.frozenAmount || 0) + (info.biFrozenAmount || 0),false) }}
          </div>
        </div>
        <div>
          {{ $t("m78") }}
          <div>
            ARB {{ currency(info.arbBalance,false) }}
          </div>
          <div>
            CPB {{ currency(info.balance,false) }}
          </div>
        </div>
        <div>
          {{ $t("e5") }}
          <div>
            ARB {{ currency(info.arbFrozenAmount,false) }}
          </div>
          <div>
            CPB {{ currency(info.frozenAmount,false) }}
          </div>
        </div>
        <div>
          {{ $t("n452") }}
          <div>
            {{ currency(info.transactionRestrictionsAmount,false) }}
          </div>
        </div>
        <div>
          {{ $t("n183") }}
          <div>
            {{ currency(info.owedAmount || 0,false) }}
          </div>
        </div>
        <div>
          {{ $t("e4") }}
          <div>
            ARB {{ currency(info.arbBiFrozenAmount || 0,false) }}
          </div>
          <div>
            CPB {{ currency(info.biFrozenAmount || 0,false) }}
          </div>
        </div>
        <div v-if="info.memberType != 6">
          {{ $t("operation") }}
          <div style="display: flex; gap: 5px">
            <a-tag
              class="btn"
              color="#13bc75"
              @click="showHandleRecharge"
              v-permission="'admin:memberInfoAdmin:recharge'"
              >{{ $t("n102") }}</a-tag
            >
            <a-tag
              class="btn"
              color="#fda40b"
              @click="showHandleWithdrawal"
              v-permission="'admin:memberInfoAdmin:withdrawal'"
              >{{ $t("n103") }}</a-tag
            >
            <a-tag
              class="btn"
              color="#cf1322"
              @click="showHandleFreeze"
              v-permission="'admin:memberInfoAdmin:freeze'"
              >{{ $t("m79") }}</a-tag
            >
            <a-tag
              class="btn"
              color="#169bd5"
              @click="showHandleUnFreeze"
              v-permission="'admin:memberInfoAdmin:unfreeze'"
              >{{ $t("e3") }}</a-tag
            >
          </div>
        </div>
      </div>
    </div>
    <!--------------------------------------------------------------- Modal for recharge --------------------------------------------------------------------------- -->

    <a-modal v-model:open="recharge" :title="$t('n102')" @ok="handleRecharge" :confirmLoading="loading">
      <div class="modelC">
        <pre>{{ $t("n102") }}:</pre>
        ARB<a-input-number v-model:value="arbBuyAmount" :precision="2" :min="0" />
        CPB<a-input-number v-model:value="buyAmount" :precision="2" :min="0" />
      </div>
      <div class="modelC">
        <pre><span style="color:red">*</span>{{ $t("n108") }}:</pre>
        <a-textarea
          v-model:value="allRemarks"
          :placeholder="$t('p42')"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
      </div>
    </a-modal>

    <!--------------------------------------------------------------- Modal for Withdrawal --------------------------------------------------------------------------- -->

    <a-modal
      v-model:open="withdrawal"
      :title="$t('n103')"
      @ok="handleWithdrawal"
      :confirmLoading="loading"
    >
      <div class="modelC">
        <pre>{{ $t("n103") }}: </pre>
        ARB<a-input-number v-model:value="arbSellAmount" :precision="2" :min="0" />
        CPB<a-input-number v-model:value="sellAmount" :precision="2" :min="0" />
      </div>

      <div class="modelC">
        <pre><span style="color:red">*</span>{{ $t("n109") }}:</pre>
        <a-textarea
          v-model:value="allRemarks"
          :placeholder="$t('p42')"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
      </div>
    </a-modal>

    <!--------------------------------------------------------------- Modal for Freeze / Unfreeze ----------------------------------------------------------------------------->

    <a-modal v-model:open="freeze" :title="$t('m79')" @ok="handleFreeze" :confirmLoading="loading">
      <div class="modelC">
        <pre>{{ $t("m81") }}: </pre>
        <!-- ARB<a-input-number v-model:value="arbBiFrozenAmount" :precision="2" :min="0" /> -->
        <a-input-number v-model:value="frozenAmount" :precision="2" :min="0" />
      </div>
      <div class="modelC">
        <pre><span style="color:red">*</span>{{ $t("n110") }}:</pre>
        <a-textarea
          v-model:value="allRemarks"
          :placeholder="$t('p42')"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
      </div>
    </a-modal>
    <a-modal v-model:open="unfreeze" :title="$t('e3')" @ok="handUnFreeze" :confirmLoading="loading">
      <div class="modelC">
        <pre>{{ $t("m80") }}: </pre>
        <!-- ARB<a-input-number
          v-model:value="arbUnfrozenAmount"
          :precision="2"
          :min="0"
        /> -->
        <a-input-number
          v-model:value="unfrozenAmount"
          :precision="2"
          :min="0"
        />
      </div>
      <div class="modelC">
        <pre>{{ $t("m807") }}: </pre>
        <a-input
          v-model:value="platformOrderNo"
          :placeholder="$t('m562')+$t('m807')"
        />
      </div>
      <div class="modelC">
        <pre><span style="color:red">*</span>{{ $t("n111") }}:</pre>
        <a-textarea
          v-model:value="allRemarks"
          :placeholder="$t('p42')"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
      </div>
    </a-modal>

    <!--------------------------------------------------------------- Edit remark --------------------------------------------------------------------------- -->

    <a-modal
      v-model:open="isShowRemark"
      :title="$t('edit') + $t('remark')"
      @ok="handleRemark"
    >
      <div class="modelC">
        <pre>{{ $t("remark") }}: </pre>
        <a-textarea v-model:value="remark" :precision="2" :min="0" />
      </div>
    </a-modal>
    <!--------------------------------------------------------------------------- Table ---------------------------------------------------------------------------------->

    <div class="card">
      <div class="head">{{ $t("m82") }}</div>
      <div class="table">
        <div>{{ $t("m83") }}</div>
        <div>{{ info.totalBuyCount || 0 }}</div>
        <div>{{ $t("m84") }}</div>
        <div>{{ info.totalBuySuccessCount || 0 }}</div>
        <div>{{ $t("m85") }}</div>
        <div>{{ info.totalBuyAmount || 0 }}</div>
        <div>{{ $t("m86") }}</div>
        <div>{{ info.totalBuyBonus || 0 }}</div>
        <div>{{ $t("m87") }}</div>
        <div>{{ info.appealCount || 0 }}</div>
        <div>{{ $t("m88") }}</div>
        <div>{{ info.totalSellCount || 0 }}</div>
        <div>{{ $t("m89") }}</div>
        <div>{{ info.totalSellSuccessCount || 0 }}</div>
        <div>{{ $t("m90") }}</div>
        <div>{{ info.totalSellAmount || 0 }}</div>
        <div>{{ $t("m91") }}</div>
        <div>{{ info.totalSellBonus || 0 }}</div>
        <div>{{ $t("m87") }}</div>
        <div>{{ info.appealCount || 0 }}</div>
      </div>
      <div class="body f">
        <div>
          <div>{{ $t("m92") }}</div>
          <div class="table3">
            <div class="table-head">
              <div>{{ $t("m93") }}</div>
              <div>{{ $t("m94") }}</div>
              <div>{{ $t("m451") }}</div>
              <div>{{ $t("state") }}</div>
            </div>
            <div v-for="(item, index) in lastB" :key="index" class="table-item">
              <!-- <div>{{ item.createTime }}</div> -->
              <a-tooltip>
                <template #title>{{ item.createTime }}</template>
                <div style="text-overflow: ellipsis;overflow: hidden;">{{ item.createTime }}</div>
              </a-tooltip>
              <div>{{ item.actualAmount }}</div>
              <div>{{ item.matchMemberId }}</div>
              <div>{{ item.status }}</div>
            </div>
          </div>
        </div>
        <div>
          {{ $t("m95") }}
          <div class="table3">
            <div class="table-head">
              <div>{{ $t("m96") }}</div>
              <div>{{ $t("c5") }}</div>
              <div>{{ $t("m451") }}</div>
              <div>{{ $t("state") }}</div>
            </div>
            <div v-for="(item, index) in lastS" :key="index" class="table-item">
              <!-- <div>{{ item.createTime }}</div> -->
              <a-tooltip>
                <template #title>{{ item.createTime }}</template>
                <div style="text-overflow: ellipsis;overflow: hidden;">{{ item.createTime }}</div>
              </a-tooltip>
              <div>{{ item.actualAmount }}</div>
              <div>{{ item.matchMemberId }}</div>
              <div>{{ item.status }}</div>
            </div>
          </div>
        </div>
        <div>
          {{ $t("m97") }}
          <div class="table3">
            <div class="table-head">
              <div>{{ $t("m98") }}</div>
              <div>IP</div>
              <div>{{ $t("m99") }}</div>
            </div>
            <div v-for="(item, index) in lastL" :key="index" class="table-item">
              <div>{{ item.createTime }}</div>
              <div>
                <a-tooltip>
                  <template #title>{{ item.ip }}</template>
                  <div class="tadle-item-ip">{{ item.ip }}</div>
                </a-tooltip>
              </div>
              <div>{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ClockCircleOutlined, UserOutlined} from '@ant-design/icons-vue'
import { currency, thousand } from "@/utils";
import { useClipboard } from "@vueuse/core";
import {
  getMemberInfo,
  lastBuyRecord,
  lastLogin,
  lastSellRecord,
  resetPassword,
  rechargeTopup,
  withdrawalAmount,
  unFreezeAccount,
  freezeAccount,
  buyBonusSellBonus,
  editRemark,
  resetPayPwd,
} from "@/api/menber";
import { getCreditScoreInfo, memberLevelChangeList } from '@/api/userlevel.api'
import { onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { CopyOutlined, EditOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { tradeTypeMap, eventTypeMap, levelMap, memberTypeList } from '@/utils/publicData'
import Bus from "@/utils/bus";
const { t } = useI18n();
const { copy } = useClipboard();
// Modal for reset button
const open = ref<boolean>(false);
const password = ref<boolean>(false);
const NewPassword = ref<any>("");
const buySell = ref<boolean>(false);
const recharge = ref<boolean>(false);
const withdrawal = ref<boolean>(false);
const freeze = ref<boolean>(false);
const unfreeze = ref<boolean>(false);
const unfrozenAmount = ref<any>(0);
const platformOrderNo = ref<any>('');
// const arbUnfrozenAmount = ref<any>(0);
const frozenAmount = ref<any>(0);
// const arbBiFrozenAmount = ref<any>(0);
const info = ref<any>({});
const buyAmount = ref<any>(0);
const arbBuyAmount = ref<any>(0);
const allRemarks = ref<any>(null);
const sellAmount = ref<any>(0);
const arbSellAmount = ref<any>(0);
const buyBonusProportion = ref<any>("");
const sellBonusProportion = ref<any>("");
interface CreditList {
  creditScore?: number;
  lastCreditScoreLogList?: any[];
}

// const creditList = ref<CreditList>({
//   creditScore: 0,
//   lastCreditScoreLogList: [],
// });
interface UserLevelLog {
  beforeChange: number | null;
  afterChange: number | null;
  createTime: string;
}

const userlevelLog = ref<UserLevelLog[]>([])
const props = defineProps({
  memberID: {
    default: () => "",
  },
  id: {
    default: () => "",
  },
});
// const getCreditScore = async () => {
//   const res:any = await getCreditScoreInfo({id: props.id});
//   if(res && res.code === '1'){
//     creditList.value = res.data;
//   }
// }
const getmemberLevelChangeList = async () => {
  const res:any = await memberLevelChangeList({memberId: props.id});
  if(res && res.code === '1'){
    userlevelLog.value = res.data;
  }
}
const handleResetPasssword = async () => {
  const res:any = await resetPassword({ id: props.id, memberId: props.memberID });
  if (res && res.code === "1") {
    NewPassword.value = "aa123456";
    password.value = true;
    open.value = false;
    message.success(t("s10"));
  }
};

const handleOk = () => {
  password.value = false;
};

// ////////////////////////////////////////////////////////////////////////////  Modal function for Buy And Sell bonus ///////////////////////////////////////////////////////////////////////
const handleBuySell = async () => {
  buySell.value = false;
  const res:any = await buyBonusSellBonus({
    id: props.id,
    memberId: props.memberID,
    buyBonusProportion: buyBonusProportion.value,
    sellBonusProportion: sellBonusProportion.value,
  });

  if (res && res.code === "1") {
    message.success(t("s10"));
    getInfo();
  } else {
    message.error("Something went wrong, please try again later");
  }
};

const showBuySell = () => {
  buySell.value = true;
  buyBonusProportion.value = info.value.buyBonusProportion;
  sellBonusProportion.value = info.value.sellBonusProportion;
};

// //////////////////////////////////////////////////////////////////////////////   Modal function for Recharge    ///////////////////////////////////////////////////////////////////////////

const showHandleRecharge = () => {
  recharge.value = true;
  allRemarks.value = '';
};
const loading = ref(false);
const handleRecharge = async () => {
  if(allRemarks.value?.trim() === '' || allRemarks.value == null){
    return message.error(t('p42'));
  }
  recharge.value = false;
  loading.value = true;
  const res:any = await rechargeTopup({
    id: props.id,
    memberId: props.memberID,
    buyAmount: buyAmount.value,
    arbBuyAmount: arbBuyAmount.value,
    remark: allRemarks.value,
  }).finally(() => {
    loading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t("s10"));
    getInfo();
  }
};

// ///////////////////////////////////////////////////////////////////////////////////  Modal function for Withdrawal   ///////////////////////////////////////////////////////////////////////////

const showHandleWithdrawal = () => {
  withdrawal.value = true;
  allRemarks.value = '';
};
const handleWithdrawal = async () => {
  if(allRemarks.value?.trim() === '' || allRemarks.value == null){
    return message.error(t('p42'));
  }
  withdrawal.value = false;
  loading.value = true;
  const res:any = await withdrawalAmount({
    id: props.id,
    memberId: props.memberID,
    sellAmount: sellAmount.value,
    arbSellAmount: arbSellAmount.value,
    remark: allRemarks.value,
  }).finally(() => {
    loading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t("s10"));
    getInfo();
    allRemarks.value = "";
  } else {
    sellAmount.value = 0;
    arbSellAmount.value = 0;
  }
};

// //////////////////////////////////////////////////////////////////////////////////  Modal function for Freeze / Unfreeze   ///////////////////////////////////////////////////////////////////////////

const showHandleFreeze = () => {
  frozenAmount.value = 0;
  // arbBiFrozenAmount.value = 0;
  freeze.value = true;
  allRemarks.value = '';
};
const showHandleUnFreeze = () => {
  unfrozenAmount.value = 0;
  platformOrderNo.value = '';
  // arbUnfrozenAmount.value = 0;
  unfreeze.value = true;
  allRemarks.value = '';
};
const handUnFreeze = async () => {
  if(allRemarks.value?.trim() === '' || allRemarks.value == null){
    return message.error(t('p42'));
  }
  if (unfrozenAmount.value == 0) {
    unfreeze.value = false;
    return;
  }
  loading.value = true;
  const res:any = await unFreezeAccount({
    id: props.id,
    memberId: props.memberID,
    frozenAmount: unfrozenAmount.value,
    platformOrderNo: platformOrderNo.value,
    // arbBiFrozenAmount : arbUnfrozenAmount.value,
    remark: allRemarks.value,
  }).finally(() => {
    loading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t("s10"));
    unfreeze.value = false;
    allRemarks.value = "";
    getInfo();
  }
};
const handleFreeze = async () => {
  if(allRemarks.value?.trim() === '' || allRemarks.value == null){
    return message.error(t('p42'));
  }
  if (frozenAmount.value == 0 ) {
    freeze.value = false;
    return;
  }
  loading.value = true;
  const res:any = await freezeAccount({
    id: props.id,
    memberId: props.memberID,
    frozenAmount: frozenAmount.value,
    // arbBiFrozenAmount: arbBiFrozenAmount.value,
    remark: allRemarks.value,
  }).finally(() => {
    loading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t("s10"));
    freeze.value = false;
    allRemarks.value = "";
    getInfo();
  }
};

const lastB = ref<any>([]);
const lastS = ref<any>([]);
const lastL = ref<any>([]);
const statusMap = ref<any>({
  0: t("disabled"),
  1: t("enabled"),
});
const mearchantID = ref('');
const getInfo = async () => {
  const res:any = await getMemberInfo({ id: props.id });
  if (res && res.code === "1") {
    info.value = res.data;
    mearchantID.value = (res.data.merchantName ? res.data.merchantName : '--' )+ '/' + (res.data.externalMemberId ? res.data.externalMemberId : '--');
    Bus.emit('memberType', res.data.memberType)
  }
};
const getLastB = async () => {
  const res:any = await lastBuyRecord({ id: props.id });
  if (res && res.code === "1") {
    lastB.value = res.data || [];
  }
};
const getLastL = async () => {
  const res:any = await lastLogin({ id: props.id });
  if (res && res.code === "1") {
    lastL.value = res.data || [];
  }
};
const getLastS = async () => {
  const res:any = await lastSellRecord({ id: props.id });
  if (res && res.code === "1") {
    lastS.value = res.data || [];
  }
};
const remark = ref("");
const isShowRemark = ref(false);
const showEdit = () => {
  remark.value = info.value.remark;
  isShowRemark.value = true;
};
const handleRemark = async () => {
  const res:any = await editRemark({ id: props.id, remark: remark.value });
  if (res && res.code === "1") {
    message.success(t("s10"));
    isShowRemark.value = false;
    getInfo();
  }
};
const handleResetPayPwd = async () => {
  const res:any = await resetPayPwd({
    id: props.id,
    memberId: props.memberID,
    remark: "",
  });
  if (res && res.code === "1") {
    NewPassword.value = "1234";
    password.value = true;
    message.success(t("s10"));
    getInfo();
  }
  // console.log("res", res);
};
onMounted(() => {
  getInfo();
  getLastB();
  getLastL();
  getLastS();
  // getCreditScore();
  getmemberLevelChangeList();
});
</script>

<style lang="less" scoped>
.container {
  padding: 5px;
  border-radius: 10px;
  height: calc(100% - 80px);
  .card {
    display: block;
    padding: 8px;
    .head {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      height: 24px;
      line-height: 24px;
      margin: 8px 0;
      &::before {
        content: "";
        display: block;
        height: 100%;
        width: 4px;
        background-color: #1677ff;
        margin-right: 10px;
      }
      .e-level{
        font-size: 26px;
        font-weight: 400;
        padding-left: 20px;
        line-height: 20px;
        color: #fda40b
      }
    }
    .level-msg1,.level-msg2{
    .creditScore{
      display: inline-block;
      width: 30px;
      text-align: right;
    }
      :nth-child(1){
        display: inline-block;
        // padding-right: 100px;
        width: 300px;
      }
      :last-child{
        font-size: 12px;
        padding-left: 100px;
      }
    }
    .body {
      font-size: 16px;
      display: flex;
      gap: 10px;
      & > div {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 10px;
        gap: 10px;
        background-color: #e6f4ff;
        border-radius: 10px;
      }
      &.f {
        display: flex;
        justify-content: space-between;
        & > div {
          width: calc((100% - 20px) / 3);
          flex: none;
        }
      }
      .award {
        display: flex;
        align-items: center;
      }
    }
    .table {
      display: flex;
      flex-wrap: wrap;
      background-color: #e6f4ff;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 10px;

      & > div {
        text-align: center;
        height: 30px;
        line-height: 30px;
        flex: 1 0 10%;
        border-top: 1px solid #d9d9d9;
        border-left: 1px solid #d9d9d9;
        &:nth-child(10),
        &:nth-child(20) {
          border-right: 1px solid #d9d9d9;
        }
        &:nth-child(n + 11) {
          border-bottom: 1px solid #d9d9d9;
        }
        &:nth-child(odd) {
          background-color: #fafafa;
        }
      }
    }
    .table3 {
      border-bottom: 1px solid #d9d9d9;
      .table-head {
        display: flex;
        background-color: #fafafa;
        text-align: center;
        & > div {
          flex: 1;
          border-top: 1px solid #d9d9d9;
          border-left: 1px solid #d9d9d9;
          &:last-child {
            border-right: 1px solid #d9d9d9;
          }
        }
      }
      .table-item {
        display: flex;
        flex-wrap: wrap;
        & > div {
          width: 25%;
          text-align: center;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          flex: 1 0 10%;
          border-top: 1px solid #d9d9d9;
          border-left: 1px solid #d9d9d9;
          .tadle-item-ip{
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          &:last-child {
            border-right: 1px solid #d9d9d9;
          }
        }
      }
    }
  }
  .btn {
    padding: 6px 10px;
    cursor: pointer;
  }
}

.title {
  border-top: 1px solid black;
  padding: 20px;
  text-align: center;
  font-size: 24px;
}
.modalBody {
  display: flex;
  // margin-bottom: 10px;
  gap: 5px;
}
.modelC {
  display: flex;
  align-items: center;
  gap: 10px;
  pre {
    width: 100px;
  }
  & + .modelC {
    margin-top: 15px;
  }
}
.operationContentBox{
  .operationContentItem{
    font-size: 12px;;
  }
}
</style>
