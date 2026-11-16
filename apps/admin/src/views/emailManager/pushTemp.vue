<template>
  <div class="search">
    <h2>{{ $t("n188") }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.eventId"
          :placeholder="$t('m562') + $t('n191')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          ref="select"
          v-model:value="query.type"
          class="searchstyle"
          allow-clear
          :placeholder="$t('m563') + $t('n205')"
          :options="Object.entries(tempTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value, }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          ref="select"
          v-model:value="query.templateType"
          class="searchstyle"
          :placeholder="$t('m563') + $t('n189')"
          allow-clear
          :options="Object.entries(templateTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value, }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          ref="select"
          v-model:value="query.status"
          class="searchstyle"
          allow-clear
          :placeholder="$t('m563') + $t('state')">
          <a-select-option value="1">{{ $t("enabled") }}</a-select-option>
          <a-select-option value="0">{{ $t("disabled") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="5">
        <a-space>
          <a-button
            type="primary"
            :icon="h(SearchOutlined)"
            @click="getList(1)"
            :style="{ marginLeft: '15px' }"
            >{{ $t("search") }}
          </a-button>
          <a-button type="primary" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
        </a-space>
      </a-col>
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
      <template v-if="column.key === 'type'">
        {{ tempTypeMap[record.type] }}
      </template>
      <template v-if="column.key === 'templateType'">
        {{ templateTypeMap[record.templateType] }}
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
          v-permission="'admin:pushTemplateAdmin:updatePushTemplate'"
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
      <a-row>
        <a-col :span="8">
          <a-form-item :label="$t('n174')" name="title" :rules="[{required:true,message:''}]">
            <a-input v-trim maxLength="50" v-model:value="addFrom.title" />
          </a-form-item>
          <a-form-item :label="$t('m967')" name="remark">
            <a-input v-trim v-model:value="addFrom.remark" />
          </a-form-item>
          <a-form-item :label="t('n205')" name="type" required>
            <a-select
              ref="select"
              v-model:value="addFrom.type"
              style="width: 120px"
              :options="Object.entries(tempTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value, }))"
            >
            </a-select>
          </a-form-item>
          <a-form-item :label="t('n189')" name="templateType" required>
            <a-select
              ref="select"
              v-model:value="addFrom.templateType"
              style="width: 120px"
              :options="Object.entries(templateTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value, }))"
            >
            </a-select>
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
        </a-col>
        <a-col :span="15">
          <a-form-item :label="$t('m966')" name="content" :rules="[{required:true,message:''}]">
            <AiEditor
              v-if="addDialog"
              :announcementContent="addFrom.content"
              @change="setAnnouncementContent"
              @start="startUpload"
              @finish="finishUpload"
            />
          </a-form-item>
        </a-col>
      </a-row>
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
  getPushTemplateAdminList,
  editPushTemplateAdmin,
} from "@/api/email.api";
// import aieditor from "@/components/aieditor.vue";
import { message } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, reactive, h, defineAsyncComponent } from "vue";
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
    title: t("n191"),
    dataIndex: "eventId",
    key: "eventId",
    width: 160,
    align: "center",
  },
  {
    title: t("n205"),
    dataIndex: "type",
    key: "type",
    width: 160,
    align: "center",
  },
  {
    title: t("n189"),
    dataIndex: "templateType",
    key: "templateType",
    width: 160,
    align: "center",
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
    title: t("m966"),
    dataIndex: "content",
    key: "content",
    align: "center",
    width: 300,
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
const query = ref({
  asc: true,
  column: "",
  pageNo: 1,
  pageSize: 20,
  eventId: undefined,
  templateType: undefined,
  type: undefined,
  status: undefined,
})
const tempTypeMap= {
  1: t('n193'),//单发
  2: t('n194'),//群发
}
const templateTypeMap= {
  1: t('n192'),//邮件
  2: 'APP',//app
  3: 'H5',//h5
  4: 'WathsApp',//WathsApp
}
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
  type: undefined,
  templateType: undefined,
  status:0,
});

const changeAddChecked = () => {
  Number(addChecked.value) ? (addFrom.value.status = 1) : (addFrom.value.status = 0);
};
const getList = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    pagination.current = 1;
  }
  loading.value=true;
  const res: any = await getPushTemplateAdminList(query.value).finally(()=>{loading.value=false});
  if (res && res.code == "1") {
    dataSource.value = res.data;
    pagination.total = res.total;
    pagination.pageNo = query.value.pageNo;
    pagination.pageSize = query.value.pageSize;
  }
};
const resetQuery = () => {
  query.value = {
    asc: true,
    column: "",
    pageNo: 1,
    pageSize: 20,
    eventId: undefined,
    templateType: undefined,
    type: undefined,
    status: undefined,
  };
  getList();
};
const showAddDialog = () => {
  addFrom.value = {
    id: undefined,
    title: undefined,
    content: undefined,
    remark: undefined,
    type: undefined,
    templateType: undefined,
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
  const { id, title, type, templateType, content, remark, status } = value;
  addFrom.value = { id, title, type, templateType, content, remark, status};
  addDialog.value = true;
};
const closeAddDalog = () => {
  addFrom.value = {
    id: undefined,
    title: undefined,
    content: undefined,
    remark: undefined,
    type: undefined,
    templateType: undefined,
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
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
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
    res = await editPushTemplateAdmin( addFrom.value).finally(()=>{loading.value=false});
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
  getTabH.value = useTabHeight(3).getTabH.value;
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
