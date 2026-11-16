<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.phoneNumber"
          allow-clear
          class="searchstyle"
          :placeholder="$t('n328')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          allow-clear
          class="searchstyle"
          :placeholder="$t('c9')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.orderNo"
          allow-clear
          class="searchstyle"
          :placeholder="$t('n332')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          v-model:value="query.bankCode"
          :options="bankCodeList"
          :placeholder="$t('m582')"
          :allowClear="true"
        ></a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.smsVerifyScene"
          :options="sceneList"
          :placeholder="$t('n2019')"
          :allowClear="true"
        ></a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.processFlag"
          :options="[
            { value: 2, label: $t('s10') },
            { value: 1, label: $t('m618') },
          ]"
          :placeholder="$t('n2020')"
          :allowClear="true"
        ></a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.operationTimeStart" v-model:endTime="query.operationTimeEnd" :title="$t('l67')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          :loading="loading"
          @click="getList(1)"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" :loading="loading" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <ExportButton
          :query="lastListQuery"
          :api="kycSmsVerifyLogExport"
          permission="admin:kycLinkStatusLogAdmin:export"
          :handleQuery="handleExportQuery"
        />
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
      <template v-if="column.key === 'bankCode'">
        <a-tooltip v-if="record.bankCode">
          <template #title>{{ record.bankCode }}</template>
          <div class="toopTipStyle">
            {{ record.bankCode }}
          </div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'phoneNumber'">
        <div v-if="record.phoneNumber" class="toopTipStyle">
          {{ record.phoneNumber }}
          <CopyOutlined class="copyId" @click="$copyId(record.phoneNumber)" />
        </div>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'otp'">
        {{ record.otp || '-' }}
      </template>
      <template v-if="column.key === 'smsVerifySceneDesc'">
        {{ getSceneLabel(record.smsVerifyScene, record.smsVerifySceneDesc) }}
      </template>
      <template v-if="column.key === 'processFlag'">
        <a-tag v-if="[1, 2].includes(record.processFlag)" :color="record.processFlag == 2 ? 'green' : 'red'">
          {{ record.processFlag == 2 ? $t('s10') : $t('m618') }}
        </a-tag>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'restResultsRemark'">
        <template v-if="record.restResults && record.restResults.length > 0">
          <div v-for="(item, index) in record.restResults" :key="index" class="table_inner_result">
            <a-tooltip v-if="item.remark">
              <template #title>{{ item.remark }}</template>
              <div class="toopTipStyle">
                {{ item.remark }}
              </div>
            </a-tooltip>
            <span v-else>-</span>
          </div>
        </template>
        <div v-else class="table_inner_result">-</div>
      </template>
      <template v-if="column.key === 'restResultsCode'">
        <template v-if="record.restResults && record.restResults.length > 0">
          <div v-for="(item, index) in record.restResults" :key="index" class="table_inner_result">
            {{ item.httpCode ?? '-' }}
          </div>
        </template>
        <div v-else class="table_inner_result">-</div>
      </template>
      <template v-if="column.key === 'restResultsSuccess'">
        <template v-if="record.restResults && record.restResults.length > 0">
          <div v-for="(item, index) in record.restResults" :key="index" class="table_inner_result">
            <!-- 可忽略的失败步骤不影响最终结果，用橙色区分 -->
            <a-tag :color="item.success == 1 ? 'green' : item.ignorable ? 'orange' : 'red'">
              {{ item.success == 1 ? $t('s10') : $t('m618') }}
            </a-tag>
          </div>
        </template>
        <div v-else class="table_inner_result">-</div>
      </template>
      <template v-if="column.key === 'restResultsBody'">
        <template v-if="record.restResults && record.restResults.length > 0">
          <div v-for="(item, index) in record.restResults" :key="index" class="table_inner_result">
            <div v-if="item.responseBody" class="inlineLine">
              <span class="inlineText responseBodyText" @click="openResponseBody(item)">{{ item.responseBody }}</span>
              <EyeOutlined class="inlineIcon" @click="openResponseBody(item)" />
              <CopyOutlined class="inlineIcon" @click="$copyId(item.responseBody)" />
            </div>
            <span v-else>-</span>
          </div>
        </template>
        <div v-else class="table_inner_result">-</div>
      </template>
      <template v-if="column.key === 'operationTime'">
        {{ record.operationTime || '-' }}
      </template>
      <template v-if="column.key === 'memberId'">
        <template v-if="record.memberId">
          <a-button type="link" class="copyContent" @click="showMember(record.memberId)">{{ record.memberId }}</a-button>
          <CopyOutlined class="copyId" @click="$copyId(record.memberId)" />
        </template>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'relatedOrder'">
        <div v-for="(order, index) in getRelatedOrders(record)" :key="index" class="inlineLine">
          <span class="inlineText"><span class="orderLabel">{{ $t(order.label) }}：</span>{{ order.value }}</span>
          <CopyOutlined class="inlineIcon" @click="$copyId(order.value)" />
        </div>
        <div v-if="getRelatedOrders(record).length === 0">-</div>
      </template>
    </template>
  </a-table>
  <!-- 会员详情 -->
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
  <!-- 响应体全文 -->
  <a-modal
    v-model:open="responseBodyOpen"
    :title="$t('n739')"
    :footer="null"
    width="800px"
  >
    <div class="responseBodyHead">
      <span>{{ $t('n2022') }}：{{ responseBodyItem.remark || '-' }}</span>
      <span>{{ $t('n738') }}：{{ responseBodyItem.httpCode ?? '-' }}</span>
      <a-button size="small" :icon="h(CopyOutlined)" @click="$copyId(responseBodyItem.responseBody)">{{ $t('m974') }}</a-button>
    </div>
    <pre class="responseBodyCode">{{ formatResponseBody(responseBodyItem.responseBody) }}</pre>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import { SearchOutlined, EyeOutlined, CopyOutlined } from "@ant-design/icons-vue";
