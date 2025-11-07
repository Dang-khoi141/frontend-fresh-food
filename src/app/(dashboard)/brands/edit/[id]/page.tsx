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
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter brand name" },
            { min: 2, message: "Brand name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Apple" />
        </Form.Item>

        <Form.Item
          label="Contact Name"
          name="contactName"
          rules={[
            {
              pattern: /^[A-Za-zÀ-ỹ\s]+$/,
              message: "Contact name can only contain letters and spaces",
            },
          ]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              pattern: /^(0|\+84)\d{9}$/,
              message:
                "Invalid Vietnamese phone number (e.g. 0912345678 or +84912345678)",
            },
          ]}
        >
          <Input placeholder="+84 912 345 678" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="brand@example.com" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[
            { max: 255, message: "Address must be less than 255 characters" },
          ]}
        >
          <Input.TextArea placeholder="1 Infinite Loop, Cupertino, CA" />
        </Form.Item>
      </Form>
    </Edit>
  );
}
