import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button, theme } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { menuRoutes, userMenuRoutes } from '../router';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { token } = theme.useToken();

  // 检查认证状态
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const menuItems = menuRoutes.map(route => ({
    key: route.key,
    icon: route.icon,
    label: route.label,
  }));

  const userMenuItems = userMenuRoutes.map(route => ({
    key: route.key,
    icon: route.icon,
    label: route.label,
  }));

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
    }
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: ' #2b2f3a;',
        }}
      >
        <div style={{
          height: 30,
          margin: 10,
          background: ' #2b2f3a;',
          borderRadius: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          {collapsed ? 'GA' : 'Go-Admin'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header style={{
          padding: '0 16px',
          background: 'rgba(255, 255, 255, 0.2)',
          height: 30,
          margin: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 32,
              height: 32,
            }}
          />
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ marginLeft: 8 }}>{user?.real_name || user?.username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{
          margin: '0px 0px',
          padding: 10,
          minHeight: 280,
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
