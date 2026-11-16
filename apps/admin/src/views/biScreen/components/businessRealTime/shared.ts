import * as echarts from 'echarts'
import { onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import { message } from "ant-design-vue";

// 接口约定的时间粒度枚举：组件一、二可切换，组件三、四固定使用 SECOND。
export type TimeGranularity = 'DAY' | 'HOUR' | 'MINUTE' | 'SECOND'
export type GranularityCountMap = Record<TimeGranularity, number>
export type RealtimeRequestCountMap = Record<TimeGranularity, number>

// 实时监控接口的 response 结构在不同接口中可能略有差异，这里只保留图表需要判断的通用字段。
export type ChartApiResponse = {
  code?: string | number
  status?: string | number | boolean
  data?: unknown
  extend?: unknown
  list?: unknown
  records?: unknown
  rows?: unknown
  [key: string]: unknown
}

// ECharts dataZoom 事件字段：拖动底部滑块或触控横向滑动时，用于计算当前可视窗口。
export type DataZoomEventPayload = {
  start?: number
  end?: number
  startValue?: number | string
  endValue?: number | string
  batch?: DataZoomEventPayload[]
}

// 图一：实时在线人数，只需要时间与在线人数两个维度。
export type OnlineMetricPoint = {
  time: string
  onlineCount: number
}

// 图二：交易业务监控。普通指标和成功指标共用同一个 tradeBusinessPage 接口数据源。
export type TradeBusinessMetricPoint = {
  time: string
  rechargeCount: number
  rechargeAmount: number
  rechargeSuccessCount: number
  rechargeSuccessAmount: number
  withdrawCount: number
  withdrawAmount: number
  withdrawSuccessCount: number
  withdrawSuccessAmount: number
  buyCount: number
  buyAmount: number
  buySuccessCount: number
  buySuccessAmount: number
  sellCount: number
  sellAmount: number
  sellSuccessCount: number
  sellSuccessAmount: number
  arpayCollectCount: number
  arpayCollectAmount: number
  arpayCollectSuccessCount: number
  arpayCollectSuccessAmount: number
  arpayPaymentCount: number
  arpayPaymentAmount: number
  arpayPaymentSuccessCount: number
  arpayPaymentSuccessAmount: number
}

// 图三：撮合挂单积压监控，金额用堆叠柱状图，笔数用多折线展示。
export type BacklogMetricPoint = {
  time: string
  innerOrderCount: number
  innerOrderAmount: number
  quickUpiCount: number
  quickUpiAmount: number
  quickBankCount: number
  quickBankAmount: number
}

// 图四：支付流程进行中订单监控，笔数走左轴折线，金额走右轴柱状图。
export type PaymentMetricPoint = {
  time: string
  waitingPaymentCount: number
  waitingPaymentAmount: number
  confirmingCount: number
  confirmingAmount: number
}

// 通用实时图表编排参数：组件只负责提供数据请求与渲染，滑动/轮询/历史分页在 shared 内统一处理。
type UseRealtimeChartGroupOptions<T> = {
  chartRefs: Ref<HTMLDivElement | undefined>[]
  createInitialData: (granularity: TimeGranularity) => T[]
  fetchData: (granularity: TimeGranularity, pageIndex: number, context?: RealtimeFetchContext) => Promise<T[]>
  granularityCountMap: GranularityCountMap
  getGranularity: () => TimeGranularity
  logName: string
  pollInterval: number
  renderCharts: (chartInstances: Array<echarts.ECharts | null>, data: T[], startIndex: number, endIndex: number) => void
}

export type RealtimeFetchContext = {
  shouldApplyResponse?: () => boolean
}

// 时间轴标签模式：
// auto 按常规密度显示；
// edge 只显示当前窗口首尾，适合极窄卡片；
// edge 只显示当前窗口首尾，适合极窄卡片。
type AxisLabelMode = 'auto' | 'edge'
type DataZoomOptions = {
  showInside?: boolean
  showSlider?: boolean
  sliderBottom?: number
  sliderHeight?: number
}

// 统一轮询开关：为 false 时保留首屏请求和滑动逻辑，但不会自动续请求。
export const ENABLE_REALTIME_POLLING = true
// 历史游标分页上限：向左浏览时最多再拉取 20 页历史数据，避免无限追加缓存。
export const MAX_HISTORY_PAGE = 20

// X 轴左侧留白触发请求
const LEFT_LOAD_MORE_THRESHOLD_PX = 50;
// 天/时/分粒度数据变化较慢，轮询时在组件自身间隔基础上额外增加 20 秒。
const SLOW_GRANULARITY_POLL_INTERVAL_OFFSET = 20000

// 接口 pageSize 按时间粒度统一配置，不和各组件图表可视点数 granularityCountMap 耦合。
export const REALTIME_REQUEST_COUNT_MAP: RealtimeRequestCountMap = {
  DAY: 60,
  HOUR: 60,
  MINUTE: 60,
  SECOND: 60,
}

const padTimeNumber = (value: number) => String(value).padStart(2, '0')

// 获取当前粒度的可视点数，dataZoom 会用它锁定窗口宽度。
export const getGranularityCount = (granularity: TimeGranularity, granularityCountMap: GranularityCountMap) => {
  return granularityCountMap[granularity]
}

// 获取接口 pageSize：最新页和历史上一页都按统一粒度配置请求。
export const getRequestDataCount = (
  granularity: TimeGranularity,
  requestCountMap: RealtimeRequestCountMap = REALTIME_REQUEST_COUNT_MAP
) => {
  return requestCountMap[granularity]
}

const getPollIntervalByGranularity = (baseInterval: number, granularity: TimeGranularity) => {
  return granularity === 'SECOND' ? baseInterval : baseInterval + SLOW_GRANULARITY_POLL_INTERVAL_OFFSET
}

// 金额、笔数等数值统一格式化，避免 tooltip 和坐标轴出现 NaN 或小数位不一致。
export const formatNumber = (value: number, digits = 0) => {
  return Number(value || 0).toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

// 创建实时监控的游标分页查询参数。pageNo 仅作为前端内部页索引，发请求前会被移除。
export const createRealtimePageQuery = (
  granularity: TimeGranularity,
  pageIndex = 0
) => ({
  granularity,
  pageNo: -pageIndex,
  pageSize: getRequestDataCount(granularity),
  asc: false,
  firstPage: false,
  lastPage: pageIndex === 0,
  direction: pageIndex === 0 ? '' : 'prev',
  nextColValue: '',
  nextCursorId: '',
  prevColValue: '',
  prevCursorId: '',
})

// 每次请求前同步 query：切换粒度、拉最新数据、拉历史数据都会通过这里更新 pageSize 和方向。
export const applyRealtimePageQuery = (
  query: Record<string, any>,
  granularity: TimeGranularity,
  pageIndex = 0
) => {
  query.granularity = granularity
  query.pageNo = -pageIndex
  query.pageSize = getRequestDataCount(granularity)
  query.asc = false
  query.firstPage = false
  query.lastPage = pageIndex === 0
  query.direction = pageIndex === 0 ? '' : 'prev'
}

// 当前接口使用游标分页，不应把前端内部 pageNo 透传给后端。
export const removeInternalPageNo = (query: Record<string, any>) => {
  const { pageNo, ...restQuery } = query
  return restQuery
}

// 实时看板请求不经过 useTableData：这里复用其空字符串清理规则，并移除前端内部 pageNo。
const getRealtimeRequestQuery = (query: Record<string, any>, pageIndex: number) => {
  const requestQuery = removeInternalPageNo({ ...query })

  if (pageIndex === 0) {
    requestQuery.nextColValue = undefined
    requestQuery.nextCursorId = undefined
    requestQuery.prevColValue = undefined
    requestQuery.prevCursorId = undefined
  }

  Object.keys(requestQuery).forEach((key) => {
    if (requestQuery[key] === '') requestQuery[key] = undefined
  })

  return requestQuery
}

const getResponseExtend = (response: ChartApiResponse) => {
  if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    const nestedData = response.data as ChartApiResponse
    if (nestedData.extend && typeof nestedData.extend === 'object') {
      return nestedData.extend as Record<string, unknown>
    }
  }

  if (response.extend && typeof response.extend === 'object') {
    return response.extend as Record<string, unknown>
  }

  return {}
}

const syncRealtimeCursorQuery = (query: Record<string, any>, response: ChartApiResponse) => {
  const extend = getResponseExtend(response)
  const cursorKeys = ['nextColValue', 'nextCursorId', 'prevColValue', 'prevCursorId'] as const

  cursorKeys.forEach((key) => {
    query[key] = extend[key] ?? ''
  })
}

const getRealtimePayloadList = (response: ChartApiResponse, query: Record<string, any>) => {
  const payload = getPayloadList(response)
  return query.lastPage === true ? payload.slice(0, -1) : payload
}

export const fetchRealtimePageData = async <T>(
  query: Record<string, any>,
  api: (params: any) => Promise<any>,
  granularity: TimeGranularity,
  pageIndex: number,
  normalizeData: (
    payload: unknown[],
    granularity: TimeGranularity,
    pageIndex: number
  ) => T[],
  context?: RealtimeFetchContext
) => {
  applyRealtimePageQuery(query, granularity, pageIndex)

  const response = (await api(getRealtimeRequestQuery(query, pageIndex))) as ChartApiResponse
  if (!isSuccessResponse(response)) return []
  if (context?.shouldApplyResponse && !context.shouldApplyResponse()) return []

  syncRealtimeCursorQuery(query, response)

  return normalizeData(getRealtimePayloadList(response, query), granularity, pageIndex)
}

// 无时间字段时生成兜底时间标签，保证空数据字段不会导致 X 轴断裂。
const formatDateLabel = (date: Date, granularity: TimeGranularity) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = padTimeNumber(date.getHours())
  const minute = padTimeNumber(date.getMinutes())
  const second = padTimeNumber(date.getSeconds())

  if (granularity === 'DAY') return `${year}-${padTimeNumber(month)}-${padTimeNumber(day)}`
  if (granularity === 'HOUR') return `${hour}:00`
  if (granularity === 'MINUTE') return `${hour}:${minute}`
  return `${hour}:${minute}:${second}`
}

