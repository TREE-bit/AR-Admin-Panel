<template>
  <a-col :span="24">
    <div class="Temp_C-safety">
      <h4>{{ $t("userBalance") }}</h4>
      <div class="box">
        <div class="item item1">
          <!-- <label class="lab">{{ $t("userBalance") }}</label> -->
          <div class="money">
            <span class="num">{{ merchantDetail.currency }}：{{ currency(merchantDetail?.balance,false) }}</span>
            <a-button class="ml15" type="primary" @click="onPopup(1)" v-permission="'admin:merchantInfoAdmin:applyWithdraw'">{{
              $t("m836")
            }}</a-button>
            <a-button class="ml15" type="primary" @click="onPopup(0)" v-permission="'admin:merchantInfoAdmin:applyRecharge'">{{
              $t("b3")
            }}</a-button>
          </div>
        </div>
      </div>
      <h4>{{ $t("商户安全信息") }}</h4>
      <div class="box box2">
        <div class="item">
          <label>{{ $t("n33") }}</label>
          <div class=" mt10">
            <div>
              {{ merchantDetail?.usdtAddress || "---" }}
            </div>
          </div>
            <div>
            <a-button  type="primary" @click="onPopup(2)" v-permission="'admin:merchantInfoAdmin:updateUsdtAddress'">{{
              merchantDetail?.usdtAddress ? $t("userBtn2") : $t("b4")
            }}</a-button>
            </div>
        </div>
        <div class="item">
          <label>{{ $t("userLabel8") }}</label>
          <div class="tip">
            {{ $t("t2") }}
          </div>
          <div class="pwd">

            <a-popconfirm
              :title="$t('t1')"
              :ok-text="$t('b9')"
              :cancel-text="$t('b10')"
              @confirm="resetPwd"
            >
              <a-button type="primary" v-permission="'admin:merchantInfoAdmin:resetPassword'">{{ $t("b5") }}</a-button>
            </a-popconfirm>
          </div>
        </div>
        <div class="item">
          <label>{{ $t("ss1") }}</label>
          <p class="tip">{{ $t("e17") }}</p>
            <a-popconfirm
              :title="$t('ss7')"
              @confirm="handleRest(merchantDetail)"
              :ok-text="$t('b9')"
              :cancel-text="$t('b10')"
            >
              <template #description>
                <span style="color: red">{{ $t("ss8") }}</span>
              </template>

              <a-button  type="primary" @click="resetGoogleDialog = true" v-permission="'admin:merchantInfoAdmin:resetMerchantGoogle'">{{
                $t("ss2")
              }}</a-button>
            </a-popconfirm>
        </div>
      </div>
      <div class="box-bot">
        <!-- <div class="item">
          <label>{{ $t("userLabel9") }}</label>
          <div class="code">{{ merchantDetail?.code }}</div>
        </div> -->
        <div class="item">
          <label>{{ $t("m174") }}</label>
          <div class="code">
            <a-textarea
              v-model:value="merchantDetail.platformPublicKey"
              :disabled="true"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </div>
        </div>
        <div class="item">
          <label>{{ $t("m175") }}</label>
          <a-button 
            style="margin-left: 20px;" 
            type="primary" 
            @click="getNewKey()"
            v-permission="'admin:merchantInfoAdmin:generateKeyPair'">
            {{ $t("m972") }}
          </a-button>
          <div class="code">
            <a-textarea
              v-model:value="merchantDetail.merchantPublicKey"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
            <a-popconfirm
              :title="$t('t32')"
              :ok-text="$t('b9')"
              :cancel-text="$t('b10')"
              @confirm="savekey"
            >
              <a-button class="mt15" type="primary" v-permission="'admin:merchantInfoAdmin:updateMerchantPublicKey'">{{ $t("m176") }}</a-button>
            </a-popconfirm>
          </div>
        </div>
      </div>
      <!-- <div class="box">
        <div class="item">
          <label>{{ $t("m838") }}</label>
          <div class="address mt10">
            <div>
              {{ merchantDetail?.usdtAddress || " " }}
            </div>
            <a-button class="ml15" type="primary" @click="onPopup(2)" v-permission="'admin:merchantInfoAdmin:updateUsdtAddress'">{{
              merchantDetail?.usdtAddress ? $t("userBtn2") : $t("b4")
            }}</a-button>
          </div>
        </div>
        <div class="item">
          <label>{{ $t("userLabel8") }}</label>
          <div class="pwd">
            <div>********</div>

            <a-popconfirm
              :title="$t('t1')"
              :ok-text="$t('b9')"
              :cancel-text="$t('b10')"
              @confirm="resetPwd"
            >
              <a-button class="ml15" type="primary" v-permission="'admin:merchantInfoAdmin:resetPassword'">{{ $t("b5") }}</a-button>
            </a-popconfirm>
          </div>
          <div class="tip">
            {{ $t("t2") }}
          </div>
        </div>
        <div class="item">
          <label>{{ $t("userLabel9") }}</label>
          <div class="code">{{ merchantDetail?.code }}</div>
        </div>
        <div class="item">
          <label>{{ $t("m174") }}</label>
          <div class="code">
            <a-textarea
              v-model:value="merchantDetail.platformPublicKey"
              :disabled="true"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </div>
        </div>
        <div class="item">
          <label>{{ $t("m175") }}</label>
          <div class="code">
            <a-textarea
              v-model:value="merchantDetail.merchantPublicKey"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
            <a-popconfirm
              :title="$t('t32')"
              :ok-text="$t('b9')"
              :cancel-text="$t('b10')"
              @confirm="savekey"
            >
              <a-button class="mt15" type="primary" v-permission="'admin:merchantInfoAdmin:updateMerchantPublicKey'">{{ $t("m176") }}</a-button>
            </a-popconfirm>
          </div>
        </div>
        <div class="box">
          <label>{{ $t("userLabel11") }}</label>
          <div class="c-row mt10">
            <div>
              <a-qrcode
                :value="`otpauth://totp/${time}?secret=${merchantDetail?.googlesecret}&issuer=ARAdmin`"
              />
            </div>
            <div class="pl15">
              <p>{{ $t("userGTip1") }}</p>
              <p>{{ $t("userGTip2") }}</p>
              <p>
                {{ $t("userGTip3") }} {{ merchantDetail?.googlesecret }}
                <a-button
                  type="primary"
                  size="small"
                  @click="copy(merchantDetail?.googlesecret as string)"
                  v-permission="'admin:merchantInfoAdmin:no1'"
                  >{{ $t("userBtn4") }}</a-button
                >{{ $t("userGTip4") }}
              </p>
              <p>
                {{ $t("userUserName") + (merchantDetail.account || "--") }}
              </p>
            </div>
          </div>
        </div>

        <a-row>
          <a-col :span="6"
            ><div class="tit">{{ $t("ss1") }}</div></a-col
          >
          <a-col :span="8">
            <a-popconfirm
              :title="$t('ss7')"
              @confirm="handleRest(merchantDetail)"
              :ok-text="$t('b9')"
              :cancel-text="$t('b10')"
            >
              <template #description>
                <span style="color: red">{{ $t("ss8") }}</span>
              </template>

              <a-button type="primary" @click="resetGoogleDialog = true" v-permission="'admin:merchantInfoAdmin:resetMerchantGoogle'">{{
                $t("ss2")
              }}</a-button>
            </a-popconfirm>
          </a-col>
          <a-col :span="24">
            <p class="tip">{{ $t("e17") }}</p></a-col
          >
        </a-row>
      </div> -->
    </div>
  </a-col>
  <!--  xiafa e du-->
  <a-modal v-model:open="transferDownDialog" :title="$t('m836')" :footer="null">
    <a-form
      :model="transferDownForm"
      name="transferDown"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="transferDownOk"
    >
      <a-form-item :label="$t('userForm1')" name="currency">
        {{ merchantDetail.currency }}
      </a-form-item>

      <a-form-item :label="$t('userForm2')" name="balance">
        <div>{{ currency(merchantDetail.balance) }}</div>
      </a-form-item>
      <a-form-item
        :label="$t('m836')"
        name="amount"
        :rules="[{ required: true, message: $t('m562') + $t('m836') }]"
      >
        <a-input-number
          style="width: 100%"
          v-model:value="transferDownForm.amount"
        />
      </a-form-item>
      <!-- <a-form-item :label="$t('m837')">
        {{ currency(usdtChange, false) }}
        <span>USDT</span>
      </a-form-item> -->
      <a-form-item :label="$t('remark')" name="remark">
        <a-textarea v-model:value="transferDownForm.remark" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" :loading="loading" html-type="submit">{{ $t("b9") }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <!--  shoudongshangfen-->
  <a-modal v-model:open="upDialog" :title="$t('b3')" :footer="null">
    <a-form
      :model="transferDownForm"
      name="transferDown"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="upOk"
    >
      <a-form-item :label="$t('userForm1')" name="currency">
        {{ merchantDetail.currency }}
      </a-form-item>
      <a-form-item
        :label="$t('l34')"
        name="amount"
        :rules="[{ required: true, message: $t('m562') + $t('l34') }]"
      >
        <a-input-number
          style="width: 100%"
          v-model:value="transferDownForm.amount"
        />
      </a-form-item>
      <a-form-item :label="$t('remark')" name="remark">
        <a-textarea v-model:value="transferDownForm.remark" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" :loading="loading" html-type="submit">{{ $t("b9") }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <!--  xiugai ustd dizhi-->
  <a-modal
    v-model:open="updataAddressDialog"
    :title="$t('userResetUSDT')"
    :footer="null"
  >
    <a-form
      :model="updataAddressForm"
      name="usdtAddress"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="updataAddressOk"
    >
      <a-form-item
        :label="$t('userUSDTaddress')"
        name="usdtAddress"
        :rules="[{ required: true, message: $t('userRule5') }]"
      >
        <a-input v-trim
          style="width: 100%"
          v-model:value="updataAddressForm.usdtAddress"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">{{ $t("b9") }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:open="password" :title="$t('m73')" @ok="password = false">
    <h4 style="padding: 20px; text-align: center">
      {{ $t("m74") }}
    </h4>
    <p style="color: red; text-align: center; margin-bottom: 50px">
      {{ newPwd }}
      <CopyOutlined
        style="color: rgb(51, 145, 251)"
        @click="
          copy(newPwd);
          message.success($t('m173'));
        "
      />
    </p>
  </a-modal>
