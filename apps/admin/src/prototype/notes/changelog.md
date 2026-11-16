# 原型改动日志

衔接提示词：用户发送 **`新会话继续执行项目`** 时，新会话先读：

1. 本文件 `changelog.md`
2. 字段汇总 `apps/admin/src/prototype/notes/field-notes.md`（按目录只精读当前相关小节）

按 `.cursor/rules/prototype-session.mdc` 做状态反馈，再等具体方向。字段含义以 `field-notes.md` 为准，不要沿用聊天旧说法，也不要再拆成每页一个字段文件。

本文件合并了多个会话：原型底座和导航、会员列表、会员详情「会员信息」、会员详情「账变记录」、字段说明合并、会员详情「收款信息」、会员收款列表。导航剩余名称先停，用户明确要求后再改。

## 一直有效的约束

- 仓库根目录启动：`pnpm --filter admin dev:prototype`，地址 http://localhost:4173/
- 登录账号和密码都是 `prototype`。不走接口，不走谷歌验证。
- 开关是 `VITE_PROTOTYPE`。只在 prototype 模式生效。`pnpm --filter admin dev` 仍走真实接口，不要改那条路径。
- 原型请求在浏览器内拦截，默认返回 `code` 为 `"1"` 的空列表或操作成功。WebSocket 和线上 BI 不连接。
- 左侧菜单由 `routeCatalog.json` 的 `title` 和 `menus.ts` 的分组翻译键生成。`title` 必须用页面标题同一个 i18n 键。改完菜单要刷新页面。
- 用户指出菜单名不对时，只改对应路径的 `title`，或 `menus.ts` 里的分组键，并且只能用项目里已有的键。不新造翻译，不改页面业务代码。
- 这 3 项没有单独翻译键，导航保留原文：富文本测试、KYC短信发送成功日志、银行接口数据分析。彩票工单四页用已有键：通道列表 `n1274`、待拉取 `n1273`、交易流水 `n1272`、异常流水 `n1275`。
- 不补其他页面的假数据，除非用户明确要求。

### 用户关注点（会话对齐）

- 原型改动后期不关联正式环境代码；技术实现（路由、拦截、挂载方式等）用户不关心，可按跑通需要调整。
- 查页面、字段、枚举、按钮、交互现状可以；**改业务交互逻辑必须先征得同意**。
- 假数据：卖出状态、完单类型、订单状态等已约定枚举保持与代码/field-notes 一致；商户名、会员 ID 等展示字段随意。
- 菜单排序与线上不一致无所谓。
- 成功/失败不要求真分支；只关心页面提示文案、弹框、报错文案。

## 会话一：原型底座和导航

目标是本地高保真原型，不连接后台。

改动：

- `apps/admin/package.json`：增加 `dev:prototype`
- `apps/admin/.env.prototype`：打开原型开关，清空远程接口和 WebSocket 地址
- `apps/admin/src/prototype/env.ts`：原型开关
- `apps/admin/src/prototype/mock.ts`：拦截请求。当时统一返回空列表或操作成功
- `apps/admin/src/prototype/menus.ts`、`routeCatalog.json`：按路由生成本地菜单。菜单名改成页面标题的翻译键，侧边栏、页签和页面标题一致
- `apps/admin/src/hooks/useLogin.hook.ts`：本地登录，跳过谷歌验证
- `apps/admin/src/hooks/userInfo.hook.ts`：用本地菜单，不请求用户菜单接口
- `apps/admin/src/hooks/usePermission.hook.ts`：原型里按钮权限全部放开
- `apps/admin/src/hooks/useSocket.hook.ts`：不连 WebSocket
- `apps/admin/src/api/request.ts`、`export.ts`：请求不发到远程
- `apps/admin/src/utils/publicData.ts`：不嵌入线上 BI

导航已对过一次。用户决定剩余名称以后再改，本会话没有再动菜单。

## 会话二：会员列表

页面是会员管理 / 会员列表，路由 `/member/list`，标题键 `m17`。字段说明现已并入 `notes/field-notes.md` §1。

改动：

- 当时写了 `member-list.md`（现已并入 `field-notes.md` §1）：34 个当前展示列、搜索项、已注释列、底部合计，以及后来对齐的业务含义
- `apps/admin/src/prototype/fixtures/memberList.ts`、`memberList.types.ts`：16 条会员假数据，4 个分组。支持当前搜索项、排序和分页。底部合计按当前页和筛选结果计算
- `apps/admin/src/prototype/mock.ts`：会员列表和分组列表返回上述数据。买入、卖出的单条和批量状态接口会改内存数据

