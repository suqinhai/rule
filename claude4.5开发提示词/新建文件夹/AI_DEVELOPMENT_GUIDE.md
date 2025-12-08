# Express API 项目 AI 开发提示词

## 📋 项目概述

这是一个企业级的 Express.js RESTful API 后端框架，采用 MVC 架构模式，支持多端（用户端、管理端、商户端）API 接口，集成了完善的安全、性能优化和监控功能。

### 核心特性
- **技术栈**: Node.js + Express.js 4.18.2 + Sequelize ORM + Mongoose ODM
- **数据库**: MySQL 8.0（关系型） + MongoDB 4.4+（文档型） + Redis 6.0+（缓存）
- **架构模式**: MVC（Model-View-Controller）+ 服务层模式
- **认证方式**: JWT Token 认证 + bcrypt 密码加密
- **API 类型**: 用户端 API、管理端 API、商户端 API（三端分离）
- **国际化**: i18next（支持中英文，可扩展）
- **日志系统**: Winston（生产环境）+ Morgan（开发环境）
- **安全防护**: Helmet、CORS、Rate Limiting、数据验证
- **性能优化**: Redis 缓存、响应压缩、连接池管理、静态资源缓存
- **容器化**: Docker + Docker Compose 支持

---

## 🏗️ 项目架构详解

### 1. 目录结构
```
express-api/
├── app/                          # 应用核心代码
│   ├── controllers/             # 控制器层（处理HTTP请求）
│   │   ├── base/               # 基础控制器
│   │   ├── admin/              # 管理端控制器
│   │   ├── user/               # 用户端控制器
│   │   └── merchant/           # 商户端控制器
│   ├── services/                # 服务层（业务逻辑）
│   │   ├── base/               # 基础服务
│   │   ├── admin/              # 管理端服务
│   │   ├── user/               # 用户端服务
│   │   ├── merchant/           # 商户端服务
│   │   └── common/             # 通用服务（邮件、文件、通知）
│   ├── models/                  # 数据模型层
│   │   ├── users/              # 用户相关模型
│   │   └── merchants/          # 商户相关模型
│   └── routes/                  # 路由层
│       ├── user-api/           # 用户端路由
│       ├── admin-api/          # 管理端路由
│       └── merchant-api/       # 商户端路由
├── middleware/                   # 中间件模块
│   ├── core/                   # 核心中间件（认证、限流、缓存、验证）
│   ├── api/                    # API 中间件栈（用户端、管理端、商户端）
│   ├── monitoring/             # 监控中间件（性能、审计）
│   └── utils/                  # 中间件工具函数
├── common/                       # 公共模块
│   ├── mysql/                  # MySQL 数据库连接
│   ├── mango/                  # MongoDB 数据库连接
│   ├── redis/                  # Redis 缓存管理
│   ├── logger/                 # 日志系统
│   ├── i18n/                   # 国际化配置
│   ├── constants/              # 常量定义
│   ├── util/                   # 工具函数
│   └── schedule/               # 定时任务
├── bin/                          # 启动脚本
│   ├── www                     # 服务启动入口
│   ├── cluster-manager.js      # 集群管理
│   └── graceful-shutdown.js    # 优雅关闭
├── env/                          # 环境配置
│   ├── dev.env                 # 开发环境
│   ├── prod.env                # 生产环境
│   └── test.env                # 测试环境
├── scripts/                      # 脚本工具
│   ├── sync-db.js              # 数据库同步
│   └── create-console-admin.js # 创建管理员
├── logs/                         # 日志文件目录
├── public/                       # 静态资源
├── app.js                        # 应用主入口
├── package.json                  # 项目依赖
├── Dockerfile                    # Docker 镜像
└── docker-compose.yml            # Docker 编排
```

### 2. MVC 架构分层

#### 请求处理流程
```
HTTP Request
    ↓
[Routes 路由层]
    ↓ (中间件: 限流、认证、验证、类型标识)
[Controllers 控制器层]
    ↓ (参数提取、格式化、调用服务)
[Services 服务层]
    ↓ (业务逻辑、事务处理、缓存策略)
[Models 数据层]
    ↓ (ORM/ODM 操作)
[Database 数据库]
    ↑
[Cache 缓存]
    ↑ (返回数据)
HTTP Response
```

#### 各层职责

**Routes 路由层** (app/routes/)
- 定义 API 端点和路径
- 应用中间件（认证、限流、验证）
- 将请求分发到对应的控制器
- 不包含业务逻辑

**Controllers 控制器层** (app/controllers/)
- 处理 HTTP 请求和响应
- 参数提取、验证和格式化
- 调用服务层方法执行业务逻辑
- 统一的响应格式（成功/失败/分页）
- 记录操作日志
- 继承自 BaseController

**Services 服务层** (app/services/)
- 包含核心业务逻辑
- 数据库事务管理
- 缓存策略实现
- 数据验证和处理
- 第三方服务集成
- 可被多个控制器复用
- 继承自 BaseService

**Models 数据层** (app/models/)
- 定义数据模型和表结构
- ORM/ODM 映射
- 数据库查询方法
- 数据关联关系

---

## 🔌 三端 API 架构设计

### 1. API 端点分类

#### 用户端 API (`/api/user/*`)
**用途**: 面向普通终端用户的接口
**认证**: JWT Token（部分接口支持可选认证）
**限流**: 相对宽松（1000 req/15min）
**特点**:
- 注重用户体验和响应速度
- 支持缓存优化高频查询
- 敏感操作需要额外验证

**典型接口**:
```javascript
POST   /api/user/auth/login           // 用户登录
POST   /api/user/auth/register        // 用户注册
GET    /api/user/auth/profile         // 获取个人资料
PUT    /api/user/auth/profile         // 更新个人资料
POST   /api/user/auth/change-password // 修改密码
```

#### 管理端 API (`/api/admin/*`)
**用途**: 面向系统管理员的后台管理接口
**认证**: 管理员 JWT Token（严格权限验证）
**限流**: 相对严格（500 req/15min）
**特点**:
- 严格的权限控制和角色验证
- 完整的操作审计日志
- 支持批量操作和数据导出
- 敏感操作需要二次确认

