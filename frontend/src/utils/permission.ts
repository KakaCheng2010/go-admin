import { useMenuStore } from '../store/menuStore';

/**
 * 从菜单中提取所有权限
 * @param menus 菜单列表
 * @returns 权限列表
 */
function extractPermissionsFromMenus(menus: any[]): string[] {
  const permissions: string[] = [];
  
  const traverse = (menuList: any[]) => {
    menuList.forEach(menu => {
      if (menu.permission && menu.permission.trim()) {
        permissions.push(menu.permission.trim());
      }
      if (menu.children && menu.children.length > 0) {
        traverse(menu.children);
      }
    });
  };
  
  traverse(menus);
  return permissions;
}

/**
 * 检查用户是否有指定权限
 * @param permission 权限标识
 * @returns 是否有权限
 */
export function hasPermission(permission: string): boolean {
  const { userMenus } = useMenuStore.getState();
  if (!userMenus || userMenus.length === 0) {
    return false;
  }
  
  const permissions = extractPermissionsFromMenus(userMenus);
  return permissions.includes(permission);
}

/**
 * 权限控制 Hook - 响应式权限检查
 * @param permission 权限标识
 * @returns 是否有权限
 */
export function usePermission(permission: string): boolean {
  const userMenus = useMenuStore(state => state.userMenus);
  if (!userMenus || userMenus.length === 0) {
    return false;
  }
  
  const permissions = extractPermissionsFromMenus(userMenus);
  return permissions.includes(permission);
}