// 根据粒度和索引反推默认时间：历史页 pageIndex 越大，时间整体越早。
const getDefaultLabel = (
  granularity: TimeGranularity,
  index: number,
  totalCount: number,
  pageIndex = 0
) => {
  const date = new Date()
  const offset = pageIndex * totalCount + totalCount - index - 1

  if (granularity === 'DAY') date.setDate(date.getDate() - offset)
  if (granularity === 'HOUR') date.setHours(date.getHours() - offset, 0, 0, 0)
  if (granularity === 'MINUTE') date.setMinutes(date.getMinutes() - offset, 0, 0)
  if (granularity === 'SECOND') date.setSeconds(date.getSeconds() - offset, 0)

  return formatDateLabel(date, granularity)
}

// 接口字段可能返回字符串或空值，这里统一转成有限数字，非法值按 0 处理。
export const getNumber = (value: unknown) => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

// 折线配置参数：各组件只传入名称、颜色、数据和坐标轴信息，动画细节统一在 shared 中维护。
type LineRippleOptions = {
  categories: string[]
  data: number[]
  name: string
  color: string
  startIndex: number
  endIndex: number
  yAxisIndex?: number
  showSymbol?: boolean
  symbolSize?: number
  lineWidth?: number
  lineOpacity?: number
  lineType?: 'solid' | 'dashed' | 'dotted'
  areaColor?: string | echarts.graphic.LinearGradient
}

