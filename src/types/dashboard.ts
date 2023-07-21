import { z } from 'zod';

const DashboardDataSchema = z.object({
    "posts": z.number(), 
    "likes": z.number(),
    "followers": z.number(),
    "following": z.number()
});

export type DashboardDataType = z.infer<typeof DashboardDataSchema>;
