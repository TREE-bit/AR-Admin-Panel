<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.bankName"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m581')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.bankCode"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m651')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.ifscCode"
          class="searchstyle"
          :placeholder="$t('m562')+'ifscCode'"
        />
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <a-button type="primary" @click="showAddDialog"
        v-permission="'admin:bankInfoAdmin:add'"
        >{{ $t('add') }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' , y : getTabH + 'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'iconUrl'">
        <a-image v-if="record.iconUrl" :width="100" :src="record.iconUrl" alt=""/>
        <img v-if="!record.iconUrl" style="width: 50px;" :src="no_up" alt="">
      </template>
      <template v-if="column.key === 'bankName'"  >
        <a-tooltip>
          <template #title>{{ record.bankName }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankName }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'bankCode'"  >
        <a-tooltip>
          <template #title>{{ record.bankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'ifscCode'"  >
        <a-tooltip>
          <template #title>{{ record.ifscCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.ifscCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'status'"  >
      {{ statusMap[record.status] }}
      </template>
      <template v-if="column.key === 'updateBy'"  >
      {{ record.updateBy || record.createBy }}
      </template>
      <template v-if="column.key === 'updateTime'"  >
      {{ record.updateTime || record.createTime }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:bankInfoAdmin:update'"
          >{{ $t("b8") }}
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
          v-permission="'admin:bankInfoAdmin:deleteInfo'"
          >{{ $t('b11') }}
        </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :title="isEdit? $t('b8'): $t('add')" @cancel="closeAddDalog" :footer="null">
    <a-form
      :model="addFrom"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 22 }"
    >
      <a-form-item :label="$t('m649')" name="iconUrl" :rules="[{ required: true, message: ''}]">
        <Upload v-if="isMountUpload" v-model:value="addFrom.iconUrl"  @startUpload="startUpload"  @finishUpload="finishUpload"/>
      </a-form-item>
      <a-form-item :label = "$t('m581')" name="bankName"  :rules="[{ required: true, message: ''}]">
        <a-input v-trim v-model:value="addFrom.bankName"  :placeholder="$t('m562')+$t('m581')"/>
      </a-form-item>
      <a-form-item :label="$t('m651')" name="bankCode" :rules="[{ required: true, message: ''}]">
        <a-input v-trim v-model:value="addFrom.bankCode"  :placeholder="$t('m562')+$t('m651')"/>
      </a-form-item>
      <a-form-item label="ifscCode" name="ifscCode" :rules="[{ required: true, message: ''}]" :help="$t('m667')">
        <a-input v-trim v-model:value="addFrom.ifscCode"  :placeholder="$t('m562')+'ifscCode'"/>
      </a-form-item>
      <!-- <a-form-item :label="$t('state')" name="status" :rules="[{ required: true, message: ''}]">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="addFrom.status"
          :placeholder="$t('m563')+$t('m584')"
        >
          <a-select-option v-for="(item, index) in statusList" :key="index" :value="item.value">
          {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
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
  bankInfoAdminListPage,
  addBankInfoAdmin,
  bankInfoAdminUpdate,
  // bankInfoAdminUpdateStatus,
  bankInfoAdminDeleteInfo,
} from "@/api/c2cconfig.api";
import { message } from "ant-design-vue";
import { onMounted, ref, h } from "vue";
import Upload from '@/components/Upload/index.vue'
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import no_up from "@/assets/no_up.png";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const query= ref<any>({
  asc:true,
  column:'',
  bankName:null,
  bankCode:null,
  ifscCode:null,
  // status: null,
  pageNo:1,
  pageSize:10,
})
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width:50,
    align:"center"
  },
  {
    title: t('m583'),
    dataIndex: "iconUrl",
    key: "iconUrl",
    // ellipsis: true,
    align:"center",
  },
  {
    title: t('m581'),
    dataIndex: "bankName",
    key: "bankName",
    align:"center"
  },
  {
    title: t('m651'),
    dataIndex: "bankCode",
    key: "bankCode",
    align:"center",
  },
  {
    title: t('ifscCode'),
    dataIndex: "ifscCode",
    key: "ifscCode",
    align:"center",
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align:"center",
  },
  {
    title: t("updateTime"),
    dataIndex: "updateTime",
    key: "updateTime",
    width: 170,
    align:"center",
  },
  {
    title: t('state'),
    dataIndex: "status",
    key: "status",
    align:"center"
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    align:"center",
  },
];
const statusMap = <any>{
    0 : t('disabled'),
    1 : t('enabled'),
}
const statusList = ref([
    { value: 1, label: t('enabled'), },
    { value: 0, label: t('disabled'), },
]);
const loading = ref(false);
const isUpload = ref(false);
const addDialog = ref(false);
const isMountUpload = ref(false);
const dataSource = ref([]);
const addChecked = ref<boolean>(false);
let isEdit = false;
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const addFrom = ref<any>({
  iconUrl: null,
  bankName: null,
  ifscCode: null,
  status: 1,
});

