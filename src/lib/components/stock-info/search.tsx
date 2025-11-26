import { Button, Input } from 'antd';
import { Filter, Search } from 'lucide-react';
import { SearchBarProps } from '../../interface/inventory';

const { Search: AntSearch } = Input;

export default function SearchBar({ searchText, onSearch, onFilterClick, isMobile }: SearchBarProps) {
    return (
        <div className={`bg-white ${isMobile ? 'p-4 rounded-lg' : 'px-6 py-5 rounded-xl'} mb-5 shadow-sm`}>
            <div className="flex gap-3 items-center">
                <AntSearch
                    placeholder="Tìm kiếm theo Tên sản phẩm"
                    allowClear
                    size={isMobile ? 'middle' : 'large'}
                    prefix={<Search size={isMobile ? 16 : 18} className="text-slate-400" />}
                    value={searchText}
                    onChange={(e) => onSearch(e.target.value)}
                    onSearch={onSearch}
                    className="flex-1 rounded-lg"
                />
                <Button
                    icon={<Filter size={isMobile ? 14 : 16} />}
                    onClick={onFilterClick}
                    className={`rounded-lg ${isMobile ? 'h-9 px-3' : 'h-10'} border border-emerald-500 text-emerald-600 flex items-center gap-1.5 font-medium hover:bg-emerald-50`}
                >
                    {!isMobile && 'Bộ lọc khác'}
                </Button>
            </div>
        </div>
    );
}