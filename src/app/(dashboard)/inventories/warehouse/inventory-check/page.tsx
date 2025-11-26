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

    const sortChecks = (data: any[]) => {
        return [...data].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.checkDate || a.updatedAt || 0).getTime();
            const dateB = new Date(b.createdAt || b.checkDate || b.updatedAt || 0).getTime();
            return dateB - dateA;
        });
    };

    useEffect(() => {
        const mappedChecks = checks.map(check => ({
            ...check,
            warehouseName: (check as any).warehouse?.name || check.warehouseName || '-'
        }));

        setFilteredData(sortChecks(mappedChecks));
    }, [checks]);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const mappedChecks = checks.map(check => ({
            ...check,
            warehouseName: (check as any).warehouse?.name || check.warehouseName || '-'
        }));

        if (!value.trim()) {
            setFilteredData(sortChecks(mappedChecks));
            return;
        }

        const filtered = mappedChecks.filter((c) => {
            const searchLower = value.toLowerCase();
            return (
                c.id.toLowerCase().includes(searchLower) ||
                c.warehouseName?.toLowerCase().includes(searchLower) ||
                c.checkedBy?.toLowerCase().includes(searchLower)
            );
        });

        setFilteredData(sortChecks(filtered));
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
            <div className="rounded-lg bg-slate-50 p-3 sm:p-4 md:p-6">
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                    <div className="rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-100 sm:bg-transparent sm:p-0 sm:shadow-none sm:ring-0">
                        <div className="mb-2 border-b border-slate-100 pb-2 text-[13px] font-semibold text-slate-800 sm:border-slate-200">
                            Thông tin tạo phiếu
                        </div>
                        <Descriptions column={1} size="small" className="[&_.ant-descriptions-item-label]:text-xs [&_.ant-descriptions-item-content]:text-[13px]">
                            <Descriptions.Item
                                label={<span className="text-slate-500">Nhân viên tạo</span>}
                            >
                                <span className="font-medium text-sky-600">
                                    {record.checkedBy || '-'}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<span className="text-slate-500">Ngày tạo</span>}
                            >
                                <span className="font-medium text-slate-700">
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

                    <div className="rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-100 sm:bg-transparent sm:p-0 sm:shadow-none sm:ring-0">
                        <div className="mb-2 border-b border-slate-100 pb-2 text-[13px] font-semibold text-slate-800 sm:border-slate-200">
                            Thông tin cập nhật
                        </div>
                        <Descriptions column={1} size="small" className="[&_.ant-descriptions-item-label]:text-xs [&_.ant-descriptions-item-content]:text-[13px]">
                            <Descriptions.Item
                                label={<span className="text-slate-500">Người cập nhật</span>}
                            >
                                <span className="font-medium text-sky-600">
                                    {(record as any).updatedBy || record.checkedBy || '-'}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<span className="text-slate-500">Thời gian</span>}
                            >
                                <span className="font-medium text-slate-700">
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

                    <div className="rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-100 sm:bg-transparent sm:p-0 sm:shadow-none sm:ring-0">
                        <div className="mb-2 border-b border-slate-100 pb-2 text-[13px] font-semibold text-slate-800 sm:border-slate-200">
                            Thông tin cân bằng
                        </div>
                        <Descriptions column={1} size="small" className="[&_.ant-descriptions-item-label]:text-xs [&_.ant-descriptions-item-content]:text-[13px]">
                            <Descriptions.Item
                                label={<span className="text-slate-500">Người cân bằng</span>}
                            >
                                <span className="font-medium text-sky-600">
                                    {record.checkedBy || '-'}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<span className="text-slate-500">Ngày cân bằng</span>}
                            >
                                <span className="font-medium text-slate-700">
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
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-slate-800">
                        <span>Chi tiết sản phẩm</span>
                        <span className="font-normal text-slate-500">
                            ({record.details?.length ?? 0} SP)
                        </span>
                        <span className="mx-1 hidden text-slate-300 sm:inline">|</span>
                        <span className="hidden font-normal text-slate-500 sm:inline">
                            Kho: {record.warehouseName || 'Kho mặc định'}
                        </span>
                    </div>

                    <Table
                        size="small"
                        pagination={false}
                        dataSource={record.details}
                        rowKey={(item) => (item as any).id || (item as any).productId || Math.random()}
                        className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                        scroll={{ x: 600 }}
                        columns={[
                            {
                                title: 'Sản phẩm',
                                key: 'product',
                                width: 250,
                                render: (_, item: any) => {
                                    const product = item.product;
                                    return (
                                        <div className="flex items-center gap-3">
                                            {product?.image && (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-10 w-10 flex-shrink-0 rounded-lg border border-slate-200 object-cover"
                                                />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-medium text-slate-800">
                                                    {product?.name || item.productName || 'Sản phẩm'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            },
                            {
                                title: 'Tồn kho',
                                dataIndex: 'expectedQuantity',
                                key: 'expectedQuantity',
                                width: 90,
                                align: 'center' as const,
                                render: (val, item: any) => (
                                    <span className="text-xs font-medium text-slate-600">{val ?? item.systemQuantity ?? 0}</span>
                                )
                            },
                            {
                                title: 'Thực tế',
                                dataIndex: 'actualQuantity',
                                key: 'actualQuantity',
                                width: 90,
                                align: 'center' as const,
                                render: (val) => (
                                    <span className="text-sm font-semibold text-sky-600">{val ?? 0}</span>
                                )
                            },
                            {
                                title: 'Lệch',
                                dataIndex: 'variance',
                                key: 'variance',
                                width: 80,
                                align: 'center' as const,
                                render: (val) => {
                                    const variance = val ?? 0;
                                    let colorClass = "text-slate-400";
                                    if (variance > 0) colorClass = "text-emerald-600";
                                    if (variance < 0) colorClass = "text-red-500";

                                    return (
                                        <span className={`text-sm font-bold ${colorClass}`}>
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
                                    <span className="truncate text-xs text-slate-500">{text || '-'}</span>
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
            title: "Mã phiếu",
            dataIndex: "id",
            key: "id",
            width: 160,
            fixed: 'left' as const,
            render: (text: string) => (
                <span className="font-semibold text-emerald-600">{text}</span>
            ),
        },
        {
            title: "Kho",
            dataIndex: "warehouseName",
            key: "warehouseName",
            width: 180,
            render: (text: string) => (
                <span className="font-medium text-slate-700">{text || "-"}</span>
            ),
        },
        {
            title: "Số lượng",
            key: "productCount",
            align: "center" as const,
            width: 110,
            render: (_: any, record: InventoryCheck) => (
                <Tag className="m-0 rounded border-none bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-600">
                    {record.details?.length ?? 0} SP
                </Tag>
            ),
        },
        {
            title: "Thực tế",
            key: "actualQuantity",
            align: "center" as const,
            width: 100,
            render: (_: any, record: InventoryCheck) => {
                const total = record.details?.reduce(
                    (sum, item) => sum + (item.actualQuantity || 0),
                    0
                ) ?? 0;
                return <span className="font-semibold text-slate-700">{total}</span>;
            },
        },
        {
            title: "Lệch",
            key: "variance",
            align: "center" as const,
            width: 90,
            render: (_: any, record: InventoryCheck) => {
                const variance = record.details?.reduce(
                    (sum, item) => sum + (item.variance || 0),
                    0
                ) ?? 0;

                let colorClass = "text-slate-400";
                if (variance > 0) colorClass = "text-emerald-600";
                if (variance < 0) colorClass = "text-red-500";

                return (
                    <span className={`font-bold ${colorClass}`}>
                        {variance > 0 ? `+${variance}` : variance}
                    </span>
                );
            },
        },
        {
            title: "Ngày kiểm",
            dataIndex: "checkDate",
            key: "checkDate",
            width: 140,
            render: (d: string) => (
                <span className="text-sm text-slate-500">
                    {d ? new Date(d).toLocaleDateString("vi-VN") : "-"}
                </span>
            ),
        },
        {
            title: "Người kiểm",
            dataIndex: "checkedBy",
            key: "checkedBy",
            width: 140,
            render: (t: string) => (
                <span className="text-sm text-slate-500">{t || "-"}</span>
            ),
        },
        {
            title: "Trạng thái",
            key: "status",
            width: 140,
            align: "center" as const,
            render: () => (
                <Tag
                    icon={
                        <div className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    }
                    className="m-0 rounded border-none bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600"
                >
                    Hoàn thành
                </Tag>
            ),
        },
    ];

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
                    Để có trải nghiệm tốt nhất và xem đầy đủ thông tin bảng biểu, vui lòng xoay ngang điện thoại của bạn.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6">
            <div className="mb-4 flex items-center gap-2 sm:mb-5">
                <span className="text-xs text-slate-400 sm:text-sm">Kho</span>
                <span className="text-xs text-slate-400 sm:text-sm">›</span>
                <span className="text-xs font-medium text-slate-800 sm:text-sm">
                    Kiểm kho
                </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
                <PageHeader
                    title="Quản lý kiểm kho"
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
            </div>

            <div className="mt-3 overflow-hidden rounded-lg bg-white shadow-sm sm:mt-5 sm:rounded-xl">
                <Spin spinning={loading || loadingProducts}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={filteredData}
                        size="small"
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
                                <span className="text-xs sm:text-sm">{`${range[0]}-${range[1]} / ${total}`}</span>,
                            className: "pb-4 !mb-0 px-4",
                        }}
                        scroll={{ x: 1000 }}
                        locale={{
                            emptyText: (
                                <div className="py-10 text-center sm:py-14">
                                    <div className="mb-3 inline-flex rounded-full bg-emerald-50 p-4 sm:mb-4 sm:p-5">
                                        <svg
                                            width="40"
                                            height="40"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="text-emerald-600"
                                        >
                                            <path d="M9 11l3 3L22 4" />
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                        </svg>
                                    </div>
                                    <div className="mb-1 text-sm font-medium text-slate-800 sm:mb-2 sm:text-base">
                                        Chưa có phiếu kiểm kho
                                    </div>
                                    <div className="mb-4 text-xs text-slate-500 sm:mb-5 sm:text-sm">
                                        Hãy tạo phiếu kiểm kho đầu tiên của bạn
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<Plus size={16} />}
                                        onClick={() => router.push("/inventories/warehouse/inventory-check/create")}
                                        className="flex h-9 items-center gap-2 rounded-lg bg-emerald-600 text-sm hover:!bg-emerald-700 sm:h-10"
                                    >
                                        Tạo mới phiếu
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
                        className="bg-emerald-600 hover:!bg-emerald-700"
                        onClick={() => setFilterModalOpen(false)}
                    >
                        Áp dụng
                    </Button>,
                ]}
            >
                <p className="text-slate-500">
                    Chức năng bộ lọc nâng cao đang được phát triển
                </p>
            </Modal>
        </div>
    );
}
