"use client";

import { DateField } from "@refinedev/antd";
import { Tag, Typography, Descriptions, Card, Table, Button, Spin, Alert } from "antd";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useFetchOrder } from "../../../../../../lib/hooks/useFetchOrder";
import { useState, useEffect } from "react";


const { Title } = Typography;

const ORDER_STATUS_COLORS: Record<string, string> = {
    PENDING: "orange",
    CONFIRMED: "blue",
    PAID: "cyan",
    SHIPPED: "purple",
    DELIVERED: "green",
    CANCELED: "red",
};

const PAYMENT_METHOD_COLORS: Record<string, string> = {
    COD: "blue",
    ONLINE: "green",
};

export default function OrderShow() {
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id as string;
    const [isPortrait, setIsPortrait] = useState(false);

    const { order, loading, error } = useFetchOrder({
        orderId,
        autoFetch: true,
        isAdmin: true,
    });

    useEffect(() => {
        const checkOrientation = () => {
            const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 768;
            setIsPortrait(portrait);
        };

        checkOrientation();

        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    const orderItemsColumns = [
        {
            title: "Product",
            dataIndex: ["product", "name"],
            key: "productName",
            width: 250,
            render: (text: string, record: any) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 line-clamp-2">{record.product?.name}</span>
                    <span className="text-xs text-gray-500">ID: {record.product?.id}</span>
                </div>
            ),
        },
        {
            title: "Unit Price",
            dataIndex: "unitPrice",
            key: "unitPrice",
            width: 120,
            align: "right" as const,
            render: (value: number) => (
                <span className="font-medium text-gray-700">
                    {Number(value).toLocaleString()}đ
                </span>
            ),
        },
        {
            title: "Qty",
            dataIndex: "quantity",
            key: "quantity",
            width: 80,
            align: "center" as const,
        },
        {
            title: "Subtotal",
            dataIndex: "subtotal",
            key: "subtotal",
            width: 150,
            align: "right" as const,
            render: (_: any, record: any) => {
                const subtotal = Number(record.unitPrice) * record.quantity;
                return (
                    <span className="font-bold text-gray-900">
                        {subtotal.toLocaleString()}đ
                    </span>
                );
            },
        },
    ];

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
                    Để xem chi tiết đơn hàng đầy đủ, vui lòng xoay ngang điện thoại của bạn.
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-[50vh]">
                <Alert
                    message="Error loading order"
                    description={error.message}
                    type="error"
                    showIcon
                    className="mb-4 max-w-md w-full"
                />
                <Button type="primary" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <Spin spinning={loading} tip="Loading order details...">
            <div className="p-4 md:p-6 max-w-7xl mx-auto pb-20">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Button
                            shape="circle"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                        />
                        <Title level={2} style={{ margin: 0, fontSize: '1.5rem' }}>Order Details</Title>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => router.push(`/admin/orders/edit/${order?.id}`)}
                    >
                        Edit Status
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <Card className="shadow-sm rounded-lg" bordered={false} title="General Information">
                            <Descriptions
                                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                                bordered
                                size="middle"
                            >
                                <Descriptions.Item label="Order Number">
                                    <Tag color="blue" className="font-bold text-sm">
                                        {order?.orderNumber ?? "-"}
                                    </Tag>
                                </Descriptions.Item>

                                <Descriptions.Item label="Status">
                                    <Tag color={ORDER_STATUS_COLORS[order?.status || ""] || "default"} className="font-semibold">
                                        {order?.status ?? "-"}
                                    </Tag>
                                </Descriptions.Item>

                                <Descriptions.Item label="Payment Method">
                                    <Tag color={PAYMENT_METHOD_COLORS[order?.paymentMethod || ""] || "default"}>
                                        {order?.paymentMethod ?? "-"}
                                    </Tag>
                                </Descriptions.Item>

                                <Descriptions.Item label="Created At">
                                    {order?.createdAt ? (
                                        <DateField value={order.createdAt} format="DD/MM/YYYY HH:mm" />
                                    ) : (
                                        "-"
                                    )}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card className="shadow-sm rounded-lg" bordered={false} title={`Order Items (${order?.items?.length || 0})`}>
                            <Table
                                dataSource={order?.items ?? []}
                                columns={orderItemsColumns}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                scroll={{ x: 600 }}
                            />
                        </Card>
                    </div>

                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <Card className="shadow-sm rounded-lg" bordered={false} title="Customer & Delivery">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <span className="text-gray-500 text-sm block mb-1">Email</span>
                                    <span className="font-medium text-gray-800 break-all">{order?.user?.email ?? "-"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm block mb-1">Shipping Address</span>
                                    <div className="p-3 bg-gray-50 rounded text-gray-700 text-sm">
                                        {order?.shippingAddress ?? "No address provided"}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm block mb-1">Notes</span>
                                    <div className="p-3 bg-yellow-50 rounded text-gray-700 text-sm italic min-h-[60px]">
                                        {order?.notes || "No notes"}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="shadow-sm rounded-lg bg-blue-50 border-blue-100" bordered={false} title="Payment Summary">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-800">
                                        {order?.items?.reduce((sum: number, item: any) => {
                                            return sum + (Number(item.unitPrice) * item.quantity);
                                        }, 0).toLocaleString()}đ
                                    </span>
                                </div>

                                {order?.discountAmount && order.discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <span>Discount</span>
                                        <span className="font-medium">
                                            -{Number(order.discountAmount).toLocaleString()}đ
                                        </span>
                                    </div>
                                )}

                                {order?.promotionCode && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Promo Code</span>
                                        <Tag color="green">{order.promotionCode}</Tag>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-blue-200">
                                    <span className="text-lg font-bold text-blue-800">Total</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {Number(order?.total ?? 0).toLocaleString()}đ
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Spin>
    );
}