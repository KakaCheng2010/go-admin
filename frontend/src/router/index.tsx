import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMenuStore } from '../store/menuStore';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import DictItemList from '../pages/dict/DictItemList';
import Layout from '../components/Layout';
import { generateRoutes } from './dynamicRoutes';

// 临时导入dict页面用于测试
import DictList from '../pages/dict/DictList';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { userMenus, loadUserMenus, clearMenus } = useMenuStore();
  const [dynamicRoutes, setDynamicRoutes] = React.useState<React.ReactElement[]>([]);

  // 获取用户菜单并生成路由
  useEffect(() => {
    if (isAuthenticated && user) {
      // 如果菜单还没有加载，立即开始加载
      if (userMenus.length === 0) {
        loadUserMenus();
      } else {
        // 菜单已加载，生成路由
        const routes = generateRoutes(userMenus);
        setDynamicRoutes(routes);
      }
    } else {
      clearMenus();
      setDynamicRoutes([]);
    }
  }, [isAuthenticated, user, userMenus, loadUserMenus, clearMenus]);
 
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
     
        <Route path="/dict/items/:dictId" element={<DictItemList />} />

        {/* 临时添加dict路由用于测试 */}
        <Route path="/dict" element={<DictList />} />
        {dynamicRoutes}
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
