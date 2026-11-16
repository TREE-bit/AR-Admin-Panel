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
        <a-button type="primary" @click="showAddDialog"   v-permission="'admin:fakeAppKycBankAdmin:addFakeAppKycBank'">{{ $t('add') }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="paginationConfig"
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'manualBuyUpiStatus'">
        <span>
          {{ $t('n1685')}}
          <tipTemplate :info="$t('n1742')"/>
        </span>
      </template>
      <template v-if="column.key === 'autoBuyUpiStatus'">
        <span>
          {{ $t('n1686')}}
          <tipTemplate :info="$t('n1743')"/>
        </span>
      </template>
      <template v-if="column.key === 'manualBuyBankStatus'">
        <span>
          {{ $t('n1687')}}
          <tipTemplate :info="$t('n1744')"/>
        </span>
      </template>
      <template v-if="column.key === 'autoBuyBankStatus'">
        <span>
          {{ $t('n1688')}}
          <tipTemplate :info="$t('n1745')"/>
        </span>
      </template>
      <template v-if="column.key === 'sellStatus'">
        <span>
          {{ $t('memberListC16')}}
          <tipTemplate :info="$t('n1746')"/>
        </span>
      </template>
      <template v-if="column.key === 'autoBuyStatus'">
        <span>
          {{ $t('n1707')}}
          <tipTemplate :info="$t('n1747')"/>
        </span>
      </template>
      <template v-if="column.key === 'forceGrantPermission'">
        <span>
          {{ $t('n1526')}}
          <tipTemplate :info="$t('n2096')"/>
        </span>
      </template>
      <template v-if="column.key === 'buyUpiMinAmount'">
        <span>
          {{ $t('n1657')}}
          <tipTemplate :info="$t('n1748')"/>
        </span>
      </template>
      <template v-if="column.key === 'buyBankMinAmount'">
        <span>
          {{ $t('n1658')}}
          <tipTemplate :info="$t('n1749')"/>
        </span>
      </template>
    </template>
    <template #bodyCell="{ column, record }">
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
      <!-- <template v-if="column.key === 'fakeAppSupportWakeUp'">
        {{ $getMapItem(fakeAppSupportWakeUpMap,record.fakeAppSupportWakeUp) }}
      </template> -->
      <template v-if="column.key === 'buyUpiMinAmount'">
        <span style="color: green;" v-if="record.buyUpiMinAmount && record.buyUpiMaxAmount">
          {{ record.buyUpiMinAmount }} - {{ record.buyUpiMaxAmount }}
          <a-button type="link" style="padding:0" danger @click="showEditLimit('upi',record)">{{ $t('b8') }}</a-button>
        </span>
        <span v-else>
          {{ $t('n1113') }}
          <a-button type="link" @click="showEditLimit('upi',record)">{{ $t('m753') }}</a-button>
        </span>
      </template>
      <template v-if="column.key === 'buyBankMinAmount'">
        <span style="color: green;" v-if="record.buyBankMinAmount && record.buyBankMaxAmount">
          {{ record.buyBankMinAmount }} - {{ record.buyBankMaxAmount }}
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
          :disabled="!hasPermission('admin:fakeAppKycBankAdmin:updateFakeAppKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.sellStatus == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'sellStatus')"
          />
      </template>
      <!-- <template v-if="column.key === 'internalBuyAppeal'">
        <a-switch
          class="light-green-switch"
          :checked="record.internalBuyAppeal == 1 ? true : false"
          @change="confirmBy($event,'internalBuyAppeal',record)"
          :disabled="!hasPermission('admin:fakeAppKycBankAdmin:updateFakeAppKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.internalBuyAppeal == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'internalBuyAppeal')"
          />
      </template> -->
      <template v-if="column.key === 'manualBuyBankStatus'">
        <a-switch
          class="light-green-switch"
          :checked="record.manualBuyBankStatus == 1 ? true : false"
          @change="confirmBy($event,'manualBuyBankStatus',record)"
          :disabled="!hasPermission('admin:fakeAppKycBankAdmin:updateFakeAppKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
            size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.manualBuyBankStatus == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'manualBuyBankStatus')"
          />
      </template>
      <template v-if="column.key === 'autoBuyBankStatus'">
        <a-switch
          class="light-green-switch"
          :checked="record.autoBuyBankStatus == 1 ? true : false"
          @change="confirmBy($event,'autoBuyBankStatus',record)"
          :disabled="!hasPermission('admin:fakeAppKycBankAdmin:updateFakeAppKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
            size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.autoBuyBankStatus == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'autoBuyBankStatus')"
          />
      </template>
      <template v-if="column.key === 'fillUtr'">
        <a-switch
          class="light-green-switch"
          :checked="record.fillUtr == 1 ? true : false"
          @change="confirmBy($event,'fillUtr',record)"
          :disabled="!hasPermission('admin:fakeAppKycBankAdmin:updateFakeAppKycBank') || record.utrRequired == 1"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
            size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.fillUtr == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'fillUtr')"
          />
      </template>
      <template v-if="column.key === 'forceGrantPermission'">
        <a-switch
          class="light-green-switch"
          :checked="record.forceGrantPermission == 1 ? true : false"
          @change="confirmBy($event,'forceGrantPermission',record)"
          :disabled="!hasPermission('admin:fakeAppKycBankAdmin:updateFakeAppKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
            size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.forceGrantPermission == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'forceGrantPermission')"
          />
      </template>
      <template v-if="column.key === 'utrRequired'">
        {{ record.utrRequired == 1 ? $t('yes') : $t('no') }}
      </template>
      <template v-if="column.key === 'autoBuyStatus'">
        <a-switch
          class="light-green-switch"
          :checked="record.autoBuyStatus == 1 ? true : false"
          @change="confirmBy($event,'autoBuyStatus',record)"
          :disabled="!hasPermission('admin:fakeAppKycBankAdmin:updateFakeAppKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
            size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.autoBuyStatus == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'autoBuyStatus')"
          />
      </template>
      <template v-if="column.key === 'manualBuyUpiStatus'">
        <a-switch
          class="light-green-switch"
          :checked="record.manualBuyUpiStatus == 1 ? true : false"
          @change="confirmBy($event,'manualBuyUpiStatus',record)"
          :disabled="!hasPermission('admin:fakeAppKycBankAdmin:updateFakeAppKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.manualBuyUpiStatus == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'manualBuyUpiStatus')"
          />
      </template>
      <template v-if="column.key === 'autoBuyUpiStatus'">
        <a-switch
          class="light-green-switch"
          :checked="record.autoBuyUpiStatus == 1 ? true : false"
          @change="confirmBy($event,'autoBuyUpiStatus',record)"
          :disabled="!hasPermission('admin:fakeAppKycBankAdmin:updateFakeAppKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.autoBuyUpiStatus == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'autoBuyUpiStatus')"
          />
      </template>
      <template v-if="column.key === 'updateBy'">
        <a-tooltip>
          <template #title>{{ record.updateBy || record.createBy }}</template>
          <div class="toopTipStyle2">{{ record.updateBy || record.createBy }}</div>
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
          v-permission="'admin:fakeAppKycBankAdmin:updateFakeAppKycBank'"
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
          v-permission="'admin:fakeAppKycBankAdmin:deleteFakeAppKycBank'"
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
          <!-- <a-form-item :label="$t('n1723')" name="fakeAppSupportWakeUp" :rules="[{ required: true, message: ''}]">
            <a-select
              v-model:value="addFrom.fakeAppSupportWakeUp"
              style="width: 100%"
              :placeholder="$t('m563')+$t('n1723')"
              :options="Object.entries(fakeAppSupportWakeUpMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
            ></a-select>
          </a-form-item> -->
        </a-col>
        <a-col class="content-box-gray" :span="12">
          <a-form-item :label="$t('memberListC16')" name="sellStatus" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.sellStatus" :disabled="isEdit">
              <a-radio :value="1"> {{  $t('l53') }} </a-radio>
              <a-radio :value="0"> {{  $t('l54') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1707')" name="autoBuyStatus" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.autoBuyStatus" :disabled="isEdit">
              <a-radio :value="1"> {{  $t('l53') }} </a-radio>
              <a-radio :value="0"> {{  $t('l54') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1685')" name="manualBuyUpiStatus" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.manualBuyUpiStatus" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1686')" name="autoBuyUpiStatus" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.autoBuyUpiStatus" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1687')" name="manualBuyBankStatus" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.manualBuyBankStatus" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1688')" name="autoBuyBankStatus" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.autoBuyBankStatus" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1751')" name="fillUtr" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.fillUtr" :disabled="isEdit || addFrom.utrRequired == 1">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1526')" name="forceGrantPermission" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.forceGrantPermission" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1750')" name="utrRequired" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.utrRequired" @change="addFrom.utrRequired == 1 ? addFrom.fillUtr = 1 : void(0)" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- <a-form-item :label="$t('n1389')" name="internalBuyAppeal" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.internalBuyAppeal" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item :label="$t('n1657')">
            <a-space>
              <a-input-number
                v-model:value="addFrom.buyUpiMinAmount"
                :min="0"
                :max="99999998"
                style="width: 120px"
                @change="handleMinAmountChange(addFrom,'buyUpiMinAmount','buyUpiMaxAmount')"
                :placeholder="$t('m326')"
              />
              <span>~</span>
              <a-input-number
                v-model:value="addFrom.buyUpiMaxAmount"
                :min="addFrom.buyUpiMinAmount+1 || 0"
                :max="99999999"
                style="width: 120px"
                :placeholder="$t('m325')"
              />
            </a-space>
            <div style="color: red" v-if="addFrom.buyUpiMinAmount == null || addFrom.buyUpiMaxAmount == null">{{ $t('n1659') }}</div>
          </a-form-item>
          <a-form-item :label="$t('n1658')">
            <a-space>
              <a-input-number
                v-model:value="addFrom.buyBankMinAmount"
                :min="0"
                :max="99999998"
                style="width: 120px"
                @change="handleMinAmountChange(addFrom,'buyBankMinAmount','buyBankMaxAmount')"
                :placeholder="$t('m326')"
              />
              <span>~</span>
              <a-input-number
                v-model:value="addFrom.buyBankMaxAmount"
                :min="addFrom.buyBankMinAmount+1 || 0"
                :max="99999999"
                style="width: 120px"
                :placeholder="$t('m325')"
              />
            </a-space>
            <div style="color: red" v-if="addFrom.buyBankMinAmount == null || addFrom.buyBankMaxAmount == null">{{ $t('n1660') }}</div>
          </a-form-item>
        </a-col>
      </a-row>
      <br />
      <a-form-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-button :loading="isUpload || loading" 
        :disabled="addFrom.buyUpiMinAmount == null || addFrom.buyUpiMaxAmount == null || addFrom.buyBankMinAmount == null || addFrom.buyBankMaxAmount == null"
         type="primary" @click="addBtn">{{
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
            <a-form-item :label="$t('m326')" name="buyUpiMinAmount">
                <a-input-number
                  v-model:value="limitForm.buyUpiMinAmount"
                  :min="0"
                  :max="99999998"
                  @change="handleMinAmountChange(limitForm,'buyUpiMinAmount','buyUpiMaxAmount')"
                  style="width: 160px"
                  :placeholder="$t('m326')"
                />
                <div style="color: red" v-if="limitForm.buyUpiMinAmount == null">{{ $t('m562') +$t('m326') }}</div>
            </a-form-item>
            <a-form-item :label="$t('m325')" name="buyUpiMaxAmount">
                <a-input-number
                  v-model:value="limitForm.buyUpiMaxAmount"
                  :min="Number(limitForm.buyUpiMinAmount || 0)+1 || 0"
                  :max="99999999"
                  style="width: 160px"
                  :placeholder="$t('m325')"
                />
                <div style="color: red" v-if="limitForm.buyUpiMaxAmount == null">{{ $t('m562') +$t('m325') }}</div>
            </a-form-item>
          </div>
          <div v-if="limitType=='bank'" >
            <a-form-item :label="$t('m326')" name="buyBankMinAmount">
                <a-input-number
                  v-model:value="limitForm.buyBankMinAmount"
                  :min="0"
                  :max="99999998"
                  @change="handleMinAmountChange(limitForm,'buyBankMinAmount','buyBankMaxAmount')"
                  style="width: 160px"
                  :placeholder="$t('m326')"
                />
                <div style="color: red" v-if="limitForm.buyBankMinAmount == null">{{ $t('m562' )+$t('m326') }}</div>
            </a-form-item>
            <a-form-item :label="$t('m325')" name="buyBankMaxAmount">
                <a-input-number
                  v-model:value="limitForm.buyBankMaxAmount"
                  :min="Number(limitForm.buyBankMinAmount || 0)+1 || 0"
                  :max="99999999"
                  style="width: 160px"
                  :placeholder="$t('m325')"
                />
                <div style="color: red" v-if="limitForm.buyBankMaxAmount == null">{{ $t('m562' )+$t('m325') }}</div>
            </a-form-item>
          </div>
      </a-form>
      <a-form-item :wrapper-col="{ span: 24, offset: 6 }">
        <a-button :loading="loading" style="background-color: #fa8c16; border-color: #fa8c16" type="primary" @click="resetLimit(limitType)">{{
          $t('reset')
        }}</a-button>
        <a-button :loading="loading" type="primary" style="margin-left: 50px" @click="updateLimit"
          :disabled="limitForm.buyBankMinAmount == null || limitForm.buyBankMaxAmount == null || limitForm.buyUpiMinAmount == null || limitForm.buyUpiMaxAmount == null"
          >{{ $t('b9') }}</a-button
        >
      </a-form-item>
   </a-modal>
</template>
<script lang="ts" setup>
import {
  fakeAppKycBankAdminKycBankListPage,
  fakeAppKycBankAdminListPage,
  fakeAppKycBankAdminAdd,
  fakeAppKycBankAdminUpdate,
  fakeAppKycBankAdminDelete,
  fakeAppKycBankAdminUpdateControlSwitch,
} from "@/api";
import { message, Modal, Input } from "ant-design-vue";
import { onMounted, ref, h } from "vue";
import Upload from '@/components/Upload/index.vue'
import kycBankOnOffLog from "./fackAppBankOnOffLog.vue";
import { SearchOutlined, AuditOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { usePagination } from "@/plugins/dataMap";
import { usePermission } from "@/hooks";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
const { paginationConfig } = usePagination();
const { getTabH } = useTabHeight(340);
const { t } = useI18n();
const { hasPermission }=usePermission()
const fakeAppSupportWakeUpMap:any = {
  0:t('n1724'),//不唤醒
  1:t('n1725'),//唤醒到首页
  2:t('n1726'),//唤醒到支付页
}
const query= ref({
  asc:true,
  column:'sort',
  pageNo:1,
  pageSize:20,
  bankCode:undefined,
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
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    width:120,
    align:"center",
  },
  // {
  //   title: t('n1723'),
  //   dataIndex: "fakeAppSupportWakeUp",
  //   key: "fakeAppSupportWakeUp",
  //   width:140,
  //   align:"center",
  // },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1685")),
    dataIndex: "manualBuyUpiStatus",
    key: "manualBuyUpiStatus",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1686")),
    dataIndex: "autoBuyUpiStatus",
    key: "autoBuyUpiStatus",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1687")),
    dataIndex: "manualBuyBankStatus",
    key: "manualBuyBankStatus",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1688")),
    dataIndex: "autoBuyBankStatus",
    key: "autoBuyBankStatus",
    width:120,
    align:"center"
  },
  {
    title: t('memberListC16'),
    dataIndex: "sellStatus",
    key: "sellStatus",
    width:120,
    align:"center"
  },
  // {
  //   title: h("div", {class:"toopTipStyle2"}, t("n1389")),
  //   dataIndex: "internalBuyAppeal",
  //   key: "internalBuyAppeal",
  //   width:120,
  //   align:"center"
  // },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1707")),
    dataIndex: "autoBuyStatus",
    key: "autoBuyStatus",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1751")),
    dataIndex: "fillUtr",
    key: "fillUtr",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1526")),
    dataIndex: "forceGrantPermission",
    key: "forceGrantPermission",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1750")),
    dataIndex: "utrRequired",
    key: "utrRequired",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1657")),
    dataIndex: "buyUpiMinAmount",
    key: "buyUpiMinAmount",
    width:180,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1658")),
    dataIndex: "buyBankMinAmount",
    key: "buyBankMinAmount",
    width:180,
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
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    width:120,
    align:"center",
    fixed: 'right',
  },
];
const loading = ref(false);
const isUpload = ref(false);
const addDialog = ref(false);
const isMountUpload = ref(false);
const dataSource = ref([]);
const addChecked = ref<boolean>(false);
let isEdit = false;
const addFrom = ref<any>({
  bankName: undefined,
  bankCode: undefined,
  // fakeAppSupportWakeUp: undefined,
  manualBuyUpiStatus: 1,
  manualBuyBankStatus: 1,
  autoBuyBankStatus: 1,
  fillUtr: 1,
  forceGrantPermission: 0,
  utrRequired: 0,
  autoBuyUpiStatus: 1,
  sellStatus: undefined,
  autoBuyStatus:undefined,
  sort:undefined,
  // internalBuyAppeal:0,
  buyUpiMinAmount:0, //最小提现金额
  buyUpiMaxAmount:0, //最大提现金额
  buyBankMinAmount:0, //最小提现金额
  buyBankMaxAmount:0, //最大提现金额
});

const getList = async () => {
  loading.value=true;
  paginationConfig.current = query.value.pageNo;
  paginationConfig.pageSize = query.value.pageSize;
  const res: any = await fakeAppKycBankAdminListPage(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    paginationConfig.total = res.data.total;
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
    column:'sort',
    pageNo:1,
    pageSize:20,
    bankCode:undefined,
  };
  paginationConfig.pageSize = 20;
  paginationConfig.current =1;
  getList();
};


const showAddDialog = () => {
  isMountUpload.value = true;
  isEdit = false;
  addFrom.value = {
    bankName: undefined,
    bankCode: undefined,
    // fakeAppSupportWakeUp: undefined,
    sellStatus: undefined,
    autoBuyStatus:undefined,
    sort:undefined,
    // internalBuyAppeal:0,
    autoBuyUpiStatus:1,
    autoBuyBankStatus:1,
    fillUtr:1,
    forceGrantPermission:0,
    utrRequired:0,
    manualBuyUpiStatus:1,
    manualBuyBankStatus:1,
    buyUpiMinAmount:0,
    buyUpiMaxAmount:0, 
    buyBankMinAmount:0,
    buyBankMaxAmount:0,
  };
  addChecked.value = false;
  addDialog.value = true;
};
const editDialog = (value: any) => {
  selectedRow();
  isEdit = true;
  isMountUpload.value = true;
  addFrom.value = JSON.parse(JSON.stringify(value));
  addDialog.value = true;
};
const del = async (value: any) => {
  const { id } = value;
  loading.value = true;
  const res: any = await fakeAppKycBankAdminDelete({id}).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
  }
};

const closeAddDalog = () => {
  addFrom.value = {
    bankName: undefined,
    bankCode: undefined,
    // fakeAppSupportWakeUp: undefined,
    sellStatus: undefined,
    autoBuyStatus:undefined,
    sort:undefined,
    // internalBuyAppeal:0,
    autoBuyUpiStatus:1,
    autoBuyBankStatus:1,
    fillUtr:1,
    forceGrantPermission:0,
    utrRequired:0,
    manualBuyUpiStatus:1,
    manualBuyBankStatus:1,
    buyUpiMinAmount:0,
    buyUpiMaxAmount:0, 
    buyBankMinAmount:0,
    buyBankMaxAmount:0,
  };
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
  // if(!addFrom.value.fakeAppSupportWakeUp){
  //   message.error(t('m563')+t('n1723'));
  //   return;
  // }
  if(![0,1].includes(Number(addFrom.value.sellStatus)) || addFrom.value.sellStatus === null){
    message.error(t('m563')+t('memberListC16'));
    return;
  }
  if(![0,1].includes(Number(addFrom.value.autoBuyStatus)) || addFrom.value.autoBuyStatus === null){
    message.error(t('m563')+t('n1707'));
    return;
  }
  if((!addFrom.value.buyUpiMinAmount  !== !addFrom.value.buyUpiMaxAmount ) || (addFrom.value.buyUpiMinAmount && addFrom.value.buyUpiMaxAmount && addFrom.value.buyUpiMinAmount < 100 )){
    message.error(t('m562')+t('n1659'));
    return;
  }
  if((!addFrom.value.buyBankMinAmount  !== !addFrom.value.buyBankMaxAmount ) || (addFrom.value.buyBankMinAmount && addFrom.value.buyBankMaxAmount && addFrom.value.buyBankMinAmount < 100 )){
    message.error(t('m562')+t('n1660'));
    return;
  }
  let res:any;
  loading.value=true;
  if (isEdit) {
    const {
      bankCode, 
      sort, 
      bankName, 
      // fakeAppSupportWakeUp, 
      sellStatus, 
      autoBuyStatus, 
      autoBuyBankStatus, 
      fillUtr,
      forceGrantPermission,
      utrRequired,
      autoBuyUpiStatus, 
      manualBuyBankStatus, 
      manualBuyUpiStatus, 
      buyUpiMinAmount, 
      buyUpiMaxAmount, 
      buyBankMinAmount, 
      buyBankMaxAmount
    } = addFrom.value
    const editFrom={
      sort, 
      bankCode, 
      bankName, 
      // fakeAppSupportWakeUp, 
      sellStatus:Number(sellStatus), 
      autoBuyStatus: Number(autoBuyStatus), 
      autoBuyBankStatus, 
      fillUtr,
      forceGrantPermission,
      utrRequired,
      autoBuyUpiStatus, 
      manualBuyBankStatus, 
      manualBuyUpiStatus, 
      buyUpiMinAmount, 
      buyUpiMaxAmount, 
      buyBankMinAmount, 
      buyBankMaxAmount
    };
    res = await fakeAppKycBankAdminUpdate(editFrom).finally(()=>loading.value=false);
  } else {
    res = await fakeAppKycBankAdminAdd(addFrom.value).finally(()=>loading.value=false);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t('s7') : t('s8'));
    getList();
    closeAddDalog();
  }
};
const kycBankCode=ref<any>('');
const allStatusMap: any = {
  sellStatus: {
    key: 1,
    title: (s: number) =>
      s
        ? t('n1371', { n: kycBankCode.value })
        : t('n1370', { n: kycBankCode.value }),
  },
  manualBuyBankStatus: {
    key: 2,
    title: (s: number) =>
      s
        ? t('n1694', { n: kycBankCode.value })
        : t('n1693', { n: kycBankCode.value }),
  },
  manualBuyUpiStatus: {
    key: 3,
    title: (s: number) =>
      s
        ? t('n1690', { n: kycBankCode.value })
        : t('n1689', { n: kycBankCode.value }),
  },
  // internalBuyAppeal: {
  //   key: 4,
  //   title: (s: number) =>
  //     s
  //       ? t('n1373', { n: kycBankCode.value })
  //       : t('n1372', { n: kycBankCode.value }),
  // },
  autoBuyBankStatus: {
    key: 5,
    title: (s: number) =>
      s
        ? t('n1696', { n: kycBankCode.value })
        : t('n1695', { n: kycBankCode.value }),
  },
  autoBuyUpiStatus: {
    key: 6,
    title: (s: number) =>
      s
        ? t('n1692', { n: kycBankCode.value })
        : t('n1691', { n: kycBankCode.value }),
  },
  autoBuyStatus: {
    key: 7,

    title: (s: number) =>
      s
        ? t('n1706', { n: kycBankCode.value })
        : t('n1705', { n: kycBankCode.value }),
  },
  fillUtr: {
    key: 8,

    title: (s: number) =>
      s
        ? t('n1738', { n: kycBankCode.value })
        : t('n1737', { n: kycBankCode.value }),
  },
  forceGrantPermission: {
    key: 9,

    title: (s: number) =>
      s
        ? t('n2095', { n: kycBankCode.value })
        : t('n2094', { n: kycBankCode.value }),
  },
} as const;
const remark = ref<string>('');
//开关确认
const confirmBy = async (e: any, type: any, data: any) => {
  remark.value = '';
  const {bankCode } = data;
  kycBankCode.value = bankCode;
  const s = e ? 1 : 0;
  Modal.confirm({
    title: allStatusMap[type].title(s), 
  content: () =>
    h(
      'div',
      { style: { marginTop: '12px' } },
      [
        // 开启提权前提示和开发确认
        type === 'forceGrantPermission' && s === 1
          ? h(
              'div',
              {
                style: {
                  color: 'red',
                  fontWeight: '500',
                  marginBottom: '8px',
                },
              },
              t('n2099')
            )
          : null,
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
      const key = type+'Remark';
      let res: any;
      loading.value = true;
      let updataForm = {
        bankCode,
        controlSwitchType: allStatusMap[type]?.key,
        remark: remark.value,
        status: e ? 1 : 0,
      };
      res = await fakeAppKycBankAdminUpdateControlSwitch(updataForm).finally(()=>loading.value=false);
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
}
const limitForm = ref<any>({
  buyUpiMinAmount: 0,
  buyUpiMaxAmount: 0,
  buyBankMinAmount: 0,
  buyBankMaxAmount: 0,
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
const showEditLimit = (type: any, data: any) => {
  showLimitDialog.value = true;
  limitType.value = type;
  addFrom.value =  JSON.parse(JSON.stringify(data));
  const {buyUpiMinAmount,buyUpiMaxAmount,buyBankMinAmount,buyBankMaxAmount} = data;
  limitForm.value = {
    buyUpiMinAmount,
    buyUpiMaxAmount,
    buyBankMinAmount,
    buyBankMaxAmount,
  }
}

const resetLimit = (type: any) => {
    if(type === 'upi'){
      limitForm.value.buyUpiMinAmount = 0;
      limitForm.value.buyUpiMaxAmount = 0;
    }else if(type === 'bank'){
      limitForm.value.buyBankMinAmount = 0;
      limitForm.value.buyBankMaxAmount = 0;
    }
}

const updateLimit = async () => {
  addFrom.value.buyUpiMinAmount = limitForm.value.buyUpiMinAmount;
  addFrom.value.buyUpiMaxAmount = limitForm.value.buyUpiMaxAmount;
  addFrom.value.buyBankMinAmount = limitForm.value.buyBankMinAmount;
  addFrom.value.buyBankMaxAmount = limitForm.value.buyBankMaxAmount;
  const {
    apiUrl,
    bankCode, 
    sort, 
    bankName, 
    // fakeAppSupportWakeUp, 
    sellStatus, 
    autoBuyStatus, 
    manualBuyBankStatus, 
    manualBuyUpiStatus, 
    autoBuyBankStatus, 
    fillUtr,
    forceGrantPermission,
    utrRequired,
    autoBuyUpiStatus, 
    buyUpiMinAmount, 
    buyUpiMaxAmount, 
    buyBankMinAmount, 
    buyBankMaxAmount 
  } = addFrom.value
  const editFrom={
    apiUrl, 
    sort, 
    bankCode, 
    bankName, 
    // fakeAppSupportWakeUp, 
    sellStatus:Number(sellStatus), 
    autoBuyStatus:Number(autoBuyStatus), 
    manualBuyBankStatus, 
    manualBuyUpiStatus, 
    autoBuyBankStatus, 
    fillUtr,
    forceGrantPermission,
    utrRequired,
    autoBuyUpiStatus, 
    buyUpiMinAmount, 
    buyUpiMaxAmount, 
    buyBankMinAmount, 
    buyBankMaxAmount
  };
  if((!addFrom.value.buyUpiMinAmount  !== !addFrom.value.buyUpiMaxAmount ) || (addFrom.value.buyUpiMinAmount && addFrom.value.buyUpiMaxAmount && addFrom.value.buyUpiMinAmount < 100 )){
    message.error(t('m562')+t('n1659'));
    return;
  }
  if((!addFrom.value.buyBankMinAmount  !== !addFrom.value.buyBankMaxAmount ) || (addFrom.value.buyBankMinAmount && addFrom.value.buyBankMaxAmount && addFrom.value.buyBankMinAmount < 100 )){
    message.error(t('m562')+t('n1660'));
    return;
  }
  loading.value = true;
  const res: any = await fakeAppKycBankAdminUpdate(editFrom).finally(() => (loading.value = false));
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
    buyUpiMinAmount: 0,
    buyUpiMaxAmount: 0,
    buyBankMinAmount: 0,
    buyBankMaxAmount: 0,
  };
}

const groupList = ref([])
const getGroupList = async () => {
  const res: any = await fakeAppKycBankAdminKycBankListPage();
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
