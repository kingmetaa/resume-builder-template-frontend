const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const webpackNodeExternals = require('webpack-node-externals');

const Modes = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
};

module.exports = (env, { mode }) => {
    const isProduction = mode === Modes.PRODUCTION;

    return {
        mode,
        entry: path.join(__dirname, 'src', 'index.tsx'),
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.jsx'],
            // assert: require.resolve('assert'),
            // crypto: require.resolve('crypto-browserify'),
            // http: require.resolve('stream-http'),
            // https: require.resolve('https-browserify'),
            // os: require.resolve('os-browserify/browser'),
            // stream: require.resolve('stream-browserify'),
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'build'),
            publicPath: '/',
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(graphql|gql)$/,
                    exclude: /node_modules/,
                    loader: 'graphql-tag/loader',
                },
                {
                    test: /\.?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|jp(e*)g|gif|webp|avif)$/,
                    use: ['file-loader'],
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack'],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'src', 'index.html'),
                favicon: path.join(__dirname, 'src', 'assets/images/favicon.ico'),
            }),
        ],

        performance: {
            maxEntrypointSize: Infinity,
            maxAssetSize: 1024 ** 2,
        },

        devtool: isProduction ? 'source-map' : 'inline-source-map',

        devServer: {
            host: 'localhost',
            port: 3000,
            historyApiFallback: true,
        },
    };
};
