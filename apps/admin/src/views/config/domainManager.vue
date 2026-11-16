<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.type"
          :placeholder="$t('m563')+$t('n1728')"
          :options="Object.entries(domainTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.dndFlag"
          :placeholder="$t('m563')+$t('n1730')"
          :options="Object.entries(dndFlagMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <a-button type="primary" @click="showAddDialog"   v-permission="'admin:domainConfigAdmin:saveDomainConfig'">{{ $t('add') }}</a-button>
      </a-col>
    </a-row>
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
      <template v-if="column.key === 'type'" >
        {{ $getMapItem(domainTypeMap, record.type) }}
      </template>
      <template v-if="column.key === 'dndFlag'" >
        {{ $getMapItem(dndFlagMap, record.dndFlag) }}
      </template>
      <template v-if="column.key === 'domain'" >
        <a-tooltip v-if="record.domain">
          <template #title>{{ record.domain }}</template>
          <div class="toopTipStyle">{{ record.domain }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'remark'" >
        <a-tooltip v-if="record.remark">
          <template #title>{{ record.remark }}</template>
          <div class="toopTipStyle">{{ record.remark }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'updateBy'" >
        {{ record.updateBy || record.createBy || '-' }}
      </template>
      <template v-if="column.key === 'updateTime'" >
        {{ record.updateTime || record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:domainConfigAdmin:updateDomainConfig'"
          >{{ $t("edit") }}
        </a-tag> 
        
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :title="isEdit? $t('b8'): $t('add')" @cancel="closeAddDalog" :footer="null">
    <a-form
      :model="addFrom"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 22 }"
    >
      <a-form-item :label = "$t('n1728')" name="type"  :rules="[{ required: true, message: '' }]">
        <a-select
          class="searchstyle"
          :placeholder= "$t('n1728')"
          style="width:100%"
          v-model:value="addFrom.type"
          :options="Object.entries(domainTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
        >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1729')" name="domain" :rules="[{ required: true, message: '' }]">
        <a-input v-trim v-model:value="addFrom.domain" :placeholder="$t('n1729')" />
      </a-form-item>
      <a-form-item :label = "$t('n1730')" name="dndFlag" >
        <a-select
          class="searchstyle"
          :placeholder= "$t('n1730')"
          style="width:100%"
          v-model:value="addFrom.dndFlag"
          :options="Object.entries(dndFlagMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
        >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('remark')" name="remark" >
        <a-textarea v-trim v-model:value="addFrom.remark" :rows="4" :placeholder="$t('remark')" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
        <a-button type="primary" @click="addBtn">{{
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
  domainConfigAdminListPage,
  domainConfigAdminSaveDomainConfig,
  domainConfigAdminUpdateDomainConfig,
} from "@/api/c2cconfig.api";
import { SearchOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { onMounted, ref, h } from "vue";
import { useI18n } from "vue-i18n";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
const { t } = useI18n();
const { getTabH } = useTabHeight(3);
const dndFlagMap:any = {
  '-1':t('b11'),//删除
  '0':t('disabled'),//禁用
  '1':t('publicType1'),//正常
}
const domainTypeMap:any = {
  1:t('n1740'),//AR-Wallet主域名
  2:t('n1741'),//外部域名
  3:t('n1736'),//API域名
  4:t('n1735'),//APK文件下载域名
}
const query = ref({
  asc:false,
  column:'',
  pageNo: 1,
  pageSize: 20,
  dndFlag:undefined,
  type:undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
})
const columns:any = [
  {
    title: t("e47"),
    align: "center",
    width: 60,
    customRender: ({ index }: any) => index + 1,
  },
  // {
  //   title: "ID",
  //   dataIndex: "id",
  //   key: "id",
  //   width:100,
  //   align:"center"
  // },
  {
    title: t('n1728'),
    dataIndex: "type",
    key: "type",
    align:"center",
    width: 120,
  },
  {
    title: t('n1729'),
    dataIndex: "domain",
    key: "domain",
    align:"center",
    width: 160,
  },
  {
    title: t('n1730'),
    dataIndex: "dndFlag",
    key: "dndFlag",
    align:"center",
    width: 100,
  },
  {
    title: t('remark'),
    dataIndex: "remark",
    key: "remark",
    ellipsis: true,
    align:"center",
    width: 200,
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align:"center",
    width: 100,
  },
  {
    title: t("l71"),
    dataIndex: "updateTime",
    key: "updateTime",
    align:"center",
    width: 100,
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    align:"center",
    width: 60,
  },
];
let isEdit = false;
const addFrom = ref<any>({
  type: undefined,
  domain: undefined,
  dndFlag: '1',
  remark: undefined,
});

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
  handleQueryFields: (q) => ({
    ...q,
    dndFlag: q.dndFlag != undefined || q.dndFlag != null ? Number(q.dndFlag) : undefined,
  }),
  api: domainConfigAdminListPage,
  fetchType: 2,
  defaultPageSize: 20,
  filterRules: [],
  afterFetch: (data) =>
    data.map((item: any) => {
      item.dndFlag = String(item.dndFlag);
      return item;
    }),
  afterGetDataFunc: () => {
    clearSelected();
  },
});
const addDialog = ref<boolean>(false);
const showAddDialog = () => {
  isEdit = false;
  addFrom.value = {
    type: undefined,
    domain: undefined,
    dndFlag: '1',
    remark: undefined,
  };
  addDialog.value = true;
};
const selectId = ref<any>(null);
const editDialog = (value: any) => {
  selectedRow();
  isEdit = true;
  const {
    id,
    type,
    domain,
    dndFlag,
    remark
  } = value;
  addFrom.value = {
    type,
    domain,
    dndFlag,
    remark
  };
  selectId.value = id;
  addDialog.value = true;
};

const closeAddDalog = () => {
  addFrom.value = {
    type: undefined,
    domain: undefined,
    dndFlag: '1',
    remark: undefined,
  };
  isEdit = false;
  addDialog.value = false;
  selectId.value = null;
};
const addBtn = async () => {
  if(!addFrom.value.type){
    message.error(t('m563')+t('n1728'));
    return;
  }
  if(!addFrom.value.domain){
    message.error(t('m562')+t('n1729'));
    return;
  }
  let res;
  loading.value=true;
  if (isEdit) {
    const {type, domain, dndFlag, remark} = addFrom.value
    const editFrom={type, domain, dndFlag, remark};
    res = await domainConfigAdminUpdateDomainConfig(Object.assign(editFrom,{id:selectId.value})).finally(()=>loading.value=false);
  } else {
    res = await domainConfigAdminSaveDomainConfig(addFrom.value).finally(()=>loading.value=false);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t('s7') : t('s8'));
    getList();
    closeAddDalog();
  }
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

