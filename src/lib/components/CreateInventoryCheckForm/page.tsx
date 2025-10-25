"use client";

import useFetchProducts from "@/lib/hooks/useFetchProducts";
import { useFetchWarehouse } from "@/lib/hooks/useFetchWarehouse";
import { CreateInventoryCheckDto } from "@/lib/interface/inventory-check";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber, Select, Space, Table, message } from "antd";
import { useEffect, useState } from "react";

interface Props {
    onSubmit: (data: CreateInventoryCheckDto) => Promise<void>;
}

export const CreateInventoryCheckForm = ({ onSubmit }: Props) => {
    const { warehouses, loading: loadingWarehouses, refetch: loadWarehouses } = useFetchWarehouse();
    const { products, loading: loadingProducts, fetchProducts } = useFetchProducts();

    const [form] = Form.useForm();
    const [rows, setRows] = useState<{ productId?: string; systemQuantity?: number; actualQuantity?: number }[]>([]);

    useEffect(() => {
        loadWarehouses();
        fetchProducts();
    }, []);

    const handleAddRow = () => setRows([...rows, {}]);

    const handleRemoveRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (!values.warehouseId) return message.error("Vui lòng chọn kho kiểm hàng");

            const items = rows
                .filter((r) => r.productId)
                .map((r) => ({
                    productId: r.productId!,
                    systemQuantity: r.systemQuantity ?? 0,
                    actualQuantity: r.actualQuantity ?? 0,
                }));

            if (items.length === 0) return message.error("Vui lòng thêm sản phẩm");

            await onSubmit({ warehouseId: values.warehouseId, items });
            form.resetFields();
            setRows([]);
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "productId",
            render: (_: any, record: any, index: number) => (
                <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Chọn sản phẩm"
                    value={record.productId}
                    loading={loadingProducts}
                    onChange={(value) => {
                        const updated = [...rows];
                        updated[index].productId = value;
                        setRows(updated);
                    }}
                    options={products?.map((p) => ({ label: p.name, value: p.id })) ?? []}
                />
            ),
        },
        {
            title: "SL hệ thống",
            dataIndex: "systemQuantity",
            render: (_: any, record: any, index: number) => (
                <InputNumber
                    min={0}
                    value={record.systemQuantity}
                    onChange={(value) => {
                        const updated = [...rows];
                        updated[index].systemQuantity = value ?? 0;
                        setRows(updated);
                    }}
                />
            ),
        },
        {
            title: "SL thực tế",
            dataIndex: "actualQuantity",
            render: (_: any, record: any, index: number) => (
                <InputNumber
                    min={0}
                    value={record.actualQuantity}
                    onChange={(value) => {
                        const updated = [...rows];
                        updated[index].actualQuantity = value ?? 0;
                        setRows(updated);
                    }}
                />
            ),
        },
        {
            title: "Xoá",
            render: (_: any, __: any, index: number) => (
                <Button
                    icon={<DeleteOutlined />}
                    danger
                    type="text"
                    onClick={() => handleRemoveRow(index)}
                />
            ),
        },
    ];

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
                name="warehouseId"
                label="Kho kiểm hàng"
                rules={[{ required: true, message: "Chọn kho kiểm hàng" }]}
            >
                <Select
                    placeholder="Chọn kho"
                    loading={loadingWarehouses}
                    options={warehouses.map((w) => ({ label: w.name, value: w.id }))}
                />
            </Form.Item>

            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Danh sách sản phẩm</h3>
                <Button icon={<PlusOutlined />} onClick={handleAddRow}>
                    Thêm sản phẩm
                </Button>
            </div>

            <Table rowKey={(r, i) => i.toString()} columns={columns} dataSource={rows} pagination={false} />

            <Space className="mt-4" style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button htmlType="submit" type="primary">
                    Xác nhận tạo phiếu
                </Button>
            </Space>
        </Form>
    );
};
