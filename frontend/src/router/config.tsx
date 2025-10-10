import React from 'react';
import { lazy } from 'react';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
  SettingOutlined,
} from '@ant-design/icons';

// 懒加载页面组件
const Dashboard = lazy(() => import('../pages/Dashboard'));
const UserManagement = lazy(() => import('../pages/user/UserManagement'));
const OrganizationManagement = lazy(() => import('../pages/organization/OrganizationManagement'));
const RoleManagement = lazy(() => import('../pages/role/RoleManagement'));
const MenuManagement = lazy(() => import('../pages/menu/MenuManagement'));
const DictList = lazy(() => import('../pages/dict/DictList'));
const Debug = lazy(() => import('../pages/Debug'));

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  icon: React.ReactElement;
  key: string;
  children?: RouteConfig[];
}

export const routeConfigs: RouteConfig[] = [
  {
    path: '/dashboard',
    component: Dashboard,
    title: '仪表盘',
    icon: <DashboardOutlined />,
    key: '/dashboard',
  },
  {
    path: '/users',
    component: UserManagement,
    title: '用户管理',
    icon: <UserOutlined />,
    key: '/users',
  },
  {
    path: '/organizations',
    component: OrganizationManagement,
    title: '组织管理',
    icon: <TeamOutlined />,
    key: '/organizations',
  },
  {
    path: '/roles',
    component: RoleManagement,
    title: '角色管理',
    icon: <SafetyOutlined />,
    key: '/roles',
  },
  {
    path: '/menus',
    component: MenuManagement,
    title: '菜单管理',
    icon: <MenuOutlined />,
    key: '/menus',
  },
  {
    path: '/dict',
    component: DictList,
    title: '字典管理',
    icon: <SettingOutlined />,
    key: '/dict',
  },
  {
    path: '/debug',
    component: Debug,
    title: '调试页面',
    icon: <SettingOutlined />,
    key: '/debug',
  },
];

// 获取菜单配置
export const getMenuConfig = () => {
  return routeConfigs.map(route => ({
    key: route.key,
    icon: route.icon,
    label: route.title,
    path: route.path,
  }));
};
