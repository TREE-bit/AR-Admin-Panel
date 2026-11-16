<template>
  <div class="search">
    <h2>{{ $t("n412") }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.content"
          class="searchstyle"
          :placeholder="$t('n434')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.rewardType"
          :options="Object.entries(rateTypeMap).map(([key, value]:[any,any]) => ({ label: value, value: Number(key) }))"
          :placeholder="$t('n435')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.viewStatus"
          :options="Object.entries(statusMap).map(([key, value]:[any,any]) => ({ label: value.text, value: Number(key) }))"
          :placeholder="$t('n436')"
          :allowClear="true"
        >
        </a-select>
      </a-col>
      <a-col>
        <a-button type="primary" @click="getList(1)"
        >{{ $t('search') }}</a-button>
        <a-button type="default" @click="resetQuery"
        >{{ $t('reset') }}</a-button>
        <a-button type="primary" @click="showAddModal"
          v-permission="'admin:buySellRewardConfigForAdmin:save'"
        >{{ $t('add') }}</a-button>
      </a-col>
    </a-row>
    </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%', y: getTabH + 'px' }"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'rewardType'">
        <b :class="record.rewardType === 1 ? 'tag-blue' : 'tag-green'">
          {{ rateTypeMap[record.rewardType] }}
        </b>
      </template>
      <template v-if="column.key === 'content'">
        <a-tooltip v-if="record.content">
          <template #title>
            <b>{{ record.content }}</b>
          </template>
          <div class="toopTipStyle2 bold">
            {{ record.content }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'memberTypes'">
        <a-tooltip v-if="record.memberTypes && record.memberTypes.length > 0">
          <template #title>
            <a-tag color="green" style="margin: 2px;" v-for="(item,index) in record.memberTypes" :key="index">
              {{ $getMapItem(userTypeMap, item) }}
            </a-tag>
          </template>
          <div class="toopTipStyle2">
            <a-tag color="green" style="margin: 2px;" v-for="(item,index) in record.memberTypes" :key="index">
              {{ $getMapItem(userTypeMap, item) }}
            </a-tag>
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'sourceTypes'">
        <a-tooltip v-if="record.sourceTypes && record.sourceTypes.length > 0">
          <template #title>
            <a-tag color="green" style="margin: 2px;" v-for="(item,index) in record.sourceTypes" :key="index">{{ $t($getMapItem(tradeRewardOrderSourceMap,item)) }}</a-tag>
          </template>
          <div class="toopTipStyle2">
            <a-tag color="green" style="margin: 2px;" v-for="(item,index) in record.sourceTypes" :key="index">{{ $t($getMapItem(tradeRewardOrderSourceMap,item)) }}</a-tag>
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'merchantRangeCodes'">
        <div v-if="record.merchantRangeCodes && record.merchantRangeCodes.length > 0">
          <a-tooltip v-if="record.merchantRangeCodes[0] != 0">
            <template #title>
              <a-tag color="green" style="margin: 2px;" v-for="(item,index) in record.merchantRangeCodes" :key="index">{{ item }}</a-tag>
            </template>
            <div class="toopTipStyle2">
              <a-tag color="green" style="margin: 2px;" v-for="(item,index) in record.merchantRangeCodes" :key="index">{{ item }}</a-tag>
            </div>
          </a-tooltip>
          <b v-else class="tag-green">{{ $t('m341') }}</b>
        </div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'amountRangeReward'">
        <div class="tableText" v-if="record.amountRangeReward && record.amountRangeReward.length > 0">
          <div v-for="(item,index) in record.amountRangeReward" :key="index">
            <b>{{ index + 1 }}： </b>{{  item.minAmount }} - {{ item.maxAmount }} - {{ item.rewardRate }}%
          </div>
        </div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'maxEmailPerSecond'">
        
      </template>
      <template v-if="column.key === 'rewardStartDate'">
        {{ record.rewardStartDate || '--'  }}<b>{{' ' + $t('n1090') + ' ' }}</b>{{ record.rewardEndDate || '--' }}
      </template>
      <template v-if="column.key === 'rewardStartTimes'">
        <span v-if="record.rewardStartTimes && record.rewardEndTimes">
          {{ record.rewardStartTimes || '--'  }}<b>{{' ' + $t('n1090') + ' ' }}</b>{{ record.rewardEndTimes || '--' }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'rewardEndTimes'">
        {{ record.rewardEndTimes || '-' }}
      </template>
      <template v-if="column.key === 'viewStatus'">
        <span v-if="record.viewStatus" :class="'tag-'+statusMap[record.viewStatus]?.color || ''">
          {{ statusMap[record.viewStatus].text || '-' }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'createBy'">
      <a-tooltip>
        <template #title>{{ record.updateBy || record.createBy || '-' }}
        </template>
        {{ record.updateBy || record.createBy || '-' }}
      </a-tooltip>
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.updateTime || record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showPageFun(record)"
          >{{ $t("b23") }}
        </a-tag>
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editPageFun(record)"
          v-permission="'admin:buySellRewardConfigForAdmin:update'"
          v-if="record.viewStatus != 3"
          >{{ $t("edit") }}
        </a-tag>
        <a-popconfirm
          :title=" $t('n451') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="endRewarf(record.id)"
        >
          <a-tag
            color="red"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:buySellRewardConfigForAdmin:stopReward'"
            v-if="record.viewStatus != 3"
            >{{ $t("n81") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="showContent"
    :footer="null"
    :width="800"
    :title="null"
    :mask-closable="false"
    @cancel="closeEdit"
  > 
  <tipTemplate 
  :title="isShow ? $t('b23')+ $t('n437') : isEdit ? $t('edit')+ $t('n437') : $t('add')+$t('n437')" 
  :info="tipInfoText"
  :width="500"/>
    <a-form
      name="basic"
      autocomplete="off"
      labelAlign="right"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item :required="true">
        <template #label>
          <div class="label-wrapper">
            <span>{{ $t('n435') }}</span>
          </div>
        </template>
        <a-select
          show-search
          v-model:value="planForm.rewardType"
          :placeholder="$t('n435')"
          @change="handleRewardTypeChange"
          :allowClear="true"
          :disabled="isShow || isEditConfig"
          :options="Object.entries(rateTypeMap).map(([key, value]:[any,any]) => ({ label: value, value: Number(key) }))"
        >
        </a-select>
      </a-form-item>
      <a-form-item :required="true">
        <template #label>
          <div class="label-wrapper">
            <span>{{ $t('n434') }}</span>
          </div>
        </template>
        <a-textarea v-trim
          v-model:value="planForm.content"
          :placeholder= "$t('n434')"
          :maxlength="60"
          :disabled="isShow || isEditConfig"
          :rows="2"
        >
        </a-textarea>
      </a-form-item>
      <a-form-item :required="true">
        <template #label>
          <div class="label-wrapper">
            <span>{{ $t('n438') }}</span>
          </div>
        </template>
        <div class = "rateBox">
          <div class="titleBox">
            <div class="rateTitle">{{ $t('n439') }}</div>
            <div class="rateTitle">{{ $t('n440') }}</div>
            <div class="rateTitle" :class="isShow?'borderNone':''">{{ $t('n441') }}%</div>
            <div class="rateTitle borderNone" v-if="!isShow">{{ $t('operation') }}</div>
          </div>
          <div class="rateConBox">
            <div class="rateConItem"
              v-for="(item, index) in planForm.amountRangeReward"
              :key="index">
              <div class="itemInput">
                <a-input-number
                  v-model:value="item.minAmount"
                  :min="index == 0 ? 0 : planForm.amountRangeReward[index -1].maxAmount + 1"
                  :precision="0"
                  :disabled="isShow || (invalidIndex !== -1 && invalidIndex !== index)"
                  :placeholder= "$t('m562') + $t('n124')"
                  @input="amountInput(index)"
                  
                />
              </div>
              <div class="itemInput">
                <a-input-number
                  v-model:value="item.maxAmount"
                  :min="item.minAmount+1"
                  :precision="0"
                  :disabled="isShow || (invalidIndex !== -1 && invalidIndex !== index)"
                  :placeholder= "$t('m562') + $t('n124')"
                  @input="amountInput(index)"
                />
              </div>
              <div class="itemInput" :class="isShow?'borderNone':''">
                <a-input-number
                  v-model:value="item.rewardRate"
                  :min="0"
                  :precision="1"
                  :disabled="isShow || (invalidIndex !== -1 && invalidIndex !== index)"
                  @input="amountInput(index)"
                  :placeholder= "$t('m562') + $t('n124')"
                />
              </div>
              <div v-if="!isShow" class="itemInput borderNone">
                <a-tag
                  style="cursor: pointer;"
                  color="red"
                  size="small"
                  v-if="!isShow"
                  @click="delItem(index)"
                  >{{ $t("b11") }}
                </a-tag>
              </div>
              <span>
              </span>
            </div>
          </div>
          <div v-if="planForm.amountRangeReward.length<10 && !isShow" class="addItem" @click="addItem">+</div>
        </div>
        <h5 v-if="isShowError" style="color: red;">{{ $t('n453') }}</h5>
        <h5 v-if="showErr" style="color: red;">{{ $t('n454') }}</h5>
        <h5 v-if="showErr100" style="color: red;">{{ $t('n455') }}</h5>
        <h5 v-if="!isShow && hasAmountOutOfRange" style="color: red;">{{ orderRangeErrorText() }}</h5>
        <h5 v-if="!isShow && hasRateOver100" style="color: red;">{{ $t('n2045') }}</h5>
        <h5 v-if="!isShow && hasRangeOrderError" style="color: red;">{{ $t('n2046') }}</h5>
      </a-form-item>
      <a-form-item :required="true">
        <template #label>
          <div class="label-wrapper">
            <span>{{ $t('m946') }}</span>
          </div>
        </template>
        <!-- @change="handleMerchantChange" -->
        <a-select
          show-search
          v-model:value="planForm.memberTypes"
          mode="multiple"
          :placeholder="$t('m946')"
          :allowClear="true"
          :disabled="isShow"
          :options="Object.entries(userTypeMap).map(([key, value]:[any,any]) => ({ label: (value), value: Number(key) }))"
        >
        </a-select>
      </a-form-item>
      <a-form-item :required="true" v-if="planForm.rewardType == 1">
        <template #label>
          <div class="label-wrapper">
            <span>{{ $t('n657') }}</span>
          </div>
        </template>
        <a-select
          show-search
          v-model:value="planForm.sourceTypes"
          :placeholder="$t('n658')"
          mode="multiple"
          :disabled="isShow"
          :options="Object.entries(tradeRewardOrderSourceMap).map(([key, value]:[any,any]) => ({ label: $t(value), value: Number(key) }))"
        >
        </a-select>
      </a-form-item>
      <a-form-item :required="true">
        <template #label>
          <div class="label-wrapper">
            <span>{{ $t('n442') }}</span>
          </div>
        </template>
        <a-select
          mode="multiple"
          v-model:value="planForm.merchantRangeCodes"
          :placeholder="$t('n442')"
          style="width: 100%"
          :disabled="isShow || isOnlyWalletMember"
          :maxTagCount="6"
        >
        <a-select-option @click="toggleSelectAll">
          {{ $t('m740') }}
        </a-select-option>
          <a-select-option
            v-for="item in formattedMerchantList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.value }} - {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :required="true">
        <template #label>
          <div class="label-wrapper">
            <span>{{ $t('n1262') }}</span>
          </div>
        </template>
        <!-- :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" -->
          <!-- valueFormat="YYYY-MM-DD HH:mm:ss" -->
        <a-date-picker
          v-if="!isShow"
          v-model:value="planForm.rewardStartDate"
          valueFormat="YYYY-MM-DD"
          :placeholder="$t('n1251')"
          :showNow='false'
          :disabled="tradeRewardStatus == 2"
          :disabled-date="disabledStartDate"
          :disabled-time="disabledStartTime"
        />
        <span v-if="!isShow"> - </span>
        <!-- :show-time="{ defaultValue: dayjs('23:59:59', 'HH:mm:ss') }" -->
          <!-- valueFormat="YYYY-MM-DD HH:mm:ss" -->
        <a-date-picker
          v-if="!isShow"
          v-model:value="planForm.rewardEndDate"
          valueFormat="YYYY-MM-DD"
          :placeholder="$t('n1252')"
          :showNow='false'
          :disabled-date="disabledEndDate"
          :disabled-time="disabledEndTime"
        />
        <div v-else style="margin-left: 10px;">
          {{ planForm.rewardStartDate }}  -  {{ planForm.rewardEndDate }}
        </div>
      </a-form-item>
      <a-form-item>
        <template #label>
          <div class="label-wrapper">
            <span>{{ $t('n1263') }}</span>
          </div>
        </template>
        <!-- :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" -->
          <!-- valueFormat="YYYY-MM-DD HH:mm:ss" -->
        <a-time-picker
          v-if="!isShow"
          v-model:value="planForm.rewardStartTimes"
          valueFormat="HH:mm:ss"
          :placeholder="$t('publicStartTime')"
          :showNow='false'
        />
        <span v-if="!isShow"> - </span>
        <!-- :show-time="{ defaultValue: dayjs('23:59:59', 'HH:mm:ss') }" -->
          <!-- valueFormat="YYYY-MM-DD HH:mm:ss" -->
        <a-time-picker
          v-if="!isShow"
          v-model:value="planForm.rewardEndTimes"
          valueFormat="HH:mm:ss"
          :placeholder="$t('publicEndTime')"
          :showNow='false'
        />
        <div v-if="!isShow" style="color: red;">*{{ $t('n1264') }}</div>
        <div v-else style="margin-left: 10px;">
          {{ planForm.rewardStartTimes }}  -  {{ planForm.rewardEndTimes }}
        </div>
      </a-form-item>
      <a-form-item v-if="!isShow" :wrapper-col="{ offset: 9 }">
          <a-button :loading="loading || isSavingCurrentForm" style="margin-right: 14px;" @click="add" type="primary">{{ $t('save') }}</a-button>
        <a-button type="primary"  @click="closeEdit">{{ $t('b10') }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { 
  getRewardConfigList,
  createRewardConfig,
  updateRewardConfig,
  endRewardConfig,
  tradeConfigSchemeAdmin,
} from "@/api/c2cconfig.api";
import { getMerchantInfoAdminList } from "@/api/merchant.api";
import { onMounted, ref, computed,h, onUnmounted, watchEffect, watch, shallowRef} from "vue";
import dayjs, { Dayjs } from "dayjs";
import { message } from "ant-design-vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useI18n } from "vue-i18n";
import tipTemplate from "@/components/Other/tipTemplate.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { tradeRewardOrderSourceMap } from "@/utils/publicData";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
// import { cloneDeep } from "lodash";
// import { deepClone } from "@ar/shared";
// import{levelMap } from '@/utils/publicData'
const { t } = useI18n();
const { getTabH } = useTabHeight();
const [,,,serverTime] = getStartAndEndOfDay();
const serverMoment = dayjs(serverTime); 
const tradeRewardStatus = ref(null as any);
const tipInfoText = ref([
  '1 ' + t('n519')+'：',
  '1.1 ' + t('n520')+'；',
  '1.2 ' + t('n521')+'；',
  '2 ' + t('n522')+'：',
  '2.1 ' + t('n523')+'；',
  '2.2 ' + t('n524')+'；',
  '2.3 ' + t('n525')+'；',
  '2.4 ' + t('n526')+'；',
]);
const disabledStartDate = (current: Dayjs | null): boolean => {
  if (!current) return false;
  const endTime = planForm.value.rewardEndDate ? dayjs(planForm.value.rewardEndDate) : undefined;

  return current.isBefore(serverMoment, 'day') || 
         (endTime ? current.isAfter(endTime, 'day') : false);
};

const disabledStartTime = (date: Dayjs | null) => {
  if (!date) return {};

  const endTime = planForm.value.rewardEndDate ? dayjs(planForm.value.rewardEndDate) : null;
  const isSameAsServer = date.isSame(serverMoment, 'day');
  const isSameAsEnd = endTime && date.isSame(endTime, 'day');

  return {
    disabledHours: () => {
      const hours: number[] = [];
      for (let i = 0; i < 24; i++) {
        if ((isSameAsServer && i < serverMoment.hour()) ||
            (isSameAsEnd && i > endTime.hour())) {
          hours.push(i);
        }
      }
      return hours;
    },
    disabledMinutes: (h:any) => {
      const minutes: number[] = [];
      if (isSameAsServer && h === serverMoment.hour()) {
        for (let i = 0; i < serverMoment.minute(); i++) minutes.push(i);
      }
      if (isSameAsEnd && h === endTime.hour()) {
        for (let i = endTime.minute() + 1; i < 60; i++) minutes.push(i);
      }
      return minutes;
    },
    disabledSeconds: (h:any, m:any) => {
      const seconds: number[] = [];
      if (isSameAsServer && h === serverMoment.hour() && m === serverMoment.minute()) {
        for (let i = 0; i < serverMoment.second(); i++) seconds.push(i);
      }
      if (isSameAsEnd && h === endTime.hour() && m === endTime.minute()) {
        for (let i = endTime.second() + 1; i < 60; i++) seconds.push(i);
      }
      return seconds;
    }
  };
};

// ------ rewardEndTimes 的限制函数 ------
const disabledEndDate = (current: Dayjs | null): boolean => {
  if (!current) return false;
  const startTime = planForm.value.rewardStartDate ? dayjs(planForm.value.rewardStartDate) : null;

  return current.isBefore(serverMoment, 'day') || 
         (startTime ? current.isBefore(startTime, 'day') : false);
};

const disabledEndTime = (date: Dayjs | null) => {
  if (!date) return {};

  const startTime = planForm.value.rewardStartDate ? dayjs(planForm.value.rewardStartDate) : null;
  const isSameAsServer = date.isSame(serverMoment, 'day');
  const isSameAsStart = startTime && date.isSame(startTime, 'day');

  return {
    disabledHours: () => {
      const hours: number[] = [];
      for (let i = 0; i < 24; i++) {
        if ((isSameAsServer && i < serverMoment.hour()) ||
            (isSameAsStart && i < startTime.hour())) {
          hours.push(i);
        }
      }
      return hours;
    },
    disabledMinutes: (h:any) => {
      const minutes: number[] = [];
      if (isSameAsServer && h === serverMoment.hour()) {
        for (let i = 0; i < serverMoment.minute(); i++) minutes.push(i);
      }
      if (isSameAsStart && h === startTime.hour()) {
        for (let i = 0; i < startTime.minute(); i++) minutes.push(i);
      }
      return minutes;
    },
    disabledSeconds: (h:any, m:any) => {
      const seconds: number[] = [];
      if (isSameAsServer && h === serverMoment.hour() && m === serverMoment.minute()) {
        for (let i = 0; i < serverMoment.second(); i++) seconds.push(i);
      }
      if (isSameAsStart && h === startTime.hour() && m === startTime.minute()) {
        for (let i = 0; i < startTime.second(); i++) seconds.push(i);
      }
      return seconds;
    }
  };
};

const dataSource = ref([]);
const loading = ref(false);
// const changeLoading = ref(false);
const isEdit = ref(false);
const isEditConfig = ref(false);
const isShow = ref(false);
const query = ref<any>({
  asc: undefined,
  column: undefined,
  pageNo: 1,
  pageSize: 20,
  content: undefined,
  rewardType: undefined,
  viewStatus: undefined,
})
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const now = ref(0)
let timer: any = null;
const columns:any = [
  {
    // title: t("e47"),
    title: () => h('div', { class:'toopTipStyle2' }, t("e47")),
    align: "center",
    width: 60,
    customRender: ({ index }: { index: number }) => index + 1,
  },
  {
    title: t('n435'),
    dataIndex: "rewardType",
    key: "rewardType",
    align: "center",
    width: 120,
  },
  {
    title: t('n434'),
    dataIndex: "content",
    key: "content",
    align: "center",
    width: 180,
  },
  {
    title: t('m946'),
    dataIndex: "memberTypes",
    key: "memberTypes",
    align: "center",
    width: 160,
  },
  {
    title: t("n657"),
    dataIndex: "sourceTypes",
    key: "sourceTypes",
    align: "center",
    width: 180,
  },
  {
    title: t("n442"),
    dataIndex: "merchantRangeCodes",
    key: "merchantRangeCodes",
    align: "center",
    width: 180,
  },
  {
    // title: t("n438"),
    title: () => h('div', { class:'toopTipStyle2' }, t("n438")),
    dataIndex: "amountRangeReward",
    key: "amountRangeReward",
    align: "center",
    width: 160,
  },
  {
    title: t('n444'),
    dataIndex: "rewardStartTimeDiff",
    key: "rewardStartTimeDiff",
    align: "center",
    width: 140,
    customRender: ({ record }: { record: Record<string, any> }) => {
      if (!record.rewardStartTimeDiff) {
        return '-';
      }
      const remaining = Math.abs(Math.floor(record.rewardStartTimeDiff)) - now.value
      if (remaining <= 0) {
        record.viewStatus = 2;
        return '-';
      }else{
        let hours: any = Math.floor(remaining / 3600);
        let minutes: any = Math.floor((remaining % 3600) / 60);
        let seconds: any = remaining % 60;
        let days: any = Math.floor(hours / 24);
        hours = hours - (days * 24);
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        if (days > 0) {
          return `${days}${t('n341')} ${hours}:${minutes}:${seconds} `
        }
        if (days == 0 && hours > 0) {
          return `${hours}:${minutes}:${seconds} `
        }
        if (days == 0 && hours == 0) {
          return `${minutes}:${seconds} `
        }
      }
    },
  },
  {
    title: t('n1262'),
    dataIndex: "rewardStartDate",
    key: "rewardStartDate",
    align: "center",
    width: 180,
  },
  {
    title: t('n1263'),
    dataIndex: "rewardStartTimes",
    key: "rewardStartTimes",
    align: "center",
    width: 180,
  },
  // {
  //   title: t("publicEndTime"),
  //   dataIndex: "rewardEndTimes",
  //   key: "rewardEndTimes",
  //   align: "center",
  //   width: 140,
  // },
  {
    title: t('n436'),
    dataIndex: "viewStatus",
    key: "viewStatus",
    align: "center",
    width: 120,
  },
  {
    title: t("l48"),
    dataIndex: "createBy",
    key: "createBy",
    align: "center",
    width: 120,
  },
  {
    title: t("l67"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 140,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    fixed:'right',
    width: 160,
  },
];
const getList = async (isFirst: any = null) => {
  clearInterval(timer);
  if(isFirst){
    query.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  pagination.value.current = query.value.pageNo;
  pagination.value.pageSize = query.value.pageSize;
  const res:any = await getRewardConfigList(query.value).finally(()=> loading.value = false);
  if (res && res.code === "1") {
    clearSelected();
    dataSource.value = res.data.list
    .map((item: any) => {
      item.sourceTypes = item.sourceTypes || [];
      return item;
    }).map((item: any) => {
      item.merchantRangeCodes = item.merchantRangeCodes || [];
      return item;
    });
    pagination.value.total = res.data.total;
    if (dataSource.value.some((item: any) => Math.abs(item.rewardStartTimeDiff) > 0)) {
      now.value = 0;
      timer = setInterval(() => {
        now.value += 1
      }, 1000)
    } else {
      timer = null;
    }
  }
};
/****************Add edit***************/
const showContent = ref(false);
const planForm = ref<{
  id: number | undefined;
  rewardType: number | undefined;
  content: string | undefined;
  amountRangeReward: { minAmount: number; maxAmount: number; rewardRate: number }[];
  memberTypes: number[] | any;
  merchantRangeCodes: string[];
  rewardStartDate: string;
  rewardEndDate: string;
  rewardStartTimes: any;
  rewardEndTimes: any;
  sourceTypes: number[]; // Optional field for rewardType 1
}>({
  id: undefined,
  rewardType: undefined,//奖励类型
  content: undefined,//活动名称
  amountRangeReward: [{minAmount: 100,maxAmount: 1000,rewardRate: 1}],//金额区间及奖励比例
  memberTypes: [],//用户类型
  merchantRangeCodes: [],//商户范围
  rewardStartDate: '',//开始时间
  rewardEndDate: '',//结束时间
  rewardStartTimes: null,//开始时间
  rewardEndTimes: null,//结束时间
  sourceTypes: [], // Optional field for rewardType 1
});
const isOnlyWalletMember = ref(false);
watchEffect(() => {
  isOnlyWalletMember.value = !planForm.value.memberTypes.some((t: any) => [1, 2].includes(Number(t)));;
});
const prevRewardType = ref(planForm.value.rewardType);
// const isEditFirst = ref(false);
watchEffect(() => {
  const form = planForm.value;

  // if (form.memberTypes == 3 || form.memberTypes == 4) {
  //   form.merchantRangeCodes = [];
  // }
  // if( form.memberTypes != 4) {
  //   form.groupId = undefined;
  // }else{
  //   form.groupId = 0;
  // }
  // if( form.rewardType == 2) {
  //   form.sourceTypes = [];
  // }
  // if (!isShow.value && !isEditFirst.value && form.rewardType !== prevRewardType.value) {
  //   form.memberTypes = undefined;
  // }
  // isEditFirst.value = false;
  prevRewardType.value = form.rewardType;
});
const handleRewardTypeChange = (value: any) => {
  if (value == 2) {
    planForm.value.sourceTypes = [];
  } 
};
const handleMerchantChange = (value: any) => {
  if (value == 3 || value == 4) {
    planForm.value.merchantRangeCodes = [];
  }
};
const showAddModal = () => {
  cancelPendingReset();
  tradeRewardStatus.value = null;
  showContent.value = true;
  planForm.value = {
    id: undefined,
    rewardType: undefined,//奖励类型
    content: undefined,//活动名称
    amountRangeReward: [],//金额区间及奖励比例
    memberTypes: [],//用户类型
    merchantRangeCodes: [],//商户范围
    rewardStartDate: '',//开始时间
    rewardEndDate: '',//结束时间
    rewardStartTimes: null,//开始时间
    rewardEndTimes: null,//结束时间
    sourceTypes: [],
  }
  // 默认首行依赖 orderRange（随 rewardType 变化），需在 planForm 重置后再生成
  planForm.value.amountRangeReward = [createDefaultAmountRangeRewardItem()];
  defaultRowKey.value = rowKey(planForm.value.amountRangeReward[0]);
  originRowKeys.value = [];
  isEdit.value = false;
  getSchemeList();
}

const rateTypeMap = <any>{
  1: t("e6"),//买入奖励
  2: t("e7"),//卖出奖励
}
const userTypeMap:any = <any>{
  1: t("n445"),//商户内部会员
  2: t("n446"),//商户外部会员
  3: t("n96"),//钱包会员
  4: t("m842"),//蚂蚁会员
}
const groupIdMap:any = {
  0: t("n514"),//未分组
  1: t("n515"),//潜在蚂蚁
  2: t("n516"),//低度活跃
  3: t("n517"),//中度活跃
  4: t("n518"),//高度活跃
};
const statusMap = <any>{
  1: {
    color: 'blue',
    text:t("n447")
  },//未开始
  2: {
    color: 'green',
    text:t("m53")
  },//进行中
  3: {
    color: 'red',
    text:t("n448")
  },//已结束
}
const merchantList = ref([]);
const getMerchantList = async () => {
  const res:any = await getMerchantInfoAdminList({pageNo: 1, pageSize: 10000});
  if (res && res.code === "1") {
    merchantList.value = res.data;
  }
};
const formattedMerchantList = computed(() =>{
  return merchantList.value.map((item:any) => ({
    label: item.username,
    value: item.code,
  }));
});
// 运营参数配置（L1/L2 会员方案）的订单范围：买入奖励取买入金额、卖出奖励取卖出金额，未选类型取两者并集；
// 奖励配置不区分会员等级，因此取各方案中最宽的范围；接口失败时用默认值
const MIN_ORDER_AMOUNT = 100; // 产品要求最小值不能小于 100
const DEFAULT_MAX_ORDER_AMOUNT = 50000;
const SCHEME_AMOUNT_KEYS: Record<number, { min: string[]; max: string[] }> = {
  1: { min: ['schemeMinPurchaseAmount'], max: ['schemeMaxPurchaseAmount'] },
  2: { min: ['schemeMinSellAmount'], max: ['schemeMaxSellAmount'] },
};
const schemeList = ref<any[]>([]);
const schemeLoading = ref(false);
let schemeRequest: Promise<void> = Promise.resolve();
const getSchemeList = () => {
  schemeLoading.value = true;
  schemeRequest = tradeConfigSchemeAdmin({ asc: true, column: '', pageNo: 1, pageSize: 20 })
    .then((res: any) => {
      if (res && res.code === "1" && Array.isArray(res.data)) {
        schemeList.value = res.data;
      }
    })
    .catch(() => {})
    .finally(() => {
      schemeLoading.value = false;
    });
};
// 首次打开弹窗、范围接口还没返回时暂不做范围校验，避免按默认范围误判；新增区间和保存前会先等接口返回
const rangeReady = computed(() => schemeList.value.length > 0 || !schemeLoading.value);
// 等范围接口返回；等待期间弹窗被关闭或换成了别的表单时返回 false，调用方应放弃本次操作
const waitSchemeList = async () => {
  if (!schemeLoading.value) return true;
  const form = planForm.value;
  await schemeRequest;
  return showContent.value && planForm.value === form;
};
const orderRange = computed(() => {
  const keys = SCHEME_AMOUNT_KEYS[Number(planForm.value.rewardType)] || {
    min: [...SCHEME_AMOUNT_KEYS[1].min, ...SCHEME_AMOUNT_KEYS[2].min],
    max: [...SCHEME_AMOUNT_KEYS[1].max, ...SCHEME_AMOUNT_KEYS[2].max],
  };
  const pick = (fields: string[]) => schemeList.value
    .flatMap((item: any) => fields.map(k => item[k]))
    .filter((v: any) => v !== null && v !== undefined && v !== '' && !isNaN(Number(v)))
    .map(Number);
  const mins = pick(keys.min);
  const maxs = pick(keys.max);
  return {
    // 配置的最小值大于 100 时取配置值，否则取 100
    min: Math.max(MIN_ORDER_AMOUNT, mins.length ? Math.min(...mins) : MIN_ORDER_AMOUNT),
    max: maxs.length ? Math.max(...maxs) : DEFAULT_MAX_ORDER_AMOUNT,
  };
});
type RewardRow = { minAmount: number; maxAmount: number; rewardRate: number };
const rowKey = (item: RewardRow) => `${item.minAmount}-${item.maxAmount}-${item.rewardRate}`;
// 编辑时载入的原有区间：未改动的行不受订单范围/比例上限/重叠校验限制，避免历史数据阻塞保存其它字段；
// 每个原有取值只豁免一行，新加行即使填成与原有行相同的值也要校验
const originRowKeys = ref<string[]>([]);
const unchangedRows = computed(() => {
  const remain = new Map<string, number>();
  originRowKeys.value.forEach(key => remain.set(key, (remain.get(key) || 0) + 1));
  const rows = new Set<RewardRow>();
  planForm.value.amountRangeReward.forEach(item => {
    const count = remain.get(rowKey(item)) || 0;
    if (count > 0) {
      rows.add(item);
      remain.set(rowKey(item), count - 1);
    }
  });
  return rows;
});
const isRowChanged = (item: RewardRow) => !unchangedRows.value.has(item);
// 小于 100 的情况由原有 n455 提示，这里只判断起始金额在 [100, 配置最小值) 或超过配置最大值，以及结束金额超过配置最大值
const isAmountOutOfRange = (item: RewardRow) => rangeReady.value && isRowChanged(item) && (
  (item.minAmount != null && item.minAmount >= MIN_ORDER_AMOUNT &&
    (item.minAmount < orderRange.value.min || item.minAmount > orderRange.value.max)) ||
  (item.maxAmount != null && item.maxAmount > orderRange.value.max)
);
const isRateOver100 = (item: RewardRow) => isRowChanged(item) && item.rewardRate != null && item.rewardRate > 100;
const hasAmountOutOfRange = computed(() => planForm.value.amountRangeReward.some(isAmountOutOfRange));
const hasRateOver100 = computed(() => planForm.value.amountRangeReward.some(isRateOver100));
// 区间需从小到大依次排列：相邻两行有改动且后一行起始金额不大于前一行结束金额（重叠或顺序颠倒）即不合法
const hasRangeOrderError = computed(() => planForm.value.amountRangeReward.some((item, i, rows) =>
  i > 0 && (isRowChanged(item) || isRowChanged(rows[i - 1])) &&
  item.minAmount != null && rows[i - 1].maxAmount != null && item.minAmount <= rows[i - 1].maxAmount
));
// 新增弹窗的默认首行：订单范围变化（切换奖励类型、范围接口返回）时，若首行仍未改动则同步为新的默认值；
// 点保存后等待范围接口期间不同步，避免提交与用户所见不一致的值
const defaultRowKey = ref('');
// 正在等范围接口后保存的表单；保存按钮只在它就是当前表单时 loading，避免状态串到之后打开的弹窗
const savingForm = shallowRef<any>(null);
const isSavingCurrentForm = computed(() => savingForm.value !== null && savingForm.value === planForm.value);
watch(orderRange, () => {
  const rows = planForm.value.amountRangeReward;
  if (isSavingCurrentForm.value || !showContent.value || isEdit.value || isShow.value) return;
  if (rows.length !== 1 || rowKey(rows[0]) !== defaultRowKey.value) return;
  rows[0] = createDefaultAmountRangeRewardItem();
  defaultRowKey.value = rowKey(rows[0]);
});
const isShowError = ref(false);
const showErr = ref(false);
const showErr100 = ref(false);
const errorIndex = ref(0);
const amountInput = (index: number) => {
  errorIndex.value = index;
  if(planForm.value.amountRangeReward[index].minAmount == undefined || planForm.value.amountRangeReward[index].maxAmount == undefined || planForm.value.amountRangeReward[index].rewardRate == undefined){
    showErr.value = true;
    return;
  }else{
    showErr.value = false;
  }
  if (planForm.value.amountRangeReward[index].maxAmount < planForm.value.amountRangeReward[index].minAmount ) {
    isShowError.value = true;
    return;
  }else{
    isShowError.value = false;
  }
  if (planForm.value.amountRangeReward[index].minAmount < MIN_ORDER_AMOUNT) {
    showErr100.value = true;
    return;
  }else{
    showErr100.value = false;
  }
}
const invalidIndex = computed(() => {
  return planForm.value.amountRangeReward.findIndex(
    (item) =>
      item.minAmount != null &&
      item.maxAmount != null &&
      item.minAmount > item.maxAmount ||
      item.minAmount < MIN_ORDER_AMOUNT ||
      item.rewardRate == null ||
      item.minAmount == null ||
      item.maxAmount == null ||
      isAmountOutOfRange(item) ||
      isRateOver100(item)
  );
});
const amountRewardRules = (n:any = planForm.value.amountRangeReward.length - 1) => {
  if (planForm.value.amountRangeReward[n].minAmount == undefined || planForm.value.amountRangeReward[n].maxAmount == undefined || planForm.value.amountRangeReward[n].rewardRate == undefined) {
    message.error(t('n454'));
    return false;
  }
  if (planForm.value.amountRangeReward[n].minAmount > planForm.value.amountRangeReward[n].maxAmount) {
    message.error(t('n453'));
    return false;
  }
  if (planForm.value.amountRangeReward[n].minAmount < MIN_ORDER_AMOUNT) {
    message.error(t('n455'));
    return false;
  }
  return true;
}
// 订单范围提示附带当前范围，便于判断是超出范围还是已无剩余金额可新增区间
const orderRangeErrorText = () => `${t('n2044')} (${orderRange.value.min} - ${orderRange.value.max})`;
// 订单范围、奖励比例上限、区间重叠校验
const rangeRewardRules = () => {
  if (hasAmountOutOfRange.value) {
    message.error(orderRangeErrorText());
    return false;
  }
  if (hasRateOver100.value) {
    message.error(t('n2045'));
    return false;
  }
  if (hasRangeOrderError.value) {
    message.error(t('n2046'));
    return false;
  }
  return true;
}
// 新区间起始金额：上一区间结束 + 1，且不低于配置最小值（上一行可能是低于当前最小值的历史行）
const nextRowMinAmount = (lastItem: RewardRow) => Math.max(lastItem.maxAmount + 1, orderRange.value.min);
const createDefaultAmountRangeRewardItem = (lastItem?: RewardRow) => {
  if (!lastItem) {
    const { min, max } = orderRange.value;
    return {
      minAmount: min,
      maxAmount: Math.min(Math.max(1000, min + 1), max),
      rewardRate: 1,
    };
  }
  const minAmount = nextRowMinAmount(lastItem);
  return {
    minAmount,
    maxAmount: Math.min(minAmount + 999, orderRange.value.max),
    rewardRate: 1,
  };
};
const addItem = async () => {
  // 范围接口未返回时先等待，避免按默认范围生成新区间；等待期间弹窗已关闭或切换则放弃
  if (!(await waitSchemeList())) return;
  if(planForm.value.amountRangeReward.length > 0 && !amountRewardRules(errorIndex.value)) return;
  if(isShowError.value || showErr.value || showErr100.value) return;
  if(!rangeRewardRules()) return;
  const lastItem = planForm.value.amountRangeReward[planForm.value.amountRangeReward.length - 1];
  // 新区间结束金额需大于起始金额，剩余空间不足时无法再新增
  if (lastItem && nextRowMinAmount(lastItem) >= orderRange.value.max) {
    message.error(orderRangeErrorText());
    return;
  }
  planForm.value.amountRangeReward.push(createDefaultAmountRangeRewardItem(lastItem));
}
const delItem = (index: number) => {
  planForm.value.amountRangeReward.splice(index, 1);
  if (planForm.value.amountRangeReward.length === 0) {
    errorIndex.value = 0;
    isShowError.value = false;
    showErr.value = false;
    showErr100.value = false;
    return;
  }
  if (errorIndex.value == index) {
    isShowError.value = false;
    showErr.value = false;
    showErr100.value = false;
    // 删除的是最后一行时 errorIndex 会越界，后续 amountRewardRules(errorIndex) 会读到 undefined
    errorIndex.value = Math.min(errorIndex.value, planForm.value.amountRangeReward.length - 1);
  } else if (errorIndex.value > index) {
    errorIndex.value--;
  }
  
}
// 全选商户
// 全部 商户value 值
const allValues = computed(() => formattedMerchantList.value.map(i => i.value))

// 是否已全选商户
const isAllSelected = computed(() =>
  allValues.value.every(val => planForm.value.merchantRangeCodes.includes(val))
)
// 点击全选商户
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    planForm.value.merchantRangeCodes = []
  } else {
    planForm.value.merchantRangeCodes = [...allValues.value]
  }
}

const showPageFun = (data: any) => {
  cancelPendingReset();
  const {id, rewardType, content, amountRangeReward, memberTypes, sourceTypes, 
    merchantRangeCodes, rewardStartDate, rewardEndDate, rewardStartTimes,rewardEndTimes } = data;
  planForm.value=  {id, rewardType, content, amountRangeReward, memberTypes, sourceTypes,
     merchantRangeCodes:merchantRangeCodes[0] == 0 ? allValues.value : merchantRangeCodes,
      rewardStartDate, rewardEndDate, rewardStartTimes,rewardEndTimes };
  isShow.value = true;
  showContent.value = true;
  selectedRow();
};

const editPageFun = (data: any) => {
  cancelPendingReset();
  const { id, rewardType, content, amountRangeReward, memberTypes, sourceTypes,
     merchantRangeCodes,rewardStartDate, rewardEndDate, rewardStartTimes,rewardEndTimes,viewStatus } = JSON.parse(JSON.stringify(data));
  planForm.value = { id, rewardType, content, amountRangeReward, memberTypes, sourceTypes,
    merchantRangeCodes:merchantRangeCodes[0] == 0 ? allValues.value : merchantRangeCodes,
     rewardStartDate, rewardEndDate, rewardStartTimes,rewardEndTimes };
  originRowKeys.value = (amountRangeReward || []).map(rowKey);
  isEdit.value = true;
  getSchemeList();
  tradeRewardStatus.value = viewStatus;
  // isEditFirst.value = true;
  showContent.value = true;
  if(data.viewStatus == 2){
    isEditConfig.value = true;
  }
  selectedRow();
};
const add = async () => {
  if(![1,2].includes(Number(planForm.value.rewardType))){
    message.error(t('m563') + t('n435'));
    return;
  }
  if(!planForm.value.content){
    message.error(t('m562') + t('n434'));
    return;
  }
  if(planForm.value.amountRangeReward.length == 0){
    message.error(t('m562')+t('n438'));
    return;
  }
  // 范围接口未返回时先等待再校验，期间保持保存按钮 loading 防止重复提交（单独的状态，不影响列表 loading）；
  // 等待期间弹窗已关闭或切换则放弃保存；结束时只清除自己设置的等待状态
  if (schemeLoading.value) {
    const form = planForm.value;
    savingForm.value = form;
    const stillOpen = await waitSchemeList();
    if (savingForm.value === form) savingForm.value = null;
    if (!stillOpen) return;
  }
  // 逐行校验：改动过的行，以及原先就会校验的 errorIndex 行（未改动的历史行保持原逻辑，不额外拦截）
  if(!planForm.value.amountRangeReward.every((item, i) =>
    (i !== errorIndex.value && !isRowChanged(item)) || amountRewardRules(i))) return;
  if(!rangeRewardRules()) return;
  if(planForm.value.memberTypes.length == 0){
    message.error(t('m563')+t('m946'));
    return;
  }
  if(planForm.value.rewardType == 1 && planForm.value.sourceTypes.length == 0){
    message.error(t('m563')+t('n658'));
    return;
  }
  if(planForm.value.merchantRangeCodes.length == 0 && !isOnlyWalletMember.value){
    message.error(t('m563')+t('n442'));
    return;
  }
  if(planForm.value.rewardStartDate == '' || planForm.value.rewardStartDate == null){
    message.error(t('m563')+t('n1251'));
    return;
  }
  if(planForm.value.rewardEndDate == '' || planForm.value.rewardEndDate == null){
    message.error(t('m563')+t('n1252'));
    return;
  }
  if(!(planForm.value.rewardStartTimes && planForm.value.rewardEndTimes
    || !planForm.value.rewardStartTimes && !planForm.value.rewardEndTimes)
  ){
    message.error(t('m563')+t('n1263'));
    return;
  }
  // if(planForm.value.rewardEndTimes == '' || planForm.value.rewardEndTimes == null){
  //   message.error(t('m563')+t('publicEndTime'));
  //   return;
  // }
  loading.value = true;
  let res:any;
  if (!isEdit.value) {
    res = await createRewardConfig(Object.assign({},planForm.value,{
      merchantRangeCodes: isAllSelected.value ? [0] : planForm.value.merchantRangeCodes
    })).finally(()=> {
      loading.value = false;
    });
  }else{
    res = await updateRewardConfig(Object.assign({},planForm.value,{
      merchantRangeCodes: isAllSelected.value ? [0] : planForm.value.merchantRangeCodes
    })).finally(()=> {
      loading.value = false;
    });
  }
  if (res && res.code === '1') {
    message.success(t('s14'));
    closeEdit();
    getList();
  }
};
// 关闭弹窗后延迟重置状态（避免关闭动画中标题闪变）；延迟期间再次打开弹窗时需立即完成重置，否则会覆盖新弹窗的状态
let closeResetTimer: any = null;
const resetModalState = () => {
  closeResetTimer = null;
  isEdit.value = false;
  isShow.value = false;
  isShowError.value = false;
  showErr.value = false;
  showErr100.value = false;
  isEditConfig.value = false;
}
const cancelPendingReset = () => {
  if (!closeResetTimer) return;
  clearTimeout(closeResetTimer);
  resetModalState();
}
const closeEdit = () =>{
  showContent.value = false;
  errorIndex.value = 0;
  clearTimeout(closeResetTimer);
  closeResetTimer = setTimeout(resetModalState, 500);
}

const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageSize = pag.pageSize;
  query.value.pageNo = pag?.current;
  getList();
};
const resetQuery = () => {
  query.value = {
    asc: undefined,
    column: undefined,
    pageSize: 20,
    pageNo: 1,
    content: undefined,
    rewardType: undefined,
    viewStatus: undefined,
  };
  pagination.value.pageSize = 20;
  pagination.value.current = 1;
  getList();
}

const endRewarf = async (id: any) => {
  const res:any = await endRewardConfig(id);
  if (res && res.code == '1') {
    message.success(t('s10'));
    getList();
  }
}
onMounted(() => {
  getMerchantList();
  getList();
  getTabH.value = useTabHeight(3,20).getTabH.value;
});
onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(closeResetTimer)
})
</script>

<style lang="less" scoped>
.w200{
  width: 300px;
}
.label-wrapper{
  font-weight: 600;
}
.rateBox{
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 0 0 5px 5px;
  .titleBox{
    display: flex;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ddd;
    .rateTitle{
      flex: 1;
      width: 25%;
      text-align: center;
      font-weight: 600;
      border-right: 1px solid #ddd;
    }
    .borderNone{
      border-right: none;
    }
  }
  .rateConBox{
    width: 100%;
    .rateConItem{
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 31px;
      line-height: 30px;
      border-bottom: 1px solid #ddd;
      .itemInput{
        flex: 1;
        width: 25%;
        text-align: center;
        border-radius: 0;
        height: 30px;
        line-height: 30px;
        border-right: 1px solid #ddd;
        :deep(.ant-input-number){
          width: 100%;
          height: 30px;
          line-height: 30px;
          border-radius: 0;
          border: none;
          input{
            text-align: center!important;
          }
        }
        .ant-input-number-handler-wrap{
          border: none;
        }
        :deep(.ant-input-number-handler-wrap){
          display: none;
        }
      }
      .borderNone{
        border: none;
      }
    }
  }
  .addItem{
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-weight: 600;
    cursor: pointer;
    &:hover{
      background: #ddd;
    }
  }
}
</style>
