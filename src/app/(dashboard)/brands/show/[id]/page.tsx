"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Descriptions, Card } from "antd";
import { Brand } from "../../../../../lib/interface/brands";

export default function BrandShow() {
  const params = useParams();
  const brandId = params?.id as string;

  const { query: queryResult } = useShow<Brand>({
    resource: "brands",
    id: brandId,
    queryOptions: {
      select: (response: any) => {
        return { data: response?.data?.data as Brand };
      },
    },
  });

  const record = queryResult?.data?.data;
  const isLoading = queryResult?.isLoading ?? true;

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Descriptions title="Brand Details" bordered column={1}>
          <Descriptions.Item label="Name">
            {record?.name ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Name">
            {record?.contactName ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {record?.phone ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {record?.email ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {record?.address ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {record?.createdAt ? new Date(record.createdAt).toLocaleString() : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {record?.updatedAt ? new Date(record.updatedAt).toLocaleString() : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
}
