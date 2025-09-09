

// export const userProfileInsertSchema = createInsertSchema(userProfiles).omit({
//   id: true,
//   updatedAt: true,
//   createdAt: true,
//   organizationId: true,
//   userId: true,
// });

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { profile } from "@repo/database"; // import the table from your db schema

// Select schema for reading user profile
export const profileSchema = createSelectSchema(profile);

// Insert schema for creating a new profile
export const profileInsertSchema = createInsertSchema(profile).omit({
  userId: true, // handled by auth or system
});

// Update schema for modifying an existing profile
export const profileUpdateSchema = createInsertSchema(profile)
  .omit({
    userId: true, // shouldn't be updated
  })
  .partial();

export type Profile = z.infer<typeof profileSchema>;
export type ProfileInsertType = z.infer<typeof profileInsertSchema>;
export type ProfileUpdateType = z.infer<typeof profileUpdateSchema>;
