<template>
  <div class="search">
  <h2>{{ $t("m496") }}</h2>
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
      <template v-if="column.key === 'singleAmountLimit'">
        {{ thousand(record.singleAmountLimit) }}
      </template>
      <template v-if="column.key === 'selfSelectionBuy'">
        <span :style="record.selfSelectionBuy == 0 ? 'color:red' : ''">{{ statusMap[Number(record.selfSelectionBuy)] }}</span>
      </template>
      <template v-if="column.key === 'dailyTasks'">
        <span :style="record.dailyTasks == 0 ? 'color:red' : ''">{{ statusMap[Number(record.dailyTasks)] }}</span>
      </template>
      <template v-if="column.key === 'weeklyTasks'">
        <span :style="record.weeklyTasks == 0 ? 'color:red' : ''">{{ statusMap[Number(record.weeklyTasks)] }}</span>
      </template>
      <template v-if="column.key === 'monthlyTasks'">
        <span :style="record.monthlyTasks == 0 ? 'color:red' : ''">{{ statusMap[Number(record.monthlyTasks)] }}</span>
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
          v-permission="'admin:memberLevelWelfareConfig:update'"
          >{{ $t("edit") }}
        </a-tag>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="showContent"
    :footer="null"
    @cancel="closeEdit"
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
          <a-form-item>
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m491') }}</span>
              </div>
            </template>
           <div style="font-weight: 600;">{{ levelMap[Number(editForm.level)] }}</div>
          </a-form-item>

          <a-form-item >
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m529') }}</span>
              </div>
            </template>
            <a-input-number
              v-model:value="editForm.singleAmountLimit"
              class="searchstyle"
              :min="0"
            >
              <template #addonAfter>ARB</template>
            </a-input-number>
          </a-form-item>

          <a-form-item >
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m530') }}</span>
              </div>
            </template>
            <a-select
              allowClear
              ref="select"
              class="searchstyle"
              v-model:value="editForm.selfSelectionBuy"
              :placeholder="$t('m531')"
              :options = "selectStatusMap"
            >
            </a-select>
          </a-form-item>
          <!-- <a-form-item>
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m532') }}</span>
              </div>
            </template>
            <a-select
              allowClear
              ref="select"
              class="searchstyle"
              v-model:value="editForm.dailyTasks"
              :placeholder="$t('m533')"
              :options = "selectStatusMap"
            >
            </a-select>
          </a-form-item>
          <a-form-item name="weeklyTasks" >
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m534') }}</span>
              </div>
            </template>
            <a-select
              allowClear
              ref="select"
              class="searchstyle"
              v-model:value="editForm.weeklyTasks"
              :placeholder="$t('m535')"
              :options = "selectStatusMap"
            >
            </a-select>
          </a-form-item>
          <a-form-item name="monthlyTasks" >
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m536') }}</span>
              </div>
            </template>
            <a-select
              allowClear
              ref="select"
              class="searchstyle"
              v-model:value="editForm.monthlyTasks"
              :placeholder="$t('m537')"
              :options = "selectStatusMap"
            >
            </a-select>
          </a-form-item> -->
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ offset: 8 }">
        <!-- <a-popconfirm
          :title="$t('m364')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="updateContent"
        > -->
          <a-button @click="updateContent" :loading="loading" style="margin-right: 14px;" type="primary">{{ $t('save') }}</a-button>
        <!-- </a-popconfirm> -->
        <a-button type="primary" html-type="close" @click="closeEdit">{{ $t('b10') }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { memberLevelWelfareConfigList, memberLevelWelfareConfigUpdate} from "@/api/userlevel.api";
import { onMounted, ref} from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { levelMap } from '@/utils/publicData'
import { thousand } from "@/utils";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
const { t } = useI18n();
const dataSource = ref([]);
const loading = ref(false);
const labelCol = { style: { width: '120px' } };
const wrapperCol = { span: 16 };
const query = ref<any>({
  asc: true,
  column: '',
  pageNo: 1,
  pageSize: 20
})
const statusMap = <any>{
  0: t('l54'),
  1: t('l53'),
}
const selectStatusMap = <any>[
  { value: 0, label: t("l54") },
  { value: 1, label: t("l53") },
]
const columns:any = [
  {
    title: t('m521'),
    dataIndex: "level",
    key: "level",
    align: "center",
  },
  {
    title: t('m529'),
    dataIndex: "singleAmountLimit",
    key: "singleAmountLimit",
    align: "center",
  },
  {
    title: t('m530'),
    dataIndex: "selfSelectionBuy",
    key: "selfSelectionBuy",
    align: "center",
  },
  // {
  //   title: t('m532'),
  //   dataIndex: "dailyTasks",
  //   key: "dailyTasks",
  //   align: "center",
  // },
  // {
  //   title: t('m534'),
  //   dataIndex: "weeklyTasks",
  //   key: "weeklyTasks",
  //   align: "center",
  // },
  // {
  //   title: t('m536'),
  //   dataIndex: "monthlyTasks",
  //   key: "monthlyTasks",
  //   align: "center",
  // },
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
const getList = async () => {
  loading.value = true;
  const res: any = await memberLevelWelfareConfigList(query.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
  }
};
/****************Add edit***************/
const showContent = ref(false);
const editForm = ref<any>({})
const isEdit = ref(false);
const showEditPageFun = (data: any) => {
  selectedRow();
  // const {id, level, singleAmountLimit, selfSelectionBuy, dailyTasks, weeklyTasks, monthlyTasks } = data;
  // editForm.value =  {id, level, singleAmountLimit, selfSelectionBuy, dailyTasks, weeklyTasks, monthlyTasks };
  const {id, level, singleAmountLimit, selfSelectionBuy } = data;
  editForm.value =  {id, level, singleAmountLimit, selfSelectionBuy };
  isEdit.value = true;
  showContent.value = true;
};
let isClick = false;
const updateContent = async () => {
  // const {singleAmountLimit, selfSelectionBuy, dailyTasks, weeklyTasks, monthlyTasks } = editForm.value;
  const {singleAmountLimit, selfSelectionBuy } = editForm.value;
  if(singleAmountLimit == null) {
    message.error(t('m538'));
    return ;
  }
  if(selfSelectionBuy == undefined) {
    message.error(t('m531'));
    return;
  }
  // if(dailyTasks == undefined) {
  //   message.error(t('m533'));
  //   return ;
  // }
  // if(weeklyTasks == undefined) {
  //   message.error(t('m535'));
  //   return;
  // }
  // if(monthlyTasks == undefined) {
  //   message.error(t('m537'));
  //   return;
  // }
  if(isClick) return;
  isClick = true;
  loading.value = true;
  const res: any = await memberLevelWelfareConfigUpdate(editForm.value).finally(()=>{loading.value=false;isClick = false;});
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
onMounted(() => {
getList();
});
</script>

<style lang="less" scoped>
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
