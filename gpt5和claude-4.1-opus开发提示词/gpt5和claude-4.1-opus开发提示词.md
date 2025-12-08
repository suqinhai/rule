# Express API 企业级项目 - AI开发提示词

## 项目概述

你正在开发一个基于Express.js的企业级API框架项目。这是一个功能完善、生产就绪的后端服务，采用MVC架构模式，支持MySQL和MongoDB双数据库架构，集成了Redis缓存、JWT认证、国际化、日志系统等现代化功能。

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



## 技术栈

### 核心框架
- **运行环境**: Node.js >= 16.0.0
- **Web框架**: Express.js 4.18.2
- **架构模式**: MVC (Model-View-Controller)

### 数据存储
- **关系型数据库**: MySQL 8.0 + Sequelize ORM
- **文档数据库**: MongoDB 4.4+ + Mongoose ODM  
- **缓存数据库**: Redis 7+ (使用ioredis客户端)

### 认证与安全
- **认证机制**: JWT (JSON Web Tokens)
- **密码加密**: bcrypt
- **安全中间件**: Helmet (HTTP安全头)、CORS (跨域)、express-rate-limit (限流)
- **数据验证**: express-validator

### 开发工具
- **日志系统**: Winston + Morgan
- **进程管理**: 集群模式支持
- **热重载**: Nodemon
- **国际化**: i18next
- **定时任务**: node-cron
- **容器化**: Docker + Docker Compose

## 项目结构规范

```
init-expresss-api/
├── app.js                  # 应用主入口，配置中间件和全局设置
├── bin/www                 # 启动脚本，处理集群模式
├── controllers/            # 控制器层 - 处理HTTP请求响应
│   ├── base/              # 基础控制器类
│   ├── user/              # 用户端控制器
│   ├── admin/             # 管理端控制器
│   └── merchant/          # 商户端控制器
├── services/              # 服务层 - 核心业务逻辑
│   ├── base/              # 基础服务类
│   ├── user/              # 用户业务服务
│   ├── admin/             # 管理业务服务
│   ├── merchant/          # 商户业务服务
│   └── common/            # 通用服务(邮件、文件、通知等)
├── models/                # 数据模型层
│   ├── users/             # 用户相关模型
│   └── merchants/         # 商户相关模型
├── routes/                # 路由层 - API端点定义
│   ├── user-api/          # 用户端API路由
│   ├── admin-api/         # 管理端API路由
│   └── merchant-api/      # 商户端API路由
├── middleware/            # 中间件模块
│   ├── core/              # 核心中间件(认证、缓存、错误处理等)
│   ├── api/               # API专用中间件
│   ├── config/            # 中间件配置
│   ├── monitoring/        # 监控中间件(审计、性能)
│   └── upload/            # 图片上传
├── common/                # 公共模块
│   ├── mysql/             # MySQL连接和配置
│   ├── mango/             # MongoDB连接和配置
│   ├── redis/             # Redis连接和缓存管理
│   ├── logger/            # 日志系统
│   ├── i18n/              # 国际化配置
│   ├── constants/         # 常量定义
│   └── utils/             # 工具函数
├── env/                   # 环境配置文件
│   ├── dev.env            # 开发环境
│   ├── uat.env            # 测试环境
│   └── pro.env            # 生产环境
└── scripts/               # 工具脚本
    ├── sync-db.js         # 数据库同步
    └── kill-port.js       # 端口清理
```

## 编码规范和最佳实践

### 1. MVC架构原则

#### Controller层规范
- 继承`BaseController`类获得统一功能
- 只处理HTTP请求/响应，不包含业务逻辑
- 使用`asyncHandler`包装异步方法
- 统一响应格式：`sendSuccess`、`sendError`、`sendPaginatedResponse`
- 参数验证使用`validateRequiredFields`
- 记录操作日志：`logAction`、`logError`

