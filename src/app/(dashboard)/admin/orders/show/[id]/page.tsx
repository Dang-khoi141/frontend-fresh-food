"use client";

import { DateField } from "@refinedev/antd";
import { Tag, Typography, Descriptions, Card, Table, Button, Space, Spin, Alert } from "antd";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useFetchOrder } from "../../../../../../lib/hooks/useFetchOrder";


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

    const { order, loading, error } = useFetchOrder({
        orderId,
        autoFetch: true,
        isAdmin: true,
    });

    const orderItemsColumns = [
        {
            title: "Product",
            dataIndex: ["product", "name"],
            key: "productName",
            render: (text: string, record: any) => (
                <div>
                    <div style={{ fontWeight: "bold" }}>{record.product?.name}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                        ID: {record.product?.id}
                    </div>
                </div>
            ),
        },
        {
            title: "Unit Price",
            dataIndex: "unitPrice",
            key: "unitPrice",
            align: "right" as const,
            render: (value: number) => `${Number(value).toLocaleString()}đ`,
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            align: "center" as const,
        },
        {
            title: "Subtotal",
            dataIndex: "subtotal",
            key: "subtotal",
            align: "right" as const,
            render: (_: any, record: any) => {
                const subtotal = Number(record.unitPrice) * record.quantity;
                return `${subtotal.toLocaleString()}đ`;
            },
        },
    ];

    if (error) {
        return (
            <div style={{ padding: "20px" }}>
                <Alert
                    message="Error loading order"
                    description={error.message}
                    type="error"
                    showIcon
                />
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

    return (
        <Spin spinning={loading} tip="Loading order details...">
            <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                        />
                        <Title level={2} style={{ margin: 0 }}>Order Details</Title>
                    </div>
                    <Button
                        type="primary"
                        onClick={() => router.push(`/admin/orders/edit/${order?.id}`)}
                    >
                        Edit Status
                    </Button>
                </div>

                <Card style={{ marginBottom: "20px" }}>
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Order Number">
                            <Tag color="blue" style={{ fontSize: "14px", fontWeight: "bold" }}>
                                {order?.orderNumber ?? "-"}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Status">
                            <Tag color={ORDER_STATUS_COLORS[order?.status || ""] || "default"} style={{ fontSize: "14px" }}>
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

                <Card style={{ marginBottom: "20px" }} title="Customer Information">
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Email">
                            {order?.user?.email ?? "-"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Shipping Address">
                            {order?.shippingAddress ?? "-"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Notes">
                            {order?.notes ? (
                                <div style={{ whiteSpace: "pre-wrap" }}>
                                    {order.notes}
                                </div>
                            ) : (
                                "-"
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card style={{ marginBottom: "20px" }} title={`Order Items (${order?.items?.length || 0})`}>
                    <Table
                        dataSource={order?.items ?? []}
                        columns={orderItemsColumns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </Card>

                <Card title="Order Summary">
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        maxWidth: "500px",
                        marginLeft: "auto",
                    }}>
                        <div style={{ width: "100%" }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "12px",
                                paddingBottom: "12px",
                                borderBottom: "1px solid #f0f0f0",
                            }}>
                                <span>Subtotal:</span>
                                <span style={{ fontWeight: 500 }}>
                                    {order?.items?.reduce((sum: number, item: any) => {
                                        return sum + (Number(item.unitPrice) * item.quantity);
                                    }, 0).toLocaleString()}đ
                                </span>
                            </div>

                            {order?.discountAmount && order.discountAmount > 0 && (
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "12px",
                                    paddingBottom: "12px",
                                    borderBottom: "1px solid #f0f0f0",
                                }}>
                                    <span>Discount:</span>
                                    <span style={{ color: "#52c41a", fontWeight: 500 }}>
                                        -{Number(order.discountAmount).toLocaleString()}đ
                                    </span>
                                </div>
                            )}

                            {order?.promotionCode && (
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "12px",
                                    paddingBottom: "12px",
                                    borderBottom: "1px solid #f0f0f0",
                                }}>
                                    <span>Promo Code:</span>
                                    <Tag color="green" style={{ fontWeight: 500 }}>
                                        {order.promotionCode}
                                    </Tag>
                                </div>
                            )}

                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#1890ff",
                            }}>
                                <span>Total:</span>
                                <span>{Number(order?.total ?? 0).toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Spin>
    );
}
