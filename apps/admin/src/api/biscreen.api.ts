
import request from './request'


// 在线人数监控分页查询 
export function realtimeMonitorOnlineCountPage(data: any) {
  return request.post('/ar-manager/api/v1/realtimeMonitor/onlineCountPage', data)
}

// 交易业务线监控分页查询 
export function realtimeMonitorTradeBusinessPage(data: any) {
  return request.post('/ar-manager/api/v1/realtimeMonitor/tradeBusinessPage', data)
}

// 支付流程进行中订单监控分页查询 
export function realtimeMonitorPaymentProcessPage(data: any) {
  return request.post('/ar-manager/api/v1/realtimeMonitor/paymentProcessPage', data)
}

// 撮合挂单积压监控分页查询 
export function realtimeMonitorMatchingBacklogPage(data: any) {
  return request.post('/ar-manager/api/v1/realtimeMonitor/matchingBacklogPage', data)
}