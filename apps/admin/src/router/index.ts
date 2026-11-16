import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { toTree } from '@ar/shared'
import Layout from '@/components/Layout/index.vue'
import { MenuItemSchema } from '@/api'
import { userInfo } from '@/hooks'
import { clearGlobalOverlays } from '@/utils/overlay'
import { message } from 'ant-design-vue'
import { isPrototype } from '@/prototype/env'

const routemap:any={
  "/dashboard/analysis": ()=> import('@/views/dashboard/analysis.vue'), // 会员收款列表

  "/admin/log/index":() => import('@/views/admin/log.vue'), // 系统日志
  "/admin/user/index":() => import('@/views/admin/user.vue'), // 用户管理
  "/admin/menu/index":() => import('@/views/admin/menu.vue'), // 菜单管理
  "/admin/role/index":() => import('@/views/admin/role.vue'), // 角色管理
  "/admin/white/index":() => import('@/views/admin/white.vue'), // IP白名单
  "/admin/black/index":() => import('@/views/admin/black.vue'), // IP白名单
  "/admin/sysLoginlog":() => import('@/views/admin/sysLoginlog.vue'), // 系统登录日志
  "/admin/merchantInfo/index": () => import('@/views/merchant/merchantInfo.vue'), // 商户管理
  "/merchant/application": () => import('@/views/merchant/application.vue'), // 下发申请
  "/merchant/record": ()=> import('@/views/merchant/record.vue'), // 下发记录
  "/merchant/changes": ()=> import('@/views/merchant/changes.vue'), // 下发记录
  "/merchant/recharge": ()=> import('@/views/merchant/recharge.vue'), // 下发记录
  "/merchant/withdraw": ()=> import('@/views/merchant/withdraw.vue'), // 下发记录

  "/config/setting/index": () => import('@/views/config/setting.vue'), // 参数配置
  "/config/usdt/index": () => import('@/views/config/usdt.vue'), // 参数配置
  "/config/rechargeCancel/index": () => import('@/views/config/rechargeCancel.vue'), // 充值取消原因
  "/config/withdrawCancel/index": () => import('@/views/config/withdrawCancel.vue'), // 提现取消原因
  "/config/contentconfig/index": () => import('@/views/config/contentconfig.vue'), // 内容配置
  "/config/operations": () => import('@/views/config/operations.vue'), // 运营参数配置
  "/config/taskManagement": ()=> import('@/views/config/taskManagement.vue'), // 任务管理
  "/config/switches": ()=> import('@/views/config/switches.vue'), // 任务管理
  '/config/alertparams':()=> import('@/views/config/alertparams.tsx'), // 任务管理
  "/config/selectLivechat": ()=> import('@/views/config/selectLivechat.vue'), // 配置客服
  "/config/nativeConfig": ()=> import('@/views/config/nativeConfig.vue'), // 原生版本配置
  "/config/bankList": ()=> import('@/views/config/bankList.vue'), // 银行字典
  "/config/imChat": ()=> import('@/views/config/imChat.vue'), // im客服
  "/config/tradeReward": ()=> import('@/views/config/tradeReward.vue'), // 买卖奖励配置
  "/config/exportList": ()=> import('@/views/config/exportList.vue'), // 导出列表
  "/config/proxyPort": ()=> import('@/views/config/proxyPort.vue'), // 代理端口配置
  "/config/eventManager": ()=> import('@/views/config/eventManager.vue'), // 事件管理
  "/config/telegramManage": ()=> import('@/views/config/telegramManage.vue'), // 电报群管理
  "/config/getRewardsRecord": ()=> import('@/views/config/getRewardsRecord.vue'), // 奖励卡领取记录
  "/config/autoAppNativeConfig": ()=> import('@/views/config/autoAppNativeConfig.vue'), // 自动交易APP版本配置
  "/config/domainManager": ()=> import('@/views/config/domainManager.vue'), // 域名管理
  // "/config/ifscConfig": ()=> import('@/views/config/ifscConfig.vue'), // ifsc配置
  "/config/testEditor": ()=> import('@/views/config/testEditor.vue'), // 富文本测试

  "/order/appeal/index": ()=> import('@/views/order/appeal.vue'), // 参数配置
  "/order/sale/index": ()=> import('@/views/order/saleRecord.vue'), // 参数配置
  "/order/saleRecord/index": ()=> import('@/views/order/saleRecord.vue'), // 参数配置
  "/order/buyOrder/index": ()=> import('@/views/order/buyRecord.vue'), // 参数配置
  "/order/buyRecord/index": ()=> import('@/views/order/buyRecord.vue'), // 参数配置
  "/order/usdtBuyOrder/index": ()=> import('@/views/order/usdtBuyOrder.vue'), // 参数配置
  "/order/matchingPool/index": ()=> import('@/views/order/matchingPool.vue'), // 参数配置
  "/order/assemble/index": ()=> import('@/views/order/assemble.vue'), // 撮合
  "/order/appeal": ()=> import('@/views/order/appeal.vue'), // 参数配置
  "/order/refundOrder": ()=> import('@/views/order/refundOrder.vue'), // 退款订单
  "/order/kycRecords": ()=> import('@/views/order/kycRecords.vue'), // kyc交易流水
  "/order/usdtSellOrder": ()=> import('@/views/order/usdtSellOrder.vue'), // usdt卖出订单
  "/order/arrearsOrder": ()=> import('@/views/order/arrearsOrder.vue'), // 欠费订单
  "/order/sellOut/index": ()=> import('@/views/order/sellOut.vue'), // 卖出订单汇总

  "/mandate/matchingOrderPool": ()=> import('@/views/mandate/matchingOrderPool.vue'), // 挂单记录
  "/mandate/pushAmountRecord": ()=> import('@/views/mandate/pushAmountRecord.vue'), // 推送金额记录
  "/mandate/hotBuyRecord": ()=> import('@/views/mandate/hotBuyRecord.vue'), // 买入热度记录
  "/mandate/topUpFailure": ()=> import('@/views/mandate/topUpFailure.vue'), // 充值失败记录
  "/mandate/splitOrder": ()=> import('@/views/mandate/splitOrder.vue'), // 智能拆单挂单列表
  "/mandate/splitFailOrder": ()=> import('@/views/mandate/splitFailOrder.vue'), // 智能拆单失败记录

  "/report/moonOf": ()=> import('@/views/report/moonOf.vue'), // 代收报表
  "/report/moonPay": ()=> import('@/views/report/moonPay.vue'), // 代付报表
  "/report/merchant": ()=> import('@/views/report/merchant.vue'), // 商户报表
  "/report/reconciliation": ()=> import('@/views/report/reconciliation.vue'), // 对账报表
  "/report/fourReport": ()=> import('@/views/report/fourReport.vue'), // 对账报表

  "/member/group": ()=> import('@/views/member/group.vue'), // 分组管理
  "/member/list": ()=> import('@/views/member/list.vue'), // 会员列表
  "/member/payment": ()=> import('@/views/member/payment.vue'), // 会员收款列表
  "/member/usdtPayment": ()=> import('@/views/member/usdtPayment.vue'), // 会员USDT收款列表
  "/member/paymentV2": ()=> import('@/views/member/paymentV2.vue'), // 会员收款列表
  "/member/name": ()=> import('@/views/member/name.vue'), // 会员收款列表
  "/member/smslog": ()=> import('@/views/member/smslog.vue'), // 会员收款列表
  "/member/operationlog": ()=> import('@/views/member/operationlog.vue'), // 会员收款列表
  "/member/loginlog": ()=> import('@/views/member/loginlog.vue'), // 会员收款列表
  "/member/manuallog": ()=> import('@/views/member/manuallog.vue'), // 手动操作记录
  "/member/changeReocde": ()=> import('@/views/member/changeReocde.vue'), // 会员帐变记录
  "/member/agentLevReo": ()=> import('@/views/member/agentLevReo.vue'), // 返佣记录
  "/member/agentLevel": ()=> import('@/views/member/agentLevel.vue'), // 代理层级
  "/member/unbindLog": ()=> import('@/views/member/unbindLog.vue'), // 会员解绑记录

  
  "/task/detail": ()=> import('@/views/task/task-detail.vue'), // 任务领取记录

  "/wind/memberBlacklist": ()=> import('@/views/wind/memberBlacklist.vue'), // 会员黑名单
  "/wind/riskControlUser": ()=> import('@/views/wind/riskControlUser.vue'), // 风控用户列表
  "/wind/riskUpiControlLog": ()=> import('@/views/wind/riskUpiControlLog.vue'), // upi风控列表
  "/wind/riskUpiUnbanLog": ()=> import('@/views/wind/riskUpiUnbanLog.vue'), // upi解禁列表
  "/wind/abnDisconnectLogs": ()=> import('@/views/wind/abnDisconnectLogs.vue'), // KYC异常断连日志
  "/wind/bankCardBlack": ()=> import('@/views/wind/bankCardBlack.vue'), // 银行卡黑名单
  "/wind/autoSellEnableLog": ()=> import('@/views/wind/autoSellEnableLog.vue'), // 自动开启卖出日志

  "/userlevel/levelConfig": ()=> import('@/views/userlevel/levelConfig.vue'), // 用户等级配置
  "/userlevel/levelLog": ()=> import('@/views/userlevel/levelLog.vue'), // 等级记录
  "/userlevel/creditConfig": ()=> import('@/views/userlevel/creditConfig.vue'), // 信用分配置
  "/userlevel/creditLog": ()=> import('@/views/userlevel/creditLog.vue'), // 信用分记录
  "/userlevel/welfareConfig": ()=> import('@/views/userlevel/welfareConfig.vue'), // 福利配置

  "/kyc/kycManager": ()=> import('@/views/kyc/kycManager.vue'), // kyc管理
  "/kyc/kycManagerV2": ()=> import('@/views/kyc/kycManagerV2.vue'), // 会员KYC信息V2
  "/kyc/kycBank": ()=> import('@/views/kyc/kycBank.vue'), // kyc银行管理
  "/kyc/kycOrder": ()=> import('@/views/kyc/kycOrder.vue'), // kyc订单
  "/kyc/kycWaitRec": ()=> import('@/views/kyc/kycWaitRec.vue'), // 卖出kyc待拉取流水
  "/kyc/kycWaitRecBuy": ()=> import('@/views/kyc/kycWaitRecBuy.vue'), // 买入kyc待拉取流水
  "/kyc/kycToken": ()=> import('@/views/kyc/kycToken.vue'), // kyc续Token表
  "/kyc/kycBuyAppealRec": ()=> import('@/views/kyc/kycBuyAppealRec.vue'), // kyc买入申诉流水
  "/kyc/kycSellAppealWait": ()=> import('@/views/kyc/kycSellAppealWait.vue'), // KYC卖出申诉待拉取列表
  "/kyc/kycFaildRecords": ()=> import('@/views/kyc/kycFaildRecords.vue'), // KYC交易失败流水
  "/kyc/kycBuyAppealFailedRec": ()=> import('@/views/kyc/kycBuyAppealFailedRec.vue'), // 买入申诉支出失败流水
  "/kyc/quickWithdrawal": ()=> import('@/views/kyc/quickWithdrawal.vue'), // 快捷提现
  "/kyc/kycSmsLog": ()=> import('@/views/kyc/kycSmsLog.vue'), // KYC短信日志
  "/kyc/kycTrading": ()=> import('@/views/kyc/kycTrading.vue'), // KYC买卖交易
  "/kyc/kycSmsSuccessLog": ()=> import('@/views/kyc/kycSmsSuccessLog.vue'), // KYC短信发送成功日志
  "/kyc/sellTransRes": ()=> import('@/views/kyc/sellTransRes.vue'), // 卖出交易流水
  "/kyc/kycTransAbn": ()=> import('@/views/kyc/kycTransAbn.vue'), // KYC流水状态异常
  "/kyc/kycReversal": ()=> import('@/views/kyc/kycReversal.vue'), // 冲正流水列表
  "/kyc/externalChanellList": ()=> import('@/views/kyc/externalChanellList.vue'), // 外部通道列表
  "/kyc/externalChannelException": ()=> import('@/views/kyc/externalChannelException.vue'), // 外部通道异常流水
  "/kyc/kycCollectionPending": ()=> import('@/views/kyc/kycCollectionPending.vue'), // 收款KYC待拉取队列
  "/kyc/externalChannellCollection": ()=> import('@/views/kyc/externalChannellCollection.vue'), // 外部通道收款流水
  "/kyc/kycMoreOrder": ()=> import('@/views/kyc/kycMoreOrder.vue'), // KYC多订单列表
  "/kyc/kycBuySuccessRecord": ()=> import('@/views/kyc/kycBuySuccessRecord.vue'), // KYC支付成功流水
  "/kyc/autoTransRes": ()=> import('@/views/kyc/autoTransRes.vue'), // 自动交易流水


  "/appConfig/appBank": ()=> import('@/views/appConfig/appBank.vue'), // APP银行
  "/appConfig/appManager": ()=> import('@/views/appConfig/appManager.vue'), // 会员APP信息
  "/appConfig/appDataCollection": ()=> import('@/views/appConfig/appDataCollection.vue'), // APP数据收集
  "/appConfig/fackAppBank": ()=> import('@/views/appConfig/fackAppBank.vue'), // 假APP银行
  "/appConfig/fackAppBlacklist": ()=> import('@/views/appConfig/fackAppBlacklist.vue'), //  假APP黑名单管理
  "/appConfig/fackAppLoginFailure": ()=> import('@/views/appConfig/fackAppLoginFailureRecords.vue'), //  假APP登陆失败记录

  "/payment/manager": ()=> import('@/views/payment/manager.vue'), // 支付通道管理
  "/payment/channelManager": ()=> import('@/views/payment/channelManager.vue'), // 三方通道管理
  "/payment/channelChanges": ()=> import('@/views/payment/channelChanges.vue'), // 通道账变
  "/payment/channelCollection": ()=> import('@/views/payment/channelCollection.vue'), // 通道代收


  "/emailManager/emailTemp": ()=> import('@/views/emailManager/emailTemp.vue'), // 邮件模板
  "/emailManager/appPushTemp": ()=> import('@/views/emailManager/appPushTemp.vue'), // APP推送模板
  "/emailManager/emailGroup": ()=> import('@/views/emailManager/emailGroup.vue'), // 群发邮件
  "/emailManager/emailSenderMgmt": ()=> import('@/views/emailManager/emailSenderMgmt.vue'), // 邮箱发件管理
  "/emailManager/pushTemp": ()=> import('@/views/emailManager/pushTemp.vue'), // 推送模板
  "/emailManager/pushMgmt": ()=> import('@/views/emailManager/pushMgmt.vue'), // 推送方式管理
  "/emailManager/appPushChangmt": ()=> import('@/views/emailManager/appPushChangmt.vue'), // app推送渠道管理


  "/biScreen/dataScreen": ()=> import('@/views/biScreen/dataScreen.vue'), // 数据大屏
  "/biScreen/dataOverview": ()=> import('@/views/biScreen/dataOverview.vue'), // 数据概览
  "/biScreen/dataRecReport": ()=> import('@/views/biScreen/dataRecReport.vue'), // 对账报表
  "/biScreen/dataMearchantReport": ()=> import('@/views/biScreen/dataMearchantReport.vue'), // 商户报表
  "/biScreen/dataBuyReport": ()=> import('@/views/biScreen/dataBuyReport.vue'), // 买入报表
  "/biScreen/dataSellReport": ()=> import('@/views/biScreen/dataSellReport.vue'), // 卖出报表
  "/biScreen/dataVisualization": ()=> import('@/views/biScreen/dataVisualization.vue'), // ARB数据可视化
  "/biScreen/matchingData": ()=> import('@/views/biScreen/matchingData.vue'), // 匹配数据概览
  "/biScreen/dataToupOverview": ()=> import('@/views/biScreen/dataToupOverview.vue'), // 充值数据概览
  "/biScreen/dataFinancial": ()=> import('@/views/biScreen/dataFinancial.vue'), // 财务数据报表
  "/biScreen/dataMember": ()=> import('@/views/biScreen/dataMember.vue'), // 会员统计看板
  "/biScreen/dataFundFlows": ()=> import('@/views/biScreen/dataFundFlows.vue'), // 资金流向看板
  "/biScreen/dataIdxCompResult": ()=> import('@/views/biScreen/dataIdxCompResult.vue'), // 指标比对结果表
  "/biScreen/dataKycTransStats": ()=> import('@/views/biScreen/dataKycTransStats.vue'), // KYC交易统计
  "/biScreen/dataAntMember": ()=> import('@/views/biScreen/dataAntMember.vue'), // 蚂蚁会员统计看板
  "/biScreen/dataSmsLog": ()=> import('@/views/biScreen/dataSmsLog.vue'), // kyc短信日志明细
  "/biScreen/dataSendSmsCount": ()=> import('@/views/biScreen/dataSendSmsCount.vue'), // kyc短信次数统计
  "/biScreen/dataSmsVerifyLog": ()=> import('@/views/biScreen/dataSmsVerifyLog.vue'), // KYC短信验证日志
  "/biScreen/dataBankData": ()=> import('@/views/biScreen/dataBankData.vue'), // 银行接口数据分析
  "/biScreen/dataAppealOrder": ()=> import('@/views/biScreen/dataAppealOrder.vue'), // 申诉订单监控
  "/biScreen/dataArrearsBoard": ()=> import('@/views/biScreen/dataArrearsBoard.vue'), // 欠费监控看板
  "/biScreen/dataAssemble": ()=> import('@/views/biScreen/dataAssemble.vue'), // 撮合看板
  "/biScreen/dataBuyUsdt": ()=> import('@/views/biScreen/dataBuyUsdt.vue'), // USDT买入报表
  "/biScreen/dataBusinessDatabas": ()=> import('@/views/biScreen/dataBusinessDatabas.vue'), // 业务数据库数据量
  "/biScreen/dataRegAndLogin": ()=> import('@/views/biScreen/dataRegAndLogin.vue'), // 注册和登录基础指标数据
  "/biScreen/dataMerchantBalance": ()=> import('@/views/biScreen/dataMerchantBalance.vue'), // 商户余额自检报告表
  "/biScreen/dataNewCustomer": ()=> import('@/views/biScreen/dataNewCustomer.vue'), // 新客首月转化
  "/biScreen/dataAntMemberReward": ()=> import('@/views/biScreen/dataAntMemberReward.vue'), // 蚂蚁会员奖励
  "/biScreen/dataPriviegeEsc": ()=> import('@/views/biScreen/dataPriviegeEsc.vue'), // 提权成功率统计
  "/biScreen/dataTradingBusiness": ()=> import('@/views/biScreen/dataTradingBusiness.vue'), // 自动交易业务监控看板
  "/biScreen/dataMemberLoginLog": ()=> import('@/views/biScreen/dataMemberLoginLog.vue'), // 会员登录日志
  "/biScreen/dataMemberTrading": ()=> import('@/views/biScreen/dataMemberTrading.vue'), // 会员交易画像
  "/biScreen/dataBusinessRealTime": ()=> import('@/views/biScreen/dataBusinessRealTime.vue'), // 业务实时监控看板
  "/biScreen/dataFakeAppBuyAnalysis": ()=> import('@/views/biScreen/dataFakeAppBuyAnalysis.vue'), // 假APP买入分析
  "/biScreen/dataTrackingAnalytics": ()=> import('@/views/biScreen/dataTrackingAnalytics.vue'), // 收银台埋点分析
  "/biScreen/dataUsdtBuyOrder": ()=> import('@/views/biScreen/dataUsdtBuyOrder.vue'), // USDT买入订单统计
  "/biScreen/dataFackAppSellAppeal": ()=> import('@/views/biScreen/dataFackAppSellAppeal.vue'), // 假APP卖单申诉分析

  "/ticket/ticketList": ()=> import('@/views/ticket/ticketList.vue'), // 工单列表
  "/ticket/ticketConfig": ()=> import('@/views/ticket/ticketConfig.vue'), // 工单配置
  "/fieldNotes/doc": ()=> import('@/views/prototype/fieldNotes.vue'), // 字段理解文档

}
// 其他固定路由
const defaultRouterList: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      icon: '',
      title: 'login',
    },
  },
  {
    path: '/googleVerification',
    name: 'googleV',
    component: () => import('@/views/google/index.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/components/Upload/index.vue'),
  },
  {
    path: '/createNewKey',
    name: 'createNewKey',
    component: () => import('@/views/merchant/createNewKey.vue'),
  },
  {
    path: '/createExternalNewKey',
    name: 'createExternalNewKey',
    component: () => import('@/views/kyc/createExternalNewKey.vue'),
  },
