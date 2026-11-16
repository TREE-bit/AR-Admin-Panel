<template>
  <div class="search">
    <h2>{{ $t("n173") }}</h2>
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
      <template v-if="column.key === 'title'">
        <a-tooltip v-if="record.title">
          <template #title>{{ record.title }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.title }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'content'">
        <div class="toopTipStyle2" v-html="record.content"></div>
      </template>
      <template v-if="column.key === 'remark'">
        <!-- <a-tooltip v-if="record.remark">
          <template #title>{{ record.remark }}</template>
          <div  class="toopTipStyle2">{{ record.remark }}</div>
        </a-tooltip> -->
        <div v-if="record.remark" class="toopTipStyle2">{{ record.remark }}</div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status == 1 ? 'green' : 'red'">
          {{ record.status == 1 ? $t('enabled') : $t('disabled') }}
        </a-tag>
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          size="small"
          style="cursor: pointer;"
          @click="editDialog(record)"
          v-permission="'admin:appPushTemplateAdmin:updateTemplate'"
          >{{ $t("edit") }}
        </a-tag>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    :title="isEdit?$t('b8')+$t('n173'):$t('b12')+$t('n173')"
    :footer="null"
    width="80%"
  >
    <a-form
      :model="addFrom"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item :label="$t('n174')" name="title" :rules="[{required:true,message:''}]">
        <a-input v-trim maxLength="50" v-model:value="addFrom.title" />
      </a-form-item>
      <a-form-item :label="$t('m966')" name="content" :rules="[{required:true,message:''}]">
        <AiEditor
          v-if="addDialog"
          :announcementContent="addFrom.content"
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
          v-model:checked="addFrom.status"
          :checked-children="$t('enabled')"
          :un-checked-children="$t('disabled')"
          :checkedValue="1"
          :unCheckedValue="0"
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
  appPushTemplateAdminList,
  appPushTemplateAdminEdit,
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
    title: t("n174"),
    dataIndex: "title",
    key: "title",
    width: 160,
    align: "center",
  },
  {
    title: t("m966"),
    dataIndex: "content",
    key: "content",
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
    dataIndex: "status",
    key: "status",
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
  title: undefined,
  content: undefined,
  remark: undefined,
  status:0,
});

const changeAddChecked = () => {
  Number(addChecked.value) ? (addFrom.value.status = 1) : (addFrom.value.status = 0);
};
const getList = async () => {
  loading.value=true;
  const { pageNo, pageSize } = pagination;
  const res: any = await appPushTemplateAdminList({
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
    title: undefined,
    content: undefined,
    remark: undefined,
    status:0,
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
  const { id, title, content, remark, status } = value;
  addFrom.value = { id, title, content, remark, status};
  addDialog.value = true;
};
const closeAddDalog = () => {
  addFrom.value = {
    id: undefined,
    title: undefined,
    content: undefined,
    remark: undefined,
    status:0,
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
  if(!addFrom.value.title){
    message.error(t('m562')+t('n174'));
    return;
  }

  if(!addFrom.value.content){
    message.error(t('m562')+t('m966'));
    return;
  }else{
    const isEmpty = /^<p>\s*<\/p>$/.test(addFrom.value.content);
    if(isEmpty){
      message.error(t('m562')+t('m966'));
      return;
    }
  }
  let res;
  if (isEdit.value) {
    loading.value = true;
    res = await appPushTemplateAdminEdit( addFrom.value).finally(()=>{loading.value=false});
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
  addFrom.value.content = value;
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
