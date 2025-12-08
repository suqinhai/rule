# Express API 企业级后端框架 - AI开发提示词

## 项目概述

这是一个基于 Express.js 的企业级后端 API 框架，采用标准的 MVC 架构模式，支持双数据库（MySQL + MongoDB）、Redis 缓存、JWT 认证，具备完善的中间件系统和安全机制。项目专为多端应用（用户端、管理端、商户端）设计，提供统一的代码规范和开发模式。

## 核心技术栈

### 后端框架与核心依赖
- **Express.js 4.18.2**: Web 应用框架
- **Node.js >=16.0.0**: 运行环境

### 数据库系统
- **MySQL 8.0+**: 关系型数据库，使用 Sequelize 6.35.2 作为 ORM
- **MongoDB 4.4+**: 文档型数据库，使用 Mongoose 8.16.0 作为 ODM
- **Redis 6.0+**: 缓存和会话存储，使用 ioredis 5.3.2 客户端

### 安全与认证
- **JWT (jsonwebtoken 9.0.2)**: 用户认证和授权
- **bcrypt 5.1.1**: 密码加密
- **Helmet 7.1.0**: HTTP 安全头部
- **CORS 2.8.5**: 跨域资源共享

### 功能增强
- **Winston 3.11.0**: 结构化日志系统
- **i18next 23.7.6**: 国际化支持
- **express-rate-limit 7.1.5**: API 限流
- **express-validator 7.0.1**: 请求数据验证
- **compression 1.7.4**: 响应压缩

### 开发工具
- **nodemon 3.0.2**: 开发环境热重载
- **cross-env 7.0.3**: 跨平台环境变量
- **Docker & Docker Compose**: 容器化部署

## 项目架构

### 目录结构
```
express-api/
├── app/                          # 应用核心代码
│   ├── controllers/              # 控制器层 - 处理HTTP请求/响应
│   │   ├── base/                 # 基础控制器（BaseController 等）
│   │   ├── admin/                # 管理端控制器
│   │   ├── merchant/             # 商户端控制器
│   │   └── user/                 # 用户端控制器
│   ├── services/                 # 服务层 - 业务逻辑处理
│   │   ├── base/                 # 基础服务（BaseService 等）
│   │   ├── admin/                # 管理端服务
│   │   ├── merchant/             # 商户端服务
│   │   ├── user/                 # 用户端服务
│   │   └── common/               # 通用服务（邮件、文件、通知等）
│   ├── models/                   # 数据模型层 - ORM/ODM 定义
│   │   ├── users/                # 用户相关模型
│   │   └── merchants/            # 商户相关模型
│   └── routes/                   # 路由层 - API 路由定义
│       ├── user-api/             # 用户端路由（/api/user）
│       ├── admin-api/            # 管理端路由（/api/admin）
│       └── merchant-api/         # 商户端路由（/api/merchant）
├── middleware/                   # 中间件模块
│   ├── core/                     # 核心中间件
│   │   ├── auth.js               # 认证中间件
│   │   ├── cache.js              # 缓存中间件
│   │   ├── errorHandler.js      # 错误处理中间件
│   │   ├── rateLimit.js          # 限流中间件
│   │   └── validator.js          # 验证中间件
│   ├── api/                      # API中间件栈
│   │   ├── user.js               # 用户端中间件栈
│   │   ├── admin.js              # 管理端中间件栈
│   │   └── merchant.js           # 商户端中间件栈
│   ├── monitoring/               # 监控中间件
│   │   ├── performance.js        # 性能监控
│   │   └── audit.js              # 审计日志
│   └── utils/                    # 工具函数
├── common/                       # 公共模块
│   ├── mysql/                    # MySQL数据库连接
│   ├── mango/                    # MongoDB数据库连接
│   ├── redis/                    # Redis连接和缓存管理
│   ├── logger/                   # 日志系统（Winston）
│   ├── i18n/                     # 国际化配置
│   ├── constants/                # 常量定义
│   └── util/                     # 工具函数
├── env/                          # 环境配置文件
│   ├── dev.env                   # 开发环境
│   ├── uat.env                   # 测试环境
│   └── pro.env                   # 生产环境
├── bin/                          # 启动脚本
│   ├── www                       # 服务启动入口
│   ├── cluster-manager.js        # 集群管理
│   └── graceful-shutdown.js      # 优雅关闭
├── scripts/                      # 工具脚本
├── logs/                         # 日志文件
├── public/                       # 静态资源
├── views/                        # 视图模板
├── app.js                        # Express应用配置
├── package.json                  # 项目依赖
└── docker-compose.yml            # Docker编排
```

