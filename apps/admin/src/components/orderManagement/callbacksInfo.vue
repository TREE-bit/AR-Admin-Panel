<template>
    <div class="search">
        <a-row style="margin: 0 0 15px 0">
            <a-col>
                <!-- <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('l50')" :type="1"/> -->
            </a-col>
            <a-col>
                <!-- <a-button type="primary" :icon="h(SearchOutlined)" @click="search">{{ $t("search") }}</a-button>
                <a-button type="primary" @click="resetQuery">{{
                    $t("reset")
                    }}</a-button> -->
            </a-col>
        </a-row>
    </div>
    <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" :loading="loading"
        @change="handleTableChange" :scroll="{ x: '100%', y: '750px' }" bordered
        :row-key="(record: any) => JSON.stringify(record)">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'orderType'">
                {{ orderTypeMap[record.orderType] }}
            </template>
            <template v-if="column.key === 'thirdOrderStatus'">
                {{ thirdStatusMap[record.thirdOrderStatus] }}
            </template>
            <template v-if="column.key === 'callbackIpAddress'">
                <a-tooltip>
                    <template #title>
                        <div>{{ record.callbackIpAddress }}</div>
                    </template>
                    <div class="toopTipStyle3">{{ record.callbackIpAddress }}</div>
                </a-tooltip>
            </template>
            <template v-if="column.key === 'callbackParams'">
                <a-tooltip :overlayStyle="{ width: 'auto', maxWidth: 'none' }">
                <template #title>
                    <div class="tableText" style="width: 440px;height: 200px;overflow-y: auto;">
                    {{ record.callbackParams  }}
                    </div>
                </template>
                <div class=toopTipStyle3>
                    {{ record.callbackParams }}
                </div>
                </a-tooltip>
            </template>
            <template v-if="column.key === 'callbackResult'">
                <a-tooltip>
                    <template #title>
                        <div>{{ record.callbackResult }}</div>
                    </template>
                    <div class="toopTipStyle3">{{ record.callbackResult }}</div>
                </a-tooltip>
            </template>
            <template v-if="column.key === 'operate'">
            </template>
        </template>
    </a-table>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { queryCallbackPage } from "@/api/order.api";
import { useI18n } from "vue-i18n";
import { getStartAndEndOfDay } from "@/plugins/dataMap";

const props = defineProps({
    orderInfo: {
        type: Object,
    }
})
const [startIndiaTime, endIndiaTime] = getStartAndEndOfDay()
const { t } = useI18n();
const dataSource = ref([]);
const loading = ref(false);
const query = ref({
    pageNo: 1,
    pageSize: 20,
    callbackTimeGte: '', //开始时间
    callbackTimeLte: '', //结束时间
    platformOrderNo: props.orderInfo.platformOrder,
    orderType: props.orderInfo.type,
    thirdOrderNo: undefined,
    thirdOrderStatus: undefined,
});
const orderTypeMap: any = {
    1: t("n104"),//买入
    2: t("n100"),//卖出
}
const thirdStatusMap: any = {
    1: t("m685"),//处理中
    2: t("s10"),//成功
    3: t("m618"),//失败
    4: t("m686"),//不存在
}
const columns:any = [
    // {
    //     title: t("e47"),
    //     align: "center",
    //     width: 80,
    //     customRender: ({ index }) => index + 1,
    // },
    {
      title: t('n47'),
      dataIndex: "platformOrderNo",
      key: "platformOrderNo",
      align: "center",
      width: 180,
    },
    {
        title: t("m803"),
        dataIndex: "thirdOrderNo",
        key: "thirdOrderNo",
        align: "center",
        width: 180,
    },
    {
        title: t("state"),
        dataIndex: "thirdOrderStatus",
        key: "thirdOrderStatus",
        align: "center",
        width: 100,
    },
    {
        title: t("l45"),
        dataIndex: "callbackIpAddress",
        key: "callbackIpAddress",
        align: "center",
        width: 180,
    },
    {
        title: t("m573"),
        dataIndex: "callbackParams",
        key: "callbackParams",
        align: "center",
        width: 180,
    },
    {
        title: t("m804"),
        dataIndex: "callbackResult",
        key: "callbackResult",
        align: "center",
        width: 180,
    },
    {
        title: t("n49"),
        dataIndex: "callbackTime",
        key: "callbackTime",
        align: "center",
        width: 180,
    },
    // {
    //     title: t("operation"),
    //     dataIndex: "operate",
    //     key: "operate",
    //     align: "center",
    //     width: 100,
    //     fixed: 'right',
    // },
];
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total: any) => t("total", [total]),
});
const search = () => {
    pagination.value.current = 1;
    query.value.pageNo = 1;
    getList();
}
const getList = async () => {
    loading.value = true;
    const res: any = await queryCallbackPage(query.value).finally(() => (loading.value = false));
    if (res && res.code === "1") {
        dataSource.value = res.data.list;
        pagination.value.total = res.data.total;
        pagination.value.current = query.value.pageNo;
    }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
    pagination.value.current = pag.current;
    pagination.value.pageSize = pag.pageSize;
    query.value.pageNo = pag.current;
    query.value.pageSize = pag.pageSize;
    getList();
};
const resetQuery = () => {
    query.value = {
        pageNo: 1,
        pageSize: 20,
        callbackTimeGte: '', //开始时间
        callbackTimeLte: '', //结束时间
        platformOrderNo: props.orderInfo.platformOrder,
        orderType: props.orderInfo.type,
        thirdOrderNo: undefined,
        thirdOrderStatus: undefined,
    };
    pagination.value.pageSize = 20;
    pagination.value.current = 1;
    getList();
};
onMounted(() => {
    getList();
});
</script>
<style lang="less" scoped></style>
