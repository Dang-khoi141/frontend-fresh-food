"use client";


import { useFetchInventoryCheck } from "@/lib/hooks/useFetchInventoryCheck";
import { InventoryCheck } from "@/lib/interface/inventory-check";
import {
    FileExcelOutlined,
    PlusOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import { Button, Input, message, Modal, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { CreateInventoryCheckForm } from "../../../../../lib/components/CreateInventoryCheckForm/page";

export default function InventoryCheckPage() {
    const { checks, loading, fetchAll, create } = useFetchInventoryCheck();
    const [filteredData, setFilteredData] = useState<InventoryCheck[]>([]);
    const [search, setSearch] = useState("");
    const [fetching, setFetching] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        loadChecks();
    }, []);

    const loadChecks = async () => {
        try {
            setFetching(true);
            await fetchAll();
        } catch {
            message.error("Không thể tải danh sách kiểm kho");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        setFilteredData(
            checks.filter(
                (c) =>
                    c.id.toLowerCase().includes(search.toLowerCase()) ||
                    c.warehouse?.name?.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [checks, search]);

    const columns = [
        { title: "Mã phiếu kiểm kho", dataIndex: "id", key: "id", width: 200 },
        {
            title: "Kho kiểm hàng",
            dataIndex: ["warehouse", "name"],
            key: "warehouse",
            render: (text: string) => text || "-",
        },
        {
            title: "Số lượng sản phẩm",
            key: "total",
            render: (_: any, record: InventoryCheck) => record.details?.length ?? 0,
        },
        {
            title: "Ngày kiểm",
            dataIndex: "checkDate",
            key: "checkDate",
            render: (d: string) =>
                d ? new Date(d).toLocaleDateString("vi-VN") : "-",
        },
        {
            title: "Nhân viên kiểm",
            dataIndex: "checkedBy",
            key: "checkedBy",
            render: (t: string) => t || "-",
        },
    ];

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-[#1e293b]">
                    Quản lý thông tin kiểm kho
                </h1>
                <div className="flex gap-3">
                    <Button icon={<FileExcelOutlined />}>Tạo phiếu bằng Excel</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
                        Thêm mới
                    </Button>
                </div>
            </div>

            <div className="flex justify-between mb-4">
                <Input.Search
                    placeholder="Tìm kiếm theo mã phiếu / tên kho"
                    allowClear
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 400 }}
                />
                <Button icon={<ReloadOutlined />} onClick={loadChecks} loading={fetching}>
                    Làm mới
                </Button>
            </div>

            <Spin spinning={loading || fetching}>
                <Table rowKey="id" columns={columns} dataSource={filteredData} pagination={{ pageSize: 10 }} />
            </Spin>

            <Modal
                title="Tạo phiếu kiểm kho"
                open={openModal}
                onCancel={() => setOpenModal(false)}
                footer={null}
                width={850}
            >
                <CreateInventoryCheckForm
                    onSubmit={async (data) => {
                        await create(data);
                        message.success("Tạo phiếu kiểm kho thành công");
                        setOpenModal(false);
                    }}
                />
            </Modal>
        </div>
    );
}