已对齐、后续会话必须沿用的含义：

- ARB、CPB 都是账户余额，用来标记资金来源。项目内部买入的代币记为 ARB。商户提现到钱包项目后记为 CPB。余额增减留到账变再补。
- 账户余额(USDT-ARB) 是 USDT 折成 ARB 的金额。
- 退款金额的场景很多，冻结金额只是其中一种。做到退款业务再补逻辑。
- 欠费金额来自自动化完成订单出错后的人工补单，形成卖家会员的欠费订单和欠费金额，并有自动扣费。做到欠费业务再补。
- 净买卖金额有定制公式，剔除充值和提现，只体现钱包内部的买卖。公式还没给出。假数据暂时用买入金额减卖出金额占位。

买入、卖出开关：

- 页面原有弹框没改。禁用要选原因；从关闭点开启会先确认「未到自动解禁时间，是否要解除禁用？」。
- 禁用提交成功后，对应开关关闭，账号状态改为禁用。另一边开关不动。
- 启用确认成功后，对应开关打开，账号状态改为启用。
- 状态只保存在当前页面内存。刷新后回到初始 16 条。
- 分组接口被会员列表用来显示分组名，所以分组管理页也会看到这 4 个分组，金额列是空的。

已在浏览器验证：16 条能显示；按会员 ID `10086003` 搜索只剩 1 条；会员 `10086001` 的买入、卖出都能禁用和启用，账号状态跟着变。

## 会话三：会员详情 · 会员信息

页面从会员列表点击会员 ID 打开，组件是 `memberDetail.vue` 的「会员信息」Tab。字段说明现已并入 `notes/field-notes.md` §2。账变记录、收款信息本会话不做。

改动：

- 当时写了 `member-info.md`（现已并入 `field-notes.md` §2）：会员信息字段、附属列表、操作项
- `apps/admin/src/prototype/fixtures/memberList.ts`、`memberList.types.ts`：详情专有字段挂在同一份会员内存上；冻结金额按 ARB/CPB 可用余额比例从列表合计拆开
- `apps/admin/src/prototype/fixtures/memberDetail.ts`：getInfo、最近买卖/登录、等级变化，以及重置密码、备注、充值、提现、冻结、解冻
- `apps/admin/src/prototype/mock.ts`：挂上上述接口

已对齐：

- 列表已有字段直接复用，不另起一套会员数据。
- 充值、提现、冻结、解冻、改备注会改内存；详情刷新后能看到，列表同一会员也会变。刷新浏览器后回到初始 16 条。
- 冻结 / 解冻按页面当前入参，只动 CPB 可用和 CPB 冻结。NPC 会员页面本身不显示这些按钮。
- 重置登录密码页面写死 `aa123456`，重置支付密码写死 `1234`。
- `memberLevelChangeList` 走 form-urlencoded，原型 `readQuery` 已兼容这种请求体。

## 会话四：会员详情 · 账变记录

页面是会员详情弹窗的「账变记录」Tab，不是独立菜单 `/member/changeReocde`。字段说明现已并入 `notes/field-notes.md` §3。

改动：

- 当时写了 `member-change-record.md`（现已并入 `field-notes.md` §3）：列、搜索项、changeType/fundType/payType、底部合计；文首标明页面归属
- `apps/admin/src/prototype/fixtures/memberChangeRecord.ts`：按会员生成账变假数据，支持筛选和分页合计
- `apps/admin/src/prototype/fixtures/memberDetail.ts`：充值、提现、冻结、解冻成功后追加账变流水
- `apps/admin/src/prototype/mock.ts`：挂上 `memberAccounthangeAdmin/listpage`

已对齐：

- 字段理解已在会话十一确认。详见 `field-notes.md` §3。
- 假数据按该会员买卖/充值/欠费等概况生成；无交易会员可为空列表。
- 会员信息里的人工上分/下分/冻结/解冻会写入对应 changeType 流水。刷新浏览器后回到初始数据。

## 会话五：字段说明合并为一份

改动：

- 新建 `apps/admin/src/prototype/notes/field-notes.md`：按页面分节汇总字段理解，文首有目录
- 删除 `member-list.md`、`member-info.md`、`member-change-record.md`
- 更新 `.cursor/rules/prototype-session.mdc`：必读改为 changelog + field-notes

约定：以后新页面只在 `field-notes.md` 追加一节，不再新建每页一个字段文件。

