const path = require("path");
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const jetpack = require("fs-jetpack");

const getAllHtmlFilesInSrcDir = () => {
  const srcDir = jetpack.cwd("src");
  return srcDir
    .find({ matching: "*.html", recursive: false })
    .map((path) => path.split(".").slice(0, -1).join("."));
};

const envName = (env) => {
  if (env.production) {
    return "production";
  }
  if (env.test) {
    return "test";
  }
  return "development";
};

const envToMode = (env) => {
  if (env.production) {
    return "production";
  }
  return "development";
};

module.exports = (env) => {
  return {
    target: "electron-renderer",
    mode: envToMode(env),
    node: {
      __dirname: false,
      __filename: false,
    },
    externals: [nodeExternals()],
    resolve: {
      alias: {
        env: path.resolve(__dirname, `../config/env_${envName(env)}.json`),
      },
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: (() => {
      const plugins = [];

      getAllHtmlFilesInSrcDir().map((fileName) =>
        plugins.push(
          new HtmlWebpackPlugin({
            filename: `${fileName}.html`,
            template: `src/${fileName}.html`,
            chunks: [fileName],
          })
        )
      );
      return plugins;
    })(),
  };
};
