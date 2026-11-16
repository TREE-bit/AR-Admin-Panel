<template>
  <div>
    <div class="assembleInfoTableBtnBox">
      <a-button :type="kycLinkStatusChangeSource == 2 ? 'primary' :'default' " size="small" v-if="!isQuiclyOrder" :loading="kycConnetLoading" @click="changeGet(2)">{{ $t('n731') }}</a-button>
      <a-button :type="kycLinkStatusChangeSource == 1 ? 'primary' :'default' " size="small" v-if="!isQuiclyOrder" :loading="kycConnetLoading" @click="changeGet(1)">{{ $t('n732') }}</a-button>
      <a-button size="small" :loading="kycConnetLoading" @click="getKycConnetDataData(1)">{{ $t('m153') }}</a-button>
    </div>
    <div class="kycConnectLogTable">
      <a-table
        :dataSource="kycConnetData"
        :columns="kycConnetColumns"
        :pagination="kycConnetPagination"
        :scroll="{ x: '100%', y: '44vh'}"
        :loading="kycConnetLoading"
        size="small"
        @change="kycConnetHandleTableChange"
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
    </div>
  </div>
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
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import {
  matchingOrderAdminKycLinkLog,
  getMatchListResult,
  kycPartnersAdminList,
  kycLinkStatusLogAdminListPage,
 } from "@/api";
import { useI18n } from "vue-i18n";
import { useTableData } from "@/hooks/useTableData.hook";
import kycPullResultLog from "@/components/Kyc/kycPullResultLog.vue";
import { kycLinkStatusChangeTypeMap, kycLinkStatusChangeReasonMap } from "@/utils/publicData";

const { t } = useI18n();


const isFirstMount = ref(true);
const props = defineProps<{
  assembleRecord: any;
  assembleInfo?: any;
}>();
// KYC流水记录
const resultLogModel = ref(false);
const connectionUuid = ref('');
const openResultLog = (record: any) => {
  connectionUuid.value = record.connectionUuid;
  resultLogModel.value = true;
};
const clostResultLogModel = () => {
  resultLogModel.value = false;
  connectionUuid.value = '';
};

/**************************************************************************************************************
************************************************************************************************************
*************************************************************************************************************
******************************************* 获取会员KYC信息 *******************************************
*************************************************************************************************************/
const buyerMemberKycInfo = ref<any>({});
const sellerMemberKycInfo = ref<any>({});
const getMemberKycInfo = async () => {
  const buyRes:any = await kycPartnersAdminList({
    id: props.assembleRecord.kycId,
    memberId: props.assembleRecord.collectionMemberId,
  });
  if (buyRes && buyRes.data) {
    buyerMemberKycInfo.value = buyRes.data[0];
    console.log('buyer',buyerMemberKycInfo.value)
  }
  const sellRes:any = await kycPartnersAdminList({
    id: props.assembleRecord.kycId,
    memberId: props.assembleRecord.paymentMemberId,
  });
  if (sellRes && sellRes.data) {
    sellerMemberKycInfo.value = sellRes.data[0];
    kycLinkQuery.value.bankCode = sellerMemberKycInfo.value.bankCode;
    kycLinkQuery.value.phoneNumber = sellerMemberKycInfo.value.mobileNumber;
    console.log('seller',sellerMemberKycInfo.value)
  }
}
/************************************************************************************************************* 
************************************************************************************************************
*************************************************************************************************************
******************************************* 查询KYC连接情况 *******************************************
*************************************************************************************************************
**************************************************************************************************************/
// const assembleInfo:any = ref({});// 撮合详情
const kycConnetQuery = ref({
  asc: false,
  pageNo: 1,
  pageSize: 3,
  id: props.assembleRecord.id,
  kycLinkStatusChangeSource: props.assembleRecord?.sourceType == 0 ? 2 :1, //1买家 2卖家
  matchPoolCreateTime: props.assembleInfo?.matchPoolCreateTime,
});
const kycLinkQuery  = ref({
  asc: false,
  pageNo: 1,
  pageSize: 3,
  changeSource: 2, //1买家 2卖家
  bankCode: props.assembleInfo.sellerKycInfo.bankCode,
  phoneNumber: props.assembleInfo.sellerKycInfo.phoneNumber,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const isQuiclyOrder = ref(false);
const kycLinkStatusChangeSource = ref(props.assembleRecord.sourceType == 0 ? 2 :1); //1买家 2卖家
if(props.assembleRecord.sourceType == 0){
    isQuiclyOrder.value = false;
  }else{
    isQuiclyOrder.value = true;
  }

  const kycConnetColumns:any = [
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

// const getAssembleData = async () => {
//   const res = await getMatchListResult({id:props.assembleRecord.id});
//   if(res && res.data){
//     assembleInfo.value = res.data;
//   }
// };

const {
  dataSource: kycConnetData,
  // extendData,
  pagination: kycConnetPagination,
  loading: kycConnetLoading,
  // response,
  handleTableChange : kycConnetHandleTableChange,
  getList: getKycConnetDataData,
  // resetQuery,
} = useTableData({
  query:props.assembleRecord.kycId ? kycLinkQuery : kycConnetQuery,
  handleQueryFields: (q) => {
    if (!props.assembleRecord.kycId) {
      q.matchPoolCreateTime = props.assembleInfo.matchPoolCreateTime;
      q.kycLinkStatusChangeSource = kycLinkStatusChangeSource.value;
    }
    return q;
  } ,
  api: props.assembleRecord.kycId ? kycLinkStatusLogAdminListPage :matchingOrderAdminKycLinkLog,
  fetchType: props.assembleRecord.kycId ? 1 : 2,
  defaultPageSize: 3,
  filterRules: [],
  notShowChangeSize: true,
});
// 切换买家卖家
const changeGet = (type: number) => {
  kycLinkStatusChangeSource.value = type;
  kycLinkQuery.value.changeSource = type;
  kycLinkQuery.value.bankCode =
    type == 2
      ? props.assembleInfo.sellerKycInfo?.bankCode || '000'
      : props.assembleInfo.buyerKycInfo?.bankCode || '000';

  kycLinkQuery.value.phoneNumber =
    type == 2
      ? props.assembleInfo.sellerKycInfo?.phoneNumber || '000'
      : props.assembleInfo.buyerKycInfo?.mobileNumber || '000';
  getKycConnetDataData(1);
};
onMounted(async () => {
  // await getMemberKycInfo();
  // await getAssembleData();
  if(props.assembleInfo.matchPoolCreateTime && isFirstMount.value && !props.assembleRecord.kycId){
   await getKycConnetDataData();
  }else if(props.assembleRecord.kycId){
    kycLinkQuery.value.bankCode = props.assembleInfo.sellerKycInfo?.bankCode || '000';
    kycLinkQuery.value.phoneNumber = props.assembleInfo.sellerKycInfo?.phoneNumber || '000';
   await getKycConnetDataData();
  }
  isFirstMount.value = false;
  setTimeout(() => {
    isFirstMount.value = true;
  }, 500);
});
</script>
<style scoped lang="less">

.assembleInfoTableBtnBox{
  display: flex;
  padding-bottom: 3px;
  button{
    margin-right: 10px;
    // &:last-child{
    //   margin-right: 0;
    //   margin-left: auto;
    // }
  }
}
</style>