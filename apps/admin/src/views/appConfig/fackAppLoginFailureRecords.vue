<template>
  
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('c9')"
        />
      </a-col>
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
        <a-input v-trim
          v-model:value="query.phoneNumber"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m591')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.loginStage"
          :placeholder="$t('m563')+$t('n1715')"
          :options="Object.entries(loginStageMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.errorCode"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n1716')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.exceptionClass"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n1717')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.failureReason"
          :placeholder="$t('m563')+$t('n1718')"
          :options="Object.entries(failureReasonMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
        >
        </a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('l50')" :type="1"/>
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
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading"
    size="small"
    @change="handleTableChange"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'bankCode'">
        <a-tooltip v-if="record.bankCode">
          <template #title>{{ record.bankCode }}</template>
          <div class="toopTipStyle3">{{ record.bankCode }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'phoneNumber'">
        <a-tooltip v-if="record.phoneNumber">
          <template #title>{{ record.phoneNumber }}</template>
          <div class="toopTipStyle3">{{ record.phoneNumber }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'errorCode'">
        <a-tooltip v-if="record.errorCode">
          <template #title>{{ record.errorCode }}</template>
          <div class="toopTipStyle3">{{ record.errorCode }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'exceptionClass'">
        <a-tooltip :overlayStyle="{ width: 'auto', maxWidth: 'none' }" v-if="record.exceptionClass">
          <template #title>
            <div style="width: 440px;height: 200px;overflow-y: auto;">
              {{ record.exceptionClass }}
            </div>
          </template>
          <div class="toopTipStyle3">{{ record.exceptionClass }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'exceptionMessage'">
        <a-tooltip :overlayStyle="{ width: 'auto', maxWidth: 'none' }" v-if="record.exceptionMessage">
          <template #title>
            <div style="width: 440px;height: 200px;overflow-y: auto;">
              {{ record.exceptionMessage }}
            </div>
          </template>
          <div class="toopTipStyle3">{{ record.exceptionMessage }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'exceptionStackTrace'">
        <a-tooltip :overlayStyle="{ width: 'auto', maxWidth: 'none' }" v-if="record.exceptionStackTrace">
          <template #title>
            <div style="width: 640px;height: 200px;overflow-y: auto;">
              {{ record.exceptionStackTrace }}
            </div>
          </template>
          <div class="toopTipStyle3">{{ record.exceptionStackTrace }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'failureDetail'">
        <a-tooltip>
          <template #title>{{ record.failureDetail }}</template>
          <div class="toopTipStyle3">{{ record.failureDetail }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'loginStage'">
        {{ $getMapItem(loginStageMap,record.loginStage) || '-' }} 
      </template>
      <template v-if="column.key === 'failureReason'">
        {{ $getMapItem(failureReasonMap,record.failureReason) || '-' }} 
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.updateTime || record.createTime  || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <!-- 启用 -->
        <!-- <a-popconfirm
          :ok-text="$t('b28')"
          :cancel-text="$t('b10')"
          @confirm="handleUnban(record)"
        >
          <template #icon><a-icon type="question-circle" style="color: red" /></template>
          <template #title>
            <h3 style="text-align: center">{{ $t('n1701') }}</h3>
            <div><span style="color: red">*</span>{{ $t('remark') }}</div>
            <a-textarea  v-model:value="unBanRemark" v-trim style="width: 300px;" :rows="4" :maxlength="200" :placeholder="$t('m562') + $t('remark')"></a-textarea>
          </template>

          <a-tag
            :color="'rgba(14, 186, 139, 1)'"
            style="cursor: pointer"
            size="small"
            v-if="record.unbanFlag == 0"
            v-permission="'admin:fakeAppBanRecordAdmin:unbanFakeApp'"
            >{{ $t('enabled') }}
          </a-tag>
        </a-popconfirm> -->
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import {
  uploadKycPartnerAdminUploadKycLoginFailureRecords,
  fakeAppBanRecordAdminUnbanFakeApp,
  getKycBankCodeList,
} from "@/api";
import { message } from "ant-design-vue";
import { onMounted, ref, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight(1);
const { t } = useI18n();
const loginStageMap: any = {
  1: "Before Login State",
  2: "Upload Kyc Token State",
}
const failureReasonMap: any = {
  1: "Invalid Request",
  2: "Invalid Data",
  3: "Phone Bound By Other Member",
  4: "Rate Limited",
  5: "Lock Acquisition Failed",
  6: "Token Upload Failed",
  7: "Business Exception",
  8: "System Exception",
}
const query = ref({
  asc:false,
  column:'',
  pageNo: 1,
  pageSize: 20,
  memberId: undefined,
  loginStage: undefined,
  bankCode: undefined,
  phoneNumber: undefined,
  errorCode: undefined,
  exceptionClass: undefined,
  failureReason: undefined,
  createTimeStart: startIndiaTime,
  createTimeEnd: endIndiaTime,
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
    width: 90,
    customRender: ({ index }: any) => index + 1,
  },
  {
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
    width:160,
    align:"center"
  },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    width:160,
    align:"center"
  },
  {
    title: t('m591'),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    width:160,
    align:"center"
  },
  {
    title: t("n1715"),
    dataIndex: "loginStage",
    key: "loginStage",
    width:200,
    align:"center",
  },
  {
    title: t('n1716'),
    dataIndex: "errorCode",
    key: "errorCode",
    width:160,
    align:"center",
  },
  {
    title: t('n1717'),
    dataIndex: "exceptionClass",
    key: "exceptionClass",
    width:180,
    align:"center",
  },
  {
    title: t("n1719"),
    dataIndex: "exceptionMessage",
    key: "exceptionMessage",
    width:160,
    align:"center",
  },
  {
    title: t("n1720"),
    dataIndex: "exceptionStackTrace",
    key: "exceptionStackTrace",
    width:240,
    align:"center",
  },
  {
    title: t("n1721"),
    dataIndex: "failureDetail",
    key: "failureDetail",
    width:200,
    align:"center",
  },
  {
    title: t("n1718"),
    dataIndex: "failureReason",
    key: "failureReason",
    width:200,
    align:"center",
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    width:140,
    align:"center",
  },
  // {
  //   title: t('operation'),
  //   dataIndex: "action",
  //   key: "action",
  //   width:100,
  //   align:"center",
  //   fixed: 'right',
  // },
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
  api: uploadKycPartnerAdminUploadKycLoginFailureRecords,
  fetchType: 2,
  defaultPageSize: 20,
  filterRules: [],
});
const search = () => {
  getList(1)
}
const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};

// 启用
const unBanRemark = ref('')
const handleUnban = async (record: any) => {
  const {id } = record;
  loading.value = true;
  const res: any = await fakeAppBanRecordAdminUnbanFakeApp({banRecordId:id,remark:unBanRemark.value}).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
    unBanRemark.value = '';
  }
}

onMounted(() => {
  getGroupList();
  getList();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped>
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 8px;
  column-gap: 12px;
}
</style>

