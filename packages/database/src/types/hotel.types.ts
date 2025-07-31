import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { hotels } from "../schemas";

export const hotelSelectSchemaZ = createSelectSchema(hotels);

export type Hotel = z.infer<typeof hotelSelectSchemaZ>;

export const hotelCreateSchemaZ = createInsertSchema(hotels);

export type NewHotel = z.infer<typeof hotelCreateSchemaZ>;
