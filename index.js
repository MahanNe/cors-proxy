const express = require('express');
const corsAnywhere = require('cors-anywhere');

const app = express();

// CORS Anywhere options
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],
}).listen(port, host, () => {
  console.log(`CORS Proxy running on http://${host}:${port}`);
});