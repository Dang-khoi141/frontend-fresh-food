'use client';

import { Button, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ArrowLeft } from 'lucide-react';
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
    const [issueDate, setIssueDate] = useState<Dayjs>(dayjs());
    const [issueDetails, setIssueDetails] = useState<IssueDetail[]>([]);
    const [notes, setNotes] = useState<string>('');

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
            // Chỉ lấy đơn hàng đã thanh toán (PAID) và chưa giao hàng
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

        // Chuyển đổi order items thành issue details
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

    return (
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ marginBottom: '20px' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Kho</span>
                <span style={{ color: '#94a3b8', margin: '0 8px' }}>›</span>
                <span
                    style={{
                        color: '#94a3b8',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                    onClick={() => router.push('/inventories/stock-out')}
                >
                    Phiếu xuất kho
                </span>
                <span style={{ color: '#94a3b8', margin: '0 8px' }}>›</span>
                <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: 500 }}>
                    Tạo mới phiếu xuất kho
                </span>
            </div>

            <div
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button
                        icon={<ArrowLeft size={20} />}
                        onClick={() => router.back()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                        }}
                    />
                    <div>
                        <h1
                            style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                color: '#1e293b',
                                margin: 0,
                                marginBottom: '4px',
                            }}
                        >
                            Tạo mới phiếu xuất kho
                        </h1>
                        <p
                            style={{
                                fontSize: '14px',
                                color: '#64748b',
                                margin: 0,
                            }}
                        >
                            Xuất sản phẩm từ kho theo đơn hàng
                        </p>
                    </div>
                </div>
            </div>

            <Spin spinning={loading}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 400px',
                        gap: '20px',
                    }}
                >
                    <div>
                        <IssueFormInfo
                            warehouses={warehouses}
                            selectedWarehouse={selectedWarehouse}
                            issueDate={issueDate}
                            selectedOrder={selectedOrder}
                            onWarehouseChange={setSelectedWarehouse}
                            onDateChange={(date) => date && setIssueDate(date)}
                            onSelectOrder={() => setOrderModalOpen(true)}
                        />

                        <div
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '20px',
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#1e293b',
                                        margin: 0,
                                    }}
                                >
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