// 找到整条数据里最后一个有效点，用作扩散圆点的位置；历史滑动时不再把动画移动到当前窗口末尾。
const getLastDataPoint = (categories: string[], data: number[]) => {
  const safeEndIndex = Math.min(categories.length - 1, data.length - 1)

  for (let index = safeEndIndex; index >= 0; index -= 1) {
    const value = Number(data[index])
    if (Number.isFinite(value)) {
      return {
        category: categories[index],
        value,
      }
    }
  }

  return null
}

// 构建“真实折线 + 末尾扩散圆点”两段 series：
// 第一段用直线段连接相邻数据点，负责数据展示和 tooltip；
// 第二段是静默 effectScatter，只在折线末尾做实时扩散动画，不干扰 tooltip 与图例。
export const buildLineWithRipple = ({
  categories,
  data,
  name,
  color,
  yAxisIndex = 0,
  showSymbol = false,
  symbolSize = 5,
  lineWidth = 2,
  lineOpacity = 1,
  lineType = 'solid',
  areaColor,
}: LineRippleOptions) => {
  const lastPoint = getLastDataPoint(categories, data)
  const baseAnimation = {
    animationDuration: 700,
    animationDurationUpdate: 700,
    animationEasing: 'cubicOut',
    animationEasingUpdate: 'cubicOut',
  }

  return [
    {
      name,
      type: 'line',
      yAxisIndex,
      smooth: false,
      symbol: showSymbol ? 'circle' : 'none',
      symbolSize,
      lineStyle: {
        width: lineWidth,
        color,
        opacity: lineOpacity,
        type: lineType,
      },
      itemStyle: {
        color,
      },
      areaStyle: areaColor
        ? {
            color: areaColor,
          }
        : undefined,
      emphasis: {
        focus: 'series',
      },
      data,
      ...baseAnimation,
    },
    {
      name,
      type: 'effectScatter',
      coordinateSystem: 'cartesian2d',
      yAxisIndex,
      symbol: 'circle',
      symbolSize: symbolSize + 3,
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke',
        period: 2.4,
        scale: 3.4,
        number: 3,
      },
      itemStyle: {
        color,
        shadowBlur: 8,
        shadowColor: color,
      },
      data: lastPoint ? [[lastPoint.category, lastPoint.value]] : [],
      silent: true,
      tooltip: {
        show: false,
      },
      z: 8,
      ...baseAnimation,
    },
  ]
}

// 读取一个指标的兼容字段名。后端字段名有历史差异时，按 keys 顺序取第一个存在的字段。
export const readMetricValue = (record: Record<string, unknown>, keys: string[]) => {
  const key = keys.find((item) => record[item] !== undefined)
  return key ? getNumber(record[key]) : 0
}

// 统一提取时间字段：优先使用接口返回的实时 time/timeKey，缺失时才用默认时间兜底。
export const getRecordTime = (
  record: Record<string, unknown>,
  index: number,
  granularity: TimeGranularity,
  totalCount: number,
  pageIndex: number
) => {
  const rawTime =
    record.time ??
    record.timeKey ??
    record.dateTime ??
    record.datetime ??
    record.date ??
    record.statTime ??
    record.createTime ??
    record.timestamp

  if (rawTime === undefined || rawTime === null || rawTime === '') {
    return getDefaultLabel(granularity, index, totalCount, pageIndex)
  }

  if (typeof rawTime === 'number') {
    const timestamp = rawTime > 9999999999 ? rawTime : rawTime * 1000
    return formatDateLabel(new Date(timestamp), granularity)
  }

  return String(rawTime)
}

// 判断接口是否成功。兼容 code/status 布尔值、数字和字符串写法。
export const isSuccessResponse = (response: ChartApiResponse) => {
  const status = response.status ?? response.code
  if (status === undefined || status === true) return true
  return ['1', '200', 'success', 'ok'].includes(String(status).toLowerCase())
}

// 保留通用 payload 解析能力，兼容 data/list/records/rows 等历史响应形态。
export const getPayloadList = (response: ChartApiResponse) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response.data)) return response.data
  if (Array.isArray(response.list)) return response.list
  if (Array.isArray(response.records)) return response.records
  if (Array.isArray(response.rows)) return response.rows
  if (response.data && typeof response.data === 'object') {
    const data = response.data as ChartApiResponse
    if (Array.isArray(data.list)) return data.list
    if (Array.isArray(data.records)) return data.records
    if (Array.isArray(data.rows)) return data.rows
    return [data]
  }
  return []
}

// 图一数据归一化：接口返回 orderCount/timeKey 时会映射成 onlineCount/time。
export const normalizeOnlineData = (
  payload: unknown[],
  granularity: TimeGranularity,
  pageIndex: number
): OnlineMetricPoint[] => {
  const requestDataCount = getRequestDataCount(granularity)
  const payloadByGranularity = payload.slice(-requestDataCount)
  const totalCount = payloadByGranularity.length || requestDataCount

  return payloadByGranularity
    .map<OnlineMetricPoint | null>((item, index) => {
      if (!item || typeof item !== 'object') return null

      const record = item as Record<string, unknown>
      return {
        time: getRecordTime(record, index, granularity, totalCount, pageIndex),
        onlineCount: readMetricValue(record, [
          'onlineCount',
          'onlineMemberCount',
          'memberOnlineCount',
          'orderCount',
          'count',
          'value',
        ]),
      }
    })
    .filter((item): item is OnlineMetricPoint => item !== null)
}

