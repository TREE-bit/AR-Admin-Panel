<template>
  <div class="search">
    <h2>{{ $t('m16') }}</h2>
    <a-button
      class="ml15"
      type="primary"
      @click="add"
      v-permission="'admin:memberGroupAdmin:create'"
      >{{ $t("add") }}</a-button
    >
  </div>
  <a-table
    size="middle"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :scroll="{ x: '100%' , y : getTabH +'px'}"
    :pagination="paginationConfig"
    bordered
    @change="getChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'buyAmount'">
        {{ currency(record.buyAmount) }}
      </template>
      <template v-if="column.key === 'sellAmount'">
        {{ currency(record.sellAmount) }}
      </template>
      <template v-if="column.key === 'operation'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="edit(record)"
          >{{ $t("edit") }}
        </a-tag>
        <a-popconfirm
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
  <a-modal
    v-model:open="addDialog"
    :title="isEdit ? $t('edit') : $t('add')"
    :footer="null"
  >
    <a-form
      ref="formRef"
      :model="addForm"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item
        :label="$t('c2')"
        name="name"
        :rules="[{ required: true, message: $t('m177') }]"
      >
        <a-input v-trim v-model:value="addForm.name" />
      </a-form-item>
      <a-form-item :label="$t('c3')" name="buyAmount">
        <a-input-number
          v-model:value="addForm.buyAmount"
          class="w100"
          :min="0"
          :precision="2"
        />
      </a-form-item>
      <a-form-item :label="$t('c4')" name="buyCount">
        <a-input-number
          v-model:value="addForm.buyCount"
          class="w100"
          :min="0"
          :precision="0"
        />
      </a-form-item>
      <a-form-item :label="$t('c5')" name="sellAmount">
        <a-input-number
          v-model:value="addForm.sellAmount"
          class="w100"
          :min="0"
          :precision="2"
        />
      </a-form-item>
      <a-form-item :label="$t('c6')" name="sellCount">
        <a-input-number
          v-model:value="addForm.sellCount"
          class="w100"
          :min="0"
          :precision="0"
        />
      </a-form-item>
      <a-form-item :label="$t('c8')" name="authList">
        <a-checkbox-group
          v-model:value="addForm.authList"
          name="checkboxgroup"
          :options="plainOptions"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" :loading="loading" @click="addBtn">{{
          $t("publicSubmit")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closedalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { usePagination } from "@/plugins/dataMap";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  createGroupApi,
  groupListApi,
  updateGroupApi,
  groupAuthListApi,
  deleteGroup,
} from "@/api/menber";
import { message } from "ant-design-vue";
import { currency } from "@/utils";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const { paginationConfig } = usePagination();
const query = ref<any>({
  pageNo: 1,
  pageSize: 20,
});
const loading = ref(false);
const plainOptions = ref([]);
const addDialog = ref(false);
const isEdit = ref(false);
const dataSource = ref([]);
const formRef = ref();
const rules = {
  name: [{ required: true, message: t("177"), trigger: "change" }],
};
const columns:any = [
  {
    title: t("c1"),
    dataIndex: "id",
    key: "id",
    align: "center",
  },
  {
    title: t("c2"),
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: t("c3"),
    dataIndex: "buyAmount",
    key: "buyAmount",
    align: "center",
  },
  {
    title: t("c4"),
    dataIndex: "buyCount",
    key: "buyCount",
    align: "center",
  },
  {
    title: t("c5"),
    dataIndex: "sellAmount",
    key: "sellAmount",
    align: "center",
  },
  {
    title: t("c6"),
    dataIndex: "sellCount",
    key: "sellCount",
    align: "center",
  },
  {
    title: t("c7"),
    dataIndex: "memberCount",
    key: "memberCount",
    align: "center",
  },
  {
    title: t("operation"),
    dataIndex: "operation",
    key: "operation",
    align: "center",
    width: 140,
  },
];
const addForm = ref<any>({
  name: "",
  authList: [],
  buyAmount: 0,
  buyCount: 0,
  sellAmount: 0,
  sellCount: 0,
});
const getList = async () => {
  loading.value = true;
  const res: any = await groupListApi(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    paginationConfig.total = res.total || 0;
  }
};
const add = () => {
  addForm.value = {
    name: "",
    authList: [],
    buyAmount: 0,
    buyCount: 0,
    sellAmount: 0,
    sellCount: 0,
  };
  addDialog.value = true;
};
const edit = (value: any) => {
  isEdit.value = true;
  const { name, authList, buyAmount, buyCount, sellAmount, sellCount, id } =
    value;
  addForm.value = {
    name,
    authList: authList?.split(",") || [],
    buyAmount,
    buyCount,
    sellAmount,
    sellCount,
    id,
  };
  addDialog.value = true;
};
const del = async (value: any) => {
  loading.value = true;
  const res: any = await deleteGroup({ id: value.id });
  if (res && res.code === "1") {
    message.success(t("s10"));
    getList();
  }
  loading.value = false;
};
const addBtn = async () => {
  formRef.value.validate().then(async () => {
    loading.value = true;
    let res;
    if (isEdit.value) {
      res = await updateGroupApi(addForm.value);
    } else {
      res = await createGroupApi(addForm.value);
    }
    loading.value = false;
    if (res && res.code === "1") {
      message.success(t("s10"));
      closedalog();
      getList();
    }
  });
};
const closedalog = () => {
  addForm.value = {
    name: "",
    authList: [],
    buyAmount: 10,
    buyCount: 0,
    betAmount: 0,
    sellCount: 0,
  };
  isEdit.value = false;
  addDialog.value = false;
};
const getChange = (value: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  paginationConfig.pageSize = pageSize;
  paginationConfig.current = current;
  getList();
};

const getAuth = async () => {
  const res: any = await groupAuthListApi();
  if (res && res.code === "1") {
    plainOptions.value = res.data.map((item: any) => ({
      label: item.name,
      value: item.code,
    }));
  }
};
onMounted(() => {
  getList();
  getAuth();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped></style>
