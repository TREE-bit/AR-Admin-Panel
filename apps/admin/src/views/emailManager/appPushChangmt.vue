<template>
  <div class="search">
    <h2>{{ $t("n210") }}</h2>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="false"
    :scroll="{ x: '100%' , y: getTabH +'px' }"
    :loading="loading"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <!-- <template v-if="column.key === 'title'">
        <a-tooltip v-if="record.title">
          <template #title>{{ record.title }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.title }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template> -->
      <template v-if="column.key === 'status'">
        <a-switch
          :checked="record.status == 1 ? true : false"
          :checked-children="$t('enabled')"
          :un-checked-children="$t('disabled')"
          :disabled="hasPermission('admin:appPushChannelAdmin:updateAppPushChannel') ? false : true"
          @change="switchBy($event,record.id)"
        ></a-switch>
      </template>
      <!-- <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          size="small"
          style="cursor: pointer;"
          @click="editDialog(record)"
          v-permission="'admin:pushMannerAdmin:updatePushManner'"
          >{{ $t("edit") }}
        </a-tag>
      </template> -->
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import {
  appPushChannelAdminList,
  appPushChannelAdminUpdate,
} from "@/api/email.api";
import { message, Modal } from "ant-design-vue";
import { onMounted, ref, reactive, h } from "vue";
import { useI18n } from "vue-i18n";
import {usePermission} from '@/hooks';
const { t } = useI18n();
const { hasPermission }=usePermission()
const columns:any = [
  {
    title: t("n211"),
    dataIndex: "pushChannelId",
    key: "pushChannelId",
    width: 160,
    align: "center",
  },
  {
    title: t("n212"),
    dataIndex: "pushChannelCode",
    key: "pushChannelCode",
    width: 160,
    align: "center",
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    width: 160,
    align: "center",
  },
  {
    title: t("m223"),
    dataIndex: "createBy",
    key: "createBy",
    align: "center",
    width: 140,
  },
  {
    title: t("m224"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 170,
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 140,
  },
  {
    title: t("l71"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 170,
  },
  // {
  //   title: t("operation"),
  //   dataIndex: "action",
  //   key: "action",
  //   align: "center",
  //   width: 100,
  //   fixed: 'right',
  // },
];
const query = ref({
  asc: true,
  column: "",
  pageNo: 1,
  pageSize: 20,
})

const loading = ref(false);
const dataSource = ref([]);
const pagination = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async () => {
  loading.value=true;
  const res: any = await appPushChannelAdminList().finally(()=>{loading.value=false});
  if (res && res.code == "1") {
    dataSource.value = res.data;
    // pagination.total = res.total;
    // pagination.pageNo = query.value.pageNo;
    // pagination.pageSize = query.value.pageSize;
  }
};
const handleTableChange: any = (value: {
  pageSize: number;
  current: number;
}) => {
  const { current ,pageSize} = value;
  pagination.pageNo = current;
  pagination.pageSize = pageSize;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  getList();
};

const changeStatus = ref(0);
const update = async (id: any) => {
  loading.value = true;
  const res: any = await appPushChannelAdminUpdate({id,status:changeStatus.value}).finally(()=>{loading.value=false});
  if (res && res.code == "1") {
    message.success(t("s10"));
    getList();
  }
}
const switchBy = async (e: any,id: any) => {
  const s = e ? 1 : 0;
  Modal.confirm({
    title:  e ? t("m767") : t("m768") , 
    onOk: async () => {
      changeStatus.value = s;
      update(id);
    },
    onCancel() {
    },
  });
}
onMounted(() => {
  getList();
});
</script>
<style lang="less" scoped>
:deep(video){
  width: 230px;
}
:deep(tr td img) {
  max-width: 100px;
  max-height: 100px;
}
.eventContentBtn{
  cursor: pointer;
  min-width: 80px;
  text-align: center;
}
:deep(.aiEditor) {
  .aie-container-main{
    max-height: 40vh;
  }
}
</style>