```javascript
class UserController extends BaseController {
  constructor() {
    super();
    this.userService = new UserService();
  }

  getUserProfile = this.asyncHandler(async (req, res) => {
    this.logAction('获取用户资料', req);
    
    const errors = this.validateRequiredFields(req, ['userId']);
    if (errors) {
      return this.sendError(res, '参数验证失败', 400, errors);
    }
    
    try {
      const user = await this.userService.getUserById(req.params.userId);
      this.sendSuccess(res, '获取成功', user);
    } catch (error) {
      this.logError('获取用户资料失败', error, req);
      this.sendError(res, error.message, 500);
    }
  });
}
```

#### Service层规范
- 继承`BaseService`类获得通用功能
- 包含所有业务逻辑和数据处理
- 使用`executeTransaction`管理数据库事务
- 利用`getOrSetCache`实现缓存策略
- 数据验证使用`validateData`方法
- 构建查询条件使用`buildWhereCondition`

```javascript
class UserService extends BaseService {
  async createUser(userData) {
    this.logAction('创建用户', { username: userData.username });
    
    // 数据验证
    const validation = this.validateData(userData, {
      username: { required: true, minLength: 3, maxLength: 50 },
      email: { required: true, pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/ },
      password: { required: true, minLength: 6 }
    });
    
    if (!validation.isValid) {
      throw new Error(`验证失败: ${validation.errors.map(e => e.message).join(', ')}`);
    }
    
    // 使用事务创建用户
    return await this.executeTransaction(async (transaction) => {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      }, { transaction });
      
      // 清除相关缓存
      await this.clearCache(['users:list', `user:${user.id}`]);
      
      return user;
    }, sequelize);
  }
}
```

### 2. 数据库使用规范

#### MySQL使用场景和规范
- 用于结构化数据、事务处理、复杂关联查询
- 使用Sequelize ORM定义模型
- 支持连接池配置优化性能
- 所有写操作使用事务保证数据一致性

```javascript
// 模型定义示例
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: USER_STATUS.ACTIVE,
      comment: '用户状态(0:未激活,1:已激活,2:已暂停,3:已封禁,4:已删除)'
    }
  }, {
    tableName: 'users',
    timestamps: false
  });
  
  return User;
};
```

#### MongoDB使用场景和规范
- 用于非结构化数据、日志记录、灵活模式数据
- 使用Mongoose ODM定义Schema
- 适合高性能读写场景

```javascript
// Schema定义示例
const logSchema = new mongoose.Schema({
  action: String,
  userId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },
  details: mongoose.Schema.Types.Mixed
}, {
  collection: 'activity_logs'
});
```

### 3. 缓存策略

使用Redis实现多级缓存策略：
- **短期缓存** (5分钟): 频繁变动的数据
- **中期缓存** (1小时): 相对稳定的数据
- **长期缓存** (1天): 很少变动的数据

```javascript
// 缓存使用示例
const userData = await this.getOrSetCache(
  `user:${userId}`,
  () => getUserFromDatabase(userId),
  TTL.MEDIUM // 1小时缓存
);
```

### 4. 认证和授权

#### JWT认证流程
1. 用户登录获取token
2. 请求携带Bearer token
3. 中间件验证token并附加用户信息
4. 路由根据用户角色和权限控制访问

```javascript
// 路由保护示例
router.get('/profile', requireAuth, userController.getProfile);
router.get('/admin/users', requireAdmin, adminController.getUsers);
router.delete('/system/cache', requireSuperAdmin, systemController.clearCache);
```

### 5. 错误处理

统一的错误处理机制：
- 使用HTTP状态码规范
- 返回结构化错误信息
- 记录详细错误日志
- 区分开发和生产环境错误信息

```javascript
// 错误响应格式
{
  "success": 0,
  "message": "操作失败",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ]
}
```

### 6. API设计规范

