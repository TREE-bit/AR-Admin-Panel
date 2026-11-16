<template>
    <div class="search">
      <h2>{{ $getMenuName() }}</h2>
      <a-row style="margin: 0 0 15px 0">
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.extChannelName"
            class="searchstyle"
            :placeholder="$t('n1276')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.extChannelCode"
            class="searchstyle"
            :placeholder="$t('n1278')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            v-model:value="query.phoneNumber"
            :placeholder="$t('l35')"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="query.bankCode"
            :placeholder="$t('m582')"
          >
            <a-select-option
              v-for="(item) in groupList"
              :value="item"
              :key="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col>
          <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd"  :title="$t('l70')" :type="1"/>
        </a-col>
        <a-col>
          <timeRange v-model:startTime="query.lastPullTimeStart" v-model:endTime="query.lastPullTimeEnd"  :title="$t('m809')" :type="1"/>
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
      <template v-if="column.key === 'extChannelName'">
        <a-tooltip v-if="record.extChannelName">
          <template #title>
            {{ record.extChannelName }}
            <CopyOutlined v-if="record.extChannelName" class="copyId"  @click="$copyId(record.extChannelName)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.extChannelName }}
            <CopyOutlined v-if="record.extChannelName" class="copyId"  @click="$copyId(record.extChannelName)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'linkStatus'">
        <span class="arbListTag">
          <span class="pointTag" :class="record.linkStatus === 1 ? 'pointTag-green' : 'pointTag-red'"></span>
          {{ record.linkStatus === 1 ? $t('m595') : $t('m594') }}
        </span>
      </template>
      <template v-if="column.key === 'extChannelCode'">
        <a-tooltip v-if="record.extChannelCode">
          <template #title>
            {{ record.extChannelCode }}
            <CopyOutlined v-if="record.extChannelCode" class="copyId"  @click="$copyId(record.extChannelCode)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.extChannelCode }}
            <CopyOutlined v-if="record.extChannelCode" class="copyId"  @click="$copyId(record.extChannelCode)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'bankCode'">
        <a-tooltip v-if="record.bankCode">
          <template #title>{{ record.bankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankCode }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'phoneNumber'">
        <a-tooltip v-if="record.phoneNumber">
          <template #title>{{ record.phoneNumber }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.phoneNumber }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'token'">
        <a-tooltip v-if="record.token" :overlayStyle="{ width: 'auto', maxWidth: 'none' }">
          <template #title>
            <div style="width: 440px;height: 200px;overflow-y: auto;">
              {{ record.token }}
            </div>
          </template>
          <div class=toopTipStyle3>
            {{ record.token }}
          </div>
        </a-tooltip>
        <div v-else>-</div>
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'lastPullTime'">
        {{ record.lastPullTime || '-' }}
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
    extChannelKycAdminKycPendingListPage,
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
    extChannelCode: undefined,
    extChannelName: undefined,
    phoneNumber: undefined,
    bankCode: undefined,
    // wakeupStatus: undefined,
    createTimeStart: startIndiaTime,
    createTimeEnd: endIndiaTime,
    lastPullTimeStart: '',
    lastPullTimeEnd: '',
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
      title: t("n1276"),
      dataIndex: "extChannelName",
      key: "extChannelName",
      align: "center",
      width: 120,
    },
    {
      title: t("n1278"),
      dataIndex: "extChannelCode",
      key: "extChannelCode",
      align: "center",
      width: 120,
    },
    {
      title: t("l35"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      width: 120,
    },
    {
      title: t("m582"),
      dataIndex: "bankCode",
      key: "bankCode",
      align: "center",
      width: 140,
    },
    {
      title: t("n727"),
      dataIndex: "linkStatus",
      key: "linkStatus",
      align: "center",
      width: 140,
    },
    {
      title: t("l70"),
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 150,
    },
    {
      title: t("m810"),
      dataIndex: "successPullTimes",
      key: "successPullTimes",
      align: "center",
      width: 150,
    },
    {
      title: t("m809"),
      dataIndex: "lastPullTime",
      key: "lastPullTime",
      align: "center",
      width: 150,
    },
    {
      title: 'Token',
      dataIndex: "token",
      key: "token",
      align: "center",
      width: 400,
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
    api: extChannelKycAdminKycPendingListPage,
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
  