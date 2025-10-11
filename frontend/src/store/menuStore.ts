import { create } from 'zustand';
import { Menu, menuService } from '../services/menu';

interface MenuState {
  userMenus: Menu[];
  loadUserMenus: () => Promise<void>;
  clearMenus: () => void;
}

// 菜单缓存键
const MENU_CACHE_KEY = 'user_menus_cache';
const CACHE_EXPIRY_KEY = 'user_menus_cache_expiry';
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export const useMenuStore = create<MenuState>((set, get) => ({
  userMenus: [],

  loadUserMenus: async () => {
    const state = get();
    
    // 如果已经有菜单数据，直接返回
    if (state.userMenus.length > 0) {
      return;
    }

    // 检查本地缓存
    try {
      const cachedMenus = localStorage.getItem(MENU_CACHE_KEY);
      const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      
      if (cachedMenus && cacheExpiry && Date.now() < parseInt(cacheExpiry)) {
        const menus = JSON.parse(cachedMenus);
        console.log('使用本地缓存的菜单数据:', menus.length);
        set({ userMenus: menus });
        return;
      }
    } catch (error) {
      console.warn('读取菜单缓存失败:', error);
    }

    console.log('开始从服务器加载菜单...');
    try {
      const menus = await menuService.getUserMenus();
      console.log('菜单加载成功:', menus.length);
      
      // 缓存菜单数据
      try {
        localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(menus));
        localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
        console.log('菜单数据已缓存');
      } catch (error) {
        console.warn('保存菜单缓存失败:', error);
      }
      
      set({ userMenus: menus });
    } catch (error: any) {
      console.error('加载菜单失败:', error);
      set({ userMenus: [] });
    }
  },

  clearMenus: () => {
    // 清除缓存
    try {
      localStorage.removeItem(MENU_CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
    } catch (error) {
      console.warn('清除菜单缓存失败:', error);
    }
    
    set({ userMenus: [] });
  },
}));
