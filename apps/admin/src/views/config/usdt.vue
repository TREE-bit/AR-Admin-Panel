<template>
  <div class="search">
    <a-button
      type="primary"
      @click="showAddDialog"
      v-permission="'admin:usdtConfigAdmin:create'"
    >
      <template #icon>
        <PlusOutlined />
      </template>
      {{ $t("add") }}
    </a-button>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: 'max-content' , y : '700px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <a-switch
          v-model:checked="record.status"
          :checked-children="$t('open')"
          :un-checked-children="$t('close')"
          :checkedValue="'1'"
          :unCheckedValue="'0'"
          @click="switchClick($event, record.id)"
          v-permission="'admin:usdtConfigAdmin:changeStatus'"
        />
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          v-permission="'admin:usdtConfigAdmin:update'"
          >{{ $t("edit") }}
        </a-tag>
        <a-tag
          color="rgba(253, 11, 26, 1)"
          style="cursor: pointer"
          size="small"
          @click="showDelTip(record.id)"
          v-permission="'admin:usdtConfigAdmin:delete'"
          >{{ $t("b11") }}
        </a-tag>
      </template>
    </template>
  </a-table>
  <contextHolder />
  <a-modal
    v-model:open="addDialog"
    :title="addForm.id ? $t('edit') : $t('add')"
    :footer="null"
  >
    <a-form
      ref="formRef"
      :model="addForm"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 13 }"
    >
      <a-form-item :label="$t('l74')" name="networkProtocol">
        <a-select
          allowClear
          ref="select"
          style="width: 100%"
          :placeholder="$t('t18')"
          show-search
          v-model:value="addForm.networkProtocol"
        >
          <a-select-option
            v-for="(item, index) in netList"
            :key="index"
            :value="item"
            >{{ item }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('memberListC12')" name="usdtAddr">
        <a-input v-trim v-model:value="addForm.usdtAddr" />
      </a-form-item>
      <a-form-item :label="$t('remark')" name="remark">
        <a-input v-trim v-model:value="addForm.remark" />
      </a-form-item>
      <a-form-item :label="$t('state')" name="status">
        <a-switch
          v-model:checked="addForm.status"
          :checked-children="$t('open')"
          :un-checked-children="$t('close')"
          :checkedValue="'1'"
          :unCheckedValue="'0'"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="addBtn(Boolean(addForm.id))">{{
          addForm.id ? $t("b8") : $t("b12")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closedalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { h, onMounted, ref } from "vue";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import {
  createUsdtConfigAdmin,
  editUsdtConfigAdmin,
  getUsdtConfigList,
  delUsdtConfigAdmin,
  changeStatusUsdtConfigAdmin,
} from "@/api/c2cconfig.api.ts";
import { message, Modal } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
const { t } = useI18n();
const [modal, contextHolder] = Modal.useModal();
const dataSource = ref([]);
const loading = ref(false);
const query = ref({
  pageNo: 1,
  pageSize: 20,
});
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 70,
    align: "center",
  },
  {
    title: t("l74"),
    dataIndex: "networkProtocol",
    key: "networkProtocol",
    width: 100,
    align: "center",
  },
  {
    title: t("userUSDTaddress"),
    dataIndex: "usdtAddr",
    key: "usdtAddr",
    width: 170,
    align: "center",
  },
  {
    title: t("l70"),
    dataIndex: "createTime",
    key: "createTime",
    width: 170,
    align: "center",
  },
  {
    title: t("l71"),
    dataIndex: "updateTime",
    key: "updateTime",
    width: 170,
    align: "center",
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    width: 70,
    align: "center",
  },
  {
    title: t("remark"),
    dataIndex: "remark",
    key: "remark",
    width: 170,
    align: "center",
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    width: 200,
    align: "center",
  },
];
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async (query: any) => {
  loading.value = true;
  const res: any = await getUsdtConfigList(query);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.value.total = res.total;
  }
  loading.value = false;
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  getList(
    Object.assign({}, query.value, {
      pageSize: pag.pageSize,
      pageNo: pag?.current,
    })
  );
};
const resetQuery = () => {
  query.value = {
    pageNo: 1,
    pageSize: query.value.pageSize,
  };
  getList(query.value);
};
/***************** add & edit *****************/
const addDialog = ref(false);
const netList = ref<string[]>(["TRC-20"]);
const addForm = ref<any>({
  networkProtocol: "",
  remark: "",
  status: "1",
  usdtAddr: "",
});
const showAddDialog = () => {
  addForm.value = {
    networkProtocol: "",
    remark: "",
    status: "1",
    usdtAddr: "",
  };
  addDialog.value = true;
};
const addBtn = async (isEdit: Boolean) => {
  let res;
  if (isEdit) {
    const { id, networkProtocol, remark, status, usdtAddr } = addForm.value;
    res = await editUsdtConfigAdmin({
      id,
      networkProtocol,
      remark,
      status,
      usdtAddr,
    });
  } else {
    res = await createUsdtConfigAdmin(addForm.value);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t("s7") : t("s8"));
    closedalog();
    getList(query.value);
  }
};
const showEditPageFun = (data: any) => {
  selectedRow();
  const { createBy, id, networkProtocol, remark, status, updateBy, usdtAddr } =
    data;
  addForm.value = {
    createBy,
    id,
    networkProtocol,
    remark,
    status,
    updateBy,
    usdtAddr,
  };
  addDialog.value = true;
};
const closedalog = () => {
  addForm.value = {
    networkProtocol: "",
    remark: "",
    status: "1",
    usdtAddr: "",
  };
  addDialog.value = false;
};
const showDelTip = (id: any) => {
  modal.confirm({
    title: t("t16"),
    icon: h(ExclamationCircleOutlined),
    content: t("t17"),
    okText: t("yes"),
    okType: "danger",
    cancelText: t("no"),
    onOk() {
      delConfig(id);
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};
const switchClick = async (val: any, id: any) => {
  try {
    loading.value = true;
    const res: any = await changeStatusUsdtConfigAdmin({ id, status: val });
  } catch (e) {
  } finally {
    loading.value = false;
  }
};
const delConfig = async (id: any) => {
  const res: any = await delUsdtConfigAdmin({ id });
  if (res && res.code === "1") {
    message.success(t("s9"));
    getList(query.value);
  }
};
onMounted(() => {
  getList(query.value);
});
</script>
<style lang="less" scoped></style>
