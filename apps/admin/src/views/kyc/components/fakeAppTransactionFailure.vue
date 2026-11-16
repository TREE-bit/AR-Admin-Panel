<template>
  <div class="search">
    <a-row style="margin: 0 0 15px 0">
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          allow-clear
          v-model:value="query.errorCode"
          :placeholder="$t('m562')+$t('n1505')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          :placeholder="$t('m563')+$t('n1570')"
          v-model:value="query.failedParty"
          :options="Object.entries(failedPartyMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          allowClear
          :placeholder="$t('m563')+$t('n1571')"
          v-model:value="query.judgeSource"
          :options="Object.entries(judgeSourceMap).map(([key, value]:[any,any]) => ({ value: key, label: $t(value) }))"
        >
        </a-select>
      </a-col>
      <!-- <a-col>
        <timeRange v-model:startTime="query.startTimeGe" v-model:endTime="query.startTimeLe"  :title="$t('拉取时间')" :type="1"/>
      </a-col> -->
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
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
    <template v-if="column.key === 'failedParty'">
      <span :class="colorMap[record.failedParty]">{{ $getMapItem(failedPartyMap,record.failedParty) }}</span>
    </template>
    <template v-if="column.key === 'judgeSource'">
      <span :class="colorMap[record.judgeSource+2]">{{ $getMapItem(judgeSourceMap,record.judgeSource) }}</span>
    </template>
    <template v-if="column.key === 'judgeName'">
      <a-tooltip v-if="record.judgeName">
        <template #title >
          {{ record.judgeName }}
        </template>
        <div class="toopTipStyle2" >
          {{ record.judgeName }}
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'errorCode'">
      <a-tooltip v-if="record.errorCode">
        <template #title >
          {{ record.errorCode }}
        </template>
        <div class="toopTipStyle2" >
          {{ record.errorCode }}
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'errorRemark'">
      <a-tooltip v-if="record.errorRemark">
        <template #title >
          {{ record.errorRemark }}
        </template>
        <div class="toopTipStyle2" >
          {{ record.errorRemark }}
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'createTime'">
      {{ record.createTime || '-' }}
    </template>
    <template v-if="column.key === 'operate'">
      <a-tag
        color="blue"
        style="cursor: pointer;"
        size="small"
        @click="openEditMadal(record)"
        v-permission="'admin:fakeAppTransactionFailedPartyAdmin:updateFailedParty'"
        >{{ $t("edit") }}
      </a-tag>
    </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="editModal"
    :title="$t('edit')"
    :width="800"
    :footer="null"
    @cancel="cancelModal"
  >
    <a-form
      ref="formRef"
      :model="editFrom"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item :label="$t('n1570')" name="failedParty" :rules="[{ required: true, message: ''}]">
        <a-select
          v-model:value="editFrom.failedParty"
          :options="Object.entries(failedPartyMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: $t(value) })).filter((item: any) => item.value != 0)"
        >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n1572')" name="errorRemark" :rules="[{ required: true, message: ''}]">
        <a-textarea :rows="4" :maxlength="200" v-model:value="editFrom.errorRemark" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 9, span: 16 }">
        <a-button type="primary" @click="handleOk">{{ $t("b28") }}</a-button>
        <a-button @click="cancelModal" class="ml-10">{{ $t("b10") }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  fakeAppTransactionFailedPartyAdminListPage,
  fakeAppTransactionFailedPartyAdminUpdateFailedParty
} from "@/api";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { message } from "ant-design-vue";
import { colorMap } from "@/utils";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const query = ref({
  asc: false,
  column: "",
  failedParty: undefined,
  errorCode: undefined,
  judgeSource: undefined,
});
const failedPartyMap: any = {
  0: t("n1573"),//待定
  1: t("n1574"),//付款方责任
  2: t("n1575"),//收款方责任
}
const judgeSourceMap: any = {
  0: t("n1576"),//系统判定
  1: t("n1577"),//人工判定
}
const columns:any = [
  {
    title: t("n1505"),
    dataIndex: "errorCode",
    key: "errorCode",
    align: "center",
    width: 150,
  },
  {
    title: t("n1572"),
    dataIndex: "errorRemark",
    key: "errorRemark",
    align: "center",
    width: 250,
  },
  {
    title: t("n1570"),
    dataIndex: "failedParty",
    key: "failedParty",
    align: "center",
    width: 150,
  },
  {
    title: t("n1571"),
    dataIndex: "judgeSource",
    key: "judgeSource",
    align: "center",
    width: 150,
  },
  {
    title: t("n1628"),
    dataIndex: "judgeName",
    key: "judgeName",
    align: "center",
    width: 150,
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 150,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    width: 120,
    fixed: 'right',
  },
];
const {
  dataSource,
  extendData,
  response,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: fakeAppTransactionFailedPartyAdminListPage,
  defaultPageSize: 20,
  fetchType: 2,
  filterRules: [],
});
//编辑
const editModal = ref(false);
const editFrom = ref({
  id: undefined,
  failedParty: undefined,
  errorRemark: undefined,
});
const openEditMadal = (record: any) => {
  editModal.value = true;
  editFrom.value = {
    id: record.id,
    failedParty: record.failedParty,
    errorRemark: record.errorRemark,
  };
}
const handleOk = async () => {
   if(!editFrom.value.failedParty) {
      message.error(t('m563')+t('n1570'));
      return;
   }
   if(!editFrom.value.errorRemark) {
      message.error(t('m562')+t('n1572'));
      return;
   }
   loading.value = true;
   const res: any = await fakeAppTransactionFailedPartyAdminUpdateFailedParty(editFrom.value).finally(() => (loading.value = false));
   if (res && res.code == "1") {
      message.success(t('s10'));
      getList();
      cancelModal();
   }
}
const cancelModal = () => {
  editModal.value = false;
  editFrom.value = {
    id: undefined,
    failedParty: undefined,
    errorRemark: undefined,
  };
}
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3,40).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
