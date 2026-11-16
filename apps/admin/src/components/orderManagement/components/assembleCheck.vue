<template>
  <!-- <a-col :span="32" class="pr15">
    <div class="Temp_C-info">
      <div class="Temp_C-box2">
        <div class="KYC_info">
          <div class="KYC_item" v-if="usdtBOrderInfo?.buyerKycInfo">
            <div class="KYC_item_title">{{ $t('m913') }}</div>
            <div class="KYC_item_info">KYC ID：{{ usdtBOrderInfo?.buyerKycInfo.upiId }}</div>
            <div class="KYC_item_info">UPI ID：{{ usdtBOrderInfo?.buyerKycInfo.upiId }}</div>
            <div class="KYC_item_info">{{ $t('m592')}}：
              <a-tag>
                <a-badge :color="usdtBOrderInfo?.buyerKycInfo?.sellerKycInfo == 1 ? 'green' : 'red'" />
                {{ linkStatusMap[usdtBOrderInfo?.buyerKycInfo.linkStatus] }}
              </a-tag>
            </div>
          </div>
          <div class="KYC_item" v-if="usdtBOrderInfo?.sellerKycInfo">
            <div class="KYC_item_title">{{ $t('m914') }}</div>
            <div class="KYC_item_info">KYC ID：{{ usdtBOrderInfo?.sellerKycInfo.id }}</div>
            <div class="KYC_item_info">UPI ID：{{ usdtBOrderInfo?.sellerKycInfo.upiId }}</div>
            <div class="KYC_item_info">{{ $t('m592')}}：
              <a-tag>
                <a-badge :color="usdtBOrderInfo?.sellerKycInfo.linkStatus == 1 ? 'green' : 'red'" />
                {{ linkStatusMap[usdtBOrderInfo?.sellerKycInfo.linkStatus] }}
              </a-tag>
            </div>
          </div>
        </div>
        <div class="item-img">
          <a-image class="asseInfoImg" v-if="usdtBOrderInfo.voucher" :src="usdtBOrderInfo ? usdtBOrderInfo.voucher : ''" />
          <a-empty :description="$t('n336')" v-if="!usdtBOrderInfo.voucher" />
        </div>
      </div>
      <div class="Temp_C-box">
        <h2>{{ $t("n242") }}</h2>
        <div class="line"></div>
        <div class="item" v-if="usdtBOrderInfo?.upiId">
          <div class="lab">UPI ID</div>
          <span class="data">{{ usdtBOrderInfo?.upiId }}</span>
        </div>
      <div class="item"  v-if="usdtBOrderInfo?.bankName">
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
        <div class="item" v-if="usdtBOrderInfo?.utr">
          <div class="lab">UTR</div>
          <span class="data">{{ usdtBOrderInfo?.utr }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.mobileNumber">
          <div class="lab">{{ $t("l35") }}</div>
          <span class="data">{{ usdtBOrderInfo?.mobileNumber }}</span>
        </div>
        <div class="item-remark" v-if="usdtBOrderInfo?.remark">
          <div class="lab" style="color: #000000">{{ $t("remark") }}</div>
          <span class="data">{{ usdtBOrderInfo?.remark }}</span>
        </div>
        <div class="item"  v-if="usdtBOrderInfo?.randomCode">
          <div class="lab">TID</div>
          <span class="data">{{ usdtBOrderInfo?.randomCode }}</span>
        </div>
        <h2 style="margin-top:3px">{{ $t("n241") }}</h2>
        <div class="item" v-if="usdtBOrderInfo?.createTime">
          <div class="lab">{{ $t("l37") }}</div>
          <span class="data">{{ usdtBOrderInfo?.createTime }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.paymentTime">
          <div class="lab">{{ $t("l38") }}</div>
          <span class="data">{{ usdtBOrderInfo?.paymentTime }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.completionTime">
          <div class="lab">{{ $t("l39") }}</div>
          <span class="data">{{ usdtBOrderInfo?.completionTime }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.appealReviewBy">
          <div class="lab">{{ $t("l40") }}</div>
          <span class="data">{{ usdtBOrderInfo?.appealReviewBy }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.appealReviewTime">
          <div class="lab">{{ $t("l41") }}</div>
          <span class="data">{{ usdtBOrderInfo?.appealReviewTime }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.cancelBy">
          <div class="lab">{{ $t("l42") }}</div>
          <span class="data">{{ usdtBOrderInfo?.cancelBy }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.cancelTime">
          <div class="lab">{{ $t("l43") }}</div>
          <span class="data">{{ usdtBOrderInfo?.cancelTime }}</span>
        </div>
        <div class="item" v-if="usdtBOrderInfo?.updateBy">
          <div class="lab">{{ $t("l48") }}</div>
          <span class="data">{{ usdtBOrderInfo?.updateBy }}</span>
        </div>
        <h2 v-if='usdtBOrderInfo?.recordList?.length != 0' style="margin-top:3px">{{ $t("n240") }}</h2>
        <div class="item" v-if='usdtBOrderInfo?.recordList?.length>0'>
          <div class="lab">{{ usdtBOrderInfo.recordList[0].name }}</div>
          <span class="data">{{ usdtBOrderInfo.recordList[0].time }}</span>
        </div>
        <div class="item" v-if='usdtBOrderInfo?.recordList?.length>1'>
          <div class="lab">{{ usdtBOrderInfo.recordList[1].name }}</div>
          <span class="data">{{ usdtBOrderInfo.recordList[1].time }}</span>
        </div>
        <div class="item" v-if='usdtBOrderInfo?.recordList?.length>=2'>
          <span class="data" style="cursor: pointer;" @click="showMoreTime">{{ $t('n276') }}</span>
        </div>
      </div>
    </div>
  </a-col> -->
  <a-row :gutter="16">
    <a-col :span="8">
      <!-- 交易信息 -->
      <h3>{{ $t('n733') }}</h3>
      <div class="assembleInfo">
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('n1207') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.merchantCode || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('n734') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.matchPoolCreateTime || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('c11') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.createTime || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('l38') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.paymentTime || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('m734') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.completionTime || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('remark') }}</span>
          <span class="infoItem_info">
            <a-tooltip v-if="usdtBOrderInfo.remark">
              <template slot="title">
                {{ usdtBOrderInfo.remark || '-' }}
              </template>
              <div class="toopTipStyle">
                {{ usdtBOrderInfo.remark || '-' }}
              </div>
            </a-tooltip>
            <span v-else>-</span>
          </span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('l48') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.updateBy || '-' }}</span>
        </div>
      </div>
      <!-- <a-row>
        <a-col :span="17">
          <div class="Temp_C-box">
            <h3 class="assembleTitle" v-if='usdtBOrderInfo?.recordList?.length != 0'>{{ $t("n240") }}</h3>
            <div class="item" v-if='usdtBOrderInfo?.recordList?.length>0'>
              <div class="lab">{{ usdtBOrderInfo.recordList[0].name }}</div>
              <span class="data">{{ usdtBOrderInfo.recordList[0].time }}</span>
            </div>
            <div class="item" v-if='usdtBOrderInfo?.recordList?.length>1'>
              <div class="lab">{{ usdtBOrderInfo.recordList[1].name }}</div>
              <span class="data">{{ usdtBOrderInfo.recordList[1].time }}</span>
            </div>
            <div class="item" v-if='usdtBOrderInfo?.recordList?.length>=2'>
              <span class="data" style="cursor: pointer;" @click="showMoreTime">{{ $t('n276') }}</span>
            </div>
          </div>
        </a-col>
      </a-row> -->
    </a-col>
    <!-- 收款信息 -->
    <a-col :span="8">
      <h3>{{ $t('m36') }}</h3>
      <div class="assembleInfo">
        <div class="assembleInfo_item" v-if="usdtBOrderInfo.sourceType != 2">
          <span class="infoItem_label">UPI ID</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.sellerCollectInfo?.upiId || '-' }}</span>
        </div>
        <div class="assembleInfo_item" v-if="usdtBOrderInfo.sourceType == 2">
          <span class="infoItem_label">{{ $t('m581') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.sellerCollectInfo?.bankName || '-' }}</span>
        </div>
        <div class="assembleInfo_item" v-if="usdtBOrderInfo.sourceType == 2">
          <span class="infoItem_label">{{ $t('m652') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.sellerCollectInfo?.bankCardNumber || '-' }}</span>
        </div>
        <div class="assembleInfo_item" v-if="usdtBOrderInfo.sourceType == 2">
          <span class="infoItem_label">{{ $t('n621') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.sellerCollectInfo?.bankCardOwner || '-' }}</span>
        </div>
        <div class="assembleInfo_item" v-if="usdtBOrderInfo.sourceType == 2">
          <span class="infoItem_label">IFSC</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.sellerCollectInfo?.ifscCode || '-' }}</span>
        </div>
      </div>
    </a-col>
    <a-col :span="8">
      <!-- KYC信息-卖家 -->
      <h3 v-if="kycLinkStatusChangeSource == 2">{{ $t('n726') }}</h3>
      <div v-if="kycLinkStatusChangeSource == 2" class="assembleInfo">
        <div class="assembleInfo_item">
          <span class="infoItem_label">UPI ID</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.sellerKycInfo?.upiId || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">KYC ID</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.sellerKycInfo?.kycId || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('n727') }}</span>
          <span class="infoItem_info">{{ linkStatusMap[usdtBOrderInfo.sellerKycInfo?.linkStatus] || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('n728') }}</span>
          <span class="infoItem_info">{{ 
          usdtBOrderInfo.sellerKycInfo?.kycStatus == 1 ? $t('enabled') : usdtBOrderInfo.sellerKycInfo?.kycStatus == 0 ? $t('disabled') : '-'
          }}</span>
        </div>
      </div>
      <!-- KYC信息-买家 -->
      <h3 v-if="kycLinkStatusChangeSource == 1">{{ $t('n729') }}</h3>
      <div v-if="kycLinkStatusChangeSource == 1" class="assembleInfo">
        <div class="assembleInfo_item">
          <span class="infoItem_label">UPI ID</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.buyerKycInfo?.upiId || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">KYC ID</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.buyerKycInfo?.kycId || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('n727') }}</span>
          <span class="infoItem_info">{{ linkStatusMap[usdtBOrderInfo.buyerKycInfo?.linkStatus] || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('n728') }}</span>
          <span class="infoItem_info">{{ 
          usdtBOrderInfo.buyerKycInfo?.kycStatus == 1 ? $t('enabled') : usdtBOrderInfo.buyerKycInfo?.kycStatus == 0 ? $t('disabled') : '-'
         }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('m582') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.buyerKycInfo?.bankCode || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('c9') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.buyerKycInfo?.memberId || '-' }}</span>
        </div>
        <div class="assembleInfo_item">
          <span class="infoItem_label">{{ $t('n328') }}</span>
          <span class="infoItem_info">{{ usdtBOrderInfo.buyerKycInfo?.mobileNumber || '-' }}</span>
        </div>
      </div>
    </a-col>
  </a-row>
  <!-- 人工审核 -->
  <div v-show="!isClick">
    <h3 style="display: inline-block;" class="assembleTitle">{{ $t("m479") }}</h3>
    <!-- <a-popconfirm
      :title="$t('m480')"
      :ok-text="$t('b28')"
      :cancel-text="$t('b10')"
      icon=""
      @confirm="confirm(1)"
      @cancel="cancel"
      :disabled="isClick"
    >
      <template #description>
        <div style=" text-align: center; margin-bottom: 10px; font-weight: 600; "  >
          {{ $t("m481") }}
        </div>
        <div style="text-align: center; margin-bottom: 30px" >
          {{ $t("m482") }}
        </div>
      </template>
      <a-button
        :disabled="isClick"
        :type="btnType1 ? 'primary' : 'dashed'"
        @click="showPass"
        >{{ $t("m483") }}
      </a-button>
    </a-popconfirm> -->
    <a-popconfirm
      :title="$t('m490')"
      :ok-text="$t('b28')"
      :cancel-text="$t('b10')"
      icon=""
      @confirm="confirm(2)"
      @cancel="cancel"
    >
      <template style="height: 400px;" #description>
        <div style=" margin-bottom: 10px; font-weight: 600; "  >
          {{ $t("m486") }}
        </div>
        <a-radio-group v-model:value="reasonvalue">
          <a-radio :style="radioStyle" :value="1">{{ $t('m487') }}</a-radio>
          <a-radio :style="radioStyle" :value="2">
            {{ $t('l80') }}
          </a-radio>
          <a-textarea v-model:value="addForm.reasonRemark" :disabled="reasonvalue != 2" style="width: 300px; height: 60px; display: block;" :placeholder="$t('p57')"/>
        </a-radio-group>
        <div style=" margin-bottom: 10px; font-weight: 600; "  >
          {{ $t("m488") }}
        </div>
        <div style=" margin-bottom: 10px; "  >
          {{ $t("m489") }}
        </div>
      </template>
      <a-button
        style="margin-left: 10px;"
        :type="'primary'"
        size="small"
        @click="showNotPass"
        >{{ $t("m484") }}
      </a-button>
    </a-popconfirm>
  </div>
  <a-row style="margin-top: 10px;">
    <!-- KYC连接日志 -->
    <a-col :span="24">
      <h3>{{ $t('n730') }}</h3>
      
      <assembleKycLinkLog 
        :assembleRecord="props.assembleRecord"
        :assembleInfo="usdtBOrderInfo"
        v-if="usdtBOrderInfo.matchPoolCreateTime"
      />
      <!-- <div class="assembleInfoTableBtnBox">
        <a-button :type="kycLinkStatusChangeSource == 2 ? 'primary' :'default' " size="small" v-if="!detailData.isQuiclyOrder" :loading="loading" @click="changeGet(2)">{{ $t('n731') }}</a-button>
        <a-button :type="kycLinkStatusChangeSource == 1 ? 'primary' :'default' " size="small" v-if="!detailData.isQuiclyOrder" :loading="loading" @click="changeGet(1)">{{ $t('n732') }}</a-button>
        <a-button size="small" :loading="loading" @click="getList(1)">{{ $t('m153') }}</a-button>
      </div>
      <div class="kycConnectLogTable">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          :pagination="pagination"
          :scroll="{ x: '100%', y: '44vh'}"
          :loading="loading"
          size="small"
          @change="handleTableChange"
          bordered
        >
        <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'bankCode'">
          <a-tooltip v-if="record.bankCode">
            <template #title>
              {{ record.bankCode }}
            </template>
            <div class="toopTipStyle">
              {{ record.bankCode  }}
            </div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'phoneNumber'">
          <a-tooltip v-if="record.phoneNumber">
            <template #title>
              {{ record.phoneNumber }}
            </template>
            <div class="toopTipStyle">
              {{ record.phoneNumber  }}
            </div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'kycLinkStatusChangeType'">
          <span class="arbListTag">
            <span class="pointTag" :style="record.kycLinkStatusChangeType == 1 ? 'background-color:#52c41a' : 'background-color:#f5222d'" ></span>
            {{ $getMapItem(kycLinkStatusChangeTypeMap,record.kycLinkStatusChangeType) || '-' }}
          </span>
        </template>
          <template v-if="column.key === 'kycLinkStatusChangeReason'">
            <a-tooltip>
              <template #title>
                {{ $getMapItem(kycLinkStatusChangeReasonMap,record.kycLinkStatusChangeReason) || '-' }}
              </template>
              <div class="toopTipStyle">
                {{ $getMapItem(kycLinkStatusChangeReasonMap,record.kycLinkStatusChangeReason) || '-' }}
              </div>
            </a-tooltip>
          </template>
          <template v-if="column.key === 'operationTime'">
            {{ record.operationTime || '-' }}
          </template>
          <template v-if="column.key === 'restResultsCode'">
            <div v-if="record.restResults && record.restResults.length>0">
              <div v-for="(item,index) in record.restResults" :key="index" class="table_inner_result">
                {{ item.httpCode || '-' }}
              </div>
            </div>
            <div v-else class="table_inner_result">-</div>
          </template>
          <template v-if="column.key === 'restResultsBody'">
            <div v-if="record.restResults && record.restResults.length>0">
              <div v-for="(item,index) in record.restResults" :key="index" class="table_inner_result">
                <a-tooltip v-if="item.responseBody">
                  <template #title>
                    {{ item.responseBody }}
                  </template>
                  <div class="toopTipStyle">
                    {{ item.responseBody }}
                  </div>
                </a-tooltip>
                <span v-else>-</span>
              </div>
            </div>
            <div v-else class="table_inner_result">-</div>
          </template>
          <template v-if="column.key === 'restResultsDesc'">
            <div v-if="record.restResults && record.restResults.length>0">
              <div v-for="(item,index) in record.restResults" :key="index" class="table_inner_result">
                <a-tooltip v-if="item.remark">
                  <template #title>
                    {{ item.remark }}
                  </template>
                  <div class="toopTipStyle">
                    {{ item.remark }}
                  </div>
                </a-tooltip>
                <span v-else>-</span>
              </div>
            </div>
            <div v-else class="table_inner_result">-</div>
          </template>
          <template v-if="column.key === 'restResultsSuccess'">
            <div v-if="record.restResults && record.restResults.length>0">
              <div v-for="(item,index) in record.restResults" :key="index" class="table_inner_result">
                <a-tag :color="item.success == 1 ? 'green' : 'red'">
                  {{ item.success == 1 ? $t('s10') : $t('m618') }}
                </a-tag>
              </div>
            </div>
            <div v-else class="table_inner_result">-</div>
          </template>
          <template v-if="column.key === 'action'">
            <a-tag
              color="rgba(22, 155, 213, 1)"
              style="cursor: pointer"
              size="small"
              @click="openResultLog(record)"
              v-if="record.kycLinkStatusChangeType == 1"
            >{{ $t("n784") }}</a-tag>
            <span v-else >-</span>
          </template>
        </template>
        </a-table>
      </div> -->
    </a-col>
  </a-row>
  <a-modal
    v-model:open="moretime"
    :title="$t('n240')"
    @cancel="cancelMoreTime"
    :footer="null"
  >
    <div class="moreTimeBox">
      <a-row v-for="(item,key) in moreTimeList" :key="key">
        <a-col class="moreTimeBox_item" :span="24" :style="key%2 == 0 ? 'background-color: #eee' : ''">
          <div class="moreTimeBox_lab">
            {{ item.name }}
          </div>
          <div class="moreTimeBox_data">
            {{ item.time }}
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
  <!-- kyc流水记录-->
  <a-modal
    v-model:open="resultLogModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
    @cancel="clostResultLogModel"
    >
    <kycPullResultLog
      v-if="resultLogModel"
      :connectionUuid="connectionUuid"
      />
  </a-modal>
