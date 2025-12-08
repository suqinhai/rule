# Express API 项目 - AI开发提示词

## 项目概述

这是一个企业级、生产就绪的 Express.js API 框架项目，采用现代化的技术栈和架构设计模式。项目的核心定位是提供一个**可扩展、高性能、安全可靠**的后端API服务框架。

### 核心定位
- **多端API支持**: 用户端(User)、管理端(Admin)、商户端(Merchant)三大API体系
- **双数据库架构**: MySQL (关系型数据) + MongoDB (文档型数据) 并存
- **企业级特性**: 完整的认证授权、缓存、限流、日志、监控、国际化体系
- **生产就绪**: Docker容器化、集群模式、健康检查、优雅关闭等生产级特性

---

## 技术栈详解

### 核心框架与依赖
```json
{
  "运行时": "Node.js >= 16.0.0",
  "Web框架": "Express 4.18.2",
  "关系型数据库": {
    "数据库": "MySQL 8.0",
    "ORM": "Sequelize 6.35.2"
  },
  "文档型数据库": {
    "数据库": "MongoDB >= 4.4",
    "ODM": "Mongoose 8.16.0"
  },
  "缓存": {
    "数据库": "Redis >= 6.0",
    "客户端": "ioredis 5.3.2"
  },
  "认证": "jsonwebtoken 9.0.2 + bcrypt 5.1.1",
  "日志": "winston 3.11.0 + winston-daily-rotate-file 4.7.1",
  "验证": "express-validator 7.0.1",
  "安全": "helmet 7.1.0 + cors 2.8.5",
  "限流": "express-rate-limit 7.1.5",
  "国际化": "i18next 23.7.6",
  "定时任务": "node-cron 3.0.3",
  "容器化": "Docker + Docker Compose"
}
```

---

## 架构设计模式

### 1. MVC分层架构

```
┌─────────────────────────────────────────────────────┐
│                    HTTP 请求入口                     │
└─────────────────┬───────────────────────────────────┘
                  │
         ┌────────▼────────┐
         │   Routes 路由层  │  ← API端点定义、中间件组合
         │   /api/xxx/xxx  │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │ Controllers     │  ← HTTP处理、参数验证、响应格式化
         │   控制器层       │  ← 调用Service、不包含业务逻辑
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │  Services       │  ← 核心业务逻辑层
         │   服务层        │  ← 事务管理、缓存策略、数据处理
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │   Models        │  ← 数据模型定义
         │   数据层        │  ← Sequelize/Mongoose模型
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │  Database       │  ← MySQL + MongoDB
         └─────────────────┘
```

### 2. 三端API体系设计

#### 用户端 API (`/api/user/*`)
```javascript
{
  "目标用户": "普通C端用户",
  "认证方式": "JWT令牌 (可选认证/必须认证)",
  "限流策略": "宽松 - 1000次/15分钟",
  "缓存策略": "中等 TTL",
  "典型场景": [
    "用户注册/登录",
    "个人资料管理",
    "业务数据查询",
    "常规操作"
  ],
  "中间件栈": "userMiddleware.authenticated / public / optionalAuth"
}
```

#### 管理端 API (`/api/admin/*`)
```javascript
{
  "目标用户": "系统管理员",
  "认证方式": "JWT令牌 + 管理员角色验证",
  "限流策略": "严格 - 500次/15分钟",
  "缓存策略": "短 TTL 或无缓存",
  "审计要求": "敏感操作必须审计",
  "典型场景": [
    "用户管理",
    "系统配置",
    "数据统计",
    "敏感操作"
  ],
  "中间件栈": "adminMiddleware.standard / sensitive / superAdmin"
}
```

#### 商户端 API (`/api/merchant/*`)
```javascript
{
  "目标用户": "商户/合作伙伴",
  "认证方式": "JWT令牌 + 商户权限验证",
  "限流策略": "中等 - 800次/15分钟",
  "数据隔离": "多租户数据隔离",
  "典型场景": [
    "商户注册/登录",
    "商品管理",
    "订单管理",
    "店铺管理"
  ],
  "中间件栈": "merchantMiddleware.authenticated / shopAccess / product"
}
```

---

## 目录结构与职责

