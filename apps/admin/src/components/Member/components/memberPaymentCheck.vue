<template>
  <a-col :span="32" class="pr15">
    <div class="Temp_C-info">
      <!-- <h4>{{ $t("user.mPayCheck") }}</h4> -->
      <div class="Temp_C-box">
        <div class="item">
          <div class="lab">{{ $t('m656') }}：</div>
          <span class="data">{{ mPayCheck?.type ? $t(payTypeData[mPayCheck?.type]) : "" }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t('m101') }}：</div>
          <span class="data">{{ mPayCheck?.mobileNumber }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ 'UPI ID' }}：</div>
          <span v-if="mPayCheck?.type == 3" class="data">{{ mPayCheck?.upiId }}</span>
          <span v-else-if="mPayCheck?.type == 1" class="data">{{ mPayCheck?.bankCardNumber }}</span>
        </div>
        <!-- <div class="item">
          <div class="lab">{{ 'UPI Name' }}:</div>
          <span v-if="mPayCheck?.type == 3" class="data">{{ mPayCheck?.upiName }}</span>
          <span v-else-if="mPayCheck?.type == 1" class="data">{{ mPayCheck?.bankCardOwner }}</span>
        </div> -->
        <div v-if="mPayCheck?.type == 1" class="item">
          <div class="lab">{{ $t('m581') }}：</div>
          <span class="data">{{ mPayCheck?.bankName }}</span>
        </div>
        <div v-if="mPayCheck?.type == 1" class="item">
          <div class="lab">{{ $t('m651') }}：</div>
          <span class="data">{{ mPayCheck?.bankCode }}</span>
        </div>
        <div v-if="mPayCheck?.type == 1" class="item">
          <div class="lab">ifscCode:</div>
          <span class="data">{{ mPayCheck?.ifscCode }}</span>
        </div>
        <div v-if="mPayCheck?.type == 1" class="item">
          <div class="lab">{{ $t('l63') }}：</div>
          <span class="data">{{ mPayCheck?.email }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t('l30') }}</div>
          <span class="data">{{ mPayCheck?.collectedAmount }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t('l31') }}</div>
          <span class="data">{{ mPayCheck?.collectedNumber }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t('l32') }}</div>
          <span class="data">{{ mPayCheck?.createTime }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t('l33') }}</div>
          <span class="data">{{ mPayCheck?.collectedStatus === '1' ? $t('publicType1') : $t('l54')}}</span>
        </div>
      </div>
    </div>
  </a-col> 
</template>
<script setup lang="ts">
import { useMember } from "@/hooks/useMember.hook";
import { payTypeData } from "@/utils/publicData";
import { onMounted } from "vue";
const { mPayCheck } = useMember();
</script>

<style scoped lang="less">
.Temp_C-info {
  background-color: #fff;
  min-height: 500px;
  overflow: auto;
  width: 100%;
  h4 {
    font-size: 16px;
    height: 20px;
    line-height: 18px;
    position: relative;
    border-left: 5px solid #108ee9;
    padding-left: 10px;
  }
  h2 {
    border-width: 0px;
    height: 22px;
    line-height: 22px;
    display: flex;
    font-size: 16px;
    color: #000000;
  }
  .line {
    margin-bottom: 5px;
  }
  .item {
    height: 30px;
    padding: 0 15px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    &:nth-child(odd) {
      background-color: #eee;
    }
    &.lab {
      flex: 1;
      border-width: 0px;
      display: flex;
      font-size: 12px;
      color: #979595;
    }
    .data {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      border-width: 0px;
      display: flex;
      font-size: 12px;
      color: #151515;
    }
  }
}
</style>
