const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const appDir = path.resolve(__dirname, "./src");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    devServer: {
        compress: false,
        historyApiFallback: true,
        open: true,
        port: 7003,
    },
    devtool: process.env.NODE_ENV === "production" ? "none" : "inline-source-map",
    entry: {
        app: path.resolve(appDir, "index.tsx"),
        "message-system": path.resolve(
            __dirname,
            "../node_modules/design-to-code/dist/message-system.min.js"
        ),
    },
    output: {
        path: outDir,
        publicPath: "/",
        filename: "[name].[contenthash].js",
    },
    mode: process.env.NODE_ENV || "development",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                declaration: false,
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            contentBase: outDir,
            inject: "body",
            template: path.resolve(appDir, "index.html"),
            publicPath: "./",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve("../node_modules/design-to-code/dist/web-components/**/*.css"),
                    to: "public/[name][ext]"
                },
            ],
        }),
    ],
    resolve: {
        extensions: [".js", ".tsx", ".ts", ".json", ".css"],
    },
};
