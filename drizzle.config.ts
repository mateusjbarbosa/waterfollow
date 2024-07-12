import { defineConfig } from 'drizzle-kit';
import { ENV } from './src/env';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DB_URL
  },
});
