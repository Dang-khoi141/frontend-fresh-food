"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import {
    Alert,
    App,
    Button,
    Card,
    Descriptions,
    Form,
    Select,
    Space,
    Spin,
    Tag,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Order } from "../../../../../../lib/interface/order";
import { orderService } from "../../../../../../lib/service/order.service";

const ORDER_STATUS_COLORS: Record<string, string> = {
    PENDING: "orange",
    CONFIRMED: "blue",
    PAID: "cyan",
    SHIPPED: "purple",
    DELIVERED: "green",
    CANCELED: "red",
};

const STATUS_TRANSITIONS_COD: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELED"],
    CONFIRMED: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELED: [],
};

const STATUS_TRANSITIONS_ONLINE: Record<string, string[]> = {
    PENDING: ["PAID", "CANCELED"],
    PAID: [],
    DELIVERED: [],
    CANCELED: [],
};

export default function OrderEdit() {
    const { message } = App.useApp();
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id as string;

    const { formProps } = useForm({
        resource: "orders",
        queryOptions: {
            enabled: false,
        }
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isPortrait, setIsPortrait] = useState(false);

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

    useEffect(() => {
        if (!orderId) return;

        const fetchOrder = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await orderService.getOrderDetailAdmin(orderId);
                setOrder(data);
            } catch (err: any) {
                console.error("Error loading order:", err);
                const errorObj = err instanceof Error ? err : new Error(String(err));
                setError(errorObj);
                toast.error(err.response?.data?.message || err.message || "Error loading order");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const currentStatus = order?.status || "";
    const paymentMethod = order?.paymentMethod || "";

    const statusTransitions = paymentMethod === "COD"
        ? STATUS_TRANSITIONS_COD
        : STATUS_TRANSITIONS_ONLINE;

    const nextStatuses = useMemo(() => {
        return statusTransitions[currentStatus] || [];
    }, [currentStatus, paymentMethod]);

    const availableTransitions = useMemo(() => {
        return nextStatuses.map((status) => ({
            label: (
                <div className="flex items-center gap-2">
                    <Tag color={ORDER_STATUS_COLORS[status]}>
                        {status}
                    </Tag>
                </div>
            ),
            value: status,
        }));
    }, [nextStatuses]);

    const handleFinish = async (values: any) => {
        try {
            if (!values.status) {
                message.error("Please select a status");
                return;
            }

            if (values.status === currentStatus) {
                message.warning("Status has not changed");
                return;
            }

            setIsUpdating(true);

            await orderService.updateOrderStatus(orderId, values.status);

            const updatedOrder = await orderService.getOrderDetailAdmin(orderId);
            setOrder(updatedOrder);

            message.success("Order status updated successfully!");
            setTimeout(() => {
                router.back();
            }, 800);
        } catch (error: any) {
            console.error("Error updating order status:", error);
            message.error(
                error.response?.data?.message || error.message || "Error updating order status"
            );
        } finally {
            setIsUpdating(false);
        }
    };

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
                    Để có trải nghiệm tốt nhất khi quản lý đơn hàng, vui lòng xoay ngang điện thoại của bạn.
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 flex flex-col items-center justify-center h-[50vh]">
                <h3 className="text-lg font-semibold text-red-600">Error loading order</h3>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <Button
                    type="primary"
                    onClick={() => router.back()}
                >
                    Go Back
                </Button>
            </div>
        );
    }

    const currentStatusColor = ORDER_STATUS_COLORS[currentStatus] || "default";
    const isLocked = nextStatuses.length === 0;

    const paymentMethodText = paymentMethod === "COD"
        ? "Thanh toán khi nhận hàng (COD)"
        : "Thanh toán trực tuyến (Online)";

    return (
        <Spin spinning={loading} tip="Loading order...">
            <div className="p-4 md:p-6 max-w-7xl mx-auto pb-20">
                <div className="flex items-center gap-3 mb-6">
                    <Button
                        type="default"
                        shape="circle"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.back()}
                    />
                    <h2 className="text-xl md:text-2xl font-bold m-0 text-gray-800">Update Order Status</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                         <Card title="Current Order Information" className="shadow-sm rounded-lg" bordered={false}>
                            <Descriptions
                                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                                size="middle"
                                layout="vertical"
                                labelStyle={{ fontWeight: 500, color: '#6b7280' }}
                                contentStyle={{ fontWeight: 600 }}
                            >
                                <Descriptions.Item label="Order Number">
                                    <Tag color="blue" className="text-base px-2 py-0.5">
                                        {order?.orderNumber ?? "-"}
                                    </Tag>
                                </Descriptions.Item>

                                <Descriptions.Item label="Current Status">
                                    <Tag color={currentStatusColor} className="text-base px-2 py-0.5 uppercase">
                                        {currentStatus || "-"}
                                    </Tag>
                                </Descriptions.Item>

                                <Descriptions.Item label="Customer">
                                    <span className="text-gray-800">
                                        {order?.user?.email ?? "-"}
                                    </span>
                                </Descriptions.Item>

                                <Descriptions.Item label="Total Amount">
                                    <span className="text-lg text-blue-600 font-bold">
                                        {Number(order?.total ?? 0).toLocaleString()}đ
                                    </span>
                                </Descriptions.Item>

                                <Descriptions.Item label="Payment Method" span={2}>
                                    <Tag color={order?.paymentMethod === "COD" ? "blue" : "green"}>
                                        {paymentMethodText}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                         {paymentMethod === "COD" && currentStatus === "PENDING" && (
                            <Alert
                                message="Action Required: Pending COD"
                                description="Review order details. Confirm to proceed or Cancel if invalid."
                                type="info"
                                showIcon
                                className="rounded-lg border-blue-100 bg-blue-50"
                            />
                        )}

                        {paymentMethod === "COD" && currentStatus === "CONFIRMED" && (
                            <Alert
                                message="Action Required: Shipping"
                                description="Mark as SHIPPED when handing over to the carrier."
                                type="info"
                                showIcon
                                className="rounded-lg border-blue-100 bg-blue-50"
                            />
                        )}

                        {paymentMethod === "COD" && currentStatus === "SHIPPED" && (
                            <Alert
                                message="Action Required: Delivery"
                                description="Mark as DELIVERED after successful cash collection."
                                type="info"
                                showIcon
                                className="rounded-lg border-blue-100 bg-blue-50"
                            />
                        )}

                        {paymentMethod !== "COD" && currentStatus === "PAID" && (
                            <Alert
                                message="Order Paid Online"
                                description="Payment verified. Process for shipping if applicable."
                                type="success"
                                showIcon
                                className="rounded-lg border-green-100 bg-green-50"
                            />
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <Card
                            title="Update Status"
                            className="shadow-md border-t-4 border-t-blue-500 rounded-lg sticky top-6"
                        >
                            <Form
                                {...formProps}
                                layout="vertical"
                                onFinish={handleFinish}
                            >
                                <Form.Item
                                    label="New Status"
                                    name="status"
                                    initialValue={currentStatus}
                                    rules={[
                                        { required: true, message: "Please select a new status" },
                                    ]}
                                >
                                    <Select
                                        className="w-full"
                                        size="large"
                                        placeholder="Select new status"
                                        disabled={isLocked}
                                        onChange={setSelectedStatus}
                                        options={[
                                            {
                                                label: "Current Status",
                                                options: [
                                                    {
                                                        label: (
                                                            <div className="flex justify-between items-center">
                                                                <span>{currentStatus}</span>
                                                                <Tag color={currentStatusColor}>Current</Tag>
                                                            </div>
                                                        ),
                                                        value: currentStatus,
                                                        disabled: true,
                                                    },
                                                ],
                                            },
                                            {
                                                label: "Available Transitions",
                                                options: availableTransitions,
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                <div className="flex flex-col gap-3 mt-6">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        block
                                        disabled={isLocked}
                                        loading={isUpdating}
                                    >
                                        Update Status
                                    </Button>
                                    <Button
                                        size="large"
                                        block
                                        onClick={() => router.back()}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>
        </Spin>
    );
}