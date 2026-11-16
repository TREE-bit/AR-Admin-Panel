import { getRoleListPage } from "@/api/role.api";
import { computed, ref } from "vue";
import { menuTreeHook } from "./menuTree.hook";
import { useToast } from "@/hooks";
const toast = useToast();

const roleStore = ref({
  isShowEditDialog: false,
});
const MenuTreeHook = menuTreeHook();
const menuTreeData: any = ref([]);
const selectedKeys = ref<string[]>([]);
const checkedKeys = ref<string[]>([]);
const menuId = ref("0");
export function adminRole() {
  const selectList = ref([]);

  const halfCheckedKeys = ref<any[]>([]);

  const fieldNames = ref({
    key: "id",
  });
  const RoleStore = computed(() => {
    return roleStore.value;
  });
  const menuTree = computed(() => {
    const list = menuTreeData.value.map((item: any) => {
      item.children = item.children.map((l2: any) => {
        l2.children = l2.children.concat(l2.listPermission);
        return l2;
      });
      item.children = item.children.concat(item.listPermission);
      return item;
    });

    return list;
  });
  const getList = async () => {
    const res: any = await getRoleListPage({ pageNo: 1, pageSize: 20 });
    if (res && res.code === "1") {
      return res.data || [];
    }
    return [];
  };
  // 总菜单权限树
  const getMenuList = async () => {
    menuTreeData.value = await MenuTreeHook.getMenuTreeFun();
  };
  // 当前角色菜单树
  const getCurrentMenuList = async (id: string) => {
    let res = await MenuTreeHook.inquireMenuFun(id);
    return res;
  };
  const setEditDialog = (val: boolean) => {
    roleStore.value.isShowEditDialog = val;
  };
  const getMenuCash = (list: any) => {
    let arr: any = [];
    list
      .filter((item: any) => item.component !== "Layout")
      .map((item: any) => {
        if (item.listPermission) {
          const aa = getMenuCash(item.listPermission);
          arr.push(aa);
        }
        arr.push(item.id);
      });
    return arr;
  };
  const showEditDialog = async (data: any) => {
    menuId.value = data; //
    let list = await getCurrentMenuList(data);
    checkedKeys.value = getMenuCash(list).flat(Infinity);
    roleStore.value.isShowEditDialog = true;
  };
  const treeData = (data: any, allTree: any) => {
    let arr = [];
    let allListObj = filterTreeById(data, allTree);
    let menuList = allListObj
      .filter((item: any) => item.parentId)
      .map((item: any) => item.id);
    let btnList = allListObj
      .filter((item: any) => item.menuId)
      .map((item: any) => ({ id: item.id, menuId: item.menuId }));
    arr.push(menuList, btnList);
    return arr;
  };
  const filterTreeById = (ids: any, tree: any) => {
    const result: any = [];
    const IDS = ids.checked || ids;
    function search(node) {
      if (IDS?.includes(node.id)) {
        result.push(node);
      }

      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          search(child);
        }
      }
    }
    tree.forEach((item: any) => {
      search(item);
    });
    return result;
  };
  const saveRole = async () => {
    const list = treeData(checkedKeys.value, menuTreeData.value);
    list[0].push(...halfCheckedKeys.value);
    let res = await MenuTreeHook.updataMenuFun(menuId.value, {
      ids: list[0],
      listPermission: list[1],
    });
    if (res) {
      toast.success("修改成功");
    } else {
      toast.error("修改失败");
    }
    roleStore.value.isShowEditDialog = false;
  };
  const findNodeById = (id: string | number, tree: any[]): any => {
    for (const node of tree) {
      if (node.id === id) return node;
      const children = [...(node.children || []), ...(node.listPermission || [])];
      if (children.length) {
        const target = findNodeById(id, children);
        if (target) return target;
      }
    }
    return null;
  };
  const getParentIds = (node: any) => {
    const parentIds: Array<string | number> = [];
    let currentParentId = node?.parentId;

    while (currentParentId !== undefined && currentParentId !== null && currentParentId !== -1) {
      parentIds.push(currentParentId);
      const parentNode = findNodeById(currentParentId, menuTree.value);
      if (!parentNode) break;
      currentParentId = parentNode.parentId;
    }

    return parentIds;
  };
  const treeCheck = (checkedKeys: any, e: any) => {
    if (e.checked && e.node.children) {
      checkedKeys.checked.push(...getChild(e.node.children));
    } else if (!e.checked && e.node.children) {
      const child = getChild(e.node.children);
      checkedKeys.checked = checkedKeys.checked.filter(
        (item:any) => !child.includes(item)
      );
    }
    if (e.checked) {
      checkedKeys.checked.push(...getParentIds(e.node));
    }
    checkedKeys.checked = [...new Set(checkedKeys.checked)]
  };
  const getChild = (childs: any) => {
    const c1: any = [];
    const c2: any = [];
    if (!childs) return [];
    childs.forEach((item: any) => {
      c1.push(item.id);
      item?.children && c2.push(...getChild(item.children));
      item?.listPermission && c2.push(...getChild(item.listPermission));
    });
    return [...c1, ...c2];
  };
  const cancelRole = () => {
    console.log("取消保存");
    RoleStore.value.isShowEditDialog =false
  };
  return {
    RoleStore,
    menuTree,
    selectList,
    fieldNames,
    selectedKeys,
    checkedKeys,
    getList,
    getMenuList,
    showEditDialog,
    setEditDialog,
    saveRole,
    cancelRole,
    treeCheck,
  };
}
