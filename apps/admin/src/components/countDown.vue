<template>
  <a-row style="align-items: center; margin: 0 0 10px 0">
    <span
      style="
        font-weight: 700;
        font-style: normal;
        font-size: 18px;
        color: #000000;
        border-left: 3px solid #f9a600;
        padding: 0 0 0 5px;
      "
      >{{ title }}</span
    >
    <RightCircleOutlined
      style="
        font-size: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        cursor: pointer;
      "
    />
    <a-col :span="3">
      <a-select
        class="searchstyle"
        v-model:value="appealOrder"
        :options="appealOrders"
        @change="handleIntervalChange"
      >
      </a-select>
    </a-col>
    <a-col :span="2">
      <p>
        <span
          style="
            border-width: 0px;
            display: flex;
            font-weight: 700;
            font-style: normal;
            color: #ff0000;
            font-size: 22px;
          "
          >{{ convertMillisecondsToMinutesSeconds(countDown) }}</span
        >
      </p>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { convertMillisecondsToMinutesSeconds } from "@/utils";
import { RightCircleOutlined } from "@ant-design/icons-vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emits = defineEmits<{
  (e: "zero"): void;
}>();
const props = defineProps({
  title: String,
  defaultTime: {
    type: Number,
    default: 0,
  },
});
const appealOrders = [
  { value: null, label: t("l1") },
  { value: 10 * 1000, label: t("l2") },
  { value: 30 * 1000, label: t("l3") },
  { value: 60 * 1000, label: t("l4") },
  { value: 300 * 1000, label: t("l5") },
  { value: 600 * 1000, label: t("l6") },
];
let timerId: ReturnType<typeof setTimeout> | null = null;
const appealOrder = ref(appealOrders[props.defaultTime].value || null);
const countDown = ref<number>(0);

const handleIntervalChange = (value: number) => {
  stopTimer();
  countDown.value = value;
  if (value) {
    timerId = setTimeout(() => {
      countDownFun();
    }, 1000);
  }
};

const stopTimer = () => {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
};

const countDownFun = () => {
  stopTimer();
  if (!appealOrder.value) return;

  countDown.value -= 1000;

  if (countDown.value <= 0) {
    emits("zero");
    countDown.value = appealOrder.value;
  }

  timerId = setTimeout(countDownFun, 1000);
};

onMounted(() => {
  if(props.defaultTime) {
    countDownFun();
  }
});
onUnmounted(() => {
  stopTimer();
});
</script>

<style lang="less" scoped>
.searchstyle {
  width: calc(100% - 20px);
}
</style>
