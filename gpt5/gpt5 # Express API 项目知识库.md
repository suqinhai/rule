AI 知识库（适配 init-expresss-api）

一、项目概览
•  技术栈与分层
•  Express 应用，清晰的分层：routes -> controllers -> services -> models
•  公共模块在 common/（Sequelize、Redis cache、i18n、logger、routeHandler、util、schedule）
•  中间件在 middleware/（core、api、monitoring、config、utils），提供鉴权、限流、缓存、校验、错误处理、性能与审计
•  入口与运行
•  启动入口：bin/www
•  支持集群模式（CLUSTER_MODE=true）与优雅退出，自动按 CPU 核心数 fork worker
•  端口：PORT（默认 3001）；读取 env/{dev|uat|pro}.env
•  API 命名空间
•  routes/index.js 挂载三大命名空间：/user、/admin、/merchant
•  各命名空间内再按模块细分，如 user-api/auth、profile；admin-api/users、system；merchant-api/auth、shop、products

二、目录结构与关键路径
•  bin/www：HTTP server、cluster、优雅退出、端口监听
•  routes/
•  index.js：挂载 /user、/admin、/merchant
•  user-api/、admin-api/、merchant-api/ 各自含子模块目录（auth、profile、users、system、shop、products 等）
•  controllers/
•  base/BaseController.js、base/BaseMerchantController.js：基础控制器
•  user/、admin/、merchant/ 对应控制器，各自调用 services
•  services/
•  base/BaseService.js、base/BaseMerchantService.js：基础服务
•  user/、admin/、merchant/ 业务服务
•  models/
•  index.js：注册模型（userModel、registerConfigModel 等），导出 sequelize
•  users/user.js 等：模型定义（Sequelize）
•  middleware/
•  index.js：统一导出 quick、stacks、factories、core、monitoring、utils 和配置
•  core/：auth、rateLimit、cache、validator、errorHandler
•  api/：按 user/admin/merchant/common 场景组合好的中间件栈
•  monitoring/：performance、audit
•  config/index.js：RATE_LIMIT_CONFIG、CACHE_CONFIG、AUTH_CONFIG、API_TYPE_CONFIG、PERFORMANCE_CONFIG、AUDIT_CONFIG、ERROR_CONFIG
•  common/
•  mysql/index.js：Sequelize 实例
•  redis/index.js、redis/cache.js：缓存管理器、PREFIX/TTL
•  routeHandler/index.js：统一响应（sendSuccess/sendBadRequest/sendUnauthorized 等）
•  i18n/：多语言配置，zh/en
•  logger/：结构化日志（支持 logger.security）
•  constants/status.js、utils/statusHelper.js：状态与工具
•  env/：dev.env、uat.env、pro.env
•  docs/INSTALLATION.md：安装/运行说明（参考）

三、统一响应与错误处理
•  统一响应
•  控制器中优先使用 BaseController 的 this.sendSuccess / this.sendError
•  或直接使用已注入的 res.sendSuccess、res.sendBadRequest、res.sendUnauthorized 等
•  错误处理（middleware/core/errorHandler.js）
•  AppError 体系与错误分类（VALIDATION、AUTHENTICATION、AUTHORIZATION、NOT_FOUND、DATABASE、EXTERNAL_API、RATE_LIMIT、CACHE、FILE_UPLOAD、BUSINESS_LOGIC、INTERNAL）
•  标准错误码（如 40001 VALIDATION_FAILED、40101 INVALID_CREDENTIALS、42901 RATE_LIMIT_EXCEEDED、50001 INTERNAL_SERVER_ERROR 等）
•  classifyError 自动将常见错误（Sequelize、JWT、Multer 等）映射为统一错误
•  ERROR_CONFIG 控制 includeStack、logErrors、statusCodeMap 等
•  notFoundHandler 用于 404，asyncHandler 包装异步
•  日志按错误级别输出，并附带上下文（url、method、ip、userAgent、userId、apiType、timestamp、errorCode/type）

四、鉴权与权限（middleware/core/auth.js）
•  核心方法
•  baseAuth：可选鉴权，从 Authorization: Bearer <token> 或 query.token 提取 token
•  requireAuth：必须登录
•  requireAdmin：必须管理员
•  requireSuperAdmin：超级管理员（role=super_admin 或 level=super），并记录安全事件
•  requirePermissions(perms, { requireAll, requireAuth }): 细粒度权限校验
•  verifyToken、extractToken、getUserById
•  Token 缓存
•  使用 Redis CacheManager，PREFIX.TOKEN/USER；将 token 前缀+解析结果/用户信息缓存，减少重复解析与 DB 查询
•  用户状态
•  StatusHelper.isUserActive(user.status) 检查有效性

