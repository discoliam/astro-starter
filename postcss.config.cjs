// postcss.config.cjs

module.exports = {
  plugins: [
    require("postcss-import"),
    require("@csstools/postcss-global-data")({
      files: ["./src/css/global/queries.css"],
    }),
    require("postcss-custom-media")(),
    require("postcss-preset-env")({ stage: 1 }),
  ],
};