import { z } from 'zod';

const zSquad = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  squadLeaderId: z.number().nullable(),
  color: z.string().nullable(),
  logo: z.string().nullable(),
  score: z.number(),
});

const zUserSquad = z.object({
  id: z.number(),
  userName: z.string(),
  email: z.string(),
  picture: z.string().nullable(),
});

export const zSquads = z.array(zSquad);
export const zUsersSquad = z.object({
  id: z.number(),
  squadLeaderId: z.number(),
  usersSquad: z.array(zUserSquad),
});

export type TSquad = z.infer<typeof zSquad>;
export type TUsersSquad = z.infer<typeof zUsersSquad>;
