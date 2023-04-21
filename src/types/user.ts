import { z } from 'zod';

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    address: z.object({
        street: z.string(),
        suite: z.string(),
        city: z.string(),
        zipcode: z.string(),
        geo: z.object({
            lat: z.string(),
            lng: z.string()
        })
    }),
    phone: z.string(),
    website: z.string().url(),
    company: z.object({
        name: z.string(),
        catchPhrase: z.string(),
        bs: z.string()
    })
});

export interface UserType extends z.infer<typeof UserSchema> {};