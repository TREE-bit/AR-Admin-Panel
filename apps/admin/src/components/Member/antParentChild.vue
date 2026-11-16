<template>
    <div class="search">
      <h2>{{ props.memberId }}</h2>
      <a-row>
        <!-- <a-col :span="3">
          <a-input v-trim
          class="searchstyle"
          :placeholder="$t('m562')+$t('c9')"
          :disabled="Boolean(props.memberId)"
          v-model:value="query.memberId"
        />
        </a-col> -->
        <!-- <a-col :span="3">
          <a-select
            v-model:value="query.antLevelGroup"
            class="searchstyle"
            :placeholder="$t('m562')+$t('n513')"
            :options="Object.entries(groupIdMap).map(([key, value]) => ({
              label: value,
              value: key,
            }))"
          />
        </a-col> -->
        <!-- <a-col :span="3">
          <a-input-number
          class="searchstyle"
          :placeholder="$t('m562')+$t('m880')"
          v-model:value="query.agentLevel"
        >
          <template #addonBefore>L</template>
        </a-input-number>
        </a-col> -->
        <!-- <a-col >
          <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('m883')" :type="1"/>
        </a-col> -->
        <!-- <a-col>
          <a-button type="primary" :icon="h(SearchOutlined)" @click="getData(1)">{{
            $t("search")
          }}</a-button>
          <a-button type="primary" :loading="loading" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
        <a-button
          type="primary"
          @click="exportList"
          :loading="loading"
          v-permission="'admin:antMemberInfoAdmin:export'"
          >{{ $t("export") }}</a-button
        >
        </a-col> -->
      </a-row>
    </div>
    <a-table
      :dataSource="dataList"
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
        <a-button type="default" 
        :disabled="!record.antUpperLevelId && !record.allSubordinateCount" size="small" 
        @click="showAgent(record.memberId)"
        >{{ $t("展开") }}</a-button>
        <a-button type="default" size="small" @click="goPath(record.memberId)">{{ $t("分组") }}</a-button>
      </template>
    </template>
    </a-table>
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
  <a-modal
    v-model:open="agentModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
    >
    <AgentLevel 
      v-if="reoModel"
      :memberId="memberId"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h, computed } from "vue";
import {
  antMemberInfoAdminLevelRelationShip
} from "@/api/menber";
import { antMemberInfoAdminExport } from "@/api/export";
import { useI18n } from "vue-i18n";
import { groupIdMap, antConversionTypeMap } from "@/utils/publicData";
import MemberDetail from "@/components/Member/memberDetail.vue";
import AgentLevReo from "@/views/member/agentLevReo.vue";
import AgentLevel from "@/views/member/agentLevel.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
const props = defineProps({
  memberId: {
    type: Number,
    default: undefined,
  },
});
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
const columns = [
  {
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
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
    // sorter: true,
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
    // sorter: true,
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
];
const loading = ref(false);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const query = ref({
  asc: true,
  column: "",
  pageNo: 1,
  pageSize: 20,
  memberId: props.memberId,
  agentLevel: undefined,
  antLevelGroup: undefined,
  memberAccount: undefined,
  startTime: startIndiaTime,
  endTime: endIndiaTime,
});
const dataList = ref([]);
const getData = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  pagination.value.pageSize = query.value.pageSize;
  pagination.value.current = query.value.pageNo;
  const res = await antMemberInfoAdminLevelRelationShip(query.value).finally(() => loading.value = false);
  if (res.code == "1") {
    dataList.value = res.data.list;
    pagination.value.total = res.data.total;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getData();
};
const resetQuery = () => {
  query.value = {
    asc: true,
    column: "",
    pageNo: 1,
    pageSize: 20,
    memberId: props.memberId,
    agentLevel: undefined,
    antLevelGroup: undefined,
    memberAccount: undefined,
    startTime: '',
    endTime: '',
  };
  pagination.value.current = 1;
  pagination.value.pageSize = 20;
  getData();
};
const agentModel = ref(false);
const showAgent = async (value: any) => {
  memberId.value = value;
  agentModel.value = true;
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
  getData();
  getTabH.value = useTabHeight(4).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
