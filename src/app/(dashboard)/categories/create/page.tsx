"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export default function CategoryCreate() {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter category name" },
            { min: 2, message: "Category name must be at least 2 characters" },
            {
              pattern: /^[A-Za-zÀ-ỹ0-9\s]+$/,
              message: "Category name can only contain letters, numbers, and spaces",
            },
          ]}
        >
          <Input placeholder="e.g. Electronics" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { max: 255, message: "Description must be less than 255 characters" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Describe this category (optional)" />
        </Form.Item>
      </Form>
    </Create>
  );
}
