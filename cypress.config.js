const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false,
    specPattern: 'tests/e2e/**/*.cy.js',
  },
  fixturesFolder: "tests/e2e/fixtures",
  filesFolder: "tests/e2e/files",
  screenshotsFolder: "tests/e2e/screenshots",
  videosFolder: "tests/e2e/videos",
  downloadsFolder: "tests/e2e/downloads"
});
