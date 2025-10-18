"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Edit, useForm } from "@refinedev/antd";
import { axiosInstance } from "@providers/data-provider";
import {
  App,
  Button,
  Form,
  Image,
  Input,
  Select,
  Upload,
  UploadProps,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";

export default function UserEdit() {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "users",
    queryOptions: {
      select: (response: any) => {
        return { data: response?.data?.data ?? {} };
      },
    },
  });

  const currentAvatar: string = Form.useWatch("avatar", formProps.form);

  const uploadProps: UploadProps = {
    name: "file",
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axiosInstance.post("/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = res.data?.data?.imageUrl;
        if (!imageUrl) throw new Error("No imageUrl returned from server");

        formProps.form?.setFieldsValue({ avatar: imageUrl });
        setPreviewAvatar(imageUrl);

        message.success("Upload avatar success!");
      } catch (err: any) {
        console.error("Upload error:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Upload error";
        message.error(errorMessage);
        return Upload.LIST_IGNORE;
      } finally {
        setUploading(false);
      }
      return false;
    },
    onRemove: () => {
      formProps.form?.setFieldsValue({ avatar: "" });
      setPreviewAvatar(null);
    },
  };

  const handleFinish = async (values: any) => {
    if (!values.password) delete values.password;
    if (typeof values.role === "object" && values.role.value) {
      values.role = values.role.value;
    }

    await formProps.onFinish?.(values);
    await queryResult?.refetch?.();

    if (values.avatar) {
      setPreviewAvatar(values.avatar);
    }
  };

  return (
    <Edit saveButtonProps={{ ...saveButtonProps, disabled: uploading }}>
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
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

        <Form.Item label="Phone" name="phone">
          <Input placeholder="Enter phone number (optional)" />
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

        {(previewAvatar || currentAvatar) && (
          <Form.Item label="Current Avatar">
            <Image
              src={`${previewAvatar || currentAvatar}?t=${Date.now()}`}
              alt="User Avatar"
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
          </Form.Item>
        )}

        <Form.Item label="Avatar" name="avatar">
          <ImgCrop rotationSlider destroyOnHidden>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>
                {previewAvatar || currentAvatar ? "Change Avatar" : "Upload Avatar"}
              </Button>
            </Upload>
          </ImgCrop>
        </Form.Item>
      </Form>
    </Edit>
  );
}