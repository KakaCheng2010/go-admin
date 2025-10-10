import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Login from '../pages/Login';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';

// 用户管理路由
import UserManagement from '../pages/user/UserManagement';

// 组织管理路由
import OrganizationManagement from '../pages/organization/OrganizationManagement';

// 角色管理路由
import RoleManagement from '../pages/role/RoleManagement';

// 菜单管理路由
import MenuManagement from '../pages/menu/MenuManagement';

// 字典管理路由
import DictManagement from '../pages/dict/DictManagement';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 用户管理路由 */}
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/*" element={<UserManagement />} />
        
        {/* 组织管理路由 */}
        <Route path="/organizations" element={<OrganizationManagement />} />
        <Route path="/organizations/*" element={<OrganizationManagement />} />
        
        {/* 角色管理路由 */}
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/roles/*" element={<RoleManagement />} />
        
        {/* 菜单管理路由 */}
        <Route path="/menus" element={<MenuManagement />} />
        <Route path="/menus/*" element={<MenuManagement />} />
        
        {/* 字典管理路由 */}
        <Route path="/dicts" element={<DictManagement />} />
        <Route path="/dicts/*" element={<DictManagement />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
export { menuRoutes, userMenuRoutes } from './routes';
export { routeConfigs, getMenuConfig } from './config';
