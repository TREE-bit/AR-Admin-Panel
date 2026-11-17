// 工单列表、工单配置。类型、订单关联、资料项两边用同一套。刷新后恢复。

import { prototypeImage } from './configOps'

type Row = Record<string, any>

const ME = 'prototype'

function readQuery(raw: unknown): Record<string, any> {
  if (!raw) return {}
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }
  return raw as Record<string, any>
}

function hasFilter(value: unknown) {
  return value !== undefined && value !== null && value !== ''
}

function indiaStamp(hour: number, minute: number) {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('serverTime') || '' : ''
  const day = /^\d{4}-\d{2}-\d{2}/.test(stored)
    ? stored.slice(0, 10)
    : new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date())
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${day} ${pad(hour)}:${pad(minute)}:00`
}

function inRange(value: string, start?: unknown, end?: unknown) {
  if (!hasFilter(start) && !hasFilter(end)) return true
  if (!value) return false
  if (hasFilter(start) && value < String(start)) return false
  if (hasFilter(end) && value > String(end)) return false
  return true
}

function ok(data: unknown = true) {
  return { code: '1', msg: '操作成功', data, success: true }
}

function page(rows: Row[], body: Record<string, any>) {
  const pageNo = Number(body.pageNo) || 1
  const pageSize = Number(body.pageSize) || 20
  const start = (pageNo - 1) * pageSize
  return ok({ list: rows.slice(start, start + pageSize).map((row) => structuredClone(row)), total: rows.length })
}

function fields(name: string, hindiName: string, items: { type: number; title: string; hindi: string }[]) {
  const build = (language: number, workOrderName: string, titleKey: 'title' | 'hindi') =>
    items.map((item, index) => ({
      labelId: index + 1,
      labelTitle: item[titleKey],
      type: item.type,
      sort: index + 1,
      isRequired: 1,
      notes: '',
      labelContent: '',
      language,
      workOrderName,
    }))
  return [...build(1, name, 'title'), ...build(2, hindiName, 'hindi')]
}

const TYPES: Row[] = [
  { workOrderTypeId: 1, value: 1, workOrderTypeName: '买入未到账' },
  { workOrderTypeId: 2, value: 2, workOrderTypeName: '卖出未到账' },
  { workOrderTypeId: 3, value: 3, workOrderTypeName: '账号无法登录' },
  { workOrderTypeId: 4, value: 4, workOrderTypeName: '修改收款账户' },
  { workOrderTypeId: 5, value: 5, workOrderTypeName: '其他咨询' },
]

function typeName(id: unknown) {
  return TYPES.find((item) => String(item.workOrderTypeId) === String(id))?.workOrderTypeName || ''
}

const CONFIGS: Row[] = [
  {
    id: 840001,
    sort: 1,
    workOrderSeq: 1,
    workOrderName: '买入未到账',
    workOrderTypeId: 1,
    workOrderTypeName: '买入未到账',
    orderRelation: 1,
    loginLimit: 0,
    status: 1,
    materialItems: '1,2,8,4',
    remark: '会员已付款，买入订单未到账',
    updateBy: ME,
    updateTime: indiaStamp(10, 12),
    listData: fields('买入未到账', 'खरीद राशि नहीं आई', [
      { type: 1, title: 'UTR', hindi: 'UTR' },
      { type: 2, title: '订单号', hindi: 'ऑर्डर नंबर' },
      { type: 8, title: '订单金额', hindi: 'ऑर्डर राशि' },
      { type: 4, title: '付款截图', hindi: 'भुगतान स्क्रीनशॉट' },
    ]),
  },
  {
    id: 840002,
    sort: 2,
    workOrderSeq: 2,
    workOrderName: '卖出未到账',
    workOrderTypeId: 2,
    workOrderTypeName: '卖出未到账',
    orderRelation: 2,
    loginLimit: 0,
    status: 1,
    materialItems: '1,2,8,5',
    remark: '卖出订单已完成，会员未收到款',
    updateBy: 'admin1',
    updateTime: indiaStamp(10, 28),
    listData: fields('卖出未到账', 'बिक्री राशि नहीं मिली', [
      { type: 1, title: 'UTR', hindi: 'UTR' },
      { type: 2, title: '订单号', hindi: 'ऑर्डर नंबर' },
      { type: 8, title: '订单金额', hindi: 'ऑर्डर राशि' },
      { type: 5, title: '到账视频', hindi: 'वीडियो' },
    ]),
  },
  {
    id: 840003,
    sort: 3,
    workOrderSeq: 3,
    workOrderName: '账号无法登录',
    workOrderTypeId: 3,
    workOrderTypeName: '账号无法登录',
    orderRelation: 0,
    loginLimit: 1,
    status: 1,
    materialItems: '3,7',
    remark: '未登录也可提交',
    updateBy: ME,
    updateTime: indiaStamp(11, 5),
    listData: fields('账号无法登录', 'लॉगिन नहीं हो रहा', [
      { type: 3, title: 'UPI ID', hindi: 'UPI ID' },
      { type: 7, title: '问题说明', hindi: 'विवरण' },
    ]),
  },
  {
    id: 840004,
    sort: 4,
    workOrderSeq: 4,
    workOrderName: '修改收款账户',
    workOrderTypeId: 4,
    workOrderTypeName: '修改收款账户',
    orderRelation: 0,
    loginLimit: 0,
    status: 1,
    materialItems: '3,4,6',
    remark: '更换 UPI 或银行卡',
    updateBy: 'admin1',
    updateTime: indiaStamp(11, 36),
    listData: fields('修改收款账户', 'प्राप्ति खाता बदलें', [
      { type: 3, title: 'UPI ID', hindi: 'UPI ID' },
      { type: 4, title: '账户截图', hindi: 'खाता स्क्रीनशॉट' },
      { type: 6, title: '银行证明', hindi: 'बैंक प्रमाण' },
    ]),
  },
  {
    id: 840005,
    sort: 5,
    workOrderSeq: 5,
    workOrderName: '其他咨询',
    workOrderTypeId: 5,
    workOrderTypeName: '其他咨询',
    orderRelation: 0,
    loginLimit: 1,
    status: 0,
    materialItems: '7',
    remark: '停用，仅保留配置',
    updateBy: ME,
    updateTime: indiaStamp(12, 8),
    listData: fields('其他咨询', 'अन्य प्रश्न', [
      { type: 7, title: '问题说明', hindi: 'विवरण' },
    ]),
  },
]

const BUY_ORDER = 'MR2026111700000000001'
const SELL_ORDER = 'MC2026111700000000001'

function content(items: { type: number; title: string; value: string; pdfPassword?: string }[]) {
  return items.map((item) => ({
    labelType: item.type,
    labelTitle: item.title,
    labelContent: item.value,
    pdfPassword: item.pdfPassword || '',
  }))
}

const buySubmit = content([
  { type: 1, title: 'UTR', value: '432198765012' },
  { type: 2, title: '订单号', value: BUY_ORDER },
  { type: 8, title: '订单金额', value: '5000' },
  { type: 4, title: '付款截图', value: prototypeImage },
])

const sellSubmit = content([
  { type: 1, title: 'UTR', value: '518276430019' },
  { type: 2, title: '订单号', value: SELL_ORDER },
  { type: 8, title: '订单金额', value: '8000' },
  { type: 5, title: '到账视频', value: prototypeImage },
])

function histories(): Record<number, Row[]> {
  return {
    850001: [
      { currentHandler: '会员10086001', currentBusinessStatus: 1, businessTime: indiaStamp(9, 20), businessContentList: buySubmit },
    ],
    850002: [
      { currentHandler: '会员10086002', currentBusinessStatus: 1, businessTime: indiaStamp(9, 40), businessContentList: buySubmit },
      { currentHandler: ME, currentBusinessStatus: 2, businessTime: indiaStamp(10, 5), businessContentList: [] },
    ],
    850003: [
      { currentHandler: '会员10086003', currentBusinessStatus: 1, businessTime: indiaStamp(8, 50), businessContentList: sellSubmit },
      { currentHandler: 'admin1', currentBusinessStatus: 2, businessTime: indiaStamp(9, 10), businessContentList: [] },
      {
        currentHandler: ME,
        currentBusinessStatus: 3,
        businessTime: indiaStamp(11, 15),
        internalRemark: 'UTR 与卖出订单流水不一致',
        externalRemark: '请核对 UTR 后重新提交',
        businessContentList: [],
      },
    ],
    850004: [
      { currentHandler: '会员10086004', currentBusinessStatus: 1, businessTime: indiaStamp(8, 30), businessContentList: sellSubmit },
      {
        currentHandler: 'admin1',
        currentBusinessStatus: 3,
        businessTime: indiaStamp(9, 20),
        internalRemark: '截图不清晰',
        externalRemark: '请重新上传清晰的到账截图',
        businessContentList: [],
      },
      {
        currentHandler: '会员10086004',
        currentBusinessStatus: 4,
        businessTime: indiaStamp(12, 40),
        businessContentList: content([
          { type: 1, title: 'UTR', value: '518276430088' },
          { type: 2, title: '订单号', value: SELL_ORDER },
          { type: 8, title: '订单金额', value: '8000' },
          { type: 4, title: '付款截图', value: prototypeImage },
        ]),
      },
    ],
    850005: [
      {
        currentHandler: '会员10086005',
        currentBusinessStatus: 1,
        businessTime: indiaStamp(9, 5),
        businessContentList: content([
          { type: 3, title: 'UPI ID', value: 'starpay@upi' },
          { type: 7, title: '问题说明', value: '验证码收不到，无法登录' },
        ]),
      },
      { currentHandler: 'admin1', currentBusinessStatus: 2, businessTime: indiaStamp(9, 30), businessContentList: [] },
      {
        currentHandler: 'admin1',
        currentBusinessStatus: 6,
        businessTime: indiaStamp(10, 50),
        internalRemark: '已重置登录验证',
        externalRemark: '请重新获取验证码登录',
        businessContentList: [],
      },
    ],
    850006: [
      {
        currentHandler: '会员10086006',
        currentBusinessStatus: 1,
        businessTime: indiaStamp(10, 15),
        businessContentList: content([
          { type: 3, title: 'UPI ID', value: 'northpay@upi' },
          { type: 4, title: '账户截图', value: prototypeImage },
          { type: 6, title: '银行证明', value: prototypeImage, pdfPassword: '8391' },
        ]),
      },
      { currentHandler: 'admin1', currentBusinessStatus: 2, businessTime: indiaStamp(10, 40), businessContentList: [] },
      {
        currentHandler: 'admin1',
        currentBusinessStatus: 5,
        transferOrderReceiver: ME,
        businessTime: indiaStamp(11, 25),
        businessContentList: [],
      },
    ],
  }
}

function seedTickets(): Row[] {
  return [
    {
      id: 850001,
      workOrderNo: 'WO20261117001',
      merchantName: '星河商城',
      merchantCode: 'M10021',
      memberId: '10086001',
      registerPhoneNumber: '9876501001',
      workOrderName: '买入未到账',
      workOrderTypeId: 1,
      workOrderTypeName: '买入未到账',
      loginLimit: 0,
      currentProcessStatus: 1,
      currentBusinessStatus: 1,
      orderAmount: 5000,
      appealHistory: null,
      relatedOrderNo: BUY_ORDER,
      submitTime: indiaStamp(9, 20),
      lastSubmitTime: indiaStamp(9, 20),
      lastOperationTime: indiaStamp(9, 20),
      currentHandler: '',
      currentHandlerId: '',
      nextNodeOperatorId: '',
      internalRejectReason: '',
      internalCompletionRemark: '',
      processingDuration: '',
    },
    {
      id: 850002,
      workOrderNo: 'WO20261117002',
      merchantName: '快付钱包',
      merchantCode: 'M10058',
      memberId: '10086002',
      registerPhoneNumber: '9876501002',
      workOrderName: '买入未到账',
      workOrderTypeId: 1,
      workOrderTypeName: '买入未到账',
      loginLimit: 0,
      currentProcessStatus: 2,
      currentBusinessStatus: 2,
      orderAmount: 5000,
      appealHistory: 1,
      relatedOrderNo: BUY_ORDER,
      submitTime: indiaStamp(9, 40),
      lastSubmitTime: indiaStamp(9, 40),
      lastOperationTime: indiaStamp(10, 5),
      currentHandler: ME,
      currentHandlerId: ME,
      nextNodeOperatorId: ME,
      internalRejectReason: '',
      internalCompletionRemark: '',
      processingDuration: '25分钟',
    },
    {
      id: 850003,
      workOrderNo: 'WO20261117003',
      merchantName: '北境博彩',
      merchantCode: 'M10073',
      memberId: '10086003',
      registerPhoneNumber: '9876501003',
      workOrderName: '卖出未到账',
      workOrderTypeId: 2,
      workOrderTypeName: '卖出未到账',
      loginLimit: 0,
      currentProcessStatus: 3,
      currentBusinessStatus: 3,
      orderAmount: 8000,
      appealHistory: 2,
      relatedOrderNo: SELL_ORDER,
      submitTime: indiaStamp(8, 50),
      lastSubmitTime: indiaStamp(8, 50),
      lastOperationTime: indiaStamp(11, 15),
      currentHandler: ME,
      currentHandlerId: ME,
      nextNodeOperatorId: ME,
      internalRejectReason: 'UTR 与卖出订单流水不一致',
      internalCompletionRemark: '',
      processingDuration: '2小时25分',
    },
    {
      id: 850004,
      workOrderNo: 'WO20261117004',
      merchantName: '晨曦支付',
      merchantCode: 'M20001',
      memberId: '10086004',
      registerPhoneNumber: '9876501004',
      workOrderName: '卖出未到账',
      workOrderTypeId: 2,
      workOrderTypeName: '卖出未到账',
      loginLimit: 0,
      currentProcessStatus: 4,
      currentBusinessStatus: 4,
      orderAmount: 8000,
      appealHistory: 2,
      relatedOrderNo: SELL_ORDER,
      submitTime: indiaStamp(8, 30),
      lastSubmitTime: indiaStamp(12, 40),
      lastOperationTime: indiaStamp(12, 40),
      currentHandler: ME,
      currentHandlerId: ME,
      nextNodeOperatorId: ME,
      internalRejectReason: '截图不清晰',
      internalCompletionRemark: '',
      processingDuration: '4小时10分',
    },
    {
      id: 850005,
      workOrderNo: 'WO20261117005',
      merchantName: '星河商城',
      merchantCode: 'M10021',
      memberId: '10086005',
      registerPhoneNumber: '9876501005',
      workOrderName: '账号无法登录',
      workOrderTypeId: 3,
      workOrderTypeName: '账号无法登录',
      loginLimit: 1,
      currentProcessStatus: 5,
      currentBusinessStatus: 6,
      orderAmount: 0,
      appealHistory: null,
      relatedOrderNo: '',
      submitTime: indiaStamp(9, 5),
      lastSubmitTime: indiaStamp(9, 5),
      lastOperationTime: indiaStamp(10, 50),
      currentHandler: 'admin1',
      currentHandlerId: 'admin1',
      nextNodeOperatorId: 'admin1',
      internalRejectReason: '',
      internalCompletionRemark: '已重置登录验证',
      processingDuration: '1小时45分',
    },
    {
      id: 850006,
      workOrderNo: 'WO20261117006',
      merchantName: '快付钱包',
      merchantCode: 'M10058',
      memberId: '10086006',
      registerPhoneNumber: '9876501006',
      workOrderName: '修改收款账户',
      workOrderTypeId: 4,
      workOrderTypeName: '修改收款账户',
      loginLimit: 0,
      currentProcessStatus: 2,
      currentBusinessStatus: 5,
      orderAmount: 0,
      appealHistory: 1,
      relatedOrderNo: '',
      submitTime: indiaStamp(10, 15),
      lastSubmitTime: indiaStamp(10, 15),
      lastOperationTime: indiaStamp(11, 25),
      currentHandler: ME,
      currentHandlerId: ME,
      nextNodeOperatorId: ME,
      internalRejectReason: '',
      internalCompletionRemark: '',
      processingDuration: '1小时10分',
    },
  ].map((row) => ({ ...row, workOrderHandleCount: (histories()[row.id] || []).length }))
}

let tickets = seedTickets()
let ticketHistory = histories()
let configs = CONFIGS.map((row) => structuredClone(row))
let types = TYPES.map((row) => ({ ...row }))
let operators: Row[] = [
  { id: 860001, operatorId: ME, operatorName: ME, createBy: ME, createTime: indiaStamp(9, 0) },
  { id: 860002, operatorId: 'admin1', operatorName: 'admin1', createBy: ME, createTime: indiaStamp(9, 2) },
]
let configLogs: Row[] = [
  { id: 870001, workOrderName: '买入未到账', content: '创建工单配置：买入未到账', operationType: 0, createBy: ME, createTime: indiaStamp(10, 12) },
  { id: 870002, workOrderName: '卖出未到账', content: '修改资料项：增加到账视频', operationType: 1, createBy: 'admin1', createTime: indiaStamp(10, 28) },
  { id: 870003, workOrderName: '其他咨询', content: '删除后重新停用：其他咨询', operationType: 3, createBy: ME, createTime: indiaStamp(12, 8) },
]

function mineCount() {
  return tickets.filter((row) => String(row.nextNodeOperatorId) === ME && [2, 3, 4].includes(Number(row.currentProcessStatus))).length
}

function pushHistory(id: number, item: Row) {
  ticketHistory[id] = [...(ticketHistory[id] || []), item]
  const row = tickets.find((ticket) => ticket.id === id)
  if (row) row.workOrderHandleCount = ticketHistory[id].length
}

function applyTransition(body: Record<string, any>, workOrderNo: string) {
  const row = tickets.find((item) => item.workOrderNo === workOrderNo)
  if (!row) return
  const type = Number(body.currentBusinessStatus)
  const now = indiaStamp(new Date().getHours(), new Date().getMinutes())
  row.lastOperationTime = now
  row.currentBusinessStatus = type
  if (type === 2) {
    row.currentProcessStatus = 2
    row.currentHandler = ME
    row.currentHandlerId = ME
    row.nextNodeOperatorId = ME
    if (!row.processingDuration) row.processingDuration = '1分钟'
    pushHistory(row.id, { currentHandler: ME, currentBusinessStatus: 2, businessTime: now, businessContentList: [] })
  }
  if (type === 5) {
    row.currentHandler = body.transferOrderReceiver || row.currentHandler
    row.currentHandlerId = body.transferOrderReceiverId || row.currentHandlerId
    row.nextNodeOperatorId = body.transferOrderReceiverId || row.nextNodeOperatorId
    pushHistory(row.id, {
      currentHandler: ME,
      currentBusinessStatus: 5,
      transferOrderReceiver: row.currentHandler,
      businessTime: now,
      businessContentList: [],
    })
  }
  if (type === 3) {
    row.currentProcessStatus = 3
    row.internalRejectReason = body.internalRemark || ''
    pushHistory(row.id, {
      currentHandler: ME,
      currentBusinessStatus: 3,
      internalRemark: body.internalRemark || '',
      externalRemark: body.externalRemark || '',
      businessTime: now,
      businessContentList: [],
    })
  }
  if (type === 6) {
    row.currentProcessStatus = 5
    row.internalCompletionRemark = body.internalRemark || ''
    pushHistory(row.id, {
      currentHandler: ME,
      currentBusinessStatus: 6,
      internalRemark: body.internalRemark || '',
      externalRemark: body.externalRemark || '',
      businessTime: now,
      businessContentList: [],
    })
  }
}

function filterTickets(body: Record<string, any>) {
  return tickets.filter((row) => {
    if (hasFilter(body.workOrderNo) && !String(row.workOrderNo).includes(String(body.workOrderNo))) return false
    if (hasFilter(body.relatedOrderNo) && !String(row.relatedOrderNo).includes(String(body.relatedOrderNo))) return false
    if (hasFilter(body.memberId) && String(row.memberId) !== String(body.memberId)) return false
    if (hasFilter(body.registerPhoneNumber) && !String(row.registerPhoneNumber).includes(String(body.registerPhoneNumber))) return false
    if (hasFilter(body.currentHandler) && !String(row.currentHandler).includes(String(body.currentHandler))) return false
    if (hasFilter(body.workOrderName) && !String(row.workOrderName).includes(String(body.workOrderName))) return false
    if (hasFilter(body.loginLimit) && String(row.loginLimit) !== String(body.loginLimit)) return false
    if (hasFilter(body.currentProcessStatus) && String(row.currentProcessStatus) !== String(body.currentProcessStatus)) return false
    if (hasFilter(body.currentBusinessStatus) && String(row.currentBusinessStatus) !== String(body.currentBusinessStatus)) return false
    if (hasFilter(body.appealHistory) && String(row.appealHistory) !== String(body.appealHistory)) return false
    if (hasFilter(body.merchantCode) && String(row.merchantCode) !== String(body.merchantCode)) return false
    if (!inRange(row.submitTime, body.startTime, body.endTime)) return false
    if (!inRange(row.lastSubmitTime, body.lastSubmitTimeStart, body.lastSubmitTimeEnd)) return false
    if (!inRange(row.lastOperationTime, body.startTime1, body.endTime1)) return false
    return true
  })
}

function saveConfig(body: Record<string, any>, isNew: boolean) {
  const name = typeName(body.workOrderTypeId)
  if (isNew) {
    const id = 840100 + configs.length
    configs.unshift({
      ...body,
      id,
      status: 1,
      workOrderTypeName: name,
      updateBy: ME,
      updateTime: indiaStamp(new Date().getHours(), new Date().getMinutes()),
    })
  } else {
    const row = configs.find((item) => String(item.id) === String(body.id))
    if (row) {
      Object.assign(row, body, {
        workOrderTypeName: name || row.workOrderTypeName,
        updateBy: ME,
        updateTime: indiaStamp(new Date().getHours(), new Date().getMinutes()),
      })
    }
  }
  configLogs.unshift({
    id: 870100 + configLogs.length,
    workOrderName: body.workOrderName,
    content: isNew ? `创建工单配置：${body.workOrderName}` : `修改工单配置：${body.workOrderName}`,
    operationType: isNew ? 0 : 1,
    createBy: ME,
    createTime: indiaStamp(new Date().getHours(), new Date().getMinutes()),
  })
}

export function resolveTicketMenu(url: string, raw: unknown) {
  const body = readQuery(raw)
  if (/users\/listPage/i.test(url) && Number(body.pageSize) >= 1000) {
    return ok([
      { id: ME, username: ME },
      { id: 'admin1', username: 'admin1' },
      { id: 'ops02', username: 'ops02' },
    ])
  }
  if (/workOrderTypeConfig\/list/i.test(url) && !/saveOrUpdate|delete/i.test(url)) {
    return ok(types.map((row) => ({ ...row })))
  }
  if (/workOrderTypeConfig\/saveOrUpdate/i.test(url)) {
    const id = Math.max(0, ...types.map((item) => Number(item.workOrderTypeId))) + 1
    types.push({ workOrderTypeId: id, value: id, workOrderTypeName: body.workOrderTypeName })
    return ok(true)
  }
  if (/workOrderTypeConfig\/delete/i.test(url)) {
    types = types.filter((item) => String(item.workOrderTypeId) !== String(body.id))
    return ok(true)
  }
  if (/workOrderConfigOperationHistory\/listPage/i.test(url)) {
    const rows = configLogs.filter((row) => {
      if (hasFilter(body.workOrderName) && !String(row.workOrderName).includes(String(body.workOrderName))) return false
      if (hasFilter(body.operationType) && String(row.operationType) !== String(body.operationType)) return false
      return inRange(row.createTime, body.startTime, body.endTime)
    })
    return page(rows, body)
  }
  if (/workOrderConfig\/listPage/i.test(url)) {
    const rows = configs.filter((row) => {
      if (hasFilter(body.workOrderName) && !String(row.workOrderName).includes(String(body.workOrderName))) return false
      if (hasFilter(body.orderRelation) && String(row.orderRelation) !== String(body.orderRelation)) return false
      return inRange(row.updateTime, body.startTime, body.endTime)
    })
    return page(rows, body)
  }
  if (/workOrderConfig\/updateStatus/i.test(url)) {
    const row = configs.find((item) => String(item.id) === String(body.id))
    if (row) row.status = Number(body.status)
    return ok(true)
  }
  if (/workOrderConfig\/delete/i.test(url)) {
    const row = configs.find((item) => String(item.id) === String(body.id))
    configs = configs.filter((item) => String(item.id) !== String(body.id))
    if (row) {
      configLogs.unshift({
        id: 870100 + configLogs.length,
        workOrderName: row.workOrderName,
        content: `删除工单配置：${row.workOrderName}`,
        operationType: 3,
        createBy: ME,
        createTime: indiaStamp(new Date().getHours(), new Date().getMinutes()),
      })
    }
    return ok(true)
  }
  if (/workOrderConfig\/(save|update)/i.test(url)) {
    saveConfig(body, /\/save/i.test(url))
    return ok(true)
  }
  if (/workOrderPermission\/listPage/i.test(url)) return page(operators, body)
  if (/workOrderPermission\/save/i.test(url)) {
    operators.unshift({
      id: 860100 + operators.length,
      operatorId: body.userId,
      operatorName: body.userName,
      createBy: ME,
      createTime: indiaStamp(new Date().getHours(), new Date().getMinutes()),
    })
    return ok(true)
  }
  if (/workOrderPermission\/delete/i.test(url)) {
    operators = operators.filter((item) => String(item.id) !== String(body.id))
    return ok(true)
  }
  if (/workOrderDetail\/getOrderRecordDetail/i.test(url)) {
    return ok(structuredClone(ticketHistory[Number(body.id)] || []))
  }
  if (/getWorkOrderProcessPendingStatistics/i.test(url)) {
    const counts = [1, 2, 3, 4, 5].map((status) => ({
      currentProcessStatus: status,
      count: tickets.filter((row) => Number(row.currentProcessStatus) === status).length,
    }))
    return ok({ inProgressCount: mineCount(), list: counts })
  }
  if (/workOrderRecord\/transitionWorkOrder/i.test(url)) {
    applyTransition(body, body.workOrderNo)
    return ok(true)
  }
  if (/batchLockWorkOrders/i.test(url)) {
    String(body.workOrderNos || '').split(',').filter(Boolean).forEach((no) => applyTransition({ currentBusinessStatus: 2 }, no))
    return ok(true)
  }
  if (/batchTransferWorkOrders/i.test(url)) {
    String(body.workOrderNos || '').split(',').filter(Boolean).forEach((no) => applyTransition(body, no))
    return ok(true)
  }
  if (/getOperatorAuthority/i.test(url)) return ok({ roleId: 1 })
  if (/workOrderRecord\/listPage/i.test(url)) return page(filterTickets(body), body)
  return null
}
