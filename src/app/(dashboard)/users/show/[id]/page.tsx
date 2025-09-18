"use client";

import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Avatar, Typography } from "antd";

const { Title } = Typography;

export default function UserShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />

      <Title level={5}>Name</Title>
      <TextField value={record?.name} />

      <Title level={5}>Email</Title>
      <TextField value={record?.email} />

      <Title level={5}>Password</Title>
      <TextField value={record?.password ? "••••••••" : "-"} />

      <Title level={5}>Phone</Title>
      <TextField value={record?.phone ?? "-"} />

      <Title level={5}>Avatar</Title>
      {record?.avatar ? (
        <Avatar src={record.avatar} size={64} />
      ) : (
        <TextField value="No avatar" />
      )}

      <Title level={5}>Role</Title>
      <TextField value={record?.role} />

      <Title level={5}>Created At</Title>
      <DateField value={record?.createdAt} />

      <Title level={5}>Updated At</Title>
      <DateField value={record?.updatedAt} />
    </Show>
  );
}
