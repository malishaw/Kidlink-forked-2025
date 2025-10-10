import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";

// assuming you have a children schema
// import { classes } from "./classes.schema"; // uncomment if you have classes table
export const event = pgTable("event", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull(),
  description: text("description"),
  startDate: text("startdate"),
  endDate: text("enddate"),
  ticketPrice: text("ticketprice"),
  venue: text("venue"),
  coverImageUrl: text("cover_image_url"),
  galleryImagesUrl: text("gallery_images_url"),
  status: text("status"),
  organizer: text("organizer"),
  organizationId: text("organization_id").references(() => organization.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
