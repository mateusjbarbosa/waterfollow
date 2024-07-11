import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ENV } from "./env";
import * as schema from "./schema";

const connection = postgres({
  host: ENV.DB_HOST,
  database: ENV.DB_NAME,
  password: ENV.DB_PASSWORD,
  port: ENV.DB_PORT,
  user: ENV.DB_USER,
});

export const db = drizzle(connection, { schema });
