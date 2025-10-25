import { Button, InputNumber, Table } from 'antd';
import { Trash2 } from 'lucide-react';
import { IssueDetail } from '../../interface/issue';

interface IssueItemsTableProps {
    items: IssueDetail[];
    onUpdateItem: (key: string, field: 'quantity', value: number) => void;
    onRemoveItem: (key: string) => void;
}

export const IssueItemsTable = ({
    items,
    onUpdateItem,
    onRemoveItem,
}: IssueItemsTableProps) => {
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            width: '45%',
            render: (_: any, record: IssueDetail) => (
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
            title: 'Số lượng yêu cầu',
            key: 'requestedQuantity',
            width: '20%',
            align: 'center' as const,
            render: (_: any, record: IssueDetail) => (
                <span style={{ fontWeight: 500, color: '#64748b' }}>
                    {record.quantity.toLocaleString('vi-VN')}
                </span>
            ),
        },
        {
            title: 'Số lượng xuất',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '25%',
            render: (quantity: number, record: IssueDetail) => (
                <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(value) => onUpdateItem(record.key, 'quantity', value || 0)}
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
            ),
        },
        {
            title: '',
            key: 'action',
            width: '10%',
            align: 'center' as const,
            render: (_: any, record: IssueDetail) => (
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
                            Vui lòng chọn đơn hàng để bắt đầu
                        </div>
                    </div>
                ),
            }}
        />
    );
};
