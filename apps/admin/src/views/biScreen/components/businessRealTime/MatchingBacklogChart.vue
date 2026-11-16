<template>
  <div class="chart-section">
    <!-- 图三固定秒级展示，不提供天/时/分/秒切换。 -->
    <div ref="chartRef" class="metric-chart large-chart"></div>
  </div>
</template>

<script setup lang="ts">
import type { ECharts } from 'echarts'
import { ref } from 'vue'
import { realtimeMonitorMatchingBacklogPage } from '@/api'
import {
  buildLineWithRipple,
  createRealtimePageQuery,
  fetchRealtimePageData,
  formatNumber,
  getBaseChartOption,
  getNumber,
  normalizeBacklogData,
  useRealtimeChartGroup,
} from './shared'
import type { BacklogMetricPoint, GranularityCountMap, RealtimeFetchContext, TimeGranularity } from './shared'

// 撮合挂单积压监控按需求固定 SECOND，滑动时只按秒级窗口请求历史数据。
const activeGranularity = ref<TimeGranularity>('SECOND')
const chartRef = ref<HTMLDivElement>()
const granularityCountMap: GranularityCountMap = {
  DAY: 10,
  HOUR: 10,
  MINUTE: 10,
  SECOND: 30,
}
// 本组件独立轮询间隔：每次最新数据请求完成后，再等待该时间发起下一次请求。
const POLL_INTERVAL = 12000
// 当前组件独立维护自己的游标分页参数，不和组件一、二、四联动。
const query = ref(createRealtimePageQuery(activeGranularity.value, 0))

// 构建“堆叠柱状图 + 多折线图”：金额走左轴堆叠柱，笔数走右轴折线。
const buildChartOption = (data: BacklogMetricPoint[], startIndex: number, endIndex: number) => {
  const categories = data.map((item) => item.time)
  const displayCount = Math.max(1, endIndex - startIndex + 1)
  const showSymbol = displayCount <= 24

  return {
    ...getBaseChartOption(
      activeGranularity.value,
      '挂单积压深度',
      categories,
      startIndex,
      endIndex,
      108
    ),
    legend: [
      {
        top: 34,
        left: 'center',
        itemWidth: 14,
        itemHeight: 8,
        itemGap: 28,
        data: ['内部订单金额', '快捷提现-UPI金额', '快捷提现-银行卡金额'],
        textStyle: {
          color: '#333',
          fontSize: 10,
        },
      },
      {
        top: 56,
        left: 'center',
        itemWidth: 14,
        itemHeight: 8,
        itemGap: 28,
        data: ['内部订单笔数', '快捷提现-UPI笔数', '快捷提现-银行卡笔数'],
        textStyle: {
          color: '#333',
          fontSize: 10,
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: unknown) => {
        const list = Array.isArray(params) ? params : []
        const axisValue = (list[0] as { axisValue?: string } | undefined)?.axisValue || ''
        const rows = list
          .map((item) => {
            const optionItem = item as { marker?: string; seriesName?: string; value?: number; seriesType?: string }
            const unit = optionItem.seriesType === 'line' ? '笔' : ''
            return `${optionItem.marker || ''}${optionItem.seriesName || ''}: ${formatNumber(
              getNumber(optionItem.value),
              optionItem.seriesType === 'line' ? 0 : 2
            )}${unit}`
          })
          .join('<br/>')
        return axisValue ? `${axisValue}<br/>${rows}` : rows
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '金额',
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
      {
        type: 'value',
        name: '笔数',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#6a6a6a',
          fontSize: 10,
          formatter: (value: number) => formatNumber(value, 0),
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      ...buildLineWithRipple({
        name: '内部订单笔数',
        color: '#3B82F6',
        categories,
        startIndex,
        endIndex,
        yAxisIndex: 1,
        showSymbol,
        data: data.map((item) => item.innerOrderCount),
        lineWidth: 2,
      }),
      {
        name: '内部订单金额',
        type: 'bar',
        stack: 'amount',
        yAxisIndex: 0,
        barMaxWidth: 24,
        itemStyle: { color: '#3B82F6', opacity: 0.5, },
        data: data.map((item) => item.innerOrderAmount),
      },
      ...buildLineWithRipple({
        name: '快捷提现-UPI笔数',
        color: '#22C55E',
        categories,
        startIndex,
        endIndex,
        yAxisIndex: 1,
        showSymbol,
        data: data.map((item) => item.quickUpiCount),
        lineWidth: 2,
      }),
      {
        name: '快捷提现-UPI金额',
        type: 'bar',
        stack: 'amount',
        yAxisIndex: 0,
        barMaxWidth: 24,
        itemStyle: { color: '#22C55E', opacity: 0.5, },
        data: data.map((item) => item.quickUpiAmount),
      },
      ...buildLineWithRipple({
        name: '快捷提现-银行卡笔数',
        color: '#F59E0B',
        categories,
        startIndex,
        endIndex,
        yAxisIndex: 1,
        showSymbol,
        data: data.map((item) => item.quickBankCount),
        lineWidth: 2,
      }),
      {
        name: '快捷提现-银行卡金额',
        type: 'bar',
        stack: 'amount',
        yAxisIndex: 0,
        barMaxWidth: 24,
        itemStyle: { color: '#F59E0B', opacity: 0.5, },
        data: data.map((item) => item.quickBankAmount),
      },
    ],
  }
}

// 统一请求入口：第一页代表最新数据，pageIndex 大于 0 时代表向左滑动加载历史页。
const fetchData = async (granularity: TimeGranularity, pageIndex: number, context?: RealtimeFetchContext) => {
  return fetchRealtimePageData(
    query.value,
    realtimeMonitorMatchingBacklogPage,
    granularity,
    pageIndex,
    normalizeBacklogData,
    context
  )
}

// 注册实时图组逻辑：本组件只有一张图，但仍复用 shared 中的轮询和 dataZoom 分页能力。
useRealtimeChartGroup<BacklogMetricPoint>({
  chartRefs: [chartRef],
  createInitialData: () => [],
  fetchData,
  granularityCountMap,
  getGranularity: () => activeGranularity.value,
  logName: 'dataBusinessRealTime matching backlog',
  pollInterval: POLL_INTERVAL,
  renderCharts: (chartInstances: Array<ECharts | null>, data, startIndex, endIndex) => {
    chartInstances[0]?.setOption(buildChartOption(data, startIndex, endIndex), true)
  },
})
</script>

<style scoped lang="less">
.chart-section {
  // 外层卡片样式在父页面统一添加，这里只处理图表自身宽度。
  width: 100%;
}

.metric-chart {
  width: 100%;
  height: 360px;
  min-height: 300px;
  background: #fff;
}

.large-chart {
  height: 420px;
}

@media (max-width: 768px) {
  .metric-chart,
  .large-chart {
    height: 340px;
  }
}
</style>
