<template>
  <div class="chart-section">
    <!-- 图一支持独立切换时间粒度，不和页面下方其他图表联动。 -->
    <!-- <div class="chart-toolbar">
      <a-radio-group v-model:value="activeGranularity" button-style="solid" option-type="button">
        <a-radio-button value="HOUR">时</a-radio-button>
        <a-radio-button value="MINUTE">分</a-radio-button>
        <a-radio-button value="SECOND">秒</a-radio-button>
      </a-radio-group>
    </div> -->
    <!-- ECharts 挂载容器，实例化和 dataZoom 事件由 useRealtimeChartGroup 统一处理。 -->
    <div ref="chartRef" class="metric-chart online-chart"></div>
  </div>
</template>

<script setup lang="ts">
import type { ECharts } from 'echarts'
import { ref } from 'vue'
import { realtimeMonitorOnlineCountPage } from '@/api'
import {
  buildLineWithRipple,
  createRealtimePageQuery,
  fetchRealtimePageData,
  formatNumber,
  getBaseChartOption,
  getNumber,
  normalizeOnlineData,
  useRealtimeChartGroup,
} from './shared'
import type { GranularityCountMap, OnlineMetricPoint, RealtimeFetchContext, TimeGranularity } from './shared'
import * as echarts from 'echarts'

// 图一默认按秒展示，用户可在顶部切换时/分/秒；切换后会重新请求第一页数据。
const activeGranularity = ref<TimeGranularity>('SECOND')
const chartRef = ref<HTMLDivElement>()
const granularityCountMap: GranularityCountMap = {
  DAY: 30,
  HOUR: 24,
  MINUTE: 60,
  SECOND: 30,
}
// 本组件独立轮询间隔：每次最新数据请求完成后，再等待该时间发起下一次请求。
const POLL_INTERVAL = 2000
// 初始化游标分页 query，firstPage/lastPage/pageSize 等公共参数在 shared 中统一生成。
const query = ref(createRealtimePageQuery(activeGranularity.value, 0))

// 生成实时在线人数面积折线图配置：X 轴使用接口实时 timeKey/time，Y 轴展示在线人数。
const buildChartOption = (data: OnlineMetricPoint[], startIndex: number, endIndex: number) => {
  const categories = data.map((item) => item.time)
  const displayCount = Math.max(1, endIndex - startIndex + 1)

  return {
    ...getBaseChartOption(activeGranularity.value, '在线用户数', categories, startIndex, endIndex, 76),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: '#8c8c8c',
          type: 'dashed',
        },
      },
      formatter: (params: unknown) => {
        const list = Array.isArray(params) ? params : []
        const axisValue = (list[0] as { axisValue?: string } | undefined)?.axisValue || ''
        const item = list[0] as { marker?: string; value?: number } | undefined
        return `${axisValue}<br/>${item?.marker || ''}在线人数: ${formatNumber(getNumber(item?.value), 0)}人`
      },
    },
    yAxis: {
      type: 'value',
      name: '人数',
      position: 'right',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#6a6a6a',
        fontSize: 10,
        formatter: (value: number) => formatNumber(value, 0),
      },
      splitLine: {
        lineStyle: {
          color: '#e9e9e9',
        },
      },
    },
    series: buildLineWithRipple({
      name: '',//在线人数
      color: '#d1a800',
      categories,
      startIndex,
      endIndex,
      showSymbol: displayCount <= 24,
      areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'rgba(255, 215, 0, 0.5)',
        },
        {
          offset: 1,
          color: 'rgba(255, 215, 0, 0)',
        },
      ]),
      data: data.map((item) => item.onlineCount),
      lineWidth: 1,
    }),
  }
}

// 每次最新轮询或历史滑动都会走这里：先更新 query，再请求实时监控接口。
const fetchData = async (granularity: TimeGranularity, pageIndex: number, context?: RealtimeFetchContext) => {
  return fetchRealtimePageData(
    query.value,
    realtimeMonitorOnlineCountPage,
    granularity,
    pageIndex,
    normalizeOnlineData,
    context
  )
}

// 注册图表实时逻辑：负责首屏请求、轮询、向左拉历史、滑回最右刷新最新数据。
useRealtimeChartGroup<OnlineMetricPoint>({
  chartRefs: [chartRef],
  createInitialData: () => [],
  fetchData,
  granularityCountMap,
  getGranularity: () => activeGranularity.value,
  logName: 'dataBusinessRealTime online',
  pollInterval: POLL_INTERVAL,
  renderCharts: (chartInstances: Array<ECharts | null>, data, startIndex, endIndex) => {
    chartInstances[0]?.setOption(buildChartOption(data, startIndex, endIndex), true)
  },
})
</script>

<style scoped lang="less">
.chart-section {
  // 外层尺寸由父页面卡片控制，组件内部只保证图表横向铺满。
  width: 100%;
}

.chart-toolbar {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.metric-chart {
  width: 100%;
  height: 360px;
  min-height: 300px;
  background: #fff;
}

.online-chart {
  height: 420px;
}

@media (max-width: 768px) {
  .chart-toolbar {
    justify-content: flex-start;
    overflow-x: auto;
  }

  .metric-chart {
    height: 340px;
  }
}
</style>
