"use client";

import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function UserShow() {
  const { result: record, query } = useShow({});
  const { isLoading } = query;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      
      <Title level={5}>{"Name"}</Title>
      <TextField value={record?.name} />
      
      <Title level={5}>{"Email"}</Title>
      <TextField value={record?.email} />
      
      <Title level={5}>{"Password"}</Title>
      <TextField value={record?.password ? "••••••••" : "-"} />
      
      <Title level={5}>{"Role"}</Title>
      <TextField value={record?.role} />
      
      <Title level={5}>{"Created At"}</Title>
      <DateField value={record?.createdAt} />
      
      <Title level={5}>{"Updated At"}</Title>
      <DateField value={record?.updatedAt} />
    </Show>
  );
}
