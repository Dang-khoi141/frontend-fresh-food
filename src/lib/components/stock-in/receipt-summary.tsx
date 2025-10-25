import { Button, Input } from 'antd';
import { ReceiptItem, ReceiptSummaryPanelProps } from '../../interface/receipt';

export const ReceiptSummaryPanel = ({
    items,
    totalPayment,
    notes,
    loading,
    onNotesChange,
    onCancel,
    onSubmit,
}: ReceiptSummaryPanelProps) => {
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <div
            style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                position: 'sticky',
                top: '24px',
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
                Thông tin bổ sung
            </h3>

            <div style={{ marginBottom: '16px' }}>
                <label
                    style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#475569',
                    }}
                >
                    Người tạo
                </label>
                <Input
                    value="Trần Anh Tiến"
                    disabled
                    size="large"
                    style={{ background: '#f8fafc' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label
                    style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#475569',
                    }}
                >
                    Ghi chú nhập hàng
                </label>
                <Input.TextArea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Nhập ghi chú nhập hàng"
                    rows={4}
                    style={{ resize: 'none' }}
                />
            </div>

            <div
                style={{
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                    }}
                >
                    <span style={{ color: '#64748b' }}>Tổng số sản phẩm:</span>
                    <span style={{ fontWeight: 600 }}>{totalQuantity}</span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid #e2e8f0',
                    }}
                >
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>
                        Tổng giá trị:
                    </span>
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: '18px',
                            color: '#059669',
                        }}
                    >
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(totalPayment)}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        height: '44px',
                        borderRadius: '8px',
                    }}
                >
                    Hủy
                </Button>
                <Button
                    type="primary"
                    onClick={onSubmit}
                    loading={loading}
                    style={{
                        flex: 1,
                        height: '44px',
                        borderRadius: '8px',
                        background: '#059669',
                        border: 'none',
                    }}
                >
                    Lưu
                </Button>
            </div>
        </div>
    );
};
