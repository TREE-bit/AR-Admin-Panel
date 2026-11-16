<template>
  <div class="search">
    <h2>{{ $t("m21") }}</h2>
    <a-row>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.ip"
          class="searchstyle"
          :placeholder="$t('l65')"
        />
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(query,1)"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <a-button
          type="primary"
          @click="addWhite"
          v-permission="'admin:syswhite:save'"
          >{{ $t("add") }}</a-button
        >
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="paginationConfig"
    :loading="loading"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <a-tag>
          <a-badge :color="record.status == 1 ? 'green' : 'red'" />
          {{ record.status == 1 ? $t("enabled") : $t("disabled") }}
        </a-tag>
      </template>
      <template v-if="column.key === 'ip'">
        <a-tooltip>
          <template #title>{{ record.ip }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.ip }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'clientType'">
        {{ clientTypeList[record.clientType] }}
      </template>
      <template v-if="column.key === 'action'">
        <!-- <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          v-permission="'admin:syswhite:update'"
          >{{ $t("edit") }}
        </a-tag> -->
        <a-tag
          :color="record.status == 1 ? 'rgba(250, 140, 22, 1)' : 'rgba(22, 119, 255, 1)'"
          style="cursor: pointer"
          size="small"
          @click="showStatusModal(record)"
          v-permission="STATUS_PERMISSION"
          >{{ record.status == 1 ? $t("m219") : $t("m218") }}
        </a-tag>
        <a-popconfirm
          :title="$t('t7')"
          :ok-text="$t('b9')"
          :cancel-text="$t('b10')"
          @confirm="delIp(record)"
        >
          <template #description>
            <span style="color: red">{{ $t("t17") }}</span>
          </template>
          <a-tag
            color="rgba(253, 11, 26, 1)"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:syswhite:del'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addWhiteDialog"
    :title="whiteForm.id ? $t('edit') + $t('m21') : $t('add') + $t('m21')"
    :footer="null"
  >
    <a-form
      ref="formRef"
      :model="whiteForm"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 13 }"
    >
      <a-form-item
        label="IP"
        name="ip"
        :rules="[{ required: true, message: 'Please input IP!' }]"
      >
        <a-input v-trim v-model:value="whiteForm.ip" :disabled="isEdit" />
      </a-form-item>
      <a-form-item
        :label="$t('m255')"
        name="clientType"
        :rules="[{ required: true, message: 'Please select Backstage type!' }]"
      >
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('m62')"
          v-model:value="whiteForm.clientType"
        >
          <a-select-option
            v-for="(item, index) in clientType"
            :key="index"
            :value="item.value"
            >{{ item.key }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('remark')"
        name="remark"
        :rules="[{ required: true, message: 'Please input remark!' }]"
      >
        <a-input v-trim v-model:value="whiteForm.remark" />
      </a-form-item>
      <a-form-item :label="$t('state')" name="status">
        <a-switch
          v-model:checked="whiteForm.status"
          :checked-children="$t('open')"
          :un-checked-children="$t('close')"
          :checkedValue="'1'"
          :unCheckedValue="'0'"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="addBtn()">{{
          whiteForm.id ? $t("b8") : $t("b12")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddWhitedalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:open="statusDialog"
    :title="statusRow.status == 1 ? $t('n2071') : $t('n2072')"
    :closable="!statusLoading"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="status-info">
      <div><span class="status-label">IP</span>{{ statusRow.ip }}</div>
      <div>
        <span class="status-label">{{ $t("m255") }}</span>{{ clientTypeList[statusRow.clientType] || "-" }}
      </div>
    </div>
    <p>{{ statusRow.status == 1 ? $t("n2073") : $t("n2074") }}</p>
    <template #footer>
      <a-button :disabled="statusLoading" @click="statusDialog = false">{{
        $t("b10")
      }}</a-button>
      <a-button
        type="primary"
        :class="{ 'disable-btn': statusRow.status == 1 }"
        :loading="statusLoading"
        @click="changeStatus"
        >{{ statusRow.status == 1 ? $t("n2075") : $t("n2076") }}</a-button
      >
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  createWhite,
  editWhite,
  getsysWhiteList,
  delWhite,
  enableWhite,
  disableWhite,
} from "@/api/log.api";
import { useToast } from "@/hooks/useToast.hook";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { usePagination } from "@/plugins/dataMap";
const { paginationConfig } = usePagination();
const { getTabH } = useTabHeight(340);
const { t } = useI18n();
const toast = useToast();
const dataSource = ref([]);
const loading = ref(false);
const clientType = ref([
  { value: "1", key: t("m253") },
  { value: "2", key: t("m254") },
]);
const clientTypeList = ref<any>({
  "1": t("m253"),
  "2": t("m254"),
});
const query = ref({
  createBy: "",
  createTime: "",
  ip: "",
  status: "",
  updateBy: "",
  clientType: "",
  updateTime: "",
  pageNo: 1,
  pageSize: 20,
});
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
  },
  {
    title: "IP",
    dataIndex: "ip",
    key: "ip",
    align: "center",
  },
  {
    title: t("m255"),
    dataIndex: "clientType",
    key: "clientType",
    align: "center",
  },
  {
    title: t("l66"),
    dataIndex: "createBy",
    key: "createBy",
    align: "center",
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createBy",
    align: "centTime",
    width: 170,
  },
  {
    title: t("remark"),
    dataIndex: "remark",
    key: "remark",
    align: "center",
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
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
    width: 170,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    fixed: "right",
  },
];
const getList = async (query: any, isFirst: any =null) => {
  if(isFirst){
    query.pageNo = 1;
    paginationConfig.current = 1;
  }
  loading.value = true;
  paginationConfig.current = query.pageNo;
  paginationConfig.pageSize = query.pageSize;
  const res:any = await getsysWhiteList(query).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data || [];
    paginationConfig.total = res.total || 0;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  paginationConfig.pageSize = pag.pageSize;
  paginationConfig.current = pag.current;
  getList(
    Object.assign({}, query.value, {
      pageSize: pag.pageSize,
      pageNo: pag?.current,
    })
  );
};
const resetQuery = () => {
  query.value = {
    createBy: "",
    createTime: "",
    ip: "",
    status: "",
    updateBy: "",
    updateTime: "",
    pageNo: 1,
    pageSize: 20,
    clientType: "",
  };
  paginationConfig.current = 1;
  paginationConfig.pageSize = 20;
  clearSelected();
  getList(query.value);
};
/****************add edit***************/
const addWhiteDialog = ref(false);
const whiteForm:any = ref({
  ip: "",
  remark: "",
  clientType: undefined,
  status: "1",
});
const addWhite = () => {
  whiteForm.value = {
    ip: "",
    remark: "",
    clientType: undefined,
    status: "1",
  };
  addWhiteDialog.value = true;
  isEdit.value = false;
};
const isEdit = ref(false);
// const showEditPageFun = (data: any) => {
//   selectedRow();
//   whiteForm.value = JSON.parse(JSON.stringify(data));
//   isEdit.value = true;
//   addWhiteDialog.value = true;
// };
const closeAddWhitedalog = () => {
  whiteForm.value = {
    ip: "",
    remark: "",
    clientType: undefined,
    status: "1",
  };
  isEdit.value = false;
  addWhiteDialog.value = false;
};
const delIp = async (value: any) => {
  const res:any = await delWhite({ id: value.id });
  if (res && res.code === "1") {
    toast.success(t("s10"));
    resetQuery();
  }
};
/****************enable disable***************/
const STATUS_PERMISSION = "admin:syswhite:enable";
const statusDialog = ref(false);
const statusLoading = ref(false);
const statusRow = ref<any>({});
const showStatusModal = (record: any) => {
  statusRow.value = { ...record };
  statusDialog.value = true;
};
const changeStatus = async () => {
  const isDisable = statusRow.value.status == 1;
  statusLoading.value = true;
  try {
    const params = { id: statusRow.value.id };
    const res: any = isDisable
      ? await disableWhite(params)
      : await enableWhite(params);
    if (res && res.code === "1") {
      toast.success(isDisable ? t("m238") : t("m237"));
      statusDialog.value = false;
      // 留在当前页刷新，带回最新的状态、操作人和操作时间
      getList(
        Object.assign({}, query.value, {
          pageNo: paginationConfig.current,
          pageSize: paginationConfig.pageSize,
        })
      );
    } else {
      message.error(t("n2077"));
    }
  } catch (e) {
    message.error(t("n2077"));
  } finally {
    statusLoading.value = false;
  }
};
const addBtn = async () => {
  if (whiteForm.value.ip === "") {
    return message.error("Please input IP!");
  }
  if (whiteForm.value.clientType === "") {
    return message.error("Please select Backstage type!");
  }
  if (whiteForm.value.remark.trim() === "") {
    return message.error("Please input remark!");
  }
  let res:any;
  if (isEdit.value) {
    res = await editWhite(whiteForm.value);
  } else {
    res = await createWhite(whiteForm.value);
  }
  if (res && res.code === "1") {
    toast.success(t("s8"));
    closeAddWhitedalog();
    resetQuery();
  }
};
onMounted(() => {
  getList(query.value);
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
.status-info {
  padding: 12px 16px;
  margin-bottom: 12px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  line-height: 26px;
}
.status-label {
  display: inline-block;
  width: 80px;
  color: rgba(0, 0, 0, 0.45);
}
.disable-btn:not(:disabled) {
  background: #fa8c16;
  &:hover {
    background: #ffa940;
  }
}
</style>
