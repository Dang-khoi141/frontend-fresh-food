import { Select } from 'antd';
import { ReceiptFormInfoProps } from '../../interface/receipt';


export const ReceiptFormInfo = ({
    warehouses,
    selectedWarehouse,
    onWarehouseChange,
}: ReceiptFormInfoProps) => {
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
                Thông tin phiếu nhập hàng
            </h3>

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
                    Kho nhập hàng <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <Select
                    placeholder="Chọn kho nhập hàng"
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
                    Sản phẩm sẽ được nhập vào kho đã chọn ngay sau khi lưu phiếu
                </p>
            </div>
        </div>
    );
};
