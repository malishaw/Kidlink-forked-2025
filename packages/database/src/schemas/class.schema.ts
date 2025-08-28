import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { nurseries } from "./nursery.schema"; // assuming you have a users table defined

export const classes = pgTable("classes", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  nurseryId: text("nursery_id").references(() => nurseries.id, {
    onDelete: "set null",
  }), // generates UUID by default

  name: varchar("name", { length: 100 }).notNull(),
  // foreign key to users

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
