<template>
    <div class="search">
      <h2>{{ $getMenuName() }}</h2>
      <a-row>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.memberId"
            class="searchstyle"
            :placeholder="$t('n272')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.upiId"
            class="searchstyle"
            :placeholder="'UPI ID'"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            class="searchstyle"
            show-search
            v-model:value="query.bankCode"
            :options="groupList"
            :placeholder="$t('m563')+$t('m582')"
            :allowClear="true"
          >
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            v-model:value="query.riskControlRuleNo"
            :placeholder="$t('n1130')"
            class="searchstyle"
          >
            <a-select-option value="SELL01">SELL01</a-select-option>
            <a-select-option value="SELL02">SELL02</a-select-option>
        </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            v-model:value="query.punishRuleNo"
            :placeholder="$t('n277')"
            class="searchstyle"
            :options="Object.entries(punishRuleNoMap).map(([key, value]) => ({ value: key, label: $t(value) }))"
          ></a-select>
        </a-col>
        <a-col>
          <timeRange v-model:startTime="query.riskControlTimeStart" v-model:endTime="query.riskControlTimeEnd"  :title="$t('n273')" :type="1"/>
        </a-col>
        <a-col>
          <a-button type="primary" :icon="h(SearchOutlined)" @click="getData(1)">{{
            $t("search")
          }}</a-button>
          <a-button type="primary" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
        <ExportButton
          :query="query"
          :api="upiRiskControlLogAdminExport"
          permission="admin:upiRiskControlLogAdmin:export"
        />
          <!-- <a-button type="primary" :loading="loading" @click="exportList" v-permission="'admin:upiRiskControlLogAdmin:export'">{{
            $t("export")
          }}</a-button> -->
        </a-col>
      </a-row>
    </div>
    <a-table
      :dataSource="dataList"
      :columns="columns"
      :pagination="paginationConfig"
      :scroll="{ x: '100%' ,y : getTabH + 'px'}"
      :loading="loading"
      @change="handleTableChange"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        <a-button v-if="record.memberId" type="link" class="copyContent" @click="showMember(record.memberId)">{{
          record.memberId
        }}</a-button>
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'punishRuleNo'">
        {{ record.punishRuleNo?$t($getMapItem(punishRuleNoMap,record.punishRuleNo)) : '-' }}
      </template>
      <template v-if="column.key === 'riskControlRuleNo'">
        {{ record.riskControlRuleNo || '-' }}
      </template>
      <template v-if="column.key ==='upiId'">
        <a-tooltip v-if="record.upiId">
          <template #title>{{ record.upiId }}</template>
          <div class="toopTipStyle">
            {{ record.upiId }}
            <CopyOutlined v-if="record.upiId" class="copyId"  @click="$copyId(record.upiId)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key ==='bankCode'">
        <a-tooltip v-if="record.bankCode">
          <template #title>{{ record.bankCode }}</template>
          <div class="toopTipStyle">
            {{ record.bankCode }}
            <CopyOutlined v-if="record.bankCode" class="copyId"  @click="$copyId(record.bankCode)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'banDuration'">
        {{ record.banDuration === null || record.banDuration === undefined
            ? '-' 
            : record.banDuration <= 0 
              ? $t('n1153') 
              : formatTime(record.banDuration)
        }}
      </template>
      <template v-if="column.key === 'action'">
          <!-- <a-popconfirm
              :title="$t('m455')"
              :description="$t('m456')"
              :ok-text="$t('yes')"
              :cancel-text="$t('no')"
              @confirm="remove(record)"
          >
          <a-tag
              style="cursor: pointer;color:#1677ff;border:1px solid #1677ff"
              size="small"
              v-permission="'admin:memberBlack:removeBlack'"
              >{{ $t("m454") }}
          </a-tag>
          </a-popconfirm> -->
      </template>
    </template>
    </a-table>
  <a-modal
    v-model:open="detailModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
  >
    <memberDetail
      v-if="detailModel"
      :memberID="detailId.memberId"
      :id="detailId.id"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h, computed } from "vue";
