import { computed } from "vue";
import i18n from '@/i18n';
const t = (key: string, args?: any) => {
  return computed(() => i18n.global.t(key, args)).value;
}

export const timeZoneMap = [
  "GMT-12:00",
  "GMT-11:00",
  "GMT-10:00",
  "GMT-09:30",
  "GMT-09:00",
  "GMT-08:00",
  "GMT-07:00",
  "GMT-06:00",
  "GMT-05:00",
  "GMT-04:00",
  "GMT-03:30",
  "GMT-03:00",
  "GMT-02:00",
  "GMT-01:00",
  "GMT+00:00",
  "GMT+01:00",
  "GMT+02:00",
  "GMT+03:00",
  "GMT+03:30",
  "GMT+04:00",
  "GMT+04:30",
  "GMT+05:00",
  "GMT+05:30",
  "GMT+05:45",
  "GMT+06:00",
  "GMT+06:30",
  "GMT+07:00",
  "GMT+08:00",
  "GMT+08:45",
  "GMT+09:00",
  "GMT+09:30",
  "GMT+10:00",
  "GMT+10:30",
  "GMT+11:00",
  "GMT+12:00",
  "GMT+12:45",
  "GMT+13:00",
  "GMT+14:00",
];

export const formConfig = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};
//买入/卖出订单列表-订单状态
export const orderStatusMap:any = {
  1: 'n83',//待匹配
  2: 'n84',//匹配超时
  3: 'n85',//待支付
  4: 'm731',//到账确认中
  5: 'n87',//确认超时
  6: 'n88',//申诉中
  7: 'n82',//订单失效
  8: 'n56',//已取消
  9: 'n89',//已完成
  10: 'n90',//买入失败
  11: 'n91',//金额错误
  12: 'n37',//未支付
  13: 'n92',//支付超时
  15: 'n107',//手动完成
  17: 'm732',//放单确认中
}
//买入/卖出订单列表-放单状态
export const releseMap:any = {
  0: 'm743',//未放单
  1: 'm744',//已放单
}

export const callBackStatus:any = {
  1: 'n93',
  2: 's18',
  3: 's19',
  4: 's20',
  5: 's21',
}
export const merchantCallBackStatus:any = {
  1: 'n93',
  2: 's18',
  3: 's19',
  4: 's20',
  5: 's21',
}
export const changeType = <any>{
  1: 'n104',//买入
  2: 'n100',//卖出
  3: 'n101',//USDT买入
  4: 'n102',//人工上分
  5: 'm79', //冻结
  6: 'e3',//解冻
  7: 'n103',//人工下分
  8: 'e6',//买入奖励
  9: 'e7',//卖出奖励
  10: 'n456',//取消退回->卖单金额退回
  11: 'e9',//支付
  12: 'e10',//到账
  13: 'n159',//金额错误退回
  14: 'm337',//任务奖励
  // 15: "m644",
  // 16: "m645",
  17: "m646",//余额退回
  18: "m857",//买入返佣
  19: "m858",//卖出返佣
  20: "m901",//USDT卖出
  21: "m902",//USDT买入失败退回
  22: "m955",//USDT买入奖励
  23: "n209",//欠费下分
  24: "g1",//奖励卡卖出
  25: "g2",//奖励卡退回
  26: "g3",//奖励卡冻结
  27: "g4",//奖励卡解冻
  28: 'n1180',// 欠费下分退回
  29: 'n1475',//系统冻结
  30: 'n1486',//额外奖励
  31: 'n1790',//单笔买入固定奖励
  32: 'n1791',//单笔卖出固定奖励
}
export const certificateStatus:any = {
  // 1: 'c12',
  1: 'c18',
  2: 'c19',
  3: 'c100',
 }

export const statusMap:any ={
  1: 'p58',
  2: 'n82',
  3: 'p59',
}
//撮合列表-状态
 export const matchlistStatus:any = {
  3: 'n85',//待支付
  4: 'm731',//到账确认中
  5: 'n87',//确认超时
  6: 'n88',//申诉中
  7: 'n82',//已完成
  8: 'n56',//已取消
  12: 't64',//买入失败/订单失效
  13: 'n92',//支付超时
  15: 'n107',//手动完成
  16: 'm479',//人工审核
  // 17: 'm732',//放单确认中
 }

 export const payTypeData = <any>{
    1: "m166",
    2: "m167",
    3: "m168",
    // 4: "m169",
    5: "m665",
  }
  //申诉订单-申诉类型
  export const appealMap = <any>{
    1: 'n38',//卖出申诉
    2: 'n79',//买入申诉
  }
  //撮合列表-申诉类型
  export const matchlistAppealMap = <any>{
    1: 'n79',//买入申诉
    2: 'n38',//卖出申诉
  }
  export const windControl = <any>{
    1: 'm437',
    2: 'm438',
    3: 'm436',
  }
