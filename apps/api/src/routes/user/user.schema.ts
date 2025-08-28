// user.schema.ts
import { user } from "@repo/database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Keep overrides minimal and aligned with your DB column nullability
const overrides = {
  email: z.string().email(),
  image: z.string().url().nullish(),
};

export const userSelectSchema = createSelectSchema(user, overrides);

// Types
export type User = z.infer<typeof userSelectSchema>;
