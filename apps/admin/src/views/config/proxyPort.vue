<template>
  <div class="search">
    <!-- <countDown :title="$t('n546')" @zero="getList()" :defaultTime="2" /> -->
     <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.ip"
          :placeholder="$t('m562') +$t('n575')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.port"
          :placeholder="$t('m562') +$t('n576')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.status"
          :placeholder="$t('m563') +$t('state')"
          :options="Object.entries(agentPortStatus).map(([key, value]:[any,any]) => ({ label: $t(value), value: key }))"
          allow-clear>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.proxyProviders"
          :placeholder="$t('m563') +$t('n577')"
          :options="Object.entries(agentPortSupplier).map(([key, value]:[any,any]) => ({ label: value, value: key }))"
          allow-clear>
        </a-select>
      </a-col>
      <!-- <a-col>
        <timeRange v-model:startTime="query.exportTimeStart" v-model:endTime="query.exportTimeEnd" :title="$t('l67')" :type="1"/>
      </a-col> -->
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="reset">{{
          $t("reset")
        }}</a-button>
        <a-button type="primary"
          v-permission="'admin:proxyPortRelationAdmin:add'"
          @click="showDialog"
         >{{ $t("add") }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    size="middle"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :pagination="paginationConfig"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    @change="getChange"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <span :style="record.status == 0 ? 'color:#FFA500' : record.status == 1 ? 'color:#52C41A' : 'color:#F44336'">
          {{ $t($getMapItem(agentPortStatus,record.status)) }}
          &nbsp;
        </span>
      </template>
      <template v-if="column.key === 'proxyProviders'">
        {{ $getMapItem(agentPortSupplier,record.proxyProviders) }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.updateTime || record.createTime }}
      </template>
      <template v-if="column.key === 'operate'">
        <a-button v-permission="'admin:proxyPortRelationAdmin:update'"
          size="small" type="primary" @click="showEdit(record)">
          {{ $t("edit") }}
        </a-button>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="dialog"
    :title="isAdd ? $t('add') : $t('edit')"
    :footer="null"
    width="600px"
    @cancel="cancelDialog"
    >
    <a-form
      ref="proxyFormRef"
      :model="proxyForm"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      @finish="submitForm"
    >
      <a-form-item :label="$t('n575')" name="ip" required >
        <a-input v-trim :placeholder="$t('m562') + $t('n575')" v-model:value="proxyForm.ip" />
      </a-form-item>
      <a-form-item :label="$t('n576')" name="port" required>
        <a-input v-trim :placeholder="$t('m562') + $t('n576')" v-model:value="proxyForm.port" />
      </a-form-item>
      <a-form-item :label="$t('state')" name="status" required>
        <a-select 
          :placeholder="$t('m563') + $t('state')" 
          v-model:value="proxyForm.status" 
          :options="Object.entries(agentPortStatus).map(([key, value]:[any,any]) => ({ label: $t(value), value: Number(key) }))" 
        >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n577')" name="proxyProviders" required>
        <a-select
          :placeholder="$t('m563') + $t('n577')"
          v-model:value="proxyForm.proxyProviders"
          :options="Object.entries(agentPortSupplier).map(([key, value]:[any,any]) => ({ label: value, value: Number(key) }))"
        ></a-select>
      </a-form-item>
      <a-form-item :label="$t('n578')" name="mountMemberLimit" required>
        <a-input-number v-model:value="proxyForm.mountMemberLimit" :min="0" class="width100" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 9, span: 16 }">
        <a-button type="primary" html-type="submit" >{{ $t("save") }}</a-button>
        <a-button style="margin-left: 5px;" @click="cancelDialog">{{ $t("b10") }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, h, onMounted, nextTick } from "vue";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { usePagination, getStartAndEndOfDay } from "@/plugins/dataMap";
