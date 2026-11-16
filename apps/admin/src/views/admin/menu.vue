<template>
  <!-- <PageHeader /> -->
  <div class="search">
    <h2>{{ $t('m23') }}</h2>
    <a-button
      type="primary"
      @click="showAddPageFun"
      :loading="loading"
      v-permission="'admin:menu::role-add'"
      >{{ $t("addMenu") }}</a-button
    >
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :loading="loading"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    :defaultExpandAllRows="true"
    :pagination="false"
    rowKey="id"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'visible'">
        <a-tag :color="record.visible ? 'green' : 'red' ">
          {{ record.visible ? $t("enabled") : $t("disabled") }}
        </a-tag>
      </template>
      <template v-if="column.key === 'name'">
        <a-tooltip>
          <template #title>{{ $t(record.name) }}</template>
          <div class="toopTipStyle">{{ $t(record.name) }}</div>
        </a-tooltip>
      </template>
      <!-- <template v-if="column.key === 'name'">
        {{ $t(record.name) }}
      </template> -->
      <template v-if="column.key === 'component'">
        <a-tooltip>
          <template #title>{{ record.component }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.component }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'path'">
        <a-tooltip>
          <template #title>{{ record.path }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.path }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'redirect'">
        <a-tooltip>
          <template #title>{{ record.redirect }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.redirect }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="openPermissionPage(record.id)"
          v-if="record.parentId != '-1'"
          v-permission="'admin:permission::list'"
          >{{ $t("m386") }}
        </a-tag>

        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          v-permission="'admin:menu:-put'"
          >{{ $t("edit") }}
        </a-tag>
        <a-popconfirm
          :title="$t('t7')"
          :ok-text="$t('b9')"
          :cancel-text="$t('b10')"
          @confirm="delMenuFun(record.id)"
        >
          <template #description>
            <span style="color: red">{{ $t("t17") }}</span>
          </template>
          <a-tag
            color="rgba(253, 11, 26, 1)"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:menu:-delete'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addPageDialog" :title="$t(title)" :footer="null">
    <a-form
      ref="formRef"
      :model="addForm"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 13 }"
    >
      <a-form-item :label="t('parentMenu')" name="parentId" required>
        <a-select
          allowClear
          ref="select"
          v-model:value="addForm.parentId"
          style="width: 120px"
        >
          <a-select-option
            v-for="(item, index) in selectList"
            :value="item.id"
            :key="index"
            >{{ $t(item.name) }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('menuName')" name="name" required>
        <a-input v-trim v-model:value="addForm.name" />
      </a-form-item>
      <a-form-item :label="$t('menuIcon')" name="icon" required>
        <a-input v-trim v-model:value="addForm.icon" />
      </a-form-item>
      <a-form-item :label="t('componentPath')" name="component" required>
        <a-input v-trim v-model:value="addForm.component" />
      </a-form-item>
      <a-form-item :label="t('l51')" name="path" required>
        <a-input v-trim v-model:value="addForm.path" />
      </a-form-item>
      <a-form-item :label="$t('sort')" name="sort" required>
        <a-input-number v-model:value="addForm.sort" :min="0" />
      </a-form-item>
      <a-form-item :label="$t('redirectPath')" name="redirect" required>
        <a-input v-trim v-model:value="addForm.redirect" />
      </a-form-item>
      <a-form-item :label="$t('state')" name="visible">
        <a-switch
          v-model:checked="addForm.visible"
          :checked-children="$t('enabled')"
          :un-checked-children="$t('disabled')"
          :checkedValue="1"
          :unCheckedValue="0"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" :loading="loading" @click="addMenuFun(Boolean(addForm.id))">{{
          addForm.id ? $t("b9") : $t("b12")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddPage">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>

  <roleModal v-model="isDrawerOpen" :menuId="menuId" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getMenuList, delMenu, editMenu, addMenu } from "@/api/menu.api";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import roleModal from "./components/role-modal.vue";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
