import { Button, DatePicker, Select } from 'antd';
import { Dayjs } from 'dayjs';
import { Package } from 'lucide-react';
import { Warehouse } from '../../interface/warehouse';
import { Order } from '../../interface/order';

interface IssueFormInfoProps {
    warehouses: Warehouse[];
    selectedWarehouse: string;
    issueDate: Dayjs;
    selectedOrder: Order | null;
    onWarehouseChange: (value: string) => void;
    onDateChange: (date: Dayjs | null) => void;
    onSelectOrder: () => void;
}

export const IssueFormInfo = ({
    warehouses,
    selectedWarehouse,
    issueDate,
    selectedOrder,
    onWarehouseChange,
    onDateChange,
    onSelectOrder,
}: IssueFormInfoProps) => {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
            }}
        >
            <h3
                style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '20px',
                }}
            >
                Thông tin phiếu xuất kho
            </h3>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                    marginBottom: '16px',
                }}
            >
                <div>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#475569',
                        }}
                    >
                        Kho xuất hàng <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <Select
                        placeholder="Chọn kho xuất hàng"
                        size="large"
                        style={{ width: '100%' }}
                        value={selectedWarehouse || undefined}
                        onChange={onWarehouseChange}
                        options={warehouses.map(warehouse => ({
                            label: warehouse.name,
                            value: warehouse.id,
                        }))}
                    />
                </div>

                <div>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#475569',
                        }}
                    >
                        Ngày xuất kho <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <DatePicker
                        value={issueDate}
                        onChange={onDateChange}
                        size="large"
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày xuất kho"
                    />
                </div>
            </div>

            <div>
                <label
                    style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#475569',
                    }}
                >
                    Đơn hàng <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <Button
                    icon={<Package size={16} />}
                    onClick={onSelectOrder}
                    size="large"
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'flex-start',
                        height: '40px',
                        background: selectedOrder ? '#f0fdf4' : 'white',
                        color: selectedOrder ? '#059669' : '#64748b',
                        border: selectedOrder ? '1px solid #d1fae5' : '1px solid #e2e8f0',
                    }}
                >
                    {selectedOrder
                        ? `Đơn hàng #${selectedOrder.orderNumber} - ${selectedOrder.user?.name || 'Khách vãng lai'}`
                        : 'Chọn đơn hàng cần xuất kho'}
                </Button>
            </div>

            <div style={{ marginTop: '16px' }}>
                <p
                    style={{
                        fontSize: '13px',
                        color: '#64748b',
                        margin: 0,
                        lineHeight: '1.6',
                    }}
                >
                    <span style={{ color: '#ef4444', marginRight: '4px' }}>*</span>
                    Sản phẩm sẽ được xuất từ kho đã chọn sau khi lưu phiếu
                </p>
            </div>
        </div>
    );
};
