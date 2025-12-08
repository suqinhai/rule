# Express API 项目 AI 开发提示词

## 项目概述

你正在协助开发一个基于 Express.js 的企业级 API 服务项目。这是一个采用 MVC 架构模式的 Node.js 后端框架，支持多端（用户端、管理端、商户端）API 服务，集成了 MySQL、MongoDB、Redis 等多种数据存储方案。

### 核心技术栈
- **运行环境**: Node.js >= 16.0.0
- **Web框架**: Express.js 4.18.2
- **数据库**: MySQL (Sequelize ORM) + MongoDB (Mongoose ODM)
- **缓存**: Redis (ioredis)
- **认证**: JWT (jsonwebtoken)
- **日志**: Winston
- **国际化**: i18next
- **安全**: Helmet, CORS, bcrypt
- **验证**: express-validator

## 项目结构

```
init-expresss-api/
├── app.js                 # Express应用主入口
├── bin/www               # HTTP服务器启动脚本
├── controllers/          # 控制器层 - 处理HTTP请求/响应
│   ├── base/            # 基础控制器类
│   ├── user/            # 用户端控制器
│   ├── admin/           # 管理端控制器
│   └── merchant/        # 商户端控制器
├── services/            # 服务层 - 业务逻辑
│   ├── base/           # 基础服务类
│   ├── user/           # 用户端服务
│   ├── admin/          # 管理端服务
│   └── common/         # 通用服务
├── routes/             # 路由层 - API端点定义
│   ├── user-api/       # 用户端API路由
│   ├── admin-api/      # 管理端API路由
│   └── merchant-api/   # 商户端API路由
├── models/             # 数据模型层
│   ├── users/          # 用户相关模型
│   └── merchants/      # 商户相关模型
├── middleware/         # 中间件
│   ├── core/          # 核心中间件(认证、缓存、限流等)
│   ├── api/           # API类型中间件栈
│   └── monitoring/    # 监控中间件
├── common/            # 公共模块
│   ├── mysql/         # MySQL连接管理
│   ├── mango/         # MongoDB连接管理
│   ├── redis/         # Redis连接管理
│   ├── logger/        # 日志配置
│   └── i18n/          # 国际化配置
└── env/               # 环境配置文件
```

## 开发规范

### 1. 代码风格
- 使用 ES6+ 语法特性
- 优先使用 async/await 而非回调或 Promise 链
- 使用解构赋值简化代码
- 模块导入顺序：核心模块 > 第三方模块 > 本地模块

### 2. 命名规范
- **文件名**: 小写字母，使用连字符分隔 (kebab-case)
- **类名**: PascalCase (如 `UserController`, `BaseService`)
- **函数/方法名**: camelCase (如 `getUserById`, `sendSuccess`)
- **常量**: UPPER_SNAKE_CASE (如 `USER_ROLE`, `CACHE_TTL`)
- **私有方法**: 以下划线开头 (如 `_validateInput`)

### 3. 错误处理
- 所有异步操作必须有错误处理
- 使用 try-catch 包裹 async/await
- 错误要记录日志并返回友好的错误信息
- 保持错误信息的一致性和可追踪性

### 4. 注释规范
- 每个文件顶部添加功能说明注释
- 复杂函数必须有 JSDoc 注释
- 关键业务逻辑添加行内注释
- TODO 注释格式：`// TODO: 描述 - 作者 - 日期`

## 架构设计原则

### 1. MVC 分层架构
- **Controller**: 只负责请求/响应处理，不包含业务逻辑
- **Service**: 包含所有业务逻辑，可复用
- **Model**: 数据模型定义和数据访问
- **Route**: 路由定义，使用中间件组合

### 2. 中间件设计
- 中间件应该是单一职责的
- 可组合和可配置
- 错误处理中间件放在最后
- 性能敏感的中间件放在前面

### 3. 统一响应格式
```javascript
// 成功响应
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// 错误响应
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

// 分页响应
{
  "success": true,
  "message": "获取数据成功",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 代码示例

### 1. 控制器示例
```javascript
// controllers/user/UserProfileController.js
const BaseController = require('../base/BaseController');
const { userProfileService } = require('../../services');

class UserProfileController extends BaseController {
  constructor() {
    super();
    this.service = userProfileService;
  }

  /**
   * 获取用户资料
   * @route GET /api/user/profile
   */
  getProfile = this.asyncHandler(async (req, res) => {
    const userId = req.user.id; // 从JWT中获取
    
    const profile = await this.service.getProfile(userId);
    
    this.sendSuccess(res, '获取用户资料成功', profile);
  });

  /**
   * 更新用户资料
   * @route PUT /api/user/profile
   */
  updateProfile = this.asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const updateData = req.body;
    