#### RESTful API规范
- 使用语义化的HTTP方法: GET(查询)、POST(创建)、PUT(更新)、DELETE(删除)
- URL使用名词复数: `/api/users`、`/api/products`
- 使用HTTP状态码: 200(成功)、400(客户端错误)、401(未授权)、403(禁止)、404(未找到)、500(服务器错误)

#### API分层设计
- **用户端API** (`/api/user/*`): 面向普通用户的接口
- **管理端API** (`/api/admin/*`): 面向管理员的接口
- **商户端API** (`/api/merchant/*`): 面向商户的接口

### 7. 日志规范

使用Winston分级日志：
- **error**: 错误信息，需要立即处理
- **warn**: 警告信息，潜在问题
- **info**: 重要操作信息
- **debug**: 调试信息(仅开发环境)

```javascript
// 日志使用示例
this.logger.info('用户登录成功', {
  userId: user.id,
  username: user.username,
  ip: req.ip,
  timestamp: new Date()
});

this.logger.error('数据库连接失败', {
  error: error.message,
  stack: error.stack,
  database: 'mysql'
});
```

### 8. 性能优化

- **数据库连接池**: 合理配置连接池参数
- **查询优化**: 使用索引、避免N+1查询
- **缓存策略**: 合理使用Redis缓存
- **响应压缩**: 使用gzip压缩响应数据
- **集群模式**: 生产环境启用多进程
- **静态资源缓存**: 配置不同类型文件的缓存策略

### 9. 安全最佳实践

- **Helmet中间件**: 设置安全HTTP头部
- **CORS配置**: 控制跨域访问
- **限流保护**: 防止API滥用和DDoS
- **输入验证**: 严格验证和清理用户输入
- **SQL注入防护**: 使用参数化查询
- **密码安全**: bcrypt加密存储
- **敏感信息**: 不在日志中记录敏感数据

### 10. 测试规范

- 单元测试覆盖Service层业务逻辑
- 集成测试覆盖API端点
- 使用Mock模拟外部依赖
- 测试数据使用独立的测试数据库

## 环境配置

### 开发环境
```bash
NODE_ENV=dev
PORT=3000
DB_HOST=localhost
DB_NAME=testSxx
REDIS_HOST=localhost
JWT_SECRET=your_development_jwt_secret_key
```

### 生产环境
```bash
NODE_ENV=production
CLUSTER_MODE=true
DB_POOL_MAX=50
CACHE_TTL_LONG=86400
```

## 常用命令

```bash
# 开发
npm run dev                 # 启动开发服务器(热重载)
npm run db:sync            # 同步数据库结构

# 生产
npm run start:prod         # 启动生产服务器(集群模式)
npm run start:prod:single  # 启动生产服务器(单进程)

# Docker
docker-compose up -d       # 启动完整环境
docker-compose logs -f     # 查看日志
docker-compose down        # 停止服务

# 维护
npm run health            # 健康检查
npm audit                # 安全审计
```

## 开发注意事项

1. **异步处理**: 所有数据库操作和外部API调用必须使用async/await
2. **错误边界**: 每个控制器方法都要有try-catch错误处理
3. **资源清理**: 确保数据库连接、文件句柄等资源正确释放
4. **并发控制**: 使用事务处理并发写入，避免数据不一致
5. **代码复用**: 通用功能抽取到BaseController和BaseService
6. **命名规范**: 使用驼峰命名法，常量使用大写下划线
7. **注释规范**: 复杂逻辑必须添加注释说明
8. **Git提交**: 遵循语义化提交信息规范

## 问题排查指南

1. **数据库连接失败**: 检查env配置、数据库服务状态、网络连接
2. **认证失败**: 检查JWT密钥配置、token有效期、用户状态
3. **缓存异常**: 检查Redis连接、内存使用情况
4. **性能问题**: 查看慢查询日志、检查索引、优化N+1查询
5. **内存泄漏**: 检查事件监听器、定时器、大对象引用

## AI辅助开发建议

作为AI助手，在帮助开发这个项目时，请：