// 图二数据归一化：交易笔数、金额、成功笔数、成功金额都在这里从接口行数据映射成图表字段。
export const normalizeTradeBusinessData = (
  payload: unknown[],
  granularity: TimeGranularity,
  pageIndex: number
): TradeBusinessMetricPoint[] => {
  const requestDataCount = getRequestDataCount(granularity)
  const payloadByGranularity = payload.slice(-requestDataCount)
  const totalCount = payloadByGranularity.length || requestDataCount

  return payloadByGranularity
    .map<TradeBusinessMetricPoint | null>((item, index) => {
      if (!item || typeof item !== 'object') return null

      const record = item as Record<string, unknown>
      return {
        time: getRecordTime(record, index, granularity, totalCount, pageIndex),
        rechargeCount: readMetricValue(record, ['rechargeCount', 'rechargeOrderCount', 'topUpCount', 'depositCount']),
        rechargeAmount: readMetricValue(record, [
          'rechargeAmount',
          'rechargeOrderAmount',
          'topUpAmount',
          'depositAmount',
        ]),
        rechargeSuccessCount: readMetricValue(record, ['rechargeSuccessCount', 'rechargeSuccessOrderCount']),
        rechargeSuccessAmount: readMetricValue(record, ['rechargeSuccessAmount', 'rechargeSuccessOrderAmount']),
        withdrawCount: readMetricValue(record, ['withdrawCount', 'withdrawOrderCount', 'cashOutCount']),
        withdrawAmount: readMetricValue(record, ['withdrawAmount', 'withdrawOrderAmount', 'cashOutAmount']),
        withdrawSuccessCount: readMetricValue(record, ['withdrawSuccessCount', 'withdrawSuccessOrderCount']),
        withdrawSuccessAmount: readMetricValue(record, ['withdrawSuccessAmount', 'withdrawSuccessOrderAmount']),
        buyCount: readMetricValue(record, ['buyCount', 'buyOrderCount', 'buyOrderNum', 'buyNum']),
        buyAmount: readMetricValue(record, ['buyAmount', 'buyOrderAmount', 'buyMoney', 'buyTotalAmount']),
        buySuccessCount: readMetricValue(record, ['buySuccessCount', 'buySuccessOrderCount']),
        buySuccessAmount: readMetricValue(record, ['buySuccessAmount', 'buySuccessOrderAmount']),
        sellCount: readMetricValue(record, ['sellCount', 'sellOrderCount', 'sellOrderNum', 'sellNum']),
        sellAmount: readMetricValue(record, ['sellAmount', 'sellOrderAmount', 'sellMoney', 'sellTotalAmount']),
        sellSuccessCount: readMetricValue(record, ['sellSuccessCount', 'sellSuccessOrderCount']),
        sellSuccessAmount: readMetricValue(record, ['sellSuccessAmount', 'sellSuccessOrderAmount']),
        arpayCollectCount: readMetricValue(record, [
          'arpayCollectCount',
          'arpayCollectionCount',
          'arpayReceiveCount',
          'arpayInCount',
        ]),
        arpayCollectAmount: readMetricValue(record, [
          'arpayCollectAmount',
          'arpayCollectionAmount',
          'arpayReceiveAmount',
          'arpayInAmount',
        ]),
        arpayCollectSuccessCount: readMetricValue(record, [
          'arpayCollectSuccessCount',
          'arpayCollectionSuccessCount',
          'arpayReceiveSuccessCount',
          'arpayInSuccessCount',
        ]),
        arpayCollectSuccessAmount: readMetricValue(record, [
          'arpayCollectSuccessAmount',
          'arpayCollectionSuccessAmount',
          'arpayReceiveSuccessAmount',
          'arpayInSuccessAmount',
        ]),
        arpayPaymentCount: readMetricValue(record, [
          'arpayPaymentCount',
          'arpayPaymentCount',
          'arpayPayoutCount',
          'arpayOutCount',
        ]),
        arpayPaymentAmount: readMetricValue(record, [
          'arpayPaymentAmount',
          'arpayPaymentAmount',
          'arpayPayoutAmount',
          'arpayOutAmount',
        ]),
        arpayPaymentSuccessCount: readMetricValue(record, [
          'arpayPaymentSuccessCount',
          'arpayPayoutSuccessCount',
          'arpayOutSuccessCount',
        ]),
        arpayPaymentSuccessAmount: readMetricValue(record, [
          'arpayPaymentSuccessAmount',
          'arpayPayoutSuccessAmount',
          'arpayOutSuccessAmount',
        ]),
      }
    })
    .filter((item): item is TradeBusinessMetricPoint => item !== null)
}

// 图三数据归一化：按订单来源拆分内部订单、快捷提现 UPI、快捷提现银行卡。
export const normalizeBacklogData = (
  payload: unknown[],
  granularity: TimeGranularity,
  pageIndex: number
): BacklogMetricPoint[] => {
  const requestDataCount = getRequestDataCount(granularity)
  const payloadByGranularity = payload.slice(-requestDataCount)
  const totalCount = payloadByGranularity.length || requestDataCount

  return payloadByGranularity
    .map<BacklogMetricPoint | null>((item, index) => {
      if (!item || typeof item !== 'object') return null

      const record = item as Record<string, unknown>
      return {
        time: getRecordTime(record, index, granularity, totalCount, pageIndex),
        innerOrderCount: readMetricValue(record, ['innerOrderCount', 'innerCount', 'internalOrderCount']),
        innerOrderAmount: readMetricValue(record, ['innerOrderAmount', 'innerAmount', 'internalOrderAmount']),
        quickUpiCount: readMetricValue(record, ['quickUpiCount', 'quickWithdrawUpiCount', 'quickWithdrawalUpiCount', 'upiCount']),
        quickUpiAmount: readMetricValue(record, [
          'quickUpiAmount',
          'quickWithdrawUpiAmount',
          'quickWithdrawalUpiAmount',
          'upiAmount',
        ]),
        quickBankCount: readMetricValue(record, [
          'quickBankCount',
          'quickWithdrawBankCount',
          'quickWithdrawalBankCount',
          'bankCount',
          'bankCardCount',
        ]),
        quickBankAmount: readMetricValue(record, [
          'quickBankAmount',
          'quickWithdrawBankAmount',
          'quickWithdrawalBankAmount',
          'bankAmount',
          'bankCardAmount',
        ]),
      }
    })
    .filter((item): item is BacklogMetricPoint => item !== null)
}

