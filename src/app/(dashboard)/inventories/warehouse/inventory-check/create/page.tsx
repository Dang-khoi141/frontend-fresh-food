"use client";

import useFetchProducts from "@/lib/hooks/useFetchProducts";
import { useFetchWarehouse } from "@/lib/hooks/useFetchWarehouse";
import { useFetchInventoryCheck } from "@/lib/hooks/useFetchInventoryCheck";
import { Product } from "@/lib/interface/product";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber, Select, Spin, Table } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
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

            console.log("Submitting DTO:", JSON.stringify(dto, null, 2));

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
            width: "30%",
            render: (_: any, record: CheckItem) => {
                const selectedProduct = products?.find(p => p.id === record.productId);
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {selectedProduct?.image && (
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                }}
                            />
                        )}
                        <div>
                            <div style={{ fontWeight: 500, color: '#1e293b' }}>
                                {selectedProduct?.name || record.productName}
                            </div>
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
                <div
                    style={{
                        fontWeight: 600,
                        color: '#059669',
                        fontSize: '15px',
                    }}
                >
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
                    style={{ width: "100%" }}
                    value={record.actualQuantity}
                    placeholder="0"
                    onChange={(value) => {
                        const updated = [...rows];
                        updated[index].actualQuantity = value ?? 0;
                        setRows(updated);
                    }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
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
                return (
                    <span
                        style={{
                            fontWeight: 600,
                            fontSize: '15px',
                            color: variance === 0 ? '#64748b' : variance > 0 ? '#059669' : '#ef4444',
                        }}
                    >
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
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                />
            ),
        },
    ];

    const totalSystemQuantity = rows.reduce((sum, r) => sum + (r.systemQuantity ?? 0), 0);
    const totalActualQuantity = rows.reduce((sum, r) => sum + (r.actualQuantity ?? 0), 0);
    const totalVariance = totalActualQuantity - totalSystemQuantity;

    return (
        <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
            <div style={{ marginBottom: "20px" }}>
                <span style={{ color: "#94a3b8", fontSize: "14px" }}>Kho</span>
                <span style={{ color: "#94a3b8", margin: "0 8px" }}>›</span>
                <span
                    style={{
                        color: "#94a3b8",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                    onClick={() => router.push("/inventories/warehouse/inventory-check")}
                >
                    Kiểm kho
                </span>
                <span style={{ color: "#94a3b8", margin: "0 8px" }}>›</span>
                <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: 500 }}>
                    Tạo mới phiếu kiểm kho
                </span>
            </div>

            <div
                style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <Button
                        icon={<ArrowLeft size={20} />}
                        onClick={() => router.back()}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                        }}
                    />
                    <div>
                        <h1
                            style={{
                                fontSize: "24px",
                                fontWeight: 700,
                                color: "#1e293b",
                                margin: 0,
                                marginBottom: "4px",
                            }}
                        >
                            Thông tin kiểm kho
                        </h1>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "#64748b",
                                margin: 0,
                            }}
                        >
                            Số lượng hệ thống sẽ được tự động lấy từ kho
                        </p>
                    </div>
                </div>
            </div>

            <Spin spinning={submitting || loadingProducts}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "20px" }}>
                    <div>
                        <div
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding: "24px",
                                marginBottom: "20px",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    color: "#1e293b",
                                    marginBottom: "20px",
                                }}
                            >
                                Thông tin kiểm kho
                            </h3>
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    name="warehouseId"
                                    label="Kho mặc định"
                                    rules={[{ required: true, message: "Chọn kho kiểm hàng" }]}
                                >
                                    <Select
                                        placeholder="Chọn kho"
                                        size="large"
                                        loading={loadingWarehouses}
                                        onChange={(value) => setSelectedWarehouseId(value)}
                                        options={warehouses.map((w) => ({ label: w.name, value: w.id }))}
                                    />
                                </Form.Item>
                            </Form>

                            <div
                                style={{
                                    marginTop: "16px",
                                    padding: "12px",
                                    background: "#f0f9ff",
                                    borderRadius: "8px",
                                    border: "1px solid #bae6fd",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "#0284c7",
                                        margin: 0,
                                        lineHeight: "1.6",
                                    }}
                                >
                                    <span style={{ fontWeight: 600 }}>Lưu ý:</span> Số lượng "Tồn trước" sẽ được tự động lấy từ hệ thống khi bạn chọn sản phẩm
                                </p>
                            </div>
                        </div>

                        <div
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding: "24px",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "20px",
                                }}
                            >
                                <div>
                                    <h3
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            color: "#1e293b",
                                            margin: 0,
                                        }}
                                    >
                                        Tên sản phẩm
                                    </h3>
                                    {selectedWarehouseName && (
                                        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                                            Kho: <span style={{ fontWeight: 500, color: '#059669' }}>{selectedWarehouseName}</span>
                                        </p>
                                    )}
                                </div>
                                <Button
                                    type="primary"
                                    icon={<Plus size={16} />}
                                    onClick={() => setProductModalOpen(true)}
                                    disabled={!selectedWarehouseId}
                                    style={{
                                        borderRadius: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        background: "#059669",
                                        border: "none",
                                    }}
                                >
                                    Tìm sản phẩm
                                </Button>
                            </div>

                            <Table
                                rowKey="key"
                                columns={columns}
                                dataSource={rows}
                                pagination={false}
                                scroll={{ x: 800 }}
                                locale={{
                                    emptyText: (
                                        <div style={{ padding: "40px 0", textAlign: "center" }}>
                                            <div style={{ fontSize: "14px", color: "#94a3b8" }}>
                                                Chưa có sản phẩm nào được chọn
                                            </div>
                                            <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "8px" }}>
                                                {!selectedWarehouseId
                                                    ? "Vui lòng chọn kho trước khi thêm sản phẩm"
                                                    : "Nhấn nút \"Tìm sản phẩm\" để bắt đầu"
                                                }
                                            </div>
                                        </div>
                                    ),
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <div
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding: "24px",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
                                position: "sticky",
                                top: "24px",
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    color: "#1e293b",
                                    marginBottom: "20px",
                                }}
                            >
                                Tổng tồn kho
                            </h3>

                            <div style={{ marginBottom: '20px' }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "12px 16px",
                                        marginBottom: "8px",
                                    }}
                                >
                                    <span style={{ color: "#64748b" }}>Trước kiểm:</span>
                                    <span style={{ fontWeight: 600, fontSize: '16px' }}>{totalSystemQuantity}</span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "12px 16px",
                                        marginBottom: "8px",
                                    }}
                                >
                                    <span style={{ color: "#64748b" }}>Thực tế:</span>
                                    <span style={{ fontWeight: 600, fontSize: '16px', color: '#3b82f6' }}>{totalActualQuantity}</span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "16px",
                                        background: totalVariance === 0 ? '#f8fafc' : totalVariance > 0 ? '#f0fdf4' : '#fef2f2',
                                        borderRadius: "8px",
                                        borderTop: '2px solid #e2e8f0',
                                    }}
                                >
                                    <span style={{ fontWeight: 600, color: "#1e293b" }}>Chênh lệch:</span>
                                    <span
                                        style={{
                                            fontWeight: 700,
                                            fontSize: "18px",
                                            color: totalVariance === 0 ? '#64748b' : totalVariance > 0 ? '#059669' : '#ef4444',
                                        }}
                                    >
                                        {totalVariance > 0 ? `+${totalVariance}` : totalVariance}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "12px", marginTop: '24px' }}>
                                <Button
                                    onClick={() => router.back()}
                                    style={{
                                        flex: 1,
                                        height: "44px",
                                        borderRadius: "8px",
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleSubmit}
                                    loading={submitting}
                                    style={{
                                        flex: 1,
                                        height: "44px",
                                        borderRadius: "8px",
                                        background: "#059669",
                                        border: "none",
                                    }}
                                >
                                    Lưu và cân bằng kho
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
