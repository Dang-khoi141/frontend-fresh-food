import { Badge, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { InventoryItem } from '../../interface/inventory';

export const getInventoryColumns = (): ColumnsType<InventoryItem> => [
    {
        title: 'Hình ảnh',
        dataIndex: ['product', 'image'],
        key: 'image',
        width: 100,
        fixed: 'left',
        render: (value: string) =>
            value ? (
                <Image
                    src={value}
                    alt="Product Image"
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                />
            ) : (
                <div style={{
                    width: 60,
                    height: 60,
                    background: '#f1f5f9',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    fontSize: 12,
                }}>
                    No Image
                </div>
            ),
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: ['product', 'name'],
        key: 'productName',
        width: 250,
        ellipsis: true,
        render: (text: string, record: InventoryItem) => (
            <div>
                <div style={{ fontWeight: 500, color: '#1e293b', marginBottom: 4 }}>
                    {text || '-'}
                </div>
                {record.stock <= record.lowStockThreshold && (
                    <Badge
                        count={record.stock === 0 ? 'Hết hàng' : 'Sắp hết'}
                        style={{
                            backgroundColor: record.stock === 0 ? '#ef4444' : '#eab308',
                            fontSize: '10px',
                            height: '18px',
                            lineHeight: '18px',
                            padding: '0 6px',
                        }}
                    />
                )}
            </div>
        ),
    },
    {
        title: 'Số lượng tồn kho',
        dataIndex: 'stock',
        key: 'stock',
        width: 180,
        align: 'center',
        sorter: (a, b) => a.stock - b.stock,
        render: (stock: number, record: InventoryItem) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span
                    style={{
                        fontWeight: 600,
                        color: stock === 0 ? '#ef4444' : stock <= record.lowStockThreshold ? '#eab308' : '#059669',
                        fontSize: '15px',
                    }}
                >
                    {stock}
                </span>
                {stock <= record.lowStockThreshold && stock > 0 && (
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Ngưỡng: {record.lowStockThreshold}
                    </span>
                )}
            </div>
        ),
    },
    {
        title: 'Số lượng chờ xuất',
        dataIndex: 'pendingExport',
        key: 'pendingExport',
        width: 150,
        align: 'center',
        render: (value: number = 0) => (
            <span style={{
                fontWeight: 500,
                color: value > 0 ? '#0ea5e9' : '#94a3b8',
                fontSize: '15px',
            }}>
                {value}
            </span>
        ),
    },
    {
        title: 'Số lượng chờ nhập',
        dataIndex: 'pendingImport',
        key: 'pendingImport',
        width: 150,
        align: 'center',
        render: (value: number = 0) => (
            <span style={{
                fontWeight: 500,
                color: value > 0 ? '#8b5cf6' : '#94a3b8',
                fontSize: '15px',
            }}>
                {value}
            </span>
        ),
    },
];
