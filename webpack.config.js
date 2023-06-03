const path = require("path");
const aaConfigsWebpack = require("@allaround/configs-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const isDev = process.env.STAGING_ENV === "dev";

module.exports = () => {
  const rules = [
    {
      test: /\.tsx?$/,
      include: path.join(__dirname, "src"),
      use: [
        {
          loader: "swc-loader",
          options: {
            env: { mode: "usage" },
            jsc: {
              transform: {
                react: {
                  runtime: "automatic",
                  refresh: isDev,
                },
              },
            },
          },
        },
      ],
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        // "style-loader",
        "css-loader",
      ],
    },
  ];

  const plugins = [
    isDev && new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
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

  const rest = {
    plugins,
    // experiments: {
    //   asyncWebAssembly: true,
    // },
  };

  const webpackConfig = aaConfigsWebpack({
    rules,
    rest,
  });

//   console.log(webpackConfig);

  return webpackConfig;
};