export const levelMap = <any>{
  0:'L0',
  1:'L1',
  2:'L2',
  3:'L3',
  4:'L4',
  5:'L5',
  6:'L6',
  7:'L7',
  8:'L8',
  9:'L9',
  10:'L10',
}

export const taskEventMap = <any>{
  real_name_auth: {
    name: 'c17',//实名认证
    remark: 'n695',//用户在APP端/H5完成实名认证即触发此事件
  },
  buy_guide: {
    name: 'n690',//买入引导
    remark: 'n696',//用户在APP端/H5完成买入新手引导即触发此事件
  },
  sell_guide: {
    name: 'n691',//卖出引导
    remark: 'n697',//用户在APP端/H5完成卖出新手引导即触发此事件
  },
  bind_fake_app_and_real_name_auth: {
    name: 'n1644',//绑定假App并实名认证
    remark: 'n1644',//绑定假App并实名认证
  },
  success_buy: {
    name: 'n692',//成功买入
    remark: 'n698',//用户在APP端/H5完成买入即触发此事件
  },
  success_sell: {
    name: 'n693',//成功卖出
    remark: 'n699',//用户在APP端/H5完成卖出即触发此事件
  },
  net_buy_sell_amount: {
    name: 'n618',//净买卖金额
    remark: 'n700',//用户的净买卖金额数值
  },
  invitation_member: {
    name: 'n694',//邀请用户
    remark: 'n701',//蚂蚁会员用户在APP端/H5邀请新用户，新用户注册成功即触发此事件
  },
  invitation_and_success_trade: {
    name: 'n793',//邀请并成功交易
    remark: 'n794',//邀请用户并且新用户完成一笔买入或卖出交易即触发此事件
  },
  buy_transaction_volume: {
    name: 'n1321',//买入交易额
    remark: 'n1322',//用户当天完成设定任务金额后触发事件，连续完成设定天数可领取奖励
  },
  usdt_recharge: {
    name: 'n2029',//USDT充值
    remark: 'n2030',//用户通过USDT买入通道成功到账的ARB累计达到设定档位即触发此事件
  },
}
export const taskTypeMap = <any>{
    1 : t('m370'),//买入任务,
    2 : t('m371'),//卖出任务,
    3 : t('n681'),//运营任务,
    4 : t('m373'),//新手任务,
}
export const tradeTypeMap = <any>{
  1:'n104',
  2:'n100'
}
export const triggerEventMap = <any>{
  1: 'n92',
  2: 'n82',
  3: 'm501',
  4: 'm542',
  5: 'n87',
}
export const eventTypeMap = <any>{
  1: 'n92',
  2: 'm502',
  3: 'm503',
  4: 'm504',
  5: 'm505',
  6: 'm506',
  7: 'm507',
  8: 't54',
}
export const kycCompletion = <any>{
  0:'no',
  1:'yes'
}

export const memberTypeList = <any>{
  1: "n180",//内部会员
  2: "n181",//商户会员
  3: "n96",//钱包会员
  4: "m842",//蚂蚁会员
  5: "m992",//快捷会员
  6: "n869",//NPC会员
};
//USD买入回调状态
export const usdtBuyCallbackStatus:any = {
  1: 'n93',//未回调
  2: 's18',//回调成功
  3: 's19',//回调失败
}
//USD卖出订单状态
export const usdSellOrderStatus:any = {
  7: 'n82',//已完成
  10: 'm898',//卖出失败
  18: 'm899',//待审核
  19: 'm900',//出款中
}
//USD卖出回调状态
export const usdSellCallbackStatus:any = {
  1: 'n93',//未回调
  2: 's18',//回调成功
  3: 's19',//回调失败
}
//USDT卖出三方交易状态
export const usdSellTradeStatus:any = {
  1: 'p58',//支付中
  2: 'm619',//成功
  3: 'p59',//代付失败
}


