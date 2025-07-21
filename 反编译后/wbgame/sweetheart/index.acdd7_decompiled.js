// ============================================================================
// 游戏主入口文件 - Cocos Creator 老虎机游戏启动入口
// 负责：初始化游戏画布、加载Cocos Creator引擎、启动应用程序
// ============================================================================

System.register(["./application.66597.js"], function(_export, _context) {
    "use strict";

    // ========== 变量声明 ==========
    var Application,  // 应用程序类
        canvas,       // 游戏画布元素
        $p,           // 画布父元素
        bcr,          // 父元素的边界矩形信息
        application;  // 应用程序实例

    // ========== 顶层导入函数 ==========
    // 用于动态导入模块的辅助函数
    function topLevelImport(url) {
        return System["import"](url);
    }

    return {
        // ========== 模块依赖设置 ==========
        // 导入Application类从application.66597.js文件
        setters: [function(_application66597Js) {
            Application = _application66597Js.Application;
        }],

        // ========== 主执行函数 ==========
        // 游戏启动的核心逻辑
        execute: function() {
            // ========== 画布初始化 ==========
            canvas = document.getElementById('GameCanvas');  // 获取游戏画布元素
            $p = canvas.parentElement;                       // 获取画布的父容器
            bcr = $p.getBoundingClientRect();               // 获取父容器的尺寸信息

            // 设置画布尺寸与父容器一致
            canvas.width = bcr.width;   // 设置画布宽度
            canvas.height = bcr.height; // 设置画布高度

            // ========== 应用程序启动流程 ==========
            application = new Application();  // 创建应用程序实例

            // 启动链式调用：导入引擎 -> 初始化应用 -> 启动游戏
            topLevelImport('cc').then(function(engine) {
                // 第一步：初始化应用程序，传入Cocos Creator引擎
                return application.init(engine);
            }).then(function() {
                // 第二步：启动应用程序
                return application.start();
            })["catch"](function(err) {
                // 错误处理：如果启动过程中出现错误，输出到控制台
                console.error(err);
            });
        }
    };
});