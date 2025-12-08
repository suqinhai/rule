# Express API 企业级项目 - AI编码规则

## 项目概述
本项目是一个基于Express.js的企业级用户服务API，采用MVC架构模式，支持MySQL+MongoDB双数据库，具有完善的安全机制和性能优化。

## 核心架构原则

### 1. MVC架构分层
```
Routes (路由层) → Controllers (控制器层) → Services (服务层) → Models (数据层)
```

- **Routes**: 负责HTTP请求路由分发和中间件应用
- **Controllers**: 处理HTTP请求/响应，参数验证，调用服务层
- **Services**: 核心业务逻辑，事务处理，缓存策略
- **Models**: 数据访问层，ORM/ODM操作

### 2. 三端API分离
- **用户端API** (`/api/user/*`): 面向普通用户的接口
- **管理端API** (`/api/admin/*`): 面向系统管理员的接口  
- **商户端API** (`/api/merchant/*`): 面向商户用户的接口

## 编码规范

### 1. 文件命名规范
- **控制器**: `XxxController.js` (PascalCase + Controller后缀)
- **服务类**: `XxxService.js` (PascalCase + Service后缀)
- **模型文件**: `xxx.js` (camelCase)
- **路由文件**: `index.js` 或功能模块名
- **中间件**: `xxx.js` (camelCase)

### 2. 目录结构规范
```
app/
├── controllers/          # 控制器层
│   ├── base/            # 基础控制器
│   ├── user/            # 用户端控制器
│   ├── admin/           # 管理端控制器
│   └── merchant/        # 商户端控制器
├── services/            # 服务层
│   ├── base/            # 基础服务
│   ├── user/            # 用户端服务
│   ├── admin/           # 管理端服务
│   ├── merchant/        # 商户端服务
│   └── common/          # 通用服务
├── routes/              # 路由层
│   ├── user-api/        # 用户端路由
│   ├── admin-api/       # 管理端路由
│   └── merchant-api/    # 商户端路由
└── models/              # 数据模型
    ├── users/           # 用户相关模型
    └── merchants/       # 商户相关模型
```

### 3. 类和方法命名
- **类名**: PascalCase (如 `UserAuthController`)
- **方法名**: camelCase (如 `getUserProfile`)
- **常量**: UPPER_SNAKE_CASE (如 `USER_STATUS`)
- **变量**: camelCase (如 `userInfo`)

## 数据类型规范

### 1. 状态值使用数字常量
**禁止使用布尔值和字符串枚举，统一使用数字常量**

```javascript
// ✅ 正确 - 使用数字常量
const USER_STATUS = {
  INACTIVE: 0,    // 未激活
  ACTIVE: 1,      // 已激活
  SUSPENDED: 2,   // 已暂停
  BANNED: 3,      // 已封禁
  DELETED: 4      // 已删除
};

// ❌ 错误 - 不要使用布尔值或字符串
const isActive = true;
const status = 'active';
```

### 2. 通用状态常量
```javascript
const COMMON_STATUS = {
  DISABLED: 0,    // 禁用
  ENABLED: 1,     // 启用
  FAILED: 0,      // 失败
  SUCCESS: 1,     // 成功
  NO: 0,          // 否
  YES: 1          // 是
};
```

## 控制器编写规范

### 1. 基础控制器继承
所有控制器必须继承 `BaseController`：

```javascript
const BaseController = require('../base/BaseController');

class UserAuthController extends BaseController {
  constructor() {
    super();
    this.userAuthService = new UserAuthService();
  }

  // 使用箭头函数 + asyncHandler包装
  login = this.asyncHandler(async (req, res) => {
    try {
      // 业务逻辑
      const result = await this.userAuthService.login(username, password);
      return this.sendSuccess(res, '登录成功', result);
    } catch (error) {
      this.logError('用户登录失败', error, req);
      return this.sendError(res, error.message, 400);
    }
  });
}
```

### 2. 统一响应格式
使用基础控制器提供的响应方法：

```javascript
// 成功响应
this.sendSuccess(res, '操作成功', data, statusCode);

// 错误响应  
this.sendError(res, '操作失败', statusCode, errors);

// 分页响应
this.sendPaginatedResponse(res, data, pagination, message);
```

## 服务层编写规范

### 1. 基础服务继承
所有服务必须继承 `BaseService`：

