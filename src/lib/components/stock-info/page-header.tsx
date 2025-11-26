import { Button } from 'antd';
import { Download, RotateCw } from 'lucide-react';
import { PageHeaderProps } from '../../interface/inventory';

export default function PageHeader({ onRefresh, onExport, loading, isMobile }: PageHeaderProps) {
    return (
        <div className={`bg-white ${isMobile ? 'p-4 rounded-lg' : 'px-6 py-5 rounded-xl'} mb-5 shadow-sm`}>
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-800 m-0 mb-1`}>
                        Quản lý thông tin tồn kho
                    </h2>
                    <div className="flex items-center gap-2 text-[13px]">
                        <span className="text-emerald-600 font-medium">Kho</span>
                        <span className="text-slate-300">›</span>
                        <span className="text-slate-400">Thông tin tồn kho</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        icon={<RotateCw size={isMobile ? 14 : 16} />}
                        onClick={onRefresh}
                        loading={loading}
                        className={`rounded-lg ${isMobile ? 'h-9' : 'h-10'} border border-slate-200 flex items-center gap-1.5`}
                    >
                        {!isMobile && 'Làm mới'}
                    </Button>
                    <Button
                        icon={<Download size={isMobile ? 14 : 16} />}
                        onClick={onExport}
                        className={`bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded-lg ${isMobile ? 'h-9' : 'h-10'} flex items-center gap-1.5 font-medium`}
                    >
                        {isMobile ? 'Xuất' : 'Xuất Excel'}
                    </Button>
                </div>
            </div>
        </div>
    );
}