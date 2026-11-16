<template>
  <div class="trade-chart-group">
    <!-- 组件二的时间粒度独立控制，四张图共享同一个粒度和同一次接口数据。 -->
    <div class="chart-toolbar">
      <a-radio-group v-model:value="activeGranularity" button-style="solid" option-type="button">
        <a-radio-button value="DAY">天</a-radio-button>
        <a-radio-button value="HOUR">时</a-radio-button>
        <a-radio-button value="MINUTE">分</a-radio-button>
        <a-radio-button value="SECOND">秒</a-radio-button>
      </a-radio-group>
    </div>
    <div class="chart-child">
      <!-- 普通业务笔数折线图。 -->
      <div ref="countChartRef" class="metric-chart"></div>
      <!-- 成功业务笔数折线图。 -->
      <div ref="successCountChartRef" class="metric-chart"></div>
      <!-- 普通业务金额柱状图。 -->
      <div ref="amountChartRef" class="metric-chart"></div>
      <!-- 成功业务金额柱状图。 -->
      <div ref="successAmountChartRef" class="metric-chart"></div>
      <!-- 四张图共用的底部滑动条，横跨两列图表。 -->
      <div ref="sharedZoomChartRef" class="shared-zoom-chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ECharts } from 'echarts'
import { ref } from 'vue'
import { realtimeMonitorTradeBusinessPage } from '@/api'
import {
  buildDataZoom,
  buildLineWithRipple,
  createRealtimePageQuery,
  fetchRealtimePageData,
  formatNumber,
  getBaseChartOption,
  getNumber,
  normalizeTradeBusinessData,
  useRealtimeChartGroup,
} from './shared'
import type { GranularityCountMap, RealtimeFetchContext, TimeGranularity, TradeBusinessMetricPoint } from './shared'

// 普通笔数字段 key：用于把 series 配置和归一化后的数据字段强绑定，避免字段名写错。
type CountMetricKey =
  | 'rechargeCount'
  | 'withdrawCount'
  | 'buyCount'
  | 'sellCount'
  | 'arpayCollectCount'
  | 'arpayPaymentCount'

// 普通金额字段 key：字段来自 tradeBusinessPage 接口返回值。
type AmountMetricKey =
  | 'rechargeAmount'
  | 'withdrawAmount'
  | 'buyAmount'
  | 'sellAmount'
  | 'arpayCollectAmount'
  | 'arpayPaymentAmount'

// 成功笔数字段 key：对应截图中的 *SuccessCount 参数。
type SuccessCountMetricKey =
  | 'rechargeSuccessCount'
  | 'withdrawSuccessCount'
  | 'buySuccessCount'
  | 'sellSuccessCount'
  | 'arpayCollectSuccessCount'
  | 'arpayPaymentSuccessCount'

// 成功金额字段 key：对应截图中的 *SuccessAmount 参数。
type SuccessAmountMetricKey =
  | 'rechargeSuccessAmount'
  | 'withdrawSuccessAmount'
  | 'buySuccessAmount'
  | 'sellSuccessAmount'
  | 'arpayCollectSuccessAmount'
  | 'arpayPaymentSuccessAmount'

// 组件二默认按秒展示，顶部切换粒度后四张图会一起重置并重新拉取数据。
const activeGranularity = ref<TimeGranularity>('SECOND')
// 四个 DOM ref 会按顺序传给 shared，renderCharts 中也按相同顺序 setOption。
const countChartRef = ref<HTMLDivElement>()
const amountChartRef = ref<HTMLDivElement>()
const successCountChartRef = ref<HTMLDivElement>()
const successAmountChartRef = ref<HTMLDivElement>()
const sharedZoomChartRef = ref<HTMLDivElement>()
const granularityCountMap: GranularityCountMap = {
  DAY: 30,
  HOUR: 30,
  MINUTE: 30,
  SECOND: 30,
}
// 本组件独立轮询间隔：每次最新数据请求完成后，再等待该时间发起下一次请求。
const POLL_INTERVAL = 1000
// 同一份 query 服务于四张图，因为四张图都来自同一个 tradeBusinessPage 接口。
const query = ref(createRealtimePageQuery(activeGranularity.value, 0))

