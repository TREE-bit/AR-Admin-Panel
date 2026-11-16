<template>
  <div class="search">
    <h2>{{ $t("m493") }}</h2>
    <a-row style="margin: 0 0 15px 0">
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('m181')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.tradeType"
          :placeholder="$t('m517')"
        >
          <a-select-option
            v-for="(item, key) in tradeTypeMap"
            :value="key"
            :key="item"
            >{{ $t(item) }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.eventType"
          :placeholder="$t('m518')"
        >
          <a-select-option
            v-for="(item, key) in eventTypeMap"
            :value="key"
            :key="item"
            >{{ $t(item) }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.changeType"
          :placeholder="$t('m519')"
        >
          <a-select-option
            v-for="(item, key) in scoreStateMap"
            :value="key"
            :key="item"
            >{{ $t(item) }}</a-select-option
          >
        </a-select>
      </a-col>
      <!-- <a-col :span="5">
        <a-range-picker
          show-time
          v-model:value="paymentTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m66')]"
        />
      </a-col> -->
      <a-col >
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" title="" :type="1"/>
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
    :loading="loading"
    @change="handleTableChange"
    :scroll="{ x: '100%',y: getTabH+'px' }"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'tradeType'">
        {{ $t(tradeTypeMap[record.tradeType]) + '-' + $t(eventTypeMap[record.eventType])}}
      </template>
      <template v-if="column.key === 'id'">
        <a-button
          type="link"
          @click="showDetail(record)"
          >{{ record.id }}</a-button
        >
      </template>
      <template v-if="column.key === 'changeScore'">
        {{ record.changeScore > 0 ? '+' + record.changeScore : record.changeScore }}
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
    :memberID="detailId.memberId"
    :id="detailId.id"
  />
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { creditScoreLogsAdminListPageList } from "@/api/userlevel.api";
import { useI18n } from "vue-i18n";
import{ tradeTypeMap , eventTypeMap } from '@/utils/publicData';
import MemberDetail from "@/components/Member/memberDetail.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
const dataSource = ref([]);
const loading = ref(false);
const detailModel = ref(false);
const detailId = ref<any>({});
const query = ref({
  asc: true,
  column: "",
  endTime:endIndiaTime,
  startTime: startIndiaTime,
  memberId: "",
  changeType: null,
  eventType: null,
  tradeType: null,
  pageNo: 1,
  pageSize: 20,
});
const scoreStateMap = <any>{
  1: t('m512'),
  2: t('m513'),
}
const columns:any = [
  {
    title: t("e47"),
    align: "center",
    width: 80,
    customRender: ({ index }) => index + 1,
  },
  {
    title: t("m514"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 200,
  },
  {
    title: t("m184"),
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: t("type"),
    dataIndex: "tradeType",
    key: "tradeType",
    align: "center",
    width: 250,
  },
  {
    title: t("m500"),
    dataIndex: "changeScore",
    key: "changeScore",
    align: "center",
    width: 130,
  },
  {
    title: t("m515"),
    dataIndex: "beforeScore",
    key: "beforeScore",
    align: "center",
    width: 200,
  },
  {
    title: t("m516"),
    dataIndex: "afterScore",
    key: "afterScore",
    align: "center",
    width: 200,
  },
];
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const search = () => {
  pagination.value.current = 1;
  query.value.pageNo = 1;
  getList(query.value)
}
const getList = async (query: any) => {
  loading.value = true;
  pagination.value.pageNo = query.pageNo;
  pagination.value.pageSize = query.pageSize;
  const res: any = await creditScoreLogsAdminListPageList(Object.assign(query)).catch((err)=>{loading.value = false;});
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.value.total = res.total;
    loading.value = false;
  }else{
    loading.value = false;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  getList(
    Object.assign({}, query.value, {
      pageSize: pag.pageSize,
      pageNo: pag?.current,
    })
  );
};
const resetQuery = () => {
  query.value = {
    asc: true,
    column: "",
    endTime: "",
    startTime: "",
    memberId: "",
    changeType: null,
    eventType: null,
    tradeType: null,
    pageNo: 1,
    pageSize: 20,
  };
  pagination.value.pageSize = 20;
  pagination.value.current =1;
  getList(query.value);
};
const paymentTime = computed({
  get: () => {
    return [query.value.startTime, query.value.endTime];
  },
  set: (val) => {
    query.value.startTime = val ? val[0] : "";
    query.value.endTime = val ? val[1] : "";
  },
});

const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value = { id, memberId };
  detailModel.value = true;
};
onMounted(() => {
  getList(query.value);
  getTabH.value = useTabHeight().getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.windActive){
  font-weight: 600;
  color: red;
}
</style>
