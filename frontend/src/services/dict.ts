import api from './api';

export interface Dict {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
  items?: DictItem[];
}

export interface DictItem {
  id: number;
  dict_id: number;
  label: string;
  value: string;
  sort: number;
  status: number;
  created_at: string;
  updated_at: string;
  dict?: Dict;
}

export interface CreateDictRequest {
  name: string;
  code: string;
  description?: string;
  status?: number;
}

export interface UpdateDictRequest {
  name?: string;
  code?: string;
  description?: string;
  status?: number;
}

export interface CreateDictItemRequest {
  dict_id: number;
  label: string;
  value: string;
  sort?: number;
  status?: number;
}

export interface UpdateDictItemRequest {
  label?: string;
  value?: string;
  sort?: number;
  status?: number;
}

export const dictService = {
  // 字典管理
  getDicts: async (): Promise<Dict[]> => {
    const response = await api.get('/dicts');
    return response.data.dicts;
  },

  getDict: async (id: number): Promise<Dict> => {
    const response = await api.get(`/dicts/${id}`);
    return response.data;
  },

  getDictByCode: async (code: string): Promise<Dict> => {
    const response = await api.get(`/dicts/code/${code}`);
    return response.data;
  },

  createDict: async (data: CreateDictRequest): Promise<Dict> => {
    const response = await api.post('/dicts', data);
    return response.data.dict;
  },

  updateDict: async (id: number, data: UpdateDictRequest): Promise<Dict> => {
    const response = await api.put(`/dicts/${id}`, data);
    return response.data.dict;
  },

  deleteDict: async (id: number): Promise<void> => {
    await api.delete(`/dicts/${id}`);
  },

  // 字典项管理
  getDictItems: async (dictId: number): Promise<DictItem[]> => {
    const response = await api.get(`/dicts/${dictId}/items`);
    return response.data.items;
  },

  getDictItem: async (id: number): Promise<DictItem> => {
    const response = await api.get(`/dict-items/${id}`);
    return response.data;
  },

  createDictItem: async (data: CreateDictItemRequest): Promise<DictItem> => {
    const response = await api.post(`/dicts/${data.dict_id}/items`, data);
    return response.data.item;
  },

  updateDictItem: async (id: number, data: UpdateDictItemRequest): Promise<DictItem> => {
    const response = await api.put(`/dict-items/${id}`, data);
    return response.data.item;
  },

  deleteDictItem: async (id: number): Promise<void> => {
    await api.delete(`/dict-items/${id}`);
  },
};
