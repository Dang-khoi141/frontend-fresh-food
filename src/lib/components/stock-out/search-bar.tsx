import { Button } from 'antd';
import { Filter, Search } from 'lucide-react';

interface SearchBarProps {
    searchText: string;
    onSearchChange: (value: string) => void;
    onFilterClick: () => void;
}

export const SearchBar = ({
    searchText,
    onSearchChange,
    onFilterClick,
}: SearchBarProps) => {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px 24px',
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
            }}
        >
            <div style={{ position: 'relative', flex: 1 }}>
                <Search
                    size={18}
                    style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                    }}
                />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã phiếu xuất kho, kho xuất hàng"
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        height: '40px',
                        paddingLeft: '44px',
                        paddingRight: '16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#059669';
                        e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                    }}
                />
            </div>
            <Button
                icon={<Filter size={16} />}
                onClick={onFilterClick}
                style={{
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '40px',
                    background: '#f0fdf4',
                    color: '#059669',
                    border: '1px solid #d1fae5',
                }}
            >
                Bộ lọc khác
            </Button>
        </div>
    );
};
