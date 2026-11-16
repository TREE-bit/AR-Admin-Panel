<template>
  <a-form
    ref="formRef"
    :model="configState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finishFailed="onFinishFailed"
  >
    <div class="config_card_content">
      <a-row class="antChangeBox">
        <h3 style="padding-left: 20px;width: 100%;">{{ $t('n527') }}</h3>
        <a-col :span="12">
          <!-- <a-form-item
            :label="$t('l22')"
            name="isSplitOrder"
          >
            <a-switch v-model:checked="checkSplit " @click="changeAddChecked" />
          </a-form-item> -->
          <a-form-item
            :label="$t('m844')"
            name="referrerCommissionRatioWhileBuy"
          >
            <a-input-number
              v-model:value="configState.referrerCommissionRatioWhileBuy"
              :min="0"
              class="width24"
            ><template #addonAfter>
              %
            </template>
            </a-input-number>
            <tipTemplate :info="$t('n387')"/>
            <!-- <div class="config-tipMsg">{{ $t("m845") }}</div> -->
          </a-form-item>

          <a-form-item
          :label="$t('m846')"
            name="referrerAgainCommissionRatioWhileBuy"
          >
            <a-input-number
              v-model:value="configState.referrerAgainCommissionRatioWhileBuy"
              :min="0"
              class="width24"
              ><template #addonAfter>
                %
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n388')"/>
            <!-- <div class="config-tipMsg">{{ $t("m847") }}</div> -->
          </a-form-item>
          <a-form-item
          :label="$t('n602')"
            name="benefitOrderMaxSplitTimes"
          >
            <a-input-number
              v-model:value="configState.benefitOrderMaxSplitTimes"
              :min="0"
              :max="30"
              class="width24"
              ><template #addonAfter>
                {{ $t('m113') }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n603')"/>
            <!-- <div class="config-tipMsg">{{ $t("m847") }}</div> -->
          </a-form-item>
          <a-form-item
          :label="$t('n642')"
            name="quickWithdrawTimeout"
          >
            <a-input-number
              v-model:value="configState.quickWithdrawTimeout"
              :min="0"
              class="width24"
              ><template #addonAfter>
                {{ $t('minute') }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n643')"/>
          </a-form-item>
          <a-form-item
          :label="$t('n1387')"
            name="quickWithdrawKycConnectionTimeout"
          >
            <a-input-number
              v-model:value="configState.quickWithdrawKycConnectionTimeout"
              :min="0"
              class="width24"
              ><template #addonAfter>
                {{ $t('minute') }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n1388')"/>
          </a-form-item>
          <!-- <a-form-item
          :label="$t('n636')"
            name="quickWithdrawKycConnectionTimeout"
          >
            <a-input-number
              v-model:value="configState.quickWithdrawKycConnectionTimeout"
              :min="0"
              class="width24"
              ><template #addonAfter>
                {{ $t('minute') }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n637')"/>
          </a-form-item> -->
          <!-- <a-form-item
          :label="$t('n638')"
            name="quickWithdrawPreBuyLockedTime"
          >
            <a-input-number
              v-model:value="configState.quickWithdrawPreBuyLockedTime"
              :min="0"
              class="width24"
              ><template #addonAfter>
                {{ $t('s') }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n639')"/>
          </a-form-item> -->
        </a-col>
        <a-col :span="11">
          <a-form-item
            :label="$t('m848')"
            name="referrerCommissionRatioWhileSell"
          >
            <a-input-number
              v-model:value="configState.referrerCommissionRatioWhileSell"
              :min="0"
              class="width24"
            ><template #addonAfter>
              %
            </template>
            </a-input-number>
            <tipTemplate :info="$t('n389')"/>
            <!-- <div class="config-tipMsg">{{ $t("m849") }}</div> -->
          </a-form-item>

          <a-form-item
          :label="$t('m850')"
            name="referrerAgainCommissionRatioWhileSell"
          >
            <a-input-number
              v-model:value="configState.referrerAgainCommissionRatioWhileSell"
              :min="0"
              class="width24"
              ><template #addonAfter>
                %
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n390')"/>
            <!-- <div class="config-tipMsg">{{ $t("m851") }}</div> -->
          </a-form-item>
          <a-form-item
          :label="$t('n640')"
            name="quickWithdrawMaximumBuyPullTransactions"
          >
            <a-input-number
              v-model:value="configState.quickWithdrawMaximumBuyPullTransactions"
              :min="0"
              class="width24"
              ><template #addonAfter>
                {{ $t('times') }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n641')"/>
            <!-- <div class="config-tipMsg">{{ $t("m847") }}</div> -->
          </a-form-item>
          <a-form-item
          :label="$t('n661')"
            name="quickWithdrawFailLockOrderTime"
          >
            <a-input-number
              v-model:value="configState.quickWithdrawFailLockOrderTime"
              :min="0"
              class="width24"
              ><template #addonAfter>
                {{ $t('minute') }}
              </template>
            </a-input-number>
            <tipTemplate :info="$t('n662')"/>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- <a-row class="antChangeBox" >
        <h3 style="padding-left: 20px; width: 100%;">{{ $t('n528') }}</h3>
        <a-col class="antChangeBox" >
          <h4 style="padding-left: 20px;">{{ $t('n529') }}：</h4>
          <a-form-item
            :label="$t('memberListC6')"
            name="condition1.buyCount"
          >
            <a-input-number
              v-model:value="condition1.buyCount"
              :min="0"
            >
            <template #addonAfter>
              {{ $t("times") }}
            </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            :label="$t('memberListC8')"
            name="condition1.sellCount"
          >
            <a-input-number
              v-model:value="condition1.sellCount"
              :min="0"
            >
            <template #addonAfter>
              {{ $t("times") }}
            </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            :label="$t('m444')"
            name="condition1.rechargeCount"
          >
            <a-input-number
              v-model:value="condition1.rechargeCount"
            >
            <template #addonAfter>
              {{ $t("times") }}
            </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            :label="$t('m446')"
            name="condition1.withdrawCount"
          >
            <a-input-number
              v-model:value="condition1.withdrawCount"
              :min="0"
            >
            <template #addonAfter>
              {{ $t("times") }}
            </template>
            </a-input-number>
          </a-form-item>
        </a-col>
        <a-col class="antChangeBox">
          <h4 style="padding-left: 20px;">{{ $t('n530') }}：</h4>
          <a-form-item
            :label="$t('n532')"
            name="condition2.buyCount"
          >
            <a-input-number
              v-model:value="condition2.buyCount"
              :min="0"
            >
            <template #addonAfter>
              {{ $t("times") }}
            </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            :label="$t('m444')"
            name="condition2.rechargeCount"
          >
            <a-input-number
              v-model:value="condition2.rechargeCount"
              :min="0"
            >
            <template #addonAfter>
              {{ $t("times") }}
            </template>
            </a-input-number>
          </a-form-item>
        </a-col>
        <a-col class="antChangeBox" >
          <h4 style="padding-left: 20px;">{{ $t('n531') }}：</h4>
          <a-form-item
            :label="$t('n533')"
            name="condition3.sellCount"
          >
            <a-input-number
              v-model:value="condition3.sellCount"
              :min="0"
            >
            <template #addonAfter>
              {{ $t("times") }}
            </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            :label="$t('m446')"
            name="condition3.withdrawCount"
          >
            <a-input-number
              v-model:value="condition3.withdrawCount"
              :min="0"
            >
            <template #addonAfter>
              {{ $t("times") }}
            </template>
            </a-input-number>
          </a-form-item>
        </a-col>
      </a-row> -->
      <a-row >
        <!-- <a-col class="antChangeBox">
          <h3 style="padding-left: 20px;">{{ $t('n534') }}</h3>
          <div class="antUserConfig">
            <div class="antUserConfig-titleBox">
              <div class="antUserConfig-title">
                {{ $t("sort") }}
              </div>
              <div class="antUserConfig-title">
                {{ $t("memberListC10") }}
              </div>
              <div class="antUserConfig-title">
                {{ $t("n513") }}
              </div>
              <div class="antUserConfig-title">
                {{ $t("operation") }}
              </div>
              <div class="antUserConfig-title">
                {{ $t("memberListC10") }}
              </div>
            </div>
            <div class="antUserConfig-content">
              <div class="antUserConfig-itemBox" v-for="(item, index) in antMemberList" :key="index">
                <div class="antUserConfig-item">
                  <div class="antUserConfig-item-content">
                    {{ item.sort }}
                  </div>
                  <div class="antUserConfig-item-content">
                    {{ item.memberType }}
                  </div>
                  <div class="antUserConfig-item-content">
                    {{ item.memberGroup }}
                  </div>
                  <div class="antUserConfig-item-content">
                    <span class="pointer" v-if="index != antMemberList.length-1" @click="toDown(antMemberList,item)">↓</span>
                    &nbsp;
                    <span class="pointer" v-if="index != 0" @click="toUp(antMemberList,item)">↑</span>
                  </div>
                  <div class="antUserConfig-item-content">
                    <span :class="item.groupList.length > 0 ?'pointer':''" @click="item.groupList.length > 0 ? showChild(item) : ''">{{ item.groupList.length > 0 ? '+' : '-' }}</span>
                  </div>
                </div>
                <div class="antUserConfig-item-childBox" v-if="item.groupList.length > 0">
                  <transition
                    @before-enter="beforeEnterHeight"
                    @enter="enterHeight"
                    @after-enter="afterEnterHeight"
                    @before-leave="beforeLeaveHeight"
                    @leave="leaveHeight"
                    @after-leave="afterLeaveHeight"
                  >
                    <div v-show="item.show" class="antUserConfig-item-childBox">
                      <div class="antUserConfig-item-child" v-for="(citem, cindex) in item.groupList" :key="cindex">
                        <div class="antUserConfig-item-content">
                          {{ citem.sort }}
                        </div>
                        <div class="antUserConfig-item-content">
                          {{ citem.memberType }}
                        </div>
                        <div class="antUserConfig-item-content">
                          {{ citem.memberGroup }}
                        </div>
                        <div class="antUserConfig-item-content">
                          <span class="pointer" v-if="cindex != item.groupList.length-1" @click="toDown(item.groupList,citem)">↓</span>
                          &nbsp;
                          <span class="pointer" v-if="cindex != 0" @click="toUp(item.groupList,citem)">↑</span>
                        </div>
                        <div class="antUserConfig-item-content">
                          {{ citem.groupList && citem.groupList.length > 0 ? '+' : '-' }}
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </a-col> -->
        <a-col class="antChangeBox" :span="12">
          <h3 style="padding-left: 20px;">{{ $t('n535') }}</h3>
          <div class="antUserConfig">
            <div class="antUserConfig-titleBox">
              <div class="antUserConfig-title">
                {{ $t("sort") }}
              </div>
              <div class="antUserConfig-title">
                {{ $t("n536") }}
              </div>
              <div class="antUserConfig-title">
                {{ $t("n537") }}
              </div>
            </div>
            <div class="antUserConfig-content">
              <div class="antUserConfig-itemBox" v-for="(item, index) in upiLimit" :key="index">
                <div class="antUserConfig-item">
                  <div class="antUserConfig-item-content">
                    {{ item.antLevelGroupType }}
                  </div>
                  <div class="antUserConfig-item-content">
                    {{ $getMapItem(groupIdMap,Number(item.antLevelGroupType)) }}
                  </div>
                  <div class="antUserConfig-item-content">
                    <input type="number"
                      :disabled="upiInputType[index]"
                      v-model="item.limitCount"
                      :min="0"
                      class="upiLimitInput"
                    />
                    <EditOutlined class="upiCountInputEdit" v-if="upiInputType[index]" @click="showUpiInput(index)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col class="antChangeBox" :span="12">
          <h3 style="padding-left: 20px;width: 100%;">{{ $t('n604') }}</h3>
          <div class="antUserConfig">
            <div class="antUserConfig-titleBox">
              <div class="antUserConfig-title">{{ $t("sort") }}</div>
              <div class="antUserConfig-title">{{ $t("m413") }}</div>
              <div class="antUserConfig-title">{{ $t("n605") }}</div>
              <div class="antUserConfig-title">{{ $t("n606") }}</div>
              <div class="antUserConfig-title">{{ $t("n607") }}</div>
              <div class="antUserConfig-title">{{ $t("operation") }}</div>
            </div>
            <div class="antUserConfig-content">
              <div class="antUserConfig-itemBox" v-for="(item, index) in antRangList" :key="index">
                <div class="antUserConfig-item">
                  <div class="antUserConfig-item-content">
                    {{ item.rangeSort }}
                  </div>
                  <div class="antUserConfig-item-content">
                    {{ item.rangeName }}
                  </div>
                  <div class="antUserConfig-item-content">
                    <input type="number" :min="0" :disabled="antSplitEdit[index]" :placeholder="item.limitLower ? '': '/'" v-model="item.limitLower" class="upiLimitInput antSplitInput" />
                  </div>
                  <div class="antUserConfig-item-content">
                    <input type="number" :min="item.limitLower" :disabled="antSplitEdit[index]" :placeholder="item.limitUpper ? '': '/'" v-model="item.limitUpper" class="upiLimitInput" />
                  </div>
                  <div class="antUserConfig-item-content">
                    <input type="number" :min="0" :disabled="antSplitEdit[index]" :placeholder="item.times ? '': '/'" v-model="item.times" class="upiLimitInput" />
                  </div>
                  <div class="antUserConfig-item-content">
                    <a-button
                      type="primary"
                      size="small"
                      @click="splitEdit(index) "
                      class="pointer"
                      ><EditOutlined /></a-button>
                    <a-popconfirm
                      :title=" $t('m364') "
                      :ok-text="$t('yes')"
                      :cancel-text="$t('no')"
                      @confirm="antRangSave(item)"
                      :ok-button-props="{ loading: loading }"
                    >
                      <a-button
                        type="primary"
                        size="small"
                        v-permission="'admin:tradeConfigAdmin:updateSell'"
                        >{{ $t("save") }}</a-button
                      >
                    </a-popconfirm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="antChangeBox">
        <h3 style="padding-left: 20px;width: 100%;">
          {{ $t('n717') }}
          <tipTemplate :info="$t('n718')"/>
        </h3>
        <a-col :span="12">
          <a-form-item
            :label="$t('n719')"
            name="antSelectedTabCode"
          >
            <a-select
              v-model:value="configState.antSelectedTabCode"
              :placeholder="$t('n720')"
              style="width: 80%;"
              :options="Object.entries(antBuyShowUserMap).map(([key, value]) => ({ label: value, value: Number(key) }))"
              >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="11">
          <a-form-item
          :label="$t('n721')"
            name="nonAntSelectedTabCode"
          >
            <a-select
              v-model:value="configState.nonAntSelectedTabCode"
              :placeholder="$t('n722')"
              style="width: 80%;"
              :options="Object.entries(antBuyShowUserMap).map(([key, value]) => ({ label: value, value: Number(key) }))"
              >
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ offset: 11, span: 16 }">
        <a-popconfirm
          :title=" $t('m364') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="onFinish"
          :ok-button-props="{ loading: loading }"
        >
          <a-button
            type="primary"
            v-permission="'admin:tradeConfigAdmin:mayiUpdate'"
            >{{ $t("save") }}</a-button
          >
        </a-popconfirm>
      </a-form-item>
    </div>
  </a-form>
</template>

<script lang="ts" setup>
import { updateAntConfig, getAntConfigRangeList, updateAntConfigRange } from "@/api/c2cconfig.api";
import { EditOutlined } from "@ant-design/icons-vue";
import { publicConfig } from "@/hooks/usePublicConfig.hook";
import { message,FormInstance } from "ant-design-vue";
import { groupIdMap,antBuyShowUserMap } from "@/utils/publicData";
import tipTemplate from "../Other/tipTemplate.vue";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { beforeEnterHeight, enterHeight, afterEnterHeight, beforeLeaveHeight, leaveHeight, afterLeaveHeight } from "@/utils/ani";
const { t } = useI18n();
const { getConfig, configState } = publicConfig();
const antRangList: any = ref([]);
const loading = ref(false);
const formRef = ref<FormInstance | null>(null);
const checkSplit = ref<boolean>(false);
const manualReview = ref<boolean>(false);
const antTimes = computed(() =>
  antRangList.value.reduce((sum:number, item:any) => sum + (item?.times || 0), 0)
);
const antSplitEdit = ref([true, true, true, true, true, true, ]);
const upiInputType = ref<boolean[]>([
  true, true, true, true, true, true, true, true, true, true
]);
// const condition1:any = computed(() => {
//   return configState.value.conversionAntConditions.find(
//     (item: any) => item.conditionId == '1'
//   );
// });
// const condition2:any = computed(() => {
//   return configState.value.conversionAntConditions.find(
//     (item: any) => item.conditionId == '2'
//   );
// });
// const condition3:any = computed(() => {
//   return configState.value.conversionAntConditions.find(
//     (item: any) => item.conditionId == '3'
//   );
// });
const upiLimit = computed(() => {
  return configState.value.antGroupReceiptsDailyLimit.filter(
    (item: any) => item.antLevelGroupType != 0
  );
});
const antMemberList = ref<any[]>([
  { memberType:1, memberGroup:1, sort:1,show:false,groupList:[
    {memberType:1, memberGroup:1, sort:1},
    {memberType:2, memberGroup:2, sort:2},
    {memberType:3, memberGroup:3, sort:3},
    {memberType:4, memberGroup:4, sort:4},
  ] },
  { memberType:2, memberGroup:2, sort:2,show:false,groupList:[
    {memberType:1, memberGroup:1, sort:1},
    {memberType:2, memberGroup:2, sort:2},
    {memberType:3, memberGroup:3, sort:3},
    {memberType:4, memberGroup:4, sort:4},
  ] },
  { memberType:3, memberGroup:3, sort:3,show:false,groupList:[
    {memberType:1, memberGroup:1, sort:1},
    {memberType:2, memberGroup:2, sort:2},
    {memberType:3, memberGroup:3, sort:3},
    {memberType:4, memberGroup:4, sort:4},
  ] },
  { memberType:4, memberGroup:4, sort:4,show:false,groupList:[] }
]);
const showUpiInput = (index: number) => {
  upiInputType.value.forEach((item, idx) => {
    if (idx !== index) {
      upiInputType.value[idx] = true; // 其他输入框恢复为只读状态
    }
  });
  upiInputType.value[index] = !upiInputType.value[index];
};
const showChild = (item:any) => {
  item.show = !item.show;
};
const toUp = (list:any,item:any) => {
  const index = list.indexOf(item)
  const target = event.target as HTMLElement;
  if (index > 0) {
    [list[index - 1], list[index]] = [list[index], list[index - 1]];
    updateSort(list);
    updataClor(index-1,target);
  }
};
let parent: HTMLElement | null = null;
const toDown = (list:any,item:any) => {
  const index = list.indexOf(item)
  const target = event.target as HTMLElement;
  if (index < list.length - 1) {
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    updateSort(list);
    updataClor(index+1,target);
  }
};

const updateSort = (list:any) => {
  list.forEach((item: { sort: any; groupList: string | any[]; }, idx: number) => {
    item.sort = idx + 1
    if (item.groupList && item.groupList.length > 0) {
      updateSort(item.groupList) // 递归处理子列表
    }
  });
}
const updataClor = (index:any=null,target:any=null) => {
  if (parent) {
    parent.classList.remove('itemActive');
  }
  let p1 = target.closest('.antUserConfig-content') as HTMLElement | null;
  let p2 = target.closest('.antUserConfig-item-childBox') as HTMLElement | null;
  if(p2) {
    parent = p2?.children[index] as HTMLElement | null;
    p1 = null;
  }
  if(p1) {
    parent = p1?.children[index].children[0] as HTMLElement | null;
    antMemberList.value.forEach((item:any) => {
      item.show = false; // 重置所有项的显示状态
    });
  }
  if (parent) {
    parent.classList.add('itemActive');
  } else {
    console.log('未找到父级元素');
  }
};
// const changeAddChecked = () => {
//   checkSplit.value
//     ? (configState.value.isSplitOrder = 1)
//     : (configState.value.isSplitOrder = 0);
// };
// const changeManualChecked = () => {
//   manualReview.value
//     ? (configState.value.isManualReview = 1)
//     : (configState.value.isManualReview = 0);
// };
const onFinish = async () => {
  formRef.value?.validate().then(async (values) => {
    if (antTimes.value > configState.value.benefitOrderMaxSplitTimes) {
      message.error(t("n608"));
      return;
    }
    loading.value = true;
    const res: any = await updateAntConfig(
      Object.assign(values, { id: configState.value.id },{
        // conversionAntConditions: configState.value.conversionAntConditions,
        antGroupReceiptsDailyLimit: configState.value.antGroupReceiptsDailyLimit,
      })
    ).finally(() => {
      loading.value = false;
    });
    if (res && res.code === "1") {
      message.success(t("s1"));
      upiInputType.value = upiInputType.value.map(() => true); // 重置输入框状态
      getConfig();
    }
  });
};
const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
const getRangeList = async () => {
  const res:any = await getAntConfigRangeList();
  if (res && res.code == "1") {
    antRangList.value = res.data;
  }
};
const splitEdit = (index: number) => {
  antSplitEdit.value.forEach((item: any, i: number) => {
    antSplitEdit.value[i] = i === index ? !item : true;
  });

  nextTick(() => {
    const antSplitInput = document.querySelectorAll(".antSplitInput");
    if (antSplitInput[index]) {
      (antSplitInput[index] as HTMLInputElement).focus();
    }
  });
};

const antRangSave = async (item: any) => {
  let isHsa = antRangList.value.filter((k:any) => k.id !== item.id )
  .some((i:any) => i.limitLower == item.limitLower && i.limitUpper == item.limitUpper);
  if (!item.limitLower && !item.limitUpper) {
    isHsa = false;
  }
  if (isHsa) {
    message.error(t("n615"));
    return;
  }
  if (antTimes.value > configState.value.benefitOrderMaxSplitTimes) {
    message.error(t("n609"));
    return;
  }
  loading.value = true;
  const res:any = await updateAntConfigRange({
    id: item.id,
    limitLower: item.limitLower,
    limitUpper: item.limitUpper,
    times: item.times,
  }).finally(() => {
    loading.value = false;
    antSplitEdit.value.forEach((item: any, i: number) => {
      antSplitEdit.value[i] = true;
    });
    getRangeList();
  });
  if (res && res.code == "1") {
    message.success(t("s1"));
    antSplitEdit.value.forEach((item: any, i: number) => {
      antSplitEdit.value[i] = true;
    });
    getRangeList();
  }
};
onMounted(() => {
  getConfig();
  getRangeList();
});
</script>

<style lang="less" scoped>
.width24 {
  width: 240px;
}
.width20 {
  width: 200px;
}
.container {
  display: flex;
  & > div {
    width: 50%;
  }
}
.config-tipMsg{
  font-size: 11px;
  color: #02A7F0;
}
:deep(.tipIcon){
  margin-top: 8px;
}
.antChangeBox {
  flex: 1;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  box-shadow: #d9d9d9 0px 2px 8px;
}
.antUserConfig{
  width: 100%;
  border-left: 1px solid #e8e8e8;
  border-top: 1px solid #e8e8e8;
  .antUserConfig-titleBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .antUserConfig-title {
      height: 40px;
      line-height: 40px;
      flex: 1;
      text-align: center;
      font-weight: bold;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }
  }
  .antUserConfig-content {
    .antUserConfig-itemBox {
      flex: 1;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      border-right: 1px solid #e8e8e8;
      .antUserConfig-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background-color: #fff;
        position: relative;
        .antUserConfig-item-content {
          flex: 1;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          text-align: center;
          border-right: 1px solid #e8e8e8;
          border-bottom: 1px solid #e8e8e8;
          &:last-child {
            border-right: none;
          }
        }
      }
      .antUserConfig-item-childBox {
        width: 100%;
        font-size: 10px;
        .antUserConfig-item-child {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f1f1f1;
          .antUserConfig-item-content {
            width: 20%;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-right: 1px solid #e8e8e8;
            border-bottom: 1px solid #e8e8e8;
            &:last-child {
              border-right: none;
            }
          }
        }
      }
    }
  }
}
.pointer{
  cursor: pointer;
}
.upiLimitInput{
  width: 100%;
  display: block;
  height: 28px;
  text-align: center;
  border: none;
}
.upiCountInputEdit {
  position: absolute;
  right: 20px;
  top: 6px;
  color: #999;
  cursor: pointer;
}
.itemActive {
  background-color: #e6f7ff!important;
}
.antChangeBox {
  flex: 1;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  box-shadow: #d9d9d9 0px 2px 8px;
}
.antUserConfig{
  width: 100%;
  border-left: 1px solid #e8e8e8;
  border-top: 1px solid #e8e8e8;
  .antUserConfig-titleBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .antUserConfig-title {
      height: 40px;
      line-height: 40px;
      flex: 1;
      text-align: center;
      font-weight: bold;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }
  }
  .antUserConfig-content {
    .antUserConfig-itemBox {
      flex: 1;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      border-right: 1px solid #e8e8e8;
      .antUserConfig-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background-color: #fff;
        position: relative;
        .antUserConfig-item-content {
          flex: 1;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          text-align: center;
          border-right: 1px solid #e8e8e8;
          border-bottom: 1px solid #e8e8e8;
          &:last-child {
            border-right: none;
          }
        }
      }
      .antUserConfig-item-childBox {
        width: 100%;
        font-size: 10px;
        .antUserConfig-item-child {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f1f1f1;
          .antUserConfig-item-content {
            width: 20%;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-right: 1px solid #e8e8e8;
            border-bottom: 1px solid #e8e8e8;
            &:last-child {
              border-right: none;
            }
          }
        }
      }
    }
  }
}
.pointer{
  cursor: pointer;
}
.upiLimitInput{
  width: 100%;
  display: block;
  height: 28px;
  text-align: center;
  border: none;
}
.upiCountInputEdit {
  position: absolute;
  right: 20px;
  top: 6px;
  color: #999;
  cursor: pointer;
}
.itemActive {
  background-color: #e6f7ff!important;
}
</style>
