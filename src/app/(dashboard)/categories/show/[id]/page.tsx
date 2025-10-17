"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core"
import { Typography } from "antd";

const { Title, Text } = Typography;

export default function CategoryShow() {
  const { queryResult } = useShow();
  const category = queryResult?.data?.data;

  return (
    <Show>
      <Title level={5}>Name</Title>
      <Text>{category?.name}</Text>

      <Title level={5}>Description</Title>
      <Text>{category?.description}</Text>

      <Title level={5}>Created At</Title>
      <Text>{category?.createdAt}</Text>

      <Title level={5}>Updated At</Title>
      <Text>{category?.updatedAt}</Text>
    </Show>
  );
}