//导出类型枚举
export const exportTypeMap:any = {
  1: 'n552',//会员信息导出
  2: 'n553',//会员账变导出
  3: 'n554',//申诉订单导出
  4: 'n555',//USDT买入订单导出
  5: 'n556',//母订单导出
  6: 'n557',//撮合订单导出
  7: 'n558',//买入订单导出
  8: 'n559',//欠费信息导出
  9: 'n560',//欠费订单导出
  10: 'n561',//卖出订单导出
  11: 'n562',//商户代付订单导出
  12: 'n563',//商户代收订单导出
  13: 'n564',//商户账变信息导出
  14: 'n565',//封控用户导出
  15: 'n566',//USDT提现订单导出
  16: 'n573',//充值失败记录导出
  17: 'n620',//蚂蚁层级列表导出
  18: 'n619',//会员黑名单导出
  19: 'n702',//任务领取列表导出
  20: 'n1091',//通道代收列表导出
  21: 'n1092',//通道账变列表导出
  22: 'n1157',//UPI ID风控日志导出
  23: 'n1158',//用户解禁日志导出
  24: 'n1159',//收款列表导出
  25: 'n1345',//异常断连日志导出
  26: 'n1436',//工单列表导出
  27: 'n1496',//人工卖出订单记录导出
  28: 'n1621',//商户后台代付订单导出
  29: 'n1622',//商户后台代收订单导出
  30: 'n1623',//商户后台账变导出
  31: 'n2036',//会员相册导出
  32: 'n2037',//系统自动卖出日志导出
  33: 'n2038',//KYC短信验证日志导出
  35: 'n2043',//平台参数配置操作日志导出
  36: 'n2066',//商户列表导出
}
//导出状态枚举
export const exportStatusMap:any = {
  0: 'm685',//处理中
  1: 'm619',//成功
  2: 'm618',//失败
  3: 'n1221',//排队中
}
//代理端口配置状态
export const agentPortStatus:any = {
  0: 'n594',//未启用
  1: 'enabled',//启用
  2: 'disabled',//禁用
}
//代理端口供应商
export const agentPortSupplier = {
  1: 'oxylabs',//oxylabs
  2: 'Bright',//Bright
}

//用户密码正则
export const userPwdReg = /^(?=.*[A-Z].*)(?=.*[a-z].*|.*[0-9].*|.*[.?@&!].*).{8,16}$|^(?=.*[a-z].*)(?=.*[0-9].*|.*[.?@&!].*).{8,16}$|^(?=.*[0-9].*)(?=.*[.?@&!].*).{8,16}$/;
//邮箱正则
export const emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
//UPIID正则
export const upiIdReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;