// 普通笔数图的系列配置：颜色在四张图之间保持一致，便于用户横向对比同一业务类型。
const countSeriesList: Array<{ name: string; key: CountMetricKey; color: string }> = [
  { name: '充值', key: 'rechargeCount', color: '#3B82F6' },
  { name: '提现', key: 'withdrawCount', color: '#2EBD85' },
  { name: '买入', key: 'buyCount', color: '#F0B90B' },
  { name: '卖出', key: 'sellCount', color: '#F6465D' },
  { name: 'ARPAY代收', key: 'arpayCollectCount', color: '#8B5CF6' },
  { name: 'ARPAY代付', key: 'arpayPaymentCount', color: '#06B6D4' },
]

// 普通金额图的系列配置：柱状图展示金额规模，和上方笔数折线共用 X 轴时间。
const amountSeriesList: Array<{ name: string; key: AmountMetricKey; color: string }> = [
  { name: '充值', key: 'rechargeAmount', color: '#3B82F6' },
  { name: '提现', key: 'withdrawAmount', color: '#2EBD85' },
  { name: '买入', key: 'buyAmount', color: '#F0B90B' },
  { name: '卖出', key: 'sellAmount', color: '#F6465D' },
  { name: 'ARPAY代收', key: 'arpayCollectAmount', color: '#8B5CF6' },
  { name: 'ARPAY代付', key: 'arpayPaymentAmount', color: '#06B6D4' },
]

// 成功笔数图的系列配置：只展示已经成功的订单笔数。
const successCountSeriesList: Array<{ name: string; key: SuccessCountMetricKey; color: string }> = [
  { name: '充值', key: 'rechargeSuccessCount', color: '#3B82F6' },
  { name: '提现', key: 'withdrawSuccessCount', color: '#2EBD85' },
  { name: '买入', key: 'buySuccessCount', color: '#F0B90B' },
  { name: '卖出', key: 'sellSuccessCount', color: '#F6465D' },
  { name: 'ARPAY代收', key: 'arpayCollectSuccessCount', color: '#8B5CF6' },
  { name: 'ARPAY代付', key: 'arpayPaymentSuccessCount', color: '#06B6D4' },
]

// 成功金额图的系列配置：只展示已经成功的订单金额。
const successAmountSeriesList: Array<{ name: string; key: SuccessAmountMetricKey; color: string }> = [
  { name: '充值', key: 'rechargeSuccessAmount', color: '#3B82F6' },
  { name: '提现', key: 'withdrawSuccessAmount', color: '#2EBD85' },
  { name: '买入', key: 'buySuccessAmount', color: '#F0B90B' },
  { name: '卖出', key: 'sellSuccessAmount', color: '#F6465D' },
  { name: 'ARPAY代收', key: 'arpayCollectSuccessAmount', color: '#8B5CF6' },
  { name: 'ARPAY代付', key: 'arpayPaymentSuccessAmount', color: '#06B6D4' },
]

// 普通笔数折线图：多条业务线同图展示，tooltip 中统一补“笔”单位。
const buildCountChartOption = (data: TradeBusinessMetricPoint[], startIndex: number, endIndex: number) => {
  const categories = data.map((item) => item.time)
  const displayCount = Math.max(1, endIndex - startIndex + 1)
  const showSymbol = displayCount <= 24

  return {
    ...getBaseChartOption(activeGranularity.value, '总笔数趋势', categories, startIndex, endIndex, 92, 'auto', false),
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
        const rows = list
          .map((item) => {
            const optionItem = item as { marker?: string; seriesName?: string; value?: number }
            return `${optionItem.marker || ''}${optionItem.seriesName || ''}: ${formatNumber(
              getNumber(optionItem.value),
              0
            )}笔`
          })
          .join('<br/>')
        return axisValue ? `${axisValue}<br/>${rows}` : rows
      },
    },
    yAxis: {
      type: 'value',
      name: '笔数',
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
    series: countSeriesList.flatMap((series) =>
      buildLineWithRipple({
        name: series.name,
        color: series.color,
        lineWidth: 2,
        lineOpacity: 0.5,
        // lineType: 'dashed',
        categories,
        startIndex,
        endIndex,
        showSymbol,
        data: data.map((item) => item[series.key]),
      })
    ),
  }
}

