"use client";

import { ThemedLayout as AntdLayout } from "@refinedev/antd";
import React from "react";
import { Header } from "../header";

export const ThemedLayout = ({ children }: React.PropsWithChildren) => {
  return <AntdLayout Header={() => <Header sticky />}>{children}</AntdLayout>;
};
