<template>
  <div class="search">
    <h2>{{ $t('m466') }}</h2>
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
          @click="getList(query, 1)"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <a-button
          type="primary"
          @click="addWhite"
          v-permission="'admin:tradeIpBlack:save'"
          >{{ $t("add") }}</a-button
        >
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%', y: getTabH+'px' }"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'ipAddress'">
        <a-tooltip>
          <template #title>{{ record.ipAddress }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.ipAddress }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'status'">
        <a-tag>
          <a-badge :color="record.status == 1 ? 'green' : 'red'" />
          {{ record.status == 1 ? $t("enabled") : $t("disabled") }}
        </a-tag>
      </template>
      <template v-if="column.key === 'reason'">
        <a-tooltip :title="record.reason">
          <div class="reason">{{ record.reason }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          v-permission="'admin:tradeIpBlack:save'"
          >{{ $t("edit") }}
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
            v-permission="'admin:tradeIpBlack:del'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="onRelated(record)"
          v-permission="'admin:memberInfoAdmin:relationMemberList'"
          >{{ $t("m469") }}
        </a-tag>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addWhiteDialog"
    :title="(isEdit ? $t('edit') : $t('add')) + ' ' + $t('m208')"
    :footer="null"
  >
    <a-form
      ref="formRef"
      :model="whiteForm"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 13 }"
    >
      <a-form-item
        label="IP"
        name="ip"
        :rules="[{ required: true, message: 'Please input IP!' }]"
      >
        <a-input v-trim :disabled="isEdit" v-model:value="whiteForm.ip" />
      </a-form-item>
      <a-form-item
        :label="$t('remark')"
        name="remark"
        :rules="[{ required: true, message: 'Please input remark!' }]"
      >
        <a-textarea v-model:value="whiteForm.remark" />
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
        <a-button type="primary" @click="addBtn(Boolean(whiteForm.id))">{{
          whiteForm.id ? $t("b8") : $t("b12")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddWhitedalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <BlackRelatedModal v-model="relatedState.relatedOpen" :ip="relatedState.ip" />
</template>
<script lang="ts" setup>
import { onMounted, ref, h, reactive } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { createBlack, getsysBlackList, delBlack } from "@/api/log.api";
import { useToast } from "@/hooks/useToast.hook";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import BlackRelatedModal from "./components/BlackRelatedModal.tsx";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
const toast = useToast();
const dataSource = ref([]);
const loading = ref(false);
const query = ref({
  id: "",
  ip: "",
  status: "",
  remark: "",
  pageNo: 1,
  pageSize: 20,
});
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: "IP",
    dataIndex: "ipAddress",
    key: "ipAddress",
    align: "center",
  },
  {
    title: t("remark"),
    dataIndex: "reason",
    key: "reason",
    align: "center",
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 120,
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 180,
  },
  {
    title: t("updateTime"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 180,
  },
  {
    title: t("l66"),
    dataIndex: "createBy",
    key: "createBy",
    align: "center",
    width: 120,
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 120,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
  },
];
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const relatedState = reactive({
  relatedOpen: false,
  ip: "",
});
const onRelated = (record: any) => {
  selectedRow();
  relatedState.relatedOpen = true;
  relatedState.ip = record.ipAddress;
};
const getList = async (query: any, isFirst: any = null) => {
  if (isFirst) {
    query.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  pagination.value.current = query.pageNo;
  pagination.value.pageSize = query.pageSize;
  const res: any = await getsysBlackList(query).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data || [];
    pagination.value.total = res.total || 0;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  getList(
    Object.assign({}, query.value, {
      pageSize: pag.pageSize,
      pageNo: pag?.current,
    })
  );
};
const resetQuery = () => {
  query.value = {
    id: "",
    ip: "",
    status: "",
    remark: "",
    pageNo: 1,
    pageSize: pagination.value.pageSize,
  };
  pagination.value.current = 1;
  clearSelected();
  getList(query.value);
};
const isEdit = ref(false);
const showEditPageFun = (data: any) => {
  selectedRow();
  const { ipAddress, id, reason, status } = data;
  whiteForm.value = {
    ip: ipAddress,
    remark: reason,
    status,
    id,
  };
  isEdit.value = true;
  addWhiteDialog.value = true;
};
/****************add edit***************/
const addWhiteDialog = ref(false);
const whiteForm = ref({
  ip: "",
  remark: "",
  status: "1",
});
const addWhite = () => {
  whiteForm.value = {
    ip: "",
    remark: "",
    status: "1",
  };
  addWhiteDialog.value = true;
  isEdit.value=false;
};
const closeAddWhitedalog = () => {
  whiteForm.value = {
    ip: "",
    remark: "",
    status: "1",
  };
  addWhiteDialog.value = false;
};
const delIp = async (value: any) => {
  const res: any = await delBlack({ id: value.id });
  if (res && res.code === "1") {
    toast.success(t("s10"));
    pagination.value.current = 1;
    resetQuery();
  }
};
const addBtn = async () => {
  if (whiteForm.value.ip === "") {
    return message.error("Please input IP!");
  }
  if (whiteForm.value.remark.trim() === "") {
    return message.error("Please input remark!");
  }
  const res: any = await createBlack(whiteForm.value);
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
.reason {
  text-align: center;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 auto;
}
</style>
