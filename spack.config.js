// NOTE: This feature is currently named spack, but will be renamed to swcpack in v2. spack.config.js will be deprecated for swcpack.config.js.
const { config } = require("@swc/core/spack");

module.exports = config({
  entry: {
    web: __dirname + "/src/index.tsx",
  },
  output: {
    path: __dirname + "/dist",
  },
  module: {},
});