export const biDataUrl = computed(() => {
  // 原型模式不嵌入线上 BI，避免页面带出真实看板数据
  if (import.meta.env.VITE_PROTOTYPE === 'true') return {}
  if(import.meta.env.VITE_FLAG == 'prod'){//生产环境
    return {
      //数据概览
      2: 'https://bi.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=b4401bf1-4fe1-477c-a8b0-6e3515e25d0d&token=a8DjKl0qWxBs3rYvZn',
      //对账报表
      3: 'https://bi-3.arbtotal.com/token3rd/report/view.htm?id=272b7a4b-27ba-4039-a4f5-fa6253ac1dbe&token=y8JsUiRn4lBp3gVxZd',
      //商户报表
      4: 'https://bi-2.arbtotal.com/token3rd/report/view.htm?id=888cdc57-7c91-4805-a05d-6bc7a9def0c3&token=z0BfyWmR9NdjX7KvPq',
      //买入/卖出报表
      5: 'https://bi-1.arbtotal.com/token3rd/report/view.htm?id=f304899d-c7dc-434c-b228-f06e12a89a02&token=kJp7QsA5yFr3XtM2Lc',
      //匹配数据概览
      8: 'https://bi-4.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=93520383-2eb2-44e6-a8d6-2b51dd498512&token=A7mXzPqB9KjL5NvYt2',
      //充值数据概览
      9: 'https://bi-5.arbtotal.com/token3rd/dashboard/view/pc.htm?token=A7mXzPqB9KjL5NvYt3&pageId=0db2fd24-59fa-4d64-8d3e-d4a14e5c9220',
      //财务数据报表
      10: 'https://bi-6.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=94d3844a-a161-4949-8e78-3c3c01b06430&token=a8DjKl0qWxiss3rYvZn',
      //会员统计看板
      11: 'https://bi-7.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=3d7e5166-80d2-4cdd-9b12-041158d00fda&token=a8DjKl0qWxiss3rYvZn',
      //资金流向看板
      12: 'https://bi-8.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=14c075db-d775-4fd8-9832-4c85eb44c068&token=a8DjKl0qWxiss3rYvZn',
      //指标比对结果表
      13: '',
      //KYC交易统计
      14: 'https://bi-9.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=7a81438b-b972-40a5-96f5-d2c4d3c8881b&token=a8DjKl0qWxiss3rYvZn',
      //蚂蚁会员统计看板
      15: 'https://bi-10.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=2f77674e-d205-47df-a156-6fcfc9261b87&token=a8DjKl0qWxiss3rYvZn',
      //KYC短信日志明细
      16: 'https://bi-12.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=5db2149b-dff4-4f2b-881b-746e3abde91b&token=a8DjKl0qWxiss3rYvZn',
      //KYC短信次数成功日统计
      17: 'https://bi-11.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=51fe486a-be5b-4d80-9dd7-253679c8be10&token=a8DjKl0qWxiss3rYvZn',
      //银行接口数据分析
      18: 'https://bi-13.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=17e491b0-b677-4519-ae62-98c065cd4b4b&token=a8DjKl0qWxiss3rYvZn',
      //申诉订单监控
      19: 'https://bi-14.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=b499bd1f-a00d-4bc9-b6ec-b487fc25f4d5&token=a8DjKl0qWxiss3rYvZn',
      //欠费监控看板
      20: 'https://bi-15.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=fe1cb19d-fe42-4d32-a867-66344bbcd5bd&token=a8DjKl0qWxiss3rYvZn',
      //撮合看板
      21: 'https://bi-16.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=ff30dcc8-4b07-471c-9ac5-28f9dd156088&token=a8DjKl0qWxiss3rYvZn',
      //USDT买入报表
      22: 'https://bi-17.arbtotal.com/token3rd/report/view.htm?id=62a9dc77-b850-481d-b38e-d8b9b0aeeab1&token=kJp7QsA5yFr3XtM2Lc',
      //业务数据库数据量
      23: 'https://bi-18.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=a1daefb5-2541-42ac-abc3-297d73c4c10b&token=a8DjKl0qWxiss3rYvZn',
      //注册和登录基础指标数据
      24: 'https://bi-20.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=9f65c34f-04ca-4c25-a854-c19be1edf99e&token=a8DjKl0qWxiss3rYvZn',
      //商户余额自检报告表
      25: 'https://bi-21.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=07a035fb-29e7-4083-8836-4ffd268c3cd5&token=a8DjKl0qWxiss3rYvZn',
      //新客首月转化
      26: 'https://bi-22.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=82031839-51ee-462b-9701-e8221c5ba651&token=a8DjKl0qWxiss3rYvZn',
      //蚂蚁会员奖励
      27: '',
      //提权成功率统计
      28: 'https://bi-23.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=1003b514-8d2b-4839-bc3e-f0d4c6113715&token=a8DjKl0qWxiss3rYvZn',
      //自动交易业务监控看板
      29: 'https://bi-24.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=f3b9b76f-b2bb-4bd2-89b1-c3390c85c1b7&token=a8DjKl0qWxiss3rYvZn',
      //会员登录日志
      30: 'https://bi-25.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=3dc6c29e-e138-403a-843a-8c190dc8183b&token=a8DjKl0qWxiss3rYvZn',
      //会员交易画像
      31: 'https://bi-26.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=21e4c936-a492-44d4-b75c-6909413e61eb&token=a8DjKl0qWxiss3rYvZn',
      //假APP买入分析
      33: 'https://bi-27.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=2b196546-23cd-4daa-8627-7edff6e6b01c&token=a8DjKl0qWxiss3rYvZn',
      //收银台埋点分析
      34: 'https://bi-28.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=763b59bd-d827-4c86-82ff-f98509c54dbf&token=a8DjKl0qWxiss3rYvZn',
      //USDT买入订单统计
      35: 'https://bi-30.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=772abace-a4cc-434d-85da-0571e44300dc&token=a8DjKl0qWxiss3rYvZn',
      //假APP卖单申诉分析
      36: 'https://bi-29.arbtotal.com/token3rd/dashboard/view/pc.htm?pageId=a2dbe02f-b096-4c1b-a44e-e87ee7a08a3d&token=a8DjKl0qWxiss3rYvZn',
    }
  }else{//测试环境
    return {
      //数据大屏
      1: 'https://bi-ap-southeast-1.data.aliyun.com/t/vIjYfu',
      //数据概览
      2: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=590f6d85-6a5b-4f00-bb37-46a5e9767f24&accessTicket=d81d314c-bab1-4f96-b9b8-866d0f37e934&dd_orientation=auto',
      //对账报表
      3: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/report/view.htm?id=3634ea4a-071d-45cb-b177-5d8012676a9a&accessTicket=eef24ee6-af67-4756-a45c-a1da93391143&dd_orientation=auto',
      //商户报表
      4: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/report/view.htm?id=836ab194-ba17-4846-8fdd-30c487b6ccec&accessTicket=2cbc03a0-324b-405e-8b3e-64f2d7a57091&dd_orientation=auto',
      //买入报表
      5: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/report/view.htm?id=f6ee89e5-b42f-48c5-b4c2-7c98141543ad&accessTicket=e0903093-caad-4ba5-9869-e0fd57eaf433&dd_orientation=auto',
      //卖出报表
      6: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/report/view.htm?id=e324b426-7fc9-4f60-88b1-0e61865fa12e&accessTicket=65934c6d-ba45-4e16-b38c-59bbfb668653&dd_orientation=auto',
      //ARB数据可视化
      7: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=514a8491-fafa-4c5e-92db-4eca1a6c27a1&accessTicket=ff753fbb-5c72-414e-b544-256b548d4fc5&dd_orientation=auto',
      //匹配数据概览
      8: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=3b2c2982-c7dd-4352-918a-90ab708a5d97&accessTicket=623a88e2-1fca-4134-a7b3-8ed58e7b147e&dd_orientation=auto',
      //充值数据概览
      9: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=93bfbdf4-1d5b-45f8-8f63-0d081a53a337&accessTicket=3a6cc58a-afde-41ac-a04a-ad66ad75c685&dd_orientation=auto',
      //财务数据报表
      10: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=56ca6fae-4f16-4411-807f-1f0678d504a7&accessTicket=1afc9712-7a7b-4ffb-bac7-1c4f2e3746d1&dd_orientation=auto',
      //会员统计看板
      11: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=612b13d5-e29e-49a8-861a-3a7958493401&accessTicket=d77a6aff-798e-44f2-a481-b416d1eb046e&dd_orientation=auto',
      //资金流向看板
      12: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=7d78041f-0d94-4ea5-9e51-bb28b6070c90&accessTicket=84684f57-5d74-4e6a-9ac6-cb04384d078b&dd_orientation=auto',
      //指标比对结果表
      13: 'https://bi-ap-southeast-1.alibabacloud.com/token3rd/dashboard/view/pc.htm?pageId=5375f98a-5228-40cf-9378-6da3d9556e3b&accessTicket=14723839-a70d-4738-9a96-b89f803b712b&dd_orientation=auto',
      //KYC交易统计
      14: 'https://bi-ap-southeast-1.alibabacloud.com/token3rd/dashboard/view/pc.htm?pageId=f2fafb00-28f7-493a-923a-f7d2eae37738&accessTicket=0302f64a-cadd-4b50-8cce-fbbd6b26d3be&dd_orientation=auto',
      //蚂蚁会员统计看板
      15: '',
      //KYC短信日志明细
      16: 'https://bi-ap-southeast-1.alibabacloud.com/token3rd/dashboard/view/pc.htm?pageId=6de0533f-de98-4538-b3dd-e8e05c7a0370&accessTicket=f191dc98-6348-4a30-9758-fa3cfbb31810&dd_orientation=auto',
      //KYC短信次数成功日统计
      17: 'https://bi-ap-southeast-1.alibabacloud.com/token3rd/dashboard/view/pc.htm?pageId=db0a5719-bf5c-454b-a37f-e424e2b635c0&accessTicket=fc53480a-14b4-43db-9da2-bd3287594f52&dd_orientation=auto',
      //银行接口数据分析
      18: '',
      //申诉订单监控
      19: '',
      //欠费监控看板
      20: '',
      //撮合看板
      21: '',
      //USDT买入报表
      22: '',
      //业务数据库数据量
      23: '',
      //注册和登录基础指标数据
      24: '',
      //商户余额自检报告表
      25: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=ff8b0540-28ea-4cf5-bf58-e2fb53d2e5f7&accessTicket=6f0ee8d4-3b76-4c9f-b7cf-f003733635e8&dd_orientation=auto',
      //新客首月转化
      26: '',
      //蚂蚁会员奖励
      27: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=65cdef13-5de7-4b8a-90ed-f5bc7fc558c5&accessTicket=b3e5f7f5-132a-4e57-a7f3-9c2bb7e06f96&dd_orientation=auto',
      //提权成功率统计
      28: '',
      //自动交易业务监控看板
      29: '',
      //会员登录日志
      30: '',
      //会员交易画像
      31: '',
      //假APP买入分析
      33: '',
      //收银台埋点分析
      34: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=d4b45fb4-42a5-451d-a11c-74a4744d22d2&accessTicket=1523a5d3-907e-4096-8667-d436caeb86eb&dd_orientation=auto',
      //USDT买入订单统计
      35: 'https://bi-ap-southeast-1.data.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=65926937-1525-48f2-8b9a-97d07704edff&accessTicket=c47e68bf-d0bb-4dbd-9082-01dba4bc7b2b&dd_orientation=auto',
      //假APP卖单申诉分析
      36: '',
    }
  }
});
export const groupIdMap: any = {
  0: t("n514"),//未分组
  1: t("n515"),//潜在蚂蚁
  2: t("n516"),//低度活跃
  3: t("n517"),//中度活跃
  4: t("n518"),//高度活跃
};
export const antConversionTypeMap: any = {
  // 0: t("n540"),//未转化
  1: t("n541"),//系统转化
  2: t("n542"),//用户申请
  3: t("n543"),//后台创建
  4: t("n703"),//蚂蚁邀请
};