const addPageDialog = ref(false);
const addForm = ref({
  component: "",
  icon: "",
  name: "",
  parentId: "",
  path: "",
  redirect: "",
  sort: 0,
  visible: 0,
});
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  // showTotal: (total: any) => t("total", [total]),
});
const menuList: any = ref([]);
const title = ref("");
const isDrawerOpen = ref(false);
const menuId = ref("");
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 120,
  },
  {
    title: t("menuName"),
    dataIndex: "name",
    key: "name",
    align: "center",
    width: 200,
  },
  {
    title: t("componentPath"),
    dataIndex: "component",
    key: "component",
    align: "center",
    width: 150,
  },
  {
    title: t("menuIcon"),
    dataIndex: "icon",
    key: "icon",
    align: "center",
    width: 150,
  },
  {
    title: t("parentMenuId"),
    dataIndex: "parentId",
    key: "parentId",
    align: "center",
    width: 80,
  },
  {
    title: t("routerPath"),
    dataIndex: "path",
    key: "path",
    align: "center",
    width: 150,
  },
  {
    title: t("redirectPath"),
    dataIndex: "redirect",
    key: "redirect",
    align: "center",
    width: 150,
  },
  {
    title: t("sort"),
    dataIndex: "sort",
    key: "sort",
    width: 80,
    align: "center",
  },
  {
    title: t("state"),
    dataIndex: "visible",
    key: "visible",
    width: 100,
    align: "center",
  },
  {
    title: t("operation"),
    key: "action",
    align: "center",
    width: 160,
    fixed: "right",
  },
];
const dataSource = computed(() => {
  const list = menuList.value.map((i: any) => {
    if (i.children && i.children.length) {
      i.children = i.children.map((e: any) => {
        delete e.children;
        return e;
      });
    } else {
      delete i.children;
    }
    return i;
  });
  return list;
});
const selectList = computed(() => {
  return [{ name: t("lv1Menu"), id: -1 }, ...menuList.value];
});
const showAddPageFun = async () => {
  title.value = "addMenu";
  addForm.value = {
    component: "",
    icon: "",
    name: "",
    parentId: "",
    path: "",
    redirect: "",
    sort: 0,
    visible: 0,
  };
  getList();
  addPageDialog.value = true;
};
const openPermissionPage = (id: string) => {
  selectedRow();
  isDrawerOpen.value = true;
  menuId.value = id;
};
const showEditPageFun = async (data: any) => {
  selectedRow();
  addForm.value = data;
  title.value = "edit";
  delete addForm.value.children;
  addPageDialog.value = true;
  getList();
};
const addMenuFun = async (isEdit = false) => {
  let res;
  if (isEdit) {
    const {
      component,
      icon,
      id,
      name,
      parentId,
      path,
      redirect,
      sort,
      visible,
    } = addForm.value;
    res = await editMenu({
      component,
      icon,
      id,
      name,
      parentId,
      path,
      redirect,
      sort,
      visible,
    });
  } else {
    loading.value = true;
    res = await addMenu(addForm.value).finally(() => (loading.value = false));
  }
  if (res && res.code == 1) {
    closeAddPage();
    getList();
  }
};
const closeAddPage = async () => {
  addPageDialog.value = false;
  resetAddForm();
};
const resetAddForm = () => {
  addForm.value = {
    component: "",
    icon: "",
    name: "",
    parentId: "",
    path: "",
    redirect: "",
    sort: 0,
    visible: 0,
  };
};
const loading = ref(false);
const getList = async () => {
  loading.value = true;
  const res: any = await getMenuList().finally(() => (loading.value = false));
  if (res && res.code == 1) {
    menuList.value = res.data;
  }
};
const delMenuFun = async (id) => {
  loading.value = true;
  const res: any = await delMenu(id).finally(() => (loading.value = false));
  if (res && res.code == 1) {
    getList();
    message.success(t("s9"));
  }
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight().getTabH.value;
});
</script>
<style scoped lang="less">
.head {
  margin-bottom: 16px;
}
:deep(.ant-pagination) {
  display: none;
}
</style>