## 会话六：会员详情 · 收款信息

页面是会员详情弹窗的「收款信息」Tab。字段说明见 `notes/field-notes.md` §4。

改动：

- `apps/admin/src/prototype/notes/field-notes.md`：新增 §4（KYC/USDT 字段、接口、按钮、假数据规则）
- `apps/admin/src/prototype/fixtures/memberPayInfo.ts`：按会员种子 KYC / USDT；支持添加、编辑、删除、启停
- `apps/admin/src/prototype/mock.ts`：挂上 listPage、银行下拉、add/update KYC、USDT CRUD、updateStatus、delete

已对齐：

- KYC 卡片 `type=3`；USDT 由前端标 `type=700` 混进同一列表。
- 「添加 KYC 收款信息」「添加 USDT 收款信息」走页面原有弹窗与校验；成功后列表出现新记录；刷新浏览器后消失。
- 银行卡 type=1 入口页面已注释，本会话不做。
- 连接日志弹窗未接假数据。

## 会话七：会员收款列表

页面是会员管理 / 会员收款列表，路由 `/member/paymentV2`。字段说明见 `notes/field-notes.md` §5。

改动：

- `apps/admin/src/prototype/notes/field-notes.md`：新增 §5；§4 的 `mobileNumber` 按用户校正为银行账号手机号
- `apps/admin/src/prototype/fixtures/memberPayInfo.ts`：KYC 行补齐列表字段；全表列表筛选分页；银行账号手机号与会员手机号区分
- `apps/admin/src/prototype/fixtures/memberList.ts`：导出 `listMembers` 供铺全表
- `apps/admin/src/prototype/mock.ts`：挂上 `collectionInfoAdmin/update`（列表页编辑）

已对齐：

- `mobileNumber`（钱包手机号码）是添加收款方式时填的银行账号手机号，不一定等于会员账号。
- 与详情「收款信息」共用同一份 KYC 内存。
- 旧页 `/member/payment`、连接/操作日志弹窗本会话不做。

## 会话七补充：收款列表「查看」详情

改动：

- `memberPayInfo.ts` / `mock.ts`：挂上 `collectionInfoAdmin/getInfo`，按收款 `id` 返回 `data: [row]`
- `paymentV2.vue`：恢复操作列「查看」按钮（原先注释），便于打开收款详情假数据
- `field-notes.md` §5：补充查看弹窗说明

## 会话七补充：弃用旧会员收款列表菜单

核对：`/member/payment`（`payment.vue`，version 1）与 `/member/paymentV2`（`paymentV2.vue`，version 2）都是「会员收款列表」（`m18`）。V2 字段与操作更全，旧页为精简版。

改动：从 `routeCatalog.json` 去掉 `/member/payment`，原型侧栏只保留 `/member/paymentV2`。页面源码与路由映射仍保留，不删文件。刷新后菜单生效。

## 会话七补充：连接日志 / 操作日志假数据

改动：

- `apps/admin/src/prototype/fixtures/memberPaymentLogs.ts`：按 bankCode+phone / upiId 种子连接日志与操作日志
- `mock.ts`：挂上 `kycLinkStatusLogAdmin/listPage`、`collectionInfoAdmin/operationLog`、`kycPullResultLogPage`
- `field-notes.md` §5：补充连接日志、操作日志字段

补充：连接日志按 `kycLinkStatusChangeReasonMap` 全部 24 个原因各造 1 条；「行为」拉取流水按 connectionUuid 造 2～3 条（changeType 16/17/18）。

## 会话七补充：会员管理菜单排序

按用户指定顺序调整 `routeCatalog.json` 中 `/member/*` 条目：会员列表 → 会员收款列表 → 会员USDT收款列表 → 账变记录 → 蚂蚁层级列表 → 返佣记录 → 实名认证 → 分组管理 → 会员短信日志 → 会员操作日志 → 会员登录日志 → 手动操作记录 → 会员解绑记录。标题键未改，刷新后侧栏生效。

## 会话七补充：交接前笔记校正

- `field-notes.md` §4.4 / §4.6 / §5.4：去掉「连接/操作日志未做」的过时表述，改为指向 §5.6～§5.7 已完成说明。

## 会话八：五页假数据（分组 / 实名 / 返佣 / USDT收款 / 独立账变）

目标：会员管理下 5 个页面接列表假数据与按钮交互；枚举字段按取值覆盖造数；嵌套会员详情沿用既有数据；列表字段理解写入 `field-notes` 供用户校正。

