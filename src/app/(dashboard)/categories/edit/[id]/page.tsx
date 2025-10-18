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
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Edit>
  );
}