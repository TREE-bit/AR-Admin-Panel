<template>
  <div class="search">
    <a-button type="primary" @click="showAddDialog">{{ $t('add') }}</a-button>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' }"
    :loading="loading"
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
          @click="editDialog(record)"
          >{{ $t("edit") }}
        </a-tag> <a-popconfirm
          :title="$t('t16')"
          :description="$t('t17')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record)"
        >
          
         <a-tag
          color="rgba(253, 11, 26, 1)"
          style="cursor: pointer"
          size="small"
          >{{ $t("b11") }}
        </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :title="$t('l68')" :footer="null">
    <a-form
      :model="addFrom"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 13 }"
    >
      <a-form-item :label="$t('sort')" name="sort">
        <a-input-number
          v-model:value="addFrom.sort"
          style="width: 100%"
          :min="0"
        />
      </a-form-item>
      <a-form-item :label="$t('l69')" name="reason">
        <a-input v-trim v-model:value="addFrom.reason" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="addBtn">{{
          addFrom.id ? $t('b8') : $t('b12')
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddDalog"
          >{{ $t('l54') }}</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  cancellationRechargeCreateApi,
  cancellationRechargeDelApi,
  cancellationRechargeListApi,
  cancellationRechargeUpdateApi,
} from "@/api/c2cconfig.api";
import { message } from "ant-design-vue";
import { onMounted, ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width:100,
    align:"center"
  },
  {
    title: t('l44'),
    dataIndex: "reason",
    key: "reason",
    align:"center"
  },
  {
    title: t('sort'),
    dataIndex: "sort",
    key: "sort",
    width:100,
    align:"center"
  },
  {
    title: t('l70'),
    dataIndex: "createTime",
    key: "createTime",
    width:200,
    align:"center"
  },
  {
    title: t('l71'),
    dataIndex: "updateTime",
    key: "updateTime",
    width:200,
    align:"center"
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    align:"center",
    width:300,
  },
];
const loading = ref(false);
const addDialog = ref(false);
const dataSource = ref([]);
let isEdit = false;
const pagination = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20,
  showSizeChanger: false,
  showTotal: (total: any) => t('total', [total]),
});
const addFrom = ref<any>({
  reason: "",
  sort: 0,
});
const getList = async () => {
  const { pageNo, pageSize } = pagination;
  const res: any = await cancellationRechargeListApi({
    pageNo,
    pageSize,
  });
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.total = res.total;
  }
};
const showAddDialog = () => {
  addFrom.value = {
    reason: "",
    sort: 0,
  };
  addDialog.value = true;
};
const editDialog = (value: any) => {
  isEdit = true;
  const { id, reason, sort } = value;
  addFrom.value = {
    id,
    reason,
    sort,
  };
  addDialog.value = true;
};
const del = async (value: any) => {
  const { id } = value;
  const res: any = await cancellationRechargeDelApi({ id });
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
  }
};
const closeAddDalog = () => {
  addFrom.value = {
    reason: "",
    sort: 0,
  };
  isEdit = false;
  addDialog.value = false;
};
const handleTableChange: any = (value: {
  pageSize: number;
  current: number;
}) => {
  const { current,pageSize} = value;
  pagination.pageNo = current;
  pagination.pageSize = pageSize;
  getList();
};
const addBtn = async () => {
  let res;
  if (isEdit) {
    res = await cancellationRechargeUpdateApi(addFrom.value);
  } else {
    res = await cancellationRechargeCreateApi(addFrom.value);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t('s7') : t('s8'));
    getList();
    closeAddDalog();
  }
};
onMounted(() => {
  getList();
});
</script>
