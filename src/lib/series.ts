import { z } from 'zod';
export const seriesSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(1).max(200),
  lane: z.string().trim().max(120),
  tagline: z.string().trim().max(300),
  description: z.string().trim().max(5000),
  entryPoint: z.string().trim().max(200),
  visible: z.boolean(),
  sortPriority: z.number().int().min(-9999).max(9999),
});
