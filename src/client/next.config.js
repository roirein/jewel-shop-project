const withTM = require('next-transpile-modules')(['@mui/x-date-pickers']);
require('dotenv').config

module.exports = withTM({
    env: {
        SERVER_URL: process.env.SERVER_URL
      }
  });