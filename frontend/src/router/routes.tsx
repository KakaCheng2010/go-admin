import React from 'react';
import {
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { getMenuConfig } from './config';

export interface RouteItem {
  key: string;
  icon: React.ReactElement;
  label: string;
  path: string;
  component?: React.ComponentType;
  children?: RouteItem[];
}

export const menuRoutes = getMenuConfig();

export const userMenuRoutes = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: '个人资料',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
];
