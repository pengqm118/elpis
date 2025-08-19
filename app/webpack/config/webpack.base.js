const path = require('path');
const { sep } = path;
const glob = require('glob');
const fs = require('fs');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

// 动态配置 elpis 入口及对应生成的tpl文件
const elpisPageEntries = {};
const elpisHtmlWebpackPluginList = [];
const elpisEntryPath = path.resolve(__dirname, `..${sep}..${sep}/pages/**/entry.*.js`);
generateEntryFileConfig(elpisEntryPath, elpisPageEntries, elpisHtmlWebpackPluginList);

// 动态配置 业务 入口及对应生成的tpl文件
const businessPageEntries = {};
const businessHtmlWebpackPluginList = [];
const businessEntryPath = path.resolve(process.cwd(), './app/pages/**/entry.*.js');
generateEntryFileConfig(businessEntryPath, businessPageEntries, businessHtmlWebpackPluginList);

function generateEntryFileConfig (entryPath, pageEntries, htmlWebpackPluginList) {
    glob.sync(entryPath).forEach((filePath) => {
        const entryName = path.basename(filePath, '.js');
        pageEntries[entryName] = filePath;
        htmlWebpackPluginList.push(new HtmlWebpackPlugin({
            // 产物(最终模块)输出路径
            filename: path.resolve(process.cwd(), './app/public/dist', `${entryName}.tpl`),
            // 制定使用模版
            template: path.resolve(__dirname, `..${sep}..${sep}/view/entry.tpl`),
            // 要注入的代码块
            chunks: [entryName]
        }));
    });
}

// 加载 业务 webpack配置
let businessWebpackConfig = {};
try {
    businessWebpackConfig = require(path.resolve(process.cwd(), './app/webpack.config.js'));
} catch (e) {
    console.log(`-- [exception] load business webpackConfig error: ${JSON.stringify(e)}`);
}

