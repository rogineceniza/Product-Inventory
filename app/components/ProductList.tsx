'use client';

import { useState } from 'react';
import ProductForm from './ProductForm';
import { deleteProduct } from '@/app/actions/products';

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

interface ProductListProps {
    initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        await deleteProduct(id);
    };

    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleFormSubmit = () => {
        setIsEditing(false);
        setCurrentProduct(undefined);
    };

    const handleFormCancel = () => {
        setIsEditing(false);
        setCurrentProduct(undefined);
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => {
                        setCurrentProduct(undefined);
                        setIsEditing(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Add New Product
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="w-full max-w-md">
                        <ProductForm
                            product={currentProduct}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {initialProducts.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(product.price).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {initialProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No products found. Click "Add New Product" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
