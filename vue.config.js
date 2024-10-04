const { defineConfig } = require('@vue/cli-service');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

module.exports = defineConfig({
	transpileDependencies: [
		'vuetify',
	],
	configureWebpack:      {
		plugins: [
			// 压缩成 .gz 文件
			new CompressionPlugin({
				filename:  '[path][base].gz',
				algorithm: 'gzip',
				test:      /\.js$|\.css$|\.html$/,
				threshold: 10240,
				minRatio:  0.8,
			}),
			// 压缩成 .br 文件，如果 zlib 报错无法解决，可以注释这段使用代码，一般本地没问题，需要注意线上服务器会可能发生找不到 zlib 的情况。
			new CompressionPlugin({
				filename:           '[path][base].br',
				algorithm:          'brotliCompress',
				test:               /\.(js|css|html|svg)$/,
				compressionOptions: {
					params: {
						[zlib.constants.BROTLI_PARAM_QUALITY]: 11,
					},
				},
				threshold:          10240,
				minRatio:           0.8,
			}),
		],
	},
});
