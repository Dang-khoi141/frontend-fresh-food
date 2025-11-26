import { Button, Select } from 'antd';
import { Package } from 'lucide-react';
import { Warehouse } from '../../interface/warehouse';
import { Order } from '../../interface/order';

interface IssueFormInfoProps {
    warehouses: Warehouse[];
    selectedWarehouse: string;
    selectedOrder: Order | null;
    onWarehouseChange: (value: string) => void;
    onSelectOrder: () => void;
}

export const IssueFormInfo = ({
    warehouses,
    selectedWarehouse,
    selectedOrder,
    onWarehouseChange,
    onSelectOrder,
}: IssueFormInfoProps) => {
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-800 sm:mb-5 sm:text-base">
                Thông tin phiếu xuất kho
            </h3>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600 sm:text-sm">
                        Kho xuất hàng <span className="text-red-500">*</span>
                    </label>
                    <Select
                        placeholder="Chọn kho xuất hàng"
                        size="large"
                        className="w-full"
                        value={selectedWarehouse || undefined}
                        onChange={onWarehouseChange}
                        options={warehouses.map(warehouse => ({
                            label: warehouse.name,
                            value: warehouse.id,
                        }))}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600 sm:text-sm">
                        Đơn hàng <span className="text-red-500">*</span>
                    </label>
                    <Button
                        icon={<Package size={16} />}
                        onClick={onSelectOrder}
                        size="large"
                        className={`flex h-10 w-full items-center gap-2 rounded-lg border text-left sm:h-11 ${
                            selectedOrder
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300'
                        }`}
                    >
                        {selectedOrder
                            ? `Đơn hàng #${selectedOrder.orderNumber} - ${selectedOrder.user?.name || 'Khách vãng lai'}`
                            : 'Chọn đơn hàng cần xuất kho'}
                    </Button>
                </div>
            </div>

            <p className="text-xs text-slate-500 sm:text-sm">
                <span className="mr-1 text-red-500">*</span>
                Sản phẩm sẽ được xuất từ kho đã chọn sau khi lưu phiếu
            </p>
        </div>
    );
};