1. **遵循既定架构**: 严格按照MVC分层，不要混淆各层职责
2. **继承基类**: 新的Controller和Service必须继承对应的基类
3. **使用现有工具**: 优先使用项目已有的工具函数和中间件
4. **保持一致性**: 代码风格、命名规范、错误处理保持一致
5. **考虑性能**: 合理使用缓存、优化数据库查询、避免阻塞操作
6. **注重安全**: 验证输入、防止注入、保护敏感信息
7. **完善日志**: 记录关键操作和错误信息
8. **编写注释**: 为复杂逻辑和重要功能添加清晰的注释
9. **错误处理**: 提供友好的错误信息，区分客户端和服务器错误
10. **测试覆盖**: 为新功能编写相应的测试用例

## 代码示例模板

### 创建新的Controller
```javascript
const BaseController = require('../base/BaseController');
const YourService = require('../../services/your/YourService');

class YourController extends BaseController {
  constructor() {
    super();
    this.yourService = new YourService();
  }

  // GET请求 - 获取列表
  getList = this.asyncHandler(async (req, res) => {
    this.logAction('获取列表', req);
    
    const { page, limit, offset } = this.getPaginationParams(req);
    const { sortBy, sortOrder } = this.getSortParams(req);
    
    try {
      const result = await this.yourService.getList({
        page, limit, offset, sortBy, sortOrder
      });
      
      this.sendPaginatedResponse(res, result.data, {
        page, limit, total: result.total
      });
    } catch (error) {
      this.logError('获取列表失败', error, req);
      this.sendError(res, error.message);
    }
  });

  // POST请求 - 创建资源
  create = this.asyncHandler(async (req, res) => {
    this.logAction('创建资源', req);
    
    const errors = this.validateRequiredFields(req, ['name', 'type']);
    if (errors) {
      return this.sendError(res, '参数验证失败', 400, errors);
    }
    
    try {
      const result = await this.yourService.create(req.body);
      this.sendSuccess(res, '创建成功', result, 201);
    } catch (error) {
      this.logError('创建失败', error, req);
      this.sendError(res, error.message);
    }
  });
}

module.exports = YourController;
```

