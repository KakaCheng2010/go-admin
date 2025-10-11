import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { Menu } from '../services/menu';
import IconDisplay from '../components/IconDisplay';

// 动态组件加载器
const dynamicComponentLoader = (componentPath: string): React.ComponentType => {
  return lazy(() => {
    // 处理不同的路径格式
    let importPath = componentPath;
    
    // 移除开头的斜杠
    if (importPath.startsWith('/')) {
      importPath = importPath.slice(1);
    }
    
    // 确保路径以正确的格式结尾
    if (!importPath.endsWith('.tsx') && !importPath.endsWith('.ts')) {
      importPath = importPath + '.tsx';
    }
    
    // 构建完整的导入路径
    const fullPath = `../pages/${importPath}`;
    
    return import(fullPath).catch(error => {
      console.warn(`组件加载失败: ${fullPath}`, error);
      // 返回一个默认的错误组件
      return {
        default: () => (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>组件加载失败</h3>
            <p>无法加载组件: {componentPath}</p>
            <p>请检查组件路径是否正确</p>
          </div>
        )
      };
    });
  });
};



// 根据菜单配置生成路由组件
export const generateRoutes = (menus: Menu[]): React.ReactElement[] => {
  const routes: React.ReactElement[] = [];

  const processMenu = (menu: Menu) => {
    // 只处理菜单类型的项（type=1），且不是隐藏的
    if (menu.type === 1 && !menu.hidden && menu.route && menu.component) {
      // 动态加载组件
      const Component = dynamicComponentLoader(menu.component);
      routes.push(
        <Route 
          key={menu.id} 
          path={menu.route} 
          element={<Component />} 
        />
      );
    }
  };

  // 处理所有菜单
  menus.forEach(menu => processMenu(menu));

  return routes;
};

// 根据菜单配置生成菜单项（前端处理树形结构）
export const generateMenuItems = (menus: Menu[]): any[] => {
  // 创建菜单映射表
  const menuMap = new Map<string, any>();
  const rootMenus: any[] = [];

  // 第一遍：创建所有菜单项
  menus.forEach(menu => {
    if (menu.type === 1 && !menu.hidden) {
      // 直接使用IconDisplay组件渲染图标
      const iconElement = menu.icon ? <IconDisplay iconName={menu.icon} /> : null;
      
      const menuItem = {
        key: menu.route || menu.id,
        label: menu.name,
        icon: iconElement
      };
      
      menuMap.set(menu.id, menuItem);
    }
  });

  // 第二遍：构建树形结构
  menus.forEach(menu => {
    if (menu.type === 1 && !menu.hidden) {
      const menuItem = menuMap.get(menu.id);
      if (menuItem) {
        if (menu.parent_id) {
          // 子菜单，添加到父菜单
          const parent = menuMap.get(menu.parent_id);
          if (parent) {
            // 如果父菜单还没有children数组，则创建
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(menuItem);
          }
        } else {
          // 根菜单
          rootMenus.push(menuItem);
        }
      }
    }
  });


  return rootMenus;
};