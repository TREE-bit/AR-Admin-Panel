<template>
  <div class="search">
    <h2>{{ $t('m545') }}</h2>
    <a-button type="primary" @click="showAddDialog"   v-permission="'admin:customer:add'">{{ $t('add') }}</a-button>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' , y : '700px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'serviceSystemUrl'"  >
        <a-tooltip>
          <template #title>{{ record.serviceSystemUrl }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.serviceSystemUrl }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'active'">
        <a-switch
          v-model:checked="record.active"
          checkedValue="1"
          unCheckedValue="0"
          @click="checkenable(record)"
          :disabled="hasPermission('admin:customer:enable') ? false : true"
        />
      </template>
      <template v-if="column.key === 'antCustomer'">
        {{ $getMapItem(antCustomerMap, record.antCustomer) }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:customer:edit'"
          >{{ $t("edit") }}
        </a-tag> 
        
        <a-popconfirm
          :title=" $t('t16') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record)"
        >
         <a-tag
          :color="'rgba(253, 11, 26, 1)'"
          style="cursor: pointer"
          size="small"
          v-permission="'admin:customer:delete'"
          >{{ $t('b11') }}
        </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :title="isEdit? $t('m547'): $t('m546')" @cancel="closeAddDalog" :footer="null">
    <a-form
      :model="addFrom"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 22 }"
    >
      <a-form-item :label = "$t('m545')" name="type"  :rules="[{ required: true, message: $t('m550') }]">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder= "$t('m545')"
          show-search
          style="width:50%"
          v-model:value="addFrom.type"
        >
          <a-select-option
            v-for="(item) in groupList"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-select-option>
        </a-select>
      </a-form-item>
        <a-form-item :label="$t('sort')" name="sortOrder" :rules="[{ required: true, message: $t('m551') }]">
          <a-input-number
            v-model:value="addFrom.sortOrder"
            style="width: 50%"
            :min="1"
          />
        </a-form-item>
      <a-form-item :label="$t('m549')" name="serviceSystemUrl" :rules="[{ required: true, message: $t('m552') }]">
        <a-input v-trim v-model:value="addFrom.serviceSystemUrl" />
      </a-form-item>
      <a-form-item :label="$t('m548')" name="antCustomer" :rules="[{ required: true, message: $t('m563')+ $t('n593') }]">
        <a-select
          class="searchstyle"
          :placeholder="$t('m548')"
          style="width:50%"
          v-model:value="addFrom.antCustomer"
          :options="Object.entries(antCustomerMap).map(([value, label]) => ({ value:Number(value), label }))"
        >
        </a-select>
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
  getCustomerServiceTypes,
  getCustomerServiceList,
  createCustomerServiceSystems,
  updateCustomerServiceSystems,
  deleteCustomerServiceSystems,
  disableCustomerServiceSystems,
  enableCustomerServiceSystems
} from "@/api/c2cconfig.api";
import { message } from "ant-design-vue";
import { onMounted, ref, reactive } from "vue";
import Upload from '@/components/Upload/index.vue'
import { useI18n } from "vue-i18n";
import { antCustomerMap } from "@/utils/publicData";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import {usePermission} from '@/hooks';
const { hasPermission }=usePermission()
const { t } = useI18n();
const columns:any = [
  // {
  //   title: "ID",
  //   dataIndex: "id",
  //   key: "id",
  //   width:100,
  //   align:"center"
  // },
  {
    title: t('sort'),
    dataIndex: "sortOrder",
    key: "sortOrder",
    align:"center",
    width: 80,
  },
  {
    title: t('state'),
    dataIndex: "active",
    key: "active",
    align:"center",
    width: 100,
  },
  {
    title: t('m545'),
    dataIndex: "serviceSystemName",
    key: "serviceSystemName",
    align:"center",
    width: 120,
  },
  {
    title: t('m549'),
    dataIndex: "serviceSystemUrl",
    key: "serviceSystemUrl",
    ellipsis: true,
    align:"center",
    width: 300,
  },
  {
    title: t('m548'),
    dataIndex: "antCustomer",
    key: "antCustomer",
    ellipsis: true,
    align:"center",
    width: 100,
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align:"center",
    width: 120,
  },
  {
    title: t("l71"),
    dataIndex: "updateTime",
    key: "updateTime",
    align:"center",
    width: 140,
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    align:"center",
    width: 120,
  },
];
const loading = ref(false);
const isUpload = ref(false);
const addDialog = ref(false);
const dataSource = ref([]);
const addChecked = ref<boolean>(false);
let isEdit = false;
const pagination = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 10,
  showSizeChanger: false,
  showTotal: (total: any) => t('total', [total]),
});
const addFrom = ref<any>({
  type: null,
  sortOrder: 1,
  serviceSystemUrl: "",
  antCustomer: undefined,
});

