import { Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { StockReceipt } from '../../interface/receipt';
import { receiptService } from '../../service/receipt.service';

export const createStockInColumns = (
    onRowClick: (id: string) => void
): ColumnsType<StockReceipt> => [
    {
        title: 'Mã phiếu nhập hàng',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        render: (id: string) => (
            <span>{id}</span>
        ),
    },
    {
        title: 'Kho nhập hàng',
        dataIndex: ['warehouse', 'name'],
        key: 'warehouse',
        width: 200,
        render: (name: string) => (
            <span style={{ fontWeight: 500 }}>{name}</span>
        ),
    },
    {
        title: 'Ngày nhập hàng',
        dataIndex: 'receiptDate',
        key: 'receiptDate',
        width: 180,
        render: (date: string) => (
            <span style={{ color: '#64748b' }}>
                {receiptService.formatDate(date)}
            </span>
        ),
    },
    {
        title: 'Người nhập',
        dataIndex: 'receivedBy',
        key: 'receivedBy',
        width: 150,
        render: (receivedBy: string) => (
            <span style={{ color: '#64748b' }}>{receivedBy}</span>
        ),
    },
    {
        title: 'Giá trị hàng nhập',
        dataIndex: 'totalValue',
        key: 'totalValue',
        width: 180,
        align: 'right',
        render: (value: number) => (
            <span style={{ fontWeight: 600, color: '#059669' }}>
                {receiptService.formatCurrency(value)}
            </span>
        ),
    },
    {
        title: 'Trạng thái kho',
        key: 'warehouseStatus',
        width: 150,
        align: 'center',
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
                Hoàn thành
            </Tag>
        ),
    },
];