```
express-api/
├── app/                        # 应用核心代码
│   ├── controllers/            # 控制器层
│   │   ├── base/              # 基础控制器
│   │   │   ├── BaseController.js           # ✨ 核心：所有控制器的父类
│   │   │   ├── BaseMerchantController.js   # 商户控制器基类
│   │   │   ├── CountryController.js        # 国家/地区管理
│   │   │   ├── CurrencyController.js       # 货币管理
│   │   │   └── LanguageController.js       # 语言管理
│   │   ├── user/              # 用户端控制器
│   │   │   └── UserAuthController.js       # 用户认证控制器
│   │   ├── admin/             # 管理端控制器
│   │   │   └── AdminAuthController.js      # 管理员认证控制器
│   │   └── merchant/          # 商户端控制器
│   │       └── MerchantAuthController.js   # 商户认证控制器
│   │
│   ├── services/               # 服务层（业务逻辑）
│   │   ├── base/              # 基础服务
│   │   │   ├── BaseService.js              # ✨ 核心：所有服务的父类
│   │   │   └── BaseMerchantService.js      # 商户服务基类
│   │   ├── user/              # 用户端服务
│   │   │   └── UserAuthService.js          # 用户认证服务
│   │   ├── admin/             # 管理端服务
│   │   │   ├── AdminAuthService.js         # 管理员认证服务
│   │   │   └── AdminAuthUtils.js           # 管理员工具类
│   │   ├── merchant/          # 商户端服务
│   │   │   ├── MerchantAuthService.js      # 商户认证服务
│   │   │   └── MerchantAuthUtils.js        # 商户工具类
│   │   └── common/            # 通用服务
│   │       ├── EmailService.js             # 邮件服务
│   │       ├── FileService.js              # 文件服务
│   │       └── NotificationService.js      # 通知服务
│   │
│   ├── models/                 # 数据模型层
│   │   ├── users/             # 用户模型
│   │   │   ├── user.js                     # 普通用户模型
│   │   │   └── enhancedUser.js             # 增强用户模型
│   │   └── merchants/         # 商户模型
│   │       └── user.js                     # 商户用户模型
│   │
│   └── routes/                 # 路由层
│       ├── index.js           # ✨ 核心：主路由入口
│       ├── user-api/          # 用户端路由
│       │   ├── index.js                    # 用户路由入口
│       │   ├── auth/                       # 认证路由
│       │   └── no_require_auth/            # 公开路由
│       ├── admin-api/         # 管理端路由
│       │   ├── index.js                    # 管理路由入口
│       │   ├── merchant/                   # 商户管理路由
│       │   └── no_require_auth/            # 公开路由
│       └── merchant-api/      # 商户端路由
│           ├── index.js                    # 商户路由入口
│           ├── auth/                       # 认证路由
│           └── no_require_auth/            # 公开路由
│
├── middleware/                 # 中间件模块
│   ├── index.js               # ✨ 核心：中间件统一导出
│   ├── core/                  # 核心中间件
│   │   ├── auth.js                         # ✨ 认证中间件
│   │   ├── rateLimit.js                    # ✨ 限流中间件
│   │   ├── cache.js                        # ✨ 缓存中间件
│   │   ├── validator.js                    # ✨ 验证中间件
│   │   └── errorHandler.js                 # ✨ 错误处理中间件
│   ├── monitoring/            # 监控中间件
│   │   ├── performance.js                  # 性能监控
│   │   └── audit.js                        # 审计日志
│   ├── api/                   # API中间件栈
│   │   ├── user.js                         # ✨ 用户端中间件栈
│   │   ├── admin.js                        # ✨ 管理端中间件栈
│   │   └── merchant.js                     # ✨ 商户端中间件栈
│   ├── config/                # 中间件配置
│   │   └── index.js                        # 配置常量
│   └── utils/                 # 工具函数
│       ├── apiType.js                      # API类型标识
│       └── helpers.js                      # 辅助函数
│
├── common/                     # 公共模块
│   ├── index.js               # ✨ 核心：公共模块统一导出
│   ├── mysql/                 # MySQL连接
│   │   └── index.js                        # Sequelize配置
│   ├── mango/                 # MongoDB连接
│   │   └── index.js                        # Mongoose配置
│   ├── redis/                 # Redis连接
│   │   ├── index.js                        # Redis客户端
│   │   └── cache.js                        # ✨ 缓存管理器
│   ├── logger/                # 日志模块
│   │   ├── index.js                        # ✨ Winston日志器
│   │   └── clusterLogger.js                # 集群日志
│   ├── i18n/                  # 国际化
│   │   └── index.js                        # i18next配置
│   ├── schedule/              # 定时任务
│   │   └── index.js                        # node-cron配置
│   ├── routeHandler/          # 路由处理器
│   │   └── index.js                        # ✨ 统一响应格式
│   ├── util/                  # 工具函数
│   │   └── index.js                        # 通用工具
│   ├── utils/                 # 实用工具
│   │   └── statusHelper.js                 # 状态辅助类
│   ├── constants/             # 常量定义
│   │   └── status.js                       # ✨ 状态常量
│   └── healthcheck.js         # 健康检查
│
├── bin/                        # 启动脚本
│   ├── www                    # ✨ 核心：主入口文件
│   ├── server-config.js       # 服务器配置
│   ├── server-utils.js        # 服务器工具
│   ├── cluster-manager.js     # 集群管理器
│   └── graceful-shutdown.js   # 优雅关闭
│
├── env/                        # 环境配置
│   ├── dev.env                # ✨ 开发环境配置
│   ├── uat.env                # UAT环境配置
│   └── pro.env                # 生产环境配置
│
├── scripts/                    # 脚本工具
│   ├── sync-db.js             # 数据库同步
│   ├── create-console-admin.js # 创建管理员
│   └── migrate-enum-to-numbers.js # 数据迁移
│
├── docs/                       # 文档目录
├── logs/                       # 日志目录
├── public/                     # 静态资源
├── views/                      # 视图模板
│
├── app.js                      # ✨ Express应用配置
├── package.json                # ✨ 依赖配置
├── Dockerfile                  # ✨ Docker镜像
├── docker-compose.yml          # ✨ Docker编排
└── Makefile                    # Make命令

✨ = 核心文件，理解项目必读
```

---

## 核心设计模式与规范

### 1. 基类继承模式

#### BaseController (所有控制器的父类)
```javascript
class BaseController {
  // 提供的核心方法:
  asyncHandler(fn)                              // 异步错误处理包装器
  sendSuccess(res, message, data, statusCode)   // 统一成功响应
  sendError(res, message, statusCode, errors)   // 统一错误响应
  sendPaginatedResponse(res, data, pagination)  // 分页响应
  validateRequiredFields(req, requiredFields)   // 字段验证
  getPaginationParams(req, defaultLimit)        // 获取分页参数
  getSortParams(req, defaultSort, defaultOrder) // 获取排序参数
  logAction(action, req, details)               // 操作日志
  logError(action, error, req)                  // 错误日志
}
```

**使用规范**:
```javascript
// ✅ 正确的控制器实现
const BaseController = require('./base/BaseController');

class UserController extends BaseController {
  async getUserProfile(req, res) {
    // 使用asyncHandler包装
    return this.asyncHandler(async (req, res) => {
      const userId = req.user.id;
      
      // 记录操作
      this.logAction('获取用户资料', req, { userId });
      
      // 调用服务层
      const userService = new UserService();
      const profile = await userService.getProfile(userId);
      
      // 使用统一响应
      return this.sendSuccess(res, '获取成功', { profile });
    })(req, res);
  }
}
```

#### BaseService (所有服务的父类)
```javascript
class BaseService {
  // 提供的核心方法:
  executeTransaction(callback, sequelize)       // 事务执行
  getOrSetCache(key, fetchFunction, ttl)        // 缓存读写
  clearCache(keys)                              // 清除缓存
  validateData(data, rules)                     // 数据验证
  buildWhereCondition(filters, allowedFields)   // 构建查询条件
}
```

**使用规范**:
```javascript
// ✅ 正确的服务实现
const BaseService = require('./base/BaseService');

class UserService extends BaseService {
  async updateProfile(userId, updateData, sequelize) {
    // 使用事务
    return await this.executeTransaction(async (transaction) => {
      // 数据验证
      const validation = this.validateData(updateData, {
        nickname: { required: true, minLength: 2, maxLength: 50 },
        email: { required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ }
      });
      
      if (!validation.isValid) {
        throw new Error('数据验证失败');
      }
      
      // 数据库操作
      await User.update(updateData, { 
        where: { id: userId },
        transaction 
      });
      
      // 清除缓存
      await this.clearCache([`user:${userId}`, `user:profile:${userId}`]);
      
      return { success: true };
    }, sequelize);
  }
}
```

