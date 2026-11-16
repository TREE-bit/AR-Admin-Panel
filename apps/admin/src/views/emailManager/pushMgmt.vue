<template>
  <div class="search">
    <h2>{{ $t("n196") }}</h2>
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
      <!-- <template v-if="column.key === 'title'">
        <a-tooltip v-if="record.title">
          <template #title>{{ record.title }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.title }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template> -->
      <template v-if="column.key === 'content'">
        <div class="toopTipStyle2" v-html="record.content"></div>
      </template>
      <template v-if="column.key === 'pushType'">
        {{ pushTypeMap[record.pushType] }}
      </template>
      <template v-if="column.key === 'deviceType'">
        {{ deviceTypeMap[record.deviceType] }}
      </template>
      <template v-if="column.key === 'deleted'">
        <a-tag :color="record.deleted == 1 ? 'green' : 'red'">
          {{ record.deleted == 1 ? $t('m893') : $t('m894') }}
        </a-tag>
      </template>
      <template v-if="column.key === 'updateBy'">
        {{ record.updateBy || "-" }}
      </template>
      <template v-if="column.key === 'updateTime'">
        {{ record.updateTime || "-" }}
      </template>
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status == 1 ? 'green' : 'red'">
          {{ record.status == '1' ? $t('enabled') : $t('disabled') }}
        </a-tag>
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          size="small"
          style="cursor: pointer;"
          @click="editDialog(record)"
          v-permission="'admin:pushMannerAdmin:updatePushManner'"
          >{{ $t("edit") }}
        </a-tag>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    :title="isEdit?$t('b8')+$t('n196'):$t('b12')+$t('n196')"
    :footer="null"
    width="400px"
  >
    <a-form
      :model="addFrom"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item :label="t('n197')" name="pushType" required>
        <a-select
          ref="select"
          v-model:value="addFrom.pushType"
          :options="Object.entries(pushTypeMap).map(([key, value]:[any,any]) => ({ value: key, label: value, }))"
        >
        </a-select>
      </a-form-item>
      <a-form-item :label="t('m554')" name="deviceType" required>
        <a-select
          ref="select"
          v-model:value="addFrom.deviceType"
          :options="Object.entries(deviceTypeMap).map(([key, value]:[any,any]) => ({ value: key, label: value, }))"
        >
        </a-select>
      </a-form-item>
      <a-form-item :label="t('n198')" name="deleted" required>
        <a-select
          ref="select"
          v-model:value="addFrom.deleted"
        >
          <a-select-option value="1">{{ $t('m893') }}</a-select-option>
          <a-select-option value="0">{{ $t('m894') }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('state')" name="status">
        <a-switch
          v-model:checked="addFrom.status"
          :checked-children="$t('enabled')"
          :un-checked-children="$t('disabled')"
          :checkedValue="'1'"
          :unCheckedValue="'0'"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 7 }">
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
  pushMannerAdminList,
  pushMannerAdminUpdate,
} from "@/api/email.api";
// import aieditor from "@/components/aieditor.vue";
import { message } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, reactive, h } from "vue";
import { useI18n } from "vue-i18n";
import { useClipboard } from "@vueuse/core";
import Upload from '@/components/Upload/index.vue'
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const columns:any = [
  {
    title: t("m554"),
    dataIndex: "deviceType",
    key: "deviceType",
    width: 160,
    align: "center",
  },
  {
    title: t("n197"),
    dataIndex: "pushType",
    key: "pushType",
    width: 160,
    align: "center",
  },
  {
    title: t("n198"),
    dataIndex: "deleted",
    key: "deleted",
    width: 160,
    align: "center",
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    width: 160,
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
const query = ref({
  asc: true,
  column: "",
  pageNo: 1,
  pageSize: 20,
})
const pushTypeMap= {
  1: t('l63'),//邮箱
  2: t('n199'),//APP推送
  3: 'H5',//h5
  4: 'WathsApp',//WathsApp
}
const deviceTypeMap= {
  1: t('n200'),//安卓
  2: 'IOS',//群发
  3: 'H5',//群发
  4: t('n201'),//套壳APP
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
  pushType: undefined,
  deviceType: undefined,
  deleted: undefined,
  status: '0',
});

const getList = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    pagination.current = 1;
  }
  loading.value=true;
  pagination.pageNo = query.value.pageNo;
  pagination.pageSize = query.value.pageSize;
  const res: any = await pushMannerAdminList(query.value).finally(()=>{loading.value=false});
  if (res && res.code == "1") {
    dataSource.value = res.data;
    pagination.total = res.total;
  }
};
const showAddDialog = () => {
  addFrom.value = {
    id: undefined,
    pushType: undefined,
    deviceType: undefined,
    deleted: undefined,
    status: '0',
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
  const { id, pushType, deviceType, deleted, status } = value;
  addFrom.value = { id, pushType, deviceType, deleted, status };
  addDialog.value = true;
};
const closeAddDalog = () => {
  addFrom.value = {
    id: undefined,
    pushType: undefined,
    deviceType: undefined,
    deleted: undefined,
    status: '0',
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
  if(!addFrom.value.pushType){
    message.error(t('m563')+t('n197'));
    return;
  }

  if(!addFrom.value.deviceType){
    message.error(t('m562')+t('m554'));
    return;
  }
  let res;
  if (isEdit.value) {
    loading.value = true;
    res = await pushMannerAdminUpdate( addFrom.value).finally(()=>{loading.value=false});
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
