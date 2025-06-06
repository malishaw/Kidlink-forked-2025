import { z } from "zod";

export const errorMessageSchema = z.object({
  message: z.string()
});

export const stringIdParamSchema = z.object({
  id: z.string()
});