### 2. 中间件栈组合模式

#### 预定义中间件栈
```javascript
// 导入方式
const { stacks, quick } = require('../middleware');

// 用户端栈
stacks.user.public           // 公开接口（无认证+用户限流+缓存）
stacks.user.authenticated    // 认证接口（必须认证+用户限流）
stacks.user.optionalAuth     // 可选认证（可选认证+用户限流+缓存）
stacks.user.cached           // 缓存接口（必须认证+用户限流+缓存）
stacks.user.sensitive        // 敏感操作（必须认证+严格限流+审计）
stacks.user.login            // 登录接口（登录限流+可选认证）

// 管理端栈
stacks.admin.standard        // 标准管理接口（管理员认证+管理员限流+审计）
stacks.admin.sensitive       // 敏感管理操作（管理员认证+严格限流+敏感审计）
stacks.admin.superAdmin      // 超级管理员（超管认证+严格限流+敏感审计）
stacks.admin.batch           // 批量操作（管理员认证+特殊限流+审计）
stacks.admin.export          // 数据导出（管理员认证+导出限流+审计）
stacks.admin.cachedQuery     // 缓存查询（管理员认证+管理员限流+缓存）
stacks.admin.stats           // 统计接口（管理员认证+宽松限流+长缓存）

// 商户端栈
stacks.merchant.authenticated // 认证接口（商户认证+商户限流）
stacks.merchant.product       // 商品管理（商户认证+商户限流+店铺权限）
stacks.merchant.shopAccess    // 店铺访问（商户认证+店铺隔离+商户限流）
```

#### 路由中间件使用示例
```javascript
const express = require('express');
const router = express.Router();
const { stacks, quick } = require('../../middleware');
const UserController = require('../controllers/user/UserController');

const userController = new UserController();

// ✅ 公开接口 - 使用预定义栈
router.get('/countries', 
  stacks.user.public,  // 公开接口栈
  userController.getCountries.bind(userController)
);

// ✅ 认证接口 - 使用预定义栈
router.get('/profile', 
  stacks.user.authenticated,  // 认证接口栈
  userController.getProfile.bind(userController)
);

// ✅ 敏感操作 - 使用预定义栈
router.delete('/account', 
  stacks.user.sensitive,  // 敏感操作栈
  userController.deleteAccount.bind(userController)
);

// ✅ 自定义中间件组合 - 使用快速访问
router.post('/update-settings',
  quick.requireAuth,              // 必须认证
  quick.userRateLimit,            // 用户限流
  quick.validate([                // 数据验证
    quick.rules.body('theme').isIn(['light', 'dark']),
    quick.rules.body('language').isLength({ min: 2, max: 5 })
  ]),
  userController.updateSettings.bind(userController)
);
```

### 3. 统一响应格式

#### 成功响应格式
```javascript
{
  "success": 1,                    // 1=成功, 0=失败
  "message": "操作成功",
  "data": {                        // 可选，有数据时才包含
    // 业务数据
  }
}
```

#### 错误响应格式
```javascript
{
  "success": 0,
  "message": "操作失败",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "errors": [                      // 可选，详细错误信息
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ]
}
```

#### 分页响应格式
```javascript
{
  "success": 1,
  "message": "获取数据成功",
  "data": {
    "items": [...],               // 数据列表
    "pagination": {
      "page": 1,                  // 当前页码
      "limit": 20,                // 每页数量
      "total": 100,               // 总记录数
      "totalPages": 5,            // 总页数
      "hasNext": 1,               // 是否有下一页 (1=是, 0=否)
      "hasPrev": 0                // 是否有上一页 (1=是, 0=否)
    }
  }
}
```

### 4. 状态码常量体系

```javascript
// common/constants/status.js

// 通用状态
const COMMON_STATUS = {
  SUCCESS: 1,          // 成功
  FAILED: 0,           // 失败
  YES: 1,             // 是
  NO: 0,              // 否
  ENABLED: 1,         // 启用
  DISABLED: 0         // 禁用
};

// 用户状态
const USER_STATUS = {
  INACTIVE: 0,        // 未激活
  ACTIVE: 10,         // 正常
  SUSPENDED: 20,      // 停用
  DELETED: 30         // 已删除
};

// 用户角色
const USER_ROLE = {
  USER: 10,           // 普通用户
  MERCHANT: 20,       // 商户
  ADMIN: 30,          // 管理员
  SUPER_ADMIN: 40     // 超级管理员
};

// 使用示例
if (user.status === USER_STATUS.ACTIVE) {
  // 用户正常
}
```

---

## 数据库使用规范

### 1. MySQL (Sequelize) 使用

#### 模型定义
```javascript
// app/models/users/user.js
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
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      comment: '邮箱'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 10,
      comment: '状态: 0=未激活, 10=正常, 20=停用, 30=已删除'
    },
    role: {
      type: DataTypes.TINYINT,
      defaultValue: 10,
      comment: '角色: 10=普通用户, 20=商户, 30=管理员, 40=超级管理员'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,         // 软删除
    underscored: true,      // 使用下划线命名
    indexes: [
      { fields: ['username'] },
      { fields: ['email'] },
      { fields: ['status'] }
    ]
  });

  return User;
};
```

#### 在路由中使用
```javascript
router.get('/users', async (req, res) => {
  const { User } = res.sequelize.models;
  
  // 查询用户
  const users = await User.findAll({
    where: { status: 10 },
    attributes: ['id', 'username', 'email'],  // 字段选择
    limit: 20,
    offset: 0,
    order: [['created_at', 'DESC']]
  });
  
  res.sendSuccess('获取成功', { users });
});
```

