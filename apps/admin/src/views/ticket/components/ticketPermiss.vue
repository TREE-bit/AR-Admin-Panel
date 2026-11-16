<template>
  <div class="container">
    <div class="search">
      <a-button type="primary" @click="showAdd" :loading="loading" 
      v-permission="'admin:workOrderPermission:save'">{{ $t('add') }}</a-button>
    </div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :scroll="{ x: '100%',y:getTabH+'px' }"
      :pagination="pagination"
      @change="handleTableChange"
      :loading="loading"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key ==='createBy'">
        {{ record.updateBy || record.createBy || '-' }}
      </template>
      <template v-if="column.key ==='createTime'">
        {{ record.updateTime || record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <a-popconfirm
          :title="$t('t16')"
          :ok-text="$t('b28')"
          :cancel-text="$t('b10')"
          @confirm="del(record.id)"
          :ok-button-props="{ loading: loading }"
        >
          <a-tag
            color="rgb(253, 11, 26)"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:workOrderPermission:delete'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
    </a-table>
  </div>
  <!-- 新增/编辑 -->
  <a-modal
    v-model:open="showAddVisible"
    :title="$t('n1043')"
    :width="400"
    :destroyOnClose="true"
    :footer="null"
    centered
    @cancel="closeAdd"
  >
    <a-select
      style="width: 100%"
      showSearch
      placeholder="Please select"
      v-model:value="userName"
    >
      <a-select-option
        v-for="item in userList"
        :key="item.value"
        :value="item.label"
        :plasholder="$t('n984')"
        >
          <div @click="userIdSel = item.id">
            {{ item.label }}
          </div>
        </a-select-option
      >
  </a-select>
  <div style="text-align: center;padding-top: 20px;">
    <a-button type="primary" @click="savePermis" :loading="loading">{{ $t('save') }}</a-button>
  </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  workOrderPermissionListPage,
  workOrderPermissionSave,
  workOrderPermissionDelete
} from "@/api/ticket.api";
import {
  getUserListPage,
} from "@/api/user.api";
import { useTableData } from "@/hooks/useTableData.hook";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const columns:any = [
  {
    title: t('l60'),
    dataIndex: "operatorName",
    key: "operatorName",
    align: "center",
    width:250,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width:150,
  },
];
const query = ref({
  asc: false,
  pageNo: 1,
  pageSize: 20,
});
// const loading = ref(false);
// const dataSource = ref([]);
const userList:any = ref([]);
// const getList = async () => {
//   loading.value = true;
//   const res: any = await workOrderPermissionListPage(query.value).catch((err)=>{loading.value = false});
//   if (res) {
//     dataSource.value = res.data.list || [];
//     loading.value = false;
//   }else{
//     loading.value = false;
//   }
// };
const {
  dataSource,
  extendData,
  pagination,
  loading,
  response,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: workOrderPermissionListPage,
  filterRules: [],
  resDataType: 2,
  fetchType: 2,
});
const getUserList = async () => {
  const res: any = await getUserListPage({ pageNo: 1, pageSize: 1000 });
  if (res && res.code === "1") {
    userList.value = res.data.map((item: any) => ({
      label: item.username,
      value: item.username,
      id: item.id,
    })) || [];
  }
};
const showAddVisible = ref(false);
const userName = ref(undefined);
const userIdSel = ref(undefined);
const showAdd = () => {
  showAddVisible.value = true;
  userName.value = undefined;
  userIdSel.value = undefined;
}
const closeAdd = () => {
  showAddVisible.value = false;
}
const savePermis = async () => {
  if(!userIdSel.value){
    userIdSel.value = userList.value.find((item:any)=>item.label==userName.value)?.id;
  }
  if(!userName.value){
    message.error(t('n984'));
    return;
  }
  if(dataSource.value.find((item:any)=>item.operatorId==userIdSel.value)){
    message.error(t('n985'));
    return;
  }
  loading.value = true;
  const res: any = await workOrderPermissionSave({
    userId: userIdSel.value,
    userName:userName.value
  }).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    showAddVisible.value = false;
    getList();
  }
}
const del = async (id: any) => {
  loading.value = true;
  const res: any = await workOrderPermissionDelete({id}).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    getList();
  }
}
onMounted(() => {
  getList();
  getUserList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>