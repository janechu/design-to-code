const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    devServer: {
        compress: false,
        historyApiFallback: true,
        open: true,
        port: 7002,
    },
    devtool: process.env.NODE_ENV === "production" ? "none" : "inline-source-map",
    entry: {
        app: path.resolve(appDir, "index.tsx"),
        focusVisible: path.resolve(
            __dirname,
            "../../node_modules/focus-visible/dist/focus-visible.min.js"
        ),
        "message-system": path.resolve(
            __dirname,
            "../../node_modules/design-to-code/dist/message-system.min.js"
        ),
    },
    output: {
        path: outDir,
        publicPath: "/",
        filename: "[name].js",
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
                        loader: "babel-loader",
                        options: {
                            plugins: ["istanbul"]
                        }
                    },
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
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.posix.join(
                        path.resolve(__dirname, "../design-to-code/dist/stylesheets/**").replace(/\\/g, "/"),
                        "*.css"
                    ),
                    to: "public/[name][ext]"
                },
            ],
        }),
    ],
    resolve: {
        extensions: [".js", ".tsx", ".ts", ".json", ".css"],
        alias: {
            react: path.resolve("../../node_modules/react"),
            "react-dom": path.resolve("../../node_modules/react-dom"),
        },
    },
};
