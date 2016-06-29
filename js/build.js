({
    // app顶级目录，非必选项。如果指定值，baseUrl则会以此为相对路径
    appDir: './',

    // 模块根目录。默认情况下所有模块资源都相对此目录。
    // 若该值未指定，模块则相对build文件所在目录。
    // 若appDir值已指定，模块根目录baseUrl则相对appDir。
    baseUrl: './',

    // 配置文件目录
    // mainConfigFile: '../some/path/to/main.js',

    // 指定输出目录，若值未指定，则相对 build 文件所在目录
    dir: '../dist/js/',
    // 配置 CommonJS 的 package See http://requirejs.org/docs/api.html#packages for more information.
    // packagePaths: [],
    // packages: [],

    // 在 RequireJS 2.0.2 中，输出目录的所有资源会在 build 前被删除
    // 值为 true 时 rebuild 更快，但某些特殊情景下可能会出现无法预料的异常
    // keepBuildDir: true,

    // JS 文件优化方式，目前支持以下几种：
    //   uglify: （默认） 使用 UglifyJS 来压缩代码
    //   closure: 使用 Google's Closure Compiler 的简单优化模式
    //   closure.keepLines: 使用 closure，但保持换行
    //   none: 不压缩代码
    optimize: "uglify",

    // 使用 UglifyJS 时的可配置参数
    // See https://github.com/mishoo/UglifyJS for the possible values.
    // uglify: {
    //     toplevel: true,
    //     ascii_only: true,
    //     beautify: true,
    //     max_line_length: 1000
    // },

    // 使用 Closure Compiler 时的可配置参数
    // closure: {
    //     CompilerOptions: {},
    //     CompilationLevel: 'SIMPLE_OPTIMIZATIONS',
    //     loggingLevel: 'WARNING'
    // },

    // CSS 优化方式，目前支持以下几种：
    // none: 不压缩，仅合并
    // standard: 标准压缩，移除注释、换行，以及可能导致 IE 解析出错的代码
    // standard.keepLines: 除标准压缩外，保留换行
    // standard.keepComments: 除标准压缩外，保留注释 (r.js 1.0.8+)
    // standard.keepComments.keepLines: 除标准压缩外，保留注释和换行 (r.js 1.0.8+)
    // optimizeCss: 'standard',

    // 是否忽略 CSS 资源文件中的 @import 指令
    // cssImportIgnore: null,

    // 一般用于命令行，可将多个 CSS 资源文件打包成单个 CSS 文件
    // cssIn: "path/to/main.css",
    // out: "path/to/css-optimized.css",

    // 处理所有的文本资源依赖项，从而避免为加载资源而产生的大量单独xhr请求
    // inlineText: true,

    // 是否开启严格模式
    // 由于很多浏览器不支持 ES5 的严格模式，故此配置默认值为 false
    useStrict: false,

    // 国际化配置
    // locale: "en-us",

    pragmas: {
        fooExclude: true
    },
    // pragmasOnSave: {
    //     excludeCoffeeScript: true
    // },
    // 跳过 pragmas 处理
    skipPragmas: false,

    // has: {
    //     'function-bind': true,
    //     'string-trim': false
    // },
    // hasOnSave: {
    //     'function-bind': true,
    //     'string-trim': false
    // },

    // 命名空间，完整实例可以参考 http://requirejs.org/docs/faq-advanced.html#rename
    // namespace: 'foo',

    //If skipModuleInsertion is false, then files that do not use define()
    // skipModuleInsertion: false,
    // stubModules: ['text', 'bar'],

    optimizeAllPluginResources: false,

    // 处理级联依赖，默认为 false，此时能够在运行时动态 require 级联的模块。为 true 时，级联模块会被一同打包
    findNestedDependencies: false,

    //If set to true, any files that were combined into a build layer will be
    //removed from the output folder.
    removeCombined: false,

    // 仅优化单个模块及其依赖项
    // name: "foo/bar/bop",
    // include: ["foo/bar/bee"],
    // insertRequire: ['foo/bar/bop'],
    // out: "path/to/optimized-file.js",

    // An alternative to "include"
    // deps: ["foo/bar/bee"],

    // RequireJS 2.0 中，out 可以是一个函数
    // out: function(text) {
    //     // 自定义优化内容
    // },

    // 模块包裹函数，顾名思义使用特定内容包裹模块，如此一来 define/require 就不再是全局变量，在 end 中可以暴露一些全局变量供整个函数使用
    // wrap: {
    //     start: "(function() {",
    //     end: "}());"
    // },

    // 另一种模块包裹方式
    // (function() { + content + }());
    // wrap: true,

    // 另一种模块包裹方式，包裹内容可以是指定文件
    // wrap: {
    //     startFile: "part/start.frag",
    //     endFile: "parts/end.frag"
    // },

    // 不优化某些文件
    // fileExclusionRegExp: /^\./,
    fileExclusionRegExp: /^(r|build)\.js$/,

    // 默认保留模块的 license 注释
    preserveLicenseComments: false,

    // 设置 logging level
    // TRACE: 0,
    // INFO: 1,
    // WARN: 2,
    // ERROR: 3,
    // SILENT: 4
    // Default is 0.
    logLevel: 0,

    // 在每个文件模块被读取时的操作函数，可在函数体内作适当变换
    // onBuildRead: function (moduleName, path, contents) {
    //     return contents.replace(/foo/g, 'bar');
    // },

    // 在每个文件模块被写入时的操作函数
    // onBuildWrite: function (moduleName, path, contents) {
    //     return contents.replace(/bar/g, 'foo');
    // },

    // 若为true，优化器会强制在文件中包裹一层 define(require, exports, module) {})
    // cjsTranslate: true,

    // useSourceUrl: true,

    // 设置模块别名
    // RequireJS 2.0 中可以配置数组，顺序映射，当前面模块资源未成功加载时可顺序加载后续资源
    paths: {
        underscore: 'lib/vendor/libs/backbone/underscore',
        backbone: 'lib/vendor/libs/backbone/backbone',
        text: 'lib/vendor/libs/require/text',
        localstorage: 'lib/vendor/system/data/backbone.localstorage',
        indexeddb: 'lib/vendor/system/data/backbone.indexeddb',
        framework7: 'lib/vendor/libs/framework7/framework7',
        jquery: 'lib/vendor/libs/jquery/jquery-2.2.1.min',
        util: 'core/util/Util',
        mOxie: 'lib/vendor/components/plupload/moxie',
        plupload: 'lib/vendor/components/plupload/plupload.dev',
        qiniu: 'lib/vendor/libs/qiniu/qiniuSDK',
        eventEmitter: 'lib/vendor/media/image/imagesloaded/eventEmitter/EventEmitter',
        eventie: 'lib/vendor/media/image/imagesloaded/eventie/eventie',
        imagesloaded: 'lib/vendor/media/image/imagesloaded/imagesloaded',
        exif: "lib/vendor/media/image/exif",
        localResizeIMG: "lib/vendor/media/image/localResizeIMG",
        chartjs: "lib/vendor/components/chart/Chart_old",
        iscroll: 'lib/vendor/components/iscroll/iscroll',
        fastclick: 'lib/vendor/events/fastclick/fastclick',
    },
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        localstorage: {
            deps: ['backbone'],
            exports: 'localStorage'
        },
        indexeddb: {
            deps: ['backbone']
        },
        plupload: {
            deps: ['mOxie'],
            exports: 'plupload'
        },
        imagesloaded: {
            deps: ['eventEmitter', 'eventie'],
            exports: 'imagesloaded'
        },
        fastclick: {
            deps: ['jquery']
        }
    },
    modules: [{
            name: 'main' //入口
        }, {
            name: 'index', //框架
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text'
            ]
        },
        //意见反馈
        {
            name: 'src/feedback/app',
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text',
                'core/FUI',
                'util',
            ]
        },
        //合同金额
        {
            name: 'src/statistics/app',
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text',
                'core/FUI',
                'util',
            ]
        },
        //活动记录
        {
            name: 'src/activity/app',
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text',
                'core/FUI',
                'util',
            ]
        },
        //销售金额
        {
            name: 'src/sales_opportunities/app',
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text',
                'core/FUI',
                'util',
            ]
        },
        //回款金额
        {
            name: 'src/back_section/app',
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text',
                'core/FUI',
                'util',
            ]
        },
        //开票金额
        {
            name: 'src/billing/app',
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text',
                'core/FUI',
                'util',
            ]
        },
        //===========================widget插件
        //统计图表插件
        {
            name: 'widget/chart/app',
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text',
                'core/FUI',
                'util',
            ]
        },
        //条件筛选器插件
        {
            name: 'widget/filter/app',
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text',
                'core/FUI',
                'util',
            ]
        },
        //七牛上传插件
        {
            name: 'widget/uploadfile/Qiniu_mobile',
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text',
                'core/FUI',
                'util',
            ]
        },
        //图表引导插件
        {
            name: 'widget/guide/app',
            exclude: [
                'jquery',
                'underscore',
                'backbone',
                'framework7',
                'text',
                'core/FUI',
                'util',
            ]
        }
    ]
})
