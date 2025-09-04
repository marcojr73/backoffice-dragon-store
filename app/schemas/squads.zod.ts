import { z } from 'zod';

const zSquad = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(),
  logo: z.string().nullable(),
  score: z.number(),
});

export const zSquads = z.array(zSquad);

export type TSquad = z.infer<typeof zSquad>;
