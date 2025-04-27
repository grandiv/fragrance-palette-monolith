import { z } from "zod";

export const generateSchema = z.object({
  description: z.string().min(5),
});
export type GenerateInput = z.infer<typeof generateSchema>;
