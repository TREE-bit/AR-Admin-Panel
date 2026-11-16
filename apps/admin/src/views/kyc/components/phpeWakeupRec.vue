<template>
    <div class="search">
      <a-row style="margin: 0 0 15px 0">
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.buyMemberId"
            class="searchstyle"
            :placeholder="$t('m562')+$t('m149')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            v-model:value="query.matchOrderNo"
            :placeholder="$t('m562')+$t('m807')"
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
        <!-- <a-col :span="3">
          <a-select
            class="searchstyle"
            allowClear
            :placeholder="$t('m563')+$t('n853')"
            v-model:value="query.wakeupStatus"
            :options="[
              { value: 0, label: $t('m618') },
              { value: 1, label: $t('m619') }
            ]"
          >
          </a-select>
        </a-col> -->
        <a-col>
          <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd"  :title="$t('l67')" :type="1"/>
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
          <!-- <a-button type="primary" @click="exportList"     v-permission="'admin:paymentOrderAdmin:export'">{{
            $t("export")
          }}</a-button> -->
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
        <template v-if="column.key === 'buyMemberId'">
          <a-button v-if="record.buyMemberId" type="link" class="copyContent" @click="showMember(record.buyMemberId)">{{
            record.buyMemberId
          }}</a-button>
          <CopyOutlined v-if="record.buyMemberId" class="copyId"  @click="$copyId(record.buyMemberId)" />
          <span v-else>-</span>
        </template>
      <template v-if="column.key === 'wakeupStatus'">
        {{
          record.wakeupStatus == 1 ? $t('m619') : record.wakeupStatus == 0 ? $t('m618') : '-'
        }}
      </template>
      <template v-if="column.key === 'matchOrderNo'">
        <a-tooltip v-if="record.matchOrderNo">
          <template #title>
            {{ record.matchOrderNo }}
            <CopyOutlined v-if="record.matchOrderNo" class="copyId"  @click="$copyId(record.matchOrderNo)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.matchOrderNo }}
            <CopyOutlined v-if="record.matchOrderNo" class="copyId"  @click="$copyId(record.matchOrderNo)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'wakeupFailReason'">
        <a-tooltip v-if="record.wakeupFailReason">
          <template #title>{{ record.wakeupFailReason }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.wakeupFailReason }}</div>
        </a-tooltip>
        <span v-else>-</span>
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
        :memberID="detailId.buyMemberId"
        :id="detailId.id"
      />
    </a-modal>
  </template>
  <script lang="ts" setup>
  import { onMounted, ref, h } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import {
    wakeupRecordAdminPage,
    getKycBankCodeList,
  } from "@/api";
  import { useI18n } from "vue-i18n";
  import memberDetail from "@/components/Member/memberDetail.vue";
  import { getStartAndEndOfDay } from "@/plugins/dataMap";
  import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
// import { useMerchantStore } from "@/stores/useMerchantStore";
// const merchantList = computed(() => useMerchantStore().merchantList);
  const { getTabH } = useTabHeight();
  const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
  const { t } = useI18n();
  const detailModel = ref(false);
  const detailId = ref({
    id: 0,
    buyMemberId: 0,
  });
  const query = ref({
    asc: false,
    column: "",
    pageNo: 1,
    pageSize: 20,
    buyMemberId: undefined,
    matchOrderNo: undefined,
    bankCode: undefined,
    // wakeupStatus: undefined,
    createTimeStart: startIndiaTime,
    createTimeEnd: endIndiaTime,
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
      title: t("m149"),
      dataIndex: "buyMemberId",
      key: "buyMemberId",
      align: "center",
      width: 100,
    },
    {
      title: t("m807"),
      dataIndex: "matchOrderNo",
      key: "matchOrderNo",
      align: "center",
      width: 200,
    },
    {
      title: t("m582"),
      dataIndex: "bankCode",
      key: "bankCode",
      align: "center",
      width: 140,
    },
    {
      title: t("l67"),
      dataIndex: "operationTime",
      key: "operationTime",
      align: "center",
      width: 150,
    },
  ];
  const showMember = (id: any) => {
    detailModel.value = true;
    detailId.value.id = id;
  };
const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: wakeupRecordAdminPage,
  defaultPageSize: 20,
  filterRules: [],
});

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
  getTabH.value = useTabHeight(3,40).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
  