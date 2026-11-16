<template>
    <div class="search">
      <a-button type="primary" v-permission="'admin:rewardCardConfigAdmin:save'" @click="showAddPage()">
        {{ $t("add") }}
      </a-button>
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
        <template v-if="column.key === 'title'">
          <a-tooltip v-if="record.title">
            <template #title>
              {{ record.title }}
            </template>
           <div class="toopTipStyle">{{ record.title }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
          <template v-if="column.key === 'validityType'">
            {{ $getMapItem(validityTypeMap,record.validityType) || '-' }}
          </template>
        <template v-if="column.key === 'cardType'">
          {{ $getMapItem(cardTypeMap,record.cardType) || '-' }}
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status == 1?'green':'red'">{{ record.status == 1 ? $t('enabled') : $t('disabled') }}</a-tag>
        </template>
        <template v-if="column.key === 'createTime'">
          {{ record.createTime || '-' }}
        </template>
        <template v-if="column.key === 'createBy'">
          {{ record.createBy || '-' }}
        </template>
        <template v-if="column.key === 'updateTime'">
          {{ record.updateTime || '-' }}
        </template>
        <template v-if="column.key === 'updateBy'">
          {{ record.updateBy || '-' }}
        </template>
        <template v-if="column.key === 'action'">
          <a-tag
            color="rgba(22, 155, 213, 1)"
            style="cursor: pointer"
            size="small"
            @click="showEditPageFun(record)"
            v-permission="'admin:rewardCardConfigAdmin:update'"
            >{{ $t("edit") }}
          </a-tag>
          
          <a-popconfirm
            :title="record.status == 1 ? $t('m768') : $t('m767')"
            :ok-text="$t('yes')"
            :cancel-text="$t('no')"
            @confirm="changeStatus(record.id,record.status)"
          >
            <a-tag
              :color="record.status == 1?'red':'green'"
              style="cursor: pointer"
              size="small"
              v-permission="'admin:rewardCardConfigAdmin:updateStatus'"
              >{{ record.status == 1 ? $t('disabled') : $t('enabled') }}
            </a-tag>
            </a-popconfirm>
        </template>
      </template>
    </a-table>
    <a-modal
      v-model:open="showContent"
      :width="1200"
      :title="isAdd ? $t('add') : isEdit ? $t('edit') : ''"
      :footer="null"
    > 
      <a-form
        :model="planForm"
        name="basic"
        autocomplete="off"
        style="text-align: left;"
      >
        <a-row >
          <a-col :span="10">
            <a-form-item name="title" :rules="[{ required: true, message: '' }]">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('n1096') }}</span>
                </div>
              </template>
              <a-input v-trim
                v-model:value="planForm.title"
                class="width20"
                :maxlength="40"
              >
              </a-input>
            </a-form-item>

            <a-form-item name="amount" :rules="[{ required: true, message: '' }]">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('n1097') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.amount"
                class="width20"
                :disabled="true"
                :min="100"
              >
              </a-input-number>
            </a-form-item>

            <a-form-item name="maxUsageCount">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('n1106') }}</span>
                </div>
              </template>
              <a-input-number
                v-model:value="planForm.maxUsageCount"
                class="width20"
                :min="0"
              >
              <template #addonAfter>
                {{ $t('times') }}
              </template>
              </a-input-number>
              <div style="font-size: 10px;color:red;">{{ $t('n1107') }}</div>
            </a-form-item>
            <a-form-item name="cardType"  :rules="[{ required: true, message: '' }]">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('n1108') }}</span>
                </div>
              </template>
              <a-select
                v-model:value="planForm.cardType"
                class="width20"
                >
                <a-select-option v-for="(item, key) in cardTypeMap" :value="Number(key)">{{
                  item
                }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item name="activateType"  :rules="[{ required: true, message: '' }]">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('n1109') }}</span>
                </div>
              </template>
              <a-select
                v-model:value="planForm.activateType"
                class="width20"
                :options="Object.keys(activateTypeMap).map(key => ({ label: activateTypeMap[key], value: Number(key) }))"
                >
                
              </a-select>
            </a-form-item>
            <a-form-item name="activateType"  :rules="[{ required: true, message: '' }]">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('n1126') }}</span>
                </div>
              </template>
              <a-select
                v-model:value="planForm.validityType"
                class="width20"
                :options="Object.keys(validityTypeMap).map(key => ({ label: validityTypeMap[key], value: Number(key) }))"
                >
                
              </a-select>
            </a-form-item>
            <a-form-item name="effectiveStartTime">
              <template #label>
                <div class="label-wrapper">
                  <span style="color:red;padding-right: 4px;">*</span><span>{{ $t('n1110') }}</span>
                </div>
              </template>
              <a-form-item-rest>
                <timeRange v-model:startTime="planForm.effectiveStartTime" v-model:endTime="planForm.effectiveEndTime" 
                :width="140"  :type="1" :hideFooterBtn="true" :disableToday="true" :isBefor="true" />
              </a-form-item-rest>
            </a-form-item>
            <a-form-item name="status"  :rules="[{ required: true, message: '' }]">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('state') }}</span>
                </div>
              </template>
              <a-switch
                v-model:checked="planForm.status"
                :checkedChildren="$t('enabled')"
                :unCheckedChildren="$t('disabled')"
                :checkedValue="1"
                :unCheckedValue="0"
              />
            </a-form-item>
          </a-col>

          <a-col :span="14">
            <!-- <a-form-item name="coverUrl" :rules="[{ required: true, message: '' }]">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('n1111') }}</span>
                </div>
              </template>
              <Upload v-if="showContent" v-model:value="planForm.coverUrl"  
              @startUpload="startUpload"  @finishUpload="finishUpload"/>
            </a-form-item> -->

            <a-form-item name="description" :rules="[{ required: true, message: '' }]">
              <template #label>
                <div class="label-wrapper">
                  <span>{{ $t('n1112') }}</span>
                </div>
              </template>
              <AiEditor
                v-if="showContent"
                :announcementContent="planForm.description"
                @change="setAnnouncementContent"
                @start="startUpload"
                @finish="finishUpload"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :wrapper-col="{ offset: 10 }">
          <a-button style="margin-right: 14px;" :loading="loading" @click="saveForm" type="primary">{{ $t('save') }}</a-button>
          <a-button type="primary"  @click="closeContent">{{ $t('b10') }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
<script lang="ts" setup>
  import {
    rewardCardConfigAdminListPage,
    rewardCardConfigAdminSave,
    rewardCardConfigAdminUpdate,
    rewardCardConfigAdminUpdateStatus,
  } from "@/api/c2cconfig.api";
  import { onMounted, ref,defineAsyncComponent} from "vue";
  import { message } from "ant-design-vue";
  import Upload from '@/components/Upload/index.vue'
  import { useI18n } from "vue-i18n";
  import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { deepClone } from "@ar/shared";
  const AiEditor = defineAsyncComponent(() => import('@/components/aieditor.vue'));
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
    pageSize: 20,
    cardType: undefined,
    status: undefined,
    title: undefined,
  })
  const validityTypeMap = <any>{
    0: t('n1113'),//不限制
    1: t('n1114'),//7天
    2: t('n1115'),//15天
    3: t('n1116'),//30天
  }
  const cardTypeMap = <any>{
    1: t('n1117'),//卖出奖励卡
  }
  const activateTypeMap = <any>{
    1: t('n747'),//添加KYC
  }
  const columns:any = [
    {
      title: t("e47"),
      align: "center",
      width: 60,
      customRender: ({ index }: { index: number }) => index + 1,
    },
    {
      title: t('n1096'),
      dataIndex: "title",
      key: "title",
      align: "center",
      width: 140,
    },
    {
      title: t('n1097'),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: 100,
    },
    {
      title: t('n1118'),
      dataIndex: "validityType",
      key: "validityType",
      align: "center",
      width: 100,
    },
    {
      title: t('n1108'),
      dataIndex: "cardType",
      key: "cardType",
      align: "center",
      width: 100,
    },
    {
      title: t('state'),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
    },
    {
      title: t('l50'),
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 140,
    },
    {
      title: t('l66'),
      dataIndex: "createBy",
      key: "createBy",
      align: "center",
      width: 100,
    },
    {
      title: t('l71'),
      dataIndex: "updateTime",
      key: "updateTime",
      align: "center",
      width: 140,
    },
    {
      title: t('n1013'),
      dataIndex: "updateBy",
      key: "updateBy",
      align: "center",
      width: 100,
    },
    {
      title: t("operation"),
      dataIndex: "action",
      key: "action",
      align: "center",
      width: 100,
    },
  ];
  const getList = async () => {
    loading.value = true;
    const res: any = await rewardCardConfigAdminListPage(query.value).finally(()=>loading.value = false);
    if (res && res.code === "1") {
      dataSource.value = res.data;
    }
  };
  const reset = async () => {
    query.value = {
      asc: true,
      column: '',
      pageNo: 1,
      pageSize: 20,
      cardType: undefined,
      status: undefined,
      title: undefined,
    }
    getList();
  };
  /****************Add edit***************/
  const showContent = ref(false);
  const planForm = ref({
    id: undefined,
    title:undefined,
    activateType:undefined,
    amount:100,
    cardType:undefined,
    // coverUrl:undefined,
    description:undefined,
    effectiveStartTime:undefined,
    effectiveEndTime:undefined,
    maxUsageCount:undefined,
    status:1,
    validityType:undefined,
  });
  const isAdd = ref(false);
  const isEdit = ref(false);
  const showAddPage = () => {
    planForm.value= {
      id: undefined,
      title:undefined,
      activateType:undefined,
      amount:100,
      cardType:undefined,
      // coverUrl:undefined,
      description:undefined,
      effectiveStartTime:undefined,
      effectiveEndTime:undefined,
      maxUsageCount:undefined,
      validityType:undefined,
      status:1,
    };
    isAdd.value = true;
    isEdit.value = false;
    showContent.value = true;
  };
  
  const setAnnouncementContent = (value: any) => {
    planForm.value.description = value;
  };
  const startUpload = (val:any) => {
    if(val) loading.value = true;
  }
  const finishUpload = (val:any) => {
    if(val) loading.value = false;
  }
  const showEditPageFun = (data: any) => {
    selectedRow();
    const { id,title,activateType,amount,cardType,description,
      effectiveStartTime,effectiveEndTime,maxUsageCount,validityType,status } = data;
    planForm.value= deepClone({
      id,
      title,
      activateType,
      amount,
      cardType,
      // coverUrl,
      description,
      effectiveStartTime,
      effectiveEndTime,
      maxUsageCount,
      validityType,
      status:Number(status),
    });
    isAdd.value = false;
    isEdit.value = true;
    showContent.value = true;
  };
  const saveForm = async () => {
    if(!planForm.value.title){
      message.error(t('m562') + t('n1096'));
      return;
    }
    if(!planForm.value.amount && planForm.value.amount != 0){
      message.error(t('m562') + t('n1097'));
      return;
    }
    if(!planForm.value.cardType){
      message.error(t('m563') + t('n1108'));
      return;
    }
    if(!planForm.value.activateType){
      message.error(t('m563') + t('n1109'));
      return;
    }
    if(![0,1,2,3,4].includes(Number(planForm.value.validityType))){
      message.error(t('m563') + t('n1126'));
      return;
    }
    // if(!planForm.value.maxUsageCount && planForm.value.maxUsageCount != 0){
    //   message.error(t('m562') + t('n1106'));
    //   return;
    // }
    // if(!planForm.value.coverUrl){
    //   message.error(t('n1119') + t('n1111'));
    //   return;
    // }
    if(!planForm.value.description){
      message.error(t('m562') + t('n1112'));
      return;
    }
    if(!planForm.value.effectiveStartTime || !planForm.value.effectiveEndTime){
      message.error(t('m563') + t('n1110'));
      return;
    }
    let res: any;
    loading.value = true;
    if(!isEdit.value){
      res = await rewardCardConfigAdminSave(planForm.value).finally(()=>loading.value = false);
    }else{
      res = await rewardCardConfigAdminUpdate(planForm.value).finally(()=>loading.value = false);
    }
    if (res && res.code === '1') {
      message.success(t('s10'));
      showContent.value = false;
      getList();
    }
};
const changeStatus = async (id:any,status:any) => {
  let newStatus = status == 1?0:1;
  const res:any = await rewardCardConfigAdminUpdateStatus({id,status:newStatus});
  if (res && res.code == '1') {
    message.success(t('s10'));
    getList();
  }
};
const closeContent = () =>{
  planForm.value= {
    id: undefined,
    title:undefined,
    activateType:undefined,
    amount:100,
    cardType:undefined,
    // coverUrl:undefined,
    description:undefined,
    effectiveStartTime:undefined,
    effectiveEndTime:undefined,
    maxUsageCount:undefined,
    status:1,
    validityType:undefined,
  };
  showContent.value = false;
}
onMounted(() => {
  getList();
});
</script>

<style lang="less" scoped>
.width20{
  width: 80%;
}
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
  