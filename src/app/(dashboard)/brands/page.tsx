"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Table } from "antd";

export default function BrandList() {
  const { tableProps } = useTable({
    resource: "brands",
    queryOptions: {
      select: (response: any) => {
        return response.data;
      },
    },
  });

  return (
    <List title="Brands">
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="contactName" title="Contact Name" />
        <Table.Column dataIndex="phone" title="Phone" />
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="address" title="Address" />
        <Table.Column
          title="Actions"
          render={(record: any) => (
            <>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </>
          )}
        />
      </Table>
    </List>
  );
}
