# Express API 项目知识库

## 目录

1. [项目概述](#项目概述)
2. [技术架构](#技术架构)
3. [项目结构详解](#项目结构详解)
4. [核心模块说明](#核心模块说明)
5. [API架构设计](#api架构设计)
6. [数据库设计](#数据库设计)
7. [中间件系统](#中间件系统)
8. [认证与授权](#认证与授权)
9. [缓存策略](#缓存策略)
10. [日志系统](#日志系统)
11. [国际化支持](#国际化支持)
12. [性能优化](#性能优化)
13. [安全措施](#安全措施)
14. [开发规范](#开发规范)
15. [部署指南](#部署指南)
16. [故障排查](#故障排查)
17. [最佳实践](#最佳实践)

---

## 项目概述

### 项目定位
Express API 是一个企业级的 Node.js 后端框架，基于 Express.js 构建，集成了现代化的开发工具和最佳实践。它提供了一个完整的、生产就绪的 API 服务解决方案。

### 核心特性
- **MVC架构模式**：清晰的代码组织结构，便于维护和扩展
- **双数据库支持**：MySQL(关系型) + MongoDB(文档型)
- **多端API支持**：用户端、管理端、商户端独立设计
- **完善的认证系统**：JWT令牌认证，支持多角色权限管理
- **强大的中间件系统**：模块化的中间件设计，支持灵活组合
- **国际化支持**：内置i18n，支持多语言切换
- **容器化部署**：完整的Docker支持，便于DevOps实践

### 适用场景
- 中大型企业应用后端
- 微服务架构的API服务
- 需要高性能和高可用的Web服务
- 多端应用（Web、移动端、小程序）的统一后端

---

## 技术架构

### 技术栈
```
┌─────────────────────────────────────────┐
│           应用层 (Application)           │
├─────────────────────────────────────────┤
│ Express.js 4.18.2 │ Node.js >= 16.0.0  │
├─────────────────────────────────────────┤
│           中间件层 (Middleware)          │
├─────────────────────────────────────────┤
│ Helmet │ CORS │ Compression │ Rate Limit│
├─────────────────────────────────────────┤
│          数据访问层 (Data Access)        │
├─────────────────────────────────────────┤
│ Sequelize (MySQL) │ Mongoose (MongoDB)  │
├─────────────────────────────────────────┤
│           缓存层 (Cache)                 │
├─────────────────────────────────────────┤
│         Redis (ioredis)                  │
├─────────────────────────────────────────┤
│          基础设施 (Infrastructure)       │
├─────────────────────────────────────────┤
│ Docker │ Nginx │ PM2 │ Winston Logger   │
└─────────────────────────────────────────┘
```

### 架构原则
1. **职责分离**：控制器、服务、模型各司其职
2. **依赖注入**：通过中间件注入数据库连接和工具函数
3. **统一响应**：标准化的API响应格式
4. **错误处理**：集中式错误处理机制
5. **可扩展性**：模块化设计，易于添加新功能

---

## 项目结构详解

### 根目录结构
```
init-expresss-api/
├── app.js                 # 应用程序入口，配置Express和中间件
├── bin/www               # HTTP服务器启动脚本
├── package.json          # 项目依赖和脚本配置
├── .env                  # 环境变量配置（从env目录复制）
├── .eslintrc.js         # ESLint代码规范配置
├── .prettierrc.js       # Prettier代码格式化配置
├── Dockerfile           # Docker镜像构建文件
├── docker-compose.yml   # Docker服务编排文件
├── Makefile            # 常用命令快捷方式
└── README.md           # 项目说明文档
```

### 核心目录说明

#### `/controllers` - 控制器层
负责处理HTTP请求和响应，参数验证，调用服务层方法。
```
controllers/
├── base/
│   ├── BaseController.js      # 基础控制器类，提供通用方法
│   └── BaseMerchantController.js
├── user/                      # 用户端控制器
│   ├── UserAuthController.js  # 用户认证（登录、注册、登出）
│   └── UserProfileController.js # 用户资料管理
├── admin/                     # 管理端控制器
│   ├── AdminUserController.js # 用户管理
│   └── AdminSystemController.js # 系统管理
└── merchant/                  # 商户端控制器
    ├── MerchantAuthController.js
    ├── MerchantProductController.js
    └── MerchantShopController.js
```

#### `/services` - 服务层
包含核心业务逻辑，数据处理，事务管理。
```
services/
├── base/
│   ├── BaseService.js         # 基础服务类，提供通用功能
│   └── BaseMerchantService.js
├── user/                      # 用户端服务
│   ├── UserAuthService.js     # 认证相关业务逻辑
│   └── UserProfileService.js  # 资料管理业务逻辑
├── admin/                     # 管理端服务
│   ├── AdminUserService.js    # 用户管理业务逻辑
│   └── AdminSystemService.js  # 系统管理业务逻辑
├── merchant/                  # 商户端服务
└── common/                    # 通用服务
    ├── EmailService.js        # 邮件发送服务
    ├── FileService.js         # 文件处理服务
    └── NotificationService.js # 通知服务
```

#### `/routes` - 路由层
定义API端点和路由规则。
```
routes/
├── index.js                   # 路由总入口
├── user-api/                  # 用户端API路由
│   ├── index.js              # 用户API入口
│   ├── auth/                 # 认证相关路由
│   └── profile/              # 资料相关路由
├── admin-api/                 # 管理端API路由
│   ├── index.js              # 管理API入口
│   ├── users/                # 用户管理路由
│   └── system/               # 系统管理路由
└── merchant-api/              # 商户端API路由
```

#### `/middleware` - 中间件层
提供各种功能中间件。
```
middleware/
├── index.js                   # 中间件统一导出
├── core/                      # 核心中间件
│   ├── auth.js               # 认证中间件
│   ├── cache.js              # 缓存中间件
│   ├── errorHandler.js       # 错误处理中间件
│   ├── rateLimit.js          # 限流中间件
│   └── validator.js          # 数据验证中间件
├── api/                       # API类型中间件
│   ├── user.js               # 用户端中间件栈
│   ├── admin.js              # 管理端中间件栈
│   └── merchant.js           # 商户端中间件栈
├── monitoring/                # 监控中间件
│   ├── audit.js              # 审计日志
│   └── performance.js        # 性能监控
└── utils/                     # 工具函数
```

#### `/models` - 数据模型层
定义数据库表结构和模型。
```
models/
├── index.js                   # 模型入口，初始化所有模型
├── users/                     # 用户相关模型
│   ├── user.js               # 用户基础模型
│   ├── enhancedUser.js       # 增强用户模型
│   └── registerConfig.js     # 注册配置模型
└── merchants/                 # 商户相关模型
    └── index.js
```

#### `/common` - 公共模块
提供数据库连接、工具函数等公共功能。
```
common/
├── index.js                   # 公共模块入口
├── mysql/                     # MySQL数据库连接
├── mango/                     # MongoDB数据库连接
├── redis/                     # Redis缓存连接
│   ├── index.js              # Redis连接管理
│   └── cache.js              # 缓存操作封装
├── logger/                    # 日志模块
│   ├── index.js              # Winston日志配置
│   └── clusterLogger.js      # 集群模式日志
├── i18n/                      # 国际化模块
│   ├── index.js              # i18n配置
│   └── locales/              # 语言文件
│       ├── en/               # 英文
│       └── zh/               # 中文
├── constants/                 # 常量定义
│   └── status.js             # 状态码常量
└── utils/                     # 工具函数
    └── statusHelper.js       # 状态辅助函数
```

#### `/env` - 环境配置
存放不同环境的配置文件。
```
env/
├── dev.env                    # 开发环境配置
├── uat.env                    # 测试环境配置
└── pro.env                    # 生产环境配置
```

---

## 核心模块说明

### 1. 控制器（Controllers）

#### BaseController 基础控制器
所有控制器的父类，提供：
- `asyncHandler()`: 异步错误处理包装器
- `sendSuccess()`: 统一成功响应
- `sendError()`: 统一错误响应
- `sendPaginatedResponse()`: 分页响应
- `validateRequiredFields()`: 必填字段验证
- `getPaginationParams()`: 获取分页参数
- `getSortParams()`: 获取排序参数
- `logAction()`: 操作日志记录
- `logError()`: 错误日志记录

使用示例：
```javascript
class UserController extends BaseController {
  async getUsers(req, res, next) {
    try {
      // 获取分页参数
      const { page, limit, offset } = this.getPaginationParams(req);
      
      // 调用服务层
      const result = await userService.getUsers({ limit, offset });
      
      // 返回分页响应
      this.sendPaginatedResponse(res, result.data, {
        page,
        limit,
        total: result.total
      });
    } catch (error) {
      this.logError('获取用户列表', error, req);
      next(error);
    }
  }
}
```

### 2. 服务（Services）

#### BaseService 基础服务
所有服务的父类，提供：
- `executeTransaction()`: 事务管理
- `getOrSetCache()`: 缓存读写
- `clearCache()`: 清除缓存
- `validateData()`: 数据验证
- `buildWhereCondition()`: 构建查询条件
- `logAction()`: 操作日志
- `logError()`: 错误日志
- `generateId()`: 生成唯一ID
- `formatDate()`: 日期格式化
- `deepClone()`: 深度克隆

使用示例：
```javascript
class UserService extends BaseService {
  async createUser(userData) {
    // 数据验证
    const validation = this.validateData(userData, {
      username: { required: true, minLength: 3, maxLength: 20 },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { required: true, minLength: 6 }
    });
    
    if (!validation.isValid) {
      throw new Error('数据验证失败');
    }
    
    // 使用事务创建用户
    return await this.executeTransaction(async (transaction) => {
      const user = await User.create(userData, { transaction });
      
      // 清除相关缓存
      await this.clearCache(['users:list', `user:${user.id}`]);
      
      return user;
    }, sequelize);
  }
}
```

### 3. 中间件系统

#### 中间件分类
1. **核心中间件**
   - 认证中间件：JWT令牌验证
   - 限流中间件：API请求频率控制
   - 缓存中间件：响应缓存
   - 验证中间件：请求数据验证
   - 错误处理：统一错误响应

2. **API中间件栈**
   - 用户端：公开、认证、可选认证、缓存、敏感操作
   - 管理端：标准、敏感、超级管理员、批量操作、导出
   - 商户端：公开、认证、产品管理、店铺访问

3. **监控中间件**
   - 性能监控：记录API响应时间
   - 审计日志：记录敏感操作

#### 中间件使用示例
```javascript
// 使用预定义的中间件栈
router.get('/users', 
  middleware.stacks.admin.standard,  // 管理员标准中间件栈
  adminController.getUsers
);

// 使用快速访问方式
router.post('/login',
  middleware.quick.loginRateLimit,   // 登录限流
  middleware.quick.validate([         // 数据验证
    middleware.quick.rules.username(),
    middleware.quick.rules.password()
  ]),
  userController.login
);

// 自定义中间件栈
const customStack = middleware.factories.createUserStack({
  auth: 'required',
  caching: 'medium',
  rateLimit: 'strict'
});
```

### 4. 数据库设计

#### MySQL 数据模型
使用 Sequelize ORM，支持：
- 模型定义和关联
- 数据验证
- 钩子函数
- 事务管理
- 连接池优化

示例模型：
```javascript
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
  role: {
    type: DataTypes.INTEGER,
    defaultValue: USER_ROLE.USER,
    comment: '用户角色(0:普通用户,1:管理员,2:超级管理员)'
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: USER_STATUS.ACTIVE,
    comment: '用户状态(0:未激活,1:已激活,2:已暂停,3:已封禁)'
  }
});
```

#### MongoDB 数据模型
使用 Mongoose ODM，适用于：
- 日志存储
- 非结构化数据
- 实时数据
- 大数据量存储

### 5. 缓存策略

#### Redis 缓存层次
1. **短期缓存** (5分钟)
   - 热点数据
   - 频繁查询结果
   - 会话数据

2. **中期缓存** (1小时)
   - 用户信息
   - 配置数据
   - 统计数据

3. **长期缓存** (1天)
   - 静态数据
   - 字典数据
   - 系统配置

#### 缓存使用示例
```javascript
// 在服务层使用缓存
async getUserById(userId) {
  return await this.getOrSetCache(
    `user:${userId}`,
    async () => {
      return await User.findByPk(userId);
    },
    3600  // 1小时缓存
  );
}

// 在中间件中使用缓存
router.get('/products',
  middleware.quick.staticDataCache,  // 静态数据缓存
  productController.getProducts
);
```

---

## API架构设计

### API分类

#### 1. 用户端API (`/api/user/*`)
- **目标用户**：普通终端用户
- **认证方式**：JWT令牌（部分接口支持可选认证）
- **限流策略**：每15分钟1000次请求
- **主要功能**：
  - 用户认证：登录、注册、登出、刷新令牌
  - 个人资料：查看、修改、上传头像
  - 密码管理：修改密码、重置密码

#### 2. 管理端API (`/api/admin/*`)
- **目标用户**：系统管理员
- **认证方式**：管理员JWT令牌（严格权限验证）
- **限流策略**：每15分钟500次请求
- **主要功能**：
  - 用户管理：列表、详情、状态管理、角色分配
  - 系统管理：配置、缓存、日志、监控
  - 数据统计：用户统计、业务统计、性能统计

#### 3. 商户端API (`/api/merchant/*`)
- **目标用户**：商户用户
- **认证方式**：商户JWT令牌
- **限流策略**：每15分钟800次请求
- **主要功能**：
  - 商户认证：登录、注册、认证
  - 店铺管理：创建、编辑、状态管理
  - 产品管理：发布、编辑、上下架

### API设计原则

1. **RESTful规范**
   - 使用标准HTTP方法：GET、POST、PUT、DELETE
   - 资源命名使用名词复数
   - 使用合适的状态码

2. **版本管理**
   - URL版本：`/api/v1/user/profile`
   - Header版本：`API-Version: 1.0`

3. **统一响应格式**
   ```json
   {
     "success": true,
     "message": "操作成功",
     "data": {},
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

4. **错误响应格式**
   ```json
   {
     "success": false,
     "message": "操作失败",
     "errors": [
       {
         "field": "username",
         "message": "用户名已存在"
       }
     ],
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

---

## 认证与授权

### JWT认证流程

1. **登录流程**
   ```
   客户端 -> POST /api/user/auth/login -> 验证凭据 -> 生成JWT -> 返回令牌
   ```

2. **请求认证**
   ```
   客户端 -> 添加Header: Authorization: Bearer <token> -> 验证JWT -> 执行请求
   ```

3. **令牌刷新**
   ```
   客户端 -> POST /api/user/auth/refresh -> 验证刷新令牌 -> 生成新JWT
   ```

### 角色权限系统

#### 用户角色
```javascript
const USER_ROLE = {
  USER: 0,          // 普通用户
  ADMIN: 1,         // 管理员
  SUPER_ADMIN: 2,   // 超级管理员
  MODERATOR: 3      // 版主
};
```

#### 权限控制
```javascript
// 路由级权限控制
router.get('/admin/users',
  middleware.quick.requireAdmin,      // 需要管理员权限
  adminController.getUsers
);

// 细粒度权限控制
router.delete('/admin/users/:id',
  middleware.quick.requirePermissions(['user:delete']),  // 需要特定权限
  adminController.deleteUser
);
```

---

## 日志系统

### 日志配置
使用 Winston 进行日志管理，支持：
- 多级别日志：error、warn、info、debug
- 日志轮转：按日期自动分割
- 多输出目标：控制台、文件、数据库
- 结构化日志：JSON格式便于分析

### 日志使用
```javascript
// 在控制器中记录日志
this.logAction('创建用户', req, { userId: user.id });

// 在服务中记录日志
this.logError('数据库查询失败', error, { query: sql });

// 直接使用logger
logger.info('应用启动', {
  port: process.env.PORT,
  env: process.env.NODE_ENV
});
```

---

## 性能优化

### 1. 数据库优化
- **连接池管理**：合理配置连接池大小
- **查询优化**：使用索引、避免N+1查询
- **事务管理**：合理使用事务，避免长事务
- **读写分离**：主从复制，读写分离

### 2. 缓存优化
- **多级缓存**：内存缓存 + Redis缓存
- **缓存预热**：启动时预加载热点数据
- **缓存更新**：使用发布订阅模式更新缓存
- **缓存穿透保护**：布隆过滤器

### 3. 应用优化
- **响应压缩**：Gzip压缩减少传输大小
- **静态资源CDN**：静态文件使用CDN加速
- **集群模式**：多进程负载均衡
- **异步处理**：使用消息队列处理耗时任务

### 4. 监控优化
- **性能监控**：API响应时间监控
- **错误监控**：错误率和错误类型监控
- **资源监控**：CPU、内存、磁盘监控
- **业务监控**：关键业务指标监控

---

## 安全措施

### 1. 输入验证
- 使用 express-validator 进行参数验证
- SQL注入防护（参数化查询）
- XSS防护（输入过滤和转义）
- 文件上传验证（类型、大小限制）

### 2. 认证安全
- JWT密钥定期轮换
- 密码强度要求
- 登录失败锁定
- 二次验证支持

### 3. 传输安全
- HTTPS强制使用
- HSTS头部设置
- 安全Cookie设置
- CORS严格配置

### 4. 应用安全
- Helmet安全头部
- 限流防护
- CSRF防护
- 依赖安全审计

---

## 开发规范

### 1. 代码规范
- **命名规范**
  - 文件名：小写，使用连字符
  - 类名：PascalCase
  - 函数名：camelCase
  - 常量：UPPER_SNAKE_CASE

- **注释规范**
  - 文件头部注释说明功能
  - 函数注释说明参数和返回值
  - 复杂逻辑添加行内注释

### 2. Git规范
- **分支管理**
  - master：生产分支
  - develop：开发分支
  - feature/*：功能分支
  - hotfix/*：紧急修复分支

- **提交信息**
  ```
  feat: 添加用户登录功能
  fix: 修复缓存过期问题
  docs: 更新API文档
  style: 代码格式调整
  refactor: 重构认证模块
  test: 添加单元测试
  chore: 更新依赖版本
  ```

### 3. API规范
- 使用合适的HTTP方法和状态码
- 保持URL简洁明了
- 使用版本控制
- 提供详细的错误信息

### 4. 测试规范
- 单元测试覆盖率 > 80%
- 集成测试覆盖主要流程
- 性能测试定期执行
- 安全测试包含在CI/CD中

---

## 部署指南

### 1. 环境准备
```bash
# 安装依赖
npm install

# 配置环境变量
cp env/pro.env .env

# 初始化数据库
npm run db:sync
```

### 2. Docker部署
```bash
# 构建镜像
docker build -t express-api .

# 使用docker-compose启动
docker-compose up -d

# 查看日志
docker-compose logs -f app
```

### 3. PM2部署
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs
```

### 4. Nginx配置
```nginx
upstream express_api {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://express_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 故障排查

### 1. 常见问题

#### 数据库连接失败
- 检查数据库服务是否启动
- 验证连接配置是否正确
- 检查防火墙设置
- 查看数据库日志

#### Redis连接失败
- 检查Redis服务状态
- 验证密码和端口配置
- 检查内存使用情况
- 查看Redis日志

#### API响应慢
- 检查数据库查询性能
- 查看缓存命中率
- 检查网络延迟
- 分析性能日志

### 2. 调试技巧
```bash
# 启用调试模式
DEBUG=express:* npm start

# 查看详细日志
tail -f logs/error.log

# 性能分析
node --inspect bin/www

# 内存分析
node --expose-gc --inspect bin/www
```

### 3. 监控告警
- 设置错误率告警
- 配置响应时间告警
- 监控资源使用告警
- 业务指标异常告警

---

## 最佳实践

### 1. 开发实践
- **保持代码简洁**：每个函数只做一件事
- **避免回调地狱**：使用async/await
- **错误优先处理**：始终处理错误情况
- **使用TypeScript**：提高代码质量和可维护性

### 2. 安全实践
- **最小权限原则**：只授予必要的权限
- **定期更新依赖**：及时修复安全漏洞
- **敏感信息加密**：不在代码中硬编码密钥
- **日志脱敏**：不记录敏感信息

### 3. 性能实践
- **延迟加载**：按需加载模块
- **批量操作**：减少数据库查询次数
- **异步非阻塞**：避免同步阻塞操作
- **资源池化**：复用数据库连接等资源

### 4. 运维实践
- **自动化部署**：使用CI/CD流程
- **蓝绿部署**：无缝更新应用
- **健康检查**：定期检查服务状态
- **备份恢复**：定期备份数据和配置

---

## 附录

### 环境变量说明
```bash
# 应用配置
NODE_ENV=production          # 运行环境
PORT=3000                   # 服务端口
CLUSTER_MODE=true           # 集群模式

# 数据库配置
DB_HOST=localhost           # MySQL主机
DB_PORT=3306               # MySQL端口
DB_USER=root               # MySQL用户
DB_PASS=password           # MySQL密码
DB_NAME=express_api        # 数据库名

# MongoDB配置
MONGO_URI=mongodb://localhost:27017/express_api

# Redis配置
REDIS_HOST=localhost        # Redis主机
REDIS_PORT=6379            # Redis端口
REDIS_PASSWORD=            # Redis密码

# JWT配置
JWT_SECRET=your_secret     # JWT密钥
JWT_EXPIRES_IN=1d         # JWT过期时间

# 日志配置
LOG_LEVEL=info            # 日志级别
LOG_DIR=./logs           # 日志目录
```

### 常用命令
```bash
# 开发相关
npm run dev               # 开发模式启动
npm run lint             # 代码检查
npm run format           # 代码格式化

# 数据库相关
npm run db:sync          # 同步数据库
npm run db:seed          # 填充测试数据
npm run db:reset         # 重置数据库

# 部署相关
npm run build            # 构建项目
npm run start:prod       # 生产模式启动
npm run health           # 健康检查

# Docker相关
make build              # 构建镜像
make up                 # 启动服务
make down               # 停止服务
make logs               # 查看日志
```

### 相关资源
- [Express.js官方文档](https://expressjs.com/)
- [Sequelize文档](https://sequelize.org/)
- [Redis文档](https://redis.io/documentation)
- [JWT规范](https://jwt.io/)
- [Docker文档](https://docs.docker.com/)

---

**最后更新**: 2024-08-07
**维护者**: Express API Team
**版本**: 1.0.0