// 卖出订单类型
export const sellOrderTypeMap:any = {
  // 0: 'n583',//未定义
  1: 'n585',//ARB订单
  2: 'n584',//CPB订单
}
// 买入订单类型
export const buyOrderTypeMap:any = {
  // 0: 'n583',//未定义
  1: 'n586',//AR_UPI订单
  2: 'n587',//AR_PAY订单
  3: 'n588',//钱包内部买入
  4: 'n1290',//AR_UPI外部订单
  5: 'n1171',//ARUPI-SAAS订单
  6: 'n1566',//自动买入订单
  7: 'n1848',//智能抢单订单
}

export const buyOrderTypeColorMap:any = {
  1: 'tag-green',//AR_UPI订单
  2: 'tag-blue',//AR_PAY订单
  3: 'tag-orange',//钱包内部买入
  4: 'tag-purple',//AR_UPI外部订单
  5: 'tag-yellow',//ARUPI-SAAS订单
  6: 'tag-pink',//自动买入订单
  7: 'tag-brown',//智能抢单订单
}
// 客服类型
export const antCustomerMap:any = {
  0: 'AR Wallet',
  1: 'C2C',
  2: 'AR UPI',
}

// 拆分方案
export const splitStrategyMap:any = {
  0: 'n646',//快速到账
  1: 'n647',//智能拆单
}
// 订单来源
export const orderSourceMap:any = {
  0: 'n623',//内部订单
  1: 'n624',//快捷提现-UPI
  2: 'n625',//快捷提现-银行卡
  3: 'n1089',//快捷提现-KYC
  4: 'n1540',//交易所-UPI
  5: 'n1541',//交易所-银行卡
}