改动：

- `field-notes.md`：新增 §6 分组管理、§7 实名认证、§8 返佣记录、§9 会员USDT收款列表、§10 账变记录（独立菜单）；目录同步；§3.6 指向 §10
- `memberList.ts`：分组补阈值/权限/会员数；`authList` / 新增 / 编辑 / 删除
- `memberRealName.ts`：实名列表；状态 1/2/3 覆盖；查看/编辑/清除
- `memberCommission.ts`：返佣列表；`commissionType` 1～4，并覆盖 agentLevel、tradeType
- `memberPayInfo.ts`：USDT 全表列表；`deleted` 0/1；TRC20 34 位；查看/编辑
- `memberChangeRecord.ts`：独立菜单全表按 `changeType` 全枚举各 1 条（当天时间）；商户下拉；详情 Tab 逻辑保留
- `mock.ts`：挂上上述接口 + `merchantInfoAdmin/listpage`

已对齐：

- 实名状态以 i18n 为准：`1` 已认证 / `2` 未认证 / `3` 手动认证；账变独立页默认当日筛选故种子用当天时间。
- 这五页字段理解已在会话十一确认。

## 会话八补充：实名交互校正 + 分组全量可编辑删除

用户反馈后调整：

- 实名：`1` 已认证必须有完整资料；`2` 未认证无姓名证件等；未认证可编辑（表单空）→ 提交成 `3` 手动认证并展示输入；「解除」本会话隐藏行，刷新恢复；`field-notes` §7 状态映射按 `c18/c19/c100` 纠正
- `name.vue`：未认证打开编辑时表单置空
- 分组：去掉 `id>2` 限制，每个分组都可编辑/删除；删除接口不再拦截 id≤2；`field-notes` §6 同步

## 会话八补充：实名编辑图片上传（原型）

原因：`NewUpload` 走 OSS 预签名 + 直传，原型未接导致图片挂不上、保存按钮一直灰。

改动：`NewUpload` 在 `VITE_PROTOTYPE` 下用 FileReader 生成本地 DataURL；`mock.ts` 兜底 `oss/generatePresignedUrl`；`field-notes` §7.2 注明。

## 会话九：五页日志（短信 / 操作 / 登录 / 手动操作 / 解绑）

目标：会员管理下这 5 个列表接假数据；枚举取值各至少覆盖一遍；搜索、重置可用；会员 ID 能打开已有会员详情。字段理解写入 `field-notes` 供用户校正。

改动：

- `field-notes.md`：新增 §11 会员短信日志、§12 会员操作日志、§13 会员登录日志、§14 手动操作记录、§15 会员解绑记录；目录同步
- `fixtures/memberAuditLogs.ts`：五页列表、筛选、分页；种子时间用印度时区当天，适配页面默认时间
- `mock.ts`：挂上 `userVerificationCodes/listPage`、`memberOperationLogs/listPage`、`memberLoginLogs/listPage`、`memberManualLog/listPage`、`unBindingMerchantRecordAdmin/listPage`

已对齐：

- 短信 `codeType` 为 `SMS` / `EMAIL`，登录客户端为 `APP` / `H5`。
- 操作日志 `moduleCode` 1～41 与页面 `typeMap` 一致，各 1 条。
- 登录日志会员类型只按本页 1～4（内部商户 / 商户 / 钱包 / 蚂蚁），登录模式 1 前台 / 2 商户，登录状态 `1` 成功、其余失败。
- 手动操作 `opType` 1 上分 / 2 下分 / 3 冻结 / 4 解冻。点会员 ID 打开已有会员详情。
- 解绑 `unbindFlag` 1 用户操作 / 0 系统操作。商户号、商户会员 ID 取自会员列表已有绑定。点会员 ID 打开已有会员详情。
- 这五页没有单独的新增/编辑弹窗。搜索和重置走列表筛选。

## 会话十：侧栏栏目排序

按用户指定顺序重排原型侧栏分组，仪表盘不再出现在导航里。分组名仍用已有翻译键，页内顺序未改。

改动：`apps/admin/src/prototype/menus.ts`

顺序：BI看板、会员管理、订单管理、配置管理、KYC管理、APP管理、商户管理、通道管理、工单列表、报表中心、撮合订单池、任务管理、用户等级、邮件管理、风控管理、系统管理。`dashboard` 不进侧栏。

## 会话十一：蚂蚁层级列表

