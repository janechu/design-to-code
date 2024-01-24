/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");
const { commonRules } = require("../webpack.utilities.cjs");

const appDir = path.resolve(__dirname, "./");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    name: "units-text-field",
    entry: {
        main: path.resolve(appDir, "index.ts"),
    },
    resolve: {
        plugins: [new ResolveTypeScriptPlugin()],
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
            globalCssVariableStylesheet: "/global.css-variables.css",
        }),
    ],
};
