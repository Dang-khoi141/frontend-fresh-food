"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core"
import { Typography } from "antd";

const { Title, Text } = Typography;

export default function ProductShow() {
  const { queryResult } = useShow();
  const product = queryResult?.data?.data;

  return (
    <Show>
      <Title level={5}>Name</Title>
      <Text>{product?.name}</Text>

      <Title level={5}>Price</Title>
      <Text>{product?.price}</Text>

      <Title level={5}>Stock</Title>
      <Text>{product?.stock}</Text>

      <Title level={5}>Image</Title>
      <Text>{product?.image}</Text>

      <Title level={5}>Description</Title>
      <Text>{product?.description}</Text>

      <Title level={5}>Active</Title>
      <Text>{product?.isActive ? "Yes" : "No"}</Text>

      <Title level={5}>Brand</Title>
      <Text>{product?.brand?.name}</Text>

      <Title level={5}>Category</Title>
      <Text>{product?.category?.name}</Text>

      <Title level={5}>Created At</Title>
      <Text>{product?.createdAt}</Text>

      <Title level={5}>Updated At</Title>
      <Text>{product?.updatedAt}</Text>
    </Show>
  );
}
