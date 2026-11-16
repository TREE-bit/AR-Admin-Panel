<template>
  <div class="search">
    <h2>{{ $t("m24") }}</h2>
    <a-button type="primary" :loading="loading" @click="showAddPageFun"  v-permission="'admin:role'">{{ $t("l52") }}</a-button>
  </div>
  <a-table
    bordered
    :dataSource="roleList"
    :pagination="pagination"
    :columns="columns"
    :loading="loading"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    :defaultExpandAllRows="true"
    rowKey="id"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'visible'">
        {{ record.visible ? $t("l53") : $t("l54") }}
      </template>
      <!-- <template v-if="column.key === 'status'">
        <a-tag>
          <template v-if="record.status === 1">
            <a-badge color="green" />
            {{ $t("publicType1") }}
          </template>
          <template v-else>
            <a-badge color="red" />
            {{ $t("disabled") }}
          </template>
        </a-tag>
      </template> -->
      <template v-if="column.key === 'action'">
         <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          v-permission="'admin:menu::role-put'"
          @click="showPermissionPage(record.id)"
          >{{ $t("b7") }}
        </a-tag>
          <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          
          >{{ $t("b8") }}
        </a-tag>
          <a-popconfirm
            :title="$t('t7')"
            @confirm="delMenuFun(record.id)"
            :ok-text="$t('b9')"
            :cancel-text="$t('b10')"
          >
          <template #description>
            <span style="color: red;">{{ $t('t17') }}</span>
          </template>
          <a-tag
              color="rgba(253, 11, 26, 1)"
              style="cursor: pointer"
              size="small"
              v-permission="'admin:menu::role-del'"
              >{{ $t("b11") }}
            </a-tag>
          </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addPermissionDialog" :title="$t('l55')" :footer="null">
    <a-form
      ref="formRef"
      :model="addRoleForm"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 13 }"
    >
      <a-form-item :label="$t('l56')" name="name">
        <a-input v-trim v-model:value="addRoleForm.name" />
      </a-form-item>
      <a-form-item :label="$t('l57')" name="code">
        <a-input v-trim v-model:value="addRoleForm.code" />
      </a-form-item>
      <a-form-item :label="$t('l58')" name="sort">
        <a-input-number v-model:value="addRoleForm.sort" :min="0" />
      </a-form-item>
      <a-form-item :label="$t('l59')" name="status">
        <a-switch
          v-model:checked="addRoleForm.status"
          :checked-children="$t('open')"
          :un-checked-children="$t('close')"
          :checkedValue="1"
          :unCheckedValue="0"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
        <a-button type="primary" :loading="loading" @click="addBtn(Boolean(addRoleForm.id))"
          >{{ addRoleForm.id ? $t("b8") : $t("b12") }}
        </a-button>
        <a-button style="margin-left: 10px" @click="closeAddPage">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <setRole ref="setRoleRef" />
</template>

<script setup lang="ts">
import setRole from "@/components/Admin/setRole.vue";
import { addRole, delRole, editRole } from "@/api/role.api";
import { onMounted, ref } from "vue";
import { adminRole } from "@/hooks/adminRole.hook";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const adminRoleHook = adminRole();
const setRoleRef = ref();
const addPermissionDialog = ref(false);
const loading= ref(false);
const addRoleForm = ref({
  code: "",
  name: "",
  sort: 0,
  status: 1,
});
const claerAddRoleForm = () => {
  addRoleForm.value = {
    code: "",
    name: "",
    sort: 0,
    status: 1,
  };
};
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const roleList = ref([]);
const closeAddPage = () => {
  addPermissionDialog.value = false;
  claerAddRoleForm();
};
const showAddPageFun = () => {
  addPermissionDialog.value = true;
  claerAddRoleForm();
};
const addBtn = async (isEdit: Boolean = false) => {
  let res;
  loading.value = true;
  if (isEdit) {
    res = await editRole(addRoleForm.value).finally(() => (loading.value = false));
  } else {
    res = await addRole(addRoleForm.value).finally(() => (loading.value = false));
  }
  if (res && res.code == 1) {
    closeAddPage();
    getList();
  }
};
const getList = async () => {
  loading.value = true;
  roleList.value = await adminRoleHook.getList().finally(() => (loading.value = false));
};
const delMenuFun = async (id: any) => {
  const res: any = await delRole(id);
  if (res && res.code == 1) {
    message.success(t('s9'))
    getList();
  }
};
const showEditPageFun = async (data: any) => {
  selectedRow();
  addRoleForm.value = data;
  addPermissionDialog.value = true;
};
const showPermissionPage = (data: any) => {
  selectedRow();
  adminRoleHook.showEditDialog(data);
};
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
  },
  {
    title: t("l56"),
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: t("l57"),
    dataIndex: "code",
    key: "code",
    align: "center",
  },
  {
    title: t("sort"),
    dataIndex: "sort",
    key: "sort",
    align: "center",
  },
  // {
  //   title: t("l59"),
  //   dataIndex: "status",
  //   key: "status",
  //   align: "center",
  // },
  {
    title: t("operation"),
    key: "action",
    align: "center",
  },
];
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style scoped lang="less">
</style>
