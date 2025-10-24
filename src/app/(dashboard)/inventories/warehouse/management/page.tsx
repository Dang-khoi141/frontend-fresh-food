'use client';

import React from 'react';
import { Button, Table, Tag } from 'antd';
import { Plus, RotateCw, MoreVertical, Warehouse } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';

interface WarehouseData {
    key: string;
    name: string;
    address: string;
    area: string;
    status: 'active' | 'inactive';
}

export default function WarehouseManagementPage() {
    const columns: ColumnsType<WarehouseData> = [
        {
            title: 'Tên kho',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Warehouse size={16} style={{ color: '#059669' }} />
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>{text}</span>
                </div>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            render: (text: string) => (
                <span style={{ color: '#64748b' }}>{text}</span>
            ),
        },
        {
            title: 'Khu vực',
            dataIndex: 'area',
            key: 'area',
            render: (text: string) => (
                <span style={{ color: '#64748b' }}>{text}</span>
            ),
        },
        {
            title: 'Là kho nhập hàng',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag
                    color={status === 'active' ? 'success' : 'default'}
                    style={{
                        borderRadius: '6px',
                        padding: '2px 12px',
                        fontSize: '13px',
                        fontWeight: 500,
                    }}
                >
                    {status === 'active' ? 'Có' : 'Không'}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái sử dụng',
            key: 'usage',
            render: () => (
                <span style={{ color: '#64748b' }}>Đang hoạt động</span>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 50,
            render: () => (
                <Button
                    type="text"
                    icon={<MoreVertical size={18} style={{ color: '#64748b' }} />}
                    style={{
                        border: 'none',
                        padding: '4px',
                    }}
                />
            ),
        },
    ];

    return (
        <div>
            <div
                style={{
                    background: 'white',
                    padding: '20px 24px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2
                            style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                color: '#1e293b',
                                margin: 0,
                                marginBottom: '4px',
                            }}
                        >
                            Quản lý danh sách kho
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                            <span style={{ color: '#059669', fontWeight: 500 }}>Kho</span>
                            <span style={{ color: '#cbd5e1' }}>›</span>
                            <span style={{ color: '#94a3b8' }}>Danh sách kho</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button
                            icon={<RotateCw size={16} />}
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            Làm mới
                        </Button>
                        <Button
                            type="primary"
                            icon={<Plus size={18} />}
                            style={{
                                background: '#059669',
                                borderColor: '#059669',
                                borderRadius: '8px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: 500,
                            }}
                        >
                            Thêm mới
                        </Button>
                    </div>
                </div>
            </div>

            <div
                style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
            </div>

            <div
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden',
                }}
            >
                <Table
                    columns={columns}
                    pagination={{
                        position: ['bottomCenter'],
                        pageSize: 10,
                        showSizeChanger: false,
                        style: { marginBottom: '16px' },
                    }}
                    style={{
                        borderRadius: '12px',
                    }}
                />
            </div>
        </div>
    );
}
