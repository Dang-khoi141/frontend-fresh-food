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
    const [isPortrait, setIsPortrait] = useState(false);

    const { orders, loading, error, fetchAllOrders } = useFetchOrder({
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
                    Bảng danh sách đơn hàng chứa nhiều thông tin. Vui lòng xoay ngang điện thoại để xem chi tiết.
                </p>
            </div>
        );
    }

    return (
        <List>
            <div className="mb-4 flex flex-col md:flex-row gap-3">
                <Input
                    placeholder="Search by Order # or Email"
                    prefix={<SearchOutlined />}
                    className="w-full md:w-80"
                    size="large"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    }}
                    allowClear
                />
                <Select
                    placeholder="Filter by Status"
                    className="w-full md:w-52"
                    size="large"
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
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Table
                        dataSource={paginatedOrders}
                        rowKey="id"
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: filteredOrders.length,
                            onChange: setCurrentPage,
                            showSizeChanger: true,
                            position: ["bottomCenter"],
                        }}
                        scroll={{ x: 1000 }} // Enable horizontal scrolling for landscape mobile/tablet
                    >
                        <Table.Column
                            dataIndex="orderNumber"
                            title="Order Number"
                            width={140}
                            fixed="left"
                            render={(value: string) => (
                                <Tag color="blue" className="font-bold cursor-pointer">
                                    {value}
                                </Tag>
                            )}
                        />

                        <Table.Column
                            dataIndex={["user", "email"]}
                            title="Customer"
                            width={220}
                            render={(value: string) => <span className="text-gray-600 truncate block max-w-[200px]" title={value}>{value || "-"}</span>}
                        />

                        <Table.Column
                            dataIndex="status"
                            title="Status"
                            width={120}
                            render={(value: string) => (
                                <Tag color={ORDER_STATUS_COLORS[value] || "default"} className="rounded-full">
                                    {value}
                                </Tag>
                            )}
                        />

                        <Table.Column
                            dataIndex="total"
                            title="Total Amount"
                            width={150}
                            render={(value: number) => (
                                <span className="font-semibold text-gray-800">
                                    {Number(value).toLocaleString()}₫
                                </span>
                            )}
                            align="right"
                        />

                        <Table.Column
                            dataIndex="discountAmount"
                            title="Discount"
                            width={120}
                            render={(value: number | undefined) =>
                                value ? (
                                    <span className="text-green-600 font-medium">
                                        -{Number(value).toLocaleString()}₫
                                    </span>
                                ) : (
                                    <span className="text-gray-300">-</span>
                                )
                            }
                            align="right"
                        />

                        <Table.Column
                            dataIndex="paymentMethod"
                            title="Payment"
                            width={100}
                            render={(value: string) => (
                                <Tag color={PAYMENT_METHOD_COLORS[value] || "default"}>
                                    {value}
                                </Tag>
                            )}
                        />

                        <Table.Column
                            dataIndex="createdAt"
                            title="Created At"
                            width={150}
                            render={(value: any) => (
                                <span className="text-gray-500 text-sm">
                                    <DateField value={value} format="DD/MM/YYYY" />
                                </span>
                            )}
                        />

                        <Table.Column
                            title="Actions"
                            dataIndex="actions"
                            width={100}
                            fixed="right"
                            render={(_, record: BaseRecord) => (
                                <Space>
                                    <EditButton hideText size="small" recordItemId={record.id} />
                                    <ShowButton hideText size="small" recordItemId={record.id} />
                                </Space>
                            )}
                        />
                    </Table>
                </div>
            </Spin>
        </List>
    );
}
