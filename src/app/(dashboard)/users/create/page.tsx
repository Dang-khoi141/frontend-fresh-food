"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Create } from "@refinedev/antd";
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { useState } from "react";

export default function UserCreate() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      if (fileList.length > 0) {
        formData.append("file", fileList[0].originFileObj as RcFile);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Create user failed");
      const data = await res.json();

      message.success("User created successfully!");
      form.resetFields();
      setFileList([]);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <Create isLoading={loading}>
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
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={(file) => {
              setFileList([file]);
              return false;
            }}
            onRemove={() => setFileList([])}
            onPreview={handlePreview}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <Modal
            open={previewOpen}
            title="Preview Image"
            footer={null}
            onCancel={() => setPreviewOpen(false)}
          >
            <img alt="avatar" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Create User
        </Button>
      </Form>
    </Create>
  );
}
