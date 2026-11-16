<template>
  
  <div class="search">
    <h2>{{ $t("m576") }}</h2>
    <a-row>
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
      <!-- <a-col >
        <timeRange v-model:startTime="query.lastRefreshTokenTimeStart" v-model:endTime="query.lastRefreshTokenTimeEnd" :title="$t('m822')" :type="1"/>
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
      <template v-if="column.key === 'memberId'">
        <a-button
          type="link"
          @click="showDetail(record)"
          style="padding: 0;"
          >{{ record.memberId }}</a-button
        >
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'linkStatus'">
        <span class="arbListTag" v-if="[0,1].includes(record.linkStatus)">
          <span class="pointTag" :class="[1].includes(record.linkStatus) ? 'pointTag-green' : 'pointTag-red'" ></span>
          {{ linkStatusMap[record.linkStatus] }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'linkType'"  >
      {{ linkTypeMap[record.linkType] }}
      </template>
      <template v-if="column.key === 'sellStatus'"  >
      <span :class="record.sellStatus == 1 ? 'tag-green' : record.sellStatus == 0 ? 'tag-red' : ''">
        {{ sellStatusMap[record.sellStatus] }}
      </span>
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
        <span :class="record.deleted == 1 ? 'tag-green' : 'tag-red'">{{ record.deleted == 1 ? $t("yes") : $t("no") }}</span>
      </template>
      <template v-if="column.key === 'lastRefreshTime'">
        {{ record.lastRefreshTime || '-' }}
      </template>
      <template v-if="column.key === 'lastLinkTime'">
        {{ record.lastLinkTime || '-' }}
      </template>
      <template v-if="column.key === 'lastCheckLinkTime'">
        {{ record.lastCheckLinkTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="openConnectLog(record)"
          >{{ $t("b23") }}
        </a-tag>
        <!-- <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:customer:edit'"
          >{{ $t("edit") }}
        </a-tag>  -->
        
        <!-- <a-popconfirm
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
        </a-popconfirm> -->
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
  <!-- kyc连接日志 -->
<a-modal
  v-model:open="connectModel"
  :footer="null"
  wrap-class-name="full-modal"
  width="100%"
  @cancel="cancelConnectLog"
  >
  <kycConnectLog
    v-if="connectModel"
    :bankCode="bankCode"
    :phoneNumber="phoneNumber"
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
import { onMounted, ref, watchEffect, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import MemberDetail from "@/components/Member/memberDetail.vue";
import kycConnectLog from "@/components/Kyc/kycConnectLog.vue";
import { useI18n } from "vue-i18n";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useFloatingStore } from '@/stores/floatModal';
import { usePagination } from "@/plugins/dataMap";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { usePageCash } from "@/hooks/usePageCash.hook"; 
const route = useRoute();
const { pageCash,setPageCash,getPageCash,clearPageCash } = usePageCash();
const resultData = ref({});
const isUseCash = ref(false);
onBeforeRouteLeave(() => {
  setPageCash(route.fullPath.split('?')[0], query.value, resultData.value);
})
const floadModalStore = useFloatingStore();// 打开浮动框
const { paginationConfig } = usePagination();
const openWindow = (item: any) => {
  useFloatingStore().addWindow(item);
};
const { getTabH } = useTabHeight(340);
const { t } = useI18n();
const detailModel = ref(false);
const detailId = ref<any>({});
const query = ref({
  account:undefined,
  asc:false,
  bankCode:undefined,
  column:'',
  linkStatus:'1',
  id:undefined,
  memberId:undefined,
  mobileNumber:undefined,
  pageNo: 1,
  pageSize: 20,
  sellStatus: undefined,
  upiId: undefined,
  lastRefreshTokenTimeStart: '',
  lastRefreshTokenTimeEnd: '',
  // name: undefined,
  deleted: 0,
  version: 2,
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
  // {
  //   title: t("m822"),
  //   dataIndex: "lastRefreshTime",
  //   key: "lastRefreshTime",
  //   width:160,
  //   align:"center",
  // },
  {
    title: t("n247"),
    dataIndex: "lastLinkTime",
    key: "lastLinkTime",
    width:160,
    align:"center",
  },
  {
    title: t("m980"),
    dataIndex: "lastCheckLinkTime",
    key: "lastCheckLinkTime",
    width:160,
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
// const loading = ref(false);
// const dataSource = ref([]);
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
  handleQueryFields: (q) => ({
    ...q,
    version: 2,
  }),
  api: kycPartnersAdminList,
  fetchType: 1,
  defaultPageSize: 20,
  filterRules: [],
  // afterFetch: (data) =>
  //   data.map((item: any) => {
  //   item.isDefaultTId = item.tId && item.tId.slice(0, 7) == 'DEFAULT' ? 1 : 0;
  //     return item;
  //   }),
});
watchEffect(() => {
  if(!isUseCash.value) resultData.value = response.value;
});
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
// const getList = async () => {
//   loading.value=true;
//   paginationConfig.current = query.value.pageNo;
//   paginationConfig.pageSize = query.value.pageSize;
//   const res: any = await kycPartnersAdminList(query.value).finally(()=>loading.value=false);;
//   if (res && res.code === "1") {
//     dataSource.value = res.data;
//     paginationConfig.total = res.total;
//     resultData.value = res;
//     clearSelected();
//   }
// };
const search = () => {
  // paginationConfig.current = 1;
  // query.value.pageNo = 1;
  getList(1)
}
// const resetQuery = () => {
//   query.value = {
//     account:undefined,
//     asc:true,
//     bankCode:undefined,
//     column:'',
//     linkStatus:'',
//     id:undefined,
//     memberId:undefined,
//     mobileNumber:undefined,
//     pageNo: 1,
//     pageSize: 20,
//     sellStatus: undefined,
//     upiId: undefined,
//     lastRefreshTokenTimeStart: '',
//     lastRefreshTokenTimeEnd: '',
//     // name: undefined,
//     deleted: undefined as any,
//     version: 2,
//   };
//   paginationConfig.pageSize = 20;
//   paginationConfig.current =1;
//   getList();
// };
const del = async (value: any) => {
  const { id } = value;
  const res: any = await kycPartnersAdminDelete({id});
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
  }
};
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//   paginationConfig.current = pag.current;
//   paginationConfig.pageSize = pag.pageSize;
//   query.value.pageNo = pag.current;
//   query.value.pageSize = pag.pageSize;
//   getList()
// };
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
// 打开连接日志
const connectModel = ref(false);
const bankCode = ref("");
const phoneNumber = ref("");
const openConnectLog = (value: any) => {
  selectedRow();
  bankCode.value = value.bankCode;
  phoneNumber.value = value.account;
  connectModel.value = true;
};
const cancelConnectLog = () => {
  connectModel.value = false;
  bankCode.value = "";
  phoneNumber.value = "";
};
onMounted(() => {
  getGroupList();
  const pathName = route.fullPath.split('?')[0];
  if(pageCash.value.includes(pathName) && Object.keys(route.query).length == 0){
    const { queryCash, res } = getPageCash(pathName);
    if(!res.data || res.data && res.data.length == 0) {
      isUseCash.value = false;
      getList();
    }else{
      isUseCash.value = true;
      query.value = queryCash;
      dataSource.value = res.data;
      resultData.value = res;
      pagination.value.total = res.total;
      pagination.value.current = query.value.pageNo;
      pagination.value.pageSize = query.value.pageSize;
    }
  }else{
    clearPageCash(route.fullPath);
    getList();
  }
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

