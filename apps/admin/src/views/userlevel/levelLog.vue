<template>
  <div class="container">
    <div class="search">
    <h2>{{ $t("m495") }}</h2>
      <a-row>
        <a-col :span="3">
        <a-select
          class="searchstyle"
          v-model:value="query.merchantCode"
          :placeholder="$t('m258')"
          :allowClear="true"
          :show-search="true"
          :options="merchantList"
        >
        </a-select>
        </a-col>
        <a-col :span="4">
          <a-button type="primary" :icon="h(SearchOutlined)" @click="getData(query)">{{
            $t("search")
          }}</a-button>
          <a-button type="primary" @click="resetQuery">{{
            $t("reset")
          }}</a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :dataSource="dataList"
      :columns="columns"
      :scroll="{ x: '100%'}"
      :pagination="pagination"
      :loading="loading"
      bordered
      style="padding-bottom: 20px"
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key ==='level'">
        {{ levelMap[Number(record.level)] }}
      </template>
      <template v-if="column.key ==='num'">
        {{ thousand(Number(record.num)) }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showPageFun(record)"
          v-permission="'admin:memberInfoAdmin:relationMemberList'"
          >{{ $t("b24") }}
        </a-tag>
      </template>
    </template>
    </a-table>
  </div>
  <a-modal
    v-model:open="showContent"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
  > 
  <LevelMemberList v-if="showContent" :mearchtData="mearchtData"/>
  </a-modal>
</template>
<script lang="ts" setup>
import LevelMemberList from './levelMemberList.vue'
import { SearchOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, h, computed } from "vue";
import {
  memberInfoAdminGetLevelNum,
} from "@/api/userlevel.api";
import { levelMap } from '@/utils/publicData'
// import { getMerchantInfoAdminList } from "@/api/merchant.api"
import { useI18n } from "vue-i18n";
import {thousand } from '@/utils';
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useMerchantStore } from "@/stores/useMerchantStore";
const merchantList = computed(() => useMerchantStore().merchantList);
const mearchtData = ref<any>({
  mearchtCode: null,
  level: null
})
const { t } = useI18n();
const query = ref({
  merchantCode: undefined,
})
const pagination = ref({
  total: 0,
  // current: 1,
  pageSize: 20,
  showSizeChanger: false,
  // showTotal: (total: any) => t("total", [total]),
});
const columns:any = [
  {
    title: t('m521'),
    dataIndex: "level",
    key: "level",
    align: "center",
  },
  {
    title: t('m522'),
    dataIndex: "num",
    key: "num",
    align: "center",
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width:300,
  },
];
const loading = ref(false);
const dataList = ref([]);
// const memberList=ref<any>([]);

const showContent = ref(false);
const showPageFun = (data: any) => {
  selectedRow();
  mearchtData.value.level = data.level;
  showContent.value = true;
};
// const getMembetList = async () => {
//   const res: any = await getMerchantInfoAdminList({pageNo:1,pageSize:10000});
//   if (res){
//     // const uniqueValues = new Set(res.data.map(item => item.username));
//     // memberList.value = Array.from(uniqueValues).map(value => ({ value }));
//     memberList.value = res.data.map((item:any) =>{
//        return {value:item.code,label:item.username}
//       })
//   }
// }
const getData = async (query: any,) => {
  loading.value = true;
  mearchtData.value.merchantCode = query.merchantCode;
  const res: any = await memberInfoAdminGetLevelNum(query).catch((err)=>{loading.value = false});
  if (res) {
    dataList.value = res.data
    loading.value = false;
  }else{
    loading.value = false;
  }
};

const resetQuery = () => {
  query.value={
    merchantCode: undefined,
  }
  clearSelected();
  getData(query.value);
};
onMounted(() => {
  // getMembetList();
  getData(query.value);
});
</script>
<style lang="less" scoped>
:deep(.green){
  color: green;
}
:deep(.red){
  color: red;
}
:deep(.ant-pagination) {
  display: none;
}
</style>