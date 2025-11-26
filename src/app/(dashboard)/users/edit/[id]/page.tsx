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
  Row,
  Select,
  Upload,
  UploadProps,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";

export default function UserEdit() {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formHook = useForm({
    resource: "users",
    queryOptions: {
      select: (response: any) => ({
        data: response?.data?.data ?? {},
      }),
    },
  });

  const { formProps, saveButtonProps } = formHook;
  const queryResult = (formHook as any).queryResult;

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
<<<<<<< HEAD
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
              { value: "STAFF_WAREHOUSE", label: "Staff warehouse" },
              { value: "ADMIN", label: "Admin" },
              { value: "SUPER_ADMIN", label: "Super Admin" },
            ]}
            placeholder="Select role"
          />
        </Form.Item>

=======
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
      <Form
        {...formProps}
        layout="vertical"
        onFinish={handleFinish}
        style={{
          maxWidth: isMobile ? '100%' : '800px',
          margin: '0 auto',
        }}
      >
>>>>>>> 4abf88fa9224fe8fa4734de85a04e8cc94a4bffc
        {(previewAvatar || currentAvatar) && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px',
          }}>
            <Image
              src={`${previewAvatar || currentAvatar}?t=${Date.now()}`}
              alt="User Avatar"
              style={{
                maxWidth: isMobile ? 150 : 200,
                maxHeight: isMobile ? 150 : 200,
                borderRadius: '12px',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        <Row gutter={isMobile ? [0, 0] : [16, 0]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter name!" }]}
            >
              <Input
                placeholder="Enter user name"
                size={isMobile ? "large" : "middle"}
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                placeholder="Enter email address"
                size={isMobile ? "large" : "middle"}
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Phone" name="phone">
              <Input
                placeholder="Enter phone number (optional)"
                size={isMobile ? "large" : "middle"}
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select a role!" }]}
            >
              <Select
                size={isMobile ? "large" : "middle"}
                options={[
                  { value: "CUSTOMER", label: "Customer" },
                  { value: "AGENT", label: "Agent" },
                  { value: "ADMIN", label: "Admin" },
                  { value: "SUPER_ADMIN", label: "Super Admin" },
                ]}
                placeholder="Select role"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Avatar" name="avatar">
              <ImgCrop rotationSlider destroyOnHidden>
                <Upload {...uploadProps} listType={isMobile ? "picture-card" : "picture"}>
                  <Button
                    icon={<UploadOutlined />}
                    size={isMobile ? "large" : "middle"}
                    block={isMobile}
                    style={{ borderRadius: '8px' }}
                  >
                    {previewAvatar || currentAvatar ? "Change Avatar" : "Upload Avatar"}
                  </Button>
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}