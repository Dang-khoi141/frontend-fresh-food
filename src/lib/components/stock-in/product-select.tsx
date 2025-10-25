import { Button, Input, Modal, Table, Tag } from 'antd';
import { Search } from 'lucide-react';
import { Product, ProductSelectionModalProps } from '../../interface/product';

export const ProductSelectionModal = ({
    open,
    products,
    selectedProducts,
    searchText,
    onSearchChange,
    onSelectionChange,
    onCancel,
    onConfirm,
}: ProductSelectionModalProps) => {
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const productColumns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: Product) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {record.image && (
                        <img
                            src={record.image}
                            alt={name}
                            style={{
                                width: '48px',
                                height: '48px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                            }}
                        />
                    )}
                    <div>
                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{name}</div>
                        {record.brand && (
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                {record.brand.name}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Danh mục',
            dataIndex: ['category', 'name'],
            key: 'category',
            width: 150,
            render: (category: string) => (
                <Tag
                    style={{
                        background: '#f0f9ff',
                        color: '#0284c7',
                        border: 'none',
                        borderRadius: '6px',
                    }}
                >
                    {category}
                </Tag>
            ),
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            align: 'right' as const,
            render: (price: number) => (
                <span style={{ fontWeight: 600, color: '#059669' }}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(price)}
                </span>
            ),
        },
    ];

    return (
        <Modal
            title="Tìm sản phẩm"
            open={open}
            onCancel={onCancel}
            width={800}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button
                    key="add"
                    type="primary"
                    onClick={onConfirm}
                    style={{ background: '#059669' }}
                >
                    Thêm sản phẩm
                </Button>,
            ]}
        >
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Tìm kiếm sản phẩm"
                    prefix={<Search size={16} />}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    size="large"
                />
            </div>
            <Table
                columns={productColumns}
                dataSource={filteredProducts}
                rowKey="id"
                rowSelection={{
                    selectedRowKeys: selectedProducts.map(p => p.id),
                    onChange: (_, selectedRows) => onSelectionChange(selectedRows),
                }}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                }}
                scroll={{ y: 300 }}
            />
        </Modal>
    );
};
