const defineConfig = require('cypress').defineConfig
// import constants from './constants'
// const { APP } = constants

module.exports = defineConfig({
  env: {
    coverage: true,
  },
  retries: {
    openMode: 0,
    runMode: 1,
  },
  video: false,
  videoUploadOnPasses: false,
  viewportHeight: 550,
  viewportWidth: 700,
  projectId: 'qmz9cz',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    // setupNodeEvents(on, config) {
    //   return require('./cypress/plugins/index.ts')(on, config)
    // },
    baseUrl: `http://localhost:8080`,
    specPattern: 'cypress/e2e/**/*.spec.js',
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents (on, config) { },
    env: {
      coverage: false,
    },
    specPattern: 'src/**/*.spec.js',
  },
})
