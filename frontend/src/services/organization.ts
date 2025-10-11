import api from './api';

export interface Organization {
  id: string;
  name: string;
  code: string;
  parent_id?: string;
  path: string;
  sort: number;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
  parent?: Organization;
  children?: Organization[];
}

export interface CreateOrganizationRequest {
  name: string;
  code: string;
  parent_id?: string;
  sort?: number;
  status?: string;
  description?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  code?: string;
  parent_id?: string;
  sort?: number;
  status?: string;
  description?: string;
}

export const organizationService = {
  getOrganizations: async (): Promise<Organization[]> => {
    const response = await api.get('/organizations');
    return response.data.organizations;
  },

  getOrganizationTree: async (): Promise<Organization[]> => {
    const response = await api.get('/organizations/tree');
    return response.data.organizations;
  },

  getOrganization: async (id: string): Promise<Organization> => {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
  },

  createOrganization: async (data: CreateOrganizationRequest): Promise<Organization> => {
    const response = await api.post('/organizations', data);
    return response.data.organization;
  },

  updateOrganization: async (id: string, data: UpdateOrganizationRequest): Promise<Organization> => {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data.organization;
  },

  deleteOrganization: async (id: string): Promise<void> => {
    await api.delete(`/organizations/${id}`);
  },
};
