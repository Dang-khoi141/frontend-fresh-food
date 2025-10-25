"use client";
import { UploadOutlined } from "@ant-design/icons";
import { axiosInstance } from "@providers/data-provider";
import { Edit, useForm } from "@refinedev/antd";
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
  const [ready, setReady] = useState(false);

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "products",
    queryOptions: {
      select: (response: any) => ({
        data: response?.data?.data ?? {},
      }),
    },
  });

  const currentImage: string = Form.useWatch("imageUrl", formProps.form);

  useEffect(() => {
    Promise.all([axiosInstance.get("/categories"), axiosInstance.get("/brands")])
      .then(([catRes, brandRes]) => {
        const catData = Array.isArray(catRes.data)
          ? catRes.data
          : catRes.data.data || [];
        const brandData = Array.isArray(brandRes.data)
          ? brandRes.data
          : brandRes.data.data || [];

        setCategories(catData);
        setBrands(brandData);
        setReady(true);
      })
      .catch((err) => console.error("❌ Lỗi load brands/categories:", err));
  }, []);

  useEffect(() => {
    const p = queryResult?.data?.data;
    if (!ready || !p) return;

    console.log("✅ Product data loaded:", p);

    formProps.form?.setFieldsValue({
      name: p.name,
      price: p.price,
      description: p.description,
      isActive: p.isActive,
      brandId: p.brand?.id?.toString(),
      categoryId: p.category?.id?.toString(),
      imageUrl: p.image,
    });

    if (p.image) setPreviewImage(p.image);
  }, [ready, queryResult?.data?.data]);

  const uploadProps: UploadProps = {
    name: "imageFile",
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axiosInstance.post("/upload/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const imageUrl = res.data?.data?.imageUrl;
        if (!imageUrl) throw new Error("No imageUrl returned");

        formProps.form?.setFieldsValue({ imageUrl });
        setPreviewImage(imageUrl);
        message.success("Upload product image success!");
      } catch (err: any) {
        message.error(err.response?.data?.message || "Upload error");
        return Upload.LIST_IGNORE;
      } finally {
        setUploading(false);
      }
      return false;
    },
    onRemove: () => {
      formProps.form?.setFieldsValue({ imageUrl: "" });
      setPreviewImage(null);
    },
  };

  const handleFinish = async (values: any) => {
    const payload = {
      ...values,
      imageUrl: values.imageUrl || undefined,
      brandId: values.brandId,
      categoryId: values.categoryId,
    };

    await formProps.onFinish?.(payload);
    await queryResult?.refetch?.();

    if (payload.imageUrl) setPreviewImage(payload.imageUrl);
  };

  return (
    <Edit saveButtonProps={{ ...saveButtonProps, disabled: uploading }}>
      {!ready ? (
        <div style={{ marginBottom: 16 }}>Loading brand & category...</div>
      ) : (
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
              options={brands.map((b: any) => ({
                label: b.name,
                value: b.id.toString(),
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
              options={categories.map((c: any) => ({
                label: c.name,
                value: c.id.toString(),
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

          <Form.Item label="Product Image" name="imageUrl">
            <ImgCrop rotationSlider destroyOnHidden>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>
                  {previewImage || currentImage ? "Change Image" : "Upload Image"}
                </Button>
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Form>
      )}
    </Edit>
  );
}