</template>
<script setup lang="ts">
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import { manualReview,getMatchListResult } from "@/api";
import { matchingOrderAdminKycLinkLog } from "@/api/order.api";
import { ref, reactive, watch, onMounted, watchEffect } from 'vue'
import { message } from "ant-design-vue";
import { kycLinkStatusChangeTypeMap, kycLinkStatusChangeReasonMap } from "@/utils/publicData";
import assembleKycLinkLog from "./assembleKycLinkLog.vue";
import { useI18n } from "vue-i18n";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import kycPullResultLog from "@/components/Kyc/kycPullResultLog.vue";
import Bus from "@/utils/bus";
const props = defineProps({
  detailData: {
    type: Object,
    default: () => ({
      id: undefined,
      isQuiclyOrder: false,
      kycLinkStatusChangeSource: 0,
      isManualReviewClick: true,
    }),
  },
  assembleRecord: {
    type: Object,
    default: () => ({}),
  },
});
const { t } = useI18n();
// const { usdtBOrderInfo } = getUsdtBuyOrderInfo();
const usdtBOrderInfo:any = ref({});// 撮合订单详情

// const assembleInfo:any = ref({});// 撮合详情
const getAssembleData = async () => {
  const res = await getMatchListResult({id:props.assembleRecord.id});
  if(res && res.data){
    usdtBOrderInfo.value = res.data;
  }
};
const btnType1 = ref(false);
const btnType2 = ref(false);
const reasonvalue = ref<number>(1);
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});
const loading = ref(false);
const dataSource = ref([]);
const kycLinkStatusChangeSource = ref(props.detailData.kycLinkStatusChangeSource);
const query = ref({
  pageNo: 1,
  pageSize: 20,
  id: props.detailData.id,
  kycLinkStatusChangeSource: kycLinkStatusChangeSource.value,
  matchPoolCreateTime: usdtBOrderInfo.value.matchPoolCreateTime,
});
const pagination = ref({
  pageSizeOptions: ["10", "20"],
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: false,
  showTotal: (total: any) => t("total", [total]),
});
const columns:any = [
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 90,
  },
  {
    title: t('n328'),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
    width: 120,
  },
  {
    title: t('n785'),
    dataIndex: "kycLinkStatusChangeType",
    key: "kycLinkStatusChangeType",
    align: "center",
    width: 90,
  },
  {
    title: t('n736'),
    dataIndex: "kycLinkStatusChangeReason",
    key: "kycLinkStatusChangeReason",
    align: "center",
    width: 160,
  },
  {
    title: t('l67'),
    dataIndex: "operationTime",
    key: "operationTime",
    align: "center",
    width: 120,
  },
  {
    title: t('n737'),
    children: [
      {
        title: t('n738'),
        dataIndex: "restResultsCode",
        key: "restResultsCode",
        align: "center",
        width: 90,
      },
      {
        title: t('n739'),
        dataIndex: "restResultsBody",
        key: "restResultsBody",
        align: "center",
        width: 160,
      },
      {
        title: t('n740'),
        dataIndex: "restResultsDesc",
        key: "restResultsDesc",
        align: "center",
        width: 120,
      },
      {
        title: t('state'),
        dataIndex: "restResultsSuccess",
        key: "restResultsSuccess",
        align: "center",
        width: 120,
      },
    ],
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 80,
  },
];
const getList = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  dataSource.value = [];
  query.value.matchPoolCreateTime = usdtBOrderInfo.value.matchPoolCreateTime;
  query.value.kycLinkStatusChangeSource = kycLinkStatusChangeSource.value;
  const res: any = await matchingOrderAdminKycLinkLog(query.value).finally(() => loading.value = false);
  if (res && res.code == "1") {
    dataSource.value = res.data;
    pagination.value.total = res.total;
    pagination.value.current = query.value.pageNo;
    pagination.value.pageSize = query.value.pageSize;
    // clearSelected();
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  if(pag.pageSize != pagination.value.pageSize){
    query.value.pageNo = 1;
    pagination.value.current = 1;
  }else{
    query.value.pageNo = pag.current;
    pagination.value.current = pag.current;
  }
  pagination.value.pageSize = pag.pageSize;
  query.value.pageSize = pag.pageSize;
  getList();
};
// 切换买家卖家
const changeGet = (type: number) => {
  kycLinkStatusChangeSource.value = type;
  getList(1);
};
// KYC流水记录
const resultLogModel = ref(false);
const connectionUuid = ref('');
const openResultLog = (record: any) => {
  connectionUuid.value = record.connectionUuid;
  resultLogModel.value = true;
  selectedRow();
};
const clostResultLogModel = () => {
  resultLogModel.value = false;
  connectionUuid.value = '';
};
const addForm = ref<any>({
  id: null,
  isPass:null,
  refuseReason:null,
  reasonRemark:null,
})

