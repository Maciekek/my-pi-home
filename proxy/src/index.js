'use strict';

const fs = require('fs');
const { getLocalIPv4Addresses } = require('./helpers/network');

if (!fs.existsSync('.env')) {
  console.warn('[proxy] .env file not found in current working directory');
}

require('dotenv').config();

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = process.env.PORT ? Number(process.env.PORT) : 9000;
const TARGET_URL = process.env.TARGET_URL;

if (!TARGET_URL) {
  console.error('[proxy] Missing required env TARGET_URL');
  process.exit(1);
}

const app = express();

// Basic request logging to stdout
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const line = [
      new Date().toISOString(),
      req.method,
      req.originalUrl,
      '->',
      TARGET_URL,
      res.statusCode,
      `${ms}ms`
    ].join(' ');
    // stdout
    console.log(line);
  });
  next();
});

const proxy = createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  xfwd: true,
  logLevel: 'silent',
  onError(err, req, res) {
    console.error('[proxy] error', err && err.message ? err.message : err);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
    }
    res.end('Bad gateway');
  }
});

app.use('/', proxy);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[proxy] listening on 0.0.0.0:${PORT} -> ${TARGET_URL}`);
  const ips = getLocalIPv4Addresses();
  if (ips.length === 0) {
    console.log('[proxy] no local IPv4 addresses detected');
    return;
  }
  console.log('[proxy] request URLs:');
  for (const { name, address } of ips) {
    console.log(`- ${name}: http://${address}:${PORT}/`);
  }
});