// {
  //   path: '/:pathMatch(.*)*',
  //   name: '404',
  //   meta: {
  //     title: 'NotFound',
  //   },
  //   component: Result404,
  // }
]
// 根据环境变量决定默认首页，sit环境下默认首页为会员列表，其他环境为数据概览
const routes: RouteRecordRaw[] = import.meta.env.VITE_FLAG == 'sit' ? [
  {
    path: '/',
    name: 'home',
    component: Layout,
    redirect: '/member/list',
    children: [
      {
        path: '/member/list',
        name: '_member_list',
        component: () => import('@/views/member/list.vue'),
        meta: {
          icon: 'm17',
          title: 'm17',
        },
      },
    ],
  },
  ...defaultRouterList,
] : [
  {
    path: '/',
    name: 'home',
    component: Layout,
    redirect: '/biScreen/dataOverview',
    children: [
      {
        path: '/biScreen/dataOverview',
        name: 'm2',
        component: () => import('@/views/biScreen/dataOverview.vue'),
        meta: {
          icon: 'm2',
          title: 'm2',
        },
      },
    ],
  },
  ...defaultRouterList,
]
const asyncImportRoute = (data: MenuItemSchema[] = []) => {
  return data.map((item) => {
    const meta = {
      title: item.name,
    }
    const name = item.path.split('/').join('_')
    const routeItem: any = {
      name: name,
      component: item.component === '/Layout' ? Layout : routemap[item.component],
      path: item.path.startsWith('/') ? item.path : `/${item.path}`,
      meta,
    }
    const children = item.children || []
    if (children.length) routeItem.children = asyncImportRoute(item.children)
    if (routeItem.children && routeItem.children.length) {
      routeItem.redirect = routeItem.children[0].path
    }
    return routeItem
  })
}
NProgress.configure({ showSpinner: false })
const whiteRouters = ['/login','/upload']
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
const addRouters = (data: MenuItemSchema[]) => {
  // 原型里把页面都挂到同一个 home Layout 下。
  // 原来每个栏目各自再挂一层 Layout，切栏目等于整页重挂；假数据一旦把子树弄脏，就会出现 URL 变了、内容不跳的情况。
  if (isPrototype) {
    const pages = data.filter((item) => item.parentId !== -1 && item.component && item.component !== '/Layout')
    pages.forEach((item) => {
      const name = item.path.split('/').join('_')
      if (router.hasRoute(name)) router.removeRoute(name)
      const component = routemap[item.component]
      if (!component) return
      router.addRoute('home', {
        name,
        path: item.path.startsWith('/') ? item.path : `/${item.path}`,
        component,
        meta: { title: item.name },
      })
    })
    return
  }
  const pages = data.filter((item) => item.component !== '')
  const parentIds = pages.map((item) => item.parentId).filter((id)=>id!==-1)
  const parent = data.filter((item) => parentIds.includes(item.id)&&item.parentId!==-1)
  const routeList = asyncImportRoute(toTree([...parent, ...pages]))
  routeList.forEach((item) => {
    if (router.hasRoute(item.name)) router.removeRoute(item.name)
    router.addRoute(item)
  })
}
let maxCount = 2;
let dynamicRoutesReady = false;
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const { getToken,getMenus, loginOut, menuList } = userInfo();
	const isBindGoogle = localStorage.getItem('isBindGoogle');
	// 未绑定谷歌只能停留在绑定页；绑定页不依赖菜单，直接放行，不走下面的菜单加载
	if(getToken() && isBindGoogle == "0"){
		if (to.path === '/googleVerification') return next();
		if (from.path === '/googleVerification') return next(false);
		return next({path: '/googleVerification'});
	}
  if (getToken()) {
    if (to.path === '/login') {
      return next('/biScreen/dataOverview')
    }
    if(!menuList.value.length) {
      dynamicRoutesReady = false
      if(maxCount > 0){
        maxCount--;
        try{
          const res: any = await getMenus();
          if(res){
            // 菜单刚拉到时只触发一次重进，不能再往下走到第二个 next()
            return next(to.path);
          }
          return next(false);
        }catch(e){
          return next(false);
        }
      }
      loginOut()
      clearGlobalOverlays()
      message.error('You do not have permission. Please log in again.');
      maxCount = 2
      return next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      })
    }
    // 动态路由只挂一次。每次跳转都 remove/add 会把 keep-alive 页拆坏，表现为点菜单不跳转。
    if (!dynamicRoutesReady) {
      addRouters(menuList.value.filter((item) => !item.isExt));
      dynamicRoutesReady = true
    }
    const routes = router.getRoutes(); // 获取所有路由
    const pathExists = routes.some(route => route.path === to.path);//判断路由是否在路由表中，不在则返回首页
    if (!pathExists) {
      return next('/biScreen/dataOverview')
    }
    if (router.hasRoute(to.name as string)) {
      next()
      return
    }
    if (to.name === '404') {
      return  next({ path: to.fullPath, replace: true, query: to.query });
    } else {
      const redirect = decodeURIComponent((from.query.redirect || to.path) as string);
      next(to.path === redirect ? { ...to, replace: true } : { path: redirect });
      return;
    }
    //
  } else {
    if (whiteRouters.includes(to.path)) {
      if (to.path === '/login') {
        clearGlobalOverlays()
      }
      next()
    } else {
      NProgress.done()
      clearGlobalOverlays()
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      })
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
export default router
