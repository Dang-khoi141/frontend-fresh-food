'use client';

import { Button, Divider, Layout, Tooltip } from 'antd';
import {
  Bell,
  Building2,
  ChevronRight,
  Gift,
  LineChart,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  Warehouse
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { key: '/users', label: 'Users', icon: Users },
    {
      key: '/products',
      label: 'Products',
      icon: Package,
      hasSubmenu: true,
      submenu: [
        { key: '/products', label: 'Danh sách sản phẩm' },
        { key: '/products/import', label: 'Nhập Excel' },
      ],
    },
    { key: '/categories', label: 'Categories', icon: Tag },
    { key: '/brands', label: 'Brands', icon: Building2 },
    {
      key: '/inventories',
      label: 'Inventory',
      icon: Warehouse,
      hasSubmenu: true,
      submenu: [
        { key: '/inventories/warehouse/management', label: 'Danh sách kho' },
        { key: '/inventories/warehouse/stock-info', label: 'Thông tin tồn kho' },
        { key: '/inventories/stock-in', label: 'Nhập hàng' },
        { key: '/inventories/stock-out', label: 'Chuyển kho' },
        { key: '/inventories/warehouse/inventory-check', label: 'Kiểm kho' },
      ]
    },
    { key: '/statistics', label: 'Statistics', icon: LineChart },
    { key: '/promotions', label: 'Promotions', icon: Gift },
    { key: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  ];

  const getPageTitle = () => {
    const item = menuItems.find(m => pathname.startsWith(m.key));
    return item?.label || 'Dashboard';
  };

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: '/login' });
  };

  const userName = session?.user?.email?.split('@')[0] || 'User';
  const userEmail = session?.user?.email || '';

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        collapsedWidth={80}
        style={{
          background: 'linear-gradient(180deg, #059669 0%, #047857 100%)',
          boxShadow: '4px 0 15px rgba(5, 150, 105, 0.15)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '24px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
          onClick={() => router.push('/')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <div
            style={{
              width: collapsed ? '40px' : '44px',
              height: collapsed ? '40px' : '44px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/ff-mark.svg"
              alt="FreshMart Logo"
              style={{
                width: collapsed ? '24px' : '26px',
                height: collapsed ? '24px' : '26px',
                filter: 'brightness(1.1)',
              }}
            />
          </div>
          {!collapsed && (
            <div style={{ textAlign: 'left', overflow: 'hidden' }}>
              <div
                style={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '16px',
                  letterSpacing: '-0.5px',
                  lineHeight: '1.2',
                }}
              >
                FreshMart
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            padding: '20px 0',
            overflow: 'auto',
            flex: 1,
            scrollbarWidth: 'thin',
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.key);
            const hasSubmenu = (item as any).hasSubmenu;
            const submenu = (item as any).submenu;

            return (
              <div key={item.key}>
                <Tooltip
                  title={collapsed ? item.label : ''}
                  placement="right"
                >
                  <div
                    onClick={() => {
                      if (hasSubmenu) {
                        if (item.key === '/inventories') {
                          setInventoryOpen(!inventoryOpen);
                        } else if (item.key === '/products') {
                          setProductOpen(!productOpen);
                        }
                      } else {
                        router.push(item.key);
                      }
                    }}
                    style={{
                      padding: '14px 16px',
                      margin: '6px 12px',
                      color: active ? 'white' : 'rgba(255, 255, 255, 0.75)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: '10px',
                      borderLeft: active ? '3px solid white' : '3px solid transparent',
                      background: active
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'transparent',
                      userSelect: 'none',
                      fontWeight: active ? 600 : 500,
                      backdropFilter: active ? 'blur(10px)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                      }
                    }}
                  >
                    <Icon size={20} style={{ minWidth: '20px', flexShrink: 0 }} />
                    {!collapsed && (
                      <>
                        <span style={{ fontSize: '14px', flex: 1 }}>
                          {item.label}
                        </span>
                        {hasSubmenu ? (
                          <ChevronRight
                            size={16}
                            style={{
                              opacity: 0.7,
                              transform:
                                (item.key === '/inventories' && inventoryOpen) ||
                                  (item.key === '/products' && productOpen)
                                  ? 'rotate(90deg)'
                                  : 'rotate(0deg)',
                              transition: 'transform 0.2s'
                            }}
                          />
                        ) : active ? (
                          <ChevronRight size={16} style={{ opacity: 0.7 }} />
                        ) : null}
                      </>
                    )}
                  </div>
                </Tooltip>

                {hasSubmenu && inventoryOpen && item.key === '/inventories' && !collapsed && submenu && (
                  <div style={{ marginLeft: '12px' }}>
                    {submenu.map((subItem: any) => {
                      const subActive = pathname.startsWith(subItem.key);
                      return (
                        <div
                          key={subItem.key}
                          onClick={() => router.push(subItem.key)}
                          style={{
                            padding: '10px 16px 10px 40px',
                            margin: '4px 12px',
                            color: subActive ? 'white' : 'rgba(255, 255, 255, 0.65)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '13px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderRadius: '8px',
                            background: subActive
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'transparent',
                            userSelect: 'none',
                            fontWeight: subActive ? 500 : 400,
                          }}
                        >
                          {subItem.label}
                        </div>
                      );
                    })}
                  </div>
                )}

                {hasSubmenu && productOpen && item.key === '/products' && !collapsed && submenu && (
                  <div style={{ marginLeft: '12px' }}>
                    {submenu.map((subItem: any) => {
                      const subActive = pathname.startsWith(subItem.key);
                      return (
                        <div
                          key={subItem.key}
                          onClick={() => router.push(subItem.key)}
                          style={{
                            padding: '10px 16px 10px 40px',
                            margin: '4px 12px',
                            color: subActive ? 'white' : 'rgba(255, 255, 255, 0.65)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '13px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderRadius: '8px',
                            background: subActive
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'transparent',
                            userSelect: 'none',
                            fontWeight: subActive ? 500 : 400,
                          }}
                        >
                          {subItem.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            padding: '16px 12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
            <div
              onClick={handleLogout}
              style={{
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontWeight: 500,
              }}
            >
              <LogOut size={18} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ fontSize: '13px' }}>Logout</span>
              )}
            </div>
          </Tooltip>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 280,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header
          style={{
            background: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            padding: '0 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '72px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Button
            type="text"
            icon={<Menu style={{ fontSize: '20px', color: '#059669' }} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              padding: 0,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Tooltip title="Notifications" placement="bottom">
              <Button
                type="text"
                icon={<Bell size={20} style={{ color: '#64748b' }} />}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Tooltip>

            <Tooltip title="Settings" placement="bottom">
              <Button
                type="text"
                icon={<Settings size={20} style={{ color: '#64748b' }} />}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Tooltip>

            <Divider
              type="vertical"
              style={{
                height: '28px',
                backgroundColor: '#e2e8f0',
                margin: 0,
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingRight: '8px',
                minWidth: '160px',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#1e293b',
                    textTransform: 'capitalize',
                    lineHeight: '1.2',
                  }}
                >
                  {userName}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    lineHeight: '1.2',
                  }}
                >
                  {userEmail}
                </div>
              </div>
            </div>
          </div>
        </Header>

        <Content
          style={{
            padding: '28px',
            background: '#f8fafc',
            flex: 1,
            overflow: 'auto',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