module.exports = merge.smart({
    // 配置文件入口
    entry: Object.assign({}, elpisPageEntries, businessPageEntries),
    // 模块解析配置(决定了要[加载]解析哪些模块，以及用什么方式去解析)
    module: {
        rules: [{
            test: /\.vue$/,
            use: {
                loader: require.resolve('vue-loader')
            }
        }, {
            test: /\.js$/,
            include: [
                // 处理 elpis pages目录
                path.resolve(__dirname, `..${sep}..${sep}/pages`),
                // 处理 business pages目录
                path.resolve(process.cwd(), './app/pages')
            ],
            use: {
                loader: require.resolve('babel-loader')
            }
        }, {
            test: /\.(png|jpe?g|gif)(\?.+)?$/,
            use: {
                loader: require.resolve('url-loader'),
                options: {
                    limit: 300,
                    esModule: false
                }
            }
        }, {
            test: /\.css$/,
            // use 不能使用上面那种 Object 形式
            use: [
                require.resolve('style-loader'),
                require.resolve('css-loader')
            ]
        }, {
            test: /\.less$/,
            use: [
                require.resolve('style-loader'),
                require.resolve('css-loader'),
                require.resolve('less-loader')
            ]
        }, {
            test: /\.(eot|svg|ttf|woff|woff2(\?\S*))?$/,
            use: {
                loader: require.resolve('file-loader')
            }
        }]
    },
    // 产物输出路径
    output: {},
    // 配置模块解析的具体行为(定义 webpack 在打包时，如何找到并解析具体模块的路径)
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css'],
        alias: (() => {
            // 空白文件地址，绕过 webpack 静态编辑读取文件报错
            const blankModulePath = path.resolve(__dirname, '../libs/blank.js');
            const aliasMap = {};

            // 读取业务 dashboard 路由配置
            const businessDashboardRouteConfigPath = path.resolve(process.cwd(), './app/pages/dashboard/route.js');
            aliasMap['$businessDashboardRouterConfig'] = fs.existsSync(businessDashboardRouteConfigPath) ? businessDashboardRouteConfigPath : blankModulePath;

            // 读取业务 schema-view 组件配置
            const businessSchemaViewComponentConfigPath = path.resolve(process.cwd(), './app/pages/dashboard/complex-view/schema-view/components/form-item-config.js');
            aliasMap['$businessSchemaViewComponentConfig'] = fs.existsSync(businessSchemaViewComponentConfigPath) ? businessSchemaViewComponentConfigPath : blankModulePath;

            // 读取 业务 schema-form 组件配置
            const businessSchemaFormComponentConfigPath = path.resolve(process.cwd(), './app/pages/widgets/schema-form/form-item-config.js');
            aliasMap['$businessSchemaFormComponentConfig'] = fs.existsSync(businessSchemaFormComponentConfigPath) ? businessSchemaFormComponentConfigPath : blankModulePath;

            // 读取 业务 schema-search-bar 组件配置
            const businessSchemaSearchBarComponentConfigPath = path.resolve(process.cwd(), './app/pages/widgets/schema-search-bar/form-item-config.js');
            aliasMap['$businessSchemaSearchBarComponentConfig'] = fs.existsSync(businessSchemaSearchBarComponentConfigPath) ? businessSchemaSearchBarComponentConfigPath : blankModulePath;

            return { // 别名
                vue: require.resolve('vue'),
                '@babel/runtime/helpers/asyncToGenerator': require.resolve('@babel/runtime/helpers/asyncToGenerator'),
                '@babel/runtime/regenerator': require.resolve('@babel/runtime/regenerator'),
                $elpisPages: path.resolve(__dirname, `..${sep}..${sep}pages`),
                $elpisCommon: path.resolve(__dirname, `..${sep}..${sep}pages/common`),
                $elpisWidgets: path.resolve(__dirname, `..${sep}..${sep}pages/widgets`),
                $elpisStore: path.resolve(__dirname, `..${sep}..${sep}pages/store`),
                $elpisBoot: path.resolve(__dirname, `..${sep}..${sep}pages/boot`),
                ...aliasMap
            };
        })()
    },
    // 配置 webpack 插件
    plugins: [
        // 具体作用后面探析
        new VueLoaderPlugin(),
        // 第三方库暴露在 window context 下
        new webpack.ProvidePlugin({
            Vue: 'vue',
            axios: 'axios',
            _: 'lodash'
        }),
        // 定义全局常量
        new webpack.DefinePlugin({
            __VUE__OPTIONS__API: 'true', // 支持 vue 解析 optionsApi
            __VUE__PROD__DEVTOOLS: 'false', // 禁用 Vue 调试工具
            __VUE__PROD__HYDRATION__MISMATCH__DETAILS__: 'false' // 禁止生产环境显示 “水合” 信息
        }),
        // 构造最终渲染的页面模版
        ...elpisHtmlWebpackPluginList,
        ...businessHtmlWebpackPluginList
    ],
    // 打包输出优化(代码分割、模块合并、压缩、缓存、tree-shaking等)
    optimization: {
        /**
         * 将 js 文件分为3中
         * vendor：几乎无变动的第三方库
         * common：组件库内变动很少的公共部分
         * page相关：业务代码文件
         */
        splitChunks: {
            chunks: 'all', // 对所有同步和异步模块进行分割
            maxAsyncRequests: 10, // 每次异步加载的最大并行请求数
            maxInitialRequests: 10, // 每个入口处的最大并行请求数
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    priority: 20,
                    enforce: true, // 强制执行
                    reuseExistingChunk: true
                },
                common: {
                    test: '[\\/]common|widgets[\\/]',
                    name: 'common',
                    minChunks: 2, // 被引用次数超过2即被视为公共模块
                    minSize: 1, // 最小分割文件大小(1 byte)
                    priority: 10,
                    reuseExistingChunk: true
                }
            }
        },
        // 将 webpack 运行时生成的代码打包到 runtime.js
        runtimeChunk: true
    }
}, businessWebpackConfig);