**典型接口**:
```javascript
POST   /api/admin/auth/login                    // 管理员登录
GET    /api/admin/merchant                      // 获取商户列表
GET    /api/admin/merchant/:id                  // 获取商户详情
PUT    /api/admin/merchant/:id/status           // 更新商户状态
DELETE /api/admin/merchant/:id                  // 删除商户
POST   /api/admin/merchant/batch                // 批量操作
GET    /api/admin/merchant/export               // 导出数据
```

#### 商户端 API (`/api/merchant/*`)
**用途**: 面向商户用户的商户管理接口
**认证**: 商户 JWT Token
**限流**: 适中（750 req/15min）
**特点**:
- 商户数据隔离
- 商品和订单管理
- 店铺访问权限控制
- 业务数据分析

**典型接口**:
```javascript
POST   /api/merchant/auth/login          // 商户登录
GET    /api/merchant/auth/profile        // 获取商户资料
GET    /api/merchant/products            // 获取商品列表
POST   /api/merchant/products            // 创建商品
PUT    /api/merchant/products/:id        // 更新商品
DELETE /api/merchant/products/:id        // 删除商品
GET    /api/merchant/orders               // 获取订单列表
```

### 2. 中间件栈配置

#### 用户端中间件栈
```javascript
// 公开接口（无需认证）
middleware.stacks.user.public
  - generalApiType        // API类型标识
  - userRateLimit        // 用户端限流

// 需认证接口
middleware.stacks.user.authenticated
  - generalApiType        // API类型标识
  - requireAuth          // JWT认证
  - userRateLimit        // 用户端限流

// 可选认证接口
middleware.stacks.user.optionalAuth
  - generalApiType        // API类型标识
  - baseAuth             // 可选认证
  - userRateLimit        // 用户端限流

// 缓存接口
middleware.stacks.user.cached
  - generalApiType        // API类型标识
  - requireAuth          // JWT认证
  - userDataCache        // 数据缓存
  - userRateLimit        // 用户端限流

// 敏感操作接口
middleware.stacks.user.sensitive
  - generalApiType        // API类型标识
  - requireAuth          // JWT认证
  - loginRateLimit       // 严格限流
  - basicAudit           // 操作审计
```

#### 管理端中间件栈
```javascript
// 标准管理接口
middleware.stacks.admin.standard
  - adminApiType          // API类型标识
  - requireAdmin         // 管理员认证
  - adminRateLimit       // 管理端限流
  - basicAudit           // 操作审计

// 敏感操作接口
middleware.stacks.admin.sensitive
  - adminApiType          // API类型标识
  - requireAdmin         // 管理员认证
  - strictRateLimit      // 严格限流
  - adminOperationAudit  // 敏感操作审计

// 超级管理员接口
middleware.stacks.admin.superAdmin
  - adminApiType          // API类型标识
  - requireSuperAdmin    // 超级管理员认证
  - strictRateLimit      // 严格限流
  - sensitiveOperationAudit // 敏感操作审计
```

#### 商户端中间件栈
```javascript
// 商户认证接口
middleware.stacks.merchant.authenticated
  - merchantApiType       // API类型标识
  - requireAuth          // JWT认证
  - merchantRateLimit    // 商户端限流

// 商品管理接口
middleware.stacks.merchant.product
  - merchantApiType       // API类型标识
  - requireAuth          // JWT认证
  - productRateLimit     // 商品操作限流
  - productCache         // 商品数据缓存

// 店铺访问控制接口
middleware.stacks.merchant.shopAccess
  - merchantApiType       // API类型标识
  - requireAuth          // JWT认证
  - shopAccessControl    // 店铺权限验证
  - merchantRateLimit    // 商户端限流
```

---

## 🔐 认证与授权系统

### 1. JWT Token 认证流程

#### Token 生成
```javascript
// 生成 JWT Token (app/services/*/AuthService.js)
const token = jwt.sign(
  {
    id: user.id,
    username: user.username,
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }  // Token 有效期 7 天
);
```

#### Token 验证（middleware/core/auth.js）
```javascript
// 1. 从请求头提取 Token
Authorization: Bearer <token>

// 2. 验证 Token 有效性
const decoded = jwt.verify(token, JWT_SECRET);

// 3. 从缓存/数据库获取用户信息
const user = await CacheManager.getOrFetch(
  PREFIX.USER,
  decoded.id,
  () => getUserById(decoded.id),
  TTL.MEDIUM
);

// 4. 检查用户状态
if (!StatusHelper.isUserActive(user.status)) {
  return res.sendUnauthorized('用户状态异常');
}

// 5. 将用户信息附加到请求对象
req.user = user;
req.isAuthenticated = AUTH_STATUS.AUTHENTICATED;
```

### 2. 认证中间件

#### baseAuth（可选认证）
```javascript
// 用法：不强制要求登录，但会尝试识别用户
router.get('/posts', middleware.quick.baseAuth, controller.getPosts);

// 特点：
// - Token 无效时不会拦截请求
// - req.user 可能为 null
// - 适用于公开内容但需要区分登录状态的场景
```

#### requireAuth（必须认证）
```javascript
// 用法：必须登录才能访问
router.get('/profile', middleware.quick.requireAuth, controller.getProfile);

// 特点：
// - Token 无效时返回 401 Unauthorized
// - 保证 req.user 存在且有效
// - 适用于个人数据和操作
```

#### requireAdmin（管理员认证）
```javascript
// 用法：必须是管理员才能访问
router.get('/users', middleware.quick.requireAdmin, controller.getUsers);

// 特点：
// - 检查 user.role === USER_ROLE.ADMIN (30)
// - Token 无效或非管理员返回 401 Unauthorized
// - 适用于后台管理接口
```

#### requirePermissions（权限验证）
```javascript
// 用法：需要特定权限才能访问
router.delete('/users/:id',
  middleware.quick.requirePermissions(['user:delete'], { requireAll: false }),
  controller.deleteUser
);

// 特点：
// - 支持单个或多个权限
// - requireAll: true 时需要所有权限，false 时只需任一权限
// - 自动检查用户状态和权限列表
```

