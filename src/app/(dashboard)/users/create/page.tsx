"use client";

import { UploadOutlined } from "@ant-design/icons";
import { axiosInstance } from "@providers/data-provider";
import { Create } from "@refinedev/antd";
import { Button, Form, Input, message, Select, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { useState } from "react";

export default function UserCreate() {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values: any) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string);
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
      form.resetFields();
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Error creating user");
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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

        <Form.Item label="Phone" name="phone">
          <Input />
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
          <ImgCrop rotationSlider>
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