const getList = async () => {
  loading.value=true;
  const { pageNo, pageSize } = pagination;
  const res: any = await getCustomerServiceList({
    pageNo,
    pageSize,
  }).finally(()=>loading.value=false);;
  if (res && res.code === "1") {
    dataSource.value = res.data.list.map((item)=>{
      item.active=item.active.toString();
      return item;
    });
    pagination.total = res.data.total;
  }
};
const showAddDialog = () => {
  isEdit = false;
  addFrom.value = {
    type: null,
    sortOrder: 1,
    serviceSystemUrl: "",
    antCustomer: undefined,
  };
  addChecked.value = false;
  addDialog.value = true;
};
const editDialog = (value: any) => {
  selectedRow();
  isEdit = true;
  const {id, type ,sortOrder, serviceSystemUrl,antCustomer} = value;
  addFrom.value = {id,type ,sortOrder, serviceSystemUrl,antCustomer};
  addDialog.value = true;
};
const del = async (value: any) => {
  const { id } = value;
  const res: any = await deleteCustomerServiceSystems(id);
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
  }
};
const checkenable = async (value: any) =>{
  const { id } = value;
  let res: any;
  loading.value=true;
  if(value.active == '1'){
      res = await enableCustomerServiceSystems(id).finally(()=>loading.value=false);
  }else{
      res = await disableCustomerServiceSystems(id).finally(()=>loading.value=false);
  }
  if (res && res.code === "1") {
    message.success(value.active =='0' ? t('m238') : t('m237'));
    getList();
  }
}

const closeAddDalog = () => {
  addFrom.value = {
    type: null,
    sortOrder: 1,
    serviceSystemUrl: "",
    antCustomer: undefined,
  };
  isEdit = false;
  addDialog.value = false;
};
const handleTableChange: any = (value: {
  pageSize: number;
  current: number;
}) => {
  const { current } = value;
  pagination.pageNo = current;
  getList();
};
const addBtn = async () => {
  if(!addFrom.value.type){
    message.error(t('m550'));
    return;
  }
  if(!addFrom.value.sortOrder){
    message.error(t('m551'));
    return;
  }
  if(!addFrom.value.serviceSystemUrl){
    message.error(t('m552'));
    return;
  }
  if(addFrom.value.antCustomer == undefined || addFrom.value.antCustomer == null){
    message.error(t('m563')+ t('n593'));
    return;
  }
  let res;
  loading.value=true;
  if (isEdit) {
    const {id,type ,sortOrder, serviceSystemUrl,antCustomer} = addFrom.value
    const editFrom={type ,sortOrder, serviceSystemUrl,antCustomer};
    res = await updateCustomerServiceSystems(id,editFrom).finally(()=>loading.value=false);
  } else {
    res = await createCustomerServiceSystems(addFrom.value).finally(()=>loading.value=false);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t('s7') : t('s8'));
    getList();
    closeAddDalog();
  }
};
const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getCustomerServiceTypes();
  if (res && res.code === "1") {
    groupList.value =
      res.data.map((item: any) => ({ value: item.typeCode, label: item.typeName })) || [];
  }
};
onMounted(() => {
  getGroupList();
  getList();
});
</script>

