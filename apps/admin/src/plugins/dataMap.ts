import dayjs from "dayjs";
import { reactive, ref } from "vue";
import i18n from "@/i18n";
import { TablePaginationConfig } from "ant-design-vue";

export const today = dayjs();
export const searchStyle = "width: calc(100% - 20px)";
export const todayStart = today.startOf("day").format("YYYY-MM-DD HH:mm:ss");
export const todayEnd = today.endOf("day").format("YYYY-MM-DD HH:mm:ss");

export const usePagination = (isChange:boolean = true) => {
  const paginationConfig = reactive<TablePaginationConfig>({
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: isChange,
    current: 1,
    pageSize: 20,
    total: 0,
    showTotal: (total: any) => i18n.global.t("total", [total]),
  });

  return {
    paginationConfig,
  };
};

export const timeType = {
  1: "下单时间",
  2: "完成时间",
};

export function getStartAndEndOfDay() {
  const time = localStorage.getItem("serverTime") || getIndiaLocalTime().slice(0, 16);
  // 将传入的时间字符串解析为 Day.js 对象
  const inputTime = time?.includes("-") ? dayjs(time) : dayjs();

  // 获取当天的开始时间（凌晨）
  const startOfDay = inputTime.startOf("day");

  // 获取当天的结束时间（午夜）
  const endOfDay = inputTime.endOf("day");

  // 返回开始时间和结束时间
  return [
    startOfDay.format("YYYY-MM-DD HH:mm:ss"),
    endOfDay.format("YYYY-MM-DD HH:mm:ss"),
    inputTime.format("YYYY-MM-DD"),
    time,
  ];
}

export function getIndiaLocalTime() {
  const localDate = ref(new Date());

  const indiaParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(localDate.value);

  const indiaTimeMap = indiaParts.reduce((acc: any, part: any) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

// 格式化为 yyyy-mm-dd hh:mm:ss
  const indiaTime = `${indiaTimeMap.year}-${indiaTimeMap.month}-${indiaTimeMap.day} ${indiaTimeMap.hour}:${indiaTimeMap.minute}:${indiaTimeMap.second}`;

  return indiaTime;
}
