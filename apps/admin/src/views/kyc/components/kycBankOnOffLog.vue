<template>
  <div class="search">
    <a-row>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.bankCode"
          :placeholder="$t('m563')+$t('m582')"
        >
          <a-select-option
            v-for="(item) in groupList"
            :value="item"
            :key="item"
            >{{ item }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.controlSwitchType"
          :placeholder="$t('m563')+$t('n1367')"
          :options="Object.entries(kycBankStatusMap).map(([key, value]:[any,any]) => ({
            label: $t(value),
            value: Number(key),
          }))"
        >
        </a-select>
      </a-col>
      <a-col v-if="!props.bankRecord.bankCode">
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd"  :title="$t('l50')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          :loading="loading"
          >{{ $t('search') }}</a-button
        >
        <a-button type="primary" :loading="loading" @click="resetQuery">{{ $t('reset') }}</a-button>
        <a-button type="primary" :loading="loading" v-if="!props.bankRecord.bankCode" v-permission="'admin:kycBankControlSwitchLogAdmin:save'" @click="showAddLog">{{ $t('add') }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record:any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'bankCode'">
        <a-tooltip>
          <template #title>{{ record.bankCode }}</template>
          <div class="toopTipStyle2">{{ record.bankCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'controlSwitchType'">
        <a-tooltip>
          <template #title>{{ $t($getMapItem(kycBankStatusMap,record.controlSwitchType) || '-') }}</template>
          <div class="toopTipStyle2">{{ $t($getMapItem(kycBankStatusMap,record.controlSwitchType) || '-') }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'newStatus'">
        <div style="padding: 6px 0">
          <span :class="record.newStatus == 1 ? 'tag-green' : record.newStatus == 0 ? 'tag-red' : '-'">
            {{ record.newStatus == 1 ? $t('l53') : record.newStatus == 0 ? $t('l54') : '-' }}
          </span>
        </div>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div class="toopTipStyle2">{{ record.remark }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'updateBy'">
        <a-tooltip>
          <template #title>{{ record.updateBy }}</template>
          <div class="toopTipStyle2">{{ record.updateBy }}</div>
        </a-tooltip>
      </template>
    </template>
  </a-table>
  <!-- 新增日志 -->
   <a-modal
    :title="$t('n1368')"
     v-model:visible="addLogVisible"
     :width="800"
     :footer="null">
      <a-form
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 16 }"
        :model="logForm"
        >
        <a-form-item
          :label="$t('m582')"
          required
        >
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="logForm.bankCode"
          :placeholder="$t('m563')+$t('m582')"
        >
          <a-select-option
            v-for="(item) in groupList"
            :value="item"
            :key="item"
            >{{ item }}</a-select-option
          >
        </a-select>
        </a-form-item>
        <a-form-item
          :label="$t('n1367')"
          required
        >
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="logForm.controlSwitchType"
            :placeholder="$t('m563')+$t('n1367')"
            :options="Object.entries(kycBankStatusMap).map(([key, value]:[any,any]) => ({
              label: $t(value),
              value: Number(key),
            }))"
          />
        </a-form-item>
        <a-form-item
          :label="$t('state')"
          required
        >
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="logForm.newStatus"
            :placeholder="$t('m563')+$t('state')"
            :options="[
              { label: $t('l53'), value: 1 },
              { label: $t('l54'), value: 0 },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="$t('remark')"
          required
        >
          <a-textarea
            v-model:value="logForm.remark"
            :rows="4"
            :maxlength="200"
          ></a-textarea>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 10 }">
          <a-button :loading="loading" type="primary" @click="addBtn">{{
             $t('add')
          }}</a-button>
          <a-button style="margin-left: 10px" @click="closeAddDalog"
            >{{ $t('l54') }}</a-button
          >
        </a-form-item>

      </a-form>
   </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { 
  kycBankControlSwitchLogAdminListPage,
  getKycBankCodeList,
  kycBankControlSwitchLogAdminSave
 } from "@/api";
import { useI18n } from "vue-i18n";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { kycBankStatusMap } from "@/utils/publicData";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { log } from "console";
import { message } from "ant-design-vue";
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
const props = defineProps({
  bankRecord: {
    type: Object,
    default: () => ({}),
  },
});
// const dataSource = ref([])
// const loading = ref(false)
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const query = ref({
  pageNo: 1,
  pageSize: 20,
  createTimeStart: '',
  createTimeEnd: '',
  bankCode: props.bankRecord.bankCode || undefined,
  controlSwitchType: props.bankRecord.controlSwitchType || undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const columns:any = [
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    align:"center",
    width: 100,
  },
  {
    title: t('n1367'),
    dataIndex: "controlSwitchType",
    key: "controlSwitchType",
    align:"center",
    width: 160,
  },
  {
    title: t('state'),
    dataIndex: "newStatus",
    key: "newStatus",
    align:"center",
    width: 100,
  },
  {
    title: t('remark'),
    dataIndex: "remark",
    key: "remark",
    align:"center",
    width: 200,
  },
  {
    title: t('l48'),
    dataIndex: "updateBy",
    key: "updateBy",
    align:"center",
    width: 100,
  },
  {
    title:  t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    align:"center",
    width: 120,
  },
];
const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: kycBankControlSwitchLogAdminListPage,
  defaultPageSize: 20,
  fetchType: 2,
  filterRules: [],
});
// 日志弹窗
const addLogVisible = ref(false);
const logForm = ref<any>({
  bankCode: undefined,
  controlSwitchType: undefined,
  newStatus: undefined,
  remark: undefined,
});
const showAddLog =  () => {
  logForm.value = { 
    bankCode: undefined,
    controlSwitchType: undefined,
    newStatus: undefined,
    remark: undefined,
  };
  addLogVisible.value = true;
};
const addBtn = async () => {
  if (!logForm.value.bankCode) {
    message.error(t('m563') + t('m582'));
    return;
  }
  if (!logForm.value.controlSwitchType) {
    message.error(t('m563') + t('n1367'));
    return;
  }
  if (![0,1].includes(logForm.value.newStatus)) {
    message.error(t('m563') + t('state'));
    return;
  }
  if (!logForm.value.remark) {
    message.error(t('m563') + t('remark'));
    return;
  }
  loading.value = true;
  const res: any = await kycBankControlSwitchLogAdminSave(logForm.value).finally(()=>{
    loading.value = false;
  });
  if (res && res.code === "1") {
    message.success(t('s10'));
    closeAddDalog();
    getList();
  }
};
const closeAddDalog = () => {
  addLogVisible.value = false;
  logForm.value = { 
    bankCode: undefined,
    controlSwitchType: undefined,
    newStatus: undefined,
    remark: undefined,
  };
};

const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};
onMounted(() => {
  getGroupList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
