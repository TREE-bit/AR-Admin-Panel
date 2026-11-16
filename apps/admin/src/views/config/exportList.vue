<template>
  <div class="search">
    <!-- <countDown :title="$t('n546')" @zero="getList()" :defaultTime="2" /> -->
     <h2>{{ $t('n546') }}</h2>
    <a-row>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.exportType"
          :placeholder="$t('m563') +$t('n567')"
          :options="Object.entries(exportTypeMap).map(([key, value]:[any,any]) => ({ label: $t(value), value: key }))"
          allow-clear>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.exportName"
          :placeholder="$t('m562') +$t('n568')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.exportStatus"
          :placeholder="$t('m563') +$t('n549')"
          :options="Object.entries(exportStatusMap).map(([key, value]:[any,any]) => ({ label: $t(value), value: key }))"
          allow-clear>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.exportUser"
          :placeholder="$t('m562') +$t('l48')"
        />
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.exportTimeStart" v-model:endTime="query.exportTimeEnd" :title="$t('l67')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    size="middle"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'exportType'">
        {{ $t($getMapItem(exportTypeMap,record.exportType)) }}
      </template>
      <template v-if="column.key === 'exportStatus'">
        <span :style="record.exportStatus == 0 ? 'color:#FFA500' : record.exportStatus == 1 ? 'color:#52C41A' : 'color:#F44336'">
          {{ $t($getMapItem(exportStatusMap,record.exportStatus)) }}
          &nbsp;
        </span>
        <LoadingOutlined v-if="record.exportStatus == 0" />
      </template>
      <template v-if="column.key === 'exportUser'">
        <a-tooltip v-if="record.exportUser">
          <template #title>
            {{ record.exportUser }}
          </template>
          <div class="toopTipStyle">{{ record.exportUser }}</div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'fileSize'">
        {{ record.fileSize || '-' }}
      </template>
      <template v-if="column.key === 'exportTime'">
        {{ record.exportTime || '-' }}
      </template>
      <template v-if="column.key === 'exportFinishTime'">
        {{ record.exportFinishTime || '-' }}
      </template>
      <template v-if="column.key === 'exportName'">
        <a-tooltip v-if="record.exportName">
          <template #title>
            <div class="linkTextType">
              {{ record.exportName }}.xlsx
            </div>
          </template>
          <div class="toopTipStyle2 linkTextType">{{ record.exportName }}.xlsx</div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'operate'">
        <!-- <a v-if="record.exportStatus == 1" :href="record.downloadUrl" :download="record.exportName" >{{ $t("export") }}</a> -->
        <a-button  size="small" v-if="record.exportStatus == 3 " type="primary" danger @click="interrupted(record.id)">
          {{ $t("n1222") }}
        </a-button>
        <a-button  size="small" v-else-if="record.exportStatus == 1" type="primary" @click="downloadExport(record)">
          {{ $t("export") }}
        </a-button>
        <span v-else>-</span>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ref, h, onMounted, watchEffect } from "vue";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { usePagination, getStartAndEndOfDay } from "@/plugins/dataMap";
