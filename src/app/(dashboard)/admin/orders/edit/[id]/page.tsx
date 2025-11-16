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
import { useFetchOrder } from "../../../../../../lib/hooks/useFetchOrder";

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
    SHIPPED: ["PAID"],
    PAID: ["DELIVERED"],
    DELIVERED: [],
    CANCELED: [],
};

const STATUS_TRANSITIONS_ONLINE: Record<string, string[]> = {
    PAID: ["SHIPPED", "CANCELED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELED: [],
};

export default function OrderEdit() {
    const { message } = App.useApp();
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id as string;

    const { formProps } = useForm({ resource: "orders" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const { order, loading, error, updateStatus } = useFetchOrder({
        orderId,
        autoFetch: true,
        isAdmin: true,
    });

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Error loading order");
        }
    }, [error]);

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
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            await updateStatus(values.status);
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

    if (error) {
        return (
            <div style={{ padding: "20px" }}>
                <h3>Error loading order</h3>
                <p>{error.message}</p>
                <Button
                    type="primary"
                    style={{ marginTop: "20px" }}
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
            <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.back()}
                    />
                    <h2 style={{ margin: 0 }}>Update Order Status</h2>
                </div>

                <Card title="Current Order Information" style={{ marginBottom: "20px" }}>
                    <Descriptions column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }} size="small">
                        <Descriptions.Item label="Order Number">
                            <Tag color="blue" style={{ fontWeight: "bold" }}>
                                {order?.orderNumber ?? "-"}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Current Status">
                            <Tag color={currentStatusColor} style={{ fontSize: "14px" }}>
                                {currentStatus || "-"}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Customer">
                            <span style={{ fontSize: "12px" }}>
                                {order?.user?.email ?? "-"}
                            </span>
                        </Descriptions.Item>

                        <Descriptions.Item label="Payment Method">
                            <Tag color={order?.paymentMethod === "COD" ? "blue" : "green"}>
                                {paymentMethodText}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Order Total">
                            <span style={{ fontWeight: "bold", color: "#1890ff" }}>
                                {Number(order?.total ?? 0).toLocaleString()}đ
                            </span>
                        </Descriptions.Item>

                        <Descriptions.Item label="Items Count">
                            <Tag>{order?.items?.length ?? 0} items</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {isLocked && (
                    <Alert
                        message="Order Locked"
                        description={`This order has a final status of "${currentStatus}" and cannot be modified.`}
                        type="warning"
                        showIcon
                        style={{ marginBottom: "20px" }}
                    />
                )}

                {paymentMethod === "COD" && currentStatus === "PENDING" && (
                    <Alert
                        message="Pending Orders (COD)"
                        description="Pending orders can be confirmed or canceled. After confirmation, mark as shipped when ready for delivery. After delivery and cash payment received, mark as delivered."
                        type="info"
                        showIcon
                        style={{ marginBottom: "20px" }}
                    />
                )}

                {paymentMethod === "COD" && currentStatus === "CONFIRMED" && (
                    <Alert
                        message="Confirmed Orders (COD)"
                        description="Order confirmed. Mark as shipped when sending to customer. Payment will be collected upon delivery."
                        type="info"
                        showIcon
                        style={{ marginBottom: "20px" }}
                    />
                )}

                {paymentMethod === "COD" && currentStatus === "SHIPPED" && (
                    <Alert
                        message="Shipped Orders (COD)"
                        description="Order in delivery. Once delivered and customer pays with cash, mark as PAID. Then update to DELIVERED."
                        type="info"
                        showIcon
                        style={{ marginBottom: "20px" }}
                    />
                )}

                {paymentMethod === "COD" && currentStatus === "PAID" && (
                    <Alert
                        message="Paid Orders (COD)"
                        description="Payment received from customer. Mark as delivered to complete the order."
                        type="info"
                        showIcon
                        style={{ marginBottom: "20px" }}
                    />
                )}

                {paymentMethod !== "COD" && currentStatus === "PAID" && (
                    <Alert
                        message="Paid Orders (Online Payment)"
                        description="Payment already received. Mark as shipped when sending to customer."
                        type="info"
                        showIcon
                        style={{ marginBottom: "20px" }}
                    />
                )}

                <Card title="Status Transition" style={{ marginBottom: "20px" }}>
                    <Form
                        {...formProps}
                        layout="vertical"
                        onFinish={handleFinish}
                    >
                        <Form.Item
                            label="Select New Status"
                            name="status"
                            initialValue={currentStatus}
                            rules={[
                                { required: true, message: "Please select a new status" },
                            ]}
                        >
                            <Select
                                placeholder="Select new status"
                                disabled={isLocked}
                                onChange={setSelectedStatus}
                                options={[
                                    {
                                        label: "Current Status",
                                        options: [
                                            {
                                                label: (
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <span>{currentStatus}</span>
                                                        <Tag color={currentStatusColor} style={{ marginLeft: "8px" }}>
                                                            Current
                                                        </Tag>
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

                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={isLocked}
                                    loading={isUpdating}
                                >
                                    Update Status
                                </Button>
                                <Button onClick={() => router.back()}>
                                    Cancel
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Spin>
    );
}
