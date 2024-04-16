const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    let libsToIgnore = {};
    if (!env.WEBPACK_SERVE) {
        libsToIgnore = {
            angular: 'angular',
            'lodash-es': '_',
            'fuse.js': 'commonjs fuse.js'
        };
    }
    return {
        externals: libsToIgnore,
        entry: {
            main: './app/index.ts',
            test: './app/tests/manual/index.ts'
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    type: 'asset/source', // inline the HTML in the bundle
                    exclude: /index-test.html/
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                    include: /app/
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(jpe?g|png|gif|svg|webp)$/,
                    type: 'asset/inline'
                }
            ]
        },
        plugins: [
            // generates an index.html file based on our existing index.html
            new HtmlWebpackPlugin({ template: './index-test.html', inject: false }),
            // copy over non TS files
            new CopyPlugin({
                patterns: [
                    {
                        from: '**/*',
                        context: path.resolve(__dirname, 'app'),
                        globOptions: {
                            dot: true,
                            gitignore: true,
                            ignore: ['**/*.ts', '**/*.html']
                        }
                    },
                    {
                        from: 'package.json'
                    }
                ]
            })
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.html']
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist')
            },
            // serve index.html for all 404
            historyApiFallback: true,
            compress: true,
            port: 8000,
            hot: true,
            open: true
        },
        devtool: argv.mode === 'development' ? 'inline-source-map' : false,
        target: 'web'
    };
};
