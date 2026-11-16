<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="false"
    :scroll="{ x: '100%' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'eventName'"  >
        <div v-if="record.eventUniqueFlag in taskEventMap" class="toopTipStyle2">{{ $t(taskEventMap[record.eventUniqueFlag].name) }}</div>
        <span v-else>{{ record.eventName || '-' }}</span>
      </template>
      <template v-if="column.key === 'eventRemark'"  >
        <div v-if="record.eventUniqueFlag in taskEventMap"  class="toopTipStyle2">{{ $t(taskEventMap[record.eventUniqueFlag].remark) }}</div>
        <span v-else>{{ record.eventRemark || '-' }}</span>
      </template>
      <template v-if="column.key === 'eventStatus'"  >
        <span :style="record.eventStatus == 1 ? 'color: green' : 'color: red'">
          {{ record.eventStatus == 1 ? $t('enabled') : $t('disabled') }}
        </span>
      </template>
      <template v-if="column.key === 'action'">
        <a-button
          type="primary"
          :danger="record.eventStatus == 1 ? true : false"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:taskEventConfigAdmin:edit'"
          >{{ record.eventStatus == 1 ? $t("disabled") : $t("enabled") }}
        </a-button>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    >
    <h2>{{ addFrom.eventStatus == 1 ? $t('n685') : $t('n684') }}</h2>
    <template #footer>
      <a-button key="back" @click="closeAddDalog">{{ $t('b10') }}</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="updateStatus">{{ $t('b28') }}</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  taskEventConfigAdminList,
  taskEventConfigAdminEdit
} from "@/api/c2cconfig.api";
import { message } from "ant-design-vue";
import { onMounted, ref, h } from "vue";
import { useI18n } from "vue-i18n";
import { taskEventMap } from "@/utils/publicData";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
const { t } = useI18n();
const query= ref<any>({
  pageNo:1,
  pageSize:999,
})
const columns:any = [
  {
    title: t('n686'),
    dataIndex: "eventUniqueFlag",
    key: "eventUniqueFlag",
    width:150,
    align:"center"
  },
  {
    title: t('n687'),
    dataIndex: "eventName",
    key: "eventName",
    width:150,
    // ellipsis: true,
    align:"center",
  },
  {
    title: t('n688'),
    dataIndex: "eventRemark",
    key: "eventRemark",
    width:300,
    align:"center"
  },
  {
    title: t('state'),
    dataIndex: "eventStatus",
    key: "eventStatus",
    width:100,
    align:"center",
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    width:100,
    align:"center",
  },
];
const loading = ref(false);
const addDialog = ref(false);
const dataSource = ref([]);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const addFrom = ref<any>({
  id: undefined,
  eventStatus: undefined,
});

const getList = async () => {
  loading.value=true;
  const res: any = await taskEventConfigAdminList(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.value.total = res.total;
  }
};

const editDialog = (value: any) => {
  selectedRow();
  const {id, eventStatus} = value;
  addFrom.value = {id, eventStatus};
  addDialog.value = true;
};
const closeAddDalog = () => {
  addFrom.value = {
    id: undefined,
    eventStatus: undefined,
  };
  addDialog.value = false;
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList()
};
const updateStatus = async () => {
  loading.value = true;
  let res: any = await taskEventConfigAdminEdit(
    {id:addFrom.value.id,eventStatus:addFrom.value.eventStatus == 1 ? 0 :1}
  ).finally(()=>loading.value=false);
  if (res && res.code == "1") {
    message.success(t('s10'));
    getList();
    closeAddDalog();
  }
};
onMounted(() => {
  getList();
});
</script>

