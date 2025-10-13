import api from './api';
import { Role } from './role';

export interface User {
  id: string; // 雪花ID
  username: string;
  email?: string;
  phone: string;
  real_name: string;
  avatar: string;
  status: string;
  created_at: string;
  updated_at: string;
  roles?: Role[];
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  real_name?: string;
  organization_id?: string;
  status?: string;
}

export interface UpdateUserRequest {
  email?: string;
  phone?: string;
  real_name?: string;
  status?: string;
}

// 个人资料相关接口
export interface Profile {
  id: number;
  username: string;
  email?: string;
  phone: string;
  real_name: string;
  avatar: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  email?: string;
  phone: string;
  real_name: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
}

export const userService = {
  getUsers: async (page = 1, pageSize = 10, organizationId?: number, organizationPath?: string, searchParams?: any): Promise<UserListResponse> => {
    const params: any = { page, page_size: pageSize };
    if (organizationPath) {
      params.organization_path = organizationPath;
    } else if (organizationId) {
      params.organization_id = organizationId;
    }
    if (searchParams) {
      Object.assign(params, searchParams);
    }
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data.user;
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.user;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  batchDeleteUsers: async (ids: string[]): Promise<void> => {
    await api.delete('/users/batch', { data: { ids } });
  },

  importUsers: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/users/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  exportUsers: async (): Promise<Blob> => {
    const response = await api.get('/users/export', { responseType: 'blob' });
    return response.data;
  },

  assignRoles: async (id: string, roleIds: string[]): Promise<void> => {
    await api.post(`/users/${id}/roles`, { role_ids: roleIds });
  },

  // 个人资料相关方法
  getProfile: async (): Promise<Profile> => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<{ message: string; user: Profile }> => {
    const response = await api.put('/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ code: number; success: boolean; message: string }> => {
    const response = await api.post('/profile/change-password', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ message: string; avatar: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/profile/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