    // 验证必填字段
    const errors = this.validateRequiredFields(req, ['nickname']);
    if (errors) {
      return this.sendError(res, '参数验证失败', 400, errors);
    }
    
    const updatedProfile = await this.service.updateProfile(userId, updateData);
    
    this.logAction('更新用户资料', req, { userId });
    this.sendSuccess(res, '更新用户资料成功', updatedProfile);
  });
}

module.exports = UserProfileController;
```

### 2. 服务示例
```javascript
// services/user/UserProfileService.js
const BaseService = require('../base/BaseService');
const { User } = require('../../models');

class UserProfileService extends BaseService {
  /**
   * 获取用户资料
   * @param {number} userId - 用户ID
   * @returns {Promise<Object>} 用户资料
   */
  async getProfile(userId) {
    // 使用缓存
    return await this.getOrSetCache(
      `user:profile:${userId}`,
      async () => {
        const user = await User.findByPk(userId, {
          attributes: { exclude: ['password'] }
        });
        
        if (!user) {
          throw new Error('用户不存在');
        }
        
        return user.toJSON();
      },
      3600 // 1小时缓存
    );
  }

  /**
   * 更新用户资料
   * @param {number} userId - 用户ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新后的用户资料
   */
  async updateProfile(userId, updateData) {
    // 数据验证
    const validation = this.validateData(updateData, {
      nickname: { required: true, minLength: 2, maxLength: 20 },
      email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      phone: { pattern: /^1[3-9]\d{9}$/ }
    });
    
    if (!validation.isValid) {
      throw new Error('数据验证失败');
    }
    
    // 使用事务更新
    const updatedUser = await this.executeTransaction(async (transaction) => {
      const user = await User.findByPk(userId, { transaction });
      
      if (!user) {
        throw new Error('用户不存在');
      }
      
      await user.update(updateData, { transaction });
      
      return user;
    }, User.sequelize);
    
    // 清除缓存
    await this.clearCache([
      `user:profile:${userId}`,
      'users:list'
    ]);
    
    this.logAction('更新用户资料', { userId, fields: Object.keys(updateData) });
    
    return updatedUser.toJSON();
  }
}

module.exports = UserProfileService;
```

### 3. 路由示例
```javascript
// routes/user-api/profile/index.js
const express = require('express');
const router = express.Router();
const { userProfileController } = require('../../../controllers');
const { stacks } = require('../../../middleware');

// 获取用户资料 - 需要认证
router.get('/',
  stacks.user.authenticated,
  userProfileController.getProfile
);

// 更新用户资料 - 需要认证 + 数据验证
router.put('/',
  stacks.user.authenticated,
  userProfileController.updateProfile
);

// 上传头像 - 需要认证 + 文件验证
router.post('/avatar',
  stacks.user.authenticated,
  // 文件上传中间件
  userProfileController.uploadAvatar
);

module.exports = router;
```

### 4. 中间件使用示例
```javascript
// 使用预定义的中间件栈
router.get('/public-data',
  middleware.stacks.common.public,  // 公开访问栈
  controller.getPublicData
);

// 组合多个中间件
router.post('/sensitive-operation',
  middleware.quick.requireAuth,      // 认证
  middleware.quick.strictRateLimit,  // 严格限流
  middleware.quick.validate([        // 数据验证
    body('amount').isNumeric().isFloat({ min: 0.01 }),
    body('description').notEmpty().trim()
  ]),
  middleware.quick.adminOperationAudit, // 审计日志
  controller.performSensitiveOperation
);

// 自定义中间件栈
const customStack = middleware.factories.createUserStack({
  auth: 'required',
  caching: 'medium',
  rateLimit: 'strict',
  validation: true
});

router.get('/custom-endpoint', customStack, controller.customHandler);
```

## 数据库操作规范

### 1. Sequelize (MySQL) 操作
```javascript
// 查询示例
const users = await User.findAll({
  where: {
    status: USER_STATUS.ACTIVE,
    role: USER_ROLE.USER
  },
  attributes: ['id', 'username', 'email'],
  include: [{
    model: Profile,
    as: 'profile',
    attributes: ['nickname', 'avatar']
  }],
  order: [['created_at', 'DESC']],
  limit: 20,
  offset: 0
});

// 事务示例
const result = await sequelize.transaction(async (t) => {
  const user = await User.create(userData, { transaction: t });
  const profile = await Profile.create({
    userId: user.id,
    ...profileData
  }, { transaction: t });
  
  return { user, profile };
});

