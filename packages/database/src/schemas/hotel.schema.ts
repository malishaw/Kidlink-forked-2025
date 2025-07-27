import { sql } from "drizzle-orm";
import {
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  varchar
} from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";

export const hotelStatusEnum = pgEnum("hotel_status", [
  "active",
  "inactive",
  "under_maintenance",
  "pending_approval"
]);

export const hotelTypes = pgTable("hotel_types", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }),

  thumbnail: text("thumbnail"),

  ...timestamps
});

export const propertyClasses = pgTable("property_classes", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }),

  thumbnail: text("thumbnail"),

  ...timestamps
});

// Core Hotel & Property Management Tables
export const hotels = pgTable(
  "hotels",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    organizationId: text("organization_id")
      .references(() => organization.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: text("created_by")
      .references(() => user.id, { onDelete: "set null" })
      .notNull(),

    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    brandName: varchar("brand_name", { length: 255 }),

    // Address fields
    street: varchar("street", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),

    // Contact info
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),
    website: varchar("website", { length: 500 }),

    // Hotel details
    hotelType: text("hotel_type").references(() => hotelTypes.id, {
      onDelete: "set null"
    }),
    starRating: integer("star_rating").default(0),
    propertyClass: text("property_class").references(() => propertyClasses.id, {
      onDelete: "set null"
    }),

    // Operational details
    checkInTime: varchar("check_in_time", { length: 5 }).default("15:00"), // HH:MM format
    checkOutTime: varchar("check_out_time", { length: 5 }).default("11:00"), // HH:MM format

    // Policies (stored as JSON for flexibility)
    hotelPolicies: jsonb("hotel_policies"), // cancellation, pet, smoking, etc.

    status: hotelStatusEnum("status").default("pending_approval").notNull(),

    ...timestamps
  },
  (table) => [
    index("hotels_city_idx").on(table.city),
    index("hotels_location_idx").on(table.latitude, table.longitude),
    index("hotels_status_idx").on(table.status)
  ]
);

export const hotelAmenities = pgTable(
  "hotel_amenities",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),

    amenityType: varchar("amenity_type", { length: 100 }).notNull(), // wifi, parking, pool, gym, spa, etc.

    ...timestamps
  },
  (table) => [
    index("hotel_amenities_hotel_idx").on(table.hotelId),
    index("hotel_amenities_type_idx").on(table.amenityType)
  ]
);

export const hotelImages = pgTable(
  "hotel_images",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    roomTypeId: uuid("room_type_id").references(() => roomTypes.id, {
      onDelete: "cascade"
    }),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),
    imageType: imageTypeEnum("image_type").default("other").notNull(),
    altText: varchar("alt_text", { length: 255 }),
    displayOrder: integer("display_order").default(0),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    hotelImageIndex: index("hotel_images_hotel_idx").on(table.hotelId),
    roomTypeImageIndex: index("hotel_images_room_type_idx").on(
      table.roomTypeId
    ),
    displayOrderIndex: index("hotel_images_display_order_idx").on(
      table.displayOrder
    )
  })
);

export const hotelPolicies = pgTable(
  "hotel_policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hotelId: uuid("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    policyType: varchar("policy_type", { length: 100 }).notNull(), // cancellation, pet, smoking, etc.
    policyText: text("policy_text").notNull(),
    effectiveDate: date("effective_date").defaultNow().notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    hotelPolicyIndex: index("hotel_policies_hotel_idx").on(table.hotelId),
    policyTypeIndex: index("hotel_policies_type_idx").on(table.policyType)
  })
);