五、参数校验（middleware/core/validator.js）
•  基于 express-validator 的封装：rules + validate
•  常用 rules：username、password、email、phone、id/uuid、pagination、search、dateRange、status、role、file、jsonData、arrayField、custom 等
•  commonValidations：login、register、updateUser、paginatedQuery、dateRangeQuery
•  handleValidationResult 自动输出统一 BadRequest 响应（支持 i18n 文案）

六、限流（middleware/core/rateLimit.js）
•  预设中间件
•  userRateLimit、adminRateLimit、generalRateLimit、strictRateLimit（敏感操作）、loginRateLimit（5次/15min）
•  动态与自定义
•  dynamicRateLimit 根据 req.apiType 自动选择
•  createCustomRateLimit、createIPRateLimit、createUserRateLimit 支持定制策略
•  RATE_LIMIT_CONFIG（middleware/config/index.js）按 user/admin/general 区分 windowMs、max、skipPaths、message 等

七、缓存（middleware/core/cache.js）
•  读缓存
•  createCacheMiddleware({ ttl, prefix, includeUser, includeBody, keyGenerator, cacheHeaders, cacheAllMethods, cacheErrors })
•  预设：userDataCache、adminDataCache、staticDataCache（默认只缓存 GET）
•  generateCacheKey：包含 method、url、queryHash；可选 includeUser、includeBody（非 GET 需显式允许）
•  写后清理
•  createCacheClearMiddleware({ patterns, keys, clearFunction })：在成功响应后清理相关缓存 key/pattern
•  预热
•  warmupCache：应用启动时可预热常用数据

八、日志与监控
•  common/logger：结构化日志，区分 info/warn/error；支持 logger.security 安全事件
•  middleware/monitoring/performance：性能统计、慢请求阈值（PERFORMANCE_CONFIG.slowRequestThreshold）、报告生成
•  middleware/monitoring/audit：审计日志，敏感操作类型可配置（AUDIT_CONFIG.sensitiveOperations）

九、国际化（common/i18n）
•  getI18n().t(key) 翻译 zh/en；validator 与错误消息优先使用 i18n key

十、模型与数据库
•  common/mysql/index.js 暴露 sequelize
•  models/index.js 注册并导出各模型（当前有 users/user.js、users/registerConfig.js 等）
•  新增模型需：
•  在 models/{domain}/{name}.js 定义
•  在 models/index.js 注册
•  注意字段约束、索引、关联
•  服务层通过 res.sequelize 或 require('../common').sequelize 获取实例

十一、路由与中间件栈
•  routes/index.js：挂载 /user、/admin、/merchant
•  各命名空间 index.js 根路由提供健康信息与 availableEndpoints，并统一 use 对应 API 中间件栈：
•  user：const { userApi } = require('../../middleware')
•  admin：const { adminApi } = require('../../middleware')
•  merchant：const { merchantApi } = require('../../middleware')
•  middleware/index.js 统一导出：
•  quick：requireAuth/requireAdmin/requireSuperAdmin/requirePermissions、userRateLimit/loginRateLimit、userDataCache、validate 等
•  stacks：user/admin/merchant/common 针对场景组合好的中间件组
•  factories：createUserStack/createAdminStack/... createRateLimit/createCache/createValidator 等
•  config：RATE_LIMIT_CONFIG、CACHE_CONFIG、AUTH_CONFIG、API_TYPE_CONFIG、PERFORMANCE_CONFIG、AUDIT_CONFIG、ERROR_CONFIG

十二、控制器与服务规范
•  控制器
•  继承 BaseController，使用 this.asyncHandler 包装异步
•  只做编排：参数校验 -> 调用 Service -> 统一响应 -> 必要日志
•  失败时 this.sendError(res, msg, status, details) 或抛出 AppError 子类
•  服务
•  继承 BaseService，承载业务逻辑与数据访问
•  进行入参校验（BaseService.validateData 等），必要时使用事务
•  严格避免返回敏感数据（密码、完整 token 等）

十三、配置与环境变量
•  dotenv 在 bin/www 中通过 getEnvPath() 加载 env/{dev|uat|pro}.env
•  middleware/config/index.js 聚合所有中间件相关配置
•  AUTH_CONFIG.JWT：secret、expiresIn、issuer、audience
•  ERROR_CONFIG：includeStack（开发环境默认 true）、默认错误消息与映射
•  按环境覆盖敏感配置（JWT_SECRET 等），不在代码中硬编码

