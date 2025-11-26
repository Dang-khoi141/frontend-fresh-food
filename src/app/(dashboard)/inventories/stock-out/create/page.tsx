'use client';

import { Button, Spin } from 'antd';
import { ArrowLeft, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { OrderSelectionModal } from '../../../../../lib/components/stock-out/order-select';
import { IssueFormInfo } from '../../../../../lib/components/stock-out/issue-info';
import { IssueItemsTable } from '../../../../../lib/components/stock-out/issue-item';
import { IssueSummaryPanel } from '../../../../../lib/components/stock-out/issue-summary';
import { Order } from '../../../../../lib/interface/order';
import { CreateIssueDto, IssueDetail } from '../../../../../lib/interface/issue';
import { Warehouse } from '../../../../../lib/interface/warehouse';
import { orderService } from '../../../../../lib/service/order.service';
import { issueService } from '../../../../../lib/service/issue.service';
import { warehouseService } from '../../../../../lib/service/warehouse.service';

export default function CreateStockOutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderModalOpen, setOrderModalOpen] = useState(false);

    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [issueDetails, setIssueDetails] = useState<IssueDetail[]>([]);
    const [notes, setNotes] = useState<string>('');

    const [isPortrait, setIsPortrait] = useState(false);
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 768;
            const mobileLandscape = window.innerHeight < window.innerWidth && window.innerHeight < 500;
            setIsPortrait(portrait);
            setIsMobileLandscape(mobileLandscape);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [warehousesData, ordersData] = await Promise.all([
                warehouseService.getAllWarehouses(),
                orderService.getAllOrders(),
            ]);
            setWarehouses(warehousesData);
            const pendingOrders = ordersData.filter(
                order => order.status === 'PAID' || order.status === 'CONFIRMED'
            );
            setOrders(pendingOrders);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);

        const details: IssueDetail[] = order.items.map(item => ({
            key: `${item.product.id}-${Date.now()}-${Math.random()}`,
            productId: item.product.id,
            quantity: item.quantity,
            product: {
                id: item.product.id,
                name: item.product.name,
                image: item.product.image,
                price: parseFloat(item.product.price),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }));

        setIssueDetails(details);
        setOrderModalOpen(false);
        toast.success(`Đã chọn đơn hàng #${order.orderNumber}`);
    };

    const handleUpdateItem = (key: string, field: 'quantity', value: number) => {
        setIssueDetails(
            issueDetails.map(item =>
                item.key === key
                    ? {
                        ...item,
                        [field]: parseInt(String(value)) || 0
                    }
                    : item
            )
        );
    };

    const handleRemoveItem = (key: string) => {
        setIssueDetails(issueDetails.filter(item => item.key !== key));
        toast.success('Đã xóa sản phẩm');
    };

    const handleSubmit = async () => {
        if (!selectedWarehouse) {
            toast.error('Vui lòng chọn kho xuất hàng');
            return;
        }

        if (!selectedOrder) {
            toast.error('Vui lòng chọn đơn hàng');
            return;
        }

        if (issueDetails.length === 0) {
            toast.error('Vui lòng có ít nhất một sản phẩm');
            return;
        }

        const invalidItems = issueDetails.filter(
            item => !item.quantity || item.quantity <= 0
        );

        if (invalidItems.length > 0) {
            toast.error('Vui lòng nhập đầy đủ số lượng cho tất cả sản phẩm');
            return;
        }

        try {
            setLoading(true);

            const dto: CreateIssueDto = {
                warehouseId: selectedWarehouse,
                orderId: selectedOrder.id,
                items: issueDetails.map(item => ({
                    productId: item.productId,
                    quantity: parseInt(String(item.quantity)),
                })),
            };

            await issueService.createIssue(dto);
            toast.success('Tạo phiếu xuất kho thành công!');
            router.push('/inventories/stock-out');
        } catch (error: any) {
            console.error('Error creating issue:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Không thể tạo phiếu xuất kho';

            if (Array.isArray(error.response?.data?.message)) {
                toast.error(error.response.data.message.join(', '));
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const totalQuantity = issueDetails.reduce((sum, item) => sum + (item.quantity || 0), 0);

    if (isPortrait) {
        return (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 p-5 text-white">
                <style>
                    {`
                        @keyframes rotatePhone {
                            0%, 10% { transform: rotate(0deg); }
                            40%, 60% { transform: rotate(-90deg); }
                            90%, 100% { transform: rotate(0deg); }
                        }
                    `}
                </style>

                <div
                    className="relative mb-8 h-[110px] w-[64px] rounded-xl border-[3px] border-amber-500"
                    style={{ animation: 'rotatePhone 2.5s infinite ease-in-out' }}
                >
                    <div className="absolute left-1/2 top-2.5 h-0.5 w-5 -translate-x-1/2 rounded-sm bg-amber-500" />
                    <div className="absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-amber-500" />
                </div>

                <h3 className="mb-3 text-center text-lg font-semibold text-slate-50">
                    Vui lòng xoay ngang thiết bị
                </h3>

                <p className="max-w-[300px] text-center text-sm leading-relaxed text-slate-400">
                    Để có trải nghiệm tốt nhất và xem đầy đủ thông tin bảng biểu, vui lòng xoay ngang điện thoại của bạn.
                </p>
            </div>
        );
    }

    if (isMobileLandscape) {
        return (
            <div className="flex h-screen flex-col bg-slate-50">
                <div className="flex items-center gap-3 bg-white px-4 py-2 shadow-sm">
                    <Button
                        icon={<ArrowLeft size={16} />}
                        onClick={() => router.back()}
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                    />
                    <h1 className="text-sm font-bold text-slate-800">Tạo phiếu xuất kho</h1>
                    <div className="ml-auto flex gap-2">
                        <Button
                            onClick={() => router.back()}
                            className="h-8 rounded-lg px-3 text-xs"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            loading={loading}
                            className="h-8 rounded-lg bg-emerald-600 px-3 text-xs"
                        >
                            Lưu
                        </Button>
                    </div>
                </div>

                <Spin spinning={loading} className="flex-1">
                    <div className="flex h-[calc(100vh-52px)] gap-3 overflow-hidden p-3">
                        <div className="flex w-[200px] shrink-0 flex-col gap-3">
                            <div className="rounded-lg bg-white p-3 shadow-sm">
                                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                    Kho xuất <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedWarehouse}
                                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                                    className="h-8 w-full rounded border border-slate-200 px-2 text-xs focus:border-emerald-500 focus:outline-none"
                                >
                                    <option value="">Chọn kho</option>
                                    {warehouses.map(warehouse => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-lg bg-white p-3 shadow-sm">
                                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                    Đơn hàng <span className="text-red-500">*</span>
                                </label>
                                <button
                                    onClick={() => setOrderModalOpen(true)}
                                    className={`flex h-8 w-full items-center gap-2 rounded border px-2 text-left text-xs transition-colors ${selectedOrder
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300'
                                        }`}
                                >
                                    <Package size={12} />
                                    <span className="flex-1 truncate">
                                        {selectedOrder
                                            ? `#${selectedOrder.orderNumber}`
                                            : 'Chọn đơn hàng'}
                                    </span>
                                </button>
                                {selectedOrder && (
                                    <div className="mt-1.5 text-[10px] text-slate-500">
                                        {selectedOrder.user?.name || 'Khách vãng lai'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col overflow-hidden">
                            <div className="flex h-full flex-col rounded-lg bg-white p-3 shadow-sm">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-xs font-semibold text-slate-800">
                                        Sản phẩm xuất kho ({issueDetails.length})
                                    </h3>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    {issueDetails.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center text-center">
                                            <Package size={32} className="mb-2 text-slate-300" />
                                            <div className="text-xs text-slate-400">
                                                Chưa có sản phẩm
                                            </div>
                                            <div className="mt-1 text-[10px] text-slate-300">
                                                Vui lòng chọn đơn hàng để bắt đầu
                                            </div>
                                        </div>
                                    ) : (
                                        issueDetails.map(item => (
                                            <div
                                                key={item.key}
                                                className="mb-2 rounded border border-slate-100 bg-slate-50 p-2"
                                            >
                                                <div className="mb-1.5 flex items-center gap-2">
                                                    {item.product?.image && (
                                                        <img
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            className="h-8 w-8 rounded border border-slate-200 object-cover"
                                                        />
                                                    )}
                                                    <div className="flex-1 truncate text-xs font-medium text-slate-800">
                                                        {item.product?.name}
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.key)}
                                                        className="text-xs text-red-500 hover:text-red-700"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="mb-0.5 block text-[10px] text-slate-500">
                                                            SL yêu cầu
                                                        </label>
                                                        <div className="flex h-7 items-center text-xs font-medium text-slate-600">
                                                            {item.quantity}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="mb-0.5 block text-[10px] text-slate-500">
                                                            SL xuất
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={item.quantity}
                                                            onChange={(e) => handleUpdateItem(item.key, 'quantity', parseInt(e.target.value) || 0)}
                                                            className="h-7 w-full rounded border border-slate-200 px-2 text-xs focus:border-emerald-500 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-[180px] shrink-0">
                            <div className="rounded-lg bg-white p-3 shadow-sm">
                                <h3 className="mb-2 text-xs font-semibold text-slate-800">
                                    Tổng kết
                                </h3>

                                <div className="mb-3 space-y-2 text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Số sản phẩm:</span>
                                        <span className="font-medium">{issueDetails.length}</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-slate-700">Tổng SL xuất:</span>
                                            <span className="font-bold text-emerald-600">
                                                {totalQuantity.toLocaleString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[10px] font-medium text-slate-600">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Nhập ghi chú..."
                                        rows={3}
                                        className="w-full resize-none rounded-md border border-slate-200 p-2 text-[11px] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>

                <OrderSelectionModal
                    open={orderModalOpen}
                    orders={orders}
                    selectedOrder={selectedOrder}
                    searchText={searchText}
                    onSearchChange={setSearchText}
                    onSelectionChange={handleSelectOrder}
                    onCancel={() => setOrderModalOpen(false)}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6">
            <div className="mb-4 flex items-center gap-2 text-xs sm:mb-5 sm:text-sm">
                <span className="text-slate-400">Kho</span>
                <span className="text-slate-400">›</span>
                <span
                    className="cursor-pointer text-slate-400 hover:text-slate-600"
                    onClick={() => router.push('/inventories/stock-out')}
                >
                    Phiếu xuất kho
                </span>
                <span className="text-slate-400">›</span>
                <span className="font-medium text-slate-800">
                    Tạo mới phiếu xuất kho
                </span>
            </div>

            <div className="mb-4 rounded-xl bg-white p-4 shadow-sm sm:mb-5 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Button
                        icon={<ArrowLeft size={18} />}
                        onClick={() => router.back()}
                        className="flex h-9 w-9 items-center justify-center rounded-lg sm:h-10 sm:w-10"
                    />
                    <div>
                        <h1 className="mb-1 text-lg font-bold text-slate-800 sm:text-2xl">
                            Tạo mới phiếu xuất kho
                        </h1>
                        <p className="text-xs text-slate-500 sm:text-sm">
                            Xuất sản phẩm từ kho theo đơn hàng
                        </p>
                    </div>
                </div>
            </div>

            <Spin spinning={loading}>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_400px] lg:gap-5">
                    <div className="space-y-4 sm:space-y-5">
                        <IssueFormInfo
                            warehouses={warehouses}
                            selectedWarehouse={selectedWarehouse}
                            selectedOrder={selectedOrder}
                            onWarehouseChange={setSelectedWarehouse}
                            onSelectOrder={() => setOrderModalOpen(true)}
                        />

                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <div className="mb-4 flex items-center justify-between sm:mb-5">
                                <h3 className="text-sm font-semibold text-slate-800 sm:text-base">
                                    Danh sách sản phẩm xuất kho
                                </h3>
                            </div>

                            <IssueItemsTable
                                items={issueDetails}
                                onUpdateItem={handleUpdateItem}
                                onRemoveItem={handleRemoveItem}
                            />
                        </div>
                    </div>

                    <div>
                        <IssueSummaryPanel
                            items={issueDetails}
                            notes={notes}
                            loading={loading}
                            onNotesChange={setNotes}
                            onCancel={() => router.back()}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </Spin>

            <OrderSelectionModal
                open={orderModalOpen}
                orders={orders}
                selectedOrder={selectedOrder}
                searchText={searchText}
                onSearchChange={setSearchText}
                onSelectionChange={handleSelectOrder}
                onCancel={() => setOrderModalOpen(false)}
            />
        </div>
    );
}
