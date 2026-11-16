<script lang="ts" setup>
import { reactive, ref } from "vue";
import { usePagination, useRequest } from "vue-request";
import { useI18n } from "vue-i18n";
import { TableProps } from "ant-design-vue";
import { useVModel } from "@vueuse/core";
import {
  addPermission,
  delPermission,
  getPermissionById,
  putPermission,
} from "@/api/menu.api";
const { t } = useI18n();
const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  menuId: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);
const isDrawerOpen = useVModel(props, "modelValue", emit);
const state = reactive({
  isPermissionDialog: false,
  isEdit: false,
});
const permissionForm = ref({
  menuId: props.menuId,
  name: "",
  btnSign: "",
  method: "POST",
  serviceName: "ar-manager",
  url: "",
  id: "",
});
const columns:any = [
  {
    title: t("menuName"),
    dataIndex: "menuId",
    key: "menuId",
    align: "center",
  },
  {
    title: t("permissionsName"),
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: "btnSign",
    dataIndex: "btnSign",
    key: "btnSign",
    align: "center",
  },

  {
    title: "method",
    dataIndex: "method",
    key: "method",
    align: "center",
  },
  {
    title: t("serverName"),
    dataIndex: "serviceName",
    key: "serviceName",
    align: "center",
  },
  {
    title: "url",
    dataIndex: "url",
    key: "url",
    align: "center",
  },
  {
    title: t("operation"),
    key: "action",
    align: "center",
    width: 240,
  },
];
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const { data, run, loading } = usePagination(
  () => getPermissionById(props.menuId),
  {
    manual: true,
    onSuccess(res) {
      pagination.total = res.data.length;
    },
  }
);
const { run: runAddPermission, loading: addLoading } = useRequest(
  () => addPermission({ ...permissionForm.value, id: undefined }),
  {
    manual: true,
    onSuccess(res: any) {
      permissionForm.value = {
        menuId: props.menuId,
        name: "",
        btnSign: "",
        method: "",
        serviceName: "",
        url: "",
        id: "",
      };
      if (res?.code == 1) {
        state.isPermissionDialog = false;
        run();
      }
    },
  }
);
const { run: runPutPermission } = useRequest(
  () => putPermission({ ...permissionForm.value }),
  {
    manual: true,
    onSuccess(res: any) {
      if (res?.code == 1) {
        state.isPermissionDialog = false;
        run();
      }
    },
  }
);
const { run: runDelPermission } = useRequest(
  (record: any) => delPermission(record.id),
  {
    manual: true,
    onSuccess(res: any) {
      if (res?.code == 1) {
        run();
      }
    },
  }
);
const handleTableChange: TableProps["onChange"] = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};
const afterOpenChange = (open: true) => {
  if (open) {
    permissionForm.value.menuId = props.menuId;
    props.menuId && run();
  }
};
const close = () => {
  isDrawerOpen.value = false;
};
const onCreate = () => {
  state.isPermissionDialog = true;
  state.isEdit = false;
  permissionForm.value = {
    menuId: props.menuId,
    name: "",
    btnSign: "",
    method: "POST",
    serviceName: "ar-manager",
    url: "",
    id: "",
  };
};
const onEdit = (record: any = {}) => {
  state.isPermissionDialog = true;
  state.isEdit = true;
  permissionForm.value = {
    id: record.id,
    menuId: props.menuId,
    name: record.name || "",
    btnSign: record.btnSign,
    method: record.method || "",
    serviceName: record.serviceName,
    url: record.url || "",
  };
};
const onPermission = () => {
  if (state.isEdit) {
    runPutPermission();
  } else {
    runAddPermission();
  }
};
</script>

<template>
  <a-drawer
    :width="'80%'"
    :title="$t('m386')"
    closable
    :open="isDrawerOpen"
    @close="close"
    @afterOpenChange="afterOpenChange"
    maskClosable
  >
    <a-table
      :dataSource="data?.data"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      :scroll="{ x: '100%' }"
      @change="handleTableChange"
      bordered
      :row-key="(record: any) => JSON.stringify(record)"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-tag
            color="rgba(22, 155, 213, 1)"
            style="cursor: pointer"
            size="small"
            @click="onEdit(record)"
            >{{ $t("edit") }}
          </a-tag>
          <a-popconfirm
            :title="$t('t7')"
            :ok-text="$t('b9')"
            :cancel-text="$t('b10')"
            @confirm="runDelPermission(record)"
          >
            <template #description>
              <span style="color: red">{{ $t("t17") }}</span>
            </template>
            <a-tag
              color="rgba(253, 11, 26, 1)"
              style="cursor: pointer"
              size="small"
              >{{ $t("b11") }}
            </a-tag>
          </a-popconfirm>
        </template>
        <template v-if="column.key === 'name'">
          {{ $t(record.name) }}
        </template>
      </template>
    </a-table>
    <template #extra>
      <a-button type="primary" @click="onCreate">{{
        $t("addPermission")
      }}</a-button>
    </template>
  </a-drawer>
  <a-modal
    v-model:open="state.isPermissionDialog"
    :title="$t('addPermission')"
    :footer="null"
    destroyOnClose
  >
    <a-form
      ref="formRef"
      :model="permissionForm"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
      @finish="onPermission"
    >
      <a-form-item :label="$t('menuName')" name="menuId" required>
        <a-input v-trim v-model:value="permissionForm.menuId" :disabled="true" />
      </a-form-item>
      <a-form-item
        :label="$t('permissionsName')"
        name="name"
        required
        :help="$t('m426')"
      >
        <a-input v-trim v-model:value="permissionForm.name" />
      </a-form-item>
      <a-form-item :label="'btnSign'" name="name" required>
        <a-input v-trim v-model:value="permissionForm.btnSign" />
      </a-form-item>
      <a-form-item
        :label="$t('fetchMethod')"
        name="method"
        required
        :help="$t('m425')"
      >
        <a-input v-trim v-model:value="permissionForm.method" />
      </a-form-item>
      <a-form-item
        :label="$t('serverName')"
        name="serviceName"
        required
        :help="$t('m423')"
      >
        <a-input v-trim v-model:value="permissionForm.serviceName" />
      </a-form-item>
      <a-form-item label="url" name="url" required :help="$t('m424')">
        <a-input v-trim v-model:value="permissionForm.url" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }" required>
        <a-button type="primary" html-type="submit" :loading="addLoading">{{
          $t("b9")
        }}</a-button>
        <a-button
          style="margin-left: 10px"
          @click="state.isPermissionDialog = false"
          >{{ $t("l54") }}</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped></style>