十四、开发工作流与模板
•  新增只读 GET 接口
•  路由：routes/{namespace}/{module}/index.js
•  中间件：选择 stacks.user.public/authenticated 或 quick.requireAuth + quick.userDataCache
•  控制器：controllers/{namespace}/{Module}Controller.js（方法使用 this.asyncHandler；参数校验用 validator.rules/...；调用服务）
•  服务：services/{namespace}/{Module}Service.js（校验 -> 查询 -> 返回脱敏数据）
•  新增写操作（POST/PUT/DELETE）
•  中间件：requireAuth/requireAdmin + strictRateLimit（必要时）+ validator + createCacheClearMiddleware({ patterns: ['user_data:*', ...] })
•  控制器：try/catch 映射预期错误为 400/401/403/409，其余交给 errorHandler
•  服务：必要时使用事务，确保一致性
•  模型变更
•  新增/修改 models 文件并在 models/index.js 注册
•  同步策略、迁移脚本与数据补丁需评估并记录
•  日志
•  记录关键行为与异常；安全相关用 logger.security
•  不打出敏感明文（密码、完整 token）

十五、常见示例（片段级指引）
•  登录接口建议
•  中间件：loginRateLimit + validator.commonValidations.login
•  控制器：UserAuthController.login 内部已做 required 校验与服务调用
•  服务：UserAuthService.login 使用 bcrypt、jwt；过期时间来自 env/CONFIG
•  用户资料查询（GET）
•  中间件：middleware.stacks.user.authenticated + quick.userDataCache
•  缓存键 includeUser，应包含 user.id 与 queryHash，TTL 参考 CACHE_CONFIG.USER_DATA
•  更新资料（PUT）
•  中间件：requireAuth + validator.commonValidations.updateUser + strictRateLimit + createCacheClearMiddleware({ patterns: ['user_data:*'] })

十六、测试与本地验证建议
•  运行
•  参考 docs/INSTALLATION.md 与 env/dev.env
•  常见环境变量：PORT、CLUSTER_MODE、JWT_SECRET、JWT_EXPIRES_IN、REDIS/MYSQL 连接信息等
•  自测清单
•  GET 接口命中 userDataCache/adminDataCache（响应头含 X-Cache/HIT/MISS）
•  写接口成功后相关缓存清理生效
•  限流触发时返回 429 与 message，日志含路径/IP/用户
•  未授权/权限不足/令牌过期等错误被正确分类与返回
•  i18n 文案是否按期望语言返回

十七、故障排查
•  端口占用：使用 scripts/kill-port.js 或调整 PORT
•  鉴权问题：检查 Authorization 头、token 是否缓存为无效、用户状态是否 active
•  缓存问题：核对缓存键生成逻辑（includeUser/includeBody/queryHash），写操作是否清理匹配的 patterns
•  限流过严：调整 RATE_LIMIT_CONFIG 或使用自定义限流器
•  错误栈缺失：ERROR_CONFIG.includeStack 仅在开发环境开启

十八、安全与隐私
•  密码必须哈希（bcrypt），严禁明文日志
•  token 不应完整记录到日志；缓存中仅保存必要片段或摘要
•  文件上传/外部接口要验证输入与限制类型
•  避免在响应中暴露内部错误细节（生产环境 includeStack=false）

十九、状态与枚举（摘）
•  common/constants/status.js、common/utils/statusHelper.js
•  USER_STATUS、USER_ROLE、AUTH_STATUS、COMMON_STATUS（SUCCESS/FAILED/YES/NO 等）
•  StatusHelper.isUserActive(user.status) 用于快速判断账号有效

二十、FAQ
•  为什么要用 BaseController/BaseService？
•  统一响应与错误处理、日志记录与参数校验，保持代码风格一致
•  读接口什么时候用缓存？
•  绝大多数 GET 接口都建议；用户维度数据使用 includeUser，静态/公共数据用 STATIC_DATA
•  写接口如何避免脏读？
•  成功响应后调用 createCacheClearMiddleware 清理相关 key/pattern
•  如何快速添加权限控制？
•  使用 requirePermissions(['perm:a'], { requireAll: true })，并在用户实体或权限体系中提供 permissions

二十一、提交变更时的说明模板
•  背景/需求：一句话
•  变更点：
•  新增/修改文件列表（含相对路径）
•  路由与中间件栈使用说明（鉴权/限流/校验/缓存/清理）
•  控制器/服务主要逻辑摘要
•  如有模型变更：字段、索引、兼容性、迁移步骤
•  本地验证与边界用例
•  风险与回滚
•  相关配置或文案（i18n key）变动

二十二、自检清单（提交前逐项确认）
•  路由已正确挂载到命名空间，路径规范
•  必要的 requireAuth/requireAdmin/requirePermissions 已配置
•  限流（尤其登录/敏感操作）与缓存（读）/清理（写）已配置
•  校验规则完整，handleValidationResult 在末尾；错误分类合理
•  日志与审计覆盖关键路径，不含敏感信息
•  i18n 文案与配置读取正确；不硬编码密钥
•  读写一致性策略明确，无脏读风险
•  代码风格 CommonJS + async/await，导出/注册完整