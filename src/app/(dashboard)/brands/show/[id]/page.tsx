"use client";

import { Show, } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Descriptions } from "antd";

export default function BrandShow() {
  const { queryResult } = useShow({ resource: "brands" });
  const record = queryResult?.data?.data;

  return (
    <Show isLoading={queryResult?.isLoading}>
      <Descriptions title="Brand Details" bordered column={1}>
        <Descriptions.Item label="Name">{record?.name}</Descriptions.Item>
        <Descriptions.Item label="Contact Name">{record?.contactName}</Descriptions.Item>
        <Descriptions.Item label="Phone">{record?.phone}</Descriptions.Item>
        <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
        <Descriptions.Item label="Address">{record?.address}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          {record?.createdAt ? new Date(record.createdAt).toLocaleString() : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {record?.updatedAt ? new Date(record.updatedAt).toLocaleString() : "-"}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
}
