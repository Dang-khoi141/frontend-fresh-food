"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Edit, useForm } from "@refinedev/antd";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Switch,
  Upload,
  UploadProps,
  message,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";

export default function ProductEdit() {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "products",
   queryOptions: {
      select: (response: any) => {
        return { data: response?.data?.data ?? {} };
      },
    },
  });

  const currentImage: string = Form.useWatch("image", formProps.form);

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

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to upload image");

        const resJson = await res.json();
        console.log("📡 Response JSON:", resJson);

        const { imageUrl } = resJson;
        if (!imageUrl) throw new Error("No imageUrl returned from server");

        formProps.form?.setFieldsValue({ image: imageUrl });
        setPreviewImage(imageUrl);

        message.success("Upload product image success!");
      } catch (err) {
        console.error("Upload error:", err);
        message.error("Upload error");
        return Upload.LIST_IGNORE;
      } finally {
        setUploading(false);
      }
      return false;
    },
    onRemove: () => {
      formProps.form?.setFieldsValue({ image: "" });
      setPreviewImage(null);
    },
  };

  const handleFinish = async (values: any) => {

    await formProps.onFinish?.(values);
    await queryResult?.refetch?.();

    if (values.image) {
      setPreviewImage(values.image);
    }
  };

  return (
    <Edit saveButtonProps={{ ...saveButtonProps, disabled: uploading }}>
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Brand ID" name="brandId" rules={[{ required: true }]}>
          <Input placeholder="Enter brand ID" />
        </Form.Item>

        <Form.Item
          label="Category ID"
          name="categoryId"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter category ID" />
        </Form.Item>

        <Form.Item label="Product Image" name="image">
          {(previewImage || currentImage) && (
            <Image
              src={`${previewImage || currentImage}?t=${Date.now()}`}
              alt="Product Image"
              style={{ maxWidth: 200, maxHeight: 200, marginBottom: 16 }}
            />
          )}
          <ImgCrop rotationSlider>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>
                {previewImage || currentImage ? "Change Image" : "Upload Image"}
              </Button>
            </Upload>
          </ImgCrop>
        </Form.Item>
      </Form>
    </Edit>
  );
}