### 3. 权限系统设计

#### 角色定义（common/constants/status.js）
```javascript
const USER_ROLE = {
  USER: 10,        // 普通用户
  MERCHANT: 20,    // 商户
  ADMIN: 30,       // 管理员
  SUPER_ADMIN: 40  // 超级管理员
};
```

#### 权限检查示例
```javascript
// 在服务层或控制器中检查权限
if (req.user.role < USER_ROLE.ADMIN) {
  return res.sendUnauthorized('权限不足');
}

// 使用权限中间件
const canManageUsers = middleware.factories.createAdminPermissionStack({
  permissions: ['user:read', 'user:write', 'user:delete'],
  requireAll: false  // 只需要任一权限
});

router.put('/users/:id', canManageUsers, controller.updateUser);
```

---

## 💾 数据库设计与使用

### 1. MySQL（关系型数据库）

#### 配置（common/mysql/index.js）
```javascript
// 连接池配置
pool: {
  max: 20,      // 最大连接数
  min: 5,       // 最小连接数
  acquire: 30000, // 获取连接超时
  idle: 10000    // 空闲超时
}

// 访问方式
res.sequelize  // 在路由中通过 res 对象访问
```

#### 模型定义示例（app/models/users/user.js）
```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 10,  // USER_ROLE.USER
      comment: '10:用户, 20:商户, 30:管理员, 40:超级管理员'
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,  // USER_STATUS.ACTIVE
      comment: '1:正常, 2:禁用, 3:锁定, 4:待激活'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: false,
    indexes: [
      { fields: ['username'] },
      { fields: ['email'] },
      { fields: ['status'] }
    ]
  });

  return User;
};
```

#### 数据库操作示例
```javascript
// 在服务层操作数据库
class UserService extends BaseService {
  async createUser(userData, sequelize) {
    // 使用事务
    return await this.executeTransaction(async (transaction) => {
      const user = await sequelize.models.User.create(userData, { transaction });
      return user;
    }, sequelize);
  }

  async getUserById(userId, sequelize) {
    // 使用缓存
    return await this.getOrSetCache(
      `user:${userId}`,
      async () => {
        return await sequelize.models.User.findByPk(userId);
      },
      3600  // 缓存 1 小时
    );
  }

  async getUsers(filters, pagination, sequelize) {
    const { page, limit, offset } = pagination;

    const { count, rows } = await sequelize.models.User.findAndCountAll({
      where: this.buildWhereCondition(filters, ['status', 'role']),
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return { users: rows, total: count };
  }
}
```

### 2. MongoDB（文档型数据库）

#### 配置（common/mango/index.js）
```javascript
// 连接配置
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  minPoolSize: 2
});

// 访问方式
res.mongodb.mongoose  // Mongoose 实例
res.mongodb.mongoose.connection.db  // 原生 MongoDB 驱动
```

#### 使用场景
- 日志存储（操作日志、审计日志）
- 非结构化数据（用户行为追踪）
- 临时数据（会话数据）
- 大数据量读写（消息记录）

#### 操作示例
```javascript
// 在路由中直接使用 MongoDB
router.post('/logs', async (req, res) => {
  const { mongoose } = res.mongodb;

  const result = await mongoose.connection.db
    .collection('operation_logs')
    .insertOne({
      user_id: req.user.id,
      action: req.body.action,
      details: req.body.details,
      ip: req.ip,
      timestamp: new Date()
    });

  res.sendSuccess('日志保存成功', { id: result.insertedId });
});

// 查询日志
router.get('/logs', async (req, res) => {
  const { mongoose } = res.mongodb;
  const { page = 1, limit = 20 } = req.query;

  const logs = await mongoose.connection.db
    .collection('operation_logs')
    .find({ user_id: req.user.id })
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .toArray();

  res.sendSuccess('获取日志成功', { data: logs });
});
```

### 3. Redis（缓存系统）

#### 配置（common/redis/index.js）
```javascript
// 连接配置
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

// 缓存前缀
const PREFIX = {
  USER: 'user:',
  TOKEN: 'token:',
  SESSION: 'session:',
  CACHE: 'cache:'
};

// TTL 配置
const TTL = {
  SHORT: 300,      // 5 分钟
  MEDIUM: 3600,    // 1 小时
  LONG: 86400,     // 1 天
  WEEK: 604800     // 7 天
};
```

#### 缓存管理器（common/redis/cache.js）
```javascript
class CacheManager {
  // 获取缓存
  static async get(prefix, key) {
    const data = await redis.get(`${prefix}${key}`);
    return data ? JSON.parse(data) : null;
  }

  // 设置缓存
  static async set(prefix, key, value, ttl = TTL.MEDIUM) {
    await redis.setex(
      `${prefix}${key}`,
      ttl,
      JSON.stringify(value)
    );
  }

  // 删除缓存
  static async del(prefix, key) {
    await redis.del(`${prefix}${key}`);
  }

  // 获取或设置缓存（缓存穿透保护）
  static async getOrFetch(prefix, key, fetchFunction, ttl = TTL.MEDIUM) {
    let data = await this.get(prefix, key);

    if (data === null) {
      data = await fetchFunction();
      if (data) {
        await this.set(prefix, key, data, ttl);
      }
    }

    return data;
  }

  // 批量删除缓存（支持通配符）
  static async delPattern(pattern) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
```

#### 缓存使用示例
```javascript
// 在服务层使用缓存
class ProductService extends BaseService {
  async getProductById(productId) {
    // 先从缓存获取
    return await this.cache.getOrFetch(
      'product',
      productId,
      async () => {
        // 缓存未命中，从数据库查询
        return await ProductModel.findByPk(productId);
      },
      TTL.LONG  // 商品数据缓存 1 天
    );
  }

  async updateProduct(productId, updateData) {
    // 更新数据库
    await ProductModel.update(updateData, { where: { id: productId } });

    // 清除缓存
    await this.cache.del('product', productId);

    // 清除相关列表缓存
    await this.cache.delPattern('product:list:*');
  }
}

// 在中间件中使用缓存
const cacheMiddleware = middleware.quick.createCacheMiddleware({
  prefix: 'api',
  ttl: TTL.SHORT,
  key: (req) => `${req.originalUrl}:${req.user?.id || 'guest'}`
});

router.get('/products', cacheMiddleware, controller.getProducts);
```

