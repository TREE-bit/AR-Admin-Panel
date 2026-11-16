<template>
    <div class="search">
      <h2>{{ $getMenuName() }}</h2>
      <a-row style="margin: 0 0 15px 0">
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
            :placeholder="$t('n328')"
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
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            v-model:value="query.utr"
            :placeholder="'UTR'"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            v-model:value="query.recipient"
            :placeholder="$t('n1279') + '/' + $t('m652')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            v-model:value="query.ifscCode"
            :placeholder="'IFSC CODE'"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            class="searchstyle"
            v-model:value="query.cardOwnerName"
            :placeholder="$t('m610')"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="query.mode"
            :placeholder="$t('m67')"
            :options="Object.keys(externalChannellModMap).map(key => ({ value: Number(key), label: $t(externalChannellModMap[key]) }))"
          >
          </a-select>
        </a-col>
        <a-col>
          <timeRange v-model:startTime="query.transactionTimeStart" v-model:endTime="query.transactionTimeEnd"  :title="$t('m694')" :type="1"/>
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
        <template v-if="column.key === 'channelCode'">
          <a-tooltip v-if="record.channelCode">
            <template #title>
              <a-tag color="green" v-for="item in record.channelCode.split(',')" :key="item" style="margin-right:4px; margin-bottom:4px;">
                {{ item }}
                <CopyOutlined v-if="item" class="copyId"  @click="$copyId(item)" />
              </a-tag>
            </template>
            <div class="toopTipStyle2">
              <a-tag v-for="item in record.channelCode.split(',')" :key="item" style="margin-right:4px; margin-bottom:4px;">
                {{ item }}
                <CopyOutlined v-if="item" class="copyId"  @click="$copyId(item)" />
              </a-tag>
            </div>
          </a-tooltip>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'mode'">
          {{ record.mode ? $t(externalChannellModMap[record.mode]) : '-' }}
        </template>
      <template v-if="column.key === 'bankCode'">
        <a-tooltip v-if="record.bankCode">
          <template #title>
            {{ record.bankCode }}
            <CopyOutlined v-if="record.bankCode" class="copyId"  @click="$copyId(record.bankCode)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.bankCode }}
            <CopyOutlined v-if="record.bankCode" class="copyId"  @click="$copyId(record.bankCode)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'utr'">
        <a-tooltip v-if="record.utr">
          <template #title>
            {{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.utr }}
            <CopyOutlined v-if="record.utr" class="copyId"  @click="$copyId(record.utr)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'ifscCode'">
        <a-tooltip v-if="record.ifscCode">
          <template #title>
            {{ record.ifscCode }}
            <CopyOutlined v-if="record.ifscCode" class="copyId"  @click="$copyId(record.ifscCode)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.ifscCode }}
            <CopyOutlined v-if="record.ifscCode" class="copyId"  @click="$copyId(record.ifscCode)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'payer'">
        <a-tooltip v-if="record.payer">
          <template #title>{{ record.payer }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.payer }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'recipient'">
        <a-tooltip v-if="record.recipient">
          <template #title>{{ record.recipient }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.recipient }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'cardOwnerName'">
        <a-tooltip v-if="record.cardOwnerName">
          <template #title>{{ record.cardOwnerName }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.cardOwnerName }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      </template>
    </a-table>
  </template>
  <script lang="ts" setup>
  import { onMounted, ref, h } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import {
    extChannelKycAdminkKycWaterSuccessListPage,
    getKycBankCodeList,
  } from "@/api";
  import { useI18n } from "vue-i18n";
  import { externalChannellModMap } from "@/utils/publicData";
  import { getStartAndEndOfDay } from "@/plugins/dataMap";
  import { useTabHeight } from "@/hooks/useTabHeight.hooks";
  import { useTableData } from "@/hooks/useTableData.hook";
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
    cardOwnerName: undefined,
    ifscCode: undefined,
    bankCode: undefined,
    mode: undefined,
    payer: undefined,
    phoneNumber: undefined,
    recipient: undefined,
    utr: undefined,
    transactionTimeStart: startIndiaTime,
    transactionTimeEnd: endIndiaTime,
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
      title: t("n1278"),
      dataIndex: "channelCode",
      key: "channelCode",
      align: "center",
      width: 200,
    },
    {
      title: t("n328"),
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
      width: 120,
    },
    {
      title: t("n1280"),
      dataIndex: "payer",
      key: "payer",
      align: "center",
      width: 160,
    },
    {
      title: t("n916"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: 120,
    },
    {
      title: 'UTR',
      dataIndex: "utr",
      key: "utr",
      align: "center",
      width: 120,
    },
    {
      title: t("n1279"),
      dataIndex: "recipient",
      key: "recipient",
      align: "center",
      width: 160,
    },
    {
      title: 'IFSC CODE',
      dataIndex: "ifscCode",
      key: "ifscCode",
      align: "center",
      width: 120,
    },
    {
      title: t("m663"),
      dataIndex: "cardOwnerName",
      key: "cardOwnerName",
      align: "center",
      width: 140,
    },
    {
      title: t("m67"),
      dataIndex: "mode",
      key: "mode",
      align: "center",
      width: 120,
    },
    {
      title: t("n1510"),
      dataIndex: "originalStatus",
      key: "originalStatus",
      align: "center",
      width: 120,
    },
    {
      title: t("m694"),
      dataIndex: "transactionTime",
      key: "transactionTime",
      align: "center",
      width: 150,
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
    api: extChannelKycAdminkKycWaterSuccessListPage,
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
  