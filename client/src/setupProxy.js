const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  console.log(4, process.env.REACT_APP_API_URL)
  app.use(
    '/api', // You can pass in an array too eg. ['/api', '/another/path']
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || '',
      changeOrigin: true,
    }),
  );
};