import { useI18n } from "vue-i18n";
import { 
  getProxyPortRelationList,
  proxyPortRelationAdd,
  proxyPortRelationUpdate,
} from "@/api/c2cconfig.api";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { agentPortStatus,agentPortSupplier } from "@/utils/publicData";
import { useRoute } from "vue-router";
import { FormInstance } from "ant-design-vue";
const router = useRoute();
const [startIndiaTime,endIndiaTime,time] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
const { paginationConfig } = usePagination();
const loading = ref(false);
const query = ref({
  column: '',
  asc: true,
  pageNo: 1,
  pageSize: 20,
  // exportTimeStart: startIndiaTime,
  // exportTimeEnd: endIndiaTime,
  ip: undefined,
  port: undefined,
  proxyProviders: undefined,
  status: undefined,
});
const dataSource = ref([]);
const columns:any = [
    {
      title: t("e47"),
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 60,
      customRender: ({ index }) => index + 1,
    },
    {
      title: t('n575'),
      dataIndex: "ip",
      key: "ip",
      align:"center",
      width: 240,
    },
    {
      title: t('n576'),
      dataIndex: "port",
      key: "port",
      align:"center",
      width: 100,
    },
    {
      title: t('state'),
      dataIndex: "status",
      key: "status",
      align:"center",
      width: 100,
    },
    {
      title: t('n577'),
      dataIndex: "proxyProviders",
      key: "proxyProviders",
      align:"center",
      width: 200,
    },
    {
      title: t('n579'),
      dataIndex: "mountMemberCount",
      key: "mountMemberCount",
      align:"center",
      width: 100,
    },
    {
      title: t('n578'),
      dataIndex: "mountMemberLimit",
      key: "mountMemberLimit",
      align:"center",
      width: 100,
    },
    {
      title: t('l67'),
      dataIndex: "createTime",
      key: "createTime",
      align:"center",
      width: 140,
    },
    {
      title: t('operation'),
      dataIndex: "operate",
      key: "operate",
      align:"center",
      width: 100,
    },
  ];

const getList = async (isFirst:any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    paginationConfig.current = 1;
  }
  loading.value = true;
  paginationConfig.current = query.value.pageNo;
  paginationConfig.pageSize = query.value.pageSize;
  const res: any = await getProxyPortRelationList(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data || [];
    paginationConfig.total = res.total || 0;
  }
};
const reset = () => {
  query.value = {
    column: '',
    asc: true,
    pageNo: 1,
    pageSize: 20,
    // exportTimeStart: '',
    // exportTimeEnd: '',
    ip: undefined,
    port: undefined,
    proxyProviders: undefined,
    status: undefined,
  };
  paginationConfig.current = 1;
  getList();
};
const getChange = (value: any,filters:any,sorter: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  paginationConfig.pageSize = pageSize;
  paginationConfig.current = current;
  getList();
};

// 新增/编辑
const proxyFormRef = ref<FormInstance>();
const dialog = ref(false);
const isAdd = ref(true);
const proxyForm = ref({
  ip: undefined,
  port: undefined,
  status: 0,
  proxyProviders: undefined,
  mountMemberLimit: 0,
});
const showDialog = () => {
  proxyForm.value = {
    ip: undefined,
    port: undefined,
    status: 0,
    proxyProviders: undefined,
    mountMemberLimit: 0,
  };
  dialog.value = true;
  nextTick(() => {
    proxyFormRef.value?.clearValidate?.();
  });
};
const showEdit = (record: any) => {
  isAdd.value = false;
  const { ip, port, status, proxyProviders, mountMemberLimit } = record;
  proxyForm.value = {
    ip, port, status, proxyProviders, mountMemberLimit
  };
  dialog.value = true;
  nextTick(() => {
    proxyFormRef.value?.clearValidate?.();
  });
};
const submitForm = async (values: any) => {
  loading.value = true;
  if (isAdd.value) {
    // 新增
    const res: any = await proxyPortRelationAdd(values).finally(() => loading.value = false);
    if (res && res.code == "1") {
      cancelDialog();
      getList();
    } 
  } else {
    // 编辑
    const res: any = await proxyPortRelationUpdate(values).finally(() => loading.value = false);
    if (res && res.code == "1") {
      cancelDialog();
      getList();
    }
  }
};
const cancelDialog = () => {
  dialog.value = false;
  isAdd.value = true;
  proxyForm.value = {
    ip: undefined,
    port: undefined,
    status: 0,
    proxyProviders: undefined,
    mountMemberLimit: 0,
  };
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped>
.width100 {
  width: 100%;
}
</style>
