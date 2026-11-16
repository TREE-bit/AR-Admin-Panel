<template>
  <div class="search">
    <h2>{{ $t('m412') }}</h2>
  </div>
  <a-table
    size="middle"
    :dataSource="dataSource"
    :loading="loading"
    :columns="columns"
    :scroll="{ x: '100%' }"
    :pagination="paginationConfig"
    rowKey="id"
    bordered
    @change="getChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'switchName'">
        <div class=" toopTipStyle2">
          {{ keysArr.includes(String(record.switchId))? nameMap[record.switchId] : record.switchName }}
        </div>
      </template>
      <template v-if="column.key === 'switchDescription'">
        <div class=" toopTipStyle3">
          {{ keysArr.includes(String(record.switchId))? desMap[record.switchId] : record.switchDescription }}
        </div>
      </template>
      <template v-if="column.key === 'status'">
        <a-switch
          :checked="record.status == '1' ? true : false"
          @change="switchSale($event, record)"
        />
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ref} from "vue";
import { usePagination } from "@/plugins/dataMap";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  controlSwitchAdminList,
  updateControlSwitchStatus,
} from "@/api/c2cconfig.api";
import { message, Modal } from "ant-design-vue";
const { t } = useI18n();
const { paginationConfig } = usePagination();
const loading = ref(false);
const query = ref<any>({
  // asc: "",
  // column: "",
  pageNo: 1,
  pageSize: 20,
});
const dataSource = ref<any>([]);
const columns:any = [
  {
    title: "ID",
    dataIndex: "switchId",
    key: "switchId",
    align: "center",
    width: 60,
  },
  {
    title: t('m413'),
    dataIndex: "switchName",
    key: "switchName",
    align: "center",
    width: 200,
  },
  {
    title: t('m414'),
    dataIndex: "switchDescription",
    key: "switchDescription",
    align: "center",
    width: 400,
  },
  {
    title: t('m415'),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 100,
  },
];
const nameMap = ref<any>({
  1: t('m416'), 2: t('m543'), 3: t('m598'), 4: t('m604'), 5: t('m621'), 6: t('m623'), 7: t('m625'), 8: t('m787'), 9: t('m789'),
  10: t('m969'), 11: t('m970'), 12: t('m971'), 13: t('m976'), 14: t('m989'), 15: t('n157'), 16: t('n370'), 17: t('n368'), 18: t('n366'), 19: t('n364'),
  20: t('n362'), 22: t('n360'), 23: t('n458'), 24: t('n459'), 25: t('n460'), 26: t('n461'), 35: t('n462'), 28: t('n463'), 29: t('n464'),
  30: t('n473'),
  40: t('n472'), 41: t('n596'), 42: t('n597'),  43: t('n598'), 45: t('n600'),
  51: t('n599'),
  60: t('n651'), 66: t('n654'),
  70: t('n652'), 71: t('n1166'), 72: t('n1168'),
  80: t('n1167'), 81: t('n1169'), 82: t('n1170'),  83: t('n1190'), 84: t('n1191'), 85: t('n1192'), 86: t('n1203'), 87: t('n1204'), 88: t('n1286'), 89: t('n1287'),
  92: t('n1470'), 93: t('n1542'), 94: t('n1543'), 95: t('n1595'), 96: t('n1597'), 97: t('n1762'), 98: t('n1763'), 99: t('n1765'),
  100: t('n1796'), 101: t('n1795'), 102: t('n1797'), 103: t('n1976'), 104: t('n2100'), 105: t('n2102'),
});
const desMap = ref<any>({
  1: t('m417'), 2: t('m544'), 3: t('m599'), 4: t('m605'), 5: t('m622'), 6: t('m624'), 7: t('m626'), 8: t('m788'), 9: t('m790'),
  10: t('m969'), 11: t('m970'), 12: t('m971'), 13: t('m976'), 14: t('m990'), 15: t('n158'), 16: t('n371'), 17: t('n369'), 18: t('n367'), 19: t('n365'),
  20: t('n363'), 22: t('n361'), 23: t('n458'), 24: t('n465'), 25: t('n466'), 26: t('n467'), 35: t('n462'), 28: t('n463'), 29: t('n464'),
  30: t('n473'),
  40: t('n472'), 41: t('n596'), 42: t('n597'), 43: t('n598'), 45: t('n601'),
  51: t('n599'),
  60: t('n651'), 66: t('n655'),
  70: t('n652'), 71: t('n1166'), 72: t('n1168'),
  80: t('n1167'), 81: t('n1169'), 82: t('n1170'), 83: t('n1190'), 84: t('n1191'), 85: t('n1193'), 86: t('n1205'), 87: t('n1206'), 88: t('n1288'), 89: t('n1288'),
  92: t('n1471'), 93: t('n1542'), 94: t('n1543'), 95: t('n1596'), 96: t('n1598'), 97: t('n1762'), 98: t('n1764'), 99: t('n1766'),
  100: t('n1799'), 101: t('n1798'), 102: t('n1800'), 103: t('n1977'), 104: t('n2101'), 105: t('n2103'),
});
const keysArr = Object.keys(nameMap.value);
const isChange = ref(false);
const getList = async (query: any) => {
  loading.value = true;
  paginationConfig.current = query.pageNo;
  paginationConfig.pageSize = query.pageSize;
  const res: any = await controlSwitchAdminList(Object.assign(query));
  if (res && res.code === "1") {
    dataSource.value = res.data.map((item:any)=>{
       item.status = String(item.status);
       return item;
    });
    // res.data.map((item:any)=>{
    //    item.status = String(item.status);
    //    if(item.switchId == 5 || item.switchId == 6 ){
    //    }else{
    //     dataSource.value.push(item);
    //    }
    // });
    paginationConfig.total = res.total || 0;
    if (!isChange.value) {
      paginationConfig.current = query.pageNo;
    }
    isChange.value = false;
  }
  loading.value = false;
};
const switchSale = async (e: any, val: any) => {
  const { switchId, status} = val
  // let res;
  // if (e === "1") {
  //   res = await updateControlSwitchStatus({ switchId, status});
  // } else {
  //   res = await updateControlSwitchStatus({ switchId, status});
  // }
  // if (res && res.code === "1") {
  //   message.success(t("s10"));
  // }
  // getList(query.value);
  const s = e == "1" ? 1 : 0;
  Modal.confirm({
    title: s ? t("m767") : t("m768"), 
    onOk: async () => {
      let res: any;
      loading.value = true;
      res = await updateControlSwitchStatus({ switchId,status: s,}).finally(()=>loading.value = false);
      if (res && res.code === "1") {
        message.success(t("s10"));
        getList(query.value);
      }
    },
    onCancel() {
    },
  });
};
const columnVal = ref("");
const sortVal = ref("");
const getChange = (value: any, filters: any, sorter: any) => {
  const { current, pageSize } = value;
  const { columnKey, order } = sorter;
  if (columnVal.value === columnKey) {
    paginationConfig.current = current;
    paginationConfig.pageSize = pageSize;
    if (sortVal.value != order) {
      paginationConfig.current = 1;
    }
  } else {
    paginationConfig.current = 1;
  }
  if (order == undefined) {
    query.value.asc = "";
    query.value.column = "";
    columnVal.value = "";
    sortVal.value = "";
    isChange.value = false;
  } else {
    query.value.column = columnKey;
    columnVal.value = columnKey;
    sortVal.value = order;
    query.value.asc = Boolean(order === "ascend");
    isChange.value = true;
  }
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  getList(query.value);
};
onMounted(() => {
  getList(query.value);
});
</script>

<style lang="less" scoped></style>