</template>
<script setup lang="ts">
import { currency } from "@/utils";
import { useClipboard, useNow, useDateFormat } from "@vueuse/core";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  applyRechargeApi,
  applyWithdrawApi,
  resetMerchantGoogle,
  resetPasswordApi,
  setKeyApi,
  updateUsdtAddressApi,
} from "@/api/merchant.api";
import { CopyOutlined } from "@ant-design/icons-vue";
import { useMerchantInfo } from "@/hooks/useMerchantInfo.hook";
const { merchantDetail, getDetail } = useMerchantInfo();
const { t } = useI18n();
const time = useDateFormat(useNow(), "YYYY-MM-DD");
const { copy } = useClipboard();
const newPwd = ref("");
const transferDownDialog = ref(false);
const loading = ref(false);
const upDialog = ref(false);
const password = ref(false);
const resetGoogleDialog = ref(false);
const transferDownForm = ref({
  amount: 0,
  remark: "",
});
const updataAddressDialog = ref(false);
const updataAddressForm = ref({
  usdtAddress: "",
});
const usdtChange = computed(() => {
  if (!transferDownForm.value.amount || !merchantDetail.value.usdtRate)
    return 0;
  return transferDownForm.value.amount / merchantDetail.value.usdtRate;
});

const transferDownOk = async (value: any) => {
  const data = Object.assign({}, value, {
    balance: merchantDetail.value.balance,
    currence: merchantDetail.value.currency,
    merchantCode: merchantDetail.value.code,
    usdtAddr: merchantDetail.value.usdtAddress,
  });
  loading.value = true;
  const res: any = await applyWithdrawApi(data).finally(() => {
    loading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t("m840"));
    getDetail({ id: merchantDetail.value.id });
    transferDownDialog.value = false;
  }
};
const upOk = async (value: any) => {
  const data = Object.assign({}, value, {
    balance: merchantDetail.value.balance,
    currence: merchantDetail.value.currency,
    merchantCode: merchantDetail.value.code,
    usdtAddr: merchantDetail.value.usdtAddress,
  });
  loading.value = true;
  const res: any = await applyRechargeApi(data).finally(() => {
    loading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t("s3"));
    getDetail({ id: merchantDetail.value.id });
    upDialog.value = false;
  }
};
const updataAddressOk = async (vlaue: any) => {
  const res: any = await updateUsdtAddressApi(
    Object.assign(vlaue, { id: merchantDetail.value.id })
  );
  if (res && res.code === "1") {
    message.success(t("s4"));
    getDetail({ id: merchantDetail.value.id });
    updataAddressDialog.value = false;
  }
};
const onPopup = (value: number) => {
  if (value === 0) {
    transferDownForm.value = {
      amount: 0,
      remark: "",
    };
    upDialog.value = true;
    return;
  }
  if (value === 1) {
    transferDownForm.value = {
      amount: 0,
      remark: "",
    };
    transferDownDialog.value = true;
    return;
  }
  if (value === 2) {
    updataAddressForm.value = {
      usdtAddress: merchantDetail.value.usdtAddress,
    };
    updataAddressDialog.value = true;
  }
};
const resetPwd = async () => {
  newPwd.value = "";
  const res: any = await resetPasswordApi({ code: merchantDetail.value.code });
  if (res && res.code === "1") {
    newPwd.value = res.data;
    password.value = true;
    message.success(t("s5"));
  }
};
const savekey = async () => {
  const res: any = await setKeyApi({
    id: merchantDetail.value.id,
    merchantPublicKey: merchantDetail.value.merchantPublicKey,
  });
  if (res && res.code === "1") {
    message.success(t("s10"));
    getDetail({ id: merchantDetail.value.id });
  }
};

