<template>
  <div class="search">
    <tipTemplate :title="$t('n351')" :info="info1" />
    <a-row>
      <a-col >
        <a-date-picker v-model:value="query.rankDate" valueFormat="YYYY-MM-DD"/>
      </a-col>
      <a-col>
        <!-- 搜索按钮 -->
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search()"
          >{{ $t("search") }}</a-button
        >
        <!-- 重置按钮 -->
        <a-button type="primary"  @click="resetQuery">{{
          $t("reset")
        }}</a-button>
      </a-col>
    </a-row>
    
  </div>
  <!-- 表格组件 -->
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="false"
    :scroll="{ x: 'max-content' ,y:getTabH+'px'}"
    :loading="loading"
    :row-key="(record: any) => JSON.stringify(record)"
    bordered
  >
  <template #bodyCell="{ column, record }">
    <template v-if="(String(column.key ?? '')).startsWith('dateHour')">
      <span v-if="record[column.key ?? '']">
        {{ thousand(record[column.key ?? '']?.amount) ?? '-' }}
      </span>
    <span v-else>-</span>
  </template>
</template>

  </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h } from "vue";
import {  SearchOutlined, } from "@ant-design/icons-vue";
import {
  hotBuyAmountAdminListPage,
} from "@/api/order.api";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { thousand } from "@/utils";
import tipTemplate from "@/components/Other/tipTemplate.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";

const [,,inputTime] = getStartAndEndOfDay()
// 获取表格高度
const { getTabH } = useTabHeight();
// 国际化
const { t } = useI18n();
// 数据源
const dataSource = ref<any>([]);
// 加载状态
const loading = ref(false);
// 查询条件
const query = ref({
  rankDate: inputTime || undefined,
});
const info1 = [t("n372")+'：[10000,5000,4000,3000,2000,1000,900,800,700,600,500,400,300,200,100]']
// 表格列配置
const columns: any = [
  {
    title: t("e47"),
    align: "center",
    key: "index",
    width: 40,
    customRender: ({ index }: any) => index + 1,
  },
  {
    title: '0',
    dataIndex: "dateHour00",
    key: "dateHour00",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '1',
    dataIndex: "dateHour01",
    key: "dateHour01",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '2',
    dataIndex: "dateHour02",
    key: "dateHour02",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '3',
    dataIndex: "dateHour03",
    key: "dateHour03",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '4',
    dataIndex: "dateHour04",
    key: "dateHour04",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '5',
    dataIndex: "dateHour05",
    key: "dateHour05",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '6',
    dataIndex: "dateHour06",
    key: "dateHour06",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '7',
    dataIndex: "dateHour07",
    key: "dateHour07",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '8',
    dataIndex: "dateHour08",
    key: "dateHour08",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '9',
    dataIndex: "dateHour09",
    key: "dateHour09",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '10',
    dataIndex: "dateHour10",
    key: "dateHour10",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '11',
    dataIndex: "dateHour11",
    key: "dateHour11",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '12',
    dataIndex: "dateHour12",
    key: "dateHour12",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '13',
    dataIndex: "dateHour13",
    key: "dateHour13",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '14',
    dataIndex: "dateHour14",
    key: "dateHour14",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '15',
    dataIndex: "dateHour15",
    key: "dateHour15",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '16',
    dataIndex: "dateHour16",
    key: "dateHour16",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '17',
    dataIndex: "dateHour17",
    key: "dateHour17",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '18',
    dataIndex: "dateHour18",
    key: "dateHour18",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '19',
    dataIndex: "dateHour19",
    key: "dateHour19",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '20',
    dataIndex: "dateHour20",
    key: "dateHour20",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '21',
    dataIndex: "dateHour21",
    key: "dateHour21",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '22',
    dataIndex: "dateHour22",
    key: "dateHour22",
    align: "center",
    isRequired: true,
    width: 80,
  },
  {
    title: '23',
    dataIndex: "dateHour23",
    key: "dateHour23",
    align: "center",
    isRequired: true,
    width: 80,
  },
];

// 获取列表数据
const getList = async () => {
  loading.value = true;
  dataSource.value = [];
  const res: any = await hotBuyAmountAdminListPage(query.value).catch(() => {
    loading.value = false;
  });
  if (res && res.code == "1") {
    dataSource.value = res.data;
    loading.value = false;
  }
};

// 搜索函数
const search  = () => {
  getList();
}

// 重置查询条件
const resetQuery = () => {
  query.value = {
    rankDate: '',
  };
  getList();
};

// 组件挂载时执行
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
