import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    real_name: string;
    avatar: string;
  };
  menus?: import('./menu').Menu[]; // 后端在登录时返回的用户菜单列表（可选）
}


export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },


  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
