// ============================================================================
// 游戏应用程序核心文件 - Cocos Creator 老虎机游戏启动器
// 负责：引擎初始化、浏览器兼容性处理、游戏设置加载、URL参数解析
// ============================================================================

System.register([], function(_export, _context) {
    "use strict";

    // Cocos Creator 引擎和应用程序类的引用
    var cc, Application;

    // ========== ES6 类支持的辅助函数 ==========
    // 这些函数提供ES6类语法的向后兼容性支持

    // 检查实例是否正确创建的函数
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    // 为对象定义属性的函数
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;  // 默认不可枚举
            descriptor.configurable = true;                          // 可配置
            if ("value" in descriptor) descriptor.writable = true;   // 如果有值则可写
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    // 创建类的函数，支持原型方法和静态方法
    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);  // 添加原型方法
        if (staticProps) _defineProperties(Constructor, staticProps);          // 添加静态方法
        return Constructor;
    }

    return {
        setters: [],
        execute: function() {
            // ========== 应用程序主类定义 ==========
            // 导出Application类，这是游戏的主要应用程序控制器
            _export("Application", Application = /*#__PURE__*/ function() {
                // 构造函数：创建Application实例
                function Application() {
                    _classCallCheck(this, Application);
                }

                // 定义Application类的方法
                _createClass(Application, [{
                    // ========== 初始化方法 ==========
                    // 初始化Cocos Creator引擎和设置项目回调
                    key: "init",
                    value: function init(engine) {
                        cc = engine;  // 保存引擎引用
                        // 添加项目初始化完成后的回调函数
                        cc.game.onPostProjectInitDelegate.add(this.onPostProjectInit.bind(this));
                    }
                }, {
                    // ========== 项目初始化完成回调 ==========
                    // 在项目初始化完成后执行的设置
                    key: "onPostProjectInit",
                    value: function onPostProjectInit() {
                        // 启用浏览器窗口大小变化时自动调整游戏视图
                        cc.view.resizeWithBrowserSize(true);
                    }
                }, {
                    // ========== URL参数解析方法 ==========
                    // 从当前页面URL中获取指定名称的参数值
                    key: "GetLinkParameterByName",
                    value: function GetLinkParameterByName(name) {
                        var url = window.location.href;                    // 获取当前页面URL
                        name = name.replace(/[\[\]]/g, '\\$&');            // 转义特殊字符
                        // 创建正则表达式来匹配URL参数
                        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                            results = regex.exec(url);                     // 执行匹配
                        if (!results) return null;                        // 未找到参数
                        if (!results[2]) return '';                       // 参数存在但无值
                        return decodeURIComponent(results[2].replace(/\+/g, ' ')); // 解码并返回参数值
                    }
                }, {
                    // ========== 游戏启动方法 ==========
                    // 启动游戏引擎，处理浏览器兼容性问题，加载游戏设置
                    key: "start",
                    value: function start() {
                        // ========== Chrome版本检测函数 ==========
                        // 检测当前Chrome浏览器的版本号
                        function getChromeVersion() {
                            var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
                            return raw ? parseInt(raw[2], 10) : -1;  // 返回版本号或-1（非Chrome）
                        }

                        // ========== Chrome 120+ WebGL2兼容性处理 ==========
                        // 针对Android移动设备上Chrome 120+版本的WebGL2渲染问题进行修复
                        if (cc.sys.isBrowser && cc.sys.isMobile && cc.sys.os === cc.sys.OS.ANDROID) {
                            if (getChromeVersion() >= 120) {
                                console.log('Disable WebGL2 rendering of chrome v.120.');
                                window.WebGL2RenderingContext = null;  // 禁用WebGL2，回退到WebGL1
                            }
                        }

                        // ========== 游戏初始化 ==========
                        window.SetProgressInterval(30);  // 设置加载进度为30%

                        // 初始化Cocos Creator游戏引擎
                        return cc.game.init({
                            settingsPath: 'src/settings.c362e.json',  // 游戏设置文件路径
                            overrideSettings: {
                                splashScreen: {
                                    enabled: false  // 禁用启动画面
                                }
                            }
                        }).then(function() {
                            // ========== 引擎初始化完成后的设置 ==========

                            // 浏览器环境下的WebGL设备优化
                            if (cc.sys.isBrowser) {
                                if (cc.gfx.deviceManager.gfxDevice instanceof cc.WebGLDevice) {
                                    var device = cc.gfx.deviceManager.gfxDevice;
                                    device.extensions.useVAO = false;  // 禁用VAO扩展以提高兼容性
                                }
                            }

                            window.SetProgressInterval(50);  // 更新加载进度为50%
                            cc.game.run();  // 启动游戏主循环
                        });
                    }
                }]);

                return Application;
            }());
        }
    };
});