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

import { boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { hotels } from "./hotel.schema";

export const viewTypeEnum = pgEnum("view_type", [
  "ocean",
  "city",
  "garden",
  "mountain",
  "pool",
  "courtyard",
  "street",
  "interior"
]);

export const roomStatusEnum = pgEnum("room_status", [
  "available",
  "occupied",
  "maintenance",
  "out_of_order",
  "dirty"
]);

export const roomTypes = pgTable(
  "room_types",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),

    // Occupancy details
    baseOccupancy: integer("base_occupancy").default(2).notNull(),
    maxOccupancy: integer("max_occupancy").default(2).notNull(),
    extraBedCapacity: integer("extra_bed_capacity").default(0),

    // Bed configuration (stored as JSON for flexibility)
    bedConfiguration: jsonb("bed_configuration"), // {king: 1, queen: 0, twin: 0, sofa_bed: 0}

    // Room details
    roomSizeSqm: decimal("room_size_sqm", { precision: 6, scale: 2 }),
    viewType: viewTypeEnum("view_type"),

    status: boolean("is_active").default(true).notNull(),

    ...timestamps
  },
  (table) => [index("room_types_hotel_idx").on(table.hotelId)]
);

export const roomTypeAmenities = pgTable(
  "room_type_amenities",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    roomTypeId: text("room_type_id")
      .references(() => roomTypes.id, { onDelete: "cascade" })
      .notNull(),

    amenityType: varchar("amenity_type", { length: 100 }).notNull(), // ac, tv, wifi, minibar, etc.

    ...timestamps
  },
  (table) => [index("room_type_amenities_room_type_idx").on(table.roomTypeId)]
);

export const rooms = pgTable(
  "rooms",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    roomTypeId: text("room_type_id")
      .references(() => roomTypes.id, { onDelete: "cascade" })
      .notNull(),
    roomNumber: varchar("room_number", { length: 20 }).notNull(),
    floorNumber: integer("floor_number"),
    isAccessible: boolean("is_accessible").default(false),
    status: roomStatusEnum("status").default("available").notNull(),
    lastCleanedAt: timestamp("last_cleaned_at"),

    ...timestamps
  },
  (table) => [
    index("rooms_hotel_idx").on(table.hotelId),
    uniqueIndex("rooms_hotel_room_number_idx").on(
      table.hotelId,
      table.roomNumber
    ),
    index("rooms_status_idx").on(table.status)
  ]
);
