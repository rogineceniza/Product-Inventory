import { getProducts } from '@/app/actions/products';
import ProductList from '@/app/components/ProductList';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Product Inventory</h1>
                </div>
                <ProductList initialProducts={products} />
            </div>
        </div>
    );
}
