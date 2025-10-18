"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Descriptions, Card, Typography } from "antd";
import { Category } from "../../../../../lib/interface/category";

const { Text } = Typography;

export default function CategoryShow() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { query: queryResult } = useShow<Category>({
    resource: "categories",
    id: categoryId,
    queryOptions: {
      select: (response: any) => {
        return { data: response?.data?.data as Category };
      },
    },
  });

  const category = queryResult?.data?.data;
  const isLoading = queryResult?.isLoading ?? true;

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Name">
            <Text>{category?.name ?? "-"}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Description">
            <Text>{category?.description ?? "-"}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            <Text>
              {category?.createdAt
                ? new Date(category.createdAt).toLocaleString()
                : "-"}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            <Text>
              {category?.updatedAt
                ? new Date(category.updatedAt).toLocaleString()
                : "-"}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
}
