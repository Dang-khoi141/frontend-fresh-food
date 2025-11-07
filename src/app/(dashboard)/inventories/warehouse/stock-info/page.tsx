'use client';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../../../../../lib/components/stock-info/page-header';
import SearchBar from '../../../../../lib/components/stock-info/search';
import { getInventoryColumns } from '../../../../../lib/components/stock-info/table';
import { useFetchInventory } from '../../../../../lib/hooks/useFetchInventory';
import { InventoryItem } from '../../../../../lib/interface/inventory';
import { inventoryService } from '../../../../../lib/service/inventory.service';
import { ColumnsType } from 'antd/es/table';

export default function StockInfoPage() {
    const {
        inventories,
        lowStockProducts,
        loading,
        fetchAllInventory,
        fetchLowStockProducts,
        refetch,
    } = useFetchInventory();

    const [filteredData, setFilteredData] = useState<InventoryItem[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    useEffect(() => {
        fetchAllInventory();
        fetchLowStockProducts();
    }, []);

    useEffect(() => {
        setFilteredData(inventories);
    }, [inventories]);

    const handleSearch = (value: string) => {
        setSearchText(value);
        if (!value.trim()) {
            setFilteredData(inventories);
            return;
        }

        const filtered = inventories.filter(item => {
            const searchLower = value.toLowerCase();
            return (
                item.productId.toLowerCase().includes(searchLower) ||
                item.product?.name?.toLowerCase().includes(searchLower)
            );
        });
        setFilteredData(filtered);
    };

    const handleExportExcel = () => {
        const headers = ['Tên sản phẩm', 'Số lượng tồn kho', 'Ngưỡng cảnh báo'];
        const rows = filteredData.map(item => [
            item.product?.name || '',
            item.stock,
            item.lowStockThreshold,
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(',')),
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Đã xuất file Excel thành công!');
    };

    const handleResetFilter = () => {
        setFilteredData(inventories);
        setSearchText('');
        setFilterModalOpen(false);
    };

    const columns: ColumnsType<InventoryItem> = [
        ...getInventoryColumns(),
        {
            title: "Hành động",
            key: "actions",
            align: "center",
            render: (record: InventoryItem) => (
                <Popconfirm
                    title="Xác nhận xóa"
                    description="Bạn có chắc muốn xóa sản phẩm này khỏi tồn kho?"
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                    onConfirm={async () => {
                        try {
                            await inventoryService.deleteInventory(record.productId);
                            toast.success("Đã xóa sản phẩm khỏi tồn kho!");
                            refetch();
                        } catch (error) {
                            toast.error("Không thể xóa sản phẩm này!");
                        }
                    }}
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        title="Xóa sản phẩm"
                    />
                </Popconfirm>
            ),
        },
    ];


    return (
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            <PageHeader
                onRefresh={refetch}
                onExport={handleExportExcel}
                loading={loading}
            />

            <SearchBar
                searchText={searchText}
                onSearch={handleSearch}
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
                        rowKey="productId"
                        pagination={{
                            position: ['bottomCenter'],
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} trong số ${total} dòng`,
                            style: { marginBottom: '16px' },
                        }}
                        scroll={{ x: 1000 }}
                        style={{
                            borderRadius: '12px',
                        }}
                        rowClassName={(record) => {
                            if (record.stock === 0) return 'out-of-stock-row';
                            if (record.stock <= record.lowStockThreshold) return 'low-stock-row';
                            return '';
                        }}
                        locale={{
                            emptyText: (
                                <div style={{ padding: '40px 0' }}>
                                    <div style={{ color: '#64748b', fontSize: '15px' }}>
                                        Không có dữ liệu tồn kho
                                    </div>
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
                    <Button key="reset" onClick={handleResetFilter}>
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
                <p style={{ color: '#64748b' }}>Chức năng bộ lọc nâng cao đang được phát triển</p>
            </Modal>

            <style>{`
                .low-stock-row {
                    background-color: #fefce8 !important;
                }
                .low-stock-row:hover td {
                    background-color: #fef9c3 !important;
                }
                .out-of-stock-row {
                    background-color: #fef2f2 !important;
                }
                .out-of-stock-row:hover td {
                    background-color: #fee2e2 !important;
                }
            `}</style>
        </div>
    );
}