import { excelExportLogAdminInterruptExport,excelExportLogAdminGetExportUrl } from "@/api";
import { useI18n } from "vue-i18n";
import { excelExportLogAdminListPage } from "@/api/c2cconfig.api";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { exportTypeMap, exportStatusMap } from "@/utils/publicData";
import Bus from "@/utils/bus";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { usePageCash } from "@/hooks/usePageCash.hook"; 
import { message } from "ant-design-vue";
const route = useRoute();
const { pageCash,setPageCash,getPageCash,clearPageCash } = usePageCash();
const resultData = ref({});
const isUseCash = ref(false);
onBeforeRouteLeave(() => {
  setPageCash(route.fullPath.split('?')[0], query.value, resultData.value);
})
const router = useRoute();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
// const { paginationConfig } = usePagination();
// const loading = ref(false);
interface Query {
  column: string;
  asc: boolean;
  pageNo: number;
  pageSize: number;
  exportTimeStart: string | null;
  exportTimeEnd: string | null;
  exportName?: string;
  exportStatus?: string;
  exportType?: string;
  exportUser?: string;
}
const query = ref<Query>({
  column: '',
  asc: true,
  pageNo: 1,
  pageSize: 20,
  exportTimeStart: startIndiaTime,
  exportTimeEnd: endIndiaTime,
  exportName: router.query.exportName as string || undefined,
  exportStatus: undefined,
  exportType: undefined,
  exportUser: undefined,
});
// const dataSource = ref([]);
const columns:any = [
    {
      title: t("e47"),
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 90,
      customRender: ({ index }:{index:any}) => index + 1,
    },
    {
      title: t('n567'),
      dataIndex: "exportType",
      key: "exportType",
      align:"center",
      width: 100,
    },
    {
      title: t('n568'),
      dataIndex: "exportName",
      key: "exportName",
      align:"center",
      width: 160,
    },
    {
      title: t('m560'),
      dataIndex: "fileSize",
      key: "fileSize",
      align:"center",
      width: 70,
    },
    {
      title: t('n549'),
      dataIndex: "exportStatus",
      key: "exportStatus",
      align:"center",
      width: 100,
    },
    {
      title: t('l48'),
      dataIndex: "exportUser",
      key: "exportUser",
      align:"center",
      width: 100,
    },
    {
      title: t('l67'),
      dataIndex: "exportTime",
      key: "exportTime",
      align:"center",
      width: 120,
    },
    {
      title: t('l39'),
      dataIndex: "exportFinishTime",
      key: "exportFinishTime",
      align:"center",
      width: 120,
    },
    {
      title: t('operation'),
      dataIndex: "operate",
      key: "operate",
      align:"center",
      width: 60,
    },
  ];

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
  }),
  api: excelExportLogAdminListPage,
  fetchType: 2,
  defaultPageSize: 20,
  filterRules: [],
});
watchEffect(() => {
  if(!isUseCash.value) resultData.value = response.value;
});
// const getList = async (isFirst:any = null) => {
//   if (isFirst) {
//     query.value.pageNo = 1;
//     paginationConfig.current = 1;
//   }
//   loading.value = true;
//   paginationConfig.current = query.value.pageNo;
//   paginationConfig.pageSize = query.value.pageSize;
//   const res:any = await excelExportLogAdminListPage(query.value).finally(()=>loading.value=false);
//   if (res && res.code === "1") {
//     resultData.value = res;
//     dataSource.value = res.data || [];
//     paginationConfig.total = res.total || 0;
//   }
// };
// const reset = () => {
//   query.value = {
//     column: '',
//     asc: true,
//     pageNo: 1,
//     pageSize: 20,
//     exportTimeStart: '',
//     exportTimeEnd: '',
//     exportName: undefined,
//     exportStatus: undefined,
//     exportType: undefined,
//     exportUser: undefined,
//   };
//   paginationConfig.current = 1;
//   getList();
// };
// const getChange = (value: any,filters:any,sorter: any) => {
//   const { current, pageSize } = value;
//   query.value.pageNo = current;
//   query.value.pageSize = pageSize;
//   paginationConfig.pageSize = pageSize;
//   paginationConfig.current = current;
//   getList();
// };

Bus.on('exportInfo', (val: any) => {
  if (val && val.status != 0) {
    getList();
  }
});

const downloadExport = async (val:any) => {
  loading.value = true;
  const res:any = await excelExportLogAdminGetExportUrl({id: val.id}).finally(() => loading.value = false);
  if(res.code == '1') {
    const a = document.createElement('a');
    a.href = res.data;
    a.download = val.exportName;
    a.target = '_blank'; // 避免阻止
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  // const isIE = window.navigator && window.navigator.msSaveOrOpenBlob;
  // const exportName = val.exportName.endsWith('.xlsx') ? val.exportName : `${val.exportName}.xlsx`;

  // fetch(val.downloadUrl, {
  //   method: 'GET',
  // })
  //   .then((response) => {
  //     if (!response.ok) throw new Error(t('m618'));
  //     return response.blob();
  //   })
  //   .then((blob) => {
  //     if (isIE) {
  //       window.navigator.msSaveOrOpenBlob(blob, exportName);
  //     } else {
  //       const link = document.createElement('a');
  //       const url = URL.createObjectURL(blob);
  //       link.href = url;
  //       link.download = exportName;
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       URL.revokeObjectURL(url);
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(t('m618'), err);
  //   });
};

// 中断导出
const interrupted = async (id:any) => {
  loading.value = true;
  try {
    const res: any = await excelExportLogAdminInterruptExport({id});
    if (res && res.code == "1") {
      message.success(t("s10"));
      getList();
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const pathName = route.fullPath.split('?')[0];
  if(pageCash.value.includes(pathName) && Object.keys(route.query).length == 0){
    const { queryCash, res } = getPageCash(pathName);
    if(!res.data || res.data && res.data.length == 0) {
      isUseCash.value = false;
      getList();
    }else{
      isUseCash.value = true;
      query.value = queryCash;
      dataSource.value = res.data;
      resultData.value = res;
      pagination.value.total = res.total;
      pagination.value.current = query.value.pageNo;
      pagination.value.pageSize = query.value.pageSize;
    }
  }else{
    clearPageCash(route.fullPath);
    getList();
  }
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped>
.linkTextType {
  word-break: break-all;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
