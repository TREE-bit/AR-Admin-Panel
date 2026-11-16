<template>
  <div class="search">
    <h2>{{ $t("m494") }}</h2>
    <!-- <div style="font-weight: 600;color: red;">{{ $t('m570') + '：' + (extend ? extend?.tradeCreditScoreLimit :'') + $t('m538') }}</div> -->
    <!-- @click="showEditPageFun({})" v-permission="'admin:memberLevelConfig:create'" -->
    <!-- <a-button type="primary" @click="add()">
    {{ $t("add") }}
    </a-button> -->
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="false"
    :loading="loading"
    :scroll="{ x: '100%' }"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
    style="padding-bottom: 20px;"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'level'">
        {{ levelMap[Number(record.level)] }}
      </template>
      <template v-if="column.key === 'applicableGroup'">
        {{ $getMapItem(applicableGroupMap,record.applicableGroup) }}
      </template>
      <template v-if="column.key === 'sellNum'">
        {{ record.sellNum ? '>=' + record.sellNum : '0' }}
      </template>
      <template v-if="column.key === 'buyNum'">
        {{ record.buyNum ? '>=' + record.buyNum : '0' }}
      </template>
      <template v-if="column.key === 'updateBy'">
        {{ record.updateBy || record.createBy }}
      </template>
      <template v-if="column.key === 'updateTime'">
        {{ record.updateTime || record.createTime }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          v-permission="'admin:memberLevelConfig:update'"
          >{{ $t("edit") }}
        </a-tag>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="showContent"
    :footer="null"
    :title="isEdit ? $t('edit') : $t('add')"
    width="600px"
  > 
    <a-form
      name="basic"
      autocomplete="off"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      style="text-align: left;"
    >
      <a-row >
        <a-col :span="24">
          <a-form-item >
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m521') }}</span>
              </div>
            </template>
           <div style="font-weight: 600;">{{ levelMap[Number(planForm.level)] }}</div>
            <!-- <a-select
              v-model:value="planForm.level"
              style="width: 100%;"
              :placeholder="$t('m563')+$t('m521')"
              :options="Object.entries(levelMap).map(([key, value]) => ({ label: value, value: Number(key) }))"
            >
            </a-select> -->
          </a-form-item>
          <a-form-item :rules="[{ required: true }]">
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('n672') }}</span>
              </div>
            </template>
            <a-checkbox-group
              v-model:value="planForm.applicableGroup"
              style="width: 100%;"
              name="applicableGroup"
              >
              <a-checkbox :value="0">{{ $t('m842') }}</a-checkbox>
              <a-checkbox :value="1" :disabled="planForm.level>=5">{{ $t('n673') }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item :rules="[{ required: true }]">
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m799') }}</span>
              </div>
            </template>
            <a-input-number
              v-model:value="planForm.buyNum"
              class="searchstyle"
              :min="0"
              :max="999"
              :placeholder="$t('m562')+$t('m348')"
            >
              <template #addonBefore>>=</template>
            </a-input-number>
            <div class="tipMsg">{{ $t('n671',{
              num: '0-999'
            }) }}</div>
          </a-form-item>
          <a-form-item :rules="[{ required: true}]">
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m796') }}</span>
              </div>
            </template>
            <a-input-number
              v-model:value="planForm.sellNum"
              class="searchstyle"
              :min="0"
              :max="999"
              :placeholder="$t('m562')+$t('m348')"
            >
            <template #addonBefore>>=</template>
            </a-input-number>
            <div class="tipMsg">{{ $t('n671',{
              num: '0-999'
            }) }}</div>
          </a-form-item>
          <a-form-item :rules="[{ required: true}]">
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('n618') }}</span>
              </div>
            </template>
            <a-input-number
              class="searchstyle"
              :min="0"
              :max="9999999"
              :placeholder="$t('m562')+$t('n618')"
              v-model:value="planForm.amount"
            >
            <template #addonBefore>>=</template>
            </a-input-number>
            <div class="tipMsg">{{ $t('n671',{
              num: '0-9999999'
            }) }}</div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ offset: 8 }">
        <!-- <a-popconfirm
          :title="$t('m364')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="updateContent"
        > -->
        <a-button style="margin-right: 14px;" :loading="loading" @click="updateContent" type="primary">{{ $t('save') }}</a-button>
        <!-- </a-popconfirm> -->
        <a-button type="primary" html-type="close" @click="closeEdit">{{ $t('b10') }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { memberLevelConfigList , memberLevelConfigUpdate} from "@/api/userlevel.api";
import { onMounted, ref} from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import{levelMap } from '@/utils/publicData'
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
const { t } = useI18n();
const dataSource = ref([]);
const extend = ref<any>();
const loading = ref(false);
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 12 };
// const scoreList = ref<any>([]);
const query = ref<any>({
  asc: true,
  column: '',
  pageNo: 1,
  pageSize: 20
})
const columns:any = [
  {
    title: t('m521'),
    dataIndex: "level",
    key: "level",
    align: "center",
  },
  {
    title: t('n672'),
    dataIndex: "applicableGroup",
    key: "applicableGroup",
    align: "center",
  },
  {
    title: t('memberListC8'),
    dataIndex: "sellNum",
    key: "sellNum",
    align: "center",
  },
  {
    title: t('c4'),
    dataIndex: "buyNum",
    key: "buyNum",
    align: "center",
  },
  {
    title: t('n618'),
    dataIndex: "amount",
    key: "amount",
    align: "center",
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
  },
  {
    title: t("l71"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
  },
];
const applicableGroupMap = ref<any>({
  0: t('m842'),
  1: t('n673'),
  2: t('n674'),
});
const getList = async () => {
  loading.value = true;
  // scoreList.value = [];
  const res: any = await memberLevelConfigList(query.value).finally(()=> loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    extend.value = res.extend;
  }
};
/****************Add edit***************/
const showContent = ref(false);
const planForm = <any>ref({
  id: undefined,
  lever: undefined,
  applicableGroup: [],
  buyNum: undefined,
  sellNum: undefined,
  amount: undefined,
});
const isEdit = ref(false);
const add = () => {
  clearSelected();
  planForm.value = {
    id: undefined,
    applicableGroup: [],
    buyNum: undefined,
    sellNum: undefined,
    amount: undefined,
  };
  isEdit.value = false;
  showContent.value = true;
};
const showEditPageFun = (data: any) => {
  selectedRow();
  planForm.value='';
  const {id, level, applicableGroup, sellNum, buyNum, amount } = data;
  const applicableGroupB = applicableGroup == 2 ? [0,1] : [applicableGroup];
  planForm.value=  {id, level, applicableGroup:applicableGroupB, sellNum, buyNum, amount };
  isEdit.value = true;
  showContent.value = true;
};

// const inputValue = ref<any>()
// const msg = ref('')

// const minScore = ()=>{
//   return planForm.value.level == 0 ? 0: (planForm.value.level== 1 ? (scoreList.value[planForm.value.level-1]) : (scoreList.value[planForm.value.level-1]+1));
// }
// const maxScore = ()=>{
//   return planForm.value.level == 0 ? (extend.value ? extend.value.tradeCreditScoreLimit : (scoreList.value[planForm.value.level+1]) ) : planForm.value.level==(scoreList.value.length-1) ? 240 : (scoreList.value[planForm.value.level+1]-1);
// };
// const handleInput = (event:any) => {
//   inputValue.value = Number(event)
//   let min = minScore();
//   let max = maxScore();
//   if(isNaN(Number(event))){
//     msg.value=t('m574');
//   }else{
//     if(inputValue.value>max || inputValue.value<min){
//       msg.value=`${t(levelMap[Number(planForm.value.level)])}${t('m562')}${min}-${max}`;
//     }
//     if(inputValue.value>=min && inputValue.value<= max){
//       msg.value = '';
//     }
//   }
// }
// const overInput = () => {
//   msg.value = '';
// }
const updateContent = async () => {
  // if(levelMap[Number(planForm.value.level)] === undefined) {
  //   message.error(t('m563')+ t('m521'));
  //   return;
  // }
  if(!planForm.value.applicableGroup || planForm.value.applicableGroup.length === 0) {
    message.error(t('m563')+ t('n672'));
    return;
  }
  if(planForm.value.buyNum<0) {
    message.error(t('m562')+ t('m799'));
    return;
  }
  if(planForm.value.sellNum<0) {
    message.error(t('m562')+ t('m796'));
    return;
  }
  if(planForm.value.amount<0) {
    message.error(t('m562')+ t('n618'));
    return;
  }
  loading.value = true;
  const { id, level, applicableGroup, buyNum, sellNum, amount } = planForm.value;
  const applicableGroupB = applicableGroup.length ==1 ? applicableGroup[0] : 2;
  const updateData = {
    id,
    level,
    applicableGroup: applicableGroupB,
    buyNum,
    sellNum,
    amount
  };
  let res: any = await memberLevelConfigUpdate(updateData).finally(()=> {loading.value = false;});
  if (res && res.code === '1') {
    message.success(t('s14'));
    showContent.value = false;
    getList();
  }
};
const closeEdit = () =>{
  showContent.value = false;
}
onMounted(() => {
getList();
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-label>label){
  width: 100%;
  height: 100%;
  padding-left: 12px;
}
.label-wrapper{
  text-align: left;
  font-weight: 600;
}
.tipMsg {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
}
</style>
