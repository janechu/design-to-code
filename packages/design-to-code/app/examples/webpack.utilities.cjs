const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const commonRules = [
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
];

module.exports = {
    commonRules
};