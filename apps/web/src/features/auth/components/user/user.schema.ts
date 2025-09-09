// user.schema.ts
import { user } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Keep overrides minimal and aligned with your DB column nullability
const overrides = {
  email: z.string().email(),
  image: z.string().url().nullish(),
};

// Select schema for user
export const userSelectSchema = createSelectSchema(user, overrides);

// Insert schema (omit auto-generated fields)
export const userInsertSchema = createInsertSchema(user)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .transform((data) => ({ ...data }));

// Update schema (partial, omit auto-generated fields)
export const userUpdateSchema = createInsertSchema(user)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Types
export type userInsertType = z.output<typeof userInsertSchema>; // use z.output because of transform
export type userUpdateType = z.infer<typeof userUpdateSchema>;
export type User = z.infer<typeof userSelectSchema>;
