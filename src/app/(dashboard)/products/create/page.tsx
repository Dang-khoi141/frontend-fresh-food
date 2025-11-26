"use client";

import { UploadOutlined } from "@ant-design/icons";
import { axiosInstance } from "@providers/data-provider";
import { Create, useForm } from "@refinedev/antd";
import {
  App,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
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
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

      if (values.discountPercentage !== undefined) {
        formData.append("discountPercentage", values.discountPercentage.toString());
      }
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
    <Create
      isLoading={uploading}
      saveButtonProps={saveButtonProps}
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
      <Form
        {...formProps}
        layout="vertical"
        onFinish={handleSubmit}
        style={{
          maxWidth: isMobile ? '100%' : '900px',
          margin: '0 auto',
        }}
      >
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
              rules={[{ required: true, message: "Please enter product price" }]}
            >
              <InputNumber
                style={{ width: "100%", borderRadius: '8px' }}
                size={isMobile ? "large" : "middle"}
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                placeholder="0"
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
                parser={(value): number => Number((value || "").replace("%", "")) || 0}
                placeholder="0%"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Active Status"
              name="isActive"
              valuePropName="checked"
              initialValue={true}
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
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select
                size={isMobile ? "large" : "middle"}
                placeholder="Select category"
                style={{ borderRadius: '8px' }}
                options={categories?.map((cat: any) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
              />
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
                options={brands?.map((b: any) => ({
                  label: b.name,
                  value: b.id,
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
            <Form.Item label="Product Image">
              <ImgCrop rotationSlider {...({ destroyOnHidden: true } as any)}>
                <Upload {...uploadProps} listType={isMobile ? "picture-card" : "picture"}>
                  <Button
                    icon={<UploadOutlined />}
                    size={isMobile ? "large" : "middle"}
                    block={isMobile}
                    style={{ borderRadius: '8px' }}
                  >
                    {selectedFile ? "Change Image" : "Select Image"}
                  </Button>
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
}
