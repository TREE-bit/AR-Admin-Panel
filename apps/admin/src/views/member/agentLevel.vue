<template>
    <div class="search">
      <h2>{{ $t('n544') }}</h2>
      <a-row>
        <a-col :span="3">
          <a-input v-trim
          class="searchstyle"
          allow-clear
          :placeholder="$t('m562')+$t('c9')"
          v-model:value="query.memberId"
        />
        </a-col>
        <a-col :span="3">
          <a-select
            v-model:value="query.notLoginDays"
            class="searchstyle"
            :placeholder="$t('m563')+$t('n1592')"
            :options="Object.entries(notLoginDaysMap).map(([key, value]) => ({
              label: value,
              value: Number(key),
            }))"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
          class="searchstyle"
          allow-clear
          :placeholder="$t('m562')+$t('m630')"
          v-model:value="query.invitationCode"
        />
        </a-col>
        <a-col :span="3">
          <a-select
            v-model:value="query.antLevelGroup"
            class="searchstyle"
            :placeholder="$t('m563')+$t('n513')"
            :options="Object.entries(groupIdMap).map(([key, value]) => ({
              label: value,
              value: key,
            }))"
          />
        </a-col>
        <a-col :span="3">
          <a-input-number
          class="searchstyle"
          :placeholder="$t('m562')+$t('m880')"
          v-model:value="query.agentLevel"
        >
          <template #addonBefore>L</template>
        </a-input-number>
        </a-col>
        <a-col :span="3">
          <a-select
            v-model:value="query.conversionType"
            class="searchstyle"
            :placeholder="$t('m563')+$t('n539')"
            :options="Object.entries(antConversionTypeMap).map(([key, value]) => ({
              label: value,
              value: key,
            }))"
        />
        </a-col>
        <a-col >
          <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('n538')" :type="1"/>
        </a-col>
        <a-col>
          <a-button type="primary" :icon="h(SearchOutlined)" @click="getList(1)">{{
            $t("search")
          }}</a-button>
          <a-button type="primary" :loading="loading" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
        <ExportButton
          :query="query"
          :api="antMemberInfoAdminExport"
          permission="admin:antMemberInfoAdmin:export"
        />
        <!-- <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:antMemberInfoAdmin:export'"
          >{{ $t("export") }}</a-button
        > -->
        </a-col>
      </a-row>
    </div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="pagination"
      :scroll="{ x: '100%' , y :getTabH+'px'}"
      :loading="loading"
      @change="handleTableChange"
      bordered
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record.memberId)"
          >{{ record.memberId }}</a-button
        >
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'antUpperLevelId'">
        <a-button
          v-if="record.antUpperLevelId"
          style="padding: 0px"
          type="link"
          @click="showDetail(record.antUpperLevelId)"
          >{{ record.antUpperLevelId }}</a-button
        >
        <CopyOutlined v-if="record.antUpperLevelId" class="copyId"  @click="$copyId(record.antUpperLevelId)" />
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'lastLoginTime'">
        {{ record.lastLoginTime || "-" }}
      </template>
      <template v-if="column.key === 'notLoginDays'">
        <span :style="record.notLoginDays > 10 ? 'color:red' : 
                      record.notLoginDays == 10 ? 'color:#fb4b04e0' : 
                      record.notLoginDays >= 7 ? 'color:#e67511' :
                      record.notLoginDays >= 3 ? 'color:#b48e27e0' : ''">
          {{ $t('n1593',{n:record.notLoginDays?record.notLoginDays:0}) }}
        </span>
      </template>
      <template v-if="column.key === 'invitationCode'">
        <a-tooltip v-if="record.invitationCode">
          <template #title>
            {{ record.invitationCode }}
            <CopyOutlined v-if="record.invitationCode " class="copyId"  @click="$copyId(record.invitationCode)" />
          </template>
          <div class="toopTipStyle">
            {{ record.invitationCode }}
            <CopyOutlined v-if="record.invitationCode " class="copyId"  @click="$copyId(record.invitationCode)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'agentLevel'">
        L{{ record.agentLevel }}
      </template>
      <template v-if="column.key === 'antLevelGroup'">
        {{ $getMapItem(groupIdMap, record.antLevelGroup) || "-" }}
      </template>
      <template v-if="column.key === 'antConversionType'">
        {{ $getMapItem(antConversionTypeMap, record.antConversionType) || "-" }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || "-" }}
      </template>
      <template v-if="column.key === 'antConversionTime'">
        {{ record.antConversionTime || "-" }}
      </template>
      <template v-if="column.key === 'totalCommissionAmount'">
        <a-button type="link" :disabled="!record.totalCommissionAmount" @click="showReocord(record.memberId)">
          {{ record.totalCommissionAmount || "0.00" }}
        </a-button>
      </template>
      <template v-if="column.key === 'operation'">
        <a-button type="default" size="small" 
        @click="showAgent(record.memberId)"
        >{{ $t("m159") }}</a-button>
        <a-button type="default" size="small" @click="showGrouping(record)">{{ $t("分组") }}</a-button>
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
    <MemberDetail 
    v-if="detailModel"
      :memberID="memberId"
      :id="memberId"
    />
  </a-modal>
  <!-- 返佣记录 -->
  <a-modal
    v-model:open="reoModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
    >
    <AgentLevReo 
      v-if="reoModel"
      :memberId="memberId"
    />
  </a-modal>
  <!-- 展开 -->
  <a-modal
    v-model:open="agentModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
    >
    <AntParentChild 
      v-if="agentModel"
      :memberId="memberId"
    />
  </a-modal>
  <!-- 分组 -->
  <a-modal
    v-model:open="groupingModel"
    :footer="null"
    width="300px"
    @cancel="groupingCancel"
    >
    <h3 style="text-align: center;margin-bottom: 15px;">{{ $t('n616') }}</h3>
    <a-select
      v-model:value="groupingForm.antLevelGroup"
      style="width: 100%;"
      :placeholder="$t('m562')+$t('n513')"
      :options="Object.entries(groupIdMap).filter(([key]) => Number(key) != 0).map(([key, value]) => ({
        label: value,
        value: Number(key),
      }))"
      >
    </a-select>
    <div slot="footer" style="text-align: right; margin-top: 10px;">
        <a-button type="primary" :loading="loading" @click="groupingSubmit">{{ $t('save') }}</a-button>
        <a-button @click="groupingCancel" style="margin-left: 10px;">{{ $t('cancel') }}</a-button>
      </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h, computed } from "vue";
