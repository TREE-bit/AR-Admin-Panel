<template>
  <div class="search">
    <h2>{{ $t("m179") }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          class="searchstyle"
          v-model:value="query.userId"
          :placeholder="$t('m181')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          class="searchstyle"
          show-search
          :filter-option="filterOption"
          v-model:value="query.opModule"
          :placeholder="$t('m190')"
          :allowClear="true"
          :options="Object.entries(typeMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.loginIp"
          class="searchstyle"
          :placeholder="$t('m191')"
        />
      </a-col>
      <!-- <a-col :span="6">
        <a-range-picker
          show-time
          class="searchstyle"
          v-model:value="searchDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m188')]"
        />
      </a-col> -->
      <a-col >
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('l67')" :type="1"/>
      </a-col>
      <a-col>
        <a-button type="primary" :loading="loading" :icon="h(SearchOutlined)" @click="getList(1)">{{
          $t("search")
        }}</a-button>
        <a-button type="primary" :loading="loading" @click="resetQuery">{{
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
      <template v-if="column.key === 'moduleCode'">
        {{ typeMap[record.moduleCode] }}
      </template>
      <template v-if="column.key === 'operationPath'">
        <a-tooltip>
          <template #title>{{ record.operationPath }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.operationPath }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'ipAddress'">
        <a-tooltip>
          <template #title>{{ record.ipAddress }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.ipAddress }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'response'">
        <a-tooltip>
          <template #title>{{ record.response }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.response }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'loginStatus'">
        {{ record.loginStatus ? t("s25") : t("f1") }}
      </template>
      <template v-if="column.key === 'username'">
        <a-tooltip>
          <template #title>{{ record.username }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.username }}</div>
        </a-tooltip>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { getOperateLog } from "@/api/menber";
import {filterOption } from "@/utils"
import { message } from "ant-design-vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight(340);
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
// const dataSource = ref([]);
// const loading = ref(false);
const query = ref<any>({
  asc: false,
  endTime: endIndiaTime,
  loginIp: "",
  startTime: startIndiaTime,
  opModule: undefined,
  userId: "",
  pageNo: 1,
  pageSize: 50,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const typeMap:any = {
  1: t('t33'),//买入下单接口
  2: t('t34'),//USDT买入下单接口
  3: t('t35'),//USDT完成转账
  4: t('t36'),//完成支付
  5: t('t37'),//买入下单接口
  6: t('m126'),//取消支付
  7: t('t39'),//提交买入订单申诉
  8: t('c17'),//实名认证
  9: t('t41'),//校验短信验证码
  10: t('t42'),//更换手机号码
  11: t('t43'),//更换邮箱号
  12: t('m100'),//添加KYC收款信息
  13: t('t45'),//开启收款
  14: t('t46'),//停止收款
  15: t('t47'),//删除收款信息
  16: t('t48'),//设置头像
  17: t('t49'),//设置昵称
  18: t('t50'),//设置新支付密码
  19: t('t51'),//修改支付密码
  20: t('t52'),//忘记支付密码
  21: t('t53'),//卖出下单接口
  22: t('t54'),//确认到账
  23: t('t55'),//取消卖出订单
  24: t('m142'),//继续匹配
  25: t('t57'),//提交金额错误
  26: t('t58'),//取消申请金额错误
  27: t('t59'),//提交卖出申诉
  28: t('t60'),//手机号码注册
  29: t('t61'),//邮箱账号注册
  30: t('b14'),//忘记密码
  31: t('t62'),//发送短信验证码
  32: t('t63'),//发送邮箱验证码
  33: t('m981'),//设置默认收款信息
  34: t('m982'),//领取活动任务奖励
  35: t('m983'),//完成新手引导
  36: t('m984'),//快捷买入
  37: t('m136'),//取消匹配
  38: t('m985'),//确认放单
  39: t('m986'),//卖出前检测
  40: t('m987'),//USDT卖出下单接口
  41: t('m988'),//新增USDT收款信息
};
const transformedArray = Object.entries(typeMap).map(([value, label]) => ({
  value,
  label,
}));
const columns:any = [
  {
    title: t("m184"),
    align: "center",
    dataIndex: "memberId",
    key: "memberId",
    width: 180,
  },
  {
    title: t("c10"),
    dataIndex: "username",
    key: "username",
    align: "center",
    width: 180,
  },
  {
    title: t("l46"),
    dataIndex: "moduleCode",
    key: "moduleCode",
    align: "center",
    width: 180,
  },
  {
    title: t("l49"),
    dataIndex: "operationPath",
    key: "operationPath",
    align: "center",
    width: 220,
  },
  {
    title: t("m192"),
    dataIndex: "ipAddress",
    key: "ipAddress",
    align: "center",
    width: 180,
  },
  {
    title: t("m804"),
    dataIndex: "response",
    key: "response",
    align: "center",
    width: 180,
  },
  {
    title: t("l67"),
    dataIndex: "operationTime",
    key: "operationTime",
    align: "center",
    width: 170,
  },
  {
    title: t("m193"),
    dataIndex: "device",
    key: "device",
    align: "center",
    width: 140,
  },
];
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 50,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const searchDate = computed({
  get: () => {
    return [query.value.startTime, query.value.endTime];
  },
  set: (val) => {
    query.value.startTime = val ? val[0] : "";
    query.value.endTime = val ? val[1] : "";
  },
});
const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: getOperateLog,
  defaultPageSize: 50,
  filterRules: [],
});
// const extendData = ref<any>({});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (isFirst: any =null) => {
//   if(isFirst){
//     query.value.pageNo =1;
//     pagination.value.current =1;
//   }
//   loading.value = true;
  
//     const queryPageNo = query.value.pageNo;
//     queryCount.value = queryPageNo - oldPageNo.value;
//     if(query.value.pageNo == 1){
//       query.value.firstPage = true;
//       query.value.lastPage = false;
//       resetPageQuery();
//     }else if(query.value.pageNo == pageCurrent.value){
//       query.value.firstPage = false;
//       query.value.lastPage = true;
//       resetPageQuery();
//     }else if(queryCount.value > 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'next';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }else if(queryCount.value <= 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'prev';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }
//   const res: any = await getOperateLog(query.value).finally(()=>loading.value = false);
//   if (res && res.code === "1") {
//     dataSource.value = [];
//     dataSource.value = res.data;
//     extendData.value = res.extend;
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//     pagination.value.current = query.value.pageNo;
//     pagination.value.pageSize = query.value.pageSize;
//     pagination.value.total = res.total;
//     oldPageNo.value = query.value.pageNo;
//     pageCurrent.value = Math.ceil(res.total/query.value.pageSize);
//   }
// };
// const getforData = async ()=>{
//   const res: any = await getOperateLog(query.value);
//   if(res.code == 1){
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//   }
// }
// const resetPageQuery = ()=>{
//     query.value.direction = '';
//     query.value.nextColValue = '';
//     query.value.nextCursorId = '';
//     query.value.prevColValue = '';
//     query.value.prevCursorId = '';
// }
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//   if(pag.pageSize != pagination.value.pageSize){
//     query.value.pageNo = 1;
//     pagination.value.current = 1;
//   }else{
//     query.value.pageNo = pag.current;
//     pagination.value.current = pag.current;
//   }
//   pagination.value.pageSize = pag.pageSize;
//   query.value.pageSize = pag.pageSize;
//   getList();
// };
// const resetQuery = () => {
//   query.value = {
//     asc: false,
//     endTime: "",
//     loginIp: "",
//     startTime: "",
//     opModule: undefined,
//     userId: "",
//     pageNo: 1,
//     pageSize: 50,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   pagination.value.current = 1;
//   pagination.value.pageSize = 50;
//   getList();
// };
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
