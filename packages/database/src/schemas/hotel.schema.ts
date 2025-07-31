import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  varchar
} from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";
import { rooms, roomTypes } from "./room.schema";

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
    roomTypeId: text("room_type_id").references(() => roomTypes.id, {
      onDelete: "cascade"
    }),

    imageUrl: text("image_url").notNull(),
    altText: varchar("alt_text", { length: 255 }),
    displayOrder: integer("display_order").default(0),
    isThumbnail: boolean("is_thumbnail").default(false),

    ...timestamps
  },
  (table) => [
    index("hotel_images_hotel_idx").on(table.hotelId),
    index("hotel_images_room_type_idx").on(table.roomTypeId),
    index("hotel_images_display_order_idx").on(table.displayOrder)
  ]
);

export const hotelPolicies = pgTable(
  "hotel_policies",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    policyType: varchar("policy_type", { length: 100 }).notNull(), // cancellation, pet, smoking, etc.
    policyText: text("policy_text").notNull(),

    effectiveDate: date("effective_date").defaultNow().notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    ...timestamps
  },
  (table) => [
    index("hotel_policies_hotel_idx").on(table.hotelId),
    index("hotel_policies_type_idx").on(table.policyType)
  ]
);

// Relation Definitions

export const hotelRelations = relations(hotels, ({ many, one }) => ({
  amenities: many(hotelAmenities),
  roomTypes: many(roomTypes),
  rooms: many(rooms),
  images: many(hotelImages),
  policies: many(hotelPolicies),
  hotelType: one(hotelTypes, {
    fields: [hotels.hotelType],
    references: [hotelTypes.id]
  }),
  propertyClass: one(propertyClasses, {
    fields: [hotels.propertyClass],
    references: [propertyClasses.id]
  })
}));

export const hotelAmenitiesRelations = relations(hotelAmenities, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelAmenities.hotelId],
    references: [hotels.id]
  })
}));

export const hotelImagesRelations = relations(hotelImages, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelImages.hotelId],
    references: [hotels.id]
  }),
  roomType: one(roomTypes, {
    fields: [hotelImages.roomTypeId],
    references: [roomTypes.id]
  })
}));

export const hotelPoliciesRelations = relations(hotelPolicies, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelPolicies.hotelId],
    references: [hotels.id]
  })
}));
