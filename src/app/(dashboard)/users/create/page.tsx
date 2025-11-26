"use client";

import { UploadOutlined } from "@ant-design/icons";
import { axiosInstance } from "@providers/data-provider";
import { Create, useForm } from "@refinedev/antd";
import { App, Button, Col, Form, Input, Row, Select, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { useEffect, useState } from "react";

export default function UserCreate() {
  const { message } = App.useApp();
  const { formProps, saveButtonProps } = useForm({ resource: "users" });
  const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <Create
      isLoading={uploading}
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
          maxWidth: isMobile ? '100%' : '800px',
          margin: '0 auto',
        }}
      >
        <Row gutter={isMobile ? [0, 0] : [16, 0]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input
                size={isMobile ? "large" : "middle"}
                placeholder="Enter full name"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input
                size={isMobile ? "large" : "middle"}
                placeholder="example@email.com"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, min: 6, message: "Password min 6 characters" },
              ]}
            >
              <Input.Password
                size={isMobile ? "large" : "middle"}
                placeholder="Min 6 characters"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
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
              <Input
                size={isMobile ? "large" : "middle"}
                placeholder="0912345678 or +84912345678"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Role" name="role" initialValue="CUSTOMER">
              <Select
                size={isMobile ? "large" : "middle"}
                style={{ borderRadius: '8px' }}
                options={[
                  { value: "CUSTOMER", label: "Customer" },
                  { value: "ADMIN", label: "Admin" },
                  { value: "SUPERADMIN", label: "Super Admin" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Avatar">
              <ImgCrop rotationSlider destroyOnHidden>
                <Upload {...uploadProps} listType={isMobile ? "picture-card" : "picture"}>
                  <Button
                    icon={<UploadOutlined />}
                    size={isMobile ? "large" : "middle"}
                    block={isMobile}
                    style={{ borderRadius: '8px' }}
                  >
                    Select Avatar
                  </Button>
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
        </Row>

        {isMobile && (
          <Form.Item style={{ marginTop: '16px', marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={uploading}
              size="large"
              block
              style={{
                borderRadius: '8px',
                height: '48px',
                fontWeight: 600,
              }}
            >
              Create User
            </Button>
          </Form.Item>
        )}
      </Form>
    </Create>
  );
}