// 成功笔数折线图：结构和普通笔数图一致，但读取 *SuccessCount 字段。
const buildSuccessCountChartOption = (data: TradeBusinessMetricPoint[], startIndex: number, endIndex: number) => {
  const categories = data.map((item) => item.time)
  const displayCount = Math.max(1, endIndex - startIndex + 1)
  const showSymbol = displayCount <= 24

  return {
    ...getBaseChartOption(activeGranularity.value, '成功笔数趋势', categories, startIndex, endIndex, 92, 'auto', false),
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
        const rows = list
          .map((item) => {
            const optionItem = item as { marker?: string; seriesName?: string; value?: number }
            return `${optionItem.marker || ''}${optionItem.seriesName || ''}: ${formatNumber(
              getNumber(optionItem.value),
              0
            )}笔`
          })
          .join('<br/>')
        return axisValue ? `${axisValue}<br/>${rows}` : rows
      },
    },
    yAxis: {
      type: 'value',
      name: '成功笔数',
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
    series: successCountSeriesList.flatMap((series) =>
      buildLineWithRipple({
        name: series.name,
        color: series.color,
        categories,
        startIndex,
        lineWidth: 2.5,
        lineOpacity: 1,
        lineType: 'solid',
        endIndex,
        showSymbol,
        data: data.map((item) => item[series.key]),
      })
    ),
  }
}

// 普通金额柱状图：金额用柱形表达规模，展示点较少时在柱顶显示数值标签。
const buildAmountChartOption = (data: TradeBusinessMetricPoint[], startIndex: number, endIndex: number) => {
  const categories = data.map((item) => item.time)
  const displayCount = Math.max(1, endIndex - startIndex + 1)
  const showValueLabel = displayCount <= 15

  return {
    ...getBaseChartOption(activeGranularity.value, '总金额趋势', categories, startIndex, endIndex, 92, 'auto', false),
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
            const optionItem = item as { marker?: string; seriesName?: string; value?: number }
            return `${optionItem.marker || ''}${optionItem.seriesName || ''}: ${formatNumber(
              getNumber(optionItem.value),
              2
            )}`
          })
          .join('<br/>')
        return axisValue ? `${axisValue}<br/>${rows}` : rows
      },
    },
    yAxis: {
      type: 'value',
      name: '金额',
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
    series: amountSeriesList.map((series) => ({
      name: series.name,
      type: 'bar',
      stack: 'amount',
      barMaxWidth: 14,
      itemStyle: {
        color: series.color,
        opacity: 0.5,
        borderWidth: 1.5,
        borderType: 'dashed',
      },
      emphasis: {
        focus: 'series',
      },
      label: {
        show: showValueLabel,
        position: 'top',
        color: '#4d4d4d',
        fontSize: 10,
        formatter: (params: { value: number }) => formatNumber(getNumber(params.value), 0),
      },
      data: data.map((item) => item[series.key]),
    })),
  }
}

