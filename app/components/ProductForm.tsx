'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductSchema } from '@/lib/schemas';
import { createProduct, updateProduct } from '@/app/actions/products';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
}

interface ProductFormProps {
    product?: Product;
    onSubmit: () => void;
    onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            price: product?.price ? Number(product.price) : 0,
            stock: product?.stock || 0,
        },
    });

    const onFormSubmit = async (data: ProductSchema) => {
        setServerError(null);
        let result;

        if (product?.id) {
            result = await updateProduct(product.id, data);
        } else {
            result = await createProduct(data);
        }

        if (result.error) {
            setServerError(result.error);
        } else {
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">{product?.id ? 'Edit Product' : 'Add New Product'}</h2>

            {serverError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{serverError}</span>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    {...register('name')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    {...register('description')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('price', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                        type="number"
                        {...register('stock', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    );
}
