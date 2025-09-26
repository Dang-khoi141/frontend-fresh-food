"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export default function BrandCreate() {
  const { formProps, saveButtonProps } = useForm({ resource: "brands" });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Apple" />
        </Form.Item>
        <Form.Item label="Contact Name" name="contactName">
          <Input placeholder="John Doe" />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input placeholder="+84 123 456 789" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" placeholder="brand@example.com" />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input.TextArea placeholder="1 Infinite Loop, Cupertino, CA" />
        </Form.Item>
      </Form>
    </Create>
  );
}
