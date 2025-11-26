import { Badge, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { InventoryItem } from '../../interface/inventory';

export const getInventoryColumns = (isMobile: boolean): ColumnsType<InventoryItem> => [
    {
        title: 'Hình ảnh',
        dataIndex: ['product', 'image'],
        key: 'image',
        width: isMobile ? 70 : 100,
        fixed: 'left',
        render: (value: string) =>
            value ? (
                <Image
                    src={value}
                    alt="Product Image"
                    width={isMobile ? 45 : 60}
                    height={isMobile ? 45 : 60}
                    className={`object-cover ${isMobile ? 'rounded-md' : 'rounded-lg'}`}
                />
            ) : (
                <div className={`${isMobile ? 'w-[45px] h-[45px] rounded-md text-[10px]' : 'w-[60px] h-[60px] rounded-lg text-xs'} bg-slate-100 flex items-center justify-center text-slate-400`}>
                    No Image
                </div>
            ),
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: ['product', 'name'],
        key: 'productName',
        width: isMobile ? 150 : 250,
        ellipsis: true,
        render: (text: string, record: InventoryItem) => (
            <div>
                <div className={`font-medium text-slate-800 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {text || '-'}
                </div>
                {record.stock <= record.lowStockThreshold && (
                    <Badge
                        count={record.stock === 0 ? 'Hết hàng' : 'Sắp hết'}
                        className={`${isMobile ? '[&_.ant-badge-count]:text-[9px] [&_.ant-badge-count]:h-4 [&_.ant-badge-count]:leading-4 [&_.ant-badge-count]:px-1' : '[&_.ant-badge-count]:text-[10px] [&_.ant-badge-count]:h-[18px] [&_.ant-badge-count]:leading-[18px] [&_.ant-badge-count]:px-1.5'}`}
                        style={{
                            backgroundColor: record.stock === 0 ? '#ef4444' : '#eab308',
                        }}
                    />
                )}
            </div>
        ),
    },
    {
        title: isMobile ? 'Tồn kho' : 'Số lượng tồn kho',
        dataIndex: 'stock',
        key: 'stock',
        width: isMobile ? 80 : 180,
        align: 'center',
        sorter: (a, b) => a.stock - b.stock,
        render: (stock: number, record: InventoryItem) => {
            const colorClass = stock === 0
                ? 'text-red-500'
                : stock <= record.lowStockThreshold
                    ? 'text-yellow-500'
                    : 'text-emerald-600';

            return (
                <div className="flex flex-col items-center gap-1">
                    <span className={`font-semibold ${colorClass} ${isMobile ? 'text-[13px]' : 'text-[15px]'}`}>
                        {stock}
                    </span>
                    {stock <= record.lowStockThreshold && stock > 0 && (
                        <span className={`text-slate-400 ${isMobile ? 'text-[10px]' : 'text-[11px]'}`}>
                            Ngưỡng: {record.lowStockThreshold}
                        </span>
                    )}
                </div>
            );
        },
    },
];