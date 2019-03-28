const path = require("path");
const webpack = require("webpack");

module.exports = {
	mode: "development",
	devtool: "source-map",
	entry: "./src/js/index.tsx",
	output: {
		path: path.resolve(__dirname, "dist/"),
		publicPath: "/dist/",
		filename: "bundle.js",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		alias: {
			"@lib": path.resolve(__dirname, "../lib"),
		},
	},
	module: {
		rules: [
			{
				test: /\.(t|j)sx?$/,
				exclude: /(node_modules)/,
				loader: "awesome-typescript-loader",
			},
			{
				test: /\.css$/,
				use: [{ loader: "style-loader" }, { loader: "css-loader" }],
			},
			{
				test: /\.(png|jpe?g|gif|svg|ico|pdf)$/,
				loader: "file-loader?name=/resources/[path][name].[ext]&context=src/resources",
			},

			{
				test: /\.(woff|woff2|ttf|eot)$/,
				loader: "file-loader?name=/resources/fonts/[name].[hash].[ext]",
			},
		],
	},
	devServer: {
		contentBase: path.join(__dirname, "public/"),
		port: 4000,
		publicPath: "http://localhost:4000/dist/",
		hotOnly: true,
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
};
