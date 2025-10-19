"use client";

import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Avatar, Space, Table } from "antd";

export default function Users() {
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
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="phone" title="Phone" />
        <Table.Column
          dataIndex="avatar"
          title="Avatar"
          render={(value: string | null) =>
            value ? <Avatar src={value} /> : <Avatar>{":"}</Avatar>
          }
        />
        <Table.Column dataIndex="role" title="Role" />
        <Table.Column
          dataIndex="createdAt"
          title="Created At"
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex="updatedAt"
          title="Updated At"
          render={(value: any) => <DateField value={value} />}
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
