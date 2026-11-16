<template>
  <a-col :span="32" class="pr15">
    <div class="Temp_C-info">
      <!-- <h4>{{ $t("user.usdtBOrderInfo") }}</h4> -->
      <div class="Temp_C-box2">
        <div class="item-img">
          <a-image v-if="usdtBOrderInfo.voucher" :src="usdtBOrderInfo ? usdtBOrderInfo.voucher : ''" />
          <a-empty :description="$t('n336')" v-if="!usdtBOrderInfo.voucher" />
        </div>
      </div>
      <div class="Temp_C-box">
        <div class="item" v-if="usdtBOrderInfo?.upiId">
          <div class="lab">UPI ID</div>
          <span class="data">{{ usdtBOrderInfo?.upiId }}</span>
        </div>
        <!-- <div class="item" v-if="usdtBOrderInfo?.upiName">
          <div class="lab">UPI Name</div>
          <span class="data">{{ usdtBOrderInfo?.upiName }}</span>
        </div> -->
        <div class="item" v-if="usdtBOrderInfo?.mobileNumber">
          <div class="lab">{{ $t('l35') }}</div>
          <span class="data">{{ usdtBOrderInfo?.mobileNumber }}</span>
        </div>
        <div class="item" >
          <h2 style="border-width: 0px; height: 21px;display: flex;font-size: 16px;color: #000000;">{{ $t('l36') }}</h2>
         </div>
        <div class="item" v-if="usdtBOrderInfo?.matchTime">
          <div class="lab">{{ $t('l37') }}</div>
          <span class="data">{{ usdtBOrderInfo?.matchTime }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.paymentTime">
          <div class="lab">{{ $t('l38') }}</div>
          <span class="data">{{ usdtBOrderInfo?.paymentTime }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.completionTime">
          <div class="lab">{{ $t('l39') }}</div>
          <span class="data">{{ usdtBOrderInfo?.completionTime }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.appealReviewBy">
          <div class="lab">{{ $t('l40') }}</div>
          <span class="data">{{ usdtBOrderInfo?.appealReviewBy }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.appealReviewTime">
          <div class="lab">{{ $t('l41') }}</div>
          <span class="data">{{ usdtBOrderInfo?.appealReviewTime }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.cancelBy">
          <div class="lab">{{ $t('l42') }}</div>
          <span class="data">{{ usdtBOrderInfo?.cancelBy }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.cancelTime">
          <div class="lab">{{ $t('l43') }}</div>
          <span class="data">{{ usdtBOrderInfo?.cancelTime }}</span>
        </div>
       <div class="item-remark" v-if="usdtBOrderInfo?.remark">
          <div class="lab" style="color: #000000;">{{ $t('remark') }}</div>
           <span class="data">{{ usdtBOrderInfo?.remark }}</span>
        </div>
      </div>
    </div>
  </a-col>
</template>
<script setup lang="ts">
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
const { usdtBOrderInfo } = getUsdtBuyOrderInfo();
</script>

<style scoped lang="less">
.Temp_C-info {
  background-color: #fff;
  height: 734px;
  overflow: auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  .Temp_C-box2{
    flex: 1;
    background-color: #fff;
    height: auto;
    overflow: auto;
    width: 100%;
    .item-img {
      padding-left: 15px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      :deep(.ant-image ){
        width: 100%;
      }
    }
  }
  .Temp_C-box{
    flex: 1;
    .item-remark{
     display: flex;
     flex-direction: column;
     margin: 0 0 0 1rem;
    .lab {
      border-width: 0px;
      font-size: 12px;
      color: #979595;
    }
    .data{
      border-width: 0px;
      font-size: 12px;
      color: #151515;
    }
  }
  .item {
    height: 30px;
    padding-left: 15px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    .lab {
      flex: 1;
      border-width: 0px;
      height: 112px;
      display: flex;
      font-size: 12px;
      color: #979595;
    }
    .data{
      flex: 1;
      display: flex;
      justify-content: flex-end;
      border-width: 0px;
      height: 112px;
      display: flex;
      font-size: 12px;
      color: #151515;
    }
  }
  }
  h4 {
    font-size: 16px;
    height: 20px;
    line-height: 18px;
    position: relative;
    border-left: 5px solid #108ee9;
    padding-left: 10px;
  }
  
}
</style>
