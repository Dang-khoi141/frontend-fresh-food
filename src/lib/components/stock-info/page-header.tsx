import { Button } from 'antd';
import { Download, RotateCw } from 'lucide-react';
import { PageHeaderProps } from '../../interface/inventory';

export default function PageHeader({ onRefresh, onExport, loading }: PageHeaderProps) {
    return (
        <div
            style={{
                background: 'white',
                padding: '20px 24px',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2
                        style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#1e293b',
                            margin: 0,
                            marginBottom: '4px',
                        }}
                    >
                        Quản lý thông tin tồn kho
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <span style={{ color: '#059669', fontWeight: 500 }}>Kho</span>
                        <span style={{ color: '#cbd5e1' }}>›</span>
                        <span style={{ color: '#94a3b8' }}>Thông tin tồn kho</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button
                        icon={<RotateCw size={16} />}
                        onClick={onRefresh}
                        loading={loading}
                        style={{
                            borderRadius: '8px',
                            height: '40px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        Làm mới
                    </Button>
                    <Button
                        icon={<Download size={16} />}
                        onClick={onExport}
                        style={{
                            background: '#059669',
                            borderColor: '#059669',
                            color: 'white',
                            borderRadius: '8px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 500,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#047857';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#059669';
                        }}
                    >
                        Xuất Excel
                    </Button>
                </div>
            </div>
        </div>
    );
}