// 自动卖出标记 autoSellFlag（撮合列表、卖出记录、匹配池、买入记录共用）
export const autoSellFlagMap:any = {
  0: 'no',//否
  1: 'n1992',//是/用户开启
  2: 'n1993',//是/系统开启
}
// 以下自动卖出相关方法会在模板渲染中调用，直接用 i18n.global.t 翻译，
// 不走本文件的 t（每次调用都会新建 computed，渲染中反复创建会一直挂在语言依赖上无法回收）
// 是否为自动卖出（是/用户开启、是/系统开启），用于标签着色
export const isAutoSellFlag = (flag: any) => Number(flag) !== 0 && !!autoSellFlagMap[flag];
// 自动卖出展示文案：未知值或空值按“否”展示
export const getAutoSellFlagLabel = (flag: any) => i18n.global.t(autoSellFlagMap[flag] || 'no');
// 自动卖出搜索下拉选项（a-select options），页面内用 computed 包一层，避免每次渲染重建
export const getAutoSellFlagOptions = () =>
  Object.entries(autoSellFlagMap).map(([value, label]: [string, any]) => ({ value, label: i18n.global.t(label) }));
// 自动卖出表头筛选项（a-table column filters）
export const getAutoSellFlagFilters = () =>
  Object.entries(autoSellFlagMap).map(([value, label]: [string, any]) => ({ value, text: i18n.global.t(label) }));

// 买卖奖励配置-订单来源
export const tradeRewardOrderSourceMap:any = {
  0: 'n623',//内部订单
  1: 'n624',//快捷提现-UPI
  2: 'n625',//快捷提现-银行卡
  3: 'n1089',//快捷提现-KYC
  4: 'n1586',//全自动买入-UPI
  5: 'n1587',//全自动买入-银行卡
  6: 'n1584',//AutoBuy列表手动买入-UPI
  7: 'n1585',//AutoBuy列表手动买入-银行卡
}
export const appealTypeMap = <any>{
  1: 'n88',// 申诉中
  2: 's16',// 申诉成功
  3: 's17',// 申诉失败
}

export const displayAppealTypeMap = <any>{
  1: 'n37',//未支付
  2: 'n91',//金额错误
  3: 'n87',//确认超时
  4: 'm952',//买入自动申诉
  5: 'm953',//卖出自动申诉
  6: 'n449',//买入失败申诉
  7: 'n1184',//KYC验证码发送失败
  8: 'n1633',//KYC验证码验证失败
}
export const antBuyShowUserMap:any = {
  1: t('m984'),//快捷买入
  2: t('n723'),//自选列表-安全UPI
  3: t('n724'),//自选列表-快捷UPI
  4: 'BANK',//BANK
  5: 'USDT',//USDT
}

// kyc连接日志变更来源
export const kycLinkStatusChangeSourceMap:any = {
  // 0: '-',//其他
  1: t('n235'),//买方
  2: t('n236'),//卖方
}
// kyc连接日志变更类型
export const kycLinkStatusChangeTypeMap:any = {
  // 0: '-',//其他
  1: t('n741'),//连接
  2: t('n742'),//断开
}

