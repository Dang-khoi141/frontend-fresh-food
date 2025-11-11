"use client";

import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

import { ColorModeContextProvider } from "@contexts/color-mode";
import { dataProvider } from "@providers/data-provider";
import "@refinedev/antd/dist/reset.css";
import { createAuthProvider } from "../providers/auth-provider/auth-provider";




type RefineContextProps = {
  defaultMode?: string;
};

const CustomIcon = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/img/ff-mark.svg"
    alt="Fresh-food Mark"
    style={{
      width: 26
      , height: 26
    }}
  />
);
export const RefineContext = (
  props: React.PropsWithChildren<RefineContextProps>,
) => {
  return (
    <SessionProvider>
      <App {...props} />
    </SessionProvider>
  );
};

type AppProps = {
  defaultMode?: string;
};

const App = ({ children, defaultMode }: React.PropsWithChildren<AppProps>) => {
  const { data: session, status } = useSession();
  const to = usePathname();
  const authProvider = createAuthProvider();
  if (status === "loading") {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        color: "#374151",
      }}
    >
      <div className="spinner-wrapper">
        <div className="spinner-ring"></div>
      </div>

      <p style={{ fontSize: 16, fontWeight: 500, marginTop: 24 }}>
        Đang tải dữ liệu...
      </p>

      <style>{`
        .spinner-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .spinner-ring {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 5px solid #e5e7eb;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-logo {
          width: 42px;
          height: 42px;
          z-index: 1;
          position: relative;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
  return (
    <>
      <RefineKbarProvider>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider}
            authProvider={authProvider}
            resources={[
              {
                name: "users",
                list: "/users",
                create: "/users/create",
                edit: "/users/edit/:id",
                show: "/users/show/:id",
                meta: {
                  canDelete: true,
                },
              },
              {
                name: "brands",
                list: "/brands",
                create: "/brands/create",
                edit: "/brands/edit/:id",
                show: "/brands/show/:id",
                meta: { canDelete: true },
              },
              {
                name: "categories",
                list: "/categories",
                create: "/categories/create",
                edit: "/categories/edit/:id",
                show: "/categories/show/:id",
                meta: { canDelete: true },
              },
              {
                name: "products",
                list: "/products",
                create: "/products/create",
                edit: "/products/edit/:id",
                show: "/products/show/:id",
                meta: { canDelete: true },
              },
              {
                name: "inventories",
                list: "/inventories",
                meta: {
                  label: "Inventory",
                },
              },
              {
                name: "statistics",
                list: "/statistics",
                meta: {
                  label: "Statistics",
                },
              },
              {
                name: "promotions",
                list: "/promotions",
                create: "/promotions/create",
                edit: "/promotions/edit/:id",
                show: "/promotions/show/:id",
                meta: { canDelete: true },
              },
              {
                name: "orders",
                list: "/admin/orders",
                show: "/admin//orders/show/:id",
                edit: "/admin/orders/edit/:id",
                meta: { label: "Orders" },
              }
            ]}
            options={{
              title: {
                icon: <CustomIcon />,
                text: 'dashboard',
              },
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            {children}
            <RefineKbar />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </>
  );
};
