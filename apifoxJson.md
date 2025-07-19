{
  "openapi": "3.0.1",
  "info": {
    "title": "total",
    "description": "",
    "version": "1.0.0"
  },
  "tags": [],
  "paths": {
    "/api/admin/console/auth": {
      "get": {
        "summary": "登录",
        "deprecated": false,
        "description": "",
        "tags": [],
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "description": "",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "username": {
                    "type": "string",
                    "title": "账号"
                  },
                  "password": {
                    "type": "string",
                    "title": "密码"
                  }
                },
                "required": [
                  "username",
                  "password"
                ]
              },
              "examples": {}
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {}
                }
              }
            },
            "headers": {}
          }
        },
        "security": []
      }
    }
  },
  "components": {
    "schemas": {},
    "securitySchemes": {}
  },
  "servers": [
    {
      "url": "http://test-cn.your-api-server.com",
      "description": "测试环境"
    }
  ],
  "security": []
}