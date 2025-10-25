import { Button, Input } from 'antd';
import { IssueDetail } from '../../interface/issue';

interface IssueSummaryPanelProps {
    items: IssueDetail[];
    notes: string;
    loading: boolean;
    onNotesChange: (value: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
}

export const IssueSummaryPanel = ({
    items,
    notes,
    loading,
    onNotesChange,
    onCancel,
    onSubmit,
}: IssueSummaryPanelProps) => {
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
                    Ghi chú xuất kho
                </label>
                <Input.TextArea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Nhập ghi chú xuất kho"
                    rows={4}
                    style={{ resize: 'none' }}
                />
            </div>

            <div
                style={{
                    padding: '16px',
                    background: '#f0fdf4',
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
                    <span style={{ color: '#065f46' }}>Tổng số sản phẩm:</span>
                    <span style={{ fontWeight: 600, color: '#065f46' }}>{items.length}</span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid #d1fae5',
                    }}
                >
                    <span style={{ fontWeight: 600, color: '#064e3b' }}>
                        Tổng số lượng xuất:
                    </span>
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: '18px',
                            color: '#059669',
                        }}
                    >
                        {totalQuantity.toLocaleString('vi-VN')}
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