// 批量操作
await User.bulkCreate(users, {
  updateOnDuplicate: ['email', 'updated_at']
});
```

### 2. Mongoose (MongoDB) 操作
```javascript
// 模型定义
const LogSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
  ip: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now, index: true }
});

// 查询示例
const logs = await Log.find({
  userId: userId,
  timestamp: {
    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24小时内
  }
})
.sort({ timestamp: -1 })
.limit(100)
.lean(); // 返回普通对象而非Mongoose文档

// 聚合示例
const stats = await Log.aggregate([
  { $match: { userId: userId } },
  { $group: {
    _id: '$action',
    count: { $sum: 1 },
    lastTime: { $max: '$timestamp' }
  }},
  { $sort: { count: -1 } }
]);
```

### 3. Redis 操作
```javascript
// 缓存操作
await redis.setex(`user:${userId}`, 3600, JSON.stringify(userData));
const cachedUser = JSON.parse(await redis.get(`user:${userId}`));

// 计数器
await redis.incr(`api:calls:${userId}:${date}`);
await redis.expire(`api:calls:${userId}:${date}`, 86400);

// 列表操作
await redis.lpush(`user:${userId}:notifications`, JSON.stringify(notification));
const notifications = await redis.lrange(`user:${userId}:notifications`, 0, 9);

// 分布式锁
const lock = await redis.set(
  `lock:operation:${operationId}`,
  '1',
  'EX', 30,
  'NX'
);
```

## 常见功能实现

### 1. 分页查询
```javascript
async getUsers(req, res) {
  const { page, limit, offset } = this.getPaginationParams(req);
  const { sortBy, sortOrder } = this.getSortParams(req);
  
  const { count, rows } = await User.findAndCountAll({
    where: this.buildWhereCondition(req.query, ['status', 'role']),
    order: [[sortBy, sortOrder]],
    limit,
    offset
  });
  
  this.sendPaginatedResponse(res, rows, {
    page,
    limit,
    total: count
  });
}
```

### 2. 文件上传
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

router.post('/avatar', 
  middleware.quick.requireAuth,
  upload.single('avatar'),
  controller.uploadAvatar
);
```

### 3. 邮件发送
```javascript
// services/common/EmailService.js
const nodemailer = require('nodemailer');

class EmailService extends BaseService {
  constructor() {
    super();
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendVerificationEmail(email, token) {
    const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: '"Express API" <noreply@example.com>',
      to: email,
      subject: '邮箱验证',
      html: `
        <h1>欢迎注册</h1>
        <p>请点击下面的链接验证您的邮箱：</p>
        <a href="${verifyUrl}">验证邮箱</a>
        <p>链接有效期为24小时</p>
      `
    };
    
    await this.transporter.sendMail(mailOptions);
    this.logAction('发送验证邮件', { email });
  }
}
```

### 4. 定时任务
```javascript
// common/schedule/index.js
const cron = require('node-cron');
const { logger } = require('../logger');

class ScheduleManager {
  constructor() {
    this.tasks = new Map();
  }

  addTask(name, schedule, handler) {
    const task = cron.schedule(schedule, async () => {
      try {
        logger.info(`执行定时任务: ${name}`);
        await handler();
      } catch (error) {
        logger.error(`定时任务执行失败: ${name}`, error);
      }
    }, {
      scheduled: false
    });
    
    this.tasks.set(name, task);
  }

  start() {
    // 清理过期缓存 - 每小时执行
    this.addTask('清理过期缓存', '0 * * * *', async () => {
      await cacheManager.cleanup();
    });
    
    // 生成日报 - 每天凌晨2点
    this.addTask('生成日报', '0 2 * * *', async () => {
      await reportService.generateDailyReport();
    });
    
    // 启动所有任务
    this.tasks.forEach(task => task.start());
    logger.info('定时任务启动成功');
  }
}
```

## 性能优化建议

### 1. 数据库优化
- 使用数据库连接池，合理配置连接数
- 为常用查询字段添加索引
- 使用 `select` 只查询需要的字段
- 避免 N+1 查询问题，使用 `include` 预加载关联数据
- 大量数据操作使用批量方法
- 合理使用事务，避免长事务

### 2. 缓存策略
- 对频繁访问的数据使用 Redis 缓存
- 设置合理的缓存过期时间
- 使用缓存预热避免缓存雪崩
- 更新数据时及时清除相关缓存
- 考虑使用多级缓存（内存+Redis）

### 3. API 优化
- 使用 Gzip 压缩响应数据
- 实现 API 限流防止滥用
- 对静态资源设置合理的缓存头
- 使用 CDN 加速静态资源
- 实现分页避免一次返回大量数据

