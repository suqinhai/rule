项目深度分析（要点摘要）
•  技术栈
•  Node 16+/18（容器），Express 4.18
•  MySQL + Sequelize（主关系数据库）
•  MongoDB + Mongoose（可选文档库）
•  Redis（缓存、登录失败计数、令牌黑名单）
•  JWT 鉴权、Helmet、CORS、Rate limit、Validator、Winston 日志、i18n、多语言
•  Cluster 模式、优雅关停、性能监控、审计日志
•  Dockerfile / docker-compose（含可选 Nginx）
•  ESLint/Prettier 基础规范
•  目录与分层
•  app.js（应用装配）→ routes（user/admin/merchant）→ controllers（业务入口）→ services（业务逻辑）→ models（Sequelize 模型）
•  middleware（auth、rateLimit、cache、validator、errorHandler、monitoring、apiType 等）
•  common（mysql、mango、redis、logger、i18n、routeHandler、schedule、healthcheck）
•  bin（www/cluster/server-config 等）
•  中间件与响应
•  全局：Helmet、Compression、CORS、全局限流、静态资源缓存、i18n 中间件
•  业务：三套 API 中间件栈（user/admin/merchant），含认证/限流/缓存/审计/性能监控
•  错误处理：标准化错误类型与响应（ERROR_TYPES/CODES），404/全局 error handler 完备
•  响应一致性：routeHandler 为 res 注入 sendSuccess/sendBadRequest/sendUnauthorized 等
•  数据与缓存
•  Sequelize 连接池/重试、模型拆分 users 与 merchants_users
•  Redis TTL 分层、CacheManager 支持 get/set/getOrFetch/del/deletePattern
•  日志与监控
•  Winston + daily-rotate，区分控制台/应用/错误/数据库日志
•  性能监控（请求统计、响应时间分位数、慢请求、内存/CPU 采样）
•  审计日志（敏感操作），但默认内存存储，建议落库
•  文档与脚本
•  README 与 docs 填充较多，但存在与实际实现不一致的部分（见下）
•  scripts/sync-db.js 存在路径错误

关键问题与不一致（优先级高→低）
1) 端口与健康检查不一致
•  Dockerfile 与 docker-compose 把端口暴露为 3001，但健康检查访问 http://localhost:3000/health
•  代码实际通过 bin/server-config 读取 PORT，默认 3001（process.env.PORT || '3001'）
•  建议统一为 3001，并补齐 /health 路由（见改进建议）

2) /health 路由缺失
•  有 common/healthcheck.js 模块，但未注册为 HTTP 路由；npm run health 仅执行该文件不会输出检查结果
•  建议实现 GET /health 并调用 HealthCheck.checkAll() 返回 JSON 状态；修复 npm run health 为启动一个临时脚本或直接 curl 应用端点

3) 角色检查与类型不一致（高）
•  常量 USER_ROLE 为数字：USER=10, MERCHANT=20, CONSOLE_ADMIN=30
•  middleware/utils/apiType.js 的 validateUserTypeForApi 用的是字符串角色['user','admin','super_admin','merchant']，与数字常量不匹配，且管理员/总台概念不同
•  部分认证中间件用 req.user.role !== 30 判管理员；但“管理员”与“总台”（30）概念未统一
•  建议：
•  统一使用数字常量进行校验（USER_ROLE.USER/MERCHANT/CONSOLE_ADMIN）
•  apiType.validateUserTypeForApi 改为基于数字常量判断
•  明确定义“管理端”角色映射（若需区分普通 admin 与 console admin，请在常量中加入 ADMIN=？）

4) baseAuth 模型选择错误（高）
•  middleware/core/auth.js 的 baseAuth 始终用 merchantUserModel.findByPk 获取用户
•  用户端应查询 users.User，商户/总台才用 merchants.MerchantsUsers
•  可基于 req.apiType（已在 apiType 中间件设置）选择模型：
•  apiType === 'user' => User
•  apiType === 'merchant' 或 'admin/console' => MerchantsUsers
•  否则用户端认证/登出等会失败

5) 登录路由与限流未绑定（中高）
•  管理端、商户端、用户端登录路由均位于 no_require_auth 下，但未绑定专用登录限流中间件（如 loginRateLimit/merchantLimiting.login/userLimiting.login）
•  建议在各登录路由上叠加对应 login 限流栈，且加入审计

6) 日志接口误用（中）
•  多处调用 logger.security(...)，但 common/logger/index.js 未导出 security 方法（Winston 也无该方法）
•  建议新增安全日志封装函数 security(category='security') 或用 log(LOG_LEVELS.WARN, 'security', ...) 统一替换

