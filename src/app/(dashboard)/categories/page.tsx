"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Table } from "antd";

export default function CategoryList() {
  const { tableProps } = useTable({
    resource: "categories",
    queryOptions: {
      select: (response: any) => {
        return response.data;
      },
    },
  });

  return (
    <List title="Categories">
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="description" title="Description" />
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