```javascript
const BaseService = require('../base/BaseService');

class UserAuthService extends BaseService {
  constructor() {
    super();
  }

  async login(username, password, clientIP, sequelize) {
    // 使用事务处理
    return await this.executeTransaction(async (transaction) => {
      // 业务逻辑
      const user = await sequelize.models.User.findOne({
        where: { username },
        transaction
      });
      
      // 缓存处理
      await this.cache.set('user', `user_${user.id}`, user, 3600);
      
      return user;
    }, sequelize);
  }
}
```

### 2. 缓存策略
使用基础服务的缓存方法：

```javascript
// 获取或设置缓存
const data = await this.getOrSetCache(
  `user_${userId}`, 
  () => this.fetchUserFromDB(userId),
  3600 // TTL: 1小时
);

// 直接缓存操作
await this.cache.set('service', key, data, ttl);
const cachedData = await this.cache.get('service', key);
```

## 数据库操作规范

### 1. 双数据库支持
项目支持MySQL和MongoDB双数据库：

```javascript
// MySQL操作 (通过res.sequelize)
const users = await res.sequelize.models.User.findAll();

// MongoDB操作 (通过res.mongodb)
const { mongoose } = res.mongodb;
const result = await mongoose.connection.db
  .collection('logs')
  .insertOne(data);
```

### 2. 模型定义规范
```javascript
// MySQL模型 (Sequelize)
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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

## 路由编写规范

### 1. 路由分层结构
```javascript
// app/routes/index.js - 主路由入口
router.use('/user', userRouter);
router.use('/admin', adminRouter);  
router.use('/merchant', merchantRouter);

// app/routes/user-api/index.js - 用户端路由
router.use('/auth', authRouter);
router.use('/profile', profileRouter);
```

### 2. 中间件应用
```javascript
const { userAuth, userLimiter } = require('../../middleware');

// 应用认证和限流中间件
router.use('/auth', userLimiter);
router.use('/profile', userAuth, profileRouter);
```

## 中间件编写规范

### 1. 认证中间件
```javascript
const baseAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      req.user = null;
      req.isAuthenticated = AUTH_STATUS.NOT_AUTHENTICATED;
      return next();
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      req.isAuthenticated = AUTH_STATUS.TOKEN_INVALID;
      return next();
    }
    
    req.user = decoded;
    req.isAuthenticated = AUTH_STATUS.AUTHENTICATED;
    next();
  } catch (error) {
    logger.error('认证中间件错误:', error);
    next(error);
  }
};
```

### 2. 限流中间件
```javascript
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: COMMON_STATUS.FAILED, message },
    standardHeaders: COMMON_STATUS.YES,
    legacyHeaders: COMMON_STATUS.NO
  });
};
```

## 错误处理规范

### 1. 统一错误处理
```javascript
// 控制器中的错误处理
try {
  // 业务逻辑
} catch (error) {
  this.logError('操作失败', error, req);
  
  // 根据错误类型返回不同状态码
  if (error.message.includes('不存在')) {
    return this.sendError(res, error.message, 404);
  } else if (error.message.includes('权限')) {
    return this.sendError(res, error.message, 403);
  } else {
    return this.sendError(res, '服务器内部错误', 500);
  }
}
```

### 2. 全局错误处理中间件
```javascript
const errorHandler = (err, req, res, next) => {
  logger.error('全局错误处理:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });
  
  res.status(err.status || 500).json({
    success: COMMON_STATUS.FAILED,
    message: err.message || '服务器内部错误',
    timestamp: new Date().toISOString()
  });
};
```

## 日志记录规范

### 1. 操作日志
```javascript
// 记录用户操作
this.logAction('用户登录', req, { 
  username, 
  clientIP,
  userAgent: req.get('User-Agent')
});

// 记录错误信息
this.logError('登录失败', error, req);
```

### 2. 日志格式
```javascript
logger.info('操作描述', {
  action: '操作类型',
  userId: req.user?.id,
  ip: req.ip,
  url: req.originalUrl,
  method: req.method,
  ...additionalData
});
```

## 注释规范

### 1. 文件头注释
```javascript
/**
 * 用户认证控制器
 * 功能：处理用户登录、登出、注册等认证相关的HTTP请求
 * 作者：开发者姓名
 * 创建时间：YYYY-MM-DD
 * 最后修改：YYYY-MM-DD
 */
```

### 2. 方法注释
```javascript
/**
 * 用户登录方法
 * 功能：验证用户凭据并生成访问令牌
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {Promise<Object>} 登录结果包含用户信息和令牌
 */
login = this.asyncHandler(async (req, res) => {
  // 方法实现
});
```

### 3. 行内注释
使用中文注释，解释关键业务逻辑：

```javascript
// 验证用户输入参数的完整性和格式
const errors = this.validateRequiredFields(req, ['username', 'password']);

// 获取客户端真实IP地址，用于安全审计
const clientIP = req.ip || req.connection.remoteAddress;

// 调用服务层处理核心业务逻辑
const result = await this.userAuthService.login(username, password, clientIP);
```

## 环境配置规范

### 1. 环境变量命名
```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=123456
DB_NAME=testSxx

# Redis配置  
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# MongoDB配置
MONGO_URI=mongodb://localhost:27017/testSxx
MONGO_HOST=localhost
MONGO_PORT=27017
```

### 2. 配置文件结构
```
env/
├── dev.env      # 开发环境配置
├── uat.env      # 测试环境配置
└── pro.env      # 生产环境配置
```

## 安全规范

### 1. 输入验证
```javascript
// 使用express-validator进行参数验证
const { body, validationResult } = require('express-validator');

const validateLogin = [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6位'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: COMMON_STATUS.FAILED,
        message: '参数验证失败',
        errors: errors.array()
      });
    }
    next();
  }
];
```

### 2. 密码处理
```javascript
const bcrypt = require('bcrypt');

