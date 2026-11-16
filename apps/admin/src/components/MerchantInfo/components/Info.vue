<template>
  <a-col :span="24" class="pr15">
    <div class="Temp_C-info">
      <h4>{{ $t("userMerchantDetail") }}</h4>
      <div class="Temp_C-box">
        <div class="item">
          <div class="lab">{{ $t("userName") }}</div>
          <span class="data">{{ merchantDetail?.username }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t("userCountry") }}</div>
          <span class="data">{{ merchantDetail?.country }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t("userWeb") }}</div>
          <a-tooltip>
            <template #title>
              <span>{{ merchantDetail?.website }}</span>
            </template>
            <!-- <div class="data toopTipStyle"> -->
              <span class="data toopTipStyle">{{ merchantDetail?.website }}</span>
            <!-- </div> -->
          </a-tooltip>
        </div>
        <div class="item">
          <div class="lab">{{ $t("userCreatTime") }}</div>
          <span class="data">{{ merchantDetail?.createTime }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t("n1477") }}:</div>
          <span class="data">{{ merchantDetail?.code || "-" }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t("n1478") }}:</div>
          <span class="data">{{ merchantDetail?.merchantCode || "-" }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t("userCurrency") }}</div>
          <span class="data">{{ merchantDetail?.currency }}</span>
        </div>
        <div class="item mb20">
          <div class="lab">{{ $t("userStatus") }}</div>
          <span class="data">
            <!-- <a-tag :color="merchantDetail?.status === '1' ? 'green' : 'red'"></a-tag> -->
            {{
              merchantDetail?.status === "1" ? $t("publicType1") : $t("l54")
            }}
          </span>
        </div>
        <!-- <div class="item iconBox">
          <div class="lab">{{ $t('m381') }}</div>
          <div class="lab empty"></div>
          <span class="data">
            <img class="userIcon" :src="merchantDetail.icon ? merchantDetail?.icon : noUp" alt="Image"/>
          </span>
        </div> -->
        <!-- <div class="item">
          <div class="lab">{{ $t("userLogins") }}</div>
          <span class="data">{{ merchantDetail?.logins }}</span>
        </div> -->
        <!-- <div class="item">
          <div class="lab">{{ $t("userLabel1") }}</div>
          <span class="data">{{ merchantDetail?.payRate || '0' }}%</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t("userLabel2") }}</div>
          <span class="data">{{ merchantDetail?.transferRate || '0' }}%</span>
        </div> -->
        <!-- <div class="item af">
          <div class="lab">{{ $t("m384") }}</div>
          <span class="data">{{ merchantDetail?.rechargeRewardRatio || '0' }}%</span>
        </div> -->
        <!-- <div class="item">
          <div class="lab">{{ $t("userLabel3") }}</div>
          <span class="data">{{ merchantDetail?.totalPayAmount }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t("userLabel4") }}</div>
          <span class="data">{{ merchantDetail?.totalWithdrawAmount }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t("userLabel5") }}</div>
          <span class="data">{{ merchantDetail?.transferDownCount }}</span>
        </div>
        <div class="item">
          <div class="lab">{{ $t("userLabel6") }}</div>
          <span class="data">{{ merchantDetail?.transferDownAmount }}</span>
        </div> -->
        <!-- <div class="item fast">
          <div class="lab">{{ $t('m382') }}</div>
          <div class="listBox">
            <div class="listItem">
              <span class="data">{{ fastMoney.one ?currency(fastMoney.one,false): '0.00' }}<b>IToken</b></span>
              <span class="data">{{ fastMoney.two ?currency(fastMoney.two,false): '0.00' }}<b>IToken</b></span>
              <span class="data">{{ fastMoney.three ?currency(fastMoney.three,false): '0.00' }}<b>IToken</b></span>
            </div>
            <div class="listItem">
              <span class="data">{{ fastMoney.four ?currency(fastMoney.four,false): '0.00' }}<b>IToken</b></span>
              <span class="data">{{ fastMoney.five ?currency(fastMoney.five,false): '0.00' }}<b>IToken</b></span>
              <span class="data">{{ fastMoney.six ? currency(fastMoney.six,false): '0.00' }}<b>IToken</b></span>
            </div>
            <div class="listItem">
              <span class="data">{{ fastMoney.seven ? currency(fastMoney.seven,false): '0.00' }}<b>IToken</b></span>
              <span class="data">{{ fastMoney.eight ? currency(fastMoney.eight,false): '0.00' }}<b>IToken</b></span>
              <span class="data">{{ fastMoney.nine ? currency(fastMoney.nine,false): '0.00' }}<b>IToken</b></span>
            </div>
          </div>
          </div> -->
      </div>
    </div>
  </a-col>
</template>
<script setup lang="ts">
import { useMerchantInfo } from "@/hooks/useMerchantInfo.hook";
import { currency } from "@/utils";
import { ref, watch, onMounted } from 'vue'
import noUp from "@/assets/no_up.png";
const { merchantDetail } = useMerchantInfo();
// const fastMoney = ref({});
// watch(()=>merchantDetail.value,()=>{
//   let values;
//   if(!merchantDetail.value.quickAmount || merchantDetail.value.quickAmount.length<=9){
//     fastMoney.value = {
//       one: 0,
//       two: 0,
//       three: 0,
//       four: 0,
//       five: 0,
//       six: 0,
//       seven: 0,
//       eight: 0,
//       nine: 0,
//     }
//   }else{
//     values = merchantDetail.value.quickAmount.split('|')
//     fastMoney.value = {
//       one: values[0],
//       two: values[1],
//       three: values[2],
//       four: values[3],
//       five: values[4],
//       six: values[5],
//       seven: values[6],
//       eight: values[7],
//       nine: values[8],
//     }
//   }
// })
</script>

<style scoped lang="less">
.Temp_C-info {
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
    margin-bottom: 20px;
  }
  .Temp_C-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between; 
    border: 1px solid #ddd;
  }
  .item {
    flex: 0 0 25%;
    box-sizing: border-box;
    height: 80px;
    min-height: 30px;
    // padding-left: 15px;
    // display: flex;
    text-align: center;
    .lab,.data {
      float: left;
      display: block;
      width: 50%;
      height: 79px;
      line-height: 80px;
      &.lab{
        background-color: #f5f5f5;
        border-right:1px solid #ddd;
      }
      &.data{
        background-color: #fff;
        border-right:1px solid #ddd;
        white-space: nowrap;
      }
    }
    &:nth-child(1),&:nth-child(2),&:nth-child(3),&:nth-child(4){
      border-bottom:1px solid #ddd;
    }
  }
  .iconBox{
    .lab::after{
      content: ":";
    }
    .userIcon{
      margin-top: 5px;
      width: 70px;
      height: 70px;
      border-radius: 10px;
    }
    .empty::after{
      content: "";
    }
  }
  .af{
    .lab::after{
      content: ':';
    }
  }
  .fast{
    display: block;
    .lab{
      float: left;
    }
    .lab::after{
      content: ':';
    }
    .listBox{
      float: left;
      width: 450px;
      height: 150px;
      .listItem{
        width: 450px;
        height: 50px;
        span{
          float: left;
          width: 150px;
          font-weight: 600;
          b{margin-left: 5px;}
        }
      }
    }
  }
}
</style>
