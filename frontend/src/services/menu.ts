import api from './api';

export interface Menu {
  id: number;
  name: string;
  code: string;
  parent_id?: number;
  path: string;
  component: string;
  icon: string;
  type: number;
  sort: number;
  status: number;
  created_at: string;
  updated_at: string;
  parent?: Menu;
  children?: Menu[];
}

export interface CreateMenuRequest {
  name: string;
  code: string;
  parent_id?: number;
  path?: string;
  component?: string;
  icon?: string;
  type?: number;
  sort?: number;
  status?: number;
}

export interface UpdateMenuRequest {
  name?: string;
  code?: string;
  parent_id?: number;
  path?: string;
  component?: string;
  icon?: string;
  type?: number;
  sort?: number;
  status?: number;
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

  getMenu: async (id: number): Promise<Menu> => {
    const response = await api.get(`/menus/${id}`);
    return response.data;
  },

  createMenu: async (data: CreateMenuRequest): Promise<Menu> => {
    const response = await api.post('/menus', data);
    return response.data.menu;
  },

  updateMenu: async (id: number, data: UpdateMenuRequest): Promise<Menu> => {
    const response = await api.put(`/menus/${id}`, data);
    return response.data.menu;
  },

  deleteMenu: async (id: number): Promise<void> => {
    await api.delete(`/menus/${id}`);
  },
};
