<template>
  <div class="search">
    <h2>{{ $t("m962") }}</h2>
    <a-row>
      <a-button
        type="primary"
        @click="showAddDialog"
        v-permission="'admin:emailTemplateAdmin:add'"
      >{{ $t("b12") }}</a-button>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' , y: getTabH +'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'templateFlag'">
        <!-- <a-tooltip v-if="record.templateFlag">
          <template #title>{{ record.templateFlag }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.templateFlag }}</div>
        </a-tooltip> -->
        <div v-if="record.templateFlag" class="toopTipStyle2">{{ record.templateFlag }}</div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'emailSubject'">
        <!-- <a-tooltip v-if="record.emailSubject">
          <template #title>{{ record.emailSubject }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.emailSubject }}</div>
        </a-tooltip> -->
        <div v-if="record.emailSubject" class="toopTipStyle2">{{ record.emailSubject }}</div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'templateContent'">
        <div class="toopTipStyle2" v-html="record.templateContent"></div>
      </template>
      <template v-if="column.key === 'remark'">
        <!-- <a-tooltip v-if="record.remark">
          <template #title>{{ record.remark }}</template>
          <div  class="toopTipStyle2">{{ record.remark }}</div>
        </a-tooltip> -->
        <div v-if="record.remark" class="toopTipStyle2">{{ record.remark }}</div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'enableFlag'">
        <a-tag :color="record.enableFlag == 0 ? 'green' : 'red'">
          {{ record.enableFlag == 0 ? $t('enabled') : $t('disabled') }}
        </a-tag>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    :title="$t('add')+$t('m963')"
    :footer="null"
    width="100%"
    wrap-class-name="full-modal"
  >
    <label>{{ $t("m563") + $t("m962") }}:</label>
    <groupMailList v-if="addDialog" v-model:emailId="addFrom.id" />
    <label>{{ $t("m563") + $t("n164") }}:</label>
    <a-select
      allowClear
      ref="select"
      style="width: 200px;"
      v-model:value="addFrom.type"
      :placeholder="$t('m563')"
    >
      <a-select-option
        v-for="(item, key) in typeData"
        :value="key"
        :key="item"
        >{{ typeList[item.type] }}</a-select-option
      >
    </a-select>
    <div v-if="addFrom.type">{{ $t("n163",{m: memberCount }) }}</div>
    <div class="emailbtn-group-send">
      <a-popconfirm
        :title="$t('m968')"
        :ok-text="$t('yes')"
        :cancel-text="$t('no')"
        @confirm="addBtn"
      >
        <a-button type="primary" :loading="loading" @click="addBtn">{{
          $t("n160")
        }}</a-button>
      </a-popconfirm>
      <a-button style="margin-left: 10px" @click="closeAddDalog">{{
        $t("l54")
      }}</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  emailTemplateAdminList,
  emailTemplateAdminEdit,
} from "@/api/email.api";
// import aieditor from "@/components/aieditor.vue";
import { message } from "ant-design-vue";
import { onMounted, ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useClipboard } from "@vueuse/core";
import groupMailList from './components/groupMailList.vue'
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const columns:any = [
  {
    title: t("m964"),
    dataIndex: "templateFlag",
    key: "templateFlag",
    width: 120,
    align: "center",
  },
  {
    title: t("m965"),
    dataIndex: "emailSubject",
    key: "emailSubject",
    width: 160,
    align: "center",
  },
  {
    title: t("m966"),
    dataIndex: "templateContent",
    key: "templateContent",
    align: "center",
    width: 300,
  },
  {
    title: t("m967"),
    dataIndex: "remark",
    key: "remark",
    width: 160,
    align: "center",
  },
  {
    title: t("state"),
    dataIndex: "enableFlag",
    key: "enableFlag",
    width: 120,
    align: "center",
  },
  {
    title: t("m223"),
    dataIndex: "createBy",
    key: "createBy",
    align: "center",
    width: 140,
  },
  {
    title: t("m224"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 170,
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 140,
  },
  {
    title: t("l71"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 170,
  },
];
const typeData: any = [
  {type:1,val:100},
  {type:2,val:200},
  {type:3,val:300},
  {type:4,val:400},
  {type:5,val:500},
]
const typeList: any = {
  1: t("n165"),//今日登陆过会员
  2: t("n166"),//3天内登陆过会员
  3: t("n167"),//7天内登陆过会员
  4: t("n168"),//30天内登陆过会员
  5: t("n169"),//所有会员
}
const memberCount = computed(() => {
  return typeData.find((item: any) => item.type === addFrom.value.type)?.val;
});
const loading = ref(false);
const addDialog = ref(false);
const dataSource = ref([]);
const addChecked = ref<boolean>(false);
let isEdit = ref(false);
const pagination = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const addFrom = ref({
  id: undefined,
  type: undefined,
});

const getList = async () => {
  loading.value=true;
  const { pageNo, pageSize } = pagination;
  const res: any = await emailTemplateAdminList({
    pageNo,
    pageSize,
  }).finally(()=>{loading.value=false});
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.total = res.total;
  }
};
const showAddDialog = () => {
  addFrom.value = {
    id: undefined,
    type: undefined,
  };
  addDialog.value = true;
};
let copyType = true;
const copyLink = async (value: any) => {
  selectedRow();
  if (copyType) {
    copyType = false;
    const { copy } = useClipboard();
      copy(value);
      message.success("Successful");
      copyType = true;
  }
};
const closeAddDalog = () => {
  addFrom.value = {
    id: undefined,
    type: undefined,
  };
  isEdit.value = false;
  addDialog.value = false;
};
const handleTableChange: any = (value: {
  pageSize: number;
  current: number;
}) => {
  const { current ,pageSize} = value;
  pagination.pageNo = current;
  pagination.pageSize = pageSize;
  getList();
};
const addBtn = async () => {
  console.log(addFrom.value.id, addFrom.value.type);
  return;
  if(!addFrom.value.id){
    message.error(t('m562')+t('m962'));
    return;
  }

  if(!addFrom.value.type){
    message.error(t('m562')+t('n164'));
    return;
  }
  let res;
  if (isEdit.value) {
    res = await emailTemplateAdminEdit( addFrom.value);
  } else {
    return;
  }
  if (res && res.code === "1") {
    message.success(isEdit.value ? t("s7") : t("s8"));
    getList();
    closeAddDalog();
  }
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(260).getTabH.value;
});
</script>
<style lang="less" scoped>
.emailbtn-group-send{
  width: 200px;
  margin-top: 20px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