### 4. 代码优化
- 使用 `Promise.all()` 并行处理无依赖的异步操作
- 避免在循环中进行数据库查询
- 使用流处理大文件上传下载
- 延迟加载不常用的模块
- 使用对象池复用昂贵的对象

## 安全注意事项

### 1. 输入验证
- 对所有用户输入进行验证和清理
- 使用参数化查询防止 SQL 注入
- 对上传文件进行类型和大小限制
- 验证 JSON 数据的结构和内容
- 限制请求体大小

### 2. 认证授权
- 使用强密码策略
- JWT 密钥定期轮换
- 实现登录失败锁定机制
- 敏感操作需要二次验证
- 实现基于角色的访问控制

### 3. 数据保护
- 敏感数据加密存储
- 日志中不记录敏感信息
- 使用 HTTPS 传输数据
- 实现数据脱敏机制
- 定期备份重要数据

### 4. 其他安全措施
- 使用 Helmet 设置安全头
- 配置 CORS 限制跨域访问
- 实现 CSRF 防护
- 定期更新依赖包
- 使用安全的随机数生成器

## 测试建议

### 1. 单元测试
```javascript
// test/services/UserService.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const UserService = require('../../services/user/UserService');

describe('UserService', () => {
  let userService;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    userService = new UserService();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getUserById', () => {
    it('应该返回用户信息', async () => {
      const mockUser = { id: 1, username: 'test' };
      sandbox.stub(User, 'findByPk').resolves(mockUser);

      const result = await userService.getUserById(1);

      expect(result).to.deep.equal(mockUser);
      expect(User.findByPk.calledWith(1)).to.be.true;
    });

    it('用户不存在时应该抛出错误', async () => {
      sandbox.stub(User, 'findByPk').resolves(null);

      try {
        await userService.getUserById(999);
        expect.fail('应该抛出错误');
      } catch (error) {
        expect(error.message).to.equal('用户不存在');
      }
    });
  });
});
```

### 2. 集成测试
```javascript
// test/api/user.test.js
const request = require('supertest');
const app = require('../../app');
const { generateToken } = require('../../common/utils/auth');

describe('User API', () => {
  let authToken;

  before(async () => {
    // 创建测试用户并生成token
    authToken = generateToken({ id: 1, username: 'testuser' });
  });

  describe('GET /api/user/profile', () => {
    it('认证用户应该能获取资料', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('username');
    });

    it('未认证用户应该返回401', async () => {
      await request(app)
        .get('/api/user/profile')
        .expect(401);
    });
  });
});
```

## 调试技巧

### 1. 日志调试
```javascript
// 使用不同级别的日志
logger.error('严重错误', { error: err.message, stack: err.stack });
logger.warn('警告信息', { userId, action });
logger.info('一般信息', { request: req.url });
logger.debug('调试信息', { data: complexObject });

// 在开发环境启用详细日志
if (process.env.NODE_ENV === 'development') {
  logger.level = 'debug';
}
```

### 2. 断点调试
```bash
# 使用 Node.js 调试器
node --inspect-brk bin/www

# 使用 VS Code 调试配置
{
  "type": "node",
  "request": "launch",
  "name": "Debug Express API",
  "program": "${workspaceFolder}/bin/www",
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "express:*"
  }
}
```

### 3. 性能分析
```javascript
// 使用 console.time 测量执行时间
console.time('数据库查询');
const users = await User.findAll();
console.timeEnd('数据库查询');

// 使用中间件记录响应时间
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('请求处理时间', {
      method: req.method,
      url: req.url,
      duration: `${duration}ms`
    });
  });
  next();
});
```

## 部署检查清单

- [ ] 环境变量配置正确（生产环境）
- [ ] 数据库连接配置正确
- [ ] Redis 连接配置正确
- [ ] JWT 密钥已设置且足够复杂
- [ ] 日志级别设置为 'info' 或 'warn'
- [ ] 已启用 HTTPS
- [ ] 已配置反向代理（Nginx）
- [ ] 已设置进程管理器（PM2）
- [ ] 已配置监控和告警
- [ ] 已设置自动备份
- [ ] 已进行安全审计
- [ ] 已进行性能测试
- [ ] 已更新 API 文档
- [ ] 已设置 CI/CD 流程

## 提示词使用说明

当你使用这个提示词进行开发时，请：

1. **遵循既定的项目结构和命名规范**
2. **保持代码风格的一致性**
3. **充分利用基类提供的功能**
4. **合理使用中间件系统**
5. **注意性能和安全问题**
6. **编写清晰的注释和文档**
7. **进行充分的错误处理**
8. **考虑代码的可测试性**

记住，这是一个生产级的项目，代码质量和可维护性至关重要。始终以最佳实践为指导，编写清晰、高效、安全的代码。
