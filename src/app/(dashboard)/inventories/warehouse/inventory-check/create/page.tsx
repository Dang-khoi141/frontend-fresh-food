"use client";

import useFetchProducts from "@/lib/hooks/useFetchProducts";
import { useFetchWarehouse } from "@/lib/hooks/useFetchWarehouse";
import { useFetchInventoryCheck } from "@/lib/hooks/useFetchInventoryCheck";
import { Product } from "@/lib/interface/product";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber, Select, Spin, Table } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Info, Store } from "lucide-react";
import { ProductSelectionModal } from "@/lib/components/stock-in/product-select";
import { inventoryService } from "@/lib/service/inventory.service";
import toast from "react-hot-toast";
import { CheckItem } from "../../../../../../lib/interface/inventory-check";

export default function CreateInventoryCheckPage() {
    const router = useRouter();
    const { warehouses, loading: loadingWarehouses, refetch: loadWarehouses } = useFetchWarehouse();
    const { products, loading: loadingProducts, fetchProducts } = useFetchProducts();
    const { create } = useFetchInventoryCheck();

    const [form] = Form.useForm();
    const [rows, setRows] = useState<CheckItem[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");

    const [productModalOpen, setProductModalOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 768;
            setIsPortrait(portrait);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    useEffect(() => {
        loadWarehouses();
        fetchProducts();
    }, []);

    const handleAddProducts = async () => {
        if (selectedProducts.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm");
            return;
        }

        try {
            setSubmitting(true);

            const newItemsPromises = selectedProducts.map(async (product) => {
                let systemQuantity = 0;
                try {
                    systemQuantity = await inventoryService.getStock(product.id);
                } catch (error) {
                    console.error(`Không thể lấy stock cho sản phẩm ${product.name}:`, error);
                    systemQuantity = 0;
                }

                return {
                    key: `${product.id}-${Date.now()}-${Math.random()}`,
                    productId: product.id,
                    productName: product.name,
                    systemQuantity: systemQuantity,
                    actualQuantity: 0,
                };
            });

            const newItems = await Promise.all(newItemsPromises);

            setRows([...rows, ...newItems]);
            setSelectedProducts([]);
            setProductModalOpen(false);
            toast.success(`Đã thêm ${newItems.length} sản phẩm`);
        } catch (error) {
            console.error("Error adding products:", error);
            toast.error("Có lỗi khi thêm sản phẩm");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveRow = (key: string) => {
        setRows(rows.filter((r) => r.key !== key));
        toast.success("Đã xóa sản phẩm");
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (!values.warehouseId) {
                return toast.error("Vui lòng chọn kho kiểm hàng");
            }

            const items = rows
                .filter((r) => r.productId)
                .map((r) => ({
                    productId: r.productId!,
                    systemQuantity: r.systemQuantity,
                    actualQuantity: r.actualQuantity,
                }));

            if (items.length === 0) {
                return toast.error("Vui lòng thêm sản phẩm");
            }

            setSubmitting(true);

            const dto = {
                warehouseId: values.warehouseId,
                items: items,
            };

            await create(dto);

            toast.success("Tạo phiếu kiểm kho thành công!");
            router.push("/inventories/warehouse/inventory-check");
        } catch (err: any) {
            console.error("Error creating check:", err);
            const errorMessage = err.response?.data?.message || err.message || "Không thể tạo phiếu kiểm kho";

            if (Array.isArray(errorMessage)) {
                toast.error(errorMessage.join(", "));
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const selectedWarehouseName = warehouses.find(w => w.id === selectedWarehouseId)?.name || "";

    const columns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "productId",
            width: "35%",
            render: (_: any, record: CheckItem) => {
                const selectedProduct = products?.find(p => p.id === record.productId);
                return (
                    <div className="flex items-center gap-3">
                        {selectedProduct?.image && (
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-slate-800">
                                {selectedProduct?.name || record.productName}
                            </div>
                            <div className="text-xs text-slate-500">Mã: {record.productId?.substring(0, 8)}...</div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Tồn trước",
            dataIndex: "systemQuantity",
            width: "15%",
            align: "center" as const,
            render: (systemQuantity: number) => (
                <div className="text-base font-semibold text-slate-600">
                    {systemQuantity}
                </div>
            ),
        },
        {
            title: "Thực tế",
            dataIndex: "actualQuantity",
            width: "20%",
            align: "center" as const,
            render: (_: any, record: CheckItem, index: number) => (
                <InputNumber
                    min={0}
                    size="large"
                    className="w-full font-medium"
                    value={record.actualQuantity}
                    placeholder="0"
                    onChange={(value) => {
                        const updated = [...rows];
                        updated[index].actualQuantity = value ?? 0;
                        setRows(updated);
                    }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                />
            ),
        },
        {
            title: "Chênh lệch",
            key: "variance",
            width: "15%",
            align: "center" as const,
            render: (_: any, record: CheckItem) => {
                const variance = record.actualQuantity - record.systemQuantity;
                let colorClass = "text-slate-400";
                if (variance > 0) colorClass = "text-emerald-600";
                if (variance < 0) colorClass = "text-red-500";

                return (
                    <span className={`text-base font-bold ${colorClass}`}>
                        {variance > 0 ? `+${variance}` : variance}
                    </span>
                );
            },
        },
        {
            title: "",
            width: "10%",
            align: "center" as const,
            render: (_: any, record: CheckItem) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveRow(record.key)}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-red-50"
                />
            ),
        },
    ];

    const totalSystemQuantity = rows.reduce((sum, r) => sum + (r.systemQuantity ?? 0), 0);
    const totalActualQuantity = rows.reduce((sum, r) => sum + (r.actualQuantity ?? 0), 0);
    const totalVariance = totalActualQuantity - totalSystemQuantity;

    if (isPortrait) {
        return (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 p-5 text-white">
                <style>
                    {`
                        @keyframes rotatePhone {
                            0%, 10% { transform: rotate(0deg); }
                            40%, 60% { transform: rotate(-90deg); }
                            90%, 100% { transform: rotate(0deg); }
                        }
                    `}
                </style>

                <div
                    className="relative mb-8 h-[110px] w-[64px] rounded-xl border-[3px] border-amber-500"
                    style={{ animation: 'rotatePhone 2.5s infinite ease-in-out' }}
                >
                    <div className="absolute left-1/2 top-2.5 h-0.5 w-5 -translate-x-1/2 rounded-sm bg-amber-500" />

                    <div className="absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-amber-500" />
                </div>

                <h3 className="mb-3 text-center text-lg font-semibold text-slate-50">
                    Vui lòng xoay ngang thiết bị
                </h3>

                <p className="max-w-[300px] text-center text-sm leading-relaxed text-slate-400">
                    Để có trải nghiệm tốt nhất và nhập liệu chính xác, vui lòng xoay ngang điện thoại của bạn.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 pb-20 sm:p-6">
            <div className="mx-auto mb-6 max-w-[1400px]">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="hover:text-slate-800">Kho</span>
                    <span>›</span>
                    <span
                        className="cursor-pointer hover:text-slate-800 hover:underline"
                        onClick={() => router.push("/inventories/warehouse/inventory-check")}
                    >
                        Kiểm kho
                    </span>
                    <span>›</span>
                    <span className="font-medium text-slate-800">
                        Tạo phiếu mới
                    </span>
                </div>
            </div>

            <div className="mx-auto mb-6 max-w-[1400px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            icon={<ArrowLeft size={20} className="text-slate-600" />}
                            onClick={() => router.back()}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Tạo phiếu kiểm kho
                            </h1>
                            <p className="text-sm text-slate-500">
                                Nhập số lượng thực tế để cân bằng kho
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Spin spinning={submitting || loadingProducts}>
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                            <div className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                                <Store size={18} className="text-emerald-600" />
                                <span>Thông tin chung</span>
                            </div>

                            <Form form={form} layout="vertical">
                                <Form.Item
                                    name="warehouseId"
                                    label={<span className="font-medium text-slate-700">Kho kiểm hàng</span>}
                                    rules={[{ required: true, message: "Vui lòng chọn kho" }]}
                                    className="mb-0"
                                >
                                    <Select
                                        placeholder="Chọn kho cần kiểm kê"
                                        size="large"
                                        loading={loadingWarehouses}
                                        onChange={(value) => setSelectedWarehouseId(value)}
                                        options={warehouses.map((w) => ({ label: w.name, value: w.id }))}
                                        className="w-full"
                                    />
                                </Form.Item>
                            </Form>

                            <div className="mt-4 flex items-start gap-3 rounded-lg border border-sky-100 bg-sky-50 p-4">
                                <Info size={20} className="mt-0.5 shrink-0 text-sky-500" />
                                <p className="text-sm leading-relaxed text-sky-700">
                                    <span className="font-semibold">Lưu ý:</span> Số lượng "Tồn trước" sẽ được tự động đồng bộ từ hệ thống ngay tại thời điểm bạn chọn sản phẩm vào phiếu.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                            <div className="border-b border-slate-100 p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Danh sách sản phẩm
                                        </h3>
                                        {selectedWarehouseName && (
                                            <p className="mt-1 text-sm text-slate-500">
                                                Đang kiểm kho: <span className="font-medium text-emerald-600">{selectedWarehouseName}</span>
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<Plus size={18} />}
                                        onClick={() => setProductModalOpen(true)}
                                        disabled={!selectedWarehouseId}
                                        className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 shadow-sm hover:!bg-emerald-700 disabled:opacity-50"
                                    >
                                        Thêm sản phẩm
                                    </Button>
                                </div>
                            </div>

                            <div className="p-0">
                                <Table
                                    rowKey="key"
                                    columns={columns}
                                    dataSource={rows}
                                    pagination={false}
                                    scroll={{ x: 800 }}
                                    className="[&_.ant-table-thead_th]:!bg-slate-50 [&_.ant-table-thead_th]:!text-slate-600 [&_.ant-table-thead_th]:!font-semibold"
                                    locale={{
                                        emptyText: (
                                            <div className="py-12 text-center">
                                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                                    <Store className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <div className="text-base font-medium text-slate-600">
                                                    Chưa có sản phẩm
                                                </div>
                                                <div className="mt-1 text-sm text-slate-400">
                                                    {!selectedWarehouseId
                                                        ? "Vui lòng chọn kho ở trên để bắt đầu"
                                                        : "Nhấn 'Thêm sản phẩm' để bắt đầu kiểm kê"
                                                    }
                                                </div>
                                            </div>
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                            <h3 className="mb-5 text-lg font-bold text-slate-800">
                                Tổng kết
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Số lượng hệ thống</span>
                                    <span className="font-semibold text-slate-700">{totalSystemQuantity}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Số lượng thực tế</span>
                                    <span className="font-semibold text-blue-600">{totalActualQuantity}</span>
                                </div>
                                <div className="mt-4 border-t border-slate-100 pt-4">
                                    <div className={`flex items-center justify-between rounded-lg p-3 ${totalVariance === 0 ? 'bg-slate-50' : totalVariance > 0 ? 'bg-emerald-50' : 'bg-red-50'
                                        }`}>
                                        <span className="font-semibold text-slate-700">Chênh lệch</span>
                                        <span className={`text-lg font-bold ${totalVariance === 0 ? 'text-slate-500' : totalVariance > 0 ? 'text-emerald-600' : 'text-red-500'
                                            }`}>
                                            {totalVariance > 0 ? `+${totalVariance}` : totalVariance}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-3">
                                <Button
                                    type="primary"
                                    onClick={handleSubmit}
                                    loading={submitting}
                                    size="large"
                                    className="h-11 w-full rounded-xl bg-emerald-600 text-sm font-semibold shadow-md shadow-emerald-200 hover:!bg-emerald-700"
                                >
                                    Hoàn thành & Cân bằng
                                </Button>
                                <Button
                                    onClick={() => router.back()}
                                    size="large"
                                    className="h-11 w-full rounded-xl border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-800"
                                >
                                    Hủy bỏ
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>

            <ProductSelectionModal
                open={productModalOpen}
                products={products || []}
                selectedProducts={selectedProducts}
                searchText={searchText}
                onSearchChange={setSearchText}
                onSelectionChange={setSelectedProducts}
                onCancel={() => {
                    setProductModalOpen(false);
                    setSelectedProducts([]);
                    setSearchText("");
                }}
                onConfirm={handleAddProducts}
            />
        </div>
    );
}
