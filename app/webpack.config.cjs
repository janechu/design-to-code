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
                            configFile: path.resolve(__dirname, "tsconfig.json"),
                            compilerOptions: {
                                declaration: false,
                            },
                        },
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
        new HtmlWebpackPlugin({
            contentBase: outDir,
            inject: "body",
            template: path.resolve(appDir, "index.html"),
            publicPath: "./",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve("../node_modules/design-to-code/dist/stylesheets/**/*.css"),
                    to: "public/[name][ext]"
                },
            ],
        }),
    ],
    resolve: {
        extensions: [".js", ".tsx", ".ts", ".json", ".css"],
    },
};
