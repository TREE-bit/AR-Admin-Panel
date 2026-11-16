<template>
  <div class="Temp_C-info">
    <!-- <h4>{{ $t("user.usdtBOrderInfo") }}</h4> -->
    <div class="Temp_C-box2">
      <h3>{{ $t('n325') }}</h3>
      <div class="item-img">
        <a-image v-if="usdtBOrderInfo.voucher" style="max-width: 200px;" :src="usdtBOrderInfo ? usdtBOrderInfo.voucher : ''" />
        <a-empty :description="$t('n336')"  v-if="!usdtBOrderInfo.voucher" />
      </div>
    </div>
    <div class="Temp_C-box">
      <a-row :gutter="24" style="margin-left: 0px">
        <a-col :span="12">
          <h3>{{ $t('n326') }}</h3>
          <div class="itemB">
            <div class="item_label">{{ $t('n327') }}</div>
            <div class="item_info">{{ usdtBOrderInfo.bankCode || '-' }}</div>
          </div>
          <div class="itemB">
            <div class="item_label">UPI ID</div>
            <div class="item_info">{{ usdtBOrderInfo.upiId || '-' }}</div>
          </div>
          <div class="itemB">
            <div class="item_label">KYC ID</div>
            <div class="item_info">{{ usdtBOrderInfo.kycId || '-' }}</div>
          </div>
          <div class="itemB">
            <div class="item_label">{{ $t('n328') }}</div>
            <div class="item_info">{{ usdtBOrderInfo.mobileNumber || '-' }}</div>
          </div>
          <div class="itemB">
            <div class="item_label">UTR</div>
            <div class="item_info">{{ usdtBOrderInfo.utr || '-' }}</div>
          </div>
          <div class="itemB">
            <div class="item_label">TID</div>
            <div class="item_info">{{ usdtBOrderInfo.randomCode || '-' }}</div>
          </div>
        </a-col>
        <a-col :span="11">
          <h3>{{ $t('n329') }}</h3>
          <div class="itemB">
            <div class="item_label">{{ $t('n51') }}</div>
            <div class="item_info">{{ listInfo.orderStatus ? $t(orderStatusMap[listInfo.orderStatus]) : '-' }}</div>
          </div>
          <div class="itemB">
            <div class="item_label">{{ $t('l44') }}</div>
            <div class="item_info">
              <a-tooltip v-if="usdtBOrderInfo.cancellationReason">
                <template #title>{{ usdtBOrderInfo.cancellationReason }}</template>
                <div class="toopTipStyle">
                  {{ usdtBOrderInfo.cancellationReason }}
                </div>
              </a-tooltip>
              <span v-else>-</span>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="24" style="margin-left: 0px;">
        <a-col :span="12">
          <h3>{{ $t('n330') }}</h3>
          <div class="itemB">
            <div class="item_label">{{ $t('l50') }}</div>
            <div class="item_info">{{ usdtBOrderInfo.createTime || '-' }}</div>
          </div>
          <div class="itemB">
            <div class="item_label">{{ $t('l38') }}</div>
            <div class="item_info">{{ usdtBOrderInfo.paymentTime || '-' }}</div>
          </div>
          <div class="itemB">
            <div class="item_label">{{ $t('n44') }}</div>
            <div class="item_info">{{ usdtBOrderInfo.appealTime || '-' }}</div>
          </div>
          <div class="itemB">
            <div class="item_label">{{ $t('m734') }}</div>
            <div class="item_info">{{ usdtBOrderInfo.finishTime || '-' }}</div>
          </div>
        </a-col>
        <a-col :span="11">
          <h3>{{ $t('n331') }}</h3>
          <div class="itemB">
            <div class="item_label">{{ $t('l92') }}</div>
            <div class="item_info">{{ usdtBOrderInfo.merchantName || '-' }}</div>
          </div>
          <!-- <div class="itemB">
            <div class="item_label">{{ $t('m207') }}</div>
            <div class="item_info">{{ usdtBOrderInfo.merchantMemberId || '-' }}</div>
          </div> -->
          <div class="itemB">
            <div class="item_label">{{ $t('n332') }}</div>
            <div class="item_info">{{ usdtBOrderInfo.merchantOrder || '-' }}</div>
          </div>
        </a-col>
      </a-row>
      <!-- <div class="item"  v-if="usdtBOrderInfo?.memberId">
        <div class="lab">UID</div>
        <span class="data">{{ usdtBOrderInfo?.memberId }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.upiId">
        <div class="lab">UPI ID</div>
        <span class="data">{{ usdtBOrderInfo?.upiId }}</span>
      </div> -->
      <!-- <div class="item"  v-if="usdtBOrderInfo?.upiName">
        <div class="lab">UPI Name</div>
        <span class="data">{{ usdtBOrderInfo?.upiName }}</span>
      </div> -->
      <!-- <div class="item"  v-if="usdtBOrderInfo?.bankName">
        <div class="lab">{{ $t('m581') }}</div>
        <span class="data">{{ usdtBOrderInfo?.bankName }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.bankCardNumber">
        <div class="lab">{{ $t('m652') }}</div>
        <span class="data">{{ usdtBOrderInfo?.bankCardNumber }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.bankCardOwner">
        <div class="lab">{{ $t('m662') }}</div>
        <span class="data">{{ usdtBOrderInfo?.bankCardOwner }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.ifscCode">
        <div class="lab">ifscCode</div>
        <span class="data">{{ usdtBOrderInfo?.ifscCode }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.utr">
        <div class="lab">UTR</div>
        <span class="data">{{ usdtBOrderInfo?.utr }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.mobileNumber">
        <div class="lab">{{ $t("l35") }}</div>
        <span class="data">{{ usdtBOrderInfo?.mobileNumber }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.randomCode">
        <div class="lab">{{ $t('m635') }}</div>
        <span class="data">{{ usdtBOrderInfo?.randomCode }}</span>
      </div>
      <h2 style="margin-top: 10px">
        {{ $t("l36") }}
      </h2>
      <div class="line"></div>
      <div class="item"  v-if="usdtBOrderInfo?.matchTime">
        <div class="lab">{{ $t("l37") }}</div>
        <span class="data">{{ usdtBOrderInfo?.matchTime }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.createTime">
        <div class="lab">{{ $t("l38") }}</div>
        <span class="data">{{ usdtBOrderInfo?.createTime }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.completionTime">
        <div class="lab">{{ $t("l39") }}</div>
        <span class="data">{{ usdtBOrderInfo?.completionTime }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.appealReviewBy">
        <div class="lab">{{ $t("l40") }}</div>
        <span class="data">{{ usdtBOrderInfo?.appealReviewBy }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.appealReviewTime">
        <div class="lab">{{ $t("l41") }}</div>
        <span class="data">{{ usdtBOrderInfo?.appealReviewTime }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.cancelBy">
        <div class="lab">{{ $t("l42") }}</div>
        <span class="data">{{ usdtBOrderInfo?.cancelBy }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.cancelTime">
        <div class="lab">{{ $t("l43") }}</div>
        <span class="data">{{ usdtBOrderInfo?.cancelTime }}</span>
      </div>
      <div class="item"  v-if="usdtBOrderInfo?.remark">
        <div class="lab">{{ $t("remark") }}</div>
        <span class="data">{{ usdtBOrderInfo?.remark }}</span>
      </div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { orderStatusMap } from '@/utils/publicData';
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
const { usdtBOrderInfo } = getUsdtBuyOrderInfo();
defineProps(['listInfo']);
</script>

<style scoped lang="less">
.Temp_C-info {
  background-color: #fff;
  min-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
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
.Temp_C-box {
  flex: 2;
  .itemB{
    height: 30px;
    line-height: 30px;
    font-weight: 600;
    border-bottom: 1px solid #b4b2b2;
    border-right: 1px solid #b4b2b2;
    &>div{
      display: inline-block;
      height: 100%;
      text-align: center;
    }
    .item_label {
      width: 120px;
      float: left;
      background-color: #ddd;
      border-right: 1px solid #b4b2b2;
      border-left: 1px solid #b4b2b2;
    }
    .item_info {
      width: calc(100% - 120px);
      float: right;
    }
    &:first-of-type {
      border-top: 1px solid #b4b2b2;
    }
  }
}
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
:deep(.ant-col) {
  padding: 0!important;
  margin: 0!important;
}
h3{
  margin-top: 20px;
  margin-bottom: 10px;
}
.toopTipStyle{
  width: 100%;
  height: 28px;
}
</style>
