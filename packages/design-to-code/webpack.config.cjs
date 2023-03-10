const path = require("path");
const glob = require("glob");
const rootAppWebpackConfig = require(path.resolve(__dirname, "app/webpack.dev.cjs"));
const outDir = path.resolve(__dirname, "./www");

const configs = new Promise(resolver => {
    try {
        glob(
            `${path.resolve(__dirname, "./app/examples")}/*/webpack.dev.cjs`,
            {
                mode: "development",
            },
            function (err, files) {
                if (err) {
                    throw err;
                }

                resolver(
                    files.map((file, index) => {
                        const webpackConfig = require(file);
                        const name = path.basename(path.dirname(file));

                        webpackConfig.name = name;
                        webpackConfig.output = {
                            ...webpackConfig.output,
                            path: path.resolve(outDir, name),
                            publicPath: `/${name}/`,
                        };

                        return webpackConfig;
                    })
                );
            }
        );
    } catch (err) {
        console.info(`No example app webpack files found`, err);
        process.exit(0);
    }
}).then(webpackConfigs => {
    return [rootAppWebpackConfig, ...webpackConfigs];
});

module.exports = configs;
module.exports.parallelism = 100;
