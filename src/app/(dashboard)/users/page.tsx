"use client";

import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Avatar, Card, Space, Table, Tag } from "antd";
import { Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Users() {
  const [isMobile, setIsMobile] = useState(false);
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray((tableProps?.dataSource as any)?.data)
      ? (tableProps.dataSource as any).data
      : Array.isArray(tableProps?.dataSource)
        ? tableProps.dataSource
        : [],
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'CUSTOMER': 'blue',
      'AGENT': 'cyan',
      'ADMIN': 'orange',
      'SUPERADMIN': 'red',
      'SUPER_ADMIN': 'red',
    };
    return colors[role] || 'default';
  };

  if (isMobile) {
    return (
      <List>
        <div style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: '1fr',
        }}>
          {safeTableProps.dataSource.map((record: BaseRecord) => (
            <Card
              key={record.id}
              style={{
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <Avatar
                  src={record.avatar}
                  size={56}
                  style={{
                    flexShrink: 0,
                    border: '2px solid #e2e8f0'
                  }}
                >
                  {record.name?.charAt(0).toUpperCase() || ':'}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#1e293b',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {record.name}
                  </div>
                  <Tag color={getRoleColor(record.role)} style={{ margin: 0 }}>
                    {record.role}
                  </Tag>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '12px',
                fontSize: '13px',
                color: '#64748b',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} style={{ flexShrink: 0 }} />
                  <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {record.email}
                  </span>
                </div>
                {record.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} style={{ flexShrink: 0 }} />
                    <span>{record.phone}</span>
                  </div>
                )}
              </div>

              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  <DateField value={record.createdAt} format="DD/MM/YYYY" />
                </div>
                <Space size={8}>
                  <EditButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    style={{
                      borderRadius: '8px',
                      height: '32px',
                      width: '32px',
                      padding: 0,
                    }}
                  />
                  <ShowButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    style={{
                      borderRadius: '8px',
                      height: '32px',
                      width: '32px',
                      padding: 0,
                    }}
                  />
                  <DeleteButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    style={{
                      borderRadius: '8px',
                      height: '32px',
                      width: '32px',
                      padding: 0,
                    }}
                  />
                </Space>
              </div>
            </Card>
          ))}
        </div>
      </List>
    );
  }

  return (
    <List>
      <div style={{ overflowX: 'auto' }}>
        <Table
          {...safeTableProps}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          style={{
            minWidth: '100%',
          }}
        >
          <Table.Column
            dataIndex="name"
            title="Name"
            width={200}
            fixed="left"
          />
          <Table.Column
            dataIndex="email"
            title="Email"
            width={250}
          />
          <Table.Column
            dataIndex="phone"
            title="Phone"
            width={150}
          />
          <Table.Column
            dataIndex="avatar"
            title="Avatar"
            width={100}
            render={(value: string | null) =>
              value ? <Avatar src={value} /> : <Avatar>{":"}</Avatar>
            }
          />
          <Table.Column
            dataIndex="role"
            title="Role"
            width={120}
            render={(role: string) => (
              <Tag color={getRoleColor(role)}>{role}</Tag>
            )}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            width={150}
            render={(value: any) => <DateField value={value} format="DD/MM/YYYY" />}
          />
          <Table.Column
            dataIndex="updatedAt"
            title="Updated At"
            width={150}
            render={(value: any) => <DateField value={value} format="DD/MM/YYYY" />}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            width={150}
            fixed="right"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </div>
    </List>
  );
}