// 密码加密
const hashedPassword = await bcrypt.hash(password, 10);

// 密码验证
const isValid = await bcrypt.compare(password, user.password);
```

## 性能优化规范

### 1. 缓存策略
```javascript
// 分层缓存TTL配置
const CACHE_TTL = {
  SHORT: 300,    // 5分钟 - 频繁变化的数据
  MEDIUM: 3600,  // 1小时 - 中等变化的数据  
  LONG: 86400    // 1天 - 相对稳定的数据
};
```

### 2. 数据库优化
```javascript
// 使用连接池配置
pool: {
  max: 20,        // 最大连接数
  min: 5,         // 最小连接数
  acquire: 30000, // 获取连接超时时间
  idle: 10000     // 空闲连接超时时间
}
```

## 测试规范

### 1. 单元测试
```javascript
describe('UserAuthService', () => {
  it('应该成功登录有效用户', async () => {
    const result = await userAuthService.login('testuser', 'password123');
    expect(result.success).toBe(COMMON_STATUS.SUCCESS);
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
  });
});
```

### 2. API测试
```javascript
describe('POST /api/user/auth/login', () => {
  it('应该返回登录成功响应', async () => {
    const response = await request(app)
      .post('/api/user/auth/login')
      .send({ username: 'testuser', password: 'password123' })
      .expect(200);
      
    expect(response.body.success).toBe(COMMON_STATUS.SUCCESS);
    expect(response.body.data.token).toBeDefined();
  });
});
```

## 代码生成模板

### 1. 控制器模板
```javascript
/**
 * [功能描述]控制器
 * 功能：处理[具体功能]相关的HTTP请求
 */

const BaseController = require('../base/BaseController');
const [ServiceName] = require('../../services/[path]/[ServiceName]');

class [ControllerName] extends BaseController {
  constructor() {
    super();
    this.[serviceName] = new [ServiceName]();
  }

  /**
   * [方法描述]
   * [HTTP方法] [路由路径]
   */
  [methodName] = this.asyncHandler(async (req, res) => {
    try {
      this.logAction('[操作描述]', req);

      // 参数验证
      const errors = this.validateRequiredFields(req, ['field1', 'field2']);
      if (errors) {
        return this.sendError(res, '参数验证失败', 400, errors);
      }

      // 获取参数
      const { field1, field2 } = req.body;

      // 调用服务层
      const result = await this.[serviceName].[methodName](
        field1,
        field2,
        res.sequelize
      );

      // 返回成功响应
      return this.sendSuccess(res, '[操作成功消息]', result);

    } catch (error) {
      this.logError('[操作失败描述]', error, req);

      // 错误分类处理
      if (error.message.includes('不存在')) {
        return this.sendError(res, error.message, 404);
      } else if (error.message.includes('权限')) {
        return this.sendError(res, error.message, 403);
      } else {
        return this.sendError(res, '[默认错误消息]', 500);
      }
    }
  });
}