#### 事务使用
```javascript
async function transferBalance(fromUserId, toUserId, amount, sequelize) {
  const transaction = await sequelize.transaction();
  
  try {
    // 扣除发送方余额
    await User.decrement(
      { balance: amount },
      { where: { id: fromUserId }, transaction }
    );
    
    // 增加接收方余额
    await User.increment(
      { balance: amount },
      { where: { id: toUserId }, transaction }
    );
    
    // 记录交易日志
    await Transaction.create({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      amount
    }, { transaction });
    
    await transaction.commit();
    return { success: true };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### 2. MongoDB (Mongoose) 使用

#### 在路由中使用原生MongoDB
```javascript
router.post('/logs', async (req, res) => {
  const { mongoose, db } = res.mongodb;
  
  if (!mongoose.connection.readyState) {
    return res.sendError('MongoDB未连接', 503);
  }
  
  // 插入文档
  const result = await db.collection('logs').insertOne({
    user_id: req.user.id,
    action: req.body.action,
    details: req.body.details,
    ip: req.ip,
    created_at: new Date()
  });
  
  res.sendSuccess('日志保存成功', { insertedId: result.insertedId });
});
```

#### Mongoose模型使用
```javascript
// 定义Schema
const logSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, index: true },
  action: { type: String, required: true },
  details: { type: Object },
  ip: String,
  created_at: { type: Date, default: Date.now, expires: 2592000 } // 30天后自动删除
});

const Log = mongoose.model('Log', logSchema);

// 使用模型
router.post('/logs', async (req, res) => {
  const log = new Log({
    user_id: req.user.id,
    action: req.body.action,
    details: req.body.details,
    ip: req.ip
  });
  
  await log.save();
  res.sendSuccess('日志保存成功', { logId: log._id });
});
```

---

## 缓存使用规范

### 缓存管理器使用

```javascript
const { cacheManager } = require('../../common');

// 1. 基础缓存操作
await cacheManager.set('user', userId, userData, 3600);     // 设置缓存
const userData = await cacheManager.get('user', userId);    // 获取缓存
await cacheManager.del('user', userId);                     // 删除缓存
const exists = await cacheManager.exists('user', userId);   // 检查存在

// 2. 缓存或获取模式（推荐）
const userData = await cacheManager.getOrFetch(
  'user',                          // 前缀
  userId,                          // 键
  async () => {                    // 获取函数
    return await User.findByPk(userId);
  },
  3600                            // TTL（秒）
);

// 3. 批量操作
await cacheManager.mset('user', { '1': user1, '2': user2 }, 3600);
const users = await cacheManager.mget('user', ['1', '2']);

// 4. 模式删除
await cacheManager.deletePattern('user:*');  // 删除所有user前缀的缓存
```

### 缓存中间件使用

```javascript
const { quick } = require('../../middleware');

// 使用预定义缓存中间件
router.get('/countries', 
  quick.staticDataCache,  // 静态数据缓存（长TTL）
  controller.getCountries
);

// 创建自定义缓存中间件
router.get('/products', 
  quick.createCacheMiddleware({
    prefix: 'products',
    ttl: 1800,  // 30分钟
    keyGenerator: (req) => `list:${req.query.category || 'all'}:${req.query.page || 1}`
  }),
  controller.getProducts
);
```

### 缓存TTL配置

```javascript
// env/dev.env
CACHE_TTL_SHORT=300      // 5分钟 - 用于频繁变化的数据
CACHE_TTL_MEDIUM=3600    // 1小时 - 用于一般业务数据
CACHE_TTL_LONG=86400     // 1天 - 用于基础配置数据

// 使用示例
const { CACHE_TTL_SHORT, CACHE_TTL_MEDIUM, CACHE_TTL_LONG } = process.env;
await cacheManager.set('config', 'countries', countries, CACHE_TTL_LONG);
```

---

## 认证授权规范

### JWT Token生成

```javascript
const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    type: 'access'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
}

// 登录响应
res.sendSuccess('登录成功', {
  token: generateToken(user),
  user: {
    id: user.id,
    username: user.username,
    role: user.role
  }
});
```

### 认证中间件使用

```javascript
const { quick, stacks } = require('../../middleware');

// 1. 基础认证（可选）
router.get('/recommendations', 
  quick.baseAuth,  // 如果有token则解析，没有也不报错
  controller.getRecommendations
);
// req.isAuthenticated 可能为: AUTHENTICATED | NOT_AUTHENTICATED | TOKEN_INVALID
// req.user 可能为: 用户对象 | null

// 2. 必须认证
router.get('/profile', 
  quick.requireAuth,  // 必须有效token，否则401
  controller.getProfile
);

// 3. 管理员认证
router.get('/admin/users', 
  quick.requireAdmin,  // 必须是管理员角色，否则401/403
  controller.getUsers
);

// 4. 权限认证
router.delete('/admin/users/:id', 
  quick.requireAuth,
  quick.requirePermissions(['user.delete'], { requireAll: false }),
  controller.deleteUser
);
```

### 密码处理

```javascript
const bcrypt = require('bcrypt');

// 密码加密
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// 密码验证
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// 注册示例
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  // 密码哈希
  const hashedPassword = await hashPassword(password);
  
  const user = await User.create({
    username,
    password: hashedPassword,  // 存储哈希后的密码
    email
  });
  
  // 返回时永远不包含密码
  const { password: _, ...userWithoutPassword } = user.toJSON();
  
  res.sendSuccess('注册成功', { user: userWithoutPassword });
});
```

---

## 日志使用规范

### 日志级别

```javascript
const { logger } = require('../common/logger');

// error - 错误级别（必须记录）
logger.error('数据库连接失败', {
  error: error.message,
  stack: error.stack,
  database: 'MySQL',
  host: process.env.DB_HOST
});

// warn - 警告级别
logger.warn('缓存未命中', {
  key: 'user:123',
  operation: 'get'
});

// info - 信息级别（生产环境主要日志）
logger.info('用户登录', {
  userId: user.id,
  username: user.username,
  ip: req.ip,
  userAgent: req.get('User-Agent')
});

// debug - 调试级别（仅开发环境）
logger.debug('查询参数', {
  query: req.query,
  params: req.params
});
```

### 控制器中的日志记录

```javascript
class UserController extends BaseController {
  async updateProfile(req, res) {
    try {
      // 记录操作日志
      this.logAction('更新用户资料', req, {
        userId: req.user.id,
        fields: Object.keys(req.body)
      });
      
      const result = await userService.updateProfile(req.user.id, req.body);
      
      return this.sendSuccess(res, '更新成功', result);
    } catch (error) {
      // 记录错误日志
      this.logError('更新用户资料失败', error, req);
      return this.sendError(res, '更新失败', 500);
    }
  }
}
```

### 审计日志

```javascript
// 使用审计中间件
const { quick } = require('../../middleware');

