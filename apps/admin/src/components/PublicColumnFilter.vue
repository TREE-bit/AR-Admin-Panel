<template>
  <a-drawer
    v-model:open="visible"
    :title="$t('m739')"
    placement="right"
    :width="300"
    :closable="true"
  >
    <a-tree
      :checkable="true"
      :checked-keys="selectedColumns"
      :tree-data="treeData"
      :default-expanded-keys="[treeData[0]?.key]" 
      @check="onCheck"
      :check-strictly="true"
    />
    <a-row style="margin-top: 10px; text-align: right;">
      <a-button type="primary" @click="handleSelectAll" style="margin-right: 10px">
        {{ $t("m740") }}
      </a-button>
      <a-button type="primary" @click="save">{{ $t("save") }}</a-button>
    </a-row>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { savePageTableList } from "@/api/menu.api";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  open: {
    type: Boolean,
    required: true,
  },
  columns: {
    type: Array as () => Array<{ title: string; dataIndex: string; key: string; isRequired: boolean }>,
    required: true,
  },
  value: {
    type: Array as () => string[],
    default: () => [],
  },
  defaultColumns: {
    type: Array as () => string[],
    default: () => [],
  },
  menuId: {
    type: Number,
  }
});
const emits = defineEmits(["update:value", "update:open","update:defaultColumns"]);

const selectedColumns = ref(props.defaultColumns||props.value);
// Tree data structure
const treeData = computed(() =>
  props.columns.map((col) => ({
    title: col.title,
    key: col.dataIndex,
    disabled: col.isRequired, // Disable required fields
  }))
);
const onCheck = (checkedKeys: any[]) => {
  // Ensure that required columns are always selected
  const requiredColumns = props.columns.filter((col) => col.isRequired).map((col) => col.dataIndex);
  selectedColumns.value = [...new Set([...requiredColumns, ...checkedKeys.checked])];
  localStorage.setItem('page'+props.menuId, JSON.stringify(selectedColumns.value));
  emits("update:defaultColumns", selectedColumns.value);
};

// Handle reset action (unselect all)
const handleReset = () => {
  selectedColumns.value = props.columns.filter((col) => col.isRequired).map((col) => col.dataIndex);
};

// Handle select all action (select all options)
const handleSelectAll = () => {
  const allColumns = props.columns.filter((col) => !col.isRequired).map((col) => col.dataIndex);
  const requiredColumns = props.columns.filter((col) => col.isRequired).map((col) => col.dataIndex);
  selectedColumns.value = [...new Set([...allColumns, ...requiredColumns])];
  localStorage.setItem('page'+props.menuId, JSON.stringify(selectedColumns.value));
  emits("update:defaultColumns", selectedColumns.value);

};

const save = async () => {
  // const res: any = await savePageTableList({menuId:props.menuId, columns:selectedColumns.value.join(",")});
  // if (res && res.code === "1") {
  //   message.success(t("s10"));
  //   visible.value = false;
  // }
  visible.value = false;
}

// Watch for changes in the selected columns and emit to parent
watch(() => selectedColumns.value, (newSelectedColumns) => {
  emits("update:value", newSelectedColumns);
});

const visible = ref(props.open);

watch(() => props.open, (newVal) => {
  visible.value = newVal;
});
watch(visible, (newVal) => {
  emits("update:open", newVal);
});



onMounted(() => {
  // handleSelectAll(); // Initial full selection
});
</script>

<style scoped>
</style>
