// import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

const dynamicImportVars = require('@rollup/plugin-dynamic-import-vars');

module.exports = (config) => {
  // console.log(config)
  return {
    ...config,
    plugins: [
      ...(config?.plugins || []),
      dynamicImportVars({
        // options
      }),
    ]
  }
}