7) 文档与实现不一致（中）
•  README/docs 声明 Swagger、多个公共端点（/health、/mongodb-test、/cache-demo）与 API 文档路径，但代码中未实现或未接入
•  管理端登录文档路径 /api/admin/console/auth/* 与现有路由 /api/admin/auth/* 不一致
•  建议统一命名（若保留 console 概念，建议路径 /api/admin/console/auth；或文档更新）

8) 路径错误与小问题（中）
•  app/models/users/enhancedUser.js: require('../../middleware') 实际目录在项目根，应为 '../../../middleware'
•  scripts/sync-db.js: require('../app/models/user') 实际在 app/models/users/user.js
•  middleware/utils/helpers.js 截断处包含 createMiddlewareChain，当前已被大量依赖，建议确认其完整性并覆盖测试
•  Helmet v7 的 xssFilter 选项已移除，当前传参无效；如需 XSS 保护请用 xss-clean 或其他方案
•  app.js 设置 views/ejs 但项目非 SSR，建议去除以简化

9) 健康与监控的落库与可观测（次）
•  审计日志当前在内存中，建议持久化（Mongo 或 MySQL）
•  暴露性能统计/审计查询端点（只限管理员）或接入 Prometheus/Grafana

可执行改进建议（按优先级）
•  P0
•  实现 GET /health 并修复 Docker/Docker Compose/README 的端口与健康检查URL统一为 3001
•  修复 baseAuth 按 apiType 选择模型；修正 validateUserTypeForApi 使用数字常量
•  为各登录路由加上登录专用限流与审计中间件
•  统一 logger 使用（替换 logger.security 或新增安全日志方法）
•  P1
•  修复 enhancedUser import、sync-db 路径；完善 helpers.js 的 createMiddlewareChain 定义与测试
•  去掉未使用的 EJS/view/static 逻辑，或补齐对应目录与示例
•  文档与代码统一（console 路径、Swagger 移除或补齐）
•  P2
•  审计落库与查询端点；性能指标导出（如 /metrics）
•  增加单元/集成测试（auth、rateLimit、cache、errorHandler）
•  最低权限原则与 CORS 白名单化；JWT 秘钥管理（避免明文默认值）

项目行为与扩展方式（简述）
•  新增接口：routes → controller（继承 BaseController/BaseMerchantController）→ service → model（如需）→ 绑定合适中间件栈（auth/limit/cache/audit/perf）
•  数据访问：优先通过 res.sequelize（Sequelize）或 res.mongodb.safeOperation(...)（Mongoose）
•  响应：统一使用 this.sendSuccess/this.sendError 或 res.sendSuccess 等，消息走 i18n key
•  错误：抛出/next(err) 交给 errorHandler，或用自定义 AppError 派生类
•  缓存：CacheManager.get/set/getOrFetch；键用 PREFIX 与业务前缀+业务ID；写后用 cache clear 中间件清理
•  日志：logger.log/logError/logRequestPerformance；避免自定义未定义的方法

——

可直接使用的“AI 开发提示词”（贴给协作的 AI，保证它按本项目规范开发）
将以下文本作为系统/开发者提示词提供给你的 AI 助手：

你是本仓库的协作开发助手，目标是为一个 Express.js 后端服务编写与修改代码，保持生产可用的质量与一致的工程规范。请严格遵循以下约束、习惯用法与流程。

一、项目与分层约定
•  技术栈：Node 16+，Express 4.18，Sequelize + MySQL，Mongoose + MongoDB（可选），Redis，JWT，Helmet，CORS，express-rate-limit，express-validator，Winston（按日轮转），i18n（i18next），node-cron。
•  分层结构与路径：
•  路由：app/routes/{user-api|admin-api|merchant-api}/...
•  控制器：app/controllers（控制 HTTP 层，只做入参校验、调用服务、统一响应）
•  服务：app/services（业务逻辑、事务、缓存策略、第三方/外部依赖调用）
•  模型：app/models（Sequelize 模型定义；users 与 merchants_users 分开）
•  中间件：middleware（auth、rateLimit、cache、validator、errorHandler、monitoring、utils/apiType）
•  公共：common（mysql/mango/redis/logger/i18n/routeHandler/schedule/healthcheck）
•  启动：bin/www, bin/server-config.js, bin/cluster-manager.js
•  响应统一：控制器优先继承 BaseController/BaseMerchantController 并使用 this.sendSuccess/this.sendError；或使用 res.sendSuccess/res.sendBadRequest/res.sendUnauthorized。

二、鉴权与角色
•  使用 JWT；令牌通过 Authorization: Bearer {token}。
•  角色常量为数字（common/constants/status.js：USER_ROLE）：USER=10, MERCHANT=20, CONSOLE_ADMIN=30。不要使用字符串角色判断。
•  baseAuth 必须根据 req.apiType 选择正确的模型：
•  user API → users.User
•  merchant/admin/console API → merchants.MerchantsUsers
•  路由中按需要叠加相应栈（middleware/index.js 暴露 stacks 与 factories）：
•  用户端：stacks.user.{public|authenticated|optionalAuth|cached|sensitive|login}
•  管理端：stacks.admin.{standard|sensitive|superAdmin|batch|export|cachedQuery|stats}
•  商户端：stacks.merchant.{public|authenticated|optionalAuth|cached|sensitive|login|product|shopAccess}
•  登录路由必须绑定专用“登录限流”与审计中间件。

三、限流、缓存与性能
•  限流：express-rate-limit，按 API 类型/用户/IP 定制 key；对敏感操作使用 strict；登录使用 login。
•  缓存：使用 CacheManager（common/redis/cache）：
•  读：get 或 getOrFetch（提供 PREFIX 与业务键）
•  写：set(typePrefix, key, value, ttl)；更新数据后使用 cache clear 中间件清理相关键/模式
•  仅缓存 2xx 响应（除非明确要求）；根据需要包含用户维度与 body/query 哈希
•  性能：开启 performanceMonitor；慢请求阈值默认 1000ms；可导出报表（generatePerformanceReport）。

四、校验与错误处理
•  参数校验：express-validator，使用 middleware/core/validator 的 validate 与 rules。验证失败用 res.sendBadRequest，消息走 i18n。
•  错误：抛出交给 errorHandler（middleware/core/errorHandler.js）。需要时使用 AppError 子类（ValidationError、AuthenticationError、AuthorizationError、NotFoundError、RateLimitError 等）。
•  不要在控制器里直接 res.status(500).json(...)，除非要传递特定错误语义；优先复用 sendError 或抛异常交给全局错误处理。

五、日志与审计
•  使用 common/logger（封装了 Winston + 按日轮转）：
•  常规：log(LOG_LEVELS.INFO, category, message, data?) 或 logError(category, message, error)
•  请求日志：生产环境使用 requestLogger；开发环境 morgan('dev')
•  如需“安全事件”，使用 log(LOG_LEVELS.WARN, 'security', message, data) 或补充一个封装函数，而不要直接调用 logger.security（不存在）。
•  审计：对敏感操作使用 audit.sensitiveOperationAudit 或 adminOperationAudit；审计目前存内存，必要时扩展为持久化。

六、国际化与消息
•  使用 i18n（i18next）：消息 key 请用中文键，如 '操作成功'、'参数错误'；控制器/中间件统一通过 i18n.t(key) 或 routeHandler 的 sendSuccess/sendBadRequest 等自动翻译。
•  在 common/i18n/locales/{zh|en}/translation.json 中添加新文案（中英文都维护）。

七、数据库与事务
•  使用 res.sequelize 访问 Sequelize；必要时调用 BaseService.executeTransaction 包裹事务。
•  MySQL 连接参数从 env 加载（common/mysql/index.js 已读取 env/{env}.env），确保 DB_* 变量齐全。
•  MongoDB 可选，使用 res.mongodb.safeOperation 包装；注意健康检查与错误容错。

八、安全与配置
•  默认开启 Helmet（检查 v7 兼容：不要使用已废弃 xssFilter 选项；如需 XSS 清洗，使用额外中间件）。
•  CORS：默认开放，生产环境应限制白名单。
•  JWT 秘钥与 TTL 来自 env；不要硬编码或提交默认弱密钥到仓库。
•  端口与健康检查
•  应用端口统一为 3001（或项目内另行统一），Dockerfile 与 docker-compose 的健康检查 URL 与端口必须一致。
•  实现 GET /health，返回 HealthCheck.checkAll() 的 JSON。
•  静态资源与视图：本项目是 API 服务，若非必要，去除 EJS 与未使用的 public 目录。

九、代码风格与提交
•  遵循 .eslintrc.js 与 .prettierrc.js：单引号、分号、2 空格缩进、无尾逗号、eqeqeq、no-var、prefer-const 等。
•  变更要求：
•  保持分层边界（路由薄；控制器少逻辑；服务含业务；错误交给 errorHandler）
•  为新增端点选择合适中间件栈；为登录与敏感操作配置严格限流与审计
•  使用统一响应与 i18n 文案
•  涉及缓存的写入操作后，附带相应的清缓存逻辑
•  如涉及端口/健康检查，确保 Dockerfile 与 docker-compose 同步更新
•  提交信息规范（建议）：
•  feat(scope): ...
•  fix(scope): ...
•  refactor(scope): ...
•  docs(scope): ...
•  chore(scope): ...
•  test(scope): ...

十、常见陷阱（务必规避）
•  用字符串角色进行权限判断（应使用 USER_ROLE 数字常量）
•  在 user API 下用 merchantsUsers 模型（应选 users.User）
•  忘记在登录路由加登录限流
•  直接使用 logger.security（该方法不存在）
•  README/Docs 的路径与代码不一致（修改代码时同步更新文档）
•  修改端口后遗忘更新健康检查 URL

十一、示例工作流（新增受保护接口的步骤）
•  在 app/routes/{user|admin|merchant}-api 下新增路由文件，选择合适中间件栈（如 stacks.admin.standard）
•  新增控制器类或方法（继承 BaseController/BaseMerchantController），做参数校验与调用服务
•  在服务层实现业务逻辑，必要时加事务、缓存策略、审计埋点
•  统一通过 sendSuccess/sendError 返回，消息使用 i18n key
•  若有写操作，补充清缓存中间件或在服务成功后清理缓存键
•  写/更新 docs 与 README 示例；必要时更新 docker 与健康检查