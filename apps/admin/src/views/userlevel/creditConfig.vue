<template>
  <div class="search">
    <h2>{{ $t("m492") }}</h2>
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
      <template v-if="column.key === 'tradeType'">
        {{ $t(tradeTypeMap[Number(record.tradeType)]) }}
      </template>
      <template v-if="column.key === 'triggerEvent'">
        {{ $t(triggerEventMap[Number(record.triggerEvent)]) }}
      </template>
      <template v-if="column.key === 'eventType'">
        {{ $t(eventTypeMap[Number(record.eventType)]) }}
      </template>
      <template v-if="column.key === 'createBy'">
        {{ record.updateBy || record.createBy }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.updateTime || record.createTime }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          v-permission="'admin:creditScoreConfigAdmin:updateScore'"
          >{{ $t("edit") }}
        </a-tag>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="showContent"
    :title="triggerEventMap[Number(planForm.cancel)]"
    :footer="null"
    @cancel="closeEdit"
  > 
    <a-form
      name="basic"
      autocomplete="off"
      style="text-align: left;"
    >
      <a-row >
        <a-col :span="24">
          <a-form-item>
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('type') }}</span>
              </div>
            </template>
           <div>{{ $t(tradeTypeMap[Number(planForm.tradeType)]) }}</div>
          </a-form-item>

          <a-form-item>
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m498') }}</span>
              </div>
            </template>
             <div>{{ $t(triggerEventMap[Number(planForm.triggerEvent)]) }}</div>
          </a-form-item>

          <a-form-item>
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m499') }}</span>
              </div>
            </template>
             <div>{{ $t(eventTypeMap[Number(planForm.eventType)]) }}</div>
          </a-form-item>
          <a-form-item name="score" >
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m500') }}</span>
              </div>
            </template>
            <a-input v-trim
              v-model:value="planForm.score"
              class="width24"
            >
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ offset: 6 }">
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
import { creditScoreConfigAdminList , creditScoreConfigAdminUpDate} from "@/api/userlevel.api";
import { onMounted, ref} from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import{ tradeTypeMap ,triggerEventMap, eventTypeMap } from '@/utils/publicData'
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
const { t } = useI18n();
const dataSource = ref([]);
const loading = ref(false);
const query = ref<any>({
  asc: true,
  column: '',
  pageNo: 1,
  pageSize: 20
})
// const tradeTypeMap = <any>{
//   1:t('n104'),
//   2:t('n100')
// }
// const triggerEventMap = <any>{
//   1: t('n92'),
//   2: t('n82'),
//   3: t('m501'),
//   4: t('m502'),
//   5: t('n87'),
// }
// const eventTypeMap = <any>{
//   1: t('n92'),
//   2: t('m502'),
//   3: t('m503'),
//   4: t('m504'),
//   5: t('m505'),
//   6: t('m506'),
//   7: t('m507'),
//   8: t('t54'),
// }
const columns:any = [
  {
    title: 'ID',
    dataIndex: "eventId",
    key: "eventId",
    align: "center",
  },
  {
    title: t('type'),
    dataIndex: "tradeType",
    key: "tradeType",
    align: "center",
  },
  {
    title: t('m498'),
    dataIndex: "triggerEvent",
    key: "triggerEvent",
    align: "center",
  },
  {
    title: t('m499'),
    dataIndex: "eventType",
    key: "eventType",
    align: "center",
  },
  {
    title: t('m500'),
    dataIndex: "score",
    key: "score",
    align: "center",
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
  },
  {
    title: t("l67"),
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
  const res: any = await creditScoreConfigAdminList(query.value).finally(()=>loading.value = false);
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
  const {eventId, score , tradeType, triggerEvent, eventType } = data;
  planForm.value= {eventId, score , tradeType, triggerEvent, eventType };
  isEdit.value = true;
  showContent.value = true;
};
let isClick = false;
const updateContent = async () => {
  const {eventId, score} = planForm.value;
  const first = score.slice(0,1);
  const sec = score.slice(1,2);
  const last = Number(score.slice(1));
  if(first === '+' || first === '-'){
    if(sec === '+' || sec === '-'){
        message.error(t('m509'));
        return;
    }else{
      if(score.slice(1).slice(0,1) == ' '){
        message.error(t('m508'));
        return;
      }
      if(isNaN(last)){
        message.error(t('m509'));
        return;
      }else if(last == 0){
        message.error(t('m510'));
        return;
      }
      if(isClick) return;
      isClick = true;
      const updataQ = ref({
        eventId, score
      });
      loading.value = true;
      const res: any = await creditScoreConfigAdminUpDate(updataQ.value).finally(()=>{isClick = false;loading.value = false;});
      if (res && res.code === '1') {
        message.success(t('s14'));
        showContent.value = false;
        getList();
      }
    }
  }else{
    message.error(t('m511'));
    return;
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
