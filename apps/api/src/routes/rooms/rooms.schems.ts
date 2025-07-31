import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { roomTypes, rooms } from "@repo/database";

// Room Type Schemas
export const roomTypeSchema = createSelectSchema(roomTypes);

export type RoomType = z.infer<typeof roomTypeSchema>;

// Rooms Schemas
export const roomSchema = createSelectSchema(rooms);

export type Room = z.infer<typeof roomSchema>;