const getList = async () => {
  loading.value=true;
  const res: any = await bankInfoAdminListPage(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.value.total = res.total;
  }
};

const search = () => {
  pagination.value.current = 1;
  query.value.pageNo = 1;
  getList()
}
const resetQuery = () => {
  query.value = {
    asc:true,
    column:'',
    bankName:null,
    bankCode:null,
    ifscCode:null,
    status: null,
    pageNo:1,
    pageSize:10,
  };
  pagination.value.pageSize = 10;
  pagination.value.current =1;
  clearSelected();
  getList();
};


const showAddDialog = () => {
  isMountUpload.value = true;
  isEdit = false;
  addFrom.value = {
    iconUrl: null,
    bankName: null,
    bankCode: null,
    ifscCode: null,
    status: 1,
  };
  addChecked.value = false;
  addDialog.value = true;
};
const editDialog = (value: any) => {
  selectedRow();
  isEdit = true;
  isMountUpload.value = true;
  const {id, ifscCode, bankName, bankCode, iconUrl, status} = value;
  addFrom.value = {id,ifscCode, bankName, bankCode, iconUrl, status};
  addDialog.value = true;
};
const del = async (value: any) => {
  const { id } = value;
  loading.value = true;
  const res: any = await bankInfoAdminDeleteInfo({id}).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
  }
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

const closeAddDalog = () => {
  addFrom.value = {
    iconUrl: null,
    bankName: null,
    bankCode: null,
    status: null,
    id:null,
  };
  isEdit = false;
  addDialog.value = false;
  isMountUpload.value = false;
  isUpload.value = false;
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList()
};
const addBtn = async () => {
  if(!addFrom.value.iconUrl){
    message.error(t('m563')+t('m583'));
    return;
  }
  if(!addFrom.value.bankName){
    message.error(t('m562')+t('m581'));
    return;
  }
  if(!addFrom.value.bankCode){
    message.error(t('m562')+t('m651'));
    return;
  }
  if(!addFrom.value.ifscCode){
    message.error(t('m562')+'ifscCode');
    return;
  }
  // if(![0,1].includes(Number(addFrom.value.status))){
  //   message.error(t('m563')+t('m592'));
  //   return;
  // }
  let res;
  loading.value=true;
  if (isEdit) {
    const {id, ifscCode, bankName, bankCode, iconUrl} = addFrom.value
    const editFrom={id, ifscCode, bankName, bankCode, iconUrl}
    res = await bankInfoAdminUpdate(editFrom).finally(()=>loading.value=false);
  } else {
    res = await addBankInfoAdmin(addFrom.value).finally(()=>loading.value=false);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t('s7') : t('s8'));
    getList();
    closeAddDalog();
  }
};
const startUpload = (val:any) => {
  if(val) isUpload.value = true;
}
const finishUpload = (val:any) => {
  if(val) isUpload.value = false;
}
const groupList = ref([])
// const getGroupList = async () => {
//   const res: any = await getKycBankCodeList();
//   if (res && res.code === "1") {
//     groupList.value =res.data|| [];
//   }
// };
onMounted(() => {
  // getGroupList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

