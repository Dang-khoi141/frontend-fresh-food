"use client";

import {
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";

export default function PromotionsList() {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

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

    const safeTableProps = {
        ...tableProps,
        dataSource: Array.isArray((tableProps?.dataSource as any)?.data)
            ? (tableProps.dataSource as any).data
            : Array.isArray(tableProps?.dataSource)
                ? tableProps.dataSource
                : [],
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
                    Để có trải nghiệm tốt nhất và xem đầy đủ thông tin bảng biểu, vui lòng xoay ngang điện thoại của bạn.
                </p>
            </div>
        );
    }

    return (
        <List>
            <Table {...safeTableProps} rowKey="id">
                <Table.Column
                    dataIndex="code"
                    title="Code"
                    render={(value: string) => (
                        <Tag color="blue" style={{ fontWeight: "bold" }}>
                            {value}
                        </Tag>
                    )}
                />

                <Table.Column
                    dataIndex="description"
                    title="Description"
                    render={(value: string) => value || "-"}
                />

                <Table.Column
                    dataIndex="discountPercent"
                    title="Discount %"
                    render={(value: number | null) =>
                        value ? `${value}%` : "-"
                    }
                />

                <Table.Column
                    dataIndex="discountAmount"
                    title="Discount Amount"
                    render={(value: number | null) =>
                        value ? `${Number(value).toLocaleString()}đ` : "-"
                    }
                />

                <Table.Column
                    dataIndex="minOrderValue"
                    title="Min Order Value"
                    render={(value: number | null) =>
                        value ? `${Number(value).toLocaleString()}đ` : "-"
                    }
                />

                <Table.Column
                    dataIndex="startDate"
                    title="Start Date"
                    render={(value: any) =>
                        value ? <DateField value={value} format="DD/MM/YYYY" /> : "-"
                    }
                />

                <Table.Column
                    dataIndex="endDate"
                    title="End Date"
                    render={(value: any) =>
                        value ? <DateField value={value} format="DD/MM/YYYY" /> : "-"
                    }
                />

                <Table.Column
                    dataIndex="isActive"
                    title="Status"
                    render={(value: boolean) => (
                        <Tag color={value ? "green" : "red"}>
                            {value ? "Active" : "Inactive"}
                        </Tag>
                    )}
                />

                <Table.Column
                    dataIndex="createdAt"
                    title="Created At"
                    render={(value: any) => <DateField value={value} format="DD/MM/YYYY HH:mm" />}
                />

                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
}
