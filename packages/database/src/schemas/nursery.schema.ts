import { sql } from "drizzle-orm";
import { pgTable, real, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";

export const nurseries = pgTable("nurseries", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  organizationId: text("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),

  createdBy: text("created_by")
    .references(() => user.id, { onDelete: "set null" })
    .notNull(),

  title: text("title").notNull(),
  description: text("description"),

  address: text("address"),

  longitude: real("longitude"),
  latitude: real("latitude"),

  // store as array of phone numbers
  phoneNumbers: text("phone_numbers")
    .array()
    .default(sql`ARRAY[]::text[]`),

  // single logo (store as URL or path)
  logo: text("logo"),

  // multiple photos (store as array of URLs/paths)
  photos: text("photos")
    .array()
    .default(sql`ARRAY[]::text[]`),

  // multiple attachments (store as array of URLs/paths)
  attachments: text("attachments")
    .array()
    .default(sql`ARRAY[]::text[]`),

  ...timestamps,
});
