/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const { examples } = require("./app/examples.cjs");

const appDir = path.resolve(__dirname, "./app");
const srcDir = path.resolve(__dirname, "./src");
const outDir = path.resolve(__dirname, "./www");

const exampleEntries = examples.map((example) => {
    return {
        name: example,
        path: path.resolve(appDir, `examples/${example}/index.ts`)
    }
}).reduce((previous, current) => {
    return {
        ...previous,
        [current.name]: current.path
    }
}, {});

const exampleHTMLWebpackPlugin = examples.map((example) => {
    return new HtmlWebpackPlugin({
        title: "Test Application",
        inject: false,
        filename: `${example}.html`,
        template: path.resolve(appDir, `examples/${example}/index.html`),
        globalCssVariableStylesheet: "/global.css-variables.css",
        commonDefaultFontStylesheet: "/common.default-font.css",
        controlTextFieldStylesheet: "/control.text-field.css",
        commonInputStylesheet: "/common.input.css",
        controlButtonStylesheet: "/control.button.css",
        controlToggleStylesheet: "/control.toggle.css",
    })
});

module.exports = {
    entry: {
        main: path.resolve(appDir, "index.ts"),
        ...exampleEntries
    },
    resolve: {
        extensions: [".ts", ".js"],
        plugins: [new ResolveTypeScriptPlugin()],
    },
    output: {
        path: outDir,
        publicPath: "/",
    },
    devServer: {
        port: 7776,
    },
    mode: "development",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /.ts$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            plugins: ["istanbul"]
                        }
                    },
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
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: "Test application",
            inject: false,
            template: path.resolve(appDir, "index.html")
        }),
        ...exampleHTMLWebpackPlugin,
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(srcDir, "web-components", "style", "*.css"),
                    to: (context, absoluteFilename) => {
                        return path.resolve(outDir, "[name][ext]");
                    }
                }
            ],
        }),
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            languages: ["html"],
            features: ["format", "coreCommands", "codeAction"],
        }),
    ],
};