import {
  getAntMemberInfoList,
  antMemberInfoAdminSetAntGroup,
} from "@/api/menber";
import { antMemberInfoAdminExport } from "@/api/export";
import { useI18n } from "vue-i18n";
import { groupIdMap, antConversionTypeMap } from "@/utils/publicData";
import MemberDetail from "@/components/Member/memberDetail.vue";
import AgentLevReo from "@/views/member/agentLevReo.vue";
import AntParentChild from "@/components/Member/antParentChild.vue";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
const route = useRoute(); 
const router = useRouter();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
const detailModel = ref(false);
const reoModel = ref(false);
const detailId = ref<any>({});
const memberId = ref(0);
const showDetail = async (value: any) => {
  memberId.value = value;
  detailModel.value = true;
};
const showReocord = async (value: any) => {
  memberId.value = value;
  reoModel.value = true;
}
const notLoginDaysMap: any = {
  '3': t("n1593",{n: 3}),
  '7': t("n1593",{n: 7}),
  '10': t("n1593",{n: 10}),
  '-1': t("n1594"),
};
const columns:any = [
  {
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: t('m432'),
    dataIndex: "lastLoginTime",
    key: "lastLoginTime",
    align: "center",
    width: 140,
  },
  {
    title: t('n1592'),
    dataIndex: "notLoginDays",
    key: "notLoginDays",
    sorter: true,
    align: "center",
    width: 180,
  },
  {
    title: t('m630'),
    dataIndex: "invitationCode",
    key: "invitationCode",
    align: "center",
    width: 180,
  },
  {
    title: t('m878'),
    dataIndex: "memberAccount",
    key: "memberAccount",
    align: "center",
    width: 120,
  },
  {
    title: t('n513'),
    dataIndex: "antLevelGroup",
    key: "antLevelGroup",
    align: "center",
    width: 120,
  },
  {
    title: t('m879'),
    dataIndex: "antUpperLevelId",
    key: "antUpperLevelId",
    align: "center",
    width: 120,
  },
  {
    title: t('m880'),
    dataIndex: "agentLevel",
    key: "agentLevel",
    align: "center",
    width: 120,
  },
  {
    title: t('m881'),
    dataIndex: "directSubordinateCount",
    key: "directSubordinateCount",
    align: "center",
    sorter: true,
    width: 120,
  },
  {
    title: t('m882'),
    dataIndex: "allSubordinateCount",
    key: "allSubordinateCount",
    align: "center",
    // sorter: true,
    width: 120,
  },
  {
    title: t('m875'),
    dataIndex: "totalCommissionAmount",
    key: "totalCommissionAmount",
    align: "center",
    sorter: true,
    width: 140,
  },
  {
    title: t('m883'),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 140,
  },
  {
    title: t('n538'),
    dataIndex: "antConversionTime",
    key: "antConversionTime",
    align: "center",
    width: 140,
  },
  {
    title: t('n539'),
    dataIndex: "antConversionType",
    key: "antConversionType",
    align: "center",
    width: 140,
  },
  {
    title: t('operation'),
    dataIndex: "operation",
    key: "operation",
    align: "center",
    width: 140,
  },
];
// const loading = ref(false);
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const query = ref({
  asc: false,
  column: "",
  pageNo: 1,
  pageSize: 20,
  memberId: undefined,
  agentLevel: undefined,
  antLevelGroup: undefined,
  memberAccount: undefined,
  conversionType: undefined,
  notLoginDays: undefined,
  invitationCode: undefined,
  startTime: startIndiaTime,
  endTime: endIndiaTime,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});

