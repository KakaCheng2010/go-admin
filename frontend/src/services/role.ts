import api from './api';

export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  status: string;
  sort: number;
  created_at: string;
  updated_at: string;
  users?: any[];
  menus?: any[];
}

export interface CreateRoleRequest {
  name: string;
  code: string;
  description?: string;
  status?: string;
  sort?: number;
}

export interface UpdateRoleRequest {
  name?: string;
  code?: string;
  description?: string;
  status?: string;
  sort?: number;
}

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/roles');
    return response.data.roles;
  },

  getRole: async (id: number): Promise<Role> => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  createRole: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await api.post('/roles', data);
    return response.data.role;
  },

  updateRole: async (id: number, data: UpdateRoleRequest): Promise<Role> => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data.role;
  },

  deleteRole: async (id: number): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },

  assignMenus: async (id: number, menuIds: string[]): Promise<void> => {
    await api.post(`/roles/${id}/menus`, { menu_ids: menuIds });
  },

  assignUsers: async (id: number, userIds: string[]): Promise<void> => {
    await api.post(`/roles/${id}/users`, { user_ids: userIds });
  },
};
