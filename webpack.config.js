const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    let libsToIgnore = {};
    if(!env.WEBPACK_SERVE) {
        libsToIgnore = {
            'angular': 'angular',
            //'pdfjs-dist': '{ getDocument, GlobalWorkerOptions, PDFPageProxy }',
            //'pdfjs-dist/build/pdf.worker.entry': 'pdfjsWorker',
            'lodash': '_',
            'fuse.js': 'Fuse'
        };
    }
    return {
        externals: libsToIgnore,
        entry: ['./app/index.ts'],
        module: {
            rules: [
                {
                    test: /\.html$/,
                    type: 'asset/resource',
                    exclude: /index-test.html/,
                    generator: {
                        filename: 'templates/[name].[contenthash][ext]'
                    }
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
                    test: /\.(jpe?g|png|gif|svg)$/,
                    type: 'asset/resource'
                }
            ]
        },
        plugins: [
            // generates an index.html file based on our existing index.html
            new HtmlWebpackPlugin({ template: './index-test.html', inject: false}),
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
                    },
                    {
                        from: 'app/otr-search-template.html'
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
            port: 8886,
            hot: true,
            open: true
        },
        devtool: argv.mode === 'development' ? 'inline-source-map' : false,
        target: 'web'
    };
};
