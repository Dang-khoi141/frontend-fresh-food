import { Button, InputNumber, Table } from 'antd';
import { Trash2 } from 'lucide-react';
import { ReceiptItem, ReceiptItemsTableProps } from '../../interface/receipt';

export const ReceiptItemsTable = ({
    items,
    onUpdateItem,
    onRemoveItem,
}: ReceiptItemsTableProps) => {
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            width: '35%',
            render: (_: any, record: ReceiptItem) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {record.product?.image && (
                        <img
                            src={record.product.image}
                            alt={record.product.name}
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
                            {record.product?.name}
                        </div>
                        {record.product?.brand && (
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                {record.product.brand.name}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '20%',
            render: (quantity: number, record: ReceiptItem) => (
                <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(value) => onUpdateItem(record.key, 'quantity', value || 0)}
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => Number(value?.replace(/,/g, '') || 0)}
                />
            ),
        },
        {
            title: 'Giá nhập',
            dataIndex: 'unitCost',
            key: 'unitCost',
            width: '25%',
            render: (unitCost: number, record: ReceiptItem) => (
                <InputNumber
                    min={0}
                    value={unitCost}
                    onChange={(value) => onUpdateItem(record.key, 'unitCost', value || 0)}
                    style={{ width: '100%' }}
                    formatter={(value) =>
                        `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => Number(value?.replace(/₫\s?|,/g, '') || 0)}
                />
            ),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            width: '15%',
            align: 'right' as const,
            render: (_: any, record: ReceiptItem) => {
                const total = (record.quantity || 0) * (record.unitCost || 0);
                return (
                    <span style={{ fontWeight: 600, color: '#059669' }}>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(total)}
                    </span>
                );
            },
        },
        {
            title: '',
            key: 'action',
            width: '5%',
            align: 'center' as const,
            render: (_: any, record: ReceiptItem) => (
                <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => onRemoveItem(record.key)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                />
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={items}
            rowKey="key"
            pagination={false}
            locale={{
                emptyText: (
                    <div style={{ padding: '40px 0', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                            Chưa có sản phẩm nào được thêm
                        </div>
                        <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '8px' }}>
                            Nhấn nút "Thêm sản phẩm" để bắt đầu
                        </div>
                    </div>
                ),
            }}
        />
    );
};