// kyc连接日志变更原因
export const kycLinkStatusChangeReasonMap:any = {
  1: t('n79'), // 买入申诉
  2: t('n768'), // 更换KYC（快提订单）
  3: t('n38'), // 卖出申诉
  4: t('n769'), // 继续撮合
  5: t('n770'), // 发起卖出
  6: 'Link KYC', // Link KYC
  7: t('n771'), // 买入确认到账
  8: t('n772'), // 买入快提订单
  9: t('n747'), // 添加KYC
  10: t('n773'), // 买入失败申诉（快提订单）
  11: t('n774'), // 同手机买卖互顶
  12: t('n775'), // KYC断连（流水异常）
  13: t('n776'), // KYC断连（流水空数据）
  14: t('n777'), // KYC断连（30分钟无操作）
  15: t('n778'), // KYC断连（人工禁用UPI）
  20: t('n779'), // 自动续Token
  21: t('n780'), // KYC断连（系统风控）
  22: t('n781'), // KYC断连（Token失效）
  23: t('n782'), // KYC断连（Token刷新失败）
  24: t('n787'), // KYC断连（买方kyc断连）
  26: t('n783'), //买入失败申诉（ARUPI）
  27: t('n1176'), //外部卖出订单，拉取卖方KYC流水
  28: t('n1177'), //内部-卖方解禁UPI，连接KYC
  30: t('n1480'), //会员自助解冻
};

// KYC短信验证日志-业务场景，值为多语言 key，使用时再翻译以跟随语言切换（后端新增的场景前端未收录时显示接口返回的 desc）
export const kycSmsVerifySceneMap:any = {
  1: 'n747', // 添加KYC
  5: 'n2024', // 外部连接
  6: 'n2025', // 卖出连接
  7: 'm142', // 继续匹配
  8: 'n2026', // 卖方申诉
  9: 'n2027', // 解冻订单
  10: 'n744', // 收款列表连接
  11: 'n2028', // 解禁UPI
  12: 'n2032', // 快捷提现连接
  13: 'n2033', // 快提买入
  14: 'n771', // 买入确认到账
  15: 'n79', // 买入申诉
  16: 'n2034', // 快提申诉
  17: 'n449', // 买入失败申诉
  0: 'n2035', // 未知来源
};

// 任务周期
export const taskCycleMap = <any>{
    1 : t('m361'),//一次性
    2 : t('m362'),//周期性-每日
    3 : t('n790'),//周期性-自定义
}

export const tgMsgEnumMerchant = <any>{
  0: 'n817',//查看命令行
  1:'n818',//菜单
  1001:'n819',//查询代付订单状态
  1002:'n820',//查询代收订单状态
  1003:'n821',//UTR补单状态查询
  1004:'n822',//查询UPI ID是否属于我方账户
  1005:'n823',//查询商户余额
  1006:'n824',//查询UTR重复
  1007:'n1202',//外部订单获取申诉列表
  2000:'n825',//手动上分通知
  2001:'n826',//手动下分通知
  2002:'n827',//商户法币余额
  2003:'n885',//快捷提现订单定时通知
  2004:'n1083',//快捷提现汇总通知
  2006:'n1076',//申诉订单（买入+卖出）预警
  2007:'n1077',//代收订单未回调预警
  2008:'n1087',//过多卖单匹配中预警通知
  2009:'n1079',//代付订单未回调预警
  2010:'n1088',//KYC钱包预警通知
  2011:'n1062',//未创建订单预警->无成交订单预警
  2012:'n1086',//freeCharge维护通知
}

export const tgMsgTypeMap:any = {
  2004:'n1074',//快捷提现撮合中列表总计
  2005:'n1075',//预警通知
  2006:'n1076',//申诉订单（买入+卖出）预警
  2007:'n1077',//代收订单未回调预警
  2008:'n1087',//过多卖单匹配中预警通知
  2009:'n1079',//代付订单未回调预警
  2010:'n1088',//KYC钱包预警通知
  2011:'n1062',//未创建订单预警->无成交订单预警
  2012:'n1086',//freeCharge维护通知
}

export const arCashierPaymentMethodMap:any = {
  1: t('n840'),//UPI支付
  2: t('n841'),//唤醒支付
}

// 三方通道-代收付类型
export const thirdChannelPayTypeMap:any = {
  1: 'UPI',//UPI
  2: t('m657'),//银行卡
  3: 'USDT',//USDT
}
// 三方通道-币种
export const thirdChannelCurrencyMap:any = { 
  1: 'INR',
  2: 'USDT',
}

// 三方通道-订单类型
export const channelChangeTypeMap:any = {
  1: t('m262'),//代收
  2: t('m264'),//代收费用
  3: t('m263'),//代付
  4: t('m265'),//代付费用
  5: t('b3'),//手动上分
  6: t('m836'),//手动下分
}
// 通道代付订单状态
export const channelOrderStatusMap:any = {
  1: t('m685'),//处理中
  2: t('s10'),//成功
  3: t('m618'),//失败
}
// 通道代收订单回调状态
export const channelCallbackStatusMap:any = {
  0: t('n93'),//未回调
  1: t('n868'),//已回调
}