### MVC 架构层次

```
┌──────────────────────────────────────────┐
│          HTTP Request (客户端请求)          │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│  Routes Layer (路由层)                     │
│  - 路由定义和分发                           │
│  - 路径: app/routes/                       │
│  - 作用: URL映射、中间件应用                │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│  Middleware Layer (中间件层)               │
│  - 认证、限流、缓存、验证                    │
│  - 路径: middleware/                       │
│  - 作用: 请求预处理、权限控制                │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│  Controllers Layer (控制器层)              │
│  - HTTP请求/响应处理                        │
│  - 路径: app/controllers/                  │
│  - 作用: 参数验证、调用服务、返回响应        │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│  Services Layer (服务层)                   │
│  - 核心业务逻辑                             │
│  - 路径: app/services/                     │
│  - 作用: 业务处理、事务管理、缓存策略        │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│  Models Layer (数据模型层)                  │
│  - 数据库模型定义                           │
│  - 路径: app/models/                       │
│  - 作用: ORM/ODM、数据验证                  │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│  Database Layer (数据库层)                 │
│  - MySQL (关系型) / MongoDB (文档型)       │
│  - Redis (缓存)                            │
└──────────────────────────────────────────┘
```

## 开发规范

### 1. 控制器开发规范

#### 基础控制器继承
所有控制器必须继承 `BaseController`，位于 `app/controllers/base/BaseController.js`。

**BaseController 提供的核心方法：**
- `asyncHandler(fn)`: 异步错误处理包装器
- `sendSuccess(res, message, data, statusCode)`: 统一成功响应
- `sendError(res, message, statusCode, errors)`: 统一错误响应
- `sendPaginatedResponse(res, data, pagination, message)`: 分页响应
- `validateRequiredFields(req, fields)`: 必填字段验证
- `getPaginationParams(req, defaultLimit)`: 获取分页参数
- `getSortParams(req, defaultSort, defaultOrder)`: 获取排序参数
- `logAction(action, req, details)`: 记录操作日志
- `logError(action, error, req)`: 记录错误日志

#### 控制器示例代码
```javascript
const BaseController = require('../base/BaseController');
const UserService = require('../../services/user/UserService');

class UserController extends BaseController {
  constructor() {
    super();
    this.userService = new UserService();
  }

  // 获取用户列表（带分页）
  getUserList = this.asyncHandler(async (req, res) => {
    // 记录操作日志
    this.logAction('获取用户列表', req);

    // 获取分页参数
    const { page, limit, offset } = this.getPaginationParams(req, 20);

    // 获取排序参数
    const { sortBy, sortOrder } = this.getSortParams(req, 'created_at', 'DESC');

    // 调用服务层
    const result = await this.userService.getUserList({
      page,
      limit,
      offset,
      sortBy,
      sortOrder,
      sequelize: res.sequelize
    });

    // 返回分页响应
    return this.sendPaginatedResponse(res, result.users, {
      page,
      limit,
      total: result.total
    }, '获取用户列表成功');
  });

  // 创建用户
  createUser = this.asyncHandler(async (req, res) => {
    // 验证必填字段
    const validationErrors = this.validateRequiredFields(req, ['username', 'password', 'email']);
    if (validationErrors) {
      return this.sendError(res, '参数验证失败', 400, validationErrors);
    }

    try {
      // 调用服务层
      const user = await this.userService.createUser(req.body, res.sequelize);

      this.logAction('创建用户', req, { userId: user.id });
      return this.sendSuccess(res, '创建用户成功', { user });
    } catch (error) {
      this.logError('创建用户失败', error, req);
      return this.sendError(res, error.message, 500);
    }
  });
}

module.exports = new UserController();
```

