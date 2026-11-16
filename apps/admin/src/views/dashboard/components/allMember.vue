<template>
    <div class="member_cont">
        <div class="member_list">
            <div class="member_title">{{ $t('m284') }}</div>
            <div class="member_number">{{ thousand(memberInfo.memberTotalNum) }}</div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m285') }}</div>
            <div class="member_number">{{ thousand(memberInfo.yesterdayActiveNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.yesterdayActiveNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m286') }}</div>
            <div class="member_number">{{ thousand(memberInfo.buyNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.buyNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m287') }}</div>
            <div class="member_number">{{ thousand(memberInfo.rechargeActiveNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.rechargeActiveNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('n95') }}</div>
            <div class="member_number">{{ thousand(memberInfo.merchantMemberNum) }}</div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m288') }}</div>
            <div class="member_number">{{ thousand(memberInfo.sevenActiveNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.sevenActiveNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m289') }}</div>
            <div class="member_number">{{ thousand(memberInfo.sellNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.sellNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m290') }}</div>
            <div class="member_number">{{ thousand(memberInfo.withdrawNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.withdrawNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('n96') }}</div>
            <div class="member_number">{{ thousand(memberInfo.walletMemberNum) }}</div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m291') }}</div>
            <div class="member_number">{{ thousand(memberInfo.thirtyActiveNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.thirtyActiveNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m292') }}</div>
            <div class="member_number">{{ thousand(memberInfo.buyAndSellNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.buyAndSellNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m293') }}</div>
            <div class="member_number">{{ thousand(memberInfo.disableBuyNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.disableBuyNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m294') }}</div>
            <div class="member_number">{{ memberInfo.blackMemberNum == 0 ? '--' : thousand(memberInfo.blackMemberNum) }}</div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('c17') }}</div>
            <div class="member_number">{{ thousand(memberInfo.realNameNum) }}</div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m295') }}</div>
            <div class="member_number">{{ thousand(memberInfo.buyUsdtActiveNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.buyUsdtActiveNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
        <div class="member_list">
            <div class="member_title">{{ $t('m296') }}</div>
            <div class="member_number">{{ thousand(memberInfo.disableSellNum) }} /
                {{ memberInfo.memberTotalNum == 0 ? '0.00%' : ((memberInfo.disableSellNum/memberInfo.memberTotalNum)*100).toFixed(2) + '%' }}
            </div>
        </div>
    </div>
  </template>
  <script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { biMemberStatistics } from "@/api/merchant.api";
  import { thousand } from "@/utils/index";
  const { t } = useI18n();
  const barChart = ref<any>(null);
  const memberInfo = ref<any>({});
  const getMmemberInfo = async () => {
      const res: any = await biMemberStatistics();
      if (res && res.code == '1') {
        memberInfo.value = res.data[0];
      }
  };
  onMounted(() => {
    getMmemberInfo();
  });
  </script>
  <style lang="less" scoped>
    .member_cont{
        border-bottom:1px solid rgb(201, 201, 201);
        border-right:1px solid rgb(201, 201, 201);
        height: 184px;
        .member_list{
        width: 25%;
        height: 46px;
        float: left;
        >div{
            border-top:1px solid rgb(201, 201, 201);
            border-left:1px solid rgb(201, 201, 201);
        }
        >div{
            float: left;
            width: 50%;
            height: 46px;
            line-height: 46px;
            text-align: center;
            font-weight: 600;
            font-size: 12px;
        }
        }
    }
 
  </style>
  