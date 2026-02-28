import { z } from 'zod';

export const zOrganization = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  logo: z.string(),
  responsibleName: z.string().nullable(),
  responsibleEmail: z.string().nullable(),
  responsiblePhone: z.string().nullable(),
  reportSendInterval: z
    .union([
      z.literal(0),
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
    ])
    .optional(),
  coinsSupply: z.number().optional(),
  maxRedemptions: z.number().nullable().optional(),
  createdAt: z.string(),
});

export type TOrganization = z.infer<typeof zOrganization>;
