import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { lessonPlans } from "@repo/database";

export const lessonPlan = createSelectSchema(lessonPlans);

export const lessonPlanInsertSchema = createInsertSchema(lessonPlans).omit({
  id: true,
  classId: true,
  teacherId: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
});

export const lessonPlanUpdateSchema = createInsertSchema(lessonPlans)
  .omit({
    id: true,
    organizationId: true,
    classId: true,
    teacherId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type lessonPlanUpdateType = z.infer<typeof lessonPlanUpdateSchema>;
export type lessonPlan = z.infer<typeof lessonPlan>;
export type lessonPlanInsertType = z.infer<typeof lessonPlanInsertSchema>;
