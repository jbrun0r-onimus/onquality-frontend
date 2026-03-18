import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    API_BASE_URL: 'http://example.org',
  },
  e2e: {
    baseUrl: 'http://localhost:9000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
