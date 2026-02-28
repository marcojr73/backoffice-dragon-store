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
  organizationId: z.number(),
});

export const zUsers = z.array(zUser);

export type TUser = z.infer<typeof zUser>;
