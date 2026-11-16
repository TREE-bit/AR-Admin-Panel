<template>
  <div class="myChart" ref="myChart"></div>
  <!-- <v-chart class="chart" :option="option" autoresize /> -->
</template>
<script lang="ts" setup>
import * as echarts from "echarts";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { currency,thousand } from "@/utils";
const { t } = useI18n();
const myCharts = ref<any>();
const myChart = ref<any>();
const props = defineProps({
  dataList: {
    default: () => "",
  },
  title: {
    default: () => "",
  },
});
const options = {
  title: {
    text: props.title,
    left: "left",
    top: 0,
  },
  grid: {
    top: 70,
    bottom: 30,
  },
  tooltip: {
    formatter: (params: any) => {
      const list: any = [];
      params.dimensionNames.forEach((element: any, index: any) => {
        if (element == "dateTime") {
          list.push(`<div>${params.value[index]}</div>`);
        } else if(element == "actualMoney") {
          list.push(`<div>${t(element)}:${currency(params.value[index],false)}</div>`);
        }else {
          list.push(`<div>${t(element)}:${thousand(params.value[index])}</div>`);
        }
      });
      return list.join("");
    },
  },
  legend: {
    type: "scroll",
    top: 24,
    formatter: function (name: any) {
      return t(name);
    },
    selectedMode: 'single',
  },
  dataset: {
    source: [],
  },
  xAxis: { type: "category" },
  yAxis: { gridIndex: 0 },
  series: [],
};
watch(
  () => props.dataList,
  (nData: any) => {
    if (!nData[0]) return;
    const key: any = Object.keys(nData[0]);
    const sourceMap: any = {};
    const series:any = [];
    key.forEach((element: any) => {
      sourceMap[element] = [element];
      element !== 'dateTime' && series.push({
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      });
    });
    nData.forEach((e: any) => {
      key.forEach((element: any) => {
        sourceMap[element].push(e[element]);
      });
    });
    const source: any = Object.values(sourceMap);
    options.dataset.source = source;
    options.series = series;
    myCharts.value?.setOption(options);
  },
  { immediate: true }
);
const handleResize = () => {
  if (myCharts.value) {
    myCharts.value.resize();
  }
};

onMounted(() => {
  myCharts.value = echarts.init(myChart.value);
  myCharts.value.setOption(options);
  window.addEventListener("resize", handleResize);
  // myChartD.value.setOption(option.value);
});
onUnmounted(() => {
  // Remove event listener when component is destroyed
  window.removeEventListener("resize", handleResize);
});
</script>
<style lang="less" scoped>
.myChart {
  height: 400px;
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 10px;
}
</style>
