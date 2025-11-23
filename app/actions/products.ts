'use server';

import { prisma } from '@/lib/prisma';
import { productSchema, ProductSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return products.map((product: typeof products[number]) => ({
            ...product,
            price: product.price.toNumber(),
        }));
    } catch (error) {
        throw new Error('Failed to fetch products');
    }
}

export async function createProduct(data: ProductSchema) {
    const result = productSchema.safeParse(data);

    if (!result.success) {
        return { error: 'Invalid data' };
    }

    try {
        await prisma.product.create({
            data: result.data,
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to create product' };
    }
}

export async function updateProduct(id: number, data: ProductSchema) {
    const result = productSchema.safeParse(data);

    if (!result.success) {
        return { error: 'Invalid data' };
    }

    try {
        await prisma.product.update({
            where: { id },
            data: result.data,
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to update product' };
    }
}

export async function deleteProduct(id: number) {
    try {
        await prisma.product.delete({
            where: { id },
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to delete product' };
    }
}
