<template>
  <div class="search" style="margin-bottom: 5px">
    <a-row >
      <a-col :span="4">
        <a-input
          v-model:value="query.account"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m590')"
        />
      </a-col>
      <a-col>
        <a-button type="primary" @click="getList(1)" >{{ $t('search') }}</a-button>
        <a-button type="primary" @click="reset" >{{ $t('reset') }}</a-button>
        <a-button type="primary" @click="showAddDialog"   v-permission="'admin:customerServiceAgents:add'">{{ $t('add') }}</a-button>
      </a-col>
    </a-row>
  </div>
  <div class="chatWeb">
    <span>{{ $t('客服地址') }}：</span>
    <a href="https://im.arbtotal.com" target="_blank">https://im.arbtotal.com</a>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'account'">
        {{ record.account }}
        <CopyOutlined v-if="record.account" class="copyId"  @click="$copyId(record.account)" />
      </template>
      <template v-if="column.key === 'status'">
          <a-switch
            :checked="record.status == 1 ? true : false"
            @change="switchBy($event, record.id)"
          ></a-switch>
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:customerServiceAgents:update'"
          >{{ $t("edit") }}
        </a-tag> 
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :title="isEdit? $t('edit'): $t('add')" @cancel="closeAddDalog" :footer="null">
    <a-form
      :model="addFrom"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 22 }"
    >
      <a-form-item v-if="isEdit" :label="$t('m590')" name="account" :rules="[{ required: true }]">
        <a-input disabled v-model:value="addFrom.account" />
      </a-form-item>
      <a-form-item :label="$t('m784')" name="password" :rules="[{ required: true }]">
        <a-input-password autocomplete="new-password" :maxlength="32" v-model:value="addFrom.password" :placeholder="$t('m786')" />
      </a-form-item>
      <a-form-item :label="$t('state')" name="status" :rules="[{ required: true }]">
        <a-radio-group v-model:value="addFrom.status">
          <a-radio :value="1"> {{ $t("enabled") }} </a-radio>
          <a-radio :value="0"> {{ $t("disabled") }} </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
        <a-button :loading="isUpload" type="primary" @click="addBtn">{{
          isEdit? $t('b8') : $t('add')
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
  customerServiceAgentsListPage,
  customerServiceAgentsAdd,
  customerServiceAgentsUpdate,
} from "@/api/c2cconfig.api";
import { message,Modal } from "ant-design-vue";
import { onMounted, ref, reactive, h } from 'vue';
import Upload from '@/components/Upload/index.vue'
import { useI18n } from "vue-i18n";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const columns:any = [
  {
    title: t('m590'),
    dataIndex: "account",
    key: "account",
    align:"center",
    width: 170,
  },
  {
    title: t('state'),
    dataIndex: "status",
    key: "status",
    width: 170,
    align:"center",
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align:"center",
    width: 170,
  },
  {
    title: t("updateTime"),
    dataIndex: "updateTime",
    key: "updateTime",
    align:"center",
    width: 170,
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    width: 170,
    align:"center",
  },
];
const query = ref({
  asc: true,
  column: undefined,
  pageNo: 1,
  pageSize: 20,
  account: undefined,
});
const loading = ref(false);
const isUpload = ref(false);
const addDialog = ref(false);
const dataSource = ref([]);
const addChecked = ref<boolean>(false);
let isEdit = false;
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: any) => t('total', [total]),
});
const addFrom = ref<any>({
  id: undefined,
  account: undefined,
  password: undefined,
  status: 1,
});

const getList = async (isFirst: any = 1) => {
  if (isFirst) {
    query.value.pageNo = 1;
    pagination.current = 1;
  }
  loading.value=true;
  const res: any = await customerServiceAgentsListPage(query.value).finally(()=>loading.value=false);;
  if (res && res.code === "1") {
    dataSource.value = res.data.map((item)=>{
      return item;
    });
    pagination.current = query.value.pageNo;
    pagination.pageSize = query.value.pageSize;
    pagination.total = res.total;
  }
};
const reset = () => {
  query.value = {
    asc: true,
    column: undefined,
    pageNo: 1,
    pageSize: 20,
    account: undefined,
  };
  getList();
}
const showAddDialog = () => {
  isEdit = false;
  addFrom.value = {
    id: undefined,
    account: undefined,
    password: undefined,
    status: 1,
  };
  addChecked.value = false;
  addDialog.value = true;
};
const editDialog = (value: any) => {
  selectedRow();
  isEdit = true;
  const { id, account , status } = value;
  addFrom.value = {
    id,
    account,
    password: undefined,
    status,
  };
  addDialog.value = true;
};
// const checkenable = async (value: any) =>{
//   const { id } = value;
//   let res;
//   loading.value=true;
//   if(value.active === '1'){
//       res = await enableCustomerServiceSystems(id).finally(()=>loading.value=false);
//   }else{
//       res = await disableCustomerServiceSystems(id).finally(()=>loading.value=false);
//   }
//   if (res && res.code === "1") {
//     message.success(value.active ==='0' ? t('m238') : t('m237'));
//     getList();
//   }
// }

//状态更新
const switchBy = async (e: any, id: any) => {
  const s = e ? 1 : 0;
  Modal.confirm({
    title:  e ? t("m767") : t("m768") , 
    onOk: async () => {
      loading.value = true
      let res;
      res = await customerServiceAgentsUpdate({ status: s, id }).finally(()=>loading.value = false);

      if (res && res.code == "1") {
        message.success(t("s10"));
        getList();
      }
    },
    onCancel() {
    },
  });
}
const closeAddDalog = () => {
  addFrom.value = {
    id: undefined,
    account: undefined,
    password: undefined,
    status: 1,
  };
  isEdit = false;
  addDialog.value = false;
};
const handleTableChange: any = (value: {
  pageSize: number;
  current: number;
}) => {
  const { current,pageSize } = value;
  pagination.current = current;
  pagination.pageSize = pageSize;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  getList();
};
const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/;
const addBtn = async () => {
  if(!reg.test(addFrom.value.password)){
    message.error(t('m786'));
    return;
  }
  if(![0,1].includes(addFrom.value.status)){
    message.error(t('m563')+t('state'));
    return;
  }
  let res;
  loading.value=true;
  if (isEdit) {
    const {id ,password, status} = addFrom.value
    const editFrom={id ,password, status}
    res = await customerServiceAgentsUpdate(editFrom).finally(()=>loading.value=false);
  } else {
    res = await customerServiceAgentsAdd(addFrom.value).finally(()=>loading.value=false);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t('s7') : t('s8'));
    getList();
    closeAddDalog();
  }
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight().getTabH.value;
});
</script>

<style lang="less" scoped>
.chatWeb{
  height: 20px;
  line-height: 20px;
}
</style>