import { kycSmsVerifyLogListPage, kycSmsVerifyLogOptions, kycSmsVerifyLogExport, getKycBankCodeList } from "@/api/kycConfig.api";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { kycSmsVerifySceneMap } from "@/utils/publicData";
import memberDetail from "@/components/Member/memberDetail.vue";
const { getTabH } = useTabHeight();
const { t, locale } = useI18n();
// 不带时间范围时后端会全量筛选，查询很慢，默认查当天
const getDefaultQuery = () => {
  const [startIndiaTime, endIndiaTime] = getStartAndEndOfDay();
  return {
    pageNo: 1,
    pageSize: 20,
    phoneNumber: undefined,
    memberId: undefined,
    orderNo: undefined,
    bankCode: undefined,
    smsVerifyScene: undefined,
    processFlag: undefined,
    operationTimeStart: startIndiaTime,
    operationTimeEnd: endIndiaTime,
  };
};
const query = ref<any>(getDefaultQuery());
// 最近一次列表查询实际使用的条件
const lastListQuery = ref<any>({});
// 交互明细每一步单独成行，单元格去掉内边距让各列的行对齐
const restResultCell = () => ({ class: 'restResultCell' });
const columns: any = [
  {
    title: t("m582"),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 110,
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 130,
  },
  {
    title: t("n328"),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
    width: 140,
  },
  {
    title: "OTP",
    dataIndex: "otp",
    key: "otp",
    align: "center",
    width: 90,
  },
  {
    title: t("n2019"),
    dataIndex: "smsVerifySceneDesc",
    key: "smsVerifySceneDesc",
    align: "center",
    width: 120,
  },
  {
    title: t("n2020"),
    dataIndex: "processFlag",
    key: "processFlag",
    align: "center",
    width: 90,
  },
  {
    title: t("n2021"),
    children: [
      {
        title: t("n2022"),
        dataIndex: "restResultsRemark",
        key: "restResultsRemark",
        align: "center",
        width: 180,
        customCell: restResultCell,
      },
      {
        title: t("n738"),
        dataIndex: "restResultsCode",
        key: "restResultsCode",
        align: "center",
        width: 80,
        customCell: restResultCell,
      },
      {
        title: t("n1924"),
        dataIndex: "restResultsSuccess",
        key: "restResultsSuccess",
        align: "center",
        width: 80,
        customCell: restResultCell,
      },
      {
        title: t("n739"),
        dataIndex: "restResultsBody",
        key: "restResultsBody",
        align: "center",
        width: 260,
        customCell: restResultCell,
      },
    ],
  },
  {
    title: t("l67"),
    dataIndex: "operationTime",
    key: "operationTime",
    align: "center",
    width: 160,
  },
  {
    title: t("n332"),
    dataIndex: "relatedOrder",
    key: "relatedOrder",
    align: "center",
    width: 280,
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
  api: kycSmsVerifyLogListPage,
  defaultPageSize: 20,
  fetchType: 2,
  filterRules: [],
  // 记下每次列表实际查询的条件，导出用它，保证和表格数据一致（筛选框改了没点搜索不算）
  handleQueryFields: (q: any) => {
    lastListQuery.value = { ...q };
    return q;
  },
});