router.delete('/admin/users/:id', 
  stacks.admin.sensitive,  // 已包含敏感操作审计
  controller.deleteUser
);

// 或手动记录审计日志
const { audit } = require('../../middleware/monitoring');

await audit.logSensitiveOperation(req, {
  operation: 'DELETE_USER',
  targetId: userId,
  targetType: 'User',
  reason: req.body.reason,
  result: 'SUCCESS'
});
```

---

## 错误处理规范

### 自定义错误类

```javascript
const { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError 
} = require('../../middleware/core/errorHandler');

// 在Service中抛出错误
class UserService extends BaseService {
  async getUser(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      // 使用自定义错误类
      throw new NotFoundError('用户不存在');
    }
    
    if (user.status !== USER_STATUS.ACTIVE) {
      throw new AppError('用户状态异常', 400, 'USER_INACTIVE');
    }
    
    return user;
  }
  
  async updateUser(userId, data) {
    // 数据验证
    const validation = this.validateData(data, {
      email: { required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ }
    });
    
    if (!validation.isValid) {
      throw new ValidationError('数据验证失败', validation.errors);
    }
    
    // ... 更新逻辑
  }
}
```

### 全局错误处理

```javascript
// 已在 app.js 中配置
const { quick } = require('./middleware');
app.use(quick.notFoundHandler);    // 404处理
app.use(quick.errorHandler);       // 全局错误处理

