import { Button } from 'antd';
import { FileDown, Plus, RefreshCw } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    onRefresh?: () => void;
    onExport?: () => void;
    onCreateNew?: () => void;
    showExportExcel?: boolean;
}

export const PageHeader = ({
    title,
    onRefresh,
    onExport,
    onCreateNew,
    showExportExcel = false,
}: PageHeaderProps) => {
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
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#1e293b',
                            margin: 0,
                            marginBottom: '8px',
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        style={{
                            fontSize: '14px',
                            color: '#64748b',
                            margin: 0,
                        }}
                    >
                        Quản lý phiếu xuất kho theo đơn hàng
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {onRefresh && (
                        <Button
                            icon={<RefreshCw size={16} />}
                            onClick={onRefresh}
                            style={{
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '40px',
                            }}
                        >
                            Làm mới
                        </Button>
                    )}
                    {onExport && (
                        <Button
                            icon={<FileDown size={16} />}
                            onClick={onExport}
                            style={{
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '40px',
                            }}
                        >
                            Xuất Excel
                        </Button>
                    )}
                    {showExportExcel && onCreateNew && (
                        <Button
                            icon={<FileDown size={16} />}
                            onClick={onCreateNew}
                            style={{
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '40px',
                                background: '#f0fdf4',
                                color: '#f59e0b',
                                border: '1px solid #d1fae5',
                            }}
                        >
                            Tạo phiếu xuất kho bằng Excel
                        </Button>
                    )}
                    {onCreateNew && !showExportExcel && (
                        <Button
                            type="primary"
                            icon={<Plus size={16} />}
                            onClick={onCreateNew}
                            style={{
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '40px',
                                background: '#059669',
                                border: 'none',
                            }}
                        >
                            Thêm mới
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
