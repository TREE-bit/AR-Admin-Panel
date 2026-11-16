<template>
  <div class="search">
    <a-button
      type="primary"
      @click="showAddDialog"
      v-permission="'admin:announcement:createAnnouncement'"
      >{{ $t("add") }}</a-button
    >
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: 'max-content' , y: '670px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        {{ statusTypeMap[record.status] }}
      </template>
      <template v-if="column.key === 'platformType'">
        {{ $getMapItem(contentPlantTypeMap,record.platformType) || '-' }}
      </template>
      <template v-if="column.key === 'announcementTitle'">
        <div class="limit-title">
          {{ record.announcementTitle }}
        </div>
      </template>
      <template v-if="column.key === 'announcementContent'">
        <div class="limit-content" v-html="record.announcementContent"></div>
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="copyLink(record)"
          v-permission="'admin:announcement:fetchAnnouncementLinkById'"
          >{{ $t("m217") }}
        </a-tag>
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:announcement:updateAnnouncement'"
          >{{ $t("edit") }}
        </a-tag>

        <a-popconfirm
          :title="$t('t16')"
          :description="$t('t17')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record)"
        >
          <a-tag
            color="rgba(253, 11, 26, 1)"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:announcement-del'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
        <a-popconfirm
          :title="record.status === 1 ? $t('m226') : $t('m225')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="checkenable(record)"
        >
          <a-tag
            :color="
              record.status === 1
                ? 'rgba(253, 11, 26, 1)'
                : 'rgba(22, 155, 213, 1)'
            "
            style="cursor: pointer"
            size="small"
            v-permission="'admin:announcement:disable'"
            >{{ record.status === 1 ? $t("m219") : $t("m218") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    :title="$t('m214')"
    :footer="null"
    width="800px"
  >
    <a-form
      :model="addFrom"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item :label="$t('sort')" name="sortOrder">
        <a-input-number
          v-model:value="addFrom.sortOrder"
          style="width: 40%"
          :min="0"
        />
      </a-form-item>
      <a-form-item :label="$t('m215')" name="announcementTitle" :rules="[{ required: true, message: ''}]">
        <a-input v-trim maxLength="50" :placeholder="$t('m215')" v-model:value="addFrom.announcementTitle" />
      </a-form-item>
      <a-form-item :label="$t('l69')" name="announcementContent" :rules="[{ required: true, message: ''}]">
        <quillEditor
          v-if="addDialog"
          :announcementContent="addFrom.announcementContent"
          @change="setAnnouncementContent"
        />
      </a-form-item>
      <a-form-item :label="$t('m222')" name="status">
        <a-switch v-model:checked="addChecked" @click="changeAddChecked" />
      </a-form-item>
      <a-form-item :label="$t('n1494')" name="platformType" :rules="[{ required: true, message: ''}]">
        <a-select
          v-model:value="addFrom.platformType"
          :placeholder="$t('n1494')"
          :options="Object.entries(contentPlantTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
        ></a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
        <a-button type="primary" @click="addBtn">{{
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
  getAnnouncementLit,
  addAnnouncement,
  disableAnnouncement,
  enableAnnouncement,
  delAnnouncement,
  updateAnnouncement,
  getAnnouncementLink,
} from "@/api/c2cconfig.api";
import quillEditor from "@/components/quillEditor.vue";
import { message } from "ant-design-vue";
import { onMounted, ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useClipboard } from "@vueuse/core";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { contentPlantTypeMap } from "@/utils/publicData";
const { t } = useI18n();
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    align: "center",
  },
  {
    title: t("m220"),
    dataIndex: "announcementTitle",
    key: "announcementTitle",
    align: "center",
  },
  {
    title: t("m221"),
    dataIndex: "announcementContent",
    key: "announcementContent",
    align: "center",
  },
  {
    title: t("sort"),
    dataIndex: "sortOrder",
    key: "sortOrder",
    width: 200,
    align: "center",
  },
  {
    title: t("m222"),
    dataIndex: "status",
    key: "status",
    width: 200,
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
    width: 300,
  },
  {
    title: t("m224"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 300,
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 300,
  },
  {
    title: t("l71"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 300,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    // width: 300,
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
const addFrom = ref<any>({
  announcementContent: "",
  sortOrder: 0,
  announcementTitle: "",
  status: null,
  platformType: undefined,
});

const changeAddChecked = () => {
  addChecked.value ? (addFrom.value.status = 1) : (addFrom.value.status = 0);
};
const getList = async () => {
  const { pageNo, pageSize } = pagination;
  const res: any = await getAnnouncementLit({
    pageNo,
    pageSize,
  });
  if (res && res.code === "1") {
    dataSource.value = res.data.list;
    pagination.total = res.total;
  }
};
const showAddDialog = () => {
  addFrom.value = {
    announcementContent: "",
    sortOrder: 0,
    announcementTitle: "",
    status: 0,
  };
  addChecked.value = false;
  addDialog.value = true;
};
let copyType = true;
const copyLink = async (value: any) => {
  selectedRow();
  if (copyType) {
    copyType = false;
    const { copy } = useClipboard();
    const res: any = await getAnnouncementLink(value);
    if (res && res.code === "1") {
      copy(res.data.announcementLink);
      message.success("Successful");
      copyType = true;
    }
  }
};
const editDialog = (value: any) => {
  selectedRow();
  isEdit.value = true;
  const { id, announcementContent, sortOrder, announcementTitle, status, platformType } =
    value;
  addFrom.value = {
    id,
    announcementContent,
    sortOrder,
    announcementTitle,
    status,
    platformType
  };
  addFrom.value.status === 1
    ? (addChecked.value = true)
    : (addChecked.value = false);
  addDialog.value = true;
};
const del = async (value: any) => {
  const { id } = value;
  const res: any = await delAnnouncement({ id });
  if (res && res.code === "1") {
    message.success(t("s9"));
    getList();
  }
};
const checkenable = async (value: any) => {
  const { id } = value;
  let res;
  if (value.status === 1) {
    res = await disableAnnouncement({ id });
  } else {
    res = await enableAnnouncement({ id });
  }
  if (res && res.code === "1") {
    message.success(isEdit.value ? t("m238") : t("m237"));
    getList();
  }
};
const closeAddDalog = () => {
  addFrom.value = {
    announcementContent: "",
    sortOrder: 0,
    announcementTitle: "",
    status: null,
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
  let res;
  if(!addFrom.value.announcementTitle){
    message.error(t('m562')+t('m215'));
    return
  }
  if(!addFrom.value.announcementContent){
    message.error(t('m562')+t('l69'));
    return
  }
  if(!addFrom.value.platformType){
    message.error(t('m563')+t('n1494'));
    return
  }
  if (isEdit.value) {
    const { announcementContent, announcementTitle, sortOrder, status, platformType } =
      addFrom.value;
    const editFrom = {
      announcementContent,
      announcementTitle,
      sortOrder,
      status,
      platformType
    };
    res = await updateAnnouncement(addFrom.value.id, editFrom);
  } else {
    res = await addAnnouncement(addFrom.value);
  }
  if (res && res.code === "1") {
    message.success(isEdit.value ? t("s7") : t("s8"));
    getList();
    closeAddDalog();
  }
};
const setAnnouncementContent = (value: any) => {
  addFrom.value.announcementContent = value;
};
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
:deep(tr td img) {
  max-width: 100px;
  max-height: 100px;
}
</style>
