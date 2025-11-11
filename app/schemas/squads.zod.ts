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
  squadLeaderId: z.number().nullable(),
  usersSquad: z.array(zUserSquad),
});

export const zUserSquads = z.array(
  z.object({
    user: z.object({
      id: z.number(),
      userName: z.string(),
      picture: z.string(),
    }),
    squad: z.object({
      id: z.number(),
      name: z.string(),
      squadLeaderId: z.number().nullable(),
    }),
  })
);

export type TSquad = z.infer<typeof zSquad>;
export type TUsersSquad = z.infer<typeof zUsersSquad>;
export type TUserSquads = z.infer<typeof zUserSquads>;
