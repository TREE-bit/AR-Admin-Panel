<template>
  
  <div class="search">
    <h2>{{ $t("m576") }}</h2>
    <a-row style="margin: 0 0 15px 0">
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.id"
          class="searchstyle"
          :placeholder="$t('m562')+'KYC ID'"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('c9')"
        />
      </a-col>
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.name"
          class="searchstyle"
          :placeholder="$t('m562')+$t('l60')"
        />
      </a-col> -->
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.account"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m590')"
        />
      </a-col> -->
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.account"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m591')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.upiId"
          class="searchstyle"
          :placeholder="$t('m562')+'UPI ID'"
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
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.linkStatus"
          :placeholder="$t('m563')+$t('m592')"
        >
          <a-select-option
            v-for="(item, key) in linkStatusMap"
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
          v-model:value="query.sellStatus"
          :placeholder="$t('m563')+$t('m593')"
        >
          <a-select-option
            v-for="(item, key) in sellStatusMap"
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
          v-model:value="query.deleted"
          :placeholder="$t('m563')+$t('m832')"
        >
          <a-select-option :value="1">{{ $t("yes") }}</a-select-option>
          <a-select-option :value="0">{{ $t("no") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.lastRefreshTokenTimeStart" v-model:endTime="query.lastRefreshTokenTimeEnd" :title="$t('m822')" :type="1"/>
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
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        <a-button
          type="link"
          @click="showDetail(record)"
          style="padding: 0;"
          >{{ record.memberId }}</a-button
        >
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'linkStatus'"  >
        <a-tag>
          <a-badge :color="record.linkStatus == 1 ? 'green' : 'red'" />
          {{ linkStatusMap[record.linkStatus] }}
        </a-tag>
      </template>
      <template v-if="column.key === 'linkType'"  >
      {{ linkTypeMap[record.linkType] }}
      </template>
      <template v-if="column.key === 'sellStatus'"  >
      {{ sellStatusMap[record.sellStatus] }}
      </template>
      <template v-if="column.key === 'iconUrl'">
        <a-image :width="70" :src="record.iconUrl" alt=""/>
      </template>
      <template v-if="column.key === 'memberAccount'">
        <a-tooltip>
          <template #title>{{ record.memberAccount }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.memberAccount }}</div>
        </a-tooltip>
      </template>
      <!-- <template v-if="column.key === 'name'">
        <a-tooltip>
          <template #title>{{ record.name }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.name }}</div>
        </a-tooltip>
      </template> -->
      <template v-if="column.key === 'account'">
        <a-tooltip>
          <template #title>{{ record.account }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.account }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'bankName'">
        <a-tooltip>
          <template #title>{{ record.bankName }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankName }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'bankCode'">
        <a-tooltip>
          <template #title>{{ record.bankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip>
          <template #title>{{ record.upiId }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.upiId }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'linkUrl'">
        <a-tooltip>
          <template #title>{{ record.linkUrl }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.linkUrl }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.remark }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'deleted'">
        <span :style="{ color: record.deleted == 1 ? 'red' : '' }">{{ record.deleted == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <template v-if="column.key === 'lastRefreshTime'">
        {{ record.lastRefreshTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <!-- <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:customer:edit'"
          >{{ $t("edit") }}
        </a-tag>  -->
        
        <a-popconfirm
          :title=" $t('t16') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record)"
        >
         <a-tag
          :color="'rgba(253, 11, 26, 1)'"
          style="cursor: pointer"
          size="small"
          v-permission="'admin:kycPartnersAdmin:delete'"
          >{{ $t('b11') }}
        </a-tag>
        </a-popconfirm>
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
import {
  kycPartnersAdminList,
  kycPartnersAdminDelete,
  getKycBankCodeList,
} from "@/api/kycConfig.api";
import { message } from "ant-design-vue";
import { onMounted, ref, reactive, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { version } from "nprogress";
const { getTabH } = useTabHeight(340);
const { t } = useI18n();
const detailModel = ref(false);
const detailId = ref<any>({});
const query = ref({
  account:undefined,
  asc:true,
  bankCode:null,
  id:undefined,
  column:'',
  linkStatus:'1',
  memberId:null,
  mobileNumber:null,
  pageNo: 1,
  pageSize: 10,
  sellStatus: null,
  upiId: null,
  lastRefreshTokenTimeStart: '',
  lastRefreshTokenTimeEnd: '',
  // name: undefined,
  deleted: 0,
  version: 1,
})
const columns:any = [
  {
    title: "KYC ID",
    dataIndex: "id",
    key: "id",
    width:80,
    align:"center"
  },
  {
    title: t('c9'),
    dataIndex: "memberId",
    key: "memberId",
    width:180,
    align:"center"
  },
  // {
  //   title: t('c10'),
  //   dataIndex: "memberAccount",
  //   key: "memberAccount",
  //   width:160,
  //   align:"center"
  // },
  // {
  //   title: t("l60"),
  //   dataIndex: "name",
  //   key: "name",
  //   width:160,
  //   align:"center",
  // },
  // {
  //   title: t('m590'),
  //   dataIndex: "account",
  //   key: "account",
  //   width:160,
  //   align:"center"
  // },
  {
    title: t('m591'),
    dataIndex: "account",
    key: "account",
    width:160,
    align:"center"
  },
  {
    title: t("UPI ID"),
    dataIndex: "upiId",
    key: "upiId",
    width:180,
    align:"center",
  },
  // {
  //   title: t('m581'),
  //   dataIndex: "bankName",
  //   key: "bankName",
  //   width:160,
  //   align:"center",
  // },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    width:160,
    align:"center"
  },
  {
    title: t('m583'),
    dataIndex: "iconUrl",
    key: "iconUrl",
    width:160,
    align:"center",
  },
  {
    title: t("m592"),
    dataIndex: "linkStatus",
    key: "linkStatus",
    width:160,
    align:"center",
  },
  // {
  //   title: t("m584"),
  //   dataIndex: "linkType",
  //   key: "linkType",
  //   width:160,
  //   align:"center",
  // },
  // {
  //   title: t("m585"),
  //   dataIndex: "linkUrl",
  //   key: "linkUrl",
  //   width:160,
  //   align:"center",
  // },
  {
    title: t("m593"),
    dataIndex: "sellStatus",
    key: "sellStatus",
    width:160,
    align:"center",
  },
  {
    title: t("m832"),
    dataIndex: "deleted",
    key: "deleted",
    width:120,
    align:"center",
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    width:160,
    align:"center",
  },
  {
    title: t("m822"),
    dataIndex: "lastRefreshTime",
    key: "lastRefreshTime",
    width:160,
    align:"center",
  },
  // {
  //   title: t('operation'),
  //   dataIndex: "action",
  //   key: "action",
  //   width:100,
  //   align:"center",
  //   fixed: 'right',
  // },
];
const loading = ref(false);
const dataSource = ref([]);
const sellStatusMap = <any>{
  0:t('l54'),
  1:t('l53'),
}
const linkStatusMap = <any>{
  0:t('m594'),
  1:t('m595'),
}
const linkTypeMap = <any>{
  1:t('m588'),
  2:t('m589'),
}
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async () => {
  loading.value=true;
  const res: any = await kycPartnersAdminList(query.value).finally(()=>loading.value=false);;
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.value.total = res.total;
  }
};
const search = () => {
  pagination.value.current = 1;
  query.value.pageNo = 1;
  getList()
}
const resetQuery = () => {
  query.value = {
    account:undefined,
    asc:true,
    bankCode:null,
    column:'',
    linkStatus:undefined,
    id:undefined,
    memberId:null,
    mobileNumber:null,
    pageNo: 1,
    pageSize: 10,
    sellStatus: null,
    upiId: null,
    lastRefreshTokenTimeStart: '',
    lastRefreshTokenTimeEnd: '',
    // name: undefined,
    deleted: undefined,
    version: 1,
  };
  pagination.value.pageSize = 10;
  pagination.value.current =1;
  getList();
};
const del = async (value: any) => {
  const { id } = value;
  const res: any = await kycPartnersAdminDelete({id});
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList()
};
const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};
const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value.id = memberId;
  detailModel.value = true;
};
onMounted(() => {
  getGroupList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

