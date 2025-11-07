"use client";

import { UploadOutlined } from "@ant-design/icons";
import { axiosInstance } from "@providers/data-provider";
import { Create, useForm } from "@refinedev/antd";
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductCreate() {
  const { message } = App.useApp();
  const { formProps, saveButtonProps } = useForm({ resource: "products" });
  const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    axiosInstance.get("/categories").then((res) => {
      setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);
    });
    axiosInstance.get("/brands").then((res) => {
      setBrands(Array.isArray(res.data) ? res.data : res.data.data || []);
    });
  }, []);

  const handleSubmit = async (values: any) => {
    setUploading(true);
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("price", values.price.toString());

      if (values.description) formData.append("description", values.description);
      if (values.isActive !== undefined)
        formData.append("isActive", String(values.isActive));
      if (values.categoryId) formData.append("categoryId", values.categoryId);
      if (values.brandId) formData.append("brandId", values.brandId);

      if (selectedFile) {
        formData.append("imageFile", selectedFile);
      }

      await axiosInstance.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Product created successfully!");
      router.push("/products");
    } catch (err: any) {
      console.error("Product create error:", err.response?.data || err);
      message.error(err.response?.data?.message || err.message || "Error creating product");
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    name: "imageFile",
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
    <Create isLoading={uploading} saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter product price" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Discount (%)"
          name="discountPercentage"
          tooltip="Nhập phần trăm giảm giá (0 - 100)"
        >
          <InputNumber<number>
            style={{ width: "100%" }}
            min={0}
            max={100}
            step={1}
            formatter={(value) => `${value}%`}
            parser={(value): number => Number((value || "").replace("%", "")) || 0}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Active"
          name="isActive"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
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

        <Form.Item label="Image">
          <ImgCrop rotationSlider {...({ destroyOnHidden: true } as any)}>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>
                {selectedFile ? "Change Image" : "Select Image"}
              </Button>
            </Upload>
          </ImgCrop>
        </Form.Item>
      </Form>
    </Create>
  );
}