// 图四数据归一化：待支付、确认中两个状态分别提取笔数和金额。
export const normalizePaymentData = (
  payload: unknown[],
  granularity: TimeGranularity,
  pageIndex: number
): PaymentMetricPoint[] => {
  const requestDataCount = getRequestDataCount(granularity)
  const payloadByGranularity = payload.slice(-requestDataCount)
  const totalCount = payloadByGranularity.length || requestDataCount

  return payloadByGranularity
    .map<PaymentMetricPoint | null>((item, index) => {
      if (!item || typeof item !== 'object') return null

      const record = item as Record<string, unknown>
      return {
        time: getRecordTime(record, index, granularity, totalCount, pageIndex),
        waitingPaymentCount: readMetricValue(record, ['waitingPaymentCount', 'pendingPaymentCount', 'waitPayCount', 'toPayCount']),
        waitingPaymentAmount: readMetricValue(record, [
          'waitingPaymentAmount',
          'pendingPaymentAmount',
          'waitPayAmount',
          'toPayAmount',
        ]),
        confirmingCount: readMetricValue(record, ['confirmingCount', 'confirmCount', 'confirmingOrderCount']),
        confirmingAmount: readMetricValue(record, ['confirmingAmount', 'confirmAmount', 'confirmingOrderAmount']),
      }
    })
    .filter((item): item is PaymentMetricPoint => item !== null)
}

const isCompactScreen = () => {
  return typeof window !== 'undefined' && window.innerWidth <= 768
}

// X 轴只展示当前粒度需要的时间部分：天显示年月日，时/分显示小时分钟，秒显示时分秒。
const getAxisTimeGroupText = (value: unknown, granularity: TimeGranularity) => {
  const text = String(value ?? '').trim()

  const match = text.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?)?$/
  )

  if (!match) return text

  const [, , month, day, hour = '0', minute = '0'] = match

  const MM = padTimeNumber(Number(month))
  const DD = padTimeNumber(Number(day))
  const hh = padTimeNumber(Number(hour))
  const mm = padTimeNumber(Number(minute))

  switch (granularity) {
    case 'DAY':
      return `${MM}月`

    case 'HOUR':
      return `${MM}月${DD}日`

    case 'MINUTE':
      return `${DD}日${hh}时`

    case 'SECOND':
      return `${hh}时${mm}分`

    default:
      return text
  }
}

// 所有图表共用 dataZoom：窗口宽度锁定为当前粒度展示点数，只允许左右平移，不允许缩放点数。
export const buildDataZoom = (
  dataLength: number,
  zoomStartIndex: number,
  zoomEndIndex: number,
  options: DataZoomOptions = {}
) => {
  const minSpan = 5
  const maxSpan = Math.max(0, dataLength - 1)
  const {
    showInside = true,
    showSlider = true,
    sliderBottom = 16,
    sliderHeight = 16,
  } = options
  const dataZoom = []

  if (showInside) {
    dataZoom.push({
      type: 'inside',
      xAxisIndex: 0,
      startValue: zoomStartIndex,
      endValue: zoomEndIndex,
      minValueSpan: minSpan,
      maxValueSpan: maxSpan,
      zoomLock: false,
      zoomOnMouseWheel: true,
      moveOnMouseWheel: true,
      moveOnMouseMove: true,
      throttle: 80,
      preventDefaultMouseMove: true,
    })
  }

  if (showSlider) {
    dataZoom.push({
      type: 'slider',
      xAxisIndex: 0,
      height: sliderHeight,
      bottom: sliderBottom,
      startValue: zoomStartIndex,
      endValue: zoomEndIndex,
      minValueSpan: minSpan,
      maxValueSpan: maxSpan,
      zoomLock: false,
      brushSelect: false,
      showDetail: false,
      borderColor: '#dfe5ef',
      fillerColor: 'rgba(76, 120, 216, 0.16)',
      handleSize: '120%',
      handleStyle: {
        color: '#4c78d8',
        borderColor: '#4c78d8',
      },
      moveHandleStyle: {
        color: '#4c78d8',
      },
      textStyle: {
        color: '#6a6a6a',
      },
    })
  }

  return dataZoom
}

// X 轴最多显示 5 个时间标签
const MAX_AXIS_LABEL_COUNT = 5
// X 轴标签显示规则：始终显示当前窗口第一条和最后一条，其余标签按屏幕宽度和展示模式做间隔展示。
const getEvenAxisLabelIndexes = (
  categories: string[],
  granularity: TimeGranularity,
  zoomStartIndex: number,
  zoomEndIndex: number
) => {
  const displayCount = zoomEndIndex - zoomStartIndex + 1

  if (displayCount <= 0) return new Set<number>()

  const rawIndexes: number[] = []

  if (displayCount <= MAX_AXIS_LABEL_COUNT) {
    for (let index = zoomStartIndex; index <= zoomEndIndex; index += 1) {
      rawIndexes.push(index)
    }
  } else {
    const step = (displayCount - 1) / (MAX_AXIS_LABEL_COUNT - 1)

    for (let i = 0; i < MAX_AXIS_LABEL_COUNT; i += 1) {
      rawIndexes.push(Math.round(zoomStartIndex + step * i))
    }
  }

  const shownTextSet = new Set<string>()
  const result = new Set<number>()

  rawIndexes.forEach((index) => {
    const text = getAxisTimeGroupText(categories[index], granularity)

    if (shownTextSet.has(text)) return

    shownTextSet.add(text)
    result.add(index)
  })

  return result
}


