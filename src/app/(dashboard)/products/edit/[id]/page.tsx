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
  InputNumber,
  Select,
  Switch,
  Upload,
  UploadProps,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";

export default function ProductEdit() {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "products",
    queryOptions: {
      select: (response: any) => {
        return { data: response?.data?.data ?? {} };
      },
    },
  });

  const currentImage: string = Form.useWatch("image", formProps.form);

  useEffect(() => {
    axiosInstance.get("/categories").then((res) => {
      setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);
    });
    axiosInstance.get("/brands").then((res) => {
      setBrands(Array.isArray(res.data) ? res.data : res.data.data || []);
    });
  }, []);

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

        formProps.form?.setFieldsValue({ image: imageUrl });
        setPreviewImage(imageUrl);

        message.success("Upload product image success!");
      } catch (err: any) {
        console.error("Upload error:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "Upload error";
        message.error(errorMessage);
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
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          label="Brand"
          name="brandId"
          rules={[{ required: true, message: "Please select brand" }]}
        >
          <Select
            placeholder="Select brand"
            options={brands?.map((b: any) => ({
              label: b.name,
              value: b.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select
            placeholder="Select category"
            options={categories?.map((cat: any) => ({
              label: cat.name,
              value: cat.id,
            }))}
          />
        </Form.Item>

        {(previewImage || currentImage) && (
          <Form.Item label="Current Product Image">
            <Image
              src={`${previewImage || currentImage}?t=${Date.now()}`}
              alt="Product Image"
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
          </Form.Item>
        )}

        <Form.Item label="Product Image" name="image">
          <ImgCrop rotationSlider destroyOnHidden>
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
