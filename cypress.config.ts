import dotenv from 'dotenv';
dotenv.config({ path: `.env.dev` })
import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    CYPRESS_TEST_USER: process.env.CYPRESS_TEST_USER,
    CYPRESS_TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD,
    SERVER: process.env.SERVER,
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/*.spec.ts",
    setupNodeEvents(on, config) {
    },
  },
});
