import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  real_name: string;
  avatar: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  real_name?: string;
  status?: number;
}

export interface UpdateUserRequest {
  email?: string;
  phone?: string;
  real_name?: string;
  status?: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
}

export const userService = {
  getUsers: async (page = 1, pageSize = 10, organizationId?: number): Promise<UserListResponse> => {
    const params: any = { page, page_size: pageSize };
    if (organizationId) {
      params.organization_id = organizationId;
    }
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data.user;
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.user;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  assignRoles: async (id: number, roleIds: number[]): Promise<void> => {
    await api.post(`/users/${id}/roles`, { role_ids: roleIds });
  },
};
