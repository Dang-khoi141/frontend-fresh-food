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

export default function PromotionsList() {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    const safeTableProps = {
        ...tableProps,
        dataSource: Array.isArray((tableProps?.dataSource as any)?.data)
            ? (tableProps.dataSource as any).data
            : Array.isArray(tableProps?.dataSource)
                ? tableProps.dataSource
                : [],
    };

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
