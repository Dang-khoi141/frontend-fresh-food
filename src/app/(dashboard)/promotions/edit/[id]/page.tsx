"use client";

import { Edit, useForm } from "@refinedev/antd";
import {
    DatePicker,
    Form,
    Input,
    InputNumber,
    Switch,
    App
} from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function PromotionEdit() {
    const { message } = App.useApp();
    const { formProps, saveButtonProps, query } = useForm({
        resource: "promotions",
        queryOptions: {
            select: (response: any) => {
                const data = response?.data?.data ?? {};

                if (data.startDate && data.endDate) {
                    data.dateRange = [dayjs(data.startDate), dayjs(data.endDate)];
                }

                return { data };
            },
        },
    });

    const handleFinish = async (values: any) => {
        try {
            const payload: any = {
                code: values.code,
                description: values.description,
                isActive: values.isActive,
            };

            if (values.discountPercent !== undefined && values.discountPercent !== null) {
                payload.discountPercent = values.discountPercent;
            }
            if (values.discountAmount !== undefined && values.discountAmount !== null) {
                payload.discountAmount = values.discountAmount;
            }

            if (values.minOrderValue !== undefined && values.minOrderValue !== null) {
                payload.minOrderValue = values.minOrderValue;
            }

            if (values.dateRange && values.dateRange.length === 2) {
                payload.startDate = values.dateRange[0].toISOString();
                payload.endDate = values.dateRange[1].toISOString();
            }

            await formProps.onFinish?.(payload);
            await query?.refetch?.();
            message.success("Promotion updated successfully!");
        } catch (error: any) {
            message.error(error.response?.data?.message || "Error updating promotion");
        }
    };

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} form={formProps.form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label="Promotion Code"
                    name="code"
                    rules={[
                        { required: true, message: "Please enter promotion code" },
                        { min: 3, message: "Code must be at least 3 characters" },
                        { max: 50, message: "Code must not exceed 50 characters" },
                    ]}
                >
                    <Input
                        placeholder="e.g., SUMMER2024"
                        style={{ textTransform: "uppercase" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <TextArea
                        rows={3}
                        placeholder="Enter promotion description"
                    />
                </Form.Item>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Form.Item
                        label="Discount Percent (%)"
                        name="discountPercent"
                        rules={[
                            { type: "number", min: 0, max: 100, message: "Must be between 0-100" },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="e.g., 10"
                            min={0}
                            max={100}
                            precision={2}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Discount Amount (đ)"
                        name="discountAmount"
                        rules={[
                            { type: "number", min: 0, message: "Must be positive" },
                        ]}
                    >
                        <InputNumber<number>
                            style={{ width: "100%" }}
                            placeholder="e.g., 50000"
                            min={0}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Minimum Order Value (đ)"
                    name="minOrderValue"
                    rules={[
                        { type: "number", min: 0, message: "Must be positive" },
                    ]}
                >
                    <InputNumber<number>
                        style={{ width: "100%" }}
                        placeholder="e.g., 200000"
                        min={0}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    />
                </Form.Item>

                <Form.Item
                    label="Promotion Period"
                    name="dateRange"
                >
                    <RangePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        placeholder={["Start Date", "End Date"]}
                    />
                </Form.Item>

                <Form.Item
                    label="Active Status"
                    name="isActive"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Edit>
    );
}
