const path = require("path");

module.exports = {
  entry: "./Tetris.ts",
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "Tetris.js",
    path: path.resolve(__dirname, "build"),
  },
};
