"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export default function BrandCreate() {
  const { formProps, saveButtonProps } = useForm({ resource: "brands" });

  return (
    <Create saveButtonProps={saveButtonProps}>
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
            { required: true, message: "Please enter contact name" },
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
            { required: true, message: "Please enter phone number" },
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
    </Create>
  );
}
