'use client';

import { Button, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ProductSelectionModal } from '../../../../../lib/components/stock-in/product-select';
import { ReceiptFormInfo } from '../../../../../lib/components/stock-in/receipt-info';
import { ReceiptItemsTable } from '../../../../../lib/components/stock-in/receipt-item';
import { ReceiptSummaryPanel } from '../../../../../lib/components/stock-in/receipt-summary';
import { Product } from '../../../../../lib/interface/product';
import { CreateReceiptDto, ReceiptItem } from '../../../../../lib/interface/receipt';
import { Warehouse } from '../../../../../lib/interface/warehouse';
import { productService } from '../../../../../lib/service/product.service';
import { receiptService } from '../../../../../lib/service/receipt.service';
import { warehouseService } from '../../../../../lib/service/warehouse.service';

export default function CreateStockInPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [productModalOpen, setProductModalOpen] = useState(false);

    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [receiptDate, setReceiptDate] = useState<Dayjs>(dayjs());
    const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
    const [notes, setNotes] = useState<string>('');
    const [totalPayment, setTotalPayment] = useState<number>(0);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const total = receiptItems.reduce(
            (sum, item) => sum + (item.quantity || 0) * (item.unitCost || 0),
            0
        );
        setTotalPayment(total);
    }, [receiptItems]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [warehousesData, productsData] = await Promise.all([
                warehouseService.getAllWarehouses(),
                productService.getProducts(),
            ]);
            setWarehouses(warehousesData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProducts = () => {
        if (selectedProducts.length === 0) {
            toast.error('Vui lòng chọn ít nhất một sản phẩm');
            return;
        }

        const newItems: ReceiptItem[] = selectedProducts.map(product => ({
            key: `${product.id}-${Date.now()}-${Math.random()}`,
            productId: product.id,
            quantity: 1,
            unitCost: parseFloat(String(product.price)) || 0,
            product,
        }));

        setReceiptItems([...receiptItems, ...newItems]);
        setSelectedProducts([]);
        setProductModalOpen(false);
        toast.success(`Đã thêm ${newItems.length} sản phẩm`);
    };

    const handleUpdateItem = (key: string, field: 'quantity' | 'unitCost', value: number) => {
        setReceiptItems(
            receiptItems.map(item =>
                item.key === key
                    ? {
                        ...item,
                        [field]: field === 'quantity' ? parseInt(String(value)) || 0 : parseFloat(String(value)) || 0
                    }
                    : item
            )
        );
    };

    const handleRemoveItem = (key: string) => {
        setReceiptItems(receiptItems.filter(item => item.key !== key));
        toast.success('Đã xóa sản phẩm');
    };

    const handleSubmit = async () => {
        if (!selectedWarehouse) {
            toast.error('Vui lòng chọn kho nhập hàng');
            return;
        }

        if (receiptItems.length === 0) {
            toast.error('Vui lòng thêm ít nhất một sản phẩm');
            return;
        }

        const invalidItems = receiptItems.filter(
            item => !item.quantity || item.quantity <= 0 || !item.unitCost || item.unitCost <= 0
        );

        if (invalidItems.length > 0) {
            toast.error('Vui lòng nhập đầy đủ số lượng và giá nhập cho tất cả sản phẩm');
            return;
        }

        try {
            setLoading(true);

            const dto: CreateReceiptDto = {
                warehouseId: selectedWarehouse,
                items: receiptItems.map(item => ({
                    productId: item.productId,
                    quantity: parseInt(String(item.quantity)),
                    unitCost: parseFloat(String(item.unitCost)),
                })),
            };

            await receiptService.createReceipt(dto);
            toast.success('Tạo phiếu nhập hàng thành công!');
            router.push('/inventories/stock-in');
        } catch (error: any) {
            console.error('Error creating receipt:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Không thể tạo phiếu nhập hàng';

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
                    onClick={() => router.push('/inventories/stock-in')}
                >
                    Phiếu nhập hàng
                </span>
                <span style={{ color: '#94a3b8', margin: '0 8px' }}>›</span>
                <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: 500 }}>
                    Tạo mới phiếu nhập hàng
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
                            Tạo mới phiếu nhập hàng
                        </h1>
                        <p
                            style={{
                                fontSize: '14px',
                                color: '#64748b',
                                margin: 0,
                            }}
                        >
                            Thêm sản phẩm mới vào kho của bạn
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
                        <ReceiptFormInfo
                            warehouses={warehouses}
                            selectedWarehouse={selectedWarehouse}
                            receiptDate={receiptDate}
                            onWarehouseChange={setSelectedWarehouse}
                            onDateChange={(date) => date && setReceiptDate(date)}
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
                                    Danh sách sản phẩm
                                </h3>
                                <Button
                                    type="primary"
                                    icon={<Plus size={16} />}
                                    onClick={() => setProductModalOpen(true)}
                                    style={{
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: '#059669',
                                        border: 'none',
                                    }}
                                >
                                    Thêm sản phẩm
                                </Button>
                            </div>

                            <ReceiptItemsTable
                                items={receiptItems}
                                onUpdateItem={handleUpdateItem}
                                onRemoveItem={handleRemoveItem}
                            />
                        </div>
                    </div>

                    <div>
                        <ReceiptSummaryPanel
                            items={receiptItems}
                            totalPayment={totalPayment}
                            notes={notes}
                            loading={loading}
                            onNotesChange={setNotes}
                            onCancel={() => router.back()}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </Spin>

            <ProductSelectionModal
                open={productModalOpen}
                products={products}
                selectedProducts={selectedProducts}
                searchText={searchText}
                onSearchChange={setSearchText}
                onSelectionChange={setSelectedProducts}
                onCancel={() => setProductModalOpen(false)}
                onConfirm={handleAddProducts}
            />
        </div>
    );
}
