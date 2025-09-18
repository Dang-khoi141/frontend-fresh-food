"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export default function UserEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    warnWhenUnsavedChanges: true,
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={queryResult?.isLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name!" }]}
        >
          <Input placeholder="Enter user name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: false, min: 6, message: "Password must be at least 6 characters!" }]}
        >
          <Input.Password placeholder="Enter new password (leave empty to keep current)" />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input placeholder="Enter phone number (optional)" />
        </Form.Item>

        <Form.Item label="Avatar" name="avatar">
          <Input placeholder="Enter avatar URL (optional)" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select
            options={[
              { value: "CUSTOMER", label: "Customer" },
              { value: "AGENT", label: "Agent" },
              { value: "ADMIN", label: "Admin" },
              { value: "SUPER_ADMIN", label: "Super Admin" },
            ]}
            placeholder="Select role"
          />
        </Form.Item>
      </Form>
    </Edit>
  );
}
