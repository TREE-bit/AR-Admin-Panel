<template>
  
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
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
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.upiId"
          class="searchstyle"
          :placeholder="$t('m562')+'UPI ID'"
        />
      </a-col> -->
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.linkStatus"
          :placeholder="$t('m563')+$t('m186')"
        >
          <a-select-option value="0" key="0" >{{ $t('n1525') }}</a-select-option>
          <a-select-option value="1" key="1" >{{ $t('n959') }}</a-select-option>
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.grantedPermissions"
          :placeholder="$t('m563')+$t('n1526')"
        >
          <a-select-option value="0" key="0" >{{ $t('no') }}</a-select-option>
          <a-select-option value="1" key="1" >{{ $t('yes') }}</a-select-option>
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.autoSellEnabled"
          :placeholder="$t('m563')+$t('m593')"
        >
          <a-select-option value="0" key="0" >{{ $t('l54') }}</a-select-option>
          <a-select-option value="1" key="1" >{{ $t('l53') }}</a-select-option>
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.autoBuyEnabled"
          :placeholder="$t('m563')+$t('memberListC15')"
        >
          <a-select-option value="0" key="0" >{{ $t('l54') }}</a-select-option>
          <a-select-option value="1" key="1" >{{ $t('l53') }}</a-select-option>
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.deleted"
          :placeholder="$t('m563')+$t('m832')"
          :options="Object.entries(deletedMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
        >
        </a-select>
      </a-col> -->
      <!-- <a-col>
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('l50')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.lastLinkTimeStart" v-model:endTime="query.lastLinkTimeEnd" :title="$t('n1639')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.autoBuyEnabledTimeStart" v-model:endTime="query.autoBuyEnabledTimeEnd" :title="$t('n1640')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.autoSellEnabledTimeStart" v-model:endTime="query.autoSellEnabledTimeEnd" :title="$t('n1641')" :type="1"/>
      </a-col> -->
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
        <a-tooltip>
          <template #title>{{ record.bankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'phoneNumber'">
        <a-tooltip>
          <template #title>{{ record.phoneNumber }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.phoneNumber }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'unbanFlag'">
        {{ record.unbanFlag == 0 ? $t('n1702') : $t('n1703')  }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.updateTime || record.createTime  || '-' }}
      </template>
      <template v-if="column.key === 'updateBy'">
        {{ record.updateBy || record.createBy || '-' }}
      </template>
      <template v-if="column.key === 'unbanTime'">
        {{ record.unbanTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <!-- 启用 -->
        <a-popconfirm
          :ok-text="$t('b28')"
          :cancel-text="$t('b10')"
          @confirm="handleUnban(record)"
        >
          <template #icon><a-icon type="question-circle" style="color: red" /></template>
          <template #title>
            <h3 style="text-align: center">{{ $t('n1701') }}</h3>
            <div><span style="color: red">*</span>{{ $t('remark') }}</div>
            <a-textarea  v-model:value="unBanRemark" v-trim style="width: 300px;" :rows="4" :maxlength="200" :placeholder="$t('m562') + $t('remark')"></a-textarea>
            <!-- v-model:value="selectedValues" -->
            <!-- <a-checkbox-group >
              <div class="checkbox-grid">
                <a-checkbox :value="1">{{ $t('解除绑定') }}</a-checkbox>
                <a-checkbox :value="2">{{ $t('解除绑定，并拉黑手机号') }}</a-checkbox>
              </div>
            </a-checkbox-group> -->
          </template>

          <a-tag
            :color="'rgba(14, 186, 139, 1)'"
            style="cursor: pointer"
            size="small"
            v-if="record.unbanFlag == 0"
            v-permission="'admin:fakeAppBanRecordAdmin:unbanFakeApp'"
            >{{ $t('enabled') }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import {
  fakeAppBanRecordAdminListPage,
  fakeAppBanRecordAdminUnbanFakeApp,
  getKycBankCodeList,
} from "@/api";
import { message } from "ant-design-vue";
import { onMounted, ref, watchEffect, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { colorMap, thousand } from "@/utils";
const { getTabH } = useTabHeight(1);
const { t } = useI18n();
const query = ref({
  asc:false,
  column:'',
  pageNo: 1,
  pageSize: 20,
  bankCode: undefined,
  phoneNumber: undefined,
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
    title: t('state'),
    dataIndex: "unbanFlag",
    key: "unbanFlag",
    width:160,
    align:"center",
  },
  {
    title: t('n1398'),
    dataIndex: "createTime",
    key: "createTime",
    width:180,
    align:"center",
  },
  {
    title: t("n1174"),
    dataIndex: "unbanTime",
    key: "unbanTime",
    width:160,
    align:"center",
  },
  {
    title: t("remark"),
    dataIndex: "remark",
    key: "remark",
    width:240,
    align:"center",
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    width:100,
    align:"center",
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    width:100,
    align:"center",
    fixed: 'right',
  },
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
  api: fakeAppBanRecordAdminListPage,
  fetchType: 1,
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

