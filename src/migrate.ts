import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { ENV } from "./env";

const connection = postgres(ENV.DB_URL);
const db = drizzle(connection);

(async () => {
  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("Migrations applied successfully!");

  await connection.end();

  process.exit();
})();
