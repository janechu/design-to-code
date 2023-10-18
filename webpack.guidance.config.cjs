const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const outDir = path.resolve(__dirname, "./docs");

module.exports = {
    entry: {
        formguidance: path.resolve(__dirname, "./docs-files/json-schema/form.guidance.ts"),
    },
    output: {
        path: outDir,
        filename: "[name].min.js",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            onlyCompileBundledFiles: true,
                            compilerOptions: {
                                declaration: false,
                            },
                            configFile: "tsconfig.json",
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./packages/design-to-code/dist/stylesheets/web-components/style/global.css-variables.css"),
                    to: "global.css-variables.css"
                },
            ],
        }),
    ],
    resolve: {
        extensions: [".js", ".tsx", ".ts", ".json"],
    },
};
