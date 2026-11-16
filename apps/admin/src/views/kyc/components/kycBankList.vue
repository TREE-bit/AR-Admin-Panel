<template>
  <div class="search">
    <a-row>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.bankCode"
          :placeholder="$t('m563')+$t('m582')"
        >
          <a-select-option
            v-for="(item) in groupList"
            :value="item"
            :key="item"
            >{{ item }}</a-select-option
          >
        </a-select>
      </a-col>
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.buyStatus"
          :placeholder="$t('m563')+$t('memberListC15')"
        >
          <a-select-option :value="0">{{ $t('l54') }}</a-select-option>
          <a-select-option :value="1">{{ $t('l53') }}</a-select-option>
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.sellStatus"
          :placeholder="$t('m563')+$t('memberListC16')"
        >
          <a-select-option :value="0">{{ $t('l54') }}</a-select-option>
          <a-select-option :value="1">{{ $t('l53') }}</a-select-option>
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.supportsBuyAppeal"
          :placeholder="$t('m563')+$t('n1389')"
        >
        <a-select-option :value="1">{{ $t('yes') }}</a-select-option>
        <a-select-option :value="0">{{ $t('no') }}</a-select-option>
        </a-select>
      </a-col> -->
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <a-button type="primary" @click="showAddDialog"   v-permission="'admin:kycBankAdmin:addKycBank'">{{ $t('add') }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="paginationConfig"
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading || latestLoading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => record.id"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'iconUrl'">
        <a-image v-if="record.iconUrl" :width="60" style="max-height: 60px;" :src="record.iconUrl" alt=""/>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'externalIconUrl'">
        <a-image v-if="record.externalIconUrl" :width="60" style="max-height: 60px;" :src="record.externalIconUrl" alt=""/>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'externalBackgroundUrl'">
        <a-image v-if="record.externalBackgroundUrl" :width="60" style="max-height: 60px;" :src="record.externalBackgroundUrl" alt=""/>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'sourceType'"  >
        {{ sourceMap[record.sourceType] }}
      </template>
      <template v-if="column.key === 'bankName'">
        <a-tooltip>
          <template #title>{{ record.bankName }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankName }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'bankCode'">
        <a-tooltip>
          <template #title>{{ record.bankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;padding: 6px 0;">{{ record.bankCode }}</div>
        </a-tooltip>
      </template>
      <!-- <template v-if="column.key === 'linkUrl'">
        <a-tooltip>
          <template #title>{{ record.linkUrl }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.linkUrl }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'apiUrl'">
        <a-tooltip>
          <template #title>{{ record.apiUrl }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.apiUrl }}</div>
        </a-tooltip>
      </template> -->
      <template v-if="column.key === 'upiMinAmount'">
        <span style="color: green;" v-if="record.upiMinAmount && record.upiMaxAmount">
          {{ record.upiMinAmount }} - {{ record.upiMaxAmount }}
          <a-button type="link" style="padding:0" danger @click="showEditLimit('upi',record)">{{ $t('b8') }}</a-button>
        </span>
        <span v-else>
          {{ $t('n1113') }}
          <a-button type="link" @click="showEditLimit('upi',record)">{{ $t('m753') }}</a-button>
        </span>
      </template>
      <template v-if="column.key === 'bankMinAmount'">
        <span style="color: green;" v-if="record.bankMinAmount && record.bankMaxAmount">
          {{ record.bankMinAmount }} - {{ record.bankMaxAmount }}
          <a-button type="link" style="padding:0" danger @click="showEditLimit('bank',record)">{{ $t('b8') }}</a-button>
        </span>
        <span v-else>
          {{ $t('n1113') }}
          <a-button type="link" @click="showEditLimit('bank',record)">{{ $t('m753') }}</a-button>
        </span>
      </template>
      <template v-if="column.key === 'sellStatus'"  >
        <a-switch
          class="light-green-switch"
          :checked="record.sellStatus == 1 ? true : false"
          @change="confirmBy($event,'sellStatus',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.sellStatus == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'sellStatus')"
          />
      </template>
      <template v-if="column.key === 'supportsBuyAppeal'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsBuyAppeal == 1 ? true : false"
          @change="confirmBy($event,'supportsBuyAppeal',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsBuyAppeal == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsBuyAppeal')"
          />
      </template>
      <template v-if="column.key === 'supportsQuickWithdraw'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsQuickWithdraw == 1 ? true : false"
          @change="confirmBy($event,'supportsQuickWithdraw',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
            size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsQuickWithdraw == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsQuickWithdraw')"
          />
      </template>
      <template v-if="column.key === 'supportsQuickWithdrawBank'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsQuickWithdrawBank == 1 ? true : false"
          @change="confirmBy($event,'supportsQuickWithdrawBank',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsQuickWithdrawBank == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsQuickWithdrawBank')"
          />
      </template>
      <template v-if="column.key === 'supportPhonepeWakeUp'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportPhonepeWakeUp == 1 ? true : false"
          @change="confirmBy($event,'supportPhonepeWakeUp',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportPhonepeWakeUp == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportPhonepeWakeUp')"
          />
      </template>
      <template v-if="column.key === 'supportsExternalAppeal'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsExternalAppeal == 1 ? true : false"
          @change="confirmBy($event,'supportsExternalAppeal',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsExternalAppeal == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsExternalAppeal')"
          />
      </template>
      <template v-if="column.key === 'supportsExternalSell'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsExternalSell == 1 ? true : false"
          @change="confirmBy($event,'supportsExternalSell',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsExternalSell == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsExternalSell')"
          />
      </template>
      <template v-if="column.key === 'supportLotteryTicket'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportLotteryTicket == 1 ? true : false"
          @change="confirmBy($event,'supportLotteryTicket',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportLotteryTicket == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportLotteryTicket')"
          />
      </template>
      <template v-if="column.key === 'otpLimitEnabled'">
        <a-switch
          class="light-green-switch"
          :checked="record.otpLimitEnabled == 1 ? true : false"
          @change="confirmBy($event,'otpLimitEnabled',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.otpLimitEnabled == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'otpLimitEnabled')"
          />
      </template>
      <template v-if="column.key === 'otpHourlySuccessLimit' || column.key === 'otpDailyFailLimit'">
        <span :style="hasOtpLimit(record[column.key]) ? 'color: green;' : ''">{{ record[column.key] ?? '-' }}</span>
        <a-button type="link" style="padding:0;margin-left:6px" :danger="hasOtpLimit(record[column.key])" @click="showEditLimit(column.key === 'otpHourlySuccessLimit' ? 'otpHourly' : 'otpDaily', record)"
          v-permission="'admin:kycBankAdmin:updateKycBank'">{{ hasOtpLimit(record[column.key]) ? $t('b8') : $t('m753') }}</a-button>
      </template>
      <!-- <template v-if="column.key === 'supportsAutoSell'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsAutoSell == 1 ? true : false"
          @change="confirmBy($event,'supportsAutoSell',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsAutoSell == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsAutoSell')"
          />
      </template> -->
      <!-- <template v-if="column.key === 'supportsAutoBuy'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsAutoBuy == 1 ? true : false"
          @change="confirmBy($event,'supportsAutoBuy',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsAutoBuy == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsAutoBuy')"
          />
      </template> -->
      <template v-if="column.key === 'allowMultiLogin'">
        <span :class="record.allowMultiLogin == 1 ? 'tag-orange' : 'tag-blue'">
          {{ record.allowMultiLogin == 1 ? $t('n1385') : $t('n1386') }}
        </span>
      </template>
      <template v-if="column.key === 'needPinCode'">
        <span :class="record.needPinCode == 1 ? 'tag-green' : 'tag-red'">
          {{ record.needPinCode == 1 ? $t('n1649') : $t('n1650') }}
        </span>
      </template>
      <template v-if="column.key === 'updateBy'">
        <a-tooltip>
          <template #title>{{ record.updateBy }}</template>
          <div class="toopTipStyle2">{{ record.updateBy }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'updateTime'"  >
      {{ record.updateTime || record.createTime }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:kycBankAdmin:updateKycBank'"
          >{{ $t("b8") }}
        </a-tag> 
        
        <a-popconfirm
          :title=" $t('t16') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record)"
        >
         <a-tag
          :color="'rgba(253, 11, 26, 1)'"
          style="cursor: pointer"
          size="small"
          v-permission="'admin:kycBankAdmin:deleteKycBank'"
          >{{ $t('b11') }}
        </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :title="isEdit? $t('b8'): $t('add')"
  @cancel="closeAddDalog" :footer="null" width="1200px">
    <a-form
      :model="addFrom"
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-row :gutter="30">
        <a-col :span="12">
          <a-form-item :label ="$t('m581')" name="bankName"  :rules="[{ required: true, message: ''}]">
            <a-input v-trim v-model:value="addFrom.bankName"  :placeholder="$t('m562')+$t('m581')"/>
          </a-form-item>
          <a-form-item :label="$t('m582')" name="bankCode" :rules="[{ required: true, message: ''}]">
            <a-input v-trim v-model:value="addFrom.bankCode" :disabled="isEdit" :placeholder="$t('m562')+$t('m582')"/>
          </a-form-item>
          <a-form-item :label="$t('sort')" name="sort" :rules="[{ required: true, message: ''}]">
            <a-input-number v-model:value="addFrom.sort" :min="1" style="width: 100%" :placeholder="$t('m562')+$t('sort')"/>
          </a-form-item>
          <a-form-item :label="$t('m583')" name="iconUrl" :rules="[{ required: true, message: ''}]">
            <Upload v-if="isMountUpload" v-model:value="addFrom.iconUrl"  @startUpload="startUpload"  @finishUpload="finishUpload"/>
          </a-form-item>
          <!-- <a-form-item :label="$t('m701')" name="apiUrl" :rules="[{ required: true, message: ''}]">
            <a-input v-trim v-model:value="addFrom.apiUrl"  :placeholder="$t('m562')+$t('m701')"/>
          </a-form-item>
          <a-form-item :label="$t('m702')" name="linkUrl" :rules="[{ required: true, message: ''}]">
            <a-input v-trim v-model:value="addFrom.linkUrl" :placeholder="$t('m562')+$t('m702')"/>
          </a-form-item> -->
          <a-form-item :label="$t('n1652')" name="externalIconUrl" :rules="[{ required: true, message: ''}]">
            <Upload v-if="isMountUpload" v-model:value="addFrom.externalIconUrl"  @startUpload="startUpload"  @finishUpload="finishUpload"/>
          </a-form-item>
          <a-form-item :label="$t('n1653')" name="externalBackgroundUrl" :rules="[{ required: true, message: ''}]">
            <Upload v-if="isMountUpload" v-model:value="addFrom.externalBackgroundUrl"  @startUpload="startUpload"  @finishUpload="finishUpload"/>
          </a-form-item>
        </a-col>
        <a-col class="content-box-gray" :span="12">
          <!-- <a-form-item :label="$t('memberListC15')" name="buyStatus" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.buyStatus">
              <a-radio :value="1"> {{  $t('l53') }} </a-radio>
              <a-radio :value="0"> {{  $t('l54') }} </a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item :label="$t('memberListC16')" name="sellStatus" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.sellStatus" :disabled="isEdit">
              <a-radio :value="1"> {{  $t('l53') }} </a-radio>
              <a-radio :value="0"> {{  $t('l54') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('m703')" name="sourceType" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.sourceType">
              <a-radio v-for="(item, index) in sourceMap" :key="index" :value="Number(index)">
                {{ item }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1384')" name="allowMultiLogin" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.allowMultiLogin">
              <a-radio :value="1"> {{ $t('n1385') }} </a-radio>
              <a-radio :value="0"> {{ $t('n1386') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1651')" name="needPinCode" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.needPinCode" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('n1649') }} </a-radio>
              <a-radio :value="0"> {{ $t('n1650') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1389')" name="supportsBuyAppeal" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsBuyAppeal" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1390')" name="supportsQuickWithdraw" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsQuickWithdraw" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1391')" name="supportsQuickWithdrawBank" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsQuickWithdrawBank" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1392')" name="supportPhonepeWakeUp" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportPhonepeWakeUp" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1393')" name="supportsExternalAppeal" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsExternalAppeal" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1394')" name="supportsExternalSell" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsExternalSell" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1468')" name="supportLotteryTicket" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportLotteryTicket" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- <a-form-item :label="$t('n1545')" name="supportsAutoSell" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsAutoSell" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item> -->
          <!-- <a-form-item :label="$t('n1531')" name="supportsAutoBuy" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsAutoBuy" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item :label="$t('n2078')" name="otpLimitEnabled" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.otpLimitEnabled" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n2079')" name="otpHourlySuccessLimit" :rules="[{ required: addFrom.otpLimitEnabled == 1, message: ''}]">
            <a-input-number v-model:value="addFrom.otpHourlySuccessLimit" :min="1" :precision="0" style="width: 160px" :placeholder="$t('m562')+$t('n2079')"/>
          </a-form-item>
          <a-form-item :label="$t('n2080')" name="otpDailyFailLimit" :rules="[{ required: addFrom.otpLimitEnabled == 1, message: ''}]">
            <a-input-number v-model:value="addFrom.otpDailyFailLimit" :min="1" :precision="0" style="width: 160px" :placeholder="$t('m562')+$t('n2080')"/>
          </a-form-item>
          <a-form-item :label="$t('n1657')">
            <a-space>
              <a-input-number
                v-model:value="addFrom.upiMinAmount"
                :min="0"
                :max="99999998"
                style="width: 120px"
                @change="handleMinAmountChange(addFrom,'upiMinAmount','upiMaxAmount')"
                :placeholder="$t('m326')"
              />
              <span>~</span>
              <a-input-number
                v-model:value="addFrom.upiMaxAmount"
                :min="addFrom.upiMinAmount+1 || 0"
                :max="99999999"
                style="width: 120px"
                :placeholder="$t('m325')"
              />
            </a-space>
          </a-form-item>
          <a-form-item :label="$t('n1658')">
            <a-space>
              <a-input-number
                v-model:value="addFrom.bankMinAmount"
                :min="0"
                :max="99999998"
                style="width: 120px"
                @change="handleMinAmountChange(addFrom,'bankMinAmount','bankMaxAmount')"
                :placeholder="$t('m326')"
              />
              <span>~</span>
              <a-input-number
                v-model:value="addFrom.bankMaxAmount"
                :min="addFrom.bankMinAmount+1 || 0"
                :max="99999999"
                style="width: 120px"
                :placeholder="$t('m325')"
              />
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
      <br />
      <a-form-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-button :loading="isUpload || loading" type="primary" @click="addBtn">{{
          isEdit? $t('b8') : $t('add')
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddDalog"
          >{{ $t('l54') }}</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 查看日志 -->
   <a-modal
    v-model:open="showLogDialog"
    :title="$t('n1368')"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
   >
    <kycBankOnOffLog v-if="showLogDialog" :bankRecord="bankRecord" />
   </a-modal>
   <!-- 配置/修改金额限制 -->
   <a-modal
    v-model:open="showLimitDialog"
    :footer="null"
    width="400px"
    @cancel="closeLimitDialog"
   >
      <template #title>
        <h3 style="text-align: center;">
          {{ limitTypeMap[limitType]}}
        </h3>
      </template>
      <a-form
        :model="limitForm"
        :label-col="{ span: 10 }"
        :wrapper-col="{ span: 16 }"
      >
          <div v-if="limitType=='upi'">
            <a-form-item :label="$t('m326')" name="upiMinAmount">
                <a-input-number
                  v-model:value="limitForm.upiMinAmount"
                  :min="0"
                  :max="99999998"
                  @change="handleMinAmountChange(limitForm,'upiMinAmount','upiMaxAmount')"
                  style="width: 160px"
                  :placeholder="$t('m326')"
                />
            </a-form-item>
            <a-form-item :label="$t('m325')" name="upiMaxAmount">
                <a-input-number
                  v-model:value="limitForm.upiMaxAmount"
                  :min="Number(limitForm.upiMinAmount || 0)+1 || 0"
                  :max="99999999"
                  style="width: 160px"
                  :placeholder="$t('m325')"
                />
            </a-form-item>
          </div>
          <div v-if="limitType=='bank'" >
            <a-form-item :label="$t('m326')" name="bankMinAmount">
                <a-input-number
                  v-model:value="limitForm.bankMinAmount"
                  :min="0"
                  :max="99999998"
                  @change="handleMinAmountChange(limitForm,'bankMinAmount','bankMaxAmount')"
                  style="width: 160px"
                  :placeholder="$t('m326')"
                />
            </a-form-item>
            <a-form-item :label="$t('m325')" name="bankMaxAmount">
                <a-input-number
                  v-model:value="limitForm.bankMaxAmount"
                  :min="Number(limitForm.bankMinAmount || 0)+1 || 0"
                  :max="99999999"
                  style="width: 160px"
                  :placeholder="$t('m325')"
                />
            </a-form-item>
          </div>
          <div v-if="otpLimitField">
            <a-form-item :label="$t('m347')" :name="otpLimitField" required :validate-status="otpLimitEmpty && otpLimitTouched ? 'error' : ''">
                <a-input-number
                  v-model:value="limitForm[otpLimitField]"
                  @change="otpLimitTouched = true"
                  :min="1"
                  :precision="0"
                  style="width: 160px"
                  :placeholder="$t('m562')+$t('m347')"
                />
            </a-form-item>
          </div>
      </a-form>
      <a-form-item :wrapper-col="{ span: 24, offset: 6 }">
        <a-button :loading="loading" style="background-color: #fa8c16; border-color: #fa8c16" type="primary" @click="resetLimit(limitType)">{{
          $t('reset')
        }}</a-button>
        <a-button :loading="loading" :disabled="otpLimitEmpty" type="primary" style="margin-left: 50px" @click="updateLimit"
          >{{ $t('b9') }}</a-button
        >
      </a-form-item>
   </a-modal>
</template>
<script lang="ts" setup>
import {
  getKycBankCodeList,
  kycBankAdminList,
  addKycBank,
  updateKycBank,
  deleteKycBank,
  kycBankAdminKycBankUpdateControlSwitch,
} from "@/api/kycConfig.api";
import { message, Modal, Input } from "ant-design-vue";
import { onMounted, ref, h, computed } from "vue";
import Upload from '@/components/Upload/index.vue'
import kycBankOnOffLog from "./kycBankOnOffLog.vue";
import { SearchOutlined, AuditOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { usePagination } from "@/plugins/dataMap";
import { usePermission } from "@/hooks";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { color } from "echarts";
const { paginationConfig } = usePagination();
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
const { hasPermission }=usePermission()
const query= ref({
  asc:true,
  column:'sort',
  pageNo:1,
  pageSize:20,
  bankCode:undefined,
  // buyStatus:undefined,
  sellStatus:undefined,
  supportsBuyAppeal:undefined,
})
const columns:any = [
  // {
  //   title: t("e47"),
  //   align: "center",
  //   width: 90,
  //   customRender: ({ index }) => index + 1,
  // },
  {
    title: t('sort'),
    dataIndex: "sort",
    key: "sort",
    width:80,
    align:"center"
  },
  // {
  //   title: t('m581'),
  //   dataIndex: "bankName",
  //   key: "bankName",
  //   width:160,
  //   align:"center"
  // },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    width:120,
    align:"center",
  },
  {
    title: t('m583'),
    dataIndex: "iconUrl",
    key: "iconUrl",
    width:140,
    // ellipsis: true,
    align:"center",
  },
  {
    title: t('n1652'),
    dataIndex: "externalIconUrl",
    key: "externalIconUrl",
    width:140,
    // ellipsis: true,
    align:"center",
  },
  {
    title: t('n1653'),
    dataIndex: "externalBackgroundUrl",
    key: "externalBackgroundUrl",
    width:140,
    // ellipsis: true,
    align:"center",
  },
  // {
  //   title: t('m584'),
  //   dataIndex: "linkType",
  //   key: "linkType",
  //   width:200,
  //   align:"center"
  // },
  // {
  //   title: t('m701'),
  //   dataIndex: "apiUrl",
  //   key: "apiUrl",
  //   width:200,
  //   align:"center"
  // },
  // {
  //   title: t('m586'),
  //   dataIndex: "serviceCode",
  //   key: "serviceCode",
  //   width:200,
  //   align:"center"
  // },
  // {
  //   title: t('m702'),
  //   dataIndex: "linkUrl",
  //   key: "linkUrl",
  //   width:200,
  //   align:"center"
  // },
  // {
  //   title: t('m703'),
  //   dataIndex: "sourceType",
  //   key: "sourceType",
  //   width:120,
  //   align:"center"
  // },
  // {
  //   title: t('memberListC15'),
  //   dataIndex: "buyStatus",
  //   key: "buyStatus",
  //   width:120,
  //   align:"center"
  // },
  {
    title: t('memberListC16'),
    dataIndex: "sellStatus",
    key: "sellStatus",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1389")),
    dataIndex: "supportsBuyAppeal",
    key: "supportsBuyAppeal",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1390")),
    dataIndex: "supportsQuickWithdraw",
    key: "supportsQuickWithdraw",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1657")),
    dataIndex: "upiMinAmount",
    key: "upiMinAmount",
    width:180,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1391")),
    dataIndex: "supportsQuickWithdrawBank",
    key: "supportsQuickWithdrawBank",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1658")),
    dataIndex: "bankMinAmount",
    key: "bankMinAmount",
    width:180,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1392")),
    dataIndex: "supportPhonepeWakeUp",
    key: "supportPhonepeWakeUp",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1393")),
    dataIndex: "supportsExternalAppeal",
    key: "supportsExternalAppeal",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1394")),
    dataIndex: "supportsExternalSell",
    key: "supportsExternalSell",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1468")),
    dataIndex: "supportLotteryTicket",
    key: "supportLotteryTicket",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n2078")),
    dataIndex: "otpLimitEnabled",
    key: "otpLimitEnabled",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n2079")),
    dataIndex: "otpHourlySuccessLimit",
    key: "otpHourlySuccessLimit",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n2080")),
    dataIndex: "otpDailyFailLimit",
    key: "otpDailyFailLimit",
    width:120,
    align:"center"
  },
  // {
  //   title: h("div", {class:"toopTipStyle2"}, t("n1545")),
  //   dataIndex: "supportsAutoSell",
  //   key: "supportsAutoSell",
  //   width:120,
  //   align:"center"
  // },
  // {
  //   title: h("div", {class:"toopTipStyle2"}, t("n1531")),
  //   dataIndex: "supportsAutoBuy",
  //   key: "supportsAutoBuy",
  //   width:120,
  //   align:"center"
  // },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1651")),
    dataIndex: "needPinCode",
    key: "needPinCode",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1384")),
    dataIndex: "allowMultiLogin",
    key: "allowMultiLogin",
    width:120,
    align:"center"
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    width:100,
    align:"center",
  },
  {
    title: t("updateTime"),
    dataIndex: "updateTime",
    key: "updateTime",
    width: 140,
    align:"center",
  },
  // {
  //   title: t("remark"),
  //   dataIndex: "remark",
  //   key: "remark",
  //   width:200,
  //   align:"center",
  // },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    width:120,
    align:"center",
    fixed: 'right',
  },
];
const statusMap = <any>{
  0:t('l54'),
  1:t('l53'),
}
const sourceMap = <any>{
  0:t('m704'),
  1:'app',
  2:'H5',
}
const linkTypeMap = <any>{
  1:t('m588'),
  2:t('m589'),
}
const loading = ref(false);
const isUpload = ref(false);
const addDialog = ref(false);
const isMountUpload = ref(false);
const dataSource = ref([]);
const addChecked = ref<boolean>(false);
let isEdit = false;
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
// 新增/修改弹窗表单默认值
const getDefaultAddForm = () => ({
  id:undefined,
  bankName: undefined,
  bankCode: undefined,
  iconUrl: undefined,
  // apiUrl: undefined,
  // linkUrl: undefined,
  // buyStatus: undefined,
  sellStatus: undefined,
  sourceType: undefined,
  sort:undefined,
  supportsBuyAppeal:0,
  allowMultiLogin: 0, // 是否支持多点登陆
  supportsQuickWithdraw:1, // 是否支持快捷体现-UPI
  supportsQuickWithdrawBank:1, // 是否支持快捷体现-BANK
  supportPhonepeWakeUp:0, // 是否支持phonepe唤醒
  supportsExternalSell:0, // 是否支持外部卖出
  supportsExternalAppeal:0, // 是否支持外部申诉
  supportLotteryTicket:0, // 是否支持彩票工单
  // supportsAutoSell:0, // 假APP交易
  // supportsAutoBuy:0, //自动买入
  needPinCode:0, //是否需要PIN码
  externalIconUrl:undefined, //银行logo
  externalBackgroundUrl:undefined, //银行背景图
  upiMinAmount:0, //最小提现金额
  upiMaxAmount:0, //最大提现金额
  bankMinAmount:0, //最小提现金额
  bankMaxAmount:0, //最大提现金额
  otpLimitEnabled:0, //OTP限制使用
  otpHourlySuccessLimit:undefined, //OTP每小时成功次数
  otpDailyFailLimit:undefined, //OTP每天失败次数
});
const addFrom = ref<any>(getDefaultAddForm());

const getList = async () => {
  loading.value=true;
  paginationConfig.current = query.value.pageNo;
  paginationConfig.pageSize = query.value.pageSize;
  const res: any = await kycBankAdminList(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    paginationConfig.total = res.total;
    clearSelected();
  }
};

const search = () => {
  paginationConfig.current = 1;
  query.value.pageNo = 1;
  getList()
}
const resetQuery = () => {
  query.value = {
    asc:true,
    column:'',
    pageNo:1,
    pageSize:20,
    bankCode:undefined,
    // buyStatus:undefined,
    sellStatus:undefined,
    supportsBuyAppeal:undefined,
  };
  paginationConfig.pageSize = 20;
  paginationConfig.current =1;
  getList();
};


const showAddDialog = () => {
  isMountUpload.value = true;
  isEdit = false;
  addFrom.value = getDefaultAddForm();
  addChecked.value = false;
  addDialog.value = true;
};
const editDialog = async (value: any) => {
  selectedRow();
  const latest = await getLatestBank(value);
  if (!latest) {
    clearSelected();
    return;
  }
  isEdit = true;
  isMountUpload.value = true;
  addFrom.value = { ...latest };
  // 历史数据没有OTP限制使用时默认为否
  addFrom.value.otpLimitEnabled = addFrom.value.otpLimitEnabled ?? 0;
  addDialog.value = true;
};
const del = async (value: any) => {
  const { id } = value;
  loading.value = true;
  const res: any = await deleteKycBank({id}).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
  }
};
// const checkenable = async (value: any) =>{
//   const { id } = value;
//   let res;
//   loading.value=true;
//   if(value.active === '1'){
//       res = await enableCustomerServiceSystems(id).finally(()=>loading.value=false);
//   }else{
//       res = await disableCustomerServiceSystems(id).finally(()=>loading.value=false);
//   }
//   if (res && res.code === "1") {
//     message.success(value.active ==='0' ? t('m238') : t('m237'));
//     getList();
//   }
// }

const closeAddDalog = () => {
  addFrom.value = getDefaultAddForm();
  isEdit = false;
  addDialog.value = false;
  isMountUpload.value = false;
  isUpload.value = false;
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  paginationConfig.current = pag.current;
  paginationConfig.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList()
};
const addBtn = async () => {
  if(!addFrom.value.bankName){
    message.error(t('m562')+t('m581'));
    return;
  }
  if(!addFrom.value.bankCode){
    message.error(t('m562')+t('m582'));
    return;
  }
  if(!addFrom.value.sort){
    message.error(t('m562')+t('sort'));
    return;
  }
  if(!addFrom.value.iconUrl){
    message.error(t('m563')+t('m583'));
    return;
  }
  // if(!addFrom.value.apiUrl){
  //   message.error(t('m562')+t('m701'));
  //   return;
  // }
  // if(!addFrom.value.linkUrl){
  //   message.error(t('m562')+t('m702'));
  //   return;
  // }
  if(!addFrom.value.externalIconUrl){
    message.error(t('m563')+t('n1652'));
    return;
  }
  if(!addFrom.value.externalBackgroundUrl){
    message.error(t('m563')+t('n1653'));
    return;
  }
  // if(![0,1].includes(Number(addFrom.value.buyStatus)) || addFrom.value.buyStatus === null){
  //   message.error(t('m563')+t('memberListC15'));
  //   return;
  // }
  if(![0,1].includes(Number(addFrom.value.sellStatus)) || addFrom.value.sellStatus === null){
    message.error(t('m563')+t('memberListC16'));
    return;
  }
  if(![0,1,2].includes(Number(addFrom.value.sourceType))){
    message.error(t('m563')+t('m703'));
    return;
  }
  if(![0,1].includes(Number(addFrom.value.supportsExternalAppeal)) || addFrom.value.supportsExternalAppeal === null){
    message.error(t('m563')+t('n1393'));
    return;
  }
  if(![0,1].includes(Number(addFrom.value.needPinCode))){
    message.error(t('m563')+t('n1654'));
    return;
  }
  if(![0,1].includes(Number(addFrom.value.supportsExternalSell)) || addFrom.value.supportsExternalSell === null){
    message.error(t('m563')+t('n1394'));
    return;
  }
  if(![0,1].includes(Number(addFrom.value.supportLotteryTicket)) || addFrom.value.supportLotteryTicket === null){
    message.error(t('m563')+t('n1468'));
    return;
  }
  // if(![0,1].includes(Number(addFrom.value.supportsAutoSell)) || addFrom.value.supportsAutoSell === null){
  //   message.error(t('m563')+t('n1545'));
  //   return;
  // }
  // if(![0,1].includes(Number(addFrom.value.supportsAutoBuy)) || addFrom.value.supportsAutoBuy === null){
  //   message.error(t('m563')+t('n1531'));
  //   return;
  // }
  if((!addFrom.value.upiMinAmount  !== !addFrom.value.upiMaxAmount ) || (addFrom.value.upiMinAmount && addFrom.value.upiMaxAmount && addFrom.value.upiMinAmount < 100 )){
    message.error(t('m562')+t('n1659'));
    return;
  }
  if((!addFrom.value.bankMinAmount  !== !addFrom.value.bankMaxAmount ) || (addFrom.value.bankMinAmount && addFrom.value.bankMaxAmount && addFrom.value.bankMinAmount < 100 )){
    message.error(t('m562')+t('n1660'));
    return;
  }
  let res:any;
  if (isEdit) {
    const editFrom = buildEditForm(addFrom.value);
    if (!checkOtpLimit(editFrom)) return;
    loading.value=true;
    res = await updateKycBank(editFrom).finally(()=>loading.value=false);
  } else {
    if (!checkOtpLimit(addFrom.value)) return;
    loading.value=true;
    res = await addKycBank(addFrom.value).finally(()=>loading.value=false);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t('s7') : t('s8'));
    getList();
    closeAddDalog();
  }
};
// OTP次数须为正整数（接口可能返回字符串数字）
const hasOtpLimit = (v: any) => Number.isInteger(Number(v)) && Number(v) >= 1;
const hasOtpLimits = (form: any) => hasOtpLimit(form.otpHourlySuccessLimit) && hasOtpLimit(form.otpDailyFailLimit);
// OTP限制使用开启时两个次数必填；tip 为空时按字段提示
const checkOtpLimit = (form: any, tip?: string) => {
  if (form.otpLimitEnabled != 1) return true;
  if (!hasOtpLimit(form.otpHourlySuccessLimit)) {
    message.error(tip || t('m562')+t('n2079'));
    return false;
  }
  if (!hasOtpLimit(form.otpDailyFailLimit)) {
    message.error(tip || t('m562')+t('n2080'));
    return false;
  }
  return true;
}
// 修改接口是整单保存，列表数据可能已过期：打开弹窗、开启开关前先取该银行最新记录，并同步回列表
const latestLoading = ref(false);
// 取最新记录时最多查的页数，避免模糊匹配结果很多时请求过多
const LATEST_MAX_PAGES = 10;
// 取按 bankCode 查询的某一页，排序与列表一致，保证翻页结果稳定；请求失败或 code 非 1 时返回 undefined（拦截器已提示）
const fetchBankPage = async (bankCode: any, pageNo: number) => {
  const res: any = await kycBankAdminList({ pageNo, pageSize: 100, bankCode, column: 'sort', asc: true }).catch(() => undefined);
  if (!res || res.code !== "1") return;
  return { list: res.data || [], total: Number(res.total ?? res.data?.total ?? 0) };
}
// 按 id 在 bankCode 的查询结果里找记录；failed 表示请求失败且没找到，truncated 表示超过页数上限没查完
const findBank = async (record: any) => {
  const findIn = (list: any[]) => list.find((item: any) => item.id === record.id);
  const first = await fetchBankPage(record.bankCode, 1);
  if (!first) return { failed: true };
  let latest = findIn(first.list);
  // 每页条数以后端实际返回为准（可能被后端封顶）
  const perPage = first.list.length;
  if (latest || !perPage) return { latest };
  if (first.total) {
    // 有总数：并行取剩余页；先在成功的页里找，个别页失败不影响已找到的结果
    const realPageCount = Math.ceil(first.total / perPage);
    const pageCount = Math.min(realPageCount, LATEST_MAX_PAGES);
    const pages = await Promise.all(Array.from({ length: pageCount - 1 }, (_, i) => fetchBankPage(record.bankCode, i + 2)));
    latest = findIn(pages.flatMap((page: any) => page?.list || []));
    if (latest) return { latest };
    if (pages.some((page) => !page)) return { failed: true };
    return { truncated: realPageCount > pageCount };
  }
  // 没有总数：上一页是满页就继续取下一页
  let page: any = first;
  let pageNo = 2;
  for (; !latest && page.list.length >= perPage && pageNo <= LATEST_MAX_PAGES; pageNo++) {
    page = await fetchBankPage(record.bankCode, pageNo);
    if (!page) return { failed: true };
    latest = findIn(page.list);
  }
  return { latest, truncated: !latest && page.list.length >= perPage };
}
// 取最新记录并同步回列表行；pending 为预先发起的查询（失败时重新查一次）
const getLatestBank = async (record: any, pending?: Promise<any>) => {
  latestLoading.value = true;
  let result: any;
  try {
    result = await (pending || findBank(record));
    if (result.failed && pending) result = await findBank(record);
  } finally {
    latestLoading.value = false;
  }
  if (result.failed) return;
  // 超过页数上限没查完：记录可能仍存在，提示后按列表里的数据继续
  if (result.truncated) {
    message.warning(t('n2085'));
    return record;
  }
  if (!result.latest) {
    message.error(t('n2061'));
    return;
  }
  Object.assign(record, result.latest);
  return result.latest;
}
// OTP限制使用开关能否切到目标状态：已是目标状态（别人已改）或开启时未配置次数都不能
const checkOtpSwitch = (latest: any, s: number) => {
  if ((latest.otpLimitEnabled == 1 ? 1 : 0) === s) {
    message.warning(t('n2084'));
    return false;
  }
  if (s && !hasOtpLimits(latest)) {
    message.error(t('n2083'));
    return false;
  }
  return true;
}
// 修改接口提交的字段：原有字段 + 本需求新增的 OTP 三个字段
const editFields = ['id', 'sort', 'bankCode', 'bankName', 'sourceType', 'iconUrl', 'sellStatus', 'supportsBuyAppeal', 'allowMultiLogin',
  'supportsQuickWithdraw', 'supportsQuickWithdrawBank', 'supportPhonepeWakeUp', 'supportsExternalAppeal', 'supportsExternalSell',
  'supportLotteryTicket', 'needPinCode', 'externalIconUrl', 'externalBackgroundUrl', 'upiMinAmount', 'upiMaxAmount', 'bankMinAmount',
  'bankMaxAmount', 'otpLimitEnabled', 'otpHourlySuccessLimit', 'otpDailyFailLimit'];
const buildEditForm = (form: any) => {
  const editFrom: any = Object.fromEntries(editFields.map((key) => [key, form[key]]));
  editFrom.sourceType = Number(form.sourceType);
  editFrom.sellStatus = Number(form.sellStatus);
  editFrom.otpLimitEnabled = form.otpLimitEnabled ?? 0;
  return editFrom;
}
const kycBankCode=ref<any>('');
const allStatusMap: any = {
  sellStatus: {
    key: 1,
    title: (s: number) =>
      s
        ? t('n1371', { n: kycBankCode.value })
        : t('n1370', { n: kycBankCode.value }),
  },
  supportsBuyAppeal: {
    key: 3,
    title: (s: number) =>
      s
        ? t('n1373', { n: kycBankCode.value })
        : t('n1372', { n: kycBankCode.value }),
  },
  supportsQuickWithdraw: {
    key: 4,
    title: (s: number) =>
      s
        ? t('n1375', { n: kycBankCode.value })
        : t('n1374', { n: kycBankCode.value }),
  },
  supportsQuickWithdrawBank: {
    key: 5,
    title: (s: number) =>
      s
        ? t('n1377', { n: kycBankCode.value })
        : t('n1376', { n: kycBankCode.value }),
  },
  supportPhonepeWakeUp: {
    key: 6,
    title: (s: number) =>
      s
        ? t('n1379', { n: kycBankCode.value })
        : t('n1378', { n: kycBankCode.value }),
  },
  supportsExternalAppeal: {
    key: 7,
    title: (s: number) =>
      s
        ? t('n1381', { n: kycBankCode.value })
        : t('n1380', { n: kycBankCode.value }),
  },
  supportsExternalSell: {
    key: 8,
    title: (s: number) =>
      s
        ? t('n1383', { n: kycBankCode.value })
        : t('n1382', { n: kycBankCode.value }),
  },
  supportLotteryTicket: {
    key: 9,
    title: (s: number) =>
      s
        ? t('n1467', { n: kycBankCode.value })
        : t('n1466', { n: kycBankCode.value }),
  },
  otpLimitEnabled: {
    key: 12,
    title: (s: number) =>
      s
        ? t('n2082', { n: kycBankCode.value })
        : t('n2081', { n: kycBankCode.value }),
  },
  // supportsAutoSell: {
  //   key: 10,
  //   title: (s: number) =>
  //     s
  //       ? t('n1546', { n: kycBankCode.value })
  //       : t('n1547', { n: kycBankCode.value }),
  // },
  // supportsAutoBuy: {
  //   key: 11,
  //   title: (s: number) =>
  //     s
  //       ? t('n1532', { n: kycBankCode.value })
  //       : t('n1533', { n: kycBankCode.value }),
  // },
} as const;
const remark = ref<string>('');
//开关确认
const confirmBy = async (e: any, type: any, data: any) => {
  remark.value = '';
  const {id, bankCode } = data;
  kycBankCode.value = bankCode;
  const s = e ? 1 : 0;
  // OTP限制使用：按最新记录判断，避免别人已改过开关或刚配好次数时按旧数据操作。
  // 先静默发起查询（不提示、不改列表），弹确认框的同时取数，点确定时再统一校验
  const pending = type === 'otpLimitEnabled' ? findBank(data) : undefined;
  // 列表显示未配置次数而要开启：先等最新记录，确认可开启再弹确认框
  if (pending && s && !hasOtpLimits(data)) {
    const latest = await getLatestBank(data, pending);
    if (!latest || !checkOtpSwitch(latest, s)) return;
  }
  Modal.confirm({
    title: allStatusMap[type].title(s), 
  content: () =>
    h(
      'div',
      { style: { marginTop: '12px' } },
      [
        h(
          'span',
          {
            style: {
              marginRight: '4px',
              color: 'red',
            },
          },
          '*' // 备注
        ),
        h(
          'span',
          {
            style: {
              fontWeight: '500',
            },
          },
          t('remark') // 备注
        ),
        h(Input.TextArea, {
          value: remark.value,
          placeholder: t('m562')+t('remark'),
          rows: 4,
          maxLength: 200,
          showCount: true,
          onInput: (e: Event) => {
            remark.value = (e.target as HTMLTextAreaElement).value;
          },
        }),
      ]
    ),
    onOk: async () => {
      if(!remark.value?.trim()){
        message.error(t('m562')+t('remark'));
        return Promise.reject();
      }
      if (pending) {
        const latest = await getLatestBank(data, pending);
        // 取数失败或记录不存在：已提示，保留弹窗让用户重试或取消
        if (!latest) return Promise.reject();
        if (!checkOtpSwitch(latest, s)) return;
      }
      const key = type+'Remark';
      let res: any;
      loading.value = true;
      let updataForm = {
        id,
        controlSwitchType: allStatusMap[type]?.key,
        remark: remark.value,
        status: e ? 1 : 0,
      };
      res = await kycBankAdminKycBankUpdateControlSwitch(updataForm).finally(()=>loading.value=false);
      if (res && res.code === "1") {
        message.success(t("s10"));
        getList();
      }
    },
    onCancel() {
    },
  });
}
//查看日志
const showLogDialog = ref(false);
const bankRecord = ref<any>({
  bankCode: undefined,
  controlSwitchType: undefined,
});
const viewLog = (bankCode:any,type: any) => {
  bankRecord.value = {
    bankCode: bankCode,
    controlSwitchType: allStatusMap[type]?.key,
  };
  showLogDialog.value = true;
}
const startUpload = (val:any) => {
  if(val) isUpload.value = true;
}
const finishUpload = (val:any) => {
  if(val) isUpload.value = false;
}

//配置/修改限制金额
const showLimitDialog = ref(false);
const limitType = ref('');
const limitTypeMap = <any>{
  upi: t('n1657'),
  bank: t('n1658'),
  otpHourly: t('n2079'),
  otpDaily: t('n2080'),
}
// 各配置弹窗编辑的字段
const limitFieldsMap = <any>{
  upi: ['upiMinAmount', 'upiMaxAmount'],
  bank: ['bankMinAmount', 'bankMaxAmount'],
  otpHourly: ['otpHourlySuccessLimit'],
  otpDaily: ['otpDailyFailLimit'],
}
// OTP 次数弹窗当前编辑的字段；为空时确定按钮置灰，改动过输入框后为空才标红（点「配置」打开时本就没有值，不标红）
const otpLimitField = computed(() => ['otpHourly', 'otpDaily'].includes(limitType.value) ? limitFieldsMap[limitType.value][0] : '');
const otpLimitEmpty = computed(() => !!otpLimitField.value && !hasOtpLimit(limitForm.value[otpLimitField.value]));
const otpLimitTouched = ref(false);
// 打开配置弹窗时的列表行，重置 OTP 次数时恢复为它的值
let limitRecord: any = {};
const limitForm = ref<any>({
  upiMinAmount: 0,
  upiMaxAmount: 0,
  bankMinAmount: 0,
  bankMaxAmount: 0,
});
const handleMinAmountChange = (
  form: any,
  minKey: any,
  maxKey: any,
  offset = 1
) => {
  const minAmount = Number(form[minKey] || 0);
  const maxAmount = Number(form[maxKey] || 0);

  // max >= min 时不改变
  // max < min 时，max = min + offset
  if (maxAmount < minAmount) {
    if(minAmount == 0 || minAmount == null) return;
    form[maxKey] = minAmount + offset;
  }
};
const showEditLimit = async (type: any, data: any) => {
  const latest = await getLatestBank(data);
  if (!latest) return;
  showLimitDialog.value = true;
  limitType.value = type;
  limitRecord = data;
  otpLimitTouched.value = false;
  addFrom.value = { ...latest };
  const {upiMinAmount,upiMaxAmount,bankMinAmount,bankMaxAmount,otpHourlySuccessLimit,otpDailyFailLimit} = latest;
  limitForm.value = {
    upiMinAmount,
    upiMaxAmount,
    bankMinAmount,
    bankMaxAmount,
    otpHourlySuccessLimit,
    otpDailyFailLimit,
  }
}

const resetLimit = (type: any) => {
    if(type === 'upi'){
      limitForm.value.upiMinAmount = 0;
      limitForm.value.upiMaxAmount = 0;
    }else if(type === 'bank'){
      limitForm.value.bankMinAmount = 0;
      limitForm.value.bankMaxAmount = 0;
    }else if(otpLimitField.value){
      // 恢复为列表当前值，没有值时为 1
      const current = limitRecord[otpLimitField.value];
      limitForm.value[otpLimitField.value] = hasOtpLimit(current) ? Number(current) : 1;
    }
}

const updateLimit = async () => {
  // 只回写当前弹窗编辑的字段
  limitFieldsMap[limitType.value].forEach((key: string) => {
    addFrom.value[key] = limitForm.value[key];
  });
  // 只校验当前弹窗编辑的金额，避免历史数据里不合规的其它金额拦住本次保存
  if(limitType.value === 'upi' && ((!addFrom.value.upiMinAmount  !== !addFrom.value.upiMaxAmount ) || (addFrom.value.upiMinAmount && addFrom.value.upiMaxAmount && addFrom.value.upiMinAmount < 100 ))){
    message.error(t('m562')+t('n1659'));
    return;
  }
  if(limitType.value === 'bank' && ((!addFrom.value.bankMinAmount  !== !addFrom.value.bankMaxAmount ) || (addFrom.value.bankMinAmount && addFrom.value.bankMaxAmount && addFrom.value.bankMinAmount < 100 ))){
    message.error(t('m562')+t('n1660'));
    return;
  }
  const editFrom = buildEditForm(addFrom.value);
  // OTP 次数为空时确定按钮已置灰，这里兜底
  if (otpLimitEmpty.value) return;
  // 开关已开启但次数缺失时提示先配置次数，而不是让后端返回英文报错
  if (!checkOtpLimit(editFrom, t('n2083'))) return;
  loading.value = true;
  const res: any = await updateKycBank(editFrom).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    message.success(t("s10"));
    closeLimitDialog();
    getList();
  }
}

const closeLimitDialog = () => {
  showLimitDialog.value = false;
  limitType.value = '';
  limitForm.value = {
    upiMinAmount: 0,
    upiMaxAmount: 0,
    bankMinAmount: 0,
    bankMaxAmount: 0,
    otpHourlySuccessLimit: null,
    otpDailyFailLimit: null,
  };
}

const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};
onMounted(() => {
  getGroupList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style scoped lang="less">
:deep(.light-green-switch) {
  &.ant-switch-checked {
    background-color: rgba(82, 196, 26, 0.65);
    &:hover {
      background-color: #3fcf57;
    }
  }
  .ant-switch-inner-checked,.ant-switch-inner-unchecked {
    font-size: 11px;
  }
}
.showLogIcon{
  font-size: 16px;
  margin-left: 5px;
  cursor: pointer;
  vertical-align: middle;
}
</style>