// 成功金额柱状图：结构和普通金额图一致，但读取 *SuccessAmount 字段。
const buildSuccessAmountChartOption = (data: TradeBusinessMetricPoint[], startIndex: number, endIndex: number) => {
  const categories = data.map((item) => item.time)
  const displayCount = Math.max(1, endIndex - startIndex + 1)
  const showValueLabel = displayCount <= 15

  return {
    ...getBaseChartOption(activeGranularity.value, '成功金额趋势', categories, startIndex, endIndex, 92, 'auto', false),
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
            const optionItem = item as { marker?: string; seriesName?: string; value?: number }
            return `${optionItem.marker || ''}${optionItem.seriesName || ''}: ${formatNumber(
              getNumber(optionItem.value),
              2
            )}`
          })
          .join('<br/>')
        return axisValue ? `${axisValue}<br/>${rows}` : rows
      },
    },
    yAxis: {
      type: 'value',
      name: '成功金额',
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
    series: successAmountSeriesList.map((series) => ({
      name: series.name,
      type: 'bar',
      stack: 'amount',
      barMaxWidth: 16,
      itemStyle: {
        color: series.color,
        opacity: 1,
        borderWidth: 2,
        borderType: 'solid',
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 8,
          shadowColor: series.color,
        },
      },
      label: {
        show: showValueLabel,
        position: 'top',
        color: '#4d4d4d',
        fontSize: 10,
        formatter: (params: { value: number }) => formatNumber(getNumber(params.value), 0),
      },
      data: data.map((item) => item[series.key]),
    })),
  }
}

const buildSharedZoomChartOption = (data: TradeBusinessMetricPoint[], startIndex: number, endIndex: number) => {
  const categories = data.map((item) => item.time)

  return {
    animation: false,
    backgroundColor: '#fff',
    tooltip: {
      show: false,
    },
    grid: {
      left: '6%',
      right: '5%',
      top: 0,
      bottom: 36,
      height: 1,
    },
    xAxis: {
      type: 'category',
      data: categories,
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 0,
      max: 1,
    },
    dataZoom: buildDataZoom(categories.length, startIndex, endIndex, {
      showInside: false,
      sliderBottom: 18,
      sliderHeight: 16,
    }),
    series: [
      {
        type: 'line',
        data: categories.map(() => 0),
        symbol: 'none',
        silent: true,
        lineStyle: {
          opacity: 0,
        },
        itemStyle: {
          opacity: 0,
        },
      },
    ],
  }
}

// 统一数据请求入口：轮询第一页、向左拉历史页、切换粒度都会复用该函数。
const fetchData = async (granularity: TimeGranularity, pageIndex: number, context?: RealtimeFetchContext) => {
  return fetchRealtimePageData(
    query.value,
    realtimeMonitorTradeBusinessPage,
    granularity,
    pageIndex,
    normalizeTradeBusinessData,
    context
  )
}

// 四张图共用一个图组逻辑：任意一张图滑动时，其他三张图同步同一时间窗口。
useRealtimeChartGroup<TradeBusinessMetricPoint>({
  chartRefs: [countChartRef, amountChartRef, successCountChartRef, successAmountChartRef, sharedZoomChartRef],
  createInitialData: () => [],
  fetchData,
  granularityCountMap,
  getGranularity: () => activeGranularity.value,
  logName: 'dataBusinessRealTime trade business',
  pollInterval: POLL_INTERVAL,
  renderCharts: (chartInstances: Array<ECharts | null>, data, startIndex, endIndex) => {
    chartInstances[0]?.setOption(buildCountChartOption(data, startIndex, endIndex), true)
    chartInstances[1]?.setOption(buildAmountChartOption(data, startIndex, endIndex), true)
    chartInstances[2]?.setOption(buildSuccessCountChartOption(data, startIndex, endIndex), true)
    chartInstances[3]?.setOption(buildSuccessAmountChartOption(data, startIndex, endIndex), true)
    chartInstances[4]?.setOption(buildSharedZoomChartOption(data, startIndex, endIndex), true)
  },
})
</script>

<style scoped lang="less">
.trade-chart-group {
  // 组件二内部按纵向排列四张图，父页面负责外层边框和阴影。
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.chart-toolbar {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-chart {
  width: 100%;
  height: 360px;
  min-height: 300px;
  background: #fff;
}

.shared-zoom-chart {
  grid-column: 1 / -1;
  width: 100%;
  height: 56px;
  min-height: 56px;
  background: #fff;
}

.chart-child {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 768px) {
  .chart-toolbar {
    justify-content: flex-start;
    overflow-x: auto;
  }

  .chart-child {
    grid-template-columns: 1fr;
  }

  .metric-chart {
    height: 340px;
  }

  .shared-zoom-chart {
    grid-column: 1;
  }
}
</style>
