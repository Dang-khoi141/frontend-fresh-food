"use client";

import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Col, Descriptions, Image, Row, Space, Tag, Typography } from "antd";
import { Building2, Calendar, DollarSign, Package, PercentCircle, Tag as TagIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "../../../../../lib/interface/product";

const { Title } = Typography;

export default function ProductShow() {
  const [isMobile, setIsMobile] = useState(false);
  const { query: queryResult } = useShow<Product>({
    resource: "products",
    queryOptions: {
      select: (response: any) => {
        return {
          data: response?.data?.data as Product,
        };
      },
    },
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const record = queryResult?.data?.data;
  const isLoading = queryResult?.isLoading ?? true;

  if (isMobile) {
    return (
      <Show isLoading={isLoading}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {record?.image && (
            <Card
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
              }}
              bodyStyle={{ padding: 0 }}
            >
              <Image
                src={record.image}
                alt={record.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  objectFit: 'cover',
                }}
              />
            </Card>
          )}

          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <Title level={4} style={{ marginTop: 0, marginBottom: '12px' }}>
              {record?.name || "-"}
            </Title>

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: '#f0fdf4',
                borderRadius: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={18} color="#059669" />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Price</span>
                </div>
                <Tag color="green" style={{ fontSize: '16px', padding: '4px 12px', margin: 0 }}>
                  {record?.price ? `${Number(record.price).toLocaleString()}đ` : "-"}
                </Tag>
              </div>

              {record?.discountPercentage !== undefined && record?.discountPercentage > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: '#eff6ff',
                  borderRadius: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PercentCircle size={18} color="#3b82f6" />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Discount</span>
                  </div>
                  <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px', margin: 0 }}>
                    {record.discountPercentage}%
                  </Tag>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: record?.isActive ? '#f0fdf4' : '#f8fafc',
                borderRadius: '8px',
              }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Status</span>
                <Tag color={record?.isActive ? 'success' : 'default'}>
                  {record?.isActive ? '✅ Active' : '❌ Inactive'}
                </Tag>
              </div>
            </Space>
          </Card>

          <Card
            title="Product Details"
            style={{
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
            headStyle={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {record?.description && (
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: 500,
                  }}>
                    Description
                  </div>
                  <div style={{ fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
                    {record.description}
                  </div>
                </div>
              )}

              {record?.stock !== undefined && (
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: 500,
                  }}>
                    Stock
                  </div>
                  <div style={{ fontSize: '14px', color: '#1e293b' }}>
                    {record.stock}
                  </div>
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
              }}>
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Building2 size={12} />
                    Brand
                  </div>
                  <Tag color="blue">{record?.brand?.name || "-"}</Tag>
                </div>

                <div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <TagIcon size={12} />
                    Category
                  </div>
                  <Tag color="purple">{record?.category?.name || "-"}</Tag>
                </div>
              </div>
            </Space>
          </Card>

          <Card
            title="Timestamps"
            style={{
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
            headStyle={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#059669" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Created At</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>
                    {record?.createdAt ? (
                      <DateField value={record.createdAt} format="DD/MM/YYYY HH:mm" />
                    ) : "-"}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#059669" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Updated At</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>
                    {record?.updatedAt ? (
                      <DateField value={record.updatedAt} format="DD/MM/YYYY HH:mm" />
                    ) : "-"}
                  </div>
                </div>
              </div>
            </Space>
          </Card>
        </div>
      </Show>
    );
  }

  return (
    <Show isLoading={isLoading}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <Card
            style={{
              borderRadius: '12px',
              height: '100%',
            }}
          >
            {record?.image ? (
              <Image
                src={record.image}
                alt={record.name}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '400px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}>
                <Package size={64} color="#cbd5e1" />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card
              title="Product Information"
              style={{ borderRadius: '12px' }}
              headStyle={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Name">
                  <TextField value={record?.name ?? "-"} />
                </Descriptions.Item>

                <Descriptions.Item label="Price">
                  {record?.price ? (
                    <Tag color="green" style={{ fontSize: "14px" }}>
                      {Number(record.price).toLocaleString()}đ
                    </Tag>
                  ) : "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Discount (%)">
                  {record?.discountPercentage !== undefined ? (
                    <Tag
                      color={record.discountPercentage > 0 ? "blue" : "default"}
                      style={{ fontSize: "14px" }}
                    >
                      {record.discountPercentage}%
                    </Tag>
                  ) : "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Stock">
                  <TextField value={record?.stock ?? "-"} />
                </Descriptions.Item>

                <Descriptions.Item label="Description">
                  <TextField value={record?.description ?? "-"} />
                </Descriptions.Item>

                <Descriptions.Item label="Brand">
                  <TextField value={record?.brand?.name ?? "-"} />
                </Descriptions.Item>

                <Descriptions.Item label="Category">
                  <TextField value={record?.category?.name ?? "-"} />
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <Tag color={record?.isActive ? "green" : "red"}>
                    {record?.isActive ? "Active" : "Inactive"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Created At">
                  {record?.createdAt ? (
                    <DateField value={record.createdAt} format="DD/MM/YYYY HH:mm" />
                  ) : "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Updated At">
                  {record?.updatedAt ? (
                    <DateField value={record.updatedAt} format="DD/MM/YYYY HH:mm" />
                  ) : "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </Col>
      </Row>
    </Show>
  );
}