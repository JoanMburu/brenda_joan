// craco.config.js
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      // This allows modules to import the polyfilled modules instead of Node.js ones.
      stream: require.resolve("stream-browserify"),
      https: require.resolve("https-browserify"),
      util: require.resolve("util"),
    },
    fallback: {
      http: false,
      zlib: false,
    },
  },
};
