import { z } from 'zod';

export const transformImageSchema = z.object({
  resize: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
    })
    .optional(),
  crop: z
    .object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      x: z.number().int().min(0),
      y: z.number().int().min(0),
    })
    .optional(),
  rotate: z.number().int().min(-360).max(360).optional(),
  format: z.enum(['jpeg', 'png', 'webp', 'gif']).optional(),
  filters: z
    .object({
      grayscale: z.boolean().optional(),
      sepia: z.boolean().optional(),
      blur: z.number().min(0.3).max(1000).optional(),
      sharpen: z.boolean().optional(),
    })
    .optional(),
  flip: z.boolean().optional(),
  flop: z.boolean().optional(),
});
