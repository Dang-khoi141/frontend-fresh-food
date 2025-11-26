'use client';

import { Button, Modal, Spin, Table } from 'antd';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { StockReceipt } from '../../../../lib/interface/receipt';
import { receiptService } from '../../../../lib/service/receipt.service';
import { useFetchReceipts } from '../../../../lib/hooks/useFetchReceipt';
import { createStockInColumns } from '../../../../lib/components/stock-in/stock-colunm';
import { PageHeader } from '../../../../lib/components/stock-in/page-header';
import { SearchBar } from '../../../../lib/components/stock-in/search-bar';

export default function StockInPage() {
    const router = useRouter();
    const { receipts, loading, refetch } = useFetchReceipts();
    const [filteredData, setFilteredData] = useState<StockReceipt[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filterModalOpen, setFilterModalOpen] = useState(false);
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

    const sortReceipts = (data: StockReceipt[]) => {
        return [...data].sort((a, b) => {
            const dateA = new Date(a.receiptDate || 0).getTime();
            const dateB = new Date(b.receiptDate || 0).getTime();
            return dateB - dateA;
        });
    };

    useEffect(() => {
        setFilteredData(sortReceipts(receipts));
    }, [receipts]);

    const handleSearch = (value: string) => {
        setSearchText(value);
        if (!value.trim()) {
            setFilteredData(sortReceipts(receipts));
            return;
        }

        const filtered = receipts.filter(receipt => {
            const searchLower = value.toLowerCase();
            return (
                receipt.id.toLowerCase().includes(searchLower) ||
                receipt.warehouse.name.toLowerCase().includes(searchLower) ||
                receipt.receivedBy.toLowerCase().includes(searchLower)
            );
        });
        setFilteredData(sortReceipts(filtered));
    };

    const handleExport = () => {
        const headers = [
            'Mã phiếu nhập hàng',
            'Kho nhập hàng',
            'Ngày nhập hàng',
            'Người nhận',
            'Giá trị hàng nhập',
            'Trạng thái kho'
        ];

        const rows = filteredData.map(receipt => [
            receipt.id,
            receipt.warehouse.name,
            receiptService.formatDate(receipt.receiptDate),
            receipt.receivedBy,
            receiptService.formatCurrency(receipt.totalValue),
            'Hoàn thành'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(',')),
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `phieu_nhap_hang_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Đã xuất file Excel thành công!');
    };

    const columns = createStockInColumns((id) =>
        router.push(`/inventories/stock-in/${id}`)
    );

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
                    Phiếu nhập hàng
                </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
                <PageHeader
                    title="Phiếu nhập hàng"
                    onRefresh={refetch}
                    onExport={handleExport}
                    onCreateNew={() => router.push('/inventories/stock-in/create')}
                    showExportExcel={false}
                />

                <SearchBar
                    searchText={searchText}
                    onSearchChange={handleSearch}
                    onFilterClick={() => setFilterModalOpen(true)}
                />
            </div>

            <div className="mt-3 overflow-hidden rounded-lg bg-white shadow-sm sm:mt-5 sm:rounded-xl">
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        size="small"
                        pagination={{
                            position: ['bottomCenter'],
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
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
                                            stroke="#059669"
                                            strokeWidth="2"
                                        >
                                            <path d="M9 11l3 3L22 4" />
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                        </svg>
                                    </div>
                                    <div className="mb-1 text-sm font-medium text-slate-800 sm:mb-2 sm:text-base">
                                        Bạn chưa có phiếu nhập hàng nào
                                    </div>
                                    <div className="mb-4 text-xs text-slate-500 sm:mb-5 sm:text-sm">
                                        Hãy tạo phiếu nhập hàng đầu tiên của bạn
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<Plus size={16} />}
                                        onClick={() => router.push('/inventories/stock-in/create')}
                                        className="flex h-9 items-center gap-2 rounded-lg bg-emerald-600 text-sm hover:!bg-emerald-700 sm:h-10"
                                    >
                                        Tạo mới phiếu nhập hàng
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
                    <Button key="reset" onClick={() => handleSearch('')}>
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
