import { createId } from "@paralleldrive/cuid2";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const hydrationHistory = pgTable('hydration_histories', {
  id: varchar('id', { length: 128 }).$defaultFn(() => createId()).primaryKey(),
  hydrationAt: timestamp('hydration_at').notNull(),
  quantityInMilliliters: integer('quantity_in_milliliters').notNull(),
});
export type HydrationHistory = typeof hydrationHistory.$inferInsert
