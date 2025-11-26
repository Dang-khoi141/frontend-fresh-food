'use client';

import type { MenuProps } from 'antd';
import { Button, Dropdown, Form, Input, Modal, Space, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Edit, MoreVertical, Plus, RotateCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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
    const [isMobile, setIsMobile] = useState(false);

    const {
        warehouses,
        loading,
        refetch,
        createWarehouse,
        updateWarehouse,
        deleteWarehouse,
    } = useFetchWarehouse();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        if (warehouses.length <= 1) {
            toast.error('Không thể xóa kho cuối cùng! Hệ thống cần ít nhất 1 kho.');
            return;
        }

        setDeletingWarehouseId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingWarehouseId) return;

        if (warehouses.length <= 1) {
            toast.error('Không thể xóa kho cuối cùng!');
            setIsDeleteModalOpen(false);
            return;
        }

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
            disabled: warehouses.length <= 1,
            onClick: () => handleDelete(record.id),
        },
    ];

    const columns: ColumnsType<WarehouseType> = [
        {
            title: 'Tên kho',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{text}</span>
                </div>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            render: (text: string) => (
                <span className="text-slate-500">{text || '-'}</span>
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
                        icon={<MoreVertical size={18} className="text-slate-500" />}
                        className="border-none p-1"
                    />
                </Dropdown>
            ),
        },
    ];

    if (isMobile) {
        return (
            <div className="p-4 bg-slate-50 min-h-screen">
                <div className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 m-0 mb-1">
                        Quản lý danh sách kho
                    </h2>
                    <div className="text-xs text-slate-400 mb-4">
                        Kho › Danh sách kho
                    </div>
                    <div className="flex gap-2">
                        <Button
                            icon={<RotateCw size={16} />}
                            onClick={() => refetch()}
                            loading={loading}
                            className="flex-1 rounded-lg h-10 border border-slate-200"
                        >
                            Làm mới
                        </Button>
                        <Button
                            type="primary"
                            icon={<Plus size={18} />}
                            onClick={() => handleOpenModal()}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 rounded-lg h-10"
                        >
                            Thêm mới
                        </Button>
                    </div>
                </div>

                <Spin spinning={loading}>
                    <div className="flex flex-col gap-3">
                        {warehouses.map((warehouse) => (
                            <div
                                key={warehouse.id}
                                className="bg-white rounded-xl p-4 shadow-sm"
                            >
                                <div className="flex justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-[15px] text-slate-800">
                                            {warehouse.name}
                                        </span>
                                    </div>
                                    <Dropdown
                                        menu={{ items: getActionMenuItems(warehouse) }}
                                        trigger={['click']}
                                        placement="bottomRight"
                                    >
                                        <Button
                                            type="text"
                                            icon={<MoreVertical size={18} className="text-slate-500" />}
                                            className="p-1"
                                        />
                                    </Dropdown>
                                </div>
                                <div className="text-[13px] text-slate-500 leading-relaxed">
                                    {warehouse.address || '-'}
                                </div>
                            </div>
                        ))}
                    </div>
                </Spin>

                <Modal
                    title={editingWarehouse ? 'Chỉnh sửa kho' : 'Thêm kho mới'}
                    open={isModalOpen}
                    onOk={handleSubmit}
                    onCancel={handleCloseModal}
                    okText={editingWarehouse ? 'Cập nhật' : 'Tạo mới'}
                    cancelText="Hủy"
                    confirmLoading={isSubmitting}
                    width="100%"
                    centered
                    className="max-w-[500px] mx-auto"
                >
                    <Form form={form} layout="vertical" className="mt-5">
                        <Form.Item
                            name="name"
                            label="Tên kho"
                            rules={[{ required: true, message: 'Tên kho không được bỏ trống!' }]}
                        >
                            <Input placeholder="Nhập tên kho" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Địa chỉ không được bỏ trống!' }]}
                        >
                            <Input.TextArea
                                placeholder="Nhập địa chỉ"
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
                    centered
                >
                    <p>Bạn có chắc chắn muốn xóa kho này?</p>
                </Modal>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="bg-white px-6 py-5 rounded-xl mb-5 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 m-0 mb-1">
                            Quản lý danh sách kho
                        </h2>
                        <div className="flex items-center gap-2 text-[13px]">
                            <span className="text-emerald-600 font-medium">Kho</span>
                            <span className="text-slate-300">›</span>
                            <span className="text-slate-400">Danh sách kho</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            icon={<RotateCw size={16} />}
                            onClick={() => refetch()}
                            loading={loading}
                            className="rounded-lg h-10 border border-slate-200 flex items-center gap-1.5"
                        >
                            Làm mới
                        </Button>
                        <Button
                            type="primary"
                            icon={<Plus size={18} />}
                            onClick={() => handleOpenModal()}
                            className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 rounded-lg h-10 flex items-center gap-1.5 font-medium"
                        >
                            Thêm mới
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={warehouses}
                        rowKey="id"
                        pagination={{
                            position: ['bottomCenter'],
                            pageSize: 10,
                            showSizeChanger: false,
                            className: 'mb-4',
                        }}
                        className="rounded-xl"
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
                <Form form={form} layout="vertical" className="mt-5">
                    <Form.Item
                        name="name"
                        label="Tên kho"
                        rules={[{ required: true, message: 'Tên kho không được bỏ trống!' }]}
                    >
                        <Input placeholder="Nhập tên kho" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Địa chỉ không được bỏ trống!' }]}
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
                {warehouses.length <= 1 && (
                    <p className="text-red-600 font-medium">
                        ⚠️ Không thể xóa kho cuối cùng!
                    </p>
                )}
            </Modal>
        </div>
    );
}
