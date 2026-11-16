<template>
  <div class="container">
    <div class="head">
      {{ $t("m36") }}
      <a-button
        type="primary"
        @click="addShow(3)"
        v-permission="'admin:collectionInfoAdmin:add'"
        >{{ $t("m100") }}</a-button
      >
      <a-button
        type="primary"
        @click="addShowUSDT()"
        v-permission="'admin:usdtReceiveInfo:createUsdtReceiveInfo'"
        >{{ $t("m888") }}</a-button
      >
      <!-- <a-button
        type="primary"
        @click="addShow(1)"
        v-permission="'admin:collectionInfoAdmin:addBank'"
        >{{ $t("m655") }}</a-button
      > -->
    </div>
    <div class="body">
      <div v-for="(item, index) in dataList" class="card" :key="index">
        <div v-if="item.type == 3">
          <!-- <div class="item">
            UPI Name
            <div>{{ item.upiName || "-" }}</div>
          </div> -->
          <div class="item1">
                {{ $t("m581") }}
              <div>{{ item.bankCode || "-" }}</div>
          </div>
          <div class="item1">
              UPI ID
              <div>{{ item.upiId || "-" }}</div>
          </div>
          <div class="item1">
            {{ $t("m101") }}
            <div>{{ item.mobileNumber || "-" }}</div>
          </div>
          <div class="item1">
            {{ $t("state") }}
            <div style="margin-bottom: 3px;">
              <a-tag size="small">
                <a-badge :color="item.collectedStatus == 1 ? 'green' : 'red'" />
                {{ item.collectedStatus == 1 ? $t("enabled") : $t("disabled") }}
              </a-tag>
              <br/>
              <a-tag size="small" style="margin-top: 3px;">
                <a-badge :color="item.antCollectionLimit == 1 ? 'red' : 'green'" />
                {{ $t("n617") }}
              </a-tag>
            </div>
          </div>
          <div class="item line"></div>
          <div class="item itemBottom">
            {{ $t("m104") }}
            <div>
              {{ `${item.collectedAmount || 0}/${item.collectedNumber || 0}` }}
            </div>
          </div>
          <div class="cardBottom">
            <a-button size="small" @click="openConnectLog(item)">{{ $t('n762') }}</a-button>
            <a-button ghost type="primary" size="small" :disabled="!item.kycId" :loading="loading" @click="showEditF(item)" v-permission="'admin:collectionInfoAdmin:update'">{{
              $t("b8")
            }}</a-button>
            <!-- <a-popconfirm
              :title="item.collectedStatus == '1' ? $t('m768') : $t('m767')"
              :ok-text="$t('b9')"
              :cancel-text="$t('b10')"
              @confirm="changeStatus(item)"
            > -->
              <a-button ghost type="primary" size="small"
                :danger="item.collectedStatus == '1'"
                v-permission="'admin:collectionInfoAdmin:disable1'"
                :loading="loading"
                @click="item.collectedStatus == '1'?showChangeDis(item,4):showChangeDis(item,5)"
                >{{ item.collectedStatus == "1" ? $t('disabled') : $t('enabled') }}
              </a-button>
          <!-- </a-popconfirm> -->
            <a-popconfirm
              :title="$t('t7')"
              :ok-text="$t('yes')"
              :cancel-text="$t('no')"
              @confirm="delC(item.id)"
            >
              <template #icon
                ><question-circle-outlined style="color: red"
              /></template>
              <a-button ghost danger :loading="loading" size="small" v-permission="'admin:collectionInfoAdmin:delete'">{{ $t("b11") }}</a-button>
            </a-popconfirm>
          </div>
        </div>
        <div v-if="item.type == 700">
          <!-- <div class="item">
            UPI Name
            <div>{{ item.upiName || "-" }}</div>
          </div> -->
          <div class="item">
            {{ $t("m889") }}
            <div>USDT</div>
          </div>
          <div class="item line">
            {{ $t("m890") }}
            <div>{{ item.address || "-" }}</div>
          </div>
          <div class="item itemBottom">
            <!-- {{ $t("m104") }}
            <div>
              {{ `${item.collectedAmount || 0}/${item.collectedNumber || 0}` }}
            </div> -->
          </div>
          <div class="item"></div>
          <div class="cardBottom">
            <a-button ghost type="primary" size="small" @click="editUsdt(item)" v-permission="'admin:collectionInfoAdmin:update'">{{
              $t("b8")
            }}</a-button>
            <a-popconfirm
              :title="$t('t7')"
              :ok-text="$t('yes')"
              :cancel-text="$t('no')"
              @confirm="deleteUsdt(item)"
            >
              <template #icon
                ><question-circle-outlined style="color: red"
              /></template>
              <a-button ghost danger size="small" v-permission="'admin:collectionInfoAdmin:delete'">{{ $t("b11") }}</a-button>
            </a-popconfirm>
          </div>
        </div>
        <!-- <div v-if="item.type == 1" :key="index" class="bank">
          <div class="item">
            {{ $t("m581") }}
              <a-tooltip>
                <template #title>{{ item.bankName || "-"  }}</template>
                <div style="width: 90%;height: 22px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap">{{ item.bankName || "-"  }}</div>
              </a-tooltip>
          </div>
          <div class="item">
            {{ $t("m653") }}
            <div>{{ item.bankCardOwner || "-" }}</div>
          </div>
          <div class="item">
            {{ $t("m652") }}
            <div>{{ item.bankCardNumber || "-" }}</div>
          </div>
          <div class="item">
            {{ $t("l35") }}
            <div>{{ item.mobileNumber || "-" }}</div>
          </div>
          <div class="item">
            ifscCode
            <div>{{ item.ifscCode || "-" }}</div>
          </div>
          <div class="item">
            {{ $t("l63") }}
            <div>{{ item.email || "-" }}</div>
          </div>
          <div class="line"></div>
          <div class="item">
            {{ $t("m104") }}
            <div>
              {{ `${item.collectedAmount || 0}/${item.collectedNumber || 0}` }}
            </div>
          </div>
          <div>
            <a-button ghost type="primary" @click="showEditF(item)" v-permission="'admin:collectionInfoAdmin:update'">{{
              $t("b8")
            }}</a-button>
            <a-popconfirm
              :title="$t('t7')"
              :ok-text="$t('yes')"
              :cancel-text="$t('no')"
              @confirm="delCBank(item)"
            >
              <template #icon
                ><question-circle-outlined style="color: red"
              /></template>
              <a-button ghost danger v-permission="'admin:collectionInfoAdmin:delete'">{{ $t("b11") }}</a-button>
            </a-popconfirm>
          </div>
        </div> -->
      </div>
    </div>
  </div>
  <!-- 新增/修改KYC收款信息 -->
  <a-modal
    :title="isAdd ? $t('add') : $t('edit')"
    v-model:open="showModal"
    :footer="null"
  >
    <a-form
      :model="editForm"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <a-group v-if="payTypeShow === 3">
        <!-- <a-form-item label="UPI Name" name="upiName" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="editForm.upiName" />
        </a-form-item> -->
        <a-form-item :label="$t('m581')" name="bankCode" :rules="[{ required: true, message: ''}]">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="editForm.bankCode"
            :placeholder="$t('m563')+$t('m581')"
          >
            <a-select-option
              v-for="(item) in groupList"
              :value="item"
              :key="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="UPI ID" name="upiId" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="editForm.upiId" :placeholder="$t('m562') +'UPI ID'"/>
        </a-form-item>
        <a-form-item :label="$t('m101')" name="account">
          <a-input v-trim v-model:value="editForm.account" />
        </a-form-item>
      </a-group>

      <!-- <a-group v-if="payTypeShow === 1">
        <a-form-item :label="$t('m581')" name="bankCode" :rules="[{ required: true, message: ''}]">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="editForm.bankCode"
            :placeholder="$t('m563')+$t('m581')"
          >
            <a-select-option v-for="(item, index) in bankListData" :key="index" :value="item.code">
            {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('m652')" name="bankCardNumber" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="editForm.bankCardNumber" />
        </a-form-item>
        <a-form-item label="ifscCode" name="ifscCode" :rules="[{ required: true, message: ''}]"
        :help="$t('m667')">
          <a-input v-trim v-model:value="editForm.ifscCode" />
        </a-form-item>
        <a-form-item :label="$t('m662')" name="bankCardOwner" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="editForm.bankCardOwner" />
        </a-form-item>
        <a-form-item :label="$t('m591')" name="mobileNumber">
          <a-input v-trim v-model:value="editForm.mobileNumber" />
        </a-form-item>
        <a-form-item :label="$t('l63')" name="email">
          <a-input v-trim v-model:value="editForm.email" />
        </a-form-item>
      </a-group> -->

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" :loading="loading" @click="onFinish">{{ $t("save") }}</a-button>
        <a-button style="margin-left: 10px" @click="closeForm">{{
          $t("b10")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 新增/修改USDT收款信息 -->
   <a-modal
    :title="!isEdit ? $t('add') : $t('edit')"
    v-model:open="usdtModal"
    :footer="null"
    >
      <a-form
        :model="usdtForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item :label="$t('m891')">
          USDT-TRC20
        </a-form-item>
        <a-form-item :label="$t('m890')" name="address" :rules="[{ required: true, message: ''}]">
          <a-textarea v-trim 
            v-model:value="usdtForm.address"
            :auto-size="{ minRows: 2, maxRows: 5 }"
           />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" :loading="loading"  @click="usdtFinish">{{ $t("save") }}</a-button>
          <a-button style="margin-left: 10px" @click="closeUsdtForm">{{
            $t("b10")
          }}
          </a-button>
        </a-form-item>
      </a-form>
   </a-modal>
  <!-- kyc连接日志 -->
<a-modal
  v-model:open="connectModel"
  :footer="null"
  wrap-class-name="full-modal"
  width="100%"
  @cancel="cancelConnectLog"
  >
  <kycConnectLog
    v-if="connectModel"
    :bankCode="bankCode"
    :phoneNumber="phoneNumber"
    />
  </a-modal>
  <!-- 启用、禁用 -->
  <a-modal
    v-model:open="showPayInfoDis"
    :footer="null"
  >
    <div v-if="payInfoData.status == 4" style="margin-top: 25px;">
      <span style="color: red; margin-right: 4px;">*</span>
      <span>{{ $t('n1151') }}：</span>
      <a-select 
        v-model:value="payInfoData.timeRangeType"
        style="width: 300px;"
        :options="Object.keys(timeRangeTypeMap).map(key => ({ label: $t(timeRangeTypeMap[key]), value: Number(key) }))"
      >
      </a-select>
    </div>
    <div style="margin-top: 15px; display: flex; align-items: flex-start;">
      <span style="color: red; margin-right: 4px;">*</span>
      <a-textarea
        v-model:value="payInfoData.remark"
        v-trim
        style="width: 400px;"
        :rows="4"
        :maxlength="200"
        :placeholder="$t('pleaseEnter') + $t('remark')"
      ></a-textarea>
    </div>
    <div style="margin-top: 25px; text-align: center;">
      <a-button @click="closePayInfoDis">{{ $t("b10") }}</a-button>
      <a-button type="primary" style="margin-left: 10px" :loading="loading" @click="confirmChangeStatus">{{ $t("b28") }}</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import {
  delcollectionInfoAdmin,
  getcollectionList,
  editMemberPaymentList,
  addcollectionInfoAdmin,
  getBankCodeMap,
  addKycPartner,
  updateKycPartner,
  createUsdtReceiveInfo,
  updateUsdtReceiveInfo,
  deleteUsdtReceiveInfo,
  getUsdtReceiveInfoByMemberId,
  memberPaymentenable,
  memberPaymentDisable,
  collectionInfoAdminUpdateStatus,
} from "@/api/menber";
import {
  getKycBankCodeList,
} from "@/api/kycConfig.api";
import kycConnectLog from "@/components/Kyc/kycConnectLog.vue";
import { onMounted, ref } from "vue";
import { message } from 'ant-design-vue';
import { useI18n } from "vue-i18n";
import { upiIdReg,timeRangeTypeMap } from "@/utils/publicData";

const { t } = useI18n();
const props = defineProps({
  id: {
    default: () => "",
  },
  memberID: {
    default: () => "",
  },
});
const loading = ref(false);
const isAdd = ref(false);
const showModal = ref(false);
const payTypeShow = ref(1);
const bankList = <any>ref({});
const bankListData = <any>ref([]);
const editForm = ref({
  // dailyLimitAmount: 0,
  // dailyLimitNumber: 0,
  upiId: undefined,
  // upiName: "",
  // mobileNumber: undefined,
  collectionInfoId: undefined,
  account: undefined,
  memberId: props.id,
  // type: undefined,
  // bankCardNumber: undefined,
  // bankCardOwner: undefined,
  // bankName: undefined,
  bankCode: undefined,
  // email: undefined,
  // ifscCode: undefined,
});
const dataList = ref<any[]>([]);
const getData = async () => {
  loading.value = true;
  const res: any = await getcollectionList({
    memberId: props.id,
    pageNo: 1,
    pageSize: 1000,
    version: 2,
  }).finally(() => {
    loading.value = false;
  });
  if (res && res.code === "1") {
    dataList.value = res.data || [];
  }
};
//type: 700为自定义，表示USDT
const getUsdtData = async () => {
  const res: any = await getUsdtReceiveInfoByMemberId(props.id);
  if (res && res.code === "1") {
    if(res.data){
      dataList.value.push({...res.data, type: 700});
    }
  }
}
const delC = async (id: any) => {
  const res: any = await delcollectionInfoAdmin({ id });
  if (res && res.code == "1") {
    message.success(t("s9"));
    await getData();
    await getUsdtData();
  }
};
const delCBank = async (value: any) => {
  const res: any = await delcollectionInfoAdmin({ id: value.id });
  if (res && res.code === "1") {
    message.success(t("s9"));
    await getData();
    await getUsdtData();
  }
};
const showEditF = (value: any) => {
  payTypeShow.value = value.type;
  isAdd.value = false;
  let {id,upiId,account,bankCode,mobileNumber} = value
  // editForm.value = JSON.parse(JSON.stringify(value));
  editForm.value = {
    collectionInfoId: id,
    upiId,
    account:mobileNumber,
    bankCode,
    memberId: props.id,
  }
  showModal.value = true;
};
const addShow = (payType: any) => {
  payTypeShow.value = payType;
  isAdd.value = true;
  editForm.value = {
    // dailyLimitAmount: 0,
    // dailyLimitNumber: 0,
    upiId: undefined,
    // upiName: "",
    account: undefined,
    collectionInfoId: undefined,
    // memberAccount: undefined,
    memberId: props.id,
    // type: payType,
    // bankCardNumber: undefined,
    // bankCardOwner: undefined,
    // bankName: undefined,
    bankCode: undefined,
    // email: undefined,
    // ifscCode: undefined,
  };
  showModal.value = true;
};
const onFinish = async (val: any) => {
  const {
    // dailyLimitAmount,
    // dailyLimitNumber,
    // upiId,
    // upiName,
    // mobileNumber,
    // id,
    // memberAccount,
    // memberId,
    // type,
    // bankCardNumber,
    // bankCardOwner,
    // bankName,
    // bankCode,
    // email,
    // ifscCode,
  } = editForm.value;
  const va = {
    // dailyLimitAmount,
    // dailyLimitNumber,
    // upiId,
    // upiName,
    // mobileNumber,
    // id,
    // memberAccount,
    // memberId,
    // type,
    // bankCardNumber,
    // bankCardOwner,
    // bankName: bankList.value[bankCode] || bankName,
    // bankCode,
    // email,
    // ifscCode,
  };
  let res: any;
  if(payTypeShow.value === 3){
    // if(va.upiName.trim() === ""){
    //   return message.error(t("m562")+"UPI Name");
    // }
    if(!editForm.value.bankCode){
      return message.error(t("m563")+t("m581"));
    }
    if(editForm.value.upiId === "" || !editForm.value.upiId){
      return message.error(t("m562")+"UPI ID");
    }
    if(!upiIdReg.test(editForm.value.upiId)){
      return message.error("UPI ID " + t("n283"));
    }
    // if(va.mobileNumber.trim() === ""){
    //   return message.error(t("m562")+t("l35"));
    // }
  }
  // if(payTypeShow.value === 1){
    // if(va.bankCode.trim() === ""){
    //   return message.error(t("m563")+t("m581"));
    // }
    // if(va.bankCardNumber.trim() === ""){
    //   return message.error(t("m562")+t("m652"));
    // }
    // if(va.ifscCode.trim() === ""){
    //   return message.error(t("m562")+"ifscCode");
    // }
    // if(va.bankCardOwner.trim() === ""){
    //   return message.error(t("m562")+t("m662"));
    // }
    // if(va.mobileNumber.trim() === ""){
    //   return message.error(t("m562")+t("l35"));
    // }
    // if(va.email.trim() === ""){
    //   return message.error(t("m562")+t("l63"));
    // }
  // }
  loading.value = true;
  if (isAdd.value) {
    res = await addKycPartner(editForm.value).finally(() => loading.value = false);
  } else {
    res = await updateKycPartner(editForm.value).finally(() => loading.value = false);
  }
  if (res && res.code === "1") {
    message.success(t("s10"));
    showModal.value = false;
    await getData();
    await getUsdtData();
  }
};
const closeForm = () => {
  editForm.value = {
    // dailyLimitAmount: 0,
    // dailyLimitNumber: 0,
    id: undefined,
    account: undefined,
    memberId: props.id,
    upiId: undefined,
    // upiName: "",
  };

  showModal.value = false;
};
// 启用、禁用
const showPayInfoDis = ref(false);
const payInfoData = ref({
  id: undefined,
  status: undefined,
  timeRangeType: 1 as any,
  remark: undefined,
});
const showChangeDis = (val:any,collectedStatus:any) => {
  const { id} = val;
  payInfoData.value.id = id;
  payInfoData.value.status = collectedStatus;
  payInfoData.value.timeRangeType = collectedStatus == 4 ? 1 : undefined;
  showPayInfoDis.value = true;
  
};

const closePayInfoDis = () => {
  showPayInfoDis.value = false;
  payInfoData.value = {
    id: undefined,
    status: undefined,
    timeRangeType: 1,
    remark: undefined,
  };
};
const confirmChangeStatus = async () => {
  let res: any;
  if(!payInfoData.value.remark){
    message.error(t("m562") + t("remark"));
    return;
  }
  loading.value = true;
  res = await collectionInfoAdminUpdateStatus(payInfoData.value).finally(() => loading.value = false);
  if (res && res.code == "1") {
    message.success(t("s10"));
    closePayInfoDis();
    await getData();
    await getUsdtData();
  }
}
// const changeStatus = async (val: any,status:any) => {
//   const { id} = val;
//   let res: any;
//   loading.value = true;
//   if(collectedStatus == '1'){
//     res = await memberPaymentDisable( id ).finally(() => loading.value = false);
//   } else {
//     res = await memberPaymentenable( id ).finally(() => loading.value = false);
//   }
//   if (res && res.code == "1") {
//     message.success(t("s10"));
//     await getData();
//     await getUsdtData();
//   }
// }
const getBankList = async () => {
  const res: any = await getBankCodeMap();
  if (res && res.code === "1") {
    bankList.value = res.data || {};
    Object.keys(res.data).map((item:any)=>{
      bankListData.value.push({code:item,value:res.data[item]});
    });
  }
}

const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};

// usdt收款信息
const isEdit = ref(false);
const usdtModal = ref(false);
const usdtForm = ref({
  id: undefined,
  address: undefined,
  memberId: props.id
})
const addShowUSDT = () => {
  usdtModal.value = true;
  isEdit.value = false;
  usdtForm.value = {
    id: undefined,
    address: undefined,
    memberId: props.id
  }
}
const editUsdt = (value: any) => {
  usdtModal.value = true;
  isEdit.value = true;
  const {id,address} = value;
  usdtForm.value = {
    id,
    address,
    memberId: undefined,
  }
}
const trc20Regex = /^T[a-zA-Z0-9]{33}$/;
const usdtFinish = async () => {
  if(!trc20Regex.test(usdtForm.value.address)){
    message.error(t("m562") + t("m892"));
    return
  }
  loading.value = true;
  let res;
  if(isEdit.value){
    res = await updateUsdtReceiveInfo(usdtForm.value.id,{address:usdtForm.value.address}).finally(() => loading.value = false);
  }else{
    res = await createUsdtReceiveInfo(usdtForm.value).finally(() => loading.value = false);
  }
  if (res && res.code === "1") {
    message.success(t("s10"));
    usdtModal.value = false;
    await getData();
    await getUsdtData();
  }
}
const closeUsdtForm = () => {
  usdtModal.value = false;
}
const deleteUsdt = async (value: any) => {
  const {id} = value;
  const res: any = await deleteUsdtReceiveInfo(id);
  if (res && res.code === "1") {
    message.success(t("s10"));
    await getData();
    await getUsdtData();
  }
}


// 打开连接日志
const connectModel = ref(false);
const bankCode = ref("");
const phoneNumber = ref("");
const openConnectLog = (value: any) => {
  bankCode.value = value.bankCode;
  phoneNumber.value = value.mobileNumber;
  connectModel.value = true;
};
const cancelConnectLog = () => {
  connectModel.value = false;
  bankCode.value = "";
  phoneNumber.value = "";
};

onMounted(async () => {
  getGroupList();
  getBankList();
  await getData();
  await getUsdtData();
});
</script>
<style lang="less" scoped>
.container {
  padding: 20px;
  height: 90%;
  overflow: auto;
  .head {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    height: 24px;
    line-height: 24px;
    margin-bottom: 10px;
    align-items: center;
    gap: 10px;
    &::before {
      content: "";
      display: block;
      height: 100%;
      width: 4px;
      background-color: #1677ff;
    }
  }
  .body   {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    gap: 5px;
    & > div {
      box-sizing: border-box;
    }
    .card {
      border-radius: 10px;
      border: 1px solid #333;
      padding: 10px;
      padding-bottom: 0;
      // margin-bottom: 10px;
      .item {
        color: #939393;
        & > div {
          color: #333;
        }
        &.line {
          border-bottom: 1px solid #939393;
          margin-bottom: 10px;
        }
        &.itemBottom {
          display: inline-block;
          line-height: 14px;
          height: 28px;
        }
      }
      .cardBottom{
        float: right;
      }
      .item1 {
        color: #939393;
        display: inline-block;
        width: 50%;
      }
      button + button {
        margin-left: 10px;
      }
    }

    .bank {
      border-radius: 10px;
      border: 1px solid #333;
      padding: 10px;
      .item {
        color: #939393;
        width: 50%;
        float: left;
        & > div {
          color: #333;
        }
      }
      .line {
        float: left;
        margin-bottom: 10px;
        width: 100%;
        border-bottom: 1px solid #939393;
      }
      button + button {
        margin-left: 10px;
      }
    }

  }
}
</style>
