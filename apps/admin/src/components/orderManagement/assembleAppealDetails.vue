<template>
  <h2 class="assembleAppealTitle mb-10">{{ $t('b30') }}</h2>
  <a-empty  v-if="!usdtBOrderInfo?.orderSubmitAmount"></a-empty>
  <a-row v-if="usdtBOrderInfo?.orderSubmitAmount" :gutter="24">
    <a-col :span="12">
      <div class="Temp_C-box">
        <div class="item">
          <div class="lab">{{ $t("m203") }}：</div>
          <div class="data" style="color: red">{{ usdtBOrderInfo?.displayAppealType ? $t(displayAppealTypeMap[usdtBOrderInfo?.displayAppealType]) : "-" }}</div>
        </div>
        <div class="item">
          <div class="lab">TID</div>
          <div class="data">
            <span style="color: red">
              {{ props.assembleRecord?.platformOrder || "-" }}
            </span>
            <CopyOutlined v-if="props.assembleRecord?.platformOrder" class="copyId"  @click="$copyId(props.assembleRecord?.platformOrder)" />
          </div>
        </div>
        <div class="item">
          <div class="lab">{{ $t("n42") }}：</div>
          <div class="data">{{ usdtBOrderInfo?.orderSubmitAmount || "-" }}</div>
        </div>
        <div class="item">
          <div class="lab">{{ $t("n105") }}：</div>
          <div class="data" style="color: red">{{ usdtBOrderInfo?.orderActualAmount || "-" }}</div>
        </div>
        <div class="item">
          <div class="lab">{{ $t("n40") }}：</div>
          <div class="data" style="color: red">{{ props.assembleRecord?.paymentPlatformOrder || "-" }}</div>
        </div>
        <div class="item">
          <div class="lab">UTR：</div>
          <div class="data">
            <span style="color: red">
              {{ usdtBOrderInfo?.utr || "-" }}
            </span>
            <CopyOutlined v-if="usdtBOrderInfo?.utr" class="copyId"  @click="$copyId(usdtBOrderInfo?.utr)" />
          </div>
        </div>
        <div class="item">
          <div class="lab">{{ $t("n1232") }}：</div>
          <div class="data">
            <span style="color: red">
              {{ usdtBOrderInfo?.appealBankCode || "-" }}
            </span>
          </div>
        </div>
        <div class="item" v-if="props.assembleRecord?.sourceType != 2">
          <div class="lab">UPI ID</div>
          <div class="data">
            <span style="color: red">
              {{ assembleInfo?.sellerCollectInfo?.upiId || "-" }}
            </span>
            <CopyOutlined v-if="assembleInfo?.sellerCollectInfo?.upiId" class="copyId"  @click="$copyId(assembleInfo?.sellerCollectInfo?.upiId)" />
          </div>
        </div>
        <!-- assembleInfo -->
        <div class="item" v-if="[2].includes(props.assembleRecord?.sourceType)">
          <div class="lab">{{ $t('m652') }}</div>
          <div class="data">
            <span style="color: red">
              {{ assembleInfo?.sellerCollectInfo?.bankCardNumber || "-" }}
            </span>
          </div>
        </div>
        <div class="item" v-if="[2].includes(props.assembleRecord?.sourceType)">
          <div class="lab">{{ $t('n621') }}</div>
          <div class="data">
            <span style="color: red">
              {{ assembleInfo?.sellerCollectInfo?.bankCardOwner || "-" }}
            </span>
          </div>
        </div>
        <div class="item" v-if="[2].includes(props.assembleRecord?.sourceType)">
          <div class="lab">{{ $t('m581') }}</div>
          <div class="data">
            <span style="color: red">
              {{ assembleInfo?.sellerCollectInfo?.bankName || "-" }}
            </span>
          </div>
        </div>
        <div class="item" v-if="[2].includes(props.assembleRecord?.sourceType)">
          <div class="lab">IFSC CODE</div>
          <div class="data">
            <span style="color: red">
              {{ assembleInfo?.sellerCollectInfo?.ifscCode || "-" }}
            </span>
          </div>
        </div>
        <div class="item" v-if="props.pageType == 1">
          <div class="lab">{{ $t("n1438") }}：</div>
          <div class="data">{{ props.appealRecord?.handlerUserName || "-" }}</div>
        </div>
      </div>
    </a-col>
    <a-col :span="12">
      <a-button :type="isBuyer ? 'primary': 'default'" @click="isBuyer = !isBuyer">{{ $t("n1233") }}</a-button>
      <a-button :type="!isBuyer ? 'primary': 'default'" @click="isBuyer = !isBuyer" style="margin-left: 10px;">{{ $t("n1234") }}</a-button>
      <!-- 已支付->申诉成功  -->
      <a-button
        type="primary"
        class="ml-10"
        :loading="loading"
        v-if="isPaidAndUnPaid && ['6'].includes(props.assembleRecord.status)"
        @click="showAppealPay(props.assembleRecord)"
        v-permission="'admin:matchingOrderAdmin:pay'"
      >{{ $t('s16') }}</a-button>
      <!-- 未支付->申诉失败 -->
      <a-button
        type="primary"
        danger
        class="ml-10"
        :loading="loading"
        v-if="isPaidAndUnPaid && ['1','2','5','6','11'].includes(props.assembleRecord.status)"
        @click="showNoPay(props.assembleRecord)"
        v-permission="'admin:matchingOrderAdmin:nopay'"
      >{{ $t("s17") }}</a-button>
      <!-- 成功->申诉成功 -->
      <a-button
        type="primary"
        class="ml-10"
        :loading="loading"
        @click="showSucceed(props.assembleRecord)"
        v-if="isSusseedAndFailed && (props.assembleRecord.status == 12 && props.assembleRecord.appealStatus == 1  && [0,1].includes(props.assembleRecord.replenishmentFlag))"
        v-permission="'admin:matchingOrderAdmin:autoFailOrderAppealSuccess'"
      >{{ $t("s16") }}</a-button>
      <!-- 失败->申诉失败  -->
      <a-button
        type="primary"
        danger
        class="ml-10"
        :loading="loading"
        v-if="isSusseedAndFailed && (props.assembleRecord.status == 12 && props.assembleRecord.appealStatus == 1  && [0,1].includes(props.assembleRecord.replenishmentFlag))"
        v-permission="'admin:matchingOrderAdmin:autoFailOrderAppealFail'"
        @click="showFailed(props.assembleRecord)"
      >{{ $t("s17") }}</a-button>

      <div class="pictures_container" v-if="isBuyer">
        <div class="appealInfo">
          <b class="title">{{ $t("m723") }}：</b>
          <span class="reason">{{ usdtBOrderInfo?.reason || "-" }}</span>
        </div>
        <div class="appealData">
          <div class="appealData_box1">
            <div class="title">{{ $t("m724") }}：</div>
            <div class="pic">
              <a-image v-if="usdtBOrderInfo?.picInfo" style="padding: 2px;" v-for="(item, index) in usdtBOrderInfo?.picInfo.split(',')" :key="index" :width="80" :height="80" :src="item" />
              <img v-else :src="no_up" alt="" style="width: 80px;height: 80px;">
            </div>
          </div>
          <div class="appealData_box2">
            <div class="title">{{ $t("m725") }}：</div>
            <div class="pic">
              <div class="playVideo" v-if="usdtBOrderInfo?.videoUrl" @click="openVideo(usdtBOrderInfo.videoUrl)">
                <PlayCircleOutlined class="playIcon" />
              </div>
              <video v-if="usdtBOrderInfo?.videoUrl" controls width="160" height="80" :src="usdtBOrderInfo.videoUrl"></video>
              <img v-else :src="no_up" alt="" style="width: 80px;height: 80px;">
            </div>
          </div>
        </div>
      </div>
      <div class="pictures_container" v-if="!isBuyer">
        <div class="appealInfo">
          <b class="title">{{ $t("m726") }}：</b>
          <span class="reason">{{ usdtBOrderInfo?.sellerReason || "-" }}</span>
        </div>
        <div class="appealData">
          <div class="appealData_box1">
            <div class="title">{{ $t("m724") }}：</div>
            <div class="pic">
              <a-image v-if="usdtBOrderInfo?.sellerPics" style="margin: 2px;" v-for="(item, index) in usdtBOrderInfo?.sellerPics.split(',')" :key="index" :width="80" :height="80" :src="item" />
              <img v-else :src="no_up" alt="" style="width: 80px;height: 80px;">
            </div>
          </div>
          <div class="appealData_box2">
            <div class="title">{{ $t("m725") }}：</div>
            <div class="pic">
              <div class="playVideo" v-if="usdtBOrderInfo?.sellerVideo"  @click="openVideo(usdtBOrderInfo.sellerVideo)">
                <PlayCircleOutlined class="playIcon"  />
              </div>
              <video v-if="usdtBOrderInfo?.sellerVideo" controls width="160" height="80" :src="usdtBOrderInfo.sellerVideo"></video>
              <img v-else :src="no_up" alt="" style="width: 80px;height: 80px;">
            </div>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>

  <!-- 已支付 -->
   
  <a-modal v-model:open="addDialog" :title="$t('s16')" :footer="null">
    <a-divider />
    <div v-if='orderSourceType == 0'>
      <p>{{ $t("n46") }}</p>
      <a-input-number
        v-model:value="getId.orderActualAmount"
        :min="0"
        :precision="2"
        class="searchstyle"
        :placeholder="$t('p33')"
      />
      <p v-if="!getId.orderActualAmount" style="color: rgb(255, 0, 0)">
        {{ $t("p33") }}
      </p>
      <p
        v-else-if="getId.orderActualAmount > orderAmount"
        style="color: rgb(255, 0, 0)"
      >
        {{ $t("e12") }}
      </p>
    </div>
    <br />
    <div>
      <p>{{ $t("m826") }}</p>
      <a-input v-trim
        v-model:value="getId.utr"
        class="searchstyle"
        maxLength="12"
        :placeholder="$t('m562')+ $t('m826')"
      />
      <p v-if="!getId.utr" style="color: rgb(255, 0, 0)">
        {{ $t('m562')+ $t('m826') }}
      </p>
    </div>
    <br />
    <div>
      <p>{{ $t("m827") }}</p>
        <Upload v-if="addDialog" v-model:value="getId.voucher"  @startUpload="startUpload"  @finishUpload="finishUpload"/>
    </div>
    <br />
    <div>
      <p>{{ $t("remark") }}</p>
      <a-textarea
        v-model:value="getId.remark"
        :placeholder="$t('remarks')"
        :rows="4"
      />
    </div>
    <br />
    <div>
      <p>{{ $t("n1456") }}</p>
      <a-textarea
        v-model:value="getId.internalRemark"
        :placeholder="$t('m562') + $t('n1455')"
        :rows="4"
      />
    </div>
    <div class="paidTip">
      <div>{{ $t("m828") }}：</div>
      <div>1 {{ $t("m829") }}</div>
      <div>2 {{ $t("n1440") }}</div>
      <div>3 {{ $t("m831") }}</div>
    </div>
    <br />
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button
        type="primary"
        :loading="loading"
        :disabled="(!getId.orderActualAmount && orderSourceType == 0) || !getId.utr"
        @click="appealPay(getId.id)"
        >{{ $t("b28") }}</a-button
      >
      <a-button style="margin-left: 10px" @click="closedalog">{{
        $t("b10")
      }}</a-button>
    </div>
  </a-modal>
  <!-- 未支付 -->
   
  <a-modal v-model:open="unpaid" :title="$t('s17')" :footer="null">
    <a-divider />
    <div>
      <p>{{ $t("remark") }}</p>
      <a-textarea
        v-model:value="getId.remark"
        :placeholder="$t('remarks')"
        :rows="4"
      />
    </div>
    <br />
    <div>
      <p>{{ $t("n1456") }}</p>
      <a-textarea
        v-model:value="getId.internalRemark"
        :placeholder="$t('m562') + $t('n1455')"
        :rows="4"
      />
    </div>
    <br />
    <div>
      <p>{{ $t("t25") }}</p>
      <p>{{ $t("t26") }}</p>
      <p>{{ $t("n1441") }}</p>
    </div>
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button type="primary" :loading="loading" @click="matchListUnPaid(getId.id)">{{
        $t("b28")
      }}</a-button>
      <a-button style="margin-left: 10px" @click="closedalog">{{
        $t("b10")
      }}</a-button>
    </div>
  </a-modal>
  <!-- 成功 -->
  <a-modal v-model:open="succeedDialog"
    :title="$t('s16')"
    :footer="null"
    @cancel="succeedCancel"
    >
    <a-divider />
    <div>
      <p>{{ $t("m826") }}</p>
      <a-input
        v-model:value="succeedForm.utr"
        class="searchstyle"
        :placeholder="$t('m826')"
      />
    </div>
    <div>
      <p>{{ $t("remark") }}</p>
      <a-textarea
        v-model:value="succeedForm.remark"
        :placeholder="$t('remarks')"
        :rows="4"
      />
      <p>{{ $t("n1456") }}</p>
      <a-textarea
        v-model:value="succeedForm.internalRemark"
        :placeholder="$t('m562') + $t('n1455')"
        :rows="4"
      />
      <p class="redText"> {{ $t("m828") }}: </p>
      <p class="redText">1 {{ $t("n1442") }}</p>
      <p class="redText">2 {{ $t("n430") }}</p>
    </div>
    <br />
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button type="primary" :loading="loading" :disabled="!succeedForm.utr" @click="succeedOrder()">{{
        $t("b28")
      }}</a-button>
      <a-button style="margin-left: 10px" @click="succeedCancel">{{
        $t("b10")
      }}</a-button>
    </div>
  </a-modal>
  <!-- 失败 -->
  <a-modal v-model:open="failedDialog" :title="$t('s17')" :footer="null" @cancel="failedCancel">
    <a-divider />
    <div>
      <p>{{ $t("remark") }}</p>
      <a-textarea
        v-model:value="failedForm.remark"
        :placeholder="$t('remarks')"
        :rows="4"
      />
      <p>{{ $t("n1456") }}</p>
      <a-textarea
        v-model:value="failedForm.internalRemark"
        :placeholder="$t('m562') + $t('n1455')"
        :rows="4"
      />
      <p>
        {{ $t("n1443") }}
      </p>
      <p>{{ $t("n1444") }}</p>
    </div>
    <br />
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button type="primary" :loading="loading" @click="failedOrder()">{{
        $t("b28")
      }}</a-button>
      <a-button style="margin-left: 10px" @click="failedCancel">{{
        $t("b10")
      }}</a-button>
    </div>
  </a-modal>
  <!-- 查询KYC连接情况 -->

  <div class="mb-10">
    <div>
      <h2 class="assembleAppealTitle mb-10">{{ $t("n1231") }}</h2>
      <a-row :gutter="4" class="mb-10" style="align-items: center;">
        <a-col :span="24">
          <div class="Temp_C-box4">
            <div class="item">
              <div class="lab">{{ $t('n272') }}</div>
              <div class="data">
                <a-button type="link" v-if="assembleInfo?.sellerKycInfo?.memberId" @click="showDetail(assembleInfo,assembleInfo?.sellerKycInfo.memberId)">
                  {{  assembleInfo?.sellerKycInfo?.memberId }}
                </a-button>
                <span v-else>-</span>
                <CopyOutlined v-if="assembleInfo?.sellerKycInfo?.memberId" class="copyId"  @click="$copyId(assembleInfo?.sellerKycInfo?.memberId)" />
              </div>
            </div>
            <div class="item">
              <div class="lab">{{ $t("n1207") }}</div>
              <div class="data">{{ assembleInfo.merchantCode || '-' }}</div>
            </div>
            <div class="item">
              <div class="lab">{{ $t("l48") }}</div>
              <div class="data">{{ assembleInfo.updateBy || '-' }}</div>
            </div>
            <div class="item">
              <div class="lab">{{ $t("remark") }}</div>
              <div class="data">
                <a-tooltip v-if="assembleInfo.remark">
                  <template #title>
                    {{ assembleInfo.remark || '-' }}
                  </template>
                  <div class="toopTipStyle">
                    {{ assembleInfo.remark || '-' }}
                  </div>
                </a-tooltip>
                <span v-else>-</span>
              </div>
            </div>
            <div class="item">
              <div class="lab">{{ $t("c11") }}</div>
              <div class="data">{{ assembleInfo.createTime || '-' }}</div>
            </div>
            <div class="item">
              <div class="lab">{{ $t("l38") }}</div>
              <div class="data">{{ assembleInfo.paymentTime || '-' }}</div>
            </div>
            <div class="item">
              <div class="lab">{{ $t("n44") }}</div>
              <div class="data">{{ usdtBOrderInfo?.appealCreateTime || '-' }}</div>
            </div>
            <div class="item">
              <div class="lab">{{ $t("m734") }}</div>
              <div class="data">{{ assembleInfo.completionTime || '-' }}</div>
            </div>
            <div class="item">
              <div class="lab">{{ $t('n1452') }}</div>
              <div class="data">{{ assembleInfo?.sellerKycInfo?.lastLinkTime || '-' }}</div>
            </div>
            <div class="item">
              <div class="lab">{{ $t('m980') }}</div>
              <div class="data">{{ assembleInfo?.sellerKycInfo?.lastUnLinkTime || '-' }}</div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <!-- 正常查询KYC连接情况 -->
      <assembleKycLinkLog 
        :assembleRecord="props.assembleRecord"
        :assembleInfo="assembleInfo"
        v-if="assembleInfo && Object.keys(assembleInfo).length>0"
      />
  </div>

  <!-- 卖出流水信息/快捷提现流水信息 -->
   <div class="mb-10">
    <div class="mb-10">
      <h2 class="assembleAppealTitle" v-if="props.assembleRecord.sourceType == 1">
        {{ $t("n1245") }}
      </h2>
      <h2 class="assembleAppealTitle" v-else-if="props.assembleRecord.sourceType == 2">
        {{ $t("n1246") }}
      </h2>
      <h2 class="assembleAppealTitle" v-else>
        {{ $t("n1223") }}
      </h2>
      <span v-if="[1,2].includes(props.assembleRecord.sourceType)">
        <span class="ml-10">
          {{ t('n295') + ': ' }}<b>{{ props.assembleRecord.collectionMemberId || '-'  }}</b>
        </span>
        <span class="ml-10">
          {{ t('n1236') + ': ' }}<b>{{ assembleInfo?.buyerKycInfo?.phoneNumber || '-'  }}</b>
        </span>
        <!-- <span class="ml-10" v-if="props.assembleRecord.sourceType == 2">
          {{ t('m581') + ': ' }}<b>{{ bankInfo.bankName }}</b>
        </span>
        <span class="ml-10" v-if="props.assembleRecord.sourceType == 2">
          {{ 'IFSCCODE' + ': ' }}<b>{{ bankInfo.ifscCode }}</b>
        </span>
        <span class="ml-10" v-if="props.assembleRecord.sourceType == 2">
          {{ t('n621') + ': ' }}<b>{{ bankInfo.bankCardOwner }}</b>
        </span>
        <span class="ml-10" v-if="props.assembleRecord.sourceType == 2">
          {{ t('m652') + ': ' }}<b>{{ bankInfo.bankCardNumber }}</b>
        </span> -->
        <span class="ml-10">
          {{ t('n1237') + ': ' }}<b>{{ buyerUpiId || $t('n1248')  }}</b>
        </span>
      </span>
      <span class="ml-10 mr-10" v-else>{{ t('n1224') + ': '  }}<b>{{ props.assembleRecord.upiId }}</b></span>
      <span class="arbListTag" style="padding:2px 3px;">
        <span class="pointTag" :class="assembleInfo.sellerKycInfo?.linkStatus == 1 ? 'pointTag-green' : 'pointTag-red'" ></span>
          {{ assembleInfo.sellerKycInfo?.linkStatus == 1 ? t('m595') : assembleInfo.sellerKycInfo?.linkStatus == 0 ? t('m594') : t('n1239') }}
      </span>
      <a-button size="small" type="primary" class="ml-10" :loading="sellLoading"
       @click="getSellRecordData"
       >{{ t('m153') }}</a-button>
      <tipTemplate :info="$t('n1225')"/>
      <span class="ml-10" v-if="sellRecordData.length == 0" style="color: red">{{ t('n1226') }}</span>
      <div class="search">
        <a-row :gutter="4" class="mb-10" style="align-items: center;">
          <a-col :span="3" v-if="[2].includes(props.assembleRecord.sourceType)">
            <a-input v-trim v-model:value="sellQuery.ifscCode" allowClear :placeholder="'IFSC CODE'"  />
          </a-col>
          <a-col :span="3" v-if="[2].includes(props.assembleRecord.sourceType)">
            <a-input v-trim v-model:value="sellQuery.recipient" allowClear :placeholder="$t('m652')"  />
          </a-col>
          <a-col :span="3" v-else>
            <a-input v-trim v-model:value="sellQuery.recipient" allowClear :placeholder="$t('m691')"  />
          </a-col>
          <a-col :span="3">
            <a-input v-trim v-model:value="sellQuery.utr" allowClear :placeholder="'UTR'"  />
          </a-col>
          <a-col :span="3">
            <a-select
              class="searchstyle"
              allowClear
              :placeholder="$t('m563')+$t('m695')"
              v-model:value="sellQuery.isMatch"
              :options="Object.entries(isMatchMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
            >
            </a-select>
          </a-col>
          <a-col >
            <timeRange v-model:startTime="sellQuery.startTime" v-model:endTime="sellQuery.endTime"  
            :title="$t('m694')" :type="1"/>
          </a-col>
          <a-col>
            <a-button type="primary" @click="getSellRecordData" >{{ $t("search") }}</a-button>
            <span class="ml-10" v-if="!selectHasData" style="color: red">{{ t('n1240') }}</span>
          </a-col>
        </a-row>
      </div>
    </div>
    <a-table
      :columns="props.assembleRecord.sourceType == 2 ? sellColmunsBank :sellColmuns "
      :dataSource="sellRecordData"
      :pagination="sellPagination"
      :row-key="(record: any) => JSON.stringify(record)"
      :scroll="{ x: '100%' }"
      bordered
      :loading="sellLoading"
      @change="sellHandleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'bankCode'">
          {{ record.bankCode || '-' }}
        </template>
        <template v-if="column.key === 'tId'">
          <a-tooltip v-if="record.tId">
            <template #title v-if="!record.isDefaultTId">
              {{ record.tId }}
              <CopyOutlined v-if="record.tId && !record.isDefaultTId" class="copyId"  @click="$copyId(record.tId)" />
            </template>
            <div class="toopTipStyle2" :class="record.isDefaultTId?'defaultTId':''">
              {{ record.tId }}
              <CopyOutlined v-if="record.tId && !record.isDefaultTId" class="copyId"  @click="$copyId(record.tId)" />
            </div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'amount'">
          {{ currency(record.amount,false) }}
        </template>
        <template v-if="column.key === 'recipient'">
          <a-tooltip v-if="record.recipient">
            <template #title>{{ record.recipient }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.recipient }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'payer'">
          <a-tooltip v-if="record.payer">
            <template #title>{{ record.payer }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.payer }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'ifscCode'">
          <a-tooltip v-if="record.ifscCode">
            <template #title>{{ record.ifscCode }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.ifscCode }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'cardOwnerName'">
          <a-tooltip v-if="record.cardOwnerName">
            <template #title>{{ record.cardOwnerName }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.cardOwnerName }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'bankCardNumber'">
          <a-tooltip v-if="record.bankCardNumber">
            <template #title>{{ record.bankCardNumber }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankCardNumber }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'isMatch'">
          <span class="arbListTag" v-if="[0,1,2,3].includes(record.isMatch)">
            <span class="pointTag" :style="[1,2].includes(record.isMatch) ? 'background-color:#52c41a' : 'background-color:#f5222d'" ></span>
            {{ $t(isMatchMap[record.isMatch]) || '-' }}
          </span>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'replenishmentFlag'">
          <span :class="record.replenishmentFlag == 1 ? 'tag-green' : ''">
            {{ record.replenishmentFlag == 1 ? $t('n313') : '-' }}
          </span>
        </template>
        <template v-if="column.key === 'utr'">
          <a-tooltip v-if="record.utr">
            <template #title>
              {{ record.utr }}
              <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
            </template>
            <div style="text-overflow: ellipsis;overflow: hidden;">
              {{ record.utr }}
              <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
            </div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
      <template v-if="column.key === 'misTypedUtr'">
        <span :class="record.misTypedUtr == 1 ? 'tag-red' : record.misTypedUtr == 0 ? 'tag-green' : ''">
          {{ record.misTypedUtr == 1 ? $t('yes') : record.misTypedUtr == 0 ? $t('no') : '-' }}
        </span>
      </template>
      <template v-if="column.key === 'misTypedUtrOrder'">
        <a-tooltip v-if="record.misTypedUtrOrder && record.misTypedUtrOrder.length">
          <template #title>
            <a-tag color="red" v-for="(item,index) in record.misTypedUtrOrder" 
              :key="index" style="margin-right:4px; margin-bottom:4px;">
              {{ item }}
              <CopyOutlined v-if="item" class="copyId"  @click="$copyId(item)" />
            </a-tag>
          </template>
          <div class="toopTipStyle2">
            <a-tag color="red" v-for="(item,index) in record.misTypedUtrOrder" 
              :key="index" style="margin-right:4px; margin-bottom:4px;">
              {{ item }}
              <CopyOutlined v-if="item" class="copyId"  @click="$copyId(item)" />
            </a-tag>
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
        <template v-if="column.key === 'operate'">
          <a-tag
            color="red"
            style="cursor: pointer;"
            size="small"
            v-if="record.isMatch == 0"
            @click="openManualMadal(record)"
            v-permission="'admin:matchingOrderAdmin:orderReplenishmentByWater4'"
            >{{ $t("m700") }}
          </a-tag>
        </template>
      </template>
    </a-table>
   </div>
    <!-- 补单 -->
    <a-modal
      v-model:open="manualModal"
      :title="$t('m700')"
      width="500px"
      @ok="manualKycOrder"
      @cancel="closeManualModal"
    >
      <a-form :model="manualForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item :label="$t('l34')" name="amount" required>
          <span>{{ manualForm.amount }}</span>
        </a-form-item>
        <a-form-item :label="manualOrderLabel" name="orderNo" required>
          <a-input v-trim v-model:value="manualForm.orderNo" />
          <div class="config-tipMsg">{{ $t("n1335") }}</div>
        </a-form-item>
      <a-form-item
        :label="$t('n1396')"
      >
        <a-radio-group v-model:value="manualFrom.delayFinish" :style="manualFrom.delayFinish == 1 ? 'padding-top:5px;' : ''">
          <a-radio :value="1">{{ $t("yes") }}</a-radio>
          <a-radio :value="0">{{ $t("no") }}</a-radio>
        </a-radio-group>
        <a-select
          v-if="manualFrom.delayFinish == 1"
          v-model:value="manualFrom.delayType"
          style="margin-top:10px;"
          :placeholder="$t('m563')+ $t('n1397')"
          :options="Object.entries(delayTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
          >
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('n1399')"
      >
        <a-radio-group v-model:value="manualFrom.disableBuy" :style="manualFrom.disableBuy == 1 ? 'padding-top:5px;' : ''">
          <a-radio :value="1">{{ $t("yes") }}</a-radio>
          <a-radio :value="0">{{ $t("no") }}</a-radio>
        </a-radio-group>
        <a-select
          v-if="manualFrom.disableBuy == 1"
          v-model:value="manualFrom.disableLimitType"
          style="margin-top:10px;"
          :placeholder="$t('m563')+ $t('n1398')"
          :options="Object.entries(disableLimitTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
          >
        </a-select>
      </a-form-item>
      </a-form>
    </a-modal>
  <!-- 申诉流水信息 -->
   <div class="mb-10">
    <div class="mb-10">
      <h2 class="assembleAppealTitle">
        {{ $t("n1227") }}
      </h2>
      <span class="ml-10">
        {{ t('n295') + ': ' }}<b>{{ props.assembleRecord.collectionMemberId }}</b>
      </span>
      <span class="ml-10 mr-10">{{ t('n1236') + ': '}}<b>{{ usdtBOrderInfo?.appealPhoneNo ? usdtBOrderInfo?.appealPhoneNo : '-' }}</b></span>
      <!-- <span class="ml-10 mr-10">{{ t('n1237') + ': '  }}<b>{{ assembleInfo?.buyerKycInfo?.upiId || $t('n1248') }}</b></span> -->
      <span class="arbListTag" style="padding:2px 3px;">
        <span class="pointTag" :class="usdtBOrderInfo?.appealKycStatus ==1 ? 'pointTag-green' : 'pointTag-red'" ></span>
          {{ usdtBOrderInfo?.appealKycStatus == '1' ? t('m595') : usdtBOrderInfo?.appealKycStatus == '2' ? t('m594') : t('n1239') }}
      </span>
      <a-button size="small" type="primary" class="ml-10" :loading="appealLoading" @click="getAppealDetailData">{{ t('m153') }}</a-button>
      <tipTemplate :info="$t('n1225')"/>
      <span class="ml-10" v-if="appealRecordData.length == 0" style="color: red">{{ t('n1241') }}</span>
      <div class="search">
        <a-row :gutter="4" class="mb-10" style="align-items: center;">
          <a-col :span="3" v-if="[2].includes(props.assembleRecord.sourceType)">
            <a-input v-trim v-model:value="appealQuery.ifscCode" allowClear :placeholder="'IFSC CODE'"  />
          </a-col>
          <a-col :span="3" v-if="[2].includes(props.assembleRecord.sourceType)">
            <a-input v-trim v-model:value="appealQuery.recipient" allowClear :placeholder="$t('m652')"  />
          </a-col>
          <a-col :span="3" v-else>
            <a-input v-trim v-model:value="appealQuery.recipient" allowClear :placeholder="$t('m691')"  />
          </a-col>
          <a-col :span="3">
            <a-input v-trim v-model:value="appealQuery.utr" allowClear :placeholder="'UTR'"  />
          </a-col>
          <a-col :span="3">
            <a-select
              class="searchstyle"
              allowClear
              :placeholder="$t('m563')+$t('m695')"
              v-model:value="appealQuery.isMatch"
              :options="Object.entries(isMatchMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
            >
            </a-select>
          </a-col>
          <a-col >
            <timeRange v-model:startTime="appealQuery.startTime" v-model:endTime="appealQuery.endTime"  
            :title="$t('m694')" :type="1"/>
          </a-col>
          <a-col>
            <a-button type="primary" @click="getAppealDetailData" >{{ $t("search") }}</a-button>
            <span class="ml-10" v-if="!selectHasData" style="color: red">{{ t('n1240') }}</span>
          </a-col>
        </a-row>
      </div>
    </div>
    <a-table
      :columns="props.assembleRecord.sourceType == 2 ? appealColmunsBank : appealColmuns"
      :dataSource="appealRecordData"
      :pagination="appealPagination"
      :row-key="(record: any) => JSON.stringify(record)"
      :scroll="{ x: '100%' }"
      bordered
      :loading="appealLoading"
      @change="appealHandleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'recipient'">
          <a-tooltip v-if="record.recipient">
            <template #title>{{ record.recipient }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.recipient }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'payer'">
          <a-tooltip v-if="record.payer">
            <template #title>{{ record.payer }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.payer }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'utr'">
          <a-tooltip v-if="record.utr">
            <template #title>
              {{ record.utr }}
              <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
            </template>
            <div style="text-overflow: ellipsis;overflow: hidden;">
              {{ record.utr }}
              <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
            </div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'misTypedUtr'">
          <span :class="record.misTypedUtr == 1 ? 'tag-red' : record.misTypedUtr == 0 ? 'tag-green' : ''">
            {{ record.misTypedUtr == 1 ? $t('yes') : record.misTypedUtr == 0 ? $t('no') : '-' }}
          </span>
        </template>
        <template v-if="column.key === 'misTypedUtrOrder'">
          <a-tooltip v-if="record.misTypedUtrOrder && record.misTypedUtrOrder.length">
            <template #title>
              <a-tag color="red" v-for="(item,index) in record.misTypedUtrOrder" 
                :key="index" style="margin-right:4px; margin-bottom:4px;">
                {{ item }}
                <CopyOutlined v-if="item" class="copyId"  @click="$copyId(item)" />
              </a-tag>
            </template>
            <div class="toopTipStyle2">
              <a-tag color="red" v-for="(item,index) in record.misTypedUtrOrder" 
                :key="index" style="margin-right:4px; margin-bottom:4px;">
                {{ item }}
                <CopyOutlined v-if="item" class="copyId"  @click="$copyId(item)" />
              </a-tag>
            </div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'tId'">
          <a-tooltip v-if="record.tId">
            <template #title v-if="!record.isDefaultTId">
              {{ record.tId }}
              <CopyOutlined v-if="record.tId && !record.isDefaultTId" class="copyId"  @click="$copyId(record.tId)" />
            </template>
            <div class="toopTipStyle2" :class="record.isDefaultTId?'defaultTId':''">
              {{ record.tId }}
              <CopyOutlined v-if="record.tId && !record.isDefaultTId" class="copyId"  @click="$copyId(record.tId)" />
            </div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'amount'">
          {{ currency(record.amount,false) }}
        </template>
        <template v-if="column.key === 'buyerOrderId'">
          <a-tooltip v-if="record.buyerOrderId">
            <template #title>{{ record.buyerOrderId }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.buyerOrderId }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'sellerOrderId'">
          <a-tooltip v-if="record.sellerOrderId">
            <template #title>{{ record.sellerOrderId }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.sellerOrderId }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'ifscCode'">
          <a-tooltip v-if="record.ifscCode">
            <template #title>{{ record.ifscCode }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.ifscCode }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'cardOwnerName'">
          <a-tooltip v-if="record.cardOwnerName">
            <template #title>{{ record.cardOwnerName }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.cardOwnerName }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'bankCardNumber'">
          <a-tooltip v-if="record.bankCardNumber">
            <template #title>{{ record.bankCardNumber }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankCardNumber }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'isMatch'">
          <span class="arbListTag" v-if="[0,1,2,3].includes(record.isMatch)">
            <span class="pointTag" :class="[1,2].includes(record.isMatch) ? 'pointTag-green' : 'pointTag-red'" ></span>
            {{ $t(isMatchMap[record.isMatch]) }}
          </span>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'replenishmentFlag'">
          <span :class="record.replenishmentFlag == 1 ? 'tag-green' : ''">
            {{ record.replenishmentFlag == 1 ? $t('n313') : '-' }}
          </span>
        </template>
        <template v-if="column.key === 'operate'">
          <a-tag
            color="red"
            style="cursor: pointer;"
            size="small"
            v-if="record.isMatch == 0"
            @click="openManualMadal(record,2)"
            v-permission="'admin:matchingOrderAdmin:orderReplenishmentByWater4'"
            >{{ $t("m700") }}
          </a-tag>
        </template>
      </template>
    </a-table>
   </div>
  <!-- 查询UPI ID是否存在于系统 -->
   <div class="mb-10">
    <div>
      <h2 class="assembleAppealTitle">{{ $t("n1228") }}</h2>
      <div class="search">
        <a-row :gutter="4" class="mb-10" style="align-items: center;">
            <a-col :span="3">
              <a-input v-trim v-model:value="selectUpi.upiId" allowClear :placeholder="$t('m562') +'UPI ID'"  />
            </a-col>
          <a-col>
            <a-button type="primary" @click="getSelectUpiData" >{{ $t("search") }}</a-button>
            <span class="ml-10" v-if="!selectHasData" style="color: red">{{ t('n1240') }}</span>
          </a-col>
        </a-row>
      </div>
    </div>

    <a-table
      size="middle"
      :loading="selectUpiLoading"
      :dataSource="selectUpiData"
      :columns="selectUpicolumns"
      :scroll="{ x: '100%' }"
      :pagination="selectUpiPagination"
      bordered
      @change="selectUpiHandleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'memberId'">
          <a-button
            style="padding: 0px"
            type="link"
            @click="showDetail(record)"
            >{{ record.memberId }}</a-button
          >
          <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
        </template>
        <template v-if="column.key === 'collectedStatus'">
            <span :style="record.collectedStatus == '1' ? 'color:green' : 'color:red'">
              {{ record.collectedStatus == "1" ? $t('enabled') : $t('disabled') }}
            </span>
        </template>
        <template v-if="column.key === 'upiId'">
          <a-tooltip>
            <template #title>{{ record.type == 3 ? record.upiId : record.bankCardNumber }}</template>
            <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.type == 3 ? record.upiId : record.bankCardNumber }}</div>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'mobileNumber'">
          {{ record.mobileNumber || '-' }}
        </template>
        <template v-if="column.key === 'createTime'">
          {{ record.createTime || '-' }}
        </template>
      </template>
    </a-table>
  </div>

    <!-- 通过KYC会员信息查询连接情况 -->
    <div class="mb-10">
      <div class="kycManagerConnectLogTable">
        <div class="search">
          <h2>{{ $t("n730") }}</h2>
          <a-row>
            <a-col :span="3">
              <a-input
                v-model:value="kycManagerInfoQuery.upiId"
                :placeholder="'UPI ID'"
                allowClear
                size="small"
                class="mr-10"
              />
            </a-col>
            <a-col>
              <a-button type="primary" size="small" :loading="kycManagerConnetLoading" @click="getKycManagerInfo()">{{
                $t("search")
              }}</a-button>
            </a-col>
          </a-row>
        </div>
        <a-table
          :dataSource="kycManagerConnetLinkData"
          :columns="kycManagerConnetColumns"
          :pagination="kycManagerConnetPagination"
          :scroll="{ x: '100%', y: '44vh'}"
          :loading="kycManagerConnetLoading"
          size="small"
          @change="kycManagerConnetHandleTableChange"
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
  <!-- 查询用户是否申诉错订单 -->
  <div class="mb-10">
    <div>
      <h2 class="assembleAppealTitle mb-10">{{ $t("n1229") }}</h2>
      <a-row :gutter="4" class="mb-10" style="align-items: center;">
        <a-col :span="12">
          <div class="Temp_C-box">
            <div class="item">
              <div class="lab">{{ $t("m149") }}</div>
              <div class="data">
                {{ props.assembleRecord.collectionMemberId || '-' }}
                <CopyOutlined v-if="props.assembleRecord.collectionMemberId" class="copyId"  @click="$copyId(props.assembleRecord.collectionMemberId)" />
              </div>
            </div>
            <div class="item">
              <div class="lab">{{ $t("n1230") }}</div>
              <div class="data">{{ $t($getMapItem(buyOrderTypeMap,props.assembleRecord.buyOrderType) || '-')}}</div>
            </div>
            <div class="item">
              <div class="lab">TID</div>
              <div class="data">
                {{ props.assembleRecord.platformOrder || '-' }}
                <CopyOutlined v-if="props.assembleRecord.platformOrder" class="copyId"  @click="$copyId(props.assembleRecord.platformOrder)" />
              </div>
            </div>
            <div class="item">
              <div class="lab">{{ $t("n657") }}</div>
              <div class="data">{{ $t($getMapItem(orderSourceMap,props.assembleRecord.sourceType) || '-') }}</div>
            </div>
          </div>
        </a-col>
      </a-row>

      <div class="search">
        <a-row :gutter="4" class="mb-10" style="align-items: center;">
          <a-col :span="3">
            <a-input v-trim v-model:value="appealErrQuery.platformOrder" allowClear :placeholder="$t('m562') +$t('m807')"  />
          </a-col>
          <a-col :span="3">
            <a-input v-trim v-model:value="appealErrQuery.upiId" allowClear :placeholder="$t('m562') +'UPI ID'"  />
          </a-col>
          <a-col :span="3">
            <a-input v-trim v-model:value="appealErrQuery.collectionMemberId" allowClear :placeholder="$t('m562') +$t('m149')"  />
          </a-col>
          <a-col >
            <timeRange v-model:startTime="appealErrQuery.createTimeStart" v-model:endTime="appealErrQuery.createTimeEnd"  :title="$t('c11')" :type="1"/>
          </a-col>
          <a-col>
            <a-button type="primary" @click="getAppealErrData" >{{ $t("search") }}</a-button>
            <span class="ml-10" v-if="!appealErrHasData" 
             style="color: red">{{ t('n1240') }}</span>
          </a-col>
        </a-row>
      </div>
    </div>

    <a-table
      size="middle"
      :loading="appealErrLoading"
      :dataSource="appealErrData"
      :columns="appealErrColumns"
      :scroll="{ x: '100%' }"
      :pagination="appealErrPagination"
      bordered
      @change="appealErrHandleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'platformOrder'">
          {{ record.platformOrder || '-' }}
          <CopyOutlined v-if="record.platformOrder" class="copyId"  @click="$copyId(record.platformOrder)" /> 
        </template>
        <template v-if="column.key === 'collectionMemberId'">
          <a-button
            style="padding: 0px"
            type="link"
            @click="showDetail(record,record.collectionMemberId)"
            >{{ record.collectionMemberId }}</a-button
          >
          <CopyOutlined v-if="record.collectionMemberId" class="copyId"  @click="$copyId(record.collectionMemberId)" />
        </template>
        <template v-if="column.key === 'paymentMemberId'">
          <a-button
            style="padding: 0px"
            type="link"
            @click="showDetail(record,record.paymentMemberId)"
            >{{ record.paymentMemberId }}</a-button
          >
          <CopyOutlined v-if="record.paymentMemberId" class="copyId"  @click="$copyId(record.paymentMemberId)" />
        </template>
        <template v-if="column.key === 'orderActualAmount'">
          {{ currency(record.orderActualAmount,false) }} 
        </template>
        <template v-if="column.key === 'orderSubmitAmount'">
          {{ currency(record.orderSubmitAmount,false) }} 
        </template>
        <template v-if="column.key === 'upiId'">
          <a-tooltip>
            <template #title>
              {{ record.upiId || '-' }}
              <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />  
            </template>
            <div style="text-overflow: ellipsis;overflow: hidden;">
              {{ record.upiId || '-' }}
              <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />  
            </div>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag v-if="[3,4,5,6,7,8,12,13,14,15,16,17].includes(Number(record.status))" :color="[7,15].includes(Number(record.status)) ? 'green':'red'">{{ [1,2,11].includes(Number(record.status)) ? $t('n88'):$t(matchlistStatus[Number(record.status)]) }}</a-tag>
          <div v-else>-</div>
        </template>
        <template v-if="column.key === 'appealStatus'">
          {{  record.appealStatus ? $t(appealTypeMap[Number(record.appealStatus)]) : '-' }}
        </template>
        <template v-if="column.key === 'utr'">
          {{ record.utr || '-' }}
        </template>
        <template v-if="column.key === 'createTime'">
          {{ record.createTime || '-' }}
        </template>
        <template v-if="column.key === 'paymentTime'">
          {{ record.paymentTime || '-' }}
        </template>
        <template v-if="column.key === 'completionTime'">
          {{ record.completionTime || '-' }}
        </template>
        <template v-if="column.key === 'operate'">
          <!-- 补单 -->
          <a-tag
            color="red"
            style="cursor: pointer;margin-bottom: 2px;"
            v-if="
            (['8','9','10','12','13'].includes(record.status) || ['3'].includes(record.status) && [0,3].includes(record.sourceType))
            && !(record.status == 12 && record.appealStatus == 1 && record.autoFinishFlag == 1 && [0,1].includes(record.replenishmentFlag))
            && [0,1].includes(record.replenishmentFlag)
            && record.isQuadOrder != 1 ||
            record.repackageAppBuyFlag == 2 && record.status == '12' && record.replenishmentFlag == 0"
            @click="manualOrder(record)"
            v-permission="'admin:matchingOrderAdmin:orderReplenishment'"
            >{{ $t("m700") }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </div>




  <!-- 弹窗 -->
  <a-modal
    v-model:open="videoMod"
    :footer="null"
    :centered="true"
    :title="$t('m725')"
    width="800"
    @cancel="handleCancel"
  >
    <video
      controls
      autoplay
      width="600"
      height="600"
      :src="videoUrl"
      style="margin: auto;"
    ></video>
  </a-modal>
  <!-- 会员详情 -->
  <a-modal
    v-model:open="detailModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
    >
    <MemberDetail 
    v-if="detailModel"
      :memberID="detailId.memberId"
      :id="detailId.memberId"
    />
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
  <!-- 补单 -->
  <a-modal
    v-model:open="manualOpen"
    :title="$t('m700')"
    width="700px"
    :footer="null"
    @cancel="closeManual"
  >
    <a-form
      :form="manualFrom"
      :name="manualFrom"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-item
        :label="$t('l34')"
        :required="true"
      >
        <a-input-number
          v-trim
          v-model:value="manualFrom.amount"
          :min="100"
          :max="mamOrderSubmitAmount"
          class="searchstyle"
          :placeholder="$t('m562')+ $t('l34')"
        />
        <div class="modal-tipMsg">{{ $t("n512") }}</div>
      </a-form-item>
      <a-form-item
        label="UTR"
        :required="true"
      >
        <a-input
          v-trim
          v-model:value="manualFrom.utr"
          :maxlength="12"
          :placeholder="$t('m562')+ ' UTR'"
        />
        <div class="modal-tipMsg">{{ $t("n187") }}</div>
      </a-form-item>
      <a-form-item
        :label="$t('n1396')"
      >
        <a-radio-group v-model:value="manualFrom.delayFinish" :style="manualFrom.delayFinish == 1 ? 'padding-top:5px;' : ''">
          <a-radio :value="1">{{ $t("yes") }}</a-radio>
          <a-radio :value="0">{{ $t("no") }}</a-radio>
        </a-radio-group>
        <a-select
          v-if="manualFrom.delayFinish == 1"
          v-model:value="manualFrom.delayType"
          style="margin-top:10px;"
          :placeholder="$t('m563')+ $t('n1397')"
          :options="Object.entries(delayTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
          >
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('n1399')"
      >
        <a-radio-group v-model:value="manualFrom.disableBuy" :style="manualFrom.disableBuy == 1 ? 'padding-top:5px;' : ''">
          <a-radio :value="1">{{ $t("yes") }}</a-radio>
          <a-radio :value="0">{{ $t("no") }}</a-radio>
        </a-radio-group>
        <a-select
          v-if="manualFrom.disableBuy == 1"
          v-model:value="manualFrom.disableLimitType"
          style="margin-top:10px;"
          :placeholder="$t('m563')+ $t('n1398')"
          :options="Object.entries(disableLimitTypeMap).map(([key, value]:[any,any]) => ({
            value: key,
            label: value,
          }))"
          >
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 9, span: 18 }">
        <a-button @click="closeManual">{{
          $t('b10')
        }}</a-button>
        <a-button
         style="margin-left: 10px"
          type="primary"
          :loading="manualOrderLoading"
          @click="manualOrderSubmit"
          >{{ $t('publicSubmit') }}</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 继续补单 -->
  <a-modal
    v-model:open="continueManualOpen"
    width="500px"
    :footer="null"
    @cancel="closeContinueManual"
  >
    <template #title>
      <div style="text-align: center; font-weight: bold;">{{ continueManualText }}</div>
    </template>
    <div style="text-align: center;">
      <a-button @click="closeContinueManual">{{ $t("b10") }}</a-button>
      <a-button type="primary" class="ml-10" @click="manualOrderSubmit">{{ $t("确定") }}</a-button>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