---

## 🛡️ 中间件系统详解

### 1. 核心中间件（middleware/core/）

#### 认证中间件（auth.js）
```javascript
// 基础认证（不强制登录）
middleware.quick.baseAuth

// 必须认证
middleware.quick.requireAuth

// 管理员认证
middleware.quick.requireAdmin

// 权限验证
middleware.quick.requirePermissions(['user:read', 'user:write'], {
  requireAll: false,  // 只需任一权限
  requireAuth: true   // 必须登录
})
```

#### 限流中间件（rateLimit.js）
```javascript
// 预定义限流策略
middleware.quick.userRateLimit       // 1000 req/15min
middleware.quick.adminRateLimit      // 500 req/15min
middleware.quick.strictRateLimit     // 100 req/15min
middleware.quick.loginRateLimit      // 5 req/15min（登录接口）

// 自定义限流
const customRateLimit = middleware.factories.createRateLimit({
  windowMs: 15 * 60 * 1000,  // 15 分钟
  max: 100,                   // 最多 100 次请求
  message: '请求过于频繁，请稍后再试',
  keyGenerator: (req) => req.user?.id || req.ip  // 按用户或 IP 限流
});

router.post('/api/upload', customRateLimit, controller.upload);
```

#### 缓存中间件（cache.js）
```javascript
// 预定义缓存策略
middleware.quick.userDataCache      // 用户数据缓存（TTL: 1小时）
middleware.quick.adminDataCache     // 管理数据缓存（TTL: 5分钟）
middleware.quick.staticDataCache    // 静态数据缓存（TTL: 1天）

// 自定义缓存
const productCache = middleware.quick.createCacheMiddleware({
  prefix: 'product',
  ttl: 3600,
  key: (req) => `list:${req.query.category || 'all'}:${req.query.page || 1}`,
  condition: (req) => req.method === 'GET'  // 只缓存 GET 请求
});

router.get('/products', productCache, controller.getProducts);
```

#### 验证中间件（validator.js）
```javascript
const { validate, rules } = middleware.quick;

// 使用预定义规则
router.post('/register',
  validate([
    rules.username(),
    rules.email(),
    rules.password(),
    rules.phone()
  ]),
  controller.register
);

// 自定义验证规则
router.post('/products',
  validate([
    body('name').notEmpty().withMessage('商品名称不能为空'),
    body('price').isFloat({ min: 0 }).withMessage('价格必须大于0'),
    body('category').isIn(['电子', '服装', '食品']).withMessage('分类无效')
  ]),
  controller.createProduct
);
```

### 2. 监控中间件（middleware/monitoring/）

#### 性能监控（performance.js）
```javascript
// 应用性能监控中间件
router.use(middleware.quick.performanceMonitor);

// 获取性能统计
const stats = middleware.management.getPerformanceStats();
// {
//   totalRequests: 10000,
//   averageResponseTime: 120,  // ms
//   slowestEndpoints: [
//     { path: '/api/reports', avgTime: 2500 },
//     { path: '/api/analytics', avgTime: 1800 }
//   ]
// }

// 生成性能报告
const report = middleware.management.generatePerformanceReport();
```

#### 审计日志（audit.js）
```javascript
// 基础审计（记录所有请求）
middleware.quick.basicAudit

// 管理员操作审计
middleware.quick.adminOperationAudit

// 敏感操作审计
const sensitiveAudit = middleware.factories.createAudit({
  level: 'high',
  includeBody: true,    // 记录请求体
  includeResponse: true, // 记录响应
  storage: 'database'   // 存储到数据库
});

router.delete('/users/:id',
  middleware.stacks.admin.sensitive,
  sensitiveAudit,
  controller.deleteUser
);
```

### 3. API 中间件栈（middleware/api/）

#### 使用预定义栈
```javascript
// 用户端
router.get('/posts', middleware.stacks.user.public, controller.getPosts);
router.get('/profile', middleware.stacks.user.authenticated, controller.getProfile);
router.get('/feed', middleware.stacks.user.cached, controller.getFeed);
router.post('/payment', middleware.stacks.user.sensitive, controller.payment);

// 管理端
router.get('/users', middleware.stacks.admin.standard, controller.getUsers);
router.delete('/users/:id', middleware.stacks.admin.sensitive, controller.deleteUser);
router.post('/system/reset', middleware.stacks.admin.superAdmin, controller.resetSystem);

// 商户端
router.get('/products', middleware.stacks.merchant.cached, controller.getProducts);
router.post('/products', middleware.stacks.merchant.product, controller.createProduct);
router.get('/shop/:id/orders', middleware.stacks.merchant.shopAccess, controller.getOrders);
```

#### 自定义中间件栈
```javascript
// 创建自定义用户端栈
const customUserStack = middleware.factories.createUserStack({
  auth: 'required',          // 必须认证
  limiting: 'relaxed',       // 宽松限流
  caching: 'medium',         // 中等缓存
  audit: 'basic'            // 基础审计
});

router.get('/custom', customUserStack, controller.custom);

// 创建自定义管理端栈
const customAdminStack = middleware.factories.createAdminStack({
  auth: 'superAdmin',        // 超级管理员
  limiting: 'strict',        // 严格限流
  audit: 'sensitive',        // 敏感操作审计
  performance: true          // 性能监控
});

router.post('/critical', customAdminStack, controller.criticalOperation);
```

---

## 📝 开发规范与最佳实践

### 1. 代码组织规范

#### 创建新功能的步骤