const handleRest = async (value:any) => {
  const res: any = await resetMerchantGoogle({merchantCode: value.code})
  if (res && res.code === "1") {
    message.success(t("s10"));
    getDetail({ id: merchantDetail.value.id });
  }
};
const getNewKey = () => {
  window.open('#/createNewKey', '_blank');
}
</script>

<style scoped lang="less">
.Temp_C-safety {
  // background-color: @bg-color-body;
  padding: 20px;
  height: 100%;
  overflow: auto;
  h4 {
    font-size: 16px;
    height: 20px;
    line-height: 18px;
    position: relative;
    border-left: 5px solid #108ee9;
    padding-left: 10px;
    margin-bottom: 10px;
  }
  .box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item{
      flex: 0 0 32.5%;
    }
    .item1{
      flex: 0 0 100%;
    }
    .item {
      padding: 10px 5px;
      border: 1px solid #ddd;
      .lab{
        font-size: 16px;
        font-weight: bold;
        padding: 0 0 0 10px;
      }
      .moneyIng{
        font-size: 16px;
        font-weight: bold;
        padding: 0 0 0 10px;
      }
      .money {
        font-size: 30px;
        display: flex;
        align-items: center;
        .num {
          color: #000;
          font-size: 30px;
          padding: 0 10px;
        }
      }
      .pwd {
        display: flex;
      }
      .address {
        display: flex;
        & > div {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          border-radius: 15px 15px;
        }
      }
      .code {
        font-size: 16px;
        color: #1668dc;
      }
    }
  }
}
.box2{
  .item{
    padding-left: 15px !important;
  }
}
.ml15 {
  margin-left: 15px;
}

.mt15 {
  margin-top: 15px;
}
.tip {
  color: #ff4d4f;
}
.box {
  margin-bottom: 30px;
  .tit {
    font-size: 24px;
  }
}
.box-bot{
  .item{
    margin-bottom: 20px;
    label{
      font-weight: bold;
    }
    .code{
      margin-top: 5px;
    }
  }
}
:deep(.emptyLabel){
  margin-top: -15px;
  label{
    &::after{
      content: ''!important;
      display: none;
    }
  }
}
</style>
