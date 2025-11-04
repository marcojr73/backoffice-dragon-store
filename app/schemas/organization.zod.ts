import { z } from 'zod';

export const zOrganization = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  logo: z.string(),
  responsibleName: z.string().nullable(),
  responsibleEmail: z.string().nullable(),
  responsiblePhone: z.string().nullable(),
  createdAt: z.string(),
});

export type TOrganization = z.infer<typeof zOrganization>;
