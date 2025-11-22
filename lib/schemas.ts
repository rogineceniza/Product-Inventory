import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.number().min(0.01, 'Price must be greater than 0'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
});

export type ProductSchema = z.infer<typeof productSchema>;
