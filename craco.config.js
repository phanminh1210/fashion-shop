module.exports = {
    style: {
        sass: {
            loaderOptions: {
                sourceMap: true,
            },
        },
        postcss: {
            loaderOptions: {
                sourceMap: true,
            },
        },
    },
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.module.rules.forEach((rule) => {
                if (rule.oneOf) {
                    rule.oneOf.forEach((oneOf) => {
                        if (
                            oneOf.test &&
                            oneOf.test.toString().includes('scss') &&
                            Array.isArray(oneOf.use)
                        ) {
                            oneOf.use.forEach((loader) => {
                                if (
                                    typeof loader === 'object' &&
                                    loader.loader &&
                                    loader.loader.includes('resolve-url-loader')
                                ) {
                                    loader.options = loader.options || {};
                                    loader.options.sourceMap = true;
                                }
                            });
                        }
                    });
                }
            });
            return webpackConfig;
        },
    },
};
