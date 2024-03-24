import { defineConfig } from "cypress";
import { Client } from 'pg'
import * as fs from 'fs';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {async connectDB({query, methodConf}) {
        const client = new Client(methodConf);
        await client.connect();
        const result = await client.query(query);
        await client.end();
        return result.rows;
      }})
      on('task', {
        copyFile(arg) {
          fs.copyFile(arg.originalFile, arg.newFile, (error) => {
            if (error) throw error;
          })
          return null;
        }
      })
    },
    baseUrl: 'https://example.cypress.io',
    chromeWebSecurity: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    taskTimeout: 120000,
    execTimeout: 60000,
    requestTimeout: 30000,
    responseTimeout: 120000,
    pageLoadTimeout: 30000,
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'spec, mocha-junit-reporter',
      mochaJunitReporterOptions: {
        mochaFile: 'cypress/results/test-results-[hash].xml',
      },
    },
    env: {
      firstDbConf: {
        user: '',
        host: '',
        database: '',
        password: '',
        port: '',
      },
      secondDbConf: {
        user: '',
        host: '',
        database: '',
        password: '',
        port: '',
      },
      rabbitMQUrl: '',
      // The token is computed as base64(USERNAME:PASSWORD)
      rabbitMQToken: '',
      elasticUrl: '',
      // The token is computed as base64(USERNAME:PASSWORD)
      elasticToken: '',
    },
  },
});
