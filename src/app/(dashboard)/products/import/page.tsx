"use client";

import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { productService } from "../../../../lib/service/product.service";

export default function ImportProductsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        <div style={{
            padding: isMobile ? '16px' : '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
            <h1 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: 600,
                color: '#059669',
                marginBottom: isMobile ? '20px' : '24px',
                marginTop: 0,
            }}>
                Nhập sản phẩm bằng Excel
            </h1>

            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '12px' : '16px',
                alignItems: isMobile ? 'stretch' : 'center',
            }}>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: isMobile ? '12px' : '10px 12px',
                        background: '#f8fafc',
                        fontSize: isMobile ? '14px' : '13px',
                        cursor: 'pointer',
                        width: isMobile ? '100%' : 'auto',
                    }}
                />

                <button
                    onClick={handleImport}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        borderRadius: '8px',
                        padding: isMobile ? '14px 20px' : '10px 20px',
                        color: 'white',
                        background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        border: 'none',
                        fontSize: isMobile ? '15px' : '14px',
                        fontWeight: 500,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        width: isMobile ? '100%' : 'auto',
                        minHeight: isMobile ? '48px' : '40px',
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <Upload size={isMobile ? 20 : 18} />
                    <span>{loading ? "Đang nhập..." : "Nhập Excel"}</span>
                </button>
            </div>

            {file && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#059669',
                    border: '1px solid #d1fae5',
                }}>
                    <strong>File selected:</strong> {file.name}
                </div>
            )}

            <div style={{
                marginTop: '24px',
                padding: isMobile ? '16px' : '20px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
            }}>
                <h3 style={{
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginTop: 0,
                    marginBottom: '12px',
                }}>
                    Hướng dẫn
                </h3>
                <ul style={{
                    fontSize: isMobile ? '13px' : '14px',
                    color: '#64748b',
                    lineHeight: '1.8',
                    paddingLeft: isMobile ? '20px' : '24px',
                    margin: 0,
                }}>
                    <li>File Excel phải có định dạng .xlsx hoặc .xls</li>
                    <li>Đảm bảo các cột dữ liệu đúng định dạng</li>
                    <li>Kiểm tra kỹ thông tin trước khi nhập</li>
                    <li>Hệ thống sẽ tự động validate dữ liệu</li>
                </ul>
            </div>
        </div>
    );
}