const {
  dataSource,
  extendData,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: getAntMemberInfoList,
  defaultPageSize: 20,
  resDataType: 2,
  filterRules: [
    { key: "directSubordinateCount" },
    { key: "totalCommissionAmount" },
  ],
  // afterFetch: (data) =>
  // data.map((item: any) => {
  //   item.failureType = item.failureType ? item.failureType : 2;
  //   return item;
  // }),
});
const agentModel = ref(false);
const showAgent = async (value: any) => {
  memberId.value = value;
  agentModel.value = true;
  selectedRow();
};
// 分组
const groupingModel = ref(false);
const groupingForm = ref({
  memberId: undefined,
  antLevelGroup: undefined,
});
const showGrouping = async (value: any) => {
  const { memberId, antLevelGroup } = value;
  groupingForm.value = {
    memberId: memberId,
    antLevelGroup: antLevelGroup,
  };
  groupingModel.value = true;
  selectedRow();
};
const groupingSubmit = async () => {
  if (!groupingForm.value.antLevelGroup) {
    message.error(t('m562') + t('n513'));
    return;
  }
  loading.value = true;
  const res:any = await antMemberInfoAdminSetAntGroup(groupingForm.value).finally(() => loading.value = false);
  if (res.code === '1') {
    message.success(t('s1'));
    getList();
    groupingCancel();
  }
};
const groupingCancel = () => {
  groupingModel.value = false;
  groupingForm.value = {
    memberId: undefined,
    antLevelGroup: undefined,
  };
};
const goPath = (id: number) => {
  router.push({name:'_member_agentLevReo', query: {id: id}})
}
const exportList = async () => {
  loading.value = true;
  antMemberInfoAdminExport(query.value).finally(() => {
    loading.value = false;
  });
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
