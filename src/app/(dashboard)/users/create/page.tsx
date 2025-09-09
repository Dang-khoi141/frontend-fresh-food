"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Name"}
          name={["name"]}
          rules={[
            {
              required: true,
              message: "Please enter name!",
            },
          ]}
        >
          <Input placeholder="Enter user name" />
        </Form.Item>

        <Form.Item
          label={"Email"}
          name={["email"]}
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          label={"Password"}
          name={["password"]}
          rules={[
            {
              required: true,
              min: 6,
              message: "Password must be at least 6 characters!",
            },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          label={"Role"}
          name={["role"]}
          initialValue={"Customer"}
          rules={[
            {
              required: true,
              message: "Please select a role!",
            },
          ]}
        >
          <Select
            defaultValue={"user"}
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
    </Create>
  );
}
