import { z } from 'zod';

const zProduct = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  value: z.number(),
  picture: z.string(),
  availableStartAt: z.union([z.string()]).nullable(),
  availableEndAt: z.union([z.string()]).nullable(),
});

export const zProducts = z.array(zProduct);

export type TProduct = z.infer<typeof zProduct>;
