"use client";

import { UploadOutlined } from "@ant-design/icons";
import { axiosInstance } from "@providers/data-provider";
import { Edit, useForm } from "@refinedev/antd";
import {
  App,
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { formProps, saveButtonProps, query } = useForm({
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
      .catch((err) => console.error("Error loading brands/categories:", err));
  }, []);

  useEffect(() => {
    const p = query?.data?.data;
    if (!ready || !p) return;

    formProps.form?.setFieldsValue({
      name: p.name,
      price: p.price,
      description: p.description,
      discountPercentage: p.discountPercentage,
      isActive: p.isActive,
      brandId: p.brand?.id?.toString(),
      categoryId: p.category?.id?.toString(),
      imageUrl: p.image,
    });

    if (p.image) setPreviewImage(p.image);
  }, [ready, query?.data?.data]);

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
    await query?.refetch?.();

    if (payload.imageUrl) setPreviewImage(payload.imageUrl);
  };

  return (
    <Edit
      saveButtonProps={{ ...saveButtonProps, disabled: uploading }}
      footerButtons={({ defaultButtons }) => (
        <div style={{
          display: 'flex',
          gap: '8px',
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto',
        }}>
          {defaultButtons}
        </div>
      )}
    >
      {!ready ? (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          color: '#64748b',
        }}>
          Loading brand & category...
        </div>
      ) : (
        <Form
          {...formProps}
          layout="vertical"
          onFinish={handleFinish}
          style={{
            maxWidth: isMobile ? '100%' : '900px',
            margin: '0 auto',
          }}
        >
          {(previewImage || currentImage) && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px',
            }}>
              <Image
                src={`${previewImage || currentImage}?t=${Date.now()}`}
                alt="Product Image"
                style={{
                  maxWidth: isMobile ? 200 : 250,
                  maxHeight: isMobile ? 200 : 250,
                  borderRadius: '12px',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          <Row gutter={isMobile ? [0, 0] : [16, 0]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true, message: "Please enter product name" }]}
              >
                <Input
                  size={isMobile ? "large" : "middle"}
                  placeholder="Enter product name"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Price (đ)"
                name="price"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber
                  style={{ width: "100%", borderRadius: '8px' }}
                  size={isMobile ? "large" : "middle"}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Discount (%)"
                name="discountPercentage"
                tooltip="Enter discount percentage (0 - 100)"
              >
                <InputNumber<number>
                  style={{ width: "100%", borderRadius: '8px' }}
                  size={isMobile ? "large" : "middle"}
                  min={0}
                  max={100}
                  step={1}
                  formatter={(value) => `${value}%`}
                  parser={(value) => Number((value || '').replace('%', '')) || 0}
                  placeholder="0%"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Active Status"
                name="isActive"
                valuePropName="checked"
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: isMobile ? '48px' : '40px',
                  padding: '0 12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                }}>
                  <Switch />
                  <span style={{ marginLeft: '12px', color: '#64748b' }}>
                    Active product
                  </span>
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Brand"
                name="brandId"
                rules={[{ required: true, message: "Please select brand" }]}
              >
                <Select
                  size={isMobile ? "large" : "middle"}
                  placeholder="Select brand"
                  style={{ borderRadius: '8px' }}
                  options={brands.map((b: any) => ({
                    label: b.name,
                    value: b.id.toString(),
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Category"
                name="categoryId"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select
                  size={isMobile ? "large" : "middle"}
                  placeholder="Select category"
                  style={{ borderRadius: '8px' }}
                  options={categories.map((c: any) => ({
                    label: c.name,
                    value: c.id.toString(),
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Description" name="description">
                <Input.TextArea
                  rows={isMobile ? 3 : 4}
                  placeholder="Enter product description"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Product Image" name="imageUrl">
                <ImgCrop rotationSlider {...({ destroyOnHidden: true } as any)}>
                  <Upload {...uploadProps} listType={isMobile ? "picture-card" : "picture"}>
                    <Button
                      icon={<UploadOutlined />}
                      size={isMobile ? "large" : "middle"}
                      block={isMobile}
                      style={{ borderRadius: '8px' }}
                    >
                      {previewImage || currentImage ? "Change Image" : "Upload Image"}
                    </Button>
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Edit>
  );
}
