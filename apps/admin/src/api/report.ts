import request from './request'
// 获取卖出日报表
export function PaymentOrderApi(data: any) {
  return request.post('/ar-manager/buySellReport/querySellReportPage', data)
}
// 获取卖出月报表
export function PaymentOrderMonthApi(data: any) {
  return request.post('/ar-manager/buySellReport/querySellMonthReportPage', data)
}
// 获取买入日报表
export function WithdrawOrderApi(data: any) {
  return request.post(`/ar-manager/buySellReport/queryBuyReportPage`, data)
}
// 获取买入月报表
export function WithdrawOrderMonthApi(data: any) {
  return request.post('/ar-manager/buySellReport/queryBuyMonthReportPage', data)
}
//获取商户日报表
export function MerchantOrderApi(data: any){
  return request.post('/ar-manager/biMerchantDaily/query', data)
}
//获取商户月月报表
export function MercantOrderMonthApi(data: any){
  return request.post('/ar-manager/biMerchantMonth/query', data)
}
//获取商户对账报表
export function BiMerchantReconciliation(data: any){
  return request.post('/ar-manager/biMerchantReconciliation/query', data)
}
//获取会员对账报表
export function BiMemberReconciliation(data: any){
  return request.post('/ar-manager/biMemberReconciliation/query', data)
}

//获取四日方报表
export function selectQuadReportPage(data: any){
  return request.post('/ar-manager/buySellReport/selectQuadReportPage', data)
}

//获取四日月报表
export function selectQuadMonthReportPage(data: any){
  return request.post('/ar-manager/buySellReport/selectQuadMonthReportPage', data)
}
