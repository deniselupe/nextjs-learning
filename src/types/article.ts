import { z } from 'zod';

const ArticleSchema = z.object({
    "id": z.number(),
    "title": z.string(),
    "description": z.string(),
    "category": z.string()
});

export type ArticleType = z.infer<typeof ArticleSchema>;
export type ArticlesType = ArticleType[];
