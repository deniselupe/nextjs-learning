import { z } from 'zod';

const PostSchema = z.object({
    userId: z.number(),
    id: z.number(),
    title: z.string(),
    body: z.string()
});

export interface PostType extends z.infer<typeof PostSchema> {}