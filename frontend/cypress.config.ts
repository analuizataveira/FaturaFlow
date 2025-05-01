/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
  },
})