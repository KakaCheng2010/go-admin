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
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  real_name?: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', data);
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