// 错误会自动转换为统一格式:
{
  "success": 0,
  "message": "错误消息",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 异步错误处理

```javascript
// ✅ 推荐方式1: 使用BaseController的asyncHandler
class UserController extends BaseController {
  getUserProfile = this.asyncHandler(async (req, res) => {
    const profile = await userService.getProfile(req.user.id);
    return this.sendSuccess(res, '获取成功', { profile });
  });
}

// ✅ 推荐方式2: 使用中间件的asyncHandler
const { quick } = require('../../middleware');

router.get('/profile', 
  quick.requireAuth,
  quick.asyncHandler(async (req, res) => {
    const profile = await userService.getProfile(req.user.id);
    res.sendSuccess('获取成功', { profile });
  })
);
```

---

## 数据验证规范

### 使用express-validator

```javascript
const { quick } = require('../../middleware');
const { body, param, query } = require('express-validator');

// 方式1: 使用预定义规则
router.post('/register',
  quick.validate([
    quick.rules.username(),      // 预定义用户名规则
    quick.rules.email(),         // 预定义邮箱规则
    quick.rules.password(),      // 预定义密码规则
    quick.rules.body('phone').optional().isMobilePhone('zh-CN')
  ]),
  controller.register
);

// 方式2: 自定义验证规则
router.post('/users',
  quick.validate([
    body('username')
      .trim()
      .isLength({ min: 3, max: 50 }).withMessage('用户名长度3-50字符')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),
    body('email')
      .isEmail().withMessage('邮箱格式不正确')
      .normalizeEmail(),
    body('age')
      .optional()
      .isInt({ min: 1, max: 150 }).withMessage('年龄必须是1-150之间的整数'),
    body('role')
      .isIn([10, 20, 30]).withMessage('角色值不合法')
  ]),
  controller.createUser
);

// 路径参数验证
router.get('/users/:id',
  quick.validate([
    param('id').isInt().withMessage('用户ID必须是整数')
  ]),
  controller.getUser
);

// 查询参数验证
router.get('/users',
  quick.validate([
    query('page').optional().isInt({ min: 1 }).withMessage('页码必须大于0'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量1-100'),
    query('status').optional().isIn(['0', '10', '20', '30']).withMessage('状态值不合法')
  ]),
  controller.getUsers
);
```

### Service层验证

```javascript
class UserService extends BaseService {
  async createUser(userData) {
    // 使用BaseService的validateData方法
    const validation = this.validateData(userData, {
      username: {
        required: true,
        type: 'string',
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9_]+$/,
        patternMessage: '用户名只能包含字母、数字和下划线'
      },
      email: {
        required: true,
        type: 'string',
        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        patternMessage: '邮箱格式不正确'
      },
      age: {
        required: false,
        type: 'number',
        min: 1,
        max: 150
      },
      role: {
        required: true,
        enum: [10, 20, 30]
      }
    });
    
    if (!validation.isValid) {
      throw new ValidationError('数据验证失败', validation.errors);
    }
    
    // 创建用户...
  }
}
```

---

## 限流使用规范

### 预定义限流策略

```javascript
// middleware/config/index.js 中的配置
const RATE_LIMIT_CONFIG = {
  GENERAL: {
    windowMs: 15 * 60 * 1000,    // 15分钟
    max: 2000,                    // 最多2000次请求
    message: '请求过于频繁，请稍后再试'
  },
  USER: {
    windowMs: 15 * 60 * 1000,
    max: 1000,                    // 用户端: 1000次/15分钟
    message: '请求过于频繁，请稍后再试'
  },
  ADMIN: {
    windowMs: 15 * 60 * 1000,
    max: 500,                     // 管理端: 500次/15分钟（更严格）
    message: '请求过于频繁，请稍后再试'
  },
  MERCHANT: {
    windowMs: 15 * 60 * 1000,
    max: 800,                     // 商户端: 800次/15分钟
    message: '请求过于频繁，请稍后再试'
  },
  LOGIN: {
    windowMs: 15 * 60 * 1000,
    max: 10,                      // 登录: 10次/15分钟（防暴力破解）
    message: '登录尝试次数过多，请稍后再试'
  },
  STRICT: {
    windowMs: 15 * 60 * 1000,
    max: 50,                      // 严格限流: 50次/15分钟
    message: '操作过于频繁，请稍后再试'
  }
};
```

### 使用限流中间件

```javascript
const { quick, stacks } = require('../../middleware');

// 1. 使用预定义栈（已包含适当的限流）
router.post('/users', 
  stacks.user.authenticated,  // 已包含userRateLimit
  controller.createUser
);

// 2. 单独使用限流中间件
router.post('/login', 
  quick.loginRateLimit,  // 登录专用限流（10次/15分钟）
  controller.login
);

// 3. 创建自定义限流
router.post('/export', 
  quick.requireAdmin,
  quick.createRateLimit({
    windowMs: 60 * 60 * 1000,  // 1小时
    max: 5,                     // 最多5次
    message: '导出操作过于频繁，每小时最多5次',
    keyGenerator: (req) => req.user.id  // 按用户ID限流
  }),
  controller.exportData
);
```

---

## 国际化(i18n)使用

### 基本使用

```javascript
// 在路由中使用
router.get('/test', (req, res) => {
  // 自动根据Accept-Language头或query参数选择语言
  const message = req.t('welcome.message');  // "欢迎" 或 "Welcome"
  const hello = req.t('common.hello', { name: 'World' });  // "你好, World" 或 "Hello, World"
  
  res.sendSuccess(message, { hello });
});

// 在Service中使用
class UserService extends BaseService {
  async createUser(userData, i18n) {
    // ... 业务逻辑
    
    // 返回国际化消息
    return {
      message: i18n.t('user.created_successfully')
    };
  }
}

// 在Controller中传递i18n
class UserController extends BaseController {
  async createUser(req, res) {
    const result = await userService.createUser(req.body, req);
    return this.sendSuccess(res, req.t('success'), result);
  }
}
```

### 语言文件结构

```
common/i18n/locales/
├── zh/
│   ├── translation.json        # 中文翻译
│   └── errors.json            # 错误消息
└── en/
    ├── translation.json        # 英文翻译
    └── errors.json
```

---

## 性能优化建议

### 1. 数据库查询优化

```javascript
// ❌ 不好的做法 - N+1查询问题
const users = await User.findAll();
for (const user of users) {
  user.orders = await Order.findAll({ where: { userId: user.id } });
}

// ✅ 好的做法 - 使用include预加载
const users = await User.findAll({
  include: [{
    model: Order,
    as: 'orders'
  }]
});

// ✅ 好的做法 - 选择必要字段
const users = await User.findAll({
  attributes: ['id', 'username', 'email'],  // 只选择需要的字段
  where: { status: 10 },
  limit: 20
});

// ✅ 好的做法 - 使用索引字段查询
const user = await User.findOne({
  where: { email: userEmail }  // email字段有索引
});
```

### 2. 缓存策略

```javascript
// ✅ 多级缓存策略
class UserService extends BaseService {
  async getUserProfile(userId) {
    // L1: 内存缓存（最快，容量小）
    if (this.memoryCache.has(`user:${userId}`)) {
      return this.memoryCache.get(`user:${userId}`);
    }
    
    // L2: Redis缓存（快，容量大）
    const cached = await this.cache.get('user', userId);
    if (cached) {
      this.memoryCache.set(`user:${userId}`, cached);
      return cached;
    }
    
    // L3: 数据库查询（慢，数据源）
    const user = await User.findByPk(userId);
    
    // 回填缓存
    await this.cache.set('user', userId, user, 3600);
    this.memoryCache.set(`user:${userId}`, user);
    
    return user;
  }
}
```

### 3. 分页优化

```javascript
// ✅ 基于游标的分页（适合大数据集）
router.get('/users', async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  
  const where = cursor ? { id: { [Op.gt]: cursor } } : {};
  
  const users = await User.findAll({
    where,
    limit: parseInt(limit) + 1,  // 多查1条判断是否还有下一页
    order: [['id', 'ASC']]
  });
  
  const hasMore = users.length > limit;
  const items = hasMore ? users.slice(0, -1) : users;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  
  res.sendSuccess('获取成功', {
    items,
    pagination: {
      nextCursor,
      hasMore
    }
  });
});
```

---

## 安全最佳实践

### 1. SQL注入防护

```javascript
// ✅ 使用ORM参数化查询（自动防护）
const users = await User.findAll({
  where: { email: req.query.email }  // Sequelize自动转义
});

// ✅ 原生查询使用占位符
const [results] = await sequelize.query(
  'SELECT * FROM users WHERE email = ?',
  {
    replacements: [req.query.email],  // 参数化查询
    type: QueryTypes.SELECT
  }
);

// ❌ 危险的做法 - 字符串拼接
const query = `SELECT * FROM users WHERE email = '${req.query.email}'`;  // 容易SQL注入
```

### 2. XSS防护

```javascript
// ✅ 输入验证和清理
const { body } = require('express-validator');

router.post('/comments',
  quick.validate([
    body('content')
      .trim()
      .escape()  // 转义HTML字符
      .isLength({ min: 1, max: 1000 })
  ]),
  controller.createComment
);

// ✅ 在前端渲染时使用安全的方法
// React: 使用 {comment.content} 而不是 dangerouslySetInnerHTML
// Vue: 使用 {{ comment.content }} 而不是 v-html
```

### 3. CSRF防护

```javascript
// 已在helmet中配置基础防护
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      // ...
    }
  }
}));

// ✅ 对于状态改变的操作，验证来源
router.post('/users', (req, res, next) => {
  const origin = req.get('origin');
  const allowedOrigins = ['https://yourdomain.com'];
  
  if (!allowedOrigins.includes(origin)) {
    return res.sendError('请求来源不合法', 403);
  }
  
  next();
});
```

### 4. 敏感信息保护

```javascript
// ✅ 永远不在响应中返回密码
const user = await User.findByPk(userId);
const { password, ...userWithoutPassword } = user.toJSON();
res.sendSuccess('获取成功', { user: userWithoutPassword });

// ✅ 在模型中定义默认排除字段
const User = sequelize.define('User', {
  // ...字段定义
}, {
  defaultScope: {
    attributes: { exclude: ['password', 'salt'] }  // 默认排除敏感字段
  }
});

// ✅ 日志中不记录敏感信息
logger.info('用户登录', {
  userId: user.id,
  username: user.username,
  // password: user.password  ❌ 不要记录密码
});
```

---

## 测试规范（未实现，建议添加）

### 单元测试示例

```javascript
// tests/services/UserService.test.js
const { describe, it, expect, beforeEach } = require('@jest/globals');
const UserService = require('../../app/services/user/UserService');

describe('UserService', () => {
  let userService;
  
  beforeEach(() => {
    userService = new UserService();
  });
  
  describe('validateEmail', () => {
    it('应该验证合法的邮箱', () => {
      expect(userService.validateEmail('test@example.com')).toBe(true);
    });
    
    it('应该拒绝不合法的邮箱', () => {
      expect(userService.validateEmail('invalid-email')).toBe(false);
    });
  });
});
```

### 集成测试示例

```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../app');

describe('Authentication API', () => {
  describe('POST /api/user/auth/login', () => {
    it('应该成功登录并返回token', async () => {
      const response = await request(app)
        .post('/api/user/auth/login')
        .send({
          username: 'testuser',
          password: 'Password123'
        })
        .expect(200);
      
      expect(response.body.success).toBe(1);
      expect(response.body.data).toHaveProperty('token');
    });
    
    it('应该拒绝错误的密码', async () => {
      const response = await request(app)
        .post('/api/user/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        })
        .expect(401);
      
      expect(response.body.success).toBe(0);
    });
  });
});
```

---

## 部署配置

### Docker部署

```bash
# 开发环境
docker-compose -f docker-compose.dev.yml up -d

# 生产环境
docker-compose up -d

# 生产环境 + Nginx
docker-compose --profile with-nginx up -d
```

### 环境变量配置

```bash
# env/pro.env (生产环境)
NODE_ENV=production
PORT=3000
CLUSTER_MODE=true              # 启用集群模式

# 数据库配置
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=apiuser
DB_PASS=strong_password
DB_NAME=production_db

# Redis配置
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# JWT配置
JWT_SECRET=your_production_jwt_secret_key_change_this
JWT_EXPIRES_IN=7d

# MongoDB配置
MONGO_URI=mongodb://mongo-host:27017/production_db
```

### 集群模式

```javascript
// 通过环境变量控制
CLUSTER_MODE=true npm run start:prod

// 集群配置在 bin/cluster-manager.js
// 自动根据CPU核心数创建工作进程
// 自动重启失败的工作进程
// 零停机时间重载
```

### 健康检查

```bash
# 手动检查
curl http://localhost:3000/health

# 响应示例
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "mongodb": "connected"
  },
  "memory": {
    "used": "150.5 MB",
    "total": "512 MB",
    "percentage": "29.4%"
  }
}
```

---

## AI开发时的注意事项

### 1. 代码生成原则

✅ **必须遵守**:
- 所有Controller继承BaseController
- 所有Service继承BaseService
- 使用项目定义的状态常量（COMMON_STATUS, USER_STATUS等）
- 统一使用sendSuccess/sendError响应
- 密码必须使用bcrypt加密
- 敏感操作必须添加审计日志
- 使用预定义的中间件栈组合

❌ **禁止**:
- 不要创建新的响应格式
- 不要硬编码状态值（用常量）
- 不要在返回数据中包含密码
- 不要忘记参数验证
- 不要在日志中记录敏感信息

### 2. 新功能开发流程

```
1. 定义数据模型 (app/models/)
   ↓
2. 创建服务类 (app/services/)
   - 继承BaseService
   - 实现业务逻辑
   - 使用事务和缓存
   ↓
3. 创建控制器 (app/controllers/)
   - 继承BaseController
   - 调用服务层
   - 使用统一响应格式
   ↓
4. 定义路由 (app/routes/)
   - 使用预定义中间件栈
   - 添加参数验证
   - 绑定控制器方法
   ↓
5. 测试功能
   - 单元测试
   - 集成测试
   - 手动测试
```

### 3. 代码示例模板

#### 完整的CRUD实现模板

```javascript
// ========== Model ==========
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
      allowNull: false,
      comment: '商品名称'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '价格'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 10,
      comment: '状态: 0=下架, 10=上架'
    }
  }, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['status'] }
    ]
  });

  return Product;
};

// ========== Service ==========
// app/services/product/ProductService.js
const BaseService = require('../base/BaseService');
const { ValidationError } = require('../../../middleware/core/errorHandler');

class ProductService extends BaseService {
  /**
   * 获取商品列表
   */
  async getProducts(filters, pagination, sequelize) {
    const { Product } = sequelize.models;
    
    // 构建查询条件
    const where = this.buildWhereCondition(filters, ['status', 'name']);
    
    // 使用缓存
    const cacheKey = `list:${JSON.stringify(where)}:${pagination.page}:${pagination.limit}`;
    
    return await this.getOrSetCache('products', cacheKey, async () => {
      const { count, rows } = await Product.findAndCountAll({
        where,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [['created_at', 'DESC']]
      });
      
      return { total: count, items: rows };
    }, 1800);  // 30分钟缓存
  }
  
  /**
   * 创建商品
   */
  async createProduct(data, sequelize) {
    // 数据验证
    const validation = this.validateData(data, {
      name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
      price: { required: true, type: 'number', min: 0 }
    });
    
    if (!validation.isValid) {
      throw new ValidationError('数据验证失败', validation.errors);
    }
    
    const { Product } = sequelize.models;
    
    // 使用事务
    return await this.executeTransaction(async (transaction) => {
      const product = await Product.create(data, { transaction });
      
      // 清除列表缓存
      await this.cache.deletePattern('products:list:*');
      
      return product;
    }, sequelize);
  }
  
  /**
   * 更新商品
   */
  async updateProduct(id, data, sequelize) {
    const { Product } = sequelize.models;
    
    return await this.executeTransaction(async (transaction) => {
      const product = await Product.findByPk(id, { transaction });
      
      if (!product) {
        throw new NotFoundError('商品不存在');
      }
      
      await product.update(data, { transaction });
      
      // 清除相关缓存
      await this.clearCache([
        `products:${id}`,
        'products:list:*'
      ]);
      
      return product;
    }, sequelize);
  }
  
  /**
   * 删除商品
   */
  async deleteProduct(id, sequelize) {
    const { Product } = sequelize.models;
    
    return await this.executeTransaction(async (transaction) => {
      const product = await Product.findByPk(id, { transaction });
      
      if (!product) {
        throw new NotFoundError('商品不存在');
      }
      
      await product.destroy({ transaction });
      
      // 清除相关缓存
      await this.clearCache([
        `products:${id}`,
        'products:list:*'
      ]);
      
      return { success: true };
    }, sequelize);
  }
}

module.exports = ProductService;

// ========== Controller ==========
// app/controllers/product/ProductController.js
const BaseController = require('../base/BaseController');
const ProductService = require('../../services/product/ProductService');

class ProductController extends BaseController {
  constructor() {
    super();
    this.productService = new ProductService();
  }
  
  /**
   * 获取商品列表
   */
  getProducts = this.asyncHandler(async (req, res) => {
    // 获取分页参数
    const pagination = this.getPaginationParams(req);
    
    // 获取筛选条件
    const filters = {
      status: req.query.status,
      name: req.query.name
    };
    
    // 调用服务
    const result = await this.productService.getProducts(
      filters,
      pagination,
      res.sequelize
    );
    
    // 返回分页响应
    return this.sendPaginatedResponse(
      res,
      result.items,
      { ...pagination, total: result.total },
      '获取商品列表成功'
    );
  });
  
  /**
   * 创建商品
   */
  createProduct = this.asyncHandler(async (req, res) => {
    // 记录操作
    this.logAction('创建商品', req, { data: req.body });
    
    // 调用服务
    const product = await this.productService.createProduct(
      req.body,
      res.sequelize
    );
    
    return this.sendSuccess(res, '创建商品成功', { product }, 201);
  });
  
  /**
   * 更新商品
   */
  updateProduct = this.asyncHandler(async (req, res) => {
    const productId = req.params.id;
    
    this.logAction('更新商品', req, { productId, data: req.body });
    
    const product = await this.productService.updateProduct(
      productId,
      req.body,
      res.sequelize
    );
    
    return this.sendSuccess(res, '更新商品成功', { product });
  });
  
  /**
   * 删除商品
   */
  deleteProduct = this.asyncHandler(async (req, res) => {
    const productId = req.params.id;
    
    this.logAction('删除商品', req, { productId });
    
    await this.productService.deleteProduct(productId, res.sequelize);
    
    return this.sendSuccess(res, '删除商品成功');
  });
}

module.exports = ProductController;

// ========== Routes ==========
// app/routes/admin-api/products/index.js
const express = require('express');
const router = express.Router();
const { stacks, quick } = require('../../../middleware');
const ProductController = require('../../controllers/product/ProductController');

const productController = new ProductController();

/**
 * 获取商品列表
 * GET /api/admin/products
 */
router.get('/',
  stacks.admin.cachedQuery,  // 管理员认证 + 缓存
  quick.validate([
    quick.rules.query('page').optional().isInt({ min: 1 }),
    quick.rules.query('limit').optional().isInt({ min: 1, max: 100 }),
    quick.rules.query('status').optional().isIn(['0', '10'])
  ]),
  productController.getProducts.bind(productController)
);

/**
 * 创建商品
 * POST /api/admin/products
 */
router.post('/',
  stacks.admin.standard,  // 管理员认证 + 审计
  quick.validate([
    quick.rules.body('name').trim().isLength({ min: 2, max: 100 }),
    quick.rules.body('price').isFloat({ min: 0 }),
    quick.rules.body('status').optional().isIn([0, 10])
  ]),
  productController.createProduct.bind(productController)
);

/**
 * 更新商品
 * PUT /api/admin/products/:id
 */
router.put('/:id',
  stacks.admin.standard,
  quick.validate([
    quick.rules.param('id').isInt(),
    quick.rules.body('name').optional().trim().isLength({ min: 2, max: 100 }),
    quick.rules.body('price').optional().isFloat({ min: 0 }),
    quick.rules.body('status').optional().isIn([0, 10])
  ]),
  productController.updateProduct.bind(productController)
);

/**
 * 删除商品
 * DELETE /api/admin/products/:id
 */
router.delete('/:id',
  stacks.admin.sensitive,  // 敏感操作（管理员认证 + 严格限流 + 审计）
  quick.validate([
    quick.rules.param('id').isInt()
  ]),
  productController.deleteProduct.bind(productController)
);

module.exports = router;

// ========== 注册路由 ==========
// app/routes/admin-api/index.js
const productRouter = require('./products');
router.use('/products', productRouter);
```

---

## 常见问题解决

### 1. 数据库连接失败

```javascript
// 检查配置
console.log('DB Config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

// 测试连接
try {
  await sequelize.authenticate();
  console.log('数据库连接成功');
} catch (error) {
  console.error('数据库连接失败:', error.message);
}
```

### 2. Redis连接失败

```javascript
// 检查Redis状态
const redis = require('./common/redis');
try {
  await redis.ping();
  console.log('Redis连接成功');
} catch (error) {
  console.warn('Redis连接失败，缓存功能将不可用:', error.message);
}
```

### 3. JWT验证失败

```javascript
// 检查token格式
const authHeader = req.headers.authorization;
console.log('Authorization Header:', authHeader);

// 检查JWT配置
console.log('JWT Secret:', process.env.JWT_SECRET ? '已配置' : '未配置');
console.log('JWT Expires:', process.env.JWT_EXPIRES_IN);
```

### 4. 缓存未生效

```javascript
// 检查Redis连接
const { cacheManager } = require('./common');
const testKey = await cacheManager.get('test', 'key');
console.log('缓存测试:', testKey);

// 手动设置缓存
await cacheManager.set('test', 'key', 'value', 60);
```

---

## 项目扩展建议

### 1. 添加WebSocket支持

```javascript
// 建议使用 socket.io
const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('客户端连接:', socket.id);
  
  socket.on('message', (data) => {
    // 处理消息
  });
});
```

### 2. 添加消息队列

```javascript
// 建议使用 Bull (基于Redis)
const Queue = require('bull');
const emailQueue = new Queue('email', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

// 添加任务
await emailQueue.add({
  to: 'user@example.com',
  subject: '欢迎注册',
  body: '...'
});

// 处理任务
emailQueue.process(async (job) => {
  await sendEmail(job.data);
});
```

### 3. 添加GraphQL支持

```javascript
// 建议使用 apollo-server-express
const { ApolloServer } = require('apollo-server-express');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: req.user,
    sequelize: req.sequelize
  })
});

await server.start();
server.applyMiddleware({ app });
```

---

## 总结

这个Express API项目是一个**企业级、生产就绪**的后端框架，具有以下核心优势:

✨ **架构清晰**: MVC分层 + 三端API体系 + 中间件栈模式
✨ **功能完善**: 认证授权 + 缓存 + 限流 + 日志 + 监控 + 国际化
✨ **安全可靠**: 数据验证 + 错误处理 + 审计日志 + 安全头部
✨ **性能优化**: 连接池 + 缓存策略 + 集群模式 + 压缩优化
✨ **易于扩展**: 基类继承 + 中间件工厂 + 依赖注入 + 模块化设计
✨ **生产就绪**: Docker + 健康检查 + 优雅关闭 + 日志轮转

**AI开发时请严格遵守本文档的规范和最佳实践，确保代码质量和一致性！**
