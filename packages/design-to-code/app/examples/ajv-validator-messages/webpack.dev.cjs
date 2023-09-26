/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const merge = require("webpack-merge").merge;
const baseConfig = require("./webpack.common.cjs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const srcDir = path.resolve(__dirname, "../../../src");

module.exports = merge(baseConfig, {
    devServer: {
        port: 7776,
    },
    mode: "development",
    output: {
        filename: "[name].js",
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(srcDir, "web-components", "style", "*.css"),
                    to: (context, absoluteFilename) => {
                        return path.resolve(__dirname, "./www", "[name][ext]");
                    }
                }
            ],
        }),
    ]
});
