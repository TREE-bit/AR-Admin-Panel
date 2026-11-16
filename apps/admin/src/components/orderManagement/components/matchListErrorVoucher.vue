<template>
  <a-col :span="32" class="pr15">
    <div class="Temp_C-info">
      <!-- <h4>{{ $t("user.usdtBOrderInfo") }}</h4> -->
      <div class="Temp_C-box">
        <div class="item" v-if="usdtBOrderInfo?.orderSubmitAmount">
          <div class="lab">{{ $t("n42") }}</div>
          <span class="data">{{ usdtBOrderInfo?.orderSubmitAmount }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.orderActualAmount">
          <div class="lab">{{ $t("n105") }}</div>
          <span class="data">{{ usdtBOrderInfo?.orderActualAmount }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.createTime">
          <div class="lab">{{ $t("l95") }}</div>
          <span class="data">{{ usdtBOrderInfo?.createTime }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.submitTime">
          <div class="lab">{{ $t("n106") }}</div>
          <span class="data">{{ usdtBOrderInfo?.submitTime }}</span>
        </div>
      </div>
      <div class="Temp_C-box">
        <div class="item" v-if="usdtBOrderInfo?.utr" >
          <div class="lab">UTR</div>
          <span class="data">{{ usdtBOrderInfo?.utr }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.collectionPlatformOrder">
          <div class="lab">{{ $t("l90") }}</div>
          <span class="data">{{
            usdtBOrderInfo?.collectionPlatformOrder
          }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.paymentTime">
          <div class="lab">{{ $t("l38") }}</div>
          <span class="data">{{ usdtBOrderInfo?.paymentTime }}</span>
        </div>
      </div>
    </div>
    <div class="pictures_container">
      <h2>{{ $t("m170") }}</h2>
      <div  v-if="usdtBOrderInfo?.reason">{{ usdtBOrderInfo?.reason }}</div>
      <h2>{{ $t("m105") }}</h2>
      <div class="pic"  v-if="usdtBOrderInfo?.picInfo">
        <a-image  v-for="(item, index) in usdtBOrderInfo.picInfo" :key="index" :width="300" :height="480" :src="item" />
      </div>
      <div v-if="usdtBOrderInfo.videoUrl">
        <h2>{{ $t("m106") }}</h2>
        <video controls width="300" :src="usdtBOrderInfo.videoUrl"></video>
      </div>
    </div>
  </a-col>
</template>
<script lang="ts" setup>
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
const { usdtBOrderInfo } = getUsdtBuyOrderInfo();
</script>

<style scoped lang="less">
.pictures_container {
  margin: 3rem 0;
  h2 {
    padding: 1rem 0;
  }
}
.Temp_C-info {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  gap: 3rem;

  .Temp_C-box2 {
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
      :deep(.ant-image) {
        width: 100%;
      }
    }
  }
  .Temp_C-box {
    flex: 1;
    .item-remark {
      display: flex;
      flex-direction: column;
      margin: 0 0 0 1rem;
      .lab {
        border-width: 0px;
        font-size: 12px;
        color: #979595;
      }
      .data {
        border-width: 0px;
        font-size: 12px;
        color: #151515;
      }
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

      .lab {
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
