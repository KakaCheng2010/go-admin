import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMenuStore } from '../store/menuStore';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import DictItemList from '../pages/dict/DictItemList';
import Profile from '../pages/user/Profile';
import Layout from '../components/Layout';
import { generateRoutes } from './dynamicRoutes';

// 临时导入dict页面用于测试
import DictList from '../pages/dict/DictList';
import { LogManagement } from '../pages/log';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { userMenus, loadUserMenus, clearMenus } = useMenuStore();
  const [dynamicRoutes, setDynamicRoutes] = React.useState<React.ReactElement[]>([]);

  // 处理认证状态变化
  useEffect(() => {
    if (!isAuthenticated) {
      clearMenus();
      setDynamicRoutes([]);
    }
  }, [isAuthenticated, clearMenus]);

  // 处理菜单加载和路由生成
  useEffect(() => {
    if (isAuthenticated && user) {
      if (userMenus.length === 0) {
        loadUserMenus();
      } else {
        // 菜单已加载，生成路由
        const routes = generateRoutes(userMenus);
        setDynamicRoutes(routes);
      }
    }
  }, [isAuthenticated, user, userMenus, loadUserMenus]);
 
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logs" element={<LogManagement />} />
     
        <Route path="/dict/items/:dictId" element={<DictItemList />} />

        {/* 临时添加dict路由用于测试 */}
        <Route path="/dict" element={<DictList />} />
        {dynamicRoutes}
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
