import { Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { StockIssue } from '../../interface/issue';
import { issueService } from '../../service/issue.service';

export const createStockOutColumns = (
    onRowClick: (id: string) => void
): ColumnsType<StockIssue> => [
        {
            title: 'Mã phiếu xuất kho',
            dataIndex: 'id',
            key: 'id',
            width: 200,
            render: (id: string) => (
                <span>
                    #{id.slice(0, 8)}
                </span>
            ),
        },
        {
            title: 'Kho xuất hàng',
            dataIndex: ['warehouse', 'name'],
            key: 'warehouse',
            width: 200,
            render: (name: string) => (
                <span style={{ fontWeight: 500 }}>{name}</span>
            ),
        },
        {
            title: 'Ngày xuất kho',
            dataIndex: 'issueDate',
            key: 'issueDate',
            width: 180,
            render: (date: string) => (
                <span style={{ color: '#64748b' }}>
                    {issueService.formatIssueDate(date)}
                </span>
            ),
        },
        {
            title: 'Người xuất kho',
            dataIndex: 'issuedBy',
            key: 'issuedBy',
            width: 150,
            render: (issuedBy: string) => (
                <span style={{ color: '#64748b' }}>{issuedBy}</span>
            ),
        },
        {
            title: 'Tổng số lượng',
            key: 'totalQuantity',
            width: 150,
            align: 'right',
            render: (_: any, record: StockIssue) => {
                const total = issueService.calculateTotalQuantity(record);
                return (
                    <span style={{ fontWeight: 600, color: '#059669' }}>
                        {total.toLocaleString('vi-VN')} sản phẩm
                    </span>
                );
            },
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
