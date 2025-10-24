'use client';

import type { MenuProps } from 'antd';
import { Button, Dropdown, Form, Input, Modal, Space, Spin, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Edit, MoreVertical, Plus, RotateCw, Trash2, Warehouse } from 'lucide-react';
import { useState } from 'react';
import type { Warehouse as WarehouseType } from '../../../../../lib/interface/warehouse';
import { CreateWarehouseDto } from '../../../../../lib/interface/warehouse';
import { useFetchWarehouse } from '../../../../../lib/hooks/useFetchWarehouse';
import toast from 'react-hot-toast';


export default function WarehouseManagementPage() {
    const [form] = Form.useForm<CreateWarehouseDto>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingWarehouseId, setDeletingWarehouseId] = useState<string | null>(null);
    const [editingWarehouse, setEditingWarehouse] = useState<WarehouseType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        warehouses,
        loading,
        refetch,
        createWarehouse,
        updateWarehouse,
        deleteWarehouse,
    } = useFetchWarehouse();

    const handleOpenModal = (warehouse?: WarehouseType) => {
        if (warehouse) {
            setEditingWarehouse(warehouse);
            form.setFieldsValue({
                name: warehouse.name,
                address: warehouse.address || '',
            });
        } else {
            setEditingWarehouse(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingWarehouse(null);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setIsSubmitting(true);

            if (editingWarehouse) {
                await updateWarehouse(editingWarehouse.id, values);
                toast.success('Cập nhật kho thành công!');
            } else {
                await createWarehouse(values);
                toast.success('Tạo kho thành công!');
            }

            handleCloseModal();
        } catch (error: any) {
            if (error.errorFields) {
                return;
            }
            console.error('Error submitting form:', error);
            toast.error(
                error?.response?.data?.message ||
                (editingWarehouse ? 'Có lỗi xảy ra khi cập nhật kho' : 'Có lỗi xảy ra khi tạo kho')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id: string) => {
        setDeletingWarehouseId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingWarehouseId) return;

        try {
            setIsSubmitting(true);
            await deleteWarehouse(deletingWarehouseId);
            toast.success('Xóa kho thành công!');
            setIsDeleteModalOpen(false);
            setDeletingWarehouseId(null);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Có lỗi xảy ra khi xóa kho'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeletingWarehouseId(null);
    };

    const getActionMenuItems = (record: WarehouseType): MenuProps['items'] => [
        {
            key: 'edit',
            label: (
                <Space>
                    <Edit size={16} />
                    <span>Chỉnh sửa</span>
                </Space>
            ),
            onClick: () => handleOpenModal(record),
        },
        {
            key: 'delete',
            label: (
                <Space>
                    <Trash2 size={16} />
                    <span>Xóa</span>
                </Space>
            ),
            danger: true,
            onClick: () => handleDelete(record.id),
        },
    ];

    const columns: ColumnsType<WarehouseType> = [
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
                <span style={{ color: '#64748b' }}>{text || '-'}</span>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 50,
            render: (_, record) => (
                <Dropdown
                    menu={{ items: getActionMenuItems(record) }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        icon={<MoreVertical size={18} style={{ color: '#64748b' }} />}
                        style={{
                            border: 'none',
                            padding: '4px',
                        }}
                    />
                </Dropdown>
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
                            onClick={() => refetch()}
                            loading={loading}
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
                            onClick={() => handleOpenModal()}
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
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden',
                }}
            >
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={warehouses}
                        rowKey="id"
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
                </Spin>
            </div>

            <Modal
                title={editingWarehouse ? 'Chỉnh sửa kho' : 'Thêm kho mới'}
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCloseModal}
                okText={editingWarehouse ? 'Cập nhật' : 'Tạo mới'}
                cancelText="Hủy"
                confirmLoading={isSubmitting}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: '20px' }}
                >
                    <Form.Item
                        name="name"
                        label="Tên kho"
                        rules={[
                            { required: true, message: 'Tên kho không được bỏ trống!' },
                        ]}
                    >
                        <Input
                            placeholder="Nhập tên kho"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[
                            { required: true, message: 'Địa chỉ không được bỏ trống!' },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Nhập số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                            rows={3}
                            size="large"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalOpen}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                confirmLoading={isSubmitting}
            >
                <p>Bạn có chắc chắn muốn xóa kho này?</p>
            </Modal>
        </div>
    );
}
