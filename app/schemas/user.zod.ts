import { z } from 'zod';

export const zUser = z.object({
  id: z.number(),
  userName: z.string(),
  email: z.string(),
  picture: z.string().nullable(),
  isAdmin: z.boolean(),
  coins: z.number().optional(),
  gas: z.number().optional(),
  password: z.string().optional(),
  organization: z.object({
    id: z.number(),
    name: z.string(),
    logo: z.string().optional().nullable(),
  }),
});

export const zUsers = z.array(zUser);

export type TUser = z.infer<typeof zUser>;
