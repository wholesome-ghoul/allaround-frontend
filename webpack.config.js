const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const outDir = "dist";
const PORT = 3000;

module.exports = function (webpackEnv) {
  const isProd = process.env.STAGING_ENV === "prod";
  const isDev = process.env.STAGING_ENV === "dev";

  return {
    entry: "./src/index.tsx",
    mode: isProd ? "production" : "development",
    output: {
      filename: isProd ? "[name].[contenthash:8].js" : "[name].bundle.js",
      chunkFilename: isProd
        ? "[name].[contenthash:8].chunk.js"
        : "[name].chunk.js",
      filename: "[name].[contenthash].js",
    },
    devServer: {
      port: PORT,
      client: { overlay: false },
      compress: true,
    },
    devtool: isDev ? "source-map" : false,
    module: {
      rules: [
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
      ],
    },
    // experiments: {
    //   asyncWebAssembly: true,
    // },
    plugins: [
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
    ].filter(Boolean),
    resolve: { extensions: [".js", ".ts", ".tsx"] },
  };
};
