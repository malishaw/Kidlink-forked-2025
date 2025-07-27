import { z } from "zod";

export const checkUserTypeSchema = z.object({
  userType: z.enum(["user", "hotelOwner", "systemAdmin"])
});
