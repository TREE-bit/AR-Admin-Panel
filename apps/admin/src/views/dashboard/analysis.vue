<template>
  <div class="analysis">
    <div class="cont_sec">
        <div class="f1 bwhite" v-if="hasPermission('admin:merchantInfoAdmin:getOrderNumOverviewNo1')">
          <SyncOutlined v-show="!loading1" class="home-refresh" @click="getOrderNum" />
          <LoadingOutlined v-show="loading1" class="home-refresh" />
          <div class="order_head">
            <div class="label card-heading">{{ $t('m277') }}</div>
            <div class="number">
              {{
                thousand(orderNumOverview.pendingOrdersNum )|| 0
              }}
            </div>
          </div>
          <div class="cont_main">
            <!-- <div>
              <div class="label">{{ $t("m108") }}</div>
              <div class="number">
                {{ orderNumOverview.amountErrorNum || 0 }}
              </div>
            </div> -->
            <div :style="hasPro('/order/appeal/index')?'cursor:pointer':''" @click="goPath(0,hasPro('/order/appeal/index'))">
              <div class="label">{{ $t('m109') }}</div>
              <div class="number">
                {{ thousand(orderNumOverview.payAppealNum) || 0 }}
              </div>
            </div>
            <div :style="hasPro('/order/appeal/index')?'cursor:pointer':''" @click="goPath(1,hasPro('/order/appeal/index'))">
              <div class="label">{{ $t('m110') }}</div>
              <div class="number">
                {{ thousand(orderNumOverview.withdrawAppealNum) || 0 }}
              </div>
            </div>
          </div>
        </div>
        <div class="f1 bwhite" v-if="hasPermission('admin:merchantInfoAdmin:getOrderNumOverviewNo2')">
          <SyncOutlined v-show="!loading1" class="home-refresh" @click="getOrderNum" />
          <LoadingOutlined v-show="loading1" class="home-refresh" />
          <div class="order_head">
            <div class="label card-heading sale">{{ $t('m278') }}</div>
            <div class="number">
              {{
                thousand(orderNumOverview.beProcessedOrderNum) || 0
              }}
            </div>
          </div>
          <div class="cont_main">
            <div :style="hasPro('/order/assemble/index')?'cursor:pointer':''" @click="goPath(2,hasPro('/order/assemble/index'))">
              <div class="label">{{ $t('n54') }}</div>
              <div class="number">
                {{ thousand(orderNumOverview.matchingOrderNum) || 0 }}
              </div>
            </div>
            <div :style="hasPro('/order/buyOrder/index')?'cursor:pointer':''" @click="goPath(3,hasPro('/order/buyOrder/index'))">
              <div class="label">{{ $t('n85') }}</div>
              <div class="number">
                {{ thousand(orderNumOverview.waitForPaymentOrderNum) || 0 }}
              </div>
            </div>
            <div :style="hasPro('/order/sale/index')?'cursor:pointer':''" @click="goPath(4,hasPro('/order/sale/index'))">
              <div class="label">{{ $t('n86') }}</div>
              <div class="number">
                {{ thousand(orderNumOverview.waitForConfirmOrderNum)|| 0 }}
              </div>
            </div>
          </div>
        </div>
    </div>
    <div v-if="hasPermission('admin:merchantInfoAdmin:overviewNo5')">
      <div class="cont">
        <div class="f1 success-transactions">
          <SyncOutlined v-show="!loading2" class="home-refresh" @click="getMerchantInfo" />
          <LoadingOutlined v-show="loading2" class="home-refresh" />
          <div class="cont_main">
            <div>
              <div class="label">{{ $t("e33") }}</div>
              <div class="number">
                {{ currency(merchantInfo.todayMerchantPayAmount) }}
              </div>
            </div>
            <div>
              <div class="label">{{ $t("e34") }}</div>
              <div class="number">
                {{ thousand(merchantInfo.todayMerchantPayTransNum) || 0 }}
              </div>
            </div>
            <div>
              <div class="label">{{ $t("e35") }}</div>
              <div class="number">
                {{ currency(merchantInfo.todayMerchantPayCommission) }}
              </div>
            </div>
          </div>
        </div>
        <div class="f1 success-transactions">
          <SyncOutlined v-show="!loading2" class="home-refresh" @click="getMerchantInfo" />
          <LoadingOutlined v-show="loading2" class="home-refresh" />
          <div class="cont_main">
            <div>
              <div class="label">{{ $t("e39") }}</div>
              <div class="number">
                {{ currency(merchantInfo.todayMerchantWithdrawAmount) }}
              </div>
            </div>
            <div>
              <div class="label">{{ $t("e40") }}</div>
              <div class="number">
                {{ thousand(merchantInfo.todayMerchantWithdrawTransNum) || 0 }}
              </div>
            </div>
            <div>
              <div class="label">{{ $t("e41") }}</div>
              <div class="number">
                {{ currency(merchantInfo.todayMerchantWithdrawCommission) }}
              </div>
            </div>
          </div>
        </div>
      </div> 
      <div class="cont">
        <div class="f1 bwhite">
          <SyncOutlined v-show="!loading2" class="home-refresh" @click="getMerchantInfo" />
          <LoadingOutlined v-show="loading2" class="home-refresh" />
          <div class="card-heading">{{ $t("m118") }}</div>
          <div>
            <div class="cont">
              <div class="card-spacing">
                <div>
                  <div class="label">{{ $t("m119") }}</div>
                  <div class="number">
                    {{ currency(merchantInfo.todayPayAmount) }}
                  </div>
                </div>
                <div>
                  <div class="label">{{ $t("m121") }}</div>
                  <div class="number">
                    {{ currency(merchantInfo.todayUsdtAmount) }}
                  </div>
                </div>
                <div>
                  <div class="label">{{ $t("m120") }}</div>
                  <div class="number">{{ thousand(merchantInfo.todayPayFinishNum) }}</div>
                </div>
                <div class="f1">
                  <div class="label">{{ $t("m428") }}</div>
                  <div class="number">
                    <span
                      >{{
                        merchantInfo.todayPayTotalNum
                          ? (
                              ((merchantInfo.todayPayFinishNum || 0) /
                                merchantInfo.todayPayTotalNum) *
                              100
                            ).toFixed(2)
                          : "0.00"
                      }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="f1 bwhite">
          <SyncOutlined v-show="!loading2" class="home-refresh" @click="getMerchantInfo" />
          <LoadingOutlined v-show="loading2" class="home-refresh" />
          <div class="card-heading sale">{{ $t("m128") }}</div>
          <div>
            <div class="cont">
              <div class="card-spacing">
                <div>
                  <div class="label">{{ $t("m129") }}</div>
                  <div class="number">
                    {{ currency(merchantInfo.todayWithdrawAmount) }}
                  </div>
                </div>
                <div>
                  <div class="label">{{ $t("m130") }}</div>
                  <div class="number">
                    {{ currency(merchantInfo.todayWithdrawCommission) }}
                  </div>
                </div>
                <div>
                  <div class="label">{{ $t("m131") }}</div>
                  <div class="number">{{ thousand(merchantInfo.todayWithdrawFinishNum) }}</div>
                </div>
                <div class="f1">
                  <div class="label">{{ $t("m428") }}</div>
                  <div class="number">
                    <span
                      >{{
                        merchantInfo.todayWithdrawTotalNum
                          ? (
                              ((merchantInfo.todayWithdrawFinishNum || 0) /
                                merchantInfo.todayWithdrawTotalNum) *
                              100
                            ).toFixed(2)
                          : "0.00"
                      }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cont" v-if="hasPermission('admin:merchantInfoAdmin:getMerchantOrderOverview')">
      <div class="f1 bwhite">
        <div class="label card-heading">{{ $t('m279') }}</div>
        <collectionPayment/>
      </div>
    </div>
    <div class="cont" v-if="hasPermission('admin:memberInfoAdmin:getMemberOrderOverview')">
      <div class="f1 bwhite">
        <div class="label card-heading">{{ $t('m280') }}</div>
        <buySellOrder/>
      </div>
    </div>
    <div class="cont" v-if="hasPermission('admin:orderInfoAdmin:getOrderStatusOverview')">
      <div class="f1 bwhite">
        <div class="label card-heading">{{ $t('m281') }}</div>
        <orderStatus/>
      </div>
    </div>
    <div class="cont" v-if="hasPermission('admin:cancelOrderStaticAdmin:getCancelOrderStatics')">
      <div class="f1 bwhite">
        <div class="label card-heading">{{ $t('n248')}}</div>
        <cancelOrderCount/>
      </div>
    </div>
    <div class="cont" v-if="hasPermission('admin:biMemberStatistics:query')">
      <div class="f1 bwhite">
        <div class="label card-heading">{{ $t('m282')}}</div>
        <allMember/>
      </div>
    </div>
    <div class="cont" v-if="hasPermission('admin:biMerchantStatistics:query')">
      <div class="f1 bwhite">
        <div class="label card-heading">{{ $t('m283') }}</div>
        <merchantData/>
      </div>
    </div>
    <!-- <div class="data_charts">
      <dataEchart :title="$t('n45')" :dataList="buyOrderNum" v-permission="'admin:merchantInfoAdmin:overviewNo3'"/>
      <dataEchart :title="$t('n65')" :dataList="sellOrderNum" v-permission="'admin:merchantInfoAdmin:overviewNo4'"/>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getMerchantInfoData, getOrderNumOverview, queryBuySellGraphReport } from "@/api/merchant.api";
import {SyncOutlined, LoadingOutlined} from '@ant-design/icons-vue'
import dataEchart from "./components/dataEchart.vue";
import collectionPayment from "./components/collectionPayment.vue";
import buySellOrder from "./components/buySellOrder.vue";
import orderStatus from "./components/orderStatus.vue";
import allMember from "./components/allMember.vue";
import cancelOrderCount from "./components/cancelOrderCount.vue";
import merchantData from "./components/merchantData.vue";
import {usePermission} from '@/hooks';
import { currency,thousand } from "@/utils";
import { useRoute, useRouter } from "vue-router";
const route = useRoute(); 
const router = useRouter();
const { hasPermission }=usePermission()
const { t } = useI18n();
const hasPro = (path: string) => {
  const name = path.split('/').join('_')
  return router.hasRoute(name)
}
const goPath = (pathType: number, isGo:boolean)=>{
  if(!isGo) return;
  const goMap = [
    {name:'_order_appeal_index', query: {appealType: 2}},
    {name:'_order_appeal_index', query: {appealType: 1}},
    {name:'_order_assemble_index'},
    {name:'_order_buyOrder_index', query: {orderStatus: 3}},
    {name:'_order_sale_index', query: {orderStatus: 4}},
  ];
  router.push(goMap[pathType])
}
const loading1=ref(false)
const loading2=ref(false)
const categories1 = (() => {
  let res = [];
  let now = new Date();
  let len = 8;
  while (len--) {
    res.unshift(now.toLocaleTimeString().replace(/^\D*/, ""));
    now = new Date(+now - 2000);
  }
  return res;
})();
const data1 = (() => {
  let res = [];
  let len = 8;
  while (len--) {
    res.push(Math.round(Math.random() * 1000));
  }
  return res;
})();
const barChart = ref<any>(null);
const orderNumOverview = ref<any>({});
const getOrderNum = async () =>{
  loading1.value = true
  const res: any = await getOrderNumOverview().finally(() => {
    loading1.value = false
  })
  if(res && res.code === '1'){
    orderNumOverview.value = res.data;
  }
}

setInterval(() => {
  let axisData = new Date().toLocaleTimeString().replace(/^\D*/, "");
  data1.shift();
  data1.push(Math.round(Math.random() * 1000));
  categories1.shift();
  categories1.push(axisData);

  barChart.value &&
    barChart.value.setOption({
      xAxis: {
        data: categories1,
      },
      series: [
        {
          name: t("l87"),
          data: data1,
        },
      ],
    });
}, 2000);

const merchantInfo = ref<any>({});
const buyOrderNum = ref<any>([]);
const sellOrderNum = ref([]);
const getMerchantInfo = async () => {
  try {
    loading2.value = true
    const res: any = await getMerchantInfoData().finally(() => {
      loading2.value = false
    });
    if (res && res.data) {
      merchantInfo.value = res.data;
    }
  } catch (error) {
    console.error(error);
  }
};
const getGrapData = async () => {
  const res: any = await queryBuySellGraphReport();
  if(res && res.code == '1'){
      buyOrderNum.value = res.data.map((item:any) => {
        return {
          dateTime: item.reportDate,
          successOrderNum: item.buySuccessCount,
          actualMoney: item.buySuccessAmount,
          orderNum: item.buyDoneCount,
          cancelPay: item.buyCancelPayCount,
          cancelOrder: item .buyCancelOrderCount,
          appealNum: item.buyAppealDoneCount,
          // successRate: (Number(item.successRate)*100).toFixed(0) + '%'
        }
      }).reverse();
      sellOrderNum.value = res.data.map((item:any) => {
        return {
          dateTime: item.reportDate,
          successOrderNum: item.sellSuccessCount,
          actualMoney: item.sellSuccessAmount,
          orderNum: item.sellDoneCount,
          appealNum: item.sellAppealDoneCount,
          cancelMatchNum: item.sellCancelMatchOrderCount,
          continueMatchNum: item.sellContinueMatchOrderCount,
          // successRate: (Number(item.successRate)*100).toFixed(0) + '%'
        }
      }).reverse();
  }
}
onMounted(() => {
  getOrderNum();
  getMerchantInfo();
  getGrapData();
});
</script>
<style lang="less">
.analysis {
  .data_charts {
    display: flex;
    width: 100%;
    justify-content: space-between;
    & > div {
      flex: none;
      width: calc((100% - 10px) / 2);
      box-sizing: border-box;
    }
  }
  &-card {
    background: #fff;
    border-radius: 15px;
    padding: 8px;
  }
}
.cont_sec {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  >div{
    padding-top: 6px;
  }
  .order_head{
    display: flex;
    align-items: baseline;
    .number{
        font-size: 34px;
        font-weight: 700;
        margin-left: 10px;
        color: #fac10c;
    }
  }
  .cont_main {
    display: flex;
    >div{
      display: flex;
      align-items: baseline;
      // color: #1f1f1f;
      width: 33%;
      .number {
        font-size: 24px;
        font-weight: 400;
        margin-left: 10px;
        color: #fac10c;
      }
      .label {
        font-size: 12px;
        width: fit-content;
        flex: none;
        color: #727272;
      }
    }
  }
}
.cont {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  .card-spacing {
    position: relative;
    flex: 1;
    & > div {
      display: flex;
      align-items: center;
      float: left;
      width: 50%;
      height: 50px;
      .number {
        font-size: 18px;
        font-weight: 700;
        margin-left: 10px;
        color: #1f1f1f;
      }
      .label {
        font-size: 12px;
        flex: none;
        width: 110px;
        color: #727272;
      }
      & + div {
        // margin-top: 16px;
      }
    }
  }
  .f1.success-transactions {
    .cont_main {
      &>div {
        display: block;
        .number{
          margin: 0;
          text-align: center;
          width: 100%;
          flex: 0;
        }
        .label {
          text-align: center;
          width: 100%;
        }
      }
    }
  }
}
.bwhite {
  background-color: #fff;
  border-radius: 15px;
  padding: 24px;
}
.f1 {
  flex: 1;
  &.success-transactions {
    // display: flex;
    // align-items: start;
    flex-direction: column;
    height: auto;
    flex-wrap: wrap;
    background-color: #fff;
    border-radius: 15px;
    box-sizing: border-box;
    padding: 24px;
    .cont_top {
      display: flex;
      align-items: center;
      color: #1f1f1f;
      .number {
        font-size: 20px;
        font-weight: 900;
        margin-left: 10px;
      }
      .label {
        font-size: 16px;
        width: fit-content;
        flex: none;
      }
    }
    .cont_main {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 24px;
      & > div {
        display: flex;
        align-items: center;
        flex: 1;
        .number {
          font-size: 18px;
          font-weight: 700;
          margin-left: 10px;
          color: #1f1f1f;
          word-break: break-all;
        }
        .label {
          font-size: 12px;
          width: fit-content;
          flex: none;
          color: #727272;
        }
      }
    }
  }
  .card-heading {
    padding: 0 0 0 5px;
    height: 28px;
    display: flex;
    font-size: 20px;
    font-weight: 500;
    align-items: center;
    margin-bottom: 10px;
    &::before {
      content: "";
      display: block;
      height: 20px;
      width: 4px;
      background-color: #fac10c;
      margin-right: 10px;
    }
    &.sale {
      &::before {
        background-color: #2cc660;
      }
    }
  }
}
.home-refresh{
  float: right;
  font-size:20px;
  cursor: pointer;
}
</style>
