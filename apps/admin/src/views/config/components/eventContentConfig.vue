<template>
  <div class="search">
    <a-button
      type="primary"
      @click="showAddDialog"
      v-permission="'admin:activity:save'"
      >{{ $t("add") }}</a-button
    >
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: 'max-content' , y: '700px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'state'">
        {{ statusTypeMap[record.state] }}
      </template>
      <template v-if="column.key === 'platformType'">
        {{ $getMapItem(contentPlantTypeMap,record.platformType) || '-' }}
      </template>
      <template v-if="column.key === 'title'">
        <div class="limit-title">
          {{ record.title }}
        </div>
      </template>
      <template v-if="column.key === 'eventBanner'">
        <a-image :width="160" :src="record.eventBanner" />
      </template>
      <template v-if="column.key === 'content'">
        <div class="limit-content" v-html="record.content"></div>
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          size="small"
          class="eventContentBtn"
          @click="copyLink(record.activityUrl)"
          v-permission="'admin:activity:no1'"
          >{{ $t("m217") }}
        </a-tag>
        <a-tag
          color="rgba(22, 155, 213, 1)"
          class="eventContentBtn"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:activity:update'"
          >{{ $t("edit") }}
        </a-tag>
        <div style="padding: 5px;"></div>
        <a-popconfirm
          :title="record.state == 1 ? $t('m936') : $t('m236')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="checkenable(record)"
        >
          <a-tag
            :color="
              record.state == 1
                ? 'rgba(253, 11, 26, 1)'
                : 'rgba(22, 155, 213, 1)'
            "
          class="eventContentBtn"
            size="small"
            v-permission="'admin:activity:no2'"
            >{{ record.state == 1 ? $t("m219") : $t("m218") }}
          </a-tag>
        </a-popconfirm>
        <a-popconfirm
          :title="$t('t16')"
          :description="$t('t17')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record)"
        >
          <a-tag
            color="rgba(253, 11, 26, 1)"
          class="eventContentBtn"
            size="small"
            v-permission="'admin:activity:delete'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    :title="isEdit?$t('b8')+$t('m933'):$t('b12')+$t('m933')"
    :footer="null"
    width="80%"
  >
    <a-form
      :model="addFrom"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-row>
        <a-col :span="10">
          <a-form-item :label="$t('sort')" name="sort" :rules="[{required:true,message:''}]">
            <a-input-number
              v-model:value="addFrom.sort"
              style="width: 40%"
              :min="0"
            />
          </a-form-item>
          <a-form-item :label="$t('m934')" name="title" :rules="[{required:true,message:''}]">
            <a-input v-trim maxLength="50" v-model:value="addFrom.title" />
          </a-form-item>
          <a-form-item :label="$t('m935')" name="eventBanner" :rules="[{required:true,message:''}]">
              <Upload v-if="addDialog" v-model:value="addFrom.eventBanner"  @startUpload="startUpload"  @finishUpload="finishUpload"/>
          </a-form-item>
          <a-form-item :label="$t('m222')" name="state">
            <a-switch v-model:checked="addChecked" @click="changeAddChecked" />
          </a-form-item>
          <a-form-item :label="$t('n1494')" name="platformType" :rules="[{ required: true, message: ''}]">
            <a-select
              v-model:value="addFrom.platformType"
              :placeholder="$t('n1494')"
              :options="Object.entries(contentPlantTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="13">
          <a-form-item :label="$t('m933')" name="content" :rules="[{required:true,message:''}]">
            <quillEditor
              v-if="addDialog"
              :announcementContent="addFrom.content"
              @change="setAnnouncementContent"
              @start="startUpload"
              @finish="finishUpload"
            />
            <!-- <AiEditor
              v-if="addDialog"
              :announcementContent="addFrom.content"
              @change="setAnnouncementContent"
              @start="startUpload"
              @finish="finishUpload"
            /> -->
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-button type="primary" :loading="loading" @click="addBtn">{{
          isEdit ? $t("b8") : $t("b12")
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
  activitytLit,
  activitySave,
  activityUpdate,
  activityDelete,
} from "@/api/c2cconfig.api";
// import aieditor from "@/components/aieditor.vue";
import quillEditor from "@/components/quillEditor.vue";
import { message } from "ant-design-vue";
import { onMounted, ref, reactive, defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useClipboard } from "@vueuse/core";
import Upload from '@/components/Upload/index.vue'
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { contentPlantTypeMap } from "@/utils/publicData";
const AiEditor = defineAsyncComponent(() => import('@/components/aieditor.vue'));
const { t } = useI18n();
const columns:any = [
  {
    title: t("sort"),
    dataIndex: "sort",
    key: "sort",
    width: 100,
    align: "center",
  },
  {
    title: t("m934"),
    dataIndex: "title",
    key: "title",
    width: 160,
    align: "center",
  },
  {
    title: t("m935"),
    dataIndex: "eventBanner",
    key: "eventBanner",
    width: 120,
    align: "center",
  },
  {
    title: t("m933"),
    dataIndex: "content",
    key: "content",
    align: "center",
    width: 300,
  },
  {
    title: t("m222"),
    dataIndex: "state",
    key: "state",
    width: 140,
    align: "center",
  },
  {
    title: t("n1494"),
    dataIndex: "platformType",
    key: "platformType",
    width: 200,
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
    width: 180,
    fixed: 'right',
  },
];
const loading = ref(false);
const addDialog = ref(false);
const dataSource = ref([]);
const addChecked = ref<boolean>(false);
const statusTypeMap = <any>{
  "0": t("m219"),
  "1": t("m218"),
};
let isEdit = ref(false);
const pagination = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20,
  showSizeChanger: false,
  showTotal: (total: any) => t("total", [total]),
});
const addFrom = ref({
  id: undefined,
  sort: 0,
  title: undefined,
  eventBanner: "",
  content: undefined,
  state: 0,
  type:1,
  platformType: undefined,
});