**步骤 1: 定义数据模型**
```javascript
// app/models/products/product.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(50)
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1  // 1:上架, 2:下架
    }
  }, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Product;
};

// app/models/index.js - 注册模型
const productModel = require('./products/product');

const models = {
  userModel: userModel(sequelize),
  productModel: productModel(sequelize),  // 新增
};
```

**步骤 2: 创建服务层**
```javascript
// app/services/product/ProductService.js
const BaseService = require('../base/BaseService');
const { PRODUCT_STATUS } = require('../../../common/constants/status');

class ProductService extends BaseService {
  /**
   * 创建商品
   */
  async createProduct(productData, sequelize) {
    this.logAction('createProduct', { name: productData.name });

    // 数据验证
    const validation = this.validateData(productData, {
      name: { required: true, maxLength: 100 },
      price: { required: true, type: 'number', min: 0 }
    });

    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // 使用事务创建
    return await this.executeTransaction(async (transaction) => {
      const product = await sequelize.models.Product.create(productData, { transaction });

      // 清除相关缓存
      await this.clearCache(['product:list', `product:category:${productData.category}`]);

      return product;
    }, sequelize);
  }

  /**
   * 获取商品详情（带缓存）
   */
  async getProductById(productId, sequelize) {
    return await this.getOrSetCache(
      `product:${productId}`,
      async () => {
        return await sequelize.models.Product.findByPk(productId);
      },
      3600  // 缓存1小时
    );
  }

  /**
   * 获取商品列表（分页）
   */
  async getProducts(filters, pagination, sequelize) {
    const { page, limit, offset } = pagination;

    const where = this.buildWhereCondition(filters, ['category', 'status']);

    const { count, rows } = await sequelize.models.Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      products: rows,
      total: count
    };
  }

  /**
   * 更新商品
   */
  async updateProduct(productId, updateData, sequelize) {
    return await this.executeTransaction(async (transaction) => {
      const product = await sequelize.models.Product.findByPk(productId, { transaction });

      if (!product) {
        throw new Error('商品不存在');
      }

      await product.update(updateData, { transaction });

      // 清除缓存
      await this.clearCache([`product:${productId}`, 'product:list']);

      return product;
    }, sequelize);
  }

  /**
   * 删除商品（软删除）
   */
  async deleteProduct(productId, sequelize) {
    return await this.updateProduct(productId, {
      status: PRODUCT_STATUS.DELETED
    }, sequelize);
  }
}

module.exports = new ProductService();
```

**步骤 3: 创建控制器**
```javascript
// app/controllers/product/ProductController.js
const BaseController = require('../base/BaseController');
const ProductService = require('../../services/product/ProductService');

class ProductController extends BaseController {
  /**
   * 创建商品
   */
  createProduct = this.asyncHandler(async (req, res) => {
    // 参数验证
    const errors = this.validateRequiredFields(req, ['name', 'price']);
    if (errors) {
      return this.sendError(res, '参数验证失败', 400, errors);
    }

    // 记录操作
    this.logAction('创建商品', req, { name: req.body.name });

    // 调用服务
    const product = await ProductService.createProduct(req.body, res.sequelize);

    // 返回响应
    return this.sendSuccess(res, '商品创建成功', product, 201);
  });

  /**
   * 获取商品详情
   */
  getProduct = this.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await ProductService.getProductById(id, res.sequelize);

    if (!product) {
      return this.sendError(res, '商品不存在', 404);
    }

    return this.sendSuccess(res, '获取商品成功', product);
  });

  /**
   * 获取商品列表（分页）
   */
  getProducts = this.asyncHandler(async (req, res) => {
    // 获取分页参数
    const pagination = this.getPaginationParams(req);

    // 获取排序参数
    const sort = this.getSortParams(req);

    // 获取筛选条件
    const filters = {
      category: req.query.category,
      status: req.query.status
    };

    // 调用服务
    const { products, total } = await ProductService.getProducts(
      filters,
      pagination,
      res.sequelize
    );

    // 返回分页响应
    return this.sendPaginatedResponse(res, products, { ...pagination, total });
  });

  /**
   * 更新商品
   */
  updateProduct = this.asyncHandler(async (req, res) => {
    const { id } = req.params;

    this.logAction('更新商品', req, { id, data: req.body });

    const product = await ProductService.updateProduct(id, req.body, res.sequelize);

    return this.sendSuccess(res, '商品更新成功', product);
  });

  /**
   * 删除商品
   */
  deleteProduct = this.asyncHandler(async (req, res) => {
    const { id } = req.params;

    this.logAction('删除商品', req, { id });

    await ProductService.deleteProduct(id, res.sequelize);

    return this.sendSuccess(res, '商品删除成功');
  });
}

module.exports = new ProductController();
```

**步骤 4: 创建路由**
```javascript
// app/routes/merchant-api/products/index.js
const express = require('express');
const router = express.Router();
const ProductController = require('../../../controllers/product/ProductController');
const { validate, rules } = require('../../../../middleware').quick;
const middleware = require('../../../../middleware');

// 获取商品列表（公开，带缓存）
router.get('/',
  middleware.stacks.merchant.cached,
  ProductController.getProducts
);

// 获取商品详情（公开，带缓存）
router.get('/:id',
  middleware.stacks.merchant.cached,
  ProductController.getProduct
);

// 创建商品（需要认证）
router.post('/',
  middleware.stacks.merchant.product,
  validate([
    rules.required('name', '商品名称'),
    rules.required('price', '商品价格'),
    rules.numeric('price', '价格')
  ]),
  ProductController.createProduct
);

// 更新商品（需要认证）
router.put('/:id',
  middleware.stacks.merchant.product,
  ProductController.updateProduct
);

// 删除商品（需要认证，严格限流）
router.delete('/:id',
  middleware.stacks.merchant.sensitive,
  ProductController.deleteProduct
);

module.exports = router;

// app/routes/merchant-api/index.js - 注册路由
const productRouter = require('./products');
router.use('/products', productRouter);
```

### 2. 响应格式规范

