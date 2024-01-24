/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");
const { commonRules } = require("../webpack.utilities.cjs");

const appDir = path.resolve(__dirname, "./");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    name: "monaco",
    entry: {
        main: path.resolve(appDir, "index.ts"),
    },
    resolve: {
        plugins: [new ResolveTypeScriptPlugin() ],
        extensions: [".ts", ".js"],
    },
    output: {
        path: outDir,
        publicPath: "/",
    },
    module: {
        // where we defined file patterns and their loaders
        rules: commonRules,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: "Test application",
            inject: "body",
            template: path.resolve(appDir, "index.html"),
        }),
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            languages: ["html"],
            features: ["format", "coreCommands", "codeAction"],
        }),
    ],
};