// ECharts 基础配置：标题、图例、X 轴、网格和 dataZoom 都在这里统一，具体 Y 轴和 series 由各组件补充。
export const getBaseChartOption = (
  granularity: TimeGranularity,
  title: string,
  categories: string[],
  zoomStartIndex: number,
  zoomEndIndex: number,
  gridTop = 78,
  axisLabelMode: AxisLabelMode = 'auto',
  showDataZoomSlider = true
) => {
  const axisLabelIndexes = getEvenAxisLabelIndexes(
                            categories,
                            granularity,
                            zoomStartIndex,
                            zoomEndIndex
                          )
  const edgeOnlyAxisLabel = axisLabelMode === 'edge'
  const compactAxisLabel = isCompactScreen() || edgeOnlyAxisLabel

  return {
    backgroundColor: '#fff',
    title: {
      text: title,
      left: 'center',
      top: 8,
      textStyle: {
        color: '#333',
        fontSize: 14,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      borderColor: '#e7e7e7',
      textStyle: {
        color: '#333',
        fontSize: 12,
      },
    },
    legend: {
      top: 34,
      left: 'center',
      type: 'scroll',
      itemWidth: 14,
      itemHeight: 8,
      textStyle: {
        color: '#333',
        fontSize: 10,
      },
    },
    grid: {
      left: '6%',
      right: '5%',
      top: gridTop,
      bottom: showDataZoomSlider ? (compactAxisLabel ? 72 : 66) : (compactAxisLabel ? 48 : 42),
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#d7d7d7',
        },
      },
      axisLabel: {
        color: '#4d4d4d',
        fontSize: compactAxisLabel ? 9 : 10,
        lineHeight: 12,
        margin: compactAxisLabel ? 10 : 8,
        rotate: 0,
        align: 'center',
        verticalAlign: 'top',
        hideOverlap: false,
        showMaxLabel: true,
        showMinLabel: true,
        interval: (index: number) => axisLabelIndexes.has(index),
        formatter: (value: string) => getAxisTimeGroupText(value, granularity),
      },
    },
    dataZoom: buildDataZoom(categories.length, zoomStartIndex, zoomEndIndex, {
      showSlider: showDataZoomSlider,
    }),
  }
}

// 首屏和最新数据刷新后默认展示最后一个窗口，也就是最新的 N 个点。
const getLatestWindowStart = (
  dataLength: number,
  granularity: TimeGranularity,
  granularityCountMap: GranularityCountMap
) => {
  return Math.max(0, dataLength - getGranularityCount(granularity, granularityCountMap))
}

// ECharts 事件中的 startValue/endValue 可能是字符串，这里统一转成整数索引。
const normalizeZoomIndex = (value: unknown) => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? Math.round(numberValue) : null
}

// 从 dataZoom 事件计算当前可视窗口索引，用于判断是否进入历史浏览或回到最新数据。
const resolveZoomRange = (
  event: DataZoomEventPayload,
  dataLength: number
) => {
  const eventRange = event.batch?.[0] || event
  if (!dataLength) return null

  let startIndex = normalizeZoomIndex(eventRange.startValue)
  let endIndex = normalizeZoomIndex(eventRange.endValue)

  if (startIndex === null && typeof eventRange.start === 'number') {
    startIndex = Math.round((eventRange.start / 100) * (dataLength - 1))
  }

  if (endIndex === null && typeof eventRange.end === 'number') {
    endIndex = Math.round((eventRange.end / 100) * (dataLength - 1))
  }

  if (startIndex === null || endIndex === null) return null

  const safeStartIndex = Math.max(0, Math.min(startIndex, dataLength - 1))
  const safeEndIndex = Math.max(safeStartIndex, Math.min(endIndex, dataLength - 1))

  return {
    start: safeStartIndex,
    end: safeEndIndex,
  }
}

