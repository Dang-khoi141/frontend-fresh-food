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
import { type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table } from "antd";

export default function Users() {
  const { result, tableProps } = useTable({
    syncWithLocation: true,
  });

  const {
    result: { data: user },
    query: { isLoading: userIsLoading },
  } = useMany({
    resource: "users",
    ids: result?.data?.map((item) => item?.category?.id).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!result?.data,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title={"Name"} />
        <Table.Column dataIndex="email" title={"Email"} />
        <Table.Column
          dataIndex="password"
          title={"Password"}
          render={(value: any) => {
            if (!value) return "-";
            return <MarkdownField value={value.slice(0, 80) + "..."} />;
          }}
        />
        <Table.Column dataIndex="role" title={"Roles"} />
        <Table.Column
          dataIndex={["createdAt"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex={["updatedAt"]}
          title={"Update at"}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title={"Actions"}
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
