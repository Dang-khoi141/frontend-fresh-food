"use client";

import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Descriptions, Image, Tag, Typography } from "antd";
import { Product } from "../../../../../lib/interface/product";

const { Title } = Typography;

export default function ProductShow() {
  const { query: queryResult } = useShow<Product>({
    resource: "products",
    queryOptions: {
      select: (response: any) => {
        return {
          data: response?.data?.data as Product,
        };
      },
    },
  });

  const record = queryResult?.data?.data;
  const isLoading = queryResult?.isLoading ?? true;

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Name">
            <TextField value={record?.name ?? "-"} />
          </Descriptions.Item>

          <Descriptions.Item label="Price">
            {record?.price ? (
              <Tag color="green" style={{ fontSize: "14px" }}>
                {Number(record.price).toLocaleString()}đ
              </Tag>
            ) : (
              "-"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Discount (%)">
            {record?.discountPercentage !== undefined ? (
              <Tag
                color={record.discountPercentage > 0 ? "blue" : "default"}
                style={{ fontSize: "14px" }}
              >
                {record.discountPercentage}%
              </Tag>
            ) : (
              "-"
            )}
          </Descriptions.Item>


          <Descriptions.Item label="Stock">
            <TextField value={record?.stock ?? "-"} />
          </Descriptions.Item>

          <Descriptions.Item label="Description">
            <TextField value={record?.description ?? "-"} />
          </Descriptions.Item>

          {record?.image && (
            <Descriptions.Item label="Image">
              <Image
                src={record.image}
                alt={record.name}
                style={{ maxWidth: "300px", maxHeight: "300px" }}
              />
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Brand">
            <TextField value={record?.brand?.name ?? "-"} />
          </Descriptions.Item>

          <Descriptions.Item label="Category">
            <TextField value={record?.category?.name ?? "-"} />
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={record?.isActive ? "green" : "red"}>
              {record?.isActive ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {record?.createdAt ? (
              <DateField value={record.createdAt} format="DD/MM/YYYY HH:mm" />
            ) : (
              "-"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            {record?.updatedAt ? (
              <DateField value={record.updatedAt} format="DD/MM/YYYY HH:mm" />
            ) : (
              "-"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
}
