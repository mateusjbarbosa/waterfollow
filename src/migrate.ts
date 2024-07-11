import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { ENV } from "./env";

const connection = postgres({
  host: ENV.DB_HOST,
  database: ENV.DB_NAME,
  password: ENV.DB_PASSWORD,
  port: ENV.DB_PORT,
  user: ENV.DB_USER,
  max: 1,
});
const db = drizzle(connection);

(async () => {
  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("Migrations applied successfully!");

  await connection.end();

  process.exit();
})();