// import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import { PlayCircleOutlined } from "@ant-design/icons-vue";
import { 
  kycPartnerRecipientAdminListPage,
  kycPartnerBuyAppealPaymentAdminListPage,
  memberPaymentList,
  getMatchListData,
  matchingOrderAdminKycLinkLog,
  getMatchListResult,
  getBuyOrderListPage,
  getAppealDetails,
  kycPartnersAdminList,
  kycLinkStatusLogAdminListPage,
  matchOrderManualOrderReplenishment,
  matchingOrderAdminOrderReplenishmentByWater,
  matchListPay,
  matchListNoPay,
  matchOrderAutoFailOrderAppealSuccess,
  matchOrderAutoFailOrderAppealFail,
 } from "@/api";
import { useTableData } from "@/hooks/useTableData.hook";
import { orderSourceMap,buyOrderTypeMap,matchlistStatus,appealTypeMap,kycLinkStatusChangeTypeMap, kycLinkStatusChangeReasonMap,
  displayAppealTypeMap,delayTypeMap,disableLimitTypeMap } from "@/utils/publicData";
import { currency } from "@/utils";
import no_up from "@/assets/no_up.png";
import MemberDetail from "@/components/Member/memberDetail.vue";
import kycPullResultLog from "@/components/Kyc/kycPullResultLog.vue";
import assembleKycLinkLog from "./components/assembleKycLinkLog.vue";
import { onMounted, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { getStartAndEndOfDay,getIndiaLocalTime } from "@/plugins/dataMap";
import { message } from "ant-design-vue";
const emit = defineEmits<{
  (e: 'refresh', value: string): void
}>()
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const indiaLocalTimeDate = ref(getIndiaLocalTime());
interface Props {
  assembleRecord?: any
  appealRecord?: any
  pageType: number
}
const props = defineProps<Props>();

const { t } = useI18n();

const isFirstMount = ref(true);

/*************************************************************************************************************
*************************************************************************************************************
*************************************************************************************************************
******************************************* 申诉详情 ***********************************************************************************
**************************************************************************************************************/
const usdtBOrderInfo:any = ref({});
const getAppealDetailInfo = async () => {
  const res:any = await getAppealDetails({
    id: props.assembleRecord.id,
    idType: 1,
  });
  if (res && res.data) {
    usdtBOrderInfo.value = res.data;
  }
};
const isPaidAndUnPaid = ref(true);
const isSusseedAndFailed = ref(true);
// const { usdtBOrderInfo } = getUsdtBuyOrderInfo();//申诉详情
const isBuyer = ref(true);
// 已支付
const getId = ref({
  id: 0,
  orderActualAmount: undefined,
  remark: "",
  utr: undefined,
  voucher: undefined,
  internalRemark: undefined,
  sourceType: 2,
});
const loading = ref(false);
const orderSourceType = ref(0);
const orderAmount = ref(0);
const addDialog = ref(false);
const unpaid = ref(false);
const startUpload = (val:any) => {
  getId.value.voucher=undefined;
  if(val) loading.value = true;
}
const finishUpload = (val:any) => {
  if(val) loading.value = false;
}
const showAppealPay = async (value: any) => {
  const { id, orderSubmitAmount,utr,voucher, sourceType } = value;
  orderAmount.value = orderSubmitAmount;
  orderSourceType.value = sourceType ? Number(sourceType) : 0;
  getId.value = {
    id,
    orderActualAmount: undefined,
    remark: "",
    utr: utr || undefined,
    voucher: voucher || undefined,
    internalRemark: undefined,
    sourceType: 2,
  };
  addDialog.value = true;
};
const showNoPay = async (value: any) => {
  const { id } = value;
  getId.value = {
    id,
    orderActualAmount: undefined,
    remark: "",
    utr: undefined,
    voucher: undefined,
    internalRemark: undefined,
    sourceType: 2,
  };
  unpaid.value = true;
};
const appealPay = async (value: any) => {
  getId.value.id = value;
  const regex = /^\d{12}$/;
  if((getId.value.orderActualAmount ?? 0) % 100 != 0 && orderSourceType.value == 0){
    message.error(t("n357"));
    return;
  }
  if(!getId.value.utr){
    message.error(t("m562")+'UTR');
    return;
  }
  if(!regex.test(getId.value.utr)){
    message.error(t("n217"));
    return;
  }
  loading.value = true;
  const res:any = await matchListPay(getId.value).finally(()=>{loading.value=false});
  if (res && res.code === "1") {
    addDialog.value = false;
    message.success(t("s10"));
    isPaidAndUnPaid.value = false;
    orderSourceType.value = 0;
  }else{
    addDialog.value = false;
    isPaidAndUnPaid.value = false;
    orderSourceType.value = 0;
    emit('refresh', 'refreshAppealList');
  }
};
const matchListUnPaid = async (value: any) => {
  getId.value.id = value;
  loading.value = true;
  const res:any = await matchListNoPay(getId.value).finally(()=>{loading.value = false});
  if (res && res.code === "1") {
    unpaid.value = false;
    isPaidAndUnPaid.value = false;
    message.success(t("s10"));
  }else{
    closedalog();
    emit('refresh', 'refreshAppealList');
  }
};
const closedalog = () => {
  addDialog.value = false;
  unpaid.value = false;
  orderSourceType.value = 0;
};
// 成功
const succeedDialog = ref(false);
const succeedForm = ref({
  matchingOrderNo: undefined,
  remark: undefined,
  utr: undefined,
  internalRemark: undefined,
  sourceType: 2,
});
const showSucceed = (value: any) => {
  succeedDialog.value = true;
  succeedForm.value = {
    matchingOrderNo: value.platformOrder,
    remark: undefined,
    utr: value.utr || undefined,
    internalRemark: undefined,
    sourceType: 2,
  };
};
const succeedOrder = async () => {
  const regex = /^\d{12}$/;
  if(!succeedForm.value.utr){
    message.error(t("m562")+'UTR');
    return;
  }
  if(!regex.test(succeedForm.value.utr)){
    message.error(t("n217"));
    return;
  }
  loading.value = true;
  const res:any = await matchOrderAutoFailOrderAppealSuccess(succeedForm.value).catch(()=>{loading.value = false});
  if (res && res.code === "1") {
    succeedDialog.value = false;
    message.success(t("s10"));
    isSusseedAndFailed.value = false;
    // getList();
  }else{
    succeedDialog.value = false;
    emit('refresh', 'refreshAppealList');
  }
};
const succeedCancel = () => {
  succeedDialog.value = false;
};
// 失败
const failedDialog = ref(false);
const failedForm = ref({
  matchingOrderNo: undefined,
  remark: undefined,
  internalRemark: undefined,
  sourceType: 2,
});
const showFailed = (value: any) => {
  failedDialog.value = true;
  failedForm.value = {
    matchingOrderNo: value.platformOrder,
    remark: undefined,
    internalRemark: undefined,
    sourceType: 2,
  };
};
const failedOrder = async () => {
  loading.value = true;
  const res:any = await matchOrderAutoFailOrderAppealFail(failedForm.value).finally(()=>{loading.value = false});
  if (res && res.code === "1") {
    failedDialog.value = false;
    message.success(t("s10"));
    isSusseedAndFailed.value = false;
  }else{
    failedDialog.value = false;
    emit('refresh', 'refreshAppealList');
  }
};
const failedCancel = () => {
  failedDialog.value = false;
};



/************************************************************************************************************* 
************************************************************************************************************
*************************************************************************************************************
******************************************* 卖出流水信息/快捷提现流水信息 *******************************************
*************************************************************************************************************
**************************************************************************************************************/
const buyerUpiId = ref<string>(''); // 买家UPI ID
const bankInfo = ref<any>({
  bankName: '',
  bankCardOwner: '',
  bankCardNumber: '',
  ifscCode: '',
});
const sellQuery = ref({
  asc: false,
  pageNo: 1,
  pageSize: 3,
  startTime: props.assembleRecord.createTime,
  endTime: indiaLocalTimeDate.value,
  ifscCode: undefined,
  utr: undefined,
  recipient: [1,2].includes(props.assembleRecord.sourceType) ? buyerUpiId.value: props.assembleRecord.upiId,
  selectType: [1,2].includes(props.assembleRecord.sourceType) ? 2 : undefined,
  isMatch: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const isMatchMap:any = {
  0: 'm697',//未匹配
  1: 'm696',//已匹配
  2: 'm806',//手动匹配
  3: 'm917',//金额异常
}
const getBuyerUpiId = async () => {
  if ([1,2].includes(props.assembleRecord.sourceType)) {
    const res:any = await getBuyOrderListPage({
      platformOrder: props.assembleRecord.collectionPlatformOrder,
    });
    if (res && res.data && res.data.length >0) {
      buyerUpiId.value = res.data[0].upiId || '';
      bankInfo.value = {
        bankName: res.data[0].bankName,
        bankCardOwner: res.data[0].bankCardOwner,
        bankCardNumber: res.data[0].bankCardNumber,
        ifscCode: res.data[0].ifscCode,
      };
    }
  }
};
const sellColmuns:any = [
  {
    title: t("m582"),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 150,
  },
  {
    title: t("m691"),
    dataIndex: "recipient",
    key: "recipient",
    align: "center",
    width: 150,
  },
  {
    title: t("m692"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 150,
  },
  {
    title: 'UTR',
    dataIndex: "utr",
    key: "utr",
    align: "center",
    width: 160,
  },
  {
    title: t("n1332"),
    dataIndex: "misTypedUtr",
    key: "misTypedUtr",
    align: "center",
    width: 150,
  },
  {
    title: t("n1333"),
    dataIndex: "misTypedUtrOrder",
    key: "misTypedUtrOrder",
    align: "center",
    width: 240,
  },
  {
    title: t("m693"),
    dataIndex: "payer",
    key: "payer",
    align: "center",
    width: 240,
  },
  {
    title: t("m635"),
    dataIndex: "tId",
    key: "tId",
    align: "center",
    width: 220,
  },
  {
    title: t("m694"),
    dataIndex: "bankTransactionTime",
    key: "bankTransactionTime",
    align: "center",
    width: 150,
  },
  {
    title: t("n40"),
    dataIndex: "sellerOrderId",
    key: "sellerOrderId",
    align: "center",
    width: 180,
  },
  {
    title: t("m695"),
    dataIndex: "isMatch",
    key: "isMatch",
    align: "center",
    width: 200,
  },
  {
    title: t("n316"),
    dataIndex: "replenishmentFlag",
    key: "replenishmentFlag",
    align: "center",
    width: 120,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    width: 120,
    fixed: 'right',
  },
];
const sellColmunsBank:any = [
  {
    title: t("m582"),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 150,
  },
  {
    title: t("m693"),
    dataIndex: "payer",
    key: "payer",
    align: "center",
    width: 240,
  },
  {
    title: 'IFSC CODE',
    dataIndex: "ifscCode",
    key: "ifscCode",
    align: "center",
    width: 150,
  },
  {
    title: t("n621"),
    dataIndex: "cardOwnerName",
    key: "cardOwnerName",
    align: "center",
    width: 150,
  },
  {
    title: t("n1247"),
    dataIndex: "bankCardNumber",
    key: "bankCardNumber",
    align: "center",
    width: 150,
  },
  {
    title: t("m692"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 150,
  },
  {
    title: 'UTR',
    dataIndex: "utr",
    key: "utr",
    align: "center",
    width: 160,
  },
  {
    title: t("n1332"),
    dataIndex: "misTypedUtr",
    key: "misTypedUtr",
    align: "center",
    width: 150,
  },
  {
    title: t("n1333"),
    dataIndex: "misTypedUtrOrder",
    key: "misTypedUtrOrder",
    align: "center",
    width: 240,
  },
  {
    title: t("m635"),
    dataIndex: "tId",
    key: "tId",
    align: "center",
    width: 220,
  },
  {
    title: t("m694"),
    dataIndex: "bankTransactionTime",
    key: "bankTransactionTime",
    align: "center",
    width: 150,
  },
  {
    title: t("n40"),
    dataIndex: "sellerOrderId",
    key: "sellerOrderId",
    align: "center",
    width: 180,
  },
  {
    title: t("m695"),
    dataIndex: "isMatch",
    key: "isMatch",
    align: "center",
    width: 200,
  },
  {
    title: t("n316"),
    dataIndex: "replenishmentFlag",
    key: "replenishmentFlag",
    align: "center",
    width: 120,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    width: 120,
    fixed: 'right',
  },
];
const {
  dataSource: sellRecordData,
  // extendData,
  pagination: sellPagination,
  loading: sellLoading,
  // response,
  handleTableChange : sellHandleTableChange,
  getList: getSellRecordData,
  // resetQuery,
} = useTableData({
  query:sellQuery,
  handleQueryFields: (q) => ({
    ...q,
    // startTime: props.assembleRecord.createTime,
    // endTime: indiaLocalTimeDate.value,
    // recipient: [1,2].includes(props.assembleRecord.sourceType) ? buyerUpiId.value: props.assembleRecord.upiId,
    selectType: [1,2].includes(props.assembleRecord.sourceType) ? 2 : undefined,
  }),
  api: [1,2].includes(props.assembleRecord.sourceType) ? kycPartnerBuyAppealPaymentAdminListPage : kycPartnerRecipientAdminListPage,
  fetchType: [1,2].includes(props.assembleRecord.sourceType) ? 2 : 1,
  defaultPageSize: 3,
  filterRules: [],
  notShowChangeSize: true,
  afterFetch: (data) =>
    data.map((item: any) => {
      item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
      return item;
    }),
  afterGetDataFunc: async () => {
    if(isFirstMount.value) getAssembleData();
  },
});

  //补单
const manualOrderLabel = ref('');
const manualModal = ref(false);
const manualForm = ref({
  amount: undefined,
  orderNo: undefined,
  utr: undefined,
  waterType: undefined as any,
  orderReplenishmentSource: 2,
  delayConsumer: 0,
  delayFinish: 0,
  delayType: undefined,
  delayTime: undefined,
  disableBuy: 0,
  disableLimitType: undefined,
  disableLimitTime: undefined,
})
const openManualMadal = (val:any,label:any = undefined) => {
  manualOrderLabel.value = label ? t('n41') : [1,2].includes(props.assembleRecord.sourceType) ? t('n41') : t('n40');
  manualModal.value = true
  const { utr,amount,buyerOrderId,sellerOrderId } = val;
  manualForm.value = {
    amount,
    orderNo: [1,2].includes(props.assembleRecord.sourceType) ? sellerOrderId : buyerOrderId,
    utr,
    waterType: label ? 2 : [1,2].includes(props.assembleRecord.sourceType) ? 3 : 1,
    orderReplenishmentSource: 2,
    delayConsumer: 0,
    delayFinish: 0,
    delayType: undefined,
    delayTime: undefined,
    disableBuy: 0,
    disableLimitType: undefined,
    disableLimitTime: undefined,
  };
}
const manualKycOrder = async () => {
  if (!manualForm.value.orderNo) {
    message.error(t('m562') + manualOrderLabel.value);
    return;
  }
  sellLoading.value = true;
  selectUpiLoading.value = true;
  const res:any = await matchingOrderAdminOrderReplenishmentByWater(manualForm.value).finally(()=>{
    sellLoading.value = false;
    selectUpiLoading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t('s10'));
    closeManualModal();
    getSellRecordData();
    getAppealDetailData();
  }else if(res && res.code == "9007"){
    message.error(t('n1474'));
    closeManualModal();
  }
}
const closeManualModal = () => {
  manualModal.value = false;
  manualForm.value = {
    amount: undefined,
    orderNo: undefined,
    utr: undefined,
    waterType: undefined,
    orderReplenishmentSource: 2,
    delayConsumer: 0,
    delayFinish: 0,
    delayType: undefined,
    delayTime: undefined,
    disableBuy: 0,
    disableLimitType: undefined,
    disableLimitTime: undefined,
  }
}


/************************************************************************************************************* 
************************************************************************************************************
*************************************************************************************************************
******************************************* 申诉流水信息 *******************************************
*************************************************************************************************************
**************************************************************************************************************/
const appealQuery = ref({
  ifscCode: undefined,
  utr: undefined,
  isMatch: undefined,
  pageNo: 1,
  pageSize: 3,
  startTime: props.assembleRecord.createTime,
  endTime: indiaLocalTimeDate.value,
  recipient: [1,2].includes(props.assembleRecord.sourceType) ? props.assembleRecord.upiId : undefined,
});
const appealColmuns:any = [
  {
    title: t("m582"),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 150,
  },
  {
    title: t("m691"),
    dataIndex: "recipient",
    key: "recipient",
    align: "center",
    width: 150,
  },
  {
    title: t("m692"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 150,
  },
  {
    title: 'UTR',
    dataIndex: "utr",
    key: "utr",
    align: "center",
    width: 140,
  },
  {
    title: t("n1332"),
    dataIndex: "misTypedUtr",
    key: "misTypedUtr",
    align: "center",
    width: 150,
  },
  {
    title: t("n1333"),
    dataIndex: "misTypedUtrOrder",
    key: "misTypedUtrOrder",
    align: "center",
    width: 240,
  },
  {
    title: t("m693"),
    dataIndex: "payer",
    key: "payer",
    align: "center",
    width: 240,
  },
  {
    title: t("m635"),
    dataIndex: "tId",
    key: "tId",
    align: "center",
    width: 220,
  },
  {
    title: t("m694"),
    dataIndex: "bankTransactionTime",
    key: "bankTransactionTime",
    align: "center",
    width: 150,
  },
  // {
  //   title: t("n41"),
  //   dataIndex: "buyerOrderId",
  //   key: "buyerOrderId",
  //   align: "center",
  //   width: 180,
  // },
  {
    title: t("n40"),
    dataIndex: "sellerOrderId",
    key: "sellerOrderId",
    align: "center",
    width: 180,
  },
  {
    title: t("m695"),
    dataIndex: "isMatch",
    key: "isMatch",
    align: "center",
    width: 200,
  },
  {
    title: t("n316"),
    dataIndex: "replenishmentFlag",
    key: "replenishmentFlag",
    align: "center",
    width: 120,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    width: 120,
    fixed: 'right',
  },
];
const appealColmunsBank:any = [
  {
    title: t("m582"),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 150,
  },
  {
    title: t("m693"),
    dataIndex: "payer",
    key: "payer",
    align: "center",
    width: 240,
  },
  {
    title: 'IFSC CODE',
    dataIndex: "ifscCode",
    key: "ifscCode",
    align: "center",
    width: 150,
  },
  {
    title: t("n621"),
    dataIndex: "cardOwnerName",
    key: "cardOwnerName",
    align: "center",
    width: 150,
  },
  {
    title: t("n1247"),
    dataIndex: "bankCardNumber",
    key: "bankCardNumber",
    align: "center",
    width: 150,
  },
  {
    title: t("m692"),
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 150,
  },
  {
    title: 'UTR',
    dataIndex: "utr",
    key: "utr",
    align: "center",
    width: 160,
  },
  {
    title: t("n1332"),
    dataIndex: "misTypedUtr",
    key: "misTypedUtr",
    align: "center",
    width: 150,
  },
  {
    title: t("n1333"),
    dataIndex: "misTypedUtrOrder",
    key: "misTypedUtrOrder",
    align: "center",
    width: 240,
  },
  {
    title: t("m635"),
    dataIndex: "tId",
    key: "tId",
    align: "center",
    width: 220,
  },
  {
    title: t("m694"),
    dataIndex: "bankTransactionTime",
    key: "bankTransactionTime",
    align: "center",
    width: 150,
  },
  {
    title: t("n40"),
    dataIndex: "sellerOrderId",
    key: "sellerOrderId",
    align: "center",
    width: 180,
  },
  {
    title: t("m695"),
    dataIndex: "isMatch",
    key: "isMatch",
    align: "center",
    width: 200,
  },
  {
    title: t("n316"),
    dataIndex: "replenishmentFlag",
    key: "replenishmentFlag",
    align: "center",
    width: 120,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    width: 120,
    fixed: 'right',
  },
];
const {
  dataSource: appealRecordData,
  // extendData,
  pagination: appealPagination,
  loading: appealLoading,
  // response,
  handleTableChange : appealHandleTableChange,
  getList: getAppealDetailData,
  // resetQuery,
} = useTableData({
  query:appealQuery,
  handleQueryFields: (q) => ({
    ...q,
    // startTime: props.assembleRecord.createTime,
    // endTime: indiaLocalTimeDate.value,
    // recipient: props.assembleRecord.upiId,
  }),
  api: kycPartnerBuyAppealPaymentAdminListPage,
  fetchType: 2,
  defaultPageSize: 3,
  filterRules: [],
  notShowChangeSize: true,
  afterFetch: (data) =>
    data.map((item: any) => {
      item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
      return item;
    }),
  afterGetDataFunc: async () => {
    if(isFirstMount.value) getAppealDetailInfo();
  },
});

/************************************************************************************************************* 
************************************************************************************************************
*************************************************************************************************************
******************************************* 查询UPI ID是否存在于系统 *******************************************
*************************************************************************************************************
**************************************************************************************************************/
const selectHasData = ref(true);
const selectUpi = ref({
  asc: false,
  pageNo: 1,
  pageSize: 3,
  upiId: undefined,
  ifscCode: undefined,
  recipient: undefined,
  utr: undefined,
  startTime: '',
  endTime: '',
  version: 2,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});

const selectUpicolumns:any = [
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 120,
    fixed: "left",
  },
  {
    title: t("n1162"),
    dataIndex: "mobileNumber",
    key: "mobileNumber",
    align: "center",
    width: 150,
    fixed: "left",
  },
  {
    title: 'UPI ID',
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
    fixed: "left",
  },
  {
    title: t("state"),
    dataIndex: "collectedStatus",
    key: "collectedStatus",
    align: "center",
    width: 100,
    fixed: "left",
  },
  {
    title: t("l70"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 140,
  },
];
const {
  dataSource: selectUpiData,
  pagination: selectUpiPagination,
  loading: selectUpiLoading,
  handleTableChange: selectUpiHandleTableChange,
  getList: getSelectUpiData,
} = useTableData({
  query: selectUpi,
  handleQueryFields:(q) => ({
    ...q,
    version: 2,
  }),
  api: memberPaymentList,
  notShowChangeSize: true,
  defaultPageSize: 3,
  filterRules: [],
  afterGetDataFunc: async () => {
    if(selectUpiData.value && selectUpiData.value.length > 0){
      selectHasData.value = true;
    }else{
      selectHasData.value = false;
    }
  },
});

/************************************************************************************************************* 
************************************************************************************************************
*************************************************************************************************************
******************************************* 查询用户是否申诉错订单 *******************************************
*************************************************************************************************************
**************************************************************************************************************/
const appealErrHasData = ref(true);
const appealErrQuery = ref({
  asc: false,
  pageNo: 1,
  pageSize: 3,
  platformOrder: undefined,
  upiId: undefined,
  collectionMemberId: undefined,
  // createTimeStart: startIndiaTime,
  // createTimeEnd: endIndiaTime,
  createTimeStart: '',
  createTimeEnd: '',
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});

const appealErrColumns:any = <any>[
  {
    title: t("m807"),
    dataIndex: "platformOrder",
    key: "platformOrder",
    align: "center",
    isRequired: true,
    width: 200,
  },
  {
    title: t("m149"),
    dataIndex: "collectionMemberId",
    key: "collectionMemberId",
    isRequired: true,
    align: "center",
    width: 120,
  },
  {
    title: t("m150"),
    dataIndex: "paymentMemberId",
    key: "paymentMemberId",
    align: "center",
    width: 120,
  },
  {
    title: t("n42"),
    dataIndex: "orderSubmitAmount",
    key: "orderSubmitAmount",
    isRequired: true,
    align: "center",
    width: 120,
  },
  {
    title: t("n1235"),
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
  },
  {
    title: t("n51"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 150,
  },
  {
    title: "UTR",
    dataIndex: "utr",
    key: "utr",
    align: "center",
    width: 150,
  },
  {
    title: t("n433"),
    dataIndex: "appealStatus",
    key: "appealStatus",
    align: "center",
    width: 150,
  },
  {
    title: t("c11"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 140,
  },
  {
    title: t("l38"),
    dataIndex: "paymentTime",
    key: "paymentTime",
    align: "center",
    width: 140,
  },
  {
    title: t("l39"),
    dataIndex: "completionTime",
    key: "completionTime",
    align: "center",
    width: 140,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    width: 120,
    fixed: 'right',
  },
];

const {
  dataSource: appealErrData,
  pagination: appealErrPagination,
  loading: appealErrLoading,
  handleTableChange: appealErrHandleTableChange,
  getList: getAppealErrData,
  resetQuery: resetAppealErrQuery,
} = useTableData({
  query: appealErrQuery,
  handleQueryFields: (q) => ({
    ...q,
    status: q.status?.length ? q.status.join(",") : undefined,
  }),
  api: getMatchListData,
  defaultPageSize: 3,
  filterRules: [
    { key: "sourceType" },
    { key: "wakeUpFlag", validValues: ["0", "1"] },
  ],
  notShowChangeSize: true,
  afterFetch: (data) =>
    data.map((item: any) => {
      // item.auditSeconds = Math.random()*7201;
      // item.showMessage=true;
      if(item.auditSeconds && item.auditSeconds != 0){
        if( item.status == '4' || item.status == '5'){
          item.showMessage=true;
        }else{
          item.showMessage=false;
        }
      }else{
        item.showMessage=false;
      }
      return item;
    }),
    afterGetDataFunc: async () => {
      if(appealErrData.value && appealErrData.value.length > 0){
        appealErrHasData.value = true;
      }else{
        appealErrHasData.value = false;
      }
    },
});

const assembleInfo:any = ref({});// 撮合详情
const getAssembleData = async () => {
  const res = await getMatchListResult({id:props.assembleRecord.id});
  if(res && res.data){
    assembleInfo.value = res.data;
  }
};
//补单
const manualOrderLoading = ref(false);
const manualOpen = ref(false);
const continueManualOpen = ref(false);
const continueManualText = ref('');
const manualFrom = ref<any>({
  amount: undefined,
  chOrderNo: undefined,
  utr: undefined,
  sendType: 0,
  orderReplenishmentSource: 1,
  delayConsumer: 0,
  delayFinish: 0,
  delayType: undefined,
  delayTime: undefined,
  disableBuy: 0,
  disableLimitType: undefined,
  disableLimitTime: undefined,
});
const mamOrderSubmitAmount = ref(0);
const manualOrder = (value: any) => {
  const { platformOrder, utr, replenishmentFlag, orderSubmitAmount,orderActualAmount} = value;
  // if(replenishmentFlag == 1){
  //   message.success(t("n204"));
  //   return;
  // }
  mamOrderSubmitAmount.value = orderSubmitAmount;
  manualFrom.value = {
    amount: orderSubmitAmount >= orderActualAmount ? orderActualAmount : orderSubmitAmount,
    chOrderNo: platformOrder,
    utr,
    sendType: 0,
    orderReplenishmentSource: 1,
    delayConsumer: 0,
    delayFinish: 0,
    delayType: undefined,
    delayTime: undefined,
    disableBuy: 0,
    disableLimitType: undefined,
    disableLimitTime: undefined,
  };
  manualOpen.value = true;
};
const manualOrderSubmit = async () => {
  const regex = /^\d{12}$/;
  if(!manualFrom.value.amount){
    message.error(t("m562")+t("l34"));
    return;
  }
  if(!manualFrom.value.utr){
    message.error(t("m562")+'UTR');
    return;
  }
  if(!regex.test(manualFrom.value.utr)){
    message.error(t("n217"));
    return;
  }
  if(manualFrom.value.delayFinish && !manualFrom.value.delayType){
    message.error(t("m563")+t("n1397"));
    return;
  }
  if(manualFrom.value.disableBuy && !manualFrom.value.disableLimitType){
    message.error(t("m563")+t("n1398"));
    return;
  }
  manualOrderLoading.value = true;
  const res:any = await matchOrderManualOrderReplenishment(manualFrom.value).finally(()=>{manualOrderLoading.value = false});
  if (res && res.code == "1") {
    closeManual();
    closeContinueManual();
    message.success(t("s10"));
    getAppealErrData();
  }else if(res && res.code == "9006"){
    continueManualText.value = t('n1284');
    continueManualOpen.value = true;
    manualFrom.value.sendType = 1;
  }else if(res && res.code == "9007"){
    continueManualText.value = t('n1285');
    continueManualOpen.value = true;
    manualFrom.value.sendType = 1;
  }
};
const closeManual = () => {
  manualFrom.value = {
    amount: undefined,
    orderNo: undefined,
    utr: undefined,
    orderReplenishmentSource: 1,
    delayConsumer: 0,
    delayFinish: 0,
    delayType: undefined,
    delayTime: undefined,
    disableBuy: 0,
    disableLimitType: undefined,
    disableLimitTime: undefined,
  };
  mamOrderSubmitAmount.value = 0;
  manualOpen.value = false;
};

const closeContinueManual = () => {
  continueManualOpen.value = false;
  continueManualText.value = '';
  manualFrom.value.sendType = 0;
};





// /**************************************************************************************************************
// ************************************************************************************************************
// *************************************************************************************************************
// ******************************************* 获取会员KYC信息 *******************************************
// *************************************************************************************************************/
// const buyerMemberKycInfo = ref<any>({});
// const sellerMemberKycInfo = ref<any>({});
// const getMemberKycInfo = async () => {
//   const buyRes:any = await kycPartnersAdminList({
//     id: props.assembleRecord.kycId,
//     memberId: props.assembleRecord.collectionMemberId,
//   });
//   if (buyRes && buyRes.data) {
//     buyerMemberKycInfo.value = buyRes.data[0];
//     console.log(buyerMemberKycInfo.value);
//   }
//   const sellRes:any = await kycPartnersAdminList({
//     id: props.assembleRecord.kycId,
//     memberId: props.assembleRecord.paymentMemberId,
//   });
//   if (sellRes && sellRes.data) {
//     sellerMemberKycInfo.value = sellRes.data[0];
//     console.log(sellerMemberKycInfo.value);
//   }
// }
// /************************************************************************************************************* 
// ************************************************************************************************************
// *************************************************************************************************************
// ******************************************* 查询KYC连接情况-单独查询-会员KYC信息 *******************************************
// *************************************************************************************************************
// **************************************************************************************************************/
const kycManagerInfoQuery = ref({
  asc: false,
  pageNo: 1,
  pageSize: 3,
  upiId: props.assembleRecord.upiId || undefined,
  firstPage: true,
  lastPage:false,
  version: 2,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const kycManagerLinkQuery  = ref({
  asc: false,
  pageNo: 1,
  pageSize: 3,
  bankCode: undefined,
  phoneNumber: undefined,
  operationTimeStart: '',
  operationTimeEnd: '',
  // firstPage: true,
  // lastPage:false,
  // direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  // nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  // nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  // prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  // prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
// const isQuiclyOrder = ref(false);
// const kycLinkStatusChangeSource = ref(props.assembleRecord.sourceType == 0 ? 2 :1); //1买家 2卖家
// if(props.assembleRecord.sourceType == 0){
//     isQuiclyOrder.value = false;
//   }else{
//     isQuiclyOrder.value = true;
//   }

  const kycManagerConnetColumns:any = [
  // {
  //   title: t('m582'),
  //   dataIndex: "bankCode",
  //   key: "bankCode",
  //   align: "center",
  //   width: 90,
  // },
  // {
  //   title: t('n328'),
  //   dataIndex: "phoneNumber",
  //   key: "phoneNumber",
  //   align: "center",
  //   width: 120,
  // },
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

const kycManagerInfo = ref<any>({});
const getKycManagerInfo = async () => {
  kycManagerConnetLinkData.value = [];
  if(!kycManagerInfoQuery.value.upiId) return;
  kycManagerConnetLoading.value = true;
  const res:any = await kycPartnersAdminList(kycManagerInfoQuery.value).finally(()=>{kycManagerConnetLoading.value = false});
  if (res && res.data.length > 0) {
    kycManagerLinkQuery.value.bankCode = res.data[0].bankCode || '000';
    kycManagerLinkQuery.value.phoneNumber = res.data[0].account || '000';
    await getKycConnetDataData(1);
  }
};

const {
  dataSource: kycManagerConnetLinkData,
  // extendData,
  pagination: kycManagerConnetPagination,
  loading: kycManagerConnetLoading,
  // response,
  handleTableChange : kycManagerConnetHandleTableChange,
  getList: getKycConnetDataData,
  // resetQuery,
} = useTableData({
  query:kycManagerLinkQuery,
  api: kycLinkStatusLogAdminListPage,
  fetchType:  2 ,
  defaultPageSize: 3,
  filterRules: [],
  notShowChangeSize: true,
});
// // 切换买家卖家
// const changeGet = (type: number) => {
//   kycLinkStatusChangeSource.value = type;
//   kycManagerLinkQuery.value.changeSource = type;
//   kycManagerLinkQuery.value.bankCode =
//     type == 2
//       ? sellerMemberKycInfo.value?.bankCode || '000'
//       : buyerMemberKycInfo.value?.bankCode || '000';

//   kycManagerLinkQuery.value.phoneNumber =
//     type == 2
//       ? sellerMemberKycInfo.value?.mobileNumber || '000'
//       : buyerMemberKycInfo.value?.mobileNumber || '000';
//   getKycConnetDataData(1);
// };
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


// 会员详情弹窗
const detailModel = ref(false);
const detailId = ref<any>({});
const showDetail = async (value: any,member:any=null) => {
  const { id, memberId } = value;
  detailId.value = { id, memberId };
  if(member){
    detailId.value = { id, memberId: member };
  }
  detailModel.value = true;
};
// 视频弹窗
const videoUrl = ref('');
const videoMod = ref(false);
const openVideo = (url:any) => {
  videoUrl.value = url;
  videoMod.value = true;
}
const handleCancel = () => {
  videoMod.value = false;
  videoUrl.value = '';
};

//获取当前用户
const currentUser =JSON.parse(localStorage.getItem("userInfo") || "{}");
onMounted( async () => {
  // if(props.assembleRecord.kycId){
  //   await getMemberKycInfo();
  // }
  // if(props.pageType == 1 && props.appealRecord.handlerUserId == currentUser.userId || props.pageType == 1 && currentUser.isAdmin){//申诉订单列表进入，并且当前处理人和登录用户一致
  //   isPaidAndUnPaid.value = true;
  //   isSusseedAndFailed.value = true;
  // }else{
  //   isPaidAndUnPaid.value = false;
  //   isSusseedAndFailed.value = false;
  // }
  // 先置为 false，避免并发期间表格的 afterGetDataFunc 重复触发 getAssembleData/getAppealDetailInfo
  isFirstMount.value = false;
  await Promise.all([
    getAppealDetailInfo(),
    getAssembleData(),
    getBuyerUpiId(),
    getKycManagerInfo(),
    getSellRecordData(),
    getAppealDetailData(),
  ]);
  // getSelectUpiData();
  // getAppealErrData();
  // if(assembleInfo.value.matchPoolCreateTime && isFirstMount.value && !props.assembleRecord.kycId){
  //   getKycConnetDataData();
  // }
  setTimeout(() => {
    isFirstMount.value = true;
  }, 2000);
});

</script>

<style scoped lang="less">
.assembleAppealTitle {
  height: 30px;
  line-height: 30px;
  position: relative;
  padding-left: 10px;
  &::before {
    content: "";
    background-color: #f9a600;
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 30px;
  }
}
.Temp_C-box {
    display: grid;
    grid-template-columns: 1fr 1fr; 
    gap: 0; 
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
  .item {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    line-height: 30px;
    text-align: center;

    > div {
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }

    .lab {
      background-color: #f5f5f5;
      font-weight: bold;
      text-align: center;
      white-space: nowrap;
    }
    .data {
      white-space: nowrap;
    }
  }
}
.Temp_C-box4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr; 
    gap: 0; 
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
  .item {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    line-height: 30px;
    text-align: center;

    > div {
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }

    .lab {
      background-color: #f5f5f5;
      font-weight: bold;
      text-align: center;
      white-space: nowrap;
    }
    .data {
      white-space: nowrap;
    }
  }
}
.pictures_container {
  overflow: auto;
  .appealInfo{
    line-height: 30px;
    .title{
      font-weight: bold;
      width: 100px;
      font-size: 14px;
    }
  }
  .appealData{
    min-height: 80px;
    .appealData_box1{
      min-width: 30%;
      max-width: 50%;
      margin-right: 20px;
    }
    .appealData_box1,.appealData_box2{
      float: left;
      &>div{
        float: left;
      }
      .title{
        height: 30px;
        line-height: 30px;
        font-weight: bold;
        font-size: 14px;
      }
    }
    .pic{
      position: relative;
      .playVideo{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
        .playIcon{
          width: 40px;
          height: 40px;
          font-size: 40px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          &:hover{
            color: #108ee9;
          }
        }
      }
    }
  }
}
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
.paidTip{
  margin-top: 6px;
  >div{
    font-size: 12px;
    color: red;
  }
}
</style>
