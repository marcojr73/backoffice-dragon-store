import { z } from 'zod';

const zProduct = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  value: z.number(),
  picture: z.string(),
});

export const zProducts = z.array(zProduct);

export type TProduct = z.infer<typeof zProduct>;
