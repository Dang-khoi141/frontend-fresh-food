'use client';

import { Button, Modal, Spin, Table } from 'antd';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { StockIssue } from '../../../../lib/interface/issue';
import { issueService } from '../../../../lib/service/issue.service';
import { useFetchIssues } from '../../../../lib/hooks/useFetchIssue';
import { createStockOutColumns } from '../../../../lib/components/stock-out/stock-out-colunm';
import { PageHeader } from '../../../../lib/components/stock-out/page-header';
import { SearchBar } from '../../../../lib/components/stock-out/search-bar';

export default function StockOutPage() {
    const router = useRouter();
    const { issues, loading, refetch } = useFetchIssues();
    const [filteredData, setFilteredData] = useState<StockIssue[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    useEffect(() => {
        setFilteredData(issues);
    }, [issues]);

    const handleSearch = (value: string) => {
        setSearchText(value);
        if (!value.trim()) {
            setFilteredData(issues);
            return;
        }

        const filtered = issues.filter(issue => {
            const searchLower = value.toLowerCase();
            return (
                issue.id.toLowerCase().includes(searchLower) ||
                issue.warehouse.name.toLowerCase().includes(searchLower) ||
                issue.issuedBy.toLowerCase().includes(searchLower)
            );
        });
        setFilteredData(filtered);
    };

    const handleExport = () => {
        const headers = [
            'Mã phiếu xuất kho',
            'Kho xuất hàng',
            'Ngày xuất kho',
            'Người xuất kho',
            'Tổng số lượng',
            'Trạng thái kho'
        ];

        const rows = filteredData.map(issue => [
            issue.id,
            issue.warehouse.name,
            issueService.formatIssueDate(issue.issueDate),
            issue.issuedBy,
            issueService.calculateTotalQuantity(issue),
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
        link.setAttribute('download', `phieu_xuat_kho_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Đã xuất file Excel thành công!');
    };

    const columns = createStockOutColumns((id) =>
        router.push(`/inventories/stock-out/${id}`)
    );

    return (
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ marginBottom: '20px' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Kho</span>
                <span style={{ color: '#94a3b8', margin: '0 8px' }}>›</span>
                <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: 500 }}>
                    Phiếu xuất kho
                </span>
            </div>

            <PageHeader
                title="Phiếu xuất kho"
                onRefresh={refetch}
                onExport={handleExport}
                onCreateNew={() => router.push('/inventories/stock-out/create')}
                showExportExcel={false}
            />

            <SearchBar
                searchText={searchText}
                onSearchChange={handleSearch}
                onFilterClick={() => setFilterModalOpen(true)}
            />

            <div
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden',
                }}
            >
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{
                            position: ['bottomCenter'],
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} trong số ${total} dòng`,
                            style: { marginBottom: '16px' },
                        }}
                        scroll={{ x: 1200 }}
                        locale={{
                            emptyText: (
                                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                                    <div
                                        style={{
                                            display: 'inline-flex',
                                            padding: '20px',
                                            background: '#f0fdf4',
                                            borderRadius: '50%',
                                            marginBottom: '16px',
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
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            color: '#1e293b',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Bạn chưa có phiếu xuất kho nào
                                    </div>
                                    <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                                        Hãy tạo phiếu xuất kho đầu tiên của bạn
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<Plus size={16} />}
                                        onClick={() => router.push('/inventories/stock-out/create')}
                                        style={{
                                            borderRadius: '8px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            height: '40px',
                                            background: '#059669',
                                            border: 'none',
                                        }}
                                    >
                                        Tạo mới phiếu xuất kho
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
                        style={{ background: '#059669' }}
                        onClick={() => setFilterModalOpen(false)}
                    >
                        Áp dụng
                    </Button>,
                ]}
            >
                <p style={{ color: '#64748b' }}>
                    Chức năng bộ lọc nâng cao đang được phát triển
                </p>
            </Modal>
        </div>
    );
}