// 通道代收订单成功状态
export const channelCollectSuccessTypeMap:any = {
  1: t('n888'),//通道回调成功
  2: t('n889'),//平台拉取UTR成功
  3: t('n890'),//后台操作成功
  4: t('n891'),//确认超时时主动查询订单成功
}

export const riskControlRuleMap:any = {
  SELL01: 'n1133',//N分钟内累计被用户以收款账号异常的理由取消M次，累计计算期间如果出现成功订单需要重新累计计算
  SELL02: 'n1134',//N分钟内连续支付超时+已取消完结M次，连续计算期间如果出现成功订单需要重新连续计算
}
export const punishRuleNoMap:any = {
  HANDLE_MATCH_POOL_ORDER: 'n1135',//超时关联母单
  BAN_UPI: 'n1136',//禁用UPI
}
export const punishLevelMap:any = {
  1: t('n1137'),//首次命中
  2: t('n1138'),//二次命中
  3: t('n1139'),//三级三次命中
}
export const punishLevelRemarkMap:any = {
  1: t('n1140'),//将母订单状态流转为撮合超时，移除撮合池
  2: t('n1181'),//有进行中子单的母单超时待完结，无进行中子单的母单直接失败） + 限时禁用UPI
  3: t('n1142'),//（有进行中子单的母单超时待完结，无进行中子单的母单直接失败） + 禁用UPI
}
export const timeRangeTypeMap: any = {
  0: t("n1153"),//永久封禁
  1: t("n1154"),//当天24:00后解禁
  2: t("n1155"),//24小时后解禁
  3: t("n1156"),//7天后解禁
};
export const operationContentMap: any = {
  0: t("add"),//新增
  1: t("b8"),//修改
  3: t("b11"),//删除
  4: t("disabled"),//禁用
  5: t("enabled"),//启用
}
export const externalChannellModMap: any = {
  1: 'm616',//收入
  2: 'm617',//支出
}
export const colorMap: any = {
  0: 'tag-red',
  1: 'tag-green',
  2: 'tag-blue',
  3: 'tag-orange',
  4: 'tag-purple',
  5: 'tag-yellow',
  6: 'tag-cyan',
  7: 'tag-pink',
  8: 'tag-brown',
  9: 'tag-grey',
}
//KYC银行所有状态枚举
export const kycBankStatusMap: any = {
  1: 'm593',//卖出状态
  // 2: '是否支持多端登录',//是否支持多端登录
  3: 'n1389',//内部买入申诉
  4: 'n1390',//买入UPI
  5: 'n1391',//买入银行卡
  6: 'n1392',//Phonepe唤醒
  7: 'n1393',//外部买入申诉
  8: 'n1394',//外部卖出
  9: 'n1468',//彩票工单
  10: 'n1545',//假App交易
  11: 'n1531',//自动买入
  12: 'n2078',//OTP限制使用
}
//App银行所有状态枚举（没有OTP限制使用开关）
export const appBankStatusMap: any = { ...kycBankStatusMap }
delete appBankStatusMap[12]
//假APP银行所有状态枚举
export const fackAppBankStatusMap: any = {
  1: 'm593',//卖出状态
  2: 'n1687',//手动买入银行卡
  3: 'n1685',//手动买入UPI
  // 4: 'n1389',//内部买入申诉
  5: 'n1688',//自动买入银行卡
  6: 'n1686',//自动买入UPI
  7: 'n1707',//自动买入状态
  8: 'n1739',//回填UTR
  9: 'n1526',//是否提权
}
export const delayTypeMap = <any>{
  1: t("n1400"),//延迟到当日24:00点上分
  2: t("n1401"),//延迟6小时
  3: t("n1402"),//延迟12小时
  4: t("n1403"),//延迟24小时
  // 5: t("自定义（单位：秒）"),//自定义（单位：秒）
};
export const disableLimitTypeMap = <any>{
  1: t("n1404"),//当天24:00后解禁
  2: t("n1405"),//6小时后解禁
  3: t("n1406"),//12小时后解禁
  4: t("n1407"),//24小时后解禁
};

// 内容配置发布平台
export const contentPlantTypeMap: any = {
  1: 'APP',
  2: 'H5',
  3: 'H5+APP'
}

// 匹配状态
export const isMatchMap:any = {
  0: 'm697',//未匹配
  1: 'm696',//已匹配
  2: 'm806',//手动匹配
  3: 'm917',//金额异常
}

//假APP禁用规则
export const banRuleMap:any = {
  0: 'n1698',//解除绑定
  1: 'n1700',//解除绑定，并拉黑手机号
}