### 2. 服务层开发规范

#### 基础服务继承
所有服务必须继承 `BaseService`，位于 `app/services/base/BaseService.js`。

**BaseService 提供的核心方法：**
- `executeTransaction(callback, sequelize)`: 事务管理
- `getOrSetCache(key, fetchFunction, ttl)`: 缓存获取/设置
- `clearCache(keys)`: 清除缓存
- `validateData(data, rules)`: 数据验证
- `buildWhereCondition(filters, allowedFields)`: 构建查询条件
- `logAction(action, details)`: 记录操作日志
- `logError(action, error, details)`: 记录错误日志
- `generateId()`: 生成唯一ID
- `formatDate(date)`: 格式化日期
- `deepClone(obj)`: 深度克隆

#### 服务层示例代码
```javascript
const BaseService = require('../base/BaseService');
const bcrypt = require('bcrypt');

class UserService extends BaseService {
  constructor() {
    super();
  }

  // 获取用户列表（带缓存）
  async getUserList({ page, limit, offset, sortBy, sortOrder, sequelize }) {
    const cacheKey = `user_list:${page}:${limit}:${sortBy}:${sortOrder}`;

    return await this.getOrSetCache(
      cacheKey,
      async () => {
        const { count, rows } = await sequelize.models.User.findAndCountAll({
          offset,
          limit,
          order: [[sortBy, sortOrder]],
          attributes: { exclude: ['password'] } // 排除敏感字段
        });

        return { users: rows, total: count };
      },
      300 // 缓存5分钟
    );
  }

  // 创建用户（带事务）
  async createUser(userData, sequelize) {
    // 数据验证
    const validation = this.validateData(userData, {
      username: { required: true, type: 'string', minLength: 3, maxLength: 20 },
      password: { required: true, type: 'string', minLength: 6 },
      email: {
        required: true,
        type: 'string',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: '邮箱格式不正确'
      }
    });

    if (!validation.isValid) {
      throw new Error(`验证失败: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // 使用事务创建用户
    return await this.executeTransaction(async (transaction) => {
      // 检查用户名是否存在
      const existingUser = await sequelize.models.User.findOne({
        where: { username: userData.username },
        transaction
      });

      if (existingUser) {
        throw new Error('用户名已存在');
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // 创建用户
      const user = await sequelize.models.User.create({
        ...userData,
        password: hashedPassword
      }, { transaction });

      // 清除相关缓存
      await this.clearCache(['user_list:*']);

      this.logAction('创建用户', { userId: user.id });
      return user;
    }, sequelize);
  }

  // 用户登录
  async login(username, password, sequelize) {
    const user = await sequelize.models.User.findOne({
      where: { username }
    });

    if (!user) {
      throw new Error('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('用户名或密码错误');
    }

    // 更新最后登录时间
    await user.update({ last_login: new Date() });

    return user;
  }
}

