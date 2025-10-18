"use client";

import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Tag, Typography, Descriptions, Card } from "antd";
import { Promotion } from "../../../../../lib/interface/promotion";

const { Title } = Typography;

export default function PromotionShow() {
    const { query: queryResult } = useShow<Promotion>({
        resource: "promotions",
        queryOptions: {
            select: (response: any) => {
                return {
                    data: response?.data?.data as Promotion,
                };
            },
        },
    });

    const record = queryResult?.data?.data;
    const isLoading = queryResult?.isLoading ?? true;

    return (
        <Show isLoading={isLoading}>
            <Card>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="ID">
                        <TextField value={record?.id ?? "-"} />
                    </Descriptions.Item>

                    <Descriptions.Item label="Promotion Code">
                        <Tag color="blue" style={{ fontSize: "16px", fontWeight: "bold" }}>
                            {record?.code ?? "-"}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Description">
                        <TextField value={record?.description ?? "-"} />
                    </Descriptions.Item>

                    <Descriptions.Item label="Discount Percent">
                        {record?.discountPercent ? (
                            <Tag color="orange" style={{ fontSize: "14px" }}>
                                {record.discountPercent}%
                            </Tag>
                        ) : (
                            "-"
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Discount Amount">
                        {record?.discountAmount ? (
                            <Tag color="green" style={{ fontSize: "14px" }}>
                                {Number(record.discountAmount).toLocaleString()}đ
                            </Tag>
                        ) : (
                            "-"
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Minimum Order Value">
                        {record?.minOrderValue ? (
                            <TextField
                                value={`${Number(record.minOrderValue).toLocaleString()}đ`}
                            />
                        ) : (
                            "-"
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Start Date">
                        {record?.startDate ? (
                            <DateField value={record.startDate} format="DD/MM/YYYY HH:mm" />
                        ) : (
                            "-"
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="End Date">
                        {record?.endDate ? (
                            <DateField value={record.endDate} format="DD/MM/YYYY HH:mm" />
                        ) : (
                            "-"
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        <Tag color={record?.isActive ? "green" : "red"}>
                            {record?.isActive ? "Active" : "Inactive"}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        <DateField value={record?.createdAt} format="DD/MM/YYYY HH:mm" />
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated At">
                        <DateField value={record?.updatedAt} format="DD/MM/YYYY HH:mm" />
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </Show>
    );
}
