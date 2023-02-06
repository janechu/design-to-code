/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

const appDir = path.resolve(__dirname, "./");
const outDir = path.resolve(__dirname, "../www");
const srcDir = path.resolve(__dirname, "../src");

module.exports = {
    name: "root",
    entry: {
        main: path.resolve(appDir, "index.ts"),
    },
    resolve: {
        extensions: [".ts", ".js"],
        plugins: [
            new ResolveTypeScriptPlugin()
        ]
    },
    output: {
        path: outDir,
        publicPath: "/", // public URL of the output directory when referenced in a browser
    },
    module: {
        // where we defined file patterns and their loaders
        rules: [
            {
                test: /.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: "tsconfig.json"
                        }
                    },
                ],
            },
            {
                test: /\.(svg|png|jpe?g|gif|ttf)$/i,
                use: {
                    loader: "file-loader",
                    options: {
                        esModule: false,
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                    },
                ],
            },
            {
                test: /message\-system\.min\.js/,
                use: {
                    loader: "worker-loader",
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: "Design to Code test application",
            inject: "body",
            template: path.resolve(appDir, "index.html"),
        }),
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            languages: ["html"],
            features: ["format", "coreCommands", "codeAction"],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./server.cjs"),
                    to: path.resolve(__dirname, "../www/"),
                },
                {
                    from: path.resolve(srcDir, "web-components", "style", "*.css"),
                    to: (context, absoluteFilename) => {
                        return path.resolve(__dirname, "../www", "[name][ext]");
                    }
                }
            ],
        }),
    ],
};