const bankCodeList = ref([]);
const getBankCodeList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    bankCodeList.value = (res.data || []).map((item: any) => ({
      value: item,
      label: item,
    }));
  }
};
// 业务场景按 code 取多语言，前端未收录的新场景显示后端返回的 desc
const getSceneLabel = (code: any, desc: any) => {
  const key = kycSmsVerifySceneMap[code];
  return key ? t(key) : (desc || '-');
};
// 业务场景取后端枚举，按返回顺序展示
const sceneList = ref([]);
const getSceneList = async () => {
  const res: any = await kycSmsVerifyLogOptions();
  if (res && res.code === "1") {
    sceneList.value = (res.data?.smsVerifyScenes || []).map((item: any) => ({
      value: item.code,
      label: getSceneLabel(item.code, item.desc),
    }));
  }
};

// 按最近一次查询条件导出全部记录，不带分页参数；lang 控制表头语言（zh 为中文，其他为英文）
const handleExportQuery = (q: any) => {
  const { pageNo, pageSize, asc, ...params } = q;
  return { ...params, lang: locale.value };
};

// 会员详情
const detailModel = ref(false);
const detailId = ref({
  id: 0,
  memberId: 0,
});
const showMember = (id: any) => {
  detailModel.value = true;
  detailId.value.id = id;
};

// 关联订单号：买入、撮合、卖出订单号有值就展示，卖出订单号可能有多个
const getRelatedOrders = (record: any) => {
  const sellOrders = Array.isArray(record.sellOrders) ? record.sellOrders : [];
  return [
    { label: 'n41', value: record.platformOrder },
    { label: 'm807', value: record.matchOrder },
    ...sellOrders.map((value: any) => ({ label: 'n40', value })),
  ].filter((order) => order.value);
};

// 响应体全文弹窗
const responseBodyOpen = ref(false);
const responseBodyItem = ref<any>({});
const openResponseBody = (item: any) => {
  responseBodyItem.value = item;
  responseBodyOpen.value = true;
};
// 能解析成 JSON 的按缩进格式化展示；后端会截断过长的响应体，解析不了就原样展示
const formatResponseBody = (body: any) => {
  if (!body) return '-';
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch (e) {
    return body;
  }
};

onMounted(() => {
  getBankCodeList();
  getSceneList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.ant-picker-range-separator) {
  display: none;
}
:deep(.restResultCell) {
  padding: 0 !important;
}
// antd 加载中的按钮光标为 default，加载结束后鼠标不动时浏览器不会换回手形，这里保持手形
.search :deep(.ant-btn.ant-btn-loading) {
  cursor: pointer;
}
// 单元格内一行：文字超长省略，图标固定在右侧
.inlineLine {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 6px;
}
.inlineText {
  overflow: hidden;
  text-overflow: ellipsis;
}
.inlineIcon {
  flex-shrink: 0;
  cursor: pointer;
}
.responseBodyText {
  cursor: pointer;
  &:hover {
    color: var(--app-color-primary);
  }
}
.orderLabel {
  color: #999;
}
.responseBodyHead {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}
.responseBodyCode {
  max-height: 60vh;
  overflow: auto;
  margin: 0;
  padding: 12px;
  background: var(--app-color-surface-muted);
  border: 1px solid var(--app-color-border);
  border-radius: 4px;
  font-family: Menlo, Consolas, monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
