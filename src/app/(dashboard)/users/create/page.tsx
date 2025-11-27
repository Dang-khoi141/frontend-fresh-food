"use client";

import { UploadOutlined } from "@ant-design/icons";
import { axiosInstance } from "@providers/data-provider";
import { Create, useForm } from "@refinedev/antd";
import { App, Button, Form, Input, Select, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { useState } from "react";

export default function UserCreate() {
  const { message } = App.useApp();
  const { formProps, saveButtonProps } = useForm({ resource: "users" });
  const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values: any) => {
    setUploading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value as string);
        }
      });

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await axiosInstance.post("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("User created successfully!");
      formProps.form?.resetFields();
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || err.message || "Error creating user");
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    name: "file",
    maxCount: 1,
    multiple: false,
    beforeUpload: (file: RcFile) => {
      setSelectedFile(file);
      return false;
    },
    onRemove: () => {
      setSelectedFile(null);
    },
  };

  return (
    <Create isLoading={uploading}>
      <Form {...formProps} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, type: "email", message: "Please enter valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, min: 6, message: "Password min 6 characters" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              required: true,
              message: "Please enter phone number",
            },
            {
              pattern: /^(0|\+84)\d{9}$/,
              message: "Invalid Vietnamese phone number format",
            },
          ]}
        >
          <Input placeholder="e.g. 0912345678 or +84912345678" />
        </Form.Item>

        <Form.Item label="Role" name="role" initialValue="CUSTOMER">
          <Select
            options={[
              { value: "CUSTOMER", label: "Customer" },
              { value: "ADMIN", label: "Admin" },
              { value: "SUPERADMIN", label: "Super Admin" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Avatar">
          <ImgCrop rotationSlider destroyOnHidden>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Select Avatar</Button>
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={uploading}>
          Create User
        </Button>
      </Form>
    </Create>
  );
}