#### 成功响应
```javascript
// 基本成功响应
res.sendSuccess('操作成功');
// {
//   "success": 1,
//   "message": "操作成功"
// }

// 带数据的成功响应
res.sendSuccess('获取数据成功', { data: user });
// {
//   "success": 1,
//   "message": "获取数据成功",
//   "data": { id: 1, username: "john" }
// }

// 分页响应
controller.sendPaginatedResponse(res, items, { page, limit, total });
// {
//   "success": 1,
//   "message": "获取数据成功",
//   "data": {
//     "items": [...],
//     "pagination": {
//       "page": 1,
//       "limit": 20,
//       "total": 100,
//       "totalPages": 5,
//       "hasNext": 1,
//       "hasPrev": 0
//     }
//   }
// }
```

#### 错误响应
```javascript
// 基本错误响应
res.sendError('操作失败', 400);
// {
//   "success": 0,
//   "message": "操作失败",
//   "timestamp": "2024-01-01T00:00:00.000Z"
// }

// 带详细错误的响应
controller.sendError(res, '验证失败', 400, [
  { field: 'username', message: 'username 是必需的' },
  { field: 'email', message: 'email 格式不正确' }
]);
// {
//   "success": 0,
//   "message": "验证失败",
//   "timestamp": "2024-01-01T00:00:00.000Z",
//   "errors": [
//     { "field": "username", "message": "username 是必需的" },
//     { "field": "email", "message": "email 格式不正确" }
//   ]
// }

// 未授权响应
res.sendUnauthorized('需要登录');
// {
//   "success": 0,
//   "message": "需要登录",
//   "timestamp": "2024-01-01T00:00:00.000Z"
// }

// 错误请求响应
res.sendBadRequest('参数错误');
// {
//   "success": 0,
//   "message": "参数错误",
//   "timestamp": "2024-01-01T00:00:00.000Z"
// }
```

### 3. 错误处理规范

#### 服务层错误处理
```javascript
class UserService extends BaseService {
  async createUser(userData, sequelize) {
    try {
      // 数据验证
      const validation = this.validateData(userData, {
        username: { required: true, minLength: 3, maxLength: 50 },
        email: { required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ }
      });

      if (!validation.isValid) {
        throw new ValidationError('数据验证失败', validation.errors);
      }

      // 检查用户名是否存在
      const existingUser = await sequelize.models.User.findOne({
        where: { username: userData.username }
      });

      if (existingUser) {
        throw new ConflictError('用户名已存在');
      }

      // 创建用户
      return await this.executeTransaction(async (transaction) => {
        const user = await sequelize.models.User.create(userData, { transaction });
        return user;
      }, sequelize);

    } catch (error) {
      this.logError('createUser', error);
      throw error;  // 重新抛出，让控制器处理
    }
  }
}
```

#### 控制器层错误处理
```javascript
class UserController extends BaseController {
  createUser = this.asyncHandler(async (req, res) => {
    try {
      const user = await UserService.createUser(req.body, res.sequelize);
      return this.sendSuccess(res, '用户创建成功', user, 201);
    } catch (error) {
      this.logError('创建用户', error, req);

      // 根据错误类型返回不同响应
      if (error instanceof ValidationError) {
        return this.sendError(res, error.message, 400, error.errors);
      }

      if (error instanceof ConflictError) {
        return this.sendError(res, error.message, 409);
      }

      // 未知错误
      return this.sendError(res, '创建用户失败', 500);
    }
  });
}
```

#### 全局错误处理（middleware/core/errorHandler.js）
```javascript
// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

class ValidationError extends AppError {
  constructor(message, errors) {
    super(message, 400, errors);
  }
}

class AuthenticationError extends AppError {
  constructor(message = '未授权') {
    super(message, 401);
  }
}

class NotFoundError extends AppError {
  constructor(message = '资源不存在') {
    super(message, 404);
  }
}

// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  logger.error('全局错误捕获:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id
  });

  // 处理自定义错误
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: COMMON_STATUS.FAILED,
      message: err.message,
      errors: err.errors,
      timestamp: new Date().toISOString()
    });
  }

  // 处理 Sequelize 错误
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: COMMON_STATUS.FAILED,
      message: '数据验证失败',
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }

  // 默认错误响应
  res.status(500).json({
    success: COMMON_STATUS.FAILED,
    message: process.env.NODE_ENV === 'dev' ? err.message : '服务器内部错误',
    timestamp: new Date().toISOString()
  });
};
```

### 4. 日志记录规范

#### 日志级别
```javascript
// error: 错误日志（系统错误、异常）
logger.error('数据库连接失败', { error: err.message, stack: err.stack });

// warn: 警告日志（潜在问题、废弃功能）
logger.warn('API即将废弃', { endpoint: '/old-api', newEndpoint: '/new-api' });

// info: 信息日志（重要操作、状态变化）
logger.info('用户登录', { userId: user.id, ip: req.ip });

// debug: 调试日志（开发调试信息）
logger.debug('缓存命中', { key: cacheKey, ttl: 3600 });
```

#### 日志内容规范
```javascript
// 在服务层记录业务日志
class OrderService extends BaseService {
  async createOrder(orderData, sequelize) {
    this.logAction('createOrder', {
      userId: orderData.userId,
      amount: orderData.amount,
      itemCount: orderData.items.length
    });

    try {
      const order = await this.executeTransaction(async (transaction) => {
        // 创建订单逻辑
        const order = await sequelize.models.Order.create(orderData, { transaction });

        this.logger.info('订单创建成功', {
          orderId: order.id,
          userId: orderData.userId,
          amount: orderData.amount
        });

        return order;
      }, sequelize);

      return order;
    } catch (error) {
      this.logError('createOrder', error, {
        userId: orderData.userId,
        amount: orderData.amount
      });
      throw error;
    }
  }
}

// 在控制器层记录操作日志
class OrderController extends BaseController {
  createOrder = this.asyncHandler(async (req, res) => {
    this.logAction('创建订单', req, {
      itemCount: req.body.items?.length,
      amount: req.body.amount
    });

    try {
      const order = await OrderService.createOrder(req.body, res.sequelize);
      return this.sendSuccess(res, '订单创建成功', order);
    } catch (error) {
      this.logError('创建订单', error, req);
      return this.sendError(res, '订单创建失败', 500);
    }
  });
}
```