module.exports = [ControllerName];
```

### 2. 服务类模板
```javascript
/**
 * [功能描述]服务类
 * 功能：处理[具体功能]相关的业务逻辑
 */

const BaseService = require('../base/BaseService');
const { [CONSTANTS] } = require('../../../common/constants/status');

class [ServiceName] extends BaseService {
  constructor() {
    super();
  }

  /**
   * [方法描述]
   * @param {type} param1 - 参数1描述
   * @param {type} param2 - 参数2描述
   * @param {Object} sequelize - 数据库连接对象
   * @returns {Promise<Object>} 返回结果描述
   */
  async [methodName](param1, param2, sequelize) {
    // 使用事务处理
    return await this.executeTransaction(async (transaction) => {

      // 数据验证
      if (!param1 || !param2) {
        throw new Error('必需参数不能为空');
      }

      // 业务逻辑处理
      const result = await sequelize.models.[ModelName].findOne({
        where: { field: param1 },
        transaction
      });

      if (!result) {
        throw new Error('[资源]不存在');
      }

      // 缓存处理
      const cacheKey = `[prefix]_${result.id}`;
      await this.cache.set('service', cacheKey, result, 3600);

      // 记录操作日志
      this.logger.info('[操作描述]', {
        param1,
        param2,
        resultId: result.id
      });

      return {
        success: COMMON_STATUS.SUCCESS,
        data: result,
        message: '[操作成功消息]'
      };

    }, sequelize);
  }
}

module.exports = [ServiceName];
```

### 3. 路由模板
```javascript
/**
 * [功能模块]路由
 * 路径：/api/[endpoint]/[module]
 */

const express = require('express');
const router = express.Router();

// 引入控制器
const [ControllerName] = require('../../controllers/[path]/[ControllerName]');

// 引入中间件
const { [authMiddleware], [limiterMiddleware] } = require('../../middleware');

// 创建控制器实例
const [controllerInstance] = new [ControllerName]();

// 应用中间件
router.use([limiterMiddleware]);

// 定义路由
router.post('/[endpoint]', [authMiddleware], [controllerInstance].[methodName]);
router.get('/[endpoint]/:id', [authMiddleware], [controllerInstance].[getMethodName]);
router.put('/[endpoint]/:id', [authMiddleware], [controllerInstance].[updateMethodName]);
router.delete('/[endpoint]/:id', [authMiddleware], [controllerInstance].[deleteMethodName]);

module.exports = router;
```

### 4. 模型模板
```javascript
/**
 * [模型名称]数据模型
 * 表名：[table_name]
 */

const { DataTypes } = require('sequelize');
const { [STATUS_CONSTANTS] } = require('../../../common/constants/status');

module.exports = (sequelize) => {
  const [ModelName] = sequelize.define('[ModelName]', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID'
    },
    [fieldName]: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '[字段描述]'
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: [STATUS_CONSTANTS].ACTIVE,
      allowNull: false,
      comment: '[状态描述](0:禁用,1:启用)'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '更新时间'
    }
  }, {
    tableName: '[table_name]',
    timestamps: false,
    comment: '[表描述]'
  });

  // 定义关联关系
  [ModelName].associate = (models) => {
    // [ModelName].belongsTo(models.[RelatedModel], {
    //   foreignKey: '[foreign_key]',
    //   as: '[alias]'
    // });
  };

  return [ModelName];
};
```

## 常用代码片段

### 1. 分页查询
```javascript
// 控制器中获取分页参数
const { page, limit, offset } = this.getPaginationParams(req, 20);
const { sortBy, sortOrder } = this.getSortParams(req, 'created_at', 'DESC');

// 服务层中执行分页查询
const { count, rows } = await sequelize.models.[ModelName].findAndCountAll({
  where: conditions,
  limit,
  offset,
  order: [[sortBy, sortOrder]],
  transaction
});

// 返回分页响应
return this.sendPaginatedResponse(res, rows, {
  page,
  limit,
  total: count
}, '获取数据成功');
```

### 2. 缓存操作
```javascript
// 获取或设置缓存
const cacheKey = `user_profile_${userId}`;
const userProfile = await this.getOrSetCache(
  cacheKey,
  async () => {
    return await sequelize.models.User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'status']
    });
  },
  3600 // 1小时缓存
);

