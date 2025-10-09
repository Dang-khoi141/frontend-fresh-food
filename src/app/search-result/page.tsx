"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search as SearchIcon, Filter } from "lucide-react";
import ProductCard from "@/lib/components/common/product-card";
import { productService } from "@/lib/service/product.service";
import { Product } from "@/lib/interface/product";
import FreshNav from "../../lib/components/landing-page/header/header-nav";
import Footer from "../../lib/components/landing-page/footer/footer";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        categoryId: "",
        brandId: "",
    });

    useEffect(() => {
        if (query) {
            searchProducts();
        }
    }, [query]);

    const searchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await productService.searchProducts({
                search: query,
                minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
                maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
                categoryId: filters.categoryId || undefined,
                brandId: filters.brandId || undefined,
            });
            setProducts(response.data || []);
        } catch (err: any) {
            setError(err.message || "Failed to search products");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        searchProducts();
    };

    const clearFilters = () => {
        setFilters({
            minPrice: "",
            maxPrice: "",
            categoryId: "",
            brandId: "",
        });
        searchProducts();
    };

    return (
        <>
            <FreshNav />
            <div className="min-h-screen bg-gray-50 pt-32">
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Kết quả tìm kiếm
                        </h1>
                        {query && (
                            <p className="text-gray-600">
                                Tìm kiếm cho: <span className="font-semibold">"{query}"</span>
                                {!loading && (
                                    <span className="ml-2 text-emerald-600">
                                        ({products.length} sản phẩm)
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        <aside className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Filter className="h-5 w-5" />
                                        Bộ lọc
                                    </h2>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-emerald-600 hover:underline"
                                    >
                                        Xóa
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">
                                            Khoảng giá
                                        </h3>
                                        <div className="space-y-3">
                                            <input
                                                type="number"
                                                placeholder="Giá thấp nhất"
                                                value={filters.minPrice}
                                                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Giá cao nhất"
                                                value={filters.maxPrice}
                                                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={applyFilters}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition"
                                    >
                                        Áp dụng bộ lọc
                                    </button>
                                </div>
                            </div>
                        </aside>

                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
                                    <p className="text-gray-600 mt-4">Đang tìm kiếm...</p>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                                    <p className="text-red-600 font-semibold">{error}</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Không tìm thấy sản phẩm
                                    </h3>
                                    <p className="text-gray-600">
                                        Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
