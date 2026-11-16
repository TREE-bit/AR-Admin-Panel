import { ref, watch, computed, type Ref } from "vue";
import { useRoute } from "vue-router";


//使用时需要将解构放在columns后面，带序号的列表需要给columns中的序号列加上key，参考“申诉列表”
//注意：需要至少一个必选项，如下添加isRequired: true,

// {
//   title: t("m203"),
//   dataIndex: "appealType",
//   key: "appealType",
//   align: "center",
//   isRequired: true,
//   width: 130,
// },


export function useTableColumnDrawer(columns: any[]) {
  const menu:any = JSON.parse(localStorage.getItem("AR_ACCESS_MENU") || '').value || [];
  const route = useRoute();
  const path = route.fullPath;
  const registryPath = route.path;
  const menuId = menu.filter((item: any) => item.component === path)[0]?.id || null;

  // 动态设置 table 列
  const defaultColumns = ref(columns.map((col) => col.key));
  // 控制展示列
  const selectedColumns = ref(defaultColumns.value);

  // 动态设置 table 列
  watch(
    () => defaultColumns.value,
    (val) => {
      selectedColumns.value = val;
    }
  );
  
  const dMenn =localStorage.getItem('page' + menuId);

  const dynamicColumns = computed(() => {
    return columns.filter((col) => selectedColumns.value.includes(col.key));
  });
  // ant-design-vue 4.x 的 BodyRow 没有给单元格 vnode 设置 key（columnsKey 漏了 .value），
  // 在中间插入一列时单元格会按位置错位 patch，相邻列模板同 tag 同 key 就会触发
  // Vue patchBlockChildren 报错（reading 'el'）。给 <a-table :key="tableKey"> 让可见列集合
  // 变化时整表重挂载，绕开这个问题。
  const tableKey = computed(() => dynamicColumns.value.map((col) => col.key).join("|"));

  tableColumnRegistry.set(registryPath, {
    columns: columns as ColumnItem[],
    selectedColumns: selectedColumns as Ref<string[]>,
  });
  // 定义显示抽屉的状态
  const drawerVisible = ref(false);

  // 用于打开抽屉
  const openDrawer = () => {
    selectedColumns.value = defaultColumns.value;
    drawerVisible.value = true;
  };

  const setSelColumns = (data: any = null) => {
    const tMenn =localStorage.getItem('page' + menuId);
    const pageMenu:any = ref('');
    if (tMenn) {
      pageMenu.value = JSON.parse(tMenn);
    }
    const isHavePageMenu = pageMenu.value && pageMenu.value.every((item: any) => columns.map((col) => col.key).includes(item));

    if (!isHavePageMenu) {
      localStorage.removeItem('page' + menuId);
    }
    if (data && data.length > 0) {
      defaultColumns.value = data.map((item: any) => item.columnName);
    }else{
      if(tMenn){
        defaultColumns.value = pageMenu.value || columns.map((col) => col.key);
      }else{
        defaultColumns.value = pageMenu.value || columns.filter((col) => col.isRequired !=false).map((col) => col.key);
      }
    }
  }
  setSelColumns();
  return {
    menuId,
    defaultColumns,
    selectedColumns,
    dynamicColumns,
    tableKey,
    drawerVisible,
    openDrawer,
    setSelColumns,
  };
}
type ColumnItem = {
  key?: string;
  dataIndex?: string | string[];
  exportFields?: string[] | string;
};

const tableColumnRegistry = new Map<
  string,
  { columns: ColumnItem[]; selectedColumns: Ref<string[]> }
>();

const EXCLUDED_EXPORT_KEYS = new Set(["operate", "operation", "index"]);

export function getExportFieldsByPath(path: string) {
  const record = tableColumnRegistry.get(path);
  if (!record) {
    return undefined;
  }

  const columnMap = new Map<string, ColumnItem>();
  record.columns.forEach((col) => {
    if (col?.key) {
      columnMap.set(String(col.key), col);
    }
  });

  const fields: string[] = [];
  (record.selectedColumns.value || []).forEach((selectedKey) => {
    const key = String(selectedKey);
    if (EXCLUDED_EXPORT_KEYS.has(key)) {
      return;
    }

    const col = columnMap.get(key);
    const dataIndex =
      col && typeof col.dataIndex === "string" ? col.dataIndex : undefined;
    if (dataIndex && EXCLUDED_EXPORT_KEYS.has(dataIndex)) {
      return;
    }

    const candidates =
      col?.exportFields ??
      dataIndex ??
      (Array.isArray(col?.dataIndex) ? undefined : col?.key) ??
      key;
    const normalized = Array.isArray(candidates) ? candidates : [candidates];
    normalized.forEach((field) => {
      if (!field) {
        return;
      }
      const exportField = String(field);
      if (!EXCLUDED_EXPORT_KEYS.has(exportField) && !fields.includes(exportField)) {
        fields.push(exportField);
      }
    });
  });

  return fields;
}
