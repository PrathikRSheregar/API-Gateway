const express = require('express');
const apiroutes = require('./routes');
const app = express();
const { ServerConfig, logger } = require('./config');
const { rateLimit } = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {AuthRequestMiddlewares} = require('./middlewares');
app.use(
  '/flightsService',
  AuthRequestMiddlewares.authenticate,
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        proxyReq.setHeader(
          'x-user',
          JSON.stringify(req.user)
        );
      }
    }
  })
);

app.use(
  '/bookingService',
  AuthRequestMiddlewares.authenticate,
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      '^/bookingService': ''
    },

    on: {
      proxyReq: (proxyReq, req) => {
        console.log("FORWARDING TO BOOKING SERVICE");

        proxyReq.setHeader(
          'x-user',
          JSON.stringify(req.user)
        );
      },

      proxyRes: (proxyRes, req) => {
        console.log("RESPONSE FROM BOOKING SERVICE");
      },

      error: (err, req, res) => {
        console.log("PROXY ERROR:", err.message);
        res.status(500).json({
          success: false,
          message: "Proxy error",
          error: err.message
        });
      }
    }
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 100
})

app.use(limiter)
app.use('/api', apiroutes);
app.listen(ServerConfig.PORT, () => {
  console.log(`Server is Listening to Port ${ServerConfig.PORT}`);
});