"use client";

import { PageHeader } from "@/lib/components/stock-in/page-header";
import { SearchBar } from "@/lib/components/stock-in/search-bar";
import { useFetchInventoryCheck } from "@/lib/hooks/useFetchInventoryCheck";
import useFetchProducts from "@/lib/hooks/useFetchProducts";
import { InventoryCheck } from "@/lib/interface/inventory-check";
import { Button, Descriptions, Modal, Spin, Table, Tag } from "antd";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function InventoryCheckPage() {
    const router = useRouter();
    const { checks, loading, fetchAll } = useFetchInventoryCheck();
    const { products, loading: loadingProducts, fetchProducts } = useFetchProducts();
    const [filteredData, setFilteredData] = useState<InventoryCheck[]>([]);
    const [searchText, setSearchText] = useState("");
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

    useEffect(() => {
        loadChecks();
        fetchProducts();
    }, []);

    const loadChecks = async () => {
        try {
            await fetchAll();
        } catch {
            toast.error("Không thể tải danh sách kiểm kho");
        }
    };

    useEffect(() => {
        const mappedChecks = checks.map(check => ({
            ...check,
            warehouseName: (check as any).warehouse?.name || check.warehouseName || '-'
        }));

        const sortedChecks = [...mappedChecks].sort((a, b) => {
            const dateA = new Date((a as any).updatedAt || a.checkDate || 0).getTime();
            const dateB = new Date((b as any).updatedAt || b.checkDate || 0).getTime();
            return dateB - dateA;
        });

        setFilteredData(sortedChecks);
    }, [checks]);

    const handleSearch = (value: string) => {
        setSearchText(value);
        if (!value.trim()) {
            const mappedChecks = checks.map(check => ({
                ...check,
                warehouseName: (check as any).warehouse?.name || check.warehouseName || '-'
            }));

            const sortedChecks = [...mappedChecks].sort((a, b) => {
                const dateA = new Date((a as any).updatedAt || a.checkDate || 0).getTime();
                const dateB = new Date((b as any).updatedAt || b.checkDate || 0).getTime();
                return dateB - dateA;
            });

            setFilteredData(sortedChecks);
            return;
        }

        const mappedChecks = checks.map(check => ({
            ...check,
            warehouseName: (check as any).warehouse?.name || check.warehouseName || '-'
        }));

        const filtered = mappedChecks.filter((c) => {
            const searchLower = value.toLowerCase();
            return (
                c.id.toLowerCase().includes(searchLower) ||
                c.warehouseName?.toLowerCase().includes(searchLower) ||
                c.checkedBy?.toLowerCase().includes(searchLower)
            );
        });

        const sortedFiltered = [...filtered].sort((a, b) => {
            const dateA = new Date((a as any).updatedAt || a.checkDate || 0).getTime();
            const dateB = new Date((b as any).updatedAt || b.checkDate || 0).getTime();
            return dateB - dateA;
        });

        setFilteredData(sortedFiltered);
    };

    const handleExport = () => {
        const headers = [
            'Mã phiếu kiểm kho',
            'Kho kiểm hàng',
            'Số lượng sản phẩm',
            'SL thực tế',
            'Chênh lệch',
            'Ngày kiểm',
            'Nhân viên kiểm'
        ];

        const rows = filteredData.map(check => {
            const totalActual = check.details?.reduce(
                (sum, item) => sum + (item.actualQuantity || 0),
                0
            ) ?? 0;
            const variance = check.details?.reduce(
                (sum, item) => sum + (item.variance || 0),
                0
            ) ?? 0;

            return [
                check.id,
                check.warehouseName || '-',
                check.details?.length ?? 0,
                totalActual,
                variance,
                check.checkDate ? new Date(check.checkDate).toLocaleDateString("vi-VN") : '-',
                check.checkedBy || '-'
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(',')),
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `phieu_kiem_kho_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Đã xuất file Excel thành công!');
    };

    const expandedRowRender = (record: InventoryCheck) => {
        return (
            <div style={{ padding: '16px 24px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px',
                    marginBottom: '24px'
                }}>
                    <div>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#1e293b',
                            marginBottom: '12px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid #e2e8f0'
                        }}>
                            Thông tin tạo phiếu
                        </div>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item
                                label={<span style={{ color: '#64748b', fontSize: '13px' }}>Nhân viên tạo:</span>}
                            >
                                <span style={{ color: '#0ea5e9', fontWeight: 500 }}>
                                    {record.checkedBy || '-'}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<span style={{ color: '#64748b', fontSize: '13px' }}>Ngày tạo:</span>}
                            >
                                <span style={{ fontWeight: 500 }}>
                                    {record.checkDate
                                        ? new Date(record.checkDate).toLocaleString("vi-VN", {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : '-'
                                    }
                                </span>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <div>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#1e293b',
                            marginBottom: '12px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid #e2e8f0'
                        }}>
                            Thông tin cập nhật
                        </div>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item
                                label={<span style={{ color: '#64748b', fontSize: '13px' }}>Nhân viên cập nhật:</span>}
                            >
                                <span style={{ color: '#0ea5e9', fontWeight: 500 }}>
                                    {(record as any).updatedBy || record.checkedBy || '-'}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<span style={{ color: '#64748b', fontSize: '13px' }}>Ngày cập nhật:</span>}
                            >
                                <span style={{ fontWeight: 500 }}>
                                    {(record as any).updatedAt
                                        ? new Date((record as any).updatedAt).toLocaleString("vi-VN", {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : record.checkDate
                                            ? new Date(record.checkDate).toLocaleString("vi-VN", {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : '-'
                                    }
                                </span>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <div>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#1e293b',
                            marginBottom: '12px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid #e2e8f0'
                        }}>
                            Thông tin cân bằng kho
                        </div>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item
                                label={<span style={{ color: '#64748b', fontSize: '13px' }}>Nhân viên cân bằng kho:</span>}
                            >
                                <span style={{ color: '#0ea5e9', fontWeight: 500 }}>
                                    {record.checkedBy || '-'}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<span style={{ color: '#64748b', fontSize: '13px' }}>Ngày cân bằng kho:</span>}
                            >
                                <span style={{ fontWeight: 500 }}>
                                    {record.checkDate
                                        ? new Date(record.checkDate).toLocaleString("vi-VN", {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : '-'
                                    }
                                </span>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>

                <div>
                    <div style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#1e293b',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>Thông tin sản phẩm</span>
                        <span style={{ color: '#64748b', fontWeight: 400 }}>
                            (SL sản phẩm kiểm: {record.details?.length ?? 0})
                        </span>
                        <span style={{ margin: '0 4px', color: '#cbd5e1' }}>|</span>
                        <span style={{ color: '#64748b', fontWeight: 400 }}>
                            Kho kiểm hàng: {record.warehouseName || 'Kho mặc định'}
                        </span>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                color: '#64748b',
                                cursor: 'pointer'
                            }}>
                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                Chỉ xem những sản phẩm có chênh lệch
                            </label>
                        </div>
                    </div>

                    <Table
                        size="small"
                        pagination={false}
                        dataSource={record.details}
                        rowKey={(item) => (item as any).id || (item as any).productId || Math.random()}
                        style={{
                            background: 'white',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}
                        columns={[
                            {
                                title: 'Tên sản phẩm',
                                key: 'product',
                                width: '30%',
                                render: (_, item: any) => {
                                    const product = item.product;
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {product?.image && (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
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
                                                    {product?.name || item.productName || 'Sản phẩm'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            },
                            {
                                title: 'Tồn trước kiểm',
                                dataIndex: 'expectedQuantity',
                                key: 'expectedQuantity',
                                width: 120,
                                align: 'center' as const,
                                render: (val, item: any) => (
                                    <span style={{ fontWeight: 500 }}>{val ?? item.systemQuantity ?? 0}</span>
                                )
                            },
                            {
                                title: 'SL thực tế',
                                dataIndex: 'actualQuantity',
                                key: 'actualQuantity',
                                width: 100,
                                align: 'center' as const,
                                render: (val) => (
                                    <span style={{ fontWeight: 600, color: '#0284c7' }}>{val ?? 0}</span>
                                )
                            },
                            {
                                title: 'Chênh lệch',
                                dataIndex: 'variance',
                                key: 'variance',
                                width: 100,
                                align: 'center' as const,
                                render: (val) => {
                                    const variance = val ?? 0;
                                    return (
                                        <span style={{
                                            fontWeight: 600,
                                            color: variance === 0
                                                ? "#64748b"
                                                : variance > 0
                                                    ? "#059669"
                                                    : "#ef4444"
                                        }}>
                                            {variance > 0 ? `+${variance}` : variance}
                                        </span>
                                    );
                                }
                            },
                            {
                                title: 'Lý do',
                                dataIndex: 'reason',
                                key: 'reason',
                                width: 120,
                                render: (text) => (
                                    <span style={{ color: '#64748b' }}>{text || '---'}</span>
                                )
                            }
                        ]}
                    />
                </div>
            </div>
        );
    };

    const columns = [
        {
            title: "Mã phiếu kiểm kho",
            dataIndex: "id",
            key: "id",
            width: 200,
            render: (text: string) => (
                <span style={{ fontWeight: 600, color: '#059669' }}>{text}</span>
            ),
        },
        {
            title: "Kho kiểm hàng",
            dataIndex: "warehouseName",
            key: "warehouseName",
            width: 200,
            render: (text: string) => (
                <span style={{ fontWeight: 500 }}>{text || "-"}</span>
            ),
        },
        {
            title: "Số lượng sản phẩm",
            key: "productCount",
            align: "center" as const,
            width: 150,
            render: (_: any, record: InventoryCheck) => (
                <Tag
                    style={{
                        background: '#f0f9ff',
                        color: '#0284c7',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        fontSize: '13px',
                        fontWeight: 500,
                    }}
                >
                    {record.details?.length ?? 0} sản phẩm
                </Tag>
            ),
        },
        {
            title: "SL thực tế",
            key: "actualQuantity",
            align: "center" as const,
            width: 120,
            render: (_: any, record: InventoryCheck) => {
                const total = record.details?.reduce(
                    (sum, item) => sum + (item.actualQuantity || 0),
                    0
                ) ?? 0;
                return <span style={{ fontWeight: 600 }}>{total}</span>;
            },
        },
        {
            title: "Chênh lệch",
            key: "variance",
            align: "center" as const,
            width: 120,
            render: (_: any, record: InventoryCheck) => {
                const variance = record.details?.reduce(
                    (sum, item) => sum + (item.variance || 0),
                    0
                ) ?? 0;

                return (
                    <span
                        style={{
                            fontWeight: 600,
                            color: variance === 0
                                ? "#64748b"
                                : variance > 0
                                    ? "#059669"
                                    : "#ef4444"
                        }}
                    >
                        {variance > 0 ? `+${variance}` : variance}
                    </span>
                );
            },
        },
        {
            title: "Ngày kiểm",
            dataIndex: "checkDate",
            key: "checkDate",
            width: 150,
            render: (d: string) => (
                <span style={{ color: '#64748b' }}>
                    {d ? new Date(d).toLocaleDateString("vi-VN") : "-"}
                </span>
            ),
        },
        {
            title: "Nhân viên kiểm",
            dataIndex: "checkedBy",
            key: "checkedBy",
            width: 150,
            render: (t: string) => (
                <span style={{ color: '#64748b' }}>{t || "-"}</span>
            ),
        },
        {
            title: "Trạng thái kho",
            key: "status",
            width: 150,
            align: "center" as const,
            render: () => (
                <Tag
                    icon={
                        <div
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#059669',
                                display: 'inline-block',
                                marginRight: '6px',
                            }}
                        />
                    }
                    style={{
                        background: '#f0fdf4',
                        color: '#059669',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        fontSize: '13px',
                        fontWeight: 500,
                    }}
                >
                    Đã kiểm kho
                </Tag>
            ),
        },
    ];

    return (
        <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
            <div style={{ marginBottom: "20px" }}>
                <span style={{ color: "#94a3b8", fontSize: "14px" }}>Kho</span>
                <span style={{ color: "#94a3b8", margin: "0 8px" }}>›</span>
                <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: 500 }}>
                    Kiểm kho
                </span>
            </div>

            <PageHeader
                title="Quản lý thông tin kiểm kho"
                onRefresh={loadChecks}
                onExport={handleExport}
                onCreateNew={() => router.push("/inventories/warehouse/inventory-check/create")}
                showExportExcel={false}
            />

            <SearchBar
                searchText={searchText}
                onSearchChange={handleSearch}
                onFilterClick={() => setFilterModalOpen(true)}
            />

            <div
                style={{
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
                    overflow: "hidden",
                }}
            >
                <Spin spinning={loading || loadingProducts}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={filteredData}
                        expandable={{
                            expandedRowRender,
                            expandedRowKeys,
                            onExpand: (expanded, record) => {
                                setExpandedRowKeys(expanded ? [record.id] : []);
                            },
                            expandRowByClick: true,
                        }}
                        pagination={{
                            position: ["bottomCenter"],
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50", "100"],
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} trong số ${total} dòng`,
                            style: { marginBottom: "16px" },
                        }}
                        scroll={{ x: 1200 }}
                        locale={{
                            emptyText: (
                                <div style={{ padding: "60px 0", textAlign: "center" }}>
                                    <div
                                        style={{
                                            display: "inline-flex",
                                            padding: "20px",
                                            background: "#f0fdf4",
                                            borderRadius: "50%",
                                            marginBottom: "16px",
                                        }}
                                    >
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#059669"
                                            strokeWidth="2"
                                        >
                                            <path d="M9 11l3 3L22 4" />
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                        </svg>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: 500,
                                            color: "#1e293b",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Bạn chưa có phiếu kiểm kho nào
                                    </div>
                                    <div style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
                                        Hãy tạo phiếu kiểm kho đầu tiên của bạn
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<Plus size={16} />}
                                        onClick={() => router.push("/inventories/warehouse/inventory-check/create")}
                                        style={{
                                            borderRadius: "8px",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            height: "40px",
                                            background: "#059669",
                                            border: "none",
                                        }}
                                    >
                                        Tạo mới phiếu kiểm kho
                                    </Button>
                                </div>
                            ),
                        }}
                    />
                </Spin>
            </div>

            <Modal
                title="Bộ lọc nâng cao"
                open={filterModalOpen}
                onCancel={() => setFilterModalOpen(false)}
                footer={[
                    <Button key="reset" onClick={() => handleSearch("")}>
                        Đặt lại
                    </Button>,
                    <Button
                        key="apply"
                        type="primary"
                        style={{ background: "#059669" }}
                        onClick={() => setFilterModalOpen(false)}
                    >
                        Áp dụng
                    </Button>,
                ]}
            >
                <p style={{ color: "#64748b" }}>
                    Chức năng bộ lọc nâng cao đang được phát triển
                </p>
            </Modal>
        </div>
    );
}
