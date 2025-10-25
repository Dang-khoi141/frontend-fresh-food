"use client";


import { Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { productService } from "../../../../lib/service/product.service";

export default function ImportProductsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImport = async () => {
        if (!file) return toast.error("Vui lòng chọn file Excel!");

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
            const res = await productService.importProducts(formData);

            if (res?.data?.importedCount) {
                toast.success(`Nhập thành công ${res.data.importedCount} sản phẩm!`);
            } else {
                toast.success("Nhập sản phẩm thành công!");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Lỗi khi nhập sản phẩm!");
        } finally {
            setLoading(false);
            setFile(null);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-soft">
            <h1 className="text-2xl font-semibold text-brand mb-6">
                Nhập sản phẩm bằng Excel
            </h1>
            <div className="flex items-center space-x-4">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-grayLight"
                />
                <button
                    onClick={handleImport}
                    disabled={loading}
                    className={`flex items-center space-x-2 rounded-lg px-5 py-2 text-white transition-all duration-200 ${loading
                        ? "bg-gray-400"
                        : "bg-brand hover:bg-green-700"
                        }`}
                >
                    <Upload size={18} />
                    <span>{loading ? "Đang nhập..." : "Nhập Excel"}</span>
                </button>
            </div>
        </div>
    );
}
