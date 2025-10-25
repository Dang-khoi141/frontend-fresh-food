import { Button, Input, Modal, Table, Tag } from 'antd';
import { Search } from 'lucide-react';
import { Order } from '../../interface/order';

interface OrderSelectionModalProps {
    open: boolean;
    orders: Order[];
    selectedOrder: Order | null;
    searchText: string;
    onSearchChange: (value: string) => void;
    onSelectionChange: (order: Order) => void;
    onCancel: () => void;
}

export const OrderSelectionModal = ({
    open,
    orders,
    selectedOrder,
    searchText,
    onSearchChange,
    onSelectionChange,
    onCancel,
}: OrderSelectionModalProps) => {
    const filteredOrders = orders.filter(order => {
        const searchLower = searchText.toLowerCase();
        return (
            order.id.toLowerCase().includes(searchLower) ||
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.user?.name?.toLowerCase().includes(searchLower) ||
            order.user?.email?.toLowerCase().includes(searchLower)
        );
    });

    const orderColumns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            width: 150,
            render: (orderNumber: string) => (
                <span style={{ color: '#0284c7', fontWeight: 500 }}>
                    #{orderNumber}
                </span>
            ),
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            width: 200,
            render: (_: any, record: Order) => (
                <div>
                    <div style={{ fontWeight: 500, color: '#1e293b' }}>
                        {record.user?.name || 'Khách vãng lai'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {record.user?.email || 'N/A'}
                    </div>
                </div>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            width: 150,
            align: 'right' as const,
            render: (amount: number) => (
                <span style={{ fontWeight: 600, color: '#059669' }}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(amount)}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center' as const,
            render: (status: string) => {
                const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
                    PENDING: { color: '#059669', bg: '#f0fdf4', label: 'Chờ xác nhận' },
                    CONFIRMED: { color: '#0284c7', bg: '#e0f2fe', label: 'Đã xác nhận' },
                    PAID: { color: '#059669', bg: '#d1fae5', label: 'Đã thanh toán' },
                    SHIPPED: { color: '#8b5cf6', bg: '#ede9fe', label: 'Đang giao' },
                    DELIVERED: { color: '#059669', bg: '#d1fae5', label: 'Đã giao' },
                    CANCELED: { color: '#ef4444', bg: '#fee2e2', label: 'Đã hủy' },
                };
                const config = statusConfig[status] || statusConfig.PENDING;
                return (
                    <Tag
                        style={{
                            background: config.bg,
                            color: config.color,
                            border: 'none',
                            borderRadius: '6px',
                        }}
                    >
                        {config.label}
                    </Tag>
                );
            },
        },
        {
            title: 'Số sản phẩm',
            key: 'itemCount',
            width: 120,
            align: 'center' as const,
            render: (_: any, record: Order) => (
                <span style={{ fontWeight: 500 }}>
                    {record.items.length} sản phẩm
                </span>
            ),
        },
    ];

    return (
        <Modal
            title="Chọn đơn hàng xuất kho"
            open={open}
            onCancel={onCancel}
            width={1000}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Đóng
                </Button>,
            ]}
        >
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Tìm kiếm đơn hàng theo mã đơn hàng, tên khách hàng, email"
                    prefix={<Search size={16} />}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    size="large"
                />
            </div>
            <Table
                columns={orderColumns}
                dataSource={filteredOrders}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => onSelectionChange(record),
                    style: {
                        cursor: 'pointer',
                        background: selectedOrder?.id === record.id ? '#f0fdf4' : 'transparent',
                    },
                })}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                }}
                scroll={{ y: 300 }}
                locale={{
                    emptyText: (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                                Không tìm thấy đơn hàng phù hợp
                            </div>
                            <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '8px' }}>
                                Chỉ hiển thị đơn hàng đã thanh toán hoặc đã xác nhận
                            </div>
                        </div>
                    ),
                }}
            />
        </Modal>
    );
};
