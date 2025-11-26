"use client";

import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Avatar, Typography } from "antd";

const { Title } = Typography;

interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role: "CUSTOMER" | "STAFF_WAREHOUSE" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  updatedAt: string;
}

export default function UserShow() {
  const { query: queryResult } = useShow<IUser>({
    resource: "users",
    queryOptions: {
      select: (response: any) => {
        return {
          data: response?.data?.data as IUser,
        };
      },
    },
  });

  const record = queryResult?.data?.data;
  const isLoading = queryResult?.isLoading ?? true;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Name</Title>
      <TextField value={record?.name ?? "-"} />

      <Title level={5}>Email</Title>
      <TextField value={record?.email ?? "-"} />

      <Title level={5}>Password</Title>
      <TextField value={record?.password ? "••••••••" : "-"} />

      <Title level={5}>Phone</Title>
      <TextField value={record?.phone ?? "-"} />

      <Title level={5}>Avatar</Title>
      {record?.avatar ? (
        <Avatar
          src={record.avatar}
          size={80}
          shape="square"
          style={{ borderRadius: 8 }}
        />
      ) : (
        <TextField value="No avatar" />
      )}

      <Title level={5}>Role</Title>
      <TextField value={record?.role ?? "-"} />

      <Title level={5}>Created At</Title>
      <DateField value={record?.createdAt} format="YYYY-MM-DD HH:mm" />

      <Title level={5}>Updated At</Title>
      <DateField value={record?.updatedAt} format="YYYY-MM-DD HH:mm" />
    </Show>
  );
}