const changeAddChecked = () => {
  Number(addChecked.value) ? (addFrom.value.state = 1) : (addFrom.value.state = 0);
};
const getList = async () => {
  loading.value=true;
  const { pageNo, pageSize } = pagination;
  const res: any = await activitytLit({
    pageNo,
    pageSize,
  }).finally(()=>{loading.value=false});
  if (res && res.code === "1") {
    dataSource.value = res.data.list;
    pagination.total = res.data.total;
  }
};
const showAddDialog = () => {
  addFrom.value = {
    id: undefined,
    sort: 0,
    title: undefined,
    eventBanner: "",
    content: undefined,
    state: 0,
    type:1,
    platformType: undefined,
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
  const { id, title, sort, eventBanner, content, state, type, platformType } = value;
  addFrom.value = { id, title, sort, eventBanner, content, state ,type, platformType};
  addFrom.value.state == 1
    ? (addChecked.value = true)
    : (addChecked.value = false);
  addDialog.value = true;
};
const del = async (value: any) => {
  const { id } = value;
  const res: any = await activityDelete(id);
  if (res && res.code === "1") {
    message.success(t("s9"));
    getList();
  }
};
const checkenable = async (value: any) => {
  const { id, title, sort, eventBanner, content, state, type, platformType } = value;
  addFrom.value = { id, title, sort, eventBanner, content, state: Number(state) ? 0 : 1, type, platformType};
  let res: any= await activityUpdate(addFrom.value);
  if (res && res.code === "1") {
    message.success(t("s10"));
    getList();
  }
};
const closeAddDalog = () => {
  addFrom.value = {
    id: undefined,
    sort: 0,
    title: undefined,
    eventBanner: "",
    content: undefined,
    state: 0,
    type:1,
    platformType: undefined,
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
  if(addFrom.value.sort == null){
    message.error(t('m562')+t('sort'));
    return;
  }
  if(!addFrom.value.title){
    message.error(t('m562')+t('m934'));
    return;
  }
  if(!addFrom.value.eventBanner){
    message.error(t('m563')+t('m935'));
    return;
  }
  if(!addFrom.value.content){
    message.error(t('m562')+t('m933'));
    return;
  }
  if(!addFrom.value.platformType){
    message.error(t('m563')+t('n1494'));
    return
  }
  let res: any;
  if (isEdit.value) {
    res = await activityUpdate( addFrom.value);
  } else {
    res = await activitySave(addFrom.value);
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
});
</script>
<style lang="less" scoped>
.limit-title {
  width: 200px;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.limit-content {
  width: 300px;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
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
</style>
