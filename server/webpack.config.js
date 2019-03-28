var path = require("path");
var nodeExternals = require("webpack-node-externals");

module.exports = {
	mode: "development",
	target: "node",
	devtool: "inline-source-map",
	entry: "./src/server.ts",
	output: {
		filename: "bundle.js",
		path: __dirname + "/dist",
	},
	resolve: {
		extensions: [".ts", ".js"],
		alias: {
			"@lib": path.resolve(__dirname, "../lib"),
		},
	},
	module: {
		rules: [{ test: /\.tsx?$/, loader: "awesome-typescript-loader" }],
	},
	externals: [nodeExternals()],
};
