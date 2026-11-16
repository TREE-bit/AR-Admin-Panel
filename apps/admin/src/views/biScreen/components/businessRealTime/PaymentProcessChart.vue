<template>
  <div class="chart-section">
    <!-- 图四固定秒级展示，不提供粒度切换控件。 -->
    <div ref="chartRef" class="metric-chart large-chart"></div>
  </div>
</template>

<script setup lang="ts">
import type { ECharts } from 'echarts'
import { ref } from 'vue'
import { realtimeMonitorPaymentProcessPage } from '@/api'
import {
  buildLineWithRipple,
  createRealtimePageQuery,
  fetchRealtimePageData,
  formatNumber,
  getBaseChartOption,
  getNumber,
  normalizePaymentData,
  useRealtimeChartGroup,
} from './shared'
import type { GranularityCountMap, PaymentMetricPoint, RealtimeFetchContext, TimeGranularity } from './shared'

// 支付流程进行中订单监控固定 SECOND，保持高频实时观察。
const activeGranularity = ref<TimeGranularity>('SECOND')
const chartRef = ref<HTMLDivElement>()
const granularityCountMap: GranularityCountMap = {
  DAY: 10,
  HOUR: 10,
  MINUTE: 10,
  SECOND: 20,
}
// 本组件独立轮询间隔：每次最新数据请求完成后，再等待该时间发起下一次请求。
const POLL_INTERVAL = 12000
// 当前组件独立维护 query，滑动不会影响其他组件的分页状态。
const query = ref(createRealtimePageQuery(activeGranularity.value, 0))

// 构建双轴对比图：左轴为笔数折线，右轴为金额并排柱状图。
const buildChartOption = (data: PaymentMetricPoint[], startIndex: number, endIndex: number) => {
  const categories = data.map((item) => item.time)
  const displayCount = Math.max(1, endIndex - startIndex + 1)
  const showSymbol = displayCount <= 24

  return {
    ...getBaseChartOption(activeGranularity.value, '支付处理状态', categories, startIndex, endIndex, 82),
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
        name: '笔数',
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
        name: '金额',
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
        name: '待支付笔数',
        color: '#F59E0B',
        categories,
        startIndex,
        endIndex,
        yAxisIndex: 0,
        showSymbol,
        data: data.map((item) => item.waitingPaymentCount),
        lineWidth: 2,
      }),
      {
        name: '待支付金额',
        type: 'bar',
        stack: 'amount',
        yAxisIndex: 1,
        barMaxWidth: 20,
        itemStyle: { color: '#F59E0B', opacity: 0.5, },
        data: data.map((item) => item.waitingPaymentAmount),
      },
      ...buildLineWithRipple({
        name: '确认中笔数',
        color: '#6366F1',
        categories,
        startIndex,
        endIndex,
        yAxisIndex: 0,
        showSymbol,
        data: data.map((item) => item.confirmingCount),
        lineWidth: 2,
      }),
      {
        name: '确认中金额',
        type: 'bar',
        stack: 'amount',
        yAxisIndex: 1,
        barMaxWidth: 20,
        itemStyle: { color: '#6366F1', opacity: 0.5, },
        data: data.map((item) => item.confirmingAmount),
      },
    ],
  }
}

// 统一请求入口：根据 pageIndex 决定请求最新数据还是历史页数据。
const fetchData = async (granularity: TimeGranularity, pageIndex: number, context?: RealtimeFetchContext) => {
  return fetchRealtimePageData(
    query.value,
    realtimeMonitorPaymentProcessPage,
    granularity,
    pageIndex,
    normalizePaymentData,
    context
  )
}

// 注册实时图组逻辑：负责轮询、滑动停止轮询、滑回最右侧恢复最新请求。
useRealtimeChartGroup<PaymentMetricPoint>({
  chartRefs: [chartRef],
  createInitialData: () => [],
  fetchData,
  granularityCountMap,
  getGranularity: () => activeGranularity.value,
  logName: 'dataBusinessRealTime payment process',
  pollInterval: POLL_INTERVAL,
  renderCharts: (chartInstances: Array<ECharts | null>, data, startIndex, endIndex) => {
    chartInstances[0]?.setOption(buildChartOption(data, startIndex, endIndex), true)
  },
})
</script>

<style scoped lang="less">
.chart-section {
  // 外层边框和阴影由父页面统一提供，组件内部只保证图表容器铺满。
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
