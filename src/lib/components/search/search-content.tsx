"use client";

import ProductCard from "@/lib/components/common/product-card";
import Footer from "@/lib/components/landing-page/footer/footer";
import FreshNav from "@/lib/components/landing-page/header/header-nav";
import { Product } from "@/lib/interface/product";
import { brandService } from "@/lib/service/brand.service";
import { categoryService } from "@/lib/service/category.service";
import { productService } from "@/lib/service/product.service";
import { Filter, Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
    const [sortBy, setSortBy] = useState<"relevance" | "priceAsc" | "priceDesc" | "newest">("relevance");

    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        categoryId: "",
        brandId: "",
    });

    const hasAnyFilter = useMemo(
        () => Boolean(filters.minPrice || filters.maxPrice || filters.categoryId || filters.brandId),
        [filters]
    );

    useEffect(() => {
        (async () => {
            try {
                const [cats, brs] = await Promise.all([
                    categoryService.getAllCategories(),
                    brandService.getAllBrands(),
                ]);
                setCategories(cats);
                setBrands(brs);
            } catch (err) {
                console.error("Failed to fetch categories/brands", err);
            }
        })();
    }, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                sortBy: sortBy !== "relevance" ? sortBy : undefined,
                limit: 50,
                page: 1,
            });

            setProducts(response.data);
            setTotal(response.total);

        } catch (err: any) {
            setError(err?.message || "Failed to search products");
            setProducts([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            searchProducts();
        } else {
            setProducts([]);
            setTotal(0);
            setError(null);
        }
    }, [query, searchProducts]);


    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        searchProducts();
    };

    const clearFilters = () => {
        setFilters({ minPrice: "", maxPrice: "", categoryId: "", brandId: "" });
        setTimeout(searchProducts, 0);
    };

    const onPressEnterApply: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") applyFilters();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <FreshNav />

            <div className="pt-32 pb-16">
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Kết quả tìm kiếm</h1>
                        {query ? (
                            <p className="text-gray-600 text-lg">
                                Tìm kiếm cho: <span className="font-semibold text-emerald-600">"{query}"</span>
                                {!loading && <span className="ml-2 text-gray-500">({total} sản phẩm)</span>}
                            </p>
                        ) : (
                            <p className="text-gray-600 text-lg">Hãy nhập từ khóa ở thanh tìm kiếm để bắt đầu.</p>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        <aside className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Filter className="h-5 w-5 text-emerald-600" /> Bộ lọc
                                    </h2>
                                    {hasAnyFilter && (
                                        <button onClick={clearFilters} className="text-sm text-emerald-600 hover:underline font-semibold">
                                            Xóa bộ lọc
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Khoảng giá (₫)</h3>
                                        <div className="space-y-3">
                                            <input
                                                type="number"
                                                min={0}
                                                placeholder="Giá thấp nhất"
                                                value={filters.minPrice}
                                                onKeyDown={onPressEnterApply}
                                                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                            />
                                            <input
                                                type="number"
                                                min={0}
                                                placeholder="Giá cao nhất"
                                                value={filters.maxPrice}
                                                onKeyDown={onPressEnterApply}
                                                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Danh mục</h3>
                                        <select
                                            value={filters.categoryId}
                                            onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                        >
                                            <option value="">Tất cả</option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Thương hiệu</h3>
                                        <select
                                            value={filters.brandId}
                                            onChange={(e) => handleFilterChange("brandId", e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                        >
                                            <option value="">Tất cả</option>
                                            {brands.map((b) => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-3 pt-1">
                                        <button
                                            onClick={applyFilters}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                                        >
                                            <SearchIcon className="h-4 w-4" /> Áp dụng
                                        </button>
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section className="lg:col-span-3">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                                <p className="text-gray-600">
                                    {!loading ? (
                                        <>Tìm thấy <span className="font-semibold text-gray-900">{total}</span> sản phẩm</>
                                    ) : (
                                        <>Đang tìm kiếm...</>
                                    )}
                                </p>

                                <div className="flex items-center gap-2">
                                    <label htmlFor="sort" className="text-sm text-gray-600">Sắp xếp:</label>
                                    <select
                                        id="sort"
                                        value={sortBy}
                                        onChange={(e) => {
                                            const v = e.target.value as typeof sortBy;
                                            setSortBy(v);
                                            searchProducts();
                                        }}
                                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                                    >
                                        <option value="relevance">Liên quan nhất</option>
                                        <option value="newest">Mới nhất</option>
                                        <option value="priceAsc">Giá: Thấp → Cao</option>
                                        <option value="priceDesc">Giá: Cao → Thấp</option>
                                    </select>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
                            )}

                            {!loading && !error && query && products.length === 0 && (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                                    <SearchIcon className="h-10 w-10 text-gray-400 mb-3" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Không tìm thấy sản phẩm phù hợp</h3>
                                    <p className="text-gray-600">Hãy thử từ khóa khác hoặc điều chỉnh lại bộ lọc.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {loading
                                    ? Array.from({ length: 8 }).map((_, i) => (
                                        <div key={`skeleton-${i}`} className="animate-pulse rounded-xl bg-white p-3 shadow-sm">
                                            <div className="aspect-[4/3] w-full rounded-lg bg-gray-200" />
                                            <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                                            <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                                            <div className="mt-4 h-9 w-full rounded bg-gray-200" />
                                        </div>
                                    ))
                                    : products.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>

                            {!loading && products.length > 0 && (
                                <p className="mt-6 text-sm text-gray-500">Hiển thị {products.length} / {total} sản phẩm.</p>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