import { punishRuleNoMap } from "@/utils/publicData";
import {
  upiRiskControlLogAdminList,
} from "@/api/wind.api.ts";
import {
  getKycBankCodeList,
} from "@/api/kycConfig.api";
import { upiRiskControlLogAdminExport } from "@/api/export";
import { useI18n } from "vue-i18n";
import { formatTime } from "@/utils/index";
import { getStartAndEndOfDay, usePagination } from "@/plugins/dataMap";
import memberDetail from "@/components/Member/memberDetail.vue";
import { message } from "ant-design-vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
const extendData = ref({});
const query = ref({
  asc: false,
  column: '',
  pageNo: 1,
  pageSize: 20,
  bankCode:undefined,
  upiId:undefined,
  memberId: undefined,
  punishRuleNo: undefined,
  riskControlRuleNo: undefined,
  riskControlTimeStart: startIndiaTime,
  riskControlTimeEnd: endIndiaTime,
})
const detailModel = ref(false);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const columns:any = [
  {
    title: t("e47"),
    customRender:({index}:{index:any})=> index + 1,
    align: "center",
    width: 60,
  },
  {
    title: t('n272'),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: 'UPI ID',
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
  },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 140,
  },
  {
    title: t('n1130'),
    dataIndex: "riskControlRuleNo",
    key: "riskControlRuleNo",
    align: "center",
    width: 100,
  },
  {
    title: t('n277'),
    dataIndex: "punishRuleNo",
    key: "punishRuleNo",
    align: "center",
    width: 160,
  },
  {
    title: t('n273'),
    dataIndex: "riskControlTime",
    key: "riskControlTime",
    align: "center",
    width: 140,
  },
  {
    title: t('n1131'),
    dataIndex: "countOfC2cOrder",
    key: "countOfC2cOrder",
    align: "center",
    width: 120,
  },
  {
    title: t('n1132'),
    dataIndex: "remainingAmountOfC2cOrder",
    key: "remainingAmountOfC2cOrder",
    align: "center",
    width: 140,
  },
  {
    title: t('n1150'),
    dataIndex: "banDuration",
    key: "banDuration",
    align: "center",
    width: 140,
  },
  // {
  //   title: t("operation"),
  //   dataIndex: "action",
  //   key: "action",
  //   width: 180,
  //   align: "center",
  //   fixed: 'right',
  // },
];
const loading = ref(false);
const { paginationConfig } = usePagination();
const dataList = ref([]);
const getData = async (isFirst: any = null) => {
  if(isFirst){
    query.value.pageNo = 1;
    paginationConfig.current = 1;
  }
  loading.value = true;
  const res: any = await upiRiskControlLogAdminList(query.value).finally(()=>loading.value = false);
  if (res) {
    dataList.value = res.data
    paginationConfig.total = res.total || 0;
    paginationConfig.pageSize = query.value.pageSize;
    paginationConfig.current = query.value.pageNo;
  }
};

const resetQuery = () => {
  query.value={
    asc: false,
    column: '',
    pageNo: 1,
    pageSize: 20,
    bankCode:undefined,
    upiId:undefined,
    memberId: undefined,
    punishRuleNo: undefined,
    riskControlRuleNo: undefined,
    riskControlTimeStart: '',
    riskControlTimeEnd: '',
}
  paginationConfig.pageSize = 20;
  paginationConfig.current = 1;
  getData();
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  paginationConfig.current = pag.current;
  paginationConfig.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getData();
};
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};
const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res: any = await upiRiskControlLogAdminExport(data).finally(() => {
    loading.value = false;
  });
  if (res.code == "1") {
    message.success(t("n545"));
  }
};
const groupList = ref([])
const getGroupList = async () => {
const res: any = await getKycBankCodeList();
if (res && res.code === "1") {
  groupList.value =res.data.map((item: any) => ({
    value: item,
    label: item,
  }));
}
};
onMounted(() => {
  getGroupList();
  getData();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.green){
  color: green;
}
:deep(.red){
  color: red;
}
</style>