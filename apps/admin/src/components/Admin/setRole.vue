<template>
  <a-drawer
    :width="'40%'"
    :title="$t('n1')"
    :placement="'right'"
    style="overflow: hidden;"
    v-model:open="RoleStore.isShowEditDialog"
  >
    <template #extra>
      <a-button type="primary" @click="save" class="mr-20">{{
        $t("b1")
      }}</a-button>
      <a-button @click="cancelRole">{{ $t("b10") }}</a-button>
    </template>
    <!-- default-expand-all -->
    <a-tree
      v-model:selectedKeys="selectedKeys"
      v-model:checkedKeys="checkedKeys"
      :height="treeHeight"
      checkable
      checkStrictly
      :defaultExpandedKeys="expandedKeys"
      :tree-data="menuTree"
      :field-names="fieldNames"
      @check="treeCheck"
    >
      <template #title="{ name, id }">
        <span :key="id">{{ $t(name) }}</span>
      </template>
    </a-tree>
  </a-drawer>
</template>

<script setup lang="ts">
import { adminRole } from "@/hooks/adminRole.hook";
import { onMounted, ref, watch } from "vue";
import { userInfo } from "@/hooks";
const { getMenus } = userInfo();
const {
  RoleStore,
  saveRole,
  cancelRole,
  menuTree,
  fieldNames,
  checkedKeys,
  selectedKeys,
  treeCheck,
  getMenuList,
} = adminRole();
const expandedKeys = ref([]);
const treeHeight = window.innerHeight - 140;
const save = async () => {
  await saveRole();
  getMenus();
  location.reload(); // 刷新路由表
};
// 监听 menuTree 数据加载完毕，提取顶级 id
watch(
  () => menuTree.value,
  (newTree) => {
    if (newTree && newTree.length > 0) {
      expandedKeys.value = newTree.map((item: { id: any }) => item.id); // 只展开一级菜单
    }
  },
  { immediate: true }
);
onMounted(() => {
  getMenuList();
});
</script>

<style scoped lang="less">
.container {
  border: 1px solid #888;
  width: 100%;
  .lv1 {
    display: flex;
    &-name {
      padding: 4px 6px;
      border-right: 1px solid #888;
    }
    & + .lv1 {
      border-top: 1px solid #888;
    }
    .lv2-container {
      flex: 1;
      .lv2-item {
        display: flex;
        flex: 1;
        .lv2-name {
          padding: 4px 6px;
          border-right: 1px solid #888;
        }
        & + .lv2-item {
          border-top: 1px solid #888;
        }
        .lv3-item {
          padding: 4px 6px;
        }
      }
    }
  }
}
</style>