目标：会员管理最后一页接列表假数据。用户分组、转化方式按枚举覆盖；搜索、分组保存、展开上下级、点会员和返佣金额可用。

改动：

- `field-notes.md`：新增 §16 蚂蚁层级列表；目录同步
- `fixtures/memberAntLevel.ts`：5 条层级、筛选排序、设置分组、展开关系
- `mock.ts`：挂上 `getAntMemberInfoList`、`levelRelationShip`、`setAntGroup`

已对齐：

- 分组 `0` 未分组～`4` 高度活跃；转化方式 `1` 系统转化～`4` 会员邀请。
- 未登录筛选：`3` 为 3～6 天，`7` 为 7～9 天，`10` 为正好 10 天，`-1` 为超过 10 天。
- 根会员 `10086002`，两支下级。会员和返佣都用已有数据。
- 展开只返回本人、直接上级、直接下级。分组保存改内存，刷新恢复。

## 会话十一补充：会员管理字段理解确认

用户确认：蚂蚁层级列表字段理解准确；会员管理里此前没有另行纠正的字段理解，一律按已写内容为准。

已核对菜单路由与 `field-notes.md`：

- `/member/list` §1，详情会员信息 §2，详情账变 §3，详情收款信息 §4
- `/member/paymentV2` §5（含连接日志、操作日志）
- `/member/group` §6，`/member/name` §7，`/member/agentLevReo` §8
- `/member/usdtPayment` §9，`/member/changeReocde` §10
- `/member/smslog` §11，`/member/operationlog` §12，`/member/loginlog` §13
- `/member/manuallog` §14，`/member/unbindLog` §15，`/member/agentLevel` §16

旧页 `/member/payment` 已弃用，不单列字段。嵌套会员详情、返佣弹窗、展开上下级沿用已有数据，不另写字段小节。

`field-notes.md` §1～§16 状态改为「字段理解已确认」。原先用来追问含义的备注已收掉；留下的备注只记页面写法和原型做法。

## 会话十二：APP管理六页

目标：去掉这组页面名称里的「假」；按印度 UPI 应用做 10 个银行，并给 APP 管理 6 个页面接假数据。字段理解写入 `field-notes` §17～§22，供校正。

改动：

- `i18n` 已有键 `n1682`、`n1683`、`n1684`、`n1697`、`n1714`、`n1767`：去掉「假」/ Fake
- `fixtures/appUpiBanks.ts`：PHONEPE、PAYTM、FREECHARGE、MONEYVIEW、GOOGLEPAY、BHIM、MOBIKWIK、CRED、BHARATPE、AMAZONPAY
- `fixtures/appConfig.ts`：六页列表、开关、黑名单启用、解除绑定、行为日志、短信
- `fixtures/memberPayInfo.ts`：银行编码下拉在原有 SBI 等后面加上这 10 个
- `mock.ts`：挂上对应接口。假 APP 路径写在通用 `kycBank` 规则前面

已对齐（字段理解待校正）：

- 这 10 个编码是后续 APP 银行关联的基准。会员 APP 信息、数据收集、两套银行列表、黑名单、登录失败都用它们。
- `/appConfig/appBank` 与 KYC 银行列表共用 `kycBankAdmin/listPage`，原型按这 10 个 UPI 应用返回。
- 彩票工单和自动交易的开关类型都是 `9`，改其中一个会带动另一个。

## 会话十二补充：弃用重复的 APP银行菜单

核对：去掉「假」之后，侧栏出现两个 APP银行。

- `/appConfig/appBank`（`n1522`）和 KYC 管理「KYC银行列表」共用 `kycBankAdmin/listPage`，本页列更少。
- `/appConfig/fackAppBank`（`n1682`，原假APP银行）用 `fakeAppKycBankAdmin`，开关是手动/自动买入 UPI、银行卡、UTR、提权。会员 APP 信息、黑名单、登录失败都跟这一套。

改动：从 `routeCatalog.json` 去掉 `/appConfig/appBank`。页面源码和路由映射保留。侧栏只留 `/appConfig/fackAppBank`。

## 会话十三：KYC管理假数据

目标：给 KYC 管理栏目 25 个菜单页做字段理解并接上假数据。字段理解写入 `field-notes` §23～§47，状态为供校正。APP 管理 §17～§22 仍待校正，等两栏意见一起回来再改文件。

改动：

