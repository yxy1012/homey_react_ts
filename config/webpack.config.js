const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

//获取cross-env定义的环境变量
const isProduction =  process.env.NODE_ENV === "production";

const getStyleLoaders = (pre) => {
    return [
        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: ["postcss-preset-env"]
                }
            }
        },
        pre
    ].filter(Boolean);
};

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
        filename: isProduction ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js",
        chunkFilename: isProduction ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js",
        assetModuleFilename: "static/media/[hash:10][ext][query]",
        clean: true
    },
    devtool: "source-map",
    module: {
        rules:[
            {
                test: /\.css$/,
                use: getStyleLoaders()
            },
            {
                test: /\.less$/,
                use: getStyleLoaders("less-loader")
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders("sass-loader")
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders("stylus-loader")
            },
            {
                test: /\.(jpe?g|png|gif|webp|svg)/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                }
            },
            {
                test: /\.(woff2?|ttf)$/,
                type: "asset/resource"
            },
            // {
            //     test: /\.jsx?$/,
            //     include: path.resolve(__dirname, "../src"),
            //     loader: "babel-loader",
            //     options: {   
            //         cacheDirectory: true,
            //         cacheCompression: false,
            //         plugins: [
            //             !isProduction && "react-refresh/babel" //激活js的HMR
            //         ].filter(Boolean)
            //     }
            // },
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, "../src"),
                loader: "awesome-typescript-loader"
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    plugins: [
        // new EslintWebpackPlugin({
        //     context: path.resolve(__dirname, "../src"),
        //     exclude: "node_modules",
        //     cache: true,
            // cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache")
        // }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html")
        }),
        isProduction && new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10].chunk.css'
        }),
        isProduction && new CopyPlugin({
            patterns: [
              { 
                from: path.resolve(__dirname, '../public'), 
                to: path.resolve(__dirname, '../dist'),
                globOptions: {
                    ignore: ["**/index.html"]
                }
              }
            ]
        }),
        !isProduction && new ReactRefreshWebpackPlugin()
    ].filter(Boolean),
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "cheap-module-source-map",
    optimization: {
        // splitChunks: {
        //     chunks: "all",
        //     cacheGroups: {
        //         react: {
        //             test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
        //             name: "chunk-react",
        //             priority: 40
        //         },
        //         antd: {
        //             test: /[\\/]node_modules[\\/]antd[\\/]/,
        //             name: "chunk-antd",
        //             priority: 30
        //         },
        //         libs: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: "chunk-libs",
        //             priority: 20
        //         }
        //     }
        // },
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint.name}.js`
        },
        //是否需要进行压缩
        minimize: isProduction,
        minimizer: [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                  implementation: ImageMinimizerPlugin.imageminGenerate,
                  options: {
                    plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["jpegtran", { progressive: true }],
                        ["optipng", { optimizationLevel: 5 }],
                        [
                          "svgo",
                          {
                            plugins: [
                                "preset-default",
                                "prefixIds",
                                {
                                    name: "sortAttrs",
                                    params: {
                                        xmlnsOrder: "alphabetical"
                                    }
                                }
                            ]
                          },
                        ],
                      ],
                  }
                },
            })
        ]
    },
    //webpack解析模块加载选项
    resolve: {
        alias: {
            "@": path.resolve("src")
        },
        //自动补全文件扩展名
        extensions: [".jsx", ".js", ".json", ".ts", ".tsx"],
    },
    devServer: {
        host: "localhost",
        port: 3000,
        open: true,
        hot: true, //开启HMR
        historyApiFallback: true //解决前端路由404问题
    },
    // performance: false //关闭性能分析，提升打包速度
}