/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

const appDir = path.resolve(__dirname, "./");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    name: "guidance",
    entry: {
        main: path.resolve(appDir, "index.ts"),
    },
    resolve: {
        extensions: [".ts", ".js"],
        plugins: [new ResolveTypeScriptPlugin()],
    },
    output: {
        path: outDir,
        publicPath: "/",
    },
    devtool: "source-map",
    module: {
        // where we defined file patterns and their loaders
        rules: [
            {
                test: /.ts$/,
                use: [
                    {
                        loader: "ts-loader",
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
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: "Test application",
            inject: "body",
            template: path.resolve(appDir, "index.html"),
            globalCssVariableStylesheet: "/global.css-variables.css",
            commonDefaultFontStylesheet: "/common.default-font.css",
        }),
    ],
};
