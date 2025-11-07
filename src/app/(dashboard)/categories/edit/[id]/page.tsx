"use client";

import { Edit, useForm } from "@refinedev/antd";
import { useParams } from "next/navigation";
import { Form, Input } from "antd";
import { Category } from "../../../../../lib/interface/category";

export default function CategoryEdit() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { formProps, saveButtonProps } = useForm<Category>({
    resource: "categories",
    id: categoryId,
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
            { required: true, message: "Please enter category name" },
            { min: 2, message: "Category name must be at least 2 characters" },
            {
              pattern: /^[A-Za-zÀ-ỹ0-9\s]+$/,
              message:
                "Category name can only contain letters, numbers, and spaces",
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
    </Edit>
  );
}
