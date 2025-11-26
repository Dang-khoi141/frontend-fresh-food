"use client";

import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Avatar, Card, Col, Descriptions, Row, Space, Tag, Typography } from "antd";
import { Calendar, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";

const { Title } = Typography;

interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role: "CUSTOMER" | "AGENT" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  updatedAt: string;
}

export default function UserShow() {
  const [isMobile, setIsMobile] = useState(false);
  const { query: queryResult } = useShow<IUser>({
    resource: "users",
    queryOptions: {
      select: (response: any) => {
        return {
          data: response?.data?.data as IUser,
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

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'CUSTOMER': 'blue',
      'AGENT': 'cyan',
      'ADMIN': 'orange',
      'SUPER_ADMIN': 'red',
    };
    return colors[role] || 'default';
  };

  if (isMobile) {
    return (
      <Show isLoading={isLoading}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card
            style={{
              borderRadius: '12px',
              textAlign: 'center',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Avatar
              src={record?.avatar}
              size={120}
              style={{
                margin: '0 auto 16px',
                border: '4px solid #e2e8f0',
              }}
            >
              {record?.name?.charAt(0).toUpperCase() || ':'}
            </Avatar>
            <Title level={3} style={{ marginBottom: '8px', marginTop: 0 }}>
              {record?.name || "-"}
            </Title>
            <Tag
              color={getRoleColor(record?.role || '')}
              style={{
                fontSize: '14px',
                padding: '4px 12px',
                borderRadius: '6px',
              }}
            >
              {record?.role || "-"}
            </Tag>
          </Card>

          <Card
            title="Contact Information"
            style={{ borderRadius: '12px' }}
            headStyle={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={18} style={{ color: '#059669', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                    Email
                  </div>
                  <div style={{
                    fontWeight: 500,
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {record?.email || "-"}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} style={{ color: '#059669', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                    Phone
                  </div>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>
                    {record?.phone || "-"}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={18} style={{ color: '#059669', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                    Password
                  </div>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>
                    {record?.password ? "••••••••" : "-"}
                  </div>
                </div>
              </div>
            </Space>
          </Card>

          <Card
            title="Account Information"
            style={{ borderRadius: '12px' }}
            headStyle={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={18} style={{ color: '#059669', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                    Created At
                  </div>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>
                    <DateField value={record?.createdAt} format="DD/MM/YYYY HH:mm" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={18} style={{ color: '#059669', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                    Updated At
                  </div>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>
                    <DateField value={record?.updatedAt} format="DD/MM/YYYY HH:mm" />
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
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: '12px',
              textAlign: 'center',
              height: '100%',
            }}
          >
            <Avatar
              src={record?.avatar}
              size={160}
              style={{
                margin: '0 auto 24px',
                border: '4px solid #e2e8f0',
              }}
            >
              {record?.name?.charAt(0).toUpperCase() || ':'}
            </Avatar>
            <Title level={3} style={{ marginBottom: '12px', marginTop: 0 }}>
              {record?.name || "-"}
            </Title>
            <Tag
              color={getRoleColor(record?.role || '')}
              style={{
                fontSize: '14px',
                padding: '6px 16px',
                borderRadius: '8px',
              }}
            >
              {record?.role || "-"}
            </Tag>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card
              title="Contact Information"
              style={{ borderRadius: '12px' }}
              headStyle={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} />
                      Email
                    </span>
                  }
                >
                  <TextField value={record?.email || "-"} />
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} />
                      Phone
                    </span>
                  }
                >
                  <TextField value={record?.phone || "-"} />
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={16} />
                      Password
                    </span>
                  }
                >
                  <TextField value={record?.password ? "••••••••" : "-"} />
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              title="Account Information"
              style={{ borderRadius: '12px' }}
              headStyle={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} />
                      Created At
                    </span>
                  }
                >
                  <DateField value={record?.createdAt} format="DD/MM/YYYY HH:mm" />
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} />
                      Updated At
                    </span>
                  }
                >
                  <DateField value={record?.updatedAt} format="DD/MM/YYYY HH:mm" />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </Col>
      </Row>
    </Show>
  );
}