module.exports = UserService;
```

### 3. 路由开发规范

#### 路由结构
- 用户端路由: `/api/user/*`
- 管理端路由: `/api/admin/*`
- 商户端路由: `/api/merchant/*`

#### 路由示例
```javascript
const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user/UserController');

// 引入中间件
const { stacks, quick } = require('../../../middleware');

// 公开路由（无需认证）
const loginRouter = require('./no_require_auth/index');
router.use('/auth', loginRouter);

// 应用用户端中间件栈（包含认证、限流等）
router.use(stacks.user.authenticated);

// 用户相关路由
router.get('/list', UserController.getUserList);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

// 敏感操作路由（额外的限流和审计）
router.post('/', stacks.user.sensitive, UserController.createUser);

module.exports = router;
```

### 4. 中间件使用规范

#### 预定义中间件栈

**用户端中间件栈 (`middleware.stacks.user`)**
- `public`: 公开接口（无认证、宽松限流）
- `authenticated`: 需要认证的接口（标准限流、缓存）
- `optionalAuth`: 可选认证（支持匿名和认证用户）
- `cached`: 缓存接口（长期缓存、减少数据库查询）
- `sensitive`: 敏感操作（严格限流、审计日志）
- `login`: 登录接口（特殊限流、审计）

**管理端中间件栈 (`middleware.stacks.admin`)**
- `standard`: 标准管理接口（管理员认证、中等限流）
- `sensitive`: 敏感管理操作（超管权限、严格限流、审计）
- `superAdmin`: 超级管理员接口（最高权限）
- `batch`: 批量操作（特殊限流）
- `export`: 数据导出（长时限流）
- `cachedQuery`: 缓存查询（减少复杂查询）
- `stats`: 统计接口（缓存优化）

**商户端中间件栈 (`middleware.stacks.merchant`)**
- `public`: 公开接口
- `authenticated`: 需要认证的接口
- `optionalAuth`: 可选认证
- `cached`: 缓存接口
- `sensitive`: 敏感操作
- `login`: 登录接口
- `product`: 商品相关（特定限流）
- `shopAccess`: 店铺访问控制

#### 中间件使用示例
```javascript
const { stacks, quick, factories } = require('../../../middleware');

// 方式1: 使用预定义栈
router.get('/public', stacks.user.public, controller.publicMethod);
router.get('/profile', stacks.user.authenticated, controller.getProfile);
router.post('/sensitive', stacks.user.sensitive, controller.sensitiveOperation);

// 方式2: 使用快速访问
router.post('/login', quick.loginRateLimit, controller.login);
router.get('/cached-data', quick.userDataCache, controller.getCachedData);

// 方式3: 自定义中间件栈
router.post('/custom',
  factories.createUserStack({
    auth: 'required',
    caching: 'medium',
    limiting: 'strict'
  }),
  controller.customMethod
);

// 方式4: 组合多个中间件
router.post('/combined',
  quick.requireAuth,           // 认证
  quick.userRateLimit,         // 限流
  quick.validate([             // 验证
    quick.rules.username(),
    quick.rules.email()
  ]),
  controller.combinedMethod
);
```

### 5. 数据库使用规范

#### MySQL (Sequelize)
```javascript
// 在路由中，通过 res.sequelize 访问
router.get('/users', async (req, res) => {
  const users = await res.sequelize.models.User.findAll({
    attributes: { exclude: ['password'] },
    where: { status: 1 },
    order: [['created_at', 'DESC']],
    limit: 10
  });
  res.sendSuccess('获取成功', { users });
});

// 定义模型 (app/models/users/user.js)
const { DataTypes } = require('sequelize');

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
    // ... 其他字段
  }, {
    tableName: 'users',
    timestamps: false
  });

  return User;
};
```

#### MongoDB (Mongoose)
```javascript
// 在路由中，通过 res.mongodb 访问
router.post('/logs', async (req, res) => {
  const { mongoose } = res.mongodb;
  const result = await mongoose.connection.db
    .collection('logs')
    .insertOne({
      ...req.body,
      timestamp: new Date()
    });
  res.sendSuccess('日志保存成功', { id: result.insertedId });
});
```

#### Redis 缓存
```javascript
const { cacheManager } = require('../../../common');

// 设置缓存
await cacheManager.set('user', `profile:${userId}`, userData, 3600);

// 获取缓存
const cachedData = await cacheManager.get('user', `profile:${userId}`);

// 删除缓存
await cacheManager.del('user', `profile:${userId}`);

// 模糊删除
await cacheManager.deletePattern('user', 'profile:*');
```

### 6. 响应格式规范

#### 成功响应
```json
{
  "success": 1,
  "message": "操作成功",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe"
    }
  }
}
```

#### 错误响应
```json
{
  "success": 0,
  "message": "操作失败",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ]
}
```

#### 分页响应
```json
{
  "success": 1,
  "message": "获取数据成功",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": 1,
      "hasPrev": 0
    }
  }
}
```

## 环境配置

### 环境变量配置 (env/dev.env)
```bash
# 运行环境
NODE_ENV=dev
PORT=3000

# MySQL数据库
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=123456
DB_NAME=testSxx

# MongoDB数据库
MONGO_URI=mongodb://localhost:27017/testSxx
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB_NAME=testSxx

# Redis缓存
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT认证
JWT_SECRET=your_development_jwt_secret_key
JWT_EXPIRES_IN=1d

# 缓存TTL（秒）
CACHE_TTL_SHORT=300     # 5分钟
CACHE_TTL_MEDIUM=3600   # 1小时
CACHE_TTL_LONG=86400    # 1天
```

## AI 开发指导原则

### 当你需要在这个项目中开发新功能时，请遵循以下步骤：

#### 第一步：理解需求并规划
1. 明确功能属于哪个端（用户端/管理端/商户端）
2. 确定需要哪些数据库（MySQL/MongoDB/Redis）
3. 规划 API 路由路径和 HTTP 方法
4. 确定需要的中间件（认证、限流、缓存、验证）

#### 第二步：创建模型（如果需要新表）
1. 在 `app/models/` 相应目录创建模型文件
2. 继承并使用 Sequelize 或 Mongoose
3. 定义字段、验证规则、关联关系
4. 使用 `npm run db:sync` 同步数据库

#### 第三步：创建服务层
1. 在 `app/services/` 相应目录创建服务类
2. 继承 `BaseService`
3. 实现核心业务逻辑
4. 使用 `executeTransaction` 处理事务
5. 使用 `getOrSetCache` 实现缓存
6. 使用 `validateData` 验证数据
7. 添加适当的日志记录

#### 第四步：创建控制器
1. 在 `app/controllers/` 相应目录创建控制器类
2. 继承 `BaseController`
3. 使用 `asyncHandler` 包装异步方法
4. 调用服务层方法
5. 使用统一的响应方法（sendSuccess/sendError/sendPaginatedResponse）
6. 添加操作日志

#### 第五步：定义路由
1. 在 `app/routes/` 相应目录创建或修改路由文件
2. 选择合适的中间件栈（stacks.user.authenticated 等）
3. 将路由映射到控制器方法
4. 考虑路由的认证和权限需求

#### 第六步：测试
1. 启动开发服务器: `npm run dev`
2. 使用 Postman 或 curl 测试 API
3. 检查日志输出
4. 验证数据库记录
5. 检查缓存是否生效

### AI 开发最佳实践

1. **代码一致性**: 始终继承 BaseController 和 BaseService，使用它们提供的方法
2. **错误处理**: 使用 try-catch 和 asyncHandler，记录详细的错误日志
3. **安全性**: 永远不要在响应中返回敏感信息（如密码），使用 JWT 进行认证
4. **性能优化**: 对频繁查询的数据使用缓存，使用分页避免大量数据加载
5. **日志记录**: 在关键操作点添加日志，便于调试和审计
6. **数据验证**: 在服务层进行业务验证，在控制器层进行参数验证
7. **事务管理**: 对于多表操作，使用 executeTransaction 确保数据一致性
8. **中间件选择**: 根据接口的安全级别选择合适的中间件栈
9. **文档注释**: 为类和方法添加详细的 JSDoc 注释
10. **国际化**: 使用 i18n 模块返回多语言错误消息

### 常见开发场景示例

#### 场景1: 添加用户端CRUD接口
```
1. 在 app/models/users/ 创建模型
2. 在 app/services/user/ 创建服务，继承BaseService
3. 在 app/controllers/user/ 创建控制器，继承BaseController
4. 在 app/routes/user-api/ 添加路由，使用 stacks.user.authenticated
5. 测试接口功能
```

#### 场景2: 添加管理端敏感操作接口
```
1. 在 app/services/admin/ 创建服务
2. 在 app/controllers/admin/ 创建控制器
3. 在 app/routes/admin-api/ 添加路由，使用 stacks.admin.sensitive
4. 确保使用 requireAdmin 或 requirePermissions 中间件
5. 添加详细的审计日志
```

#### 场景3: 添加需要缓存的查询接口
```
1. 在服务层使用 getOrSetCache 方法
2. 设置合适的 TTL（短期/中期/长期）
3. 在数据更新时清除相关缓存
4. 在路由中使用缓存中间件（stacks.user.cached）
```

#### 场景4: 添加文件上传功能
```
1. 使用 app/services/common/FileService
2. 配置 multer 中间件
3. 在控制器中处理文件上传
4. 返回文件访问 URL
```

#### 场景5: 集成第三方API
```
1. 在 app/services/common/ 创建专门的服务
2. 使用 axios 或 fetch 调用外部API
3. 添加错误重试机制
4. 缓存API响应（如适用）
5. 记录详细的调用日志
```

## 常用命令

```bash
# 开发环境启动
npm run dev

# 生产环境启动
npm run start:prod

# 数据库同步
npm run db:sync

# Docker启动
docker-compose up -d

# 查看日志
tail -f logs/combined.log

# 健康检查
curl http://localhost:3000/health
```

## 关键文件位置参考

- **应用入口**: `app.js` - Express 应用配置
- **服务启动**: `bin/www` - 服务器启动脚本
- **基础控制器**: `app/controllers/base/BaseController.js`
- **基础服务**: `app/services/base/BaseService.js`
- **中间件系统**: `middleware/index.js`
- **数据库连接**: `common/mysql/index.js`, `common/mango/index.js`
- **缓存管理**: `common/redis/cache.js`
- **日志系统**: `common/logger/index.js`
- **路由处理**: `common/routeHandler.js`
- **常量定义**: `common/constants/status.js`

## 注意事项

1. **不要直接修改 BaseController 和 BaseService**：它们是所有控制器和服务的基类
2. **环境变量敏感信息**：不要将生产环境的密钥提交到代码仓库
3. **数据库连接池**：已配置连接池，不要在代码中手动管理连接
4. **集群模式**：生产环境使用 CLUSTER_MODE=true 启用多进程
5. **日志文件**：日志会自动轮转，不需要手动清理
6. **API版本控制**：如需版本控制，在路由前缀添加版本号（如 /api/v1/user）
7. **跨域配置**：CORS 已全局启用，如需特定配置，在 app.js 修改
8. **限流策略**：不同端有不同的限流策略，不要随意修改
9. **认证机制**：使用 JWT，token 默认有效期 1 天
10. **错误响应**：始终使用统一的响应格式，不要返回原始错误对象

---

## 总结

这个 Express API 框架提供了完整的企业级后端开发基础设施。通过继承 BaseController 和 BaseService，遵循 MVC 架构，使用预定义的中间件栈，你可以快速、规范地开发新功能。框架已经处理好了认证、限流、缓存、日志、错误处理等通用功能，让你专注于业务逻辑的实现。

在开发过程中，始终记住：
- **代码复用** > 重复编写
- **统一规范** > 各自为政
- **安全第一** > 快速开发
- **日志详细** > 盲目调试
- **测试充分** > 仓促上线

祝开发顺利！
