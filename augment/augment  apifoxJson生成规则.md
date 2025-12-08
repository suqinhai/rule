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
