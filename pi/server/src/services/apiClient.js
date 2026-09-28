const axios = require('axios');
const config = require('config');

// Basic auth for the API, kept out of git in config/local-production.json:
// { "api": { "auth": { "username": "...", "password": "..." } } }
const auth = config.has('api.auth') ? config.get('api.auth') : undefined;

const authHeader = auth
  ? { Authorization: `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString('base64')}` }
  : {};

const apiClient = axios.create({ auth });

module.exports = { apiClient, authHeader };