// 清除相关缓存
await this.cache.del('service', `user_profile_${userId}`);
await this.cache.del('service', `user_list_*`); // 通配符删除
```

### 3. 事务处理
```javascript
// 复杂业务事务
const result = await this.executeTransaction(async (transaction) => {
  // 步骤1：创建主记录
  const mainRecord = await sequelize.models.MainModel.create(data, { transaction });

  // 步骤2：创建关联记录
  const relatedRecords = await sequelize.models.RelatedModel.bulkCreate(
    relatedData.map(item => ({ ...item, mainId: mainRecord.id })),
    { transaction }
  );

  // 步骤3：更新统计信息
  await sequelize.models.Statistics.increment('count', {
    where: { type: 'main_records' },
    transaction
  });

  return { mainRecord, relatedRecords };
}, sequelize);
```

### 4. 输入验证
```javascript
// 使用express-validator
const { body, param, query } = require('express-validator');

const validateCreateUser = [
  body('username')
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度必须在3-20个字符之间'),
  body('email')
    .isEmail()
    .withMessage('邮箱格式不正确'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码至少6位字符'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: COMMON_STATUS.FAILED,
        message: '参数验证失败',
        errors: errors.array()
      });
    }
    next();
  }
];
```

### 5. 文件上传处理
```javascript
const multer = require('multer');
const path = require('path');

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB限制
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, COMMON_STATUS.YES);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});
```

## 调试和监控

### 1. 日志级别使用
```javascript
// 调试信息 - 开发环境使用
this.logger.debug('调试信息', { data });

// 一般信息 - 记录正常操作
this.logger.info('用户登录成功', { userId, ip });

// 警告信息 - 需要注意但不影响功能
this.logger.warn('缓存连接失败，使用数据库查询', { key });

// 错误信息 - 需要立即处理的问题
this.logger.error('数据库连接失败', { error: error.message, stack: error.stack });
```

### 2. 性能监控
```javascript
// 记录方法执行时间
const startTime = Date.now();
try {
  const result = await this.someExpensiveOperation();
  const duration = Date.now() - startTime;

  this.logger.info('操作完成', {
    operation: 'someExpensiveOperation',
    duration: `${duration}ms`,
    success: COMMON_STATUS.SUCCESS
  });

  return result;
} catch (error) {
  const duration = Date.now() - startTime;
  this.logger.error('操作失败', {
    operation: 'someExpensiveOperation',
    duration: `${duration}ms`,
    error: error.message
  });
  throw error;
}
```

## 部署和环境配置

### 1. 环境变量验证
```javascript
// common/config/validator.js
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_USER',
  'DB_PASS',
  'DB_NAME',
  'JWT_SECRET'
];

const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missing.join(', ')}`);
  }

  console.log('环境变量验证通过');
};

module.exports = { validateEnvironment };
```

### 2. 健康检查端点
```javascript
// 健康检查路由
router.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    checks: {}
  };

  try {
    // 检查数据库连接
    await sequelize.authenticate();
    health.checks.database = { status: 'OK', message: 'MySQL连接正常' };
  } catch (error) {
    health.checks.database = { status: 'ERROR', message: error.message };
    health.status = 'ERROR';
  }

  try {
    // 检查Redis连接
    await redis.ping();
    health.checks.redis = { status: 'OK', message: 'Redis连接正常' };
  } catch (error) {
    health.checks.redis = { status: 'ERROR', message: error.message };
    health.status = 'ERROR';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

---

## 总结

本编码规则基于项目的实际架构和代码风格制定，重点强调：

1. **架构一致性**: 严格遵循MVC分层架构
2. **数据类型规范**: 统一使用数字常量替代布尔值和枚举
3. **三端分离**: 清晰的API接口分类和权限控制
4. **安全优先**: 完善的认证、授权和输入验证机制
5. **性能优化**: 合理的缓存策略和数据库连接池配置
6. **代码质量**: 详尽的中文注释和统一的错误处理
7. **模板化开发**: 提供完整的代码生成模板和常用片段
8. **监控和调试**: 完善的日志记录和性能监控机制

遵循这些规则将确保代码的一致性、可维护性和可扩展性，同时提高开发效率和代码质量。