- `fixtures/kycMenu.ts`：各列表、枚举覆盖、补单、删除标记、外部通道启停、IFSC 新增改名、失败责任方修改
- `fixtures/appConfig.ts`：KYC 银行列表共用的 10 个 UPI 应用补上额度、OTP、PIN、外部图标；开关日志补上类型 `12`
- `mock.ts`：`resolveKycMenu` 挂在 APP 路由之后

已对齐（待校正）：

- 银行编码继续用 §17.1 的 10 个 UPI 应用。IFSC 配置单独用印度传统银行分行码。外部通道是 Razorpay、Cashfree、PayU、PhonePe Business，和 UPI 应用不是同一套。
- `/kyc/kycManager` 与 `/kyc/kycManagerV2` 标题都是「会员KYC信息」，这次没有弃用。
- 快捷提现和买入申诉、买入待拉取共用接口。快捷提现请求带 `selectType: 2`，原型用它把数据分开。
- 默认带当天时间的列表，时间落在印度时区当天。

## 会话十四：其余栏目全量假数据

目标：给会员、KYC、APP、已隐藏仪表盘以外的菜单页补字段理解和假数据。BI 看板仍不连接线上报表。

改动：

- `prototype/tools/extract-remaining.mjs`：从页面和直接子组件抽出列、枚举、列表接口，写成 `fixtures/remainingCatalog.json`
- `fixtures/remainingPages.ts`：按目录给还没有假数据的列表造行。枚举尽量每种值都有一行。会员编号沿用 `10086001`～`10086010`，银行编码沿用 10 个印度 UPI 应用。时间用印度时区当天。
- `mock.ts`：`resolveRemaining` 放在已有路由之后。前面栏目已经接过的接口不会被这层盖掉。
- `field-notes.md` §48～§133：BI 看板说明空状态；其余页面列和枚举。状态为供校正。

已对齐（待校正）：

- BI 看板各页是线上 iframe。原型 `biDataUrl` 为空，页面保持空状态，没有另造图表数据。
- 同一路由组件挂了两个菜单时，字段说明互相引用，数据是同一套。
- 按钮里的子弹窗不单列字段小节。对得上的列表有数据，保存和删除返回成功，同一资源的新增修改留在内存里，刷新后恢复。

## 会话十四补充：菜单点击不跳转

现象：重启后点侧栏，地址有时变了，内容还停在上一页。

原因：

1. 首次拉菜单后 `beforeEach` 里 `next()` 调了两次。
2. 每个栏目各自再挂一层 Layout，切栏目等于整壳重挂；其余栏目假数据里个别枚举越界，`$t(undefined)` 把子树弄脏，卸载失败后后面页面挂不上去。
3. 菜单 `id` 是数字、点击回调有时是字符串，对不上会找不到路径。

改动：

- `router/index.ts`：菜单加载后 `return next(...)`；动态路由只挂一次；原型里页面都挂到同一个 `home` Layout 下。
- `packages/components/.../useLayout.hook.ts`：`goMenu` 用字符串比较 id，并兜住空路径。
- `fixtures/remainingPages.ts`：申诉类型、订单状态、riskTag 等按真实 map 取值，避免 `$t(undefined)`。

## 会话十四对齐：用户关注点

用户确认：原型不回流正式代码；只关心业务问题（页面、字段、枚举、按钮、提示文案、交互结果）。技术实现可自行调整。改业务交互须先同意。已约定枚举（卖出状态、完单类型、订单状态等）勿擅自改；展示型假数据随意。菜单排序、成败真实分支不纠结。细则已写入 `.cursor/rules/prototype-session.mdc`。

## 会话十五：字段理解文档

目标：侧栏新增栏目「后台字段理解」，页内「字段理解文档」把 `field-notes.md` 里的页面、字段、理解和校正状态摊开，方便对照存档。

改动：

- `routeCatalog.json`、`menus.ts`、`router/index.ts`：栏目放在侧栏最前，页面路由 `/fieldNotes/doc`
- `views/prototype/fieldNotes.vue`：按页面列表展示，展开后是字段表。可按栏目、校正状态、关键词筛选，也可只看还没写理解的字段
- `parseFieldNotes.ts`：从字段说明原文拆页面和字段。改存档后刷新页面即可，不另存一份
- `field-notes.md`：新增 §134

已对齐：

- 校正状态读各节「状态」。写出「已确认」的算已确认，其余算待校正。状态里写了弃用的，再标「菜单已弃用」。
- 字段理解空着时，页面显示「未写」。后期栏目里很多页只有列名，会落在这一档。
- 菜单名用页面标题原文，不新造翻译键。刷新后侧栏生效。

## 会话十六：KYC 管理菜单排序

