<template>
    <div class="search">
    </div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: '100%' }"
      bordered
      :row-key="(record: any) => JSON.stringify(record)"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'schemeTag'">
          {{ levelMap[Number(record.schemeTag)] }}
        </template>
        <template v-if="column.key === 'action'">
          <a-tag
            color="rgba(14, 186, 139, 1)"
            style="cursor: pointer"
            size="small"
            @click="checkDetail(record)"
            >{{ $t('b23') }}
          </a-tag>
          <a-tag
            color="rgba(22, 155, 213, 1)"
            style="cursor: pointer"
            size="small"
            @click="showEditPageFun(record)"
            >{{ $t("edit") }}
          </a-tag>
        </template>
      </template>
    </a-table>
    <a-modal
      v-model:open="showContent"
      width="50%"
      :title="levelMap[Number(planForm.schemeTag)]"
      style="text-align: center;"
      :footer="null"
    > 
      <div class="account_tag account_tag1">
        <div class="account_label">{{ $t('m324') }}</div>
        <div class="account_text">{{ planForm.schemeName }}</div>
      </div>
      <a-form
        :model="planForm"
        name="basic"
        autocomplete="off"
        style="text-align: left;"
      >
        <a-row >
          <a-col :span="12">
            <a-form-item name="schemeMaxPurchaseAmount">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('m325') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.schemeMaxPurchaseAmount"
                class="width24"
                :min="0"
              >
              <template #addonAfter>
                {{ 'ARB' }}
              </template>
              </a-input-number>
            </a-form-item>

            <a-form-item name="schemeMinPurchaseAmount">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('m326') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.schemeMinPurchaseAmount"
                disabled
                class="width24"
                :min="100"
              >
              <template #addonAfter>
                {{ 'ARB' }}
              </template>
              </a-input-number>
            </a-form-item>

            <a-form-item name="schemeMaxSellAmount" >
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('m327') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.schemeMaxSellAmount"
                class="width24"
                :min="0"
              >
              <template #addonAfter>
                {{ 'ARB' }}
              </template>
              </a-input-number>
            </a-form-item>
            <a-form-item name="schemeMinSellAmount" >
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('m328') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.schemeMinSellAmount"
                class="width24"
                :min="minSellMoneyNum"
                @input="minSellMoney($event,minSellMoneyNum)"
                @blur="emptyMsg"
              >
              <template #addonAfter>
                {{ 'ARB' }}
              </template>
              </a-input-number>
              <div style="font-size: 10px;color:red;">{{ errmsg }}</div>
            </a-form-item>
            <a-form-item name="schemeMaxSellOrderNum">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('m329') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.schemeMaxSellOrderNum"
                class="width24"
                :min="0"
              >
              <template #addonAfter>
                {{ $t('m113') }}
              </template>
              </a-input-number>
            </a-form-item>
          </a-col>

          <a-col :span="11">
            <!-- <a-form-item name="schemeSalesBonusProportion">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('m330') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.schemeSalesBonusProportion"
                class="width24"
                :min="0"
                :max="100"
              >
              <template #addonAfter>
                {{ '%' }}
              </template>
              </a-input-number>
            </a-form-item> -->

            <a-form-item name="schemeSalesBonusAmountLimit">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('m331') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.schemeSalesBonusAmountLimit"
                class="width24"
                :min="0"
              >
              <template #addonAfter>
                {{ 'ARB' }}
              </template>
              </a-input-number>
            </a-form-item>

            <a-form-item name="schemeSalesBonusNumLimit" >
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('m332') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.schemeSalesBonusNumLimit"
                class="width24"
                :min="0"
              >
              <template #addonAfter>
                {{ $t('m113') }}
              </template>
              </a-input-number>
            </a-form-item>
            <a-form-item name="schemeConfirmExpirationTime" >
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('m333') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.schemeConfirmExpirationTime"
                class="width24"
                :min="0"
              >
              <template #addonAfter>
                {{ $t('minute') }}
              </template>
              </a-input-number>
            </a-form-item>
            <a-form-item name="schemeSellMatchingDuration">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('m334') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.schemeSellMatchingDuration"
                class="width24"
                :min="0"
              >
              <template #addonAfter>
                {{ $t('minute') }}
              </template>
              </a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :wrapper-col="{ offset: 10 }">
          <a-popconfirm
            :title="$t('m364')"
            :ok-text="$t('yes')"
            :cancel-text="$t('no')"
            @confirm="updateContent"
          >
            <a-button style="margin-right: 14px;" type="primary">{{ $t('save') }}</a-button>
          </a-popconfirm>
          <a-button type="primary" html-type="close" @click="closeEdit">{{ $t('b10') }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:open="openDetail"
      width="50%"
      :title="levelMap[Number(planForm.schemeTag)]"
      style="text-align: center;"
      :footer="null"
    >
    <div class="account_tag">
        <div class="account_label">{{ $t('m324') }}</div>
        <div class="account_text">{{ planForm.schemeName }}</div>
      </div>
    <a-row>
      <a-col span="12">
        <div class="con_list">
          <div class="con_title">{{ $t('m325') }}</div>
          <div class="con_text">{{ planForm.schemeMaxPurchaseAmount }}<span>ARB</span></div>
        </div>
        <div class="con_list">
          <div class="con_title">{{ $t('m326') }}</div>
          <div class="con_text">{{ planForm.schemeMinPurchaseAmount }}<span>ARB</span></div>
        </div>
        <div class="con_list">
          <div class="con_title">{{ $t('m327') }}</div>
          <div class="con_text">{{ planForm.schemeMaxSellAmount }}<span>ARB</span></div>
        </div>
        <div class="con_list">
          <div class="con_title">{{ $t('m328') }}</div>
          <div class="con_text">{{ planForm.schemeMinSellAmount }}<span>ARB</span></div>
        </div>
        <div class="con_list">
          <div class="con_title">{{ $t('m329') }}</div>
          <div class="con_text">{{ planForm.schemeMaxSellOrderNum }}<span>{{ $t('m113') }}</span></div>
        </div>
      </a-col>
      <a-col span="10">
        <!-- <div class="con_list">
          <div class="con_title">{{ $t('m330') }}</div>
          <div class="con_text">{{ planForm.schemeSalesBonusProportion }}<span>%</span></div>
        </div> -->
        <div class="con_list">
          <div class="con_title">{{ $t('m331') }}</div>
          <div class="con_text">{{ planForm.schemeSalesBonusAmountLimit }}<span>ARB</span></div>
        </div>
        <div class="con_list">
          <div class="con_title">{{ $t('m332') }}</div>
          <div class="con_text">{{ planForm.schemeSalesBonusNumLimit }}<span>{{ $t('m113') }}</span></div>
        </div>
        <div class="con_list">
          <div class="con_title">{{ $t('m333') }}</div>
          <div class="con_text">{{ planForm.schemeConfirmExpirationTime }}<span>{{ $t('minute') }}</span></div>
        </div>
        <div class="con_list">
          <div class="con_title">{{ $t('m334') }}</div>
          <div class="con_text">{{ planForm.schemeSellMatchingDuration }}<span>{{ $t('minute') }}</span></div>
        </div>
      </a-col>
    </a-row>
    </a-modal>
  </template>
<script lang="ts" setup>
  import {
    tradeConfigSchemeAdmin,
    tradeConfigSchemeAdminUpdate
  } from "@/api/c2cconfig.api";
  import { onMounted, ref} from "vue";
  import { message } from "ant-design-vue";
  import { useI18n } from "vue-i18n";
  import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
  const { t } = useI18n();
  const dataSource = ref([]);
  const loading = ref(false);
  const errmsg = ref<any>();
  const minSellMoneyNum = ref(100);//设置最小卖出金额
  const levelMap = <any>{
    1: t('m359'),
    2: t('m360')
  };
  const accountTaglMap = <any>{
    1: t('m365'),
    2: t('c17')
  }
  const query = ref<any>({
    asc: true,
    column: '',
    pageNo: 1,
    pageSize: 20
  })
  const columns:any = [
    {
      title: t('m366'),
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: t('m367'),
      dataIndex: "schemeTag",
      key: "schemeTag",
      align: "center",
    },
    {
      title: t('m324'),
      dataIndex: "schemeName",
      key: "schemeName",
      align: "center",
    },
    {
      title: t('m368'),
      dataIndex: "updateTime",
      key: "updateTime",
      align: "center",
    },
    {
      title: t('l48'),
      dataIndex: "updateBy",
      key: "updateBy",
      align: "center",
    },
    {
      title: t("operation"),
      dataIndex: "action",
      key: "action",
      align: "center",
    },
  ];
  const getList = async () => {
    const res: any = await tradeConfigSchemeAdmin(query.value);
    if (res && res.code === "1") {
      dataSource.value = res.data;
    }
  };
  /****************Add edit***************/
  const showContent = ref(false);
  const planForm = <any>ref({});
  const isEdit = ref(false);
  const showEditPageFun = (data: any) => {
    selectedRow();
    planForm.value= JSON.parse(JSON.stringify(data));
    isEdit.value = true;
    showContent.value = true;
  };
  const openDetail = ref(false);
  let isClick = false;
  const updateContent = async () => {
    const {id, schemeConfirmExpirationTime, schemeMaxPurchaseAmount, schemeMaxSellAmount, schemeMaxSellOrderNum, schemeSellMatchingDuration,
      schemeMinPurchaseAmount, schemeMinSellAmount, schemeSalesBonusAmountLimit, schemeSalesBonusNumLimit, } = planForm.value;
    if(isClick) return;
    isClick = true;
    const updataQ = ref({
      id, schemeConfirmExpirationTime, schemeMaxPurchaseAmount, schemeMaxSellAmount, schemeMaxSellOrderNum, schemeSellMatchingDuration,
        schemeMinPurchaseAmount, schemeMinSellAmount, schemeSalesBonusAmountLimit, schemeSalesBonusNumLimit,
    });
    const res: any = await tradeConfigSchemeAdminUpdate(updataQ.value);
    if (res && res.code === '1') {
      message.success(t('s14'));
      isClick = false;
      showContent.value = false;
      getList();
    }
};
const closeEdit = () =>{
  showContent.value = false;
}
const checkDetail = (value: any) => {
  selectedRow();
  planForm.value=value
  openDetail.value = true;
};
const minSellMoney = (event:any,num:number) => {
  if(isNaN(Number(event))){
    errmsg.value= t('m574');
  }else if(Number(event)<num){
    errmsg.value= `${t('m562')}>=${num}`;
  }else{
    errmsg.value= '';
  }
}
const emptyMsg = () => {
  errmsg.value= '';
}
onMounted(() => {
  getList();
});
</script>

<style lang="less" scoped>
.con_list{
  width: 100%;
  height: 46px;
  >div{
    float: left;
    height: 46px;
    line-height: 46px;
    >span{
      padding-left: 5px;
    }
  }
  .con_title{
    min-width: 200px;
    text-align: left;
    padding-left: 12px;
    font-weight: 600;
    &::after{
      content: ':';
      padding-right: 12px;
    }
  }
}
.account_tag1{
  margin-bottom: 24px;
}
.account_tag{
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 12px;
  border-radius: 5px;
  background-color: #f0f0f0;
  >div{
    float: left;
    line-height: 36px;
    font-size: 16px;
    &.account_label{
      font-weight: 600;
      &::after{
        content: ':';
        padding-right: 10px;
      }
    }
  }
}
.ant-col{
  text-align: left;
}
:deep(label){
  width: 100%;
  height: 100%;
  padding-left: 12px;
}
.label-wrapper{
  text-align: left;
  font-weight: 600;
}
</style>
  