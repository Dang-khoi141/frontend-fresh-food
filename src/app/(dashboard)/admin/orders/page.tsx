"use client";

import { SearchOutlined } from "@ant-design/icons";
import {
    DateField,
    EditButton,
    List,
    ShowButton,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Input, Select, Space, Spin, Table, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useFetchOrder } from "../../../../lib/hooks/useFetchOrder";

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

export default function AdminOrdersList() {
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { orders, loading, error, fetchAllOrders } = useFetchOrder({
        autoFetch: true,
        isAdmin: true,
    });

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch = !searchText ||
                order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                (order.user?.email || "").toLowerCase().includes(searchText.toLowerCase());

            const matchesStatus = !statusFilter || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchText, statusFilter]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredOrders.slice(startIndex, startIndex + pageSize);
    }, [filteredOrders, currentPage, pageSize]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Error loading orders");
        }
    }, [error]);


    return (
        <List>
            <div style={{ marginBottom: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Input
                    placeholder="Search by Order Number or Email"
                    prefix={<SearchOutlined />}
                    style={{ width: "300px" }}
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    }}
                    allowClear
                />
                <Select
                    placeholder="Filter by Status"
                    style={{ width: "200px" }}
                    allowClear
                    value={statusFilter}
                    onChange={(value) => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                    }}
                    options={[
                        { label: "Pending", value: "PENDING" },
                        { label: "Confirmed", value: "CONFIRMED" },
                        { label: "Paid", value: "PAID" },
                        { label: "Shipped", value: "SHIPPED" },
                        { label: "Delivered", value: "DELIVERED" },
                        { label: "Canceled", value: "CANCELED" },
                    ]}
                />
            </div>

            <Spin spinning={loading} tip="Loading orders...">
                <Table
                    dataSource={paginatedOrders}
                    rowKey="id"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: filteredOrders.length,
                        onChange: setCurrentPage,
                        showSizeChanger: true,
                    }}
                >
                    <Table.Column
                        dataIndex="orderNumber"
                        title="Order Number"
                        render={(value: string) => (
                            <Tag color="blue" style={{ fontWeight: "bold" }}>
                                {value}
                            </Tag>
                        )}
                    />

                    <Table.Column
                        dataIndex={["user", "email"]}
                        title="Customer"
                        render={(value: string) => value || "-"}
                    />

                    <Table.Column
                        dataIndex="status"
                        title="Status"
                        render={(value: string) => (
                            <Tag color={ORDER_STATUS_COLORS[value] || "default"}>
                                {value}
                            </Tag>
                        )}
                    />

                    <Table.Column
                        dataIndex="total"
                        title="Total Amount"
                        render={(value: number) => (
                            <span style={{ fontWeight: 500 }}>
                                {Number(value).toLocaleString()}₫
                            </span>
                        )}
                        align="right"
                    />

                    <Table.Column
                        dataIndex="discountAmount"
                        title="Discount"
                        render={(value: number | undefined) =>
                            value ? (
                                <span style={{ color: "#52c41a", fontWeight: 500 }}>
                                    -{Number(value).toLocaleString()}₫
                                </span>
                            ) : (
                                "-"
                            )
                        }
                        align="right"
                    />

                    <Table.Column
                        dataIndex="paymentMethod"
                        title="Payment"
                        render={(value: string) => (
                            <Tag color={PAYMENT_METHOD_COLORS[value] || "default"}>
                                {value}
                            </Tag>
                        )}
                    />

                    <Table.Column
                        dataIndex="createdAt"
                        title="Created At"
                        render={(value: any) => (
                            <DateField value={value} format="DD/MM/YYYY HH:mm" />
                        )}
                    />

                    <Table.Column
                        title="Actions"
                        dataIndex="actions"
                        render={(_, record: BaseRecord) => (
                            <Space>
                                <EditButton hideText size="small" recordItemId={record.id} />
                                <ShowButton hideText size="small" recordItemId={record.id} />
                            </Space>
                        )}
                    />
                </Table>
            </Spin>
        </List>
    );
}