---

## 🚀 AI 开发指导

### 当你需要为这个项目开发新功能时，请按以下步骤进行：

#### 1. 理解需求
- 确定功能属于哪个端（用户端/管理端/商户端）
- 明确功能的业务逻辑和数据流
- 确定需要的权限和安全级别

#### 2. 设计数据模型
- 在 `app/models/` 创建 Sequelize 模型
- 定义字段、类型、索引、关联关系
- 在 `app/models/index.js` 注册模型

#### 3. 实现服务层
- 在 `app/services/` 创建服务类，继承 `BaseService`
- 实现业务逻辑方法
- 使用事务处理复杂操作
- 实现缓存策略
- 添加数据验证
- 记录操作日志

#### 4. 实现控制器层
- 在 `app/controllers/` 创建控制器类，继承 `BaseController`
- 使用 `asyncHandler` 包装异步方法
- 处理参数验证
- 调用服务层方法
- 返回统一格式响应
- 记录操作日志和错误

#### 5. 配置路由
- 在 `app/routes/` 对应的端创建路由文件
- 选择合适的中间件栈
- 定义路由路径和 HTTP 方法
- 应用验证中间件
- 连接控制器方法

#### 6. 测试验证
- 测试各种场景（成功、失败、边界）
- 验证权限控制
- 检查错误处理
- 测试性能和缓存

### 代码示例模板

#### 服务层模板
```javascript
// app/services/[module]/[Module]Service.js
const BaseService = require('../base/BaseService');

class ModuleService extends BaseService {
  async create(data, sequelize) {
    this.logAction('create', { name: data.name });

    const validation = this.validateData(data, {
      name: { required: true, maxLength: 100 }
    });

    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    return await this.executeTransaction(async (transaction) => {
      const item = await sequelize.models.Module.create(data, { transaction });
      await this.clearCache(['module:list']);
      return item;
    }, sequelize);
  }

  async getById(id, sequelize) {
    return await this.getOrSetCache(
      `module:${id}`,
      async () => await sequelize.models.Module.findByPk(id),
      3600
    );
  }

  async getList(filters, pagination, sequelize) {
    const { page, limit, offset } = pagination;
    const where = this.buildWhereCondition(filters, ['status', 'category']);

    const { count, rows } = await sequelize.models.Module.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return { items: rows, total: count };
  }

  async update(id, data, sequelize) {
    return await this.executeTransaction(async (transaction) => {
      const item = await sequelize.models.Module.findByPk(id, { transaction });
      if (!item) throw new Error('记录不存在');
      await item.update(data, { transaction });
      await this.clearCache([`module:${id}`, 'module:list']);
      return item;
    }, sequelize);
  }

  async delete(id, sequelize) {
    return await this.update(id, { status: 0 }, sequelize);
  }
}

module.exports = new ModuleService();
```

#### 控制器模板
```javascript
// app/controllers/[module]/[Module]Controller.js
const BaseController = require('../base/BaseController');
const ModuleService = require('../../services/[module]/[Module]Service');

class ModuleController extends BaseController {
  create = this.asyncHandler(async (req, res) => {
    const errors = this.validateRequiredFields(req, ['name']);
    if (errors) return this.sendError(res, '参数验证失败', 400, errors);

    this.logAction('创建', req, { name: req.body.name });

    const item = await ModuleService.create(req.body, res.sequelize);
    return this.sendSuccess(res, '创建成功', item, 201);
  });

  getById = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await ModuleService.getById(id, res.sequelize);
    if (!item) return this.sendError(res, '记录不存在', 404);
    return this.sendSuccess(res, '获取成功', item);
  });

  getList = this.asyncHandler(async (req, res) => {
    const pagination = this.getPaginationParams(req);
    const filters = { status: req.query.status };

    const { items, total } = await ModuleService.getList(
      filters,
      pagination,
      res.sequelize
    );

    return this.sendPaginatedResponse(res, items, { ...pagination, total });
  });

  update = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    this.logAction('更新', req, { id });

    const item = await ModuleService.update(id, req.body, res.sequelize);
    return this.sendSuccess(res, '更新成功', item);
  });

  delete = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    this.logAction('删除', req, { id });

    await ModuleService.delete(id, res.sequelize);
    return this.sendSuccess(res, '删除成功');
  });
}

module.exports = new ModuleController();
```

#### 路由模板
```javascript
// app/routes/[端]-api/[module]/index.js
const express = require('express');
const router = express.Router();
const ModuleController = require('../../../controllers/[module]/[Module]Controller');
const middleware = require('../../../../middleware');
const { validate, rules } = middleware.quick;

// 获取列表（带缓存）
router.get('/',
  middleware.stacks.[端].cached,
  ModuleController.getList
);

// 获取详情（带缓存）
router.get('/:id',
  middleware.stacks.[端].cached,
  ModuleController.getById
);

// 创建（需要认证）
router.post('/',
  middleware.stacks.[端].authenticated,
  validate([
    rules.required('name', '名称')
  ]),
  ModuleController.create
);

// 更新（需要认证）
router.put('/:id',
  middleware.stacks.[端].authenticated,
  ModuleController.update
);

// 删除（敏感操作）
router.delete('/:id',
  middleware.stacks.[端].sensitive,
  ModuleController.delete
);

module.exports = router;
```

---

## 🔍 常见问题解答

### Q1: 如何选择合适的中间件栈？

**用户端**:
- 公开接口 → `middleware.stacks.user.public`
- 需要登录 → `middleware.stacks.user.authenticated`
- 可选登录 → `middleware.stacks.user.optionalAuth`
- 高频查询 → `middleware.stacks.user.cached`
- 敏感操作 → `middleware.stacks.user.sensitive`

**管理端**:
- 普通管理 → `middleware.stacks.admin.standard`
- 敏感操作 → `middleware.stacks.admin.sensitive`
- 超级管理员 → `middleware.stacks.admin.superAdmin`