// 实时图表核心逻辑：初始化 ECharts、请求最新数据、轮询、历史分页、dataZoom 联动都集中在这里。
export const useRealtimeChartGroup = <T>(options: UseRealtimeChartGroupOptions<T>) => {
  // chartInstances 与 options.chartRefs 顺序一一对应，组件渲染时按索引 setOption。
  let chartInstances: Array<echarts.ECharts | null> = []
  let pollTimer: number | null = null
  let isMounted = false
  // 请求状态分开维护，避免最新数据请求和历史分页请求互相覆盖。
  let isLoadingLatest = false
  let isLoadingHistory = false
  // 进入历史浏览后停止轮询，直到用户滑回最右侧最新窗口。
  let isBrowsingHistory = false
  // 主动同步 dataZoom 时会触发 datazoom 事件，用该标记防止循环处理。
  let isSyncingDataZoom = false
  // 同步渲染期间用户仍可能继续拖动，把最后一次被拦截的事件暂存，避免滑到最左侧时漏掉历史请求。
  let pendingDataZoomEvent: unknown = null
  // 请求序号用于丢弃过期响应，例如切换粒度后旧请求晚返回。
  let latestRequestSequence = 0
  let historyRequestSequence = 0
  let loadedHistoryPage = 0
  // 当前窗口在 dataCache 中的起止索引。
  let visibleStartIndex = 0
  let visibleEndIndex = 0
  // 是否已加载完所有历史数据
  let noMoreHistoryData = false
  // 当前图组的完整缓存：最新数据在右侧，历史数据向左追加。
  let dataCache: T[] = []

  const clearPollTimer = () => {
    if (!pollTimer) return
    window.clearTimeout(pollTimer)
    pollTimer = null
  }

  // 设置可视窗口，并把窗口起点限制在合法范围内，避免拖动超出数据边界。
  const setVisibleWindow = (startIndex: number, endIndex?: number) => {
    const dataLength = dataCache.length
    if (!dataLength) {
      visibleStartIndex = 0
      visibleEndIndex = 0
      return
    }

    const maxIndex = dataLength - 1
    const safeStartIndex = Math.max(0, Math.min(Math.round(startIndex), maxIndex))
    const safeEndIndex = Math.max(
      safeStartIndex,
      Math.min(
        Math.round(
          endIndex ??
            safeStartIndex + getGranularityCount(options.getGranularity(), options.granularityCountMap) - 1
        ),
        maxIndex
      )
    )

    visibleStartIndex = safeStartIndex
    visibleEndIndex = safeEndIndex
  }
  const isSliderNearLeftByPixel = () => {
    const chartDom = options.chartRefs[options.chartRefs.length - 1]?.value || options.chartRefs[0]?.value
    if (!chartDom || !dataCache.length) return false

    const gridLeft = chartDom.clientWidth * 0.06
    const gridRight = chartDom.clientWidth * 0.05
    const sliderWidth = chartDom.clientWidth - gridLeft - gridRight

    if (sliderWidth <= 0) return false

    const startPercent = dataCache.length <= 1
      ? 0
      : (visibleStartIndex / (dataCache.length - 1)) * 100

    const sliderLeftDistance = (startPercent / 100) * sliderWidth

    return sliderLeftDistance <= LEFT_LOAD_MORE_THRESHOLD_PX
  }
  // 使用缓存数据和可视窗口重新渲染图表；isSyncingDataZoom 避免 setOption 后的联动事件再次进入逻辑。
  const renderCharts = () => {
    isSyncingDataZoom = true
    options.renderCharts(chartInstances, dataCache, visibleStartIndex, visibleEndIndex)

    window.setTimeout(() => {
      isSyncingDataZoom = false
      if (!pendingDataZoomEvent) {
        ensureLeftEdgeHistoryRequest()
        return
      }

      const event = pendingDataZoomEvent
      pendingDataZoomEvent = null
      handleDataZoom(event)
      return
    }, 0)
  }

  // 拉到最新数据或切换粒度时重置历史状态，只保留接口最新返回的数据。
  const resetChartState = (data: T[]) => {
    dataCache = data
    loadedHistoryPage = 0
    isBrowsingHistory = false
    noMoreHistoryData = false
    isBrowsingHistory = false
    setVisibleWindow(getLatestWindowStart(dataCache.length, options.getGranularity(), options.granularityCountMap))
    renderCharts()
  }

  // 请求完成后再开启下一次轮询；历史浏览中不轮询，防止用户查看历史时数据突然跳回最新。
  const scheduleNextRequest = () => {
    clearPollTimer()
    if (!ENABLE_REALTIME_POLLING || !isMounted || isBrowsingHistory) return
    const pollInterval = getPollIntervalByGranularity(options.pollInterval, options.getGranularity())
    pollTimer = window.setTimeout(() => {
      void loadLatestData({ scheduleNext: true })
    }, pollInterval)
  }

  // 请求第一页最新数据。resetHistory 为 true 时表示用户回到最右侧，需要清空已追加历史数据。
  const loadLatestData = async (requestOptions: { resetHistory?: boolean; scheduleNext?: boolean } = {}) => {
    if (isLoadingLatest) return

    isLoadingLatest = true
    const requestGranularity = options.getGranularity()
    const requestSequence = ++latestRequestSequence

    try {
      const data = await options.fetchData(requestGranularity, 0, {
        shouldApplyResponse: () =>
          isMounted &&
          requestGranularity === options.getGranularity() &&
          requestSequence === latestRequestSequence &&
          (!isBrowsingHistory || !!requestOptions.resetHistory),
      })
      if (!isMounted || requestGranularity !== options.getGranularity() || requestSequence !== latestRequestSequence) {
        return
      }

      if (isBrowsingHistory && !requestOptions.resetHistory) return
      if (data.length) resetChartState(data)
    } catch (error) {
      console.warn(`${options.logName} latest request failed`, error)
    } finally {
      if (requestSequence === latestRequestSequence) {
        isLoadingLatest = false
        if (requestOptions.scheduleNext && !isBrowsingHistory) scheduleNextRequest()
      }
    }
  }

  // 向左滑动时请求上一页历史数据，并把历史数据追加到缓存左侧。
  const loadPreviousPageData = async () => {
    if (isLoadingHistory || loadedHistoryPage >= MAX_HISTORY_PAGE) return

    isLoadingHistory = true
    const requestGranularity = options.getGranularity()
    const nextPageIndex = loadedHistoryPage + 1
    const requestSequence = ++historyRequestSequence
    const startBeforeAppend = visibleStartIndex
    const endBeforeAppend = visibleEndIndex

    try {
      const data = await options.fetchData(requestGranularity, nextPageIndex, {
        shouldApplyResponse: () =>
          isMounted &&
          requestGranularity === options.getGranularity() &&
          requestSequence === historyRequestSequence &&
          isBrowsingHistory,
      })
      if (
        !isMounted ||
        requestGranularity !== options.getGranularity() ||
        requestSequence !== historyRequestSequence ||
        !isBrowsingHistory
      ) {
        return
      }

      loadedHistoryPage = nextPageIndex
      if (!data.length) {
        noMoreHistoryData = true
        message.warning('暂无更多数据')
        return
      }

      dataCache = [...data, ...dataCache]
      visibleStartIndex = startBeforeAppend + data.length
      visibleEndIndex = endBeforeAppend + data.length
      setVisibleWindow(visibleStartIndex)
      renderCharts()
    } catch (error) {
      console.warn(`${options.logName} history request failed`, error)
    } finally {
      if (requestSequence === historyRequestSequence) isLoadingHistory = false
    }
  }

  // 用户离开最右侧最新窗口后进入历史模式：停止轮询并让未完成的最新请求失效。
  const enterHistoryMode = () => {
    if (isBrowsingHistory) return

    isBrowsingHistory = true
    clearPollTimer()
    latestRequestSequence += 1
    isLoadingLatest = false
  }

  // 当前粒度下的可视点数，用于判断是否真正滑到最左侧。
  const getCurrentDisplayCount = () => {
    return Math.min(getGranularityCount(options.getGranularity(), options.granularityCountMap), dataCache.length)
  }

  // 最左侧兜底阈值：允许 1 个点以内的浮动，兼容 ECharts 百分比换算后的取整误差。
  const getLeftEdgeFallbackThreshold = () => {
    return Math.max(1, Math.floor(getCurrentDisplayCount() * 0.02))
  }

  const isAtLeftEdge = () => {
    return !!dataCache.length && visibleStartIndex <= getLeftEdgeFallbackThreshold()
  }

  const canRequestPreviousPage = () => {
    return !noMoreHistoryData && !isLoadingHistory && loadedHistoryPage < MAX_HISTORY_PAGE
  }

  // 统一发起上一页请求，返回值用于区分本次是否真的触发了新请求。
  const requestPreviousPageData = () => {
    if (!canRequestPreviousPage()) return false

    void loadPreviousPageData()
    return true
  }

  // 兜底逻辑：如果当前已经处于历史浏览且停在最左侧，但没有历史请求在跑，则主动补发上一页请求。
  const ensureLeftEdgeHistoryRequest = () => {
    if (!isBrowsingHistory) return false

    if (!isAtLeftEdge() && !isSliderNearLeftByPixel()) return false

    return requestPreviousPageData()
  }

  // 判断滑动边界：滑到最右恢复最新数据，向左接近边界时触发历史页请求。
  const handleZoomBoundary = () => {
    if (!dataCache.length) return

    const isAtLatest = visibleEndIndex >= dataCache.length - 1
    if (isAtLatest && !isAtLeftEdge()) {
      if (isBrowsingHistory && !isLoadingLatest) {
        void loadLatestData({ resetHistory: true, scheduleNext: true })
      }
      return
    }

    enterHistoryMode()

    if (
      loadedHistoryPage === 0 ||
      visibleStartIndex <= getGranularityCount(options.getGranularity(), options.granularityCountMap) ||
      isSliderNearLeftByPixel()
    ) {
      requestPreviousPageData()
      return
    }

    ensureLeftEdgeHistoryRequest()
  }

  // ECharts datazoom 事件入口：解析窗口、同步多图、再按边界规则决定是否请求数据。
  const handleDataZoom = (event: unknown) => {
    if (isSyncingDataZoom) {
      pendingDataZoomEvent = event
      return
    }

    const zoomRange = resolveZoomRange(event as DataZoomEventPayload, dataCache.length)
    if (!zoomRange) return

    const prevStartIndex = visibleStartIndex
    const prevEndIndex = visibleEndIndex
    setVisibleWindow(zoomRange.start, zoomRange.end)
    const windowChanged = prevStartIndex !== visibleStartIndex || prevEndIndex !== visibleEndIndex

    if (windowChanged) {
      // 滑动后需要重新生成 X 轴标签配置：
      // axisLabel.interval 闭包依赖当前窗口索引，如果只 dispatch dataZoom，向左滑动后会继续使用旧索引过滤标签。
      renderCharts()
    }
    handleZoomBoundary()
  }

  // 切换粒度时让旧请求失效，并清理 loading 状态。
  const resetRequestState = () => {
    latestRequestSequence += 1
    historyRequestSequence += 1
    isLoadingLatest = false
    isLoadingHistory = false
  }

  // 粒度变化后重置图表缓存，按新粒度重新请求第一页数据。
  const resetByGranularity = () => {
    clearPollTimer()
    resetRequestState()
    noMoreHistoryData = false
    isBrowsingHistory = false
    loadedHistoryPage = 0
    pendingDataZoomEvent = null
    resetChartState(options.createInitialData(options.getGranularity()))
    void loadLatestData({ resetHistory: true, scheduleNext: true })
  }

  // 页面宽度变化时主动 resize，避免外层容器变化导致 ECharts 尺寸不更新。
  const handleResize = () => {
    chartInstances.forEach((chart) => chart?.resize())
    renderCharts()
  }

  // 挂载后初始化 ECharts 实例、绑定 datazoom，并立即请求首屏最新数据。
  onMounted(() => {
    isMounted = true
    chartInstances = options.chartRefs.map((chartRef) => (chartRef.value ? echarts.init(chartRef.value) : null))
    chartInstances.forEach((chart) => chart?.on('datazoom', handleDataZoom))
    resetChartState(options.createInitialData(options.getGranularity()))
    window.addEventListener('resize', handleResize)
    void loadLatestData({ resetHistory: true, scheduleNext: true })
  })

  // 卸载时清理定时器、事件和 ECharts 实例，避免路由切换后继续轮询。
  onUnmounted(() => {
    isMounted = false
    clearPollTimer()
    pendingDataZoomEvent = null
    window.removeEventListener('resize', handleResize)
    chartInstances.forEach((chart) => {
      chart?.off('datazoom', handleDataZoom)
      chart?.dispose()
    })
    chartInstances = []
  })

  // 组件一、二支持天/时/分/秒切换；组件三、四固定 SECOND，watch 不会触发额外重置。
  watch(() => options.getGranularity(), () => {
    if (!isMounted) return
    resetByGranularity()
  })
}