const linkStatusMap = <any>{
  0:t('m594'),// 未连接
  1:t('m595'),// 已连接
}
watch(reasonvalue,()=>{
  if(reasonvalue.value === 1) { addForm.value.reasonRemark = null };
})
const showPass = () => {
  btnType1.value = true;
  btnType2.value = false;
}
const showNotPass = () => {
  btnType1.value = false;
  btnType2.value = true;
}

const isClick = ref(true);// 是否显示审核按钮
isClick.value = props.detailData.isManualReviewClick;
const confirm = async (n:number) => {
  addForm.value.id = usdtBOrderInfo.value.id;
  if(n == 1){
    addForm.value.isPass = 1;
  }
  if(n == 2){
    addForm.value.refuseReason = reasonvalue.value;
    addForm.value.isPass = 2;
  }
  const res: any = await manualReview(addForm.value);
  if(res && res.code == '1'){
    Bus.emit('manualReviewClick', true);
    message.success(t('s10'));
    isClick.value = true;
  }
}
const cancel = () => {
  btnType1.value = false;
  btnType2.value = false;
  addForm.value = {
    id: null,
    isPass:false,
    refuseReason:null,
    reasonRemark:null,
  }
}
const moreTimeList = ref<{ name: string; time: string }[]>([]);
const moretime = ref(false);
const showMoreTime = () => {
  moretime.value = true;
  moreTimeList.value = usdtBOrderInfo.value.recordList;
}
const cancelMoreTime = () => {
  moretime.value = false;
}
onMounted(async () => {
  await getAssembleData();
  // watchEffect(() => {
  //   if(usdtBOrderInfo.value.matchPoolCreateTime) {
  //     getList();
  //   }
  // });
  // getList();
});
</script>

