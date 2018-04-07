const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    'transform-decorators-legacy',
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
  proxy: {
    // "/api":{
    //   // "target": "http://192.168.234.203:8090/api"
    //   "target": "http://localhost:3000"
    // },
    '/v1': {
      target: 'http://192.168.253.34:11102',
      changeOrigin: true,
      pathRewrite: { '^/v1': '/v1' },
    },
  },
};
