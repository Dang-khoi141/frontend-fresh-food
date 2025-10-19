"use client";

import { promotionService } from "@/lib/service/promotion.service";
import { Create, useForm } from "@refinedev/antd";
import {
    App,
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Switch
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function PromotionCreate() {
    const { formProps } = useForm({ resource: "promotions" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const discountPercent = Form.useWatch("discountPercent", formProps.form);
    const discountAmount = Form.useWatch("discountAmount", formProps.form);
    const { message } = App.useApp();

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload: any = {
                code: values.code,
                description: values.description,
                isActive: values.isActive ?? true,
            };

            if (values.discountPercent) {
                payload.discountPercent = values.discountPercent;
            }
            if (values.discountAmount) {
                payload.discountAmount = values.discountAmount;
            }

            if (values.minOrderValue) {
                payload.minOrderValue = values.minOrderValue;
            }

            if (values.dateRange && values.dateRange.length === 2) {
                payload.startDate = values.dateRange[0].toISOString();
                payload.endDate = values.dateRange[1].toISOString();
            }

            await promotionService.create(payload);
            message.success("Promotion created successfully!");
            formProps.form?.resetFields();
            router.push("/promotions");
        } catch (err: any) {
            console.error(err);
            message.error(err.response?.data?.message || "Error creating promotion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Create isLoading={loading} saveButtonProps={{ hidden: true }}>
            <Form {...formProps} form={formProps.form} layout="vertical" onFinish={handleSubmit}>
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
                        tooltip="Leave empty if using fixed amount discount"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="e.g., 10"
                            min={0}
                            max={100}
                            precision={2}
                            disabled={!!discountAmount}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Discount Amount (đ)"
                        name="discountAmount"
                        rules={[
                            { type: "number", min: 0, message: "Must be positive" },
                        ]}
                        tooltip="Leave empty if using percentage discount"
                    >
                        <InputNumber<number>
                            style={{ width: "100%" }}
                            placeholder="e.g., 50000"
                            min={0}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                            disabled={!!discountPercent}
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
                    initialValue={true}
                >
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} size="large">
                        Create Promotion
                    </Button>
                </Form.Item>
            </Form>
        </Create>
    );
}
