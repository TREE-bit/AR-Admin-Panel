<template>
  <a-col :span="32" class="pr15">
    <div class="Temp_C-info">
      <!-- <h4>{{ $t("user.usdtBOrderInfo") }}</h4> -->
      <div class="Temp_C-box">
        <div class="item-img">
          <a-image v-if="usdtBOrderInfo.usdtProof" style="max-width: 500px;" :src="usdtBOrderInfo ? usdtBOrderInfo.usdtProof : ''" />
          <a-empty :description="$t('n336')" v-if="!usdtBOrderInfo.usdtProof" />
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
  max-height: 734px;
  overflow: auto;
  width: 100%;
  display: flex;
  h4 {
    font-size: 16px;
    height: 20px;
    line-height: 18px;
    position: relative;
    border-left: 5px solid #108ee9;
    padding-left: 10px;
  }
  .item-img {
      padding-left: 15px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      img{
        border-width: 0px;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 320px;
        object-fit: cover;
      }
    }
}
</style>