按用户指定顺序重排 `/kyc/*`。两份「会员KYC信息」挨在第 2 位，先 V1 再 V2。名单里没写到的 4 页留在栏目最后：KYC订单、KYC短信日志、upi买卖交易统计、KYC短信发送成功日志。

彩票工单四页原来侧栏写的是原文，这次改用已有翻译键，页面标题跟着变：

- 收款KYC待拉取队列 → 彩票工单待拉取列表（`n1273`）
- 外部通道收款流水 → 彩票工单交易流水（`n1272`）
- 外部通道列表 → 彩票工单通道列表（`n1274`）
- 外部通道异常流水 → 彩票工单异常流水（`n1275`）

第 1 位仍是「KYC银行列表」，第 8 位仍是「自动交易流水」。刷新后侧栏生效。

## 会话十七：会员KYC只留一页，补齐待拉取表头，卖出流水能看见表

- 两份「会员KYC信息」只留有操作项、并且卖出状态和是否删除都带颜色的那一页（`/kyc/kycManagerV2`）。卖出状态开启绿色、关闭红色；是否删除「是」绿色、「否」红色；操作是连接日志。另一页从侧栏拿掉，页面源码还在。
- 卖出KYC待拉取列表普通页签曾经被补成 12 列。代码里普通页签只有 9 列，多出来的商户会员ID、连接状态、卖单数量只在「快捷提现」页签。已改回代码原样，见会话十九。
- 卖出交易流水第一个页签的假数据其实已经返回，会员ID写成了数字。这一列要按逗号拆开显示，渲染报错后整表行画不出来。改成字符串后 10 条能看见。另外四个页签本来就有数据：UTR 重复 4 条、TID 重复 4 条、异常流水 6 条、唤醒记录 10 条。页面列和按钮没改。

## 会话十八：列表底部合计

目标：上一轮找出来的、底部同时有「本页合计」和「总计」的列表，核对有没有假数据，并把这两行数字补上。

- 本页合计是当前页相关金额相加，总计是当前筛选结果全部行相加。不够一页时两行相同。
- 本来就能算出数的：会员列表、账变记录（含会员详情页签）、返佣记录、会员 APP 信息、UPI 买卖交易统计、KYC 短信发送成功日志。
- 订单、商户（下发申请、下发记录、商户账变、代收、代付）、报表、通道账变、通道代收、奖励卡领取记录、人工卖出订单记录：列表里已有假数据，底部数字原先是空的，现按列加总。
- 商户列表原先被商户下拉占用，没有余额行。分页查询现在有 10 条商户，余额两行有数。下拉仍走名称列表。
- 自动交易买入、卖出流水各 8 条，金额合计原先没有，现已加上。
- 买入报表等日期列原先挤在同一天，默认日期范围内容易被滤空；平均完成时长不是数字，行画不出来，底部看着是 0。日期散到最近几天、时长改为数字后，买入报表 10 条，本页合计和总计都是 15,625。假数据侧的调整，页面列没改。
- 三方报表总计的买入成功笔数，页面代码读的是卖出成功笔数。页面绑定保持原样，不在原型里改掉这个差异。

## 会话十九：卖出KYC待拉取两个页签按代码列数

普通页签按代码恢复为 9 列：KYC ID、会员ID、银行编码、UPI、拉取次数、成功拉取次数、最后拉取时间、放入时间、token。

快捷提现页签仍是代码里的 12 列，比普通页签多商户会员ID、连接状态、卖单数量。两个页签的接口、按钮、搜索项都没改。

## 会话二十：买入申诉流水申诉ID 与申诉订单列表对齐

- 申诉订单列表的申诉ID（`id`）改成与买入申诉流水的 `appealId` 同一套：`AP89001`～`AP89010`。
- 买入申诉流水点申诉ID，按页面原有跳转进申诉订单列表，并带上该 ID 筛选。页面按钮和列没改。

## 会话二十一：申诉ID 跳转关联全量对齐

- 申诉订单列表的 `id` 覆盖所有「代码里可点申诉ID」的流水假数据，点过去按 `id` 精确筛到对应那一条。
- 已对齐：买入申诉流水、快捷提现买入/失败流水、卖出交易流水（KYC + 订单栏）、UTR 重复、TID 重复。
- 有申诉ID但源码未做点击跳转的（买入申诉失败、KYC交易失败、异常流水注释掉的点击）本次不改交互。

## 会话二十二：KYC 四页侧栏加「待检查」标记

