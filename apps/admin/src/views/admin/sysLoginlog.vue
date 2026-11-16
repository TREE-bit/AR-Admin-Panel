<template>
  <div class="search">
    <h2>{{ $t("m943") }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.userId"
          :placeholder="$t('m181')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.username"
          :placeholder="$t('m562')+$t('m947')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.merchantCode"
          :placeholder="$t('m562')+$t('n9')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.userType"
          :placeholder="$t('m563')+$t('m946')"
          :allowClear="true"
          :options="Object.entries(userTypeMap).map(([key, value]:[any,any]) => ({ value: key, label: value, }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.loginStatus"
          :placeholder="$t('m563')+$t('m186')"
          :allowClear="true"
          :options="Object.entries(loginStatusMap).map(([key, value]:[any,any]) => ({ value: key, label: value, }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.ipAddress"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m945')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.device"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m189')"
        />
      </a-col>
      <a-col>
        <!-- <a-range-picker
          show-time
          class="searchstyle"
          v-model:value="searchDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m195')]"
        /> -->
        <timeRange v-model:startTime="query.startLoginTime" v-model:endTime="query.endLoginTime"  :title="$t('m188')" :type="1"/>
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
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'userType'">
        {{ userTypeMap[record.userType] }}
      </template>
      <template v-if="column.key === 'loginStatus'">
        {{ loginStatusMap[record.loginStatus] }}
      </template>
      <template v-if="column.key === 'username'">
        <a-tooltip>
          <template #title>{{ record.username }}</template>
          <div class="toopTipStyle">{{ record.username }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'merchantCode'">
        <a-tooltip>
          <template #title>{{ record.merchantCode }}</template>
          <div class="toopTipStyle">{{ record.merchantCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'ipAddress'">
        <a-tooltip>
          <template #title>{{ record.ipAddress }}</template>
          <div class="toopTipStyle">{{ record.ipAddress }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'userAgent'">
        <a-tooltip>
          <template #title>{{ record.userAgent }}</template>
          <div class="toopTipStyle">{{ record.userAgent }}</div>
        </a-tooltip>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { adminLogListPage } from "@/api/menber";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const dataSource = ref([]);
const loading = ref(false);
const query = ref({
  pageNo: 1,
  pageSize: 50,
  userId: undefined,
  username: undefined,
  device: undefined,
  loginStatus: undefined,
  userType: undefined,
  merchantCode: undefined,
  ipAddress: undefined,
  startLoginTime: startIndiaTime,
  endLoginTime: endIndiaTime,
});
const loginStatusMap={
  1:t('m619'),
  2:t('m618')
}
const userTypeMap={
  1:t('m253'),
  2:t('m254'),
  3:t('m948'),
}
const columns:any = [
  {
    title: t("m184"),
    align: "center",
    dataIndex: "userId",
    key: "userId",
    width: 100,
  },
  {
    title: t("m947"),
    dataIndex: "username",
    key: "username",
    align: "center",
    width: 140,
  },
  {
    title: t("n9"),
    dataIndex: "merchantCode",
    key: "merchantCode",
    align: "center",
    width: 140,
  },
  {
    title: t("m946"),
    dataIndex: "userType",
    key: "userType",
    align: "center",
    width: 140,
  },
  {
    title: t("m186"),
    dataIndex: "loginStatus",
    key: "loginStatus",
    align: "center",
    width: 140,
  },
  {
    title: t("m945"),
    dataIndex: "ipAddress",
    key: "ipAddress",
    align: "center",
    width: 160,
  },
  {
    title: t("m188"),
    dataIndex: "loginTime",
    key: "loginTime",
    align: "center",
    width: 160,
  },
  {
    title: t("m189"),
    dataIndex: "device",
    key: "device",
    align: "center",
    width: 160,
  },
  {
    title: t("m944"),
    dataIndex: "userAgent",
    key: "userAgent",
    align: "center",
    width: 180,
  },
];
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 50,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async (isFirst:any =null) => {
  if(isFirst){
    query.value.pageNo =1;
    pagination.value.current = 1;
  }
  loading.value = true;
  pagination.value.current= query.value.pageNo;
  pagination.value.pageSize = query.value.pageSize;
  const res: any = await adminLogListPage(query.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.value.total = res.total;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  getList();
};
const resetQuery = () => {
  query.value = {
    pageNo: 1,
    pageSize: 50,
    userId: undefined,
    username: undefined,
    device: undefined,
    loginStatus: undefined,
    userType: undefined,
    merchantCode: undefined,
    ipAddress: undefined,
    startLoginTime: '',
    endLoginTime: '',
  };
  pagination.value.current = 1;
  pagination.value.pageSize = 50;
  getList();
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.ant-picker-range-separator) {
  display: none;
}
</style>
