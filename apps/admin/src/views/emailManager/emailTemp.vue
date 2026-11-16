<template>
  <div class="search">
    <h2>{{ $t("m962") }}</h2>
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
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          size="small"
          @click="editDialog(record)"
          style="cursor: pointer;"
          v-permission="'admin:emailTemplateAdmin:edit'"
          >{{ $t("edit") }}
        </a-tag>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    :title="isEdit?$t('b8')+$t('m962'):$t('b12')+$t('m962')"
    :footer="null"
    width="80%"
  >
    <a-form
      :model="addFrom"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item :label="$t('m965')" name="emailSubject" :rules="[{required:true,message:''}]">
        <a-input v-trim maxLength="50" v-model:value="addFrom.emailSubject" />
      </a-form-item>
      <a-form-item :label="$t('m966')" name="templateContent" :rules="[{required:true,message:''}]">
        <AiEditor
          v-if="addDialog"
          :announcementContent="addFrom.templateContent"
          @change="setAnnouncementContent"
          @start="startUpload"
          @finish="finishUpload"
        />
      </a-form-item>
      <a-form-item :label="$t('m967')" name="remark">
        <a-input v-trim v-model:value="addFrom.remark" />
      </a-form-item>
      <a-form-item :label="$t('state')" name="status">
        <a-switch
          v-model:checked="addFrom.enableFlag"
          :checked-children="$t('enabled')"
          :un-checked-children="$t('disabled')"
          :checkedValue="0"
          :unCheckedValue="1"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-popconfirm
          :title="$t('m968')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="addBtn"
        >
          <a-button type="primary" v-if="isEdit" :loading="loading">{{
            $t("b8")
          }}</a-button>
        </a-popconfirm>
        <a-button type="primary" v-if="!isEdit" :loading="loading" @click="addBtn">{{
          $t("b12")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddDalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  emailTemplateAdminList,
  emailTemplateAdminEdit,
} from "@/api/email.api";
// import aieditor from "@/components/aieditor.vue";
import { message } from "ant-design-vue";
import { onMounted, ref, reactive, defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useClipboard } from "@vueuse/core";
import Upload from '@/components/Upload/index.vue'
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const AiEditor = defineAsyncComponent(() => import('@/components/aieditor.vue'));
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
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 100,
    fixed: 'right',
  },
];
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
  emailSubject: undefined,
  templateContent: undefined,
  remark: undefined,
  enableFlag:0,
});

const changeAddChecked = () => {
  Number(addChecked.value) ? (addFrom.value.state = 1) : (addFrom.value.state = 0);
};
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
    emailSubject: undefined,
    templateContent: undefined,
    remark: undefined,
    enableFlag:0,
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
const editDialog = (value: any) => {
  selectedRow();
  isEdit.value = true;
  const { id, emailSubject, templateContent, remark, enableFlag } = value;
  addFrom.value = { id, emailSubject, templateContent, remark, enableFlag};
  addDialog.value = true;
};
const closeAddDalog = () => {
  addFrom.value = {
    id: undefined,
    emailSubject: undefined,
    templateContent: undefined,
    remark: undefined,
    enableFlag:0,
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
  if(!addFrom.value.emailSubject){
    message.error(t('m562')+t('m965'));
    return;
  }

  if(!addFrom.value.templateContent){
    message.error(t('m562')+t('m966'));
    return;
  }else{
    const isEmpty = /^<p>\s*<\/p>$/.test(addFrom.value.templateContent);
    if(isEmpty){
      message.error(t('m562')+t('m966'));
      return;
    }
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
const setAnnouncementContent = (value: any) => {
  addFrom.value.templateContent = value;
};
  const startUpload = (val:any) => {
    if(val) loading.value = true;
  }
  const finishUpload = (val:any) => {
    if(val) loading.value = false;
  }
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(260).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(video){
  width: 230px;
}
:deep(tr td img) {
  max-width: 100px;
  max-height: 100px;
}
.eventContentBtn{
  cursor: pointer;
  min-width: 80px;
  text-align: center;
}
:deep(.aiEditor) {
  .aie-container-main{
    max-height: 40vh;
  }
}
</style>
