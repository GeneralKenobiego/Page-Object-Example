import { defineConfig } from "cypress";
import { Pool, Client } from 'pg'

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
    },
  },
});
