"use client";

import { Edit, useForm } from "@refinedev/antd";
import { useParams } from "next/navigation";
import { Form, Input } from "antd";
import { Brand } from "../../../../../lib/interface/brands";

export default function BrandEdit() {
  const params = useParams();
  const brandId = params?.id as string;

  const { formProps, saveButtonProps } = useForm<Brand>({
    resource: "brands",
    id: brandId,
    queryOptions: {
      select: (response: any) => {
        return { data: response?.data?.data ?? {} };
      },
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Contact Name" name="contactName">
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Edit>
  );
}