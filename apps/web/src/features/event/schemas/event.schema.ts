import { event } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for reading events from database
export const eventSelectSchema = createSelectSchema(event);
export type EventType = z.infer<typeof eventSelectSchema>;

// Insert schema for creating new events
export const eventInsertSchema = createInsertSchema(event).omit({
  id: true,
  organizationId: true,
  updatedAt: true,
  createdAt: true,
});
export type EventInsertType = z.infer<typeof eventInsertSchema>;

// Update schema for modifying existing events
export const eventUpdateSchema = createInsertSchema(event)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();
export type EventUpdateType = z.infer<typeof eventUpdateSchema>;

// Form schema for frontend forms with validation
export const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  ticketPrice: z.string().optional(),
  venue: z.string().optional(),
  coverImageUrl: z.string().optional(),
  galleryImagesUrl: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled"]).optional(),
  organizer: z.string().optional(),
});
export type EventFormType = z.infer<typeof eventFormSchema>;