### 创建新的Service
```javascript
const BaseService = require('../base/BaseService');
const { sequelize } = require('../../common');

class YourService extends BaseService {
  async getList(params) {
    const { page, limit, offset, sortBy, sortOrder } = params;
    
    // 使用缓存
    const cacheKey = `list:${page}:${limit}:${sortBy}:${sortOrder}`;
    return await this.getOrSetCache(cacheKey, async () => {
      const result = await sequelize.models.YourModel.findAndCountAll({
        limit,
        offset,
        order: [[sortBy, sortOrder]]
      });
      
      return {
        data: result.rows,
        total: result.count
      };
    }, 300); // 5分钟缓存
  }

  async create(data) {
    // 数据验证
    const validation = this.validateData(data, {
      name: { required: true, minLength: 2, maxLength: 100 },
      type: { required: true, enum: ['type1', 'type2'] }
    });
    
    if (!validation.isValid) {
      throw new Error(validation.errors[0].message);
    }
    
    // 使用事务
    return await this.executeTransaction(async (transaction) => {
      const result = await sequelize.models.YourModel.create(data, { transaction });
      
      // 清除列表缓存
      await this.clearCache(['list:*']);
      
      this.logAction('创建成功', { id: result.id });
      return result;
    }, sequelize);
  }
}

module.exports = YourService;



图片上传调用这些方法如下：

const { createUploader } = require('./uploaderFactory');

// 导出为不同业务场景预先配置好的 uploader 实例
module.exports = {
  // 商户端
  merchantUiUploader: createUploader('merchantUi'),
  merchantProductUploader: createUploader('merchantProductImage'),

  // 总台
  adminIconUploader: createUploader('adminSystemIcon'),

  // 用户端
  userAvatarUploader: createUploader('userAvatar'),
  userFeedbackUploader: createUploader('userFeedbackImage'),
};


使用业界标准的 OpenAPI 3.0 (以前称为 Swagger) 格式生成可Apifox导入的文件JSON，返回的响应体需要标明字段的意思，比如以下格式:
{
  "openapi": "3.0.0",
  "info": {
    "title": "应用模块管理 API",
    "version": "1.0.2",
    "description": "用于管理客户端（小程序/APP）底部导航模块的后台及客户端接口。此版本已包含完整的请求和响应模型，并对所有字段进行了详细说明。"
  },
  "paths": {
    "/api/admin/app-modules": {
      "get": {
        "tags": ["Admin - App Modules"],
        "summary": "后台 - 获取应用模块列表",
        "description": "获取所有应用模块的配置列表，用于后台管理界面展示。",
        "parameters": [
          { "name": "sortBy", "in": "query", "description": "排序字段 (默认: display_order)", "schema": { "type": "string" } },
          { "name": "sortOrder", "in": "query", "description": "排序方式 ASC/DESC (默认: ASC)", "schema": { "type": "string", "enum": ["ASC", "DESC"] } }
        ],
        "responses": {
          "200": {
            "description": "获取成功",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/AdminModuleListResponse" } } }
          }
        }
      }
    },
    "/api/admin/app-modules/{id}": {
      "put": {
        "tags": ["Admin - App Modules"],
        "summary": "后台 - 更新应用模块",
        "description": "更新指定ID的应用模块信息，支持上传图标文件。",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "description": "要更新的模块ID", "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "function_key": { "type": "string", "description": "功能选择的标识" },
                  "is_enabled": { "type": "integer", "description": "模块开关 (0:关闭, 1:开启)", "enum": [0, 1] },
                  "is_red_dot_enabled": { "type": "integer", "description": "小红点开关 (0:关闭, 1:开启)", "enum": [0, 1] },
                  "icon_active": { "type": "string", "format": "binary", "description": "激活状态的图标文件 (小于30KB)" },
                  "icon_inactive": { "type": "string", "format": "binary", "description": "未激活状态的图标文件 (小于30KB)" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "更新成功",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/AdminModuleUpdateResponse" } } }
          },
          "404": {
            "description": "模块未找到",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },
    "/api/admin/app-modules/{id}/status": {
      "patch": {
        "tags": ["Admin - App Modules"],
        "summary": "后台 - 快速更新模块状态",
        "description": "用于在列表页快速切换模块的启用状态或小红点状态。",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "description": "要更新的模块ID", "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "is_enabled": { "type": "integer", "description": "模块开关 (0:关闭, 1:开启)", "enum": [0, 1] },
                  "is_red_dot_enabled": { "type": "integer", "description": "小红点开关 (0:关闭, 1:开启)", "enum": [0, 1] }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "状态更新成功",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SuccessResponse" } } }
          },
          "404": {
            "description": "模块未找到",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },
    "/api/user/app-modules": {
      "get": {
        "tags": ["User - App Modules"],
        "summary": "客户端 - 获取可用导航模块",
        "description": "获取所有已启用的导航模块，供客户端（小程序/APP）渲染底部导航栏。",
        "responses": {
          "200": {
            "description": "获取成功",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ClientModuleListResponse" } } }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "AppModule": {
        "type": "object",
        "description": "应用模块数据模型 (后台管理使用)",
        "properties": {
          "id": { "type": "integer", "description": "模块的唯一主键ID", "example": 1 },
          "name": { "type": "string", "description": "模块在客户端显示的名称，例如 '首页'", "example": "首页" },
          "module_key": { "type": "string", "description": "模块的唯一英文标识，用于程序内部识别，例如 'home'", "example": "home" },
          "function_key": { "type": "string", "nullable": true, "description": "关联的具体功能标识，用于前端页面跳转或功能调用", "example": "home_page" },
          "icon_active_url": { "type": "string", "nullable": true, "description": "模块被选中时显示的图标URL地址", "example": "/uploads/icons/home_active.png" },
          "icon_inactive_url": { "type": "string", "nullable": true, "description": "模块未被选中时显示的图标URL地址", "example": "/uploads/icons/home_inactive.png" },
          "is_enabled": { "type": "integer", "enum": [0, 1], "description": "模块是否在客户端启用 (1: 启用, 0: 禁用)", "example": 1 },
          "is_red_dot_enabled": { "type": "integer", "enum": [0, 1], "description": "是否允许此模块显示小红点提示 (1: 是, 0: 否)", "example": 0 },
          "display_order": { "type": "integer", "description": "显示顺序，数字越小越靠前", "example": 1 },
          "created_at": { "type": "string", "format": "date-time", "description": "记录创建时间" },
          "updated_at": { "type": "string", "format": "date-time", "description": "记录最后更新时间" }
        }
      },
      "ClientAppModule": {
        "type": "object",
        "description": "客户端导航模块数据模型",
        "properties": {
          "name": { "type": "string", "description": "模块在客户端显示的名称", "example": "首页" },
          "module_key": { "type": "string", "description": "模块的唯一英文标识，用于前端路由", "example": "home" },
          "icon_active_url": { "type": "string", "nullable": true, "description": "选中状态的图标URL", "example": "/uploads/icons/home_active.png" },
          "icon_inactive_url": { "type": "string", "nullable": true, "description": "未选中状态的图标URL", "example": "/uploads/icons/home_inactive.png" },
          "has_red_dot": { "type": "boolean", "description": "当前是否需要显示小红点 (true: 显示, false: 不显示)", "example": false }
        }
      },
      "SuccessResponse": {
        "type": "object",
        "description": "通用的成功响应模型",
        "properties": {
          "success": { "type": "integer", "enum": [1], "description": "操作结果状态码 (1 代表成功)", "example": 1 },
          "message": { "type": "string", "description": "操作结果的描述信息", "example": "操作成功" }
        }
      },
      "ErrorResponse": {
        "type": "object",
        "description": "通用的失败响应模型",
        "properties": {
          "success": { "type": "integer", "enum": [0], "description": "操作结果状态码 (0 代表失败)", "example": 0 },
          "message": { "type": "string", "description": "操作失败的详细原因", "example": "操作失败" }
        }
      },
      "AdminModuleListResponse": {
        "type": "object",
        "description": "后台获取模块列表的响应体",
        "properties": {
          "success": { "type": "integer", "enum": [1], "description": "请求结果状态码 (1 代表成功)", "example": 1 },
          "message": { "type": "string", "description": "请求结果的描述信息", "example": "获取应用模块列表成功" },
          "data": { "type": "array", "description": "应用模块对象数组", "items": { "$ref": "#/components/schemas/AppModule" } }
        }
      },
      "AdminModuleUpdateResponse": {
        "type": "object",
        "description": "后台更新模块后的响应体",
        "properties": {
          "success": { "type": "integer", "enum": [1], "description": "请求结果状态码 (1 代表成功)", "example": 1 },
          "message": { "type": "string", "description": "请求结果的描述信息", "example": "模块更新成功" },
          "data": { "$ref": "#/components/schemas/AppModule", "description": "更新后的应用模块对象" }
        }
      },
      "ClientModuleListResponse": {
        "type": "object",
        "description": "客户端获取导航模块的响应体",
        "properties": {
          "success": { "type": "integer", "enum": [1], "description": "请求结果状态码 (1 代表成功)", "example": 1 },
          "message": { "type": "string", "description": "请求结果的描述信息", "example": "获取导航模块成功" },
          "data": { "type": "array", "description": "客户端可用的导航模块数组", "items": { "$ref": "#/components/schemas/ClientAppModule" } }
        }
      }
    }
  }
}