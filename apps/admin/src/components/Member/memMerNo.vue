<template>
  <div class="search">
    <h2>{{ $t("m29") }}</h2>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' , y: getTabH +'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'activeIp'">
        <a-tooltip v-if="record.activeIp">
          <template #title>{{ record.activeIp }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.activeIp }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'sourceMerchant'">
        {{ record.sourceMerchant ? $t("yes") : $t("no") }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <a-popconfirm
          @confirm="unbind(record)"
          :ok-text="$t('b9')"
          :cancel-text="$t('b10')"
        >
          <template #title>
            <h4>{{ $t("n214") }}</h4>
          </template>
          <a-tag
            color="rgba(22, 155, 213, 1)"
            size="small"
            v-if="!record.sourceMerchant"
            style="cursor: pointer;"
            v-permission="'admin:memberInfoAdmin:unbindingMerchant'"
            >{{ $t("n213") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { getActiveMerchantList, unbindMerchant } from "@/api/menber";
import { message } from "ant-design-vue";
import { onMounted, ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import Bus from "@/utils/bus";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const props = defineProps<{
  memberId: number;
}>();
const columns:any = [
  {
    title: t("e47"),
    align: "center",
    width: 60,
    customRender: ({ index }: { index: number }) => index + 1,
  },
  {
    title: t("l92"),
    dataIndex: "merchantCode",
    key: "merchantCode",
    width: 200,
    align: "center",
  },
  {
    title: t("m677"),
    dataIndex: "sourceMerchant",
    key: "sourceMerchant",
    align: "center",
    width: 140,
  },
  {
    title: t("n215"),
    dataIndex: "activeIp",
    key: "activeIp",
    align: "center",
    width: 200,
  },
  {
    title: t("n216"),
    dataIndex: "createTime",
    key: "createTime",
    width: 180,
    align: "center",
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 100,
    fixed: 'right',
  },
];
const loading = ref(false);
const dataSource = ref([]);
const pagination = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 10,
  showSizeChanger: false,
  showTotal: (total: any) => t("total", [total]),
});
const query =ref({
  pageNo: 1,
  pageSize: 10,
  memberId: props.memberId
})
const getList = async () => {
  loading.value=true;
  const res: any = await getActiveMerchantList(query.value).finally(()=>{loading.value=false});
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.total = res.total;
    pagination.pageNo = query.value.pageNo;
    pagination.pageSize = query.value.pageSize;
  }
};
const handleTableChange: any = (value: {
  pageSize: number;
  current: number;
}) => {
  const { current ,pageSize} = value;
  pagination.pageNo = current;
  pagination.pageSize = pageSize;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  getList();
};
//解绑商户
const unbind = async (record: any) => {
  loading.value=true;
  const res: any = await unbindMerchant({ memberId: props.memberId, merchantCode: record.merchantCode }).finally(()=>{loading.value=false});
  if (res && res.code == "1") {
    message.success(t("s10"));
    getList();
    Bus.emit("refreshMember",true);
  }
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight().getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
