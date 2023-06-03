const path = require("path");
const aaConfigsWebpack = require("@allaround/configs-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const isDev = process.env.STAGING_ENV === "dev";

module.exports = () => {
  const rules = [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: "ts-loader",
    },
    {
      test: /\.s[ac]ss$/,
      use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
    },
  ];

  const plugins = [
    isDev && new ReactRefreshWebpackPlugin(),
    // new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "./index.html",
      template: "./public/index.html",
    }),
    new MiniCssExtractPlugin({
      // filename: "static/css/[name].[contenthash:8].css",
      // chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    new ESLintPlugin(),
  ].filter(Boolean);

  const devServer = {
    historyApiFallback: true,
  };

  const rest = {
    // experiments: {
    //   asyncWebAssembly: true,
    // },
  };

  const webpackConfig = aaConfigsWebpack({
    rules,
    rest,
    plugins,
    devServer,
  });

  // console.log(webpackConfig);

  return webpackConfig;
};
