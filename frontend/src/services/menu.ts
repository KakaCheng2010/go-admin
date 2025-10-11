import api from './api';

export interface Menu {
  id: string;
  name: string;
  code: string;
  parent_id?: string;
  path: string;
  component: string;
  icon: string;
  type: number;
  sort: number;
  status: string;
  created_at: string;
  updated_at: string;
  parent?: Menu;
  children?: Menu[];
}

export interface CreateMenuRequest {
  name: string;
  code: string;
  parent_id?: string;
  path?: string;
  component?: string;
  icon?: string;
  type?: number;
  sort?: number;
  status?: string;
}

export interface UpdateMenuRequest {
  name?: string;
  code?: string;
  parent_id?: string;
  path?: string;
  component?: string;
  icon?: string;
  type?: number;
  sort?: number;
  status?: string;
}

export const menuService = {
  getMenus: async (): Promise<Menu[]> => {
    const response = await api.get('/menus');
    return response.data.menus;
  },

  getMenuTree: async (): Promise<Menu[]> => {
    const response = await api.get('/menus/tree');
    return response.data.menus;
  },

  getMenu: async (id: string): Promise<Menu> => {
    const response = await api.get(`/menus/${id}`);
    return response.data;
  },

  createMenu: async (data: CreateMenuRequest): Promise<Menu> => {
    const response = await api.post('/menus', data);
    return response.data.menu;
  },

  updateMenu: async (id: string, data: UpdateMenuRequest): Promise<Menu> => {
    const response = await api.put(`/menus/${id}`, data);
    return response.data.menu;
  },

  deleteMenu: async (id: string): Promise<void> => {
    await api.delete(`/menus/${id}`);
  },
};
