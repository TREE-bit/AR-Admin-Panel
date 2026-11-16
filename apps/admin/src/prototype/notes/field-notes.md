# 原型页面字段说明（汇总）

所有页面的字段理解集中在本文件。后续会话以本文件为准；用户指出不对时，只改正文对应页面小节，不要另起一套说法，也不要再拆成每页一个文件。

会员管理各页（§1～§16，含详情里的会员信息、账变记录、收款信息）字段理解已确认。用户没有另行纠正的，按正文理解执行。

APP 管理 §17～§22、KYC 管理 §23～§47 是按代码初读写下的，状态为供校正。等用户把这两栏的意见一起反馈后，再改字段说明和假数据。

其余栏目 §48～§133 也是按代码初读写下的，状态为供校正。BI 看板只说明为何是空状态。

§134 是这份存档的可视化，挂在原型侧栏「后台字段理解 / 字段理解文档」。页面直接读本文件，不另存一份字段。

修改日志仍单独维护：`changelog.md`。

## 目录

1. [会员列表 `/member/list`](#1-会员列表)
2. [会员详情 · 会员信息](#2-会员详情--会员信息)
3. [会员详情 · 账变记录](#3-会员详情--账变记录)
4. [会员详情 · 收款信息](#4-会员详情--收款信息)
5. [会员收款列表 `/member/paymentV2`](#5-会员收款列表)
6. [分组管理 `/member/group`](#6-分组管理)
7. [实名认证 `/member/name`](#7-实名认证)
8. [返佣记录 `/member/agentLevReo`](#8-返佣记录)
9. [会员USDT收款列表 `/member/usdtPayment`](#9-会员usdt收款列表)
10. [账变记录（独立菜单） `/member/changeReocde`](#10-账变记录独立菜单)
11. [会员短信日志 `/member/smslog`](#11-会员短信日志)
12. [会员操作日志 `/member/operationlog`](#12-会员操作日志)
13. [会员登录日志 `/member/loginlog`](#13-会员登录日志)
14. [手动操作记录 `/member/manuallog`](#14-手动操作记录)
15. [会员解绑记录 `/member/unbindLog`](#15-会员解绑记录)
16. [蚂蚁层级列表 `/member/agentLevel`](#16-蚂蚁层级列表)
17. [APP银行 `/appConfig/appBank`（菜单已弃用）](#17-app银行)
18. [会员APP信息 `/appConfig/appManager`](#18-会员app信息)
19. [APP数据收集 `/appConfig/appDataCollection`](#19-app数据收集)
20. [APP银行 `/appConfig/fackAppBank`](#20-app银行原假app银行)
21. [APP黑名单管理 `/appConfig/fackAppBlacklist`](#21-app黑名单管理)
22. [APP登陆失败记录 `/appConfig/fackAppLoginFailure`](#22-app登陆失败记录)
23. [会员KYC信息 `/kyc/kycManager`（菜单已弃用）](#23-会员kyc信息)
24. [会员KYC信息 `/kyc/kycManagerV2`](#24-会员kyc信息-v2)
25. [KYC银行列表 `/kyc/kycBank`](#25-kyc银行列表)
26. [KYC订单 `/kyc/kycOrder`](#26-kyc订单)
27. [卖出KYC待拉取列表 `/kyc/kycWaitRec`](#27-卖出kyc待拉取列表)
28. [买入KYC待拉取列表 `/kyc/kycWaitRecBuy`](#28-买入kyc待拉取列表)
29. [KYC续Token列表 `/kyc/kycToken`](#29-kyc续token列表)
30. [买入申诉流水 `/kyc/kycBuyAppealRec`](#30-买入申诉流水)
31. [KYC卖出申诉待拉取列表 `/kyc/kycSellAppealWait`](#31-kyc卖出申诉待拉取列表)
32. [KYC交易失败流水 `/kyc/kycFaildRecords`](#32-kyc交易失败流水)
33. [买入申诉失败流水 `/kyc/kycBuyAppealFailedRec`](#33-买入申诉失败流水)
34. [快捷提现 `/kyc/quickWithdrawal`](#34-快捷提现)
35. [KYC短信日志 `/kyc/kycSmsLog`](#35-kyc短信日志)
36. [upi买卖交易统计 `/kyc/kycTrading`](#36-upi买卖交易统计)
37. [KYC短信发送成功日志 `/kyc/kycSmsSuccessLog`](#37-kyc短信发送成功日志)
38. [卖出交易流水 `/kyc/sellTransRes`](#38-卖出交易流水)
39. [KYC流水状态异常 `/kyc/kycTransAbn`](#39-kyc流水状态异常)
40. [冲正流水 `/kyc/kycReversal`](#40-冲正流水)
41. [彩票工单通道列表 `/kyc/externalChanellList`](#41-彩票工单通道列表)
42. [彩票工单异常流水 `/kyc/externalChannelException`](#42-彩票工单异常流水)
43. [彩票工单待拉取列表 `/kyc/kycCollectionPending`](#43-彩票工单待拉取列表)
44. [彩票工单交易流水 `/kyc/externalChannellCollection`](#44-彩票工单交易流水)
45. [KYC多订单列表 `/kyc/kycMoreOrder`](#45-kyc多订单列表)
46. [支付成功流水 `/kyc/kycBuySuccessRecord`](#46-支付成功流水)
47. [自动交易流水 `/kyc/autoTransRes`](#47-自动交易流水)
48. [BI看板](#48-bi看板)
49. [系统日志 `/admin/log/index`](#49-系统日志-admin-log-index)
50. [用户管理 `/admin/user/index`](#50-用户管理-admin-user-index)
51. [菜单管理 `/admin/menu/index`](#51-菜单管理-admin-menu-index)
52. [角色管理 `/admin/role/index`](#52-角色管理-admin-role-index)
53. [IP白名单 `/admin/white/index`](#53-ip白名单-admin-white-index)
54. [交易IP黑名单 `/admin/black/index`](#54-交易ip黑名单-admin-black-index)
55. [系统登录日志 `/admin/sysLoginlog`](#55-系统登录日志-admin-sysloginlog)
56. [商户列表 `/admin/merchantInfo/index`](#56-商户列表-admin-merchantinfo-index)
57. [下发申请 `/merchant/application`](#57-下发申请-merchant-application)
58. [下发记录 `/merchant/record`](#58-下发记录-merchant-record)
59. [商户账变 `/merchant/changes`](#59-商户账变-merchant-changes)
60. [商户代收订单 `/merchant/recharge`](#60-商户代收订单-merchant-recharge)
61. [商户代付订单 `/merchant/withdraw`](#61-商户代付订单-merchant-withdraw)
62. [参数配置 `/config/setting/index`](#62-参数配置-config-setting-index)
63. [USDT管理 `/config/usdt/index`](#63-usdt管理-config-usdt-index)
64. [买入取消原因 `/config/rechargeCancel/index`](#64-买入取消原因-config-rechargecancel-index)
65. [卖出取消原因 `/config/withdrawCancel/index`](#65-卖出取消原因-config-withdrawcancel-index)
66. [内容配置 `/config/contentconfig/index`](#66-内容配置-config-contentconfig-index)
67. [运营参数配置 `/config/operations`](#67-运营参数配置-config-operations)
68. [任务管理 `/config/taskManagement`](#68-任务管理-config-taskmanagement)
69. [配置开关 `/config/switches`](#69-配置开关-config-switches)
70. [客服系统 `/config/selectLivechat`](#70-客服系统-config-selectlivechat)
71. [APP版本配置 `/config/nativeConfig`](#71-app版本配置-config-nativeconfig)
72. [银行字典 `/config/bankList`](#72-银行字典-config-banklist)
73. [IM客服 `/config/imChat`](#73-im客服-config-imchat)
74. [买卖奖励配置 `/config/tradeReward`](#74-买卖奖励配置-config-tradereward)
75. [导出列表 `/config/exportList`](#75-导出列表-config-exportlist)
76. [代理IP池 `/config/proxyPort`](#76-代理ip池-config-proxyport)
77. [事件管理 `/config/eventManager`](#77-事件管理-config-eventmanager)
78. [电报群管理 `/config/telegramManage`](#78-电报群管理-config-telegrammanage)
79. [奖励卡领取记录 `/config/getRewardsRecord`](#79-奖励卡领取记录-config-getrewardsrecord)
80. [自动交易APP版本配置 `/config/autoAppNativeConfig`](#80-自动交易app版本配置-config-autoappnativeconfig)
81. [域名管理 `/config/domainManager`](#81-域名管理-config-domainmanager)
82. [富文本测试 `/config/testEditor`](#82-富文本测试-config-testeditor)
83. [申诉订单 `/order/appeal/index`](#83-申诉订单-order-appeal-index)
84. [卖出订单 `/order/sale/index`](#84-卖出订单-order-sale-index)
85. [卖出订单 `/order/saleRecord/index`（菜单已弃用）](#85-卖出订单-order-salerecord-index)
86. [买入订单 `/order/buyOrder/index`](#86-买入订单-order-buyorder-index)
87. [买入订单记录 `/order/buyRecord/index`（菜单已弃用）](#87-买入订单记录-order-buyrecord-index)
88. [USDT买入订单 `/order/usdtBuyOrder/index`](#88-usdt买入订单-order-usdtbuyorder-index)
89. [母订单列表 `/order/matchingPool/index`](#89-母订单列表-order-matchingpool-index)
90. [撮合 `/order/assemble/index`](#90-撮合-order-assemble-index)
91. [申诉订单列表 `/order/appeal`（菜单已弃用）](#91-申诉订单列表-order-appeal)
92. [退款订单 `/order/refundOrder`](#92-退款订单-order-refundorder)
93. [卖出交易流水 `/order/kycRecords`](#93-卖出交易流水-order-kycrecords)
94. [USDT提现订单 `/order/usdtSellOrder`](#94-usdt提现订单-order-usdtsellorder)
95. [欠费订单 `/order/arrearsOrder`](#95-欠费订单-order-arrearsorder)
96. [人工卖出订单 `/order/sellOut/index`](#96-人工卖出订单-order-sellout-index)
97. [挂单列表 `/mandate/matchingOrderPool`](#97-挂单列表-mandate-matchingorderpool)
98. [推送金额记录 `/mandate/pushAmountRecord`](#98-推送金额记录-mandate-pushamountrecord)
99. [买入热度记录 `/mandate/hotBuyRecord`](#99-买入热度记录-mandate-hotbuyrecord)
100. [充值失败记录 `/mandate/topUpFailure`](#100-充值失败记录-mandate-topupfailure)
101. [智能拆单挂单列表 `/mandate/splitOrder`](#101-智能拆单挂单列表-mandate-splitorder)
102. [智能拆单失败记录 `/mandate/splitFailOrder`](#102-智能拆单失败记录-mandate-splitfailorder)
103. [买入报表 `/report/moonOf`](#103-买入报表-report-moonof)
104. [卖出报表 `/report/moonPay`](#104-卖出报表-report-moonpay)
105. [商户报表 `/report/merchant`](#105-商户报表-report-merchant)
106. [对账报表 `/report/reconciliation`](#106-对账报表-report-reconciliation)
107. [三方报表 `/report/fourReport`](#107-三方报表-report-fourreport)
108. [任务领取记录 `/task/detail`](#108-任务领取记录-task-detail)
109. [会员黑名单 `/wind/memberBlacklist`](#109-会员黑名单-wind-memberblacklist)
110. [封控用户列表 `/wind/riskControlUser`](#110-封控用户列表-wind-riskcontroluser)
111. [UPI ID风控日志 `/wind/riskUpiControlLog`](#111-upi-id风控日志-wind-riskupicontrollog)
112. [用户解禁日志 `/wind/riskUpiUnbanLog`](#112-用户解禁日志-wind-riskupiunbanlog)
113. [异常断连日志 `/wind/abnDisconnectLogs`](#113-异常断连日志-wind-abndisconnectlogs)
114. [银行卡黑名单 `/wind/bankCardBlack`](#114-银行卡黑名单-wind-bankcardblack)
115. [自动开启卖出日志 `/wind/autoSellEnableLog`](#115-自动开启卖出日志-wind-autosellenablelog)
116. [用户等级配置 `/userlevel/levelConfig`](#116-用户等级配置-userlevel-levelconfig)
117. [用户等级统计 `/userlevel/levelLog`](#117-用户等级统计-userlevel-levellog)
118. [信用分配置 `/userlevel/creditConfig`](#118-信用分配置-userlevel-creditconfig)
119. [信用分记录 `/userlevel/creditLog`](#119-信用分记录-userlevel-creditlog)
120. [福利配置 `/userlevel/welfareConfig`](#120-福利配置-userlevel-welfareconfig)
121. [支付通道 `/payment/manager`](#121-支付通道-payment-manager)
122. [三方通道 `/payment/channelManager`](#122-三方通道-payment-channelmanager)
123. [通道账变 `/payment/channelChanges`](#123-通道账变-payment-channelchanges)
124. [通道代收 `/payment/channelCollection`](#124-通道代收-payment-channelcollection)
125. [邮件模板 `/emailManager/emailTemp`](#125-邮件模板-emailmanager-emailtemp)
126. [APP推送模板 `/emailManager/appPushTemp`](#126-app推送模板-emailmanager-apppushtemp)
127. [邮件模板 `/emailManager/emailGroup`](#127-邮件模板-emailmanager-emailgroup)
128. [邮箱发件管理 `/emailManager/emailSenderMgmt`](#128-邮箱发件管理-emailmanager-emailsendermgmt)
129. [推送模板 `/emailManager/pushTemp`](#129-推送模板-emailmanager-pushtemp)
130. [推送方式管理 `/emailManager/pushMgmt`](#130-推送方式管理-emailmanager-pushmgmt)
131. [app推送渠道管理 `/emailManager/appPushChangmt`](#131-app推送渠道管理-emailmanager-apppushchangmt)
132. [工单列表 `/ticket/ticketList`](#132-工单列表-ticket-ticketlist)
133. [工单配置 `/ticket/ticketConfig`](#133-工单配置-ticket-ticketconfig)
134. [字段理解文档 `/fieldNotes/doc`](#134-字段理解文档)
135. [列表底部合计](#135-列表底部合计)
135. [列表底部合计](#135-列表底部合计)

---

## 1. 会员列表

状态：字段理解已确认。假数据已对接。

- 页面：会员管理 / 会员列表
- 路由：`/member/list`
- 页面标题键：`m17`（会员列表）
- 列表接口：`POST /ar-manager/memberInfoAdmin/listpage`
- 分组下拉：`POST /ar-manager/memberGroupAdmin/listpage`，用返回的 `id` / `name` 显示「会员分组」
- 代码：`apps/admin/src/views/member/list.vue`
- 假数据：`apps/admin/src/prototype/fixtures/memberList.ts`

页面把列表响应当数组读：`res.data` 是当前页，`res.total` 是总条数，`res.extend` 是底部合计。备注如果是字符串，会按 `|` 拆成标签。

### 1.1 当前展示列

理解依据是列标题的中文文案、字段名和同文件里的注释。备注列只记页面写法和原型做法，不表示含义未定。

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| id | 会员ID | 会员主键，列表上可点开详情，也可复制。 | 查询参数叫 `memberId`，详情同时传 `id` 和 `memberId`。假数据里这两个值相同。若线上不是同一个值，需要改。 |
| merchantName | 来源商户 | 会员注册或首次进入时所属的商户名称。空值显示 `-`。 | |
| bindMerchantInfoDTOS | 商户会员 | 该会员绑定的商户会员。每条显示 `商户编码-商户侧会员ID`，第一条直接露出，其余放在提示里。空数组显示 `-`。 | |
| memberAccount | 会员账号 | 会员登录账号。新增弹窗的占位是「请输入手机号码」，所以很多账号会是手机号，但列本身是账号，不强制等于手机号。 | |
| countOfMerchant | 激活商户数 | 已激活商户的数量。大于 0 时可点开「激活商户」弹窗。 | 原型按 `bindMerchantInfoDTOS` 的条数填写。 |
| arbBalance | 账户余额(ARB) | 账户余额，用来标记资金来源。项目内部买入的代币记为 ARB。资金属性会带动各类余额增减，具体变化见账变记录。 | |
| balance | 账户余额(CPB) | 账户余额，用来标记资金来源。商户提现到钱包项目后，记为 CPB。字段名是 `balance`。 | |
| usdtConvertArbAmount | 账户余额(USDT-ARB) | 已确认：USDT 折成 ARB 后的金额，不是原始 USDT 个数。 | |
| level | 用户等级 | `0` 到 `10`，显示为 L0 到 L10。 | |
| mobileNumber | 手机号码 | 会员手机号，可以和会员账号不同。 | |
| emailAccount | 邮箱 | 会员邮箱。空值显示 `-`。 | |
| memberGroup | 会员分组 | 分组 id，显示时用分组接口里的名称替换。 | |
| cashBackFrozenAmount | 退款金额 | 退款金额。退款场景很多，冻结金额只是其中一种。字段名是 `cashBackFrozenAmount`。做到退款业务时再补全逻辑和执行场景。 | |
| totalBalance | 可用余额 | 当前可以动用的余额。页面没有用三种账户余额相加，直接展示接口值。 | |
| owedAmount | 欠费金额 | 系统有多处自动化帮会员完成订单。订单被错误完成后会人工补单，从而形成卖家会员的欠费订单和欠费金额，并有自动扣费。做到欠费业务时再补全。 | |
| totalBuyCount | 买入次数 | 累计买入笔数。 | |
| totalBuyAmount | 买入金额 | 累计买入金额。 | |
| totalSellCount | 卖出次数 | 累计卖出笔数。 | |
| totalSellAmount | 卖出金额 | 累计卖出金额。 | |
| netBuySellAmount | 净买卖金额 | 有一套定制计算公式。主要剔除会员的充值和提现，体现会员在钱包内部纯粹的买入和卖出交易金额。公式细节尚未给出。 | 假数据仍用买入金额减卖出金额占位。 |
| totalBiFrozenAmount | 冻结余额 | 冻结着、不能直接使用的余额。`Bi` 按「币」理解。旧列曾把 ARB、CPB 的冻结余额拆开，现在合成这一列。 | |
| totalFrozenAmount | 交易中的金额 | 正在交易、暂时锁住的金额。和上面的冻结余额不是同一列。 | |
| memberType | 会员类型 | `1` 内部商户会员，`2` 外部商户会员，`3` 钱包会员，`4` 蚂蚁会员，`5` 快捷会员，`6` NPC会员。新增时只能选钱包会员和蚂蚁会员。 | 代码注释把 `1` 写成内部会员、把 `2` 写成商户会员，和现文案不一致。列表按现文案显示。 |
| realName | 实名 | 实名认证姓名。空值显示 `-`。 | |
| rechargeNum | 充值次数 | 累计充值笔数。 | |
| rechargeTotalAmount | 充值金额 | 累计充值金额。 | |
| withdrawNum | 提现次数 | 累计提现笔数。 | 底部合计把提现金额填进了这一列，这是页面写法，不是字段含义。 |
| withdrawTotalAmount | 提现金额 | 累计提现金额。 | |
| status | 账号状态 | `"0"` 禁用，`"1"` 启用。比较用的是字符串。 | |
| onlineStatus | 在线状态 | `"0"` 离线，`"1"` 在线。列还在，在线状态筛选项已注释。 | |
| createTime | 注册时间 | 注册时间，格式 `YYYY-MM-DD HH:mm:ss`，列表原样显示。 | |
| remark | 备注 | 后端用 `\|` 拼接多条备注，页面拆成标签。没有备注显示 `-`。 | |
| buyStatus | 买入状态 | `1` 允许买入，`0` 禁止买入，右侧开关。禁用时看 `buyDisableTime`：`-1` 是永久封禁，正数是剩余分钟，提示「多久后解禁」。 | 格式化函数的注释写「秒」，计算按分钟。假数据按分钟。 |
| sellStatus | 卖出状态 | `1` 允许卖出，`0` 禁止卖出。`sellDisableTime` 规则和买入相同。 | |

### 1.2 搜索项

这些搜索项当前还在页面上。注释掉的搜索项不列入。

| 参数 | 提示 | 对应字段 |
| --- | --- | --- |
| memberId | 请输入会员ID | `id` / `memberId` |
| merchantName | 请输入来源商户 | `merchantName` |
| externalMemberId | 请输入商户会员ID | 绑定记录里的 `merchantMemberId`。对应列已注释，搜索还在 |
| memberAccount | 请输入会员账号 | `memberAccount` |
| emailAccount | 请输入邮箱 | `emailAccount` |
| realName | 请输入会员实名信息 | `realName` |
| memberType | 请选择用户类型 | `memberType` |
| memberGroupId | 请选择用户分组 | `memberGroup` |
| status | 请选择账号状态 | `status` |
| buyStatus | 请选择买入状态 | `buyStatus` |
| sellStatus | 请选择卖出状态 | `sellStatus` |
| level | 请选择用户等级 | `level` |
| remark | 请输入备注 | `remark` |
| createTimeStart / createTimeEnd | 注册时间 | `createTime` |

### 1.3 当前不展示

这些列还在源码里，但已被注释，列表上没有。

| 字段 | 原标题 | 理解 |
| --- | --- | --- |
| externalMemberId | 商户会员ID | 商户侧会员 ID。现在改由「商户会员」列展示。 |
| invitationCode | 邀请码 | 邀请码。 |
| creditScore | 信用评分 | 信用分。搜索区间也已注释。 |
| transactionRestrictionsAmount | 限制交易金额 | 被限制、不能用于交易的金额。 |

### 1.4 原型交互：买入 / 卖出开关

页面原有弹框不变。禁用提交时要选禁用原因；从关闭点开启时，先弹出「未到自动解禁时间，是否要解除禁用？」。

原型在提交成功后改内存数据，再由列表刷新出来：

- 禁用买入或卖出：对应开关关闭，账号状态改为禁用。
- 确认启用买入或卖出：对应开关打开，账号状态改为启用。
- 账号状态跟着最近一次买入或卖出操作走。只启用其中一边时，另一边开关保持原样，账号状态仍改为启用。
- 刷新页面后回到初始假数据。

### 1.5 底部合计

「本页合计」读当前页，`总计` 读筛选后的全部。页面用的 extend 名和列字段不完全一样：CPB 余额读 `cpbBalance*`，可用余额读 `balance*`，冻结余额读 `biFrozenAmount*`，交易中金额读 `frozenAmount*`，充值金额读 `rechargeAmount*`。提现次数那一列的合计实际放的是提现金额 `withdrawAmount*`。

---

## 2. 会员详情 · 会员信息

状态：字段理解已确认。已按会员列表假数据对接，并补齐详情专有字段。收款信息见 [§4](#4-会员详情--收款信息)。

- 入口：会员列表点击会员 ID
- 组件：`apps/admin/src/components/Member/memberDetail.vue` → `components/info.vue`
- 详情主接口：`POST /ar-manager/api/v1/memberInfoAdmin/getInfo`，参数 `id`
- 假数据：`apps/admin/src/prototype/fixtures/memberDetail.ts`，会员本体仍在 `memberList.ts`

页面把 `res.data` 当成单个会员对象。商户会员展示拼成 `merchantName/externalMemberId`。

### 2.1 与列表共用的字段

这些字段直接复用会员列表假数据，含义以 [§1 会员列表](#1-会员列表) 为准。

| 字段 | 页面文案 | 说明 |
| --- | --- | --- |
| memberType | 会员类型 | 1–6，页面用 `memberTypeList` 翻译。 |
| merchantName | 来源商户 | |
| memberAccount | 会员账号 | |
| id | 会员ID | |
| realName | 实名 | |
| mobileNumber | 手机号码 | |
| status | 账号状态 | `"0"` 禁用，`"1"` 启用。 |
| countOfMerchant | 激活商户数 | |
| remark | 备注 | 按 `\|` 展示。编辑会改内存。 |
| level | 用户等级 | L0–L10。 |
| arbBalance / balance | 可用余额 ARB / CPB | |
| owedAmount | 欠费金额 | |
| totalBuyCount / totalBuyAmount | 买入次数 / 金额 | |
| totalSellCount / totalSellAmount | 卖出次数 / 金额 | |

### 2.2 详情专有字段

列表没有这些列。原型按会员 ID 生成稳定假值，存在同一份会员内存对象上。

| 字段 | 页面文案 | 当前处理 |
| --- | --- | --- |
| externalMemberId | 商户会员 | 取绑定列表第一条的商户侧会员 ID。 |
| registerTime | 注册时间 | 等于列表 `createTime`。 |
| registerIp | 注册 IP | 按会员 ID 生成。 |
| registerDevice | 注册设备 | iOS / Android / Windows Chrome。 |
| firstLoginTime | 首次登录时间 | 注册时间后 1 小时。 |
| firstLoginIp | 首次登录 IP | 按会员 ID 生成。 |
| merchantMemberIp | 商户会员 IP | 有绑定商户时生成，否则空。 |
| walletAddress | 钱包地址 | 钱包会员、蚂蚁会员才有。 |
| loginPwdUpdateTime / loginPwdUpdateName | 登录密码修改时间 / 操作人 | 初始按注册时间推算；重置登录密码后更新。 |
| payPwdCreateTime / payPwdUpdateTime | 支付密码创建 / 修改时间 | 初始按注册时间推算；重置支付密码后更新修改时间。 |
| arbFrozenAmount / frozenAmount | 交易中的金额 ARB / CPB | 由列表 `totalFrozenAmount` 按 ARB、CPB 可用余额比例拆开。 |
| arbBiFrozenAmount / biFrozenAmount | 冻结余额 ARB / CPB | 由列表 `totalBiFrozenAmount` 按比例拆开。冻结 / 解冻只动 CPB 这一侧。 |
| transactionRestrictionsAmount | 限制交易金额 | 限制观察分组给一个占位值，其余为 0。 |
| totalBuySuccessCount / totalBuyBonus | 买入成功次数 / 买入奖励 | 成功次数约等于买入次数的 85%；奖励按买入金额 0.2% 占位。 |
| totalSellSuccessCount / totalSellBonus | 卖出成功次数 / 卖出奖励 | 成功次数约 88%；奖励按卖出金额 0.2% 占位。 |
| appealCount | 申诉次数 | 按买卖总次数粗算，最多 3。 |

### 2.3 附属列表

| 接口 | 用途 | 原型 |
| --- | --- | --- |
| lastBuyRecord | 最近买入 | 最多 5 条，无买入则为空。状态直接显示中文。 |
| lastSellRecord | 最近卖出 | 同上。 |
| lastLogin | 最近登录 | 固定 3 条。 |
| memberLevelChangeList | 等级变化 | 按当前等级生成最多 5 次升级记录；L0 为空。 |

### 2.4 操作项

页面原有弹框未改。原型改内存，刷新页面后回到初始数据。`memberType == 6`（NPC）时不显示充值、提现、冻结、解冻。

| 操作 | 接口 | 原型行为 |
| --- | --- | --- |
| 重置登录密码 | resetpwd | 成功；页面写死展示 `aa123456`。更新登录密码修改时间和操作人。 |
| 重置支付密码 | resetPayPwd | 成功；页面写死展示 `1234`。更新支付密码修改时间。 |
| 编辑备注 | remark | 写入会员 `remark`，详情和列表都会看到。 |
| 充值 | recharge | ARB / CPB 加到可用余额，并累加充值次数和金额；同时追加账变流水。备注必填由页面校验。 |
| 提现 | withdrawal | 从可用余额扣减，不低于 0，并累加提现次数和金额；同时追加账变流水。 |
| 冻结 | freeze | 页面只传一个金额。从 CPB 可用挪到 CPB 冻结；同时追加账变流水。 |
| 解冻 | unfreeze | 从 CPB 冻结挪回 CPB 可用。`platformOrderNo` 只接收，不校验；同时追加账变流水。 |
| 买入/卖出奖励比例 | bonus | 页面入口已注释，接口仍接上，改比例字段。 |

### 2.5 还没做

- 激活商户弹窗
- 冻结同时动 ARB
- 最近买卖状态若线上是数字码，再改成和订单列表一致

---

## 3. 会员详情 · 账变记录

状态：按代码初读整理，字段理解已确认。

- 页面归属：**会员列表 → 点击会员 ID → 会员详情弹窗 →「账变记录」Tab**
- 不是独立菜单页「账变记录」`/member/changeReocde`（那一页列更多，含会员 ID、来源商户等；本小节不覆盖）
- Tab 标题键：`m35`（账变记录）
- 组件：`apps/admin/src/components/Member/components/changeReocde.vue`
- 父组件：`apps/admin/src/components/Member/memberDetail.vue`
- 列表接口：`POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`
- 请求会带上当前会员的 `id`（来自详情 props）
- 假数据：`apps/admin/src/prototype/fixtures/memberChangeRecord.ts`

页面把 `res.data` 当当前页数组，`res.total` 当总条数，`res.extend` 当底部合计。金额列在 `afterFetch` 里用 `thousand` 格式化展示。

### 3.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| merchantOrder | 商户订单号 | 商户侧订单号。空值显示 `-`，过长用 tooltip。 | |
| orderNo | 平台订单号 | 平台内部订单号。 | |
| changeType | 交易类型 | 账变业务类型，见下方枚举。页面用 `changeType` 映射翻译。 | |
| fundType | 资金属性 | `1` ARB，`2` CPB，`3` ARB/CPB。与会员信息里的资金来源标记一致：项目内买入记 ARB，商户提现进钱包记 CPB。空值显示 `-`。 | |
| payType | 收款类型 | `1` 印度银行卡，`2` 印度USDT，`3` 印度upi，`5` 银行卡/UPI。空或没有映射显示 `-`。 | |
| beforeChange | 账变前金额 | 本次变动前、对应资金属性下的余额。 | |
| amountChange | 账变金额 | 本次变动额。增加为正，扣减为负（展示层仍走金额格式化）。 | |
| afterChange | 账变后金额 | 本次变动后的余额。一般应满足 before + amount ≈ after。 | |
| createTime | 账变时间 | 发生时间，`YYYY-MM-DD HH:mm:ss`。 | |
| updateBy | 操作人 | 触发这笔账变的操作者。系统自动可为空或系统账号；人工上分/下分/冻结等会有后台账号。 | |
| remark | 备注 | 账变备注。空则直接显示空值。 | |

### 3.2 交易类型 changeType

来自 `apps/admin/src/utils/publicData.ts` 的 `changeType`。注释里的旧文案若与现翻译不一致，列表按现翻译显示。

| 值 | 文案 | 备注 |
| --- | --- | --- |
| 1 | 买入 | |
| 2 | 卖出 | |
| 3 | USDT买入 | |
| 4 | 人工上分 | 对应会员信息里的充值操作 |
| 5 | 冻结 | 对应会员信息里的冻结 |
| 6 | 解冻 | 对应会员信息里的解冻 |
| 7 | 人工下分 | 对应会员信息里的提现/扣减 |
| 8 | 买入奖励 | |
| 9 | 卖出奖励 | |
| 10 | 卖单金额退回 | 代码注释曾写「取消退回」 |
| 11 | 支付 | |
| 12 | 到账 | |
| 13 | 金额错误退回 | |
| 14 | 任务奖励 | |
| 17 | 余额退回 | |
| 18 | 买入返佣 | |
| 19 | 卖出返佣 | |
| 20 | USDT卖出 | |
| 21 | USDT买入失败退回 | |
| 22 | USDT买入奖励 | |
| 23 | 欠费下分 | 与会员列表欠费金额相关，做到欠费业务再细补 |
| 24 | 奖励卡卖出 | |
| 25 | 奖励卡退回 | |
| 26 | 奖励卡冻结 | |
| 27 | 奖励卡解冻 | |
| 28 | 欠费下分退回 | |
| 29 | 系统冻结 | |
| 30 | 额外奖励 | |
| 31 | 单笔买入固定奖励 | |
| 32 | 单笔卖出固定奖励 | |

### 3.3 搜索项

| 参数 | 提示 | 对应字段 |
| --- | --- | --- |
| merchantOrder | 请输入商户订单号 | `merchantOrder` |
| orderNo | 请输入平台订单号 | `orderNo` |
| changeType | 请选择类型 | `changeType` |
| fundType | 请选择资金属性 | `fundType`（1/2/3） |
| payType | 请选择收款类型 | `payType` |
| amountChangeStart / amountChangeEnd | 最低/最高交易金额搜索 | 按 `amountChange` 区间筛（按数值比） |
| remark | 请输入备注 | `remark` |
| createTimeStart / createTimeEnd | 账变时间 | `createTime` |

另有游标翻页参数：`direction`、`nextColValue`、`nextCursorId`、`prevColValue`、`prevCursorId`。原型按普通分页切页即可，仍回填游标字段以免页面报错。

### 3.4 底部合计

「本页合计」读当前页，`总计` 读筛选后的全部。

| extend | 落在列 |
| --- | --- |
| beforeChangePageTotal / beforeChangeTotal | 账变前金额 |
| amountChangePageTotal / amountChangeTotal | 账变金额 |
| afterChangePageTotal / afterChangeTotal | 账变后金额 |

### 3.5 和会员信息操作的关系

会员信息 Tab 的人工上分、人工下分、冻结、解冻成功后，原型会往该会员账变列表追加对应类型流水，并改余额。刷新浏览器后回到初始假数据。

### 3.6 还没做

- 独立菜单页见 [§10](#10-账变记录独立菜单)
- 退款、欠费下分等完整业务链路
- `fundType = 3` 与金额字段如何同时表示两种币
- 游标翻页与线上一致的严格行为

---

## 4. 会员详情 · 收款信息

状态：字段理解已确认。已接假数据展示，以及「添加 KYC / USDT 收款信息」内存新增（刷新消失）。银行卡 type=1 入口在页面里已注释，本小节不覆盖。

- 页面归属：**会员列表 → 点击会员 ID → 会员详情弹窗 →「收款信息」Tab**
- Tab 标题键：`m36`（收款信息）
- 组件：`apps/admin/src/components/Member/components/payInfo.vue`
- 假数据：`apps/admin/src/prototype/fixtures/memberPayInfo.ts`

页面先拉 KYC 列表，再拉该会员的 USDT；有 USDT 时把记录 `push` 进同一 `dataList`，并标 `type: 700`（前端自定义，不是后端枚举）。卡片按 `type` 分支渲染。

### 4.1 接口

| 用途 | 方法 / 路径 |
| --- | --- |
| KYC 收款列表 | `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`，参数含 `memberId`、`version: 2` |
| KYC 银行下拉 | `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList` → `data` 为银行 code 字符串数组 |
| 银行卡名映射（银行卡入口已注释，接口仍会请求） | `POST …/bankInfoAdmin/getBankCodeMap` |
| 添加 KYC | `POST /ar-manager/kycPartnersAdmin/addKycPartner`，字段 `bankCode`、`upiId`、`account`、`memberId` |
| 修改 KYC | `POST /ar-manager/kycPartnersAdmin/updateKycPartner`，字段 `collectionInfoId`、`bankCode`、`upiId`、`account`、`memberId` |
| 删除收款 | `POST /ar-manager/api/v1/collectionInfoAdmin/delete`，参数 `id` |
| 启用/禁用 | `POST /ar-manager/collectionInfoAdmin/updateStatus`，`status`：`4` 禁用、`5` 启用；禁用可带 `timeRangeType`、`remark` |
| 查 USDT | `GET /ar-manager/usdtReceiveInfo/getUsdtReceiveInfoByMemberId/{memberId}`，`data` 单条或空 |
| 添加 USDT | `POST /ar-manager/usdtReceiveInfo/createUsdtReceiveInfo`，`address`、`memberId` |
| 修改 USDT | `POST /ar-manager/usdtReceiveInfo/updateUsdtReceiveInfo/{id}`，body `{ address }` |
| 删除 USDT | `DELETE /ar-manager/usdtReceiveInfo/{id}` |

### 4.2 KYC 卡片字段（type = 3）

| 字段 | 页面文案 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| bankCode | 银行名称（`m581`） | KYC 银行编码，下拉来自 `getBankCodeList`。 | |
| upiId | UPI ID | 印度 UPI 标识。前端用 `upiIdReg`：`本地@域名`。 | |
| mobileNumber | 账号/手机（`m101`） | 添加收款方式时填的**银行账号手机号**，不必等于会员账号或会员手机号。新增表单字段名是 `account`，保存后列表读 `mobileNumber`。 | |
| collectedStatus | 状态 | `"1"` 启用，`"0"` 禁用。页面用松散比较。 | |
| antCollectionLimit | 蚂蚁收款限制相关标签（`n617`） | `1` 红点，`0` 绿点。 | |
| collectedAmount / collectedNumber | 已收金额/笔数（`m104`） | 展示为 `金额/笔数`。 | |
| kycId | （无独立列） | 有值才能点编辑；删除用 `id`。 | |
| id | （操作） | 收款信息主键，删改/启停用。 | |

### 4.3 USDT 卡片字段（type = 700）

| 字段 | 页面文案 | 当前理解 |
| --- | --- | --- |
| （固定） | 收款类型 | 页面写死显示 `USDT`。 |
| address | 收款地址（`m890`） | TRC20 地址。前端校验 `^T[a-zA-Z0-9]{33}$`（共 34 位）。 |
| id | （操作） | 更新、删除用。 |

一个会员原型里最多一条 USDT：查询接口返回单对象；再次「添加」若已有记录则覆盖地址（与页面可重复打开新增弹窗的行为对齐，避免列表出现多条 type=700）。

### 4.4 按钮与表单

| 按钮 | 文案键 | 行为 |
| --- | --- | --- |
| 添加 KYC 收款信息 | `m100` | 弹窗：银行、UPI ID、账号（可选）。校验银行与 UPI 格式后调 `addKycPartner`。成功后重新拉列表。 |
| 添加 USDT 收款信息 | `m888` | 弹窗：链类型展示 USDT-TRC20，填地址。校验 TRC20 后调 `createUsdtReceiveInfo`。 |
| 编辑 / 删除 / 启停 | `b8` / `b11` / enabled·disabled | 走对应接口，改内存。连接/操作日志见 [§5.6](#56-连接日志)、[§5.7](#57-操作日志)（与列表共用假数据）。 |
| 添加银行卡 | `m655` | 页面已注释，不做。 |

### 4.5 假数据规则

- 有绑定商户或买入次数 > 0 的会员：至少 1 条 KYC；买入次数 ≥ 10 再加第 2 条。
- 无绑定且零买入：初始无 KYC，方便演示「新增」。
- 钱包/蚂蚁会员（memberType 3/4）且 `usdtConvertArbAmount > 0`：初始 1 条 USDT。
- 新增 KYC / USDT、编辑、删除、启停只改当前页内存；刷新浏览器回到初始假数据。

### 4.6 还没做

- 银行卡收款（type=1）整套交互（页面已注释）

---

## 5. 会员收款列表

状态：字段理解已确认。假数据接在同一份 KYC 内存上（与 §4 共用）。

- 页面：会员管理 / 会员收款列表
- 路由：`/member/paymentV2`
- 页面标题键：`m18`（会员收款列表）
- 代码：`apps/admin/src/views/member/paymentV2.vue`
- 旧页 `/member/payment`（`payment.vue`，`version: 1`，列与操作更少）与本页同名同源用途；原型菜单已弃用，只保留 V2
- 列表接口：`POST /ar-manager/api/v1/collectionInfoAdmin/listPage`，固定 `version: 2`
- 假数据：`apps/admin/src/prototype/fixtures/memberPayInfo.ts`（与详情收款信息共用）

本页是跨会员的收款账号列表。详情「收款信息」Tab 调同一接口但会带 `memberId`。

### 5.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| id | 收款账号ID（`n1163`） | 收款信息主键。 | |
| memberId | 会员ID（`c9`） | 所属会员；可点开详情、可复制。 | |
| kycId | KYC ID | KYC 侧关联 ID。无值显示 `-`；无 kycId 时编辑不可点。 | |
| mobileNumber | 钱包手机号码（`n1162`） | 会员添加收款方式时选择银行后，填写的**该银行账号手机号**。**不一定等于会员账号**，也不必等于会员资料里的手机号。 | |
| upiId | UPI ID | `type == 3` 显示 `upiId`；否则显示 `bankCardNumber`。列标题写死 UPI ID。 | 银行卡 type=1 入口已在页面注释。 |
| collectedStatus | 状态 | `"1"` 启用（绿），其它当禁用（红）。 | |
| collectedAmount | 已收款金额（`m660`） | 该收款账号累计已收金额。 | |
| collectedNumber | 已收款笔数（`m661`） | 该收款账号累计已收笔数。 | |
| createTime | 添加时间（`l70`） | 收款账号创建时间。 | |
| updateTime | 最新操作时间（`n1160`） | 最近一次变更时间；空显示 `-`。 | |
| operatorType | 最新变更内容（`n1161`） | `0` 新增，`1` 修改，`3` 删除，`4` 禁用，`5` 启用。空显示 `-`。 | |
| updateBy | 最新操作人（`m814`） | 最近操作后台账号；空显示 `-`。 | |
| operation | 操作 | 查看、连接日志、操作日志、编辑、启用/禁用、删除。查看走 `getInfo`，弹窗组件 `getMemberPaymentInfo` → `memberPaymentCheck`。 | |

### 5.2 已注释、当前不展示

收款类型 `type`、会员账号、UPI Name、银行名/银行编码、IFSC、邮箱、创建人等。编辑弹窗仍按 `type` 分支：`3` 印度 UPI，`1` 印度银行卡。

### 5.3 搜索项

| 参数 | 提示 | 对应 |
| --- | --- | --- |
| collectionInfoId | 收款账号ID | `id` |
| memberId | 会员ID | `memberId` |
| mobileNumber | 钱包手机号码 | `mobileNumber` |
| collectedStatus | 状态 | `"1"` / `"0"` |
| kycId | KYC ID（更多） | `kycId` |
| upiId | UPI ID（更多） | `upiId` |
| startUpdateTime / endUpdateTime | 最新操作时间（更多） | `updateTime` |
| startCreateTime / endCreateTime | 添加时间（更多） | `createTime` |

### 5.4 假数据规则

- 与 §4 同一份 KYC 内存：有绑定或有买入的会员至少 1 条；买入 ≥ 10 再加第 2 条；空绑定零买入无初始行。
- `mobileNumber` / UPI 本地部分用独立银行账号手机号（`98…`），与会员 `91…` 手机号区分。
- 列表支持上述搜索与分页；详情 Tab 带 `memberId` 时只返回该会员。
- 编辑、启停会改 `operatorType` / `updateBy` / `updateTime`；刷新浏览器回到初始假数据。
- 连接日志 / 「行为」拉取流水 / 操作日志假数据见 [§5.6](#56-连接日志)、[§5.6.1](#561-行为kyc-拉取流水)、[§5.7](#57-操作日志)。

### 5.5 查看弹窗（收款详情）

- 按钮文案键：`b23`（查看）
- 接口：`POST /ar-manager/api/v1/collectionInfoAdmin/getInfo`，参数 `id`；页面取 `res.data[0]`
- 展示字段：收款类型、手机号码、UPI ID（type=3）或银行卡号（type=1）、已收款金额/笔数、添加时间、收款状态；type=1 另显银行名/编码/IFSC/邮箱

### 5.6 连接日志

- 按钮文案键：`n1152`；弹窗组件 `kycConnectLog.vue`；标题 `n730`
- 入参：当前行的 `bankCode`、`mobileNumber`（作 `phoneNumber`）
- 接口：`POST /ar-manager/kycLinkStatusLogAdmin/listPage`
- 假数据：`memberPaymentLogs.ts`，按 bankCode+phoneNumber 种子；**每个变更原因键各 1 条**（与 `kycLinkStatusChangeReasonMap` 同键，共 24 条）

| 字段 | 含义 |
| --- | --- |
| kycLinkStatusChangeType | 变更状态：`1` 连接，`2` 断开（断连类原因用 2） |
| kycLinkStatusChangeSource | 买卖行为：`1` 买方，`2` 卖方 |
| kycLinkStatusChangeReason | 变更原因（枚举见 `kycLinkStatusChangeReasonMap`） |
| operationTime | 操作时间 |
| restResults[] | 接口结果：httpCode / responseBody / remark / success |
| connectionUuid | 「行为」嵌套流水关联键 |

### 5.6.1 行为（KYC 拉取流水）

- 按钮文案键：`n784`；仅变更状态为「连接」时显示
- 组件：`kycPullResultLog.vue`；标题 `n757`
- 入参：`connectionUuid`
- 接口：`POST /ar-manager/kycPartnersAdmin/kycPullResultLogPage`
- 假数据：每条连接日志对应 2～3 条流水

| 字段 | 含义 |
| --- | --- |
| kycId / bankCode / phoneNumber / memberId | 关联 KYC 与会员 |
| changeType | `16` 内部卖方流水，`17` 内部买方流水，`18` 快捷买方流水 |
| operationTime | 操作时间 |
| restResults[] | 拉取结果：httpCode / responseBody / remark / success |

### 5.7 操作日志

- 按钮文案键：`n1149`；弹窗组件 `payInfoOperationLog.vue`
- 入参：当前行的 `upiId`
- 接口：`POST /ar-manager/collectionInfoAdmin/operationLog`
- 假数据：`memberPaymentLogs.ts`，按 upiId 种子约 4–5 条

| 字段 | 含义 |
| --- | --- |
| upiId | UPI ID |
| operationTime | 操作时间 |
| operationContent | `0` 新增，`1` 修改，`3` 删除，`4` 禁用，`5` 启用 |
| createdBy | 操作人 |
| remark | 备注 |
| disableTimes | 禁用时限；仅禁用行有意义：`0` 永久，正数为分钟 |

### 5.8 还没做

- 导出真实文件内容

---

## 6. 分组管理

状态：按代码初读整理，字段理解已确认；已接列表假数据与新增/编辑/删除。

- 页面：会员管理 / 分组管理
- 路由：`/member/group`
- 标题键：`m16`
- 代码：`apps/admin/src/views/member/group.vue`
- 列表：`POST /ar-manager/memberGroupAdmin/listpage`
- 权限项：`POST /ar-manager/memberGroupAdmin/authList`
- 新增/编辑/删除：`create` / `update` / `api/v1/memberGroupAdmin/delete`
- 假数据：`memberList.ts` 中 `memberGroups`（与会员列表分组下拉共用）

### 6.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| id | 分组ID（`c1`） | 分组主键。 | |
| name | 分组名称（`c2`） | 分组显示名；会员列表「会员分组」用同名字段。 | |
| buyAmount | 买入金额阈值（`c3`） | 进入该组的买入金额门槛（表单可填）。 | |
| buyCount | 买入次数阈值（`c4`） | 买入笔数门槛。 | |
| sellAmount | 卖出金额阈值（`c5`） | 卖出金额门槛。 | |
| sellCount | 卖出次数阈值（`c6`） | 卖出笔数门槛。 | |
| memberCount | 会员数（`c7`） | 当前归属该组的会员数量（原型按会员假数据实时计数）。 | |
| operation | 操作 | 每个分组都可编辑、删除。 | |

### 6.2 表单额外字段

| 字段 | 标题 | 理解 |
| --- | --- | --- |
| authList | 权限（`c8`） | 多选，选项来自 `authList` 接口的 `code`/`name`；存库为逗号拼接字符串，编辑时再 `split`。 |

### 6.3 按钮

- 新增 / 编辑：弹窗改内存；刷新回初始。
- 删除：二次确认后从内存去掉；刷新回初始分组。

---

## 7. 实名认证

状态：按代码初读整理，字段理解已确认；已按认证状态枚举造数。

- 页面：会员管理 / 实名认证
- 路由：`/member/name`
- 标题键：`c17`
- 代码：`apps/admin/src/views/member/name.vue`
- 列表：`POST /ar-manager/api/v1/memberInfoAdmin/realName`
- 编辑保存：`POST /ar-manager/api/v1/memberInfoAdmin/update`
- 清除实名：`POST /ar-manager/memberInfoAdmin/clearRealNameAuth`
- 假数据：`fixtures/memberRealName.ts`

### 7.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| id | 会员ID（`c9`） | 列表主键即会员 ID，可点开会员详情。行上另有 `memberId`（解除接口用）。 | |
| authenticationStatus | 认证状态（`c12`） | 与 `certificateStatus` / i18n 一致：`1` 已认证（`c18`），`2` 未认证（`c19`），`3` 手动认证（`c100`）。 | |
| realName | 真实姓名（`c13`） | 证件姓名。**未认证必须为空。** | |
| idCardNumber | 证件号（`c14`） | 身份证件号码。**未认证必须为空。** | |
| realNameVerificationTime | 认证时间（`c15`） | 已认证/手动认证有值；未认证为空。 | |
| verificationBy | 审核人（`c16`） | 已认证/手动认证有值；未认证为空。 | |
| operation | 操作 | 查看、编辑、解除。 | |

### 7.2 按钮与嵌套

- 查看：弹窗展示姓名、证件号、认证时间、证件照、人脸照。不做单独字段小节。
- 编辑：仅 `authenticationStatus == '2'`（未认证）可点；表单置空；状态选项仅「手动认证」`3` 可选；证件照/人脸照用 `NewUpload`，原型模式读本地 DataURL（不连 OSS）；提交后该行变为手动认证并显示刚填的数据；刷新浏览器恢复为未认证空资料。
- 解除（`n1189`）：确认后本会话从列表**隐藏**该行；刷新浏览器恢复。
- 点会员 ID：打开已有会员详情（沿用既有假数据）。

### 7.3 假数据规则

- 状态 `1/2/3` 各至少 1 条。
- `1` 已认证、`3` 手动认证：有姓名、证件号、双图、时间、审核人。
- `2` 未认证：姓名/证件号/图/时间/审核人均空。
- 刷新浏览器回到初始假数据（含被解除隐藏的行）。

---

## 8. 返佣记录

状态：按代码初读整理，字段理解已确认；已按返佣类型枚举造数。

- 页面：会员管理 / 返佣记录
- 路由：`/member/agentLevReo`
- 标题键：`m861`
- 代码：`apps/admin/src/views/member/agentLevReo.vue`
- 列表：`POST /ar-manager/commissionRecordAdmin/getList`（`res.data.list` / `res.data.total` / `res.data.extend`）
- 假数据：`fixtures/memberCommission.ts`

### 8.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| targetUserId | 会员ID（`c9`） | 获得返佣的会员；可点开详情。 | |
| platformOrderNo | 平台订单号（`l90`） | 触发返佣的平台订单。 | |
| sourceUserId | 来源会员（`m874`） | 产生交易、带来返佣的下级/来源会员。 | |
| commissionAmount | 返佣金额（`m875`） | 本笔返佣金额。 | |
| commissionType | 交易类型（`m866`） | `1`～`4` 对应 `m862`～`m865`（页面 `agentMoneyMap`）。 | 搜索里的 `tradeType` 是另一套：`1` 买入返佣、`2` 卖出返佣。 |
| commissionTime | 返佣时间（`m873`） | 入账时间。 | |

### 8.2 搜索项（含未展示但参与筛选的字段）

| 参数 | 含义 |
| --- | --- |
| targetUserId | 获佣会员 |
| platformOrderNo | 平台订单号 |
| agentLevel | `1` 一级（`m867`）/ `2` 二级（`m868`） |
| tradeType | `1` 买入返佣（`m857`）/ `2` 卖出返佣（`m858`） |
| commissionTimeStart / End | 返佣时间 |

### 8.3 底部合计

`extend.pageCommission` 本页返佣合计；`extend.totalCommission` 筛选结果总计。

### 8.4 假数据规则

- `commissionType` 1～4 各至少 1 条；`agentLevel` 1/2、`tradeType` 1/2 在种子中覆盖。
- 点会员 ID 打开会员详情（既有假数据）。无行内其它操作按钮。

---

## 9. 会员USDT收款列表

状态：按代码初读整理，字段理解已确认；已接列表与查看/编辑。

- 页面：会员管理 / 会员USDT收款列表
- 路由：`/member/usdtPayment`
- 标题键：`m887`
- 代码：`apps/admin/src/views/member/usdtPayment.vue`
- 列表：`POST /ar-manager/usdtReceiveInfo/listUsdtReceiveInfo`（`res.data.list` / `res.data.total`）
- 编辑：`POST /ar-manager/usdtReceiveInfo/updateUsdtReceiveInfo/{id}`
- 假数据：`fixtures/memberPayInfo.ts`（与详情 USDT 共用扩展字段）

### 9.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| id | ID | USDT 收款信息主键。 | |
| memberId | 会员ID（`c9`） | 所属会员；可点开详情。 | |
| address | USDT地址（`userUSDTaddress`） | TRC20 地址；页面编辑校验 `^T[a-zA-Z0-9]{33}$`。 | |
| deleted | 状态（`m832`） | `1` 已删除（`m893`），`0` 正常（`m894`）。 | |
| createBy | 操作人（`l48`） | 展示 `updateBy \|\| createBy`。 | |
| createTime | 操作时间（`l67`） | 展示 `updateTime \|\| createTime`。 | |
| operation | 操作 | 查看、编辑。 | |

### 9.2 按钮

- 查看：只读弹窗看地址（币种写死 USDT-TRC20）。
- 编辑：可改地址并提交；校验 TRC20。
- 点会员 ID：会员详情（既有假数据）。

### 9.3 假数据规则

- `deleted` 0/1 各至少 1 条；地址满足 34 位 TRC20。
- 与详情「收款信息」USDT 共用内存；刷新回初始。

---

## 10. 账变记录（独立菜单）

状态：按代码初读整理，字段理解已确认；已按 `changeType` 全枚举造数。与详情 Tab（§3）同接口，本页列更多且默认筛当日。

- 页面：会员管理 / 账变记录
- 路由：`/member/changeReocde`
- 标题键：`m35`
- 代码：`apps/admin/src/views/member/changeReocde.vue`
- 列表：`POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`
- 导出：`memberAccounthangeAdminExport`（原型返回成功/blob）
- 假数据：`fixtures/memberChangeRecord.ts`（无 `memberId`/`id` 时走全表种子）

### 10.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| mid | 会员ID（`c9`） | 会员主键，可点开详情。 | 与 `memberId`（外部/商户侧会员标识）差异。 |
| memberId | 商户会员ID（`m207`） | 商户侧会员标识。 | |
| memberAccount | 会员账号（`c10`） | 登录账号/手机号类。 | |
| merchantName | 来源商户（`m677`） | 会员所属/来源商户名。 | |
| tradeMerchantName | 交易商户（`m680`） | 本笔交易对手商户；表头有说明 tooltip。 | |
| orderNo | 平台订单号（`n47`） | 平台单号；部分类型可跳撮合页。 | |
| merchantOrder | 商户订单号（`l96`） | 商户侧单号。 | |
| changeType | 交易类型（`m67`） | 同 §3.2 全套枚举。 | |
| fundType | 资金属性（`n589`） | `1` ARB / `2` CPB / `3` ARB/CPB。 | |
| payType | 收款类型（`m656`） | `1/2/3/5`，空显示 `-`。 | |
| strideMerchant | 是否跨商户（`m681`） | `1` 是 / `0` 否。 | |
| beforeChange / amountChange / afterChange | 账变前/账变金额/账变后 | 同 §3。 | |
| createTime | 账变时间（`m70`） | 默认搜索范围为当天。 | |
| updateBy | 操作人（`l48`） | | |
| remark | 备注 | | |

### 10.2 按钮

- 搜索 / 重置 / 导出：导出原型仅成功提示或空文件。
- 点会员 ID：会员详情。
- 特定 `changeType`+`MC` 单号可跳转撮合页（该页假数据本阶段不补）。

### 10.3 假数据规则

- `changeType` 每个启用枚举键各 1 条（与 `publicData.changeType` 一致）。
- `fundType` 1/2/3、`strideMerchant` 0/1、`payType` 主要取值在种子中穿插覆盖。
- 种子时间落在「当天」，以适配页面默认时间筛选。
- 详情 Tab 仍按会员 `id` 过滤，逻辑不变。

---

## 11. 会员短信日志

状态：按代码初读整理，字段理解已确认；已按验证码类型和登录客户端造数。

- 页面：会员管理 / 会员短信日志
- 路由：`/member/smslog`
- 标题键：`m178`
- 代码：`apps/admin/src/views/member/smslog.vue`
- 列表：`POST /ar-manager/userVerificationCodes/listPage`（`res.data` 为数组，`res.total` 为总条数）
- 假数据：`fixtures/memberAuditLogs.ts`
- 本页没有行内按钮。搜索、重置会按条件重查。

### 11.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| codeType | 验证码类型（`m197`） | `SMS` 短信（`m196`），`EMAIL` 邮箱（`l63`）。 | 页面叫短信日志，但类型含邮箱验证码。 |
| receiver | 发送账号（`m198`） | 验证码发到的手机号或邮箱。不必等于会员账号。 | |
| verificationCode | 发送验证码（`m199`） | 本次发出的验证码。 | |
| sendTime | 发送时间（`m195`） | 发送时间。页面默认筛当天。 | |
| expirationTime | 过期时间（`m200`） | 验证码失效时间。原型按发送后 10 分钟。 | |
| ipAddress | 发送IP地址（`m201`） | 请求发送时的 IP。 | |
| device | 操作设备（`m193`） | 发起发送的设备。 | |
| loginClient | 登录客户端（`n2068`） | 页面选项只有 `APP`、`H5`。下拉的值就是这两个文案，不是 1/3。 | 注释掉的 key `1`/`3` 未参与展示。 |

### 11.2 搜索项

| 参数 | 含义 |
| --- | --- |
| type | 验证码类型，对应 `codeType` |
| receiver | 发送账号，模糊匹配 |
| loginClient | `APP` / `H5` |
| startTime / endTime | 发送时间，默认当天 |

用户 ID 搜索已注释，不造单独字段。

### 11.3 假数据规则

- `SMS`+`APP`、`SMS`+`H5`、`EMAIL`+`APP`、`EMAIL`+`H5` 各 1 条。
- 接收账号取会员列表里的手机号或邮箱。
- 发送时间落在印度时区当天，刷新后仍是这 4 条。

---

## 12. 会员操作日志

状态：按代码初读整理，字段理解已确认；`moduleCode` 1～41 各 1 条。

- 页面：会员管理 / 会员操作日志
- 路由：`/member/operationlog`
- 标题键：`m179`
- 代码：`apps/admin/src/views/member/operationlog.vue`
- 列表：`POST /ar-manager/memberOperationLogs/listPage`（`res.data` 为数组）
- 假数据：`fixtures/memberAuditLogs.ts`
- 本页没有行内按钮。搜索、重置会按条件重查。会员 ID 不可点。

### 12.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| memberId | 用户ID（`m184`） | 做这次操作的会员主键。搜索参数叫 `userId`。 | |
| username | 会员账号（`c10`） | 会员登录账号。 | |
| moduleCode | 操作模块（`l46`） | 1～41，文案用页面 `typeMap`（`t33`～`t63`、`m981`～`m988` 等）。见下方枚举。 | 源码注释把 `5` 写成「买入下单」，实际键 `t37` 是「取消买入订单」。列表按 i18n 显示。 |
| operationPath | 操作路径（`l49`） | 这次操作打到的接口路径。 | |
| ipAddress | 操作IP地址（`m192`） | 操作来源 IP。搜索参数叫 `loginIp`。 | |
| response | 响应结果（`m804`） | 接口返回摘要。原型用一段 JSON 文本。 | |
| operationTime | 操作时间（`l67`） | 操作发生时间。默认筛当天。 | |
| device | 操作设备（`m193`） | 设备描述。 | |

模板里有 `loginStatus` 的成功/失败分支，当前列定义没有这一列，列表不展示。

### 12.2 操作模块枚举

| 值 | 文案 | 值 | 文案 |
| --- | --- | --- | --- |
| 1 | 买入下单接口 | 22 | 确认到账 |
| 2 | USDT买入下单接口 | 23 | 取消卖出订单 |
| 3 | USDT完成转账 | 24 | 继续匹配 |
| 4 | 完成支付 | 25 | 提交金额错误 |
| 5 | 取消买入订单 | 26 | 取消申请金额错误 |
| 6 | 取消支付 | 27 | 提交卖出申诉 |
| 7 | 提交买入订单申诉 | 28 | 手机号码注册 |
| 8 | 实名认证 | 29 | 邮箱账号注册 |
| 9 | 校验短信验证码 | 30 | 忘记密码 |
| 10 | 更换手机号码 | 31 | 发送短信验证码 |
| 11 | 更换邮箱号 | 32 | 发送邮箱验证码 |
| 12 | 添加KYC收款信息 | 33 | 设置默认收款信息 |
| 13 | 开启收款 | 34 | 领取活动任务奖励 |
| 14 | 停止收款 | 35 | 完成新手引导 |
| 15 | 删除收款信息 | 36 | 快捷买入 |
| 16 | 设置头像 | 37 | 取消匹配 |
| 17 | 设置昵称 | 38 | 确认放单 |
| 18 | 设置新支付密码 | 39 | 卖出前检测 |
| 19 | 修改支付密码 | 40 | USDT卖出下单接口 |
| 20 | 忘记支付密码 | 41 | 新增USDT收款信息 |
| 21 | 卖出下单接口 | | |

### 12.3 搜索项

| 参数 | 含义 |
| --- | --- |
| userId | 用户 ID，对应 `memberId` |
| opModule | 操作模块，对应 `moduleCode` |
| loginIp | 操作 IP，模糊匹配 |
| startTime / endTime | 操作时间，默认当天 |

### 12.4 假数据规则

- `moduleCode` 1～41 各 1 条，会员轮用现有 16 个会员。
- 操作时间落在印度时区当天。约每 7 条有 1 条失败响应。
- 刷新浏览器仍是这 41 条。

---

## 13. 会员登录日志

状态：按代码初读整理，字段理解已确认；已覆盖本页会员类型、登录模式、登录状态。

- 页面：会员管理 / 会员登录日志
- 路由：`/member/loginlog`
- 标题键：`m180`
- 代码：`apps/admin/src/views/member/loginlog.vue`
- 列表：`POST /ar-manager/api/v1/memberLoginLogs/listPage`（`res.data` 为数组）
- 假数据：`fixtures/memberAuditLogs.ts`
- 本页没有行内按钮。搜索、重置会按条件重查。会员 ID 不可点。

### 13.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| memberId | 用户ID（`m184`） | 登录会员主键。搜索参数叫 `userId`。 | |
| username | 会员账号（`c10`） | 登录账号。搜索参数叫 `memberAccount`。 | |
| memberType | 会员类型（`memberListC10`） | 本页只翻译 4 种：`1` 内部商户会员（`t65`）、`2` 商户会员（`n95`）、`3` 钱包会员（`n96`）、`4` 蚂蚁会员（`m842`）。 | 会员列表还有 `5` 快捷、`6` NPC。本页 map 没有这两项。 |
| authenticationMode | 登录模式（`m185`） | `1` 前台模式（`t38`），`2` 商户模式（`t44`）。搜索参数叫 `type`。 | |
| loginStatus | 登录状态（`m186`） | `"1"` 登录成功（`s25`），其它值登录失败（`f1`）。比较用字符串。 | |
| ipAddress | 登录IP地址（`m187`） | 登录 IP。搜索参数叫 `loginIp`。 | |
| loginTime | 登录时间（`m188`） | 登录时间。默认筛当天。 | |
| device | 登录设备（`m189`） | 设备描述。列标题键是 `m189`，和短信页的「操作设备」`m193` 不是同一个键。 | |

### 13.2 搜索项

| 参数 | 含义 |
| --- | --- |
| userId | 用户 ID |
| type | 登录模式 `1` / `2` |
| memberAccount | 会员账号，模糊匹配 `username` |
| loginIp | 登录 IP |
| startTime / endTime | 登录时间，默认当天 |

### 13.3 假数据规则

- 会员类型 1～4 各有成功、失败各 1 条，共 8 条。登录模式 1/2 都有。
- 会员取列表里对应 `memberType` 的现有会员，账号用其 `memberAccount`。
- 登录时间落在印度时区当天。

---

## 14. 手动操作记录

状态：按代码初读整理，字段理解已确认；已按操作类型造数。点会员 ID 打开已有会员详情。

- 页面：会员管理 / 手动操作记录
- 路由：`/member/manuallog`
- 标题键：`m227`
- 代码：`apps/admin/src/views/member/manuallog.vue`
- 列表：`POST /ar-manager/api/v1/memberManualLog/listPage`（`res.data` 为数组）
- 假数据：`fixtures/memberAuditLogs.ts`

### 14.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| memberId | 会员ID（`c9`） | 被操作的会员。可点开会员详情，也可复制。详情沿用该会员已有假数据。 | |
| opType | 操作类型（`m241`） | `1` 上分（`m250`）、`2` 下分（`m251`）、`3` 冻结（`m79`）、`4` 解冻（`e3`）。 | 和下拉里的同名选项一致。页面初始查询字段写成了 `optype`，下拉实际绑定 `opType`，筛选按 `opType`。 |
| amount | 操作金额（`m242`） | 本次人工操作的金额。列可排序，原型按金额重排当前筛选结果。 | 页面只做金额格式化，假数据用正数。 |
| createBy | 操作人（`l48`） | 后台操作人账号。 | |
| updateTime | 操作时间（`l67`） | 操作完成时间。默认筛当天。列绑定的是 `updateTime`。 | |
| remark | 备注 | 操作说明。 | |

### 14.2 搜索项与按钮

| 参数 | 含义 |
| --- | --- |
| opType | 操作类型 1～4 |
| createBy | 操作人，模糊匹配 |
| startTime / endTime | 操作时间，对应 `updateTime`，默认当天 |

- 搜索 / 重置：重查列表。
- 点会员 ID：打开会员详情（已有假数据，本页不另写字段说明）。
- 复制：页面本地复制，无接口。

### 14.3 假数据规则

- `opType` 1～4 各 2 条，共 8 条。操作人覆盖 `prototype`、`admin_li`。
- 会员 ID 用现有会员，点进去能看到该会员详情。
- 操作时间落在印度时区当天。刷新后回到这 8 条。本页没有新增或审核按钮。

---

## 15. 会员解绑记录

状态：按代码初读整理，字段理解已确认；已按操作来源造数。点会员 ID 打开已有会员详情。

- 页面：会员管理 / 会员解绑记录
- 路由：`/member/unbindLog`
- 标题键：`n220`
- 代码：`apps/admin/src/views/member/unbindLog.vue`
- 列表：`POST /ar-manager/unBindingMerchantRecordAdmin/listPage`（`res.data` 为数组）
- 假数据：`fixtures/memberAuditLogs.ts`

### 15.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| memberId | 会员ID（`c9`） | 被解绑的会员。可点开会员详情，也可复制。 | |
| merchantCode | 商户号（`n9`） | 解绑的商户编码。可复制。 | |
| merchantMemberId | 商户会员ID（`m207`） | 该商户侧的会员 ID。可复制。 | |
| operateIp | 操作IP（`m911`） | 解绑操作来源 IP。 | |
| operateBy | 操作人（`l48`） | 谁执行了解绑。用户操作记会员账号，系统操作记 `system`。 | |
| unbindFlag | 操作来源（`n1859`） | `1` 用户操作（`n1860`），`0` 系统操作（`n1861`）。页面把非 `1` 都显示成系统操作。 | |
| bindTime | 绑定时间（`n216`） | 这次关系当初绑定的时间。 | |
| updateTime | 操作时间（`l67`） | 解绑发生时间。搜索参数是 `createTimeStart` / `createTimeEnd`，列展示的是 `updateTime`。 | |
| remark | 备注 | 解绑说明。 | |

### 15.2 搜索项与按钮

| 参数 | 含义 |
| --- | --- |
| memberId | 会员 ID，模糊匹配 |
| merchantCode | 商户号，模糊匹配 |
| unbindFlag | `1` 用户操作 / `0` 系统操作 |
| bindTimeStart / bindTimeEnd | 绑定时间 |
| createTimeStart / createTimeEnd | 操作时间，对应列 `updateTime`，默认当天 |

- 搜索 / 重置：重查列表。
- 点会员 ID：打开会员详情（已有假数据）。
- 复制：页面本地复制。

### 15.3 假数据规则

- 从会员列表已有绑定里取 6 条。`unbindFlag` 1 和 0 交替，各 3 条。
- 商户号、商户会员 ID 与该会员绑定记录一致。
- 操作时间在印度时区当天；绑定时间在数天前。默认打开能看到这 6 条。刷新后不变。

---

## 16. 蚂蚁层级列表

状态：按代码初读整理，字段理解已确认；已按用户分组和转化方式造数。

- 页面：会员管理 / 蚂蚁层级列表
- 路由：`/member/agentLevel`
- 标题键：`n544`
- 代码：`apps/admin/src/views/member/agentLevel.vue`
- 列表：`POST /ar-manager/antMemberInfoAdmin/getAntMemberInfoList`（`res.data.list` / `res.data.total`）
- 设置分组：`POST /ar-manager/antMemberInfoAdmin/setAntGroup`
- 展开：`POST /ar-manager/antMemberInfoAdmin/levelRelationShip`（`res.data.list`）
- 假数据：`fixtures/memberAntLevel.ts`

### 16.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| memberId | 会员ID（`c9`） | 蚂蚁会员主键。可点开会员详情，也可复制。 | |
| lastLoginTime | 最后登录时间（`m432`） | 最近一次登录时间。空显示 `-`。 | |
| notLoginDays | 未登录天数（`n1592`） | 距最后登录的天数。文案是「n 天未登录」。大于 10 天红色，等于 10 天深橙，7～9 天橙色，3～6 天浅色。可排序。搜索分档见 16.2。 | |
| invitationCode | 邀请码（`m630`） | 该会员的邀请码。可复制。空显示 `-`。 | |
| memberAccount | 注册手机号（`m878`） | 注册账号，原型用会员列表的 `memberAccount`。 | |
| antLevelGroup | 用户分组（`n513`） | `0` 未分组、`1` 潜在蚂蚁、`2` 低度活跃、`3` 中度活跃、`4` 高度活跃。 | |
| antUpperLevelId | 上级ID（`m879`） | 直接上级会员 ID。空显示 `-`。可点开该会员详情。 | |
| agentLevel | 层级（`m880`） | 显示为 `L` 加数字。根是 L0，下一层 L1。 | |
| directSubordinateCount | 直属下级（`m881`） | 直接下级人数。可排序。 | |
| allSubordinateCount | 全部下级（`m882`） | 所有下级人数，含下级的下级。 | |
| totalCommissionAmount | 返佣金额（`m875`） | 累计返佣。大于 0 时可点开该会员的返佣记录。0 时按钮不可点。可排序。 | |
| createTime | 注册时间（`m883`） | 会员注册时间，取会员列表里的注册时间。 | |
| antConversionTime | 转化蚂蚁时间（`n538`） | 变成蚂蚁会员的时间。页面默认按这一列筛当天。 | |
| antConversionType | 转化方式（`n539`） | `1` 系统转化、`2` 用户申请、`3` 后台创建、`4` 会员邀请（`n703`）。源码注释写「蚂蚁邀请」，文案键是「会员邀请」。 | `0` 未转化已在代码里注释，列表不做。 |
| operation | 操作 | 「展开」「分组」。 | |

### 16.2 搜索项

| 参数 | 含义 |
| --- | --- |
| memberId | 会员 ID，模糊匹配 |
| notLoginDays | `3` 3～6 天、`7` 7～9 天、`10` 正好 10 天、`-1` 超过 10 天 |
| invitationCode | 邀请码，模糊匹配 |
| antLevelGroup | 用户分组 `0`～`4` |
| agentLevel | 层级数字，精确匹配 |
| conversionType | 转化方式，对应 `antConversionType` |
| startTime / endTime | 转化蚂蚁时间，默认当天 |

未登录天数按上面四档筛选。页面本身没有比较代码，分档写在假数据里。

### 16.3 按钮

- 搜索 / 重置：重查列表。
- 导出：原型返回成功或空文件，不生成真实表格。
- 点会员 ID、上级 ID：打开已有会员详情。
- 点返佣金额：打开该会员的返佣记录（已有假数据，金额大于 0 才能点）。
- 展开：弹出上下级表，含本人、直接上级、直接下级。不另写字段说明。
- 分组：弹窗改用户分组。选项不含「未分组」。保存后列表分组会变，刷新浏览器恢复。

### 16.4 假数据规则

- 5 条，用户分组 `0`～`4` 各 1 条。转化方式 `1`～`4` 都有。未登录覆盖 0 天、4 天、8 天、10 天、16 天。
- 层级关系：`10086002` 为 L0 根；其下 `10086001`（L1，再下 `10086005`）和 `10086003`（L1，再下 `10086004`）。直属人数、全部下级按这棵树计算。
- 会员 ID 都是会员列表里已有的会员，返佣金额对得上返佣记录里该会员的金额，所以点进去看得到记录。
- 转化时间在印度时区当天。刷新后回到这 5 条和初始分组。

---

## 17. APP银行

状态：菜单已弃用。它和 KYC 管理里的 KYC 银行列表共用 `kycBankAdmin/listPage`，列更少。侧栏只保留 [§20](#20-app银行原假app银行)。页面源码还在，直接打开路由仍能看到。

- 页面：APP管理 / APP银行（已从原型菜单移除）
- 路由：`/appConfig/appBank`
- 标题键：`n1522`
- 代码：`apps/admin/src/views/appConfig/appBank.vue`
- 本页两个页签：银行列表 `components/appBankList.vue`，开关日志 `components/appBankOnOffLog.vue`
- 列表：`POST /ar-manager/api/v1/kycBankAdmin/listPage`（`res.data` 为数组，总条数读 `res.data.total`）
- 银行编码下拉：`POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`
- 假数据：`fixtures/appUpiBanks.ts`、`fixtures/appConfig.ts`

这页和 KYC 银行列表共用上面的列表接口。原型按本页的 10 个 UPI 应用返回。

### 17.1 十个 UPI 应用

后续 APP 管理里的银行编码都用这一份。编码大写，名称是应用名。

| bankCode | 名称 | UPI 后缀 | 安卓包名 |
| --- | --- | --- | --- |
| PHONEPE | PhonePe | @ybl | com.phonepe.app |
| PAYTM | Paytm | @paytm | net.one97.paytm |
| FREECHARGE | Freecharge | @freecharge | com.freecharge.android |
| MONEYVIEW | Moneyview | @moneyview | com.whizdm.moneyview |
| GOOGLEPAY | Google Pay | @okaxis | com.google.android.apps.nbu.paisa.user |
| BHIM | BHIM | @upi | in.org.npci.upiapp |
| MOBIKWIK | MobiKwik | @ikwik | com.mobikwik_new |
| CRED | CRED | @axisb | com.dreamplug.androidapp |
| BHARATPE | BharatPe | @bharatpe | com.bharatpe.app |
| AMAZONPAY | Amazon Pay | @apl | in.amazon.mShop.android.shopping |

会员收款下拉仍保留原来的 SBI、HDFC 等，并在后面加上这 10 个编码。

### 17.2 银行列表列

开关都是 `1` 是、`0` 否。卖出状态文案是开启 / 关闭（`l53` / `l54`）。

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| sort | 排序 | 列表顺序，默认按这一列升序。 | |
| bankCode | 银行编码（`m582`） | UPI 应用编码，取 17.1。 | |
| iconUrl | 银行图标（`m583`） | 应用图标。原型用色块缩写。 | 银行名称列已注释，编辑弹窗里仍有 `bankName`。 |
| sellStatus | 卖出状态（`memberListC16`） | `1` 开启，`0` 关闭。开关类型 `1`。 | |
| supportsBuyAppeal | 内部买入申诉（`n1389`） | 是否支持内部买入申诉。开关类型 `3`。 | |
| supportsQuickWithdraw | 买入UPI（`n1390`） | 是否支持买入 UPI。开关类型 `4`。 | |
| supportsQuickWithdrawBank | 买入银行卡（`n1391`） | 是否支持买入银行卡。开关类型 `5`。 | |
| supportPhonepeWakeUp | Phonepe唤醒（`n1392`） | 是否支持 PhonePe 唤醒。开关类型 `6`。 | |
| supportsExternalAppeal | 外部买入申诉（`n1393`） | 开关类型 `7`。 | |
| supportsExternalSell | 外部卖出（`n1394`） | 开关类型 `8`。 | |
| supportLotteryTicket | 彩票工单（`n1468`） | 开关类型 `9`。 | 和自动交易共用类型 `9`。改其中一个，另一个会一起变。 |
| supportsAutoTrade | 自动交易（`n1500`） | 开关类型也是 `9`。 | |
| allowMultiLogin | 登录类型（`n1384`） | `1` 多点（`n1385`），`0` 单点（`n1386`）。只展示，没有开关。 | |
| updateBy | 操作人（`l48`） | | |
| updateTime | 更新时间 | 空则显示创建时间。 | |
| action | 操作 | 编辑、删除。每个开关旁可看该类型日志。 | |

`sourceType` 列已注释：`0` / `1` app / `2` H5。新增表单里还有。

### 17.3 开关日志页签

| 字段 | 列标题 | 当前理解 |
| --- | --- | --- |
| bankCode | 银行编码 | 17.1 的编码 |
| controlSwitchType | 开关类型（`n1367`） | 见 `appBankStatusMap`：`1` 卖出、`3` 内部买入申诉、`4` 买入UPI、`5` 买入银行卡、`6` Phonepe唤醒、`7` 外部买入申诉、`8` 外部卖出、`9` 彩票工单、`10` 假App交易、`11` 自动买入 |
| newStatus | 状态 | `1` 开启，`0` 关闭 |
| remark | 备注 | 改开关时必填 |
| updateBy | 操作人 | |
| createTime | 创建时间（`l50`） | |

每个应用、每种开关类型各 1 条。改开关会再写一条，刷新后回到初始。

---

## 18. 会员APP信息

状态：字段理解按代码初读，供校正。一行对应一个 UPI 应用，会员取会员列表已有会员。

- 页面：APP管理 / 会员APP信息
- 路由：`/appConfig/appManager`
- 标题键：`n1524`
- 代码：`apps/admin/src/views/appConfig/appManager.vue`
- 列表：`POST /ar-manager/uploadKycPartnerAdmin/adminListPage`（`res.data` 为数组，`res.total` 为总条数）
- 假数据：`fixtures/appConfig.ts`

### 18.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| appId | APP ID | 这条 APP 绑定的主键。解除绑定、行为日志都用它。 | |
| memberId | 会员ID（`c9`） | 所属会员，可点开已有会员详情。 | |
| phoneNumber | 手机号码（`m591`） | 绑定手机号，取该会员的手机号。 | |
| upiId | UPI ID | `手机号后四位` + 该应用的 UPI 后缀。 | |
| bankCode | 银行编码（`m582`） | 17.1 的编码。 | |
| bankIconUrl | 银行图标（`m583`） | 同 APP 银行图标。 | |
| balance | 余额（`m523`） | 该应用里的余额。底部有本页合计和总计。 | |
| linkStatus | 登录状态（`m186`） | `1` 已登录（`n959`），其它未登录（`n1525`）。搜索值是字符串 `"0"` / `"1"`。 | |
| grantedPermissions | 是否提权（`n1526`） | `1` 是，`0` 否。 | |
| autoBuyEnabled | 买入状态（`memberListC15`） | `1` 开启，`0` 关闭。 | |
| autoSellEnabled | 卖出状态（`m593`） | `1` 开启，`0` 关闭。 | |
| deleted | 是否删除（`m832`） | `0` 未删除（`m894`），`1` 已删除（`m893`），`2` 待删除（`n1643`）。 | |
| scheduledAutoSellEnabled | 是否定时（`n1994`） | `1` 是，`0` 否。未删除的行可以启动或关闭定时。 | |
| createTime | 创建时间（`l50`） | | |
| lastLinkTime | 最新登录时间（`n1639`） | | |
| autoBuyEnabledTime | 最新开启自动买入时间（`n1640`） | 未开启时为空，显示 `-`。 | |
| autoSellEnabledTime | 最新开启自动卖出时间（`n1641`） | 未开启时为空，显示 `-`。 | |
| banRule | 禁用规则（`n1712`） | `0` 解除绑定（`n1698`），`1` 解除绑定并拉黑手机号（`n1700`）。 | |
| updateBy | 操作人（`l48`） | | |
| action | 操作 | 解除绑定、查看日志、启动/关闭定时。 | |

### 18.2 按钮

- 点会员 ID：打开已有会员详情。
- 解除绑定：仅未删除且有手机号的行。规则 `0` 只把该行标成已删除；规则 `1` 同时往黑名单加一条未解禁记录。刷新恢复。
- 查看日志：打开该 APP ID 的行为日志。类型 `1` 链接、`2` 断开链接、`3` 刷新Token、`4` 卸载应用。每种各 1 条，时间在当天。不另写字段小节。
- 启动/关闭定时：改 `scheduledAutoSellEnabled`，刷新恢复。

10 行覆盖登录、提权、买卖开关、删除状态 0/1/2、禁用规则 0/1、是否定时。

---

## 19. APP数据收集

状态：字段理解按代码初读，供校正。10 行，一行一个 UPI 应用，会员与 §18 相同。

- 页面：APP管理 / APP数据收集
- 路由：`/appConfig/appDataCollection`
- 标题键：`n1588`
- 代码：`apps/admin/src/views/appConfig/appDataCollection.vue`
- 列表：`POST /ar-manager/appInfoReport/listPage`
- 假数据：`fixtures/appConfig.ts`

### 19.1 当前展示列

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| memberId | 会员ID（`c9`） | 上报会员，可点开详情。 | |
| mobile | 手机号（`n328`） | 上报手机号，与该会员手机号相同。 | |
| personalName | 个人信息（`n1611`） | 设备上读到的姓名。 | |
| bankName | 银行信息（`n1612`） | 17.1 的应用名称，不是银行编码。 | |
| deviceModel | 设备信息（`n1613`） | 手机型号。 | |
| netType | 网络信息（`n1614`） | 页面原样展示。原型用 `WIFI`、`4G`、`5G`。 | 页面没有枚举。 |
| longitude / latitude | 位置信息（`n1615`） | 同一列展示经度（`n1608`）和纬度（`n1609`）。原型用印度城市坐标。 | |
| contactCount | 通讯录（`n1616`） | 条数。大于 0 可下载。 | |
| contactLog | 通话记录（`n1617`） | 可下载。 | |
| albumSize | 相册（`n1618`） | 容量文本。下载按钮在页面里已注释。 | |
| smsCount | 短信（`n1619`） | 条数。可打开短信列表。 | |
| updateTime | 更新时间（`l71`） | | |

### 19.2 按钮

- 点会员 ID：已有会员详情。
- 下载通讯录、下载通话记录：原型走导出文件，内容是空文件。
- 短信：按该会员和设备打开短信。当天各 2 条（入账通知、登录 OTP）。不另写字段小节。

---

## 20. APP银行（原假APP银行）

状态：字段理解按代码初读，供校正。这是侧栏里保留的 APP银行。菜单和页签已去掉「假」字。银行编码仍是 17.1 的 10 个。

- 页面：APP管理 / APP银行
- 路由：`/appConfig/fackAppBank`
- 标题键：`n1682`（现文案 APP银行）、页签 `n1683` APP银行列表、`n1684` APP银行开关日志
- 代码：`apps/admin/src/views/appConfig/fackAppBank.vue`
- 列表：`POST /ar-manager/fakeAppKycBankAdmin/listPage`
- 和 §17 不是同一份接口，开关含义也不同。

### 20.1 当前展示列

开关 `1` 是 / `0` 否。卖出状态是开启 / 关闭。

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| sort | 排序 | 默认升序。 | |
| bankCode | 银行编码（`m582`） | 17.1。 | 编辑弹窗另有银行名称 `bankName`。 |
| manualBuyUpiStatus | 手动买入UPI（`n1685`） | 能否手动买 UPI 订单。开关类型 `3`。 | 提示 `n1742`。 |
| autoBuyUpiStatus | 自动买入UPI（`n1686`） | 能否自动买 UPI 订单。开关类型 `6`。 | 提示 `n1743`。 |
| manualBuyBankStatus | 手动买入银行卡（`n1687`） | 开关类型 `2`。 | 提示 `n1744`。 |
| autoBuyBankStatus | 自动买入银行卡（`n1688`） | 开关类型 `5`。 | 提示 `n1745`。 |
| sellStatus | 卖出状态（`memberListC16`） | 关闭后该银行不可用。开关类型 `1`。 | 提示 `n1746`。 |
| autoBuyStatus | 自动买入状态（`n1707`） | 关闭后不能自动买入。开关类型 `7`。 | 提示 `n1747`。 |
| fillUtr | 显示回填UTR（`n1751`） | 是否显示回填 UTR。开关类型 `8`。 | |
| forceGrantPermission | 是否提权（`n1526`） | 开关类型 `9`。 | |
| utrRequired | 必填UTR（`n1750`） | `1` 是，`0` 否。只在列表展示，在编辑里改。 | |
| buyUpiMinAmount / buyUpiMaxAmount | 买入UPI金额限制（`n1657`） | 允许购买的 UPI 金额区间。两个都有值才显示区间，否则显示未配置。 | AMAZONPAY 这条做成未配置。 |
| buyBankMinAmount / buyBankMaxAmount | 买入银行卡金额限制（`n1658`） | 银行卡金额区间。 | |
| updateBy | 操作人 | | |
| updateTime | 更新时间 | | |
| action | 操作 | 编辑、删除。开关旁可看日志。 | |

### 20.2 开关日志页签

开关类型用 `fackAppBankStatusMap`：`1` 卖出、`2` 手动买入银行卡、`3` 手动买入UPI、`5` 自动买入银行卡、`6` 自动买入UPI、`7` 自动买入状态、`8` 回填UTR、`9` 是否提权。每种、每个应用各 1 条。状态 `1` 开启 / `0` 关闭。

---

## 21. APP黑名单管理

状态：字段理解按代码初读，供校正。

- 页面：APP管理 / APP黑名单管理
- 路由：`/appConfig/fackAppBlacklist`
- 标题键：`n1697`
- 代码：`apps/admin/src/views/appConfig/fackAppBlacklist.vue`
- 列表：`POST /ar-manager/fakeAppBanRecordAdmin/listPage`
- 银行下拉走 KYC 的 `getBankCodeList`，里面包含 17.1 的编码。

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| bankCode | 银行编码（`m582`） | 17.1。前 6 个应用各 1 条。 | |
| phoneNumber | 手机号码（`m591`） | 被拉黑的手机号，取对应会员手机号。 | |
| unbanFlag | 状态 | `0` 未解禁（`n1702`），其它显示解禁（`n1703`）。 | |
| createTime | 禁用时间（`n1398`） | 展示 `updateTime`，没有则用 `createTime`。 | |
| unbanTime | 解禁时间（`n1174`） | 未解禁为空，显示 `-`。 | |
| remark | 备注 | | |
| updateBy | 操作人（`l48`） | 没有 `updateBy` 时显示 `createBy`。 | |
| action | 操作 | 未解禁的行可点启用。启用后变成已解禁，刷新恢复。 | |

6 条里 4 条未解禁、2 条已解禁。会员 APP 信息里选「解除绑定并拉黑手机号」会再加 1 条未解禁。

---

## 22. APP登陆失败记录

状态：字段理解按代码初读，供校正。失败原因和失败场景都覆盖到。默认筛当天。

- 页面：APP管理 / APP登陆失败记录
- 路由：`/appConfig/fackAppLoginFailure`
- 标题键：`n1714`
- 代码：`apps/admin/src/views/appConfig/fackAppLoginFailureRecords.vue`
- 列表：`POST /ar-manager/uploadKycPartnerAdmin/uploadKycLoginFailureRecords`
- 本页没有行内按钮。

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| memberId | 会员ID（`c9`） | 登录失败的会员。列上不能点进详情。 | |
| bankCode | 银行编码（`m582`） | 17.1，按行轮换。 | |
| phoneNumber | 手机号码（`m591`） | 该会员手机号。 | |
| loginStage | 失败场景（`n1715`） | `1` Before Login State，`2` Upload Kyc Token State。页面写死英文，没有翻译键。 | |
| errorCode | 业务错误编码（`n1716`） | 如 `INVALID_REQUEST`、`RATE_LIMITED`。 | |
| exceptionClass | 异常类名（`n1717`） | Java 异常类全名。 | |
| exceptionMessage | 异常消息（`n1719`） | | |
| exceptionStackTrace | 异常堆栈（`n1720`） | | |
| failureDetail | 失败上下文（`n1721`） | 应用名加失败场景。 | |
| failureReason | 失败原因编码（`n1718`） | `1` Invalid Request，`2` Invalid Data，`3` Phone Bound By Other Member，`4` Rate Limited，`5` Lock Acquisition Failed，`6` Token Upload Failed，`7` Business Exception，`8` System Exception。页面写死英文。 | |
| createTime | 创建时间（`l50`） | 展示创建时间。默认筛印度时区当天。 | |

8 种失败原因 × 2 种场景，共 16 条。

---

## 23. 会员KYC信息

状态：菜单已弃用。侧栏只保留 [§24](#24-会员kyc信息-v2)。

- 页面：KYC管理 / 会员KYC信息
- 路由：`/kyc/kycManager`
- 标题键：`m576`。和 §24 用的是同一个标题。本页卖出状态是纯文字，是否删除只有「是」是红色，「否」没有颜色。操作只有删除。保留的是有操作项、并且卖出状态和是否删除都带颜色的 §24。
- 代码：`apps/admin/src/views/kyc/kycManager.vue`
- 列表：`POST /ar-manager/api/v1/kycPartnersAdmin/listPage`，请求带 `version: 1`
- 假数据：`fixtures/kycMenu.ts`。10 条，会员用 `10086001`～`10086010`，银行用 §17.1 的 10 个 UPI 应用。V1、V2 目前看到同一份 10 条，没有按 version 拆开。
- 打开页面时连接状态默认「已连接」、是否删除默认「否」，所以第一眼是 4 条。点重置会清掉这两个条件，10 条都出来。未连接、已删除的行在这两项改筛选后能看到。

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| id | KYC ID | 这条 KYC 连接的主键。 | |
| memberId | 会员ID | 可点开会员详情。 | |
| account | 手机号码（`m591`） | 列标题是手机号码，字段名是 `account`。假数据填会员手机号。 | |
| upiId | UPI ID | 手机号加该应用的 UPI 后缀，例如 `9100001001@ybl`。 | |
| bankCode | 银行编码（`m582`） | §17.1。 | |
| iconUrl | 银行图标（`m583`） | 用该应用的色块图标。 | |
| linkStatus | 连接状态（`m592`） | `0` 未连接（`m594`），`1` 已连接（`m595`）。 | |
| sellStatus | 卖出状态（`m593`） | `0` 关闭（`l54`），`1` 开启（`l53`）。 | |
| deleted | 是否删除（`m832`） | `1` 显示「是」，其它显示「否」。本页「是」用红色。 | |
| createTime | 创建时间（`l50`） | | |
| lastRefreshTime | 过期时间（`m822`） | 列标题是过期时间，字段名是 `lastRefreshTime`。 | |

银行名称、连接方式、链接地址在源码里注释掉了，列表不展示。

---

## 24. 会员KYC信息 V2

状态：字段理解按代码初读，供校正。

- 路由：`/kyc/kycManagerV2`
- 标题键仍是 `m576`。侧栏只留这一页。卖出状态：开启绿色、关闭红色。是否删除：「是」绿色、「否」红色。操作是连接日志。
- 代码：`apps/admin/src/views/kyc/kycManagerV2.vue`
- 同一列表接口，请求带 `version: 2`
- 比 §23 少了过期时间，多了最新链接时间、最后断连时间，以及操作里的连接日志。

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| lastLinkTime | 最新链接时间（`n247`） | 文案是「链接」，按最近一次连上的时间理解。 | |
| lastCheckLinkTime | 最后断连时间（`m980`） | 最近一次断开的时间。 | |
| action | 操作 | 打开连接日志。日志沿用会员收款里已有的连接日志数据，按本行银行编码和手机号取。 | |

其余列与 §23 相同。本页「是否删除」为「是」时用绿色，和 §23 的红色不同，含义仍是 `1` 为是。

---

## 25. KYC银行列表

状态：字段理解按代码初读，供校正。

- 路由：`/kyc/kycBank`
- 标题键：`n1369`
- 三个页签都是本页的一部分：KYC银行列表（`n1369`）、KYC银行开关日志（`n1368`）、IFSC配置（`n1816`）
- 银行列表接口和已弃用的 `/appConfig/appBank` 相同：`POST /ar-manager/api/v1/kycBankAdmin/listPage`。原型仍返回 §17.1 的 10 个 UPI 应用，并补上本页多出来的额度、OTP、外部图标。
- 开关日志：`POST /ar-manager/kycBankControlSwitchLogAdmin/listPage`
- IFSC：`POST /ar-manager/ifscBankNameAdmin/listPage`。这是银行卡分行编码，用印度传统银行，不替换那 10 个 UPI 应用。

银行列表当前列：排序、银行编码、图标、外部图标、外部背景、卖出、内部买入申诉、买入 UPI、UPI 金额区间、买入银行卡、银行卡金额区间、Phonepe 唤醒、外部买入申诉、外部卖出、彩票工单、OTP 限额开关、每小时成功上限、每日失败上限、是否需要 PIN、多点/单点登录、更新人、更新时间、操作。

开关类型：`1` 卖出，`3` 内部买入申诉，`4` 买入 UPI，`5` 买入银行卡，`6` Phonepe 唤醒，`7` 外部买入申诉，`8` 外部卖出，`9` 彩票工单，`12` OTP 限额。`0` 关，`1` 开。AMAZONPAY 的 UPI 金额留空，列表显示未配置。

`allowMultiLogin`：`1` 多点（`n1385`），`0` 单点（`n1386`）。`needPinCode`：`1` 需要（`n1649`），`0` 不需要（`n1650`）。

开关日志列：银行编码、开关类型、变更后状态、备注、操作人、创建时间。10 个应用 × 类型 `1/3/4/5/6/7/8/9/10/11/12`。类型 `10`、`11` 在本页日志筛选项里注释掉了，数据仍有。

IFSC 列：银行名称、IFSC、创建人、创建时间、更新人、更新时间、操作。10 条：SBI、HDFC、ICICI、Axis、PNB、Bank of Baroda、Kotak、Yes、IDFC、IndusInd。新增、改名称会改当前内存，刷新恢复。

---

## 26. KYC订单

状态：字段理解按代码初读，供校正。默认筛印度时区当天。

- 路由：`/kyc/kycOrder`，标题键 `m607`
- 列表：`POST /ar-manager/api/v1/kycApprovedOrderAdmin/listPage`
- 时间筛的是请求里的 `startTime` / `endTime`。假数据把钱包交易时间放在当天。

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| id | ID | 订单主键。 | |
| bankCode | 银行编码 | §17.1。 | |
| utr | UTR | 银行流水号。 | |
| kycId | KYC ID | 对应 §23 的 `86001` 起。 | |
| orderId | kyc订单号（`m608`） | 平台 KYC 订单号。 | |
| buyerMemberId | 买入会员ID（`m149`） | 可点详情。 | |
| buyerOrderId | 买入订单号（`n41`） | | |
| sellerMemberId | 卖出会员ID（`m150`） | 可点详情。 | |
| sellerOrderId | 卖出订单号（`n40`） | | |
| payerUpi | 付款人UPI（`m609`） | | |
| recipientName | 收款人姓名（`m610`） | | |
| recipientUpi | 收款人UPI（`m611`） | | |
| recipientAccount | 收款人账户（`m612`） | 假数据用卖方手机号。 | |
| transactionType | 交易类型 | `1` 收入（`m616`），`2` 支出（`m617`）。 | |
| transactionStatus | 交易状态 | `0` 失败（`m618`），`1` 成功（`m619`）。 | |
| bankTransactionTime | 银行交易时间 | | |
| walletTransactionTime | 钱包交易时间（`m615`） | | |

10 条，收入/支出、成功/失败都有。

---

## 27. 卖出KYC待拉取列表

状态：字段理解按代码初读，供校正。

- 路由：`/kyc/kycWaitRec`，标题键 `m808`
- 两个页签：卖出KYC待拉取列表；卖出KYC待拉取列表-快捷提现（`m808` + `n633`）
- 普通列表：`POST /ar-manager/kycPartnersAdmin/pendingKycListPage`
- 快捷提现页签：`POST /ar-manager/kycPartnersAdmin/pendingKycListPageForQuickKyc`

普通列表列（代码里就这 9 列）：KYC ID（字段 `id`）、会员ID、银行编码、UPI、拉取次数、成功拉取次数、最后拉取时间、放入时间、token。

快捷提现页签比普通列表多 3 列，共 12 列：KYC ID（字段 `kycId`）、会员（字段 `memberIds`）、商户会员ID、银行编码、UPI、连接状态（`0` 未连接 / `1` 已连接）、卖单数量、拉取次数、成功次数、最后拉取、放入时间、token。多出来的是商户会员ID、连接状态、卖单数量。

各 10 条。点 UPI 打开的关联订单不单列字段，订单状态覆盖 `orderStatusMap` 的 `1`～`13`、`15`、`17`。

---

## 28. 买入KYC待拉取列表

状态：字段理解按代码初读，供校正。

- 路由：`/kyc/kycWaitRecBuy`，标题键 `m949`
- 列表：`POST /ar-manager/kycPartnersAdmin/pendingBuyKycListPage`
- 快捷提现里的「买入待拉取队列」也打这个接口，但请求带 `selectType: 2`。原型用这个值把两页数据分开。

列：会员ID、银行编码、买入平台订单、UTR、手机号、放入时间、拉取次数、最后拉取时间、断连时间、token。10 条，一半有断连时间。

---

## 29. KYC续Token列表

状态：字段理解按代码初读，供校正。

- 路由：`/kyc/kycToken`，标题键 `m825`
- 列表：`POST /ar-manager/kycPartnersAdmin/pendingKycTokenListPage`
- 当前只展示一列 KYC ID。10 条，对应 §23 的 `86001`～`86010`。

---

## 30. 买入申诉流水

状态：字段理解按代码初读，供校正。默认筛当天。

- 路由：`/kyc/kycBuyAppealRec`，标题键 `m951`
- 列表：`POST /ar-manager/kycPartnerBuyAppealPaymentAdmin/listPage`
- 和快捷提现的买入流水共用接口。快捷提现带 `selectType: 2`，本页不带，原型据此分开。

列：会员ID、申诉ID（`appealId`，标题键 `m959`）、手机号、银行编码、收款人、银行卡号、IFSC、持卡人、金额、UTR、是否写错 UTR（`1` 是 / `0` 否）、写错 UTR 的订单、写错是否已完成、付款人、TID、银行交易时间、创建时间、买方订单、卖方订单、匹配状态、是否补单、操作。

申诉ID（`appealId`，标题键 `m959`）与「申诉订单列表」的申诉ID（字段 `id`）同一字段。本页 `AP89001`～`AP89010`。点申诉ID 跳到 `/order/appeal/index?appealId=`，列表按 `id` 精确筛到对应那一条。可点击跳转的流水页共用同一套关联，见 §83。

匹配状态 `isMatch`：`0` 未匹配，`1` 已匹配，`2` 手动匹配，`3` 金额异常。未匹配的行可以补单。补单成功后该行变为手动匹配，并标上已补单（`replenishmentFlag = 1`，文案 `n313`）。刷新恢复。

10 条，四种匹配状态都有。

---

## 31. KYC卖出申诉待拉取列表

状态：字段理解按代码初读，供校正。

- 路由：`/kyc/kycSellAppealWait`，标题键 `m977`
- 列表：`POST /ar-manager/kycPartnersAdmin/kycSellAppealPendingPull`

列：会员ID、KYC ID、UTR、银行编码、卖出平台订单、拉取次数、放入时间、最后拉取时间。操作列在源码里注释掉了。10 条。

---

## 32. KYC交易失败流水

状态：字段理解按代码初读，供校正。默认筛当天。

- 路由：`/kyc/kycFaildRecords`，标题键 `n291`
- 列表：`POST /ar-manager/kycPartnerRecipientAdmin/failedListPage`

列和卖出流水接近：KYC ID、会员ID、申诉单号、银行编码、收款人、金额、UTR、付款人、TID、银行交易时间、创建时间、卖方订单、匹配状态。操作列注释掉了。

页面里另有一套 `orderStatusMap`（`1` 退回中、`2` 退回成功、`3` 退回失败），当前列表没有对应列。匹配状态仍是 `0`～`3`。8 条。

---

## 33. 买入申诉失败流水

状态：字段理解按代码初读，供校正。默认筛当天。

- 路由：`/kyc/kycBuyAppealFailedRec`，标题键 `n292`
- 列表：`POST /ar-manager/kycPartnerBuyAppealPaymentAdmin/failedListPage`
- 快捷提现的买入失败流水带 `selectType: 2`，和本页分开。

列比 §30 少了银行卡、IFSC、持卡人、写错 UTR、补单标记。匹配状态 `0`～`3`。未匹配可补单，成功后改为手动匹配。8 条。

---

## 34. 快捷提现

状态：字段理解按代码初读，供校正。三个页签都算本页。

- 路由：`/kyc/quickWithdrawal`，标题键 `n633`
- 页签：买入流水（`n634`）、买入待拉取队列（`n635`）、买入失败流水（`n1479`）。连接记录页签已注释。

买入流水、买入失败流水的列和 §30、§33 同一套，另外有收款类型 `recipientType`：`1` 快捷提现-银行卡（`n625`），`3` 快捷提现-UPI（`n624`）。两种都有。

买入流水申诉ID：`AP89901`～`AP89908`；买入失败流水：`AP89941`～`AP89948`。两处都可点申诉ID，跳到申诉订单列表筛对应订单（同 §30 / §83）。

买入待拉取队列的列和 §28 相同，并有连接状态。

请求都带 `selectType: 2`，所以不会和申诉流水、买入待拉取列表串数据。

---

## 35. KYC短信日志

状态：字段理解按代码初读，供校正。默认筛当天。

- 路由：`/kyc/kycSmsLog`，标题键 `n795`
- 列表：`POST /ar-manager/api/v1/kycSendSmsDailyStatistics/listPage`

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| phoneNumber | 手机号码 | 会员手机号。 | |
| memberId | 会员ID | | |
| bankCode | 银行编码 | §17.1。 | |
| upiId | UPI ID | | |
| sendStatus | 发送状态 | `1` 成功（`s10`），`0` 失败（`m618`）。 | |
| sendTime | 发送时间 | 默认落在印度时区当天。 | |
| remark | 备注 | 失败行写 `gateway timeout`，成功行为空。 | |

10 条，成功、失败各半。

---

## 36. upi买卖交易统计

状态：字段理解按代码初读，供校正。默认统计日期是印度时区当天。

- 路由：`/kyc/kycTrading`，标题键 `n797`
- 列表：`POST /ar-manager/api/v1/kycDataStatDayManager/listPage`
- 底部合计读 `res.extend` 的当日买卖笔数和金额。

列：KYC ID、UPI ID、当日买入成功笔数、当日买入成功金额、当日买入成功率、当日卖出成功笔数、当日卖出成功金额、当日卖出成功率、统计日期（`statDate`，日期字符串）。10 条，都是当天。

---

## 37. KYC短信发送成功日志

状态：字段理解按代码初读，供校正。菜单没有单独翻译键，名称保持原文。默认日期是当天。

- 路由：`/kyc/kycSmsSuccessLog`
- 列表：`POST /ar-manager/api/v1/kycSendSmsSuccessStatistics/listPage`
- 底部合计读 `res.extend.cntPageTotal`、`cntTotal`。

列：手机号码、银行编码、统计次数（`cnt`）、发送时间。10 条，按银行各一条，次数 3、6、9……

---

## 38. 卖出交易流水

状态：字段理解按代码初读，供校正。五个页签都算本页。默认筛当天。

- 路由：`/kyc/sellTransRes`，标题键 `m690`
- 页签：卖出交易流水；UTR重复流水（`n850`）；TID重复流水（`n851`）；卖出交易异常流水（`n861`）；唤醒记录（`n1269`）

卖出交易流水 `POST /ar-manager/kycPartnerRecipientAdmin/listPage`。列在 §30 的基础上有：是否 Phonepe 唤醒（`1` 是 / `0` 否）、是否已收到信息（`1` 是 / `0` 否）。匹配状态 `0`～`3`。未匹配可补单。会员ID按逗号拆开显示，假数据用字符串。10 条。申诉ID：`AP89401`～`AP89410`，可点跳申诉订单列表。

UTR 重复（`AP89501`～`AP89504`）、TID 重复（`AP89601`～`AP89604`）各 4 条，共用同一个 UTR 或同一个 TID，匹配状态四种都有；申诉ID 同样可点跳。

异常流水多了错误说明、可能订单。可能订单是字符串数组。6 条，匹配状态是未匹配，可补单。异常流水的申诉ID 点击在源码里已注释，本次不恢复跳转。

唤醒记录列：买入会员、撮合订单号、银行编码、操作时间。10 条，一半银行编码是 PHONEPE。

---

## 39. KYC流水状态异常

状态：字段理解按代码初读，供校正。默认按拉取时间筛当天。

- 路由：`/kyc/kycTransAbn`，标题键 `n1253`
- 列表：`POST /ar-manager/abnormalWaterFlowAdmin/listPage`

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| tid | TID | 银行交易号。 | |
| utr | UTR | | |
| flowAmount | 流水金额 | | |
| flowStatus | 流水状态（`n1254`） | 自由文本。假数据用 SUCCESS、FAILED、PENDING、REVERSED。 | |
| flowType | 流水类型（`n1255`） | `1` 卖方流水（`n1256`），`2` 买方流水（`n1257`）。 | |
| mappingOrderInfo | 映射订单 | 内含申诉状态 `1`～`3`、买入订单类型 `1`～`7`、撮合状态。 | |
| payeeKycInfo | 收款 KYC | 银行、账号、手机、UPI、IFSC。 | |
| payerKycInfo | 付款 KYC | 同上。 | |
| pullTime | 拉取时间 | | |

8 条。

---

## 40. 冲正流水

状态：字段理解按代码初读，供校正。默认筛当天。

- 路由：`/kyc/kycReversal`，标题键 `n1534`
- 列表：`POST /ar-manager/kycReversalWaterAdmin/listPage`

列：银行编码、UTR、txnid、金额、收款人、收款 UPI、TID、订单状态、源交易状态、创建时间、交易创建时间、交易更新时间。

`orderStatus`：`1` 成功（`s10`），其它显示失败（`m618`）。两种都有。源交易状态是原文 SUCCESS / FAILED。TID 以 `DEFAULT` 开头的行会套用页面的默认 TID 样式。10 条。

---

## 41. 彩票工单通道列表

状态：字段理解按代码初读，供校正。侧栏名称用已有键 `n1274`（彩票工单通道列表）。

- 路由：`/kyc/externalChanellList`
- 列表：`POST /ar-manager/extChannelAdmin/listpage`（page 是小写）
- 查看：`getInfo`。启用/禁用：`updateStatus`。新增：`createMerchantInfo`。保存公钥：`updatePublicKey`。生成密钥会打开 `#/createExternalNewKey`，那一页本次不写字段。

列：ID、名称、编码、状态、创建时间、创建人、操作。

`status`：`0` 禁用，`1` 启用。4 条：Razorpay、Cashfree 启用，PayU 禁用，PhonePe Business 启用。切换状态和新增会改当前内存，刷新恢复。

这些是外部收单通道，不是 §17.1 的 UPI 应用。后面三页的通道编码跟这 4 条对齐。

---

## 42. 彩票工单异常流水

状态：字段理解按代码初读，供校正。侧栏名称用已有键 `n1275`（彩票工单异常流水）。默认按交易时间筛当天。

- 路由：`/kyc/externalChannelException`
- 列表：`POST /ar-manager/extChannelKycAdmin/kycWaterFail/listPage`

列：通道编码、手机号、银行编码（§17.1）、付款人、金额、UTR、收款人、IFSC、持卡人、收支方向、原始状态、交易时间。

`mode`：`1` 收入（`m616`），`2` 支出（`m617`）。原始状态是通道原文，假数据用 SUCCESS / FAILED。8 条。

---

## 43. 彩票工单待拉取列表

状态：字段理解按代码初读，供校正。侧栏名称用已有键 `n1273`（彩票工单待拉取列表）。默认按创建时间筛当天。

- 路由：`/kyc/kycCollectionPending`
- 列表：`POST /ar-manager/extChannelKycAdmin/kycPending/listPage`

列：通道名称、通道编码、手机号、银行编码、连接状态（`1` 已连接 / 其它未连接）、创建时间、成功拉取次数、最后拉取时间、token。8 条，通道用 §41 的 4 个编码。

---

## 44. 彩票工单交易流水

状态：字段理解按代码初读，供校正。侧栏名称用已有键 `n1272`（彩票工单交易流水）。默认按交易时间筛当天。

- 路由：`/kyc/externalChannellCollection`
- 列表：`POST /ar-manager/extChannelKycAdmin/kycWaterSuccess/listPage`
- 列和 §42 相同。8 条，收入、支出都有。

---

## 45. KYC多订单列表

状态：字段理解按代码初读，供校正。默认按处理时间筛当天。

- 路由：`/kyc/kycMoreOrder`，标题键 `n1289`
- 列表：`POST /ar-manager/oneWaterMultipleOrderAdmin/processResultList`

列：买方会员、收款账号、流水类型（`1` 卖方 / `2` 买方）、TID、UTR、金额、处理结果、TID 订单、UTR 订单、买方失败完结订单、处理时间、银行交易时间。

处理结果 `processResult` 为 `1`～`15`，文案 `n1296`～`n1310`。`7` 完成 TID 订单、`8` 针对 TID 订单补单显示绿色，其余红色。每种结果 1 条，共 15 条。

三个订单块里的买入订单类型 `buyOrderType` 覆盖 `1`～`7`，订单来源 `orderFrom` 覆盖 `0`～`5`（内部订单、快捷提现 UPI/银行卡/KYC、交易所 UPI/银行卡）。

---

## 46. 支付成功流水

状态：字段理解按代码初读，供校正。

- 路由：`/kyc/kycBuySuccessRecord`，标题键 `n1449`
- 列表：`POST /ar-manager/buyPaymentSuccessRecordForAdmin/buySuccessUpiListPage`。响应在 `res.data.list`。
- 点成功笔数打开的日志：`buyListPageRecord`，同样是 `res.data.list`。日志不单列字段小节。

列：序号、会员ID、UPI、成功笔数、银行编码、最新连接时间、最后断连时间。10 条，成功笔数从 1 到 10，点开后按该 UPI 和会员能看到日志。

日志的订单来源 `sourceOrderType` 覆盖 `0`～`5`，和 §45 的订单来源同一套。

---

## 47. 自动交易流水

状态：字段理解按代码初读，供校正。五个页签都算本页。

- 路由：`/kyc/autoTransRes`，标题键 `n1501`
- 页签：自动交易买入流水（`n1502`）、自动交易卖出流水（`n1503`）、自动交易待拉取列表（`n1504`）、假APP交易失败责任方（`n1569`）、假APP未完结流水（`n1674`）。后两个页签标题仍带「假」，本次只做数据，不改页面名称。

买入、卖出流水列：撮合订单号、会员、TID、交易号、银行编码、手机号、收款 VPA、金额、UTR、付款 VPA、匹配状态，买入多一个成功标记和后台错误码。拉取时间默认当天。

成功标记：`1` 成功（`m619`），其它失败（`m618`）。匹配状态仍是 `0`～`3`。各 8 条。

待拉取列：银行编码、手机号、映射订单、收款笔数、创建时间、最后拉取时间。10 条。

失败责任方列：错误码、错误说明、责任方、判定来源、判定人、创建时间、操作。

责任方 `failedParty`：`0` 待定（`n1573`），`1` 付款方（`n1574`），`2` 收款方（`n1575`）。判定来源 `judgeSource`：`0` 系统（`n1576`），`1` 人工（`n1577`）。6 条，三种责任和两种来源都有。修改责任方会把该行改成人工判定，刷新恢复。

未完结流水列在自动流水上增加资金方向和源交易状态。资金方向 `fundFlowType`：`1` 卖出（`n100`），`2` 买入（`n104`）。匹配状态 `0`～`3`。8 条。银行编码仍用 §17.1。

## 48. BI看板

状态：供校正。这一栏没有列表字段，原型不补图表数据。

- 栏目：BI看板
- 代码：`apps/admin/src/views/biScreen/dataOverview.vue`、`dataScreen.vue`，内容是 `dataIframe.vue`
- 这些页面只在 `biDataUrl` 有地址时嵌入线上 BI。原型里 `publicData.ts` 把 `biDataUrl` 收成空对象，页面显示空状态（文案键 `n336`）。
- 不连接线上 BI，也不造一份看板假数据，因为页面没有表格接口可以承接。

| 路由 | 标题 |
| --- | --- |
| `/biScreen/dataScreen` | 数据大屏 |
| `/biScreen/dataOverview` | 数据概览 |
| `/biScreen/dataRecReport` | 对账报表 |
| `/biScreen/dataMearchantReport` | 商户报表 |
| `/biScreen/dataBuyReport` | 买入报表 |
| `/biScreen/dataSellReport` | 卖出报表 |
| `/biScreen/dataVisualization` | ARB数据可视化 |
| `/biScreen/matchingData` | 匹配数据概览 |
| `/biScreen/dataToupOverview` | 充值数据概览 |
| `/biScreen/dataFinancial` | 财务数据报表 |
| `/biScreen/dataMember` | 会员统计看板 |
| `/biScreen/dataFundFlows` | 资金流向看板 |
| `/biScreen/dataIdxCompResult` | 指标比对结果表 |
| `/biScreen/dataKycTransStats` | KYC交易统计 |
| `/biScreen/dataAntMember` | 蚂蚁会员统计看板 |
| `/biScreen/dataSmsLog` | KYC短信日志明细 |
| `/biScreen/dataSendSmsCount` | KYC短信次数日统计 |
| `/biScreen/dataSmsVerifyLog` | KYC短信验证日志 |
| `/biScreen/dataBankData` | 银行接口数据分析 |
| `/biScreen/dataAppealOrder` | 申诉订单监控 |
| `/biScreen/dataArrearsBoard` | 欠费监控看板 |
| `/biScreen/dataAssemble` | 撮合看板 |
| `/biScreen/dataBuyUsdt` | USDT买入报表 |
| `/biScreen/dataBusinessDatabas` | 业务数据库数据量 |
| `/biScreen/dataRegAndLogin` | 注册和登录基础指标数据 |
| `/biScreen/dataMerchantBalance` | 商户余额自检报告表 |
| `/biScreen/dataNewCustomer` | 新客首月转化 |
| `/biScreen/dataAntMemberReward` | 蚂蚁会员奖励 |
| `/biScreen/dataPriviegeEsc` | 提权成功率统计 |
| `/biScreen/dataTradingBusiness` | 自动交易业务监控看板 |
| `/biScreen/dataMemberLoginLog` | 会员登录日志 |
| `/biScreen/dataMemberTrading` | 会员交易画像 |
| `/biScreen/dataBusinessRealTime` | 业务实时监控看板 |
| `/biScreen/dataFakeAppBuyAnalysis` | 假APP买入分析 |
| `/biScreen/dataTrackingAnalytics` | 收银台埋点分析 |
| `/biScreen/dataUsdtBuyOrder` | USDT买入订单统计 |
| `/biScreen/dataFackAppSellAppeal` | 假APP卖单申诉分析 |

## 49. 系统日志 admin-log-index

状态：供校正。

- 栏目：系统管理
- 路由：`/admin/log/index`
- 代码：`apps/admin/src/views/admin/log.vue`
- 列表接口：
  - `POST /ar-manager/syslog/listPage`（本阶段按下列生成）
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `ip` | IP地址 |
| `module` | 操作模块 |
| `content` | 操作 |
| `method` | 请求方法 |
| `createBy` | 操作人 |
| `status` | 状态 |
| `requestParam` | 请求参数 |
| `path` | 操作路径 |
| `createTime` | 创建时间 |

## 50. 用户管理 admin-user-index

状态：供校正。

- 栏目：系统管理
- 路由：`/admin/user/index`
- 代码：`apps/admin/src/views/admin/user.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/users/listPage`（本阶段按下列生成）
- 同页其它接口 3 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `username` | 用户名 |
| `listRole` | 角色 |
| `nickname` | 昵称 |
| `status` | 角色状态 |
| `loginCount` | 登录次数 |
| `lastLoginIp` | 最后登录IP |
| `lastLoginTime` | 最后登录时间 |

## 51. 菜单管理 admin-menu-index

状态：供校正。

- 栏目：系统管理
- 路由：`/admin/menu/index`
- 代码：`apps/admin/src/views/admin/menu.vue`
- 列表接口：
  - `POST /ar-manager/menu/list`（本阶段按下列生成）
- 同页其它接口 3 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `name` | 菜单名称 |
| `component` | 组件路径 |
| `icon` | 菜单图标 |
| `parentId` | 父页面ID |
| `path` | 路由路径 |
| `redirect` | 跳转路径 |
| `sort` | 排序 |
| `visible` | 状态 |
| `menuId` | 菜单名称 |
| `btnSign` | btnSign |
| `method` | method |
| `serviceName` | 服务名称 |
| `url` | url |

## 52. 角色管理 admin-role-index

状态：供校正。

- 栏目：系统管理
- 路由：`/admin/role/index`
- 代码：`apps/admin/src/views/admin/role.vue`
- 列表接口：
  - `POST /ar-manager/role/listPage`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `name` | 角色名称 |
| `code` | 角色编码 |
| `sort` | 排序 |
| `status` | 角色状态 |

## 53. IP白名单 admin-white-index

状态：供校正。

- 栏目：系统管理
- 路由：`/admin/white/index`
- 代码：`apps/admin/src/views/admin/white.vue`
- 列表接口：
  - `POST /ar-manager/syswhite/listPage`（本阶段按下列生成）
- 同页其它接口 5 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `ip` | ip |
| `clientType` | 后台类型 |
| `createBy` | 创建人 |
| `createTime` | 创建时间 |
| `remark` | 备注 |
| `status` | 状态 |
| `updateBy` | 操作人 |
| `updateTime` | 操作时间 |

## 54. 交易IP黑名单 admin-black-index

状态：供校正。

- 栏目：系统管理
- 路由：`/admin/black/index`
- 代码：`apps/admin/src/views/admin/black.vue`
- 列表接口：
  - `POST /ar-manager/tradeIpBlack/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/relationMemberList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/matchingOrderAdmin/relationOrderList`（本阶段按下列生成）
  - `POST /ar-manager/memberGroupAdmin/listpage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `ipAddress` | ipAddress |
| `reason` | 备注 |
| `status` | 状态 |
| `createTime` | 创建时间 |
| `updateTime` | 更新时间 |
| `createBy` | 创建人 |
| `updateBy` | 操作人 |
| `index` | 序号 |
| `merchantName` | 商户名称 |
| `memberId` | 商户会员ID |
| `buyOrderNo` | 买入订单号 |
| `matchOrder` | 匹配订单号 |
| `sellOrderNo` | 关联卖出订单号 |
| `amount` | 订单金额 |
| `actualAmount` | 实际金额 |
| `orderStatus` | 订单状态 |
| `memberAccount` | 会员账号 |
| `memberGroup` | 会员分组 |
| `memberType` | 会员类型 |
| `realName` | 实名 |
| `buyStatus` | 买入状态 |
| `sellStatus` | 卖出状态 |

同页读到的枚举：

- orderStatusMap：`3` 待支付，`4` 确认中，`5` 确认超时，`6` 申诉中，`7` 已完成，`8` 已取消，`10` 买入失败，`11` 金额错误，`13` 支付超时，`15` 手动完成

## 55. 系统登录日志 admin-sysLoginlog

状态：供校正。

- 栏目：系统管理
- 路由：`/admin/sysLoginlog`
- 代码：`apps/admin/src/views/admin/sysLoginlog.vue`
- 列表接口：
  - `POST /ar-manager/adminLog/listPage`（前面栏目已经有假数据，本页沿用）
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `userId` | 用户ID |
| `username` | 登录账号 |
| `merchantCode` | 商户号 |
| `userType` | 用户类型 |
| `loginStatus` | 登录状态 |
| `ipAddress` | 登录IP |
| `loginTime` | 登录时间 |
| `device` | 登录设备 |
| `userAgent` | 浏览器信息 |

同页读到的枚举：

- loginStatusMap：`1` 成功，`2` 失败
- userTypeMap：`1` 总后台，`2` 商户后台，`3` 商户管理员

## 56. 商户列表 admin-merchantInfo-index

状态：供校正。

- 栏目：系统管理
- 路由：`/admin/merchantInfo/index`
- 代码：`apps/admin/src/views/merchant/merchantInfo.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 15 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `username` | 商户名称 |
| `merchantCode` | 商户端编号 |
| `code` | 钱包端编号 |
| `merchantType` | 商户类型 |
| `exchangeMerchant` | exchangeMerchant |
| `website` | 商户网站 |
| `timeZone` | 时区 |
| `balance` | 商户余额 |
| `memberTotalNum` | 会员数量 |
| `memberTotalBalance` | 会员ARB余额 |
| `status` | 商户状态 |
| `payRate` | payRate |
| `quickPayUpiRate` | quickPayUpiRate |
| `transferRate` | transferRate |
| `quickTransferRate` | quickTransferRate |
| `rechargeReward` | 买入奖励 |
| `withdrawalRewards` | 卖出奖励 |
| `withdrawalStatus` | 代付状态 |
| `rechargeStatus` | 代收状态 |
| `rechargeSuccessCallbackOnly` | 充值仅成功回调 |
| `withdrawSuccessCallbackOnly` | 提现仅成功回调 |
| `priorityMatchFlag` | 全量撮合 |
| `matchPriorityUpiTime` | 优先撮合 |
| `supportFourthChannel` | 四方通道 |
| `supportRandomAmount` | 金额完单 |
| `upiSellOrderAutoBuy` | upiSellOrderAutoBuy |
| `bankSellOrderAutoBuy` | bankSellOrderAutoBuy |
| `isIntegerAmountFirst` | isIntegerAmountFirst |
| `randomAmountMin` | 金额范围 |
| `autoWithdrawalState` | 商户自动出款 |
| `riskTag` | 风控标识 |
| `createTime` | 创建时间 |
| `updateTime` | 修改时间 |
| `updateBy` | 操作人 |

同页读到的枚举：

- merchantTypeMap：`1` 内部商户，`2` 外部商户
- statusMap：`0` 禁止代收，`1` 正常代收，`2` 禁止代付，`3` 代付正常

## 57. 下发申请 merchant-application

状态：供校正。

- 栏目：商户管理
- 路由：`/merchant/application`
- 代码：`apps/admin/src/views/merchant/application.vue`
- 列表接口：
  - `POST /ar-manager/applyDistributedAdmin/listpage`（本阶段按下列生成）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `orderNo` | 下发申请订单号 |
| `merchantCode` | 商户账号 |
| `username` | 商户账号 |
| `usdtAddr` | 下发USDT地址 |
| `balance` | 总额度 |
| `amount` | 下发金额 |
| `createTime` | 订单时间 |

## 58. 下发记录 merchant-record

状态：供校正。

- 栏目：商户管理
- 路由：`/merchant/record`
- 代码：`apps/admin/src/views/merchant/record.vue`
- 列表接口：
  - `POST /ar-manager/applyDistributedAdmin/listRecordPage`（本阶段按下列生成）
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `orderNo` | 下发订单号 |
| `merchantCode` | 商户账号 |
| `username` | 商户名称 |
| `usdtAddr` | 下发USDT地址 |
| `balance` | 总额度 |
| `amount` | 下发金额 |
| `status` | 状态 |
| `createTime` | 订单时间 |
| `updateTime` | 操作时间 |
| `updateBy` | 操作人 |
| `remark` | 备注 |

同页读到的枚举：

- statusMap：`0` 未下发，`1` 已下发，`2` 拒绝
- statusColorMap：`0` processing，`1` success，`2` error

## 59. 商户账变 merchant-changes

状态：供校正。

- 栏目：商户管理
- 路由：`/merchant/changes`
- 代码：`apps/admin/src/views/merchant/changes.vue`
- 列表接口：
  - `POST /ar-manager/accountChangeAdmin/query`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `orderNo` | 商户订单号 |
| `merchantOrder` | 平台订单号 |
| `createTime` | 订单时间 |
| `merchantCode` | 商户账号 |
| `merchantType` | 商户类型 |
| `merchantName` | 商户名称 |
| `changeType` | 类型 |
| `accountSourceType` | 买入订单类型 |
| `beforeChange` | 账变前额度 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后额度 |
| `commission` | 手续费 |
| `remark` | 备注 |
| `updateBy` | 操作人 |

同页读到的枚举：

- merchantTypeMap：`1` 内部商户，`2` 外部商户
- sourceTypeMap：`1` AR_UPI订单，`2` AR_PAY订单

## 60. 商户代收订单 merchant-recharge

状态：供校正。

- 栏目：商户管理
- 路由：`/merchant/recharge`
- 代码：`apps/admin/src/views/merchant/recharge.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 28 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `createTime` | 订单时间 |
| `merchantName` | 商户名称 |
| `merchantCode` | 商户号 |
| `memberId` | 会员ID |
| `platformOrder` | 订单号 |
| `thirdRechargeFlag` | 是否快捷订单 |
| `quadOrderChannel` | 通道信息 |
| `externalMemberId` | 商户会员ID |
| `merchantOrder` | 商户订单号 |
| `buyOrderNo` | 关联买入订单号 |
| `orderAmount` | 订单金额 |
| `amount` | 实际金额 |
| `cost` | 代收费用 |
| `randomAmount` | 优惠金额 |
| `completionTime` | 完成时间 |
| `tradeCallbackTime` | 回调时间 |
| `orderStatus` | 支付状态 |
| `complainedFlag` | 是否申诉过 |
| `tradeCallbackStatus` | 回调状态 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 61. 商户代付订单 merchant-withdraw

状态：供校正。

- 栏目：商户管理
- 路由：`/merchant/withdraw`
- 代码：`apps/admin/src/views/merchant/withdraw.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 28 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `createTime` | 订单时间 |
| `merchantName` | 商户名称 |
| `merchantCode` | 商户号 |
| `merchantType` | 商户类型 |
| `memberId` | 会员ID |
| `platformOrder` | 订单号 |
| `externalMemberId` | 商户会员ID |
| `merchantOrder` | 商户订单号 |
| `matchPoolOrderNo` | 母单号 |
| `sourceOrderType` | 订单来源 |
| `payType` | 类型 |
| `amount` | 订单金额 |
| `cost` | 代付费用 |
| `completionTime` | 完成时间 |
| `tradeCallbackTime` | 回调时间 |
| `orderStatus` | 支付状态 |
| `tradeCallbackStatus` | 回调状态 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- statusMap：`1` 支付中，`2` 已完成，`3` 代付失败，`4` 支付超时
- merchantTypeMap：`1` 内部商户，`2` 外部商户
- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 62. 参数配置 config-setting-index

状态：供校正。

- 栏目：运营管理
- 路由：`/config/setting/index`
- 代码：`apps/admin/src/views/config/setting.vue`
- 列表接口：
  - `POST /ar-manager/buyLimitConfig/getBuyLimitList`（本阶段按下列生成）
  - `POST /ar-manager/tradeConfigAdmin/operationLog/listPage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 10 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `serialNo` | 序号 |
| `operationTime` | 操作时间 |
| `operationArea` | 操作区域 |
| `operationContent` | 操作内容 |
| `operator` | 操作人 |
| `operatorIp` | 操作IP |

同页读到的枚举：

- buyPayMap：`1` 买入，`2` 卖出
- areaMap：`1` 买入参数设置，`2` 卖出参数设置，`3` 蚂蚁参数设置，`4` 其他参数配置，`5` 风控参数设置

## 63. USDT管理 config-usdt-index

状态：供校正。

- 栏目：运营管理
- 路由：`/config/usdt/index`
- 代码：`apps/admin/src/views/config/usdt.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/usdtConfigAdmin/listpage`（本阶段按下列生成）
- 同页其它接口 4 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `networkProtocol` | 主网络 |
| `usdtAddr` | USDT地址 |
| `createTime` | 添加时间 |
| `updateTime` | 最后更新时间 |
| `status` | 状态 |
| `remark` | 备注 |

## 64. 买入取消原因 config-rechargeCancel-index

状态：供校正。

- 栏目：运营管理
- 路由：`/config/rechargeCancel/index`
- 代码：`apps/admin/src/views/config/rechargeCancel.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/cancellationRecharge/listpage`（本阶段按下列生成）
- 同页其它接口 3 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `reason` | 取消原因 |
| `sort` | 排序 |
| `createTime` | 添加时间 |
| `updateTime` | 最后更新时间 |

## 65. 卖出取消原因 config-withdrawCancel-index

状态：供校正。

- 栏目：运营管理
- 路由：`/config/withdrawCancel/index`
- 代码：`apps/admin/src/views/config/withdrawCancel.vue`
- 列表接口：
  - `POST /ar-manager/withdrawalCancellation/listpage`（本阶段按下列生成）
- 同页其它接口 3 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `reason` | 取消原因 |
| `sort` | 排序 |
| `createTime` | 添加时间 |
| `updateTime` | 最后更新时间 |

## 66. 内容配置 config-contentconfig-index

状态：供校正。

- 栏目：运营管理
- 路由：`/config/contentconfig/index`
- 代码：`apps/admin/src/views/config/contentconfig.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/cancellationRecharge/listpage`（本阶段按下列生成）
  - `POST /ar-manager/withdrawalCancellation/listpage`（本阶段按下列生成）
  - `POST /ar-manager/banner/listBanners`（本阶段按下列生成）
  - `POST /ar-manager/announcement/listAnnouncements`（本阶段按下列生成）
  - `POST /ar-manager/manager/activity/list`（本阶段按下列生成）
  - `POST /ar-manager/cashierAdvertisement/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/tradeConfigSchemeAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/frontPageConfig/listPage`（本阶段按下列生成）
- 同页其它接口 29 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `reason` | 取消原因 |
| `sort` | 排序 |
| `belongCollectionAccountExp` | 收款账户异常 |
| `showFlag` | 是否展示 |
| `createTime` | 添加时间 |
| `updateTime` | 最后更新时间 |
| `announcementTitle` | 公告标题 |
| `announcementContent` | 公告内容 |
| `sortOrder` | 排序 |
| `status` | 发布状态 |
| `platformType` | 发布平台 |
| `createBy` | 添加人 |
| `updateBy` | 操作人 |
| `bannerType` | Banner类型 |
| `bannerImageUrl` | Banner图片 |
| `redirectUrl` | 跳转链接 |
| `linkType` | 链接类型 |
| `titleEn` | 弹窗标题 |
| `contentEn` | 弹窗内容 |
| `titleHi` | 弹窗标题 |
| `contentHi` | 弹窗内容 |
| `frequency` | 弹出频率 |
| `windowStyle` | 弹窗样式 |
| `title` | 活动标题 |
| `eventBanner` | 活动封面 |
| `content` | 活动内容 |
| `state` | 发布状态 |
| `imageUrl` | banner图片 |
| `platformCode` | 发布平台 |
| `operator` | 操作人 |

同页读到的枚举：

- statusTypeMap：`0` 禁用，`1` 启用
- checkedLinkTypeMap：`1` 站内链接，`2` 站外链接
- checkedTypeMap：`0` 禁用，`1` 启用
- checkedTypeMap1：`01` 轮播图，`02` 类型图
- frequencyMap：`1` 每天一次，`2` 每次登陆弹出，`3` 用户每次返回首页
- windowStyleMap：`1` 活动弹框，`2` 用户提醒
- statusTypeMap：`1` 开启，`2` 关闭
- statusTypeMap：`0` 禁用，`1` 启用

## 67. 运营参数配置 config-operations

状态：供校正。

- 栏目：运营管理
- 路由：`/config/operations`
- 代码：`apps/admin/src/views/config/operations.vue`
- 列表接口：
  - `POST /ar-manager/rewardCardConfigAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 5 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | 方案ID |
| `schemeTag` | 方案名称 |
| `schemeName` | 账号标签 |
| `updateTime` | 最近修改时间 |
| `updateBy` | 操作人 |
| `title` | 序号 |
| `amount` | 奖励卡金额 |
| `validityType` | 有效期 |
| `cardType` | 奖励卡类型 |
| `status` | 状态 |
| `createTime` | 创建时间 |
| `createBy` | 创建人 |

同页读到的枚举：

- levelMap：`1` 会员L1级运营参数配置方案，`2` 会员L2级运营参数配置方案
- accountTaglMap：`1` 激活钱包，`2` 实名认证
- levelMap：`1` 会员L1级运营参数配置方案，`2` 会员L2级运营参数配置方案
- accountTaglMap：`1` 激活钱包，`2` 实名认证
- validityTypeMap：`0` 不限制，`1` 7天，`2` 15天，`3` 30天
- cardTypeMap：`1` 卖出奖励卡
- activateTypeMap：`1` 添加KYC

## 68. 任务管理 config-taskManagement

状态：供校正。

- 栏目：运营管理
- 路由：`/config/taskManagement`
- 代码：`apps/admin/src/views/config/taskManagement.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/taskManagerAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/taskEventConfigAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 5 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | 任务ID |
| `taskSort` | 任务排序 |
| `taskType` | 任务类型 |
| `taskCycle` | 任务周期 |
| `eventFlag` | 事件 |
| `exclusiveFlag` | 蚂蚁专属任务 |
| `taskTitle` | 任务名称 |
| `taskTarget` | 任务目标 |
| `taskTargetNum` | 目标数值 |
| `taskReward` | 任务奖励 |
| `taskRewardMethod` | 奖励领取方式 |
| `taskStatus` | 任务状态 |
| `updateBy` | 操作人 |
| `createTime` | 创建时间 |
| `updateTime` | 最近修改时间 |
| `startTime` | 开始时间 |
| `endTime` | 结束时间 |

同页读到的枚举：

- taskRewardMethodMap：`1` 会员手动领取，`2` 系统自动发放

## 69. 配置开关 config-switches

状态：供校正。

- 栏目：运营管理
- 路由：`/config/switches`
- 代码：`apps/admin/src/views/config/switches.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/controlSwitchAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `switchId` | switchId |
| `switchName` | 名称 |
| `switchDescription` | 描述 |
| `status` | 开关 |

## 70. 客服系统 config-selectLivechat

状态：供校正。

- 栏目：客服系统
- 路由：`/config/selectLivechat`
- 代码：`apps/admin/src/views/config/selectLivechat.vue`
- 列表接口：
  - `POST /ar-manager/customerService/getCustomerServiceList`（本阶段按下列生成）
- 同页其它接口 6 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `sortOrder` | 排序 |
| `active` | 状态 |
| `serviceSystemName` | 客服系统 |
| `serviceSystemUrl` | 客服链接 |
| `antCustomer` | 客服类型 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

## 71. APP版本配置 config-nativeConfig

状态：供校正。

- 栏目：运营管理
- 路由：`/config/nativeConfig`
- 代码：`apps/admin/src/views/config/nativeConfig.vue`
- 列表接口：
  - `POST /ar-manager/appVersionInfoAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 3 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | 序号 |
| `appName` | 名称 |
| `appVersion` | 版本号 |
| `description` | 更新文案 |
| `device` | 设备类型 |
| `downloadUrl` | 下载地址 |
| `isForcedUpdate` | 强制更新 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

## 72. 银行字典 config-bankList

状态：供校正。

- 栏目：运营管理
- 路由：`/config/bankList`
- 代码：`apps/admin/src/views/config/bankList.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/bankInfoAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 6 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `iconUrl` | 银行图标 |
| `bankName` | 银行名称 |
| `bankCode` | 银行code |
| `ifscCode` | ifscCode |
| `updateBy` | 操作人 |
| `updateTime` | 更新时间 |
| `status` | 状态 |

同页读到的枚举：

- statusMap：`0` 禁用，`1` 启用

## 73. IM客服 config-imChat

状态：供校正。

- 栏目：运营管理
- 路由：`/config/imChat`
- 代码：`apps/admin/src/views/config/imChat.vue`
- 列表接口：
  - `POST /ar-manager/customerServiceAgents/listPage`（本阶段按下列生成）
- 同页其它接口 4 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `account` | 账号 |
| `status` | 状态 |
| `updateBy` | 操作人 |
| `updateTime` | 更新时间 |

## 74. 买卖奖励配置 config-tradeReward

状态：供校正。

- 栏目：运营管理
- 路由：`/config/tradeReward`
- 代码：`apps/admin/src/views/config/tradeReward.vue`
- 列表接口：
  - `POST /ar-manager/buySellRewardConfigForAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 3 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `rewardType` | 序号 |
| `content` | 活动名称 |
| `memberTypes` | 用户类型 |
| `sourceTypes` | 卖单来源 |
| `merchantRangeCodes` | 商户范围 |
| `amountRangeReward` | 金额区间及奖励比例 |
| `rewardStartTimeDiff` | 活动倒计时 |
| `rewardStartDate` | 日期范围 |
| `rewardStartTimes` | 时间范围 |
| `rewardEndTimes` | 结束时间 |
| `viewStatus` | 活动状态 |
| `createBy` | 操作人 |
| `createTime` | 操作时间 |

同页读到的枚举：

- rateTypeMap：`1` 买入奖励，`2` 卖出奖励
- userTypeMap：`1` 商户内部会员，`2` 商户外部会员，`3` 钱包会员，`4` 蚂蚁会员
- groupIdMap：`0` 未分组，`1` 潜在蚂蚁，`2` 低度活跃，`3` 中度活跃，`4` 高度活跃

## 75. 导出列表 config-exportList

状态：供校正。

- 栏目：运营管理
- 路由：`/config/exportList`
- 代码：`apps/admin/src/views/config/exportList.vue`
- 列表接口：
  - `POST /ar-manager/excelExportLogAdmin/listPage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | 序号 |
| `exportType` | 导出位置 |
| `exportName` | 文件名称 |
| `fileSize` | 文件大小 |
| `exportStatus` | 导出状态 |
| `exportUser` | 操作人 |
| `exportTime` | 操作时间 |
| `exportFinishTime` | 完成时间 |

## 76. 代理IP池 config-proxyPort

状态：供校正。

- 栏目：运营管理
- 路由：`/config/proxyPort`
- 代码：`apps/admin/src/views/config/proxyPort.vue`
- 列表接口：
  - `POST /ar-manager/proxyPortRelationAdmin/getProxyPortRelationList`（本阶段按下列生成）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | 序号 |
| `ip` | 代理IP |
| `port` | 端口 |
| `status` | 状态 |
| `proxyProviders` | 代理提供商 |
| `mountMemberCount` | 挂载成员数量 |
| `mountMemberLimit` | 挂载成员上限 |
| `createTime` | 操作时间 |

## 77. 事件管理 config-eventManager

状态：供校正。

- 栏目：运营管理
- 路由：`/config/eventManager`
- 代码：`apps/admin/src/views/config/eventManager.vue`
- 列表接口：
  - `POST /ar-manager/taskEventConfigAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `eventUniqueFlag` | 事件ID |
| `eventName` | 事件名称 |
| `eventRemark` | 事件说明 |
| `eventStatus` | 状态 |

## 78. 电报群管理 config-telegramManage

状态：供校正。

- 栏目：运营管理
- 路由：`/config/telegramManage`
- 代码：`apps/admin/src/views/config/telegramManage.vue`
- 列表接口：
  - `POST /ar-manager/telegramGroupAdmin/page`（本阶段按下列生成）
- 同页其它接口 5 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `groupName` | 序号 |
| `groupId` | 群Chat ID |
| `groupType` | 群类型 |
| `bindMerchantCodes` | 绑定商户号 |
| `msgTemplateIds` | 消息模板 |
| `status` | 状态 |
| `updateBy` | 操作人 |
| `updateTime` | 操作时间 |
| `updateactionBy` | 操作 |

同页读到的枚举：

- groupTypeMap：`0` 内部群，`1` 商户群

## 79. 奖励卡领取记录 config-getRewardsRecord

状态：供校正。

- 栏目：运营管理
- 路由：`/config/getRewardsRecord`
- 代码：`apps/admin/src/views/config/getRewardsRecord.vue`
- 列表接口：
  - `POST /ar-manager/rewardCardUsageRecordAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 27 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | 序号 |
| `id` | 奖励卡ID |
| `memberId` | 会员ID |
| `merchantName` | 商户名称 |
| `relatedOrderNo` | 关联订单号 |
| `cardName` | 奖励卡名称 |
| `amount` | 奖励卡金额 |
| `kycId` | KYC信息 |
| `createTime` | 领取时间 |
| `useTime` | 使用时间 |
| `expireTime` | 过期时间 |
| `status` | 状态 |
| `expiredFlag` | 是否过期 |
| `frozenFlag` | 是否冻结 |
| `updateBy` | 操作人 |
| `updateTime` | 操作时间 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- rewardsStatusMap：`0` 未激活，`1` 已激活，`2` 使用中，`3` 已使用
- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 80. 自动交易APP版本配置 config-autoAppNativeConfig

状态：供校正。

- 栏目：运营管理
- 路由：`/config/autoAppNativeConfig`
- 代码：`apps/admin/src/views/config/autoAppNativeConfig.vue`
- 列表接口：
  - `POST /ar-manager/appVersionInfoAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 3 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | 序号 |
| `appName` | 名称 |
| `appVersion` | 版本号 |
| `description` | 更新文案 |
| `device` | 设备类型 |
| `bankCode` | 银行编码 |
| `downloadUrl` | 下载地址 |
| `isForcedUpdate` | 强制更新 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

## 81. 域名管理 config-domainManager

状态：供校正。

- 栏目：运营管理
- 路由：`/config/domainManager`
- 代码：`apps/admin/src/views/config/domainManager.vue`
- 列表接口：
  - `POST /ar-manager/domainConfigAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | 序号 |
| `type` | 域名类型 |
| `domain` | 域名 |
| `dndFlag` | DND标识 |
| `remark` | 备注 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

同页读到的枚举：

- dndFlagMap：`0` 禁用，`1` 正常
- domainTypeMap：`1` AR-Wallet主域名，`2` 外部域名，`3` API域名，`4` APK文件下载域名

## 82. 富文本测试 config-testEditor

状态：供校正。

- 栏目：运营管理
- 路由：`/config/testEditor`
- 代码：`apps/admin/src/views/config/testEditor.vue`
- 这个页面没有列表接口。富文本测试页左右两块：左边编辑，右边预览，初始文案是「请编辑活动内容」。

## 83. 申诉订单 order-appeal-index

状态：供校正。侧栏标题是申诉订单（`m4`）。页内页签仍是申诉订单列表、申诉订单配置。

- 栏目：订单管理
- 路由：`/order/appeal/index`
- 代码：`apps/admin/src/views/order/appeal.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycPartnersAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/kycPartnerBuyAppealPaymentAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/kycLinkStatusLogAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/appealOrderAdmin/listpage`（本阶段按下列生成）
  - `POST /ar-manager/appealOrderHandlerAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/collectionOrderAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/matchingOrderAdmin/listpage`（本阶段按下列生成）
  - `POST /ar-manager/kycPartnerRecipientAdmin/listPage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 12 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | 序号 |
| `id` | 申诉ID（与各流水页可点击的 `appealId` 同一字段；查询参数 `appealId` 落到本页筛选项 `id`，精确匹配对应订单。覆盖：买入申诉流水 `AP89001`～`AP89010`、快捷买入/失败 `AP89901`～`AP89908` / `AP89941`～`AP89948`、卖出交易流水 `AP89401`～`AP89410`、UTR/TID 重复 `AP89501`～`AP89504` / `AP89601`～`AP89604`） |
| `mid` | 会员ID |
| `appealType` | 申诉类型 |
| `merchantName` | 商户名称 |
| `withdrawOrderNo` | 卖出订单号 |
| `sellKycId` | 卖出KYC ID |
| `rechargeOrderNo` | 买入订单号 |
| `buyAutoAppealPhone` | 买入方手机号 |
| `isKycSellOrder` | KYC订单 |
| `sellBankCode` | KYC银行 |
| `appealStatus` | 状态 |
| `sourceType` | 订单来源 |
| `updateBy` | 操作人 |
| `displayAppealType` | 申诉分类 |
| `autoAppealType` | 自动申诉类型 |
| `isQuadOrder` | 通道信息 |
| `quadOrderChannel` | 通道名称 |
| `quadOrder` | 通道订单号 |
| `orderAmount` | 订单金额 |
| `actualAmount` | 实际金额 |
| `createTime` | 申诉时间 |
| `finishTime` | 完结时间 |
| `finishType` | 操作结果 |
| `internalRemark` | 内部记录 |
| `handlerUserName` | 当前处理人 |
| `defferentTime` | 处理耗时 |
| `bankCode` | 银行编码 |
| `recipient` | 卖方收款账号 |
| `amount` | 收款金额 |
| `utr` | utr |
| `misTypedUtr` | 疑似UTR填错 |
| `misTypedUtrOrder` | 错填UTR订单号 |
| `payer` | 买方付款账号 |
| `tId` | 交易随机码 |
| `bankTransactionTime` | 交易时间 |
| `sellerOrderId` | 卖出订单号 |
| `isMatch` | 匹配状态 |
| `replenishmentFlag` | 补单标识 |
| `ifscCode` | ifscCode |
| `cardOwnerName` | 持卡人 |
| `bankCardNumber` | 收款银行卡号 |
| `buyerOrderId` | 买入订单号 |
| `memberId` | 会员ID |
| `mobileNumber` | 钱包手机号码 |
| `upiId` | 收款地址UPI ID |
| `collectedStatus` | 状态 |
| `platformOrder` | 撮合订单号 |
| `collectionMemberId` | 买入会员ID |
| `paymentMemberId` | 卖出会员ID |
| `orderSubmitAmount` | 订单金额 |
| `status` | 订单状态 |
| `paymentTime` | 支付时间 |
| `completionTime` | 完成时间 |
| `phoneNumber` | 手机号 |
| `kycLinkStatusChangeType` | 变更状态 |
| `kycLinkStatusChangeReason` | 变更原因 |
| `operationTime` | 操作时间 |
| `restResultsCode` | 银行交互详情 |
| `restResultsBody` | 响应体 |
| `restResultsDesc` | 操作描述 |
| `restResultsSuccess` | 状态 |
| `username` | 用户名 |
| `userId` | 用户ID |
| `totalAssignedCount` | 分配申诉订单量 |
| `todayAssignedCount` | 今日分配 |
| `manualHandledCount` | 手动处理 |
| `systemHandledCount` | 系统处理 |

同页读到的枚举：

- appealStatusMap：`1` 申诉中，`2` 申诉成功，`3` 申诉失败
- finishTypeMap：`1` 系统成功，`2` 系统失败，`3` 人工成功，`4` 人工失败
- isMatchMap：`0` 未匹配，`1` 已匹配，`2` 手动匹配，`3` 金额异常
- statusMap：`1` 分配中，`0` 停止分配

## 84. 卖出订单 order-sale-index

状态：供校正。

- 栏目：订单管理
- 路由：`/order/sale/index`
- 代码：`apps/admin/src/views/order/saleRecord.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/paymentOrderAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/sellOrderAdmin/thirdPaymentOrderQuery`（本阶段按下列生成）
  - `POST /ar-manager/orderInfoAdmin/queryCallbackPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 27 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | 序号 |
| `memberId` | 会员ID |
| `merchantName` | 商户名称 |
| `matchOrder` | 匹配订单号 |
| `platformOrder` | 卖出订单号(子单) |
| `orderStatus` | 订单状态 |
| `amount` | 订单金额 |
| `bonus` | 奖励 |
| `fixedReward` | 固定奖励 |
| `actualAmount` | 实际金额 |
| `utr` | utr |
| `randomCode` | 随机码 |
| `tId` | 交易随机码 |
| `createTime` | 创建时间 |
| `finishTime` | 完结时间 |
| `finishDuration` | 完结时长 |
| `autoSellFlag` | 自动卖出 |
| `sourceType` | 订单来源 |
| `autoFinishFlag` | 订单超时自动失败 |
| `sellOrderType` | 卖出订单类型 |
| `thirdRechargeFlag` | 快捷订单 |
| `merchantMemberId` | 商户会员ID |
| `payType` | 收款类型 |
| `upiId` | upiId |
| `kycId` | kycId |
| `voucher` | 支付凭证 |
| `quadOrderChannel` | 通道名称 |
| `merchantOrder` | 商户订单号 |
| `matchDuration` | 匹配时长 |
| `isQuadOrder` | 通道信息 |
| `quadOrder` | 通道订单号 |
| `completedByKyc` | kyc自动完单 |
| `isKycSellOrder` | KYC订单 |
| `releaseFlag` | 放单状态 |
| `blockedStatus` | 锁定状态 |
| `distributionStatus` | 分配状态 |
| `replenishmentFlag` | 是否已补单 |
| `riskTag` | 风控标识 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |
| `platformOrderNo` | 序号 |
| `thirdOrderNo` | 三方订单号 |
| `thirdOrderStatus` | 状态 |
| `callbackIpAddress` | IP地址 |
| `callbackParams` | 请求参数 |
| `callbackResult` | 响应结果 |
| `callbackTime` | 回调时间 |

同页读到的枚举：

- disMap：`1` C2C，`2` 支付通道
- blockMap：`0` 未锁定，`1` 已锁定
- assignMap：`0` 未分配，`1` 分配成功，`2` 分配失败
- returnStatusMap：`1` 处理中，`2` 成功，`3` 失败，`4` 不存在
- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级
- orderTypeMap：`1` 买入，`2` 卖出
- thirdStatusMap：`1` 处理中，`2` 成功，`3` 失败，`4` 不存在

## 85. 卖出订单 order-saleRecord-index

状态：菜单已弃用。和 `/order/sale/index` 使用同一个页面组件，侧栏只留那一条。页面源码还在。

- 栏目：订单管理
- 路由：`/order/saleRecord/index`
- 代码：`apps/admin/src/views/order/saleRecord.vue`
- 和 `/order/sale/index` 使用同一个页面组件。列、枚举和假数据是同一套。

## 86. 买入订单 order-buyOrder-index

状态：供校正。侧栏和页内大标题都是买入订单（`m7`）。

- 栏目：订单管理
- 路由：`/order/buyOrder/index`
- 代码：`apps/admin/src/views/order/buyRecord.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionOrderAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/orderInfoAdmin/queryCallbackPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 26 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | 序号 |
| `memberId` | 会员ID |
| `merchantName` | 商户名称 |
| `platformOrder` | 买入订单号 |
| `orderStatus` | 订单状态 |
| `amount` | 订单金额 |
| `bonus` | 奖励 |
| `fixedReward` | 固定奖励 |
| `actualAmount` | 实际金额 |
| `merchantOrder` | 关联商户订单号 |
| `randomAmount` | 随机优惠 |
| `utr` | utr |
| `randomCode` | 随机码 |
| `tId` | 交易随机码 |
| `createTime` | 创建时间 |
| `finishTime` | 完结时间 |
| `finishDuration` | 完结时长 |
| `autoSellFlag` | 自动卖出 |
| `repackageAppBuyFlag` | 自动买入 |
| `sourceType` | 订单来源 |
| `isQuadOrder` | 通道信息 |
| `supportAmountFinishFlag` | 金额完单 |
| `quadOrderChannel` | 通道名称 |
| `quadOrder` | 通道订单号 |
| `wakeUpFlag` | 是否唤醒 |
| `wakeUpBankCode` | 唤醒银行 |
| `autoFinishFlag` | 订单超时自动失败 |
| `buyOrderType` | 买入订单类型 |
| `thirdRechargeFlag` | 快捷订单 |
| `merchantMemberId` | 商户会员ID |
| `completedByKyc` | kyc自动完单 |
| `replenishmentFlag` | 是否已补单 |
| `riskTag` | 风控标识 |
| `payType` | 收款类型 |
| `upiId` | upiId |
| `kycId` | kycId |
| `voucher` | 支付凭证 |
| `releaseFlag` | 放单状态 |
| `isKycSellOrder` | KYC订单 |
| `cancellationReason` | 取消原因 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |
| `platformOrderNo` | 序号 |
| `thirdOrderNo` | 三方订单号 |
| `thirdOrderStatus` | 状态 |
| `callbackIpAddress` | IP地址 |
| `callbackParams` | 请求参数 |
| `callbackResult` | 响应结果 |
| `callbackTime` | 回调时间 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级
- orderTypeMap：`1` 买入，`2` 卖出
- thirdStatusMap：`1` 处理中，`2` 成功，`3` 失败，`4` 不存在

## 87. 买入订单记录 order-buyRecord-index

状态：菜单已弃用。和 `/order/buyOrder/index` 使用同一个页面组件，侧栏只留那一条。页面源码还在。

- 栏目：订单管理
- 路由：`/order/buyRecord/index`
- 代码：`apps/admin/src/views/order/buyRecord.vue`
- 和 `/order/buyOrder/index` 使用同一个页面组件。列、枚举和假数据是同一套。

## 88. USDT买入订单 order-usdtBuyOrder-index

状态：供校正。

- 栏目：订单管理
- 路由：`/order/usdtBuyOrder/index`
- 代码：`apps/admin/src/views/order/usdtBuyOrder.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/usdtBuyOrderAdmin/listpage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 27 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | 序号 |
| `memberId` | 会员ID |
| `memberAccount` | 会员账号 |
| `memberType` | 会员类型 |
| `platformOrder` | USDT买入订单号 |
| `networkProtocol` | 网络协议 |
| `usdtAddr` | 收款地址 |
| `usdtNum` | USDT数量 |
| `arbNum` | 买入ARB数量 |
| `usdtBuyReward` | 买入奖励 |
| `status` | 订单状态。本页取值：`3` 等待转账，`4` 确认中，`7` 已完成，`13` 订单过期，`10` 买入失败。假数据按这 5 个轮换，避免显示成数字。 |
| `createTime` | 订单时间 |
| `callbackStatus` | 回调状态 |
| `callbackTime` | 回调时间 |
| `updateBy` | 操作人 |
| `updateTime` | 操作时间 |
| `thirdPartyResponseMessage` | 三方返回描述 |
| `remark` | 备注 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- orderStatusMap：`3` 等待转账，`4` 确认中，`7` 已完成，`13` 订单过期，`10` 买入失败
- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 89. 母订单列表 order-matchingPool-index

状态：供校正。侧栏和页内标题是母订单列表（`m10`）。原先菜单名是撮合订单池。

- 栏目：订单管理
- 路由：`/order/matchingPool/index`
- 代码：`apps/admin/src/views/order/matchingPool.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/matchPoolAdmin/listpage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 27 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | index |
| `createTime` | 创建时间 |
| `matchOrder` | 订单号 |
| `memberId` | 卖家ID |
| `orderStatus` | orderStatus |
| `amount` | 订单金额 |
| `associationOrderNo` | 拆解关联订单号 |
| `merchantPaymentOrderNo` | 拆解关联订单号 |
| `sourceOrderType` | 订单来源 |
| `isQuadOrder` | 通道信息 |
| `autoSellFlag` | 自动卖出 |
| `handleByExchangeOrder` | 交易所订单 |
| `quadOrder` | 通道订单号 |
| `rewardCardSellFlag` | 奖励卡订单 |
| `inProgressAmount` | 交易中金额/单数 |
| `failedSubOrderAmount` | 失败金额/单数 |
| `successSubOrderCount` | successSubOrderCount |
| `successSubOrderAmount` | successSubOrderAmount |
| `returnedSubOrderAmount` | returnedSubOrderAmount |
| `remainingAmount` | 剩余金额 |
| `canceledSubOrderAmount` | 次数/金额 |
| `orderMatchCount` | orderMatchCount |
| `sellStrategy` | sellStrategy |
| `completeDuration` | 交易时长 |
| `completeTime` | 完结时间 |
| `sellOrderType` | 卖出订单类型 |
| `upiId` | 收款信息 |
| `matchTimeoutReason` | 最新超时原因 |
| `matchTimeoutCount` | 超时次数 |
| `matchTimeoutTime` | 最新超时时间 |
| `orderFinishType` | 完结触发 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |
| `timeoutType` | 撮合超时原因 |

同页读到的枚举：

- matchTimeoutReasonMap：`1` KYC断连，`2` 收款账户异常，`3` 达到超时时限，`4` 收款地址-自动校正，`5` 收款地址-人工操作，`6` 买方发起买入失败申诉单，`7` 后台人工手动触-发失败订单
- orderFinishTypeMap：`1` 卖方主动取消，`2` 系统自动完结，`3` 人工失败放款单，`4` 系统自动退回
- statusMap：`1` 撮合中，`2` 撮合超时，`7` 成功，`8` 失败，`20` 超时待完结，`21` 部分成功
- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级
- timeoutTypeMap：`1` KYC断连，`2` KYC断连-人工禁用UPI，`3` 收款账户异常，`4` UPI ID被校正，`5` 达到超时时限，`6` 买方发起买入失败申诉单，`7` 后台人工手动触-发失败订单

## 90. 撮合 order-assemble-index

状态：供校正。侧栏和页内大标题都是撮合（`m11`）。原先菜单名是撮合列表。

- 栏目：订单管理
- 路由：`/order/assemble/index`
- 代码：`apps/admin/src/views/order/assemble.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycPartnersAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/kycPartnerBuyAppealPaymentAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/kycLinkStatusLogAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/kycPartnersAdmin/kycPullResultLogPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionOrderAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/matchingOrderAdmin/listpage`（本阶段按下列生成）
  - `POST /ar-manager/kycPartnerRecipientAdmin/listPage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 16 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | 序号 |
| `platformOrder` | 订单号 |
| `collectionMemberId` | 会员ID |
| `collectionPlatformOrder` | 买入订单号 |
| `paymentMemberId` | 卖出会员ID |
| `paymentPlatformOrder` | 卖出订单号 |
| `payType` | 收款类型 |
| `orderSubmitAmount` | 金额 |
| `randomCode` | 随机码 |
| `orderActualAmount` | 实际金额 |
| `upiId` | 收款信息 |
| `orderType` | 订单类型 |
| `quickOrder` | 快捷订单 |
| `autoSellFlag` | 自动卖出 |
| `repackageAppBuyFlag` | 假App买入 |
| `appealFlag` | 申诉 |
| `utr` | utr |
| `waterFlag` | 是否有流水 |
| `paymentCounterDuration` | 收银台停留时长 |
| `appealStatus` | 申诉状态 |
| `kycId` | kycId |
| `kycAutoCompletionStatus` | kyc交易 |
| `autoFinishFlag` | 订单超时自动失败 |
| `supportAmountFinishFlag` | 金额完单 |
| `status` | 状态 |
| `completedBaseType` | KYC完成类型 |
| `completedByKyc` | KYC订单 |
| `isKycSellOrder` | KYC订单 |
| `auditSeconds` | 审核时间 |
| `sourceType` | 订单来源 |
| `isQuadOrder` | 通道信息 |
| `quadOrderChannel` | 通道名称 |
| `quadOrder` | 通道订单号 |
| `rewardCardSellFlag` | 奖励卡订单 |
| `wakeUpFlag` | 是否唤醒 |
| `wakeUpBankCode` | 唤醒银行 |
| `completeDuration` | 完单时长 |
| `riskTag` | 风控标识 |
| `replenishmentFlag` | 补单标识 |
| `replenishmentCompletionTime` | replenishmentCompletionTime |
| `upiVerificationStatus` | upiVerificationStatus |
| `utrOccupiedFlag` | utrOccupiedFlag |
| `freezeFlag` | 冻结/解冻情况 |
| `createTime` | 时间 |
| `updateBy` | 操作人 |
| `paymentTime` | 支付时间 |
| `completionTime` | 结束时间 |
| `bankCode` | 银行编码 |
| `phoneNumber` | 手机号 |
| `kycLinkStatusChangeType` | 变更状态 |
| `kycLinkStatusChangeReason` | 变更原因 |
| `operationTime` | 操作时间 |
| `restResultsCode` | 银行交互详情 |
| `restResultsBody` | 响应体 |
| `restResultsDesc` | 操作描述 |
| `restResultsSuccess` | 状态 |
| `recipient` | 卖方收款账号 |
| `amount` | 收款金额 |
| `misTypedUtr` | 疑似UTR填错 |
| `misTypedUtrOrder` | 错填UTR订单号 |
| `payer` | 买方付款账号 |
| `tId` | 交易随机码 |
| `bankTransactionTime` | 交易时间 |
| `sellerOrderId` | 卖出订单号 |
| `isMatch` | 匹配状态 |
| `ifscCode` | ifscCode |
| `cardOwnerName` | 持卡人 |
| `bankCardNumber` | 收款银行卡号 |
| `buyerOrderId` | 买入订单号 |
| `memberId` | 会员ID |
| `mobileNumber` | 钱包手机号码 |
| `collectedStatus` | 状态 |
| `changeType` | 拉取来源 |

同页读到的枚举：

- appealTypeMap：`1` 申诉中，`2` 申诉成功，`3` 申诉失败
- displayAppealTypeMap：`1` 未到账，`2` 金额错误，`3` 确认超时，`4` 买入自动申诉，`5` 卖出自动申诉，`6` 买入失败申诉，`7` KYC验证码发送失败
- backendOperationTypeMap：`0` 其它，`1` 已支付，`2` 未支付，`3` 补单，`4` 失败订单申诉成功，`5` 失败订单申诉失败，`6` 确认放款，`7` 申诉成功，`8` 申诉失败
- orderAutoFailTypeMap：`1` 卖出申诉拉取N次流水完单，`2` 未达最低上分金额完单，`3` 超时拉取N次流水完单，`4` 买入申诉拉取N次流水完单，`5` 快捷UPI/BANK拉取N次流水完单，`6` 快捷UPI/BANK断连到时完单，`9` 卖家恶意占用UTR完单，`10` 超时N分钟失败冻结，`11` pending流水失败申诉中订单并冻结，`12` 买入快捷BANK订单收款地址不符
- freezeFlagMap：`0` 未冻结，`1` 已冻结，`2` 用户解冻，`3` 系统解冻
- freezeReasonMap：`1` 自动失败冻结，`3` 失败申诉pending流水冻结，`4` 常规金额完单冻结，`5` UTR占用冻结，`6` 收款地址不符，`7` moneyView流水无法解密
- freezeModeMap：`1` 账户余额，`2` 放款订单
- unfreezeModeMap：`1` 人工，`2` 系统

## 91. 申诉订单列表 order-appeal

状态：菜单已弃用。和 `/order/appeal/index` 使用同一个页面组件，侧栏只留那一条。页面源码还在。

- 栏目：订单管理
- 路由：`/order/appeal`
- 代码：`apps/admin/src/views/order/appeal.vue`
- 和 `/order/appeal/index` 使用同一个页面组件。列、枚举和假数据是同一套。

## 92. 退款订单 order-refundOrder

状态：供校正。

- 栏目：订单管理
- 路由：`/order/refundOrder`
- 代码：`apps/admin/src/views/order/refundOrder.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/cashBackOrderAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 25 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `id` | id |
| `memberId` | 会员ID |
| `merchantCode` | 商户号 |
| `merchantMemberId` | 商户会员ID |
| `merchantName` | 商户名称 |
| `merchantOrder` | 商户订单号 |
| `platformOrder` | 平台订单号 |
| `orderStatus` | 退款状态 |
| `amount` | 订单金额 |
| `failedReason` | 失败原因 |
| `failedTime` | 失败时间 |
| `createBy` | 操作人 |
| `createTime` | 创建时间 |
| `remark` | 备注 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- orderStatusMap：`1` 退回中，`2` 退回成功，`3` 退回失败
- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 93. 卖出交易流水 order-kycRecords

状态：供校正。

- 栏目：订单管理
- 路由：`/order/kycRecords`
- 代码：`apps/admin/src/views/order/kycRecords.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/kycPartnerRecipientAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 26 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `kycId` | kycId |
| `memberId` | 卖出会员ID |
| `appealId` | 申诉ID（与 §38 / §83 同一套 `AP89401`～`AP89410`；可点跳申诉订单列表） |
| `bankCode` | 银行编码 |
| `recipient` | 卖方收款账号 |
| `amount` | 收款金额 |
| `utr` | utr |
| `payer` | 买方付款账号 |
| `randomCode` | 交易随机码 |
| `tId` | 交易随机码 |
| `isPhonepeWakeUp` | isPhonepeWakeUp |
| `bankTransactionTime` | 交易时间 |
| `createTime` | 拉取时间 |
| `sellerOrderId` | 卖出订单号 |
| `isMatch` | 匹配状态 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- orderStatusMap：`1` 退回中，`2` 退回成功，`3` 退回失败
- isMatchMap：`0` 未匹配，`1` 已匹配，`2` 手动匹配，`3` 金额异常
- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 94. USDT提现订单 order-usdtSellOrder

状态：供校正。

- 栏目：订单管理
- 路由：`/order/usdtSellOrder`
- 代码：`apps/admin/src/views/order/usdtSellOrder.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/usdtBuyOrderAdmin/listpage`（本阶段按下列生成）
  - `POST /ar-manager/usdtSellOrderAdmin/listUsdtSellOrders`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 29 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | 序号 |
| `memberId` | 会员ID |
| `memberAccount` | 会员账号 |
| `memberType` | 会员类型 |
| `platformOrder` | USDT卖出订单号 |
| `usdtAddr` | USDT地址 |
| `usdtActualNum` | USDT数量 |
| `arbActualNum` | 卖出ARB数量 |
| `status` | 订单状态 |
| `thirdTradeOrderStatus` | 三方交易状态 |
| `callbackStatus` | 回调状态 |
| `callbackTime` | 回调时间 |
| `operator` | 操作人 |
| `operationTime` | 操作时间 |
| `operatorIp` | 操作IP |
| `createTime` | 订单时间 |
| `completionTime` | 完成时间 |
| `thirdPartyResponseMessage` | 三方返回描述 |
| `remark` | 描述 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- orderStatusMap：`3` 等待转账，`4` 确认中，`7` 已完成，`13` 订单过期，`10` 买入失败
- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 95. 欠费订单 order-arrearsOrder

状态：供校正。

- 栏目：订单管理
- 路由：`/order/arrearsOrder`
- 代码：`apps/admin/src/views/order/arrearsOrder.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberArrearsRecordAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 汇总：`POST /ar-manager/memberArrearsRecordAdmin/totalMemberDebt` 返回 `totalOwedAmount`（待扣取总欠费）、`positiveOwedUserCount`（欠费中用户数），按当前列表假数据汇总。
- 同页其它接口：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 假数据按截图对齐：买方/卖方账号、ID、IP 成对；状态走 `matchlistStatus` 文案；金额带小数；操作时间落在印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `chOrderNo` / `buyOrderNo` / `sellOrderNo` | 订单号列：撮合 / 买方 / 卖方 |
| `buyerAccount` / `memberAccount` | 会员账号：买方 / 卖方 |
| `buyerId` / `memberId` | 会员ID：买方 / 卖方 |
| `buyOrderIp` / `sellOrderIp` | 订单IP：买方 / 卖方。卖方可有 `0.0.0.0`、`auto-sell:{会员ID}` |
| `orderAmount` | 订单金额 |
| `amount` | 实欠金额 |
| `utr` | UTR |
| `matchingOrderStatus` | 状态。本页展示 `matchlistStatus`：`8` 已取消，`12` 买入失败/订单失效，`13` 支付超时等。假数据按这套取值，不显示数字 |
| `isKycSell` | KYC订单。`1` 是，`0` 否 |
| `sourceType` | 订单来源。`0` 内部订单，并覆盖快捷提现、交易所等 |
| `operationBy` | 操作人 |
| `operationTime` | 操作时间 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `createTime` | 账变时间 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 96. 人工卖出订单 order-sellOut-index

状态：供校正。

- 栏目：订单管理
- 路由：`/order/sellOut/index`
- 代码：`apps/admin/src/views/order/sellOut.vue`
- 列表接口：
  - `POST /ar-manager/generateQuickUpiOrBankAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/generateQuickUpiOrBankAdmin/listImportBatchPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/generateQuickUpiOrBankAdmin/listImportOrderRecordPage`（本阶段按下列生成）
- 同页其它接口 5 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `orderNoInfo` | 订单号 |
| `receiverInfo` | 收款信息 |
| `amount` | 订单金额 |
| `paymentVoucherRewardAmount` | 奖励 |
| `utr` | utr |
| `callbackTradeStatus` | 订单状态 |
| `requestIp` | 请求IP |
| `retryNo` | 提交次数 |
| `operatorName` | 操作人 |
| `submitTime` | 提交时间 |
| `rewardIssued` | 是否发放奖励 |
| `paymentVoucherProcessStatus` | 审核状态 |
| `remark` | 备注 |
| `callbackTime` | 回调时间 |
| `merchantMemberId` | 商户会员ID |
| `merchantCode` | 商户号 |
| `importBatchNo` | 导入批次号 |
| `batchStatus` | 批次状态 |
| `fileName` | 导入文件名 |
| `totalCount` | 总行数 |
| `pendingCount` | 待处理行数 |
| `successCount` | 成功行数 |
| `failedCount` | 失败行数 |
| `importTime` | 导入时间 |
| `finishTime` | 完成时间 |
| `merchantTradeNo` | 商户订单号 |
| `processStatus` | 处理状态 |
| `processTime` | 处理时间 |
| `processMsg` | 处理结果 |

同页读到的枚举：

- channelMap：`1` 银行卡，`3` UPI
- callbackTradeStatusMap：`1` 支付中，`2` 已完成，`3` 代付失败
- callbackTradeStatusTagColorMap：`1` blue，`2` green，`3` red，`4` red，`5` orange
- paymentVoucherProcessStatusMap：`1` 未上传，`2` 待审核，`3` 已审核
- channelMap：`1` 银行卡，`3` UPI

## 97. 挂单列表 mandate-matchingOrderPool

状态：供校正。

- 栏目：委托管理
- 路由：`/mandate/matchingOrderPool`
- 代码：`apps/admin/src/views/mandate/matchingOrderPool.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/mandateAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 25 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `createTime` | 序号 |
| `memberId` | 卖出会员ID |
| `platformOrder` | 订单号 |
| `sourceOrderType` | 订单来源 |
| `sellOrderType` | 卖出订单类型 |
| `splitTimes` | 已拆单数 |
| `maxSplitTimes` | 最大拆单数 |
| `splitAmountList` | 预拆单金额列表 |
| `amount` | 卖出金额 |
| `minimumAmount` | 最小金额 |
| `maximumAmount` | 剩余金额 |
| `isKycOrder` | KYC订单 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 98. 推送金额记录 mandate-pushAmountRecord

状态：供校正。

- 栏目：委托管理
- 路由：`/mandate/pushAmountRecord`
- 代码：`apps/admin/src/views/mandate/pushAmountRecord.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/recommendedAmountRecordAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `splitAmountList` | 序号 |
| `pushCount` | 推送数量 |
| `pushTime` | 推送时间 |
| `createTime` | 推送时间 |

## 99. 买入热度记录 mandate-hotBuyRecord

状态：供校正。

- 栏目：委托管理
- 路由：`/mandate/hotBuyRecord`
- 代码：`apps/admin/src/views/mandate/hotBuyRecord.vue`
- 列表接口：
  - `POST /ar-manager/hotBuyAmountAdmin/listPage`（本阶段按下列生成）
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `dateHour00` | 序号 |
| `dateHour01` | dateHour01 |
| `dateHour02` | dateHour02 |
| `dateHour03` | dateHour03 |
| `dateHour04` | dateHour04 |
| `dateHour05` | dateHour05 |
| `dateHour06` | dateHour06 |
| `dateHour07` | dateHour07 |
| `dateHour08` | dateHour08 |
| `dateHour09` | dateHour09 |
| `dateHour10` | dateHour10 |
| `dateHour11` | dateHour11 |
| `dateHour12` | dateHour12 |
| `dateHour13` | dateHour13 |
| `dateHour14` | dateHour14 |
| `dateHour15` | dateHour15 |
| `dateHour16` | dateHour16 |
| `dateHour17` | dateHour17 |
| `dateHour18` | dateHour18 |
| `dateHour19` | dateHour19 |
| `dateHour20` | dateHour20 |
| `dateHour21` | dateHour21 |
| `dateHour22` | dateHour22 |
| `dateHour23` | dateHour23 |

## 100. 充值失败记录 mandate-topUpFailure

状态：供校正。

- 栏目：委托管理
- 路由：`/mandate/topUpFailure`
- 代码：`apps/admin/src/views/mandate/topUpFailure.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/rechargeFailureForAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 24 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `merchantName` | merchantName |
| `merchantMemberId` | merchantMemberId |
| `merchantOrderNo` | merchantOrderNo |
| `failureAmount` | failureAmount |
| `sourceType` | sourceType |
| `createTime` | createTime |
| `pendingOrderCount` | pendingOrderCount |
| `recommendedAmounts` | recommendedAmounts |
| `failureType` | failureType |
| `requestIp` | requestIp |
| `errorMessage` | errorMessage |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberId` | 会员ID |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- sourceTypeMap：`1` 内部商户UPI充值，`2` 外部商户UPI充值
- failureTypeMap：`1` 充值异常，`2` 撮合失败
- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 101. 智能拆单挂单列表 mandate-splitOrder

状态：供校正。

- 栏目：委托管理
- 路由：`/mandate/splitOrder`
- 代码：`apps/admin/src/views/mandate/splitOrder.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/maxBenefitOrderAdmin/unMatchList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 25 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | index |
| `createTime` | 创建时间 |
| `memberId` | 卖出会员ID |
| `memberType` | 会员类型 |
| `platformOrder` | 订单号 |
| `rangeASplitTimes` | 金额范围 |
| `rangeBSplitTimes` | 金额范围 |
| `rangeCSplitTimes` | 金额范围 |
| `rangeDSplitTimes` | 金额范围 |
| `rangeESplitTimes` | 金额范围 |
| `alreadySplitTimes` | 已拆单数 |
| `amount` | 卖出金额 |
| `maximumAmount` | 剩余金额 |
| `minimumAmount` | 最小金额 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 102. 智能拆单失败记录 mandate-splitFailOrder

状态：供校正。

- 栏目：委托管理
- 路由：`/mandate/splitFailOrder`
- 代码：`apps/admin/src/views/mandate/splitFailOrder.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/maxBenefitOrderAdmin/matchFailedList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 25 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `index` | index |
| `merchantName` | 商户名称 |
| `merchantMemberId` | 商户会员ID |
| `memberType` | 会员类型 |
| `merchantOrderNo` | 商户订单号 |
| `orderAmount` | 充值失败金额 |
| `createTime` | 充值时间 |
| `orderCountOfRange` | orderCountOfRange |
| `orderCountOfAll` | orderCountOfAll |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberId` | 会员ID |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 103. 买入报表 report-moonOf

状态：供校正。

- 栏目：报表中心
- 路由：`/report/moonOf`
- 代码：`apps/admin/src/views/report/moonOf.vue`
- 列表接口：
  - `POST /ar-manager/buySellReport/queryBuyReportPage`（本阶段按下列生成）
  - `POST /ar-manager/buySellReport/queryBuyMonthReportPage`（本阶段按下列生成）
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `reportDate` | 日期 |
| `buySuccessAmount` | 买入订单金额 |
| `buyDoneCount` | 下单笔数 |
| `buySuccessCount` | 成功笔数 |
| `buySuccessRate` | 成功率 |
| `actualMoney` | 实际金额 |
| `buyAppealDoneCount` | 申诉订单笔数 |
| `buyCancelCount` | 取消订单笔数 |
| `buyAgeSuccessDuration` | 平均完成时长 |
| `buySuccessBonus` | 买入奖励 |

## 104. 卖出报表 report-moonPay

状态：供校正。

- 栏目：报表中心
- 路由：`/report/moonPay`
- 代码：`apps/admin/src/views/report/moonPay.vue`
- 列表接口：
  - `POST /ar-manager/buySellReport/querySellReportPage`（本阶段按下列生成）
  - `POST /ar-manager/buySellReport/querySellMonthReportPage`（本阶段按下列生成）
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `reportDate` | 日期 |
| `sellSuccessAmount` | 卖出订单金额 |
| `sellDoneCount` | 下单笔数 |
| `sellSuccessCount` | 成功笔数 |
| `sellSuccessRate` | 卖出成功率 |
| `sellAppealDoneCount` | 申诉订单笔数 |
| `sellCancelCount` | 取消订单笔数 |
| `sellAgeSuccessDuration` | 平均完成时长 |
| `sellSuccessBonus` | 卖出奖励 |

## 105. 商户报表 report-merchant

状态：供校正。

- 栏目：报表中心
- 路由：`/report/merchant`
- 代码：`apps/admin/src/views/report/merchant.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/buySellReport/queryBuyReportPage`（本阶段按下列生成）
  - `POST /ar-manager/buySellReport/queryBuyMonthReportPage`（本阶段按下列生成）
  - `POST /ar-manager/biMerchantDaily/query`（本阶段按下列生成）
  - `POST /ar-manager/biMerchantMonth/query`（本阶段按下列生成）
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `dateTime` | 日期 |
| `merchantName` | 商户 |
| `merchantType` | 商户类型 |
| `activationNewUser` | 新增激活用户 |
| `payMoney` | 代收金额 |
| `payOrderNum` | 代收下单笔数 |
| `paySuccessOrderNum` | 代收成功笔数 |
| `paySuccessRate` | 代收成功率 |
| `withdrawMoney` | 代付金额 |
| `withdrawOrderNum` | 代付下单笔数 |
| `withdrawSuccessOrderNum` | 代付成功笔数 |
| `withdrawSuccessRate` | 代付成功率 |
| `difference` | 收付差额 |
| `totalFee` | 代收代付费用 |

同页读到的枚举：

- merchantTypeMap：`1` 内部商户，`2` 外部商户

## 106. 对账报表 report-reconciliation

状态：供校正。

- 栏目：报表中心
- 路由：`/report/reconciliation`
- 代码：`apps/admin/src/views/report/reconciliation.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/biMerchantReconciliation/query`（本阶段按下列生成）
  - `POST /ar-manager/biMemberReconciliation/query`（本阶段按下列生成）
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `dateTime` | 对账时间 |
| `merchantName` | 商户名称 |
| `merchantBalance` | 商户余额 |
| `payMoney` | 代收(充值) |
| `withdrawMoney` | 代付(提现) |
| `payFee` | 代收费用 |
| `withdrawFee` | 代付费用 |
| `merchantUp` | 商户上分 |
| `merchantDownPoint` | 商户下分 |
| `merchantDown` | 商户下发 |
| `merchantDiff` | 商户账目偏差 |
| `memberBalance` | 会员余额 |
| `usdtBuyMoney` | USDT买入 |
| `buyAmount` | 买入 |
| `sellAmount` | 卖出 |
| `refundCancellation` | 取消退回 |
| `amountError` | 金额错误 |
| `buyReward` | 卖出奖励 |
| `sellReward` | 买入奖励 |
| `taskReward` | 任务奖励 |
| `memberUp` | 会员上分 |
| `memberDown` | 会员下分 |
| `memberDiff` | 会员账目偏差 |

同页读到的枚举：

- merchantTypeMap：`1` 内部商户，`2` 外部商户

## 107. 三方报表 report-fourReport

状态：供校正。

- 栏目：报表中心
- 路由：`/report/fourReport`
- 代码：`apps/admin/src/views/report/fourReport.vue`
- 列表接口：
  - `POST /ar-manager/buySellReport/selectQuadReportPage`（本阶段按下列生成）
  - `POST /ar-manager/buySellReport/selectQuadMonthReportPage`（本阶段按下列生成）
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `reportDate` | 日期 |
| `sellSuccessAmount` | 卖出成功金额 |
| `sellSuccessCount` | 卖出成功笔数 |
| `sellSuccessRate` | 卖出成功率 |
| `sellAgeSuccessDuration` | 卖出平均完成时长 |
| `buySuccessAmount` | 买入成功金额 |
| `buySuccessCount` | 买入成功笔数 |
| `buySuccessRate` | 买入成功率 |
| `buyTimeoutCount` | 支付超时订单数 |
| `buyCancelCount` | 取消支付订单数 |
| `buyAgeSuccessDuration` | 买入平均完成时长 |

## 108. 任务领取记录 task-detail

状态：供校正。

- 栏目：任务管理
- 路由：`/task/detail`
- 代码：`apps/admin/src/views/task/task-detail.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/taskCollectionRecord/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `memberId` | 会员ID |
| `merchantName` | 商户名称 |
| `orderNo` | 平台订单号 |
| `taskName` | 任务名称 |
| `exclusiveFlag` | 蚂蚁专属任务 |
| `eventFlag` | 事件。取值是任务事件键：`real_name_auth`、`buy_guide`、`sell_guide`、`bind_fake_app_and_real_name_auth`、`success_buy`、`success_sell`、`net_buy_sell_amount`、`invitation_member`、`invitation_and_success_trade`、`buy_transaction_volume`、`usdt_recharge`。页面用这些键取文案。 |
| `taskType` | 任务类型 |
| `taskCycle` | 任务周期。`1` 一次性，`2` 周期性-每日，`3` 周期性-自定义。 |
| `rewardAmount` | rewardAmount |
| `completionTime` | 完成时间 |
| `createTime` | 领取时间 |

## 109. 会员黑名单 wind-memberBlacklist

状态：供校正。

- 栏目：风控管理
- 路由：`/wind/memberBlacklist`
- 代码：`apps/admin/src/views/wind/memberBlacklist.vue`
- 列表接口：
  - `POST /ar-manager/memberGroupAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberBlack/listPage`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `memberId` | 序号 |
| `merchantName` | 商户名称 |
| `merchantMemberId` | 商户会员ID |
| `memberAccount` | 会员账号 |
| `memberGroup` | 会员分组 |
| `memberType` | 会员类型 |
| `realName` | 实名 |
| `status` | 状态 |
| `buyStatus` | 买入状态 |
| `sellStatus` | 卖出状态 |
| `operator` | 操作人 |
| `opTime` | 操作时间 |
| `remark` | 备注 |

同页读到的枚举：

- statueMap：`0` 禁用，`1` 启用

## 110. 封控用户列表 wind-riskControlUser

状态：供校正。

- 栏目：风控管理
- 路由：`/wind/riskControlUser`
- 代码：`apps/admin/src/views/wind/riskControlUser.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/riskUserHitRecordAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 25 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `buyerId` | 序号 |
| `merchantName` | 所属商户 |
| `buyStatus` | 买入状态 |
| `onlineStatus` | 在线状态 |
| `firstHitType` | No.1命中 |
| `firstHitTime` | No.1命中时间 |
| `secondHitType` | No.2命中 |
| `secondHitTime` | No.2命中时间 |
| `thirdHitType` | No.3命中 |
| `thirdHitTime` | No.3命中时间 |
| `hitCount` | 命中次数 |
| `punishment` | 处罚 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `createTime` | 账变时间 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberId` | 会员ID |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 111. UPI ID风控日志 wind-riskUpiControlLog

状态：供校正。

- 栏目：风控管理
- 路由：`/wind/riskUpiControlLog`
- 代码：`apps/admin/src/views/wind/riskUpiControlLog.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/upiRiskControlLogAdmin/listPage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 24 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `memberId` | 序号 |
| `upiId` | upiId |
| `bankCode` | 银行编码 |
| `riskControlRuleNo` | 风控编码 |
| `punishRuleNo` | 风控内容 |
| `riskControlTime` | 风控时间 |
| `countOfC2cOrder` | 关联超时母单数 |
| `remainingAmountOfC2cOrder` | 关联剩余金额 |
| `banDuration` | 禁用时限 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `createTime` | 账变时间 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 112. 用户解禁日志 wind-riskUpiUnbanLog

状态：供校正。

- 栏目：风控管理
- 路由：`/wind/riskUpiUnbanLog`
- 代码：`apps/admin/src/views/wind/riskUpiUnbanLog.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 25 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `sellMemberId` | 序号 |
| `upiId` | upiId |
| `merchantCode` | 来源商户 |
| `bankCode` | 银行编码 |
| `unbanAmount` | 验证转款金额 |
| `createTime` | 发起时间 |
| `unbanTime` | 解禁时间 |
| `status` | 是否解禁成功 |
| `remark` | 备注 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `memberId` | 会员ID |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 113. 异常断连日志 wind-abnDisconnectLogs

状态：供校正。

- 栏目：风控管理
- 路由：`/wind/abnDisconnectLogs`
- 代码：`apps/admin/src/views/wind/abnDisconnectLogs.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/disConnectMonitorAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 24 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `memberId` | 序号 |
| `level` | 用户等级 |
| `memberType` | 会员类型 |
| `buyOrderNo` | 订单号 |
| `orderAmount` | 订单金额 |
| `bankCode` | 银行编码 |
| `kycId` | KYC信息 |
| `lastConnectTime` | KYC连接时间 |
| `keepAliveTime` | KYC连接时长 |
| `createTime` | 记录时间 |
| `changeReason` | 断连原因 |
| `remark` | 备注 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 114. 银行卡黑名单 wind-bankCardBlack

状态：供校正。

- 栏目：风控管理
- 路由：`/wind/bankCardBlack`
- 代码：`apps/admin/src/views/wind/bankCardBlack.vue`
- 列表接口：
  - `POST /ar-manager/bankCardBlacklistAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `bankName` | 银行名称 |
| `cardOwnerName` | 持卡人 |
| `bankCardNumber` | 银行卡号 |
| `ifsc` | ifsc |
| `createTime` | 创建时间 |

## 115. 自动开启卖出日志 wind-autoSellEnableLog

状态：供校正。

- 栏目：风控管理
- 路由：`/wind/autoSellEnableLog`
- 代码：`apps/admin/src/views/wind/autoSellEnableLog.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/systemAutoSellLogAdmin/listPage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 24 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `memberId` | 会员ID |
| `memberType` | 会员类型 |
| `phoneNumber` | 手机号码 |
| `upiId` | upiId |
| `bankCode` | 银行编码 |
| `appCreateTime` | 创建时间 |
| `openedAt` | 自动开启时间 |
| `closedAt` | 关闭时间 |
| `openBalance` | 开启时余额 |
| `createdOrderAmount` | 累计金额 |
| `createdOrderCount` | 累计笔数 |
| `succeededOrderAmount` | 成功金额 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `createTime` | 账变时间 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 116. 用户等级配置 userlevel-levelConfig

状态：供校正。

- 栏目：用户等级
- 路由：`/userlevel/levelConfig`
- 代码：`apps/admin/src/views/userlevel/levelConfig.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/memberLevelConfig/listPage`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `level` | 等级 |
| `applicableGroup` | 适用会员类型 |
| `sellNum` | 卖出次数 |
| `buyNum` | 买入次数 |
| `amount` | 净买卖金额 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

## 117. 用户等级统计 userlevel-levelLog

状态：供校正。

- 栏目：用户等级
- 路由：`/userlevel/levelLog`
- 代码：`apps/admin/src/views/userlevel/levelLog.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/memberInfoAdmin/relationMemberList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/merchantInfoAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/relationMemberList`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `level` | 等级 |
| `num` | 人数 |
| `id` | 会员ID |
| `merchantName` | 商户名称 |
| `totalBalance` | 余额 |
| `memberType` | 会员类型 |
| `totalBuyCount` | 买入次数 |
| `totalBuyAmount` | 买入金额 |
| `totalSellCount` | 卖出次数 |
| `totalSellAmount` | 卖出金额 |
| `remark` | 备注 |

## 118. 信用分配置 userlevel-creditConfig

状态：供校正。

- 栏目：用户等级
- 路由：`/userlevel/creditConfig`
- 代码：`apps/admin/src/views/userlevel/creditConfig.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/creditScoreConfigAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `eventId` | eventId |
| `tradeType` | 类型 |
| `triggerEvent` | 触发事件 |
| `eventType` | 事件结果 |
| `score` | 分数变化 |
| `updateBy` | 操作人 |
| `updateTime` | 操作时间 |

## 119. 信用分记录 userlevel-creditLog

状态：供校正。

- 栏目：用户等级
- 路由：`/userlevel/creditLog`
- 代码：`apps/admin/src/views/userlevel/creditLog.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/kycBankAdmin/getBankCodeList`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/memberInfoAdmin/relationList`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastBuyRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/lastSellRecord`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/collectionInfoAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberAccounthangeAdmin/listpage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/creditScoreLogsAdmin/listPage`（前面栏目已经有假数据，本页沿用）
  - `POST /ar-manager/api/v1/memberInfoAdmin/memberLevelChangeList`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 24 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `createTime` | 序号 |
| `id` | 用户ID |
| `tradeType` | 类型 |
| `changeScore` | 分数变化 |
| `beforeScore` | 分数变化前 |
| `afterScore` | 分数变化后 |
| `merchantOrder` | 商户订单号 |
| `orderNo` | 平台订单号 |
| `changeType` | 交易类型 |
| `fundType` | 资金属性 |
| `payType` | 收款类型 |
| `beforeChange` | 账变前金额 |
| `amountChange` | 账变金额 |
| `afterChange` | 账变后金额 |
| `updateBy` | 操作人 |
| `remark` | 备注 |
| `memberId` | 会员ID |
| `memberAccount` | 会员账号 |
| `agentLevel` | 代理层级 |
| `directSubordinateCount` | 直属下级数量 |
| `allSubordinateCount` | 所有下级数量 |
| `buyAmount` | 买入成功金额 |
| `buyCount` | 买入成功笔数 |
| `buyCommissionAMount` | 买入返佣 |
| `sellAmount` | 卖出成功金额 |
| `sellCount` | 卖出成功笔数 |
| `sellCommissionAMount` | 卖出返佣 |

同页读到的枚举：

- scoreStateMap：`1` 加，`2` 减
- relMap：`1` 上上级，`2` 上级，`3` 下级，`4` 下下级

## 120. 福利配置 userlevel-welfareConfig

状态：供校正。

- 栏目：用户等级
- 路由：`/userlevel/welfareConfig`
- 代码：`apps/admin/src/views/userlevel/welfareConfig.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/memberLevelWelfareConfig/listPage`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `level` | 等级 |
| `singleAmountLimit` | 单次限额 |
| `selfSelectionBuy` | 自选买入 |
| `dailyTasks` | 每日任务 |
| `weeklyTasks` | 每周任务 |
| `monthlyTasks` | 每月任务 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

同页读到的枚举：

- statusMap：`0` 关闭，`1` 开启

## 121. 支付通道 payment-manager

状态：供校正。

- 栏目：通道管理
- 路由：`/payment/manager`
- 代码：`apps/admin/src/views/payment/manager.vue`
- 列表接口：
  - `POST /ar-manager/payConfigAdmin/listConfigPage`（本阶段按下列生成）
  - `POST /ar-manager/paytypeinfo/list`（本阶段按下列生成）
  - `POST /ar-manager/buySellReport/queryBuyReportPage`（本阶段按下列生成）
  - `POST /ar-manager/buySellReport/queryBuyMonthReportPage`（本阶段按下列生成）
- 同页其它接口 6 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `thirdName` | 通道 |
| `balance` | 通道余额 |
| `payTypeInfo` | 代收区间 |
| `paymentTypeInfo` | 代付区间 |
| `status` | 状态 |
| `id` | 序号 |
| `channelCode` | 三方通道编码 |
| `thirdCode` | 三方编码 |
| `weight` | 权重 |
| `maximumAmount` | 单笔金额区间 |
| `dailyLimitAmount` | 日限额/笔数 |
| `singleOrderCost` | 单笔手续费 |
| `rate` | 费率 |
| `updateBy` | 操作人 |
| `updateTime` | 操作时间 |
| `reportDate` | 序号 |
| `collectionMoney` | 代收金额 |
| `collectionCount` | 代收笔数 |
| `paymentMoney` | 代付金额 |
| `paymentCount` | 代付笔数 |

同页读到的枚举：

- statusMap：`0` 关闭，`1` 开启
- linkTypeMap：`1` 唤醒APP，`2` 跳转H5
- statusMap：`0` 关闭，`1` 开启
- linkTypeMap：`1` 唤醒APP，`2` 跳转H5

## 122. 三方通道 payment-channelManager

状态：供校正。

- 栏目：通道管理
- 路由：`/payment/channelManager`
- 代码：`apps/admin/src/views/payment/channelManager.vue`
- 列表接口：
  - `POST /ar-manager/paytypeinfo/list`（本阶段按下列生成）
  - `POST /ar-manager/thirdPayInfoAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 8 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `thirdName` | 通道 |
| `merchantCode` | 商户号 |
| `innerInrBalance` | 通道余额 |
| `payTypeInfo` | 代收区间 |
| `paymentTypeInfo` | 代付区间 |
| `supportNoUtr` | 是否支持无UTR代收 |
| `dndFlag` | 状态 |
| `id` | 序号 |
| `channelCode` | 三方通道编码 |
| `thirdCode` | 三方编码 |
| `weight` | 权重 |
| `receiveMethod` | 代收类型 |
| `currencyType` | 币种 |
| `singleAmountMax` | 单笔金额区间 |
| `dailyAmountLimit` | 日限额/笔数 |
| `fixedCost` | 单笔手续费 |
| `singleRate` | 费率 |
| `updateBy` | 操作人 |
| `updateTime` | 操作时间 |
| `statDate` | 日期 |
| `totalActualAmount` | 代收金额 |
| `totalOrderCount` | 代收笔数 |
| `totalFee` | 代收费用 |

同页读到的枚举：

- statusMap：`0` 关闭，`1` 开启
- linkTypeMap：`1` 唤醒APP，`2` 跳转H5
- statusMap：`0` 关闭，`1` 开启
- linkTypeMap：`1` 唤醒APP，`2` 跳转H5

## 123. 通道账变 payment-channelChanges

状态：供校正。

- 栏目：通道管理
- 路由：`/payment/channelChanges`
- 代码：`apps/admin/src/views/payment/channelChanges.vue`
- 列表接口：
  - `POST /ar-manager/channelAccountChangeAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `thirdOrderNo` | 通道订单号 |
| `platformOrderNo` | 平台订单号 |
| `changeTime` | 账变时间 |
| `thirdCode` | 通道名称 |
| `changeType` | 类型 |
| `receiveType` | 支付类型 |
| `currencyType` | 币种 |
| `beforeChange` | 账变前余额 |
| `changeAmount` | 账变金额 |
| `afterChange` | 账变后额度 |
| `remark` | 备注 |
| `operateBy` | 操作人 |

## 124. 通道代收 payment-channelCollection

状态：供校正。

- 栏目：通道管理
- 路由：`/payment/channelCollection`
- 代码：`apps/admin/src/views/payment/channelCollection.vue`
- 列表接口：
  - `POST /ar-manager/thirdPayInfoAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/channelCollectionOrderAdmin/listPage`（本阶段按下列生成）
  - `POST /ar-manager/thirdPayCallbackLogAdmin/listPage`（前面栏目已经有假数据，本页沿用）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `createTime` | 订单时间 |
| `thirdCode` | 通道编码 |
| `buyerId` | 会员ID |
| `platformOrderNo` | 订单号 |
| `thirdOrderNo` | 通道订单号 |
| `orderAmount` | 订单金额 |
| `actualAmount` | 实际金额 |
| `buyerKycAmount` | 流水金额 |
| `callbackAmount` | 回调金额 |
| `orderStatus` | 订单状态 |
| `orderFlag` | 订单标识 |
| `cost` | cost |
| `callbackTime` | callbackTime |
| `callbackStatus` | callbackStatus |
| `accountChangeTime` | accountChangeTime |
| `validCallback` | 是否有效回调 |
| `handleResult` | 处理结果 |
| `handleDuration` | 处理耗时 |
| `returnContent` | 返回内容 |
| `callbackContent` | 回调内容 |

同页读到的枚举：

- orderFlagMap：`1` 通过回调成功，`2` 拉取到买方UTR自动成功，`3` 人工操作成功，`4` 确认超时时自动查询成功，`5` 支付超时失败，`6` 买家取消，`7` 确认超时自动取消，`8` 人工操作失败，`9` 低于KYC最低金额失败
- validCallbackMap：`0` 无效回调，`1` 有效回调
- handleResultMap：`1` 回调内容为空，`2` 回调方IP地址不在白名单内，`3` 回调签名错误，`4` 回调订单不存在，`5` 回调参数校验失败，`6` 回调订单状态为处理中，`7` 回调订单状态变更为成功，`8` 回调订单状态变更为失败，`9` 回调订单状态未变更，`10` 回调订单状态已是成功，`11` 回调订单状态已经完结，`12` 回调处理异常，`13` 回调参数解密失败，`14` 非成功状态不处理，`15` 回调订单金额低于KYC最低上分金额，`16` 超出允许回调的时间范围

## 125. 邮件模板 emailManager-emailTemp

状态：供校正。

- 栏目：推送管理
- 路由：`/emailManager/emailTemp`
- 代码：`apps/admin/src/views/emailManager/emailTemp.vue`
- 列表接口：
  - `POST /ar-manager/emailTemplateAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `templateFlag` | 模板标识 |
| `emailSubject` | 邮件主题 |
| `templateContent` | 模板内容 |
| `remark` | 模板描述 |
| `enableFlag` | 状态 |
| `createBy` | 添加人 |
| `createTime` | 添加时间 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

## 126. APP推送模板 emailManager-appPushTemp

状态：供校正。

- 栏目：推送管理
- 路由：`/emailManager/appPushTemp`
- 代码：`apps/admin/src/views/emailManager/appPushTemp.vue`
- 列表接口：
  - `POST /ar-manager/appPushTemplateAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `title` | 模板标题 |
| `content` | 模板内容 |
| `remark` | 模板描述 |
| `status` | 状态 |
| `createBy` | 添加人 |
| `createTime` | 添加时间 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

## 127. 邮件模板 emailManager-emailGroup

状态：供校正。

- 栏目：推送管理
- 路由：`/emailManager/emailGroup`
- 代码：`apps/admin/src/views/emailManager/emailGroup.vue`
- 列表接口：
  - `POST /ar-manager/emailTemplateAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `templateFlag` | 模板标识 |
| `emailSubject` | 邮件主题 |
| `templateContent` | 模板内容 |
| `remark` | 模板描述 |
| `enableFlag` | 状态 |
| `createBy` | 添加人 |
| `createTime` | 添加时间 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

## 128. 邮箱发件管理 emailManager-emailSenderMgmt

状态：供校正。

- 栏目：推送管理
- 路由：`/emailManager/emailSenderMgmt`
- 代码：`apps/admin/src/views/emailManager/emailSenderMgmt.vue`
- 列表接口：
  - `POST /ar-manager/mailAccountConfigAdmin/page`（本阶段按下列生成）
- 同页其它接口 4 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `accountName` | 序号 |
| `platformType` | 平台账号类型 |
| `accountType` | 邮箱类型 |
| `fromAlias` | 邮箱别名 |
| `dailyQuota` | 每日配额 |
| `maxEmailPerSecond` | 每秒发送量 |
| `addressType` | 发件地址类型 |
| `status` | 状态 |
| `weight` | 邮箱权重 |
| `replyToAddress` | 启用回信地址 |
| `retryAddress` | 回信地址 |
| `retryAliasName` | 回信地址别名 |
| `clickTrace` | 启用数据跟踪 |
| `tagName` | 邮件标签 |
| `unSubscribeFilterLevel` | 过滤级别 |
| `unSubscribeLinkType` | 退订链接类型 |

同页读到的枚举：

- platformTypeMap：`1` 阿里云，`2` AWS
- accountTypeMap：`0` 验证码，`1` 通知型，`2` 群发型
- addressTypeMap：`0` 随机发信地址，`1` 使用账号地址，`2` 使用全球域名
- memberNumMap：`1` 今日登陆过会员，`3` 3天内登陆过会员，`7` 7天内登陆过会员，`30` 30天内登陆过会员，`0` 所有会员

## 129. 推送模板 emailManager-pushTemp

状态：供校正。

- 栏目：推送管理
- 路由：`/emailManager/pushTemp`
- 代码：`apps/admin/src/views/emailManager/pushTemp.vue`
- 列表接口：
  - `POST /ar-manager/pushTemplateAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `title` | 模板标题 |
| `eventId` | 所属事件 |
| `type` | 发送类型 |
| `templateType` | 发送方式 |
| `remark` | 模板描述 |
| `status` | 状态 |
| `content` | 模板内容 |
| `createBy` | 添加人 |
| `createTime` | 添加时间 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

同页读到的枚举：

- tempTypeMap：`1` 单发，`2` 群发
- templateTypeMap：`1` 邮件，`2` APP，`3` H5，`4` WathsApp

## 130. 推送方式管理 emailManager-pushMgmt

状态：供校正。

- 栏目：推送管理
- 路由：`/emailManager/pushMgmt`
- 代码：`apps/admin/src/views/emailManager/pushMgmt.vue`
- 列表接口：
  - `POST /ar-manager/pushMannerAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 2 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `deviceType` | 设备类型 |
| `pushType` | 推送类型 |
| `deleted` | 删除标志 |
| `status` | 状态 |
| `createBy` | 添加人 |
| `createTime` | 添加时间 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

同页读到的枚举：

- pushTypeMap：`1` 邮箱，`2` APP推送，`3` H5，`4` WathsApp
- deviceTypeMap：`1` 安卓，`2` IOS，`3` H5，`4` 套壳APP

## 131. app推送渠道管理 emailManager-appPushChangmt

状态：供校正。

- 栏目：推送管理
- 路由：`/emailManager/appPushChangmt`
- 代码：`apps/admin/src/views/emailManager/appPushChangmt.vue`
- 列表接口：
  - `POST /ar-manager/appPushChannelAdmin/listPage`（本阶段按下列生成）
- 同页其它接口 1 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `pushChannelId` | 渠道ID |
| `pushChannelCode` | 渠道代码 |
| `status` | 状态 |
| `createBy` | 添加人 |
| `createTime` | 添加时间 |
| `updateBy` | 操作人 |
| `updateTime` | 最后更新时间 |

## 132. 工单列表 ticket-ticketList

状态：供校正。

- 栏目：工单列表
- 路由：`/ticket/ticketList`
- 代码：`apps/admin/src/views/ticket/ticketList.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/workOrderRecord/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/workOrderDetail/getOrderRecordDetail`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/workOrderPermission/listPage`（本阶段按下列生成）
- 同页其它接口 5 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `workOrderNo` | 工单号 |
| `merchantName` | 商户名称 |
| `memberId` | 会员ID |
| `registerPhoneNumber` | 注册手机号 |
| `workOrderName` | 工单名称 |
| `loginLimit` | 登录限制 |
| `currentProcessStatus` | 工单状态 |
| `currentBusinessStatus` | 业务状态 |
| `orderAmount` | 订单金额 |
| `workOrderTypeName` | 工单类型 |
| `appealHistory` | 平台内部申诉历史 |
| `relatedOrderNo` | 平台内部订单号 |
| `workOrderHandleCount` | 工单处理历史次数 |
| `submitTime` | 提交时间 |
| `lastSubmitTime` | 最后提交时间 |
| `lastOperationTime` | 最后操作时间 |
| `currentHandler` | 当前处理人 |
| `internalRejectReason` | 驳回原因 |
| `internalCompletionRemark` | 处理完成备注 |
| `processingDuration` | 工单处理耗时 |

同页读到的枚举：

- ticketStatusMap：`1` 待处理，`2` 处理中，`3` 已驳回，`4` 复审，`5` 处理完成
- ticketStatusColorMap：`1` blue，`2` green，`3` red，`4` orange，`5` gray
- currentBusinessStatusMap：`1` 用户提交工单，`2` 锁定工单，`3` 驳回工单，`4` 用户更新资料，`5` 转移工单，`6` 处理完成
- appealHistoryMap：`1` 申诉成功，`2` 申诉失败

## 133. 工单配置 ticket-ticketConfig

状态：供校正。

- 栏目：工单列表
- 路由：`/ticket/ticketConfig`
- 代码：`apps/admin/src/views/ticket/ticketConfig.vue`
- 列表接口：
  - `POST /ar-manager/api/v1/workOrderConfig/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/workOrderPermission/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/workOrderConfigOperationHistory/listPage`（本阶段按下列生成）
  - `POST /ar-manager/api/v1/workOrderTypeConfig/list`（本阶段按下列生成）
- 同页其它接口 8 个：保存、详情、导出中断这类操作返回成功；能对上同一资源的新增和修改会写进当前内存列表，刷新后恢复。
- 按钮打开的子弹窗不单列字段小节。能对上的列表接口返回数据，其余操作返回成功。
- 枚举有几项就至少有几行能覆盖到。会员编号沿用 `10086001`～`10086010`。银行编码沿用 10 个印度 UPI 应用。带当天时间的筛选取印度时区当天。

| 字段 | 列名 |
| --- | --- |
| `workOrderName` | 序号 |
| `materialItems` | 资料项 |
| `workOrderTypeName` | 工单类型 |
| `status` | 状态 |
| `orderRelation` | 订单关联 |
| `loginLimit` | 登录限制 |
| `updateBy` | 最后操作人 |
| `updateTime` | 最后修改时间 |
| `remark` | 备注 |
| `content` | 操作内容 |
| `operationType` | 操作类型 |
| `createBy` | 操作人 |
| `createTime` | 操作时间 |
| `operatorName` | 用户名 |

同页读到的枚举：

- operationTypeMap：`0` 创建，`1` 修改，`3` 删除

## 134. 字段理解文档

状态：字段理解已确认。本页只展示这份存档，不接业务接口。

- 栏目：后台字段理解
- 路由：`/fieldNotes/doc`
- 代码：`apps/admin/src/views/prototype/fieldNotes.vue`

页面按存档小节逐页列出。点开一行能看到该页拆出的字段。校正状态跟着各节开头的「状态」走。

| 字段 | 列标题 | 当前理解 | 备注 |
| --- | --- | --- | --- |
| no | 序号 | 存档小节编号，和本文件目录一致。 | |
| group | 栏目 | 侧栏栏目。会员详情没有独立菜单，仍归在会员管理。 | |
| title | 页面 | 存档小节标题。 | |
| route | 路由 | 菜单路径。没有独立菜单的显示「无独立菜单」。 | |
| status | 校正状态 | 已确认，或待校正。菜单已从侧栏拿掉的会再标「菜单已弃用」。 | |
| fieldCount | 字段数 | 这一节拆出来的字段行数。 | |
| understoodCount | 已写理解 | 字段理解有文字的行数。只记了列名、还没写含义的不算。 | |
| part | 小节 | 字段所在的小标题，例如当前展示列、搜索项、正文列。 | |
| field | 字段 | 展开后的字段名。正文里只写了中文列名时，这一格可以为空。 | |
| label | 列标题 | 页面上的列名或文案。 | |
| meaning | 字段理解 | 存档里写下的含义。空着表示这一列还只有列名。 | 页面上显示「未写」。 |
| note | 备注 | 存档备注。 | |

## 135. 列表底部合计

状态：本页合计、总计已按当前列表金额加总。这一节只说明这两行怎么算，不单列每个页面的列。

- 本页合计：当前这一页里，底部那一行要统计的金额列相加。
- 总计：当前筛选结果的全部行相加，不限这一页。
- 筛选结果不足一页时，两行数字相同。
- 原来已经能算出数的页面保持原样：会员列表、账变记录（菜单和会员详情里的页签）、返佣记录、会员 APP 信息、UPI 买卖交易统计、KYC 短信发送成功日志。
- 订单、商户、报表、通道、奖励卡领取记录、人工卖出订单记录，以及自动交易买入/卖出流水，底部原来有字、数字是空的。现在按上面两条加总。
- 三方报表总计里，买入成功笔数原先接到了卖出成功笔数上，已改回买入成功笔数。
- 商户列表原先被商户下拉占用，列表本身没有余额行。分页查询现在有商户行，余额两行按商户余额、会员 ARB 余额加总。一次取很多条的商户下拉仍是名称列表。


