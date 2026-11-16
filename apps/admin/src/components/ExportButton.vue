<template>
  <a-popconfirm
    :title="$t('n1218')"
    :ok-text="$t('b9')"
    :cancel-text="$t('b10')"
    @confirm="handleExport"
    :confirm-loading="loading"
  >
    <a-button
      type="primary"
      :loading="loading"
      v-permission="permission"
    >
      <ExportOutlined />
      {{ label || $t("export") }}
    </a-button>
  </a-popconfirm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import { ExportOutlined } from "@ant-design/icons-vue";
import { replaceEmptyWithUndefined } from "@/utils/index"; // 你已有的方法
import { useI18n } from "vue-i18n";
import { getIndiaLocalTime } from "@/plugins/dataMap";
import { useRoute } from "vue-router";
import { getExportFieldsByPath } from "@/hooks/useTableColumnDrawer";

const indiaLocalTimeDate = ref(getIndiaLocalTime());
interface Props {
  query: any; // 传入页面的 query（ref 或 reactive）
  api: (params: any) => Promise<any>; // 传入导出接口
  permission: string; // 权限字符串
  handleQuery?: (q: any) => any; // 可选：特殊参数处理函数
  handleQueryFields?: (q: any) => any; // 兼容历史参数名
  enableExportFields?: boolean; // 是否启用按展示列导出字段
  label?: string; // 可选：按钮文案，默认「导出」
}

const props = defineProps<Props>();
const { t } = useI18n();
const route = useRoute();

const loading = ref(false);
const s = "23:50";
const e = "00:10";

const handleExport = async () => {
  indiaLocalTimeDate.value = getIndiaLocalTime();
  const isCanExport = isTimeInRange(indiaLocalTimeDate.value, s, e);
  if (isCanExport) {
    message.error(t("n1220", { s, e })); // “请避开每日23:50-00:10的时间段进行导出操作”
    return;
  }

  let params: any = replaceEmptyWithUndefined(props.query.value ?? props.query);

  // 如果有额外处理函数，则执行
  const queryHandler = props.handleQuery || props.handleQueryFields;
  if (queryHandler) {
    params = queryHandler(params);
  }
  if (
    props.enableExportFields &&
    (!Array.isArray(params.exportFields) || params.exportFields.length === 0)
  ) {
    const autoExportFields = getExportFieldsByPath(route.path);
    if (autoExportFields && autoExportFields.length > 0) {
      params.exportFields = autoExportFields;
    }
  }

  loading.value = true;
  try {
    const res: any = await props.api(params);
    if (res && res.code == "1") {
      message.success(t("n545"));
    }
  } finally {
    loading.value = false;
  }
};

function isTimeInRange(dateTimeStr: string, start: string, end: string) {
  let hour: number, minute: number;

  // 尝试支持多种时间格式
  if (dateTimeStr.includes(" ")) {
    const timePart = dateTimeStr.split(" ")[1];
    [hour, minute] = timePart.split(":").map(Number);
  } else if (dateTimeStr.includes("T")) {
    const timePart = dateTimeStr.split("T")[1];
    [hour, minute] = timePart.split(":").map(Number);
  } else {
    [hour, minute] = dateTimeStr.split(":").map(Number);
  }

  const toMin = (h: number, m: number) => h * 60 + m;

  const target = toMin(hour, minute);
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startMin = toMin(startH, startM);
  const endMin = toMin(endH, endM);

  // 普通区间
  if (startMin <= endMin) {
    return target >= startMin && target <= endMin;
  }

  // 跨天区间
  return target >= startMin || target <= endMin;
}
</script>
