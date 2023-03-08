/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const appDir = path.resolve(__dirname, "./preview");
const outDir = path.resolve(__dirname, "./www/preview");

module.exports = {
    name: "preview",
    entry: {
        main: path.resolve(appDir, "index.ts"),
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: outDir,
        publicPath: process.env.NODE_ENV === "production" ? "./editor/preview/" : "./preview/",
        filename: "[name].[contenthash].js",
    },
    mode: process.env.NODE_ENV || "development",
    module: {
        // where we defined file patterns and their loaders
        rules: [
            {
                test: /.tsx?$/,
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
            {
                test: /message\-system\.min\.js/,
                use: {
                    loader: "worker-loader",
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: "Preview",
            inject: "body",
            template: path.resolve(appDir, "index.html"),
            globalCssVariableStylesheet: process.env.NODE_ENV === "production"
                ? "/editor/public/global.css-variables.css"
                : "/public/global.css-variables.css",
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, "../packages", "design-to-code", "src", "web-components", "style", "*.css"),
        //             to: (context, absoluteFilename) => {
        //                 return path.resolve(__dirname, "../www", "[name][ext]");
        //             }
        //         }
        //     ],
        // }),
    ],
};