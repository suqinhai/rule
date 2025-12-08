# Express API 企业级项目 - AI开发提示词

## 项目概述

你正在开发一个基于Express.js的企业级API框架项目。这是一个功能完善、生产就绪的后端服务，采用MVC架构模式，支持MySQL和MongoDB双数据库架构，集成了Redis缓存、JWT认证、国际化、日志系统等现代化功能。

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


