import { Button, Input } from 'antd';
import { Filter, Search } from 'lucide-react';
import { SearchBarProps } from '../../interface/inventory';

const { Search: AntSearch } = Input;

export default function SearchBar({ searchText, onSearch, onFilterClick }: SearchBarProps) {
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
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <AntSearch
                    placeholder="Tìm kiếm theo Tên sản phẩm"
                    allowClear
                    size="large"
                    prefix={<Search size={18} style={{ color: '#94a3b8' }} />}
                    value={searchText}
                    onChange={(e) => onSearch(e.target.value)}
                    onSearch={onSearch}
                    style={{
                        flex: 1,
                        borderRadius: '8px',
                    }}
                />
                <Button
                    icon={<Filter size={16} />}
                    onClick={onFilterClick}
                    style={{
                        borderRadius: '8px',
                        height: '40px',
                        border: '1px solid #10b981',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 500,
                    }}
                >
                    Bộ lọc khác
                </Button>
            </div>
        </div>
    );
}