**商户端**:
- 需要认证 → `middleware.stacks.merchant.authenticated`
- 商品管理 → `middleware.stacks.merchant.product`
- 店铺权限 → `middleware.stacks.merchant.shopAccess`

### Q2: 何时使用缓存？

**应该缓存**:
- 高频查询的数据（用户信息、商品列表）
- 计算成本高的数据（统计数据、排行榜）
- 变化频率低的数据（配置信息、分类列表）

**不应该缓存**:
- 实时性要求高的数据（订单状态、库存）
- 用户敏感数据（支付信息、密码）
- 频繁变化的数据（聊天消息、实时通知）

**缓存策略**:
```javascript
// 短期缓存（5分钟）- 适用于频繁变化但可接受延迟的数据
TTL.SHORT

// 中期缓存（1小时）- 适用于一般查询数据
TTL.MEDIUM

// 长期缓存（1天）- 适用于静态或很少变化的数据
TTL.LONG
```

### Q3: 如何处理关联数据？

```javascript
// 在模型中定义关联
// app/models/index.js
models.User.hasMany(models.Order, { foreignKey: 'user_id' });
models.Order.belongsTo(models.User, { foreignKey: 'user_id' });

// 在查询中使用 include
const user = await sequelize.models.User.findByPk(userId, {
  include: [{
    model: sequelize.models.Order,
    where: { status: 1 },
    required: false  // LEFT JOIN
  }]
});

// 或者分别查询后组合（更灵活）
const user = await sequelize.models.User.findByPk(userId);
const orders = await sequelize.models.Order.findAll({
  where: { user_id: userId, status: 1 }
});

return { ...user.toJSON(), orders };
```

### Q4: 如何实现软删除？

```javascript
// 方法1: 使用 Sequelize 的 paranoid 选项
const Model = sequelize.define('Model', {
  // 字段定义
}, {
  paranoid: true,  // 启用软删除
  deletedAt: 'deleted_at'
});

// 删除时会自动设置 deleted_at
await Model.destroy({ where: { id: 1 } });

// 查询时会自动过滤已删除的记录
await Model.findAll();  // 不包含已删除

// 查询包含已删除的记录
await Model.findAll({ paranoid: false });

// 恢复已删除的记录
await Model.restore({ where: { id: 1 } });

// 方法2: 使用状态字段（更常用）
await Model.update({ status: 0 }, { where: { id: 1 } });
await Model.findAll({ where: { status: 1 } });
```

### Q5: 如何处理文件上传？

```javascript
// 使用 multer 中间件
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('只允许上传图片文件'));
  }
});

// 在路由中使用
router.post('/upload',
  middleware.stacks.user.authenticated,
  upload.single('file'),
  controller.uploadFile
);

// 控制器处理
uploadFile = this.asyncHandler(async (req, res) => {
  if (!req.file) {
    return this.sendError(res, '请选择文件', 400);
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return this.sendSuccess(res, '上传成功', { url: fileUrl });
});
```

---

## 📚 环境配置

### 开发环境配置（env/dev.env）
```bash
# 应用配置
NODE_ENV=dev
PORT=3000
CLUSTER_MODE=false

# MySQL 配置
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=123456
DB_NAME=express_api_dev

# MongoDB 配置
MONGO_URI=mongodb://localhost:27017/express_api_dev
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB_NAME=express_api_dev

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# 日志配置
LOG_LEVEL=debug
LOG_MAX_FILES=14d
LOG_MAX_SIZE=20m
```

### 生产环境配置（env/prod.env）
```bash
# 应用配置
NODE_ENV=production
PORT=3000
CLUSTER_MODE=true

# 数据库配置（使用环境变量）
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
DB_NAME=${DB_NAME}

MONGO_URI=${MONGO_URI}
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}

# JWT 配置（必须更改）
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# 日志配置
LOG_LEVEL=info
LOG_MAX_FILES=30d
LOG_MAX_SIZE=50m
```

---

## 🎯 项目启动与部署

### 本地开发
```bash
# 安装依赖
npm install

# 配置环境变量
cp env/dev.env .env

# 同步数据库
npm run db:sync

# 启动开发服务器（热重载）
npm run dev
```

### Docker 部署
```bash
# 启动完整环境（MySQL + Redis + API）
docker-compose up -d

# 查看日志
docker-compose logs -f api

# 停止服务
docker-compose down

# 重启服务
docker-compose restart api
```

### 生产环境部署
```bash
# 使用 PM2 管理进程
npm install -g pm2

# 启动应用（集群模式）
pm2 start bin/www --name express-api -i max

# 查看状态
pm2 status

# 查看日志
pm2 logs express-api

# 重启应用
pm2 restart express-api

# 停止应用
pm2 stop express-api
```

---

## 📌 重要提示

1. **安全性**:
   - 生产环境必须更改 JWT_SECRET
   - 使用强密码保护数据库和 Redis
   - 启用 HTTPS
   - 定期更新依赖包

2. **性能优化**:
   - 合理使用缓存
   - 数据库查询添加索引
   - 使用连接池
   - 启用响应压缩

3. **代码规范**:
   - 继承 BaseService 和 BaseController
   - 使用统一的响应格式
   - 添加必要的日志
   - 完善的错误处理

4. **测试**:
   - 测试各种边界情况
   - 验证权限控制
   - 测试并发场景
   - 性能压力测试

---

## 🤖 给 AI 的额外指导

当你作为 AI 助手为这个项目开发功能时：

1. **始终遵循项目的 MVC 架构**，不要跳过任何层
2. **使用已有的基类和工具函数**，避免重复造轮子
3. **选择合适的中间件栈**，不要自己组合中间件
4. **实现完整的错误处理**，包括日志记录
5. **添加必要的注释**，说明业务逻辑和关键决策
6. **考虑性能和安全**，合理使用缓存和验证
7. **保持代码风格一致**，参考现有代码
8. **提供完整的实现**，包括模型、服务、控制器和路由

---

**项目版本**: 1.0.0
**最后更新**: 2025-10-13
**维护者**: Your Team