<style scoped lang="less">
.Temp_C-info {
  background-color: #fff;
  min-height: 500px;
  overflow: auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 3rem;
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

  .Temp_C-box2 {
    flex: 1;
    background-color: #fff;
    height: auto;
    overflow: auto;
    width: 100%;
    .item-img {
      padding-left: 15px;
      display: flex;
      width: 200px;
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
}
.KYC_info{
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  justify-content: space-between;
  .KYC_item{
    width: calc((100% - 30px) / 2);
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    &_title{
      font-weight: bold;
    }
  }
}
:deep(.asseInfoImg) {
  max-width: 200px;
  max-height: 200px;
}
.ant-row{
  display: flex;
  .ant-col:last-child{
    margin-right: 0;
    margin-left: auto;
  }
}
.moreTimeBox{
  width: 100%;
  height: 400px;
  overflow-y: auto;
  .moreTimeBox_item{
    padding: 4px;
  }
  .moreTimeBox_lab{
    float: left;
  }
  .moreTimeBox_data{
    float: right;
  }
}
.assembleTitle{
  padding: 15px 0 5px 0;
}
.assembleInfo{
  border: 1px solid #ddd;
  .assembleInfo_item{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    &>span{
      display: inline-block;
      width: 50%;
      text-align: center;
      padding: 5px;
    }
    &:last-child{
      border-bottom: none;
    }
    .infoItem_label{
      border-right: 1px solid #ddd;
    }
    .infoItem_info{
    }
  }
}
.assembleInfoTableBtnBox{
  display: flex;
  padding-bottom: 3px;
  button{
    margin-right: 10px;
    &:last-child{
      margin-right: 0;
      margin-left: auto;
    }
  }
}
</style>