测试环境 KYC 栏目没有这 4 页。原型侧栏标题前加「【待检查】」：KYC订单、KYC短信日志、UPI买卖交易统计、KYC短信发送成功日志。只改原型菜单生成，未改翻译键。

## 会话二十三：侧栏按测试环境排序

对照测试环境侧栏，调整一级栏目顺序和三个对不上的栏目名。页面路由和页内顺序没动。

顺序：后台字段理解仍在最前。其后按测试环境：BI看板、订单管理、KYC管理、APP管理、会员管理、通道管理、委托管理、运营管理、推送管理、商户管理、用户等级、客服系统、风控管理、系统管理。工单列表、报表中心、任务管理排在这 14 个后面。

改名只用已有翻译键：撮合订单池改为委托管理（`n223`），配置管理改为运营管理（`m314`），邮件管理改为推送管理（`n175`）。客服系统从运营管理里拿出来，单独成一级栏目，里面仍是原来那一页。

改动：`menus.ts` 分组名、顺序，以及客服系统归组。`field-notes.md` 里对应页面的栏目名跟着改。

## 会话二十四：订单管理页按测试环境排序

对照测试环境「订单管理」展开后的顺序，调整侧栏页面，并改了四个对不上的名字。

顺序：USDT买入订单、欠费订单、人工卖出订单、母订单列表、买入订单、卖出订单、申诉订单、撮合。退款订单、卖出交易流水、USDT提现订单排在这 8 个后面。

改名只用已有翻译键：撮合订单池改为母订单列表（`m10`），买入订单记录改为买入订单（`m7`），申诉订单列表改为申诉订单（`m4`），撮合列表改为撮合（`m11`）。买入订单和撮合的页内大标题跟着改。申诉订单页内页签仍是申诉订单列表。母订单列表页内标题跟着侧栏走。

重复菜单各留别的页面会跳过去的那一条：`/order/buyOrder/index`、`/order/sale/index`、`/order/appeal/index`。`/order/buyRecord/index`、`/order/saleRecord/index`、`/order/appeal` 从侧栏拿掉，页面源码和路由映射还在。

## 会话二十五：USDT买入订单状态文案

假数据原先给订单状态写了 `1`/`2`，本页映射只有 `3` 等待转账、`4` 确认中、`7` 已完成、`13` 订单过期、`10` 买入失败，对不上就直接显示数字。已改假数据按这 5 个轮换。页面代码没动。

## 会话二十六：欠费订单假数据按截图对齐

对照测试环境截图，重造欠费订单列表和顶部汇总。

- 买方/卖方账号、会员ID、订单IP、订单号都成对填齐；卖方 IP 覆盖普通 IP、`0.0.0.0`、`auto-sell:{会员ID}`。
- 状态按 `matchlistStatus` 取值（含已取消、买入失败/订单失效、支付超时等），列表显示文案不显示数字。
- 订单金额、实欠金额用小数；UTR、操作人、操作时间、KYC 是/否、订单来源都按页面字段填。
- `totalMemberDebt` 返回待扣取总欠费、欠费中用户数，按列表假数据汇总。页面代码没动。

## 会话二十七：源码库与 Demo 公网发布

- 源码库（公开）：https://github.com/TREE-bit/AR-Admin-Panel
- Demo 静态库（无源码，供 GitHub Pages）：https://github.com/TREE-bit/AR-Admin-Panel-Demo
- 构建命令：`pnpm --filter admin build:prototype:pages`（`base=/AR-Admin-Panel-Demo/`）
- 真实环境 `.env.*` 未进公开源码库，仅提交空的 `.env.prototype`
- Pages 需在 Demo 仓库 Settings → Pages 选 `main` / `/ (root)` 后生效；预计地址 https://tree-bit.github.io/AR-Admin-Panel-Demo/

## 还没做

- 导航剩余名称：订单管理页内顺序和名字已按测试环境对过。其他栏目的页内名称，以及测试环境没展开的子菜单，还没对。
- §17～§22、§23～§47、§48～§133 的字段理解都还待校正。用户还没反馈的，先保持现在的写法。
- 退款场景、欠费扣费完整链路，净买卖的正式公式。
- 创建会员、批量禁用会员这些操作仍只返回成功，不会留下新数据。批量禁用或启用买入、卖出会改内存里的开关和账号状态。
- 账变跳转撮合页、导出真实文件内容。
- Demo 仓库的 GitHub Pages 开关需在网页上手动打开（本机无 `gh`）。
