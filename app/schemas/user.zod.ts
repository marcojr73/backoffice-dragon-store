import { z } from 'zod';

export const zUser = z.object({
  id: z.number(),
  userName: z.string(),
  email: z.string(),
  picture: z.string(),
  isAdmin: z.boolean(),
  organization: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export type TUser = z.infer<typeof zUser>;
