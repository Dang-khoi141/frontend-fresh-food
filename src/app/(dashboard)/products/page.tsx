"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Table, Image  } from "antd";

export default function ProductList() {
  const { tableProps } = useTable({
    resource: "products",
    queryOptions: {
      select: (response: any) => {
        return response.data;
      },
    },
  });

  return (
    <List title="Products">
      <Table {...tableProps} rowKey="id">
          <Table.Column
          dataIndex="image"
          title="Image"
          render={(value: string) =>
            value ? (
              <Image
                src={value}
                alt="Product Image"
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            ) : (
              "No Image"
            )
          }
        />
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="price" title="Price" />
        <Table.Column
          dataIndex="isActive"
          title="Active"
          render={(value: boolean) => (value ? "✅ Yes" : "❌ No")}
        />
        <Table.Column dataIndex={["brand", "name"]} title="Brand" />
        <Table.Column dataIndex={["category", "name"]} title="Category" />
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
