<template>
  <a-table
    size="middle"
    :dataSource="dataSource"
    :columns="columns"
    :scroll="{ x: '100%' }"
    :pagination="paginationConfig"
    bordered
    @change="getChange"
  >
  <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberNum'">
        {{ thousand(record.memberNum) }}
      </template>
      <template v-if="column.key === 'merchantType'">
        {{ merchantTypeMap[record.merchantType] }}
      </template>
      <template v-if="column.key === 'buyNum'">
        {{ thousand(record.buyNum) }} /
        {{ record.memberNum == 0 ? '0.00%' : ((record.buyNum/record.memberNum)*100).toFixed(2) + '%' }}
      </template>
      <template v-if="column.key === 'sellNum'">
        {{ thousand(record.sellNum) }} /
        {{ record.memberNum == 0 ? '0.00%' : ((record.sellNum/record.memberNum)*100).toFixed(2) + '%' }}
      </template>
      <template v-if="column.key === 'rechargeNum'">
        {{ thousand(record.rechargeNum) }} /
        {{ record.memberNum == 0 ? '0.00%' : ((record.rechargeNum/record.memberNum)*100).toFixed(2) + '%' }}
      </template>
      <template v-if="column.key === 'withdrawNum'">
        {{ thousand(record.withdrawNum) }} /
        {{ record.memberNum == 0 ? '0.00%' : ((record.withdrawNum/record.memberNum)*100).toFixed(2) + '%' }}
      </template>
      <template v-if="column.key === 'thirtyActiveNum'">
        {{ record.memberNum == 0 ?'0.00' : ((record.yesterdayActiveNum/record.memberNum)*100).toFixed(2)}}%/
        {{ record.memberNum == 0 ?'0.00' : ((record.sevenActiveNum/record.memberNum)*100).toFixed(2)}}%/
        {{ record.memberNum == 0 ?'0.00' : ((record.thirtyActiveNum/record.memberNum)*100).toFixed(2) }}%
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { useReport } from "@/hooks/useReport.hook";
import { ref, reactive, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { usePagination } from "@/plugins/dataMap";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { currency, thousand } from "@/utils";
import { formatTime } from "@/utils/index";
import { biMerchantStatistics } from "@/api/merchant.api";
import i18n from "@/i18n";
const { t } = useI18n();
const { dateType } = useReport();
let dayType =ref<any>("toDay");
const paginationConfig = reactive({
    pageSizeOptions: ["5"],
    showSizeChanger: false,
    total: 0,
    current: 1,
    pageSize: 5,
    showTotal: (total: any) => i18n.global.t("total", [total]),
  })
const today = dayjs();
const query = ref<any>({
  pageNo: 1,
  pageSize: 5,
});
const merchantTypeMap = <any>{
  "1": t("n24"),
  "2": t("n25"),
};
const dataSource = ref([]);

const columns:any = reactive([
  {
    title: t("l92"),
    dataIndex: "merchantName",
    key: "merchantName",
    align: "center",
  },
  {
    title: t('n30'),
    dataIndex: "merchantType",
    key: "merchantType",
    align: "center",
  },
  {
    title: t('m204'),
    dataIndex: "memberNum",
    key: "memberNum",
    align: "center",
  },
  {
    title: t('m202'),
    dataIndex: "memberBalance",
    key: "memberBalance",
    align: "center",
  },
  {
    title: t('m303'),
    dataIndex: "thirtyActiveNum",
    key: "thirtyActiveNum",
    align: "center",
  },
  {
    title: t('m286'),
    dataIndex: "buyNum",
    key: "buyNum",
    align: "center",
  },
  {
    title: t('m289'),
    dataIndex: "sellNum",
    key: "sellNum",
    align: "center",
  },
  {
    title: t('m287'),
    dataIndex: "rechargeNum",
    key: "rechargeNum",
    align: "center",
  },
  {
    title: t('m290'),
    dataIndex: "withdrawNum",
    key: "withdrawNum",
    align: "center",
  },
  {
    title: t('m302'),
    dataIndex: "realNameNum",
    key: "realNameNum",
    align: "center",
  },
  {
    title: t('n8'),
    dataIndex: "cost",
    key: "cost",
    align: "center",
    // customHeaderCell: () => {
    //   return {
    //     style: {
    //       background: '#1677ff',
    //       color: "#fff",
    //     }
    //   };
    // }
  },
]);

const getList = async () => {
  const res: any = await biMerchantStatistics(query.value);
  if (res && res.code === "1") {
    dataSource.value = res.data.map((item: any)=> {
        item.cost = currency(item.cost, false);
        item.realNameNum = thousand(item.realNameNum);
        item.memberBalance = currency(item.memberBalance, false);
        return item;
    })
    paginationConfig.total = res.total || 0;
  }
};
const successRateChange = (value:any) =>{
  return (value * 100).toFixed(0) + '%';
};
const getTodayList = async (type: any) => {
  dayType.value = type;
  if(type == 'allDay'){
    query.value = {
      endTime: '',
      pageNo: 1,
      pageSize: 5,
      startTime: '',
    };
  }else if(type == 'toDay'){
    query.value = {
      endTime: today.endOf(dateType.value),
      pageNo: 1,
      pageSize: 5,
      startTime: today.startOf(dateType.value),
    }
    setDefaultData();
  }
  getList();
};
const searchList = () =>{
  dayType.value = null;
  query.value.pageNo = 1
  paginationConfig.current = 1;
  getList()
}
const reset = () => {
  dayType.value = 'toDay';
  setDefaultData();
  paginationConfig.current = 1;
  setDefaultData();
  getList();
};
const getChange = (value: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  paginationConfig.current = current;
  paginationConfig.pageSize = pageSize;
  getList();
};

const setDefaultData = () => {
  const currentDate = dayjs().subtract(1, 'day');
  query.value.startTime = currentDate;
  query.value.endTime = currentDate;
}
onMounted(() => {
  // setDefaultData();
  getList();
});
</script>

<style lang="less" scoped>
lable {
  display: inline-block;
  width: 100px;
}
:deep(th){
  border-radius: 0!important;
}
</style>
